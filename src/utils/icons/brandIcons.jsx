/**
 * Brand Icons
 * Sistema de ícones de marcas de veículos com fallback inteligente
 */

// Importa apenas os ícones que realmente existem no react-icons/si
import { 
  SiHonda,
  SiToyota,
  SiFord,
  SiChevrolet,
  SiVolkswagen,
  SiBmw,
  SiMercedes,
  SiAudi,
  SiHyundai,
  SiKia,
  SiNissan,
  SiFiat,
  SiTesla,
  SiPorsche,
  SiFerrari,
  SiLamborghini,
  SiMaserati,
  SiBentley,
  SiJaguar,
  SiMini,
  SiVolvo,
  SiMazda,
  SiSubaru,
  SiJeep,
} from 'react-icons/si';

import { VehicleTypeIcon, detectVehicleType } from './vehicleIcons';

/**
 * Mapeamento de marcas para ícones do Simple Icons
 * Inclui aliases para variações de nomes
 */
export const brandIconMap = {
  // Carros - Marcas Japonesas
  'HONDA': SiHonda,
  'TOYOTA': SiToyota,
  'NISSAN': SiNissan,
  'MAZDA': SiMazda,
  'SUBARU': SiSubaru,
  // Note: Mitsubishi, Lexus, Infiniti, Acura não disponíveis - usarão fallback
  
  // Carros - Marcas Americanas
  'FORD': SiFord,
  'CHEVROLET': SiChevrolet,
  'JEEP': SiJeep,
  'TESLA': SiTesla,
  // Note: Cadillac não disponível - usará fallback
  
  // Carros - Marcas Alemãs
  'VOLKSWAGEN': SiVolkswagen,
  'VW': SiVolkswagen,
  'BMW': SiBmw,
  'MERCEDES': SiMercedes,
  'MERCEDES-BENZ': SiMercedes,
  'MERCEDES BENZ': SiMercedes,
  'AUDI': SiAudi,
  'PORSCHE': SiPorsche,
  
  // Carros - Marcas Coreanas
  'HYUNDAI': SiHyundai,
  'KIA': SiKia,
  
  // Carros - Marcas Italianas
  'FIAT': SiFiat,
  'FERRARI': SiFerrari,
  'LAMBORGHINI': SiLamborghini,
  'MASERATI': SiMaserati,
  // Note: Alfa Romeo não disponível - usará fallback
  
  // Carros - Marcas Britânicas
  'JAGUAR': SiJaguar,
  'MINI': SiMini,
  'BENTLEY': SiBentley,
  // Note: Land Rover, Aston Martin, Rolls Royce, McLaren não disponíveis - usarão fallback
  
  // Carros - Marcas Suecas
  'VOLVO': SiVolvo,
  
  // Note: Marcas de motos (Yamaha, Suzuki, Kawasaki, Ducati, Harley-Davidson, Triumph, KTM)
  // e outras marcas premium (Bugatti, etc) não estão disponíveis no react-icons/si
  // O sistema usará automaticamente o ícone de fallback apropriado (carro ou moto)
};

/**
 * Extrai o nome da marca do modelo do veículo
 * 
 * @param {string} vehicleModel - Modelo completo do veículo
 * @returns {Object|null} - { brandName: string, brandKey: string } ou null
 */
export const extractBrand = (vehicleModel) => {
  if (!vehicleModel) return null;
  
  const modelUpper = vehicleModel.toUpperCase().trim();
  
  // Tenta correspondência exata com marcas compostas primeiro (ex: LAND ROVER)
  const composedBrands = [
    'MERCEDES-BENZ', 'MERCEDES BENZ',
    'LAND ROVER', 'LAND-ROVER',
    'ASTON MARTIN', 'ASTON-MARTIN',
    'ROLLS ROYCE', 'ROLLS-ROYCE',
    'ALFA ROMEO', 'ALFA-ROMEO',
    'HARLEY-DAVIDSON', 'HARLEY DAVIDSON',
  ];
  
  for (const brand of composedBrands) {
    if (modelUpper.startsWith(brand)) {
      return { 
        brandName: brand, 
        brandKey: brand 
      };
    }
  }
  
  // Tenta correspondência com primeira palavra
  const firstWord = modelUpper.split(' ')[0];
  
  if (brandIconMap[firstWord]) {
    return { 
      brandName: firstWord, 
      brandKey: firstWord 
    };
  }
  
  return null;
};

// Modo debug para desenvolvimento
const DEBUG_ICONS = import.meta.env.DEV;

/**
 * BrandIcon Component
 * Renderiza o ícone da marca do veículo com fallback inteligente
 * 
 * @param {Object} props
 * @param {string} props.vehicleModel - Modelo completo do veículo
 * @param {string} props.className - Classes CSS customizadas
 * @param {number} props.size - Tamanho do ícone em pixels
 * @param {boolean} props.showFallback - Se deve mostrar fallback quando marca não encontrada (padrão: true)
 * @returns {JSX.Element|null}
 */
export const BrandIcon = ({ 
  vehicleModel, 
  className = 'w-6 h-6', 
  size = 24,
  showFallback = true 
}) => {
  try {
    // Extrai a marca do modelo
    const brandInfo = extractBrand(vehicleModel);
    
    if (brandInfo) {
      const IconComponent = brandIconMap[brandInfo.brandKey];
      
      if (IconComponent) {
        // Log de sucesso em modo debug
        if (DEBUG_ICONS) {
          console.log('[Icon System] ✓ Brand icon found:', {
            model: vehicleModel,
            brand: brandInfo.brandName,
            source: 'Simple Icons'
          });
        }
        
        return (
          <IconComponent 
            className={className}
            size={size}
            aria-label={`Ícone da marca ${brandInfo.brandName}`}
          />
        );
      }
    }
    
    // Marca não encontrada - usa fallback
    if (showFallback) {
      // Passa a marca extraída para melhorar a detecção
      const vehicleType = detectVehicleType(vehicleModel, brandInfo?.brandName);
      
      // Log de fallback
      if (DEBUG_ICONS) {
        console.warn('[Icon System] ⚠ Brand icon not found, using fallback:', {
          model: vehicleModel,
          extractedBrand: brandInfo?.brandName || 'unknown',
          fallbackType: vehicleType,
          source: 'Custom/Lucide React'
        });
      }
      
      return (
        <VehicleTypeIcon 
          type={vehicleType}
          className={className}
          size={size}
        />
      );
    }
    
    return null;
    
  } catch (error) {
    // Tratamento de erros
    console.error('[Icon System] ✗ Error rendering icon:', {
      model: vehicleModel,
      error: error.message,
      stack: error.stack
    });
    
    // Retorna fallback genérico em caso de erro
    if (showFallback) {
      return (
        <VehicleTypeIcon 
          type="car"
          className={className}
          size={size}
        />
      );
    }
    
    return null;
  }
};

export default BrandIcon;
