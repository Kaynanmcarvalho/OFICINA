/**
 * Sugestões inteligentes para produtos automotivos
 * NCM, CEST, CFOP e compatibilidade com veículos
 */

// Base de dados de NCM por categoria/produto
export const ncmDatabase = {
  // Filtros
  'filtro': {
    ncm: '84212300',
    cest: '0100100',
    cfop: '5102',
    csosn: '102',
    keywords: ['filtro', 'filter']
  },
  'filtro de óleo': {
    ncm: '84212300',
    cest: '0100100',
    cfop: '5102',
    csosn: '102'
  },
  'filtro de ar': {
    ncm: '84213100',
    cest: '0100200',
    cfop: '5102',
    csosn: '102'
  },
  'filtro de combustível': {
    ncm: '84212300',
    cest: '0100300',
    cfop: '5102',
    csosn: '102'
  },
  
  // Óleos
  'óleo': {
    ncm: '27101990',
    cest: '0600100',
    cfop: '5405',
    csosn: '500',
    keywords: ['oleo', 'óleo', 'oil', 'lubrificante']
  },
  'óleo motor': {
    ncm: '27101990',
    cest: '0600100',
    cfop: '5405',
    csosn: '500'
  },
  'óleo 5w30': {
    ncm: '27101990',
    cest: '0600100',
    cfop: '5405',
    csosn: '500'
  },
  'óleo 10w40': {
    ncm: '27101990',
    cest: '0600100',
    cfop: '5405',
    csosn: '500'
  },
  
  // Pneus
  'pneu': {
    ncm: '40111000',
    cest: '1000100',
    cfop: '5102',
    csosn: '102',
    keywords: ['pneu', 'tire']
  },
  
  // Pastilhas e Discos
  'pastilha': {
    ncm: '87083010',
    cest: '0200100',
    cfop: '5102',
    csosn: '102',
    keywords: ['pastilha', 'freio']
  },
  'disco de freio': {
    ncm: '87083020',
    cest: '0200200',
    cfop: '5102',
    csosn: '102'
  },
  
  // Velas
  'vela': {
    ncm: '85111000',
    cest: '0300100',
    cfop: '5102',
    csosn: '102',
    keywords: ['vela', 'ignição']
  },
  
  // Baterias
  'bateria': {
    ncm: '85071000',
    cest: '0400100',
    cfop: '5102',
    csosn: '102',
    keywords: ['bateria', 'battery']
  },
  
  // Lâmpadas
  'lâmpada': {
    ncm: '85392110',
    cest: '0500100',
    cfop: '5102',
    csosn: '102',
    keywords: ['lampada', 'lâmpada', 'lamp']
  },
  
  // Correias
  'correia': {
    ncm: '40103900',
    cest: '0700100',
    cfop: '5102',
    csosn: '102',
    keywords: ['correia', 'belt']
  },
  
  // Amortecedores
  'amortecedor': {
    ncm: '87088010',
    cest: '0800100',
    cfop: '5102',
    csosn: '102',
    keywords: ['amortecedor', 'shock']
  },
};

// Base de compatibilidade por tipo de produto
export const compatibilityDatabase = {
  // Óleos 5W30 - Veículos modernos (2013+)
  '5w30': {
    vehicles: [
      // Volkswagen
      { marca: 'Volkswagen', modelo: 'Gol', ano_inicial: '2013', ano_final: '2024', motorizacao: '1.0 / 1.6' },
      { marca: 'Volkswagen', modelo: 'Polo', ano_inicial: '2018', ano_final: '2024', motorizacao: '1.0 TSI' },
      { marca: 'Volkswagen', modelo: 'Virtus', ano_inicial: '2018', ano_final: '2024', motorizacao: '1.0 TSI / 1.6' },
      { marca: 'Volkswagen', modelo: 'T-Cross', ano_inicial: '2019', ano_final: '2024', motorizacao: '1.0 TSI' },
      { marca: 'Volkswagen', modelo: 'Nivus', ano_inicial: '2020', ano_final: '2024', motorizacao: '1.0 TSI' },
      { marca: 'Volkswagen', modelo: 'Taos', ano_inicial: '2021', ano_final: '2024', motorizacao: '1.4 TSI' },
      { marca: 'Volkswagen', modelo: 'Jetta', ano_inicial: '2015', ano_final: '2024', motorizacao: '1.4 TSI / 2.0 TSI' },
      { marca: 'Volkswagen', modelo: 'Tiguan', ano_inicial: '2017', ano_final: '2024', motorizacao: '1.4 TSI / 2.0 TSI' },
      { marca: 'Volkswagen', modelo: 'Amarok', ano_inicial: '2017', ano_final: '2024', motorizacao: '2.0 TDI' },
      
      // Fiat
      { marca: 'Fiat', modelo: 'Argo', ano_inicial: '2018', ano_final: '2024', motorizacao: '1.0 / 1.3' },
      { marca: 'Fiat', modelo: 'Cronos', ano_inicial: '2018', ano_final: '2024', motorizacao: '1.0 / 1.3 / 1.8' },
      { marca: 'Fiat', modelo: 'Mobi', ano_inicial: '2017', ano_final: '2024', motorizacao: '1.0' },
      { marca: 'Fiat', modelo: 'Pulse', ano_inicial: '2022', ano_final: '2024', motorizacao: '1.0 Turbo / 1.3' },
      { marca: 'Fiat', modelo: 'Fastback', ano_inicial: '2023', ano_final: '2024', motorizacao: '1.0 Turbo / 1.3' },
      { marca: 'Fiat', modelo: 'Toro', ano_inicial: '2017', ano_final: '2024', motorizacao: '1.8 / 2.0 Diesel' },
      { marca: 'Fiat', modelo: 'Strada', ano_inicial: '2021', ano_final: '2024', motorizacao: '1.3 / 1.4' },
      { marca: 'Fiat', modelo: 'Fiorino', ano_inicial: '2013', ano_final: '2024', motorizacao: '1.4' },
      
      // Chevrolet
      { marca: 'Chevrolet', modelo: 'Onix', ano_inicial: '2013', ano_final: '2024', motorizacao: '1.0 / 1.0 Turbo' },
      { marca: 'Chevrolet', modelo: 'Onix Plus', ano_inicial: '2020', ano_final: '2024', motorizacao: '1.0 / 1.0 Turbo' },
      { marca: 'Chevrolet', modelo: 'Tracker', ano_inicial: '2020', ano_final: '2024', motorizacao: '1.0 Turbo / 1.2 Turbo' },
      { marca: 'Chevrolet', modelo: 'Spin', ano_inicial: '2013', ano_final: '2022', motorizacao: '1.8' },
      { marca: 'Chevrolet', modelo: 'Cruze', ano_inicial: '2017', ano_final: '2022', motorizacao: '1.4 Turbo' },
      { marca: 'Chevrolet', modelo: 'Equinox', ano_inicial: '2018', ano_final: '2024', motorizacao: '1.5 Turbo / 2.0 Turbo' },
      { marca: 'Chevrolet', modelo: 'S10', ano_inicial: '2013', ano_final: '2024', motorizacao: '2.5 / 2.8 Diesel' },
      { marca: 'Chevrolet', modelo: 'Trailblazer', ano_inicial: '2013', ano_final: '2021', motorizacao: '2.8 Diesel' },
      { marca: 'Chevrolet', modelo: 'Montana', ano_inicial: '2023', ano_final: '2024', motorizacao: '1.2 Turbo' },
      
      // Hyundai
      { marca: 'Hyundai', modelo: 'HB20', ano_inicial: '2013', ano_final: '2024', motorizacao: '1.0 / 1.0 Turbo' },
      { marca: 'Hyundai', modelo: 'HB20S', ano_inicial: '2013', ano_final: '2024', motorizacao: '1.0 / 1.6' },
      { marca: 'Hyundai', modelo: 'Creta', ano_inicial: '2017', ano_final: '2024', motorizacao: '1.6 / 2.0' },
      { marca: 'Hyundai', modelo: 'Tucson', ano_inicial: '2016', ano_final: '2024', motorizacao: '1.6 Turbo / 2.0' },
      { marca: 'Hyundai', modelo: 'ix35', ano_inicial: '2013', ano_final: '2022', motorizacao: '2.0' },
      { marca: 'Hyundai', modelo: 'Santa Fe', ano_inicial: '2013', ano_final: '2024', motorizacao: '2.4 / 3.3 V6' },
      { marca: 'Hyundai', modelo: 'Elantra', ano_inicial: '2017', ano_final: '2024', motorizacao: '2.0' },
      { marca: 'Hyundai', modelo: 'Azera', ano_inicial: '2013', ano_final: '2018', motorizacao: '3.0 V6' },
      
      // Toyota
      { marca: 'Toyota', modelo: 'Corolla', ano_inicial: '2015', ano_final: '2024', motorizacao: '1.8 / 2.0' },
      { marca: 'Toyota', modelo: 'Yaris', ano_inicial: '2018', ano_final: '2024', motorizacao: '1.3 / 1.5' },
      { marca: 'Toyota', modelo: 'Etios', ano_inicial: '2013', ano_final: '2021', motorizacao: '1.3 / 1.5' },
      { marca: 'Toyota', modelo: 'Hilux', ano_inicial: '2016', ano_final: '2024', motorizacao: '2.8 Diesel' },
      { marca: 'Toyota', modelo: 'SW4', ano_inicial: '2016', ano_final: '2024', motorizacao: '2.8 Diesel' },
      { marca: 'Toyota', modelo: 'RAV4', ano_inicial: '2013', ano_final: '2024', motorizacao: '2.0 / 2.5 Hybrid' },
      { marca: 'Toyota', modelo: 'Camry', ano_inicial: '2015', ano_final: '2024', motorizacao: '2.5 / 3.5 V6' },
      { marca: 'Toyota', modelo: 'Prius', ano_inicial: '2016', ano_final: '2024', motorizacao: '1.8 Hybrid' },
      
      // Honda
      { marca: 'Honda', modelo: 'Civic', ano_inicial: '2017', ano_final: '2024', motorizacao: '1.5 Turbo / 2.0' },
      { marca: 'Honda', modelo: 'City', ano_inicial: '2015', ano_final: '2024', motorizacao: '1.5' },
      { marca: 'Honda', modelo: 'HR-V', ano_inicial: '2015', ano_final: '2024', motorizacao: '1.5 / 1.8' },
      { marca: 'Honda', modelo: 'WR-V', ano_inicial: '2017', ano_final: '2024', motorizacao: '1.5' },
      { marca: 'Honda', modelo: 'CR-V', ano_inicial: '2017', ano_final: '2024', motorizacao: '1.5 Turbo / 2.0' },
      { marca: 'Honda', modelo: 'Fit', ano_inicial: '2015', ano_final: '2020', motorizacao: '1.5' },
      { marca: 'Honda', modelo: 'Accord', ano_inicial: '2013', ano_final: '2018', motorizacao: '2.0 / 2.4' },
      
      // Nissan
      { marca: 'Nissan', modelo: 'Kicks', ano_inicial: '2017', ano_final: '2024', motorizacao: '1.6' },
      { marca: 'Nissan', modelo: 'Versa', ano_inicial: '2015', ano_final: '2024', motorizacao: '1.6' },
      { marca: 'Nissan', modelo: 'March', ano_inicial: '2013', ano_final: '2022', motorizacao: '1.0 / 1.6' },
      { marca: 'Nissan', modelo: 'Sentra', ano_inicial: '2014', ano_final: '2024', motorizacao: '2.0' },
      { marca: 'Nissan', modelo: 'Frontier', ano_inicial: '2017', ano_final: '2024', motorizacao: '2.3 Diesel' },
      { marca: 'Nissan', modelo: 'X-Trail', ano_inicial: '2015', ano_final: '2018', motorizacao: '2.5' },
      
      // Renault
      { marca: 'Renault', modelo: 'Kwid', ano_inicial: '2017', ano_final: '2024', motorizacao: '1.0' },
      { marca: 'Renault', modelo: 'Sandero', ano_inicial: '2015', ano_final: '2024', motorizacao: '1.0 / 1.6' },
      { marca: 'Renault', modelo: 'Logan', ano_inicial: '2014', ano_final: '2024', motorizacao: '1.0 / 1.6' },
      { marca: 'Renault', modelo: 'Duster', ano_inicial: '2015', ano_final: '2024', motorizacao: '1.6 / 2.0' },
      { marca: 'Renault', modelo: 'Captur', ano_inicial: '2017', ano_final: '2024', motorizacao: '1.6 / 2.0' },
      { marca: 'Renault', modelo: 'Oroch', ano_inicial: '2016', ano_final: '2024', motorizacao: '1.6 / 2.0' },
      { marca: 'Renault', modelo: 'Fluence', ano_inicial: '2013', ano_final: '2017', motorizacao: '2.0' },
      
      // Jeep
      { marca: 'Jeep', modelo: 'Renegade', ano_inicial: '2016', ano_final: '2024', motorizacao: '1.8 / 2.0 Diesel' },
      { marca: 'Jeep', modelo: 'Compass', ano_inicial: '2017', ano_final: '2024', motorizacao: '1.3 Turbo / 2.0 Diesel' },
      { marca: 'Jeep', modelo: 'Commander', ano_inicial: '2022', ano_final: '2024', motorizacao: '1.3 Turbo / 2.0 Diesel' },
      { marca: 'Jeep', modelo: 'Wrangler', ano_inicial: '2019', ano_final: '2024', motorizacao: '2.0 Turbo' },
      { marca: 'Jeep', modelo: 'Grand Cherokee', ano_inicial: '2014', ano_final: '2024', motorizacao: '3.6 V6' },
      
      // Peugeot
      { marca: 'Peugeot', modelo: '208', ano_inicial: '2013', ano_final: '2024', motorizacao: '1.2 / 1.6' },
      { marca: 'Peugeot', modelo: '2008', ano_inicial: '2015', ano_final: '2024', motorizacao: '1.6' },
      { marca: 'Peugeot', modelo: '3008', ano_inicial: '2018', ano_final: '2024', motorizacao: '1.6 Turbo' },
      { marca: 'Peugeot', modelo: '5008', ano_inicial: '2018', ano_final: '2024', motorizacao: '1.6 Turbo' },
      
      // Citroën
      { marca: 'Citroën', modelo: 'C3', ano_inicial: '2013', ano_final: '2024', motorizacao: '1.2 / 1.6' },
      { marca: 'Citroën', modelo: 'C4 Cactus', ano_inicial: '2019', ano_final: '2024', motorizacao: '1.6' },
      { marca: 'Citroën', modelo: 'Aircross', ano_inicial: '2016', ano_final: '2024', motorizacao: '1.6' },
      
      // Ford
      { marca: 'Ford', modelo: 'Ka', ano_inicial: '2015', ano_final: '2021', motorizacao: '1.0 / 1.5' },
      { marca: 'Ford', modelo: 'EcoSport', ano_inicial: '2013', ano_final: '2022', motorizacao: '1.5 / 2.0' },
      { marca: 'Ford', modelo: 'Ranger', ano_inicial: '2013', ano_final: '2024', motorizacao: '2.2 / 3.2 Diesel' },
      { marca: 'Ford', modelo: 'Territory', ano_inicial: '2021', ano_final: '2024', motorizacao: '1.5 Turbo' },
      
      // Mitsubishi
      { marca: 'Mitsubishi', modelo: 'L200', ano_inicial: '2013', ano_final: '2024', motorizacao: '2.4 Diesel' },
      { marca: 'Mitsubishi', modelo: 'Outlander', ano_inicial: '2016', ano_final: '2024', motorizacao: '2.0 / 2.4' },
      { marca: 'Mitsubishi', modelo: 'ASX', ano_inicial: '2013', ano_final: '2020', motorizacao: '2.0' },
      { marca: 'Mitsubishi', modelo: 'Eclipse Cross', ano_inicial: '2019', ano_final: '2024', motorizacao: '1.5 Turbo' },
      
      // Caoa Chery
      { marca: 'Caoa Chery', modelo: 'Tiggo 5X', ano_inicial: '2019', ano_final: '2024', motorizacao: '1.5 Turbo' },
      { marca: 'Caoa Chery', modelo: 'Tiggo 7', ano_inicial: '2020', ano_final: '2024', motorizacao: '1.5 Turbo' },
      { marca: 'Caoa Chery', modelo: 'Tiggo 8', ano_inicial: '2020', ano_final: '2024', motorizacao: '1.6 Turbo' },
      
      // BYD
      { marca: 'BYD', modelo: 'Song Plus', ano_inicial: '2022', ano_final: '2024', motorizacao: 'Híbrido' },
      { marca: 'BYD', modelo: 'Yuan Plus', ano_inicial: '2023', ano_final: '2024', motorizacao: 'Elétrico' },
      { marca: 'BYD', modelo: 'Dolphin', ano_inicial: '2023', ano_final: '2024', motorizacao: 'Elétrico' },
    ]
  },
  
  // Óleos 10W40 - Veículos mais antigos (2000-2015)
  '10w40': {
    vehicles: [
      // Volkswagen
      { marca: 'Volkswagen', modelo: 'Gol', ano_inicial: '2000', ano_final: '2012', motorizacao: '1.0 / 1.6 / 1.8' },
      { marca: 'Volkswagen', modelo: 'Fox', ano_inicial: '2004', ano_final: '2015', motorizacao: '1.0 / 1.6' },
      { marca: 'Volkswagen', modelo: 'Polo', ano_inicial: '2003', ano_final: '2017', motorizacao: '1.6' },
      { marca: 'Volkswagen', modelo: 'Golf', ano_inicial: '2000', ano_final: '2013', motorizacao: '1.6 / 2.0' },
      { marca: 'Volkswagen', modelo: 'Voyage', ano_inicial: '2009', ano_final: '2015', motorizacao: '1.0 / 1.6' },
      { marca: 'Volkswagen', modelo: 'Saveiro', ano_inicial: '2000', ano_final: '2015', motorizacao: '1.6 / 1.8' },
      { marca: 'Volkswagen', modelo: 'Parati', ano_inicial: '2000', ano_final: '2013', motorizacao: '1.6 / 1.8' },
      { marca: 'Volkswagen', modelo: 'Santana', ano_inicial: '2000', ano_final: '2006', motorizacao: '2.0' },
      
      // Fiat
      { marca: 'Fiat', modelo: 'Palio', ano_inicial: '2000', ano_final: '2017', motorizacao: '1.0 / 1.4 / 1.6' },
      { marca: 'Fiat', modelo: 'Uno', ano_inicial: '2000', ano_final: '2020', motorizacao: '1.0 / 1.4' },
      { marca: 'Fiat', modelo: 'Siena', ano_inicial: '2000', ano_final: '2017', motorizacao: '1.0 / 1.4 / 1.6' },
      { marca: 'Fiat', modelo: 'Strada', ano_inicial: '2000', ano_final: '2020', motorizacao: '1.4 / 1.6' },
      { marca: 'Fiat', modelo: 'Punto', ano_inicial: '2008', ano_final: '2017', motorizacao: '1.4 / 1.6 / 1.8' },
      { marca: 'Fiat', modelo: 'Linea', ano_inicial: '2009', ano_final: '2015', motorizacao: '1.8 / 1.9' },
      { marca: 'Fiat', modelo: 'Bravo', ano_inicial: '2011', ano_final: '2016', motorizacao: '1.8' },
      { marca: 'Fiat', modelo: 'Idea', ano_inicial: '2006', ano_final: '2016', motorizacao: '1.4 / 1.6 / 1.8' },
      { marca: 'Fiat', modelo: 'Doblo', ano_inicial: '2002', ano_final: '2022', motorizacao: '1.4 / 1.8' },
      
      // Chevrolet
      { marca: 'Chevrolet', modelo: 'Celta', ano_inicial: '2000', ano_final: '2015', motorizacao: '1.0 / 1.4' },
      { marca: 'Chevrolet', modelo: 'Classic', ano_inicial: '2003', ano_final: '2016', motorizacao: '1.0 / 1.4' },
      { marca: 'Chevrolet', modelo: 'Corsa', ano_inicial: '2000', ano_final: '2012', motorizacao: '1.0 / 1.4 / 1.8' },
      { marca: 'Chevrolet', modelo: 'Prisma', ano_inicial: '2006', ano_final: '2019', motorizacao: '1.0 / 1.4' },
      { marca: 'Chevrolet', modelo: 'Agile', ano_inicial: '2010', ano_final: '2014', motorizacao: '1.4' },
      { marca: 'Chevrolet', modelo: 'Cobalt', ano_inicial: '2012', ano_final: '2019', motorizacao: '1.4 / 1.8' },
      { marca: 'Chevrolet', modelo: 'Montana', ano_inicial: '2004', ano_final: '2010', motorizacao: '1.4 / 1.8' },
      { marca: 'Chevrolet', modelo: 'Meriva', ano_inicial: '2003', ano_final: '2012', motorizacao: '1.4 / 1.8' },
      { marca: 'Chevrolet', modelo: 'Zafira', ano_inicial: '2001', ano_final: '2012', motorizacao: '2.0' },
      { marca: 'Chevrolet', modelo: 'Astra', ano_inicial: '2000', ano_final: '2011', motorizacao: '2.0' },
      { marca: 'Chevrolet', modelo: 'Vectra', ano_inicial: '2000', ano_final: '2011', motorizacao: '2.0 / 2.2 / 2.4' },
      
      // Ford
      { marca: 'Ford', modelo: 'Ka', ano_inicial: '2008', ano_final: '2014', motorizacao: '1.0 / 1.6' },
      { marca: 'Ford', modelo: 'Fiesta', ano_inicial: '2000', ano_final: '2017', motorizacao: '1.0 / 1.6' },
      { marca: 'Ford', modelo: 'Focus', ano_inicial: '2000', ano_final: '2018', motorizacao: '1.6 / 2.0' },
      { marca: 'Ford', modelo: 'Fusion', ano_inicial: '2006', ano_final: '2012', motorizacao: '2.3 / 2.5' },
      { marca: 'Ford', modelo: 'EcoSport', ano_inicial: '2003', ano_final: '2012', motorizacao: '1.6 / 2.0' },
      { marca: 'Ford', modelo: 'Courier', ano_inicial: '2000', ano_final: '2013', motorizacao: '1.6' },
      
      // Peugeot
      { marca: 'Peugeot', modelo: '206', ano_inicial: '2000', ano_final: '2010', motorizacao: '1.0 / 1.4 / 1.6' },
      { marca: 'Peugeot', modelo: '207', ano_inicial: '2009', ano_final: '2015', motorizacao: '1.4 / 1.6' },
      { marca: 'Peugeot', modelo: '307', ano_inicial: '2002', ano_final: '2012', motorizacao: '1.6 / 2.0' },
      { marca: 'Peugeot', modelo: '308', ano_inicial: '2012', ano_final: '2018', motorizacao: '1.6 / 2.0' },
      { marca: 'Peugeot', modelo: '408', ano_inicial: '2012', ano_final: '2018', motorizacao: '1.6 / 2.0' },
      
      // Citroën
      { marca: 'Citroën', modelo: 'C3', ano_inicial: '2003', ano_final: '2012', motorizacao: '1.4 / 1.6' },
      { marca: 'Citroën', modelo: 'C4', ano_inicial: '2009', ano_final: '2015', motorizacao: '1.6 / 2.0' },
      { marca: 'Citroën', modelo: 'Xsara Picasso', ano_inicial: '2000', ano_final: '2012', motorizacao: '1.6 / 2.0' },
      
      // Renault
      { marca: 'Renault', modelo: 'Clio', ano_inicial: '2000', ano_final: '2016', motorizacao: '1.0 / 1.6' },
      { marca: 'Renault', modelo: 'Sandero', ano_inicial: '2008', ano_final: '2014', motorizacao: '1.0 / 1.6' },
      { marca: 'Renault', modelo: 'Logan', ano_inicial: '2008', ano_final: '2013', motorizacao: '1.0 / 1.6' },
      { marca: 'Renault', modelo: 'Megane', ano_inicial: '2000', ano_final: '2012', motorizacao: '1.6 / 2.0' },
      { marca: 'Renault', modelo: 'Scenic', ano_inicial: '2000', ano_final: '2011', motorizacao: '1.6 / 2.0' },
      { marca: 'Renault', modelo: 'Symbol', ano_inicial: '2009', ano_final: '2013', motorizacao: '1.6' },
      
      // Honda
      { marca: 'Honda', modelo: 'Fit', ano_inicial: '2003', ano_final: '2014', motorizacao: '1.4 / 1.5' },
      { marca: 'Honda', modelo: 'City', ano_inicial: '2009', ano_final: '2014', motorizacao: '1.5' },
      { marca: 'Honda', modelo: 'Civic', ano_inicial: '2000', ano_final: '2016', motorizacao: '1.7 / 1.8 / 2.0' },
      { marca: 'Honda', modelo: 'Accord', ano_inicial: '2003', ano_final: '2012', motorizacao: '2.0 / 2.4 / 3.0' },
      { marca: 'Honda', modelo: 'CR-V', ano_inicial: '2007', ano_final: '2016', motorizacao: '2.0 / 2.4' },
      
      // Toyota
      { marca: 'Toyota', modelo: 'Corolla', ano_inicial: '2000', ano_final: '2014', motorizacao: '1.6 / 1.8 / 2.0' },
      { marca: 'Toyota', modelo: 'Etios', ano_inicial: '2013', ano_final: '2020', motorizacao: '1.3 / 1.5' },
      { marca: 'Toyota', modelo: 'Hilux', ano_inicial: '2005', ano_final: '2015', motorizacao: '2.5 / 3.0 Diesel' },
      { marca: 'Toyota', modelo: 'SW4', ano_inicial: '2005', ano_final: '2015', motorizacao: '2.7 / 3.0 Diesel' },
      { marca: 'Toyota', modelo: 'Camry', ano_inicial: '2002', ano_final: '2014', motorizacao: '2.4 / 3.0 / 3.5' },
      
      // Nissan
      { marca: 'Nissan', modelo: 'March', ano_inicial: '2011', ano_final: '2018', motorizacao: '1.0 / 1.6' },
      { marca: 'Nissan', modelo: 'Versa', ano_inicial: '2012', ano_final: '2014', motorizacao: '1.6' },
      { marca: 'Nissan', modelo: 'Tiida', ano_inicial: '2008', ano_final: '2013', motorizacao: '1.8' },
      { marca: 'Nissan', modelo: 'Livina', ano_inicial: '2009', ano_final: '2014', motorizacao: '1.6 / 1.8' },
      { marca: 'Nissan', modelo: 'Sentra', ano_inicial: '2007', ano_final: '2013', motorizacao: '2.0' },
      
      // Hyundai
      { marca: 'Hyundai', modelo: 'HB20', ano_inicial: '2013', ano_final: '2019', motorizacao: '1.0 / 1.6' },
      { marca: 'Hyundai', modelo: 'i30', ano_inicial: '2009', ano_final: '2012', motorizacao: '2.0' },
      { marca: 'Hyundai', modelo: 'Elantra', ano_inicial: '2007', ano_final: '2016', motorizacao: '1.8 / 2.0' },
      { marca: 'Hyundai', modelo: 'Tucson', ano_inicial: '2007', ano_final: '2015', motorizacao: '2.0' },
      { marca: 'Hyundai', modelo: 'Santa Fe', ano_inicial: '2007', ano_final: '2012', motorizacao: '2.7 / 3.5' },
      
      // Kia
      { marca: 'Kia', modelo: 'Picanto', ano_inicial: '2007', ano_final: '2011', motorizacao: '1.0' },
      { marca: 'Kia', modelo: 'Cerato', ano_inicial: '2010', ano_final: '2013', motorizacao: '1.6 / 2.0' },
      { marca: 'Kia', modelo: 'Soul', ano_inicial: '2010', ano_final: '2013', motorizacao: '1.6' },
      { marca: 'Kia', modelo: 'Sportage', ano_inicial: '2007', ano_final: '2015', motorizacao: '2.0' },
      { marca: 'Kia', modelo: 'Sorento', ano_inicial: '2009', ano_final: '2014', motorizacao: '2.4 / 3.5' },
      
      // Mitsubishi
      { marca: 'Mitsubishi', modelo: 'Lancer', ano_inicial: '2008', ano_final: '2017', motorizacao: '2.0' },
      { marca: 'Mitsubishi', modelo: 'ASX', ano_inicial: '2011', ano_final: '2020', motorizacao: '2.0' },
      { marca: 'Mitsubishi', modelo: 'Outlander', ano_inicial: '2007', ano_final: '2015', motorizacao: '2.0 / 2.4 / 3.0' },
      { marca: 'Mitsubishi', modelo: 'Pajero', ano_inicial: '2000', ano_final: '2021', motorizacao: '3.2 / 3.5 / 3.8' },
      { marca: 'Mitsubishi', modelo: 'L200', ano_inicial: '2005', ano_final: '2012', motorizacao: '2.5 / 3.2 / 3.5' },
    ]
  },
  
  // Filtros de óleo universais
  'filtro': {
    vehicles: [
      { marca: 'Universal', modelo: 'Diversos', ano_inicial: '2000', ano_final: '2024', motorizacao: 'Verificar compatibilidade' },
    ]
  },
  
  // Pneus por medida
  '175/70r13': {
    vehicles: [
      { marca: 'Volkswagen', modelo: 'Gol', ano_inicial: '2008', ano_final: '2016', motorizacao: 'Todas' },
      { marca: 'Fiat', modelo: 'Palio', ano_inicial: '2008', ano_final: '2017', motorizacao: 'Todas' },
      { marca: 'Chevrolet', modelo: 'Celta', ano_inicial: '2000', ano_final: '2015', motorizacao: 'Todas' },
    ]
  },
  
  '185/65r15': {
    vehicles: [
      { marca: 'Volkswagen', modelo: 'Polo', ano_inicial: '2018', ano_final: '2024', motorizacao: 'Todas' },
      { marca: 'Hyundai', modelo: 'HB20', ano_inicial: '2013', ano_final: '2024', motorizacao: 'Todas' },
      { marca: 'Chevrolet', modelo: 'Onix', ano_inicial: '2013', ano_final: '2024', motorizacao: 'Todas' },
    ]
  },
  
  // Pastilhas de freio
  'pastilha': {
    vehicles: [
      { marca: 'Universal', modelo: 'Diversos', ano_inicial: '2000', ano_final: '2024', motorizacao: 'Verificar código' },
    ]
  },
  
  // Velas
  'vela': {
    vehicles: [
      { marca: 'Universal', modelo: 'Diversos', ano_inicial: '2000', ano_final: '2024', motorizacao: 'Verificar código' },
    ]
  },
};

/**
 * Sugere NCM, CEST, CFOP baseado no nome e categoria do produto
 */
export const suggestFiscalInfo = (productName, category) => {
  if (!productName) return null;

  const nameLower = productName.toLowerCase();
  
  // Busca exata primeiro
  for (const [key, data] of Object.entries(ncmDatabase)) {
    if (nameLower.includes(key)) {
      return data;
    }
  }
  
  // Busca por keywords
  for (const [key, data] of Object.entries(ncmDatabase)) {
    if (data.keywords) {
      for (const keyword of data.keywords) {
        if (nameLower.includes(keyword)) {
          return data;
        }
      }
    }
  }
  
  // Fallback por categoria
  if (category) {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('filtro')) {
      return ncmDatabase['filtro'];
    }
    if (categoryLower.includes('óleo') || categoryLower.includes('oleo')) {
      return ncmDatabase['óleo'];
    }
    if (categoryLower.includes('pneu')) {
      return ncmDatabase['pneu'];
    }
  }
  
  return null;
};

/**
 * Sugere veículos compatíveis baseado no nome do produto
 */
export const suggestCompatibleVehicles = (productName, category, tags = []) => {
  if (!productName) return [];

  const nameLower = productName.toLowerCase();
  const allText = `${nameLower} ${category?.toLowerCase() || ''} ${tags.join(' ').toLowerCase()}`;
  
  // Busca por padrões específicos
  for (const [key, data] of Object.entries(compatibilityDatabase)) {
    if (allText.includes(key)) {
      return data.vehicles;
    }
  }
  
  // Busca por categoria
  if (category) {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('óleo') || categoryLower.includes('oleo')) {
      // Tenta identificar a viscosidade
      if (allText.includes('5w30') || allText.includes('5w-30')) {
        return compatibilityDatabase['5w30'].vehicles;
      }
      if (allText.includes('10w40') || allText.includes('10w-40')) {
        return compatibilityDatabase['10w40'].vehicles;
      }
    }
    
    if (categoryLower.includes('pneu')) {
      // Tenta identificar a medida
      const medidaMatch = allText.match(/(\d{3}\/\d{2}r\d{2})/);
      if (medidaMatch) {
        const medida = medidaMatch[1];
        if (compatibilityDatabase[medida]) {
          return compatibilityDatabase[medida].vehicles;
        }
      }
    }
    
    if (categoryLower.includes('filtro')) {
      return compatibilityDatabase['filtro'].vehicles;
    }
    
    if (categoryLower.includes('pastilha')) {
      return compatibilityDatabase['pastilha'].vehicles;
    }
    
    if (categoryLower.includes('vela')) {
      return compatibilityDatabase['vela'].vehicles;
    }
  }
  
  return [];
};

/**
 * Formata sugestão para exibição
 */
export const formatSuggestion = (suggestion) => {
  if (!suggestion) return null;
  
  return {
    ncm: suggestion.ncm || '',
    cest: suggestion.cest || '',
    cfop: suggestion.cfop || '5102',
    csosn: suggestion.csosn || '102',
  };
};
