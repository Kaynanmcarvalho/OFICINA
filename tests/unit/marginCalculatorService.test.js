/**
 * Margin Calculator Service Tests
 * Testes unitários para o serviço de cálculo de margens
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { MarginCalculatorService } from '../../src/services/marginCalculatorService';

describe('MarginCalculatorService', () => {
  let service;

  beforeEach(() => {
    service = new MarginCalculatorService();
  });

  describe('calculateMarkup', () => {
    it('should calculate markup correctly', () => {
      expect(service.calculateMarkup(100, 150)).toBe(1.5);
    });

    it('should handle zero cost', () => {
      expect(service.calculateMarkup(0, 150)).toBe(0);
    });
  });

  describe('calculateMargin', () => {
    it('should calculate margin correctly', () => {
      expect(service.calculateMargin(100, 150)).toBe(33.33);
    });

    it('should handle zero price', () => {
      expect(service.calculateMargin(100, 0)).toBe(0);
    });

    it('should handle negative margin', () => {
      expect(service.calculateMargin(150, 100)).toBe(-50);
    });
  });

  describe('calculateProfit', () => {
    it('should calculate profit correctly', () => {
      expect(service.calculateProfit(100, 150)).toBe(50);
    });

    it('should handle loss', () => {
      expect(service.calculateProfit(150, 100)).toBe(-50);
    });
  });

  describe('suggestPrice', () => {
    it('should suggest price for 35% margin', () => {
      const price = service.suggestPrice(100, 35);
      expect(price).toBeCloseTo(153.85, 2);
    });

    it('should handle 0% margin', () => {
      expect(service.suggestPrice(100, 0)).toBe(100);
    });

    it('should handle 100% margin', () => {
      expect(service.suggestPrice(100, 100)).toBe(100);
    });
  });

  describe('applyMarkup', () => {
    it('should apply markup correctly', () => {
      expect(service.applyMarkup(100, 1.5)).toBe(150);
    });

    it('should apply 2x markup', () => {
      expect(service.applyMarkup(100, 2)).toBe(200);
    });
  });

  describe('marginToMarkup', () => {
    it('should convert 33.33% margin to markup', () => {
      const markup = service.marginToMarkup(33.33);
      expect(markup).toBeCloseTo(1.5, 2);
    });

    it('should handle 0% margin', () => {
      expect(service.marginToMarkup(0)).toBe(1);
    });

    it('should handle 50% margin', () => {
      expect(service.marginToMarkup(50)).toBe(2);
    });
  });

  describe('markupToMargin', () => {
    it('should convert 1.5x markup to margin', () => {
      const margin = service.markupToMargin(1.5);
      expect(margin).toBeCloseTo(33.33, 2);
    });

    it('should handle 1x markup', () => {
      expect(service.markupToMargin(1)).toBe(0);
    });

    it('should handle 2x markup', () => {
      expect(service.markupToMargin(2)).toBe(50);
    });
  });

  describe('calculateDiscount', () => {
    it('should calculate discount correctly', () => {
      expect(service.calculateDiscount(100, 80)).toBe(20);
    });

    it('should handle zero original price', () => {
      expect(service.calculateDiscount(0, 80)).toBe(0);
    });
  });

  describe('applyDiscount', () => {
    it('should apply 20% discount', () => {
      expect(service.applyDiscount(100, 20)).toBe(80);
    });

    it('should apply 50% discount', () => {
      expect(service.applyDiscount(100, 50)).toBe(50);
    });
  });

  describe('calculateROI', () => {
    it('should calculate ROI correctly', () => {
      expect(service.calculateROI(100, 50)).toBe(50);
    });

    it('should handle zero cost', () => {
      expect(service.calculateROI(0, 50)).toBe(0);
    });

    it('should handle negative profit', () => {
      expect(service.calculateROI(100, -20)).toBe(-20);
    });
  });

  describe('isHealthyMargin', () => {
    it('should identify excellent margin', () => {
      const result = service.isHealthyMargin(40, 20, 35);
      expect(result.isHealthy).toBe(true);
      expect(result.isTarget).toBe(true);
      expect(result.status).toBe('excellent');
    });

    it('should identify good margin', () => {
      const result = service.isHealthyMargin(25, 20, 35);
      expect(result.isHealthy).toBe(true);
      expect(result.isTarget).toBe(false);
      expect(result.status).toBe('good');
    });

    it('should identify low margin', () => {
      const result = service.isHealthyMargin(15, 20, 35);
      expect(result.isHealthy).toBe(false);
      expect(result.status).toBe('low');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      const formatted = service.formatCurrency(1234.56);
      expect(formatted).toContain('1.234,56');
    });
  });

  describe('formatPercent', () => {
    it('should format percent correctly', () => {
      expect(service.formatPercent(35.5)).toBe('35.50%');
    });
  });

  describe('comparePrices', () => {
    it('should compare prices correctly', () => {
      const result = service.comparePrices(150, [140, 145, 155]);
      expect(result.position).toBe('above');
      expect(result.avgCompetitorPrice).toBeCloseTo(146.67, 2);
    });

    it('should handle empty competitor prices', () => {
      const result = service.comparePrices(150, []);
      expect(result.position).toBe('unknown');
    });
  });
});
