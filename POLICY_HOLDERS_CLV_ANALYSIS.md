# Policy Holders Table Structure & CLV Update Strategy

## Table Overview: `x_hete_clv_maximiz_policy_holders`

This table contains customer policy holder information for the Customer Lifetime Value Maximization Solution.

### Key Fields for CLV Analysis

| Field Name | Type | Label | Description |
|------------|------|-------|-------------|
| `clv` | Currency | CLV (12 Months) | Customer Lifetime Value for 12-month period |
| `tier` | Choice | Tier | Customer tier classification (bronze, silver, gold, platinum) |
| `lifetime_value` | Currency | Lifetime Value ($) | Total historical customer value |
| `clv_score` | Decimal | CLV Score | Calculated CLV scoring metric |
| `engagement_score` | Integer | Engagement Score | Customer engagement measurement |
| `churn_risk` | Percent | Churn Risk (%) | Probability of customer churn |

### Customer Tier Structure

The table uses a 4-tier customer classification system:

#### 🏆 **Platinum Tier** (Highest Value)
- **CLV Range**: $80,000 - $130,000
- **Characteristics**: VIP customers, professionals, executives
- **Profile**: High income, low risk, excellent credit scores (795-850)
- **Engagement**: Premium service expectations, low churn risk (3-12%)

#### 🥇 **Gold Tier** (High Value)
- **CLV Range**: $40,000 - $65,000  
- **Characteristics**: Established professionals, loyal customers
- **Profile**: Good income, moderate risk, good credit scores (720-795)
- **Engagement**: High engagement, moderate churn risk (15-30%)

#### 🥈 **Silver Tier** (Medium Value)
- **CLV Range**: $20,000 - $35,000
- **Characteristics**: Mid-tier customers, small business owners
- **Profile**: Average income, moderate risk, fair credit scores (640-720)
- **Engagement**: Variable engagement, higher churn risk (30-60%)

#### 🥉 **Bronze Tier** (Entry Level)
- **CLV Range**: $8,000 - $18,000
- **Characteristics**: Entry-level customers, price-sensitive
- **Profile**: Lower income, higher risk, lower credit scores (600-650)
- **Engagement**: Price-focused, highest churn risk (60%+)

## CLV Update Implementation

### File: `update-clv-by-tier.now.ts`

This Fluent record file updates CLV values for all policy holders based on their tier classification:

```typescript
// Example structure for each tier
Record({
    $id: Now.ID['clv_platinum_001'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: 'record_sys_id_here',
    data: {
        clv: 95000 // Tier-appropriate value
    }
})
```

### Business Logic

The CLV values are assigned based on:

1. **Tier Classification**: Primary factor determining CLV range
2. **Risk Assessment**: Lower risk customers get higher CLV within tier
3. **Engagement Metrics**: Higher engagement correlates with higher CLV
4. **Tenure**: Longer customer relationships justify higher CLV
5. **Credit Profile**: Better credit scores support higher CLV assignments

### Benefits of Tier-Based CLV

1. **Strategic Segmentation**: Clear customer value hierarchy
2. **Resource Allocation**: Focus premium services on high-value tiers
3. **Risk Management**: Balanced portfolio across risk profiles
4. **Retention Strategy**: Tier-specific retention programs
5. **Revenue Optimization**: Maximize value from each customer segment

### Related Fields Analysis

| Field | Bronze | Silver | Gold | Platinum |
|-------|--------|---------|------|----------|
| Credit Score | 600-650 | 640-720 | 720-795 | 795-850 |
| Churn Risk | 60%+ | 30-60% | 15-30% | 3-12% |
| Engagement | 15-25 | 20-40 | 40-70 | 70-95 |
| Tenure | 1-3 years | 3-8 years | 5-15 years | 10-25 years |

## Usage Instructions

1. **Deploy the Update**: Use the deploy tool to apply CLV changes
2. **Monitor Results**: Check dashboard metrics after deployment  
3. **Validate Data**: Ensure CLV values align with tier expectations
4. **Adjust Strategy**: Refine values based on business performance

## Next Steps

- Monitor campaign effectiveness by tier
- Adjust CLV thresholds based on performance data
- Implement tier-specific marketing strategies
- Track customer movement between tiers
- Optimize retention programs by tier