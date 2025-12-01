import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Demo data for CLV Policy Holders table
// This creates realistic insurance/financial services customer data

// High-Value Platinum Customers
export const policyHolder001 = Record({
    $id: Now.ID['policy-holder-001'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Sarah Elizabeth Johnson',
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@techcorp.com',
        phone: '+1-555-0101',
        age: 45,
        tier: 'platinum',
        
        // Financial Profile
        credit_score: 820,
        lifetime_value: 125000,
        clv_score: 8.9,
        credit_utilization_percent: 15,
        number_of_open_accounts: 8,
        number_of_closed_accounts: 2,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 1,
        bankruptcies_flag: false,
        
        // Engagement Metrics
        tenure_years: 12,
        app_sessions_30_days: 45,
        avg_session_time_min: 8,
        website_visits_30_days: 28,
        quote_views: 3,
        abandoned_journeys: 0,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment
        churn_risk: 10,
        risk_flags: 'Low Risk',
        missing_coverage: 'None'
    }
})

export const policyHolder002 = Record({
    $id: Now.ID['policy-holder-002'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Michael Robert Chen',
        first_name: 'Michael',
        last_name: 'Chen',
        email: 'michael.chen@globalfinance.com',
        phone: '+1-555-0102',
        age: 52,
        tier: 'platinum',
        
        // Financial Profile
        credit_score: 795,
        lifetime_value: 98500,
        clv_score: 8.6,
        credit_utilization_percent: 22,
        number_of_open_accounts: 12,
        number_of_closed_accounts: 4,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 2,
        bankruptcies_flag: false,
        
        // Engagement Metrics
        tenure_years: 15,
        app_sessions_30_days: 32,
        avg_session_time_min: 12,
        website_visits_30_days: 18,
        quote_views: 5,
        abandoned_journeys: 1,
        preferred_channel: 'Email',
        
        // Risk Assessment
        churn_risk: 15,
        risk_flags: 'Low Risk',
        missing_coverage: 'Umbrella Policy'
    }
})

// Gold Tier Customers
export const policyHolder003 = Record({
    $id: Now.ID['policy-holder-003'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Jennifer Marie Rodriguez',
        first_name: 'Jennifer',
        last_name: 'Rodriguez',
        email: 'jennifer.rodriguez@healthplus.net',
        phone: '+1-555-0103',
        age: 38,
        tier: 'gold',
        
        // Financial Profile
        credit_score: 745,
        lifetime_value: 67500,
        clv_score: 7.2,
        credit_utilization_percent: 35,
        number_of_open_accounts: 6,
        number_of_closed_accounts: 1,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 3,
        bankruptcies_flag: false,
        
        // Engagement Metrics
        tenure_years: 8,
        app_sessions_30_days: 22,
        avg_session_time_min: 6,
        website_visits_30_days: 15,
        quote_views: 8,
        abandoned_journeys: 2,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment
        churn_risk: 25,
        risk_flags: 'Medium Risk',
        missing_coverage: 'Life Insurance'
    }
})

export const policyHolder004 = Record({
    $id: Now.ID['policy-holder-004'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'David Andrew Wilson',
        first_name: 'David',
        last_name: 'Wilson',
        email: 'david.wilson@startup.io',
        phone: '+1-555-0104',
        age: 29,
        tier: 'gold',
        
        // Financial Profile
        credit_score: 720,
        lifetime_value: 45800,
        clv_score: 6.8,
        credit_utilization_percent: 45,
        number_of_open_accounts: 4,
        number_of_closed_accounts: 0,
        delinquency_12m: 1,
        credit_inquiries_last_6m: 4,
        bankruptcies_flag: false,
        
        // Engagement Metrics
        tenure_years: 3,
        app_sessions_30_days: 35,
        avg_session_time_min: 4,
        website_visits_30_days: 42,
        quote_views: 12,
        abandoned_journeys: 5,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment
        churn_risk: 35,
        risk_flags: 'Credit Utilization High',
        missing_coverage: 'Disability Insurance'
    }
})

// Silver Tier Customers
export const policyHolder005 = Record({
    $id: Now.ID['policy-holder-005'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Lisa Ann Thompson',
        first_name: 'Lisa',
        last_name: 'Thompson',
        email: 'lisa.thompson@retail.com',
        phone: '+1-555-0105',
        age: 42,
        tier: 'silver',
        
        // Financial Profile
        credit_score: 685,
        lifetime_value: 34200,
        clv_score: 5.4,
        credit_utilization_percent: 58,
        number_of_open_accounts: 5,
        number_of_closed_accounts: 3,
        delinquency_12m: 2,
        credit_inquiries_last_6m: 5,
        bankruptcies_flag: false,
        
        // Engagement Metrics
        tenure_years: 6,
        app_sessions_30_days: 18,
        avg_session_time_min: 5,
        website_visits_30_days: 12,
        quote_views: 15,
        abandoned_journeys: 8,
        preferred_channel: 'Phone',
        
        // Risk Assessment
        churn_risk: 50,
        risk_flags: 'Payment History, High Utilization',
        missing_coverage: 'Auto Comprehensive'
    }
})

export const policyHolder006 = Record({
    $id: Now.ID['policy-holder-006'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Robert James Martinez',
        first_name: 'Robert',
        last_name: 'Martinez',
        email: 'robert.martinez@manufacturing.net',
        phone: '+1-555-0106',
        age: 55,
        tier: 'silver',
        
        // Financial Profile
        credit_score: 650,
        lifetime_value: 28900,
        clv_score: 4.9,
        credit_utilization_percent: 72,
        number_of_open_accounts: 3,
        number_of_closed_accounts: 6,
        delinquency_12m: 3,
        credit_inquiries_last_6m: 7,
        bankruptcies_flag: false,
        
        // Engagement Metrics
        tenure_years: 9,
        app_sessions_30_days: 8,
        avg_session_time_min: 3,
        website_visits_30_days: 6,
        quote_views: 22,
        abandoned_journeys: 15,
        preferred_channel: 'Phone',
        
        // Risk Assessment
        churn_risk: 65,
        risk_flags: 'High Utilization, Multiple Delinquencies',
        missing_coverage: 'Health Insurance, Life Insurance'
    }
})

// Bronze Tier Customers
export const policyHolder007 = Record({
    $id: Now.ID['policy-holder-007'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Amanda Grace Foster',
        first_name: 'Amanda',
        last_name: 'Foster',
        email: 'amanda.foster@smallbiz.com',
        phone: '+1-555-0107',
        age: 33,
        tier: 'bronze',
        
        // Financial Profile
        credit_score: 595,
        lifetime_value: 18500,
        clv_score: 3.2,
        credit_utilization_percent: 85,
        number_of_open_accounts: 2,
        number_of_closed_accounts: 4,
        delinquency_12m: 5,
        credit_inquiries_last_6m: 8,
        bankruptcies_flag: false,
        
        // Engagement Metrics
        tenure_years: 2,
        app_sessions_30_days: 12,
        avg_session_time_min: 2,
        website_visits_30_days: 8,
        quote_views: 35,
        abandoned_journeys: 25,
        preferred_channel: 'Email',
        
        // Risk Assessment
        churn_risk: 75,
        risk_flags: 'High Utilization, Payment Issues, Short Tenure',
        missing_coverage: 'All Optional Coverage'
    }
})

export const policyHolder008 = Record({
    $id: Now.ID['policy-holder-008'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Christopher Lee Davis',
        first_name: 'Christopher',
        last_name: 'Davis',
        email: 'chris.davis@freelance.org',
        phone: '+1-555-0108',
        age: 26,
        tier: 'bronze',
        
        // Financial Profile
        credit_score: 580,
        lifetime_value: 12800,
        clv_score: 2.8,
        credit_utilization_percent: 92,
        number_of_open_accounts: 3,
        number_of_closed_accounts: 2,
        delinquency_12m: 4,
        credit_inquiries_last_6m: 12,
        bankruptcies_flag: false,
        
        // Engagement Metrics
        tenure_years: 1,
        app_sessions_30_days: 6,
        avg_session_time_min: 1,
        website_visits_30_days: 4,
        quote_views: 45,
        abandoned_journeys: 38,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment
        churn_risk: 85,
        risk_flags: 'High Risk - Multiple Factors',
        missing_coverage: 'Premium Protection, Add-on Services'
    }
})

// High-Risk Case
export const policyHolder009 = Record({
    $id: Now.ID['policy-holder-009'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Patricia Karen Brown',
        first_name: 'Patricia',
        last_name: 'Brown',
        email: 'patricia.brown@temp.net',
        phone: '+1-555-0109',
        age: 48,
        tier: 'bronze',
        
        // Financial Profile
        credit_score: 520,
        lifetime_value: 8900,
        clv_score: 1.9,
        credit_utilization_percent: 98,
        number_of_open_accounts: 1,
        number_of_closed_accounts: 8,
        delinquency_12m: 8,
        credit_inquiries_last_6m: 15,
        bankruptcies_flag: true,
        
        // Engagement Metrics
        tenure_years: 1,
        app_sessions_30_days: 2,
        avg_session_time_min: 1,
        website_visits_30_days: 1,
        quote_views: 8,
        abandoned_journeys: 7,
        preferred_channel: 'Phone',
        
        // Risk Assessment
        churn_risk: 95,
        risk_flags: 'Critical Risk - Bankruptcy History',
        missing_coverage: 'All Coverage Beyond Basic'
    }
})

// Recent Success Story (Recovery Case)
export const policyHolder010 = Record({
    $id: Now.ID['policy-holder-010'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Daniel Joseph Garcia',
        first_name: 'Daniel',
        last_name: 'Garcia',
        email: 'daniel.garcia@consulting.biz',
        phone: '+1-555-0110',
        age: 41,
        tier: 'gold',
        
        // Financial Profile
        credit_score: 710,
        lifetime_value: 56700,
        clv_score: 7.1,
        credit_utilization_percent: 38,
        number_of_open_accounts: 5,
        number_of_closed_accounts: 3,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 2,
        bankruptcies_flag: true, // Historical bankruptcy, now recovered
        
        // Engagement Metrics
        tenure_years: 7,
        app_sessions_30_days: 26,
        avg_session_time_min: 7,
        website_visits_30_days: 20,
        quote_views: 4,
        abandoned_journeys: 1,
        preferred_channel: 'Email',
        
        // Risk Assessment
        churn_risk: 20,
        risk_flags: 'Historical Bankruptcy - Recovered',
        missing_coverage: 'Premium Services'
    }
})