import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import clvWorkspacePage from '../../client/clv-maximizer/index.html'

UiPage({
    $id: Now.ID['clv-maximizer-workspace'],
    endpoint: 'x_hete_clv_maximiz_clv_maximizer.do',
    description: 'CLV Maximization Solution – Customer Success Platform',
    category: 'general',
    html: clvWorkspacePage,
    direct: true,
})