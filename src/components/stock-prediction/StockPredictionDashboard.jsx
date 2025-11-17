/**
 * Dashboard de Previsão de Estoque
 */

import React, { useState } from 'react';
import { useStockPrediction } from '../../hooks/useStockPrediction';
import { AlertTriangle, TrendingUp, Package, Clock } from 'lucide-react';
import StockPredictionCard from './StockPredictionCard';
import StockPredictionModal from './StockPredictionModal';

export default function StockPredictionDashboard() {
  const { predictions, criticalProducts, loading, error, refresh } = useStockPrediction();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filter, setFilter] = useState('all'); // all, critical, low, ok

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">Erro: {error}</p>
      </div>
    );
  }

  // Calcular estatísticas
  const stats = {
    critical: predictions.filter(p => p.prediction.daysUntilEmpty > 0 && p.prediction.daysUntilEmpty < 3).length,
    low: predictions.filter(p => p.prediction.daysUntilEmpty >= 3 && p.prediction.daysUntilEmpty < 7).length,
    ok: predictions.filter(p => p.prediction.daysUntilEmpty >= 7).length,
    noMovement: predictions.filter(p => p.analysis.daysWithoutMovement > 30).length
  };

  // Filtrar produtos
  const filteredPredictions = predictions.filter(p => {
    if (filter === 'critical') return p.prediction.daysUntilEmpty > 0 && p.prediction.daysUntilEmpty < 3;
    if (filter === 'low') return p.prediction.daysUntilEmpty >= 3 && p.prediction.daysUntilEmpty < 7;
    if (filter === 'ok') return p.prediction.daysUntilEmpty >= 7;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Previsão de Estoque
        </h2>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Atualizar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 dark:text-red-400">Críticos</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.critical}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">Baixos</p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.low}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">OK</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.ok}</p>
            </div>
            <Package className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Parados</p>
              <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{stats.noMovement}</p>
            </div>
            <Clock className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('critical')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'critical'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Críticos
        </button>
        <button
          onClick={() => setFilter('low')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'low'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Baixos
        </button>
        <button
          onClick={() => setFilter('ok')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'ok'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          OK
        </button>
      </div>

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPredictions.map(prediction => (
          <StockPredictionCard
            key={prediction.id}
            prediction={prediction}
            onClick={() => setSelectedProduct(prediction)}
          />
        ))}
      </div>

      {filteredPredictions.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Nenhum produto encontrado com este filtro
          </p>
        </div>
      )}

      {/* Modal de Detalhes */}
      {selectedProduct && (
        <StockPredictionModal
          prediction={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
