/**
 * TORQ OBD Scanner - Types
 * Tipos para scanner OBD-II e diagnóstico de falhas
 */

export interface OBDScanResult {
  id: string;
  vehicleId?: string;
  checkinId?: string;
  budgetId?: string;
  scannedAt: Date;
  deviceInfo: OBDDeviceInfo;
  diagnosticCodes: DiagnosticTroubleCode[];
  liveData: LiveDataReading[];
  vehicleInfo: VehicleIdentification;
  summary: DiagnosticSummary;
  scanDuration: number;
}

export interface OBDDeviceInfo {
  deviceId: string;
  deviceName: string;
  protocol: OBDProtocol;
  version: string;
  isConnected: boolean;
  signalStrength?: number;
}

export type OBDProtocol = 
  | 'ISO9141-2'
  | 'ISO14230-4'
  | 'ISO15765-4'
  | 'SAE-J1850-PWM'
  | 'SAE-J1850-VPW'
  | 'AUTO';

export interface DiagnosticTroubleCode {
  code: string;
  description: string;
  severity: DTCSeverity;
  category: DTCCategory;
  system: VehicleSystem;
  status: DTCStatus;
  freezeFrameData?: FreezeFrameData;
  possibleCauses: string[];
  recommendedActions: string[];
  estimatedRepairCost?: {
    min: number;
    max: number;
    currency: string;
  };
}

export type DTCSeverity = 'info' | 'warning' | 'critical';

export type DTCCategory = 
  | 'powertrain'
  | 'body'
  | 'chassis'
  | 'network'
  | 'manufacturer';

export type VehicleSystem =
  | 'engine'
  | 'transmission'
  | 'fuel_system'
  | 'ignition'
  | 'emission'
  | 'cooling'
  | 'exhaust'
  | 'air_intake'
  | 'electrical'
  | 'abs'
  | 'airbag'
  | 'climate'
  | 'security'
  | 'communication'
  | 'other';

export type DTCStatus = 
  | 'active'
  | 'pending'
  | 'permanent'
  | 'history';

export interface FreezeFrameData {
  rpm?: number;
  speed?: number;
  engineLoad?: number;
  coolantTemp?: number;
  fuelTrim?: number;
  timestamp: Date;
  additionalData: Record<string, number>;
}

export interface LiveDataReading {
  parameter: string;
  value: number;
  unit: string;
  description: string;
  normalRange?: {
    min: number;
    max: number;
  };
  status: 'normal' | 'warning' | 'critical';
}

export interface VehicleIdentification {
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
  engine?: string;
  ecuCount?: number;
  supportedProtocols: OBDProtocol[];
}

export interface DiagnosticSummary {
  totalCodes: number;
  bySeverity: Record<DTCSeverity, number>;
  bySystem: Record<VehicleSystem, number>;
  overallHealth: VehicleHealth;
  criticalIssues: string[];
  recommendedActions: string[];
  nextInspectionDate?: Date;
}

export type VehicleHealth = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

export interface OBDScanRequest {
  deviceId?: string;
  vehicleInfo?: {
    plate?: string;
    vin?: string;
    make?: string;
    model?: string;
    year?: number;
  };
  scanType: OBDScanType;
  includeLiveData?: boolean;
  checkinId?: string;
  budgetId?: string;
}

export type OBDScanType = 
  | 'quick'
  | 'full'
  | 'live_only'
  | 'clear';

export interface OBDConnectionState {
  isConnected: boolean;
  isScanning: boolean;
  device: OBDDeviceInfo | null;
  error: string | null;
  progress: number;
  currentStep: string;
}

// Labels em português
export const DTC_SEVERITY_LABELS: Record<DTCSeverity, string> = {
  info: 'Informativo',
  warning: 'Atenção',
  critical: 'Crítico',
};

export const DTC_CATEGORY_LABELS: Record<DTCCategory, string> = {
  powertrain: 'Motor/Transmissão',
  body: 'Carroceria',
  chassis: 'Chassi',
  network: 'Rede/Comunicação',
  manufacturer: 'Fabricante',
};

export const VEHICLE_SYSTEM_LABELS: Record<VehicleSystem, string> = {
  engine: 'Motor',
  transmission: 'Transmissão',
  fuel_system: 'Sistema de Combustível',
  ignition: 'Ignição',
  emission: 'Emissões',
  cooling: 'Arrefecimento',
  exhaust: 'Escape',
  air_intake: 'Admissão de Ar',
  electrical: 'Sistema Elétrico',
  abs: 'ABS',
  airbag: 'Airbag',
  climate: 'Ar Condicionado',
  security: 'Segurança',
  communication: 'Comunicação',
  other: 'Outros',
};

export const HEALTH_LABELS: Record<VehicleHealth, string> = {
  excellent: 'Excelente',
  good: 'Bom',
  fair: 'Regular',
  poor: 'Ruim',
  critical: 'Crítico',
};

export const SEVERITY_COLORS: Record<DTCSeverity, { bg: string; text: string; border: string; icon: string }> = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  warning: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-700 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800',
    icon: 'text-orange-600 dark:text-orange-400',
  },
  critical: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
  },
};

export const HEALTH_COLORS: Record<VehicleHealth, { bg: string; text: string; border: string }> = {
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
