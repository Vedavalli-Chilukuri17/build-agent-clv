import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'

export function campaignScheduler(current, previous) {
    try {
        // Get current date and time
        const currentDateTime = new GlideDateTime();
        
        // Find all scheduled campaigns where the launch time has passed
        const scheduledCampaigns = new GlideRecord('x_hete_clv_maximiz_campaigns');
        scheduledCampaigns.addQuery('status', 'scheduled');
        scheduledCampaigns.addNotNullQuery('launch_date');
        scheduledCampaigns.addNotNullQuery('launch_time');
        scheduledCampaigns.query();
        
        let launchedCount = 0;
        
        while (scheduledCampaigns.next()) {
            try {
                // Get the launch date and time
                const launchDate = scheduledCampaigns.getValue('launch_date');
                const launchTime = scheduledCampaigns.getValue('launch_time');
                
                if (launchDate && launchTime) {
                    // Construct the scheduled launch datetime
                    const scheduledLaunchDateTime = new GlideDateTime();
                    scheduledLaunchDateTime.setValue(launchDate + ' ' + launchTime + ':00');
                    
                    // Check if the scheduled time has passed or is now
                    if (currentDateTime.after(scheduledLaunchDateTime) || currentDateTime.equals(scheduledLaunchDateTime)) {
                        // Update the campaign status to launched
                        scheduledCampaigns.setValue('status', 'launched');
                        scheduledCampaigns.setValue('launched_at', currentDateTime.getDisplayValue());
                        scheduledCampaigns.update();
                        
                        launchedCount++;
                        
                        gs.info('Campaign Scheduler: Automatically launched campaign "' + 
                               scheduledCampaigns.getValue('campaign_name') + 
                               '" (ID: ' + scheduledCampaigns.sys_id + ')');
                    }
                }
            } catch (error) {
                gs.warn('Campaign Scheduler: Error processing campaign ' + 
                       scheduledCampaigns.sys_id + ': ' + error.message);
            }
        }
        
        if (launchedCount > 0) {
            gs.info('Campaign Scheduler: Successfully launched ' + launchedCount + ' scheduled campaigns');
        }
        
    } catch (error) {
        gs.error('Campaign Scheduler: Error in campaign scheduling process: ' + error.message);
    }
}