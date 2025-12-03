/**
 * TORQ Multiuse Parts - Types
 * Tipos para análise de peças multiuso (servem em múltiplos veículos)
 */

export interface MultiusePart {
  id: string;
  partId: string;
  partNumber: string;
  name: string;
  brand: string;
  category: PartCategory;
  
  // Compatibilidade
  compatibleVehicles: VehicleCompatibility[];
  totalCompatibleModels: number;
  totalCompatibleYears: number;
  
  // Análise de uso
  usageStats: PartUsageStats;
  
  // Valor comercial
  pricing: PartPricing;
  
  // Score de multiuso
  multiuseScore: number; // 0-100
  multiuseRank: MultiuseRank;
  
  // Metadados
  empresaId: string;
  lastAnalyzed: Date;
}

export interface VehicleCompatibility {
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number;
  engine?: string;
  notes?: string;
  verified: boolean;
}

export interface PartUsageStats {
  totalUsed: number;
  usedInServices: number;
  usedInDifferentVehicles: number;
  averageMonthlyUsage: number;
  
  // Por marca
  usageByMake: Record<string, number>;
  
  // Por modelo
  usageByModel: Record<string, number>;
  
  // Tendência
  usageTrend: 'increasing' | 'stable' | 'decreasing';
  
  // Período
  firstUsed?: Date;
  lastUsed?: Date;
}

export interface PartPricing {
  unitPrice: number;
  costPrice: number;
  margin: number;
  marginPercent: number;
  
  // Comparação de mercado
  marketAverage?: number;
  pricePosition: 'below' | 'average' | 'above';
  
  // Potencial
  revenueGenerated: number;
  profitGenerated: number;
}

export type PartCategory =
  | 'filters'         // Filtros
  | 'brakes'          // Freios
  | 'suspension'      // Suspensão
  | 'electrical'      // Elétrica
  | 'engine'          // Motor
  | 'cooling'         // Arrefecimento
  | 'transmission'    // Transmissão
  | 'steering'        // Direção
  | 'exhaust'         // Escape
  | 'body'            // Carroceria
  | 'oils'            // Óleos
  | 'accessories'     // Acessórios
  | 'other';          // Outros

export type MultiuseRank = 'universal' | 'high' | 'medium' | 'low' | 'specific';

export interface MultiuseAnalysis {
  empresaId: string;
  analyzedAt: Date;
  
  // Resumo
  totalParts: number;
  multiuseParts: number;
  multiusePercentage: number;
  
  // Por rank
  byRank: Record<MultiuseRank, number>;
  
  // Por categoria
  byCategory: Record<PartCategory, CategoryAnalysis>;
  
  // Top peças
  topMultiuseParts: MultiusePart[];
  
  // Recomendações
  recommendations: MultiuseRecommendation[];
  
  // Economia potencial
  potentialSavings: number;
  stockOptimizationPotential: number;
}

export interface CategoryAnalysis {
  category: PartCategory;
  totalParts: number;
  multiuseParts: number;
  multiusePercentage: number;
  averageScore: number;
  topPart?: {
    id: string;
    name: string;
    score: number;
  };
}

export interface MultiuseRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  
  // Detalhes
  relatedParts?: string[];
  potentialSavings?: number;
  actionRequired?: string;
}

export type RecommendationType =
  | 'stock_consolidation'    // Consolidar estoque
  | 'substitute_part'        // Substituir por peça multiuso
  | 'increase_stock'         // Aumentar estoque de peça multiuso
  | 'price_optimization'     // Otimizar preço
  | 'supplier_negotiation';  // Negociar com fornecedor

export interface PartSubstitute {
  originalPartId: string;
  originalPartNumber: string;
  substitutePartId: string;
  substitutePartNumber: string;
  
  // Compatibilidade
  compatibilityLevel: 'exact' | 'equivalent' | 'similar';
  additionalVehicles: number;
  
  // Economia
  priceDifference: number;
  stockSavings: number;
  
  // Notas
  notes?: string;
  verified: boolean;
}

export interface MultiuseSearchRequest {
  // Filtros
  category?: PartCategory;
  minScore?: number;
  rank?: MultiuseRank;
  
  // Veículo específico
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  
  // Ordenação
  sortBy?: 'score' | 'usage' | 'profit' | 'compatibility';
  sortOrder?: 'asc' | 'desc';
  
  // Paginação
  limit?: number;
  offset?: number;
}

// Labels em português
export const PART_CATEGORY_LABELS: Record<PartCategory, string> = {
  filters: 'Filtros',
  brakes: 'Freios',
  suspension: 'Suspensão',
  electrical: 'Elétrica',
  engine: 'Motor',
  cooling: 'Arrefecimento',
  transmission: 'Transmissão',
  steering: 'Direção',
  exhaust: 'Escape',
  body: 'Carroceria',
  oils: 'Óleos e Fluidos',
  accessories: 'Acessórios',
  other: 'Outros',
};

export const MULTIUSE_RANK_LABELS: Record<MultiuseRank, string> = {
  universal: 'Universal',
  high: 'Alta Versatilidade',
  medium: 'Média Versatilidade',
  low: 'Baixa Versatilidade',
  specific: 'Específica',
};

export const RECOMMENDATION_TYPE_LABELS: Record<RecommendationType, string> = {
  stock_consolidation: 'Consolidar Estoque',
  substitute_part: 'Substituir Peça',
  increase_stock: 'Aumentar Estoque',
  price_optimization: 'Otimizar Preço',
  supplier_negotiation: 'Negociar com Fornecedor',
};

// Cores por rank
export const RANK_COLORS: Record<MultiuseRank, { bg: string; text: string; border: string }> = {
  universal: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  high: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
  medium: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  low: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800' },
  specific: { bg: 'bg-gray-50 dark:bg-gray-900/20', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-800' },
};

// Cores por categoria
export const CATEGORY_COLORS: Record<PartCategory, { bg: string; text: string }> = {
  filters: { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-600 dark:text-teal-400' },
  brakes: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
  suspension: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' },
  electrical: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400' },
  engine: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
  cooling: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400' },
  transmission: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
  steering: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' },
  exhaust: { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-600 dark:text-gray-400' },
  body: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  oils: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
  accessories: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400' },
  other: { bg: 'bg-slate-100 dark:bg-slate-900/30', text: 'text-slate-600 dark:text-slate-400' },
};

// Thresholds para ranks
export const MULTIUSE_SCORE_THRESHOLDS = {
  universal: 90,  // 90+ = Universal
  high: 70,       // 70-89 = Alta
  medium: 50,     // 50-69 = Média
  low: 30,        // 30-49 = Baixa
  specific: 0,    // 0-29 = Específica
};
