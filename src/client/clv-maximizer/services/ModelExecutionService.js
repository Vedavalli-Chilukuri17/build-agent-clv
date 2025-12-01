export class ModelExecutionService {
  constructor() {
    this.baseUrl = '/api/now/table';
    this.headers = {
      "Accept": "application/json",
      "X-UserToken": window.g_ck
    };
  }

  // Fetch model execution logs
  async getModelLogs() {
    try {
      const response = await fetch(`${this.baseUrl}/sys_audit?sysparm_display_value=all&sysparm_limit=100&sysparm_query=ORDERBYDESCsys_created_on`, {
        headers: this.headers
      });
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching model logs:', error);
      return [];
    }
  }

  // Fetch customer data for model input
  async getCustomerData() {
    try {
      const response = await fetch(`${this.baseUrl}/sys_user?sysparm_display_value=all&sysparm_limit=1000`, {
        headers: this.headers
      });
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching customer data:', error);
      return [];
    }
  }

  // Fetch system properties for model configuration
  async getSystemProperties() {
    try {
      const response = await fetch(`${this.baseUrl}/sys_properties?sysparm_display_value=all&sysparm_limit=50`, {
        headers: this.headers
      });
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching system properties:', error);
      return [];
    }
  }

  // Calculate model summary metrics
  calculateModelSummary(logs, customers) {
    const currentTime = new Date();
    const recentLogs = logs.filter(log => {
      const logTime = new Date(log.sys_created_on?.value || log.sys_created_on);
      return currentTime - logTime < 24 * 60 * 60 * 1000; // Last 24 hours
    });

    const runningModels = Math.floor(Math.random() * 2); // 0-1 models running
    const isRunning = runningModels > 0;
    
    return {
      modelRunStatus: isRunning ? 'Running' : 'Idle',
      dataQualityScore: (92 + Math.random() * 8).toFixed(1), // 92-100%
      recentProcessedRecords: `${(customers.length / 1000).toFixed(1)}M`,
      etaToCompletion: isRunning ? `${Math.floor(Math.random() * 10) + 1} mins` : 'N/A',
      trendsVsPrevious: {
        dataQuality: Math.random() > 0.5 ? 'up' : 'down',
        records: 'up',
        performance: Math.random() > 0.3 ? 'up' : 'down'
      }
    };
  }

  // Generate individual model statuses
  generateModelStatuses() {
    const models = [
      {
        id: 'churn_risk',
        name: 'Churn Risk Model',
        description: 'Predicts customer churn probability',
        status: this.getRandomStatus(),
        lastRunTimestamp: this.getRandomTimestamp(),
        accuracyScore: (85 + Math.random() * 10).toFixed(1),
        metricLabel: 'Accuracy Score'
      },
      {
        id: 'clv_forecast',
        name: 'CLV Forecast Model',
        description: 'Customer lifetime value predictions',
        status: this.getRandomStatus(),
        lastRunTimestamp: this.getRandomTimestamp(),
        accuracyScore: (88 + Math.random() * 8).toFixed(1),
        metricLabel: 'Forecast Accuracy'
      },
      {
        id: 'product_propensity',
        name: 'Product Propensity Model',
        description: 'Product purchase likelihood scores',
        status: this.getRandomStatus(),
        lastRunTimestamp: this.getRandomTimestamp(),
        accuracyScore: (0.75 + Math.random() * 0.2).toFixed(2),
        metricLabel: 'AUC Score'
      },
      {
        id: 'customer_segmentation',
        name: 'Customer Segmentation Model',
        description: 'Customer tier and segment analysis',
        status: this.getRandomStatus(),
        lastRunTimestamp: this.getRandomTimestamp(),
        accuracyScore: (92 + Math.random() * 6).toFixed(1),
        metricLabel: 'Stability Score'
      }
    ];

    return models;
  }

  // Generate recent model runs
  generateRecentRuns() {
    const modelNames = ['Churn Risk Model', 'CLV Forecast Model', 'Product Propensity Model', 'Customer Segmentation Model'];
    const statuses = ['Completed', 'Failed', 'Running'];
    
    const runs = [];
    for (let i = 0; i < 15; i++) {
      const runDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Last 7 days
      const status = i === 0 ? 'Running' : statuses[Math.floor(Math.random() * 2)]; // First one running
      
      runs.push({
        id: `run_${i}`,
        modelName: modelNames[Math.floor(Math.random() * modelNames.length)],
        runDateTime: runDate.toISOString(),
        status: status,
        duration: status === 'Running' ? 'In Progress' : `${Math.floor(Math.random() * 45) + 5} mins`,
        recordsProcessed: Math.floor(Math.random() * 50000) + 10000
      });
    }

    return runs.sort((a, b) => new Date(b.runDateTime) - new Date(a.runDateTime));
  }

  // Generate performance metrics
  generatePerformanceMetrics() {
    return {
      overall: {
        dataQuality: (94 + Math.random() * 5).toFixed(1),
        accuracy: (89 + Math.random() * 8).toFixed(1),
        consistency: (91 + Math.random() * 6).toFixed(1),
        timeliness: (96 + Math.random() * 3).toFixed(1)
      },
      modelSpecific: {
        churnAccuracy: (87 + Math.random() * 8).toFixed(1),
        clvAccuracy: (85 + Math.random() * 10).toFixed(1),
        propensityAUC: (0.78 + Math.random() * 0.15).toFixed(2),
        segmentationStability: (93 + Math.random() * 5).toFixed(1)
      },
      trends: {
        dataQuality: Math.random() > 0.3 ? 'up' : 'down',
        accuracy: Math.random() > 0.4 ? 'up' : 'down',
        consistency: Math.random() > 0.5 ? 'up' : 'down',
        timeliness: Math.random() > 0.6 ? 'up' : 'down'
      }
    };
  }

  // Get scheduling information
  getSchedulingInfo() {
    const nextRun = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 hours from now
    const lastUpdated = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
    
    return {
      nextScheduledRun: nextRun.toISOString().slice(0, 16), // Format for datetime-local input
      lastUpdated: lastUpdated.toISOString(),
      autoRunEnabled: true,
      runFrequency: 'Every 6 hours'
    };
  }

  // Helper methods
  getRandomStatus() {
    const statuses = ['Completed', 'Running', 'Failed'];
    const weights = [0.7, 0.2, 0.1]; // 70% completed, 20% running, 10% failed
    const random = Math.random();
    
    if (random < weights[0]) return 'Completed';
    if (random < weights[0] + weights[1]) return 'Running';
    return 'Failed';
  }

  getRandomTimestamp() {
    const hoursAgo = Math.floor(Math.random() * 24) + 1;
    const timestamp = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
    return timestamp.toISOString();
  }

  // Format datetime for display
  formatDateTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Simulate model execution
  async executeModel(modelId) {
    return new Promise((resolve) => {
      const duration = Math.random() * 3000 + 2000; // 2-5 seconds
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        resolve({
          success,
          modelId,
          executionId: `exec_${Date.now()}`,
          startedAt: new Date().toISOString(),
          estimatedDuration: Math.floor(duration / 1000),
          recordsToProcess: Math.floor(Math.random() * 50000) + 10000
        });
      }, duration);
    });
  }

  // Simulate running all models
  async executeAllModels() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          executionId: `batch_${Date.now()}`,
          startedAt: new Date().toISOString(),
          modelsStarted: 4,
          estimatedCompletion: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
        });
      }, 2000);
    });
  }

  // Update scheduling settings
  async updateScheduleSettings(settings) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          updatedAt: new Date().toISOString(),
          settings
        });
      }, 1000);
    });
  }
}