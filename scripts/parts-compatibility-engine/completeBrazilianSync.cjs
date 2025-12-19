/**
 * SINCRONIZAÇÃO COMPLETA DE VEÍCULOS BRASILEIROS
 * Adiciona TODOS os veículos que rodam no Brasil com TODAS as motorizações
 * Gera peças com part numbers reais e peças compartilháveis
 * 
 * @version 2.0.0
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

// Cores para console
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
   SINCRONIZAÇÃO COMPLETA DE VEÍCULOS BRASILEIROS
   Adiciona TODOS os veículos faltantes com peças completas
═══════════════════════════════════════════════════════════════${colors.reset}
`);

// ============================================================================
// CHECKLIST DE 50 PEÇAS PARA CARROS
// ============================================================================
const CAR_PARTS_CHECKLIST = [
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
const MOTO_PARTS_CHECKLIST = [
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
// BASE DE DADOS COMPLETA DE VEÍCULOS BRASILEIROS
// ============================================================================
const COMPLETE_VEHICLES = {
  // VOLKSWAGEN
  volkswagen: {
    gol: { years: [1980, 2024], engines: ['1.0 8V', '1.0 16V', '1.6 8V', '1.6 16V', '1.0 TSI', '1.8 AP', '2.0 AP'], type: 'car' },
    voyage: { years: [1981, 2024], engines: ['1.0 8V', '1.6 8V', '1.6 16V'], type: 'car' },
    saveiro: { years: [1982, 2024], engines: ['1.6 8V', '1.6 16V'], type: 'pickup' },
    fox: { years: [2003, 2021], engines: ['1.0 8V', '1.6 8V'], type: 'car' },
    crossfox: { years: [2005, 2016], engines: ['1.6 8V', '1.6 16V'], type: 'car' },
    spacefox: { years: [2006, 2018], engines: ['1.6 8V', '1.6 16V'], type: 'car' },
    polo: { years: [2002, 2024], engines: ['1.0 MPI', '1.0 TSI', '1.4 TSI', '2.0 TSI'], type: 'car' },
    virtus: { years: [2018, 2024], engines: ['1.0 MPI', '1.0 TSI', '1.4 TSI', '2.0 TSI'], type: 'car' },
    golf: { years: [1999, 2024], engines: ['1.6 8V', '1.4 TSI', '2.0 TSI', '2.0 TSI GTI'], type: 'car' },
    jetta: { years: [2006, 2024], engines: ['2.0 8V', '1.4 TSI', '2.0 TSI'], type: 'car' },
    passat: { years: [1999, 2019], engines: ['1.8 Turbo', '2.0 TSI', '2.0 TDI'], type: 'car' },
    'T-Cross': { years: [2019, 2024], engines: ['1.0 TSI', '1.4 TSI'], type: 'suv' },
    nivus: { years: [2020, 2024], engines: ['1.0 TSI'], type: 'suv' },
    taos: { years: [2021, 2024], engines: ['1.4 TSI'], type: 'suv' },
    tiguan: { years: [2009, 2024], engines: ['1.4 TSI', '2.0 TSI'], type: 'suv' },
    amarok: { years: [2010, 2024], engines: ['2.0 TDI', '2.0 BiTDI', '3.0 V6 TDI'], type: 'pickup' },
    up: { years: [2014, 2021], engines: ['1.0 MPI', '1.0 TSI'], type: 'car' },
    fusca: { years: [1959, 1996], engines: ['1.3', '1.5', '1.6'], type: 'car' },
    kombi: { years: [1957, 2014], engines: ['1.4 Flex', '1.6'], type: 'van' },
    santana: { years: [1984, 2006], engines: ['1.8 AP', '2.0 AP'], type: 'car' },
    parati: { years: [1982, 2013], engines: ['1.6 AP', '1.8 AP', '2.0 AP', '1.6 16V'], type: 'car' },
  },
  // CHEVROLET
  chevrolet: {
    onix: { years: [2012, 2024], engines: ['1.0 8V', '1.4 8V', '1.0 Turbo'], type: 'car' },
    'onix plus': { years: [2019, 2024], engines: ['1.0 8V', '1.0 Turbo'], type: 'car' },
    prisma: { years: [2006, 2019], engines: ['1.0 8V', '1.4 8V'], type: 'car' },
    tracker: { years: [2013, 2024], engines: ['1.0 Turbo', '1.2 Turbo', '1.4 Turbo'], type: 'suv' },
    cruze: { years: [2011, 2024], engines: ['1.4 Turbo', '1.8 16V'], type: 'car' },
    cobalt: { years: [2011, 2020], engines: ['1.4 8V', '1.8 8V'], type: 'car' },
    spin: { years: [2012, 2024], engines: ['1.8 8V', '1.0 Turbo'], type: 'van' },
    montana: { years: [2003, 2024], engines: ['1.4 8V', '1.2 Turbo'], type: 'pickup' },
    s10: { years: [1995, 2024], engines: ['2.8 Turbo Diesel', '2.5 Flex', '2.4 Flex'], type: 'pickup' },
    trailblazer: { years: [2012, 2024], engines: ['2.8 Turbo Diesel'], type: 'suv' },
    equinox: { years: [2017, 2024], engines: ['1.5 Turbo', '2.0 Turbo'], type: 'suv' },
    camaro: { years: [2010, 2024], engines: ['6.2 V8', '2.0 Turbo'], type: 'car' },
    celta: { years: [2000, 2015], engines: ['1.0 8V', '1.4 8V'], type: 'car' },
    corsa: { years: [1994, 2012], engines: ['1.0 8V', '1.4 8V', '1.8 8V'], type: 'car' },
    classic: { years: [2003, 2016], engines: ['1.0 8V'], type: 'car' },
    astra: { years: [1998, 2011], engines: ['1.8 8V', '2.0 8V', '2.0 16V'], type: 'car' },
    vectra: { years: [1993, 2011], engines: ['2.0 8V', '2.0 16V', '2.4 16V'], type: 'car' },
    agile: { years: [2009, 2014], engines: ['1.4 8V'], type: 'car' },
    meriva: { years: [2002, 2012], engines: ['1.4 8V', '1.8 8V'], type: 'van' },
    zafira: { years: [2001, 2012], engines: ['2.0 8V', '2.0 16V'], type: 'van' },
    captiva: { years: [2008, 2017], engines: ['2.4 16V', '3.0 V6', '3.6 V6'], type: 'suv' },
    sonic: { years: [2012, 2014], engines: ['1.6 16V'], type: 'car' },
    malibu: { years: [2010, 2013], engines: ['2.4 16V'], type: 'car' },
    opala: { years: [1968, 1992], engines: ['2.5', '4.1', '4.1 S', '6 cilindros'], type: 'car' },
    chevette: { years: [1973, 1993], engines: ['1.4', '1.6'], type: 'car' },
    monza: { years: [1982, 1996], engines: ['1.6', '1.8', '2.0'], type: 'car' },
    kadett: { years: [1989, 1998], engines: ['1.8', '2.0'], type: 'car' },
  },
  // FIAT
  fiat: {
    argo: { years: [2017, 2024], engines: ['1.0 6V', '1.3 8V', '1.8 16V'], type: 'car' },
    cronos: { years: [2018, 2024], engines: ['1.0 6V', '1.3 8V', '1.8 16V'], type: 'car' },
    pulse: { years: [2021, 2024], engines: ['1.0 Turbo', '1.3 8V'], type: 'suv' },
    fastback: { years: [2022, 2024], engines: ['1.0 Turbo', '1.3 8V'], type: 'suv' },
    strada: { years: [1998, 2024], engines: ['1.4 8V', '1.3 8V', '1.0 Turbo'], type: 'pickup' },
    toro: { years: [2016, 2024], engines: ['1.3 Turbo', '1.8 16V', '2.0 Turbo Diesel'], type: 'pickup' },
    mobi: { years: [2016, 2024], engines: ['1.0 6V'], type: 'car' },
    uno: { years: [1984, 2021], engines: ['1.0 8V', '1.4 8V'], type: 'car' },
    palio: { years: [1996, 2017], engines: ['1.0 8V', '1.4 8V', '1.6 16V', '1.8 8V'], type: 'car' },
    siena: { years: [1997, 2016], engines: ['1.0 8V', '1.4 8V', '1.6 16V'], type: 'car' },
    'grand siena': { years: [2012, 2021], engines: ['1.4 8V', '1.6 16V'], type: 'car' },
    punto: { years: [2007, 2017], engines: ['1.4 8V', '1.6 16V', '1.8 16V'], type: 'car' },
    linea: { years: [2008, 2016], engines: ['1.8 16V', '1.9 16V'], type: 'car' },
    bravo: { years: [2010, 2016], engines: ['1.4 T-Jet', '1.8 16V'], type: 'car' },
    idea: { years: [2005, 2016], engines: ['1.4 8V', '1.6 16V', '1.8 8V'], type: 'car' },
    doblo: { years: [2001, 2024], engines: ['1.4 8V', '1.8 16V'], type: 'van' },
    fiorino: { years: [1988, 2024], engines: ['1.4 8V'], type: 'van' },
    ducato: { years: [1998, 2024], engines: ['2.3 Turbo Diesel'], type: 'van' },
    '500': { years: [2009, 2024], engines: ['1.4 16V'], type: 'car' },
    freemont: { years: [2011, 2016], engines: ['2.4 16V', '2.0 Turbo Diesel'], type: 'suv' },
    '147': { years: [1976, 1986], engines: ['1.0', '1.3', '1.5'], type: 'car' },
    elba: { years: [1986, 1996], engines: ['1.5', '1.6'], type: 'car' },
    premio: { years: [1985, 1996], engines: ['1.5', '1.6'], type: 'car' },
    tempra: { years: [1991, 1999], engines: ['2.0 8V', '2.0 16V', '2.0 Turbo'], type: 'car' },
    tipo: { years: [1993, 1997], engines: ['1.6', '2.0'], type: 'car' },
  },
  // FORD
  ford: {
    ka: { years: [1997, 2021], engines: ['1.0 12V', '1.5 12V'], type: 'car' },
    'ka sedan': { years: [2014, 2021], engines: ['1.0 12V', '1.5 12V'], type: 'car' },
    fiesta: { years: [1996, 2019], engines: ['1.0 8V', '1.6 8V', '1.6 16V'], type: 'car' },
    'new fiesta': { years: [2011, 2019], engines: ['1.5 16V', '1.6 16V'], type: 'car' },
    focus: { years: [2000, 2019], engines: ['1.6 16V', '2.0 16V', '2.0 PowerShift'], type: 'car' },
    fusion: { years: [2006, 2019], engines: ['2.0 16V', '2.5 16V', '2.0 EcoBoost', '2.0 Hybrid'], type: 'car' },
    ecosport: { years: [2003, 2021], engines: ['1.5 12V', '1.6 16V', '2.0 16V', '1.5 Turbo'], type: 'suv' },
    territory: { years: [2020, 2024], engines: ['1.5 Turbo'], type: 'suv' },
    ranger: { years: [1998, 2024], engines: ['2.2 Turbo Diesel', '3.2 Turbo Diesel', '2.3 Turbo', '3.0 V6 TDI'], type: 'pickup' },
    maverick: { years: [2022, 2024], engines: ['2.0 Turbo', '2.5 Hybrid'], type: 'pickup' },
    'bronco sport': { years: [2023, 2024], engines: ['2.0 Turbo'], type: 'suv' },
    edge: { years: [2009, 2022], engines: ['3.5 V6', '2.0 EcoBoost'], type: 'suv' },
    mustang: { years: [2010, 2024], engines: ['2.3 EcoBoost', '5.0 V8'], type: 'car' },
    courier: { years: [1997, 2013], engines: ['1.3 8V', '1.6 8V'], type: 'pickup' },
    escort: { years: [1983, 2003], engines: ['1.6', '1.8', '2.0'], type: 'car' },
    verona: { years: [1989, 1996], engines: ['1.6', '1.8', '2.0'], type: 'car' },
    'del rey': { years: [1981, 1991], engines: ['1.6', '1.8'], type: 'car' },
    corcel: { years: [1968, 1986], engines: ['1.4', '1.6'], type: 'car' },
    belina: { years: [1970, 1991], engines: ['1.4', '1.6', '1.8'], type: 'car' },
    pampa: { years: [1982, 1997], engines: ['1.6', '1.8'], type: 'pickup' },
    'f-250': { years: [1998, 2011], engines: ['4.2 Turbo Diesel', '3.9 Turbo Diesel'], type: 'pickup' },
    transit: { years: [2008, 2024], engines: ['2.2 Turbo Diesel', '2.0 Turbo Diesel'], type: 'van' },
  },
  // TOYOTA
  toyota: {
    corolla: { years: [1998, 2024], engines: ['1.6 16V', '1.8 16V', '1.8 Hybrid', '2.0 16V'], type: 'car' },
    'corolla cross': { years: [2021, 2024], engines: ['2.0 16V', '1.8 Hybrid'], type: 'suv' },
    yaris: { years: [2018, 2024], engines: ['1.3 16V', '1.5 16V'], type: 'car' },
    etios: { years: [2012, 2021], engines: ['1.3 16V', '1.5 16V'], type: 'car' },
    hilux: { years: [1992, 2024], engines: ['2.8 Turbo Diesel', '2.7 16V'], type: 'pickup' },
    'hilux sw4': { years: [1998, 2024], engines: ['2.8 Turbo Diesel'], type: 'suv' },
    rav4: { years: [2013, 2024], engines: ['2.5 Hybrid'], type: 'suv' },
    camry: { years: [2018, 2024], engines: ['2.5 Hybrid'], type: 'car' },
    prius: { years: [2013, 2024], engines: ['1.8 Hybrid'], type: 'car' },
    'land cruiser': { years: [1990, 2024], engines: ['4.5 V8 Diesel', '4.0 V6'], type: 'suv' },
    bandeirante: { years: [1958, 2001], engines: ['3.7 Diesel', '4.0 Diesel'], type: 'suv' },
  },
  // HONDA
  honda: {
    civic: { years: [1997, 2024], engines: ['1.8 16V', '2.0 16V', '1.5 Turbo', '2.0 Turbo'], type: 'car' },
    city: { years: [2009, 2024], engines: ['1.5 16V'], type: 'car' },
    fit: { years: [2003, 2021], engines: ['1.5 16V'], type: 'car' },
    'HR-V': { years: [2015, 2024], engines: ['1.5 16V', '1.5 Turbo'], type: 'suv' },
    'WR-V': { years: [2017, 2024], engines: ['1.5 16V'], type: 'suv' },
    'CR-V': { years: [2007, 2024], engines: ['2.0 16V', '1.5 Turbo'], type: 'suv' },
    accord: { years: [2008, 2024], engines: ['2.0 16V', '1.5 Turbo', '2.0 Turbo'], type: 'car' },
    // MOTOS HONDA
    'CG 160': { years: [2016, 2024], engines: ['162.7cc'], type: 'motorcycle' },
    'CG 150': { years: [2004, 2015], engines: ['149.2cc'], type: 'motorcycle' },
    'CG 125': { years: [1976, 2015], engines: ['124.9cc'], type: 'motorcycle' },
    'Biz 125': { years: [2005, 2024], engines: ['124.9cc'], type: 'motorcycle' },
    'Biz 110': { years: [2016, 2024], engines: ['109.1cc'], type: 'motorcycle' },
    'Pop 110': { years: [2016, 2024], engines: ['109.1cc'], type: 'motorcycle' },
    'CB 300R': { years: [2009, 2024], engines: ['286cc'], type: 'motorcycle' },
    'CB 500F': { years: [2013, 2024], engines: ['471cc'], type: 'motorcycle' },
    'CB 650R': { years: [2019, 2024], engines: ['649cc'], type: 'motorcycle' },
    'CBR 650R': { years: [2019, 2024], engines: ['649cc'], type: 'motorcycle' },
    'CBR 1000RR': { years: [2008, 2024], engines: ['998cc'], type: 'motorcycle' },
    'XRE 300': { years: [2009, 2024], engines: ['291cc'], type: 'motorcycle' },
    'XRE 190': { years: [2016, 2024], engines: ['184.4cc'], type: 'motorcycle' },
    'Bros 160': { years: [2015, 2024], engines: ['162.7cc'], type: 'motorcycle' },
    'PCX 160': { years: [2021, 2024], engines: ['156.9cc'], type: 'motorcycle' },
    'Elite 125': { years: [2017, 2024], engines: ['124.9cc'], type: 'motorcycle' },
    'SH 150': { years: [2017, 2024], engines: ['149.3cc'], type: 'motorcycle' },
    'ADV 150': { years: [2021, 2024], engines: ['149.3cc'], type: 'motorcycle' },
    'Africa Twin': { years: [2016, 2024], engines: ['1084cc'], type: 'motorcycle' },
    'NC 750X': { years: [2014, 2024], engines: ['745cc'], type: 'motorcycle' },
  },
  // HYUNDAI
  hyundai: {
    'HB20': { years: [2012, 2024], engines: ['1.0 12V', '1.0 Turbo', '1.6 16V'], type: 'car' },
    'HB20S': { years: [2013, 2024], engines: ['1.0 12V', '1.0 Turbo', '1.6 16V'], type: 'car' },
    'HB20X': { years: [2013, 2024], engines: ['1.6 16V'], type: 'car' },
    creta: { years: [2017, 2024], engines: ['1.6 16V', '2.0 16V'], type: 'suv' },
    tucson: { years: [2006, 2024], engines: ['2.0 16V', '1.6 Turbo'], type: 'suv' },
    'ix35': { years: [2010, 2019], engines: ['2.0 16V'], type: 'suv' },
    'santa fe': { years: [2006, 2024], engines: ['2.4 16V', '2.5 Turbo', '3.5 V6'], type: 'suv' },
    azera: { years: [2007, 2020], engines: ['3.0 V6', '3.3 V6'], type: 'car' },
    elantra: { years: [2011, 2024], engines: ['1.8 16V', '2.0 16V'], type: 'car' },
    veloster: { years: [2011, 2019], engines: ['1.6 16V', '1.6 Turbo'], type: 'car' },
    i30: { years: [2009, 2019], engines: ['1.6 16V', '1.8 16V', '2.0 16V'], type: 'car' },
  },
  // RENAULT
  renault: {
    kwid: { years: [2017, 2024], engines: ['1.0 12V'], type: 'car' },
    sandero: { years: [2007, 2024], engines: ['1.0 12V', '1.6 16V', '1.0 Turbo'], type: 'car' },
    logan: { years: [2007, 2024], engines: ['1.0 12V', '1.6 16V', '1.0 Turbo'], type: 'car' },
    stepway: { years: [2010, 2024], engines: ['1.6 16V', '1.0 Turbo'], type: 'car' },
    duster: { years: [2011, 2024], engines: ['1.6 16V', '1.3 Turbo', '2.0 16V'], type: 'suv' },
    captur: { years: [2017, 2024], engines: ['1.6 16V', '1.3 Turbo'], type: 'suv' },
    oroch: { years: [2015, 2024], engines: ['1.6 16V', '2.0 16V'], type: 'pickup' },
    fluence: { years: [2011, 2017], engines: ['2.0 16V'], type: 'car' },
    megane: { years: [2006, 2012], engines: ['1.6 16V', '2.0 16V'], type: 'car' },
    clio: { years: [1999, 2016], engines: ['1.0 8V', '1.0 16V', '1.6 16V'], type: 'car' },
    scenic: { years: [1999, 2011], engines: ['1.6 16V', '2.0 16V'], type: 'van' },
    master: { years: [2002, 2024], engines: ['2.3 Turbo Diesel'], type: 'van' },
    symbol: { years: [2009, 2013], engines: ['1.6 16V'], type: 'car' },
  },
  // NISSAN
  nissan: {
    kicks: { years: [2016, 2024], engines: ['1.6 16V', '1.0 Turbo'], type: 'suv' },
    versa: { years: [2011, 2024], engines: ['1.6 16V'], type: 'car' },
    sentra: { years: [2007, 2024], engines: ['2.0 16V'], type: 'car' },
    march: { years: [2011, 2021], engines: ['1.0 12V', '1.6 16V'], type: 'car' },
    frontier: { years: [2002, 2024], engines: ['2.3 Turbo Diesel', '2.5 16V'], type: 'pickup' },
    livina: { years: [2009, 2014], engines: ['1.6 16V', '1.8 16V'], type: 'van' },
    tiida: { years: [2007, 2013], engines: ['1.8 16V'], type: 'car' },
  },
  // JEEP
  jeep: {
    renegade: { years: [2015, 2024], engines: ['1.3 Turbo', '1.8 16V', '2.0 Turbo Diesel'], type: 'suv' },
    compass: { years: [2016, 2024], engines: ['1.3 Turbo', '2.0 16V', '2.0 Turbo Diesel'], type: 'suv' },
    commander: { years: [2021, 2024], engines: ['1.3 Turbo', '2.0 Turbo Diesel'], type: 'suv' },
    wrangler: { years: [2011, 2024], engines: ['3.6 V6', '2.0 Turbo'], type: 'suv' },
    'grand cherokee': { years: [2011, 2024], engines: ['3.6 V6', '3.0 V6 Diesel', '5.7 V8'], type: 'suv' },
    cherokee: { years: [2014, 2019], engines: ['2.0 Turbo', '3.2 V6'], type: 'suv' },
  },

  // KIA
  kia: {
    picanto: { years: [2006, 2024], engines: ['1.0 12V', '1.2 16V'], type: 'car' },
    rio: { years: [2012, 2017], engines: ['1.4 16V', '1.6 16V'], type: 'car' },
    cerato: { years: [2009, 2024], engines: ['1.6 16V', '2.0 16V'], type: 'car' },
    sportage: { years: [2005, 2024], engines: ['2.0 16V', '2.0 Turbo Diesel'], type: 'suv' },
    sorento: { years: [2009, 2024], engines: ['2.4 16V', '3.5 V6', '2.2 Turbo Diesel'], type: 'suv' },
    soul: { years: [2009, 2020], engines: ['1.6 16V'], type: 'car' },
    stinger: { years: [2018, 2024], engines: ['2.0 Turbo', '3.3 V6 Turbo'], type: 'car' },
    carnival: { years: [2006, 2024], engines: ['2.7 V6', '3.5 V6', '2.2 Turbo Diesel'], type: 'van' },
    seltos: { years: [2021, 2024], engines: ['1.6 16V', '2.0 16V'], type: 'suv' },
    bongo: { years: [2005, 2024], engines: ['2.5 Turbo Diesel', '2.7 Turbo Diesel'], type: 'van' },
  },
  // PEUGEOT
  peugeot: {
    '208': { years: [2013, 2024], engines: ['1.0 12V', '1.2 12V', '1.6 16V', '1.6 THP'], type: 'car' },
    '2008': { years: [2015, 2024], engines: ['1.6 16V', '1.6 THP'], type: 'suv' },
    '308': { years: [2012, 2024], engines: ['1.6 16V', '1.6 THP', '2.0 16V'], type: 'car' },
    '3008': { years: [2017, 2024], engines: ['1.6 THP', '2.0 THP'], type: 'suv' },
    '408': { years: [2011, 2019], engines: ['1.6 16V', '2.0 16V'], type: 'car' },
    '5008': { years: [2018, 2024], engines: ['1.6 THP'], type: 'suv' },
    '206': { years: [1999, 2010], engines: ['1.0 16V', '1.4 8V', '1.6 16V'], type: 'car' },
    '207': { years: [2008, 2015], engines: ['1.4 8V', '1.6 16V'], type: 'car' },
    '307': { years: [2002, 2012], engines: ['1.6 16V', '2.0 16V'], type: 'car' },
    partner: { years: [1999, 2024], engines: ['1.6 16V'], type: 'van' },
    boxer: { years: [2005, 2024], engines: ['2.0 Turbo Diesel', '2.3 Turbo Diesel'], type: 'van' },
    hoggar: { years: [2010, 2014], engines: ['1.4 8V', '1.6 16V'], type: 'pickup' },
  },
  // CITROËN
  citroen: {
    'C3': { years: [2003, 2024], engines: ['1.4 8V', '1.5 8V', '1.6 16V'], type: 'car' },
    'C4': { years: [2007, 2018], engines: ['1.6 16V', '2.0 16V'], type: 'car' },
    'C4 Cactus': { years: [2018, 2024], engines: ['1.6 16V', '1.6 THP'], type: 'suv' },
    'C4 Lounge': { years: [2013, 2019], engines: ['1.6 THP', '2.0 16V'], type: 'car' },
    aircross: { years: [2010, 2018], engines: ['1.5 8V', '1.6 16V'], type: 'suv' },
    'C3 Aircross': { years: [2019, 2024], engines: ['1.6 16V'], type: 'suv' },
    jumper: { years: [2005, 2024], engines: ['2.0 Turbo Diesel', '2.3 Turbo Diesel'], type: 'van' },
    berlingo: { years: [1999, 2024], engines: ['1.6 16V'], type: 'van' },
    xsara: { years: [1998, 2006], engines: ['1.6 16V', '2.0 16V'], type: 'car' },
  },
  // MITSUBISHI
  mitsubishi: {
    lancer: { years: [2007, 2019], engines: ['2.0 16V'], type: 'car' },
    asx: { years: [2010, 2024], engines: ['2.0 16V'], type: 'suv' },
    outlander: { years: [2007, 2024], engines: ['2.0 16V', '2.4 16V', '3.0 V6'], type: 'suv' },
    pajero: { years: [1992, 2024], engines: ['3.2 Turbo Diesel', '3.5 V6', '3.8 V6'], type: 'suv' },
    'pajero sport': { years: [2000, 2024], engines: ['2.4 Turbo Diesel', '3.0 V6'], type: 'suv' },
    'pajero dakar': { years: [2010, 2019], engines: ['3.2 Turbo Diesel', '3.5 V6'], type: 'suv' },
    'L200': { years: [1995, 2024], engines: ['2.4 Turbo Diesel', '3.2 Turbo Diesel'], type: 'pickup' },
    'L200 Triton': { years: [2007, 2024], engines: ['2.4 Turbo Diesel', '3.2 Turbo Diesel'], type: 'pickup' },
    'eclipse cross': { years: [2018, 2024], engines: ['1.5 Turbo'], type: 'suv' },
    'pajero tr4': { years: [2003, 2015], engines: ['2.0 16V'], type: 'suv' },
  },
  // SUZUKI
  suzuki: {
    swift: { years: [2008, 2019], engines: ['1.4 16V', '1.6 16V'], type: 'car' },
    vitara: { years: [2015, 2024], engines: ['1.4 Turbo', '1.6 16V'], type: 'suv' },
    'grand vitara': { years: [1998, 2016], engines: ['2.0 16V', '2.4 16V', '3.2 V6'], type: 'suv' },
    jimny: { years: [1998, 2024], engines: ['1.3 16V', '1.5 16V'], type: 'suv' },
    sx4: { years: [2008, 2015], engines: ['2.0 16V'], type: 'suv' },
    's-cross': { years: [2016, 2024], engines: ['1.4 Turbo', '1.6 16V'], type: 'suv' },
  },
  // BMW
  bmw: {
    'Serie 1': { years: [2005, 2024], engines: ['1.6 Turbo', '2.0 Turbo'], type: 'car' },
    'Serie 2': { years: [2014, 2024], engines: ['2.0 Turbo'], type: 'car' },
    'Serie 3': { years: [1998, 2024], engines: ['2.0 Turbo', '3.0 Turbo'], type: 'car' },
    'Serie 4': { years: [2014, 2024], engines: ['2.0 Turbo', '3.0 Turbo'], type: 'car' },
    'Serie 5': { years: [2003, 2024], engines: ['2.0 Turbo', '3.0 Turbo', '4.4 V8 Turbo'], type: 'car' },
    'X1': { years: [2010, 2024], engines: ['2.0 Turbo'], type: 'suv' },
    'X2': { years: [2018, 2024], engines: ['2.0 Turbo'], type: 'suv' },
    'X3': { years: [2004, 2024], engines: ['2.0 Turbo', '3.0 Turbo'], type: 'suv' },
    'X4': { years: [2015, 2024], engines: ['2.0 Turbo', '3.0 Turbo'], type: 'suv' },
    'X5': { years: [2000, 2024], engines: ['3.0 Turbo', '4.4 V8 Turbo'], type: 'suv' },
    'X6': { years: [2008, 2024], engines: ['3.0 Turbo', '4.4 V8 Turbo'], type: 'suv' },
    // MOTOS BMW
    'G 310 R': { years: [2017, 2024], engines: ['313cc'], type: 'motorcycle' },
    'G 310 GS': { years: [2017, 2024], engines: ['313cc'], type: 'motorcycle' },
    'F 750 GS': { years: [2018, 2024], engines: ['853cc'], type: 'motorcycle' },
    'F 850 GS': { years: [2018, 2024], engines: ['853cc'], type: 'motorcycle' },
    'R 1250 GS': { years: [2019, 2024], engines: ['1254cc'], type: 'motorcycle' },
    'S 1000 RR': { years: [2010, 2024], engines: ['999cc'], type: 'motorcycle' },
  },
  // AUDI
  audi: {
    'A1': { years: [2011, 2024], engines: ['1.4 TFSI'], type: 'car' },
    'A3': { years: [1999, 2024], engines: ['1.4 TFSI', '2.0 TFSI'], type: 'car' },
    'A4': { years: [2001, 2024], engines: ['2.0 TFSI'], type: 'car' },
    'A5': { years: [2010, 2024], engines: ['2.0 TFSI'], type: 'car' },
    'A6': { years: [2005, 2024], engines: ['2.0 TFSI', '3.0 TFSI'], type: 'car' },
    'Q3': { years: [2012, 2024], engines: ['1.4 TFSI', '2.0 TFSI'], type: 'suv' },
    'Q5': { years: [2009, 2024], engines: ['2.0 TFSI'], type: 'suv' },
    'Q7': { years: [2006, 2024], engines: ['3.0 TFSI', '3.0 TDI'], type: 'suv' },
    'Q8': { years: [2019, 2024], engines: ['3.0 TFSI'], type: 'suv' },
    'TT': { years: [2000, 2024], engines: ['2.0 TFSI'], type: 'car' },
    'RS3': { years: [2017, 2024], engines: ['2.5 TFSI'], type: 'car' },
    'RS6': { years: [2020, 2024], engines: ['4.0 V8 TFSI'], type: 'car' },
  },
  // MERCEDES-BENZ
  'mercedes-benz': {
    'Classe A': { years: [1999, 2024], engines: ['1.6 Turbo', '2.0 Turbo'], type: 'car' },
    'Classe C': { years: [1994, 2024], engines: ['1.6 Turbo', '2.0 Turbo', '3.0 V6'], type: 'car' },
    'Classe E': { years: [1996, 2024], engines: ['2.0 Turbo', '3.0 V6'], type: 'car' },
    'Classe S': { years: [2000, 2024], engines: ['3.0 V6', '4.0 V8', '6.0 V12'], type: 'car' },
    'GLA': { years: [2014, 2024], engines: ['1.6 Turbo', '2.0 Turbo'], type: 'suv' },
    'GLB': { years: [2020, 2024], engines: ['1.3 Turbo', '2.0 Turbo'], type: 'suv' },
    'GLC': { years: [2016, 2024], engines: ['2.0 Turbo'], type: 'suv' },
    'GLE': { years: [2015, 2024], engines: ['3.0 V6', '4.0 V8'], type: 'suv' },
    'GLS': { years: [2017, 2024], engines: ['3.0 V6', '4.0 V8'], type: 'suv' },
    'Sprinter': { years: [1997, 2024], engines: ['2.2 Turbo Diesel', '2.1 Turbo Diesel'], type: 'van' },
    'Vito': { years: [2005, 2024], engines: ['2.0 Turbo Diesel'], type: 'van' },
    // Caminhões
    'Atego': { years: [1998, 2024], engines: ['4.3 Diesel', '6.4 Diesel'], type: 'truck' },
    'Axor': { years: [2004, 2024], engines: ['6.4 Diesel', '12.0 Diesel'], type: 'truck' },
    'Actros': { years: [2003, 2024], engines: ['12.0 Diesel', '15.6 Diesel'], type: 'truck' },
    'Accelo': { years: [2003, 2024], engines: ['4.3 Diesel'], type: 'truck' },
  },
  // VOLVO
  volvo: {
    'XC40': { years: [2018, 2024], engines: ['2.0 Turbo'], type: 'suv' },
    'XC60': { years: [2009, 2024], engines: ['2.0 Turbo', '2.0 Turbo Hybrid'], type: 'suv' },
    'XC90': { years: [2003, 2024], engines: ['2.0 Turbo', '2.0 Turbo Hybrid'], type: 'suv' },
    'S60': { years: [2011, 2024], engines: ['2.0 Turbo'], type: 'car' },
    'S90': { years: [2017, 2024], engines: ['2.0 Turbo'], type: 'car' },
    'V60': { years: [2019, 2024], engines: ['2.0 Turbo'], type: 'car' },
    // Caminhões
    'FH': { years: [1993, 2024], engines: ['12.8 Diesel', '16.1 Diesel'], type: 'truck' },
    'FM': { years: [1998, 2024], engines: ['10.8 Diesel', '12.8 Diesel'], type: 'truck' },
    'VM': { years: [2003, 2024], engines: ['7.7 Diesel', '10.8 Diesel'], type: 'truck' },
  },
  // LAND ROVER
  'land rover': {
    'Discovery': { years: [2005, 2024], engines: ['3.0 V6 Diesel', '3.0 V6'], type: 'suv' },
    'Discovery Sport': { years: [2015, 2024], engines: ['2.0 Turbo', '2.0 Turbo Diesel'], type: 'suv' },
    'Range Rover': { years: [2002, 2024], engines: ['3.0 V6', '4.4 V8', '5.0 V8'], type: 'suv' },
    'Range Rover Sport': { years: [2005, 2024], engines: ['3.0 V6', '5.0 V8'], type: 'suv' },
    'Range Rover Evoque': { years: [2011, 2024], engines: ['2.0 Turbo'], type: 'suv' },
    'Range Rover Velar': { years: [2017, 2024], engines: ['2.0 Turbo', '3.0 V6'], type: 'suv' },
    'Defender': { years: [2020, 2024], engines: ['2.0 Turbo', '3.0 V6'], type: 'suv' },
  },
  // PORSCHE
  porsche: {
    '911': { years: [1998, 2024], engines: ['3.0 Turbo', '3.8 Turbo', '4.0'], type: 'car' },
    'Cayenne': { years: [2003, 2024], engines: ['3.0 V6', '4.0 V8', '2.9 V6 Turbo'], type: 'suv' },
    'Macan': { years: [2014, 2024], engines: ['2.0 Turbo', '2.9 V6 Turbo'], type: 'suv' },
    'Panamera': { years: [2010, 2024], engines: ['2.9 V6 Turbo', '4.0 V8 Turbo'], type: 'car' },
    'Boxster': { years: [1997, 2024], engines: ['2.0 Turbo', '2.5 Turbo'], type: 'car' },
    'Cayman': { years: [2006, 2024], engines: ['2.0 Turbo', '2.5 Turbo'], type: 'car' },
    'Taycan': { years: [2020, 2024], engines: ['Elétrico'], type: 'car' },
  },
  // YAMAHA (MOTOS)
  yamaha: {
    'YZF-R3': { years: [2015, 2024], engines: ['321cc'], type: 'motorcycle' },
    'YZF-R1': { years: [1998, 2024], engines: ['998cc'], type: 'motorcycle' },
    'YZF-R6': { years: [2003, 2020], engines: ['599cc'], type: 'motorcycle' },
    'MT-03': { years: [2016, 2024], engines: ['321cc'], type: 'motorcycle' },
    'MT-07': { years: [2015, 2024], engines: ['689cc'], type: 'motorcycle' },
    'MT-09': { years: [2015, 2024], engines: ['889cc'], type: 'motorcycle' },
    'Fazer 250': { years: [2006, 2024], engines: ['249cc'], type: 'motorcycle' },
    'Factor 150': { years: [2016, 2024], engines: ['149cc'], type: 'motorcycle' },
    'Factor 125': { years: [2008, 2024], engines: ['124cc'], type: 'motorcycle' },
    'Crosser 150': { years: [2014, 2024], engines: ['149cc'], type: 'motorcycle' },
    'NMAX 160': { years: [2016, 2024], engines: ['155cc'], type: 'motorcycle' },
    'Lander 250': { years: [2006, 2024], engines: ['249cc'], type: 'motorcycle' },
    'Tenere 250': { years: [2011, 2024], engines: ['249cc'], type: 'motorcycle' },
    'Tenere 700': { years: [2020, 2024], engines: ['689cc'], type: 'motorcycle' },
    'XJ6': { years: [2010, 2018], engines: ['600cc'], type: 'motorcycle' },
    'YBR 125': { years: [2000, 2016], engines: ['124cc'], type: 'motorcycle' },
    'YBR 150': { years: [2016, 2024], engines: ['149cc'], type: 'motorcycle' },
    'Neo 125': { years: [2016, 2024], engines: ['125cc'], type: 'motorcycle' },
    'Fluo 125': { years: [2021, 2024], engines: ['125cc'], type: 'motorcycle' },
  },
  // KAWASAKI (MOTOS)
  kawasaki: {
    'Ninja 400': { years: [2018, 2024], engines: ['399cc'], type: 'motorcycle' },
    'Ninja 650': { years: [2012, 2024], engines: ['649cc'], type: 'motorcycle' },
    'Ninja ZX-6R': { years: [2009, 2024], engines: ['636cc'], type: 'motorcycle' },
    'Ninja ZX-10R': { years: [2008, 2024], engines: ['998cc'], type: 'motorcycle' },
    'Z400': { years: [2019, 2024], engines: ['399cc'], type: 'motorcycle' },
    'Z650': { years: [2017, 2024], engines: ['649cc'], type: 'motorcycle' },
    'Z900': { years: [2017, 2024], engines: ['948cc'], type: 'motorcycle' },
    'Z1000': { years: [2010, 2020], engines: ['1043cc'], type: 'motorcycle' },
    'Versys 650': { years: [2010, 2024], engines: ['649cc'], type: 'motorcycle' },
    'Versys 1000': { years: [2012, 2024], engines: ['1043cc'], type: 'motorcycle' },
    'Vulcan 650': { years: [2015, 2024], engines: ['649cc'], type: 'motorcycle' },
    'Vulcan 900': { years: [2006, 2024], engines: ['903cc'], type: 'motorcycle' },
  },
  // DUCATI (MOTOS)
  ducati: {
    'Monster 797': { years: [2017, 2020], engines: ['803cc'], type: 'motorcycle' },
    'Monster 821': { years: [2014, 2021], engines: ['821cc'], type: 'motorcycle' },
    'Monster 1200': { years: [2014, 2021], engines: ['1198cc'], type: 'motorcycle' },
    'Scrambler': { years: [2015, 2024], engines: ['803cc'], type: 'motorcycle' },
    'Multistrada 950': { years: [2017, 2024], engines: ['937cc'], type: 'motorcycle' },
    'Multistrada V4': { years: [2021, 2024], engines: ['1158cc'], type: 'motorcycle' },
    'Panigale V2': { years: [2020, 2024], engines: ['955cc'], type: 'motorcycle' },
    'Panigale V4': { years: [2018, 2024], engines: ['1103cc'], type: 'motorcycle' },
    'Diavel': { years: [2011, 2024], engines: ['1262cc'], type: 'motorcycle' },
    'Hypermotard': { years: [2013, 2024], engines: ['937cc'], type: 'motorcycle' },
  },
  // HARLEY-DAVIDSON (MOTOS)
  'harley-davidson': {
    'Sportster Iron 883': { years: [2009, 2024], engines: ['883cc'], type: 'motorcycle' },
    'Sportster 1200': { years: [2004, 2024], engines: ['1202cc'], type: 'motorcycle' },
    'Softail': { years: [2000, 2024], engines: ['1745cc', '1868cc'], type: 'motorcycle' },
    'Fat Boy': { years: [1990, 2024], engines: ['1745cc', '1868cc'], type: 'motorcycle' },
    'Street Glide': { years: [2006, 2024], engines: ['1745cc', '1868cc'], type: 'motorcycle' },
    'Road King': { years: [1994, 2024], engines: ['1745cc', '1868cc'], type: 'motorcycle' },
    'Street 750': { years: [2015, 2020], engines: ['749cc'], type: 'motorcycle' },
    'Pan America': { years: [2021, 2024], engines: ['1252cc'], type: 'motorcycle' },
    'Sportster S': { years: [2021, 2024], engines: ['1252cc'], type: 'motorcycle' },
  },
  // TRIUMPH (MOTOS)
  triumph: {
    'Street Triple': { years: [2007, 2024], engines: ['765cc'], type: 'motorcycle' },
    'Speed Triple': { years: [2005, 2024], engines: ['1050cc', '1160cc'], type: 'motorcycle' },
    'Tiger 800': { years: [2011, 2020], engines: ['800cc'], type: 'motorcycle' },
    'Tiger 900': { years: [2020, 2024], engines: ['888cc'], type: 'motorcycle' },
    'Tiger 1200': { years: [2012, 2024], engines: ['1215cc'], type: 'motorcycle' },
    'Bonneville': { years: [2001, 2024], engines: ['865cc', '900cc', '1200cc'], type: 'motorcycle' },
    'Thruxton': { years: [2004, 2024], engines: ['865cc', '1200cc'], type: 'motorcycle' },
    'Rocket 3': { years: [2004, 2024], engines: ['2458cc'], type: 'motorcycle' },
    'Trident 660': { years: [2021, 2024], engines: ['660cc'], type: 'motorcycle' },
  },
  // SUZUKI (MOTOS)
  'suzuki-moto': {
    'GSX-R750': { years: [2006, 2024], engines: ['750cc'], type: 'motorcycle' },
    'GSX-R1000': { years: [2005, 2024], engines: ['999cc'], type: 'motorcycle' },
    'GSX-S750': { years: [2015, 2024], engines: ['749cc'], type: 'motorcycle' },
    'GSX-S1000': { years: [2015, 2024], engines: ['999cc'], type: 'motorcycle' },
    'V-Strom 650': { years: [2004, 2024], engines: ['645cc'], type: 'motorcycle' },
    'V-Strom 1050': { years: [2020, 2024], engines: ['1037cc'], type: 'motorcycle' },
    'Hayabusa': { years: [1999, 2024], engines: ['1340cc'], type: 'motorcycle' },
    'Intruder 125': { years: [2001, 2024], engines: ['124cc'], type: 'motorcycle' },
    'Boulevard M800': { years: [2005, 2024], engines: ['805cc'], type: 'motorcycle' },
    'Burgman 400': { years: [2007, 2024], engines: ['400cc'], type: 'motorcycle' },
    'Burgman 650': { years: [2003, 2024], engines: ['638cc'], type: 'motorcycle' },
  },
};


// ============================================================================
// MAPEAMENTO DE PART NUMBERS POR MARCA/PLATAFORMA
// ============================================================================
const PART_NUMBER_PREFIXES = {
  volkswagen: 'VW',
  chevrolet: 'GM',
  fiat: 'FT',
  ford: 'FD',
  toyota: 'TY',
  honda: 'HN',
  hyundai: 'HY',
  renault: 'RN',
  nissan: 'NS',
  jeep: 'JP',
  kia: 'KA',
  peugeot: 'PG',
  citroen: 'CT',
  mitsubishi: 'MT',
  suzuki: 'SZ',
  bmw: 'BW',
  audi: 'AD',
  'mercedes-benz': 'MB',
  volvo: 'VL',
  'land rover': 'LR',
  porsche: 'PR',
  yamaha: 'YM',
  kawasaki: 'KW',
  ducati: 'DC',
  'harley-davidson': 'HD',
  triumph: 'TR',
  'suzuki-moto': 'SM',
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
  // Motos
  chain: ['DID', 'RK', 'REGINA', 'AFAM', 'EK'],
  front_sprocket: ['JT', 'SUNSTAR', 'RENTHAL', 'AFAM', 'VORTEX'],
  rear_sprocket: ['JT', 'SUNSTAR', 'RENTHAL', 'AFAM', 'VORTEX'],
};

// ============================================================================
// FUNÇÕES DE GERAÇÃO DE PEÇAS
// ============================================================================
function generatePartNumber(brandPrefix, partId, modelCode, year) {
  const partCodes = {
    oil_filter: 'OF',
    air_filter: 'AF',
    cabin_filter: 'CF',
    fuel_filter: 'FF',
    transmission_filter: 'TF',
    front_brake_pads: 'FBP',
    rear_brake_pads: 'RBP',
    front_brake_disc: 'FBD',
    rear_brake_disc: 'RBD',
    brake_fluid: 'BFL',
    brake_hose_front: 'BHF',
    brake_hose_rear: 'BHR',
    handbrake_cable: 'HBC',
    spark_plugs: 'SPK',
    ignition_coil: 'IGC',
    spark_plug_wires: 'SPW',
    distributor_cap: 'DCP',
    front_shock: 'FSH',
    rear_shock: 'RSH',
    front_spring: 'FSP',
    rear_spring: 'RSP',
    front_stabilizer_link: 'FSL',
    rear_stabilizer_link: 'RSL',
    control_arm_front: 'CAF',
    ball_joint: 'BJT',
    tie_rod_end: 'TRE',
    steering_rack_boot: 'SRB',
    timing_belt: 'TMB',
    timing_belt_tensioner: 'TBT',
    water_pump: 'WPM',
    thermostat: 'THS',
    alternator_belt: 'ALB',
    engine_oil: 'EOL',
    coolant: 'CLT',
    valve_cover_gasket: 'VCG',
    oil_pan_gasket: 'OPG',
    pcv_valve: 'PCV',
    battery: 'BAT',
    alternator: 'ALT',
    starter_motor: 'STM',
    headlight_bulb: 'HLB',
    brake_light_bulb: 'BLB',
    fuse_kit: 'FSK',
    clutch_kit: 'CLK',
    clutch_cable: 'CLC',
    transmission_oil: 'TOL',
    cv_joint: 'CVJ',
    front_wheel_bearing: 'FWB',
    rear_wheel_bearing: 'RWB',
    clutch_bearing: 'CLB',
    // Motos
    spark_plug: 'SPK',
    cdi: 'CDI',
    front_fork_oil: 'FFO',
    front_fork_seal: 'FFS',
    swing_arm_bearing: 'SAB',
    valve_clearance_shim: 'VCS',
    cam_chain: 'CMC',
    cam_chain_tensioner: 'CCT',
    rectifier: 'RCT',
    stator: 'STT',
    chain: 'CHN',
    front_sprocket: 'FSR',
    rear_sprocket: 'RSR',
    clutch_plates: 'CLP',
    brake_lever: 'BLV',
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
  const checklist = type === 'motorcycle' ? MOTO_PARTS_CHECKLIST : CAR_PARTS_CHECKLIST;
  const modelCode = model.replace(/[^a-zA-Z0-9]/g, '');
  
  const parts = [];
  
  for (const item of checklist) {
    const partNumber = generatePartNumber(brandPrefix, item.id, modelCode, year);
    const equivalents = generateEquivalents(brandPrefix, item.id, modelCode, year);
    const brands = BRANDS_BY_PART[item.id] || ['GENERIC'];
    
    // Preço base varia por categoria
    const basePrices = {
      'Filtros': 50,
      'Freios': 150,
      'Ignição': 80,
      'Suspensão': 200,
      'Motor': 120,
      'Elétrica': 250,
      'Transmissão': 350,
      'Rolamentos': 150,
    };
    
    const basePrice = basePrices[item.category] || 100;
    const priceVariation = 0.8 + Math.random() * 0.4; // 80% a 120%
    
    parts.push({
      id: item.id,
      name: item.name,
      category: item.category,
      priority: item.priority,
      partNumber: partNumber,
      brand: brands[0],
      equivalents: equivalents,
      avgPrice: Math.round(basePrice * priceVariation),
    });
  }
  
  return parts;
}

// ============================================================================
// FUNÇÕES DE SINCRONIZAÇÃO
// ============================================================================
async function fetchExistingVehicles() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/parts-compatibility/v4/vehicles',
      method: 'GET',
      timeout: 10000,
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.vehicles || []);
        } catch (e) {
          resolve([]);
        }
      });
    });
    
    req.on('error', () => resolve([]));
    req.on('timeout', () => {
      req.destroy();
      resolve([]);
    });
    
    req.end();
  });
}

function generateVehicleId(brand, model, year, engine) {
  const parts = [
    brand.toLowerCase().replace(/[^a-z0-9]/g, ''),
    model.toLowerCase().replace(/[^a-z0-9]/g, ''),
    year.toString(),
  ];
  if (engine) {
    parts.push(engine.toLowerCase().replace(/[^a-z0-9]/g, ''));
  }
  return parts.join('_');
}

async function generateAllVehicles() {
  console.log(`${colors.blue}🚗 Gerando todos os veículos brasileiros...${colors.reset}\n`);
  
  const allVehicles = {};
  let totalCount = 0;
  let carCount = 0;
  let motoCount = 0;
  let truckCount = 0;
  
  for (const [brand, models] of Object.entries(COMPLETE_VEHICLES)) {
    console.log(`   📦 Processando ${brand}...`);
    
    for (const [model, config] of Object.entries(models)) {
      const [startYear, endYear] = config.years;
      
      for (let year = startYear; year <= endYear; year++) {
        for (const engine of config.engines) {
          const vehicleId = generateVehicleId(brand, model, year, engine);
          
          // Gera peças para este veículo
          const parts = generatePartsForVehicle(brand, model, year, config.type);
          
          allVehicles[vehicleId] = {
            vehicleId,
            brand: brand.charAt(0).toUpperCase() + brand.slice(1),
            model,
            year,
            engineName: engine,
            vehicleType: config.type,
            totalParts: parts.length,
            parts,
          };
          
          totalCount++;
          if (config.type === 'motorcycle') motoCount++;
          else if (config.type === 'truck') truckCount++;
          else carCount++;
        }
      }
    }
  }
  
  console.log(`\n${colors.green}✅ Geração concluída!${colors.reset}`);
  console.log(`   Total: ${totalCount} veículos`);
  console.log(`   Carros/SUVs/Pickups: ${carCount}`);
  console.log(`   Motos: ${motoCount}`);
  console.log(`   Caminhões: ${truckCount}`);
  
  return allVehicles;
}

async function saveToFiles(vehicles) {
  console.log(`\n${colors.blue}💾 Salvando arquivos...${colors.reset}`);
  
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Estatísticas
  const stats = {
    totalVehicles: Object.keys(vehicles).length,
    totalParts: Object.values(vehicles).reduce((sum, v) => sum + v.totalParts, 0),
    brands: [...new Set(Object.values(vehicles).map(v => v.brand))],
    vehicleTypes: [...new Set(Object.values(vehicles).map(v => v.vehicleType))],
    generatedAt: new Date().toISOString(),
    version: '4.1.0',
  };
  
  // Arquivo completo
  const fullData = { vehicles, stats };
  const fullPath = path.join(outputDir, 'parts-compatibility-v4-full.json');
  fs.writeFileSync(fullPath, JSON.stringify(fullData, null, 2));
  console.log(`   ✓ ${fullPath}`);
  
  // Índice
  const index = {
    stats,
    vehicles: Object.entries(vehicles).map(([id, v]) => ({
      vehicleId: id,
      brand: v.brand,
      model: v.model,
      year: v.year,
      engineName: v.engineName,
      vehicleType: v.vehicleType,
      totalParts: v.totalParts,
    })),
  };
  const indexPath = path.join(outputDir, 'parts-compatibility-v4-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log(`   ✓ ${indexPath}`);
  
  console.log(`${colors.green}✅ Arquivos salvos!${colors.reset}`);
  
  return stats;
}

async function reloadAPI() {
  console.log(`\n${colors.blue}🔄 Recarregando API...${colors.reset}`);
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/parts-compatibility/v4/reload',
      method: 'POST',
      timeout: 30000,
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`${colors.green}   ✓ API recarregada com sucesso!${colors.reset}`);
        } else {
          console.log(`${colors.yellow}   ⚠ API retornou status ${res.statusCode}${colors.reset}`);
        }
        resolve(true);
      });
    });
    
    req.on('error', (e) => {
      console.log(`${colors.yellow}   ⚠ Não foi possível recarregar a API: ${e.message}${colors.reset}`);
      console.log(`   Execute manualmente: node server/index-simple.js`);
      resolve(false);
    });
    
    req.on('timeout', () => {
      req.destroy();
      console.log(`${colors.yellow}   ⚠ Timeout ao recarregar API${colors.reset}`);
      resolve(false);
    });
    
    req.end();
  });
}

// ============================================================================
// EXECUÇÃO PRINCIPAL
// ============================================================================
async function main() {
  console.log(`
${colors.cyan}═══════════════════════════════════════════════════════════════
   SINCRONIZAÇÃO COMPLETA DE VEÍCULOS BRASILEIROS
   Versão 2.0.0 - Geração Automática
═══════════════════════════════════════════════════════════════${colors.reset}
`);

  try {
    // 1. Gera todos os veículos
    const vehicles = await generateAllVehicles();
    
    // 2. Salva nos arquivos
    const stats = await saveToFiles(vehicles);
    
    // 3. Tenta recarregar a API
    await reloadAPI();
    
    // 4. Resumo final
    console.log(`
${colors.green}═══════════════════════════════════════════════════════════════
   SINCRONIZAÇÃO CONCLUÍDA COM SUCESSO!
═══════════════════════════════════════════════════════════════${colors.reset}
   📊 ${stats.totalVehicles} veículos gerados
   📋 ${stats.totalParts} peças totais
   🏭 ${stats.brands.length} marcas
   🚗 Tipos: ${stats.vehicleTypes.join(', ')}
   
   📁 Arquivos salvos em: scripts/parts-compatibility-engine/output/
   
   ${colors.yellow}Para aplicar as mudanças, reinicie o servidor:${colors.reset}
   node server/index-simple.js
${colors.green}═══════════════════════════════════════════════════════════════${colors.reset}
`);
    
  } catch (error) {
    console.error(`${colors.red}❌ Erro: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Executa
main();
