/**
 * SecuritySettings Component
 * Allows admin to enable/disable security monitoring from the dashboard
 * 
 * FIXED: When clicking "Enable Security", it now automatically enables manual_override
 * so the black screen appears immediately instead of waiting for scheduled hours
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export function SecuritySettings() {
  const [securityEnabled, setSecurityEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [manualOverride, setManualOverride] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  
  const kioskId = import.meta.env.VITE_KIOSK_ID || 'KIOSK_001';

  useEffect(() => {
    loadSettings();
    
    // Set up real-time subscription to database changes
    const channel = supabase
      .channel('security-settings-ui')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'security_settings',
          filter: `kiosk_id=eq.${kioskId}`
        },
        (payload) => {
          console.log('[Security Settings] Real-time update:', payload.new);
          setSecurityEnabled(payload.new.security_mode_enabled);
          setAutoMode(payload.new.auto_mode_enabled);
          setManualOverride(payload.new.manual_override);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [kioskId]);

  const loadSettings = async () => {
    try {
      console.log('[Security Settings] Loading settings for:', kioskId);
      
      const { data, error } = await supabase
        .from('security_settings')
        .select('*')
        .eq('kiosk_id', kioskId)
        .single();

      if (data && !error) {
        console.log('[Security Settings] Loaded from Supabase:', data);
        setSecurityEnabled(data.security_mode_enabled || false);
        setAutoMode(data.auto_mode_enabled !== false);
        setManualOverride(data.manual_override || false);
      } else {
        // Fallback to local settings API
        const res = await fetch(`http://localhost:5000/api/security/settings?kiosk_id=${kioskId}`);
        if (res.ok) {
          const localData = await res.json();
          console.log('[Security Settings] Loaded from local fallback:', localData);
          setSecurityEnabled(localData.security_mode_enabled || false);
          setAutoMode(localData.auto_mode_enabled !== false);
          setManualOverride(localData.manual_override || false);
        }
      }
    } catch (error) {
      console.warn('[Security Settings] Supabase load failed, trying local fallback...', error);
      try {
        const res = await fetch(`http://localhost:5000/api/security/settings?kiosk_id=${kioskId}`);
        if (res.ok) {
          const localData = await res.json();
          setSecurityEnabled(localData.security_mode_enabled || false);
          setAutoMode(localData.auto_mode_enabled !== false);
          setManualOverride(localData.manual_override || false);
        }
      } catch (localErr) {
        console.error('[Security Settings] Local fallback failed too:', localErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    try {
      const { error } = await supabase
        .from('security_settings')
        .insert({
          kiosk_id: kioskId,
          security_mode_enabled: false,
          auto_mode_enabled: true,
          manual_override: false,
          start_time: '22:00:00', // 10 PM
          end_time: '07:00:00',   // 7 AM
          siren_active: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('[Security Settings] Failed to create default:', error);
        return;
      }

      console.log('[Security Settings] Default settings created');
      await loadSettings();
    } catch (error) {
      console.error('[Security Settings] Create default error:', error);
    }
  };

  const handleToggleSecurity = async () => {
    setLoading(true);
    setMessage(null);
    const newState = !securityEnabled;
    const newManualOverride = newState ? true : false;
    
    try {
      console.log('[Security Settings] Toggling security to:', newState);
      
      const { error } = await supabase
        .from('security_settings')
        .upsert({
          kiosk_id: kioskId,
          security_mode_enabled: newState,
          auto_mode_enabled: autoMode,
          manual_override: newManualOverride,
          start_time: '22:00:00',
          end_time: '07:00:00',
          siren_active: false,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'kiosk_id'
        });

      if (error) throw error;

      setSecurityEnabled(newState);
      setManualOverride(newManualOverride);
      setMessage(newState ? '✅ Security enabled! Black screen is now active.' : '✅ Security disabled.');
      setTimeout(() => setMessage(null), 5000);
      
    } catch (error) {
      console.warn('[Security Settings] Supabase toggle failed, trying local fallback...', error);
      try {
        const res = await fetch(`http://localhost:5000/api/security/settings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kiosk_id: kioskId,
            security_mode_enabled: newState,
            manual_override: newManualOverride
          })
        });
        if (res.ok) {
          setSecurityEnabled(newState);
          setManualOverride(newManualOverride);
          setMessage(newState ? '✅ Security enabled (Local mode)! Black screen active.' : '✅ Security disabled (Local mode).');
        } else {
          throw new Error("Local save failed");
        }
      } catch (localErr) {
        console.error('[Security Settings] Local fallback update failed:', localErr);
        setMessage('❌ Failed to update settings. Please try again.');
      }
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoModeChange = async (checked: boolean) => {
    setAutoMode(checked);
    if (checked) {
      setManualOverride(false);
    }
    const nextOverride = checked ? false : manualOverride;

    try {
      const { error } = await supabase
        .from('security_settings')
        .update({
          auto_mode_enabled: checked,
          manual_override: nextOverride,
          updated_at: new Date().toISOString()
        })
        .eq('kiosk_id', kioskId);
        
      if (error) throw error;
      console.log('[Security Settings] Auto mode updated in Supabase:', checked);
    } catch (error) {
      console.warn('[Security Settings] Supabase auto mode update failed, trying local fallback...', error);
      try {
        await fetch(`http://localhost:5000/api/security/settings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kiosk_id: kioskId,
            auto_mode_enabled: checked,
            manual_override: nextOverride
          })
        });
      } catch (localErr) {
        console.error('[Security Settings] Local fallback auto mode update failed:', localErr);
      }
    }
  };

  const handleManualOverrideChange = async (checked: boolean) => {
    setManualOverride(checked);
    
    try {
      const { error } = await supabase
        .from('security_settings')
        .update({
          manual_override: checked,
          updated_at: new Date().toISOString()
        })
        .eq('kiosk_id', kioskId);
        
      if (error) throw error;
      console.log('[Security Settings] Manual override updated in Supabase:', checked);
      setMessage(checked ? '✅ Manual override enabled - Black screen active.' : '✅ Manual override disabled.');
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      console.warn('[Security Settings] Supabase manual override update failed, trying local fallback...', error);
      try {
        const res = await fetch(`http://localhost:5000/api/security/settings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kiosk_id: kioskId,
            manual_override: checked
          })
        });
        if (res.ok) {
          setMessage(checked ? '✅ Manual override enabled (Local mode)!' : '✅ Manual override disabled (Local mode).');
        } else {
          throw new Error("Local save failed");
        }
      } catch (localErr) {
        console.error('[Security Settings] Local fallback update failed:', localErr);
      }
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const getStatusText = () => {
    if (!securityEnabled) {
      return '⚪ Disabled';
    }
    
    if (manualOverride) {
      return '🔴 Always Active (Manual Override)';
    }
    
    if (autoMode) {
      return '🟢 Active (10 PM - 7 AM)';
    }
    
    return '🟢 Active';
  };

  const getStatusColor = () => {
    if (!securityEnabled) return 'from-gray-50 to-gray-100';
    if (manualOverride) return 'from-red-50 to-orange-50';
    return 'from-blue-50 to-indigo-50';
  };

  return (
    <div className={`box-border content-stretch flex flex-col gap-4 items-start px-4 sm:px-8 md:px-16 lg:px-[96px] py-6 relative w-full bg-gradient-to-r ${getStatusColor()} border-b border-gray-200`}>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0 size-12 md:size-16">
            <svg className={`block size-full ${securityEnabled ? 'text-red-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="font-['Inter:Semi_Bold',_sans-serif] font-semibold text-[#2a120a] text-lg md:text-2xl">
              Security Monitoring
            </p>
            <p className="font-['Inter:Regular',_sans-serif] text-[#7c563d] text-sm md:text-base">
              {getStatusText()}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleToggleSecurity}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            securityEnabled
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Updating...' : securityEnabled ? 'Disable Security' : 'Enable Security'}
        </button>
      </div>
      
      {message && (
        <div className="w-full bg-white rounded-lg p-3 border border-blue-200">
          <p className="text-sm text-gray-700">{message}</p>
        </div>
      )}
      
      {securityEnabled && (
        <div className="w-full bg-white rounded-lg p-4 border border-red-200">
          <p className="text-sm text-gray-600 mb-4">
            ⚠️ <strong>Security Mode Active:</strong> Motion and face detection will send email + call alerts.
            {manualOverride 
              ? ' Virtual Try-On is currently DISABLED (Manual Override).' 
              : autoMode 
                ? ' Monitoring from 10 PM to 7 AM.' 
                : ' Monitoring is always active.'}
          </p>
          
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoMode}
                onChange={(e) => handleAutoModeChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                🕐 Auto mode (10 PM - 7 AM only)
              </span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={manualOverride}
                onChange={(e) => handleManualOverrideChange(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">
                🔴 Manual Override (Always active, blocks Virtual Try-On)
              </span>
            </label>
          </div>
          
          {manualOverride && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-xs text-red-700">
                <strong>Warning:</strong> Manual override is ON. Virtual Try-On feature will be completely disabled until you turn this off.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
