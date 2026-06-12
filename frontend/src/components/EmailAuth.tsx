// src/components/auth/EmailAuth.tsx
import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import { supabase } from '../client';

interface EmailAuthProps {
  mode: 'login' | 'signup';
  onSuccess: (userId: string, isNewUser: boolean) => void;
}

export default function EmailAuth({ mode, onSuccess }: EmailAuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        // Validation for signup
        if (password.length < 6) {
          setError("Password must be at least 6 characters long");
          setIsLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }

        // Sign up with Supabase
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          // Check if email confirmation is required
          if (data.user.identities && data.user.identities.length === 0) {
            setError("This email is already registered. Please login instead.");
            setIsLoading(false);
            return;
          }

          setSuccessMessage(
            "Account created! Please check your email to verify your account before logging in."
          );
          
          // Wait 3 seconds then switch to login
          setTimeout(() => {
            setEmail("");
            setPassword("");
            setConfirmPassword("");
          }, 3000);
        }
      } else {
        // Login with Supabase
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (data.user) {
          console.log('[EmailAuth] Login successful:', data.user.id);
          onSuccess(data.user.id, false);
        }
      }
    } catch (err: any) {
      console.error('[EmailAuth] Error:', err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email Field */}
      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-[#2a120a] mb-2 font-['Inter']"
        >
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-[#7c563d]" />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-[#7c563d]/30 rounded-lg 
                     bg-white text-[#2a120a] placeholder-[#7c563d]/50
                     focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent
                     transition-all duration-200"
            placeholder="your.email@example.com"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label 
          htmlFor="password" 
          className="block text-sm font-medium text-[#2a120a] mb-2 font-['Inter']"
        >
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-[#7c563d]" />
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-10 pr-12 py-3 border border-[#7c563d]/30 rounded-lg 
                     bg-white text-[#2a120a] placeholder-[#7c563d]/50
                     focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent
                     transition-all duration-200"
            placeholder={mode === 'signup' ? "At least 6 characters" : "Enter your password"}
            required
            disabled={isLoading}
            minLength={mode === 'signup' ? 6 : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7c563d] hover:text-[#2a120a] transition-colors"
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Password (Signup only) */}
      {mode === 'signup' && (
        <div>
          <label 
            htmlFor="confirmPassword" 
            className="block text-sm font-medium text-[#2a120a] mb-2 font-['Inter']"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-[#7c563d]" />
            </div>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-[#7c563d]/30 rounded-lg 
                       bg-white text-[#2a120a] placeholder-[#7c563d]/50
                       focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent
                       transition-all duration-200"
              placeholder="Re-enter your password"
              required
              disabled={isLoading}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {successMessage}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-[#d4af37] via-[#f4e4c1] to-[#d4af37] 
                 text-[#2a120a] font-semibold py-3 px-4 rounded-lg
                 hover:shadow-lg hover:scale-[1.02] 
                 active:scale-[0.98]
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-all duration-200
                 font-['Playfair_Display'] text-lg
                 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
          </>
        ) : (
          mode === 'signup' ? 'Create Account' : 'Sign In'
        )}
      </button>

      {/* Forgot Password (Login only) */}
      {mode === 'login' && (
        <div className="text-center">
          <button
            type="button"
            className="text-sm text-[#7c563d] hover:text-[#d4af37] transition-colors font-['Inter']"
            onClick={async () => {
              if (!email) {
                setError("Please enter your email address first");
                return;
              }
              setIsLoading(true);
              try {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                  redirectTo: `${window.location.origin}/reset-password`,
                });
                if (error) throw error;
                setSuccessMessage("Password reset link sent to your email!");
              } catch (err: any) {
                setError(err.message);
              } finally {
                setIsLoading(false);
              }
            }}
          >
            Forgot your password?
          </button>
        </div>
      )}
    </form>
  );
}