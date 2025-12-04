import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['9de211e2eba93e904870fc4dbad0cd85'],
    table: 'sys_transform_entry',
    data: {
        choice_action: 'ignore',
        coalesce: 'false',
        coalesce_case_sensitive: 'false',
        coalesce_empty_fields: 'false',
        date_format: 'yyyy-MM-dd HH:mm:ss',
        map: 'cde29da2eba93e904870fc4dbad0cdcb',
        source_field: 'u_risk_level',
        source_script: `answer = (function transformEntry(source) {

	// Add your code here
	return ""; // return the value to be put into the target field

})(source);`,
        source_table: 'u_imp_tmpl_x_hete_clv_maximiz_policy_holders',
        target_field: 'risk',
        target_table: 'x_hete_clv_maximiz_policy_holders',
        use_source_script: 'false',
    },
})
