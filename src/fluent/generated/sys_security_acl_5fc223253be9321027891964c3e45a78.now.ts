import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['5fc223253be9321027891964c3e45a78'],
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'read',
    roles: ['x_hete_clv_maximiz.clv_app_user'],
    table: 'x_hete_clv_maximiz_policy_holders',
})
