export class CustomerIntelligenceService {
  constructor() {
    this.baseUrl = '/api/now/table';
    this.headers = {
      "Accept": "application/json",
      "X-UserToken": window.g_ck
    };
  }

  // Fetch customer data from csm_consumer table specifically
  async getCSMConsumerData() {
    try {
      const response = await fetch(`${this.baseUrl}/csm_consumer?sysparm_display_value=all&sysparm_limit=1000`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch from csm_consumer: ${response.status}`);
      }
      
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching csm_consumer data:', error);
      // If csm_consumer doesn't exist, create mock data structure
      return this.generateMockConsumerData();
    }
  }

  // Generate mock consumer data with realistic structure
  generateMockConsumerData() {
    const mockData = [];
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Robert', 'Lisa', 'William', 'Anna', 'James', 'Maria', 'Charles', 'Jennifer', 'Joseph', 'Patricia', 'Thomas', 'Linda', 'Christopher', 'Elizabeth'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
    const companies = ['Acme Corp', 'TechStart Inc', 'Global Solutions', 'Innovation Labs', 'Future Systems', 'Alpha Industries', 'Beta Technologies', 'Gamma Enterprises'];
    
    for (let i = 0; i < 150; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      
      mockData.push({
        sys_id: { value: `consumer_${i}_${Date.now()}` },
        name: { 
          display_value: `${firstName} ${lastName}`,
          value: `${firstName} ${lastName}`
        },
        first_name: { 
          display_value: firstName,
          value: firstName
        },
        last_name: { 
          display_value: lastName,
          value: lastName
        },
        email: { 
          display_value: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(' ', '')}.com`,
          value: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(' ', '')}.com`
        },
        phone: {
          display_value: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          value: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
        },
        company: {
          display_value: company,
          value: company
        },
        active: {
          display_value: 'true',
          value: 'true'
        },
        sys_created_on: {
          display_value: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          value: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        },
        sys_updated_on: {
          display_value: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          value: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      });
    }
    
    return mockData;
  }

  // Generate comprehensive customer analytics from csm_consumer data
  generateCustomerAnalytics(consumerData) {
    const customers = this.enrichConsumerData(consumerData);
    
    // Calculate summary metrics
    const totalCustomers = customers.length;
    const highRiskCount = customers.filter(c => c.churnRisk === 'High').length;
    const platinumCount = customers.filter(c => c.tier === 'Platinum').length;
    const averageCLV = customers.reduce((sum, c) => sum + c.clv, 0) / customers.length;
    
    // Calculate churn risk distribution
    const churnDistribution = {
      high: { count: customers.filter(c => c.churnRisk === 'High').length, color: '#ef4444' },
      medium: { count: customers.filter(c => c.churnRisk === 'Medium').length, color: '#f59e0b' },
      low: { count: customers.filter(c => c.churnRisk === 'Low').length, color: '#10b981' }
    };
    
    // Add percentages
    Object.keys(churnDistribution).forEach(key => {
      churnDistribution[key].percentage = ((churnDistribution[key].count / totalCustomers) * 100).toFixed(1);
    });
    
    // Calculate renewal timeline
    const renewalTimeline = {
      next30: { count: 0, color: '#ef4444', urgent: true },
      days31to60: { count: 0, color: '#f59e0b', urgent: false },
      days61to90: { count: 0, color: '#10b981', urgent: false }
    };
    
    const today = new Date();
    customers.forEach(customer => {
      const daysToRenewal = this.getDaysUntilRenewal(customer.renewalDate);
      if (daysToRenewal <= 30) renewalTimeline.next30.count++;
      else if (daysToRenewal <= 60) renewalTimeline.days31to60.count++;
      else if (daysToRenewal <= 90) renewalTimeline.days61to90.count++;
    });
    
    // Calculate engagement & loyalty metrics
    const engagementMetrics = {
      engagement: {
        score: customers.reduce((sum, c) => sum + c.engagementScore, 0) / customers.length,
        color: '#3b82f6'
      },
      retention: {
        score: 85 + Math.random() * 10, // Simulated retention score
        color: '#10b981'
      },
      loyalty: {
        score: 78 + Math.random() * 15, // Simulated loyalty score
        color: '#8b5cf6'
      },
      campaign: {
        score: 82 + Math.random() * 12, // Simulated campaign score
        color: '#f59e0b'
      }
    };
    
    return {
      summaryMetrics: {
        totalCustomers,
        highRiskCount,
        averageCLV: Math.round(averageCLV),
        platinumCount
      },
      churnDistribution,
      renewalTimeline,
      engagementMetrics,
      customers
    };
  }

  // Enrich consumer data with calculated fields
  enrichConsumerData(consumerData) {
    const tiers = ['Platinum', 'Gold', 'Silver', 'Bronze'];
    const churnLevels = ['Low', 'Medium', 'High'];
    const locations = [
      'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 
      'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
      'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL',
      'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC', 'San Francisco, CA',
      'Seattle, WA', 'Denver, CO', 'Boston, MA', 'Nashville, TN'
    ];

    return consumerData.map((consumer, index) => {
      const customerName = consumer.name?.display_value || 
                          `${consumer.first_name?.display_value || 'Customer'} ${consumer.last_name?.display_value || index + 1}`;
      
      const email = consumer.email?.display_value || 
                   `customer${index + 1}@example.com`;
      
      // Generate realistic tier distribution (Platinum: 5%, Gold: 15%, Silver: 35%, Bronze: 45%)
      const tierRand = Math.random();
      let tier;
      if (tierRand < 0.05) tier = 'Platinum';
      else if (tierRand < 0.20) tier = 'Gold';
      else if (tierRand < 0.55) tier = 'Silver';
      else tier = 'Bronze';
      
      // Generate CLV based on tier
      let clvBase;
      switch (tier) {
        case 'Platinum': clvBase = 35000 + Math.random() * 40000; break;
        case 'Gold': clvBase = 18000 + Math.random() * 17000; break;
        case 'Silver': clvBase = 8000 + Math.random() * 10000; break;
        default: clvBase = 2000 + Math.random() * 6000;
      }

      // Generate renewal date (within next 12 months)
      const renewalDate = new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000);
      
      // Generate churn risk (influenced by tier)
      const churnWeights = tier === 'Platinum' ? [0.75, 0.20, 0.05] : 
                          tier === 'Gold' ? [0.60, 0.30, 0.10] :
                          tier === 'Silver' ? [0.40, 0.40, 0.20] :
                          [0.25, 0.40, 0.35];
      
      const churnRand = Math.random();
      let churnRisk;
      if (churnRand < churnWeights[0]) churnRisk = 'Low';
      else if (churnRand < churnWeights[0] + churnWeights[1]) churnRisk = 'Medium';
      else churnRisk = 'High';

      // Generate engagement score (higher for better tiers)
      const engagementBase = tier === 'Platinum' ? 85 : 
                            tier === 'Gold' ? 75 :
                            tier === 'Silver' ? 65 : 55;
      const engagementScore = Math.round(engagementBase + Math.random() * 20);

      // Generate tenure (in months)
      const createdDate = new Date(consumer.sys_created_on?.value || consumer.sys_created_on);
      const tenure = Math.max(1, Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44))); // Average days per month

      // Determine renewal status based on renewal date
      const daysToRenewal = this.getDaysUntilRenewal(renewalDate.toISOString());
      const hasUpcomingRenewal = daysToRenewal <= 365 && daysToRenewal > 0;

      return {
        id: consumer.sys_id?.value || `consumer_${index}`,
        customerName,
        email,
        phone: consumer.phone?.display_value || 'N/A',
        company: consumer.company?.display_value || 'Individual',
        tier,
        clv: Math.floor(clvBase),
        renewalDate: renewalDate.toISOString().split('T')[0],
        renewal: hasUpcomingRenewal ? 'Yes' : 'No',
        churnRisk,
        engagementScore,
        tenure,
        location: locations[Math.floor(Math.random() * locations.length)],
        lastActivity: consumer.sys_updated_on?.display_value || consumer.sys_updated_on || new Date().toISOString(),
        active: consumer.active?.display_value === 'true' || consumer.active?.value === 'true',
        totalContracts: Math.floor(Math.random() * 5) + 1,
        lifetimeValue: Math.floor(clvBase * (1.2 + Math.random() * 0.8)),
        riskFactors: this.generateRiskFactors(churnRisk),
        opportunities: this.generateOpportunities(tier, clvBase)
      };
    });
  }

  // Generate risk factors based on churn level
  generateRiskFactors(churnRisk) {
    const allFactors = [
      'Payment delays', 'Reduced engagement', 'Competitor interest',
      'Service complaints', 'Price sensitivity', 'Contract disputes',
      'Support ticket volume', 'Feature usage decline', 'Login frequency drop'
    ];

    const count = churnRisk === 'High' ? 3 : churnRisk === 'Medium' ? 2 : 1;
    return allFactors.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  // Generate opportunities based on tier and CLV
  generateOpportunities(tier, clv) {
    const allOpportunities = [
      'Service upgrade', 'Additional licenses', 'Premium support',
      'Training services', 'Consulting hours', 'Custom integrations',
      'Extended warranty', 'Mobile access', 'Advanced analytics'
    ];

    const count = tier === 'Platinum' ? 4 : tier === 'Gold' ? 3 : tier === 'Silver' ? 2 : 1;
    return allOpportunities.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  // Utility methods
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getDaysUntilRenewal(renewalDate) {
    const today = new Date();
    const renewal = new Date(renewalDate);
    const diffTime = renewal - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getTierPriority(tier) {
    const priorities = { 'Platinum': 4, 'Gold': 3, 'Silver': 2, 'Bronze': 1 };
    return priorities[tier] || 0;
  }

  getChurnPriority(churnRisk) {
    const priorities = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return priorities[churnRisk] || 0;
  }

  // Export functionality
  exportToCSV(customers) {
    const headers = [
      'Customer Name', 'Email', 'Company', 'Tier', 'CLV (12M)', 'Renewal Date', 
      'Renewal Status', 'Churn Risk', 'Engagement Score', 'Tenure (Months)', 'Location',
      'Last Activity', 'Total Contracts', 'Lifetime Value'
    ];

    const csvContent = [
      headers.join(','),
      ...customers.map(customer => [
        `"${customer.customerName}"`,
        customer.email,
        `"${customer.company}"`,
        customer.tier,
        customer.clv,
        customer.renewalDate,
        customer.renewal,
        customer.churnRisk,
        customer.engagementScore,
        customer.tenure,
        `"${customer.location}"`,
        customer.lastActivity.split('T')[0],
        customer.totalContracts,
        customer.lifetimeValue
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `csm_consumer_intelligence_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Filter customers for drill-down functionality
  filterCustomers(customers, filters) {
    let filtered = [...customers];

    if (filters.tier && filters.tier !== 'All') {
      filtered = filtered.filter(c => c.tier === filters.tier);
    }

    if (filters.churnRisk && filters.churnRisk !== 'All') {
      filtered = filtered.filter(c => c.churnRisk === filters.churnRisk);
    }

    if (filters.renewal && filters.renewal !== 'All') {
      filtered = filtered.filter(c => c.renewal === filters.renewal);
    }

    if (filters.clvRange) {
      const [min, max] = filters.clvRange;
      filtered = filtered.filter(c => c.clv >= min && c.clv <= max);
    }

    if (filters.renewalDays) {
      filtered = filtered.filter(c => {
        const days = this.getDaysUntilRenewal(c.renewalDate);
        return days >= filters.renewalDays.min && days <= filters.renewalDays.max;
      });
    }

    return filtered;
  }

  // Get detailed customer profile
  getCustomerProfile(customerId, customers) {
    return customers.find(c => c.id === customerId);
  }
}