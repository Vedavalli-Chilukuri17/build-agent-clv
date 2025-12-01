import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Additional Demo Data - Diverse customer profiles across all tiers and scenarios

export const policyHolder006 = Record({
    $id: Now.ID['policy-holder-006'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Michael Chen',
        first_name: 'Michael',
        last_name: 'Chen',
        email: 'michael.chen@fintech.com',
        phone: '+15550106',
        age: 36,
        customer_id: 'CUST-2024-1006',
        tier: 'platinum',
        
        // Financial Profile - High Value Customer
        credit_score: 850,
        lifetime_value: 185000,
        clv_score: 9.5,
        credit_utilization_percent: 8,
        number_of_open_accounts: 12,
        number_of_closed_accounts: 1,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 0,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Highly Engaged
        tenure_years: 8,
        app_sessions_30_days: 52,
        avg_session_time_min: 12,
        website_visits_30_days: 35,
        quote_views: 2,
        abandoned_journeys: 0,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment - Lowest Risk
        churn_risk: 5,
        risk_flags: 'Minimal Risk',
        missing_coverage: 'None'
    }
})

export const policyHolder007 = Record({
    $id: Now.ID['policy-holder-007'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Jennifer Martinez',
        first_name: 'Jennifer',
        last_name: 'Martinez',
        email: 'jennifer.martinez@healthcare.org',
        phone: '+15550107',
        age: 52,
        customer_id: 'CUST-2024-1007',
        tier: 'gold',
        
        // Financial Profile - Stable Professional
        credit_score: 785,
        lifetime_value: 78500,
        clv_score: 7.2,
        credit_utilization_percent: 22,
        number_of_open_accounts: 6,
        number_of_closed_accounts: 3,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 2,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Traditional User
        tenure_years: 15,
        app_sessions_30_days: 18,
        avg_session_time_min: 6,
        website_visits_30_days: 24,
        quote_views: 8,
        abandoned_journeys: 2,
        preferred_channel: 'Phone',
        
        // Risk Assessment - Low Risk
        churn_risk: 18,
        risk_flags: 'Stable Customer',
        missing_coverage: 'Travel Insurance'
    }
})

export const policyHolder008 = Record({
    $id: Now.ID['policy-holder-008'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Robert Kim',
        first_name: 'Robert',
        last_name: 'Kim',
        email: 'robert.kim@consulting.biz',
        phone: '+15550108',
        age: 41,
        customer_id: 'CUST-2024-1008',
        tier: 'silver',
        
        // Financial Profile - Average Customer
        credit_score: 672,
        lifetime_value: 42300,
        clv_score: 5.8,
        credit_utilization_percent: 52,
        number_of_open_accounts: 4,
        number_of_closed_accounts: 2,
        delinquency_12m: 1,
        credit_inquiries_last_6m: 3,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Moderate Usage
        tenure_years: 7,
        app_sessions_30_days: 22,
        avg_session_time_min: 4,
        website_visits_30_days: 16,
        quote_views: 18,
        abandoned_journeys: 6,
        preferred_channel: 'Email',
        
        // Risk Assessment - Moderate Risk
        churn_risk: 42,
        risk_flags: 'Credit Utilization Concern',
        missing_coverage: 'Umbrella Policy'
    }
})

export const policyHolder009 = Record({
    $id: Now.ID['policy-holder-009'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Ashley Rodriguez',
        first_name: 'Ashley',
        last_name: 'Rodriguez',
        email: 'ashley.rodriguez@freelance.net',
        phone: '+15550109',
        age: 28,
        customer_id: 'CUST-2024-1009',
        tier: 'bronze',
        
        // Financial Profile - Young Professional with Challenges
        credit_score: 612,
        lifetime_value: 15800,
        clv_score: 3.8,
        credit_utilization_percent: 78,
        number_of_open_accounts: 3,
        number_of_closed_accounts: 1,
        delinquency_12m: 3,
        credit_inquiries_last_6m: 6,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Digital Native but Price Sensitive
        tenure_years: 2,
        app_sessions_30_days: 28,
        avg_session_time_min: 3,
        website_visits_30_days: 45,
        quote_views: 32,
        abandoned_journeys: 18,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment - High Risk
        churn_risk: 68,
        risk_flags: 'High Utilization, Payment Issues, Price Sensitivity',
        missing_coverage: 'Health Insurance Supplement'
    }
})

export const policyHolder010 = Record({
    $id: Now.ID['policy-holder-010'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'William Thompson',
        first_name: 'William',
        last_name: 'Thompson',
        email: 'william.thompson@retiree.com',
        phone: '+15550110',
        age: 67,
        customer_id: 'CUST-2024-1010',
        tier: 'gold',
        
        // Financial Profile - Retiree with Good Credit
        credit_score: 742,
        lifetime_value: 95200,
        clv_score: 6.9,
        credit_utilization_percent: 12,
        number_of_open_accounts: 3,
        number_of_closed_accounts: 8,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 1,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Traditional Channel Preference
        tenure_years: 23,
        app_sessions_30_days: 4,
        avg_session_time_min: 15,
        website_visits_30_days: 6,
        quote_views: 2,
        abandoned_journeys: 1,
        preferred_channel: 'Phone',
        
        // Risk Assessment - Low Risk due to Loyalty
        churn_risk: 12,
        risk_flags: 'Long-term Customer, Age-related Considerations',
        missing_coverage: 'Long-term Care'
    }
})

export const policyHolder011 = Record({
    $id: Now.ID['policy-holder-011'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Emily Davis',
        first_name: 'Emily',
        last_name: 'Davis',
        email: 'emily.davis@education.edu',
        phone: '+15550111',
        age: 34,
        customer_id: 'CUST-2024-1011',
        tier: 'silver',
        
        // Financial Profile - Educator with Stable Income
        credit_score: 698,
        lifetime_value: 52400,
        clv_score: 6.1,
        credit_utilization_percent: 35,
        number_of_open_accounts: 5,
        number_of_closed_accounts: 1,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 2,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Balanced User
        tenure_years: 9,
        app_sessions_30_days: 24,
        avg_session_time_min: 7,
        website_visits_30_days: 18,
        quote_views: 6,
        abandoned_journeys: 3,
        preferred_channel: 'Email',
        
        // Risk Assessment - Moderate Risk
        churn_risk: 28,
        risk_flags: 'Income Stability, Public Sector',
        missing_coverage: 'Professional Liability'
    }
})

export const policyHolder012 = Record({
    $id: Now.ID['policy-holder-012'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'James Wilson',
        first_name: 'James',
        last_name: 'Wilson',
        email: 'james.wilson@construction.co',
        phone: '+15550112',
        age: 45,
        customer_id: 'CUST-2024-1012',
        tier: 'bronze',
        
        // Financial Profile - Blue Collar with Credit Issues
        credit_score: 578,
        lifetime_value: 22100,
        clv_score: 4.1,
        credit_utilization_percent: 89,
        number_of_open_accounts: 2,
        number_of_closed_accounts: 5,
        delinquency_12m: 4,
        credit_inquiries_last_6m: 9,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Limited Digital Engagement
        tenure_years: 5,
        app_sessions_30_days: 8,
        avg_session_time_min: 2,
        website_visits_30_days: 4,
        quote_views: 22,
        abandoned_journeys: 15,
        preferred_channel: 'Phone',
        
        // Risk Assessment - High Risk
        churn_risk: 72,
        risk_flags: 'Credit Issues, Industry Risk, Payment Challenges',
        missing_coverage: 'Workers Compensation Enhancement'
    }
})

export const policyHolder013 = Record({
    $id: Now.ID['policy-holder-013'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Sophie Anderson',
        first_name: 'Sophie',
        last_name: 'Anderson',
        email: 'sophie.anderson@law.firm',
        phone: '+15550113',
        age: 39,
        customer_id: 'CUST-2024-1013',
        tier: 'platinum',
        
        // Financial Profile - High-Income Professional
        credit_score: 815,
        lifetime_value: 156000,
        clv_score: 8.7,
        credit_utilization_percent: 18,
        number_of_open_accounts: 9,
        number_of_closed_accounts: 2,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 1,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Busy Professional
        tenure_years: 11,
        app_sessions_30_days: 38,
        avg_session_time_min: 5,
        website_visits_30_days: 22,
        quote_views: 4,
        abandoned_journeys: 1,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment - Very Low Risk
        churn_risk: 8,
        risk_flags: 'Premium Customer',
        missing_coverage: 'Cyber Liability Enhancement'
    }
})

export const policyHolder014 = Record({
    $id: Now.ID['policy-holder-014'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Marcus Johnson',
        first_name: 'Marcus',
        last_name: 'Johnson',
        email: 'marcus.johnson@veteran.org',
        phone: '+15550114',
        age: 55,
        customer_id: 'CUST-2024-1014',
        tier: 'silver',
        
        // Financial Profile - Military Background, Steady
        credit_score: 701,
        lifetime_value: 68900,
        clv_score: 6.5,
        credit_utilization_percent: 28,
        number_of_open_accounts: 4,
        number_of_closed_accounts: 3,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 1,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Loyal but Traditional
        tenure_years: 18,
        app_sessions_30_days: 12,
        avg_session_time_min: 8,
        website_visits_30_days: 14,
        quote_views: 3,
        abandoned_journeys: 1,
        preferred_channel: 'Phone',
        
        // Risk Assessment - Low Risk
        churn_risk: 15,
        risk_flags: 'Veteran Discount Eligible, Stable',
        missing_coverage: 'VA Supplement'
    }
})

export const policyHolder015 = Record({
    $id: Now.ID['policy-holder-015'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Rachel Green',
        first_name: 'Rachel',
        last_name: 'Green',
        email: 'rachel.green@startup.tech',
        phone: '+15550115',
        age: 26,
        customer_id: 'CUST-2024-1015',
        tier: 'bronze',
        
        // Financial Profile - Recent Graduate, Building Credit
        credit_score: 645,
        lifetime_value: 12400,
        clv_score: 3.5,
        credit_utilization_percent: 65,
        number_of_open_accounts: 2,
        number_of_closed_accounts: 0,
        delinquency_12m: 1,
        credit_inquiries_last_6m: 4,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Tech-Savvy but Price Shopping
        tenure_years: 1,
        app_sessions_30_days: 42,
        avg_session_time_min: 3,
        website_visits_30_days: 38,
        quote_views: 28,
        abandoned_journeys: 22,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment - High Risk due to Newness
        churn_risk: 82,
        risk_flags: 'New Customer, Price Sensitivity, Credit Building',
        missing_coverage: 'Renters Insurance Enhancement'
    }
})