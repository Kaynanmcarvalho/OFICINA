/**
 * TORQ Automotive Backend - Checklists de Peças por Tipo de Veículo
 * Checklist FIXO e OBRIGATÓRIO para cada categoria de veículo
 */

import { VehicleType, PartCategory } from '../types';

// ============================================================================
// CHECKLIST DE MOTOS
// ============================================================================
export const MOTORCYCLE_CHECKLIST = {
  vehicleType: VehicleType.MOTORCYCLE,
  version: '1.0.0',
  categories: [
    {
      category: PartCategory.FILTRATION,
      name: 'Filtros',
      isRequired: true,
      items: [
        { id: 'moto_oil_filter', name: 'Filtro de Óleo', isRequired: true, quantity: 1, interval: '5.000 km' },
        { id: 'moto_air_filter', name: 'Filtro de Ar', isRequired: true, quantity: 1, interval: '10.000 km' },
        { id: 'moto_fuel_filter', name: 'Filtro de Combustível', isRequired: false, quantity: 1, interval: '20.000 km' },
      ]
    },
    {
      category: PartCategory.IGNITION,
      name: 'Ignição',
      isRequired: true,
      items: [
        { id: 'moto_spark_plug', name: 'Vela de Ignição', isRequired: true, quantity: 1, interval: '10.000 km',
          variations: [
            { condition: 'Motor 2 cilindros', quantity: 2 },
            { condition: 'Motor 4 cilindros', quantity: 4 },
          ]
        },
        { id: 'moto_ignition_coil', name: 'Bobina de Ignição', isRequired: true, quantity: 1 },
        { id: 'moto_spark_plug_cap', name: 'Cachimbo da Vela', isRequired: true, quantity: 1 },
      ]
    },
    {
      category: PartCategory.BRAKES,
      name: 'Freios',
      isRequired: true,
      items: [
        { id: 'moto_front_brake_pad', name: 'Pastilha de Freio Dianteira', isRequired: true, quantity: 1, interval: '15.000 km' },
        { id: 'moto_rear_brake_pad', name: 'Pastilha de Freio Traseira', isRequired: true, quantity: 1, interval: '20.000 km' },
        { id: 'moto_front_brake_disc', name: 'Disco de Freio Dianteiro', isRequired: true, quantity: 1, interval: '40.000 km' },
        { id: 'moto_rear_brake_disc', name: 'Disco de Freio Traseiro', isRequired: true, quantity: 1, interval: '50.000 km' },
        { id: 'moto_brake_fluid', name: 'Fluido de Freio DOT4', isRequired: true, quantity: 1, interval: '2 anos' },
      ]
    },
    {
      category: PartCategory.DRIVETRAIN,
      name: 'Transmissão',
      isRequired: true,
      items: [
        { id: 'moto_chain', name: 'Corrente de Transmissão', isRequired: true, quantity: 1, interval: '30.000 km' },
        { id: 'moto_front_sprocket', name: 'Pinhão (Coroa Dianteira)', isRequired: true, quantity: 1, interval: '30.000 km' },
        { id: 'moto_rear_sprocket', name: 'Coroa Traseira', isRequired: true, quantity: 1, interval: '30.000 km' },
        { id: 'moto_chain_kit', name: 'Kit Relação Completo', isRequired: false, quantity: 1 },
      ]
    },
    {
      category: PartCategory.LUBRICATION,
      name: 'Lubrificação',
      isRequired: true,
      items: [
        { id: 'moto_engine_oil', name: 'Óleo de Motor', isRequired: true, quantity: 1, interval: '3.000 km' },
        { id: 'moto_oil_drain_plug', name: 'Bujão do Cárter', isRequired: false, quantity: 1 },
        { id: 'moto_oil_drain_washer', name: 'Arruela do Bujão', isRequired: true, quantity: 1, interval: '3.000 km' },
      ]
    },
    {
      category: PartCategory.ELECTRICAL,
      name: 'Elétrica',
      isRequired: true,
      items: [
        { id: 'moto_battery', name: 'Bateria', isRequired: true, quantity: 1, interval: '2 anos' },
        { id: 'moto_rectifier', name: 'Retificador/Regulador', isRequired: true, quantity: 1 },
        { id: 'moto_starter_relay', name: 'Relé de Partida', isRequired: true, quantity: 1 },
        { id: 'moto_fuse_kit', name: 'Kit de Fusíveis', isRequired: true, quantity: 1 },
      ]
    },
    {
      category: PartCategory.LIGHTING,
      name: 'Iluminação',
      isRequired: true,
      items: [
        { id: 'moto_headlight_bulb', name: 'Lâmpada do Farol', isRequired: true, quantity: 1 },
        { id: 'moto_tail_light_bulb', name: 'Lâmpada da Lanterna', isRequired: true, quantity: 1 },
        { id: 'moto_turn_signal_bulb', name: 'Lâmpada de Seta', isRequired: true, quantity: 4 },
      ]
    },
    {
      category: PartCategory.SUSPENSION,
      name: 'Suspensão',
      isRequired: true,
      items: [
        { id: 'moto_fork_oil', name: 'Óleo de Bengala', isRequired: true, quantity: 1, interval: '20.000 km' },
        { id: 'moto_fork_seal', name: 'Retentor de Bengala', isRequired: true, quantity: 2, interval: '30.000 km' },
        { id: 'moto_fork_dust_seal', name: 'Guarda-pó de Bengala', isRequired: true, quantity: 2 },
        { id: 'moto_rear_shock', name: 'Amortecedor Traseiro', isRequired: true, quantity: 1 },
      ]
    },
    {
      category: PartCategory.COOLING,
      name: 'Arrefecimento',
      isRequired: false, // Apenas para motos refrigeradas a água
      items: [
        { id: 'moto_coolant', name: 'Fluido de Arrefecimento', isRequired: true, quantity: 1, interval: '2 anos' },
        { id: 'moto_thermostat', name: 'Válvula Termostática', isRequired: true, quantity: 1 },
        { id: 'moto_water_pump', name: 'Bomba d\'Água', isRequired: true, quantity: 1 },
        { id: 'moto_radiator_hose', name: 'Mangueira do Radiador', isRequired: true, quantity: 2 },
      ]
    },
    {
      category: PartCategory.CLUTCH,
      name: 'Embreagem',
      isRequired: true,
      items: [
        { id: 'moto_clutch_cable', name: 'Cabo de Embreagem', isRequired: true, quantity: 1 },
        { id: 'moto_clutch_plates', name: 'Discos de Embreagem', isRequired: true, quantity: 1, interval: '40.000 km' },
        { id: 'moto_clutch_springs', name: 'Molas de Embreagem', isRequired: true, quantity: 1 },
      ]
    },
    {
      category: PartCategory.FUEL_SYSTEM,
      name: 'Sistema de Combustível',
      isRequired: true,
      items: [
        { id: 'moto_fuel_pump', name: 'Bomba de Combustível', isRequired: true, quantity: 1 },
        { id: 'moto_fuel_injector', name: 'Bico Injetor', isRequired: true, quantity: 1,
          variations: [
            { condition: 'Motor 2 cilindros', quantity: 2 },
            { condition: 'Motor 4 cilindros', quantity: 4 },
          ]
        },
        { id: 'moto_throttle_body', name: 'Corpo de Borboleta', isRequired: true, quantity: 1 },
      ]
    },
  ]
};

// ============================================================================
// CHECKLIST DE CARROS
// ============================================================================
export const CAR_CHECKLIST = {
  vehicleType: VehicleType.CAR,
  version: '1.0.0',
  categories: [
    {
      category: PartCategory.FILTRATION,
      name: 'Filtros',
      isRequired: true,
      items: [
        { id: 'car_oil_filter', name: 'Filtro de Óleo', isRequired: true, quantity: 1, interval: '10.000 km' },
        { id: 'car_air_filter', name: 'Filtro de Ar do Motor', isRequired: true, quantity: 1, interval: '15.000 km' },
        { id: 'car_cabin_filter', name: 'Filtro de Ar Condicionado', isRequired: true, quantity: 1, interval: '15.000 km' },
        { id: 'car_fuel_filter', name: 'Filtro de Combustível', isRequired: true, quantity: 1, interval: '40.000 km' },
      ]
    },
    {
      category: PartCategory.IGNITION,
      name: 'Ignição',
      isRequired: true,
      items: [
        { id: 'car_spark_plug', name: 'Vela de Ignição', isRequired: true, quantity: 4, interval: '30.000 km',
          variations: [
            { condition: 'Motor 3 cilindros', quantity: 3 },
            { condition: 'Motor 6 cilindros', quantity: 6 },
            { condition: 'Motor 8 cilindros', quantity: 8 },
          ]
        },
        { id: 'car_ignition_coil', name: 'Bobina de Ignição', isRequired: true, quantity: 4,
          variations: [
            { condition: 'Bobina única', quantity: 1 },
            { condition: 'Motor 3 cilindros', quantity: 3 },
            { condition: 'Motor 6 cilindros', quantity: 6 },
          ]
        },
        { id: 'car_spark_plug_wire', name: 'Cabo de Vela', isRequired: false, quantity: 4 },
      ]
    },
    {
      category: PartCategory.BRAKES,
      name: 'Freios',
      isRequired: true,
      items: [
        { id: 'car_front_brake_pad', name: 'Pastilha de Freio Dianteira', isRequired: true, quantity: 1, interval: '30.000 km' },
        { id: 'car_rear_brake_pad', name: 'Pastilha de Freio Traseira', isRequired: true, quantity: 1, interval: '40.000 km' },
        { id: 'car_front_brake_disc', name: 'Disco de Freio Dianteiro', isRequired: true, quantity: 2, interval: '60.000 km' },
        { id: 'car_rear_brake_disc', name: 'Disco de Freio Traseiro', isRequired: true, quantity: 2, interval: '80.000 km' },
        { id: 'car_brake_fluid', name: 'Fluido de Freio DOT4', isRequired: true, quantity: 1, interval: '2 anos' },
        { id: 'car_brake_caliper', name: 'Pinça de Freio', isRequired: true, quantity: 4 },
        { id: 'car_brake_hose', name: 'Flexível de Freio', isRequired: true, quantity: 4 },
        { id: 'car_handbrake_cable', name: 'Cabo de Freio de Mão', isRequired: true, quantity: 2 },
      ]
    },
    {
      category: PartCategory.SUSPENSION,
      name: 'Suspensão',
      isRequired: true,
      items: [
        { id: 'car_front_shock', name: 'Amortecedor Dianteiro', isRequired: true, quantity: 2, interval: '60.000 km' },
        { id: 'car_rear_shock', name: 'Amortecedor Traseiro', isRequired: true, quantity: 2, interval: '60.000 km' },
        { id: 'car_front_spring', name: 'Mola Dianteira', isRequired: true, quantity: 2 },
        { id: 'car_rear_spring', name: 'Mola Traseira', isRequired: true, quantity: 2 },
        { id: 'car_front_strut_mount', name: 'Coxim do Amortecedor Dianteiro', isRequired: true, quantity: 2 },
        { id: 'car_control_arm', name: 'Bandeja de Suspensão', isRequired: true, quantity: 2 },
        { id: 'car_ball_joint', name: 'Pivô de Suspensão', isRequired: true, quantity: 2 },
        { id: 'car_stabilizer_link', name: 'Bieleta da Barra Estabilizadora', isRequired: true, quantity: 2 },
        { id: 'car_stabilizer_bushing', name: 'Bucha da Barra Estabilizadora', isRequired: true, quantity: 2 },
      ]
    },
    {
      category: PartCategory.STEERING,
      name: 'Direção',
      isRequired: true,
      items: [
        { id: 'car_tie_rod_end', name: 'Terminal de Direção', isRequired: true, quantity: 2 },
        { id: 'car_tie_rod', name: 'Barra de Direção', isRequired: true, quantity: 2 },
        { id: 'car_steering_rack', name: 'Caixa de Direção', isRequired: true, quantity: 1 },
        { id: 'car_power_steering_fluid', name: 'Fluido de Direção Hidráulica', isRequired: false, quantity: 1 },
        { id: 'car_steering_boot', name: 'Coifa da Caixa de Direção', isRequired: true, quantity: 2 },
      ]
    },
    {
      category: PartCategory.COOLING,
      name: 'Arrefecimento',
      isRequired: true,
      items: [
        { id: 'car_coolant', name: 'Fluido de Arrefecimento', isRequired: true, quantity: 1, interval: '2 anos' },
        { id: 'car_thermostat', name: 'Válvula Termostática', isRequired: true, quantity: 1 },
        { id: 'car_water_pump', name: 'Bomba d\'Água', isRequired: true, quantity: 1, interval: '100.000 km' },
        { id: 'car_radiator', name: 'Radiador', isRequired: true, quantity: 1 },
        { id: 'car_radiator_hose_upper', name: 'Mangueira Superior do Radiador', isRequired: true, quantity: 1 },
        { id: 'car_radiator_hose_lower', name: 'Mangueira Inferior do Radiador', isRequired: true, quantity: 1 },
        { id: 'car_radiator_cap', name: 'Tampa do Radiador', isRequired: true, quantity: 1 },
        { id: 'car_cooling_fan', name: 'Ventoinha do Radiador', isRequired: true, quantity: 1 },
        { id: 'car_temp_sensor', name: 'Sensor de Temperatura', isRequired: true, quantity: 1 },
      ]
    },
    {
      category: PartCategory.ENGINE,
      name: 'Motor',
      isRequired: true,
      items: [
        { id: 'car_timing_belt', name: 'Correia Dentada', isRequired: true, quantity: 1, interval: '60.000 km' },
        { id: 'car_timing_kit', name: 'Kit de Correia Dentada', isRequired: true, quantity: 1 },
        { id: 'car_serpentine_belt', name: 'Correia Poly-V', isRequired: true, quantity: 1, interval: '60.000 km' },
        { id: 'car_tensioner', name: 'Tensor da Correia', isRequired: true, quantity: 1 },
        { id: 'car_idler_pulley', name: 'Polia Esticadora', isRequired: true, quantity: 1 },
        { id: 'car_valve_cover_gasket', name: 'Junta da Tampa de Válvulas', isRequired: true, quantity: 1 },
        { id: 'car_oil_pan_gasket', name: 'Junta do Cárter', isRequired: true, quantity: 1 },
        { id: 'car_head_gasket', name: 'Junta do Cabeçote', isRequired: true, quantity: 1 },
        { id: 'car_engine_mount', name: 'Coxim do Motor', isRequired: true, quantity: 3 },
      ]
    },
    {
      category: PartCategory.CLUTCH,
      name: 'Embreagem',
      isRequired: true,
      items: [
        { id: 'car_clutch_kit', name: 'Kit de Embreagem', isRequired: true, quantity: 1, interval: '80.000 km' },
        { id: 'car_clutch_disc', name: 'Disco de Embreagem', isRequired: true, quantity: 1 },
        { id: 'car_pressure_plate', name: 'Platô de Embreagem', isRequired: true, quantity: 1 },
        { id: 'car_release_bearing', name: 'Rolamento de Embreagem', isRequired: true, quantity: 1 },
        { id: 'car_clutch_cable', name: 'Cabo de Embreagem', isRequired: false, quantity: 1 },
        { id: 'car_clutch_master', name: 'Cilindro Mestre de Embreagem', isRequired: false, quantity: 1 },
        { id: 'car_clutch_slave', name: 'Cilindro Auxiliar de Embreagem', isRequired: false, quantity: 1 },
      ]
    },
    {
      category: PartCategory.ELECTRICAL,
      name: 'Elétrica',
      isRequired: true,
      items: [
        { id: 'car_battery', name: 'Bateria', isRequired: true, quantity: 1, interval: '3 anos' },
        { id: 'car_alternator', name: 'Alternador', isRequired: true, quantity: 1 },
        { id: 'car_starter', name: 'Motor de Partida', isRequired: true, quantity: 1 },
        { id: 'car_fuse_box', name: 'Caixa de Fusíveis', isRequired: true, quantity: 1 },
        { id: 'car_relay_kit', name: 'Kit de Relés', isRequired: true, quantity: 1 },
      ]
    },
    {
      category: PartCategory.FUEL_SYSTEM,
      name: 'Sistema de Combustível',
      isRequired: true,
      items: [
        { id: 'car_fuel_pump', name: 'Bomba de Combustível', isRequired: true, quantity: 1 },
        { id: 'car_fuel_injector', name: 'Bico Injetor', isRequired: true, quantity: 4,
          variations: [
            { condition: 'Motor 3 cilindros', quantity: 3 },
            { condition: 'Motor 6 cilindros', quantity: 6 },
          ]
        },
        { id: 'car_throttle_body', name: 'Corpo de Borboleta', isRequired: true, quantity: 1 },
        { id: 'car_fuel_pressure_regulator', name: 'Regulador de Pressão', isRequired: true, quantity: 1 },
        { id: 'car_fuel_tank_cap', name: 'Tampa do Tanque', isRequired: true, quantity: 1 },
      ]
    },
    {
      category: PartCategory.EXHAUST,
      name: 'Escapamento',
      isRequired: true,
      items: [
        { id: 'car_catalytic_converter', name: 'Catalisador', isRequired: true, quantity: 1 },
        { id: 'car_muffler', name: 'Silencioso', isRequired: true, quantity: 1 },
        { id: 'car_exhaust_pipe', name: 'Tubo de Escapamento', isRequired: true, quantity: 1 },
        { id: 'car_exhaust_gasket', name: 'Junta do Escapamento', isRequired: true, quantity: 2 },
        { id: 'car_oxygen_sensor', name: 'Sonda Lambda', isRequired: true, quantity: 2 },
        { id: 'car_exhaust_hanger', name: 'Coxim do Escapamento', isRequired: true, quantity: 3 },
      ]
    },
    {
      category: PartCategory.LIGHTING,
      name: 'Iluminação',
      isRequired: true,
      items: [
        { id: 'car_headlight_bulb', name: 'Lâmpada do Farol', isRequired: true, quantity: 2 },
        { id: 'car_high_beam_bulb', name: 'Lâmpada do Farol Alto', isRequired: true, quantity: 2 },
        { id: 'car_fog_light_bulb', name: 'Lâmpada do Farol de Milha', isRequired: false, quantity: 2 },
        { id: 'car_tail_light_bulb', name: 'Lâmpada da Lanterna', isRequired: true, quantity: 2 },
        { id: 'car_brake_light_bulb', name: 'Lâmpada de Freio', isRequired: true, quantity: 2 },
        { id: 'car_turn_signal_bulb', name: 'Lâmpada de Seta', isRequired: true, quantity: 4 },
        { id: 'car_reverse_light_bulb', name: 'Lâmpada de Ré', isRequired: true, quantity: 2 },
      ]
    },
    {
      category: PartCategory.WHEELS,
      name: 'Rodas e Pneus',
      isRequired: true,
      items: [
        { id: 'car_tire', name: 'Pneu', isRequired: true, quantity: 4 },
        { id: 'car_wheel_bearing', name: 'Rolamento de Roda', isRequired: true, quantity: 4 },
        { id: 'car_wheel_hub', name: 'Cubo de Roda', isRequired: true, quantity: 4 },
        { id: 'car_wheel_nut', name: 'Porca de Roda', isRequired: true, quantity: 20 },
        { id: 'car_wheel_stud', name: 'Prisioneiro de Roda', isRequired: true, quantity: 20 },
      ]
    },
  ]
};

// ============================================================================
// EXPORT CHECKLISTS
// ============================================================================
export const VEHICLE_CHECKLISTS = {
  [VehicleType.MOTORCYCLE]: MOTORCYCLE_CHECKLIST,
  [VehicleType.CAR]: CAR_CHECKLIST,
  [VehicleType.SUV]: CAR_CHECKLIST, // SUV usa mesmo checklist de carro
  [VehicleType.VAN]: CAR_CHECKLIST,
  // TODO: Adicionar checklists específicos para caminhões e ônibus
};

export const getChecklistForVehicle = (vehicleType: VehicleType) => {
  return VEHICLE_CHECKLISTS[vehicleType] || CAR_CHECKLIST;
};
