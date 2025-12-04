// Client-side script to suppress info messages for campaign operations
function onLoad() {
    // Override the global info message function for this specific context
    if (window.parent && window.parent.g_user_date_time_format) {
        // Check if we're in the CLV Maximization Solution context
        var currentUrl = window.location.href;
        if (currentUrl.includes('clv_maximizer.do') || currentUrl.includes('x_hete_clv_maximiz')) {
            // Store original addInfoMessage function
            if (typeof g_form !== 'undefined' && g_form.addInfoMessage) {
                var originalAddInfoMessage = g_form.addInfoMessage;
                
                // Override addInfoMessage to filter out campaign creation messages
                g_form.addInfoMessage = function(message) {
                    // Check if message is about record creation
                    var suppressPatterns = [
                        /successfully created/i,
                        /record created/i,
                        /inserted/i,
                        /saved successfully/i
                    ];
                    
                    var shouldSuppress = suppressPatterns.some(function(pattern) {
                        return pattern.test(message);
                    });
                    
                    // Only suppress messages matching our patterns
                    if (!shouldSuppress) {
                        originalAddInfoMessage.call(this, message);
                    }
                };
            }
            
            // Also suppress global info messages if available
            if (typeof addInfoMessage !== 'undefined') {
                var originalGlobalAddInfo = addInfoMessage;
                window.addInfoMessage = function(message) {
                    var suppressPatterns = [
                        /successfully created/i,
                        /record created/i,
                        /inserted/i,
                        /saved successfully/i
                    ];
                    
                    var shouldSuppress = suppressPatterns.some(function(pattern) {
                        return pattern.test(message);
                    });
                    
                    if (!shouldSuppress) {
                        originalGlobalAddInfo(message);
                    }
                };
            }
        }
    }
}