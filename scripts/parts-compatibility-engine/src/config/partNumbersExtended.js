/**
 * BASE ESTENDIDA DE PART NUMBERS - COBERTURA COMPLETA BRASIL
 * Expansão massiva para cobrir TODOS os veículos do mercado brasileiro
 * 
 * @version 3.0.0 - Edição Completa Brasil
 */

// ============================================================================
// BOMBAS D'ÁGUA
// ============================================================================
export const WATER_PUMPS = {
  // VW
  'WP-VW001': { brand: 'URBA', applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro', 'VW Up', 'VW EA111', 'VW EA211'], specs: { flow: 80, impeller: 'plastic' }, equivalents: ['INDISA 10001', 'SWP VW001'] },
  'WP-VW002': { brand: 'URBA', applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus', 'VW Taos', 'Audi A3', 'Audi Q3'], specs: { flow: 90, impeller: 'metal' }, equivalents: ['INDISA 10002', 'SWP VW002'] },
  'WP-VW003': { brand: 'URBA', applications: ['VW Amarok', 'VW Tiguan', 'VW Jetta', 'VW Passat', 'VW Golf'], specs: { flow: 100, impeller: 'metal' }, equivalents: ['INDISA 10003', 'SWP VW003'] },
  
  // Fiat
  'WP-FI001': { brand: 'URBA', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo', 'Fiat Fire'], specs: { flow: 75, impeller: 'plastic' }, equivalents: ['INDISA 10010', 'SWP FI001'] },
  'WP-FI002': { brand: 'URBA', applications: ['Fiat Cronos', 'Fiat Toro', 'Fiat 500', 'Fiat Pulse', 'Fiat Fastback', 'Fiat E.torQ'], specs: { flow: 85, impeller: 'metal' }, equivalents: ['INDISA 10011', 'SWP FI002'] },
  
  // GM/Chevrolet
  'WP-GM001': { brand: 'URBA', applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin', 'GM SPE/4'], specs: { flow: 80, impeller: 'plastic' }, equivalents: ['INDISA 10020', 'SWP GM001'] },
  'WP-GM002': { brand: 'URBA', applications: ['Chevrolet Cruze', 'Chevrolet Tracker', 'Chevrolet Equinox', 'GM Ecotec'], specs: { flow: 95, impeller: 'metal' }, equivalents: ['INDISA 10021', 'SWP GM002'] },
  'WP-GM003': { brand: 'URBA', applications: ['Chevrolet S10', 'Chevrolet Trailblazer', 'Chevrolet Colorado'], specs: { flow: 110, impeller: 'metal' }, equivalents: ['INDISA 10022', 'SWP GM003'] },
  
  // Honda
  'WP-HO001': { brand: 'URBA', applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V', 'Honda i-VTEC'], specs: { flow: 85, impeller: 'metal' }, equivalents: ['INDISA 10030', 'SWP HO001'] },
  'WP-HO002': { brand: 'URBA', applications: ['Honda CR-V', 'Honda Accord', 'Honda Pilot'], specs: { flow: 100, impeller: 'metal' }, equivalents: ['INDISA 10031', 'SWP HO002'] },
  
  // Toyota
  'WP-TO001': { brand: 'URBA', applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios', 'Toyota 2ZR', 'Toyota 1ZZ'], specs: { flow: 85, impeller: 'metal' }, equivalents: ['INDISA 10040', 'SWP TO001'] },
  'WP-TO002': { brand: 'URBA', applications: ['Toyota Hilux', 'Toyota SW4', 'Toyota RAV4', 'Toyota Camry'], specs: { flow: 110, impeller: 'metal' }, equivalents: ['INDISA 10041', 'SWP TO002'] },
  
  // Hyundai/Kia
  'WP-HK001': { brand: 'URBA', applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio', 'Kia Stonic', 'Hyundai Gamma'], specs: { flow: 80, impeller: 'metal' }, equivalents: ['INDISA 10050', 'SWP HK001'] },
  'WP-HK002': { brand: 'URBA', applications: ['Hyundai Tucson', 'Hyundai Santa Fe', 'Kia Sportage', 'Kia Sorento', 'Hyundai Nu'], specs: { flow: 95, impeller: 'metal' }, equivalents: ['INDISA 10051', 'SWP HK002'] },
  
  // Renault
  'WP-RE001': { brand: 'URBA', applications: ['Renault Sandero', 'Renault Logan', 'Renault Kwid', 'Renault K7M', 'Renault K4M'], specs: { flow: 75, impeller: 'plastic' }, equivalents: ['INDISA 10060', 'SWP RE001'] },
  'WP-RE002': { brand: 'URBA', applications: ['Renault Duster', 'Renault Captur', 'Renault Oroch', 'Renault Koleos'], specs: { flow: 90, impeller: 'metal' }, equivalents: ['INDISA 10061', 'SWP RE002'] },
  
  // Ford
  'WP-FO001': { brand: 'URBA', applications: ['Ford Ka', 'Ford Fiesta', 'Ford EcoSport', 'Ford Sigma', 'Ford Zetec'], specs: { flow: 80, impeller: 'plastic' }, equivalents: ['INDISA 10070', 'SWP FO001'] },
  'WP-FO002': { brand: 'URBA', applications: ['Ford Focus', 'Ford Fusion', 'Ford Ranger', 'Ford Territory', 'Ford Duratec'], specs: { flow: 100, impeller: 'metal' }, equivalents: ['INDISA 10071', 'SWP FO002'] },
  
  // Jeep
  'WP-JE001': { brand: 'URBA', applications: ['Jeep Renegade', 'Jeep Compass', 'Jeep Commander', 'Fiat Toro', 'Fiat Pulse'], specs: { flow: 95, impeller: 'metal' }, equivalents: ['INDISA 10080', 'SWP JE001'] },
  
  // Nissan
  'WP-NI001': { brand: 'URBA', applications: ['Nissan March', 'Nissan Versa', 'Nissan Kicks', 'Nissan Sentra'], specs: { flow: 80, impeller: 'metal' }, equivalents: ['INDISA 10090', 'SWP NI001'] },
  'WP-NI002': { brand: 'URBA', applications: ['Nissan Frontier', 'Nissan X-Trail', 'Nissan Pathfinder'], specs: { flow: 110, impeller: 'metal' }, equivalents: ['INDISA 10091', 'SWP NI002'] },
  
  // Mitsubishi
  'WP-MI001': { brand: 'URBA', applications: ['Mitsubishi ASX', 'Mitsubishi Outlander', 'Mitsubishi Eclipse Cross'], specs: { flow: 90, impeller: 'metal' }, equivalents: ['INDISA 10100', 'SWP MI001'] },
  'WP-MI002': { brand: 'URBA', applications: ['Mitsubishi L200 Triton', 'Mitsubishi Pajero', 'Mitsubishi Pajero Sport'], specs: { flow: 120, impeller: 'metal' }, equivalents: ['INDISA 10101', 'SWP MI002'] },
  
  // Peugeot/Citroën
  'WP-PC001': { brand: 'URBA', applications: ['Peugeot 208', 'Peugeot 2008', 'Citroën C3', 'Citroën C4 Cactus', 'PSA EB2'], specs: { flow: 80, impeller: 'metal' }, equivalents: ['INDISA 10110', 'SWP PC001'] },
  'WP-PC002': { brand: 'URBA', applications: ['Peugeot 3008', 'Peugeot 5008', 'Citroën C4 Lounge', 'Citroën DS5', 'PSA THP'], specs: { flow: 95, impeller: 'metal' }, equivalents: ['INDISA 10111', 'SWP PC002'] },
  
  // BMW
  'WP-BM001': { brand: 'PIERBURG', applications: ['BMW 320i', 'BMW 328i', 'BMW X1', 'BMW X3', 'BMW N20', 'BMW B48'], specs: { flow: 100, impeller: 'metal', electric: true }, equivalents: ['BOSCH WP-BM001', 'VALEO WP-BM001'] },
  
  // Mercedes
  'WP-MB001': { brand: 'PIERBURG', applications: ['Mercedes A200', 'Mercedes CLA200', 'Mercedes GLA200', 'Mercedes C180', 'Mercedes C200', 'Mercedes M270'], specs: { flow: 100, impeller: 'metal', electric: true }, equivalents: ['BOSCH WP-MB001', 'VALEO WP-MB001'] },
};

// ============================================================================
// VÁLVULAS TERMOSTÁTICAS
// ============================================================================
export const THERMOSTATS = {
  // VW
  'TH-VW001': { brand: 'WAHLER', applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro', 'VW Up', 'VW EA111'], specs: { openTemp: 87, fullOpen: 102 }, equivalents: ['MTE-THOMSON 289.87', 'VALCLEI VT001'] },
  'TH-VW002': { brand: 'WAHLER', applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus', 'VW EA211'], specs: { openTemp: 87, fullOpen: 102 }, equivalents: ['MTE-THOMSON 289.87', 'VALCLEI VT002'] },
  
  // Fiat
  'TH-FI001': { brand: 'WAHLER', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo', 'Fiat Fire'], specs: { openTemp: 88, fullOpen: 103 }, equivalents: ['MTE-THOMSON 288.88', 'VALCLEI VT010'] },
  
  // GM
  'TH-GM001': { brand: 'WAHLER', applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin', 'GM SPE/4'], specs: { openTemp: 82, fullOpen: 97 }, equivalents: ['MTE-THOMSON 282.82', 'VALCLEI VT020'] },
  
  // Honda
  'TH-HO001': { brand: 'WAHLER', applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V'], specs: { openTemp: 80, fullOpen: 95 }, equivalents: ['MTE-THOMSON 280.80', 'VALCLEI VT030'] },
  
  // Toyota
  'TH-TO001': { brand: 'WAHLER', applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios', 'Toyota RAV4'], specs: { openTemp: 82, fullOpen: 97 }, equivalents: ['MTE-THOMSON 282.82', 'VALCLEI VT040'] },
  
  // Hyundai/Kia
  'TH-HK001': { brand: 'WAHLER', applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio', 'Kia Cerato'], specs: { openTemp: 82, fullOpen: 97 }, equivalents: ['MTE-THOMSON 282.82', 'VALCLEI VT050'] },
  
  // Renault
  'TH-RE001': { brand: 'WAHLER', applications: ['Renault Sandero', 'Renault Logan', 'Renault Duster', 'Renault Captur', 'Renault Kwid'], specs: { openTemp: 89, fullOpen: 104 }, equivalents: ['MTE-THOMSON 289.89', 'VALCLEI VT060'] },
};


// ============================================================================
// ALTERNADORES
// ============================================================================
export const ALTERNATORS = {
  // VW
  'ALT-VW001': { brand: 'BOSCH', applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro', 'VW Up', 'VW EA111', 'VW EA211'], specs: { amperage: 90, voltage: 14 }, equivalents: ['VALEO ALT-VW001', 'DENSO ALT-VW001'] },
  'ALT-VW002': { brand: 'BOSCH', applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus', 'VW Taos'], specs: { amperage: 110, voltage: 14 }, equivalents: ['VALEO ALT-VW002', 'DENSO ALT-VW002'] },
  'ALT-VW003': { brand: 'BOSCH', applications: ['VW Amarok', 'VW Tiguan', 'VW Jetta', 'VW Passat'], specs: { amperage: 140, voltage: 14 }, equivalents: ['VALEO ALT-VW003', 'DENSO ALT-VW003'] },
  
  // Fiat
  'ALT-FI001': { brand: 'BOSCH', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo', 'Fiat Fire'], specs: { amperage: 85, voltage: 14 }, equivalents: ['VALEO ALT-FI001', 'DENSO ALT-FI001'] },
  'ALT-FI002': { brand: 'BOSCH', applications: ['Fiat Cronos', 'Fiat Toro', 'Fiat Pulse', 'Fiat Fastback', 'Fiat E.torQ'], specs: { amperage: 110, voltage: 14 }, equivalents: ['VALEO ALT-FI002', 'DENSO ALT-FI002'] },
  
  // GM
  'ALT-GM001': { brand: 'BOSCH', applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin'], specs: { amperage: 100, voltage: 14 }, equivalents: ['VALEO ALT-GM001', 'DELCO ALT-GM001'] },
  'ALT-GM002': { brand: 'BOSCH', applications: ['Chevrolet Cruze', 'Chevrolet Tracker', 'Chevrolet Equinox'], specs: { amperage: 130, voltage: 14 }, equivalents: ['VALEO ALT-GM002', 'DELCO ALT-GM002'] },
  'ALT-GM003': { brand: 'BOSCH', applications: ['Chevrolet S10', 'Chevrolet Trailblazer'], specs: { amperage: 150, voltage: 14 }, equivalents: ['VALEO ALT-GM003', 'DELCO ALT-GM003'] },
  
  // Honda
  'ALT-HO001': { brand: 'DENSO', applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V'], specs: { amperage: 100, voltage: 14 }, equivalents: ['BOSCH ALT-HO001', 'VALEO ALT-HO001'] },
  'ALT-HO002': { brand: 'DENSO', applications: ['Honda CR-V', 'Honda Accord'], specs: { amperage: 130, voltage: 14 }, equivalents: ['BOSCH ALT-HO002', 'VALEO ALT-HO002'] },
  
  // Toyota
  'ALT-TO001': { brand: 'DENSO', applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios'], specs: { amperage: 100, voltage: 14 }, equivalents: ['BOSCH ALT-TO001', 'VALEO ALT-TO001'] },
  'ALT-TO002': { brand: 'DENSO', applications: ['Toyota Hilux', 'Toyota SW4', 'Toyota RAV4'], specs: { amperage: 130, voltage: 14 }, equivalents: ['BOSCH ALT-TO002', 'VALEO ALT-TO002'] },
  
  // Hyundai/Kia
  'ALT-HK001': { brand: 'VALEO', applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio', 'Kia Cerato'], specs: { amperage: 90, voltage: 14 }, equivalents: ['BOSCH ALT-HK001', 'DENSO ALT-HK001'] },
  'ALT-HK002': { brand: 'VALEO', applications: ['Hyundai Tucson', 'Hyundai Santa Fe', 'Kia Sportage', 'Kia Sorento'], specs: { amperage: 120, voltage: 14 }, equivalents: ['BOSCH ALT-HK002', 'DENSO ALT-HK002'] },
  
  // Renault
  'ALT-RE001': { brand: 'VALEO', applications: ['Renault Sandero', 'Renault Logan', 'Renault Kwid'], specs: { amperage: 85, voltage: 14 }, equivalents: ['BOSCH ALT-RE001', 'DENSO ALT-RE001'] },
  'ALT-RE002': { brand: 'VALEO', applications: ['Renault Duster', 'Renault Captur', 'Renault Oroch'], specs: { amperage: 110, voltage: 14 }, equivalents: ['BOSCH ALT-RE002', 'DENSO ALT-RE002'] },
  
  // Ford
  'ALT-FO001': { brand: 'BOSCH', applications: ['Ford Ka', 'Ford Fiesta', 'Ford EcoSport'], specs: { amperage: 90, voltage: 14 }, equivalents: ['VALEO ALT-FO001', 'DENSO ALT-FO001'] },
  'ALT-FO002': { brand: 'BOSCH', applications: ['Ford Focus', 'Ford Fusion', 'Ford Ranger', 'Ford Territory'], specs: { amperage: 130, voltage: 14 }, equivalents: ['VALEO ALT-FO002', 'DENSO ALT-FO002'] },
  
  // Jeep
  'ALT-JE001': { brand: 'BOSCH', applications: ['Jeep Renegade', 'Jeep Compass', 'Jeep Commander'], specs: { amperage: 120, voltage: 14 }, equivalents: ['VALEO ALT-JE001', 'DENSO ALT-JE001'] },
  
  // Nissan
  'ALT-NI001': { brand: 'HITACHI', applications: ['Nissan March', 'Nissan Versa', 'Nissan Kicks', 'Nissan Sentra'], specs: { amperage: 100, voltage: 14 }, equivalents: ['BOSCH ALT-NI001', 'VALEO ALT-NI001'] },
  'ALT-NI002': { brand: 'HITACHI', applications: ['Nissan Frontier', 'Nissan X-Trail'], specs: { amperage: 130, voltage: 14 }, equivalents: ['BOSCH ALT-NI002', 'VALEO ALT-NI002'] },
  
  // Mitsubishi
  'ALT-MI001': { brand: 'MITSUBISHI', applications: ['Mitsubishi ASX', 'Mitsubishi Outlander', 'Mitsubishi Eclipse Cross'], specs: { amperage: 110, voltage: 14 }, equivalents: ['BOSCH ALT-MI001', 'VALEO ALT-MI001'] },
  'ALT-MI002': { brand: 'MITSUBISHI', applications: ['Mitsubishi L200 Triton', 'Mitsubishi Pajero', 'Mitsubishi Pajero Sport'], specs: { amperage: 150, voltage: 14 }, equivalents: ['BOSCH ALT-MI002', 'VALEO ALT-MI002'] },
  
  // Peugeot/Citroën
  'ALT-PC001': { brand: 'VALEO', applications: ['Peugeot 208', 'Peugeot 2008', 'Citroën C3', 'Citroën C4 Cactus'], specs: { amperage: 100, voltage: 14 }, equivalents: ['BOSCH ALT-PC001', 'DENSO ALT-PC001'] },
  'ALT-PC002': { brand: 'VALEO', applications: ['Peugeot 3008', 'Peugeot 5008', 'Citroën C4 Lounge'], specs: { amperage: 130, voltage: 14 }, equivalents: ['BOSCH ALT-PC002', 'DENSO ALT-PC002'] },
};

// ============================================================================
// MOTORES DE ARRANQUE / PARTIDA
// ============================================================================
export const STARTER_MOTORS = {
  // VW
  'SM-VW001': { brand: 'BOSCH', applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro', 'VW Up', 'VW EA111', 'VW EA211'], specs: { power: 1.1, teeth: 9 }, equivalents: ['VALEO SM-VW001', 'DENSO SM-VW001'] },
  'SM-VW002': { brand: 'BOSCH', applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus', 'VW Taos'], specs: { power: 1.4, teeth: 10 }, equivalents: ['VALEO SM-VW002', 'DENSO SM-VW002'] },
  
  // Fiat
  'SM-FI001': { brand: 'BOSCH', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo', 'Fiat Fire'], specs: { power: 1.0, teeth: 9 }, equivalents: ['VALEO SM-FI001', 'DENSO SM-FI001'] },
  'SM-FI002': { brand: 'BOSCH', applications: ['Fiat Cronos', 'Fiat Toro', 'Fiat Pulse', 'Fiat Fastback', 'Fiat E.torQ'], specs: { power: 1.4, teeth: 10 }, equivalents: ['VALEO SM-FI002', 'DENSO SM-FI002'] },
  
  // GM
  'SM-GM001': { brand: 'DELCO', applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin'], specs: { power: 1.2, teeth: 9 }, equivalents: ['BOSCH SM-GM001', 'VALEO SM-GM001'] },
  'SM-GM002': { brand: 'DELCO', applications: ['Chevrolet Cruze', 'Chevrolet Tracker', 'Chevrolet Equinox'], specs: { power: 1.5, teeth: 10 }, equivalents: ['BOSCH SM-GM002', 'VALEO SM-GM002'] },
  'SM-GM003': { brand: 'DELCO', applications: ['Chevrolet S10', 'Chevrolet Trailblazer'], specs: { power: 2.2, teeth: 11 }, equivalents: ['BOSCH SM-GM003', 'VALEO SM-GM003'] },
  
  // Honda
  'SM-HO001': { brand: 'DENSO', applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V'], specs: { power: 1.2, teeth: 9 }, equivalents: ['BOSCH SM-HO001', 'VALEO SM-HO001'] },
  'SM-HO002': { brand: 'DENSO', applications: ['Honda CR-V', 'Honda Accord'], specs: { power: 1.6, teeth: 10 }, equivalents: ['BOSCH SM-HO002', 'VALEO SM-HO002'] },
  
  // Toyota
  'SM-TO001': { brand: 'DENSO', applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios'], specs: { power: 1.2, teeth: 9 }, equivalents: ['BOSCH SM-TO001', 'VALEO SM-TO001'] },
  'SM-TO002': { brand: 'DENSO', applications: ['Toyota Hilux', 'Toyota SW4', 'Toyota RAV4'], specs: { power: 2.0, teeth: 11 }, equivalents: ['BOSCH SM-TO002', 'VALEO SM-TO002'] },
  
  // Hyundai/Kia
  'SM-HK001': { brand: 'VALEO', applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio', 'Kia Cerato'], specs: { power: 1.1, teeth: 9 }, equivalents: ['BOSCH SM-HK001', 'DENSO SM-HK001'] },
  'SM-HK002': { brand: 'VALEO', applications: ['Hyundai Tucson', 'Hyundai Santa Fe', 'Kia Sportage', 'Kia Sorento'], specs: { power: 1.6, teeth: 10 }, equivalents: ['BOSCH SM-HK002', 'DENSO SM-HK002'] },
  
  // Renault
  'SM-RE001': { brand: 'VALEO', applications: ['Renault Sandero', 'Renault Logan', 'Renault Kwid'], specs: { power: 1.0, teeth: 9 }, equivalents: ['BOSCH SM-RE001', 'DENSO SM-RE001'] },
  'SM-RE002': { brand: 'VALEO', applications: ['Renault Duster', 'Renault Captur', 'Renault Oroch'], specs: { power: 1.4, teeth: 10 }, equivalents: ['BOSCH SM-RE002', 'DENSO SM-RE002'] },
  
  // Ford
  'SM-FO001': { brand: 'BOSCH', applications: ['Ford Ka', 'Ford Fiesta', 'Ford EcoSport'], specs: { power: 1.1, teeth: 9 }, equivalents: ['VALEO SM-FO001', 'DENSO SM-FO001'] },
  'SM-FO002': { brand: 'BOSCH', applications: ['Ford Focus', 'Ford Fusion', 'Ford Ranger', 'Ford Territory'], specs: { power: 1.6, teeth: 10 }, equivalents: ['VALEO SM-FO002', 'DENSO SM-FO002'] },
  
  // Jeep
  'SM-JE001': { brand: 'BOSCH', applications: ['Jeep Renegade', 'Jeep Compass', 'Jeep Commander'], specs: { power: 1.4, teeth: 10 }, equivalents: ['VALEO SM-JE001', 'DENSO SM-JE001'] },
  
  // Nissan
  'SM-NI001': { brand: 'HITACHI', applications: ['Nissan March', 'Nissan Versa', 'Nissan Kicks', 'Nissan Sentra'], specs: { power: 1.2, teeth: 9 }, equivalents: ['BOSCH SM-NI001', 'VALEO SM-NI001'] },
  'SM-NI002': { brand: 'HITACHI', applications: ['Nissan Frontier', 'Nissan X-Trail'], specs: { power: 2.0, teeth: 11 }, equivalents: ['BOSCH SM-NI002', 'VALEO SM-NI002'] },
  
  // Mitsubishi
  'SM-MI001': { brand: 'MITSUBISHI', applications: ['Mitsubishi ASX', 'Mitsubishi Outlander', 'Mitsubishi Eclipse Cross'], specs: { power: 1.4, teeth: 10 }, equivalents: ['BOSCH SM-MI001', 'VALEO SM-MI001'] },
  'SM-MI002': { brand: 'MITSUBISHI', applications: ['Mitsubishi L200 Triton', 'Mitsubishi Pajero', 'Mitsubishi Pajero Sport'], specs: { power: 2.5, teeth: 12 }, equivalents: ['BOSCH SM-MI002', 'VALEO SM-MI002'] },
};

// ============================================================================
// COXINS DO MOTOR
// ============================================================================
export const ENGINE_MOUNTS = {
  // VW
  'EM-VW001': { brand: 'SAMPEL', applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro'], position: 'front', specs: { type: 'hydraulic' }, equivalents: ['AXIOS EM-VW001', 'COFAP EM-VW001'] },
  'EM-VW002': { brand: 'SAMPEL', applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro'], position: 'rear', specs: { type: 'rubber' }, equivalents: ['AXIOS EM-VW002', 'COFAP EM-VW002'] },
  'EM-VW003': { brand: 'SAMPEL', applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus'], position: 'front', specs: { type: 'hydraulic' }, equivalents: ['AXIOS EM-VW003', 'COFAP EM-VW003'] },
  
  // Fiat
  'EM-FI001': { brand: 'SAMPEL', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo'], position: 'front', specs: { type: 'hydraulic' }, equivalents: ['AXIOS EM-FI001', 'COFAP EM-FI001'] },
  'EM-FI002': { brand: 'SAMPEL', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo'], position: 'rear', specs: { type: 'rubber' }, equivalents: ['AXIOS EM-FI002', 'COFAP EM-FI002'] },
  
  // GM
  'EM-GM001': { brand: 'SAMPEL', applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin'], position: 'front', specs: { type: 'hydraulic' }, equivalents: ['AXIOS EM-GM001', 'COFAP EM-GM001'] },
  'EM-GM002': { brand: 'SAMPEL', applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin'], position: 'rear', specs: { type: 'rubber' }, equivalents: ['AXIOS EM-GM002', 'COFAP EM-GM002'] },
  
  // Honda
  'EM-HO001': { brand: 'SAMPEL', applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V'], position: 'front', specs: { type: 'hydraulic' }, equivalents: ['AXIOS EM-HO001', 'COFAP EM-HO001'] },
  
  // Toyota
  'EM-TO001': { brand: 'SAMPEL', applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios'], position: 'front', specs: { type: 'hydraulic' }, equivalents: ['AXIOS EM-TO001', 'COFAP EM-TO001'] },
  
  // Hyundai/Kia
  'EM-HK001': { brand: 'SAMPEL', applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio', 'Kia Cerato'], position: 'front', specs: { type: 'hydraulic' }, equivalents: ['AXIOS EM-HK001', 'COFAP EM-HK001'] },
  
  // Renault
  'EM-RE001': { brand: 'SAMPEL', applications: ['Renault Sandero', 'Renault Logan', 'Renault Duster', 'Renault Captur', 'Renault Kwid'], position: 'front', specs: { type: 'hydraulic' }, equivalents: ['AXIOS EM-RE001', 'COFAP EM-RE001'] },
  
  // Ford
  'EM-FO001': { brand: 'SAMPEL', applications: ['Ford Ka', 'Ford Fiesta', 'Ford EcoSport', 'Ford Focus'], position: 'front', specs: { type: 'hydraulic' }, equivalents: ['AXIOS EM-FO001', 'COFAP EM-FO001'] },
  
  // Jeep
  'EM-JE001': { brand: 'SAMPEL', applications: ['Jeep Renegade', 'Jeep Compass', 'Fiat Toro'], position: 'front', specs: { type: 'hydraulic' }, equivalents: ['AXIOS EM-JE001', 'COFAP EM-JE001'] },
};


// ============================================================================
// BUCHAS DE SUSPENSÃO
// ============================================================================
export const SUSPENSION_BUSHINGS = {
  // VW
  'SB-VW001': { brand: 'AXIOS', applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro'], position: 'front_lower', specs: { material: 'polyurethane' }, equivalents: ['SAMPEL SB-VW001', 'COFAP SB-VW001'] },
  'SB-VW002': { brand: 'AXIOS', applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro'], position: 'rear', specs: { material: 'rubber' }, equivalents: ['SAMPEL SB-VW002', 'COFAP SB-VW002'] },
  'SB-VW003': { brand: 'AXIOS', applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus'], position: 'front_lower', specs: { material: 'polyurethane' }, equivalents: ['SAMPEL SB-VW003', 'COFAP SB-VW003'] },
  
  // Fiat
  'SB-FI001': { brand: 'AXIOS', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo'], position: 'front_lower', specs: { material: 'polyurethane' }, equivalents: ['SAMPEL SB-FI001', 'COFAP SB-FI001'] },
  'SB-FI002': { brand: 'AXIOS', applications: ['Fiat Cronos', 'Fiat Toro', 'Fiat Pulse', 'Fiat Fastback'], position: 'front_lower', specs: { material: 'polyurethane' }, equivalents: ['SAMPEL SB-FI002', 'COFAP SB-FI002'] },
  
  // GM
  'SB-GM001': { brand: 'AXIOS', applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin'], position: 'front_lower', specs: { material: 'polyurethane' }, equivalents: ['SAMPEL SB-GM001', 'COFAP SB-GM001'] },
  'SB-GM002': { brand: 'AXIOS', applications: ['Chevrolet Cruze', 'Chevrolet Tracker', 'Chevrolet Equinox'], position: 'front_lower', specs: { material: 'polyurethane' }, equivalents: ['SAMPEL SB-GM002', 'COFAP SB-GM002'] },
  
  // Honda
  'SB-HO001': { brand: 'AXIOS', applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V'], position: 'front_lower', specs: { material: 'polyurethane' }, equivalents: ['SAMPEL SB-HO001', 'COFAP SB-HO001'] },
  
  // Toyota
  'SB-TO001': { brand: 'AXIOS', applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios'], position: 'front_lower', specs: { material: 'polyurethane' }, equivalents: ['SAMPEL SB-TO001', 'COFAP SB-TO001'] },
  
  // Hyundai/Kia
  'SB-HK001': { brand: 'AXIOS', applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio', 'Kia Cerato'], position: 'front_lower', specs: { material: 'polyurethane' }, equivalents: ['SAMPEL SB-HK001', 'COFAP SB-HK001'] },
  
  // Renault
  'SB-RE001': { brand: 'AXIOS', applications: ['Renault Sandero', 'Renault Logan', 'Renault Duster', 'Renault Captur', 'Renault Kwid'], position: 'front_lower', specs: { material: 'polyurethane' }, equivalents: ['SAMPEL SB-RE001', 'COFAP SB-RE001'] },
  
  // Ford
  'SB-FO001': { brand: 'AXIOS', applications: ['Ford Ka', 'Ford Fiesta', 'Ford EcoSport', 'Ford Focus'], position: 'front_lower', specs: { material: 'polyurethane' }, equivalents: ['SAMPEL SB-FO001', 'COFAP SB-FO001'] },
  
  // Jeep
  'SB-JE001': { brand: 'AXIOS', applications: ['Jeep Renegade', 'Jeep Compass', 'Fiat Toro'], position: 'front_lower', specs: { material: 'polyurethane' }, equivalents: ['SAMPEL SB-JE001', 'COFAP SB-JE001'] },
};

// ============================================================================
// PIVÔS DE SUSPENSÃO
// ============================================================================
export const BALL_JOINTS = {
  // VW
  'BJ-VW001': { brand: 'NAKATA', applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro'], position: 'lower', specs: { type: 'press-fit' }, equivalents: ['VIEMAR BJ-VW001', 'PERFECT BJ-VW001'] },
  'BJ-VW002': { brand: 'NAKATA', applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus'], position: 'lower', specs: { type: 'bolt-on' }, equivalents: ['VIEMAR BJ-VW002', 'PERFECT BJ-VW002'] },
  
  // Fiat
  'BJ-FI001': { brand: 'NAKATA', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo'], position: 'lower', specs: { type: 'press-fit' }, equivalents: ['VIEMAR BJ-FI001', 'PERFECT BJ-FI001'] },
  'BJ-FI002': { brand: 'NAKATA', applications: ['Fiat Cronos', 'Fiat Toro', 'Fiat Pulse', 'Fiat Fastback'], position: 'lower', specs: { type: 'bolt-on' }, equivalents: ['VIEMAR BJ-FI002', 'PERFECT BJ-FI002'] },
  
  // GM
  'BJ-GM001': { brand: 'NAKATA', applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin'], position: 'lower', specs: { type: 'bolt-on' }, equivalents: ['VIEMAR BJ-GM001', 'PERFECT BJ-GM001'] },
  'BJ-GM002': { brand: 'NAKATA', applications: ['Chevrolet Cruze', 'Chevrolet Tracker', 'Chevrolet Equinox'], position: 'lower', specs: { type: 'bolt-on' }, equivalents: ['VIEMAR BJ-GM002', 'PERFECT BJ-GM002'] },
  
  // Honda
  'BJ-HO001': { brand: 'NAKATA', applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V'], position: 'lower', specs: { type: 'bolt-on' }, equivalents: ['VIEMAR BJ-HO001', 'PERFECT BJ-HO001'] },
  
  // Toyota
  'BJ-TO001': { brand: 'NAKATA', applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios'], position: 'lower', specs: { type: 'bolt-on' }, equivalents: ['VIEMAR BJ-TO001', 'PERFECT BJ-TO001'] },
  
  // Hyundai/Kia
  'BJ-HK001': { brand: 'NAKATA', applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio', 'Kia Cerato'], position: 'lower', specs: { type: 'bolt-on' }, equivalents: ['VIEMAR BJ-HK001', 'PERFECT BJ-HK001'] },
  
  // Renault
  'BJ-RE001': { brand: 'NAKATA', applications: ['Renault Sandero', 'Renault Logan', 'Renault Duster', 'Renault Captur', 'Renault Kwid'], position: 'lower', specs: { type: 'bolt-on' }, equivalents: ['VIEMAR BJ-RE001', 'PERFECT BJ-RE001'] },
  
  // Ford
  'BJ-FO001': { brand: 'NAKATA', applications: ['Ford Ka', 'Ford Fiesta', 'Ford EcoSport', 'Ford Focus'], position: 'lower', specs: { type: 'bolt-on' }, equivalents: ['VIEMAR BJ-FO001', 'PERFECT BJ-FO001'] },
  
  // Jeep
  'BJ-JE001': { brand: 'NAKATA', applications: ['Jeep Renegade', 'Jeep Compass', 'Fiat Toro'], position: 'lower', specs: { type: 'bolt-on' }, equivalents: ['VIEMAR BJ-JE001', 'PERFECT BJ-JE001'] },
};

// ============================================================================
// TERMINAIS DE DIREÇÃO
// ============================================================================
export const TIE_ROD_ENDS = {
  // VW
  'TR-VW001': { brand: 'NAKATA', applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro'], position: 'outer', specs: { thread: 'M14x1.5' }, equivalents: ['VIEMAR TR-VW001', 'PERFECT TR-VW001'] },
  'TR-VW002': { brand: 'NAKATA', applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus'], position: 'outer', specs: { thread: 'M14x1.5' }, equivalents: ['VIEMAR TR-VW002', 'PERFECT TR-VW002'] },
  
  // Fiat
  'TR-FI001': { brand: 'NAKATA', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo'], position: 'outer', specs: { thread: 'M12x1.25' }, equivalents: ['VIEMAR TR-FI001', 'PERFECT TR-FI001'] },
  'TR-FI002': { brand: 'NAKATA', applications: ['Fiat Cronos', 'Fiat Toro', 'Fiat Pulse', 'Fiat Fastback'], position: 'outer', specs: { thread: 'M14x1.5' }, equivalents: ['VIEMAR TR-FI002', 'PERFECT TR-FI002'] },
  
  // GM
  'TR-GM001': { brand: 'NAKATA', applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin'], position: 'outer', specs: { thread: 'M14x1.5' }, equivalents: ['VIEMAR TR-GM001', 'PERFECT TR-GM001'] },
  'TR-GM002': { brand: 'NAKATA', applications: ['Chevrolet Cruze', 'Chevrolet Tracker', 'Chevrolet Equinox'], position: 'outer', specs: { thread: 'M14x1.5' }, equivalents: ['VIEMAR TR-GM002', 'PERFECT TR-GM002'] },
  
  // Honda
  'TR-HO001': { brand: 'NAKATA', applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V'], position: 'outer', specs: { thread: 'M14x1.5' }, equivalents: ['VIEMAR TR-HO001', 'PERFECT TR-HO001'] },
  
  // Toyota
  'TR-TO001': { brand: 'NAKATA', applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios'], position: 'outer', specs: { thread: 'M14x1.5' }, equivalents: ['VIEMAR TR-TO001', 'PERFECT TR-TO001'] },
  
  // Hyundai/Kia
  'TR-HK001': { brand: 'NAKATA', applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio', 'Kia Cerato'], position: 'outer', specs: { thread: 'M14x1.5' }, equivalents: ['VIEMAR TR-HK001', 'PERFECT TR-HK001'] },
  
  // Renault
  'TR-RE001': { brand: 'NAKATA', applications: ['Renault Sandero', 'Renault Logan', 'Renault Duster', 'Renault Captur', 'Renault Kwid'], position: 'outer', specs: { thread: 'M14x1.5' }, equivalents: ['VIEMAR TR-RE001', 'PERFECT TR-RE001'] },
  
  // Ford
  'TR-FO001': { brand: 'NAKATA', applications: ['Ford Ka', 'Ford Fiesta', 'Ford EcoSport', 'Ford Focus'], position: 'outer', specs: { thread: 'M14x1.5' }, equivalents: ['VIEMAR TR-FO001', 'PERFECT TR-FO001'] },
  
  // Jeep
  'TR-JE001': { brand: 'NAKATA', applications: ['Jeep Renegade', 'Jeep Compass', 'Fiat Toro'], position: 'outer', specs: { thread: 'M14x1.5' }, equivalents: ['VIEMAR TR-JE001', 'PERFECT TR-JE001'] },
};

// ============================================================================
// FLUIDOS E LUBRIFICANTES ADICIONAIS
// ============================================================================
export const FLUIDS = {
  // Fluido de Freio
  'DOT4': { brand: 'BOSCH', applications: ['VW', 'Fiat', 'GM', 'Honda', 'Toyota', 'Hyundai', 'Kia', 'Renault', 'Ford', 'Jeep', 'Nissan', 'Mitsubishi', 'Peugeot', 'Citroën', 'BMW', 'Mercedes', 'Audi'], specs: { type: 'DOT 4', boilingPoint: 230 }, equivalents: ['CASTROL DOT4', 'MOBIL DOT4', 'WAGNER DOT4'] },
  'DOT5.1': { brand: 'BOSCH', applications: ['BMW', 'Mercedes', 'Audi', 'Porsche', 'Volvo', 'Land Rover', 'Jaguar'], specs: { type: 'DOT 5.1', boilingPoint: 260 }, equivalents: ['CASTROL DOT5.1', 'MOBIL DOT5.1'] },
  
  // Fluido de Direção Hidráulica
  'ATF-DEXRON': { brand: 'MOBIL', applications: ['GM', 'Ford', 'Chrysler', 'Jeep', 'Dodge'], specs: { type: 'ATF Dexron III' }, equivalents: ['CASTROL ATF', 'SHELL ATF', 'PETRONAS ATF'] },
  'ATF-MERCON': { brand: 'MOTORCRAFT', applications: ['Ford', 'Lincoln', 'Mercury'], specs: { type: 'Mercon V' }, equivalents: ['MOBIL ATF', 'CASTROL ATF'] },
  'CHF11S': { brand: 'PENTOSIN', applications: ['VW', 'Audi', 'BMW', 'Mercedes', 'Porsche', 'Volvo'], specs: { type: 'Synthetic' }, equivalents: ['FEBI CHF11S', 'SWAG CHF11S'] },
  
  // Líquido de Arrefecimento
  'COOLANT-G12': { brand: 'VW', applications: ['VW', 'Audi', 'Seat', 'Skoda'], specs: { type: 'G12/G12+', color: 'pink' }, equivalents: ['BASF G12', 'ZEREX G12'] },
  'COOLANT-G13': { brand: 'VW', applications: ['VW', 'Audi', 'Seat', 'Skoda'], specs: { type: 'G13', color: 'purple' }, equivalents: ['BASF G13', 'ZEREX G13'] },
  'COOLANT-OAT': { brand: 'PRESTONE', applications: ['GM', 'Ford', 'Chrysler', 'Honda', 'Toyota', 'Hyundai', 'Kia'], specs: { type: 'OAT', color: 'orange' }, equivalents: ['DEXCOOL', 'ZEREX OAT'] },
  'COOLANT-HOAT': { brand: 'PRESTONE', applications: ['Ford', 'Chrysler', 'Mercedes', 'BMW'], specs: { type: 'HOAT', color: 'yellow' }, equivalents: ['ZEREX HOAT', 'PEAK HOAT'] },
  
  // Óleo de Câmbio Manual
  'MTF-75W90': { brand: 'MOBIL', applications: ['VW', 'Fiat', 'GM', 'Honda', 'Toyota', 'Hyundai', 'Kia', 'Renault', 'Ford'], specs: { viscosity: '75W-90', type: 'GL-4' }, equivalents: ['CASTROL 75W90', 'SHELL 75W90', 'PETRONAS 75W90'] },
  'MTF-75W85': { brand: 'ELF', applications: ['Renault', 'Nissan', 'Dacia'], specs: { viscosity: '75W-85', type: 'GL-4+' }, equivalents: ['TOTAL 75W85', 'MOBIL 75W85'] },
  
  // Óleo de Câmbio Automático
  'ATF-WS': { brand: 'TOYOTA', applications: ['Toyota', 'Lexus'], specs: { type: 'WS' }, equivalents: ['AISIN ATF-WS', 'IDEMITSU ATF-WS'] },
  'ATF-DW1': { brand: 'HONDA', applications: ['Honda', 'Acura'], specs: { type: 'DW-1' }, equivalents: ['AISIN ATF-DW1', 'IDEMITSU ATF-DW1'] },
  'ATF-SP4': { brand: 'HYUNDAI', applications: ['Hyundai', 'Kia'], specs: { type: 'SP-IV' }, equivalents: ['AISIN ATF-SP4', 'IDEMITSU ATF-SP4'] },
};


// ============================================================================
// EMBREAGEM - KITS COMPLETOS
// ============================================================================
export const CLUTCH_KITS = {
  // VW
  'CK-VW001': { brand: 'LUK', applications: ['VW Gol 1.0', 'VW Gol 1.6', 'VW Voyage', 'VW Fox', 'VW Saveiro', 'VW Up'], specs: { diameter: 200, type: 'organic' }, equivalents: ['SACHS CK-VW001', 'VALEO CK-VW001'] },
  'CK-VW002': { brand: 'LUK', applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus'], specs: { diameter: 228, type: 'organic' }, equivalents: ['SACHS CK-VW002', 'VALEO CK-VW002'] },
  'CK-VW003': { brand: 'LUK', applications: ['VW Amarok', 'VW Tiguan', 'VW Jetta', 'VW Passat'], specs: { diameter: 240, type: 'organic' }, equivalents: ['SACHS CK-VW003', 'VALEO CK-VW003'] },
  
  // Fiat
  'CK-FI001': { brand: 'LUK', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo'], specs: { diameter: 190, type: 'organic' }, equivalents: ['SACHS CK-FI001', 'VALEO CK-FI001'] },
  'CK-FI002': { brand: 'LUK', applications: ['Fiat Cronos', 'Fiat Toro', 'Fiat Pulse', 'Fiat Fastback'], specs: { diameter: 228, type: 'organic' }, equivalents: ['SACHS CK-FI002', 'VALEO CK-FI002'] },
  
  // GM
  'CK-GM001': { brand: 'LUK', applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin'], specs: { diameter: 215, type: 'organic' }, equivalents: ['SACHS CK-GM001', 'VALEO CK-GM001'] },
  'CK-GM002': { brand: 'LUK', applications: ['Chevrolet Cruze', 'Chevrolet Tracker'], specs: { diameter: 228, type: 'organic' }, equivalents: ['SACHS CK-GM002', 'VALEO CK-GM002'] },
  'CK-GM003': { brand: 'LUK', applications: ['Chevrolet S10', 'Chevrolet Trailblazer'], specs: { diameter: 275, type: 'ceramic' }, equivalents: ['SACHS CK-GM003', 'VALEO CK-GM003'] },
  
  // Honda
  'CK-HO001': { brand: 'EXEDY', applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V'], specs: { diameter: 212, type: 'organic' }, equivalents: ['LUK CK-HO001', 'VALEO CK-HO001'] },
  'CK-HO002': { brand: 'EXEDY', applications: ['Honda CR-V', 'Honda Accord'], specs: { diameter: 225, type: 'organic' }, equivalents: ['LUK CK-HO002', 'VALEO CK-HO002'] },
  
  // Toyota
  'CK-TO001': { brand: 'AISIN', applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios'], specs: { diameter: 215, type: 'organic' }, equivalents: ['LUK CK-TO001', 'VALEO CK-TO001'] },
  'CK-TO002': { brand: 'AISIN', applications: ['Toyota Hilux', 'Toyota SW4'], specs: { diameter: 275, type: 'ceramic' }, equivalents: ['LUK CK-TO002', 'VALEO CK-TO002'] },
  
  // Hyundai/Kia
  'CK-HK001': { brand: 'VALEO', applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio', 'Kia Cerato'], specs: { diameter: 215, type: 'organic' }, equivalents: ['LUK CK-HK001', 'SACHS CK-HK001'] },
  'CK-HK002': { brand: 'VALEO', applications: ['Hyundai Tucson', 'Kia Sportage'], specs: { diameter: 240, type: 'organic' }, equivalents: ['LUK CK-HK002', 'SACHS CK-HK002'] },
  
  // Renault
  'CK-RE001': { brand: 'VALEO', applications: ['Renault Sandero', 'Renault Logan', 'Renault Kwid'], specs: { diameter: 200, type: 'organic' }, equivalents: ['LUK CK-RE001', 'SACHS CK-RE001'] },
  'CK-RE002': { brand: 'VALEO', applications: ['Renault Duster', 'Renault Captur', 'Renault Oroch'], specs: { diameter: 228, type: 'organic' }, equivalents: ['LUK CK-RE002', 'SACHS CK-RE002'] },
  
  // Ford
  'CK-FO001': { brand: 'LUK', applications: ['Ford Ka', 'Ford Fiesta', 'Ford EcoSport'], specs: { diameter: 200, type: 'organic' }, equivalents: ['SACHS CK-FO001', 'VALEO CK-FO001'] },
  'CK-FO002': { brand: 'LUK', applications: ['Ford Focus', 'Ford Fusion'], specs: { diameter: 228, type: 'organic' }, equivalents: ['SACHS CK-FO002', 'VALEO CK-FO002'] },
  'CK-FO003': { brand: 'LUK', applications: ['Ford Ranger'], specs: { diameter: 275, type: 'ceramic' }, equivalents: ['SACHS CK-FO003', 'VALEO CK-FO003'] },
  
  // Jeep
  'CK-JE001': { brand: 'LUK', applications: ['Jeep Renegade', 'Jeep Compass'], specs: { diameter: 228, type: 'organic' }, equivalents: ['SACHS CK-JE001', 'VALEO CK-JE001'] },
  
  // Nissan
  'CK-NI001': { brand: 'EXEDY', applications: ['Nissan March', 'Nissan Versa', 'Nissan Kicks', 'Nissan Sentra'], specs: { diameter: 215, type: 'organic' }, equivalents: ['LUK CK-NI001', 'VALEO CK-NI001'] },
  'CK-NI002': { brand: 'EXEDY', applications: ['Nissan Frontier'], specs: { diameter: 275, type: 'ceramic' }, equivalents: ['LUK CK-NI002', 'VALEO CK-NI002'] },
  
  // Mitsubishi
  'CK-MI001': { brand: 'EXEDY', applications: ['Mitsubishi ASX', 'Mitsubishi Outlander'], specs: { diameter: 228, type: 'organic' }, equivalents: ['LUK CK-MI001', 'VALEO CK-MI001'] },
  'CK-MI002': { brand: 'EXEDY', applications: ['Mitsubishi L200 Triton', 'Mitsubishi Pajero'], specs: { diameter: 275, type: 'ceramic' }, equivalents: ['LUK CK-MI002', 'VALEO CK-MI002'] },
};

// ============================================================================
// ROLAMENTOS DE RODA
// ============================================================================
export const WHEEL_BEARINGS = {
  // VW
  'WB-VW001': { brand: 'SKF', applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro'], position: 'front', specs: { type: 'hub_unit', abs: true }, equivalents: ['FAG WB-VW001', 'NSK WB-VW001', 'TIMKEN WB-VW001'] },
  'WB-VW002': { brand: 'SKF', applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro'], position: 'rear', specs: { type: 'tapered', abs: false }, equivalents: ['FAG WB-VW002', 'NSK WB-VW002', 'TIMKEN WB-VW002'] },
  'WB-VW003': { brand: 'SKF', applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus'], position: 'front', specs: { type: 'hub_unit', abs: true }, equivalents: ['FAG WB-VW003', 'NSK WB-VW003', 'TIMKEN WB-VW003'] },
  
  // Fiat
  'WB-FI001': { brand: 'SKF', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo'], position: 'front', specs: { type: 'hub_unit', abs: true }, equivalents: ['FAG WB-FI001', 'NSK WB-FI001', 'TIMKEN WB-FI001'] },
  'WB-FI002': { brand: 'SKF', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo'], position: 'rear', specs: { type: 'tapered', abs: false }, equivalents: ['FAG WB-FI002', 'NSK WB-FI002', 'TIMKEN WB-FI002'] },
  'WB-FI003': { brand: 'SKF', applications: ['Fiat Cronos', 'Fiat Toro', 'Fiat Pulse', 'Fiat Fastback'], position: 'front', specs: { type: 'hub_unit', abs: true }, equivalents: ['FAG WB-FI003', 'NSK WB-FI003', 'TIMKEN WB-FI003'] },
  
  // GM
  'WB-GM001': { brand: 'SKF', applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin'], position: 'front', specs: { type: 'hub_unit', abs: true }, equivalents: ['FAG WB-GM001', 'NSK WB-GM001', 'TIMKEN WB-GM001'] },
  'WB-GM002': { brand: 'SKF', applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin'], position: 'rear', specs: { type: 'hub_unit', abs: true }, equivalents: ['FAG WB-GM002', 'NSK WB-GM002', 'TIMKEN WB-GM002'] },
  'WB-GM003': { brand: 'SKF', applications: ['Chevrolet Cruze', 'Chevrolet Tracker', 'Chevrolet Equinox'], position: 'front', specs: { type: 'hub_unit', abs: true }, equivalents: ['FAG WB-GM003', 'NSK WB-GM003', 'TIMKEN WB-GM003'] },
  
  // Honda
  'WB-HO001': { brand: 'NSK', applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V'], position: 'front', specs: { type: 'hub_unit', abs: true }, equivalents: ['SKF WB-HO001', 'FAG WB-HO001', 'TIMKEN WB-HO001'] },
  'WB-HO002': { brand: 'NSK', applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V'], position: 'rear', specs: { type: 'hub_unit', abs: true }, equivalents: ['SKF WB-HO002', 'FAG WB-HO002', 'TIMKEN WB-HO002'] },
  
  // Toyota
  'WB-TO001': { brand: 'NSK', applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios'], position: 'front', specs: { type: 'hub_unit', abs: true }, equivalents: ['SKF WB-TO001', 'FAG WB-TO001', 'TIMKEN WB-TO001'] },
  'WB-TO002': { brand: 'NSK', applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios'], position: 'rear', specs: { type: 'hub_unit', abs: true }, equivalents: ['SKF WB-TO002', 'FAG WB-TO002', 'TIMKEN WB-TO002'] },
  'WB-TO003': { brand: 'NSK', applications: ['Toyota Hilux', 'Toyota SW4'], position: 'front', specs: { type: 'hub_unit', abs: true }, equivalents: ['SKF WB-TO003', 'FAG WB-TO003', 'TIMKEN WB-TO003'] },
  
  // Hyundai/Kia
  'WB-HK001': { brand: 'ILJIN', applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio', 'Kia Cerato'], position: 'front', specs: { type: 'hub_unit', abs: true }, equivalents: ['SKF WB-HK001', 'FAG WB-HK001', 'NSK WB-HK001'] },
  'WB-HK002': { brand: 'ILJIN', applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio', 'Kia Cerato'], position: 'rear', specs: { type: 'hub_unit', abs: true }, equivalents: ['SKF WB-HK002', 'FAG WB-HK002', 'NSK WB-HK002'] },
  
  // Renault
  'WB-RE001': { brand: 'SNR', applications: ['Renault Sandero', 'Renault Logan', 'Renault Duster', 'Renault Captur', 'Renault Kwid'], position: 'front', specs: { type: 'hub_unit', abs: true }, equivalents: ['SKF WB-RE001', 'FAG WB-RE001', 'NSK WB-RE001'] },
  'WB-RE002': { brand: 'SNR', applications: ['Renault Sandero', 'Renault Logan', 'Renault Duster', 'Renault Captur', 'Renault Kwid'], position: 'rear', specs: { type: 'tapered', abs: false }, equivalents: ['SKF WB-RE002', 'FAG WB-RE002', 'NSK WB-RE002'] },
  
  // Ford
  'WB-FO001': { brand: 'SKF', applications: ['Ford Ka', 'Ford Fiesta', 'Ford EcoSport', 'Ford Focus'], position: 'front', specs: { type: 'hub_unit', abs: true }, equivalents: ['FAG WB-FO001', 'NSK WB-FO001', 'TIMKEN WB-FO001'] },
  'WB-FO002': { brand: 'SKF', applications: ['Ford Ka', 'Ford Fiesta', 'Ford EcoSport', 'Ford Focus'], position: 'rear', specs: { type: 'hub_unit', abs: true }, equivalents: ['FAG WB-FO002', 'NSK WB-FO002', 'TIMKEN WB-FO002'] },
  
  // Jeep
  'WB-JE001': { brand: 'SKF', applications: ['Jeep Renegade', 'Jeep Compass', 'Fiat Toro'], position: 'front', specs: { type: 'hub_unit', abs: true }, equivalents: ['FAG WB-JE001', 'NSK WB-JE001', 'TIMKEN WB-JE001'] },
  'WB-JE002': { brand: 'SKF', applications: ['Jeep Renegade', 'Jeep Compass', 'Fiat Toro'], position: 'rear', specs: { type: 'hub_unit', abs: true }, equivalents: ['FAG WB-JE002', 'NSK WB-JE002', 'TIMKEN WB-JE002'] },
};

// ============================================================================
// JUNTAS HOMOCINÉTICAS
// ============================================================================
export const CV_JOINTS = {
  // VW
  'CV-VW001': { brand: 'GKN', applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro'], position: 'outer', specs: { splines: 25, abs: true }, equivalents: ['SKF CV-VW001', 'NAKATA CV-VW001'] },
  'CV-VW002': { brand: 'GKN', applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro'], position: 'inner', specs: { splines: 25, type: 'tripod' }, equivalents: ['SKF CV-VW002', 'NAKATA CV-VW002'] },
  'CV-VW003': { brand: 'GKN', applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus'], position: 'outer', specs: { splines: 27, abs: true }, equivalents: ['SKF CV-VW003', 'NAKATA CV-VW003'] },
  
  // Fiat
  'CV-FI001': { brand: 'GKN', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo'], position: 'outer', specs: { splines: 22, abs: true }, equivalents: ['SKF CV-FI001', 'NAKATA CV-FI001'] },
  'CV-FI002': { brand: 'GKN', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo'], position: 'inner', specs: { splines: 22, type: 'tripod' }, equivalents: ['SKF CV-FI002', 'NAKATA CV-FI002'] },
  'CV-FI003': { brand: 'GKN', applications: ['Fiat Cronos', 'Fiat Toro', 'Fiat Pulse', 'Fiat Fastback'], position: 'outer', specs: { splines: 25, abs: true }, equivalents: ['SKF CV-FI003', 'NAKATA CV-FI003'] },
  
  // GM
  'CV-GM001': { brand: 'GKN', applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin'], position: 'outer', specs: { splines: 25, abs: true }, equivalents: ['SKF CV-GM001', 'NAKATA CV-GM001'] },
  'CV-GM002': { brand: 'GKN', applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin'], position: 'inner', specs: { splines: 25, type: 'tripod' }, equivalents: ['SKF CV-GM002', 'NAKATA CV-GM002'] },
  'CV-GM003': { brand: 'GKN', applications: ['Chevrolet Cruze', 'Chevrolet Tracker', 'Chevrolet Equinox'], position: 'outer', specs: { splines: 27, abs: true }, equivalents: ['SKF CV-GM003', 'NAKATA CV-GM003'] },
  
  // Honda
  'CV-HO001': { brand: 'NTN', applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V'], position: 'outer', specs: { splines: 26, abs: true }, equivalents: ['GKN CV-HO001', 'SKF CV-HO001'] },
  'CV-HO002': { brand: 'NTN', applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V'], position: 'inner', specs: { splines: 26, type: 'tripod' }, equivalents: ['GKN CV-HO002', 'SKF CV-HO002'] },
  
  // Toyota
  'CV-TO001': { brand: 'NTN', applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios'], position: 'outer', specs: { splines: 25, abs: true }, equivalents: ['GKN CV-TO001', 'SKF CV-TO001'] },
  'CV-TO002': { brand: 'NTN', applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios'], position: 'inner', specs: { splines: 25, type: 'tripod' }, equivalents: ['GKN CV-TO002', 'SKF CV-TO002'] },
  
  // Hyundai/Kia
  'CV-HK001': { brand: 'GKN', applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio', 'Kia Cerato'], position: 'outer', specs: { splines: 25, abs: true }, equivalents: ['SKF CV-HK001', 'NAKATA CV-HK001'] },
  'CV-HK002': { brand: 'GKN', applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio', 'Kia Cerato'], position: 'inner', specs: { splines: 25, type: 'tripod' }, equivalents: ['SKF CV-HK002', 'NAKATA CV-HK002'] },
  
  // Renault
  'CV-RE001': { brand: 'GKN', applications: ['Renault Sandero', 'Renault Logan', 'Renault Duster', 'Renault Captur', 'Renault Kwid'], position: 'outer', specs: { splines: 21, abs: true }, equivalents: ['SKF CV-RE001', 'NAKATA CV-RE001'] },
  'CV-RE002': { brand: 'GKN', applications: ['Renault Sandero', 'Renault Logan', 'Renault Duster', 'Renault Captur', 'Renault Kwid'], position: 'inner', specs: { splines: 21, type: 'tripod' }, equivalents: ['SKF CV-RE002', 'NAKATA CV-RE002'] },
  
  // Ford
  'CV-FO001': { brand: 'GKN', applications: ['Ford Ka', 'Ford Fiesta', 'Ford EcoSport', 'Ford Focus'], position: 'outer', specs: { splines: 25, abs: true }, equivalents: ['SKF CV-FO001', 'NAKATA CV-FO001'] },
  'CV-FO002': { brand: 'GKN', applications: ['Ford Ka', 'Ford Fiesta', 'Ford EcoSport', 'Ford Focus'], position: 'inner', specs: { splines: 25, type: 'tripod' }, equivalents: ['SKF CV-FO002', 'NAKATA CV-FO002'] },
  
  // Jeep
  'CV-JE001': { brand: 'GKN', applications: ['Jeep Renegade', 'Jeep Compass', 'Fiat Toro'], position: 'outer', specs: { splines: 27, abs: true }, equivalents: ['SKF CV-JE001', 'NAKATA CV-JE001'] },
  'CV-JE002': { brand: 'GKN', applications: ['Jeep Renegade', 'Jeep Compass', 'Fiat Toro'], position: 'inner', specs: { splines: 27, type: 'tripod' }, equivalents: ['SKF CV-JE002', 'NAKATA CV-JE002'] },
};


// ============================================================================
// PEÇAS DE MOTOS - EXPANSÃO COMPLETA
// ============================================================================
export const MOTORCYCLE_PARTS_EXTENDED = {
  // Pneus Dianteiros
  'TIRE-F-110/70-17': { brand: 'PIRELLI', applications: ['Honda CB300', 'Honda CB500', 'Yamaha MT-03', 'Yamaha YZF-R3', 'Kawasaki Ninja 300', 'Kawasaki Z300', 'Kawasaki Ninja 400', 'Kawasaki Z400'], specs: { width: 110, profile: 70, rim: 17, type: 'sport' }, equivalents: ['MICHELIN 110/70-17', 'METZELER 110/70-17', 'BRIDGESTONE 110/70-17'] },
  'TIRE-F-120/70-17': { brand: 'PIRELLI', applications: ['Honda CBR600', 'Honda CBR1000', 'Yamaha YZF-R1', 'Yamaha YZF-R6', 'Kawasaki ZX-6R', 'Kawasaki ZX-10R', 'Suzuki GSX-R600', 'Suzuki GSX-R1000', 'BMW S1000RR', 'Ducati Panigale'], specs: { width: 120, profile: 70, rim: 17, type: 'supersport' }, equivalents: ['MICHELIN 120/70-17', 'METZELER 120/70-17', 'BRIDGESTONE 120/70-17'] },
  'TIRE-F-90/90-21': { brand: 'PIRELLI', applications: ['Honda XRE300', 'Honda Bros', 'Yamaha Crosser', 'Yamaha Lander', 'Honda XRE190'], specs: { width: 90, profile: 90, rim: 21, type: 'trail' }, equivalents: ['MICHELIN 90/90-21', 'METZELER 90/90-21', 'RINALDI 90/90-21'] },
  'TIRE-F-2.75-18': { brand: 'PIRELLI', applications: ['Honda CG125', 'Honda CG150', 'Honda CG160', 'Honda Biz', 'Yamaha Factor', 'Yamaha YBR'], specs: { width: 2.75, rim: 18, type: 'street' }, equivalents: ['MICHELIN 2.75-18', 'RINALDI 2.75-18', 'LEVORIN 2.75-18'] },
  
  // Pneus Traseiros
  'TIRE-R-140/70-17': { brand: 'PIRELLI', applications: ['Honda CB300', 'Honda CB500', 'Yamaha MT-03', 'Yamaha YZF-R3', 'Kawasaki Ninja 300', 'Kawasaki Z300'], specs: { width: 140, profile: 70, rim: 17, type: 'sport' }, equivalents: ['MICHELIN 140/70-17', 'METZELER 140/70-17', 'BRIDGESTONE 140/70-17'] },
  'TIRE-R-150/60-17': { brand: 'PIRELLI', applications: ['Kawasaki Ninja 400', 'Kawasaki Z400', 'Honda CB500', 'Yamaha MT-07'], specs: { width: 150, profile: 60, rim: 17, type: 'sport' }, equivalents: ['MICHELIN 150/60-17', 'METZELER 150/60-17', 'BRIDGESTONE 150/60-17'] },
  'TIRE-R-180/55-17': { brand: 'PIRELLI', applications: ['Honda CBR600', 'Yamaha YZF-R6', 'Kawasaki ZX-6R', 'Suzuki GSX-R600', 'Yamaha MT-09'], specs: { width: 180, profile: 55, rim: 17, type: 'supersport' }, equivalents: ['MICHELIN 180/55-17', 'METZELER 180/55-17', 'BRIDGESTONE 180/55-17'] },
  'TIRE-R-190/55-17': { brand: 'PIRELLI', applications: ['Honda CBR1000', 'Yamaha YZF-R1', 'Kawasaki ZX-10R', 'Suzuki GSX-R1000', 'BMW S1000RR', 'Ducati Panigale'], specs: { width: 190, profile: 55, rim: 17, type: 'supersport' }, equivalents: ['MICHELIN 190/55-17', 'METZELER 190/55-17', 'BRIDGESTONE 190/55-17'] },
  'TIRE-R-120/80-18': { brand: 'PIRELLI', applications: ['Honda XRE300', 'Honda Bros', 'Yamaha Crosser', 'Yamaha Lander', 'Honda XRE190'], specs: { width: 120, profile: 80, rim: 18, type: 'trail' }, equivalents: ['MICHELIN 120/80-18', 'METZELER 120/80-18', 'RINALDI 120/80-18'] },
  'TIRE-R-90/90-18': { brand: 'PIRELLI', applications: ['Honda CG125', 'Honda CG150', 'Honda CG160', 'Honda Biz', 'Yamaha Factor', 'Yamaha YBR'], specs: { width: 90, profile: 90, rim: 18, type: 'street' }, equivalents: ['MICHELIN 90/90-18', 'RINALDI 90/90-18', 'LEVORIN 90/90-18'] },
  
  // Câmaras de Ar
  'TUBE-2.75-18': { brand: 'PIRELLI', applications: ['Honda CG125', 'Honda CG150', 'Honda CG160', 'Honda Biz', 'Yamaha Factor', 'Yamaha YBR'], specs: { size: '2.75-18', valve: 'TR4' }, equivalents: ['MICHELIN TUBE', 'RINALDI TUBE', 'LEVORIN TUBE'] },
  'TUBE-90/90-18': { brand: 'PIRELLI', applications: ['Honda CG125', 'Honda CG150', 'Honda CG160', 'Honda Biz', 'Yamaha Factor', 'Yamaha YBR'], specs: { size: '90/90-18', valve: 'TR4' }, equivalents: ['MICHELIN TUBE', 'RINALDI TUBE', 'LEVORIN TUBE'] },
  
  // Cabos de Acelerador
  'CABLE-ACC-CG160': { brand: 'CONTROL FLEX', applications: ['Honda CG160', 'Honda CG150', 'Honda Bros', 'Honda XRE190'], specs: { length: 950, type: 'push-pull' }, equivalents: ['COFAP CABLE', 'VEDAMOTORS CABLE'] },
  'CABLE-ACC-CB300': { brand: 'CONTROL FLEX', applications: ['Honda CB300', 'Honda XRE300'], specs: { length: 1050, type: 'push-pull' }, equivalents: ['COFAP CABLE', 'VEDAMOTORS CABLE'] },
  'CABLE-ACC-FAZER': { brand: 'CONTROL FLEX', applications: ['Yamaha Fazer 250', 'Yamaha Lander 250', 'Yamaha Crosser'], specs: { length: 1000, type: 'push-pull' }, equivalents: ['COFAP CABLE', 'VEDAMOTORS CABLE'] },
  
  // Cabos de Embreagem
  'CABLE-CLU-CG160': { brand: 'CONTROL FLEX', applications: ['Honda CG160', 'Honda CG150', 'Honda Bros', 'Honda XRE190'], specs: { length: 1100, type: 'standard' }, equivalents: ['COFAP CABLE', 'VEDAMOTORS CABLE'] },
  'CABLE-CLU-CB300': { brand: 'CONTROL FLEX', applications: ['Honda CB300', 'Honda XRE300'], specs: { length: 1200, type: 'standard' }, equivalents: ['COFAP CABLE', 'VEDAMOTORS CABLE'] },
  'CABLE-CLU-FAZER': { brand: 'CONTROL FLEX', applications: ['Yamaha Fazer 250', 'Yamaha Lander 250', 'Yamaha Crosser'], specs: { length: 1150, type: 'standard' }, equivalents: ['COFAP CABLE', 'VEDAMOTORS CABLE'] },
  
  // Cabos de Freio
  'CABLE-BRK-CG160': { brand: 'CONTROL FLEX', applications: ['Honda CG160', 'Honda CG150', 'Honda Bros', 'Honda XRE190', 'Honda Biz'], specs: { length: 1300, type: 'rear' }, equivalents: ['COFAP CABLE', 'VEDAMOTORS CABLE'] },
  'CABLE-BRK-FAZER': { brand: 'CONTROL FLEX', applications: ['Yamaha Fazer 250', 'Yamaha Lander 250', 'Yamaha Crosser', 'Yamaha Factor'], specs: { length: 1350, type: 'rear' }, equivalents: ['COFAP CABLE', 'VEDAMOTORS CABLE'] },
  
  // Manetes
  'LEVER-CLU-UNIV': { brand: 'CIRCUIT', applications: ['Honda CB300', 'Honda CB500', 'Yamaha MT-03', 'Yamaha YZF-R3', 'Kawasaki Ninja 300', 'Kawasaki Z300', 'Kawasaki Ninja 400'], specs: { type: 'adjustable', material: 'aluminum' }, equivalents: ['OXXY LEVER', 'RIZOMA LEVER', 'ASV LEVER'] },
  'LEVER-BRK-UNIV': { brand: 'CIRCUIT', applications: ['Honda CB300', 'Honda CB500', 'Yamaha MT-03', 'Yamaha YZF-R3', 'Kawasaki Ninja 300', 'Kawasaki Z300', 'Kawasaki Ninja 400'], specs: { type: 'adjustable', material: 'aluminum' }, equivalents: ['OXXY LEVER', 'RIZOMA LEVER', 'ASV LEVER'] },
  'LEVER-CLU-CG': { brand: 'CONTROL FLEX', applications: ['Honda CG125', 'Honda CG150', 'Honda CG160', 'Honda Bros', 'Honda Biz'], specs: { type: 'standard', material: 'steel' }, equivalents: ['VEDAMOTORS LEVER', 'COFAP LEVER'] },
  'LEVER-BRK-CG': { brand: 'CONTROL FLEX', applications: ['Honda CG125', 'Honda CG150', 'Honda CG160', 'Honda Bros', 'Honda Biz'], specs: { type: 'standard', material: 'steel' }, equivalents: ['VEDAMOTORS LEVER', 'COFAP LEVER'] },
  
  // Retentores de Bengala
  'SEAL-FORK-41': { brand: 'ATHENA', applications: ['Honda CB300', 'Honda CB500', 'Yamaha MT-03', 'Yamaha YZF-R3', 'Kawasaki Ninja 300', 'Kawasaki Z300'], specs: { diameter: 41, height: 54 }, equivalents: ['SKF SEAL', 'ALL BALLS SEAL', 'VEDAMOTORS SEAL'] },
  'SEAL-FORK-43': { brand: 'ATHENA', applications: ['Honda CBR600', 'Yamaha YZF-R6', 'Kawasaki ZX-6R', 'Suzuki GSX-R600'], specs: { diameter: 43, height: 54 }, equivalents: ['SKF SEAL', 'ALL BALLS SEAL'] },
  'SEAL-FORK-37': { brand: 'ATHENA', applications: ['Honda CG160', 'Honda Bros', 'Honda XRE190', 'Yamaha Fazer 250', 'Yamaha Lander 250'], specs: { diameter: 37, height: 50 }, equivalents: ['SKF SEAL', 'ALL BALLS SEAL', 'VEDAMOTORS SEAL'] },
  
  // Rolamentos de Direção
  'BEARING-STEER-CG': { brand: 'ALL BALLS', applications: ['Honda CG125', 'Honda CG150', 'Honda CG160', 'Honda Bros', 'Honda Biz', 'Honda XRE190'], specs: { type: 'tapered', kit: true }, equivalents: ['SKF BEARING', 'KOYO BEARING', 'VEDAMOTORS BEARING'] },
  'BEARING-STEER-CB300': { brand: 'ALL BALLS', applications: ['Honda CB300', 'Honda XRE300', 'Honda CB500', 'Honda CBR500'], specs: { type: 'tapered', kit: true }, equivalents: ['SKF BEARING', 'KOYO BEARING'] },
  'BEARING-STEER-FAZER': { brand: 'ALL BALLS', applications: ['Yamaha Fazer 250', 'Yamaha Lander 250', 'Yamaha Crosser', 'Yamaha Factor'], specs: { type: 'tapered', kit: true }, equivalents: ['SKF BEARING', 'KOYO BEARING', 'VEDAMOTORS BEARING'] },
  
  // Rolamentos de Roda
  'BEARING-WHEEL-6301': { brand: 'SKF', applications: ['Honda CG125', 'Honda CG150', 'Honda CG160', 'Honda Bros', 'Honda Biz', 'Yamaha Factor', 'Yamaha YBR'], specs: { id: 12, od: 37, width: 12 }, equivalents: ['NSK 6301', 'KOYO 6301', 'FAG 6301'] },
  'BEARING-WHEEL-6302': { brand: 'SKF', applications: ['Honda CB300', 'Honda XRE300', 'Yamaha Fazer 250', 'Yamaha Lander 250', 'Yamaha Crosser'], specs: { id: 15, od: 42, width: 13 }, equivalents: ['NSK 6302', 'KOYO 6302', 'FAG 6302'] },
  'BEARING-WHEEL-6303': { brand: 'SKF', applications: ['Honda CB500', 'Honda CBR500', 'Kawasaki Ninja 300', 'Kawasaki Z300', 'Yamaha MT-03', 'Yamaha YZF-R3'], specs: { id: 17, od: 47, width: 14 }, equivalents: ['NSK 6303', 'KOYO 6303', 'FAG 6303'] },
  
  // Retentores de Motor
  'SEAL-ENGINE-CG': { brand: 'VEDAMOTORS', applications: ['Honda CG125', 'Honda CG150', 'Honda CG160', 'Honda Bros', 'Honda Biz', 'Honda XRE190'], specs: { kit: true, pieces: 8 }, equivalents: ['ATHENA SEAL', 'COMETIC SEAL'] },
  'SEAL-ENGINE-CB300': { brand: 'VEDAMOTORS', applications: ['Honda CB300', 'Honda XRE300'], specs: { kit: true, pieces: 10 }, equivalents: ['ATHENA SEAL', 'COMETIC SEAL'] },
  'SEAL-ENGINE-FAZER': { brand: 'VEDAMOTORS', applications: ['Yamaha Fazer 250', 'Yamaha Lander 250', 'Yamaha Crosser'], specs: { kit: true, pieces: 9 }, equivalents: ['ATHENA SEAL', 'COMETIC SEAL'] },
  
  // Juntas de Motor
  'GASKET-CG160': { brand: 'VEDAMOTORS', applications: ['Honda CG160', 'Honda CG150', 'Honda Bros', 'Honda XRE190'], specs: { kit: 'complete', material: 'composite' }, equivalents: ['ATHENA GASKET', 'COMETIC GASKET'] },
  'GASKET-CB300': { brand: 'VEDAMOTORS', applications: ['Honda CB300', 'Honda XRE300'], specs: { kit: 'complete', material: 'composite' }, equivalents: ['ATHENA GASKET', 'COMETIC GASKET'] },
  'GASKET-FAZER250': { brand: 'VEDAMOTORS', applications: ['Yamaha Fazer 250', 'Yamaha Lander 250', 'Yamaha Crosser'], specs: { kit: 'complete', material: 'composite' }, equivalents: ['ATHENA GASKET', 'COMETIC GASKET'] },
  
  // Pistões
  'PISTON-CG160-STD': { brand: 'METAL LEVE', applications: ['Honda CG160', 'Honda Bros 160', 'Honda XRE190'], specs: { diameter: 57.3, oversize: 'STD' }, equivalents: ['MAHLE PISTON', 'WISECO PISTON'] },
  'PISTON-CB300-STD': { brand: 'METAL LEVE', applications: ['Honda CB300', 'Honda XRE300'], specs: { diameter: 76, oversize: 'STD' }, equivalents: ['MAHLE PISTON', 'WISECO PISTON'] },
  'PISTON-FAZER250-STD': { brand: 'METAL LEVE', applications: ['Yamaha Fazer 250', 'Yamaha Lander 250', 'Yamaha Crosser'], specs: { diameter: 74, oversize: 'STD' }, equivalents: ['MAHLE PISTON', 'WISECO PISTON'] },
  
  // Anéis de Pistão
  'RINGS-CG160-STD': { brand: 'METAL LEVE', applications: ['Honda CG160', 'Honda Bros 160', 'Honda XRE190'], specs: { diameter: 57.3, oversize: 'STD' }, equivalents: ['MAHLE RINGS', 'NPR RINGS'] },
  'RINGS-CB300-STD': { brand: 'METAL LEVE', applications: ['Honda CB300', 'Honda XRE300'], specs: { diameter: 76, oversize: 'STD' }, equivalents: ['MAHLE RINGS', 'NPR RINGS'] },
  'RINGS-FAZER250-STD': { brand: 'METAL LEVE', applications: ['Yamaha Fazer 250', 'Yamaha Lander 250', 'Yamaha Crosser'], specs: { diameter: 74, oversize: 'STD' }, equivalents: ['MAHLE RINGS', 'NPR RINGS'] },
  
  // Bielas
  'CONROD-CG160': { brand: 'METAL LEVE', applications: ['Honda CG160', 'Honda Bros 160', 'Honda XRE190'], specs: { length: 102 }, equivalents: ['WOSSNER CONROD', 'PROX CONROD'] },
  'CONROD-CB300': { brand: 'METAL LEVE', applications: ['Honda CB300', 'Honda XRE300'], specs: { length: 130 }, equivalents: ['WOSSNER CONROD', 'PROX CONROD'] },
  'CONROD-FAZER250': { brand: 'METAL LEVE', applications: ['Yamaha Fazer 250', 'Yamaha Lander 250', 'Yamaha Crosser'], specs: { length: 128 }, equivalents: ['WOSSNER CONROD', 'PROX CONROD'] },
  
  // Virabrequim
  'CRANK-CG160': { brand: 'METAL LEVE', applications: ['Honda CG160', 'Honda Bros 160', 'Honda XRE190'], specs: { stroke: 49.5 }, equivalents: ['WOSSNER CRANK', 'HOT RODS CRANK'] },
  'CRANK-CB300': { brand: 'METAL LEVE', applications: ['Honda CB300', 'Honda XRE300'], specs: { stroke: 55.2 }, equivalents: ['WOSSNER CRANK', 'HOT RODS CRANK'] },
  
  // Comando de Válvulas
  'CAMSHAFT-CG160': { brand: 'METAL LEVE', applications: ['Honda CG160', 'Honda Bros 160', 'Honda XRE190'], specs: { type: 'OHC' }, equivalents: ['WEBCAM CAMSHAFT', 'STAGE1 CAMSHAFT'] },
  'CAMSHAFT-CB300': { brand: 'METAL LEVE', applications: ['Honda CB300', 'Honda XRE300'], specs: { type: 'DOHC' }, equivalents: ['WEBCAM CAMSHAFT', 'STAGE1 CAMSHAFT'] },
};


// ============================================================================
// PEÇAS DE CAMINHÕES E VEÍCULOS PESADOS
// ============================================================================
export const TRUCK_PARTS = {
  // Filtros de Óleo - Caminhões
  'OF-TRUCK-VW': { brand: 'MANN-FILTER', applications: ['VW Constellation', 'VW Delivery', 'VW Worker', 'MAN TGX'], specs: { height: 200, diameter: 120 }, equivalents: ['TECFIL PSD-TRUCK', 'FRAM PH-TRUCK', 'FLEETGUARD LF-TRUCK'] },
  'OF-TRUCK-MB': { brand: 'MANN-FILTER', applications: ['Mercedes Actros', 'Mercedes Atego', 'Mercedes Axor', 'Mercedes Accelo'], specs: { height: 210, diameter: 125 }, equivalents: ['TECFIL PSD-MB', 'FRAM PH-MB', 'FLEETGUARD LF-MB'] },
  'OF-TRUCK-SCANIA': { brand: 'MANN-FILTER', applications: ['Scania P-Series', 'Scania R-Series', 'Scania G-Series', 'Scania S-Series'], specs: { height: 220, diameter: 130 }, equivalents: ['TECFIL PSD-SCANIA', 'FRAM PH-SCANIA', 'FLEETGUARD LF-SCANIA'] },
  'OF-TRUCK-VOLVO': { brand: 'MANN-FILTER', applications: ['Volvo FH', 'Volvo FM', 'Volvo VM', 'Volvo FMX'], specs: { height: 215, diameter: 128 }, equivalents: ['TECFIL PSD-VOLVO', 'FRAM PH-VOLVO', 'FLEETGUARD LF-VOLVO'] },
  'OF-TRUCK-IVECO': { brand: 'MANN-FILTER', applications: ['Iveco Stralis', 'Iveco Tector', 'Iveco Daily', 'Iveco Cursor'], specs: { height: 205, diameter: 122 }, equivalents: ['TECFIL PSD-IVECO', 'FRAM PH-IVECO', 'FLEETGUARD LF-IVECO'] },
  'OF-TRUCK-DAF': { brand: 'MANN-FILTER', applications: ['DAF XF', 'DAF CF', 'DAF LF'], specs: { height: 218, diameter: 126 }, equivalents: ['TECFIL PSD-DAF', 'FRAM PH-DAF', 'FLEETGUARD LF-DAF'] },
  
  // Filtros de Combustível - Caminhões
  'FF-TRUCK-VW': { brand: 'MANN-FILTER', applications: ['VW Constellation', 'VW Delivery', 'VW Worker', 'MAN TGX'], specs: { type: 'separator', flow: 200 }, equivalents: ['TECFIL PSD-FF', 'FRAM P-FF', 'FLEETGUARD FS-FF'] },
  'FF-TRUCK-MB': { brand: 'MANN-FILTER', applications: ['Mercedes Actros', 'Mercedes Atego', 'Mercedes Axor', 'Mercedes Accelo'], specs: { type: 'separator', flow: 220 }, equivalents: ['TECFIL PSD-FF-MB', 'FRAM P-FF-MB', 'FLEETGUARD FS-FF-MB'] },
  'FF-TRUCK-SCANIA': { brand: 'MANN-FILTER', applications: ['Scania P-Series', 'Scania R-Series', 'Scania G-Series', 'Scania S-Series'], specs: { type: 'separator', flow: 250 }, equivalents: ['TECFIL PSD-FF-SCANIA', 'FRAM P-FF-SCANIA', 'FLEETGUARD FS-FF-SCANIA'] },
  
  // Filtros de Ar - Caminhões
  'AF-TRUCK-VW': { brand: 'MANN-FILTER', applications: ['VW Constellation', 'VW Delivery', 'VW Worker', 'MAN TGX'], specs: { type: 'radial', height: 450 }, equivalents: ['TECFIL ARL-TRUCK', 'FRAM CA-TRUCK', 'FLEETGUARD AF-TRUCK'] },
  'AF-TRUCK-MB': { brand: 'MANN-FILTER', applications: ['Mercedes Actros', 'Mercedes Atego', 'Mercedes Axor', 'Mercedes Accelo'], specs: { type: 'radial', height: 480 }, equivalents: ['TECFIL ARL-MB', 'FRAM CA-MB', 'FLEETGUARD AF-MB'] },
  'AF-TRUCK-SCANIA': { brand: 'MANN-FILTER', applications: ['Scania P-Series', 'Scania R-Series', 'Scania G-Series', 'Scania S-Series'], specs: { type: 'radial', height: 500 }, equivalents: ['TECFIL ARL-SCANIA', 'FRAM CA-SCANIA', 'FLEETGUARD AF-SCANIA'] },
  
  // Lonas de Freio - Caminhões
  'BL-TRUCK-VW': { brand: 'FRAS-LE', applications: ['VW Constellation', 'VW Delivery', 'VW Worker', 'MAN TGX'], specs: { width: 180, thickness: 18 }, equivalents: ['COBREQ BL-TRUCK', 'DUROLINE BL-TRUCK'] },
  'BL-TRUCK-MB': { brand: 'FRAS-LE', applications: ['Mercedes Actros', 'Mercedes Atego', 'Mercedes Axor', 'Mercedes Accelo'], specs: { width: 200, thickness: 20 }, equivalents: ['COBREQ BL-MB', 'DUROLINE BL-MB'] },
  'BL-TRUCK-SCANIA': { brand: 'FRAS-LE', applications: ['Scania P-Series', 'Scania R-Series', 'Scania G-Series', 'Scania S-Series'], specs: { width: 220, thickness: 22 }, equivalents: ['COBREQ BL-SCANIA', 'DUROLINE BL-SCANIA'] },
  
  // Tambores de Freio - Caminhões
  'BD-TRUCK-VW': { brand: 'FREMAX', applications: ['VW Constellation', 'VW Delivery', 'VW Worker', 'MAN TGX'], specs: { diameter: 410, width: 180 }, equivalents: ['HIPPER BD-TRUCK', 'NAKATA BD-TRUCK'] },
  'BD-TRUCK-MB': { brand: 'FREMAX', applications: ['Mercedes Actros', 'Mercedes Atego', 'Mercedes Axor', 'Mercedes Accelo'], specs: { diameter: 420, width: 200 }, equivalents: ['HIPPER BD-MB', 'NAKATA BD-MB'] },
  'BD-TRUCK-SCANIA': { brand: 'FREMAX', applications: ['Scania P-Series', 'Scania R-Series', 'Scania G-Series', 'Scania S-Series'], specs: { diameter: 430, width: 220 }, equivalents: ['HIPPER BD-SCANIA', 'NAKATA BD-SCANIA'] },
  
  // Amortecedores - Caminhões
  'SA-TRUCK-VW': { brand: 'MONROE', applications: ['VW Constellation', 'VW Delivery', 'VW Worker', 'MAN TGX'], specs: { type: 'gas', length: 600 }, equivalents: ['COFAP SA-TRUCK', 'NAKATA SA-TRUCK'] },
  'SA-TRUCK-MB': { brand: 'MONROE', applications: ['Mercedes Actros', 'Mercedes Atego', 'Mercedes Axor', 'Mercedes Accelo'], specs: { type: 'gas', length: 650 }, equivalents: ['COFAP SA-MB', 'NAKATA SA-MB'] },
  'SA-TRUCK-SCANIA': { brand: 'MONROE', applications: ['Scania P-Series', 'Scania R-Series', 'Scania G-Series', 'Scania S-Series'], specs: { type: 'gas', length: 700 }, equivalents: ['COFAP SA-SCANIA', 'NAKATA SA-SCANIA'] },
  
  // Baterias - Caminhões
  'BAT-TRUCK-150AH': { brand: 'MOURA', applications: ['VW Delivery', 'Mercedes Accelo', 'Iveco Daily', 'Ford Cargo leve'], specs: { capacity: 150, cca: 900, voltage: 12 }, equivalents: ['HELIAR 150AH', 'BOSCH 150AH', 'ACDelco 150AH'] },
  'BAT-TRUCK-180AH': { brand: 'MOURA', applications: ['VW Constellation', 'Mercedes Atego', 'Iveco Tector', 'Ford Cargo'], specs: { capacity: 180, cca: 1100, voltage: 12 }, equivalents: ['HELIAR 180AH', 'BOSCH 180AH', 'ACDelco 180AH'] },
  'BAT-TRUCK-220AH': { brand: 'MOURA', applications: ['Mercedes Actros', 'Scania R-Series', 'Volvo FH', 'DAF XF'], specs: { capacity: 220, cca: 1300, voltage: 12 }, equivalents: ['HELIAR 220AH', 'BOSCH 220AH', 'ACDelco 220AH'] },
  
  // Óleo de Motor - Caminhões
  'OIL-TRUCK-15W40': { brand: 'SHELL RIMULA', applications: ['VW Constellation', 'VW Delivery', 'Mercedes Actros', 'Mercedes Atego', 'Scania', 'Volvo', 'Iveco', 'DAF'], specs: { viscosity: '15W-40', type: 'mineral', api: 'CK-4' }, equivalents: ['MOBIL DELVAC', 'CASTROL VECTON', 'PETRONAS URANIA'] },
  'OIL-TRUCK-10W40': { brand: 'SHELL RIMULA', applications: ['Mercedes Actros Euro 6', 'Scania Euro 6', 'Volvo Euro 6', 'DAF Euro 6'], specs: { viscosity: '10W-40', type: 'synthetic', api: 'CK-4' }, equivalents: ['MOBIL DELVAC', 'CASTROL VECTON', 'PETRONAS URANIA'] },
  'OIL-TRUCK-5W30': { brand: 'SHELL RIMULA', applications: ['Mercedes Actros Euro 6', 'Scania Euro 6', 'Volvo Euro 6', 'DAF Euro 6'], specs: { viscosity: '5W-30', type: 'synthetic', api: 'CK-4', acea: 'E9' }, equivalents: ['MOBIL DELVAC', 'CASTROL VECTON', 'PETRONAS URANIA'] },
  
  // Secador de Ar - Caminhões
  'AD-TRUCK-VW': { brand: 'WABCO', applications: ['VW Constellation', 'VW Delivery', 'VW Worker', 'MAN TGX'], specs: { type: 'cartridge' }, equivalents: ['KNORR AD-TRUCK', 'HALDEX AD-TRUCK'] },
  'AD-TRUCK-MB': { brand: 'WABCO', applications: ['Mercedes Actros', 'Mercedes Atego', 'Mercedes Axor', 'Mercedes Accelo'], specs: { type: 'cartridge' }, equivalents: ['KNORR AD-MB', 'HALDEX AD-MB'] },
  'AD-TRUCK-SCANIA': { brand: 'WABCO', applications: ['Scania P-Series', 'Scania R-Series', 'Scania G-Series', 'Scania S-Series'], specs: { type: 'cartridge' }, equivalents: ['KNORR AD-SCANIA', 'HALDEX AD-SCANIA'] },
  
  // Válvulas de Freio - Caminhões
  'BV-TRUCK-RELAY': { brand: 'WABCO', applications: ['VW Constellation', 'Mercedes Actros', 'Scania', 'Volvo', 'Iveco', 'DAF'], specs: { type: 'relay_valve' }, equivalents: ['KNORR BV-RELAY', 'HALDEX BV-RELAY'] },
  'BV-TRUCK-FOOT': { brand: 'WABCO', applications: ['VW Constellation', 'Mercedes Actros', 'Scania', 'Volvo', 'Iveco', 'DAF'], specs: { type: 'foot_valve' }, equivalents: ['KNORR BV-FOOT', 'HALDEX BV-FOOT'] },
  'BV-TRUCK-HAND': { brand: 'WABCO', applications: ['VW Constellation', 'Mercedes Actros', 'Scania', 'Volvo', 'Iveco', 'DAF'], specs: { type: 'hand_brake_valve' }, equivalents: ['KNORR BV-HAND', 'HALDEX BV-HAND'] },
};

// ============================================================================
// PEÇAS DE ÔNIBUS
// ============================================================================
export const BUS_PARTS = {
  // Filtros - Ônibus
  'OF-BUS-MB': { brand: 'MANN-FILTER', applications: ['Mercedes OF', 'Mercedes O500', 'Mercedes O400'], specs: { height: 210, diameter: 125 }, equivalents: ['TECFIL PSD-BUS', 'FRAM PH-BUS', 'FLEETGUARD LF-BUS'] },
  'OF-BUS-VOLVO': { brand: 'MANN-FILTER', applications: ['Volvo B270', 'Volvo B290', 'Volvo B340', 'Volvo B380'], specs: { height: 215, diameter: 128 }, equivalents: ['TECFIL PSD-BUS-V', 'FRAM PH-BUS-V', 'FLEETGUARD LF-BUS-V'] },
  'OF-BUS-SCANIA': { brand: 'MANN-FILTER', applications: ['Scania K270', 'Scania K310', 'Scania K360', 'Scania K400'], specs: { height: 220, diameter: 130 }, equivalents: ['TECFIL PSD-BUS-S', 'FRAM PH-BUS-S', 'FLEETGUARD LF-BUS-S'] },
  
  // Lonas de Freio - Ônibus
  'BL-BUS-MB': { brand: 'FRAS-LE', applications: ['Mercedes OF', 'Mercedes O500', 'Mercedes O400'], specs: { width: 200, thickness: 20 }, equivalents: ['COBREQ BL-BUS', 'DUROLINE BL-BUS'] },
  'BL-BUS-VOLVO': { brand: 'FRAS-LE', applications: ['Volvo B270', 'Volvo B290', 'Volvo B340', 'Volvo B380'], specs: { width: 210, thickness: 22 }, equivalents: ['COBREQ BL-BUS-V', 'DUROLINE BL-BUS-V'] },
  
  // Amortecedores - Ônibus
  'SA-BUS-MB': { brand: 'MONROE', applications: ['Mercedes OF', 'Mercedes O500', 'Mercedes O400'], specs: { type: 'gas', length: 650 }, equivalents: ['COFAP SA-BUS', 'NAKATA SA-BUS'] },
  'SA-BUS-VOLVO': { brand: 'MONROE', applications: ['Volvo B270', 'Volvo B290', 'Volvo B340', 'Volvo B380'], specs: { type: 'gas', length: 700 }, equivalents: ['COFAP SA-BUS-V', 'NAKATA SA-BUS-V'] },
};

// ============================================================================
// EXPORTAÇÃO CONSOLIDADA
// ============================================================================
export const EXTENDED_PARTS_DATABASE = {
  water_pumps: WATER_PUMPS,
  thermostats: THERMOSTATS,
  alternators: ALTERNATORS,
  starter_motors: STARTER_MOTORS,
  engine_mounts: ENGINE_MOUNTS,
  suspension_bushings: SUSPENSION_BUSHINGS,
  ball_joints: BALL_JOINTS,
  tie_rod_ends: TIE_ROD_ENDS,
  fluids: FLUIDS,
  clutch_kits: CLUTCH_KITS,
  wheel_bearings: WHEEL_BEARINGS,
  cv_joints: CV_JOINTS,
  motorcycle_parts: MOTORCYCLE_PARTS_EXTENDED,
  truck_parts: TRUCK_PARTS,
  bus_parts: BUS_PARTS,
};

export default EXTENDED_PARTS_DATABASE;
