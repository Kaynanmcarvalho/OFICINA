/**
 * Cost Analysis Panel Component
 * Painel de análise de custos para orçamentos
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Info,
  Calculator
} from 'lucide-react';
import costAnalysisService from '../../services/costAnalysisService';
import marginCalculatorService from '../../services/marginCalculatorService';

const CostAnalysisPanel = ({ budgetData, empresaId, onAnalysisComplete }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (budgetData && budgetData.items && budgetData.items.length > 0) {
      analyzeBudget();
    }
  }, [budgetData]);

  const analyzeBudget = async () => {
    setLoading(true);
    try {
      const result = await costAnalysisService.analyzeBudget(budgetData, empresaId);
      setAnalysis(result);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (error) {
      console.error('Error analyzing budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMarginColor = (margin) => {
    if (margin >= 35) return 'text-green-600 dark:text-green-400';
    if (margin >= 20) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getMarginBgColor = (margin) => {
    if (margin >= 35) return 'bg-green-50 dark:bg-green-900/20';
    if (margin >= 20) return 'bg-yellow-50 dark:bg-yellow-900/20';
    return 'bg-red-50 dark:bg-red-900/20';
  };

  const getMarginIcon = (margin) => {
    if (margin >= 35) return <CheckCircle className="w-5 h-5" />;
    if (margin >= 20) return <Info className="w-5 h-5" />;
    return <AlertTriangle className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            Analisando custos...
          </span>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center">
          <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
          <span className="text-sm text-blue-800 dark:text-blue-300">
            Adicione itens ao orçamento para ver a análise de custos
          </span>
        </div>
      </div>
    );
  }

  const { totals, validation, recommendations } = analysis;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getMarginBgColor(totals.margin)}`}>
            <DollarSign className={`w-5 h-5 ${getMarginColor(totals.margin)}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Análise de Custos e Margens
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Margem: {totals.margin.toFixed(2)}% • Lucro: {marginCalculatorService.formatCurrency(totals.profitAmount)}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          {expanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Content */}
      {expanded && (
        <div className="p-4 pt-0 space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Custo Total
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {marginCalculatorService.formatCurrency(totals.cost)}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Preço Total
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {marginCalculatorService.formatCurrency(totals.price)}
              </div>
            </div>

            <div className={`rounded-lg p-3 ${getMarginBgColor(totals.margin)}`}>
              <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                Margem
              </div>
              <div className={`text-lg font-semibold ${getMarginColor(totals.margin)}`}>
                {totals.margin.toFixed(2)}%
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                Lucro
              </div>
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                {marginCalculatorService.formatCurrency(totals.profitAmount)}
              </div>
            </div>
          </div>

          {/* Validation Status */}
          <div className={`flex items-start space-x-3 p-3 rounded-lg ${getMarginBgColor(totals.margin)}`}>
            <div className={getMarginColor(totals.margin)}>
              {getMarginIcon(totals.margin)}
            </div>
            <div className="flex-1">
              <div className={`font-medium ${getMarginColor(totals.margin)}`}>
                {validation.message}
              </div>
              {totals.margin < 20 && (
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Recomendamos revisar os preços para atingir margem mínima de 20%
                </div>
              )}
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Custos Indiretos</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {marginCalculatorService.formatCurrency(totals.indirectCosts)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Margem Média</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {totals.averageMargin.toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Ponto de Equilíbrio</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {marginCalculatorService.formatCurrency(totals.breakEven)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Margem de Lucro</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {totals.profitMargin.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Recommendations */}
          {recommendations && recommendations.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Recomendações
              </div>
              {recommendations.map((rec, index) => (
                <div 
                  key={index}
                  className={`flex items-start space-x-2 p-3 rounded-lg text-sm ${
                    rec.type === 'warning' 
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' 
                      : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  }`}
                >
                  {rec.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {rec.title}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 mt-0.5">
                      {rec.message}
                    </div>
                    {rec.action && (
                      <div className="text-gray-700 dark:text-gray-300 mt-1 font-medium">
                        → {rec.action}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CostAnalysisPanel;
