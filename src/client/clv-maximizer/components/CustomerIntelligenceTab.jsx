import React, { useState, useEffect, useMemo } from 'react';
import { CustomerIntelligenceService } from '../services/CustomerIntelligenceService.js';
import './CustomerIntelligenceTab.css';

export default function CustomerIntelligenceTab() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // Profile List state
  const [profilePage, setProfilePage] = useState(1);
  const [profilePageSize] = useState(25);
  const [profileSort, setProfileSort] = useState({ field: 'customerName', direction: 'asc' });
  const [profileFilter, setProfileFilter] = useState({
    search: '',
    tier: '',
    churnRisk: '',
    renewal: ''
  });

  // Drill-down state
  const [selectedChurnRisk, setSelectedChurnRisk] = useState(null);
  const [selectedRenewalPeriod, setSelectedRenewalPeriod] = useState(null);

  const customerIntelligenceService = useMemo(() => new CustomerIntelligenceService(), []);

  useEffect(() => {
    loadCustomerIntelligenceData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadCustomerIntelligenceData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [customerIntelligenceService]);

  const loadCustomerIntelligenceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerIntelligenceService.generateCustomerAnalytics();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading customer intelligence data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate churn risk display data
  const churnRiskData = useMemo(() => {
    if (!analyticsData) return [];
    
    return [
      {
        risk: 'High Risk',
        count: analyticsData.churnDistribution.high.count,
        percentage: analyticsData.churnDistribution.high.percentage,
        color: analyticsData.churnDistribution.high.color
      },
      {
        risk: 'Medium Risk', 
        count: analyticsData.churnDistribution.medium.count,
        percentage: analyticsData.churnDistribution.medium.percentage,
        color: analyticsData.churnDistribution.medium.color
      },
      {
        risk: 'Low Risk',
        count: analyticsData.churnDistribution.low.count,
        percentage: analyticsData.churnDistribution.low.percentage,
        color: analyticsData.churnDistribution.low.color
      }
    ];
  }, [analyticsData]);

  // Calculate renewal timeline display data
  const renewalTimelineData = useMemo(() => {
    if (!analyticsData) return [];
    
    return [
      {
        period: 'Next 30 Days',
        count: analyticsData.renewalTimeline.next30.count,
        isUrgent: analyticsData.renewalTimeline.next30.urgent
      },
      {
        period: '31–60 Days',
        count: analyticsData.renewalTimeline.days31to60.count,
        isUrgent: false
      },
      {
        period: '61–90 Days',
        count: analyticsData.renewalTimeline.days61to90.count,
        isUrgent: false
      }
    ];
  }, [analyticsData]);

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    if (!analyticsData) return [];
    
    let filtered = [...analyticsData.customers];

    // Apply drill-down filters
    if (selectedChurnRisk) {
      filtered = filtered.filter(c => c.churnRisk === selectedChurnRisk.replace(' Risk', ''));
    }
    if (selectedRenewalPeriod) {
      filtered = filtered.filter(c => {
        const daysUntilRenewal = customerIntelligenceService.getDaysUntilRenewal(c.renewalDate);
        
        switch (selectedRenewalPeriod) {
          case 'Next 30 Days':
            return daysUntilRenewal <= 30 && daysUntilRenewal >= 0;
          case '31–60 Days':
            return daysUntilRenewal <= 60 && daysUntilRenewal > 30;
          case '61–90 Days':
            return daysUntilRenewal <= 90 && daysUntilRenewal > 60;
          default:
            return true;
        }
      });
    }

    // Apply regular filters
    if (profileFilter.search) {
      filtered = filtered.filter(c => 
        c.customerName.toLowerCase().includes(profileFilter.search.toLowerCase()) ||
        c.email.toLowerCase().includes(profileFilter.search.toLowerCase()) ||
        c.customerId.toLowerCase().includes(profileFilter.search.toLowerCase())
      );
    }
    if (profileFilter.tier) {
      filtered = filtered.filter(c => c.tier === profileFilter.tier);
    }
    if (profileFilter.churnRisk) {
      filtered = filtered.filter(c => c.churnRisk === profileFilter.churnRisk);
    }
    if (profileFilter.renewal) {
      filtered = filtered.filter(c => c.renewal === profileFilter.renewal);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[profileSort.field];
      let bVal = b[profileSort.field];
      
      if (['clv', 'lifetimeValue', 'engagementScore', 'tenure', 'age', 'creditScore'].includes(profileSort.field)) {
        aVal = typeof aVal === 'number' ? aVal : parseFloat(aVal) || 0;
        bVal = typeof bVal === 'number' ? bVal : parseFloat(bVal) || 0;
      }

      if (profileSort.direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [analyticsData, profileFilter, profileSort, selectedChurnRisk, selectedRenewalPeriod, customerIntelligenceService]);

  // Paginate customers
  const paginatedCustomers = useMemo(() => {
    const startIndex = (profilePage - 1) * profilePageSize;
    const endIndex = startIndex + profilePageSize;
    
    return {
      data: filteredCustomers.slice(startIndex, endIndex),
      pagination: {
        currentPage: profilePage,
        pageSize: profilePageSize,
        totalRecords: filteredCustomers.length,
        totalPages: Math.ceil(filteredCustomers.length / profilePageSize)
      }
    };
  }, [filteredCustomers, profilePage, profilePageSize]);

  // Handle actions
  const handleChurnRiskClick = (risk) => {
    setSelectedChurnRisk(selectedChurnRisk === risk ? null : risk);
    setSelectedRenewalPeriod(null);
    setProfilePage(1);
  };

  const handleRenewalTimelineClick = (period) => {
    setSelectedRenewalPeriod(selectedRenewalPeriod === period ? null : period);
    setSelectedChurnRisk(null);
    setProfilePage(1);
  };

  const handleProfileSort = (field) => {
    setProfileSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (loading) {
    return (
      <div className="customer-intelligence-loading">
        <div className="loading-spinner"></div>
        <p>Loading Customer Intelligence Hub...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-intelligence-error">
        <h2>⚠️ Error Loading Policy Holders Data</h2>
        <p>{error}</p>
        <button onClick={loadCustomerIntelligenceData} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="customer-intelligence-error">
        <h2>No Data Available</h2>
        <p>No policy holder data found.</p>
        <button onClick={loadCustomerIntelligenceData} className="retry-btn">
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="customer-intelligence-hub">
      {/* Header Panel */}
      <div className="intelligence-header-panel">
        <div className="header-content">
          <div className="header-text">
            <h1>Customer Intelligence Hub</h1>
            <p>Analyzing {analyticsData.summaryMetrics.totalCustomers} policy holders from x_hete_clv_maximiz_policy_holders table</p>
          </div>
        </div>
      </div>

      {/* Summary Metrics Panel */}
      <div className="summary-metrics-panel">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-value">{analyticsData.summaryMetrics.totalCustomers.toLocaleString()}</div>
            <div className="metric-label">Total Customers</div>
          </div>
        </div>

        <div className="metric-card high-risk" onClick={() => handleChurnRiskClick('High Risk')}>
          <div className="metric-icon">⚠️</div>
          <div className="metric-content">
            <div className="metric-value">{analyticsData.summaryMetrics.highRiskCount.toLocaleString()}</div>
            <div className="metric-label">High Risk Customers</div>
          </div>
        </div>

        <div className="metric-card average-clv">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-value">{customerIntelligenceService.formatCurrency(analyticsData.summaryMetrics.averageCLV)}</div>
            <div className="metric-label">Average CLV</div>
          </div>
        </div>

        <div className="metric-card platinum-tier">
          <div className="metric-icon">💎</div>
          <div className="metric-content">
            <div className="metric-value">{analyticsData.summaryMetrics.platinumCount.toLocaleString()}</div>
            <div className="metric-label">Platinum Tier Count</div>
          </div>
        </div>
      </div>

      <div className="intelligence-grid">
        {/* Churn Risk Heatmap */}
        <div className="intelligence-section churn-heatmap-section">
          <div className="section-header">
            <h2>Churn Risk Heatmap</h2>
            {selectedChurnRisk && (
              <button 
                className="clear-filter-btn"
                onClick={() => setSelectedChurnRisk(null)}
              >
                Clear "{selectedChurnRisk}" filter ✕
              </button>
            )}
          </div>
          
          <div className="churn-heatmap">
            {churnRiskData.map(({ risk, count, percentage, color }) => (
              <div 
                key={risk} 
                className={`churn-risk-bar ${selectedChurnRisk === risk ? 'selected' : ''}`}
                onClick={() => handleChurnRiskClick(risk)}
              >
                <div className="risk-label">{risk}</div>
                <div className="risk-bar-container">
                  <div 
                    className="risk-bar-fill" 
                    style={{ 
                      backgroundColor: color,
                      width: `${Math.max((count / Math.max(...churnRiskData.map(d => d.count), 1)), 0.1) * 100}%`
                    }}
                  ></div>
                  <div className="risk-stats">
                    <span className="risk-count">{count}</span>
                    <span className="risk-percentage">({percentage}%)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Renewal Timeline Heatmap */}
        <div className="intelligence-section renewal-timeline-section">
          <div className="section-header">
            <h2>Renewal Timeline Heatmap</h2>
            {selectedRenewalPeriod && (
              <button 
                className="clear-filter-btn"
                onClick={() => setSelectedRenewalPeriod(null)}
              >
                Clear "{selectedRenewalPeriod}" filter ✕
              </button>
            )}
          </div>
          
          <div className="renewal-timeline-chart">
            {renewalTimelineData.map(({ period, count, isUrgent }) => (
              <div 
                key={period}
                className={`renewal-timeline-bar ${isUrgent ? 'urgent' : ''} ${selectedRenewalPeriod === period ? 'selected' : ''}`}
                onClick={() => handleRenewalTimelineClick(period)}
              >
                <div className="timeline-label">
                  {period}
                  {isUrgent && <span className="urgent-indicator">⚠</span>}
                </div>
                <div className="timeline-bar-container">
                  <div 
                    className="timeline-bar-fill"
                    style={{ 
                      width: `${Math.max((count / Math.max(...renewalTimelineData.map(d => d.count), 1)), 0.1) * 100}%`,
                      backgroundColor: isUrgent ? '#dc2626' : period === '31–60 Days' ? '#f59e0b' : '#059669'
                    }}
                  ></div>
                  <span className="timeline-count">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Profile List */}
      <div className="intelligence-section profile-list-section">
        <div className="section-header">
          <h2>Policy Holder Profile List</h2>
          <div className="profile-controls">
            <input
              type="text"
              placeholder="Search by customer name, email, or ID..."
              value={profileFilter.search}
              onChange={(e) => {
                setProfileFilter(prev => ({ ...prev, search: e.target.value }));
                setProfilePage(1);
              }}
              className="profile-search"
            />
            
            <select
              value={profileFilter.tier}
              onChange={(e) => {
                setProfileFilter(prev => ({ ...prev, tier: e.target.value }));
                setProfilePage(1);
              }}
              className="profile-filter"
            >
              <option value="">All Tiers</option>
              <option value="Platinum">Platinum</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
            </select>
            
            <select
              value={profileFilter.churnRisk}
              onChange={(e) => {
                setProfileFilter(prev => ({ ...prev, churnRisk: e.target.value }));
                setProfilePage(1);
              }}
              className="profile-filter"
            >
              <option value="">All Risk Levels</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
            
            <select
              value={profileFilter.renewal}
              onChange={(e) => {
                setProfileFilter(prev => ({ ...prev, renewal: e.target.value }));
                setProfilePage(1);
              }}
              className="profile-filter"
            >
              <option value="">All Renewals</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>
        
        <div className="profile-table-container">
          <table className="profile-table">
            <thead>
              <tr>
                <th onClick={() => handleProfileSort('customerName')} className="sortable">
                  Name {profileSort.field === 'customerName' && (profileSort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleProfileSort('customerId')} className="sortable">
                  ID {profileSort.field === 'customerId' && (profileSort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleProfileSort('tier')} className="sortable">
                  Tier {profileSort.field === 'tier' && (profileSort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleProfileSort('clv')} className="sortable">
                  CLV (12M) {profileSort.field === 'clv' && (profileSort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleProfileSort('churnRisk')} className="sortable">
                  Churn Risk {profileSort.field === 'churnRisk' && (profileSort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleProfileSort('engagementScore')} className="sortable">
                  Engagement {profileSort.field === 'engagementScore' && (profileSort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleProfileSort('preferredChannel')} className="sortable">
                  Channel {profileSort.field === 'preferredChannel' && (profileSort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.data.map((customer) => (
                <tr key={customer.id} className="profile-row">
                  <td className="profile-name">{customer.customerName}</td>
                  <td className="profile-id">{customer.customerId}</td>
                  <td className={`profile-tier tier-${customer.tier.toLowerCase()}`}>
                    {customer.tier}
                  </td>
                  <td className="profile-clv">
                    {customerIntelligenceService.formatCurrency(customer.clv)}
                  </td>
                  <td className="profile-churn-risk">
                    <span className={`churn-risk-badge risk-${customer.churnRisk.toLowerCase()}`}>
                      {customer.churnRisk}
                    </span>
                  </td>
                  <td className="profile-engagement">{customer.engagementScore}</td>
                  <td className="profile-channel">{customer.preferredChannel}</td>
                  <td className="profile-actions">
                    <button 
                      className="action-btn profile-btn"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="profile-pagination">
          <div className="pagination-info">
            Showing {Math.min(profilePageSize, filteredCustomers.length)} of {paginatedCustomers.pagination.totalRecords} policy holders
          </div>
          <div className="pagination-controls">
            <button 
              onClick={() => setProfilePage(prev => Math.max(1, prev - 1))}
              disabled={profilePage <= 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="page-info">
              Page {profilePage} of {paginatedCustomers.pagination.totalPages}
            </span>
            <button 
              onClick={() => setProfilePage(prev => prev + 1)}
              disabled={profilePage >= paginatedCustomers.pagination.totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="customer-modal" onClick={() => setSelectedCustomer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCustomer.customerName}</h2>
              <button className="modal-close" onClick={() => setSelectedCustomer(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="customer-details-grid">
                <div className="detail-group">
                  <h4>Personal Information</h4>
                  <p><strong>Customer ID:</strong> {selectedCustomer.customerId}</p>
                  <p><strong>Email:</strong> {selectedCustomer.email}</p>
                  <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                  <p><strong>Age:</strong> {selectedCustomer.age}</p>
                  <p><strong>Preferred Channel:</strong> {selectedCustomer.preferredChannel}</p>
                </div>

                <div className="detail-group">
                  <h4>Financial Profile</h4>
                  <p><strong>CLV (12M):</strong> {customerIntelligenceService.formatCurrency(selectedCustomer.clv)}</p>
                  <p><strong>Lifetime Value:</strong> {customerIntelligenceService.formatCurrency(selectedCustomer.lifetimeValue)}</p>
                  <p><strong>Tier:</strong> {selectedCustomer.tier}</p>
                  <p><strong>Credit Score:</strong> {selectedCustomer.creditScore}</p>
                  <p><strong>Credit Utilization:</strong> {selectedCustomer.creditUtilization.toFixed(1)}%</p>
                </div>

                <div className="detail-group">
                  <h4>Risk & Engagement</h4>
                  <p><strong>Churn Risk:</strong> {selectedCustomer.churnRisk} ({selectedCustomer.churnRiskValue.toFixed(1)}%)</p>
                  <p><strong>Engagement Score:</strong> {selectedCustomer.engagementScore}</p>
                  <p><strong>App Sessions (30d):</strong> {selectedCustomer.appSessions}</p>
                  <p><strong>Website Visits (30d):</strong> {selectedCustomer.websiteVisits}</p>
                  <p><strong>Quote Views:</strong> {selectedCustomer.quoteViews}</p>
                  <p><strong>Tenure:</strong> {Math.round(selectedCustomer.tenure / 12)} years</p>
                </div>

                <div className="detail-group">
                  <h4>Additional Information</h4>
                  <p><strong>Missing Coverage:</strong> {selectedCustomer.missingCoverage}</p>
                  <p><strong>Risk Factors:</strong></p>
                  <ul>{selectedCustomer.riskFactors.map((factor, idx) => <li key={idx}>{factor}</li>)}</ul>
                  <p><strong>Opportunities:</strong></p>
                  <ul>{selectedCustomer.opportunities.map((opp, idx) => <li key={idx}>{opp}</li>)}</ul>
                  <p><strong>Bankruptcy Flag:</strong> {selectedCustomer.bankruptcyFlag ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}