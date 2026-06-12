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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get total visitors
    const { count: totalVisitors, error: visitorsError } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true });

    if (visitorsError) throw visitorsError;

    // Get repeated users (visit_count > 1)
    const { count: repeatedUsers, error: repeatedError } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true })
      .gt('visit_count', 1);

    if (repeatedError) throw repeatedError;

    // Get total try-on events
    const { count: totalTryOns, error: tryOnsError } = await supabase
      .from('try_on_events')
      .select('*', { count: 'exact', head: true });

    if (tryOnsError) throw tryOnsError;

    // Get trending products (most tried in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: trendingData, error: trendingError } = await supabase
      .from('try_on_events')
      .select('product_id, product_name, product_type')
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (trendingError) throw trendingError;

    // Group and count trending products
    const productCounts = trendingData.reduce((acc: any, event: any) => {
      const key = `${event.product_id}-${event.product_name}`;
      if (!acc[key]) {
        acc[key] = {
          product_id: event.product_id,
          product_name: event.product_name,
          product_type: event.product_type,
          try_count: 0,
        };
      }
      acc[key].try_count++;
      return acc;
    }, {});

    const trendingProducts = Object.values(productCounts)
      .sort((a: any, b: any) => b.try_count - a.try_count)
      .slice(0, 10);

    // Get monthly stats
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: monthlyVisitors, error: monthlyVisitorsError } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true })
      .gte('first_visit', startOfMonth.toISOString());

    if (monthlyVisitorsError) throw monthlyVisitorsError;

    const { count: monthlyTryOns, error: monthlyTryOnsError } = await supabase
      .from('try_on_events')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString());

    if (monthlyTryOnsError) throw monthlyTryOnsError;

    // Get last month's try-ons
    const startOfLastMonth = new Date();
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    startOfLastMonth.setDate(1);
    startOfLastMonth.setHours(0, 0, 0, 0);
    
    const endOfLastMonth = new Date();
    endOfLastMonth.setDate(0); // Last day of previous month
    endOfLastMonth.setHours(23, 59, 59, 999);

    const { count: lastMonthTryOns, error: lastMonthError } = await supabase
      .from('try_on_events')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfLastMonth.toISOString())
      .lte('created_at', endOfLastMonth.toISOString());

    if (lastMonthError) throw lastMonthError;

    // Get September's try-ons (or 2 months ago)
    const startOfTwoMonthsAgo = new Date();
    startOfTwoMonthsAgo.setMonth(startOfTwoMonthsAgo.getMonth() - 2);
    startOfTwoMonthsAgo.setDate(1);
    startOfTwoMonthsAgo.setHours(0, 0, 0, 0);
    
    const endOfTwoMonthsAgo = new Date();
    endOfTwoMonthsAgo.setMonth(endOfTwoMonthsAgo.getMonth() - 1);
    endOfTwoMonthsAgo.setDate(0);
    endOfTwoMonthsAgo.setHours(23, 59, 59, 999);

    const { count: twoMonthsAgoTryOns, error: twoMonthsAgoError } = await supabase
      .from('try_on_events')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfTwoMonthsAgo.toISOString())
      .lte('created_at', endOfTwoMonthsAgo.toISOString());

    if (twoMonthsAgoError) throw twoMonthsAgoError;

    // Get daily visitors for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: dailyVisitorsData, error: dailyVisitorsError } = await supabase
      .from('visitors')
      .select('first_visit')
      .gte('first_visit', sevenDaysAgo.toISOString())
      .order('first_visit', { ascending: true });

    if (dailyVisitorsError) throw dailyVisitorsError;

    // Group by day
    const dailyVisitors = dailyVisitorsData.reduce((acc: any, visitor: any) => {
      const date = new Date(visitor.first_visit).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const analytics = {
      total_visitors: totalVisitors || 0,
      repeated_users: repeatedUsers || 0,
      total_try_ons: totalTryOns || 0,
      trending_products: trendingProducts,
      monthly_stats: {
        visitors: monthlyVisitors || 0,
        try_ons: monthlyTryOns || 0,
      },
      last_month_try_ons: lastMonthTryOns || 0,
      two_months_ago_try_ons: twoMonthsAgoTryOns || 0,
      daily_visitors: dailyVisitors,
      timestamp: new Date().toISOString(),
    };

    console.log('Analytics generated:', analytics);

    return new Response(
      JSON.stringify({ success: true, analytics }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error getting analytics:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});