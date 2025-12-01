import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Essential Demo Data - Smaller batch for faster deployment
// 5 key records covering all tiers and use cases

export const essentialPolicyHolder001 = Record({
    $id: Now.ID['essential-policy-001'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Sarah Johnson',
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@techcorp.com',
        phone: '+15550101',
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

export const essentialPolicyHolder002 = Record({
    $id: Now.ID['essential-policy-002'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'David Wilson',
        first_name: 'David',
        last_name: 'Wilson',
        email: 'david.wilson@startup.io',
        phone: '+15550102',
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

export const essentialPolicyHolder003 = Record({
    $id: Now.ID['essential-policy-003'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Lisa Thompson',
        first_name: 'Lisa',
        last_name: 'Thompson',
        email: 'lisa.thompson@retail.com',
        phone: '+15550103',
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

export const essentialPolicyHolder004 = Record({
    $id: Now.ID['essential-policy-004'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Amanda Foster',
        first_name: 'Amanda',
        last_name: 'Foster',
        email: 'amanda.foster@smallbiz.com',
        phone: '+15550104',
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

export const essentialPolicyHolder005 = Record({
    $id: Now.ID['essential-policy-005'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Patricia Brown',
        first_name: 'Patricia',
        last_name: 'Brown',
        email: 'patricia.brown@temp.net',
        phone: '+15550105',
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