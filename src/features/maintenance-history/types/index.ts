/**
 * TORQ Maintenance History - Types
 * Tipos para histórico de manutenção de veículos
 */

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  empresaId: string;
  
  // Informações do serviço
  serviceDate: Date;
  serviceType: MaintenanceType;
  category: ServiceCategory;
  description: string;
  
  // Detalhes
  mileage: number;
  technician?: string;
  notes?: string;
  
  // Custos
  laborCost: number;
  partsCost: number;
  totalCost: number;
  
  // Peças utilizadas
  partsUsed: PartUsed[];
  
  // Referências
  budgetId?: string;
  checkinId?: string;
  invoiceId?: string;
  
  // Diagnóstico
  obdCodes?: string[];
  damagesRepaired?: string[];
  
  // Próxima manutenção
  nextMaintenanceDate?: Date;
  nextMaintenanceMileage?: number;
  
  // Metadados
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export type MaintenanceType =
  | 'preventive'    // Preventiva
  | 'corrective'    // Corretiva
  | 'predictive'    // Preditiva
  | 'emergency'     // Emergência
  | 'recall'        // Recall
  | 'inspection';   // Inspeção

export type ServiceCategory =
  | 'engine'
  | 'transmission'
  | 'brakes'
  | 'suspension'
  | 'electrical'
  | 'cooling'
  | 'fuel'
  | 'exhaust'
  | 'body'
  | 'interior'
  | 'tires'
  | 'oil_change'
  | 'filters'
  | 'general';

export interface PartUsed {
  id: string;
  name: string;
  partNumber?: string;
  brand?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  warranty?: {
    months: number;
    mileage: number;
  };
}

export interface VehicleMaintenanceProfile {
  vehicleId: string;
  vehiclePlate: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    currentMileage: number;
  };
  
  // Estatísticas
  totalRecords: number;
  totalSpent: number;
  averageCostPerService: number;
  
  // Última manutenção
  lastMaintenance?: MaintenanceRecord;
  
  // Próximas manutenções
  upcomingMaintenance: UpcomingMaintenance[];
  
  // Alertas
  alerts: MaintenanceAlert[];
  
  // Histórico resumido
  maintenanceByCategory: Record<ServiceCategory, number>;
  maintenanceByYear: Record<number, number>;
}

export interface UpcomingMaintenance {
  id: string;
  serviceType: string;
  description: string;
  dueDate?: Date;
  dueMileage?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCost?: number;
  isOverdue: boolean;
}

export interface MaintenanceAlert {
  id: string;
  type: AlertType;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  actionRequired?: string;
  createdAt: Date;
  dismissedAt?: Date;
}

export type AlertType =
  | 'overdue_service'      // Serviço atrasado
  | 'upcoming_service'     // Serviço próximo
  | 'mileage_milestone'    // Marco de quilometragem
  | 'warranty_expiring'    // Garantia expirando
  | 'recall_notice'        // Aviso de recall
  | 'recurring_issue';     // Problema recorrente

export interface MaintenanceSchedule {
  vehicleId: string;
  schedules: ScheduleItem[];
}

export interface ScheduleItem {
  id: string;
  serviceName: string;
  intervalType: 'mileage' | 'time' | 'both';
  mileageInterval?: number;
  timeIntervalMonths?: number;
  lastPerformed?: Date;
  lastMileage?: number;
  nextDue?: Date;
  nextMileage?: number;
  priority: 'low' | 'medium' | 'high';
}

// Labels em português
export const MAINTENANCE_TYPE_LABELS: Record<MaintenanceType, string> = {
  preventive: 'Preventiva',
  corrective: 'Corretiva',
  predictive: 'Preditiva',
  emergency: 'Emergência',
  recall: 'Recall',
  inspection: 'Inspeção',
};

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
  oil_change: 'Troca de Óleo',
  filters: 'Filtros',
  general: 'Geral',
};

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  overdue_service: 'Serviço Atrasado',
  upcoming_service: 'Serviço Próximo',
  mileage_milestone: 'Marco de Quilometragem',
  warranty_expiring: 'Garantia Expirando',
  recall_notice: 'Aviso de Recall',
  recurring_issue: 'Problema Recorrente',
};

// Cores por tipo de manutenção
export const MAINTENANCE_TYPE_COLORS: Record<MaintenanceType, { bg: string; text: string; border: string }> = {
  preventive: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
  },
  corrective: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-700 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800',
  },
  predictive: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  emergency: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
  recall: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
  },
  inspection: {
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    text: 'text-cyan-700 dark:text-cyan-400',
    border: 'border-cyan-200 dark:border-cyan-800',
  },
};

// Cores por severidade de alerta
export const ALERT_SEVERITY_COLORS: Record<'info' | 'warning' | 'critical', { bg: string; text: string; border: string; icon: string }> = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-500',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
    icon: 'text-amber-500',
  },
  critical: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-500',
  },
};
