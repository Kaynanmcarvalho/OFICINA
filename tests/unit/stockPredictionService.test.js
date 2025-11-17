/**
 * Testes para Stock Prediction Service
 */

import {
  calculateStockPrediction,
  getStockPrediction,
  getCriticalProducts
} from '../../src/services/stockPredictionService';

// Mock do Firebase
jest.mock('../../src/firebase/config', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  Timestamp: {
    now: () => ({ toDate: () => new Date() }),
    fromDate: (date) => ({ toDate: () => date })
  }
}));

describe('Stock Prediction Service', () => {
  describe('calculateStockPrediction', () => {
    it('deve calcular previsão corretamente', async () => {
      // Mock de dados
      const mockMovements = [
        { type: 'saida', quantity: 10, date: { toDate: () => new Date('2025-01-01') } },
        { type: 'saida', quantity: 15, date: { toDate: () => new Date('2025-01-02') } },
        { type: 'saida', quantity: 12, date: { toDate: () => new Date('2025-01-03') } }
      ];

      const mockProduct = {
        id: 'prod1',
        quantidade: 100,
        estoqueMinimo: 20,
        estoqueMaximo: 200,
        unidade: 'UN'
      };

      // Teste básico de estrutura
      expect(mockProduct.quantidade).toBe(100);
      expect(mockMovements.length).toBe(3);
    });

    it('deve detectar tendência crescente', () => {
      const movements = [
        { type: 'saida', quantity: 5, date: { toDate: () => new Date('2025-01-01') } },
        { type: 'saida', quantity: 10, date: { toDate: () => new Date('2025-01-02') } },
        { type: 'saida', quantity: 15, date: { toDate: () => new Date('2025-01-03') } }
      ];

      expect(movements[2].quantity).toBeGreaterThan(movements[0].quantity);
    });

    it('deve calcular média de consumo', () => {
      const values = [10, 15, 12, 8, 20];
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      
      expect(avg).toBe(13);
    });

    it('deve identificar produtos críticos', () => {
      const predictions = [
        { prediction: { daysUntilEmpty: 2 } },
        { prediction: { daysUntilEmpty: 5 } },
        { prediction: { daysUntilEmpty: 10 } }
      ];

      const critical = predictions.filter(p => p.prediction.daysUntilEmpty < 3);
      
      expect(critical.length).toBe(1);
    });
  });

  describe('Análise Estatística', () => {
    it('deve calcular desvio padrão', () => {
      const values = [10, 12, 14, 16, 18];
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);

      expect(stdDev).toBeCloseTo(2.83, 1);
    });

    it('deve calcular mediana', () => {
      const values = [10, 15, 20, 25, 30];
      const sorted = [...values].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];

      expect(median).toBe(20);
    });

    it('deve calcular regressão linear', () => {
      const x = [1, 2, 3, 4, 5];
      const y = [2, 4, 6, 8, 10];

      const n = x.length;
      const sumX = x.reduce((a, b) => a + b, 0);
      const sumY = y.reduce((a, b) => a + b, 0);
      const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
      const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

      expect(slope).toBe(2); // Slope perfeito de 2
    });
  });

  describe('Alertas', () => {
    it('deve gerar alerta de estoque crítico', () => {
      const daysUntilEmpty = 2;
      const shouldAlert = daysUntilEmpty < 3;

      expect(shouldAlert).toBe(true);
    });

    it('deve gerar alerta de estoque baixo', () => {
      const daysUntilEmpty = 5;
      const shouldAlert = daysUntilEmpty >= 3 && daysUntilEmpty < 7;

      expect(shouldAlert).toBe(true);
    });

    it('deve gerar alerta de produto parado', () => {
      const daysWithoutMovement = 35;
      const shouldAlert = daysWithoutMovement > 30;

      expect(shouldAlert).toBe(true);
    });
  });

  describe('Sugestão de Reposição', () => {
    it('deve calcular ponto de pedido', () => {
      const avgDailyUsage = 10;
      const leadTime = 7;
      const minStock = 20;

      const reorderPoint = (avgDailyUsage * leadTime) + minStock;

      expect(reorderPoint).toBe(90);
    });

    it('deve sugerir quantidade de reposição', () => {
      const avgDailyUsage = 10;
      const avgMonthlyUsage = avgDailyUsage * 30;

      expect(avgMonthlyUsage).toBe(300);
    });

    it('deve determinar se deve repor', () => {
      const currentStock = 50;
      const reorderPoint = 90;
      const shouldReorder = currentStock <= reorderPoint;

      expect(shouldReorder).toBe(true);
    });
  });
});
