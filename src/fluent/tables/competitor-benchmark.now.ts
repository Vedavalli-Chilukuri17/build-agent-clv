import '@servicenow/sdk/global';
import { 
  Table, 
  StringColumn, 
  DecimalColumn,
  DateTimeColumn
} from '@servicenow/sdk/core';

// Competitor Benchmark table for comparison data
export const x_hete_clv_maximiz_competitor_benchmark = Table({
  name: 'x_hete_clv_maximiz_competitor_benchmark',
  label: 'Competitor Benchmark',
  schema: {
    competitor_name: StringColumn({
      label: 'Competitor Name',
      maxLength: 100,
      mandatory: true
    }),
    
    product_category: StringColumn({
      label: 'Product Category',
      maxLength: 100,
      mandatory: true
    }),
    
    market_share: DecimalColumn({
      label: 'Market Share',
      scale: 2,
      default: 0
    }),
    
    avg_premium: DecimalColumn({
      label: 'Average Premium',
      scale: 2,
      default: 0
    }),
    
    claims_ratio: DecimalColumn({
      label: 'Claims Ratio',
      scale: 2,
      default: 0
    }),
    
    customer_satisfaction: DecimalColumn({
      label: 'Customer Satisfaction',
      scale: 2,
      default: 0
    }),
    
    renewal_rate: DecimalColumn({
      label: 'Renewal Rate',
      scale: 2,
      default: 0
    }),
    
    data_source: StringColumn({
      label: 'Data Source',
      maxLength: 255,
      default: 'Market Research'
    }),
    
    last_updated: DateTimeColumn({
      label: 'Last Updated'
    })
  },
  
  // Table configuration
  display: 'competitor_name',
  allow_web_service_access: true,
  actions: ['create', 'read', 'update', 'delete'],
  accessible_from: 'public'
});