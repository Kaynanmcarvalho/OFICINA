/**
 * TORQ Stock Prediction - Prediction Card
 * Card de previsão individual
 */

import React from 'react';
import {
  Package,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Clock,
  ChevronRight,
} from 'lucide-react';
import type { StockPrediction } from '../types';
import { STOCK_STATUS_LABELS, STATUS_COLORS, URGENCY_COLORS, URGENCY_LABELS } from '../types';

interface PredictionCardProps {
  prediction: StockPrediction;
  onClick?: () => void;
  className?: string;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  onClick,
  className = '',
}) => {
  const statusColors = STATUS_COLORS[prediction.status];
  const urgencyColors = URGENCY_COLORS[prediction.urgency];

  const TrendIcon = prediction.usageTrend === 'increasing'
    ? TrendingUp
    : prediction.usageTrend === 'decreasing'
    ? TrendingDown
    : Minus;

  const trendColor = prediction.usageTrend === 'increasing'
    ? 'text-red-500'
    : prediction.usageTrend === 'decreasing'
    ? 'text-green-500'
    : 'text-gray-400';

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
    }).format(date);
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800 rounded-xl border
        ${statusColors.border}
        hover:shadow-md transition-all duration-200 cursor-pointer
        ${className}
      `}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Status indicator */}
          <div className={`p-2 rounded-lg ${statusColors.bg}`}>
            <Package className={`w-5 h-5 ${statusColors.text}`} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                  {prediction.partName}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {prediction.partNumber}
                </p>
              </div>

              {/* Urgência */}
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${urgencyColors.bg} ${urgencyColors.text}`}>
                {URGENCY_LABELS[prediction.urgency]}
              </span>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-3 gap-3 mt-3">
              {/* Estoque atual */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Estoque</p>
                <p className={`text-lg font-bold ${
                  prediction.currentStock <= prediction.minStock
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {prediction.currentStock}
                  <span className="text-xs font-normal text-gray-400 ml-1">
                    / {prediction.minStock}
                  </span>
                </p>
              </div>

              {/* Dias até acabar */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Dias restantes</p>
                <p className={`text-lg font-bold ${
                  prediction.daysUntilStockout <= 3
                    ? 'text-red-600 dark:text-red-400'
                    : prediction.daysUntilStockout <= 7
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {prediction.daysUntilStockout > 99 ? '99+' : prediction.daysUntilStockout}
                </p>
              </div>

              {/* Tendência */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Tendência</p>
                <div className="flex items-center gap-1">
                  <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                  <span className={`text-sm font-medium ${trendColor}`}>
                    {prediction.usageTrend === 'increasing' ? 'Alta' : 
                     prediction.usageTrend === 'decreasing' ? 'Baixa' : 'Estável'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recomendação */}
            {prediction.status !== 'optimal' && prediction.status !== 'excess' && (
              <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs">
                    Comprar <strong>{prediction.recommendedReorderQuantity}</strong> unidades
                    até <strong>{formatDate(prediction.recommendedReorderDate)}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors.bg} ${statusColors.text}`}>
                  {STOCK_STATUS_LABELS[prediction.status]}
                </span>
                <span className="text-xs text-gray-400">
                  Confiança: {prediction.confidenceLevel}%
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
