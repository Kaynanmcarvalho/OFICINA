/**
 * TORQ Vehicle History - Types
 * Tipos para histórico completo do veículo
 */

export interface VehicleHistoryRecord {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  empresaId: string;
  
  // Tipo de evento
  eventType: VehicleEventType;
  eventDate: Date;
  
  // Detalhes do evento
  title: string;
  description: string;
  
  // Quilometragem no momento
  mileage?: number;
  
  // Referências
  checkinId?: string;
  budgetId?: string;
  maintenanceId?: string;
  invoiceId?: string;
  
  // Dados específicos por tipo
  eventData?: Record<string, unknown>;
  
  // Anexos
  attachments?: VehicleAttachment[];
  
  // Metadados
  createdAt: Date;
  createdBy: string;
  source: EventSource;
}

export type VehicleEventType =
  | 'checkin'           // Check-in
  | 'checkout'          // Check-out
  | 'maintenance'       // Manutenção realizada
  | 'budget'            // Orçamento criado
  | 'budget_approved'   // Orçamento aprovado
  | 'budget_rejected'   // Orçamento rejeitado
  | 'damage_detected'   // Dano detectado
  | 'damage_repaired'   // Dano reparado
  | 'obd_scan'          // Scan OBD realizado
  | 'dtc_detected'      // Código de falha detectado
  | 'dtc_cleared'       // Código de falha limpo
  | 'recall'            // Recall
  | 'inspection'        // Inspeção
  | 'mileage_update'    // Atualização de km
  | 'owner_change'      // Mudança de proprietário
  | 'note'              // Observação
  | 'photo'             // Foto adicionada
  | 'document';         // Documento adicionado

export type EventSource =
  | 'system'            // Sistema automático
  | 'user'              // Usuário manual
  | 'obd'               // Scanner OBD
  | 'ai'                // Análise de IA
  | 'import';           // Importação

export interface VehicleAttachment {
  id: string;
  type: 'image' | 'document' | 'video';
  url: string;
  name: string;
  size: number;
  uploadedAt: Date;
}

export interface VehicleProfile {
  // Identificação
  id: string;
  plate: string;
  vin?: string;
  
  // Informações do veículo
  make: string;
  model: string;
  year: number;
  color?: string;
  engine?: string;
  transmission?: 'manual' | 'automatic' | 'cvt';
  fuelType?: 'gasoline' | 'ethanol' | 'flex' | 'diesel' | 'electric' | 'hybrid';
  
  // Proprietário atual
  currentOwnerId?: string;
  currentOwnerName?: string;
  
  // Quilometragem
  currentMileage: number;
  lastMileageUpdate?: Date;
  averageMonthlyMileage?: number;
  
  // Estatísticas
  stats: VehicleStats;
  
  // Última atividade
  lastActivity?: VehicleHistoryRecord;
  
  // Alertas ativos
  activeAlerts: VehicleAlert[];
  
  // Metadados
  createdAt: Date;
  updatedAt: Date;
  empresaId: string;
}

export interface VehicleStats {
  totalCheckins: number;
  totalMaintenances: number;
  totalBudgets: number;
  totalSpent: number;
  averageServiceCost: number;
  lastServiceDate?: Date;
  daysSinceLastService?: number;
  damagesDetected: number;
  damagesRepaired: number;
  obdScansPerformed: number;
  dtcCodesFound: number;
}

export interface VehicleAlert {
  id: string;
  type: AlertType;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  createdAt: Date;
  dismissedAt?: Date;
  actionUrl?: string;
}

export type AlertType =
  | 'maintenance_due'       // Manutenção pendente
  | 'mileage_milestone'     // Marco de km
  | 'dtc_active'            // Código de falha ativo
  | 'damage_unrepaired'     // Dano não reparado
  | 'recall_pending'        // Recall pendente
  | 'inspection_due'        // Inspeção vencida
  | 'warranty_expiring';    // Garantia expirando

export interface VehicleTimelineFilter {
  eventTypes?: VehicleEventType[];
  startDate?: Date;
  endDate?: Date;
  sources?: EventSource[];
  searchQuery?: string;
}

// Labels em português
export const EVENT_TYPE_LABELS: Record<VehicleEventType, string> = {
  checkin: 'Check-in',
  checkout: 'Check-out',
  maintenance: 'Manutenção',
  budget: 'Orçamento',
  budget_approved: 'Orçamento Aprovado',
  budget_rejected: 'Orçamento Rejeitado',
  damage_detected: 'Dano Detectado',
  damage_repaired: 'Dano Reparado',
  obd_scan: 'Scan OBD',
  dtc_detected: 'Código de Falha',
  dtc_cleared: 'Código Limpo',
  recall: 'Recall',
  inspection: 'Inspeção',
  mileage_update: 'Atualização de KM',
  owner_change: 'Mudança de Proprietário',
  note: 'Observação',
  photo: 'Foto',
  document: 'Documento',
};

export const SOURCE_LABELS: Record<EventSource, string> = {
  system: 'Sistema',
  user: 'Usuário',
  obd: 'Scanner OBD',
  ai: 'Análise IA',
  import: 'Importação',
};

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  maintenance_due: 'Manutenção Pendente',
  mileage_milestone: 'Marco de Quilometragem',
  dtc_active: 'Código de Falha Ativo',
  damage_unrepaired: 'Dano Não Reparado',
  recall_pending: 'Recall Pendente',
  inspection_due: 'Inspeção Vencida',
  warranty_expiring: 'Garantia Expirando',
};

// Cores por tipo de evento
export const EVENT_TYPE_COLORS: Record<VehicleEventType, { bg: string; text: string; icon: string }> = {
  checkin: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', icon: 'text-blue-500' },
  checkout: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', icon: 'text-green-500' },
  maintenance: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', icon: 'text-emerald-500' },
  budget: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', icon: 'text-purple-500' },
  budget_approved: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', icon: 'text-green-500' },
  budget_rejected: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', icon: 'text-red-500' },
  damage_detected: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', icon: 'text-orange-500' },
  damage_repaired: { bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-700 dark:text-teal-400', icon: 'text-teal-500' },
  obd_scan: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-400', icon: 'text-indigo-500' },
  dtc_detected: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', icon: 'text-red-500' },
  dtc_cleared: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', icon: 'text-green-500' },
  recall: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', icon: 'text-amber-500' },
  inspection: { bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-700 dark:text-cyan-400', icon: 'text-cyan-500' },
  mileage_update: { bg: 'bg-gray-50 dark:bg-gray-900/20', text: 'text-gray-700 dark:text-gray-400', icon: 'text-gray-500' },
  owner_change: { bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-700 dark:text-violet-400', icon: 'text-violet-500' },
  note: { bg: 'bg-slate-50 dark:bg-slate-900/20', text: 'text-slate-700 dark:text-slate-400', icon: 'text-slate-500' },
  photo: { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-700 dark:text-pink-400', icon: 'text-pink-500' },
  document: { bg: 'bg-sky-50 dark:bg-sky-900/20', text: 'text-sky-700 dark:text-sky-400', icon: 'text-sky-500' },
};

// Ícones por tipo de evento (nomes do Lucide)
export const EVENT_TYPE_ICONS: Record<VehicleEventType, string> = {
  checkin: 'LogIn',
  checkout: 'LogOut',
  maintenance: 'Wrench',
  budget: 'FileText',
  budget_approved: 'CheckCircle',
  budget_rejected: 'XCircle',
  damage_detected: 'AlertTriangle',
  damage_repaired: 'CheckCircle2',
  obd_scan: 'Scan',
  dtc_detected: 'AlertOctagon',
  dtc_cleared: 'ShieldCheck',
  recall: 'Bell',
  inspection: 'ClipboardCheck',
  mileage_update: 'Gauge',
  owner_change: 'UserCheck',
  note: 'StickyNote',
  photo: 'Camera',
  document: 'FileText',
};
