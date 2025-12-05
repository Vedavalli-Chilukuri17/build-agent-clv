import React, { useState, useEffect, useMemo } from 'react';
import { DashboardService } from '../services/DashboardService.js';
import { CustomerIntelligenceService } from '../services/CustomerIntelligenceService.js';
import ChurnRiskHeatmap from './ChurnRiskHeatmap.jsx';
import RenewalTimelineHeatmap from './RenewalTimelineHeatmap.jsx';
import './EnhancedDashboard.css';

export default function EnhancedDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [customerIntelligenceData, setCustomerIntelligenceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState('overview');
  const [error, setError] = useState(null);
  
  const dashboardService = new DashboardService();
  const customerIntelligenceService = useMemo(() => new CustomerIntelligenceService(), []);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load both dashboard and customer intelligence data
      const [dashData, customerData] = await Promise.all([
        dashboardService.getComprehensiveDashboardReports(),
        customerIntelligenceService.generateCustomerAnalytics()
      ]);
      
      setDashboardData(dashData);
      setCustomerIntelligenceData(customerData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle heatmap drill-down interactions
  const handleHeatmapDrillDown = (type, value) => {
    console.log(`Drill down: ${type} = ${value}`);
    // You can implement navigation to detailed views here
    // For example, switching to Customer Analytics with filters
    if (type === 'churnRisk' || type === 'renewal_timeline') {
      setSelectedReport('customers');
    }
  };

  if (loading) {
    return (
      <div className="enhanced-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading Enhanced Analytics Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="enhanced-dashboard-error">
        <h3>Error Loading Dashboard</h3>
        <p>{error}</p>
        <button onClick={loadDashboardData} className="retry-button">Retry</button>
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="no-data">No dashboard data available</div>;
  }

  const renderOverviewReport = () => (
    <div className="overview-report">
      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-value">{dashboardData.customerMetrics.totalCustomers.toLocaleString()}</div>
            <div className="metric-label">Total Customers</div>
            <div className="metric-sublabel">Active Policy Holders</div>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">⭐</div>
          <div className="metric-content">
            <div className="metric-value">{dashboardData.customerMetrics.highValueCustomers.toLocaleString()}</div>
            <div className="metric-label">High-Value Customers</div>
            <div className="metric-sublabel">{dashboardData.customerMetrics.percentageHighValue}% of total</div>
          </div>
        </div>

        <div className="metric-card info">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-value">${dashboardData.clvAnalytics.avgLifetimeValue.toLocaleString()}</div>
            <div className="metric-label">Average Lifetime Value</div>
            <div className="metric-sublabel">${dashboardData.clvAnalytics.avgCLV12Month.toLocaleString()} 12-month</div>
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-icon">⚠️</div>
          <div className="metric-content">
            <div className="metric-value">{dashboardData.riskAnalytics.avgChurnRisk}%</div>
            <div className="metric-label">Average Churn Risk</div>
            <div className="metric-sublabel">{dashboardData.riskAnalytics.churnRiskDistribution.high} high risk</div>
          </div>
        </div>
      </div>

      {/* First Insights Row - Original 3 components */}
      <div className="insights-grid">
        <div className="insight-card">
          <h3>🏆 Customer Tier Distribution</h3>
          <div className="tier-breakdown">
            {Object.entries(dashboardData.customerMetrics.tierDistribution).map(([tier, customers]) => (
              <div key={tier} className={`tier-item ${tier}`}>
                <span className="tier-name">{tier.charAt(0).toUpperCase() + tier.slice(1)}</span>
                <span className="tier-count">{customers.length}</span>
                <div className="tier-bar">
                  <div 
                    className={`tier-fill ${tier}`} 
                    style={{width: `${(customers.length / dashboardData.customerMetrics.totalCustomers) * 100}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="insight-card">
          <h3>📊 Engagement Levels</h3>
          <div className="engagement-breakdown">
            <div className="engagement-item high">
              <span>High Engagement</span>
              <span>{dashboardData.engagementMetrics.engagementLevels.high}</span>
            </div>
            <div className="engagement-item medium">
              <span>Medium Engagement</span>
              <span>{dashboardData.engagementMetrics.engagementLevels.medium}</span>
            </div>
            <div className="engagement-item low">
              <span>Low Engagement</span>
              <span>{dashboardData.engagementMetrics.engagementLevels.low}</span>
            </div>
          </div>
          <div className="engagement-stats">
            <p>Avg Score: {dashboardData.engagementMetrics.avgEngagementScore}</p>
            <p>Avg App Sessions: {dashboardData.engagementMetrics.avgAppSessions}/month</p>
          </div>
        </div>

        <div className="insight-card">
          <h3>📅 Renewal Pipeline</h3>
          <div className="renewal-timeline">
            <div className="renewal-period">
              <div className="period-label">Next 30 Days</div>
              <div className="period-value urgent">{dashboardData.renewalAnalytics.renewalPipeline.next30Days}</div>
            </div>
            <div className="renewal-period">
              <div className="period-label">Next 60 Days</div>
              <div className="period-value warning">{dashboardData.renewalAnalytics.renewalPipeline.next60Days}</div>
            </div>
            <div className="renewal-period">
              <div className="period-label">Next 90 Days</div>
              <div className="period-value normal">{dashboardData.renewalAnalytics.renewalPipeline.next90Days}</div>
            </div>
          </div>
          <div className="renewal-alert">
            <strong>{dashboardData.renewalAnalytics.atRiskRenewals}</strong> at-risk renewals
          </div>
        </div>
      </div>

      {/* Second Insights Row - Risk Distribution + Heatmaps */}
      <div className="insights-grid">
        {/* Risk Distribution Card */}
        <div className="insight-card">
          <h3>🎯 Risk Distribution</h3>
          <div className="risk-breakdown">
            {Object.entries(dashboardData.riskAnalytics.riskLevelDistribution).map(([level, customers]) => (
              <div key={level} className={`risk-item ${level}`}>
                <span className="risk-level">{level.charAt(0).toUpperCase() + level.slice(1)} Risk</span>
                <span className="risk-count">{customers.length}</span>
              </div>
            ))}
          </div>
          <div className="credit-risk-summary">
            <p>Bankruptcy Rate: {dashboardData.riskAnalytics.bankruptcyRate}%</p>
            <p>Avg Credit Score: {dashboardData.creditRiskInsights.avgCreditScore}</p>
          </div>
        </div>

        {/* Renewal Timeline Heatmap Card */}
        {customerIntelligenceData && (
          <div className="insight-card heatmap-card">
            <RenewalTimelineHeatmap 
              renewalTimeline={customerIntelligenceData.renewalTimeline}
              onDrillDown={handleHeatmapDrillDown}
            />
          </div>
        )}

        {/* Churn Risk Heatmap Card */}
        {customerIntelligenceData && (
          <div className="insight-card heatmap-card">
            <ChurnRiskHeatmap 
              analytics={customerIntelligenceData} 
              onDrillDown={handleHeatmapDrillDown}
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderCustomerAnalytics = () => (
    <div className="customer-analytics">
      <h2>Customer Analytics</h2>
      
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Demographics Overview</h3>
          <div className="demographics-stats">
            <div className="stat-item">
              <span className="stat-label">Average Age</span>
              <span className="stat-value">{dashboardData.customerMetrics.avgAge} years</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average Tenure</span>
              <span className="stat-value">{dashboardData.customerMetrics.avgTenure} years</span>
            </div>
          </div>
          <div className="age-groups">
            <h4>Age Distribution</h4>
            {Object.entries(dashboardData.customerMetrics.ageGroups).map(([group, count]) => (
              <div key={group} className="age-group-item">
                <span>{group}</span>
                <span>{count} customers</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Tier Performance</h3>
          <div className="tier-performance">
            {Object.entries(dashboardData.tierAnalytics.tierAnalytics).map(([tier, data]) => (
              <div key={tier} className={`tier-performance-item ${tier}`}>
                <div className="tier-header">
                  <h4>{tier.charAt(0).toUpperCase() + tier.slice(1)}</h4>
                  <span className="customer-count">{data.count} customers</span>
                </div>
                <div className="tier-metrics">
                  <div className="tier-metric">
                    <span>Avg LTV</span>
                    <span>${data.avgLifetimeValue.toLocaleString()}</span>
                  </div>
                  <div className="tier-metric">
                    <span>Engagement</span>
                    <span>{data.avgEngagementScore}</span>
                  </div>
                  <div className="tier-metric">
                    <span>Churn Risk</span>
                    <span>{data.avgChurnRisk}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Channel Preferences</h3>
          <div className="channel-analysis">
            {Object.entries(dashboardData.channelPreferences.channelDistribution).map(([channel, customers]) => (
              <div key={channel} className="channel-item">
                <div className="channel-info">
                  <span className="channel-name">{channel}</span>
                  <span className="channel-count">{customers.length} customers</span>
                </div>
                <div className="channel-metrics">
                  <span>Avg Engagement: {dashboardData.channelPreferences.channelEngagement[channel]?.avgEngagementScore || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRiskAnalytics = () => (
    <div className="risk-analytics">
      <h2>Risk Analytics</h2>
      
      <div className="risk-overview">
        <div className="risk-card critical">
          <h3>High Risk Customers</h3>
          <div className="risk-count">{dashboardData.riskAnalytics.churnRiskDistribution.high}</div>
          <p>Customers with &gt;70% churn risk</p>
        </div>
        
        <div className="risk-card moderate">
          <h3>Medium Risk Customers</h3>
          <div className="risk-count">{dashboardData.riskAnalytics.churnRiskDistribution.medium}</div>
          <p>Customers with 40-70% churn risk</p>
        </div>
        
        <div className="risk-card safe">
          <h3>Low Risk Customers</h3>
          <div className="risk-count">{dashboardData.riskAnalytics.churnRiskDistribution.low}</div>
          <p>Customers with &lt;40% churn risk</p>
        </div>
      </div>

      <div className="credit-risk-analysis">
        <h3>Credit Risk Factors</h3>
        <div className="risk-factors-grid">
          <div className="risk-factor-card">
            <div className="factor-icon">📉</div>
            <div className="factor-content">
              <div className="factor-value">{dashboardData.riskAnalytics.creditRiskFactors.lowCreditScore}</div>
              <div className="factor-label">Low Credit Score (&lt;600)</div>
            </div>
          </div>
          
          <div className="risk-factor-card">
            <div className="factor-icon">💳</div>
            <div className="factor-content">
              <div className="factor-value">{dashboardData.riskAnalytics.creditRiskFactors.highUtilization}</div>
              <div className="factor-label">High Utilization (&gt;80%)</div>
            </div>
          </div>
          
          <div className="risk-factor-card">
            <div className="factor-icon">⚖️</div>
            <div className="factor-content">
              <div className="factor-value">{dashboardData.riskAnalytics.creditRiskFactors.bankruptcies}</div>
              <div className="factor-label">Bankruptcy History</div>
            </div>
          </div>
          
          <div className="risk-factor-card">
            <div className="factor-icon">🚫</div>
            <div className="factor-content">
              <div className="factor-value">{dashboardData.riskAnalytics.creditRiskFactors.multipleDelinquencies}</div>
              <div className="factor-label">Multiple Delinquencies</div>
            </div>
          </div>
        </div>
      </div>

      <div className="credit-score-distribution">
        <h3>Credit Score Distribution</h3>
        <div className="score-bands">
          {Object.entries(dashboardData.creditRiskInsights.creditScoreBands).map(([band, count]) => (
            <div key={band} className={`score-band ${band}`}>
              <span className="band-label">{band.charAt(0).toUpperCase() + band.slice(1)}</span>
              <span className="band-count">{count}</span>
            </div>
          ))}
        </div>
        <div className="credit-stats">
          <p>Average Credit Score: <strong>{dashboardData.creditRiskInsights.avgCreditScore}</strong></p>
          <p>Average Credit Utilization: <strong>{dashboardData.creditRiskInsights.avgCreditUtilization}%</strong></p>
        </div>
      </div>
    </div>
  );

  const renderCLVAnalytics = () => (
    <div className="clv-analytics">
      <h2>Customer Lifetime Value Analytics</h2>
      
      <div className="clv-summary">
        <div className="clv-metric-card">
          <h3>Average Lifetime Value</h3>
          <div className="clv-value">${dashboardData.clvAnalytics.avgLifetimeValue.toLocaleString()}</div>
        </div>
        
        <div className="clv-metric-card">
          <h3>Average 12-Month CLV</h3>
          <div className="clv-value">${dashboardData.clvAnalytics.avgCLV12Month.toLocaleString()}</div>
        </div>
        
        <div className="clv-metric-card">
          <h3>Average CLV Score</h3>
          <div className="clv-value">{dashboardData.clvAnalytics.avgCLVScore}</div>
        </div>
      </div>

      <div className="clv-distribution">
        <h3>CLV Band Distribution</h3>
        <div className="clv-bands">
          <div className="clv-band high">
            <div className="band-header">
              <span className="band-title">High CLV (&gt;$50K)</span>
              <span className="band-count">{dashboardData.clvAnalytics.clvBands.high}</span>
            </div>
          </div>
          
          <div className="clv-band medium">
            <div className="band-header">
              <span className="band-title">Medium CLV ($20K-$50K)</span>
              <span className="band-count">{dashboardData.clvAnalytics.clvBands.medium}</span>
            </div>
          </div>
          
          <div className="clv-band low">
            <div className="band-header">
              <span className="band-title">Low CLV (&lt;$20K)</span>
              <span className="band-count">{dashboardData.clvAnalytics.clvBands.low}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="clv-by-tier">
        <h3>CLV by Customer Tier</h3>
        <div className="tier-clv-grid">
          {Object.entries(dashboardData.clvAnalytics.clvByTier).map(([tier, data]) => (
            <div key={tier} className={`tier-clv-card ${tier}`}>
              <h4>{tier.charAt(0).toUpperCase() + tier.slice(1)}</h4>
              <div className="tier-clv-metrics">
                <div className="clv-metric">
                  <span>Customers</span>
                  <span>{data.count}</span>
                </div>
                <div className="clv-metric">
                  <span>Avg LTV</span>
                  <span>${data.avgLifetimeValue.toLocaleString()}</span>
                </div>
                <div className="clv-metric">
                  <span>Avg 12M CLV</span>
                  <span>${data.avgCLV12Month.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {dashboardData.clvAnalytics.topValueCustomers.length > 0 && (
        <div className="top-value-customers">
          <h3>Top Value Customers</h3>
          <div className="customer-list">
            {dashboardData.clvAnalytics.topValueCustomers.slice(0, 5).map((customer, index) => (
              <div key={index} className="customer-item">
                <div className="customer-info">
                  <span className="customer-name">{customer.name}</span>
                  <span className={`customer-tier ${customer.tier}`}>{customer.tier}</span>
                </div>
                <div className="customer-value">
                  <span className="lifetime-value">${customer.lifetimeValue?.toLocaleString() || 'N/A'}</span>
                  <span className="clv-12m">${customer.clv12Month?.toLocaleString() || 'N/A'} (12M)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSelectedReport = () => {
    switch (selectedReport) {
      case 'overview':
        return renderOverviewReport();
      case 'customers':
        return renderCustomerAnalytics();
      case 'risk':
        return renderRiskAnalytics();
      case 'clv':
        return renderCLVAnalytics();
      default:
        return renderOverviewReport();
    }
  };

  return (
    <div className="enhanced-dashboard">
      <div className="dashboard-content">
        {renderSelectedReport()}
      </div>

      <div className="dashboard-footer">
        <p>Data source: Policy Holders Table • Last updated: {new Date().toLocaleString()}</p>
        <button onClick={loadDashboardData} className="refresh-button">
          Refresh Data
        </button>
      </div>
    </div>
  );
}