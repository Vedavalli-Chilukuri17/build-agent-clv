import '@servicenow/sdk/global';
import { 
  Table, 
  StringColumn, 
  DateColumn, 
  DateTimeColumn, 
  BooleanColumn, 
  ChoiceColumn 
} from '@servicenow/sdk/core';

// Campaign table to store all campaign configurations and launch data
export const x_hete_clv_maximiz_campaigns = Table({
  name: 'x_hete_clv_maximiz_campaigns',
  label: 'CLV Campaigns',
  schema: {
    // Basic Campaign Details
    campaign_name: StringColumn({
      label: 'Campaign Name',
      maxLength: 100,
      mandatory: true
    }),
    
    campaign_type: ChoiceColumn({
      label: 'Type',
      choices: {
        retention: { label: 'Retention', sequence: 0 },
        upsell: { label: 'Upsell', sequence: 1 },
        win_back: { label: 'Win-back', sequence: 2 },
        cross_sell: { label: 'Cross-sell', sequence: 3 }
      },
      default: 'retention'
    }),
    
    channel: ChoiceColumn({
      label: 'Channel',
      choices: {
        email: { label: 'Email', sequence: 0 },
        sms: { label: 'SMS', sequence: 1 },
        push_notification: { label: 'Push Notification', sequence: 2 },
        in_app_messaging: { label: 'In-app Messaging', sequence: 3 }
      },
      default: 'email'
    }),
    
    priority: ChoiceColumn({
      label: 'Priority',
      choices: {
        high: { label: 'High', sequence: 0 },
        medium: { label: 'Medium', sequence: 1 },
        low: { label: 'Low', sequence: 2 }
      },
      default: 'medium'
    }),
    
    // Product Propensity - Store as comma-separated values
    product_propensity: StringColumn({
      label: 'Product Propensity',
      maxLength: 500
    }),
    
    // Customer Tier
    customer_tier: ChoiceColumn({
      label: 'Customer Tier',
      choices: {
        platinum: { label: 'Platinum', sequence: 0 },
        gold: { label: 'Gold', sequence: 1 },
        silver: { label: 'Silver', sequence: 2 },
        bronze: { label: 'Bronze', sequence: 3 }
      },
      default: 'gold'
    }),
    
    // Content Fields
    tone_style: ChoiceColumn({
      label: 'Tone Style',
      choices: {
        professional: { label: 'Professional', sequence: 0 },
        friendly: { label: 'Friendly', sequence: 1 },
        urgent: { label: 'Urgent', sequence: 2 }
      },
      default: 'professional'
    }),
    
    subject_line: StringColumn({
      label: 'Subject Line',
      maxLength: 255
    }),
    
    message_body: StringColumn({
      label: 'Message Body',
      maxLength: 4000
    }),
    
    // Schedule Fields
    launch_date: DateColumn({
      label: 'Launch Date'
    }),
    
    launch_time: StringColumn({
      label: 'Launch Time',
      maxLength: 10
    }),
    
    // Options
    send_test_email: BooleanColumn({
      label: 'Send Test Email First',
      default: false
    }),
    
    enable_ab_testing: BooleanColumn({
      label: 'Enable A/B Testing',
      default: false
    }),
    
    // Status and Metadata - Updated to include 'scheduled' status
    status: ChoiceColumn({
      label: 'Status',
      choices: {
        draft: { label: 'Draft', sequence: 0 },
        scheduled: { label: 'Scheduled', sequence: 1 },
        launched: { label: 'Launched', sequence: 2 },
        completed: { label: 'Completed', sequence: 3 },
        cancelled: { label: 'Cancelled', sequence: 4 }
      },
      default: 'draft'
    }),
    
    launched_at: DateTimeColumn({
      label: 'Launched At'
    }),
    
    created_by: StringColumn({
      label: 'Created By',
      maxLength: 100,
      default: 'System'
    }),
    
    estimated_reach: StringColumn({
      label: 'Estimated Reach',
      maxLength: 20
    })
  },
  
  // Table configuration
  display: 'campaign_name',
  allow_web_service_access: true,
  actions: ['create', 'read', 'update', 'delete'],
  accessible_from: 'public'
});