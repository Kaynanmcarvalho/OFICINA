/**
 * TORQ Parts Compatibility - Types
 * Tipos para compatibilidade de peças entre veículos
 */

export interface Part {
  id: string;
  name: string;
  partNumber: string;
  brand: string;
  category: PartCategory;
  description?: string;
  
  // Preços
  price: number;
  costPrice?: number;
  
  // Estoque
  stockQuantity?: number;
  minStock?: number;
  
  // Compatibilidade
  compatibleVehicles: VehicleCompatibility[];
  alternativeParts?: string[]; // IDs de peças alternativas
  
  // Metadados
  empresaId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PartCategory =
  | 'engine'           // Motor
  | 'transmission'     // Transmissão
  | 'brakes'           // Freios
  | 'suspension'       // Suspensão
  | 'electrical'       // Elétrica
  | 'cooling'          // Arrefecimento
  | 'fuel'             // Combustível
  | 'exhaust'          // Escape
  | 'body'             // Carroceria
  | 'interior'         // Interior
  | 'filters'          // Filtros
  | 'oils'             // Óleos e fluidos
  | 'tires'            // Pneus
  | 'accessories'      // Acessórios
  | 'other';           // Outros

export interface VehicleCompatibility {
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number;
  engine?: string;
  transmission?: 'manual' | 'automatic' | 'cvt' | 'all';
  notes?: string;
}

export interface CompatibilitySearchRequest {
  // Busca por veículo
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleEngine?: string;
  
  // Busca por peça
  partNumber?: string;
  partName?: string;
  partCategory?: PartCategory;
  partBrand?: string;
  
  // Filtros
  inStockOnly?: boolean;
  priceMin?: number;
  priceMax?: number;
}

export interface CompatibilitySearchResult {
  parts: PartWithCompatibility[];
  totalResults: number;
  searchedVehicle?: {
    make: string;
    model: string;
    year: number;
  };
  suggestions?: PartSuggestion[];
}

export interface PartWithCompatibility extends Part {
  compatibilityScore: number; // 0-100
  compatibilityNotes?: string;
  isExactMatch: boolean;
  alternativeFor?: string; // ID da peça original
}

export interface PartSuggestion {
  partId: string;
  partName: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export interface VehiclePartsProfile {
  vehicleId: string;
  vehiclePlate: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    engine?: string;
  };
  
  // Peças compatíveis por categoria
  compatiblePartsByCategory: Record<PartCategory, number>;
  
  // Peças recomendadas
  recommendedParts: PartSuggestion[];
  
  // Histórico de peças usadas
  partsHistory: PartUsageRecord[];
  
  // Estatísticas
  totalPartsUsed: number;
  totalSpentOnParts: number;
  mostUsedCategory: PartCategory;
}

export interface PartUsageRecord {
  partId: string;
  partName: string;
  partNumber: string;
  usedAt: Date;
  quantity: number;
  price: number;
  serviceId?: string;
  mileageAtUse?: number;
}

export interface PartAlternative {
  originalPartId: string;
  alternativePartId: string;
  compatibilityLevel: 'exact' | 'equivalent' | 'similar';
  priceDifference: number;
  qualityComparison: 'better' | 'same' | 'lower';
  notes?: string;
}

// Labels em português
export const PART_CATEGORY_LABELS: Record<PartCategory, string> = {
  engine: 'Motor',
  transmission: 'Transmissão',
  brakes: 'Freios',
  suspension: 'Suspensão',
  electrical: 'Elétrica',
  cooling: 'Arrefecimento',
  fuel: 'Combustível',
  exhaust: 'Escape',
  body: 'Carroceria',
  interior: 'Interior',
  filters: 'Filtros',
  oils: 'Óleos e Fluidos',
  tires: 'Pneus',
  accessories: 'Acessórios',
  other: 'Outros',
};

export const COMPATIBILITY_LEVEL_LABELS: Record<PartAlternative['compatibilityLevel'], string> = {
  exact: 'Exata',
  equivalent: 'Equivalente',
  similar: 'Similar',
};

export const QUALITY_COMPARISON_LABELS: Record<PartAlternative['qualityComparison'], string> = {
  better: 'Superior',
  same: 'Igual',
  lower: 'Inferior',
};

// Cores por categoria
export const CATEGORY_COLORS: Record<PartCategory, { bg: string; text: string; icon: string }> = {
  engine: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', icon: 'text-red-500' },
  transmission: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', icon: 'text-purple-500' },
  brakes: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', icon: 'text-orange-500' },
  suspension: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', icon: 'text-amber-500' },
  electrical: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', icon: 'text-yellow-500' },
  cooling: { bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-700 dark:text-cyan-400', icon: 'text-cyan-500' },
  fuel: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', icon: 'text-green-500' },
  exhaust: { bg: 'bg-gray-50 dark:bg-gray-900/20', text: 'text-gray-700 dark:text-gray-400', icon: 'text-gray-500' },
  body: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', icon: 'text-blue-500' },
  interior: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-400', icon: 'text-indigo-500' },
  filters: { bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-700 dark:text-teal-400', icon: 'text-teal-500' },
  oils: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', icon: 'text-emerald-500' },
  tires: { bg: 'bg-slate-50 dark:bg-slate-900/20', text: 'text-slate-700 dark:text-slate-400', icon: 'text-slate-500' },
  accessories: { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-700 dark:text-pink-400', icon: 'text-pink-500' },
  other: { bg: 'bg-neutral-50 dark:bg-neutral-900/20', text: 'text-neutral-700 dark:text-neutral-400', icon: 'text-neutral-500' },
};

// Ícones por categoria (nomes do Lucide)
export const CATEGORY_ICONS: Record<PartCategory, string> = {
  engine: 'Cog',
  transmission: 'Settings2',
  brakes: 'CircleDot',
  suspension: 'ArrowUpDown',
  electrical: 'Zap',
  cooling: 'Thermometer',
  fuel: 'Fuel',
  exhaust: 'Wind',
  body: 'Car',
  interior: 'Armchair',
  filters: 'Filter',
  oils: 'Droplet',
  tires: 'Circle',
  accessories: 'Sparkles',
  other: 'Package',
};

// Marcas populares de veículos
export const POPULAR_MAKES = [
  'Chevrolet',
  'Fiat',
  'Ford',
  'Honda',
  'Hyundai',
  'Jeep',
  'Nissan',
  'Renault',
  'Toyota',
  'Volkswagen',
];

// Marcas populares de peças
export const POPULAR_PART_BRANDS = [
  'Bosch',
  'Continental',
  'Delphi',
  'Denso',
  'Gates',
  'Mann',
  'Mobil',
  'Monroe',
  'NGK',
  'Valeo',
  'Wega',
];
