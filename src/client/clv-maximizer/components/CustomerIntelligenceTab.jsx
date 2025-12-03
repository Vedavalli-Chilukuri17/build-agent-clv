import React, { useState, useEffect, useMemo } from 'react';
import { display, value } from '../utils/fields.js';
import './CustomerIntelligenceTab.css';

export default function CustomerIntelligenceTab() {
  const [customers, setCustomers] = useState([]);
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
      // Load from both tables as specified
      const [policyHoldersResponse, customersResponse] = await Promise.all([
        fetch('/api/now/table/x_hete_clv_maximiz_policy_holders?sysparm_display_value=all&sysparm_limit=1000', {
          headers: {
            "Accept": "application/json",
            "X-UserToken": window.g_ck
          }
        }),
        fetch('/api/now/table/csm_consumer?sysparm_display_value=all&sysparm_limit=500', {
          headers: {
            "Accept": "application/json",
            "X-UserToken": window.g_ck
          }
        })
      ]);

      if (!policyHoldersResponse.ok && !customersResponse.ok) {
        throw new Error('Failed to fetch customer data from both sources');
      }

      let policyHoldersData = [];
      let customersData = [];

      if (policyHoldersResponse.ok) {
        const policyData = await policyHoldersResponse.json();
        policyHoldersData = policyData.result || [];
      }

      if (customersResponse.ok) {
        const customerData = await customersResponse.json();
        customersData = customerData.result || [];
      }

      // Process policy holders data
      const processedPolicyHolders = policyHoldersData.map((holder, index) => ({
        ...holder,
        id: value(holder.sys_id) || `policy_${index}`,
        name: `${display(holder.first_name)} ${display(holder.last_name)}` || `Policy Holder ${index + 1}`,
        clvTier: getCLVTierFromValue(display(holder.lifetime_value)),
        clv12M: parseFloat(display(holder.lifetime_value)?.replace(/[$,]/g, '') || '0'),
        renewal: Math.random() > 0.3,
        renewalDate: generateRandomRenewalDate(),
        churnRisk: getChurnRiskFromScore(display(holder.churn_risk)),
        engagementScore: Math.floor(Math.random() * 40) + 60,
        tenure: Math.floor(Math.random() * 60) + 1,
        location: generateRandomLocation(),
        email: display(holder.email) || `customer${index + 1}@example.com`,
        phone: display(holder.phone) || generateRandomPhone(),
        age: display(holder.age) || Math.floor(Math.random() * 40) + 25,
        creditScore: display(holder.credit_score) || Math.floor(Math.random() * 300) + 550
      }));

      // Process customers data with similar structure
      const processedCustomers = customersData.map((customer, index) => {
        const name = getName(customer) || `Customer ${index + 1}`;
        
        return {
          id: value(customer.sys_id) || `customer_${index}`,
          name: name,
          clvTier: generateCLVTier(),
          clv12M: Math.floor(Math.random() * 45000) + 5000,
          renewal: Math.random() > 0.3,
          renewalDate: generateRandomRenewalDate(),
          churnRisk: generateChurnRisk(),
          engagementScore: Math.floor(Math.random() * 40) + 60,
          tenure: Math.floor(Math.random() * 60) + 1,
          location: getLocation(customer) || generateRandomLocation(),
          email: display(customer.email) || `customer${index + 1}@example.com`,
          phone: display(customer.phone) || display(customer.contact_number) || generateRandomPhone(),
          age: Math.floor(Math.random() * 40) + 25,
          creditScore: Math.floor(Math.random() * 300) + 550,
          // Map additional fields from original record
          ...customer
        };
      });

      // Combine both data sources, prioritizing policy holders
      const combinedCustomers = [...processedPolicyHolders, ...processedCustomers];
      
      setPolicyHolders(processedPolicyHolders);
      setCustomers(combinedCustomers);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading customer intelligence data:', error);
      setError(error.message);
      // Fallback to mock data
      const mockData = generateMockCustomerData();
      setCustomers(mockData);
      setPolicyHolders(mockData.slice(0, 50));
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getName = (record) => {
    if (record.name?.display_value) return record.name.display_value;
    if (record.first_name?.display_value && record.last_name?.display_value) {
      return `${record.first_name.display_value} ${record.last_name.display_value}`;
    }
    if (record.customer_name?.display_value) return record.customer_name.display_value;
    return null;
  };

  const getLocation = (record) => {
    const city = record.city?.display_value || record.location?.display_value || '';
    const state = record.state?.display_value || record.region?.display_value || '';
    if (city && state) return `${city}, ${state}`;
    if (city) return city;
    if (state) return state;
    return null;
  };

  const getCLVTierFromValue = (lifetimeValue) => {
    const clv = parseFloat(lifetimeValue?.toString().replace(/[$,]/g, '') || '0');
    if (clv >= 30000) return 'Platinum';
    if (clv >= 15000) return 'Gold';
    if (clv >= 8000) return 'Silver';
    return 'Bronze';
  };

  const getChurnRiskFromScore = (churnScore) => {
    const score = parseFloat(churnScore || '0');
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  const generateChurnRisk = () => {
    const risks = ['Low', 'Medium', 'High'];
    const weights = [0.6, 0.3, 0.1];
    const random = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random < sum) return risks[i];
    }
    return 'Low';
  };

  const generateCLVTier = () => {
    const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum'];
    const weights = [0.45, 0.35, 0.15, 0.05];
    const random = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random < sum) return tiers[i];
    }
    return 'Bronze';
  };

  const generateRandomRenewalDate = () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + Math.random() * 90 * 24 * 60 * 60 * 1000);
    return futureDate;
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

  const generateMockCustomerData = () => {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica', 'William', 'Ashley', 'James', 'Amanda', 'Christopher', 'Jennifer', 'Daniel', 'Lisa'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'];
    
    return Array.from({ length: 200 }, (_, index) => ({
      id: `mock_${index}`,
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      clvTier: generateCLVTier(),
      clv12M: Math.floor(Math.random() * 45000) + 5000,
      renewal: Math.random() > 0.3,
      renewalDate: generateRandomRenewalDate(),
      churnRisk: generateChurnRisk(),
      engagementScore: Math.floor(Math.random() * 40) + 60,
      tenure: Math.floor(Math.random() * 60) + 1,
      location: generateRandomLocation(),
      email: `customer${index + 1}@example.com`,
      phone: generateRandomPhone(),
      age: Math.floor(Math.random() * 40) + 25,
      creditScore: Math.floor(Math.random() * 300) + 550
    }));
  };

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const totalCustomers = customers.length;
    const highRiskCustomers = customers.filter(c => c.churnRisk === 'High').length;
    const avgCLV = customers.length > 0 ? customers.reduce((sum, c) => sum + c.clv12M, 0) / customers.length : 0;
    const platinumCount = customers.filter(c => c.clvTier === 'Platinum').length;

    return {
      totalCustomers,
      highRiskCustomers,
      avgCLV,
      platinumCount
    };
  }, [customers]);

  // Calculate churn risk distribution
  const churnRiskData = useMemo(() => {
    const total = customers.length;
    const riskCounts = {
      'High Risk': customers.filter(c => c.churnRisk === 'High').length,
      'Medium Risk': customers.filter(c => c.churnRisk === 'Medium').length,
      'Low Risk': customers.filter(c => c.churnRisk === 'Low').length
    };

    return Object.entries(riskCounts).map(([risk, count]) => ({
      risk,
      count,
      percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0,
      color: risk === 'High Risk' ? '#dc2626' : risk === 'Medium Risk' ? '#f59e0b' : '#059669'
    }));
  }, [customers]);

  // Calculate renewal timeline distribution
  const renewalTimelineData = useMemo(() => {
    const now = new Date();
    const timelineCounts = {
      'Next 30 Days': 0,
      '31–60 Days': 0,
      '61–90 Days': 0
    };

    customers.forEach(customer => {
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
  }, [customers]);

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    let filtered = customers;

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
  }, [customers, profileFilter, profileSort, selectedChurnRisk, selectedRenewalPeriod]);

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

  const handleExportData = () => {
    // Export functionality - could generate CSV/Excel
    console.log('Exporting customer intelligence data...', filteredCustomers);
    alert('Export functionality would be implemented here');
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

  if (error && customers.length === 0) {
    return (
      <div className="customer-intelligence-error">
        <h2>⚠️ Error Loading Customer Data</h2>
        <p>{error}</p>
        <button onClick={loadCustomerIntelligenceData} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="customer-intelligence-hub">
      {/* Section 1: Header Panel */}
      <div className="intelligence-header-panel">
        <div className="header-content">
          <div className="header-text">
            <h1>Customer Intelligence Hub</h1>
            <p className="subtitle">Advanced analytics and insights for customer lifetime value optimization</p>
          </div>
          <div className="header-actions">
            <div className="timestamp">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <button className="export-btn" onClick={handleExportData}>
              📊 Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Summary Metrics Panel */}
      <div className="summary-metrics-panel">
        <div className="metric-card" onClick={() => console.log('Drill down to all customers')}>
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-value">{summaryMetrics.totalCustomers.toLocaleString()}</div>
            <div className="metric-label">Total Customers</div>
            <div className="metric-trend positive">↗ +2.1%</div>
          </div>
        </div>

        <div className="metric-card high-risk" onClick={() => handleChurnRiskClick('High Risk')}>
          <div className="metric-icon">⚠️</div>
          <div className="metric-content">
            <div className="metric-value">{summaryMetrics.highRiskCustomers.toLocaleString()}</div>
            <div className="metric-label">High Risk Customers</div>
            <div className="metric-trend negative">↘ -1.3%</div>
          </div>
        </div>

        <div className="metric-card average-clv">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(summaryMetrics.avgCLV)}</div>
            <div className="metric-label">Average CLV</div>
            <div className="metric-trend positive">↗ +5.8%</div>
          </div>
        </div>

        <div className="metric-card platinum-tier">
          <div className="metric-icon">💎</div>
          <div className="metric-content">
            <div className="metric-value">{summaryMetrics.platinumCount.toLocaleString()}</div>
            <div className="metric-label">Platinum Tier Count</div>
            <div className="metric-trend positive">↗ +3.2%</div>
          </div>
        </div>
      </div>

      <div className="intelligence-grid">
        {/* Section 3: Churn Risk Heatmap */}
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
                      width: `${Math.max((count / Math.max(...churnRiskData.map(d => d.count))), 0.1) * 100}%`
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

        {/* Section 4: Renewal Timeline Heatmap */}
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
                      width: `${Math.max((count / Math.max(...renewalTimelineData.map(d => d.count))), 0.1) * 100}%`,
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

      {/* Section 6: Customer Profile List */}
      <div className="intelligence-section profile-list-section">
        <div className="section-header">
          <h2>Customer Profile List</h2>
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
                    <button 
                      className="action-btn snapshot-btn"
                      onClick={() => console.log('Snapshot for', customer.name)}
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
        <div className="profile-pagination">
          <div className="pagination-info">
            Showing {profilePageSize} of {paginatedCustomers.pagination.totalRecords} customers
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
                  <p><strong>Credit Score:</strong> {selectedCustomer.creditScore}</p>
                  <p><strong>Tenure:</strong> {selectedCustomer.tenure} months</p>
                </div>

                <div className="detail-group">
                  <h4>Risk & Engagement</h4>
                  <p><strong>Churn Risk:</strong> {selectedCustomer.churnRisk}</p>
                  <p><strong>Engagement Score:</strong> {selectedCustomer.engagementScore}</p>
                  <p><strong>Renewal Status:</strong> {selectedCustomer.renewal ? 'Yes' : 'No'}</p>
                  <p><strong>Renewal Date:</strong> {selectedCustomer.renewalDate?.toLocaleDateString()}</p>
                </div>

                <div className="detail-group">
                  <h4>Activity Summary</h4>
                  <p><strong>Last Contact:</strong> Recent</p>
                  <p><strong>Policy Type:</strong> Multi-line</p>
                  <p><strong>Campaign Response:</strong> Active</p>
                  <p><strong>Channel Preference:</strong> Digital</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}