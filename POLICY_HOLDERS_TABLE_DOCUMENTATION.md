# CLV Policy Holders Table Structure & Demo Data

## Table Overview
**Table Name**: `x_hete_clv_maximiz_policy_holders`  
**Display Name**: CLV Policy Holders  
**Purpose**: Comprehensive customer/policyholder data for insurance and financial services CLV analysis

## Table Schema

### Personal Information
- **name** (String): Full customer name
- **first_name** (String): Customer's first name  
- **last_name** (String): Customer's last name
- **email** (Email): Customer email address
- **phone** (Phone E164): Customer phone number
- **age** (Integer): Customer age

### Financial Profile
- **credit_score** (Integer): Credit score (300-850 range)
- **lifetime_value** (Currency): Customer lifetime value in USD
- **clv_score** (Decimal): CLV score rating (0-10 scale)
- **credit_utilization_percent** (Percent): Credit utilization percentage
- **number_of_open_accounts** (Integer): Count of open credit accounts
- **number_of_closed_accounts** (Integer): Count of closed credit accounts
- **delinquency_12m** (Integer): Number of delinquencies in last 12 months
- **credit_inquiries_last_6m** (Integer): Credit inquiries in last 6 months
- **bankruptcies_flag** (Boolean): Historical bankruptcy indicator

### Customer Segmentation
- **tier** (Choice): Customer tier level
  - `platinum`: Premium customers (highest value)
  - `gold`: High-value customers  
  - `silver`: Mid-tier customers
  - `bronze`: Basic tier customers

### Engagement Metrics
- **tenure_years** (Integer): Years as customer
- **app_sessions_30_days** (Integer): Mobile app sessions in last 30 days
- **avg_session_time_min** (Integer): Average session duration in minutes
- **website_visits_30_days** (Integer): Website visits in last 30 days
- **quote_views** (Integer): Number of quote views
- **abandoned_journeys** (Integer): Incomplete application/quote processes
- **preferred_channel** (Choice): Customer's preferred communication channel
  - `Email`: Email communication preferred
  - `Mobile App`: Mobile app preferred  
  - `Phone`: Phone communication preferred

### Risk Assessment
- **churn_risk** (Percent): Churn probability percentage (0-100%)
- **risk_flags** (String): Risk assessment notes and flags
- **missing_coverage** (String): Gaps in current insurance coverage

## Demo Data Summary

### 20 Sample Records Created

**Tier Distribution:**
- **Platinum**: 4 customers (20%) - Highest value, lowest risk
- **Gold**: 6 customers (30%) - High value, moderate engagement  
- **Silver**: 6 customers (30%) - Mid-tier value and risk
- **Bronze**: 4 customers (20%) - Lower value, higher risk

**Customer Profiles Include:**
1. **High-Value Platinum** (Sarah Johnson, Michael Chen, Elizabeth Anderson, Thomas Moore)
   - Credit scores: 795-850
   - Lifetime value: $98K-$165K
   - Very low churn risk (3-15%)
   - Long tenure (12-22 years)

2. **Stable Gold Tier** (Jennifer Rodriguez, David Wilson, Maria Gonzalez, Kevin Taylor, Dorothy Young, Daniel Garcia)
   - Credit scores: 710-765  
   - Lifetime value: $45K-$78K
   - Low to moderate churn risk (18-35%)
   - Mixed engagement patterns

3. **Mid-Tier Silver** (Lisa Thompson, Robert Martinez, Nancy White, Brian Lewis, Ashley King, etc.)
   - Credit scores: 650-705
   - Lifetime value: $28K-$41K
   - Moderate to high churn risk (38-65%)
   - Various risk factors present

4. **High-Risk Bronze** (Amanda Foster, Christopher Davis, Patricia Brown, Michelle Clark, Ryan Hall)
   - Credit scores: 520-615
   - Lifetime value: $8K-$22K  
   - High churn risk (72-95%)
   - Multiple risk indicators

**Special Cases:**
- **Recovery Story**: Daniel Garcia (bankruptcy history, now Gold tier)
- **Senior Customer**: Dorothy Young (72 years old, phone preference)
- **Young Professional**: Ashley King (high app usage, price sensitive)
- **Critical Risk**: Patricia Brown (bankruptcy, 95% churn risk)

## Data Usage in CLV Maximizer

This demo data supports:
1. **Churn Risk Heatmap**: Distribution across High/Medium/Low risk categories
2. **Customer Segmentation**: Tier-based analysis and targeting
3. **Engagement Analytics**: Digital behavior and channel preferences  
4. **Financial Risk Assessment**: Credit profiles and payment behavior
5. **Lifecycle Analytics**: Tenure and customer journey analysis

## Key Metrics Supported

- **Churn Risk Distribution**: Realistic spread across risk levels
- **CLV Scoring**: Range from 1.9 to 9.5 covering all scenarios
- **Credit Health**: Full spectrum from 520 to 850 credit scores
- **Engagement Patterns**: From digital natives to traditional phone users
- **Risk Factors**: Comprehensive risk flag examples

## Building and Deployment

The demo data is defined using ServiceNow Fluent Record API and will be automatically created when the application is deployed. All records follow the table schema exactly and provide realistic, interconnected data points for comprehensive CLV analysis.

To rebuild with updated data:
```bash
# Build the application
npm run build

# Deploy to instance  
npm run deploy
```

## Data Relationships

The demo data is designed with logical relationships:
- Higher tier customers typically have better credit scores
- Longer tenure correlates with lower churn risk
- Higher app engagement varies by age demographic
- Risk flags reflect actual credit and behavioral patterns
- Missing coverage aligns with customer tier and needs