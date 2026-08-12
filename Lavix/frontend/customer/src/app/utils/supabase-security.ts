/**
 * Supabase Security Service
 * Handles event storage and siren state management.
 */

import { supabase } from './supabaseClient';

interface SecurityEvent {
  kiosk_id: string;
  detection_type: 'motion' | 'face';
  image_url?: string;
  email_sent: boolean;
  call_made: boolean;
  face_id?: string;
  metadata?: Record<string, any>;
}

export async function captureImageFromVideo(videoElement: HTMLVideoElement): Promise<Blob | null> {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(videoElement, 0, 0);
    return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.85));
  } catch (error) {
    console.error('[Supabase Security] Image capture failed:', error);
    return null;
  }
}

export async function storeSecurityEvent(event: SecurityEvent): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('security_events')
      .insert({
        kiosk_id: event.kiosk_id,
        detection_type: event.detection_type,
        image_url: event.image_url,
        email_sent: event.email_sent,
        call_made: event.call_made,
        face_id: event.face_id,
        metadata: event.metadata,
        timestamp: new Date().toISOString(),
      });

    if (error) {
      console.error('[Supabase Security] Failed to store event:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[Supabase Security] Store event error:', error);
    return false;
  }
}

// The settings poll runs every 10s. Without this guard a missing table or a
// missing row floods the console with an identical error forever.
let settingsErrorLogged = false;

export async function getSecuritySettings(kioskId: string) {
  try {
    const { data, error } = await supabase
      .from('security_settings')
      .select('*')
      .eq('kiosk_id', kioskId)
      .maybeSingle();

    if (error) {
      if (!settingsErrorLogged) {
        settingsErrorLogged = true;
        if (error.code === 'PGRST205') {
          console.error(
            '[Supabase Security] security_settings table does not exist. ' +
            'Run Lavix/backend/security_schema.sql in the Supabase SQL Editor. ' +
            'Security monitoring is disabled until then.'
          );
        } else {
          console.error('[Supabase Security] Failed to get settings:', error);
        }
      }
      return null;
    }

    if (!data) {
      if (!settingsErrorLogged) {
        settingsErrorLogged = true;
        console.warn(
          `[Supabase Security] No security_settings row for kiosk "${kioskId}". ` +
          'Seed it with security_schema.sql or enable security once from the admin panel.'
        );
      }
      return null;
    }

    settingsErrorLogged = false;
    return data;
  } catch (error) {
    if (!settingsErrorLogged) {
      settingsErrorLogged = true;
      console.error('[Supabase Security] Get settings error:', error);
    }
    return null;
  }
}

export function isSecurityModeActive(settings: any): boolean {
  if (!settings || !settings.security_mode_enabled) return false;
  if (settings.manual_override) return true;
  if (!settings.auto_mode_enabled) return false;

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const [startHour, startMin] = (settings.start_time || '22:00:00').split(':').map(Number);
  const [endHour, endMin] = (settings.end_time || '07:00:00').split(':').map(Number);

  const startMins = startHour * 60 + startMin;
  const endMins = endHour * 60 + endMin;

  // Handle overnight schedule (e.g. 22:00 – 07:00)
  if (startMins > endMins) {
    return currentTime >= startMins || currentTime <= endMins;
  }
  return currentTime >= startMins && currentTime <= endMins;
}

export async function updateSirenState(kioskId: string, sirenActive: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('security_settings')
      .update({
        siren_active: sirenActive,
        siren_triggered_at: sirenActive ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('kiosk_id', kioskId);

    if (error) {
      console.error('[Supabase Security] Failed to update siren state:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[Supabase Security] Update siren error:', error);
    return false;
  }
}

export function subscribeSirenStateChanges(
  kioskId: string,
  callback: (sirenActive: boolean) => void
) {
  return supabase
    .channel('security-settings-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'security_settings',
        filter: `kiosk_id=eq.${kioskId}`,
      },
      (payload) => callback(payload.new.siren_active)
    )
    .subscribe();
}

export async function updateLastDetectionTime(
  kioskId: string,
  detectionType: 'motion' | 'face'
): Promise<void> {
  try {
    const field =
      detectionType === 'motion' ? 'last_motion_detected_at' : 'last_face_detected_at';
    await supabase
      .from('security_settings')
      .update({ [field]: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('kiosk_id', kioskId);
  } catch (error) {
    console.error('[Supabase Security] Failed to update detection time:', error);
  }
}
