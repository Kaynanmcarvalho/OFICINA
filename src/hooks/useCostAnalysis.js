/**
 * useCostAnalysis Hook
 * Hook para gerenciar análise de custos e margens
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import costAnalysisService from '../services/costAnalysisService';
import marginCalculatorService from '../services/marginCalculatorService';

export const useCostAnalysis = (budgetData, empresaId) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);

  // Carregar configuração de margens
  useEffect(() => {
    if (empresaId) {
      loadConfig();
    }
  }, [empresaId]);

  // Analisar orçamento quando dados mudarem
  useEffect(() => {
    if (budgetData && budgetData.items && budgetData.items.length > 0 && empresaId) {
      analyzeBudget();
    }
  }, [budgetData, empresaId]);

  const loadConfig = async () => {
    try {
      const marginConfig = await costAnalysisService.getMarginConfig(empresaId);
      setConfig(marginConfig);
    } catch (err) {
      console.error('Error loading config:', err);
      setError(err);
    }
  };

  const analyzeBudget = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await costAnalysisService.analyzeBudget(budgetData, empresaId);
      setAnalysis(result);
      return result;
    } catch (err) {
      console.error('Error analyzing budget:', err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const calculateItemMargin = useCallback((item) => {
    return costAnalysisService.calculateItemMargin(item);
  }, []);

  const calculateItemCost = useCallback((item) => {
    return costAnalysisService.calculateItemCost(item);
  }, []);

  const suggestPrice = useCallback((cost, targetMargin = null) => {
    const margin = targetMargin || config?.targetMargin || 35;
    return marginCalculatorService.suggestPrice(cost, margin);
  }, [config]);

  const validateMargin = useCallback((margin) => {
    const minMargin = config?.minMargin || 20;
    return costAnalysisService.validateMargin(margin, minMargin);
  }, [config]);

  const updateConfig = async (newConfig) => {
    try {
      await costAnalysisService.updateMarginConfig(empresaId, newConfig);
      setConfig({ ...config, ...newConfig });
      return true;
    } catch (err) {
      console.error('Error updating config:', err);
      setError(err);
      return false;
    }
  };

  const getMarginStats = async (days = 30) => {
    try {
      const stats = await costAnalysisService.calculateMarginStats(empresaId, days);
      return stats;
    } catch (err) {
      console.error('Error getting margin stats:', err);
      return null;
    }
  };

  const formatCurrency = useCallback((value) => {
    return marginCalculatorService.formatCurrency(value);
  }, []);

  const formatPercent = useCallback((value) => {
    return marginCalculatorService.formatPercent(value);
  }, []);

  return {
    // State
    analysis,
    loading,
    error,
    config,
    
    // Actions
    analyzeBudget,
    updateConfig,
    getMarginStats,
    
    // Calculators
    calculateItemMargin,
    calculateItemCost,
    suggestPrice,
    validateMargin,
    
    // Formatters
    formatCurrency,
    formatPercent,
    
    // Computed
    hasAnalysis: !!analysis,
    isHealthy: analysis ? analysis.totals.margin >= (config?.minMargin || 20) : false,
    totalMargin: analysis?.totals?.margin || 0,
    totalProfit: analysis?.totals?.profitAmount || 0,
    totalCost: analysis?.totals?.cost || 0,
    totalPrice: analysis?.totals?.price || 0
  };
};

export default useCostAnalysis;
