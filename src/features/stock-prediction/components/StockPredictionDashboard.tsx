/**
 * TORQ Stock Prediction - Dashboard
 * Dashboard de previsão de estoque
 */

import React, { useState } from 'react';
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Loader2,
  Clock,
  ShoppingCart,
} from 'lucide-react';
import { useStockPrediction } from '../hooks/useStockPrediction';
import { PredictionCard } from './PredictionCard';
import { ReorderList } from './ReorderList';
import type { StockStatus } from '../types';
import { STOCK_STATUS_LABELS, STATUS_COLORS } from '../types';

interface StockPredictionDashboardProps {
  empresaId: string;
  onItemClick?: (itemId: string) => void;
  className?: string;
}

export const StockPredictionDashboard: React.FC<StockPredictionDashboardProps> = ({
  empresaId,
  onItemClick,
  className = '',
}) => {
  const {
    filteredPredictions,
    reorderSuggestions,
    isLoading,
    error,
    lastUpdated,
    stats,
    refresh,
    filterByStatus,
    searchByName,
    clearError,
  } = useStockPrediction({ empresaId, autoLoad: true });

  const [activeTab, setActiveTab] = useState<'predictions' | 'reorder'>('predictions');
  const [selectedStatus, setSelectedStatus] = useState<StockStatus | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusFilter = (status: StockStatus | null) => {
    setSelectedStatus(status);
    filterByStatus(status);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchByName(value);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Previsão de Estoque
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Atualizado às {formatDate(lastUpdated)}
              </p>
            </div>
          </div>

          <button
            onClick={refresh}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-2">
          {(['critical', 'low', 'optimal', 'excess', 'stockout'] as StockStatus[]).map((status) => {
            const colors = STATUS_COLORS[status];
            const isSelected = selectedStatus === status;
            const count = stats[status];

            return (
              <button
                key={status}
                onClick={() => handleStatusFilter(isSelected ? null : status)}
                className={`p-3 rounded-xl text-center transition-all ${
                  isSelected
                    ? `${colors.bg} ${colors.border} border-2`
                    : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <p className={`text-2xl font-bold ${isSelected ? colors.text : 'text-gray-900 dark:text-white'}`}>
                  {count}
                </p>
                <p className={`text-xs ${isSelected ? colors.text : 'text-gray-500 dark:text-gray-400'}`}>
                  {STOCK_STATUS_LABELS[status]}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('predictions')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'predictions'
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Package className="w-4 h-4 inline mr-2" />
          Previsões ({filteredPredictions.length})
        </button>
        <button
          onClick={() => setActiveTab('reorder')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'reorder'
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <ShoppingCart className="w-4 h-4 inline mr-2" />
          Reposição ({reorderSuggestions.length})
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar por nome da peça..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <button onClick={clearError} className="text-red-400 hover:text-red-600">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : activeTab === 'predictions' ? (
          <div className="space-y-3">
            {filteredPredictions.map((prediction) => (
              <PredictionCard
                key={prediction.stockItemId}
                prediction={prediction}
                onClick={() => onItemClick?.(prediction.stockItemId)}
              />
            ))}

            {filteredPredictions.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhuma previsão encontrada
                </p>
              </div>
            )}
          </div>
        ) : (
          <ReorderList
            suggestions={reorderSuggestions}
            onItemClick={onItemClick}
          />
        )}
      </div>
    </div>
  );
};
