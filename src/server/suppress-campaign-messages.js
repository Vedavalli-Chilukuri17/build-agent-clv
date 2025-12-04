import { gs } from '@servicenow/glide'

export function suppressCampaignMessages(current, previous) {
    // Check if this insert is being done via API call (typical indicator: created_by system user or API user)
    // Set a session property to indicate we don't want info messages
    try {
        // Set a session variable to suppress messages for this transaction
        gs.getSession().putClientData('suppress_info_messages', 'true');
        
        // Also set a system property temporarily
        gs.setProperty('glide.ui.show_insert_message', 'false');
        
        // Log the suppression for debugging (can be removed in production)
        gs.debug('CLV Maximization Solution: Suppressing info messages for campaign creation');
        
    } catch (error) {
        // If there's an error, log it but don't fail the transaction
        gs.warn('CLV Maximization Solution: Could not suppress info messages - ' + error);
    }
}