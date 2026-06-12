// src/components/auth/PhoneAuth.tsx
import React, { useState } from "react";
import { Phone, Loader2, Check } from "lucide-react";
import { supabase } from '../client';

interface PhoneAuthProps {
  mode: 'login' | 'signup';
  onSuccess: (userId: string, isNewUser: boolean) => void;
}

export default function PhoneAuth({ mode, onSuccess }: PhoneAuthProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // If it doesn't start with country code, add +91 (India)
    if (cleaned.length > 0 && !cleaned.startsWith('91')) {
      return '+91' + cleaned;
    } else if (cleaned.length > 0) {
      return '+' + cleaned;
    }
    return '';
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // Validate phone number format
      if (formattedPhone.length < 12) {
        setError("Please enter a valid 10-digit phone number");
        setIsLoading(false);
        return;
      }

      console.log('[PhoneAuth] Sending OTP to:', formattedPhone);

      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (otpError) throw otpError;

      setOtpSent(true);
      setSuccessMessage("OTP sent successfully! Please check your phone.");
    } catch (err: any) {
      console.error('[PhoneAuth] OTP send error:', err);
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);

      console.log('[PhoneAuth] Verifying OTP for:', formattedPhone);

      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      });

      if (verifyError) throw verifyError;

      if (data.user) {
        console.log('[PhoneAuth] OTP verified successfully:', data.user.id);
        
        // Check if this is a new user
        const isNewUser = data.user.created_at === data.user.updated_at;
        
        onSuccess(data.user.id, isNewUser);
      }
    } catch (err: any) {
      console.error('[PhoneAuth] OTP verify error:', err);
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp("");
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);

      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (otpError) throw otpError;

      setSuccessMessage("OTP resent successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (otpSent) {
    // OTP Verification Screen
    return (
      <form onSubmit={handleVerifyOTP} className="space-y-4">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-[#7c563d] font-['Inter']">
            We've sent a 6-digit code to
          </p>
          <p className="text-base font-semibold text-[#2a120a] font-['Inter']">
            {phoneNumber}
          </p>
          <button
            type="button"
            onClick={() => {
              setOtpSent(false);
              setOtp("");
              setError("");
              setSuccessMessage("");
            }}
            className="text-sm text-[#d4af37] hover:underline mt-1"
          >
            Change number
          </button>
        </div>

        {/* OTP Input */}
        <div>
          <label 
            htmlFor="otp" 
            className="block text-sm font-medium text-[#2a120a] mb-2 font-['Inter'] text-center"
          >
            Enter 6-Digit OTP
          </label>
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="block w-full px-4 py-3 border border-[#7c563d]/30 rounded-lg 
                     bg-white text-[#2a120a] text-center text-2xl tracking-widest
                     placeholder-[#7c563d]/50
                     focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent
                     transition-all duration-200"
            placeholder="000000"
            required
            disabled={isLoading}
            autoComplete="one-time-code"
          />
        </div>

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

        {/* Verify Button */}
        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
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
              Verifying...
            </>
          ) : (
            'Verify OTP'
          )}
        </button>

        {/* Resend OTP */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={isLoading}
            className="text-sm text-[#7c563d] hover:text-[#d4af37] transition-colors font-['Inter'] disabled:opacity-50"
          >
            Didn't receive code? Resend OTP
          </button>
        </div>
      </form>
    );
  }

  // Phone Number Entry Screen
  return (
    <form onSubmit={handleSendOTP} className="space-y-4">
      {/* Phone Number Field */}
      <div>
        <label 
          htmlFor="phone" 
          className="block text-sm font-medium text-[#2a120a] mb-2 font-['Inter']"
        >
          Phone Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-[#7c563d]" />
          </div>
          <div className="absolute inset-y-0 left-10 flex items-center pl-2 pointer-events-none">
            <span className="text-[#7c563d] font-['Inter']">+91</span>
          </div>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
            className="block w-full pl-20 pr-3 py-3 border border-[#7c563d]/30 rounded-lg 
                     bg-white text-[#2a120a] placeholder-[#7c563d]/50
                     focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent
                     transition-all duration-200"
            placeholder="9876543210"
            required
            disabled={isLoading}
            maxLength={10}
          />
        </div>
        <p className="mt-1 text-xs text-[#7c563d] font-['Inter']">
          We'll send you a verification code via SMS
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Send OTP Button */}
      <button
        type="submit"
        disabled={isLoading || phoneNumber.length !== 10}
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
            Sending OTP...
          </>
        ) : (
          'Send OTP'
        )}
      </button>

      {/* Privacy Note */}
      <p className="text-xs text-center text-[#7c563d] font-['Inter']">
        By continuing, you agree to receive SMS notifications from AlankaraAI
      </p>
    </form>
  );
}