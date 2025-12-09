/**
 * Vehicle Parts Search - Types
 * Sistema de busca de peças por veículo com granularidade completa
 * @version 2.0.0
 */

// ============================================================================
// VEHICLE TYPES
// ============================================================================

export type VehicleType = 'car' | 'motorcycle' | 'truck' | 'van' | 'bus' | 'suv' | 'pickup' | 'tractor';
export type FuelType = 'gasoline' | 'ethanol' | 'flex' | 'diesel' | 'electric' | 'hybrid' | 'cng';
export type TransmissionType = 'manual' | 'automatic' | 'cvt' | 'automated' | 'dct';
export type BodyType = 
  // Carros
  | 'sedan' | 'hatch' | 'suv' | 'pickup' | 'van' | 'coupe' | 'convertible' | 'wagon' | 'truck' | 'bus'
  // Motos
  | 'motorcycle' | 'street' | 'sport' | 'naked' | 'adventure' | 'touring' | 'cruiser' | 'scooter' | 'trail' | 'classic' | 'scrambler' | 'supermoto';

/**
 * Vehicle Variant - Entidade única com granularidade completa
 * Cada combinação brand+model+year+engine+trim é uma variante única
 */
export interface VehicleVariant {
  id: string;                      // Unique ID: brand_model_year_engine_trim
  brand: string;                   // Ex: "Toyota", "Yamaha"
  brandLogo?: string;              // URL do logo da marca
  model: string;                   // Ex: "Corolla", "R1"
  year: number;                    // Ano único (não range)
  trim?: string;                   // Ex: "GLi", "XEi", "Sport"
  engineCode?: string;             // Ex: "2ZR-FE", "C123"
  engineName?: string;             // Ex: "1.8 16V", "998cc"
  displacementCc?: number;         // Cilindrada em cc
  fuel: FuelType;
  transmission?: TransmissionType;
  bodyType: BodyType;
  vehicleType: VehicleType;
  power?: string;                  // Ex: "140cv", "200hp"
  vinPatterns?: string[];          // Regex patterns para VIN
  tecdocId?: string;               // ID TecDoc se disponível
  fipeCode?: string;               // Código FIPE
  sources: DataSource[];           // Fontes dos dados
  regionSpecific?: string;         // Ex: "Brasil", "Mercosul"
  notes?: string;                  // Observações
  lastUpdated: string;             // ISO date
}

export type DataSource = 'fipe' | 'tecdoc' | 'oem' | 'manual' | 'aftermarket' | 'scraper';

/**
 * Vehicle Suggestion - Item do autocomplete
 */
export interface VehicleSuggestion {
  id: string;
  variant: VehicleVariant;
  displayText: string;             // Texto formatado para exibição
  searchScore: number;             // Score de relevância (0-1)
  highlights?: {                   // Partes do texto que matcharam
    brand?: boolean;
    model?: boolean;
    year?: boolean;
    engine?: boolean;
  };
}

// ============================================================================
// COMPATIBILITY TYPES
// ============================================================================

export type MatchType = 
  | 'exact'        // Part number exato OEM
  | 'tecdoc'       // Fitment table TecDoc
  | 'oem'          // Catálogo OEM
  | 'aftermarket'  // Crossref aftermarket
  | 'attributes'   // Match por atributos (engineCode, specs)
  | 'heuristic'    // Match textual/NLP
  | 'manual'       // Confirmação manual
  | 'fipe';        // Baseado em FIPE

export interface MatchTrace {
  type: MatchType;
  source: DataSource;
  reason: string;                  // Ex: "Part number OEM match: 90915-YZZD1"
  attributes?: Record<string, string>;
}

export interface CompatiblePart {
  id: string;
  productId: string;
  name: string;
  sku: string;
  brand?: string;
  category?: string;
  partNumbers: string[];           // OEM + aftermarket
  oemPartNumber?: string;
  images: string[];
  stockQuantity: number;
  price: number;
  costPrice?: number;
  matchType: MatchType;
  confidence: number;              // 0-1
  matchTrace: MatchTrace;          // Razão do match
  manuallyVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface PartSearchFilters {
  category?: string;
  brand?: string;
  inStockOnly?: boolean;
  minConfidence?: number;
  matchTypes?: MatchType[];
  priceMin?: number;
  priceMax?: number;
}

// ============================================================================
// STATE TYPES
// ============================================================================

export interface VehiclePartsSearchState {
  // Search
  searchQuery: string;
  suggestions: VehicleSuggestion[];
  isLoadingSuggestions: boolean;
  
  // Selected vehicle
  selectedVariant: VehicleVariant | null;
  availableTrims: VehicleVariant[];  // Outras variantes do mesmo modelo/ano
  
  // Parts
  compatibleParts: CompatiblePart[];
  isLoadingParts: boolean;
  
  // Filters
  filters: PartSearchFilters;
  viewMode: 'grid' | 'list';
  
  // UI
  error: string | null;
  showExportModal: boolean;
}

export interface PartCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface CompatibilityStats {
  total: number;
  inStock: number;
  verified: number;
  avgConfidence: number;
  byMatchType: Record<MatchType, number>;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface AutocompleteResponse {
  suggestions: VehicleSuggestion[];
  totalCount: number;
  queryTime: number;
}

export interface CompatibilityResponse {
  parts: CompatiblePart[];
  stats: CompatibilityStats;
  cached: boolean;
  queryTime: number;
}

export interface ManualConfirmRequest {
  empresaId: string;
  productId: string;
  variantId: string;
  userId: string;
  notes?: string;
}
