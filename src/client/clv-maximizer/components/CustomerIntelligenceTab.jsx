import React, { useState, useEffect, useMemo } from 'react';
import { CustomerIntelligenceService } from '../services/CustomerIntelligenceService.js';
import CustomerProfileModal from './CustomerProfileModal.jsx';
import SummaryMetricsPanel from './SummaryMetricsPanel.jsx';
import ChurnRiskHeatmap from './ChurnRiskHeatmap.jsx';
import RenewalTimelineHeatmap from './RenewalTimelineHeatmap.jsx';
import CustomerProfileList from './CustomerProfileList.jsx';
import { display, value } from '../utils/fields.js';
import './CustomerIntelligenceTab.css';

export default function CustomerIntelligenceTab() {
  const [rawData, setRawData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const service = useMemo(() => new CustomerIntelligenceService(), []);

  useEffect(() => {
    loadCustomerData();
    
    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(() => {
      loadCustomerData();
    }, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [service]);

  const loadCustomerData = async () => {
    setLoading(true);
    try {
      const policyHoldersData = await service.getCSMConsumerData();
      const analyticsData = service.generateCustomerAnalytics(policyHoldersData);
      
      setRawData(policyHoldersData);
      setAnalytics(analyticsData);
      setFilteredCustomers(analyticsData.customers);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading customer intelligence data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (customer) => {
    setSelectedCustomer(customer);
    setIsProfileModalOpen(true);
  };

  const handleCloseProfile = () => {
    setIsProfileModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleExportData = () => {
    if (analytics?.customers) {
      service.exportToCSV(filteredCustomers.length > 0 ? filteredCustomers : analytics.customers);
    }
  };

  const handleDrillDown = (filterType, filterValue) => {
    if (!analytics) return;
    
    let filtered = [];
    switch(filterType) {
      case 'churn_risk':
        filtered = analytics.customers.filter(c => c.churnRisk === filterValue);
        break;
      case 'tier':
        filtered = analytics.customers.filter(c => c.tier === filterValue);
        break;
      case 'renewal_timeline':
        filtered = getCustomersForRenewalTimeline(filterValue);
        break;
      case 'high_risk':
        filtered = analytics.customers.filter(c => c.churnRisk === 'High');
        break;
      default:
        filtered = analytics.customers;
    }
    
    setFilteredCustomers(filtered);
  };

  const getCustomersForRenewalTimeline = (timeframe) => {
    if (!analytics) return [];
    
    return analytics.customers.filter(customer => {
      if (timeframe === 'next30') {
        return customer.churnRisk === 'High' || customer.engagementScore < 40;
      } else if (timeframe === 'days31to60') {
        return customer.churnRisk === 'Medium' || (customer.engagementScore >= 40 && customer.engagementScore < 65);
      } else if (timeframe === 'days61to90') {
        return customer.churnRisk === 'Low' && customer.engagementScore >= 65;
      }
      return false;
    });
  };

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return (
      <div className="intelligence-loading">
        <div className="loading-spinner"></div>
        <p>Loading Customer Intelligence Hub...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="intelligence-error">
        <p>Error loading customer intelligence data. Please try again.</p>
        <button onClick={loadCustomerData} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="customer-intelligence-hub">
      {/* Header Panel */}
      <header className="intelligence-header">
        <div className="header-content">
          <div className="header-main">
            <h1>Customer Intelligence Hub</h1>
            <p className="header-subtitle">Advanced analytics and insights for customer lifetime value optimization</p>
          </div>
          <div className="header-actions">
            <div className="workspace-timestamp">
              <span>Last updated: {formatTimestamp(lastUpdated)}</span>
            </div>
            <button onClick={handleExportData} className="export-button">
              <span className="export-icon">📊</span>
              Export Data
            </button>
          </div>
        </div>
      </header>

      {/* Summary Metrics Panel */}
      <SummaryMetricsPanel 
        metrics={analytics.summaryMetrics}
        onDrillDown={handleDrillDown}
      />

      {/* Analytics Section */}
      <section className="analytics-section">
        <div className="analytics-grid">
          {/* Churn Risk Heatmap */}
          <div className="analytics-card">
            <ChurnRiskHeatmap 
              churnDistribution={analytics.churnDistribution}
              onDrillDown={handleDrillDown}
            />
          </div>

          {/* Renewal Timeline Heatmap */}
          <div className="analytics-card">
            <RenewalTimelineHeatmap 
              renewalTimeline={analytics.renewalTimeline}
              onDrillDown={handleDrillDown}
            />
          </div>
        </div>
      </section>

      {/* Customer Profile List */}
      <section className="customer-list-section">
        <CustomerProfileList 
          customers={filteredCustomers.length > 0 ? filteredCustomers : analytics.customers}
          allCustomers={analytics.customers}
          onViewProfile={handleViewProfile}
          onFilter={setFilteredCustomers}
          service={service}
        />
      </section>

      {/* Customer Profile Modal */}
      <CustomerProfileModal
        customer={selectedCustomer}
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfile}
        userContext={{
          role: 'analyst',
          name: 'System User',
          permissions: { viewSensitiveData: true, editCustomers: false, createCampaigns: true }
        }}
      />
    </div>
  );
}