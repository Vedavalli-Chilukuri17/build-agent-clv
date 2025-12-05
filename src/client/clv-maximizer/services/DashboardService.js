export class DashboardService {
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

  // Main method to get comprehensive dashboard data using the policy holders table
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
        channelPreferences: this.calculateChannelPreferences(policyHolders),
        churnRiskHeatmapData: this.calculateChurnRiskHeatmapData(policyHolders),
        renewalTimelineData: this.calculateRenewalTimelineData(policyHolders)
      };
    } catch (error) {
      console.error('Error fetching comprehensive dashboard reports:', error);
      throw error;
    }
  }

  // Fetch policy holders data from the actual table
  async getPolicyHoldersData() {
    try {
      const params = new URLSearchParams();
      params.append('sysparm_display_value', 'all');
      params.append('sysparm_limit', '1000');

      const response = await fetch(
        `${this.baseUrl}/x_hete_clv_maximiz_policy_holders?${params.toString()}`,
        {
          method: 'GET',
          headers: this.getHeaders()
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

  // Calculate Churn Risk Heatmap Data using actual field names
  calculateChurnRiskHeatmapData(policyHolders) {
    const totalCustomers = policyHolders.length;

    // Categorize customers by churn risk using the churn_risk field
    const highRiskCustomers = policyHolders.filter(p => {
      const churnRisk = this.getValue(p.churn_risk) || 0;
      return parseFloat(churnRisk) > 30;
    });

    const mediumRiskCustomers = policyHolders.filter(p => {
      const churnRisk = this.getValue(p.churn_risk) || 0;
      const risk = parseFloat(churnRisk);
      return risk >= 15 && risk <= 30;
    });

    const lowRiskCustomers = policyHolders.filter(p => {
      const churnRisk = this.getValue(p.churn_risk) || 0;
      return parseFloat(churnRisk) < 15;
    });

    return {
      summaryMetrics: {
        totalCustomers: totalCustomers,
        avgChurnRisk: this.calculateAverage(policyHolders, 'churn_risk'),
        highRiskCount: highRiskCustomers.length,
        mediumRiskCount: mediumRiskCustomers.length,
        lowRiskCount: lowRiskCustomers.length
      },
      churnDistribution: {
        high: {
          count: highRiskCustomers.length,
          percentage: totalCustomers > 0 ? ((highRiskCustomers.length / totalCustomers) * 100).toFixed(1) : '0.0',
          customers: highRiskCustomers.map(p => ({
            customerId: this.getValue(p.customer_id) || this.getValue(p.sys_id),
            name: this.getValue(p.name) || `${this.getValue(p.first_name)} ${this.getValue(p.last_name)}`,
            churnRisk: this.getValue(p.churn_risk),
            tier: this.getValue(p.tier),
            lifetimeValue: this.getValue(p.lifetime_value)
          }))
        },
        medium: {
          count: mediumRiskCustomers.length,
          percentage: totalCustomers > 0 ? ((mediumRiskCustomers.length / totalCustomers) * 100).toFixed(1) : '0.0',
          customers: mediumRiskCustomers.map(p => ({
            customerId: this.getValue(p.customer_id) || this.getValue(p.sys_id),
            name: this.getValue(p.name) || `${this.getValue(p.first_name)} ${this.getValue(p.last_name)}`,
            churnRisk: this.getValue(p.churn_risk),
            tier: this.getValue(p.tier),
            lifetimeValue: this.getValue(p.lifetime_value)
          }))
        },
        low: {
          count: lowRiskCustomers.length,
          percentage: totalCustomers > 0 ? ((lowRiskCustomers.length / totalCustomers) * 100).toFixed(1) : '0.0',
          customers: lowRiskCustomers.map(p => ({
            customerId: this.getValue(p.customer_id) || this.getValue(p.sys_id),
            name: this.getValue(p.name) || `${this.getValue(p.first_name)} ${this.getValue(p.last_name)}`,
            churnRisk: this.getValue(p.churn_risk),
            tier: this.getValue(p.tier),
            lifetimeValue: this.getValue(p.lifetime_value)
          }))
        }
      }
    };
  }

  // Calculate Renewal Timeline Data using actual renewal_date field
  calculateRenewalTimelineData(policyHolders) {
    const now = new Date();
    const next30Days = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    const next60Days = new Date(now.getTime() + (60 * 24 * 60 * 60 * 1000));
    const next90Days = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000));

    // Filter customers by renewal date ranges
    const next30DaysCustomers = policyHolders.filter(p => {
      const renewalDate = this.getValue(p.renewal_date);
      if (!renewalDate) return false;
      const rDate = new Date(renewalDate);
      return rDate >= now && rDate <= next30Days;
    });

    const days31to60Customers = policyHolders.filter(p => {
      const renewalDate = this.getValue(p.renewal_date);
      if (!renewalDate) return false;
      const rDate = new Date(renewalDate);
      return rDate > next30Days && rDate <= next60Days;
    });

    const days61to90Customers = policyHolders.filter(p => {
      const renewalDate = this.getValue(p.renewal_date);
      if (!renewalDate) return false;
      const rDate = new Date(renewalDate);
      return rDate > next60Days && rDate <= next90Days;
    });

    // Check for high-risk renewals in next 30 days
    const urgentNext30 = next30DaysCustomers.filter(p => {
      const churnRisk = this.getValue(p.churn_risk) || 0;
      return parseFloat(churnRisk) > 30;
    }).length;

    return {
      next30: {
        count: next30DaysCustomers.length,
        color: '#ef4444', // red - urgent
        urgent: urgentNext30 > 0,
        customers: next30DaysCustomers.map(p => ({
          customerId: this.getValue(p.customer_id) || this.getValue(p.sys_id),
          name: this.getValue(p.name) || `${this.getValue(p.first_name)} ${this.getValue(p.last_name)}`,
          renewalDate: this.getValue(p.renewal_date),
          churnRisk: this.getValue(p.churn_risk),
          tier: this.getValue(p.tier),
          lifetimeValue: this.getValue(p.lifetime_value)
        }))
      },
      days31to60: {
        count: days31to60Customers.length,
        color: '#f59e0b', // amber - warning
        urgent: false,
        customers: days31to60Customers.map(p => ({
          customerId: this.getValue(p.customer_id) || this.getValue(p.sys_id),
          name: this.getValue(p.name) || `${this.getValue(p.first_name)} ${this.getValue(p.last_name)}`,
          renewalDate: this.getValue(p.renewal_date),
          churnRisk: this.getValue(p.churn_risk),
          tier: this.getValue(p.tier),
          lifetimeValue: this.getValue(p.lifetime_value)
        }))
      },
      days61to90: {
        count: days61to90Customers.length,
        color: '#10b981', // green - normal
        urgent: false,
        customers: days61to90Customers.map(p => ({
          customerId: this.getValue(p.customer_id) || this.getValue(p.sys_id),
          name: this.getValue(p.name) || `${this.getValue(p.first_name)} ${this.getValue(p.last_name)}`,
          renewalDate: this.getValue(p.renewal_date),
          churnRisk: this.getValue(p.churn_risk),
          tier: this.getValue(p.tier),
          lifetimeValue: this.getValue(p.lifetime_value)
        }))
      }
    };
  }

  // Calculate Customer Metrics using actual fields
  calculateCustomerMetrics(policyHolders) {
    const totalCustomers = policyHolders.length;
    
    const avgAge = this.calculateAverage(policyHolders, 'age');
    const avgTenure = this.calculateAverage(policyHolders, 'tenure_years');
    
    const tierDistribution = this.groupByField(policyHolders, 'tier');
    const highValueCustomers = policyHolders.filter(p => {
      const tier = this.getValue(p.tier);
      return tier === 'platinum' || tier === 'gold';
    }).length;

    return {
      totalCustomers,
      highValueCustomers,
      avgAge: Math.round(avgAge),
      avgTenure: Math.round(avgTenure * 10) / 10,
      tierDistribution,
      percentageHighValue: totalCustomers > 0 ? Math.round((highValueCustomers / totalCustomers) * 100) : 0
    };
  }

  // Calculate Risk Analytics using actual fields
  calculateRiskAnalytics(policyHolders) {
    const riskLevelDistribution = this.groupByField(policyHolders, 'risk');
    
    const avgChurnRisk = this.calculateAverage(policyHolders, 'churn_risk');
    
    const highChurnRisk = policyHolders.filter(p => this.getValue(p.churn_risk) > 30).length;
    const mediumChurnRisk = policyHolders.filter(p => {
      const risk = this.getValue(p.churn_risk);
      return risk >= 15 && risk <= 30;
    }).length;
    const lowChurnRisk = policyHolders.filter(p => this.getValue(p.churn_risk) < 15).length;

    const bankruptcyRate = policyHolders.filter(p => this.getValue(p.bankruptcies_flag) === '1').length;
    
    return {
      riskLevelDistribution,
      avgChurnRisk: Math.round(avgChurnRisk),
      churnRiskDistribution: {
        high: highChurnRisk,
        medium: mediumChurnRisk,
        low: lowChurnRisk
      },
      bankruptcyRate: Math.round((bankruptcyRate / policyHolders.length) * 100)
    };
  }

  // Calculate CLV Analytics using actual fields
  calculateCLVAnalytics(policyHolders) {
    const avgLifetimeValue = this.calculateAverage(policyHolders, 'lifetime_value');
    const avgCLV12Month = this.calculateAverage(policyHolders, 'clv');
    const avgCLVScore = this.calculateAverage(policyHolders, 'clv_score');

    const clvBands = {
      high: policyHolders.filter(p => this.getValue(p.lifetime_value) > 25000).length,
      medium: policyHolders.filter(p => {
        const ltv = this.getValue(p.lifetime_value);
        return ltv >= 10000 && ltv <= 25000;
      }).length,
      low: policyHolders.filter(p => this.getValue(p.lifetime_value) < 10000).length
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

  // Calculate Engagement Metrics using actual fields
  calculateEngagementMetrics(policyHolders) {
    const avgEngagementScore = this.calculateAverage(policyHolders, 'engagement_score');
    const avgAppSessions = this.calculateAverage(policyHolders, 'app_sessions_30_days');
    const avgWebsiteVisits = this.calculateAverage(policyHolders, 'website_visits_30_days');
    const avgSessionTime = this.calculateAverage(policyHolders, 'avg_session_time_min');
    const avgQuoteViews = this.calculateAverage(policyHolders, 'quote_views');

    const engagementLevels = {
      high: policyHolders.filter(p => this.getValue(p.engagement_score) > 70).length,
      medium: policyHolders.filter(p => {
        const score = this.getValue(p.engagement_score);
        return score >= 40 && score <= 70;
      }).length,
      low: policyHolders.filter(p => this.getValue(p.engagement_score) < 40).length
    };

    return {
      avgEngagementScore: Math.round(avgEngagementScore),
      avgAppSessions: Math.round(avgAppSessions),
      avgWebsiteVisits: Math.round(avgWebsiteVisits),
      avgSessionTime: Math.round(avgSessionTime),
      avgQuoteViews: Math.round(avgQuoteViews),
      engagementLevels
    };
  }

  // Calculate Renewal Analytics using actual fields
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
      return rDate <= next90Days && churnRisk > 30;
    });

    return {
      renewalPipeline,
      totalUpcomingRenewals: renewalPipeline.next30Days + renewalPipeline.next60Days + renewalPipeline.next90Days,
      atRiskRenewals: atRiskRenewals.length,
      highValueAtRisk: atRiskRenewals.filter(p => {
        const tier = this.getValue(p.tier);
        return tier === 'platinum' || tier === 'gold';
      }).length
    };
  }

  // Calculate Tier Analytics using actual fields
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
        highRiskCustomers: customers.filter(p => this.getValue(p.churn_risk) > 30).length
      };
    }

    return {
      tierDistribution: tierGroups,
      tierAnalytics
    };
  }

  // Calculate Credit Risk Insights using actual fields
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
      bankruptcies: policyHolders.filter(p => this.getValue(p.bankruptcies_flag) === '1').length,
      multipleDelinquencies: policyHolders.filter(p => this.getValue(p.delinquency_12m) > 2).length
    };

    return {
      avgCreditScore: Math.round(avgCreditScore),
      avgCreditUtilization: Math.round(avgCreditUtilization),
      creditScoreBands,
      riskIndicators
    };
  }

  // Calculate Channel Preferences using actual fields
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
}