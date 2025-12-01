import React, { useState, useEffect, useMemo } from 'react';
import { CLVDataService } from '../services/CLVDataService.js';
import { display, value } from '../utils/fields.js';
import './Dashboard.css';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    customers: [],
    incidents: [],
    activities: [],
    catalogItems: [],
    roles: []
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const service = useMemo(() => new CLVDataService(), []);

  useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [service]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [customers, incidents, activities, catalogItems, roles] = await Promise.all([
        service.getCustomerData(),
        service.getIncidentData(),
        service.getUserActivity(),
        service.getServiceCatalogData(),
        service.getRoleData()
      ]);

      setDashboardData({ customers, incidents, activities, catalogItems, roles });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const kpiMetrics = useMemo(() => {
    return service.calculateCLVMetrics(dashboardData.customers, dashboardData.incidents, dashboardData.activities);
  }, [service, dashboardData]);

  const channelPerformance = useMemo(() => {
    return service.calculateChannelPerformance(dashboardData.activities);
  }, [service, dashboardData.activities]);

  const productPerformance = useMemo(() => {
    return service.calculateProductPerformance(dashboardData.catalogItems);
  }, [service, dashboardData.catalogItems]);

  const customerTiers = useMemo(() => {
    return service.calculateCustomerTiers(dashboardData.customers);
  }, [service, dashboardData.customers]);

  const clvBands = useMemo(() => {
    return service.calculateCLVBands(dashboardData.customers);
  }, [service, dashboardData.customers]);

  const upcomingRenewals = useMemo(() => {
    return service.getUpcomingRenewals(dashboardData.customers);
  }, [service, dashboardData.customers]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading CLV Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="clv-dashboard">
      <div className="dashboard-header">
        <h1>CLV Maximizer Dashboard</h1>
        <div className="dashboard-meta">
          <span className="last-updated">Last Updated: {lastUpdated.toLocaleTimeString()}</span>
          <button className="refresh-btn" onClick={loadDashboardData}>🔄 Refresh</button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Section A: Executive KPI Dashboard */}
        <section className="dashboard-section kpi-section">
          <h2>Executive KPI Dashboard</h2>
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-value">{kpiMetrics.renewalRate}%</div>
              <div className="kpi-label">Renewal Conversion Rate</div>
              <div className="kpi-trend positive">↗ +2.3%</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-value">{kpiMetrics.churnRate}%</div>
              <div className="kpi-label">Churn Rate</div>
              <div className="kpi-trend negative">↘ -0.8%</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-value">${kpiMetrics.averageCLV.toLocaleString()}</div>
              <div className="kpi-label">Average CLV</div>
              <div className="kpi-trend positive">↗ +5.2%</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-value">${kpiMetrics.customerAcquisitionCost}</div>
              <div className="kpi-label">Customer Acquisition Cost</div>
              <div className="kpi-trend positive">↗ +1.1%</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-value">{kpiMetrics.netRevenueRetention}%</div>
              <div className="kpi-label">Net Revenue Retention</div>
              <div className="kpi-trend positive">↗ +3.4%</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-value">{kpiMetrics.highRiskCustomers}</div>
              <div className="kpi-label">High-Risk Customers</div>
              <div className="kpi-trend warning">⚠ Monitor</div>
            </div>
          </div>
        </section>

        {/* Section B: Coverage Gap Opportunities */}
        <section className="dashboard-section coverage-section">
          <h2>Coverage Gap Opportunities</h2>
          <div className="coverage-grid">
            <div className="coverage-item">
              <span className="coverage-product">Term Life</span>
              <span className="coverage-count">1,247</span>
            </div>
            <div className="coverage-item">
              <span className="coverage-product">Whole Life</span>
              <span className="coverage-count">892</span>
            </div>
            <div className="coverage-item">
              <span className="coverage-product">Auto Insurance</span>
              <span className="coverage-count">2,156</span>
            </div>
            <div className="coverage-item">
              <span className="coverage-product">Home Insurance</span>
              <span className="coverage-count">1,534</span>
            </div>
          </div>
          <div className="coverage-total">
            Total Opportunities: <strong>5,829</strong>
          </div>
        </section>

        {/* Section C: Channel Performance */}
        <section className="dashboard-section channel-section">
          <h2>Channel Performance (Last 30 Days)</h2>
          <div className="channel-chart">
            {Object.entries(channelPerformance).map(([channel, data]) => (
              <div key={channel} className="channel-bar">
                <div className="channel-label">{channel}</div>
                <div className="channel-metrics">
                  <div className="channel-volume">{data.volume} interactions</div>
                  <div className="channel-conversion">{data.conversionRate}% conversion</div>
                </div>
                <div className="channel-bar-visual">
                  <div 
                    className="channel-bar-fill" 
                    style={{ width: `${Math.min(data.volume / 100, 1) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section D: Cross-Sell/Upsell Performance */}
        <section className="dashboard-section upsell-section">
          <h2>Cross-Sell/Upsell Performance</h2>
          <div className="upsell-metrics">
            <div className="upsell-card">
              <div className="upsell-value">1,342</div>
              <div className="upsell-label">Successful Add-Ons</div>
            </div>
            <div className="upsell-card">
              <div className="upsell-value">23.7%</div>
              <div className="upsell-label">Acceptance Rate</div>
            </div>
            <div className="upsell-card">
              <div className="upsell-value">+12.4%</div>
              <div className="upsell-label">Month-over-Month</div>
            </div>
          </div>
          <div className="upsell-trend">
            <div className="trend-line">📈 Trending upward over past 6 months</div>
          </div>
        </section>

        {/* Section E: Product Benchmarking Analysis */}
        <section className="dashboard-section product-section">
          <h2>Product Benchmarking Analysis</h2>
          <div className="product-table">
            <div className="product-header">
              <span>Product</span>
              <span>Purchase Freq.</span>
              <span>Premium vs Comp.</span>
              <span>Revenue/Customer</span>
              <span>Campaign Uplift</span>
            </div>
            {productPerformance.map((product, index) => (
              <div key={index} className="product-row">
                <span className="product-name">{product.name}</span>
                <span className="product-freq">{product.purchaseFrequency}</span>
                <span className={`product-premium ${parseFloat(product.premiumVsCompetitor) >= 0 ? 'positive' : 'negative'}`}>
                  {product.premiumVsCompetitor}%
                </span>
                <span className="product-revenue">${product.revenuePerCustomer.toLocaleString()}</span>
                <span className="product-uplift">{product.campaignUplift}%</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section F: Customer Intelligence & Engagement */}
        <section className="dashboard-section intelligence-section">
          <h2>Customer Intelligence & Engagement</h2>
          <div className="intelligence-grid">
            <div className="intelligence-card benchmark">
              <h3>Market Benchmark</h3>
              <div className="benchmark-metrics">
                <div className="benchmark-item">
                  <span className="benchmark-label">Outperformance</span>
                  <span className="benchmark-value positive">+12.3%</span>
                </div>
                <div className="benchmark-item">
                  <span className="benchmark-label">Industry Average</span>
                  <span className="benchmark-value">78.5%</span>
                </div>
                <div className="benchmark-item">
                  <span className="benchmark-label">Performance Gap</span>
                  <span className="benchmark-value positive">+9.6%</span>
                </div>
              </div>
            </div>
            <div className="intelligence-card engagement">
              <h3>Engagement Analytics</h3>
              <div className="engagement-scores">
                <div className="score-item">
                  <span className="score-label">Overall Engagement</span>
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: '84%' }}></div>
                    <span className="score-value">84</span>
                  </div>
                </div>
                <div className="score-item">
                  <span className="score-label">Retention Score</span>
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: '91%' }}></div>
                    <span className="score-value">91</span>
                  </div>
                </div>
                <div className="score-item">
                  <span className="score-label">Loyalty Score</span>
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: '77%' }}></div>
                    <span className="score-value">77</span>
                  </div>
                </div>
                <div className="score-item">
                  <span className="score-label">Campaign Score</span>
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: '88%' }}></div>
                    <span className="score-value">88</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section G: Risk Factor Analysis */}
        <section className="dashboard-section risk-section">
          <h2>Risk Factor Analysis</h2>
          <div className="risk-chart">
            <div className="risk-factor">
              <span className="risk-label">Credit Risk Score &lt;600</span>
              <div className="risk-bar">
                <div className="risk-fill" style={{ width: '23%' }}></div>
                <span className="risk-percentage">23%</span>
              </div>
            </div>
            <div className="risk-factor">
              <span className="risk-label">High-Risk Property Zones</span>
              <div className="risk-bar">
                <div className="risk-fill" style={{ width: '18%' }}></div>
                <span className="risk-percentage">18%</span>
              </div>
            </div>
            <div className="risk-factor">
              <span className="risk-label">Low Income</span>
              <div className="risk-bar">
                <div className="risk-fill" style={{ width: '31%' }}></div>
                <span className="risk-percentage">31%</span>
              </div>
            </div>
            <div className="risk-factor">
              <span className="risk-label">Claim History</span>
              <div className="risk-bar">
                <div className="risk-fill" style={{ width: '15%' }}></div>
                <span className="risk-percentage">15%</span>
              </div>
            </div>
            <div className="risk-factor">
              <span className="risk-label">Catastrophic Risk Flags</span>
              <div className="risk-bar">
                <div className="risk-fill" style={{ width: '8%' }}></div>
                <span className="risk-percentage">8%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section H: Claims Impact Analysis */}
        <section className="dashboard-section claims-section">
          <h2>Claims Impact Analysis</h2>
          <div className="claims-analysis">
            <div className="claims-metrics">
              <div className="claims-metric">
                <span className="claims-label">Avg. Renewal Likelihood</span>
                <span className="claims-value">73.2%</span>
              </div>
              <div className="claims-metric">
                <span className="claims-label">Predicted CLV Impact</span>
                <span className="claims-value">-$2,847</span>
              </div>
              <div className="claims-metric">
                <span className="claims-label">Claims Multiplier</span>
                <span className="claims-value">1.34x</span>
              </div>
            </div>
            <div className="claims-chart-placeholder">
              📊 Claims vs Renewal Likelihood Scatter Plot
              <p>Interactive chart showing correlation between claim count and renewal probability</p>
            </div>
          </div>
        </section>

        {/* Section I: Customer Tier Distribution */}
        <section className="dashboard-section tier-section">
          <h2>Customer Tier Distribution</h2>
          <div className="tier-chart">
            {Object.entries(customerTiers).map(([tier, count]) => (
              <div key={tier} className={`tier-segment tier-${tier.toLowerCase()}`}>
                <span className="tier-name">{tier}</span>
                <span className="tier-count">{count}</span>
                <span className="tier-percentage">
                  {((count / dashboardData.customers.length) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section J: CLV Bands Distribution */}
        <section className="dashboard-section clv-bands-section">
          <h2>CLV Bands Distribution</h2>
          <div className="clv-bands-chart">
            <div className="clv-band">
              <span className="band-label">&lt; $5K</span>
              <div className="band-bar">
                <div className="band-fill" style={{ width: '40%' }}></div>
                <span className="band-count">{clvBands.under5k}</span>
              </div>
            </div>
            <div className="clv-band">
              <span className="band-label">$5K–$10K</span>
              <div className="band-bar">
                <div className="band-fill" style={{ width: '35%' }}></div>
                <span className="band-count">{clvBands['5k-10k']}</span>
              </div>
            </div>
            <div className="clv-band">
              <span className="band-label">$10K–$15K</span>
              <div className="band-bar">
                <div className="band-fill" style={{ width: '15%' }}></div>
                <span className="band-count">{clvBands['10k-15k']}</span>
              </div>
            </div>
            <div className="clv-band">
              <span className="band-label">&gt; $15K</span>
              <div className="band-bar">
                <div className="band-fill" style={{ width: '10%' }}></div>
                <span className="band-count">{clvBands.over15k}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section K: Renewal Pipeline Management */}
        <section className="dashboard-section renewal-pipeline-section">
          <h2>Renewal Pipeline Management</h2>
          <div className="renewal-table">
            <div className="renewal-header">
              <span>Customer Name</span>
              <span>Renewal Date</span>
              <span>Status</span>
              <span>Opportunity Score</span>
              <span>Renewal Amount</span>
              <span>CLV Score</span>
            </div>
            {upcomingRenewals.map((renewal, index) => (
              <div key={index} className="renewal-row">
                <span className="renewal-customer">{renewal.customerName}</span>
                <span className="renewal-date">{renewal.renewalDate}</span>
                <span className={`renewal-status status-${renewal.renewalStatus.toLowerCase().replace(' ', '-')}`}>
                  {renewal.renewalStatus}
                </span>
                <span className="renewal-opportunity">{renewal.opportunityScore}%</span>
                <span className="renewal-amount">${renewal.renewalAmount.toLocaleString()}</span>
                <span className="renewal-clv">{renewal.clvScore}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section L: Strategic Quadrant Highlights */}
        <section className="dashboard-section quadrant-section">
          <h2>Strategic Quadrant Highlights</h2>
          <div className="strategic-quadrant">
            <div className="quadrant customer-excellence">
              <h3>Customer Excellence</h3>
              <p>High CLV + High Renewal</p>
              <div className="quadrant-count">234 customers</div>
            </div>
            <div className="quadrant growth-opportunities">
              <h3>Growth Opportunities</h3>
              <p>High CLV + Low Renewal</p>
              <div className="quadrant-count">156 customers</div>
            </div>
            <div className="quadrant risk-management">
              <h3>Risk Management</h3>
              <p>Low CLV + Low Renewal</p>
              <div className="quadrant-count">89 customers</div>
            </div>
            <div className="quadrant clv-maximizer">
              <h3>CLV Maximizer</h3>
              <p>Optimized Performance</p>
              <div className="quadrant-count">312 customers</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}