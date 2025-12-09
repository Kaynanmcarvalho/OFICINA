/**
 * Vehicle Parts Search - Types
 * Sistema de busca de peças por veículo
 * @version 1.0.0
 */

// Tipos de veículo
export type VehicleType = 'car' | 'motorcycle' | 'truck' | 'van' | 'pickup' | 'suv' | 'bus' | 'agricultural';

// Tipo de combustível
export type FuelType = 'gasoline' | 'diesel' | 'flex' | 'electric' | 'hybrid' | 'ethanol' | 'gnv';

// Tipo de match de compatibilidade
export type MatchType = 'exact' | 'tecdoc' | 'oem' | 'aftermarket' | 'heuristic' | 'manual' | 'fipe';

// Veículo normalizado
export interface NormalizedVehicle {
  id: string;
  brand: string;
  brandNormalized: string; // lowercase, sem acentos
  model: string;
  modelNormalized: string;
  trim?: string;
  generation?: string;
  yearFrom: number;
  yearTo: number;
  bodyType: VehicleType;
  fuelType?: FuelType;
  engineCode?: string;
  engineName?: string;
  displacementCc?: number;
  power?: string;
  transmission?: string;
  fipeCode?: string;
  vinRegex?: string;
  source: string[];
  searchTokens: string[]; // tokens para busca
  lastUpdated: Date;
}

// Sugestão de autocomplete
export interface VehicleSuggestion {
  id: string;
  brand: string;
  model: string;
  yearRange: string;
  bodyType: VehicleType;
  displayText: string;
  highlight?: string;
}

// Compatibilidade de peça
export interface PartCompatibility {
  id: string;
  productId: string;
  vehicleId: string;
  vehicleRef: string;
  partNumbers: string[];
  oemPartNumber?: string;
  aftermarketPartNumbers?: string[];
  matchType: MatchType;
  confidence: number; // 0-1
  notes?: string;
  source: string;
  lastChecked: Date;
  manuallyVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}


// Peça compatível (resultado da busca)
export interface CompatiblePart {
  id: string;
  productId: string;
  name: string;
  sku: string;
  brand?: string;
  category?: string;
  partNumbers: string[];
  oemPartNumber?: string;
  images?: string[];
  stockQuantity: number;
  price: number;
  costPrice?: number;
  matchType: MatchType;
  confidence: number;
  notes?: string;
  manuallyVerified: boolean;
}

// Filtros de busca
export interface PartSearchFilters {
  category?: string;
  brand?: string;
  inStockOnly?: boolean;
  minConfidence?: number;
  matchTypes?: MatchType[];
  priceMin?: number;
  priceMax?: number;
}

// Resultado da busca de compatibilidade
export interface CompatibilitySearchResult {
  vehicle: NormalizedVehicle;
  parts: CompatiblePart[];
  totalCount: number;
  filters: PartSearchFilters;
  searchTime: number;
}

// Estado do modal
export interface VehiclePartsSearchState {
  searchQuery: string;
  suggestions: VehicleSuggestion[];
  selectedVehicle: NormalizedVehicle | null;
  compatibleParts: CompatiblePart[];
  isLoadingSuggestions: boolean;
  isLoadingParts: boolean;
  filters: PartSearchFilters;
  viewMode: 'grid' | 'list';
  error: string | null;
}

// Categoria de peça
export interface PartCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

// Estatísticas de compatibilidade
export interface CompatibilityStats {
  totalParts: number;
  exactMatches: number;
  heuristicMatches: number;
  manuallyVerified: number;
  avgConfidence: number;
  categoryCounts: Record<string, number>;
}
