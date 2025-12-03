import React, { useState, useEffect, useMemo } from 'react';
import { RenewalService } from '../services/RenewalService.js';
import { display, value } from '../utils/fields.js';
import './RenewalTab.css';

export default function RenewalTab() {
  // Service instance
  const renewalService = useMemo(() => new RenewalService(), []);
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [policyHolders, setPolicyHolders] = useState([]);
  const [highRiskCustomers, setHighRiskCustomers] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [expandedCustomers, setExpandedCustomers] = useState(new Set());
  
  // Load data on component mount
  useEffect(() => {
    loadAllData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [renewalService]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load policy holders data from ServiceNow table
      const policyHoldersResponse = await fetch('/api/now/table/x_hete_clv_maximiz_policy_holders?sysparm_limit=1000', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      let policyHoldersData = [];
      if (policyHoldersResponse.ok) {
        const data = await policyHoldersResponse.json();
        policyHoldersData = data.result || [];
      }

      // Process and transform the policy holders data
      const transformedData = policyHoldersData.map(holder => {
        const churnRisk = parseFloat(holder.churn_risk) || 0;
        const riskLevel = holder.risk || holder.u_risk || 'low';
        const isHighRisk = churnRisk >= 70 || riskLevel === 'high';
        
        return {
          id: holder.sys_id,
          name: holder.name || `${holder.first_name || ''} ${holder.last_name || ''}`.trim(),
          email: holder.email || 'N/A',
          phone: holder.phone || 'N/A',
          riskScore: Math.round(churnRisk),
          riskTier: isHighRisk ? 'High' : (churnRisk >= 50 ? 'Medium-High' : 'Low'),
          creditScore: holder.credit_score || null,
          clv12M: parseFloat(holder.lifetime_value) || parseFloat(holder.clv) || parseFloat(holder.u_currency_2) || 0,
          clvTier: holder.tier || 'bronze',
          customerSince: holder.sys_created_on || 'N/A',
          totalPremium: parseFloat(holder.lifetime_value) || parseFloat(holder.clv) || 0,
          missingCoverage: holder.missing_coverage || '',
          engagementScore: holder.engagement_score || 0,
          appSessions: holder.app_sessions_30_days || 0,
          tenureYears: holder.tenure_years || 0,
          isHighRisk: isHighRisk,
          rawData: holder,
          // Mock policy data based on missing coverage and other fields
          policies: generatePoliciesFromData(holder),
          coverageOpportunities: generateCoverageOpportunities(holder),
          lifeEvents: [],
          propertyRisk: null,
          behaviorInsights: {
            lowAppUsage: (holder.app_sessions_30_days || 0) < 5,
            billingIrregularities: false,
            customerServiceComplaints: 0
          }
        };
      });
      
      setPolicyHolders(transformedData);
      
      // Filter only high-risk customers
      const filteredHighRisk = transformedData.filter(customer => customer.isHighRisk);
      setHighRiskCustomers(filteredHighRisk);
      
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load renewal data. Please try again.');
      console.error('Error loading renewal data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate policies from policy holder data
  const generatePoliciesFromData = (holder) => {
    const policies = [];
    const missingCoverage = holder.missing_coverage || '';
    
    // Generate basic policies - assume most customers have auto
    policies.push({
      type: 'Auto Insurance',
      status: 'Active',
      premium: Math.round((parseFloat(holder.lifetime_value) || 1200) * 0.4),
      coverageAmount: 50000,
      renewalDate: holder.renewal_date || '2024-12-31',
      coverages: ['Liability', 'Collision'],
      missingEndorsements: []
    });
    
    // Add additional policies based on tier
    if ((holder.tier || '').toLowerCase() === 'platinum') {
      policies.push({
        type: 'Umbrella Insurance',
        status: 'Active',
        premium: Math.round((parseFloat(holder.lifetime_value) || 800) * 0.3),
        coverageAmount: 100000,
        renewalDate: holder.renewal_date || '2024-12-31',
        coverages: ['Excess Liability'],
        missingEndorsements: []
      });
    }
    
    if ((holder.tier || '').toLowerCase() === 'gold' || (holder.tier || '').toLowerCase() === 'platinum') {
      policies.push({
        type: 'Home Insurance',
        status: 'Active',
        premium: Math.round((parseFloat(holder.lifetime_value) || 600) * 0.2),
        coverageAmount: 250000,
        renewalDate: holder.renewal_date || '2024-12-31',
        coverages: ['Property', 'Personal Property'],
        missingEndorsements: []
      });
    }
    
    return policies;
  };

  // Helper function to generate coverage opportunities
  const generateCoverageOpportunities = (holder) => {
    const opportunities = [];
    const missingCoverage = holder.missing_coverage || '';
    
    if (missingCoverage.toLowerCase().includes('life') || missingCoverage.toLowerCase().includes('term')) {
      opportunities.push({
        type: 'Term Life Insurance',
        priority: 'High',
        description: 'Recommended term life insurance for family protection',
        potentialPremium: 600,
        confidenceScore: 85
      });
    }
    
    if (missingCoverage.toLowerCase().includes('umbrella')) {
      opportunities.push({
        type: 'Umbrella Coverage',
        priority: 'Medium',
        description: 'Additional liability protection recommended',
        potentialPremium: 400,
        confidenceScore: 75
      });
    }
    
    return opportunities;
  };

  // Business logic for determining next best actions
  const determineNextBestAction = (customer) => {
    const actions = [];
    
    // Coverage gap actions based on missing coverage
    if (customer.missingCoverage) {
      const missing = customer.missingCoverage.toLowerCase();
      
      if (missing.includes('umbrella')) {
        actions.push({
          type: 'coverage_gap',
          priority: 'high',
          action: 'Umbrella Coverage Recommendation',
          description: 'Umbrella is a coverage opportunity. Recommend coverage.',
          expectedUplift: '20-30%',
          campaign: 'Umbrella Protection Campaign'
        });
      }
      
      if (missing.includes('life') || missing.includes('term')) {
        actions.push({
          type: 'coverage_gap',
          priority: 'high',
          action: 'Term Life Coverage Recommendation',
          description: 'Term Life is a coverage opportunity. Recommend coverage.',
          expectedUplift: '25-35%',
          campaign: 'Life Protection Campaign'
        });
      }
      
      if (missing.includes('auto')) {
        actions.push({
          type: 'coverage_gap',
          priority: 'medium',
          action: 'Auto Coverage Enhancement',
          description: 'Auto is a coverage opportunity. Recommend coverage.',
          expectedUplift: '15-25%',
          campaign: 'Auto Protection Campaign'
        });
      }
    }
    
    // High-risk retention actions
    if (customer.isHighRisk) {
      actions.push({
        type: 'retention',
        priority: 'high',
        action: 'Customer Retention Program',
        description: 'High churn risk detected - implement retention strategy',
        expectedUplift: '30-45%',
        campaign: 'Retention Excellence Program'
      });
    }
    
    // Low engagement actions
    if (customer.appSessions < 5) {
      actions.push({
        type: 'engagement',
        priority: 'medium',
        action: 'Digital Engagement Campaign',
        description: 'Low app usage detected - drive digital adoption',
        expectedUplift: '10-15%',
        campaign: 'Digital First Initiative'
      });
    }
    
    // Sort actions by priority
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    return actions.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  };

  // Filter high risk customers
  const filteredHighRiskCustomers = useMemo(() => {
    return highRiskCustomers.filter(customer => {
      const matchesSearch = !searchTerm || 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTier = !tierFilter || customer.clvTier.toLowerCase() === tierFilter.toLowerCase();
      const matchesRisk = !riskFilter || customer.riskTier === riskFilter;
      
      return matchesSearch && matchesTier && matchesRisk;
    });
  }, [highRiskCustomers, searchTerm, tierFilter, riskFilter]);

  // Event handlers
  const toggleCustomerExpansion = (customerId) => {
    const newExpanded = new Set(expandedCustomers);
    if (newExpanded.has(customerId)) {
      newExpanded.delete(customerId);
    } else {
      newExpanded.add(customerId);
    }
    setExpandedCustomers(newExpanded);
  };

  const handleExecuteAction = async (customerId, action) => {
    try {
      await renewalService.executeAction(customerId, action);
      alert(`${action.action} executed successfully!`);
      loadAllData(); // Refresh data
    } catch (err) {
      alert(`Failed to execute ${action.action}. Please try again.`);
    }
  };

  const handleLaunchCampaign = async (customerId, campaignType) => {
    try {
      await renewalService.launchCampaign(customerId, campaignType);
      alert('Campaign launched successfully!');
    } catch (err) {
      alert('Failed to launch campaign. Please try again.');
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="renewal-tab">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading renewal data...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="renewal-tab">
        <div className="error">
          <h3>⚠️ Error Loading Data</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={loadAllData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="renewal-tab">
      {/* Header */}
      <div className="renewal-header">
        <div className="header-content">
          <h1 className="renewal-title">Renewal Review & Next Best Action</h1>
        </div>
      </div>

      {/* High Risk Customers Section - Enhanced */}
      <section className="high-risk-customers-section">
        <div className="section-header">
          <h2 className="section-title">High Risk Customers - Interactive Profiles</h2>
          <div className="section-controls">
            <input
              type="text"
              className="search-input"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="filter-select"
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
            >
              <option value="">All Tiers</option>
              <option value="platinum">Platinum</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="bronze">Bronze</option>
            </select>
            <select
              className="filter-select"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="">All Risk Levels</option>
              <option value="High">High Risk</option>
              <option value="Medium-High">Medium-High Risk</option>
            </select>
          </div>
        </div>

        <div className="high-risk-customers-grid">
          {filteredHighRiskCustomers.map((customer) => {
            const isExpanded = expandedCustomers.has(customer.id);
            const nextActions = determineNextBestAction(customer);
            
            return (
              <div key={customer.id} className={`customer-profile-card ${customer.riskTier?.toLowerCase() || 'high'}`}>
                {/* Customer Header */}
                <div className="customer-header" onClick={() => toggleCustomerExpansion(customer.id)}>
                  <div className="customer-basic-info">
                    <h3 className="customer-name">{customer.name}</h3>
                    <span className={`risk-tier-badge ${customer.riskTier?.toLowerCase().replace('-', '_') || 'high'}`}>
                      {customer.riskTier || 'High'} Risk
                    </span>
                    <span className={`clv-tier-badge ${customer.clvTier?.toLowerCase() || 'bronze'}`}>
                      {customer.clvTier || 'Bronze'} Tier
                    </span>
                  </div>
                  <div className="customer-metrics">
                    <div className="metric">
                      <span className="metric-label">Risk Score</span>
                      <span className="metric-value risk-score">{customer.riskScore || 'N/A'}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">CLV (12M)</span>
                      <span className="metric-value clv-value">${customer.clv12M?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Credit Score</span>
                      <span className={`metric-value credit-score ${customer.creditScore < 650 ? 'poor' : customer.creditScore < 750 ? 'fair' : 'good'}`}>
                        {customer.creditScore || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="expand-indicator">
                    {isExpanded ? '▼' : '▶'}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="customer-detailed-info">
                    {/* Current Policies */}
                    <div className="info-section policies-section">
                      <h4 className="info-section-title">Current Policies</h4>
                      <div className="policies-grid">
                        {customer.policies?.map((policy, index) => (
                          <div key={index} className={`policy-card ${policy.status?.toLowerCase() || 'active'}`}>
                            <div className="policy-header">
                              <span className="policy-type">{policy.type || 'Policy'}</span>
                              <span className={`policy-status ${policy.status?.toLowerCase() || 'active'}`}>
                                {policy.status || 'Active'}
                              </span>
                            </div>
                            <div className="policy-details">
                              <div className="policy-detail">
                                <span className="detail-label">Premium:</span>
                                <span className="detail-value">${policy.premium?.toLocaleString() || 'N/A'}</span>
                              </div>
                              <div className="policy-detail">
                                <span className="detail-label">Coverage:</span>
                                <span className="detail-value">${policy.coverageAmount?.toLocaleString() || 'N/A'}</span>
                              </div>
                              <div className="policy-detail">
                                <span className="detail-label">Renewal:</span>
                                <span className="detail-value">{policy.renewalDate || 'N/A'}</span>
                              </div>
                            </div>
                            {policy.coverages && (
                              <div className="coverage-list">
                                <span className="coverage-label">Coverages:</span>
                                <div className="coverages">
                                  {policy.coverages.map((coverage, cIndex) => (
                                    <span key={cIndex} className="coverage-badge">{coverage}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )) || <p>No policy information available</p>}
                      </div>
                    </div>

                    {/* Coverage Opportunities */}
                    <div className="info-section opportunities-section">
                      <h4 className="info-section-title">Coverage Opportunities</h4>
                      <div className="opportunities-grid">
                        {customer.coverageOpportunities?.map((opportunity, index) => (
                          <div key={index} className="opportunity-card">
                            <div className="opportunity-header">
                              <span className="opportunity-type">{opportunity.type}</span>
                              <span className={`opportunity-priority ${opportunity.priority?.toLowerCase() || 'medium'}`}>
                                {opportunity.priority || 'Medium'} Priority
                              </span>
                            </div>
                            <p className="opportunity-description">{opportunity.description}</p>
                            <div className="opportunity-metrics">
                              <span className="potential-premium">
                                Potential: ${opportunity.potentialPremium?.toLocaleString() || 'TBD'}
                              </span>
                              <span className="confidence-score">
                                Confidence: {opportunity.confidenceScore || 'N/A'}%
                              </span>
                            </div>
                          </div>
                        )) || <p>Coverage opportunities analysis in progress...</p>}
                      </div>
                    </div>

                    {/* Next Best Actions */}
                    <div className="info-section actions-section">
                      <h4 className="info-section-title">Next Best Actions</h4>
                      <div className="actions-grid">
                        {nextActions.slice(0, 3).map((action, index) => (
                          <div key={index} className={`action-card ${action.type} ${action.priority}`}>
                            <div className="action-header">
                              <span className="action-type">{action.type.replace('_', ' ').toUpperCase()}</span>
                              <span className={`action-priority ${action.priority}`}>
                                {action.priority.toUpperCase()}
                              </span>
                            </div>
                            <h5 className="action-title">{action.action}</h5>
                            <p className="action-description">{action.description}</p>
                            <div className="action-metrics">
                              <span className="expected-uplift">Expected Uplift: {action.expectedUplift}</span>
                              <span className="campaign-type">Campaign: {action.campaign}</span>
                            </div>
                            <div className="action-buttons">
                              <button 
                                className="execute-action-btn"
                                onClick={() => handleExecuteAction(customer.id, action)}
                              >
                                Execute
                              </button>
                              <button 
                                className="campaign-btn"
                                onClick={() => handleLaunchCampaign(customer.id, action.campaign)}
                              >
                                Launch Campaign
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Missing Coverage Details */}
                    {customer.missingCoverage && (
                      <div className="info-section missing-coverage-section">
                        <h4 className="info-section-title">Missing Coverage Analysis</h4>
                        <div className="missing-coverage-details">
                          <p><strong>Missing Coverage Types:</strong> {customer.missingCoverage}</p>
                          <p><strong>Recommendation:</strong> Immediate coverage review and gap analysis recommended</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredHighRiskCustomers.length === 0 && (
          <div className="no-results">
            <p>No high-risk customers found matching the current filters.</p>
          </div>
        )}
      </section>
    </div>
  );
}