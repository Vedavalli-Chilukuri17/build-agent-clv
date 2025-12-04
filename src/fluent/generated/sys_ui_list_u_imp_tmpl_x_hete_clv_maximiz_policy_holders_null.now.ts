import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'u_imp_tmpl_x_hete_clv_maximiz_policy_holders',
    view: default_view,
    columns: [
        'sys_import_row',
        'sys_import_set',
        'sys_import_state',
        'sys_target_table',
        'sys_target_sys_id',
        'sys_row_error',
    ],
})
