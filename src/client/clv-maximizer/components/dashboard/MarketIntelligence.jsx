import React from 'react';
import './MarketIntelligence.css';

export default function MarketIntelligence({ data, onIntelligenceClick }) {
  const renderProductBenchmarking = () => {
    if (!data.productBenchmarking || data.productBenchmarking.length === 0) {
      return (
        <div className="product-benchmarking">
          <h4>Product Benchmarking vs. Competitors</h4>
          <div className="no-data">No product performance data available</div>
        </div>
      );
    }

    return (
      <div className="product-benchmarking">
        <h4>Product Benchmarking vs. Competitors</h4>
        <div className="benchmark-table">
          <div className="benchmark-header">
            <div className="product-name">Product</div>
            <div className="premium-vs-comp">Premium vs Comp 1</div>
            <div className="premium-vs-comp">Premium vs Comp 2</div>
            <div className="renewal-vs-comp">Renewal vs Comp 1</div>
            <div className="renewal-vs-comp">Renewal vs Comp 2</div>
            <div className="claims-ratio">Claims Ratio</div>
            <div className="performance-label">Performance</div>
          </div>
          
          {data.productBenchmarking.map((product, index) => (
            <div 
              key={index}
              className="benchmark-row"
              onClick={() => onIntelligenceClick && onIntelligenceClick('product-benchmark', product)}
            >
              <div className="product-name">{product.productName}</div>
              <div className={`premium-vs-comp ${product.premiumVsComp1 >= 0 ? 'positive' : 'negative'}`}>
                {product.premiumVsComp1 >= 0 ? '+' : ''}{product.premiumVsComp1.toFixed(1)}%
              </div>
              <div className={`premium-vs-comp ${product.premiumVsComp2 >= 0 ? 'positive' : 'negative'}`}>
                {product.premiumVsComp2 >= 0 ? '+' : ''}{product.premiumVsComp2.toFixed(1)}%
              </div>
              <div className={`renewal-vs-comp ${product.renewalVsComp1 >= 0 ? 'positive' : 'negative'}`}>
                {product.renewalVsComp1 >= 0 ? '+' : ''}{product.renewalVsComp1.toFixed(1)}%
              </div>
              <div className={`renewal-vs-comp ${product.renewalVsComp2 >= 0 ? 'positive' : 'negative'}`}>
                {product.renewalVsComp2 >= 0 ? '+' : ''}{product.renewalVsComp2.toFixed(1)}%
              </div>
              <div className="claims-ratio">{(product.claimsRatio * 100).toFixed(1)}%</div>
              <div className={`performance-indicator ${product.performanceLabel}`}>
                {product.performanceLabel.charAt(0).toUpperCase() + product.performanceLabel.slice(1)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCustomerTierDistribution = () => {
    if (!data.tierDistribution) return null;

    const totalCustomers = Object.values(data.tierDistribution).reduce((sum, count) => sum + count, 0);
    const tierData = Object.entries(data.tierDistribution).map(([tier, count]) => ({
      tier,
      count,
      percentage: totalCustomers > 0 ? ((count / totalCustomers) * 100).toFixed(1) : 0
    }));

    const tierColors = {
      'Platinum': '#e5e7eb',
      'Gold': '#fbbf24', 
      'Silver': '#9ca3af',
      'Bronze': '#92400e',
      'Unknown': '#6b7280'
    };

    return (
      <div className="customer-tier-distribution">
        <h4>Customer Tier Distribution Analytics</h4>
        <div className="tier-analytics">
          <div className="tier-summary">
            <span className="total-customers">{totalCustomers} Total Customers</span>
          </div>
          
          <div className="tier-breakdown">
            {tierData.map(({ tier, count, percentage }) => (
              <div 
                key={tier}
                className="tier-segment"
                onClick={() => onIntelligenceClick && onIntelligenceClick('tier-distribution', { tier, count, percentage })}
              >
                <div className="tier-info">
                  <span className="tier-label">{tier}</span>
                  <span className="tier-stats">{count} ({percentage}%)</span>
                </div>
                <div className="tier-bar">
                  <div 
                    className="tier-fill"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: tierColors[tier] || '#6b7280'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCLVBandDistribution = () => {
    if (!data.clvBands) return null;

    const totalCustomers = Object.values(data.clvBands).reduce((sum, count) => sum + count, 0);
    const clvBandData = Object.entries(data.clvBands).map(([range, count]) => ({
      range,
      count,
      percentage: totalCustomers > 0 ? ((count / totalCustomers) * 100).toFixed(1) : 0
    }));

    const bandColors = {
      '$0-$5K': '#fca5a5',
      '$5K-$15K': '#fbbf24',
      '$15K-$30K': '#34d399',
      '$30K+': '#60a5fa'
    };

    return (
      <div className="clv-band-distribution">
        <h4>CLV Band Distribution</h4>
        <div className="clv-analytics">
          <div className="clv-summary">
            <div className="total-clv">
              <span className="clv-label">Total Customers</span>
              <span className="clv-value">{totalCustomers.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="clv-bands">
            {clvBandData.map(({ range, count, percentage }) => (
              <div 
                key={range}
                className="clv-band"
                onClick={() => onIntelligenceClick && onIntelligenceClick('clv-band', { range, count, percentage })}
              >
                <div className="band-info">
                  <span className="band-range">{range}</span>
                  <span className="band-stats">{count} customers ({percentage}%)</span>
                </div>
                <div className="band-bar">
                  <div 
                    className="band-fill"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: bandColors[range] || '#6b7280'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderRiskFactorAnalysis = () => {
    if (!data.riskFactors) return null;

    const riskFactorData = [
      { factor: 'Low Credit Score (<600)', count: data.riskFactors.lowCredit },
      { factor: 'High Churn Risk (>70%)', count: data.riskFactors.highChurn },
      { factor: 'High Credit Utilization (>80%)', count: data.riskFactors.highUtilization },
      { factor: 'Bankruptcy History', count: data.riskFactors.bankruptcy }
    ];

    const totalCustomers = Object.values(data.riskFactors).reduce((sum, count) => sum + count, 0);

    return (
      <div className="risk-factor-analysis">
        <h4>Risk Factor Analysis (Credit, Property, Combined)</h4>
        <div className="risk-distribution">
          <div className="risk-summary">
            <span className="total-risk-factors">{totalCustomers} Total Risk Factors Identified</span>
          </div>
          
          <div className="risk-factors">
            {riskFactorData.map(({ factor, count }) => {
              const percentage = totalCustomers > 0 ? ((count / totalCustomers) * 100).toFixed(1) : 0;
              return (
                <div 
                  key={factor}
                  className="risk-factor-item"
                  onClick={() => onIntelligenceClick && onIntelligenceClick('risk-factor', { factor, count })}
                >
                  <div className="factor-info">
                    <span className="factor-name">{factor}</span>
                    <span className="factor-stats">{count} customers ({percentage}%)</span>
                  </div>
                  <div className="factor-bar">
                    <div 
                      className="factor-fill"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderClaimsImpactAnalysis = () => {
    if (!data.claimsAnalysis) return null;

    const avgClaimsRatio = data.claimsAnalysis.avgClaimsRatio * 100;
    const claimsImpactCustomers = data.claimsAnalysis.claimsImpactOnRenewal;

    return (
      <div className="claims-impact-analysis">
        <h4>Claims Impact Analysis</h4>
        
        <div className="claims-overview">
          <div className="claims-stat">
            <span className="stat-value">{avgClaimsRatio.toFixed(2)}%</span>
            <span className="stat-label">Average Claims Ratio</span>
          </div>
          <div className="claims-stat">
            <span className="stat-value">{claimsImpactCustomers}</span>
            <span className="stat-label">High-Risk Customers</span>
          </div>
        </div>

        <div className="claims-impact-details">
          <h5>Claims Impact on Customer Behavior</h5>
          <div className="impact-metrics">
            <div className="impact-item">
              <span className="impact-label">Customers with High Churn Risk</span>
              <span className="impact-value">{claimsImpactCustomers} customers</span>
            </div>
            <div className="impact-item">
              <span className="impact-label">Estimated Renewal Impact</span>
              <span className="impact-value">{claimsImpactCustomers > 10 ? 'High' : 'Low'} Impact</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCompetitorAnalysis = () => {
    if (!data.competitorData || data.competitorData.length === 0) {
      return (
        <div className="competitor-analysis">
          <h4>Competitor Analysis</h4>
          <div className="no-data">No competitor data available</div>
        </div>
      );
    }

    return (
      <div className="competitor-analysis">
        <h4>Competitor Market Analysis</h4>
        <div className="competitor-grid">
          {data.competitorData.map((competitor, index) => (
            <div 
              key={index}
              className="competitor-card"
              onClick={() => onIntelligenceClick && onIntelligenceClick('competitor', competitor)}
            >
              <div className="competitor-header">
                <span className="competitor-name">{competitor.name}</span>
              </div>
              <div className="competitor-metrics">
                <div className="metric-row">
                  <span className="metric-label">Market Share:</span>
                  <span className="metric-value">{competitor.marketShare.toFixed(1)}%</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Renewal Rate:</span>
                  <span className="metric-value">{competitor.renewalRate.toFixed(1)}%</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Claims Ratio:</span>
                  <span className="metric-value">{competitor.claimsRatio.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!data || Object.keys(data).length === 0) {
    return (
      <section className="market-intelligence">
        <h2>Market Intelligence</h2>
        <div className="intelligence-loading">Loading market intelligence...</div>
      </section>
    );
  }

  return (
    <section className="market-intelligence">
      <h2>Market Intelligence</h2>
      
      <div className="intelligence-grid">
        <div className="intelligence-column">
          {renderProductBenchmarking()}
          {renderCLVBandDistribution()}
        </div>
        
        <div className="intelligence-column">
          {renderCustomerTierDistribution()}
          {renderRiskFactorAnalysis()}
        </div>
        
        <div className="intelligence-column full-width">
          {renderClaimsImpactAnalysis()}
          {renderCompetitorAnalysis()}
        </div>
      </div>
    </section>
  );
}