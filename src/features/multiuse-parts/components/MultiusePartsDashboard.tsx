/**
 * TORQ Multiuse Parts - Dashboard
 * Dashboard de análise de peças multiuso
 */

import React, { useState } from 'react';
import {
  Layers,
  RefreshCw,
  Search,
  Filter,
  Loader2,
  TrendingUp,
  Package,
  DollarSign,
  Zap,
} from 'lucide-react';
import { useMultiuseParts } from '../hooks/useMultiuseParts';
import { MultiusePartCard } from './MultiusePartCard';
import type { MultiuseRank, PartCategory } from '../types';
import {
  MULTIUSE_RANK_LABELS,
  PART_CATEGORY_LABELS,
  RANK_COLORS,
} from '../types';

interface MultiusePartsDashboardProps {
  empresaId: string;
  onPartClick?: (partId: string) => void;
  className?: string;
}

export const MultiusePartsDashboard: React.FC<MultiusePartsDashboardProps> = ({
  empresaId,
  onPartClick,
  className = '',
}) => {
  const {
    analysis,
    filteredParts,
    isLoading,
    isAnalyzing,
    error,
    stats,
    runAnalysis,
    loadAnalysis,
    filterByRank,
    filterByCategory,
    clearError,
  } = useMultiuseParts({ empresaId, autoLoad: true });

  const [selectedRank, setSelectedRank] = useState<MultiuseRank | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<PartCategory | null>(null);

  const handleRankFilter = (rank: MultiuseRank | null) => {
    setSelectedRank(rank);
    filterByRank(rank);
  };

  const handleCategoryFilter = (category: PartCategory | null) => {
    setSelectedCategory(category);
    filterByCategory(category);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Peças Multiuso
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Análise de versatilidade do estoque
              </p>
            </div>
          </div>

          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {isAnalyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {isAnalyzing ? 'Analisando...' : 'Analisar'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
            <Package className="w-5 h-5 text-gray-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalParts}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
            <Layers className="w-5 h-5 text-purple-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.multiuseParts}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400">Multiuso</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
            <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.percentage.toFixed(0)}%
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">Versatilidade</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
            <DollarSign className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(stats.potentialSavings)}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">Economia</p>
          </div>
        </div>
      </div>

      {/* Filtros por Rank */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleRankFilter(null)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              selectedRank === null
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Todas
          </button>
          {(['universal', 'high', 'medium', 'low', 'specific'] as MultiuseRank[]).map((rank) => {
            const colors = RANK_COLORS[rank];
            const isSelected = selectedRank === rank;
            const count = analysis?.byRank[rank] || 0;

            return (
              <button
                key={rank}
                onClick={() => handleRankFilter(isSelected ? null : rank)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  isSelected
                    ? `${colors.bg} ${colors.text}`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {MULTIUSE_RANK_LABELS[rank]}
                <span className="ml-1 opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Erro */}
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

      {/* Lista de Peças */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : filteredParts.length > 0 ? (
          <div className="space-y-3">
            {filteredParts.map((part) => (
              <MultiusePartCard
                key={part.id}
                part={part}
                onClick={() => onPartClick?.(part.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Layers className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              {analysis
                ? 'Nenhuma peça encontrada com os filtros selecionados'
                : 'Execute uma análise para ver as peças multiuso'}
            </p>
          </div>
        )}
      </div>

      {/* Recomendações */}
      {analysis && analysis.recommendations.length > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-100 dark:border-amber-800">
          <h4 className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Recomendações
          </h4>
          <ul className="space-y-1">
            {analysis.recommendations.slice(0, 3).map((rec) => (
              <li key={rec.id} className="text-sm text-amber-600 dark:text-amber-400">
                • {rec.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
