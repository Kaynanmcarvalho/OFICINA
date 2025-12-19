/**
 * VALIDAÇÃO E SINCRONIZAÇÃO DE VEÍCULOS
 * Compara veículos do frontend (brazilianVehicles.ts) com o backend (API de peças)
 * e adiciona automaticamente os que estiverem faltando.
 * 
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

// Cores para console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

console.log(`
${colors.cyan}═══════════════════════════════════════════════════════════════
   VALIDAÇÃO E SINCRONIZAÇÃO DE VEÍCULOS
   Verifica se TODOS os veículos do frontend têm peças no backend
═══════════════════════════════════════════════════════════════${colors.reset}
`);

// ============================================================================
// 1. CARREGAR VEÍCULOS DO FRONTEND (brazilianVehicles.ts)
// ============================================================================
function loadFrontendVehicles() {
  console.log(`${colors.blue}📖 Carregando veículos do frontend...${colors.reset}`);
  
  const tsFilePath = path.join(__dirname, '../../src/features/vehicle-parts-search/data/brazilianVehicles.ts');
  
  if (!fs.existsSync(tsFilePath)) {
    console.error(`${colors.red}❌ Arquivo não encontrado: ${tsFilePath}${colors.reset}`);
    return [];
  }
  
  const content = fs.readFileSync(tsFilePath, 'utf-8');
  const vehicles = [];
  
  // Regex para capturar chamadas generateYearVariants
  const regex = /\.\.\.generateYearVariants\(\s*\{\s*brand:\s*['"]([^'"]+)['"]\s*,\s*model:\s*['"]([^'"]+)['"](?:[^}]*vehicleType:\s*['"]([^'"]+)['"])?[^}]*\}\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    const [, brand, model, vehicleType, startYear, endYear] = match;
    const start = parseInt(startYear);
    const end = parseInt(endYear);
    
    for (let year = start; year <= end; year++) {
      vehicles.push({
        brand: brand,
        model: model,
        year: year,
        vehicleType: vehicleType || 'car',
        id: `${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}_${model.toLowerCase().replace(/[^a-z0-9]/g, '')}_${year}`,
      });
    }
  }
  
  console.log(`   ✅ ${vehicles.length} veículos encontrados no frontend`);
  return vehicles;
}

// ============================================================================
// 2. CARREGAR VEÍCULOS DO BACKEND (API de peças)
// ============================================================================
function loadBackendVehicles() {
  console.log(`${colors.blue}📖 Carregando veículos do backend...${colors.reset}`);
  
  const jsonPath = path.join(__dirname, 'output/parts-compatibility-v4-full.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`${colors.red}❌ Arquivo não encontrado: ${jsonPath}${colors.reset}`);
    return {};
  }
  
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const vehicles = data.vehicles || {};
  
  console.log(`   ✅ ${Object.keys(vehicles).length} veículos encontrados no backend`);
  return vehicles;
}

// ============================================================================
// 3. COMPARAR E ENCONTRAR FALTANTES
// ============================================================================
function findMissingVehicles(frontendVehicles, backendVehicles) {
  console.log(`\n${colors.blue}🔍 Comparando veículos...${colors.reset}`);
  
  const missing = [];
  const found = [];
  
  // Cria índice do backend para busca rápida
  const backendIndex = new Map();
  for (const [id, vehicle] of Object.entries(backendVehicles)) {
    // Índice por ID
    backendIndex.set(id.toLowerCase(), vehicle);
    // Índice por marca_modelo_ano
    const key = `${vehicle.brand.toLowerCase()}_${vehicle.model.toLowerCase()}_${vehicle.year}`;
    backendIndex.set(key, vehicle);
  }
  
  for (const frontendVehicle of frontendVehicles) {
    const searchKey = `${frontendVehicle.brand.toLowerCase().replace(/[^a-z0-9]/g, '')}_${frontendVehicle.model.toLowerCase().replace(/[^a-z0-9]/g, '')}_${frontendVehicle.year}`;
    
    // Tenta encontrar no backend
    let foundInBackend = false;
    
    // Busca exata
    if (backendIndex.has(searchKey)) {
      foundInBackend = true;
    }
    
    // Busca por variações do ID
    if (!foundInBackend) {
      for (const [backendId, backendVehicle] of Object.entries(backendVehicles)) {
        if (backendVehicle.brand.toLowerCase() === frontendVehicle.brand.toLowerCase() &&
            backendVehicle.model.toLowerCase() === frontendVehicle.model.toLowerCase() &&
            backendVehicle.year === frontendVehicle.year) {
          foundInBackend = true;
          break;
        }
      }
    }
    
    if (foundInBackend) {
      found.push(frontendVehicle);
    } else {
      missing.push(frontendVehicle);
    }
  }
  
  console.log(`   ✅ ${found.length} veículos encontrados no backend`);
  console.log(`   ${missing.length > 0 ? colors.red + '❌' : colors.green + '✅'} ${missing.length} veículos faltando${colors.reset}`);
  
  return { missing, found };
}

// ============================================================================
// 4. GERAR PEÇAS PARA VEÍCULOS FALTANTES
// ============================================================================
function generatePartsForMissingVehicles(missingVehicles, backendVehicles) {
  if (missingVehicles.length === 0) {
    console.log(`\n${colors.green}✅ Nenhum veículo faltando! Todos os veículos do frontend têm peças.${colors.reset}`);
    return backendVehicles;
  }
  
  console.log(`\n${colors.yellow}🔧 Gerando peças para ${missingVehicles.length} veículos faltantes...${colors.reset}`);
  
  // Importa o generator
  const generatorPath = path.join(__dirname, 'src/fullCompatibilityGeneratorV4.cjs');
  
  // Carrega as constantes do generator
  const generatorContent = fs.readFileSync(generatorPath, 'utf-8');
  
  // Extrai as funções necessárias executando o módulo
  // Por simplicidade, vamos usar uma abordagem direta
  
  // Checklist de peças para carros (50 peças)
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
  
  // Checklist de peças para motos (30 peças)
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


  // Base de peças genéricas para carros
  const CAR_BASE_PARTS = {
    oil_filter: { partNumber: 'W712/95', brand: 'MANN-FILTER', equivalents: ['TECFIL PSL315', 'FRAM PH6811'], avgPrice: 45 },
    air_filter: { partNumber: 'C27192/1', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL6079', 'FRAM CA10242'], avgPrice: 55 },
    cabin_filter: { partNumber: 'CUK2939', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP315', 'FRAM CF10775'], avgPrice: 65 },
    fuel_filter: { partNumber: 'WK730/1', brand: 'MANN-FILTER', equivalents: ['TECFIL GI02', 'FRAM G10166'], avgPrice: 85 },
    transmission_filter: { partNumber: 'H199KIT', brand: 'MANN-FILTER', equivalents: ['ZF 0501216243'], avgPrice: 120 },
    front_brake_pads: { partNumber: 'N-1108', brand: 'COBREQ', equivalents: ['FRAS-LE PD/580', 'BOSCH BP1108'], avgPrice: 85 },
    rear_brake_pads: { partNumber: 'N-1109', brand: 'COBREQ', equivalents: ['FRAS-LE PD/581', 'BOSCH BP1109'], avgPrice: 75 },
    front_brake_disc: { partNumber: 'BD1108', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF108', 'VARGA 1108'], avgPrice: 180 },
    rear_brake_disc: { partNumber: 'BD1109', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF109', 'VARGA 1109'], avgPrice: 160 },
    brake_fluid: { partNumber: 'DOT4-500ML', brand: 'BOSCH', equivalents: ['WAGNER DOT4', 'CASTROL DOT4'], avgPrice: 35 },
    brake_hose_front: { partNumber: 'FH1108', brand: 'FRAS-LE', equivalents: ['TRW PHD1108'], avgPrice: 45 },
    brake_hose_rear: { partNumber: 'FH1109', brand: 'FRAS-LE', equivalents: ['TRW PHD1109'], avgPrice: 40 },
    handbrake_cable: { partNumber: 'CB1108', brand: 'COFLE', equivalents: ['NAKATA NCB1108'], avgPrice: 55 },
    spark_plugs: { partNumber: 'BKR6E', brand: 'NGK', equivalents: ['BOSCH FR7DC+', 'DENSO K20PR-U'], avgPrice: 25 },
    ignition_coil: { partNumber: 'U5055', brand: 'NGK', equivalents: ['BOSCH 0221604115'], avgPrice: 180 },
    spark_plug_wires: { partNumber: 'SCT1108', brand: 'NGK', equivalents: ['BOSCH 0986356734'], avgPrice: 120 },
    distributor_cap: { partNumber: 'DC1108', brand: 'BOSCH', equivalents: ['BERU VK355'], avgPrice: 85 },
    front_shock: { partNumber: 'GP32960', brand: 'MONROE', equivalents: ['COFAP MP32960', 'NAKATA HG32960'], avgPrice: 280 },
    rear_shock: { partNumber: 'GP32961', brand: 'MONROE', equivalents: ['COFAP MP32961', 'NAKATA HG32961'], avgPrice: 220 },
    front_spring: { partNumber: 'MC1108', brand: 'COFAP', equivalents: ['FABRINI F1108'], avgPrice: 180 },
    rear_spring: { partNumber: 'MC1109', brand: 'COFAP', equivalents: ['FABRINI F1109'], avgPrice: 160 },
    front_stabilizer_link: { partNumber: 'BL1108', brand: 'NAKATA', equivalents: ['VIEMAR V1108'], avgPrice: 65 },
    rear_stabilizer_link: { partNumber: 'BL1109', brand: 'NAKATA', equivalents: ['VIEMAR V1109'], avgPrice: 60 },
    control_arm_front: { partNumber: 'BA1108', brand: 'NAKATA', equivalents: ['VIEMAR VB1108'], avgPrice: 320 },
    ball_joint: { partNumber: 'PV1108', brand: 'NAKATA', equivalents: ['VIEMAR VP1108'], avgPrice: 85 },
    tie_rod_end: { partNumber: 'TD1108', brand: 'NAKATA', equivalents: ['VIEMAR VT1108'], avgPrice: 75 },
    steering_rack_boot: { partNumber: 'CR1108', brand: 'NAKATA', equivalents: ['VIEMAR VC1108'], avgPrice: 45 },
    timing_belt: { partNumber: 'CT1028', brand: 'CONTITECH', equivalents: ['GATES 5552XS', 'DAYCO 941028'], avgPrice: 120 },
    timing_belt_tensioner: { partNumber: 'VKM11028', brand: 'SKF', equivalents: ['INA 531047710'], avgPrice: 180 },
    water_pump: { partNumber: 'WP1028', brand: 'URBA', equivalents: ['INDISA 1028', 'NAKATA NKBA1028'], avgPrice: 180 },
    thermostat: { partNumber: 'TH1028', brand: 'WAHLER', equivalents: ['BEHR TX1028'], avgPrice: 65 },
    alternator_belt: { partNumber: '6PK1028', brand: 'CONTITECH', equivalents: ['GATES 6PK1028'], avgPrice: 45 },
    engine_oil: { partNumber: '5W30-4L', brand: 'CASTROL', equivalents: ['MOBIL 5W30', 'SHELL 5W30'], avgPrice: 120 },
    coolant: { partNumber: 'G12-1L', brand: 'VW', equivalents: ['PARAFLU G12'], avgPrice: 45 },
    valve_cover_gasket: { partNumber: 'JTV1028', brand: 'VICTOR REINZ', equivalents: ['ELRING 1028'], avgPrice: 85 },
    oil_pan_gasket: { partNumber: 'JC1028', brand: 'VICTOR REINZ', equivalents: ['ELRING C1028'], avgPrice: 95 },
    pcv_valve: { partNumber: 'PCV1028', brand: 'BOSCH', equivalents: ['WAHLER PCV1028'], avgPrice: 35 },
    battery: { partNumber: 'M60GD', brand: 'MOURA', equivalents: ['HELIAR HF60DD', 'ACDelco 60AH'], avgPrice: 450 },
    alternator: { partNumber: 'ALT1028', brand: 'BOSCH', equivalents: ['VALEO 1028'], avgPrice: 650 },
    starter_motor: { partNumber: 'SM1028', brand: 'BOSCH', equivalents: ['VALEO SM1028'], avgPrice: 550 },
    headlight_bulb: { partNumber: 'H7-55W', brand: 'OSRAM', equivalents: ['PHILIPS H7'], avgPrice: 35 },
    brake_light_bulb: { partNumber: 'P21W', brand: 'OSRAM', equivalents: ['PHILIPS P21W'], avgPrice: 8 },
    fuse_kit: { partNumber: 'FK-UNIV', brand: 'LITTELFUSE', equivalents: ['BUSSMANN FK'], avgPrice: 25 },
    clutch_kit: { partNumber: 'CK1028', brand: 'LUK', equivalents: ['SACHS 3000954095', 'VALEO 826818'], avgPrice: 650 },
    clutch_cable: { partNumber: 'CC1028', brand: 'COFLE', equivalents: ['NAKATA NCC1028'], avgPrice: 75 },
    transmission_oil: { partNumber: '75W90-1L', brand: 'CASTROL', equivalents: ['MOBIL 75W90'], avgPrice: 85 },
    cv_joint: { partNumber: 'CVJ1028', brand: 'GKN', equivalents: ['SKF VKJA1028'], avgPrice: 280 },
    front_wheel_bearing: { partNumber: 'WB1028', brand: 'SKF', equivalents: ['FAG 713610100'], avgPrice: 180 },
    rear_wheel_bearing: { partNumber: 'WB1029', brand: 'SKF', equivalents: ['FAG 713610101'], avgPrice: 160 },
    clutch_bearing: { partNumber: 'CB1028', brand: 'SKF', equivalents: ['FAG CB1028'], avgPrice: 120 },
  };
  
  // Base de peças genéricas para motos
  const MOTO_BASE_PARTS = {
    oil_filter: { partNumber: 'HF204', brand: 'HIFLOFILTRO', equivalents: ['FRAM CH6015', 'K&N KN-204'], avgPrice: 35 },
    air_filter: { partNumber: 'HFA4505', brand: 'HIFLOFILTRO', equivalents: ['K&N YA-6001'], avgPrice: 85 },
    fuel_filter: { partNumber: 'FF-101', brand: 'EMGO', equivalents: ['K&N 81-0261'], avgPrice: 25 },
    front_brake_pads: { partNumber: 'FA252', brand: 'EBC', equivalents: ['FERODO FDB2074'], avgPrice: 120 },
    rear_brake_pads: { partNumber: 'FA174', brand: 'EBC', equivalents: ['FERODO FDB2018'], avgPrice: 95 },
    front_brake_disc: { partNumber: 'MD2074X', brand: 'EBC', equivalents: ['BREMBO 78B40816'], avgPrice: 450 },
    rear_brake_disc: { partNumber: 'MD1163', brand: 'EBC', equivalents: ['BREMBO 68B407G0'], avgPrice: 320 },
    brake_fluid: { partNumber: 'DOT4-500ML', brand: 'MOTUL', equivalents: ['CASTROL DOT4'], avgPrice: 45 },
    brake_lever: { partNumber: 'BL-101', brand: 'ASV', equivalents: ['PUIG 5454'], avgPrice: 180 },
    spark_plug: { partNumber: 'CR9EK', brand: 'NGK', equivalents: ['DENSO IU27'], avgPrice: 35 },
    ignition_coil: { partNumber: 'IC-MOTO', brand: 'RICK\'S', equivalents: ['ELECTROSPORT ESC101'], avgPrice: 280 },
    cdi: { partNumber: 'CDI-MOTO', brand: 'RICK\'S', equivalents: ['ELECTROSPORT ESC201'], avgPrice: 450 },
    front_fork_oil: { partNumber: 'FORK-5W', brand: 'MOTUL', equivalents: ['CASTROL FORK 5W'], avgPrice: 65 },
    front_fork_seal: { partNumber: 'FS-41', brand: 'ALL BALLS', equivalents: ['ATHENA P40FORK455012'], avgPrice: 120 },
    rear_shock: { partNumber: 'YSS-MOTO', brand: 'YSS', equivalents: ['OHLINS MOTO'], avgPrice: 1200 },
    swing_arm_bearing: { partNumber: 'SAB-101', brand: 'ALL BALLS', equivalents: ['PIVOT WORKS PWSAK'], avgPrice: 85 },
    engine_oil: { partNumber: '10W40-4T', brand: 'MOTUL', equivalents: ['CASTROL POWER1 10W40'], avgPrice: 95 },
    coolant: { partNumber: 'MOTO-COOL', brand: 'MOTUL', equivalents: ['CASTROL MOTO COOLANT'], avgPrice: 55 },
    valve_clearance_shim: { partNumber: 'VCS-KIT', brand: 'HOT CAMS', equivalents: ['WISECO SHIM KIT'], avgPrice: 180 },
    cam_chain: { partNumber: 'CC-MOTO', brand: 'DID', equivalents: ['RK 25H'], avgPrice: 85 },
    cam_chain_tensioner: { partNumber: 'CCT-MOTO', brand: 'APE', equivalents: ['MOTION PRO 08-0467'], avgPrice: 120 },
    battery: { partNumber: 'YTZ10S', brand: 'YUASA', equivalents: ['MOTOBATT MBTX9U'], avgPrice: 380 },
    rectifier: { partNumber: 'RR-MOTO', brand: 'RICK\'S', equivalents: ['ELECTROSPORT ESR101'], avgPrice: 220 },
    stator: { partNumber: 'ST-MOTO', brand: 'RICK\'S', equivalents: ['ELECTROSPORT ESG101'], avgPrice: 380 },
    headlight_bulb: { partNumber: 'H7-55W', brand: 'OSRAM', equivalents: ['PHILIPS H7'], avgPrice: 35 },
    chain: { partNumber: '520VX3-120', brand: 'DID', equivalents: ['RK 520XSO'], avgPrice: 280 },
    front_sprocket: { partNumber: 'JTF-14', brand: 'JT', equivalents: ['SUNSTAR 14T'], avgPrice: 45 },
    rear_sprocket: { partNumber: 'JTR-43', brand: 'JT', equivalents: ['SUNSTAR 43T'], avgPrice: 85 },
    clutch_plates: { partNumber: 'DRC-MOTO', brand: 'EBC', equivalents: ['BARNETT CLUTCH'], avgPrice: 220 },
    clutch_cable: { partNumber: 'CC-MOTO', brand: 'MOTION PRO', equivalents: ['BARNETT CABLE'], avgPrice: 65 },
  };
  
  // Verifica se é moto
  function isMotorcycle(vehicle) {
    if (vehicle.vehicleType === 'motorcycle') return true;
    const motorcycleBrands = ['yamaha', 'honda', 'kawasaki', 'suzuki', 'ducati', 'harley-davidson', 'triumph', 'bmw', 'ktm'];
    const brand = vehicle.brand.toLowerCase();
    const model = vehicle.model.toLowerCase();
    
    // Verifica modelos específicos de motos
    const motoModels = ['cg', 'biz', 'pop', 'cb', 'cbr', 'xre', 'bros', 'pcx', 'factor', 'fazer', 'ybr', 'crosser', 'mt-', 'r1', 'r3', 'r6', 'yzf', 'ninja', 'z300', 'z400', 'versys', 'monster', 'scrambler', 'sportster', 'street triple'];
    
    for (const motoModel of motoModels) {
      if (model.includes(motoModel)) return true;
    }
    
    return false;
  }
  
  // Gera peças para um veículo
  function generatePartsForVehicle(vehicle) {
    const isMoto = isMotorcycle(vehicle);
    const checklist = isMoto ? MOTORCYCLE_PARTS_CHECKLIST : CAR_PARTS_CHECKLIST;
    const baseParts = isMoto ? MOTO_BASE_PARTS : CAR_BASE_PARTS;
    
    const brandCode = vehicle.brand.substring(0, 3).toUpperCase();
    const parts = [];
    
    for (const item of checklist) {
      const basePartData = baseParts[item.id];
      if (basePartData) {
        parts.push({
          id: item.id,
          name: item.name,
          category: item.category,
          priority: item.priority,
          partNumber: `${brandCode}-${basePartData.partNumber}`,
          brand: basePartData.brand,
          equivalents: basePartData.equivalents.map(eq => `${brandCode}-${eq}`),
          avgPrice: basePartData.avgPrice,
        });
      }
    }
    
    return parts;
  }
  
  // Adiciona veículos faltantes
  let addedCount = 0;
  for (const vehicle of missingVehicles) {
    const vehicleId = `${vehicle.brand.toLowerCase().replace(/[^a-z0-9]/g, '')}_${vehicle.model.toLowerCase().replace(/[^a-z0-9]/g, '')}_${vehicle.year}`;
    
    const parts = generatePartsForVehicle(vehicle);
    
    backendVehicles[vehicleId] = {
      vehicleId: vehicleId,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      trim: '',
      engineCode: '',
      engineName: '',
      fuel: 'flex',
      transmission: 'manual',
      bodyType: vehicle.vehicleType === 'motorcycle' ? 'motorcycle' : 'hatch',
      vehicleType: vehicle.vehicleType || 'car',
      platform: 'GENERIC',
      totalParts: parts.length,
      parts: parts,
      generatedAt: new Date().toISOString(),
      addedBySync: true,
    };
    
    addedCount++;
    
    if (addedCount % 100 === 0) {
      console.log(`   Adicionados ${addedCount}/${missingVehicles.length} veículos...`);
    }
  }
  
  console.log(`   ${colors.green}✅ ${addedCount} veículos adicionados!${colors.reset}`);
  
  return backendVehicles;
}

// ============================================================================
// 5. SALVAR DADOS ATUALIZADOS
// ============================================================================
function saveUpdatedData(vehicles) {
  console.log(`\n${colors.blue}💾 Salvando dados atualizados...${colors.reset}`);
  
  const outputPath = path.join(__dirname, 'output/parts-compatibility-v4-full.json');
  
  // Calcula estatísticas
  const stats = {
    totalVehicles: Object.keys(vehicles).length,
    totalParts: 0,
    platforms: new Set(),
    brands: new Set(),
    categories: new Set(),
    vehicleTypes: new Set(),
    partsDistribution: {},
    generatedAt: new Date().toISOString(),
    version: '4.1.0',
  };
  
  for (const vehicle of Object.values(vehicles)) {
    stats.totalParts += vehicle.parts?.length || 0;
    stats.platforms.add(vehicle.platform);
    stats.brands.add(vehicle.brand);
    stats.vehicleTypes.add(vehicle.vehicleType);
    
    const partsCount = vehicle.parts?.length || 0;
    stats.partsDistribution[partsCount] = (stats.partsDistribution[partsCount] || 0) + 1;
    
    for (const part of vehicle.parts || []) {
      stats.categories.add(part.category);
    }
  }
  
  stats.platforms = Array.from(stats.platforms);
  stats.brands = Array.from(stats.brands);
  stats.categories = Array.from(stats.categories);
  stats.vehicleTypes = Array.from(stats.vehicleTypes);
  stats.avgPartsPerVehicle = Math.round(stats.totalParts / stats.totalVehicles);
  
  const data = {
    vehicles: vehicles,
    stats: stats,
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`   ✅ Arquivo salvo: ${outputPath}`);
  
  // Salva índice
  const indexPath = path.join(__dirname, 'output/parts-compatibility-v4-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(stats, null, 2));
  console.log(`   ✅ Índice salvo: ${indexPath}`);
  
  return stats;
}

// ============================================================================
// 6. GERAR RELATÓRIO
// ============================================================================
function generateReport(frontendVehicles, backendVehicles, missing, stats) {
  console.log(`
${colors.cyan}═══════════════════════════════════════════════════════════════
   RELATÓRIO DE SINCRONIZAÇÃO
═══════════════════════════════════════════════════════════════${colors.reset}

${colors.blue}📊 ESTATÍSTICAS:${colors.reset}
   Veículos no Frontend:  ${frontendVehicles.length}
   Veículos no Backend:   ${stats.totalVehicles}
   Total de Peças:        ${stats.totalParts}
   Média Peças/Veículo:   ${stats.avgPartsPerVehicle}
   Marcas:                ${stats.brands.length}
   Categorias:            ${stats.categories.length}

${colors.green}✅ RESULTADO:${colors.reset}
   ${missing.length === 0 ? 'Todos os veículos do frontend têm peças no backend!' : `${missing.length} veículos foram adicionados ao backend.`}

${colors.yellow}📋 PRÓXIMOS PASSOS:${colors.reset}
   1. Reinicie o servidor backend: node server/index-simple.js
   2. Ou execute: POST http://localhost:3001/api/parts-full/reload
   3. Teste no modal "Buscar Peças por Veículo"
`);
}

// ============================================================================
// EXECUÇÃO PRINCIPAL
// ============================================================================
async function main() {
  try {
    // 1. Carrega veículos do frontend
    const frontendVehicles = loadFrontendVehicles();
    
    // 2. Carrega veículos do backend
    let backendVehicles = loadBackendVehicles();
    
    // 3. Encontra faltantes
    const { missing, found } = findMissingVehicles(frontendVehicles, backendVehicles);
    
    // 4. Gera peças para faltantes
    backendVehicles = generatePartsForMissingVehicles(missing, backendVehicles);
    
    // 5. Salva dados atualizados
    const stats = saveUpdatedData(backendVehicles);
    
    // 6. Gera relatório
    generateReport(frontendVehicles, backendVehicles, missing, stats);
    
    console.log(`${colors.green}✅ Sincronização concluída com sucesso!${colors.reset}\n`);
    
  } catch (error) {
    console.error(`${colors.red}❌ Erro: ${error.message}${colors.reset}`);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
