/**
 * TORQ Parts Compatibility - Part Card
 * Card de exibição de peça
 */

import React from 'react';
import {
  Package,
  Check,
  AlertTriangle,
  Tag,
  Warehouse,
  ChevronRight,
} from 'lucide-react';
import type { PartWithCompatibility } from '../types';
import { PART_CATEGORY_LABELS, CATEGORY_COLORS } from '../types';

interface PartCardProps {
  part: PartWithCompatibility;
  onClick?: () => void;
  showDetails?: boolean;
  highlight?: boolean;
  className?: string;
}

export const PartCard: React.FC<PartCardProps> = ({
  part,
  onClick,
  showDetails = false,
  highlight = false,
  className = '',
}) => {
  const categoryColor = CATEGORY_COLORS[part.category];
  const hasStock = part.stockQuantity && part.stockQuantity > 0;
  const lowStock = part.stockQuantity && part.minStock && part.stockQuantity <= part.minStock;

  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800 rounded-xl border 
        ${highlight 
          ? 'border-green-200 dark:border-green-800 ring-2 ring-green-100 dark:ring-green-900/30' 
          : 'border-gray-100 dark:border-gray-700'
        }
        hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md
        transition-all duration-200 cursor-pointer
        ${className}
      `}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Ícone da categoria */}
          <div className={`p-2 rounded-lg ${categoryColor.bg}`}>
            <Package className={`w-5 h-5 ${categoryColor.icon}`} />
          </div>

          {/* Info principal */}
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

              {/* Score de compatibilidade */}
              <div className="flex items-center gap-1">
                {part.isExactMatch ? (
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
                    <Check className="w-3 h-3" />
                    100%
                  </span>
                ) : part.compatibilityScore >= 80 ? (
                  <span className="flex items-center gap-1 px-2 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 text-xs font-medium rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    {part.compatibilityScore}%
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-medium rounded-full">
                    {part.compatibilityScore}%
                  </span>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryColor.bg} ${categoryColor.text}`}>
                {PART_CATEGORY_LABELS[part.category]}
              </span>

              {hasStock ? (
                <span className={`flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                  lowStock
                    ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                    : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                }`}>
                  <Warehouse className="w-3 h-3" />
                  {part.stockQuantity} un.
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                  <Warehouse className="w-3 h-3" />
                  Sem estoque
                </span>
              )}
            </div>

            {/* Notas de compatibilidade */}
            {part.compatibilityNotes && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                ⚠️ {part.compatibilityNotes}
              </p>
            )}

            {/* Descrição */}
            {showDetails && part.description && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {part.description}
              </p>
            )}
          </div>

          {/* Preço e ação */}
          <div className="text-right flex flex-col items-end">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              R$ {part.price.toFixed(2)}
            </p>
            {part.costPrice && (
              <p className="text-xs text-gray-400">
                Custo: R$ {part.costPrice.toFixed(2)}
              </p>
            )}
            <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
};
