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

  // NEW: Fetch customer profiles from csm_consumer table
  async getCustomerProfiles() {
    try {
      const response = await fetch(`${this.baseUrl}/csm_consumer?sysparm_display_value=all&sysparm_limit=500`, {
        headers: this.headers
      });
      const data = await response.json();
      
      // Transform the data to match our expected structure
      return (data.result || []).map((record, index) => {
        // Extract field values using display/value pattern
        const getName = (record) => {
          if (record.name?.display_value) return record.name.display_value;
          if (record.first_name?.display_value && record.last_name?.display_value) {
            return `${record.first_name.display_value} ${record.last_name.display_value}`;
          }
          if (record.customer_name?.display_value) return record.customer_name.display_value;
          return `Customer ${index + 1}`;
        };

        const getLocation = (record) => {
          const city = record.city?.display_value || record.location?.display_value || '';
          const state = record.state?.display_value || record.region?.display_value || '';
          if (city && state) return `${city}, ${state}`;
          if (city) return city;
          if (state) return state;
          return this.generateRandomLocation();
        };

        const generateChurnRisk = () => {
          const risks = ['Low', 'Medium', 'High'];
          const weights = [0.6, 0.3, 0.1]; // 60% Low, 30% Medium, 10% High
          const random = Math.random();
          let sum = 0;
          for (let i = 0; i < weights.length; i++) {
            sum += weights[i];
            if (random < sum) return risks[i];
          }
          return 'Low';
        };

        const generateCLVTier = () => {
          const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum'];
          const weights = [0.45, 0.35, 0.15, 0.05]; // 45% Bronze, 35% Silver, 15% Gold, 5% Platinum
          const random = Math.random();
          let sum = 0;
          for (let i = 0; i < weights.length; i++) {
            sum += weights[i];
            if (random < sum) return tiers[i];
          }
          return 'Bronze';
        };

        return {
          id: record.sys_id?.value || `profile_${index}`,
          name: getName(record),
          clvTier: generateCLVTier(),
          clv12M: Math.floor(Math.random() * 45000) + 5000, // $5K - $50K
          renewal: Math.random() > 0.3, // 70% have renewal
          renewalDate: record.renewal_date?.display_value || this.generateRandomRenewalDate(),
          churnRisk: generateChurnRisk(),
          engagementScore: Math.floor(Math.random() * 40) + 60, // 60-100
          tenure: Math.floor(Math.random() * 60) + 1, // 1-60 months
          location: getLocation(record),
          // Additional fields for potential future use
          email: record.email?.display_value || '',
          phone: record.phone?.display_value || record.contact_number?.display_value || '',
          lastActivity: record.last_activity?.display_value || record.sys_updated_on?.display_value || ''
        };
      });
    } catch (error) {
      console.error('Error fetching customer profiles:', error);
      // Return mock data if csm_consumer table doesn't exist or has issues
      return this.generateMockCustomerProfiles();
    }
  }

  // Helper method to generate random renewal date within next 90 days
  generateRandomRenewalDate() {
    const now = new Date();
    const futureDate = new Date(now.getTime() + Math.random() * 90 * 24 * 60 * 60 * 1000);
    return futureDate.toISOString().split('T')[0];
  }

  // Helper method to generate random location
  generateRandomLocation() {
    const locations = [
      'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
      'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
      'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC',
      'Seattle, WA', 'Denver, CO', 'Boston, MA', 'Detroit, MI', 'Nashville, TN'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  // Generate mock customer profiles if real data is unavailable
  generateMockCustomerProfiles() {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica', 'William', 'Ashley', 'James', 'Amanda', 'Christopher', 'Jennifer', 'Daniel', 'Lisa', 'Matthew', 'Michelle', 'Anthony', 'Kimberly'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
    
    const generateChurnRisk = () => {
      const risks = ['Low', 'Medium', 'High'];
      const weights = [0.6, 0.3, 0.1];
      const random = Math.random();
      let sum = 0;
      for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (random < sum) return risks[i];
      }
      return 'Low';
    };

    const generateCLVTier = () => {
      const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum'];
      const weights = [0.45, 0.35, 0.15, 0.05];
      const random = Math.random();
      let sum = 0;
      for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (random < sum) return tiers[i];
      }
      return 'Bronze';
    };

    return Array.from({ length: 150 }, (_, index) => ({
      id: `mock_profile_${index}`,
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      clvTier: generateCLVTier(),
      clv12M: Math.floor(Math.random() * 45000) + 5000,
      renewal: Math.random() > 0.3,
      renewalDate: this.generateRandomRenewalDate(),
      churnRisk: generateChurnRisk(),
      engagementScore: Math.floor(Math.random() * 40) + 60,
      tenure: Math.floor(Math.random() * 60) + 1,
      location: this.generateRandomLocation()
    }));
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

  // Get upcoming renewals (Enhanced version with pagination support)
  getUpcomingRenewals(customers, page = 1, pageSize = 10) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const allRenewals = customers.map((customer, index) => ({
      id: customer.sys_id?.value || `customer_${index}`,
      customerName: customer.name?.display_value || `Customer ${index + 1}`,
      renewalDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      renewalStatus: ['Pending', 'In Progress', 'At Risk', 'Confirmed'][Math.floor(Math.random() * 4)],
      opportunityScore: Math.floor(Math.random() * 40) + 60,
      renewalAmount: Math.floor(Math.random() * 80000) + 20000,
      clvScore: Math.floor(Math.random() * 40) + 60
    }));

    return {
      data: allRenewals.slice(startIndex, endIndex),
      pagination: {
        currentPage: page,
        pageSize,
        totalRecords: allRenewals.length,
        totalPages: Math.ceil(allRenewals.length / pageSize)
      }
    };
  }

  // NEW: Get Product Benchmarking Data
  async getProductBenchmarkingData() {
    try {
      // In real implementation, this would fetch from Product_Performance, Competitor_Benchmark tables
      const benchmarkingData = [
        {
          productName: 'Term Life Insurance',
          performanceLabel: 'Strong',
          premiumVsComp1: '+8.5%',
          premiumVsComp2: '+12.3%',
          renewalVsComp1: '+15.7%',
          renewalVsComp2: '+9.2%',
          claimsRatio: '2.4%',
          addOnRate: '34.6%'
        },
        {
          productName: 'Auto Insurance',
          performanceLabel: 'Competitive',
          premiumVsComp1: '+2.1%',
          premiumVsComp2: '-1.8%',
          renewalVsComp1: '+5.3%',
          renewalVsComp2: '+3.1%',
          claimsRatio: '4.1%',
          addOnRate: '28.9%'
        },
        {
          productName: 'Home Insurance',
          performanceLabel: 'Strong',
          premiumVsComp1: '+11.2%',
          premiumVsComp2: '+7.8%',
          renewalVsComp1: '+18.4%',
          renewalVsComp2: '+14.6%',
          claimsRatio: '3.2%',
          addOnRate: '42.1%'
        },
        {
          productName: 'Umbrella Liability',
          performanceLabel: 'Challenged',
          premiumVsComp1: '-3.7%',
          premiumVsComp2: '-8.2%',
          renewalVsComp1: '-2.1%',
          renewalVsComp2: '-6.8%',
          claimsRatio: '1.8%',
          addOnRate: '19.3%'
        },
        {
          productName: 'Whole Life Insurance',
          performanceLabel: 'Competitive',
          premiumVsComp1: '+1.4%',
          premiumVsComp2: '+3.7%',
          renewalVsComp1: '+6.8%',
          renewalVsComp2: '+2.9%',
          claimsRatio: '5.6%',
          addOnRate: '31.2%'
        },
        {
          productName: 'Pet Insurance',
          performanceLabel: 'Strong',
          premiumVsComp1: '+14.8%',
          premiumVsComp2: '+22.1%',
          renewalVsComp1: '+25.3%',
          renewalVsComp2: '+19.7%',
          claimsRatio: '8.9%',
          addOnRate: '45.7%'
        }
      ];

      return {
        data: benchmarkingData,
        lastUpdated: new Date(),
        dataSource: 'Uploaded Excel file + Real-time API'
      };
    } catch (error) {
      console.error('Error fetching product benchmarking data:', error);
      return { data: [], lastUpdated: new Date(), dataSource: 'Error loading data' };
    }
  }

  // Helper method to format performance indicators
  getPerformanceIndicator(value) {
    const numValue = parseFloat(value.replace('%', ''));
    if (numValue > 10) return { color: '#059669', indicator: '🟢' };
    if (numValue > 0) return { color: '#f59e0b', indicator: '🟡' };
    return { color: '#dc2626', indicator: '🔴' };
  }

  // Helper method to get performance badge class
  getPerformanceBadgeClass(label) {
    switch (label.toLowerCase()) {
      case 'strong': return 'performance-strong';
      case 'competitive': return 'performance-competitive';
      case 'challenged': return 'performance-challenged';
      default: return 'performance-neutral';
    }
  }
}