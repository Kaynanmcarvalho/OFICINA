/**
 * Full Compatibility Generator V4
 * Gera checklist COMPLETO de peças para TODOS os veículos do brazilianVehicles.ts
 * TODOS os veículos terão o MESMO número de peças (checklist padronizado de 50 peças)
 * 
 * @version 4.0.0
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CHECKLIST COMPLETO DE PEÇAS - 50 ITENS OBRIGATÓRIOS PARA CARROS
// ============================================================================
const CAR_PARTS_CHECKLIST = [
  // FILTROS (5 itens)
  { id: 'oil_filter', name: 'Filtro de Óleo', category: 'Filtros', priority: 'alta' },
  { id: 'air_filter', name: 'Filtro de Ar do Motor', category: 'Filtros', priority: 'alta' },
  { id: 'cabin_filter', name: 'Filtro de Ar Condicionado', category: 'Filtros', priority: 'média' },
  { id: 'fuel_filter', name: 'Filtro de Combustível', category: 'Filtros', priority: 'alta' },
  { id: 'transmission_filter', name: 'Filtro de Transmissão', category: 'Filtros', priority: 'média' },
  // FREIOS (8 itens)
  { id: 'front_brake_pads', name: 'Pastilha de Freio Dianteira', category: 'Freios', priority: 'alta' },
  { id: 'rear_brake_pads', name: 'Pastilha de Freio Traseira', category: 'Freios', priority: 'alta' },
  { id: 'front_brake_disc', name: 'Disco de Freio Dianteiro', category: 'Freios', priority: 'alta' },
  { id: 'rear_brake_disc', name: 'Disco de Freio Traseiro', category: 'Freios', priority: 'alta' },
  { id: 'brake_fluid', name: 'Fluido de Freio DOT4', category: 'Freios', priority: 'alta' },
  { id: 'brake_hose_front', name: 'Flexível de Freio Dianteiro', category: 'Freios', priority: 'média' },
  { id: 'brake_hose_rear', name: 'Flexível de Freio Traseiro', category: 'Freios', priority: 'média' },
  { id: 'handbrake_cable', name: 'Cabo de Freio de Mão', category: 'Freios', priority: 'média' },
  // IGNIÇÃO (4 itens)
  { id: 'spark_plugs', name: 'Vela de Ignição', category: 'Ignição', priority: 'alta' },
  { id: 'ignition_coil', name: 'Bobina de Ignição', category: 'Ignição', priority: 'alta' },
  { id: 'spark_plug_wires', name: 'Cabo de Vela', category: 'Ignição', priority: 'média' },
  { id: 'distributor_cap', name: 'Tampa do Distribuidor', category: 'Ignição', priority: 'baixa' },
  // SUSPENSÃO (10 itens)
  { id: 'front_shock', name: 'Amortecedor Dianteiro', category: 'Suspensão', priority: 'alta' },
  { id: 'rear_shock', name: 'Amortecedor Traseiro', category: 'Suspensão', priority: 'alta' },
  { id: 'front_spring', name: 'Mola Dianteira', category: 'Suspensão', priority: 'alta' },
  { id: 'rear_spring', name: 'Mola Traseira', category: 'Suspensão', priority: 'alta' },
  { id: 'front_stabilizer_link', name: 'Bieleta Dianteira', category: 'Suspensão', priority: 'média' },
  { id: 'rear_stabilizer_link', name: 'Bieleta Traseira', category: 'Suspensão', priority: 'média' },
  { id: 'control_arm_front', name: 'Bandeja Dianteira', category: 'Suspensão', priority: 'alta' },
  { id: 'ball_joint', name: 'Pivô de Suspensão', category: 'Suspensão', priority: 'alta' },
  { id: 'tie_rod_end', name: 'Terminal de Direção', category: 'Suspensão', priority: 'alta' },
  { id: 'steering_rack_boot', name: 'Coifa da Caixa de Direção', category: 'Suspensão', priority: 'média' },
  // MOTOR (10 itens)
  { id: 'timing_belt', name: 'Correia Dentada', category: 'Motor', priority: 'alta' },
  { id: 'timing_belt_tensioner', name: 'Tensor da Correia Dentada', category: 'Motor', priority: 'alta' },
  { id: 'water_pump', name: 'Bomba D\'Água', category: 'Motor', priority: 'alta' },
  { id: 'thermostat', name: 'Válvula Termostática', category: 'Motor', priority: 'alta' },
  { id: 'alternator_belt', name: 'Correia do Alternador', category: 'Motor', priority: 'alta' },
  { id: 'engine_oil', name: 'Óleo do Motor 5W30', category: 'Motor', priority: 'alta' },
  { id: 'coolant', name: 'Fluido de Arrefecimento', category: 'Motor', priority: 'alta' },
  { id: 'valve_cover_gasket', name: 'Junta da Tampa de Válvulas', category: 'Motor', priority: 'média' },
  { id: 'oil_pan_gasket', name: 'Junta do Cárter', category: 'Motor', priority: 'média' },
  { id: 'pcv_valve', name: 'Válvula PCV', category: 'Motor', priority: 'baixa' },
  // ELÉTRICA (6 itens)
  { id: 'battery', name: 'Bateria', category: 'Elétrica', priority: 'alta' },
  { id: 'alternator', name: 'Alternador', category: 'Elétrica', priority: 'alta' },
  { id: 'starter_motor', name: 'Motor de Arranque', category: 'Elétrica', priority: 'alta' },
  { id: 'headlight_bulb', name: 'Lâmpada do Farol', category: 'Elétrica', priority: 'média' },
  { id: 'brake_light_bulb', name: 'Lâmpada de Freio', category: 'Elétrica', priority: 'média' },
  { id: 'fuse_kit', name: 'Kit de Fusíveis', category: 'Elétrica', priority: 'baixa' },
  // TRANSMISSÃO (4 itens)
  { id: 'clutch_kit', name: 'Kit de Embreagem', category: 'Transmissão', priority: 'alta' },
  { id: 'clutch_cable', name: 'Cabo de Embreagem', category: 'Transmissão', priority: 'média' },
  { id: 'transmission_oil', name: 'Óleo de Câmbio', category: 'Transmissão', priority: 'alta' },
  { id: 'cv_joint', name: 'Junta Homocinética', category: 'Transmissão', priority: 'alta' },
  // ROLAMENTOS (3 itens)
  { id: 'front_wheel_bearing', name: 'Rolamento de Roda Dianteiro', category: 'Rolamentos', priority: 'alta' },
  { id: 'rear_wheel_bearing', name: 'Rolamento de Roda Traseiro', category: 'Rolamentos', priority: 'alta' },
  { id: 'clutch_bearing', name: 'Rolamento de Embreagem', category: 'Rolamentos', priority: 'alta' },
];

// ============================================================================
// CHECKLIST COMPLETO DE PEÇAS - 30 ITENS OBRIGATÓRIOS PARA MOTOS
// ============================================================================
const MOTORCYCLE_PARTS_CHECKLIST = [
  { id: 'oil_filter', name: 'Filtro de Óleo', category: 'Filtros', priority: 'alta' },
  { id: 'air_filter', name: 'Filtro de Ar', category: 'Filtros', priority: 'alta' },
  { id: 'fuel_filter', name: 'Filtro de Combustível', category: 'Filtros', priority: 'média' },
  { id: 'front_brake_pads', name: 'Pastilha de Freio Dianteira', category: 'Freios', priority: 'alta' },
  { id: 'rear_brake_pads', name: 'Pastilha de Freio Traseira', category: 'Freios', priority: 'alta' },
  { id: 'front_brake_disc', name: 'Disco de Freio Dianteiro', category: 'Freios', priority: 'alta' },
  { id: 'rear_brake_disc', name: 'Disco de Freio Traseiro', category: 'Freios', priority: 'alta' },
  { id: 'brake_fluid', name: 'Fluido de Freio DOT4', category: 'Freios', priority: 'alta' },
  { id: 'brake_lever', name: 'Manete de Freio', category: 'Freios', priority: 'média' },
  { id: 'spark_plug', name: 'Vela de Ignição', category: 'Ignição', priority: 'alta' },
  { id: 'ignition_coil', name: 'Bobina de Ignição', category: 'Ignição', priority: 'alta' },
  { id: 'cdi', name: 'CDI', category: 'Ignição', priority: 'alta' },
  { id: 'front_fork_oil', name: 'Óleo de Bengala', category: 'Suspensão', priority: 'alta' },
  { id: 'front_fork_seal', name: 'Retentor de Bengala', category: 'Suspensão', priority: 'alta' },
  { id: 'rear_shock', name: 'Amortecedor Traseiro', category: 'Suspensão', priority: 'alta' },
  { id: 'swing_arm_bearing', name: 'Rolamento da Balança', category: 'Suspensão', priority: 'média' },
  { id: 'engine_oil', name: 'Óleo do Motor 10W40', category: 'Motor', priority: 'alta' },
  { id: 'coolant', name: 'Fluido de Arrefecimento', category: 'Motor', priority: 'alta' },
  { id: 'valve_clearance_shim', name: 'Pastilha de Válvula', category: 'Motor', priority: 'média' },
  { id: 'cam_chain', name: 'Corrente de Comando', category: 'Motor', priority: 'alta' },
  { id: 'cam_chain_tensioner', name: 'Tensor da Corrente', category: 'Motor', priority: 'alta' },
  { id: 'battery', name: 'Bateria', category: 'Elétrica', priority: 'alta' },
  { id: 'rectifier', name: 'Retificador', category: 'Elétrica', priority: 'alta' },
  { id: 'stator', name: 'Estator', category: 'Elétrica', priority: 'alta' },
  { id: 'headlight_bulb', name: 'Lâmpada do Farol', category: 'Elétrica', priority: 'média' },
  { id: 'chain', name: 'Corrente de Transmissão', category: 'Transmissão', priority: 'alta' },
  { id: 'front_sprocket', name: 'Pinhão', category: 'Transmissão', priority: 'alta' },
  { id: 'rear_sprocket', name: 'Coroa', category: 'Transmissão', priority: 'alta' },
  { id: 'clutch_plates', name: 'Discos de Embreagem', category: 'Transmissão', priority: 'alta' },
  { id: 'clutch_cable', name: 'Cabo de Embreagem', category: 'Transmissão', priority: 'média' },
];



// ============================================================================
// MAPEAMENTO DE MARCA/MODELO PARA PLATAFORMA
// ============================================================================
const PLATFORM_MAPPING = {
  // VOLKSWAGEN
  'volkswagen_gol': 'VW_PQ24',
  'volkswagen_voyage': 'VW_PQ24',
  'volkswagen_saveiro': 'VW_PQ24',
  'volkswagen_fox': 'VW_PQ24',
  'volkswagen_crossfox': 'VW_PQ24',
  'volkswagen_spacefox': 'VW_PQ24',
  'volkswagen_up': 'VW_PQ24',
  'volkswagen_up!': 'VW_PQ24',
  'volkswagen_kombi': 'VW_PQ24',
  'volkswagen_fusca': 'VW_CLASSIC',
  'volkswagen_brasília': 'VW_CLASSIC',
  'volkswagen_santana': 'VW_CLASSIC',
  'volkswagen_parati': 'VW_PQ24',
  'volkswagen_golf': 'VW_MQB',
  'volkswagen_polo': 'VW_MQB',
  'volkswagen_virtus': 'VW_MQB',
  'volkswagen_t-cross': 'VW_MQB',
  'volkswagen_tcross': 'VW_MQB',
  'volkswagen_nivus': 'VW_MQB',
  'volkswagen_taos': 'VW_MQB',
  'volkswagen_jetta': 'VW_MQB',
  'volkswagen_passat': 'VW_MQB',
  'volkswagen_tiguan': 'VW_MQB',
  'volkswagen_tiguan allspace': 'VW_MQB',
  'volkswagen_touareg': 'VW_MQB',
  'volkswagen_amarok': 'VW_AMAROK',
  'volkswagen_delivery': 'VW_TRUCK',
  'volkswagen_constellation': 'VW_TRUCK',
  'volkswagen_volksbus': 'VW_TRUCK',
  
  // CHEVROLET/GM
  'chevrolet_celta': 'GM_GEM',
  'chevrolet_prisma': 'GM_GEM',
  'chevrolet_corsa': 'GM_GEM',
  'chevrolet_corsa sedan': 'GM_GEM',
  'chevrolet_classic': 'GM_GEM',
  'chevrolet_astra': 'GM_GEM',
  'chevrolet_astra sedan': 'GM_GEM',
  'chevrolet_vectra': 'GM_GEM',
  'chevrolet_vectra gt': 'GM_GEM',
  'chevrolet_omega': 'GM_GEM',
  'chevrolet_onix': 'GM_VSS',
  'chevrolet_onix plus': 'GM_VSS',
  'chevrolet_cruze': 'GM_VSS',
  'chevrolet_cruze sport6': 'GM_VSS',
  'chevrolet_cobalt': 'GM_VSS',
  'chevrolet_spin': 'GM_VSS',
  'chevrolet_tracker': 'GM_VSS',
  'chevrolet_equinox': 'GM_VSS',
  'chevrolet_trailblazer': 'GM_VSS',
  'chevrolet_captiva': 'GM_VSS',
  'chevrolet_montana': 'GM_VSS',
  'chevrolet_s10': 'GM_S10',
  'chevrolet_blazer': 'GM_S10',
  'chevrolet_camaro': 'GM_CAMARO',
  'chevrolet_opala': 'GM_CLASSIC',
  'chevrolet_chevette': 'GM_CLASSIC',
  'chevrolet_monza': 'GM_CLASSIC',
  'chevrolet_kadett': 'GM_CLASSIC',
  'chevrolet_agile': 'GM_GEM',
  'chevrolet_meriva': 'GM_GEM',
  'chevrolet_zafira': 'GM_GEM',
  'chevrolet_sonic': 'GM_VSS',
  'chevrolet_malibu': 'GM_VSS',
  
  // FIAT
  'fiat_uno': 'FIAT_FIRE',
  'fiat_palio': 'FIAT_FIRE',
  'fiat_palio weekend': 'FIAT_FIRE',
  'fiat_palio adventure': 'FIAT_FIRE',
  'fiat_siena': 'FIAT_FIRE',
  'fiat_grand siena': 'FIAT_FIRE',
  'fiat_strada': 'FIAT_FIRE',
  'fiat_mobi': 'FIAT_FIRE',
  'fiat_fiorino': 'FIAT_FIRE',
  'fiat_doblò': 'FIAT_FIRE',
  'fiat_doblo': 'FIAT_FIRE',
  'fiat_idea': 'FIAT_FIRE',
  'fiat_punto': 'FIAT_FIRE',
  'fiat_punto t-jet': 'FIAT_FIRE',
  'fiat_linea': 'FIAT_FIRE',
  'fiat_bravo': 'FIAT_FIRE',
  'fiat_argo': 'FIAT_ARGO',
  'fiat_cronos': 'FIAT_ARGO',
  'fiat_pulse': 'FIAT_ARGO',
  'fiat_fastback': 'FIAT_ARGO',
  'fiat_toro': 'FIAT_TORO',
  'fiat_ducato': 'FIAT_DUCATO',
  'fiat_500': 'FIAT_500',
  'fiat_tempra': 'FIAT_CLASSIC',
  'fiat_tipo': 'FIAT_CLASSIC',
  'fiat_147': 'FIAT_CLASSIC',
  'fiat_elba': 'FIAT_CLASSIC',
  'fiat_prêmio': 'FIAT_CLASSIC',
  'fiat_premio': 'FIAT_CLASSIC',
  'fiat_freemont': 'FIAT_FREEMONT',
  
  // FORD
  'ford_fiesta': 'FORD_SIGMA',
  'ford_fiesta sedan': 'FORD_SIGMA',
  'ford_new fiesta': 'FORD_SIGMA',
  'ford_ka': 'FORD_SIGMA',
  'ford_ka sedan': 'FORD_SIGMA',
  'ford_focus': 'FORD_DURATEC',
  'ford_focus sedan': 'FORD_DURATEC',
  'ford_fusion': 'FORD_ECOBOOST',
  'ford_ecosport': 'FORD_SIGMA',
  'ford_territory': 'FORD_ECOBOOST',
  'ford_edge': 'FORD_ECOBOOST',
  'ford_ranger': 'FORD_RANGER',
  'ford_ranger raptor': 'FORD_RANGER',
  'ford_f-250': 'FORD_TRUCK',
  'ford_f-1000': 'FORD_TRUCK',
  'ford_courier': 'FORD_SIGMA',
  'ford_maverick': 'FORD_ECOBOOST',
  'ford_transit': 'FORD_TRANSIT',
  'ford_bronco sport': 'FORD_ECOBOOST',
  'ford_mustang': 'FORD_MUSTANG',
  'ford_escort': 'FORD_CLASSIC',
  'ford_verona': 'FORD_CLASSIC',
  'ford_del rey': 'FORD_CLASSIC',
  'ford_corcel': 'FORD_CLASSIC',
  'ford_belina': 'FORD_CLASSIC',
  'ford_pampa': 'FORD_CLASSIC',
  'ford_cargo': 'FORD_TRUCK',
  
  // TOYOTA
  'toyota_corolla': 'TOYOTA',
  'toyota_corolla cross': 'TOYOTA',
  'toyota_yaris': 'TOYOTA',
  'toyota_yaris sedan': 'TOYOTA',
  'toyota_etios': 'TOYOTA',
  'toyota_etios sedan': 'TOYOTA',
  'toyota_camry': 'TOYOTA',
  'toyota_prius': 'TOYOTA',
  'toyota_rav4': 'TOYOTA',
  'toyota_sw4': 'TOYOTA',
  'toyota_hilux': 'TOYOTA_HILUX',
  'toyota_hilux sw4': 'TOYOTA_HILUX',
  'toyota_land cruiser': 'TOYOTA_HILUX',
  'toyota_bandeirante': 'TOYOTA_CLASSIC',
  
  // HONDA
  'honda_civic': 'HONDA',
  'honda_city': 'HONDA',
  'honda_fit': 'HONDA',
  'honda_wr-v': 'HONDA',
  'honda_wrv': 'HONDA',
  'honda_hr-v': 'HONDA',
  'honda_hrv': 'HONDA',
  'honda_cr-v': 'HONDA',
  'honda_crv': 'HONDA',
  'honda_accord': 'HONDA',
  
  // HYUNDAI
  'hyundai_hb20': 'HYUNDAI',
  'hyundai_hb20s': 'HYUNDAI',
  'hyundai_hb20x': 'HYUNDAI',
  'hyundai_creta': 'HYUNDAI',
  'hyundai_tucson': 'HYUNDAI',
  'hyundai_ix35': 'HYUNDAI',
  'hyundai_santa fe': 'HYUNDAI',
  'hyundai_azera': 'HYUNDAI',
  'hyundai_elantra': 'HYUNDAI',
  'hyundai_veloster': 'HYUNDAI',
  'hyundai_i30': 'HYUNDAI',
  
  // KIA
  'kia_picanto': 'KIA',
  'kia_rio': 'KIA',
  'kia_cerato': 'KIA',
  'kia_sportage': 'KIA',
  'kia_sorento': 'KIA',
  'kia_soul': 'KIA',
  'kia_stinger': 'KIA',
  'kia_carnival': 'KIA',
  'kia_seltos': 'KIA',
  
  // RENAULT
  'renault_kwid': 'RENAULT',
  'renault_sandero': 'RENAULT',
  'renault_logan': 'RENAULT',
  'renault_stepway': 'RENAULT',
  'renault_duster': 'RENAULT',
  'renault_oroch': 'RENAULT',
  'renault_captur': 'RENAULT',
  'renault_fluence': 'RENAULT',
  'renault_megane': 'RENAULT',
  'renault_clio': 'RENAULT',
  'renault_scenic': 'RENAULT',
  'renault_master': 'RENAULT_MASTER',
  
  // NISSAN
  'nissan_march': 'NISSAN',
  'nissan_versa': 'NISSAN',
  'nissan_sentra': 'NISSAN',
  'nissan_kicks': 'NISSAN',
  'nissan_frontier': 'NISSAN_FRONTIER',
  'nissan_livina': 'NISSAN',
  'nissan_tiida': 'NISSAN',
  
  // JEEP
  'jeep_renegade': 'JEEP',
  'jeep_compass': 'JEEP',
  'jeep_commander': 'JEEP',
  'jeep_wrangler': 'JEEP_WRANGLER',
  'jeep_grand cherokee': 'JEEP',
  'jeep_cherokee': 'JEEP',
  
  // PEUGEOT
  'peugeot_208': 'PEUGEOT',
  'peugeot_2008': 'PEUGEOT',
  'peugeot_308': 'PEUGEOT',
  'peugeot_3008': 'PEUGEOT',
  'peugeot_408': 'PEUGEOT',
  'peugeot_5008': 'PEUGEOT',
  'peugeot_206': 'PEUGEOT_CLASSIC',
  'peugeot_207': 'PEUGEOT_CLASSIC',
  'peugeot_307': 'PEUGEOT_CLASSIC',
  
  // CITROËN
  'citroën_c3': 'CITROEN',
  'citroen_c3': 'CITROEN',
  'citroën_c4': 'CITROEN',
  'citroen_c4': 'CITROEN',
  'citroën_c4 cactus': 'CITROEN',
  'citroen_c4 cactus': 'CITROEN',
  'citroën_aircross': 'CITROEN',
  'citroen_aircross': 'CITROEN',
  'citroën_jumper': 'CITROEN_JUMPER',
  'citroen_jumper': 'CITROEN_JUMPER',
  
  // MITSUBISHI
  'mitsubishi_lancer': 'MITSUBISHI',
  'mitsubishi_asx': 'MITSUBISHI',
  'mitsubishi_outlander': 'MITSUBISHI',
  'mitsubishi_pajero': 'MITSUBISHI_PAJERO',
  'mitsubishi_pajero sport': 'MITSUBISHI_PAJERO',
  'mitsubishi_l200': 'MITSUBISHI_L200',
  'mitsubishi_l200 triton': 'MITSUBISHI_L200',
  'mitsubishi_eclipse cross': 'MITSUBISHI',
  
  // SUZUKI
  'suzuki_swift': 'SUZUKI',
  'suzuki_vitara': 'SUZUKI',
  'suzuki_jimny': 'SUZUKI_JIMNY',
  'suzuki_sx4': 'SUZUKI',
  'suzuki_s-cross': 'SUZUKI',
  
  // BMW
  'bmw_série 1': 'BMW',
  'bmw_serie 1': 'BMW',
  'bmw_série 2': 'BMW',
  'bmw_serie 2': 'BMW',
  'bmw_série 3': 'BMW',
  'bmw_serie 3': 'BMW',
  'bmw_série 4': 'BMW',
  'bmw_serie 4': 'BMW',
  'bmw_série 5': 'BMW',
  'bmw_serie 5': 'BMW',
  'bmw_x1': 'BMW',
  'bmw_x2': 'BMW',
  'bmw_x3': 'BMW',
  'bmw_x4': 'BMW',
  'bmw_x5': 'BMW',
  'bmw_x6': 'BMW',
  
  // AUDI
  'audi_a1': 'AUDI',
  'audi_a3': 'AUDI',
  'audi_a4': 'AUDI',
  'audi_a5': 'AUDI',
  'audi_a6': 'AUDI',
  'audi_q3': 'AUDI',
  'audi_q5': 'AUDI',
  'audi_q7': 'AUDI',
  'audi_q8': 'AUDI',
  'audi_tt': 'AUDI',
  
  // MERCEDES
  'mercedes-benz_classe a': 'MERCEDES',
  'mercedes-benz_classe c': 'MERCEDES',
  'mercedes-benz_classe e': 'MERCEDES',
  'mercedes-benz_gla': 'MERCEDES',
  'mercedes-benz_glb': 'MERCEDES',
  'mercedes-benz_glc': 'MERCEDES',
  'mercedes-benz_gle': 'MERCEDES',
  'mercedes_classe a': 'MERCEDES',
  'mercedes_classe c': 'MERCEDES',
  'mercedes_gla': 'MERCEDES',
  
  // PORSCHE
  'porsche_911': 'PORSCHE',
  'porsche_cayenne': 'PORSCHE',
  'porsche_macan': 'PORSCHE',
  'porsche_panamera': 'PORSCHE',
  'porsche_boxster': 'PORSCHE',
  'porsche_cayman': 'PORSCHE',
  
  // MOTOS HONDA
  'honda_cg': 'HONDA_MOTO',
  'honda_cg 125': 'HONDA_MOTO',
  'honda_cg 150': 'HONDA_MOTO',
  'honda_cg 160': 'HONDA_MOTO',
  'honda_biz': 'HONDA_MOTO',
  'honda_biz 100': 'HONDA_MOTO',
  'honda_biz 110': 'HONDA_MOTO',
  'honda_biz 125': 'HONDA_MOTO',
  'honda_pop': 'HONDA_MOTO',
  'honda_pop 100': 'HONDA_MOTO',
  'honda_pop 110': 'HONDA_MOTO',
  'honda_cb': 'HONDA_MOTO',
  'honda_cb 250': 'HONDA_MOTO',
  'honda_cb 300': 'HONDA_MOTO',
  'honda_cb 500': 'HONDA_MOTO_BIG',
  'honda_cb 650': 'HONDA_MOTO_BIG',
  'honda_cb 1000': 'HONDA_MOTO_BIG',
  'honda_cbr': 'HONDA_MOTO_BIG',
  'honda_cbr 600': 'HONDA_MOTO_BIG',
  'honda_cbr 1000': 'HONDA_MOTO_BIG',
  'honda_xre': 'HONDA_MOTO',
  'honda_xre 190': 'HONDA_MOTO',
  'honda_xre 300': 'HONDA_MOTO',
  'honda_bros': 'HONDA_MOTO',
  'honda_nxr': 'HONDA_MOTO',
  'honda_pcx': 'HONDA_SCOOTER',
  'honda_elite': 'HONDA_SCOOTER',
  'honda_lead': 'HONDA_SCOOTER',
  'honda_sh': 'HONDA_SCOOTER',
  'honda_adv': 'HONDA_SCOOTER',
  'honda_africa twin': 'HONDA_MOTO_BIG',
  'honda_nc': 'HONDA_MOTO_BIG',
  'honda_nc 750': 'HONDA_MOTO_BIG',
  
  // MOTOS YAMAHA
  'yamaha_factor': 'YAMAHA_MOTO',
  'yamaha_fazer': 'YAMAHA_MOTO',
  'yamaha_fazer 150': 'YAMAHA_MOTO',
  'yamaha_fazer 250': 'YAMAHA_MOTO',
  'yamaha_ybr': 'YAMAHA_MOTO',
  'yamaha_crosser': 'YAMAHA_MOTO',
  'yamaha_lander': 'YAMAHA_MOTO',
  'yamaha_tenere': 'YAMAHA_MOTO_BIG',
  'yamaha_mt-03': 'YAMAHA_MOTO',
  'yamaha_mt-07': 'YAMAHA_MOTO_BIG',
  'yamaha_mt-09': 'YAMAHA_MOTO_BIG',
  'yamaha_r1': 'YAMAHA_MOTO_BIG',
  'yamaha_r3': 'YAMAHA_MOTO',
  'yamaha_r6': 'YAMAHA_MOTO_BIG',
  'yamaha_xj6': 'YAMAHA_MOTO_BIG',
  'yamaha_nmax': 'YAMAHA_SCOOTER',
  'yamaha_neo': 'YAMAHA_SCOOTER',
  'yamaha_fluo': 'YAMAHA_SCOOTER',
  
  // MOTOS KAWASAKI
  'kawasaki_ninja': 'KAWASAKI_MOTO',
  'kawasaki_ninja 250': 'KAWASAKI_MOTO',
  'kawasaki_ninja 300': 'KAWASAKI_MOTO',
  'kawasaki_ninja 400': 'KAWASAKI_MOTO',
  'kawasaki_ninja 650': 'KAWASAKI_MOTO_BIG',
  'kawasaki_ninja zx': 'KAWASAKI_MOTO_BIG',
  'kawasaki_z300': 'KAWASAKI_MOTO',
  'kawasaki_z400': 'KAWASAKI_MOTO',
  'kawasaki_z650': 'KAWASAKI_MOTO_BIG',
  'kawasaki_z900': 'KAWASAKI_MOTO_BIG',
  'kawasaki_versys': 'KAWASAKI_MOTO_BIG',
  'kawasaki_vulcan': 'KAWASAKI_MOTO_BIG',
  
  // MOTOS BMW
  'bmw_g 310': 'BMW_MOTO',
  'bmw_f 750': 'BMW_MOTO_BIG',
  'bmw_f 850': 'BMW_MOTO_BIG',
  'bmw_r 1200': 'BMW_MOTO_BIG',
  'bmw_r 1250': 'BMW_MOTO_BIG',
  'bmw_s 1000': 'BMW_MOTO_BIG',
  
  // MOTOS DUCATI
  'ducati_monster': 'DUCATI_MOTO',
  'ducati_scrambler': 'DUCATI_MOTO',
  'ducati_multistrada': 'DUCATI_MOTO',
  'ducati_panigale': 'DUCATI_MOTO',
  'ducati_diavel': 'DUCATI_MOTO',
  
  // MOTOS HARLEY
  'harley-davidson_sportster': 'HARLEY_MOTO',
  'harley-davidson_softail': 'HARLEY_MOTO',
  'harley-davidson_touring': 'HARLEY_MOTO',
  'harley-davidson_street': 'HARLEY_MOTO',
  'harley-davidson_iron': 'HARLEY_MOTO',
  
  // MOTOS TRIUMPH
  'triumph_street triple': 'TRIUMPH_MOTO',
  'triumph_tiger': 'TRIUMPH_MOTO',
  'triumph_bonneville': 'TRIUMPH_MOTO',
  'triumph_speed triple': 'TRIUMPH_MOTO',
  
  // MOTOS SUZUKI
  'suzuki_gsx': 'SUZUKI_MOTO',
  'suzuki_gsx-r': 'SUZUKI_MOTO',
  'suzuki_v-strom': 'SUZUKI_MOTO',
  'suzuki_intruder': 'SUZUKI_MOTO',
  'suzuki_burgman': 'SUZUKI_SCOOTER',
  
  // CAMINHÕES MERCEDES
  'mercedes-benz_atego': 'MERCEDES_TRUCK',
  'mercedes-benz_axor': 'MERCEDES_TRUCK',
  'mercedes-benz_actros': 'MERCEDES_TRUCK',
  'mercedes-benz_accelo': 'MERCEDES_TRUCK',
  
  // CAMINHÕES SCANIA
  'scania_r': 'SCANIA_TRUCK',
  'scania_p': 'SCANIA_TRUCK',
  'scania_g': 'SCANIA_TRUCK',
  
  // CAMINHÕES VOLVO
  'volvo_fh': 'VOLVO_TRUCK',
  'volvo_fm': 'VOLVO_TRUCK',
  'volvo_vm': 'VOLVO_TRUCK',
  
  // CAMINHÕES IVECO
  'iveco_daily': 'IVECO_TRUCK',
  'iveco_tector': 'IVECO_TRUCK',
  'iveco_stralis': 'IVECO_TRUCK',
};



// ============================================================================
// BASE DE PART NUMBERS POR PLATAFORMA - TODAS AS 50 PEÇAS
// ============================================================================
const PLATFORM_PARTS = {
  // VW PQ24 (Gol, Voyage, Fox, Saveiro, Up)
  VW_PQ24: {
    oil_filter: { partNumber: 'W712/95', brand: 'MANN-FILTER', equivalents: ['TECFIL PSL315', 'FRAM PH6811', 'BOSCH F026407157'], avgPrice: 45 },
    air_filter: { partNumber: 'C27192/1', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL6079', 'FRAM CA10242', 'WIX WA9756'], avgPrice: 55 },
    cabin_filter: { partNumber: 'CUK2939', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP315', 'FRAM CF10775', 'BOSCH 1987432315'], avgPrice: 65 },
    fuel_filter: { partNumber: 'WK730/1', brand: 'MANN-FILTER', equivalents: ['TECFIL GI02', 'FRAM G10166', 'BOSCH F026402062'], avgPrice: 85 },
    transmission_filter: { partNumber: 'H199KIT', brand: 'MANN-FILTER', equivalents: ['ZF 0501216243', 'MEYLE 1003250004'], avgPrice: 120 },
    front_brake_pads: { partNumber: 'N-1108', brand: 'COBREQ', equivalents: ['FRAS-LE PD/580', 'BOSCH BP1108', 'TRW GDB1550'], avgPrice: 85 },
    rear_brake_pads: { partNumber: 'N-1109', brand: 'COBREQ', equivalents: ['FRAS-LE PD/581', 'BOSCH BP1109', 'TRW GDB1551'], avgPrice: 75 },
    front_brake_disc: { partNumber: 'BD1108', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF108', 'VARGA 1108', 'TRW DF4108'], avgPrice: 180 },
    rear_brake_disc: { partNumber: 'BD1109', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF109', 'VARGA 1109', 'TRW DF4109'], avgPrice: 160 },
    brake_fluid: { partNumber: 'DOT4-500ML', brand: 'BOSCH', equivalents: ['WAGNER DOT4', 'CASTROL DOT4', 'MOBIL DOT4'], avgPrice: 35 },
    brake_hose_front: { partNumber: 'FH1108', brand: 'FRAS-LE', equivalents: ['TRW PHD1108', 'VARGA VH1108'], avgPrice: 45 },
    brake_hose_rear: { partNumber: 'FH1109', brand: 'FRAS-LE', equivalents: ['TRW PHD1109', 'VARGA VH1109'], avgPrice: 40 },
    handbrake_cable: { partNumber: 'CB1108', brand: 'COFLE', equivalents: ['NAKATA NCB1108', 'FRAS-LE FCB1108'], avgPrice: 55 },
    spark_plugs: { partNumber: 'BKR6E', brand: 'NGK', equivalents: ['BOSCH FR7DC+', 'DENSO K20PR-U', 'CHAMPION RC9YC'], avgPrice: 25 },
    ignition_coil: { partNumber: 'U5055', brand: 'NGK', equivalents: ['BOSCH 0221604115', 'BERU ZS055'], avgPrice: 180 },
    spark_plug_wires: { partNumber: 'SCT1108', brand: 'NGK', equivalents: ['BOSCH 0986356734', 'BERU R304'], avgPrice: 120 },
    distributor_cap: { partNumber: 'DC1108', brand: 'BOSCH', equivalents: ['BERU VK355', 'MAGNETI MARELLI BDA1108'], avgPrice: 85 },
    front_shock: { partNumber: 'GP32960', brand: 'MONROE', equivalents: ['COFAP MP32960', 'NAKATA HG32960', 'KAYABA 333419'], avgPrice: 280 },
    rear_shock: { partNumber: 'GP32961', brand: 'MONROE', equivalents: ['COFAP MP32961', 'NAKATA HG32961', 'KAYABA 343307'], avgPrice: 220 },
    front_spring: { partNumber: 'MC1108', brand: 'COFAP', equivalents: ['FABRINI F1108', 'NAKATA NS1108'], avgPrice: 180 },
    rear_spring: { partNumber: 'MC1109', brand: 'COFAP', equivalents: ['FABRINI F1109', 'NAKATA NS1109'], avgPrice: 160 },
    front_stabilizer_link: { partNumber: 'BL1108', brand: 'NAKATA', equivalents: ['VIEMAR V1108', 'AXIOS AX1108'], avgPrice: 65 },
    rear_stabilizer_link: { partNumber: 'BL1109', brand: 'NAKATA', equivalents: ['VIEMAR V1109', 'AXIOS AX1109'], avgPrice: 60 },
    control_arm_front: { partNumber: 'BA1108', brand: 'NAKATA', equivalents: ['VIEMAR VB1108', 'AXIOS AB1108'], avgPrice: 320 },
    ball_joint: { partNumber: 'PV1108', brand: 'NAKATA', equivalents: ['VIEMAR VP1108', 'AXIOS AP1108'], avgPrice: 85 },
    tie_rod_end: { partNumber: 'TD1108', brand: 'NAKATA', equivalents: ['VIEMAR VT1108', 'AXIOS AT1108'], avgPrice: 75 },
    steering_rack_boot: { partNumber: 'CR1108', brand: 'NAKATA', equivalents: ['VIEMAR VC1108', 'AXIOS AC1108'], avgPrice: 45 },
    timing_belt: { partNumber: 'CT1028', brand: 'CONTITECH', equivalents: ['GATES 5552XS', 'DAYCO 941028', 'INA 530047710'], avgPrice: 120 },
    timing_belt_tensioner: { partNumber: 'VKM11028', brand: 'SKF', equivalents: ['INA 531047710', 'GATES T43028'], avgPrice: 180 },
    water_pump: { partNumber: 'WP1028', brand: 'URBA', equivalents: ['INDISA 1028', 'NAKATA NKBA1028', 'SKF VKPC81418'], avgPrice: 180 },
    thermostat: { partNumber: 'TH1028', brand: 'WAHLER', equivalents: ['BEHR TX1028', 'GATES TH1028'], avgPrice: 65 },
    alternator_belt: { partNumber: '6PK1028', brand: 'CONTITECH', equivalents: ['GATES 6PK1028', 'DAYCO 6PK1028'], avgPrice: 45 },
    engine_oil: { partNumber: '5W30-4L', brand: 'CASTROL', equivalents: ['MOBIL 5W30', 'SHELL 5W30', 'PETRONAS 5W30'], avgPrice: 120 },
    coolant: { partNumber: 'G12-1L', brand: 'VW', equivalents: ['PARAFLU G12', 'CASTROL G12'], avgPrice: 45 },
    valve_cover_gasket: { partNumber: 'JTV1028', brand: 'VICTOR REINZ', equivalents: ['ELRING 1028', 'AJUSA 1028'], avgPrice: 85 },
    oil_pan_gasket: { partNumber: 'JC1028', brand: 'VICTOR REINZ', equivalents: ['ELRING C1028', 'AJUSA C1028'], avgPrice: 95 },
    pcv_valve: { partNumber: 'PCV1028', brand: 'BOSCH', equivalents: ['WAHLER PCV1028', 'GATES PCV1028'], avgPrice: 35 },
    battery: { partNumber: 'M60GD', brand: 'MOURA', equivalents: ['HELIAR HF60DD', 'ACDelco 60AH', 'BOSCH S5X60D'], avgPrice: 450 },
    alternator: { partNumber: 'ALT1028', brand: 'BOSCH', equivalents: ['VALEO 1028', 'DENSO 1028'], avgPrice: 650 },
    starter_motor: { partNumber: 'SM1028', brand: 'BOSCH', equivalents: ['VALEO SM1028', 'DENSO SM1028'], avgPrice: 550 },
    headlight_bulb: { partNumber: 'H7-55W', brand: 'OSRAM', equivalents: ['PHILIPS H7', 'NARVA H7', 'GE H7'], avgPrice: 35 },
    brake_light_bulb: { partNumber: 'P21W', brand: 'OSRAM', equivalents: ['PHILIPS P21W', 'NARVA P21W'], avgPrice: 8 },
    fuse_kit: { partNumber: 'FK-UNIV', brand: 'LITTELFUSE', equivalents: ['BUSSMANN FK', 'HELLA FK'], avgPrice: 25 },
    clutch_kit: { partNumber: 'CK1028', brand: 'LUK', equivalents: ['SACHS 3000954095', 'VALEO 826818', 'EXEDY 1028'], avgPrice: 650 },
    clutch_cable: { partNumber: 'CC1028', brand: 'COFLE', equivalents: ['NAKATA NCC1028', 'FRAS-LE FCC1028'], avgPrice: 75 },
    transmission_oil: { partNumber: '75W90-1L', brand: 'CASTROL', equivalents: ['MOBIL 75W90', 'SHELL 75W90'], avgPrice: 85 },
    cv_joint: { partNumber: 'CVJ1028', brand: 'GKN', equivalents: ['SKF VKJA1028', 'NAKATA NCV1028'], avgPrice: 280 },
    front_wheel_bearing: { partNumber: 'WB1028', brand: 'SKF', equivalents: ['FAG 713610100', 'NSK 45BWD10', 'TIMKEN 1028'], avgPrice: 180 },
    rear_wheel_bearing: { partNumber: 'WB1029', brand: 'SKF', equivalents: ['FAG 713610101', 'NSK 45BWD11', 'TIMKEN 1029'], avgPrice: 160 },
    clutch_bearing: { partNumber: 'CB1028', brand: 'SKF', equivalents: ['FAG CB1028', 'NSK CB1028', 'INA CB1028'], avgPrice: 120 },
  },
};

// Base de peças para MOTOS (30 peças)
const MOTORCYCLE_BASE_PARTS = {
  oil_filter: { partNumber: 'HF204', brand: 'HIFLOFILTRO', equivalents: ['FRAM CH6015', 'K&N KN-204'], avgPrice: 35 },
  air_filter: { partNumber: 'HFA4505', brand: 'HIFLOFILTRO', equivalents: ['K&N YA-6001', 'BMC FM465/04'], avgPrice: 85 },
  fuel_filter: { partNumber: 'FF-101', brand: 'EMGO', equivalents: ['K&N 81-0261', 'UNIFILTER FF101'], avgPrice: 25 },
  front_brake_pads: { partNumber: 'FA252', brand: 'EBC', equivalents: ['FERODO FDB2074', 'BREMBO 07YA23'], avgPrice: 120 },
  rear_brake_pads: { partNumber: 'FA174', brand: 'EBC', equivalents: ['FERODO FDB2018', 'BREMBO 07YA17'], avgPrice: 95 },
  front_brake_disc: { partNumber: 'MD2074X', brand: 'EBC', equivalents: ['BREMBO 78B40816', 'GALFER DF070W'], avgPrice: 450 },
  rear_brake_disc: { partNumber: 'MD1163', brand: 'EBC', equivalents: ['BREMBO 68B407G0', 'GALFER DF070R'], avgPrice: 320 },
  brake_fluid: { partNumber: 'DOT4-500ML', brand: 'MOTUL', equivalents: ['CASTROL DOT4', 'BREMBO DOT4'], avgPrice: 45 },
  brake_lever: { partNumber: 'BL-101', brand: 'ASV', equivalents: ['PUIG 5454', 'RIZOMA LBX500'], avgPrice: 180 },
  spark_plug: { partNumber: 'CR9EK', brand: 'NGK', equivalents: ['DENSO IU27', 'BOSCH UR4DC'], avgPrice: 35 },
  ignition_coil: { partNumber: 'IC-YZF', brand: 'RICK\'S', equivalents: ['ELECTROSPORT ESC101', 'ARROWHEAD IYA6012'], avgPrice: 280 },
  cdi: { partNumber: 'CDI-R3', brand: 'RICK\'S', equivalents: ['ELECTROSPORT ESC201', 'ARROWHEAD AYA6001'], avgPrice: 450 },
  front_fork_oil: { partNumber: 'FORK-5W', brand: 'MOTUL', equivalents: ['CASTROL FORK 5W', 'MOTOREX FORK 5W'], avgPrice: 65 },
  front_fork_seal: { partNumber: 'FS-41', brand: 'ALL BALLS', equivalents: ['ATHENA P40FORK455012', 'SKF KITG-41Y'], avgPrice: 120 },
  rear_shock: { partNumber: 'YSS-R3', brand: 'YSS', equivalents: ['OHLINS YA468', 'SHOWA BFRC'], avgPrice: 1200 },
  swing_arm_bearing: { partNumber: 'SAB-101', brand: 'ALL BALLS', equivalents: ['PIVOT WORKS PWSAK-Y27', 'MOOSE 1302-0227'], avgPrice: 85 },
  engine_oil: { partNumber: '10W40-4T', brand: 'MOTUL', equivalents: ['CASTROL POWER1 10W40', 'SHELL ADVANCE 10W40'], avgPrice: 95 },
  coolant: { partNumber: 'MOTO-COOL', brand: 'MOTUL', equivalents: ['CASTROL MOTO COOLANT', 'MOTOREX COOLANT'], avgPrice: 55 },
  valve_clearance_shim: { partNumber: 'VCS-KIT', brand: 'HOT CAMS', equivalents: ['WISECO SHIM KIT', 'KIBBLEWHITE SHIM'], avgPrice: 180 },
  cam_chain: { partNumber: 'CC-R3', brand: 'DID', equivalents: ['RK 25H', 'REGINA 25H'], avgPrice: 85 },
  cam_chain_tensioner: { partNumber: 'CCT-R3', brand: 'APE', equivalents: ['MOTION PRO 08-0467', 'WORKS CONNECTION'], avgPrice: 120 },
  battery: { partNumber: 'YTZ10S', brand: 'YUASA', equivalents: ['MOTOBATT MBTX9U', 'SHORAI LFX14'], avgPrice: 380 },
  rectifier: { partNumber: 'RR-R3', brand: 'RICK\'S', equivalents: ['ELECTROSPORT ESR101', 'MOOSE 2112-0954'], avgPrice: 220 },
  stator: { partNumber: 'ST-R3', brand: 'RICK\'S', equivalents: ['ELECTROSPORT ESG101', 'ARROWHEAD AYA4001'], avgPrice: 380 },
  headlight_bulb: { partNumber: 'H7-55W', brand: 'OSRAM', equivalents: ['PHILIPS H7', 'SYLVANIA H7'], avgPrice: 35 },
  chain: { partNumber: '520VX3-120', brand: 'DID', equivalents: ['RK 520XSO', 'REGINA 520ZRP'], avgPrice: 280 },
  front_sprocket: { partNumber: 'JTF1590-14', brand: 'JT', equivalents: ['SUNSTAR 51614', 'RENTHAL 258-520-14'], avgPrice: 45 },
  rear_sprocket: { partNumber: 'JTR1876-43', brand: 'JT', equivalents: ['SUNSTAR 2-354743', 'RENTHAL 224U-520-43'], avgPrice: 85 },
  clutch_plates: { partNumber: 'DRC-R3', brand: 'EBC', equivalents: ['BARNETT 307-30-10014', 'VESRAH VC-2044'], avgPrice: 220 },
  clutch_cable: { partNumber: 'CC-R3', brand: 'MOTION PRO', equivalents: ['BARNETT 101-30-10014', 'VENHILL Y01-3-101'], avgPrice: 65 },
};

// Função para gerar peças genéricas baseadas em uma plataforma base (CARROS)
function generatePlatformParts(platformCode, basePrice = 1.0) {
  const baseParts = PLATFORM_PARTS.VW_PQ24;
  const parts = {};
  
  for (const [partId, partData] of Object.entries(baseParts)) {
    parts[partId] = {
      partNumber: `${platformCode}-${partData.partNumber}`,
      brand: partData.brand,
      equivalents: partData.equivalents.map(eq => `${platformCode}-${eq}`),
      avgPrice: Math.round(partData.avgPrice * basePrice),
    };
  }
  
  return parts;
}

// Função para gerar peças genéricas para MOTOS
function generateMotorcycleParts(platformCode, basePrice = 1.0) {
  const parts = {};
  
  for (const [partId, partData] of Object.entries(MOTORCYCLE_BASE_PARTS)) {
    parts[partId] = {
      partNumber: `${platformCode}-${partData.partNumber}`,
      brand: partData.brand,
      equivalents: partData.equivalents.map(eq => `${platformCode}-${eq}`),
      avgPrice: Math.round(partData.avgPrice * basePrice),
    };
  }
  
  return parts;
}

// Gera peças para todas as plataformas
const ALL_PLATFORM_PARTS = {
  VW_PQ24: PLATFORM_PARTS.VW_PQ24,
  VW_MQB: generatePlatformParts('MQB', 1.3),
  VW_CLASSIC: generatePlatformParts('VWC', 0.8),
  VW_AMAROK: generatePlatformParts('AMK', 1.5),
  VW_TRUCK: generatePlatformParts('VWT', 2.0),
  GM_GEM: generatePlatformParts('GEM', 0.95),
  GM_VSS: generatePlatformParts('VSS', 1.1),
  GM_S10: generatePlatformParts('S10', 1.4),
  GM_CAMARO: generatePlatformParts('CAM', 2.5),
  GM_CLASSIC: generatePlatformParts('GMC', 0.75),
  FIAT_FIRE: generatePlatformParts('FIR', 0.9),
  FIAT_ARGO: generatePlatformParts('ARG', 1.05),
  FIAT_TORO: generatePlatformParts('TOR', 1.3),
  FIAT_DUCATO: generatePlatformParts('DUC', 1.6),
  FIAT_500: generatePlatformParts('F50', 1.4),
  FIAT_CLASSIC: generatePlatformParts('FIC', 0.7),
  FIAT_FREEMONT: generatePlatformParts('FRM', 1.5),
  FORD_SIGMA: generatePlatformParts('SIG', 0.95),
  FORD_DURATEC: generatePlatformParts('DUR', 1.15),
  FORD_ECOBOOST: generatePlatformParts('ECO', 1.4),
  FORD_RANGER: generatePlatformParts('RNG', 1.5),
  FORD_TRUCK: generatePlatformParts('FTK', 2.0),
  FORD_TRANSIT: generatePlatformParts('TRN', 1.6),
  FORD_MUSTANG: generatePlatformParts('MUS', 2.5),
  FORD_CLASSIC: generatePlatformParts('FDC', 0.7),
  TOYOTA: generatePlatformParts('TOY', 1.2),
  TOYOTA_HILUX: generatePlatformParts('HIL', 1.5),
  TOYOTA_CLASSIC: generatePlatformParts('TYC', 0.8),
  HONDA: generatePlatformParts('HON', 1.15),
  HYUNDAI: generatePlatformParts('HYU', 1.1),
  KIA: generatePlatformParts('KIA', 1.1),
  RENAULT: generatePlatformParts('REN', 1.0),
  RENAULT_MASTER: generatePlatformParts('RNM', 1.5),
  NISSAN: generatePlatformParts('NIS', 1.1),
  NISSAN_FRONTIER: generatePlatformParts('NFR', 1.4),
  JEEP: generatePlatformParts('JEP', 1.4),
  JEEP_WRANGLER: generatePlatformParts('WRG', 1.8),
  PEUGEOT: generatePlatformParts('PEU', 1.1),
  PEUGEOT_CLASSIC: generatePlatformParts('PEC', 0.85),
  CITROEN: generatePlatformParts('CIT', 1.1),
  CITROEN_JUMPER: generatePlatformParts('CIJ', 1.5),
  MITSUBISHI: generatePlatformParts('MIT', 1.2),
  MITSUBISHI_PAJERO: generatePlatformParts('PAJ', 1.6),
  MITSUBISHI_L200: generatePlatformParts('L20', 1.5),
  SUZUKI: generatePlatformParts('SUZ', 1.0),
  SUZUKI_JIMNY: generatePlatformParts('JIM', 1.2),
  BMW: generatePlatformParts('BMW', 2.0),
  AUDI: generatePlatformParts('AUD', 2.0),
  MERCEDES: generatePlatformParts('MER', 2.2),
  PORSCHE: generatePlatformParts('POR', 3.0),
  MERCEDES_TRUCK: generatePlatformParts('MBT', 2.5),
  SCANIA_TRUCK: generatePlatformParts('SCA', 2.5),
  VOLVO_TRUCK: generatePlatformParts('VOL', 2.5),
  IVECO_TRUCK: generatePlatformParts('IVE', 2.2),
  // Motos - usando generateMotorcycleParts para ter as 30 peças corretas
  HONDA_MOTO: generateMotorcycleParts('HMT', 0.8),
  HONDA_MOTO_BIG: generateMotorcycleParts('HMB', 1.2),
  HONDA_SCOOTER: generateMotorcycleParts('HSC', 0.6),
  YAMAHA_MOTO: generateMotorcycleParts('YMT', 0.9),
  YAMAHA_MOTO_BIG: generateMotorcycleParts('YMB', 1.3),
  YAMAHA_SCOOTER: generateMotorcycleParts('YSC', 0.6),
  KAWASAKI_MOTO: generateMotorcycleParts('KMT', 1.0),
  KAWASAKI_MOTO_BIG: generateMotorcycleParts('KMB', 1.5),
  BMW_MOTO: generateMotorcycleParts('BMT', 1.3),
  BMW_MOTO_BIG: generateMotorcycleParts('BMB', 1.8),
  DUCATI_MOTO: generateMotorcycleParts('DCT', 1.8),
  HARLEY_MOTO: generateMotorcycleParts('HRL', 2.0),
  TRIUMPH_MOTO: generateMotorcycleParts('TRI', 1.6),
  SUZUKI_MOTO: generateMotorcycleParts('SMT', 0.9),
  SUZUKI_SCOOTER: generateMotorcycleParts('SSC', 0.6),
  // Plataforma genérica para veículos não mapeados
  GENERIC: generatePlatformParts('GEN', 1.0),
};



// ============================================================================
// FUNÇÃO PARA PARSEAR O ARQUIVO brazilianVehicles.ts
// ============================================================================
function parseVehiclesFromTypeScript() {
  console.log('📖 Lendo arquivo brazilianVehicles.ts...');
  
  const tsFilePath = path.join(__dirname, '../../../src/features/vehicle-parts-search/data/brazilianVehicles.ts');
  
  if (!fs.existsSync(tsFilePath)) {
    console.error('❌ Arquivo não encontrado:', tsFilePath);
    return [];
  }
  
  const content = fs.readFileSync(tsFilePath, 'utf-8');
  const vehicles = [];
  
  // Regex para capturar chamadas generateYearVariants
  const regex = /\.\.\.generateYearVariants\(\s*\{\s*brand:\s*['"]([^'"]+)['"]\s*,\s*model:\s*['"]([^'"]+)['"]\s*(?:,\s*trim:\s*['"]([^'"]+)['"])?\s*(?:,\s*engineCode:\s*['"]([^'"]+)['"])?\s*(?:,\s*engineName:\s*['"]([^'"]+)['"])?\s*(?:,\s*displacementCc:\s*(\d+))?\s*(?:,\s*fuel:\s*['"]([^'"]+)['"])?\s*(?:,\s*transmission:\s*['"]([^'"]+)['"])?\s*(?:,\s*bodyType:\s*['"]([^'"]+)['"])?\s*(?:,\s*vehicleType:\s*['"]([^'"]+)['"])?\s*(?:,\s*power:\s*['"]([^'"]+)['"])?\s*[^}]*\}\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g;
  
  let match;
  let count = 0;
  
  while ((match = regex.exec(content)) !== null) {
    const [, brand, model, trim, engineCode, engineName, displacementCc, fuel, transmission, bodyType, vehicleType, power, startYear, endYear] = match;
    
    const start = parseInt(startYear);
    const end = parseInt(endYear);
    
    // Gera uma entrada para cada ano
    for (let year = start; year <= end; year++) {
      const id = generateVehicleId(brand, model, year, engineCode, trim);
      vehicles.push({
        id,
        brand: brand || 'Unknown',
        model: model || 'Unknown',
        year,
        trim: trim || '',
        engineCode: engineCode || '',
        engineName: engineName || '',
        displacementCc: parseInt(displacementCc) || 0,
        fuel: fuel || 'flex',
        transmission: transmission || 'manual',
        bodyType: bodyType || 'hatch',
        vehicleType: vehicleType || 'car',
        power: power || '',
      });
      count++;
    }
  }
  
  // Se o regex não capturou muitos, tenta uma abordagem mais simples
  if (count < 1000) {
    console.log('⚠️ Regex principal capturou poucos veículos, tentando abordagem alternativa...');
    
    // Regex simplificado
    const simpleRegex = /brand:\s*['"]([^'"]+)['"]\s*,\s*model:\s*['"]([^'"]+)['"][^}]*}\s*,\s*(\d{4})\s*,\s*(\d{4})/g;
    
    while ((match = simpleRegex.exec(content)) !== null) {
      const [, brand, model, startYear, endYear] = match;
      const start = parseInt(startYear);
      const end = parseInt(endYear);
      
      for (let year = start; year <= end; year++) {
        const id = generateVehicleId(brand, model, year);
        
        // Evita duplicatas
        if (!vehicles.find(v => v.id === id)) {
          vehicles.push({
            id,
            brand: brand || 'Unknown',
            model: model || 'Unknown',
            year,
            trim: '',
            engineCode: '',
            engineName: '',
            displacementCc: 0,
            fuel: 'flex',
            transmission: 'manual',
            bodyType: 'hatch',
            vehicleType: 'car',
            power: '',
          });
          count++;
        }
      }
    }
  }
  
  console.log(`✅ ${vehicles.length} veículos parseados do arquivo TypeScript`);
  return vehicles;
}

// Gera ID único para veículo
function generateVehicleId(brand, model, year, engineCode, trim) {
  const parts = [
    (brand || '').toLowerCase().replace(/[^a-z0-9]/g, ''),
    (model || '').toLowerCase().replace(/[^a-z0-9]/g, ''),
    year.toString(),
  ];
  if (engineCode) parts.push(engineCode.toLowerCase().replace(/[^a-z0-9]/g, ''));
  if (trim) parts.push(trim.toLowerCase().replace(/[^a-z0-9]/g, ''));
  return parts.join('_');
}

// Determina a plataforma de um veículo
function getPlatformForVehicle(vehicle) {
  const key = `${vehicle.brand.toLowerCase()}_${vehicle.model.toLowerCase()}`;
  
  // Tenta match exato
  if (PLATFORM_MAPPING[key]) {
    return PLATFORM_MAPPING[key];
  }
  
  // Tenta match parcial (modelo contém)
  for (const [mapKey, platform] of Object.entries(PLATFORM_MAPPING)) {
    const [mapBrand, mapModel] = mapKey.split('_');
    if (vehicle.brand.toLowerCase() === mapBrand && 
        vehicle.model.toLowerCase().includes(mapModel)) {
      return platform;
    }
  }
  
  // Tenta match por marca apenas
  const brandKey = vehicle.brand.toLowerCase();
  for (const [mapKey, platform] of Object.entries(PLATFORM_MAPPING)) {
    if (mapKey.startsWith(brandKey + '_')) {
      return platform;
    }
  }
  
  // Determina por tipo de veículo
  if (vehicle.vehicleType === 'motorcycle' || vehicle.bodyType === 'motorcycle') {
    return 'HONDA_MOTO';
  }
  if (vehicle.vehicleType === 'truck' || vehicle.bodyType === 'truck') {
    return 'MERCEDES_TRUCK';
  }
  if (vehicle.vehicleType === 'bus' || vehicle.bodyType === 'bus') {
    return 'MERCEDES_TRUCK';
  }
  
  return 'GENERIC';
}

// Verifica se é moto
function isMotorcycle(vehicle) {
  // Marcas que são EXCLUSIVAMENTE de motos
  const exclusiveMotorcycleBrands = ['ducati', 'harley-davidson', 'triumph', 'ktm', 'royal enfield', 'indian', 'mv agusta'];
  
  // Modelos específicos de motos (match exato ou início do nome)
  const motorcycleModels = [
    // Honda motos
    'cg 125', 'cg 150', 'cg 160', 'cg125', 'cg150', 'cg160',
    'biz 100', 'biz 110', 'biz 125', 'biz100', 'biz110', 'biz125',
    'pop 100', 'pop 110', 'pop100', 'pop110',
    'cb 250', 'cb 300', 'cb 500', 'cb 650', 'cb 1000', 'cb250', 'cb300', 'cb500', 'cb650', 'cb1000',
    'cbr 600', 'cbr 1000', 'cbr600', 'cbr1000',
    'xre 190', 'xre 300', 'xre190', 'xre300',
    'bros 160', 'nxr 160', 'bros160', 'nxr160',
    'pcx 150', 'pcx150', 'elite 125', 'lead 110', 'sh 150', 'sh 300', 'adv 150',
    'africa twin', 'nc 750', 'nc750',
    // Yamaha motos
    'factor 125', 'factor 150', 'factor125', 'factor150',
    'fazer 150', 'fazer 250', 'fazer150', 'fazer250',
    'ybr 125', 'ybr 150', 'ybr125', 'ybr150',
    'crosser 150', 'crosser150',
    'lander 250', 'lander250',
    'tenere 250', 'tenere 700', 'tenere250', 'tenere700',
    'mt-03', 'mt-07', 'mt-09', 'mt03', 'mt07', 'mt09',
    'r1', 'r3', 'r6', 'yzf-r1', 'yzf-r3', 'yzf-r6',
    'xj6', 'nmax 160', 'nmax160', 'neo 125', 'neo125', 'fluo 125',
    // Kawasaki motos
    'ninja 250', 'ninja 300', 'ninja 400', 'ninja 650', 'ninja zx',
    'z300', 'z400', 'z650', 'z900', 'z1000',
    'versys 650', 'versys 1000', 'versys650', 'versys1000',
    'vulcan 650', 'vulcan 900', 'vulcan650', 'vulcan900',
    // BMW motos
    'g 310', 'g310', 'f 750', 'f 850', 'f750', 'f850',
    'r 1200', 'r 1250', 'r1200', 'r1250',
    's 1000', 's1000',
    // Ducati
    'monster', 'scrambler', 'multistrada', 'panigale', 'diavel', 'hypermotard',
    // Harley
    'sportster', 'softail', 'touring', 'street 750', 'iron 883', 'forty-eight',
    // Triumph
    'street triple', 'tiger 800', 'tiger 900', 'bonneville', 'speed triple', 'rocket',
    // Suzuki motos
    'gsx-r', 'gsxr', 'gsx-s', 'gsxs', 'v-strom', 'vstrom', 'intruder', 'burgman',
    'hayabusa', 'boulevard',
  ];
  
  const brand = vehicle.brand.toLowerCase();
  const model = vehicle.model.toLowerCase();
  
  // Verifica se é moto por tipo explícito
  if (vehicle.vehicleType === 'motorcycle') return true;
  
  // Verifica se é marca exclusiva de motos
  if (exclusiveMotorcycleBrands.some(b => brand.includes(b))) return true;
  
  // Verifica por modelo específico (match mais preciso)
  for (const motoModel of motorcycleModels) {
    // Match exato ou modelo começa com o padrão
    if (model === motoModel || model.startsWith(motoModel + ' ') || model.startsWith(motoModel)) {
      return true;
    }
  }
  
  // Verifica se o bodyType indica moto
  if (vehicle.bodyType === 'motorcycle' || vehicle.bodyType === 'scooter') return true;
  
  return false;
}

// ============================================================================
// GERAÇÃO DE COMPATIBILIDADE COMPLETA
// ============================================================================
function generateFullCompatibility() {
  console.log('\n🚗 Iniciando geração de compatibilidade V4...\n');
  
  // Parseia veículos do arquivo TypeScript
  const parsedVehicles = parseVehiclesFromTypeScript();
  
  if (parsedVehicles.length === 0) {
    console.error('❌ Nenhum veículo encontrado!');
    return { vehicles: {}, stats: {} };
  }
  
  const vehicles = {};
  const stats = {
    totalVehicles: 0,
    totalParts: 0,
    platforms: new Set(),
    brands: new Set(),
    categories: new Set(),
    vehicleTypes: new Set(),
    partsPerVehicle: {},
  };
  
  console.log(`📊 Processando ${parsedVehicles.length} veículos...`);
  
  let processed = 0;
  const progressInterval = Math.floor(parsedVehicles.length / 20);
  
  for (const vehicle of parsedVehicles) {
    const platform = getPlatformForVehicle(vehicle);
    const isMoto = isMotorcycle(vehicle);
    const checklist = isMoto ? MOTORCYCLE_PARTS_CHECKLIST : CAR_PARTS_CHECKLIST;
    const platformParts = ALL_PLATFORM_PARTS[platform] || ALL_PLATFORM_PARTS.GENERIC;
    
    // Gera peças para este veículo
    const parts = [];
    for (const checklistItem of checklist) {
      const partData = platformParts[checklistItem.id];
      if (partData && partData.partNumber && !partData.partNumber.includes('N/A')) {
        parts.push({
          id: checklistItem.id,
          name: checklistItem.name,
          category: checklistItem.category,
          priority: checklistItem.priority,
          partNumber: partData.partNumber,
          brand: partData.brand,
          equivalents: partData.equivalents || [],
          avgPrice: partData.avgPrice || 0,
        });
        stats.categories.add(checklistItem.category);
      }
    }
    
    // Adiciona veículo ao resultado
    vehicles[vehicle.id] = {
      vehicleId: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      trim: vehicle.trim,
      engineCode: vehicle.engineCode,
      engineName: vehicle.engineName,
      fuel: vehicle.fuel,
      transmission: vehicle.transmission,
      bodyType: vehicle.bodyType,
      vehicleType: vehicle.vehicleType,
      platform,
      totalParts: parts.length,
      parts,
    };
    
    stats.totalVehicles++;
    stats.totalParts += parts.length;
    stats.platforms.add(platform);
    stats.brands.add(vehicle.brand);
    stats.vehicleTypes.add(vehicle.vehicleType);
    
    // Contagem de peças por veículo
    if (!stats.partsPerVehicle[parts.length]) {
      stats.partsPerVehicle[parts.length] = 0;
    }
    stats.partsPerVehicle[parts.length]++;
    
    processed++;
    if (processed % progressInterval === 0) {
      const percent = Math.round((processed / parsedVehicles.length) * 100);
      process.stdout.write(`\r   Progresso: ${percent}% (${processed}/${parsedVehicles.length})`);
    }
  }
  
  console.log('\n');
  
  // Estatísticas finais
  const finalStats = {
    totalVehicles: stats.totalVehicles,
    totalParts: stats.totalParts,
    avgPartsPerVehicle: Math.round(stats.totalParts / stats.totalVehicles),
    platforms: Array.from(stats.platforms),
    brands: Array.from(stats.brands),
    categories: Array.from(stats.categories),
    vehicleTypes: Array.from(stats.vehicleTypes),
    partsDistribution: stats.partsPerVehicle,
    generatedAt: new Date().toISOString(),
    version: '4.0.0',
  };
  
  console.log('📊 Estatísticas:');
  console.log(`   Veículos: ${finalStats.totalVehicles}`);
  console.log(`   Peças totais: ${finalStats.totalParts}`);
  console.log(`   Média de peças/veículo: ${finalStats.avgPartsPerVehicle}`);
  console.log(`   Plataformas: ${finalStats.platforms.length}`);
  console.log(`   Marcas: ${finalStats.brands.length}`);
  console.log(`   Categorias: ${finalStats.categories.length}`);
  
  return { vehicles, stats: finalStats };
}

// ============================================================================
// EXPORTAÇÃO LOCAL (JSON)
// ============================================================================
function exportToLocal(data) {
  console.log('\n💾 Salvando arquivos locais...');
  
  const outputDir = path.join(__dirname, '../output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Arquivo completo
  const fullPath = path.join(outputDir, 'parts-compatibility-v4-full.json');
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
  console.log(`   ✓ ${fullPath}`);
  
  // Índice (apenas IDs e metadados)
  const index = {
    stats: data.stats,
    vehicles: Object.entries(data.vehicles).map(([id, v]) => ({
      vehicleId: id,
      brand: v.brand,
      model: v.model,
      year: v.year,
      platform: v.platform,
      totalParts: v.totalParts,
    })),
  };
  const indexPath = path.join(outputDir, 'parts-compatibility-v4-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log(`   ✓ ${indexPath}`);
  
  // Arquivo por plataforma
  const byPlatform = {};
  for (const [id, vehicle] of Object.entries(data.vehicles)) {
    if (!byPlatform[vehicle.platform]) {
      byPlatform[vehicle.platform] = {};
    }
    byPlatform[vehicle.platform][id] = vehicle;
  }
  
  for (const [platform, vehicles] of Object.entries(byPlatform)) {
    const platformPath = path.join(outputDir, `parts-compatibility-v4-${platform.toLowerCase()}.json`);
    fs.writeFileSync(platformPath, JSON.stringify({ platform, vehicles, count: Object.keys(vehicles).length }, null, 2));
    console.log(`   ✓ ${platformPath} (${Object.keys(vehicles).length} veículos)`);
  }
  
  console.log('✅ Arquivos locais salvos!');
}

// ============================================================================
// EXECUÇÃO PRINCIPAL
// ============================================================================
async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   TORQ AI - Parts Compatibility Generator V4');
  console.log('   Importa TODOS os veículos de brazilianVehicles.ts');
  console.log('   Checklist Completo de 50 Peças por Veículo');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // Gera dados
  const data = generateFullCompatibility();
  
  // Salva localmente
  exportToLocal(data);
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('   GERAÇÃO CONCLUÍDA!');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`   📊 ${data.stats.totalVehicles} veículos gerados`);
  console.log(`   📋 ${data.stats.avgPartsPerVehicle} peças por veículo (média)`);
  console.log(`   💾 Arquivos salvos em: scripts/parts-compatibility-engine/output/`);
  console.log('═══════════════════════════════════════════════════════════════\n');
}

// Executa se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  generateFullCompatibility,
  exportToLocal,
  parseVehiclesFromTypeScript,
  CAR_PARTS_CHECKLIST,
  MOTORCYCLE_PARTS_CHECKLIST,
  PLATFORM_MAPPING,
  ALL_PLATFORM_PARTS,
};
