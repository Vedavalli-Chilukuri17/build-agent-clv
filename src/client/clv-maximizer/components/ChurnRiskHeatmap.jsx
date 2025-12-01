import React from 'react';
import { display, value } from '../utils/fields.js';
import './ChurnRiskHeatmap.css';

export default function ChurnRiskHeatmap({ analytics, onDrillDown }) {
  const [lastUpdated, setLastUpdated] = React.useState(new Date());

  React.useEffect(() => {
    setLastUpdated(new Date());
  }, [analytics]);

  if (!analytics) {
    return (
      React.createElement('div', { className: 'churn-risk-heatmap' }, [
        React.createElement('h2', { key: 'title' }, 'Churn Risk Heatmap'),
        React.createElement('div', { key: 'loading', className: 'heatmap-loading' }, [
          React.createElement('div', { key: 'spinner', className: 'loading-spinner' }),
          React.createElement('p', { key: 'text' }, 'Loading churn risk data...')
        ])
      ])
    );
  }

  const { churnDistribution } = analytics;

  const renderRiskBar = (riskLevel, data, label) => {
    const percentage = parseFloat(data.percentage);
    const count = data.count;
    
    // Calculate bar width with minimum visibility
    const barWidth = Math.max(25, percentage);
    
    // Determine colors based on risk level
    const colors = {
      high: '#ef4444', // Red
      medium: '#f59e0b', // Orange  
      low: '#10b981' // Green
    };

    return React.createElement('div', {
      key: riskLevel,
      className: `risk-bar risk-bar--${riskLevel}`,
      onClick: () => onDrillDown('churnRisk', label),
      title: `Click to view ${label.toLowerCase()} risk customers - ${count} customers (${percentage}%)`,
      role: 'button',
      tabIndex: 0,
      onKeyPress: (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onDrillDown('churnRisk', label);
        }
      },
      'aria-label': `${label} risk: ${count} customers, ${percentage}%`
    }, [
      React.createElement('div', { key: 'container', className: 'risk-bar__container' }, [
        React.createElement('div', {
          key: 'fill',
          className: 'risk-bar__fill',
          style: { 
            width: `${barWidth}%`,
            backgroundColor: colors[riskLevel]
          }
        }, [
          React.createElement('div', { key: 'content', className: 'risk-bar__content' }, [
            React.createElement('div', { key: 'text-group', className: 'risk-bar__text-group' }, [
              React.createElement('span', { key: 'label', className: 'risk-bar__label' }, `${label} Risk`),
              React.createElement('span', { key: 'count', className: 'risk-bar__count' }, count),
              React.createElement('span', { key: 'percentage', className: 'risk-bar__percentage' }, `${percentage}%`)
            ])
          ])
        ])
      ]),
      React.createElement('div', { key: 'tooltip', className: 'risk-bar__tooltip' }, [
        React.createElement('div', { key: 'tooltip-header', className: 'tooltip-header' }, [
          React.createElement('strong', { key: 'strong' }, `${label} Risk Customers`)
        ]),
        React.createElement('div', { key: 'tooltip-content', className: 'tooltip-content' }, [
          React.createElement('div', { key: 'metric-count', className: 'tooltip-metric' }, [
            React.createElement('span', { key: 'count-label', className: 'tooltip-label' }, 'Count:'),
            React.createElement('span', { key: 'count-value', className: 'tooltip-value' }, count)
          ]),
          React.createElement('div', { key: 'metric-percentage', className: 'tooltip-metric' }, [
            React.createElement('span', { key: 'percentage-label', className: 'tooltip-label' }, 'Percentage:'),
            React.createElement('span', { key: 'percentage-value', className: 'tooltip-value' }, `${percentage}%`)
          ]),
          React.createElement('div', { key: 'metric-definition', className: 'tooltip-metric' }, [
            React.createElement('span', { key: 'definition-label', className: 'tooltip-label' }, 'Definition:'),
            React.createElement('span', { key: 'definition-value', className: 'tooltip-value' }, 
              riskLevel === 'high' ? 'Customers with >70% churn probability' :
              riskLevel === 'medium' ? 'Customers with 40-70% churn probability' :
              'Customers with <40% churn probability'
            )
          ]),
          React.createElement('div', { key: 'tooltip-action', className: 'tooltip-action' }, 
            'Click to drill down to customer list →'
          )
        ])
      ])
    ]);
  };

  return React.createElement('div', { 
    className: 'churn-risk-heatmap', 
    role: 'region', 
    'aria-labelledby': 'churn-heatmap-title' 
  }, [
    React.createElement('div', { key: 'header', className: 'heatmap-header' }, [
      React.createElement('h2', { key: 'title', id: 'churn-heatmap-title' }, 'Churn Risk Heatmap'),
      React.createElement('div', { key: 'meta', className: 'heatmap-meta' }, [
        React.createElement('div', { key: 'refresh', className: 'heatmap-refresh-indicator' }, [
          React.createElement('div', { key: 'dot', className: 'refresh-dot' }),
          React.createElement('span', { key: 'text' }, 'Real-time data')
        ]),
        React.createElement('div', { key: 'timestamp', className: 'heatmap-timestamp' }, [
          React.createElement('span', { key: 'time' }, `Last updated: ${lastUpdated.toLocaleTimeString()}`)
        ])
      ])
    ]),
    React.createElement('div', { 
      key: 'bars', 
      className: 'heatmap-bars', 
      role: 'list', 
      'aria-label': 'Churn risk distribution' 
    }, [
      renderRiskBar('high', churnDistribution.high, 'High'),
      renderRiskBar('medium', churnDistribution.medium, 'Medium'),
      renderRiskBar('low', churnDistribution.low, 'Low')
    ]),
    React.createElement('div', { key: 'footer', className: 'heatmap-footer' }, [
      React.createElement('div', { key: 'legend', className: 'heatmap-legend' }, [
        React.createElement('span', { key: 'high', className: 'legend-item' }, [
          React.createElement('span', { key: 'color-high', className: 'legend-color legend-color--high' }),
          'High Risk (>70%)'
        ]),
        React.createElement('span', { key: 'medium', className: 'legend-item' }, [
          React.createElement('span', { key: 'color-medium', className: 'legend-color legend-color--medium' }),
          'Medium Risk (40-70%)'
        ]),
        React.createElement('span', { key: 'low', className: 'legend-item' }, [
          React.createElement('span', { key: 'color-low', className: 'legend-color legend-color--low' }),
          'Low Risk (<40%)'
        ])
      ]),
      React.createElement('div', { key: 'summary', className: 'heatmap-summary' }, 
        `Total Active Customers: ${analytics.summaryMetrics.totalCustomers}`
      )
    ])
  ]);
}