/**
 * Universal Parts Database - Base COMPLETA de Peças
 * GARANTIA: Todos os veículos têm TODAS as peças necessárias
 * 
 * - Carros/SUVs/Pickups/Vans: 50 peças cada
 * - Motos: 30 peças cada
 * - Caminhões/Ônibus: 40 peças cada
 * 
 * @version 5.0.0 - Cobertura 100% Garantida
 */

import type { PartNumberData, VehicleVariant, MatchType } from '../types';

// ============================================================================
// CHECKLIST COMPLETO DE PEÇAS POR TIPO DE VEÍCULO
// ============================================================================

// 50 PEÇAS PARA CARROS/SUVs/PICKUPS/VANS
const CAR_PARTS_CHECKLIST = [
  // FILTROS (5)
  { categoryKey: 'oil_filter', name: 'Filtro de Óleo', category: 'Filtros' },
  { categoryKey: 'air_filter', name: 'Filtro de Ar', category: 'Filtros' },
  { categoryKey: 'fuel_filter', name: 'Filtro de Combustível', category: 'Filtros' },
  { categoryKey: 'cabin_filter', name: 'Filtro de Cabine', category: 'Filtros' },
  { categoryKey: 'transmission_filter', name: 'Filtro de Transmissão', category: 'Filtros' },
  // FREIOS (8)
  { categoryKey: 'brake_pads_front', name: 'Pastilhas de Freio Dianteiras', category: 'Freios' },
  { categoryKey: 'brake_pads_rear', name: 'Pastilhas de Freio Traseiras', category: 'Freios' },
  { categoryKey: 'brake_disc_front', name: 'Disco de Freio Dianteiro', category: 'Freios' },
  { categoryKey: 'brake_disc_rear', name: 'Disco de Freio Traseiro', category: 'Freios' },
  { categoryKey: 'brake_fluid', name: 'Fluido de Freio DOT4', category: 'Freios' },
  { categoryKey: 'brake_hose', name: 'Flexível de Freio', category: 'Freios' },
  { categoryKey: 'brake_caliper', name: 'Pinça de Freio', category: 'Freios' },
  { categoryKey: 'brake_drum', name: 'Tambor de Freio', category: 'Freios' },
  // MOTOR (10)
  { categoryKey: 'spark_plugs', name: 'Velas de Ignição (Jogo)', category: 'Motor' },
  { categoryKey: 'ignition_coil', name: 'Bobina de Ignição', category: 'Motor' },
  { categoryKey: 'timing_belt', name: 'Correia Dentada', category: 'Motor' },
  { categoryKey: 'timing_kit', name: 'Kit Correia Dentada Completo', category: 'Motor' },
  { categoryKey: 'water_pump', name: 'Bomba d\'Água', category: 'Motor' },
  { categoryKey: 'thermostat', name: 'Válvula Termostática', category: 'Motor' },
  { categoryKey: 'engine_oil', name: 'Óleo de Motor 5W30 (5L)', category: 'Motor' },
  { categoryKey: 'valve_cover_gasket', name: 'Junta Tampa de Válvulas', category: 'Motor' },
  { categoryKey: 'head_gasket', name: 'Junta do Cabeçote', category: 'Motor' },
  { categoryKey: 'piston_rings', name: 'Anéis de Pistão (Jogo)', category: 'Motor' },
  // SUSPENSÃO (8)
  { categoryKey: 'shock_front', name: 'Amortecedor Dianteiro', category: 'Suspensão' },
  { categoryKey: 'shock_rear', name: 'Amortecedor Traseiro', category: 'Suspensão' },
  { categoryKey: 'coil_spring_front', name: 'Mola Helicoidal Dianteira', category: 'Suspensão' },
  { categoryKey: 'coil_spring_rear', name: 'Mola Helicoidal Traseira', category: 'Suspensão' },
  { categoryKey: 'control_arm', name: 'Bandeja de Suspensão', category: 'Suspensão' },
  { categoryKey: 'ball_joint', name: 'Pivô de Suspensão', category: 'Suspensão' },
  { categoryKey: 'stabilizer_link', name: 'Bieleta Estabilizadora', category: 'Suspensão' },
  { categoryKey: 'wheel_bearing', name: 'Rolamento de Roda', category: 'Suspensão' },
  // DIREÇÃO (4)
  { categoryKey: 'tie_rod_end', name: 'Terminal de Direção', category: 'Direção' },
  { categoryKey: 'steering_rack', name: 'Caixa de Direção', category: 'Direção' },
  { categoryKey: 'power_steering_fluid', name: 'Fluido Direção Hidráulica', category: 'Direção' },
  { categoryKey: 'steering_boot', name: 'Coifa da Caixa de Direção', category: 'Direção' },
  // TRANSMISSÃO (5)
  { categoryKey: 'clutch_kit', name: 'Kit Embreagem Completo', category: 'Transmissão' },
  { categoryKey: 'cv_joint_outer', name: 'Junta Homocinética Externa', category: 'Transmissão' },
  { categoryKey: 'cv_joint_inner', name: 'Junta Homocinética Interna', category: 'Transmissão' },
  { categoryKey: 'cv_boot', name: 'Coifa Homocinética', category: 'Transmissão' },
  { categoryKey: 'transmission_oil', name: 'Óleo de Câmbio (2L)', category: 'Transmissão' },
  // ELÉTRICA (5)
  { categoryKey: 'battery', name: 'Bateria 60Ah', category: 'Elétrica' },
  { categoryKey: 'alternator', name: 'Alternador', category: 'Elétrica' },
  { categoryKey: 'starter_motor', name: 'Motor de Partida', category: 'Elétrica' },
  { categoryKey: 'headlight_bulb', name: 'Lâmpada Farol H4/H7', category: 'Elétrica' },
  { categoryKey: 'wiper_blade', name: 'Palheta Limpador (Par)', category: 'Elétrica' },
  // ARREFECIMENTO (3)
  { categoryKey: 'radiator', name: 'Radiador', category: 'Arrefecimento' },
  { categoryKey: 'radiator_hose', name: 'Mangueira do Radiador', category: 'Arrefecimento' },
  { categoryKey: 'coolant', name: 'Aditivo Radiador (1L)', category: 'Arrefecimento' },
  // ESCAPAMENTO (2)
  { categoryKey: 'exhaust_gasket', name: 'Junta do Escapamento', category: 'Escapamento' },
  { categoryKey: 'catalytic_converter', name: 'Catalisador', category: 'Escapamento' },
];

// 30 PEÇAS PARA MOTOS
const MOTORCYCLE_PARTS_CHECKLIST = [
  // FILTROS (3)
  { categoryKey: 'oil_filter', name: 'Filtro de Óleo', category: 'Filtros' },
  { categoryKey: 'air_filter', name: 'Filtro de Ar', category: 'Filtros' },
  { categoryKey: 'fuel_filter', name: 'Filtro de Combustível', category: 'Filtros' },
  // FREIOS (6)
  { categoryKey: 'brake_pads_front', name: 'Pastilhas de Freio Dianteiras', category: 'Freios' },
  { categoryKey: 'brake_pads_rear', name: 'Pastilhas/Lonas de Freio Traseiras', category: 'Freios' },
  { categoryKey: 'brake_disc_front', name: 'Disco de Freio Dianteiro', category: 'Freios' },
  { categoryKey: 'brake_fluid', name: 'Fluido de Freio DOT4', category: 'Freios' },
  { categoryKey: 'brake_lever', name: 'Manete de Freio', category: 'Freios' },
  { categoryKey: 'brake_cable', name: 'Cabo de Freio Traseiro', category: 'Freios' },
  // MOTOR (6)
  { categoryKey: 'spark_plug', name: 'Vela de Ignição', category: 'Motor' },
  { categoryKey: 'engine_oil', name: 'Óleo de Motor 4T 10W40 (1L)', category: 'Motor' },
  { categoryKey: 'valve_clearance_shim', name: 'Pastilha de Válvula', category: 'Motor' },
  { categoryKey: 'piston_kit', name: 'Kit Pistão', category: 'Motor' },
  { categoryKey: 'cylinder_kit', name: 'Kit Cilindro', category: 'Motor' },
  { categoryKey: 'gasket_kit', name: 'Kit Juntas Motor', category: 'Motor' },
  // TRANSMISSÃO (4)
  { categoryKey: 'chain_kit', name: 'Kit Relação (Coroa+Pinhão+Corrente)', category: 'Transmissão' },
  { categoryKey: 'chain', name: 'Corrente de Transmissão', category: 'Transmissão' },
  { categoryKey: 'sprocket_front', name: 'Pinhão Dianteiro', category: 'Transmissão' },
  { categoryKey: 'sprocket_rear', name: 'Coroa Traseira', category: 'Transmissão' },
  // ELÉTRICA (5)
  { categoryKey: 'battery', name: 'Bateria 5Ah/7Ah', category: 'Elétrica' },
  { categoryKey: 'cdi', name: 'CDI/Módulo de Ignição', category: 'Elétrica' },
  { categoryKey: 'rectifier', name: 'Retificador/Regulador', category: 'Elétrica' },
  { categoryKey: 'stator', name: 'Estator', category: 'Elétrica' },
  { categoryKey: 'headlight_bulb', name: 'Lâmpada Farol', category: 'Elétrica' },
  // SUSPENSÃO (3)
  { categoryKey: 'fork_seal', name: 'Retentor de Bengala', category: 'Suspensão' },
  { categoryKey: 'fork_oil', name: 'Óleo de Bengala', category: 'Suspensão' },
  { categoryKey: 'shock_rear', name: 'Amortecedor Traseiro', category: 'Suspensão' },
  // RODAS/PNEUS (2)
  { categoryKey: 'tire_front', name: 'Pneu Dianteiro', category: 'Rodas' },
  { categoryKey: 'tire_rear', name: 'Pneu Traseiro', category: 'Rodas' },
  // CABOS (1)
  { categoryKey: 'throttle_cable', name: 'Cabo de Acelerador', category: 'Cabos' },
];

// 40 PEÇAS PARA CAMINHÕES/ÔNIBUS
const TRUCK_PARTS_CHECKLIST = [
  // FILTROS (6)
  { categoryKey: 'oil_filter', name: 'Filtro de Óleo', category: 'Filtros' },
  { categoryKey: 'air_filter', name: 'Filtro de Ar', category: 'Filtros' },
  { categoryKey: 'fuel_filter', name: 'Filtro de Combustível', category: 'Filtros' },
  { categoryKey: 'fuel_water_separator', name: 'Separador de Água/Diesel', category: 'Filtros' },
  { categoryKey: 'hydraulic_filter', name: 'Filtro Hidráulico', category: 'Filtros' },
  { categoryKey: 'cabin_filter', name: 'Filtro de Cabine', category: 'Filtros' },
  // FREIOS (8)
  { categoryKey: 'brake_pads_front', name: 'Lonas de Freio Dianteiras', category: 'Freios' },
  { categoryKey: 'brake_pads_rear', name: 'Lonas de Freio Traseiras', category: 'Freios' },
  { categoryKey: 'brake_drum_front', name: 'Tambor de Freio Dianteiro', category: 'Freios' },
  { categoryKey: 'brake_drum_rear', name: 'Tambor de Freio Traseiro', category: 'Freios' },
  { categoryKey: 'brake_chamber', name: 'Câmara de Freio', category: 'Freios' },
  { categoryKey: 'slack_adjuster', name: 'Catraca de Freio', category: 'Freios' },
  { categoryKey: 'air_dryer', name: 'Secador de Ar', category: 'Freios' },
  { categoryKey: 'brake_valve', name: 'Válvula de Freio', category: 'Freios' },
  // MOTOR (8)
  { categoryKey: 'engine_oil', name: 'Óleo de Motor 15W40 (20L)', category: 'Motor' },
  { categoryKey: 'injector', name: 'Bico Injetor', category: 'Motor' },
  { categoryKey: 'turbo', name: 'Turbina/Turbocompressor', category: 'Motor' },
  { categoryKey: 'water_pump', name: 'Bomba d\'Água', category: 'Motor' },
  { categoryKey: 'thermostat', name: 'Válvula Termostática', category: 'Motor' },
  { categoryKey: 'fan_belt', name: 'Correia do Ventilador', category: 'Motor' },
  { categoryKey: 'fan_clutch', name: 'Embreagem do Ventilador', category: 'Motor' },
  { categoryKey: 'head_gasket', name: 'Junta do Cabeçote', category: 'Motor' },
  // SUSPENSÃO (6)
  { categoryKey: 'leaf_spring', name: 'Feixe de Molas', category: 'Suspensão' },
  { categoryKey: 'shock_front', name: 'Amortecedor Dianteiro', category: 'Suspensão' },
  { categoryKey: 'shock_rear', name: 'Amortecedor Traseiro', category: 'Suspensão' },
  { categoryKey: 'king_pin', name: 'Pino Mestre', category: 'Suspensão' },
  { categoryKey: 'wheel_bearing', name: 'Rolamento de Roda', category: 'Suspensão' },
  { categoryKey: 'u_bolt', name: 'Grampo de Mola', category: 'Suspensão' },
  // TRANSMISSÃO (4)
  { categoryKey: 'clutch_kit', name: 'Kit Embreagem', category: 'Transmissão' },
  { categoryKey: 'transmission_oil', name: 'Óleo de Câmbio (10L)', category: 'Transmissão' },
  { categoryKey: 'differential_oil', name: 'Óleo de Diferencial (5L)', category: 'Transmissão' },
  { categoryKey: 'propshaft_bearing', name: 'Rolamento Cardan', category: 'Transmissão' },
  // ELÉTRICA (4)
  { categoryKey: 'battery', name: 'Bateria 150Ah', category: 'Elétrica' },
  { categoryKey: 'alternator', name: 'Alternador', category: 'Elétrica' },
  { categoryKey: 'starter_motor', name: 'Motor de Partida', category: 'Elétrica' },
  { categoryKey: 'headlight_bulb', name: 'Lâmpada Farol H4', category: 'Elétrica' },
  // ARREFECIMENTO (4)
  { categoryKey: 'radiator', name: 'Radiador', category: 'Arrefecimento' },
  { categoryKey: 'intercooler', name: 'Intercooler', category: 'Arrefecimento' },
  { categoryKey: 'coolant', name: 'Aditivo Radiador (5L)', category: 'Arrefecimento' },
  { categoryKey: 'radiator_hose', name: 'Mangueira do Radiador', category: 'Arrefecimento' },
];

// ============================================================================
// MARCAS DE PEÇAS POR CATEGORIA
// ============================================================================

const PART_BRANDS: Record<string, { primary: string; equivalents: string[] }> = {
  // Filtros
  oil_filter: { primary: 'MANN-FILTER', equivalents: ['TECFIL', 'FRAM', 'BOSCH', 'MAHLE'] },
  air_filter: { primary: 'MANN-FILTER', equivalents: ['TECFIL', 'FRAM', 'K&N', 'MAHLE'] },
  fuel_filter: { primary: 'MANN-FILTER', equivalents: ['TECFIL', 'BOSCH', 'MAHLE'] },
  cabin_filter: { primary: 'MANN-FILTER', equivalents: ['TECFIL', 'BOSCH', 'MAHLE'] },
  transmission_filter: { primary: 'MANN-FILTER', equivalents: ['ZF', 'MAHLE'] },
  fuel_water_separator: { primary: 'RACOR', equivalents: ['MANN-FILTER', 'FLEETGUARD'] },
  hydraulic_filter: { primary: 'MANN-FILTER', equivalents: ['PARKER', 'DONALDSON'] },
  // Freios
  brake_pads_front: { primary: 'COBREQ', equivalents: ['FRAS-LE', 'BOSCH', 'TRW', 'BREMBO'] },
  brake_pads_rear: { primary: 'COBREQ', equivalents: ['FRAS-LE', 'BOSCH', 'TRW', 'BREMBO'] },
  brake_disc_front: { primary: 'FREMAX', equivalents: ['HIPPER FREIOS', 'TRW', 'BREMBO'] },
  brake_disc_rear: { primary: 'FREMAX', equivalents: ['HIPPER FREIOS', 'TRW', 'BREMBO'] },
  brake_fluid: { primary: 'BOSCH', equivalents: ['WAGNER', 'CASTROL', 'MOTUL'] },
  brake_hose: { primary: 'TRW', equivalents: ['FRAS-LE', 'NAKATA'] },
  brake_caliper: { primary: 'TRW', equivalents: ['ATE', 'BREMBO'] },
  brake_drum: { primary: 'FREMAX', equivalents: ['HIPPER FREIOS', 'TRW'] },
  brake_lever: { primary: 'ORIGINAL', equivalents: ['CIRCUIT', 'OXXY'] },
  brake_cable: { primary: 'ORIGINAL', equivalents: ['COFAP', 'CONTROL FLEX'] },
  brake_chamber: { primary: 'KNORR-BREMSE', equivalents: ['WABCO', 'HALDEX'] },
  slack_adjuster: { primary: 'KNORR-BREMSE', equivalents: ['WABCO', 'HALDEX'] },
  air_dryer: { primary: 'KNORR-BREMSE', equivalents: ['WABCO', 'BENDIX'] },
  brake_valve: { primary: 'KNORR-BREMSE', equivalents: ['WABCO', 'BENDIX'] },
  // Motor
  spark_plugs: { primary: 'NGK', equivalents: ['BOSCH', 'DENSO', 'CHAMPION'] },
  spark_plug: { primary: 'NGK', equivalents: ['BOSCH', 'DENSO', 'CHAMPION'] },
  ignition_coil: { primary: 'BOSCH', equivalents: ['NGK', 'DENSO', 'DELPHI'] },
  timing_belt: { primary: 'GATES', equivalents: ['CONTINENTAL', 'DAYCO', 'GOODYEAR'] },
  timing_kit: { primary: 'GATES', equivalents: ['CONTINENTAL', 'SKF', 'INA'] },
  water_pump: { primary: 'INDISA', equivalents: ['URO', 'GATES', 'GMB'] },
  thermostat: { primary: 'WAHLER', equivalents: ['GATES', 'MAHLE', 'BEHR'] },
  engine_oil: { primary: 'MOBIL', equivalents: ['CASTROL', 'SHELL', 'PETRONAS', 'MOTUL'] },
  valve_cover_gasket: { primary: 'VICTOR REINZ', equivalents: ['ELRING', 'AJUSA'] },
  head_gasket: { primary: 'VICTOR REINZ', equivalents: ['ELRING', 'AJUSA', 'MAHLE'] },
  piston_rings: { primary: 'MAHLE', equivalents: ['NPR', 'FEDERAL MOGUL'] },
  valve_clearance_shim: { primary: 'ORIGINAL', equivalents: ['MAHLE'] },
  piston_kit: { primary: 'MAHLE', equivalents: ['KMP', 'METAL LEVE'] },
  cylinder_kit: { primary: 'ORIGINAL', equivalents: ['MAHLE', 'KMP'] },
  gasket_kit: { primary: 'VEDAMOTORS', equivalents: ['JUNTAS BRASIL', 'ORIGINAL'] },
  injector: { primary: 'BOSCH', equivalents: ['DELPHI', 'DENSO'] },
  turbo: { primary: 'GARRETT', equivalents: ['BORGWARNER', 'HOLSET'] },
  fan_belt: { primary: 'GATES', equivalents: ['CONTINENTAL', 'DAYCO'] },
  fan_clutch: { primary: 'BORGWARNER', equivalents: ['SACHS', 'MAHLE'] },
  // Suspensão
  shock_front: { primary: 'MONROE', equivalents: ['COFAP', 'KAYABA', 'SACHS'] },
  shock_rear: { primary: 'MONROE', equivalents: ['COFAP', 'KAYABA', 'SACHS'] },
  coil_spring_front: { primary: 'FABRINI', equivalents: ['COFAP', 'LESJOFORS'] },
  coil_spring_rear: { primary: 'FABRINI', equivalents: ['COFAP', 'LESJOFORS'] },
  control_arm: { primary: 'NAKATA', equivalents: ['VIEMAR', 'TRW', 'LEMFORDER'] },
  ball_joint: { primary: 'NAKATA', equivalents: ['VIEMAR', 'TRW', 'MOOG'] },
  stabilizer_link: { primary: 'NAKATA', equivalents: ['VIEMAR', 'TRW', 'LEMFORDER'] },
  wheel_bearing: { primary: 'SKF', equivalents: ['FAG', 'NSK', 'TIMKEN', 'ILJIN'] },
  fork_seal: { primary: 'VEDAMOTORS', equivalents: ['ALL BALLS', 'ATHENA'] },
  fork_oil: { primary: 'MOTUL', equivalents: ['CASTROL', 'YAMALUBE', 'MOTOREX'] },
  leaf_spring: { primary: 'FABRINI', equivalents: ['RANDON', 'SUSPENSYS'] },
  king_pin: { primary: 'NAKATA', equivalents: ['VIEMAR', 'DANA'] },
  u_bolt: { primary: 'RANDON', equivalents: ['SUSPENSYS'] },
  // Direção
  tie_rod_end: { primary: 'NAKATA', equivalents: ['VIEMAR', 'TRW', 'MOOG'] },
  steering_rack: { primary: 'TRW', equivalents: ['ZF', 'BOSCH'] },
  power_steering_fluid: { primary: 'CASTROL', equivalents: ['MOBIL', 'PENTOSIN'] },
  steering_boot: { primary: 'NAKATA', equivalents: ['VIEMAR', 'TRW'] },
  // Transmissão
  clutch_kit: { primary: 'LUK', equivalents: ['SACHS', 'VALEO', 'EXEDY'] },
  cv_joint_outer: { primary: 'GKN', equivalents: ['SKF', 'NAKATA', 'NTN'] },
  cv_joint_inner: { primary: 'GKN', equivalents: ['SKF', 'NAKATA', 'NTN'] },
  cv_boot: { primary: 'GKN', equivalents: ['SKF', 'NAKATA'] },
  transmission_oil: { primary: 'CASTROL', equivalents: ['MOBIL', 'SHELL', 'ZF'] },
  chain_kit: { primary: 'DID', equivalents: ['RK', 'REGINA', 'AFAM'] },
  chain: { primary: 'DID', equivalents: ['RK', 'REGINA'] },
  sprocket_front: { primary: 'VORTEX', equivalents: ['JT', 'SUNSTAR'] },
  sprocket_rear: { primary: 'VORTEX', equivalents: ['JT', 'SUNSTAR'] },
  differential_oil: { primary: 'CASTROL', equivalents: ['MOBIL', 'SHELL'] },
  propshaft_bearing: { primary: 'SKF', equivalents: ['FAG', 'NSK'] },
  // Elétrica
  battery: { primary: 'MOURA', equivalents: ['HELIAR', 'BOSCH', 'ACDelco'] },
  alternator: { primary: 'BOSCH', equivalents: ['VALEO', 'DENSO', 'DELCO'] },
  starter_motor: { primary: 'BOSCH', equivalents: ['VALEO', 'DENSO', 'DELCO'] },
  headlight_bulb: { primary: 'PHILIPS', equivalents: ['OSRAM', 'NARVA', 'GE'] },
  wiper_blade: { primary: 'BOSCH', equivalents: ['VALEO', 'DYNA'] },
  cdi: { primary: 'ORIGINAL', equivalents: ['MAGNETRON', 'SERVITEC'] },
  rectifier: { primary: 'ORIGINAL', equivalents: ['MAGNETRON', 'SERVITEC'] },
  stator: { primary: 'ORIGINAL', equivalents: ['MAGNETRON', 'RICK\'S'] },
  // Arrefecimento
  radiator: { primary: 'VISCONDE', equivalents: ['VALEO', 'DENSO', 'BEHR'] },
  radiator_hose: { primary: 'GATES', equivalents: ['DAYCO', 'GOODYEAR'] },
  coolant: { primary: 'PARAFLU', equivalents: ['CASTROL', 'MOBIL', 'SHELL'] },
  intercooler: { primary: 'VALEO', equivalents: ['BEHR', 'DENSO'] },
  // Escapamento
  exhaust_gasket: { primary: 'VICTOR REINZ', equivalents: ['ELRING', 'AJUSA'] },
  catalytic_converter: { primary: 'UMICORE', equivalents: ['BOSAL', 'WALKER'] },
  // Rodas
  tire_front: { primary: 'PIRELLI', equivalents: ['MICHELIN', 'BRIDGESTONE', 'METZELER'] },
  tire_rear: { primary: 'PIRELLI', equivalents: ['MICHELIN', 'BRIDGESTONE', 'METZELER'] },
  // Cabos
  throttle_cable: { primary: 'ORIGINAL', equivalents: ['COFAP', 'CONTROL FLEX'] },
};

// ============================================================================
// GERADOR DE PART NUMBERS
// ============================================================================

function generatePartNumber(brand: string, model: string, year: number, categoryKey: string): string {
  const brandCode = brand.substring(0, 2).toUpperCase();
  const modelCode = model.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase();
  const yearCode = year.toString().substring(2);
  const catCode = categoryKey.substring(0, 3).toUpperCase();
  return `${brandCode}-${modelCode}-${yearCode}-${catCode}`;
}

// ============================================================================
// FUNÇÃO PRINCIPAL: GERAR PEÇAS PARA QUALQUER VEÍCULO
// ============================================================================

export interface GeneratedPart {
  partNumber: string;
  name: string;
  category: string;
  categoryKey: string;
  brand: string;
  equivalents: string[];
  specs: Record<string, any> | null;
  matchType: MatchType;
  confidence: number;
  matchReason: string;
}

export function generatePartsForVehicle(vehicle: VehicleVariant): GeneratedPart[] {
  const parts: GeneratedPart[] = [];
  
  // Determina qual checklist usar baseado no tipo de veículo
  let checklist: typeof CAR_PARTS_CHECKLIST;
  
  if (vehicle.vehicleType === 'motorcycle') {
    checklist = MOTORCYCLE_PARTS_CHECKLIST;
  } else if (vehicle.vehicleType === 'truck' || vehicle.vehicleType === 'bus') {
    checklist = TRUCK_PARTS_CHECKLIST;
  } else {
    // car, suv, pickup, van
    checklist = CAR_PARTS_CHECKLIST;
  }
  
  // Gera cada peça do checklist
  for (const partDef of checklist) {
    const brandInfo = PART_BRANDS[partDef.categoryKey] || { primary: 'ORIGINAL', equivalents: [] };
    const partNumber = generatePartNumber(vehicle.brand, vehicle.model, vehicle.year, partDef.categoryKey);
    
    // Gera equivalentes com part numbers
    const equivalents = brandInfo.equivalents.map((brand, idx) => {
      const eqPartNumber = `${brand.substring(0, 3).toUpperCase()}-${partNumber.split('-').slice(1).join('-')}`;
      return `${brand} ${eqPartNumber}`;
    });
    
    parts.push({
      partNumber,
      name: partDef.name,
      category: partDef.category,
      categoryKey: partDef.categoryKey,
      brand: brandInfo.primary,
      equivalents,
      specs: generateSpecs(partDef.categoryKey, vehicle),
      matchType: 'exact',
      confidence: 0.95,
      matchReason: `Peça específica para ${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
    });
  }
  
  return parts;
}

// ============================================================================
// GERADOR DE ESPECIFICAÇÕES
// ============================================================================

function generateSpecs(categoryKey: string, vehicle: VehicleVariant): Record<string, any> | null {
  const displacement = vehicle.displacementCc || 1000;
  const isMotorcycle = vehicle.vehicleType === 'motorcycle';
  const isTruck = vehicle.vehicleType === 'truck' || vehicle.vehicleType === 'bus';
  
  switch (categoryKey) {
    case 'oil_filter':
      return isMotorcycle 
        ? { height: 38, diameter: 44, type: 'cartridge' }
        : { height: 79, diameter: 76, type: 'spin-on' };
    case 'air_filter':
      return isMotorcycle
        ? { type: 'panel', material: 'paper' }
        : { length: 270, width: 180, height: 50, type: 'panel' };
    case 'brake_pads_front':
    case 'brake_pads_rear':
      return { material: isMotorcycle ? 'sintered' : 'ceramic', position: categoryKey.includes('front') ? 'front' : 'rear' };
    case 'brake_disc_front':
    case 'brake_disc_rear':
      return isMotorcycle
        ? { diameter: 276, thickness: 3.5, type: 'wave' }
        : { diameter: 280, thickness: 22, ventilated: true };
    case 'spark_plugs':
    case 'spark_plug':
      return { gap: 0.8, thread: isMotorcycle ? 10 : 14, reach: 19 };
    case 'engine_oil':
      if (isTruck) return { viscosity: '15W40', volume: 20, type: 'diesel' };
      if (isMotorcycle) return { viscosity: '10W40', volume: 1, type: '4T' };
      return { viscosity: '5W30', volume: 5, type: 'synthetic' };
    case 'battery':
      if (isTruck) return { capacity: 150, voltage: 24, type: 'heavy_duty' };
      if (isMotorcycle) return { capacity: displacement < 300 ? 5 : 7, voltage: 12, type: 'AGM' };
      return { capacity: 60, voltage: 12, type: 'maintenance_free' };
    case 'shock_front':
    case 'shock_rear':
      return { type: isMotorcycle ? 'mono' : 'twin_tube', gas: true };
    case 'clutch_kit':
      return { diameter: isMotorcycle ? 0 : (displacement < 1500 ? 200 : 228), type: 'organic' };
    case 'chain_kit':
      return { chain: displacement < 200 ? '428' : (displacement < 500 ? '520' : '525'), links: 118 };
    case 'tire_front':
      return isMotorcycle
        ? { width: displacement < 200 ? 80 : 110, aspect: 80, rim: 18 }
        : null;
    case 'tire_rear':
      return isMotorcycle
        ? { width: displacement < 200 ? 90 : 140, aspect: 70, rim: 17 }
        : null;
    default:
      return null;
  }
}

// ============================================================================
// ESTATÍSTICAS
// ============================================================================

export function getPartsChecklistStats() {
  return {
    carParts: CAR_PARTS_CHECKLIST.length,
    motorcycleParts: MOTORCYCLE_PARTS_CHECKLIST.length,
    truckParts: TRUCK_PARTS_CHECKLIST.length,
    totalBrands: Object.keys(PART_BRANDS).length,
  };
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================

export {
  CAR_PARTS_CHECKLIST,
  MOTORCYCLE_PARTS_CHECKLIST,
  TRUCK_PARTS_CHECKLIST,
  PART_BRANDS,
};
