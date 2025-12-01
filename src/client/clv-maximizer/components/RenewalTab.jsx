import React, { useState, useEffect, useMemo } from 'react';
import { RenewalService } from '../services/RenewalService.js';
import { display, value } from '../utils/fields.js';
import './RenewalTab.css';

export default function RenewalTab() {
  // Service instance
  const renewalService = useMemo(() => new RenewalService(), []);
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renewalSummary, setRenewalSummary] = useState(null);
  const [renewalPipeline, setRenewalPipeline] = useState([]);
  const [nextBestActions, setNextBestActions] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, [renewalService]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [summary, pipeline, actions] = await Promise.all([
        renewalService.getRenewalSummary(),
        renewalService.getRenewalPipeline(),
        renewalService.getNextBestActions()
      ]);
      
      setRenewalSummary(summary);
      setRenewalPipeline(pipeline);
      setNextBestActions(actions);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load renewal data. Please try again.');
      console.error('Error loading renewal data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter pipeline data
  const filteredPipeline = useMemo(() => {
    return renewalPipeline.filter(item => {
      const matchesSearch = !searchTerm || 
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || item.renewalStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [renewalPipeline, searchTerm, statusFilter]);

  // Event handlers
  const handleViewProfile = (customerId) => {
    console.log('Viewing profile for customer:', customerId);
    // In real implementation, this would navigate to customer detail view
  };

  const handleSendReminder = async (customerId) => {
    try {
      await renewalService.sendReminder(customerId, 'email');
      alert('Reminder sent successfully!');
    } catch (err) {
      alert('Failed to send reminder. Please try again.');
    }
  };

  const handleLaunchCampaign = async (customerId) => {
    try {
      await renewalService.launchCampaign(customerId, 'renewal');
      alert('Campaign launched successfully!');
    } catch (err) {
      alert('Failed to launch campaign. Please try again.');
    }
  };

  const handleExecuteScript = async () => {
    try {
      await renewalService.executeScript(nextBestActions?.campaignScript);
      alert('Script executed successfully!');
    } catch (err) {
      alert('Failed to execute script. Please try again.');
    }
  };

  const handleScheduleFollowUp = async () => {
    try {
      await renewalService.scheduleFollowUp({
        type: 'renewal_followup',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      });
      alert('Follow-up scheduled successfully!');
    } catch (err) {
      alert('Failed to schedule follow-up. Please try again.');
    }
  };

  const handleExportData = async () => {
    try {
      await renewalService.exportData(filteredPipeline, 'json');
    } catch (err) {
      alert('Failed to export data. Please try again.');
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="renewal-tab">
        <div className="loading">
          <div>Loading renewal data...</div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="renewal-tab">
        <div className="error">
          {error}
          <button onClick={loadAllData} style={{ marginLeft: '16px' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="renewal-tab">
      {/* Header */}
      <div className="renewal-header">
        <h1 className="renewal-title">Renewal Review & Next Best Action</h1>
      </div>

      {/* Section 1: Renewal Snapshot Summary */}
      <section className="renewal-summary">
        <h2 className="section-title">Renewal Snapshot Summary</h2>
        <div className="summary-panels">
          {/* High-Risk Customers Panel */}
          <div className="summary-panel high-risk">
            <div className="panel-header">
              <h3 className="panel-title">High-Risk Customers</h3>
              <span className="panel-count">{renewalSummary?.highRiskCustomers?.count || 0}</span>
            </div>
            {renewalSummary?.highRiskCustomers?.sampleCustomers?.map((customer, index) => (
              <div key={index} className="sample-customer">
                <div className="customer-name">{customer.name}</div>
                <div className="customer-details">
                  <div className="detail-item">
                    <span className="detail-label">Premium:</span>
                    <span className="detail-value">${customer.premium?.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Risk Score:</span>
                    <span className="detail-value">{customer.riskScore}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Credit Score:</span>
                    <span className="detail-value">{customer.creditScore || 'N/A'}</span>
                  </div>
                </div>
                <div className="policies-section">
                  <div className="policies-label">Current Policies:</div>
                  <div className="policy-list">
                    {customer.policies?.map((policy, pIndex) => (
                      <span key={pIndex} className={`policy-badge ${policy.status.toLowerCase()}`}>
                        {policy.type} ({policy.status})
                      </span>
                    ))}
                  </div>
                </div>
                <div className="next-actions">
                  <div className="actions-label">Best Next Actions:</div>
                  {customer.nextActions?.map((action, aIndex) => (
                    <div key={aIndex} className="action-item">{action}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Total CVR at Risk Panel */}
          <div className="summary-panel cvr-risk">
            <div className="panel-header">
              <h3 className="panel-title">Total CVR at Risk</h3>
              <span className="panel-count">{renewalSummary?.totalCVRAtRisk?.count || 0}</span>
            </div>
            {renewalSummary?.totalCVRAtRisk?.sampleCustomers?.map((customer, index) => (
              <div key={index} className="sample-customer">
                <div className="customer-name">{customer.name}</div>
                <div className="customer-details">
                  <div className="detail-item">
                    <span className="detail-label">Premium:</span>
                    <span className="detail-value">${customer.premium?.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Risk Score:</span>
                    <span className="detail-value">{customer.riskScore}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Credit Score:</span>
                    <span className="detail-value">{customer.creditScore || 'N/A'}</span>
                  </div>
                </div>
                <div className="policies-section">
                  <div className="policies-label">Current Policies:</div>
                  <div className="policy-list">
                    {customer.policies?.map((policy, pIndex) => (
                      <span key={pIndex} className={`policy-badge ${policy.status.toLowerCase()}`}>
                        {policy.type} ({policy.status})
                      </span>
                    ))}
                  </div>
                </div>
                <div className="next-actions">
                  <div className="actions-label">Best Next Actions:</div>
                  {customer.nextActions?.map((action, aIndex) => (
                    <div key={aIndex} className="action-item">{action}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Missing Coverages Panel */}
          <div className="summary-panel missing-coverage">
            <div className="panel-header">
              <h3 className="panel-title">Missing Coverages</h3>
              <span className="panel-count">{renewalSummary?.missingCoverages?.count || 0}</span>
            </div>
            {renewalSummary?.missingCoverages?.sampleCustomers?.map((customer, index) => (
              <div key={index} className="sample-customer">
                <div className="customer-name">{customer.name}</div>
                <div className="customer-details">
                  <div className="detail-item">
                    <span className="detail-label">Premium:</span>
                    <span className="detail-value">${customer.premium?.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Risk Score:</span>
                    <span className="detail-value">{customer.riskScore}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Credit Score:</span>
                    <span className="detail-value">{customer.creditScore || 'N/A'}</span>
                  </div>
                </div>
                <div className="policies-section">
                  <div className="policies-label">Current Policies:</div>
                  <div className="policy-list">
                    {customer.policies?.map((policy, pIndex) => (
                      <span key={pIndex} className={`policy-badge ${policy.status.toLowerCase()}`}>
                        {policy.type} ({policy.status})
                      </span>
                    ))}
                  </div>
                </div>
                <div className="next-actions">
                  <div className="actions-label">Best Next Actions:</div>
                  {customer.nextActions?.map((action, aIndex) => (
                    <div key={aIndex} className="action-item">{action}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Renewal Pipeline Table */}
      <section className="renewal-pipeline">
        <h2 className="section-title">Renewal Pipeline</h2>
        <div className="pipeline-controls">
          <div className="controls-left">
            <input
              type="text"
              className="search-input"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>
          <button className="export-btn" onClick={handleExportData}>
            Export Data
          </button>
        </div>
        <div className="pipeline-table">
          <table className="table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Renewal Date</th>
                <th>Renewal Status</th>
                <th>Opportunity Score</th>
                <th>Renewal Amount</th>
                <th>CLV Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPipeline.map((renewal) => (
                <tr key={renewal.customerId}>
                  <td>{renewal.customerName}</td>
                  <td>{renewal.renewalDate}</td>
                  <td>
                    <span className={`status-badge ${renewal.renewalStatus.toLowerCase()}`}>
                      {renewal.renewalStatus}
                    </span>
                  </td>
                  <td>{renewal.opportunityScore}</td>
                  <td>${renewal.renewalAmount?.toLocaleString()}</td>
                  <td>{renewal.clvScore}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn view"
                        onClick={() => handleViewProfile(renewal.customerId)}
                      >
                        View Profile
                      </button>
                      <button 
                        className="action-btn remind"
                        onClick={() => handleSendReminder(renewal.customerId)}
                      >
                        Send Reminder
                      </button>
                      <button 
                        className="action-btn campaign"
                        onClick={() => handleLaunchCampaign(renewal.customerId)}
                      >
                        Launch Campaign
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3: Next Best Action Panel */}
      <section className="next-best-actions">
        <h2 className="section-title">Next Best Action Panel</h2>
        <div className="actions-grid">
          {/* Customer-Specific Campaign Script */}
          <div className="action-card">
            <h3 className="card-title">
              <span className="card-icon">📧</span>
              Campaign Script
            </h3>
            <div className="campaign-script">
              {nextBestActions?.campaignScript?.message}
            </div>
            <div className="dynamic-fields">
              <strong>Dynamic Fields:</strong>
              {nextBestActions?.campaignScript?.dynamicFields && 
                Object.entries(nextBestActions.campaignScript.dynamicFields).map(([key, value]) => (
                  <span key={key} className="field-tag">
                    {key}: {value}
                  </span>
                ))}
            </div>
            <div className="card-actions">
              <button className="primary-btn" onClick={handleExecuteScript}>
                Execute Script
              </button>
              <button className="secondary-btn">Review</button>
            </div>
          </div>

          {/* Churn Mitigation Actions */}
          <div className="action-card">
            <h3 className="card-title">
              <span className="card-icon">🛡️</span>
              Churn Mitigation
            </h3>
            <ul className="action-list">
              {nextBestActions?.churnMitigation?.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
            <div className="card-actions">
              <button className="primary-btn">Apply Actions</button>
              <button className="secondary-btn" onClick={handleScheduleFollowUp}>
                Schedule Follow-Up
              </button>
            </div>
          </div>

          {/* Cross-Sell / Up-Sell Suggestions */}
          <div className="action-card">
            <h3 className="card-title">
              <span className="card-icon">💰</span>
              Cross-Sell Opportunities
            </h3>
            <ul className="action-list">
              {nextBestActions?.crossSellUpSell?.map((opportunity, index) => (
                <li key={index}>{opportunity}</li>
              ))}
            </ul>
            <div className="card-actions">
              <button className="primary-btn">Generate Offers</button>
              <button className="secondary-btn">View Details</button>
            </div>
          </div>
        </div>

        {/* Outreach Channels */}
        <div className="action-card" style={{ marginTop: '20px' }}>
          <h3 className="card-title">
            <span className="card-icon">📡</span>
            Outreach Channels
          </h3>
          {nextBestActions?.outreachChannels && 
            Object.entries(nextBestActions.outreachChannels).map(([channel, data]) => (
              <div key={channel} className="channel-grid">
                <span className="channel-name">{channel.charAt(0).toUpperCase() + channel.slice(1)}</span>
                <span className={`priority-badge priority-${data.priority.toLowerCase()}`}>
                  {data.priority} Priority
                </span>
                <span className="effectiveness-score">{data.effectiveness}% Effective</span>
              </div>
            ))}
          <div className="recommended-channel">
            <strong>Recommended Channel: {nextBestActions?.recommendedChannel}</strong>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="last-updated">
        Last updated: {lastUpdated.toLocaleString()}
        <button 
          onClick={loadAllData} 
          style={{ 
            marginLeft: '16px', 
            background: 'none', 
            border: 'none', 
            color: '#007bff', 
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Refresh
        </button>
      </div>
    </div>
  );
}