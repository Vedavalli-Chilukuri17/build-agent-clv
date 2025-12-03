export class DashboardService {
  constructor() {
    this.baseUrl = '/api/now/table';
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-UserToken': window.g_ck
    };
  }

  async getRenewalPipeline(filters = {}) {
    try {
      let query = '';
      const params = new URLSearchParams();
      params.append('sysparm_display_value', 'all');
      params.append('sysparm_limit', '1000');

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query += `status=${filters.status}`;
      }

      if (filters.search && filters.search.trim()) {
        const searchTerm = filters.search.trim();
        const searchQuery = `customer_nameLIKE${searchTerm}^ORcustomer_idLIKE${searchTerm}`;
        query = query ? `${query}^${searchQuery}` : searchQuery;
      }

      if (query) {
        params.append('sysparm_query', query);
      }

      // Add ordering
      params.append('sysparm_query', `${query ? query + '^' : ''}ORDERBYrenewal_date`);

      const response = await fetch(
        `${this.baseUrl}/x_hete_clv_maximiz_renewal_tracker?${params.toString()}`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch renewal pipeline: ${response.status}`);
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching renewal pipeline:', error);
      throw error;
    }
  }

  async getProductBenchmarkData() {
    try {
      const params = new URLSearchParams();
      params.append('sysparm_display_value', 'all');
      params.append('sysparm_limit', '1000');
      params.append('sysparm_query', 'ORDERBYproduct_name');

      const response = await fetch(
        `${this.baseUrl}/x_hete_clv_maximiz_product_performance?${params.toString()}`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch product benchmark data: ${response.status}`);
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching product benchmark data:', error);
      throw error;
    }
  }

  async getCompetitorData() {
    try {
      const params = new URLSearchParams();
      params.append('sysparm_display_value', 'all');
      params.append('sysparm_limit', '1000');

      const response = await fetch(
        `${this.baseUrl}/x_hete_clv_maximiz_competitor_benchmark?${params.toString()}`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch competitor data: ${response.status}`);
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching competitor data:', error);
      // Return empty array if no data exists yet
      return [];
    }
  }

  // NEW: Enhanced Campaign Performance Report
  async getCampaignPerformanceReport() {
    try {
      const params = new URLSearchParams();
      params.append('sysparm_display_value', 'all');
      params.append('sysparm_limit', '1000');
      params.append('sysparm_query', 'ORDERBYDESCsys_created_on');

      const response = await fetch(
        `${this.baseUrl}/x_hete_clv_maximiz_campaigns?${params.toString()}`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch campaign data: ${response.status}`);
      }

      const data = await response.json();
      return this.processCampaignData(data.result || []);
    } catch (error) {
      console.error('Error fetching campaign data:', error);
      return {
        summary: { total: 0, launched: 0, scheduled: 0, completed: 0 },
        byType: {},
        byChannel: {},
        byTier: {},
        byPriority: {},
        recentCampaigns: []
      };
    }
  }

  // NEW: Competitor Benchmark Analysis Report
  async getCompetitorBenchmarkReport() {
    try {
      const params = new URLSearchParams();
      params.append('sysparm_display_value', 'all');
      params.append('sysparm_limit', '1000');
      params.append('sysparm_query', 'ORDERBYcompetitor_name');

      const response = await fetch(
        `${this.baseUrl}/x_hete_clv_maximiz_competitor_benchmark?${params.toString()}`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch competitor benchmark data: ${response.status}`);
      }

      const data = await response.json();
      return this.processCompetitorBenchmarkData(data.result || []);
    } catch (error) {
      console.error('Error fetching competitor benchmark data:', error);
      return {
        summary: { totalCompetitors: 0, avgMarketShare: 0, avgSatisfaction: 0 },
        byCategory: {},
        marketShareAnalysis: [],
        performanceGaps: []
      };
    }
  }

  // NEW: Product Performance Analysis Report
  async getProductPerformanceReport() {
    try {
      const params = new URLSearchParams();
      params.append('sysparm_display_value', 'all');
      params.append('sysparm_limit', '1000');
      params.append('sysparm_query', 'ORDERBYproduct_name');

      const response = await fetch(
        `${this.baseUrl}/x_hete_clv_maximiz_product_performance?${params.toString()}`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch product performance data: ${response.status}`);
      }

      const data = await response.json();
      return this.processProductPerformanceData(data.result || []);
    } catch (error) {
      console.error('Error fetching product performance data:', error);
      return {
        summary: { totalProducts: 0, strongProducts: 0, challengedProducts: 0 },
        performanceMatrix: [],
        competitiveAnalysis: []
      };
    }
  }

  // NEW: Customer Intelligence Report
  async getCustomerIntelligenceReport() {
    try {
      const params = new URLSearchParams();
      params.append('sysparm_display_value', 'all');
      params.append('sysparm_limit', '1000');
      params.append('sysparm_query', 'ORDERBYtier');

      const response = await fetch(
        `${this.baseUrl}/x_hete_clv_maximiz_policy_holders?${params.toString()}`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch policy holders data: ${response.status}`);
      }

      const data = await response.json();
      return this.processPolicyHoldersData(data.result || []);
    } catch (error) {
      console.error('Error fetching policy holders data:', error);
      return {
        demographics: {},
        riskDistribution: {},
        engagementMetrics: {},
        clvAnalysis: {},
        churnRiskAnalysis: {}
      };
    }
  }

  // Data processing methods
  processCampaignData(campaigns) {
    const summary = {
      total: campaigns.length,
      launched: campaigns.filter(c => this.getValue(c.status) === 'launched').length,
      scheduled: campaigns.filter(c => this.getValue(c.status) === 'scheduled').length,
      completed: campaigns.filter(c => this.getValue(c.status) === 'completed').length,
      draft: campaigns.filter(c => this.getValue(c.status) === 'draft').length
    };

    const byType = this.groupBy(campaigns, 'campaign_type');
    const byChannel = this.groupBy(campaigns, 'channel');
    const byTier = this.groupBy(campaigns, 'customer_tier');
    const byPriority = this.groupBy(campaigns, 'priority');

    const recentCampaigns = campaigns
      .sort((a, b) => new Date(this.getValue(b.sys_created_on)) - new Date(this.getValue(a.sys_created_on)))
      .slice(0, 10)
      .map(campaign => ({
        name: this.getValue(campaign.campaign_name),
        type: this.getValue(campaign.campaign_type),
        channel: this.getValue(campaign.channel),
        status: this.getValue(campaign.status),
        priority: this.getValue(campaign.priority),
        launchDate: this.getValue(campaign.launch_date),
        estimatedReach: this.getValue(campaign.estimated_reach)
      }));

    return { summary, byType, byChannel, byTier, byPriority, recentCampaigns };
  }

  processCompetitorBenchmarkData(competitors) {
    const summary = {
      totalCompetitors: competitors.length,
      avgMarketShare: this.calculateAverage(competitors, 'market_share'),
      avgSatisfaction: this.calculateAverage(competitors, 'customer_satisfaction'),
      avgRenewalRate: this.calculateAverage(competitors, 'renewal_rate')
    };

    const byCategory = this.groupBy(competitors, 'product_category');
    
    const marketShareAnalysis = competitors.map(comp => ({
      name: this.getValue(comp.competitor_name),
      category: this.getValue(comp.product_category),
      marketShare: this.getValue(comp.market_share),
      renewalRate: this.getValue(comp.renewal_rate),
      avgPremium: this.getValue(comp.avg_premium),
      satisfaction: this.getValue(comp.customer_satisfaction),
      claimsRatio: this.getValue(comp.claims_ratio)
    })).sort((a, b) => (b.marketShare || 0) - (a.marketShare || 0));

    const performanceGaps = Object.entries(byCategory).map(([category, comps]) => {
      const avgMarketShare = this.calculateAverage(comps, 'market_share');
      const avgSatisfaction = this.calculateAverage(comps, 'customer_satisfaction');
      const topCompetitor = comps.reduce((prev, current) => 
        (this.getValue(current.market_share) > this.getValue(prev.market_share)) ? current : prev
      );

      return {
        category,
        competitorCount: comps.length,
        avgMarketShare,
        avgSatisfaction,
        topCompetitor: this.getValue(topCompetitor.competitor_name),
        topMarketShare: this.getValue(topCompetitor.market_share)
      };
    });

    return { summary, byCategory, marketShareAnalysis, performanceGaps };
  }

  processProductPerformanceData(products) {
    const summary = {
      totalProducts: products.length,
      strongProducts: products.filter(p => this.getValue(p.performance_label) === 'strong').length,
      competitiveProducts: products.filter(p => this.getValue(p.performance_label) === 'competitive').length,
      challengedProducts: products.filter(p => this.getValue(p.performance_label) === 'challenged').length
    };

    const performanceMatrix = products.map(product => ({
      name: this.getValue(product.product_name),
      performanceLabel: this.getValue(product.performance_label),
      premiumVsComp1: this.getValue(product.premium_vs_competitor_1),
      premiumVsComp2: this.getValue(product.premium_vs_competitor_2),
      renewalVsComp1: this.getValue(product.renewal_vs_competitor_1),
      renewalVsComp2: this.getValue(product.renewal_vs_competitor_2),
      claimsRatio: this.getValue(product.our_claims_ratio),
      addOnRate: this.getValue(product.our_add_on_rate)
    }));

    const competitiveAnalysis = performanceMatrix.map(product => {
      const avgPremiumAdvantage = ((product.premiumVsComp1 || 100) + (product.premiumVsComp2 || 100)) / 2 - 100;
      const avgRenewalAdvantage = ((product.renewalVsComp1 || 100) + (product.renewalVsComp2 || 100)) / 2 - 100;
      
      return {
        ...product,
        avgPremiumAdvantage: avgPremiumAdvantage.toFixed(1),
        avgRenewalAdvantage: avgRenewalAdvantage.toFixed(1),
        overallScore: ((avgPremiumAdvantage + avgRenewalAdvantage) / 2).toFixed(1)
      };
    }).sort((a, b) => parseFloat(b.overallScore) - parseFloat(a.overallScore));

    return { summary, performanceMatrix, competitiveAnalysis };
  }

  processPolicyHoldersData(policyHolders) {
    const demographics = {
      totalCustomers: policyHolders.length,
      avgAge: this.calculateAverage(policyHolders, 'age'),
      avgTenure: this.calculateAverage(policyHolders, 'tenure_years'),
      tierDistribution: this.groupBy(policyHolders, 'tier')
    };

    const riskDistribution = {
      byRiskLevel: this.groupBy(policyHolders, 'risk'),
      highRiskCount: policyHolders.filter(p => this.getValue(p.risk) === 'high').length,
      avgChurnRisk: this.calculateAverage(policyHolders, 'churn_risk'),
      bankruptcyRate: (policyHolders.filter(p => this.getValue(p.bankruptcies_flag) === true).length / policyHolders.length) * 100
    };

    const engagementMetrics = {
      avgEngagementScore: this.calculateAverage(policyHolders, 'engagement_score'),
      avgAppSessions: this.calculateAverage(policyHolders, 'app_sessions_30_days'),
      avgWebsiteVisits: this.calculateAverage(policyHolders, 'website_visits_30_days'),
      avgSessionTime: this.calculateAverage(policyHolders, 'avg_session_time_min'),
      channelPreference: this.groupBy(policyHolders, 'preferred_channel')
    };

    const clvAnalysis = {
      avgCLV: this.calculateAverage(policyHolders, 'lifetime_value'),
      avgCLV12Month: this.calculateAverage(policyHolders, 'clv'),
      avgCLVScore: this.calculateAverage(policyHolders, 'clv_score'),
      clvByTier: this.calculateCLVByTier(policyHolders),
      highValueCustomers: policyHolders.filter(p => this.getValue(p.lifetime_value) > 50000).length
    };

    const churnRiskAnalysis = {
      highChurnRisk: policyHolders.filter(p => this.getValue(p.churn_risk) > 70).length,
      mediumChurnRisk: policyHolders.filter(p => this.getValue(p.churn_risk) > 40 && this.getValue(p.churn_risk) <= 70).length,
      lowChurnRisk: policyHolders.filter(p => this.getValue(p.churn_risk) <= 40).length,
      riskFactors: this.analyzeRiskFactors(policyHolders)
    };

    return { demographics, riskDistribution, engagementMetrics, clvAnalysis, churnRiskAnalysis };
  }

  // Helper methods
  getValue(field) {
    if (typeof field === 'object' && field !== null && field.display_value !== undefined) {
      return field.display_value;
    }
    return field;
  }

  groupBy(array, field) {
    return array.reduce((groups, item) => {
      const key = this.getValue(item[field]) || 'Unknown';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  }

  calculateAverage(array, field) {
    if (array.length === 0) return 0;
    const validValues = array
      .map(item => parseFloat(this.getValue(item[field])))
      .filter(value => !isNaN(value));
    
    if (validValues.length === 0) return 0;
    return validValues.reduce((sum, value) => sum + value, 0) / validValues.length;
  }

  calculateCLVByTier(policyHolders) {
    const tierGroups = this.groupBy(policyHolders, 'tier');
    const result = {};
    
    for (const [tier, customers] of Object.entries(tierGroups)) {
      result[tier] = {
        count: customers.length,
        avgCLV: this.calculateAverage(customers, 'lifetime_value'),
        avgCLV12Month: this.calculateAverage(customers, 'clv')
      };
    }
    
    return result;
  }

  analyzeRiskFactors(policyHolders) {
    const riskFactors = [];
    
    // Credit score risk
    const lowCreditScore = policyHolders.filter(p => this.getValue(p.credit_score) < 600).length;
    riskFactors.push({
      factor: 'Low Credit Score (<600)',
      count: lowCreditScore,
      percentage: (lowCreditScore / policyHolders.length * 100).toFixed(1)
    });

    // High credit utilization
    const highUtilization = policyHolders.filter(p => this.getValue(p.credit_utilization_percent) > 80).length;
    riskFactors.push({
      factor: 'High Credit Utilization (>80%)',
      count: highUtilization,
      percentage: (highUtilization / policyHolders.length * 100).toFixed(1)
    });

    // Recent bankruptcies
    const bankruptcies = policyHolders.filter(p => this.getValue(p.bankruptcies_flag) === true).length;
    riskFactors.push({
      factor: 'Bankruptcy History',
      count: bankruptcies,
      percentage: (bankruptcies / policyHolders.length * 100).toFixed(1)
    });

    // Multiple delinquencies
    const delinquencies = policyHolders.filter(p => this.getValue(p.delinquency_12m) > 2).length;
    riskFactors.push({
      factor: 'Multiple Delinquencies (>2 in 12m)',
      count: delinquencies,
      percentage: (delinquencies / policyHolders.length * 100).toFixed(1)
    });

    return riskFactors;
  }

  formatCurrency(amount) {
    if (typeof amount === 'object' && amount.display_value) {
      return `$${parseFloat(amount.display_value).toLocaleString()}`;
    }
    const numAmount = parseFloat(amount) || 0;
    return `$${numAmount.toLocaleString()}`;
  }

  formatPercentage(value) {
    if (typeof value === 'object' && value.display_value) {
      return `${parseFloat(value.display_value).toFixed(1)}%`;
    }
    const numValue = parseFloat(value) || 0;
    return `${numValue.toFixed(1)}%`;
  }

  formatDecimal(value, places = 2) {
    if (typeof value === 'object' && value.display_value) {
      return parseFloat(value.display_value).toFixed(places);
    }
    const numValue = parseFloat(value) || 0;
    return numValue.toFixed(places);
  }

  getStatusColor(status) {
    const statusValue = typeof status === 'object' ? status.display_value : status;
    
    switch (statusValue?.toLowerCase()) {
      case 'confirmed':
      case 'launched':
      case 'completed':
        return '#10b981'; // green
      case 'in_progress':
      case 'scheduled':
        return '#3b82f6'; // blue
      case 'pending':
      case 'draft':
        return '#f59e0b'; // amber
      case 'at_risk':
      case 'cancelled':
        return '#dc2626'; // red
      default:
        return '#6b7280'; // gray
    }
  }

  getPerformanceColor(label) {
    const labelValue = typeof label === 'object' ? label.display_value : label;
    
    switch (labelValue?.toLowerCase()) {
      case 'strong':
        return '#10b981'; // green
      case 'competitive':
        return '#f59e0b'; // amber
      case 'challenged':
        return '#dc2626'; // red
      default:
        return '#6b7280'; // gray
    }
  }

  getDeltaColor(value) {
    const numValue = typeof value === 'object' ? parseFloat(value.display_value) : parseFloat(value);
    return numValue >= 0 ? '#10b981' : '#dc2626'; // green for positive, red for negative
  }

  getRiskColor(risk) {
    const riskValue = typeof risk === 'object' ? risk.display_value : risk;
    
    switch (riskValue?.toLowerCase()) {
      case 'low':
        return '#10b981'; // green
      case 'medium':
        return '#f59e0b'; // amber
      case 'high':
        return '#dc2626'; // red
      default:
        return '#6b7280'; // gray
    }
  }
}