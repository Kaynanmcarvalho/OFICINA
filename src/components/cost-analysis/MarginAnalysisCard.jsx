/**
 * Margin Analysis Card Component
 * Card de análise de margens para o Dashboard
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import costAnalysisService from '../../services/costAnalysisService';
import marginCalculatorService from '../../services/marginCalculatorService';

const MarginAnalysisCard = ({ empresaId, period = 30 }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trend, setTrend] = useState(null);

  useEffect(() => {
    loadStats();
  }, [empresaId, period]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const currentStats = await costAnalysisService.calculateMarginStats(empresaId, period);
      const previousStats = await costAnalysisService.calculateMarginStats(empresaId, period * 2);
      
      setStats(currentStats);
      
      // Calcular tendência
      if (previousStats.averageMargin > 0) {
        const change = currentStats.averageMargin - previousStats.averageMargin;
        const percentChange = (change / previousStats.averageMargin) * 100;
        setTrend({
          change,
          percentChange,
          direction: change >= 0 ? 'up' : 'down'
        });
      }
    } catch (error) {
      console.error('Error loading margin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
  );
}

if (!stats || stats.count === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Análise de Margens
          </h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Nenhum orçamento analisado nos últimos {period} dias
        </p>
      </div>
  );
}

const getMarginColor = (margin) => {
    if (margin >= 35) return 'text-green-600 dark:text-green-400';
    if (margin >= 20) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getMarginBgColor = (margin) => {
    if (margin >= 35) return 'bg-green-100 dark:bg-green-900/30';
    if (margin >= 20) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getMarginBgColor(stats.averageMargin)}`}>
            <BarChart3 className={`w-5 h-5 ${getMarginColor(stats.averageMargin)}`} />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Análise de Margens
          </h3>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend.direction === 'up' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {trend.direction === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="font-medium">
              {Math.abs(trend.percentChange).toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Main Metric */}
      <div className="mb-4">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Margem Média ({period} dias)
        </div>
        <div className={`text-3xl font-bold ${getMarginColor(stats.averageMargin)}`}>
          {stats.averageMargin.toFixed(1)}%
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Lucro Total
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {marginCalculatorService.formatCurrency(stats.totalProfit)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Receita Total
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {marginCalculatorService.formatCurrency(stats.totalRevenue)}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {stats.count} orçamento{stats.count !== 1 ? 's' : ''} analisado{stats.count !== 1 ? 's' : ''}
        </div>
        <Link 
          to="/reports/margins"
          className="flex items-center space-x-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <span>Ver detalhes</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default MarginAnalysisCard;
