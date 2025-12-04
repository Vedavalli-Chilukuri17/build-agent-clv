import '@servicenow/sdk/global'
import { ClientScript } from '@servicenow/sdk/core'

// Client script to suppress info messages for campaign launches
ClientScript({
    $id: Now.ID['suppress_campaign_messages'],
    name: 'Suppress Campaign Launch Messages',
    table: 'x_hete_clv_maximiz_campaigns',
    type: 'onLoad',
    active: true,
    global: true,
    ui_type: 'all',
    description: 'Suppresses automatic info messages when campaign records are created via API calls from the CLV Maximization Solution application',
    script: Now.include('../../client/suppress-messages.js')
})