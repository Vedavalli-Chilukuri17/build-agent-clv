import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation.jsx';
import Dashboard from './components/Dashboard.jsx';
import RenewalTab from './components/RenewalTab.jsx';
import CustomerIntelligenceTab from './components/CustomerIntelligenceTab.jsx';
import CampaignTab from './components/CampaignTab.jsx';
import './app.css';

export default function CLVMaximizerApp() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Handle hash-based routing for deep linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'dashboard';
      setCurrentTab(hash);
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial load
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tabId) => {
    setCurrentTab(tabId);
    window.location.hash = tabId;
  };

  const renderTabContent = () => {
    switch(currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'renewal':
        return <RenewalTab />;
      case 'intelligence':
        return <CustomerIntelligenceTab />;
      case 'campaign':
        return <CampaignTab />;
      case 'ingestion':
        return (
          <div className="tab-content">
            <h1>Data Ingestion</h1>
            <div className="coming-soon">
              <h2>📥 Data Pipeline</h2>
              <p>Advanced data ingestion and integration tools coming soon.</p>
            </div>
          </div>
        );
      case 'execution':
        return (
          <div className="tab-content">
            <h1>Model Execution</h1>
            <div className="coming-soon">
              <h2>⚙️ ML Model Pipeline</h2>
              <p>Machine learning model execution and monitoring tools coming soon.</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="clv-maximizer-workspace">
      <Navigation currentTab={currentTab} onTabChange={handleTabChange} />
      <main className="main-content">
        {renderTabContent()}
      </main>
    </div>
  );
}