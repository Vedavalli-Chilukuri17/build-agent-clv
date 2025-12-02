import React from 'react';
import './SummaryMetricsPanel.css';

export default function SummaryMetricsPanel({ metrics, onDrillDown }) {
  const metricCards = [
    {
      id: 'total-customers',
      icon: '👥',
      label: 'Total Customers',
      value: metrics.totalCustomers.toLocaleString(),
      trend: '+5.2%',
      trendUp: true,
      drillDownType: 'all',
      drillDownValue: null
    },
    {
      id: 'high-risk-customers',
      icon: '⚠️',
      label: 'High Risk Customers',
      value: metrics.highRiskCount.toLocaleString(),
      trend: '-2.1%',
      trendUp: false,
      drillDownType: 'high_risk',
      drillDownValue: 'High'
    },
    {
      id: 'average-clv',
      icon: '💰',
      label: 'Average CLV',
      value: `$${metrics.averageCLV.toLocaleString()}`,
      trend: '+8.7%',
      trendUp: true,
      drillDownType: 'clv_range',
      drillDownValue: null
    },
    {
      id: 'platinum-tier',
      icon: '⭐',
      label: 'Platinum Tier Count',
      value: metrics.platinumCount.toLocaleString(),
      trend: '+12.3%',
      trendUp: true,
      drillDownType: 'tier',
      drillDownValue: 'Platinum'
    }
  ];

  const handleCardClick = (card) => {
    if (onDrillDown) {
      onDrillDown(card.drillDownType, card.drillDownValue);
    }
  };

  return (
    <section className="summary-metrics-panel">
      <div className="metrics-grid">
        {metricCards.map(card => (
          <div 
            key={card.id}
            className="metric-card"
            onClick={() => handleCardClick(card)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCardClick(card);
              }
            }}
          >
            <div className="metric-icon">{card.icon}</div>
            <div className="metric-content">
              <div className="metric-value">{card.value}</div>
              <div className="metric-label">{card.label}</div>
              <div className={`metric-trend ${card.trendUp ? 'trend-up' : 'trend-down'}`}>
                <span className="trend-indicator">
                  {card.trendUp ? '↗️' : '↘️'}
                </span>
                <span className="trend-value">{card.trend}</span>
              </div>
            </div>
            <div className="metric-drill-hint">
              Click to drill down
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}