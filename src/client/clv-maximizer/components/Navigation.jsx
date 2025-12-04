import React from 'react';
import './Navigation.css';

export default function Navigation({ currentTab, onTabChange }) {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'renewal', label: 'Renewal' },
    { id: 'intelligence', label: 'Customer Intelligence' },
    { id: 'campaign', label: 'Campaign' },
    { id: 'ingestion', label: 'Data Ingestion' }
  ];

  return (
    <nav className="clv-navigation">
      <div className="nav-header">
        <h2 className="nav-title">CLV Maximization Solution</h2>
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
              <span className="nav-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}