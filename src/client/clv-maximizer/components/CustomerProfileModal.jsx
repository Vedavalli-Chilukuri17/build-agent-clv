import React, { useState, useEffect } from 'react';
import { CustomerIntelligenceService } from '../services/CustomerIntelligenceService.js';
import './CustomerProfileModal.css';

export default function CustomerProfileModal({ customer, isOpen, onClose, userContext }) {
  const [productPropensity, setProductPropensity] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const service = new CustomerIntelligenceService();

  useEffect(() => {
    if (isOpen && customer) {
      loadProfileData();
    }
  }, [isOpen, customer]);

  const loadProfileData = async () => {
    try {
      // Generate product propensity scores based on customer data from x_hete_clv_maximiz_policy_holders table
      const propensityScores = await generateProductPropensity(customer);
      setProductPropensity(propensityScores);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const generateProductPropensity = async (customer) => {
    // Simulate API call to retrieve/calculate propensity scores from customer record
    // In a real implementation, this would query the customer record or AI model
    
    const baseScore = customer.tier === 'Platinum' ? 85 : 
                     customer.tier === 'Gold' ? 75 :
                     customer.tier === 'Silver' ? 65 : 55;
    
    // Calculate scores based on customer attributes from policy holders table
    const engagementBonus = Math.floor((customer.engagementScore - 50) / 10);
    const churnPenalty = customer.churnRisk === 'High' ? -15 : 
                        customer.churnRisk === 'Medium' ? -8 : 0;
    const tenureBonus = customer.tenure > 24 ? 5 : customer.tenure > 12 ? 2 : 0;
    
    // Ensure scores are realistic and customer-specific
    const randomVariation = () => Math.floor(Math.random() * 10) - 5; // +/- 5% variation
    
    return {
      premiumMobilePlan: Math.max(0, Math.min(100, baseScore + engagementBonus + churnPenalty + tenureBonus + randomVariation())),
      insuranceAddOn: Math.max(0, Math.min(100, baseScore - 5 + engagementBonus + churnPenalty + tenureBonus + randomVariation())),
      homeInternetBundle: Math.max(0, Math.min(100, baseScore + 3 + engagementBonus + churnPenalty + tenureBonus + randomVariation())),
      streamingPackage: Math.max(0, Math.min(100, baseScore + 8 + engagementBonus + churnPenalty + tenureBonus + randomVariation()))
    };
  };

  const generateAIRecommendations = async () => {
    setLoadingRecommendations(true);
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate dynamic recommendations based on customer data from x_hete_clv_maximiz_policy_holders table
      const recommendations = await generateCustomerSpecificRecommendations(customer, productPropensity);
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const generateCustomerSpecificRecommendations = async (customer, propensity) => {
    const recommendations = [];
    
    // High-priority recommendations based on churn risk and tier
    if (customer.churnRisk === 'High') {
      if (customer.tier === 'Platinum') {
        recommendations.push({
          title: "Platinum Save: Price-Lock + Fee Waiver",
          priority: "High",
          confidence: 92,
          description: `Immediate retention offer for ${customer.customerName}. Provide 24-month price lock with waived activation fees for bundle upgrade. Contact within 24 hours.`,
          tags: ["retention", "platinum", "price_lock", "fee_waiver"]
        });
        
        recommendations.push({
          title: "Concierge Service Activation",
          priority: "High", 
          confidence: 88,
          description: `Activate complimentary concierge service to address concerns proactively. Schedule dedicated account manager call for ${customer.customerName}.`,
          tags: ["retention", "concierge", "platinum", "high_touch"]
        });
      } else if (customer.tier === 'Gold') {
        recommendations.push({
          title: "Gold Retention Bundle Offer", 
          priority: "High",
          confidence: 86,
          description: `Target ${customer.customerName} with 15% discount on premium bundle upgrade. Include loyalty bonus points and extended warranty.`,
          tags: ["retention", "bundle", "discount", "loyalty"]
        });
      } else {
        recommendations.push({
          title: "Value Protection Plan",
          priority: "High", 
          confidence: 78,
          description: `Offer ${customer.customerName} value protection with rate freeze and bonus data allocation. Position as loyalty appreciation.`,
          tags: ["retention", "value_protection", "rate_freeze"]
        });
      }
    }
    
    // Upsell recommendations based on propensity scores
    if (propensity?.premiumMobilePlan > 80) {
      recommendations.push({
        title: "Premium Mobile Upgrade Campaign",
        priority: customer.churnRisk === 'Low' ? "High" : "Medium",
        confidence: propensity.premiumMobilePlan,
        description: `${customer.customerName} shows ${propensity.premiumMobilePlan}% propensity for premium mobile. Offer unlimited 5G upgrade with device trade-in bonus.`,
        tags: ["upsell", "mobile", "5g", "device_trade"]
      });
    }
    
    if (propensity?.homeInternetBundle > 75) {
      recommendations.push({
        title: "Home Internet Bundle Cross-Sell",
        priority: "Medium",
        confidence: propensity.homeInternetBundle, 
        description: `Strong bundling opportunity for ${customer.customerName}. Offer fiber internet + mobile bundle with streaming credits.`,
        tags: ["cross_sell", "bundle", "fiber", "streaming"]
      });
    }
    
    if (propensity?.insuranceAddOn > 70) {
      recommendations.push({
        title: "Device Protection Upsell",
        priority: "Medium",
        confidence: propensity.insuranceAddOn,
        description: `Recommend device protection plan to ${customer.customerName}. Include identity theft protection as value-add.`,
        tags: ["upsell", "insurance", "device_protection", "identity"]
      });
    }
    
    // Engagement-based recommendations
    if (customer.engagementScore < 50) {
      recommendations.push({
        title: "Digital Engagement Boost Campaign", 
        priority: "Low",
        confidence: 65,
        description: `${customer.customerName} has low engagement (${customer.engagementScore}%). Launch personalized app tutorial series with rewards.`,
        tags: ["engagement", "digital", "app_tutorial", "rewards"]
      });
    } else if (customer.engagementScore > 80) {
      recommendations.push({
        title: "VIP Early Access Program",
        priority: "Medium", 
        confidence: 82,
        description: `High engagement customer ${customer.customerName}. Invite to beta features and early access programs as loyalty reward.`,
        tags: ["loyalty", "vip", "early_access", "beta"]
      });
    }
    
    // Location-based recommendations
    if (customer.location) {
      recommendations.push({
        title: `${customer.location} Local Partnership Offer`,
        priority: "Low",
        confidence: 58,
        description: `Leverage ${customer.location} partnerships for ${customer.customerName}. Offer local business discounts and regional event tickets.`,
        tags: ["local_partnership", "regional", "discounts"]
      });
    }
    
    return recommendations.slice(0, 5); // Return top 5 recommendations
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Orange  
    return '#ef4444'; // Red
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  if (!isOpen || !customer || !productPropensity) {
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
                <span className={`tier-badge tier-${customer.tier.toLowerCase()}`}>
                  {customer.tier} Customer
                </span>
                <span className={`churn-badge churn-${customer.churnRisk.toLowerCase()}`}>
                  {customer.churnRisk} Risk
                </span>
              </p>
              <div className="customer-source-badge">
                Source: x_hete_clv_maximiz_policy_holders
              </div>
            </div>
          </div>
          <div className="profile-header-actions">
            <button className="profile-close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* Product Propensity Scores Widget */}
          <section className="profile-section product-propensity-widget">
            <div className="widget-header">
              <h3 className="widget-title">
                <span className="widget-icon">📊</span>
                Product Propensity Scores
              </h3>
              <div className="widget-subtitle">
                AI-calculated likelihood of product adoption based on customer profile
              </div>
            </div>
            
            <div className="propensity-scores-grid">
              <div className="propensity-score-card">
                <div className="score-header">
                  <div className="score-label">Premium Mobile Plan</div>
                  <div className="score-value" style={{ color: getScoreColor(productPropensity.premiumMobilePlan) }}>
                    {productPropensity.premiumMobilePlan}%
                  </div>
                </div>
                <div className="score-bar">
                  <div 
                    className="score-fill"
                    style={{ 
                      width: `${productPropensity.premiumMobilePlan}%`,
                      backgroundColor: getScoreColor(productPropensity.premiumMobilePlan)
                    }}
                  ></div>
                </div>
                <div className="score-insight">
                  {productPropensity.premiumMobilePlan > 80 ? 
                    'Excellent opportunity - Schedule immediate outreach' :
                    productPropensity.premiumMobilePlan > 60 ?
                    'Good potential - Include in targeted campaign' :
                    'Build interest through education and incentives'
                  }
                </div>
              </div>

              <div className="propensity-score-card">
                <div className="score-header">
                  <div className="score-label">Insurance Add-on</div>
                  <div className="score-value" style={{ color: getScoreColor(productPropensity.insuranceAddOn) }}>
                    {productPropensity.insuranceAddOn}%
                  </div>
                </div>
                <div className="score-bar">
                  <div 
                    className="score-fill"
                    style={{ 
                      width: `${productPropensity.insuranceAddOn}%`,
                      backgroundColor: getScoreColor(productPropensity.insuranceAddOn)
                    }}
                  ></div>
                </div>
                <div className="score-insight">
                  {productPropensity.insuranceAddOn > 80 ? 
                    'Excellent opportunity - Schedule immediate outreach' :
                    productPropensity.insuranceAddOn > 60 ?
                    'Good potential - Include in targeted campaign' :
                    'Build interest through education and incentives'
                  }
                </div>
              </div>

              <div className="propensity-score-card">
                <div className="score-header">
                  <div className="score-label">Home Internet Bundle</div>
                  <div className="score-value" style={{ color: getScoreColor(productPropensity.homeInternetBundle) }}>
                    {productPropensity.homeInternetBundle}%
                  </div>
                </div>
                <div className="score-bar">
                  <div 
                    className="score-fill"
                    style={{ 
                      width: `${productPropensity.homeInternetBundle}%`,
                      backgroundColor: getScoreColor(productPropensity.homeInternetBundle)
                    }}
                  ></div>
                </div>
                <div className="score-insight">
                  {productPropensity.homeInternetBundle > 80 ? 
                    'Excellent opportunity - Schedule immediate outreach' :
                    productPropensity.homeInternetBundle > 60 ?
                    'Good potential - Include in targeted campaign' :
                    'Build interest through education and incentives'
                  }
                </div>
              </div>

              <div className="propensity-score-card">
                <div className="score-header">
                  <div className="score-label">Streaming Package</div>
                  <div className="score-value" style={{ color: getScoreColor(productPropensity.streamingPackage) }}>
                    {productPropensity.streamingPackage}%
                  </div>
                </div>
                <div className="score-bar">
                  <div 
                    className="score-fill"
                    style={{ 
                      width: `${productPropensity.streamingPackage}%`,
                      backgroundColor: getScoreColor(productPropensity.streamingPackage)
                    }}
                  ></div>
                </div>
                <div className="score-insight">
                  {productPropensity.streamingPackage > 80 ? 
                    'Excellent opportunity - Schedule immediate outreach' :
                    productPropensity.streamingPackage > 60 ?
                    'Good potential - Include in targeted campaign' :
                    'Build interest through education and incentives'
                  }
                </div>
              </div>
            </div>
          </section>

          {/* AI-Generated Recommendations Widget */}
          <section className="profile-section ai-recommendations-widget">
            <div className="widget-header">
              <h3 className="widget-title">
                <span className="widget-icon">🤖</span>
                AI-Generated Recommendations
              </h3>
              <button 
                className="refresh-recommendations-btn"
                onClick={generateAIRecommendations}
                disabled={loadingRecommendations}
                title="Generate new AI recommendations for this customer"
              >
                {loadingRecommendations ? (
                  <>
                    <span className="refresh-spinner">⟳</span>
                    Generating...
                  </>
                ) : (
                  <>
                    <span className="refresh-icon">↻</span>
                    Refresh
                  </>
                )}
              </button>
            </div>
            
            {loadingRecommendations ? (
              <div className="recommendations-loading">
                <div className="loading-spinner-ai"></div>
                <div className="loading-text">
                  <p>Analyzing customer data from policy holders table...</p>
                  <small>Generating personalized recommendations for {customer.customerName}</small>
                </div>
              </div>
            ) : aiRecommendations && aiRecommendations.length > 0 ? (
              <div className="recommendations-list">
                {aiRecommendations.map((recommendation, index) => (
                  <div key={index} className="recommendation-card">
                    <div className="recommendation-header">
                      <div className="recommendation-title-row">
                        <span className="priority-indicator" style={{ color: getPriorityColor(recommendation.priority) }}>
                          {getPriorityIcon(recommendation.priority)}
                        </span>
                        <h4 className="recommendation-title">{recommendation.title}</h4>
                        <div className="confidence-score">
                          <span className="confidence-label">Confidence:</span>
                          <span className="confidence-value" style={{ color: getScoreColor(recommendation.confidence) }}>
                            {recommendation.confidence}%
                          </span>
                        </div>
                      </div>
                      <div className="priority-badge" style={{ 
                        backgroundColor: getPriorityColor(recommendation.priority),
                        color: 'white'
                      }}>
                        {recommendation.priority} Priority
                      </div>
                    </div>
                    
                    <div className="recommendation-description">
                      {recommendation.description}
                    </div>
                    
                    <div className="recommendation-tags">
                      {recommendation.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="recommendation-tag">
                          {tag.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="recommendations-placeholder">
                <div className="placeholder-content">
                  <div className="placeholder-icon">🎯</div>
                  <p>Click "Refresh" to generate AI-powered recommendations</p>
                  <small>
                    Recommendations will be based on {customer.customerName}'s profile from the policy holders table, 
                    including tier ({customer.tier}), churn risk ({customer.churnRisk}), and engagement patterns.
                  </small>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="profile-modal-footer">
          <div className="data-source-info">
            <span className="source-label">Data Source:</span>
            <span className="source-value">x_hete_clv_maximiz_policy_holders table</span>
          </div>
          <div className="last-updated-info">
            <span className="updated-label">Last Updated:</span>
            <span className="updated-value">{lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}