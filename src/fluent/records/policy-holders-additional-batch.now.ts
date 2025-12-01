import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Additional 10 Policy Holder Records - Diverse profiles and scenarios

export const policyHolder021 = Record({
    $id: Now.ID['policy-holder-021'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Dr. Samuel Mitchell',
        first_name: 'Samuel',
        last_name: 'Mitchell',
        email: 'samuel.mitchell@hospital.med',
        phone: '+15550121',
        age: 47,
        customer_id: 'CUST-2024-1021',
        tier: 'platinum',
        
        // Financial Profile - High-income Medical Professional
        credit_score: 825,
        lifetime_value: 198000,
        clv_score: 9.3,
        credit_utilization_percent: 11,
        number_of_open_accounts: 11,
        number_of_closed_accounts: 4,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 1,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Busy Professional with High Value
        tenure_years: 14,
        app_sessions_30_days: 32,
        avg_session_time_min: 9,
        website_visits_30_days: 18,
        quote_views: 2,
        abandoned_journeys: 0,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment - Premium Customer
        churn_risk: 6,
        risk_flags: 'Premium Professional Customer',
        missing_coverage: 'Malpractice Enhancement'
    }
})

export const policyHolder022 = Record({
    $id: Now.ID['policy-holder-022'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Isabella Rodriguez-Chen',
        first_name: 'Isabella',
        last_name: 'Rodriguez-Chen',
        email: 'isabella.rodriguez@design.studio',
        phone: '+15550122',
        age: 32,
        customer_id: 'CUST-2024-1022',
        tier: 'gold',
        
        // Financial Profile - Creative Professional
        credit_score: 698,
        lifetime_value: 54300,
        clv_score: 6.8,
        credit_utilization_percent: 38,
        number_of_open_accounts: 5,
        number_of_closed_accounts: 2,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 3,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Design-conscious User
        tenure_years: 6,
        app_sessions_30_days: 41,
        avg_session_time_min: 7,
        website_visits_30_days: 29,
        quote_views: 11,
        abandoned_journeys: 3,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment - Creative Industry Considerations
        churn_risk: 32,
        risk_flags: 'Creative Industry, Variable Income',
        missing_coverage: 'Equipment Insurance'
    }
})

export const policyHolder023 = Record({
    $id: Now.ID['policy-holder-023'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Marcus Thompson Jr.',
        first_name: 'Marcus',
        last_name: 'Thompson',
        email: 'marcus.thompson.jr@finance.corp',
        phone: '+15550123',
        age: 38,
        customer_id: 'CUST-2024-1023',
        tier: 'platinum',
        
        // Financial Profile - Finance Executive
        credit_score: 805,
        lifetime_value: 172500,
        clv_score: 8.9,
        credit_utilization_percent: 16,
        number_of_open_accounts: 13,
        number_of_closed_accounts: 3,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 2,
        bankruptcies_flag: false,
        
        // Engagement Metrics - High Engagement Professional
        tenure_years: 9,
        app_sessions_30_days: 58,
        avg_session_time_min: 11,
        website_visits_30_days: 31,
        quote_views: 4,
        abandoned_journeys: 1,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment - Low Risk High Value
        churn_risk: 9,
        risk_flags: 'Executive Level, High Engagement',
        missing_coverage: 'Executive Protection'
    }
})

export const policyHolder024 = Record({
    $id: Now.ID['policy-holder-024'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Grace Liu',
        first_name: 'Grace',
        last_name: 'Liu',
        email: 'grace.liu@nonprofit.org',
        phone: '+15550124',
        age: 41,
        customer_id: 'CUST-2024-1024',
        tier: 'silver',
        
        // Financial Profile - Non-profit Sector
        credit_score: 722,
        lifetime_value: 46800,
        clv_score: 6.3,
        credit_utilization_percent: 29,
        number_of_open_accounts: 4,
        number_of_closed_accounts: 1,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 1,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Mission-driven Customer
        tenure_years: 13,
        app_sessions_30_days: 19,
        avg_session_time_min: 8,
        website_visits_30_days: 16,
        quote_views: 5,
        abandoned_journeys: 2,
        preferred_channel: 'Email',
        
        // Risk Assessment - Stable Non-profit Profile
        churn_risk: 22,
        risk_flags: 'Non-profit Sector, Stable',
        missing_coverage: 'Volunteer Activity Coverage'
    }
})

export const policyHolder025 = Record({
    $id: Now.ID['policy-holder-025'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Jordan Blake',
        first_name: 'Jordan',
        last_name: 'Blake',
        email: 'jordan.blake@freelance.dev',
        phone: '+15550125',
        age: 29,
        customer_id: 'CUST-2024-1025',
        tier: 'bronze',
        
        // Financial Profile - Freelance Developer
        credit_score: 658,
        lifetime_value: 28900,
        clv_score: 4.2,
        credit_utilization_percent: 61,
        number_of_open_accounts: 3,
        number_of_closed_accounts: 1,
        delinquency_12m: 2,
        credit_inquiries_last_6m: 5,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Tech-savvy Freelancer
        tenure_years: 3,
        app_sessions_30_days: 47,
        avg_session_time_min: 4,
        website_visits_30_days: 52,
        quote_views: 19,
        abandoned_journeys: 12,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment - Gig Economy Risk
        churn_risk: 55,
        risk_flags: 'Freelancer Income Variability',
        missing_coverage: 'Professional Liability, Income Protection'
    }
})

export const policyHolder026 = Record({
    $id: Now.ID['policy-holder-026'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Helen Margaret Foster',
        first_name: 'Helen',
        last_name: 'Foster',
        email: 'helen.foster@retired.home',
        phone: '+15550126',
        age: 69,
        customer_id: 'CUST-2024-1026',
        tier: 'gold',
        
        // Financial Profile - Comfortable Retiree
        credit_score: 758,
        lifetime_value: 112000,
        clv_score: 7.6,
        credit_utilization_percent: 14,
        number_of_open_accounts: 5,
        number_of_closed_accounts: 9,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 0,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Traditional Channel Preference
        tenure_years: 28,
        app_sessions_30_days: 6,
        avg_session_time_min: 18,
        website_visits_30_days: 8,
        quote_views: 1,
        abandoned_journeys: 0,
        preferred_channel: 'Phone',
        
        // Risk Assessment - Loyal Senior Customer
        churn_risk: 8,
        risk_flags: 'Senior Loyal Customer',
        missing_coverage: 'Long-term Care Enhancement'
    }
})

export const policyHolder027 = Record({
    $id: Now.ID['policy-holder-027'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Carlos Eduardo Santos',
        first_name: 'Carlos',
        last_name: 'Santos',
        email: 'carlos.santos@restaurant.biz',
        phone: '+15550127',
        age: 44,
        customer_id: 'CUST-2024-1027',
        tier: 'silver',
        
        // Financial Profile - Small Business Owner
        credit_score: 689,
        lifetime_value: 59200,
        clv_score: 6.1,
        credit_utilization_percent: 47,
        number_of_open_accounts: 6,
        number_of_closed_accounts: 2,
        delinquency_12m: 1,
        credit_inquiries_last_6m: 4,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Business Owner Profile
        tenure_years: 10,
        app_sessions_30_days: 21,
        avg_session_time_min: 5,
        website_visits_30_days: 13,
        quote_views: 9,
        abandoned_journeys: 4,
        preferred_channel: 'Phone',
        
        // Risk Assessment - Small Business Considerations
        churn_risk: 35,
        risk_flags: 'Small Business Owner, Economic Sensitivity',
        missing_coverage: 'Business Interruption'
    }
})

export const policyHolder028 = Record({
    $id: Now.ID['policy-holder-028'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Taylor Morgan Smith',
        first_name: 'Taylor',
        last_name: 'Smith',
        email: 'taylor.smith@university.edu',
        phone: '+15550128',
        age: 27,
        customer_id: 'CUST-2024-1028',
        tier: 'bronze',
        
        // Financial Profile - Graduate Student
        credit_score: 634,
        lifetime_value: 19400,
        clv_score: 3.6,
        credit_utilization_percent: 72,
        number_of_open_accounts: 2,
        number_of_closed_accounts: 0,
        delinquency_12m: 1,
        credit_inquiries_last_6m: 3,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Young Digital Native
        tenure_years: 2,
        app_sessions_30_days: 38,
        avg_session_time_min: 3,
        website_visits_30_days: 42,
        quote_views: 26,
        abandoned_journeys: 18,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment - Student Profile
        churn_risk: 68,
        risk_flags: 'Student, Limited Income, High Utilization',
        missing_coverage: 'Student-specific Coverage'
    }
})

export const policyHolder029 = Record({
    $id: Now.ID['policy-holder-029'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Victoria Anne Cooper',
        first_name: 'Victoria',
        last_name: 'Cooper',
        email: 'victoria.cooper@realestate.pro',
        phone: '+15550129',
        age: 49,
        customer_id: 'CUST-2024-1029',
        tier: 'gold',
        
        // Financial Profile - Real Estate Professional
        credit_score: 741,
        lifetime_value: 85600,
        clv_score: 7.4,
        credit_utilization_percent: 33,
        number_of_open_accounts: 8,
        number_of_closed_accounts: 4,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 6,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Professional Real Estate Agent
        tenure_years: 7,
        app_sessions_30_days: 34,
        avg_session_time_min: 6,
        website_visits_30_days: 26,
        quote_views: 14,
        abandoned_journeys: 5,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment - Commission-based Income
        churn_risk: 28,
        risk_flags: 'Commission Income, Market Dependent',
        missing_coverage: 'Errors & Omissions Enhancement'
    }
})

export const policyHolder030 = Record({
    $id: Now.ID['policy-holder-030'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Alex Jamie Rivera',
        first_name: 'Alex',
        last_name: 'Rivera',
        email: 'alex.rivera@techstartup.io',
        phone: '+15550130',
        age: 33,
        customer_id: 'CUST-2024-1030',
        tier: 'silver',
        
        // Financial Profile - Tech Startup Employee
        credit_score: 695,
        lifetime_value: 48700,
        clv_score: 6.0,
        credit_utilization_percent: 41,
        number_of_open_accounts: 5,
        number_of_closed_accounts: 1,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 2,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Tech-forward User
        tenure_years: 4,
        app_sessions_30_days: 56,
        avg_session_time_min: 5,
        website_visits_30_days: 33,
        quote_views: 16,
        abandoned_journeys: 7,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment - Startup Environment
        churn_risk: 38,
        risk_flags: 'Startup Employee, Equity Compensation',
        missing_coverage: 'Stock Option Protection'
    }
})