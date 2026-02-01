/**
 * Card de Previsão de Estoque
 */

import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Package } from 'lucide-react';

export default function StockPredictionCard({ prediction, onClick }) {
  const { currentStock, prediction: pred, analysis, trend, alerts } = prediction;

  // Determinar severidade
  const getSeverity = () => {
    if (pred.daysUntilEmpty < 3) return 'critical';
    if (pred.daysUntilEmpty < 7) return 'warning';
    return 'ok';
  };

  const severity = getSeverity();

  const severityColors = {
    critical: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    ok: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
  };

  const severityTextColors = {
    critical: 'text-red-700 dark:text-red-300',
    warning: 'text-yellow-700 dark:text-yellow-300',
    ok: 'text-green-700 dark:text-green-300'
  };

  const getTrendIcon = () => {
    if (trend.direction === 'increasing') return <TrendingUp className="w-4 h-4" />;
    if (trend.direction === 'decreasing') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate();
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div
      onClick={onClick}
      className={`${severityColors[severity]} border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            {prediction.productName || `Produto ${prediction.productId}`}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Estoque: {currentStock} {prediction.unit}
          </p>
        </div>
        {severity === 'critical' && (
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
        )}
      </div>

      {/* Previsão */}
      <div className={`text-center py-3 mb-3 rounded-lg bg-white/50 dark:bg-black/20`}>
        <p className={`text-3xl font-bold ${severityTextColors[severity]}`}>
          {pred.daysUntilEmpty}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          dias restantes
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          até {formatDate(pred.emptyDate)}
        </p>
      </div>

      {/* Estatísticas */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Média diária:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {analysis.avgDailyUsage} {prediction.unit}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Tendência:</span>
          <span className="flex items-center gap-1 font-medium text-gray-900 dark:text-white">
            {getTrendIcon()}
            {trend.direction === 'increasing' && '+'}
            {trend.direction === 'decreasing' && '-'}
            {trend.direction === 'stable' && '='}
          </span>
        </div>
      </div>

      {/* Alertas */}
      {alerts && alerts.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {alerts[0].message}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          Ver detalhes →
        </button>
      </div>
    </div>

}
