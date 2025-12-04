import '@servicenow/sdk/global';
import { 
  Table, 
  StringColumn, 
  DecimalColumn,
  DateTimeColumn,
  ChoiceColumn
} from '@servicenow/sdk/core';

// Enhanced Competitor Benchmark table for product performance analysis
export const x_hete_clv_maximiz_competitor_benchmark = Table({
  name: 'x_hete_clv_maximiz_competitor_benchmark',
  label: 'Competitor Benchmark',
  schema: {
    product: StringColumn({
      label: 'Product',
      maxLength: 100,
      mandatory: true
    }),
    
    purchase_frequency: ChoiceColumn({
      label: 'Purchase Frequency',
      choices: {
        strong: {
          label: 'Strong',
          sequence: 0
        },
        competitive: {
          label: 'Competitive', 
          sequence: 1
        },
        challenged: {
          label: 'Challenged',
          sequence: 2
        }
      },
      dropdown: 'dropdown_with_none'
    }),
    
    premium_vs_competitor: StringColumn({
      label: 'Premium vs Competitor',
      maxLength: 20,
      default: '0%'
    }),
    
    revenue_per_customer: StringColumn({
      label: 'Revenue per Customer',
      maxLength: 20,
      default: '$0K'
    }),
    
    campaign_uplift: StringColumn({
      label: 'Campaign Uplift',
      maxLength: 20,
      default: '0%'
    }),
    
    // Keep original fields for backward compatibility
    competitor_name: StringColumn({
      label: 'Competitor Name',
      maxLength: 100
    }),
    
    product_category: StringColumn({
      label: 'Product Category',
      maxLength: 100
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
  display: 'product',
  allow_web_service_access: true,
  actions: ['create', 'read', 'update', 'delete'],
  accessible_from: 'public'
});