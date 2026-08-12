-- ===========================================================================
-- Lavix Security Module — Supabase / PostgreSQL schema
-- Run this in Supabase → SQL Editor. Safe to re-run (all statements idempotent).
-- Fixes: PGRST205 "Could not find the table 'public.security_settings'"
-- ===========================================================================

-- 1. SECURITY SETTINGS (one row per kiosk)
CREATE TABLE IF NOT EXISTS security_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kiosk_id TEXT NOT NULL UNIQUE,
  security_mode_enabled BOOLEAN DEFAULT false,
  auto_mode_enabled BOOLEAN DEFAULT true,
  manual_override BOOLEAN DEFAULT false,
  start_time TIME DEFAULT '22:00:00',
  end_time TIME DEFAULT '07:00:00',
  siren_active BOOLEAN DEFAULT false,
  siren_triggered_at TIMESTAMPTZ,
  last_motion_detected_at TIMESTAMPTZ,
  last_face_detected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. SECURITY EVENTS LOG (one row per detection)
CREATE TABLE IF NOT EXISTS security_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kiosk_id TEXT NOT NULL,
  detection_type TEXT NOT NULL CHECK (detection_type IN ('motion', 'face')),
  image_url TEXT,
  email_sent BOOLEAN DEFAULT false,
  call_made BOOLEAN DEFAULT false,
  face_id TEXT,
  metadata JSONB,
  timestamp TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_security_events_kiosk ON security_events(kiosk_id);
CREATE INDEX IF NOT EXISTS idx_security_events_time ON security_events(timestamp DESC);

-- 3. REAL-TIME on security_settings (needed for live siren sync between
--    the admin dashboard and the kiosk)
ALTER TABLE security_settings REPLICA IDENTITY FULL;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE security_settings;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;

-- 4. ROW LEVEL SECURITY
--    The kiosk browser uses the anon key, so anon needs read + write on these
--    two tables (siren state, detection timestamps, event log).
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon can read security settings" ON security_settings;
CREATE POLICY "anon can read security settings"
  ON security_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "anon can write security settings" ON security_settings;
CREATE POLICY "anon can write security settings"
  ON security_settings FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon can insert security settings" ON security_settings;
CREATE POLICY "anon can insert security settings"
  ON security_settings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "anon can read security events" ON security_events;
CREATE POLICY "anon can read security events"
  ON security_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "anon can insert security events" ON security_events;
CREATE POLICY "anon can insert security events"
  ON security_events FOR INSERT WITH CHECK (true);

-- 5. SEED the row for this kiosk. VITE_KIOSK_ID is LAVIX_KIOSK_001
--    (set in docker-compose.yml). Without this row the monitor logs
--    "No settings found for kiosk" forever.
INSERT INTO security_settings (kiosk_id, security_mode_enabled, auto_mode_enabled, manual_override)
VALUES ('LAVIX_KIOSK_001', false, true, false)
ON CONFLICT (kiosk_id) DO NOTHING;
