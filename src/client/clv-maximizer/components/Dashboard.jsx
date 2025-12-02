import React, { useState, useEffect, useMemo } from 'react';
import { CustomerIntelligenceService } from '../services/CustomerIntelligenceService.js';
import { DashboardService } from '../services/DashboardService.js';
import { display, value } from '../utils/fields.js';
import './Dashboard.css';
import './DashboardEnhanced.css';

export default function Dashboard() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [renewalData, setRenewalData] = useState([]);
  const [productBenchmarkData, setProductBenchmarkData] = useState([]);
  const [policyHolders, setPolicyHolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [renewalFilters, setRenewalFilters] = useState({ status: 'all', search: '' });
  const [renewalPage, setRenewalPage] = useState(1);
  const [productSort, setProductSort] = useState({ field: 'product_name', direction: 'asc' });
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');
  
  const service = useMemo(() => new CustomerIntelligenceService(), []);
  const dashboardService = useMemo(() => new DashboardService(), []);

  useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [service, dashboardService]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load policy holders data
      const policyHoldersData = await service.getCSMConsumerData();
      setPolicyHolders(policyHoldersData);
      
      // Generate analytics
      const analytics = service.generateCustomerAnalytics(policyHoldersData);
      setAnalyticsData(analytics);

      // Load renewal pipeline data
      const renewals = await dashboardService.getRenewalPipeline();
      setRenewalData(renewals);

      // Load product benchmark data
      const products = await dashboardService.getProductBenchmarkData();
      setProductBenchmarkData(products);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate Executive KPIs from policy holders data
  const executiveKPIs = useMemo(() => {
    if (!policyHolders.length) return {};

    const totalCustomers = policyHolders.length;
    const totalCLV = policyHolders.reduce((sum, customer) => sum + (parseFloat(display(customer.lifetime_value)) || 0), 0);
    const avgCLV = totalCLV / totalCustomers;
    
    // Calculate renewal conversion rate from policy holders data
    // Method 1: Based on customers with tenure > 1 year (indicates they renewed at least once)
    const customersWithRenewalHistory = policyHolders.filter(customer => {
      const tenure = parseInt(display(customer.tenure_years)) || 0;
      return tenure > 1; // Customers with more than 1 year tenure have renewed
    });
    
    // Method 2: Also consider low churn risk customers as likely renewals
    const lowChurnRiskCustomers = policyHolders.filter(customer => {
      const churnRisk = parseFloat(display(customer.churn_risk)) || 0;
      return churnRisk < 30; // Less than 30% churn risk means high renewal likelihood
    });
    
    // Calculate renewal conversion rate as combination of renewal history and low churn risk
    const eligibleForRenewal = policyHolders.filter(customer => {
      const tenure = parseInt(display(customer.tenure_years)) || 0;
      return tenure >= 1; // Must have at least 1 year of tenure to be eligible for renewal
    });
    
    const likelyRenewals = policyHolders.filter(customer => {
      const tenure = parseInt(display(customer.tenure_years)) || 0;
      const churnRisk = parseFloat(display(customer.churn_risk)) || 0;
      const openAccounts = parseInt(display(customer.number_of_open_accounts)) || 0;
      const closedAccounts = parseInt(display(customer.number_of_closed_accounts)) || 0;
      
      // High renewal likelihood criteria:
      // 1. Low churn risk (< 40%)
      // 2. More open accounts than closed accounts
      // 3. Tenure indicates renewal behavior
      return (
        churnRisk < 40 && 
        openAccounts > closedAccounts && 
        tenure >= 1
      );
    });
    
    const renewalConversionRate = eligibleForRenewal.length > 0 
      ? (likelyRenewals.length / eligibleForRenewal.length) * 100 
      : 0;
    
    // Calculate high risk customers (churn risk >= 70%)
    const highRiskCount = policyHolders.filter(customer => 
      parseFloat(display(customer.churn_risk)) >= 70
    ).length;
    
    const churnRate = (highRiskCount / totalCustomers) * 100;
    
    // Calculate CAC (Customer Acquisition Cost) - could be derived from CLV and other factors
    // For now using a calculated estimate based on average CLV
    const cac = Math.round(avgCLV * 0.15); // Assuming CAC is ~15% of average CLV
    
    // Calculate NRR (Net Revenue Retention) - based on customer growth and retention
    const retainedCustomers = policyHolders.filter(customer => {
      const churnRisk = parseFloat(display(customer.churn_risk)) || 0;
      return churnRisk < 50; // Customers likely to be retained
    }).length;
    
    const retentionRate = (retainedCustomers / totalCustomers) * 100;
    // NRR typically includes expansion, so adding some growth factor
    const nrr = Math.min(retentionRate * 1.1, 120); // Cap at 120%

    return {
      renewalConversionRate: Math.round(renewalConversionRate * 10) / 10, // Round to 1 decimal
      churnRate,
      avgCLV,
      cac,
      nrr,
      highRiskCount,
      totalCustomers,
      // Additional metrics for transparency
      eligibleForRenewal: eligibleForRenewal.length,
      likelyRenewals: likelyRenewals.length,
      customersWithRenewalHistory: customersWithRenewalHistory.length
    };
  }, [policyHolders]);

  // Calculate Coverage Gap Opportunities
  const coverageGaps = useMemo(() => {
    if (!policyHolders.length) return {};

    const gaps = {};
    let totalOpportunities = 0;

    policyHolders.forEach(customer => {
      const missingCoverage = display(customer.missing_coverage) || '';
      if (missingCoverage) {
        const products = missingCoverage.split(',').map(p => p.trim());
        products.forEach(product => {
          if (product) {
            gaps[product] = (gaps[product] || 0) + 1;
            totalOpportunities++;
          }
        });
      }
    });

    return { gaps, totalOpportunities };
  }, [policyHolders]);

  // Calculate Channel Performance (last 30 days)
  const channelPerformance = useMemo(() => {
    if (!policyHolders.length) return [];

    const channels = {
      'Mobile App': { volume: 0, conversions: 0 },
      'Email': { volume: 0, conversions: 0 },
      'Phone': { volume: 0, conversions: 0 },
      'Advisor': { volume: 0, conversions: 0 }
    };

    policyHolders.forEach(customer => {
      const preferredChannel = display(customer.preferred_channel);
      const appSessions = parseInt(display(customer.app_sessions_30_days)) || 0;
      const websiteVisits = parseInt(display(customer.website_visits_30_days)) || 0;
      
      if (preferredChannel === 'Mobile App') {
        channels['Mobile App'].volume += appSessions;
        channels['Mobile App'].conversions += appSessions > 5 ? 1 : 0;
      } else if (preferredChannel === 'Email') {
        channels['Email'].volume += websiteVisits;
        channels['Email'].conversions += websiteVisits > 3 ? 1 : 0;
      } else if (preferredChannel === 'Phone') {
        channels['Phone'].volume += 1;
        channels['Phone'].conversions += parseFloat(display(customer.churn_risk)) < 30 ? 1 : 0;
      }
    });

    // Add advisor data (mock)
    channels['Advisor'].volume = 156;
    channels['Advisor'].conversions = 89;

    return Object.entries(channels).map(([name, data]) => ({
      channel: name,
      volume: data.volume,
      conversions: data.conversions,
      conversionRate: data.volume > 0 ? ((data.conversions / data.volume) * 100).toFixed(1) : '0.0'
    }));
  }, [policyHolders]);

  // Calculate CLV Bands Distribution
  const clvBands = useMemo(() => {
    if (!policyHolders.length) return [];

    const bands = {
      '< 5K': 0,
      '5K-10K': 0,
      '10K-15K': 0,
      '> 15K': 0
    };

    policyHolders.forEach(customer => {
      const clv = parseFloat(display(customer.lifetime_value)) || 0;
      if (clv < 5000) bands['< 5K']++;
      else if (clv < 10000) bands['5K-10K']++;
      else if (clv < 15000) bands['10K-15K']++;
      else bands['> 15K']++;
    });

    return Object.entries(bands).map(([band, count]) => ({
      band,
      count,
      percentage: ((count / policyHolders.length) * 100).toFixed(1)
    }));
  }, [policyHolders]);

  // Calculate Risk Factor Analysis
  const riskFactors = useMemo(() => {
    if (!policyHolders.length) return [];

    const factors = {
      'Credit Risk Score <600': 0,
      'High-Risk Property Zones': 0,
      'Low Income': 0,
      'Claim History': 0,
      'Catastrophic Risk Flags': 0
    };

    policyHolders.forEach(customer => {
      const creditScore = parseInt(display(customer.credit_score)) || 0;
      const riskFlags = display(customer.risk_flags) || '';
      const bankruptcies = display(customer.bankruptcies_flag) === 'true';
      
      if (creditScore < 600) factors['Credit Risk Score <600']++;
      if (riskFlags.toLowerCase().includes('property')) factors['High-Risk Property Zones']++;
      if (riskFlags.toLowerCase().includes('income')) factors['Low Income']++;
      if (riskFlags.toLowerCase().includes('claim')) factors['Claim History']++;
      if (bankruptcies) factors['Catastrophic Risk Flags']++;
    });

    return Object.entries(factors).map(([factor, count]) => ({
      factor,
      count,
      percentage: ((count / policyHolders.length) * 100).toFixed(1)
    }));
  }, [policyHolders]);

  // Calculate Strategic Quadrants
  const strategicQuadrants = useMemo(() => {
    if (!policyHolders.length) return {};

    const quadrants = {
      'Customer Excellence': 0, // High CLV + Low Churn Risk
      'Growth Opportunities': 0, // High CLV + High Churn Risk  
      'Risk Management': 0, // Low CLV + High Churn Risk
      'CLV Maximizer': 0 // Medium CLV + Low Churn Risk
    };

    policyHolders.forEach(customer => {
      const clv = parseFloat(display(customer.lifetime_value)) || 0;
      const churnRisk = parseFloat(display(customer.churn_risk)) || 0;
      
      if (clv > 10000 && churnRisk < 30) {
        quadrants['Customer Excellence']++;
      } else if (clv > 10000 && churnRisk >= 50) {
        quadrants['Growth Opportunities']++;
      } else if (clv <= 5000 && churnRisk >= 50) {
        quadrants['Risk Management']++;
      } else {
        quadrants['CLV Maximizer']++;
      }
    });

    return quadrants;
  }, [policyHolders]);

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${Math.round(amount).toLocaleString()}`;
  };

  const formatPercentage = (value) => {
    return `${parseFloat(value).toFixed(1)}%`;
  };

  // Renewal Pipeline filtering and pagination
  const filteredRenewals = useMemo(() => {
    let filtered = renewalData;

    if (renewalFilters.status !== 'all') {
      filtered = filtered.filter(r => display(r.status).toLowerCase() === renewalFilters.status);
    }

    if (renewalFilters.search) {
      const searchLower = renewalFilters.search.toLowerCase();
      filtered = filtered.filter(r => 
        display(r.customer_name).toLowerCase().includes(searchLower) ||
        display(r.customer_id).toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [renewalData, renewalFilters]);

  const paginatedRenewals = useMemo(() => {
    const startIndex = (renewalPage - 1) * 10;
    return filteredRenewals.slice(startIndex, startIndex + 10);
  }, [filteredRenewals, renewalPage]);

  const totalRenewalPages = Math.ceil(filteredRenewals.length / 10);

  // Product benchmark sorting
  const sortedProducts = useMemo(() => {
    return [...productBenchmarkData].sort((a, b) => {
      const aVal = display(a[productSort.field]);
      const bVal = display(b[productSort.field]);
      
      if (productSort.field.includes('vs_competitor') || productSort.field.includes('ratio') || productSort.field.includes('rate')) {
        const aNum = parseFloat(value(a[productSort.field])) || 0;
        const bNum = parseFloat(value(b[productSort.field])) || 0;
        return productSort.direction === 'asc' ? aNum - bNum : bNum - aNum;
      }
      
      return productSort.direction === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }, [productBenchmarkData, productSort]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading CLV Maximizer Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="clv-dashboard-enhanced">
      {/* Header with User Identity */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>CLV Maximizer Dashboard</h1>
          <div className="user-identity">
            <span className="user-name">Emma Thompson</span>
            <span className="user-role">Senior Marketing Analyst</span>
          </div>
        </div>
        <div className="last-updated">
          <div className="refresh-indicator active"></div>
          Last Updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      {/* Section A: Executive KPI Dashboard */}
      <div className="dashboard-section executive-kpi-section">
        <h2>Executive KPI Dashboard</h2>
        <div className="kpi-grid">
          <div className="kpi-card renewal-conversion">
            <div className="kpi-value">{formatPercentage(executiveKPIs.renewalConversionRate)}</div>
            <div className="kpi-label">Renewal Conversion Rate</div>
            <div className="kpi-trend positive">↗ +2.1%</div>
            <div className="kpi-details">
              <small>{executiveKPIs.likelyRenewals} of {executiveKPIs.eligibleForRenewal} eligible customers</small>
            </div>
          </div>

          <div className="kpi-card churn-rate">
            <div className="kpi-value">{formatPercentage(executiveKPIs.churnRate)}</div>
            <div className="kpi-label">Churn Rate</div>
            <div className="kpi-trend negative">↘ -1.8%</div>
          </div>

          <div className="kpi-card avg-clv">
            <div className="kpi-value">{formatCurrency(executiveKPIs.avgCLV)}</div>
            <div className="kpi-label">Average CLV</div>
            <div className="kpi-trend positive">↗ +5.3%</div>
          </div>

          <div className="kpi-card cac">
            <div className="kpi-value">{formatCurrency(executiveKPIs.cac)}</div>
            <div className="kpi-label">Customer Acquisition Cost</div>
            <div className="kpi-trend neutral">→ 0.2%</div>
          </div>

          <div className="kpi-card nrr">
            <div className="kpi-value">{formatPercentage(executiveKPIs.nrr)}</div>
            <div className="kpi-label">Net Revenue Retention</div>
            <div className="kpi-trend positive">↗ +3.5%</div>
          </div>

          <div className="kpi-card high-risk">
            <div className="kpi-value">{executiveKPIs.highRiskCount}</div>
            <div className="kpi-label">High-Risk Customers</div>
            <div className="kpi-trend negative">↘ -8</div>
          </div>
        </div>
      </div>

      {/* Section B: Coverage Gap Opportunities */}
      <div className="dashboard-section coverage-gap-section">
        <h2>Coverage Gap Opportunities</h2>
        <div className="coverage-summary">
          <div className="total-opportunities">
            <span className="number">{coverageGaps.totalOpportunities}</span>
            <span className="label">Total Opportunities</span>
          </div>
        </div>
        <div className="coverage-breakdown">
          {Object.entries(coverageGaps.gaps || {}).map(([product, count]) => (
            <div key={product} className="coverage-item">
              <div className="product-name">{product}</div>
              <div className="opportunity-count">{count}</div>
              <div className="opportunity-bar">
                <div 
                  className="opportunity-fill"
                  style={{ width: `${(count / coverageGaps.totalOpportunities) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section C: Channel Performance */}
      <div className="dashboard-section channel-performance-section">
        <h2>Channel Performance (Last 30 Days)</h2>
        <div className="channel-chart">
          {channelPerformance.map((channel) => (
            <div key={channel.channel} className="channel-bar">
              <div className="channel-name">{channel.channel}</div>
              <div className="channel-metrics">
                <div className="metric">
                  <span className="metric-label">Volume:</span>
                  <span className="metric-value">{channel.volume.toLocaleString()}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Conversion:</span>
                  <span className="metric-value">{channel.conversionRate}%</span>
                </div>
              </div>
              <div className="channel-bar-visual">
                <div 
                  className="channel-fill"
                  style={{ 
                    width: `${Math.min((channel.volume / Math.max(...channelPerformance.map(c => c.volume))) * 100, 100)}%`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section D: Cross-Sell/Upsell Performance */}
      <div className="dashboard-section cross-sell-section">
        <h2>Cross-Sell/Upsell Performance</h2>
        <div className="cross-sell-metrics">
          <div className="metric-card">
            <div className="metric-value">1,247</div>
            <div className="metric-label">Successful Add-Ons</div>
            <div className="metric-trend positive">↗ +12.4%</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">68.2%</div>
            <div className="metric-label">Acceptance Rate</div>
            <div className="metric-trend positive">↗ +5.1%</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">+15.7%</div>
            <div className="metric-label">Month-over-Month</div>
            <div className="metric-trend positive">Strong Growth</div>
          </div>
        </div>
      </div>

      {/* Section E: Product Benchmarking Analysis */}
      <div className="dashboard-section product-benchmark-section">
        <h2>Product Benchmarking Analysis</h2>
        <div className="table-container">
          <table className="benchmark-table">
            <thead>
              <tr>
                <th 
                  className={`sortable ${productSort.field === 'product_name' ? 'sorted' : ''}`}
                  onClick={() => setProductSort({
                    field: 'product_name',
                    direction: productSort.field === 'product_name' && productSort.direction === 'asc' ? 'desc' : 'asc'
                  })}
                >
                  Product Name {productSort.field === 'product_name' && (productSort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Purchase Frequency</th>
                <th>Premium vs Competitor</th>
                <th>Revenue per Customer</th>
                <th>Campaign Uplift</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((product, index) => (
                <tr key={value(product.sys_id) || index}>
                  <td className="product-name-cell">
                    <div className="product-info">
                      <span className="name">{display(product.product_name)}</span>
                      <span 
                        className="performance-badge"
                        style={{ 
                          backgroundColor: dashboardService.getPerformanceColor(product.performance_label),
                          color: 'white'
                        }}
                      >
                        {display(product.performance_label)}
                      </span>
                    </div>
                  </td>
                  <td>High</td>
                  <td className="delta-cell">
                    <span 
                      className="delta-value"
                      style={{ color: dashboardService.getDeltaColor(product.premium_vs_competitor_1) }}
                    >
                      {parseFloat(display(product.premium_vs_competitor_1)) >= 0 ? '+' : ''}
                      {dashboardService.formatPercentage(display(product.premium_vs_competitor_1))}
                    </span>
                  </td>
                  <td>{formatCurrency(8500)}</td>
                  <td className="delta-cell positive">+12.3%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section F: Customer Intelligence & Engagement */}
      <div className="dashboard-section intelligence-section">
        <h2>Customer Intelligence & Engagement</h2>
        <div className="intelligence-grid">
          <div className="intelligence-card">
            <h3>Market Benchmark Comparison</h3>
            <div className="benchmark-metrics">
              <div className="benchmark-item">
                <span className="label">Outperformance %</span>
                <span className="value positive">+18.5%</span>
              </div>
              <div className="benchmark-item">
                <span className="label">Industry Average %</span>
                <span className="value">72.1%</span>
              </div>
              <div className="benchmark-item">
                <span className="label">Performance Gap %</span>
                <span className="value positive">+12.8%</span>
              </div>
            </div>
          </div>
          
          <div className="intelligence-card">
            <h3>Engagement Analytics</h3>
            <div className="engagement-scores">
              <div className="score-item">
                <span className="score-label">Overall Engagement</span>
                <span className="score-value">85.2</span>
              </div>
              <div className="score-item">
                <span className="score-label">Retention Score</span>
                <span className="score-value">91.7</span>
              </div>
              <div className="score-item">
                <span className="score-label">Loyalty Score</span>
                <span className="score-value">78.9</span>
              </div>
              <div className="score-item">
                <span className="score-label">Campaign Score</span>
                <span className="score-value">82.4</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section G: Risk Factor Analysis */}
      <div className="dashboard-section risk-analysis-section">
        <h2>Risk Factor Analysis</h2>
        <div className="risk-chart">
          {riskFactors.map((factor) => (
            <div key={factor.factor} className="risk-bar">
              <div className="risk-name">{factor.factor}</div>
              <div className="risk-percentage">{factor.percentage}%</div>
              <div className="risk-bar-visual">
                <div 
                  className="risk-fill"
                  style={{ 
                    width: `${factor.percentage}%`,
                    backgroundColor: parseFloat(factor.percentage) > 20 ? '#ef4444' : parseFloat(factor.percentage) > 10 ? '#f59e0b' : '#10b981'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section H: Claims Impact Analysis */}
      <div className="dashboard-section claims-analysis-section">
        <h2>Claims Impact Analysis</h2>
        <div className="claims-metrics">
          <div className="claims-metric">
            <span className="label">Avg Renewal Likelihood</span>
            <span className="value">76.8%</span>
          </div>
          <div className="claims-metric">
            <span className="label">Predicted CLV Impact</span>
            <span className="value">-$2,340</span>
          </div>
          <div className="claims-metric">
            <span className="label">Claims Multiplier</span>
            <span className="value">1.23x</span>
          </div>
        </div>
        <div className="claims-note">
          Customers with claims history show 23% higher churn probability but 15% higher loyalty when retained.
        </div>
      </div>

      {/* Section I: Customer Tier Distribution */}
      <div className="dashboard-section tier-distribution-section">
        <h2>Customer Tier Distribution</h2>
        <div className="tier-chart">
          {['Platinum', 'Gold', 'Silver', 'Bronze'].map(tier => {
            const count = policyHolders.filter(c => display(c.tier).toLowerCase() === tier.toLowerCase()).length;
            const percentage = ((count / policyHolders.length) * 100).toFixed(1);
            return (
              <div key={tier} className="tier-item">
                <div className="tier-info">
                  <span className="tier-name">{tier}</span>
                  <span className="tier-count">{count} ({percentage}%)</span>
                </div>
                <div className="tier-bar">
                  <div 
                    className={`tier-fill tier-${tier.toLowerCase()}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section J: CLV Bands Distribution */}
      <div className="dashboard-section clv-bands-section">
        <h2>CLV Bands Distribution</h2>
        <div className="clv-chart">
          {clvBands.map((band) => (
            <div key={band.band} className="clv-bar">
              <div className="clv-info">
                <span className="clv-band">{band.band}</span>
                <span className="clv-count">{band.count} ({band.percentage}%)</span>
              </div>
              <div className="clv-bar-visual">
                <div 
                  className="clv-fill"
                  style={{ 
                    width: `${band.percentage}%`,
                    backgroundColor: band.band === '> 15K' ? '#059669' : band.band === '10K-15K' ? '#0891b2' : band.band === '5K-10K' ? '#7c3aed' : '#dc2626'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section K: Renewal Pipeline Management */}
      <div className="dashboard-section renewal-pipeline-section">
        <div className="section-header">
          <h2>Renewal Pipeline Management</h2>
          <div className="section-actions">
            <select 
              value={renewalFilters.status} 
              onChange={(e) => setRenewalFilters({...renewalFilters, status: e.target.value})}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="confirmed">Confirmed</option>
              <option value="at_risk">At Risk</option>
            </select>
            <input
              type="text"
              placeholder="Search customers..."
              value={renewalFilters.search}
              onChange={(e) => setRenewalFilters({...renewalFilters, search: e.target.value})}
              className="search-input"
            />
          </div>
        </div>

        <div className="table-container">
          <table className="renewal-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Renewal Date</th>
                <th>Status</th>
                <th>Opportunity Score</th>
                <th>Renewal Amount</th>
                <th>CLV Score</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRenewals.map((renewal, index) => (
                <tr key={value(renewal.sys_id) || index}>
                  <td className="customer-name-cell">
                    <div className="customer-info">
                      <span className="name">{display(renewal.customer_name)}</span>
                      <span className="tier-badge" data-tier={display(renewal.customer_tier)}>
                        {display(renewal.customer_tier)}
                      </span>
                    </div>
                  </td>
                  <td>{display(renewal.renewal_date)}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: dashboardService.getStatusColor(renewal.status),
                        color: 'white'
                      }}
                    >
                      {display(renewal.status)}
                    </span>
                  </td>
                  <td className="score-cell">{display(renewal.opportunity_score)}%</td>
                  <td className="amount-cell">
                    {dashboardService.formatCurrency(display(renewal.renewal_amount))}
                  </td>
                  <td className="score-cell">{display(renewal.clv_score)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <div className="pagination-info">
            Showing {Math.min((renewalPage - 1) * 10 + 1, filteredRenewals.length)} to {Math.min(renewalPage * 10, filteredRenewals.length)} of {filteredRenewals.length} records
          </div>
          <div className="pagination-controls">
            <button 
              onClick={() => setRenewalPage(p => Math.max(1, p - 1))}
              disabled={renewalPage <= 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="page-info">Page {renewalPage} of {totalRenewalPages}</span>
            <button 
              onClick={() => setRenewalPage(p => Math.min(totalRenewalPages, p + 1))}
              disabled={renewalPage >= totalRenewalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Section L: Strategic Quadrant Highlights */}
      <div className="dashboard-section strategic-quadrant-section">
        <h2>Strategic Quadrant Highlights</h2>
        <div className="quadrant-container">
          <div className="quadrant-grid">
            <div className="quadrant customer-excellence">
              <div className="quadrant-label">Customer Excellence</div>
              <div className="quadrant-subtitle">High CLV + Low Churn Risk</div>
              <div className="quadrant-count">{strategicQuadrants['Customer Excellence']}</div>
            </div>
            
            <div className="quadrant growth-opportunities">
              <div className="quadrant-label">Growth Opportunities</div>
              <div className="quadrant-subtitle">High CLV + High Churn Risk</div>
              <div className="quadrant-count">{strategicQuadrants['Growth Opportunities']}</div>
            </div>
            
            <div className="quadrant clv-maximizer">
              <div className="quadrant-label">CLV Maximizer</div>
              <div className="quadrant-subtitle">Medium CLV + Low Churn Risk</div>
              <div className="quadrant-count">{strategicQuadrants['CLV Maximizer']}</div>
            </div>
            
            <div className="quadrant risk-management">
              <div className="quadrant-label">Risk Management</div>
              <div className="quadrant-subtitle">Low CLV + High Churn Risk</div>
              <div className="quadrant-count">{strategicQuadrants['Risk Management']}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}