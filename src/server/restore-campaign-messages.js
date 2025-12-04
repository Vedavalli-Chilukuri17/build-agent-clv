import { gs } from '@servicenow/glide'

export function restoreCampaignMessages(current, previous) {
    try {
        // Remove the session variable that suppresses messages
        gs.getSession().putClientData('suppress_info_messages', 'false');
        
        // Restore the system property to default
        gs.setProperty('glide.ui.show_insert_message', 'true');
        
        // Log the restoration for debugging (can be removed in production)
        gs.debug('CLV Maximization Solution: Restored normal info message behavior after campaign creation');
        
    } catch (error) {
        // If there's an error, log it but don't fail the transaction
        gs.warn('CLV Maximization Solution: Could not restore info messages - ' + error);
    }
}