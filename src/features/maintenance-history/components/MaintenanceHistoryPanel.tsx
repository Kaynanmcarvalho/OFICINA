/**
 * TORQ Maintenance History - Panel Component
 * Painel de histórico de manutenção
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Calendar,
  Gauge,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Wrench,
  Clock,
  Bell,
  TrendingUp,
  Filter,
  Plus,
} from 'lucide-react';
import type {
  VehicleMaintenanceProfile,
  MaintenanceRecord,
  MaintenanceAlert,
  UpcomingMaintenance,
} from '../types';
import {
  MAINTENANCE_TYPE_LABELS,
  MAINTENANCE_TYPE_COLORS,
  SERVICE_CATEGORY_LABELS,
  ALERT_SEVERITY_COLORS,
} from '../types';

interface MaintenanceHistoryPanelProps {
  profile: VehicleMaintenanceProfile;
  records: MaintenanceRecord[];
  onAddRecord?: () => void;
  onViewRecord?: (record: MaintenanceRecord) => void;
  onScheduleService?: (service: UpcomingMaintenance) => void;
}

export function MaintenanceHistoryPanel({
  profile,
  records,
  onAddRecord,
  onViewRecord,
  onScheduleService,
}: MaintenanceHistoryPanelProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'upcoming' | 'alerts'>('history');
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-white/20">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Histórico de Manutenção</h3>
            <p className="text-sm text-white/80">
              {profile.vehicleInfo.make} {profile.vehicleInfo.model} {profile.vehicleInfo.year}
            </p>
          </div>
          <span className="ml-auto px-3 py-1 rounded-lg bg-white/20 text-sm font-mono">
            {profile.vehiclePlate}
          </span>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Wrench className="w-4 h-4 text-white/70" />
              <span className="text-xs text-white/70">Serviços</span>
            </div>
            <span className="text-xl font-bold">{profile.totalRecords}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-white/70" />
              <span className="text-xs text-white/70">Total Gasto</span>
            </div>
            <span className="text-lg font-bold">{formatCurrency(profile.totalSpent)}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-white/70" />
              <span className="text-xs text-white/70">Média</span>
            </div>
            <span className="text-lg font-bold">{formatCurrency(profile.averageCostPerService)}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Gauge className="w-4 h-4 text-white/70" />
              <span className="text-xs text-white/70">Km Atual</span>
            </div>
            <span className="text-lg font-bold">{profile.vehicleInfo.currentMileage.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Alertas urgentes */}
      {profile.alerts.filter(a => a.severity === 'critical').length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="font-medium text-red-800 dark:text-red-200">
              Atenção Necessária
            </span>
          </div>
          <ul className="space-y-1">
            {profile.alerts
              .filter(a => a.severity === 'critical')
              .map(alert => (
                <li key={alert.id} className="text-sm text-red-700 dark:text-red-300">
                  • {alert.message}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-700">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Histórico ({records.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'upcoming'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Próximas ({profile.upcomingMaintenance.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'alerts'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Alertas ({profile.alerts.length})
          </div>
        </button>
      </div>

      {/* Conteúdo das tabs */}
      <AnimatePresence mode="wait">
        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* Botão adicionar */}
            {onAddRecord && (
              <motion.button
                onClick={onAddRecord}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Registro Manual
              </motion.button>
            )}

            {/* Lista de registros */}
            {records.map(record => (
              <RecordCard
                key={record.id}
                record={record}
                isExpanded={expandedRecordId === record.id}
                onToggle={() => setExpandedRecordId(
                  expandedRecordId === record.id ? null : record.id
                )}
                onView={onViewRecord}
              />
            ))}

            {records.length === 0 && (
              <div className="p-8 text-center">
                <History className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-500 dark:text-neutral-400">
                  Nenhum registro de manutenção encontrado
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'upcoming' && (
          <motion.div
            key="upcoming"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {profile.upcomingMaintenance.map(service => (
              <UpcomingCard
                key={service.id}
                service={service}
                onSchedule={onScheduleService}
              />
            ))}
          </motion.div>
        )}

        {activeTab === 'alerts' && (
          <motion.div
            key="alerts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {profile.alerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}

            {profile.alerts.length === 0 && (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-500 dark:text-neutral-400">
                  Nenhum alerta no momento
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>

}

// Card de registro
function RecordCard({
  record,
  isExpanded,
  onToggle,
  onView,
}: {
  record: MaintenanceRecord;
  isExpanded: boolean;
  onToggle: () => void;
  onView?: (record: MaintenanceRecord) => void;
}) {
  const typeColors = MAINTENANCE_TYPE_COLORS[record.serviceType];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className={`rounded-xl border overflow-hidden bg-white dark:bg-neutral-800 ${typeColors.border}`}>
      <div className="p-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors.bg} ${typeColors.text}`}>
                {MAINTENANCE_TYPE_LABELS[record.serviceType]}
              </span>
              <span className="text-xs text-neutral-500">
                {SERVICE_CATEGORY_LABELS[record.category]}
              </span>
            </div>
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
              {record.description}
            </h4>
            <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(record.serviceDate).toLocaleDateString('pt-BR')}
              </span>
              <span className="flex items-center gap-1">
                <Gauge className="w-3 h-3" />
                {record.mileage.toLocaleString()} km
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {formatCurrency(record.totalCost)}
            </span>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-neutral-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-neutral-400" />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-neutral-200 dark:border-neutral-700"
          >
            <div className="p-4 space-y-3">
              {/* Custos */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/50">
                  <p className="text-xs text-neutral-500">Mão de obra</p>
                  <p className="font-medium">{formatCurrency(record.laborCost)}</p>
                </div>
                <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/50">
                  <p className="text-xs text-neutral-500">Peças</p>
                  <p className="font-medium">{formatCurrency(record.partsCost)}</p>
                </div>
                <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/50">
                  <p className="text-xs text-neutral-500">Total</p>
                  <p className="font-bold">{formatCurrency(record.totalCost)}</p>
                </div>
              </div>

              {/* Peças */}
              {record.partsUsed.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Peças utilizadas:
                  </p>
                  <div className="space-y-1">
                    {record.partsUsed.map(part => (
                      <div key={part.id} className="flex justify-between text-sm">
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {part.quantity}x {part.name}
                        </span>
                        <span>{formatCurrency(part.totalPrice)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Técnico */}
              {record.technician && (
                <p className="text-sm text-neutral-500">
                  Técnico: {record.technician}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

}

// Card de próxima manutenção
function UpcomingCard({
  service,
  onSchedule,
}: {
  service: UpcomingMaintenance;
  onSchedule?: (service: UpcomingMaintenance) => void;
}) {
  const priorityColors = {
    low: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
    high: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
    urgent: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  };

  return (
    <div className={`p-4 rounded-xl border ${service.isOverdue ? 'border-red-300 dark:border-red-700' : 'border-neutral-200 dark:border-neutral-700'} bg-white dark:bg-neutral-800`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[service.priority]}`}>
              {service.priority === 'urgent' ? 'Urgente' : service.priority === 'high' ? 'Alta' : service.priority === 'medium' ? 'Média' : 'Baixa'}
            </span>
            {service.isOverdue && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                Atrasado
              </span>
            )}
          </div>
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
            {service.serviceType}
          </h4>
          <p className="text-sm text-neutral-500 mt-1">
            {service.description}
          </p>
          {service.dueMileage && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Próximo: {service.dueMileage.toLocaleString()} km
            </p>
          )}
        </div>
        {onSchedule && (
          <motion.button
            onClick={() => onSchedule(service)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Agendar
          </motion.button>
        )}
      </div>
    </div>

}

// Card de alerta
function AlertCard({ alert }: { alert: MaintenanceAlert }) {
  const colors = ALERT_SEVERITY_COLORS[alert.severity];

  return (
    <div className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={`w-5 h-5 ${colors.icon} mt-0.5`} />
        <div className="flex-1">
          <h4 className={`font-medium ${colors.text}`}>{alert.title}</h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            {alert.message}
          </p>
          {alert.actionRequired && (
            <p className={`text-sm font-medium ${colors.text} mt-2`}>
              → {alert.actionRequired}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MaintenanceHistoryPanel;
