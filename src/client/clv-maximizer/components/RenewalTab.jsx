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
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, [renewalService]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const summary = await renewalService.getRenewalSummary();
      
      setRenewalSummary(summary);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load renewal data. Please try again.');
      console.error('Error loading renewal data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActionTypeColor = (actionType) => {
    switch (actionType) {
      case 'Cross-sell': return '#3b82f6';
      case 'Upsell': return '#059669';
      case 'Coverage Check': return '#f59e0b';
      case 'Retention': return '#dc2626';
      case 'Risk Mitigation': return '#7c3aed';
      case 'Engagement': return '#06b6d4';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#dc2626';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="renewal-tab">
        <div className="loading">
          <div className="loading-spinner"></div>
          <div>Loading renewal data from x_hete_clv_maximiz_policy_holders table...</div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="renewal-tab">
        <div className="error">
          {error}
          <button onClick={loadAllData} style={{ marginLeft: '16px' }}>
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
        <h1 className="renewal-title">Renewal Review & Next Best Action</h1>
        <p className="renewal-subtitle">Data sourced from x_hete_clv_maximiz_policy_holders table</p>
      </div>

      {/* Section 1: Renewal Snapshot Summary */}
      <section className="renewal-summary">
        <h2 className="section-title">Renewal Snapshot Summary</h2>
        <div className="summary-metrics-grid">
          {/* High Risk Customers Metric Card */}
          <div className="metric-card high-risk-card">
            <div className="metric-header">
              <div className="metric-icon">⚠️</div>
              <div className="metric-info">
                <h3 className="metric-title">High Risk Customers</h3>
                <div className="metric-value">{renewalSummary?.highRiskCustomers?.count || 0}</div>
                <div className="metric-description">Customers at high churn risk level</div>
              </div>
            </div>
            <div className="metric-details">
              <div className="detail-item">
                <span className="detail-label">Risk Level:</span>
                <span className="detail-value">≥70% churn probability</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Data Source:</span>
                <span className="detail-value">Policy holders churn_risk field</span>
              </div>
            </div>
          </div>

          {/* Total CLV at Risk Metric Card */}
          <div className="metric-card clv-risk-card">
            <div className="metric-header">
              <div className="metric-icon">💰</div>
              <div className="metric-info">
                <h3 className="metric-title">Total CLV at Risk</h3>
                <div className="metric-value">
                  {renewalSummary?.totalCLVAtRisk?.displayValue || '$0'}
                </div>
                <div className="metric-description">Sum of CLV for high risk customers</div>
              </div>
            </div>
            <div className="metric-details">
              <div className="detail-item">
                <span className="detail-label">Customers:</span>
                <span className="detail-value">{renewalSummary?.highRiskCustomers?.count || 0} high-risk</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Data Source:</span>
                <span className="detail-value">Policy holders lifetime_value field</span>
              </div>
            </div>
          </div>

          {/* Missing Coverages Metric Card */}
          <div className="metric-card coverage-card">
            <div className="metric-header">
              <div className="metric-icon">🔍</div>
              <div className="metric-info">
                <h3 className="metric-title">Missing Coverages</h3>
                <div className="metric-value">{renewalSummary?.missingCoverages?.count || 0}</div>
                <div className="metric-description">Total coverage gaps across all customers</div>
              </div>
            </div>
            <div className="metric-details">
              <div className="detail-item">
                <span className="detail-label">Customers Affected:</span>
                <span className="detail-value">{renewalSummary?.missingCoverages?.customersAffected || 0}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Data Source:</span>
                <span className="detail-value">Policy holders missing_coverage field</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: High Risk Customer Profiles */}
      {renewalSummary?.highRiskCustomers?.sampleCustomers?.length > 0 && (
        <section className="high-risk-profiles">
          <h2 className="section-title">High Risk Customer Profiles</h2>
          <div className="customer-profiles-grid">
            {renewalSummary.highRiskCustomers.sampleCustomers.map((customer, index) => (
              <div key={index} className="customer-profile-card">
                {/* Customer Header */}
                <div className="profile-header">
                  <div className="customer-avatar">
                    {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="customer-info">
                    <h3 className="customer-name">{customer.name}</h3>
                    <div className="customer-badges">
                      <span className={`tier-badge tier-${customer.tier.toLowerCase()}`}>
                        {customer.tier}
                      </span>
                      <span className="risk-badge risk-high">
                        {customer.churnRisk} Risk ({customer.churnRiskPercent}%)
                      </span>
                    </div>
                    <div className="customer-metrics">
                      <div className="metric">
                        <span className="metric-label">CLV:</span>
                        <span className="metric-value">${customer.clv?.toLocaleString()}</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Credit Score:</span>
                        <span className="metric-value">{customer.creditScore}</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Tenure:</span>
                        <span className="metric-value">{Math.floor(customer.tenure)} months</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Policies Section */}
                <div className="profile-section">
                  <h4 className="section-header">
                    <span className="section-icon">📋</span>
                    Current Policies
                  </h4>
                  <div className="policies-grid">
                    {customer.currentPolicies?.map((policy, pIndex) => (
                      <div key={pIndex} className="policy-item">
                        <div className="policy-name">{policy.type}</div>
                        <div className="policy-details">
                          <span className="policy-status">Active</span>
                          <span className="policy-premium">${policy.premium}/year</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coverage Opportunities Section */}
                <div className="profile-section">
                  <h4 className="section-header">
                    <span className="section-icon">🎯</span>
                    Coverage Opportunities
                  </h4>
                  <div className="opportunities-list">
                    {customer.coverageOpportunities?.map((opportunity, oIndex) => (
                      <div key={oIndex} className="opportunity-item">
                        <div className="opportunity-header">
                          <span className="opportunity-name">{opportunity.type}</span>
                          <span className={`priority-tag priority-${opportunity.priority?.toLowerCase()}`}>
                            {opportunity.priority}
                          </span>
                        </div>
                        <div className="opportunity-details">
                          <span className="opportunity-premium">
                            Est. ${opportunity.estimatedPremium}/year
                          </span>
                          <span className="opportunity-potential">
                            {opportunity.crossSellPotential}% likelihood
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Best Actions Section */}
                <div className="profile-section">
                  <h4 className="section-header">
                    <span className="section-icon">🚀</span>
                    Next Best Actions
                  </h4>
                  <div className="actions-list">
                    {customer.nextBestActions?.map((action, aIndex) => (
                      <div key={aIndex} className="action-item">
                        <div className="action-header">
                          <div className="action-type-badge" 
                               style={{ backgroundColor: getActionTypeColor(action.type) }}>
                            {action.type}
                          </div>
                          <div className="action-priority" 
                               style={{ color: getPriorityColor(action.priority) }}>
                            {action.priority} Priority
                          </div>
                          <div className="action-confidence">
                            {action.confidence}% confidence
                          </div>
                        </div>
                        <div className="action-title">{action.action}</div>
                        <div className="action-description">{action.description}</div>
                        <div className="action-details">
                          <div className="action-detail">
                            <span className="detail-label">Expected Revenue:</span>
                            <span className="detail-value">{action.expectedRevenue}</span>
                          </div>
                          <div className="action-detail">
                            <span className="detail-label">Timeline:</span>
                            <span className="detail-value">{action.timeline}</span>
                          </div>
                          <div className="action-detail">
                            <span className="detail-label">Channel:</span>
                            <span className="detail-value">{action.channel}</span>
                          </div>
                        </div>
                        <div className="action-tags">
                          {action.tags?.map((tag, tIndex) => (
                            <span key={tIndex} className="action-tag">
                              {tag.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Insights */}
                <div className="profile-section insights-section">
                  <h4 className="section-header">
                    <span className="section-icon">💡</span>
                    Business Intelligence
                  </h4>
                  <div className="insights-grid">
                    <div className="insight-item">
                      <div className="insight-label">Life Events</div>
                      <div className="insight-value">
                        {customer.lifeEvents?.join(', ') || 'None detected'}
                      </div>
                    </div>
                    <div className="insight-item">
                      <div className="insight-label">Risk Factors</div>
                      <div className="insight-value">
                        {customer.riskFactors?.slice(0, 2).join(', ') || 'Stable profile'}
                      </div>
                    </div>
                    <div className="insight-item">
                      <div className="insight-label">Behavioral Insights</div>
                      <div className="insight-value">
                        {customer.behavioralInsights?.digitalEngagementTrend || 'Stable'} engagement trend
                      </div>
                    </div>
                    <div className="insight-item">
                      <div className="insight-label">Property Risk</div>
                      <div className="insight-value">
                        {customer.propertyIntelligence?.hazardScore || 'N/A'}/100 hazard score
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}