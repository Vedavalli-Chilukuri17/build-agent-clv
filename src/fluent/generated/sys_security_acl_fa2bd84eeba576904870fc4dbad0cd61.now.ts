import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['fa2bd84eeba576904870fc4dbad0cd61'],
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'read',
    roles: ['x_hete_clv_maximiz.clv_app_user'],
    table: 'x_hete_clv_maximiz_renewal_tracker',
})
