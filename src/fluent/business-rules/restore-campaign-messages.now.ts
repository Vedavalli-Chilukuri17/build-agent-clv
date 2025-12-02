import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

// Business rule to restore normal message behavior after campaign creation
BusinessRule({
    $id: Now.ID['br_restore_campaign_messages'],
    name: 'Restore Campaign Creation Messages',
    table: 'x_hete_clv_maximiz_campaigns',
    active: true, 
    when: 'after',
    action: ['insert'],
    order: 900,
    description: 'Restores normal info message behavior after campaign record creation is complete',
    script: Now.include('../../server/restore-campaign-messages.js')
})