import React, { useState, useMemo } from 'react';
import { display, value } from '../utils/fields.js';
import './CustomerProfileList.css';

export default function CustomerProfileList({ customers, allCustomers, onViewProfile, onFilter, service }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('customerName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filters, setFilters] = useState({
    tier: 'All',
    churnRisk: 'All',
    renewal: 'All'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Filter and search customers
  const filteredAndSearchedCustomers = useMemo(() => {
    let filtered = [...customers];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customerId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.tier !== 'All') {
      filtered = filtered.filter(customer => customer.tier === filters.tier);
    }
    if (filters.churnRisk !== 'All') {
      filtered = filtered.filter(customer => customer.churnRisk === filters.churnRisk);
    }
    if (filters.renewal !== 'All') {
      filtered = filtered.filter(customer => customer.renewal === filters.renewal);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'clv') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (sortField === 'engagementScore') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (sortField === 'tenure') {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [customers, searchTerm, filters, sortField, sortDirection]);

  // Paginate results
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSearchedCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSearchedCustomers, currentPage]);

  const totalPages = Math.ceil(filteredAndSearchedCustomers.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const getChurnRiskBadgeClass = (churnRisk) => {
    switch (churnRisk) {
      case 'High':
        return 'churn-risk-high';
      case 'Medium':
        return 'churn-risk-medium';
      case 'Low':
        return 'churn-risk-low';
      default:
        return 'churn-risk-unknown';
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↗️' : '↘️';
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const showPages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    const endPage = Math.min(totalPages, startPage + showPages - 1);

    if (startPage > 1) {
      pages.push(
        <button key={1} onClick={() => handlePageChange(1)} className="pagination-btn">
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots1" className="pagination-dots">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots2" className="pagination-dots">...</span>);
      }
      pages.push(
        <button key={totalPages} onClick={() => handlePageChange(totalPages)} className="pagination-btn">
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="customer-profile-list">
      <div className="list-header">
        <div className="list-title-section">
          <h2>Customer Profile List</h2>
          <div className="list-count">
            Showing {paginatedCustomers.length} of {filteredAndSearchedCustomers.length} customers
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="list-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="filters-container">
            <select
              value={filters.tier}
              onChange={(e) => handleFilterChange('tier', e.target.value)}
              className="filter-select"
            >
              <option value="All">All Tiers</option>
              <option value="Platinum">Platinum</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
            </select>

            <select
              value={filters.churnRisk}
              onChange={(e) => handleFilterChange('churnRisk', e.target.value)}
              className="filter-select"
            >
              <option value="All">All Risk Levels</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>

            <select
              value={filters.renewal}
              onChange={(e) => handleFilterChange('renewal', e.target.value)}
              className="filter-select"
            >
              <option value="All">All Renewal Status</option>
              <option value="Yes">Upcoming Renewal</option>
              <option value="No">No Renewal</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="customer-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('customerName')} className="sortable">
                Name {getSortIcon('customerName')}
              </th>
              <th onClick={() => handleSort('tier')} className="sortable">
                CLV Tier {getSortIcon('tier')}
              </th>
              <th onClick={() => handleSort('clv')} className="sortable">
                CLV (12M) {getSortIcon('clv')}
              </th>
              <th onClick={() => handleSort('renewal')} className="sortable">
                Renewal {getSortIcon('renewal')}
              </th>
              <th onClick={() => handleSort('churnRisk')} className="sortable">
                Churn Risk {getSortIcon('churnRisk')}
              </th>
              <th onClick={() => handleSort('engagementScore')} className="sortable">
                Engagement Score {getSortIcon('engagementScore')}
              </th>
              <th onClick={() => handleSort('tenure')} className="sortable">
                Tenure {getSortIcon('tenure')}
              </th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <div className="customer-name-cell">
                    <span className="customer-name">{customer.customerName}</span>
                    <span className="customer-id">{customer.customerId}</span>
                  </div>
                </td>
                <td>
                  <span className={`tier-badge tier-${customer.tier.toLowerCase()}`}>
                    {customer.tier}
                  </span>
                </td>
                <td className="currency-cell">
                  {service.formatCurrency(customer.clv)}
                </td>
                <td>
                  <span className={`renewal-badge ${customer.renewal === 'Yes' ? 'renewal-yes' : 'renewal-no'}`}>
                    {customer.renewal}
                  </span>
                </td>
                <td>
                  <span className={`churn-risk-badge ${getChurnRiskBadgeClass(customer.churnRisk)}`}>
                    {customer.churnRisk}
                  </span>
                </td>
                <td className="engagement-cell">
                  <div className="engagement-container">
                    <span className="engagement-score">{customer.engagementScore}</span>
                    <div className="engagement-bar">
                      <div 
                        className="engagement-fill"
                        style={{ width: `${customer.engagementScore}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td>{Math.floor(customer.tenure)} months</td>
                <td className="location-cell">{customer.location}</td>
                <td>
                  <button 
                    onClick={() => onViewProfile(customer)}
                    className="profile-button"
                  >
                    Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="pagination-btn nav-btn"
            >
              ‹ Previous
            </button>
            
            {renderPagination()}
            
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn nav-btn"
            >
              Next ›
            </button>
          </div>
          
          <div className="pagination-info">
            Page {currentPage} of {totalPages} • {filteredAndSearchedCustomers.length} total customers
          </div>
        </div>
      )}
    </div>
  );
}