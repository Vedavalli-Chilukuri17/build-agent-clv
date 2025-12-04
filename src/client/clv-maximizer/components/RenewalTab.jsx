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
  const [highRiskCustomers, setHighRiskCustomers] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [expandedCustomers, setExpandedCustomers] = useState(new Set());
  
  // Load data on component mount
  useEffect(() => {
    loadHighRiskCustomers();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadHighRiskCustomers, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [renewalService]);

  const loadHighRiskCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load policy holders data from ServiceNow table using proper authentication
      let policyHoldersData = [];
      
      try {
        // Use proper authentication headers like other services
        const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };
        
        // Add user token if available (like other services do)
        if (window.g_ck) {
          headers['X-UserToken'] = window.g_ck;
        }

        const policyHoldersResponse = await fetch('/api/now/table/x_hete_clv_maximiz_policy_holders?sysparm_limit=1000&sysparm_display_value=all', {
          method: 'GET',
          headers: headers
        });

        if (policyHoldersResponse.ok) {
          const data = await policyHoldersResponse.json();
          policyHoldersData = data.result || [];
          console.log('Loaded policy holders data:', policyHoldersData.length, 'records');
        } else {
          console.warn('Failed to load from main table, using sample data...');
          policyHoldersData = await generateHighRiskSampleData();
        }
      } catch (apiError) {
        console.warn('API call failed, using sample data:', apiError);
        policyHoldersData = await generateHighRiskSampleData();
      }

      // Filter and transform only high-risk customers
      const transformedData = policyHoldersData
        .filter(holder => {
          const churnRisk = parseFloat(getValue(holder.churn_risk)) || 0;
          const riskLevel = getValue(holder.risk) || 'low';
          return churnRisk >= 70 || riskLevel === 'high';
        })
        .map((holder, index) => {
          const churnRisk = parseFloat(getValue(holder.churn_risk)) || 0;
          const tier = (getValue(holder.tier) || 'bronze').toLowerCase();
          const clv = parseFloat(getValue(holder.clv) || getValue(holder.lifetime_value)) || 0;
          const age = parseInt(getValue(holder.age)) || 35;
          const missingCoverage = getValue(holder.missing_coverage) || '';
          const appSessions = parseInt(getValue(holder.app_sessions_30_days)) || 0;
          const quoteViews = parseInt(getValue(holder.quote_views)) || 0;
          const tenureYears = parseInt(getValue(holder.tenure_years)) || 0;
          
          // Analyze customer profile for dynamic next best actions
          const customerProfile = {
            id: getValue(holder.sys_id) || `high_risk_${index}`,
            name: getValue(holder.name) || `${getValue(holder.first_name) || 'Customer'} ${getValue(holder.last_name) || index + 1}`.trim(),
            email: getValue(holder.email) || `customer${index + 1}@email.com`,
            phone: getValue(holder.phone) || `(555) 123-${String(1000 + index).padStart(4, '0')}`,
            clv12M: clv,
            clvTier: tier,
            age: age,
            customerSince: getValue(holder.sys_created_on) || '2020-01-01',
            renewalDate: getValue(holder.renewal_date) || '2025-01-30',
            missingCoverage: missingCoverage,
            tenureYears: tenureYears,
            appSessions: appSessions,
            quoteViews: quoteViews,
            churnRisk: churnRisk,
            rawData: holder
          };

          // Generate dynamic content based on individual customer profile
          const currentPolicies = analyzeCurrentPolicies(customerProfile, missingCoverage);
          const aiCampaignScript = generateAICampaignScript(customerProfile, currentPolicies);

          return {
            ...customerProfile,
            currentPolicies,
            aiCampaignScript
          };
        });
      
      setHighRiskCustomers(transformedData);
      setLastUpdated(new Date());
      
    } catch (err) {
      setError('Failed to load high-risk customer data. Please try again.');
      console.error('Error loading high-risk customers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract values from ServiceNow field objects
  const getValue = (field) => {
    if (typeof field === 'object' && field !== null && field.display_value !== undefined) {
      return field.display_value;
    }
    return field;
  };

  // Generate diverse high-risk sample data
  const generateHighRiskSampleData = async () => {
    return [
      {
        sys_id: 'hr_001',
        name: 'Nicole Martin',
        email: 'nicole.martin@email.com',
        phone: '(555) 123-4567',
        tier: 'gold',
        clv: 14780,
        churn_risk: 85,
        missing_coverage: 'life,umbrella',
        age: 34,
        app_sessions_30_days: 2,
        quote_views: 15,
        sys_created_on: '2021-03-15'
      },
      {
        sys_id: 'hr_002',
        name: 'Michael Rodriguez',
        email: 'michael.rodriguez@email.com',
        phone: '(555) 987-6543',
        tier: 'platinum',
        clv: 28650,
        churn_risk: 75,
        missing_coverage: 'earthquake,flood',
        age: 58,
        app_sessions_30_days: 12,
        quote_views: 8,
        sys_created_on: '2017-08-20'
      },
      {
        sys_id: 'hr_003',
        name: 'Sarah Chen',
        email: 'sarah.chen@email.com',
        phone: '(555) 456-7890',
        tier: 'silver',
        clv: 12430,
        churn_risk: 90,
        missing_coverage: 'auto_comprehensive,home,life',
        age: 29,
        app_sessions_30_days: 0,
        quote_views: 25,
        sys_created_on: '2022-05-10'
      },
      {
        sys_id: 'hr_004',
        name: 'David Kim',
        email: 'david.kim@email.com',
        phone: '(555) 321-0987',
        tier: 'gold',
        clv: 22150,
        churn_risk: 78,
        missing_coverage: 'jewelry,cyber',
        age: 45,
        app_sessions_30_days: 8,
        quote_views: 12,
        sys_created_on: '2018-11-22'
      },
      {
        sys_id: 'hr_005',
        name: 'Jennifer Thompson',
        email: 'jennifer.thompson@email.com',
        phone: '(555) 654-3210',
        tier: 'bronze',
        clv: 8920,
        churn_risk: 88,
        missing_coverage: 'auto_comprehensive,life,home',
        age: 27,
        app_sessions_30_days: 1,
        quote_views: 30,
        sys_created_on: '2023-01-18'
      },
      {
        sys_id: 'hr_006',
        name: 'Robert Williams',
        email: 'robert.williams@email.com',
        phone: '(555) 789-0123',
        tier: 'platinum',
        clv: 41290,
        churn_risk: 72,
        missing_coverage: 'yacht,collectibles',
        age: 62,
        app_sessions_30_days: 18,
        quote_views: 4,
        sys_created_on: '2016-09-12'
      }
    ];
  };

  // Analyze current policies to determine product count and gaps
  const analyzeCurrentPolicies = (customer, missingCoverage) => {
    const policies = [];
    const coverageArray = missingCoverage.toLowerCase().split(',').filter(c => c.trim());
    
    // Determine existing policies by what's NOT missing
    const allCoverageTypes = ['auto', 'home', 'life', 'umbrella', 'jewelry', 'cyber', 'flood', 'earthquake', 'yacht', 'collectibles'];
    const existingCoverage = allCoverageTypes.filter(type => !coverageArray.some(missing => missing.includes(type)));
    
    // Generate policies based on tier and existing coverage
    if (existingCoverage.includes('auto') || customer.clvTier !== 'bronze') {
      policies.push({
        type: 'Auto Insurance',
        status: 'Active',
        premium: calculatePremium(customer, 'auto'),
        coverageAmount: customer.clvTier === 'platinum' ? 100000 : customer.clvTier === 'gold' ? 75000 : 50000,
        renewalDate: customer.renewalDate,
        comprehensive: !coverageArray.includes('auto_comprehensive')
      });
    }

    if (existingCoverage.includes('home') || (customer.clvTier === 'platinum' || customer.clvTier === 'gold')) {
      policies.push({
        type: customer.clvTier === 'platinum' ? 'Home Insurance' : 'Renters Insurance',
        status: 'Active',
        premium: calculatePremium(customer, 'home'),
        coverageAmount: customer.clvTier === 'platinum' ? 500000 : 250000,
        renewalDate: customer.renewalDate
      });
    }

    if (existingCoverage.includes('umbrella') && (customer.clvTier === 'platinum' || customer.clvTier === 'gold')) {
      policies.push({
        type: 'Umbrella Policy',
        status: 'Active',
        premium: calculatePremium(customer, 'umbrella'),
        coverageAmount: 1000000,
        renewalDate: customer.renewalDate
      });
    }

    if (existingCoverage.includes('life')) {
      policies.push({
        type: 'Term Life Insurance',
        status: 'Active',
        premium: calculatePremium(customer, 'life'),
        coverageAmount: customer.clv12M * 10,
        renewalDate: customer.renewalDate
      });
    }

    return {
      policies,
      productCount: policies.length,
      hasOnlyOneProduct: policies.length === 1,
      missingCoverageTypes: coverageArray,
      isUnderinsured: policies.length < 2 && customer.clv12M > 20000
    };
  };

  // Calculate premium based on customer profile
  const calculatePremium = (customer, policyType) => {
    const basePremiums = {
      auto: customer.clv12M * 0.15,
      home: customer.clv12M * 0.12,
      umbrella: customer.clv12M * 0.05,
      life: customer.clv12M * 0.08
    };
    
    const base = basePremiums[policyType] || 1000;
    
    // Adjust for age and tier
    let adjustment = 1.0;
    if (customer.age < 30) adjustment = 1.2;
    else if (customer.age > 60) adjustment = 0.9;
    
    if (customer.clvTier === 'platinum') adjustment *= 0.8;
    else if (customer.clvTier === 'gold') adjustment *= 0.9;
    else if (customer.clvTier === 'bronze') adjustment *= 1.2;
    
    return Math.round(base * adjustment);
  };

  // Generate dynamic AI Campaign Script for each customer
  const generateAICampaignScript = (customer, policies) => {
    const firstName = customer.name.split(' ')[0];
    const missingCoverageArray = customer.missingCoverage.toLowerCase().split(',').filter(c => c.trim());
    
    // Generate personalized AI script based on customer profile
    const aiScripts = [
      // High CLV customers
      {
        condition: customer.clv12M > 25000,
        script: `Don't let premium protection slip away, ${firstName}! Your CLV of $${customer.clv12M.toLocaleString()} qualifies you for our ${customer.clvTier.toUpperCase()} VIP renewal package with 30% savings and white-glove claim service.`
      },
      // Mid-tier customers with single product
      {
        condition: customer.clv12M > 15000 && policies.hasOnlyOneProduct,
        script: `Great news ${firstName}! Your ${customer.clvTier} tier status and CLV of $${customer.clv12M.toLocaleString()} unlocks our exclusive multi-policy bundle with 25% savings and priority support.`
      },
      // High quote activity (shopping around)
      {
        condition: customer.quoteViews > 15,
        script: `We see you're exploring options, ${firstName}. Let's keep your $${customer.clv12M.toLocaleString()} value with us through our loyalty rewards program - 20% discount plus accident forgiveness!`
      },
      // Young customers missing life insurance
      {
        condition: customer.age < 40 && missingCoverageArray.includes('life'),
        script: `Secure your family's future, ${firstName}! At ${customer.age}, your $${customer.clv12M.toLocaleString()} CLV qualifies for our young family protection bundle with term life at just $30/month.`
      },
      // Pre-retirement customers
      {
        condition: customer.age >= 55 && customer.age <= 65,
        script: `Planning for retirement, ${firstName}? Your $${customer.clv12M.toLocaleString()} CLV earns you our senior security package with legacy planning and 25% multi-policy savings.`
      },
      // New customers with gaps
      {
        condition: customer.tenureYears <= 2,
        script: `Welcome to the family, ${firstName}! Your $${customer.clv12M.toLocaleString()} CLV shows great potential - let's complete your protection with our new customer bundle saving 35%.`
      },
      // Default for all other high-risk customers
      {
        condition: true,
        script: `Don't let great coverage slip away, ${firstName}! Your CLV of $${customer.clv12M.toLocaleString()} qualifies you for our ${customer.clvTier.toUpperCase()} renewal package with 25% savings and priority claim service.`
      }
    ];

    // Find the first matching script
    const matchedScript = aiScripts.find(script => script.condition);
    
    // Generate churn mitigation actions based on customer profile
    const churnMitigation = generateChurnMitigation(customer, policies);
    
    // Generate cross-sell/upsell suggestions based on missing coverage
    const crossSellUpsell = generateCrossSellUpsell(customer, missingCoverageArray, policies);
    
    // Generate outreach channels based on customer behavior
    const outreachChannels = generateOutreachChannels(customer);

    return {
      personalizedScript: matchedScript.script,
      churnMitigation,
      crossSellUpsell,
      outreachChannels
    };
  };

  // Generate churn mitigation actions
  const generateChurnMitigation = (customer, policies) => {
    const actions = [];
    
    if (policies.productCount > 1) {
      const discount = customer.clvTier === 'platinum' ? 45 : customer.clvTier === 'gold' ? 40 : customer.clvTier === 'silver' ? 35 : 30;
      actions.push(`Multi-policy bundle - save ${discount}%`);
    }
    
    if (customer.churnRisk > 85) {
      actions.push('Loyalty retention credit - $500 off renewal');
      actions.push('Priority claims specialist assignment');
    } else if (customer.churnRisk > 75) {
      actions.push('Customer success manager assignment');
      actions.push('Cross-product discount opportunity');
    } else {
      actions.push('Cross-product discount opportunity');
    }
    
    if (customer.tenureYears >= 3) {
      actions.push('Long-term customer appreciation bonus');
    }
    
    return actions;
  };

  // Generate cross-sell/upsell suggestions
  const generateCrossSellUpsell = (customer, missingCoverageArray, policies) => {
    const suggestions = [];
    
    // Life insurance suggestions
    if (missingCoverageArray.includes('life') && customer.age < 50) {
      const monthlyCost = Math.round((customer.clv12M * 0.08) / 12);
      suggestions.push(`Term Life Protection - starting at $${monthlyCost}/month`);
      suggestions.push('Family income protection included');
    }
    
    // Auto coverage enhancements
    if (missingCoverageArray.includes('auto_comprehensive') || policies.hasOnlyOneProduct) {
      const discount = customer.quoteViews > 15 ? 40 : 35; // Higher discount if shopping around
      suggestions.push(`Smart Auto Coverage - save ${discount}%`);
      suggestions.push('Accident forgiveness included');
    }
    
    // Home/Property suggestions
    if (missingCoverageArray.includes('home') && (customer.clvTier === 'gold' || customer.clvTier === 'platinum')) {
      suggestions.push('Property protection bundle - save 30%');
      suggestions.push('Natural disaster coverage included');
    }
    
    // Umbrella suggestions for high-value customers
    if (missingCoverageArray.includes('umbrella') && customer.clv12M > 20000) {
      suggestions.push('Enhanced liability protection - $1M coverage');
      suggestions.push('Asset protection suite included');
    }
    
    // Specialty coverage for platinum customers
    if (customer.clvTier === 'platinum') {
      if (missingCoverageArray.includes('jewelry')) {
        suggestions.push('Luxury asset protection - jewelry & collectibles');
      }
      if (missingCoverageArray.includes('cyber')) {
        suggestions.push('Cyber liability protection - identity theft coverage');
      }
    }
    
    // Default suggestions if none above apply
    if (suggestions.length === 0) {
      suggestions.push('Coverage enhancement review available');
      suggestions.push('Personalized protection analysis included');
    }
    
    return suggestions;
  };

  // Generate outreach channels based on customer behavior
  const generateOutreachChannels = (customer) => {
    const channels = [];
    
    // Determine primary channel based on app usage and age
    if (customer.appSessions > 10 || customer.age < 40) {
      channels.push('Personalized mobile app notification');
      channels.push('Email campaign with interactive tools');
      channels.push('Text message follow-up available');
    } else if (customer.appSessions > 3) {
      channels.push('Personalized email campaign');
      channels.push('Mobile app notification backup');
      channels.push('Phone follow-up if needed');
    } else {
      // Low digital engagement - focus on traditional channels
      channels.push('Personal phone consultation');
      channels.push('Mailed personalized proposal');
      channels.push('Email summary backup');
    }
    
    // Add urgent channel for very high-risk customers
    if (customer.churnRisk > 85 || customer.quoteViews > 20) {
      channels.unshift('Immediate specialist outreach - within 24 hours');
    }
    
    return channels;
  };

  // Filter customers
  const filteredHighRiskCustomers = useMemo(() => {
    return highRiskCustomers.filter(customer => {
      const matchesSearch = !searchTerm || 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTier = !tierFilter || customer.clvTier.toLowerCase() === tierFilter.toLowerCase();
      
      return matchesSearch && matchesTier;
    });
  }, [highRiskCustomers, searchTerm, tierFilter]);

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
      alert(`Campaign launched successfully for ${action}!`);
      loadHighRiskCustomers(); // Refresh data
    } catch (err) {
      alert(`Failed to launch campaign. Please try again.`);
    }
  };

  const handleLaunchCampaign = async (customerId, campaignType) => {
    try {
      await renewalService.launchCampaign(customerId, campaignType);
      alert('Outreach campaign initiated successfully!');
    } catch (err) {
      alert('Failed to initiate outreach. Please try again.');
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="renewal-tab">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading high-risk customer data...</p>
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
          <button className="retry-btn" onClick={loadHighRiskCustomers}>
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
          <h1 className="renewal-title">High-Risk Customer Renewal Dashboard</h1>
          <p className="header-subtitle">AI-powered personalized campaign scripts and retention strategies</p>
        </div>
      </div>

      {/* High-Risk Customers Section */}
      <section className="high-risk-customers-section">
        <div className="section-header">
          <h2 className="section-title">High-Risk Customers - AI Campaign Ready</h2>
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
          </div>
        </div>

        <div className="high-risk-customers-grid">
          {filteredHighRiskCustomers.map((customer) => {
            const isExpanded = expandedCustomers.has(customer.id);
            
            return (
              <div key={customer.id} className={`customer-profile-card high-risk ${customer.clvTier}`}>
                {/* Customer Header - Removed CLV and Credit Score */}
                <div className="customer-header" onClick={() => toggleCustomerExpansion(customer.id)}>
                  <div className="customer-basic-info">
                    <h3 className="customer-name">{customer.name}</h3>
                    <span className="risk-tier-badge urgent">HIGH RISK</span>
                    <span className={`clv-tier-badge ${customer.clvTier?.toLowerCase() || 'bronze'}`}>
                      {customer.clvTier?.toUpperCase() || 'BRONZE'}
                    </span>
                    <span className="churn-risk-indicator">
                      Churn Risk: {customer.churnRisk}%
                    </span>
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
                      <div className="policies-content">
                        <p><strong>Current Policies:</strong> {customer.currentPolicies.policies.map(p => p.type).join(', ')}</p>
                        <p><strong>Premium:</strong> ${customer.currentPolicies.policies.reduce((total, p) => total + p.premium, 0).toLocaleString()}</p>
                        <p><strong>Coverage:</strong> ${customer.currentPolicies.policies.reduce((total, p) => total + p.coverageAmount, 0).toLocaleString()}</p>
                        <p><strong>Renewal:</strong> {customer.renewalDate}</p>
                        <p><strong>Coverages:</strong> Liability, {customer.currentPolicies.policies.some(p => p.comprehensive) ? 'Comprehensive, ' : ''}Collision Coverage</p>
                      </div>
                    </div>

                    {/* Missing Coverage Analysis */}
                    {customer.missingCoverage && (
                      <div className="info-section missing-coverage-section">
                        <h4 className="info-section-title">Missing Coverage Analysis</h4>
                        <div className="missing-coverage-details">
                          <p><strong>Missing Coverage Types:</strong> {customer.missingCoverage.replace(/,/g, ', ').replace(/_/g, ' ')}</p>
                          <p><strong>Recommendation:</strong> Immediate coverage review and gap analysis recommended</p>
                        </div>
                      </div>
                    )}

                    {/* Dynamic Next Best Action */}
                    <div className="info-section ai-campaign-section">
                      <h4 className="info-section-title">Next Best Action</h4>
                      
                      {/* AI Campaign Script */}
                      <div className="ai-script-container">
                        <h5 className="ai-script-title">Next Best Action AI Campaign Script</h5>
                        <div className="ai-script-label">Personalized</div>
                        <div className="ai-script-content">
                          "{customer.aiCampaignScript.personalizedScript}"
                        </div>
                      </div>

                      {/* Churn Mitigation Actions */}
                      <div className="churn-mitigation-container">
                        <h5 className="churn-mitigation-title">Churn Mitigation Actions</h5>
                        <div className="churn-actions-list">
                          {customer.aiCampaignScript.churnMitigation.map((action, index) => (
                            <div key={index} className="churn-action-item">
                              {action}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Cross-Sell/Upsell Suggestions */}
                      <div className="cross-sell-container">
                        <h5 className="cross-sell-title">Cross-Sell/Upsell Suggestions</h5>
                        <div className="cross-sell-list">
                          {customer.aiCampaignScript.crossSellUpsell.map((suggestion, index) => (
                            <div key={index} className="cross-sell-item">
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Outreach Channels */}
                      <div className="outreach-container">
                        <h5 className="outreach-title">Outreach Channels</h5>
                        <div className="outreach-list">
                          {customer.aiCampaignScript.outreachChannels.map((channel, index) => (
                            <div key={index} className="outreach-item">
                              {channel}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="campaign-action-buttons">
                        <button 
                          className={`launch-campaign-btn ${customer.clvTier}`}
                          onClick={() => handleExecuteAction(customer.id, 'AI Personalized Campaign')}
                        >
                          Launch AI Campaign
                        </button>
                        <button 
                          className={`initiate-outreach-btn ${customer.clvTier}`}
                          onClick={() => handleLaunchCampaign(customer.id, 'Multi-Channel Outreach')}
                        >
                          Initiate Outreach
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredHighRiskCustomers.length === 0 && (
          <div className="no-results">
            <p>No high-risk customers found matching the current filters.</p>
            <p>Try adjusting your search criteria or tier filters.</p>
          </div>
        )}
      </section>
    </div>
  );
}