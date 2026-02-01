/**
 * Sistema inteligente de detecção de tipo de veículo
 * Identifica se é Carro, Moto ou Caminhão baseado em marca e modelo
 */

// Marcas exclusivas de motos
const MOTO_BRANDS = [
    'HONDA', 'YAMAHA', 'SUZUKI', 'KAWASAKI', 'BMW MOTORRAD', 'DUCATI',
    'HARLEY-DAVIDSON', 'HARLEY DAVIDSON', 'TRIUMPH', 'KTM', 'ROYAL ENFIELD',
    'APRILIA', 'MV AGUSTA', 'BENELLI', 'SHINERAY', 'TRAXX', 'DAFRA',
    'KASINSKI', 'SUNDOWN', 'HAOJUE', 'JIANSHE', 'BULL', 'IROS',
    'HUSQVARNA', 'GAS GAS', 'BETA', 'SHERCO', 'MOTO GUZZI'
];

// Marcas exclusivas de carros
const CARRO_BRANDS = [
    'VOLKSWAGEN', 'VW', 'FIAT', 'CHEVROLET', 'FORD', 'TOYOTA', 'HYUNDAI',
    'RENAULT', 'NISSAN', 'PEUGEOT', 'CITROEN', 'JEEP', 'MITSUBISHI',
    'KIA', 'HONDA AUTOMOVEIS', 'AUDI', 'MERCEDES-BENZ', 'MERCEDES BENZ',
    'VOLVO', 'LAND ROVER', 'PORSCHE', 'FERRARI', 'LAMBORGHINI',
    'JAGUAR', 'MINI', 'SUBARU', 'MAZDA', 'LEXUS', 'INFINITI',
    'CHERY', 'JAC', 'LIFAN', 'GEELY', 'BYD', 'CAOA CHERY',
    'TESLA', 'ASTON MARTIN', 'BENTLEY', 'ROLLS-ROYCE', 'MASERATI',
    'ALFA ROMEO', 'SEAT', 'SKODA', 'SMART', 'DODGE', 'RAM',
    'CHRYSLER', 'CADILLAC', 'BUICK', 'GMC', 'LINCOLN'
];

// Marcas exclusivas de caminhões
const CAMINHAO_BRANDS = [
    'SCANIA', 'VOLVO TRUCKS', 'IVECO', 'DAF', 'MAN', 'MERCEDES-BENZ TRUCKS',
    'VOLKSWAGEN CAMINHOES', 'VW CAMINHOES', 'FORD CARGO', 'AGRALE'
];

// Palavras-chave no modelo que indicam moto
// IMPORTANTE: Evitar siglas genéricas como "CG" sozinho (ex: SANTANA CG é carro)
const MOTO_KEYWORDS = [
    'MOTO', 'MOTOCICLETA', 'CICLOMOTOR', 'SCOOTER', 'TRAIL', 'ENDURO',
    'CROSS', 'CUSTOM', 'CHOPPER', 'CRUISER', 'SPORT', 'NAKED', 'TOURING',
    'CG 125', 'CG 150', 'CG 160', 'CG125', 'CG150', 'CG160', // CG específico com números
    'CB', 'CBR', 'XRE', 'FAZER', 'YBR', 'FACTOR', 'TITAN', 'BIZ',
    'PCX', 'NMAX', 'BURGMAN', 'BOULEVARD', 'NINJA', 'Z', 'VERSYS',
    'STREET', 'ROAD', 'SOFTAIL', 'SPORTSTER', 'ELECTRA GLIDE',
    'MT', 'R1', 'R3', 'R6', 'GSX', 'HAYABUSA', 'V-STROM', 'VSTROM',
    'TIGER', 'BONNEVILLE', 'SCRAMBLER', 'MONSTER', 'PANIGALE',
    'MULTISTRADA', 'DIAVEL', 'AFRICA TWIN', 'GOLDWING', 'NC',
    'SH', 'LEAD', 'POP', 'START', 'FAN', 'BROS', 'XR', 'CRF',
    'WR', 'YZ', 'TTR', 'XT', 'XTZ', 'LANDER', 'CROSSER', 'TENERE',
    'DR', 'DL', 'BANDIT', 'INTRUDER', 'BOULEVARD', 'GLADIUS',
    'ER', 'KLX', 'KLR', 'VULCAN', 'ZX', 'ZZR', 'CONCOURS',
    'DUKE', 'RC', 'ADVENTURE', 'SUPER DUKE', 'SMC', 'SX', 'EXC',
    'METEOR', 'CLASSIC', 'INTERCEPTOR', 'CONTINENTAL', 'HIMALAYAN'
];

// Palavras-chave no modelo que indicam caminhão
const CAMINHAO_KEYWORDS = [
    'CAMINHAO', 'CAMINHÃO', 'TRUCK', 'CARGO', 'ATEGO', 'AXOR', 'ACTROS',
    'CONSTELLATION', 'WORKER', 'DELIVERY', 'ACCELO', 'TECTOR', 'STRALIS',
    'DAILY', 'VERTIS', 'FH', 'FM', 'VM', 'VNL', 'VNR', 'VHD',
    'TGX', 'TGS', 'TGL', 'TGM', 'XF', 'CF', 'LF',
    'SERIE R', 'SERIE P', 'SERIE G', 'SERIE S', 'SERIE V',
    'BARREIRO', 'MARACANAU', 'RESENDE', 'TAUBATE'
];

// Palavras-chave no modelo que indicam carro
const CARRO_KEYWORDS = [
    'SEDAN', 'HATCH', 'SUV', 'PICKUP', 'VAN', 'MINIVAN', 'WAGON',
    'COUPE', 'CONVERSIVEL', 'CONVERSÍVEL', 'CABRIO', 'ROADSTER',
    'GOL', 'POLO', 'VOYAGE', 'VIRTUS', 'NIVUS', 'T-CROSS', 'TCROSS',
    'TIGUAN', 'TAOS', 'AMAROK', 'SAVEIRO', 'JETTA', 'PASSAT', 'GOLF',
    'UNO', 'PALIO', 'SIENA', 'STRADA', 'TORO', 'ARGO', 'CRONOS',
    'MOBI', 'FIORINO', 'DUCATO', 'DOBLO', 'PULSE', 'FASTBACK',
    'ONIX', 'PRISMA', 'CRUZE', 'TRACKER', 'TRAILBLAZER', 'S10',
    'MONTANA', 'SPIN', 'COBALT', 'SONIC', 'EQUINOX', 'BLAZER',
    'KA', 'FIESTA', 'FOCUS', 'FUSION', 'ECOSPORT', 'EDGE', 'RANGER',
    'COROLLA', 'ETIOS', 'YARIS', 'HILUX', 'SW4', 'RAV4', 'COROLLA CROSS',
    'HB20', 'CRETA', 'TUCSON', 'SANTA FE', 'IX35', 'AZERA', 'ELANTRA',
    'SANDERO', 'LOGAN', 'DUSTER', 'CAPTUR', 'KWID', 'OROCH', 'KARDIAN',
    'KICKS', 'VERSA', 'SENTRA', 'FRONTIER', 'MARCH', 'LEAF',
    'RENEGADE', 'COMPASS', 'COMMANDER', 'WRANGLER', 'GRAND CHEROKEE',
    'CIVIC', 'CITY', 'FIT', 'HR-V', 'HRV', 'CR-V', 'CRV', 'ACCORD',
    'A3', 'A4', 'A5', 'A6', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8',
    'CLASSE A', 'CLASSE B', 'CLASSE C', 'CLASSE E', 'CLASSE S',
    'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'CLA', 'CLS', 'SL', 'SLC',
    'SERIE 1', 'SERIE 2', 'SERIE 3', 'SERIE 4', 'SERIE 5', 'SERIE 6', 'SERIE 7',
    'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'I3', 'I8',
    'SPORTAGE', 'SORENTO', 'SELTOS', 'STONIC', 'SOUL', 'CERATO', 'OPTIMA',
    'OUTLANDER', 'ASX', 'ECLIPSE CROSS', 'L200', 'PAJERO',
    '208', '2008', '308', '3008', '408', '5008', 'PARTNER', 'EXPERT',
    'C3', 'C4', 'C4 CACTUS', 'AIRCROSS', 'JUMPER', 'BERLINGO'
];

// Marcas que fabricam múltiplos tipos de veículos (IMPORTANTE!)
const MULTI_TYPE_BRANDS = [
    'HONDA', 'BMW', 'VOLVO', 'MERCEDES-BENZ', 'MERCEDES BENZ', 'VOLKSWAGEN', 'VW'
];

/**
 * Detecta o tipo de veículo baseado em marca e modelo
 * PRIORIDADE: Modelo > Marca (para marcas que fabricam múltiplos tipos)
 * @param {string} marca - Marca do veículo
 * @param {string} modelo - Modelo do veículo
 * @param {string} tipoOriginal - Tipo original retornado pela API (opcional)
 * @returns {string} 'moto', 'carro' ou 'caminhao'
 */
export const detectVehicleType = (marca, modelo, tipoOriginal = '') => {
    if (!marca && !modelo) {
        return 'carro'; // Default
    }

    const marcaUpper = (marca || '').toUpperCase().trim();
    const modeloUpper = (modelo || '').toUpperCase().trim();
    const tipoUpper = (tipoOriginal || '').toUpperCase().trim();

    // 1. Verifica tipo original se for claro
    if (tipoUpper.includes('MOTO') || tipoUpper.includes('MOTOCICLETA') || tipoUpper.includes('CICLOMOTOR')) {
        return 'moto';
    }
    if (tipoUpper.includes('CAMINHAO') || tipoUpper.includes('CAMINHÃO') || tipoUpper.includes('TRUCK')) {
        return 'caminhao';
    }

    // 2. PRIORIDADE: Para marcas multi-tipo, analisa MODELO PRIMEIRO
    const isMultiTypeBrand = MULTI_TYPE_BRANDS.some(brand => 
        marcaUpper.includes(brand) || brand.includes(marcaUpper)
  );

  if (isMultiTypeBrand) {
        // Verifica palavras-chave no modelo para motos
        if (MOTO_KEYWORDS.some(keyword => modeloUpper.includes(keyword))) {
            ');
            return 'moto';
        }

        // Verifica palavras-chave no modelo para caminhões
        if (CAMINHAO_KEYWORDS.some(keyword => modeloUpper.includes(keyword))) {
            ');
            return 'caminhao';
        }

        // Verifica palavras-chave no modelo para carros
        if (CARRO_KEYWORDS.some(keyword => modeloUpper.includes(keyword))) {
            ');
            return 'carro';
        }

        // Casos específicos por marca multi-tipo
        if (marcaUpper.includes('HONDA')) {
            // Honda sem identificação clara: assume moto (mais comum no Brasil)
            return 'moto';
        }

        if (marcaUpper.includes('BMW')) {
            // BMW Motorrad = moto, senão carro
            if (marcaUpper.includes('MOTORRAD')) {
                return 'moto';
            }
            return 'carro';
        }

        if (marcaUpper.includes('VOLVO')) {
            // Volvo Trucks = caminhão, senão carro
            if (marcaUpper.includes('TRUCK')) {
                return 'caminhao';
            }
            return 'carro';
        }

        if (marcaUpper.includes('MERCEDES') || marcaUpper.includes('BENZ')) {
            // Mercedes-Benz Trucks = caminhão, senão carro
            if (marcaUpper.includes('TRUCK') || modeloUpper.includes('ATEGO') || modeloUpper.includes('AXOR') || modeloUpper.includes('ACTROS')) {
                return 'caminhao';
            }
            return 'carro';
        }

        if (marcaUpper.includes('VOLKSWAGEN') || marcaUpper.includes('VW')) {
            // VW Caminhões = caminhão, senão carro
            if (marcaUpper.includes('CAMINHAO') || marcaUpper.includes('CAMINHÃO') || marcaUpper.includes('TRUCK')) {
                return 'caminhao';
            }
            return 'carro';
        }

        // Default para marca multi-tipo sem identificação: carro
        return 'carro';
    }

    // 3. Verifica marcas exclusivas de motos
    if (MOTO_BRANDS.some(brand => marcaUpper.includes(brand) || brand.includes(marcaUpper))) {
        return 'moto';
    }

    // 4. Verifica marcas exclusivas de caminhões
    if (CAMINHAO_BRANDS.some(brand => marcaUpper.includes(brand) || brand.includes(marcaUpper))) {
        return 'caminhao';
    }

    // 5. Verifica palavras-chave no modelo para motos
    // MAS ignora se for uma marca exclusiva de carros (evita falsos positivos como "SANTANA CG")
    const isCarBrand = CARRO_BRANDS.some(brand => marcaUpper.includes(brand) || brand.includes(marcaUpper));
    
    if (!isCarBrand && MOTO_KEYWORDS.some(keyword => modeloUpper.includes(keyword))) {
        return 'moto';
    }

    // 6. Verifica palavras-chave no modelo para caminhões
    if (CAMINHAO_KEYWORDS.some(keyword => modeloUpper.includes(keyword))) {
        return 'caminhao';
    }

    // 7. Verifica marcas exclusivas de carros
    if (CARRO_BRANDS.some(brand => marcaUpper.includes(brand) || brand.includes(marcaUpper))) {
        return 'carro';
    }

    // 8. Verifica palavras-chave no modelo para carros
    if (CARRO_KEYWORDS.some(keyword => modeloUpper.includes(keyword))) {
        return 'carro';
    }

    // 9. Default: CARRO (mais comum)
    return 'carro';
};

/**
 * Valida se o tipo detectado está correto
 * @param {string} tipo - Tipo detectado
 * @param {string} marca - Marca do veículo
 * @param {string} modelo - Modelo do veículo
 * @returns {boolean} True se o tipo parece correto
 */
export const validateVehicleType = (tipo, marca, modelo) => {
    const tipoDetectado = detectVehicleType(marca, modelo);
    const isValid = tipo === tipoDetectado;
    
    if (!isValid) {
        }
    
    return isValid;
};

/**
 * Corrige o tipo de veículo se estiver errado
 * @param {Object} vehicleData - Dados do veículo
 * @returns {Object} Dados do veículo com tipo corrigido
 */
export const correctVehicleType = (vehicleData) => {
    const tipoOriginal = vehicleData.tipo || vehicleData.type || '';
    const tipoDetectado = detectVehicleType(vehicleData.marca, vehicleData.modelo, tipoOriginal);
    
    if (tipoOriginal && tipoOriginal !== tipoDetectado) {
        }
    
    return {
        ...vehicleData,
        tipo: tipoDetectado,
        type: tipoDetectado
    };
};
