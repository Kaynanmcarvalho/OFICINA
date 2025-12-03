/**
 * TORQ Stock Prediction - Service
 * Serviço para previsão inteligente de estoque
 */

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type {
  StockItem,
  StockMovement,
  StockPrediction,
  StockStatus,
  DemandForecast,
  SeasonalPattern,
  ReorderSuggestion,
  StockAnalytics,
  PredictionConfig,
} from '../types';
import { DEFAULT_PREDICTION_CONFIG } from '../types';

class StockPredictionService {
  private readonly STOCK_COLLECTION = 'stockItems';
  private readonly MOVEMENTS_COLLECTION = 'stockMovements';
  private config: PredictionConfig = DEFAULT_PREDICTION_CONFIG;

  /**
   * Configura parâmetros de previsão
   */
  setConfig(config: Partial<PredictionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Gera previsões para todos os itens
   */
  async generatePredictions(empresaId: string): Promise<StockPrediction[]> {
    try {
      const items = await this.getStockItems(empresaId);
      const predictions: StockPrediction[] = [];

      for (const item of items) {
        const prediction = await this.predictForItem(item, empresaId);
        predictions.push(prediction);
      }

      // Ordenar por urgência
      return predictions.sort((a, b) => {
        const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      });
    } catch (error) {
      console.error('Erro ao gerar previsões:', error);
      throw error;
    }
  }

  /**
   * Gera previsão para um item específico
   */
  async predictForItem(item: StockItem, empresaId: string): Promise<StockPrediction> {
    // Buscar histórico de movimentações
    const movements = await this.getMovements(item.id, empresaId, this.config.historicalDays);
    
    // Calcular uso médio diário
    const dailyUsage = this.calculateDailyUsage(movements);
    
    // Detectar tendência
    const trend = this.detectTrend(movements);
    
    // Calcular fator de sazonalidade
    const seasonality = this.calculateSeasonality(movements);
    
    // Prever demanda
    const predictedDemand = this.predictDemand(dailyUsage, trend, seasonality);
    
    // Calcular dias até acabar
    const daysUntilStockout = dailyUsage > 0 
      ? Math.floor(item.currentStock / dailyUsage)
      : 999;
    
    // Determinar status
    const status = this.determineStatus(item, daysUntilStockout);
    
    // Calcular quantidade de reposição
    const reorderQuantity = this.calculateReorderQuantity(
      dailyUsage,
      item.minStock,
      item.maxStock
    );
    
    // Data recomendada para compra
    const reorderDate = this.calculateReorderDate(daysUntilStockout);
    
    // Determinar urgência
    const urgency = this.determineUrgency(daysUntilStockout, status);
    
    // Calcular confiança
    const confidence = this.calculateConfidence(movements.length);

    return {
      stockItemId: item.id,
      partName: item.partName,
      partNumber: item.partNumber,
      currentStock: item.currentStock,
      minStock: item.minStock,
      predictedDemand,
      daysUntilStockout,
      recommendedReorderQuantity: reorderQuantity,
      recommendedReorderDate: reorderDate,
      averageDailyUsage: dailyUsage,
      usageTrend: trend,
      seasonalityFactor: seasonality,
      confidenceLevel: confidence,
      dataPoints: movements.length,
      status,
      urgency,
    };
  }

  /**
   * Busca itens de estoque
   */
  private async getStockItems(empresaId: string): Promise<StockItem[]> {
    const ref = collection(db, this.STOCK_COLLECTION);
    const q = query(ref, where('empresaId', '==', empresaId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lastUpdated: doc.data().lastUpdated?.toDate() || new Date(),
      lastPurchase: doc.data().lastPurchase?.toDate(),
      lastSale: doc.data().lastSale?.toDate(),
    })) as StockItem[];
  }

  /**
   * Busca movimentações de um item
   */
  private async getMovements(
    stockItemId: string,
    empresaId: string,
    days: number
  ): Promise<StockMovement[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const ref = collection(db, this.MOVEMENTS_COLLECTION);
    const q = query(
      ref,
      where('stockItemId', '==', stockItemId),
      where('empresaId', '==', empresaId),
      where('createdAt', '>=', Timestamp.fromDate(startDate)),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as StockMovement[];
  }

  /**
   * Calcula uso médio diário
   */
  private calculateDailyUsage(movements: StockMovement[]): number {
    if (movements.length === 0) return 0;

    const outMovements = movements.filter(m => m.type === 'out');
    const totalOut = outMovements.reduce((sum, m) => sum + m.quantity, 0);

    // Período em dias
    const firstDate = movements[movements.length - 1]?.createdAt || new Date();
    const lastDate = movements[0]?.createdAt || new Date();
    const days = Math.max(1, Math.ceil(
      (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
    ));

    return totalOut / days;
  }

  /**
   * Detecta tendência de uso
   */
  private detectTrend(movements: StockMovement[]): 'increasing' | 'stable' | 'decreasing' {
    if (movements.length < 10) return 'stable';

    const outMovements = movements.filter(m => m.type === 'out');
    if (outMovements.length < 5) return 'stable';

    // Dividir em duas metades
    const mid = Math.floor(outMovements.length / 2);
    const recentHalf = outMovements.slice(0, mid);
    const olderHalf = outMovements.slice(mid);

    const recentAvg = recentHalf.reduce((sum, m) => sum + m.quantity, 0) / recentHalf.length;
    const olderAvg = olderHalf.reduce((sum, m) => sum + m.quantity, 0) / olderHalf.length;

    const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (changePercent > 15) return 'increasing';
    if (changePercent < -15) return 'decreasing';
    return 'stable';
  }

  /**
   * Calcula fator de sazonalidade
   */
  private calculateSeasonality(movements: StockMovement[]): number {
    if (!this.config.seasonalityEnabled || movements.length < 30) return 1.0;

    const currentMonth = new Date().getMonth();
    const monthlyUsage: Record<number, number[]> = {};

    movements.forEach(m => {
      if (m.type === 'out') {
        const month = m.createdAt.getMonth();
        if (!monthlyUsage[month]) monthlyUsage[month] = [];
        monthlyUsage[month].push(m.quantity);
      }
    });

    // Média geral
    const allUsage = Object.values(monthlyUsage).flat();
    const overallAvg = allUsage.reduce((a, b) => a + b, 0) / allUsage.length;

    // Média do mês atual
    const currentMonthUsage = monthlyUsage[currentMonth] || [];
    if (currentMonthUsage.length === 0) return 1.0;

    const currentAvg = currentMonthUsage.reduce((a, b) => a + b, 0) / currentMonthUsage.length;

    return currentAvg / overallAvg;
  }

  /**
   * Prevê demanda futura
   */
  private predictDemand(
    dailyUsage: number,
    trend: 'increasing' | 'stable' | 'decreasing',
    seasonality: number
  ): number {
    let baseDemand = dailyUsage * this.config.forecastDays;

    // Ajuste por tendência
    if (this.config.trendAnalysisEnabled) {
      if (trend === 'increasing') baseDemand *= 1.15;
      if (trend === 'decreasing') baseDemand *= 0.85;
    }

    // Ajuste por sazonalidade
    baseDemand *= seasonality;

    return Math.round(baseDemand);
  }

  /**
   * Determina status do estoque
   */
  private determineStatus(item: StockItem, daysUntilStockout: number): StockStatus {
    if (item.currentStock <= 0) return 'stockout';
    if (item.currentStock < item.minStock) return 'critical';
    if (daysUntilStockout <= this.config.criticalThresholdDays) return 'critical';
    if (daysUntilStockout <= this.config.lowThresholdDays) return 'low';
    if (item.currentStock > item.maxStock) return 'excess';
    return 'optimal';
  }

  /**
   * Calcula quantidade de reposição
   */
  private calculateReorderQuantity(
    dailyUsage: number,
    minStock: number,
    maxStock: number
  ): number {
    // Quantidade para cobrir lead time + safety stock
    const coverageDays = this.config.leadTimeDays + this.config.safetyStockDays;
    const coverageQuantity = Math.ceil(dailyUsage * coverageDays);

    // Garantir que atinge o máximo
    const targetQuantity = Math.max(coverageQuantity, maxStock - minStock);

    return Math.max(1, targetQuantity);
  }

  /**
   * Calcula data recomendada para compra
   */
  private calculateReorderDate(daysUntilStockout: number): Date {
    const reorderDate = new Date();
    const daysBeforeStockout = Math.max(
      0,
      daysUntilStockout - this.config.leadTimeDays - this.config.safetyStockDays
    );
    reorderDate.setDate(reorderDate.getDate() + daysBeforeStockout);
    return reorderDate;
  }

  /**
   * Determina urgência
   */
  private determineUrgency(
    daysUntilStockout: number,
    status: StockStatus
  ): StockPrediction['urgency'] {
    if (status === 'stockout' || status === 'critical') return 'critical';
    if (daysUntilStockout <= this.config.criticalThresholdDays) return 'critical';
    if (daysUntilStockout <= this.config.lowThresholdDays) return 'high';
    if (daysUntilStockout <= 14) return 'medium';
    return 'low';
  }

  /**
   * Calcula nível de confiança
   */
  private calculateConfidence(dataPoints: number): number {
    if (dataPoints < 5) return 30;
    if (dataPoints < 15) return 50;
    if (dataPoints < 30) return 70;
    if (dataPoints < 60) return 85;
    return 95;
  }

  /**
   * Gera sugestões de reposição
   */
  async getReorderSuggestions(empresaId: string): Promise<ReorderSuggestion[]> {
    const predictions = await this.generatePredictions(empresaId);
    
    return predictions
      .filter(p => p.status === 'critical' || p.status === 'low' || p.status === 'stockout')
      .map(p => ({
        stockItemId: p.stockItemId,
        partName: p.partName,
        partNumber: p.partNumber,
        brand: '',
        currentStock: p.currentStock,
        minStock: p.minStock,
        daysUntilStockout: p.daysUntilStockout,
        suggestedQuantity: p.recommendedReorderQuantity,
        estimatedCost: 0, // Seria calculado com preço de custo
        priority: p.urgency === 'critical' ? 'urgent' : p.urgency,
        reason: this.getReorderReason(p),
      }));
  }

  /**
   * Gera razão para reposição
   */
  private getReorderReason(prediction: StockPrediction): string {
    if (prediction.status === 'stockout') {
      return 'Produto sem estoque';
    }
    if (prediction.status === 'critical') {
      return `Estoque crítico - ${prediction.daysUntilStockout} dias restantes`;
    }
    if (prediction.usageTrend === 'increasing') {
      return 'Demanda em crescimento';
    }
    return `Estoque baixo - ${prediction.daysUntilStockout} dias restantes`;
  }

  /**
   * Gera analytics de estoque
   */
  async getStockAnalytics(
    empresaId: string,
    startDate: Date,
    endDate: Date
  ): Promise<StockAnalytics> {
    const items = await this.getStockItems(empresaId);
    const predictions = await this.generatePredictions(empresaId);

    // Calcular totais
    const totalValue = items.reduce((sum, i) => sum + (i.currentStock * i.unitPrice), 0);
    const totalCost = items.reduce((sum, i) => sum + (i.currentStock * i.costPrice), 0);

    // Status breakdown
    const statusBreakdown: Record<StockStatus, number> = {
      critical: 0,
      low: 0,
      optimal: 0,
      excess: 0,
      stockout: 0,
    };

    predictions.forEach(p => {
      statusBreakdown[p.status]++;
    });

    // Items que precisam reposição
    const needingReorder = predictions.filter(
      p => p.status === 'critical' || p.status === 'low' || p.status === 'stockout'
    );

    return {
      empresaId,
      period: { start: startDate, end: endDate },
      totalItems: items.length,
      totalValue,
      totalCost,
      statusBreakdown,
      totalMovements: 0, // Seria calculado
      totalIn: 0,
      totalOut: 0,
      itemsNeedingReorder: needingReorder.length,
      estimatedReorderCost: 0,
      turnoverRate: 0,
      stockoutIncidents: statusBreakdown.stockout,
      averageStockDays: 0,
      topSellingItems: [],
      slowMovingItems: [],
      criticalItems: predictions
        .filter(p => p.urgency === 'critical')
        .slice(0, 5)
        .map(p => ({
          itemId: p.stockItemId,
          name: p.partName,
          daysUntilStockout: p.daysUntilStockout,
        })),
    };
  }

  /**
   * Registra movimentação de estoque
   */
  async recordMovement(
    movement: Omit<StockMovement, 'id' | 'createdAt'>
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.MOVEMENTS_COLLECTION), {
        ...movement,
        createdAt: Timestamp.now(),
      });

      // Atualizar estoque do item
      await this.updateStockQuantity(
        movement.stockItemId,
        movement.type === 'in' ? movement.quantity : -movement.quantity
      );

      return docRef.id;
    } catch (error) {
      console.error('Erro ao registrar movimentação:', error);
      throw error;
    }
  }

  /**
   * Atualiza quantidade em estoque
   */
  private async updateStockQuantity(itemId: string, delta: number): Promise<void> {
    const docRef = doc(db, this.STOCK_COLLECTION, itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentStock = docSnap.data().currentStock || 0;
      await updateDoc(docRef, {
        currentStock: Math.max(0, currentStock + delta),
        lastUpdated: Timestamp.now(),
        ...(delta > 0 ? { lastPurchase: Timestamp.now() } : { lastSale: Timestamp.now() }),
      });
    }
  }
}

export const stockPredictionService = new StockPredictionService();
