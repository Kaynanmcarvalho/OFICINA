/**
 * Icons Utility - Exportações Centralizadas
 * 
 * Este arquivo centraliza todas as exportações de ícones do sistema,
 * facilitando a importação e manutenção.
 * 
 * @example
 * // Importar ícones comuns
 * import { Car, Clock, User } from '@/utils/icons';
 * 
 * // Importar componentes de ícones
 * import { BrandIcon, VehicleTypeIcon } from '@/utils/icons';
 */

// Exporta todos os ícones comuns do Lucide React
export * from './commonIcons';

// Exporta componentes e utilitários de ícones de veículos
export { 
  VehicleTypeIcon, 
  detectVehicleType 
} from './vehicleIcons';

// Exporta componentes e utilitários de ícones de marcas
export { 
  BrandIcon, 
  extractBrand,
  brandIconMap 
} from './brandIcons';
