import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Update existing policy holder records with new field values
// Based on existing customer profiles and risk assessments

// High-risk customer - Maria Lopez (Bronze/Silver tier, high churn risk)
export const existingUpdate001 = Record({
    $id: Now.ID['existing_update_001'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '8ab22be13be9321027891964c3e45a97', // Maria Lopez
        risk: 'medium',
        clv: 4200, // Lower CLV due to high churn risk and low engagement
        renewal_date: '2025-06-15',
        engagement_score: 42
    }
})

// Mid-tier customer - John Miller (Gold tier, moderate engagement)
export const existingUpdate002 = Record({
    $id: Now.ID['existing_update_002'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'ceb22be13be9321027891964c3e45a74', // John Miller
        risk: 'low',
        clv: 12800, // Good CLV reflecting gold tier status
        renewal_date: '2025-04-22',
        engagement_score: 73
    }
})

// Premium customer - Sara Chen (Platinum tier, high value)
export const existingUpdate003 = Record({
    $id: Now.ID['existing_update_003'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'ceb22be13be9321027891964c3e45a79', // Sara Chen
        risk: 'low',
        clv: 18500, // Higher CLV for platinum customer
        renewal_date: '2025-03-18',
        engagement_score: 82
    }
})

// High-risk customer - Raj Patel (High churn, low engagement)
export const existingUpdate004 = Record({
    $id: Now.ID['existing_update_004'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'ceb22be13be9321027891964c3e45a96', // Raj Patel
        risk: 'high',
        clv: 3200, // Low CLV due to high risk profile
        renewal_date: '2025-02-28',
        engagement_score: 28
    }
})

// Tech startup employee - Alex Rivera
export const existingUpdate005 = Record({
    $id: Now.ID['existing_update_005'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '2fcaa4c822e34463abb3009052a10227', // Alex Rivera
        risk: 'medium',
        clv: 14200, // Good CLV but variable income risk
        renewal_date: '2025-07-08',
        engagement_score: 68
    }
})

// High-risk customer - Amanda Foster (Bronze tier, financial issues)
export const existingUpdate006 = Record({
    $id: Now.ID['existing_update_006'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'efa93b2d4bc84a51bcb0d76b189f919f', // Amanda Foster
        risk: 'high',
        clv: 2800, // Very low CLV due to high risk
        renewal_date: '2025-05-12',
        engagement_score: 35
    }
})

// Hospitality industry - Angela Brown
export const existingUpdate007 = Record({
    $id: Now.ID['existing_update_007'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '1ac9d0a1545d40a58ac81b1fa94de9cd', // Angela Brown
        risk: 'medium',
        clv: 11600, // Moderate CLV, seasonal business risk
        renewal_date: '2025-05-18',
        engagement_score: 62
    }
})

// Millennial customer - Ashley King
export const existingUpdate008 = Record({
    $id: Now.ID['existing_update_008'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '32dbf468795549ad9ad8262b01b1dc48', // Ashley King
        risk: 'medium',
        clv: 9800, // Moderate CLV, price sensitive
        renewal_date: '2025-04-05',
        engagement_score: 64
    }
})

// Freelancer - Ashley Rodriguez (High risk, low income)
export const existingUpdate009 = Record({
    $id: Now.ID['existing_update_009'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '03aaaacc742647569538c7cdf921d3a1', // Ashley Rodriguez
        risk: 'high',
        clv: 1900, // Very low CLV due to financial instability
        renewal_date: '2025-08-15',
        engagement_score: 38
    }
})

// Construction worker - Brian Lewis (Industry risk)
export const existingUpdate010 = Record({
    $id: Now.ID['existing_update_010'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '29923a0110c244c89c4e6053ed4eb022', // Brian Lewis
        risk: 'high',
        clv: 7200, // Moderate CLV but high industry risk
        renewal_date: '2025-03-30',
        engagement_score: 45
    }
})