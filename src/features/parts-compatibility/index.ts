/**
 * TORQ AI - Parts Compatibility Feature
 * 
 * Sistema completo de compatibilidade de peças para veículos
 * Integrado com APIs FIPE e base de dados verificada HiFlo
 * 
 * @author TORQ AI Team
 * @version 2.0.0
 */

// ============================================================================
// SERVIÇOS
// ============================================================================

export { 
  partsLookupService,
  quickOilFilterSearch,
  checkCompatibility,
  getMotorcycleMakes,
  PartsLookupService,
} from './services/partsLookupService';

export type {
  PartSearchResult,
  CompatiblePart,
  PartCategory,
  VehicleDetails,
  VehicleSearchResult,
  PartsLookupOptions,
} from './services/partsLookupService';

export { 
  vehicleApiService,
  getFipeMakes,
  getFipeModels,
  getFipeYears,
  getFipeVehicleDetails,
  getNHTSAMakes,
  getNHTSAModels,
  decodeVIN,
  VehicleApiService,
} from './services/vehicleApiService';

export type {
  VehicleMake,
  VehicleModel,
  VehicleYear,
  VehicleType,
} from './services/vehicleApiService';

export {
  partsApiService,
  searchOilFilter,
  searchAllParts,
  isVehicleSupported,
  getSupportedMakes,
  getSupportedModels,
  PartsApiService,
} from './services/partsApiService';

// ============================================================================
// DADOS
// ============================================================================

export {
  VEHICLE_MAKES,
  MOTORCYCLE_MODELS,
  VEHICLE_TYPE_LABELS,
  getAllMakes,
  getMakesByType,
  getMakeInfo,
  getMotorcycleModels,
  findModel,
  getModelYears,
  vehicleExists,
  searchVehicles,
  getDatabaseStats,
} from './data/vehicleDatabaseV2';

export type {
  VehicleMakeInfo,
  VehicleModelInfo,
} from './data/vehicleDatabaseV2';

// ============================================================================
// COMPONENTES
// ============================================================================

export { PartsSearchPanel } from './components/PartsSearchPanel';
export { PartCard } from './components/PartCard';
export { CategoryFilter } from './components/CategoryFilter';
export { VehiclePartsProfile } from './components/VehiclePartsProfile';

// ============================================================================
// HOOKS (se existirem)
// ============================================================================

// export { usePartsCompatibility } from './hooks/usePartsCompatibility';

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

import { partsLookupService as defaultService } from './services/partsLookupService';
export default defaultService;
