import { Table, IntegerColumn, DecimalColumn, StringColumn } from '@servicenow/sdk/core'

export const x_hete_clv_maximiz_policy_holders = Table({
    actions: ['read', 'update', 'create'],
    allowClientScripts: true,
    allowNewFields: true,
    allowUiActions: true,
    allowWebServiceAccess: true,
    extends: 'sys_import_set_row',
    label: 'Imp Tmpl X Hete Clv Maximiz Policy Holders',
    name: 'x_hete_clv_maximiz_policy_holders',
    schema: {
        u_abandoned_journeys: IntegerColumn({
            attributes: {
                import_attribute_name: 'Abandoned Journeys',
            },
            label: 'Abandoned Journeys',
        }),
        u_age: IntegerColumn({
            attributes: {
                import_attribute_name: 'Age',
            },
            label: 'Age',
        }),
        u_app_sessions__30_days_: IntegerColumn({
            attributes: {
                import_attribute_name: 'App Sessions (30 Days)',
            },
            label: 'App Sessions (30 Days)',
        }),
        u_avg_session_time__min_: DecimalColumn({
            attributes: {
                import_attribute_name: 'Avg Session Time (min)',
            },
            label: 'Avg Session Time (min)',
            maxLength: 38,
        }),
        u_bankruptcies_flag: StringColumn({
            attributes: {
                import_attribute_name: 'Bankruptcies flag',
            },
            label: 'Bankruptcies flag',
        }),
        u_churn_risk____: DecimalColumn({
            attributes: {
                import_attribute_name: 'Churn Risk (%)',
            },
            label: 'Churn Risk (%)',
            maxLength: 38,
        }),
        u_clv_score: IntegerColumn({
            attributes: {
                import_attribute_name: 'CLV Score',
            },
            label: 'CLV Score',
            maxLength: 38,
        }),
        u_clv__12_months_: DecimalColumn({
            attributes: {
                import_attribute_name: 'CLV (12 Months)',
            },
            label: 'CLV (12 Months)',
        }),
        u_credit_inquiries__last_6m_: IntegerColumn({
            attributes: {
                import_attribute_name: 'Credit Inquiries (last 6m)',
            },
            label: 'Credit Inquiries (last 6m)',
        }),
        u_credit_score: IntegerColumn({
            attributes: {
                import_attribute_name: 'Credit score',
            },
            label: 'Credit score',
        }),
        u_credit_utilization_percent: DecimalColumn({
            attributes: {
                import_attribute_name: 'Credit utilization Percent',
            },
            label: 'Credit utilization Percent',
            maxLength: 38,
        }),
        u_delinquency_12m: IntegerColumn({
            attributes: {
                import_attribute_name: 'Delinquency 12m',
            },
            label: 'Delinquency 12m',
        }),
        u_email: StringColumn({
            attributes: {
                import_attribute_name: 'Email',
            },
            label: 'Email',
        }),
        u_engagement_score: IntegerColumn({
            attributes: {
                import_attribute_name: 'Engagement Score',
            },
            label: 'Engagement Score',
        }),
        u_first_name: StringColumn({
            attributes: {
                import_attribute_name: 'First Name',
            },
            label: 'First Name',
        }),
        u_last_name: StringColumn({
            attributes: {
                import_attribute_name: 'Last Name',
            },
            label: 'Last Name',
        }),
        u_lifetime_value____: DecimalColumn({
            attributes: {
                import_attribute_name: 'Lifetime Value ($)',
            },
            label: 'Lifetime Value ($)',
        }),
        u_missing_coverage: StringColumn({
            attributes: {
                import_attribute_name: 'Missing Coverage',
            },
            label: 'Missing Coverage',
            maxLength: 400,
        }),
        u_number_of_closed_accounts: IntegerColumn({
            attributes: {
                import_attribute_name: 'Number of closed accounts',
            },
            label: 'Number of closed accounts',
        }),
        u_number_of_open_accounts: IntegerColumn({
            attributes: {
                import_attribute_name: 'Number of open accounts',
            },
            label: 'Number of open accounts',
        }),
        u_phone: StringColumn({
            attributes: {
                import_attribute_name: 'Phone',
            },
            label: 'Phone',
        }),
        u_preferred_channel: StringColumn({
            attributes: {
                import_attribute_name: 'Preferred Channel',
            },
            label: 'Preferred Channel',
        }),
        u_quote_views: IntegerColumn({
            attributes: {
                import_attribute_name: 'Quote Views',
            },
            label: 'Quote Views',
        }),
        u_renewal_date: StringColumn({
            attributes: {
                import_attribute_name: 'Renewal Date',
            },
            label: 'Renewal Date',
        }),
        u_risk_flags: StringColumn({
            attributes: {
                import_attribute_name: 'Risk Flags',
            },
            label: 'Risk Flags',
            maxLength: 400,
        }),
        u_risk_level: StringColumn({
            attributes: {
                import_attribute_name: 'Risk Level',
            },
            label: 'Risk Level',
        }),
        u_tenure__years_: DecimalColumn({
            attributes: {
                import_attribute_name: 'Tenure (Years)',
            },
            label: 'Tenure (Years)',
            maxLength: 38,
        }),
        u_tier: StringColumn({
            attributes: {
                import_attribute_name: 'Tier',
            },
            label: 'Tier',
        }),
        u_website_visits__30_days_: IntegerColumn({
            attributes: {
                import_attribute_name: 'Website Visits (30 Days)',
            },
            label: 'Website Visits (30 Days)',
        }),
    },
})
