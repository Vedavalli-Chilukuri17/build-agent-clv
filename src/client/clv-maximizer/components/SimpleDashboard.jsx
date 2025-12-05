import React, { useState, useEffect } from 'react';
import { display, value } from '../utils/fields.js';
import './SimpleDashboard.css';

export default function SimpleDashboard() {
  const [dashboardData, setDashboardData] = useState({
    // Basic KPIs sourced from Policy Holders table
    totalCustomers: 0,
    highValueCustomers: 0,
    avgCLV: 0,
    averageChurnRisk: 0, // Changed to average churn risk
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

  const loadComprehensiveDashboardData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading dashboard data from Policy Holders table...');
      
      // Primary data source: Policy Holders table
      const policyHolders = await fetchPolicyHoldersData();
      console.log(`✅ Successfully loaded ${policyHolders.length} policy holder records from x_hete_clv_maximiz_policy_holders`);
      
      // Secondary data for product performance
      const productPerformance = await fetchTableData('x_hete_clv_maximiz_competitor_benchmark');
      console.log(`📊 Loaded ${productPerformance.length} product performance records`);

      if (policyHolders.length === 0) {
        console.warn('⚠️ No policy holders found in the table. Dashboard will show zero counts.');
        setDebugInfo({ error: 'No policy holders data found' });
      }

      // Calculate Total Customers - DIRECTLY from Policy Holders table
      const totalCustomers = policyHolders.length;
      console.log(`👥 Total Customers calculated from Policy Holders table: ${totalCustomers}`);
      
      // Calculate High-Value Customers (Platinum and Gold tiers)
      const highValueCustomers = policyHolders.filter(p => {
        const tier = display(p.tier);
        const isHighValue = tier === 'Platinum' || tier === 'Gold' || tier === 'platinum' || tier === 'gold';
        return isHighValue;
      }).length;
      console.log(`⭐ High-Value Customers (Platinum & Gold): ${highValueCustomers}`);

      // Calculate Average CLV using the "clv" field (CLV 12 Months) from Policy Holders
      const avgCLV = policyHolders.length > 0
        ? policyHolders.reduce((sum, p) => {
            const clv12Months = parseFloat(display(p.clv)) || 0;
            return sum + clv12Months;
          }, 0) / policyHolders.length
        : 0;
      console.log(`💰 Average CLV calculated: $${Math.round(avgCLV)}`);

      // Calculate AVERAGE Churn Risk from churn_risk field in Policy Holders table
      console.log('🎯 CALCULATING AVERAGE CHURN RISK FROM CHURN_RISK FIELD:');
      
      let averageChurnRisk = 0;
      let validChurnRiskCount = 0;
      let churnRiskValues = [];
      
      // Analyze churn risk field values
      policyHolders.forEach(p => {
        const churnRiskRaw = display(p.churn_risk);
        const churnRiskNum = parseFloat(churnRiskRaw);
        
        if (!isNaN(churnRiskNum) && churnRiskRaw !== null && churnRiskRaw !== undefined && churnRiskRaw !== '') {
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
          sampleValues: churnRiskValues.slice(0, 10)
        });
      } else {
        console.warn('⚠️ No valid churn_risk values found in Policy Holders data');
        averageChurnRisk = 0;
        
        setDebugInfo({
          totalCustomers,
          validChurnRiskCount: 0,
          error: 'No valid churn_risk values found'
        });
      }

      // Calculate High-Risk Customers (for breakdown by tier) - customers with churn risk over 60%
      const highRiskCustomers = policyHolders.filter(p => {
        const churnRisk = parseFloat(display(p.churn_risk)) || 0;
        return churnRisk > 60;
      }).length;

      // Calculate Renewal Pipeline (30/60/90 days) from Policy Holders renewal dates
      const now = new Date();
      const next30Days = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      const next60Days = new Date(now.getTime() + (60 * 24 * 60 * 60 * 1000));
      const next90Days = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000));

      const renewalPipeline = {
        next30Days: policyHolders.filter(p => {
          const renewalDate = display(p.renewal_date);
          if (!renewalDate) return false;
          const rDate = new Date(renewalDate);
          return rDate >= now && rDate <= next30Days;
        }).length,
        next60Days: policyHolders.filter(p => {
          const renewalDate = display(p.renewal_date);
          if (!renewalDate) return false;
          const rDate = new Date(renewalDate);
          return rDate >= now && rDate <= next60Days;
        }).length,
        next90Days: policyHolders.filter(p => {
          const renewalDate = display(p.renewal_date);
          if (!renewalDate) return false;
          const rDate = new Date(renewalDate);
          return rDate >= now && rDate <= next90Days;
        }).length
      };
      console.log('📅 Renewal Pipeline calculated:', renewalPipeline);

      // Calculate Tier Distribution from Policy Holders
      const tierDistribution = {
        platinum: 0,
        gold: 0,
        silver: 0,
        bronze: 0
      };

      policyHolders.forEach(p => {
        const tier = display(p.tier)?.toLowerCase();
        if (tier && tierDistribution.hasOwnProperty(tier)) {
          tierDistribution[tier]++;
        }
      });
      console.log('🏆 Tier Distribution:', tierDistribution);

      // Calculate High-Risk Customers by Tier (using churn_risk over 60%)
      console.log('🎯 CALCULATING HIGH-RISK CUSTOMERS BY TIER (churn risk over 60%):');
      const highRiskByTier = {
        platinum: 0,
        gold: 0,
        silver: 0,
        bronze: 0
      };

      policyHolders.forEach(p => {
        const tier = display(p.tier)?.toLowerCase();
        const churnRisk = parseFloat(display(p.churn_risk)) || 0;
        
        if (churnRisk > 60 && tier && highRiskByTier.hasOwnProperty(tier)) {
          highRiskByTier[tier]++;
        }
      });
      
      console.log('🎯 High-Risk by Tier (churn risk over 60%):', highRiskByTier);

      // Calculate CLV Band Distribution based on Policy Holders lifetime_value
      const clvBands = {
        high: policyHolders.filter(p => {
          const ltv = parseFloat(display(p.lifetime_value)) || 0;
          return ltv > 50000;
        }).length,
        medium: policyHolders.filter(p => {
          const ltv = parseFloat(display(p.lifetime_value)) || 0;
          return ltv >= 20000 && ltv <= 50000;
        }).length,
        low: policyHolders.filter(p => {
          const ltv = parseFloat(display(p.lifetime_value)) || 0;
          return ltv < 20000;
        }).length
      };
      console.log('💎 CLV Bands:', clvBands);

      // Calculate Risk Factor Analysis from Policy Holders credit and delinquency data
      const riskAnalysis = {
        creditRisk: policyHolders.filter(p => {
          const creditScore = parseInt(display(p.credit_score)) || 0;
          return creditScore < 650;
        }).length,
        propertyRisk: policyHolders.filter(p => {
          const delinquency = parseInt(display(p.delinquency_12m)) || 0;
          return delinquency > 2;
        }).length,
        combinedRisk: policyHolders.filter(p => {
          const creditScore = parseInt(display(p.credit_score)) || 0;
          const delinquency = parseInt(display(p.delinquency_12m)) || 0;
          const churnRisk = parseFloat(display(p.churn_risk)) || 0;
          return creditScore < 650 || delinquency > 2 || churnRisk > 70;
        }).length
      };
      console.log('⚠️ Risk Analysis:', riskAnalysis);

      // Update dashboard data with calculated metrics
      setDashboardData({
        totalCustomers,
        highValueCustomers,
        avgCLV: Math.round(avgCLV),
        averageChurnRisk: Math.round(averageChurnRisk * 100) / 100, // Store average churn risk
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
      console.log('✅ Dashboard data successfully updated from Policy Holders table');

    } catch (error) {
      console.error('❌ Error loading comprehensive dashboard data:', error);
      setDebugInfo({ error: error.message });
      // Set default values to prevent UI errors
      setDashboardData(prevData => ({
        ...prevData,
        totalCustomers: 0,
        highValueCustomers: 0,
        avgCLV: 0,
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
        console.log('📋 Sample record with churn_risk field:', {
          churn_risk: policyHolders[0].churn_risk,
          risk: policyHolders[0].risk,
          tier: policyHolders[0].tier
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
        <p className="loading-subtext">Calculating average churn risk...</p>
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
          <h3>🔍 Churn Risk Analysis</h3>
          <div className="debug-content">
            {debugInfo.error ? (
              <div className="debug-error">❌ Error: {debugInfo.error}</div>
            ) : (
              <div className="debug-success">
                <p><strong>Total Customers:</strong> {debugInfo.totalCustomers}</p>
                <p><strong>Valid Churn Risk Records:</strong> {debugInfo.validChurnRiskCount}</p>
                <p><strong>Average Churn Risk:</strong> {debugInfo.averageChurnRisk}%</p>
                {debugInfo.minChurnRisk !== undefined && (
                  <>
                    <p><strong>Range:</strong> {debugInfo.minChurnRisk}% - {debugInfo.maxChurnRisk}%</p>
                    <p><strong>Sample Values:</strong> {debugInfo.sampleValues?.join(', ')}%</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

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
            <div className="data-source-note">From renewal_date field</div>
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
            <div className="data-source-note">Customers with high churn risk</div>
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

      {/* Market Intelligence - All from Policy Holders table */}
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
            <div className="data-source-note">From tier field in Policy Holders</div>
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
            <div className="data-source-note">From lifetime_value field</div>
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
            <div className="data-source-note">From credit_score & delinquency_12m fields</div>
          </div>

          {/* Product Performance Analysis in Single Row Format */}
          <div className="intelligence-card product-performance-horizontal">
            <h3>📊 Product Performance Analysis</h3>
            {dashboardData.productPerformanceData.length > 0 ? (
              <div className="product-horizontal-scroll">
                {dashboardData.productPerformanceData.slice(0, 6).map((product, index) => (
                  <div key={index} className="product-card">
                    <div className="product-card-header">
                      <div className="product-card-name">{display(product.product)}</div>
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
                ))}
              </div>
            ) : (
              <div className="no-product-data">
                <p>Loading product performance data...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data Source Footer */}
      <div className="dashboard-footer">
        <div className="data-source-details">
          <strong>📋 Data Sources & Field Mapping:</strong>
          <ul>
            <li><strong>Total Customers:</strong> COUNT(*) from x_hete_clv_maximiz_policy_holders</li>
            <li><strong>Average Churn Risk:</strong> AVG(churn_risk) from x_hete_clv_maximiz_policy_holders</li>
            <li><strong>High-Value Customers:</strong> tier IN ('Platinum', 'Gold') from policy holders</li>
            <li><strong>Average CLV:</strong> AVG(clv) from policy holders</li>
            <li><strong>Risk Analysis:</strong> credit_score, delinquency_12m from policy holders</li>
          </ul>
        </div>
        <button onClick={loadComprehensiveDashboardData} className="refresh-data-btn">
          🔄 Refresh Data from Policy Holders Table
        </button>
      </div>
    </div>
  );
}