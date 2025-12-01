import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['b9b227e13be9321027891964c3e45af5'],
    table: 'sys_transform_map',
    data: {
        active: 'true',
        copy_empty_fields: 'false',
        create_new_record_on_empty_coalesce_fields: 'false',
        enforce_mandatory_fields: 'No',
        name: 'x_hete_clv_maximiz_policy_holders_transform_map',
        order: '100',
        run_business_rules: 'false',
        run_script: 'false',
        script: `(function transformRow(source, target, map, log, isUpdate) {

	// Add your code here

})(source, target, map, log, action==="update");`,
        source_table: 'x_hete_clv_maximiz_1764600549934',
        target_table: 'x_hete_clv_maximiz_policy_holders',
    },
})
