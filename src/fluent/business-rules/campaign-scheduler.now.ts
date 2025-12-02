import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

// Business rule to automatically launch scheduled campaigns when their time arrives
BusinessRule({
    $id: Now.ID['br_campaign_scheduler'],
    name: 'Campaign Scheduler',
    table: 'x_hete_clv_maximiz_campaigns',
    active: true,
    when: 'before',
    action: ['query'],
    order: 100,
    description: 'Automatically updates scheduled campaigns to launched status when their launch time arrives',
    script: Now.include('../../server/campaign-scheduler.js')
})