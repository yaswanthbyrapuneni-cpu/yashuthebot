import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TrendingProduct {
  product_id: number;
  product_name: string;
  product_type: string;
  try_count: number;
}

export interface AnalyticsData {
  total_visitors: number;
  repeated_users: number;
  total_try_ons: number;
  trending_products: TrendingProduct[];
  monthly_stats: {
    visitors: number;
    try_ons: number;
  };
  last_month_try_ons: number;
  two_months_ago_try_ons: number;
  daily_visitors: Record<string, number>;
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    total_visitors: 0,
    repeated_users: 0,
    total_try_ons: 0,
    trending_products: [],
    monthly_stats: {
      visitors: 0,
      try_ons: 0,
    },
    last_month_try_ons: 0,
    two_months_ago_try_ons: 0,
    daily_visitors: {},
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-analytics');
      
      if (error) {
        console.error('Error fetching analytics:', error);
        return;
      }

      if (data?.analytics) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Set up realtime subscriptions
    const visitorsChannel = supabase
      .channel('visitors-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'visitors',
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    const tryOnChannel = supabase
      .channel('try-on-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'try_on_events',
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(visitorsChannel);
      supabase.removeChannel(tryOnChannel);
    };
  }, []);

  return { analytics, loading };
}
