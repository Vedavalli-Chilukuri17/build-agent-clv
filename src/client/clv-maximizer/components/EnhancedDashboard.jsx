import React, { useState, useEffect } from 'react';
import { DashboardService } from '../services/DashboardService.js';
import './EnhancedDashboard.css';

export default function EnhancedDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [productPerformanceData, setProductPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState('overview');
  const [error, setError] = useState(null);
  
  const dashboardService = new DashboardService();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Loading dashboard data...');
      const [dashData, productData] = await Promise.all([
        dashboardService.getComprehensiveDashboardReports(),
        dashboardService.getProductBenchmarkData().catch(err => {
          console.warn('Product benchmark data not available:', err);
          return [];
        })
      ]);
      
      console.log('Dashboard data loaded:', dashData);
      console.log('Product data loaded:', productData);
      
      setDashboardData(dashData);
      setProductPerformanceData(productData || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get value from ServiceNow field
  const getValue = (field) => {
    try {
      if (typeof field === 'object' && field !== null && field.display_value !== undefined) {
        return field.display_value;
      }
      return field;
    } catch (error) {
      console.warn('Error getting field value:', error);
      return '';
    }
  };

  // Format benchmark data from product performance table
  const formatBenchmarkData = () => {
    try {
      if (!productPerformanceData || productPerformanceData.length === 0) {
        console.log('No product performance data available');
        return [];
      }

      return productPerformanceData.map((item, index) => {
        try {
          const productName = getValue(item.product_name) || 'Unknown Product';
          const premium_vs_Competitor_1 = parseFloat(getValue(item.premium_vs_competitor_1)) || 0;
          const renewal_vs_Competitor_1 = parseFloat(getValue(item.renewal_vs_competitor_1)) || 0;
          const premium_vs_Competitor_2 = parseFloat(getValue(item.premium_vs_competitor_2)) || 0;
          const renewal_vs_Competitor_2 = parseFloat(getValue(item.renewal_vs_competitor_2)) || 0;
          const our_Add_On_Rate = parseFloat(getValue(item.our_add_on_rate)) || 0;
          const our_Claims_Ratio = parseFloat(getValue(item.our_claims_ratio)) || 0;
          const performance = getValue(item.performance_label) || 'N/A';

          return {
            metric: productName,
            premium_vs_Competitor_1: premium_vs_Competitor_1.toFixed(1) + '%',
            premium_vs_Competitor_2: premium_vs_Competitor_2.toFixed(1) + '%',
            renewal_vs_Competitor_1: renewal_vs_Competitor_1.toFixed(1) + '%',
            renewal_vs_Competitor_2: renewal_vs_Competitor_2.toFixed(1) + '%',
            our_Add_On_Rate: our_Add_On_Rate.toFixed(1) + '%',
            our_Claims_Ratio: our_Claims_Ratio.toFixed(1) + '%',
            performance: performance
          };
        } catch (itemError) {
          console.warn(`Error formatting benchmark item ${index}:`, itemError);
          return {
            metric: `Product ${index + 1}`,
            premium_vs_Competitor_1: '0.0%',
            premium_vs_Competitor_2: '0.0%',
            renewal_vs_Competitor_1: '0.0%',
            renewal_vs_Competitor_2: '0.0%',
            our_Add_On_Rate: '0.0%',
            our_Claims_Ratio: '0.0%',
            performance: 'N/A'
          };
        }
      });
    } catch (error) {
      console.error('Error formatting benchmark data:', error);
      return [];
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

  const renderOverviewReport = () => {
    try {
      const benchmarkData = formatBenchmarkData();
      
      return (
        <div className="overview-report">
          <div className="dashboard-header">
            <h1>CLV Maximizer Dashboard</h1>
            <p>Comprehensive Analytics from Policy Holders Data</p>
          </div>

          {/* Key Metrics Cards */}
          <div className="metrics-grid">
            <div className="metric-card primary">
              <div className="metric-icon">👥</div>
              <div className="metric-content">
                <div className="metric-value">{dashboardData.customerMetrics?.totalCustomers?.toLocaleString() || '0'}</div>
                <div className="metric-label">Total Customers</div>
                <div className="metric-sublabel">Active Policy Holders</div>
              </div>
            </div>

            <div className="metric-card info">
              <div className="metric-icon">📊</div>
              <div className="metric-content">
                <div className="metric-value">{dashboardData.engagementMetrics?.avgEngagementScore || '0'}</div>
                <div className="metric-label">Average Engagement Score</div>
                <div className="metric-sublabel">{dashboardData.engagementMetrics?.avgAppSessions || '0'} sessions/month</div>
              </div>
            </div>

            <div className="metric-card warning">
              <div className="metric-icon">📅</div>
              <div className="metric-content">
                <div className="metric-value">{dashboardData.renewalAnalytics?.renewalPipeline?.next30Days || '0'}</div>
                <div className="metric-label">Renewals Due (30 Days)</div>
                <div className="metric-sublabel">{dashboardData.renewalAnalytics?.atRiskRenewals || '0'} at-risk</div>
              </div>
            </div>

            <div className="metric-card success">
              <div className="metric-icon">⭐</div>
              <div className="metric-content">
                <div className="metric-value">{Math.round(((dashboardData.engagementMetrics?.avgAppSessions || 0) / 30) * 100)}%</div>
                <div className="metric-label">Digital Adoption Rate</div>
                <div className="metric-sublabel">Customer app engagement</div>
              </div>
            </div>
          </div>

          {/* Quick Insights Grid */}
          <div className="insights-grid">
            <div className="insight-card">
              <h3>🏆 Customer Tier Distribution</h3>
              <div className="tier-breakdown">
                {dashboardData.customerMetrics?.tierDistribution && Object.entries(dashboardData.customerMetrics.tierDistribution).map(([tier, customers]) => (
                  <div key={tier} className={`tier-item ${tier}`}>
                    <span className="tier-name">{tier.charAt(0).toUpperCase() + tier.slice(1)}</span>
                    <span className="tier-count">{customers?.length || 0}</span>
                    <div className="tier-bar">
                      <div 
                        className={`tier-fill ${tier}`} 
                        style={{width: `${((customers?.length || 0) / (dashboardData.customerMetrics?.totalCustomers || 1)) * 100}%`}}
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
                  <span>{dashboardData.engagementMetrics?.engagementLevels?.high || '0'}</span>
                </div>
                <div className="engagement-item medium">
                  <span>Medium Engagement</span>
                  <span>{dashboardData.engagementMetrics?.engagementLevels?.medium || '0'}</span>
                </div>
                <div className="engagement-item low">
                  <span>Low Engagement</span>
                  <span>{dashboardData.engagementMetrics?.engagementLevels?.low || '0'}</span>
                </div>
              </div>
              <div className="engagement-stats">
                <p>Avg Score: {dashboardData.engagementMetrics?.avgEngagementScore || '0'}</p>
                <p>Avg App Sessions: {dashboardData.engagementMetrics?.avgAppSessions || '0'}/month</p>
              </div>
            </div>

            <div className="insight-card">
              <h3>📅 Renewal Pipeline</h3>
              <div className="renewal-timeline">
                <div className="renewal-period">
                  <div className="period-label">Next 30 Days</div>
                  <div className="period-value urgent">{dashboardData.renewalAnalytics?.renewalPipeline?.next30Days || '0'}</div>
                </div>
                <div className="renewal-period">
                  <div className="period-label">Next 60 Days</div>
                  <div className="period-value warning">{dashboardData.renewalAnalytics?.renewalPipeline?.next60Days || '0'}</div>
                </div>
                <div className="renewal-period">
                  <div className="period-label">Next 90 Days</div>
                  <div className="period-value normal">{dashboardData.renewalAnalytics?.renewalPipeline?.next90Days || '0'}</div>
                </div>
              </div>
              <div className="renewal-alert">
                <strong>{dashboardData.renewalAnalytics?.atRiskRenewals || '0'}</strong> at-risk renewals
              </div>
            </div>

            <div className="insight-card">
              <h3>📊 Channel Performance</h3>
              <div className="channel-performance">
                {dashboardData.channelPreferences?.channelDistribution && Object.entries(dashboardData.channelPreferences.channelDistribution).map(([channel, customers]) => (
                  <div key={channel} className="channel-item">
                    <div className="channel-info">
                      <span className="channel-name">{channel}</span>
                      <span className="channel-count">{customers?.length || 0} customers</span>
                    </div>
                    <div className="channel-engagement">
                      <span>Engagement: {dashboardData.channelPreferences?.channelEngagement?.[channel]?.avgEngagementScore || 'N/A'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="insight-card">
              <h3>📈 Performance Benchmark</h3>
              {benchmarkData.length > 0 ? (
                <>
                  <div className="benchmark-table-extended">
                    <div className="benchmark-header-extended">
                      <span className="benchmark-metric">Product</span>
                      <span className="benchmark-value">Premium vs Comp 1</span>
                      <span className="benchmark-value">Premium vs Comp 2</span>
                      <span className="benchmark-value">Renewal vs Comp 1</span>
                      <span className="benchmark-value">Renewal vs Comp 2</span>
                      <span className="benchmark-value">Performance</span>
                      <span className="benchmark-value">Claims Ratio</span>
                      <span className="benchmark-value">Add-On Rate</span>
                    </div>
                    {benchmarkData.map((row, index) => (
                      <div key={index} className="benchmark-row-extended">
                        <span className="metric-name">{row.metric}</span>
                        <span className="metric-value">{row.premium_vs_Competitor_1}</span>
                        <span className="metric-value">{row.premium_vs_Competitor_2}</span>
                        <span className="metric-value">{row.renewal_vs_Competitor_1}</span>
                        <span className="metric-value">{row.renewal_vs_Competitor_2}</span>
                        <span className="metric-value">{row.performance}</span>
                        <span className="metric-value">{row.our_Claims_Ratio}</span>
                        <span className="metric-value">{row.our_Add_On_Rate}</span>
                      </div>
                    ))}
                  </div>
                  <div className="benchmark-summary">
                    <p><strong>{benchmarkData.length} products</strong> in performance benchmark</p>
                  </div>
                </>
              ) : (
                <div className="no-benchmark-data">
                  <p>No performance benchmark data available.</p>
                  <p>Add records to the Product Performance table to view benchmarks.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } catch (renderError) {
      console.error('Error rendering overview report:', renderError);
      return (
        <div className="enhanced-dashboard-error">
          <h3>Rendering Error</h3>
          <p>There was an error displaying the dashboard. Please check the browser console for details.</p>
          <button onClick={loadDashboardData} className="retry-button">Reload Data</button>
        </div>
      );
    }
  };

  const reportTabs = [
    { id: 'overview', label: 'Dashboard Overview', icon: '📊' }
  ];

  const renderSelectedReport = () => {
    return renderOverviewReport();
  };

  return (
    <div className="enhanced-dashboard">
      <div className="dashboard-tabs">
        {reportTabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button active`}
            disabled
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {renderSelectedReport()}
      </div>

      <div className="dashboard-footer">
        <button onClick={loadDashboardData} className="refresh-button">
          Refresh Data
        </button>
      </div>
    </div>
  );
}