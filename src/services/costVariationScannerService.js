/**
 * Cost Variation Scanner Service
 * Scanner inteligente de variação de custos
 */

import { db } from '../config/firebase';
import { collection, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore';

class CostVariationScannerService {
  /**
   * Escaneia variações de custo de um produto
   */
  async scanProductCostVariation(productId, empresaId, period = 90) {
    try {
      const costHistory = await this.getCostHistory(productId, empresaId, period);
      
      if (costHistory.length < 2) {
        return {
          productId,
          hasVariation: false,
          message: 'Histórico insuficiente para análise',
          costHistory: []
        };
      }

      const analysis = this.analyzeCostVariation(costHistory);
      const trends = this.identifyTrends(costHistory);
      const alerts = this.generateAlerts(analysis, trends);
      const forecast = this.forecastNextCost(costHistory, trends);

      return {
        productId,
        hasVariation: analysis.hasSignificantVariation,
        currentCost: costHistory[0].cost,
        analysis,
        trends,
        alerts,
        forecast,
        costHistory: costHistory.slice(0, 20),
        lastUpdate: new Date()
      };
    } catch (error) {
      console.error('Erro ao escanear variação:', error);
      throw error;
    }
  }

  /**
   * Busca histórico de custos
   */
  async getCostHistory(productId, empresaId, days) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const costQuery = query(
        collection(db, 'costHistory'),
        where('empresaId', '==', empresaId),
        where('productId', '==', productId),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'desc')

      const snapshot = await getDocs(costQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || new Date(doc.data().date)
      }));
    } catch (error) {
      console.error('Erro ao buscar histórico de custos:', error);
      return [];
    }
  }

  /**
   * Analisa variação de custos
   */
  analyzeCostVariation(costHistory) {
    const costs = costHistory.map(c => c.cost);
    const currentCost = costs[0];
    const oldestCost = costs[costs.length - 1];

    // Estatísticas básicas
    const avgCost = costs.reduce((sum, c) => sum + c, 0) / costs.length;
    const minCost = Math.min(...costs);
    const maxCost = Math.max(...costs);
    
    // Variação total
    const totalVariation = ((currentCost - oldestCost) / oldestCost) * 100;
    
    // Desvio padrão
    const variance = costs.reduce((sum, c) => sum + Math.pow(c - avgCost, 2), 0) / costs.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = (stdDev / avgCost) * 100;

    // Volatilidade (variações consecutivas)
    let volatilitySum = 0;
    for (let i = 0; i < costs.length - 1; i++) {
      const variation = Math.abs((costs[i] - costs[i + 1]) / costs[i + 1]) * 100;
      volatilitySum += variation;
    }
    const avgVolatility = volatilitySum / (costs.length - 1);

    // Classificação
    let variationType = 'stable';
    let severity = 'low';

    if (Math.abs(totalVariation) > 20) {
      variationType = totalVariation > 0 ? 'high_increase' : 'high_decrease';
      severity = 'high';
    } else if (Math.abs(totalVariation) > 10) {
      variationType = totalVariation > 0 ? 'moderate_increase' : 'moderate_decrease';
      severity = 'medium';
    } else if (coefficientOfVariation > 15) {
      variationType = 'volatile';
      severity = 'medium';
    }

    return {
      currentCost,
      avgCost: avgCost.toFixed(2),
      minCost: minCost.toFixed(2),
      maxCost: maxCost.toFixed(2),
      totalVariation: totalVariation.toFixed(2),
      coefficientOfVariation: coefficientOfVariation.toFixed(2),
      avgVolatility: avgVolatility.toFixed(2),
      variationType,
      severity,
      hasSignificantVariation: Math.abs(totalVariation) > 5 || coefficientOfVariation > 10,
      range: (maxCost - minCost).toFixed(2),
      rangePercentage: (((maxCost - minCost) / minCost) * 100).toFixed(2)
    };
  }

  /**
   * Identifica tendências
   */
  identifyTrends(costHistory) {
    if (costHistory.length < 3) {
      return {
        direction: 'unknown',
        strength: 0,
        consistency: 0
      };
    }

    const costs = costHistory.map(c => c.cost);
    
    // Regressão linear simples
    const n = costs.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    
    const sumX = indices.reduce((a, b) => a + b, 0);
    const sumY = costs.reduce((a, b) => a + b, 0);
    const sumXY = indices.reduce((sum, x, i) => sum + x * costs[i], 0);
    const sumX2 = indices.reduce((sum, x) => sum + x * x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Direção da tendência
    let direction = 'stable';
    if (slope > 0.1) direction = 'increasing';
    else if (slope < -0.1) direction = 'decreasing';

    // Força da tendência (R²)
    const yMean = sumY / n;
    const ssTotal = costs.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
    const ssResidual = costs.reduce((sum, y, i) => {
      const predicted = slope * i + intercept;
      return sum + Math.pow(y - predicted, 2);
    }, 0);
    const rSquared = 1 - (ssResidual / ssTotal);

    // Consistência (% de movimentos na mesma direção)
    let consistentMoves = 0;
    for (let i = 0; i < costs.length - 1; i++) {
      const move = costs[i] - costs[i + 1];
      if ((slope > 0 && move < 0) || (slope < 0 && move > 0) || (slope === 0 && move === 0)) {
        consistentMoves++;
      }
    }
    const consistency = (consistentMoves / (costs.length - 1)) * 100;

    return {
      direction,
      strength: (rSquared * 100).toFixed(2),
      consistency: consistency.toFixed(2),
      slope: slope.toFixed(4),
      equation: `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`
    };
  }

  /**
   * Gera alertas baseados na análise
   */
  generateAlerts(analysis, trends) {
    const alerts = [];

    // Alerta de aumento significativo
    if (analysis.variationType === 'high_increase') {
      alerts.push({
        type: 'cost_increase',
        severity: 'high',
        message: `Custo aumentou ${analysis.totalVariation}% no período`,
        impact: 'Margem de lucro reduzida',
        action: 'Considere reajustar preços de venda'
      });
    }

    // Alerta de queda significativa
    if (analysis.variationType === 'high_decrease') {
      alerts.push({
        type: 'cost_decrease',
        severity: 'medium',
        message: `Custo reduziu ${Math.abs(analysis.totalVariation)}% no período`,
        impact: 'Oportunidade de aumentar margem',
        action: 'Avalie manter preço atual para maior lucro'
      });
    }

    // Alerta de volatilidade
    if (analysis.variationType === 'volatile') {
      alerts.push({
        type: 'high_volatility',
        severity: 'medium',
        message: `Custo apresenta alta volatilidade (${analysis.coefficientOfVariation}%)`,
        impact: 'Dificuldade em precificação',
        action: 'Monitore fornecedores e busque alternativas'
      });
    }

    // Alerta de tendência crescente
    if (trends.direction === 'increasing' && parseFloat(trends.strength) > 70) {
      alerts.push({
        type: 'upward_trend',
        severity: 'medium',
        message: 'Tendência consistente de aumento de custo',
        impact: 'Custos continuarão subindo',
        action: 'Planeje reajustes futuros de preço'
      });
    }

    // Alerta de tendência decrescente
    if (trends.direction === 'decreasing' && parseFloat(trends.strength) > 70) {
      alerts.push({
        type: 'downward_trend',
        severity: 'low',
        message: 'Tendência consistente de redução de custo',
        impact: 'Oportunidade de competitividade',
        action: 'Considere estratégia de preço agressiva'
      });
    }

    return alerts;
  }

  /**
   * Prevê próximo custo baseado em tendências
   */
  forecastNextCost(costHistory, trends) {
    if (trends.direction === 'unknown' || costHistory.length < 3) {
      return {
        predicted: costHistory[0].cost,
        confidence: 'low',
        range: {
          min: costHistory[0].cost * 0.95,
          max: costHistory[0].cost * 1.05
        }
      };
    }

    const currentCost = costHistory[0].cost;
    const slope = parseFloat(trends.slope);
    const strength = parseFloat(trends.strength);

    // Previsão para próximo período (30 dias)
    const predicted = currentCost - slope;

    // Confiança baseada na força da tendência
    let confidence = 'low';
    if (strength > 80) confidence = 'high';
    else if (strength > 60) confidence = 'medium';

    // Faixa de previsão (±10% para baixa confiança, ±5% para alta)
    const margin = confidence === 'high' ? 0.05 : confidence === 'medium' ? 0.08 : 0.10;

    return {
      predicted: predicted.toFixed(2),
      confidence,
      range: {
        min: (predicted * (1 - margin)).toFixed(2),
        max: (predicted * (1 + margin)).toFixed(2)
      },
      basis: trends.equation,
      daysAhead: 30
    };
  }

  /**
   * Escaneia múltiplos produtos
   */
  async scanMultipleProducts(productIds, empresaId, period = 90) {
    try {
      const scans = await Promise.all(
        productIds.map(id => this.scanProductCostVariation(id, empresaId, period))

      // Ordenar por severidade e variação
      return scans.sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        const aSeverity = a.analysis?.severity || 'low';
        const bSeverity = b.analysis?.severity || 'low';
        
        if (severityOrder[aSeverity] !== severityOrder[bSeverity]) {
          return severityOrder[bSeverity] - severityOrder[aSeverity];
        }
        
        const aVariation = Math.abs(parseFloat(a.analysis?.totalVariation || 0));
        const bVariation = Math.abs(parseFloat(b.analysis?.totalVariation || 0));
        return bVariation - aVariation;
      });
    } catch (error) {
      console.error('Erro ao escanear múltiplos produtos:', error);
      throw error;
    }
  }

  /**
   * Identifica produtos com maior variação
   */
  identifyHighVariationProducts(scans) {
    return scans.filter(scan => {
      const variation = Math.abs(parseFloat(scan.analysis?.totalVariation || 0));
      return variation > 15 || scan.analysis?.severity === 'high';
    });
  }

  /**
   * Calcula impacto na margem
   */
  calculateMarginImpact(oldCost, newCost, salePrice) {
    const oldMargin = ((salePrice - oldCost) / salePrice) * 100;
    const newMargin = ((salePrice - newCost) / salePrice) * 100;
    const marginChange = newMargin - oldMargin;

    return {
      oldMargin: oldMargin.toFixed(2),
      newMargin: newMargin.toFixed(2),
      marginChange: marginChange.toFixed(2),
      impact: marginChange < -5 ? 'high' : marginChange < -2 ? 'medium' : 'low'
    };
  }
}

export default new CostVariationScannerService();
