/**
 * TORQ Stock Prediction - Unit Tests
 * Testes unitários para o módulo de previsão de estoque
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type {
  StockItem,
  StockMovement,
  StockPrediction,
  StockStatus,
  DemandForecast,
  ReorderSuggestion,
  StockAnalytics,
  PredictionConfig,
  MovementReason,
} from '../../../src/features/stock-prediction/types';
import {
  MOVEMENT_REASON_LABELS,
  STOCK_STATUS_LABELS,
  URGENCY_LABELS,
  STATUS_COLORS,
  URGENCY_COLORS,
  DEFAULT_PREDICTION_CONFIG,
} from '../../../src/features/stock-prediction/types';

describe('Stock Prediction Module', () => {
  describe('Types', () => {
    it('should have all movement reasons defined', () => {
      const reasons: MovementReason[] = [
        'purchase', 'sale', 'service', 'return',
        'adjustment', 'transfer', 'loss', 'initial'
      ];

      reasons.forEach(reason => {
        expect(MOVEMENT_REASON_LABELS[reason]).toBeDefined();
      });
    });

    it('should have labels in Portuguese', () => {
      expect(MOVEMENT_REASON_LABELS.purchase).toBe('Compra');
      expect(MOVEMENT_REASON_LABELS.sale).toBe('Venda');
      expect(MOVEMENT_REASON_LABELS.service).toBe('Uso em Serviço');
      expect(STOCK_STATUS_LABELS.critical).toBe('Crítico');
      expect(STOCK_STATUS_LABELS.optimal).toBe('Ideal');
    });

    it('should have all stock statuses defined', () => {
      const statuses: StockStatus[] = [
        'critical', 'low', 'optimal', 'excess', 'stockout'
      ];

      statuses.forEach(status => {
        expect(STOCK_STATUS_LABELS[status]).toBeDefined();
        expect(STATUS_COLORS[status]).toBeDefined();
      });
    });

    it('should have urgency levels defined', () => {
      const urgencies: StockPrediction['urgency'][] = [
        'critical', 'high', 'medium', 'low'
      ];

      urgencies.forEach(urgency => {
        expect(URGENCY_LABELS[urgency]).toBeDefined();
        expect(URGENCY_COLORS[urgency]).toBeDefined();
      });
    });

    it('should have color definitions for all statuses', () => {
      Object.values(STATUS_COLORS).forEach(colors => {
        expect(colors.bg).toBeDefined();
        expect(colors.text).toBeDefined();
        expect(colors.border).toBeDefined();
      });
    });
  });

  describe('Default Configuration', () => {
    it('should have sensible defaults', () => {
      expect(DEFAULT_PREDICTION_CONFIG.historicalDays).toBe(90);
      expect(DEFAULT_PREDICTION_CONFIG.forecastDays).toBe(30);
      expect(DEFAULT_PREDICTION_CONFIG.safetyStockDays).toBe(7);
      expect(DEFAULT_PREDICTION_CONFIG.leadTimeDays).toBe(5);
      expect(DEFAULT_PREDICTION_CONFIG.seasonalityEnabled).toBe(true);
      expect(DEFAULT_PREDICTION_CONFIG.trendAnalysisEnabled).toBe(true);
    });

    it('should have alert thresholds', () => {
      expect(DEFAULT_PREDICTION_CONFIG.criticalThresholdDays).toBe(3);
      expect(DEFAULT_PREDICTION_CONFIG.lowThresholdDays).toBe(7);
    });
  });

  describe('Stock Item', () => {
    it('should create valid stock item', () => {
      const item: StockItem = {
        id: 'stock-001',
        partId: 'part-001',
        partName: 'Filtro de Óleo',
        partNumber: 'OC 500',
        category: 'filters',
        brand: 'Mann',
        currentStock: 15,
        minStock: 5,
        maxStock: 30,
        unitPrice: 45.90,
        costPrice: 32.00,
        location: 'Prateleira A',
        shelf: 'A-03',
        empresaId: 'empresa-001',
        lastUpdated: new Date(),
        lastPurchase: new Date('2024-01-10'),
        lastSale: new Date('2024-01-15'),
      };

      expect(item.currentStock).toBe(15);
      expect(item.currentStock).toBeGreaterThan(item.minStock);
      expect(item.currentStock).toBeLessThan(item.maxStock);
    });

    it('should handle optional fields', () => {
      const minimalItem: StockItem = {
        id: 'stock-002',
        partId: 'part-002',
        partName: 'Vela de Ignição',
        partNumber: 'BKR6E',
        category: 'electrical',
        brand: 'NGK',
        currentStock: 20,
        minStock: 10,
        maxStock: 50,
        unitPrice: 28.00,
        costPrice: 18.00,
        empresaId: 'empresa-001',
        lastUpdated: new Date(),
      };

      expect(minimalItem.location).toBeUndefined();
      expect(minimalItem.lastPurchase).toBeUndefined();
    });
  });

  describe('Stock Movement', () => {
    it('should create valid movement', () => {
      const movement: StockMovement = {
        id: 'mov-001',
        stockItemId: 'stock-001',
        type: 'out',
        quantity: 2,
        reason: 'service',
        reference: 'service-123',
        notes: 'Troca de óleo',
        empresaId: 'empresa-001',
        userId: 'user-001',
        createdAt: new Date(),
      };

      expect(movement.type).toBe('out');
      expect(movement.reason).toBe('service');
      expect(movement.quantity).toBe(2);
    });

    it('should support all movement types', () => {
      const types: StockMovement['type'][] = ['in', 'out', 'adjustment'];

      types.forEach(type => {
        const movement: StockMovement = {
          id: 'mov-test',
          stockItemId: 'stock-001',
          type,
          quantity: 1,
          reason: 'adjustment',
          empresaId: 'empresa-001',
          userId: 'user-001',
          createdAt: new Date(),
        };
        expect(movement.type).toBe(type);
      });
    });
  });

  describe('Stock Prediction', () => {
    it('should create valid prediction', () => {
      const prediction: StockPrediction = {
        stockItemId: 'stock-001',
        partName: 'Filtro de Óleo',
        partNumber: 'OC 500',
        currentStock: 15,
        minStock: 5,
        predictedDemand: 20,
        daysUntilStockout: 12,
        recommendedReorderQuantity: 25,
        recommendedReorderDate: new Date('2024-02-01'),
        averageDailyUsage: 1.25,
        usageTrend: 'stable',
        seasonalityFactor: 1.0,
        confidenceLevel: 85,
        dataPoints: 45,
        status: 'optimal',
        urgency: 'low',
      };

      expect(prediction.daysUntilStockout).toBe(12);
      expect(prediction.confidenceLevel).toBe(85);
      expect(prediction.status).toBe('optimal');
    });

    it('should handle critical status', () => {
      const criticalPrediction: StockPrediction = {
        stockItemId: 'stock-002',
        partName: 'Pastilha de Freio',
        partNumber: 'P85075',
        currentStock: 2,
        minStock: 5,
        predictedDemand: 15,
        daysUntilStockout: 2,
        recommendedReorderQuantity: 20,
        recommendedReorderDate: new Date(),
        averageDailyUsage: 1.0,
        usageTrend: 'increasing',
        seasonalityFactor: 1.2,
        confidenceLevel: 90,
        dataPoints: 60,
        status: 'critical',
        urgency: 'critical',
      };

      expect(criticalPrediction.status).toBe('critical');
      expect(criticalPrediction.urgency).toBe('critical');
      expect(criticalPrediction.currentStock).toBeLessThan(criticalPrediction.minStock);
    });
  });

  describe('Reorder Suggestion', () => {
    it('should create valid suggestion', () => {
      const suggestion: ReorderSuggestion = {
        stockItemId: 'stock-001',
        partName: 'Filtro de Óleo',
        partNumber: 'OC 500',
        brand: 'Mann',
        currentStock: 3,
        minStock: 5,
        daysUntilStockout: 4,
        suggestedQuantity: 25,
        estimatedCost: 800.00,
        supplier: 'Distribuidora ABC',
        priority: 'high',
        reason: 'Estoque abaixo do mínimo',
        potentialSavings: 50.00,
        bulkDiscountAvailable: true,
      };

      expect(suggestion.priority).toBe('high');
      expect(suggestion.suggestedQuantity).toBe(25);
      expect(suggestion.bulkDiscountAvailable).toBe(true);
    });
  });

  describe('Stock Analytics', () => {
    it('should aggregate analytics data', () => {
      const analytics: StockAnalytics = {
        empresaId: 'empresa-001',
        period: {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31'),
        },
        totalItems: 150,
        totalValue: 45000.00,
        totalCost: 32000.00,
        statusBreakdown: {
          critical: 5,
          low: 12,
          optimal: 120,
          excess: 8,
          stockout: 5,
        },
        totalMovements: 450,
        totalIn: 200,
        totalOut: 250,
        itemsNeedingReorder: 17,
        estimatedReorderCost: 5500.00,
        turnoverRate: 4.5,
        stockoutIncidents: 3,
        averageStockDays: 25,
        topSellingItems: [
          { itemId: 'stock-001', name: 'Filtro de Óleo', quantity: 45 },
          { itemId: 'stock-002', name: 'Vela de Ignição', quantity: 38 },
        ],
        slowMovingItems: [
          { itemId: 'stock-050', name: 'Peça Especial', daysSinceLastSale: 90 },
        ],
        criticalItems: [
          { itemId: 'stock-010', name: 'Pastilha de Freio', daysUntilStockout: 2 },
        ],
      };

      expect(analytics.totalItems).toBe(150);
      expect(analytics.statusBreakdown.optimal).toBe(120);
      expect(analytics.turnoverRate).toBe(4.5);
    });
  });

  describe('Prediction Calculations', () => {
    it('should calculate daily usage correctly', () => {
      const calculateDailyUsage = (
        totalOut: number,
        days: number
      ): number => {
        return days > 0 ? totalOut / days : 0;
      };

      expect(calculateDailyUsage(30, 30)).toBe(1);
      expect(calculateDailyUsage(45, 30)).toBe(1.5);
      expect(calculateDailyUsage(0, 30)).toBe(0);
      expect(calculateDailyUsage(30, 0)).toBe(0);
    });

    it('should calculate days until stockout', () => {
      const calculateDaysUntilStockout = (
        currentStock: number,
        dailyUsage: number
      ): number => {
        if (dailyUsage <= 0) return 999;
        return Math.floor(currentStock / dailyUsage);
      };

      expect(calculateDaysUntilStockout(15, 1)).toBe(15);
      expect(calculateDaysUntilStockout(15, 1.5)).toBe(10);
      expect(calculateDaysUntilStockout(15, 0)).toBe(999);
      expect(calculateDaysUntilStockout(0, 1)).toBe(0);
    });

    it('should determine stock status correctly', () => {
      const determineStatus = (
        currentStock: number,
        minStock: number,
        maxStock: number,
        daysUntilStockout: number
      ): StockStatus => {
        if (currentStock <= 0) return 'stockout';
        if (currentStock < minStock) return 'critical';
        if (daysUntilStockout <= 3) return 'critical';
        if (daysUntilStockout <= 7) return 'low';
        if (currentStock > maxStock) return 'excess';
        return 'optimal';
      };

      expect(determineStatus(0, 5, 30, 0)).toBe('stockout');
      expect(determineStatus(3, 5, 30, 5)).toBe('critical');
      expect(determineStatus(10, 5, 30, 5)).toBe('low');
      expect(determineStatus(15, 5, 30, 15)).toBe('optimal');
      expect(determineStatus(35, 5, 30, 30)).toBe('excess');
    });

    it('should determine urgency correctly', () => {
      const determineUrgency = (
        daysUntilStockout: number,
        status: StockStatus
      ): StockPrediction['urgency'] => {
        if (status === 'stockout' || status === 'critical') return 'critical';
        if (daysUntilStockout <= 3) return 'critical';
        if (daysUntilStockout <= 7) return 'high';
        if (daysUntilStockout <= 14) return 'medium';
        return 'low';
      };

      expect(determineUrgency(0, 'stockout')).toBe('critical');
      expect(determineUrgency(2, 'low')).toBe('critical');
      expect(determineUrgency(5, 'low')).toBe('high');
      expect(determineUrgency(10, 'optimal')).toBe('medium');
      expect(determineUrgency(20, 'optimal')).toBe('low');
    });
  });

  describe('Trend Detection', () => {
    it('should detect increasing trend', () => {
      const detectTrend = (
        recentAvg: number,
        olderAvg: number
      ): 'increasing' | 'stable' | 'decreasing' => {
        const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;
        if (changePercent > 15) return 'increasing';
        if (changePercent < -15) return 'decreasing';
        return 'stable';
      };

      expect(detectTrend(12, 10)).toBe('increasing'); // +20%
      expect(detectTrend(8, 10)).toBe('decreasing');  // -20%
      expect(detectTrend(10.5, 10)).toBe('stable');   // +5%
    });
  });

  describe('Reorder Quantity Calculation', () => {
    it('should calculate reorder quantity', () => {
      const calculateReorderQuantity = (
        dailyUsage: number,
        leadTimeDays: number,
        safetyStockDays: number,
        minStock: number,
        maxStock: number
      ): number => {
        const coverageDays = leadTimeDays + safetyStockDays;
        const coverageQuantity = Math.ceil(dailyUsage * coverageDays);
        const targetQuantity = Math.max(coverageQuantity, maxStock - minStock);
        return Math.max(1, targetQuantity);
      };

      // 1.5 uso/dia * (5 lead + 7 safety) = 18
      // max - min = 30 - 5 = 25
      // max(18, 25) = 25
      expect(calculateReorderQuantity(1.5, 5, 7, 5, 30)).toBe(25);

      // 3 uso/dia * 12 = 36
      // max(36, 25) = 36
      expect(calculateReorderQuantity(3, 5, 7, 5, 30)).toBe(36);
    });
  });

  describe('Confidence Level', () => {
    it('should calculate confidence based on data points', () => {
      const calculateConfidence = (dataPoints: number): number => {
        if (dataPoints < 5) return 30;
        if (dataPoints < 15) return 50;
        if (dataPoints < 30) return 70;
        if (dataPoints < 60) return 85;
        return 95;
      };

      expect(calculateConfidence(3)).toBe(30);
      expect(calculateConfidence(10)).toBe(50);
      expect(calculateConfidence(25)).toBe(70);
      expect(calculateConfidence(45)).toBe(85);
      expect(calculateConfidence(100)).toBe(95);
    });
  });

  describe('Seasonality Factor', () => {
    it('should calculate seasonality factor', () => {
      const calculateSeasonality = (
        currentMonthAvg: number,
        overallAvg: number
      ): number => {
        if (overallAvg === 0) return 1.0;
        return currentMonthAvg / overallAvg;
      };

      expect(calculateSeasonality(15, 10)).toBe(1.5);  // Alta temporada
      expect(calculateSeasonality(10, 10)).toBe(1.0);  // Normal
      expect(calculateSeasonality(5, 10)).toBe(0.5);   // Baixa temporada
      expect(calculateSeasonality(10, 0)).toBe(1.0);   // Sem dados
    });
  });

  describe('Price Formatting', () => {
    it('should format currency correctly', () => {
      const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(value);
      };

      expect(formatCurrency(45.90)).toBe('R$\u00A045,90');
      expect(formatCurrency(1250.00)).toBe('R$\u00A01.250,00');
      expect(formatCurrency(0)).toBe('R$\u00A00,00');
    });
  });

  describe('Sorting', () => {
    it('should sort predictions by urgency', () => {
      const predictions: StockPrediction[] = [
        { urgency: 'low' } as StockPrediction,
        { urgency: 'critical' } as StockPrediction,
        { urgency: 'medium' } as StockPrediction,
        { urgency: 'high' } as StockPrediction,
      ];

      const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const sorted = [...predictions].sort(
        (a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
      );

      expect(sorted[0].urgency).toBe('critical');
      expect(sorted[1].urgency).toBe('high');
      expect(sorted[2].urgency).toBe('medium');
      expect(sorted[3].urgency).toBe('low');
    });

    it('should sort by days until stockout', () => {
      const predictions: StockPrediction[] = [
        { daysUntilStockout: 15 } as StockPrediction,
        { daysUntilStockout: 3 } as StockPrediction,
        { daysUntilStockout: 7 } as StockPrediction,
      ];

      const sorted = [...predictions].sort(
        (a, b) => a.daysUntilStockout - b.daysUntilStockout
      );

      expect(sorted[0].daysUntilStockout).toBe(3);
      expect(sorted[1].daysUntilStockout).toBe(7);
      expect(sorted[2].daysUntilStockout).toBe(15);
    });
  });

  describe('Filtering', () => {
    it('should filter by status', () => {
      const predictions: StockPrediction[] = [
        { status: 'critical' } as StockPrediction,
        { status: 'optimal' } as StockPrediction,
        { status: 'low' } as StockPrediction,
        { status: 'optimal' } as StockPrediction,
      ];

      const filterByStatus = (status: StockStatus) =>
        predictions.filter(p => p.status === status);

      expect(filterByStatus('optimal')).toHaveLength(2);
      expect(filterByStatus('critical')).toHaveLength(1);
      expect(filterByStatus('excess')).toHaveLength(0);
    });

    it('should filter by search query', () => {
      const predictions: StockPrediction[] = [
        { partName: 'Filtro de Óleo' } as StockPrediction,
        { partName: 'Filtro de Ar' } as StockPrediction,
        { partName: 'Vela de Ignição' } as StockPrediction,
      ];

      const searchByName = (query: string) =>
        predictions.filter(p => 
          p.partName.toLowerCase().includes(query.toLowerCase())
        );

      expect(searchByName('filtro')).toHaveLength(2);
      expect(searchByName('vela')).toHaveLength(1);
      expect(searchByName('pastilha')).toHaveLength(0);
    });
  });
});
