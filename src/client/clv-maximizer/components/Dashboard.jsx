import React, { useState, useEffect, useMemo } from 'react';
import { CLVDataService } from '../services/CLVDataService.js';
import { display, value } from '../utils/fields.js';
import './Dashboard.css';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    customers: [],
    customerProfiles: [],
    incidents: [],
    activities: []
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
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

  // Selected drill-down states
  const [selectedChurnRisk, setSelectedChurnRisk] = useState(null);
  const [selectedRenewalPeriod, setSelectedRenewalPeriod] = useState(null);

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
      const [customers, customerProfiles, incidents, activities] = await Promise.all([
        service.getCustomerData(),
        service.getCustomerProfiles(), // New method for csm_consumer table
        service.getIncidentData(),
        service.getUserActivity()
      ]);

      setDashboardData({ customers, customerProfiles, incidents, activities });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate churn risk distribution
  const churnRiskData = useMemo(() => {
    const profiles = dashboardData.customerProfiles;
    const total = profiles.length;
    
    const riskCounts = {
      'High Risk': profiles.filter(p => p.churnRisk === 'High').length,
      'Medium Risk': profiles.filter(p => p.churnRisk === 'Medium').length,
      'Low Risk': profiles.filter(p => p.churnRisk === 'Low').length
    };

    return Object.entries(riskCounts).map(([risk, count]) => ({
      risk,
      count,
      percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0,
      color: risk === 'High Risk' ? '#dc2626' : risk === 'Medium Risk' ? '#f59e0b' : '#059669'
    }));
  }, [dashboardData.customerProfiles]);

  // Calculate renewal timeline distribution
  const renewalTimelineData = useMemo(() => {
    const profiles = dashboardData.customerProfiles;
    const now = new Date();
    
    const timelineCounts = {
      'Next 30 Days': 0,
      '31–60 Days': 0,
      '61–90 Days': 0
    };

    profiles.forEach(profile => {
      if (profile.renewalDate) {
        const renewalDate = new Date(profile.renewalDate);
        const daysDiff = Math.ceil((renewalDate - now) / (1000 * 60 * 60 * 24));
        
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
  }, [dashboardData.customerProfiles]);

  // Filter and sort customer profiles
  const filteredProfiles = useMemo(() => {
    let filtered = dashboardData.customerProfiles;

    // Apply filters
    if (profileFilter.search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(profileFilter.search.toLowerCase())
      );
    }
    if (profileFilter.tier) {
      filtered = filtered.filter(p => p.clvTier === profileFilter.tier);
    }
    if (profileFilter.churnRisk) {
      filtered = filtered.filter(p => p.churnRisk === profileFilter.churnRisk);
    }
    if (profileFilter.renewal) {
      const renewalBool = profileFilter.renewal === 'Yes';
      filtered = filtered.filter(p => p.renewal === renewalBool);
    }

    // Apply drill-down filters
    if (selectedChurnRisk) {
      filtered = filtered.filter(p => p.churnRisk === selectedChurnRisk);
    }
    if (selectedRenewalPeriod) {
      const now = new Date();
      filtered = filtered.filter(p => {
        if (!p.renewalDate) return false;
        const renewalDate = new Date(p.renewalDate);
        const daysDiff = Math.ceil((renewalDate - now) / (1000 * 60 * 60 * 24));
        
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
  }, [dashboardData.customerProfiles, profileFilter, profileSort, selectedChurnRisk, selectedRenewalPeriod]);

  // Paginate profiles
  const paginatedProfiles = useMemo(() => {
    const startIndex = (profilePage - 1) * profilePageSize;
    const endIndex = startIndex + profilePageSize;
    
    return {
      data: filteredProfiles.slice(startIndex, endIndex),
      pagination: {
        currentPage: profilePage,
        pageSize: profilePageSize,
        totalRecords: filteredProfiles.length,
        totalPages: Math.ceil(filteredProfiles.length / profilePageSize)
      }
    };
  }, [filteredProfiles, profilePage, profilePageSize]);

  // Handle churn risk bar click
  const handleChurnRiskClick = (risk) => {
    setSelectedChurnRisk(selectedChurnRisk === risk ? null : risk);
    setSelectedRenewalPeriod(null); // Clear other drill-down
    setProfilePage(1);
  };

  // Handle renewal timeline bar click
  const handleRenewalTimelineClick = (period) => {
    setSelectedRenewalPeriod(selectedRenewalPeriod === period ? null : period);
    setSelectedChurnRisk(null); // Clear other drill-down
    setProfilePage(1);
  };

  // Handle profile table sorting
  const handleProfileSort = (field) => {
    setProfileSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle profile actions
  const handleProfileAction = (profileId, action) => {
    console.log(`${action} action for profile:`, profileId);
    // Future implementation: Navigate to profile/snapshot view
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
        {/* Churn Risk Heatmap */}
        <section className="dashboard-section churn-heatmap-section">
          <div className="section-header">
            <h2>Churn Risk Heatmap</h2>
            {selectedChurnRisk && (
              <button 
                className="clear-filter-btn"
                onClick={() => setSelectedChurnRisk(null)}
                title="Clear filter"
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
                title={`Click to filter customer list by ${risk}`}
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
        </section>

        {/* Renewal Timeline Heatmap */}
        <section className="dashboard-section renewal-timeline-section">
          <div className="section-header">
            <h2>Renewal Timeline Heatmap</h2>
            {selectedRenewalPeriod && (
              <button 
                className="clear-filter-btn"
                onClick={() => setSelectedRenewalPeriod(null)}
                title="Clear filter"
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
                title={`${count} customers expiring ${period.toLowerCase()}. Click to filter list.`}
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
        </section>

        {/* Profile List */}
        <section className="dashboard-section profile-list-section">
          <div className="section-header">
            <h2>Profile List</h2>
            <div className="profile-controls">
              <input
                type="text"
                placeholder="Search by customer name..."
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
                className="profile-tier-filter"
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
                className="profile-risk-filter"
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
                className="profile-renewal-filter"
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
                {paginatedProfiles.data.map((profile, index) => (
                  <tr key={profile.id || index} className="profile-row">
                    <td className="profile-name" title={profile.name}>{profile.name}</td>
                    <td className={`profile-tier tier-${profile.clvTier.toLowerCase()}`}>
                      {profile.clvTier}
                    </td>
                    <td className="profile-clv" title={`12-month CLV: $${profile.clv12M.toLocaleString()}`}>
                      ${profile.clv12M.toLocaleString()}
                    </td>
                    <td className="profile-renewal">
                      <span className={`renewal-badge ${profile.renewal ? 'renewal-yes' : 'renewal-no'}`}>
                        {profile.renewal ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="profile-churn-risk">
                      <span className={`churn-risk-badge risk-${profile.churnRisk.toLowerCase().replace(' ', '-')}`}>
                        {profile.churnRisk}
                      </span>
                    </td>
                    <td className="profile-engagement" title={`Engagement Score: ${profile.engagementScore}`}>
                      {profile.engagementScore}
                    </td>
                    <td className="profile-tenure" title={`Tenure: ${profile.tenure} months`}>
                      {profile.tenure}
                    </td>
                    <td className="profile-location" title={profile.location}>
                      {profile.location}
                    </td>
                    <td className="profile-actions">
                      <button 
                        className="action-btn profile-btn"
                        onClick={() => handleProfileAction(profile.id, 'Profile')}
                        title="View full customer profile"
                      >
                        Profile
                      </button>
                      <button 
                        className="action-btn snapshot-btn"
                        onClick={() => handleProfileAction(profile.id, 'Snapshot')}
                        title="View customer snapshot"
                      >
                        Snapshot
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Profile Table Pagination */}
          <div className="profile-pagination">
            <div className="pagination-info">
              Showing {profilePageSize} of {paginatedProfiles.pagination.totalRecords} customers
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
                Page {profilePage} of {paginatedProfiles.pagination.totalPages}
              </span>
              <button 
                onClick={() => setProfilePage(prev => prev + 1)}
                disabled={profilePage >= paginatedProfiles.pagination.totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}