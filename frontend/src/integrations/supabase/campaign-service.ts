// Campaign Service - Handles all campaign/offer related operations
import { supabase } from '../../client';
import type { Database } from '../../types';

type Campaign = Database['public']['Tables']['campaigns']['Row'];
type CampaignInsert = Database['public']['Tables']['campaigns']['Insert'];
type CampaignNotification = Database['public']['Tables']['campaign_notifications']['Row'];

export interface CreateCampaignData {
  title: string;
  description: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  image_file: File;
}

/**
 * Upload campaign image to Supabase Storage
 */
export async function uploadCampaignImage(file: File): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `campaigns/${fileName}`;

    console.log('[CampaignService] Uploading image:', filePath);

    const { data, error } = await supabase.storage
      .from('campaign-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('[CampaignService] Upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('campaign-images')
      .getPublicUrl(filePath);

    console.log('[CampaignService] Image uploaded successfully:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('[CampaignService] uploadCampaignImage error:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Create a new campaign/offer
 */
export async function createCampaign(campaignData: CreateCampaignData): Promise<Campaign> {
  try {
    // 1. Upload image first
    const imageUrl = await uploadCampaignImage(campaignData.image_file);

    // 2. Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // 3. Insert campaign
    const campaignInsert: CampaignInsert = {
      title: campaignData.title,
      description: campaignData.description,
      image_url: imageUrl,
      discount_percentage: campaignData.discount_percentage,
      start_date: campaignData.start_date,
      end_date: campaignData.end_date,
      is_active: true,
      created_by: user.id
    };

    console.log('[CampaignService] Creating campaign:', campaignInsert);

    const { data, error } = await supabase
      .from('campaigns')
      .insert(campaignInsert)
      .select()
      .single();

    if (error) {
      console.error('[CampaignService] Create error:', error);
      throw error;
    }

    console.log('[CampaignService] Campaign created successfully:', data.id);
    return data;
  } catch (error) {
    console.error('[CampaignService] createCampaign error:', error);
    throw error;
  }
}

/**
 * Get all active campaigns (not expired)
 */
export async function getActiveCampaigns(): Promise<Campaign[]> {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('is_active', true)
      .gt('end_date', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[CampaignService] Fetch error:', error);
      throw error;
    }

    console.log('[CampaignService] Active campaigns:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('[CampaignService] getActiveCampaigns error:', error);
    return [];
  }
}

/**
 * Get all campaigns (admin view)
 */
export async function getAllCampaigns(): Promise<Campaign[]> {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[CampaignService] Fetch error:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('[CampaignService] getAllCampaigns error:', error);
    return [];
  }
}

/**
 * Delete a campaign
 */
export async function deleteCampaign(campaignId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId);

    if (error) {
      console.error('[CampaignService] Delete error:', error);
      throw error;
    }

    console.log('[CampaignService] Campaign deleted:', campaignId);
    return true;
  } catch (error) {
    console.error('[CampaignService] deleteCampaign error:', error);
    return false;
  }
}

/**
 * Update campaign status (activate/deactivate)
 */
export async function updateCampaignStatus(
  campaignId: string, 
  isActive: boolean
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('campaigns')
      .update({ is_active: isActive })
      .eq('id', campaignId);

    if (error) {
      console.error('[CampaignService] Update error:', error);
      throw error;
    }

    console.log('[CampaignService] Campaign status updated:', campaignId, isActive);
    return true;
  } catch (error) {
    console.error('[CampaignService] updateCampaignStatus error:', error);
    return false;
  }
}

/**
 * Get notification logs for a campaign
 */
export async function getCampaignNotifications(
  campaignId: string
): Promise<CampaignNotification[]> {
  try {
    const { data, error } = await supabase
      .from('campaign_notifications')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('sent_at', { ascending: false });

    if (error) {
      console.error('[CampaignService] Fetch notifications error:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('[CampaignService] getCampaignNotifications error:', error);
    return [];
  }
}

/**
 * Get user email notification preference
 */
export async function getUserEmailPreference(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('email_notifications')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If no preference exists, default to true (opted in)
      if (error.code === 'PGRST116') {
        return true;
      }
      throw error;
    }

    return data?.email_notifications ?? true;
  } catch (error) {
    console.error('[CampaignService] getUserEmailPreference error:', error);
    return true; // Default to opted in
  }
}

/**
 * Update user email notification preference
 */
export async function updateEmailPreference(
  userId: string, 
  allowEmails: boolean
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        email_notifications: allowEmails,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('[CampaignService] Update preference error:', error);
      throw error;
    }

    console.log('[CampaignService] Email preference updated:', userId, allowEmails);
    return true;
  } catch (error) {
    console.error('[CampaignService] updateEmailPreference error:', error);
    return false;
  }
}