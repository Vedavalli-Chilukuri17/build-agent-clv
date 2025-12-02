import { CustomerIntelligenceService } from './CustomerIntelligenceService.js';

export class RenewalService {
  constructor() {
    this.baseUrl = '/api/now/table';
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-UserToken': window.g_ck
    };
    
    // Use the same service for consistent data
    this.customerIntelligenceService = new CustomerIntelligenceService();
  }

  async getRenewalSummary() {
    try {
      // Get customer data from the same source as Customer Intelligence tab
      const policyHoldersData = await this.customerIntelligenceService.getCSMConsumerData();
      const analyticsData = this.customerIntelligenceService.generateCustomerAnalytics(policyHoldersData);
      
      // Calculate renewal-specific metrics using the same data
      const highRiskCustomers = await this.getHighRiskCustomers(analyticsData);
      const totalCLVAtRisk = await this.getTotalCLVAtRisk(analyticsData);
      const missingCoverages = await this.getMissingCoverages(analyticsData);

      return {
        highRiskCustomers,
        totalCLVAtRisk,
        missingCoverages
      };
    } catch (error) {
      console.error('Error fetching renewal summary:', error);
      throw error;
    }
  }

  async getHighRiskCustomers(analyticsData) {
    // Get high risk customers from the same data as Customer Intelligence tab
    const highRiskCustomers = analyticsData.customers.filter(customer => customer.churnRisk === 'High');
    
    console.log(`📊 Renewal Tab - High Risk Customers: ${highRiskCustomers.length} (matching Customer Intelligence tab)`);
    
    // Generate detailed customer profiles with business logic for ALL high-risk customers
    const detailedCustomerProfiles = await this.generateDetailedCustomerProfiles(highRiskCustomers);

    return {
      count: highRiskCustomers.length,
      sampleCustomers: detailedCustomerProfiles
    };
  }

  async generateDetailedCustomerProfiles(highRiskCustomers) {
    // Show ALL high-risk customers, not just 6
    return highRiskCustomers.map(customer => {
      // Generate current policies based on missing coverage (what they DON'T have missing is what they have)
      const currentPolicies = this.generateCurrentPolicies(customer);
      
      // Generate coverage opportunities from missing coverage
      const coverageOpportunities = this.generateCoverageOpportunities(customer);
      
      // Generate next best actions using the business logic
      const nextBestActions = this.generateNextBestActions(customer, currentPolicies, coverageOpportunities);
      
      // Generate life events and risk factors
      const lifeEvents = this.generateLifeEvents(customer);
      const riskFactors = this.generateRiskFactors(customer);
      
      return {
        name: customer.customerName,
        customerId: customer.id,
        tier: customer.tier,
        churnRisk: customer.churnRisk,
        churnRiskPercent: customer.churnRiskPercent,
        clv: customer.clv,
        premium: Math.floor(customer.clv * 0.12),
        riskScore: customer.churnRiskPercent * 10,
        creditScore: customer.creditScore || this.generateCreditScore(customer),
        engagementScore: customer.engagementScore,
        tenure: customer.tenure,
        location: customer.location,
        currentPolicies,
        coverageOpportunities,
        nextBestActions,
        lifeEvents,
        riskFactors,
        behavioralInsights: this.generateBehavioralInsights(customer),
        propertyIntelligence: this.generatePropertyIntelligence(customer)
      };
    });
  }

  generateCurrentPolicies(customer) {
    // Base policies that most customers might have
    const allPossiblePolicies = [
      { type: 'Auto Insurance', code: 'AUTO', premium: 1200, status: 'Active' },
      { type: 'Home Insurance', code: 'HOME', premium: 800, status: 'Active' },
      { type: 'Life Insurance', code: 'LIFE', premium: 600, status: 'Active' },
      { type: 'Umbrella Liability', code: 'UMBRELLA', premium: 300, status: 'Active' },
      { type: 'Health Insurance', code: 'HEALTH', premium: 2400, status: 'Active' },
      { type: 'Travel Insurance', code: 'TRAVEL', premium: 150, status: 'Active' },
      { type: 'Pet Insurance', code: 'PET', premium: 400, status: 'Active' }
    ];

    const missingCoverageList = customer.missingCoverage ? 
      customer.missingCoverage.toLowerCase().split(',').map(c => c.trim()) : [];
    
    // Filter out policies that are listed as missing
    const currentPolicies = allPossiblePolicies.filter(policy => 
      !missingCoverageList.some(missing => 
        policy.type.toLowerCase().includes(missing) || 
        missing.includes(policy.code.toLowerCase())
      )
    );

    // Ensure at least one policy (most customers have auto)
    if (currentPolicies.length === 0) {
      currentPolicies.push(allPossiblePolicies[0]); // Add Auto Insurance
    }

    // Limit to realistic number of policies (1-4)
    const numPolicies = Math.min(currentPolicies.length, Math.floor(Math.random() * 3) + 1);
    return currentPolicies.slice(0, numPolicies);
  }

  generateCoverageOpportunities(customer) {
    const missingCoverageList = customer.missingCoverage ? 
      customer.missingCoverage.split(',').map(c => c.trim()).filter(c => c !== 'None') : [];

    return missingCoverageList.map(coverage => {
      const opportunityData = this.getCoverageOpportunityData(coverage, customer);
      return {
        type: coverage,
        priority: this.getCoveragePriority(coverage, customer),
        estimatedPremium: opportunityData.premium,
        riskReduction: opportunityData.riskReduction,
        crossSellPotential: opportunityData.crossSellPotential
      };
    });
  }

  getCoverageOpportunityData(coverage, customer) {
    const coverageMapping = {
      'flood': { premium: 450, riskReduction: 'High', crossSellPotential: 85 },
      'umbrella': { premium: 300, riskReduction: 'Medium', crossSellPotential: 75 },
      'identity': { premium: 120, riskReduction: 'Medium', crossSellPotential: 60 },
      'travel': { premium: 150, riskReduction: 'Low', crossSellPotential: 45 },
      'jewelry': { premium: 200, riskReduction: 'Medium', crossSellPotential: 70 },
      'life': { premium: 600, riskReduction: 'High', crossSellPotential: 90 },
      'home': { premium: 800, riskReduction: 'High', crossSellPotential: 95 },
      'auto': { premium: 1200, riskReduction: 'High', crossSellPotential: 98 }
    };

    const coverageKey = coverage.toLowerCase();
    const matchedCoverage = Object.keys(coverageMapping).find(key => 
      coverageKey.includes(key) || key.includes(coverageKey)
    );

    return matchedCoverage ? coverageMapping[matchedCoverage] : 
      { premium: 250, riskReduction: 'Medium', crossSellPotential: 65 };
  }

  getCoveragePriority(coverage, customer) {
    // High CLV customers get higher priority for upselling
    if (customer.tier === 'Platinum' || customer.tier === 'Gold') {
      return 'High';
    }
    
    // High risk customers need immediate attention
    if (customer.churnRisk === 'High') {
      return 'High';
    }

    return Math.random() > 0.5 ? 'Medium' : 'High';
  }

  generateNextBestActions(customer, currentPolicies, coverageOpportunities) {
    const actions = [];

    // Cross-sell logic: Trigger when customer has only one product + life events
    if (currentPolicies.length === 1) {
      const lifeEvents = this.detectLifeEvents(customer);
      if (lifeEvents.length > 0) {
        actions.push({
          type: 'Cross-sell',
          priority: 'High',
          confidence: 88,
          action: 'Bundle Campaign',
          description: `${customer.customerName} has only ${currentPolicies[0].type} and recent life event detected (${lifeEvents[0]}). Recommend comprehensive bundle: Auto + Home + Life package with 15% multi-policy discount.`,
          expectedRevenue: '$2,100 annually',
          timeline: 'Within 7 days',
          channel: 'Personal consultation call',
          tags: ['cross_sell', 'bundle', 'life_event', 'multi_policy']
        });
      }
    }

    // Upsell logic: High CLV tier + underinsured + high property risk
    if ((customer.tier === 'Platinum' || customer.tier === 'Gold')) {
      const isUnderinsured = this.checkUnderinsuredStatus(customer, currentPolicies);
      const hasPropertyRisk = this.checkPropertyRisk(customer);
      
      if (isUnderinsured && hasPropertyRisk) {
        actions.push({
          type: 'Upsell',
          priority: 'High',
          confidence: 92,
          action: 'Comprehensive Coverage Upgrade',
          description: `${customer.tier} customer ${customer.customerName} is underinsured with high property risk exposure. Recommend comprehensive coverage upgrade including increased liability limits, enhanced property protection, and premium add-ons.`,
          expectedRevenue: '$1,800 additional annually',
          timeline: 'Immediate - within 48 hours',
          channel: 'Dedicated account manager',
          tags: ['upsell', 'comprehensive', 'property_risk', 'premium']
        });
      }
    }

    // Coverage checks: Missing endorsements + behavioral insights
    const behavioralRisks = this.checkBehavioralInsights(customer);
    if (behavioralRisks.length > 0) {
      actions.push({
        type: 'Coverage Check',
        priority: 'Medium',
        confidence: 76,
        action: 'Policy Review & Gap Analysis',
        description: `Behavioral insights indicate ${behavioralRisks.join(', ')} for ${customer.customerName}. Recommend immediate policy review to address coverage gaps and add protective endorsements.`,
        expectedRevenue: '$600 additional coverage',
        timeline: 'Within 14 days',
        channel: 'Mobile app notification + email',
        tags: ['coverage_check', 'behavioral', 'endorsements', 'gap_analysis']
      });
    }

    // Credit risk impact on churn and propensity
    const creditRisk = this.assessCreditRisk(customer);
    if (creditRisk.impact === 'High') {
      actions.push({
        type: 'Retention',
        priority: 'High',
        confidence: 85,
        action: 'Credit-Based Risk Mitigation',
        description: `Credit bureau data shows deteriorating credit profile for ${customer.customerName} (Score: ${customer.creditScore}). This increases churn probability. Implement payment plan options and loyalty incentives to prevent cancellation.`,
        expectedRevenue: 'Retention of $' + customer.clv.toLocaleString(),
        timeline: 'Urgent - within 24 hours',
        channel: 'Direct phone call',
        tags: ['retention', 'credit_risk', 'payment_plan', 'loyalty']
        });
    }

    // Property intelligence hazard risks
    const hazardRisks = this.checkHazardRisks(customer);
    if (hazardRisks.length > 0) {
      actions.push({
        type: 'Risk Mitigation',
        priority: 'High',
        confidence: 89,
        action: 'Hazard-Specific Coverage',
        description: `Property intelligence detected ${hazardRisks.join(', ')} risks at ${customer.location}. Customer lacks matching coverage. Recommend immediate hazard-specific policies to protect against identified risks.`,
        expectedRevenue: '$450 additional premium',
        timeline: 'Within 72 hours',
        channel: 'Urgent email + SMS',
        tags: ['risk_mitigation', 'hazard', 'property_intelligence', 'location_based']
      });
    }

    // Engagement-based actions for high-risk customers
    if (customer.engagementScore < 40) {
      actions.push({
        type: 'Engagement',
        priority: 'Medium',
        confidence: 71,
        action: 'Digital Engagement Recovery',
        description: `${customer.customerName} shows very low engagement (${customer.engagementScore}%). Implement personalized re-engagement campaign with app incentives, policy benefits education, and exclusive member perks.`,
        expectedRevenue: 'Retention value preservation',
        timeline: 'Ongoing - 30 days',
        channel: 'Multi-channel campaign',
        tags: ['engagement', 'digital', 'education', 'member_perks']
      });
    }

    return actions.slice(0, 4); // Return top 4 actions
  }

  detectLifeEvents(customer) {
    const events = [];
    
    // Simulate life event detection based on customer profile
    const age = customer.age || 35;
    const tenure = customer.tenure || 24;
    
    if (age >= 25 && age <= 35) {
      events.push('Marriage/New Relationship');
    }
    if (age >= 30 && age <= 40) {
      events.push('New Child/Dependent Added');
    }
    if (tenure < 12) {
      events.push('Recent Home Purchase');
    }
    if (age >= 55) {
      events.push('Nearing Retirement');
    }
    
    // Random additional events
    const possibleEvents = ['Job Change', 'Address Change', 'Vehicle Purchase', 'Income Increase'];
    if (Math.random() > 0.6) {
      events.push(possibleEvents[Math.floor(Math.random() * possibleEvents.length)]);
    }
    
    return events;
  }

  checkUnderinsuredStatus(customer, currentPolicies) {
    // High CLV customers with limited policies are likely underinsured
    const totalCurrentPremium = currentPolicies.reduce((sum, policy) => sum + policy.premium, 0);
    const expectedPremiumForTier = customer.tier === 'Platinum' ? 3000 : 
                                  customer.tier === 'Gold' ? 2000 : 1200;
    
    return totalCurrentPremium < expectedPremiumForTier;
  }

  checkPropertyRisk(customer) {
    // Simulate property risk based on location and other factors
    const highRiskLocations = ['CA', 'FL', 'TX', 'NY'];
    const customerLocation = customer.location || '';
    
    return highRiskLocations.some(state => customerLocation.includes(state)) || Math.random() > 0.4;
  }

  checkBehavioralInsights(customer) {
    const insights = [];
    
    if (customer.appSessions < 2) {
      insights.push('low app engagement');
    }
    if (customer.engagementScore < 50) {
      insights.push('decreased digital interaction');
    }
    if (Math.random() > 0.7) {
      insights.push('billing irregularities detected');
    }
    if (Math.random() > 0.8) {
      insights.push('recent customer service complaints');
    }
    
    return insights;
  }

  assessCreditRisk(customer) {
    const creditScore = customer.creditScore || 700;
    
    if (creditScore < 600) {
      return { impact: 'High', risk: 'Significant credit deterioration' };
    } else if (creditScore < 650) {
      return { impact: 'Medium', risk: 'Moderate credit concerns' };
    }
    
    return { impact: 'Low', risk: 'Stable credit profile' };
  }

  checkHazardRisks(customer) {
    const risks = [];
    const location = customer.location || '';
    
    // Location-based risks
    if (location.includes('CA')) {
      risks.push('wildfire exposure');
    }
    if (location.includes('FL')) {
      risks.push('hurricane risk');
    }
    if (location.includes('TX')) {
      risks.push('severe weather patterns');
    }
    
    // Random additional risks
    const additionalRisks = ['flood zone proximity', 'earthquake fault lines', 'severe storm patterns'];
    if (Math.random() > 0.5) {
      risks.push(additionalRisks[Math.floor(Math.random() * additionalRisks.length)]);
    }
    
    return risks;
  }

  generateLifeEvents(customer) {
    return this.detectLifeEvents(customer);
  }

  generateRiskFactors(customer) {
    const factors = [];
    
    if (customer.churnRiskPercent >= 80) {
      factors.push('Critical churn probability');
    }
    if (customer.creditScore < 650) {
      factors.push('Credit score concerns');
    }
    if (customer.engagementScore < 40) {
      factors.push('Low digital engagement');
    }
    
    const additionalFactors = ['Payment history issues', 'Claims frequency', 'Market competition'];
    factors.push(...additionalFactors.slice(0, Math.floor(Math.random() * 2) + 1));
    
    return factors;
  }

  generateBehavioralInsights(customer) {
    return {
      appLogins: customer.appSessions || Math.floor(Math.random() * 10),
      billingIrregularities: Math.random() > 0.7,
      customerServiceComplaints: Math.floor(Math.random() * 3),
      digitalEngagementTrend: customer.engagementScore > 60 ? 'Increasing' : 'Decreasing',
      lastInteraction: `${Math.floor(Math.random() * 30) + 1} days ago`
    };
  }

  generatePropertyIntelligence(customer) {
    const location = customer.location || '';
    return {
      hazardScore: Math.floor(Math.random() * 40) + 60, // 60-100
      primaryRisks: this.checkHazardRisks(customer),
      propertyValue: Math.floor(customer.clv * 2.5), // Estimate based on CLV
      riskMitigationRecommended: Math.random() > 0.5
    };
  }

  generateCreditScore(customer) {
    // Generate realistic credit score based on customer tier and risk
    const baseScore = customer.tier === 'Platinum' ? 800 : 
                     customer.tier === 'Gold' ? 750 : 
                     customer.tier === 'Silver' ? 700 : 650;
    
    const riskAdjustment = customer.churnRisk === 'High' ? -50 : 
                          customer.churnRisk === 'Medium' ? -20 : 0;
    
    const variation = Math.floor(Math.random() * 40) - 20; // +/- 20 points
    
    return Math.max(300, Math.min(850, baseScore + riskAdjustment + variation));
  }

  async getTotalCLVAtRisk(analyticsData) {
    // Calculate total CLV at risk for high-risk customers
    const highRiskCustomers = analyticsData.customers.filter(customer => customer.churnRisk === 'High');
    const totalCLVAtRisk = highRiskCustomers.reduce((sum, customer) => sum + customer.clv, 0);
    
    console.log(`💰 Renewal Tab - Total CLV at Risk: $${totalCLVAtRisk.toLocaleString()} from ${highRiskCustomers.length} high-risk customers`);
    
    return {
      count: Math.floor(totalCLVAtRisk),
      totalAmount: totalCLVAtRisk,
      displayValue: `$${Math.floor(totalCLVAtRisk).toLocaleString()}`
    };
  }

  async getMissingCoverages(analyticsData) {
    // Count total missing coverages across all customers
    let totalMissingCoverages = 0;
    const customersWithMissingCoverage = [];
    
    analyticsData.customers.forEach(customer => {
      if (customer.missingCoverage && customer.missingCoverage !== 'None') {
        const missingCoverageList = customer.missingCoverage.split(',').map(c => c.trim()).filter(c => c.length > 0);
        totalMissingCoverages += missingCoverageList.length;
        
        if (missingCoverageList.length > 0) {
          customersWithMissingCoverage.push({
            customer,
            missingCoverageList,
            missingCount: missingCoverageList.length
          });
        }
      }
    });
    
    console.log(`🔍 Renewal Tab - Missing Coverages: ${totalMissingCoverages} total missing coverages across ${customersWithMissingCoverage.length} customers`);

    return {
      count: totalMissingCoverages,
      customersAffected: customersWithMissingCoverage.length
    };
  }

  async getRenewalPipeline(filters = {}) {
    try {
      const policyHoldersData = await this.customerIntelligenceService.getCSMConsumerData();
      const analyticsData = this.customerIntelligenceService.generateCustomerAnalytics(policyHoldersData);
      
      const renewals = analyticsData.customers.map(customer => ({
        customerName: customer.customerName,
        renewalDate: customer.renewalDate,
        renewalStatus: customer.churnRisk,
        opportunityScore: Math.floor((customer.engagementScore * 10) + (customer.clvScore * 2)),
        renewalAmount: Math.floor(customer.clv * 0.12),
        clvScore: customer.clvScore,
        customerId: customer.id,
        tier: customer.tier
      }));

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
      const actions = {
        campaignScript: {
          message: 'We value your loyalty and want to offer you a personalized renewal package. Your continued trust in our services means everything to us.',
          dynamicFields: {
            customerName: 'Valued Customer',
            productName: 'Comprehensive Coverage Package',
            renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            discountOffer: '10%'
          }
        },
        churnMitigation: [
          'Re-engage with value-based messaging highlighting policy benefits',
          'Showcase claims history and excellent service record',
          'Offer loyalty perks and exclusive member benefits',
          'Provide personalized risk assessment and recommendations'
        ],
        crossSellUpSell: [
          'Umbrella Liability - Additional protection layer',
          'Identity Theft Protection - Digital age security',
          'Travel Insurance - Comprehensive travel coverage',
          'Home Security System Discount - Smart home integration'
        ],
        outreachChannels: {
          email: { priority: 'High', effectiveness: 85 },
          contactCenter: { priority: 'High', effectiveness: 78 },
          mobileApp: { priority: 'Medium', effectiveness: 72 },
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
      console.log('Executing renewal script:', scriptData);
      return { success: true, message: 'Renewal script executed successfully' };
    } catch (error) {
      console.error('Error executing script:', error);
      throw error;
    }
  }

  async scheduleFollowUp(followUpData) {
    try {
      console.log('Scheduling renewal follow-up:', followUpData);
      return { success: true, message: 'Renewal follow-up scheduled successfully' };
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
      throw error;
    }
  }

  async sendReminder(customerId, reminderType = 'email') {
    try {
      console.log(`Sending ${reminderType} renewal reminder to customer ${customerId}`);
      return { success: true, message: `${reminderType} renewal reminder sent successfully` };
    } catch (error) {
      console.error('Error sending reminder:', error);
      throw error;
    }
  }

  async launchCampaign(customerId, campaignType) {
    try {
      console.log(`Launching ${campaignType} campaign for customer ${customerId}`);
      return { success: true, message: `${campaignType} campaign launched successfully` };
    } catch (error) {
      console.error('Error launching campaign:', error);
      throw error;
    }
  }

  async exportData(data, format = 'csv') {
    try {
      const exportData = data.map(renewal => ({
        customerName: renewal.customerName,
        renewalDate: renewal.renewalDate,
        renewalStatus: renewal.renewalStatus,
        opportunityScore: renewal.opportunityScore,
        renewalAmount: renewal.renewalAmount,
        clvScore: renewal.clvScore,
        tier: renewal.tier,
        customerId: renewal.customerId
      }));
      
      if (format === 'csv') {
        const csvContent = [
          Object.keys(exportData[0]).join(','),
          ...exportData.map(row => Object.values(row).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `renewal_pipeline_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      return { success: true, message: 'Renewal data exported successfully' };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }
}