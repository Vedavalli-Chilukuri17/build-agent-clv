export class CustomerIntelligenceService {
  constructor() {
    this.baseUrl = '/api/now/table';
    this.baseHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  // Helper method to get headers with authentication
  getHeaders() {
    const headers = { ...this.baseHeaders };
    
    if (window.g_ck) {
      headers['X-UserToken'] = window.g_ck;
    }
    
    return headers;
  }

  // Fetch customer data from the policy holders table
  async getPolicyHoldersData() {
    try {
      const response = await fetch(`${this.baseUrl}/x_hete_clv_maximiz_policy_holders?sysparm_display_value=all&sysparm_limit=1000`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch from policy holders table: ${response.status}`);
      }
      
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching policy holders data:', error);
      return [];
    }
  }

  // Generate comprehensive customer analytics from policy holders data
  async generateCustomerAnalytics() {
    const policyHolders = await this.getPolicyHoldersData();
    const customers = this.transformPolicyHoldersData(policyHolders);
    
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

  // Transform policy holders data to customer intelligence format
  transformPolicyHoldersData(policyHolders) {
    return policyHolders.map((holder, index) => {
      const customerName = this.getValue(holder.name) || 
                          `${this.getValue(holder.first_name)} ${this.getValue(holder.last_name)}`;
      
      const email = this.getValue(holder.email) || 'N/A';
      const phone = this.getValue(holder.phone) || 'N/A';
      
      // Transform tier to proper case
      const tier = this.formatTier(this.getValue(holder.tier));
      
      // Get CLV values
      const clv = parseFloat(this.getValue(holder.clv)) || 0;
      const lifetimeValue = parseFloat(this.getValue(holder.lifetime_value)) || 0;
      
      // Calculate churn risk category
      const churnRiskValue = parseFloat(this.getValue(holder.churn_risk)) || 0;
      let churnRisk;
      if (churnRiskValue > 30) churnRisk = 'High';
      else if (churnRiskValue >= 15) churnRisk = 'Medium';
      else churnRisk = 'Low';
      
      // Get renewal date
      const renewalDate = this.getValue(holder.renewal_date) || null;
      const hasUpcomingRenewal = renewalDate && this.getDaysUntilRenewal(renewalDate) <= 365;
      
      // Get engagement score
      const engagementScore = parseInt(this.getValue(holder.engagement_score)) || 0;
      
      // Get tenure
      const tenure = parseFloat(this.getValue(holder.tenure_years)) || 0;
      
      return {
        id: this.getValue(holder.sys_id) || `holder_${index}`,
        customerName,
        customerId: this.getValue(holder.customer_id) || `CUST${String(index).padStart(7, '0')}`,
        email,
        phone,
        tier,
        clv: Math.floor(clv),
        lifetimeValue: Math.floor(lifetimeValue),
        renewalDate: renewalDate || 'N/A',
        renewal: hasUpcomingRenewal ? 'Yes' : 'No',
        churnRisk,
        churnRiskValue: churnRiskValue,
        engagementScore,
        tenure: Math.round(tenure * 12), // Convert to months
        location: 'N/A', // Not available in policy holders data
        lastActivity: this.getValue(holder.sys_updated_on) || new Date().toISOString(),
        active: true,
        totalContracts: 1, // Assume 1 contract per policy holder
        
        // Additional fields from policy holders
        age: parseInt(this.getValue(holder.age)) || 0,
        creditScore: parseInt(this.getValue(holder.credit_score)) || 0,
        creditUtilization: parseFloat(this.getValue(holder.credit_utilization_percent)) || 0,
        bankruptcyFlag: this.getValue(holder.bankruptcies_flag) === '1',
        preferredChannel: this.getValue(holder.preferred_channel) || 'Unknown',
        appSessions: parseInt(this.getValue(holder.app_sessions_30_days)) || 0,
        websiteVisits: parseInt(this.getValue(holder.website_visits_30_days)) || 0,
        quoteViews: parseInt(this.getValue(holder.quote_views)) || 0,
        missingCoverage: this.getValue(holder.missing_coverage) || 'None',
        riskFlags: this.getValue(holder.risk_flags) || 'None',
        
        // Generate risk factors based on actual data
        riskFactors: this.generateRiskFactors(holder),
        opportunities: this.generateOpportunities(holder)
      };
    });
  }

  // Helper method to get field values
  getValue(field) {
    if (typeof field === 'object' && field !== null && field.display_value !== undefined) {
      return field.display_value;
    }
    return field;
  }

  // Format tier to proper case
  formatTier(tier) {
    if (!tier) return 'Bronze';
    return tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
  }

  // Generate risk factors based on actual policy holder data
  generateRiskFactors(holder) {
    const factors = [];
    
    const churnRisk = parseFloat(this.getValue(holder.churn_risk)) || 0;
    const creditScore = parseInt(this.getValue(holder.credit_score)) || 0;
    const creditUtilization = parseFloat(this.getValue(holder.credit_utilization_percent)) || 0;
    const bankruptcyFlag = this.getValue(holder.bankruptcies_flag) === '1';
    const engagementScore = parseInt(this.getValue(holder.engagement_score)) || 0;
    const delinquencies = parseInt(this.getValue(holder.delinquency_12m)) || 0;
    
    if (churnRisk > 30) factors.push('High churn probability');
    if (creditScore < 600) factors.push('Low credit score');
    if (creditUtilization > 80) factors.push('High credit utilization');
    if (bankruptcyFlag) factors.push('Bankruptcy history');
    if (engagementScore < 40) factors.push('Low engagement');
    if (delinquencies > 2) factors.push('Multiple delinquencies');
    
    return factors.length > 0 ? factors : ['No significant risk factors'];
  }

  // Generate opportunities based on actual policy holder data
  generateOpportunities(holder) {
    const opportunities = [];
    
    const tier = this.getValue(holder.tier) || '';
    const missingCoverage = this.getValue(holder.missing_coverage) || '';
    const engagementScore = parseInt(this.getValue(holder.engagement_score)) || 0;
    const lifetimeValue = parseFloat(this.getValue(holder.lifetime_value)) || 0;
    
    if (missingCoverage && missingCoverage !== 'falsene' && missingCoverage !== 'None') {
      opportunities.push(`Add ${missingCoverage} coverage`);
    }
    
    if (tier === 'bronze' || tier === 'silver') {
      opportunities.push('Tier upgrade potential');
    }
    
    if (engagementScore > 70) {
      opportunities.push('High engagement - cross-sell ready');
    }
    
    if (lifetimeValue > 20000) {
      opportunities.push('Premium services upsell');
    }
    
    return opportunities.length > 0 ? opportunities : ['Standard renewal'];
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
      'Customer ID', 'Customer Name', 'Email', 'Phone', 'Tier', 'CLV (12M)', 'Lifetime Value',
      'Renewal Date', 'Renewal Status', 'Churn Risk', 'Engagement Score', 'Tenure (Months)',
      'Age', 'Credit Score', 'Preferred Channel', 'Missing Coverage'
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
        customer.lifetimeValue,
        customer.renewalDate,
        customer.renewal,
        customer.churnRisk,
        customer.engagementScore,
        customer.tenure,
        customer.age,
        customer.creditScore,
        customer.preferredChannel,
        `"${customer.missingCoverage}"`
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
    return customers.find(c => c.id === customerId || c.customerId === customerId);
  }
}