import React, { useState, useEffect, useMemo } from 'react';
import { CustomerIntelligenceService } from '../services/CustomerIntelligenceService.js';
import { display, value } from '../utils/fields.js';
import './CustomerIntelligenceTab.css';

export default function CustomerIntelligenceTab() {
  const [rawData, setRawData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [sortField, setSortField] = useState('customerName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filters, setFilters] = useState({
    tier: 'All',
    churnRisk: 'All',
    renewal: 'All',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedDrillDown, setSelectedDrillDown] = useState(null);

  const service = useMemo(() => new CustomerIntelligenceService(), []);

  useEffect(() => {
    loadCustomerData();
    
    // Auto-refresh every 3 minutes
    const interval = setInterval(loadCustomerData, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [service]);

  const loadCustomerData = async () => {
    setLoading(true);
    try {
      const consumerData = await service.getCSMConsumerData();
      const analyticsData = service.generateCustomerAnalytics(consumerData);
      
      setRawData(consumerData);
      setAnalytics(analyticsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading customer intelligence data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search customers
  const filteredCustomers = useMemo(() => {
    if (!analytics) return [];
    
    let filtered = analytics.customers;

    // Apply filters
    if (filters.tier !== 'All') {
      filtered = filtered.filter(customer => customer.tier === filters.tier);
    }

    if (filters.churnRisk !== 'All') {
      filtered = filtered.filter(customer => customer.churnRisk === filters.churnRisk);
    }

    if (filters.renewal !== 'All') {
      filtered = filtered.filter(customer => customer.renewal === filters.renewal);
    }

    // Apply search filter
    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(customer => 
        customer.customerName.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.company.toLowerCase().includes(term) ||
        customer.location.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [analytics, filters]);

  // Sort customers
  const sortedCustomers = useMemo(() => {
    const sorted = [...filteredCustomers].sort((a, b) => {
      let aVal, bVal;

      switch (sortField) {
        case 'customerName':
          aVal = a.customerName.toLowerCase();
          bVal = b.customerName.toLowerCase();
          break;
        case 'tier':
          aVal = service.getTierPriority(a.tier);
          bVal = service.getTierPriority(b.tier);
          break;
        case 'clv':
          aVal = a.clv;
          bVal = b.clv;
          break;
        case 'renewalDate':
          aVal = new Date(a.renewalDate);
          bVal = new Date(b.renewalDate);
          break;
        case 'churnRisk':
          aVal = service.getChurnPriority(a.churnRisk);
          bVal = service.getChurnPriority(b.churnRisk);
          break;
        case 'engagementScore':
          aVal = a.engagementScore;
          bVal = b.engagementScore;
          break;
        case 'tenure':
          aVal = a.tenure;
          bVal = b.tenure;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredCustomers, sortField, sortDirection, service]);

  // Paginate customers
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedCustomers.slice(startIndex, startIndex + pageSize);
  }, [sortedCustomers, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedCustomers.length / pageSize);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
  };

  // Handle drill-down clicks
  const handleDrillDown = (type, value) => {
    let drillDownFilters = { ...filters };
    
    switch (type) {
      case 'highRisk':
        drillDownFilters.churnRisk = 'High';
        break;
      case 'platinum':
        drillDownFilters.tier = 'Platinum';
        break;
      case 'churnRisk':
        drillDownFilters.churnRisk = value;
        break;
      case 'renewalUrgent':
        // Filter for customers with renewals in next 30 days
        setSelectedDrillDown({ type: 'renewalUrgent', customers: analytics.customers.filter(c => service.getDaysUntilRenewal(c.renewalDate) <= 30) });
        return;
    }
    
    setFilters(drillDownFilters);
    setCurrentPage(1);
  };

  // Handle export
  const handleExport = () => {
    if (analytics) {
      service.exportToCSV(sortedCustomers);
    }
  };

  // Handle customer actions
  const handleViewProfile = (customer) => {
    alert(`Customer Profile for ${customer.customerName}:\n\n` +
          `Email: ${customer.email}\n` +
          `Company: ${customer.company}\n` +
          `Tier: ${customer.tier}\n` +
          `CLV: ${service.formatCurrency(customer.clv)}\n` +
          `Churn Risk: ${customer.churnRisk}\n` +
          `Engagement Score: ${customer.engagementScore}/100\n` +
          `Tenure: ${customer.tenure} months\n` +
          `Location: ${customer.location}\n` +
          `Risk Factors: ${customer.riskFactors.join(', ')}\n` +
          `Opportunities: ${customer.opportunities.join(', ')}`);
  };

  const handleViewSnapshot = (customer) => {
    alert(`Quick Snapshot - ${customer.customerName}:\n\n` +
          `${customer.tier} Customer | CLV: ${service.formatCurrency(customer.clv)}\n` +
          `Churn Risk: ${customer.churnRisk} | Engagement: ${customer.engagementScore}/100\n` +
          `Renewal: ${service.formatDate(customer.renewalDate)} (${service.getDaysUntilRenewal(customer.renewalDate)} days)\n` +
          `Top Opportunity: ${customer.opportunities[0] || 'None identified'}`);
  };

  // Utility functions
  const getSortIndicator = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↗️' : '↘️';
  };

  const getProgressBarColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className="intelligence-loading">
        <div className="loading-spinner"></div>
        <p>Loading Customer Intelligence Hub...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="intelligence-error">
        <p>Error loading customer intelligence data. Please try again.</p>
        <button onClick={loadCustomerData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="customer-intelligence-hub">
      {/* Section 1: Header Panel */}
      <header className="intelligence-header">
        <div className="header-content">
          <h1>Customer Intelligence Hub</h1>
          <p className="header-subtitle">Advanced analytics and insights for customer lifetime value optimization</p>
        </div>
        <div className="header-actions">
          <span className="workspace-timestamp">Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <button className="export-data-btn" onClick={handleExport}>
            📊 Export Data
          </button>
          <div className="user-identity">
            <strong>Emma Thompson</strong>
            <p>Senior Marketing Analyst</p>
          </div>
        </div>
      </header>

      {/* Section 2: Summary Metrics Panel */}
      <section className="summary-metrics-panel">
        <div className="metric-card" onClick={() => handleDrillDown('total', 'all')}>
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.summaryMetrics.totalCustomers.toLocaleString()}</div>
            <div className="metric-label">Total Customers</div>
          </div>
          <div className="metric-trend positive">↗ +5.2%</div>
        </div>

        <div className="metric-card" onClick={() => handleDrillDown('highRisk', 'high')}>
          <div className="metric-icon">⚠️</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.summaryMetrics.highRiskCount.toLocaleString()}</div>
            <div className="metric-label">High Risk Customers</div>
          </div>
          <div className="metric-trend negative">↘ -2.1%</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-value">{service.formatCurrency(analytics.summaryMetrics.averageCLV)}</div>
            <div className="metric-label">Average CLV</div>
          </div>
          <div className="metric-trend positive">↗ +8.3%</div>
        </div>

        <div className="metric-card" onClick={() => handleDrillDown('platinum', 'platinum')}>
          <div className="metric-icon">🏆</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.summaryMetrics.platinumCount.toLocaleString()}</div>
            <div className="metric-label">Platinum Tier Count</div>
          </div>
          <div className="metric-trend positive">↗ +3.7%</div>
        </div>
      </section>

      <div className="analytics-grid">
        <div className="analytics-main">
          {/* Section 3: Churn Risk Heatmap */}
          <section className="churn-risk-heatmap">
            <h2>Churn Risk Heatmap</h2>
            <div className="heatmap-bars">
              <div className="risk-bar" onClick={() => handleDrillDown('churnRisk', 'High')}>
                <div className="bar-info">
                  <span className="bar-label">High Risk</span>
                  <span className="bar-stats">{analytics.churnDistribution.high.count} ({analytics.churnDistribution.high.percentage}%)</span>
                </div>
                <div className="bar-visual">
                  <div 
                    className="bar-fill" 
                    style={{ 
                      width: `${analytics.churnDistribution.high.percentage}%`, 
                      backgroundColor: analytics.churnDistribution.high.color 
                    }}
                  ></div>
                </div>
              </div>

              <div className="risk-bar" onClick={() => handleDrillDown('churnRisk', 'Medium')}>
                <div className="bar-info">
                  <span className="bar-label">Medium Risk</span>
                  <span className="bar-stats">{analytics.churnDistribution.medium.count} ({analytics.churnDistribution.medium.percentage}%)</span>
                </div>
                <div className="bar-visual">
                  <div 
                    className="bar-fill" 
                    style={{ 
                      width: `${analytics.churnDistribution.medium.percentage}%`, 
                      backgroundColor: analytics.churnDistribution.medium.color 
                    }}
                  ></div>
                </div>
              </div>

              <div className="risk-bar" onClick={() => handleDrillDown('churnRisk', 'Low')}>
                <div className="bar-info">
                  <span className="bar-label">Low Risk</span>
                  <span className="bar-stats">{analytics.churnDistribution.low.count} ({analytics.churnDistribution.low.percentage}%)</span>
                </div>
                <div className="bar-visual">
                  <div 
                    className="bar-fill" 
                    style={{ 
                      width: `${analytics.churnDistribution.low.percentage}%`, 
                      backgroundColor: analytics.churnDistribution.low.color 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Renewal Timeline Heatmap */}
          <section className="renewal-timeline-heatmap">
            <h2>Renewal Timeline Heatmap</h2>
            <div className="timeline-bars">
              <div className="timeline-segment urgent" onClick={() => handleDrillDown('renewalUrgent')}>
                <div className="segment-header">
                  <span className="segment-label">Next 30 Days</span>
                  <span className="urgent-badge">URGENT</span>
                </div>
                <div className="segment-count">{analytics.renewalTimeline.next30.count} customers</div>
                <div className="segment-bar">
                  <div 
                    className="segment-fill" 
                    style={{ 
                      width: `${Math.max(20, (analytics.renewalTimeline.next30.count / analytics.summaryMetrics.totalCustomers) * 100 * 10)}%`,
                      backgroundColor: analytics.renewalTimeline.next30.color 
                    }}
                  ></div>
                </div>
              </div>

              <div className="timeline-segment">
                <div className="segment-header">
                  <span className="segment-label">31–60 Days</span>
                </div>
                <div className="segment-count">{analytics.renewalTimeline.days31to60.count} customers</div>
                <div className="segment-bar">
                  <div 
                    className="segment-fill" 
                    style={{ 
                      width: `${Math.max(15, (analytics.renewalTimeline.days31to60.count / analytics.summaryMetrics.totalCustomers) * 100 * 10)}%`,
                      backgroundColor: analytics.renewalTimeline.days31to60.color 
                    }}
                  ></div>
                </div>
              </div>

              <div className="timeline-segment">
                <div className="segment-header">
                  <span className="segment-label">61–90 Days</span>
                </div>
                <div className="segment-count">{analytics.renewalTimeline.days61to90.count} customers</div>
                <div className="segment-bar">
                  <div 
                    className="segment-fill" 
                    style={{ 
                      width: `${Math.max(10, (analytics.renewalTimeline.days61to90.count / analytics.summaryMetrics.totalCustomers) * 100 * 10)}%`,
                      backgroundColor: analytics.renewalTimeline.days61to90.color 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Section 5: Engagement & Loyalty Metrics */}
        <aside className="engagement-metrics-panel">
          <h2>Engagement & Loyalty Metrics</h2>
          <div className="metrics-list">
            <div className="engagement-metric">
              <div className="metric-header">
                <span className="metric-name">Engagement Score</span>
                <span className="metric-score">{analytics.engagementMetrics.engagement.score.toFixed(1)}</span>
              </div>
              <div className="metric-progress">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${analytics.engagementMetrics.engagement.score}%`,
                    backgroundColor: getProgressBarColor(analytics.engagementMetrics.engagement.score)
                  }}
                ></div>
              </div>
            </div>

            <div className="engagement-metric">
              <div className="metric-header">
                <span className="metric-name">Retention Score</span>
                <span className="metric-score">{analytics.engagementMetrics.retention.score.toFixed(1)}</span>
              </div>
              <div className="metric-progress">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${analytics.engagementMetrics.retention.score}%`,
                    backgroundColor: getProgressBarColor(analytics.engagementMetrics.retention.score)
                  }}
                ></div>
              </div>
            </div>

            <div className="engagement-metric">
              <div className="metric-header">
                <span className="metric-name">Loyalty Score</span>
                <span className="metric-score">{analytics.engagementMetrics.loyalty.score.toFixed(1)}</span>
              </div>
              <div className="metric-progress">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${analytics.engagementMetrics.loyalty.score}%`,
                    backgroundColor: getProgressBarColor(analytics.engagementMetrics.loyalty.score)
                  }}
                ></div>
              </div>
            </div>

            <div className="engagement-metric">
              <div className="metric-header">
                <span className="metric-name">Campaign Score</span>
                <span className="metric-score">{analytics.engagementMetrics.campaign.score.toFixed(1)}</span>
              </div>
              <div className="metric-progress">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${analytics.engagementMetrics.campaign.score}%`,
                    backgroundColor: getProgressBarColor(analytics.engagementMetrics.campaign.score)
                  }}
                ></div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Section 6: Customer Profile List */}
      <section className="customer-profile-list">
        <div className="list-header">
          <h2>Customer Profile List</h2>
          <div className="list-controls">
            <input
              type="text"
              placeholder="Search customers..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
            
            <select
              value={filters.tier}
              onChange={(e) => handleFilterChange('tier', e.target.value)}
              className="filter-select"
            >
              <option value="All">All Tiers</option>
              <option value="Platinum">Platinum</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
            </select>

            <select
              value={filters.churnRisk}
              onChange={(e) => handleFilterChange('churnRisk', e.target.value)}
              className="filter-select"
            >
              <option value="All">All Risk Levels</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>

            <select
              value={filters.renewal}
              onChange={(e) => handleFilterChange('renewal', e.target.value)}
              className="filter-select"
            >
              <option value="All">All Renewals</option>
              <option value="Yes">Has Renewal</option>
              <option value="No">No Renewal</option>
            </select>
          </div>
        </div>

        <div className="results-summary">
          <span>Showing {paginatedCustomers.length} of {sortedCustomers.length} customers</span>
          {(filters.search || filters.tier !== 'All' || filters.churnRisk !== 'All' || filters.renewal !== 'All') && (
            <span className="filter-indicator">Filtered results</span>
          )}
        </div>

        <div className="table-container">
          <table className="customer-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('customerName')} className="sortable">
                  Name {getSortIndicator('customerName')}
                </th>
                <th onClick={() => handleSort('tier')} className="sortable">
                  CLV Tier {getSortIndicator('tier')}
                </th>
                <th onClick={() => handleSort('clv')} className="sortable">
                  CLV (12M) {getSortIndicator('clv')}
                </th>
                <th onClick={() => handleSort('renewal')} className="sortable">
                  Renewal {getSortIndicator('renewal')}
                </th>
                <th onClick={() => handleSort('churnRisk')} className="sortable">
                  Churn Risk {getSortIndicator('churnRisk')}
                </th>
                <th onClick={() => handleSort('engagementScore')} className="sortable">
                  Engagement Score {getSortIndicator('engagementScore')}
                </th>
                <th onClick={() => handleSort('tenure')} className="sortable">
                  Tenure {getSortIndicator('tenure')}
                </th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((customer) => (
                <tr key={customer.id} className="customer-row">
                  <td className="customer-name-cell">
                    <div className="name-info">
                      <strong>{customer.customerName}</strong>
                      <small>{customer.email}</small>
                    </div>
                  </td>
                  <td>
                    <span className={`tier-badge tier-${customer.tier.toLowerCase()}`}>
                      {customer.tier}
                    </span>
                  </td>
                  <td className="clv-cell">
                    <strong>{service.formatCurrency(customer.clv)}</strong>
                  </td>
                  <td className="renewal-cell">
                    <span className={`renewal-status ${customer.renewal.toLowerCase()}`}>
                      {customer.renewal}
                    </span>
                  </td>
                  <td>
                    <span 
                      className={`churn-badge churn-${customer.churnRisk.toLowerCase()}`}
                      title={`Risk factors: ${customer.riskFactors.join(', ')}`}
                    >
                      {customer.churnRisk}
                    </span>
                  </td>
                  <td className="engagement-cell">
                    <span className="engagement-score">{customer.engagementScore}</span>
                  </td>
                  <td className="tenure-cell">
                    {customer.tenure} months
                  </td>
                  <td className="location-cell">
                    {customer.location}
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="action-btn profile-btn"
                      onClick={() => handleViewProfile(customer)}
                      title="View detailed customer profile"
                    >
                      Profile
                    </button>
                    <button 
                      className="action-btn snapshot-btn"
                      onClick={() => handleViewSnapshot(customer)}
                      title="Quick customer snapshot"
                    >
                      Snapshot
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="page-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            
            <div className="page-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button 
              className="page-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
            
            <span className="page-info">
              {pageSize} of {sortedCustomers.length} customers
            </span>
          </div>
        )}
      </section>
    </div>
  );
}