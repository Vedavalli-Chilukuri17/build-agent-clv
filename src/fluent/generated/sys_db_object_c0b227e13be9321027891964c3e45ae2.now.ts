import '@servicenow/sdk/global'
import {
    Table,
    IntegerColumn,
    BooleanColumn,
    GenericColumn,
    DecimalColumn,
    StringColumn,
    ChoiceColumn,
    DateColumn,
} from '@servicenow/sdk/core'

export const x_hete_clv_maximiz_policy_holders = Table({
    actions: ['read', 'update', 'create'],
    allowClientScripts: true,
    allowNewFields: true,
    allowUiActions: true,
    allowWebServiceAccess: true,
    autoNumber: {
        prefix: 'CUST',
    },
    label: 'CLV Policy Holders',
    name: 'x_hete_clv_maximiz_policy_holders',
    schema: {
        abandoned_journeys: IntegerColumn({
            label: 'Abandoned Journeys',
        }),
        age: IntegerColumn({
            label: 'Age',
        }),
        app_sessions_30_days: IntegerColumn({
            label: 'App Sessions (30 Days)',
        }),
        avg_session_time_min: IntegerColumn({
            label: 'Avg Session Time (min)',
        }),
        bankruptcies_flag: BooleanColumn({
            label: 'Bankruptcies flag',
        }),
        churn_risk: GenericColumn({
            columnType: 'percent_complete',
            label: 'Churn Risk (%)',
            maxLength: 38,
        }),
        clv_score: DecimalColumn({
            label: 'CLV Score',
            maxLength: 38,
        }),
        // NEW FIELD: CLV for 12 months (Currency type)
        clv: GenericColumn({
            columnType: 'currency',
            label: 'CLV (12 Months)',
            maxLength: 20,
            default: '0',
        }),
        credit_inquiries_last_6m: IntegerColumn({
            label: 'Credit Inquiries (last 6m)',
        }),
        credit_score: IntegerColumn({
            label: 'Credit score',
        }),
        credit_utilization_percent: GenericColumn({
            columnType: 'percent_complete',
            label: 'Credit utilization Percent',
            maxLength: 38,
        }),
        customer_id: StringColumn({
            default: 'javascript:getNextObjNumberPadded();',
            label: 'Customer ID',
        }),
        delinquency_12m: IntegerColumn({
            label: 'Delinquency 12m',
        }),
        email: GenericColumn({
            columnType: 'email',
            label: 'Email',
        }),
        // NEW FIELD: Engagement Score
        engagement_score: IntegerColumn({
            label: 'Engagement Score',
            default: '50',
        }),
        first_name: StringColumn({
            label: 'First Name',
        }),
        last_name: StringColumn({
            label: 'Last Name',
        }),
        lifetime_value: GenericColumn({
            attributes: {
                omit_sys_original: true,
            },
            columnType: 'currency',
            label: 'Lifetime Value ($)',
            maxLength: 20,
        }),
        missing_coverage: StringColumn({
            label: 'Missing Coverage',
            maxLength: 400,
        }),
        name: StringColumn({
            label: 'Name',
            maxLength: 100,
        }),
        number_of_closed_accounts: IntegerColumn({
            label: 'Number of closed accounts',
        }),
        number_of_open_accounts: IntegerColumn({
            label: 'Number of open accounts',
        }),
        phone: GenericColumn({
            columnType: 'phone_number_e164',
            label: 'Phone',
        }),
        preferred_channel: ChoiceColumn({
            choices: {
                Email: {
                    label: 'Email',
                    sequence: 0,
                },
                'Mobile App': {
                    label: 'Mobile App',
                    sequence: 0,
                },
                Phone: {
                    label: 'Phone',
                    sequence: 0,
                },
            },
            dropdown: 'dropdown_with_none',
            label: 'Preferred Channel',
        }),
        quote_views: IntegerColumn({
            label: 'Quote Views',
        }),
        // NEW FIELD: Renewal Date
        renewal_date: DateColumn({
            label: 'Renewal Date',
        }),
        // NEW FIELD: Risk Level
        risk: ChoiceColumn({
            choices: {
                low: {
                    label: 'Low',
                    sequence: 0,
                },
                medium: {
                    label: 'Medium',
                    sequence: 1,
                },
                high: {
                    label: 'High',
                    sequence: 2,
                },
            },
            dropdown: 'dropdown_with_none',
            label: 'Risk Level',
        }),
        risk_flags: StringColumn({
            label: 'Risk Flags',
            maxLength: 400,
        }),
        tenure_years: IntegerColumn({
            label: 'Tenure (Years)',
        }),
        tier: ChoiceColumn({
            choices: {
                bronze: {
                    label: 'Bronze',
                    sequence: 0,
                },
                silver: {
                    label: 'Silver',
                    sequence: 1,
                },
                gold: {
                    label: 'Gold',
                    sequence: 2,
                },
                platinum: {
                    label: 'Platinum',
                    sequence: 3,
                },
            },
            dropdown: 'dropdown_with_none',
            label: 'Tier',
        }),
        website_visits_30_days: IntegerColumn({
            label: 'Website Visits (30 Days)',
        }),
        u_currency_2: GenericColumn({
            attributes: {
                omit_sys_original: true,
            },
            columnType: 'currency',
            label: 'CLV(12 Months)',
            maxLength: 20,
        }),
        u_risk: StringColumn({
            choices: {
                low: {
                    label: 'Low',
                    sequence: 0,
                },
                medium: {
                    label: 'Medium',
                    sequence: 1,
                },
                high: {
                    label: 'High',
                    sequence: 2,
                },
            },
            dropdown: 'dropdown_with_none',
            label: 'Risk',
        }),
    },
})
