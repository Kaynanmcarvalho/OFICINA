/**
 * TORQ Multiuse Parts - Part Card
 * Card de exibição de peça multiuso
 */

import React from 'react';
import {
  Layers,
  Car,
  TrendingUp,
  DollarSign,
  ChevronRight,
  Star,
} from 'lucide-react';
import type { MultiusePart } from '../types';
import {
  MULTIUSE_RANK_LABELS,
  PART_CATEGORY_LABELS,
  RANK_COLORS,
  CATEGORY_COLORS,
} from '../types';

interface MultiusePartCardProps {
  part: MultiusePart;
  onClick?: () => void;
  showDetails?: boolean;
  className?: string;
}

export const MultiusePartCard: React.FC<MultiusePartCardProps> = ({
  part,
  onClick,
  showDetails = false,
  className = '',
}) => {
  const rankColors = RANK_COLORS[part.multiuseRank];
  const categoryColors = CATEGORY_COLORS[part.category];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800 rounded-xl border
        ${rankColors.border}
        hover:shadow-md transition-all duration-200 cursor-pointer
        ${className}
      `}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Score Ring */}
          <div className="relative">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${rankColors.bg}`}>
              <span className={`text-lg font-bold ${rankColors.text}`}>
                {part.multiuseScore}
              </span>
            </div>
            {part.multiuseRank === 'universal' && (
              <Star className="absolute -top-1 -right-1 w-5 h-5 text-yellow-500 fill-yellow-500" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                  {part.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {part.partNumber} • {part.brand}
                </p>
              </div>

              {/* Rank Badge */}
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${rankColors.bg} ${rankColors.text}`}>
                {MULTIUSE_RANK_LABELS[part.multiuseRank]}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-sm">
                <Car className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  {part.totalCompatibleModels} modelos
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Layers className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  {part.usageStats.totalUsed} usadas
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  {formatCurrency(part.pricing.unitPrice)}
                </span>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center justify-between mt-3">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryColors.bg} ${categoryColors.text}`}>
                {PART_CATEGORY_LABELS[part.category]}
              </span>

              {/* Trend */}
              {part.usageStats.usageTrend === 'increasing' && (
                <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3 h-3" />
                  Em alta
                </span>
              )}
            </div>

            {/* Details */}
            {showDetails && (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Margem:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">
                      {part.pricing.marginPercent.toFixed(0)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Lucro gerado:</span>
                    <span className="ml-1 font-medium text-green-600 dark:text-green-400">
                      {formatCurrency(part.pricing.profitGenerated)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Veículos diferentes:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">
                      {part.usageStats.usedInDifferentVehicles}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Média mensal:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">
                      {part.usageStats.averageMonthlyUsage.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};
