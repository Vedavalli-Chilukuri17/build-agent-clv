export class CLVDataService {
  constructor() {
    this.baseUrl = '/api/now/table';
    this.headers = {
      "Accept": "application/json",
      "X-UserToken": window.g_ck
    };
  }

  // Fetch customer data with CLV scores
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

  // Fetch incident data for customer intelligence
  async getIncidentData() {
    try {
      const response = await fetch(`${this.baseUrl}/incident?sysparm_display_value=all&sysparm_limit=100&sysparm_query=active=true`, {
        headers: this.headers
      });
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching incident data:', error);
      return [];
    }
  }

  // Fetch user activity for engagement metrics
  async getUserActivity() {
    try {
      const response = await fetch(`${this.baseUrl}/sys_audit?sysparm_display_value=all&sysparm_limit=500&sysparm_query=ORDERBYDESCsys_created_on`, {
        headers: this.headers
      });
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching user activity:', error);
      return [];
    }
  }

  // Fetch service catalog data for product performance
  async getServiceCatalogData() {
    try {
      const response = await fetch(`${this.baseUrl}/sc_cat_item?sysparm_display_value=all&sysparm_limit=50&sysparm_query=active=true`, {
        headers: this.headers
      });
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching service catalog data:', error);
      return [];
    }
  }

  // Fetch role data for customer tiers
  async getRoleData() {
    try {
      const response = await fetch(`${this.baseUrl}/sys_user_role?sysparm_display_value=all&sysparm_limit=100`, {
        headers: this.headers
      });
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching role data:', error);
      return [];
    }
  }

  // Simulate CLV calculation (would typically come from actual CLV tables)
  calculateCLVMetrics(customers, incidents, activities) {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.active?.value === 'true').length;
    const highRiskCustomers = Math.floor(totalCustomers * 0.15); // 15% high risk
    
    return {
      totalCustomers,
      activeCustomers,
      renewalRate: totalCustomers > 0 ? ((activeCustomers / totalCustomers) * 100).toFixed(1) : 0,
      churnRate: totalCustomers > 0 ? (((totalCustomers - activeCustomers) / totalCustomers) * 100).toFixed(1) : 0,
      averageCLV: 12500, // Simulated average CLV
      customerAcquisitionCost: 850,
      netRevenueRetention: 108.5,
      highRiskCustomers
    };
  }

  // Calculate channel performance metrics
  calculateChannelPerformance(activities) {
    const channels = {
      App: { volume: 0, conversions: 0 },
      Email: { volume: 0, conversions: 0 },
      Call: { volume: 0, conversions: 0 },
      Advisor: { volume: 0, conversions: 0 }
    };

    // Simulate channel data based on user activities
    const totalActivities = activities.length;
    channels.App.volume = Math.floor(totalActivities * 0.35);
    channels.Email.volume = Math.floor(totalActivities * 0.25);
    channels.Call.volume = Math.floor(totalActivities * 0.20);
    channels.Advisor.volume = Math.floor(totalActivities * 0.20);

    // Simulate conversion rates
    Object.keys(channels).forEach(channel => {
      channels[channel].conversions = Math.floor(channels[channel].volume * (0.15 + Math.random() * 0.15));
      channels[channel].conversionRate = channels[channel].volume > 0 ? 
        ((channels[channel].conversions / channels[channel].volume) * 100).toFixed(1) : 0;
    });

    return channels;
  }

  // Calculate product performance metrics
  calculateProductPerformance(catalogItems) {
    return catalogItems.map(item => ({
      name: item.short_description?.display_value || 'Unknown Product',
      purchaseFrequency: Math.floor(Math.random() * 100) + 20,
      premiumVsCompetitor: ((Math.random() * 40) - 20).toFixed(1), // -20% to +20%
      revenuePerCustomer: Math.floor(Math.random() * 5000) + 1000,
      campaignUplift: ((Math.random() * 30) + 5).toFixed(1) // 5% to 35%
    })).slice(0, 8); // Top 8 products
  }

  // Calculate customer tier distribution
  calculateCustomerTiers(customers) {
    const total = customers.length;
    return {
      Platinum: Math.floor(total * 0.05),
      Gold: Math.floor(total * 0.15),
      Silver: Math.floor(total * 0.35),
      Bronze: Math.floor(total * 0.45)
    };
  }

  // Calculate CLV bands distribution
  calculateCLVBands(customers) {
    const total = customers.length;
    return {
      'under5k': Math.floor(total * 0.40),
      '5k-10k': Math.floor(total * 0.35),
      '10k-15k': Math.floor(total * 0.15),
      'over15k': Math.floor(total * 0.10)
    };
  }

  // Get upcoming renewals (simulated)
  getUpcomingRenewals(customers) {
    return customers.slice(0, 10).map(customer => ({
      customerName: customer.name?.display_value || 'Unknown Customer',
      renewalDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      renewalStatus: ['Pending', 'In Progress', 'At Risk', 'Confirmed'][Math.floor(Math.random() * 4)],
      opportunityScore: Math.floor(Math.random() * 40) + 60,
      renewalAmount: Math.floor(Math.random() * 50000) + 10000,
      clvScore: Math.floor(Math.random() * 40) + 60
    }));
  }
}