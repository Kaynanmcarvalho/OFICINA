/**
 * Vehicle Parts Search Feature
 * Sistema completo de busca de peças por veículo
 * Design sóbrio Apple-like, granularidade por ano/motor/trim
 * @version 2.0.0
 */

// Components
export { VehiclePartsSearchModal } from './components/VehiclePartsSearchModal';

// Services
export { 
  searchVehicles, 
  getVehicleById,
  getRelatedVariants,
  getAvailableBrands, 
  getModelsByBrand,
  findVehicle,
  groupSuggestionsByBrand,
  getDatabaseStats,
} from './services/vehicleSearchService';

export { 
  findCompatibleParts,
  saveManualCompatibility,
  removeManualCompatibility,
  getAvailableCategories,
  getAvailablePartBrands,
} from './services/compatibilityService';

// Data
export { 
  BRAZILIAN_VEHICLES_DATABASE, 
  VEHICLES_BY_BRAND,
  AVAILABLE_BRANDS,
  TOTAL_VARIANTS,
  BRAND_LOGOS,
} from './data/brazilianVehicles';

// Types
export type {
  VehicleType,
  FuelType,
  TransmissionType,
  BodyType,
  DataSource,
  MatchType,
  VehicleVariant,
  VehicleSuggestion,
  MatchTrace,
  CompatiblePart,
  PartSearchFilters,
  VehiclePartsSearchState,
  PartCategory,
  CompatibilityStats,
  AutocompleteResponse,
  CompatibilityResponse,
  ManualConfirmRequest,
} from './types';
