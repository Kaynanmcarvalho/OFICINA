/**
 * TORQ Damage Detection - Types
 * Tipos para reconhecimento automático de danos em fotos
 */

export interface DamageDetectionResult {
  id: string;
  imageUrl: string;
  analyzedAt: Date;
  damages: DetectedDamage[];
  overallCondition: VehicleCondition;
  confidence: number;
  processingTime: number;
}

export interface DetectedDamage {
  id: string;
  type: DamageType;
  severity: DamageSeverity;
  confidence: number;
  location: DamageLocation;
  boundingBox: BoundingBox;
  description: string;
  estimatedRepairCost?: number;
}

export type DamageType =
  | 'scratch'        // Risco
  | 'dent'           // Amassado
  | 'crack'          // Trinca
  | 'worn_tire'      // Pneu gasto
  | 'misalignment'   // Desalinhamento
  | 'leak'           // Vazamento
  | 'rust'           // Ferrugem
  | 'broken_glass'   // Vidro quebrado
  | 'paint_damage'   // Dano na pintura
  | 'bumper_damage'  // Dano no para-choque
  | 'light_damage'   // Dano em farol/lanterna
  | 'mirror_damage'  // Dano no retrovisor
  | 'other';         // Outro

export type DamageSeverity = 'minor' | 'moderate' | 'severe';

export type VehicleCondition = 'excellent' | 'good' | 'fair' | 'poor';

export interface DamageLocation {
  area: VehicleArea;
  position: string; // Ex: "frontal esquerdo", "lateral direita"
}

export type VehicleArea =
  | 'front'          // Frente
  | 'rear'           // Traseira
  | 'left_side'      // Lateral esquerda
  | 'right_side'     // Lateral direita
  | 'roof'           // Teto
  | 'hood'           // Capô
  | 'trunk'          // Porta-malas
  | 'wheel'          // Roda/Pneu
  | 'windshield'     // Para-brisa
  | 'interior';      // Interior

export interface BoundingBox {
  x: number;      // Posição X (0-100%)
  y: number;      // Posição Y (0-100%)
  width: number;  // Largura (0-100%)
  height: number; // Altura (0-100%)
}

export interface DamageAnalysisRequest {
  imageBase64: string;
  vehicleInfo?: {
    plate?: string;
    brand?: string;
    model?: string;
    year?: number;
  };
  checkinId?: string;
}

export interface DamageReportData {
  checkinId: string;
  vehiclePlate: string;
  vehicleInfo: {
    brand: string;
    model: string;
    year: number;
    color?: string;
  };
  clientName: string;
  inspectionDate: Date;
  inspector?: string;
  photos: DamageDetectionResult[];
  summary: {
    totalDamages: number;
    bySeverity: Record<DamageSeverity, number>;
    byType: Record<string, number>;
    overallCondition: VehicleCondition;
    estimatedTotalCost?: number;
  };
  notes?: string;
}

// Labels em português
export const DAMAGE_TYPE_LABELS: Record<DamageType, string> = {
  scratch: 'Risco',
  dent: 'Amassado',
  crack: 'Trinca',
  worn_tire: 'Pneu Gasto',
  misalignment: 'Desalinhamento',
  leak: 'Vazamento',
  rust: 'Ferrugem',
  broken_glass: 'Vidro Quebrado',
  paint_damage: 'Dano na Pintura',
  bumper_damage: 'Dano no Para-choque',
  light_damage: 'Dano em Farol',
  mirror_damage: 'Dano no Retrovisor',
  other: 'Outro',
};

export const SEVERITY_LABELS: Record<DamageSeverity, string> = {
  minor: 'Leve',
  moderate: 'Moderado',
  severe: 'Grave',
};

export const CONDITION_LABELS: Record<VehicleCondition | 'critical', string> = {
  excellent: 'Excelente',
  good: 'Bom',
  fair: 'Regular',
  poor: 'Ruim',
  critical: 'Crítico',
};

// Cores por condição
export const CONDITION_COLORS: Record<VehicleCondition | 'critical', { bg: string; text: string; border: string }> = {
  excellent: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
  },
  good: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  fair: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
  poor: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-700 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800',
  },
  critical: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
};

export const AREA_LABELS: Record<VehicleArea, string> = {
  front: 'Frente',
  rear: 'Traseira',
  left_side: 'Lateral Esquerda',
  right_side: 'Lateral Direita',
  roof: 'Teto',
  hood: 'Capô',
  trunk: 'Porta-malas',
  wheel: 'Roda/Pneu',
  windshield: 'Para-brisa',
  interior: 'Interior',
};

// Cores por severidade
export const SEVERITY_COLORS: Record<DamageSeverity, { bg: string; text: string; border: string }> = {
  minor: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
  moderate: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-700 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800',
  },
  severe: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
};
