/**
 * TORQ Damage Report - Types
 * Tipos para geração de relatório de danos em PDF
 */

export interface DamageReport {
  id: string;
  checkinId: string;
  vehicleId: string;
  
  // Informações do veículo
  vehicle: {
    plate: string;
    make: string;
    model: string;
    year: number;
    color?: string;
    vin?: string;
  };
  
  // Informações do cliente
  client: {
    name: string;
    document?: string;
    phone?: string;
    email?: string;
  };
  
  // Danos detectados
  damages: ReportDamage[];
  
  // Fotos
  photos: ReportPhoto[];
  
  // Resumo
  summary: DamageSummary;
  
  // Metadados
  empresaId: string;
  createdAt: Date;
  createdBy: string;
  status: ReportStatus;
  
  // PDF
  pdfUrl?: string;
  pdfGeneratedAt?: Date;
}

export interface ReportDamage {
  id: string;
  type: DamageType;
  severity: DamageSeverity;
  location: DamageLocation;
  description: string;
  
  // Detecção
  confidence: number;
  detectedAt: Date;
  photoId?: string;
  
  // Estimativa
  estimatedRepairCost?: number;
  estimatedRepairTime?: string;
  
  // Coordenadas na foto
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export type DamageType =
  | 'scratch'         // Arranhão
  | 'dent'            // Amassado
  | 'crack'           // Trinca
  | 'chip'            // Lasca
  | 'rust'            // Ferrugem
  | 'paint_damage'    // Dano na pintura
  | 'glass_damage'    // Dano no vidro
  | 'bumper_damage'   // Dano no para-choque
  | 'light_damage'    // Dano em farol/lanterna
  | 'mirror_damage'   // Dano no retrovisor
  | 'tire_damage'     // Dano no pneu
  | 'wheel_damage'    // Dano na roda
  | 'other';          // Outro

export type DamageSeverity = 'minor' | 'moderate' | 'severe' | 'critical';

export type DamageLocation =
  | 'front'           // Frente
  | 'rear'            // Traseira
  | 'left_side'       // Lado esquerdo
  | 'right_side'      // Lado direito
  | 'roof'            // Teto
  | 'hood'            // Capô
  | 'trunk'           // Porta-malas
  | 'windshield'      // Para-brisa
  | 'rear_window'     // Vidro traseiro
  | 'left_door'       // Porta esquerda
  | 'right_door'      // Porta direita
  | 'wheel_fl'        // Roda dianteira esquerda
  | 'wheel_fr'        // Roda dianteira direita
  | 'wheel_rl'        // Roda traseira esquerda
  | 'wheel_rr'        // Roda traseira direita
  | 'other';          // Outro

export type ReportStatus = 'draft' | 'generated' | 'sent' | 'signed';

export interface ReportPhoto {
  id: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  takenAt: Date;
  damages: string[]; // IDs dos danos nesta foto
}

export interface DamageSummary {
  totalDamages: number;
  bySeverity: Record<DamageSeverity, number>;
  byType: Record<string, number>;
  byLocation: Record<string, number>;
  
  // Estimativas
  totalEstimatedCost: number;
  totalEstimatedTime: string;
  
  // Condição geral
  overallCondition: 'excellent' | 'good' | 'fair' | 'poor';
  conditionScore: number; // 0-100
  
  // Recomendações
  recommendations: string[];
  urgentRepairs: string[];
}

export interface PDFGenerationOptions {
  includePhotos: boolean;
  includeEstimates: boolean;
  includeRecommendations: boolean;
  includeDiagram: boolean;
  language: 'pt-BR' | 'en-US' | 'es-ES';
  
  // Branding
  companyLogo?: string;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  
  // Layout
  paperSize: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  
  // Assinatura
  includeSignatureField: boolean;
  signatureLabel?: string;
}

export interface PDFGenerationResult {
  success: boolean;
  pdfUrl?: string;
  pdfBlob?: Blob;
  fileName: string;
  pageCount: number;
  generatedAt: Date;
  error?: string;
}

// Labels em português
export const DAMAGE_TYPE_LABELS: Record<DamageType, string> = {
  scratch: 'Arranhão',
  dent: 'Amassado',
  crack: 'Trinca',
  chip: 'Lasca',
  rust: 'Ferrugem',
  paint_damage: 'Dano na Pintura',
  glass_damage: 'Dano no Vidro',
  bumper_damage: 'Dano no Para-choque',
  light_damage: 'Dano em Farol/Lanterna',
  mirror_damage: 'Dano no Retrovisor',
  tire_damage: 'Dano no Pneu',
  wheel_damage: 'Dano na Roda',
  other: 'Outro',
};

export const DAMAGE_SEVERITY_LABELS: Record<DamageSeverity, string> = {
  minor: 'Leve',
  moderate: 'Moderado',
  severe: 'Grave',
  critical: 'Crítico',
};

export const DAMAGE_LOCATION_LABELS: Record<DamageLocation, string> = {
  front: 'Frente',
  rear: 'Traseira',
  left_side: 'Lado Esquerdo',
  right_side: 'Lado Direito',
  roof: 'Teto',
  hood: 'Capô',
  trunk: 'Porta-malas',
  windshield: 'Para-brisa',
  rear_window: 'Vidro Traseiro',
  left_door: 'Porta Esquerda',
  right_door: 'Porta Direita',
  wheel_fl: 'Roda Diant. Esq.',
  wheel_fr: 'Roda Diant. Dir.',
  wheel_rl: 'Roda Tras. Esq.',
  wheel_rr: 'Roda Tras. Dir.',
  other: 'Outro',
};

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  draft: 'Rascunho',
  generated: 'Gerado',
  sent: 'Enviado',
  signed: 'Assinado',
};

export const CONDITION_LABELS: Record<DamageSummary['overallCondition'], string> = {
  excellent: 'Excelente',
  good: 'Bom',
  fair: 'Regular',
  poor: 'Ruim',
};

// Cores por severidade
export const SEVERITY_COLORS: Record<DamageSeverity, { bg: string; text: string; border: string }> = {
  minor: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
  moderate: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800' },
  severe: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
  critical: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
};

// Cores por condição
export const CONDITION_COLORS: Record<DamageSummary['overallCondition'], { bg: string; text: string }> = {
  excellent: { bg: 'bg-green-500', text: 'text-white' },
  good: { bg: 'bg-blue-500', text: 'text-white' },
  fair: { bg: 'bg-yellow-500', text: 'text-gray-900' },
  poor: { bg: 'bg-red-500', text: 'text-white' },
};

// Configuração padrão do PDF
export const DEFAULT_PDF_OPTIONS: PDFGenerationOptions = {
  includePhotos: true,
  includeEstimates: true,
  includeRecommendations: true,
  includeDiagram: true,
  language: 'pt-BR',
  paperSize: 'A4',
  orientation: 'portrait',
  includeSignatureField: true,
  signatureLabel: 'Assinatura do Cliente',
};
