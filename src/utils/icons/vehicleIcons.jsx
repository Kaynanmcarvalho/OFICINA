/**
 * Vehicle Type Icons - Usando bibliotecas profissionais
 * react-icons: Font Awesome, Material Design, etc.
 */

import { Truck, TruckIcon } from 'lucide-react';
import { FaMotorcycle, FaCarSide } from 'react-icons/fa';
import { IoCarSport } from 'react-icons/io5';
import { RiMotorbikeFill } from 'react-icons/ri';

/**
 * VehicleTypeIcon Component
 * Renderiza o ícone apropriado baseado no tipo de veículo
 * Usa ícones profissionais de react-icons
 */
export const VehicleTypeIcon = ({ 
  type = 'car', 
  className = 'w-6 h-6', 
  size = 24 
}) => {
  switch (type?.toLowerCase()) {
    case 'motorcycle':
    case 'moto':
      // Ícone de moto esportiva do Remix Icons
      return <RiMotorbikeFill size={size} className={className} />;
    
    case 'truck':
    case 'caminhao':
    case 'caminhão':
      return <Truck size={size} className={className} strokeWidth={2} />;
    
    case 'pickup':
      return <TruckIcon size={size} className={className} strokeWidth={2} />;
    
    case 'car':
    case 'carro':
    default:
      // Ícone de carro esportivo do Ionicons
      return <IoCarSport size={size} className={className} />;
  }
};

/**
 * Detecta o tipo de veículo baseado no modelo com sistema inteligente de pontuação
 * 
 * @param {string} vehicleModel - Modelo completo do veículo
 * @param {string} vehicleBrand - Marca do veículo (opcional, melhora precisão)
 * @returns {'car' | 'motorcycle' | 'truck' | 'pickup'}
 */
export const detectVehicleType = (vehicleModel, vehicleBrand = '') => {
  if (!vehicleModel) return 'car';
  
  const modelUpper = vehicleModel.toUpperCase();
  const brandUpper = vehicleBrand.toUpperCase();
  const fullText = `${brandUpper} ${modelUpper}`.trim();
  
  // Sistema de pontuação para cada tipo
  let scores = {
    car: 0,
    motorcycle: 0,
    truck: 0,
    pickup: 0
  };
  
  // ========== MARCAS (peso 200 - DECISIVO) ==========
  
  // Marcas exclusivas de CARROS (não fazem motos)
  const carOnlyBrands = [
    'VOLKSWAGEN', 'VW', 'FIAT', 'CHEVROLET', 'GM', 'FORD', 'RENAULT',
    'PEUGEOT', 'CITROEN', 'HYUNDAI', 'KIA', 'TOYOTA', 'NISSAN',
    'MITSUBISHI', 'JEEP', 'DODGE', 'CHRYSLER', 'AUDI', 'MERCEDES',
    'MERCEDES-BENZ', 'BMW CAR', 'VOLVO CAR', 'LAND ROVER', 'JAGUAR',
    'PORSCHE', 'FERRARI', 'LAMBORGHINI', 'MASERATI', 'ALFA ROMEO',
    'SUBARU', 'MAZDA', 'LEXUS', 'INFINITI', 'ACURA', 'CADILLAC',
    'BUICK', 'LINCOLN', 'TESLA', 'MINI', 'SMART', 'SEAT', 'SKODA',
    'CHERY', 'JAC', 'LIFAN', 'GEELY', 'BYD', 'GREAT WALL', 'HAVAL',
    'TROLLER', 'AGRALE CAR', 'CAOA', 'CHANGAN'
  ];
  
  // Marcas exclusivas de MOTOS
  const motorcycleBrands = [
    'YAMAHA', 'KAWASAKI', 'DUCATI', 'HARLEY-DAVIDSON', 'HARLEY DAVIDSON',
    'TRIUMPH', 'KTM', 'APRILIA', 'MV AGUSTA', 'ROYAL ENFIELD', 'INDIAN',
    'MOTO GUZZI', 'BENELLI', 'HUSQVARNA', 'BETA', 'GAS GAS', 'SHERCO', 
    'PIAGGIO', 'VESPA', 'SHINERAY', 'TRAXX', 'DAFRA', 'KASINSKI'
  ];
  
  // Marcas exclusivas de CAMINHÕES
  const truckBrands = [
    'SCANIA', 'VOLVO TRUCK', 'MAN', 'IVECO', 'DAF', 'RENAULT TRUCKS',
    'INTERNATIONAL', 'KENWORTH', 'PETERBILT', 'FREIGHTLINER', 'MACK', 
    'WESTERN STAR', 'HINO', 'ISUZU TRUCK', 'AGRALE TRUCK'
  ];
  
  // Marcas que fazem CARROS E MOTOS (precisam análise do modelo)
  const MIXED_BRANDS = ['HONDA', 'SUZUKI', 'BMW'];
  
  // PRIORIDADE MÁXIMA: Marca exclusiva de carro
  if (carOnlyBrands.some(brand => fullText.startsWith(brand) || brandUpper === brand)) {
    scores.car += 200; // Peso decisivo
  }
  
  // Marca exclusiva de moto
  if (motorcycleBrands.some(brand => fullText.startsWith(brand) || brandUpper === brand)) {
    scores.motorcycle += 200;
  }
  
  // Marca exclusiva de caminhão
  if (truckBrands.some(brand => fullText.startsWith(brand) || brandUpper === brand)) {
    scores.truck += 200;
  }
  
  // ========== MODELOS ESPECÍFICOS (peso 90 - muito confiável) ==========
  
  // Modelos de carros conhecidos (evita falsos positivos)
  const carModels = [
    'GOL', 'PALIO', 'UNO', 'SIENA', 'STRADA', 'TORO', 'MOBI', 'ARGO', 'CRONOS',
    'COROLLA', 'CIVIC', 'FIT', 'CITY', 'ACCORD', 'HRV', 'CRV', 'WRV',
    'ONIX', 'PRISMA', 'CRUZE', 'COBALT', 'SPIN', 'TRACKER', 'EQUINOX',
    'SANDERO', 'LOGAN', 'DUSTER', 'KWID', 'CAPTUR', 'OROCH',
    'POLO', 'VOYAGE', 'VIRTUS', 'NIVUS', 'TCROSS', 'TAOS', 'TIGUAN',
    'FUSION', 'FOCUS', 'FIESTA', 'KA', 'ECOSPORT', 'EDGE', 'TERRITORY',
    'HB20', 'CRETA', 'IX35', 'TUCSON', 'SANTA FE', 'AZERA',
    'SPORTAGE', 'CERATO', 'OPTIMA', 'SORENTO', 'SOUL', 'STONIC',
    'KICKS', 'VERSA', 'SENTRA', 'MARCH', 'LEAF',
    'COMPASS', 'RENEGADE', 'COMMANDER',
    'SANTANA', 'SANTANA CG', 'PASSAT', 'JETTA', 'GOLF', 'FUSCA', 'BRASILIA', 'QUANTUM',
    'CORSA', 'CELTA', 'CLASSIC', 'ASTRA', 'VECTRA', 'OMEGA', 'MONZA', 'KADETT', 'OPALA',
    'ESCORT', 'DEL REY', 'BELINA', 'PAMPA', 'VERSAILLES', 'ROYALE',
    'ETIOS', 'YARIS', 'PRIUS', 'CAMRY', 'RAV4',
    'OUTLANDER', 'LANCER', 'ASX', 'ECLIPSE', 'PAJERO',
    '208', '2008', '308', '3008', '408', '508', '5008',
    'C3', 'C4', 'C5', 'AIRCROSS', 'PICASSO',
    'PUNTO', 'LINEA', 'BRAVO', 'STILO', 'MAREA', 'TEMPRA', 'TIPO',
    'VOYAGE', 'FOX', 'SPACEFOX', 'CROSSFOX', 'SAVEIRO', 'GOL'
  ];
  
  // Modelos de pickup
  const pickupModels = [
    'HILUX', 'RANGER', 'AMAROK', 'S10', 'FRONTIER', 'L200', 'SAVEIRO',
    'MONTANA', 'TORO', 'OROCH', 'STRADA', 'RAM', 'SILVERADO', 'F-150',
    'F-250', 'F-350', 'COLORADO', 'CANYON', 'GLADIATOR', 'MAVERICK'
  ];
  
  // Modelos de motos (com padrões específicos para evitar falsos positivos)
  const motorcycleModels = [
    // Honda CG (apenas com números - evita "SANTANA CG")
    'CG 125', 'CG 150', 'CG 160', 'CG125', 'CG150', 'CG160',
    'HONDA CG', // Apenas se tiver "HONDA" antes
    'CB 125', 'CB 250', 'CB 300', 'CB 500', 'CB 600', 'CB 650', 'CB 1000',
    'CBR 250', 'CBR 300', 'CBR 500', 'CBR 600', 'CBR 650', 'CBR 1000',
    'CBX 250', 'CBX 750', 'XRE 190', 'XRE 300', 'XR 250',
    'BIZ 100', 'BIZ 125', 'BIZ110', 'BIZ125',
    'PCX 150', 'PCX 160', 'PCX150', 'PCX160',
    'TITAN 150', 'TITAN 160', 'TITAN150', 'TITAN160',
    'BROS 160', 'BROS 125', 'BROS160', 'BROS125',
    'POP 100', 'POP 110', 'POP100', 'POP110',
    'LEAD 110', 'LEAD110', 'ELITE 125',
    'NC 700', 'NC 750', 'NC700', 'NC750',
    'SHADOW 600', 'SHADOW 750', 'SHADOW600', 'SHADOW750',
    // Yamaha
    'FAZER 150', 'FAZER 250', 'FAZER150', 'FAZER250',
    'FACTOR 125', 'FACTOR 150', 'FACTOR125', 'FACTOR150',
    'XTZ 125', 'XTZ 150', 'XTZ 250', 'XTZ125', 'XTZ150', 'XTZ250',
    'YZF R1', 'YZF R3', 'YZF R6', 'YZF-R1', 'YZF-R3', 'YZF-R6',
    'MT-03', 'MT-07', 'MT-09', 'MT-10', 'MT03', 'MT07', 'MT09', 'MT10',
    'XJ6', 'XJ6N', 'XJ6F',
    'NMAX 160', 'NMAX160',
    'CROSSER 150', 'CROSSER150',
    'NEO 125', 'NEO125',
    // Outras marcas
    'NINJA 250', 'NINJA 300', 'NINJA 400', 'NINJA 650', 'NINJA 1000',
    'Z 300', 'Z 400', 'Z 650', 'Z 900', 'Z 1000',
    'VERSYS 650', 'VERSYS 1000',
    'VULCAN 650', 'VULCAN 900',
    'GSX-R', 'GSXR', 'GSX 750', 'GSX 1000',
    'HAYABUSA', 'BOULEVARD', 'V-STROM',
    'SPORTSTER', 'SOFTAIL', 'STREET', 'ROAD KING', 'ELECTRA GLIDE',
    'MONSTER', 'PANIGALE', 'MULTISTRADA', 'SCRAMBLER', 'DIAVEL'
  ];
  
  // Verifica modelos de carros PRIMEIRO (prioridade)
  if (carModels.some(model => modelUpper.includes(model))) {
    scores.car += 90;
  }
  
  // Se "SANTANA" está no modelo, é definitivamente um carro (VW Santana)
  if (modelUpper.includes('SANTANA')) {
    scores.car += 150; // Peso alto para garantir que é carro
  }
  
  // Verifica modelos de pickup
  if (pickupModels.some(model => modelUpper.includes(model))) {
    scores.pickup += 90;
  }
  
  // Verifica modelos de motos
  // IMPORTANTE: Só conta como moto se NÃO for um modelo de carro conhecido
  const isLikelyCar = scores.car >= 90;
  
  if (!isLikelyCar && motorcycleModels.some(model => {
    // Se o modelo contém "CG" mas também contém "SANTANA", ignora
    if (model.includes('CG') && modelUpper.includes('SANTANA')) {
      return false;
    }
    // Se for apenas "CG" sem número, ignora (pode ser SANTANA CG)
    if (model === 'CG' && !modelUpper.match(/CG\s*\d/)) {
      return false;
    }
    return modelUpper.includes(model);
  })) {
    scores.motorcycle += 90;
  }
  
  // ========== PALAVRAS-CHAVE (peso 50 - moderadamente confiável) ==========
  
  // Palavras que indicam moto
  const motorcycleKeywords = ['MOTO', 'MOTOCICLETA', 'SCOOTER', 'CICLOMOTOR'];
  if (motorcycleKeywords.some(kw => fullText.includes(kw))) {
    scores.motorcycle += 50;
  }
  
  // Palavras que indicam caminhão
  const truckKeywords = ['CAMINHÃO', 'TRUCK', 'CARGO', 'ATEGO', 'AXOR', 'ACTROS', 
    'DAILY', 'TECTOR', 'STRALIS', 'CONSTELLATION', 'WORKER', 'ACCELO'];
  if (truckKeywords.some(kw => fullText.includes(kw))) {
    scores.truck += 50;
  }
  
  // Palavras que indicam pickup
  const pickupKeywords = ['PICKUP', 'PICK-UP', 'PICAPE', 'CABINE DUPLA', 'CD', '4X4'];
  if (pickupKeywords.some(kw => fullText.includes(kw))) {
    scores.pickup += 50;
  }
  
  // ========== PADRÕES ESPECÍFICOS (peso 30 - baixa confiabilidade) ==========
  
  // Cilindradas típicas de motos (ex: 125CC, 150CC, 250CC)
  if (/\b(100|110|125|150|160|190|200|250|300|400|500|600|650|750|800|900|1000|1100|1200|1300)\s?(CC|CILINDRADAS)\b/i.test(fullText)) {
    scores.motorcycle += 30;
  }
  
  // Padrões de nomenclatura de motos (ex: CB300, XRE190)
  // MAS APENAS se não for uma marca exclusiva de carro
  if (/\b[A-Z]{2,4}\s?\d{2,4}\b/.test(modelUpper) && modelUpper.length < 20 && scores.car < 200) {
    scores.motorcycle += 20;
  }
  
  // ========== DECISÃO FINAL ==========
  
  // Encontra o tipo com maior pontuação
  const maxScore = Math.max(...Object.values(scores));
  
  // Se não houver pontuação significativa, assume carro (mais comum)
  if (maxScore < 30) {
    return 'car';
  }
  
  // Retorna o tipo com maior pontuação
  const detectedType = Object.keys(scores).find(type => scores[type] === maxScore);
  
  // Log para debug (sempre ativo para ajudar a identificar problemas)
  console.log('[Vehicle Type Detection]', {
    input: vehicleModel,
    brand: vehicleBrand,
    fullText,
    scores,
    detected: detectedType
  });
  
  return detectedType || 'car';
};

export default VehicleTypeIcon;
