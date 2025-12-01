import React, { useState, useEffect } from 'react';
import { CustomerIntelligenceService } from '../services/CustomerIntelligenceService.js';
import './CustomerProfileModal.css';

export default function CustomerProfileModal({ customer, isOpen, onClose, userContext }) {
  const [profileData, setProfileData] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  const service = new CustomerIntelligenceService();

  useEffect(() => {
    if (isOpen && customer) {
      loadProfileData();
    }
  }, [isOpen, customer]);

  const loadProfileData = async () => {
    try {
      // Generate enhanced profile data based on user context
      const enhancedProfile = {
        ...customer,
        ...generateDetailedMetrics(customer),
        productPropensity: generateProductPropensity(customer),
        recentInteractions: generateRecentInteractions(),
        permissions: getUserPermissions(userContext)
      };
      
      setProfileData(enhancedProfile);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const generateDetailedMetrics = (customer) => {
    // Enhanced metrics calculation based on customer tier and context
    const baseChurnScore = customer.churnRisk === 'High' ? 75 : 
                          customer.churnRisk === 'Medium' ? 45 : 25;
    
    return {
      churnRiskScore: Math.min(100, baseChurnScore + Math.floor(Math.random() * 20)),
      monthlyCLV: Math.floor(customer.clv / 12),
      lifetimeCLV: customer.clv,
      engagementScore: customer.engagementScore,
      customerSince: new Date(Date.now() - customer.tenure * 30.44 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      age: Math.floor(Math.random() * 40) + 25,
      phone: `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      segment: customer.tier === 'Platinum' ? 'VIP' : customer.tier === 'Gold' ? 'Premium' : 'Standard',
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      status: customer.churnRisk === 'Low' ? 'Active' : customer.churnRisk === 'Medium' ? 'At Risk' : 'Critical'
    };
  };

  const generateProductPropensity = (customer) => {
    const baseScore = customer.tier === 'Platinum' ? 80 : 
                     customer.tier === 'Gold' ? 70 :
                     customer.tier === 'Silver' ? 60 : 50;
    
    // Add some variation based on customer characteristics
    const engagementBonus = Math.floor((customer.engagementScore - 50) / 10);
    const churnPenalty = customer.churnRisk === 'High' ? -15 : 
                        customer.churnRisk === 'Medium' ? -5 : 0;
    
    return {
      premiumMobilePlan: Math.max(0, Math.min(100, baseScore + engagementBonus + churnPenalty + Math.floor(Math.random() * 10))),
      insuranceAddOn: Math.max(0, Math.min(100, baseScore - 10 + engagementBonus + churnPenalty + Math.floor(Math.random() * 15))),
      homeInternetBundle: Math.max(0, Math.min(100, baseScore - 5 + engagementBonus + churnPenalty + Math.floor(Math.random() * 12))),
      streamingPackage: Math.max(0, Math.min(100, baseScore + 5 + engagementBonus + churnPenalty + Math.floor(Math.random() * 8)))
    };
  };

  const generateRecentInteractions = () => {
    return []; // Placeholder for future integration
  };

  const getUserPermissions = (context) => {
    if (!context) {
      return {
        viewContactInfo: false,
        viewCLV: false,
        editProfile: false,
        createCampaign: false,
        viewSensitive: false
      };
    }

    switch (context.role?.toLowerCase()) {
      case 'manager':
      case 'admin':
        return {
          viewContactInfo: true,
          viewCLV: true,
          editProfile: true,
          createCampaign: true,
          viewSensitive: true
        };
      case 'analyst':
        return {
          viewContactInfo: context.permissions?.viewSensitiveData || true,
          viewCLV: context.permissions?.viewSensitiveData || true,
          editProfile: context.permissions?.editCustomers || false,
          createCampaign: context.permissions?.createCampaigns || true,
          viewSensitive: context.permissions?.viewSensitiveData || true
        };
      case 'viewer':
      default:
        return {
          viewContactInfo: false,
          viewCLV: false,
          editProfile: false,
          createCampaign: false,
          viewSensitive: false
        };
    }
  };

  const generateAIRecommendations = async () => {
    setLoadingRecommendations(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const recommendations = [
      `Based on ${customer.customerName}'s ${customer.churnRisk.toLowerCase()} churn risk and ${customer.tier} tier status, recommend immediate outreach with personalized retention offer.`,
      `Customer shows strong propensity for premium services. Consider upselling ${profileData.productPropensity.premiumMobilePlan > 70 ? 'premium mobile plan' : 'streaming package'} with targeted discount.`,
      `Engagement score of ${customer.engagementScore} indicates ${customer.engagementScore > 70 ? 'high' : customer.engagementScore > 50 ? 'moderate' : 'low'} activity. ${customer.engagementScore <= 50 ? 'Implement targeted engagement campaign to boost interaction.' : 'Leverage high engagement for upselling opportunities.'}`,
      `Location in ${customer.location} presents opportunity for location-based promotions and local partnership offers.`,
      profileData.churnRiskScore > 60 ? `High churn risk detected. Schedule immediate customer success call within 48 hours.` : null,
      customer.tenure > 24 ? `Long-term customer (${customer.tenure} months). Offer loyalty program benefits to maintain relationship.` : null
    ].filter(Boolean);
    
    setAiRecommendations(recommendations);
    setLoadingRecommendations(false);
  };

  const handleEditProfile = () => {
    alert(`Edit Profile functionality would open an editable form for ${customer.customerName}\n\nThis would typically:\n- Open a ServiceNow form with editable customer fields\n- Pre-populate current values\n- Validate user permissions for field access\n- Save changes back to csm_consumer table`);
  };

  const handleCreateCampaign = () => {
    const segmentInfo = userContext?.assigned_segments?.join(', ') || 'Default';
    alert(`Campaign Designer would open pre-filtered for ${customer.customerName}\n\nPre-filled with:\n- Target Customer: ${customer.customerName}\n- Segment: ${profileData?.segment}\n- Churn Risk: ${customer.churnRisk}\n- User Segment Access: ${segmentInfo}\n\nRecommended campaign type: ${customer.churnRisk === 'High' ? 'Retention Campaign' : 'Upsell Campaign'}`);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (!isOpen || !customer || !profileData) {
    return null;
  }

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="profile-modal-header">
          <div className="profile-header-info">
            <div className="profile-avatar">
              {customer.customerName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="profile-header-details">
              <h2 className="profile-customer-name">{customer.customerName}</h2>
              <p className="profile-customer-status">
                <span className={`status-badge status-${profileData.status.toLowerCase().replace(' ', '-')}`}>
                  {profileData.status}
                </span>
                <span className={`tier-badge tier-${customer.tier.toLowerCase()}`}>
                  {customer.tier} Customer
                </span>
              </p>
              <div className="customer-id-badge">ID: {customer.id}</div>
            </div>
          </div>
          <div className="profile-header-actions">
            <div className="user-context-display">
              <span className="viewing-as">Viewing as:</span>
              <span className="user-name">{userContext?.name || 'Unknown User'}</span>
              <span className="user-role">{userContext?.title || userContext?.role || 'User'}</span>
            </div>
            <button className="profile-close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'propensity' ? 'active' : ''}`}
            onClick={() => setActiveTab('propensity')}
          >
            Product Propensity
          </button>
          <button 
            className={`tab-btn ${activeTab === 'interactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('interactions')}
          >
            Interactions
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="profile-sections">
                {/* Section 1: Customer Information */}
                <section className="profile-section customer-info">
                  <h3 className="section-title">Customer Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Name:</span>
                      <span className="info-value">{customer.customerName}</span>
                    </div>
                    {profileData.permissions.viewContactInfo && (
                      <>
                        <div className="info-item">
                          <span className="info-label">Email:</span>
                          <span className="info-value">{customer.email}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Phone:</span>
                          <span className="info-value">{profileData.phone}</span>
                        </div>
                      </>
                    )}
                    {!profileData.permissions.viewContactInfo && (
                      <div className="info-item restricted">
                        <span className="info-label">Contact Info:</span>
                        <span className="info-value restricted-text">Restricted Access</span>
                      </div>
                    )}
                    <div className="info-item">
                      <span className="info-label">Customer Since:</span>
                      <span className="info-value">{profileData.customerSince}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Status:</span>
                      <span className={`info-value status-${profileData.status.toLowerCase().replace(' ', '-')}`}>
                        {profileData.status}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Age:</span>
                      <span className="info-value">{profileData.age}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Location:</span>
                      <span className="info-value">{customer.location}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Segment:</span>
                      <span className="info-value">{profileData.segment}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Tenure:</span>
                      <span className="info-value">{customer.tenure} months</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Last Activity:</span>
                      <span className="info-value">{profileData.lastActivity}</span>
                    </div>
                  </div>
                </section>

                {/* Section 2: Key Metrics */}
                <section className="profile-section key-metrics">
                  <h3 className="section-title">Key Metrics</h3>
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-header">
                        <span className="metric-label">Churn Risk Score</span>
                        <span className="metric-tooltip" title="Probability of customer churn in next 12 months">ⓘ</span>
                      </div>
                      <div className="metric-value" style={{ color: getRiskColor(customer.churnRisk) }}>
                        {profileData.churnRiskScore}%
                      </div>
                      <div className="metric-indicator">
                        <div className="risk-bar">
                          <div 
                            className="risk-fill" 
                            style={{ 
                              width: `${profileData.churnRiskScore}%`,
                              backgroundColor: getRiskColor(customer.churnRisk)
                            }}
                          ></div>
                        </div>
                        <div className="risk-level-text" style={{ color: getRiskColor(customer.churnRisk) }}>
                          {customer.churnRisk} Risk
                        </div>
                      </div>
                    </div>

                    {profileData.permissions.viewCLV ? (
                      <>
                        <div className="metric-card">
                          <div className="metric-header">
                            <span className="metric-label">Monthly CLV</span>
                            <span className="metric-tooltip" title="Average monthly customer lifetime value">ⓘ</span>
                          </div>
                          <div className="metric-value">
                            ${profileData.monthlyCLV.toLocaleString()}
                          </div>
                        </div>

                        <div className="metric-card">
                          <div className="metric-header">
                            <span className="metric-label">Lifetime CLV</span>
                            <span className="metric-tooltip" title="Total projected customer lifetime value">ⓘ</span>
                          </div>
                          <div className="metric-value">
                            ${profileData.lifetimeCLV.toLocaleString()}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="metric-card restricted">
                        <div className="metric-header">
                          <span className="metric-label">CLV Data</span>
                          <span className="metric-tooltip" title="Requires elevated permissions">🔒</span>
                        </div>
                        <div className="metric-value restricted-text">
                          Restricted
                        </div>
                        <div className="restriction-note">
                          Contact your administrator for access
                        </div>
                      </div>
                    )}

                    <div className="metric-card">
                      <div className="metric-header">
                        <span className="metric-label">Engagement Score</span>
                        <span className="metric-tooltip" title="Customer engagement level based on activity">ⓘ</span>
                      </div>
                      <div className="metric-value" style={{ color: getScoreColor(profileData.engagementScore) }}>
                        {profileData.engagementScore}
                      </div>
                      <div className="metric-indicator">
                        <div className="engagement-bar">
                          <div 
                            className="engagement-fill" 
                            style={{ 
                              width: `${profileData.engagementScore}%`,
                              backgroundColor: getScoreColor(profileData.engagementScore)
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 5: AI-Generated Recommendations */}
                <section className="profile-section ai-recommendations">
                  <div className="section-header">
                    <h3 className="section-title">AI-Generated Recommendations</h3>
                    <button 
                      className="refresh-recommendations-btn"
                      onClick={generateAIRecommendations}
                      disabled={loadingRecommendations}
                    >
                      {loadingRecommendations ? '⟳' : '↻'} Refresh Recommendations
                    </button>
                  </div>
                  
                  {loadingRecommendations ? (
                    <div className="recommendations-loading">
                      <div className="loading-spinner"></div>
                      <p>Generating AI recommendations...</p>
                    </div>
                  ) : aiRecommendations ? (
                    <div className="recommendations-list">
                      {aiRecommendations.map((recommendation, index) => (
                        <div key={index} className="recommendation-item">
                          <div className="recommendation-icon">🤖</div>
                          <div className="recommendation-text">{recommendation}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="recommendations-placeholder">
                      <p>Click "Refresh Recommendations" to generate AI-powered insights for this customer.</p>
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}

          {activeTab === 'propensity' && (
            <div className="propensity-tab">
              <section className="profile-section product-propensity">
                <h3 className="section-title">Product Propensity Scores</h3>
                <div className="propensity-description">
                  <p>These scores represent the likelihood of this customer purchasing additional products or services based on their profile, engagement history, and behavioral patterns.</p>
                </div>
                <div className="propensity-list">
                  <div className="propensity-item">
                    <div className="propensity-header">
                      <span className="propensity-label">Premium Mobile Plan</span>
                      <span className="propensity-score">{profileData.productPropensity.premiumMobilePlan}%</span>
                    </div>
                    <div className="propensity-bar">
                      <div 
                        className="propensity-fill" 
                        style={{ 
                          width: `${profileData.productPropensity.premiumMobilePlan}%`,
                          backgroundColor: getScoreColor(profileData.productPropensity.premiumMobilePlan)
                        }}
                      ></div>
                    </div>
                    <div className="propensity-insight">
                      {profileData.productPropensity.premiumMobilePlan > 75 ? 
                        'High potential - Consider immediate outreach' :
                        profileData.productPropensity.premiumMobilePlan > 50 ?
                        'Moderate potential - Nurture with targeted content' :
                        'Lower potential - Focus on engagement first'
                      }
                    </div>
                  </div>

                  <div className="propensity-item">
                    <div className="propensity-header">
                      <span className="propensity-label">Insurance Add-On</span>
                      <span className="propensity-score">{profileData.productPropensity.insuranceAddOn}%</span>
                    </div>
                    <div className="propensity-bar">
                      <div 
                        className="propensity-fill" 
                        style={{ 
                          width: `${profileData.productPropensity.insuranceAddOn}%`,
                          backgroundColor: getScoreColor(profileData.productPropensity.insuranceAddOn)
                        }}
                      ></div>
                    </div>
                    <div className="propensity-insight">
                      {profileData.productPropensity.insuranceAddOn > 75 ? 
                        'High potential - Consider immediate outreach' :
                        profileData.productPropensity.insuranceAddOn > 50 ?
                        'Moderate potential - Nurture with targeted content' :
                        'Lower potential - Focus on engagement first'
                      }
                    </div>
                  </div>

                  <div className="propensity-item">
                    <div className="propensity-header">
                      <span className="propensity-label">Home Internet Bundle</span>
                      <span className="propensity-score">{profileData.productPropensity.homeInternetBundle}%</span>
                    </div>
                    <div className="propensity-bar">
                      <div 
                        className="propensity-fill" 
                        style={{ 
                          width: `${profileData.productPropensity.homeInternetBundle}%`,
                          backgroundColor: getScoreColor(profileData.productPropensity.homeInternetBundle)
                        }}
                      ></div>
                    </div>
                    <div className="propensity-insight">
                      {profileData.productPropensity.homeInternetBundle > 75 ? 
                        'High potential - Consider immediate outreach' :
                        profileData.productPropensity.homeInternetBundle > 50 ?
                        'Moderate potential - Nurture with targeted content' :
                        'Lower potential - Focus on engagement first'
                      }
                    </div>
                  </div>

                  <div className="propensity-item">
                    <div className="propensity-header">
                      <span className="propensity-label">Streaming Package</span>
                      <span className="propensity-score">{profileData.productPropensity.streamingPackage}%</span>
                    </div>
                    <div className="propensity-bar">
                      <div 
                        className="propensity-fill" 
                        style={{ 
                          width: `${profileData.productPropensity.streamingPackage}%`,
                          backgroundColor: getScoreColor(profileData.productPropensity.streamingPackage)
                        }}
                      ></div>
                    </div>
                    <div className="propensity-insight">
                      {profileData.productPropensity.streamingPackage > 75 ? 
                        'High potential - Consider immediate outreach' :
                        profileData.productPropensity.streamingPackage > 50 ?
                        'Moderate potential - Nurture with targeted content' :
                        'Lower potential - Focus on engagement first'
                      }
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'interactions' && (
            <div className="interactions-tab">
              <section className="profile-section recent-interactions">
                <h3 className="section-title">Recent Interactions</h3>
                <div className="interactions-placeholder">
                  <div className="placeholder-icon">📋</div>
                  <p>No recent interactions found</p>
                  <small>Future integration with interaction logs will display customer touchpoints here including:</small>
                  <ul className="interaction-types">
                    <li>Service calls and support tickets</li>
                    <li>Marketing campaign responses</li>
                    <li>Website and app activity</li>
                    <li>Email engagement</li>
                    <li>Sales interactions</li>
                  </ul>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="profile-modal-actions">
          {profileData.permissions.editProfile && (
            <button className="action-btn edit-profile-btn" onClick={handleEditProfile}>
              ✏️ Edit Profile
            </button>
          )}
          {profileData.permissions.createCampaign && (
            <button className="action-btn create-campaign-btn" onClick={handleCreateCampaign}>
              📢 Create Campaign
            </button>
          )}
          <div className="profile-timestamp">
            <span className="timestamp-label">Last updated:</span>
            <span className="timestamp-value">{lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}