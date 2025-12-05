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
      
      if (['clv', 'lifetimeValue', 'engagementScore', 'tenure', 'age', 'creditScore', 'churnRiskValue'].includes(profileSort.field)) {
        aVal = typeof aVal === 'number' ? aVal : parseFloat(aVal) || 0;
        bVal = typeof bVal === 'number' ? bVal : parseFloat(bVal) || 0;
      }

      if (profileSort.field === 'renewalDate') {
        aVal = new Date(aVal || '1900-01-01');
        bVal = new Date(bVal || '1900-01-01');
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

  const handleProfileSort = (field) => {
    setProfileSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle viewing customer profile
  const handleViewProfile = (customer) => {
    setSelectedCustomer(customer);
  };

  // Helper function to format renewal date
  const formatRenewalDate = (renewalDate) => {
    if (!renewalDate) return 'N/A';
    try {
      const date = new Date(renewalDate);
      return date.toLocaleDateString();
    } catch {
      return renewalDate;
    }
  };

  // Helper function to get risk level based on churn risk percentage
  const getRiskLevel = (churnRiskValue) => {
    if (churnRiskValue >= 70) return 'High';
    if (churnRiskValue >= 40) return 'Medium';
    return 'Low';
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
                <th onClick={() => handleProfileSort('clv')} className="sortable">
                  CLV (12 Months) {profileSort.field === 'clv' && (profileSort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleProfileSort('churnRiskValue')} className="sortable">
                  Risk Level {profileSort.field === 'churnRiskValue' && (profileSort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleProfileSort('renewalDate')} className="sortable">
                  Renewal Date {profileSort.field === 'renewalDate' && (profileSort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleProfileSort('tier')} className="sortable">
                  Tier {profileSort.field === 'tier' && (profileSort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleProfileSort('churnRiskValue')} className="sortable">
                  Churn Risk (%) {profileSort.field === 'churnRiskValue' && (profileSort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="actions-header">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.data.map((customer) => (
                <tr key={customer.id} className="profile-row">
                  <td className="profile-name">{customer.customerName}</td>
                  <td className="profile-clv">
                    {customerIntelligenceService.formatCurrency(customer.clv)}
                  </td>
                  <td className="profile-risk-level">
                    <span className={`risk-level-badge risk-${getRiskLevel(customer.churnRiskValue).toLowerCase()}`}>
                      {getRiskLevel(customer.churnRiskValue)}
                    </span>
                  </td>
                  <td className="profile-renewal-date">
                    {formatRenewalDate(customer.renewalDate)}
                  </td>
                  <td className={`profile-tier tier-${customer.tier.toLowerCase()}`}>
                    {customer.tier}
                  </td>
                  <td className="profile-churn-percentage">
                    <span className={`churn-percentage risk-${getRiskLevel(customer.churnRiskValue).toLowerCase()}`}>
                      {customer.churnRiskValue ? customer.churnRiskValue.toFixed(1) : '0.0'}%
                    </span>
                  </td>
                  <td className="profile-actions">
                    <button 
                      className="profile-btn"
                      onClick={() => handleViewProfile(customer)}
                      title="View Customer Profile"
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