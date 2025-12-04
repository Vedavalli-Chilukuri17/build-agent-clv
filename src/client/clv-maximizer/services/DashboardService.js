export class DashboardService {
  constructor() {
    this.baseUrl = '/api/now/table';
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-UserToken': window.g_ck
    };
  }

  // NEW: Enhanced Dashboard Reports using Policy Holders Data
  async getComprehensiveDashboardReports() {
    try {
      const policyHolders = await this.getPolicyHoldersData();
      
      return {
        customerMetrics: this.calculateCustomerMetrics(policyHolders),
        riskAnalytics: this.calculateRiskAnalytics(policyHolders),
        clvAnalytics: this.calculateCLVAnalytics(policyHolders),
        engagementMetrics: this.calculateEngagementMetrics(policyHolders),
        renewalAnalytics: this.calculateRenewalAnalytics(policyHolders),
        tierAnalytics: this.calculateTierAnalytics(policyHolders),
        creditRiskInsights: this.calculateCreditRiskInsights(policyHolders),
        channelPreferences: this.calculateChannelPreferences(policyHolders)
      };
    } catch (error) {
      console.error('Error fetching comprehensive dashboard reports:', error);
      throw error;
    }
  }

  async getPolicyHoldersData() {
    try {
      const params = new URLSearchParams();
      params.append('sysparm_display_value', 'all');
      params.append('sysparm_limit', '1000');

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
      return data.result || [];
    } catch (error) {
      console.error('Error fetching policy holders data:', error);
      throw error;
    }
  }

  // Customer Metrics Report
  calculateCustomerMetrics(policyHolders) {
    const totalCustomers = policyHolders.length;
    
    const avgAge = this.calculateAverage(policyHolders, 'age');
    const avgTenure = this.calculateAverage(policyHolders, 'tenure_years');
    
    const tierDistribution = this.groupByField(policyHolders, 'tier');
    const highValueCustomers = policyHolders.filter(p => {
      const tier = this.getValue(p.tier);
      return tier === 'platinum' || tier === 'gold';
    }).length;

    const ageGroups = {
      'Under 30': policyHolders.filter(p => this.getValue(p.age) < 30).length,
      '30-45': policyHolders.filter(p => {
        const age = this.getValue(p.age);
        return age >= 30 && age <= 45;
      }).length,
      '46-60': policyHolders.filter(p => {
        const age = this.getValue(p.age);
        return age >= 46 && age <= 60;
      }).length,
      'Over 60': policyHolders.filter(p => this.getValue(p.age) > 60).length
    };

    return {
      totalCustomers,
      highValueCustomers,
      avgAge: Math.round(avgAge),
      avgTenure: Math.round(avgTenure * 10) / 10,
      tierDistribution,
      ageGroups,
      percentageHighValue: totalCustomers > 0 ? Math.round((highValueCustomers / totalCustomers) * 100) : 0
    };
  }

  // Risk Analytics Report
  calculateRiskAnalytics(policyHolders) {
    const riskLevelDistribution = this.groupByField(policyHolders, 'risk');
    
    const avgChurnRisk = this.calculateAverage(policyHolders, 'churn_risk');
    
    const highChurnRisk = policyHolders.filter(p => this.getValue(p.churn_risk) > 70).length;
    const mediumChurnRisk = policyHolders.filter(p => {
      const risk = this.getValue(p.churn_risk);
      return risk > 40 && risk <= 70;
    }).length;
    const lowChurnRisk = policyHolders.filter(p => this.getValue(p.churn_risk) <= 40).length;

    const bankruptcyRate = policyHolders.filter(p => this.getValue(p.bankruptcies_flag) === true).length;
    
    const creditRiskFactors = {
      lowCreditScore: policyHolders.filter(p => this.getValue(p.credit_score) < 600).length,
      highUtilization: policyHolders.filter(p => this.getValue(p.credit_utilization_percent) > 80).length,
      bankruptcies: bankruptcyRate,
      multipleDelinquencies: policyHolders.filter(p => this.getValue(p.delinquency_12m) > 2).length
    };

    return {
      riskLevelDistribution,
      avgChurnRisk: Math.round(avgChurnRisk),
      churnRiskDistribution: {
        high: highChurnRisk,
        medium: mediumChurnRisk,
        low: lowChurnRisk
      },
      creditRiskFactors,
      bankruptcyRate: Math.round((bankruptcyRate / policyHolders.length) * 100)
    };
  }

  // CLV Analytics Report
  calculateCLVAnalytics(policyHolders) {
    const avgLifetimeValue = this.calculateAverage(policyHolders, 'lifetime_value');
    const avgCLV12Month = this.calculateAverage(policyHolders, 'clv');
    const avgCLVScore = this.calculateAverage(policyHolders, 'clv_score');

    const clvBands = {
      high: policyHolders.filter(p => this.getValue(p.lifetime_value) > 50000).length,
      medium: policyHolders.filter(p => {
        const ltv = this.getValue(p.lifetime_value);
        return ltv >= 20000 && ltv <= 50000;
      }).length,
      low: policyHolders.filter(p => this.getValue(p.lifetime_value) < 20000).length
    };

    const clvByTier = {};
    const tierGroups = this.groupByField(policyHolders, 'tier');
    
    for (const [tier, customers] of Object.entries(tierGroups)) {
      clvByTier[tier] = {
        count: customers.length,
        avgLifetimeValue: Math.round(this.calculateAverageFromGroup(customers, 'lifetime_value')),
        avgCLV12Month: Math.round(this.calculateAverageFromGroup(customers, 'clv'))
      };
    }

    return {
      avgLifetimeValue: Math.round(avgLifetimeValue),
      avgCLV12Month: Math.round(avgCLV12Month),
      avgCLVScore: Math.round(avgCLVScore * 10) / 10,
      clvBands,
      clvByTier,
      topValueCustomers: policyHolders
        .sort((a, b) => this.getValue(b.lifetime_value) - this.getValue(a.lifetime_value))
        .slice(0, 10)
        .map(p => ({
          name: this.getValue(p.name) || `${this.getValue(p.first_name)} ${this.getValue(p.last_name)}`,
          tier: this.getValue(p.tier),
          lifetimeValue: this.getValue(p.lifetime_value),
          clv12Month: this.getValue(p.clv)
        }))
    };
  }

  // Engagement Metrics Report
  calculateEngagementMetrics(policyHolders) {
    const avgEngagementScore = this.calculateAverage(policyHolders, 'engagement_score');
    const avgAppSessions = this.calculateAverage(policyHolders, 'app_sessions_30_days');
    const avgWebsiteVisits = this.calculateAverage(policyHolders, 'website_visits_30_days');
    const avgSessionTime = this.calculateAverage(policyHolders, 'avg_session_time_min');
    const avgQuoteViews = this.calculateAverage(policyHolders, 'quote_views');

    const engagementLevels = {
      high: policyHolders.filter(p => this.getValue(p.engagement_score) > 80).length,
      medium: policyHolders.filter(p => {
        const score = this.getValue(p.engagement_score);
        return score >= 50 && score <= 80;
      }).length,
      low: policyHolders.filter(p => this.getValue(p.engagement_score) < 50).length
    };

    const digitalAdoption = {
      activeAppUsers: policyHolders.filter(p => this.getValue(p.app_sessions_30_days) > 0).length,
      frequentWebUsers: policyHolders.filter(p => this.getValue(p.website_visits_30_days) > 5).length,
      abandonedJourneys: this.calculateAverage(policyHolders, 'abandoned_journeys')
    };

    return {
      avgEngagementScore: Math.round(avgEngagementScore),
      avgAppSessions: Math.round(avgAppSessions),
      avgWebsiteVisits: Math.round(avgWebsiteVisits),
      avgSessionTime: Math.round(avgSessionTime),
      avgQuoteViews: Math.round(avgQuoteViews),
      engagementLevels,
      digitalAdoption: {
        ...digitalAdoption,
        avgAbandonedJourneys: Math.round(digitalAdoption.abandonedJourneys)
      }
    };
  }

  // Renewal Analytics Report
  calculateRenewalAnalytics(policyHolders) {
    const now = new Date();
    const next30Days = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    const next60Days = new Date(now.getTime() + (60 * 24 * 60 * 60 * 1000));
    const next90Days = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000));

    const renewalPipeline = {
      next30Days: policyHolders.filter(p => {
        const renewalDate = this.getValue(p.renewal_date);
        if (!renewalDate) return false;
        const rDate = new Date(renewalDate);
        return rDate >= now && rDate <= next30Days;
      }).length,
      next60Days: policyHolders.filter(p => {
        const renewalDate = this.getValue(p.renewal_date);
        if (!renewalDate) return false;
        const rDate = new Date(renewalDate);
        return rDate > next30Days && rDate <= next60Days;
      }).length,
      next90Days: policyHolders.filter(p => {
        const renewalDate = this.getValue(p.renewal_date);
        if (!renewalDate) return false;
        const rDate = new Date(renewalDate);
        return rDate > next60Days && rDate <= next90Days;
      }).length
    };

    const atRiskRenewals = policyHolders.filter(p => {
      const renewalDate = this.getValue(p.renewal_date);
      const churnRisk = this.getValue(p.churn_risk);
      if (!renewalDate) return false;
      const rDate = new Date(renewalDate);
      return rDate <= next90Days && churnRisk > 60;
    });

    const renewalsByTier = {};
    const tierGroups = this.groupByField(policyHolders, 'tier');
    
    for (const [tier, customers] of Object.entries(tierGroups)) {
      renewalsByTier[tier] = customers.filter(p => {
        const renewalDate = this.getValue(p.renewal_date);
        if (!renewalDate) return false;
        const rDate = new Date(renewalDate);
        return rDate <= next90Days;
      }).length;
    }

    return {
      renewalPipeline,
      totalUpcomingRenewals: renewalPipeline.next30Days + renewalPipeline.next60Days + renewalPipeline.next90Days,
      atRiskRenewals: atRiskRenewals.length,
      renewalsByTier,
      highValueAtRisk: atRiskRenewals.filter(p => {
        const tier = this.getValue(p.tier);
        return tier === 'platinum' || tier === 'gold';
      }).length
    };
  }

  // Tier Analytics Report
  calculateTierAnalytics(policyHolders) {
    const tierGroups = this.groupByField(policyHolders, 'tier');
    const tierAnalytics = {};

    for (const [tier, customers] of Object.entries(tierGroups)) {
      tierAnalytics[tier] = {
        count: customers.length,
        avgLifetimeValue: Math.round(this.calculateAverageFromGroup(customers, 'lifetime_value')),
        avgCLV12Month: Math.round(this.calculateAverageFromGroup(customers, 'clv')),
        avgEngagementScore: Math.round(this.calculateAverageFromGroup(customers, 'engagement_score')),
        avgChurnRisk: Math.round(this.calculateAverageFromGroup(customers, 'churn_risk')),
        avgTenure: Math.round(this.calculateAverageFromGroup(customers, 'tenure_years') * 10) / 10,
        highRiskCustomers: customers.filter(p => this.getValue(p.churn_risk) > 60).length
      };
    }

    return {
      tierDistribution: tierGroups,
      tierAnalytics,
      tierPerformanceRanking: Object.entries(tierAnalytics)
        .sort((a, b) => b[1].avgLifetimeValue - a[1].avgLifetimeValue)
        .map(([tier, data]) => ({ tier, ...data }))
    };
  }

  // Credit Risk Insights Report
  calculateCreditRiskInsights(policyHolders) {
    const avgCreditScore = this.calculateAverage(policyHolders, 'credit_score');
    const avgCreditUtilization = this.calculateAverage(policyHolders, 'credit_utilization_percent');
    
    const creditScoreBands = {
      excellent: policyHolders.filter(p => this.getValue(p.credit_score) >= 750).length,
      good: policyHolders.filter(p => {
        const score = this.getValue(p.credit_score);
        return score >= 670 && score < 750;
      }).length,
      fair: policyHolders.filter(p => {
        const score = this.getValue(p.credit_score);
        return score >= 580 && score < 670;
      }).length,
      poor: policyHolders.filter(p => this.getValue(p.credit_score) < 580).length
    };

    const riskIndicators = {
      highUtilization: policyHolders.filter(p => this.getValue(p.credit_utilization_percent) > 80).length,
      recentInquiries: policyHolders.filter(p => this.getValue(p.credit_inquiries_last_6m) > 3).length,
      bankruptcies: policyHolders.filter(p => this.getValue(p.bankruptcies_flag) === true).length,
      multipleDelinquencies: policyHolders.filter(p => this.getValue(p.delinquency_12m) > 2).length
    };

    return {
      avgCreditScore: Math.round(avgCreditScore),
      avgCreditUtilization: Math.round(avgCreditUtilization),
      creditScoreBands,
      riskIndicators,
      overallRiskProfile: this.calculateOverallRiskProfile(policyHolders)
    };
  }

  // Channel Preferences Report
  calculateChannelPreferences(policyHolders) {
    const channelDistribution = this.groupByField(policyHolders, 'preferred_channel');
    
    const channelEngagement = {};
    for (const [channel, customers] of Object.entries(channelDistribution)) {
      channelEngagement[channel] = {
        count: customers.length,
        avgEngagementScore: Math.round(this.calculateAverageFromGroup(customers, 'engagement_score')),
        avgCLV: Math.round(this.calculateAverageFromGroup(customers, 'lifetime_value'))
      };
    }

    return {
      channelDistribution,
      channelEngagement,
      mostEngagedChannel: Object.entries(channelEngagement)
        .sort((a, b) => b[1].avgEngagementScore - a[1].avgEngagementScore)[0],
      highestValueChannel: Object.entries(channelEngagement)
        .sort((a, b) => b[1].avgCLV - a[1].avgCLV)[0]
    };
  }

  // Helper methods
  getValue(field) {
    if (typeof field === 'object' && field !== null && field.display_value !== undefined) {
      return field.display_value;
    }
    return field;
  }

  calculateAverage(array, field) {
    if (array.length === 0) return 0;
    const validValues = array
      .map(item => parseFloat(this.getValue(item[field])))
      .filter(value => !isNaN(value) && value !== null);
    
    if (validValues.length === 0) return 0;
    return validValues.reduce((sum, value) => sum + value, 0) / validValues.length;
  }

  calculateAverageFromGroup(group, field) {
    return this.calculateAverage(group, field);
  }

  groupByField(array, field) {
    return array.reduce((groups, item) => {
      const key = this.getValue(item[field]) || 'Unknown';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  }

  calculateOverallRiskProfile(policyHolders) {
    let lowRisk = 0;
    let mediumRisk = 0;
    let highRisk = 0;

    policyHolders.forEach(p => {
      const creditScore = this.getValue(p.credit_score);
      const churnRisk = this.getValue(p.churn_risk);
      const utilization = this.getValue(p.credit_utilization_percent);
      const bankruptcies = this.getValue(p.bankruptcies_flag);

      let riskFactors = 0;
      if (creditScore < 600) riskFactors++;
      if (churnRisk > 60) riskFactors++;
      if (utilization > 80) riskFactors++;
      if (bankruptcies === true) riskFactors++;

      if (riskFactors >= 3) highRisk++;
      else if (riskFactors >= 1) mediumRisk++;
      else lowRisk++;
    });

    return { lowRisk, mediumRisk, highRisk };
  }

  // Legacy methods for backward compatibility
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

  // Formatting helper methods
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