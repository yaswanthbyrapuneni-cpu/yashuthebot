import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { visitor_id, product_id, product_name, product_type, session_id, metadata } = await req.json();

    if (!visitor_id || !product_id || !product_name || !product_type) {
      return new Response(
        JSON.stringify({ error: 'visitor_id, product_id, product_name, and product_type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert try-on event
    const { data, error } = await supabase
      .from('try_on_events')
      .insert({
        visitor_id,
        product_id,
        product_name,
        product_type,
        session_id: session_id || crypto.randomUUID(),
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) throw error;

    console.log('Try-on event tracked:', { visitor_id, product_id, product_name, product_type });

    return new Response(
      JSON.stringify({ 
        success: true, 
        event: data 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error tracking try-on:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});