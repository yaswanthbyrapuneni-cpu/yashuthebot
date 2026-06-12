import { useEffect, useState } from "react";
import { X, Bell, Mail, MessageSquare, Lock, Eye, EyeOff, Save } from "lucide-react";
import { supabase } from '../client';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function Settings({ isOpen, onClose, userId }: SettingsProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isOpen && userId) {
      loadSettings();
    }
  }, [isOpen, userId]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('email_notifications, whatsapp_notifications, sms_notifications')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      if (data) {
        setEmailNotifications(data.email_notifications ?? true);
        setWhatsappNotifications(data.whatsapp_notifications ?? true);
        setSmsNotifications(data.sms_notifications ?? false);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMessage("");
    
    try {
      const { error } = await supabase
        .from('customer_profiles')
        .update({
          email_notifications: emailNotifications,
          whatsapp_notifications: whatsappNotifications,
          sms_notifications: smsNotifications,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      
      setSuccessMessage("Settings saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl mt-20 mb-20 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#f6e1d2] rounded-t-2xl shadow-2xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-['Playfair_Display'] text-[#2a120a] text-3xl">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#7c563d]/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-[#7C563D]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-2xl shadow-2xl p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#7c563d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[#7C563D] text-xl">Loading settings...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Notification Preferences */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-5 h-5 text-[#7c563d]" />
                  <h3 className="font-['Playfair_Display'] text-[#2a120a] text-2xl">
                    Notification Preferences
                  </h3>
                </div>
                
                <div className="space-y-4 bg-[#fcf8f6] rounded-xl p-6 border border-[#ecbd9f]">
                  {/* Email Notifications */}
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#7c563d]" />
                      <div>
                        <p className="font-['Montserrat:Medium'] text-[#2a120a]">
                          Email Notifications
                        </p>
                        <p className="font-['Montserrat'] text-[#7c563d] text-sm">
                          Receive updates and offers via email
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#d4af37] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c563d]"></div>
                    </div>
                  </label>

                  {/* WhatsApp Notifications */}
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-[#7c563d]" />
                      <div>
                        <p className="font-['Montserrat:Medium'] text-[#2a120a]">
                          WhatsApp Updates
                        </p>
                        <p className="font-['Montserrat'] text-[#7c563d] text-sm">
                          Get instant updates on WhatsApp
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={whatsappNotifications}
                        onChange={(e) => setWhatsappNotifications(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#d4af37] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c563d]"></div>
                    </div>
                  </label>

                  {/* SMS Notifications */}
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-[#7c563d]" />
                      <div>
                        <p className="font-['Montserrat:Medium'] text-[#2a120a]">
                          SMS Notifications
                        </p>
                        <p className="font-['Montserrat'] text-[#7c563d] text-sm">
                          Receive SMS for order updates
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={smsNotifications}
                        onChange={(e) => setSmsNotifications(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#d4af37] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c563d]"></div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Privacy & Security */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-5 h-5 text-[#7c563d]" />
                  <h3 className="font-['Playfair_Display'] text-[#2a120a] text-2xl">
                    Privacy & Security
                  </h3>
                </div>
                
                <div className="bg-[#fcf8f6] rounded-xl p-6 border border-[#ecbd9f]">
                  <button
                    onClick={() => {
                      // TODO: Implement password change
                      alert('Password change functionality coming soon!');
                    }}
                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-[#f6e1d2] rounded-lg transition-colors border border-[#ecbd9f]"
                  >
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-[#7c563d]" />
                      <span className="font-['Montserrat:Medium'] text-[#2a120a]">
                        Change Password
                      </span>
                    </div>
                    <span className="text-[#7c563d]">→</span>
                  </button>
                </div>
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                  <p className="font-['Montserrat:Medium'] text-green-700">
                    ✓ {successMessage}
                  </p>
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] hover:shadow-lg text-[#2a120a] font-['Montserrat:SemiBold'] py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#2a120a] border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}