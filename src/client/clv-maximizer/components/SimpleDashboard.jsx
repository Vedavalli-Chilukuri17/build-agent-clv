import React, { useState, useEffect } from 'react';
import { display, value } from '../utils/fields.js';
import './SimpleDashboard.css';

export default function SimpleDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalCustomers: 0,
    highValueCustomers: 0,
    avgCLV: 0,
    churnRisk: 0,
    renewalsThisMonth: 0,
    activeCampaigns: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSimpleDashboardData();
  }, []);

  const loadSimpleDashboardData = async () => {
    setLoading(true);
    try {
      // Load basic data
      const [policyHolders, campaigns] = await Promise.all([
        fetchTableData('x_hete_clv_maximiz_policy_holders'),
        fetchTableData('x_hete_clv_maximiz_campaigns')
      ]);

      // Calculate simple metrics
      const totalCustomers = policyHolders.length;
      const highValueCustomers = policyHolders.filter(p => {
        const tier = display(p.tier);
        return tier === 'Platinum' || tier === 'Gold';
      }).length;

      // Calculate Average CLV using only the clv field from x_hete_clv_maximiz_policy_holders table
      const avgCLV = policyHolders.length > 0
        ? policyHolders.reduce((sum, p) => {
            const clv = parseFloat(display(p.clv)) || 0;
            return sum + clv;
          }, 0) / policyHolders.length
        : 0;

      const highRiskCustomers = policyHolders.filter(p => {
        const churnRisk = parseFloat(display(p.churn_risk)) || 0;
        return churnRisk > 60;
      }).length;

      const churnRisk = totalCustomers > 0 ? (highRiskCustomers / totalCustomers) * 100 : 0;

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const renewalsThisMonth = policyHolders.filter(p => {
        const renewalDate = display(p.renewal_date);
        if (!renewalDate) return false;
        const rDate = new Date(renewalDate);
        return rDate >= startOfMonth && rDate <= endOfMonth;
      }).length;

      const activeCampaigns = campaigns.filter(c => 
        display(c.status) === 'launched' || display(c.status) === 'scheduled'
      ).length;

      setDashboardData({
        totalCustomers,
        highValueCustomers,
        avgCLV: Math.round(avgCLV),
        churnRisk: Math.round(churnRisk * 100) / 100,
        renewalsThisMonth,
        activeCampaigns
      });

    } catch (error) {
      console.error('Error loading simple dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTableData = async (tableName) => {
    try {
      const response = await fetch(`/api/now/table/${tableName}?sysparm_display_value=all&sysparm_limit=1000`, {
        headers: {
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        }
      });
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="simple-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="simple-dashboard">
      <div className="dashboard-header">
        <h1>CLV Dashboard</h1>
        <p>Key Performance Indicators</p>
      </div>

      <div className="simple-kpi-grid">
        <div className="simple-kpi-card">
          <div className="kpi-icon">👥</div>
          <div className="kpi-content">
            <div className="kpi-value">{dashboardData.totalCustomers.toLocaleString()}</div>
            <div className="kpi-label">Total Customers</div>
          </div>
        </div>

        <div className="simple-kpi-card high-value">
          <div className="kpi-icon">⭐</div>
          <div className="kpi-content">
            <div className="kpi-value">{dashboardData.highValueCustomers.toLocaleString()}</div>
            <div className="kpi-label">High-Value Customers</div>
            <div className="kpi-sublabel">Platinum & Gold</div>
          </div>
        </div>

        <div className="simple-kpi-card clv">
          <div className="kpi-icon">💰</div>
          <div className="kpi-content">
            <div className="kpi-value">${dashboardData.avgCLV.toLocaleString()}</div>
            <div className="kpi-label">Average CLV</div>
          </div>
        </div>

        <div className="simple-kpi-card risk">
          <div className="kpi-icon">⚠️</div>
          <div className="kpi-content">
            <div className="kpi-value">{dashboardData.churnRisk}%</div>
            <div className="kpi-label">Churn Risk</div>
          </div>
        </div>

        <div className="simple-kpi-card renewals">
          <div className="kpi-icon">🔄</div>
          <div className="kpi-content">
            <div className="kpi-value">{dashboardData.renewalsThisMonth}</div>
            <div className="kpi-label">Renewals This Month</div>
          </div>
        </div>

        <div className="simple-kpi-card campaigns">
          <div className="kpi-icon">📢</div>
          <div className="kpi-content">
            <div className="kpi-value">{dashboardData.activeCampaigns}</div>
            <div className="kpi-label">Active Campaigns</div>
          </div>
        </div>
      </div>
    </div>
  );
}