/**
 * TORQ Vehicle Health - System Health Card
 * Card de saúde de um sistema do veículo
 */

import React from 'react';
import {
  Cog,
  Settings2,
  CircleDot,
  ArrowUpDown,
  Zap,
  Thermometer,
  Fuel,
  Wind,
  Navigation,
  Circle,
  Car,
  Armchair,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import type { VehicleSystem, SystemHealth } from '../types';
import {
  VEHICLE_SYSTEM_LABELS,
  HEALTH_STATUS_COLORS,
  HEALTH_STATUS_LABELS,
} from '../types';

interface SystemHealthCardProps {
  system: VehicleSystem;
  health: SystemHealth;
  compact?: boolean;
  onClick?: () => void;
  className?: string;
}

const SYSTEM_ICONS: Record<VehicleSystem, React.ElementType> = {
  engine: Cog,
  transmission: Settings2,
  brakes: CircleDot,
  suspension: ArrowUpDown,
  electrical: Zap,
  cooling: Thermometer,
  fuel: Fuel,
  exhaust: Wind,
  steering: Navigation,
  tires: Circle,
  body: Car,
  interior: Armchair,
};

export const SystemHealthCard: React.FC<SystemHealthCardProps> = ({
  system,
  health,
  compact = false,
  onClick,
  className = '',
}) => {
  const Icon = SYSTEM_ICONS[system];
  const colors = HEALTH_STATUS_COLORS[health.status];
  const hasIssues = health.issues.length > 0;

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`
          p-3 rounded-xl text-center transition-all
          ${hasIssues ? 'ring-2 ring-offset-2 ' + colors.ring : ''}
          bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700
          ${className}
        `}
      >
        <div className="flex flex-col items-center gap-1">
          <div className={`p-2 rounded-lg ${
            health.status === 'excellent' || health.status === 'good'
              ? 'bg-green-100 dark:bg-green-900/30'
              : health.status === 'fair'
              ? 'bg-yellow-100 dark:bg-yellow-900/30'
              : 'bg-red-100 dark:bg-red-900/30'
          }`}>
            <Icon className={`w-4 h-4 ${colors.text}`} />
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400 truncate w-full">
            {VEHICLE_SYSTEM_LABELS[system]}
          </span>
          <span className={`text-sm font-bold ${colors.text}`}>
            {health.score}
          </span>
        </div>
      </button>
  );
}

return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700
        hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-md
        transition-all cursor-pointer
        ${className}
      `}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              health.status === 'excellent' || health.status === 'good'
                ? 'bg-green-100 dark:bg-green-900/30'
                : health.status === 'fair'
                ? 'bg-yellow-100 dark:bg-yellow-900/30'
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              <Icon className={`w-5 h-5 ${colors.text}`} />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {VEHICLE_SYSTEM_LABELS[system]}
              </h4>
              <p className={`text-sm ${colors.text}`}>
                {HEALTH_STATUS_LABELS[health.status]}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className={`text-2xl font-bold ${colors.text}`}>
              {health.score}
            </span>
            <span className="text-xs text-gray-400">/100</span>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="mt-3 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${colors.bg}`}
            style={{ width: `${health.score}%` }}
          />
        </div>

        {/* Issues */}
        {health.issues.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">
                {health.issues.length} problema{health.issues.length > 1 ? 's' : ''} detectado{health.issues.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {health.recommendations.length > 0 && health.issues.length === 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {health.recommendations[0]}
            </p>
          </div>
        )}

        {/* All good */}
        {health.issues.length === 0 && health.recommendations.length === 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Sistema em bom estado</span>
            </div>
          </div>
        )}
      </div>
    </div>

};
