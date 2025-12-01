import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DataIngestionService } from '../services/DataIngestionService.js';
import { display, value } from '../utils/fields.js';
import './DataIngestionTab.css';

export default function DataIngestionTab() {
  const [ingestionData, setIngestionData] = useState({
    files: [],
    logs: [],
    importSets: []
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sourceType, setSourceType] = useState('External');
  const [previewData, setPreviewData] = useState(null);
  const [validationStatus, setValidationStatus] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('uploadedTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('All');

  // CRM Analytics state
  const [selectedCRMDataset, setSelectedCRMDataset] = useState(null);
  const [crmDatasets, setCrmDatasets] = useState([]);
  const [crmPreviewData, setCrmPreviewData] = useState(null);
  const [crmAnalytics, setCrmAnalytics] = useState(null);

  const service = useMemo(() => new DataIngestionService(), []);
  const itemsPerPage = 5;

  useEffect(() => {
    loadIngestionData();
    
    // Auto-refresh every 3 minutes
    const interval = setInterval(loadIngestionData, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [service]);

  const loadIngestionData = async () => {
    setLoading(true);
    try {
      const [files, logs, importSets] = await Promise.all([
        service.getUploadedFiles(),
        service.getIngestionLogs(),
        service.getImportSets()
      ]);

      setIngestionData({ files, logs, importSets });
      
      // Generate upload data from real files
      const uploadData = service.generateUploadData(files);
      setUploadedFiles(uploadData);
      
      // Generate CRM datasets
      const crmData = service.generateCRMDatasets(files);
      setCrmDatasets(crmData);
      
      // Set default selected CRM dataset
      if (crmData.length > 0 && !selectedCRMDataset) {
        setSelectedCRMDataset(crmData[0]);
        loadCRMDatasetDetails(crmData[0]);
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading ingestion data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCRMDatasetDetails = (dataset) => {
    // Generate CRM preview data
    const mockCRMPreview = {
      fileName: dataset.fileName,
      recordCount: dataset.recordCount,
      columnCount: 15,
      headers: ['Customer_ID', 'Policy_Number', 'Policy_Type', 'Premium', 'Tenure_Months', 'Claims_Count', 'CLV_Score', 'Risk_Level', 'Contact_Phone', 'Email', 'City', 'State', 'Age', 'Gender', 'Status'],
      rows: [
        ['CRM001', 'POL-98765', 'Auto', '$1,250', '24', '1', '8,500', 'Medium', '555-0101', 'john@email.com', 'New York', 'NY', '34', 'M', 'Active'],
        ['CRM002', 'POL-98766', 'Home', '$850', '36', '0', '12,300', 'Low', '555-0102', 'sarah@email.com', 'Los Angeles', 'CA', '42', 'F', 'Active'],
        ['CRM003', 'POL-98767', 'Life', '$2,100', '18', '2', '15,700', 'High', '555-0103', 'mike@email.com', 'Chicago', 'IL', '28', 'M', 'Active'],
        ['CRM004', 'POL-98768', 'Auto', '$975', '48', '1', '9,800', 'Medium', '555-0104', 'lisa@email.com', 'Houston', 'TX', '39', 'F', 'Active'],
        ['CRM005', 'POL-98769', 'Home', '$1,125', '30', '0', '11,200', 'Low', '555-0105', 'tom@email.com', 'Phoenix', 'AZ', '45', 'M', 'Active'],
        ['CRM006', 'POL-98770', 'Life', '$1,875', '12', '3', '18,200', 'High', '555-0106', 'anna@email.com', 'Philadelphia', 'PA', '31', 'F', 'Active'],
        ['CRM007', 'POL-98771', 'Auto', '$1,350', '42', '2', '7,900', 'Medium', '555-0107', 'david@email.com', 'San Antonio', 'TX', '36', 'M', 'Active'],
        ['CRM008', 'POL-98772', 'Home', '$1,025', '60', '1', '14,500', 'Low', '555-0108', 'maria@email.com', 'San Diego', 'CA', '48', 'F', 'Active'],
      ]
    };
    setCrmPreviewData(mockCRMPreview);

    // Generate CRM analytics
    const mockAnalytics = {
      avgPolicyTenure: (Math.random() * 24 + 12).toFixed(1), // 12-36 months
      avgPremium: `$${(Math.random() * 800 + 800).toFixed(0)}`, // $800-1600
      avgClaimsPerCustomer: (Math.random() * 1.5 + 0.5).toFixed(1), // 0.5-2.0
      highCLVPercentage: (Math.random() * 20 + 15).toFixed(1) // 15-35%
    };
    setCrmAnalytics(mockAnalytics);
  };

  // Calculate metrics
  const summaryMetrics = useMemo(() => {
    return service.calculateSummaryMetrics(ingestionData.files, ingestionData.logs, ingestionData.importSets);
  }, [service, ingestionData]);

  const footerMetrics = useMemo(() => {
    return service.calculateFooterMetrics(ingestionData.files, ingestionData.logs);
  }, [service, ingestionData]);

  // File upload handlers
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      simulateFilePreview(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      simulateFilePreview(file);
    }
  };

  const simulateFilePreview = (file) => {
    // Simulate file preview data
    const mockPreview = {
      fileName: file.name,
      recordCount: Math.floor(Math.random() * 1000) + 100,
      columnCount: Math.floor(Math.random() * 15) + 5,
      nullValues: Math.floor(Math.random() * 50),
      headers: ['ID', 'Customer_Name', 'Email', 'Phone', 'City', 'State'],
      rows: [
        ['001', 'John Smith', 'john@email.com', '555-0101', 'New York', 'NY'],
        ['002', 'Sarah Johnson', 'sarah@email.com', '555-0102', 'Los Angeles', 'CA'],
        ['003', 'Mike Brown', 'mike@email.com', '555-0103', 'Chicago', 'IL'],
        ['004', 'Lisa Davis', 'lisa@email.com', '555-0104', 'Houston', 'TX'],
        ['005', 'Tom Wilson', 'tom@email.com', '555-0105', 'Phoenix', 'AZ']
      ]
    };
    setPreviewData(mockPreview);
    setValidationStatus(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const result = await service.uploadFile(selectedFile, sourceType);
      
      // Add to uploaded files list
      const newFile = {
        id: result.fileId,
        fileName: result.fileName,
        sourceType: result.sourceType,
        size: service.formatFileSize(result.size),
        recordCount: result.recordCount,
        uploadedTime: 'Just now',
        status: result.status,
        rawSize: result.size,
        createdOn: new Date().toISOString()
      };
      
      setUploadedFiles(prev => [newFile, ...prev]);
      
      // Reset upload state
      setSelectedFile(null);
      setPreviewData(null);
      setValidationStatus(null);
      
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleValidation = async () => {
    if (!selectedFile) return;
    
    setValidationStatus({ status: 'processing' });
    
    try {
      const result = await service.validateFile('current_file');
      setValidationStatus({
        status: result.validated ? 'validated' : 'failed',
        errors: result.errors || [],
        recordCount: result.recordCount
      });
    } catch (error) {
      setValidationStatus({ status: 'failed', errors: ['Validation service unavailable'] });
    }
  };

  // CRM Dataset handlers
  const handleCRMDatasetSelect = (dataset) => {
    setSelectedCRMDataset(dataset);
    loadCRMDatasetDetails(dataset);
  };

  const handleCRMAction = (action, dataset) => {
    console.log(`CRM ${action} action for dataset:`, dataset.fileName);
    if (action === 'view') {
      handleCRMDatasetSelect(dataset);
    }
    // Future: Implement actual actions
  };

  // Table sorting and filtering
  const sortedAndFilteredFiles = useMemo(() => {
    let filtered = uploadedFiles;
    
    if (filterStatus !== 'All') {
      filtered = uploadedFiles.filter(file => file.status === filterStatus);
    }
    
    return filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
  }, [uploadedFiles, sortField, sortDirection, filterStatus]);

  const paginatedFiles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredFiles.slice(start, start + itemsPerPage);
  }, [sortedAndFilteredFiles, currentPage]);

  const totalPages = Math.ceil(sortedAndFilteredFiles.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleFileAction = (action, fileId) => {
    console.log(`${action} action for file:`, fileId);
    // Future: Implement actual actions
  };

  if (loading) {
    return (
      <div className="ingestion-loading">
        <div className="loading-spinner"></div>
        <p>Loading Data Ingestion...</p>
      </div>
    );
  }

  return (
    <div className="data-ingestion-tab">
      <div className="ingestion-header">
        <h1>Data Ingestion</h1>
        <div className="ingestion-meta">
          <span className="last-updated">Last Updated: {lastUpdated.toLocaleTimeString()}</span>
          <div className="user-identity">
            <strong>Emma Thompson</strong>
          </div>
        </div>
      </div>

      {/* Section 1: Summary Metrics Panel */}
      <section className="summary-metrics-section">
        <div className="summary-cards">
          <div className="summary-card total-datasets">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <div className="card-value">{summaryMetrics.totalDatasets}</div>
              <div className="card-label">Total Datasets</div>
              <div className="card-trend">
                <span className="trend-indicator positive">↗ +12%</span>
              </div>
            </div>
          </div>

          <div className="summary-card viewed-datasets">
            <div className="card-icon">👁️</div>
            <div className="card-content">
              <div className="card-value">{summaryMetrics.viewedDatasets}</div>
              <div className="card-label">Viewed Datasets</div>
              <div className="card-trend">
                <span className="trend-indicator neutral">{summaryMetrics.viewedPercentage}% of total</span>
              </div>
            </div>
          </div>

          <div className="summary-card validated-datasets">
            <div className="card-icon">✅</div>
            <div className="card-content">
              <div className="card-value">{summaryMetrics.validatedDatasets}</div>
              <div className="card-label">Validated Datasets</div>
              <div className="card-trend">
                <span className={`trend-indicator ${summaryMetrics.validatedPercentage > 70 ? 'positive' : 'warning'}`}>
                  {summaryMetrics.validatedPercentage}% success rate
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Upload & Validation Workflow with CRM Analytics */}
      <section className="upload-workflow-section">
        <h2>Upload & Validation Workflow</h2>
        
        <div className="upload-and-crm-container">
          {/* Left Side - Upload Area */}
          <div className="upload-container">
            <div className="upload-zone-wrapper">
              <div 
                className={`upload-zone ${selectedFile ? 'has-file' : ''}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="upload-content">
                  <div className="upload-icon">📁</div>
                  <div className="upload-text">
                    {selectedFile ? (
                      <span>Selected: <strong>{selectedFile.name}</strong></span>
                    ) : (
                      <span>Drag and drop files here or <button className="browse-btn">browse</button></span>
                    )}
                  </div>
                  <div className="upload-formats">
                    Supported: .CSV, .XLSX, .JSON (Max: 100MB)
                  </div>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.json"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    ref={(input) => {
                      if (input) {
                        input.onclick = () => input.click();
                        const browseBtn = document.querySelector('.browse-btn');
                        if (browseBtn) {
                          browseBtn.onclick = () => input.click();
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="upload-controls">
                <select 
                  value={sourceType} 
                  onChange={(e) => setSourceType(e.target.value)}
                  className="source-type-select"
                >
                  <option value="External">External</option>
                  <option value="CRM">CRM</option>
                  <option value="Campaign">Campaign</option>
                  <option value="Internal">Internal</option>
                  <option value="API">API</option>
                </select>

                <button 
                  className="upload-btn"
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload Dataset'}
                </button>
              </div>

              {isUploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{Math.round(uploadProgress)}%</span>
                </div>
              )}
            </div>

            <div className="workflow-panels">
              {/* Data Preview Panel */}
              <div className="workflow-panel preview-panel">
                <h3>Data Preview Panel</h3>
                {previewData ? (
                  <div className="data-preview">
                    <div className="preview-stats">
                      <span>Records: {previewData.recordCount}</span>
                      <span>Columns: {previewData.columnCount}</span>
                      <span>Null Values: {previewData.nullValues}</span>
                    </div>
                    <div className="preview-table">
                      <table>
                        <thead>
                          <tr>
                            {previewData.headers.map((header, index) => (
                              <th key={index}>{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.rows.map((row, index) => (
                            <tr key={index}>
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="no-preview">
                    No data preview available. Please upload a file to preview data.
                  </div>
                )}
              </div>

              {/* Quick Analytics Panel */}
              <div className="workflow-panel analytics-panel">
                <h3>Quick Analytics Panel</h3>
                {previewData ? (
                  <div className="quick-analytics">
                    <div className="analytics-grid">
                      <div className="analytics-item">
                        <span className="analytics-label">Record Count</span>
                        <span className="analytics-value">{previewData.recordCount.toLocaleString()}</span>
                      </div>
                      <div className="analytics-item">
                        <span className="analytics-label">Column Count</span>
                        <span className="analytics-value">{previewData.columnCount}</span>
                      </div>
                      <div className="analytics-item">
                        <span className="analytics-label">Null Values</span>
                        <span className="analytics-value">{previewData.nullValues}</span>
                      </div>
                      <div className="analytics-item">
                        <span className="analytics-label">File Size</span>
                        <span className="analytics-value">{selectedFile ? service.formatFileSize(selectedFile.size) : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-analytics">
                    Upload a file to view analytics
                  </div>
                )}
              </div>

              {/* Validation Panel */}
              <div className="workflow-panel validation-panel">
                <h3>Validation Panel</h3>
                <div className="validation-content">
                  {validationStatus ? (
                    <div className={`validation-result ${validationStatus.status}`}>
                      <div className="validation-status">
                        Status: <span className={`status-badge ${validationStatus.status}`}>
                          {validationStatus.status === 'validated' ? 'Validated' : 
                           validationStatus.status === 'failed' ? 'Failed' :
                           'Processing...'}
                        </span>
                      </div>
                      {validationStatus.errors && validationStatus.errors.length > 0 && (
                        <div className="validation-errors">
                          <strong>Errors:</strong>
                          <ul>
                            {validationStatus.errors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : previewData ? (
                    <div className="validation-pending">
                      <p>Validation result not found. Uploaded file has not been processed with validation rules.</p>
                    </div>
                  ) : (
                    <div className="no-validation">
                      Upload a file to run validation
                    </div>
                  )}
                  
                  <div className="validation-actions">
                    <button 
                      className="validation-btn run-validation"
                      onClick={handleValidation}
                      disabled={!previewData || validationStatus?.status === 'processing'}
                    >
                      Run Validation
                    </button>
                    <button 
                      className="validation-btn reprocess"
                      onClick={() => setValidationStatus(null)}
                      disabled={!validationStatus}
                    >
                      Reprocess
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - CRM Data Analytics & Dataset Sheet */}
          <div className="crm-analytics-container">
            <div className="crm-analytics-section">
              <div className="crm-header">
                <h2>CRM Data Analytics & Dataset Sheet</h2>
                <div className="crm-refresh">
                  <span className="refresh-indicator">🔄</span>
                  <span className="last-updated-small">Updated: {lastUpdated.toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Dataset Cards */}
              <div className="crm-dataset-cards">
                <h3>Dataset Cards</h3>
                <div className="dataset-cards-grid">
                  {crmDatasets.map((dataset, index) => (
                    <div 
                      key={index} 
                      className={`dataset-card ${selectedCRMDataset?.fileName === dataset.fileName ? 'selected' : ''}`}
                      onClick={() => handleCRMDatasetSelect(dataset)}
                    >
                      <div className="dataset-card-header">
                        <h4>{dataset.fileName}</h4>
                        <span className={`dataset-status-badge ${dataset.status.toLowerCase()}`}>
                          {dataset.status}
                        </span>
                      </div>
                      <div className="dataset-card-info">
                        <div className="dataset-info-item">
                          <span className="info-label">Records:</span>
                          <span className="info-value">{dataset.recordCount.toLocaleString()}</span>
                        </div>
                        <div className="dataset-info-item">
                          <span className="info-label">Size:</span>
                          <span className="info-value">{dataset.size}</span>
                        </div>
                        <div className="dataset-info-item">
                          <span className="info-label">Uploaded:</span>
                          <span className="info-value">{dataset.uploadedTime}</span>
                        </div>
                      </div>
                      <div className="dataset-card-actions">
                        <button 
                          className="dataset-action-btn view"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCRMAction('view', dataset);
                          }}
                        >
                          View Dataset
                        </button>
                        <button 
                          className="dataset-action-btn metadata"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCRMAction('metadata', dataset);
                          }}
                        >
                          View Metadata
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedCRMDataset && crmPreviewData && (
                <>
                  {/* Data Sheet Preview */}
                  <div className="crm-data-sheet">
                    <h3>Data Sheet Preview</h3>
                    <div className="data-sheet-controls">
                      <div className="sheet-stats">
                        <span>Rows: {crmPreviewData.recordCount.toLocaleString()}</span>
                        <span>Columns: {crmPreviewData.columnCount}</span>
                      </div>
                      <div className="sheet-actions">
                        <input type="text" placeholder="Filter columns..." className="filter-input" />
                        <select className="sort-select">
                          <option>Sort by...</option>
                          <option>Customer ID</option>
                          <option>Premium</option>
                          <option>CLV Score</option>
                        </select>
                      </div>
                    </div>
                    <div className="data-sheet-preview">
                      <table className="crm-data-table">
                        <thead>
                          <tr>
                            {crmPreviewData.headers.map((header, index) => (
                              <th key={index}>{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {crmPreviewData.rows.map((row, index) => (
                            <tr key={index}>
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Quick Analytics Panel */}
                  <div className="crm-quick-analytics">
                    <h3>Quick Analytics Panel</h3>
                    <div className="crm-analytics-grid">
                      <div className="crm-analytics-card">
                        <div className="analytics-card-icon">⏱️</div>
                        <div className="analytics-card-content">
                          <div className="analytics-card-value">{crmAnalytics.avgPolicyTenure}</div>
                          <div className="analytics-card-label">Avg. Policy Tenure (months)</div>
                        </div>
                      </div>
                      <div className="crm-analytics-card">
                        <div className="analytics-card-icon">💰</div>
                        <div className="analytics-card-content">
                          <div className="analytics-card-value">{crmAnalytics.avgPremium}</div>
                          <div className="analytics-card-label">Avg. Premium</div>
                        </div>
                      </div>
                      <div className="crm-analytics-card">
                        <div className="analytics-card-icon">📋</div>
                        <div className="analytics-card-content">
                          <div className="analytics-card-value">{crmAnalytics.avgClaimsPerCustomer}</div>
                          <div className="analytics-card-label">Avg. Claims per Customer</div>
                        </div>
                      </div>
                      <div className="crm-analytics-card">
                        <div className="analytics-card-icon">⭐</div>
                        <div className="analytics-card-content">
                          <div className="analytics-card-value">{crmAnalytics.highCLVPercentage}%</div>
                          <div className="analytics-card-label">% of High CLV Customers</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Summary */}
                  <div className="crm-metadata-summary">
                    <h3>Metadata Summary</h3>
                    <div className="metadata-grid">
                      <div className="metadata-item">
                        <span className="metadata-label">File Name:</span>
                        <span className="metadata-value">{selectedCRMDataset.fileName}</span>
                      </div>
                      <div className="metadata-item">
                        <span className="metadata-label">Source Type:</span>
                        <span className="metadata-value">CRM</span>
                      </div>
                      <div className="metadata-item">
                        <span className="metadata-label">Upload Date & Time:</span>
                        <span className="metadata-value">{selectedCRMDataset.uploadedTime}</span>
                      </div>
                      <div className="metadata-item">
                        <span className="metadata-label">Validation Status:</span>
                        <span className={`metadata-value status ${selectedCRMDataset.status.toLowerCase()}`}>
                          {selectedCRMDataset.status}
                        </span>
                      </div>
                      <div className="metadata-item">
                        <span className="metadata-label">Author/User:</span>
                        <span className="metadata-value">Emma Thompson</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {!selectedCRMDataset && (
                <div className="no-crm-dataset">
                  <p>Select a CRM dataset to view analytics and preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Recent Data Uploads Table */}
      <section className="uploads-table-section">
        <div className="table-header">
          <h2>Recent Data Uploads</h2>
          <div className="table-controls">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Status</option>
              <option value="Validated">Validated</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Processing">Processing</option>
            </select>
          </div>
        </div>

        <div className="uploads-table">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('fileName')}>
                  File Name {sortField === 'fileName' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('sourceType')}>
                  Source Type {sortField === 'sourceType' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('size')}>
                  Size {sortField === 'size' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('recordCount')}>
                  Record Count {sortField === 'recordCount' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('uploadedTime')}>
                  Uploaded Time {sortField === 'uploadedTime' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFiles.map((file) => (
                <tr key={file.id}>
                  <td className="file-name" title={file.fileName}>
                    {file.fileName}
                  </td>
                  <td>
                    <span className={`source-type ${file.sourceType.toLowerCase()}`}>
                      {file.sourceType}
                    </span>
                  </td>
                  <td>{file.size}</td>
                  <td>{file.recordCount.toLocaleString()}</td>
                  <td>{file.uploadedTime}</td>
                  <td>
                    <span className={`status-badge ${file.status.toLowerCase()}`}>
                      {file.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn view"
                        onClick={() => handleFileAction('view', file.id)}
                        title="View details"
                      >
                        👁️
                      </button>
                      <button 
                        className="action-btn revalidate"
                        onClick={() => handleFileAction('revalidate', file.id)}
                        title="Revalidate"
                      >
                        🔄
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleFileAction('delete', file.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* Section 4: Footer Metrics Panel */}
      <section className="footer-metrics-section">
        <div className="footer-metrics-cards">
          <div className="footer-metric-card quality-score">
            <div className="metric-icon">📈</div>
            <div className="metric-content">
              <div className="metric-value">{footerMetrics.dataQualityScore}</div>
              <div className="metric-label">Data Quality Score</div>
              <div className="metric-trend">
                <span className={`trend-indicator ${footerMetrics.qualityTrend}`}>
                  {footerMetrics.qualityTrend === 'up' ? '↗' : '↘'} vs last sync
                </span>
              </div>
            </div>
          </div>

          <div className="footer-metric-card total-records">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <div className="metric-value">{footerMetrics.totalRecordsIngested}</div>
              <div className="metric-label">Total Records Ingested</div>
              <div className="metric-trend">
                <span className="trend-indicator up">↗ +2.3% this week</span>
              </div>
            </div>
          </div>

          <div className="footer-metric-card last-sync">
            <div className="metric-icon">🕒</div>
            <div className="metric-content">
              <div className="metric-value">{footerMetrics.lastSyncTimestamp}</div>
              <div className="metric-label">Last Sync Timestamp</div>
              <div className="metric-trend">
                <span className="trend-indicator neutral">Auto-refresh enabled</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}