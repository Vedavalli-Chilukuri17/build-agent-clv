import React, { useState, useEffect } from 'react';
import { display, value } from '../utils/fields.js';
import './SimpleDashboard.css';

export default function SimpleDashboard() {
  const [dashboardData, setDashboardData] = useState({
    // Basic KPIs sourced from Policy Holders table
    totalCustomers: 0,
    highValueCustomersPercentage: 0,
    avgLifetimeValue: 0,
    averageChurnRisk: 0,
    dataSource: 'x_hete_clv_maximiz_policy_holders',
    
    // Renewal Pipeline
    renewalPipeline: {
      next30Days: 0,
      next60Days: 0,
      next90Days: 0
    },
    
    // High-Risk Customers by Tier
    highRiskByTier: {
      platinum: 0,
      gold: 0,
      silver: 0,
      bronze: 0
    },
    
    // Cross-Sell/Upsell (Static)
    crossSellUpsell: {
      crossSellOpportunities: 45,
      upsellPotential: 32,
      conversionRate: 18.5
    },
    
    // Customer Tier Distribution
    tierDistribution: {
      platinum: 0,
      gold: 0,
      silver: 0,
      bronze: 0
    },
    
    // CLV Band Distribution (realistic)
    clvBands: {
      high: 0,
      medium: 0,
      low: 0
    },
    
    // Risk Factor Analysis
    riskAnalysis: {
      creditRisk: 0,
      propertyRisk: 0,
      combinedRisk: 0
    },
    
    // Product Performance Data
    productPerformanceData: []
  });
  
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    loadComprehensiveDashboardData();
  }, []);

  // Helper function to filter out "unknown" and invalid values
  const isValidValue = (val) => {
    if (!val) return false;
    const normalizedVal = val.toString().toLowerCase().trim();
    return normalizedVal !== 'unknown' && normalizedVal !== '' && normalizedVal !== 'null' && normalizedVal !== 'undefined';
  };

  // Helper function to get valid tier values
  const getValidTier = (tierValue) => {
    if (!tierValue) return null;
    const normalizedTier = tierValue.toString().toLowerCase().trim();
    const validTiers = ['platinum', 'gold', 'silver', 'bronze'];
    return validTiers.includes(normalizedTier) ? normalizedTier : null;
  };

  const loadComprehensiveDashboardData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading dashboard data from Policy Holders table...');
      
      // Primary data source: Policy Holders table
      const policyHolders = await fetchPolicyHoldersData();
      console.log(`✅ Successfully loaded ${policyHolders.length} policy holder records from x_hete_clv_maximiz_policy_holders`);
      
      // Secondary data for product performance - filter out unknown values
      const productPerformanceRaw = await fetchTableData('x_hete_clv_maximiz_competitor_benchmark');
      const productPerformance = productPerformanceRaw.filter(p => 
        isValidValue(display(p.product)) && display(p.product) !== 'Unknown'
      );
      console.log(`📊 Loaded ${productPerformance.length} valid product performance records (filtered from ${productPerformanceRaw.length} total)`);

      if (policyHolders.length === 0) {
        console.warn('⚠️ No policy holders found in the table. Dashboard will show zero counts.');
        setDebugInfo({ error: 'No policy holders data found' });
      }

      // Calculate Total Customers - DIRECTLY from Policy Holders table
      const totalCustomers = policyHolders.length;
      console.log(`👥 Total Customers calculated from Policy Holders table: ${totalCustomers}`);
      
      // Calculate High-Value Customers PERCENTAGE (Platinum and Gold tiers) - filter unknown
      const highValueCustomers = policyHolders.filter(p => {
        const tier = display(p.tier);
        const validTier = getValidTier(tier);
        return validTier === 'platinum' || validTier === 'gold';
      }).length;
      
      const highValueCustomersPercentage = totalCustomers > 0 ? (highValueCustomers / totalCustomers) * 100 : 0;
      console.log(`⭐ High-Value Customers: ${highValueCustomers} out of ${totalCustomers} (${highValueCustomersPercentage.toFixed(1)}%)`);

      // Calculate Average LIFETIME VALUE using the "lifetime_value" field from Policy Holders
      let avgLifetimeValue = 0;
      let validLifetimeValueCount = 0;
      let lifetimeValueSum = 0;
      
      policyHolders.forEach(p => {
        const lifetimeValue = parseFloat(display(p.lifetime_value));
        if (!isNaN(lifetimeValue) && lifetimeValue > 0) {
          lifetimeValueSum += lifetimeValue;
          validLifetimeValueCount++;
        }
      });
      
      if (validLifetimeValueCount > 0) {
        avgLifetimeValue = lifetimeValueSum / validLifetimeValueCount;
        console.log(`💰 Average Lifetime Value calculated: $${Math.round(avgLifetimeValue)} (from ${validLifetimeValueCount} valid records)`);
      } else {
        console.warn('⚠️ No valid lifetime_value data found in Policy Holders');
      }

      // Calculate AVERAGE Churn Risk from churn_risk field in Policy Holders table
      console.log('🎯 CALCULATING AVERAGE CHURN RISK FROM CHURN_RISK FIELD:');
      
      let averageChurnRisk = 0;
      let validChurnRiskCount = 0;
      let churnRiskValues = [];
      
      // Analyze churn risk field values - filter unknown
      policyHolders.forEach(p => {
        const churnRiskRaw = display(p.churn_risk);
        const churnRiskNum = parseFloat(churnRiskRaw);
        
        if (!isNaN(churnRiskNum) && churnRiskRaw !== null && churnRiskRaw !== undefined && churnRiskRaw !== '' && isValidValue(churnRiskRaw)) {
          churnRiskValues.push(churnRiskNum);
          validChurnRiskCount++;
        }
      });
      
      console.log(`📊 Found ${validChurnRiskCount} valid churn_risk values out of ${totalCustomers} customers`);
      console.log(`📈 Churn risk values sample:`, churnRiskValues.slice(0, 10));
      
      if (validChurnRiskCount > 0) {
        const totalChurnRisk = churnRiskValues.reduce((sum, value) => sum + value, 0);
        averageChurnRisk = totalChurnRisk / validChurnRiskCount;
        
        console.log(`✅ Average Churn Risk calculated: ${averageChurnRisk.toFixed(2)}%`);
        console.log(`📋 Min: ${Math.min(...churnRiskValues)}, Max: ${Math.max(...churnRiskValues)}`);
        
        setDebugInfo({
          totalCustomers,
          validChurnRiskCount,
          averageChurnRisk: averageChurnRisk.toFixed(2),
          minChurnRisk: Math.min(...churnRiskValues),
          maxChurnRisk: Math.max(...churnRiskValues),
          sampleValues: churnRiskValues.slice(0, 10),
          highValueCustomersPercentage: highValueCustomersPercentage.toFixed(1),
          avgLifetimeValue: Math.round(avgLifetimeValue),
          validLifetimeValueCount
        });
      } else {
        console.warn('⚠️ No valid churn_risk values found in Policy Holders data');
        averageChurnRisk = 0;
        
        setDebugInfo({
          totalCustomers,
          validChurnRiskCount: 0,
          error: 'No valid churn_risk values found',
          highValueCustomersPercentage: highValueCustomersPercentage.toFixed(1),
          avgLifetimeValue: Math.round(avgLifetimeValue),
          validLifetimeValueCount
        });
      }

      // Calculate Renewal Pipeline (30/60/90 days) from Policy Holders renewal dates
      const now = new Date();
      const next30Days = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      const next60Days = new Date(now.getTime() + (60 * 24 * 60 * 60 * 1000));
      const next90Days = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000));

      const renewalPipeline = {
        next30Days: policyHolders.filter(p => {
          const renewalDate = display(p.renewal_date);
          if (!renewalDate || !isValidValue(renewalDate)) return false;
          const rDate = new Date(renewalDate);
          return !isNaN(rDate.getTime()) && rDate >= now && rDate <= next30Days;
        }).length,
        next60Days: policyHolders.filter(p => {
          const renewalDate = display(p.renewal_date);
          if (!renewalDate || !isValidValue(renewalDate)) return false;
          const rDate = new Date(renewalDate);
          return !isNaN(rDate.getTime()) && rDate >= now && rDate <= next60Days;
        }).length,
        next90Days: policyHolders.filter(p => {
          const renewalDate = display(p.renewal_date);
          if (!renewalDate || !isValidValue(renewalDate)) return false;
          const rDate = new Date(renewalDate);
          return !isNaN(rDate.getTime()) && rDate >= now && rDate <= next90Days;
        }).length
      };
      console.log('📅 Renewal Pipeline calculated:', renewalPipeline);

      // Calculate Tier Distribution from Policy Holders - FILTER OUT UNKNOWN
      const tierDistribution = {
        platinum: 0,
        gold: 0,
        silver: 0,
        bronze: 0
      };

      policyHolders.forEach(p => {
        const tier = display(p.tier);
        const validTier = getValidTier(tier);
        if (validTier && tierDistribution.hasOwnProperty(validTier)) {
          tierDistribution[validTier]++;
        }
      });
      
      console.log('🏆 Tier Distribution (filtered):', tierDistribution);
      
      // Log filtered out records for debugging
      const unknownTierCount = policyHolders.filter(p => {
        const tier = display(p.tier);
        return !getValidTier(tier);
      }).length;
      console.log(`🔍 Filtered out ${unknownTierCount} records with unknown/invalid tier values`);

      // Calculate High-Risk Customers by Tier (using churn_risk over 60%) - FILTER UNKNOWN
      console.log('🎯 CALCULATING HIGH-RISK CUSTOMERS BY TIER (churn risk over 60%):');
      const highRiskByTier = {
        platinum: 0,
        gold: 0,
        silver: 0,
        bronze: 0
      };

      policyHolders.forEach(p => {
        const tier = display(p.tier);
        const validTier = getValidTier(tier);
        const churnRisk = parseFloat(display(p.churn_risk)) || 0;
        
        if (churnRisk > 60 && validTier && highRiskByTier.hasOwnProperty(validTier)) {
          highRiskByTier[validTier]++;
        }
      });
      
      console.log('🎯 High-Risk by Tier (filtered, churn risk over 60%):', highRiskByTier);

      // Calculate CLV Band Distribution based on Policy Holders lifetime_value - FILTER UNKNOWN
      const clvBands = {
        high: policyHolders.filter(p => {
          const ltv = parseFloat(display(p.lifetime_value));
          return !isNaN(ltv) && ltv > 50000;
        }).length,
        medium: policyHolders.filter(p => {
          const ltv = parseFloat(display(p.lifetime_value));
          return !isNaN(ltv) && ltv >= 20000 && ltv <= 50000;
        }).length,
        low: policyHolders.filter(p => {
          const ltv = parseFloat(display(p.lifetime_value));
          return !isNaN(ltv) && ltv > 0 && ltv < 20000;
        }).length
      };
      console.log('💎 CLV Bands (filtered):', clvBands);

      // Calculate Risk Factor Analysis from Policy Holders credit and delinquency data - FILTER UNKNOWN
      const riskAnalysis = {
        creditRisk: policyHolders.filter(p => {
          const creditScore = parseInt(display(p.credit_score));
          return !isNaN(creditScore) && creditScore > 0 && creditScore < 650;
        }).length,
        propertyRisk: policyHolders.filter(p => {
          const delinquency = parseInt(display(p.delinquency_12m));
          return !isNaN(delinquency) && delinquency > 2;
        }).length,
        combinedRisk: policyHolders.filter(p => {
          const creditScore = parseInt(display(p.credit_score));
          const delinquency = parseInt(display(p.delinquency_12m));
          const churnRisk = parseFloat(display(p.churn_risk));
          
          const hasCredit = !isNaN(creditScore) && creditScore > 0 && creditScore < 650;
          const hasDelinquency = !isNaN(delinquency) && delinquency > 2;
          const hasChurnRisk = !isNaN(churnRisk) && churnRisk > 70;
          
          return hasCredit || hasDelinquency || hasChurnRisk;
        }).length
      };
      console.log('⚠️ Risk Analysis (filtered):', riskAnalysis);

      // Update dashboard data with calculated metrics
      setDashboardData({
        totalCustomers,
        highValueCustomersPercentage: Math.round(highValueCustomersPercentage * 10) / 10,
        avgLifetimeValue: Math.round(avgLifetimeValue),
        averageChurnRisk: Math.round(averageChurnRisk * 100) / 100,
        dataSource: 'x_hete_clv_maximiz_policy_holders',
        renewalPipeline,
        highRiskByTier,
        crossSellUpsell: {
          crossSellOpportunities: 45,
          upsellPotential: 32,
          conversionRate: 18.5
        },
        tierDistribution,
        clvBands,
        riskAnalysis,
        productPerformanceData: productPerformance
      });

      setLastUpdated(new Date());
      console.log('✅ Dashboard data successfully updated from Policy Holders table (unknown values filtered)');

    } catch (error) {
      console.error('❌ Error loading comprehensive dashboard data:', error);
      setDebugInfo({ error: error.message });
      // Set default values to prevent UI errors
      setDashboardData(prevData => ({
        ...prevData,
        totalCustomers: 0,
        highValueCustomersPercentage: 0,
        avgLifetimeValue: 0,
        averageChurnRisk: 0
      }));
    } finally {
      setLoading(false);
    }
  };

  // Dedicated function to fetch Policy Holders data
  const fetchPolicyHoldersData = async () => {
    try {
      console.log('🔍 Fetching data from x_hete_clv_maximiz_policy_holders table...');
      
      const response = await fetch('/api/now/table/x_hete_clv_maximiz_policy_holders?sysparm_display_value=all&sysparm_limit=1000', {
        headers: {
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch policy holders data`);
      }

      const data = await response.json();
      const policyHolders = data.result || [];
      
      console.log(`✅ Policy Holders API Response: ${policyHolders.length} records fetched successfully`);
      
      if (policyHolders.length > 0) {
        console.log('📋 Sample policy holder record fields:', Object.keys(policyHolders[0]));
        console.log('📋 Sample record with key fields:', {
          churn_risk: policyHolders[0].churn_risk,
          tier: policyHolders[0].tier,
          lifetime_value: policyHolders[0].lifetime_value
        });
      }
      
      return policyHolders;
      
    } catch (error) {
      console.error('❌ Error fetching policy holders data:', error);
      throw error;
    }
  };

  // General function for other tables
  const fetchTableData = async (tableName) => {
    try {
      const response = await fetch(`/api/now/table/${tableName}?sysparm_display_value=all&sysparm_limit=1000`, {
        headers: {
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        }
      });
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="simple-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading Analytics from Policy Holders Table...</p>
        <p className="loading-subtext">Fetching data from x_hete_clv_maximiz_policy_holders</p>
        <p className="loading-subtext">Filtering out unknown values...</p>
        <p className="loading-subtext">Calculating metrics...</p>
      </div>
    );
  }

  return (
    <div className="comprehensive-dashboard">
      <div className="dashboard-header">
        <h1>CLV Analytics Dashboard</h1>
        <p>Comprehensive Customer Intelligence & Performance Metrics</p>
        <div className="data-source-info">
          <small>📊 Primary Data Source: {dashboardData.dataSource}</small>
          {lastUpdated && (
            <small> • Last Updated: {lastUpdated.toLocaleTimeString()}</small>
          )}
        </div>
      </div>

      {/* Debug Information Panel */}
      {debugInfo && (
        <div className="debug-panel">
          <h3>🔍 Dashboard Data Analysis</h3>
          <div className="debug-content">
            {debugInfo.error ? (
              <div className="debug-error">❌ Error: {debugInfo.error}</div>
            ) : (
              <div className="debug-success">
                <p><strong>Total Customers:</strong> {debugInfo.totalCustomers}</p>
                <p><strong>High-Value Customers:</strong> {debugInfo.highValueCustomersPercentage}% (Gold + Platinum)</p>
                <p><strong>Average Lifetime Value:</strong> ${debugInfo.avgLifetimeValue?.toLocaleString()} (from {debugInfo.validLifetimeValueCount} records)</p>
                <p><strong>Average Churn Risk:</strong> {debugInfo.averageChurnRisk}% (from {debugInfo.validChurnRiskCount} records)</p>
                <p><strong>Data Quality:</strong> Unknown values filtered from all calculations</p>
                {debugInfo.sampleValues && (
                  <p><strong>Sample Churn Values:</strong> {debugInfo.sampleValues?.join(', ')}%</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Basic KPIs - All sourced from Policy Holders table */}
      <div className="dashboard-section">
        <h2>Key Performance Indicators</h2>
        <div className="simple-kpi-grid">
          <div className="simple-kpi-card">
            <div className="kpi-icon">👥</div>
            <div className="kpi-content">
              <div className="kpi-value">{dashboardData.totalCustomers.toLocaleString()}</div>
              <div className="kpi-label">Total Customers</div>
              <div className="kpi-source">From Policy Holders Table</div>
            </div>
          </div>

          <div className="simple-kpi-card high-value">
            <div className="kpi-icon">⭐</div>
            <div className="kpi-content">
              <div className="kpi-value">{dashboardData.highValueCustomersPercentage}%</div>
              <div className="kpi-label">High-Value Customers</div>
              <div className="kpi-sublabel">% Gold + Platinum Tiers</div>
            </div>
          </div>

          <div className="simple-kpi-card clv">
            <div className="kpi-icon">💰</div>
            <div className="kpi-content">
              <div className="kpi-value">${dashboardData.avgLifetimeValue.toLocaleString()}</div>
              <div className="kpi-label">Average Lifetime Value</div>
              <div className="kpi-sublabel">From lifetime_value Field</div>
            </div>
          </div>

          <div className="simple-kpi-card risk">
            <div className="kpi-icon">⚠️</div>
            <div className="kpi-content">
              <div className="kpi-value">{dashboardData.averageChurnRisk}%</div>
              <div className="kpi-label">Average Churn Risk</div>
              <div className="kpi-sublabel">From churn_risk(%) Field</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Performance Metrics */}
      <div className="dashboard-section">
        <h2>Dynamic Performance Metrics</h2>
        
        <div className="metrics-grid metrics-single-row">
          <div className="metric-card pipeline">
            <h3>📅 Renewal Pipeline Funnel</h3>
            <div className="pipeline-metrics">
              <div className="pipeline-item">
                <span className="pipeline-period">Next 30 Days</span>
                <span className="pipeline-value">{dashboardData.renewalPipeline.next30Days}</span>
              </div>
              <div className="pipeline-item">
                <span className="pipeline-period">Next 60 Days</span>
                <span className="pipeline-value">{dashboardData.renewalPipeline.next60Days}</span>
              </div>
              <div className="pipeline-item">
                <span className="pipeline-period">Next 90 Days</span>
                <span className="pipeline-value">{dashboardData.renewalPipeline.next90Days}</span>
              </div>
            </div>
            <div className="data-source-note">From valid renewal_date values</div>
          </div>

          <div className="metric-card risk-breakdown">
            <h3>🎯 High-Risk Customer Breakdown</h3>
            <div className="tier-risk-grid">
              <div className="tier-risk-item platinum">
                <span>Platinum</span>
                <span className="risk-count">{dashboardData.highRiskByTier.platinum}</span>
              </div>
              <div className="tier-risk-item gold">
                <span>Gold</span>
                <span className="risk-count">{dashboardData.highRiskByTier.gold}</span>
              </div>
              <div className="tier-risk-item silver">
                <span>Silver</span>
                <span className="risk-count">{dashboardData.highRiskByTier.silver}</span>
              </div>
              <div className="tier-risk-item bronze">
                <span>Bronze</span>
                <span className="risk-count">{dashboardData.highRiskByTier.bronze}</span>
              </div>
            </div>
            <div className="data-source-note">Valid tiers with high churn risk</div>
          </div>

          <div className="metric-card cross-sell">
            <h3>💹 Cross-Sell/Upsell Performance</h3>
            <div className="cross-sell-metrics">
              <div className="cross-sell-item">
                <span className="metric-label">Cross-Sell Opportunities</span>
                <span className="metric-value">{dashboardData.crossSellUpsell.crossSellOpportunities}</span>
              </div>
              <div className="cross-sell-item">
                <span className="metric-label">Upsell Potential</span>
                <span className="metric-value">{dashboardData.crossSellUpsell.upsellPotential}</span>
              </div>
              <div className="cross-sell-item">
                <span className="metric-label">Conversion Rate</span>
                <span className="metric-value">{dashboardData.crossSellUpsell.conversionRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Intelligence - All from Policy Holders table, filtered */}
      <div className="dashboard-section">
        <h2>Market Intelligence</h2>
        
        <div className="intelligence-grid">
          <div className="intelligence-card tier-distribution">
            <h3>🏆 Customer Tier Distribution</h3>
            <div className="distribution-chart">
              <div className="tier-bar">
                <div className="tier-label">Platinum</div>
                <div className="tier-bar-container">
                  <div 
                    className="tier-bar-fill platinum" 
                    style={{width: `${(dashboardData.tierDistribution.platinum / Math.max(dashboardData.totalCustomers, 1) * 100)}%`}}
                  ></div>
                  <span className="tier-count">{dashboardData.tierDistribution.platinum}</span>
                </div>
              </div>
              <div className="tier-bar">
                <div className="tier-label">Gold</div>
                <div className="tier-bar-container">
                  <div 
                    className="tier-bar-fill gold" 
                    style={{width: `${(dashboardData.tierDistribution.gold / Math.max(dashboardData.totalCustomers, 1) * 100)}%`}}
                  ></div>
                  <span className="tier-count">{dashboardData.tierDistribution.gold}</span>
                </div>
              </div>
              <div className="tier-bar">
                <div className="tier-label">Silver</div>
                <div className="tier-bar-container">
                  <div 
                    className="tier-bar-fill silver" 
                    style={{width: `${(dashboardData.tierDistribution.silver / Math.max(dashboardData.totalCustomers, 1) * 100)}%`}}
                  ></div>
                  <span className="tier-count">{dashboardData.tierDistribution.silver}</span>
                </div>
              </div>
              <div className="tier-bar">
                <div className="tier-label">Bronze</div>
                <div className="tier-bar-container">
                  <div 
                    className="tier-bar-fill bronze" 
                    style={{width: `${(dashboardData.tierDistribution.bronze / Math.max(dashboardData.totalCustomers, 1) * 100)}%`}}
                  ></div>
                  <span className="tier-count">{dashboardData.tierDistribution.bronze}</span>
                </div>
              </div>
            </div>
            <div className="data-source-note">Valid tiers only (unknown filtered)</div>
          </div>

          <div className="intelligence-card clv-bands">
            <h3>💎 CLV Band Distribution</h3>
            <div className="clv-band-chart">
              <div className="clv-band high-clv">
                <div className="band-label">High CLV (Over $50K)</div>
                <div className="band-value">{dashboardData.clvBands.high}</div>
                <div className="band-percentage">
                  {Math.round(dashboardData.clvBands.high / Math.max(dashboardData.totalCustomers, 1) * 100)}%
                </div>
              </div>
              <div className="clv-band medium-clv">
                <div className="band-label">Medium CLV ($20K-$50K)</div>
                <div className="band-value">{dashboardData.clvBands.medium}</div>
                <div className="band-percentage">
                  {Math.round(dashboardData.clvBands.medium / Math.max(dashboardData.totalCustomers, 1) * 100)}%
                </div>
              </div>
              <div className="clv-band low-clv">
                <div className="band-label">Low CLV (Under $20K)</div>
                <div className="band-value">{dashboardData.clvBands.low}</div>
                <div className="band-percentage">
                  {Math.round(dashboardData.clvBands.low / Math.max(dashboardData.totalCustomers, 1) * 100)}%
                </div>
              </div>
            </div>
            <div className="data-source-note">Valid lifetime_value data only</div>
          </div>

          <div className="intelligence-card risk-analysis">
            <h3>⚠️ Risk Factor Analysis</h3>
            <div className="risk-factors">
              <div className="risk-factor">
                <div className="risk-type">Credit Risk</div>
                <div className="risk-count">{dashboardData.riskAnalysis.creditRisk}</div>
                <div className="risk-description">Credit Score Under 650</div>
              </div>
              <div className="risk-factor">
                <div className="risk-type">Property Risk</div>
                <div className="risk-count">{dashboardData.riskAnalysis.propertyRisk}</div>
                <div className="risk-description">Delinquency Over 2</div>
              </div>
              <div className="risk-factor">
                <div className="risk-type">Combined Risk</div>
                <div className="risk-count">{dashboardData.riskAnalysis.combinedRisk}</div>
                <div className="risk-description">Multiple Risk Factors</div>
              </div>
            </div>
            <div className="data-source-note">Valid numeric data only</div>
          </div>

          {/* Product Performance Analysis - filtered */}
          <div className="intelligence-card product-performance-horizontal">
            <h3>📊 Product Performance Analysis</h3>
            {dashboardData.productPerformanceData.length > 0 ? (
              <div className="product-horizontal-scroll">
                {dashboardData.productPerformanceData.slice(0, 6).map((product, index) => {
                  const productName = display(product.product);
                  // Skip if product name is unknown or invalid
                  if (!isValidValue(productName) || productName === 'Unknown') return null;
                  
                  return (
                    <div key={index} className="product-card">
                      <div className="product-card-header">
                        <div className="product-card-name">{productName}</div>
                        <div className={`frequency-badge ${display(product.purchase_frequency) || 'competitive'}`}>
                          {display(product.purchase_frequency) || 'Competitive'}
                        </div>
                      </div>
                      <div className="product-card-metrics">
                        <div className="product-metric">
                          <div className="metric-label-small">Premium vs Competitor</div>
                          <div className={`metric-value-small ${(display(product.premium_vs_competitor) || '').startsWith('+') ? 'positive' : 'negative'}`}>
                            {display(product.premium_vs_competitor) || '0%'}
                          </div>
                        </div>
                        <div className="product-metric">
                          <div className="metric-label-small">Revenue per Customer</div>
                          <div className="metric-value-small">
                            {display(product.revenue_per_customer) || '0K'}
                          </div>
                        </div>
                        <div className="product-metric">
                          <div className="metric-label-small">Campaign Uplift</div>
                          <div className="metric-value-small positive">
                            {display(product.campaign_uplift) || '0%'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-product-data">
                <p>No valid product performance data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data Source Footer */}
      <div className="dashboard-footer">
        <div className="data-source-details">
          <strong>📋 Clean Data Sources & Field Mapping:</strong>
          <ul>
            <li><strong>Total Customers:</strong> COUNT(*) from x_hete_clv_maximiz_policy_holders</li>
            <li><strong>High-Value Customers:</strong> % of valid tier IN ('Platinum', 'Gold')</li>
            <li><strong>Average Lifetime Value:</strong> AVG(valid lifetime_value) from policy holders</li>
            <li><strong>Average Churn Risk:</strong> AVG(valid churn_risk) from policy holders</li>
            <li><strong>Data Quality:</strong> All "unknown" and invalid values filtered</li>
          </ul>
        </div>
        <button onClick={loadComprehensiveDashboardData} className="refresh-data-btn">
          🔄 Refresh Clean Data from Policy Holders
        </button>
      </div>
    </div>
  );
}