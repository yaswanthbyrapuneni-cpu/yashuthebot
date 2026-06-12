/**
 * Supabase Security Service
 * Handles image uploads, event storage, and siren state management
 */

import { supabase } from './supabase-client';

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
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    ctx.drawImage(videoElement, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.85);
    });

  } catch (error) {
    console.error('[Supabase Security] Image capture failed:', error);
    return null;
  }
}

export async function uploadSecurityImage(
  imageBlob: Blob,
  kioskId: string,
  detectionType: 'motion' | 'face'
): Promise<string | null> {
  try {
    // Generate a unique filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${kioskId}/${detectionType}_${timestamp}.jpg`;
    
    console.log('[Supabase Security] Uploading image to:', filename);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('security-images')
      .upload(filename, imageBlob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('[Supabase Security] Upload failed:', error);
      return null;
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('security-images')
      .getPublicUrl(filename);

    console.log('[Supabase Security] Image uploaded successfully:', publicUrlData.publicUrl);
    
    return publicUrlData.publicUrl;

  } catch (error) {
    console.error('[Supabase Security] Upload error:', error);
    return null;
  }
}

export async function storeSecurityEvent(event: SecurityEvent): Promise<boolean> {
  try {
    console.log('[Supabase Security] Storing event:', event);

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
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error('[Supabase Security] Failed to store event:', error);
      return false;
    }

    console.log('[Supabase Security] Event stored successfully');
    return true;

  } catch (error) {
    console.error('[Supabase Security] Store event error:', error);
    return false;
  }
}

export async function getSecuritySettings(kioskId: string) {
  try {
    const { data, error } = await supabase
      .from('security_settings')
      .select('*')
      .eq('kiosk_id', kioskId)
      .single();

    if (error) {
      console.error('[Supabase Security] Failed to get settings:', error);
      return null;
    }

    return data;

  } catch (error) {
    console.error('[Supabase Security] Get settings error:', error);
    return null;
  }
}

export function isSecurityModeActive(settings: any): boolean {
  if (!settings) return false;

  // If security is not enabled at all, return false
  if (!settings.security_mode_enabled) {
    return false;
  }

  // If manual override is active, always return true
  if (settings.manual_override) {
    console.log('[Security] Manual override is ON - monitoring active');
    return true;
  }

  // If auto mode is disabled and no manual override, return false
  if (!settings.auto_mode_enabled) {
    return false;
  }

  // Check if current time is within scheduled hours
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const [startHour, startMin] = (settings.start_time || '22:00:00').split(':').map(Number);
  const [endHour, endMin] = (settings.end_time || '07:00:00').split(':').map(Number);

  const startTimeMinutes = startHour * 60 + startMin;
  const endTimeMinutes = endHour * 60 + endMin;

  let isInSchedule = false;
  if (startTimeMinutes > endTimeMinutes) {
    // Overnight schedule (e.g., 22:00 - 07:00)
    isInSchedule = currentTime >= startTimeMinutes || currentTime <= endTimeMinutes;
  } else {
    isInSchedule = currentTime >= startTimeMinutes && currentTime <= endTimeMinutes;
  }

  if (isInSchedule) {
    console.log('[Security] Within scheduled hours - monitoring active');
  } else {
    console.log('[Security] Outside scheduled hours - monitoring inactive');
  }

  return isInSchedule;
}

export async function updateSirenState(kioskId: string, sirenActive: boolean): Promise<boolean> {
  try {
    console.log('[Supabase Security] Updating siren state:', { kioskId, sirenActive });

    const { error } = await supabase
      .from('security_settings')
      .update({
        siren_active: sirenActive,
        siren_triggered_at: sirenActive ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('kiosk_id', kioskId);

    if (error) {
      console.error('[Supabase Security] Failed to update siren state:', error);
      return false;
    }

    console.log('[Supabase Security] Siren state updated successfully');
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
  const channel = supabase
    .channel('security-settings-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'security_settings',
        filter: `kiosk_id=eq.${kioskId}`
      },
      (payload) => {
        console.log('[Supabase Security] Siren state changed:', payload.new);
        callback(payload.new.siren_active);
      }
    )
    .subscribe();

  return channel;
}

export async function updateLastDetectionTime(
  kioskId: string,
  detectionType: 'motion' | 'face'
): Promise<void> {
  try {
    const field = detectionType === 'motion' 
      ? 'last_motion_detected_at' 
      : 'last_face_detected_at';

    await supabase
      .from('security_settings')
      .update({
        [field]: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('kiosk_id', kioskId);

  } catch (error) {
    console.error('[Supabase Security] Failed to update detection time:', error);
  }
}