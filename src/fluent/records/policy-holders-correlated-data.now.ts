import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Policy Holders with Correlated Data
// Tier-CLV and Renewal Date-Risk correlations

// PLATINUM TIER - HIGH CLV - HIGH RISK (Renewal within 60 days)
Record({
  $id: Now.ID['ph_plat_high_001'],
  table: 'x_hete_clv_maximiz_policy_holders',
  data: {
    customer_id: 'PLAT001',
    name: 'Alexander Wellington',
    first_name: 'Alexander',
    last_name: 'Wellington',
    email: 'alex.wellington@email.com',
    phone: '+1-555-0001',
    age: 52,
    tier: 'platinum',
    clv: 45000.00,
    lifetime_value: 125000.00,
    clv_score: 95.5,
    renewal_date: '2025-02-15', // ~47 days from now - HIGH RISK
    risk: 'high',
    u_risk: 'high',
    churn_risk: 85,
    credit_score: 780,
    credit_utilization_percent: 15,
    tenure_years: 8,
    engagement_score: 92,
    preferred_channel: 'Phone',
    app_sessions_30_days: 25,
    website_visits_30_days: 45,
    avg_session_time_min: 18,
    quote_views: 12,
    number_of_open_accounts: 4,
    number_of_closed_accounts: 1,
    credit_inquiries_last_6m: 1,
    delinquency_12m: 0,
    bankruptcies_flag: false,
    abandoned_journeys: 2,
    risk_flags: 'Renewal Due Soon',
    missing_coverage: 'Life Insurance'
  }
})

Record({
  $id: Now.ID['ph_plat_high_002'],
  table: 'x_hete_clv_maximiz_policy_holders',
  data: {
    customer_id: 'PLAT002',
    name: 'Victoria Sterling',
    first_name: 'Victoria',
    last_name: 'Sterling',
    email: 'victoria.sterling@email.com',
    phone: '+1-555-0002',
    age: 47,
    tier: 'platinum',
    clv: 52000.00,
    lifetime_value: 140000.00,
    clv_score: 97.2,
    renewal_date: '2025-01-28', // ~30 days from now - HIGH RISK
    risk: 'high',
    u_risk: 'high',
    churn_risk: 78,
    credit_score: 820,
    credit_utilization_percent: 12,
    tenure_years: 12,
    engagement_score: 88,
    preferred_channel: 'Mobile App',
    app_sessions_30_days: 35,
    website_visits_30_days: 28,
    avg_session_time_min: 22,
    quote_views: 8,
    number_of_open_accounts: 5,
    number_of_closed_accounts: 0,
    credit_inquiries_last_6m: 0,
    delinquency_12m: 0,
    bankruptcies_flag: false,
    abandoned_journeys: 1,
    risk_flags: 'High Value, Renewal Critical',
    missing_coverage: 'Umbrella Policy'
  }
})

// GOLD TIER - MEDIUM-HIGH CLV - MEDIUM RISK (Renewal in 60-120 days)
Record({
  $id: Now.ID['ph_gold_med_001'],
  table: 'x_hete_clv_maximiz_policy_holders',
  data: {
    customer_id: 'GOLD001',
    name: 'Marcus Rodriguez',
    first_name: 'Marcus',
    last_name: 'Rodriguez',
    email: 'marcus.rodriguez@email.com',
    phone: '+1-555-0003',
    age: 41,
    tier: 'gold',
    clv: 32000.00,
    lifetime_value: 85000.00,
    clv_score: 82.3,
    renewal_date: '2025-03-20', // ~80 days from now - MEDIUM RISK
    risk: 'medium',
    u_risk: 'medium',
    churn_risk: 45,
    credit_score: 740,
    credit_utilization_percent: 22,
    tenure_years: 6,
    engagement_score: 75,
    preferred_channel: 'Email',
    app_sessions_30_days: 18,
    website_visits_30_days: 32,
    avg_session_time_min: 14,
    quote_views: 6,
    number_of_open_accounts: 3,
    number_of_closed_accounts: 2,
    credit_inquiries_last_6m: 2,
    delinquency_12m: 0,
    bankruptcies_flag: false,
    abandoned_journeys: 4,
    risk_flags: 'Multiple Inquiries',
    missing_coverage: 'Disability Insurance'
  }
})

Record({
  $id: Now.ID['ph_gold_med_002'],
  table: 'x_hete_clv_maximiz_policy_holders',
  data: {
    customer_id: 'GOLD002',
    name: 'Jennifer Chen',
    first_name: 'Jennifer',
    last_name: 'Chen',
    email: 'jennifer.chen@email.com',
    phone: '+1-555-0004',
    age: 38,
    tier: 'gold',
    clv: 28500.00,
    lifetime_value: 75000.00,
    clv_score: 79.1,
    renewal_date: '2025-04-10', // ~101 days from now - MEDIUM RISK
    risk: 'medium',
    u_risk: 'medium',
    churn_risk: 52,
    credit_score: 715,
    credit_utilization_percent: 28,
    tenure_years: 4,
    engagement_score: 68,
    preferred_channel: 'Mobile App',
    app_sessions_30_days: 22,
    website_visits_30_days: 19,
    avg_session_time_min: 11,
    quote_views: 9,
    number_of_open_accounts: 2,
    number_of_closed_accounts: 1,
    credit_inquiries_last_6m: 3,
    delinquency_12m: 1,
    bankruptcies_flag: false,
    abandoned_journeys: 6,
    risk_flags: 'Credit Utilization High',
    missing_coverage: 'Home Insurance'
  }
})

// SILVER TIER - MEDIUM CLV - LOW RISK (Renewal >120 days away)
Record({
  $id: Now.ID['ph_silver_low_001'],
  table: 'x_hete_clv_maximiz_policy_holders',
  data: {
    customer_id: 'SILV001',
    name: 'David Thompson',
    first_name: 'David',
    last_name: 'Thompson',
    email: 'david.thompson@email.com',
    phone: '+1-555-0005',
    age: 35,
    tier: 'silver',
    clv: 19800.00,
    lifetime_value: 45000.00,
    clv_score: 65.7,
    renewal_date: '2025-08-15', // ~227 days from now - LOW RISK
    risk: 'low',
    u_risk: 'low',
    churn_risk: 25,
    credit_score: 680,
    credit_utilization_percent: 35,
    tenure_years: 3,
    engagement_score: 58,
    preferred_channel: 'Email',
    app_sessions_30_days: 12,
    website_visits_30_days: 24,
    avg_session_time_min: 8,
    quote_views: 4,
    number_of_open_accounts: 2,
    number_of_closed_accounts: 0,
    credit_inquiries_last_6m: 1,
    delinquency_12m: 0,
    bankruptcies_flag: false,
    abandoned_journeys: 3,
    risk_flags: 'None',
    missing_coverage: 'Auto Insurance'
  }
})

Record({
  $id: Now.ID['ph_silver_low_002'],
  table: 'x_hete_clv_maximiz_policy_holders',
  data: {
    customer_id: 'SILV002',
    name: 'Sarah Mitchell',
    first_name: 'Sarah',
    last_name: 'Mitchell',
    email: 'sarah.mitchell@email.com',
    phone: '+1-555-0006',
    age: 32,
    tier: 'silver',
    clv: 22300.00,
    lifetime_value: 52000.00,
    clv_score: 68.9,
    renewal_date: '2025-09-30', // ~273 days from now - LOW RISK
    risk: 'low',
    u_risk: 'low',
    churn_risk: 18,
    credit_score: 695,
    credit_utilization_percent: 31,
    tenure_years: 2,
    engagement_score: 62,
    preferred_channel: 'Mobile App',
    app_sessions_30_days: 16,
    website_visits_30_days: 21,
    avg_session_time_min: 9,
    quote_views: 7,
    number_of_open_accounts: 1,
    number_of_closed_accounts: 0,
    credit_inquiries_last_6m: 2,
    delinquency_12m: 0,
    bankruptcies_flag: false,
    abandoned_journeys: 2,
    risk_flags: 'New Customer',
    missing_coverage: 'Renters Insurance'
  }
})

// BRONZE TIER - LOWER CLV - VARIED RISK SCENARIOS

// Bronze with HIGH RISK due to soon renewal
Record({
  $id: Now.ID['ph_bronze_high_001'],
  table: 'x_hete_clv_maximiz_policy_holders',
  data: {
    customer_id: 'BRNZ001',
    name: 'Michael Johnson',
    first_name: 'Michael',
    last_name: 'Johnson',
    email: 'michael.johnson@email.com',
    phone: '+1-555-0007',
    age: 28,
    tier: 'bronze',
    clv: 12400.00,
    lifetime_value: 28000.00,
    clv_score: 45.2,
    renewal_date: '2025-02-05', // ~37 days from now - HIGH RISK
    risk: 'high',
    u_risk: 'high',
    churn_risk: 70,
    credit_score: 620,
    credit_utilization_percent: 55,
    tenure_years: 1,
    engagement_score: 35,
    preferred_channel: 'Phone',
    app_sessions_30_days: 8,
    website_visits_30_days: 15,
    avg_session_time_min: 5,
    quote_views: 3,
    number_of_open_accounts: 1,
    number_of_closed_accounts: 2,
    credit_inquiries_last_6m: 4,
    delinquency_12m: 2,
    bankruptcies_flag: false,
    abandoned_journeys: 8,
    risk_flags: 'Low Credit Score, High Utilization',
    missing_coverage: 'Health Insurance'
  }
})

// Bronze with LOW RISK due to distant renewal
Record({
  $id: Now.ID['ph_bronze_low_001'],
  table: 'x_hete_clv_maximiz_policy_holders',
  data: {
    customer_id: 'BRNZ002',
    name: 'Amanda Davis',
    first_name: 'Amanda',
    last_name: 'Davis',
    email: 'amanda.davis@email.com',
    phone: '+1-555-0008',
    age: 26,
    tier: 'bronze',
    clv: 9800.00,
    lifetime_value: 22000.00,
    clv_score: 42.8,
    renewal_date: '2025-11-20', // ~324 days from now - LOW RISK
    risk: 'low',
    u_risk: 'low',
    churn_risk: 30,
    credit_score: 650,
    credit_utilization_percent: 42,
    tenure_years: 1,
    engagement_score: 48,
    preferred_channel: 'Email',
    app_sessions_30_days: 10,
    website_visits_30_days: 18,
    avg_session_time_min: 6,
    quote_views: 5,
    number_of_open_accounts: 1,
    number_of_closed_accounts: 0,
    credit_inquiries_last_6m: 1,
    delinquency_12m: 0,
    bankruptcies_flag: false,
    abandoned_journeys: 5,
    risk_flags: 'Young Customer',
    missing_coverage: 'Life Insurance'
  }
})

// Additional PLATINUM with LOW RISK (distant renewal)
Record({
  $id: Now.ID['ph_plat_low_001'],
  table: 'x_hete_clv_maximiz_policy_holders',
  data: {
    customer_id: 'PLAT003',
    name: 'Robert Kingston',
    first_name: 'Robert',
    last_name: 'Kingston',
    email: 'robert.kingston@email.com',
    phone: '+1-555-0009',
    age: 58,
    tier: 'platinum',
    clv: 48500.00,
    lifetime_value: 135000.00,
    clv_score: 94.8,
    renewal_date: '2025-12-15', // ~349 days from now - LOW RISK
    risk: 'low',
    u_risk: 'low',
    churn_risk: 12,
    credit_score: 850,
    credit_utilization_percent: 8,
    tenure_years: 15,
    engagement_score: 95,
    preferred_channel: 'Phone',
    app_sessions_30_days: 20,
    website_visits_30_days: 35,
    avg_session_time_min: 25,
    quote_views: 2,
    number_of_open_accounts: 6,
    number_of_closed_accounts: 0,
    credit_inquiries_last_6m: 0,
    delinquency_12m: 0,
    bankruptcies_flag: false,
    abandoned_journeys: 0,
    risk_flags: 'VIP Customer',
    missing_coverage: 'None'
  }
})

// GOLD with HIGH RISK due to soon renewal
Record({
  $id: Now.ID['ph_gold_high_001'],
  table: 'x_hete_clv_maximiz_policy_holders',
  data: {
    customer_id: 'GOLD003',
    name: 'Lisa Anderson',
    first_name: 'Lisa',
    last_name: 'Anderson',
    email: 'lisa.anderson@email.com',
    phone: '+1-555-0010',
    age: 44,
    tier: 'gold',
    clv: 35200.00,
    lifetime_value: 92000.00,
    clv_score: 84.1,
    renewal_date: '2025-01-20', // ~22 days from now - HIGH RISK
    risk: 'high',
    u_risk: 'high',
    churn_risk: 82,
    credit_score: 760,
    credit_utilization_percent: 18,
    tenure_years: 7,
    engagement_score: 71,
    preferred_channel: 'Mobile App',
    app_sessions_30_days: 28,
    website_visits_30_days: 42,
    avg_session_time_min: 16,
    quote_views: 11,
    number_of_open_accounts: 3,
    number_of_closed_accounts: 1,
    credit_inquiries_last_6m: 1,
    delinquency_12m: 0,
    bankruptcies_flag: false,
    abandoned_journeys: 3,
    risk_flags: 'Urgent Renewal Required',
    missing_coverage: 'Flood Insurance'
  }
})