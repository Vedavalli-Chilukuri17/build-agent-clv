import React from 'react';
import './PerformanceMetrics.css';

export default function PerformanceMetrics({ data, onMetricClick }) {
  const renderRenewalPipelineFunnel = () => {
    if (!data.renewalFunnel) return null;

    const { thirtyDays, sixtyDays, ninetyDays } = data.renewalFunnel;
    const maxCount = Math.max(thirtyDays.length, sixtyDays.length, ninetyDays.length);

    const funnelData = [
      {
        period: '30-Day Window',
        count: thirtyDays.length,
        value: thirtyDays.reduce((sum, p) => {
          const lifetimeValue = parseFloat(p.lifetime_value) || 0;
          const clv = parseFloat(p.clv) || 0;
          return sum + Math.max(lifetimeValue, clv);
        }, 0),
        urgency: 'high',
        width: maxCount > 0 ? (thirtyDays.length / maxCount) * 100 : 0
      },
      {
        period: '60-Day Window', 
        count: sixtyDays.length,
        value: sixtyDays.reduce((sum, p) => {
          const lifetimeValue = parseFloat(p.lifetime_value) || 0;
          const clv = parseFloat(p.clv) || 0;
          return sum + Math.max(lifetimeValue, clv);
        }, 0),
        urgency: 'medium',
        width: maxCount > 0 ? (sixtyDays.length / maxCount) * 100 : 0
      },
      {
        period: '90-Day Window',
        count: ninetyDays.length, 
        value: ninetyDays.reduce((sum, p) => {
          const lifetimeValue = parseFloat(p.lifetime_value) || 0;
          const clv = parseFloat(p.clv) || 0;
          return sum + Math.max(lifetimeValue, clv);
        }, 0),
        urgency: 'low',
        width: maxCount > 0 ? (ninetyDays.length / maxCount) * 100 : 0
      }
    ];

    return (
      <div className="renewal-pipeline-funnel">
        <h4>Renewal Pipeline Funnel (30/60/90-day windows)</h4>
        <div className="funnel-container">
          {funnelData.map((stage, index) => (
            <div 
              key={stage.period}
              className={`funnel-stage ${stage.urgency}`}
              onClick={() => onMetricClick && onMetricClick('renewal-funnel', stage)}
            >
              <div className="stage-header">
                <span className="stage-label">{stage.period}</span>
                <span className="stage-count">{stage.count} renewals</span>
              </div>
              
              <div className="stage-bar-container">
                <div 
                  className="stage-bar"
                  style={{ width: `${Math.max(stage.width, 10)}%` }}
                ></div>
              </div>
              
              <div className="stage-value">
                ${stage.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderHighRiskSnapshots = () => {
    if (!data.highRiskCustomers) return null;

    const { total, tierBreakdown } = data.highRiskCustomers;
    const tiers = Object.entries(tierBreakdown || {});

    return (
      <div className="high-risk-snapshots">
        <h4>High-Risk Customer Snapshots with Tier Breakdown</h4>
        <div className="risk-summary">
          <div className="total-risk">
            <span className="risk-count">{total}</span>
            <span className="risk-label">High-Risk Customers</span>
          </div>
        </div>
        
        <div className="tier-breakdown">
          <h5>Risk by Tier</h5>
          <div className="tier-risk-grid">
            {tiers.map(([tier, count]) => (
              <div 
                key={tier}
                className={`tier-risk-card ${tier.toLowerCase()}`}
                onClick={() => onMetricClick && onMetricClick('high-risk-tier', { tier, count })}
              >
                <div className="tier-name">{tier}</div>
                <div className="tier-risk-count">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCoverageGapOpportunities = () => {
    const opportunities = data.crossSellOpportunities || 0;
    const gapDetails = data.coverageGapDetails || [];
    
    return (
      <div className="coverage-gap-opportunities">
        <h4>Coverage Gap Opportunities (Cross-sell identification)</h4>
        <div 
          className="opportunity-card"
          onClick={() => onMetricClick && onMetricClick('cross-sell-opportunities', { opportunities, gapDetails })}
        >
          <div className="opportunity-count">
            <span className="count">{opportunities}</span>
            <span className="label">Cross-sell Candidates</span>
          </div>
          <div className="opportunity-criteria">
            <div className="criteria-item">
              <span className="criteria-label">High Engagement</span>
              <span className="criteria-value">>50 score</span>
            </div>
            <div className="criteria-item">
              <span className="criteria-label">Low Churn Risk</span>
              <span className="criteria-value">≤50%</span>
            </div>
            <div className="criteria-item">
              <span className="criteria-label">Missing Coverage</span>
              <span className="criteria-value">Identified</span>
            </div>
          </div>
        </div>
        
        {gapDetails.length > 0 && (
          <div className="gap-details">
            <h5>Top Opportunities</h5>
            <div className="gap-list">
              {gapDetails.slice(0, 5).map((detail, index) => (
                <div key={index} className="gap-item">
                  <span className="customer-name">{detail.name}</span>
                  <span className="customer-tier">{detail.tier}</span>
                  <span className="missing-coverage">{detail.missingCoverage}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderChannelPerformance = () => {
    if (!data.channelPerformance) return null;

    const channels = Object.entries(data.channelPerformance);
    const maxConversion = Math.max(...channels.map(([, data]) => data.conversions || 0));
    const maxEngagement = Math.max(...channels.map(([, data]) => data.engagement || 0));

    return (
      <div className="channel-performance">
        <h4>Channel Performance Analysis (App, Email, Call, Advisor)</h4>
        <div className="channel-grid">
          {channels.map(([channel, metrics]) => (
            <div 
              key={channel}
              className="channel-card"
              onClick={() => onMetricClick && onMetricClick('channel-performance', { channel, metrics })}
            >
              <div className="channel-header">
                <span className="channel-name">{channel}</span>
                <div className="channel-icon">
                  {channel === 'Mobile App' && '📱'}
                  {channel === 'Email' && '📧'}
                  {channel === 'Phone' && '📞'}
                  {channel === 'Advisor' && '👤'}
                </div>
              </div>
              
              <div className="channel-metrics">
                <div className="metric">
                  <span className="metric-label">Conversion</span>
                  <div className="metric-bar">
                    <div 
                      className="metric-fill conversion"
                      style={{ width: maxConversion > 0 ? `${(metrics.conversions / maxConversion) * 100}%` : '0%' }}
                    ></div>
                    <span className="metric-value">{metrics.conversions || 0}%</span>
                  </div>
                </div>
                
                <div className="metric">
                  <span className="metric-label">Engagement</span>
                  <div className="metric-bar">
                    <div 
                      className="metric-fill engagement"
                      style={{ width: maxEngagement > 0 ? `${(metrics.engagement / maxEngagement) * 100}%` : '0%' }}
                    ></div>
                    <span className="metric-value">{metrics.engagement || 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCrossSellUpsellTracking = () => {
    if (!data.crossSellUpsellPerformance) return null;

    const { totalCampaigns, reachSum, conversionRate } = data.crossSellUpsellPerformance;
    const estimatedRevenue = Math.floor(reachSum * (conversionRate / 100) * 2500); // $2500 avg per conversion

    return (
      <div className="cross-sell-upsell-tracking">
        <h4>Cross-Sell/Upsell Performance Tracking</h4>
        <div className="upsell-grid">
          <div 
            className="upsell-metric"
            onClick={() => onMetricClick && onMetricClick('cross-sell-campaigns', { totalCampaigns })}
          >
            <div className="metric-header">
              <span className="metric-title">Active Campaigns</span>
              <span className="metric-trend">Live</span>
            </div>
            <div className="metric-value">{totalCampaigns}</div>
          </div>
          
          <div 
            className="upsell-metric"
            onClick={() => onMetricClick && onMetricClick('cross-sell-reach', { reachSum })}
          >
            <div className="metric-header">
              <span className="metric-title">Total Reach</span>
              <span className="metric-trend">Customers</span>
            </div>
            <div className="metric-value">{reachSum.toLocaleString()}</div>
          </div>
          
          <div 
            className="upsell-metric revenue"
            onClick={() => onMetricClick && onMetricClick('cross-sell-conversion', { conversionRate })}
          >
            <div className="metric-header">
              <span className="metric-title">Conversion Rate</span>
              <span className="metric-trend">Est.</span>
            </div>
            <div className="metric-value">{conversionRate.toFixed(1)}%</div>
          </div>
          
          <div 
            className="upsell-metric revenue"
            onClick={() => onMetricClick && onMetricClick('cross-sell-revenue', { estimatedRevenue })}
          >
            <div className="metric-header">
              <span className="metric-title">Est. Revenue</span>
              <span className="metric-trend">Projected</span>
            </div>
            <div className="metric-value">${estimatedRevenue.toLocaleString()}</div>
          </div>
        </div>
      </div>
    );
  };

  if (!data || Object.keys(data).length === 0) {
    return (
      <section className="performance-metrics">
        <h2>Dynamic Performance Metrics</h2>
        <div className="metrics-loading">Loading performance metrics...</div>
      </section>
    );
  }

  return (
    <section className="performance-metrics">
      <h2>Dynamic Performance Metrics</h2>
      
      <div className="metrics-grid">
        <div className="metrics-column">
          {renderRenewalPipelineFunnel()}
          {renderCoverageGapOpportunities()}
        </div>
        
        <div className="metrics-column">
          {renderHighRiskSnapshots()}
          {renderCrossSellUpsellTracking()}
        </div>
        
        <div className="metrics-column full-width">
          {renderChannelPerformance()}
        </div>
      </div>
    </section>
  );
}