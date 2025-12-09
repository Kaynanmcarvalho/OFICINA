/**
 * Configuração do Sistema de Sincronização de Veículos
 * APIs e parâmetros de consulta
 */

export const CONFIG = {
  // API FIPE (gratuita e confiável)
  FIPE_API: {
    BASE_URL: 'https://parallelum.com.br/fipe/api/v1',
    ENDPOINTS: {
      BRANDS: (type) => `/${type}/marcas`,
      MODELS: (type, brandCode) => `/${type}/marcas/${brandCode}/modelos`,
      YEARS: (type, brandCode, modelCode) => `/${type}/marcas/${brandCode}/modelos/${modelCode}/anos`,
      VEHICLE: (type, brandCode, modelCode, yearCode) => `/${type}/marcas/${brandCode}/modelos/${modelCode}/anos/${yearCode}`,
    },
    TYPES: {
      CARS: 'carros',
      MOTOS: 'motos',
      TRUCKS: 'caminhoes',
    },
  },

  // Configurações de rate limiting (MUITO conservador para evitar 429)
  RATE_LIMIT: {
    CONCURRENT_REQUESTS: 1,        // Apenas 1 requisição por vez
    DELAY_BETWEEN_REQUESTS: 2000,  // 2 segundos entre requisições
    RETRY_ATTEMPTS: 10,            // 10 tentativas
    RETRY_DELAY: 10000,            // 10 segundos entre retries
    BACKOFF_MULTIPLIER: 2,         // Dobra o tempo a cada falha
    MAX_RETRY_DELAY: 120000,       // Máximo 2 minutos de espera
  },

  // Marcas prioritárias para sincronização
  PRIORITY_BRANDS: {
    CARS: [
      'Volkswagen', 'Chevrolet', 'Fiat', 'Ford', 'Toyota', 'Honda', 'Hyundai',
      'Kia', 'Renault', 'Nissan', 'Jeep', 'Peugeot', 'Citroën', 'Mitsubishi',
      'Suzuki', 'BMW', 'Audi', 'Mercedes-Benz', 'Porsche', 'Volvo', 'Land Rover',
      'Subaru', 'Mazda', 'Lexus', 'Jaguar', 'Mini', 'Alfa Romeo', 'Chery',
      'JAC', 'Caoa Chery', 'BYD', 'GWM', 'RAM', 'Dodge', 'Chrysler',
    ],
    MOTOS: [
      'Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'BMW', 'Ducati', 'Harley-Davidson',
      'Triumph', 'KTM', 'Royal Enfield', 'Dafra', 'Shineray', 'Haojue', 'Kasinski',
      'Traxx', 'MVK', 'Benelli', 'Aprilia', 'MV Agusta', 'Indian',
    ],
    TRUCKS: [
      'Mercedes-Benz', 'Volkswagen', 'Scania', 'Volvo', 'Iveco', 'Ford',
      'DAF', 'MAN', 'Hyundai', 'Agrale',
    ],
  },

  // Anos a considerar
  YEAR_RANGE: {
    MIN: 1990,
    MAX: new Date().getFullYear() + 1,
  },

  // Arquivo de saída
  OUTPUT: {
    GENERATED_FILE: '../../src/features/vehicle-parts-search/data/generatedVehicles.ts',
    REPORT_FILE: './reports/sync-report.json',
    MISSING_FILE: './reports/missing-vehicles.json',
  },
};

// Mapeamento de nomes de marcas (FIPE -> Nosso padrão)
export const BRAND_NAME_MAP = {
  // Carros
  'VW - VolksWagen': 'Volkswagen',
  'GM - Chevrolet': 'Chevrolet',
  'FIAT': 'Fiat',
  'Ford': 'Ford',
  'Toyota': 'Toyota',
  'Honda': 'Honda',
  'Hyundai': 'Hyundai',
  'Kia Motors': 'KIA',
  'Renault': 'Renault',
  'Nissan': 'Nissan',
  'Jeep': 'Jeep',
  'Peugeot': 'Peugeot',
  'Citroën': 'Citroën',
  'Citroen': 'Citroën',
  'Mitsubishi': 'Mitsubishi',
  'Suzuki': 'Suzuki',
  'BMW': 'BMW',
  'Audi': 'Audi',
  'Mercedes-Benz': 'Mercedes-Benz',
  'Porsche': 'Porsche',
  'Volvo': 'Volvo',
  'Land Rover': 'Land Rover',
  'Subaru': 'Subaru',
  'Mazda': 'Mazda',
  'Lexus': 'Lexus',
  'Jaguar': 'Jaguar',
  'Mini': 'Mini',
  'Alfa Romeo': 'Alfa Romeo',
  'Chery': 'Chery',
  'JAC': 'JAC',
  'CAOA Chery': 'Caoa Chery',
  'BYD': 'BYD',
  'GWM': 'GWM',
  'RAM': 'RAM',
  'Dodge': 'Dodge',
  'Chrysler': 'Chrysler',
  
  // Motos
  'HONDA': 'Honda',
  'YAMAHA': 'Yamaha',
  'SUZUKI': 'Suzuki',
  'KAWASAKI': 'Kawasaki',
  'BMW Motorrad': 'BMW',
  'DUCATI': 'Ducati',
  'HARLEY-DAVIDSON': 'Harley-Davidson',
  'TRIUMPH': 'Triumph',
  'KTM': 'KTM',
  'ROYAL ENFIELD': 'Royal Enfield',
  'DAFRA': 'Dafra',
  'SHINERAY': 'Shineray',
  'HAOJUE': 'Haojue',
  'KASINSKI': 'Kasinski',
  
  // Caminhões
  'MERCEDES-BENZ': 'Mercedes-Benz',
  'SCANIA': 'Scania',
  'VOLVO': 'Volvo',
  'IVECO': 'Iveco',
  'DAF': 'DAF',
  'MAN': 'MAN',
  'AGRALE': 'Agrale',
};

// Mapeamento de tipos de combustível
export const FUEL_MAP = {
  'Gasolina': 'gasoline',
  'Álcool': 'ethanol',
  'Flex': 'flex',
  'Diesel': 'diesel',
  'Elétrico': 'electric',
  'Híbrido': 'hybrid',
  'GNV': 'cng',
};

// Mapeamento de tipos de carroceria baseado em palavras-chave no modelo
export const BODY_TYPE_KEYWORDS = {
  // Carros
  sedan: ['sedan', 'sedã', 'classic', 'prisma', 'cobalt', 'cruze', 'corolla', 'civic', 'jetta', 'passat', 'fusion', 'camry'],
  hatch: ['hatch', 'hatchback', 'gol', 'palio', 'uno', 'celta', 'ka', 'fiesta', 'fox', 'polo', 'golf', 'onix', 'argo', 'mobi', 'kwid', 'hb20'],
  suv: ['suv', 'tracker', 'creta', 'tucson', 'sportage', 'compass', 'renegade', 't-cross', 'nivus', 'kicks', 'hr-v', 'cr-v', 'rav4', 'tiguan', 'q3', 'q5', 'x1', 'x3', 'x5', 'glc', 'gle', 'cayenne', 'macan'],
  pickup: ['pickup', 'pick-up', 'cabine', 'saveiro', 'strada', 'montana', 's10', 'ranger', 'hilux', 'amarok', 'frontier', 'toro', 'maverick', 'ram'],
  van: ['van', 'furgão', 'fiorino', 'kangoo', 'partner', 'berlingo', 'doblo', 'spin', 'livina', 'kombi', 'ducato', 'master', 'sprinter', 'transit'],
  wagon: ['wagon', 'perua', 'variant', 'parati', 'weekend', 'fielder', 'spacefox'],
  coupe: ['coupe', 'cupê', 'mustang', 'camaro', '911', 'tt', 'z4', 'slk', 'slc'],
  convertible: ['conversível', 'cabriolet', 'roadster', 'spider', 'spyder'],
  
  // Motos
  street: ['cg', 'fan', 'start', 'factor', 'ybr', 'fazer 150', 'yes', 'intruder 125'],
  sport: ['cbr', 'ninja', 'r1', 'r6', 'r3', 'gsx-r', 'panigale', 'fireblade', 'zx'],
  naked: ['cb', 'hornet', 'xj6', 'mt-', 'z750', 'z800', 'z900', 'z1000', 'duke', 'monster', 'street triple', 'speed triple', 'fazer 250', 'twister'],
  adventure: ['africa twin', 'v-strom', 'versys', 'tiger', 'gs', 'tenere', 'transalp', 'multistrada', 'adventure'],
  touring: ['goldwing', 'k1600', 'electra glide', 'road king', 'pan america', 'fj', 'fjr'],
  cruiser: ['shadow', 'boulevard', 'vulcan', 'intruder', 'dragstar', 'virago', 'fat boy', 'softail', 'sportster', 'iron', 'forty-eight', 'breakout'],
  scooter: ['pcx', 'lead', 'sh', 'nmax', 'burgman', 'citycom', 'downtown', 'people', 'beverly'],
  trail: ['xr', 'xre', 'crf', 'lander', 'crosser', 'bros', 'tornado', 'klx', 'wr'],
  
  // Caminhões
  truck: ['cargo', 'delivery', 'constellation', 'worker', 'accelo', 'atego', 'actros', 'axor', 'arocs', 'vm', 'fh', 'fm', 'fmx', 'tector', 'stralis', 'daily', 'eurocargo'],
  bus: ['volksbus', 'of', 'o500', 'k310', 'k360', 'b270', 'b340', 'b420', 'paradiso', 'viale', 'torino'],
};

export default CONFIG;
