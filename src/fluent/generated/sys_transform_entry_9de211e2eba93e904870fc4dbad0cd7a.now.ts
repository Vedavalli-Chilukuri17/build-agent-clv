import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['9de211e2eba93e904870fc4dbad0cd7a'],
    table: 'sys_transform_entry',
    data: {
        choice_action: 'create',
        coalesce: 'false',
        coalesce_case_sensitive: 'false',
        coalesce_empty_fields: 'false',
        date_format: 'yyyy-MM-dd',
        map: 'cde29da2eba93e904870fc4dbad0cdcb',
        source_field: 'u_renewal_date',
        source_script: `answer = (function transformEntry(source) {

	// Add your code here
	return ""; // return the value to be put into the target field

})(source);`,
        source_table: 'u_imp_tmpl_x_hete_clv_maximiz_policy_holders',
        target_field: 'renewal_date',
        target_table: 'x_hete_clv_maximiz_policy_holders',
        use_source_script: 'false',
    },
})
