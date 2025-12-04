import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['cde29da2eba93e904870fc4dbad0cdcb'],
    table: 'sys_transform_map',
    data: {
        active: 'true',
        copy_empty_fields: 'false',
        create_new_record_on_empty_coalesce_fields: 'false',
        enforce_mandatory_fields: 'No',
        name: 'u_imp_tmpl_x_hete_clv_maximiz_policy_holders',
        order: '100',
        run_business_rules: 'true',
        run_script: 'false',
        script: `(function transformRow(source, target, map, log, isUpdate) {

	// Add your code here

})(source, target, map, log, action==="update");`,
        source_table: 'u_imp_tmpl_x_hete_clv_maximiz_policy_holders',
        target_table: 'x_hete_clv_maximiz_policy_holders',
    },
})
