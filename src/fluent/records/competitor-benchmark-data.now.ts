import '@servicenow/sdk/global';
import { Record } from '@servicenow/sdk/core';

// Comprehensive competitor benchmark data for market intelligence
const competitorBenchmarks = [
  {
    $id: Now.ID['competitor_1'],
    table: 'x_hete_clv_maximiz_competitor_benchmark',
    data: {
      competitor_name: 'StateGuard Insurance',
      product_category: 'Auto Insurance',
      market_share: 18.5,
      avg_premium: 1250,
      claims_ratio: 0.68,
      customer_satisfaction: 4.2,
      renewal_rate: 85.3,
      data_source: 'Industry Report Q3 2024',
      last_updated: '2024-03-15 10:30:00'
    }
  },
  {
    $id: Now.ID['competitor_2'],
    table: 'x_hete_clv_maximiz_competitor_benchmark',
    data: {
      competitor_name: 'AllProtect Financial',
      product_category: 'Home Insurance',
      market_share: 22.1,
      avg_premium: 1850,
      claims_ratio: 0.72,
      customer_satisfaction: 3.9,
      renewal_rate: 82.7,
      data_source: 'Market Research Analytics',
      last_updated: '2024-03-10 14:15:00'
    }
  },
  {
    $id: Now.ID['competitor_3'],
    table: 'x_hete_clv_maximiz_competitor_benchmark',
    data: {
      competitor_name: 'SecureLife Corp',
      product_category: 'Life Insurance',
      market_share: 15.3,
      avg_premium: 2200,
      claims_ratio: 0.45,
      customer_satisfaction: 4.5,
      renewal_rate: 91.2,
      data_source: 'Industry Benchmarking Study',
      last_updated: '2024-03-08 09:45:00'
    }
  },
  {
    $id: Now.ID['competitor_4'],
    table: 'x_hete_clv_maximiz_competitor_benchmark',
    data: {
      competitor_name: 'PrimeCoverage Inc',
      product_category: 'Health Insurance',
      market_share: 12.8,
      avg_premium: 3150,
      claims_ratio: 0.78,
      customer_satisfaction: 3.7,
      renewal_rate: 79.4,
      data_source: 'Healthcare Insurance Analysis',
      last_updated: '2024-03-12 16:20:00'
    }
  },
  {
    $id: Now.ID['competitor_5'],
    table: 'x_hete_clv_maximiz_competitor_benchmark',
    data: {
      competitor_name: 'TrustShield Mutual',
      product_category: 'Business Insurance',
      market_share: 9.7,
      avg_premium: 4500,
      claims_ratio: 0.52,
      customer_satisfaction: 4.1,
      renewal_rate: 87.9,
      data_source: 'Commercial Insurance Survey',
      last_updated: '2024-03-14 11:30:00'
    }
  },
  {
    $id: Now.ID['competitor_6'],
    table: 'x_hete_clv_maximiz_competitor_benchmark',
    data: {
      competitor_name: 'FlexiCare Insurance',
      product_category: 'Travel Insurance',
      market_share: 6.2,
      avg_premium: 850,
      claims_ratio: 0.38,
      customer_satisfaction: 4.0,
      renewal_rate: 73.5,
      data_source: 'Travel Insurance Market Report',
      last_updated: '2024-03-11 08:15:00'
    }
  },
  {
    $id: Now.ID['competitor_7'],
    table: 'x_hete_clv_maximiz_competitor_benchmark',
    data: {
      competitor_name: 'RapidShield Insurance',
      product_category: 'Auto Insurance',
      market_share: 14.2,
      avg_premium: 1380,
      claims_ratio: 0.65,
      customer_satisfaction: 4.3,
      renewal_rate: 88.1,
      data_source: 'Auto Insurance Quarterly Report',
      last_updated: '2024-03-16 13:45:00'
    }
  },
  {
    $id: Now.ID['competitor_8'],
    table: 'x_hete_clv_maximiz_competitor_benchmark',
    data: {
      competitor_name: 'Guardian Plus Insurance',
      product_category: 'Property Insurance',
      market_share: 11.6,
      avg_premium: 2100,
      claims_ratio: 0.58,
      customer_satisfaction: 4.4,
      renewal_rate: 89.3,
      data_source: 'Property Insurance Analysis 2024',
      last_updated: '2024-03-13 10:20:00'
    }
  },
  {
    $id: Now.ID['competitor_9'],
    table: 'x_hete_clv_maximiz_competitor_benchmark',
    data: {
      competitor_name: 'VitalCover Solutions',
      product_category: 'Health Insurance',
      market_share: 8.9,
      avg_premium: 2850,
      claims_ratio: 0.75,
      customer_satisfaction: 3.8,
      renewal_rate: 81.7,
      data_source: 'Health Insurance Market Study',
      last_updated: '2024-03-09 15:30:00'
    }
  },
  {
    $id: Now.ID['competitor_10'],
    table: 'x_hete_clv_maximiz_competitor_benchmark',
    data: {
      competitor_name: 'EliteRisk Management',
      product_category: 'Commercial Insurance',
      market_share: 7.3,
      avg_premium: 5200,
      claims_ratio: 0.48,
      customer_satisfaction: 4.6,
      renewal_rate: 92.5,
      data_source: 'Commercial Risk Assessment Report',
      last_updated: '2024-03-17 09:15:00'
    }
  },
  {
    $id: Now.ID['competitor_11'],
    table: 'x_hete_clv_maximiz_competitor_benchmark',
    data: {
      competitor_name: 'SwiftCover Direct',
      product_category: 'Digital Insurance',
      market_share: 5.8,
      avg_premium: 980,
      claims_ratio: 0.42,
      customer_satisfaction: 4.1,
      renewal_rate: 76.8,
      data_source: 'Digital Insurance Trends 2024',
      last_updated: '2024-03-18 11:45:00'
    }
  },
  {
    $id: Now.ID['competitor_12'],
    table: 'x_hete_clv_maximiz_competitor_benchmark',
    data: {
      competitor_name: 'MetroProtect Insurance',
      product_category: 'Urban Insurance',
      market_share: 4.7,
      avg_premium: 1650,
      claims_ratio: 0.69,
      customer_satisfaction: 3.9,
      renewal_rate: 83.4,
      data_source: 'Urban Insurance Market Analysis',
      last_updated: '2024-03-19 14:20:00'
    }
  }
];

// Export all competitor benchmark records
competitorBenchmarks.forEach(benchmark => {
  Record(benchmark);
});