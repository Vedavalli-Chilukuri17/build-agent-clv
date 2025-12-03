import React, { useState, useEffect } from 'react';
import { display, value } from '../utils/fields.js';
import './SimpleDashboard.css';

export default function SimpleDashboard() {
  const [dashboardData, setDashboardData] = useState({
    // Basic KPIs
    totalCustomers: 0,
    highValueCustomers: 0,
    avgCLV: 0,
    churnRisk: 0,
    
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
    
    // Channel Performance
    channelPerformance: {
      email: { count: 0, avgCLV: 0 },
      mobileApp: { count: 0, avgCLV: 0 },
      phone: { count: 0, avgCLV: 0 }
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
    
    // CLV Band Distribution
    clvBands: {
      high: 0, // >$50k
      medium: 0, // $20k-$50k
      low: 0 // <$20k
    },
    
    // Risk Factor Analysis
    riskAnalysis: {
      creditRisk: 0,
      propertyRisk: 0,
      combinedRisk: 0
    },
    
    // Competitor Benchmark
    competitorData: []
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComprehensiveDashboardData();
  }, []);

  const loadComprehensiveDashboardData = async () => {
    setLoading(true);
    try {
      // Load all required data
      const [policyHolders, competitorBenchmarks] = await Promise.all([
        fetchTableData('x_hete_clv_maximiz_policy_holders'),
        fetchTableData('x_hete_clv_maximiz_competitor_benchmark')
      ]);

      // Calculate basic metrics
      const totalCustomers = policyHolders.length;
      const highValueCustomers = policyHolders.filter(p => {
        const tier = display(p.tier);
        return tier === 'Platinum' || tier === 'Gold';
      }).length;

      // Calculate Average CLV using the "clv" field (CLV 12 Months)
      const avgCLV = policyHolders.length > 0
        ? policyHolders.reduce((sum, p) => {
            const clv12Months = parseFloat(display(p.clv)) || 0;
            return sum + clv12Months;
          }, 0) / policyHolders.length
        : 0;

      const highRiskCustomers = policyHolders.filter(p => {
        const churnRisk = parseFloat(display(p.churn_risk)) || 0;
        return churnRisk > 60;
      }).length;

      const churnRisk = totalCustomers > 0 ? (highRiskCustomers / totalCustomers) * 100 : 0;

      // Calculate Renewal Pipeline (30/60/90 days)
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

      // Calculate High-Risk Customers by Tier
      const highRiskByTier = {
        platinum: 0,
        gold: 0,
        silver: 0,
        bronze: 0
      };

      policyHolders.forEach(p => {
        const churnRisk = parseFloat(display(p.churn_risk)) || 0;
        const tier = display(p.tier)?.toLowerCase();
        if (churnRisk > 60 && tier && highRiskByTier.hasOwnProperty(tier)) {
          highRiskByTier[tier]++;
        }
      });

      // Calculate Channel Performance
      const channelPerformance = {
        email: { count: 0, avgCLV: 0, total: 0 },
        mobileApp: { count: 0, avgCLV: 0, total: 0 },
        phone: { count: 0, avgCLV: 0, total: 0 }
      };

      policyHolders.forEach(p => {
        const channel = display(p.preferred_channel);
        const clv = parseFloat(display(p.clv)) || 0;
        
        switch(channel) {
          case 'Email':
            channelPerformance.email.count++;
            channelPerformance.email.total += clv;
            break;
          case 'Mobile App':
            channelPerformance.mobileApp.count++;
            channelPerformance.mobileApp.total += clv;
            break;
          case 'Phone':
            channelPerformance.phone.count++;
            channelPerformance.phone.total += clv;
            break;
        }
      });

      // Calculate average CLV per channel
      Object.keys(channelPerformance).forEach(channel => {
        const data = channelPerformance[channel];
        data.avgCLV = data.count > 0 ? data.total / data.count : 0;
      });

      // Calculate Tier Distribution
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

      // Calculate CLV Band Distribution
      const clvBands = {
        high: 0,
        medium: 0,
        low: 0
      };

      policyHolders.forEach(p => {
        const clv = parseFloat(display(p.clv)) || 0;
        if (clv > 50000) {
          clvBands.high++;
        } else if (clv >= 20000) {
          clvBands.medium++;
        } else {
          clvBands.low++;
        }
      });

      // Calculate Risk Factor Analysis
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

      setDashboardData({
        totalCustomers,
        highValueCustomers,
        avgCLV: Math.round(avgCLV),
        churnRisk: Math.round(churnRisk * 100) / 100,
        renewalPipeline,
        highRiskByTier,
        channelPerformance,
        crossSellUpsell: {
          crossSellOpportunities: 45,
          upsellPotential: 32,
          conversionRate: 18.5
        },
        tierDistribution,
        clvBands,
        riskAnalysis,
        competitorData: competitorBenchmarks
      });

    } catch (error) {
      console.error('Error loading comprehensive dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <p>Loading Advanced Analytics Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="comprehensive-dashboard">
      <div className="dashboard-header">
        <h1>CLV Analytics Dashboard</h1>
        <p>Comprehensive Customer Intelligence & Performance Metrics</p>
      </div>

      {/* Basic KPIs */}
      <div className="dashboard-section">
        <h2>Key Performance Indicators</h2>
        <div className="simple-kpi-grid">
          <div className="simple-kpi-card">
            <div className="kpi-icon">👥</div>
            <div className="kpi-content">
              <div className="kpi-value">{dashboardData.totalCustomers.toLocaleString()}</div>
              <div className="kpi-label">Total Customers</div>
            </div>
          </div>

          <div className="simple-kpi-card high-value">
            <div className="kpi-icon">⭐</div>
            <div className="kpi-content">
              <div className="kpi-value">{dashboardData.highValueCustomers.toLocaleString()}</div>
              <div className="kpi-label">High-Value Customers</div>
              <div className="kpi-sublabel">Platinum & Gold</div>
            </div>
          </div>

          <div className="simple-kpi-card clv">
            <div className="kpi-icon">💰</div>
            <div className="kpi-content">
              <div className="kpi-value">${dashboardData.avgCLV.toLocaleString()}</div>
              <div className="kpi-label">Average CLV</div>
              <div className="kpi-sublabel">12 Months</div>
            </div>
          </div>

          <div className="simple-kpi-card risk">
            <div className="kpi-icon">⚠️</div>
            <div className="kpi-content">
              <div className="kpi-value">{dashboardData.churnRisk}%</div>
              <div className="kpi-label">Churn Risk</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Performance Metrics */}
      <div className="dashboard-section">
        <h2>Dynamic Performance Metrics</h2>
        
        {/* Renewal Pipeline Funnel */}
        <div className="metrics-grid">
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
          </div>

          {/* High-Risk Customer Snapshots */}
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
          </div>

          {/* Channel Performance */}
          <div className="metric-card channel-performance">
            <h3>📱 Channel Performance Analysis</h3>
            <div className="channel-grid">
              <div className="channel-item">
                <div className="channel-name">📧 Email</div>
                <div className="channel-stats">
                  <span>{dashboardData.channelPerformance.email.count} customers</span>
                  <span>${Math.round(dashboardData.channelPerformance.email.avgCLV).toLocaleString()} avg CLV</span>
                </div>
              </div>
              <div className="channel-item">
                <div className="channel-name">📱 Mobile App</div>
                <div className="channel-stats">
                  <span>{dashboardData.channelPerformance.mobileApp.count} customers</span>
                  <span>${Math.round(dashboardData.channelPerformance.mobileApp.avgCLV).toLocaleString()} avg CLV</span>
                </div>
              </div>
              <div className="channel-item">
                <div className="channel-name">📞 Phone</div>
                <div className="channel-stats">
                  <span>{dashboardData.channelPerformance.phone.count} customers</span>
                  <span>${Math.round(dashboardData.channelPerformance.phone.avgCLV).toLocaleString()} avg CLV</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cross-Sell/Upsell Performance */}
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

      {/* Market Intelligence */}
      <div className="dashboard-section">
        <h2>Market Intelligence</h2>
        
        <div className="intelligence-grid">
          {/* Customer Tier Distribution */}
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
          </div>

          {/* CLV Band Distribution */}
          <div className="intelligence-card clv-bands">
            <h3>💎 CLV Band Distribution</h3>
            <div className="clv-band-chart">
              <div className="clv-band high-clv">
                <div className="band-label">High CLV (&gt;$50K)</div>
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
                <div className="band-label">Low CLV (&lt;$20K)</div>
                <div className="band-value">{dashboardData.clvBands.low}</div>
                <div className="band-percentage">
                  {Math.round(dashboardData.clvBands.low / Math.max(dashboardData.totalCustomers, 1) * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Risk Factor Analysis */}
          <div className="intelligence-card risk-analysis">
            <h3>⚠️ Risk Factor Analysis</h3>
            <div className="risk-factors">
              <div className="risk-factor">
                <div className="risk-type">Credit Risk</div>
                <div className="risk-count">{dashboardData.riskAnalysis.creditRisk}</div>
                <div className="risk-description">Credit Score &lt; 650</div>
              </div>
              <div className="risk-factor">
                <div className="risk-type">Property Risk</div>
                <div className="risk-count">{dashboardData.riskAnalysis.propertyRisk}</div>
                <div className="risk-description">Delinquency &gt; 2</div>
              </div>
              <div className="risk-factor">
                <div className="risk-type">Combined Risk</div>
                <div className="risk-count">{dashboardData.riskAnalysis.combinedRisk}</div>
                <div className="risk-description">Multiple Risk Factors</div>
              </div>
            </div>
          </div>

          {/* Product Benchmarking */}
          <div className="intelligence-card competitor-benchmark">
            <h3>🏢 Product Benchmarking vs Competitors</h3>
            {dashboardData.competitorData.length > 0 ? (
              <div className="competitor-table">
                <div className="competitor-header">
                  <span>Competitor</span>
                  <span>Market Share</span>
                  <span>Avg Premium</span>
                  <span>Renewal Rate</span>
                </div>
                {dashboardData.competitorData.slice(0, 5).map((competitor, index) => (
                  <div key={index} className="competitor-row">
                    <span className="competitor-name">{display(competitor.competitor_name)}</span>
                    <span className="market-share">{parseFloat(display(competitor.market_share) || 0).toFixed(1)}%</span>
                    <span className="avg-premium">${parseFloat(display(competitor.avg_premium) || 0).toLocaleString()}</span>
                    <span className="renewal-rate">{parseFloat(display(competitor.renewal_rate) || 0).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-competitor-data">
                <p>No competitor benchmark data available.</p>
                <p>Add competitor data to see market comparisons.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}