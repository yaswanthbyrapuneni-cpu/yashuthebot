// ProfileSetup.tsx - Updated with Dropdown Menus
import React, { useState, useRef, useEffect } from "react";
import { User, Phone, Mail, Heart, ChevronDown, X, Loader2 } from "lucide-react";
import { supabase } from '../client';

interface ProfileSetupProps {
  userId: string;
  userEmail?: string;
  userPhone?: string;
  onComplete: () => void;
}

// Custom Dropdown Component
interface DropdownProps {
  label: string;
  icon?: React.ReactNode;
  options: string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  multiSelect?: boolean;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  icon,
  options,
  selectedValues,
  onSelectionChange,
  multiSelect = false,
  placeholder = "Select options..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (multiSelect) {
      if (selectedValues.includes(option)) {
        onSelectionChange(selectedValues.filter(v => v !== option));
      } else {
        onSelectionChange([...selectedValues, option]);
      }
    } else {
      onSelectionChange([option]);
      setIsOpen(false);
    }
  };

  const removeValue = (value: string) => {
    onSelectionChange(selectedValues.filter(v => v !== value));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-[#2a120a] mb-2 font-['Inter']">
        {icon && <span className="inline-block mr-2">{icon}</span>}
        {label}
      </label>

      {/* Selected Values Display */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedValues.map(value => (
            <span
              key={value}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] 
                       text-[#2a120a] rounded-full text-sm font-medium"
            >
              {value}
              {multiSelect && (
                <button
                  onClick={() => removeValue(value)}
                  className="hover:bg-[#2a120a]/10 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border border-[#7c563d]/30 rounded-lg
                 flex items-center justify-between text-left
                 hover:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]
                 transition-all"
      >
        <span className={`${selectedValues.length === 0 ? 'text-[#7c563d]/50' : 'text-[#2a120a]'}`}>
          {selectedValues.length === 0 
            ? placeholder 
            : multiSelect 
              ? `${selectedValues.length} selected` 
              : selectedValues[0]
          }
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-[#7c563d] transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#7c563d]/20 rounded-lg 
                      shadow-lg max-h-60 overflow-y-auto">
          {options.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={`w-full px-4 py-3 text-left hover:bg-[#f4e4c1]/20 transition-colors
                       flex items-center justify-between
                       ${selectedValues.includes(option) ? 'bg-[#f4e4c1]/40 text-[#2a120a] font-medium' : 'text-[#2a120a]'}
                       border-b border-[#7c563d]/10 last:border-b-0`}
            >
              <span>{option}</span>
              {selectedValues.includes(option) && (
                <svg className="w-5 h-5 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ProfileSetup({ 
  userId, 
  userEmail, 
  userPhone, 
  onComplete 
}: ProfileSetupProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState(userPhone || "");
  const [email, setEmail] = useState(userEmail || "");
  const [favoriteCategories, setFavoriteCategories] = useState<string[]>([]);
  const [preferredMetal, setPreferredMetal] = useState<string[]>([]);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = ["Earrings", "Necklaces", "Rings", "Bangles", "Pendants", "Mangalsutra"];
  const metals = ["Gold", "Silver", "Diamond", "Platinum"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate
      if (!fullName.trim()) {
        setError("Please enter your name");
        setIsLoading(false);
        return;
      }

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('customer_profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('customer_profiles')
          .update({
            full_name: fullName,
            phone_number: phone || null,
            email: email || null,
            favorite_categories: favoriteCategories,
            preferred_metal: preferredMetal.length > 0 ? preferredMetal[0] : null,
            email_notifications: emailNotifications,
            whatsapp_notifications: whatsappNotifications,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (updateError) throw updateError;
      } else {
        // Insert new profile
        const { error: insertError } = await supabase
          .from('customer_profiles')
          .insert({
            id: userId,
            full_name: fullName,
            phone_number: phone || null,
            email: email || null,
            favorite_categories: favoriteCategories,
            preferred_metal: preferredMetal.length > 0 ? preferredMetal[0] : null,
            email_notifications: emailNotifications,
            whatsapp_notifications: whatsappNotifications,
            created_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      console.log('[ProfileSetup] Profile saved successfully');
      onComplete();
    } catch (err: any) {
      console.error('[ProfileSetup] Error:', err);
      setError(err.message || "Failed to save profile. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#2a120a]/30 via-[#2a120a]/50 to-[#2a120a]/70 p-4">
      {/* Profile Setup Card */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] rounded-full mb-4">
              <User className="w-8 h-8 text-[#2a120a]" />
            </div>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#2a120a] mb-2">
              Complete Your Profile
            </h2>
            <p className="font-['Inter'] text-sm text-[#7c563d]">
              Help us personalize your jewelry shopping experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-[#2a120a] mb-2 font-['Inter']">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#7c563d]" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-[#7c563d]/30 rounded-lg 
                           bg-white text-[#2a120a] placeholder-[#7c563d]/50
                           focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Phone Number (if not already provided) */}
            {!userPhone && (
              <div>
                <label className="block text-sm font-medium text-[#2a120a] mb-2 font-['Inter']">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-[#7c563d]" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-[#7c563d]/30 rounded-lg 
                             bg-white text-[#2a120a] placeholder-[#7c563d]/50
                             focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                    placeholder="+91 9876543210"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Email (if not already provided) */}
            {!userEmail && (
              <div>
                <label className="block text-sm font-medium text-[#2a120a] mb-2 font-['Inter']">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#7c563d]" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-[#7c563d]/30 rounded-lg 
                             bg-white text-[#2a120a] placeholder-[#7c563d]/50
                             focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                    placeholder="your.email@example.com"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Favorite Categories - DROPDOWN */}
            <Dropdown
              label="What jewelry do you love?"
              icon={<Heart className="w-4 h-4 text-[#d4af37]" />}
              options={categories}
              selectedValues={favoriteCategories}
              onSelectionChange={setFavoriteCategories}
              multiSelect={true}
              placeholder="Select your favorite categories..."
            />

            {/* Preferred Metal - DROPDOWN (Single Selection) */}
            <Dropdown
              label="Preferred Metal Type"
              options={metals}
              selectedValues={preferredMetal}
              onSelectionChange={setPreferredMetal}
              multiSelect={false}
              placeholder="Select your preferred metal..."
            />

            {/* Marketing Preferences */}
            <div className="border-t border-[#7c563d]/20 pt-6">
              <label className="block text-sm font-medium text-[#2a120a] mb-3 font-['Inter']">
                Stay Updated with Offers & New Arrivals
              </label>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    disabled={isLoading}
                    className="w-5 h-5 text-[#d4af37] border-[#7c563d]/30 rounded focus:ring-[#d4af37] 
                             cursor-pointer"
                  />
                  <span className="ml-3 text-sm text-[#2a120a] font-['Inter'] group-hover:text-[#d4af37] transition-colors">
                    📧 Email notifications
                  </span>
                </label>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={whatsappNotifications}
                    onChange={(e) => setWhatsappNotifications(e.target.checked)}
                    disabled={isLoading}
                    className="w-5 h-5 text-[#d4af37] border-[#7c563d]/30 rounded focus:ring-[#d4af37]
                             cursor-pointer"
                  />
                  <span className="ml-3 text-sm text-[#2a120a] font-['Inter'] group-hover:text-[#d4af37] transition-colors">
                    💬 WhatsApp updates
                  </span>
                </label>
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
                       text-[#2a120a] font-semibold py-4 px-4 rounded-lg
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
                  Saving Profile...
                </>
              ) : (
                'Complete Setup & Start Shopping'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 text-white/80 text-sm">
          <p className="font-['Inter']">© 2025 AlankaraAI. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}