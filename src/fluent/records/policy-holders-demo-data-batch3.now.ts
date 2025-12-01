import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Demo Data Batch 3 - 20 Additional Policy Holders
// Diverse customer profiles across all tiers and scenarios

export const policyHolder016 = Record({
    $id: Now.ID['policy-holder-016'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Alexander Rivera',
        first_name: 'Alexander',
        last_name: 'Rivera',
        email: 'alexander.rivera@finance.corp',
        phone: '+15550116',
        age: 42,
        customer_id: 'CUST-2024-1016',
        tier: 'platinum',
        
        // Financial Profile - Investment Banker
        credit_score: 825,
        lifetime_value: 198000,
        clv_score: 9.1,
        credit_utilization_percent: 12,
        number_of_open_accounts: 14,
        number_of_closed_accounts: 3,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 1,
        bankruptcies_flag: false,
        
        // Engagement Metrics - High Value Digital User
        tenure_years: 9,
        app_sessions_30_days: 48,
        avg_session_time_min: 11,
        website_visits_30_days: 32,
        quote_views: 3,
        abandoned_journeys: 0,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment
        churn_risk: 7,
        risk_flags: 'Premium Customer, High Income',
        missing_coverage: 'International Travel Premium'
    }
})

export const policyHolder017 = Record({
    $id: Now.ID['policy-holder-017'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Victoria Chen',
        first_name: 'Victoria',
        last_name: 'Chen',
        email: 'victoria.chen@medical.research',
        phone: '+15550117',
        age: 38,
        customer_id: 'CUST-2024-1017',
        tier: 'gold',
        
        // Financial Profile - Medical Professional
        credit_score: 778,
        lifetime_value: 87400,
        clv_score: 7.9,
        credit_utilization_percent: 24,
        number_of_open_accounts: 8,
        number_of_closed_accounts: 2,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 2,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Busy Professional
        tenure_years: 7,
        app_sessions_30_days: 32,
        avg_session_time_min: 7,
        website_visits_30_days: 19,
        quote_views: 5,
        abandoned_journeys: 1,
        preferred_channel: 'Email',
        
        // Risk Assessment
        churn_risk: 19,
        risk_flags: 'Stable Professional Income',
        missing_coverage: 'Malpractice Enhancement'
    }
})

export const policyHolder018 = Record({
    $id: Now.ID['policy-holder-018'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Marcus Thompson',
        first_name: 'Marcus',
        last_name: 'Thompson',
        email: 'marcus.thompson@sports.agency',
        phone: '+15550118',
        age: 29,
        customer_id: 'CUST-2024-1018',
        tier: 'silver',
        
        // Financial Profile - Sports Agent
        credit_score: 692,
        lifetime_value: 48600,
        clv_score: 6.3,
        credit_utilization_percent: 38,
        number_of_open_accounts: 6,
        number_of_closed_accounts: 1,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 4,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Mobile First
        tenure_years: 4,
        app_sessions_30_days: 56,
        avg_session_time_min: 4,
        website_visits_30_days: 41,
        quote_views: 12,
        abandoned_journeys: 4,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment
        churn_risk: 33,
        risk_flags: 'Variable Income, Young Professional',
        missing_coverage: 'Business Interruption'
    }
})

export const policyHolder019 = Record({
    $id: Now.ID['policy-holder-019'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Diana Walsh',
        first_name: 'Diana',
        last_name: 'Walsh',
        email: 'diana.walsh@nonprofit.org',
        phone: '+15550119',
        age: 46,
        customer_id: 'CUST-2024-1019',
        tier: 'silver',
        
        // Financial Profile - Nonprofit Director
        credit_score: 715,
        lifetime_value: 56200,
        clv_score: 6.7,
        credit_utilization_percent: 31,
        number_of_open_accounts: 5,
        number_of_closed_accounts: 2,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 1,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Steady User
        tenure_years: 12,
        app_sessions_30_days: 21,
        avg_session_time_min: 8,
        website_visits_30_days: 16,
        quote_views: 7,
        abandoned_journeys: 2,
        preferred_channel: 'Email',
        
        // Risk Assessment
        churn_risk: 24,
        risk_flags: 'Stable but Lower Income Sector',
        missing_coverage: 'Professional Development'
    }
})

export const policyHolder020 = Record({
    $id: Now.ID['policy-holder-020'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Carlos Rodriguez',
        first_name: 'Carlos',
        last_name: 'Rodriguez',
        email: 'carlos.rodriguez@manufacturing.inc',
        phone: '+15550120',
        age: 53,
        customer_id: 'CUST-2024-1020',
        tier: 'bronze',
        
        // Financial Profile - Manufacturing Supervisor
        credit_score: 628,
        lifetime_value: 28400,
        clv_score: 4.5,
        credit_utilization_percent: 69,
        number_of_open_accounts: 3,
        number_of_closed_accounts: 4,
        delinquency_12m: 2,
        credit_inquiries_last_6m: 5,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Traditional User
        tenure_years: 8,
        app_sessions_30_days: 14,
        avg_session_time_min: 6,
        website_visits_30_days: 9,
        quote_views: 19,
        abandoned_journeys: 8,
        preferred_channel: 'Phone',
        
        // Risk Assessment
        churn_risk: 54,
        risk_flags: 'Blue Collar, Credit Utilization High',
        missing_coverage: 'Accident Supplemental'
    }
})

export const policyHolder021 = Record({
    $id: Now.ID['policy-holder-021'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Hannah Park',
        first_name: 'Hannah',
        last_name: 'Park',
        email: 'hannah.park@techstartup.ai',
        phone: '+15550121',
        age: 27,
        customer_id: 'CUST-2024-1021',
        tier: 'bronze',
        
        // Financial Profile - Tech Startup Employee
        credit_score: 658,
        lifetime_value: 19200,
        clv_score: 4.1,
        credit_utilization_percent: 72,
        number_of_open_accounts: 4,
        number_of_closed_accounts: 0,
        delinquency_12m: 1,
        credit_inquiries_last_6m: 7,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Heavy Digital User
        tenure_years: 2,
        app_sessions_30_days: 68,
        avg_session_time_min: 3,
        website_visits_30_days: 52,
        quote_views: 38,
        abandoned_journeys: 26,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment
        churn_risk: 76,
        risk_flags: 'High Utilization, Price Shopping, Short Tenure',
        missing_coverage: 'Tech Equipment Protection'
    }
})

export const policyHolder022 = Record({
    $id: Now.ID['policy-holder-022'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Robert Mitchell',
        first_name: 'Robert',
        last_name: 'Mitchell',
        email: 'robert.mitchell@government.gov',
        phone: '+15550122',
        age: 49,
        customer_id: 'CUST-2024-1022',
        tier: 'gold',
        
        // Financial Profile - Government Employee
        credit_score: 745,
        lifetime_value: 72800,
        clv_score: 7.4,
        credit_utilization_percent: 26,
        number_of_open_accounts: 7,
        number_of_closed_accounts: 3,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 1,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Security Conscious
        tenure_years: 14,
        app_sessions_30_days: 19,
        avg_session_time_min: 9,
        website_visits_30_days: 11,
        quote_views: 4,
        abandoned_journeys: 1,
        preferred_channel: 'Phone',
        
        // Risk Assessment
        churn_risk: 16,
        risk_flags: 'Government Employee - Stable',
        missing_coverage: 'Identity Theft Protection'
    }
})

export const policyHolder023 = Record({
    $id: Now.ID['policy-holder-023'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Jessica Liu',
        first_name: 'Jessica',
        last_name: 'Liu',
        email: 'jessica.liu@consulting.biz',
        phone: '+15550123',
        age: 35,
        customer_id: 'CUST-2024-1023',
        tier: 'platinum',
        
        // Financial Profile - Management Consultant
        credit_score: 801,
        lifetime_value: 142000,
        clv_score: 8.8,
        credit_utilization_percent: 16,
        number_of_open_accounts: 11,
        number_of_closed_accounts: 2,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 2,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Frequent Traveler
        tenure_years: 6,
        app_sessions_30_days: 42,
        avg_session_time_min: 8,
        website_visits_30_days: 28,
        quote_views: 6,
        abandoned_journeys: 1,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment
        churn_risk: 11,
        risk_flags: 'High Value, Travel Heavy',
        missing_coverage: 'Global Medical Coverage'
    }
})

export const policyHolder024 = Record({
    $id: Now.ID['policy-holder-024'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Christopher Adams',
        first_name: 'Christopher',
        last_name: 'Adams',
        email: 'christopher.adams@realestate.pro',
        phone: '+15550124',
        age: 44,
        customer_id: 'CUST-2024-1024',
        tier: 'gold',
        
        // Financial Profile - Real Estate Agent
        credit_score: 712,
        lifetime_value: 61900,
        clv_score: 6.9,
        credit_utilization_percent: 41,
        number_of_open_accounts: 8,
        number_of_closed_accounts: 2,
        delinquency_12m: 1,
        credit_inquiries_last_6m: 3,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Commission Based Income
        tenure_years: 5,
        app_sessions_30_days: 35,
        avg_session_time_min: 6,
        website_visits_30_days: 26,
        quote_views: 14,
        abandoned_journeys: 5,
        preferred_channel: 'Email',
        
        // Risk Assessment
        churn_risk: 32,
        risk_flags: 'Variable Income, Market Dependent',
        missing_coverage: 'Errors and Omissions'
    }
})

export const policyHolder025 = Record({
    $id: Now.ID['policy-holder-025'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Samantha Foster',
        first_name: 'Samantha',
        last_name: 'Foster',
        email: 'samantha.foster@university.edu',
        phone: '+15550125',
        age: 32,
        customer_id: 'CUST-2024-1025',
        tier: 'silver',
        
        // Financial Profile - University Professor
        credit_score: 688,
        lifetime_value: 44300,
        clv_score: 5.9,
        credit_utilization_percent: 44,
        number_of_open_accounts: 5,
        number_of_closed_accounts: 1,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 2,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Academic Schedule
        tenure_years: 6,
        app_sessions_30_days: 26,
        avg_session_time_min: 9,
        website_visits_30_days: 17,
        quote_views: 9,
        abandoned_journeys: 3,
        preferred_channel: 'Email',
        
        // Risk Assessment
        churn_risk: 29,
        risk_flags: 'Academic Schedule, Stable but Lower Income',
        missing_coverage: 'Sabbatical Protection'
    }
})

export const policyHolder026 = Record({
    $id: Now.ID['policy-holder-026'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Daniel Wright',
        first_name: 'Daniel',
        last_name: 'Wright',
        email: 'daniel.wright@logistics.transport',
        phone: '+15550126',
        age: 37,
        customer_id: 'CUST-2024-1026',
        tier: 'bronze',
        
        // Financial Profile - Truck Driver
        credit_score: 612,
        lifetime_value: 25700,
        clv_score: 4.3,
        credit_utilization_percent: 76,
        number_of_open_accounts: 3,
        number_of_closed_accounts: 3,
        delinquency_12m: 3,
        credit_inquiries_last_6m: 6,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Mobile When Available
        tenure_years: 4,
        app_sessions_30_days: 16,
        avg_session_time_min: 4,
        website_visits_30_days: 7,
        quote_views: 24,
        abandoned_journeys: 12,
        preferred_channel: 'Phone',
        
        // Risk Assessment
        churn_risk: 61,
        risk_flags: 'Transportation Industry, Credit Issues',
        missing_coverage: 'Commercial Vehicle Enhancement'
    }
})

export const policyHolder027 = Record({
    $id: Now.ID['policy-holder-027'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Isabella Garcia',
        first_name: 'Isabella',
        last_name: 'Garcia',
        email: 'isabella.garcia@design.studio',
        phone: '+15550127',
        age: 30,
        customer_id: 'CUST-2024-1027',
        tier: 'silver',
        
        // Financial Profile - Freelance Designer
        credit_score: 679,
        lifetime_value: 36800,
        clv_score: 5.6,
        credit_utilization_percent: 55,
        number_of_open_accounts: 4,
        number_of_closed_accounts: 1,
        delinquency_12m: 1,
        credit_inquiries_last_6m: 4,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Creative Professional
        tenure_years: 3,
        app_sessions_30_days: 38,
        avg_session_time_min: 5,
        website_visits_30_days: 31,
        quote_views: 16,
        abandoned_journeys: 7,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment
        churn_risk: 43,
        risk_flags: 'Freelance Income, Creative Industry',
        missing_coverage: 'Equipment Insurance'
    }
})

export const policyHolder028 = Record({
    $id: Now.ID['policy-holder-028'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Gregory Scott',
        first_name: 'Gregory',
        last_name: 'Scott',
        email: 'gregory.scott@pharmacy.health',
        phone: '+15550128',
        age: 51,
        customer_id: 'CUST-2024-1028',
        tier: 'gold',
        
        // Financial Profile - Pharmacist
        credit_score: 752,
        lifetime_value: 81200,
        clv_score: 7.6,
        credit_utilization_percent: 29,
        number_of_open_accounts: 6,
        number_of_closed_accounts: 4,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 1,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Healthcare Professional
        tenure_years: 13,
        app_sessions_30_days: 23,
        avg_session_time_min: 7,
        website_visits_30_days: 15,
        quote_views: 5,
        abandoned_journeys: 1,
        preferred_channel: 'Email',
        
        // Risk Assessment
        churn_risk: 17,
        risk_flags: 'Healthcare Professional, Stable',
        missing_coverage: 'Professional Liability Enhancement'
    }
})

export const policyHolder029 = Record({
    $id: Now.ID['policy-holder-029'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Nicole Taylor',
        first_name: 'Nicole',
        last_name: 'Taylor',
        email: 'nicole.taylor@marketing.agency',
        phone: '+15550129',
        age: 28,
        customer_id: 'CUST-2024-1029',
        tier: 'bronze',
        
        // Financial Profile - Marketing Coordinator
        credit_score: 641,
        lifetime_value: 21500,
        clv_score: 3.9,
        credit_utilization_percent: 68,
        number_of_open_accounts: 3,
        number_of_closed_accounts: 2,
        delinquency_12m: 2,
        credit_inquiries_last_6m: 8,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Social Media Heavy
        tenure_years: 2,
        app_sessions_30_days: 54,
        avg_session_time_min: 3,
        website_visits_30_days: 48,
        quote_views: 29,
        abandoned_journeys: 19,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment
        churn_risk: 69,
        risk_flags: 'Young Professional, High Utilization, Price Sensitive',
        missing_coverage: 'Social Media Liability'
    }
})

export const policyHolder030 = Record({
    $id: Now.ID['policy-holder-030'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Steven Martinez',
        first_name: 'Steven',
        last_name: 'Martinez',
        email: 'steven.martinez@engineering.tech',
        phone: '+15550130',
        age: 43,
        customer_id: 'CUST-2024-1030',
        tier: 'platinum',
        
        // Financial Profile - Senior Engineer
        credit_score: 795,
        lifetime_value: 134000,
        clv_score: 8.5,
        credit_utilization_percent: 19,
        number_of_open_accounts: 10,
        number_of_closed_accounts: 2,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 1,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Tech Savvy Professional
        tenure_years: 8,
        app_sessions_30_days: 41,
        avg_session_time_min: 9,
        website_visits_30_days: 26,
        quote_views: 4,
        abandoned_journeys: 0,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment
        churn_risk: 9,
        risk_flags: 'High Value Tech Professional',
        missing_coverage: 'Patent Protection'
    }
})

export const policyHolder031 = Record({
    $id: Now.ID['policy-holder-031'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Angela Brown',
        first_name: 'Angela',
        last_name: 'Brown',
        email: 'angela.brown@hospitality.hotel',
        phone: '+15550131',
        age: 39,
        customer_id: 'CUST-2024-1031',
        tier: 'silver',
        
        // Financial Profile - Hotel Manager
        credit_score: 698,
        lifetime_value: 49200,
        clv_score: 6.2,
        credit_utilization_percent: 36,
        number_of_open_accounts: 5,
        number_of_closed_accounts: 2,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 3,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Service Industry
        tenure_years: 7,
        app_sessions_30_days: 29,
        avg_session_time_min: 6,
        website_visits_30_days: 20,
        quote_views: 11,
        abandoned_journeys: 4,
        preferred_channel: 'Email',
        
        // Risk Assessment
        churn_risk: 34,
        risk_flags: 'Hospitality Industry, Seasonal Variations',
        missing_coverage: 'Business Travel Protection'
    }
})

export const policyHolder032 = Record({
    $id: Now.ID['policy-holder-032'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Timothy Lewis',
        first_name: 'Timothy',
        last_name: 'Lewis',
        email: 'timothy.lewis@agriculture.farm',
        phone: '+15550132',
        age: 47,
        customer_id: 'CUST-2024-1032',
        tier: 'bronze',
        
        // Financial Profile - Farmer
        credit_score: 598,
        lifetime_value: 31200,
        clv_score: 4.7,
        credit_utilization_percent: 71,
        number_of_open_accounts: 4,
        number_of_closed_accounts: 3,
        delinquency_12m: 2,
        credit_inquiries_last_6m: 4,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Rural Limited Access
        tenure_years: 9,
        app_sessions_30_days: 11,
        avg_session_time_min: 8,
        website_visits_30_days: 6,
        quote_views: 13,
        abandoned_journeys: 5,
        preferred_channel: 'Phone',
        
        // Risk Assessment
        churn_risk: 52,
        risk_flags: 'Agricultural Industry, Weather Dependent',
        missing_coverage: 'Crop Protection Enhancement'
    }
})

export const policyHolder033 = Record({
    $id: Now.ID['policy-holder-033'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Rachel Cooper',
        first_name: 'Rachel',
        last_name: 'Cooper',
        email: 'rachel.cooper@media.broadcast',
        phone: '+15550133',
        age: 33,
        customer_id: 'CUST-2024-1033',
        tier: 'gold',
        
        // Financial Profile - TV Producer
        credit_score: 724,
        lifetime_value: 66800,
        clv_score: 7.1,
        credit_utilization_percent: 33,
        number_of_open_accounts: 7,
        number_of_closed_accounts: 1,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 3,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Media Professional
        tenure_years: 5,
        app_sessions_30_days: 44,
        avg_session_time_min: 5,
        website_visits_30_days: 33,
        quote_views: 8,
        abandoned_journeys: 2,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment
        churn_risk: 26,
        risk_flags: 'Creative Industry, Project Based',
        missing_coverage: 'Media Liability'
    }
})

export const policyHolder034 = Record({
    $id: Now.ID['policy-holder-034'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Jonathan Hill',
        first_name: 'Jonathan',
        last_name: 'Hill',
        email: 'jonathan.hill@security.protect',
        phone: '+15550134',
        age: 41,
        customer_id: 'CUST-2024-1034',
        tier: 'silver',
        
        // Financial Profile - Security Manager
        credit_score: 707,
        lifetime_value: 53400,
        clv_score: 6.4,
        credit_utilization_percent: 39,
        number_of_open_accounts: 6,
        number_of_closed_accounts: 2,
        delinquency_12m: 0,
        credit_inquiries_last_6m: 2,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Security Conscious
        tenure_years: 10,
        app_sessions_30_days: 18,
        avg_session_time_min: 12,
        website_visits_30_days: 12,
        quote_views: 6,
        abandoned_journeys: 1,
        preferred_channel: 'Phone',
        
        // Risk Assessment
        churn_risk: 23,
        risk_flags: 'Security Industry, Privacy Conscious',
        missing_coverage: 'Cyber Security Enhancement'
    }
})

export const policyHolder035 = Record({
    $id: Now.ID['policy-holder-035'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        name: 'Melissa King',
        first_name: 'Melissa',
        last_name: 'King',
        email: 'melissa.king@retail.fashion',
        phone: '+15550135',
        age: 36,
        customer_id: 'CUST-2024-1035',
        tier: 'bronze',
        
        // Financial Profile - Retail Manager
        credit_score: 634,
        lifetime_value: 26900,
        clv_score: 4.4,
        credit_utilization_percent: 74,
        number_of_open_accounts: 4,
        number_of_closed_accounts: 2,
        delinquency_12m: 2,
        credit_inquiries_last_6m: 7,
        bankruptcies_flag: false,
        
        // Engagement Metrics - Retail Hours
        tenure_years: 6,
        app_sessions_30_days: 31,
        avg_session_time_min: 4,
        website_visits_30_days: 24,
        quote_views: 21,
        abandoned_journeys: 11,
        preferred_channel: 'Mobile App',
        
        // Risk Assessment
        churn_risk: 58,
        risk_flags: 'Retail Industry, High Utilization',
        missing_coverage: 'Inventory Protection'
    }
})