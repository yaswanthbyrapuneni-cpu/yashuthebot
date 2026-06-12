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
    const { visitor_id, face_encoding, user_agent, metadata } = await req.json();

    if (!visitor_id) {
      return new Response(
        JSON.stringify({ error: 'visitor_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if visitor exists
    const { data: existingVisitor } = await supabase
      .from('visitors')
      .select('*')
      .eq('visitor_id', visitor_id)
      .single();

    if (existingVisitor) {
      // Update existing visitor
      const { data, error } = await supabase
        .from('visitors')
        .update({
          last_visit: new Date().toISOString(),
          visit_count: existingVisitor.visit_count + 1,
          ...(face_encoding && { face_encoding }),
          ...(user_agent && { user_agent }),
        })
        .eq('visitor_id', visitor_id)
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ 
          success: true, 
          visitor: data,
          is_returning: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Create new visitor
      const { data, error } = await supabase
        .from('visitors')
        .insert({
          visitor_id,
          face_encoding,
          user_agent,
          metadata: metadata || {},
          visit_count: 1,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ 
          success: true, 
          visitor: data,
          is_returning: false 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error tracking visitor:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});