/**
 * Modal de Detalhes da Previsão de Estoque
 */

import React from 'react';
import { X, TrendingUp, TrendingDown, Minus, AlertTriangle, Package, Calendar } from 'lucide-react';

export default function StockPredictionModal({ prediction, onClose }) {
  const { currentStock, prediction: pred, analysis, trend, seasonality, reorder, alerts } = prediction;

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate();
    return date.toLocaleDateString('pt-BR');
  };

  const getTrendIcon = () => {
    if (trend.direction === 'increasing') return <TrendingUp className="w-5 h-5 text-blue-600" />;
    if (trend.direction === 'decreasing') return <TrendingDown className="w-5 h-5 text-orange-600" />;
    return <Minus className="w-5 h-5 text-gray-600" />;
  };

  const getTrendLabel = () => {
    if (trend.direction === 'increasing') return 'Crescente';
    if (trend.direction === 'decreasing') return 'Decrescente';
    return 'Estável';
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {prediction.productName || `Produto ${prediction.productId}`}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Análise Detalhada de Estoque
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Estoque Atual */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Estoque Atual
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Quantidade</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {currentStock} {prediction.unit}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mínimo</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {prediction.minStock} {prediction.unit}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Máximo</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {prediction.maxStock} {prediction.unit}
                </p>
              </div>
            </div>
          </div>

          {/* Previsão */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Previsão de Fim de Estoque
              </h3>
            </div>
            <div className="text-center mb-4">
              <p className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {pred.daysUntilEmpty}
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                dias restantes
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Data prevista: {formatDate(pred.emptyDate)}
              </p>
            </div>
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Intervalo de confiança (95%):
              </p>
              <p className="text-center text-gray-900 dark:text-white font-medium">
                {pred.confidenceInterval.min} - {pred.confidenceInterval.max} dias
              </p>
            </div>
          </div>

          {/* Análise de Consumo */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Análise de Consumo (90 dias)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Média Diária</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {analysis.avgDailyUsage} {prediction.unit}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mediana</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {analysis.medianDailyUsage} {prediction.unit}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Desvio Padrão</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {analysis.stdDeviation} {prediction.unit}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Máximo Diário</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {analysis.maxDailyUsage} {prediction.unit}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dias com Movimento</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {analysis.daysWithMovement}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dias sem Movimento</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {analysis.daysWithoutMovement}
                </p>
              </div>
            </div>
          </div>

          {/* Tendência */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tendência de Consumo
            </h3>
            <div className="flex items-center gap-4">
              {getTrendIcon()}
              <div className="flex-1">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {getTrendLabel()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Taxa: {(trend.slope * 100).toFixed(2)}% por dia
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Confiança: {(trend.confidence * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>

          {/* Sazonalidade */}
          {seasonality.detected && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Sazonalidade Detectada
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Padrão: {seasonality.pattern === 'weekly' ? 'Semanal' : 'Mensal'}
              </p>
              {seasonality.peakDays.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Dias de pico:
                  </p>
                  <div className="flex gap-2 mt-1">
                    {seasonality.peakDays.map(day => (
                      <span
                        key={day}
                        className="px-2 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded text-xs"
                      >
                        {weekDays[day]}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {seasonality.lowDays.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Dias de baixa:
                  </p>
                  <div className="flex gap-2 mt-1">
                    {seasonality.lowDays.map(day => (
                      <span
                        key={day}
                        className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                      >
                        {weekDays[day]}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sugestão de Reposição */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Sugestão de Reposição
            </h3>
            {reorder.shouldReorder ? (
              <div className="space-y-3">
                <div className="bg-green-100 dark:bg-green-900/40 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                    ⚠️ Recomendamos fazer pedido agora!
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-green-700 dark:text-green-300">Quantidade sugerida</p>
                      <p className="text-lg font-bold text-green-800 dark:text-green-200">
                        {reorder.suggestedQuantity} {prediction.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 dark:text-green-300">Lead time</p>
                      <p className="text-lg font-bold text-green-800 dark:text-green-200">
                        {reorder.leadTime} dias
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Ponto de pedido</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {reorder.reorderPoint} {prediction.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Data do pedido</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(reorder.reorderDate)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Estoque OK. Não é necessário repor no momento.
              </p>
            )}
          </div>

          {/* Alertas */}
          {alerts && alerts.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Alertas
                </h3>
              </div>
              <div className="space-y-2">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="bg-white/50 dark:bg-black/20 rounded-lg p-3"
                  >
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {formatDate(alert.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Fechar
          </button>
          {reorder.shouldReorder && (
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Criar Pedido
            </button>
          )}
        </div>
      </div>
    </div>

}
