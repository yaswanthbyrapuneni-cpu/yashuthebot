// supabase/functions/track-emotion-session/index.ts
import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

serve({
  "/": async (req) => {
    if (req.method !== "POST") return new Response("METHOD NOT ALLOWED", { status: 405 });

    try {
      const body = await req.json();
      const {
        kiosk_id,
        session_id,
        product_id,
        samples,
        dominant_emotion,
        user_response,
        total_samples_count,
        session_duration_seconds,
        validation_timestamp = new Date().toISOString()
      } = body;

      // Basic validation
      if (!kiosk_id || !session_id || !product_id) {
        return new Response(JSON.stringify({ error: "missing kiosk_id/session_id/product_id" }), { status: 400 });
      }

      // sanitize samples: only allow < 1000 samples and valid confidence range
      const sanitizedSamples = Array.isArray(samples) ? samples.slice(0, 1000).map(s => ({
        product_id: product_id,
        emotion: String(s.emotion).slice(0, 32),
        confidence: Number(s.confidence) || 0,
        kiosk_id: kiosk_id,
        timestamp: s.timestamp ? new Date(s.timestamp).toISOString() : new Date().toISOString()
      })) : [];

      // 1) insert samples in bulk (if any)
      if (sanitizedSamples.length > 0) {
        const { error: sErr } = await supabase.from("emotion_samples").insert(sanitizedSamples);
        if (sErr) throw sErr;
      }

      // 2) insert validation record
      const { error: vErr } = await supabase.from("emotion_validations").insert({
        product_id,
        user_response: Boolean(user_response),
        total_samples_count: Number(total_samples_count) || sanitizedSamples.length,
        dominant_emotion,
        session_duration_seconds: Number(session_duration_seconds) || null,
        kiosk_id,
        timestamp: validation_timestamp
      });
      if (vErr) throw vErr;

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
      console.error("track-emotion-session error", err);
      return new Response(JSON.stringify({ error: err.message || err.toString() }), { status: 500 });
    }
  }
});
