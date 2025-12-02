export class DashboardService {
  constructor() {
    this.baseUrl = '/api/now/table';
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-UserToken': window.g_ck
    };
  }

  async getRenewalPipeline(filters = {}) {
    try {
      let query = '';
      const params = new URLSearchParams();
      params.append('sysparm_display_value', 'all');
      params.append('sysparm_limit', '1000');

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query += `status=${filters.status}`;
      }

      if (filters.search && filters.search.trim()) {
        const searchTerm = filters.search.trim();
        const searchQuery = `customer_nameLIKE${searchTerm}^ORcustomer_idLIKE${searchTerm}`;
        query = query ? `${query}^${searchQuery}` : searchQuery;
      }

      if (query) {
        params.append('sysparm_query', query);
      }

      // Add ordering
      params.append('sysparm_query', `${query ? query + '^' : ''}ORDERBYrenewal_date`);

      const response = await fetch(
        `${this.baseUrl}/x_hete_clv_maximiz_renewal_tracker?${params.toString()}`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch renewal pipeline: ${response.status}`);
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching renewal pipeline:', error);
      throw error;
    }
  }

  async getProductBenchmarkData() {
    try {
      const params = new URLSearchParams();
      params.append('sysparm_display_value', 'all');
      params.append('sysparm_limit', '1000');
      params.append('sysparm_query', 'ORDERBYproduct_name');

      const response = await fetch(
        `${this.baseUrl}/x_hete_clv_maximiz_product_performance?${params.toString()}`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch product benchmark data: ${response.status}`);
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching product benchmark data:', error);
      throw error;
    }
  }

  async getCompetitorData() {
    try {
      const params = new URLSearchParams();
      params.append('sysparm_display_value', 'all');
      params.append('sysparm_limit', '1000');

      const response = await fetch(
        `${this.baseUrl}/x_hete_clv_maximiz_competitor_benchmark?${params.toString()}`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch competitor data: ${response.status}`);
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching competitor data:', error);
      // Return empty array if no data exists yet
      return [];
    }
  }

  formatCurrency(amount) {
    if (typeof amount === 'object' && amount.display_value) {
      return `$${parseFloat(amount.display_value).toLocaleString()}`;
    }
    const numAmount = parseFloat(amount) || 0;
    return `$${numAmount.toLocaleString()}`;
  }

  formatPercentage(value) {
    if (typeof value === 'object' && value.display_value) {
      return `${parseFloat(value.display_value).toFixed(1)}%`;
    }
    const numValue = parseFloat(value) || 0;
    return `${numValue.toFixed(1)}%`;
  }

  formatDecimal(value, places = 2) {
    if (typeof value === 'object' && value.display_value) {
      return parseFloat(value.display_value).toFixed(places);
    }
    const numValue = parseFloat(value) || 0;
    return numValue.toFixed(places);
  }

  getStatusColor(status) {
    const statusValue = typeof status === 'object' ? status.display_value : status;
    
    switch (statusValue?.toLowerCase()) {
      case 'confirmed':
        return '#10b981'; // green
      case 'in_progress':
        return '#3b82f6'; // blue
      case 'pending':
        return '#f59e0b'; // amber
      case 'at_risk':
        return '#dc2626'; // red
      default:
        return '#6b7280'; // gray
    }
  }

  getPerformanceColor(label) {
    const labelValue = typeof label === 'object' ? label.display_value : label;
    
    switch (labelValue?.toLowerCase()) {
      case 'strong':
        return '#10b981'; // green
      case 'competitive':
        return '#f59e0b'; // amber
      case 'challenged':
        return '#dc2626'; // red
      default:
        return '#6b7280'; // gray
    }
  }

  getDeltaColor(value) {
    const numValue = typeof value === 'object' ? parseFloat(value.display_value) : parseFloat(value);
    return numValue >= 0 ? '#10b981' : '#dc2626'; // green for positive, red for negative
  }
}