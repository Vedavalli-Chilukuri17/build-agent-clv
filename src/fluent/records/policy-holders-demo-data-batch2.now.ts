import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Additional Demo Data for Policy Holders - Batch 2
// This provides more diverse examples across all tiers and risk profiles

// More Platinum Customers
export const policyHolder011 = Record({
    $id: Now.ID['policy-holder-011'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Elizabeth Marie Anderson',
        first_name: 'Elizabeth',
        last_name: 'Anderson',
        email: 'elizabeth.anderson@enterprise.com',
        phone: '+1-555-0111',
        age: 58,
        tier: 'platinum',
        
        // Financial Profile
        credit_score: 850,
        lifetime_value: 145000,
        clv_score: 9.2,
        credit_utilization_percent: 8,
        number_of_open_accounts: 15,
        number_of_closed_accounts: 5,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 0,
        bankruptcies_flag: false,
        
        // Engagement Metrics
        tenure_years: 18,
        app_sessions_30_days: 52,
        avg_session_time_min: 15,
        website_visits_30_days: 35,
        quote_views: 2,
        abandoned_journeys: 0,
        preferred_channel: 'Email',
        
        // Risk Assessment
        churn_risk: 5,
        risk_flags: 'VIP Customer',
        missing_coverage: 'None'
    }
})

export const policyHolder012 = Record({
    $id: Now.ID['policy-holder-012'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Thomas Richard Moore',
        first_name: 'Thomas',
        last_name: 'Moore',
        email: 'thomas.moore@lawfirm.legal',
        phone: '+1-555-0112',
        age: 62,
        tier: 'platinum',
        
        // Financial Profile
        credit_score: 815,
        lifetime_value: 165000,
        clv_score: 9.5,
        credit_utilization_percent: 12,
        number_of_open_accounts: 20,
        number_of_closed_accounts: 8,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 1,
        bankruptcies_flag: false,
        
        // Engagement Metrics
        tenure_years: 22,
        app_sessions_30_days: 38,
        avg_session_time_min: 18,
        website_visits_30_days: 25,
        quote_views: 1,
        abandoned_journeys: 0,
        preferred_channel: 'Phone',
        
        // Risk Assessment
        churn_risk: 3,
        risk_flags: 'Ultra Low Risk',
        missing_coverage: 'None'
    }
})

// More Gold Tier Customers
export const policyHolder013 = Record({
    $id: Now.ID['policy-holder-013'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Maria Elena Gonzalez',
        first_name: 'Maria',
        last_name: 'Gonzalez',
        email: 'maria.gonzalez@healthcare.med',
        phone: '+1-555-0113',
        age: 44,
        tier: 'gold',
        
        // Financial Profile
        credit_score: 765,
        lifetime_value: 78200,
        clv_score: 7.8,
        credit_utilization_percent: 28,
        number_of_open_accounts: 9,
        number_of_closed_accounts: 3,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 2,
        bankruptcies_flag: false,
        
        // Engagement Metrics
        tenure_years: 11,
        app_sessions_30_days: 28,
        avg_session_time_min: 9,
        website_visits_30_days: 22,
        quote_views: 6,
        abandoned_journeys: 1,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment
        churn_risk: 18,
        risk_flags: 'Stable Customer',
        missing_coverage: 'Travel Insurance'
    }
})

export const policyHolder014 = Record({
    $id: Now.ID['policy-holder-014'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Kevin Paul Taylor',
        first_name: 'Kevin',
        last_name: 'Taylor',
        email: 'kevin.taylor@technology.ai',
        phone: '+1-555-0114',
        age: 35,
        tier: 'gold',
        
        // Financial Profile
        credit_score: 735,
        lifetime_value: 52900,
        clv_score: 7.0,
        credit_utilization_percent: 42,
        number_of_open_accounts: 7,
        number_of_closed_accounts: 1,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 5,
        bankruptcies_flag: false,
        
        // Engagement Metrics
        tenure_years: 5,
        app_sessions_30_days: 48,
        avg_session_time_min: 6,
        website_visits_30_days: 38,
        quote_views: 18,
        abandoned_journeys: 3,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment
        churn_risk: 30,
        risk_flags: 'High App Usage, Credit Growing',
        missing_coverage: 'Equipment Protection'
    }
})

// More Silver Tier Customers
export const policyHolder015 = Record({
    $id: Now.ID['policy-holder-015'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Nancy Susan White',
        first_name: 'Nancy',
        last_name: 'White',
        email: 'nancy.white@education.edu',
        phone: '+1-555-0115',
        age: 51,
        tier: 'silver',
        
        // Financial Profile
        credit_score: 690,
        lifetime_value: 41200,
        clv_score: 5.8,
        credit_utilization_percent: 52,
        number_of_open_accounts: 4,
        number_of_closed_accounts: 2,
        delinquency_12m: 1,
        credit_inquiries_last_6m: 3,
        bankruptcies_flag: false,
        
        // Engagement Metrics
        tenure_years: 8,
        app_sessions_30_days: 15,
        avg_session_time_min: 7,
        website_visits_30_days: 10,
        quote_views: 12,
        abandoned_journeys: 5,
        preferred_channel: 'Email',
        
        // Risk Assessment
        churn_risk: 45,
        risk_flags: 'Moderate Utilization, Stable',
        missing_coverage: 'Vision Insurance'
    }
})

export const policyHolder016 = Record({
    $id: Now.ID['policy-holder-016'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Brian Matthew Lewis',
        first_name: 'Brian',
        last_name: 'Lewis',
        email: 'brian.lewis@construction.build',
        phone: '+1-555-0116',
        age: 39,
        tier: 'silver',
        
        // Financial Profile
        credit_score: 665,
        lifetime_value: 32500,
        clv_score: 5.2,
        credit_utilization_percent: 68,
        number_of_open_accounts: 3,
        number_of_closed_accounts: 4,
        delinquency_12m: 3,
        credit_inquiries_last_6m: 6,
        bankruptcies_flag: false,
        
        // Engagement Metrics
        tenure_years: 4,
        app_sessions_30_days: 12,
        avg_session_time_min: 4,
        website_visits_30_days: 8,
        quote_views: 28,
        abandoned_journeys: 18,
        preferred_channel: 'Phone',
        
        // Risk Assessment
        churn_risk: 58,
        risk_flags: 'Payment Challenges, Industry Risk',
        missing_coverage: 'Workers Compensation Add-on'
    }
})

// More Bronze Tier Customers
export const policyHolder017 = Record({
    $id: Now.ID['policy-holder-017'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Michelle Anne Clark',
        first_name: 'Michelle',
        last_name: 'Clark',
        email: 'michelle.clark@retail.shop',
        phone: '+1-555-0117',
        age: 28,
        tier: 'bronze',
        
        // Financial Profile
        credit_score: 615,
        lifetime_value: 22300,
        clv_score: 3.8,
        credit_utilization_percent: 78,
        number_of_open_accounts: 2,
        number_of_closed_accounts: 3,
        delinquency_12m: 4,
        credit_inquiries_last_6m: 9,
        bankruptcies_flag: false,
        
        // Engagement Metrics
        tenure_years: 2,
        app_sessions_30_days: 18,
        avg_session_time_min: 3,
        website_visits_30_days: 14,
        quote_views: 32,
        abandoned_journeys: 22,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment
        churn_risk: 72,
        risk_flags: 'Young, High Utilization, Short Tenure',
        missing_coverage: 'Premium Support, Extended Warranty'
    }
})

export const policyHolder018 = Record({
    $id: Now.ID['policy-holder-018'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Ryan Christopher Hall',
        first_name: 'Ryan',
        last_name: 'Hall',
        email: 'ryan.hall@gig.work',
        phone: '+1-555-0118',
        age: 24,
        tier: 'bronze',
        
        // Financial Profile
        credit_score: 590,
        lifetime_value: 15600,
        clv_score: 2.9,
        credit_utilization_percent: 88,
        number_of_open_accounts: 2,
        number_of_closed_accounts: 1,
        delinquency_12m: 6,
        credit_inquiries_last_6m: 11,
        bankruptcies_flag: false,
        
        // Engagement Metrics
        tenure_years: 1,
        app_sessions_30_days: 22,
        avg_session_time_min: 2,
        website_visits_30_days: 18,
        quote_views: 52,
        abandoned_journeys: 45,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment
        churn_risk: 82,
        risk_flags: 'Gig Economy, High Risk Profile',
        missing_coverage: 'All Optional Coverage'
    }
})

// Edge Cases and Special Scenarios
export const policyHolder019 = Record({
    $id: Now.ID['policy-holder-019'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Dorothy Helen Young',
        first_name: 'Dorothy',
        last_name: 'Young',
        email: 'dorothy.young@senior.community',
        phone: '+1-555-0119',
        age: 72,
        tier: 'gold',
        
        // Financial Profile - Senior with good history
        credit_score: 780,
        lifetime_value: 89500,
        clv_score: 8.1,
        credit_utilization_percent: 18,
        number_of_open_accounts: 6,
        number_of_closed_accounts: 12,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 0,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Lower digital engagement
        tenure_years: 25,
        app_sessions_30_days: 8,
        avg_session_time_min: 12,
        website_visits_30_days: 4,
        quote_views: 3,
        abandoned_journeys: 0,
        preferred_channel: 'Phone',
        
        // Risk Assessment
        churn_risk: 12,
        risk_flags: 'Age-related Digital Preference',
        missing_coverage: 'Digital Services'
    }
})

export const policyHolder020 = Record({
    $id: Now.ID['policy-holder-020'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Ashley Nicole King',
        first_name: 'Ashley',
        last_name: 'King',
        email: 'ashley.king@millenial.startup',
        phone: '+1-555-0120',
        age: 31,
        tier: 'silver',
        
        // Financial Profile - Millennial profile
        credit_score: 705,
        lifetime_value: 38700,
        clv_score: 6.2,
        credit_utilization_percent: 48,
        number_of_open_accounts: 5,
        number_of_closed_accounts: 2,
        delinquency_12m: 1,
        credit_inquiries_last_6m: 4,
        bankruptcies_flag: false,
        
        // Engagement Metrics - High digital engagement
        tenure_years: 4,
        app_sessions_30_days: 62,
        avg_session_time_min: 5,
        website_visits_30_days: 45,
        quote_views: 25,
        abandoned_journeys: 8,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment
        churn_risk: 38,
        risk_flags: 'Price Sensitive, High Digital Usage',
        missing_coverage: 'Student Loan Protection'
    }
})