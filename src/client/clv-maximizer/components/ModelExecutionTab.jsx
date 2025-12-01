import React, { useState, useEffect, useMemo } from 'react';
import { ModelExecutionService } from '../services/ModelExecutionService.js';
import { display, value } from '../utils/fields.js';
import './ModelExecutionTab.css';

export default function ModelExecutionTab() {
  const [modelData, setModelData] = useState({
    logs: [],
    customers: [],
    properties: []
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [executionStates, setExecutionStates] = useState({});
  const [batchExecution, setBatchExecution] = useState(null);
  const [scheduleSettings, setScheduleSettings] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('runDateTime');

  const service = useMemo(() => new ModelExecutionService(), []);

  useEffect(() => {
    loadModelData();
    
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(loadModelData, 30 * 1000);
    return () => clearInterval(interval);
  }, [service]);

  const loadModelData = async () => {
    setLoading(true);
    try {
      const [logs, customers, properties] = await Promise.all([
        service.getModelLogs(),
        service.getCustomerData(),
        service.getSystemProperties()
      ]);

      setModelData({ logs, customers, properties });
      
      // Load scheduling info on first load
      if (!scheduleSettings) {
        setScheduleSettings(service.getSchedulingInfo());
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading model data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate derived data
  const modelSummary = useMemo(() => {
    return service.calculateModelSummary(modelData.logs, modelData.customers);
  }, [service, modelData]);

  const modelStatuses = useMemo(() => {
    return service.generateModelStatuses();
  }, [service]);

  const recentRuns = useMemo(() => {
    return service.generateRecentRuns();
  }, [service]);

  const performanceMetrics = useMemo(() => {
    return service.generatePerformanceMetrics();
  }, [service]);

  // Filter and sort recent runs
  const filteredAndSortedRuns = useMemo(() => {
    let filtered = recentRuns;
    
    if (filterStatus !== 'All') {
      filtered = recentRuns.filter(run => run.status === filterStatus);
    }
    
    return filtered.sort((a, b) => {
      if (sortBy === 'runDateTime') {
        return new Date(b.runDateTime) - new Date(a.runDateTime);
      } else if (sortBy === 'modelName') {
        return a.modelName.localeCompare(b.modelName);
      } else if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });
  }, [recentRuns, filterStatus, sortBy]);

  // Handle individual model execution
  const handleExecuteModel = async (modelId, modelName) => {
    setExecutionStates(prev => ({
      ...prev,
      [modelId]: { status: 'starting', progress: 0 }
    }));

    try {
      // Start execution with progress simulation
      const progressInterval = setInterval(() => {
        setExecutionStates(prev => ({
          ...prev,
          [modelId]: { 
            ...prev[modelId], 
            progress: Math.min((prev[modelId]?.progress || 0) + Math.random() * 20, 95) 
          }
        }));
      }, 500);

      const result = await service.executeModel(modelId);
      
      clearInterval(progressInterval);
      
      if (result.success) {
        setExecutionStates(prev => ({
          ...prev,
          [modelId]: { status: 'completed', progress: 100, executionId: result.executionId }
        }));
        
        // Reset after 3 seconds
        setTimeout(() => {
          setExecutionStates(prev => {
            const newState = { ...prev };
            delete newState[modelId];
            return newState;
          });
        }, 3000);
        
        // Refresh data
        loadModelData();
      } else {
        setExecutionStates(prev => ({
          ...prev,
          [modelId]: { status: 'failed', progress: 0 }
        }));
      }
    } catch (error) {
      setExecutionStates(prev => ({
        ...prev,
        [modelId]: { status: 'failed', progress: 0 }
      }));
    }
  };

  // Handle batch execution
  const handleRunAllModels = async () => {
    setBatchExecution({ status: 'starting' });
    
    try {
      const result = await service.executeAllModels();
      
      if (result.success) {
        setBatchExecution({
          status: 'running',
          executionId: result.executionId,
          startedAt: result.startedAt,
          modelsStarted: result.modelsStarted,
          estimatedCompletion: result.estimatedCompletion
        });
        
        // Simulate completion after 10 seconds
        setTimeout(() => {
          setBatchExecution({ status: 'completed' });
          loadModelData();
          
          // Reset after 3 seconds
          setTimeout(() => {
            setBatchExecution(null);
          }, 3000);
        }, 10000);
      }
    } catch (error) {
      setBatchExecution({ status: 'failed' });
    }
  };

  // Handle schedule settings update
  const handleScheduleUpdate = async (field, value) => {
    const newSettings = { ...scheduleSettings, [field]: value };
    setScheduleSettings(newSettings);
    
    try {
      await service.updateScheduleSettings(newSettings);
    } catch (error) {
      console.error('Error updating schedule settings:', error);
    }
  };

  if (loading && !modelData.customers.length) {
    return (
      <div className="model-loading">
        <div className="loading-spinner"></div>
        <p>Loading Model Execution...</p>
      </div>
    );
  }

  return (
    <div className="model-execution-tab">
      <div className="model-header">
        <h1>Model Execution</h1>
        <div className="model-meta">
          <span className="last-updated">Last Updated: {lastUpdated.toLocaleTimeString()}</span>
          <div className="user-identity">
            <strong>Emma Thompson</strong>
            <p>Senior Marketing Analyst</p>
          </div>
        </div>
      </div>

      {/* Section 1: Model Summary Panel */}
      <section className="model-summary-section">
        <div className="summary-metrics">
          <div className="summary-metric">
            <div className="metric-icon">⚙️</div>
            <div className="metric-content">
              <div className="metric-value">{modelSummary.modelRunStatus}</div>
              <div className="metric-label">Model Run Status</div>
            </div>
            <div className={`trend-indicator ${modelSummary.trendsVsPrevious.performance}`}>
              {modelSummary.trendsVsPrevious.performance === 'up' ? '↗' : '↘'}
            </div>
          </div>

          <div className="summary-metric">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <div className="metric-value">{modelSummary.dataQualityScore}%</div>
              <div className="metric-label">Data Quality Score</div>
            </div>
            <div className={`trend-indicator ${modelSummary.trendsVsPrevious.dataQuality}`}>
              {modelSummary.trendsVsPrevious.dataQuality === 'up' ? '↗' : '↘'}
            </div>
          </div>

          <div className="summary-metric">
            <div className="metric-icon">🗃️</div>
            <div className="metric-content">
              <div className="metric-value">{modelSummary.recentProcessedRecords}</div>
              <div className="metric-label">Recent Processed Records</div>
            </div>
            <div className={`trend-indicator ${modelSummary.trendsVsPrevious.records}`}>
              {modelSummary.trendsVsPrevious.records === 'up' ? '↗' : '↘'}
            </div>
          </div>

          <div className="summary-metric">
            <div className="metric-icon">⏱️</div>
            <div className="metric-content">
              <div className="metric-value">{modelSummary.etaToCompletion}</div>
              <div className="metric-label">ETA to Completion</div>
            </div>
          </div>
        </div>

        <div className="summary-actions">
          <button 
            className="btn-run-all"
            onClick={handleRunAllModels}
            disabled={batchExecution?.status === 'starting' || batchExecution?.status === 'running'}
          >
            {batchExecution?.status === 'starting' ? '🚀 Starting...' :
             batchExecution?.status === 'running' ? '⏳ Running All Models...' :
             '▶️ Run All Models'}
          </button>
        </div>

        {batchExecution && (
          <div className={`batch-status ${batchExecution.status}`}>
            {batchExecution.status === 'running' && (
              <div>
                <p><strong>Batch Execution In Progress</strong></p>
                <p>Started {batchExecution.modelsStarted} models at {service.formatDateTime(batchExecution.startedAt)}</p>
                <p>Expected completion: {service.formatDateTime(batchExecution.estimatedCompletion)}</p>
              </div>
            )}
            {batchExecution.status === 'completed' && (
              <p><strong>✅ All models executed successfully!</strong></p>
            )}
            {batchExecution.status === 'failed' && (
              <p><strong>❌ Batch execution failed</strong></p>
            )}
          </div>
        )}
      </section>

      <div className="model-content-grid">
        <div className="model-main-content">
          {/* Section 2: Individual Model Status Panel */}
          <section className="model-status-section">
            <h2>Individual Model Status</h2>
            <div className="model-status-grid">
              {modelStatuses.map((model) => {
                const execution = executionStates[model.id];
                return (
                  <div key={model.id} className="model-tile">
                    <div className="model-tile-header">
                      <h3>{model.name}</h3>
                      <span className={`status-badge ${(execution?.status || model.status).toLowerCase()}`}>
                        {execution?.status || model.status}
                      </span>
                    </div>
                    
                    <div className="model-tile-content">
                      <p className="model-description">{model.description}</p>
                      
                      <div className="model-metrics">
                        <div className="model-metric">
                          <span className="metric-label">Last Run:</span>
                          <span className="metric-value">
                            {service.formatDateTime(model.lastRunTimestamp)}
                          </span>
                        </div>
                        <div className="model-metric">
                          <span className="metric-label">{model.metricLabel}:</span>
                          <span className="metric-value">{model.accuracyScore}{model.metricLabel.includes('AUC') ? '' : '%'}</span>
                        </div>
                      </div>

                      {execution && execution.status === 'starting' && (
                        <div className="execution-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${execution.progress}%` }}
                            ></div>
                          </div>
                          <span className="progress-text">{Math.round(execution.progress)}%</span>
                        </div>
                      )}
                    </div>

                    <div className="model-tile-actions">
                      <button 
                        className="btn-run-model"
                        onClick={() => handleExecuteModel(model.id, model.name)}
                        disabled={execution?.status === 'starting' || model.status === 'Running'}
                      >
                        {execution?.status === 'starting' ? 'Running...' :
                         execution?.status === 'completed' ? 'Completed ✓' :
                         execution?.status === 'failed' ? 'Failed ✗' :
                         model.status === 'Running' ? 'Running...' :
                         'Run Model'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 4: Model Performance Metrics Panel */}
          <section className="performance-metrics-section">
            <h2>Model Performance Metrics</h2>
            
            <div className="performance-grid">
              <div className="performance-category">
                <h3>Overall Performance</h3>
                <div className="metrics-grid">
                  <div className="performance-metric">
                    <div className="metric-value">{performanceMetrics.overall.dataQuality}%</div>
                    <div className="metric-label">Data Quality</div>
                    <div className={`trend-indicator ${performanceMetrics.trends.dataQuality}`}>
                      {performanceMetrics.trends.dataQuality === 'up' ? '↗ +2.1%' : '↘ -1.3%'}
                    </div>
                  </div>
                  <div className="performance-metric">
                    <div className="metric-value">{performanceMetrics.overall.accuracy}%</div>
                    <div className="metric-label">Accuracy</div>
                    <div className={`trend-indicator ${performanceMetrics.trends.accuracy}`}>
                      {performanceMetrics.trends.accuracy === 'up' ? '↗ +1.8%' : '↘ -0.9%'}
                    </div>
                  </div>
                  <div className="performance-metric">
                    <div className="metric-value">{performanceMetrics.overall.consistency}%</div>
                    <div className="metric-label">Consistency</div>
                    <div className={`trend-indicator ${performanceMetrics.trends.consistency}`}>
                      {performanceMetrics.trends.consistency === 'up' ? '↗ +1.2%' : '↘ -0.7%'}
                    </div>
                  </div>
                  <div className="performance-metric">
                    <div className="metric-value">{performanceMetrics.overall.timeliness}%</div>
                    <div className="metric-label">Timeliness</div>
                    <div className={`trend-indicator ${performanceMetrics.trends.timeliness}`}>
                      {performanceMetrics.trends.timeliness === 'up' ? '↗ +0.8%' : '↘ -0.4%'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="performance-category">
                <h3>Model-Specific Metrics</h3>
                <div className="metrics-grid">
                  <div className="performance-metric">
                    <div className="metric-value">{performanceMetrics.modelSpecific.churnAccuracy}%</div>
                    <div className="metric-label">Churn Risk Accuracy</div>
                  </div>
                  <div className="performance-metric">
                    <div className="metric-value">{performanceMetrics.modelSpecific.clvAccuracy}%</div>
                    <div className="metric-label">CLV Forecast Accuracy</div>
                  </div>
                  <div className="performance-metric">
                    <div className="metric-value">{performanceMetrics.modelSpecific.propensityAUC}</div>
                    <div className="metric-label">Propensity Model AUC</div>
                  </div>
                  <div className="performance-metric">
                    <div className="metric-value">{performanceMetrics.modelSpecific.segmentationStability}%</div>
                    <div className="metric-label">Segmentation Stability</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Manual Model Controls Panel */}
          <section className="manual-controls-section">
            <h2>Manual Model Controls</h2>
            <div className="controls-grid">
              <div className="control-card">
                <div className="control-header">
                  <h3>Run Churn Risk Model</h3>
                  <p>Update churn risk scores</p>
                </div>
                <button 
                  className="btn-control churn"
                  onClick={() => handleExecuteModel('churn_risk', 'Churn Risk Model')}
                  disabled={executionStates.churn_risk?.status === 'starting'}
                >
                  {executionStates.churn_risk?.status === 'starting' ? 'Running...' : 'Run Churn Model'}
                </button>
              </div>

              <div className="control-card">
                <div className="control-header">
                  <h3>Recalculate CLV Forecast Model</h3>
                  <p>Refresh value forecasts</p>
                </div>
                <button 
                  className="btn-control clv"
                  onClick={() => handleExecuteModel('clv_forecast', 'CLV Forecast Model')}
                  disabled={executionStates.clv_forecast?.status === 'starting'}
                >
                  {executionStates.clv_forecast?.status === 'starting' ? 'Running...' : 'Run CLV Forecast'}
                </button>
              </div>

              <div className="control-card">
                <div className="control-header">
                  <h3>Run Product Propensity Model</h3>
                  <p>Update product likelihood scores</p>
                </div>
                <button 
                  className="btn-control propensity"
                  onClick={() => handleExecuteModel('product_propensity', 'Product Propensity Model')}
                  disabled={executionStates.product_propensity?.status === 'starting'}
                >
                  {executionStates.product_propensity?.status === 'starting' ? 'Running...' : 'Run Propensity Model'}
                </button>
              </div>

              <div className="control-card">
                <div className="control-header">
                  <h3>Update Segments</h3>
                  <p>Refresh customer tiers</p>
                </div>
                <button 
                  className="btn-control segmentation"
                  onClick={() => handleExecuteModel('customer_segmentation', 'Customer Segmentation Model')}
                  disabled={executionStates.customer_segmentation?.status === 'starting'}
                >
                  {executionStates.customer_segmentation?.status === 'starting' ? 'Running...' : 'Run Segmentation Model'}
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="model-sidebar">
          {/* Section 3: Recent Model Runs Panel */}
          <section className="recent-runs-section">
            <div className="section-header">
              <h2>Recent Model Runs</h2>
              <div className="runs-controls">
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="All">All Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Running">Running</option>
                  <option value="Failed">Failed</option>
                </select>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="runDateTime">Sort by Time</option>
                  <option value="modelName">Sort by Model</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
            </div>

            <div className="recent-runs-list">
              {filteredAndSortedRuns.map((run) => (
                <div key={run.id} className="run-item">
                  <div className="run-header">
                    <h4>{run.modelName}</h4>
                    <span className={`run-status ${run.status.toLowerCase()}`}>
                      {run.status}
                    </span>
                  </div>
                  <div className="run-details">
                    <p><strong>Time:</strong> {service.formatDateTime(run.runDateTime)}</p>
                    <p><strong>Duration:</strong> {run.duration}</p>
                    <p><strong>Records:</strong> {run.recordsProcessed.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Run Time Settings Panel */}
          <section className="schedule-settings-section">
            <h2>Run Time Settings</h2>
            {scheduleSettings && (
              <div className="schedule-form">
                <div className="form-group">
                  <label>Next Scheduled Run</label>
                  <input
                    type="datetime-local"
                    value={scheduleSettings.nextScheduledRun}
                    onChange={(e) => handleScheduleUpdate('nextScheduledRun', e.target.value)}
                    className="schedule-input"
                  />
                </div>

                <div className="form-group">
                  <label>Last Updated</label>
                  <input
                    type="text"
                    value={service.formatDateTime(scheduleSettings.lastUpdated)}
                    readOnly
                    className="schedule-input readonly"
                  />
                </div>

                <div className="form-group">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={scheduleSettings.autoRunEnabled}
                      onChange={(e) => handleScheduleUpdate('autoRunEnabled', e.target.checked)}
                    />
                    <span>Auto-run Toggle</span>
                  </label>
                  <p className="toggle-description">Enable scheduled execution ({scheduleSettings.runFrequency})</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}