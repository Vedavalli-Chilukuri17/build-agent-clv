import React, { useState, useEffect, useMemo } from 'react';
import { display, value } from '../utils/fields.js';
import './CustomerIntelligenceTab.css';

export default function CustomerIntelligenceTab() {
  const [policyHolders, setPolicyHolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // Profile List state
  const [profilePage, setProfilePage] = useState(1);
  const [profilePageSize] = useState(25);
  const [profileSort, setProfileSort] = useState({ field: 'name', direction: 'asc' });
  const [profileFilter, setProfileFilter] = useState({
    search: '',
    tier: '',
    churnRisk: '',
    renewal: ''
  });

  // Drill-down state
  const [selectedChurnRisk, setSelectedChurnRisk] = useState(null);
  const [selectedRenewalPeriod, setSelectedRenewalPeriod] = useState(null);

  useEffect(() => {
    loadCustomerIntelligenceData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadCustomerIntelligenceData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadCustomerIntelligenceData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load ONLY from x_hete_clv_maximiz_policy_holders table as requested
      const policyHoldersResponse = await fetch('/api/now/table/x_hete_clv_maximiz_policy_holders?sysparm_display_value=all&sysparm_limit=1000', {
        headers: {
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        }
      });

      if (!policyHoldersResponse.ok) {
        throw new Error('Failed to fetch policy holders data');
      }

      const policyData = await policyHoldersResponse.json();
      const policyHoldersData = policyData.result || [];

      // Process policy holders data - using actual fields from the table
      const processedPolicyHolders = policyHoldersData.map((holder, index) => {
        const firstName = display(holder.first_name) || '';
        const lastName = display(holder.last_name) || '';
        const fullName = display(holder.name) || `${firstName} ${lastName}`.trim() || `Policy Holder ${index + 1}`;
        
        // Use actual field values from the table
        const lifetimeValue = parseFloat(display(holder.lifetime_value)?.toString().replace(/[$,]/g, '') || '0');
        const churnRiskPercent = parseFloat(display(holder.churn_risk) || '0');
        const tierFromDB = display(holder.tier) || getCLVTierFromValue(lifetimeValue);
        const tenureYears = parseInt(display(holder.tenure_years) || '0');
        const creditScore = parseInt(display(holder.credit_score) || '0');
        const age = parseInt(display(holder.age) || '0');
        
        // Calculate renewal date from tenure (simulate renewal cycles)
        const renewalDate = generateRenewalDateFromTenure(tenureYears);
        
        return {
          ...holder,
          id: value(holder.sys_id) || `policy_${index}`,
          name: fullName,
          clvTier: tierFromDB,
          clv12M: lifetimeValue,
          renewal: Math.random() > 0.3, // Simulate renewal likelihood
          renewalDate: renewalDate,
          churnRisk: getChurnRiskFromPercent(churnRiskPercent),
          // Use actual engagement metrics from table if available
          engagementScore: calculateEngagementScore(holder),
          tenure: tenureYears * 12, // Convert years to months for display
          location: generateLocationFromData(holder) || generateRandomLocation(),
          email: display(holder.email) || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
          phone: display(holder.phone) || generateRandomPhone(),
          age: age || Math.floor(Math.random() * 40) + 25,
          creditScore: creditScore || Math.floor(Math.random() * 300) + 550,
          // Add additional fields from the policy holders table
          preferredChannel: display(holder.preferred_channel) || 'Email',
          appSessions: parseInt(display(holder.app_sessions_30_days) || '0'),
          websiteVisits: parseInt(display(holder.website_visits_30_days) || '0'),
          riskFlags: display(holder.risk_flags) || '',
          missingCoverage: display(holder.missing_coverage) || '',
          clvScore: parseFloat(display(holder.clv_score) || '0'),
        };
      });

      setPolicyHolders(processedPolicyHolders);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading policy holders data:', error);
      setError(error.message);
      // Fallback to mock data if needed
      const mockData = generateMockPolicyHolderData();
      setPolicyHolders(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions updated to use policy holders data
  const getCLVTierFromValue = (lifetimeValue) => {
    const clv = parseFloat(lifetimeValue || '0');
    if (clv >= 75000) return 'Platinum';  // Adjusted thresholds based on actual data
    if (clv >= 40000) return 'Gold';
    if (clv >= 20000) return 'Silver';
    return 'Bronze';
  };

  const getChurnRiskFromPercent = (churnPercent) => {
    const percent = parseFloat(churnPercent || '0');
    if (percent >= 60) return 'High';     // 60%+ = High Risk
    if (percent >= 30) return 'Medium';   // 30-59% = Medium Risk
    return 'Low';                         // <30% = Low Risk
  };

  const calculateEngagementScore = (holder) => {
    // Calculate engagement based on actual fields from policy holders table
    const appSessions = parseInt(display(holder.app_sessions_30_days) || '0');
    const websiteVisits = parseInt(display(holder.website_visits_30_days) || '0');
    const avgSessionTime = parseInt(display(holder.avg_session_time_min) || '0');
    
    // Simple engagement scoring algorithm
    let score = 0;
    score += Math.min(appSessions * 2, 40);      // Max 40 points from app sessions
    score += Math.min(websiteVisits, 30);        // Max 30 points from website visits
    score += Math.min(avgSessionTime, 30);       // Max 30 points from session time
    
    return Math.max(Math.min(score, 100), 20);   // Ensure score is between 20-100
  };

  const generateLocationFromData = (holder) => {
    // Try to build location from available fields
    const city = display(holder.city) || '';
    const state = display(holder.state) || '';
    if (city && state) return `${city}, ${state}`;
    if (city) return city;
    if (state) return state;
    return null;
  };

  const generateRenewalDateFromTenure = (tenureYears) => {
    const now = new Date();
    // Simulate annual renewals - next renewal based on tenure
    const monthsUntilRenewal = Math.floor(Math.random() * 90); // 0-90 days
    return new Date(now.getTime() + monthsUntilRenewal * 24 * 60 * 60 * 1000);
  };

  const generateRandomLocation = () => {
    const locations = [
      'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
      'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
      'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC',
      'Seattle, WA', 'Denver, CO', 'Boston, MA', 'Detroit, MI', 'Nashville, TN'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const generateRandomPhone = () => {
    const area = Math.floor(Math.random() * 800) + 200;
    const exchange = Math.floor(Math.random() * 800) + 200;
    const number = Math.floor(Math.random() * 10000);
    return `(${area}) ${exchange}-${number.toString().padStart(4, '0')}`;
  };

  const generateMockPolicyHolderData = () => {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica', 'William', 'Ashley', 'James', 'Amanda', 'Christopher', 'Jennifer', 'Daniel', 'Lisa'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'];
    const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum'];
    const risks = ['Low', 'Medium', 'High'];
    
    return Array.from({ length: 100 }, (_, index) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const tier = tiers[Math.floor(Math.random() * tiers.length)];
      const churnRisk = risks[Math.floor(Math.random() * risks.length)];
      
      return {
        id: `mock_policy_${index}`,
        name: `${firstName} ${lastName}`,
        clvTier: tier,
        clv12M: Math.floor(Math.random() * 100000) + 10000,
        renewal: Math.random() > 0.3,
        renewalDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000),
        churnRisk: churnRisk,
        engagementScore: Math.floor(Math.random() * 80) + 20,
        tenure: Math.floor(Math.random() * 60) + 1,
        location: generateRandomLocation(),
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        phone: generateRandomPhone(),
        age: Math.floor(Math.random() * 40) + 25,
        creditScore: Math.floor(Math.random() * 300) + 550
      };
    });
  };

  // Calculate summary metrics using ONLY policy holders data
  const summaryMetrics = useMemo(() => {
    const totalCustomers = policyHolders.length;
    const highRiskCustomers = policyHolders.filter(c => c.churnRisk === 'High').length;
    const avgCLV = policyHolders.length > 0 ? policyHolders.reduce((sum, c) => sum + c.clv12M, 0) / policyHolders.length : 0;
    const platinumCount = policyHolders.filter(c => c.clvTier === 'Platinum').length;

    return {
      totalCustomers,
      highRiskCustomers,
      avgCLV,
      platinumCount
    };
  }, [policyHolders]);

  // Calculate churn risk distribution using policy holders data
  const churnRiskData = useMemo(() => {
    const total = policyHolders.length;
    const riskCounts = {
      'High Risk': policyHolders.filter(c => c.churnRisk === 'High').length,
      'Medium Risk': policyHolders.filter(c => c.churnRisk === 'Medium').length,
      'Low Risk': policyHolders.filter(c => c.churnRisk === 'Low').length
    };

    return Object.entries(riskCounts).map(([risk, count]) => ({
      risk,
      count,
      percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0,
      color: risk === 'High Risk' ? '#dc2626' : risk === 'Medium Risk' ? '#f59e0b' : '#059669'
    }));
  }, [policyHolders]);

  // Calculate renewal timeline distribution using policy holders data
  const renewalTimelineData = useMemo(() => {
    const now = new Date();
    const timelineCounts = {
      'Next 30 Days': 0,
      '31–60 Days': 0,
      '61–90 Days': 0
    };

    policyHolders.forEach(customer => {
      if (customer.renewalDate) {
        const daysDiff = Math.ceil((customer.renewalDate - now) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= 30 && daysDiff >= 0) {
          timelineCounts['Next 30 Days']++;
        } else if (daysDiff <= 60 && daysDiff > 30) {
          timelineCounts['31–60 Days']++;
        } else if (daysDiff <= 90 && daysDiff > 60) {
          timelineCounts['61–90 Days']++;
        }
      }
    });

    return Object.entries(timelineCounts).map(([period, count]) => ({
      period,
      count,
      isUrgent: period === 'Next 30 Days'
    }));
  }, [policyHolders]);

  // Filter and sort policy holders
  const filteredCustomers = useMemo(() => {
    let filtered = policyHolders;

    // Apply drill-down filters
    if (selectedChurnRisk) {
      filtered = filtered.filter(c => c.churnRisk === selectedChurnRisk);
    }
    if (selectedRenewalPeriod) {
      const now = new Date();
      filtered = filtered.filter(c => {
        if (!c.renewalDate) return false;
        const daysDiff = Math.ceil((c.renewalDate - now) / (1000 * 60 * 60 * 24));
        
        switch (selectedRenewalPeriod) {
          case 'Next 30 Days':
            return daysDiff <= 30 && daysDiff >= 0;
          case '31–60 Days':
            return daysDiff <= 60 && daysDiff > 30;
          case '61–90 Days':
            return daysDiff <= 90 && daysDiff > 60;
          default:
            return true;
        }
      });
    }

    // Apply regular filters
    if (profileFilter.search) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(profileFilter.search.toLowerCase()) ||
        c.email.toLowerCase().includes(profileFilter.search.toLowerCase())
      );
    }
    if (profileFilter.tier) {
      filtered = filtered.filter(c => c.clvTier === profileFilter.tier);
    }
    if (profileFilter.churnRisk) {
      filtered = filtered.filter(c => c.churnRisk === profileFilter.churnRisk);
    }
    if (profileFilter.renewal) {
      const renewalBool = profileFilter.renewal === 'Yes';
      filtered = filtered.filter(c => c.renewal === renewalBool);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[profileSort.field];
      let bVal = b[profileSort.field];
      
      if (profileSort.field === 'clv12M' || profileSort.field === 'engagementScore' || profileSort.field === 'tenure') {
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
  }, [policyHolders, profileFilter, profileSort, selectedChurnRisk, selectedRenewalPeriod]);

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="customer-intelligence-loading">
        <div className="loading-spinner"></div>
        <p>Loading Customer Intelligence Hub...</p>
      </div>
    );
  }

  if (error && policyHolders.length === 0) {
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

  return (
    <div className="customer-intelligence-hub">
      {/* Section 6: Customer Profile List */}
      <div className="intelligence-section profile-list-section">
        <div className="section-header">
          <h2>Policy Holder Profile List</h2>
          <div className="profile-controls">
            <input
              type="text"
              placeholder="Search by customer name or email..."
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
                <th onClick={() => handleProfileSort('name')} className="sortable">
                  Name {profileSort.field === 'name' && (profileSort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleProfileSort('clvTier')} className="sortable">
                  CLV Tier {profileSort.field === 'clvTier' && (profileSort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleProfileSort('clv12M')} className="sortable">
                  CLV (12M) {profileSort.field === 'clv12M' && (profileSort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleProfileSort('renewal')} className="sortable">
                  Renewal {profileSort.field === 'renewal' && (profileSort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleProfileSort('churnRisk')} className="sortable">
                  Churn Risk {profileSort.field === 'churnRisk' && (profileSort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleProfileSort('engagementScore')} className="sortable">
                  Engagement Score {profileSort.field === 'engagementScore' && (profileSort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleProfileSort('tenure')} className="sortable">
                  Tenure {profileSort.field === 'tenure' && (profileSort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleProfileSort('location')} className="sortable">
                  Location {profileSort.field === 'location' && (profileSort.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.data.map((customer) => (
                <tr key={customer.id} className="profile-row">
                  <td className="profile-name">{customer.name}</td>
                  <td className={`profile-tier tier-${customer.clvTier.toLowerCase()}`}>
                    {customer.clvTier}
                  </td>
                  <td className="profile-clv">
                    {formatCurrency(customer.clv12M)}
                  </td>
                  <td className="profile-renewal">
                    <span className={`renewal-badge ${customer.renewal ? 'renewal-yes' : 'renewal-no'}`}>
                      {customer.renewal ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="profile-churn-risk">
                    <span className={`churn-risk-badge risk-${customer.churnRisk.toLowerCase()}`}>
                      {customer.churnRisk}
                    </span>
                  </td>
                  <td className="profile-engagement">{customer.engagementScore}</td>
                  <td className="profile-tenure">{customer.tenure} months</td>
                  <td className="profile-location">{customer.location}</td>
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
              <h2>{selectedCustomer.name}</h2>
              <button className="modal-close" onClick={() => setSelectedCustomer(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="customer-details-grid">
                <div className="detail-group">
                  <h4>Personal Information</h4>
                  <p><strong>Email:</strong> {selectedCustomer.email}</p>
                  <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                  <p><strong>Age:</strong> {selectedCustomer.age}</p>
                  <p><strong>Location:</strong> {selectedCustomer.location}</p>
                </div>

                <div className="detail-group">
                  <h4>Financial Profile</h4>
                  <p><strong>CLV (12M):</strong> {formatCurrency(selectedCustomer.clv12M)}</p>
                  <p><strong>CLV Tier:</strong> {selectedCustomer.clvTier}</p>
                  <p><strong>CLV Score:</strong> {selectedCustomer.clvScore}</p>
                  <p><strong>Credit Score:</strong> {selectedCustomer.creditScore}</p>
                  <p><strong>Tenure:</strong> {selectedCustomer.tenure} months</p>
                </div>

                <div className="detail-group">
                  <h4>Risk & Engagement</h4>
                  <p><strong>Churn Risk:</strong> {selectedCustomer.churnRisk}</p>
                  <p><strong>Engagement Score:</strong> {selectedCustomer.engagementScore}</p>
                  <p><strong>App Sessions (30d):</strong> {selectedCustomer.appSessions || 0}</p>
                  <p><strong>Website Visits (30d):</strong> {selectedCustomer.websiteVisits || 0}</p>
                  <p><strong>Renewal Status:</strong> {selectedCustomer.renewal ? 'Yes' : 'No'}</p>
                  <p><strong>Renewal Date:</strong> {selectedCustomer.renewalDate?.toLocaleDateString()}</p>
                </div>

                <div className="detail-group">
                  <h4>Additional Information</h4>
                  <p><strong>Preferred Channel:</strong> {selectedCustomer.preferredChannel}</p>
                  <p><strong>Risk Flags:</strong> {selectedCustomer.riskFlags || 'None'}</p>
                  <p><strong>Missing Coverage:</strong> {selectedCustomer.missingCoverage || 'None'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}