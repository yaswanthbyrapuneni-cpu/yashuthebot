// AuthModal.tsx
import React, { useState } from "react";
import { X } from "lucide-react";
import EmailAuth from "./EmailAuth";
import PhoneAuth from "./PhoneAuth";
import imgLuxuryBackgroundGoldGradientDesign2 from "figma:asset/56eec9f31f5047398a011db41854b5a8c8a20924.png";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (userId: string, isNewUser: boolean) => void;
  defaultView?: 'login' | 'signup';
}

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onAuthSuccess,
  defaultView = 'login'
}: AuthModalProps) {
  const [authView, setAuthView] = useState<'login' | 'signup'>(defaultView);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  if (!isOpen) return null;

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
      <div className="relative z-10 w-full max-w-xl mx-4 sm:mx-6 md:mx-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 sm:p-10 md:p-12">
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

          {/* Auth Method Toggle: Email / Phone (Subtle) */}
          <div className="mb-4">
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setAuthMethod('email')}
                className={`px-4 py-2 rounded-lg font-['Inter'] text-sm font-medium transition-all ${
                  authMethod === 'email'
                    ? 'bg-[#d4af37]/20 text-[#2a120a]'
                    : 'text-[#7c563d] hover:bg-[#f4e4c1]/20'
                }`}
              >
                📧 Email
              </button>
              <button
                onClick={() => setAuthMethod('phone')}
                className={`px-4 py-2 rounded-lg font-['Inter'] text-sm font-medium transition-all ${
                  authMethod === 'phone'
                    ? 'bg-[#d4af37]/20 text-[#2a120a]'
                    : 'text-[#7c563d] hover:bg-[#f4e4c1]/20'
                }`}
              >
                📱 Phone
              </button>
            </div>
          </div>

          {/* Auth Forms */}
          {authMethod === 'email' ? (
            <EmailAuth 
              mode={authView}
              onSuccess={onAuthSuccess}
            />
          ) : (
            <PhoneAuth 
              mode={authView}
              onSuccess={onAuthSuccess}
            />
          )}

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[#7c563d] font-['Inter']">
              {authView === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setAuthView('signup')}
                    className="text-[#d4af37] font-semibold hover:underline"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setAuthView('login')}
                    className="text-[#d4af37] font-semibold hover:underline"
                  >
                    Login
                  </button>
                </>
              )}
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