// src/components/Login.tsx
import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import imgLuxuryBackgroundGoldGradientDesign2 from "figma:asset/56eec9f31f5047398a011db41854b5a8c8a20924.png";

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hardcoded credentials
  const VALID_EMAIL = "Alankaraai@gmail.com";
  const VALID_PASSWORD = "Admin@1225";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate a brief loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      onLoginSuccess();
    } else {
      setError("Invalid email or password. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background with luxury gold gradient */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${imgLuxuryBackgroundGoldGradientDesign2})`,
        }}
      >
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a120a]/30 via-[#2a120a]/50 to-[#2a120a]/70" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Logo/Branding Section */}
          <div className="text-center mb-8">
            <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#2a120a] mb-2">
              AlankaraAI
            </h1>
            <p className="font-['Playfair_Display'] text-lg text-[#7c563d] font-light">
              Virtual Try-On Experience
            </p>
            <div className="mt-4 h-1 w-20 bg-gradient-to-r from-[#d4af37] via-[#f4e4c1] to-[#d4af37] mx-auto rounded-full" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
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

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
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
                       font-['Playfair_Display'] text-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg 
                    className="animate-spin h-5 w-5 mr-3" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                      fill="none"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 text-center text-sm text-[#7c563d]">
            <p className="font-['Inter']">
              Secure access to AlankaraAI kiosk system
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white/80 text-sm">
          <p className="font-['Inter']">
            © 2025 AlankaraAI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}