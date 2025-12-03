/**
 * TORQ Service Suggestion - Types
 * Tipos para sugestão automática de serviços
 */

export interface ServiceSuggestion {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  priority: SuggestionPriority;
  source: SuggestionSource;
  confidence: number; // 0-100
  estimatedTime: number; // minutos
  estimatedCost: {
    labor: number;
    parts: number;
    total: number;
    currency: string;
  };
  relatedParts: SuggestedPart[];
  relatedDTCs?: string[];
  relatedDamages?: string[];
  notes?: string;
}

export type ServiceCategory =
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
  | 'tires'            // Pneus
  | 'maintenance'      // Manutenção
  | 'diagnostic'       // Diagnóstico
  | 'other';

export type SuggestionPriority = 'urgent' | 'high' | 'medium' | 'low';

export type SuggestionSource = 
  | 'obd_scan'         // Scanner OBD-II
  | 'damage_detection' // Detecção de danos
  | 'mileage'          // Quilometragem
  | 'time'             // Tempo desde última manutenção
  | 'customer_request' // Solicitação do cliente
  | 'inspection'       // Inspeção visual
  | 'ai_analysis';     // Análise de IA

export interface SuggestedPart {
  id: string;
  name: string;
  partNumber?: string;
  brand?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  availability: 'in_stock' | 'order' | 'unavailable';
  alternatives?: AlternativePart[];
}

export interface AlternativePart {
  id: string;
  name: string;
  partNumber?: string;
  brand: string;
  unitPrice: number;
  quality: 'original' | 'premium' | 'standard' | 'economy';
}

export interface SuggestionRequest {
  vehicleInfo: {
    plate?: string;
    make?: string;
    model?: string;
    year?: number;
    mileage?: number;
    lastServiceDate?: Date;
  };
  obdCodes?: string[];
  detectedDamages?: DetectedDamageInput[];
  customerComplaints?: string[];
  inspectionNotes?: string;
}

export interface DetectedDamageInput {
  type: string;
  severity: 'minor' | 'moderate' | 'severe';
  location?: string;
}

export interface SuggestionResult {
  id: string;
  generatedAt: Date;
  vehicleInfo: SuggestionRequest['vehicleInfo'];
  suggestions: ServiceSuggestion[];
  summary: SuggestionSummary;
  aiInsights?: string[];
}

export interface SuggestionSummary {
  totalSuggestions: number;
  byPriority: Record<SuggestionPriority, number>;
  byCategory: Record<ServiceCategory, number>;
  totalEstimatedCost: number;
  totalEstimatedTime: number;
  urgentIssues: string[];
}

// Mapeamento de códigos DTC para serviços
export interface DTCServiceMapping {
  dtcPattern: string; // Regex pattern
  services: string[];
  parts: string[];
  priority: SuggestionPriority;
  description: string;
}

// Labels em português
export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
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
  tires: 'Pneus',
  maintenance: 'Manutenção',
  diagnostic: 'Diagnóstico',
  other: 'Outros',
};

export const PRIORITY_LABELS: Record<SuggestionPriority, string> = {
  urgent: 'Urgente',
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa',
};

export const SOURCE_LABELS: Record<SuggestionSource, string> = {
  obd_scan: 'Scanner OBD',
  damage_detection: 'Detecção de Danos',
  mileage: 'Quilometragem',
  time: 'Tempo',
  customer_request: 'Solicitação do Cliente',
  inspection: 'Inspeção Visual',
  ai_analysis: 'Análise de IA',
};

// Cores por prioridade
export const PRIORITY_COLORS: Record<SuggestionPriority, { bg: string; text: string; border: string }> = {
  urgent: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
  high: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-700 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800',
  },
  medium: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
  low: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
};

// Cores por categoria
export const CATEGORY_COLORS: Record<ServiceCategory, string> = {
  engine: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  transmission: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  brakes: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  suspension: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  electrical: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  cooling: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  fuel: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  exhaust: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  body: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  interior: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  tires: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
  maintenance: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  diagnostic: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  other: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-900/30 dark:text-neutral-400',
};
