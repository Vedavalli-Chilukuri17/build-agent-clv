import '@servicenow/sdk/global';
import { 
  Table, 
  StringColumn, 
  DateColumn, 
  ChoiceColumn,
  DecimalColumn,
  IntegerColumn
} from '@servicenow/sdk/core';

// Renewal Tracker table for pipeline management
export const x_hete_clv_maximiz_renewal_tracker = Table({
  name: 'x_hete_clv_maximiz_renewal_tracker',
  label: 'Renewal Tracker',
  schema: {
    customer_name: StringColumn({
      label: 'Customer Name',
      maxLength: 100,
      mandatory: true
    }),
    
    customer_id: StringColumn({
      label: 'Customer ID',
      maxLength: 50,
      mandatory: true
    }),
    
    renewal_date: DateColumn({
      label: 'Renewal Date',
      mandatory: true
    }),
    
    status: ChoiceColumn({
      label: 'Status',
      choices: {
        pending: { label: 'Pending', sequence: 0 },
        in_progress: { label: 'In Progress', sequence: 1 },
        confirmed: { label: 'Confirmed', sequence: 2 },
        at_risk: { label: 'At Risk', sequence: 3 }
      },
      default: 'pending',
      mandatory: true
    }),
    
    opportunity_score: IntegerColumn({
      label: 'Opportunity Score',
      default: 0
    }),
    
    renewal_amount: DecimalColumn({
      label: 'Renewal Amount',
      scale: 2,
      default: 0
    }),
    
    clv_score: DecimalColumn({
      label: 'CLV Score',
      scale: 2,
      default: 0
    }),
    
    customer_tier: ChoiceColumn({
      label: 'Customer Tier',
      choices: {
        platinum: { label: 'Platinum', sequence: 0 },
        gold: { label: 'Gold', sequence: 1 },
        silver: { label: 'Silver', sequence: 2 },
        bronze: { label: 'Bronze', sequence: 3 }
      },
      default: 'silver'
    }),
    
    engagement_score: IntegerColumn({
      label: 'Engagement Score',
      default: 0
    }),
    
    churn_risk: ChoiceColumn({
      label: 'Churn Risk',
      choices: {
        low: { label: 'Low', sequence: 0 },
        medium: { label: 'Medium', sequence: 1 },
        high: { label: 'High', sequence: 2 }
      },
      default: 'medium'
    }),
    
    notes: StringColumn({
      label: 'Notes',
      maxLength: 1000
    })
  },
  
  // Table configuration
  display: 'customer_name',
  allow_web_service_access: true,
  actions: ['create', 'read', 'update', 'delete'],
  accessible_from: 'public'
});