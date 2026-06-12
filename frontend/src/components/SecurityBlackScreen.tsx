/**
 * SecurityBlackScreen Component
 * 
 * Displays a full-screen black overlay when security monitoring is active.
 * Shows a "Disable Security" button ONLY when security is manually activated.
 * During scheduled hours (10 PM - 7 AM), no disable option is shown.
 */

import React, { useState } from 'react';
import { supabase } from "../client";

interface SecurityBlackScreenProps {
  isManualOverride: boolean; // true if admin manually enabled, false if scheduled time
  onDisabled?: () => void; // Callback when security is disabled
}

export function SecurityBlackScreen({ 
  isManualOverride,
  onDisabled 
}: SecurityBlackScreenProps) {
  const [loading, setLoading] = useState(false);
  const kioskId = import.meta.env.VITE_KIOSK_ID || 'KIOSK_001';

  const handleDisableSecurity = async () => {
    if (!isManualOverride) {
      // Should never reach here, but safety check
      console.log('[Security Black Screen] Cannot disable during scheduled hours');
      return;
    }

    setLoading(true);
    
    try {
      console.log('[Security Black Screen] Disabling manual override...');
      
      // Turn off manual override in the database
      const { error } = await supabase
        .from('security_settings')
        .update({
          manual_override: false,
          updated_at: new Date().toISOString()
        })
        .eq('kiosk_id', kioskId);

      if (error) {
        console.error('[Security Black Screen] Failed to disable security:', error);
        alert('Failed to disable security. Please try again.');
        return;
      }

      console.log('[Security Black Screen] Security disabled successfully');
      
      // Notify parent component
      if (onDisabled) {
        onDisabled();
      }
      
    } catch (error) {
      console.error('[Security Black Screen] Error disabling security:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
      {/* Show disable button only for manual override, not during scheduled hours */}
      {isManualOverride && (
        <div className="flex flex-col items-center gap-8">
          {/* Security Active Indicator */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-red-600 rounded-full animate-pulse flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                  />
                </svg>
              </div>
            </div>
            <div className="text-white">
              <p className="text-2xl font-semibold">Security Mode Active</p>
              <p className="text-gray-400 text-sm">Motion and face detection enabled</p>
            </div>
          </div>

          {/* Disable Security Button */}
          <button
            onClick={handleDisableSecurity}
            disabled={loading}
            className={`
              px-12 py-4 
              bg-red-600 hover:bg-red-700 
              text-white text-xl font-semibold 
              rounded-lg 
              transition-all 
              shadow-lg shadow-red-900/50
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
            `}
          >
            {loading ? 'Disabling...' : 'Disable Security'}
          </button>

          <p className="text-gray-500 text-sm text-center max-w-md">
            Click above to disable security monitoring and return to the virtual try-on interface
          </p>
        </div>
      )}

      {/* During scheduled hours (10 PM - 7 AM), show only status message with no disable option */}
      {!isManualOverride && (
        <div className="flex flex-col items-center gap-6">
          {/* Security Active Indicator */}
          <div className="relative">
            <div className="w-20 h-20 bg-red-600 rounded-full animate-pulse flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
          </div>

          <div className="text-center text-white space-y-2">
            <p className="text-3xl font-bold">Security Mode Active</p>
            <p className="text-xl text-gray-400">Scheduled Hours: 10 PM - 7 AM</p>
            <p className="text-gray-500 text-sm mt-4">
              This kiosk is currently in security monitoring mode
            </p>
          </div>
        </div>
      )}
    </div>
  );
}