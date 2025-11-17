/**
 * Margin Calculator Component
 * Calculadora interativa de margem e preço
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Percent, TrendingUp } from 'lucide-react';
import marginCalculatorService from '../../services/marginCalculatorService';

const MarginCalculator = ({ initialCost = 0, initialPrice = 0, onPriceChange }) => {
  const [cost, setCost] = useState(initialCost);
  const [price, setPrice] = useState(initialPrice);
  const [targetMargin, setTargetMargin] = useState(35);
  const [mode, setMode] = useState('margin'); // 'margin' or 'price'

  useEffect(() => {
    setCost(initialCost);
  }, [initialCost]);

  useEffect(() => {
    setPrice(initialPrice);
  }, [initialPrice]);

  const handleCostChange = (value) => {
    const newCost = parseFloat(value) || 0;
    setCost(newCost);
    
    if (mode === 'margin' && targetMargin > 0) {
      const suggestedPrice = marginCalculatorService.suggestPrice(newCost, targetMargin);
      setPrice(suggestedPrice);
      if (onPriceChange) onPriceChange(suggestedPrice);
    }
  };

  const handlePriceChange = (value) => {
    const newPrice = parseFloat(value) || 0;
    setPrice(newPrice);
    if (onPriceChange) onPriceChange(newPrice);
  };

  const handleMarginChange = (value) => {
    const newMargin = parseFloat(value) || 0;
    setTargetMargin(newMargin);
    
    if (cost > 0) {
      const suggestedPrice = marginCalculatorService.suggestPrice(cost, newMargin);
      setPrice(suggestedPrice);
      if (onPriceChange) onPriceChange(suggestedPrice);
    }
  };

  const applyMargin = () => {
    if (cost > 0 && targetMargin > 0) {
      const suggestedPrice = marginCalculatorService.suggestPrice(cost, targetMargin);
      setPrice(suggestedPrice);
      if (onPriceChange) onPriceChange(suggestedPrice);
    }
  };

  const currentMargin = marginCalculatorService.calculateMargin(cost, price);
  const currentMarkup = marginCalculatorService.calculateMarkup(cost, price);
  const profit = marginCalculatorService.calculateProfit(cost, price);
  const roi = marginCalculatorService.calculateROI(cost, profit);

  const getMarginColor = (margin) => {
    if (margin >= 35) return 'text-green-600 dark:text-green-400';
    if (margin >= 20) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Calculadora de Margem
        </h3>
      </div>

      {/* Mode Toggle */}
      <div className="flex space-x-2">
        <button
          onClick={() => setMode('margin')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'margin'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Por Margem
        </button>
        <button
          onClick={() => setMode('price')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'price'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Por Preço
        </button>
      </div>

      {/* Inputs */}
      <div className="space-y-3">
        {/* Cost Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Custo
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={cost}
              onChange={(e) => handleCostChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {/* Margin or Price Input */}
        {mode === 'margin' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Margem Desejada
            </label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={targetMargin}
                onChange={(e) => handleMarginChange(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="35"
                step="1"
                min="0"
                max="100"
              />
            </div>
            <div className="mt-1 flex space-x-2">
              {[20, 25, 30, 35, 40].map((m) => (
                <button
                  key={m}
                  onClick={() => handleMarginChange(m)}
                  className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {m}%
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Preço de Venda
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={price}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Preço Sugerido
          </span>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {marginCalculatorService.formatCurrency(price)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Margem Atual
          </span>
          <span className={`text-lg font-semibold ${getMarginColor(currentMargin)}`}>
            {currentMargin.toFixed(2)}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Lucro
          </span>
          <span className="text-lg font-semibold text-green-600 dark:text-green-400">
            {marginCalculatorService.formatCurrency(profit)}
          </span>
        </div>

        <div className="pt-2 border-t border-gray-200 dark:border-gray-600 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Markup:</span>
            <span className="ml-1 font-medium text-gray-900 dark:text-white">
              {currentMarkup.toFixed(2)}x
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">ROI:</span>
            <span className="ml-1 font-medium text-gray-900 dark:text-white">
              {roi.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      {mode === 'margin' && (
        <button
          onClick={applyMargin}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Aplicar Margem de {targetMargin}%</span>
        </button>
      )}
    </div>
  );
};

export default MarginCalculator;
