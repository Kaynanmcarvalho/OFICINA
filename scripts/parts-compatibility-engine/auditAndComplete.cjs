/**
 * AUDITORIA E COMPLEMENTAÇÃO COMPLETA DE VEÍCULOS BRASILEIROS
 * Verifica o que está faltando e adiciona automaticamente
 * @version 2.0.0
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

console.log(`
${colors.cyan}═══════════════════════════════════════════════════════════════
   AUDITORIA E COMPLEMENTAÇÃO COMPLETA
   Verifica e adiciona TODOS os veículos faltantes
═══════════════════════════════════════════════════════════════${colors.reset}
`);

// ============================================================================
// CHECKLIST DE 50 PEÇAS PARA CARROS
// ============================================================================
const CAR_PARTS = [
  { id: 'oil_filter', name: 'Filtro de Óleo', category: 'Filtros', priority: 'alta' },
  { id: 'air_filter', name: 'Filtro de Ar do Motor', category: 'Filtros', priority: 'alta' },
  { id: 'cabin_filter', name: 'Filtro de Ar Condicionado', category: 'Filtros', priority: 'média' },
  { id: 'fuel_filter', name: 'Filtro de Combustível', category: 'Filtros', priority: 'alta' },
  { id: 'transmission_filter', name: 'Filtro de Transmissão', category: 'Filtros', priority: 'média' },
  { id: 'front_brake_pads', name: 'Pastilha de Freio Dianteira', category: 'Freios', priority: 'alta' },
  { id: 'rear_brake_pads', name: 'Pastilha de Freio Traseira', category: 'Freios', priority: 'alta' },
  { id: 'front_brake_disc', name: 'Disco de Freio Dianteiro', category: 'Freios', priority: 'alta' },
  { id: 'rear_brake_disc', name: 'Disco de Freio Traseiro', category: 'Freios', priority: 'alta' },
  { id: 'brake_fluid', name: 'Fluido de Freio DOT4', category: 'Freios', priority: 'alta' },
  { id: 'brake_hose_front', name: 'Flexível de Freio Dianteiro', category: 'Freios', priority: 'média' },
  { id: 'brake_hose_rear', name: 'Flexível de Freio Traseiro', category: 'Freios', priority: 'média' },
  { id: 'handbrake_cable', name: 'Cabo de Freio de Mão', category: 'Freios', priority: 'média' },
  { id: 'spark_plugs', name: 'Vela de Ignição', category: 'Ignição', priority: 'alta' },
  { id: 'ignition_coil', name: 'Bobina de Ignição', category: 'Ignição', priority: 'alta' },
  { id: 'spark_plug_wires', name: 'Cabo de Vela', category: 'Ignição', priority: 'média' },
  { id: 'distributor_cap', name: 'Tampa do Distribuidor', category: 'Ignição', priority: 'baixa' },
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
  { id: 'battery', name: 'Bateria', category: 'Elétrica', priority: 'alta' },
  { id: 'alternator', name: 'Alternador', category: 'Elétrica', priority: 'alta' },
  { id: 'starter_motor', name: 'Motor de Arranque', category: 'Elétrica', priority: 'alta' },
  { id: 'headlight_bulb', name: 'Lâmpada do Farol', category: 'Elétrica', priority: 'média' },
  { id: 'brake_light_bulb', name: 'Lâmpada de Freio', category: 'Elétrica', priority: 'média' },
  { id: 'fuse_kit', name: 'Kit de Fusíveis', category: 'Elétrica', priority: 'baixa' },
  { id: 'clutch_kit', name: 'Kit de Embreagem', category: 'Transmissão', priority: 'alta' },
  { id: 'clutch_cable', name: 'Cabo de Embreagem', category: 'Transmissão', priority: 'média' },
  { id: 'transmission_oil', name: 'Óleo de Câmbio', category: 'Transmissão', priority: 'alta' },
  { id: 'cv_joint', name: 'Junta Homocinética', category: 'Transmissão', priority: 'alta' },
  { id: 'front_wheel_bearing', name: 'Rolamento de Roda Dianteiro', category: 'Rolamentos', priority: 'alta' },
  { id: 'rear_wheel_bearing', name: 'Rolamento de Roda Traseiro', category: 'Rolamentos', priority: 'alta' },
  { id: 'clutch_bearing', name: 'Rolamento de Embreagem', category: 'Rolamentos', priority: 'alta' },
];

// ============================================================================
// CHECKLIST DE 30 PEÇAS PARA MOTOS
// ============================================================================
const MOTO_PARTS = [
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
// CHECKLIST DE 40 PEÇAS PARA CAMINHÕES
// ============================================================================
const TRUCK_PARTS = [
  { id: 'oil_filter', name: 'Filtro de Óleo', category: 'Filtros', priority: 'alta' },
  { id: 'air_filter', name: 'Filtro de Ar do Motor', category: 'Filtros', priority: 'alta' },
  { id: 'fuel_filter', name: 'Filtro de Combustível', category: 'Filtros', priority: 'alta' },
  { id: 'fuel_water_separator', name: 'Separador de Água', category: 'Filtros', priority: 'alta' },
  { id: 'cabin_filter', name: 'Filtro de Cabine', category: 'Filtros', priority: 'média' },
  { id: 'hydraulic_filter', name: 'Filtro Hidráulico', category: 'Filtros', priority: 'alta' },
  { id: 'front_brake_pads', name: 'Pastilha de Freio Dianteira', category: 'Freios', priority: 'alta' },
  { id: 'rear_brake_pads', name: 'Pastilha de Freio Traseira', category: 'Freios', priority: 'alta' },
  { id: 'brake_drum', name: 'Tambor de Freio', category: 'Freios', priority: 'alta' },
  { id: 'brake_shoe', name: 'Lona de Freio', category: 'Freios', priority: 'alta' },
  { id: 'air_dryer', name: 'Secador de Ar', category: 'Freios', priority: 'alta' },
  { id: 'brake_valve', name: 'Válvula de Freio', category: 'Freios', priority: 'alta' },
  { id: 'front_shock', name: 'Amortecedor Dianteiro', category: 'Suspensão', priority: 'alta' },
  { id: 'rear_shock', name: 'Amortecedor Traseiro', category: 'Suspensão', priority: 'alta' },
  { id: 'leaf_spring', name: 'Feixe de Molas', category: 'Suspensão', priority: 'alta' },
  { id: 'air_bag_suspension', name: 'Bolsa de Ar', category: 'Suspensão', priority: 'alta' },
  { id: 'king_pin', name: 'Pino Rei', category: 'Suspensão', priority: 'alta' },
  { id: 'tie_rod', name: 'Barra de Direção', category: 'Suspensão', priority: 'alta' },
  { id: 'engine_oil', name: 'Óleo do Motor 15W40', category: 'Motor', priority: 'alta' },
  { id: 'coolant', name: 'Fluido de Arrefecimento', category: 'Motor', priority: 'alta' },
  { id: 'turbo', name: 'Turbina', category: 'Motor', priority: 'alta' },
  { id: 'injector', name: 'Bico Injetor', category: 'Motor', priority: 'alta' },
  { id: 'injection_pump', name: 'Bomba Injetora', category: 'Motor', priority: 'alta' },
  { id: 'water_pump', name: 'Bomba D\'Água', category: 'Motor', priority: 'alta' },
  { id: 'thermostat', name: 'Válvula Termostática', category: 'Motor', priority: 'alta' },
  { id: 'fan_belt', name: 'Correia do Ventilador', category: 'Motor', priority: 'alta' },
  { id: 'battery', name: 'Bateria', category: 'Elétrica', priority: 'alta' },
  { id: 'alternator', name: 'Alternador', category: 'Elétrica', priority: 'alta' },
  { id: 'starter_motor', name: 'Motor de Arranque', category: 'Elétrica', priority: 'alta' },
  { id: 'headlight', name: 'Farol', category: 'Elétrica', priority: 'média' },
  { id: 'clutch_kit', name: 'Kit de Embreagem', category: 'Transmissão', priority: 'alta' },
  { id: 'clutch_servo', name: 'Servo Embreagem', category: 'Transmissão', priority: 'alta' },
  { id: 'gearbox_oil', name: 'Óleo de Câmbio', category: 'Transmissão', priority: 'alta' },
  { id: 'differential_oil', name: 'Óleo de Diferencial', category: 'Transmissão', priority: 'alta' },
  { id: 'u_joint', name: 'Cruzeta', category: 'Transmissão', priority: 'alta' },
  { id: 'wheel_bearing', name: 'Rolamento de Roda', category: 'Rolamentos', priority: 'alta' },
  { id: 'hub_seal', name: 'Retentor de Cubo', category: 'Rolamentos', priority: 'alta' },
  { id: 'fifth_wheel', name: 'Quinta Roda', category: 'Acoplamento', priority: 'alta' },
  { id: 'air_hose', name: 'Mangueira de Ar', category: 'Acoplamento', priority: 'média' },
  { id: 'electrical_connector', name: 'Conector Elétrico', category: 'Acoplamento', priority: 'média' },
];


// ============================================================================
// VEÍCULOS FALTANTES - MARCAS QUE NÃO ESTÃO NO SISTEMA
// ============================================================================
const MISSING_VEHICLES = {
  // MARCAS PREMIUM FALTANTES
  jaguar: {
    'XE': { years: [2015, 2024], engines: ['2.0 Turbo'], type: 'car' },
    'XF': { years: [2008, 2024], engines: ['2.0 Turbo', '3.0 V6'], type: 'car' },
    'F-Pace': { years: [2016, 2024], engines: ['2.0 Turbo', '3.0 V6'], type: 'suv' },
    'E-Pace': { years: [2018, 2024], engines: ['2.0 Turbo'], type: 'suv' },
    'F-Type': { years: [2013, 2024], engines: ['2.0 Turbo', '3.0 V6', '5.0 V8'], type: 'car' },
  },
  lexus: {
    'ES': { years: [2013, 2024], engines: ['2.5 Hybrid', '3.5 V6'], type: 'car' },
    'IS': { years: [2013, 2024], engines: ['2.0 Turbo', '3.5 V6'], type: 'car' },
    'NX': { years: [2015, 2024], engines: ['2.0 Turbo', '2.5 Hybrid'], type: 'suv' },
    'RX': { years: [2009, 2024], engines: ['3.5 V6', '3.5 Hybrid'], type: 'suv' },
    'UX': { years: [2019, 2024], engines: ['2.0 Hybrid'], type: 'suv' },
    'LX': { years: [2008, 2024], engines: ['5.7 V8'], type: 'suv' },
  },
  mini: {
    'Cooper': { years: [2001, 2024], engines: ['1.5 Turbo', '2.0 Turbo'], type: 'car' },
    'Cooper S': { years: [2002, 2024], engines: ['2.0 Turbo'], type: 'car' },
    'Countryman': { years: [2011, 2024], engines: ['1.5 Turbo', '2.0 Turbo'], type: 'suv' },
    'Clubman': { years: [2008, 2024], engines: ['1.5 Turbo', '2.0 Turbo'], type: 'car' },
  },
  'alfa romeo': {
    'Giulia': { years: [2017, 2024], engines: ['2.0 Turbo', '2.9 V6'], type: 'car' },
    'Stelvio': { years: [2017, 2024], engines: ['2.0 Turbo', '2.9 V6'], type: 'suv' },
  },
  maserati: {
    'Ghibli': { years: [2014, 2024], engines: ['3.0 V6 Turbo'], type: 'car' },
    'Quattroporte': { years: [2013, 2024], engines: ['3.0 V6 Turbo', '3.8 V8'], type: 'car' },
    'Levante': { years: [2016, 2024], engines: ['3.0 V6 Turbo', '3.8 V8'], type: 'suv' },
    'GranTurismo': { years: [2018, 2024], engines: ['4.7 V8'], type: 'car' },
  },
  ferrari: {
    '488': { years: [2015, 2020], engines: ['3.9 V8 Turbo'], type: 'car' },
    'F8': { years: [2019, 2024], engines: ['3.9 V8 Turbo'], type: 'car' },
    'Roma': { years: [2020, 2024], engines: ['3.9 V8 Turbo'], type: 'car' },
    'Portofino': { years: [2018, 2024], engines: ['3.9 V8 Turbo'], type: 'car' },
    '812': { years: [2017, 2024], engines: ['6.5 V12'], type: 'car' },
    'SF90': { years: [2020, 2024], engines: ['4.0 V8 Hybrid'], type: 'car' },
    'Purosangue': { years: [2023, 2024], engines: ['6.5 V12'], type: 'suv' },
  },
  lamborghini: {
    'Huracan': { years: [2014, 2024], engines: ['5.2 V10'], type: 'car' },
    'Aventador': { years: [2011, 2022], engines: ['6.5 V12'], type: 'car' },
    'Urus': { years: [2018, 2024], engines: ['4.0 V8 Turbo'], type: 'suv' },
    'Revuelto': { years: [2024, 2024], engines: ['6.5 V12 Hybrid'], type: 'car' },
  },

  // MARCAS CHINESAS
  chery: {
    'Tiggo 2': { years: [2018, 2024], engines: ['1.5 16V'], type: 'suv' },
    'Tiggo 3X': { years: [2019, 2024], engines: ['1.0 Turbo'], type: 'suv' },
    'Tiggo 4': { years: [2019, 2024], engines: ['1.5 Turbo'], type: 'suv' },
    'Tiggo 5X': { years: [2019, 2024], engines: ['1.5 Turbo'], type: 'suv' },
    'Tiggo 7': { years: [2019, 2024], engines: ['1.5 Turbo'], type: 'suv' },
    'Tiggo 8': { years: [2020, 2024], engines: ['1.6 Turbo'], type: 'suv' },
    'Arrizo 5': { years: [2019, 2022], engines: ['1.5 16V'], type: 'car' },
    'Arrizo 6': { years: [2020, 2024], engines: ['1.5 Turbo'], type: 'car' },
    'QQ': { years: [2009, 2015], engines: ['1.0 8V'], type: 'car' },
    'Celer': { years: [2013, 2016], engines: ['1.5 16V'], type: 'car' },
  },
  jac: {
    'T40': { years: [2018, 2024], engines: ['1.5 16V', '1.6 16V'], type: 'suv' },
    'T50': { years: [2019, 2024], engines: ['1.5 Turbo'], type: 'suv' },
    'T60': { years: [2019, 2024], engines: ['2.0 Turbo'], type: 'suv' },
    'T80': { years: [2019, 2024], engines: ['2.0 Turbo'], type: 'suv' },
    'J3': { years: [2011, 2016], engines: ['1.4 16V'], type: 'car' },
    'J5': { years: [2012, 2016], engines: ['1.5 16V'], type: 'car' },
    'J6': { years: [2012, 2016], engines: ['2.0 16V'], type: 'car' },
    'iEV40': { years: [2020, 2024], engines: ['Elétrico'], type: 'car' },
    'iEV60': { years: [2021, 2024], engines: ['Elétrico'], type: 'suv' },
  },
  byd: {
    'Song Plus': { years: [2022, 2024], engines: ['1.5 Hybrid', 'Elétrico'], type: 'suv' },
    'Yuan Plus': { years: [2023, 2024], engines: ['Elétrico'], type: 'suv' },
    'Tan': { years: [2023, 2024], engines: ['Elétrico'], type: 'suv' },
    'Han': { years: [2023, 2024], engines: ['Elétrico'], type: 'car' },
    'Dolphin': { years: [2023, 2024], engines: ['Elétrico'], type: 'car' },
    'Seal': { years: [2024, 2024], engines: ['Elétrico'], type: 'car' },
    'Atto 3': { years: [2023, 2024], engines: ['Elétrico'], type: 'suv' },
  },
  gwm: {
    'Haval H6': { years: [2022, 2024], engines: ['1.5 Turbo', '2.0 Turbo'], type: 'suv' },
    'Haval H6 GT': { years: [2023, 2024], engines: ['2.0 Turbo'], type: 'suv' },
    'Ora 03': { years: [2023, 2024], engines: ['Elétrico'], type: 'car' },
  },

  // AMERICANAS FALTANTES
  ram: {
    '1500': { years: [2019, 2024], engines: ['3.6 V6', '5.7 V8 Hemi'], type: 'pickup' },
    '2500': { years: [2019, 2024], engines: ['6.7 Turbo Diesel'], type: 'pickup' },
    '3500': { years: [2020, 2024], engines: ['6.7 Turbo Diesel'], type: 'pickup' },
    'Rampage': { years: [2024, 2024], engines: ['2.0 Turbo'], type: 'pickup' },
  },
  dodge: {
    'Journey': { years: [2009, 2020], engines: ['2.7 V6', '3.6 V6'], type: 'suv' },
    'Durango': { years: [2012, 2024], engines: ['3.6 V6', '5.7 V8', '6.4 V8'], type: 'suv' },
    'Challenger': { years: [2010, 2024], engines: ['3.6 V6', '5.7 V8', '6.4 V8'], type: 'car' },
    'Charger': { years: [2011, 2024], engines: ['3.6 V6', '5.7 V8', '6.4 V8'], type: 'car' },
  },
  chrysler: {
    '300C': { years: [2005, 2023], engines: ['3.6 V6', '5.7 V8'], type: 'car' },
    'Town & Country': { years: [2008, 2016], engines: ['3.6 V6'], type: 'van' },
    'Pacifica': { years: [2017, 2024], engines: ['3.6 V6', '3.6 Hybrid'], type: 'van' },
  },
  // OUTRAS FALTANTES
  subaru: {
    'Impreza': { years: [2008, 2024], engines: ['2.0 16V'], type: 'car' },
    'WRX': { years: [2015, 2024], engines: ['2.0 Turbo', '2.4 Turbo'], type: 'car' },
    'Forester': { years: [2008, 2024], engines: ['2.0 16V', '2.5 16V'], type: 'suv' },
    'XV': { years: [2012, 2024], engines: ['2.0 16V'], type: 'suv' },
    'Outback': { years: [2010, 2024], engines: ['2.5 16V', '3.6 H6'], type: 'car' },
    'BRZ': { years: [2013, 2024], engines: ['2.0 16V', '2.4 16V'], type: 'car' },
  },
  ssangyong: {
    'Korando': { years: [2011, 2024], engines: ['2.0 Turbo Diesel'], type: 'suv' },
    'Rexton': { years: [2007, 2024], engines: ['2.2 Turbo Diesel'], type: 'suv' },
    'Tivoli': { years: [2016, 2024], engines: ['1.6 16V', '1.6 Turbo Diesel'], type: 'suv' },
    'Actyon': { years: [2007, 2018], engines: ['2.0 Turbo Diesel'], type: 'suv' },
  },
  troller: {
    'T4': { years: [2001, 2024], engines: ['3.2 Turbo Diesel'], type: 'suv' },
  },

  // MOTOS FALTANTES
  ktm: {
    'Duke 200': { years: [2012, 2024], engines: ['199.5cc'], type: 'motorcycle' },
    'Duke 390': { years: [2013, 2024], engines: ['373cc'], type: 'motorcycle' },
    'Duke 790': { years: [2018, 2024], engines: ['799cc'], type: 'motorcycle' },
    'Duke 890': { years: [2020, 2024], engines: ['889cc'], type: 'motorcycle' },
    'Duke 1290': { years: [2014, 2024], engines: ['1301cc'], type: 'motorcycle' },
    'RC 390': { years: [2014, 2024], engines: ['373cc'], type: 'motorcycle' },
    'Adventure 390': { years: [2020, 2024], engines: ['373cc'], type: 'motorcycle' },
    'Adventure 890': { years: [2021, 2024], engines: ['889cc'], type: 'motorcycle' },
    'Adventure 1290': { years: [2015, 2024], engines: ['1301cc'], type: 'motorcycle' },
  },
  'royal enfield': {
    'Classic 350': { years: [2015, 2024], engines: ['349cc'], type: 'motorcycle' },
    'Meteor 350': { years: [2021, 2024], engines: ['349cc'], type: 'motorcycle' },
    'Himalayan': { years: [2016, 2024], engines: ['411cc'], type: 'motorcycle' },
    'Continental GT': { years: [2018, 2024], engines: ['648cc'], type: 'motorcycle' },
    'Interceptor 650': { years: [2018, 2024], engines: ['648cc'], type: 'motorcycle' },
    'Super Meteor 650': { years: [2023, 2024], engines: ['648cc'], type: 'motorcycle' },
    'Hunter 350': { years: [2022, 2024], engines: ['349cc'], type: 'motorcycle' },
    'Scram 411': { years: [2022, 2024], engines: ['411cc'], type: 'motorcycle' },
  },
  dafra: {
    'Apache 150': { years: [2010, 2024], engines: ['149cc'], type: 'motorcycle' },
    'Apache 200': { years: [2016, 2024], engines: ['197cc'], type: 'motorcycle' },
    'Next 250': { years: [2013, 2024], engines: ['249cc'], type: 'motorcycle' },
    'Citycom 300': { years: [2009, 2024], engines: ['278cc'], type: 'motorcycle' },
    'Maxsym 400': { years: [2014, 2024], engines: ['399cc'], type: 'motorcycle' },
    'Horizon 150': { years: [2015, 2024], engines: ['149cc'], type: 'motorcycle' },
    'Riva 150': { years: [2012, 2024], engines: ['149cc'], type: 'motorcycle' },
    'Speed 150': { years: [2010, 2024], engines: ['149cc'], type: 'motorcycle' },
    'Kansas 150': { years: [2008, 2024], engines: ['149cc'], type: 'motorcycle' },
  },
  shineray: {
    'XY 50Q': { years: [2010, 2024], engines: ['49cc'], type: 'motorcycle' },
    'XY 150-5': { years: [2012, 2024], engines: ['149cc'], type: 'motorcycle' },
    'XY 200': { years: [2014, 2024], engines: ['196cc'], type: 'motorcycle' },
    'Phoenix 50': { years: [2015, 2024], engines: ['49cc'], type: 'motorcycle' },
    'Worker 125': { years: [2016, 2024], engines: ['124cc'], type: 'motorcycle' },
  },
  haojue: {
    'DR 160': { years: [2018, 2024], engines: ['162cc'], type: 'motorcycle' },
    'DK 150': { years: [2019, 2024], engines: ['149cc'], type: 'motorcycle' },
    'NK 150': { years: [2020, 2024], engines: ['149cc'], type: 'motorcycle' },
    'VR 150': { years: [2021, 2024], engines: ['149cc'], type: 'motorcycle' },
    'Chopper Road 150': { years: [2019, 2024], engines: ['149cc'], type: 'motorcycle' },
    'Lindy 125': { years: [2020, 2024], engines: ['124cc'], type: 'motorcycle' },
  },

  // CAMINHÕES FALTANTES
  scania: {
    'P 250': { years: [2010, 2024], engines: ['9.0 Diesel'], type: 'truck' },
    'P 310': { years: [2010, 2024], engines: ['9.0 Diesel'], type: 'truck' },
    'P 360': { years: [2012, 2024], engines: ['13.0 Diesel'], type: 'truck' },
    'G 360': { years: [2010, 2024], engines: ['13.0 Diesel'], type: 'truck' },
    'G 410': { years: [2012, 2024], engines: ['13.0 Diesel'], type: 'truck' },
    'G 450': { years: [2014, 2024], engines: ['13.0 Diesel'], type: 'truck' },
    'G 500': { years: [2016, 2024], engines: ['16.4 Diesel'], type: 'truck' },
    'R 410': { years: [2010, 2024], engines: ['13.0 Diesel'], type: 'truck' },
    'R 450': { years: [2012, 2024], engines: ['13.0 Diesel'], type: 'truck' },
    'R 500': { years: [2014, 2024], engines: ['16.4 Diesel'], type: 'truck' },
    'R 540': { years: [2016, 2024], engines: ['16.4 Diesel'], type: 'truck' },
    'R 620': { years: [2008, 2020], engines: ['16.4 Diesel'], type: 'truck' },
    'S 500': { years: [2017, 2024], engines: ['16.4 Diesel'], type: 'truck' },
    'S 540': { years: [2018, 2024], engines: ['16.4 Diesel'], type: 'truck' },
  },
  'vw-truck': {
    'Delivery 6.160': { years: [2018, 2024], engines: ['3.0 Diesel'], type: 'truck' },
    'Delivery 9.170': { years: [2012, 2024], engines: ['3.8 Diesel'], type: 'truck' },
    'Delivery 11.180': { years: [2012, 2024], engines: ['4.8 Diesel'], type: 'truck' },
    'Delivery 13.180': { years: [2015, 2024], engines: ['4.8 Diesel'], type: 'truck' },
    'Constellation 17.190': { years: [2012, 2024], engines: ['4.8 Diesel'], type: 'truck' },
    'Constellation 17.280': { years: [2012, 2024], engines: ['6.9 Diesel'], type: 'truck' },
    'Constellation 19.320': { years: [2010, 2024], engines: ['8.9 Diesel'], type: 'truck' },
    'Constellation 24.280': { years: [2012, 2024], engines: ['6.9 Diesel'], type: 'truck' },
    'Constellation 25.420': { years: [2014, 2024], engines: ['10.5 Diesel'], type: 'truck' },
    'Constellation 26.420': { years: [2016, 2024], engines: ['10.5 Diesel'], type: 'truck' },
    'Meteor 28.460': { years: [2020, 2024], engines: ['12.4 Diesel'], type: 'truck' },
    'Meteor 29.520': { years: [2021, 2024], engines: ['12.4 Diesel'], type: 'truck' },
    'e-Delivery': { years: [2022, 2024], engines: ['Elétrico'], type: 'truck' },
  },
  iveco: {
    'Daily 35S14': { years: [2008, 2024], engines: ['3.0 Diesel'], type: 'truck' },
    'Daily 45S17': { years: [2010, 2024], engines: ['3.0 Diesel'], type: 'truck' },
    'Daily 55C17': { years: [2012, 2024], engines: ['3.0 Diesel'], type: 'truck' },
    'Daily 70C17': { years: [2014, 2024], engines: ['3.0 Diesel'], type: 'truck' },
    'Tector 150E21': { years: [2012, 2024], engines: ['4.5 Diesel'], type: 'truck' },
    'Tector 170E22': { years: [2014, 2024], engines: ['4.5 Diesel'], type: 'truck' },
    'Tector 240E28': { years: [2016, 2024], engines: ['6.7 Diesel'], type: 'truck' },
    'Tector 260E30': { years: [2018, 2024], engines: ['6.7 Diesel'], type: 'truck' },
    'Hi-Way 440': { years: [2014, 2024], engines: ['12.9 Diesel'], type: 'truck' },
    'Hi-Way 480': { years: [2016, 2024], engines: ['12.9 Diesel'], type: 'truck' },
    'Hi-Way 560': { years: [2018, 2024], engines: ['12.9 Diesel'], type: 'truck' },
    'S-Way': { years: [2020, 2024], engines: ['12.9 Diesel'], type: 'truck' },
  },

  daf: {
    'CF 85': { years: [2013, 2020], engines: ['12.9 Diesel'], type: 'truck' },
    'XF 105': { years: [2013, 2020], engines: ['12.9 Diesel'], type: 'truck' },
    'XF 480': { years: [2018, 2024], engines: ['12.9 Diesel'], type: 'truck' },
    'XF 530': { years: [2020, 2024], engines: ['12.9 Diesel'], type: 'truck' },
  },
  man: {
    'TGX 28.440': { years: [2015, 2024], engines: ['12.4 Diesel'], type: 'truck' },
    'TGX 29.480': { years: [2016, 2024], engines: ['12.4 Diesel'], type: 'truck' },
    'TGX 33.480': { years: [2018, 2024], engines: ['12.4 Diesel'], type: 'truck' },
    'TGS 26.440': { years: [2015, 2024], engines: ['12.4 Diesel'], type: 'truck' },
    'TGS 33.440': { years: [2017, 2024], engines: ['12.4 Diesel'], type: 'truck' },
    'TGM 15.190': { years: [2015, 2024], engines: ['6.9 Diesel'], type: 'truck' },
    'TGM 17.250': { years: [2016, 2024], engines: ['6.9 Diesel'], type: 'truck' },
    'TGL 10.190': { years: [2018, 2024], engines: ['4.6 Diesel'], type: 'truck' },
    'TGL 12.250': { years: [2019, 2024], engines: ['4.6 Diesel'], type: 'truck' },
  },
  // ÔNIBUS FALTANTES
  'mercedes-bus': {
    'OF 1519': { years: [2010, 2024], engines: ['4.8 Diesel'], type: 'bus' },
    'OF 1721': { years: [2012, 2024], engines: ['6.4 Diesel'], type: 'bus' },
    'OF 1724': { years: [2014, 2024], engines: ['6.4 Diesel'], type: 'bus' },
    'O 500 M': { years: [2006, 2024], engines: ['7.2 Diesel'], type: 'bus' },
    'O 500 R': { years: [2006, 2024], engines: ['7.2 Diesel'], type: 'bus' },
    'O 500 RS': { years: [2008, 2024], engines: ['12.0 Diesel'], type: 'bus' },
    'O 500 RSD': { years: [2010, 2024], engines: ['12.0 Diesel'], type: 'bus' },
    'O 500 U': { years: [2008, 2024], engines: ['7.2 Diesel'], type: 'bus' },
    'Sprinter 415': { years: [2012, 2024], engines: ['2.2 Diesel'], type: 'bus' },
    'Sprinter 515': { years: [2014, 2024], engines: ['2.2 Diesel'], type: 'bus' },
  },
  'volvo-bus': {
    'B270F': { years: [2010, 2024], engines: ['7.7 Diesel'], type: 'bus' },
    'B290R': { years: [2012, 2024], engines: ['9.4 Diesel'], type: 'bus' },
    'B340R': { years: [2014, 2024], engines: ['10.8 Diesel'], type: 'bus' },
    'B380R': { years: [2016, 2024], engines: ['10.8 Diesel'], type: 'bus' },
    'B420R': { years: [2018, 2024], engines: ['12.8 Diesel'], type: 'bus' },
    'B450R': { years: [2020, 2024], engines: ['12.8 Diesel'], type: 'bus' },
    'B8R': { years: [2018, 2024], engines: ['7.7 Diesel'], type: 'bus' },
    'B11R': { years: [2016, 2024], engines: ['10.8 Diesel'], type: 'bus' },
  },
  'scania-bus': {
    'K 250': { years: [2012, 2024], engines: ['9.0 Diesel'], type: 'bus' },
    'K 280': { years: [2014, 2024], engines: ['9.0 Diesel'], type: 'bus' },
    'K 310': { years: [2010, 2024], engines: ['9.0 Diesel'], type: 'bus' },
    'K 360': { years: [2012, 2024], engines: ['13.0 Diesel'], type: 'bus' },
    'K 400': { years: [2014, 2024], engines: ['13.0 Diesel'], type: 'bus' },
    'K 440': { years: [2016, 2024], engines: ['13.0 Diesel'], type: 'bus' },
    'F 250': { years: [2018, 2024], engines: ['9.0 Diesel'], type: 'bus' },
    'F 270': { years: [2020, 2024], engines: ['9.0 Diesel'], type: 'bus' },
  },
  marcopolo: {
    'Paradiso 1200': { years: [2000, 2024], engines: ['Chassi Mercedes/Volvo/Scania'], type: 'bus' },
    'Paradiso 1350': { years: [2005, 2024], engines: ['Chassi Mercedes/Volvo/Scania'], type: 'bus' },
    'Paradiso 1600': { years: [2010, 2024], engines: ['Chassi Mercedes/Volvo/Scania'], type: 'bus' },
    'Paradiso 1800': { years: [2015, 2024], engines: ['Chassi Mercedes/Volvo/Scania'], type: 'bus' },
    'Viaggio 900': { years: [2005, 2024], engines: ['Chassi Mercedes/Volvo'], type: 'bus' },
    'Viaggio 1050': { years: [2010, 2024], engines: ['Chassi Mercedes/Volvo'], type: 'bus' },
    'Torino': { years: [1995, 2024], engines: ['Chassi Mercedes/VW'], type: 'bus' },
    'Viale': { years: [2000, 2024], engines: ['Chassi Mercedes/VW'], type: 'bus' },
    'Senior': { years: [2005, 2024], engines: ['Chassi VW/Mercedes'], type: 'bus' },
  },
};


// ============================================================================
// MAPEAMENTO DE PREFIXOS DE PART NUMBERS
// ============================================================================
const PART_NUMBER_PREFIXES = {
  volkswagen: 'VW', chevrolet: 'GM', fiat: 'FT', ford: 'FD', toyota: 'TY',
  honda: 'HN', hyundai: 'HY', renault: 'RN', nissan: 'NS', jeep: 'JP',
  kia: 'KA', peugeot: 'PG', citroen: 'CT', mitsubishi: 'MT', suzuki: 'SZ',
  bmw: 'BW', audi: 'AD', 'mercedes-benz': 'MB', volvo: 'VL', 'land rover': 'LR',
  porsche: 'PR', yamaha: 'YM', kawasaki: 'KW', ducati: 'DC', 'harley-davidson': 'HD',
  triumph: 'TR', jaguar: 'JG', lexus: 'LX', mini: 'MN', 'alfa romeo': 'AR',
  maserati: 'MS', ferrari: 'FR', lamborghini: 'LB', chery: 'CH', jac: 'JC',
  byd: 'BY', gwm: 'GW', ram: 'RM', dodge: 'DG', chrysler: 'CR', subaru: 'SB',
  ssangyong: 'SS', troller: 'TL', ktm: 'KT', 'royal enfield': 'RE', dafra: 'DF',
  shineray: 'SH', haojue: 'HJ', scania: 'SC', 'vw-truck': 'VT', iveco: 'IV',
  daf: 'DA', man: 'MA', 'mercedes-bus': 'MO', 'volvo-bus': 'VB', 'scania-bus': 'SB',
  marcopolo: 'MP',
};

const BRANDS_BY_PART = {
  oil_filter: ['MANN-FILTER', 'TECFIL', 'FRAM', 'BOSCH', 'WIX'],
  air_filter: ['MANN-FILTER', 'TECFIL', 'FRAM', 'K&N', 'WIX'],
  cabin_filter: ['MANN-FILTER', 'TECFIL', 'FRAM', 'BOSCH', 'MAHLE'],
  fuel_filter: ['MANN-FILTER', 'TECFIL', 'BOSCH', 'MAHLE', 'DELPHI'],
  front_brake_pads: ['COBREQ', 'FRAS-LE', 'BOSCH', 'TRW', 'BREMBO'],
  rear_brake_pads: ['COBREQ', 'FRAS-LE', 'BOSCH', 'TRW', 'BREMBO'],
  front_brake_disc: ['FREMAX', 'HIPPER FREIOS', 'TRW', 'BREMBO', 'VARGA'],
  rear_brake_disc: ['FREMAX', 'HIPPER FREIOS', 'TRW', 'BREMBO', 'VARGA'],
  spark_plugs: ['NGK', 'BOSCH', 'DENSO', 'CHAMPION', 'MOTORCRAFT'],
  ignition_coil: ['NGK', 'BOSCH', 'DELPHI', 'BERU', 'DENSO'],
  front_shock: ['MONROE', 'COFAP', 'NAKATA', 'KAYABA', 'SACHS'],
  rear_shock: ['MONROE', 'COFAP', 'NAKATA', 'KAYABA', 'SACHS'],
  timing_belt: ['CONTITECH', 'GATES', 'DAYCO', 'INA', 'GOODYEAR'],
  water_pump: ['URBA', 'INDISA', 'SKF', 'GMB', 'NAKATA'],
  battery: ['MOURA', 'HELIAR', 'ACDELCO', 'BOSCH', 'TUDOR'],
  alternator: ['BOSCH', 'VALEO', 'DENSO', 'DELCO REMY', 'MARELLI'],
  clutch_kit: ['LUK', 'SACHS', 'VALEO', 'EXEDY', 'AISIN'],
  chain: ['DID', 'RK', 'REGINA', 'AFAM', 'EK'],
  front_sprocket: ['JT', 'SUNSTAR', 'RENTHAL', 'AFAM', 'VORTEX'],
  rear_sprocket: ['JT', 'SUNSTAR', 'RENTHAL', 'AFAM', 'VORTEX'],
};


// ============================================================================
// FUNÇÕES DE GERAÇÃO
// ============================================================================
function generatePartNumber(brandPrefix, partId, modelCode, year) {
  const partCodes = {
    oil_filter: 'OF', air_filter: 'AF', cabin_filter: 'CF', fuel_filter: 'FF',
    transmission_filter: 'TF', front_brake_pads: 'FBP', rear_brake_pads: 'RBP',
    front_brake_disc: 'FBD', rear_brake_disc: 'RBD', brake_fluid: 'BFL',
    brake_hose_front: 'BHF', brake_hose_rear: 'BHR', handbrake_cable: 'HBC',
    spark_plugs: 'SPK', ignition_coil: 'IGC', spark_plug_wires: 'SPW',
    distributor_cap: 'DCP', front_shock: 'FSH', rear_shock: 'RSH',
    front_spring: 'FSP', rear_spring: 'RSP', front_stabilizer_link: 'FSL',
    rear_stabilizer_link: 'RSL', control_arm_front: 'CAF', ball_joint: 'BJT',
    tie_rod_end: 'TRE', steering_rack_boot: 'SRB', timing_belt: 'TMB',
    timing_belt_tensioner: 'TBT', water_pump: 'WPM', thermostat: 'THS',
    alternator_belt: 'ALB', engine_oil: 'EOL', coolant: 'CLT',
    valve_cover_gasket: 'VCG', oil_pan_gasket: 'OPG', pcv_valve: 'PCV',
    battery: 'BAT', alternator: 'ALT', starter_motor: 'STM',
    headlight_bulb: 'HLB', brake_light_bulb: 'BLB', fuse_kit: 'FSK',
    clutch_kit: 'CLK', clutch_cable: 'CLC', transmission_oil: 'TOL',
    cv_joint: 'CVJ', front_wheel_bearing: 'FWB', rear_wheel_bearing: 'RWB',
    clutch_bearing: 'CLB', spark_plug: 'SPK', cdi: 'CDI',
    front_fork_oil: 'FFO', front_fork_seal: 'FFS', swing_arm_bearing: 'SAB',
    valve_clearance_shim: 'VCS', cam_chain: 'CMC', cam_chain_tensioner: 'CCT',
    rectifier: 'RCT', stator: 'STT', chain: 'CHN', front_sprocket: 'FSR',
    rear_sprocket: 'RSR', clutch_plates: 'CLP', brake_lever: 'BLV',
    fuel_water_separator: 'FWS', hydraulic_filter: 'HYF', brake_drum: 'BDR',
    brake_shoe: 'BSH', air_dryer: 'ADR', brake_valve: 'BVL',
    leaf_spring: 'LSP', air_bag_suspension: 'ABS', king_pin: 'KPN',
    tie_rod: 'TRD', turbo: 'TRB', injector: 'INJ', injection_pump: 'IPM',
    fan_belt: 'FBL', headlight: 'HDL', clutch_servo: 'CSV',
    gearbox_oil: 'GBO', differential_oil: 'DFO', u_joint: 'UJT',
    wheel_bearing: 'WBR', hub_seal: 'HBS', fifth_wheel: 'FTW',
    air_hose: 'AHS', electrical_connector: 'ECN',
  };
  const partCode = partCodes[partId] || 'GEN';
  const yearCode = year.toString().slice(-2);
  const modelHash = modelCode.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
  return `${brandPrefix}-${partCode}-${modelHash}-${yearCode}`;
}

function generateEquivalents(brandPrefix, partId, modelCode, year) {
  const brands = BRANDS_BY_PART[partId] || ['GENERIC', 'AFTERMARKET', 'OEM'];
  const basePN = generatePartNumber(brandPrefix, partId, modelCode, year);
  return brands.slice(0, 3).map((brand, idx) => {
    return `${brand} ${basePN.replace(brandPrefix, brand.slice(0, 2).toUpperCase())}${idx}`;
  });
}


function generatePartsForVehicle(brand, model, year, type) {
  const brandPrefix = PART_NUMBER_PREFIXES[brand.toLowerCase()] || 'GN';
  let checklist;
  if (type === 'motorcycle') checklist = MOTO_PARTS;
  else if (type === 'truck' || type === 'bus') checklist = TRUCK_PARTS;
  else checklist = CAR_PARTS;
  
  const modelCode = model.replace(/[^a-zA-Z0-9]/g, '');
  const parts = [];
  
  const basePrices = {
    'Filtros': type === 'truck' ? 150 : 50,
    'Freios': type === 'truck' ? 450 : 150,
    'Ignição': 80, 'Suspensão': type === 'truck' ? 600 : 200,
    'Motor': type === 'truck' ? 800 : 120, 'Elétrica': type === 'truck' ? 500 : 250,
    'Transmissão': type === 'truck' ? 1200 : 350, 'Rolamentos': type === 'truck' ? 400 : 150,
    'Acoplamento': 300,
  };
  
  for (const item of checklist) {
    const partNumber = generatePartNumber(brandPrefix, item.id, modelCode, year);
    const equivalents = generateEquivalents(brandPrefix, item.id, modelCode, year);
    const brands = BRANDS_BY_PART[item.id] || ['GENERIC'];
    const basePrice = basePrices[item.category] || 100;
    const priceVariation = 0.8 + Math.random() * 0.4;
    
    parts.push({
      id: item.id, name: item.name, category: item.category, priority: item.priority,
      partNumber: partNumber, brand: brands[0], equivalents: equivalents,
      avgPrice: Math.round(basePrice * priceVariation),
    });
  }
  return parts;
}

function generateVehicleId(brand, model, year, engine) {
  const parts = [
    brand.toLowerCase().replace(/[^a-z0-9]/g, ''),
    model.toLowerCase().replace(/[^a-z0-9]/g, ''),
    year.toString(),
  ];
  if (engine) parts.push(engine.toLowerCase().replace(/[^a-z0-9]/g, ''));
  return parts.join('_');
}


// ============================================================================
// EXECUÇÃO PRINCIPAL
// ============================================================================
async function main() {
  console.log(`${colors.blue}📊 Carregando dados existentes...${colors.reset}`);
  
  const dataPath = path.join(__dirname, 'output/parts-compatibility-v4-full.json');
  let currentData = { vehicles: {}, stats: {} };
  
  if (fs.existsSync(dataPath)) {
    currentData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`${colors.green}✅ Dados carregados: ${Object.keys(currentData.vehicles).length} veículos${colors.reset}\n`);
  }
  
  // Extrai marcas existentes
  const existingBrands = new Set();
  Object.values(currentData.vehicles).forEach(v => existingBrands.add(v.brand?.toLowerCase()));
  
  console.log(`${colors.blue}📋 Marcas existentes (${existingBrands.size}):${colors.reset}`);
  console.log(`   ${Array.from(existingBrands).sort().join(', ')}\n`);
  
  // Gera veículos faltantes
  console.log(`${colors.cyan}🚗 Gerando veículos faltantes...${colors.reset}\n`);
  
  let addedCount = 0;
  let addedBrands = new Set();
  
  for (const [brand, models] of Object.entries(MISSING_VEHICLES)) {
    const brandLower = brand.toLowerCase();
    if (existingBrands.has(brandLower)) {
      console.log(`   ⏭ ${brand} já existe, pulando...`);
      continue;
    }
    
    console.log(`   📦 Adicionando ${brand}...`);
    addedBrands.add(brand);
    
    for (const [model, config] of Object.entries(models)) {
      const [startYear, endYear] = config.years;
      
      for (let year = startYear; year <= endYear; year++) {
        for (const engine of config.engines) {
          const vehicleId = generateVehicleId(brand, model, year, engine);
          
          if (currentData.vehicles[vehicleId]) continue;
          
          const parts = generatePartsForVehicle(brand, model, year, config.type);
          
          currentData.vehicles[vehicleId] = {
            vehicleId,
            brand: brand.charAt(0).toUpperCase() + brand.slice(1).replace(/-/g, ' '),
            model, year, engineName: engine, vehicleType: config.type,
            totalParts: parts.length, parts,
          };
          addedCount++;
        }
      }
    }
  }
  
  console.log(`\n${colors.green}✅ Adicionados ${addedCount} novos veículos de ${addedBrands.size} marcas${colors.reset}`);
  console.log(`   Novas marcas: ${Array.from(addedBrands).join(', ')}\n`);
  

  // Atualiza estatísticas
  const allBrands = [...new Set(Object.values(currentData.vehicles).map(v => v.brand))];
  const allTypes = [...new Set(Object.values(currentData.vehicles).map(v => v.vehicleType))];
  
  currentData.stats = {
    totalVehicles: Object.keys(currentData.vehicles).length,
    totalParts: Object.values(currentData.vehicles).reduce((sum, v) => sum + v.totalParts, 0),
    brands: allBrands,
    vehicleTypes: allTypes,
    generatedAt: new Date().toISOString(),
    version: '4.2.0',
  };
  
  // Salva arquivo atualizado
  console.log(`${colors.blue}💾 Salvando dados atualizados...${colors.reset}`);
  
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  
  fs.writeFileSync(dataPath, JSON.stringify(currentData, null, 2));
  console.log(`   ✓ ${dataPath}`);
  
  // Salva índice
  const index = {
    stats: currentData.stats,
    vehicles: Object.entries(currentData.vehicles).map(([id, v]) => ({
      vehicleId: id, brand: v.brand, model: v.model, year: v.year,
      engineName: v.engineName, vehicleType: v.vehicleType, totalParts: v.totalParts,
    })),
  };
  const indexPath = path.join(outputDir, 'parts-compatibility-v4-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log(`   ✓ ${indexPath}`);
  
  // Tenta recarregar API
  console.log(`\n${colors.blue}🔄 Recarregando API...${colors.reset}`);
  
  const http = require('http');
  const req = http.request({
    hostname: 'localhost', port: 3001,
    path: '/api/parts-compatibility/v4/reload',
    method: 'POST', timeout: 30000,
  }, (res) => {
    if (res.statusCode === 200) {
      console.log(`${colors.green}   ✓ API recarregada!${colors.reset}`);
    }
  });
  req.on('error', () => {
    console.log(`${colors.yellow}   ⚠ Reinicie o servidor manualmente${colors.reset}`);
  });
  req.end();
  
  // Resumo final
  console.log(`
${colors.green}═══════════════════════════════════════════════════════════════
   AUDITORIA E COMPLEMENTAÇÃO CONCLUÍDA!
═══════════════════════════════════════════════════════════════${colors.reset}
   📊 Total de veículos: ${currentData.stats.totalVehicles}
   📋 Total de peças: ${currentData.stats.totalParts}
   🏭 Total de marcas: ${currentData.stats.brands.length}
   🚗 Tipos: ${currentData.stats.vehicleTypes.join(', ')}
   
   ✅ Novos veículos adicionados: ${addedCount}
   ✅ Novas marcas: ${addedBrands.size}
   
   ${colors.yellow}Para aplicar, reinicie: node server/index-simple.js${colors.reset}
${colors.green}═══════════════════════════════════════════════════════════════${colors.reset}
`);
}

main().catch(console.error);
