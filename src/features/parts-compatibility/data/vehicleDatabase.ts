/**
 * TORQ AI - Base de Dados de Veículos do Brasil
 * Base completa para SaaS de oficinas mecânicas
 * 
 * Inclui: Carros, SUVs, Pick-ups, Caminhões, Vans, Motos, Utilitários
 * Todas as marcas e modelos comercializados no Brasil
 */

// ============================================================================
// TIPOS DE VEÍCULOS
// ============================================================================

export type VehicleType = 
  | 'car'           // Carros de passeio
  | 'suv'           // SUVs e Crossovers
  | 'pickup'        // Pick-ups
  | 'truck'         // Caminhões
  | 'van'           // Vans e Furgões
  | 'bus'           // Ônibus e Micro-ônibus
  | 'motorcycle'    // Motos
  | 'utility'       // Utilitários
  | 'tractor'       // Tratores
  | 'agricultural'; // Máquinas Agrícolas

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  car: 'Carro',
  suv: 'SUV',
  pickup: 'Pick-up',
  truck: 'Caminhão',
  van: 'Van/Furgão',
  bus: 'Ônibus',
  motorcycle: 'Moto',
  utility: 'Utilitário',
  tractor: 'Trator',
  agricultural: 'Máquina Agrícola',
};

// ============================================================================
// MARCAS POR CATEGORIA
// ============================================================================

export const VEHICLE_MAKES: Record<VehicleType, string[]> = {
  car: [
    'Audi', 'BMW', 'BYD', 'Caoa Chery', 'Chevrolet', 'Citroën', 'Fiat', 'Ford',
    'GWM', 'Honda', 'Hyundai', 'JAC', 'Jaguar', 'Jeep', 'Kia', 'Land Rover',
    'Lexus', 'Maserati', 'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Nissan',
    'Peugeot', 'Porsche', 'RAM', 'Renault', 'Subaru', 'Suzuki', 'Toyota',
    'Volkswagen', 'Volvo',
  ],
  suv: [
    'Audi', 'BMW', 'BYD', 'Caoa Chery', 'Chevrolet', 'Citroën', 'Ford', 'GWM',
    'Honda', 'Hyundai', 'JAC', 'Jaguar', 'Jeep', 'Kia', 'Land Rover', 'Lexus',
    'Mercedes-Benz', 'Mitsubishi', 'Nissan', 'Peugeot', 'Porsche', 'Renault',
    'Subaru', 'Suzuki', 'Toyota', 'Volkswagen', 'Volvo',
  ],
  pickup: [
    'Chevrolet', 'Fiat', 'Ford', 'GWM', 'Mitsubishi', 'Nissan', 'RAM',
    'Renault', 'Toyota', 'Volkswagen',
  ],
  truck: [
    'DAF', 'Ford', 'Iveco', 'MAN', 'Mercedes-Benz', 'Scania', 'Volkswagen', 'Volvo',
  ],
  van: [
    'Citroën', 'Fiat', 'Ford', 'Hyundai', 'Iveco', 'Mercedes-Benz', 'Peugeot',
    'Renault', 'Volkswagen',
  ],
  bus: [
    'Agrale', 'Iveco', 'MAN', 'Marcopolo', 'Mercedes-Benz', 'Scania', 'Volkswagen', 'Volvo',
  ],
  motorcycle: [
    'BMW', 'Dafra', 'Ducati', 'Harley-Davidson', 'Honda', 'Husqvarna', 'Indian',
    'Kawasaki', 'KTM', 'Royal Enfield', 'Shineray', 'Suzuki', 'Triumph', 'Yamaha',
  ],
  utility: [
    'Effa', 'Hafei', 'Iveco', 'Kia', 'Mahindra', 'Piaggio', 'Shineray', 'Troller',
  ],
  tractor: [
    'Case IH', 'John Deere', 'Massey Ferguson', 'New Holland', 'Valtra',
  ],
  agricultural: [
    'Case IH', 'CLAAS', 'John Deere', 'Massey Ferguson', 'New Holland',
  ],
};

// ============================================================================
// MODELOS POR MARCA - CARROS
// ============================================================================

export const CAR_MODELS: Record<string, string[]> = {
  'Audi': [
    'A1', 'A3 Sedan', 'A3 Sportback', 'A4', 'A4 Avant', 'A5 Coupé', 'A5 Sportback',
    'A6', 'A7', 'A8', 'e-tron GT', 'Q3', 'Q3 Sportback', 'Q5', 'Q7', 'Q8',
    'Q8 e-tron', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7', 'RS Q3', 'RS Q8',
    'S3', 'S4', 'S5', 'TT', 'TT RS',
  ],
  'BMW': [
    '118i', '120i', '218i Gran Coupé', '220i', '320i', '320i GT', '328i', '330e',
    '330i', '420i', '430i', '520i', '530e', '530i', '540i', '630i GT', '640i GT',
    '730i', '740i', '750i', 'i3', 'i4', 'i5', 'i7', 'iX', 'iX1', 'iX3',
    'M2', 'M3', 'M4', 'M5', 'M8', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7',
    'Z4', 'Série 1', 'Série 2', 'Série 3', 'Série 4', 'Série 5', 'Série 7',
  ],
  'BYD': [
    'Dolphin', 'Dolphin Mini', 'Han', 'King', 'Seal', 'Song Plus', 'Song Pro',
    'Tan', 'Yuan Plus',
  ],
  'Caoa Chery': [
    'Arrizo 5', 'Arrizo 6', 'Arrizo 6 Pro', 'Tiggo 2', 'Tiggo 3X', 'Tiggo 4',
    'Tiggo 5X', 'Tiggo 7', 'Tiggo 7 Pro', 'Tiggo 8', 'Tiggo 8 Pro',
  ],
  'Chevrolet': [
    // Modelos Atuais
    'Bolt EV', 'Bolt EUV', 'Camaro', 'Cobalt', 'Cruze', 'Cruze Sport6', 'Equinox',
    'Joy', 'Joy Plus', 'Malibu', 'Montana', 'Onix', 'Onix Plus', 'Onix RS',
    'S10', 'Spin', 'Tracker', 'Trailblazer',
    // Modelos Clássicos Brasileiros
    'Monza', 'Monza Classic', 'Monza SL/E', 'Monza GLS', 'Monza SR', 'Monza Turim',
    'Opala', 'Opala Comodoro', 'Opala Diplomata', 'Opala SS', 'Opala Caravan',
    'Chevette', 'Chevette Hatch', 'Chevette Sedan', 'Chevette Junior', 'Chevette L', 'Chevette SL', 'Chevette SE', 'Chevette DL',
    'Kadett', 'Kadett GS', 'Kadett GSi', 'Kadett GL', 'Kadett SL', 'Kadett Ipanema',
    'Corsa', 'Corsa Sedan', 'Corsa Hatch', 'Corsa Classic', 'Corsa Wind', 'Corsa Super', 'Corsa GL', 'Corsa GLS', 'Corsa GSi', 'Corsa Wagon', 'Corsa Pick-up',
    'Celta', 'Celta Life', 'Celta Spirit', 'Celta Super',
    'Prisma', 'Prisma Joy', 'Prisma LT', 'Prisma LTZ', 'Prisma Maxx',
    'Classic', 'Classic LS', 'Classic Life', 'Classic Spirit',
    'Astra', 'Astra Sedan', 'Astra Hatch', 'Astra GL', 'Astra GLS', 'Astra CD', 'Astra Advantage', 'Astra Elegance', 'Astra SS',
    'Vectra', 'Vectra CD', 'Vectra GLS', 'Vectra GL', 'Vectra GT', 'Vectra GTX', 'Vectra Elegance', 'Vectra Elite', 'Vectra Expression', 'Vectra Collection',
    'Omega', 'Omega CD', 'Omega GLS', 'Omega GL', 'Omega Suprema', 'Omega Australiano', 'Omega Fittipaldi',
    'Zafira', 'Zafira CD', 'Zafira Elegance', 'Zafira Elite', 'Zafira Expression', 'Zafira Comfort',
    'Meriva', 'Meriva CD', 'Meriva Joy', 'Meriva Maxx', 'Meriva Premium', 'Meriva SS', 'Meriva Expression',
    'Agile', 'Agile LT', 'Agile LTZ',
    'Sonic', 'Sonic LT', 'Sonic LTZ',
    'Captiva', 'Captiva Sport', 'Captiva Ecotec',
    'Blazer', 'Blazer DLX', 'Blazer Executive', 'Blazer Advantage', 'Blazer Colina',
    'Bonanza', 'Veraneio', 'D-20', 'D-10', 'C-10', 'C-20', 'A-10', 'A-20',
    'Silverado', 'Silverado DLX', 'Silverado Grand Blazer',
    'Ipanema', 'Ipanema GL', 'Ipanema GLS', 'Ipanema SL', 'Ipanema Flair',
    'Suprema', 'Calibra',
  ],
  'Citroën': [
    'Aircross', 'Berlingo', 'C3', 'C3 Aircross', 'C4 Cactus', 'C4 Lounge',
    'C5 Aircross', 'C5 X', 'DS3', 'DS4', 'DS5', 'DS7', 'Jumper', 'Jumpy',
    'ë-C4', 'ë-Jumpy',
  ],
  'Fiat': [
    // Modelos Atuais
    '500', '500e', 'Argo', 'Cronos', 'Doblo', 'Ducato', 'Fastback', 'Fiorino',
    'Grand Siena', 'Mobi', 'Pulse', 'Scudo', 'Strada', 'Toro',
    // Modelos Clássicos Brasileiros
    'Uno', 'Uno Mille', 'Uno Way', 'Uno Vivace', 'Uno Economy', 'Uno Fire', 'Uno Furgão', 'Uno CS', 'Uno S', 'Uno SX', 'Uno Turbo', 'Uno Sporting',
    'Palio', 'Palio Fire', 'Palio Weekend', 'Palio Adventure', 'Palio EL', 'Palio ELX', 'Palio EX', 'Palio ED', 'Palio Young', 'Palio Attractive', 'Palio Essence',
    'Siena', 'Siena Fire', 'Siena EL', 'Siena ELX', 'Siena EX', 'Siena HLX', 'Siena Tetrafuel', 'Siena Attractive', 'Siena Essence',
    'Marea', 'Marea ELX', 'Marea HLX', 'Marea SX', 'Marea Turbo', 'Marea Weekend',
    'Brava', 'Brava ELX', 'Brava HGT', 'Brava SX',
    'Tempra', 'Tempra Gold', 'Tempra Ouro', 'Tempra SX', 'Tempra HLX', 'Tempra Turbo', 'Tempra SW',
    'Tipo', 'Tipo SLX', 'Tipo IE', 'Tipo SX',
    'Premio', 'Premio CS', 'Premio CSL', 'Premio S', 'Premio SL',
    'Elba', 'Elba CS', 'Elba CSL', 'Elba Weekend',
    '147', '147 C', '147 CL', '147 L', '147 Rallye', '147 Spazio', '147 Panorama', '147 Furgão',
    'Oggi', 'Oggi CS', 'Oggi S',
    'Fiorino', 'Fiorino Furgão', 'Fiorino Pick-up', 'Fiorino Working', 'Fiorino Hard Working',
    'Punto', 'Punto ELX', 'Punto HLX', 'Punto Attractive', 'Punto Essence', 'Punto Sporting', 'Punto T-Jet', 'Punto Blackmotion',
    'Linea', 'Linea LX', 'Linea HLX', 'Linea Absolute', 'Linea Essence', 'Linea T-Jet',
    'Bravo', 'Bravo Essence', 'Bravo Absolute', 'Bravo Sporting', 'Bravo T-Jet',
    'Stilo', 'Stilo Connect', 'Stilo Dualogic', 'Stilo Sporting', 'Stilo Blackmotion',
    'Idea', 'Idea ELX', 'Idea HLX', 'Idea Adventure', 'Idea Attractive', 'Idea Essence', 'Idea Sporting',
    'Doblò', 'Doblò ELX', 'Doblò HLX', 'Doblò Adventure', 'Doblò Attractive', 'Doblò Essence',
    'Coupe', 'Coupe 16V', 'Coupe Turbo',
    'Cinquecento', 'Seicento',
  ],
  'Ford': [
    // Modelos Atuais
    'Bronco', 'Bronco Sport', 'EcoSport', 'Edge', 'F-150', 'F-150 Lightning',
    'Maverick', 'Mustang', 'Mustang Mach-E', 'Ranger', 'Territory', 'Transit',
    // Modelos Clássicos Brasileiros
    'Fiesta', 'Fiesta Hatch', 'Fiesta Sedan', 'Fiesta Street', 'Fiesta Trail', 'Fiesta Rocam', 'Fiesta Supercharger', 'Fiesta Titanium', 'Fiesta SE', 'Fiesta SEL',
    'Focus', 'Focus Hatch', 'Focus Sedan', 'Focus Ghia', 'Focus GLX', 'Focus Titanium', 'Focus SE', 'Focus Fastback',
    'Fusion', 'Fusion SEL', 'Fusion Titanium', 'Fusion Hybrid', 'Fusion AWD',
    'Ka', 'Ka Hatch', 'Ka Sedan', 'Ka+', 'Ka GL', 'Ka GLX', 'Ka XR', 'Ka Action', 'Ka Image', 'Ka Tecno', 'Ka Viral', 'Ka Fly', 'Ka Pulse', 'Ka SE', 'Ka SEL', 'Ka Titanium', 'Ka Freestyle',
    'Escort', 'Escort GL', 'Escort GLX', 'Escort XR3', 'Escort Ghia', 'Escort Hobby', 'Escort L', 'Escort SW', 'Escort Zetec',
    'Verona', 'Verona GL', 'Verona GLX', 'Verona Ghia', 'Verona LX',
    'Versailles', 'Versailles GL', 'Versailles Ghia', 'Versailles Royale',
    'Royale', 'Royale GL', 'Royale Ghia',
    'Del Rey', 'Del Rey GL', 'Del Rey Ghia', 'Del Rey Belina', 'Del Rey Pampa', 'Del Rey Scala',
    'Belina', 'Belina II', 'Belina GL', 'Belina Ghia', 'Belina L',
    'Pampa', 'Pampa GL', 'Pampa Ghia', 'Pampa L', 'Pampa S',
    'Corcel', 'Corcel I', 'Corcel II', 'Corcel GT', 'Corcel LDO', 'Corcel Luxo',
    'Maverick', 'Maverick GT', 'Maverick Super', 'Maverick Super Luxo', 'Maverick Quadrijet',
    'Galaxie', 'Galaxie 500', 'Galaxie LTD', 'Galaxie Landau',
    'F-100', 'F-250', 'F-350', 'F-1000', 'F-4000', 'F-75',
    'Courier', 'Courier L', 'Courier XL', 'Courier XLT',
    'Taurus', 'Taurus GL', 'Taurus LX', 'Taurus SE', 'Taurus SEL',
    'Mondeo', 'Mondeo CLX', 'Mondeo GLX', 'Mondeo Ghia',
    'Contour', 'Contour GL', 'Contour SE',
    'Probe', 'Probe GT',
    'Explorer', 'Explorer XLT', 'Explorer Limited', 'Explorer Sport',
    'Windstar', 'Windstar GL', 'Windstar LX',
  ],
  'GWM': [
    'Haval H6', 'Haval H6 GT', 'Haval H6 HEV', 'Haval H6 PHEV', 'Ora 03',
    'Poer', 'Tank 300',
  ],
  'Honda': [
    // Modelos Atuais
    'Accord', 'City', 'City Hatchback', 'Civic', 'Civic Si', 'Civic Type R',
    'CR-V', 'e:NP1', 'Fit', 'HR-V', 'WR-V', 'ZR-V',
    // Modelos Clássicos Brasileiros
    'Civic LX', 'Civic EX', 'Civic EXS', 'Civic LXS', 'Civic LXR', 'Civic LXL', 'Civic EXR', 'Civic Touring', 'Civic Sport',
    'Fit LX', 'Fit EX', 'Fit EXL', 'Fit LXL', 'Fit Twist', 'Fit DX', 'Fit CX',
    'City LX', 'City EX', 'City EXL', 'City DX', 'City Touring',
    'Accord LX', 'Accord EX', 'Accord EXL', 'Accord V6', 'Accord Touring',
    'CR-V LX', 'CR-V EX', 'CR-V EXL', 'CR-V Touring',
    'HR-V LX', 'HR-V EX', 'HR-V EXL', 'HR-V Touring', 'HR-V Advance',
    'WR-V LX', 'WR-V EX', 'WR-V EXL',
    'Prelude', 'Prelude Si', 'Prelude VTEC',
    'Legend', 'Legend V6',
    'CRX', 'CRX Si',
    'Del Sol', 'Del Sol Si',
    'Integra', 'Integra GS', 'Integra Type R',
    'NSX', 'NSX Type R',
    'S2000',
  ],
  'Hyundai': [
    // Modelos Atuais
    'Azera', 'Creta', 'Elantra', 'HB20', 'HB20S', 'HB20X', 'i30', 'i30 N',
    'Ioniq 5', 'Ioniq 6', 'ix35', 'Kona', 'Kona Electric', 'Palisade',
    'Santa Fe', 'Sonata', 'Tucson', 'Veloster',
    // Modelos Clássicos Brasileiros
    'HB20 Comfort', 'HB20 Comfort Plus', 'HB20 Comfort Style', 'HB20 Premium', 'HB20 Unique', 'HB20 Vision', 'HB20 Evolution', 'HB20 Platinum', 'HB20 Launch Edition',
    'HB20S Comfort', 'HB20S Comfort Plus', 'HB20S Premium', 'HB20S Vision', 'HB20S Evolution', 'HB20S Platinum',
    'HB20X Style', 'HB20X Premium', 'HB20X Vision', 'HB20X Evolution', 'HB20X Diamond',
    'Creta Action', 'Creta Attitude', 'Creta Pulse', 'Creta Prestige', 'Creta Launch Edition', 'Creta Limited', 'Creta Ultimate', 'Creta Platinum',
    'Tucson GL', 'Tucson GLS', 'Tucson Limited', 'Tucson Ultimate',
    'Santa Fe GLS', 'Santa Fe Limited', 'Santa Fe V6',
    'i30 GLS', 'i30 CW', 'i30 N Line',
    'ix35 GLS', 'ix35 Launching Edition', 'ix35 GL',
    'Elantra GLS', 'Elantra Limited', 'Elantra N Line',
    'Azera GLS', 'Azera V6', 'Azera Ultimate',
    'Sonata GLS', 'Sonata Limited',
    'Veloster', 'Veloster Turbo', 'Veloster N',
    'Accent', 'Accent GLS', 'Accent GL',
    'Excel', 'Excel GL', 'Excel GLS',
    'Galloper', 'Galloper Exceed', 'Galloper Innovation',
    'H100', 'H100 Furgão', 'H100 Pick-up',
    'HR', 'HR Furgão', 'HR Chassi', 'HR Baú',
    'Terracan', 'Terracan GL', 'Terracan GLS',
    'Vera Cruz', 'Vera Cruz GLS', 'Vera Cruz Limited',
    'Genesis', 'Genesis Coupe', 'Genesis Sedan',
    'Equus', 'Equus VS', 'Equus Ultimate',
  ],
  'JAC': [
    'E-JS1', 'iEV40', 'iEV60', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'T40',
    'T50', 'T60', 'T80',
  ],
  'Jaguar': [
    'E-Pace', 'F-Pace', 'F-Type', 'I-Pace', 'XE', 'XF', 'XJ',
  ],
  'Jeep': [
    'Cherokee', 'Commander', 'Compass', 'Gladiator', 'Grand Cherokee',
    'Grand Cherokee L', 'Renegade', 'Wagoneer', 'Wrangler',
  ],
  'Kia': [
    // Modelos Atuais
    'Bongo', 'Cadenza', 'Carnival', 'Cerato', 'EV6', 'K5', 'Mohave', 'Niro',
    'Niro EV', 'Optima', 'Picanto', 'Rio', 'Seltos', 'Sorento', 'Soul',
    'Sportage', 'Stinger', 'Stonic',
    // Modelos Clássicos Brasileiros
    'Cerato SX', 'Cerato EX', 'Cerato LX', 'Cerato Koup', 'Cerato GT',
    'Sportage LX', 'Sportage EX', 'Sportage EX2', 'Sportage EX3', 'Sportage GT',
    'Sorento EX', 'Sorento EX2', 'Sorento EX3', 'Sorento GT',
    'Soul EX', 'Soul EX2', 'Soul GT', 'Soul GT Line',
    'Picanto EX', 'Picanto LX', 'Picanto GT Line',
    'Rio EX', 'Rio LX', 'Rio Sedan', 'Rio Hatch',
    'Optima EX', 'Optima SX', 'Optima GT',
    'Cadenza EX', 'Cadenza V6',
    'Carnival EX', 'Carnival EX2', 'Carnival EX3', 'Carnival LX',
    'Mohave EX', 'Mohave V6',
    'Seltos EX', 'Seltos SX', 'Seltos GT Line',
    'Stonic EX', 'Stonic GT Line',
    'Stinger GT', 'Stinger GT Line',
    'Bongo K2500', 'Bongo K2700', 'Bongo K3000',
    'Clarus', 'Clarus GLX', 'Clarus SLX',
    'Sephia', 'Sephia GLX', 'Sephia SLX',
    'Shuma', 'Shuma GLX', 'Shuma SLX',
    'Magentis', 'Magentis EX', 'Magentis LX',
    'Opirus', 'Opirus EX', 'Opirus GL',
    'Carens', 'Carens EX', 'Carens LX',
    'Rondo', 'Rondo EX', 'Rondo LX',
  ],
  'Land Rover': [
    'Defender 90', 'Defender 110', 'Defender 130', 'Discovery', 'Discovery Sport',
    'Range Rover', 'Range Rover Evoque', 'Range Rover Sport', 'Range Rover Velar',
  ],
  'Lexus': [
    'ES 300h', 'IS 300', 'LC 500', 'LS 500h', 'LX 600', 'NX 250', 'NX 350h',
    'NX 450h+', 'RC 300', 'RX 350', 'RX 450h', 'RX 500h', 'RZ 450e', 'UX 250h',
  ],
  'Maserati': [
    'Ghibli', 'GranTurismo', 'Grecale', 'Levante', 'MC20', 'Quattroporte',
  ],
  'Mercedes-Benz': [
    'A 200', 'A 250', 'A 35 AMG', 'A 45 AMG', 'AMG GT', 'B 200', 'C 180', 'C 200',
    'C 300', 'C 43 AMG', 'C 63 AMG', 'CLA 180', 'CLA 200', 'CLA 250', 'CLA 35 AMG',
    'CLA 45 AMG', 'CLS 450', 'E 200', 'E 300', 'E 350', 'E 53 AMG', 'E 63 AMG',
    'EQA', 'EQB', 'EQC', 'EQE', 'EQS', 'G 500', 'G 63 AMG', 'GLA 200', 'GLA 250',
    'GLA 35 AMG', 'GLA 45 AMG', 'GLB 200', 'GLB 250', 'GLC 220d', 'GLC 300',
    'GLC 43 AMG', 'GLC 63 AMG', 'GLE 350', 'GLE 400', 'GLE 450', 'GLE 53 AMG',
    'GLE 63 AMG', 'GLS 450', 'GLS 580', 'GLS 63 AMG', 'Maybach GLS', 'Maybach S',
    'S 500', 'S 580', 'S 63 AMG', 'SL 55 AMG', 'SL 63 AMG',
  ],
  'Mini': [
    'Clubman', 'Cooper', 'Cooper S', 'Countryman', 'John Cooper Works',
  ],
  'Mitsubishi': [
    'ASX', 'Eclipse Cross', 'L200 Triton', 'Lancer', 'Outlander', 'Outlander PHEV',
    'Pajero', 'Pajero Full', 'Pajero Sport',
  ],
  'Nissan': [
    // Modelos Atuais
    'Altima', 'Frontier', 'GT-R', 'Kicks', 'Leaf', 'March', 'Murano', 'Note',
    'Pathfinder', 'Sentra', 'Tiida', 'Versa', 'X-Trail',
    // Modelos Clássicos Brasileiros
    'Kicks S', 'Kicks SV', 'Kicks SL', 'Kicks Advance', 'Kicks Exclusive', 'Kicks Special Edition',
    'Versa S', 'Versa SV', 'Versa SL', 'Versa Advance', 'Versa Exclusive',
    'Sentra S', 'Sentra SV', 'Sentra SL', 'Sentra Advance', 'Sentra Exclusive',
    'March S', 'March SV', 'March SL', 'March Rio',
    'Frontier S', 'Frontier SE', 'Frontier XE', 'Frontier LE', 'Frontier Attack', 'Frontier PRO-4X',
    'Tiida S', 'Tiida SL', 'Tiida Hatch', 'Tiida Sedan',
    'Livina S', 'Livina SL', 'Livina X-Gear', 'Grand Livina',
    'X-Trail S', 'X-Trail SL', 'X-Trail SE', 'X-Trail LE',
    'Pathfinder SE', 'Pathfinder LE', 'Pathfinder Platinum',
    'Murano S', 'Murano SL', 'Murano Platinum',
    'Altima S', 'Altima SL', 'Altima SR',
    'Maxima', 'Maxima SE', 'Maxima SL',
    '350Z', '350Z Touring', '350Z Track',
    '370Z', '370Z Touring', '370Z Nismo',
    'GT-R Premium', 'GT-R Black Edition', 'GT-R Nismo',
    'Leaf S', 'Leaf SV', 'Leaf SL',
    'Skyline', 'Skyline GT-R', 'Skyline GTS',
    'Silvia', 'Silvia S13', 'Silvia S14', 'Silvia S15',
    '240SX', '240SX SE', '240SX LE',
    'Xterra', 'Xterra S', 'Xterra SE', 'Xterra Off-Road',
  ],
  'Peugeot': [
    '2008', '208', '3008', '308', '408', '5008', '508', 'Boxer', 'e-2008',
    'e-208', 'e-Expert', 'Expert', 'Landtrek', 'Partner', 'Rifter',
  ],
  'Porsche': [
    '718 Boxster', '718 Cayman', '911', 'Cayenne', 'Cayenne Coupé', 'Macan',
    'Panamera', 'Taycan', 'Taycan Cross Turismo',
  ],
  'RAM': [
    '1500', '2500', '3500', 'Rampage',
  ],
  'Renault': [
    // Modelos Atuais
    'Captur', 'Duster', 'Kwid', 'Logan', 'Oroch', 'Sandero', 'Stepway',
    // Modelos Clássicos Brasileiros
    'Clio', 'Clio Sedan', 'Clio Hatch', 'Clio Campus', 'Clio Authentique', 'Clio Expression', 'Clio Privilège', 'Clio Hi-Flex',
    'Scenic', 'Scenic RT', 'Scenic RXE', 'Scenic Privilège', 'Scenic Expression', 'Scenic Authentique', 'Grand Scenic',
    'Megane', 'Megane Sedan', 'Megane Hatch', 'Megane Grand Tour', 'Megane Dynamique', 'Megane Expression', 'Megane Privilège', 'Megane E-Tech',
    'Laguna', 'Laguna RT', 'Laguna RXE', 'Laguna Privilège', 'Laguna Expression',
    'Fluence', 'Fluence Dynamique', 'Fluence Privilège', 'Fluence Expression', 'Fluence GT',
    'Symbol', 'Symbol Expression', 'Symbol Privilège',
    'R19', 'R19 RT', 'R19 RN', 'R19 RL', 'R19 Chamade', 'R19 Sedan', 'R19 Hatch',
    'R21', 'R21 GTS', 'R21 TXE', 'R21 Nevada',
    'Twingo', 'Twingo Pack', 'Twingo Easy',
    'Kangoo', 'Kangoo Express', 'Kangoo Authentique', 'Kangoo Expression', 'Kangoo Sportway',
    'Master', 'Master Furgão', 'Master Minibus', 'Master Chassi',
    'Trafic', 'Trafic Furgão', 'Trafic Minibus',
    'Sandero RS', 'Sandero Stepway', 'Sandero Expression', 'Sandero Authentique', 'Sandero Privilège', 'Sandero GT Line',
    'Logan Expression', 'Logan Authentique', 'Logan Privilège', 'Logan Avantage',
    'Duster Oroch', 'Duster Expression', 'Duster Dynamique', 'Duster Techroad', 'Duster Iconic',
    'Captur Intense', 'Captur Zen', 'Captur Bose',
    'Kwid Zen', 'Kwid Intense', 'Kwid Outsider',
    'Zoe', 'Zoe Intense', 'Zoe Zen',
  ],
  'Subaru': [
    'BRZ', 'Crosstrek', 'Forester', 'Impreza', 'Legacy', 'Outback', 'Solterra',
    'WRX', 'XV',
  ],
  'Suzuki': [
    'Baleno', 'Grand Vitara', 'Ignis', 'Jimny', 'Jimny Sierra', 'S-Cross',
    'Swift', 'Swift Sport', 'Vitara',
  ],
  'Toyota': [
    // Modelos Atuais
    'Camry', 'Corolla', 'Corolla Cross', 'Corolla GR-S', 'Etios', 'GR Corolla',
    'GR Supra', 'GR Yaris', 'GR86', 'Hilux', 'Hilux SW4', 'Land Cruiser',
    'Land Cruiser Prado', 'Prius', 'RAV4', 'Yaris', 'Yaris Cross', 'bZ4X',
    // Modelos Clássicos Brasileiros
    'Corolla XLi', 'Corolla GLi', 'Corolla XEi', 'Corolla SEG', 'Corolla Altis', 'Corolla Fielder', 'Corolla Cross XRE', 'Corolla Cross XRX', 'Corolla Cross Hybrid',
    'Etios X', 'Etios XS', 'Etios XLS', 'Etios Platinum', 'Etios Cross', 'Etios Sedan', 'Etios Hatch',
    'Yaris XL', 'Yaris XS', 'Yaris XLS', 'Yaris Sedan', 'Yaris Hatch',
    'Camry XLE', 'Camry XSE', 'Camry Hybrid',
    'RAV4 SX', 'RAV4 S', 'RAV4 Hybrid',
    'Hilux SR', 'Hilux SRV', 'Hilux SRX', 'Hilux GR-S', 'Hilux CD', 'Hilux CS', 'Hilux STD',
    'Hilux SW4 SR', 'Hilux SW4 SRV', 'Hilux SW4 SRX', 'Hilux SW4 Diamond', 'Hilux SW4 GR-S',
    'Bandeirante', 'Bandeirante Jipe', 'Bandeirante Pick-up', 'Bandeirante Capota',
    'Corona', 'Corona RT', 'Corona GL',
    'Celica', 'Celica GT', 'Celica GT-Four',
    'Supra', 'Supra Turbo',
    'MR2', 'MR2 Turbo',
    'Tercel', 'Paseo',
    'Land Cruiser 80', 'Land Cruiser 100', 'Land Cruiser 200', 'Land Cruiser 300',
    'Prado VX', 'Prado TX', 'Prado TXL',
    'Prius Hybrid', 'Prius Prime',
  ],
  'Volkswagen': [
    'Amarok', 'Arteon', 'ID.3', 'ID.4', 'ID.Buzz', 'Jetta', 'Jetta GLI', 'Nivus', 'Passat',
    'Polo', 'Polo GTS', 'Saveiro', 'T-Cross', 'Taos', 'Tiguan', 'Tiguan Allspace',
    'Touareg', 'Up!', 'Virtus', 'Voyage',
    'Fusca', 'Fusca 1300', 'Fusca 1500', 'Fusca 1600', 'Fusca Itamar',
    'Gol', 'Gol G1', 'Gol G2', 'Gol G3', 'Gol G4', 'Gol G5', 'Gol G6', 'Gol G7', 'Gol G8',
    'Gol Quadrado', 'Gol Bola', 'Gol GTI', 'Gol GTS', 'Gol GT', 'Gol CL', 'Gol GL', 'Gol CLI', 'Gol GLI', 'Gol MI', 'Gol Special', 'Gol City', 'Gol Plus', 'Gol Power', 'Gol Trend', 'Gol Rallye', 'Gol Track',
    'Parati', 'Parati CL', 'Parati GL', 'Parati GLS', 'Parati GTI', 'Parati Surf', 'Parati Track&Field', 'Parati Crossover',
    'Santana', 'Santana CL', 'Santana GL', 'Santana GLS', 'Santana GLSi', 'Santana Quantum', 'Santana Evidence', 'Santana Comfortline', 'Santana Exclusiv',
    'Quantum', 'Quantum CL', 'Quantum GL', 'Quantum GLS', 'Quantum GLSi', 'Quantum Evidence',
    'Fox', 'Fox City', 'Fox Plus', 'Fox Route', 'Fox Trend', 'Fox Prime', 'Fox Highline', 'Fox Pepper', 'Fox Xtreme', 'Fox Rock in Rio', 'Fox Sunrise', 'Fox Sunset', 'Fox BlueMotion',
    'SpaceFox', 'SpaceFox Trend', 'SpaceFox Sportline', 'SpaceFox Highline', 'SpaceFox Comfortline',
    'CrossFox', 'CrossFox I-Motion',
    'Golf', 'Golf GTI', 'Golf R', 'Golf TSI', 'Golf Comfortline', 'Golf Highline', 'Golf Sportline', 'Golf Generation', 'Golf Flash', 'Golf Black Edition',
    'Bora', 'Bora 2.0', 'Bora 1.8T',
    'Brasilia', 'Brasilia LS',
    'Variant', 'Variant TL', 'Variant II',
    'TL', 'SP1', 'SP2',
    'Kombi', 'Kombi Standard', 'Kombi Furgão', 'Kombi Pick-up', 'Kombi Lotação', 'Kombi Last Edition',
    'Logus', 'Logus CL', 'Logus GL', 'Logus GLS', 'Logus GLi', 'Logus Wolfsburg Edition',
    'Pointer', 'Pointer CL', 'Pointer GL', 'Pointer GLS', 'Pointer GLi', 'Pointer GTI',
    'Apollo', 'Apollo CL', 'Apollo GL', 'Apollo GLS',
    'Karmann Ghia', 'Karmann Ghia TC',
    'New Beetle', 'Beetle', 'Beetle Turbo',
    'Saveiro Cross', 'Saveiro Trooper', 'Saveiro Surf', 'Saveiro Titan', 'Saveiro Robust', 'Saveiro Trendline', 'Saveiro Highline', 'Saveiro Pepper',
  ],
  'Volvo': [
    'C40 Recharge', 'EX30', 'EX90', 'S60', 'S90', 'V40', 'V60', 'V60 Cross Country',
    'V90', 'V90 Cross Country', 'XC40', 'XC40 Recharge', 'XC60', 'XC90',
  ],
};

// ============================================================================
// MODELOS POR MARCA - PICK-UPS
// ============================================================================

export const PICKUP_MODELS: Record<string, string[]> = {
  'Chevrolet': [
    'Montana', 'S10', 'S10 High Country', 'S10 LT', 'S10 LTZ', 'S10 Z71',
    'Silverado', 'Silverado 1500', 'Silverado 2500', 'Silverado 3500',
  ],
  'Fiat': [
    'Strada', 'Strada Adventure', 'Strada Endurance', 'Strada Freedom',
    'Strada Hard Working', 'Strada Ranch', 'Strada Trekking', 'Strada Volcano',
    'Toro', 'Toro Endurance', 'Toro Freedom', 'Toro Ranch', 'Toro Ultra', 'Toro Volcano',
  ],
  'Ford': [
    'F-150', 'F-150 Raptor', 'F-250', 'F-350', 'F-4000', 'Maverick',
    'Ranger', 'Ranger Black', 'Ranger Limited', 'Ranger Raptor',
    'Ranger Storm', 'Ranger XL', 'Ranger XLS', 'Ranger XLT',
  ],
  'GWM': [
    'Poer', 'Poer Hunter',
  ],
  'Mitsubishi': [
    'L200 Triton', 'L200 Triton GLX', 'L200 Triton GLS', 'L200 Triton HPE',
    'L200 Triton Outdoor', 'L200 Triton Savana', 'L200 Triton Sport',
  ],
  'Nissan': [
    'Frontier', 'Frontier Attack', 'Frontier LE', 'Frontier PRO-4X',
    'Frontier S', 'Frontier SE', 'Frontier XE',
  ],
  'RAM': [
    '1500', '1500 Classic', '1500 Laramie', '1500 Limited', '1500 Rebel',
    '2500', '2500 Laramie', '2500 Limited', '3500', 'Rampage', 'Rampage Laramie',
    'Rampage R/T', 'Rampage Rebel',
  ],
  'Renault': [
    'Duster Oroch', 'Oroch', 'Oroch Outsider', 'Oroch Pro',
  ],
  'Toyota': [
    'Hilux', 'Hilux CD', 'Hilux CS', 'Hilux GR-S', 'Hilux SR', 'Hilux SRV',
    'Hilux SRX', 'Hilux STD',
  ],
  'Volkswagen': [
    'Amarok', 'Amarok Comfortline', 'Amarok Extreme', 'Amarok Highline',
    'Amarok SE', 'Amarok Trendline', 'Amarok V6', 'Saveiro', 'Saveiro Cross',
    'Saveiro Pepper', 'Saveiro Robust', 'Saveiro Trendline',
  ],
};

// ============================================================================
// MODELOS POR MARCA - CAMINHÕES
// ============================================================================

export const TRUCK_MODELS: Record<string, string[]> = {
  'DAF': [
    'CF 85', 'LF 45', 'LF 55', 'XF 105', 'XF 480', 'XF 530', 'XG', 'XG+',
  ],
  'Ford': [
    'Cargo 816', 'Cargo 1119', 'Cargo 1319', 'Cargo 1419', 'Cargo 1519',
    'Cargo 1719', 'Cargo 1723', 'Cargo 1729', 'Cargo 1731', 'Cargo 1932',
    'Cargo 2042', 'Cargo 2428', 'Cargo 2429', 'Cargo 2628', 'Cargo 2842',
    'Cargo 3031', 'Cargo 3131', 'F-4000', 'F-350',
  ],
  'Iveco': [
    'Daily 30S13', 'Daily 35S14', 'Daily 45S17', 'Daily 55C17', 'Daily 70C17',
    'Eurocargo', 'Hi-Way', 'S-Way', 'Stralis', 'Tector', 'Trakker', 'X-Way',
  ],
  'MAN': [
    'TGX 28.440', 'TGX 29.440', 'TGX 29.480', 'TGX 33.440', 'TGX 33.480',
    'TGS 24.440', 'TGS 26.440', 'TGS 28.440', 'TGS 33.440',
  ],
  'Mercedes-Benz': [
    'Accelo 815', 'Accelo 1016', 'Accelo 1316', 'Actros 2546', 'Actros 2651',
    'Actros 2653', 'Arocs 3345', 'Arocs 4145', 'Atego 1419', 'Atego 1719',
    'Atego 1726', 'Atego 1729', 'Atego 2426', 'Atego 2430', 'Atego 3026',
    'Atron 1319', 'Atron 1635', 'Atron 1719', 'Atron 2324', 'Atron 2729',
    'Axor 1933', 'Axor 2036', 'Axor 2041', 'Axor 2044', 'Axor 2533', 'Axor 2544',
    'Axor 3131', 'Axor 3344', 'Sprinter 311', 'Sprinter 313', 'Sprinter 415',
    'Sprinter 515', 'Sprinter 516',
  ],
  'Scania': [
    'G 360', 'G 410', 'G 450', 'G 500', 'P 250', 'P 280', 'P 310', 'P 360',
    'P 410', 'R 410', 'R 450', 'R 500', 'R 540', 'R 620', 'R 730', 'S 500',
    'S 540', 'S 620', 'S 730',
  ],
  'Volkswagen': [
    'Constellation 13.180', 'Constellation 15.190', 'Constellation 17.190',
    'Constellation 17.230', 'Constellation 17.280', 'Constellation 19.320',
    'Constellation 19.360', 'Constellation 19.420', 'Constellation 24.250',
    'Constellation 24.280', 'Constellation 24.330', 'Constellation 25.360',
    'Constellation 25.420', 'Constellation 26.280', 'Constellation 26.420',
    'Constellation 31.280', 'Constellation 31.330', 'Delivery 4.160', 'Delivery 6.160',
    'Delivery 9.170', 'Delivery 11.180', 'Delivery 13.180', 'e-Delivery',
    'Meteor 28.460', 'Meteor 29.520',
  ],
  'Volvo': [
    'FH 420', 'FH 460', 'FH 500', 'FH 540', 'FH 750', 'FMX 370', 'FMX 420',
    'FMX 460', 'FMX 500', 'FMX 540', 'FM 370', 'FM 420', 'FM 460', 'FM 500',
    'VM 220', 'VM 270', 'VM 330',
  ],
};

// ============================================================================
// MODELOS POR MARCA - VANS E FURGÕES
// ============================================================================

export const VAN_MODELS: Record<string, string[]> = {
  'Citroën': [
    'Berlingo', 'Jumper', 'Jumper Furgão', 'Jumper Minibus', 'Jumpy',
    'Jumpy Furgão', 'Jumpy Minibus', 'SpaceTourer',
  ],
  'Fiat': [
    'Doblo', 'Doblo Cargo', 'Doblo Essence', 'Ducato', 'Ducato Cargo',
    'Ducato Chassi', 'Ducato Furgão', 'Ducato Maxicargo', 'Ducato Minibus',
    'Ducato Multi', 'Fiorino', 'Fiorino Furgão', 'Scudo', 'Scudo Furgão',
  ],
  'Ford': [
    'Transit', 'Transit Chassi', 'Transit Furgão', 'Transit Minibus',
    'Transit Custom',
  ],
  'Hyundai': [
    'H-1', 'H-100', 'HR', 'Starex',
  ],
  'Iveco': [
    'Daily 30S13', 'Daily 35S14', 'Daily 45S17', 'Daily 55C17', 'Daily 70C17',
    'Daily Furgão', 'Daily Minibus', 'Daily Chassi',
  ],
  'Mercedes-Benz': [
    'Sprinter 311', 'Sprinter 313', 'Sprinter 314', 'Sprinter 316',
    'Sprinter 415', 'Sprinter 416', 'Sprinter 515', 'Sprinter 516',
    'Sprinter Chassi', 'Sprinter Furgão', 'Sprinter Minibus', 'Sprinter Van',
    'Vito', 'Vito Furgão', 'Vito Tourer',
  ],
  'Peugeot': [
    'Boxer', 'Boxer Chassi', 'Boxer Furgão', 'Boxer Minibus',
    'Expert', 'Expert Furgão', 'Expert Minibus', 'Partner', 'Rifter',
  ],
  'Renault': [
    'Kangoo', 'Kangoo Express', 'Master', 'Master Chassi', 'Master Furgão',
    'Master Minibus', 'Trafic',
  ],
  'Volkswagen': [
    'Amarok', 'Crafter', 'Delivery Express', 'Kombi', 'Transporter',
  ],
};

// ============================================================================
// MODELOS POR MARCA - ÔNIBUS
// ============================================================================

export const BUS_MODELS: Record<string, string[]> = {
  'Agrale': [
    'MA 8.5', 'MA 9.2', 'MA 10.0', 'MA 12.0', 'MA 15.0', 'MT 12.0', 'MT 15.0',
  ],
  'Iveco': [
    'Daily 45S17', 'Daily 55C17', 'Daily 70C17', 'Tector', 'Cursor',
  ],
  'MAN': [
    'Lion\'s City', 'Lion\'s Coach', 'TGX',
  ],
  'Marcopolo': [
    'Audace', 'G7', 'G8', 'Ideale', 'Paradiso', 'Senior', 'Torino', 'Viaggio',
    'Viale', 'Viale BRT',
  ],
  'Mercedes-Benz': [
    'O 500', 'O 500 M', 'O 500 R', 'O 500 RS', 'O 500 U', 'O 500 UA',
    'OF 1519', 'OF 1721', 'OF 1724', 'OH 1621', 'OH 1628', 'OH 1830',
    'Sprinter 415', 'Sprinter 515',
  ],
  'Scania': [
    'F 250', 'F 270', 'F 310', 'K 250', 'K 270', 'K 310', 'K 360', 'K 400',
    'K 440', 'K 480',
  ],
  'Volkswagen': [
    '15.190 OD', '17.230 OD', '17.260 OT', '18.330 OT', 'e-Flex',
  ],
  'Volvo': [
    'B270F', 'B290R', 'B340R', 'B380R', 'B420R', 'B450R', 'B8R', 'B11R',
  ],
};

// ============================================================================
// MODELOS POR MARCA - MOTOS
// ============================================================================

export const MOTORCYCLE_MODELS: Record<string, string[]> = {
  'BMW': [
    'C 400 GT', 'C 400 X', 'CE 04', 'F 750 GS', 'F 800 GS', 'F 850 GS',
    'F 850 GS Adventure', 'F 900 R', 'F 900 XR', 'G 310 GS', 'G 310 R',
    'K 1600 B', 'K 1600 GT', 'K 1600 GTL', 'M 1000 R', 'M 1000 RR',
    'R 1250 GS', 'R 1250 GS Adventure', 'R 1250 R', 'R 1250 RS', 'R 1250 RT',
    'R 18', 'R 18 B', 'R 18 Classic', 'R 18 Transcontinental', 'R nineT',
    'R nineT Pure', 'R nineT Scrambler', 'R nineT Urban G/S', 'S 1000 R',
    'S 1000 RR', 'S 1000 XR',
  ],
  'Dafra': [
    'Apache 150', 'Apache 200', 'Cityclass 200i', 'Citycom 300i', 'Cruisym 150',
    'Horizon 150', 'Horizon 250', 'Kansas 150', 'Maxsym 400i', 'NH 190',
    'Riva 150', 'Speed 150', 'Super 100', 'Super 50',
  ],
  'Ducati': [
    'Diavel', 'Diavel V4', 'DesertX', 'Hypermotard 698', 'Hypermotard 950',
    'Monster', 'Monster SP', 'Multistrada V2', 'Multistrada V4', 'Multistrada V4 Rally',
    'Panigale V2', 'Panigale V4', 'Panigale V4 R', 'Scrambler', 'Scrambler 1100',
    'Scrambler Desert Sled', 'Scrambler Full Throttle', 'Scrambler Icon',
    'Scrambler Nightshift', 'Streetfighter V2', 'Streetfighter V4', 'SuperSport',
    'XDiavel',
  ],
  'Harley-Davidson': [
    'Breakout', 'CVO Limited', 'CVO Road Glide', 'CVO Street Glide', 'Electra Glide',
    'Fat Bob', 'Fat Boy', 'Forty-Eight', 'Heritage Classic', 'Iron 883',
    'Iron 1200', 'LiveWire', 'Low Rider', 'Low Rider S', 'Low Rider ST',
    'Nightster', 'Pan America', 'Road Glide', 'Road Glide Limited', 'Road King',
    'Softail Slim', 'Softail Standard', 'Sport Glide', 'Sportster S',
    'Street Bob', 'Street Glide', 'Street Glide Special', 'Tri Glide Ultra',
    'Ultra Limited',
  ],
  'Honda': [
    'ADV 150', 'Africa Twin', 'Africa Twin Adventure Sports', 'Biz 110i',
    'Biz 125', 'Bros 160', 'CB 250F Twister', 'CB 300F Twister', 'CB 500F',
    'CB 500X', 'CB 650R', 'CB 1000R', 'CBR 250RR', 'CBR 500R', 'CBR 600RR',
    'CBR 650R', 'CBR 1000RR', 'CBR 1000RR-R Fireblade', 'CG 160', 'CG 160 Cargo',
    'CG 160 Fan', 'CG 160 Start', 'CG 160 Titan', 'CRF 190L', 'CRF 250F',
    'CRF 250L', 'CRF 250RX', 'CRF 300L', 'CRF 450R', 'CRF 450RX', 'CRF 1100L',
    'Elite 125', 'Forza 350', 'GL 1800 Gold Wing', 'NC 750X', 'NT 1100',
    'PCX 160', 'Pop 110i', 'Rebel 500', 'SH 150i', 'SH 300i', 'X-ADV',
    'XRE 190', 'XRE 300',
  ],
  'Husqvarna': [
    '701 Enduro', '701 Supermoto', 'FE 250', 'FE 350', 'FE 450', 'FE 501',
    'Norden 901', 'Svartpilen 401', 'Svartpilen 701', 'TC 125', 'TC 250',
    'TE 150i', 'TE 250i', 'TE 300i', 'Vitpilen 401', 'Vitpilen 701',
  ],
  'Indian': [
    'Challenger', 'Challenger Dark Horse', 'Chief', 'Chief Bobber', 'Chief Dark Horse',
    'Chieftain', 'Chieftain Dark Horse', 'FTR', 'FTR Rally', 'FTR S', 'Pursuit',
    'Roadmaster', 'Scout', 'Scout Bobber', 'Scout Rogue', 'Springfield',
    'Super Chief', 'Vintage',
  ],
  'Kawasaki': [
    'ER-6n', 'H2', 'H2 Carbon', 'H2 SX', 'H2 SX SE', 'KLR 650', 'KLX 110',
    'KLX 140', 'KLX 230', 'KLX 300', 'KX 250', 'KX 450', 'Ninja 300',
    'Ninja 400', 'Ninja 650', 'Ninja 1000SX', 'Ninja H2', 'Ninja ZX-4R',
    'Ninja ZX-6R', 'Ninja ZX-10R', 'Ninja ZX-10RR', 'Ninja ZX-14R', 'Versys 650',
    'Versys 1000', 'Versys-X 300', 'Vulcan 650 S', 'Vulcan 900', 'W800',
    'Z400', 'Z650', 'Z650RS', 'Z900', 'Z900RS', 'Z H2', 'ZX-4RR',
  ],
  'KTM': [
    '125 Duke', '200 Duke', '250 Adventure', '250 Duke', '390 Adventure',
    '390 Duke', '690 Enduro R', '690 SMC R', '790 Adventure', '790 Duke',
    '890 Adventure', '890 Duke', '890 Duke R', '1290 Super Adventure',
    '1290 Super Duke GT', '1290 Super Duke R', 'EXC-F 250', 'EXC-F 350',
    'EXC-F 450', 'EXC-F 500', 'RC 390', 'SX-F 250', 'SX-F 350', 'SX-F 450',
  ],
  'Royal Enfield': [
    'Bullet 350', 'Classic 350', 'Continental GT 650', 'Himalayan',
    'Hunter 350', 'Interceptor 650', 'Meteor 350', 'Scram 411', 'Super Meteor 650',
  ],
  'Shineray': [
    'Jet 50', 'Jet 125', 'Phoenix 50', 'Phoenix Gold', 'Retro 50', 'Worker 125',
    'XY 50Q', 'XY 150-5', 'XY 200-5',
  ],
  'Suzuki': [
    'Address 125', 'Burgman 125', 'Burgman 400', 'Burgman 650', 'DR-Z 400',
    'GSX-R 750', 'GSX-R 1000', 'GSX-R 1000R', 'GSX-S 750', 'GSX-S 1000',
    'GSX-S 1000F', 'GSX-S 1000GT', 'Hayabusa', 'Intruder 125', 'Katana',
    'RM-Z 250', 'RM-Z 450', 'SV 650', 'V-Strom 250', 'V-Strom 650',
    'V-Strom 650 XT', 'V-Strom 1050', 'V-Strom 1050 DE',
  ],
  'Triumph': [
    'Bobber', 'Bonneville Bobber', 'Bonneville Speedmaster', 'Bonneville T100',
    'Bonneville T120', 'Daytona 660', 'Daytona Moto2 765', 'Rocket 3',
    'Rocket 3 GT', 'Rocket 3 R', 'Scrambler 400 X', 'Scrambler 900',
    'Scrambler 1200', 'Speed 400', 'Speed Triple 1200', 'Speed Triple 1200 RR',
    'Speed Triple 1200 RS', 'Speed Twin 900', 'Speed Twin 1200', 'Street Scrambler',
    'Street Triple', 'Street Triple R', 'Street Triple RS', 'Thruxton RS',
    'Tiger 660 Sport', 'Tiger 850 Sport', 'Tiger 900', 'Tiger 900 GT',
    'Tiger 900 Rally', 'Tiger 1200', 'Tiger 1200 GT', 'Tiger 1200 Rally',
    'Trident 660',
  ],
  'Yamaha': [
    'Crosser 150', 'Crosser 150 S', 'Crosser 150 Z', 'Crypton 115', 'Factor 125',
    'Factor 150', 'Fazer 150', 'Fazer 250', 'FZ25', 'Lander 250', 'MT-03',
    'MT-07', 'MT-09', 'MT-09 SP', 'MT-10', 'MT-10 SP', 'Neo 125', 'NMAX 160',
    'NMAX 160 ABS', 'R1', 'R1M', 'R3', 'R6', 'R7', 'Tenere 250', 'Tenere 700',
    'Tenere 700 Rally', 'Tracer 9', 'Tracer 9 GT', 'Tracer 9 GT+', 'WR 250F',
    'WR 450F', 'XJ6', 'XJ6 F', 'XJ6 N', 'XMax 250', 'XSR 155', 'XSR 700',
    'XSR 900', 'XTZ 125', 'XTZ 150', 'XTZ 250', 'YBR 125', 'YBR 150', 'YZ 125',
    'YZ 250', 'YZ 250F', 'YZ 450F', 'YZF-R1', 'YZF-R3', 'YZF-R6', 'YZF-R7',
  ],
};

// ============================================================================
// MODELOS POR MARCA - TRATORES E MÁQUINAS AGRÍCOLAS
// ============================================================================

export const TRACTOR_MODELS: Record<string, string[]> = {
  'Case IH': [
    'Farmall 80', 'Farmall 90', 'Farmall 100A', 'Farmall 110A', 'Farmall 130A',
    'Maxxum 115', 'Maxxum 125', 'Maxxum 135', 'Maxxum 145', 'Maxxum 150',
    'Maxxum 165', 'Maxxum 180', 'Puma 150', 'Puma 165', 'Puma 185', 'Puma 200',
    'Puma 220', 'Puma 240', 'Magnum 250', 'Magnum 280', 'Magnum 310', 'Magnum 340',
    'Magnum 380', 'Magnum 400', 'Steiger 370', 'Steiger 420', 'Steiger 470',
    'Steiger 500', 'Steiger 540', 'Steiger 580', 'Steiger 620',
  ],
  'John Deere': [
    '5055E', '5065E', '5075E', '5078E', '5085E', '5090E', '5100E', '5310',
    '5405', '5605', '5705', '6100J', '6110J', '6125J', '6130J', '6145J',
    '6155J', '6165J', '6175J', '6190J', '6195J', '6205J', '6215R', '6230R',
    '6250R', '7200J', '7210J', '7215J', '7225J', '7230J', '7250J', '7290R',
    '7310R', '7330', '8245R', '8270R', '8295R', '8320R', '8345R', '8370R',
    '8400R', '9370R', '9420R', '9470R', '9520R', '9570R', '9620R',
  ],
  'Massey Ferguson': [
    'MF 4275', 'MF 4283', 'MF 4291', 'MF 4292', 'MF 4297', 'MF 4299',
    'MF 4707', 'MF 4708', 'MF 4709', 'MF 5709', 'MF 5710', 'MF 5711',
    'MF 5712', 'MF 5713', 'MF 6711', 'MF 6712', 'MF 6713', 'MF 7180',
    'MF 7350', 'MF 7370', 'MF 7390', 'MF 7415', 'MF 7719', 'MF 7720',
    'MF 7722', 'MF 7724', 'MF 7726', 'MF 8727', 'MF 8730', 'MF 8732',
    'MF 8735', 'MF 8737',
  ],
  'New Holland': [
    'T4.75', 'T4.85', 'T4.95', 'T4.105', 'T5.80', 'T5.90', 'T5.100', 'T5.110',
    'T5.120', 'T6.110', 'T6.120', 'T6.130', 'T6.140', 'T6.150', 'T6.160',
    'T6.175', 'T7.175', 'T7.190', 'T7.210', 'T7.225', 'T7.245', 'T7.260',
    'T7.270', 'T7.290', 'T7.315', 'T8.320', 'T8.350', 'T8.380', 'T8.410',
    'T8.435', 'T9.390', 'T9.435', 'T9.480', 'T9.530', 'T9.565', 'T9.600',
    'T9.645', 'T9.700', 'TL 75E', 'TL 85E', 'TL 95E', 'TL 100', 'TT 3840',
    'TT 3880', 'TT 4030', 'TT 4050', 'TT 4060', 'TT 4070', 'TT 4090',
  ],
  'Valtra': [
    'A74', 'A84', 'A94', 'A104', 'A114', 'A124', 'A134', 'A144', 'A154',
    'BF 65', 'BF 75', 'BH 154', 'BH 174', 'BH 180', 'BH 194', 'BH 214',
    'BM 85', 'BM 100', 'BM 110', 'BM 125i', 'S232', 'S262', 'S274', 'S292',
    'S322', 'S352', 'S374', 'S394',
  ],
};

export const AGRICULTURAL_MODELS: Record<string, string[]> = {
  'Case IH': [
    'Axial-Flow 4130', 'Axial-Flow 5130', 'Axial-Flow 6130', 'Axial-Flow 7130',
    'Axial-Flow 7230', 'Axial-Flow 7250', 'Axial-Flow 8230', 'Axial-Flow 8250',
    'Axial-Flow 9230', 'Axial-Flow 9250', 'A8800', 'A8810', 'Austoft 8000',
    'Austoft 8800', 'Patriot 250', 'Patriot 350', 'Patriot 3230', 'Patriot 4430',
  ],
  'CLAAS': [
    'Arion 410', 'Arion 420', 'Arion 430', 'Arion 440', 'Arion 450', 'Arion 460',
    'Arion 510', 'Arion 520', 'Arion 530', 'Arion 540', 'Arion 550', 'Arion 560',
    'Arion 610', 'Arion 620', 'Arion 630', 'Arion 640', 'Arion 650', 'Arion 660',
    'Axion 810', 'Axion 820', 'Axion 830', 'Axion 840', 'Axion 850', 'Axion 870',
    'Axion 920', 'Axion 930', 'Axion 940', 'Axion 950', 'Axion 960', 'Jaguar 830',
    'Jaguar 840', 'Jaguar 850', 'Jaguar 860', 'Jaguar 870', 'Jaguar 880', 'Jaguar 890',
    'Jaguar 930', 'Jaguar 940', 'Jaguar 950', 'Jaguar 960', 'Jaguar 970', 'Jaguar 980',
    'Lexion 5300', 'Lexion 5400', 'Lexion 5500', 'Lexion 6600', 'Lexion 6700',
    'Lexion 6800', 'Lexion 6900', 'Lexion 7400', 'Lexion 7500', 'Lexion 7600',
    'Lexion 7700', 'Lexion 8600', 'Lexion 8700', 'Lexion 8800', 'Lexion 8900',
    'Tucano 320', 'Tucano 330', 'Tucano 340', 'Tucano 420', 'Tucano 430', 'Tucano 440',
    'Tucano 450', 'Tucano 560', 'Tucano 570', 'Tucano 580',
  ],
  'John Deere': [
    'S440', 'S540', 'S550', 'S660', 'S670', 'S680', 'S690', 'S760', 'S770',
    'S780', 'S790', 'T550', 'T560', 'T660', 'T670', 'W540', 'W550', 'W650',
    'W660', 'X9 1000', 'X9 1100', 'CH570', 'CH670', 'CP690', '3520', '3522',
    '4730', 'M4025', 'M4030', 'R4023', 'R4030', 'R4038', 'R4045',
  ],
  'Massey Ferguson': [
    'MF 32', 'MF 34', 'MF 36', 'MF 38', 'MF 5650', 'MF 5690', 'MF 6690',
    'MF 7370', 'MF 9690', 'MF 9790', 'MF 9895', 'Activa 7240', 'Activa 7244',
    'Activa 7245', 'Activa 7347', 'Ideal 7', 'Ideal 8', 'Ideal 9', 'Ideal 10',
  ],
  'New Holland': [
    'BC5050', 'BC5060', 'BC5070', 'BC5080', 'BigBaler 230', 'BigBaler 330',
    'BigBaler 340', 'BigBaler 870', 'BigBaler 890', 'BigBaler 1270', 'BigBaler 1290',
    'CR5.85', 'CR6.80', 'CR6.90', 'CR7.80', 'CR7.90', 'CR8.80', 'CR8.90',
    'CR9.80', 'CR9.90', 'CR10.90', 'CX5.80', 'CX5.90', 'CX6.80', 'CX6.90',
    'CX7.80', 'CX7.90', 'CX8.70', 'CX8.80', 'CX8.85', 'CX8.90', 'FR480',
    'FR550', 'FR650', 'FR780', 'FR850', 'FR920', 'TC4.90', 'TC5.70', 'TC5.80',
    'TC5.90', 'TC5050', 'TC5070', 'TC5090',
  ],
};

// ============================================================================
// CATEGORIAS DE PEÇAS COMPLETAS
// ============================================================================

export const COMPLETE_PART_CATEGORIES = {
  // MOTOR
  engine: {
    label: 'Motor',
    subcategories: [
      'Bloco do Motor', 'Cabeçote', 'Pistão', 'Biela', 'Virabrequim', 'Árvore de Comando',
      'Válvulas', 'Molas de Válvula', 'Tuchos', 'Balancins', 'Correia Dentada',
      'Correia Poly-V', 'Tensor de Correia', 'Bomba de Óleo', 'Carter', 'Junta do Cabeçote',
      'Junta do Carter', 'Retentor de Válvula', 'Bronzinas', 'Anéis de Pistão',
      'Volante do Motor', 'Coletor de Admissão', 'Coletor de Escape', 'Turbocompressor',
      'Intercooler', 'Coxim do Motor', 'Suporte do Motor',
    ],
  },
  // TRANSMISSÃO
  transmission: {
    label: 'Transmissão',
    subcategories: [
      'Caixa de Câmbio', 'Embreagem', 'Platô', 'Disco de Embreagem', 'Rolamento de Embreagem',
      'Cabo de Embreagem', 'Cilindro Mestre de Embreagem', 'Cilindro Auxiliar de Embreagem',
      'Sincronizador', 'Engrenagem', 'Eixo Primário', 'Eixo Secundário', 'Garfo de Embreagem',
      'Alavanca de Câmbio', 'Trambulador', 'Junta Homocinética', 'Coifa Homocinética',
      'Semieixo', 'Diferencial', 'Coroa e Pinhão', 'Caixa de Transferência', 'Cardã',
      'Cruzeta', 'Mancal Central', 'Conversor de Torque', 'Válvula do Câmbio Automático',
    ],
  },
  // FREIOS
  brakes: {
    label: 'Freios',
    subcategories: [
      'Pastilha de Freio Dianteira', 'Pastilha de Freio Traseira', 'Disco de Freio Dianteiro',
      'Disco de Freio Traseiro', 'Tambor de Freio', 'Lona de Freio', 'Sapata de Freio',
      'Pinça de Freio', 'Cilindro de Roda', 'Cilindro Mestre de Freio', 'Servo Freio',
      'Bomba de Vácuo', 'Flexível de Freio', 'Tubo de Freio', 'Sensor ABS', 'Módulo ABS',
      'Cabo de Freio de Mão', 'Alavanca de Freio de Mão', 'Regulador de Freio',
      'Reparo de Pinça', 'Reparo de Cilindro Mestre', 'Fluido de Freio DOT 3',
      'Fluido de Freio DOT 4', 'Fluido de Freio DOT 5.1',
    ],
  },
  // SUSPENSÃO
  suspension: {
    label: 'Suspensão',
    subcategories: [
      'Amortecedor Dianteiro', 'Amortecedor Traseiro', 'Mola Dianteira', 'Mola Traseira',
      'Mola Pneumática', 'Batente de Suspensão', 'Coifa de Amortecedor', 'Coxim de Amortecedor',
      'Bandeja de Suspensão', 'Pivô de Suspensão', 'Bieleta', 'Barra Estabilizadora',
      'Bucha de Suspensão', 'Braço de Suspensão', 'Manga de Eixo', 'Cubo de Roda',
      'Rolamento de Roda', 'Terminal de Direção', 'Barra de Direção', 'Caixa de Direção',
      'Bomba de Direção Hidráulica', 'Reservatório de Direção', 'Mangueira de Direção',
      'Coluna de Direção', 'Junta Elástica de Direção', 'Fole de Direção',
    ],
  },
  // ELÉTRICA
  electrical: {
    label: 'Elétrica',
    subcategories: [
      'Bateria', 'Alternador', 'Motor de Partida', 'Vela de Ignição', 'Bobina de Ignição',
      'Cabo de Vela', 'Distribuidor', 'Módulo de Ignição', 'Sensor de Rotação',
      'Sensor de Fase', 'Sensor de Temperatura', 'Sensor de Pressão de Óleo',
      'Sensor de Oxigênio (Sonda Lambda)', 'Sensor MAP', 'Sensor MAF', 'Sensor TPS',
      'Sensor de Detonação', 'Sensor de Velocidade', 'Sensor de Estacionamento',
      'Central Eletrônica (ECU)', 'Relé', 'Fusível', 'Chicote Elétrico', 'Interruptor',
      'Chave de Seta', 'Chave de Luz', 'Comutador de Ignição', 'Motor do Limpador',
      'Motor do Vidro Elétrico', 'Motor da Trava Elétrica', 'Buzina', 'Farol',
      'Lanterna', 'Lâmpada', 'Farol de Milha', 'Farol de Neblina',
    ],
  },
  // ARREFECIMENTO
  cooling: {
    label: 'Arrefecimento',
    subcategories: [
      'Radiador', 'Bomba d\'Água', 'Válvula Termostática', 'Ventoinha', 'Motor da Ventoinha',
      'Interruptor da Ventoinha', 'Mangueira do Radiador Superior', 'Mangueira do Radiador Inferior',
      'Reservatório de Expansão', 'Tampa do Reservatório', 'Tampa do Radiador',
      'Sensor de Temperatura do Radiador', 'Aquecedor', 'Válvula do Aquecedor',
      'Mangueira do Aquecedor', 'Intercooler', 'Radiador de Óleo', 'Líquido de Arrefecimento',
      'Aditivo de Radiador',
    ],
  },
  // COMBUSTÍVEL
  fuel: {
    label: 'Combustível',
    subcategories: [
      'Bomba de Combustível Elétrica', 'Bomba de Combustível Mecânica', 'Bomba de Alta Pressão',
      'Bico Injetor', 'Corpo de Borboleta', 'Sensor de Nível de Combustível', 'Boia de Combustível',
      'Tanque de Combustível', 'Filtro de Combustível', 'Regulador de Pressão', 'Galeria de Combustível',
      'Mangueira de Combustível', 'Válvula de Combustível', 'Carburador', 'Agulha do Carburador',
      'Boia do Carburador', 'Gicle', 'Coletor de Admissão', 'Junta do Coletor',
    ],
  },
  // ESCAPE
  exhaust: {
    label: 'Escape',
    subcategories: [
      'Coletor de Escape', 'Catalisador', 'Silencioso Dianteiro', 'Silencioso Intermediário',
      'Silencioso Traseiro', 'Tubo de Escape', 'Flexível de Escape', 'Abraçadeira de Escape',
      'Suporte de Escape', 'Borracha de Escape', 'Sensor de Oxigênio', 'Válvula EGR',
      'Filtro de Partículas (DPF)', 'Sistema SCR', 'Tanque de Arla 32',
    ],
  },
  // FILTROS
  filters: {
    label: 'Filtros',
    subcategories: [
      'Filtro de Óleo', 'Filtro de Ar do Motor', 'Filtro de Combustível', 'Filtro de Cabine',
      'Filtro de Cabine com Carvão Ativado', 'Filtro de Ar Condicionado', 'Filtro de Câmbio',
      'Filtro de Direção Hidráulica', 'Filtro Secador', 'Filtro de Partículas',
      'Elemento Filtrante', 'Pré-Filtro de Combustível', 'Separador de Água',
    ],
  },
  // ÓLEOS E FLUIDOS
  oils: {
    label: 'Óleos e Fluidos',
    subcategories: [
      'Óleo de Motor 0W-20', 'Óleo de Motor 5W-30', 'Óleo de Motor 5W-40', 'Óleo de Motor 10W-40',
      'Óleo de Motor 15W-40', 'Óleo de Motor 20W-50', 'Óleo de Motor Diesel', 'Óleo Sintético',
      'Óleo Semi-Sintético', 'Óleo Mineral', 'Óleo de Câmbio Manual', 'Óleo de Câmbio Automático',
      'Óleo ATF', 'Óleo CVT', 'Óleo de Diferencial', 'Óleo de Direção Hidráulica',
      'Fluido de Freio DOT 3', 'Fluido de Freio DOT 4', 'Fluido de Freio DOT 5.1',
      'Líquido de Arrefecimento', 'Aditivo de Radiador', 'Água Destilada', 'Arla 32',
      'Graxa', 'Fluido de Embreagem', 'Óleo de Motor 2 Tempos',
    ],
  },
  // PNEUS E RODAS
  tires: {
    label: 'Pneus e Rodas',
    subcategories: [
      'Pneu 175/65 R14', 'Pneu 175/70 R13', 'Pneu 185/65 R15', 'Pneu 195/55 R15',
      'Pneu 195/65 R15', 'Pneu 205/55 R16', 'Pneu 205/60 R16', 'Pneu 215/55 R17',
      'Pneu 225/45 R17', 'Pneu 225/50 R17', 'Pneu 235/55 R18', 'Pneu 235/60 R18',
      'Pneu 245/45 R19', 'Pneu 255/55 R19', 'Pneu 265/65 R17', 'Pneu 265/70 R16',
      'Pneu 275/55 R20', 'Pneu 285/70 R17', 'Pneu de Caminhão', 'Pneu de Moto',
      'Roda de Liga Leve', 'Roda de Aço', 'Calota', 'Parafuso de Roda', 'Porca de Roda',
      'Válvula de Pneu', 'Câmara de Ar', 'Protetor de Aro', 'Balanceamento',
    ],
  },
  // CARROCERIA
  body: {
    label: 'Carroceria',
    subcategories: [
      'Para-choque Dianteiro', 'Para-choque Traseiro', 'Grade Dianteira', 'Capô',
      'Para-lama Dianteiro', 'Para-lama Traseiro', 'Porta Dianteira', 'Porta Traseira',
      'Tampa do Porta-malas', 'Tampa Traseira', 'Teto', 'Coluna A', 'Coluna B', 'Coluna C',
      'Longarina', 'Assoalho', 'Caixa de Roda', 'Painel Dianteiro', 'Painel Traseiro',
      'Travessa', 'Suporte de Para-choque', 'Spoiler', 'Aerofólio', 'Rack de Teto',
      'Estribo', 'Santantônio', 'Capota Marítima', 'Engate de Reboque',
    ],
  },
  // VIDROS
  glass: {
    label: 'Vidros',
    subcategories: [
      'Para-brisa', 'Vidro Traseiro', 'Vidro da Porta Dianteira', 'Vidro da Porta Traseira',
      'Vidro Lateral Fixo', 'Vidro do Teto Solar', 'Retrovisor Interno', 'Retrovisor Externo',
      'Espelho do Retrovisor', 'Capa do Retrovisor', 'Limpador de Para-brisa',
      'Palheta do Limpador', 'Braço do Limpador', 'Motor do Limpador', 'Reservatório do Limpador',
      'Bomba do Limpador', 'Bico do Limpador', 'Borracha de Vedação',
    ],
  },
  // INTERIOR
  interior: {
    label: 'Interior',
    subcategories: [
      'Banco Dianteiro', 'Banco Traseiro', 'Encosto de Cabeça', 'Cinto de Segurança',
      'Fivela do Cinto', 'Airbag', 'Volante', 'Manopla de Câmbio', 'Freio de Mão',
      'Painel de Instrumentos', 'Velocímetro', 'Conta-giros', 'Marcador de Combustível',
      'Marcador de Temperatura', 'Console Central', 'Porta-luvas', 'Porta-objetos',
      'Tapete', 'Carpete', 'Forro de Teto', 'Forro de Porta', 'Maçaneta Interna',
      'Maçaneta Externa', 'Puxador', 'Descanso de Braço', 'Quebra-sol', 'Espelho de Cortesia',
    ],
  },
  // AR CONDICIONADO
  airConditioning: {
    label: 'Ar Condicionado',
    subcategories: [
      'Compressor do Ar', 'Condensador', 'Evaporador', 'Válvula de Expansão', 'Filtro Secador',
      'Pressostato', 'Mangueira do Ar', 'Embreagem do Compressor', 'Polia do Compressor',
      'Ventilador do Condensador', 'Motor do Ventilador', 'Resistência do Ventilador',
      'Painel de Controle', 'Cabo do Ar', 'Caixa de Ar', 'Gás R134a', 'Gás R1234yf',
      'Óleo do Compressor', 'Sensor de Temperatura do Ar', 'Atuador de Ar',
    ],
  },
  // ACESSÓRIOS
  accessories: {
    label: 'Acessórios',
    subcategories: [
      'Alarme', 'Trava Elétrica', 'Vidro Elétrico', 'Retrovisor Elétrico', 'Sensor de Ré',
      'Câmera de Ré', 'Central Multimídia', 'DVD Player', 'Alto-falante', 'Subwoofer',
      'Amplificador', 'Antena', 'GPS', 'Rastreador', 'Película', 'Protetor de Carter',
      'Protetor de Cárter', 'Defletor de Chuva', 'Calha de Chuva', 'Friso Lateral',
      'Soleira', 'Tapete de Borracha', 'Capa de Banco', 'Volante Esportivo',
      'Pedal Esportivo', 'Manopla Esportiva', 'Encosto de Cabeça com DVD',
    ],
  },
};

// ============================================================================
// MARCAS DE PEÇAS COMPLETAS
// ============================================================================

export const COMPLETE_PART_BRANDS = {
  // FILTROS
  filters: [
    'Bosch', 'Fram', 'Mahle', 'Mann', 'Tecfil', 'Wega', 'Hengst', 'Knecht',
    'Purflux', 'Filtron', 'UFI', 'Sofima', 'Sakura', 'Ryco', 'K&N', 'BMC',
  ],
  // FREIOS
  brakes: [
    'Bosch', 'TRW', 'ATE', 'Brembo', 'Ferodo', 'Cobreq', 'Fras-le', 'Jurid',
    'Bendix', 'Raybestos', 'EBC', 'Hawk', 'StopTech', 'Wilwood', 'AP Racing',
  ],
  // SUSPENSÃO E DIREÇÃO
  suspension: [
    'Monroe', 'Cofap', 'Kayaba', 'Sachs', 'Bilstein', 'Koni', 'Gabriel',
    'Rancho', 'Fox', 'King', 'Eibach', 'H&R', 'Tein', 'KW', 'Ohlins',
    'Moog', 'TRW', 'Lemförder', 'Meyle', 'Febi Bilstein',
  ],
  // ELÉTRICA E IGNIÇÃO
  electrical: [
    'Bosch', 'Denso', 'Delphi', 'NGK', 'Champion', 'ACDelco', 'Valeo',
    'Hella', 'Magneti Marelli', 'Beru', 'Bremi', 'Hitachi', 'Mitsubishi Electric',
    'Moura', 'Heliar', 'ACDelco', 'Varta', 'Exide', 'Optima', 'Yuasa',
  ],
  // ARREFECIMENTO
  cooling: [
    'Valeo', 'Denso', 'Behr', 'Nissens', 'Modine', 'Delphi', 'Gates',
    'Dayco', 'Continental', 'SKF', 'GMB', 'Aisin', 'NPW',
  ],
  // CORREIAS E TENSORES
  belts: [
    'Gates', 'Dayco', 'Continental', 'Goodyear', 'Bando', 'Mitsuboshi',
    'SKF', 'INA', 'Litens', 'NSK', 'NTN', 'Koyo',
  ],
  // EMBREAGEM
  clutch: [
    'Valeo', 'Sachs', 'LuK', 'Exedy', 'Aisin', 'ACDelco', 'Eaton',
    'Borg & Beck', 'Quinton Hazell', 'Blue Print',
  ],
  // ÓLEOS E LUBRIFICANTES
  oils: [
    'Mobil', 'Shell', 'Castrol', 'Petronas', 'Total', 'Valvoline', 'Motul',
    'Liqui Moly', 'Fuchs', 'Gulf', 'Ipiranga', 'Lubrax', 'Texaco', 'Havoline',
    'Pennzoil', 'Quaker State', 'Red Line', 'Royal Purple', 'Amsoil',
  ],
  // PNEUS
  tires: [
    'Michelin', 'Bridgestone', 'Goodyear', 'Continental', 'Pirelli', 'Dunlop',
    'Firestone', 'Yokohama', 'Hankook', 'Kumho', 'Toyo', 'Falken', 'BFGoodrich',
    'General Tire', 'Cooper', 'Nitto', 'Nexen', 'Maxxis', 'Achilles', 'Linglong',
  ],
  // ILUMINAÇÃO
  lighting: [
    'Philips', 'Osram', 'Hella', 'Bosch', 'Valeo', 'Magneti Marelli', 'Depo',
    'TYC', 'Arteb', 'Fitam', 'GE', 'Sylvania', 'Narva',
  ],
  // INJEÇÃO ELETRÔNICA
  injection: [
    'Bosch', 'Delphi', 'Denso', 'Continental', 'Magneti Marelli', 'Hitachi',
    'Keihin', 'Siemens VDO', 'Marwal', 'Rochester',
  ],
  // JUNTAS E RETENTORES
  gaskets: [
    'Victor Reinz', 'Elring', 'Fel-Pro', 'Ajusa', 'Payen', 'Corteco', 'Sabó',
    'NOK', 'SKF', 'National', 'Timken', 'FAG',
  ],
  // ROLAMENTOS
  bearings: [
    'SKF', 'FAG', 'NSK', 'NTN', 'Koyo', 'Timken', 'INA', 'SNR', 'NACHI',
    'IKO', 'THK', 'Torrington',
  ],
  // BOMBAS
  pumps: [
    'Bosch', 'Delphi', 'Denso', 'Continental', 'Pierburg', 'Airtex', 'Carter',
    'Walbro', 'TI Automotive', 'GMB', 'Aisin', 'NPW', 'Graf',
  ],
  // ESCAPAMENTO
  exhaust: [
    'Walker', 'Bosal', 'Fonos', 'Cofap', 'Delphi', 'Magneti Marelli',
    'Eberspächer', 'Faurecia', 'Tenneco', 'Borla', 'MagnaFlow', 'Flowmaster',
  ],
  // CARROCERIA
  body: [
    'Fiat Original', 'GM Original', 'VW Original', 'Ford Original', 'Toyota Original',
    'Honda Original', 'Hyundai Original', 'Renault Original', 'Peugeot Original',
    'Citroën Original', 'Jeep Original', 'Nissan Original', 'Mitsubishi Original',
    'Kia Original', 'Mercedes Original', 'BMW Original', 'Audi Original',
  ],
};

// ============================================================================
// FUNÇÃO PARA OBTER TODOS OS MODELOS DE UMA MARCA
// ============================================================================

export function getModelsByMake(make: string, vehicleType?: VehicleType): string[] {
  const allModels: string[] = [];

  // Carros
  if (!vehicleType || vehicleType === 'car') {
    if (CAR_MODELS[make]) {
      allModels.push(...CAR_MODELS[make]);
    }
  }

  // Pick-ups
  if (!vehicleType || vehicleType === 'pickup') {
    if (PICKUP_MODELS[make]) {
      allModels.push(...PICKUP_MODELS[make]);
    }
  }

  // Caminhões
  if (!vehicleType || vehicleType === 'truck') {
    if (TRUCK_MODELS[make]) {
      allModels.push(...TRUCK_MODELS[make]);
    }
  }

  // Vans
  if (!vehicleType || vehicleType === 'van') {
    if (VAN_MODELS[make]) {
      allModels.push(...VAN_MODELS[make]);
    }
  }

  // Ônibus
  if (!vehicleType || vehicleType === 'bus') {
    if (BUS_MODELS[make]) {
      allModels.push(...BUS_MODELS[make]);
    }
  }

  // Motos
  if (!vehicleType || vehicleType === 'motorcycle') {
    if (MOTORCYCLE_MODELS[make]) {
      allModels.push(...MOTORCYCLE_MODELS[make]);
    }
  }

  // Tratores
  if (!vehicleType || vehicleType === 'tractor') {
    if (TRACTOR_MODELS[make]) {
      allModels.push(...TRACTOR_MODELS[make]);
    }
  }

  // Máquinas Agrícolas
  if (!vehicleType || vehicleType === 'agricultural') {
    if (AGRICULTURAL_MODELS[make]) {
      allModels.push(...AGRICULTURAL_MODELS[make]);
    }
  }

  // Remove duplicatas e ordena
  return [...new Set(allModels)].sort();
}

// ============================================================================
// FUNÇÃO PARA OBTER TODAS AS MARCAS
// ============================================================================

export function getAllMakes(vehicleType?: VehicleType): string[] {
  if (vehicleType) {
    return VEHICLE_MAKES[vehicleType] || [];
  }

  // Retorna todas as marcas únicas de todos os tipos
  const allMakes = new Set<string>();
  Object.values(VEHICLE_MAKES).forEach(makes => {
    makes.forEach(make => allMakes.add(make));
  });

  return [...allMakes].sort();
}

// ============================================================================
// FUNÇÃO PARA BUSCAR PEÇAS POR NOME
// ============================================================================

export function searchPartTypes(query: string): Array<{ name: string; category: string; subcategory: string }> {
  const results: Array<{ name: string; category: string; subcategory: string }> = [];
  const queryLower = query.toLowerCase();

  Object.entries(COMPLETE_PART_CATEGORIES).forEach(([category, data]) => {
    data.subcategories.forEach(subcategory => {
      if (subcategory.toLowerCase().includes(queryLower)) {
        results.push({
          name: subcategory,
          category,
          subcategory: data.label,
        });
      }
    });
  });

  return results;
}

// ============================================================================
// FUNÇÃO PARA OBTER MARCAS DE PEÇAS POR CATEGORIA
// ============================================================================

export function getPartBrandsByCategory(category: string): string[] {
  const categoryMap: Record<string, keyof typeof COMPLETE_PART_BRANDS> = {
    filters: 'filters',
    brakes: 'brakes',
    suspension: 'suspension',
    electrical: 'electrical',
    cooling: 'cooling',
    engine: 'belts',
    transmission: 'clutch',
    oils: 'oils',
    tires: 'tires',
    body: 'body',
    exhaust: 'exhaust',
    fuel: 'injection',
  };

  const brandCategory = categoryMap[category];
  if (brandCategory && COMPLETE_PART_BRANDS[brandCategory]) {
    return COMPLETE_PART_BRANDS[brandCategory];
  }

  // Retorna marcas genéricas se não encontrar categoria específica
  return [
    'Bosch', 'Delphi', 'Denso', 'Valeo', 'Continental', 'SKF', 'Gates',
    'Mahle', 'Mann', 'TRW', 'Monroe', 'Sachs', 'NGK', 'Philips',
  ];
}

// ============================================================================
// ESTATÍSTICAS DA BASE DE DADOS
// ============================================================================

export const DATABASE_STATS = {
  totalMakes: getAllMakes().length,
  totalCarModels: Object.values(CAR_MODELS).flat().length,
  totalPickupModels: Object.values(PICKUP_MODELS).flat().length,
  totalTruckModels: Object.values(TRUCK_MODELS).flat().length,
  totalVanModels: Object.values(VAN_MODELS).flat().length,
  totalBusModels: Object.values(BUS_MODELS).flat().length,
  totalMotorcycleModels: Object.values(MOTORCYCLE_MODELS).flat().length,
  totalTractorModels: Object.values(TRACTOR_MODELS).flat().length,
  totalAgriculturalModels: Object.values(AGRICULTURAL_MODELS).flat().length,
  totalPartCategories: Object.keys(COMPLETE_PART_CATEGORIES).length,
  totalPartSubcategories: Object.values(COMPLETE_PART_CATEGORIES).reduce(
    (acc, cat) => acc + cat.subcategories.length, 0
  ),
  totalPartBrands: Object.values(COMPLETE_PART_BRANDS).flat().length,
};
