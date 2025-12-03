import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Comprehensive updates for all existing policy holder records 
// Adding data for new fields: risk, clv (12 months), renewal_date, engagement_score

// Record 1: Maria Lopez - Silver tier, young customer with low engagement
export const updateMaria = Record({
    $id: Now.ID['update_maria_lopez'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '8ab22be13be9321027891964c3e45a97',
        risk: 'medium',
        clv: 3200,
        renewal_date: '2025-06-15',
        engagement_score: 42
    }
})

// Record 2: John Miller - Gold tier, stable mid-career professional  
export const updateJohn = Record({
    $id: Now.ID['update_john_miller'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'ceb22be13be9321027891964c3e45a74',
        risk: 'low',
        clv: 8500,
        renewal_date: '2025-04-22',
        engagement_score: 71
    }
})

// Record 3: Sara Chen - Platinum tier, high value customer
export const updateSara = Record({
    $id: Now.ID['update_sara_chen'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'ceb22be13be9321027891964c3e45a79',
        risk: 'low',
        clv: 15200,
        renewal_date: '2025-03-18',
        engagement_score: 88
    }
})

// Record 4: Raj Patel - Silver tier, older customer with payment issues
export const updateRaj = Record({
    $id: Now.ID['update_raj_patel'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'ceb22be13be9321027891964c3e45a96',
        risk: 'high',
        clv: 4800,
        renewal_date: '2025-02-28',
        engagement_score: 28
    }
})

// Record 5: Lisa Thompson - Silver tier, payment history issues
export const updateLisa = Record({
    $id: Now.ID['update_lisa_thompson'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '00325d731c334cd7beaf540d338572a6',
        risk: 'high',
        clv: 7200,
        renewal_date: '2025-01-30',
        engagement_score: 45
    }
})

// Record 6: Helen Foster - Gold tier, senior loyal customer
export const updateHelen = Record({
    $id: Now.ID['update_helen_foster'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '0205b5ddc11b4e3da5fc233648df0f63',
        risk: 'low',
        clv: 6500,
        renewal_date: '2025-04-15',
        engagement_score: 72
    }
})

// Record 7: Ashley Rodriguez - Bronze tier, freelancer with high risk
export const updateAshleyR = Record({
    $id: Now.ID['update_ashley_rodriguez'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '03aaaacc742647569538c7cdf921d3a1',
        risk: 'high',
        clv: 2900,
        renewal_date: '2025-07-12',
        engagement_score: 35
    }
})

// Record 8: Carlos Santos - Silver tier, small business owner
export const updateCarlos = Record({
    $id: Now.ID['update_carlos_santos'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '07aec15b1eb141f689403a6b5beea07c',
        risk: 'medium',
        clv: 9200,
        renewal_date: '2025-03-22',
        engagement_score: 58
    }
})

// Record 9: Angela Brown - Silver tier, hospitality industry
export const updateAngela = Record({
    $id: Now.ID['update_angela_brown'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '1ac9d0a1545d40a58ac81b1fa94de9cd',
        risk: 'medium',
        clv: 12300,
        renewal_date: '2025-05-18',
        engagement_score: 65
    }
})

// Record 10: Victoria Cooper - Gold tier, real estate professional
export const updateVictoria = Record({
    $id: Now.ID['update_victoria_cooper'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '285f6b09665b4e1fabdcac7c5b060483',
        risk: 'medium',
        clv: 5400,
        renewal_date: '2025-06-12',
        engagement_score: 74
    }
})

// Record 11: Brian Lewis - Silver tier, construction industry risk
export const updateBrian = Record({
    $id: Now.ID['update_brian_lewis'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '29923a0110c244c89c4e6053ed4eb022',
        risk: 'high',
        clv: 8100,
        renewal_date: '2025-02-14',
        engagement_score: 41
    }
})

// Record 12: Alex Rivera - Silver tier, tech startup employee
export const updateAlex = Record({
    $id: Now.ID['update_alex_rivera'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '2fcaa4c822e34463abb3009052a10227',
        risk: 'medium',
        clv: 33500,
        renewal_date: '2025-07-08',
        engagement_score: 62
    }
})

// Record 13: Ashley King - Silver tier, millennial digital user
export const updateAshleyK = Record({
    $id: Now.ID['update_ashley_king'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '32dbf468795549ad9ad8262b01b1dc48',
        risk: 'medium',
        clv: 9800,
        renewal_date: '2025-05-26',
        engagement_score: 68
    }
})

// Record 14: Michelle Clark - Bronze tier, young high risk
export const updateMichelle = Record({
    $id: Now.ID['update_michelle_clark'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '32f6479927774db29624e6f23c0c17ee',
        risk: 'high',
        clv: 5600,
        renewal_date: '2025-08-18',
        engagement_score: 39
    }
})

// Record 15: Nancy White - Silver tier, education sector
export const updateNancy = Record({
    $id: Now.ID['update_nancy_white'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '3d886b609a2b4289a20b5273a2c13836',
        risk: 'low',
        clv: 10400,
        renewal_date: '2025-04-03',
        engagement_score: 75
    }
})

// Record 16: Christopher Davis - Bronze tier, freelancer  
export const updateChristopher = Record({
    $id: Now.ID['update_christopher_davis'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'e0ecce4aff6e4383880ebd9a9980dee0',
        risk: 'high',
        clv: 3200,
        renewal_date: '2025-09-22',
        engagement_score: 32
    }
})

// Record 17: Amanda Foster - Bronze tier, small business risk
export const updateAmanda = Record({
    $id: Now.ID['update_amanda_foster'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'efa93b2d4bc84a51bcb0d76b189f919f',
        risk: 'high',
        clv: 4650,
        renewal_date: '2025-01-25',
        engagement_score: 38
    }
})

// Record 18: Marcus Thompson Jr. - Platinum tier, finance executive
export const updateMarcus = Record({
    $id: Now.ID['update_marcus_thompson_jr'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '365524a8c6454338b5a2926a224a048a',
        risk: 'low',
        clv: 35500,
        renewal_date: '2025-01-15',
        engagement_score: 91
    }
})

// Record 19: Taylor Smith - Bronze tier, graduate student
export const updateTaylor = Record({
    $id: Now.ID['update_taylor_smith'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '3383ca62618a4c2fab28fda9285f90f7',
        risk: 'high',
        clv: 20300,
        renewal_date: '2025-02-28',
        engagement_score: 36
    }
})

// Record 20: Jonathan Hill - Silver tier, stable professional
export const updateJonathan = Record({
    $id: Now.ID['update_jonathan_hill'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '57e7b0e1a02f48a19c1ed76f9f6c48f0',
        risk: 'low',
        clv: 13400,
        renewal_date: '2025-04-25',
        engagement_score: 76
    }
})

// Record 21: Melissa King - Bronze tier, high risk customer
export const updateMelissa = Record({
    $id: Now.ID['update_melissa_king'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '61634e0667e04ea686de3d92611fa1d4',
        risk: 'high',
        clv: 6700,
        renewal_date: '2025-02-14',
        engagement_score: 44
    }
})

// Record 22: Timothy Lewis - Silver tier, construction risk
export const updateTimothy = Record({
    $id: Now.ID['update_timothy_lewis'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '6bed12608f024345baf996cbc0603df2',
        risk: 'high',
        clv: 7800,
        renewal_date: '2025-03-10',
        engagement_score: 47
    }
})

// Additional records for remaining existing customers
// Record 23: Samuel Mitchell - Platinum tier, medical professional
export const updateSamuel = Record({
    $id: Now.ID['update_samuel_mitchell'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'a05ba015d8264c0cb9816f2e3650231f',
        risk: 'low',
        clv: 39600,
        renewal_date: '2025-01-12',
        engagement_score: 89
    }
})

// Record 24: Isabella Rodriguez-Chen - Gold tier, creative professional  
export const updateIsabella = Record({
    $id: Now.ID['update_isabella_rodriguez'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '82bc071633254a9cbfe99d101681c3e9',
        risk: 'medium',
        clv: 13650,
        renewal_date: '2025-06-08',
        engagement_score: 73
    }
})

// Record 25: Grace Liu - Silver tier, non-profit sector
export const updateGrace = Record({
    $id: Now.ID['update_grace_liu'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'c9dc59645f9043d1a0d7ed95a168ce44',
        risk: 'low',
        clv: 11700,
        renewal_date: '2025-04-18',
        engagement_score: 69
    }
})

// Record 26: Jordan Blake - Bronze tier, freelance developer
export const updateJordan = Record({
    $id: Now.ID['update_jordan_blake'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '896504517da645eeb0aaf0511513bb89',
        risk: 'high',
        clv: 7250,
        renewal_date: '2025-09-15',
        engagement_score: 52
    }
})

// Record 27: Robert Martinez - Silver tier, manufacturing sector
export const updateRobert = Record({
    $id: Now.ID['update_robert_martinez'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'ee63378fc58d4fa6af79d154f3e90aa5',
        risk: 'high',
        clv: 7250,
        renewal_date: '2025-01-18',
        engagement_score: 38
    }
})

// Record 28: Jennifer Rodriguez - Gold tier, health professional
export const updateJennifer = Record({
    $id: Now.ID['update_jennifer_rodriguez'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '862b5502c2c0413a9de80a5204494bd4',
        risk: 'low',
        clv: 16950,
        renewal_date: '2025-05-02',
        engagement_score: 72
    }
})

// Record 29: David Wilson - Gold tier, startup professional
export const updateDavid = Record({
    $id: Now.ID['update_david_wilson'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'e479ae73948f49a1bdc98ddd946fb58e',
        risk: 'medium',
        clv: 11450,
        renewal_date: '2025-07-20',
        engagement_score: 68
    }
})

// Record 30: Daniel Garcia - Gold tier, consulting recovery case
export const updateDaniel = Record({
    $id: Now.ID['update_daniel_garcia'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'affbb8f19def41cda606c042450d5e39',
        risk: 'medium',
        clv: 14175,
        renewal_date: '2025-03-28',
        engagement_score: 71
    }
})

// Additional existing records with varying profiles

// Record 31: Sarah Johnson - Platinum tier, tech executive
export const updateSarah = Record({
    $id: Now.ID['update_sarah_johnson'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'c5d2ce5a290f43328c65acfd1a1a5bb4',
        risk: 'low',
        clv: 31250,
        renewal_date: '2025-01-20',
        engagement_score: 85
    }
})

// Record 32: Michael Chen - Platinum tier, finance professional
export const updateMichael = Record({
    $id: Now.ID['update_michael_chen'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '4723c976045e4733b85392ecc3603ccb',
        risk: 'low',
        clv: 24625,
        renewal_date: '2025-02-15',
        engagement_score: 86
    }
})

// Record 33: Patricia Brown - Bronze tier, critical risk case
export const updatePatricia = Record({
    $id: Now.ID['update_patricia_brown'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'fa2477d13075477fb7d08f944dfdb6e0',
        risk: 'high',
        clv: 2225,
        renewal_date: '2025-08-30',
        engagement_score: 19
    }
})

// Continue with remaining records ensuring all existing sys_ids are covered...

// Record 34: Additional customer with medium risk profile
export const updateCustomer34 = Record({
    $id: Now.ID['update_customer_34'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'be2781319e7b4e839efe08a6901e2c00',
        risk: 'medium',
        clv: 8950,
        renewal_date: '2025-05-14',
        engagement_score: 64
    }
})

// Record 35: Professional services customer  
export const updateCustomer35 = Record({
    $id: Now.ID['update_customer_35'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '854808a5118b4927a62b4332ac7e048a',
        risk: 'low',
        clv: 18750,
        renewal_date: '2025-03-07',
        engagement_score: 79
    }
})

// Record 36: Young professional with moderate engagement
export const updateCustomer36 = Record({
    $id: Now.ID['update_customer_36'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'e0c7f7c5caa2422c9204c088267f8d82',
        risk: 'medium',
        clv: 6450,
        renewal_date: '2025-06-30',
        engagement_score: 56
    }
})

// Records 37-44: Covering remaining existing customers
export const updateCustomer37 = Record({
    $id: Now.ID['update_customer_37'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '9d8e90cf038e4b87a0c37ed8a5b373bf',
        risk: 'low',
        clv: 14500,
        renewal_date: '2025-04-12',
        engagement_score: 82
    }
})

export const updateCustomer38 = Record({
    $id: Now.ID['update_customer_38'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'b3f083018acd4c158f3e984c23eacd74',
        risk: 'medium',
        clv: 9200,
        renewal_date: '2025-05-22',
        engagement_score: 67
    }
})

export const updateCustomer39 = Record({
    $id: Now.ID['update_customer_39'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'dfc22ec6c50641cf97b15b7470e76877',
        risk: 'high',
        clv: 4100,
        renewal_date: '2025-01-08',
        engagement_score: 33
    }
})

export const updateCustomer40 = Record({
    $id: Now.ID['update_customer_40'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'ab20a5485a044b6388a159a03ac8c0e6',
        risk: 'medium',
        clv: 11800,
        renewal_date: '2025-07-15',
        engagement_score: 61
    }
})

export const updateCustomer41 = Record({
    $id: Now.ID['update_customer_41'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'a4206366a29041a19f30af23be2e6654',
        risk: 'low',
        clv: 22300,
        renewal_date: '2025-02-20',
        engagement_score: 84
    }
})

export const updateCustomer42 = Record({
    $id: Now.ID['update_customer_42'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '8c1969bfeb564b2e829ab81a1a60d6b9',
        risk: 'high',
        clv: 5650,
        renewal_date: '2025-08-05',
        engagement_score: 41
    }
})

export const updateCustomer43 = Record({
    $id: Now.ID['update_customer_43'],
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: '53e3b193c6f74750820554975d6a4ff1',
        risk: 'medium',
        clv: 13450,
        renewal_date: '2025-04-30',
        engagement_score: 69
    }
})

export const updateCustomer44 = Record({
    $id: Now.ID['update_customer_44'], 
    table: 'x_hete_clv_maximiz_policy_holders',
    data: {
        sys_id: 'ecc7e17a7ee2455398e1bef141cf38ee',
        risk: 'low',
        clv: 16750,
        renewal_date: '2025-06-18',
        engagement_score: 77
    }
})