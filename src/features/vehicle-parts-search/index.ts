/**
 * Vehicle Parts Search Feature
 * Sistema completo de busca de peças por veículo
 * @version 1.0.0
 */

// Components
export { VehiclePartsSearchModal } from './components/VehiclePartsSearchModal';

// Hooks
export { useVehiclePartsSearch } from './hooks/useVehiclePartsSearch';

// Services
export { 
  searchVehicles, 
  getVehicleById, 
  getAvailableBrands, 
  getModelsByBrand,
  findVehicle,
  groupSuggestionsByBrand 
} from './services/vehicleSearchService';

export { 
  findCompatibleParts,
  saveManualCompatibility,
  removeManualCompatibility,
  getAvailableCategories,
  getAvailablePartBrands
} from './services/compatibilityService';

// Data
export { BRAZILIAN_VEHICLES_DATABASE, VEHICLES_BY_BRAND } from './data/brazilianVehicles';

// Types
export type {
  VehicleType,
  FuelType,
  MatchType,
  NormalizedVehicle,
  VehicleSuggestion,
  PartCompatibility,
  CompatiblePart,
  PartSearchFilters,
  CompatibilitySearchResult,
  VehiclePartsSearchState,
  PartCategory,
  CompatibilityStats
} from './types';
