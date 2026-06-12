// Re-export from the single shared client to avoid multiple GoTrueClient instances
export { supabase } from '../integrations/supabase/client';

// Helper function to generate unique session IDs
export function generateSessionId(): string {
  return crypto.randomUUID();
}