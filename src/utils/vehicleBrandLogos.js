/**
 * Vehicle Brand Logos Utility
 * Provides brand logo URLs from GitHub CDN and fallback initials
 * Includes intelligent brand inference from vehicle model names
 */

// Map of vehicle models to their brands (for intelligent inference)
const MODEL_TO_BRAND_MAP = {
  // Volkswagen
  'voyage': 'volkswagen', 'gol': 'volkswagen', 'polo': 'volkswagen', 'virtus': 'volkswagen',
  'jetta': 'volkswagen', 'golf': 'volkswagen', 'tiguan': 'volkswagen', 'tcross': 'volkswagen',
  't-cross': 'volkswagen', 'taos': 'volkswagen', 'nivus': 'volkswagen', 'saveiro': 'volkswagen',
  'amarok': 'volkswagen', 'fox': 'volkswagen', 'up': 'volkswagen', 'passat': 'volkswagen',
  'fusca': 'volkswagen', 'kombi': 'volkswagen', 'spacefox': 'volkswagen', 'crossfox': 'volkswagen',
  'parati': 'volkswagen', 'santana': 'volkswagen', 'quantum': 'volkswagen', 'bora': 'volkswagen',
  
  // Chevrolet
  'onix': 'chevrolet', 'prisma': 'chevrolet', 'cruze': 'chevrolet', 'tracker': 'chevrolet',
  'spin': 'chevrolet', 's10': 'chevrolet', 'trailblazer': 'chevrolet', 'equinox': 'chevrolet',
  'montana': 'chevrolet', 'cobalt': 'chevrolet', 'celta': 'chevrolet', 'corsa': 'chevrolet',
  'classic': 'chevrolet', 'astra': 'chevrolet', 'vectra': 'chevrolet', 'omega': 'chevrolet',
  'captiva': 'chevrolet', 'agile': 'chevrolet', 'meriva': 'chevrolet', 'zafira': 'chevrolet',
  'blazer': 'chevrolet', 'camaro': 'chevrolet', 'silverado': 'chevrolet', 'opala': 'chevrolet',
  'chevette': 'chevrolet', 'monza': 'chevrolet', 'kadett': 'chevrolet', 'ipanema': 'chevrolet',
  
  // Fiat
  'uno': 'fiat', 'palio': 'fiat', 'siena': 'fiat', 'strada': 'fiat', 'toro': 'fiat',
  'argo': 'fiat', 'cronos': 'fiat', 'mobi': 'fiat', 'pulse': 'fiat', 'fastback': 'fiat',
  'fiorino': 'fiat', 'doblo': 'fiat', 'ducato': 'fiat', 'punto': 'fiat', 'linea': 'fiat',
  'bravo': 'fiat', 'idea': 'fiat', 'weekend': 'fiat', 'stilo': 'fiat', 'marea': 'fiat',
  'tempra': 'fiat', 'tipo': 'fiat', 'elba': 'fiat', 'premio': 'fiat', '147': 'fiat',
  'cinquecento': 'fiat', '500': 'fiat',
  
  // Ford
  'ka': 'ford', 'fiesta': 'ford', 'focus': 'ford', 'fusion': 'ford', 'ecosport': 'ford',
  'ranger': 'ford', 'territory': 'ford', 'edge': 'ford', 'mustang': 'ford', 'bronco': 'ford',
  'maverick': 'ford', 'escort': 'ford', 'verona': 'ford', 'versailles': 'ford', 'royale': 'ford',
  'del rey': 'ford', 'corcel': 'ford', 'belina': 'ford', 'pampa': 'ford', 'f-250': 'ford',
  'f250': 'ford', 'f-1000': 'ford', 'f1000': 'ford', 'f-100': 'ford', 'f100': 'ford',
  
  // Toyota
  'corolla': 'toyota', 'hilux': 'toyota', 'yaris': 'toyota', 'etios': 'toyota', 'sw4': 'toyota',
  'rav4': 'toyota', 'camry': 'toyota', 'prius': 'toyota', 'land cruiser': 'toyota', 'bandeirante': 'toyota',
  'fielder': 'toyota', 'corona': 'toyota', 'supra': 'toyota', 'celica': 'toyota',
  
  // Honda
  'civic': 'honda', 'city': 'honda', 'fit': 'honda', 'hr-v': 'honda', 'hrv': 'honda',
  'cr-v': 'honda', 'crv': 'honda', 'wr-v': 'honda', 'wrv': 'honda', 'accord': 'honda',
  'zr-v': 'honda', 'zrv': 'honda', 'cg': 'honda', 'biz': 'honda', 'pop': 'honda',
  'titan': 'honda', 'fan': 'honda', 'bros': 'honda', 'xre': 'honda', 'cb': 'honda',
  'cbr': 'honda', 'pcx': 'honda', 'elite': 'honda', 'lead': 'honda', 'sh': 'honda',
  'adv': 'honda', 'nc': 'honda', 'africa twin': 'honda', 'goldwing': 'honda',
  
  // Hyundai
  'hb20': 'hyundai', 'hb20s': 'hyundai', 'creta': 'hyundai', 'tucson': 'hyundai',
  'santa fe': 'hyundai', 'i30': 'hyundai', 'elantra': 'hyundai', 'azera': 'hyundai',
  'veloster': 'hyundai', 'ix35': 'hyundai', 'sonata': 'hyundai', 'veracruz': 'hyundai',
  'kona': 'hyundai', 'palisade': 'hyundai',
  
  // Renault
  'kwid': 'renault', 'sandero': 'renault', 'logan': 'renault', 'duster': 'renault',
  'captur': 'renault', 'oroch': 'renault', 'stepway': 'renault', 'fluence': 'renault',
  'megane': 'renault', 'scenic': 'renault', 'clio': 'renault', 'symbol': 'renault',
  'master': 'renault', 'kangoo': 'renault', 'trafic': 'renault',
  
  // Nissan
  'kicks': 'nissan', 'versa': 'nissan', 'sentra': 'nissan', 'frontier': 'nissan',
  'march': 'nissan', 'livina': 'nissan', 'tiida': 'nissan', 'altima': 'nissan',
  'pathfinder': 'nissan', 'murano': 'nissan', 'leaf': 'nissan', 'gt-r': 'nissan',
  '370z': 'nissan', 'x-trail': 'nissan',
  
  // Jeep
  'renegade': 'jeep', 'compass': 'jeep', 'commander': 'jeep', 'wrangler': 'jeep',
  'cherokee': 'jeep', 'grand cherokee': 'jeep', 'gladiator': 'jeep',
  
  // Mitsubishi
  'l200': 'mitsubishi', 'pajero': 'mitsubishi', 'outlander': 'mitsubishi', 'asx': 'mitsubishi',
  'eclipse': 'mitsubishi', 'lancer': 'mitsubishi', 'triton': 'mitsubishi',
  
  // Peugeot
  '208': 'peugeot', '2008': 'peugeot', '308': 'peugeot', '3008': 'peugeot',
  '408': 'peugeot', '5008': 'peugeot', '206': 'peugeot', '207': 'peugeot',
  '307': 'peugeot', '407': 'peugeot', 'partner': 'peugeot', 'boxer': 'peugeot',
  
  // Citroën
  'c3': 'citroen', 'c4': 'citroen', 'c4 cactus': 'citroen', 'aircross': 'citroen',
  'c5': 'citroen', 'ds3': 'citroen', 'ds4': 'citroen', 'ds5': 'citroen',
  'xsara': 'citroen', 'picasso': 'citroen', 'jumper': 'citroen', 'berlingo': 'citroen',
  
  // Kia
  'sportage': 'kia', 'sorento': 'kia', 'cerato': 'kia', 'soul': 'kia',
  'picanto': 'kia', 'stinger': 'kia', 'carnival': 'kia', 'seltos': 'kia',
  'bongo': 'kia', 'mohave': 'kia', 'optima': 'kia', 'cadenza': 'kia',
  
  // BMW
  'serie 1': 'bmw', 'serie 2': 'bmw', 'serie 3': 'bmw', 'serie 4': 'bmw',
  'serie 5': 'bmw', 'serie 7': 'bmw', 'x1': 'bmw', 'x2': 'bmw', 'x3': 'bmw',
  'x4': 'bmw', 'x5': 'bmw', 'x6': 'bmw', 'x7': 'bmw', 'z4': 'bmw',
  '118i': 'bmw', '120i': 'bmw', '320i': 'bmw', '328i': 'bmw', '330i': 'bmw',
  '520i': 'bmw', '530i': 'bmw', '540i': 'bmw', 'm3': 'bmw', 'm4': 'bmw', 'm5': 'bmw',
  
  // Mercedes-Benz
  'classe a': 'mercedes-benz', 'classe c': 'mercedes-benz', 'classe e': 'mercedes-benz',
  'classe s': 'mercedes-benz', 'gla': 'mercedes-benz', 'glb': 'mercedes-benz',
  'glc': 'mercedes-benz', 'gle': 'mercedes-benz', 'gls': 'mercedes-benz',
  'cla': 'mercedes-benz', 'cls': 'mercedes-benz', 'amg': 'mercedes-benz',
  'sprinter': 'mercedes-benz', 'vito': 'mercedes-benz', 'actros': 'mercedes-benz',
  'a180': 'mercedes-benz', 'a200': 'mercedes-benz', 'a250': 'mercedes-benz',
  'c180': 'mercedes-benz', 'c200': 'mercedes-benz', 'c250': 'mercedes-benz', 'c300': 'mercedes-benz',
  
  // Audi
  'a1': 'audi', 'a3': 'audi', 'a4': 'audi', 'a5': 'audi', 'a6': 'audi', 'a7': 'audi', 'a8': 'audi',
  'q3': 'audi', 'q5': 'audi', 'q7': 'audi', 'q8': 'audi', 'tt': 'audi', 'r8': 'audi',
  'rs3': 'audi', 'rs4': 'audi', 'rs5': 'audi', 'rs6': 'audi', 'rs7': 'audi',
  's3': 'audi', 's4': 'audi', 's5': 'audi', 'e-tron': 'audi',
  
  // Yamaha (motos)
  'fazer': 'yamaha', 'factor': 'yamaha', 'ybr': 'yamaha', 'xtz': 'yamaha',
  'lander': 'yamaha', 'tenere': 'yamaha', 'crosser': 'yamaha', 'nmax': 'yamaha',
  'neo': 'yamaha', 'fluo': 'yamaha', 'mt-03': 'yamaha', 'mt-07': 'yamaha',
  'mt-09': 'yamaha', 'r1': 'yamaha', 'r3': 'yamaha', 'r6': 'yamaha', 'r7': 'yamaha',
  'xmax': 'yamaha', 'tracer': 'yamaha', 'xt': 'yamaha', 'tdm': 'yamaha',
  
  // Suzuki
  'vitara': 'suzuki', 'jimny': 'suzuki', 'swift': 'suzuki', 'sx4': 'suzuki',
  's-cross': 'suzuki', 'grand vitara': 'suzuki', 'baleno': 'suzuki',
  'gsx': 'suzuki', 'hayabusa': 'suzuki', 'intruder': 'suzuki', 'burgman': 'suzuki',
  'v-strom': 'suzuki', 'dl': 'suzuki', 'bandit': 'suzuki',
  
  // Kawasaki
  'ninja': 'kawasaki', 'z900': 'kawasaki', 'z1000': 'kawasaki', 'z650': 'kawasaki',
  'z400': 'kawasaki', 'versys': 'kawasaki', 'vulcan': 'kawasaki', 'er-6n': 'kawasaki',
  'zx-6r': 'kawasaki', 'zx-10r': 'kawasaki', 'h2': 'kawasaki',
  
  // Subaru
  'impreza': 'subaru', 'wrx': 'subaru', 'forester': 'subaru', 'outback': 'subaru',
  'xv': 'subaru', 'legacy': 'subaru', 'brz': 'subaru', 'crosstrek': 'subaru',
  
  // Volvo
  'xc40': 'volvo', 'xc60': 'volvo', 'xc90': 'volvo', 's60': 'volvo', 's90': 'volvo',
  'v40': 'volvo', 'v60': 'volvo', 'v90': 'volvo', 'c30': 'volvo', 'c40': 'volvo',
  
  // Land Rover
  'discovery': 'land rover', 'defender': 'land rover', 'evoque': 'land rover',
  'velar': 'land rover', 'sport': 'land rover', 'freelander': 'land rover',
  
  // Porsche
  '911': 'porsche', 'cayenne': 'porsche', 'macan': 'porsche', 'panamera': 'porsche',
  'boxster': 'porsche', 'cayman': 'porsche', 'taycan': 'porsche',
  
  // Tesla
  'model 3': 'tesla', 'model s': 'tesla', 'model x': 'tesla', 'model y': 'tesla',
  
  // BYD
  'dolphin': 'byd', 'seal': 'byd', 'song': 'byd', 'tang': 'byd', 'han': 'byd',
  'yuan': 'byd', 'atto 3': 'byd',
  
  // Chery / Caoa Chery
  'tiggo': 'chery', 'arrizo': 'chery', 'qq': 'chery', 'celer': 'chery',
  
  // JAC
  'j2': 'jac', 'j3': 'jac', 'j5': 'jac', 'j6': 'jac', 't40': 'jac', 't50': 'jac', 't60': 'jac', 't80': 'jac',
  
  // GWM / Haval
  'h6': 'haval', 'jolion': 'haval', 'poer': 'gwm', 'ora': 'gwm',
};

// Map of brand names to their logo file names on GitHub CDN
const BRAND_LOGO_MAP = {
  // Popular Brazilian brands
  'chevrolet': 'chevrolet',
  'fiat': 'fiat',
  'volkswagen': 'volkswagen',
  'vw': 'volkswagen',
  'ford': 'ford',
  'toyota': 'toyota',
  'honda': 'honda',
  'hyundai': 'hyundai',
  'nissan': 'nissan',
  'renault': 'renault',
  'jeep': 'jeep',
  'mitsubishi': 'mitsubishi',
  'peugeot': 'peugeot',
  'citroen': 'citroen',
  'citroën': 'citroen',
  'kia': 'kia',
  'kia motors': 'kia',
  'bmw': 'bmw',
  'mercedes': 'mercedes-benz',
  'mercedes-benz': 'mercedes-benz',
  'audi': 'audi',
  'volvo': 'volvo',
  'land rover': 'land-rover',
  'landrover': 'land-rover',
  'jaguar': 'jaguar',
  'porsche': 'porsche',
  'ferrari': 'ferrari',
  'lamborghini': 'lamborghini',
  'maserati': 'maserati',
  'alfa romeo': 'alfa-romeo',
  'subaru': 'subaru',
  'mazda': 'mazda',
  'suzuki': 'suzuki',
  'lexus': 'lexus',
  'infiniti': 'infiniti',
  'acura': 'acura',
  'dodge': 'dodge',
  'ram': 'ram',
  'chrysler': 'chrysler',
  'buick': 'buick',
  'cadillac': 'cadillac',
  'gmc': 'gmc',
  'lincoln': 'lincoln',
  'mini': 'mini',
  'smart': 'smart',
  'seat': 'seat',
  'skoda': 'skoda',
  'opel': 'opel',
  'tesla': 'tesla',
  'byd': 'byd',
  'chery': 'chery',
  'jac': 'jac',
  'caoa chery': 'chery',
  'lifan': 'lifan',
  'geely': 'geely',
  'great wall': 'great-wall',
  'haval': 'haval',
  'gwm': 'gwm',
  // Motorcycles
  'yamaha': 'yamaha',
  'kawasaki': 'kawasaki',
  'harley-davidson': 'harley-davidson',
  'harley': 'harley-davidson',
  'ducati': 'ducati',
  'triumph': 'triumph',
  'ktm': 'ktm',
  'royal enfield': 'royal-enfield',
  'royal enfield': 'royal-enfield',
  'dafra': 'dafra',
  'shineray': 'shineray',
  // Trucks
  'scania': 'scania',
  'man': 'man',
  'iveco': 'iveco',
  'daf': 'daf',
};

// GitHub CDN base URL for car logos
const LOGO_CDN_BASE = 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized';

// Local logos for brands not available in CDN (stored in /public/logos/)
const LOCAL_BRAND_LOGOS = {
  // SVG logos (melhor qualidade)
  'yamaha': '/logos/yamaha.svg',
  'kia': '/logos/kia.svg',
  // PNG logos (fallback local do CDN)
  'ford': '/logos/ford.png',
  'fiat': '/logos/fiat.png',
  'chevrolet': '/logos/chevrolet.png',
  'volkswagen': '/logos/volkswagen.png',
  'toyota': '/logos/toyota.png',
  'honda': '/logos/honda.png',
  'hyundai': '/logos/hyundai.png',
  'nissan': '/logos/nissan.png',
  'renault': '/logos/renault.png',
  'jeep': '/logos/jeep.png',
  'mitsubishi': '/logos/mitsubishi.png',
  'peugeot': '/logos/peugeot.png',
  'citroen': '/logos/citroen.png',
  'bmw': '/logos/bmw.png',
  'mercedes-benz': '/logos/mercedes-benz.png',
  'audi': '/logos/audi.png',
  'volvo': '/logos/volvo.png',
  'subaru': '/logos/subaru.png',
  'mazda': '/logos/mazda.png',
  'suzuki': '/logos/suzuki.png',
  'lexus': '/logos/lexus.png',
  'land-rover': '/logos/land-rover-green.svg',
  'ferrari': '/logos/ferrari.png',
  'byd': '/logos/byd-auto.svg',
  'gwm': '/Logotipo Branco PNG.png',
  // Logos que ainda precisam ser baixadas
  'kawasaki': 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Kawasaki_Motors_logo.svg',
  'royal-enfield': '/Royal_Enfield-OtWUyWXCP_brandlogos.net.svg',
  'ducati': '/logos/ducati.png',
  'harley-davidson': '/logos/harley-davidson.png',
};

// Logos específicas para dark mode (versões claras/brancas que funcionam em fundo escuro)
const DARK_MODE_LOGOS = {
  'ford': '/logos/ford-dark.svg',
  'fiat': '/logos/fiat.svg',
  'land-rover': '/logos/land-rover-green.svg',
  'kia': '/logos/kia.svg',
  'ferrari': '/logos/ferrari-dark.svg',
  'lamborghini': '/logos/lamborghini-dark.svg',
  'bmw': '/logos/bmw-light.svg',
  'byd': '/logos/byd-auto.svg',
  'mini': 'https://cdn.worldvectorlogo.com/logos/bmw-mini-1.svg',
  'dodge': 'https://cdn.worldvectorlogo.com/logos/dodge-ram.svg',
  'volvo': 'https://www.svgrepo.com/show/306942/volvo.svg',
  'porsche': 'https://www.svgrepo.com/show/446911/porsche.svg',
  'jac': 'https://iconape.com/wp-content/files/bc/163841/png/jac-motors-logo.png',
};

// Logos específicas para light mode (versões coloridas)
const LIGHT_MODE_LOGOS = {
  'land-rover': '/logos/land-rover-green.svg',
  'bmw': '/logos/bmw-light.svg',
  'dodge': 'https://cdn.worldvectorlogo.com/logos/dodge-ram.svg',
  'ram': 'https://cdn.worldvectorlogo.com/logos/dodge-ram.svg',
  'porsche': '/porsche-logo-E5720D9afC_brandlogos.net.svg',
};

/**
 * Infer brand from vehicle model name
 * @param {string} model - The vehicle model name
 * @returns {string|null} - The inferred brand or null
 */
export const inferBrandFromModel = (model) => {
  if (!model) return null;
  
  const normalizedModel = model.toLowerCase().trim();
  
  // Direct match
  if (MODEL_TO_BRAND_MAP[normalizedModel]) {
    return MODEL_TO_BRAND_MAP[normalizedModel];
  }
  
  // Check if model starts with or contains any known model name
  for (const [knownModel, brand] of Object.entries(MODEL_TO_BRAND_MAP)) {
    if (normalizedModel.includes(knownModel) || normalizedModel.startsWith(knownModel)) {
      return brand;
    }
  }
  
  // Check for partial matches (first word)
  const firstWord = normalizedModel.split(/[\s\-/]+/)[0];
  if (MODEL_TO_BRAND_MAP[firstWord]) {
    return MODEL_TO_BRAND_MAP[firstWord];
  }
  
  return null;
};

/**
 * Get the effective brand (provided or inferred from model)
 * @param {string} brand - The provided brand name
 * @param {string} model - The vehicle model name
 * @returns {string} - The effective brand name
 */
export const getEffectiveBrand = (brand, model) => {
  // If brand is provided and valid, use it
  if (brand && brand.trim() && brand.toLowerCase() !== 'não informado' && brand.toLowerCase() !== 'desconhecido') {
    return brand;
  }
  
  // Try to infer from model
  const inferredBrand = inferBrandFromModel(model);
  if (inferredBrand) {
    // Capitalize first letter
    return inferredBrand.charAt(0).toUpperCase() + inferredBrand.slice(1);
  }
  
  return brand || '';
};

/**
 * Get the logo URL for a vehicle brand
 * NOTA: Sempre retorna a mesma URL independente do tema para evitar recarregamento
 * O CSS cuida da inversão de cores via filter: brightness(0) invert(1)
 * @param {string} brand - The vehicle brand name
 * @param {string} model - Optional model name for inference
 * @param {boolean} isDarkMode - DEPRECATED: Não mais usado, mantido para compatibilidade
 * @returns {string|null} - The logo URL or null if not found
 */
export const getBrandLogoUrl = (brand, model = '', isDarkMode = false) => {
  // Get effective brand (provided or inferred)
  const effectiveBrand = getEffectiveBrand(brand, model);
  
  if (!effectiveBrand) return null;
  
  const normalizedBrand = effectiveBrand.toLowerCase().trim();
  const logoName = BRAND_LOGO_MAP[normalizedBrand];
  
  if (logoName) {
    // SEMPRE usar a logo padrão - CSS cuida da inversão de cores
    // Isso evita recarregamento de imagem ao trocar de tema
    
    // Check if it's a brand with local logo
    if (LOCAL_BRAND_LOGOS[logoName]) {
      return LOCAL_BRAND_LOGOS[logoName];
    }
    return `${LOGO_CDN_BASE}/${logoName}.png`;
  }
  
  // Try direct match with brand name
  const directMatch = normalizedBrand.replace(/\s+/g, '-');
  
  // Check if it's a brand with local logo
  if (LOCAL_BRAND_LOGOS[directMatch]) {
    return LOCAL_BRAND_LOGOS[directMatch];
  }
  
  return `${LOGO_CDN_BASE}/${directMatch}.png`;
};

/**
 * Get initials for a brand (fallback when logo not available)
 * @param {string} brand - The vehicle brand name
 * @param {string} model - Optional model name for inference
 * @returns {string} - 1-3 character initials
 */
export const getBrandInitials = (brand, model = '') => {
  const effectiveBrand = getEffectiveBrand(brand, model);
  
  if (!effectiveBrand) return '?';
  
  const words = effectiveBrand.trim().split(/\s+/);
  
  if (words.length === 1) {
    // Single word: take first 2-3 characters
    return effectiveBrand.substring(0, 2).toUpperCase();
  }
  
  // Multiple words: take first letter of each (max 3)
  return words
    .slice(0, 3)
    .map(word => word[0])
    .join('')
    .toUpperCase();
};

/**
 * Check if a brand has a known logo
 * @param {string} brand - The vehicle brand name
 * @param {string} model - Optional model name for inference
 * @returns {boolean}
 */
export const hasBrandLogo = (brand, model = '') => {
  const effectiveBrand = getEffectiveBrand(brand, model);
  if (!effectiveBrand) return false;
  const normalizedBrand = effectiveBrand.toLowerCase().trim();
  return normalizedBrand in BRAND_LOGO_MAP;
};

/**
 * Format vehicle display text (Brand + Model) avoiding duplication
 * Handles cases like "KIA MOTORS KIA CERATO" -> "KIA CERATO"
 * @param {string} brand - The vehicle brand
 * @param {string} model - The vehicle model
 * @returns {string} - Formatted vehicle text
 */
export const formatVehicleDisplay = (brand, model) => {
  const effectiveBrand = getEffectiveBrand(brand, model);
  const modelText = (model || '').trim();
  
  if (!effectiveBrand) {
    return modelText.toUpperCase() || 'VEÍCULO';
  }
  
  const brandUpper = effectiveBrand.toUpperCase();
  let modelUpper = modelText.toUpperCase();
  
  // Normalize brand name (remove common suffixes like "MOTORS", "DO BRASIL", etc.)
  const brandCore = brandUpper
    .replace(/\s*(MOTORS?|DO BRASIL|BRASIL|AUTOMOVEIS|AUTOMÓVEIS|AUTOMOTIVE)\s*/gi, '')
    .trim();
  
  // Check if model already contains the brand name - if so, just return the model
  if (modelUpper.includes(brandCore)) {
    // Remove duplicate brand from model if it appears twice
    // e.g., "KIA CERATO" when brand is "KIA MOTORS" -> just return "KIA CERATO"
    return modelUpper;
  }
  
  // Check if model already starts with the brand name
  if (modelUpper.startsWith(brandUpper) || modelUpper.startsWith(brandCore)) {
    return modelUpper;
  }
  
  // Check if model contains the brand name at the beginning (with variations)
  const brandVariations = [brandUpper, brandCore, brandUpper.replace('-', ' '), brandUpper.replace(' ', '-')];
  for (const variation of brandVariations) {
    if (variation && modelUpper.startsWith(variation)) {
      return modelUpper;
    }
  }
  
  // Brand not in model, combine them using the core brand name
  return `${brandCore} ${modelUpper}`.trim();
};

export default {
  getBrandLogoUrl,
  getBrandInitials,
  hasBrandLogo,
  inferBrandFromModel,
  getEffectiveBrand,
  formatVehicleDisplay,
};
