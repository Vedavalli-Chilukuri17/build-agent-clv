import React, { useState, useEffect, useMemo } from 'react';
import { CampaignService } from '../services/CampaignService.js';
import { display, value } from '../utils/fields.js';
import './CampaignTab.css';

export default function CampaignTab() {
  const [campaignData, setCampaignData] = useState({
    customers: [],
    products: [],
    campaigns: []
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Campaign Setup State
  const [campaignForm, setCampaignForm] = useState({
    campaignName: '',
    campaignType: 'Retention',
    channel: 'Email',
    priority: 'Medium',
    customerType: 'Existing',
    productFrequency: []
  });

  // Campaign Content State
  const [contentForm, setContentForm] = useState({
    toneStyle: 'Professional',
    messageBrief: '',
    messageBody: ''
  });

  // Schedule & Launch State
  const [scheduleForm, setScheduleForm] = useState({
    launchDate: '',
    launchTime: '',
    deliveryChannels: {
      email: false,
      sms: false,
      aiProfiling: false
    }
  });

  // UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignId, setCampaignId] = useState(null);
  const [launchStatus, setLaunchStatus] = useState(null);

  const service = useMemo(() => new CampaignService(), []);

  useEffect(() => {
    loadCampaignData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadCampaignData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [service]);

  const loadCampaignData = async () => {
    setLoading(true);
    try {
      const [customers, products, campaigns] = await Promise.all([
        service.getCustomerData(),
        service.getProductData(),
        service.getCampaignHistory()
      ]);

      setCampaignData({ customers, products, campaigns });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading campaign data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Campaign Performance Data
  const performanceData = useMemo(() => {
    return service.getCampaignPerformance();
  }, [service]);

  const recentCampaigns = useMemo(() => {
    return service.getRecentCampaigns();
  }, [service]);

  // Form handlers
  const handleCampaignFormChange = (field, value) => {
    setCampaignForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductFrequencyChange = (product, checked) => {
    setCampaignForm(prev => ({
      ...prev,
      productFrequency: checked 
        ? [...prev.productFrequency, product]
        : prev.productFrequency.filter(p => p !== product)
    }));
  };

  const handleContentFormChange = (field, value) => {
    setContentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScheduleFormChange = (field, value) => {
    setScheduleForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeliveryChannelChange = (channel, checked) => {
    setScheduleForm(prev => ({
      ...prev,
      deliveryChannels: {
        ...prev.deliveryChannels,
        [channel]: checked
      }
    }));
  };

  // AI Content Generation
  const handleGenerateContent = async () => {
    if (!contentForm.messageBrief.trim()) {
      alert('Please enter a message brief to generate content');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await service.generateCampaignContent(
        contentForm.toneStyle,
        contentForm.messageBrief,
        campaignForm.customerType,
        campaignForm.productFrequency
      );

      if (result.success) {
        setContentForm(prev => ({
          ...prev,
          messageBody: result.content
        }));
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Save Campaign
  const handleSaveCampaign = async () => {
    setIsSaving(true);
    try {
      const campaignPayload = {
        ...campaignForm,
        ...contentForm,
        ...scheduleForm,
        createdAt: new Date().toISOString(),
        author: 'Emma Thompson'
      };

      const result = await service.saveCampaignDraft(campaignPayload);
      
      if (result.success) {
        setCampaignId(result.campaignId);
        alert('Campaign saved successfully!');
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Launch Campaign
  const handleLaunchCampaign = async () => {
    if (!scheduleForm.launchDate || !scheduleForm.launchTime) {
      alert('Please set launch date and time');
      return;
    }

    const selectedChannels = Object.entries(scheduleForm.deliveryChannels)
      .filter(([_, enabled]) => enabled)
      .map(([channel, _]) => channel);

    if (selectedChannels.length === 0) {
      alert('Please select at least one delivery channel');
      return;
    }

    setIsLaunching(true);
    try {
      const launchPayload = {
        campaignId,
        ...campaignForm,
        ...contentForm,
        ...scheduleForm,
        selectedChannels,
        launchedAt: new Date().toISOString(),
        author: 'Emma Thompson'
      };

      const result = await service.launchCampaign(launchPayload);
      
      if (result.success) {
        setLaunchStatus({
          success: true,
          campaignId: result.campaignId,
          launchedAt: result.launchedAt,
          estimatedReach: result.estimatedReach
        });
      }
    } catch (error) {
      console.error('Error launching campaign:', error);
      setLaunchStatus({
        success: false,
        error: error.message
      });
    } finally {
      setIsLaunching(false);
    }
  };

  if (loading) {
    return (
      <div className="campaign-loading">
        <div className="loading-spinner"></div>
        <p>Loading Campaign Designer...</p>
      </div>
    );
  }

  return (
    <div className="campaign-designer-tab">
      <div className="campaign-header">
        <h1>Campaign Designer</h1>
        <div className="campaign-meta">
          <span className="last-updated">Last Updated: {lastUpdated.toLocaleTimeString()}</span>
          <div className="user-identity">
            <strong>Emma Thompson</strong>
            <p>Senior Marketing Analyst</p>
          </div>
        </div>
      </div>

      {/* Multi-step Progress Indicator */}
      <div className="campaign-progress">
        <div className="progress-steps">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Setup</span>
          </div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Content</span>
          </div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Schedule</span>
          </div>
          <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-label">Performance</span>
          </div>
        </div>
      </div>

      <div className="campaign-content">
        <div className="campaign-main">
          {/* Section 1: Campaign Setup Panel */}
          {currentStep === 1 && (
            <section className="campaign-section setup-section">
              <div className="section-header">
                <h2>Campaign Details</h2>
                <p>Configure your campaign targeting and objectives</p>
              </div>

              <div className="campaign-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="campaignName">Campaign Name</label>
                    <input
                      type="text"
                      id="campaignName"
                      value={campaignForm.campaignName}
                      onChange={(e) => handleCampaignFormChange('campaignName', e.target.value)}
                      placeholder="e.g., Fall Renters Campaign"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="campaignType">Campaign Type</label>
                    <select
                      id="campaignType"
                      value={campaignForm.campaignType}
                      onChange={(e) => handleCampaignFormChange('campaignType', e.target.value)}
                      className="form-select"
                    >
                      <option value="Retention">Retention</option>
                      <option value="Upsell">Upsell</option>
                      <option value="Win-back">Win-back</option>
                      <option value="Cross-sell">Cross-sell</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="channel">Channel</label>
                    <select
                      id="channel"
                      value={campaignForm.channel}
                      onChange={(e) => handleCampaignFormChange('channel', e.target.value)}
                      className="form-select"
                    >
                      <option value="Email">Email</option>
                      <option value="SMS">SMS</option>
                      <option value="Push Notification">Push Notification</option>
                      <option value="In-app Messaging">In-app Messaging</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      value={campaignForm.priority}
                      onChange={(e) => handleCampaignFormChange('priority', e.target.value)}
                      className="form-select"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="customerType">Customer Type</label>
                    <select
                      id="customerType"
                      value={campaignForm.customerType}
                      onChange={(e) => handleCampaignFormChange('customerType', e.target.value)}
                      className="form-select"
                    >
                      <option value="New">New</option>
                      <option value="Existing">Existing</option>
                      <option value="High CLV">High CLV</option>
                      <option value="At Risk">At Risk</option>
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Product Frequency</label>
                  <div className="checkbox-grid">
                    {[
                      'Auto Renew',
                      'Monthly Installments',
                      'Annual Payments',
                      'New Policy',
                      'Personal Property Coverage',
                      'Umbrella Liability',
                      'Homeowners Coverage',
                      'Renters Coverage',
                      'Auto Coverage'
                    ].map(product => (
                      <label key={product} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={campaignForm.productFrequency.includes(product)}
                          onChange={(e) => handleProductFrequencyChange(product, e.target.checked)}
                        />
                        <span className="checkbox-label">{product}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    className="btn-primary"
                    onClick={() => setCurrentStep(2)}
                    disabled={!campaignForm.campaignName.trim()}
                  >
                    Next: Content →
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Section 2: Campaign Content Panel */}
          {currentStep === 2 && (
            <section className="campaign-section content-section">
              <div className="section-header">
                <h2>Campaign Content</h2>
                <p>Create personalized content with AI assistance</p>
              </div>

              <div className="campaign-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="toneStyle">Tone Style</label>
                    <select
                      id="toneStyle"
                      value={contentForm.toneStyle}
                      onChange={(e) => handleContentFormChange('toneStyle', e.target.value)}
                      className="form-select"
                    >
                      <option value="Professional">Professional</option>
                      <option value="Friendly">Friendly</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Conversational">Conversational</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="messageBrief">Message Brief</label>
                  <input
                    type="text"
                    id="messageBrief"
                    value={contentForm.messageBrief}
                    onChange={(e) => handleContentFormChange('messageBrief', e.target.value)}
                    placeholder="Enter your content brief/topic details..."
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="messageBody">Message Body</label>
                  <textarea
                    id="messageBody"
                    value={contentForm.messageBody}
                    onChange={(e) => handleContentFormChange('messageBody', e.target.value)}
                    placeholder="Generated content will appear here, or write your own..."
                    className="form-textarea"
                    rows="10"
                  />
                  <div className="dynamic-keywords">
                    <strong>Available Keywords:</strong>
                    <span className="keyword">{'{CustomerName}'}</span>
                    <span className="keyword">{'{OfficeLocation}'}</span>
                    <span className="keyword">{'{OfficeDiscount}'}</span>
                    <span className="keyword">{'{ProductName}'}</span>
                    <span className="keyword">{'{RenewalDate}'}</span>
                  </div>
                </div>

                <div className="content-actions">
                  <button
                    className="btn-ai"
                    onClick={handleGenerateContent}
                    disabled={isGenerating || !contentForm.messageBrief.trim()}
                  >
                    {isGenerating ? '🤖 Generating...' : '🤖 Generate with AI'}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={handleGenerateContent}
                    disabled={isGenerating || !contentForm.messageBody.trim()}
                  >
                    🔄 Regenerate
                  </button>
                  <button
                    className="btn-save"
                    onClick={handleSaveCampaign}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : '💾 Save Campaign'}
                  </button>
                </div>

                <div className="form-navigation">
                  <button
                    className="btn-secondary"
                    onClick={() => setCurrentStep(1)}
                  >
                    ← Back: Setup
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => setCurrentStep(3)}
                    disabled={!contentForm.messageBody.trim()}
                  >
                    Next: Schedule →
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Section 3: Schedule & Launch Panel */}
          {currentStep === 3 && (
            <section className="campaign-section schedule-section">
              <div className="section-header">
                <h2>Schedule & Launch</h2>
                <p>Set timing and delivery preferences</p>
              </div>

              <div className="campaign-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="launchDate">Launch Date</label>
                    <input
                      type="date"
                      id="launchDate"
                      value={scheduleForm.launchDate}
                      onChange={(e) => handleScheduleFormChange('launchDate', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="launchTime">Launch Time</label>
                    <input
                      type="time"
                      id="launchTime"
                      value={scheduleForm.launchTime}
                      onChange={(e) => handleScheduleFormChange('launchTime', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Delivery Channels</label>
                  <div className="checkbox-group">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={scheduleForm.deliveryChannels.email}
                        onChange={(e) => handleDeliveryChannelChange('email', e.target.checked)}
                      />
                      <span className="checkbox-label">📧 Send Email</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={scheduleForm.deliveryChannels.sms}
                        onChange={(e) => handleDeliveryChannelChange('sms', e.target.checked)}
                      />
                      <span className="checkbox-label">📱 Send SMS</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={scheduleForm.deliveryChannels.aiProfiling}
                        onChange={(e) => handleDeliveryChannelChange('aiProfiling', e.target.checked)}
                      />
                      <span className="checkbox-label">🤖 Enable AI Profiling</span>
                    </label>
                  </div>
                </div>

                {launchStatus && (
                  <div className={`launch-status ${launchStatus.success ? 'success' : 'error'}`}>
                    {launchStatus.success ? (
                      <div>
                        <h3>✅ Campaign Launched Successfully!</h3>
                        <p>Campaign ID: {launchStatus.campaignId}</p>
                        <p>Launched at: {service.formatDate(launchStatus.launchedAt)}</p>
                        <p>Estimated Reach: {launchStatus.estimatedReach.toLocaleString()} customers</p>
                      </div>
                    ) : (
                      <div>
                        <h3>❌ Launch Failed</h3>
                        <p>Error: {launchStatus.error}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="launch-actions">
                  <button
                    className="btn-launch"
                    onClick={handleLaunchCampaign}
                    disabled={isLaunching}
                  >
                    {isLaunching ? '🚀 Launching...' : '🚀 Launch Campaign'}
                  </button>
                </div>

                <div className="form-navigation">
                  <button
                    className="btn-secondary"
                    onClick={() => setCurrentStep(2)}
                  >
                    ← Back: Content
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => setCurrentStep(4)}
                    disabled={!launchStatus?.success}
                  >
                    Next: Performance →
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Section 4: Campaign Performance Tracker */}
          {currentStep === 4 && (
            <section className="campaign-section performance-section">
              <div className="section-header">
                <h2>Campaign Performance Tracker</h2>
                <p>Real-time analytics and insights</p>
              </div>

              <div className="performance-dashboard">
                {/* Key Metrics */}
                <div className="performance-metrics">
                  <div className="metric-card">
                    <div className="metric-icon">📧</div>
                    <div className="metric-content">
                      <div className="metric-value">{performanceData.openRate}%</div>
                      <div className="metric-label">Open Rate</div>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">👆</div>
                    <div className="metric-content">
                      <div className="metric-value">{performanceData.clickThroughRate}%</div>
                      <div className="metric-label">Click-Through Rate</div>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">🎯</div>
                    <div className="metric-content">
                      <div className="metric-value">{performanceData.conversionRate}%</div>
                      <div className="metric-label">Conversion Rate</div>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">📈</div>
                    <div className="metric-content">
                      <div className="metric-value">{performanceData.churnImpact}%</div>
                      <div className="metric-label">Churn Impact</div>
                    </div>
                  </div>
                </div>

                {/* Segment Performance */}
                <div className="segment-performance">
                  <h3>Segment-wise Performance</h3>
                  <div className="segment-table">
                    <div className="table-header">
                      <span>Segment</span>
                      <span>Open Rate</span>
                      <span>CTR</span>
                      <span>Conversion</span>
                    </div>
                    {Object.entries(performanceData.segmentPerformance).map(([segment, metrics]) => (
                      <div key={segment} className="table-row">
                        <span className="segment-name">{segment}</span>
                        <span className="metric-value">{metrics.openRate}%</span>
                        <span className="metric-value">{metrics.ctr}%</span>
                        <span className="metric-value">{metrics.conversion}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Channel Performance */}
                <div className="channel-performance">
                  <h3>Channel Performance</h3>
                  <div className="channel-grid">
                    {Object.entries(performanceData.channelPerformance).map(([channel, metrics]) => (
                      <div key={channel} className="channel-card">
                        <h4>{channel}</h4>
                        <div className="channel-metrics">
                          <div className="channel-metric">
                            <span className="metric-label">Sent</span>
                            <span className="metric-value">{metrics.sent.toLocaleString()}</span>
                          </div>
                          <div className="channel-metric">
                            <span className="metric-label">Opened</span>
                            <span className="metric-value">{metrics.opened.toLocaleString()}</span>
                          </div>
                          <div className="channel-metric">
                            <span className="metric-label">Clicked</span>
                            <span className="metric-value">{metrics.clicked.toLocaleString()}</span>
                          </div>
                          <div className="channel-metric">
                            <span className="metric-label">Converted</span>
                            <span className="metric-value">{metrics.converted.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-navigation">
                  <button
                    className="btn-secondary"
                    onClick={() => setCurrentStep(3)}
                  >
                    ← Back: Schedule
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => setCurrentStep(1)}
                  >
                    🆕 New Campaign
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar: Recent Campaigns */}
        <div className="campaign-sidebar">
          <div className="recent-campaigns">
            <h3>Recent Campaigns</h3>
            <div className="campaigns-list">
              {recentCampaigns.map((campaign) => (
                <div key={campaign.id} className="campaign-item">
                  <div className="campaign-item-header">
                    <h4>{campaign.name}</h4>
                    <span className={`campaign-status ${campaign.status.toLowerCase()}`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="campaign-item-details">
                    <p><strong>Type:</strong> {campaign.type}</p>
                    <p><strong>Channel:</strong> {campaign.channel}</p>
                    <p><strong>Launch:</strong> {campaign.launchDate}</p>
                  </div>
                  <div className="campaign-item-metrics">
                    <div className="mini-metric">
                      <span>Open: {campaign.performance.openRate}</span>
                    </div>
                    <div className="mini-metric">
                      <span>CTR: {campaign.performance.ctr}</span>
                    </div>
                    <div className="mini-metric">
                      <span>Conv: {campaign.performance.conversion}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}