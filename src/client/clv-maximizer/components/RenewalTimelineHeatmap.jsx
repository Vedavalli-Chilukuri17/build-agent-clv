import React from 'react';
import './RenewalTimelineHeatmap.css';

export default function RenewalTimelineHeatmap({ renewalTimeline, onDrillDown }) {
  const timelineData = [
    {
      id: 'next30',
      label: 'Next 30 Days',
      count: renewalTimeline.next30.count,
      color: renewalTimeline.next30.color,
      urgent: renewalTimeline.next30.urgent,
      percentage: ((renewalTimeline.next30.count / (renewalTimeline.next30.count + renewalTimeline.days31to60.count + renewalTimeline.days61to90.count)) * 100).toFixed(1)
    },
    {
      id: 'days31to60',
      label: '31-60 Days',
      count: renewalTimeline.days31to60.count,
      color: renewalTimeline.days31to60.color,
      urgent: renewalTimeline.days31to60.urgent,
      percentage: ((renewalTimeline.days31to60.count / (renewalTimeline.next30.count + renewalTimeline.days31to60.count + renewalTimeline.days61to90.count)) * 100).toFixed(1)
    },
    {
      id: 'days61to90',
      label: '61-90 Days',
      count: renewalTimeline.days61to90.count,
      color: renewalTimeline.days61to90.color,
      urgent: renewalTimeline.days61to90.urgent,
      percentage: ((renewalTimeline.days61to90.count / (renewalTimeline.next30.count + renewalTimeline.days31to60.count + renewalTimeline.days61to90.count)) * 100).toFixed(1)
    }
  ];

  const maxCount = Math.max(...timelineData.map(item => item.count));

  const handleBarClick = (timeframe) => {
    if (onDrillDown) {
      onDrillDown('renewal_timeline', timeframe);
    }
  };

  return (
    <div className="renewal-timeline-heatmap">
      <div className="heatmap-header">
        <h3>Renewal Timeline Heatmap</h3>
        <p className="heatmap-subtitle">Customer renewal urgency distribution</p>
      </div>

      <div className="timeline-bars">
        {timelineData.map(item => (
          <div key={item.id} className="timeline-bar-container">
            <div className="timeline-label-container">
              <div className="timeline-label">
                {item.label}
                {item.urgent && <span className="urgent-badge">Urgent</span>}
              </div>
              <div className="timeline-stats">
                <span className="timeline-count">{item.count.toLocaleString()}</span>
                <span className="timeline-percentage">({item.percentage}%)</span>
              </div>
            </div>
            
            <div className="timeline-bar-track">
              <div 
                className="timeline-bar"
                style={{
                  width: `${(item.count / maxCount) * 100}%`,
                  backgroundColor: item.color
                }}
                onClick={() => handleBarClick(item.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleBarClick(item.id);
                  }
                }}
              />
            </div>

            {item.urgent && (
              <div className="urgency-indicator">
                <span className="urgency-icon">🔔</span>
                <span className="urgency-text">Requires immediate attention</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="timeline-summary">
        <div className="summary-item">
          <span className="summary-label">Total Renewals:</span>
          <span className="summary-value">
            {(renewalTimeline.next30.count + renewalTimeline.days31to60.count + renewalTimeline.days61to90.count).toLocaleString()}
          </span>
        </div>
        <div className="summary-item urgent">
          <span className="summary-label">Urgent Actions:</span>
          <span className="summary-value">{renewalTimeline.next30.count.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}