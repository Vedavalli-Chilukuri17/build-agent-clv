import '@servicenow/sdk/global';
import { 
  Table, 
  StringColumn, 
  DecimalColumn,
  ChoiceColumn,
  DateTimeColumn
} from '@servicenow/sdk/core';

// Product Performance table for benchmarking
export const x_hete_clv_maximiz_product_performance = Table({
  name: 'x_hete_clv_maximiz_product_performance',
  label: 'Product Performance',
  schema: {
    product_name: StringColumn({
      label: 'Product Name',
      maxLength: 100,
      mandatory: true
    }),
    
    performance_label: ChoiceColumn({
      label: 'Performance Label',
      choices: {
        strong: { label: 'Strong', sequence: 0 },
        competitive: { label: 'Competitive', sequence: 1 },
        challenged: { label: 'Challenged', sequence: 2 }
      },
      default: 'competitive',
      mandatory: true
    }),
    
    premium_vs_competitor_1: DecimalColumn({
      label: 'Premium vs Competitor 1',
      scale: 2,
      default: 0
    }),
    
    premium_vs_competitor_2: DecimalColumn({
      label: 'Premium vs Competitor 2',
      scale: 2,
      default: 0
    }),
    
    renewal_vs_competitor_1: DecimalColumn({
      label: 'Renewal vs Competitor 1',
      scale: 2,
      default: 0
    }),
    
    renewal_vs_competitor_2: DecimalColumn({
      label: 'Renewal vs Competitor 2',
      scale: 2,
      default: 0
    }),
    
    our_claims_ratio: DecimalColumn({
      label: 'Our Claims Ratio',
      scale: 2,
      default: 0
    }),
    
    our_add_on_rate: DecimalColumn({
      label: 'Our Add-On Rate',
      scale: 2,
      default: 0
    }),
    
    data_source: StringColumn({
      label: 'Data Source',
      maxLength: 255,
      default: 'System Generated'
    }),
    
    last_updated: DateTimeColumn({
      label: 'Last Updated'
    })
  },
  
  // Table configuration
  display: 'product_name',
  allow_web_service_access: true,
  actions: ['create', 'read', 'update', 'delete'],
  accessible_from: 'public'
});