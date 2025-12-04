import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import page from '../../client/clv-maximizer/index.html';

export const clv_workspace = UiPage({
  $id: Now.ID['clv-maximizer-workspace'],
  endpoint: 'x_hete_clv_maximiz_clv_maximizer.do',
  html: page,
  direct: true
});