import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_hete_clv_maximiz_product_performance',
    view: default_view,
    columns: [
        'product_name',
        'data_source',
        'our_add_on_rate',
        'our_claims_ratio',
        'performance_label',
        'premium_vs_competitor_1',
        'renewal_vs_competitor_1',
        'premium_vs_competitor_2',
        'renewal_vs_competitor_2',
        'last_updated',
        'sys_updated_on',
        'sys_updated_by',
    ],
})
