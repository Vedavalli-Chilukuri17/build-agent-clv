export class RenewalService {
  constructor() {
    this.baseUrl = '/api/now/table';
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-UserToken': window.g_ck
    };
  }

  async getRenewalSummary() {
    try {
      // Simulate data from Policy_Records, Risk_Scores, Coverage_Gaps tables
      // In real implementation, these would be actual ServiceNow table queries
      const [highRiskCustomers, totalCVRAtRisk, missingCoverages] = await Promise.all([
        this.getHighRiskCustomers(),
        this.getTotalCVRAtRisk(),
        this.getMissingCoverages()
      ]);

      return {
        highRiskCustomers,
        totalCVRAtRisk,
        missingCoverages
      };
    } catch (error) {
      console.error('Error fetching renewal summary:', error);
      throw error;
    }
  }

  async getHighRiskCustomers() {
    // Simulate high-risk customer data
    return {
      count: 247,
      sampleCustomers: [
        {
          name: 'Nicole Martin',
          premium: 1470,
          riskScore: 840,
          creditScore: null,
          policies: [
            { type: 'Umbrella', status: 'Opportunity' },
            { type: 'Auto', status: 'Coverage' }
          ],
          nextActions: [
            'Umbrella is a coverage opportunity. Recommend coverage.',
            'Auto is a coverage opportunity. Recommend coverage.'
          ]
        }
      ]
    };
  }

  async getTotalCVRAtRisk() {
    return {
      count: 89,
      sampleCustomers: [
        {
          name: 'Michael Johnson',
          premium: 3600,
          riskScore: 820,
          creditScore: 720,
          policies: [
            { type: 'Umbrella', status: 'Coverage' },
            { type: 'Auto', status: 'Coverage' }
          ],
          nextActions: [
            'Umbrella is a coverage opportunity. Recommend coverage.',
            'Auto is a coverage opportunity. Recommend coverage.'
          ]
        }
      ]
    };
  }

  async getMissingCoverages() {
    return {
      count: 156,
      sampleCustomers: [
        {
          name: 'John Smith',
          premium: 4247,
          riskScore: 660,
          creditScore: 680,
          policies: [
            { type: 'Auto', status: 'Coverage' }
          ],
          nextActions: [
            'Auto is a coverage opportunity. Recommend coverage.',
            'Term Life is a coverage opportunity. Recommend coverage.'
          ]
        }
      ]
    };
  }

  async getRenewalPipeline(filters = {}) {
    try {
      // Simulate data from Renewal_Tracker, CLV_Scores, Customer_Profiles
      const renewals = [
        {
          customerName: 'Sarah Johnson',
          renewalDate: '2025-02-15',
          renewalStatus: 'High',
          opportunityScore: 850,
          renewalAmount: 4500,
          clvScore: 2800,
          customerId: 'cust_001'
        },
        {
          customerName: 'Robert Chen',
          renewalDate: '2025-02-18',
          renewalStatus: 'Medium',
          opportunityScore: 720,
          renewalAmount: 2800,
          clvScore: 2100,
          customerId: 'cust_002'
        },
        {
          customerName: 'Maria Rodriguez',
          renewalDate: '2025-02-20',
          renewalStatus: 'Low',
          opportunityScore: 580,
          renewalAmount: 1200,
          clvScore: 1500,
          customerId: 'cust_003'
        },
        {
          customerName: 'David Kim',
          renewalDate: '2025-02-22',
          renewalStatus: 'High',
          opportunityScore: 920,
          renewalAmount: 6200,
          clvScore: 3500,
          customerId: 'cust_004'
        },
        {
          customerName: 'Emily Davis',
          renewalDate: '2025-02-25',
          renewalStatus: 'Medium',
          opportunityScore: 680,
          renewalAmount: 3200,
          clvScore: 2300,
          customerId: 'cust_005'
        }
      ];

      // Apply filters if provided
      let filteredRenewals = renewals;
      if (filters.status) {
        filteredRenewals = filteredRenewals.filter(r => r.renewalStatus === filters.status);
      }
      if (filters.search) {
        filteredRenewals = filteredRenewals.filter(r => 
          r.customerName.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      return filteredRenewals;
    } catch (error) {
      console.error('Error fetching renewal pipeline:', error);
      throw error;
    }
  }

  async getNextBestActions(customerId = null) {
    try {
      // Generate personalized recommendations
      const actions = {
        campaignScript: {
          message: 'Michael, we value your loyalty and want to offer you a 10% discount on your upcoming renewal. Your continued trust in our services means everything to us.',
          dynamicFields: {
            customerName: 'Michael Johnson',
            productName: 'Comprehensive Auto Coverage',
            renewalDate: '2025-02-15',
            discountOffer: '10%'
          }
        },
        churnMitigation: [
          'Re-engage with value-based messaging highlighting policy benefits',
          'Showcase claims history and excellent service record',
          'Offer loyalty perks and exclusive member benefits'
        ],
        crossSellUpSell: [
          'Term Life Insurance - Complete family protection',
          'Jewelry & Collectibles Coverage - Protect valuable items',
          'Pet Insurance - Comprehensive pet healthcare',
          'Umbrella Liability - Additional protection layer'
        ],
        outreachChannels: {
          email: { priority: 'High', effectiveness: 85 },
          contactCenter: { priority: 'High', effectiveness: 78 },
          sms: { priority: 'Medium', effectiveness: 62 }
        },
        recommendedChannel: 'Email Campaign'
      };

      return actions;
    } catch (error) {
      console.error('Error fetching next best actions:', error);
      throw error;
    }
  }

  async executeScript(scriptData) {
    try {
      // Simulate script execution
      console.log('Executing script:', scriptData);
      return { success: true, message: 'Script executed successfully' };
    } catch (error) {
      console.error('Error executing script:', error);
      throw error;
    }
  }

  async scheduleFollowUp(followUpData) {
    try {
      // Simulate follow-up scheduling
      console.log('Scheduling follow-up:', followUpData);
      return { success: true, message: 'Follow-up scheduled successfully' };
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
      throw error;
    }
  }

  async sendReminder(customerId, reminderType = 'email') {
    try {
      // Simulate reminder sending
      console.log(`Sending ${reminderType} reminder to customer ${customerId}`);
      return { success: true, message: `${reminderType} reminder sent successfully` };
    } catch (error) {
      console.error('Error sending reminder:', error);
      throw error;
    }
  }

  async launchCampaign(customerId, campaignType) {
    try {
      // Simulate campaign launch
      console.log(`Launching ${campaignType} campaign for customer ${customerId}`);
      return { success: true, message: `${campaignType} campaign launched successfully` };
    } catch (error) {
      console.error('Error launching campaign:', error);
      throw error;
    }
  }

  async exportData(data, format = 'csv') {
    try {
      // Simulate data export
      const exportData = JSON.stringify(data, null, 2);
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `renewal_data_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return { success: true, message: 'Data exported successfully' };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }
}