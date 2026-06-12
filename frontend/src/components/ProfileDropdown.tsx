import { useState, useRef, useEffect } from "react";
import { User, LogOut, Heart, History, Gift, Settings, UserCircle } from "lucide-react";

interface ProfileDropdownProps {
  userName: string;
  userEmail: string;
  onLogout: () => void;
  onEditProfile: () => void;
  onMyTryOns?: () => void;
  onWishlist?: () => void;
  onOffers?: () => void;
  onSettings?: () => void;
}

export default function ProfileDropdown({
  userName,
  userEmail,
  onLogout,
  onEditProfile,
  onMyTryOns,
  onWishlist,
  onOffers,
  onSettings,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get user initials
  const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button - Circle with Initials */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-[#7c563d] flex items-center justify-center hover:opacity-80 transition-opacity"
      >
        <span className="text-[#fcf5f1] font-['Montserrat:SemiBold'] text-lg">
          {getInitials(userName)}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-[#3d2817] rounded-2xl shadow-2xl overflow-hidden z-50">
          {/* User Info Header */}
          <div className="p-4 flex items-center gap-3 border-b border-[#5d4027]">
            <div className="w-12 h-12 rounded-full bg-[#7c563d] flex items-center justify-center flex-shrink-0">
              <span className="text-[#fcf5f1] font-['Montserrat:SemiBold'] text-lg">
                {getInitials(userName)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-['Montserrat:SemiBold'] text-[#fcf5f1] text-base truncate">
                {userName}
              </p>
              <p className="font-['Montserrat'] text-[#d4a574] text-sm truncate">
                {userEmail}
              </p>
            </div>
          </div>

          {/* Menu Options */}
          <div className="py-2">
            {/* My Profile */}
            <button
              onClick={() => {
                onEditProfile();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#5d4027] transition-colors"
            >
              <UserCircle className="w-5 h-5 text-[#d4a574]" />
              <span className="font-['Montserrat'] text-[#fcf5f1]">
                My Profile
              </span>
            </button>

            {/* My Try-Ons */}
            {onMyTryOns && (
              <button
                onClick={() => {
                  onMyTryOns();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#5d4027] transition-colors"
              >
                <History className="w-5 h-5 text-[#d4a574]" />
                <span className="font-['Montserrat'] text-[#fcf5f1]">
                  My Try-Ons
                </span>
              </button>
            )}

            {/* Wishlist */}
            {onWishlist && (
              <button
                onClick={() => {
                  onWishlist();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#5d4027] transition-colors"
              >
                <Heart className="w-5 h-5 text-[#d4a574]" />
                <span className="font-['Montserrat'] text-[#fcf5f1]">
                  Wishlist
                </span>
              </button>
            )}

            {/* Offers & Deals */}
            {onOffers && (
              <button
                onClick={() => {
                  onOffers();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#5d4027] transition-colors"
              >
                <Gift className="w-5 h-5 text-[#d4a574]" />
                <span className="font-['Montserrat'] text-[#fcf5f1]">
                  Offers & Deals
                </span>
              </button>
            )}

            {/* Settings */}
            {onSettings && (
              <button
                onClick={() => {
                  onSettings();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#5d4027] transition-colors"
              >
                <Settings className="w-5 h-5 text-[#d4a574]" />
                <span className="font-['Montserrat'] text-[#fcf5f1]">
                  Settings
                </span>
              </button>
            )}

            {/* Logout */}
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#5d4027] transition-colors border-t border-[#5d4027] mt-2"
            >
              <LogOut className="w-5 h-5 text-[#d4a574]" />
              <span className="font-['Montserrat'] text-[#fcf5f1]">
                Log out
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-[#5d4027] text-center">
            <p className="text-[#d4a574] text-xs font-['Montserrat']">
              © 2025 Alankara AI
            </p>
          </div>
        </div>
      )}
    </div>
  );
}