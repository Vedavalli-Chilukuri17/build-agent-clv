import '@servicenow/sdk/global'
import { Table, StringColumn, ChoiceColumn, DateTimeColumn, GenericColumn } from '@servicenow/sdk/core'

// Product Performance table for benchmarking
export const x_hete_clv_maximiz_product_performance = Table({
    name: 'x_hete_clv_maximiz_product_performance',
    label: 'Product Performance',
    schema: {
        product_name: StringColumn({
            label: 'Product Name',
            maxLength: 100,
            mandatory: true,
        }),

        performance_label: ChoiceColumn({
            label: 'Performance Label',
            choices: {
                strong: { label: 'Strong', sequence: 0 },
                competitive: { label: 'Competitive', sequence: 1 },
                challenged: { label: 'Challenged', sequence: 2 },
            },
            default: 'competitive',
            mandatory: true,
            dropdown: 'dropdown_with_none',
        }),

        premium_vs_competitor_1: GenericColumn({
            label: 'Premium vs Competitor 1',
            default: 0,
            columnType: 'currency',
            maxLength: 20,
        }),

        premium_vs_competitor_2: GenericColumn({
            label: 'Premium vs Competitor 2',
            default: 0,
            columnType: 'currency',
            maxLength: 20,
        }),

        renewal_vs_competitor_1: GenericColumn({
            label: 'Renewal vs Competitor 1',
            default: 0,
            columnType: 'percent_complete',
            maxLength: 20,
        }),

        renewal_vs_competitor_2: GenericColumn({
            label: 'Renewal vs Competitor 2',
            default: 0,
            columnType: 'percent_complete',
            maxLength: 20,
        }),

        our_claims_ratio: GenericColumn({
            label: 'Our Claims Ratio',
            default: 0,
            columnType: 'percent_complete',
            maxLength: 20,
        }),

        our_add_on_rate: GenericColumn({
            label: 'Our Add-On Rate',
            default: 0,
            columnType: 'percent_complete',
            maxLength: 20,
        }),

        data_source: StringColumn({
            label: 'Data Source',
            maxLength: 255,
            default: 'System Generated',
        }),

        last_updated: DateTimeColumn({
            label: 'Last Updated',
        }),
    },

    // Table configuration
    display: 'product_name',
    allowWebServiceAccess: true,
    actions: ['read', 'update', 'create'],
    accessibleFrom: 'public',
    allowClientScripts: true,
    allowNewFields: true,
    allowUiActions: true,
})
