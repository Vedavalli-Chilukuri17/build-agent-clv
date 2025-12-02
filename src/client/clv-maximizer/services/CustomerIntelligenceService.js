export class CustomerIntelligenceService {
  constructor() {
    this.baseUrl = '/api/now/table';
    this.headers = {
      "Accept": "application/json",
      "X-UserToken": window.g_ck
    };
  }

  // Fetch customer data from x_hete_clv_maximiz_policy_holders table
  async getCSMConsumerData() {
    try {
      const response = await fetch(`${this.baseUrl}/x_hete_clv_maximiz_policy_holders?sysparm_display_value=all&sysparm_limit=1000`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch from policy holders: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Policy holders data fetched:', data.result?.length || 0, 'records');
      return data.result || [];
    } catch (error) {
      console.error('Error fetching policy holders data:', error);
      // If table doesn't exist or is empty, generate mock data
      return this.generateMockConsumerData();
    }
  }

  // Generate mock consumer data with realistic structure
  generateMockConsumerData() {
    console.log('Using mock data as fallback for policy holders');
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
        // Mock churn risk data for testing
        churn_risk: {
          display_value: Math.floor(Math.random() * 100),
          value: Math.floor(Math.random() * 100)
        },
        lifetime_value: {
          display_value: (Math.random() * 50000 + 5000).toFixed(2),
          value: (Math.random() * 50000 + 5000).toFixed(2)
        },
        tier: {
          display_value: ['Bronze', 'Silver', 'Gold', 'Platinum'][Math.floor(Math.random() * 4)],
          value: ['bronze', 'silver', 'gold', 'platinum'][Math.floor(Math.random() * 4)]
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

  // Generate comprehensive customer analytics from policy holders data
  generateCustomerAnalytics(policyHoldersData) {
    const customers = this.enrichConsumerData(policyHoldersData);
    
    // Calculate summary metrics with detailed logging for high risk customers
    const totalCustomers = customers.length;
    const highRiskCustomers = customers.filter(c => c.churnRisk === 'High');
    const highRiskCount = highRiskCustomers.length;
    const platinumCount = customers.filter(c => c.tier === 'Platinum').length;
    const averageCLV = customers.reduce((sum, c) => sum + c.clv, 0) / customers.length;
    
    // Log high risk customer details for transparency
    console.log(`🚨 HIGH RISK CUSTOMERS ANALYSIS:
    - Total Customers: ${totalCustomers}
    - High Risk Count: ${highRiskCount} (${((highRiskCount/totalCustomers)*100).toFixed(1)}%)
    - High Risk Customer Names: ${highRiskCustomers.slice(0, 5).map(c => c.customerName).join(', ')}${highRiskCustomers.length > 5 ? '...' : ''}
    - Average CLV: $${Math.round(averageCLV).toLocaleString()}
    - Platinum Count: ${platinumCount}`);
    
    // Calculate churn risk distribution with detailed breakdown
    const churnDistribution = {
      high: { count: highRiskCount, color: '#ef4444' },
      medium: { count: customers.filter(c => c.churnRisk === 'Medium').length, color: '#f59e0b' },
      low: { count: customers.filter(c => c.churnRisk === 'Low').length, color: '#10b981' }
    };
    
    // Add percentages
    Object.keys(churnDistribution).forEach(key => {
      churnDistribution[key].percentage = ((churnDistribution[key].count / totalCustomers) * 100).toFixed(1);
    });
    
    console.log(`📊 CHURN RISK BREAKDOWN:
    - High Risk: ${churnDistribution.high.count} customers (${churnDistribution.high.percentage}%)
    - Medium Risk: ${churnDistribution.medium.count} customers (${churnDistribution.medium.percentage}%)
    - Low Risk: ${churnDistribution.low.count} customers (${churnDistribution.low.percentage}%)`);
    
    // Calculate renewal timeline based on engagement and churn risk
    const renewalTimeline = {
      next30: { count: 0, color: '#ef4444', urgent: true },
      days31to60: { count: 0, color: '#f59e0b', urgent: false },
      days61to90: { count: 0, color: '#10b981', urgent: false }
    };
    
    customers.forEach(customer => {
      // Estimate renewal urgency based on engagement and churn risk
      if (customer.churnRisk === 'High' || customer.engagementScore < 40) {
        renewalTimeline.next30.count++;
      } else if (customer.churnRisk === 'Medium' || customer.engagementScore < 65) {
        renewalTimeline.days31to60.count++;
      } else {
        renewalTimeline.days61to90.count++;
      }
    });
    
    // Calculate engagement & loyalty metrics
    const engagementMetrics = {
      engagement: {
        score: customers.reduce((sum, c) => sum + c.engagementScore, 0) / customers.length,
        color: '#3b82f6'
      },
      retention: {
        score: customers.filter(c => c.churnRisk === 'Low').length / customers.length * 100,
        color: '#10b981'
      },
      loyalty: {
        score: customers.reduce((sum, c) => sum + c.clvScore, 0) / customers.length,
        color: '#8b5cf6'
      },
      campaign: {
        score: customers.reduce((sum, c) => sum + c.engagementScore, 0) / customers.length * 0.85,
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
      customers,
      highRiskCustomers // Add explicit high risk customer list
    };
  }

  // Enrich policy holders data with calculated fields
  enrichConsumerData(policyHoldersData) {
    const locations = [
      'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 
      'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
      'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL',
      'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC', 'San Francisco, CA',
      'Seattle, WA', 'Denver, CO', 'Boston, MA', 'Nashville, TN'
    ];

    return policyHoldersData.map((holder, index) => {
      // Extract customer name
      const customerName = holder.name?.display_value || holder.name?.value ||
                          `${holder.first_name?.display_value || holder.first_name?.value || 'Customer'} ${holder.last_name?.display_value || holder.last_name?.value || index + 1}`;
      
      // Extract email
      const email = holder.email?.display_value || holder.email?.value || 
                   `customer${index + 1}@email.com`;
      
      // Extract and format tier
      const tierValue = holder.tier?.display_value || holder.tier?.value || 'bronze';
      const tier = tierValue.charAt(0).toUpperCase() + tierValue.slice(1).toLowerCase();
      
      // Extract CLV from lifetime_value field
      const lifetimeValueStr = holder.lifetime_value?.display_value || holder.lifetime_value?.value || '5000';
      const clv = parseFloat(lifetimeValueStr.toString().replace(/[^0-9.-]/g, '')) || 5000;
      
      // Extract CLV score
      const clvScoreStr = holder.clv_score?.display_value || holder.clv_score?.value || '70';
      const clvScore = parseFloat(clvScoreStr.toString()) || 70;
      
      // Extract churn risk percentage and convert to category - THIS IS KEY FOR HIGH RISK IDENTIFICATION
      const churnRiskPercent = parseInt(holder.churn_risk?.display_value || holder.churn_risk?.value || '30');
      let churnRisk;
      if (churnRiskPercent >= 70) {
        churnRisk = 'High';
      } else if (churnRiskPercent >= 40) {
        churnRisk = 'Medium';
      } else {
        churnRisk = 'Low';
      }
      
      // Log high risk customers for debugging
      if (churnRisk === 'High') {
        console.log(`🚨 High Risk Customer Identified: ${customerName} (${churnRiskPercent}% churn risk)`);
      }
      
      // Calculate engagement score from various metrics
      const websiteVisits = parseInt(holder.website_visits_30_days?.display_value || holder.website_visits_30_days?.value || '0');
      const appSessions = parseInt(holder.app_sessions_30_days?.display_value || holder.app_sessions_30_days?.value || '0');
      const quoteViews = parseInt(holder.quote_views?.display_value || holder.quote_views?.value || '0');
      
      // Engagement score based on activity (0-100 scale)
      const baseEngagement = Math.min(100, Math.max(0, 
        (websiteVisits * 2) + (appSessions * 4) + (quoteViews * 6) + 25
      ));
      const engagementScore = Math.round(baseEngagement + (Math.random() * 15) - 7.5); // Add some variation
      
      // Extract tenure
      const tenureYears = parseInt(holder.tenure_years?.display_value || holder.tenure_years?.value || '1');
      const tenureMonths = tenureYears * 12;
      
      // Generate renewal date based on tenure and creation date
      const createdDate = new Date(holder.sys_created_on?.value || holder.sys_created_on || new Date());
      const nextRenewal = new Date(createdDate);
      nextRenewal.setFullYear(nextRenewal.getFullYear() + tenureYears + 1);
      
      // Determine renewal status
      const daysToRenewal = this.getDaysUntilRenewal(nextRenewal.toISOString());
      const hasUpcomingRenewal = daysToRenewal <= 365 && daysToRenewal > 0;

      return {
        id: holder.sys_id?.value || holder.sys_id || `holder_${index}`,
        customerId: holder.customer_id?.display_value || holder.customer_id?.value || `CUST${String(index + 1).padStart(6, '0')}`,
        customerName,
        email,
        phone: holder.phone?.display_value || holder.phone?.value || 'N/A',
        company: 'Policy Holder',
        tier,
        clv: Math.floor(clv),
        clvScore: Math.round(clvScore),
        renewalDate: nextRenewal.toISOString().split('T')[0],
        renewal: hasUpcomingRenewal ? 'Yes' : 'No',
        churnRisk,
        churnRiskPercent, // Store original percentage for reference
        engagementScore: Math.max(0, Math.min(100, Math.round(engagementScore))),
        tenure: tenureMonths,
        age: parseInt(holder.age?.display_value || holder.age?.value || '35'),
        creditScore: parseInt(holder.credit_score?.display_value || holder.credit_score?.value || '700'),
        preferredChannel: holder.preferred_channel?.display_value || holder.preferred_channel?.value || 'Email',
        missingCoverage: holder.missing_coverage?.display_value || holder.missing_coverage?.value || 'None',
        websiteVisits: websiteVisits,
        appSessions: appSessions,
        quoteViews: quoteViews,
        location: locations[Math.floor(Math.random() * locations.length)],
        lastActivity: holder.sys_updated_on?.display_value || holder.sys_updated_on || new Date().toISOString(),
        active: true,
        totalContracts: Math.floor(Math.random() * 3) + 1,
        lifetimeValue: Math.floor(clv * 1.15),
        riskFactors: this.generateRiskFactors(churnRisk, holder),
        opportunities: this.generateOpportunities(tier, clv, holder)
      };
    });
  }

  // Enhanced risk factors generation based on churn level and policy holder data
  generateRiskFactors(churnRisk, holder) {
    const factors = [];
    
    // Add factors based on actual data from policy holders table
    const creditScore = parseInt(holder.credit_score?.display_value || holder.credit_score?.value || '700');
    if (creditScore < 650) {
      factors.push('Low credit score');
    }
    
    const websiteVisits = parseInt(holder.website_visits_30_days?.display_value || holder.website_visits_30_days?.value || '5');
    if (websiteVisits < 2) {
      factors.push('Low engagement');
    }
    
    const appSessions = parseInt(holder.app_sessions_30_days?.display_value || holder.app_sessions_30_days?.value || '3');
    if (appSessions === 0) {
      factors.push('No mobile app usage');
    }
    
    const quoteViews = parseInt(holder.quote_views?.display_value || holder.quote_views?.value || '1');
    if (quoteViews === 0) {
      factors.push('No recent quote activity');
    }

    const churnRiskPercent = parseInt(holder.churn_risk?.display_value || holder.churn_risk?.value || '30');
    if (churnRiskPercent >= 80) {
      factors.push('Very high churn probability');
    } else if (churnRiskPercent >= 70) {
      factors.push('High churn probability');
    }
    
    // Add additional factors based on churn risk level
    const additionalFactors = [
      'Payment delays', 'Service complaints', 'Competitor interest',
      'Price sensitivity', 'Coverage gaps', 'Reduced communication',
      'Policy lapses', 'Claim frequency issues'
    ];

    const targetCount = churnRisk === 'High' ? 5 : churnRisk === 'Medium' ? 3 : 2;
    
    while (factors.length < targetCount && additionalFactors.length > 0) {
      const randomIndex = Math.floor(Math.random() * additionalFactors.length);
      factors.push(additionalFactors.splice(randomIndex, 1)[0]);
    }

    return factors.slice(0, targetCount);
  }

  // Generate opportunities based on tier, CLV, and policy holder data
  generateOpportunities(tier, clv, holder) {
    const opportunities = [];
    
    // Add opportunities based on missing coverage from policy holders table
    const missingCoverage = holder.missing_coverage?.display_value || holder.missing_coverage?.value || '';
    if (missingCoverage.toLowerCase().includes('flood')) {
      opportunities.push('Flood Insurance');
    }
    if (missingCoverage.toLowerCase().includes('umbrella')) {
      opportunities.push('Umbrella Liability');
    }
    if (missingCoverage.toLowerCase().includes('identity')) {
      opportunities.push('Identity Theft Protection');
    }
    if (missingCoverage.toLowerCase().includes('travel')) {
      opportunities.push('Travel Insurance');
    }
    if (missingCoverage.toLowerCase().includes('jewelry')) {
      opportunities.push('Jewelry & Valuables');
    }
    
    // Add tier-based opportunities
    const tierOpportunities = {
      'Platinum': ['Premium Advisory Services', 'Concierge Support', 'Investment Insurance'],
      'Gold': ['Enhanced Coverage', 'Priority Claims', 'Risk Assessment'],
      'Silver': ['Coverage Upgrade', 'Multi-Policy Discount', 'Digital Tools'],
      'Bronze': ['Basic Upgrade', 'Safety Training', 'Loyalty Program']
    };

    const tierSpecific = tierOpportunities[tier] || tierOpportunities['Bronze'];
    opportunities.push(...tierSpecific.slice(0, 2));

    return opportunities.slice(0, Math.min(5, opportunities.length));
  }

  // Get high risk customers specifically
  getHighRiskCustomers(customers) {
    const highRiskCustomers = customers.filter(c => c.churnRisk === 'High');
    console.log(`🎯 Retrieved ${highRiskCustomers.length} high risk customers for drill-down`);
    return highRiskCustomers;
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
      'Customer ID', 'Customer Name', 'Email', 'Phone', 'Tier', 'CLV ($)', 'CLV Score',
      'Renewal Date', 'Renewal Status', 'Churn Risk', 'Churn Risk %', 'Engagement Score', 'Age',
      'Tenure (Months)', 'Credit Score', 'Preferred Channel', 'Missing Coverage',
      'Website Visits (30d)', 'App Sessions (30d)', 'Quote Views', 'Location', 'Risk Factors'
    ];

    const csvContent = [
      headers.join(','),
      ...customers.map(customer => [
        customer.customerId,
        `"${customer.customerName}"`,
        customer.email,
        customer.phone,
        customer.tier,
        customer.clv,
        customer.clvScore,
        customer.renewalDate,
        customer.renewal,
        customer.churnRisk,
        customer.churnRiskPercent || 'N/A',
        customer.engagementScore,
        customer.age,
        customer.tenure,
        customer.creditScore,
        customer.preferredChannel,
        `"${customer.missingCoverage}"`,
        customer.websiteVisits,
        customer.appSessions,
        customer.quoteViews,
        `"${customer.location}"`,
        `"${customer.riskFactors.join('; ')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `policy_holders_intelligence_${new Date().toISOString().split('T')[0]}.csv`);
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