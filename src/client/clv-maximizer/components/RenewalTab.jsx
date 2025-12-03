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
  const [renewalSummary, setRenewalSummary] = useState(null);
  const [highRiskCustomers, setHighRiskCustomers] = useState([]);
  const [renewalPipeline, setRenewalPipeline] = useState([]);
  const [nextBestActions, setNextBestActions] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
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
      
      const [summary, pipeline, actions, highRisk] = await Promise.all([
        renewalService.getRenewalSummary(),
        renewalService.getRenewalPipeline(),
        renewalService.getNextBestActions(),
        renewalService.getHighRiskCustomersDetailed()
      ]);
      
      setRenewalSummary(summary);
      setRenewalPipeline(pipeline);
      setNextBestActions(actions);
      setHighRiskCustomers(highRisk);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load renewal data. Please try again.');
      console.error('Error loading renewal data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Business logic for determining next best actions
  const determineNextBestAction = (customer) => {
    const actions = [];
    const { policies, clvTier, lifeEvents, propertyRisk, creditScore, behaviorInsights } = customer;
    
    // Cross-sell logic
    if (policies.length === 1) {
      const currentPolicy = policies[0].type.toLowerCase();
      if (currentPolicy === 'home' || currentPolicy === 'auto') {
        actions.push({
          type: 'cross-sell',
          priority: 'high',
          action: 'Bundle Campaign',
          description: `Recommend ${currentPolicy === 'home' ? 'Auto + Life' : 'Home + Life'} bundle package`,
          expectedUplift: '25-35%',
          campaign: 'Multi-Product Bundle'
        });
      }
    }

    // Life events trigger cross-sell
    if (lifeEvents && lifeEvents.length > 0) {
      lifeEvents.forEach(event => {
        switch (event) {
          case 'new_child':
            actions.push({
              type: 'cross-sell',
              priority: 'high',
              action: 'Life Insurance Campaign',
              description: 'New child detected - recommend term life insurance for family protection',
              expectedUplift: '40-50%',
              campaign: 'Life Events - Family Protection'
            });
            break;
          case 'new_purchase':
            actions.push({
              type: 'cross-sell',
              priority: 'medium',
              action: 'Property Protection',
              description: 'New purchase detected - comprehensive property coverage needed',
              expectedUplift: '20-30%',
              campaign: 'New Purchase Protection'
            });
            break;
          case 'address_change':
            actions.push({
              type: 'coverage_check',
              priority: 'high',
              action: 'Location Risk Assessment',
              description: 'Address change - review coverage adequacy for new location',
              expectedUplift: '15-25%',
              campaign: 'Location Change Review'
            });
            break;
          case 'marriage':
            actions.push({
              type: 'cross-sell',
              priority: 'high',
              action: 'Joint Coverage Optimization',
              description: 'Marriage detected - optimize combined coverage and add spouse',
              expectedUplift: '30-45%',
              campaign: 'Marriage Milestone'
            });
            break;
          case 'nearing_retirement':
            actions.push({
              type: 'upsell',
              priority: 'medium',
              action: 'Retirement Planning',
              description: 'Approaching retirement - review coverage needs and legacy planning',
              expectedUplift: '20-35%',
              campaign: 'Retirement Readiness'
            });
            break;
        }
      });
    }

    // Upsell logic for high CLV tiers
    if (clvTier === 'Platinum' || clvTier === 'Gold') {
      if (customer.isUnderinsured) {
        actions.push({
          type: 'upsell',
          priority: 'high',
          action: 'Premium Coverage Upgrade',
          description: 'High-value customer underinsured - recommend comprehensive package',
          expectedUplift: '35-50%',
          campaign: 'Premium Customer Excellence'
        });
      }
      
      actions.push({
        type: 'upsell',
        priority: 'medium',
        action: 'Concierge Services',
        description: 'Offer white-glove service and premium add-ons',
        expectedUplift: '15-25%',
        campaign: 'VIP Experience'
      });
    }

    // Property risk exposure
    if (propertyRisk && propertyRisk.hazardRisk > 70) {
      const hasMatchingCoverage = policies.some(p => 
        p.coverages && p.coverages.includes('hazard_protection')
      );
      
      if (!hasMatchingCoverage) {
        actions.push({
          type: 'coverage_gap',
          priority: 'high',
          action: 'Hazard Risk Mitigation',
          description: `High ${propertyRisk.type} risk detected without coverage - immediate action needed`,
          expectedUplift: '20-30%',
          campaign: 'Risk Mitigation Alert'
        });
      }
    }

    // Coverage checks - missing endorsements
    policies.forEach(policy => {
      if (policy.missingEndorsements && policy.missingEndorsements.length > 0) {
        policy.missingEndorsements.forEach(endorsement => {
          actions.push({
            type: 'coverage_gap',
            priority: 'medium',
            action: 'Endorsement Addition',
            description: `Missing ${endorsement} endorsement on ${policy.type} policy`,
            expectedUplift: '10-15%',
            campaign: 'Coverage Completion'
          });
        });
      }
    });

    // Behavioral insights triggers
    if (behaviorInsights) {
      if (behaviorInsights.lowAppUsage) {
        actions.push({
          type: 'engagement',
          priority: 'medium',
          action: 'Digital Engagement Campaign',
          description: 'Low app usage - drive digital adoption with incentives',
          expectedUplift: '5-10%',
          campaign: 'Digital First'
        });
      }

      if (behaviorInsights.billingIrregularities) {
        actions.push({
          type: 'retention',
          priority: 'high',
          action: 'Payment Support',
          description: 'Billing issues detected - proactive financial counseling needed',
          expectedUplift: '25-40%',
          campaign: 'Customer Success Intervention'
        });
      }

      if (behaviorInsights.customerServiceComplaints > 2) {
        actions.push({
          type: 'retention',
          priority: 'high',
          action: 'Service Recovery',
          description: 'Multiple complaints - executive service recovery program',
          expectedUplift: '30-50%',
          campaign: 'Service Excellence Recovery'
        });
      }
    }

    // Credit risk impact
    if (creditScore && creditScore < customer.previousCreditScore) {
      const scoreDrop = customer.previousCreditScore - creditScore;
      if (scoreDrop > 50) {
        actions.push({
          type: 'retention',
          priority: 'high',
          action: 'Credit Risk Mitigation',
          description: `Significant credit score decline (${scoreDrop} points) - retention risk increased`,
          expectedUplift: '20-35%',
          campaign: 'Financial Stability Support'
        });
      }
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
      
      const matchesRisk = !riskFilter || customer.riskTier === riskFilter;
      
      return matchesSearch && matchesRisk;
    });
  }, [highRiskCustomers, searchTerm, riskFilter]);

  // Filter pipeline data
  const filteredPipeline = useMemo(() => {
    return renewalPipeline.filter(item => {
      const matchesSearch = !searchTerm || 
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || item.renewalStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [renewalPipeline, searchTerm, statusFilter]);

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

  const handleViewProfile = (customer) => {
    setSelectedCustomer(customer);
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

  const handleSendReminder = async (customerId) => {
    try {
      await renewalService.sendReminder(customerId, 'email');
      alert('Reminder sent successfully!');
    } catch (err) {
      alert('Failed to send reminder. Please try again.');
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
          <div className="header-meta">
            <span className="last-updated">Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <button className="refresh-btn" onClick={loadAllData}>
              🔄 Refresh
            </button>
          </div>
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
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="">All Risk Tiers</option>
              <option value="Critical">Critical Risk</option>
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
              <div key={customer.id} className={`customer-profile-card ${customer.riskTier.toLowerCase()}`}>
                {/* Customer Header */}
                <div className="customer-header" onClick={() => toggleCustomerExpansion(customer.id)}>
                  <div className="customer-basic-info">
                    <h3 className="customer-name">{customer.name}</h3>
                    <span className={`risk-tier-badge ${customer.riskTier.toLowerCase().replace('-', '_')}`}>
                      {customer.riskTier} Risk
                    </span>
                    <span className={`clv-tier-badge ${customer.clvTier.toLowerCase()}`}>
                      {customer.clvTier} Tier
                    </span>
                  </div>
                  <div className="customer-metrics">
                    <div className="metric">
                      <span className="metric-label">Risk Score</span>
                      <span className="metric-value risk-score">{customer.riskScore}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">CLV (12M)</span>
                      <span className="metric-value clv-value">${customer.clv12M?.toLocaleString()}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Credit Score</span>
                      <span className={`metric-value credit-score ${customer.creditScore < 650 ? 'poor' : customer.creditScore < 750 ? 'fair' : 'good'}`}>
                        {customer.creditScore || 'N/A'}
                        {customer.previousCreditScore && customer.creditScore < customer.previousCreditScore && (
                          <span className="credit-decline">↓{customer.previousCreditScore - customer.creditScore}</span>
                        )}
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
                        {customer.policies.map((policy, index) => (
                          <div key={index} className={`policy-card ${policy.status.toLowerCase()}`}>
                            <div className="policy-header">
                              <span className="policy-type">{policy.type}</span>
                              <span className={`policy-status ${policy.status.toLowerCase()}`}>
                                {policy.status}
                              </span>
                            </div>
                            <div className="policy-details">
                              <div className="policy-detail">
                                <span className="detail-label">Premium:</span>
                                <span className="detail-value">${policy.premium?.toLocaleString()}</span>
                              </div>
                              <div className="policy-detail">
                                <span className="detail-label">Coverage:</span>
                                <span className="detail-value">${policy.coverageAmount?.toLocaleString()}</span>
                              </div>
                              <div className="policy-detail">
                                <span className="detail-label">Renewal:</span>
                                <span className="detail-value">{policy.renewalDate}</span>
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
                            {policy.missingEndorsements && policy.missingEndorsements.length > 0 && (
                              <div className="missing-endorsements">
                                <span className="missing-label">Missing:</span>
                                <div className="missing-items">
                                  {policy.missingEndorsements.map((endorsement, eIndex) => (
                                    <span key={eIndex} className="missing-endorsement">{endorsement}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Coverage Opportunities */}
                    <div className="info-section opportunities-section">
                      <h4 className="info-section-title">Coverage Opportunities</h4>
                      <div className="opportunities-grid">
                        {customer.coverageOpportunities.map((opportunity, index) => (
                          <div key={index} className="opportunity-card">
                            <div className="opportunity-header">
                              <span className="opportunity-type">{opportunity.type}</span>
                              <span className={`opportunity-priority ${opportunity.priority.toLowerCase()}`}>
                                {opportunity.priority} Priority
                              </span>
                            </div>
                            <p className="opportunity-description">{opportunity.description}</p>
                            <div className="opportunity-metrics">
                              <span className="potential-premium">
                                Potential: ${opportunity.potentialPremium?.toLocaleString()}
                              </span>
                              <span className="confidence-score">
                                Confidence: {opportunity.confidenceScore}%
                              </span>
                            </div>
                          </div>
                        ))}
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

                    {/* Risk Factors & Behavioral Insights */}
                    <div className="info-section insights-section">
                      <h4 className="info-section-title">Risk Factors & Behavioral Insights</h4>
                      <div className="insights-grid">
                        {customer.lifeEvents && customer.lifeEvents.length > 0 && (
                          <div className="insight-card life-events">
                            <h5 className="insight-title">Life Events Detected</h5>
                            <div className="life-events-list">
                              {customer.lifeEvents.map((event, index) => (
                                <span key={index} className={`life-event-badge ${event.replace('_', '-')}`}>
                                  {event.replace('_', ' ').toUpperCase()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {customer.propertyRisk && (
                          <div className="insight-card property-risk">
                            <h5 className="insight-title">Property Risk Intelligence</h5>
                            <div className="property-risk-details">
                              <div className="risk-metric">
                                <span className="risk-label">{customer.propertyRisk.type} Risk:</span>
                                <span className={`risk-level ${customer.propertyRisk.hazardRisk > 70 ? 'high' : customer.propertyRisk.hazardRisk > 40 ? 'medium' : 'low'}`}>
                                  {customer.propertyRisk.hazardRisk}%
                                </span>
                              </div>
                              <p className="risk-description">{customer.propertyRisk.description}</p>
                            </div>
                          </div>
                        )}

                        {customer.behaviorInsights && (
                          <div className="insight-card behavioral">
                            <h5 className="insight-title">Behavioral Insights</h5>
                            <div className="behavior-metrics">
                              {customer.behaviorInsights.lowAppUsage && (
                                <div className="behavior-flag warning">Low App Usage</div>
                              )}
                              {customer.behaviorInsights.billingIrregularities && (
                                <div className="behavior-flag critical">Billing Issues</div>
                              )}
                              {customer.behaviorInsights.customerServiceComplaints > 0 && (
                                <div className="behavior-flag warning">
                                  {customer.behaviorInsights.customerServiceComplaints} Complaints
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer Actions */}
                    <div className="customer-actions">
                      <button 
                        className="primary-btn"
                        onClick={() => handleViewProfile(customer)}
                      >
                        View Full Profile
                      </button>
                      <button 
                        className="secondary-btn"
                        onClick={() => handleSendReminder(customer.id)}
                      >
                        Send Reminder
                      </button>
                      <button className="secondary-btn">
                        Schedule Call
                      </button>
                      <button className="secondary-btn">
                        Create Task
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: Renewal Pipeline Table */}
      <section className="renewal-pipeline">
        <h2 className="section-title">Renewal Pipeline</h2>
        <div className="pipeline-controls">
          <div className="controls-left">
            <input
              type="text"
              className="search-input"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>
          <button className="export-btn" onClick={() => renewalService.exportData(filteredPipeline, 'csv')}>
            📊 Export Data
          </button>
        </div>
        <div className="pipeline-table">
          <table className="table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Renewal Date</th>
                <th>Renewal Status</th>
                <th>Opportunity Score</th>
                <th>Renewal Amount</th>
                <th>CLV Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPipeline.map((renewal) => (
                <tr key={renewal.customerId}>
                  <td>{renewal.customerName}</td>
                  <td>{renewal.renewalDate}</td>
                  <td>
                    <span className={`status-badge ${renewal.renewalStatus.toLowerCase()}`}>
                      {renewal.renewalStatus}
                    </span>
                  </td>
                  <td>{renewal.opportunityScore}</td>
                  <td>${renewal.renewalAmount?.toLocaleString()}</td>
                  <td>{renewal.clvScore}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn view"
                        onClick={() => handleViewProfile(renewal)}
                      >
                        View Profile
                      </button>
                      <button 
                        className="action-btn remind"
                        onClick={() => handleSendReminder(renewal.customerId)}
                      >
                        Send Reminder
                      </button>
                      <button 
                        className="action-btn campaign"
                        onClick={() => handleLaunchCampaign(renewal.customerId, 'renewal')}
                      >
                        Launch Campaign
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="customer-modal" onClick={() => setSelectedCustomer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCustomer.name} - Complete Profile</h2>
              <button className="modal-close" onClick={() => setSelectedCustomer(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="profile-details-grid">
                <div className="detail-section">
                  <h4>Customer Information</h4>
                  <p><strong>Email:</strong> {selectedCustomer.email}</p>
                  <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                  <p><strong>CLV Tier:</strong> {selectedCustomer.clvTier}</p>
                  <p><strong>Risk Tier:</strong> {selectedCustomer.riskTier}</p>
                  <p><strong>Customer Since:</strong> {selectedCustomer.customerSince}</p>
                </div>

                <div className="detail-section">
                  <h4>Financial Profile</h4>
                  <p><strong>CLV (12M):</strong> ${selectedCustomer.clv12M?.toLocaleString()}</p>
                  <p><strong>Total Premium:</strong> ${selectedCustomer.totalPremium?.toLocaleString()}</p>
                  <p><strong>Credit Score:</strong> {selectedCustomer.creditScore}</p>
                  <p><strong>Risk Score:</strong> {selectedCustomer.riskScore}</p>
                </div>

                <div className="detail-section">
                  <h4>Policy Summary</h4>
                  {selectedCustomer.policies?.map((policy, index) => (
                    <div key={index} className="modal-policy-item">
                      <strong>{policy.type}:</strong> ${policy.premium?.toLocaleString()} 
                      ({policy.status})
                    </div>
                  ))}
                </div>

                <div className="detail-section">
                  <h4>Recommended Actions</h4>
                  {determineNextBestAction(selectedCustomer).slice(0, 5).map((action, index) => (
                    <div key={index} className="modal-action-item">
                      <strong>{action.action}:</strong> {action.description}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}