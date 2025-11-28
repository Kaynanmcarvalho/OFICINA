/**
 * TORQ Stock Prediction - Types
 * Tipos para previsão inteligente de estoque
 */

export interface StockItem {
  id: string;
  partId: string;
  partName: string;
  partNumber: string;
  category: string;
  brand: string;
  
  // Estoque atual
  currentStock: number;
  minStock: number;
  maxStock: number;
  
  // Preços
  unitPrice: number;
  costPrice: number;
  
  // Localização
  location?: string;
  shelf?: string;
  
  // Metadados
  empresaId: string;
  lastUpdated: Date;
  lastPurchase?: Date;
  lastSale?: Date;
}

export interface StockMovement {
  id: string;
  stockItemId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: MovementReason;
  reference?: string; // ID do serviço, compra, etc.
  notes?: string;
  
  // Metadados
  empresaId: string;
  userId: string;
  createdAt: Date;
}

export type MovementReason =
  | 'purchase'        // Compra
  | 'sale'            // Venda
  | 'service'         // Uso em serviço
  | 'return'          // Devolução
  | 'adjustment'      // Ajuste de inventário
  | 'transfer'        // Transferência
  | 'loss'            // Perda/Avaria
  | 'initial';        // Estoque inicial

export interface StockPrediction {
  stockItemId: string;
  partName: string;
  partNumber: string;
  
  // Estoque atual
  currentStock: number;
  minStock: number;
  
  // Previsões
  predictedDemand: number;           // Demanda prevista (próximos 30 dias)
  daysUntilStockout: number;         // Dias até acabar
  recommendedReorderQuantity: number; // Quantidade recomendada para compra
  recommendedReorderDate: Date;       // Data recomendada para compra
  
  // Análise
  averageDailyUsage: number;
  usageTrend: 'increasing' | 'stable' | 'decreasing';
  seasonalityFactor: number;         // 1.0 = normal, >1 = alta temporada
  
  // Confiança
  confidenceLevel: number;           // 0-100%
  dataPoints: number;                // Quantidade de dados usados
  
  // Status
  status: StockStatus;
  urgency: 'critical' | 'high' | 'medium' | 'low';
}

export type StockStatus =
  | 'critical'        // Estoque crítico (abaixo do mínimo)
  | 'low'             // Estoque baixo (próximo do mínimo)
  | 'optimal'         // Estoque ideal
  | 'excess'          // Estoque em excesso
  | 'stockout';       // Sem estoque

export interface DemandForecast {
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  
  // Previsões por período
  forecasts: {
    date: Date;
    predictedDemand: number;
    lowerBound: number;
    upperBound: number;
  }[];
  
  // Métricas
  totalPredictedDemand: number;
  averageDemand: number;
  peakDemand: number;
  peakDate: Date;
}

export interface SeasonalPattern {
  stockItemId: string;
  patterns: {
    month: number;        // 1-12
    dayOfWeek?: number;   // 0-6 (domingo-sábado)
    factor: number;       // Multiplicador (1.0 = normal)
    confidence: number;
  }[];
  
  // Eventos especiais
  specialEvents?: {
    name: string;
    startDate: Date;
    endDate: Date;
    impactFactor: number;
  }[];
}

export interface ReorderSuggestion {
  stockItemId: string;
  partName: string;
  partNumber: string;
  brand: string;
  
  // Situação atual
  currentStock: number;
  minStock: number;
  daysUntilStockout: number;
  
  // Recomendação
  suggestedQuantity: number;
  estimatedCost: number;
  supplier?: string;
  
  // Prioridade
  priority: 'urgent' | 'high' | 'medium' | 'low';
  reason: string;
  
  // Economia
  potentialSavings?: number;
  bulkDiscountAvailable?: boolean;
}

export interface StockAnalytics {
  empresaId: string;
  period: {
    start: Date;
    end: Date;
  };
  
  // Resumo geral
  totalItems: number;
  totalValue: number;
  totalCost: number;
  
  // Status do estoque
  statusBreakdown: Record<StockStatus, number>;
  
  // Movimentação
  totalMovements: number;
  totalIn: number;
  totalOut: number;
  
  // Previsões
  itemsNeedingReorder: number;
  estimatedReorderCost: number;
  
  // Performance
  turnoverRate: number;           // Giro de estoque
  stockoutIncidents: number;      // Vezes que faltou estoque
  averageStockDays: number;       // Dias médios em estoque
  
  // Top items
  topSellingItems: { itemId: string; name: string; quantity: number }[];
  slowMovingItems: { itemId: string; name: string; daysSinceLastSale: number }[];
  criticalItems: { itemId: string; name: string; daysUntilStockout: number }[];
}

export interface PredictionConfig {
  // Período de análise
  historicalDays: number;         // Dias de histórico para análise
  forecastDays: number;           // Dias para previsão
  
  // Parâmetros
  safetyStockDays: number;        // Dias de estoque de segurança
  leadTimeDays: number;           // Tempo de entrega do fornecedor
  
  // Ajustes
  seasonalityEnabled: boolean;
  trendAnalysisEnabled: boolean;
  
  // Alertas
  criticalThresholdDays: number;  // Dias para alerta crítico
  lowThresholdDays: number;       // Dias para alerta baixo
}

// Labels em português
export const MOVEMENT_REASON_LABELS: Record<MovementReason, string> = {
  purchase: 'Compra',
  sale: 'Venda',
  service: 'Uso em Serviço',
  return: 'Devolução',
  adjustment: 'Ajuste',
  transfer: 'Transferência',
  loss: 'Perda/Avaria',
  initial: 'Estoque Inicial',
};

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  critical: 'Crítico',
  low: 'Baixo',
  optimal: 'Ideal',
  excess: 'Excesso',
  stockout: 'Sem Estoque',
};

export const URGENCY_LABELS: Record<StockPrediction['urgency'], string> = {
  critical: 'Crítica',
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa',
};

// Cores por status
export const STATUS_COLORS: Record<StockStatus, { bg: string; text: string; border: string }> = {
  critical: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
  low: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
  optimal: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
  excess: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  stockout: { bg: 'bg-gray-50 dark:bg-gray-900/20', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-800' },
};

export const URGENCY_COLORS: Record<StockPrediction['urgency'], { bg: string; text: string }> = {
  critical: { bg: 'bg-red-500', text: 'text-white' },
  high: { bg: 'bg-orange-500', text: 'text-white' },
  medium: { bg: 'bg-yellow-500', text: 'text-gray-900' },
  low: { bg: 'bg-green-500', text: 'text-white' },
};

// Configuração padrão
export const DEFAULT_PREDICTION_CONFIG: PredictionConfig = {
  historicalDays: 90,
  forecastDays: 30,
  safetyStockDays: 7,
  leadTimeDays: 5,
  seasonalityEnabled: true,
  trendAnalysisEnabled: true,
  criticalThresholdDays: 3,
  lowThresholdDays: 7,
};
