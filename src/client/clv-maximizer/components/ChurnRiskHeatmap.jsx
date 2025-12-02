import React from 'react';
import './ChurnRiskHeatmap.css';

export default function ChurnRiskHeatmap({ churnDistribution, onDrillDown }) {
  const [lastUpdated, setLastUpdated] = React.useState(new Date());

  React.useEffect(() => {
    setLastUpdated(new Date());
  }, [churnDistribution]);

  if (!churnDistribution) {
    return (
      <div className='churn-risk-heatmap'>
        <h3>Churn Risk Heatmap</h3>
        <div className='heatmap-loading'>
          <div className='loading-spinner'></div>
          <p>Loading churn risk data...</p>
        </div>
      </div>
    );
  }

  const renderRiskBar = (riskLevel, data, label) => {
    const percentage = parseFloat(data.percentage);
    const count = data.count;
    
    // Calculate bar width with minimum visibility
    const barWidth = Math.max(25, percentage);
    
    const handleClick = () => {
      if (onDrillDown) {
        onDrillDown('churn_risk', label);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <div
        key={riskLevel}
        className={`risk-bar risk-bar--${riskLevel}`}
        onClick={handleClick}
        title={`Click to view ${label.toLowerCase()} risk customers - ${count} customers (${percentage}%)`}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={`${label} risk: ${count} customers, ${percentage}%`}
      >
        <div className="risk-bar__container">
          <div
            className="risk-bar__fill"
            style={{ 
              width: `${barWidth}%`,
              backgroundColor: data.color
            }}
          >
            <div className="risk-bar__content">
              <div className="risk-bar__text-group">
                <span className="risk-bar__label">{label} Risk</span>
                <span className="risk-bar__count">{count}</span>
                <span className="risk-bar__percentage">({percentage}%)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="risk-bar__tooltip">
          <div className="tooltip-header">
            <strong>{label} Risk Customers</strong>
          </div>
          <div className="tooltip-content">
            <div className="tooltip-metric">
              <span className="tooltip-label">Count:</span>
              <span className="tooltip-value">{count}</span>
            </div>
            <div className="tooltip-metric">
              <span className="tooltip-label">Percentage:</span>
              <span className="tooltip-value">{percentage}%</span>
            </div>
            <div className="tooltip-metric">
              <span className="tooltip-label">Definition:</span>
              <span className="tooltip-value">
                {riskLevel === 'high' ? 'Customers with 70%+ churn probability' :
                 riskLevel === 'medium' ? 'Customers with 40-69% churn probability' :
                 'Customers with <40% churn probability'}
              </span>
            </div>
            <div className="tooltip-action">
              Click to drill down to customer list →
            </div>
          </div>
        </div>
      </div>
    );
  };

  const totalCustomers = churnDistribution.high.count + churnDistribution.medium.count + churnDistribution.low.count;

  return (
    <div className='churn-risk-heatmap' role='region' aria-labelledby='churn-heatmap-title'>
      <div className='heatmap-header'>
        <h3 id='churn-heatmap-title'>Churn Risk Heatmap</h3>
        <p className="heatmap-subtitle">Customer risk level distribution</p>
      </div>
      
      <div className='heatmap-bars' role='list' aria-label='Churn risk distribution'>
        {renderRiskBar('high', churnDistribution.high, 'High')}
        {renderRiskBar('medium', churnDistribution.medium, 'Medium')}
        {renderRiskBar('low', churnDistribution.low, 'Low')}
      </div>
      
      <div className='heatmap-footer'>
        <div className='heatmap-summary'>
          <div className="summary-item">
            <span className="summary-label">Total Customers:</span>
            <span className="summary-value">{totalCustomers.toLocaleString()}</span>
          </div>
          <div className="summary-item urgent">
            <span className="summary-label">High Risk:</span>
            <span className="summary-value">{churnDistribution.high.count.toLocaleString()}</span>
          </div>
        </div>
        
        <div className='heatmap-legend'>
          <span className='legend-item'>
            <span className='legend-color legend-color--high'></span>
            High Risk (70%+)
          </span>
          <span className='legend-item'>
            <span className='legend-color legend-color--medium'></span>
            Medium Risk (40-69%)
          </span>
          <span className='legend-item'>
            <span className='legend-color legend-color--low'></span>
            Low Risk (&lt;40%)
          </span>
        </div>
      </div>
    </div>
  );
}