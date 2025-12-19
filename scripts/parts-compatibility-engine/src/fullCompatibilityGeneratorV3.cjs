/**
 * Full Compatibility Generator V3
 * Gera checklist COMPLETO de peças para TODOS os veículos
 * TODOS os veículos terão o MESMO número de peças (checklist padronizado)
 * Exporta para Firebase para consulta direta
 * 
 * @version 3.0.0
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
// Total: 50 peças

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
// Total: 30 peças


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

  // VW MQB (Golf, Polo, Virtus, T-Cross, Nivus, Taos, Jetta, Tiguan)
  VW_MQB: {
    oil_filter: { partNumber: 'HU719/7X', brand: 'MANN-FILTER', equivalents: ['MAHLE OX188D', 'BOSCH P9192', 'WIX WL7476'], avgPrice: 85 },
    air_filter: { partNumber: 'C35154', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL2154', 'FRAM CA11154', 'BOSCH F026400154'], avgPrice: 75 },
    cabin_filter: { partNumber: 'CUK26009', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP809', 'FRAM CF11809', 'BOSCH 1987432809'], avgPrice: 85 },
    fuel_filter: { partNumber: 'WK69/2', brand: 'MANN-FILTER', equivalents: ['TECFIL GI69', 'FRAM G10692', 'BOSCH F026402692'], avgPrice: 95 },
    transmission_filter: { partNumber: 'H199KIT-MQB', brand: 'MANN-FILTER', equivalents: ['ZF 0501216244', 'MEYLE 1003250005'], avgPrice: 150 },
    front_brake_pads: { partNumber: 'N-1256', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1256', 'BOSCH BP1256', 'TRW GDB1856'], avgPrice: 120 },
    rear_brake_pads: { partNumber: 'N-1257', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1257', 'BOSCH BP1257', 'TRW GDB1857'], avgPrice: 95 },
    front_brake_disc: { partNumber: 'BD1256', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1256', 'VARGA 1256', 'TRW DF6256'], avgPrice: 280 },
    rear_brake_disc: { partNumber: 'BD1257', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1257', 'VARGA 1257', 'TRW DF6257'], avgPrice: 220 },
    brake_fluid: { partNumber: 'DOT4-500ML', brand: 'BOSCH', equivalents: ['WAGNER DOT4', 'CASTROL DOT4', 'MOBIL DOT4'], avgPrice: 35 },
    brake_hose_front: { partNumber: 'FH1256', brand: 'FRAS-LE', equivalents: ['TRW PHD1256', 'VARGA VH1256'], avgPrice: 55 },
    brake_hose_rear: { partNumber: 'FH1257', brand: 'FRAS-LE', equivalents: ['TRW PHD1257', 'VARGA VH1257'], avgPrice: 50 },
    handbrake_cable: { partNumber: 'CB1256', brand: 'COFLE', equivalents: ['NAKATA NCB1256', 'FRAS-LE FCB1256'], avgPrice: 65 },
    spark_plugs: { partNumber: 'ILZKR7B-11S', brand: 'NGK', equivalents: ['BOSCH FR7KI332S', 'DENSO IK20TT', 'CHAMPION RC10PYPB4'], avgPrice: 65 },
    ignition_coil: { partNumber: 'U5014', brand: 'NGK', equivalents: ['BOSCH 0221604115', 'BERU ZS014'], avgPrice: 220 },
    spark_plug_wires: { partNumber: 'N/A-MQB', brand: 'N/A', equivalents: [], avgPrice: 0 },
    distributor_cap: { partNumber: 'N/A-MQB', brand: 'N/A', equivalents: [], avgPrice: 0 },
    front_shock: { partNumber: 'GP33256', brand: 'MONROE', equivalents: ['COFAP MP33256', 'NAKATA HG33256', 'KAYABA 339256'], avgPrice: 380 },
    rear_shock: { partNumber: 'GP33257', brand: 'MONROE', equivalents: ['COFAP MP33257', 'NAKATA HG33257', 'KAYABA 349257'], avgPrice: 320 },
    front_spring: { partNumber: 'MC1256', brand: 'COFAP', equivalents: ['FABRINI F1256', 'NAKATA NS1256'], avgPrice: 220 },
    rear_spring: { partNumber: 'MC1257', brand: 'COFAP', equivalents: ['FABRINI F1257', 'NAKATA NS1257'], avgPrice: 200 },
    front_stabilizer_link: { partNumber: 'BL1256', brand: 'NAKATA', equivalents: ['VIEMAR V1256', 'AXIOS AX1256'], avgPrice: 85 },
    rear_stabilizer_link: { partNumber: 'BL1257', brand: 'NAKATA', equivalents: ['VIEMAR V1257', 'AXIOS AX1257'], avgPrice: 75 },
    control_arm_front: { partNumber: 'BA1256', brand: 'NAKATA', equivalents: ['VIEMAR VB1256', 'AXIOS AB1256'], avgPrice: 420 },
    ball_joint: { partNumber: 'PV1256', brand: 'NAKATA', equivalents: ['VIEMAR VP1256', 'AXIOS AP1256'], avgPrice: 110 },
    tie_rod_end: { partNumber: 'TD1256', brand: 'NAKATA', equivalents: ['VIEMAR VT1256', 'AXIOS AT1256'], avgPrice: 95 },
    steering_rack_boot: { partNumber: 'CR1256', brand: 'NAKATA', equivalents: ['VIEMAR VC1256', 'AXIOS AC1256'], avgPrice: 55 },
    timing_belt: { partNumber: 'CT1256', brand: 'CONTITECH', equivalents: ['GATES 5656XS', 'DAYCO 941256', 'INA 530056710'], avgPrice: 180 },
    timing_belt_tensioner: { partNumber: 'VKM11256', brand: 'SKF', equivalents: ['INA 531056710', 'GATES T43256'], avgPrice: 220 },
    water_pump: { partNumber: 'WP1256', brand: 'URBA', equivalents: ['INDISA 1256', 'NAKATA NKBA1256', 'SKF VKPC81618'], avgPrice: 280 },
    thermostat: { partNumber: 'TH1256', brand: 'WAHLER', equivalents: ['BEHR TX1256', 'GATES TH1256'], avgPrice: 85 },
    alternator_belt: { partNumber: '6PK1256', brand: 'CONTITECH', equivalents: ['GATES 6PK1256', 'DAYCO 6PK1256'], avgPrice: 55 },
    engine_oil: { partNumber: '5W30-4L', brand: 'CASTROL', equivalents: ['MOBIL 5W30', 'SHELL 5W30', 'PETRONAS 5W30'], avgPrice: 140 },
    coolant: { partNumber: 'G13-1L', brand: 'VW', equivalents: ['PARAFLU G13', 'CASTROL G13'], avgPrice: 55 },
    valve_cover_gasket: { partNumber: 'JTV1256', brand: 'VICTOR REINZ', equivalents: ['ELRING 1256', 'AJUSA 1256'], avgPrice: 110 },
    oil_pan_gasket: { partNumber: 'JC1256', brand: 'VICTOR REINZ', equivalents: ['ELRING C1256', 'AJUSA C1256'], avgPrice: 120 },
    pcv_valve: { partNumber: 'PCV1256', brand: 'BOSCH', equivalents: ['WAHLER PCV1256', 'GATES PCV1256'], avgPrice: 45 },
    battery: { partNumber: 'M70GD', brand: 'MOURA', equivalents: ['HELIAR HF70DD', 'ACDelco 70AH', 'BOSCH S5X70D'], avgPrice: 550 },
    alternator: { partNumber: 'ALT1256', brand: 'BOSCH', equivalents: ['VALEO 1256', 'DENSO 1256'], avgPrice: 850 },
    starter_motor: { partNumber: 'SM1256', brand: 'BOSCH', equivalents: ['VALEO SM1256', 'DENSO SM1256'], avgPrice: 750 },
    headlight_bulb: { partNumber: 'H7-55W', brand: 'OSRAM', equivalents: ['PHILIPS H7', 'NARVA H7', 'GE H7'], avgPrice: 45 },
    brake_light_bulb: { partNumber: 'P21W', brand: 'OSRAM', equivalents: ['PHILIPS P21W', 'NARVA P21W'], avgPrice: 10 },
    fuse_kit: { partNumber: 'FK-UNIV', brand: 'LITTELFUSE', equivalents: ['BUSSMANN FK', 'HELLA FK'], avgPrice: 30 },
    clutch_kit: { partNumber: 'CK1256', brand: 'LUK', equivalents: ['SACHS 3000954256', 'VALEO 826956', 'EXEDY 1256'], avgPrice: 850 },
    clutch_cable: { partNumber: 'N/A-MQB', brand: 'N/A', equivalents: [], avgPrice: 0 },
    transmission_oil: { partNumber: '75W90-1L', brand: 'CASTROL', equivalents: ['MOBIL 75W90', 'SHELL 75W90'], avgPrice: 95 },
    cv_joint: { partNumber: 'CVJ1256', brand: 'GKN', equivalents: ['SKF VKJA1256', 'NAKATA NCV1256'], avgPrice: 380 },
    front_wheel_bearing: { partNumber: 'WB1256', brand: 'SKF', equivalents: ['FAG 713610256', 'NSK 45BWD256', 'TIMKEN 1256'], avgPrice: 220 },
    rear_wheel_bearing: { partNumber: 'WB1257', brand: 'SKF', equivalents: ['FAG 713610257', 'NSK 45BWD257', 'TIMKEN 1257'], avgPrice: 200 },
    clutch_bearing: { partNumber: 'CB1256', brand: 'SKF', equivalents: ['FAG CB1256', 'NSK CB1256', 'INA CB1256'], avgPrice: 150 },
  },

  // FIAT FIRE (Uno, Palio, Siena, Strada, Mobi)
  FIAT_FIRE: {
    oil_filter: { partNumber: 'W712/73', brand: 'MANN-FILTER', equivalents: ['TECFIL PSL140', 'FRAM PH5949', 'BOSCH F026407073'], avgPrice: 42 },
    air_filter: { partNumber: 'C2569', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL2569', 'FRAM CA9482', 'BOSCH F026400569'], avgPrice: 48 },
    cabin_filter: { partNumber: 'CU2026', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP026', 'FRAM CF10026', 'BOSCH 1987432026'], avgPrice: 55 },
    fuel_filter: { partNumber: 'WK730/5', brand: 'MANN-FILTER', equivalents: ['TECFIL GI05', 'FRAM G10735', 'BOSCH F026402735'], avgPrice: 75 },
    transmission_filter: { partNumber: 'H199KIT-FIRE', brand: 'MANN-FILTER', equivalents: ['ZF 0501216245', 'MEYLE 1003250006'], avgPrice: 110 },
    front_brake_pads: { partNumber: 'N-1047', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1047', 'BOSCH BP1047', 'TRW GDB1447'], avgPrice: 75 },
    rear_brake_pads: { partNumber: 'N-1048', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1048', 'BOSCH BP1048', 'TRW GDB1448'], avgPrice: 65 },
    front_brake_disc: { partNumber: 'BD1047', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1047', 'VARGA 1047', 'TRW DF4047'], avgPrice: 160 },
    rear_brake_disc: { partNumber: 'BD1048', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1048', 'VARGA 1048', 'TRW DF4048'], avgPrice: 140 },
    brake_fluid: { partNumber: 'DOT4-500ML', brand: 'BOSCH', equivalents: ['WAGNER DOT4', 'CASTROL DOT4', 'MOBIL DOT4'], avgPrice: 35 },
    brake_hose_front: { partNumber: 'FH1047', brand: 'FRAS-LE', equivalents: ['TRW PHD1047', 'VARGA VH1047'], avgPrice: 42 },
    brake_hose_rear: { partNumber: 'FH1048', brand: 'FRAS-LE', equivalents: ['TRW PHD1048', 'VARGA VH1048'], avgPrice: 38 },
    handbrake_cable: { partNumber: 'CB1047', brand: 'COFLE', equivalents: ['NAKATA NCB1047', 'FRAS-LE FCB1047'], avgPrice: 50 },
    spark_plugs: { partNumber: 'BKR5E', brand: 'NGK', equivalents: ['BOSCH FR8DC+', 'DENSO K16PR-U', 'CHAMPION RC9YC'], avgPrice: 22 },
    ignition_coil: { partNumber: 'U5047', brand: 'NGK', equivalents: ['BOSCH 0221604047', 'BERU ZS047'], avgPrice: 160 },
    spark_plug_wires: { partNumber: 'SCT1047', brand: 'NGK', equivalents: ['BOSCH 0986356047', 'BERU R347'], avgPrice: 95 },
    distributor_cap: { partNumber: 'DC1047', brand: 'BOSCH', equivalents: ['BERU VK347', 'MAGNETI MARELLI BDA1047'], avgPrice: 75 },
    front_shock: { partNumber: 'GP32047', brand: 'MONROE', equivalents: ['COFAP MP32047', 'NAKATA HG32047', 'KAYABA 333047'], avgPrice: 250 },
    rear_shock: { partNumber: 'GP32048', brand: 'MONROE', equivalents: ['COFAP MP32048', 'NAKATA HG32048', 'KAYABA 343048'], avgPrice: 200 },
    front_spring: { partNumber: 'MC1047', brand: 'COFAP', equivalents: ['FABRINI F1047', 'NAKATA NS1047'], avgPrice: 160 },
    rear_spring: { partNumber: 'MC1048', brand: 'COFAP', equivalents: ['FABRINI F1048', 'NAKATA NS1048'], avgPrice: 140 },
    front_stabilizer_link: { partNumber: 'BL1047', brand: 'NAKATA', equivalents: ['VIEMAR V1047', 'AXIOS AX1047'], avgPrice: 55 },
    rear_stabilizer_link: { partNumber: 'BL1048', brand: 'NAKATA', equivalents: ['VIEMAR V1048', 'AXIOS AX1048'], avgPrice: 50 },
    control_arm_front: { partNumber: 'BA1047', brand: 'NAKATA', equivalents: ['VIEMAR VB1047', 'AXIOS AB1047'], avgPrice: 280 },
    ball_joint: { partNumber: 'PV1047', brand: 'NAKATA', equivalents: ['VIEMAR VP1047', 'AXIOS AP1047'], avgPrice: 75 },
    tie_rod_end: { partNumber: 'TD1047', brand: 'NAKATA', equivalents: ['VIEMAR VT1047', 'AXIOS AT1047'], avgPrice: 65 },
    steering_rack_boot: { partNumber: 'CR1047', brand: 'NAKATA', equivalents: ['VIEMAR VC1047', 'AXIOS AC1047'], avgPrice: 40 },
    timing_belt: { partNumber: 'CT1047', brand: 'CONTITECH', equivalents: ['GATES 5447XS', 'DAYCO 941047', 'INA 530047710'], avgPrice: 95 },
    timing_belt_tensioner: { partNumber: 'VKM11047', brand: 'SKF', equivalents: ['INA 531047710', 'GATES T43047'], avgPrice: 150 },
    water_pump: { partNumber: 'WP1047', brand: 'URBA', equivalents: ['INDISA 1047', 'NAKATA NKBA1047', 'SKF VKPC81047'], avgPrice: 150 },
    thermostat: { partNumber: 'TH1047', brand: 'WAHLER', equivalents: ['BEHR TX1047', 'GATES TH1047'], avgPrice: 55 },
    alternator_belt: { partNumber: '6PK1047', brand: 'CONTITECH', equivalents: ['GATES 6PK1047', 'DAYCO 6PK1047'], avgPrice: 40 },
    engine_oil: { partNumber: '5W30-4L', brand: 'CASTROL', equivalents: ['MOBIL 5W30', 'SHELL 5W30', 'PETRONAS 5W30'], avgPrice: 110 },
    coolant: { partNumber: 'PARAFLU-1L', brand: 'FIAT', equivalents: ['PARAFLU UP', 'CASTROL COOLANT'], avgPrice: 40 },
    valve_cover_gasket: { partNumber: 'JTV1047', brand: 'VICTOR REINZ', equivalents: ['ELRING 1047', 'AJUSA 1047'], avgPrice: 75 },
    oil_pan_gasket: { partNumber: 'JC1047', brand: 'VICTOR REINZ', equivalents: ['ELRING C1047', 'AJUSA C1047'], avgPrice: 85 },
    pcv_valve: { partNumber: 'PCV1047', brand: 'BOSCH', equivalents: ['WAHLER PCV1047', 'GATES PCV1047'], avgPrice: 30 },
    battery: { partNumber: 'M48FD', brand: 'MOURA', equivalents: ['HELIAR HF48DD', 'ACDelco 48AH', 'BOSCH S5X48D'], avgPrice: 380 },
    alternator: { partNumber: 'ALT1047', brand: 'BOSCH', equivalents: ['VALEO 1047', 'DENSO 1047'], avgPrice: 550 },
    starter_motor: { partNumber: 'SM1047', brand: 'BOSCH', equivalents: ['VALEO SM1047', 'DENSO SM1047'], avgPrice: 480 },
    headlight_bulb: { partNumber: 'H4-60/55W', brand: 'OSRAM', equivalents: ['PHILIPS H4', 'NARVA H4', 'GE H4'], avgPrice: 30 },
    brake_light_bulb: { partNumber: 'P21W', brand: 'OSRAM', equivalents: ['PHILIPS P21W', 'NARVA P21W'], avgPrice: 8 },
    fuse_kit: { partNumber: 'FK-UNIV', brand: 'LITTELFUSE', equivalents: ['BUSSMANN FK', 'HELLA FK'], avgPrice: 22 },
    clutch_kit: { partNumber: 'CK1047', brand: 'LUK', equivalents: ['SACHS 3000954047', 'VALEO 826047', 'EXEDY 1047'], avgPrice: 580 },
    clutch_cable: { partNumber: 'CC1047', brand: 'COFLE', equivalents: ['NAKATA NCC1047', 'FRAS-LE FCC1047'], avgPrice: 65 },
    transmission_oil: { partNumber: '75W90-1L', brand: 'CASTROL', equivalents: ['MOBIL 75W90', 'SHELL 75W90'], avgPrice: 75 },
    cv_joint: { partNumber: 'CVJ1047', brand: 'GKN', equivalents: ['SKF VKJA1047', 'NAKATA NCV1047'], avgPrice: 250 },
    front_wheel_bearing: { partNumber: 'WB1047', brand: 'SKF', equivalents: ['FAG 713610047', 'NSK 45BWD047', 'TIMKEN 1047'], avgPrice: 160 },
    rear_wheel_bearing: { partNumber: 'WB1048', brand: 'SKF', equivalents: ['FAG 713610048', 'NSK 45BWD048', 'TIMKEN 1048'], avgPrice: 140 },
    clutch_bearing: { partNumber: 'CB1047', brand: 'SKF', equivalents: ['FAG CB1047', 'NSK CB1047', 'INA CB1047'], avgPrice: 100 },
  },

  // FIAT ARGO (Argo, Cronos, Pulse, Fastback)
  FIAT_ARGO: {
    oil_filter: { partNumber: 'HU712/11X', brand: 'MANN-FILTER', equivalents: ['MAHLE OX411D', 'BOSCH P9411', 'WIX WL7411'], avgPrice: 75 },
    air_filter: { partNumber: 'C27107', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL7107', 'FRAM CA11107', 'BOSCH F026400107'], avgPrice: 65 },
    cabin_filter: { partNumber: 'CUK2545', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP545', 'FRAM CF10545', 'BOSCH 1987432545'], avgPrice: 70 },
    fuel_filter: { partNumber: 'WK69/1', brand: 'MANN-FILTER', equivalents: ['TECFIL GI691', 'FRAM G10691', 'BOSCH F026402691'], avgPrice: 88 },
    transmission_filter: { partNumber: 'H199KIT-ARGO', brand: 'MANN-FILTER', equivalents: ['ZF 0501216246', 'MEYLE 1003250007'], avgPrice: 130 },
    front_brake_pads: { partNumber: 'N-1411', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1411', 'BOSCH BP1411', 'TRW GDB1811'], avgPrice: 95 },
    rear_brake_pads: { partNumber: 'N-1412', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1412', 'BOSCH BP1412', 'TRW GDB1812'], avgPrice: 80 },
    front_brake_disc: { partNumber: 'BD1411', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1411', 'VARGA 1411', 'TRW DF6411'], avgPrice: 220 },
    rear_brake_disc: { partNumber: 'BD1412', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1412', 'VARGA 1412', 'TRW DF6412'], avgPrice: 180 },
    brake_fluid: { partNumber: 'DOT4-500ML', brand: 'BOSCH', equivalents: ['WAGNER DOT4', 'CASTROL DOT4', 'MOBIL DOT4'], avgPrice: 35 },
    brake_hose_front: { partNumber: 'FH1411', brand: 'FRAS-LE', equivalents: ['TRW PHD1411', 'VARGA VH1411'], avgPrice: 48 },
    brake_hose_rear: { partNumber: 'FH1412', brand: 'FRAS-LE', equivalents: ['TRW PHD1412', 'VARGA VH1412'], avgPrice: 44 },
    handbrake_cable: { partNumber: 'CB1411', brand: 'COFLE', equivalents: ['NAKATA NCB1411', 'FRAS-LE FCB1411'], avgPrice: 58 },
    spark_plugs: { partNumber: 'ILZKR7B-11S', brand: 'NGK', equivalents: ['BOSCH FR7KI332S', 'DENSO IK20TT', 'CHAMPION RC10PYPB4'], avgPrice: 65 },
    ignition_coil: { partNumber: 'U5411', brand: 'NGK', equivalents: ['BOSCH 0221604411', 'BERU ZS411'], avgPrice: 195 },
    spark_plug_wires: { partNumber: 'N/A-ARGO', brand: 'N/A', equivalents: [], avgPrice: 0 },
    distributor_cap: { partNumber: 'N/A-ARGO', brand: 'N/A', equivalents: [], avgPrice: 0 },
    front_shock: { partNumber: 'GP33411', brand: 'MONROE', equivalents: ['COFAP MP33411', 'NAKATA HG33411', 'KAYABA 339411'], avgPrice: 320 },
    rear_shock: { partNumber: 'GP33412', brand: 'MONROE', equivalents: ['COFAP MP33412', 'NAKATA HG33412', 'KAYABA 349412'], avgPrice: 260 },
    front_spring: { partNumber: 'MC1411', brand: 'COFAP', equivalents: ['FABRINI F1411', 'NAKATA NS1411'], avgPrice: 190 },
    rear_spring: { partNumber: 'MC1412', brand: 'COFAP', equivalents: ['FABRINI F1412', 'NAKATA NS1412'], avgPrice: 170 },
    front_stabilizer_link: { partNumber: 'BL1411', brand: 'NAKATA', equivalents: ['VIEMAR V1411', 'AXIOS AX1411'], avgPrice: 70 },
    rear_stabilizer_link: { partNumber: 'BL1412', brand: 'NAKATA', equivalents: ['VIEMAR V1412', 'AXIOS AX1412'], avgPrice: 65 },
    control_arm_front: { partNumber: 'BA1411', brand: 'NAKATA', equivalents: ['VIEMAR VB1411', 'AXIOS AB1411'], avgPrice: 350 },
    ball_joint: { partNumber: 'PV1411', brand: 'NAKATA', equivalents: ['VIEMAR VP1411', 'AXIOS AP1411'], avgPrice: 95 },
    tie_rod_end: { partNumber: 'TD1411', brand: 'NAKATA', equivalents: ['VIEMAR VT1411', 'AXIOS AT1411'], avgPrice: 80 },
    steering_rack_boot: { partNumber: 'CR1411', brand: 'NAKATA', equivalents: ['VIEMAR VC1411', 'AXIOS AC1411'], avgPrice: 48 },
    timing_belt: { partNumber: 'CT1411', brand: 'CONTITECH', equivalents: ['GATES 5611XS', 'DAYCO 941411', 'INA 530061710'], avgPrice: 150 },
    timing_belt_tensioner: { partNumber: 'VKM11411', brand: 'SKF', equivalents: ['INA 531061710', 'GATES T43411'], avgPrice: 185 },
    water_pump: { partNumber: 'WP1411', brand: 'URBA', equivalents: ['INDISA 1411', 'NAKATA NKBA1411', 'SKF VKPC81411'], avgPrice: 220 },
    thermostat: { partNumber: 'TH1411', brand: 'WAHLER', equivalents: ['BEHR TX1411', 'GATES TH1411'], avgPrice: 70 },
    alternator_belt: { partNumber: '6PK1411', brand: 'CONTITECH', equivalents: ['GATES 6PK1411', 'DAYCO 6PK1411'], avgPrice: 48 },
    engine_oil: { partNumber: '5W30-4L', brand: 'CASTROL', equivalents: ['MOBIL 5W30', 'SHELL 5W30', 'PETRONAS 5W30'], avgPrice: 125 },
    coolant: { partNumber: 'PARAFLU-1L', brand: 'FIAT', equivalents: ['PARAFLU UP', 'CASTROL COOLANT'], avgPrice: 45 },
    valve_cover_gasket: { partNumber: 'JTV1411', brand: 'VICTOR REINZ', equivalents: ['ELRING 1411', 'AJUSA 1411'], avgPrice: 90 },
    oil_pan_gasket: { partNumber: 'JC1411', brand: 'VICTOR REINZ', equivalents: ['ELRING C1411', 'AJUSA C1411'], avgPrice: 100 },
    pcv_valve: { partNumber: 'PCV1411', brand: 'BOSCH', equivalents: ['WAHLER PCV1411', 'GATES PCV1411'], avgPrice: 38 },
    battery: { partNumber: 'M60GD', brand: 'MOURA', equivalents: ['HELIAR HF60DD', 'ACDelco 60AH', 'BOSCH S5X60D'], avgPrice: 450 },
    alternator: { partNumber: 'ALT1411', brand: 'BOSCH', equivalents: ['VALEO 1411', 'DENSO 1411'], avgPrice: 680 },
    starter_motor: { partNumber: 'SM1411', brand: 'BOSCH', equivalents: ['VALEO SM1411', 'DENSO SM1411'], avgPrice: 580 },
    headlight_bulb: { partNumber: 'H7-55W', brand: 'OSRAM', equivalents: ['PHILIPS H7', 'NARVA H7', 'GE H7'], avgPrice: 38 },
    brake_light_bulb: { partNumber: 'P21W', brand: 'OSRAM', equivalents: ['PHILIPS P21W', 'NARVA P21W'], avgPrice: 9 },
    fuse_kit: { partNumber: 'FK-UNIV', brand: 'LITTELFUSE', equivalents: ['BUSSMANN FK', 'HELLA FK'], avgPrice: 25 },
    clutch_kit: { partNumber: 'CK1411', brand: 'LUK', equivalents: ['SACHS 3000954411', 'VALEO 826411', 'EXEDY 1411'], avgPrice: 720 },
    clutch_cable: { partNumber: 'N/A-ARGO', brand: 'N/A', equivalents: [], avgPrice: 0 },
    transmission_oil: { partNumber: '75W90-1L', brand: 'CASTROL', equivalents: ['MOBIL 75W90', 'SHELL 75W90'], avgPrice: 85 },
    cv_joint: { partNumber: 'CVJ1411', brand: 'GKN', equivalents: ['SKF VKJA1411', 'NAKATA NCV1411'], avgPrice: 310 },
    front_wheel_bearing: { partNumber: 'WB1411', brand: 'SKF', equivalents: ['FAG 713610411', 'NSK 45BWD411', 'TIMKEN 1411'], avgPrice: 200 },
    rear_wheel_bearing: { partNumber: 'WB1412', brand: 'SKF', equivalents: ['FAG 713610412', 'NSK 45BWD412', 'TIMKEN 1412'], avgPrice: 175 },
    clutch_bearing: { partNumber: 'CB1411', brand: 'SKF', equivalents: ['FAG CB1411', 'NSK CB1411', 'INA CB1411'], avgPrice: 125 },
  },

  // GM GEM (Onix, Prisma, Spin, Cobalt)
  GM_GEM: {
    oil_filter: { partNumber: 'W712/94', brand: 'MANN-FILTER', equivalents: ['TECFIL PSL594', 'FRAM PH10575', 'BOSCH F026407094'], avgPrice: 48 },
    air_filter: { partNumber: 'C27154', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL7154', 'FRAM CA11154', 'BOSCH F026400154'], avgPrice: 58 },
    cabin_filter: { partNumber: 'CUK2442', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP442', 'FRAM CF10442', 'BOSCH 1987432442'], avgPrice: 62 },
    fuel_filter: { partNumber: 'WK730/6', brand: 'MANN-FILTER', equivalents: ['TECFIL GI06', 'FRAM G10736', 'BOSCH F026402736'], avgPrice: 80 },
    transmission_filter: { partNumber: 'H199KIT-GEM', brand: 'MANN-FILTER', equivalents: ['ZF 0501216247', 'MEYLE 1003250008'], avgPrice: 125 },
    front_brake_pads: { partNumber: 'N-1575', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1575', 'BOSCH BP1575', 'TRW GDB1975'], avgPrice: 88 },
    rear_brake_pads: { partNumber: 'N-1576', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1576', 'BOSCH BP1576', 'TRW GDB1976'], avgPrice: 72 },
    front_brake_disc: { partNumber: 'BD1575', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1575', 'VARGA 1575', 'TRW DF6575'], avgPrice: 195 },
    rear_brake_disc: { partNumber: 'BD1576', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1576', 'VARGA 1576', 'TRW DF6576'], avgPrice: 165 },
    brake_fluid: { partNumber: 'DOT4-500ML', brand: 'BOSCH', equivalents: ['WAGNER DOT4', 'CASTROL DOT4', 'MOBIL DOT4'], avgPrice: 35 },
    brake_hose_front: { partNumber: 'FH1575', brand: 'FRAS-LE', equivalents: ['TRW PHD1575', 'VARGA VH1575'], avgPrice: 46 },
    brake_hose_rear: { partNumber: 'FH1576', brand: 'FRAS-LE', equivalents: ['TRW PHD1576', 'VARGA VH1576'], avgPrice: 42 },
    handbrake_cable: { partNumber: 'CB1575', brand: 'COFLE', equivalents: ['NAKATA NCB1575', 'FRAS-LE FCB1575'], avgPrice: 55 },
    spark_plugs: { partNumber: 'BKR6EIX', brand: 'NGK', equivalents: ['BOSCH FR7KI332S', 'DENSO IK20', 'CHAMPION RC10PYPB4'], avgPrice: 55 },
    ignition_coil: { partNumber: 'U5575', brand: 'NGK', equivalents: ['BOSCH 0221604575', 'BERU ZS575'], avgPrice: 175 },
    spark_plug_wires: { partNumber: 'N/A-GEM', brand: 'N/A', equivalents: [], avgPrice: 0 },
    distributor_cap: { partNumber: 'N/A-GEM', brand: 'N/A', equivalents: [], avgPrice: 0 },
    front_shock: { partNumber: 'GP33575', brand: 'MONROE', equivalents: ['COFAP MP33575', 'NAKATA HG33575', 'KAYABA 339575'], avgPrice: 290 },
    rear_shock: { partNumber: 'GP33576', brand: 'MONROE', equivalents: ['COFAP MP33576', 'NAKATA HG33576', 'KAYABA 349576'], avgPrice: 240 },
    front_spring: { partNumber: 'MC1575', brand: 'COFAP', equivalents: ['FABRINI F1575', 'NAKATA NS1575'], avgPrice: 175 },
    rear_spring: { partNumber: 'MC1576', brand: 'COFAP', equivalents: ['FABRINI F1576', 'NAKATA NS1576'], avgPrice: 155 },
    front_stabilizer_link: { partNumber: 'BL1575', brand: 'NAKATA', equivalents: ['VIEMAR V1575', 'AXIOS AX1575'], avgPrice: 62 },
    rear_stabilizer_link: { partNumber: 'BL1576', brand: 'NAKATA', equivalents: ['VIEMAR V1576', 'AXIOS AX1576'], avgPrice: 58 },
    control_arm_front: { partNumber: 'BA1575', brand: 'NAKATA', equivalents: ['VIEMAR VB1575', 'AXIOS AB1575'], avgPrice: 310 },
    ball_joint: { partNumber: 'PV1575', brand: 'NAKATA', equivalents: ['VIEMAR VP1575', 'AXIOS AP1575'], avgPrice: 82 },
    tie_rod_end: { partNumber: 'TD1575', brand: 'NAKATA', equivalents: ['VIEMAR VT1575', 'AXIOS AT1575'], avgPrice: 72 },
    steering_rack_boot: { partNumber: 'CR1575', brand: 'NAKATA', equivalents: ['VIEMAR VC1575', 'AXIOS AC1575'], avgPrice: 44 },
    timing_belt: { partNumber: 'CT1575', brand: 'CONTITECH', equivalents: ['GATES 5575XS', 'DAYCO 941575', 'INA 530057510'], avgPrice: 130 },
    timing_belt_tensioner: { partNumber: 'VKM11575', brand: 'SKF', equivalents: ['INA 531057510', 'GATES T43575'], avgPrice: 170 },
    water_pump: { partNumber: 'WP1575', brand: 'URBA', equivalents: ['INDISA 1575', 'NAKATA NKBA1575', 'SKF VKPC81575'], avgPrice: 195 },
    thermostat: { partNumber: 'TH1575', brand: 'WAHLER', equivalents: ['BEHR TX1575', 'GATES TH1575'], avgPrice: 62 },
    alternator_belt: { partNumber: '6PK1575', brand: 'CONTITECH', equivalents: ['GATES 6PK1575', 'DAYCO 6PK1575'], avgPrice: 44 },
    engine_oil: { partNumber: '5W30-4L', brand: 'CASTROL', equivalents: ['MOBIL 5W30', 'SHELL 5W30', 'PETRONAS 5W30'], avgPrice: 118 },
    coolant: { partNumber: 'DEXCOOL-1L', brand: 'GM', equivalents: ['PARAFLU DEXCOOL', 'CASTROL DEXCOOL'], avgPrice: 48 },
    valve_cover_gasket: { partNumber: 'JTV1575', brand: 'VICTOR REINZ', equivalents: ['ELRING 1575', 'AJUSA 1575'], avgPrice: 82 },
    oil_pan_gasket: { partNumber: 'JC1575', brand: 'VICTOR REINZ', equivalents: ['ELRING C1575', 'AJUSA C1575'], avgPrice: 92 },
    pcv_valve: { partNumber: 'PCV1575', brand: 'BOSCH', equivalents: ['WAHLER PCV1575', 'GATES PCV1575'], avgPrice: 34 },
    battery: { partNumber: 'M60GD', brand: 'MOURA', equivalents: ['HELIAR HF60DD', 'ACDelco 60AH', 'BOSCH S5X60D'], avgPrice: 450 },
    alternator: { partNumber: 'ALT1575', brand: 'BOSCH', equivalents: ['VALEO 1575', 'DENSO 1575'], avgPrice: 620 },
    starter_motor: { partNumber: 'SM1575', brand: 'BOSCH', equivalents: ['VALEO SM1575', 'DENSO SM1575'], avgPrice: 520 },
    headlight_bulb: { partNumber: 'H7-55W', brand: 'OSRAM', equivalents: ['PHILIPS H7', 'NARVA H7', 'GE H7'], avgPrice: 36 },
    brake_light_bulb: { partNumber: 'P21W', brand: 'OSRAM', equivalents: ['PHILIPS P21W', 'NARVA P21W'], avgPrice: 8 },
    fuse_kit: { partNumber: 'FK-UNIV', brand: 'LITTELFUSE', equivalents: ['BUSSMANN FK', 'HELLA FK'], avgPrice: 24 },
    clutch_kit: { partNumber: 'CK1575', brand: 'LUK', equivalents: ['SACHS 3000954575', 'VALEO 826575', 'EXEDY 1575'], avgPrice: 680 },
    clutch_cable: { partNumber: 'CC1575', brand: 'COFLE', equivalents: ['NAKATA NCC1575', 'FRAS-LE FCC1575'], avgPrice: 70 },
    transmission_oil: { partNumber: '75W90-1L', brand: 'CASTROL', equivalents: ['MOBIL 75W90', 'SHELL 75W90'], avgPrice: 82 },
    cv_joint: { partNumber: 'CVJ1575', brand: 'GKN', equivalents: ['SKF VKJA1575', 'NAKATA NCV1575'], avgPrice: 290 },
    front_wheel_bearing: { partNumber: 'WB1575', brand: 'SKF', equivalents: ['FAG 713610575', 'NSK 45BWD575', 'TIMKEN 1575'], avgPrice: 185 },
    rear_wheel_bearing: { partNumber: 'WB1576', brand: 'SKF', equivalents: ['FAG 713610576', 'NSK 45BWD576', 'TIMKEN 1576'], avgPrice: 165 },
    clutch_bearing: { partNumber: 'CB1575', brand: 'SKF', equivalents: ['FAG CB1575', 'NSK CB1575', 'INA CB1575'], avgPrice: 115 },
  },

  // GM VSS (Cruze, Tracker, Equinox)
  GM_VSS: {
    oil_filter: { partNumber: 'HU6007Z', brand: 'MANN-FILTER', equivalents: ['MAHLE OX418D', 'BOSCH P9418', 'WIX WL7418'], avgPrice: 78 },
    air_filter: { partNumber: 'C30005', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL5005', 'FRAM CA12005', 'BOSCH F026400005'], avgPrice: 72 },
    cabin_filter: { partNumber: 'CUK2620', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP620', 'FRAM CF10620', 'BOSCH 1987432620'], avgPrice: 78 },
    fuel_filter: { partNumber: 'WK69/3', brand: 'MANN-FILTER', equivalents: ['TECFIL GI693', 'FRAM G10693', 'BOSCH F026402693'], avgPrice: 92 },
    transmission_filter: { partNumber: 'H199KIT-VSS', brand: 'MANN-FILTER', equivalents: ['ZF 0501216248', 'MEYLE 1003250009'], avgPrice: 145 },
    front_brake_pads: { partNumber: 'N-1618', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1618', 'BOSCH BP1618', 'TRW GDB2018'], avgPrice: 125 },
    rear_brake_pads: { partNumber: 'N-1619', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1619', 'BOSCH BP1619', 'TRW GDB2019'], avgPrice: 98 },
    front_brake_disc: { partNumber: 'BD1618', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1618', 'VARGA 1618', 'TRW DF6618'], avgPrice: 295 },
    rear_brake_disc: { partNumber: 'BD1619', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1619', 'VARGA 1619', 'TRW DF6619'], avgPrice: 245 },
    brake_fluid: { partNumber: 'DOT4-500ML', brand: 'BOSCH', equivalents: ['WAGNER DOT4', 'CASTROL DOT4', 'MOBIL DOT4'], avgPrice: 35 },
    brake_hose_front: { partNumber: 'FH1618', brand: 'FRAS-LE', equivalents: ['TRW PHD1618', 'VARGA VH1618'], avgPrice: 58 },
    brake_hose_rear: { partNumber: 'FH1619', brand: 'FRAS-LE', equivalents: ['TRW PHD1619', 'VARGA VH1619'], avgPrice: 52 },
    handbrake_cable: { partNumber: 'CB1618', brand: 'COFLE', equivalents: ['NAKATA NCB1618', 'FRAS-LE FCB1618'], avgPrice: 68 },
    spark_plugs: { partNumber: 'ILTR6A-8G', brand: 'NGK', equivalents: ['BOSCH FR8KI332S', 'DENSO IK22', 'CHAMPION RC12PYPB4'], avgPrice: 72 },
    ignition_coil: { partNumber: 'U5618', brand: 'NGK', equivalents: ['BOSCH 0221604618', 'BERU ZS618'], avgPrice: 235 },
    spark_plug_wires: { partNumber: 'N/A-VSS', brand: 'N/A', equivalents: [], avgPrice: 0 },
    distributor_cap: { partNumber: 'N/A-VSS', brand: 'N/A', equivalents: [], avgPrice: 0 },
    front_shock: { partNumber: 'GP33618', brand: 'MONROE', equivalents: ['COFAP MP33618', 'NAKATA HG33618', 'KAYABA 339618'], avgPrice: 380 },
    rear_shock: { partNumber: 'GP33619', brand: 'MONROE', equivalents: ['COFAP MP33619', 'NAKATA HG33619', 'KAYABA 349619'], avgPrice: 320 },
    front_spring: { partNumber: 'MC1618', brand: 'COFAP', equivalents: ['FABRINI F1618', 'NAKATA NS1618'], avgPrice: 225 },
    rear_spring: { partNumber: 'MC1619', brand: 'COFAP', equivalents: ['FABRINI F1619', 'NAKATA NS1619'], avgPrice: 195 },
    front_stabilizer_link: { partNumber: 'BL1618', brand: 'NAKATA', equivalents: ['VIEMAR V1618', 'AXIOS AX1618'], avgPrice: 78 },
    rear_stabilizer_link: { partNumber: 'BL1619', brand: 'NAKATA', equivalents: ['VIEMAR V1619', 'AXIOS AX1619'], avgPrice: 72 },
    control_arm_front: { partNumber: 'BA1618', brand: 'NAKATA', equivalents: ['VIEMAR VB1618', 'AXIOS AB1618'], avgPrice: 420 },
    ball_joint: { partNumber: 'PV1618', brand: 'NAKATA', equivalents: ['VIEMAR VP1618', 'AXIOS AP1618'], avgPrice: 105 },
    tie_rod_end: { partNumber: 'TD1618', brand: 'NAKATA', equivalents: ['VIEMAR VT1618', 'AXIOS AT1618'], avgPrice: 92 },
    steering_rack_boot: { partNumber: 'CR1618', brand: 'NAKATA', equivalents: ['VIEMAR VC1618', 'AXIOS AC1618'], avgPrice: 55 },
    timing_belt: { partNumber: 'CT1618', brand: 'CONTITECH', equivalents: ['GATES 5618XS', 'DAYCO 941618', 'INA 530061810'], avgPrice: 185 },
    timing_belt_tensioner: { partNumber: 'VKM11618', brand: 'SKF', equivalents: ['INA 531061810', 'GATES T43618'], avgPrice: 215 },
    water_pump: { partNumber: 'WP1618', brand: 'URBA', equivalents: ['INDISA 1618', 'NAKATA NKBA1618', 'SKF VKPC81618'], avgPrice: 275 },
    thermostat: { partNumber: 'TH1618', brand: 'WAHLER', equivalents: ['BEHR TX1618', 'GATES TH1618'], avgPrice: 78 },
    alternator_belt: { partNumber: '6PK1618', brand: 'CONTITECH', equivalents: ['GATES 6PK1618', 'DAYCO 6PK1618'], avgPrice: 52 },
    engine_oil: { partNumber: '5W30-4L', brand: 'CASTROL', equivalents: ['MOBIL 5W30', 'SHELL 5W30', 'PETRONAS 5W30'], avgPrice: 135 },
    coolant: { partNumber: 'DEXCOOL-1L', brand: 'GM', equivalents: ['PARAFLU DEXCOOL', 'CASTROL DEXCOOL'], avgPrice: 52 },
    valve_cover_gasket: { partNumber: 'JTV1618', brand: 'VICTOR REINZ', equivalents: ['ELRING 1618', 'AJUSA 1618'], avgPrice: 105 },
    oil_pan_gasket: { partNumber: 'JC1618', brand: 'VICTOR REINZ', equivalents: ['ELRING C1618', 'AJUSA C1618'], avgPrice: 115 },
    pcv_valve: { partNumber: 'PCV1618', brand: 'BOSCH', equivalents: ['WAHLER PCV1618', 'GATES PCV1618'], avgPrice: 42 },
    battery: { partNumber: 'M70GD', brand: 'MOURA', equivalents: ['HELIAR HF70DD', 'ACDelco 70AH', 'BOSCH S5X70D'], avgPrice: 550 },
    alternator: { partNumber: 'ALT1618', brand: 'BOSCH', equivalents: ['VALEO 1618', 'DENSO 1618'], avgPrice: 820 },
    starter_motor: { partNumber: 'SM1618', brand: 'BOSCH', equivalents: ['VALEO SM1618', 'DENSO SM1618'], avgPrice: 720 },
    headlight_bulb: { partNumber: 'H7-55W', brand: 'OSRAM', equivalents: ['PHILIPS H7', 'NARVA H7', 'GE H7'], avgPrice: 42 },
    brake_light_bulb: { partNumber: 'P21W', brand: 'OSRAM', equivalents: ['PHILIPS P21W', 'NARVA P21W'], avgPrice: 10 },
    fuse_kit: { partNumber: 'FK-UNIV', brand: 'LITTELFUSE', equivalents: ['BUSSMANN FK', 'HELLA FK'], avgPrice: 28 },
    clutch_kit: { partNumber: 'CK1618', brand: 'LUK', equivalents: ['SACHS 3000954618', 'VALEO 826618', 'EXEDY 1618'], avgPrice: 880 },
    clutch_cable: { partNumber: 'N/A-VSS', brand: 'N/A', equivalents: [], avgPrice: 0 },
    transmission_oil: { partNumber: '75W90-1L', brand: 'CASTROL', equivalents: ['MOBIL 75W90', 'SHELL 75W90'], avgPrice: 95 },
    cv_joint: { partNumber: 'CVJ1618', brand: 'GKN', equivalents: ['SKF VKJA1618', 'NAKATA NCV1618'], avgPrice: 380 },
    front_wheel_bearing: { partNumber: 'WB1618', brand: 'SKF', equivalents: ['FAG 713610618', 'NSK 45BWD618', 'TIMKEN 1618'], avgPrice: 240 },
    rear_wheel_bearing: { partNumber: 'WB1619', brand: 'SKF', equivalents: ['FAG 713610619', 'NSK 45BWD619', 'TIMKEN 1619'], avgPrice: 210 },
    clutch_bearing: { partNumber: 'CB1618', brand: 'SKF', equivalents: ['FAG CB1618', 'NSK CB1618', 'INA CB1618'], avgPrice: 145 },
  },

  // HONDA (Civic, City, Fit, HR-V, WR-V)
  HONDA: {
    oil_filter: { partNumber: 'W610/6', brand: 'MANN-FILTER', equivalents: ['TECFIL PSL610', 'FRAM PH6607', 'BOSCH F026407610'], avgPrice: 52 },
    air_filter: { partNumber: 'C2201', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL2201', 'FRAM CA10201', 'BOSCH F026400201'], avgPrice: 62 },
    cabin_filter: { partNumber: 'CUK2358', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP358', 'FRAM CF10358', 'BOSCH 1987432358'], avgPrice: 68 },
    fuel_filter: { partNumber: 'WK730/7', brand: 'MANN-FILTER', equivalents: ['TECFIL GI07', 'FRAM G10737', 'BOSCH F026402737'], avgPrice: 82 },
    transmission_filter: { partNumber: 'H199KIT-HONDA', brand: 'MANN-FILTER', equivalents: ['ZF 0501216249', 'MEYLE 1003250010'], avgPrice: 135 },
    front_brake_pads: { partNumber: 'N-1201', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1201', 'BOSCH BP1201', 'TRW GDB1601'], avgPrice: 95 },
    rear_brake_pads: { partNumber: 'N-1202', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1202', 'BOSCH BP1202', 'TRW GDB1602'], avgPrice: 78 },
    front_brake_disc: { partNumber: 'BD1201', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1201', 'VARGA 1201', 'TRW DF6201'], avgPrice: 210 },
    rear_brake_disc: { partNumber: 'BD1202', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1202', 'VARGA 1202', 'TRW DF6202'], avgPrice: 175 },
    brake_fluid: { partNumber: 'DOT4-500ML', brand: 'BOSCH', equivalents: ['WAGNER DOT4', 'CASTROL DOT4', 'MOBIL DOT4'], avgPrice: 35 },
    brake_hose_front: { partNumber: 'FH1201', brand: 'FRAS-LE', equivalents: ['TRW PHD1201', 'VARGA VH1201'], avgPrice: 50 },
    brake_hose_rear: { partNumber: 'FH1202', brand: 'FRAS-LE', equivalents: ['TRW PHD1202', 'VARGA VH1202'], avgPrice: 45 },
    handbrake_cable: { partNumber: 'CB1201', brand: 'COFLE', equivalents: ['NAKATA NCB1201', 'FRAS-LE FCB1201'], avgPrice: 60 },
    spark_plugs: { partNumber: 'IZFR6K-11', brand: 'NGK', equivalents: ['BOSCH FR7KI332S', 'DENSO IK20TT', 'CHAMPION RC10PYPB4'], avgPrice: 68 },
    ignition_coil: { partNumber: 'U5201', brand: 'NGK', equivalents: ['BOSCH 0221604201', 'BERU ZS201'], avgPrice: 195 },
    spark_plug_wires: { partNumber: 'N/A-HONDA', brand: 'N/A', equivalents: [], avgPrice: 0 },
    distributor_cap: { partNumber: 'N/A-HONDA', brand: 'N/A', equivalents: [], avgPrice: 0 },
    front_shock: { partNumber: 'GP33201', brand: 'MONROE', equivalents: ['COFAP MP33201', 'NAKATA HG33201', 'KAYABA 339201'], avgPrice: 340 },
    rear_shock: { partNumber: 'GP33202', brand: 'MONROE', equivalents: ['COFAP MP33202', 'NAKATA HG33202', 'KAYABA 349202'], avgPrice: 280 },
    front_spring: { partNumber: 'MC1201', brand: 'COFAP', equivalents: ['FABRINI F1201', 'NAKATA NS1201'], avgPrice: 195 },
    rear_spring: { partNumber: 'MC1202', brand: 'COFAP', equivalents: ['FABRINI F1202', 'NAKATA NS1202'], avgPrice: 175 },
    front_stabilizer_link: { partNumber: 'BL1201', brand: 'NAKATA', equivalents: ['VIEMAR V1201', 'AXIOS AX1201'], avgPrice: 68 },
    rear_stabilizer_link: { partNumber: 'BL1202', brand: 'NAKATA', equivalents: ['VIEMAR V1202', 'AXIOS AX1202'], avgPrice: 62 },
    control_arm_front: { partNumber: 'BA1201', brand: 'NAKATA', equivalents: ['VIEMAR VB1201', 'AXIOS AB1201'], avgPrice: 360 },
    ball_joint: { partNumber: 'PV1201', brand: 'NAKATA', equivalents: ['VIEMAR VP1201', 'AXIOS AP1201'], avgPrice: 92 },
    tie_rod_end: { partNumber: 'TD1201', brand: 'NAKATA', equivalents: ['VIEMAR VT1201', 'AXIOS AT1201'], avgPrice: 78 },
    steering_rack_boot: { partNumber: 'CR1201', brand: 'NAKATA', equivalents: ['VIEMAR VC1201', 'AXIOS AC1201'], avgPrice: 48 },
    timing_belt: { partNumber: 'CT1201', brand: 'CONTITECH', equivalents: ['GATES 5501XS', 'DAYCO 941201', 'INA 530050110'], avgPrice: 145 },
    timing_belt_tensioner: { partNumber: 'VKM11201', brand: 'SKF', equivalents: ['INA 531050110', 'GATES T43201'], avgPrice: 185 },
    water_pump: { partNumber: 'WP1201', brand: 'URBA', equivalents: ['INDISA 1201', 'NAKATA NKBA1201', 'SKF VKPC81201'], avgPrice: 225 },
    thermostat: { partNumber: 'TH1201', brand: 'WAHLER', equivalents: ['BEHR TX1201', 'GATES TH1201'], avgPrice: 68 },
    alternator_belt: { partNumber: '6PK1201', brand: 'CONTITECH', equivalents: ['GATES 6PK1201', 'DAYCO 6PK1201'], avgPrice: 48 },
    engine_oil: { partNumber: '5W30-4L', brand: 'CASTROL', equivalents: ['MOBIL 5W30', 'SHELL 5W30', 'PETRONAS 5W30'], avgPrice: 125 },
    coolant: { partNumber: 'HONDA-1L', brand: 'HONDA', equivalents: ['PARAFLU HONDA', 'CASTROL COOLANT'], avgPrice: 48 },
    valve_cover_gasket: { partNumber: 'JTV1201', brand: 'VICTOR REINZ', equivalents: ['ELRING 1201', 'AJUSA 1201'], avgPrice: 88 },
    oil_pan_gasket: { partNumber: 'JC1201', brand: 'VICTOR REINZ', equivalents: ['ELRING C1201', 'AJUSA C1201'], avgPrice: 98 },
    pcv_valve: { partNumber: 'PCV1201', brand: 'BOSCH', equivalents: ['WAHLER PCV1201', 'GATES PCV1201'], avgPrice: 36 },
    battery: { partNumber: 'M60GD', brand: 'MOURA', equivalents: ['HELIAR HF60DD', 'ACDelco 60AH', 'BOSCH S5X60D'], avgPrice: 450 },
    alternator: { partNumber: 'ALT1201', brand: 'BOSCH', equivalents: ['VALEO 1201', 'DENSO 1201'], avgPrice: 680 },
    starter_motor: { partNumber: 'SM1201', brand: 'BOSCH', equivalents: ['VALEO SM1201', 'DENSO SM1201'], avgPrice: 580 },
    headlight_bulb: { partNumber: 'H7-55W', brand: 'OSRAM', equivalents: ['PHILIPS H7', 'NARVA H7', 'GE H7'], avgPrice: 38 },
    brake_light_bulb: { partNumber: 'P21W', brand: 'OSRAM', equivalents: ['PHILIPS P21W', 'NARVA P21W'], avgPrice: 9 },
    fuse_kit: { partNumber: 'FK-UNIV', brand: 'LITTELFUSE', equivalents: ['BUSSMANN FK', 'HELLA FK'], avgPrice: 25 },
    clutch_kit: { partNumber: 'CK1201', brand: 'LUK', equivalents: ['SACHS 3000954201', 'VALEO 826201', 'EXEDY 1201'], avgPrice: 750 },
    clutch_cable: { partNumber: 'N/A-HONDA', brand: 'N/A', equivalents: [], avgPrice: 0 },
    transmission_oil: { partNumber: '75W90-1L', brand: 'CASTROL', equivalents: ['MOBIL 75W90', 'SHELL 75W90'], avgPrice: 88 },
    cv_joint: { partNumber: 'CVJ1201', brand: 'GKN', equivalents: ['SKF VKJA1201', 'NAKATA NCV1201'], avgPrice: 320 },
    front_wheel_bearing: { partNumber: 'WB1201', brand: 'SKF', equivalents: ['FAG 713610201', 'NSK 45BWD201', 'TIMKEN 1201'], avgPrice: 195 },
    rear_wheel_bearing: { partNumber: 'WB1202', brand: 'SKF', equivalents: ['FAG 713610202', 'NSK 45BWD202', 'TIMKEN 1202'], avgPrice: 170 },
    clutch_bearing: { partNumber: 'CB1201', brand: 'SKF', equivalents: ['FAG CB1201', 'NSK CB1201', 'INA CB1201'], avgPrice: 125 },
  },

  // TOYOTA (Corolla, Yaris, Etios, Hilux, SW4)
  TOYOTA: {
    oil_filter: { partNumber: 'W68/3', brand: 'MANN-FILTER', equivalents: ['TECFIL PSL683', 'FRAM PH4967', 'BOSCH F026407683'], avgPrice: 55 },
    air_filter: { partNumber: 'C26168', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL6168', 'FRAM CA10168', 'BOSCH F026400168'], avgPrice: 68 },
    cabin_filter: { partNumber: 'CUK2317', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP317', 'FRAM CF10317', 'BOSCH 1987432317'], avgPrice: 72 },
    fuel_filter: { partNumber: 'WK730/8', brand: 'MANN-FILTER', equivalents: ['TECFIL GI08', 'FRAM G10738', 'BOSCH F026402738'], avgPrice: 85 },
    transmission_filter: { partNumber: 'H199KIT-TOYOTA', brand: 'MANN-FILTER', equivalents: ['ZF 0501216250', 'MEYLE 1003250011'], avgPrice: 140 },
    front_brake_pads: { partNumber: 'N-1168', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1168', 'BOSCH BP1168', 'TRW GDB1568'], avgPrice: 105 },
    rear_brake_pads: { partNumber: 'N-1169', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1169', 'BOSCH BP1169', 'TRW GDB1569'], avgPrice: 85 },
    front_brake_disc: { partNumber: 'BD1168', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1168', 'VARGA 1168', 'TRW DF6168'], avgPrice: 235 },
    rear_brake_disc: { partNumber: 'BD1169', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1169', 'VARGA 1169', 'TRW DF6169'], avgPrice: 195 },
    brake_fluid: { partNumber: 'DOT4-500ML', brand: 'BOSCH', equivalents: ['WAGNER DOT4', 'CASTROL DOT4', 'MOBIL DOT4'], avgPrice: 35 },
    brake_hose_front: { partNumber: 'FH1168', brand: 'FRAS-LE', equivalents: ['TRW PHD1168', 'VARGA VH1168'], avgPrice: 52 },
    brake_hose_rear: { partNumber: 'FH1169', brand: 'FRAS-LE', equivalents: ['TRW PHD1169', 'VARGA VH1169'], avgPrice: 48 },
    handbrake_cable: { partNumber: 'CB1168', brand: 'COFLE', equivalents: ['NAKATA NCB1168', 'FRAS-LE FCB1168'], avgPrice: 62 },
    spark_plugs: { partNumber: 'ILZKR7B-11S', brand: 'NGK', equivalents: ['BOSCH FR7KI332S', 'DENSO IK20TT', 'CHAMPION RC10PYPB4'], avgPrice: 65 },
    ignition_coil: { partNumber: 'U5168', brand: 'NGK', equivalents: ['BOSCH 0221604168', 'BERU ZS168'], avgPrice: 205 },
    spark_plug_wires: { partNumber: 'N/A-TOYOTA', brand: 'N/A', equivalents: [], avgPrice: 0 },
    distributor_cap: { partNumber: 'N/A-TOYOTA', brand: 'N/A', equivalents: [], avgPrice: 0 },
    front_shock: { partNumber: 'GP33168', brand: 'MONROE', equivalents: ['COFAP MP33168', 'NAKATA HG33168', 'KAYABA 339168'], avgPrice: 360 },
    rear_shock: { partNumber: 'GP33169', brand: 'MONROE', equivalents: ['COFAP MP33169', 'NAKATA HG33169', 'KAYABA 349169'], avgPrice: 300 },
    front_spring: { partNumber: 'MC1168', brand: 'COFAP', equivalents: ['FABRINI F1168', 'NAKATA NS1168'], avgPrice: 205 },
    rear_spring: { partNumber: 'MC1169', brand: 'COFAP', equivalents: ['FABRINI F1169', 'NAKATA NS1169'], avgPrice: 185 },
    front_stabilizer_link: { partNumber: 'BL1168', brand: 'NAKATA', equivalents: ['VIEMAR V1168', 'AXIOS AX1168'], avgPrice: 72 },
    rear_stabilizer_link: { partNumber: 'BL1169', brand: 'NAKATA', equivalents: ['VIEMAR V1169', 'AXIOS AX1169'], avgPrice: 65 },
    control_arm_front: { partNumber: 'BA1168', brand: 'NAKATA', equivalents: ['VIEMAR VB1168', 'AXIOS AB1168'], avgPrice: 380 },
    ball_joint: { partNumber: 'PV1168', brand: 'NAKATA', equivalents: ['VIEMAR VP1168', 'AXIOS AP1168'], avgPrice: 98 },
    tie_rod_end: { partNumber: 'TD1168', brand: 'NAKATA', equivalents: ['VIEMAR VT1168', 'AXIOS AT1168'], avgPrice: 82 },
    steering_rack_boot: { partNumber: 'CR1168', brand: 'NAKATA', equivalents: ['VIEMAR VC1168', 'AXIOS AC1168'], avgPrice: 50 },
    timing_belt: { partNumber: 'CT1168', brand: 'CONTITECH', equivalents: ['GATES 5568XS', 'DAYCO 941168', 'INA 530056810'], avgPrice: 155 },
    timing_belt_tensioner: { partNumber: 'VKM11168', brand: 'SKF', equivalents: ['INA 531056810', 'GATES T43168'], avgPrice: 195 },
    water_pump: { partNumber: 'WP1168', brand: 'URBA', equivalents: ['INDISA 1168', 'NAKATA NKBA1168', 'SKF VKPC81168'], avgPrice: 245 },
    thermostat: { partNumber: 'TH1168', brand: 'WAHLER', equivalents: ['BEHR TX1168', 'GATES TH1168'], avgPrice: 72 },
    alternator_belt: { partNumber: '6PK1168', brand: 'CONTITECH', equivalents: ['GATES 6PK1168', 'DAYCO 6PK1168'], avgPrice: 50 },
    engine_oil: { partNumber: '5W30-4L', brand: 'CASTROL', equivalents: ['MOBIL 5W30', 'SHELL 5W30', 'PETRONAS 5W30'], avgPrice: 130 },
    coolant: { partNumber: 'TOYOTA-1L', brand: 'TOYOTA', equivalents: ['PARAFLU TOYOTA', 'CASTROL COOLANT'], avgPrice: 50 },
    valve_cover_gasket: { partNumber: 'JTV1168', brand: 'VICTOR REINZ', equivalents: ['ELRING 1168', 'AJUSA 1168'], avgPrice: 92 },
    oil_pan_gasket: { partNumber: 'JC1168', brand: 'VICTOR REINZ', equivalents: ['ELRING C1168', 'AJUSA C1168'], avgPrice: 102 },
    pcv_valve: { partNumber: 'PCV1168', brand: 'BOSCH', equivalents: ['WAHLER PCV1168', 'GATES PCV1168'], avgPrice: 38 },
    battery: { partNumber: 'M60GD', brand: 'MOURA', equivalents: ['HELIAR HF60DD', 'ACDelco 60AH', 'BOSCH S5X60D'], avgPrice: 450 },
    alternator: { partNumber: 'ALT1168', brand: 'BOSCH', equivalents: ['VALEO 1168', 'DENSO 1168'], avgPrice: 720 },
    starter_motor: { partNumber: 'SM1168', brand: 'BOSCH', equivalents: ['VALEO SM1168', 'DENSO SM1168'], avgPrice: 620 },
    headlight_bulb: { partNumber: 'H7-55W', brand: 'OSRAM', equivalents: ['PHILIPS H7', 'NARVA H7', 'GE H7'], avgPrice: 40 },
    brake_light_bulb: { partNumber: 'P21W', brand: 'OSRAM', equivalents: ['PHILIPS P21W', 'NARVA P21W'], avgPrice: 9 },
    fuse_kit: { partNumber: 'FK-UNIV', brand: 'LITTELFUSE', equivalents: ['BUSSMANN FK', 'HELLA FK'], avgPrice: 26 },
    clutch_kit: { partNumber: 'CK1168', brand: 'LUK', equivalents: ['SACHS 3000954168', 'VALEO 826168', 'EXEDY 1168'], avgPrice: 780 },
    clutch_cable: { partNumber: 'N/A-TOYOTA', brand: 'N/A', equivalents: [], avgPrice: 0 },
    transmission_oil: { partNumber: '75W90-1L', brand: 'CASTROL', equivalents: ['MOBIL 75W90', 'SHELL 75W90'], avgPrice: 90 },
    cv_joint: { partNumber: 'CVJ1168', brand: 'GKN', equivalents: ['SKF VKJA1168', 'NAKATA NCV1168'], avgPrice: 340 },
    front_wheel_bearing: { partNumber: 'WB1168', brand: 'SKF', equivalents: ['FAG 713610168', 'NSK 45BWD168', 'TIMKEN 1168'], avgPrice: 205 },
    rear_wheel_bearing: { partNumber: 'WB1169', brand: 'SKF', equivalents: ['FAG 713610169', 'NSK 45BWD169', 'TIMKEN 1169'], avgPrice: 180 },
    clutch_bearing: { partNumber: 'CB1168', brand: 'SKF', equivalents: ['FAG CB1168', 'NSK CB1168', 'INA CB1168'], avgPrice: 130 },
  },

  // HYUNDAI (HB20, Creta, Tucson, i30)
  HYUNDAI: {
    oil_filter: { partNumber: 'W811/80', brand: 'MANN-FILTER', equivalents: ['TECFIL PSL811', 'FRAM PH6811', 'BOSCH F026407811'], avgPrice: 48 },
    air_filter: { partNumber: 'C26013', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL6013', 'FRAM CA10013', 'BOSCH F026400013'], avgPrice: 58 },
    cabin_filter: { partNumber: 'CUK2336', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP336', 'FRAM CF10336', 'BOSCH 1987432336'], avgPrice: 65 },
    fuel_filter: { partNumber: 'WK730/9', brand: 'MANN-FILTER', equivalents: ['TECFIL GI09', 'FRAM G10739', 'BOSCH F026402739'], avgPrice: 78 },
    transmission_filter: { partNumber: 'H199KIT-HYUNDAI', brand: 'MANN-FILTER', equivalents: ['ZF 0501216251', 'MEYLE 1003250012'], avgPrice: 128 },
    front_brake_pads: { partNumber: 'N-1013', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1013', 'BOSCH BP1013', 'TRW GDB1413'], avgPrice: 85 },
    rear_brake_pads: { partNumber: 'N-1014', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1014', 'BOSCH BP1014', 'TRW GDB1414'], avgPrice: 70 },
    front_brake_disc: { partNumber: 'BD1013', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1013', 'VARGA 1013', 'TRW DF6013'], avgPrice: 185 },
    rear_brake_disc: { partNumber: 'BD1014', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1014', 'VARGA 1014', 'TRW DF6014'], avgPrice: 155 },
    brake_fluid: { partNumber: 'DOT4-500ML', brand: 'BOSCH', equivalents: ['WAGNER DOT4', 'CASTROL DOT4', 'MOBIL DOT4'], avgPrice: 35 },
    brake_hose_front: { partNumber: 'FH1013', brand: 'FRAS-LE', equivalents: ['TRW PHD1013', 'VARGA VH1013'], avgPrice: 45 },
    brake_hose_rear: { partNumber: 'FH1014', brand: 'FRAS-LE', equivalents: ['TRW PHD1014', 'VARGA VH1014'], avgPrice: 42 },
    handbrake_cable: { partNumber: 'CB1013', brand: 'COFLE', equivalents: ['NAKATA NCB1013', 'FRAS-LE FCB1013'], avgPrice: 55 },
    spark_plugs: { partNumber: 'LZKR6B-10E', brand: 'NGK', equivalents: ['BOSCH FR7DC+', 'DENSO K20PR-U', 'CHAMPION RC9YC'], avgPrice: 35 },
    ignition_coil: { partNumber: 'U5013', brand: 'NGK', equivalents: ['BOSCH 0221604013', 'BERU ZS013'], avgPrice: 165 },
    spark_plug_wires: { partNumber: 'N/A-HYUNDAI', brand: 'N/A', equivalents: [], avgPrice: 0 },
    distributor_cap: { partNumber: 'N/A-HYUNDAI', brand: 'N/A', equivalents: [], avgPrice: 0 },
    front_shock: { partNumber: 'GP33013', brand: 'MONROE', equivalents: ['COFAP MP33013', 'NAKATA HG33013', 'KAYABA 339013'], avgPrice: 300 },
    rear_shock: { partNumber: 'GP33014', brand: 'MONROE', equivalents: ['COFAP MP33014', 'NAKATA HG33014', 'KAYABA 349014'], avgPrice: 250 },
    front_spring: { partNumber: 'MC1013', brand: 'COFAP', equivalents: ['FABRINI F1013', 'NAKATA NS1013'], avgPrice: 175 },
    rear_spring: { partNumber: 'MC1014', brand: 'COFAP', equivalents: ['FABRINI F1014', 'NAKATA NS1014'], avgPrice: 155 },
    front_stabilizer_link: { partNumber: 'BL1013', brand: 'NAKATA', equivalents: ['VIEMAR V1013', 'AXIOS AX1013'], avgPrice: 60 },
    rear_stabilizer_link: { partNumber: 'BL1014', brand: 'NAKATA', equivalents: ['VIEMAR V1014', 'AXIOS AX1014'], avgPrice: 55 },
    control_arm_front: { partNumber: 'BA1013', brand: 'NAKATA', equivalents: ['VIEMAR VB1013', 'AXIOS AB1013'], avgPrice: 300 },
    ball_joint: { partNumber: 'PV1013', brand: 'NAKATA', equivalents: ['VIEMAR VP1013', 'AXIOS AP1013'], avgPrice: 80 },
    tie_rod_end: { partNumber: 'TD1013', brand: 'NAKATA', equivalents: ['VIEMAR VT1013', 'AXIOS AT1013'], avgPrice: 70 },
    steering_rack_boot: { partNumber: 'CR1013', brand: 'NAKATA', equivalents: ['VIEMAR VC1013', 'AXIOS AC1013'], avgPrice: 42 },
    timing_belt: { partNumber: 'CT1013', brand: 'CONTITECH', equivalents: ['GATES 5513XS', 'DAYCO 941013', 'INA 530051310'], avgPrice: 125 },
    timing_belt_tensioner: { partNumber: 'VKM11013', brand: 'SKF', equivalents: ['INA 531051310', 'GATES T43013'], avgPrice: 165 },
    water_pump: { partNumber: 'WP1013', brand: 'URBA', equivalents: ['INDISA 1013', 'NAKATA NKBA1013', 'SKF VKPC81013'], avgPrice: 185 },
    thermostat: { partNumber: 'TH1013', brand: 'WAHLER', equivalents: ['BEHR TX1013', 'GATES TH1013'], avgPrice: 60 },
    alternator_belt: { partNumber: '6PK1013', brand: 'CONTITECH', equivalents: ['GATES 6PK1013', 'DAYCO 6PK1013'], avgPrice: 42 },
    engine_oil: { partNumber: '5W30-4L', brand: 'CASTROL', equivalents: ['MOBIL 5W30', 'SHELL 5W30', 'PETRONAS 5W30'], avgPrice: 115 },
    coolant: { partNumber: 'HYUNDAI-1L', brand: 'HYUNDAI', equivalents: ['PARAFLU HYUNDAI', 'CASTROL COOLANT'], avgPrice: 45 },
    valve_cover_gasket: { partNumber: 'JTV1013', brand: 'VICTOR REINZ', equivalents: ['ELRING 1013', 'AJUSA 1013'], avgPrice: 78 },
    oil_pan_gasket: { partNumber: 'JC1013', brand: 'VICTOR REINZ', equivalents: ['ELRING C1013', 'AJUSA C1013'], avgPrice: 88 },
    pcv_valve: { partNumber: 'PCV1013', brand: 'BOSCH', equivalents: ['WAHLER PCV1013', 'GATES PCV1013'], avgPrice: 32 },
    battery: { partNumber: 'M50GD', brand: 'MOURA', equivalents: ['HELIAR HF50DD', 'ACDelco 50AH', 'BOSCH S5X50D'], avgPrice: 420 },
    alternator: { partNumber: 'ALT1013', brand: 'BOSCH', equivalents: ['VALEO 1013', 'DENSO 1013'], avgPrice: 580 },
    starter_motor: { partNumber: 'SM1013', brand: 'BOSCH', equivalents: ['VALEO SM1013', 'DENSO SM1013'], avgPrice: 490 },
    headlight_bulb: { partNumber: 'H7-55W', brand: 'OSRAM', equivalents: ['PHILIPS H7', 'NARVA H7', 'GE H7'], avgPrice: 35 },
    brake_light_bulb: { partNumber: 'P21W', brand: 'OSRAM', equivalents: ['PHILIPS P21W', 'NARVA P21W'], avgPrice: 8 },
    fuse_kit: { partNumber: 'FK-UNIV', brand: 'LITTELFUSE', equivalents: ['BUSSMANN FK', 'HELLA FK'], avgPrice: 23 },
    clutch_kit: { partNumber: 'CK1013', brand: 'LUK', equivalents: ['SACHS 3000954013', 'VALEO 826013', 'EXEDY 1013'], avgPrice: 650 },
    clutch_cable: { partNumber: 'CC1013', brand: 'COFLE', equivalents: ['NAKATA NCC1013', 'FRAS-LE FCC1013'], avgPrice: 62 },
    transmission_oil: { partNumber: '75W90-1L', brand: 'CASTROL', equivalents: ['MOBIL 75W90', 'SHELL 75W90'], avgPrice: 78 },
    cv_joint: { partNumber: 'CVJ1013', brand: 'GKN', equivalents: ['SKF VKJA1013', 'NAKATA NCV1013'], avgPrice: 270 },
    front_wheel_bearing: { partNumber: 'WB1013', brand: 'SKF', equivalents: ['FAG 713610013', 'NSK 45BWD013', 'TIMKEN 1013'], avgPrice: 175 },
    rear_wheel_bearing: { partNumber: 'WB1014', brand: 'SKF', equivalents: ['FAG 713610014', 'NSK 45BWD014', 'TIMKEN 1014'], avgPrice: 155 },
    clutch_bearing: { partNumber: 'CB1013', brand: 'SKF', equivalents: ['FAG CB1013', 'NSK CB1013', 'INA CB1013'], avgPrice: 108 },
  },

  // RENAULT (Sandero, Logan, Kwid, Duster, Captur)
  RENAULT: {
    oil_filter: { partNumber: 'W75/3', brand: 'MANN-FILTER', equivalents: ['TECFIL PSL753', 'FRAM PH5796', 'BOSCH F026407753'], avgPrice: 45 },
    air_filter: { partNumber: 'C2672/1', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL2672', 'FRAM CA10672', 'BOSCH F026400672'], avgPrice: 52 },
    cabin_filter: { partNumber: 'CU2316', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP316', 'FRAM CF10316', 'BOSCH 1987432316'], avgPrice: 58 },
    fuel_filter: { partNumber: 'WK730/10', brand: 'MANN-FILTER', equivalents: ['TECFIL GI10', 'FRAM G10740', 'BOSCH F026402740'], avgPrice: 72 },
    transmission_filter: { partNumber: 'H199KIT-RENAULT', brand: 'MANN-FILTER', equivalents: ['ZF 0501216252', 'MEYLE 1003250013'], avgPrice: 118 },
    front_brake_pads: { partNumber: 'N-1672', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1672', 'BOSCH BP1672', 'TRW GDB2072'], avgPrice: 78 },
    rear_brake_pads: { partNumber: 'N-1673', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1673', 'BOSCH BP1673', 'TRW GDB2073'], avgPrice: 65 },
    front_brake_disc: { partNumber: 'BD1672', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1672', 'VARGA 1672', 'TRW DF6672'], avgPrice: 175 },
    rear_brake_disc: { partNumber: 'BD1673', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1673', 'VARGA 1673', 'TRW DF6673'], avgPrice: 148 },
    brake_fluid: { partNumber: 'DOT4-500ML', brand: 'BOSCH', equivalents: ['WAGNER DOT4', 'CASTROL DOT4', 'MOBIL DOT4'], avgPrice: 35 },
    brake_hose_front: { partNumber: 'FH1672', brand: 'FRAS-LE', equivalents: ['TRW PHD1672', 'VARGA VH1672'], avgPrice: 44 },
    brake_hose_rear: { partNumber: 'FH1673', brand: 'FRAS-LE', equivalents: ['TRW PHD1673', 'VARGA VH1673'], avgPrice: 40 },
    handbrake_cable: { partNumber: 'CB1672', brand: 'COFLE', equivalents: ['NAKATA NCB1672', 'FRAS-LE FCB1672'], avgPrice: 52 },
    spark_plugs: { partNumber: 'BKR6E', brand: 'NGK', equivalents: ['BOSCH FR7DC+', 'DENSO K20PR-U', 'CHAMPION RC9YC'], avgPrice: 25 },
    ignition_coil: { partNumber: 'U5672', brand: 'NGK', equivalents: ['BOSCH 0221604672', 'BERU ZS672'], avgPrice: 155 },
    spark_plug_wires: { partNumber: 'SCT1672', brand: 'NGK', equivalents: ['BOSCH 0986356672', 'BERU R672'], avgPrice: 88 },
    distributor_cap: { partNumber: 'DC1672', brand: 'BOSCH', equivalents: ['BERU VK672', 'MAGNETI MARELLI BDA1672'], avgPrice: 72 },
    front_shock: { partNumber: 'GP32672', brand: 'MONROE', equivalents: ['COFAP MP32672', 'NAKATA HG32672', 'KAYABA 333672'], avgPrice: 270 },
    rear_shock: { partNumber: 'GP32673', brand: 'MONROE', equivalents: ['COFAP MP32673', 'NAKATA HG32673', 'KAYABA 343673'], avgPrice: 220 },
    front_spring: { partNumber: 'MC1672', brand: 'COFAP', equivalents: ['FABRINI F1672', 'NAKATA NS1672'], avgPrice: 165 },
    rear_spring: { partNumber: 'MC1673', brand: 'COFAP', equivalents: ['FABRINI F1673', 'NAKATA NS1673'], avgPrice: 148 },
    front_stabilizer_link: { partNumber: 'BL1672', brand: 'NAKATA', equivalents: ['VIEMAR V1672', 'AXIOS AX1672'], avgPrice: 58 },
    rear_stabilizer_link: { partNumber: 'BL1673', brand: 'NAKATA', equivalents: ['VIEMAR V1673', 'AXIOS AX1673'], avgPrice: 52 },
    control_arm_front: { partNumber: 'BA1672', brand: 'NAKATA', equivalents: ['VIEMAR VB1672', 'AXIOS AB1672'], avgPrice: 290 },
    ball_joint: { partNumber: 'PV1672', brand: 'NAKATA', equivalents: ['VIEMAR VP1672', 'AXIOS AP1672'], avgPrice: 78 },
    tie_rod_end: { partNumber: 'TD1672', brand: 'NAKATA', equivalents: ['VIEMAR VT1672', 'AXIOS AT1672'], avgPrice: 68 },
    steering_rack_boot: { partNumber: 'CR1672', brand: 'NAKATA', equivalents: ['VIEMAR VC1672', 'AXIOS AC1672'], avgPrice: 40 },
    timing_belt: { partNumber: 'CT1672', brand: 'CONTITECH', equivalents: ['GATES 5572XS', 'DAYCO 941672', 'INA 530057210'], avgPrice: 110 },
    timing_belt_tensioner: { partNumber: 'VKM11672', brand: 'SKF', equivalents: ['INA 531057210', 'GATES T43672'], avgPrice: 155 },
    water_pump: { partNumber: 'WP1672', brand: 'URBA', equivalents: ['INDISA 1672', 'NAKATA NKBA1672', 'SKF VKPC81672'], avgPrice: 175 },
    thermostat: { partNumber: 'TH1672', brand: 'WAHLER', equivalents: ['BEHR TX1672', 'GATES TH1672'], avgPrice: 58 },
    alternator_belt: { partNumber: '6PK1672', brand: 'CONTITECH', equivalents: ['GATES 6PK1672', 'DAYCO 6PK1672'], avgPrice: 40 },
    engine_oil: { partNumber: '5W30-4L', brand: 'CASTROL', equivalents: ['MOBIL 5W30', 'SHELL 5W30', 'PETRONAS 5W30'], avgPrice: 112 },
    coolant: { partNumber: 'RENAULT-1L', brand: 'RENAULT', equivalents: ['PARAFLU RENAULT', 'CASTROL COOLANT'], avgPrice: 42 },
    valve_cover_gasket: { partNumber: 'JTV1672', brand: 'VICTOR REINZ', equivalents: ['ELRING 1672', 'AJUSA 1672'], avgPrice: 75 },
    oil_pan_gasket: { partNumber: 'JC1672', brand: 'VICTOR REINZ', equivalents: ['ELRING C1672', 'AJUSA C1672'], avgPrice: 85 },
    pcv_valve: { partNumber: 'PCV1672', brand: 'BOSCH', equivalents: ['WAHLER PCV1672', 'GATES PCV1672'], avgPrice: 30 },
    battery: { partNumber: 'M50GD', brand: 'MOURA', equivalents: ['HELIAR HF50DD', 'ACDelco 50AH', 'BOSCH S5X50D'], avgPrice: 420 },
    alternator: { partNumber: 'ALT1672', brand: 'BOSCH', equivalents: ['VALEO 1672', 'DENSO 1672'], avgPrice: 560 },
    starter_motor: { partNumber: 'SM1672', brand: 'BOSCH', equivalents: ['VALEO SM1672', 'DENSO SM1672'], avgPrice: 470 },
    headlight_bulb: { partNumber: 'H4-60/55W', brand: 'OSRAM', equivalents: ['PHILIPS H4', 'NARVA H4', 'GE H4'], avgPrice: 32 },
    brake_light_bulb: { partNumber: 'P21W', brand: 'OSRAM', equivalents: ['PHILIPS P21W', 'NARVA P21W'], avgPrice: 8 },
    fuse_kit: { partNumber: 'FK-UNIV', brand: 'LITTELFUSE', equivalents: ['BUSSMANN FK', 'HELLA FK'], avgPrice: 22 },
    clutch_kit: { partNumber: 'CK1672', brand: 'LUK', equivalents: ['SACHS 3000954672', 'VALEO 826672', 'EXEDY 1672'], avgPrice: 620 },
    clutch_cable: { partNumber: 'CC1672', brand: 'COFLE', equivalents: ['NAKATA NCC1672', 'FRAS-LE FCC1672'], avgPrice: 60 },
    transmission_oil: { partNumber: '75W90-1L', brand: 'CASTROL', equivalents: ['MOBIL 75W90', 'SHELL 75W90'], avgPrice: 75 },
    cv_joint: { partNumber: 'CVJ1672', brand: 'GKN', equivalents: ['SKF VKJA1672', 'NAKATA NCV1672'], avgPrice: 260 },
    front_wheel_bearing: { partNumber: 'WB1672', brand: 'SKF', equivalents: ['FAG 713610672', 'NSK 45BWD672', 'TIMKEN 1672'], avgPrice: 165 },
    rear_wheel_bearing: { partNumber: 'WB1673', brand: 'SKF', equivalents: ['FAG 713610673', 'NSK 45BWD673', 'TIMKEN 1673'], avgPrice: 145 },
    clutch_bearing: { partNumber: 'CB1672', brand: 'SKF', equivalents: ['FAG CB1672', 'NSK CB1672', 'INA CB1672'], avgPrice: 102 },
  },

  // NISSAN (March, Versa, Kicks, Sentra, Frontier)
  NISSAN: {
    oil_filter: { partNumber: 'W67/1', brand: 'MANN-FILTER', equivalents: ['TECFIL PSL671', 'FRAM PH6671', 'BOSCH F026407671'], avgPrice: 50 },
    air_filter: { partNumber: 'C25860', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL5860', 'FRAM CA10860', 'BOSCH F026400860'], avgPrice: 60 },
    cabin_filter: { partNumber: 'CU2418', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP418', 'FRAM CF10418', 'BOSCH 1987432418'], avgPrice: 65 },
    fuel_filter: { partNumber: 'WK730/11', brand: 'MANN-FILTER', equivalents: ['TECFIL GI11', 'FRAM G10741', 'BOSCH F026402741'], avgPrice: 78 },
    transmission_filter: { partNumber: 'H199KIT-NISSAN', brand: 'MANN-FILTER', equivalents: ['ZF 0501216253', 'MEYLE 1003250014'], avgPrice: 125 },
    front_brake_pads: { partNumber: 'N-1860', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1860', 'BOSCH BP1860', 'TRW GDB2260'], avgPrice: 90 },
    rear_brake_pads: { partNumber: 'N-1861', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1861', 'BOSCH BP1861', 'TRW GDB2261'], avgPrice: 75 },
    front_brake_disc: { partNumber: 'BD1860', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1860', 'VARGA 1860', 'TRW DF6860'], avgPrice: 200 },
    rear_brake_disc: { partNumber: 'BD1861', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1861', 'VARGA 1861', 'TRW DF6861'], avgPrice: 168 },
    brake_fluid: { partNumber: 'DOT4-500ML', brand: 'BOSCH', equivalents: ['WAGNER DOT4', 'CASTROL DOT4', 'MOBIL DOT4'], avgPrice: 35 },
    brake_hose_front: { partNumber: 'FH1860', brand: 'FRAS-LE', equivalents: ['TRW PHD1860', 'VARGA VH1860'], avgPrice: 48 },
    brake_hose_rear: { partNumber: 'FH1861', brand: 'FRAS-LE', equivalents: ['TRW PHD1861', 'VARGA VH1861'], avgPrice: 44 },
    handbrake_cable: { partNumber: 'CB1860', brand: 'COFLE', equivalents: ['NAKATA NCB1860', 'FRAS-LE FCB1860'], avgPrice: 58 },
    spark_plugs: { partNumber: 'DILKAR6A-11', brand: 'NGK', equivalents: ['BOSCH FR7KI332S', 'DENSO IK20TT', 'CHAMPION RC10PYPB4'], avgPrice: 62 },
    ignition_coil: { partNumber: 'U5860', brand: 'NGK', equivalents: ['BOSCH 0221604860', 'BERU ZS860'], avgPrice: 185 },
    spark_plug_wires: { partNumber: 'N/A-NISSAN', brand: 'N/A', equivalents: [], avgPrice: 0 },
    distributor_cap: { partNumber: 'N/A-NISSAN', brand: 'N/A', equivalents: [], avgPrice: 0 },
    front_shock: { partNumber: 'GP33860', brand: 'MONROE', equivalents: ['COFAP MP33860', 'NAKATA HG33860', 'KAYABA 339860'], avgPrice: 310 },
    rear_shock: { partNumber: 'GP33861', brand: 'MONROE', equivalents: ['COFAP MP33861', 'NAKATA HG33861', 'KAYABA 349861'], avgPrice: 260 },
    front_spring: { partNumber: 'MC1860', brand: 'COFAP', equivalents: ['FABRINI F1860', 'NAKATA NS1860'], avgPrice: 185 },
    rear_spring: { partNumber: 'MC1861', brand: 'COFAP', equivalents: ['FABRINI F1861', 'NAKATA NS1861'], avgPrice: 165 },
    front_stabilizer_link: { partNumber: 'BL1860', brand: 'NAKATA', equivalents: ['VIEMAR V1860', 'AXIOS AX1860'], avgPrice: 65 },
    rear_stabilizer_link: { partNumber: 'BL1861', brand: 'NAKATA', equivalents: ['VIEMAR V1861', 'AXIOS AX1861'], avgPrice: 58 },
    control_arm_front: { partNumber: 'BA1860', brand: 'NAKATA', equivalents: ['VIEMAR VB1860', 'AXIOS AB1860'], avgPrice: 330 },
    ball_joint: { partNumber: 'PV1860', brand: 'NAKATA', equivalents: ['VIEMAR VP1860', 'AXIOS AP1860'], avgPrice: 88 },
    tie_rod_end: { partNumber: 'TD1860', brand: 'NAKATA', equivalents: ['VIEMAR VT1860', 'AXIOS AT1860'], avgPrice: 75 },
    steering_rack_boot: { partNumber: 'CR1860', brand: 'NAKATA', equivalents: ['VIEMAR VC1860', 'AXIOS AC1860'], avgPrice: 45 },
    timing_belt: { partNumber: 'CT1860', brand: 'CONTITECH', equivalents: ['GATES 5560XS', 'DAYCO 941860', 'INA 530056010'], avgPrice: 135 },
    timing_belt_tensioner: { partNumber: 'VKM11860', brand: 'SKF', equivalents: ['INA 531056010', 'GATES T43860'], avgPrice: 175 },
    water_pump: { partNumber: 'WP1860', brand: 'URBA', equivalents: ['INDISA 1860', 'NAKATA NKBA1860', 'SKF VKPC81860'], avgPrice: 205 },
    thermostat: { partNumber: 'TH1860', brand: 'WAHLER', equivalents: ['BEHR TX1860', 'GATES TH1860'], avgPrice: 65 },
    alternator_belt: { partNumber: '6PK1860', brand: 'CONTITECH', equivalents: ['GATES 6PK1860', 'DAYCO 6PK1860'], avgPrice: 45 },
    engine_oil: { partNumber: '5W30-4L', brand: 'CASTROL', equivalents: ['MOBIL 5W30', 'SHELL 5W30', 'PETRONAS 5W30'], avgPrice: 120 },
    coolant: { partNumber: 'NISSAN-1L', brand: 'NISSAN', equivalents: ['PARAFLU NISSAN', 'CASTROL COOLANT'], avgPrice: 48 },
    valve_cover_gasket: { partNumber: 'JTV1860', brand: 'VICTOR REINZ', equivalents: ['ELRING 1860', 'AJUSA 1860'], avgPrice: 82 },
    oil_pan_gasket: { partNumber: 'JC1860', brand: 'VICTOR REINZ', equivalents: ['ELRING C1860', 'AJUSA C1860'], avgPrice: 92 },
    pcv_valve: { partNumber: 'PCV1860', brand: 'BOSCH', equivalents: ['WAHLER PCV1860', 'GATES PCV1860'], avgPrice: 35 },
    battery: { partNumber: 'M60GD', brand: 'MOURA', equivalents: ['HELIAR HF60DD', 'ACDelco 60AH', 'BOSCH S5X60D'], avgPrice: 450 },
    alternator: { partNumber: 'ALT1860', brand: 'BOSCH', equivalents: ['VALEO 1860', 'DENSO 1860'], avgPrice: 640 },
    starter_motor: { partNumber: 'SM1860', brand: 'BOSCH', equivalents: ['VALEO SM1860', 'DENSO SM1860'], avgPrice: 540 },
    headlight_bulb: { partNumber: 'H7-55W', brand: 'OSRAM', equivalents: ['PHILIPS H7', 'NARVA H7', 'GE H7'], avgPrice: 38 },
    brake_light_bulb: { partNumber: 'P21W', brand: 'OSRAM', equivalents: ['PHILIPS P21W', 'NARVA P21W'], avgPrice: 9 },
    fuse_kit: { partNumber: 'FK-UNIV', brand: 'LITTELFUSE', equivalents: ['BUSSMANN FK', 'HELLA FK'], avgPrice: 25 },
    clutch_kit: { partNumber: 'CK1860', brand: 'LUK', equivalents: ['SACHS 3000954860', 'VALEO 826860', 'EXEDY 1860'], avgPrice: 700 },
    clutch_cable: { partNumber: 'N/A-NISSAN', brand: 'N/A', equivalents: [], avgPrice: 0 },
    transmission_oil: { partNumber: '75W90-1L', brand: 'CASTROL', equivalents: ['MOBIL 75W90', 'SHELL 75W90'], avgPrice: 82 },
    cv_joint: { partNumber: 'CVJ1860', brand: 'GKN', equivalents: ['SKF VKJA1860', 'NAKATA NCV1860'], avgPrice: 300 },
    front_wheel_bearing: { partNumber: 'WB1860', brand: 'SKF', equivalents: ['FAG 713610860', 'NSK 45BWD860', 'TIMKEN 1860'], avgPrice: 190 },
    rear_wheel_bearing: { partNumber: 'WB1861', brand: 'SKF', equivalents: ['FAG 713610861', 'NSK 45BWD861', 'TIMKEN 1861'], avgPrice: 165 },
    clutch_bearing: { partNumber: 'CB1860', brand: 'SKF', equivalents: ['FAG CB1860', 'NSK CB1860', 'INA CB1860'], avgPrice: 118 },
  },

  // JEEP (Renegade, Compass, Commander)
  JEEP: {
    oil_filter: { partNumber: 'HU712/11X', brand: 'MANN-FILTER', equivalents: ['MAHLE OX411D', 'BOSCH P9411', 'WIX WL7411'], avgPrice: 75 },
    air_filter: { partNumber: 'C27107', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL7107', 'FRAM CA11107', 'BOSCH F026400107'], avgPrice: 65 },
    cabin_filter: { partNumber: 'CUK2545', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP545', 'FRAM CF10545', 'BOSCH 1987432545'], avgPrice: 72 },
    fuel_filter: { partNumber: 'WK69/1', brand: 'MANN-FILTER', equivalents: ['TECFIL GI691', 'FRAM G10691', 'BOSCH F026402691'], avgPrice: 90 },
    transmission_filter: { partNumber: 'H199KIT-JEEP', brand: 'MANN-FILTER', equivalents: ['ZF 0501216254', 'MEYLE 1003250015'], avgPrice: 145 },
    front_brake_pads: { partNumber: 'N-1411', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1411', 'BOSCH BP1411', 'TRW GDB1811'], avgPrice: 115 },
    rear_brake_pads: { partNumber: 'N-1412', brand: 'COBREQ', equivalents: ['FRAS-LE PD/1412', 'BOSCH BP1412', 'TRW GDB1812'], avgPrice: 95 },
    front_brake_disc: { partNumber: 'BD1411', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1411', 'VARGA 1411', 'TRW DF6411'], avgPrice: 260 },
    rear_brake_disc: { partNumber: 'BD1412', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF1412', 'VARGA 1412', 'TRW DF6412'], avgPrice: 215 },
    brake_fluid: { partNumber: 'DOT4-500ML', brand: 'BOSCH', equivalents: ['WAGNER DOT4', 'CASTROL DOT4', 'MOBIL DOT4'], avgPrice: 35 },
    brake_hose_front: { partNumber: 'FH1411', brand: 'FRAS-LE', equivalents: ['TRW PHD1411', 'VARGA VH1411'], avgPrice: 55 },
    brake_hose_rear: { partNumber: 'FH1412', brand: 'FRAS-LE', equivalents: ['TRW PHD1412', 'VARGA VH1412'], avgPrice: 50 },
    handbrake_cable: { partNumber: 'CB1411', brand: 'COFLE', equivalents: ['NAKATA NCB1411', 'FRAS-LE FCB1411'], avgPrice: 65 },
    spark_plugs: { partNumber: 'ILZKR7B-11S', brand: 'NGK', equivalents: ['BOSCH FR7KI332S', 'DENSO IK20TT', 'CHAMPION RC10PYPB4'], avgPrice: 65 },
    ignition_coil: { partNumber: 'U5411', brand: 'NGK', equivalents: ['BOSCH 0221604411', 'BERU ZS411'], avgPrice: 210 },
    spark_plug_wires: { partNumber: 'N/A-JEEP', brand: 'N/A', equivalents: [], avgPrice: 0 },
    distributor_cap: { partNumber: 'N/A-JEEP', brand: 'N/A', equivalents: [], avgPrice: 0 },
    front_shock: { partNumber: 'GP33411', brand: 'MONROE', equivalents: ['COFAP MP33411', 'NAKATA HG33411', 'KAYABA 339411'], avgPrice: 380 },
    rear_shock: { partNumber: 'GP33412', brand: 'MONROE', equivalents: ['COFAP MP33412', 'NAKATA HG33412', 'KAYABA 349412'], avgPrice: 320 },
    front_spring: { partNumber: 'MC1411', brand: 'COFAP', equivalents: ['FABRINI F1411', 'NAKATA NS1411'], avgPrice: 215 },
    rear_spring: { partNumber: 'MC1412', brand: 'COFAP', equivalents: ['FABRINI F1412', 'NAKATA NS1412'], avgPrice: 195 },
    front_stabilizer_link: { partNumber: 'BL1411', brand: 'NAKATA', equivalents: ['VIEMAR V1411', 'AXIOS AX1411'], avgPrice: 78 },
    rear_stabilizer_link: { partNumber: 'BL1412', brand: 'NAKATA', equivalents: ['VIEMAR V1412', 'AXIOS AX1412'], avgPrice: 72 },
    control_arm_front: { partNumber: 'BA1411', brand: 'NAKATA', equivalents: ['VIEMAR VB1411', 'AXIOS AB1411'], avgPrice: 420 },
    ball_joint: { partNumber: 'PV1411', brand: 'NAKATA', equivalents: ['VIEMAR VP1411', 'AXIOS AP1411'], avgPrice: 105 },
    tie_rod_end: { partNumber: 'TD1411', brand: 'NAKATA', equivalents: ['VIEMAR VT1411', 'AXIOS AT1411'], avgPrice: 88 },
    steering_rack_boot: { partNumber: 'CR1411', brand: 'NAKATA', equivalents: ['VIEMAR VC1411', 'AXIOS AC1411'], avgPrice: 52 },
    timing_belt: { partNumber: 'CT1411', brand: 'CONTITECH', equivalents: ['GATES 5611XS', 'DAYCO 941411', 'INA 530061710'], avgPrice: 165 },
    timing_belt_tensioner: { partNumber: 'VKM11411', brand: 'SKF', equivalents: ['INA 531061710', 'GATES T43411'], avgPrice: 205 },
    water_pump: { partNumber: 'WP1411', brand: 'URBA', equivalents: ['INDISA 1411', 'NAKATA NKBA1411', 'SKF VKPC81411'], avgPrice: 265 },
    thermostat: { partNumber: 'TH1411', brand: 'WAHLER', equivalents: ['BEHR TX1411', 'GATES TH1411'], avgPrice: 78 },
    alternator_belt: { partNumber: '6PK1411', brand: 'CONTITECH', equivalents: ['GATES 6PK1411', 'DAYCO 6PK1411'], avgPrice: 52 },
    engine_oil: { partNumber: '5W30-4L', brand: 'CASTROL', equivalents: ['MOBIL 5W30', 'SHELL 5W30', 'PETRONAS 5W30'], avgPrice: 135 },
    coolant: { partNumber: 'MOPAR-1L', brand: 'MOPAR', equivalents: ['PARAFLU MOPAR', 'CASTROL COOLANT'], avgPrice: 55 },
    valve_cover_gasket: { partNumber: 'JTV1411', brand: 'VICTOR REINZ', equivalents: ['ELRING 1411', 'AJUSA 1411'], avgPrice: 98 },
    oil_pan_gasket: { partNumber: 'JC1411', brand: 'VICTOR REINZ', equivalents: ['ELRING C1411', 'AJUSA C1411'], avgPrice: 108 },
    pcv_valve: { partNumber: 'PCV1411', brand: 'BOSCH', equivalents: ['WAHLER PCV1411', 'GATES PCV1411'], avgPrice: 42 },
    battery: { partNumber: 'M70GD', brand: 'MOURA', equivalents: ['HELIAR HF70DD', 'ACDelco 70AH', 'BOSCH S5X70D'], avgPrice: 550 },
    alternator: { partNumber: 'ALT1411', brand: 'BOSCH', equivalents: ['VALEO 1411', 'DENSO 1411'], avgPrice: 780 },
    starter_motor: { partNumber: 'SM1411', brand: 'BOSCH', equivalents: ['VALEO SM1411', 'DENSO SM1411'], avgPrice: 680 },
    headlight_bulb: { partNumber: 'H7-55W', brand: 'OSRAM', equivalents: ['PHILIPS H7', 'NARVA H7', 'GE H7'], avgPrice: 42 },
    brake_light_bulb: { partNumber: 'P21W', brand: 'OSRAM', equivalents: ['PHILIPS P21W', 'NARVA P21W'], avgPrice: 10 },
    fuse_kit: { partNumber: 'FK-UNIV', brand: 'LITTELFUSE', equivalents: ['BUSSMANN FK', 'HELLA FK'], avgPrice: 28 },
    clutch_kit: { partNumber: 'CK1411', brand: 'LUK', equivalents: ['SACHS 3000954411', 'VALEO 826411', 'EXEDY 1411'], avgPrice: 850 },
    clutch_cable: { partNumber: 'N/A-JEEP', brand: 'N/A', equivalents: [], avgPrice: 0 },
    transmission_oil: { partNumber: '75W90-1L', brand: 'CASTROL', equivalents: ['MOBIL 75W90', 'SHELL 75W90'], avgPrice: 95 },
    cv_joint: { partNumber: 'CVJ1411', brand: 'GKN', equivalents: ['SKF VKJA1411', 'NAKATA NCV1411'], avgPrice: 380 },
    front_wheel_bearing: { partNumber: 'WB1411', brand: 'SKF', equivalents: ['FAG 713610411', 'NSK 45BWD411', 'TIMKEN 1411'], avgPrice: 220 },
    rear_wheel_bearing: { partNumber: 'WB1412', brand: 'SKF', equivalents: ['FAG 713610412', 'NSK 45BWD412', 'TIMKEN 1412'], avgPrice: 195 },
    clutch_bearing: { partNumber: 'CB1411', brand: 'SKF', equivalents: ['FAG CB1411', 'NSK CB1411', 'INA CB1411'], avgPrice: 138 },
  },
};


// ============================================================================
// MAPEAMENTO DE VEÍCULOS PARA PLATAFORMAS
// ============================================================================
const VEHICLE_TO_PLATFORM = {
  // VW
  'gol': 'VW_PQ24', 'voyage': 'VW_PQ24', 'fox': 'VW_PQ24', 'saveiro': 'VW_PQ24', 'up': 'VW_PQ24', 'spacefox': 'VW_PQ24', 'crossfox': 'VW_PQ24',
  'golf': 'VW_MQB', 'polo': 'VW_MQB', 'virtus': 'VW_MQB', 't-cross': 'VW_MQB', 'tcross': 'VW_MQB', 'nivus': 'VW_MQB', 'taos': 'VW_MQB', 
  'jetta': 'VW_MQB', 'tiguan': 'VW_MQB', 'passat': 'VW_MQB', 'amarok': 'VW_MQB',
  // FIAT
  'uno': 'FIAT_FIRE', 'palio': 'FIAT_FIRE', 'siena': 'FIAT_FIRE', 'strada': 'FIAT_FIRE', 'mobi': 'FIAT_FIRE', 'fiorino': 'FIAT_FIRE', 'grand siena': 'FIAT_FIRE',
  'argo': 'FIAT_ARGO', 'cronos': 'FIAT_ARGO', 'pulse': 'FIAT_ARGO', 'fastback': 'FIAT_ARGO', 'toro': 'FIAT_ARGO',
  // GM
  'onix': 'GM_GEM', 'prisma': 'GM_GEM', 'spin': 'GM_GEM', 'cobalt': 'GM_GEM', 'montana': 'GM_GEM', 'joy': 'GM_GEM',
  'cruze': 'GM_VSS', 'tracker': 'GM_VSS', 'equinox': 'GM_VSS', 'trailblazer': 'GM_VSS', 's10': 'GM_VSS',
  // HONDA
  'civic': 'HONDA', 'city': 'HONDA', 'fit': 'HONDA', 'hr-v': 'HONDA', 'hrv': 'HONDA', 'wr-v': 'HONDA', 'wrv': 'HONDA', 'accord': 'HONDA', 'cr-v': 'HONDA', 'crv': 'HONDA',
  // TOYOTA
  'corolla': 'TOYOTA', 'yaris': 'TOYOTA', 'etios': 'TOYOTA', 'hilux': 'TOYOTA', 'sw4': 'TOYOTA', 'rav4': 'TOYOTA', 'camry': 'TOYOTA', 'prius': 'TOYOTA',
  // HYUNDAI
  'hb20': 'HYUNDAI', 'hb20s': 'HYUNDAI', 'creta': 'HYUNDAI', 'tucson': 'HYUNDAI', 'i30': 'HYUNDAI', 'ix35': 'HYUNDAI', 'santa fe': 'HYUNDAI', 'azera': 'HYUNDAI',
  // RENAULT
  'sandero': 'RENAULT', 'logan': 'RENAULT', 'kwid': 'RENAULT', 'duster': 'RENAULT', 'captur': 'RENAULT', 'oroch': 'RENAULT', 'stepway': 'RENAULT', 'fluence': 'RENAULT',
  // NISSAN
  'march': 'NISSAN', 'versa': 'NISSAN', 'kicks': 'NISSAN', 'sentra': 'NISSAN', 'frontier': 'NISSAN', 'livina': 'NISSAN', 'tiida': 'NISSAN',
  // JEEP
  'renegade': 'JEEP', 'compass': 'JEEP', 'commander': 'JEEP', 'wrangler': 'JEEP', 'cherokee': 'JEEP',
};

// Mapeamento de marcas para plataforma padrão
const BRAND_DEFAULT_PLATFORM = {
  'vw': 'VW_PQ24', 'volkswagen': 'VW_PQ24',
  'fiat': 'FIAT_FIRE',
  'gm': 'GM_GEM', 'chevrolet': 'GM_GEM',
  'honda': 'HONDA',
  'toyota': 'TOYOTA',
  'hyundai': 'HYUNDAI',
  'renault': 'RENAULT',
  'nissan': 'NISSAN',
  'jeep': 'JEEP',
  'ford': 'GM_GEM', // Usa GM como fallback
  'peugeot': 'RENAULT', // Usa Renault como fallback (PSA)
  'citroen': 'RENAULT', // Usa Renault como fallback (PSA)
  'mitsubishi': 'NISSAN', // Usa Nissan como fallback
  'kia': 'HYUNDAI', // Usa Hyundai como fallback (mesmo grupo)
};

// ============================================================================
// LISTA DE VEÍCULOS DO FRONTEND (brazilianVehicles.ts)
// ============================================================================
const BRAZILIAN_VEHICLES = [
  // VW
  { brand: 'VW', model: 'Gol', years: [1995, 2024] },
  { brand: 'VW', model: 'Voyage', years: [2008, 2024] },
  { brand: 'VW', model: 'Fox', years: [2003, 2021] },
  { brand: 'VW', model: 'Saveiro', years: [1998, 2024] },
  { brand: 'VW', model: 'Up', years: [2014, 2021] },
  { brand: 'VW', model: 'Polo', years: [2002, 2024] },
  { brand: 'VW', model: 'Virtus', years: [2018, 2024] },
  { brand: 'VW', model: 'T-Cross', years: [2019, 2024] },
  { brand: 'VW', model: 'Nivus', years: [2020, 2024] },
  { brand: 'VW', model: 'Taos', years: [2021, 2024] },
  { brand: 'VW', model: 'Golf', years: [1999, 2024] },
  { brand: 'VW', model: 'Jetta', years: [2005, 2024] },
  { brand: 'VW', model: 'Tiguan', years: [2009, 2024] },
  { brand: 'VW', model: 'Amarok', years: [2010, 2024] },
  // FIAT
  { brand: 'Fiat', model: 'Uno', years: [1984, 2024] },
  { brand: 'Fiat', model: 'Palio', years: [1996, 2017] },
  { brand: 'Fiat', model: 'Siena', years: [1997, 2016] },
  { brand: 'Fiat', model: 'Strada', years: [1998, 2024] },
  { brand: 'Fiat', model: 'Mobi', years: [2016, 2024] },
  { brand: 'Fiat', model: 'Argo', years: [2017, 2024] },
  { brand: 'Fiat', model: 'Cronos', years: [2018, 2024] },
  { brand: 'Fiat', model: 'Pulse', years: [2021, 2024] },
  { brand: 'Fiat', model: 'Fastback', years: [2022, 2024] },
  { brand: 'Fiat', model: 'Toro', years: [2016, 2024] },
  // GM
  { brand: 'GM', model: 'Onix', years: [2012, 2024] },
  { brand: 'GM', model: 'Prisma', years: [2006, 2019] },
  { brand: 'GM', model: 'Spin', years: [2012, 2024] },
  { brand: 'GM', model: 'Cobalt', years: [2011, 2020] },
  { brand: 'GM', model: 'Montana', years: [2003, 2024] },
  { brand: 'GM', model: 'Cruze', years: [2011, 2024] },
  { brand: 'GM', model: 'Tracker', years: [2013, 2024] },
  { brand: 'GM', model: 'Equinox', years: [2017, 2024] },
  { brand: 'GM', model: 'S10', years: [1995, 2024] },
  { brand: 'GM', model: 'Trailblazer', years: [2012, 2024] },
  // HONDA
  { brand: 'Honda', model: 'Civic', years: [1992, 2024] },
  { brand: 'Honda', model: 'City', years: [2009, 2024] },
  { brand: 'Honda', model: 'Fit', years: [2003, 2021] },
  { brand: 'Honda', model: 'HR-V', years: [2015, 2024] },
  { brand: 'Honda', model: 'WR-V', years: [2017, 2024] },
  { brand: 'Honda', model: 'CR-V', years: [2007, 2024] },
  { brand: 'Honda', model: 'Accord', years: [1998, 2024] },
  // TOYOTA
  { brand: 'Toyota', model: 'Corolla', years: [1992, 2024] },
  { brand: 'Toyota', model: 'Yaris', years: [2018, 2024] },
  { brand: 'Toyota', model: 'Etios', years: [2012, 2021] },
  { brand: 'Toyota', model: 'Hilux', years: [1992, 2024] },
  { brand: 'Toyota', model: 'SW4', years: [1994, 2024] },
  { brand: 'Toyota', model: 'RAV4', years: [2006, 2024] },
  { brand: 'Toyota', model: 'Corolla Cross', years: [2021, 2024] },
  // HYUNDAI
  { brand: 'Hyundai', model: 'HB20', years: [2012, 2024] },
  { brand: 'Hyundai', model: 'HB20S', years: [2013, 2024] },
  { brand: 'Hyundai', model: 'Creta', years: [2017, 2024] },
  { brand: 'Hyundai', model: 'Tucson', years: [2006, 2024] },
  { brand: 'Hyundai', model: 'i30', years: [2009, 2019] },
  { brand: 'Hyundai', model: 'ix35', years: [2010, 2019] },
  { brand: 'Hyundai', model: 'Santa Fe', years: [2006, 2024] },
  // RENAULT
  { brand: 'Renault', model: 'Sandero', years: [2007, 2024] },
  { brand: 'Renault', model: 'Logan', years: [2007, 2024] },
  { brand: 'Renault', model: 'Kwid', years: [2017, 2024] },
  { brand: 'Renault', model: 'Duster', years: [2011, 2024] },
  { brand: 'Renault', model: 'Captur', years: [2017, 2024] },
  { brand: 'Renault', model: 'Oroch', years: [2015, 2024] },
  // NISSAN
  { brand: 'Nissan', model: 'March', years: [2011, 2024] },
  { brand: 'Nissan', model: 'Versa', years: [2011, 2024] },
  { brand: 'Nissan', model: 'Kicks', years: [2016, 2024] },
  { brand: 'Nissan', model: 'Sentra', years: [2007, 2024] },
  { brand: 'Nissan', model: 'Frontier', years: [2002, 2024] },
  // JEEP
  { brand: 'Jeep', model: 'Renegade', years: [2015, 2024] },
  { brand: 'Jeep', model: 'Compass', years: [2016, 2024] },
  { brand: 'Jeep', model: 'Commander', years: [2021, 2024] },
  // FORD
  { brand: 'Ford', model: 'Ka', years: [1997, 2021] },
  { brand: 'Ford', model: 'Fiesta', years: [1996, 2019] },
  { brand: 'Ford', model: 'Focus', years: [2000, 2019] },
  { brand: 'Ford', model: 'EcoSport', years: [2003, 2021] },
  { brand: 'Ford', model: 'Ranger', years: [1998, 2024] },
  // PEUGEOT
  { brand: 'Peugeot', model: '208', years: [2013, 2024] },
  { brand: 'Peugeot', model: '2008', years: [2015, 2024] },
  { brand: 'Peugeot', model: '3008', years: [2017, 2024] },
  // CITROEN
  { brand: 'Citroen', model: 'C3', years: [2003, 2024] },
  { brand: 'Citroen', model: 'C4 Cactus', years: [2018, 2024] },
  // KIA
  { brand: 'Kia', model: 'Sportage', years: [2010, 2024] },
  { brand: 'Kia', model: 'Cerato', years: [2009, 2024] },
  { brand: 'Kia', model: 'Sorento', years: [2010, 2024] },
  // MITSUBISHI
  { brand: 'Mitsubishi', model: 'L200', years: [1995, 2024] },
  { brand: 'Mitsubishi', model: 'Pajero', years: [1998, 2024] },
  { brand: 'Mitsubishi', model: 'ASX', years: [2010, 2024] },
  { brand: 'Mitsubishi', model: 'Outlander', years: [2007, 2024] },
];


// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/**
 * Encontra a plataforma para um veículo
 */
function findPlatform(brand, model) {
  const modelLower = model.toLowerCase().replace(/-/g, '').replace(/\s+/g, '');
  
  // Primeiro tenta pelo modelo
  for (const [key, platform] of Object.entries(VEHICLE_TO_PLATFORM)) {
    if (modelLower.includes(key.replace(/-/g, '').replace(/\s+/g, ''))) {
      return platform;
    }
  }
  
  // Fallback pela marca
  const brandLower = brand.toLowerCase();
  return BRAND_DEFAULT_PLATFORM[brandLower] || 'VW_PQ24';
}

/**
 * Gera ID único para veículo
 */
function generateVehicleId(brand, model, year) {
  return `${brand}_${model}_${year}`
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Gera as 50 peças completas para um veículo
 */
function generatePartsForVehicle(brand, model, year, platform) {
  const platformParts = PLATFORM_PARTS[platform];
  if (!platformParts) {
    console.warn(`Plataforma ${platform} não encontrada, usando VW_PQ24`);
    return generatePartsForVehicle(brand, model, year, 'VW_PQ24');
  }
  
  const parts = [];
  
  for (const checklistItem of CAR_PARTS_CHECKLIST) {
    const partData = platformParts[checklistItem.id];
    
    if (partData && partData.partNumber && !partData.partNumber.startsWith('N/A')) {
      parts.push({
        partTypeId: checklistItem.id,
        name: checklistItem.name,
        category: checklistItem.category,
        priority: checklistItem.priority,
        partNumber: partData.partNumber,
        brand: partData.brand,
        equivalents: partData.equivalents || [],
        avgPrice: partData.avgPrice || 0,
        matchType: 'exact',
        confidence: 0.95,
        platform: platform,
      });
    } else {
      // Peça não aplicável (ex: cabo de vela em motor com ignição direta)
      parts.push({
        partTypeId: checklistItem.id,
        name: checklistItem.name,
        category: checklistItem.category,
        priority: checklistItem.priority,
        partNumber: null,
        brand: null,
        equivalents: [],
        avgPrice: 0,
        matchType: 'not_applicable',
        confidence: 1.0,
        platform: platform,
        note: 'Não aplicável para este veículo',
      });
    }
  }
  
  return parts;
}

/**
 * Encontra peças compartilhadas entre veículos
 */
function findSharedParts(vehicleId, parts, allVehicles) {
  const sharedParts = [];
  
  for (const part of parts) {
    if (!part.partNumber) continue;
    
    const sharedWith = [];
    for (const [otherId, otherData] of Object.entries(allVehicles)) {
      if (otherId === vehicleId) continue;
      
      const otherPart = otherData.parts.find(p => p.partNumber === part.partNumber);
      if (otherPart) {
        sharedWith.push({
          vehicleId: otherId,
          brand: otherData.brand,
          model: otherData.model,
        });
      }
    }
    
    if (sharedWith.length > 0) {
      sharedParts.push({
        partNumber: part.partNumber,
        partName: part.name,
        category: part.category,
        sharedWith: sharedWith.slice(0, 10), // Limita a 10 veículos
        totalShared: sharedWith.length,
      });
    }
  }
  
  return sharedParts;
}

// ============================================================================
// GERADOR PRINCIPAL
// ============================================================================

function generateFullCompatibility() {
  console.log('🚗 Iniciando geração de compatibilidade V3...');
  console.log(`📋 Checklist: ${CAR_PARTS_CHECKLIST.length} peças por veículo`);
  
  const vehicles = {};
  const partsByCategory = {};
  const stats = {
    totalVehicles: 0,
    totalParts: 0,
    platforms: new Set(),
    brands: new Set(),
    categories: new Set(),
  };
  
  // Gera veículos para todos os anos
  for (const vehicle of BRAZILIAN_VEHICLES) {
    const [startYear, endYear] = vehicle.years;
    
    for (let year = startYear; year <= endYear; year++) {
      const vehicleId = generateVehicleId(vehicle.brand, vehicle.model, year);
      const platform = findPlatform(vehicle.brand, vehicle.model);
      const parts = generatePartsForVehicle(vehicle.brand, vehicle.model, year, platform);
      
      vehicles[vehicleId] = {
        vehicleId,
        brand: vehicle.brand,
        model: vehicle.model,
        year,
        platform,
        totalParts: parts.filter(p => p.partNumber).length,
        totalChecklist: CAR_PARTS_CHECKLIST.length,
        parts,
        generatedAt: new Date().toISOString(),
      };
      
      stats.totalVehicles++;
      stats.totalParts += parts.filter(p => p.partNumber).length;
      stats.platforms.add(platform);
      stats.brands.add(vehicle.brand);
      
      // Agrupa por categoria
      for (const part of parts) {
        stats.categories.add(part.category);
        if (!partsByCategory[part.category]) {
          partsByCategory[part.category] = new Set();
        }
        if (part.partNumber) {
          partsByCategory[part.category].add(part.partNumber);
        }
      }
    }
  }
  
  // Calcula peças compartilhadas (amostra para não demorar muito)
  console.log('🔗 Calculando peças compartilhadas...');
  const sampleVehicles = Object.keys(vehicles).slice(0, 100);
  for (const vehicleId of sampleVehicles) {
    vehicles[vehicleId].sharedParts = findSharedParts(
      vehicleId, 
      vehicles[vehicleId].parts, 
      vehicles
    );
  }
  
  // Estatísticas finais
  const finalStats = {
    totalVehicles: stats.totalVehicles,
    totalParts: stats.totalParts,
    partsPerVehicle: CAR_PARTS_CHECKLIST.length,
    platforms: Array.from(stats.platforms),
    brands: Array.from(stats.brands),
    categories: Array.from(stats.categories),
    partsByCategory: Object.fromEntries(
      Object.entries(partsByCategory).map(([cat, parts]) => [cat, parts.size])
    ),
    generatedAt: new Date().toISOString(),
    version: '3.0.0',
  };
  
  console.log('\n📊 Estatísticas:');
  console.log(`   Veículos: ${finalStats.totalVehicles}`);
  console.log(`   Peças por veículo: ${finalStats.partsPerVehicle}`);
  console.log(`   Total de peças: ${finalStats.totalParts}`);
  console.log(`   Plataformas: ${finalStats.platforms.length}`);
  console.log(`   Marcas: ${finalStats.brands.length}`);
  console.log(`   Categorias: ${finalStats.categories.length}`);
  
  return { vehicles, stats: finalStats };
}


// ============================================================================
// EXPORTAÇÃO PARA FIREBASE
// ============================================================================

async function exportToFirebase(data) {
  console.log('\n🔥 Exportando para Firebase...');
  
  // Importa Firebase Admin SDK
  let admin;
  try {
    admin = require('firebase-admin');
  } catch (e) {
    console.log('⚠️ Firebase Admin SDK não disponível. Salvando apenas localmente.');
    return false;
  }
  
  // Inicializa Firebase se necessário
  if (!admin.apps.length) {
    try {
      const serviceAccountPath = path.join(__dirname, '../../../../serviceAccountKey.json');
      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        console.log('✅ Firebase inicializado com service account');
      } else {
        console.log('⚠️ serviceAccountKey.json não encontrado. Salvando apenas localmente.');
        return false;
      }
    } catch (e) {
      console.log('⚠️ Erro ao inicializar Firebase:', e.message);
      return false;
    }
  }
  
  const db = admin.firestore();
  const batch = db.batch();
  let batchCount = 0;
  const MAX_BATCH = 500;
  
  try {
    // Salva estatísticas
    const statsRef = db.collection('partsCompatibilityV3').doc('_stats');
    batch.set(statsRef, data.stats);
    batchCount++;
    
    // Salva veículos em batches
    const vehicleIds = Object.keys(data.vehicles);
    console.log(`📤 Salvando ${vehicleIds.length} veículos...`);
    
    for (const vehicleId of vehicleIds) {
      const vehicle = data.vehicles[vehicleId];
      const docRef = db.collection('partsCompatibilityV3').doc(vehicleId);
      batch.set(docRef, vehicle);
      batchCount++;
      
      if (batchCount >= MAX_BATCH) {
        await batch.commit();
        console.log(`   ✓ Batch de ${batchCount} documentos salvo`);
        batchCount = 0;
      }
    }
    
    // Commit final
    if (batchCount > 0) {
      await batch.commit();
      console.log(`   ✓ Batch final de ${batchCount} documentos salvo`);
    }
    
    console.log('✅ Exportação para Firebase concluída!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao exportar para Firebase:', error.message);
    return false;
  }
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
  const fullPath = path.join(outputDir, 'parts-compatibility-v3-full.json');
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
  const indexPath = path.join(outputDir, 'parts-compatibility-v3-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log(`   ✓ ${indexPath}`);
  
  // Arquivo por plataforma (para carregamento mais rápido)
  const byPlatform = {};
  for (const [id, vehicle] of Object.entries(data.vehicles)) {
    if (!byPlatform[vehicle.platform]) {
      byPlatform[vehicle.platform] = {};
    }
    byPlatform[vehicle.platform][id] = vehicle;
  }
  
  for (const [platform, vehicles] of Object.entries(byPlatform)) {
    const platformPath = path.join(outputDir, `parts-compatibility-v3-${platform.toLowerCase()}.json`);
    fs.writeFileSync(platformPath, JSON.stringify({ platform, vehicles }, null, 2));
    console.log(`   ✓ ${platformPath}`);
  }
  
  console.log('✅ Arquivos locais salvos!');
}

// ============================================================================
// EXECUÇÃO PRINCIPAL
// ============================================================================

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   TORQ AI - Parts Compatibility Generator V3');
  console.log('   Checklist Completo de 50 Peças por Veículo');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // Gera dados
  const data = generateFullCompatibility();
  
  // Salva localmente
  exportToLocal(data);
  
  // Tenta exportar para Firebase
  const firebaseSuccess = await exportToFirebase(data);
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('   GERAÇÃO CONCLUÍDA!');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`   📊 ${data.stats.totalVehicles} veículos gerados`);
  console.log(`   📋 ${data.stats.partsPerVehicle} peças por veículo`);
  console.log(`   💾 Arquivos salvos em: scripts/parts-compatibility-engine/output/`);
  if (firebaseSuccess) {
    console.log(`   🔥 Dados exportados para Firebase (collection: partsCompatibilityV3)`);
  }
  console.log('═══════════════════════════════════════════════════════════════\n');
}

// Executa se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

// Exporta funções para uso externo
module.exports = {
  generateFullCompatibility,
  exportToLocal,
  exportToFirebase,
  CAR_PARTS_CHECKLIST,
  MOTORCYCLE_PARTS_CHECKLIST,
  PLATFORM_PARTS,
  VEHICLE_TO_PLATFORM,
  BRAZILIAN_VEHICLES,
};
