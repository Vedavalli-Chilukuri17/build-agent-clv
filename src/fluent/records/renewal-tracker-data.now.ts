import '@servicenow/sdk/global';
import { Record } from '@servicenow/sdk/core';

// Sample renewal tracker records
Record({
  $id: Now.ID['renewal_001'],
  table: 'x_hete_clv_maximiz_renewal_tracker',
  data: {
    customer_name: 'Sarah Johnson',
    customer_id: 'CUST_001',
    renewal_date: '2024-02-15',
    status: 'pending',
    opportunity_score: 85,
    renewal_amount: 2450.00,
    clv_score: 7.8,
    customer_tier: 'gold',
    engagement_score: 72,
    churn_risk: 'low',
    notes: 'High-value customer with excellent payment history'
  }
});

Record({
  $id: Now.ID['renewal_002'],
  table: 'x_hete_clv_maximiz_renewal_tracker',
  data: {
    customer_name: 'Michael Chen',
    customer_id: 'CUST_002',
    renewal_date: '2024-02-20',
    status: 'in_progress',
    opportunity_score: 92,
    renewal_amount: 3200.00,
    clv_score: 8.5,
    customer_tier: 'platinum',
    engagement_score: 88,
    churn_risk: 'low',
    notes: 'Platinum member with multiple policy bundle'
  }
});

Record({
  $id: Now.ID['renewal_003'],
  table: 'x_hete_clv_maximiz_renewal_tracker',
  data: {
    customer_name: 'Emma Rodriguez',
    customer_id: 'CUST_003',
    renewal_date: '2024-02-25',
    status: 'at_risk',
    opportunity_score: 45,
    renewal_amount: 1800.00,
    clv_score: 5.2,
    customer_tier: 'silver',
    engagement_score: 32,
    churn_risk: 'high',
    notes: 'Declining engagement, requires immediate attention'
  }
});

Record({
  $id: Now.ID['renewal_004'],
  table: 'x_hete_clv_maximiz_renewal_tracker',
  data: {
    customer_name: 'David Park',
    customer_id: 'CUST_004',
    renewal_date: '2024-03-01',
    status: 'confirmed',
    opportunity_score: 96,
    renewal_amount: 4100.00,
    clv_score: 9.1,
    customer_tier: 'platinum',
    engagement_score: 94,
    churn_risk: 'low',
    notes: 'Premium customer with referral bonus eligibility'
  }
});

Record({
  $id: Now.ID['renewal_005'],
  table: 'x_hete_clv_maximiz_renewal_tracker',
  data: {
    customer_name: 'Lisa Thompson',
    customer_id: 'CUST_005',
    renewal_date: '2024-03-05',
    status: 'pending',
    opportunity_score: 67,
    renewal_amount: 1950.00,
    clv_score: 6.4,
    customer_tier: 'gold',
    engagement_score: 58,
    churn_risk: 'medium',
    notes: 'Mid-tier customer with potential for upselling'
  }
});

Record({
  $id: Now.ID['renewal_006'],
  table: 'x_hete_clv_maximiz_renewal_tracker',
  data: {
    customer_name: 'Robert Wilson',
    customer_id: 'CUST_006',
    renewal_date: '2024-03-10',
    status: 'at_risk',
    opportunity_score: 38,
    renewal_amount: 1400.00,
    clv_score: 4.1,
    customer_tier: 'bronze',
    engagement_score: 25,
    churn_risk: 'high',
    notes: 'Price-sensitive customer, consider retention offers'
  }
});