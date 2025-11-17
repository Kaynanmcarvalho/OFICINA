/**
 * Cost Analysis Service Tests
 * Testes unitários para o serviço de análise de custos
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { CostAnalysisService } from '../../src/services/costAnalysisService';

describe('CostAnalysisService', () => {
  let service;

  beforeEach(() => {
    service = new CostAnalysisService();
  });

  describe('calculateItemCost', () => {
    it('should calculate cost correctly', () => {
      const item = { costPrice: 100, quantity: 2 };
      expect(service.calculateItemCost(item)).toBe(200);
    });

    it('should handle missing quantity', () => {
      const item = { costPrice: 100 };
      expect(service.calculateItemCost(item)).toBe(100);
    });

    it('should handle missing costPrice', () => {
      const item = { quantity: 2 };
      expect(service.calculateItemCost(item)).toBe(0);
    });
  });

  describe('calculateItemMargin', () => {
    it('should calculate margin correctly', () => {
      const item = { costPrice: 100, price: 150, quantity: 1 };
      expect(service.calculateItemMargin(item)).toBe(33.33);
    });

    it('should return 0 for zero price', () => {
      const item = { costPrice: 100, price: 0, quantity: 1 };
      expect(service.calculateItemMargin(item)).toBe(0);
    });

    it('should handle negative margin', () => {
      const item = { costPrice: 150, price: 100, quantity: 1 };
      expect(service.calculateItemMargin(item)).toBe(-50);
    });
  });

  describe('calculateTotalCost', () => {
    it('should calculate total cost correctly', () => {
      const items = [
        { costPrice: 100, quantity: 2 },
        { costPrice: 50, quantity: 1 }
      ];
      expect(service.calculateTotalCost(items)).toBe(250);
    });

    it('should handle empty array', () => {
      expect(service.calculateTotalCost([])).toBe(0);
    });
  });

  describe('calculateTotalMargin', () => {
    it('should calculate total margin correctly', () => {
      const items = [
        { costPrice: 100, price: 150, quantity: 1 },
        { costPrice: 50, price: 80, quantity: 1 }
      ];
      const margin = service.calculateTotalMargin(items);
      expect(margin).toBeCloseTo(34.78, 2);
    });
  });

  describe('validateMargin', () => {
    it('should validate good margin', () => {
      const result = service.validateMargin(30, 20);
      expect(result.isValid).toBe(true);
      expect(result.status).toBe('good');
    });

    it('should validate low margin', () => {
      const result = service.validateMargin(15, 20);
      expect(result.isValid).toBe(false);
      expect(result.status).toBe('low');
    });
  });

  describe('suggestPrice', () => {
    it('should suggest price correctly', () => {
      const price = service.suggestPrice(100, 35);
      expect(price).toBeCloseTo(153.85, 2);
    });

    it('should handle 0% margin', () => {
      const price = service.suggestPrice(100, 0);
      expect(price).toBe(100);
    });

    it('should handle 100% margin', () => {
      const price = service.suggestPrice(100, 100);
      expect(price).toBe(100);
    });
  });

  describe('applyMarkup', () => {
    it('should apply markup correctly', () => {
      const price = service.applyMarkup(100, 1.5);
      expect(price).toBe(150);
    });

    it('should use default markup', () => {
      const price = service.applyMarkup(100);
      expect(price).toBe(150); // default markup 1.5
    });
  });

  describe('calculateBreakEven', () => {
    it('should calculate break even correctly', () => {
      const breakEven = service.calculateBreakEven(1000, 35);
      expect(breakEven).toBeCloseTo(1538.46, 2);
    });

    it('should handle 0% margin', () => {
      const breakEven = service.calculateBreakEven(1000, 0);
      expect(breakEven).toBe(0);
    });
  });

  describe('generateRecommendations', () => {
    it('should generate warning for low margin', () => {
      const itemsAnalysis = [
        { margin: 15, description: 'Item 1' }
      ];
      const recommendations = service.generateRecommendations(
        itemsAnalysis,
        15,
        { minMargin: 20, targetMargin: 35 }
      );
      
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0].type).toBe('warning');
    });

    it('should generate success for excellent margin', () => {
      const itemsAnalysis = [
        { margin: 45, description: 'Item 1' }
      ];
      const recommendations = service.generateRecommendations(
        itemsAnalysis,
        45,
        { minMargin: 20, targetMargin: 35 }
      );
      
      const successRec = recommendations.find(r => r.type === 'success');
      expect(successRec).toBeDefined();
    });
  });
});
