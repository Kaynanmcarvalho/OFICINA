/**
 * TORQ Vehicle Health - Dashboard
 * Dashboard de saúde do veículo
 */

import React from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Loader2,
  ChevronRight,
  Wrench,
  Bell,
} from 'lucide-react';
import { useVehicleHealth } from '../hooks/useVehicleHealth';
import { HealthScoreRing } from './HealthScoreRing';
import { SystemHealthCard } from './SystemHealthCard';
import type { VehicleHealth, VehicleSystem } from '../types';
import {
  HEALTH_STATUS_LABELS,
  HEALTH_STATUS_COLORS,
  VEHICLE_SYSTEM_LABELS,
} from '../types';

interface VehicleHealthDashboardProps {
  empresaId: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleInfo: VehicleHealth['vehicleInfo'];
  onAlertClick?: (alertId: string) => void;
  onMaintenanceClick?: (scheduleId: string) => void;
  className?: string;
}

export const VehicleHealthDashboard: React.FC<VehicleHealthDashboardProps> = ({
  empresaId,
  vehicleId,
  vehiclePlate,
  vehicleInfo,
  onAlertClick,
  onMaintenanceClick,
  className = '',
}) => {
  const {
    health,
    alerts,
    maintenance,
    isLoading,
    error,
    loadHealth,
    refreshHealth,
    dismissAlert,
    criticalAlerts,
    overdueMaintenance,
    systemsNeedingAttention,
  } = useVehicleHealth({ empresaId });

  // Carregar na montagem
  React.useEffect(() => {
    loadHealth(vehicleId, vehiclePlate, vehicleInfo);
  }, [vehicleId, vehiclePlate, vehicleInfo, loadHealth]);

  if (isLoading && !health) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 ${className}`}>
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          <span className="text-gray-500 dark:text-gray-400">
            Analisando saúde do veículo...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 ${className}`}>
        <div className="flex items-center justify-center gap-3 text-red-500">
          <AlertTriangle className="w-6 h-6" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!health) return null;

  const statusColors = HEALTH_STATUS_COLORS[health.overallStatus];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Saúde do Veículo
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {vehiclePlate} - {vehicleInfo.make} {vehicleInfo.model}
              </p>
            </div>
          </div>

          <button
            onClick={refreshHealth}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Score principal */}
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <HealthScoreRing
            score={health.overallScore}
            status={health.overallStatus}
            size={140}
          />
          <p className={`mt-3 text-lg font-semibold ${statusColors.text}`}>
            {HEALTH_STATUS_LABELS[health.overallStatus]}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {vehicleInfo.mileage.toLocaleString('pt-BR')} km
          </p>
        </div>
      </div>

      {/* Alertas críticos */}
      {criticalAlerts.length > 0 && (
        <div className="px-4 pb-4">
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-700 dark:text-red-400">
                {criticalAlerts.length} alerta{criticalAlerts.length > 1 ? 's' : ''} crítico{criticalAlerts.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-2">
              {criticalAlerts.slice(0, 2).map((alert) => (
                <button
                  key={alert.id}
                  onClick={() => onAlertClick?.(alert.id)}
                  className="w-full text-left p-2 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {alert.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sistemas */}
      <div className="px-4 pb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Sistemas do Veículo
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {(['engine', 'brakes', 'electrical', 'suspension', 'cooling', 'tires'] as VehicleSystem[]).map(
            (system) => {
              const systemHealth = health.systemScores[system];
              if (!systemHealth) return null;

              return (
                <SystemHealthCard
                  key={system}
                  system={system}
                  health={systemHealth}
                  compact
                />
              );
            }
          )}
        </div>
      </div>

      {/* Manutenções */}
      {maintenance.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Próximas Manutenções
            </h4>
            {overdueMaintenance.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                {overdueMaintenance.length} vencida{overdueMaintenance.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {maintenance.slice(0, 3).map((m) => (
              <button
                key={m.id}
                onClick={() => onMaintenanceClick?.(m.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  m.status === 'overdue'
                    ? 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
                    : m.status === 'due'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                    : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className={`w-4 h-4 ${
                    m.status === 'overdue'
                      ? 'text-red-500'
                      : m.status === 'due'
                      ? 'text-yellow-500'
                      : 'text-gray-400'
                  }`} />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {m.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {m.dueMileage
                        ? `${m.dueMileage.toLocaleString('pt-BR')} km`
                        : m.dueDate
                        ? new Intl.DateTimeFormat('pt-BR').format(m.dueDate)
                        : '-'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Última atualização: {new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          }).format(health.lastUpdated)}
        </p>
      </div>
    </div>
  );
};
