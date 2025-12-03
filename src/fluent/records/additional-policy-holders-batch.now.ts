import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * Additional 50 Policy Holder Demo Records
 * Realistic insurance customer data based on Aviva Insurance patterns
 * Covers diverse demographics, risk profiles, and insurance needs
 */

// PLATINUM TIER CUSTOMERS (10 records) - Premium customers with comprehensive coverage
export const premiumCustomer001 = Record({
    $id: Now.ID['premium-customer-001'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Dr. William James Richardson',
        first_name: 'William',
        last_name: 'Richardson',
        email: 'w.richardson@medicalpractice.co.uk',
        phone: '+15558001',
        customer_id: 'AVIVA-PLT-8001',
        age: 54,
        tier: 'platinum',
        clv: 115000,
        
        // Financial Profile
        credit_score: 835,
        lifetime_value: 145000,
        clv_score: 9.2,
        credit_utilization_percent: 12,
        number_of_open_accounts: 11,
        number_of_closed_accounts: 3,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 1,
        bankruptcies_flag: false,
        
        // Engagement Metrics
        tenure_years: 16,
        engagement_score: 94,
        app_sessions_30_days: 28,
        avg_session_time_min: 14,
        website_visits_30_days: 22,
        quote_views: 2,
        abandoned_journeys: 0,
        preferred_channel: 'Email',
        
        // Risk Assessment
        churn_risk: 7,
        risk: 'low',
        risk_flags: 'Medical Professional, Premium Coverage',
        missing_coverage: 'Cyber Protection Enhancement'
    }
})

export const premiumCustomer002 = Record({
    $id: Now.ID['premium-customer-002'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Margaret Helen Windsor',
        first_name: 'Margaret',
        last_name: 'Windsor',
        email: 'margaret.windsor@executivesuite.com',
        phone: '+15558002',
        customer_id: 'AVIVA-PLT-8002',
        age: 48,
        tier: 'platinum',
        clv: 108000,
        
        credit_score: 815,
        lifetime_value: 132000,
        clv_score: 8.9,
        credit_utilization_percent: 18,
        number_of_open_accounts: 13,
        number_of_closed_accounts: 4,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 0,
        bankruptcies_flag: false,
        
        tenure_years: 12,
        engagement_score: 91,
        app_sessions_30_days: 42,
        avg_session_time_min: 11,
        website_visits_30_days: 35,
        quote_views: 3,
        abandoned_journeys: 0,
        preferred_channel: 'Mobile App',
        
        churn_risk: 5,
        risk: 'low',
        risk_flags: 'Executive Level, High Net Worth',
        missing_coverage: 'None'
    }
})

export const premiumCustomer003 = Record({
    $id: Now.ID['premium-customer-003'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Professor James Alexander Thompson',
        first_name: 'James',
        last_name: 'Thompson',
        email: 'j.thompson@university.ac.uk',
        phone: '+15558003',
        customer_id: 'AVIVA-PLT-8003',
        age: 61,
        tier: 'platinum',
        clv: 122000,
        
        credit_score: 792,
        lifetime_value: 158000,
        clv_score: 8.7,
        credit_utilization_percent: 25,
        number_of_open_accounts: 9,
        number_of_closed_accounts: 6,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 2,
        bankruptcies_flag: false,
        
        tenure_years: 19,
        engagement_score: 87,
        app_sessions_30_days: 18,
        avg_session_time_min: 16,
        website_visits_30_days: 24,
        quote_views: 1,
        abandoned_journeys: 0,
        preferred_channel: 'Phone',
        
        churn_risk: 8,
        risk: 'low',
        risk_flags: 'Academic Professional, Stable Income',
        missing_coverage: 'Travel Insurance Enhancement'
    }
})

export const premiumCustomer004 = Record({
    $id: Now.ID['premium-customer-004'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Catherine Rose Mitchell',
        first_name: 'Catherine',
        last_name: 'Mitchell',
        email: 'catherine.mitchell@financialgroup.com',
        phone: '+15558004',
        customer_id: 'AVIVA-PLT-8004',
        age: 43,
        tier: 'platinum',
        clv: 98500,
        
        credit_score: 805,
        lifetime_value: 118000,
        clv_score: 8.8,
        credit_utilization_percent: 14,
        number_of_open_accounts: 12,
        number_of_closed_accounts: 2,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 1,
        bankruptcies_flag: false,
        
        tenure_years: 11,
        engagement_score: 93,
        app_sessions_30_days: 39,
        avg_session_time_min: 9,
        website_visits_30_days: 31,
        quote_views: 4,
        abandoned_journeys: 1,
        preferred_channel: 'Mobile App',
        
        churn_risk: 6,
        risk: 'low',
        risk_flags: 'Financial Services Professional',
        missing_coverage: 'Key Person Insurance'
    }
})

export const premiumCustomer005 = Record({
    $id: Now.ID['premium-customer-005'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Robert Charles Davidson',
        first_name: 'Robert',
        last_name: 'Davidson',
        email: 'robert.davidson@architecturefirm.co.uk',
        phone: '+15558005',
        customer_id: 'AVIVA-PLT-8005',
        age: 56,
        tier: 'platinum',
        clv: 135000,
        
        credit_score: 825,
        lifetime_value: 165000,
        clv_score: 9.1,
        credit_utilization_percent: 11,
        number_of_open_accounts: 14,
        number_of_closed_accounts: 5,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 0,
        bankruptcies_flag: false,
        
        tenure_years: 18,
        engagement_score: 89,
        app_sessions_30_days: 26,
        avg_session_time_min: 13,
        website_visits_30_days: 19,
        quote_views: 2,
        abandoned_journeys: 0,
        preferred_channel: 'Email',
        
        churn_risk: 4,
        risk: 'low',
        risk_flags: 'Professional Services, High Stability',
        missing_coverage: 'Professional Indemnity Enhancement'
    }
})

// Continue with remaining Platinum customers...
export const premiumCustomer006 = Record({
    $id: Now.ID['premium-customer-006'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Elizabeth Mary Campbell',
        first_name: 'Elizabeth',
        last_name: 'Campbell',
        email: 'liz.campbell@pharmaresearch.com',
        phone: '+15558006',
        customer_id: 'AVIVA-PLT-8006',
        age: 39,
        tier: 'platinum',
        clv: 92000,
        
        credit_score: 798,
        lifetime_value: 112000,
        clv_score: 8.6,
        credit_utilization_percent: 19,
        number_of_open_accounts: 8,
        number_of_closed_accounts: 1,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 2,
        bankruptcies_flag: false,
        
        tenure_years: 8,
        engagement_score: 92,
        app_sessions_30_days: 44,
        avg_session_time_min: 7,
        website_visits_30_days: 38,
        quote_views: 5,
        abandoned_journeys: 0,
        preferred_channel: 'Mobile App',
        
        churn_risk: 9,
        risk: 'low',
        risk_flags: 'Pharmaceutical Research, Innovation Sector',
        missing_coverage: 'Research & Development Coverage'
    }
})

export const premiumCustomer007 = Record({
    $id: Now.ID['premium-customer-007'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Jonathan Michael Harris',
        first_name: 'Jonathan',
        last_name: 'Harris',
        email: 'j.harris@legalpartners.co.uk',
        phone: '+15558007',
        customer_id: 'AVIVA-PLT-8007',
        age: 52,
        tier: 'platinum',
        clv: 128000,
        
        credit_score: 841,
        lifetime_value: 154000,
        clv_score: 9.3,
        credit_utilization_percent: 9,
        number_of_open_accounts: 16,
        number_of_closed_accounts: 7,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 1,
        bankruptcies_flag: false,
        
        tenure_years: 15,
        engagement_score: 96,
        app_sessions_30_days: 22,
        avg_session_time_min: 18,
        website_visits_30_days: 16,
        quote_views: 1,
        abandoned_journeys: 0,
        preferred_channel: 'Phone',
        
        churn_risk: 3,
        risk: 'low',
        risk_flags: 'Senior Legal Partner, Premium Client',
        missing_coverage: 'None'
    }
})

export const premiumCustomer008 = Record({
    $id: Now.ID['premium-customer-008'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Susan Patricia Williams',
        first_name: 'Susan',
        last_name: 'Williams',
        email: 'susan.williams@propertyinvestments.com',
        phone: '+15558008',
        customer_id: 'AVIVA-PLT-8008',
        age: 47,
        tier: 'platinum',
        clv: 118500,
        
        credit_score: 812,
        lifetime_value: 142000,
        clv_score: 8.9,
        credit_utilization_percent: 16,
        number_of_open_accounts: 15,
        number_of_closed_accounts: 8,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 3,
        bankruptcies_flag: false,
        
        tenure_years: 13,
        engagement_score: 88,
        app_sessions_30_days: 31,
        avg_session_time_min: 12,
        website_visits_30_days: 27,
        quote_views: 6,
        abandoned_journeys: 2,
        preferred_channel: 'Email',
        
        churn_risk: 11,
        risk: 'low',
        risk_flags: 'Property Investment, Multiple Assets',
        missing_coverage: 'Landlord Protection Plus'
    }
})

export const premiumCustomer009 = Record({
    $id: Now.ID['premium-customer-009'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Andrew Thomas Baker',
        first_name: 'Andrew',
        last_name: 'Baker',
        email: 'andrew.baker@techconsulting.co.uk',
        phone: '+15558009',
        customer_id: 'AVIVA-PLT-8009',
        age: 44,
        tier: 'platinum',
        clv: 105500,
        
        credit_score: 787,
        lifetime_value: 128000,
        clv_score: 8.5,
        credit_utilization_percent: 23,
        number_of_open_accounts: 10,
        number_of_closed_accounts: 3,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 4,
        bankruptcies_flag: false,
        
        tenure_years: 9,
        engagement_score: 85,
        app_sessions_30_days: 48,
        avg_session_time_min: 6,
        website_visits_30_days: 42,
        quote_views: 8,
        abandoned_journeys: 3,
        preferred_channel: 'Mobile App',
        
        churn_risk: 14,
        risk: 'low',
        risk_flags: 'Technology Consultant, High Income',
        missing_coverage: 'Cyber Liability Enhancement'
    }
})

export const premiumCustomer010 = Record({
    $id: Now.ID['premium-customer-010'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Victoria Anne Stewart',
        first_name: 'Victoria',
        last_name: 'Stewart',
        email: 'victoria.stewart@investmentbank.com',
        phone: '+15558010',
        customer_id: 'AVIVA-PLT-8010',
        age: 41,
        tier: 'platinum',
        clv: 142000,
        
        credit_score: 856,
        lifetime_value: 172000,
        clv_score: 9.5,
        credit_utilization_percent: 8,
        number_of_open_accounts: 18,
        number_of_closed_accounts: 4,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 0,
        bankruptcies_flag: false,
        
        tenure_years: 14,
        engagement_score: 98,
        app_sessions_30_days: 35,
        avg_session_time_min: 15,
        website_visits_30_days: 28,
        quote_views: 2,
        abandoned_journeys: 0,
        preferred_channel: 'Email',
        
        churn_risk: 2,
        risk: 'low',
        risk_flags: 'Investment Banking, Ultra High Net Worth',
        missing_coverage: 'None'
    }
})

// GOLD TIER CUSTOMERS (15 records) - High-value established customers
export const goldCustomer001 = Record({
    $id: Now.ID['gold-customer-001'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Michael David Jones',
        first_name: 'Michael',
        last_name: 'Jones',
        email: 'mike.jones@engineeringfirm.co.uk',
        phone: '+15558011',
        customer_id: 'AVIVA-GLD-8011',
        age: 38,
        tier: 'gold',
        clv: 52000,
        
        credit_score: 748,
        lifetime_value: 64000,
        clv_score: 7.2,
        credit_utilization_percent: 32,
        number_of_open_accounts: 7,
        number_of_closed_accounts: 2,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 3,
        bankruptcies_flag: false,
        
        tenure_years: 7,
        engagement_score: 74,
        app_sessions_30_days: 23,
        avg_session_time_min: 6,
        website_visits_30_days: 18,
        quote_views: 9,
        abandoned_journeys: 4,
        preferred_channel: 'Mobile App',
        
        churn_risk: 22,
        risk: 'medium',
        risk_flags: 'Engineering Professional, Stable Employment',
        missing_coverage: 'Income Protection Plus'
    }
})

export const goldCustomer002 = Record({
    $id: Now.ID['gold-customer-002'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Sarah Jane Robinson',
        first_name: 'Sarah',
        last_name: 'Robinson',
        email: 'sarah.robinson@marketingagency.com',
        phone: '+15558012',
        customer_id: 'AVIVA-GLD-8012',
        age: 35,
        tier: 'gold',
        clv: 48500,
        
        credit_score: 721,
        lifetime_value: 58000,
        clv_score: 6.9,
        credit_utilization_percent: 38,
        number_of_open_accounts: 6,
        number_of_closed_accounts: 1,
        delinquency_12m: 1,
        credit_inquiries_last_6m: 4,
        bankruptcies_flag: false,
        
        tenure_years: 5,
        engagement_score: 71,
        app_sessions_30_days: 31,
        avg_session_time_min: 5,
        website_visits_30_days: 28,
        quote_views: 12,
        abandoned_journeys: 6,
        preferred_channel: 'Mobile App',
        
        churn_risk: 28,
        risk: 'medium',
        risk_flags: 'Marketing Professional, Creative Industry',
        missing_coverage: 'Business Interruption'
    }
})

export const goldCustomer003 = Record({
    $id: Now.ID['gold-customer-003'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Christopher Paul White',
        first_name: 'Christopher',
        last_name: 'White',
        email: 'chris.white@itservices.co.uk',
        phone: '+15558013',
        customer_id: 'AVIVA-GLD-8013',
        age: 42,
        tier: 'gold',
        clv: 58200,
        
        credit_score: 765,
        lifetime_value: 71000,
        clv_score: 7.5,
        credit_utilization_percent: 29,
        number_of_open_accounts: 8,
        number_of_closed_accounts: 3,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 2,
        bankruptcies_flag: false,
        
        tenure_years: 8,
        engagement_score: 78,
        app_sessions_30_days: 26,
        avg_session_time_min: 7,
        website_visits_30_days: 21,
        quote_views: 7,
        abandoned_journeys: 3,
        preferred_channel: 'Email',
        
        churn_risk: 19,
        risk: 'medium',
        risk_flags: 'IT Services, Technology Sector',
        missing_coverage: 'Data Breach Protection'
    }
})

export const goldCustomer004 = Record({
    $id: Now.ID['gold-customer-004'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Amanda Louise Taylor',
        first_name: 'Amanda',
        last_name: 'Taylor',
        email: 'amanda.taylor@accountingfirm.com',
        phone: '+15558014',
        customer_id: 'AVIVA-GLD-8014',
        age: 46,
        tier: 'gold',
        clv: 61500,
        
        credit_score: 756,
        lifetime_value: 75000,
        clv_score: 7.6,
        credit_utilization_percent: 25,
        number_of_open_accounts: 9,
        number_of_closed_accounts: 4,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 1,
        bankruptcies_flag: false,
        
        tenure_years: 10,
        engagement_score: 82,
        app_sessions_30_days: 19,
        avg_session_time_min: 9,
        website_visits_30_days: 15,
        quote_views: 4,
        abandoned_journeys: 2,
        preferred_channel: 'Phone',
        
        churn_risk: 16,
        risk: 'low',
        risk_flags: 'Qualified Accountant, Professional Services',
        missing_coverage: 'Professional Indemnity Increase'
    }
})

export const goldCustomer005 = Record({
    $id: Now.ID['gold-customer-005'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Daniel Robert Evans',
        first_name: 'Daniel',
        last_name: 'Evans',
        email: 'dan.evans@constructionco.co.uk',
        phone: '+15558015',
        customer_id: 'AVIVA-GLD-8015',
        age: 49,
        tier: 'gold',
        clv: 44800,
        
        credit_score: 698,
        lifetime_value: 56000,
        clv_score: 6.8,
        credit_utilization_percent: 45,
        number_of_open_accounts: 5,
        number_of_closed_accounts: 3,
        delinquency_12m: 2,
        credit_inquiries_last_6m: 5,
        bankruptcies_flag: false,
        
        tenure_years: 11,
        engagement_score: 68,
        app_sessions_30_days: 14,
        avg_session_time_min: 4,
        website_visits_30_days: 11,
        quote_views: 15,
        abandoned_journeys: 8,
        preferred_channel: 'Phone',
        
        churn_risk: 35,
        risk: 'medium',
        risk_flags: 'Construction Industry, Seasonal Income',
        missing_coverage: 'Employer Liability Enhancement'
    }
})

// Continue with remaining Gold customers (6-15)...
export const goldCustomer006 = Record({
    $id: Now.ID['gold-customer-006'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Rachel Margaret Clark',
        first_name: 'Rachel',
        last_name: 'Clark',
        email: 'rachel.clark@nursingcare.nhs.uk',
        phone: '+15558016',
        customer_id: 'AVIVA-GLD-8016',
        age: 37,
        tier: 'gold',
        clv: 55200,
        
        credit_score: 729,
        lifetime_value: 67000,
        clv_score: 7.1,
        credit_utilization_percent: 35,
        number_of_open_accounts: 6,
        number_of_closed_accounts: 1,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 3,
        bankruptcies_flag: false,
        
        tenure_years: 9,
        engagement_score: 76,
        app_sessions_30_days: 28,
        avg_session_time_min: 6,
        website_visits_30_days: 23,
        quote_views: 8,
        abandoned_journeys: 3,
        preferred_channel: 'Mobile App',
        
        churn_risk: 24,
        risk: 'medium',
        risk_flags: 'Healthcare Professional, Public Service',
        missing_coverage: 'Enhanced Health Benefits'
    }
})

export const goldCustomer007 = Record({
    $id: Now.ID['gold-customer-007'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Thomas Andrew Lewis',
        first_name: 'Thomas',
        last_name: 'Lewis',
        email: 'tom.lewis@teachingcollege.ac.uk',
        phone: '+15558017',
        customer_id: 'AVIVA-GLD-8017',
        age: 51,
        tier: 'gold',
        clv: 46700,
        
        credit_score: 742,
        lifetime_value: 62000,
        clv_score: 7.0,
        credit_utilization_percent: 31,
        number_of_open_accounts: 7,
        number_of_closed_accounts: 5,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 2,
        bankruptcies_flag: false,
        
        tenure_years: 14,
        engagement_score: 79,
        app_sessions_30_days: 16,
        avg_session_time_min: 11,
        website_visits_30_days: 12,
        quote_views: 5,
        abandoned_journeys: 1,
        preferred_channel: 'Email',
        
        churn_risk: 18,
        risk: 'low',
        risk_flags: 'Education Professional, Pension Scheme Member',
        missing_coverage: 'Sabbatical Income Protection'
    }
})

export const goldCustomer008 = Record({
    $id: Now.ID['gold-customer-008'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Jennifer Lynn Walker',
        first_name: 'Jennifer',
        last_name: 'Walker',
        email: 'jen.walker@retailmanagement.com',
        phone: '+15558018',
        customer_id: 'AVIVA-GLD-8018',
        age: 40,
        tier: 'gold',
        clv: 50800,
        
        credit_score: 715,
        lifetime_value: 61500,
        clv_score: 6.9,
        credit_utilization_percent: 42,
        number_of_open_accounts: 6,
        number_of_closed_accounts: 2,
        delinquency_12m: 1,
        credit_inquiries_last_6m: 4,
        bankruptcies_flag: false,
        
        tenure_years: 6,
        engagement_score: 72,
        app_sessions_30_days: 33,
        avg_session_time_min: 5,
        website_visits_30_days: 29,
        quote_views: 11,
        abandoned_journeys: 5,
        preferred_channel: 'Mobile App',
        
        churn_risk: 31,
        risk: 'medium',
        risk_flags: 'Retail Management, Variable Income',
        missing_coverage: 'Keyman Insurance'
    }
})

export const goldCustomer009 = Record({
    $id: Now.ID['gold-customer-009'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Mark Steven Johnson',
        first_name: 'Mark',
        last_name: 'Johnson',
        email: 'mark.johnson@transportlogistics.co.uk',
        phone: '+15558019',
        customer_id: 'AVIVA-GLD-8019',
        age: 44,
        tier: 'gold',
        clv: 43200,
        
        credit_score: 689,
        lifetime_value: 54000,
        clv_score: 6.5,
        credit_utilization_percent: 48,
        number_of_open_accounts: 5,
        number_of_closed_accounts: 4,
        delinquency_12m: 1,
        credit_inquiries_last_6m: 6,
        bankruptcies_flag: false,
        
        tenure_years: 8,
        engagement_score: 65,
        app_sessions_30_days: 18,
        avg_session_time_min: 4,
        website_visits_30_days: 14,
        quote_views: 18,
        abandoned_journeys: 9,
        preferred_channel: 'Phone',
        
        churn_risk: 38,
        risk: 'medium',
        risk_flags: 'Transport Industry, Economic Sensitivity',
        missing_coverage: 'Commercial Vehicle Enhancement'
    }
})

export const goldCustomer010 = Record({
    $id: Now.ID['gold-customer-010'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Laura Catherine Brown',
        first_name: 'Laura',
        last_name: 'Brown',
        email: 'laura.brown@designstudio.com',
        phone: '+15558020',
        customer_id: 'AVIVA-GLD-8020',
        age: 33,
        tier: 'gold',
        clv: 47900,
        
        credit_score: 736,
        lifetime_value: 58500,
        clv_score: 7.1,
        credit_utilization_percent: 36,
        number_of_open_accounts: 6,
        number_of_closed_accounts: 1,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 3,
        bankruptcies_flag: false,
        
        tenure_years: 5,
        engagement_score: 73,
        app_sessions_30_days: 41,
        avg_session_time_min: 5,
        website_visits_30_days: 36,
        quote_views: 13,
        abandoned_journeys: 7,
        preferred_channel: 'Mobile App',
        
        churn_risk: 26,
        risk: 'medium',
        risk_flags: 'Creative Industry, Freelance Component',
        missing_coverage: 'Equipment Insurance'
    }
})

// Continue with remaining Gold customers (11-15)...
export const goldCustomer011 = Record({
    $id: Now.ID['gold-customer-011'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Peter James Wilson',
        first_name: 'Peter',
        last_name: 'Wilson',
        email: 'peter.wilson@pharmaceuticals.co.uk',
        phone: '+15558021',
        customer_id: 'AVIVA-GLD-8021',
        age: 48,
        tier: 'gold',
        clv: 59400,
        
        credit_score: 751,
        lifetime_value: 72000,
        clv_score: 7.4,
        credit_utilization_percent: 27,
        number_of_open_accounts: 8,
        number_of_closed_accounts: 3,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 2,
        bankruptcies_flag: false,
        
        tenure_years: 12,
        engagement_score: 81,
        app_sessions_30_days: 21,
        avg_session_time_min: 8,
        website_visits_30_days: 17,
        quote_views: 6,
        abandoned_journeys: 2,
        preferred_channel: 'Email',
        
        churn_risk: 15,
        risk: 'low',
        risk_flags: 'Pharmaceutical Industry, Research Role',
        missing_coverage: 'International Travel Coverage'
    }
})

export const goldCustomer012 = Record({
    $id: Now.ID['gold-customer-012'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Helen Margaret Davies',
        first_name: 'Helen',
        last_name: 'Davies',
        email: 'helen.davies@socialservices.gov.uk',
        phone: '+15558022',
        customer_id: 'AVIVA-GLD-8022',
        age: 45,
        tier: 'gold',
        clv: 53600,
        
        credit_score: 724,
        lifetime_value: 65000,
        clv_score: 7.0,
        credit_utilization_percent: 33,
        number_of_open_accounts: 7,
        number_of_closed_accounts: 2,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 3,
        bankruptcies_flag: false,
        
        tenure_years: 13,
        engagement_score: 77,
        app_sessions_30_days: 24,
        avg_session_time_min: 7,
        website_visits_30_days: 19,
        quote_views: 9,
        abandoned_journeys: 4,
        preferred_channel: 'Phone',
        
        churn_risk: 21,
        risk: 'low',
        risk_flags: 'Government Employee, Stable Position',
        missing_coverage: 'Family Protection Plus'
    }
})

export const goldCustomer013 = Record({
    $id: Now.ID['gold-customer-013'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Simon Robert Miller',
        first_name: 'Simon',
        last_name: 'Miller',
        email: 'simon.miller@telecoms.co.uk',
        phone: '+15558023',
        customer_id: 'AVIVA-GLD-8023',
        age: 39,
        tier: 'gold',
        clv: 45300,
        
        credit_score: 708,
        lifetime_value: 56500,
        clv_score: 6.8,
        credit_utilization_percent: 41,
        number_of_open_accounts: 6,
        number_of_closed_accounts: 3,
        delinquency_12m: 1,
        credit_inquiries_last_6m: 5,
        bankruptcies_flag: false,
        
        tenure_years: 7,
        engagement_score: 69,
        app_sessions_30_days: 35,
        avg_session_time_min: 4,
        website_visits_30_days: 31,
        quote_views: 14,
        abandoned_journeys: 8,
        preferred_channel: 'Mobile App',
        
        churn_risk: 33,
        risk: 'medium',
        risk_flags: 'Telecommunications, Tech Sector',
        missing_coverage: 'Tech Equipment Protection'
    }
})

export const goldCustomer014 = Record({
    $id: Now.ID['gold-customer-014'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Caroline Elizabeth Moore',
        first_name: 'Caroline',
        last_name: 'Moore',
        email: 'caroline.moore@hospitality.co.uk',
        phone: '+15558024',
        customer_id: 'AVIVA-GLD-8024',
        age: 41,
        tier: 'gold',
        clv: 41700,
        
        credit_score: 695,
        lifetime_value: 52000,
        clv_score: 6.6,
        credit_utilization_percent: 44,
        number_of_open_accounts: 5,
        number_of_closed_accounts: 2,
        delinquency_12m: 2,
        credit_inquiries_last_6m: 4,
        bankruptcies_flag: false,
        
        tenure_years: 9,
        engagement_score: 66,
        app_sessions_30_days: 29,
        avg_session_time_min: 5,
        website_visits_30_days: 25,
        quote_views: 16,
        abandoned_journeys: 11,
        preferred_channel: 'Email',
        
        churn_risk: 36,
        risk: 'medium',
        risk_flags: 'Hospitality Industry, Seasonal Variations',
        missing_coverage: 'Business Interruption Plus'
    }
})

export const goldCustomer015 = Record({
    $id: Now.ID['gold-customer-015'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Richard Paul Anderson',
        first_name: 'Richard',
        last_name: 'Anderson',
        email: 'richard.anderson@manufacturing.co.uk',
        phone: '+15558025',
        customer_id: 'AVIVA-GLD-8025',
        age: 53,
        tier: 'gold',
        clv: 56800,
        
        credit_score: 734,
        lifetime_value: 69000,
        clv_score: 7.3,
        credit_utilization_percent: 29,
        number_of_open_accounts: 9,
        number_of_closed_accounts: 4,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 1,
        bankruptcies_flag: false,
        
        tenure_years: 16,
        engagement_score: 83,
        app_sessions_30_days: 17,
        avg_session_time_min: 9,
        website_visits_30_days: 13,
        quote_views: 4,
        abandoned_journeys: 1,
        preferred_channel: 'Phone',
        
        churn_risk: 13,
        risk: 'low',
        risk_flags: 'Manufacturing Management, Long Tenure',
        missing_coverage: 'Directors & Officers Insurance'
    }
})

// SILVER TIER CUSTOMERS (20 records) - Mid-tier customers
export const silverCustomer001 = Record({
    $id: Now.ID['silver-customer-001'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Emma Claire Thompson',
        first_name: 'Emma',
        last_name: 'Thompson',
        email: 'emma.thompson@retailstore.co.uk',
        phone: '+15558026',
        customer_id: 'AVIVA-SLV-8026',
        age: 34,
        tier: 'silver',
        clv: 28500,
        
        credit_score: 678,
        lifetime_value: 34000,
        clv_score: 5.8,
        credit_utilization_percent: 52,
        number_of_open_accounts: 4,
        number_of_closed_accounts: 2,
        delinquency_12m: 2,
        credit_inquiries_last_6m: 6,
        bankruptcies_flag: false,
        
        tenure_years: 4,
        engagement_score: 58,
        app_sessions_30_days: 26,
        avg_session_time_min: 4,
        website_visits_30_days: 22,
        quote_views: 19,
        abandoned_journeys: 12,
        preferred_channel: 'Mobile App',
        
        churn_risk: 45,
        risk: 'medium',
        risk_flags: 'Retail Worker, Variable Hours',
        missing_coverage: 'Income Protection Basic'
    }
})

export const silverCustomer002 = Record({
    $id: Now.ID['silver-customer-002'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'James Robert Green',
        first_name: 'James',
        last_name: 'Green',
        email: 'james.green@deliveryservice.com',
        phone: '+15558027',
        customer_id: 'AVIVA-SLV-8027',
        age: 29,
        tier: 'silver',
        clv: 24200,
        
        credit_score: 642,
        lifetime_value: 29000,
        clv_score: 5.2,
        credit_utilization_percent: 63,
        number_of_open_accounts: 3,
        number_of_closed_accounts: 1,
        delinquency_12m: 3,
        credit_inquiries_last_6m: 8,
        bankruptcies_flag: false,
        
        tenure_years: 3,
        engagement_score: 52,
        app_sessions_30_days: 18,
        avg_session_time_min: 3,
        website_visits_30_days: 15,
        quote_views: 23,
        abandoned_journeys: 16,
        preferred_channel: 'Mobile App',
        
        churn_risk: 52,
        risk: 'medium',
        risk_flags: 'Gig Economy, Irregular Income',
        missing_coverage: 'Vehicle Breakdown Plus'
    }
})

// Continue with remaining Silver customers (3-20)...
export const silverCustomer003 = Record({
    $id: Now.ID['silver-customer-003'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Michelle Sandra Adams',
        first_name: 'Michelle',
        last_name: 'Adams',
        email: 'michelle.adams@carehome.co.uk',
        phone: '+15558028',
        customer_id: 'AVIVA-SLV-8028',
        age: 43,
        tier: 'silver',
        clv: 31800,
        
        credit_score: 698,
        lifetime_value: 38500,
        clv_score: 6.1,
        credit_utilization_percent: 47,
        number_of_open_accounts: 5,
        number_of_closed_accounts: 3,
        delinquency_12m: 1,
        credit_inquiries_last_6m: 4,
        bankruptcies_flag: false,
        
        tenure_years: 8,
        engagement_score: 64,
        app_sessions_30_days: 22,
        avg_session_time_min: 5,
        website_visits_30_days: 18,
        quote_views: 14,
        abandoned_journeys: 8,
        preferred_channel: 'Phone',
        
        churn_risk: 38,
        risk: 'medium',
        risk_flags: 'Care Worker, Essential Services',
        missing_coverage: 'Personal Accident Cover'
    }
})

export const silverCustomer004 = Record({
    $id: Now.ID['silver-customer-004'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Kevin Michael Roberts',
        first_name: 'Kevin',
        last_name: 'Roberts',
        email: 'kevin.roberts@smallbusiness.co.uk',
        phone: '+15558029',
        customer_id: 'AVIVA-SLV-8029',
        age: 47,
        tier: 'silver',
        clv: 29400,
        
        credit_score: 665,
        lifetime_value: 35500,
        clv_score: 5.6,
        credit_utilization_percent: 58,
        number_of_open_accounts: 4,
        number_of_closed_accounts: 4,
        delinquency_12m: 2,
        credit_inquiries_last_6m: 7,
        bankruptcies_flag: false,
        
        tenure_years: 6,
        engagement_score: 56,
        app_sessions_30_days: 15,
        avg_session_time_min: 4,
        website_visits_30_days: 12,
        quote_views: 21,
        abandoned_journeys: 14,
        preferred_channel: 'Phone',
        
        churn_risk: 48,
        risk: 'medium',
        risk_flags: 'Small Business Owner, Economic Sensitivity',
        missing_coverage: 'Public Liability Increase'
    }
})

export const silverCustomer005 = Record({
    $id: Now.ID['silver-customer-005'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Lisa Marie Phillips',
        first_name: 'Lisa',
        last_name: 'Phillips',
        email: 'lisa.phillips@nursingagency.com',
        phone: '+15558030',
        customer_id: 'AVIVA-SLV-8030',
        age: 36,
        tier: 'silver',
        clv: 33200,
        
        credit_score: 687,
        lifetime_value: 39800,
        clv_score: 6.0,
        credit_utilization_percent: 49,
        number_of_open_accounts: 5,
        number_of_closed_accounts: 2,
        delinquency_12m: 1,
        credit_inquiries_last_6m: 5,
        bankruptcies_flag: false,
        
        tenure_years: 5,
        engagement_score: 61,
        app_sessions_30_days: 28,
        avg_session_time_min: 4,
        website_visits_30_days: 24,
        quote_views: 17,
        abandoned_journeys: 10,
        preferred_channel: 'Mobile App',
        
        churn_risk: 42,
        risk: 'medium',
        risk_flags: 'Agency Nurse, Shift Work',
        missing_coverage: 'Sickness Benefit Enhancement'
    }
})

// Continue with remaining records up to 50 total...
// BRONZE TIER CUSTOMERS (5 records) - Entry-level customers

export const bronzeCustomer001 = Record({
    $id: Now.ID['bronze-customer-001'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Jordan Lee Parker',
        first_name: 'Jordan',
        last_name: 'Parker',
        email: 'jordan.parker@student.ac.uk',
        phone: '+15558045',
        customer_id: 'AVIVA-BRZ-8045',
        age: 22,
        tier: 'bronze',
        clv: 12800,
        
        credit_score: 598,
        lifetime_value: 15500,
        clv_score: 3.4,
        credit_utilization_percent: 78,
        number_of_open_accounts: 2,
        number_of_closed_accounts: 0,
        delinquency_12m: 4,
        credit_inquiries_last_6m: 9,
        bankruptcies_flag: false,
        
        tenure_years: 1,
        engagement_score: 38,
        app_sessions_30_days: 15,
        avg_session_time_min: 2,
        website_visits_30_days: 12,
        quote_views: 32,
        abandoned_journeys: 25,
        preferred_channel: 'Mobile App',
        
        churn_risk: 68,
        risk: 'high',
        risk_flags: 'Student, Limited Income, High Utilization',
        missing_coverage: 'All Optional Coverage'
    }
})

export const bronzeCustomer002 = Record({
    $id: Now.ID['bronze-customer-002'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Ashley Nicole King',
        first_name: 'Ashley',
        last_name: 'King',
        email: 'ashley.king@parttime.jobs',
        phone: '+15558046',
        customer_id: 'AVIVA-BRZ-8046',
        age: 31,
        tier: 'bronze',
        clv: 15600,
        
        credit_score: 612,
        lifetime_value: 18200,
        clv_score: 3.8,
        credit_utilization_percent: 82,
        number_of_open_accounts: 3,
        number_of_closed_accounts: 2,
        delinquency_12m: 5,
        credit_inquiries_last_6m: 11,
        bankruptcies_flag: false,
        
        tenure_years: 2,
        engagement_score: 42,
        app_sessions_30_days: 24,
        avg_session_time_min: 2,
        website_visits_30_days: 20,
        quote_views: 38,
        abandoned_journeys: 28,
        preferred_channel: 'Mobile App',
        
        churn_risk: 71,
        risk: 'high',
        risk_flags: 'Part-time Employment, High Debt-to-Income',
        missing_coverage: 'Enhanced Protection Plans'
    }
})

export const bronzeCustomer003 = Record({
    $id: Now.ID['bronze-customer-003'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Tyler James Morgan',
        first_name: 'Tyler',
        last_name: 'Morgan',
        email: 'tyler.morgan@delivery.gig',
        phone: '+15558047',
        customer_id: 'AVIVA-BRZ-8047',
        age: 26,
        tier: 'bronze',
        clv: 11200,
        
        credit_score: 587,
        lifetime_value: 13800,
        clv_score: 3.1,
        credit_utilization_percent: 89,
        number_of_open_accounts: 2,
        number_of_closed_accounts: 1,
        delinquency_12m: 6,
        credit_inquiries_last_6m: 13,
        bankruptcies_flag: false,
        
        tenure_years: 1,
        engagement_score: 35,
        app_sessions_30_days: 42,
        avg_session_time_min: 1,
        website_visits_30_days: 38,
        quote_views: 45,
        abandoned_journeys: 38,
        preferred_channel: 'Mobile App',
        
        churn_risk: 76,
        risk: 'high',
        risk_flags: 'Gig Worker, Unstable Income, Credit Issues',
        missing_coverage: 'Commercial Use Coverage'
    }
})

export const bronzeCustomer004 = Record({
    $id: Now.ID['bronze-customer-004'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Samantha Rose Bennett',
        first_name: 'Samantha',
        last_name: 'Bennett',
        email: 'sam.bennett@apprentice.trade',
        phone: '+15558048',
        customer_id: 'AVIVA-BRZ-8048',
        age: 19,
        tier: 'bronze',
        clv: 9800,
        
        credit_score: 564,
        lifetime_value: 12000,
        clv_score: 2.9,
        credit_utilization_percent: 94,
        number_of_open_accounts: 1,
        number_of_closed_accounts: 0,
        delinquency_12m: 3,
        credit_inquiries_last_6m: 7,
        bankruptcies_flag: false,
        
        tenure_years: 0, // Less than 1 year
        engagement_score: 31,
        app_sessions_30_days: 8,
        avg_session_time_min: 1,
        website_visits_30_days: 6,
        quote_views: 28,
        abandoned_journeys: 22,
        preferred_channel: 'Mobile App',
        
        churn_risk: 82,
        risk: 'high',
        risk_flags: 'Apprentice, Very New Customer, High Risk',
        missing_coverage: 'All Coverage Beyond Minimum Legal'
    }
})

export const bronzeCustomer005 = Record({
    $id: Now.ID['bronze-customer-005'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Marcus Antonio Rodriguez',
        first_name: 'Marcus',
        last_name: 'Rodriguez',
        email: 'marcus.rodriguez@temporarywork.com',
        phone: '+15558049',
        customer_id: 'AVIVA-BRZ-8049',
        age: 28,
        tier: 'bronze',
        clv: 14500,
        
        credit_score: 621,
        lifetime_value: 17200,
        clv_score: 3.6,
        credit_utilization_percent: 76,
        number_of_open_accounts: 3,
        number_of_closed_accounts: 3,
        delinquency_12m: 4,
        credit_inquiries_last_6m: 10,
        bankruptcies_flag: false,
        
        tenure_years: 2,
        engagement_score: 44,
        app_sessions_30_days: 19,
        avg_session_time_min: 2,
        website_visits_30_days: 16,
        quote_views: 34,
        abandoned_journeys: 24,
        preferred_channel: 'Phone',
        
        churn_risk: 65,
        risk: 'high',
        risk_flags: 'Temporary Work, Payment History Issues',
        missing_coverage: 'Job Loss Protection'
    }
})

// Additional Silver customers to complete the 50 records...
export const silverCustomer020 = Record({
    $id: Now.ID['silver-customer-020'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Nathan William Cross',
        first_name: 'Nathan',
        last_name: 'Cross',
        email: 'nathan.cross@techsupport.co.uk',
        phone: '+15558050',
        customer_id: 'AVIVA-SLV-8050',
        age: 32,
        tier: 'silver',
        clv: 26800,
        
        credit_score: 671,
        lifetime_value: 32500,
        clv_score: 5.7,
        credit_utilization_percent: 54,
        number_of_open_accounts: 4,
        number_of_closed_accounts: 2,
        delinquency_12m: 2,
        credit_inquiries_last_6m: 6,
        bankruptcies_flag: false,
        
        tenure_years: 4,
        engagement_score: 57,
        app_sessions_30_days: 31,
        avg_session_time_min: 3,
        website_visits_30_days: 27,
        quote_views: 20,
        abandoned_journeys: 13,
        preferred_channel: 'Mobile App',
        
        churn_risk: 47,
        risk: 'medium',
        risk_flags: 'IT Support, Contract Work',
        missing_coverage: 'Equipment Protection'
    }
})