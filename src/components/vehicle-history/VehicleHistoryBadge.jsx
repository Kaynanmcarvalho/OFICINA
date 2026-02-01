/**
 * VehicleHistoryBadge Component
 * Badge visual que indica o status do histórico do veículo
 */

import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useVehicleHistory } from '../../hooks/useVehicleHistory';

export function VehicleHistoryBadge({ placa, onClick }) {
  const { 
    loading, 
    riskLevel, 
    shouldShowAlert,
    hasPendingRecalls,
    history 
  } = useVehicleHistory(placa);

  // Não renderiza se não tem placa
  if (!placa) return null;

  // Loading state
  if (loading) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Verificando...</span>
      </div>
    );
  }

  // Não renderiza se não tem histórico
  if (!history) return null;

  // Determina cor e ícone baseado no risco
  const getBadgeStyle = () => {
    switch (riskLevel) {
      case 'alto':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-700 dark:text-red-400',
          border: 'border-red-200 dark:border-red-800',
          icon: XCircle,
          label: shouldShowAlert ? 'Alerta' : 'Alto Risco'
        };
      case 'medio':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          text: 'text-yellow-700 dark:text-yellow-400',
          border: 'border-yellow-200 dark:border-yellow-800',
          icon: AlertTriangle,
          label: hasPendingRecalls ? `${history.summary.recallsPendentes} Recall${history.summary.recallsPendentes > 1 ? 's' : ''}` : 'Atenção'
        };
      case 'baixo':
      default:
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-700 dark:text-green-400',
          border: 'border-green-200 dark:border-green-800',
          icon: CheckCircle,
          label: 'Limpo'
        };
    }
  };

  const style = getBadgeStyle();
  const Icon = style.icon;

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
        border ${style.border} ${style.bg} ${style.text}
        text-xs font-medium
        transition-all duration-200
        hover:scale-105 hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        cursor-pointer
      `}
      title="Clique para ver histórico completo"
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{style.label}</span>
    </button>
  );
};
