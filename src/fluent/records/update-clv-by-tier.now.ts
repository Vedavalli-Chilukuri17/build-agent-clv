import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * CLV Update by Tier - Updates CLV (12 Months) values based on customer tiers
 * 
 * Tier-based CLV Structure:
 * - Platinum: $80,000 - $120,000 (Premium customers)
 * - Gold: $40,000 - $65,000 (High-value customers) 
 * - Silver: $20,000 - $35,000 (Mid-tier customers)
 * - Bronze: $8,000 - $18,000 (Entry-level customers)
 */

// Platinum Tier Updates - Highest CLV values ($80,000 - $120,000)
Record({
    $id: Now.ID['clv_platinum_001'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '365524a8c6454338b5a2926a224a048a', // Marcus Thompson Jr.
    data: {
        clv: 95000
    }
})

Record({
    $id: Now.ID['clv_platinum_002'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '5013df4d982d42cd92f2228fc7bb7e81', // Robert Chen
    data: {
        clv: 88500
    }
})

Record({
    $id: Now.ID['clv_platinum_003'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '82bc071633254a9cbfe99d101681c3e9', // Michael Chen
    data: {
        clv: 105000
    }
})

Record({
    $id: Now.ID['clv_platinum_004'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '9d8e90cf038e4b87a0c37ed8a5b373bf', // Sarah Johnson
    data: {
        clv: 118000
    }
})

Record({
    $id: Now.ID['clv_platinum_005'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: 'a05ba015d8264c0cb9816f2e3650231f', // Sarah Elizabeth Johnson
    data: {
        clv: 118000
    }
})

Record({
    $id: Now.ID['clv_platinum_006'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: 'a4206366a29041a19f30af23be2e6654', // Dr. Samuel Mitchell
    data: {
        clv: 112000
    }
})

Record({
    $id: Now.ID['clv_platinum_007'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: 'affbb8f19def41cda606c042450d5e39', // Elizabeth Anderson
    data: {
        clv: 125000
    }
})

Record({
    $id: Now.ID['clv_platinum_008'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: 'b71432c5fc9b45edaf67ef73cc1fdddb', // Maria Garcia
    data: {
        clv: 92000
    }
})

Record({
    $id: Now.ID['clv_platinum_009'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: 'c5d2ce5a290f43328c65acfd1a1a5bb4', // Thomas Moore
    data: {
        clv: 130000
    }
})

Record({
    $id: Now.ID['clv_platinum_010'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: 'ceb22be13be9321027891964c3e45a79', // Sara Chen
    data: {
        clv: 85000
    }
})

// Gold Tier Updates - High CLV values ($40,000 - $65,000)
Record({
    $id: Now.ID['clv_gold_001'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '0205b5ddc11b4e3da5fc233648df0f63', // Helen Foster
    data: {
        clv: 58000
    }
})

Record({
    $id: Now.ID['clv_gold_002'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '285f6b09665b4e1fabdcac7c5b060483', // Victoria Cooper
    data: {
        clv: 52000
    }
})

// Silver Tier Updates - Medium CLV values ($20,000 - $35,000)
Record({
    $id: Now.ID['clv_silver_001'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '00325d731c334cd7beaf540d338572a6', // Lisa Thompson
    data: {
        clv: 28000
    }
})

Record({
    $id: Now.ID['clv_silver_002'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '01c4a68877da42378507a4ef25ea5c94', // James Anderson
    data: {
        clv: 22000
    }
})

Record({
    $id: Now.ID['clv_silver_003'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '07aec15b1eb141f689403a6b5beea07c', // Carlos Santos
    data: {
        clv: 32000
    }
})

Record({
    $id: Now.ID['clv_silver_004'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '1ac9d0a1545d40a58ac81b1fa94de9cd', // Angela Brown
    data: {
        clv: 35000
    }
})

Record({
    $id: Now.ID['clv_silver_005'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '29923a0110c244c89c4e6053ed4eb022', // Brian Lewis
    data: {
        clv: 26000
    }
})

Record({
    $id: Now.ID['clv_silver_006'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '2fcaa4c822e34463abb3009052a10227', // Alex Rivera
    data: {
        clv: 30000 // Reset from the unusually high value
    }
})

Record({
    $id: Now.ID['clv_silver_007'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '32dbf468795549ad9ad8262b01b1dc48', // Ashley King
    data: {
        clv: 31000
    }
})

// Bronze Tier Updates - Lower CLV values ($8,000 - $18,000)
Record({
    $id: Now.ID['clv_bronze_001'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '03aaaacc742647569538c7cdf921d3a1', // Ashley Rodriguez
    data: {
        clv: 12500
    }
})

// Additional Silver tier records (continuing the pattern)
Record({
    $id: Now.ID['clv_silver_008'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '3667cf9d6b2b42edb4fab8b068c262fd',
    data: {
        clv: 24500
    }
})

Record({
    $id: Now.ID['clv_silver_009'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '38903c221a084b7fb8ecf4b31c07b299',
    data: {
        clv: 27800
    }
})

Record({
    $id: Now.ID['clv_silver_010'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '3a3aab404dcb4031ac74a92ba2dedd52',
    data: {
        clv: 33200
    }
})

Record({
    $id: Now.ID['clv_silver_011'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '3d31253840b24ca4bc068ba87b75b82e',
    data: {
        clv: 29400
    }
})

Record({
    $id: Now.ID['clv_silver_012'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '3daa1895b7e94ef09ca9e46c15735554',
    data: {
        clv: 25600
    }
})

// Additional Bronze tier records
Record({
    $id: Now.ID['clv_bronze_002'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '40e757b6cfa04377baada287e9363d50',
    data: {
        clv: 15200
    }
})

Record({
    $id: Now.ID['clv_bronze_003'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '4cb287f2551c426d8968b2a464b93ee0',
    data: {
        clv: 11800
    }
})

Record({
    $id: Now.ID['clv_bronze_004'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '4e0b2c956b80437bb472b8b162f84aac',
    data: {
        clv: 13400
    }
})

Record({
    $id: Now.ID['clv_bronze_005'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '52b4b3888bbe4bf5bb1c1fd9c513cbf8',
    data: {
        clv: 16800
    }
})

Record({
    $id: Now.ID['clv_bronze_006'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '5a0d0ed26b484785a503fc1e72b6aad9',
    data: {
        clv: 14200
    }
})

// Additional Gold tier records
Record({
    $id: Now.ID['clv_gold_003'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '5c5595c7de5148f5ae9696922b214c64',
    data: {
        clv: 48500
    }
})

Record({
    $id: Now.ID['clv_gold_004'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '644077a6447c4514b11f1bb5b71bd87f',
    data: {
        clv: 55200
    }
})

Record({
    $id: Now.ID['clv_gold_005'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '6485b0e0ea874b0093b81ae1b82340a4',
    data: {
        clv: 44800
    }
})

Record({
    $id: Now.ID['clv_gold_006'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '65b128ab820a4e5b8b613ea3ac2e342b',
    data: {
        clv: 60500
    }
})

Record({
    $id: Now.ID['clv_gold_007'],
    table: 'x_hete_clv_maximiz_policy_holders',
    sys_id: '67277b0a289b4a2bb41b2987b236295e',
    data: {
        clv: 46700
    }
})