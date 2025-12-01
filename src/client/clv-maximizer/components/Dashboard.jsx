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
  
  // Renewal pipeline pagination state
  const [renewalPage, setRenewalPage] = useState(1);
  const [renewalPageSize] = useState(10);
  const [renewalSort, setRenewalSort] = useState({ field: 'renewalDate', direction: 'asc' });
  const [renewalFilter, setRenewalFilter] = useState('');
  
  // Product benchmarking state
  const [productBenchmarking, setProductBenchmarking] = useState(null);
  const [benchmarkingSort, setBenchmarkingSort] = useState({ field: 'productName', direction: 'asc' });

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
      const [customers, incidents, activities, catalogItems, roles, benchmarking] = await Promise.all([
        service.getCustomerData(),
        service.getIncidentData(),
        service.getUserActivity(),
        service.getServiceCatalogData(),
        service.getRoleData(),
        service.getProductBenchmarkingData()
      ]);

      setDashboardData({ customers, incidents, activities, catalogItems, roles });
      setProductBenchmarking(benchmarking);
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

  // Enhanced renewal pipeline with pagination and filtering
  const renewalPipeline = useMemo(() => {
    const paginatedData = service.getUpcomingRenewals(dashboardData.customers, renewalPage, renewalPageSize);
    let filteredData = paginatedData.data;

    // Apply filter
    if (renewalFilter) {
      filteredData = filteredData.filter(renewal => 
        renewal.customerName.toLowerCase().includes(renewalFilter.toLowerCase()) ||
        renewal.renewalStatus.toLowerCase().includes(renewalFilter.toLowerCase())
      );
    }

    // Apply sort
    filteredData.sort((a, b) => {
      let aVal = a[renewalSort.field];
      let bVal = b[renewalSort.field];
      
      if (renewalSort.field === 'renewalAmount' || renewalSort.field === 'opportunityScore' || renewalSort.field === 'clvScore') {
        aVal = typeof aVal === 'number' ? aVal : parseFloat(aVal) || 0;
        bVal = typeof bVal === 'number' ? bVal : parseFloat(bVal) || 0;
      }

      if (renewalSort.direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return {
      data: filteredData,
      pagination: paginatedData.pagination
    };
  }, [service, dashboardData.customers, renewalPage, renewalPageSize, renewalSort, renewalFilter]);

  // Sorted product benchmarking data
  const sortedBenchmarking = useMemo(() => {
    if (!productBenchmarking?.data) return [];
    
    return [...productBenchmarking.data].sort((a, b) => {
      let aVal = a[benchmarkingSort.field];
      let bVal = b[benchmarkingSort.field];
      
      if (benchmarkingSort.field.includes('Vs') || benchmarkingSort.field.includes('Ratio') || benchmarkingSort.field.includes('Rate')) {
        aVal = parseFloat(aVal.replace('%', '')) || 0;
        bVal = parseFloat(bVal.replace('%', '')) || 0;
      }

      if (benchmarkingSort.direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [productBenchmarking, benchmarkingSort]);

  // Handle product block clicks for drill-down
  const handleProductClick = (product) => {
    console.log('Drilling down into product:', product.name);
    // Future: Navigate to detailed product analytics
  };

  // Handle renewal table sorting
  const handleRenewalSort = (field) => {
    setRenewalSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle benchmarking table sorting
  const handleBenchmarkingSort = (field) => {
    setBenchmarkingSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

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

        {/* Section E: Product Benchmarking Analysis - UPDATED HORIZONTAL LAYOUT */}
        <section className="dashboard-section product-section">
          <div className="section-header">
            <h2>Product Benchmarking Analysis</h2>
            <div className="section-meta">
              <span className="refresh-indicator">🔄</span>
              <span className="last-updated-small">Updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
          
          <div className="product-horizontal-container">
            <div className="product-blocks-row">
              {productPerformance.map((product, index) => (
                <div 
                  key={index} 
                  className="product-block"
                  onClick={() => handleProductClick(product)}
                  role="button"
                  tabIndex={0}
                  title={`Click for detailed ${product.name} analytics`}
                >
                  <div className="product-block-header">
                    <h3 className="product-name">{product.name}</h3>
                  </div>
                  
                  <div className="product-metrics-stack">
                    <div className="product-metric-row">
                      <span className="metric-label">Purchase Frequency</span>
                      <span className="metric-value">{product.purchaseFrequency}</span>
                    </div>
                    
                    <div className="product-metric-row">
                      <span className="metric-label">Premium per Customer</span>
                      <span className="metric-value">${(product.revenuePerCustomer * 0.15).toFixed(0)}</span>
                    </div>
                    
                    <div className="product-metric-row">
                      <span className="metric-label">Revenue per Customer</span>
                      <span className="metric-value">${product.revenuePerCustomer.toLocaleString()}</span>
                    </div>
                    
                    <div className="product-metric-row">
                      <span className="metric-label">% Change in Revenue</span>
                      <span 
                        className={`metric-value revenue-change ${parseFloat(product.premiumVsCompetitor) >= 0 ? 'positive' : 'negative'}`}
                        title={parseFloat(product.premiumVsCompetitor) >= 0 ? 'Revenue increased' : 'Revenue decreased'}
                      >
                        {parseFloat(product.premiumVsCompetitor) >= 0 ? '+' : ''}{product.premiumVsCompetitor}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="product-block-footer">
                    <span className="performance-indicator">
                      {parseFloat(product.premiumVsCompetitor) >= 10 ? '🟢' : 
                       parseFloat(product.premiumVsCompetitor) >= 0 ? '🟡' : '🔴'}
                    </span>
                    <span className="drill-down-hint">Click for details</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="product-section-footer">
            <div className="performance-legend">
              <span className="legend-item">
                <span className="legend-indicator">🟢</span>
                <span className="legend-text">High Performance (10%+)</span>
              </span>
              <span className="legend-item">
                <span className="legend-indicator">🟡</span>
                <span className="legend-text">Moderate Performance (0-10%)</span>
              </span>
              <span className="legend-item">
                <span className="legend-indicator">🔴</span>
                <span className="legend-text">Underperforming (&lt;0%)</span>
              </span>
            </div>
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

        {/* FIXED Section K: Renewal Pipeline Management */}
        <section className="dashboard-section renewal-pipeline-section">
          <div className="renewal-section-header">
            <h2>Renewal Pipeline Management</h2>
            <div className="renewal-controls">
              <input
                type="text"
                placeholder="Filter by customer or status..."
                value={renewalFilter}
                onChange={(e) => setRenewalFilter(e.target.value)}
                className="renewal-filter-input"
              />
              <span className="renewal-count">
                {renewalPipeline.data.length} of {renewalPipeline.pagination?.totalRecords || 0} records
              </span>
            </div>
          </div>

          <div className="renewal-table-container">
            <table className="renewal-table-enhanced">
              <thead>
                <tr>
                  <th onClick={() => handleRenewalSort('customerName')} className="sortable" 
                      title="Sort by Customer Name">
                    Customer Name {renewalSort.field === 'customerName' && (renewalSort.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleRenewalSort('renewalDate')} className="sortable"
                      title="Sort by Renewal Date">
                    Renewal Date {renewalSort.field === 'renewalDate' && (renewalSort.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleRenewalSort('renewalStatus')} className="sortable"
                      title="Sort by Status">
                    Status {renewalSort.field === 'renewalStatus' && (renewalSort.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleRenewalSort('opportunityScore')} className="sortable"
                      title="Sort by Opportunity Score">
                    Opportunity Score {renewalSort.field === 'opportunityScore' && (renewalSort.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleRenewalSort('renewalAmount')} className="sortable"
                      title="Sort by Renewal Amount">
                    Renewal Amount {renewalSort.field === 'renewalAmount' && (renewalSort.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleRenewalSort('clvScore')} className="sortable"
                      title="Sort by CLV Score">
                    CLV Score {renewalSort.field === 'clvScore' && (renewalSort.direction === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {renewalPipeline.data.map((renewal, index) => (
                  <tr key={renewal.id || index} className="renewal-row-enhanced">
                    <td className="renewal-customer" title={renewal.customerName}>{renewal.customerName}</td>
                    <td className="renewal-date">{renewal.renewalDate}</td>
                    <td>
                      <span className={`renewal-status-enhanced status-${renewal.renewalStatus.toLowerCase().replace(' ', '-')}`}
                            title={`Status: ${renewal.renewalStatus}`}>
                        {renewal.renewalStatus}
                      </span>
                    </td>
                    <td className="renewal-opportunity" title={`Opportunity Score: ${renewal.opportunityScore}%`}>
                      {renewal.opportunityScore}%
                    </td>
                    <td className="renewal-amount" title={`Renewal Amount: $${renewal.renewalAmount.toLocaleString()}`}>
                      ${renewal.renewalAmount.toLocaleString()}
                    </td>
                    <td className="renewal-clv" title={`CLV Score: ${renewal.clvScore}`}>
                      {renewal.clvScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="renewal-pagination">
            <button 
              onClick={() => setRenewalPage(prev => Math.max(1, prev - 1))}
              disabled={renewalPage <= 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {renewalPage} of {renewalPipeline.pagination?.totalPages || 1}
            </span>
            <button 
              onClick={() => setRenewalPage(prev => prev + 1)}
              disabled={renewalPage >= (renewalPipeline.pagination?.totalPages || 1)}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </section>

        {/* NEW Section L: Product Benchmarking Analysis Report */}
        <section className="dashboard-section product-benchmarking-section">
          <div className="benchmarking-section-header">
            <h2>Product Benchmarking Analysis</h2>
            <div className="benchmarking-meta">
              <span className="data-source" title="Data source information">
                📊 {productBenchmarking?.dataSource || 'Loading...'}
              </span>
              <span className="benchmarking-timestamp">
                Updated: {productBenchmarking?.lastUpdated ? productBenchmarking.lastUpdated.toLocaleTimeString() : 'N/A'}
              </span>
            </div>
          </div>

          <div className="benchmarking-table-container">
            <table className="benchmarking-table">
              <thead>
                <tr>
                  <th onClick={() => handleBenchmarkingSort('productName')} className="sortable"
                      title="Sort by Product Name">
                    Product Name {benchmarkingSort.field === 'productName' && (benchmarkingSort.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleBenchmarkingSort('performanceLabel')} className="sortable"
                      title="Sort by Performance Label">
                    Performance {benchmarkingSort.field === 'performanceLabel' && (benchmarkingSort.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleBenchmarkingSort('premiumVsComp1')} className="sortable"
                      title="Premium comparison vs Competitor 1">
                    Premium vs Comp 1 {benchmarkingSort.field === 'premiumVsComp1' && (benchmarkingSort.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleBenchmarkingSort('premiumVsComp2')} className="sortable"
                      title="Premium comparison vs Competitor 2">
                    Premium vs Comp 2 {benchmarkingSort.field === 'premiumVsComp2' && (benchmarkingSort.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleBenchmarkingSort('renewalVsComp1')} className="sortable"
                      title="Renewal rate vs Competitor 1">
                    Renewal vs Comp 1 {benchmarkingSort.field === 'renewalVsComp1' && (benchmarkingSort.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleBenchmarkingSort('renewalVsComp2')} className="sortable"
                      title="Renewal rate vs Competitor 2">
                    Renewal vs Comp 2 {benchmarkingSort.field === 'renewalVsComp2' && (benchmarkingSort.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleBenchmarkingSort('claimsRatio')} className="sortable"
                      title="Our claims ratio">
                    Claims Ratio {benchmarkingSort.field === 'claimsRatio' && (benchmarkingSort.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleBenchmarkingSort('addOnRate')} className="sortable"
                      title="Our add-on rate">
                    Add-On Rate {benchmarkingSort.field === 'addOnRate' && (benchmarkingSort.direction === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedBenchmarking.map((product, index) => (
                  <tr key={index} className="benchmarking-row">
                    <td className="product-name-cell">
                      <div className="product-name-with-label">
                        <span className="product-name">{product.productName}</span>
                        <span className={`performance-badge ${service.getPerformanceBadgeClass(product.performanceLabel)}`}>
                          {product.performanceLabel}
                        </span>
                      </div>
                    </td>
                    <td className={`performance-cell performance-${product.performanceLabel.toLowerCase()}`}>
                      {product.performanceLabel}
                    </td>
                    <td className={`comparison-cell ${parseFloat(product.premiumVsComp1.replace('%', '')) >= 0 ? 'positive' : 'negative'}`}
                        title={`Premium ${parseFloat(product.premiumVsComp1.replace('%', '')) >= 0 ? 'advantage' : 'disadvantage'} vs Competitor 1`}>
                      {service.getPerformanceIndicator(product.premiumVsComp1).indicator} {product.premiumVsComp1}
                    </td>
                    <td className={`comparison-cell ${parseFloat(product.premiumVsComp2.replace('%', '')) >= 0 ? 'positive' : 'negative'}`}
                        title={`Premium ${parseFloat(product.premiumVsComp2.replace('%', '')) >= 0 ? 'advantage' : 'disadvantage'} vs Competitor 2`}>
                      {service.getPerformanceIndicator(product.premiumVsComp2).indicator} {product.premiumVsComp2}
                    </td>
                    <td className={`comparison-cell ${parseFloat(product.renewalVsComp1.replace('%', '')) >= 0 ? 'positive' : 'negative'}`}
                        title={`Renewal rate ${parseFloat(product.renewalVsComp1.replace('%', '')) >= 0 ? 'advantage' : 'disadvantage'} vs Competitor 1`}>
                      {service.getPerformanceIndicator(product.renewalVsComp1).indicator} {product.renewalVsComp1}
                    </td>
                    <td className={`comparison-cell ${parseFloat(product.renewalVsComp2.replace('%', '')) >= 0 ? 'positive' : 'negative'}`}
                        title={`Renewal rate ${parseFloat(product.renewalVsComp2.replace('%', '')) >= 0 ? 'advantage' : 'disadvantage'} vs Competitor 2`}>
                      {service.getPerformanceIndicator(product.renewalVsComp2).indicator} {product.renewalVsComp2}
                    </td>
                    <td className="metric-cell" title={`Claims ratio: ${product.claimsRatio}`}>
                      {product.claimsRatio}
                    </td>
                    <td className="metric-cell" title={`Add-on rate: ${product.addOnRate}`}>
                      {product.addOnRate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="benchmarking-footer">
            <div className="benchmarking-legend">
              <div className="legend-group">
                <span className="legend-title">Performance Labels:</span>
                <span className="legend-item">
                  <span className="performance-badge performance-strong">Strong</span>
                  <span className="legend-text">Market leader</span>
                </span>
                <span className="legend-item">
                  <span className="performance-badge performance-competitive">Competitive</span>
                  <span className="legend-text">Market participant</span>
                </span>
                <span className="legend-item">
                  <span className="performance-badge performance-challenged">Challenged</span>
                  <span className="legend-text">Needs improvement</span>
                </span>
              </div>
              <div className="legend-group">
                <span className="legend-title">Indicators:</span>
                <span className="legend-item">
                  <span className="legend-indicator">🟢</span>
                  <span className="legend-text">Strong advantage (10%+)</span>
                </span>
                <span className="legend-item">
                  <span className="legend-indicator">🟡</span>
                  <span className="legend-text">Moderate advantage (0-10%)</span>
                </span>
                <span className="legend-item">
                  <span className="legend-indicator">🔴</span>
                  <span className="legend-text">Disadvantage (&lt;0%)</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section M: Strategic Quadrant Highlights */}
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