// Campaign Manager Component - Admin interface for creating and sending campaigns
import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { 
  createCampaign, 
  getAllCampaigns, 
  deleteCampaign, 
  updateCampaignStatus,
  getCampaignNotifications 
} from '../integrations/supabase/campaign-service.ts';
import type { Database } from '../integrations/supabase/types';

type Campaign = Database['public']['Tables']['campaigns']['Row'];
type CampaignNotification = Database['public']['Tables']['campaign_notifications']['Row'];

interface CampaignStats {
  emails_sent: number;
  emails_failed: number;
  total_users: number;
}

export function CampaignManager() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaignStats, setCampaignStats] = useState<Record<string, CampaignStats>>({});

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_percentage: 0,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    image_file: null as File | null
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch all campaigns on mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const data = await getAllCampaigns();
      setCampaigns(data);

      // Fetch stats for each campaign
      const stats: Record<string, CampaignStats> = {};
      for (const campaign of data) {
        const notifications = await getCampaignNotifications(campaign.id);
        stats[campaign.id] = {
          emails_sent: notifications.filter(n => n.status === 'sent').length,
          emails_failed: notifications.filter(n => n.status === 'failed').length,
          total_users: notifications.length
        };
      }
      setCampaignStats(stats);
    } catch (error) {
      console.error('[CampaignManager] Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image_file: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!formData.title || !formData.description || !formData.end_date || !formData.image_file) {
        alert('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Create campaign (uploads image and saves to DB)
      const campaign = await createCampaign({
        title: formData.title,
        description: formData.description,
        discount_percentage: formData.discount_percentage,
        start_date: formData.start_date,
        end_date: formData.end_date,
        image_file: formData.image_file
      });

      console.log('[CampaignManager] Campaign created:', campaign.id);

      // Send emails via backend
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/send-campaign-emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          campaign_id: campaign.id,
          title: campaign.title,
          description: campaign.description,
          image_url: campaign.image_url,
          discount_percentage: campaign.discount_percentage,
          end_date: campaign.end_date
        })
      });

      const result = await response.json();

      if (result.success) {
        alert(`✅ Campaign sent successfully!\n\nEmails sent: ${result.emails_sent}\nFailed: ${result.emails_failed}\nTotal users: ${result.total_users}`);
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          discount_percentage: 0,
          start_date: new Date().toISOString().split('T')[0],
          end_date: '',
          image_file: null
        });
        setImagePreview(null);
        setShowCreateForm(false);
        
        // Refresh campaigns list
        fetchCampaigns();
      } else {
        alert(`❌ Failed to send emails: ${result.error}`);
      }
    } catch (error: any) {
      console.error('[CampaignManager] Error creating campaign:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      await deleteCampaign(campaignId);
      alert('Campaign deleted successfully');
      fetchCampaigns();
    } catch (error) {
      console.error('[CampaignManager] Error deleting campaign:', error);
      alert('Failed to delete campaign');
    }
  };

  const handleToggleActive = async (campaign: Campaign) => {
    try {
      await updateCampaignStatus(campaign.id, !campaign.is_active);
      alert(`Campaign ${!campaign.is_active ? 'activated' : 'deactivated'}`);
      fetchCampaigns();
    } catch (error) {
      console.error('[CampaignManager] Error updating status:', error);
      alert('Failed to update campaign status');
    }
  };

  return (
    <div className="bg-white relative rounded-xl md:rounded-[32px] shrink-0 w-full border border-[#eaecf0] shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-['Inter:Semi_Bold',_sans-serif] font-semibold text-2xl md:text-3xl text-[#2a120a]">
          Campaign & Offers
        </h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-to-r from-[#ffa047] via-[#fb912e] to-[#f78215] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          {showCreateForm ? 'Cancel' : '+ Create Campaign'}
        </button>
      </div>

      {/* Create Campaign Form */}
      {showCreateForm && (
        <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="font-semibold text-xl mb-4">Create New Campaign</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Campaign Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffa047] focus:border-transparent"
                placeholder="e.g., Diwali Gold Sale"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffa047] focus:border-transparent"
                rows={3}
                placeholder="Describe your offer..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Discount % *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffa047] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffa047] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">End Date *</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffa047] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Campaign Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffa047] focus:border-transparent"
                required
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-4 max-w-xs rounded-lg shadow-md" />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#ffa047] via-[#fb912e] to-[#f78215] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating & Sending...' : 'Create & Send Campaign'}
            </button>
          </form>
        </div>
      )}

      {/* Campaigns List */}
      <div className="space-y-4">
        {loading && campaigns.length === 0 ? (
          <p className="text-center py-8 text-gray-500">Loading campaigns...</p>
        ) : campaigns.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No campaigns yet. Create your first campaign!</p>
        ) : (
          campaigns.map((campaign) => {
            const stats = campaignStats[campaign.id];
            const isExpired = new Date(campaign.end_date) < new Date();

            return (
              <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Campaign Image */}
                  {campaign.image_url && (
                    <img 
                      src={campaign.image_url} 
                      alt={campaign.title}
                      className="w-full md:w-32 h-32 object-cover rounded-lg"
                    />
                  )}

                  {/* Campaign Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{campaign.title}</h4>
                        <p className="text-sm text-gray-600">{campaign.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          campaign.is_active && !isExpired ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {isExpired ? 'Expired' : campaign.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                      <span>💰 {campaign.discount_percentage}% OFF</span>
                      <span>📅 {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}</span>
                      {stats && (
                        <>
                          <span>✅ Sent: {stats.emails_sent}</span>
                          <span>❌ Failed: {stats.emails_failed}</span>
                          <span>👥 Total: {stats.total_users}</span>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleToggleActive(campaign)}
                        className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        {campaign.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(campaign.id)}
                        className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}