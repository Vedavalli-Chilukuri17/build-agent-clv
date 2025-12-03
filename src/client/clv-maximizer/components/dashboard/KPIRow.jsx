import React from 'react';
import './KPIRow.css';

export default function KPIRow({ data, onKpiClick }) {
  const getTrendIcon = (trend) => {
    if (!trend) return '→';
    if (trend.startsWith('+')) return '↗️';
    if (trend.startsWith('-')) return '↘️';
    return '→';
  };

  const getTrendClass = (trend) => {
    if (!trend) return 'neutral';
    if (trend.startsWith('+')) return 'positive';
    if (trend.startsWith('-')) return 'negative';
    return 'neutral';
  };

  const renderKPICard = (title, value, unit, trend, target, color, key) => (
    <div 
      key={key}
      className={`kpi-card ${color}`}
      onClick={() => onKpiClick && onKpiClick(key)}
    >
      <div className="kpi-header">
        <h3 className="kpi-title">{title}</h3>
        {trend && (
          <div className={`kpi-trend ${getTrendClass(trend)}`}>
            {getTrendIcon(trend)} {trend}
          </div>
        )}
      </div>
      
      <div className="kpi-value">
        <span className="value">{typeof value === 'number' ? value.toFixed(1) : value}</span>
        {unit && <span className="unit">{unit}</span>}
      </div>
      
      {target && (
        <div className="kpi-target">
          Target: {target}{unit}
        </div>
      )}
      
      <div className="kpi-progress">
        <div 
          className="progress-bar"
          style={{ 
            width: target ? `${Math.min((parseFloat(value) / target) * 100, 100)}%` : '100%' 
          }}
        ></div>
      </div>
    </div>
  );

  const renderCLVByTierCards = () => {
    const tiers = ['Platinum', 'Gold', 'Silver', 'Bronze'];
    const tierColors = {
      'Platinum': 'platinum',
      'Gold': 'gold', 
      'Silver': 'silver',
      'Bronze': 'bronze'
    };

    return tiers.map(tier => {
      const clvValue = data.clvByTier?.[tier] || 0;
      return renderKPICard(
        `${tier} CLV`,
        clvValue,
        '',
        null,
        null,
        tierColors[tier],
        `clv-${tier.toLowerCase()}`
      );
    });
  };

  const renderProjectedRenewalsCard = () => {
    const projectedData = data.projectedRenewals || {};
    const confidencePercentage = projectedData.count > 0 
      ? (projectedData.confidence / projectedData.count * 100).toFixed(0)
      : 0;

    return (
      <div 
        className="kpi-card projected-renewals"
        onClick={() => onKpiClick && onKpiClick('projected-renewals')}
      >
        <div className="kpi-header">
          <h3 className="kpi-title">Projected Renewals (30d)</h3>
          <div className="confidence-score">
            Confidence: {confidencePercentage}%
          </div>
        </div>
        
        <div className="projected-renewals-content">
          <div className="renewal-count">
            <span className="value">{projectedData.count || 0}</span>
            <span className="unit">renewals</span>
          </div>
          
          <div className="renewal-value">
            <span className="value">${(projectedData.value || 0).toLocaleString()}</span>
            <span className="unit">value</span>
          </div>
          
          <div className="confidence-breakdown">
            <div className="confident-renewals">
              <span className="confident-count">{projectedData.confidence || 0}</span>
              <span className="confident-label">high confidence</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!data || Object.keys(data).length === 0) {
    return (
      <section className="kpi-row">
        <h2>Enhanced KPI Row</h2>
        <div className="kpi-loading">Loading KPIs...</div>
      </section>
    );
  }

  return (
    <section className="kpi-row">
      <h2>Enhanced KPI Row - Real-time Performance Metrics</h2>
      
      <div className="kpi-grid">
        {/* Primary KPIs */}
        {renderKPICard(
          'Renewal Conversion Rate',
          data.renewalConversionRate?.value || 0,
          '%',
          data.renewalConversionRate?.trend,
          data.renewalConversionRate?.target,
          'primary',
          'renewal-conversion'
        )}
        
        {renderKPICard(
          'Churn Rate',
          data.churnRate?.value || 0,
          '%',
          data.churnRate?.trend,
          data.churnRate?.target,
          'warning',
          'churn-rate'
        )}
        
        {renderKPICard(
          'Campaign ROI',
          data.campaignROI?.value || 0,
          '%',
          data.campaignROI?.trend,
          data.campaignROI?.target,
          'success',
          'campaign-roi'
        )}
      </div>

      {/* CLV by Tier */}
      <div className="clv-tier-section">
        <h3>Average CLV by Customer Tier</h3>
        <div className="clv-tier-grid">
          {renderCLVByTierCards()}
        </div>
      </div>

      {/* Projected Renewals */}
      <div className="projected-renewals-section">
        <h3>Projected Renewals with Confidence Scores</h3>
        {renderProjectedRenewalsCard()}
      </div>
    </section>
  );
}