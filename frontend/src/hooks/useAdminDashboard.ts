// src/hooks/useAdminDashboard.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TrendingProduct {
  product_id: string;
  product_name: string;
  product_type: string;
  try_count: number;
  happy_count: number;
  happy_percentage: number;
  neutral_percentage: number;
  sad_percentage: number;
  positive_score: number; // happy% + neutral%
  product_image?: string | null;
}

export interface EmotionStats {
  happy_percentage: number;
  neutral_percentage: number;
  sad_percentage: number;
  total_samples: number;
}

export interface AdminDashboardData {
  total_visitors: number;
  total_try_ons: number;
  repeated_users: number;
  current_month_try_ons: number;
  last_month_try_ons: number;
  two_months_ago_try_ons: number;
  emotion_stats: EmotionStats;
  trending_products: TrendingProduct[];
}

export function useAdminDashboard() {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('[Admin Dashboard] Fetching dashboard data...');

      // 1) Visitors
      const { data: visitors, error: visitorsError } = await supabase
        .from('visitors')
        .select('visitor_id, visit_count');

      if (visitorsError) {
        console.error('[Admin Dashboard] visitors fetch error', visitorsError);
      }

      const total_visitors = visitors?.length || 0;
      const repeated_users = visitors?.filter(v => v.visit_count > 1).length || 0;

      // 2) Try-on events (for counts & monthly breakdown)
      const { data: tryOnEvents, error: tryOnError } = await supabase
        .from('try_on_events')
        .select('product_id, product_name, product_type, created_at, metadata');

      if (tryOnError) {
        console.error('[Admin Dashboard] try_on_events fetch error', tryOnError);
      }

      const total_try_ons = tryOnEvents?.length || 0;

      // monthly stats
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const twoMonthsAgoStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);

      const current_month_try_ons = (tryOnEvents || []).filter(
        e => new Date(e.created_at) >= currentMonthStart
      ).length;

      const last_month_try_ons = (tryOnEvents || []).filter(
        e => new Date(e.created_at) >= lastMonthStart && new Date(e.created_at) < currentMonthStart
      ).length;

      const two_months_ago_try_ons = (tryOnEvents || []).filter(
        e => new Date(e.created_at) >= twoMonthsAgoStart && new Date(e.created_at) < lastMonthStart
      ).length;

      // 3) Emotion analytics - fetch with percentage columns
      const { data: analyticsRows, error: analyticsError } = await supabase
        .from('emotion_analytics')
        .select('product_id, dominant_emotion, feedback, created_at, happy_percentage, neutral_percentage, sad_percentage, total_samples');

      if (analyticsError) {
        console.error('[Admin Dashboard] emotion_analytics fetch error', analyticsError);
      }

      const analytics = analyticsRows || [];

      // Build global emotion stats from ALL emotion_analytics using weighted averages:
      let totalHappySamples = 0;
      let totalNeutralSamples = 0;
      let totalSadSamples = 0;
      let totalSamples = 0;

      analytics.forEach((row: any) => {
        const samples = row.total_samples || 0;
        const happyPct = row.happy_percentage || 0;
        const neutralPct = row.neutral_percentage || 0;
        const sadPct = row.sad_percentage || 0;
        
        // Calculate actual sample counts from percentages
        totalHappySamples += Math.round((happyPct / 100) * samples);
        totalNeutralSamples += Math.round((neutralPct / 100) * samples);
        totalSadSamples += Math.round((sadPct / 100) * samples);
        totalSamples += samples;
      });

      // Calculate percentages
      let happy_percentage = totalSamples > 0 ? Math.round((totalHappySamples / totalSamples) * 100) : 0;
      let neutral_percentage = totalSamples > 0 ? Math.round((totalNeutralSamples / totalSamples) * 100) : 0;
      let sad_percentage = totalSamples > 0 ? Math.round((totalSadSamples / totalSamples) * 100) : 0;

      // Fix rounding to ensure total = 100%
      const total = happy_percentage + neutral_percentage + sad_percentage;
      if (total !== 100 && totalSamples > 0) {
        const diff = 100 - total;
        // Add the difference to the largest percentage
        if (happy_percentage >= neutral_percentage && happy_percentage >= sad_percentage) {
          happy_percentage += diff;
        } else if (neutral_percentage >= sad_percentage) {
          neutral_percentage += diff;
        } else {
          sad_percentage += diff;
        }
      }

      const emotion_stats = {
        happy_percentage,
        neutral_percentage,
        sad_percentage,
        total_samples: totalSamples
      };

      console.log('[Admin Dashboard] Global emotion stats:', emotion_stats);

      // 4) Trending products calculation — LAST 30 MINUTES
      const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
      console.log('[Admin Dashboard] Trending window: last 30 minutes since', thirtyMinutesAgo.toISOString());

      // Filter try-on events from last 30 minutes
      const recentTryOnEvents = (tryOnEvents || []).filter(
        e => new Date(e.created_at) >= thirtyMinutesAgo
      );
      console.log('[Admin Dashboard] Recent try-on events (last 30 min):', recentTryOnEvents.length);

      // Filter analytics from last 30 minutes
      const recentAnalytics = (analytics || []).filter(
        row => new Date(row.created_at) >= thirtyMinutesAgo
      );
      console.log('[Admin Dashboard] Recent analytics (last 30 min):', recentAnalytics.length);

      // Build product aggregator from recent try-on events
      const productMap = new Map<string, {
        product_name: string;
        product_type: string;
        try_count: number;
        happy_percentage: number;
        neutral_percentage: number;
        sad_percentage: number;
        product_image: string | null;
      }>();

      recentTryOnEvents.forEach((ev: any) => {
        const pid = String(ev.product_id);
        const existing = productMap.get(pid) || {
          product_name: ev.product_name || `Product ${pid}`,
          product_type: ev.product_type || '',
          try_count: 0,
          happy_percentage: 0,
          neutral_percentage: 0,
          sad_percentage: 0,
          product_image: null
        };
        existing.try_count += 1;
        
        // Extract product image from metadata
        if (ev.metadata && ev.metadata.product_image && !existing.product_image) {
          existing.product_image = ev.metadata.product_image;
        }
        
        productMap.set(pid, existing);
      });

      // Add emotion data per product from recent analytics (use DB percentages directly)
      recentAnalytics.forEach((row: any) => {
        const pid = String(row.product_id);
        const existing = productMap.get(pid);
        if (!existing) {
          console.log('[Admin Dashboard] ⚠️ Analytics for product', pid, 'but no try-on event found');
          return;
        }
        
        // Use percentages directly from database
        existing.happy_percentage = row.happy_percentage || 0;
        existing.neutral_percentage = row.neutral_percentage || 0;
        existing.sad_percentage = row.sad_percentage || 0;
        
        console.log(`[Admin Dashboard] Product ${pid}: happy=${existing.happy_percentage}%, neutral=${existing.neutral_percentage}%, sad=${existing.sad_percentage}%`);
      });

      // Convert productMap -> list
      let allProducts: TrendingProduct[] = Array.from(productMap.entries()).map(([product_id, d]) => {
        return {
          product_id,
          product_name: d.product_name,
          product_type: d.product_type,
          try_count: d.try_count,
          happy_count: 0, // Not used anymore
          happy_percentage: d.happy_percentage,
          neutral_percentage: d.neutral_percentage,
          sad_percentage: d.sad_percentage,
          positive_score: d.happy_percentage + d.neutral_percentage, // Combined positive score
          product_image: d.product_image
        };
      });

      console.log('[Admin Dashboard] All products with emotions:', allProducts);

      // Filter products where happy% + neutral% > 90%
      let trending_products = allProducts.filter(p => {
        console.log(`[Admin Dashboard] ${p.product_name}: positive=${p.positive_score}% (${p.happy_percentage}% + ${p.neutral_percentage}%)`);
        return p.positive_score > 90;
      });
      console.log('[Admin Dashboard] Products with >90% positive:', trending_products.length);

      // Sort by positive_score, then by try_count
      trending_products.sort((a, b) => {
        if (b.positive_score !== a.positive_score) return b.positive_score - a.positive_score;
        return b.try_count - a.try_count;
      });

      // Limit to top 4
      trending_products = trending_products.slice(0, 4);
      console.log('[Admin Dashboard] Top 4 trending products:', trending_products);

      const finalData: AdminDashboardData = {
        total_visitors,
        total_try_ons,
        repeated_users,
        current_month_try_ons,
        last_month_try_ons,
        two_months_ago_try_ons,
        emotion_stats,
        trending_products
      };

      setDashboardData(finalData);
      setLoading(false);
      console.log('[Admin Dashboard] Data loaded', finalData);
    } catch (err) {
      console.error('[Admin Dashboard] fetchDashboardData error', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // subscribe to realtime changes
    const visitorsChannel = supabase
      .channel('admin-visitors-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'visitors' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    const tryOnChannel = supabase
      .channel('admin-tryon-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'try_on_events' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    const analyticsChannel = supabase
      .channel('admin-analytics-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'emotion_analytics' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(visitorsChannel);
      supabase.removeChannel(tryOnChannel);
      supabase.removeChannel(analyticsChannel);
    };
  }, []);

  return { dashboardData, loading, refresh: fetchDashboardData };
}