/**
 * CHECKLIST OBRIGATÓRIO DE PEÇAS POR TIPO DE VEÍCULO
 * Cada veículo DEVE ter compatibilidade mapeada para estas peças
 */

export const PARTS_CHECKLIST = {
  // Carros, SUVs, Pickups, Vans
  car: [
    // Filtros - Críticos
    { id: 'oil_filter', name: 'Filtro de Óleo', category: 'filtros', priority: 'critical' },
    { id: 'air_filter', name: 'Filtro de Ar', category: 'filtros', priority: 'critical' },
    { id: 'fuel_filter', name: 'Filtro de Combustível', category: 'filtros', priority: 'critical' },
    { id: 'cabin_filter', name: 'Filtro de Cabine', category: 'filtros', priority: 'high' },
    
    // Ignição
    { id: 'spark_plugs', name: 'Velas de Ignição', category: 'ignição', priority: 'critical' },
    { id: 'spark_plugs_iridium', name: 'Velas Iridium', category: 'ignição', priority: 'medium' },
    
    // Freios
    { id: 'brake_pads_front', name: 'Pastilhas Dianteiras', category: 'freios', priority: 'critical' },
    { id: 'brake_pads_rear', name: 'Pastilhas Traseiras', category: 'freios', priority: 'critical' },
    { id: 'brake_discs_front', name: 'Discos Dianteiros', category: 'freios', priority: 'high' },
    { id: 'brake_discs_rear', name: 'Discos Traseiros', category: 'freios', priority: 'high' },
    { id: 'brake_fluid', name: 'Fluido de Freio', category: 'freios', priority: 'high' },
    
    // Motor
    { id: 'timing_belt_kit', name: 'Kit Correia Dentada', category: 'motor', priority: 'critical' },
    { id: 'serpentine_belt', name: 'Correia Poly-V', category: 'motor', priority: 'high' },
    { id: 'engine_mount', name: 'Coxim do Motor', category: 'motor', priority: 'medium' },
    { id: 'oil_pan_gasket', name: 'Junta do Cárter', category: 'motor', priority: 'medium' },
    
    // Lubrificantes
    { id: 'engine_oil', name: 'Óleo do Motor', category: 'lubrificantes', priority: 'critical' },
    { id: 'power_steering_fluid', name: 'Fluido de Direção', category: 'lubrificantes', priority: 'medium' },
    { id: 'transmission_oil', name: 'Óleo de Câmbio', category: 'lubrificantes', priority: 'medium' },
    
    // Arrefecimento
    { id: 'water_pump', name: 'Bomba d\'Água', category: 'arrefecimento', priority: 'high' },
    { id: 'thermostat', name: 'Válvula Termostática', category: 'arrefecimento', priority: 'medium' },
    { id: 'coolant', name: 'Líquido de Arrefecimento', category: 'arrefecimento', priority: 'high' },
    
    // Suspensão
    { id: 'shock_absorber_front', name: 'Amortecedor Dianteiro', category: 'suspensão', priority: 'high' },
    { id: 'shock_absorber_rear', name: 'Amortecedor Traseiro', category: 'suspensão', priority: 'high' },
    { id: 'control_arm_bushings', name: 'Buchas de Bandeja', category: 'suspensão', priority: 'medium' },
    { id: 'ball_joint', name: 'Pivô de Suspensão', category: 'suspensão', priority: 'high' },
    { id: 'tie_rod_end', name: 'Terminal de Direção', category: 'suspensão', priority: 'high' },
    
    // Elétrica
    { id: 'alternator', name: 'Alternador', category: 'elétrica', priority: 'high' },
    { id: 'starter_motor', name: 'Motor de Arranque', category: 'elétrica', priority: 'high' },
    { id: 'battery', name: 'Bateria', category: 'elétrica', priority: 'critical' },
    
    // Transmissão
    { id: 'clutch_kit', name: 'Kit de Embreagem', category: 'transmissão', priority: 'high' },
    { id: 'cv_joint', name: 'Junta Homocinética', category: 'transmissão', priority: 'high' },
    
    // Rolamentos
    { id: 'wheel_bearing', name: 'Rolamento de Roda', category: 'rolamentos', priority: 'high' },
  ],
  
  // SUVs (mesmas peças de carro + específicas)
  suv: [
    // Herda de car
  ],
  
  // Pickups
  pickup: [
    // Herda de car
  ],
  
  // Vans
  van: [
    // Herda de car
  ],
  
  // Motos
  motorcycle: [
    { id: 'oil_filter', name: 'Filtro de Óleo', category: 'filtros', priority: 'critical' },
    { id: 'air_filter', name: 'Filtro de Ar', category: 'filtros', priority: 'critical' },
    { id: 'engine_oil', name: 'Óleo do Motor', category: 'lubrificantes', priority: 'critical' },
    { id: 'brake_pads_front', name: 'Pastilha Dianteira', category: 'freios', priority: 'critical' },
    { id: 'brake_pads_rear', name: 'Pastilha Traseira', category: 'freios', priority: 'critical' },
    { id: 'brake_disc_front', name: 'Disco Dianteiro', category: 'freios', priority: 'high' },
    { id: 'brake_disc_rear', name: 'Disco Traseiro', category: 'freios', priority: 'high' },
    { id: 'chain_kit', name: 'Kit Relação', category: 'transmissão', priority: 'critical' },
    { id: 'sprocket', name: 'Coroa', category: 'transmissão', priority: 'high' },
    { id: 'pinion', name: 'Pinhão', category: 'transmissão', priority: 'high' },
    { id: 'spark_plug', name: 'Vela de Ignição', category: 'ignição', priority: 'critical' },
    { id: 'voltage_regulator', name: 'Regulador de Voltagem', category: 'elétrica', priority: 'high' },
    { id: 'clutch_lever', name: 'Manete de Embreagem', category: 'controles', priority: 'medium' },
    { id: 'brake_lever', name: 'Manete de Freio', category: 'controles', priority: 'medium' },
    { id: 'gasket_set', name: 'Jogo de Juntas', category: 'motor', priority: 'medium' },
    { id: 'battery', name: 'Bateria', category: 'elétrica', priority: 'critical' },
  ],
  
  // Caminhões
  truck: [
    { id: 'oil_filter', name: 'Filtro de Óleo', category: 'filtros', priority: 'critical' },
    { id: 'fuel_filter', name: 'Filtro de Diesel', category: 'filtros', priority: 'critical' },
    { id: 'air_filter', name: 'Filtro de Ar', category: 'filtros', priority: 'critical' },
    { id: 'fuel_water_separator', name: 'Separador de Água', category: 'filtros', priority: 'high' },
    { id: 'brake_pads', name: 'Lonas de Freio', category: 'freios', priority: 'critical' },
    { id: 'brake_drums', name: 'Tambores de Freio', category: 'freios', priority: 'high' },
    { id: 'brake_discs', name: 'Discos de Freio', category: 'freios', priority: 'high' },
    { id: 'serpentine_belt', name: 'Correia Poly-V', category: 'motor', priority: 'high' },
    { id: 'engine_oil', name: 'Óleo do Motor', category: 'lubrificantes', priority: 'critical' },
    { id: 'transmission_oil', name: 'Óleo de Câmbio', category: 'lubrificantes', priority: 'high' },
    { id: 'coolant', name: 'Líquido de Arrefecimento', category: 'lubrificantes', priority: 'high' },
    { id: 'air_dryer', name: 'Secador de Ar', category: 'freios', priority: 'high' },
    { id: 'shock_absorber', name: 'Amortecedor', category: 'suspensão', priority: 'high' },
    { id: 'leaf_spring', name: 'Feixe de Molas', category: 'suspensão', priority: 'medium' },
    { id: 'alternator', name: 'Alternador', category: 'elétrica', priority: 'high' },
    { id: 'starter_motor', name: 'Motor de Arranque', category: 'elétrica', priority: 'high' },
    { id: 'battery', name: 'Bateria', category: 'elétrica', priority: 'critical' },
  ],
  
  // Ônibus (similar a caminhões)
  bus: [
    // Herda de truck
  ],
};

// Expande tipos que herdam de outros
PARTS_CHECKLIST.suv = [...PARTS_CHECKLIST.car];
PARTS_CHECKLIST.pickup = [...PARTS_CHECKLIST.car];
PARTS_CHECKLIST.van = [...PARTS_CHECKLIST.car];
PARTS_CHECKLIST.bus = [...PARTS_CHECKLIST.truck];

export default PARTS_CHECKLIST;
