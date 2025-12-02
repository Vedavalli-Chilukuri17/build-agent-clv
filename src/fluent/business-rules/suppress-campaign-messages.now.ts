import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

// Business rule to suppress info messages when campaign records are created
BusinessRule({
    $id: Now.ID['br_suppress_campaign_messages'],
    name: 'Suppress Campaign Creation Messages',
    table: 'x_hete_clv_maximiz_campaigns', 
    active: true,
    when: 'before',
    action: ['insert'],
    order: 50,
    description: 'Suppresses info messages when campaign records are created via the CLV Maximizer application',
    script: Now.include('../../server/suppress-campaign-messages.js')
})