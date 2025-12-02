import '@servicenow/sdk/global';
import { Record } from '@servicenow/sdk/core';

// Sample product performance records
Record({
  $id: Now.ID['product_001'],
  table: 'x_hete_clv_maximiz_product_performance',
  data: {
    product_name: 'Auto Insurance Premium',
    performance_label: 'strong',
    premium_vs_competitor_1: 8.5,
    premium_vs_competitor_2: 12.3,
    renewal_vs_competitor_1: 15.2,
    renewal_vs_competitor_2: 9.8,
    our_claims_ratio: 0.72,
    our_add_on_rate: 0.34,
    data_source: 'Market Research Q4 2023',
    last_updated: '2024-01-15 10:30:00'
  }
});

Record({
  $id: Now.ID['product_002'],
  table: 'x_hete_clv_maximiz_product_performance',
  data: {
    product_name: 'Home Insurance Standard',
    performance_label: 'competitive',
    premium_vs_competitor_1: -3.2,
    premium_vs_competitor_2: 5.7,
    renewal_vs_competitor_1: -8.1,
    renewal_vs_competitor_2: 11.4,
    our_claims_ratio: 0.68,
    our_add_on_rate: 0.28,
    data_source: 'Internal Analytics',
    last_updated: '2024-01-18 14:15:00'
  }
});

Record({
  $id: Now.ID['product_003'],
  table: 'x_hete_clv_maximiz_product_performance',
  data: {
    product_name: 'Life Insurance Term',
    performance_label: 'challenged',
    premium_vs_competitor_1: -12.5,
    premium_vs_competitor_2: -8.9,
    renewal_vs_competitor_1: -18.3,
    renewal_vs_competitor_2: -14.7,
    our_claims_ratio: 0.85,
    our_add_on_rate: 0.15,
    data_source: 'Competitor Analysis Report',
    last_updated: '2024-01-20 09:45:00'
  }
});

Record({
  $id: Now.ID['product_004'],
  table: 'x_hete_clv_maximiz_product_performance',
  data: {
    product_name: 'Travel Insurance',
    performance_label: 'strong',
    premium_vs_competitor_1: 18.7,
    premium_vs_competitor_2: 22.1,
    renewal_vs_competitor_1: 25.4,
    renewal_vs_competitor_2: 19.8,
    our_claims_ratio: 0.45,
    our_add_on_rate: 0.52,
    data_source: 'Travel Insurance Benchmark Study',
    last_updated: '2024-01-22 16:20:00'
  }
});

Record({
  $id: Now.ID['product_005'],
  table: 'x_hete_clv_maximiz_product_performance',
  data: {
    product_name: 'Health Insurance Plus',
    performance_label: 'competitive',
    premium_vs_competitor_1: 2.8,
    premium_vs_competitor_2: -1.4,
    renewal_vs_competitor_1: 7.6,
    renewal_vs_competitor_2: 3.9,
    our_claims_ratio: 0.78,
    our_add_on_rate: 0.31,
    data_source: 'Healthcare Market Analysis',
    last_updated: '2024-01-25 11:10:00'
  }
});

Record({
  $id: Now.ID['product_006'],
  table: 'x_hete_clv_maximiz_product_performance',
  data: {
    product_name: 'Umbrella Liability',
    performance_label: 'strong',
    premium_vs_competitor_1: 14.3,
    premium_vs_competitor_2: 10.9,
    renewal_vs_competitor_1: 20.1,
    renewal_vs_competitor_2: 16.7,
    our_claims_ratio: 0.38,
    our_add_on_rate: 0.45,
    data_source: 'Specialty Insurance Report',
    last_updated: '2024-01-28 13:25:00'
  }
});