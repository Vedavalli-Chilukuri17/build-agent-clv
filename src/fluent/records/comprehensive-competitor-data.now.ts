import '@servicenow/sdk/global';
import { Record } from '@servicenow/sdk/core';

// Competitor benchmark data in the specified format
// Product | Purchase Frequency | Premium vs Competitor | Revenue per Customer | Campaign Uplift

export const productAuto = Record({
  $id: Now.ID['product_auto_insurance'],
  table: 'x_hete_clv_maximiz_competitor_benchmark',
  data: {
    product: 'Auto Insurance Premium',
    purchase_frequency: 'strong',
    premium_vs_competitor: '+8.5%',
    revenue_per_customer: '$5K',
    campaign_uplift: '+14.3%',
    
    // Additional fields for comprehensive analysis
    competitor_name: 'Auto Insurance Market',
    product_category: 'Auto Insurance',
    market_share: 18.5,
    avg_premium: 1250.00,
    claims_ratio: 0.68,
    customer_satisfaction: 4.2,
    renewal_rate: 85.3,
    data_source: 'Product Performance Analysis 2024',
    last_updated: '2024-03-20 10:30:00'
  }
});

export const productHealth = Record({
  $id: Now.ID['product_health_insurance'],
  table: 'x_hete_clv_maximiz_competitor_benchmark',
  data: {
    product: 'Health Insurance Plus',
    purchase_frequency: 'competitive',
    premium_vs_competitor: '+2.8%',
    revenue_per_customer: '$4K',
    campaign_uplift: '+10.3%',
    
    // Additional fields for comprehensive analysis
    competitor_name: 'Health Insurance Market',
    product_category: 'Health Insurance',
    market_share: 12.8,
    avg_premium: 3150.00,
    claims_ratio: 0.78,
    customer_satisfaction: 3.7,
    renewal_rate: 79.4,
    data_source: 'Healthcare Product Benchmarking 2024',
    last_updated: '2024-03-20 11:15:00'
  }
});

export const productHome = Record({
  $id: Now.ID['product_home_insurance'],
  table: 'x_hete_clv_maximiz_competitor_benchmark',
  data: {
    product: 'Home Insurance Standard',
    purchase_frequency: 'competitive',
    premium_vs_competitor: '-3.2%',
    revenue_per_customer: '$5K',
    campaign_uplift: '+2.3%',
    
    // Additional fields for comprehensive analysis
    competitor_name: 'Home Insurance Market',
    product_category: 'Home Insurance',
    market_share: 22.1,
    avg_premium: 1850.00,
    claims_ratio: 0.72,
    customer_satisfaction: 3.9,
    renewal_rate: 82.7,
    data_source: 'Property Insurance Performance Study',
    last_updated: '2024-03-20 12:00:00'
  }
});

export const productLife = Record({
  $id: Now.ID['product_life_insurance'],
  table: 'x_hete_clv_maximiz_competitor_benchmark',
  data: {
    product: 'Life Insurance Term',
    purchase_frequency: 'challenged',
    premium_vs_competitor: '-12.5%',
    revenue_per_customer: '$5K',
    campaign_uplift: '+10.3%',
    
    // Additional fields for comprehensive analysis
    competitor_name: 'Life Insurance Market',
    product_category: 'Life Insurance',
    market_share: 15.3,
    avg_premium: 2200.00,
    claims_ratio: 0.45,
    customer_satisfaction: 4.5,
    renewal_rate: 91.2,
    data_source: 'Term Life Insurance Analysis 2024',
    last_updated: '2024-03-20 13:30:00'
  }
});

export const productTravel = Record({
  $id: Now.ID['product_travel_insurance'],
  table: 'x_hete_clv_maximiz_competitor_benchmark',
  data: {
    product: 'Travel Insurance',
    purchase_frequency: 'strong',
    premium_vs_competitor: '+18.7%',
    revenue_per_customer: '$7K',
    campaign_uplift: '+12.3%',
    
    // Additional fields for comprehensive analysis
    competitor_name: 'Travel Insurance Market',
    product_category: 'Travel Insurance',
    market_share: 6.2,
    avg_premium: 850.00,
    claims_ratio: 0.38,
    customer_satisfaction: 4.0,
    renewal_rate: 73.5,
    data_source: 'Travel Insurance Performance Report',
    last_updated: '2024-03-20 14:45:00'
  }
});

export const productUmbrella = Record({
  $id: Now.ID['product_umbrella_liability'],
  table: 'x_hete_clv_maximiz_competitor_benchmark',
  data: {
    product: 'Umbrella Liability',
    purchase_frequency: 'strong',
    premium_vs_competitor: '+14.3%',
    revenue_per_customer: '$3K',
    campaign_uplift: '+10.3%',
    
    // Additional fields for comprehensive analysis
    competitor_name: 'Umbrella Liability Market',
    product_category: 'Liability Insurance',
    market_share: 8.9,
    avg_premium: 750.00,
    claims_ratio: 0.35,
    customer_satisfaction: 4.3,
    renewal_rate: 88.7,
    data_source: 'Umbrella Insurance Market Analysis',
    last_updated: '2024-03-20 15:20:00'
  }
});

// Additional high-performing products to expand the portfolio
export const productCyber = Record({
  $id: Now.ID['product_cyber_security'],
  table: 'x_hete_clv_maximiz_competitor_benchmark',
  data: {
    product: 'Cyber Security Insurance',
    purchase_frequency: 'strong',
    premium_vs_competitor: '+22.4%',
    revenue_per_customer: '$8K',
    campaign_uplift: '+18.7%',
    
    competitor_name: 'Cyber Insurance Market',
    product_category: 'Cyber Insurance',
    market_share: 3.9,
    avg_premium: 2750.00,
    claims_ratio: 0.35,
    customer_satisfaction: 4.4,
    renewal_rate: 89.6,
    data_source: 'Cyber Insurance Growth Analysis',
    last_updated: '2024-03-20 16:00:00'
  }
});

export const productBusiness = Record({
  $id: Now.ID['product_business_package'],
  table: 'x_hete_clv_maximiz_competitor_benchmark',
  data: {
    product: 'Business Insurance Package',
    purchase_frequency: 'competitive',
    premium_vs_competitor: '+5.8%',
    revenue_per_customer: '$6K',
    campaign_uplift: '+8.9%',
    
    competitor_name: 'Commercial Insurance Market',
    product_category: 'Business Insurance',
    market_share: 9.7,
    avg_premium: 4500.00,
    claims_ratio: 0.52,
    customer_satisfaction: 4.1,
    renewal_rate: 87.9,
    data_source: 'SMB Insurance Performance Study',
    last_updated: '2024-03-20 16:30:00'
  }
});

export const productPet = Record({
  $id: Now.ID['product_pet_insurance'],
  table: 'x_hete_clv_maximiz_competitor_benchmark',
  data: {
    product: 'Pet Insurance Premium',
    purchase_frequency: 'strong',
    premium_vs_competitor: '+11.2%',
    revenue_per_customer: '$2K',
    campaign_uplift: '+15.6%',
    
    competitor_name: 'Pet Insurance Market',
    product_category: 'Pet Insurance',
    market_share: 4.3,
    avg_premium: 650.00,
    claims_ratio: 0.62,
    customer_satisfaction: 4.3,
    renewal_rate: 84.2,
    data_source: 'Pet Insurance Trends Analysis',
    last_updated: '2024-03-20 17:00:00'
  }
});

export const productUsageBased = Record({
  $id: Now.ID['product_usage_based'],
  table: 'x_hete_clv_maximiz_competitor_benchmark',
  data: {
    product: 'Usage-Based Auto Insurance',
    purchase_frequency: 'competitive',
    premium_vs_competitor: '+7.3%',
    revenue_per_customer: '$3K',
    campaign_uplift: '+13.2%',
    
    competitor_name: 'UBI Insurance Market',
    product_category: 'Usage-Based Insurance',
    market_share: 2.8,
    avg_premium: 890.00,
    claims_ratio: 0.59,
    customer_satisfaction: 4.2,
    renewal_rate: 81.3,
    data_source: 'Telematics Insurance Innovation Report',
    last_updated: '2024-03-20 17:30:00'
  }
});

export const productRenters = Record({
  $id: Now.ID['product_renters_insurance'],
  table: 'x_hete_clv_maximiz_competitor_benchmark',
  data: {
    product: 'Renters Insurance Plus',
    purchase_frequency: 'strong',
    premium_vs_competitor: '+9.8%',
    revenue_per_customer: '$1K',
    campaign_uplift: '+20.5%',
    
    competitor_name: 'Renters Insurance Market',
    product_category: 'Property Insurance',
    market_share: 5.4,
    avg_premium: 280.00,
    claims_ratio: 0.41,
    customer_satisfaction: 4.0,
    renewal_rate: 78.9,
    data_source: 'Rental Property Insurance Study',
    last_updated: '2024-03-20 18:00:00'
  }
});

export const productDisability = Record({
  $id: Now.ID['product_disability_insurance'],
  table: 'x_hete_clv_maximiz_competitor_benchmark',
  data: {
    product: 'Disability Insurance',
    purchase_frequency: 'challenged',
    premium_vs_competitor: '-8.7%',
    revenue_per_customer: '$4K',
    campaign_uplift: '+6.8%',
    
    competitor_name: 'Disability Insurance Market',
    product_category: 'Disability Insurance',
    market_share: 7.1,
    avg_premium: 1680.00,
    claims_ratio: 0.55,
    customer_satisfaction: 3.8,
    renewal_rate: 85.4,
    data_source: 'Income Protection Insurance Analysis',
    last_updated: '2024-03-20 18:30:00'
  }
});