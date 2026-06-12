import { supabase } from "@/integrations/supabase/client";

/**
 * Generate a unique visitor ID based on browser fingerprinting
 * Uses sessionStorage for kiosk mode - each session is a new visitor
 */
export function generateVisitorId(): string {
  // Check if visitor ID already exists in sessionStorage (not localStorage)
  const existingId = sessionStorage.getItem('visitor_id');
  if (existingId) return existingId;

  // Create fingerprint from browser characteristics + timestamp for uniqueness
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    Date.now(), // Add timestamp for kiosk uniqueness
    Math.random().toString(36) // Add randomness
  ].join('|');

  // Generate hash-based ID
  const visitorId = 'visitor_' + btoa(fingerprint).slice(0, 32) + '_' + Date.now();
  
  // Store in sessionStorage (cleared on browser restart/new tab)
  sessionStorage.setItem('visitor_id', visitorId);
  
  console.log('[Visitor Tracking] New visitor created:', visitorId);
  
  return visitorId;
}

/**
 * Reset visitor tracking (for kiosk mode - call this after customer leaves)
 */
export function resetVisitorTracking(): void {
  localStorage.removeItem('visitor_id');
  sessionStorage.removeItem('session_id');
  console.log('[Visitor Tracking] Reset - ready for next customer');
}

/**
 * Get or generate session ID
 */
export function getSessionId(): string {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

/**
 * Track visitor - direct database insert (bypasses edge function)
 */
export async function trackVisitor(faceEncoding?: number[]): Promise<{ success: boolean; is_returning: boolean }> {
  try {
    const visitorId = generateVisitorId();
    const userAgent = navigator.userAgent;

    // Check if visitor already exists (.maybeSingle avoids 406 on multiple rows)
    const { data: existingVisitor, error: fetchError } = await supabase
      .from('visitors')
      .select('visitor_id, visit_count')
      .eq('visitor_id', visitorId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching visitor:', fetchError);
    }

    const isReturning = !!existingVisitor;
    const now = new Date().toISOString();

    if (existingVisitor) {
      // Update existing visitor
      const { error: updateError } = await supabase
        .from('visitors')
        .update({
          visit_count: (existingVisitor.visit_count || 0) + 1,
          last_visit: now,
          user_agent: userAgent,
          metadata: {
            screen_resolution: `${screen.width}x${screen.height}`,
            language: navigator.language,
            timestamp: now,
          }
        })
        .eq('visitor_id', visitorId);

      if (updateError) {
        console.error('Error updating visitor:', updateError);
        return { success: false, is_returning: true };
      }

      console.log('[Visitor Tracking] Returning visitor updated:', visitorId);
    } else {
      // Insert new visitor
      const { error: insertError } = await supabase
        .from('visitors')
        .insert({
          visitor_id: visitorId,
          visit_count: 1,
          first_visit: now,
          last_visit: now,
          user_agent: userAgent,
          face_encoding: faceEncoding || null,
          metadata: {
            screen_resolution: `${screen.width}x${screen.height}`,
            language: navigator.language,
            timestamp: now,
          }
        });

      if (insertError) {
        console.error('Error inserting visitor:', insertError);
        return { success: false, is_returning: false };
      }

      console.log('[Visitor Tracking] New visitor created:', visitorId);
    }

    return {
      success: true,
      is_returning: isReturning,
    };
  } catch (error) {
    console.error('Error in trackVisitor:', error);
    return { success: false, is_returning: false };
  }
}

/**
 * Track try-on event - direct database insert (bypasses edge function)
 */
export async function trackTryOnEvent(
  productId: number,
  productName: string,
  productType: string,
  productImage?: string,
  userId?: string | null
): Promise<{ success: boolean }> {
  try {
    const visitorId = generateVisitorId();
    const sessionId = getSessionId();
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('try_on_events')
      .insert({
        visitor_id: visitorId,
        user_id: userId || null, // Save user_id if authenticated, null otherwise
        product_id: productId,
        product_name: productName,
        product_type: productType,
        session_id: sessionId,
        created_at: now,
        metadata: {
          timestamp: now,
          user_agent: navigator.userAgent,
          product_image: productImage || null,
        },
      });

    if (error) {
      console.error('Error tracking try-on event:', error);
      return { success: false };
    }

    console.log('[Try-On Tracking] Event tracked:', { 
      productId, 
      productName, 
      productType, 
      productImage,
      userId: userId || 'anonymous'
    });

    return { success: true };
  } catch (error) {
    console.error('Error in trackTryOnEvent:', error);
    return { success: false };
  }
}