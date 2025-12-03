/**
 * TORQ Stock Prediction - Reorder List
 * Lista de sugestões de reposição
 */

import React from 'react';
import {
  ShoppingCart,
  AlertCircle,
  Clock,
  DollarSign,
  ChevronRight,
  Package,
} from 'lucide-react';
import type { ReorderSuggestion } from '../types';

interface ReorderListProps {
  suggestions: ReorderSuggestion[];
  onItemClick?: (itemId: string) => void;
  onOrderClick?: (suggestion: ReorderSuggestion) => void;
  className?: string;
}

export const ReorderList: React.FC<ReorderListProps> = ({
  suggestions,
  onItemClick,
  onOrderClick,
  className = '',
}) => {
  const getPriorityColor = (priority: ReorderSuggestion['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-gray-900';
      case 'low':
        return 'bg-green-500 text-white';
    }
  };

  const getPriorityLabel = (priority: ReorderSuggestion['priority']) => {
    switch (priority) {
      case 'urgent': return 'Urgente';
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (suggestions.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400">
          Nenhuma reposição necessária no momento
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Seu estoque está em dia! 🎉
        </p>
      </div>
    );
  }

  // Agrupar por prioridade
  const grouped = suggestions.reduce((acc, s) => {
    if (!acc[s.priority]) acc[s.priority] = [];
    acc[s.priority].push(s);
    return acc;
  }, {} as Record<string, ReorderSuggestion[]>);

  const priorityOrder: ReorderSuggestion['priority'][] = ['urgent', 'high', 'medium', 'low'];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Resumo */}
      <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
            {suggestions.length} itens para reposição
          </span>
        </div>
        <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
          {formatCurrency(suggestions.reduce((sum, s) => sum + s.estimatedCost, 0))}
        </span>
      </div>

      {/* Lista por prioridade */}
      {priorityOrder.map(priority => {
        const items = grouped[priority];
        if (!items || items.length === 0) return null;

        return (
          <div key={priority}>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${getPriorityColor(priority)}`} />
              Prioridade {getPriorityLabel(priority)} ({items.length})
            </h4>

            <div className="space-y-2">
              {items.map((suggestion) => (
                <div
                  key={suggestion.stockItemId}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-sm transition-all"
                >
                  <div className="p-3">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <button
                              onClick={() => onItemClick?.(suggestion.stockItemId)}
                              className="font-medium text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 text-left"
                            >
                              {suggestion.partName}
                            </button>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {suggestion.partNumber}
                              {suggestion.brand && ` • ${suggestion.brand}`}
                            </p>
                          </div>

                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(suggestion.priority)}`}>
                            {getPriorityLabel(suggestion.priority)}
                          </span>
                        </div>

                        {/* Detalhes */}
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <Package className="w-3 h-3" />
                            Atual: <strong className="text-gray-700 dark:text-gray-300">{suggestion.currentStock}</strong>
                          </span>
                          <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            {suggestion.daysUntilStockout} dias
                          </span>
                        </div>

                        {/* Razão */}
                        <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {suggestion.reason}
                        </p>
                      </div>

                      {/* Ação */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          +{suggestion.suggestedQuantity}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatCurrency(suggestion.estimatedCost)}
                        </p>
                        <button
                          onClick={() => onOrderClick?.(suggestion)}
                          className="mt-2 px-3 py-1 text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                        >
                          Pedir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
