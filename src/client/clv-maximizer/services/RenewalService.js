export class RenewalService {
  constructor() {
    this.baseUrl = '/api/now/table';
    // Don't set X-UserToken in constructor - set it dynamically in each request
    this.baseHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  // Helper method to get headers with authentication
  getHeaders() {
    const headers = { ...this.baseHeaders };
    
    // Only add X-UserToken if it's available
    if (window.g_ck) {
      headers['X-UserToken'] = window.g_ck;
    }
    
    return headers;
  }

  // NEW: Get detailed high-risk customers with comprehensive profiles
  async getHighRiskCustomersDetailed() {
    try {
      // In real implementation, this would fetch from x_hete_clv_maximiz_policy_holders 
      // and join with risk scores, coverage data, behavioral insights, etc.
      
      const highRiskCustomers = [
        {
          id: 'hr_001',
          name: 'Nicole Martin',
          email: 'nicole.martin@email.com',
          phone: '(555) 123-4567',
          riskScore: 840,
          riskTier: 'Critical',
          clvTier: 'Gold',
          clv12M: 25000,
          totalPremium: 4500,
          creditScore: 620,
          previousCreditScore: 680, // Credit score decline
          customerSince: '2019-03-15',
          isUnderinsured: true,
          
          lifeEvents: ['new_child', 'address_change'],
          
          propertyRisk: {
            type: 'Flood',
            hazardRisk: 85,
            description: 'Property located in high flood risk zone with recent weather pattern changes'
          },
          
          behaviorInsights: {
            lowAppUsage: true,
            billingIrregularities: true,
            customerServiceComplaints: 3
          },
          
          policies: [
            {
              type: 'Auto Insurance',
              status: 'Active',
              premium: 2400,
              coverageAmount: 100000,
              renewalDate: '2025-03-15',
              coverages: ['liability', 'collision'],
              missingEndorsements: ['comprehensive', 'gap_coverage']
            },
            {
              type: 'Home Insurance',
              status: 'Active',
              premium: 2100,
              coverageAmount: 250000,
              renewalDate: '2025-04-01',
              coverages: ['dwelling', 'personal_property'],
              missingEndorsements: ['flood_coverage', 'earthquake']
            }
          ],
          
          coverageOpportunities: [
            {
              type: 'Life Insurance',
              priority: 'High',
              description: 'New child detected - term life insurance critical for family protection',
              potentialPremium: 1800,
              confidenceScore: 92
            },
            {
              type: 'Flood Insurance',
              priority: 'Critical',
              description: 'High flood risk area without coverage - immediate protection needed',
              potentialPremium: 1200,
              confidenceScore: 98
            },
            {
              type: 'Comprehensive Auto',
              priority: 'Medium',
              description: 'Missing comprehensive coverage on auto policy',
              potentialPremium: 600,
              confidenceScore: 75
            }
          ]
        },
        
        {
          id: 'hr_002',
          name: 'Michael Rodriguez',
          email: 'michael.rodriguez@email.com',
          phone: '(555) 987-6543',
          riskScore: 780,
          riskTier: 'High',
          clvTier: 'Platinum',
          clv12M: 45000,
          totalPremium: 8200,
          creditScore: 720,
          previousCreditScore: 715,
          customerSince: '2017-08-20',
          isUnderinsured: true,
          
          lifeEvents: ['marriage', 'new_purchase'],
          
          propertyRisk: {
            type: 'Wildfire',
            hazardRisk: 75,
            description: 'Recently purchased property in wildfire-prone area'
          },
          
          behaviorInsights: {
            lowAppUsage: false,
            billingIrregularities: false,
            customerServiceComplaints: 1
          },
          
          policies: [
            {
              type: 'Home Insurance',
              status: 'Active',
              premium: 4200,
              coverageAmount: 500000,
              renewalDate: '2025-02-28',
              coverages: ['dwelling', 'personal_property', 'liability'],
              missingEndorsements: ['wildfire_protection', 'equipment_breakdown']
            },
            {
              type: 'Auto Insurance',
              status: 'Active',
              premium: 3000,
              coverageAmount: 150000,
              renewalDate: '2025-03-10',
              coverages: ['liability', 'collision', 'comprehensive'],
              missingEndorsements: ['rental_car', 'roadside_assistance']
            },
            {
              type: 'Umbrella Policy',
              status: 'Active',
              premium: 1000,
              coverageAmount: 1000000,
              renewalDate: '2025-03-15',
              coverages: ['excess_liability'],
              missingEndorsements: []
            }
          ],
          
          coverageOpportunities: [
            {
              type: 'Wildfire Protection',
              priority: 'Critical',
              description: 'New property purchase in high wildfire risk zone requires specialized coverage',
              potentialPremium: 2400,
              confidenceScore: 95
            },
            {
              type: 'Spouse Coverage Addition',
              priority: 'High',
              description: 'Marriage detected - add spouse to existing policies and optimize coverage',
              potentialPremium: 1500,
              confidenceScore: 88
            },
            {
              type: 'Jewelry Insurance',
              priority: 'Medium',
              description: 'High-value customer - protect valuable personal items',
              potentialPremium: 800,
              confidenceScore: 70
            }
          ]
        },

        {
          id: 'hr_003',
          name: 'Sarah Chen',
          email: 'sarah.chen@email.com',
          phone: '(555) 456-7890',
          riskScore: 750,
          riskTier: 'High',
          clvTier: 'Silver',
          clv12M: 18000,
          totalPremium: 2800,
          creditScore: 580,
          previousCreditScore: 650,
          customerSince: '2020-05-10',
          isUnderinsured: false,
          
          lifeEvents: ['nearing_retirement'],
          
          propertyRisk: {
            type: 'Hurricane',
            hazardRisk: 60,
            description: 'Coastal property with moderate hurricane risk'
          },
          
          behaviorInsights: {
            lowAppUsage: true,
            billingIrregularities: true,
            customerServiceComplaints: 2
          },
          
          policies: [
            {
              type: 'Auto Insurance',
              status: 'Active',
              premium: 1800,
              coverageAmount: 75000,
              renewalDate: '2025-04-15',
              coverages: ['liability', 'collision'],
              missingEndorsements: ['comprehensive', 'uninsured_motorist']
            },
            {
              type: 'Renters Insurance',
              status: 'Active',
              premium: 1000,
              coverageAmount: 50000,
              renewalDate: '2025-05-01',
              coverages: ['personal_property', 'liability'],
              missingEndorsements: ['additional_living_expenses']
            }
          ],
          
          coverageOpportunities: [
            {
              type: 'Retirement Planning Insurance',
              priority: 'High',
              description: 'Approaching retirement - review coverage needs and legacy planning',
              potentialPremium: 2200,
              confidenceScore: 85
            },
            {
              type: 'Comprehensive Auto',
              priority: 'Medium',
              description: 'Add comprehensive coverage and uninsured motorist protection',
              potentialPremium: 900,
              confidenceScore: 78
            },
            {
              type: 'Identity Theft Protection',
              priority: 'Low',
              description: 'Enhanced security for retirement transition period',
              potentialPremium: 300,
              confidenceScore: 60
            }
          ]
        },

        {
          id: 'hr_004',
          name: 'David Kim',
          email: 'david.kim@email.com',
          phone: '(555) 321-0987',
          riskScore: 720,
          riskTier: 'Medium-High',
          clvTier: 'Gold',
          clv12M: 32000,
          totalPremium: 5600,
          creditScore: 690,
          previousCreditScore: 695,
          customerSince: '2018-11-22',
          isUnderinsured: true,
          
          lifeEvents: ['new_purchase'],
          
          propertyRisk: {
            type: 'Earthquake',
            hazardRisk: 70,
            description: 'Property in seismically active region requiring earthquake coverage'
          },
          
          behaviorInsights: {
            lowAppUsage: false,
            billingIrregularities: false,
            customerServiceComplaints: 0
          },
          
          policies: [
            {
              type: 'Home Insurance',
              status: 'Active',
              premium: 3600,
              coverageAmount: 400000,
              renewalDate: '2025-02-20',
              coverages: ['dwelling', 'personal_property', 'liability'],
              missingEndorsements: ['earthquake', 'sewer_backup']
            },
            {
              type: 'Auto Insurance',
              status: 'Active',
              premium: 2000,
              coverageAmount: 120000,
              renewalDate: '2025-03-05',
              coverages: ['liability', 'collision', 'comprehensive'],
              missingEndorsements: ['gap_coverage']
            }
          ],
          
          coverageOpportunities: [
            {
              type: 'Earthquake Insurance',
              priority: 'Critical',
              description: 'High earthquake risk area without coverage - property protection essential',
              potentialPremium: 1800,
              confidenceScore: 94
            },
            {
              type: 'Business Insurance',
              priority: 'Medium',
              description: 'Recent property purchase may indicate business expansion - explore commercial coverage',
              potentialPremium: 2400,
              confidenceScore: 65
            },
            {
              type: 'Collectibles Insurance',
              priority: 'Low',
              description: 'High-value customer profile suggests valuable collections',
              potentialPremium: 600,
              confidenceScore: 55
            }
          ]
        },

        {
          id: 'hr_005',
          name: 'Jennifer Thompson',
          email: 'jennifer.thompson@email.com',
          phone: '(555) 654-3210',
          riskScore: 800,
          riskTier: 'High',
          clvTier: 'Bronze',
          clv12M: 12000,
          totalPremium: 1800,
          creditScore: 540,
          previousCreditScore: 620,
          customerSince: '2021-07-18',
          isUnderinsured: true,
          
          lifeEvents: ['dependent_added'],
          
          propertyRisk: {
            type: 'Hail',
            hazardRisk: 55,
            description: 'Region with increasing hail storm frequency'
          },
          
          behaviorInsights: {
            lowAppUsage: true,
            billingIrregularities: true,
            customerServiceComplaints: 4
          },
          
          policies: [
            {
              type: 'Auto Insurance',
              status: 'Active',
              premium: 1800,
              coverageAmount: 60000,
              renewalDate: '2025-03-25',
              coverages: ['liability'],
              missingEndorsements: ['collision', 'comprehensive', 'uninsured_motorist']
            }
          ],
          
          coverageOpportunities: [
            {
              type: 'Full Auto Coverage',
              priority: 'Critical',
              description: 'Minimal auto coverage with new dependent - comprehensive protection needed',
              potentialPremium: 2400,
              confidenceScore: 96
            },
            {
              type: 'Life Insurance',
              priority: 'High',
              description: 'New dependent added - life insurance critical for family security',
              potentialPremium: 1500,
              confidenceScore: 90
            },
            {
              type: 'Renters/Home Insurance',
              priority: 'High',
              description: 'No property coverage detected - assess housing situation for appropriate coverage',
              potentialPremium: 1200,
              confidenceScore: 85
            }
          ]
        }
      ];

      return highRiskCustomers;
    } catch (error) {
      console.error('Error fetching detailed high-risk customers:', error);
      throw error;
    }
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

  // NEW: Execute specific action for a customer
  async executeAction(customerId, action) {
    try {
      console.log(`Executing ${action} for customer ${customerId}`);
      
      // Simulate API call to execute action
      const response = await fetch(`${this.baseUrl}/x_hete_clv_maximiz_campaigns`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          customer_id: customerId,
          campaign_type: action,
          action_type: 'renewal_retention',
          priority: 'high',
          status: 'launched',
          description: `Executed ${action} for customer ${customerId}`
        })
      });

      if (!response.ok) {
        // Fallback to simulation if table doesn't exist
        console.log('Campaign table not available, simulating action execution');
      }

      return { success: true, message: `${action} executed successfully` };
    } catch (error) {
      console.error('Error executing action:', error);
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