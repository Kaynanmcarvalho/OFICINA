/**
 * TORQ Vehicle Health - Types
 * Tipos para monitoramento de saúde do veículo
 */

export interface VehicleHealth {
  vehicleId: string;
  vehiclePlate: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    engine?: string;
  };
  
  // Score geral
  overallScore: number; // 0-100
  overallStatus: HealthStatus;
  
  // Scores por sistema
  systemScores: Record<VehicleSystem, SystemHealth>;
  
  // Alertas ativos
  activeAlerts: HealthAlert[];
  
  // Próximas manutenções
  upcomingMaintenance: MaintenanceSchedule[];
  
  // Histórico de scores
  scoreHistory: ScoreHistoryEntry[];
  
  // Metadados
  empresaId: string;
  lastUpdated: Date;
  lastInspection?: Date;
}

export type HealthStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

export type VehicleSystem =
  | 'engine'           // Motor
  | 'transmission'     // Transmissão
  | 'brakes'           // Freios
  | 'suspension'       // Suspensão
  | 'electrical'       // Elétrica
  | 'cooling'          // Arrefecimento
  | 'fuel'             // Combustível
  | 'exhaust'          // Escape
  | 'steering'         // Direção
  | 'tires'            // Pneus
  | 'body'             // Carroceria
  | 'interior';        // Interior

export interface SystemHealth {
  system: VehicleSystem;
  score: number; // 0-100
  status: HealthStatus;
  lastChecked?: Date;
  issues: SystemIssue[];
  recommendations: string[];
}

export interface SystemIssue {
  id: string;
  description: string;
  severity: IssueSeverity;
  detectedAt: Date;
  source: IssueSource;
  resolved: boolean;
  resolvedAt?: Date;
}

export type IssueSeverity = 'info' | 'warning' | 'error' | 'critical';

export type IssueSource =
  | 'obd_scan'         // Scanner OBD
  | 'visual_inspection' // Inspeção visual
  | 'damage_detection' // Detecção de danos
  | 'maintenance_due'  // Manutenção vencida
  | 'user_report'      // Relato do usuário
  | 'system';          // Sistema automático

export interface HealthAlert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  severity: IssueSeverity;
  system?: VehicleSystem;
  
  // Ação recomendada
  actionRequired: boolean;
  actionLabel?: string;
  actionUrl?: string;
  
  // Metadados
  createdAt: Date;
  expiresAt?: Date;
  dismissed: boolean;
  dismissedAt?: Date;
}

export type AlertType =
  | 'maintenance_due'      // Manutenção vencida
  | 'maintenance_upcoming' // Manutenção próxima
  | 'obd_code'            // Código OBD detectado
  | 'damage_detected'     // Dano detectado
  | 'low_score'           // Score baixo
  | 'recall'              // Recall do fabricante
  | 'inspection_due'      // Inspeção vencida
  | 'custom';             // Alerta customizado

export interface MaintenanceSchedule {
  id: string;
  type: MaintenanceType;
  name: string;
  description?: string;
  
  // Agendamento
  dueDate?: Date;
  dueMileage?: number;
  
  // Status
  status: 'upcoming' | 'due' | 'overdue' | 'completed';
  daysUntilDue?: number;
  mileageUntilDue?: number;
  
  // Última realização
  lastPerformed?: Date;
  lastMileage?: number;
  
  // Estimativas
  estimatedCost?: number;
  estimatedTime?: string;
  
  // Prioridade
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export type MaintenanceType =
  | 'oil_change'          // Troca de óleo
  | 'filter_air'          // Filtro de ar
  | 'filter_oil'          // Filtro de óleo
  | 'filter_fuel'         // Filtro de combustível
  | 'filter_cabin'        // Filtro de cabine
  | 'brake_pads'          // Pastilhas de freio
  | 'brake_discs'         // Discos de freio
  | 'brake_fluid'         // Fluido de freio
  | 'coolant'             // Líquido de arrefecimento
  | 'transmission_fluid'  // Fluido de transmissão
  | 'spark_plugs'         // Velas de ignição
  | 'timing_belt'         // Correia dentada
  | 'serpentine_belt'     // Correia do alternador
  | 'battery'             // Bateria
  | 'tires'               // Pneus
  | 'alignment'           // Alinhamento
  | 'balancing'           // Balanceamento
  | 'suspension'          // Suspensão
  | 'ac_service'          // Ar condicionado
  | 'general_inspection'  // Inspeção geral
  | 'other';              // Outro

export interface ScoreHistoryEntry {
  date: Date;
  overallScore: number;
  systemScores: Partial<Record<VehicleSystem, number>>;
  event?: string; // Evento que causou mudança
}

export interface HealthRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: 'maintenance' | 'repair' | 'upgrade' | 'safety';
  estimatedCost?: number;
  estimatedBenefit?: string;
  relatedSystem?: VehicleSystem;
}

// Labels em português
export const HEALTH_STATUS_LABELS: Record<HealthStatus, string> = {
  excellent: 'Excelente',
  good: 'Bom',
  fair: 'Regular',
  poor: 'Ruim',
  critical: 'Crítico',
};

export const VEHICLE_SYSTEM_LABELS: Record<VehicleSystem, string> = {
  engine: 'Motor',
  transmission: 'Transmissão',
  brakes: 'Freios',
  suspension: 'Suspensão',
  electrical: 'Elétrica',
  cooling: 'Arrefecimento',
  fuel: 'Combustível',
  exhaust: 'Escape',
  steering: 'Direção',
  tires: 'Pneus',
  body: 'Carroceria',
  interior: 'Interior',
};

export const ISSUE_SEVERITY_LABELS: Record<IssueSeverity, string> = {
  info: 'Informação',
  warning: 'Atenção',
  error: 'Problema',
  critical: 'Crítico',
};

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  maintenance_due: 'Manutenção Vencida',
  maintenance_upcoming: 'Manutenção Próxima',
  obd_code: 'Código OBD',
  damage_detected: 'Dano Detectado',
  low_score: 'Score Baixo',
  recall: 'Recall',
  inspection_due: 'Inspeção Vencida',
  custom: 'Alerta',
};

export const MAINTENANCE_TYPE_LABELS: Record<MaintenanceType, string> = {
  oil_change: 'Troca de Óleo',
  filter_air: 'Filtro de Ar',
  filter_oil: 'Filtro de Óleo',
  filter_fuel: 'Filtro de Combustível',
  filter_cabin: 'Filtro de Cabine',
  brake_pads: 'Pastilhas de Freio',
  brake_discs: 'Discos de Freio',
  brake_fluid: 'Fluido de Freio',
  coolant: 'Líquido de Arrefecimento',
  transmission_fluid: 'Fluido de Transmissão',
  spark_plugs: 'Velas de Ignição',
  timing_belt: 'Correia Dentada',
  serpentine_belt: 'Correia do Alternador',
  battery: 'Bateria',
  tires: 'Pneus',
  alignment: 'Alinhamento',
  balancing: 'Balanceamento',
  suspension: 'Suspensão',
  ac_service: 'Ar Condicionado',
  general_inspection: 'Inspeção Geral',
  other: 'Outro',
};

// Cores por status
export const HEALTH_STATUS_COLORS: Record<HealthStatus, { bg: string; text: string; ring: string }> = {
  excellent: { bg: 'bg-green-500', text: 'text-green-600 dark:text-green-400', ring: 'ring-green-500' },
  good: { bg: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-500' },
  fair: { bg: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-400', ring: 'ring-yellow-500' },
  poor: { bg: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400', ring: 'ring-orange-500' },
  critical: { bg: 'bg-red-500', text: 'text-red-600 dark:text-red-400', ring: 'ring-red-500' },
};

export const SEVERITY_COLORS: Record<IssueSeverity, { bg: string; text: string; icon: string }> = {
  info: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', icon: 'text-blue-500' },
  warning: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-600 dark:text-yellow-400', icon: 'text-yellow-500' },
  error: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', icon: 'text-orange-500' },
  critical: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', icon: 'text-red-500' },
};

// Ícones por sistema (nomes do Lucide)
export const SYSTEM_ICONS: Record<VehicleSystem, string> = {
  engine: 'Cog',
  transmission: 'Settings2',
  brakes: 'CircleDot',
  suspension: 'ArrowUpDown',
  electrical: 'Zap',
  cooling: 'Thermometer',
  fuel: 'Fuel',
  exhaust: 'Wind',
  steering: 'Navigation',
  tires: 'Circle',
  body: 'Car',
  interior: 'Armchair',
};

// Intervalos de manutenção padrão (em km)
export const DEFAULT_MAINTENANCE_INTERVALS: Record<MaintenanceType, number> = {
  oil_change: 10000,
  filter_air: 15000,
  filter_oil: 10000,
  filter_fuel: 30000,
  filter_cabin: 15000,
  brake_pads: 40000,
  brake_discs: 80000,
  brake_fluid: 40000,
  coolant: 40000,
  transmission_fluid: 60000,
  spark_plugs: 30000,
  timing_belt: 60000,
  serpentine_belt: 60000,
  battery: 50000,
  tires: 50000,
  alignment: 20000,
  balancing: 10000,
  suspension: 80000,
  ac_service: 20000,
  general_inspection: 10000,
  other: 10000,
};
