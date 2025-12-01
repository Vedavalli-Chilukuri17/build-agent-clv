import React from 'react';
import './Navigation.css';

export default function Navigation({ currentTab, onTabChange }) {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'renewal', label: 'Renewal', icon: '🔄' },
    { id: 'intelligence', label: 'Customer Intelligence', icon: '🧠' },
    { id: 'campaign', label: 'Campaign', icon: '📢' },
    { id: 'ingestion', label: 'Data Ingestion', icon: '📥' },
    { id: 'execution', label: 'Model Execution', icon: '⚙️' }
  ];

  return (
    <nav className="clv-navigation">
      <div className="nav-header">
        <h2 className="nav-title">CLV Maximizer</h2>
        <p className="nav-subtitle">Customer Success Platform</p>
      </div>
      
      <ul className="nav-list">
        {navigationItems.map(item => (
          <li key={item.id} className="nav-item">
            <button 
              className={`nav-button ${currentTab === item.id ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
              aria-label={item.label}
            >
              <span className="nav-icon" role="img" aria-hidden="true">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      
      <div className="nav-footer">
        <div className="user-identity">
          <strong>Emma Thompson</strong>
          <p>Senior Marketing Analyst</p>
        </div>
      </div>
    </nav>
  );
}