export class CampaignService {
  constructor() {
    this.baseUrl = '/api/now/table';
    this.headers = {
      "Accept": "application/json",
      "X-UserToken": window.g_ck
    };
  }

  // Fetch customer data for segmentation
  async getCustomerData() {
    try {
      const response = await fetch(`${this.baseUrl}/sys_user?sysparm_display_value=all&sysparm_limit=100`, {
        headers: this.headers
      });
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching customer data:', error);
      return [];
    }
  }

  // Fetch service catalog items for product mapping
  async getProductData() {
    try {
      const response = await fetch(`${this.baseUrl}/sc_cat_item?sysparm_display_value=all&sysparm_limit=50&sysparm_query=active=true`, {
        headers: this.headers
      });
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching product data:', error);
      return [];
    }
  }

  // Fetch campaign history from the campaigns table
  async getCampaignHistory() {
    try {
      const response = await fetch(`${this.baseUrl}/x_hete_clv_maximiz_campaigns?sysparm_display_value=all&sysparm_limit=50&sysparm_query=ORDERBYDESCsys_created_on`, {
        headers: this.headers
      });
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching campaign history:', error);
      return [];
    }
  }

  // Fetch recent campaigns from the campaigns table
  async getRecentCampaigns() {
    try {
      const response = await fetch(`${this.baseUrl}/x_hete_clv_maximiz_campaigns?sysparm_display_value=all&sysparm_limit=10&sysparm_query=ORDERBYDESCsys_created_on`, {
        headers: this.headers
      });
      const data = await response.json();
      
      if (data.result && data.result.length > 0) {
        // Transform the ServiceNow data to match the expected format
        return data.result.map(campaign => ({
          id: campaign.sys_id?.display_value || campaign.sys_id,
          name: campaign.campaign_name?.display_value || campaign.campaign_name || 'Untitled Campaign',
          type: this.formatCampaignType(campaign.campaign_type?.display_value || campaign.campaign_type),
          status: this.formatStatus(campaign.status?.display_value || campaign.status),
          channel: this.formatChannel(campaign.channel?.display_value || campaign.channel),
          launchDate: this.formatLaunchDate(campaign.launch_date?.display_value || campaign.launch_date),
          createdBy: campaign.created_by?.display_value || campaign.created_by || 'System',
          estimatedReach: campaign.estimated_reach?.display_value || campaign.estimated_reach || 'N/A',
          performance: this.generateMockPerformance(campaign.status?.display_value || campaign.status) // Generate mock performance data
        }));
      } else {
        // Return fallback mock data if no campaigns exist yet
        return this.getFallbackCampaigns();
      }
    } catch (error) {
      console.error('Error fetching recent campaigns:', error);
      // Return fallback mock data on error
      return this.getFallbackCampaigns();
    }
  }

  // Helper method to format campaign type
  formatCampaignType(type) {
    const typeMapping = {
      'retention': 'Retention',
      'upsell': 'Upsell', 
      'win_back': 'Win-back',
      'cross_sell': 'Cross-sell'
    };
    return typeMapping[type] || type || 'Unknown';
  }

  // Helper method to format status - Updated to include scheduled
  formatStatus(status) {
    const statusMapping = {
      'draft': 'Draft',
      'scheduled': 'Scheduled',
      'launched': 'Active',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return statusMapping[status] || status || 'Unknown';
  }

  // Helper method to format channel
  formatChannel(channel) {
    const channelMapping = {
      'email': 'Email',
      'sms': 'SMS',
      'push_notification': 'Push Notification',
      'in_app_messaging': 'In-app Messaging'
    };
    return channelMapping[channel] || channel || 'Unknown';
  }

  // Helper method to format launch date
  formatLaunchDate(dateString) {
    if (!dateString) return 'Not scheduled';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return dateString; // Return original string if parsing fails
    }
  }

  // Generate mock performance data based on status - Updated to handle scheduled
  generateMockPerformance(status) {
    if (status === 'draft' || status === 'scheduled' || !status) {
      return { openRate: 'N/A', ctr: 'N/A', conversion: 'N/A' };
    }
    
    // Generate realistic performance metrics for active/completed campaigns
    const openRate = (Math.random() * 30 + 15).toFixed(1); // 15-45%
    const ctr = (Math.random() * 8 + 2).toFixed(1); // 2-10%
    const conversion = (Math.random() * 5 + 1).toFixed(1); // 1-6%
    
    return {
      openRate: `${openRate}%`,
      ctr: `${ctr}%`,
      conversion: `${conversion}%`
    };
  }

  // Fallback campaigns for when no real data exists
  getFallbackCampaigns() {
    return [
      {
        id: 'camp_001',
        name: 'Fall Renters Campaign',
        type: 'Retention',
        status: 'Active',
        channel: 'Email',
        launchDate: '2024-01-15',
        createdBy: 'System User',
        estimatedReach: '2,500',
        performance: { openRate: '32.4%', ctr: '7.8%', conversion: '4.2%' }
      },
      {
        id: 'camp_002',
        name: 'Auto Renewal Push',
        type: 'Upsell',
        status: 'Completed',
        channel: 'SMS',
        launchDate: '2024-01-10',
        createdBy: 'System User',
        estimatedReach: '1,800',
        performance: { openRate: '28.1%', ctr: '6.3%', conversion: '3.1%' }
      },
      {
        id: 'camp_003',
        name: 'Win-back Homeowners',
        type: 'Win-back',
        status: 'Draft',
        channel: 'Email',
        launchDate: '2024-01-20',
        createdBy: 'System User',
        estimatedReach: '3,200',
        performance: { openRate: 'N/A', ctr: 'N/A', conversion: 'N/A' }
      }
    ];
  }

  // Generate campaign content using AI simulation
  async generateCampaignContent(tone, brief, customerType, productFrequency) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const toneVariations = {
          'Professional': {
            greeting: 'Dear {CustomerName},',
            opening: 'We are pleased to inform you about an exclusive opportunity',
            closing: 'We look forward to serving you. Best regards, Your Insurance Team'
          },
          'Friendly': {
            greeting: 'Hi {CustomerName}!',
            opening: 'We have something special just for you',
            closing: 'Thanks for being such a valued customer! Cheers, Your Friends at Insurance'
          },
          'Urgent': {
            greeting: 'Attention {CustomerName}!',
            opening: 'Time-sensitive offer - Act now to secure your benefits',
            closing: 'Don\'t miss out! Contact us today. Urgently, Your Insurance Team'
          },
          'Conversational': {
            greeting: 'Hey {CustomerName},',
            opening: 'Guess what? We\'ve got something great for you',
            closing: 'Let\'s chat soon! Talk to you later, Your Insurance Family'
          }
        };

        const selectedTone = toneVariations[tone] || toneVariations['Professional'];
        
        const generatedContent = `${selectedTone.greeting}

${selectedTone.opening} related to ${brief || 'your insurance needs'}.

Based on your profile as a ${customerType} customer with interest in ${productFrequency.join(', ')}, we have tailored this offer specifically for you.

Visit your nearest office at {OfficeLocation} and enjoy an exclusive {OfficeDiscount}% discount on {ProductName}. Your renewal date of {RenewalDate} is approaching, making this the perfect time to explore new options.

${selectedTone.closing}`;

        resolve({
          success: true,
          content: generatedContent,
          metadata: {
            tone,
            brief,
            customerType,
            productCount: productFrequency.length,
            generatedAt: new Date().toISOString()
          }
        });
      }, 2000);
    });
  }

  // Save campaign draft
  async saveCampaignDraft(campaignData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          campaignId: `campaign_${Date.now()}`,
          savedAt: new Date().toISOString(),
          status: 'Draft'
        });
      }, 1000);
    });
  }

  // Launch campaign
  async launchCampaign(campaignData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          campaignId: campaignData.campaignId || `campaign_${Date.now()}`,
          launchedAt: new Date().toISOString(),
          status: 'Launched',
          estimatedReach: Math.floor(Math.random() * 5000) + 1000
        });
      }, 2500);
    });
  }

  // Get campaign performance data
  getCampaignPerformance() {
    return {
      openRate: (Math.random() * 30 + 15).toFixed(1), // 15-45%
      clickThroughRate: (Math.random() * 8 + 2).toFixed(1), // 2-10%
      conversionRate: (Math.random() * 5 + 1).toFixed(1), // 1-6%
      churnImpact: (Math.random() * 15 + 5).toFixed(1), // 5-20%
      segmentPerformance: {
        'High CLV': { openRate: 34.2, ctr: 8.7, conversion: 5.2 },
        'At Risk': { openRate: 28.1, ctr: 6.3, conversion: 3.8 },
        'New': { openRate: 22.5, ctr: 4.9, conversion: 2.1 },
        'Existing': { openRate: 31.8, ctr: 7.4, conversion: 4.5 }
      },
      channelPerformance: {
        'Email': { sent: 2847, opened: 891, clicked: 156, converted: 89 },
        'SMS': { sent: 1203, opened: 967, clicked: 134, converted: 67 },
        'Push': { sent: 3456, opened: 1234, clicked: 234, converted: 145 }
      }
    };
  }

  // Format date for display
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}