import React from 'react';
import { display, value } from '../utils/fields.js';
import './ChurnRiskHeatmap.css';

export default function ChurnRiskHeatmap({ analytics, onDrillDown }) {
  if (!analytics) {
    return (
      <section className="churn-risk-heatmap">
        <h2>Churn Risk Heatmap</h2>
        <div className="heatmap-loading">
          <div className="loading-spinner"></div>
          <p>Loading churn risk data...</p>
        </div>
      </section>
    );
  }

  const { churnDistribution } = analytics;

  const renderRiskBar = (riskLevel, data, label) => {
    const percentage = parseFloat(data.percentage);
    const barId = `risk-bar-${riskLevel}`;

    return (
      <div 
        key={riskLevel}
        className={`risk-bar risk-bar--${riskLevel}`}
        onClick={() => onDrillDown('churnRisk', label)}
        title={`Click to filter ${label.toLowerCase()} risk customers`}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onDrillDown('churnRisk', label);
          }
        }}
        aria-label={`${label} risk: ${data.count} customers, ${percentage}%`}
      >
        <div className="risk-bar__content">
          <div className="risk-bar__info">
            <div className="risk-bar__labels">
              <span className="risk-bar__label">{label} Risk</span>
              <div className="risk-bar__metrics">
                <span className="risk-bar__count">{data.count}</span>
                <span className="risk-bar__percentage">{percentage}%</span>
              </div>
            </div>
          </div>
          <div className="risk-bar__visual">
            <div 
              className="risk-bar__fill"
              style={{ 
                width: `${Math.max(15, percentage)}%`,
                backgroundColor: data.color
              }}
              aria-hidden="true"
            >
              <div className="risk-bar__fill-inner"></div>
            </div>
          </div>
        </div>
        
        {/* Hover tooltip */}
        <div className="risk-bar__tooltip">
          <div className="tooltip-header">
            <strong>{label} Risk Customers</strong>
          </div>
          <div className="tooltip-content">
            <div className="tooltip-metric">
              <span className="tooltip-label">Count:</span>
              <span className="tooltip-value">{data.count}</span>
            </div>
            <div className="tooltip-metric">
              <span className="tooltip-label">Percentage:</span>
              <span className="tooltip-value">{percentage}%</span>
            </div>
            <div className="tooltip-action">
              Click to filter and view details →
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="churn-risk-heatmap" role="region" aria-labelledby="churn-heatmap-title">
      <div className="heatmap-header">
        <h2 id="churn-heatmap-title">Churn Risk Heatmap</h2>
        <div className="heatmap-refresh-indicator">
          <div className="refresh-dot"></div>
          <span>Real-time data</span>
        </div>
      </div>
      
      <div className="heatmap-bars" role="list" aria-label="Churn risk distribution">
        {renderRiskBar('high', churnDistribution.high, 'High')}
        {renderRiskBar('medium', churnDistribution.medium, 'Medium')}  
        {renderRiskBar('low', churnDistribution.low, 'Low')}
      </div>
      
      <div className="heatmap-footer">
        <div className="heatmap-legend">
          <span className="legend-item">
            <span className="legend-color legend-color--high"></span>
            High Risk
          </span>
          <span className="legend-item">
            <span className="legend-color legend-color--medium"></span>
            Medium Risk
          </span>
          <span className="legend-item">
            <span className="legend-color legend-color--low"></span>
            Low Risk
          </span>
        </div>
        <div className="heatmap-summary">
          Total: {analytics.summaryMetrics.totalCustomers} customers
        </div>
      </div>
    </section>
  );
}