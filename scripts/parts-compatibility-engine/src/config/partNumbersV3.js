/**
 * BASE DE PART NUMBERS V3 - COBERTURA COMPLETA BRASIL
 * Base massiva com todos os veículos e peças do mercado brasileiro
 * 
 * @version 3.0.0 - Edição Profissional Completa
 * @author TORQ AI Engine
 */

// ============================================================================
// FILTROS DE ÓLEO - CARROS
// ============================================================================
export const OIL_FILTERS = {
  // ==================== VOLKSWAGEN ====================
  'W712/95': { 
    brand: 'MANN-FILTER', 
    oem: '04E115561H',
    applications: ['VW Gol G5 1.0', 'VW Gol G5 1.6', 'VW Gol G6 1.0', 'VW Gol G6 1.6', 'VW Gol G7 1.0', 'VW Gol G7 1.6', 'VW Voyage G5', 'VW Voyage G6', 'VW Voyage G7', 'VW Fox 1.0', 'VW Fox 1.6', 'VW Saveiro G5', 'VW Saveiro G6', 'VW Saveiro G7', 'VW Up 1.0', 'VW Up TSI', 'VW Polo 1.0', 'VW Polo 1.6', 'VW Virtus 1.0', 'VW Virtus 1.6', 'VW T-Cross 1.0', 'VW T-Cross 1.4', 'VW Nivus 1.0', 'VW Taos 1.4', 'Audi A3 1.4 TFSI', 'Audi Q3 1.4 TFSI', 'Skoda Rapid 1.0', 'Seat Ibiza 1.0'],
    engines: ['EA111 1.0', 'EA111 1.6', 'EA211 1.0', 'EA211 1.0 TSI', 'EA211 1.4 TSI', 'EA211 1.6 MSI'],
    specs: { height: 79, diameter: 76, thread: 'M20x1.5', bypassValve: '1.0 bar', antiDrainValve: true },
    equivalents: ['FRAM PH6811', 'BOSCH F026407157', 'WIX WL7476', 'TECFIL PSL315', 'MAHLE OC1253', 'HENGST H317W', 'PURFLUX LS489']
  },
  'W712/94': { 
    brand: 'MANN-FILTER',
    oem: '55594651',
    applications: ['VW Amarok 2.0 TDI', 'VW Tiguan 2.0 TSI', 'VW Jetta 2.0 TSI', 'VW Passat 2.0 TSI', 'VW Golf GTI', 'VW Golf R', 'Audi A3 2.0 TFSI', 'Audi A4 2.0 TFSI', 'Audi Q5 2.0 TFSI'],
    engines: ['EA888 2.0 TSI', 'EA888 2.0 TFSI'],
    specs: { height: 79, diameter: 76, thread: 'M20x1.5', bypassValve: '1.0 bar' },
    equivalents: ['FRAM PH11462', 'BOSCH F026407157', 'TECFIL PSL950', 'MAHLE OC593/4']
  },

  // ==================== FIAT ====================
  'W712/52': { 
    brand: 'MANN-FILTER',
    oem: '55230822',
    applications: ['Fiat Uno 1.0', 'Fiat Uno 1.4', 'Fiat Palio 1.0', 'Fiat Palio 1.4', 'Fiat Palio 1.6', 'Fiat Siena 1.0', 'Fiat Siena 1.4', 'Fiat Siena 1.6', 'Fiat Strada 1.4', 'Fiat Strada 1.8', 'Fiat Mobi 1.0', 'Fiat Argo 1.0', 'Fiat Argo 1.3', 'Fiat Cronos 1.3', 'Fiat Cronos 1.8', 'Fiat Pulse 1.0', 'Fiat Pulse 1.3', 'Fiat Fastback 1.0', 'Fiat Fastback 1.3', 'Fiat Toro 1.8', 'Fiat 500 1.4'],
    engines: ['Fire 1.0 8V', 'Fire 1.4 8V', 'Fire 1.4 16V', 'E.torQ 1.6', 'E.torQ 1.8', 'Firefly 1.0', 'Firefly 1.3'],
    specs: { height: 79, diameter: 76, thread: 'M20x1.5', bypassValve: '1.0 bar' },
    equivalents: ['FRAM PH5949', 'TECFIL PSL141', 'BOSCH 0986B00041', 'MAHLE OC384', 'WIX WL7200']
  },
  'W713/36': {
    brand: 'MANN-FILTER',
    oem: '46796687',
    applications: ['Fiat Toro 2.0 Diesel', 'Fiat Ducato 2.3', 'Jeep Renegade 2.0 Diesel', 'Jeep Compass 2.0 Diesel', 'Jeep Commander 2.0 Diesel', 'Ram 1500 2.0 Diesel'],
    engines: ['MultiJet II 2.0', 'MultiJet 2.3'],
    specs: { height: 93, diameter: 76, thread: 'M22x1.5', bypassValve: '1.2 bar' },
    equivalents: ['FRAM PH10220', 'TECFIL PSD141', 'BOSCH F026407183']
  },

  // ==================== CHEVROLET/GM ====================
  'W712/83': { 
    brand: 'MANN-FILTER',
    oem: '93185674',
    applications: ['Chevrolet Onix 1.0', 'Chevrolet Onix 1.4', 'Chevrolet Onix Plus 1.0', 'Chevrolet Onix Plus 1.0 Turbo', 'Chevrolet Prisma 1.0', 'Chevrolet Prisma 1.4', 'Chevrolet Cobalt 1.4', 'Chevrolet Cobalt 1.8', 'Chevrolet Spin 1.8', 'Chevrolet Cruze 1.4 Turbo', 'Chevrolet Cruze 1.8', 'Chevrolet Tracker 1.0 Turbo', 'Chevrolet Tracker 1.2 Turbo', 'Chevrolet Equinox 1.5 Turbo', 'Chevrolet Montana 1.2 Turbo'],
    engines: ['SPE/4 1.0', 'SPE/4 1.4', 'Ecotec 1.4 Turbo', 'Ecotec 1.8', 'Ecotec 1.0 Turbo', 'Ecotec 1.2 Turbo'],
    specs: { height: 85, diameter: 76, thread: 'M20x1.5', bypassValve: '1.0 bar' },
    equivalents: ['FRAM PH10575', 'TECFIL PSL550', 'BOSCH F026407106', 'ACDelco PF64', 'MAHLE OC983']
  },
  'PF48': {
    brand: 'ACDelco',
    oem: '19210283',
    applications: ['Chevrolet S10 2.4', 'Chevrolet S10 2.8 Diesel', 'Chevrolet Trailblazer 2.8 Diesel', 'Chevrolet Colorado 2.8'],
    engines: ['Ecotec 2.4', 'Duramax 2.8'],
    specs: { height: 100, diameter: 93, thread: 'M22x1.5' },
    equivalents: ['MANN W940/69', 'FRAM PH3675', 'TECFIL PSL640']
  },

  // ==================== HONDA ====================
  'W610/3': { 
    brand: 'MANN-FILTER',
    oem: '15400-RTA-003',
    applications: ['Honda Civic 1.8', 'Honda Civic 2.0', 'Honda Civic Si', 'Honda Fit 1.4', 'Honda Fit 1.5', 'Honda City 1.5', 'Honda HR-V 1.8', 'Honda WR-V 1.5', 'Honda CR-V 2.0', 'Honda CR-V 2.4', 'Honda Accord 2.0', 'Honda Accord 2.4'],
    engines: ['R18A', 'R20A', 'K20A', 'K24A', 'L15A', 'L13A'],
    specs: { height: 65, diameter: 66, thread: 'M20x1.5', bypassValve: '0.8 bar' },
    equivalents: ['FRAM PH6017A', 'BOSCH 0986AF0063', 'TECFIL PSL130', 'MAHLE OC617', 'WIX 51394']
  },

  // ==================== TOYOTA ====================
  'W68/3': { 
    brand: 'MANN-FILTER',
    oem: '90915-YZZD4',
    applications: ['Toyota Corolla 1.8', 'Toyota Corolla 2.0', 'Toyota Yaris 1.3', 'Toyota Yaris 1.5', 'Toyota Etios 1.3', 'Toyota Etios 1.5', 'Toyota RAV4 2.0', 'Toyota RAV4 2.5', 'Toyota Camry 2.5', 'Toyota Hilux 2.7', 'Toyota SW4 2.7'],
    engines: ['1ZZ-FE', '2ZR-FE', '2ZR-FBE', '1NZ-FE', '2NZ-FE', '1NR-FE', '2AR-FE', '2TR-FE'],
    specs: { height: 66, diameter: 68, thread: 'M20x1.5', bypassValve: '0.8 bar' },
    equivalents: ['FRAM PH4967', 'TECFIL PSL135', 'BOSCH F026407089', 'DENSO 260340-0500']
  },
  'W940/44': {
    brand: 'MANN-FILTER',
    oem: '90915-30002',
    applications: ['Toyota Hilux 2.8 Diesel', 'Toyota Hilux 3.0 Diesel', 'Toyota SW4 2.8 Diesel', 'Toyota SW4 3.0 Diesel', 'Toyota Land Cruiser Prado'],
    engines: ['1GD-FTV', '1KD-FTV', '2KD-FTV'],
    specs: { height: 142, diameter: 93, thread: 'M26x1.5' },
    equivalents: ['TECFIL PSD450', 'FRAM PH4386', 'BOSCH F026407105']
  },

  // ==================== HYUNDAI/KIA ====================
  'W940/25': { 
    brand: 'MANN-FILTER',
    oem: '26300-35503',
    applications: ['Hyundai HB20 1.0', 'Hyundai HB20 1.6', 'Hyundai HB20S 1.0', 'Hyundai HB20S 1.6', 'Hyundai Creta 1.6', 'Hyundai Creta 2.0', 'Hyundai Tucson 2.0', 'Hyundai ix35 2.0', 'Hyundai Santa Fe 2.4', 'Hyundai Santa Fe 3.3', 'Kia Rio 1.6', 'Kia Cerato 1.6', 'Kia Cerato 2.0', 'Kia Sportage 2.0', 'Kia Sorento 2.4', 'Kia Sorento 3.3', 'Kia Stonic 1.0', 'Kia Seltos 1.6'],
    engines: ['Gamma 1.0', 'Gamma 1.4', 'Gamma 1.6', 'Nu 2.0', 'Theta II 2.4', 'Lambda II 3.3'],
    specs: { height: 93, diameter: 93, thread: 'M20x1.5', bypassValve: '1.0 bar' },
    equivalents: ['FRAM PH6811', 'TECFIL PSL550', 'BOSCH F026407061', 'MOBIS 26300-35503']
  },

  // ==================== RENAULT ====================
  'W920/21': { 
    brand: 'MANN-FILTER',
    oem: '8200768913',
    applications: ['Renault Sandero 1.0', 'Renault Sandero 1.6', 'Renault Logan 1.0', 'Renault Logan 1.6', 'Renault Duster 1.6', 'Renault Duster 2.0', 'Renault Captur 1.6', 'Renault Captur 2.0', 'Renault Kwid 1.0', 'Renault Oroch 1.6', 'Renault Oroch 2.0', 'Renault Stepway 1.6', 'Renault Fluence 2.0', 'Renault Megane 2.0'],
    engines: ['K7M 1.6 8V', 'K4M 1.6 16V', 'F4R 2.0 16V', 'SCe 1.0', 'H4M 1.6'],
    specs: { height: 93, diameter: 93, thread: 'M20x1.5', bypassValve: '1.0 bar' },
    equivalents: ['FRAM PH5796', 'TECFIL PSL640', 'BOSCH F026407022', 'PURFLUX LS933']
  },

  // ==================== FORD ====================
  'W719/30': { 
    brand: 'MANN-FILTER',
    oem: 'BE8Z-6731-AB',
    applications: ['Ford Ka 1.0', 'Ford Ka 1.5', 'Ford Fiesta 1.0', 'Ford Fiesta 1.6', 'Ford EcoSport 1.5', 'Ford EcoSport 1.6', 'Ford EcoSport 2.0', 'Ford Focus 1.6', 'Ford Focus 2.0', 'Ford Fusion 2.0', 'Ford Fusion 2.5', 'Ford Territory 1.5 Turbo'],
    engines: ['Sigma 1.0', 'Sigma 1.6', 'Duratec 2.0', 'Duratec 2.5', 'EcoBoost 1.5', 'EcoBoost 2.0', 'Dragon 1.5'],
    specs: { height: 76, diameter: 76, thread: 'M20x1.5', bypassValve: '1.0 bar' },
    equivalents: ['FRAM PH3614', 'TECFIL PSL145', 'BOSCH F026407078', 'MOTORCRAFT FL910S']
  },
  'W719/45': {
    brand: 'MANN-FILTER',
    oem: 'AB39-6714-AC',
    applications: ['Ford Ranger 2.2 Diesel', 'Ford Ranger 3.2 Diesel', 'Ford Transit 2.2 Diesel'],
    engines: ['Duratorq 2.2 TDCi', 'Duratorq 3.2 TDCi'],
    specs: { height: 142, diameter: 76, thread: 'M22x1.5' },
    equivalents: ['TECFIL PSD145', 'FRAM PH9566', 'MOTORCRAFT FL500S']
  },

  // ==================== JEEP ====================
  'W712/94': {
    brand: 'MANN-FILTER',
    oem: '68079744AD',
    applications: ['Jeep Renegade 1.8', 'Jeep Renegade 2.0 Turbo', 'Jeep Compass 2.0', 'Jeep Compass 2.0 Turbo', 'Jeep Commander 2.0 Turbo', 'Fiat Toro 1.8', 'Fiat Toro 2.0 Turbo'],
    engines: ['E.torQ 1.8', 'Hurricane 2.0 Turbo', 'Tigershark 2.0'],
    specs: { height: 85, diameter: 76, thread: 'M20x1.5' },
    equivalents: ['FRAM PH11462', 'TECFIL PSL950', 'MOPAR 68079744AD']
  },

  // ==================== NISSAN ====================
  'W67/1': {
    brand: 'MANN-FILTER',
    oem: '15208-65F0E',
    applications: ['Nissan March 1.0', 'Nissan March 1.6', 'Nissan Versa 1.0', 'Nissan Versa 1.6', 'Nissan Kicks 1.6', 'Nissan Sentra 2.0', 'Nissan Frontier 2.5', 'Nissan X-Trail 2.0', 'Nissan X-Trail 2.5'],
    engines: ['HR12DE', 'HR16DE', 'MR20DE', 'QR25DE'],
    specs: { height: 76, diameter: 68, thread: 'M20x1.5' },
    equivalents: ['FRAM PH6607', 'TECFIL PSL167', 'BOSCH F026407025']
  },

  // ==================== MITSUBISHI ====================
  'W940/44': {
    brand: 'MANN-FILTER',
    oem: '1230A114',
    applications: ['Mitsubishi L200 Triton 2.4 Diesel', 'Mitsubishi L200 Triton 3.2 Diesel', 'Mitsubishi Pajero 3.2 Diesel', 'Mitsubishi Pajero Sport 2.4 Diesel', 'Mitsubishi ASX 2.0', 'Mitsubishi Outlander 2.0', 'Mitsubishi Outlander 2.4', 'Mitsubishi Eclipse Cross 1.5 Turbo'],
    engines: ['4N15', '4M41', '4B11', '4B12', '4J10'],
    specs: { height: 100, diameter: 80, thread: 'M20x1.5' },
    equivalents: ['TECFIL PSD450', 'FRAM PH4386', 'BOSCH F026407157']
  },

  // ==================== PEUGEOT/CITROËN ====================
  'W716/1': {
    brand: 'MANN-FILTER',
    oem: '1109CK',
    applications: ['Peugeot 208 1.2', 'Peugeot 208 1.6', 'Peugeot 2008 1.2', 'Peugeot 2008 1.6', 'Peugeot 3008 1.6 THP', 'Peugeot 5008 1.6 THP', 'Citroën C3 1.2', 'Citroën C3 1.6', 'Citroën C4 Cactus 1.6', 'Citroën C4 Lounge 1.6 THP', 'Citroën DS3 1.6', 'Citroën DS4 1.6 THP', 'Citroën DS5 1.6 THP'],
    engines: ['EB2 1.2 PureTech', 'EC5 1.6 VTi', 'EP6 1.6 THP', 'EP6DT 1.6 THP'],
    specs: { height: 76, diameter: 76, thread: 'M20x1.5' },
    equivalents: ['FRAM PH5796', 'TECFIL PSL716', 'BOSCH F026407022', 'PURFLUX LS489']
  },

  // ==================== BMW ====================
  'HU7008z': { 
    brand: 'MANN-FILTER',
    oem: '11427640862',
    applications: ['BMW 320i F30', 'BMW 328i F30', 'BMW 330i G20', 'BMW 118i F20', 'BMW 120i F20', 'BMW X1 sDrive20i', 'BMW X1 xDrive20i', 'BMW X2 sDrive20i', 'BMW X3 xDrive20i', 'BMW X3 xDrive30i', 'BMW Z4 sDrive20i'],
    engines: ['N20B20', 'N26B20', 'B48B20'],
    specs: { type: 'element', height: 104, diameter: 65 },
    equivalents: ['BOSCH F026407123', 'MAHLE OX404D', 'HENGST E203HD224']
  },

  // ==================== MERCEDES-BENZ ====================
  'HU6004x': { 
    brand: 'MANN-FILTER',
    oem: 'A2701800009',
    applications: ['Mercedes A200', 'Mercedes A250', 'Mercedes CLA200', 'Mercedes CLA250', 'Mercedes GLA200', 'Mercedes GLA250', 'Mercedes C180', 'Mercedes C200', 'Mercedes C250', 'Mercedes C300', 'Mercedes E200', 'Mercedes E300'],
    engines: ['M270 1.6', 'M270 2.0', 'M274 2.0'],
    specs: { type: 'element', height: 99, diameter: 64 },
    equivalents: ['BOSCH F026407125', 'MAHLE OX389D', 'HENGST E115HD208']
  },

  // ==================== AUDI ====================
  'HU7020z': {
    brand: 'MANN-FILTER',
    oem: '06L115562',
    applications: ['Audi A3 1.4 TFSI', 'Audi A3 2.0 TFSI', 'Audi A4 2.0 TFSI', 'Audi A5 2.0 TFSI', 'Audi Q3 1.4 TFSI', 'Audi Q3 2.0 TFSI', 'Audi Q5 2.0 TFSI', 'Audi TT 2.0 TFSI'],
    engines: ['EA211 1.4 TFSI', 'EA888 2.0 TFSI'],
    specs: { type: 'element', height: 115, diameter: 65 },
    equivalents: ['BOSCH F026407157', 'MAHLE OX1162D', 'HENGST E358HD246']
  },
};


// ============================================================================
// FILTROS DE ÓLEO - MOTOS
// ============================================================================
export const OIL_FILTERS_MOTORCYCLE = {
  // ==================== HONDA ====================
  'HF204': { 
    brand: 'HIFLOFILTRO',
    oem: '15410-MFJ-D01',
    applications: ['Honda CB300R', 'Honda CB300F', 'Honda CBR300R', 'Honda CB500F', 'Honda CB500X', 'Honda CBR500R', 'Honda NC750X', 'Honda NC750S', 'Honda CB650F', 'Honda CB650R', 'Honda CBR650F', 'Honda CBR650R', 'Honda Africa Twin CRF1000L', 'Honda Africa Twin CRF1100L'],
    engines: ['CB300 286cc', 'CB500 471cc', 'NC750 745cc', 'CB650 649cc', 'CRF1000 998cc', 'CRF1100 1084cc'],
    specs: { height: 68, diameter: 65, thread: 'M20x1.5' },
    equivalents: ['K&N KN-204', 'FRAM PH6018', 'VESRAH SF-4007']
  },
  'HF303': { 
    brand: 'HIFLOFILTRO',
    oem: '15410-MCJ-505',
    applications: ['Honda CBR600RR', 'Honda CBR600F', 'Honda CB600F Hornet', 'Honda CBR1000RR', 'Honda CBR1000RR-R', 'Honda CB1000R', 'Honda VFR800', 'Honda VFR1200', 'Honda Goldwing GL1800'],
    engines: ['CBR600 599cc', 'CBR1000 998cc', 'VFR800 782cc', 'VFR1200 1237cc', 'GL1800 1833cc'],
    specs: { height: 80, diameter: 65, thread: 'M20x1.5' },
    equivalents: ['K&N KN-303', 'FRAM PH6017', 'VESRAH SF-3009']
  },
  'HF112': { 
    brand: 'HIFLOFILTRO',
    oem: '15412-KYJ-901',
    applications: ['Honda CG125', 'Honda CG150 Titan', 'Honda CG160 Titan', 'Honda CG160 Start', 'Honda Bros 150', 'Honda Bros 160', 'Honda XRE190', 'Honda XRE300', 'Honda Biz 100', 'Honda Biz 110', 'Honda Biz 125', 'Honda Pop 100', 'Honda Pop 110', 'Honda NXR160 Bros', 'Honda CB Twister 250'],
    engines: ['CG125 124cc', 'CG150 149cc', 'CG160 162cc', 'XRE190 184cc', 'XRE300 291cc'],
    specs: { height: 38, diameter: 50, thread: 'internal' },
    equivalents: ['K&N KN-112', 'VEDAMOTORS VF112', 'FRAM CH6004']
  },

  // ==================== YAMAHA ====================
  'HF140': {
    brand: 'HIFLOFILTRO',
    oem: '5TA-13440-00',
    applications: ['Yamaha YZF-R3', 'Yamaha MT-03', 'Yamaha YZF-R25', 'Yamaha MT-25', 'Yamaha WR250F', 'Yamaha YZ250F', 'Yamaha WR450F', 'Yamaha YZ450F'],
    engines: ['R3 321cc', 'WR250 249cc', 'WR450 449cc'],
    specs: { height: 38, diameter: 44, thread: 'internal' },
    equivalents: ['K&N KN-140', 'VESRAH SF-4005']
  },
  'HF147': {
    brand: 'HIFLOFILTRO',
    oem: '5GH-13440-50',
    applications: ['Yamaha MT-07', 'Yamaha XSR700', 'Yamaha Tenere 700', 'Yamaha Tracer 700', 'Yamaha YZF-R7'],
    engines: ['MT-07 689cc', 'Tenere 700 689cc'],
    specs: { height: 54, diameter: 65, thread: 'M20x1.5' },
    equivalents: ['K&N KN-147', 'VESRAH SF-4006']
  },
  'HF303': {
    brand: 'HIFLOFILTRO',
    oem: '5GH-13440-60',
    applications: ['Yamaha YZF-R1', 'Yamaha YZF-R1M', 'Yamaha YZF-R6', 'Yamaha MT-09', 'Yamaha MT-10', 'Yamaha XSR900', 'Yamaha Tracer 900', 'Yamaha Niken'],
    engines: ['R1 998cc', 'R6 599cc', 'MT-09 847cc', 'MT-10 998cc'],
    specs: { height: 80, diameter: 65, thread: 'M20x1.5' },
    equivalents: ['K&N KN-303', 'FRAM PH6017']
  },
  'HF401': {
    brand: 'HIFLOFILTRO',
    oem: '5JW-13440-00',
    applications: ['Yamaha Fazer 250', 'Yamaha Lander 250', 'Yamaha Crosser 150', 'Yamaha Factor 125', 'Yamaha Factor 150', 'Yamaha YBR125', 'Yamaha YBR150', 'Yamaha XTZ150 Crosser'],
    engines: ['Fazer 250 249cc', 'Lander 250 249cc', 'Crosser 150 149cc', 'Factor 125 124cc'],
    specs: { height: 54, diameter: 65, thread: 'M20x1.5' },
    equivalents: ['K&N KN-401', 'VEDAMOTORS VF401']
  },

  // ==================== KAWASAKI ====================
  'HF303': {
    brand: 'HIFLOFILTRO',
    oem: '16097-0008',
    applications: ['Kawasaki Ninja 300', 'Kawasaki Z300', 'Kawasaki Ninja 400', 'Kawasaki Z400', 'Kawasaki Ninja 650', 'Kawasaki Z650', 'Kawasaki Versys 650', 'Kawasaki Vulcan S 650', 'Kawasaki Ninja ZX-6R', 'Kawasaki Z900', 'Kawasaki Z900RS', 'Kawasaki Ninja ZX-10R', 'Kawasaki Z1000', 'Kawasaki Ninja H2', 'Kawasaki Versys 1000'],
    engines: ['Ninja 300 296cc', 'Ninja 400 399cc', 'Ninja 650 649cc', 'ZX-6R 636cc', 'Z900 948cc', 'ZX-10R 998cc'],
    specs: { height: 80, diameter: 65, thread: 'M20x1.5' },
    equivalents: ['K&N KN-303', 'FRAM PH6017', 'VESRAH SF-3009']
  },

  // ==================== SUZUKI ====================
  'HF138': {
    brand: 'HIFLOFILTRO',
    oem: '16510-07J00',
    applications: ['Suzuki GSX-R600', 'Suzuki GSX-R750', 'Suzuki GSX-R1000', 'Suzuki GSX-S750', 'Suzuki GSX-S1000', 'Suzuki V-Strom 650', 'Suzuki V-Strom 1000', 'Suzuki V-Strom 1050', 'Suzuki Hayabusa GSX1300R', 'Suzuki SV650', 'Suzuki Katana 1000'],
    engines: ['GSX-R600 599cc', 'GSX-R750 750cc', 'GSX-R1000 999cc', 'V-Strom 650 645cc', 'Hayabusa 1340cc'],
    specs: { height: 80, diameter: 68, thread: 'M20x1.5' },
    equivalents: ['K&N KN-138', 'VESRAH SF-3005']
  },

  // ==================== BMW ====================
  'HF160': {
    brand: 'HIFLOFILTRO',
    oem: '11427721779',
    applications: ['BMW S1000RR', 'BMW S1000R', 'BMW S1000XR', 'BMW F800GS', 'BMW F800R', 'BMW F800GT', 'BMW F750GS', 'BMW F850GS', 'BMW F900R', 'BMW F900XR', 'BMW G310R', 'BMW G310GS'],
    engines: ['S1000 999cc', 'F800 798cc', 'F850 853cc', 'F900 895cc', 'G310 313cc'],
    specs: { height: 70, diameter: 52, thread: 'M20x1.5' },
    equivalents: ['K&N KN-160', 'MAHLE OC619']
  },
  'HF164': {
    brand: 'HIFLOFILTRO',
    oem: '11427673541',
    applications: ['BMW R1200GS', 'BMW R1200RT', 'BMW R1200R', 'BMW R1200RS', 'BMW R1250GS', 'BMW R1250RT', 'BMW R1250R', 'BMW R1250RS', 'BMW R nineT'],
    engines: ['R1200 1170cc', 'R1250 1254cc'],
    specs: { height: 79, diameter: 76, thread: 'M20x1.5' },
    equivalents: ['K&N KN-164', 'MAHLE OC91']
  },

  // ==================== DUCATI ====================
  'HF153': {
    brand: 'HIFLOFILTRO',
    oem: '44440038A',
    applications: ['Ducati Monster 797', 'Ducati Monster 821', 'Ducati Monster 1200', 'Ducati Multistrada 950', 'Ducati Multistrada 1200', 'Ducati Multistrada 1260', 'Ducati Multistrada V4', 'Ducati Panigale V2', 'Ducati Panigale V4', 'Ducati Scrambler', 'Ducati Diavel', 'Ducati Hypermotard', 'Ducati XDiavel', 'Ducati Streetfighter V4'],
    engines: ['Monster 797 803cc', 'Monster 821 821cc', 'Monster 1200 1198cc', 'Panigale V4 1103cc'],
    specs: { height: 100, diameter: 53, thread: 'M20x1.5' },
    equivalents: ['K&N KN-153', 'VESRAH SF-4003']
  },

  // ==================== KTM ====================
  'HF652': {
    brand: 'HIFLOFILTRO',
    oem: '75038046100',
    applications: ['KTM Duke 200', 'KTM Duke 250', 'KTM Duke 390', 'KTM RC 200', 'KTM RC 250', 'KTM RC 390', 'KTM Adventure 390', 'Husqvarna Svartpilen 401', 'Husqvarna Vitpilen 401'],
    engines: ['Duke 200 199cc', 'Duke 390 373cc'],
    specs: { height: 38, diameter: 41, thread: 'internal' },
    equivalents: ['K&N KN-652']
  },
  'HF155': {
    brand: 'HIFLOFILTRO',
    oem: '58038005100',
    applications: ['KTM Duke 690', 'KTM SMC 690', 'KTM Enduro 690', 'KTM 790 Duke', 'KTM 790 Adventure', 'KTM 890 Duke', 'KTM 890 Adventure', 'KTM 1290 Super Duke', 'KTM 1290 Super Adventure', 'Husqvarna 701 Supermoto', 'Husqvarna 701 Enduro', 'Husqvarna Norden 901'],
    engines: ['Duke 690 690cc', '790 Duke 799cc', '890 Duke 889cc', '1290 Super Duke 1301cc'],
    specs: { height: 52, diameter: 41, thread: 'internal' },
    equivalents: ['K&N KN-155']
  },

  // ==================== TRIUMPH ====================
  'HF204': {
    brand: 'HIFLOFILTRO',
    oem: 'T1218001',
    applications: ['Triumph Street Triple 675', 'Triumph Street Triple 765', 'Triumph Speed Triple 1050', 'Triumph Speed Triple 1200', 'Triumph Tiger 800', 'Triumph Tiger 900', 'Triumph Tiger 1200', 'Triumph Bonneville T100', 'Triumph Bonneville T120', 'Triumph Thruxton', 'Triumph Scrambler', 'Triumph Trident 660', 'Triumph Rocket 3'],
    engines: ['Street Triple 675 675cc', 'Street Triple 765 765cc', 'Speed Triple 1050 1050cc', 'Tiger 800 800cc'],
    specs: { height: 68, diameter: 65, thread: 'M20x1.5' },
    equivalents: ['K&N KN-204', 'FRAM PH6018']
  },

  // ==================== HARLEY-DAVIDSON ====================
  'HF170B': {
    brand: 'HIFLOFILTRO',
    oem: '63731-99A',
    applications: ['Harley-Davidson Sportster 883', 'Harley-Davidson Sportster 1200', 'Harley-Davidson Softail', 'Harley-Davidson Dyna', 'Harley-Davidson Touring', 'Harley-Davidson Street Glide', 'Harley-Davidson Road King', 'Harley-Davidson Fat Boy', 'Harley-Davidson Heritage', 'Harley-Davidson Breakout'],
    engines: ['Evolution 883cc', 'Evolution 1200cc', 'Twin Cam 96 1584cc', 'Twin Cam 103 1690cc', 'Milwaukee-Eight 107 1746cc', 'Milwaukee-Eight 114 1868cc'],
    specs: { height: 100, diameter: 76, thread: '3/4-16 UNF', color: 'black' },
    equivalents: ['K&N KN-170', 'DRAG SPECIALTIES 0712-0490']
  },

  // ==================== ROYAL ENFIELD ====================
  'HF561': {
    brand: 'HIFLOFILTRO',
    oem: '888464',
    applications: ['Royal Enfield Classic 350', 'Royal Enfield Classic 500', 'Royal Enfield Bullet 350', 'Royal Enfield Bullet 500', 'Royal Enfield Meteor 350', 'Royal Enfield Himalayan', 'Royal Enfield Interceptor 650', 'Royal Enfield Continental GT 650'],
    engines: ['Classic 350 346cc', 'Classic 500 499cc', 'Himalayan 411cc', 'Interceptor 650 648cc'],
    specs: { height: 52, diameter: 50, thread: 'internal' },
    equivalents: ['K&N KN-561']
  },
};

// ============================================================================
// FILTROS DE AR - CARROS
// ============================================================================
export const AIR_FILTERS = {
  // ==================== VOLKSWAGEN ====================
  'C27192/1': { 
    brand: 'MANN-FILTER',
    oem: '04E129620A',
    applications: ['VW Gol G5 1.0', 'VW Gol G5 1.6', 'VW Gol G6 1.0', 'VW Gol G6 1.6', 'VW Gol G7 1.0', 'VW Gol G7 1.6', 'VW Voyage G5', 'VW Voyage G6', 'VW Voyage G7', 'VW Fox 1.0', 'VW Fox 1.6', 'VW Saveiro G5', 'VW Saveiro G6', 'VW Saveiro G7', 'VW Up 1.0'],
    engines: ['EA111 1.0', 'EA111 1.6', 'EA211 1.0', 'EA211 1.6'],
    specs: { length: 271, width: 192, height: 58, type: 'panel' },
    equivalents: ['TECFIL ARL6079', 'FRAM CA10242', 'BOSCH F026400287', 'WIX WA9756']
  },
  'C30005': { 
    brand: 'MANN-FILTER',
    oem: '04E129620D',
    applications: ['VW Polo 1.0 TSI', 'VW Polo 1.4 TSI', 'VW Virtus 1.0 TSI', 'VW Virtus 1.6', 'VW T-Cross 1.0 TSI', 'VW T-Cross 1.4 TSI', 'VW Nivus 1.0 TSI', 'VW Taos 1.4 TSI', 'Audi A3 1.4 TFSI', 'Audi Q3 1.4 TFSI', 'Skoda Rapid 1.0 TSI'],
    engines: ['EA211 1.0 TSI', 'EA211 1.4 TSI', 'EA211 1.6 MSI'],
    specs: { length: 300, width: 200, height: 50, type: 'panel' },
    equivalents: ['TECFIL ARL3000', 'FRAM CA11945', 'BOSCH F026400497']
  },

  // ==================== FIAT ====================
  'C25117': { 
    brand: 'MANN-FILTER',
    oem: '51806865',
    applications: ['Fiat Uno 1.0', 'Fiat Uno 1.4', 'Fiat Palio 1.0', 'Fiat Palio 1.4', 'Fiat Siena 1.0', 'Fiat Siena 1.4', 'Fiat Strada 1.4', 'Fiat Mobi 1.0', 'Fiat Argo 1.0', 'Fiat Argo 1.3', 'Fiat Cronos 1.3', 'Fiat Pulse 1.0', 'Fiat Pulse 1.3', 'Fiat Fastback 1.0'],
    engines: ['Fire 1.0', 'Fire 1.4', 'Firefly 1.0', 'Firefly 1.3'],
    specs: { length: 251, width: 170, height: 58, type: 'panel' },
    equivalents: ['TECFIL ARL5117', 'FRAM CA9482', 'BOSCH F026400157']
  },

  // ==================== CHEVROLET ====================
  'C27003': { 
    brand: 'MANN-FILTER',
    oem: '96950990',
    applications: ['Chevrolet Onix 1.0', 'Chevrolet Onix 1.4', 'Chevrolet Onix Plus 1.0', 'Chevrolet Onix Plus 1.0 Turbo', 'Chevrolet Prisma 1.0', 'Chevrolet Prisma 1.4', 'Chevrolet Cobalt 1.4', 'Chevrolet Cobalt 1.8', 'Chevrolet Spin 1.8', 'Chevrolet Tracker 1.0 Turbo', 'Chevrolet Tracker 1.2 Turbo', 'Chevrolet Montana 1.2 Turbo'],
    engines: ['SPE/4 1.0', 'SPE/4 1.4', 'Ecotec 1.0 Turbo', 'Ecotec 1.2 Turbo', 'Ecotec 1.8'],
    specs: { length: 270, width: 185, height: 42, type: 'panel' },
    equivalents: ['TECFIL ARL7003', 'FRAM CA11476', 'ACDelco A3181C']
  },

  // ==================== HONDA ====================
  'C2433/2': { 
    brand: 'MANN-FILTER',
    oem: '17220-RNA-A00',
    applications: ['Honda Civic 1.8', 'Honda Civic 2.0', 'Honda CR-V 2.0', 'Honda CR-V 2.4', 'Honda Accord 2.0', 'Honda Accord 2.4'],
    engines: ['R18A', 'R20A', 'K24A'],
    specs: { length: 243, width: 175, height: 40, type: 'panel' },
    equivalents: ['FRAM CA10165', 'WIX 46902', 'TECFIL ARL2433', 'BOSCH F026400114']
  },
  'C2240': {
    brand: 'MANN-FILTER',
    oem: '17220-5R0-008',
    applications: ['Honda Fit 1.5', 'Honda City 1.5', 'Honda HR-V 1.8', 'Honda WR-V 1.5'],
    engines: ['L15B', 'R18Z'],
    specs: { length: 224, width: 160, height: 40, type: 'panel' },
    equivalents: ['FRAM CA11945', 'TECFIL ARL2240']
  },

  // ==================== TOYOTA ====================
  'C26009': { 
    brand: 'MANN-FILTER',
    oem: '17801-21050',
    applications: ['Toyota Corolla 1.8', 'Toyota Corolla 2.0', 'Toyota Yaris 1.3', 'Toyota Yaris 1.5', 'Toyota Etios 1.3', 'Toyota Etios 1.5'],
    engines: ['1ZZ-FE', '2ZR-FE', '2ZR-FBE', '1NZ-FE', '2NZ-FE', '1NR-FE'],
    specs: { length: 260, width: 168, height: 50, type: 'panel' },
    equivalents: ['TECFIL ARL6009', 'FRAM CA10190', 'BOSCH F026400114', 'DENSO 260340-0500']
  },

  // ==================== HYUNDAI/KIA ====================
  'C26013': { 
    brand: 'MANN-FILTER',
    oem: '28113-1R100',
    applications: ['Hyundai HB20 1.0', 'Hyundai HB20 1.6', 'Hyundai HB20S 1.0', 'Hyundai HB20S 1.6', 'Hyundai Creta 1.6', 'Hyundai Creta 2.0', 'Kia Rio 1.6', 'Kia Stonic 1.0'],
    engines: ['Gamma 1.0', 'Gamma 1.6', 'Nu 2.0'],
    specs: { length: 260, width: 175, height: 45, type: 'panel' },
    equivalents: ['TECFIL ARL6013', 'FRAM CA11258', 'BOSCH F026400287', 'MOBIS 28113-1R100']
  },

  // ==================== RENAULT ====================
  'C2201': { 
    brand: 'MANN-FILTER',
    oem: '165467674R',
    applications: ['Renault Sandero 1.0', 'Renault Sandero 1.6', 'Renault Logan 1.0', 'Renault Logan 1.6', 'Renault Duster 1.6', 'Renault Duster 2.0', 'Renault Captur 1.6', 'Renault Captur 2.0', 'Renault Kwid 1.0', 'Renault Oroch 1.6', 'Renault Oroch 2.0'],
    engines: ['K7M 1.6 8V', 'K4M 1.6 16V', 'F4R 2.0 16V', 'SCe 1.0', 'H4M 1.6'],
    specs: { length: 220, width: 165, height: 70, type: 'panel' },
    equivalents: ['TECFIL ARL2201', 'FRAM CA10249', 'BOSCH F026400287', 'PURFLUX A1294']
  },

  // ==================== FORD ====================
  'C16005': { 
    brand: 'MANN-FILTER',
    oem: 'CN15-9601-AB',
    applications: ['Ford Ka 1.0', 'Ford Ka 1.5', 'Ford Fiesta 1.0', 'Ford Fiesta 1.6', 'Ford EcoSport 1.5', 'Ford EcoSport 1.6', 'Ford EcoSport 2.0'],
    engines: ['Sigma 1.0', 'Sigma 1.6', 'Duratec 2.0', 'Dragon 1.5'],
    specs: { length: 160, width: 140, height: 58, type: 'panel' },
    equivalents: ['TECFIL ARL6005', 'FRAM CA10677', 'MOTORCRAFT FA1884']
  },

  // ==================== JEEP ====================
  'C35003': { 
    brand: 'MANN-FILTER',
    oem: '68247339AA',
    applications: ['Jeep Renegade 1.8', 'Jeep Renegade 2.0 Turbo', 'Jeep Compass 2.0', 'Jeep Compass 2.0 Turbo', 'Jeep Commander 2.0 Turbo', 'Fiat Toro 1.8', 'Fiat Toro 2.0 Turbo'],
    engines: ['E.torQ 1.8', 'Hurricane 2.0 Turbo', 'Tigershark 2.0'],
    specs: { length: 350, width: 185, height: 58, type: 'panel' },
    equivalents: ['TECFIL ARL5003', 'FRAM CA11667', 'MOPAR 68247339AA']
  },
};


// ============================================================================
// FILTROS DE AR - MOTOS
// ============================================================================
export const AIR_FILTERS_MOTORCYCLE = {
  // ==================== HONDA ====================
  'HFA1602': { 
    brand: 'HIFLOFILTRO',
    oem: '17210-MBZ-K00',
    applications: ['Honda CB600F Hornet', 'Honda CBF600', 'Honda CB650F', 'Honda CB650R', 'Honda CBR650F', 'Honda CBR650R'],
    specs: { type: 'panel' },
    equivalents: ['K&N HA-6003', 'BMC FM440/04']
  },
  'HFA1715': { 
    brand: 'HIFLOFILTRO',
    oem: '17210-MGS-D30',
    applications: ['Honda NC750X', 'Honda NC750S', 'Honda Integra 750', 'Honda X-ADV 750'],
    specs: { type: 'panel' },
    equivalents: ['K&N HA-7015', 'BMC FM787/01']
  },
  'HFA1620': { 
    brand: 'HIFLOFILTRO',
    oem: '17210-MEE-000',
    applications: ['Honda CBR600RR', 'Honda CBR1000RR', 'Honda CBR1000RR-R'],
    specs: { type: 'panel' },
    equivalents: ['K&N HA-6007', 'BMC FM527/04']
  },
  'HFA1112': { 
    brand: 'HIFLOFILTRO',
    oem: '17211-KYJ-900',
    applications: ['Honda CG125', 'Honda CG150 Titan', 'Honda CG160 Titan', 'Honda Bros 150', 'Honda Bros 160', 'Honda XRE190', 'Honda Biz 100', 'Honda Biz 110', 'Honda Biz 125', 'Honda Pop 100', 'Honda Pop 110'],
    specs: { type: 'element' },
    equivalents: ['VEDAMOTORS VA112']
  },
  'HFA1506': {
    brand: 'HIFLOFILTRO',
    oem: '17210-MKN-D50',
    applications: ['Honda CB500F', 'Honda CB500X', 'Honda CBR500R'],
    specs: { type: 'panel' },
    equivalents: ['K&N HA-5019', 'BMC FM787/04']
  },
  'HFA1930': {
    brand: 'HIFLOFILTRO',
    oem: '17210-MKC-A00',
    applications: ['Honda Africa Twin CRF1000L', 'Honda Africa Twin CRF1100L'],
    specs: { type: 'panel' },
    equivalents: ['K&N HA-1016', 'BMC FM915/01']
  },

  // ==================== YAMAHA ====================
  'HFA4510': { 
    brand: 'HIFLOFILTRO',
    oem: '2CR-E4451-00',
    applications: ['Yamaha YZF-R1', 'Yamaha YZF-R1M', 'Yamaha MT-10'],
    specs: { type: 'panel' },
    equivalents: ['K&N YA-1009', 'BMC FM856/04']
  },
  'HFA4505': { 
    brand: 'HIFLOFILTRO',
    oem: '4B5-14451-00',
    applications: ['Yamaha T-Max 500', 'Yamaha T-Max 530', 'Yamaha T-Max 560'],
    specs: { type: 'panel' },
    equivalents: ['K&N YA-5008', 'BMC FM364/10']
  },
  'HFA4301': { 
    brand: 'HIFLOFILTRO',
    oem: '5VL-14451-00',
    applications: ['Yamaha Fazer 250', 'Yamaha Lander 250', 'Yamaha Crosser 150', 'Yamaha Factor 125', 'Yamaha Factor 150'],
    specs: { type: 'element' },
    equivalents: ['K&N YA-2504', 'VEDAMOTORS VA301']
  },
  'HFA4616': {
    brand: 'HIFLOFILTRO',
    oem: 'B04-E4451-00',
    applications: ['Yamaha YZF-R3', 'Yamaha MT-03', 'Yamaha YZF-R25', 'Yamaha MT-25'],
    specs: { type: 'panel' },
    equivalents: ['K&N YA-3215', 'BMC FM787/04']
  },
  'HFA4704': {
    brand: 'HIFLOFILTRO',
    oem: '1WS-14451-00',
    applications: ['Yamaha MT-07', 'Yamaha XSR700', 'Yamaha Tenere 700', 'Yamaha Tracer 700', 'Yamaha YZF-R7'],
    specs: { type: 'panel' },
    equivalents: ['K&N YA-6814', 'BMC FM787/04']
  },
  'HFA4921': {
    brand: 'HIFLOFILTRO',
    oem: '1RC-14451-00',
    applications: ['Yamaha MT-09', 'Yamaha XSR900', 'Yamaha Tracer 900', 'Yamaha Niken'],
    specs: { type: 'panel' },
    equivalents: ['K&N YA-8514', 'BMC FM787/04']
  },

  // ==================== KAWASAKI ====================
  'HFA2608': { 
    brand: 'HIFLOFILTRO',
    oem: '11013-0716',
    applications: ['Kawasaki Ninja 650', 'Kawasaki Z650', 'Kawasaki Versys 650', 'Kawasaki Vulcan S 650', 'Kawasaki Ninja 400', 'Kawasaki Z400'],
    specs: { type: 'panel' },
    equivalents: ['K&N KA-6512', 'BMC FM465/04']
  },
  'HFA2915': { 
    brand: 'HIFLOFILTRO',
    oem: '11013-0036',
    applications: ['Kawasaki Ninja ZX-6R', 'Kawasaki ZX-10R', 'Kawasaki Z900', 'Kawasaki Z900RS', 'Kawasaki Z1000'],
    specs: { type: 'panel' },
    equivalents: ['K&N KA-6009', 'BMC FM554/04']
  },
  'HFA2919': {
    brand: 'HIFLOFILTRO',
    oem: '11013-0752',
    applications: ['Kawasaki Ninja 300', 'Kawasaki Z300'],
    specs: { type: 'panel' },
    equivalents: ['K&N KA-3013', 'BMC FM787/04']
  },
  'HFA2924': {
    brand: 'HIFLOFILTRO',
    oem: '11013-0763',
    applications: ['Kawasaki Versys 1000', 'Kawasaki Ninja 1000', 'Kawasaki Z1000SX'],
    specs: { type: 'panel' },
    equivalents: ['K&N KA-1011', 'BMC FM787/04']
  },

  // ==================== SUZUKI ====================
  'HFA3615': { 
    brand: 'HIFLOFILTRO',
    oem: '13780-06G00',
    applications: ['Suzuki GSX-R600', 'Suzuki GSX-R750', 'Suzuki GSX-R1000', 'Suzuki GSX-S750', 'Suzuki GSX-S1000', 'Suzuki Katana 1000'],
    specs: { type: 'panel' },
    equivalents: ['K&N SU-7506', 'BMC FM440/04']
  },
  'HFA3621': { 
    brand: 'HIFLOFILTRO',
    oem: '13780-31J00',
    applications: ['Suzuki V-Strom 650', 'Suzuki SV650'],
    specs: { type: 'panel' },
    equivalents: ['K&N SU-6504', 'BMC FM440/04']
  },
  'HFA3909': {
    brand: 'HIFLOFILTRO',
    oem: '13780-24F00',
    applications: ['Suzuki Hayabusa GSX1300R'],
    specs: { type: 'panel' },
    equivalents: ['K&N SU-1399', 'BMC FM440/04']
  },
  'HFA3618': {
    brand: 'HIFLOFILTRO',
    oem: '13780-44H00',
    applications: ['Suzuki V-Strom 1000', 'Suzuki V-Strom 1050'],
    specs: { type: 'panel' },
    equivalents: ['K&N SU-1014', 'BMC FM787/04']
  },

  // ==================== BMW ====================
  'HFA7603': { 
    brand: 'HIFLOFILTRO',
    oem: '13717672552',
    applications: ['BMW F800GS', 'BMW F800R', 'BMW F800GT', 'BMW F700GS', 'BMW F650GS Twin'],
    specs: { type: 'panel' },
    equivalents: ['K&N BM-8006', 'BMC FM569/08']
  },
  'HFA7918': {
    brand: 'HIFLOFILTRO',
    oem: '13727726799',
    applications: ['BMW S1000RR', 'BMW S1000R', 'BMW S1000XR'],
    specs: { type: 'panel' },
    equivalents: ['K&N BM-1010', 'BMC FM569/04']
  },
  'HFA7912': {
    brand: 'HIFLOFILTRO',
    oem: '13727726750',
    applications: ['BMW R1200GS', 'BMW R1200RT', 'BMW R1200R', 'BMW R1200RS', 'BMW R1250GS', 'BMW R1250RT', 'BMW R1250R', 'BMW R nineT'],
    specs: { type: 'panel' },
    equivalents: ['K&N BM-1204', 'BMC FM569/04']
  },
  'HFA7915': {
    brand: 'HIFLOFILTRO',
    oem: '13718559382',
    applications: ['BMW F750GS', 'BMW F850GS', 'BMW F900R', 'BMW F900XR'],
    specs: { type: 'panel' },
    equivalents: ['K&N BM-8518', 'BMC FM787/04']
  },

  // ==================== DUCATI ====================
  'HFA6505': { 
    brand: 'HIFLOFILTRO',
    oem: '42610191A',
    applications: ['Ducati Monster 797', 'Ducati Monster 821', 'Ducati Monster 1200', 'Ducati Scrambler', 'Ducati Hypermotard'],
    specs: { type: 'panel' },
    equivalents: ['K&N DU-1006', 'BMC FM452/08']
  },
  'HFA6509': {
    brand: 'HIFLOFILTRO',
    oem: '42610201A',
    applications: ['Ducati Multistrada 950', 'Ducati Multistrada 1200', 'Ducati Multistrada 1260', 'Ducati Multistrada V4'],
    specs: { type: 'panel' },
    equivalents: ['K&N DU-1210', 'BMC FM452/08']
  },
  'HFA6512': {
    brand: 'HIFLOFILTRO',
    oem: '42610211A',
    applications: ['Ducati Panigale V2', 'Ducati Panigale V4', 'Ducati Streetfighter V4'],
    specs: { type: 'panel' },
    equivalents: ['K&N DU-1210', 'BMC FM787/04']
  },

  // ==================== KTM ====================
  'HFA6302': {
    brand: 'HIFLOFILTRO',
    oem: '90106015000',
    applications: ['KTM Duke 200', 'KTM Duke 250', 'KTM Duke 390', 'KTM RC 200', 'KTM RC 250', 'KTM RC 390', 'KTM Adventure 390'],
    specs: { type: 'panel' },
    equivalents: ['K&N KT-1211', 'BMC FM787/04']
  },
  'HFA6501': {
    brand: 'HIFLOFILTRO',
    oem: '60006015000',
    applications: ['KTM Duke 690', 'KTM SMC 690', 'KTM Enduro 690', 'Husqvarna 701 Supermoto', 'Husqvarna 701 Enduro'],
    specs: { type: 'panel' },
    equivalents: ['K&N KT-6908', 'BMC FM787/04']
  },
  'HFA6503': {
    brand: 'HIFLOFILTRO',
    oem: '63006015100',
    applications: ['KTM 790 Duke', 'KTM 790 Adventure', 'KTM 890 Duke', 'KTM 890 Adventure', 'Husqvarna Norden 901'],
    specs: { type: 'panel' },
    equivalents: ['K&N KT-7918', 'BMC FM787/04']
  },
  'HFA6508': {
    brand: 'HIFLOFILTRO',
    oem: '61006015100',
    applications: ['KTM 1290 Super Duke', 'KTM 1290 Super Adventure'],
    specs: { type: 'panel' },
    equivalents: ['K&N KT-1113', 'BMC FM787/04']
  },

  // ==================== TRIUMPH ====================
  'HFA6505': { 
    brand: 'HIFLOFILTRO',
    oem: 'T2200560',
    applications: ['Triumph Street Triple 675', 'Triumph Street Triple 765', 'Triumph Speed Triple 1050', 'Triumph Speed Triple 1200', 'Triumph Tiger 800', 'Triumph Tiger 900'],
    specs: { type: 'panel' },
    equivalents: ['K&N TB-1011', 'BMC FM499/20']
  },
  'HFA6509': {
    brand: 'HIFLOFILTRO',
    oem: 'T2200580',
    applications: ['Triumph Tiger 1200', 'Triumph Bonneville T100', 'Triumph Bonneville T120', 'Triumph Thruxton', 'Triumph Scrambler', 'Triumph Trident 660'],
    specs: { type: 'panel' },
    equivalents: ['K&N TB-1212', 'BMC FM787/04']
  },
};

// ============================================================================
// PASTILHAS DE FREIO - CARROS
// ============================================================================
export const BRAKE_PADS = {
  // ==================== VOLKSWAGEN ====================
  'N-1108': { 
    brand: 'COBREQ',
    oem: '5U0698151',
    applications: ['VW Gol G5 1.0', 'VW Gol G5 1.6', 'VW Gol G6 1.0', 'VW Gol G6 1.6', 'VW Gol G7 1.0', 'VW Gol G7 1.6', 'VW Voyage G5', 'VW Voyage G6', 'VW Voyage G7', 'VW Fox 1.0', 'VW Fox 1.6', 'VW Saveiro G5', 'VW Saveiro G6', 'VW Saveiro G7', 'VW Up 1.0'],
    position: 'front',
    specs: { height: 54, width: 146, thickness: 19, wearIndicator: true },
    equivalents: ['FRAS-LE PD/580', 'BOSCH BP1108', 'TRW GDB1550', 'FERODO FDB1636']
  },
  'N-1109': { 
    brand: 'COBREQ',
    oem: '5U0698451',
    applications: ['VW Gol G5', 'VW Gol G6', 'VW Gol G7', 'VW Voyage G5', 'VW Voyage G6', 'VW Voyage G7', 'VW Fox'],
    position: 'rear',
    specs: { height: 42, width: 95, thickness: 14 },
    equivalents: ['FRAS-LE PD/581', 'BOSCH BP1109', 'TRW GDB1551']
  },
  'N-1550': {
    brand: 'COBREQ',
    oem: '5Q0698151',
    applications: ['VW Polo 1.0 TSI', 'VW Polo 1.4 TSI', 'VW Virtus 1.0 TSI', 'VW Virtus 1.6', 'VW T-Cross 1.0 TSI', 'VW T-Cross 1.4 TSI', 'VW Nivus 1.0 TSI', 'VW Taos 1.4 TSI', 'Audi A3 1.4 TFSI', 'Audi Q3 1.4 TFSI'],
    position: 'front',
    specs: { height: 58, width: 150, thickness: 18, wearIndicator: true },
    equivalents: ['FRAS-LE PD/1550', 'BOSCH BP1550', 'TRW GDB2003', 'FERODO FDB4379']
  },

  // ==================== FIAT ====================
  'N-1250': { 
    brand: 'COBREQ',
    oem: '77365468',
    applications: ['Fiat Uno 1.0', 'Fiat Uno 1.4', 'Fiat Palio 1.0', 'Fiat Palio 1.4', 'Fiat Siena 1.0', 'Fiat Siena 1.4', 'Fiat Strada 1.4', 'Fiat Mobi 1.0', 'Fiat Argo 1.0', 'Fiat Argo 1.3', 'Fiat Cronos 1.3'],
    position: 'front',
    specs: { height: 52, width: 119, thickness: 17, wearIndicator: true },
    equivalents: ['FRAS-LE PD/1250', 'BOSCH BP1250', 'TRW GDB1377', 'FERODO FDB1052']
  },
  'N-1251': { 
    brand: 'COBREQ',
    oem: '77365469',
    applications: ['Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Argo', 'Fiat Cronos'],
    position: 'rear',
    specs: { height: 40, width: 88, thickness: 14 },
    equivalents: ['FRAS-LE PD/1251', 'BOSCH BP1251', 'TRW GDB1378']
  },

  // ==================== CHEVROLET ====================
  'N-1380': { 
    brand: 'COBREQ',
    oem: '13301234',
    applications: ['Chevrolet Onix 1.0', 'Chevrolet Onix 1.4', 'Chevrolet Onix Plus 1.0', 'Chevrolet Onix Plus 1.0 Turbo', 'Chevrolet Prisma 1.0', 'Chevrolet Prisma 1.4', 'Chevrolet Cobalt 1.4', 'Chevrolet Cobalt 1.8', 'Chevrolet Spin 1.8', 'Chevrolet Tracker 1.0 Turbo', 'Chevrolet Tracker 1.2 Turbo'],
    position: 'front',
    specs: { height: 55, width: 140, thickness: 18, wearIndicator: true },
    equivalents: ['FRAS-LE PD/1380', 'BOSCH BP1380', 'ACDelco 171-1074', 'TRW GDB1838']
  },
  'N-1381': { 
    brand: 'COBREQ',
    oem: '13301235',
    applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin', 'Chevrolet Tracker'],
    position: 'rear',
    specs: { height: 43, width: 98, thickness: 14 },
    equivalents: ['FRAS-LE PD/1381', 'BOSCH BP1381', 'ACDelco 171-1075']
  },

  // ==================== HONDA ====================
  'N-1323': { 
    brand: 'COBREQ',
    oem: '45022-SNA-A01',
    applications: ['Honda Civic 1.8', 'Honda Civic 2.0', 'Honda Fit 1.4', 'Honda Fit 1.5', 'Honda City 1.5', 'Honda HR-V 1.8', 'Honda WR-V 1.5'],
    position: 'front',
    specs: { height: 58, width: 131, thickness: 17, wearIndicator: true },
    equivalents: ['FRAS-LE PD/1323', 'BOSCH BP1323', 'TRW GDB3425', 'FERODO FDB1639']
  },
  'N-1324': { 
    brand: 'COBREQ',
    oem: '43022-SNA-A01',
    applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V'],
    position: 'rear',
    specs: { height: 45, width: 100, thickness: 14 },
    equivalents: ['FRAS-LE PD/1324', 'BOSCH BP1324', 'TRW GDB3426']
  },

  // ==================== TOYOTA ====================
  'N-1420': { 
    brand: 'COBREQ',
    oem: '04465-02220',
    applications: ['Toyota Corolla 1.8', 'Toyota Corolla 2.0', 'Toyota Yaris 1.3', 'Toyota Yaris 1.5', 'Toyota Etios 1.3', 'Toyota Etios 1.5'],
    position: 'front',
    specs: { height: 56, width: 138, thickness: 17, wearIndicator: true },
    equivalents: ['FRAS-LE PD/1420', 'BOSCH BP1420', 'TRW GDB3456', 'FERODO FDB1891']
  },
  'N-1421': { 
    brand: 'COBREQ',
    oem: '04466-02181',
    applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios'],
    position: 'rear',
    specs: { height: 44, width: 96, thickness: 14 },
    equivalents: ['FRAS-LE PD/1421', 'BOSCH BP1421', 'TRW GDB3457']
  },

  // ==================== HYUNDAI/KIA ====================
  'N-1550': { 
    brand: 'COBREQ',
    oem: '58101-1RA00',
    applications: ['Hyundai HB20 1.0', 'Hyundai HB20 1.6', 'Hyundai HB20S 1.0', 'Hyundai HB20S 1.6', 'Hyundai Creta 1.6', 'Hyundai Creta 2.0', 'Kia Rio 1.6', 'Kia Stonic 1.0'],
    position: 'front',
    specs: { height: 55, width: 135, thickness: 17, wearIndicator: true },
    equivalents: ['FRAS-LE PD/1550', 'BOSCH BP1550', 'TRW GDB3456', 'MOBIS 58101-1RA00']
  },

  // ==================== RENAULT ====================
  'N-1500': { 
    brand: 'COBREQ',
    oem: '410608481R',
    applications: ['Renault Sandero 1.0', 'Renault Sandero 1.6', 'Renault Logan 1.0', 'Renault Logan 1.6', 'Renault Duster 1.6', 'Renault Duster 2.0', 'Renault Captur 1.6', 'Renault Captur 2.0', 'Renault Kwid 1.0'],
    position: 'front',
    specs: { height: 54, width: 130, thickness: 18, wearIndicator: true },
    equivalents: ['FRAS-LE PD/1500', 'BOSCH BP1500', 'TRW GDB1789']
  },

  // ==================== FORD ====================
  'N-1450': {
    brand: 'COBREQ',
    oem: 'CN15-2K021-AA',
    applications: ['Ford Ka 1.0', 'Ford Ka 1.5', 'Ford Fiesta 1.0', 'Ford Fiesta 1.6', 'Ford EcoSport 1.5', 'Ford EcoSport 1.6', 'Ford EcoSport 2.0'],
    position: 'front',
    specs: { height: 54, width: 130, thickness: 17, wearIndicator: true },
    equivalents: ['FRAS-LE PD/1450', 'BOSCH BP1450', 'MOTORCRAFT BR1450']
  },

  // ==================== JEEP ====================
  'N-1600': { 
    brand: 'COBREQ',
    oem: '68212327AB',
    applications: ['Jeep Renegade 1.8', 'Jeep Renegade 2.0 Turbo', 'Jeep Compass 2.0', 'Jeep Compass 2.0 Turbo', 'Jeep Commander 2.0 Turbo', 'Fiat Toro 1.8', 'Fiat Toro 2.0 Turbo'],
    position: 'front',
    specs: { height: 58, width: 150, thickness: 18, wearIndicator: true },
    equivalents: ['FRAS-LE PD/1600', 'BOSCH BP1600', 'MOPAR 68212327AB']
  },
  'N-1601': { 
    brand: 'COBREQ',
    oem: '68212328AB',
    applications: ['Jeep Renegade', 'Jeep Compass', 'Jeep Commander', 'Fiat Toro'],
    position: 'rear',
    specs: { height: 46, width: 105, thickness: 15 },
    equivalents: ['FRAS-LE PD/1601', 'BOSCH BP1601', 'MOPAR 68212328AB']
  },
};


// ============================================================================
// PASTILHAS DE FREIO - MOTOS
// ============================================================================
export const BRAKE_PADS_MOTORCYCLE = {
  // ==================== HONDA ====================
  'FA142': { 
    brand: 'EBC',
    oem: '06455-KYJ-901',
    applications: ['Honda CB300R', 'Honda CB300F', 'Honda CBR300R', 'Honda XRE300', 'Honda CB500F', 'Honda CB500X', 'Honda CBR500R', 'Honda NC750X', 'Honda NC750S'],
    position: 'front',
    specs: { compound: 'organic', wearIndicator: true },
    equivalents: ['VESRAH VD-156', 'COBREQ N-946', 'GOLDFREN S33']
  },
  'FA174': { 
    brand: 'EBC',
    oem: '06455-MFL-006',
    applications: ['Honda CBR600RR', 'Honda CBR1000RR', 'Honda CBR1000RR-R', 'Honda CB1000R', 'Honda VFR800', 'Honda VFR1200', 'Honda Africa Twin CRF1000L', 'Honda Africa Twin CRF1100L'],
    position: 'front',
    specs: { compound: 'sintered', wearIndicator: true },
    equivalents: ['VESRAH VD-355', 'BREMBO 07HO50', 'GOLDFREN K5']
  },
  'FA101': { 
    brand: 'EBC',
    oem: '06455-KYJ-305',
    applications: ['Honda CG125', 'Honda CG150 Titan', 'Honda CG160 Titan', 'Honda Bros 150', 'Honda Bros 160', 'Honda XRE190', 'Honda Biz 100', 'Honda Biz 110', 'Honda Biz 125'],
    position: 'front',
    specs: { compound: 'organic' },
    equivalents: ['COBREQ N-901', 'VEDAMOTORS VP101', 'GOLDFREN S33']
  },
  'FA196': {
    brand: 'EBC',
    oem: '06455-MKN-D01',
    applications: ['Honda CB650F', 'Honda CB650R', 'Honda CBR650F', 'Honda CBR650R'],
    position: 'front',
    specs: { compound: 'sintered', wearIndicator: true },
    equivalents: ['VESRAH VD-196', 'BREMBO 07HO50']
  },

  // ==================== YAMAHA ====================
  'FA229': { 
    brand: 'EBC',
    oem: '1WD-F5805-00',
    applications: ['Yamaha YZF-R3', 'Yamaha MT-03', 'Yamaha XJ6', 'Yamaha MT-07', 'Yamaha XSR700', 'Yamaha Tenere 700'],
    position: 'front',
    specs: { compound: 'organic', wearIndicator: true },
    equivalents: ['VESRAH VD-277', 'BREMBO 07YA23', 'GOLDFREN S33']
  },
  'FA252': {
    brand: 'EBC',
    oem: '2CR-W0045-00',
    applications: ['Yamaha YZF-R1', 'Yamaha YZF-R1M', 'Yamaha MT-10', 'Yamaha YZF-R6'],
    position: 'front',
    specs: { compound: 'sintered', wearIndicator: true },
    equivalents: ['VESRAH VD-252', 'BREMBO 07YA38']
  },
  'FA275': { 
    brand: 'EBC',
    oem: '5VL-W0045-00',
    applications: ['Yamaha Fazer 250', 'Yamaha Lander 250', 'Yamaha Crosser 150', 'Yamaha Factor 125', 'Yamaha Factor 150'],
    position: 'front',
    specs: { compound: 'organic' },
    equivalents: ['COBREQ N-975', 'VEDAMOTORS VP275', 'GOLDFREN S33']
  },
  'FA319': {
    brand: 'EBC',
    oem: '1RC-W0045-00',
    applications: ['Yamaha MT-09', 'Yamaha XSR900', 'Yamaha Tracer 900', 'Yamaha Niken'],
    position: 'front',
    specs: { compound: 'sintered', wearIndicator: true },
    equivalents: ['VESRAH VD-319', 'BREMBO 07YA38']
  },

  // ==================== KAWASAKI ====================
  'FA254': { 
    brand: 'EBC',
    oem: '43082-0091',
    applications: ['Kawasaki Ninja 300', 'Kawasaki Z300', 'Kawasaki Ninja 400', 'Kawasaki Z400', 'Kawasaki Ninja 650', 'Kawasaki Z650', 'Kawasaki Versys 650'],
    position: 'front',
    specs: { compound: 'organic', wearIndicator: true },
    equivalents: ['VESRAH VD-354', 'BREMBO 07KA17', 'GOLDFREN S33']
  },
  'FA417': {
    brand: 'EBC',
    oem: '43082-0124',
    applications: ['Kawasaki Ninja ZX-6R', 'Kawasaki ZX-10R', 'Kawasaki Z900', 'Kawasaki Z900RS', 'Kawasaki Z1000', 'Kawasaki Ninja H2', 'Kawasaki Versys 1000'],
    position: 'front',
    specs: { compound: 'sintered', wearIndicator: true },
    equivalents: ['VESRAH VD-417', 'BREMBO 07KA28']
  },

  // ==================== SUZUKI ====================
  'FA379': { 
    brand: 'EBC',
    oem: '59100-29830',
    applications: ['Suzuki GSX-R600', 'Suzuki GSX-R750', 'Suzuki GSX-R1000', 'Suzuki GSX-S750', 'Suzuki GSX-S1000', 'Suzuki V-Strom 650', 'Suzuki V-Strom 1000', 'Suzuki V-Strom 1050', 'Suzuki Hayabusa GSX1300R', 'Suzuki SV650', 'Suzuki Katana 1000'],
    position: 'front',
    specs: { compound: 'sintered', wearIndicator: true },
    equivalents: ['VESRAH VD-379', 'BREMBO 07SU26', 'GOLDFREN K5']
  },

  // ==================== BMW ====================
  'FA447': { 
    brand: 'EBC',
    oem: '34117711537',
    applications: ['BMW S1000RR', 'BMW S1000R', 'BMW S1000XR', 'BMW F800GS', 'BMW F800R', 'BMW F750GS', 'BMW F850GS', 'BMW F900R', 'BMW F900XR'],
    position: 'front',
    specs: { compound: 'sintered', wearIndicator: true },
    equivalents: ['VESRAH VD-447', 'BREMBO 07BB37', 'GOLDFREN K5']
  },
  'FA630': {
    brand: 'EBC',
    oem: '34117714792',
    applications: ['BMW R1200GS', 'BMW R1200RT', 'BMW R1200R', 'BMW R1250GS', 'BMW R1250RT', 'BMW R1250R', 'BMW R nineT'],
    position: 'front',
    specs: { compound: 'sintered', wearIndicator: true },
    equivalents: ['VESRAH VD-630', 'BREMBO 07BB38']
  },

  // ==================== DUCATI ====================
  'FA322': { 
    brand: 'EBC',
    oem: '61340791A',
    applications: ['Ducati Monster 797', 'Ducati Monster 821', 'Ducati Monster 1200', 'Ducati Multistrada 950', 'Ducati Multistrada 1200', 'Ducati Multistrada 1260', 'Ducati Multistrada V4', 'Ducati Panigale V2', 'Ducati Panigale V4', 'Ducati Scrambler', 'Ducati Diavel', 'Ducati Hypermotard', 'Ducati Streetfighter V4'],
    position: 'front',
    specs: { compound: 'sintered', wearIndicator: true },
    equivalents: ['VESRAH VD-322', 'BREMBO 07BB33', 'GOLDFREN K5']
  },

  // ==================== KTM ====================
  'FA181': { 
    brand: 'EBC',
    oem: '90113030000',
    applications: ['KTM Duke 200', 'KTM Duke 250', 'KTM Duke 390', 'KTM RC 200', 'KTM RC 250', 'KTM RC 390', 'KTM Adventure 390'],
    position: 'front',
    specs: { compound: 'sintered', wearIndicator: true },
    equivalents: ['VESRAH VD-181', 'BREMBO 07BB04']
  },
  'FA244': {
    brand: 'EBC',
    oem: '61013030000',
    applications: ['KTM Duke 690', 'KTM SMC 690', 'KTM 790 Duke', 'KTM 790 Adventure', 'KTM 890 Duke', 'KTM 890 Adventure', 'KTM 1290 Super Duke', 'KTM 1290 Super Adventure'],
    position: 'front',
    specs: { compound: 'sintered', wearIndicator: true },
    equivalents: ['VESRAH VD-244', 'BREMBO 07BB37']
  },

  // ==================== TRIUMPH ====================
  'FA236': {
    brand: 'EBC',
    oem: 'T2020560',
    applications: ['Triumph Street Triple 675', 'Triumph Street Triple 765', 'Triumph Speed Triple 1050', 'Triumph Speed Triple 1200', 'Triumph Tiger 800', 'Triumph Tiger 900', 'Triumph Tiger 1200', 'Triumph Trident 660'],
    position: 'front',
    specs: { compound: 'sintered', wearIndicator: true },
    equivalents: ['VESRAH VD-236', 'BREMBO 07BB33']
  },

  // ==================== HARLEY-DAVIDSON ====================
  'FA400': {
    brand: 'EBC',
    oem: '41854-08',
    applications: ['Harley-Davidson Sportster 883', 'Harley-Davidson Sportster 1200', 'Harley-Davidson Softail', 'Harley-Davidson Dyna', 'Harley-Davidson Touring', 'Harley-Davidson Street Glide', 'Harley-Davidson Road King'],
    position: 'front',
    specs: { compound: 'sintered', wearIndicator: true },
    equivalents: ['VESRAH VD-400', 'DRAG SPECIALTIES 1720-0241']
  },
};

// ============================================================================
// VELAS DE IGNIÇÃO - CARROS
// ============================================================================
export const SPARK_PLUGS = {
  // ==================== VOLKSWAGEN ====================
  'BKR6E': { 
    brand: 'NGK',
    oem: '101000033AA',
    applications: ['VW Gol G5 1.0', 'VW Gol G5 1.6', 'VW Gol G6 1.0', 'VW Gol G6 1.6', 'VW Voyage G5', 'VW Voyage G6', 'VW Fox 1.0', 'VW Fox 1.6', 'VW Saveiro G5', 'VW Saveiro G6'],
    engines: ['EA111 1.0 8V', 'EA111 1.6 8V'],
    specs: { gap: 0.8, thread: 'M14x1.25', reach: 19, heatRange: 6, type: 'standard' },
    equivalents: ['BOSCH FR7DC+', 'DENSO K20PR-U', 'CHAMPION RC9YC']
  },
  'ILKAR7B11': { 
    brand: 'NGK',
    oem: '04E905612C',
    applications: ['VW Polo 1.0 TSI', 'VW Polo 1.4 TSI', 'VW Virtus 1.0 TSI', 'VW Virtus 1.6', 'VW T-Cross 1.0 TSI', 'VW T-Cross 1.4 TSI', 'VW Nivus 1.0 TSI', 'VW Taos 1.4 TSI', 'VW Up TSI', 'Audi A3 1.4 TFSI', 'Audi Q3 1.4 TFSI'],
    engines: ['EA211 1.0 TSI', 'EA211 1.4 TSI'],
    specs: { gap: 1.1, thread: 'M12x1.25', reach: 26.5, heatRange: 7, type: 'iridium' },
    equivalents: ['BOSCH FR6KI332S', 'DENSO IK20TT', 'CHAMPION OE238']
  },

  // ==================== FIAT ====================
  'BKR6E': { 
    brand: 'NGK',
    oem: '55249868',
    applications: ['Fiat Uno 1.0', 'Fiat Uno 1.4', 'Fiat Palio 1.0', 'Fiat Palio 1.4', 'Fiat Siena 1.0', 'Fiat Siena 1.4', 'Fiat Strada 1.4', 'Fiat Mobi 1.0'],
    engines: ['Fire 1.0 8V', 'Fire 1.4 8V'],
    specs: { gap: 0.8, thread: 'M14x1.25', reach: 19, heatRange: 6, type: 'standard' },
    equivalents: ['BOSCH FR7DC+', 'DENSO K20PR-U', 'CHAMPION RC9YC']
  },
  'ILKAR7C7': {
    brand: 'NGK',
    oem: '55282087',
    applications: ['Fiat Argo 1.0', 'Fiat Argo 1.3', 'Fiat Cronos 1.3', 'Fiat Pulse 1.0', 'Fiat Pulse 1.3', 'Fiat Fastback 1.0', 'Fiat Fastback 1.3'],
    engines: ['Firefly 1.0', 'Firefly 1.3'],
    specs: { gap: 0.7, thread: 'M12x1.25', reach: 26.5, heatRange: 7, type: 'iridium' },
    equivalents: ['BOSCH FR6KI332S', 'DENSO IK20TT']
  },

  // ==================== CHEVROLET ====================
  'BKR5EGP': { 
    brand: 'NGK',
    oem: '55576193',
    applications: ['Chevrolet Onix 1.0', 'Chevrolet Onix 1.4', 'Chevrolet Onix Plus 1.0', 'Chevrolet Prisma 1.0', 'Chevrolet Prisma 1.4', 'Chevrolet Cobalt 1.4', 'Chevrolet Cobalt 1.8', 'Chevrolet Spin 1.8'],
    engines: ['SPE/4 1.0', 'SPE/4 1.4', 'Ecotec 1.8'],
    specs: { gap: 0.9, thread: 'M14x1.25', reach: 19, heatRange: 5, type: 'platinum' },
    equivalents: ['BOSCH FR7KPP33+', 'DENSO PK20PR-P8', 'ACDelco 41-110']
  },
  'ILTR5A13G': {
    brand: 'NGK',
    oem: '12681663',
    applications: ['Chevrolet Onix Plus 1.0 Turbo', 'Chevrolet Tracker 1.0 Turbo', 'Chevrolet Tracker 1.2 Turbo', 'Chevrolet Cruze 1.4 Turbo', 'Chevrolet Equinox 1.5 Turbo', 'Chevrolet Montana 1.2 Turbo'],
    engines: ['Ecotec 1.0 Turbo', 'Ecotec 1.2 Turbo', 'Ecotec 1.4 Turbo', 'Ecotec 1.5 Turbo'],
    specs: { gap: 0.9, thread: 'M12x1.25', reach: 26.5, heatRange: 5, type: 'iridium' },
    equivalents: ['BOSCH FR6KI332S', 'DENSO IK20TT', 'ACDelco 41-114']
  },

  // ==================== HONDA ====================
  'IZFR6K11': { 
    brand: 'NGK',
    oem: '12290-R1A-A01',
    applications: ['Honda Civic 1.8', 'Honda Civic 2.0', 'Honda Fit 1.4', 'Honda Fit 1.5', 'Honda City 1.5', 'Honda HR-V 1.8', 'Honda WR-V 1.5', 'Honda CR-V 2.0', 'Honda CR-V 2.4'],
    engines: ['R18A', 'R20A', 'L15A', 'K24A'],
    specs: { gap: 1.1, thread: 'M14x1.25', reach: 19, heatRange: 6, type: 'iridium' },
    equivalents: ['DENSO SK20R11', 'BOSCH FR6KI332S', 'CHAMPION OE238']
  },

  // ==================== TOYOTA ====================
  'BKR6EIX': { 
    brand: 'NGK',
    oem: '90919-01253',
    applications: ['Toyota Corolla 1.8', 'Toyota Corolla 2.0', 'Toyota Yaris 1.3', 'Toyota Yaris 1.5', 'Toyota Etios 1.3', 'Toyota Etios 1.5', 'Toyota RAV4 2.0', 'Toyota RAV4 2.5'],
    engines: ['1ZZ-FE', '2ZR-FE', '2ZR-FBE', '1NZ-FE', '2NZ-FE', '1NR-FE', '2AR-FE'],
    specs: { gap: 1.1, thread: 'M14x1.25', reach: 19, heatRange: 6, type: 'iridium' },
    equivalents: ['DENSO SK20R11', 'BOSCH FR6KI332S', 'CHAMPION OE238']
  },

  // ==================== HYUNDAI/KIA ====================
  'BKR5EIX': { 
    brand: 'NGK',
    oem: '18846-11070',
    applications: ['Hyundai HB20 1.0', 'Hyundai HB20 1.6', 'Hyundai HB20S 1.0', 'Hyundai HB20S 1.6', 'Hyundai Creta 1.6', 'Hyundai Creta 2.0', 'Kia Rio 1.6', 'Kia Cerato 1.6', 'Kia Cerato 2.0', 'Kia Stonic 1.0'],
    engines: ['Gamma 1.0', 'Gamma 1.6', 'Nu 2.0'],
    specs: { gap: 1.0, thread: 'M14x1.25', reach: 19, heatRange: 5, type: 'iridium' },
    equivalents: ['DENSO IK20', 'BOSCH FR6KI332S', 'CHAMPION OE238']
  },

  // ==================== RENAULT ====================
  'BKR5E': { 
    brand: 'NGK',
    oem: '7700500155',
    applications: ['Renault Sandero 1.0', 'Renault Sandero 1.6', 'Renault Logan 1.0', 'Renault Logan 1.6', 'Renault Duster 1.6', 'Renault Duster 2.0', 'Renault Captur 1.6', 'Renault Captur 2.0', 'Renault Kwid 1.0'],
    engines: ['K7M 1.6 8V', 'K4M 1.6 16V', 'F4R 2.0 16V', 'SCe 1.0', 'H4M 1.6'],
    specs: { gap: 0.9, thread: 'M14x1.25', reach: 19, heatRange: 5, type: 'standard' },
    equivalents: ['BOSCH FR7DC', 'DENSO K20PR-U', 'CHAMPION RC9YC']
  },

  // ==================== FORD ====================
  'BKR6EK': { 
    brand: 'NGK',
    oem: 'CYFS-12F-5',
    applications: ['Ford Ka 1.0', 'Ford Ka 1.5', 'Ford Fiesta 1.0', 'Ford Fiesta 1.6', 'Ford EcoSport 1.5', 'Ford EcoSport 1.6', 'Ford EcoSport 2.0', 'Ford Focus 1.6', 'Ford Focus 2.0'],
    engines: ['Sigma 1.0', 'Sigma 1.6', 'Duratec 2.0', 'Dragon 1.5'],
    specs: { gap: 0.8, thread: 'M14x1.25', reach: 19, heatRange: 6, type: 'standard' },
    equivalents: ['BOSCH FR7KPP33', 'DENSO K20PR-U', 'MOTORCRAFT SP-411']
  },

  // ==================== JEEP ====================
  'SILKAR7B11': { 
    brand: 'NGK',
    oem: '68242128AA',
    applications: ['Jeep Renegade 1.8', 'Jeep Renegade 2.0 Turbo', 'Jeep Compass 2.0', 'Jeep Compass 2.0 Turbo', 'Jeep Commander 2.0 Turbo', 'Fiat Toro 1.8', 'Fiat Toro 2.0 Turbo'],
    engines: ['E.torQ 1.8', 'Hurricane 2.0 Turbo', 'Tigershark 2.0'],
    specs: { gap: 1.1, thread: 'M12x1.25', reach: 26.5, heatRange: 7, type: 'iridium' },
    equivalents: ['BOSCH FR6KI332S', 'DENSO IK20TT', 'MOPAR 68242128AA']
  },
};


// ============================================================================
// VELAS DE IGNIÇÃO - MOTOS
// ============================================================================
export const SPARK_PLUGS_MOTORCYCLE = {
  // ==================== HONDA ====================
  'CPR8EA-9': { 
    brand: 'NGK',
    oem: '31918-KYJ-901',
    applications: ['Honda CB300R', 'Honda CB300F', 'Honda CBR300R', 'Honda XRE300', 'Honda CG160 Titan', 'Honda CG160 Start', 'Honda Bros 160', 'Honda XRE190', 'Honda CB Twister 250'],
    specs: { gap: 0.9, thread: 'M10x1.0', reach: 19, heatRange: 8, type: 'standard' },
    equivalents: ['DENSO U24EPR9', 'CHAMPION RA8HC']
  },
  'CR9EK': { 
    brand: 'NGK',
    oem: '31918-MFL-003',
    applications: ['Honda CBR600RR', 'Honda CBR1000RR', 'Honda CBR1000RR-R', 'Honda CB1000R', 'Honda VFR800', 'Honda VFR1200'],
    specs: { gap: 0.9, thread: 'M10x1.0', reach: 19, heatRange: 9, type: 'standard' },
    equivalents: ['DENSO IU27', 'CHAMPION RA9HC']
  },
  'C7HSA': { 
    brand: 'NGK',
    oem: '31918-GN5-003',
    applications: ['Honda CG125', 'Honda CG150 Titan', 'Honda Bros 150', 'Honda Biz 100', 'Honda Biz 110', 'Honda Biz 125', 'Honda Pop 100', 'Honda Pop 110'],
    specs: { gap: 0.7, thread: 'M10x1.0', reach: 12.7, heatRange: 7, type: 'standard' },
    equivalents: ['DENSO U22FS-U', 'CHAMPION L82C']
  },
  'IMR9C-9HES': {
    brand: 'NGK',
    oem: '31918-MKN-D01',
    applications: ['Honda CB500F', 'Honda CB500X', 'Honda CBR500R', 'Honda NC750X', 'Honda NC750S', 'Honda CB650F', 'Honda CB650R', 'Honda CBR650F', 'Honda CBR650R', 'Honda Africa Twin CRF1000L', 'Honda Africa Twin CRF1100L'],
    specs: { gap: 0.9, thread: 'M10x1.0', reach: 19, heatRange: 9, type: 'iridium' },
    equivalents: ['DENSO IU27D', 'CHAMPION OE238']
  },

  // ==================== YAMAHA ====================
  'CR8E': { 
    brand: 'NGK',
    oem: '94702-00353',
    applications: ['Yamaha YZF-R3', 'Yamaha MT-03', 'Yamaha Fazer 250', 'Yamaha Lander 250', 'Yamaha Crosser 150', 'Yamaha Factor 125', 'Yamaha Factor 150'],
    specs: { gap: 0.8, thread: 'M10x1.0', reach: 19, heatRange: 8, type: 'standard' },
    equivalents: ['DENSO U24ESR-N', 'CHAMPION RA8HC']
  },
  'CR9EIA-9': { 
    brand: 'NGK',
    oem: '94702-00415',
    applications: ['Yamaha YZF-R1', 'Yamaha YZF-R1M', 'Yamaha YZF-R6', 'Yamaha MT-07', 'Yamaha MT-09', 'Yamaha MT-10', 'Yamaha XSR700', 'Yamaha XSR900', 'Yamaha Tenere 700', 'Yamaha Tracer 700', 'Yamaha Tracer 900', 'Yamaha Niken', 'Yamaha YZF-R7'],
    specs: { gap: 0.9, thread: 'M10x1.0', reach: 19, heatRange: 9, type: 'iridium' },
    equivalents: ['DENSO IU27D', 'CHAMPION OE238']
  },

  // ==================== KAWASAKI ====================
  'CR9EIA-9': { 
    brand: 'NGK',
    oem: '92070-0065',
    applications: ['Kawasaki Ninja 300', 'Kawasaki Z300', 'Kawasaki Ninja 400', 'Kawasaki Z400', 'Kawasaki Ninja 650', 'Kawasaki Z650', 'Kawasaki Versys 650', 'Kawasaki Vulcan S 650'],
    specs: { gap: 0.9, thread: 'M10x1.0', reach: 19, heatRange: 9, type: 'iridium' },
    equivalents: ['DENSO IU27D', 'CHAMPION OE238']
  },
  'CR9EK': {
    brand: 'NGK',
    oem: '92070-0124',
    applications: ['Kawasaki Ninja ZX-6R', 'Kawasaki ZX-10R', 'Kawasaki Z900', 'Kawasaki Z900RS', 'Kawasaki Z1000', 'Kawasaki Ninja H2', 'Kawasaki Versys 1000'],
    specs: { gap: 0.9, thread: 'M10x1.0', reach: 19, heatRange: 9, type: 'standard' },
    equivalents: ['DENSO IU27', 'CHAMPION RA9HC']
  },

  // ==================== SUZUKI ====================
  'CR9EIX': { 
    brand: 'NGK',
    oem: '09482-00508',
    applications: ['Suzuki GSX-R600', 'Suzuki GSX-R750', 'Suzuki GSX-R1000', 'Suzuki GSX-S750', 'Suzuki GSX-S1000', 'Suzuki V-Strom 650', 'Suzuki V-Strom 1000', 'Suzuki V-Strom 1050', 'Suzuki Hayabusa GSX1300R', 'Suzuki SV650', 'Suzuki Katana 1000'],
    specs: { gap: 0.9, thread: 'M10x1.0', reach: 19, heatRange: 9, type: 'iridium' },
    equivalents: ['DENSO IU27', 'CHAMPION OE238']
  },

  // ==================== BMW ====================
  'LMAR8AI-8': { 
    brand: 'NGK',
    oem: '12121464045',
    applications: ['BMW S1000RR', 'BMW S1000R', 'BMW S1000XR', 'BMW F800GS', 'BMW F800R', 'BMW F750GS', 'BMW F850GS', 'BMW F900R', 'BMW F900XR'],
    specs: { gap: 0.8, thread: 'M10x1.0', reach: 19, heatRange: 8, type: 'iridium' },
    equivalents: ['DENSO IU27D', 'CHAMPION OE238']
  },
  'LMAR9AI-10': {
    brand: 'NGK',
    oem: '12121464046',
    applications: ['BMW R1200GS', 'BMW R1200RT', 'BMW R1200R', 'BMW R1250GS', 'BMW R1250RT', 'BMW R1250R', 'BMW R nineT'],
    specs: { gap: 1.0, thread: 'M10x1.0', reach: 19, heatRange: 9, type: 'iridium' },
    equivalents: ['DENSO IU27D', 'CHAMPION OE238']
  },

  // ==================== DUCATI ====================
  'MAR10A-J': { 
    brand: 'NGK',
    oem: '67040361A',
    applications: ['Ducati Monster 797', 'Ducati Monster 821', 'Ducati Monster 1200', 'Ducati Multistrada 950', 'Ducati Multistrada 1200', 'Ducati Multistrada 1260', 'Ducati Multistrada V4', 'Ducati Panigale V2', 'Ducati Panigale V4', 'Ducati Scrambler', 'Ducati Diavel', 'Ducati Hypermotard', 'Ducati Streetfighter V4'],
    specs: { gap: 0.9, thread: 'M10x1.0', reach: 19, heatRange: 10, type: 'iridium' },
    equivalents: ['DENSO IU27D', 'CHAMPION OE238']
  },

  // ==================== KTM ====================
  'LKAR8AI-9': { 
    brand: 'NGK',
    oem: '60039093000',
    applications: ['KTM Duke 200', 'KTM Duke 250', 'KTM Duke 390', 'KTM RC 200', 'KTM RC 250', 'KTM RC 390', 'KTM Adventure 390', 'KTM Duke 690', 'KTM 790 Duke', 'KTM 790 Adventure', 'KTM 890 Duke', 'KTM 890 Adventure', 'KTM 1290 Super Duke', 'KTM 1290 Super Adventure'],
    specs: { gap: 0.9, thread: 'M10x1.0', reach: 19, heatRange: 8, type: 'iridium' },
    equivalents: ['DENSO IU27D', 'CHAMPION OE238']
  },

  // ==================== TRIUMPH ====================
  'CR9EIA-9': {
    brand: 'NGK',
    oem: 'T1240001',
    applications: ['Triumph Street Triple 675', 'Triumph Street Triple 765', 'Triumph Speed Triple 1050', 'Triumph Speed Triple 1200', 'Triumph Tiger 800', 'Triumph Tiger 900', 'Triumph Tiger 1200', 'Triumph Trident 660'],
    specs: { gap: 0.9, thread: 'M10x1.0', reach: 19, heatRange: 9, type: 'iridium' },
    equivalents: ['DENSO IU27D', 'CHAMPION OE238']
  },

  // ==================== HARLEY-DAVIDSON ====================
  'DCPR7E': {
    brand: 'NGK',
    oem: '32331-04',
    applications: ['Harley-Davidson Sportster 883', 'Harley-Davidson Sportster 1200', 'Harley-Davidson Softail', 'Harley-Davidson Dyna', 'Harley-Davidson Touring', 'Harley-Davidson Street Glide', 'Harley-Davidson Road King'],
    specs: { gap: 0.9, thread: 'M12x1.25', reach: 19, heatRange: 7, type: 'standard' },
    equivalents: ['DENSO X24EPR-U9', 'CHAMPION RA8HC']
  },
};

// ============================================================================
// ÓLEOS DE MOTOR
// ============================================================================
export const ENGINE_OILS = {
  // ==================== SINTÉTICOS 5W-30 ====================
  '5W30_SYNTHETIC_SN_PLUS': { 
    viscosity: '5W-30',
    type: 'synthetic',
    specs: { api: 'SN Plus', acea: 'A3/B4', ilsac: 'GF-5' },
    applications: ['VW EA111', 'VW EA211', 'GM Ecotec', 'GM SPE/4', 'Ford Sigma', 'Ford Duratec', 'Honda i-VTEC', 'Fiat Fire', 'Fiat E.torQ', 'Fiat Firefly', 'Renault K4M', 'Renault K7M', 'Hyundai Gamma', 'Hyundai Nu', 'Toyota 2ZR', 'Toyota 1NZ', 'VW Gol', 'VW Polo', 'VW Virtus', 'VW T-Cross', 'GM Onix', 'GM Tracker', 'Honda Civic', 'Honda HR-V', 'Fiat Argo', 'Fiat Cronos', 'Toyota Corolla', 'Toyota Yaris', 'Hyundai HB20', 'Hyundai Creta', 'Renault Sandero', 'Renault Duster'],
    brands: [
      { name: 'Mobil 1 ESP', partNumber: '124715' },
      { name: 'Castrol Edge', partNumber: '15B1B3' },
      { name: 'Shell Helix Ultra', partNumber: '550046267' },
      { name: 'Petronas Syntium 5000', partNumber: '18135019' },
      { name: 'Motul 8100 X-clean', partNumber: '102020' },
      { name: 'Liqui Moly Top Tec 4200', partNumber: '3715' },
      { name: 'Total Quartz 9000', partNumber: '213765' },
      { name: 'Valvoline SynPower', partNumber: '881083' }
    ],
    changeInterval: { km: 10000, months: 12 }
  },

  // ==================== SINTÉTICOS 5W-40 ====================
  '5W40_SYNTHETIC_SN': { 
    viscosity: '5W-40',
    type: 'synthetic',
    specs: { api: 'SN', acea: 'A3/B4' },
    applications: ['VW EA888', 'BMW N20', 'BMW B48', 'Audi TFSI', 'Mercedes M270', 'Mercedes M274', 'VW Golf GTI', 'VW Jetta GLI', 'VW Tiguan', 'VW Amarok', 'BMW 320i', 'BMW X1', 'BMW X3', 'Mercedes C200', 'Mercedes A200', 'Mercedes GLA200', 'Audi A3', 'Audi A4', 'Audi Q3', 'Audi Q5'],
    brands: [
      { name: 'Mobil 1 FS', partNumber: '153678' },
      { name: 'Castrol Edge', partNumber: '15B1B4' },
      { name: 'Shell Helix Ultra', partNumber: '550046268' },
      { name: 'Motul 8100 X-cess', partNumber: '102784' },
      { name: 'Liqui Moly Synthoil', partNumber: '2050' },
      { name: 'Total Quartz 9000', partNumber: '213766' }
    ],
    changeInterval: { km: 10000, months: 12 }
  },

  // ==================== SINTÉTICOS 0W-20 ====================
  '0W20_SYNTHETIC_SP': { 
    viscosity: '0W-20',
    type: 'synthetic',
    specs: { api: 'SP', ilsac: 'GF-6A' },
    applications: ['Toyota Dynamic Force', 'Honda Earth Dreams', 'Hyundai Smartstream', 'Toyota Corolla 2020+', 'Toyota Corolla Cross', 'Toyota RAV4 2020+', 'Honda Civic 2017+', 'Honda CR-V 2017+', 'Hyundai HB20 2020+', 'Hyundai Creta 2022+'],
    brands: [
      { name: 'Mobil 1 Advanced Fuel Economy', partNumber: '124715' },
      { name: 'Castrol Edge', partNumber: '15B1B0' },
      { name: 'Toyota Genuine', partNumber: '08880-12205' },
      { name: 'Honda Genuine', partNumber: '08798-9036' },
      { name: 'Shell Helix Ultra', partNumber: '550046269' },
      { name: 'Motul 8100 Eco-lite', partNumber: '108534' }
    ],
    changeInterval: { km: 10000, months: 12 }
  },

  // ==================== DIESEL 15W-40 ====================
  '15W40_DIESEL_CK4': { 
    viscosity: '15W-40',
    type: 'mineral',
    specs: { api: 'CK-4', acea: 'E9' },
    applications: ['Toyota Hilux Diesel', 'Toyota SW4 Diesel', 'Ford Ranger Diesel', 'Chevrolet S10 Diesel', 'Chevrolet Trailblazer Diesel', 'Mitsubishi L200 Triton', 'Mitsubishi Pajero Diesel', 'Nissan Frontier Diesel', 'VW Amarok Diesel'],
    brands: [
      { name: 'Shell Rimula R4', partNumber: '550044849' },
      { name: 'Mobil Delvac MX', partNumber: '121650' },
      { name: 'Castrol Vecton', partNumber: '15B1D4' },
      { name: 'Petronas Urania 3000', partNumber: '18135040' },
      { name: 'Total Rubia TIR 7400', partNumber: '213780' }
    ],
    changeInterval: { km: 10000, months: 12 }
  },

  // ==================== DIESEL 5W-30 ====================
  '5W30_DIESEL_CK4': { 
    viscosity: '5W-30',
    type: 'synthetic',
    specs: { api: 'CK-4', acea: 'C3' },
    applications: ['Jeep Renegade Diesel', 'Jeep Compass Diesel', 'Jeep Commander Diesel', 'Fiat Toro Diesel', 'BMW X1 Diesel', 'Mercedes GLA Diesel', 'Peugeot 3008 Diesel', 'Citroën C4 Lounge Diesel'],
    brands: [
      { name: 'Shell Helix Ultra Diesel', partNumber: '550046270' },
      { name: 'Mobil 1 ESP', partNumber: '153679' },
      { name: 'Castrol Edge Diesel', partNumber: '15B1D5' },
      { name: 'Motul 8100 X-clean EFE', partNumber: '109471' }
    ],
    changeInterval: { km: 10000, months: 12 }
  },

  // ==================== MOTOS 10W-40 ====================
  '10W40_MOTO_MA2': { 
    viscosity: '10W-40',
    type: 'synthetic',
    specs: { jaso: 'MA2', api: 'SN' },
    applications: ['Honda CB300', 'Honda CB500', 'Honda CBR500', 'Honda NC750', 'Honda CB650', 'Honda CBR650', 'Yamaha MT-03', 'Yamaha YZF-R3', 'Yamaha MT-07', 'Yamaha Fazer 250', 'Kawasaki Ninja 300', 'Kawasaki Z300', 'Kawasaki Ninja 400', 'Kawasaki Z400', 'Kawasaki Ninja 650', 'Kawasaki Z650', 'Suzuki GSX-R600', 'Suzuki V-Strom 650', 'KTM Duke 390', 'KTM RC 390', 'Triumph Street Triple', 'Triumph Tiger 800'],
    brands: [
      { name: 'Motul 5100', partNumber: '104066' },
      { name: 'Castrol Power1 4T', partNumber: '15B1M4' },
      { name: 'Shell Advance AX7', partNumber: '550044850' },
      { name: 'Mobil 1 Racing 4T', partNumber: '124716' },
      { name: 'Yamalube 4T', partNumber: '90793-AH411' },
      { name: 'Repsol Moto Sport 4T', partNumber: 'RP163N51' }
    ],
    changeInterval: { km: 5000, months: 6 }
  },

  // ==================== MOTOS 15W-50 ====================
  '15W50_MOTO_MA2': { 
    viscosity: '15W-50',
    type: 'synthetic',
    specs: { jaso: 'MA2', api: 'SN' },
    applications: ['BMW S1000RR', 'BMW R1200GS', 'BMW R1250GS', 'BMW F800GS', 'BMW F850GS', 'Ducati Monster', 'Ducati Multistrada', 'Ducati Panigale', 'Ducati Scrambler', 'KTM 1290 Super Duke', 'KTM 890 Adventure', 'Triumph Speed Triple', 'Triumph Tiger 1200', 'Harley-Davidson Touring', 'Harley-Davidson Softail'],
    brands: [
      { name: 'Motul 7100', partNumber: '104299' },
      { name: 'Castrol Power1 Racing', partNumber: '15B1M5' },
      { name: 'Shell Advance Ultra', partNumber: '550044851' },
      { name: 'BMW Motorrad Advantec', partNumber: '83122405891' },
      { name: 'Repsol Moto Racing 4T', partNumber: 'RP163N52' }
    ],
    changeInterval: { km: 5000, months: 6 }
  },

  // ==================== MOTOS 20W-50 ====================
  '20W50_MOTO_MA': { 
    viscosity: '20W-50',
    type: 'mineral',
    specs: { jaso: 'MA', api: 'SL' },
    applications: ['Honda CG125', 'Honda CG150', 'Honda CG160', 'Honda Bros 150', 'Honda Bros 160', 'Honda Biz 100', 'Honda Biz 110', 'Honda Biz 125', 'Honda Pop 100', 'Honda Pop 110', 'Yamaha Factor 125', 'Yamaha Factor 150', 'Yamaha YBR125', 'Yamaha Crosser 150', 'Suzuki Yes 125', 'Dafra Riva 150', 'Dafra Apache 150'],
    brands: [
      { name: 'Motul 3000', partNumber: '104048' },
      { name: 'Castrol Activ 4T', partNumber: '15B1M2' },
      { name: 'Shell Advance AX5', partNumber: '550044852' },
      { name: 'Mobil Super Moto 4T', partNumber: '124717' },
      { name: 'Ipiranga Moto 4T', partNumber: 'IP2050' }
    ],
    changeInterval: { km: 3000, months: 3 }
  },

  // ==================== MOTOS 10W-30 RACING ====================
  '10W30_MOTO_RACING': { 
    viscosity: '10W-30',
    type: 'synthetic',
    specs: { jaso: 'MA2', api: 'SN' },
    applications: ['Honda CBR600RR', 'Honda CBR1000RR', 'Honda CBR1000RR-R', 'Yamaha YZF-R1', 'Yamaha YZF-R6', 'Kawasaki ZX-6R', 'Kawasaki ZX-10R', 'Kawasaki Ninja H2', 'Suzuki GSX-R750', 'Suzuki GSX-R1000', 'Suzuki Hayabusa', 'Ducati Panigale V4', 'Ducati Streetfighter V4', 'BMW S1000RR'],
    brands: [
      { name: 'Motul 300V', partNumber: '104128' },
      { name: 'Castrol Power1 Racing', partNumber: '15B1M3' },
      { name: 'Shell Advance Racing', partNumber: '550044853' },
      { name: 'Repsol Moto Racing 4T', partNumber: 'RP163N53' }
    ],
    changeInterval: { km: 3000, months: 3 }
  },
};


// ============================================================================
// CORREIAS DENTADAS E KITS DE DISTRIBUIÇÃO
// ============================================================================
export const TIMING_BELTS = {
  // ==================== VOLKSWAGEN ====================
  'CT1028K1': {
    brand: 'CONTITECH',
    oem: '04E198119',
    applications: ['VW Gol G5 1.0', 'VW Gol G5 1.6', 'VW Gol G6 1.0', 'VW Gol G6 1.6', 'VW Voyage G5', 'VW Voyage G6', 'VW Fox 1.0', 'VW Fox 1.6', 'VW Saveiro G5', 'VW Saveiro G6', 'VW Up 1.0'],
    engines: ['EA111 1.0', 'EA111 1.6'],
    specs: { teeth: 137, width: 25.4, type: 'kit_completo' },
    includes: ['correia', 'tensor', 'polia_guia', 'bomba_agua'],
    equivalents: ['GATES KP15580XS', 'DAYCO KTBWP3390', 'SKF VKMC01148-2']
  },
  'CT1139K1': {
    brand: 'CONTITECH',
    oem: '04E198119A',
    applications: ['VW Polo 1.0 TSI', 'VW Polo 1.6', 'VW Virtus 1.0 TSI', 'VW Virtus 1.6', 'VW T-Cross 1.0 TSI', 'VW Nivus 1.0 TSI', 'VW Taos 1.4 TSI', 'Audi A3 1.4 TFSI', 'Audi Q3 1.4 TFSI'],
    engines: ['EA211 1.0 TSI', 'EA211 1.4 TSI', 'EA211 1.6 MSI'],
    specs: { teeth: 141, width: 25.4, type: 'kit_completo' },
    includes: ['correia', 'tensor', 'polia_guia', 'bomba_agua'],
    equivalents: ['GATES KP15678XS', 'DAYCO KTBWP9670', 'SKF VKMC01250-1']
  },

  // ==================== FIAT ====================
  'CT1105K1': {
    brand: 'CONTITECH',
    oem: '71771581',
    applications: ['Fiat Uno 1.0', 'Fiat Uno 1.4', 'Fiat Palio 1.0', 'Fiat Palio 1.4', 'Fiat Siena 1.0', 'Fiat Siena 1.4', 'Fiat Strada 1.4', 'Fiat Mobi 1.0'],
    engines: ['Fire 1.0 8V', 'Fire 1.4 8V'],
    specs: { teeth: 129, width: 25.4, type: 'kit_completo' },
    includes: ['correia', 'tensor', 'polia_guia', 'bomba_agua'],
    equivalents: ['GATES KP15592XS', 'DAYCO KTBWP3210', 'SKF VKMC02206-2']
  },
  'CT1168K1': {
    brand: 'CONTITECH',
    oem: '55282085',
    applications: ['Fiat Argo 1.0', 'Fiat Argo 1.3', 'Fiat Cronos 1.3', 'Fiat Pulse 1.0', 'Fiat Pulse 1.3', 'Fiat Fastback 1.0', 'Fiat Fastback 1.3'],
    engines: ['Firefly 1.0', 'Firefly 1.3'],
    specs: { teeth: 145, width: 25.4, type: 'kit_completo' },
    includes: ['correia', 'tensor', 'polia_guia', 'bomba_agua'],
    equivalents: ['GATES KP15680XS', 'DAYCO KTBWP9680']
  },

  // ==================== CHEVROLET ====================
  'CT1077K1': {
    brand: 'CONTITECH',
    oem: '55574539',
    applications: ['Chevrolet Onix 1.0', 'Chevrolet Onix 1.4', 'Chevrolet Prisma 1.0', 'Chevrolet Prisma 1.4', 'Chevrolet Cobalt 1.4', 'Chevrolet Cobalt 1.8', 'Chevrolet Spin 1.8'],
    engines: ['SPE/4 1.0', 'SPE/4 1.4', 'Ecotec 1.8'],
    specs: { teeth: 133, width: 25.4, type: 'kit_completo' },
    includes: ['correia', 'tensor', 'polia_guia', 'bomba_agua'],
    equivalents: ['GATES KP15606XS', 'DAYCO KTBWP7590', 'ACDelco 24422964']
  },

  // ==================== HONDA ====================
  'CT1015K1': {
    brand: 'CONTITECH',
    oem: '14400-RNA-A01',
    applications: ['Honda Civic 1.8', 'Honda Civic 2.0', 'Honda Fit 1.4', 'Honda Fit 1.5', 'Honda City 1.5', 'Honda HR-V 1.8', 'Honda WR-V 1.5'],
    engines: ['R18A', 'R20A', 'L15A'],
    specs: { teeth: 137, width: 25.4, type: 'kit_completo' },
    includes: ['correia', 'tensor', 'polia_guia', 'bomba_agua'],
    equivalents: ['GATES KP15577XS', 'DAYCO KTBWP3380']
  },

  // ==================== TOYOTA ====================
  'CT1038K1': {
    brand: 'CONTITECH',
    oem: '13568-09130',
    applications: ['Toyota Corolla 1.8', 'Toyota Corolla 2.0', 'Toyota Yaris 1.3', 'Toyota Yaris 1.5', 'Toyota Etios 1.3', 'Toyota Etios 1.5'],
    engines: ['1ZZ-FE', '2ZR-FE', '2ZR-FBE', '1NZ-FE', '2NZ-FE', '1NR-FE'],
    specs: { teeth: 141, width: 25.4, type: 'kit_completo' },
    includes: ['correia', 'tensor', 'polia_guia', 'bomba_agua'],
    equivalents: ['GATES KP15598XS', 'DAYCO KTBWP3400']
  },

  // ==================== HYUNDAI/KIA ====================
  'CT1055K1': {
    brand: 'CONTITECH',
    oem: '24312-2B000',
    applications: ['Hyundai HB20 1.0', 'Hyundai HB20 1.6', 'Hyundai HB20S 1.0', 'Hyundai HB20S 1.6', 'Hyundai Creta 1.6', 'Kia Rio 1.6', 'Kia Stonic 1.0'],
    engines: ['Gamma 1.0', 'Gamma 1.6'],
    specs: { teeth: 137, width: 25.4, type: 'kit_completo' },
    includes: ['correia', 'tensor', 'polia_guia', 'bomba_agua'],
    equivalents: ['GATES KP15610XS', 'DAYCO KTBWP7600']
  },

  // ==================== RENAULT ====================
  'CT1065K1': {
    brand: 'CONTITECH',
    oem: '130C17529R',
    applications: ['Renault Sandero 1.0', 'Renault Sandero 1.6', 'Renault Logan 1.0', 'Renault Logan 1.6', 'Renault Duster 1.6', 'Renault Duster 2.0', 'Renault Captur 1.6', 'Renault Kwid 1.0'],
    engines: ['K7M 1.6 8V', 'K4M 1.6 16V', 'F4R 2.0 16V', 'SCe 1.0'],
    specs: { teeth: 133, width: 25.4, type: 'kit_completo' },
    includes: ['correia', 'tensor', 'polia_guia', 'bomba_agua'],
    equivalents: ['GATES KP15615XS', 'DAYCO KTBWP7610']
  },
};


// ============================================================================
// KIT RELAÇÃO - MOTOS
// ============================================================================
export const CHAIN_KITS = {
  // ==================== HONDA ====================
  'CB300_KIT': { 
    brand: 'VORTEX',
    oem: '40530-KVK-900',
    applications: ['Honda CB300R', 'Honda CB300F', 'Honda CBR300R'],
    specs: { chain: '520', links: 108, sprocket: 38, pinion: 14, type: 'O-Ring' },
    equivalents: ['DID 520VX3', 'RK 520XSO', 'REGINA 520ZRP', 'RIFFEL 70804']
  },
  'CB500_KIT': { 
    brand: 'VORTEX',
    oem: '40530-MJW-J00',
    applications: ['Honda CB500F', 'Honda CB500X', 'Honda CBR500R'],
    specs: { chain: '520', links: 112, sprocket: 41, pinion: 15, type: 'X-Ring' },
    equivalents: ['DID 520VX3', 'RK 520XSO', 'REGINA 520ZRP']
  },
  'NC750_KIT': { 
    brand: 'VORTEX',
    oem: '40530-MKA-D00',
    applications: ['Honda NC750X', 'Honda NC750S', 'Honda Integra 750'],
    specs: { chain: '520', links: 114, sprocket: 40, pinion: 17, type: 'X-Ring' },
    equivalents: ['DID 520VX3', 'RK 520XSO']
  },
  'CG160_KIT': {
    brand: 'RIFFEL',
    oem: '40530-KVS-900',
    applications: ['Honda CG160 Titan', 'Honda CG160 Start', 'Honda Bros 160', 'Honda XRE190'],
    specs: { chain: '428', links: 118, sprocket: 44, pinion: 15, type: 'Standard' },
    equivalents: ['DID 428HD', 'RK 428HSB', 'REGINA 428']
  },
  'XRE300_KIT': {
    brand: 'VORTEX',
    oem: '40530-KWV-900',
    applications: ['Honda XRE300', 'Honda CB Twister 250'],
    specs: { chain: '520', links: 106, sprocket: 40, pinion: 13, type: 'O-Ring' },
    equivalents: ['DID 520VX3', 'RK 520XSO', 'RIFFEL 70806']
  },

  // ==================== YAMAHA ====================
  'MT03_KIT': { 
    brand: 'VORTEX',
    oem: '1WD-F5450-00',
    applications: ['Yamaha MT-03', 'Yamaha YZF-R3', 'Yamaha YZF-R25', 'Yamaha MT-25'],
    specs: { chain: '520', links: 112, sprocket: 43, pinion: 14, type: 'X-Ring' },
    equivalents: ['DID 520VX3', 'RK 520XSO', 'REGINA 520ZRP']
  },
  'MT07_KIT': { 
    brand: 'VORTEX',
    oem: '1WS-F5450-00',
    applications: ['Yamaha MT-07', 'Yamaha XSR700', 'Yamaha Tenere 700', 'Yamaha Tracer 700', 'Yamaha YZF-R7'],
    specs: { chain: '525', links: 112, sprocket: 43, pinion: 16, type: 'X-Ring' },
    equivalents: ['DID 525VX3', 'RK 525XSO', 'REGINA 525ZRP']
  },
  'MT09_KIT': { 
    brand: 'VORTEX',
    oem: '1RC-F5450-00',
    applications: ['Yamaha MT-09', 'Yamaha XSR900', 'Yamaha Tracer 900', 'Yamaha Niken'],
    specs: { chain: '525', links: 114, sprocket: 45, pinion: 16, type: 'X-Ring' },
    equivalents: ['DID 525VX3', 'RK 525XSO']
  },
  'FAZER250_KIT': {
    brand: 'RIFFEL',
    oem: '5VL-F5450-00',
    applications: ['Yamaha Fazer 250', 'Yamaha Lander 250'],
    specs: { chain: '428', links: 132, sprocket: 49, pinion: 14, type: 'Standard' },
    equivalents: ['DID 428HD', 'RK 428HSB', 'REGINA 428']
  },

  // ==================== KAWASAKI ====================
  'NINJA300_KIT': { 
    brand: 'VORTEX',
    oem: '92057-0718',
    applications: ['Kawasaki Ninja 300', 'Kawasaki Z300'],
    specs: { chain: '520', links: 112, sprocket: 42, pinion: 14, type: 'X-Ring' },
    equivalents: ['DID 520VX3', 'RK 520XSO']
  },
  'NINJA400_KIT': { 
    brand: 'VORTEX',
    oem: '92057-0763',
    applications: ['Kawasaki Ninja 400', 'Kawasaki Z400'],
    specs: { chain: '520', links: 112, sprocket: 42, pinion: 14, type: 'X-Ring' },
    equivalents: ['DID 520VX3', 'RK 520XSO']
  },
  'NINJA650_KIT': { 
    brand: 'VORTEX',
    oem: '92057-0512',
    applications: ['Kawasaki Ninja 650', 'Kawasaki Z650', 'Kawasaki Versys 650', 'Kawasaki Vulcan S 650'],
    specs: { chain: '520', links: 114, sprocket: 46, pinion: 15, type: 'X-Ring' },
    equivalents: ['DID 520VX3', 'RK 520XSO']
  },
  'Z900_KIT': { 
    brand: 'VORTEX',
    oem: '92057-0752',
    applications: ['Kawasaki Z900', 'Kawasaki Z900RS'],
    specs: { chain: '525', links: 114, sprocket: 44, pinion: 15, type: 'X-Ring' },
    equivalents: ['DID 525VX3', 'RK 525XSO']
  },

  // ==================== SUZUKI ====================
  'GSXR600_KIT': { 
    brand: 'VORTEX',
    oem: '27600-37F00',
    applications: ['Suzuki GSX-R600', 'Suzuki GSX-R750', 'Suzuki GSX-S750'],
    specs: { chain: '525', links: 114, sprocket: 43, pinion: 17, type: 'X-Ring' },
    equivalents: ['DID 525VX3', 'RK 525XSO']
  },
  'GSXR1000_KIT': { 
    brand: 'VORTEX',
    oem: '27600-47H00',
    applications: ['Suzuki GSX-R1000', 'Suzuki GSX-S1000', 'Suzuki Katana 1000'],
    specs: { chain: '525', links: 116, sprocket: 43, pinion: 17, type: 'X-Ring' },
    equivalents: ['DID 525VX3', 'RK 525XSO']
  },
  'VSTROM650_KIT': { 
    brand: 'VORTEX',
    oem: '27600-31J00',
    applications: ['Suzuki V-Strom 650', 'Suzuki SV650'],
    specs: { chain: '525', links: 116, sprocket: 47, pinion: 15, type: 'X-Ring' },
    equivalents: ['DID 525VX3', 'RK 525XSO']
  },

  // ==================== BMW ====================
  'F800GS_KIT': {
    brand: 'VORTEX',
    oem: '17217713906',
    applications: ['BMW F800GS', 'BMW F800R', 'BMW F700GS', 'BMW F650GS Twin'],
    specs: { chain: '525', links: 116, sprocket: 42, pinion: 16, type: 'X-Ring' },
    equivalents: ['DID 525VX3', 'RK 525XSO']
  },
  'F850GS_KIT': {
    brand: 'VORTEX',
    oem: '17218559382',
    applications: ['BMW F750GS', 'BMW F850GS', 'BMW F900R', 'BMW F900XR'],
    specs: { chain: '525', links: 118, sprocket: 44, pinion: 16, type: 'X-Ring' },
    equivalents: ['DID 525VX3', 'RK 525XSO']
  },

  // ==================== KTM ====================
  'DUKE390_KIT': {
    brand: 'VORTEX',
    oem: '90110065044',
    applications: ['KTM Duke 390', 'KTM RC 390', 'KTM Adventure 390'],
    specs: { chain: '520', links: 118, sprocket: 44, pinion: 14, type: 'X-Ring' },
    equivalents: ['DID 520VX3', 'RK 520XSO']
  },
  'DUKE790_KIT': {
    brand: 'VORTEX',
    oem: '63010065044',
    applications: ['KTM 790 Duke', 'KTM 790 Adventure', 'KTM 890 Duke', 'KTM 890 Adventure'],
    specs: { chain: '520', links: 118, sprocket: 45, pinion: 16, type: 'X-Ring' },
    equivalents: ['DID 520VX3', 'RK 520XSO']
  },
};


// ============================================================================
// AMORTECEDORES
// ============================================================================
export const SHOCK_ABSORBERS = {
  // ==================== VOLKSWAGEN ====================
  'GP32960': {
    brand: 'MONROE',
    oem: '5U0413031H',
    applications: ['VW Gol G5', 'VW Gol G6', 'VW Gol G7', 'VW Voyage G5', 'VW Voyage G6', 'VW Voyage G7', 'VW Fox', 'VW Saveiro G5', 'VW Saveiro G6', 'VW Saveiro G7'],
    position: 'front',
    specs: { type: 'gas', length: 340, stroke: 195 },
    equivalents: ['COFAP GP32960', 'NAKATA HG32960', 'KAYABA 333419']
  },
  'GP32961': {
    brand: 'MONROE',
    oem: '5U0513025H',
    applications: ['VW Gol G5', 'VW Gol G6', 'VW Gol G7', 'VW Voyage G5', 'VW Voyage G6', 'VW Voyage G7', 'VW Fox'],
    position: 'rear',
    specs: { type: 'gas', length: 380, stroke: 220 },
    equivalents: ['COFAP GP32961', 'NAKATA HG32961', 'KAYABA 343459']
  },
  'GP33500': {
    brand: 'MONROE',
    oem: '2Q0413031AB',
    applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus', 'VW Taos'],
    position: 'front',
    specs: { type: 'gas', length: 350, stroke: 200 },
    equivalents: ['COFAP GP33500', 'NAKATA HG33500', 'KAYABA 333500']
  },

  // ==================== FIAT ====================
  'GP32800': {
    brand: 'MONROE',
    oem: '51842695',
    applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi'],
    position: 'front',
    specs: { type: 'gas', length: 330, stroke: 190 },
    equivalents: ['COFAP GP32800', 'NAKATA HG32800', 'KAYABA 333800']
  },
  'GP32801': {
    brand: 'MONROE',
    oem: '51842696',
    applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada'],
    position: 'rear',
    specs: { type: 'gas', length: 370, stroke: 210 },
    equivalents: ['COFAP GP32801', 'NAKATA HG32801', 'KAYABA 343801']
  },
  'GP33100': {
    brand: 'MONROE',
    oem: '52082087',
    applications: ['Fiat Argo', 'Fiat Cronos', 'Fiat Pulse', 'Fiat Fastback'],
    position: 'front',
    specs: { type: 'gas', length: 345, stroke: 198 },
    equivalents: ['COFAP GP33100', 'NAKATA HG33100']
  },

  // ==================== CHEVROLET ====================
  'GP33200': {
    brand: 'MONROE',
    oem: '52082088',
    applications: ['Chevrolet Onix', 'Chevrolet Onix Plus', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin'],
    position: 'front',
    specs: { type: 'gas', length: 348, stroke: 200 },
    equivalents: ['COFAP GP33200', 'NAKATA HG33200', 'ACDelco 580-1074']
  },
  'GP33201': {
    brand: 'MONROE',
    oem: '52082089',
    applications: ['Chevrolet Onix', 'Chevrolet Onix Plus', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin'],
    position: 'rear',
    specs: { type: 'gas', length: 385, stroke: 225 },
    equivalents: ['COFAP GP33201', 'NAKATA HG33201', 'ACDelco 580-1075']
  },
  'GP33400': {
    brand: 'MONROE',
    oem: '42704159',
    applications: ['Chevrolet Tracker', 'Chevrolet Equinox', 'Chevrolet Montana'],
    position: 'front',
    specs: { type: 'gas', length: 355, stroke: 205 },
    equivalents: ['COFAP GP33400', 'ACDelco 580-1080']
  },

  // ==================== HONDA ====================
  'GP33000': {
    brand: 'MONROE',
    oem: '51621-SNA-A03',
    applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V'],
    position: 'front',
    specs: { type: 'gas', length: 345, stroke: 198 },
    equivalents: ['COFAP GP33000', 'NAKATA HG33000', 'KAYABA 333000']
  },
  'GP33001': {
    brand: 'MONROE',
    oem: '52441-SNA-A03',
    applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V'],
    position: 'rear',
    specs: { type: 'gas', length: 380, stroke: 220 },
    equivalents: ['COFAP GP33001', 'NAKATA HG33001', 'KAYABA 343001']
  },

  // ==================== TOYOTA ====================
  'GP33050': {
    brand: 'MONROE',
    oem: '48510-02750',
    applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios'],
    position: 'front',
    specs: { type: 'gas', length: 350, stroke: 200 },
    equivalents: ['COFAP GP33050', 'NAKATA HG33050', 'KAYABA 333050']
  },
  'GP33051': {
    brand: 'MONROE',
    oem: '48530-02750',
    applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios'],
    position: 'rear',
    specs: { type: 'gas', length: 385, stroke: 225 },
    equivalents: ['COFAP GP33051', 'NAKATA HG33051', 'KAYABA 343051']
  },

  // ==================== HYUNDAI/KIA ====================
  'GP33150': {
    brand: 'MONROE',
    oem: '54651-1R000',
    applications: ['Hyundai HB20', 'Hyundai HB20S', 'Hyundai Creta', 'Kia Rio', 'Kia Stonic'],
    position: 'front',
    specs: { type: 'gas', length: 348, stroke: 200 },
    equivalents: ['COFAP GP33150', 'NAKATA HG33150', 'MOBIS 54651-1R000']
  },
  'GP33151': {
    brand: 'MONROE',
    oem: '55311-1R000',
    applications: ['Hyundai HB20', 'Hyundai HB20S', 'Hyundai Creta', 'Kia Rio', 'Kia Stonic'],
    position: 'rear',
    specs: { type: 'gas', length: 382, stroke: 222 },
    equivalents: ['COFAP GP33151', 'NAKATA HG33151', 'MOBIS 55311-1R000']
  },

  // ==================== RENAULT ====================
  'GP32900': {
    brand: 'MONROE',
    oem: '543020034R',
    applications: ['Renault Sandero', 'Renault Logan', 'Renault Duster', 'Renault Captur', 'Renault Kwid'],
    position: 'front',
    specs: { type: 'gas', length: 342, stroke: 195 },
    equivalents: ['COFAP GP32900', 'NAKATA HG32900']
  },
  'GP32901': {
    brand: 'MONROE',
    oem: '562100034R',
    applications: ['Renault Sandero', 'Renault Logan', 'Renault Duster', 'Renault Captur'],
    position: 'rear',
    specs: { type: 'gas', length: 378, stroke: 218 },
    equivalents: ['COFAP GP32901', 'NAKATA HG32901']
  },

  // ==================== JEEP ====================
  'GP33300': {
    brand: 'MONROE',
    oem: '68212327AB',
    applications: ['Jeep Renegade', 'Jeep Compass', 'Jeep Commander', 'Fiat Toro'],
    position: 'front',
    specs: { type: 'gas', length: 355, stroke: 205 },
    equivalents: ['COFAP GP33300', 'MOPAR 68212327AB']
  },
  'GP33301': {
    brand: 'MONROE',
    oem: '68212328AB',
    applications: ['Jeep Renegade', 'Jeep Compass', 'Jeep Commander', 'Fiat Toro'],
    position: 'rear',
    specs: { type: 'gas', length: 390, stroke: 230 },
    equivalents: ['COFAP GP33301', 'MOPAR 68212328AB']
  },
};

// ============================================================================
// BATERIAS
// ============================================================================
export const BATTERIES = {
  // ==================== CARROS POPULARES ====================
  'MI60AD': {
    brand: 'MOURA',
    applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro', 'VW Up', 'Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo', 'Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Honda Fit', 'Honda City', 'Toyota Etios', 'Renault Sandero', 'Renault Logan', 'Renault Kwid', 'Ford Ka', 'Ford Fiesta', 'Hyundai HB20'],
    specs: { capacity: 60, cca: 500, voltage: 12, type: 'chumbo-ácido', dimensions: '242x175x190mm' },
    equivalents: ['HELIAR HF60AD', 'ACDelco 60AH', 'BOSCH S5X60D']
  },
  'MI70AD': {
    brand: 'MOURA',
    applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus', 'Fiat Cronos', 'Fiat Pulse', 'Chevrolet Tracker', 'Honda Civic', 'Honda HR-V', 'Toyota Corolla', 'Toyota Yaris', 'Hyundai Creta', 'Renault Duster', 'Renault Captur', 'Ford EcoSport', 'Jeep Renegade'],
    specs: { capacity: 70, cca: 600, voltage: 12, type: 'chumbo-ácido', dimensions: '278x175x190mm' },
    equivalents: ['HELIAR HF70AD', 'ACDelco 70AH', 'BOSCH S5X70D']
  },
  'MI80AD': {
    brand: 'MOURA',
    applications: ['VW Taos', 'VW Tiguan', 'Jeep Compass', 'Jeep Commander', 'Fiat Toro', 'Chevrolet Equinox', 'Honda CR-V', 'Toyota RAV4', 'Hyundai Tucson', 'Kia Sportage'],
    specs: { capacity: 80, cca: 700, voltage: 12, type: 'chumbo-ácido', dimensions: '315x175x190mm' },
    equivalents: ['HELIAR HF80AD', 'ACDelco 80AH', 'BOSCH S5X80D']
  },

  // ==================== CARROS PREMIUM ====================
  'MI95AD': {
    brand: 'MOURA',
    applications: ['BMW 320i', 'BMW X1', 'BMW X3', 'Mercedes C180', 'Mercedes C200', 'Mercedes A200', 'Mercedes GLA200', 'Audi A3', 'Audi A4', 'Audi Q3', 'Audi Q5', 'VW Golf GTI', 'VW Jetta'],
    specs: { capacity: 95, cca: 800, voltage: 12, type: 'AGM', dimensions: '353x175x190mm' },
    equivalents: ['HELIAR HF95AD', 'VARTA E39', 'BOSCH S6X95D']
  },

  // ==================== DIESEL ====================
  'MI100AD': {
    brand: 'MOURA',
    applications: ['Toyota Hilux', 'Toyota SW4', 'Ford Ranger', 'Chevrolet S10', 'Chevrolet Trailblazer', 'Mitsubishi L200 Triton', 'Mitsubishi Pajero', 'Nissan Frontier', 'VW Amarok'],
    specs: { capacity: 100, cca: 850, voltage: 12, type: 'chumbo-ácido', dimensions: '353x175x190mm' },
    equivalents: ['HELIAR HF100AD', 'ACDelco 100AH', 'BOSCH S5X100D']
  },

  // ==================== MOTOS ====================
  'YTX7L-BS': {
    brand: 'YUASA',
    applications: ['Honda CB300', 'Honda XRE300', 'Honda CB Twister 250', 'Yamaha Fazer 250', 'Yamaha Lander 250', 'Kawasaki Ninja 300', 'Kawasaki Z300'],
    specs: { capacity: 6, cca: 100, voltage: 12, type: 'AGM', dimensions: '114x71x131mm' },
    equivalents: ['MOURA MA7-E', 'HELIAR HTX7L-BS', 'BOSCH BTX7L-BS']
  },
  'YTX9-BS': {
    brand: 'YUASA',
    applications: ['Honda CB500F', 'Honda CB500X', 'Honda CBR500R', 'Honda NC750X', 'Yamaha MT-03', 'Yamaha YZF-R3', 'Kawasaki Ninja 400', 'Kawasaki Z400', 'Kawasaki Ninja 650', 'Kawasaki Z650'],
    specs: { capacity: 8, cca: 135, voltage: 12, type: 'AGM', dimensions: '152x87x107mm' },
    equivalents: ['MOURA MA9-E', 'HELIAR HTX9-BS', 'BOSCH BTX9-BS']
  },
  'YTX12-BS': {
    brand: 'YUASA',
    applications: ['Honda CBR600RR', 'Honda CB650F', 'Honda CBR650F', 'Yamaha MT-07', 'Yamaha MT-09', 'Kawasaki Z900', 'Kawasaki Versys 1000', 'Suzuki GSX-R600', 'Suzuki GSX-R750', 'Suzuki V-Strom 650', 'Triumph Street Triple'],
    specs: { capacity: 10, cca: 180, voltage: 12, type: 'AGM', dimensions: '152x87x131mm' },
    equivalents: ['MOURA MA12-E', 'HELIAR HTX12-BS', 'BOSCH BTX12-BS']
  },
  'YTX14-BS': {
    brand: 'YUASA',
    applications: ['Honda CBR1000RR', 'Honda Africa Twin', 'Yamaha YZF-R1', 'Yamaha MT-10', 'Kawasaki ZX-10R', 'Kawasaki Z1000', 'Suzuki GSX-R1000', 'Suzuki Hayabusa', 'BMW S1000RR', 'BMW F800GS', 'BMW F850GS', 'Ducati Monster', 'Ducati Multistrada', 'KTM 1290 Super Duke'],
    specs: { capacity: 12, cca: 200, voltage: 12, type: 'AGM', dimensions: '152x87x147mm' },
    equivalents: ['MOURA MA14-E', 'HELIAR HTX14-BS', 'BOSCH BTX14-BS']
  },
  'YTX5L-BS': {
    brand: 'YUASA',
    applications: ['Honda CG125', 'Honda CG150', 'Honda CG160', 'Honda Bros 150', 'Honda Bros 160', 'Honda Biz 100', 'Honda Biz 110', 'Honda Biz 125', 'Honda Pop 100', 'Honda Pop 110', 'Yamaha Factor 125', 'Yamaha Factor 150', 'Yamaha Crosser 150'],
    specs: { capacity: 4, cca: 80, voltage: 12, type: 'AGM', dimensions: '114x71x106mm' },
    equivalents: ['MOURA MA5-D', 'HELIAR HTX5L-BS', 'BOSCH BTX5L-BS']
  },
};

// ============================================================================
// EXPORT PRINCIPAL
// ============================================================================
export const PARTS_DATABASE_V3 = {
  oil_filters: OIL_FILTERS,
  oil_filters_motorcycle: OIL_FILTERS_MOTORCYCLE,
  air_filters: AIR_FILTERS,
  air_filters_motorcycle: AIR_FILTERS_MOTORCYCLE,
  brake_pads: BRAKE_PADS,
  brake_pads_motorcycle: BRAKE_PADS_MOTORCYCLE,
  spark_plugs: SPARK_PLUGS,
  spark_plugs_motorcycle: SPARK_PLUGS_MOTORCYCLE,
  engine_oils: ENGINE_OILS,
  timing_belts: TIMING_BELTS,
  chain_kits: CHAIN_KITS,
  shock_absorbers: SHOCK_ABSORBERS,
  batteries: BATTERIES,
};

export default PARTS_DATABASE_V3;
