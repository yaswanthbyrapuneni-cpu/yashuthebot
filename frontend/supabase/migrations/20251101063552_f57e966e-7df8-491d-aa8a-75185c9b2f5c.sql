-- Create visitors table for tracking unique users
CREATE TABLE IF NOT EXISTS public.visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT UNIQUE NOT NULL,
  face_encoding JSONB,
  first_visit TIMESTAMPTZ DEFAULT NOW(),
  last_visit TIMESTAMPTZ DEFAULT NOW(),
  visit_count INTEGER DEFAULT 1,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create try-on events table for tracking product interactions
CREATE TABLE IF NOT EXISTS public.try_on_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT REFERENCES public.visitors(visitor_id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  product_type TEXT NOT NULL,
  session_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_visitors_visitor_id ON public.visitors(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitors_first_visit ON public.visitors(first_visit);
CREATE INDEX IF NOT EXISTS idx_visitors_visit_count ON public.visitors(visit_count);
CREATE INDEX IF NOT EXISTS idx_try_on_events_visitor_id ON public.try_on_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_try_on_events_created_at ON public.try_on_events(created_at);
CREATE INDEX IF NOT EXISTS idx_try_on_events_product_id ON public.try_on_events(product_id);
CREATE INDEX IF NOT EXISTS idx_try_on_events_product_type ON public.try_on_events(product_type);

-- Enable RLS
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.try_on_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for anonymous analytics tracking
CREATE POLICY "Allow public read on visitors"
  ON public.visitors FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on visitors"
  ON public.visitors FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on visitors"
  ON public.visitors FOR UPDATE
  USING (true);

CREATE POLICY "Allow public read on try_on_events"
  ON public.try_on_events FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on try_on_events"
  ON public.try_on_events FOR INSERT
  WITH CHECK (true);

-- Enable realtime for live dashboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.visitors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.try_on_events;