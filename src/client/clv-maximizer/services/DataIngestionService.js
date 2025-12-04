export class DataIngestionService {
  constructor() {
    this.baseUrl = '/api/now/table';
    // Don't set X-UserToken in constructor - set it dynamically in each request
    this.baseHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  // Helper method to get headers with authentication
  getHeaders() {
    const headers = { ...this.baseHeaders };
    
    // Only add X-UserToken if it's available
    if (window.g_ck) {
      headers['X-UserToken'] = window.g_ck;
    }
    
    return headers;
  }

  // Fetch attachment data for uploaded files
  async getUploadedFiles() {
    try {
      const response = await fetch(`${this.baseUrl}/sys_attachment?sysparm_display_value=all&sysparm_limit=50&sysparm_query=ORDERBYDESCsys_created_on`, {
        headers: this.getHeaders()
      });
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
      return [];
    }
  }

  // Fetch audit logs for ingestion tracking
  async getIngestionLogs() {
    try {
      const response = await fetch(`${this.baseUrl}/sys_audit?sysparm_display_value=all&sysparm_limit=100&sysparm_query=ORDERBYDESCsys_created_on`, {
        headers: this.getHeaders()
      });
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching ingestion logs:', error);
      return [];
    }
  }

  // Fetch import set data for validation tracking
  async getImportSets() {
    try {
      const response = await fetch(`${this.baseUrl}/sys_import_set?sysparm_display_value=all&sysparm_limit=50&sysparm_query=ORDERBYDESCsys_created_on`, {
        headers: this.getHeaders()
      });
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching import sets:', error);
      return [];
    }
  }

  // Calculate summary metrics
  calculateSummaryMetrics(files, logs, importSets) {
    const totalDatasets = files.length;
    const viewedDatasets = Math.floor(totalDatasets * 0.73); // Simulate 73% viewed
    const validatedDatasets = Math.floor(totalDatasets * 0.67); // Simulate 67% validated
    
    return {
      totalDatasets,
      viewedDatasets,
      validatedDatasets,
      viewedPercentage: totalDatasets > 0 ? ((viewedDatasets / totalDatasets) * 100).toFixed(1) : 0,
      validatedPercentage: totalDatasets > 0 ? ((validatedDatasets / totalDatasets) * 100).toFixed(1) : 0
    };
  }

  // Generate mock upload data based on real files
  generateUploadData(files) {
    const sourceTypes = ['External', 'CRM', 'Campaign', 'Internal', 'API'];
    const statuses = ['Validated', 'Pending', 'Failed', 'Processing'];
    
    return files.map((file, index) => {
      const fileName = file.file_name?.display_value || `Dataset_${index + 1}`;
      const fileSize = file.size_bytes?.value || Math.floor(Math.random() * 10000000); // Random size if not available
      const createdOn = file.sys_created_on?.display_value || new Date().toISOString();
      
      return {
        id: file.sys_id?.value || `file_${index}`,
        fileName: fileName,
        sourceType: sourceTypes[index % sourceTypes.length],
        size: this.formatFileSize(parseInt(fileSize)),
        recordCount: Math.floor(Math.random() * 5000) + 100,
        uploadedTime: this.formatDateTime(createdOn),
        status: statuses[index % statuses.length],
        rawSize: parseInt(fileSize),
        createdOn: createdOn
      };
    });
  }

  // Generate CRM datasets for analytics
  generateCRMDatasets(files) {
    const crmDatasets = [
      {
        fileName: 'Customer_Policies_2024_Q3.csv',
        status: 'Validated',
        recordCount: 15247,
        size: this.formatFileSize(4800000),
        uploadedTime: '2h ago',
        sourceType: 'CRM'
      },
      {
        fileName: 'Customer_Claims_History.xlsx',
        status: 'Validated',
        recordCount: 8932,
        size: this.formatFileSize(2100000),
        uploadedTime: '4h ago',
        sourceType: 'CRM'
      },
      {
        fileName: 'Policy_Renewals_Q3.csv',
        status: 'Validated',
        recordCount: 12456,
        size: this.formatFileSize(3200000),
        uploadedTime: '1d ago',
        sourceType: 'CRM'
      },
      {
        fileName: 'Customer_Demographics.json',
        status: 'Pending',
        recordCount: 22108,
        size: this.formatFileSize(5600000),
        uploadedTime: '2d ago',
        sourceType: 'CRM'
      }
    ];

    // If we have real files, enhance with some of them marked as CRM
    if (files.length > 0) {
      files.slice(0, 2).forEach((file, index) => {
        if (index < crmDatasets.length) {
          crmDatasets[index].fileName = file.file_name?.display_value || crmDatasets[index].fileName;
          crmDatasets[index].uploadedTime = this.formatDateTime(file.sys_created_on?.display_value || new Date().toISOString());
        }
      });
    }

    return crmDatasets;
  }

  // Format file size for display
  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // Format date/time for display
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

  // Calculate footer metrics
  calculateFooterMetrics(files, logs) {
    const totalRecords = files.reduce((sum, file) => {
      return sum + (Math.floor(Math.random() * 5000) + 100);
    }, 0);
    
    const dataQualityScore = (85 + Math.random() * 10).toFixed(1); // 85-95% range
    const lastSyncHours = Math.floor(Math.random() * 8) + 1; // 1-8 hours ago
    
    return {
      dataQualityScore: `${dataQualityScore}%`,
      totalRecordsIngested: totalRecords.toLocaleString(),
      lastSyncTimestamp: `${lastSyncHours}h ago`,
      qualityTrend: Math.random() > 0.5 ? 'up' : 'down',
      recordsTrend: 'up' // Always trending up for ingested records
    };
  }

  // Simulate file upload
  async uploadFile(file, sourceType) {
    // Simulate upload progress
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          fileId: `upload_${Date.now()}`,
          fileName: file.name,
          size: file.size,
          sourceType: sourceType,
          recordCount: Math.floor(Math.random() * 1000) + 50,
          status: 'Uploaded'
        });
      }, 2000);
    });
  }

  // Simulate validation
  async validateFile(fileId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate
        resolve({
          fileId,
          validated: success,
          status: success ? 'Validated' : 'Failed',
          errors: success ? [] : ['Missing required columns', 'Invalid date formats'],
          recordCount: success ? Math.floor(Math.random() * 1000) + 50 : 0
        });
      }, 1500);
    });
  }
}