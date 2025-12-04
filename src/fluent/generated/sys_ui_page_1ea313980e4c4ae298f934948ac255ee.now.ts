import { UiPage } from '@servicenow/sdk/core'

UiPage({
    $id: Now.ID['1ea313980e4c4ae298f934948ac255ee'],
    endpoint: 'x_hete_clv_maximiz_clv_maximizer.do',
    direct: true,
    html: `<!-- @fluent-import-html WARNING: This file was imported from the output of a static build. Modifications of any kind are likely to result in unintended behavior. In most cases, you should edit the source file of the HTML imported below. If you are absolutely certain you want to take control of this HTML, you can remove this comment to prevent the SDK from regenerating it. However, you will then be responsible for the management of this HTML in your Fluent file. -->
<html lang="en">
  <head>
    <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CLV Maximization Solution – Customer Success Platform</title>
        <!-- @sdk:now-ux-globals -->
        <!-- Resolved from sdk:now-ux-globals tag at NowSDK build time to support earlier Glide releases -->
        <script>window.NOW = {};
window.NOW.user = {};
window.NOW.batch_glide_ajax_requests = false;
window.NOW.isUsingPolaris = true;
window.NOW.exclude_dark_theme = "false";
window.g_ck = "$[gs.getSession().getSessionToken() || gs.getSessionToken()]";</script>
        <!-- Include ServiceNow's required scripts -->
        <g:requires name="scripts/doctype/functions_bootstrap14.js"></g:requires>
        <g:requires name="scripts/lib/prototype.js"></g:requires>
        <g:requires name="scripts/classes/ajax/GlideURL.js"></g:requires>
        <g:requires name="scripts/doctype/CustomEventManager.js"></g:requires>
        <g:requires name="scripts/classes/ajax/GlideAjax.js"></g:requires>
        <g:requires name="scripts/classes/GlideUser.js"></g:requires>
        <g2:client_script type="user"></g2:client_script>
        <link rel="preload" href="/uxasset/set-cache-buster/$[UxFrameworkScriptables.getFlushTimestamp()].js" as="script"></link>
        <g:requires name="scripts/polaris_theme_refresh_observer.js"></g:requires>
        <link data-source-id="glide-theme" id="polarisberg_theme_variables" rel="stylesheet" href="/$uxappimmutables.do?sysparm_request_type=ux_theme$[AMP]sysparm_app_sys_id=c86a62e2c7022010099a308dc7c26022$[AMP]uxpcb=$[sn_ui.PolarisUI.getThemeVariableCssCacheKey()]"></link>
        <script type="module" src="/uxasset/externals/@devsnc/library-uxf/index.jsdbx"></script>
        <!-- @sdk:now-ux-globals -->
        <script src="/uxasset/externals/x_hete_clv_maximiz/clv-maximizer/main.jsdbx?uxpcb=$[UxFrameworkScriptables.getFlushTimestamp()]" type="module"></script>
        <script>// Message suppression script for CLV Maximization Solution
        (function() {
            // Wait for the page to load
            document.addEventListener('DOMContentLoaded', function() {
                // Function to suppress ServiceNow info messages
                function suppressInfoMessages() {
                    // Check if we're in ServiceNow environment
                    if (window.parent $[AMP]$[AMP] (window.parent.g_form || window.parent.addInfoMessage)) {
                        var parentWindow = window.parent;
                        
                        // Override parent window's addInfoMessage if it exists
                        if (parentWindow.addInfoMessage $[AMP]$[AMP] typeof parentWindow.addInfoMessage === 'function') {
                            var originalAddInfoMessage = parentWindow.addInfoMessage;
                            parentWindow.addInfoMessage = function(message) {
                                // Patterns to suppress
                                var suppressPatterns = [
                                    /successfully created record/i,
                                    /record created successfully/i,
                                    /successfully created/i,
                                    /record inserted/i,
                                    /saved successfully/i,
                                    /insert successful/i,
                                    /creation successful/i
                                ];
                                
                                var shouldSuppress = suppressPatterns.some(function(pattern) {
                                    return pattern.test(String(message));
                                });
                                
                                // Only show message if it doesn't match suppression patterns
                                if (!shouldSuppress) {
                                    return originalAddInfoMessage.apply(this, arguments);
                                }
                                // Silently ignore suppressed messages
                                return false;
                            };
                        }
                        
                        // Also check for g_form in parent
                        if (parentWindow.g_form $[AMP]$[AMP] parentWindow.g_form.addInfoMessage) {
                            var originalGFormAddInfo = parentWindow.g_form.addInfoMessage;
                            parentWindow.g_form.addInfoMessage = function(message) {
                                var suppressPatterns = [
                                    /successfully created record/i,
                                    /record created successfully/i,
                                    /successfully created/i,
                                    /record inserted/i,
                                    /saved successfully/i,
                                    /insert successful/i,
                                    /creation successful/i
                                ];
                                
                                var shouldSuppress = suppressPatterns.some(function(pattern) {
                                    return pattern.test(String(message));
                                });
                                
                                if (!shouldSuppress) {
                                    return originalGFormAddInfo.apply(this, arguments);
                                }
                                return false;
                            };
                        }
                    }
                    
                    // Also suppress in current window if needed
                    if (window.addInfoMessage $[AMP]$[AMP] typeof window.addInfoMessage === 'function') {
                        var originalCurrentAddInfo = window.addInfoMessage;
                        window.addInfoMessage = function(message) {
                            var suppressPatterns = [
                                /successfully created record/i,
                                /record created successfully/i,
                                /successfully created/i,
                                /record inserted/i,
                                /saved successfully/i,
                                /insert successful/i,
                                /creation successful/i
                            ];
                            
                            var shouldSuppress = suppressPatterns.some(function(pattern) {
                                return pattern.test(String(message));
                            });
                            
                            if (!shouldSuppress) {
                                return originalCurrentAddInfo.apply(this, arguments);
                            }
                            return false;
                        };
                    }
                    
                    // Hide any existing info messages on the page
                    setTimeout(function() {
                        hideExistingInfoMessages();
                    }, 500);
                }
                
                // Function to hide existing info messages
                function hideExistingInfoMessages() {
                    var selectors = [
                        '.outputmsg',
                        '.outputmsg_info',
                        '.notification-info',
                        '.sn-notification',
                        '[data-type="info"]',
                        '.alert-info'
                    ];
                    
                    selectors.forEach(function(selector) {
                        var elements = document.querySelectorAll(selector);
                        elements.forEach(function(el) {
                            var text = el.textContent || el.innerText;
                            if (text $[AMP]$[AMP] (
                                /successfully created/i.test(text) ||
                                /record created/i.test(text) ||
                                /insert successful/i.test(text) ||
                                /saved successfully/i.test(text)
                            )) {
                                el.style.display = 'none';
                            }
                        });
                    });
                    
                    // Also check parent window for messages
                    if (window.parent $[AMP]$[AMP] window.parent.document) {
                        try {
                            selectors.forEach(function(selector) {
                                var parentElements = window.parent.document.querySelectorAll(selector);
                                parentElements.forEach(function(el) {
                                    var text = el.textContent || el.innerText;
                                    if (text $[AMP]$[AMP] (
                                        /successfully created/i.test(text) ||
                                        /record created/i.test(text) ||
                                        /insert successful/i.test(text) ||
                                        /saved successfully/i.test(text)
                                    )) {
                                        el.style.display = 'none';
                                    }
                                });
                            });
                        } catch (e) {
                            // Cross-origin restrictions might prevent access
                            console.log('Cannot access parent window messages due to cross-origin policy');
                        }
                    }
                }
                
                // Initialize suppression
                suppressInfoMessages();
                
                // Re-apply suppression periodically to catch any new messages
                setInterval(hideExistingInfoMessages, 1000);
            });
        })();</script>
        <style>/* Reset and base styles */
        * {
            box-sizing: border-box;
        }
        
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            background-color: #f8fafc;
            color: #1f2937;
        }
        
        #root {
            min-height: 100vh;
        }
        
        /* ServiceNow UI compatibility */
        .sn-widget-textblock {
            display: none !important;
        }
        
        /* Hide ServiceNow info messages */
        .outputmsg,
        .outputmsg_info,
        .notification-info,
        .sn-notification[data-type="info"],
        .alert-info {
            display: none !important;
        }
        
        /* Loading state */
        .loading-root {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            flex-direction: column;
            gap: 16px;
        }
        
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e5e7eb;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }</style>
      </meta>
    </meta>
  </head>
  <body>
    <div id="root">
      <div class="loading-root">
        <div class="loading-spinner"></div>
        <p>Loading CLV Maximization Solution...</p>
      </div>
    </div>
  </body>
</html>`,
})
