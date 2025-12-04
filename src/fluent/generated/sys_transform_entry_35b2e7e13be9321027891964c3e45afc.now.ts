import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['35b2e7e13be9321027891964c3e45afc'],
    table: 'sys_transform_entry',
    data: {
        choice_action: 'create',
        coalesce: 'false',
        coalesce_case_sensitive: 'false',
        coalesce_empty_fields: 'false',
        date_format: 'yyyy-MM-dd HH:mm:ss',
        map: 'b9b227e13be9321027891964c3e45af5',
        source_field: 'u_website_visits__30_days_',
        source_script: `answer = (function transformEntry(source) {

	// Add your code here
	return ""; // return the value to be put into the target field

})(source);`,
        source_table: 'x_hete_clv_maximiz_1764600549934',
        target_field: 'website_visits_30_days',
        target_table: 'x_hete_clv_maximiz_policy_holders',
        use_source_script: 'false',
    },
})
