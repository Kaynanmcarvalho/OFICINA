/**
 * TORQ Multiuse Parts - Unit Tests
 * Testes unitários para o módulo de peças multiuso
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type {
  MultiusePart,
  MultiuseAnalysis,
  MultiuseRank,
  PartCategory,
  VehicleCompatibility,
  PartUsageStats,
  MultiuseRecommendation,
  PartSubstitute,
  RecommendationType,
} from '../../../src/features/multiuse-parts/types';
import {
  PART_CATEGORY_LABELS,
  MULTIUSE_RANK_LABELS,
  RECOMMENDATION_TYPE_LABELS,
  RANK_COLORS,
  CATEGORY_COLORS,
  MULTIUSE_SCORE_THRESHOLDS,
} from '../../../src/features/multiuse-parts/types';

describe('Multiuse Parts Module', () => {
  describe('Types - Labels', () => {
    it('should have all part categories defined', () => {
      const categories: PartCategory[] = [
        'filters', 'brakes', 'suspension', 'electrical', 'engine',
        'cooling', 'transmission', 'steering', 'exhaust', 'body',
        'oils', 'accessories', 'other'
      ];

      categories.forEach(category => {
        expect(PART_CATEGORY_LABELS[category]).toBeDefined();
        expect(CATEGORY_COLORS[category]).toBeDefined();
      });
    });

    it('should have Portuguese labels for categories', () => {
      expect(PART_CATEGORY_LABELS.filters).toBe('Filtros');
      expect(PART_CATEGORY_LABELS.brakes).toBe('Freios');
      expect(PART_CATEGORY_LABELS.engine).toBe('Motor');
      expect(PART_CATEGORY_LABELS.oils).toBe('Óleos e Fluidos');
    });

    it('should have all multiuse ranks defined', () => {
      const ranks: MultiuseRank[] = ['universal', 'high', 'medium', 'low', 'specific'];

      ranks.forEach(rank => {
        expect(MULTIUSE_RANK_LABELS[rank]).toBeDefined();
        expect(RANK_COLORS[rank]).toBeDefined();
      });
    });

    it('should have Portuguese labels for ranks', () => {
      expect(MULTIUSE_RANK_LABELS.universal).toBe('Universal');
      expect(MULTIUSE_RANK_LABELS.high).toBe('Alta Versatilidade');
      expect(MULTIUSE_RANK_LABELS.medium).toBe('Média Versatilidade');
      expect(MULTIUSE_RANK_LABELS.low).toBe('Baixa Versatilidade');
      expect(MULTIUSE_RANK_LABELS.specific).toBe('Específica');
    });

    it('should have all recommendation types defined', () => {
      const types: RecommendationType[] = [
        'stock_consolidation', 'substitute_part', 'increase_stock',
        'price_optimization', 'supplier_negotiation'
      ];

      types.forEach(type => {
        expect(RECOMMENDATION_TYPE_LABELS[type]).toBeDefined();
      });
    });
  });

  describe('Types - Colors', () => {
    it('should have colors for all ranks', () => {
      Object.values(RANK_COLORS).forEach(colors => {
        expect(colors.bg).toBeDefined();
        expect(colors.text).toBeDefined();
        expect(colors.border).toBeDefined();
      });
    });

    it('should have colors for all categories', () => {
      Object.values(CATEGORY_COLORS).forEach(colors => {
        expect(colors.bg).toBeDefined();
        expect(colors.text).toBeDefined();
      });
    });

    it('should use appropriate colors for ranks', () => {
      expect(RANK_COLORS.universal.bg).toContain('purple');
      expect(RANK_COLORS.high.bg).toContain('green');
      expect(RANK_COLORS.medium.bg).toContain('blue');
      expect(RANK_COLORS.low.bg).toContain('yellow');
      expect(RANK_COLORS.specific.bg).toContain('gray');
    });
  });

  describe('Score Thresholds', () => {
    it('should have correct thresholds', () => {
      expect(MULTIUSE_SCORE_THRESHOLDS.universal).toBe(90);
      expect(MULTIUSE_SCORE_THRESHOLDS.high).toBe(70);
      expect(MULTIUSE_SCORE_THRESHOLDS.medium).toBe(50);
      expect(MULTIUSE_SCORE_THRESHOLDS.low).toBe(30);
      expect(MULTIUSE_SCORE_THRESHOLDS.specific).toBe(0);
    });

    it('should have descending thresholds', () => {
      expect(MULTIUSE_SCORE_THRESHOLDS.universal).toBeGreaterThan(MULTIUSE_SCORE_THRESHOLDS.high);
      expect(MULTIUSE_SCORE_THRESHOLDS.high).toBeGreaterThan(MULTIUSE_SCORE_THRESHOLDS.medium);
      expect(MULTIUSE_SCORE_THRESHOLDS.medium).toBeGreaterThan(MULTIUSE_SCORE_THRESHOLDS.low);
      expect(MULTIUSE_SCORE_THRESHOLDS.low).toBeGreaterThan(MULTIUSE_SCORE_THRESHOLDS.specific);
    });
  });

  describe('Rank Calculation', () => {
    it('should determine rank from score correctly', () => {
      const getRank = (score: number): MultiuseRank => {
        if (score >= MULTIUSE_SCORE_THRESHOLDS.universal) return 'universal';
        if (score >= MULTIUSE_SCORE_THRESHOLDS.high) return 'high';
        if (score >= MULTIUSE_SCORE_THRESHOLDS.medium) return 'medium';
        if (score >= MULTIUSE_SCORE_THRESHOLDS.low) return 'low';
        return 'specific';
      };

      expect(getRank(95)).toBe('universal');
      expect(getRank(90)).toBe('universal');
      expect(getRank(85)).toBe('high');
      expect(getRank(70)).toBe('high');
      expect(getRank(60)).toBe('medium');
      expect(getRank(50)).toBe('medium');
      expect(getRank(40)).toBe('low');
      expect(getRank(30)).toBe('low');
      expect(getRank(20)).toBe('specific');
      expect(getRank(0)).toBe('specific');
    });
  });

  describe('Multiuse Score Calculation', () => {
    it('should calculate score based on compatibility', () => {
      const calculateScore = (
        compatibleVehicles: VehicleCompatibility[],
        usageStats: PartUsageStats
      ): number => {
        let score = 0;

        // Pontos por marcas únicas (max 20)
        const uniqueMakes = new Set(compatibleVehicles.map(v => v.make));
        score += Math.min(20, uniqueMakes.size * 4);

        // Pontos por modelos únicos (max 20)
        const uniqueModels = new Set(compatibleVehicles.map(v => `${v.make}-${v.model}`));
        score += Math.min(20, uniqueModels.size * 2);

        // Pontos por range de anos (max 20)
        const totalYears = compatibleVehicles.reduce(
          (sum, v) => sum + (v.yearEnd - v.yearStart + 1),
          0
        );
        score += Math.min(20, totalYears);

        // Pontos por uso em diferentes veículos (max 20)
        score += Math.min(20, usageStats.usedInDifferentVehicles * 2);

        // Pontos por frequência de uso (max 20)
        score += Math.min(20, usageStats.averageMonthlyUsage * 4);

        return Math.min(100, Math.round(score));
      };

      // Peça universal
      const universalVehicles: VehicleCompatibility[] = [
        { make: 'Chevrolet', model: 'Onix', yearStart: 2017, yearEnd: 2024, verified: true },
        { make: 'Fiat', model: 'Argo', yearStart: 2018, yearEnd: 2024, verified: true },
        { make: 'Volkswagen', model: 'Polo', yearStart: 2018, yearEnd: 2024, verified: true },
        { make: 'Ford', model: 'Ka', yearStart: 2015, yearEnd: 2023, verified: true },
        { make: 'Hyundai', model: 'HB20', yearStart: 2016, yearEnd: 2024, verified: true },
      ];
      const highUsage: PartUsageStats = {
        totalUsed: 100,
        usedInServices: 80,
        usedInDifferentVehicles: 15,
        averageMonthlyUsage: 8,
        usageByMake: {},
        usageByModel: {},
        usageTrend: 'increasing',
      };

      const universalScore = calculateScore(universalVehicles, highUsage);
      expect(universalScore).toBeGreaterThanOrEqual(90);

      // Peça específica
      const specificVehicles: VehicleCompatibility[] = [
        { make: 'BMW', model: 'X5', yearStart: 2020, yearEnd: 2022, verified: true },
      ];
      const lowUsage: PartUsageStats = {
        totalUsed: 5,
        usedInServices: 5,
        usedInDifferentVehicles: 2,
        averageMonthlyUsage: 0.5,
        usageByMake: {},
        usageByModel: {},
        usageTrend: 'stable',
      };

      const specificScore = calculateScore(specificVehicles, lowUsage);
      expect(specificScore).toBeLessThan(30);
    });
  });

  describe('Vehicle Compatibility Structure', () => {
    it('should create valid compatibility', () => {
      const compat: VehicleCompatibility = {
        make: 'Chevrolet',
        model: 'Onix',
        yearStart: 2017,
        yearEnd: 2024,
        engine: '1.0 Turbo',
        notes: 'Todas as versões',
        verified: true,
      };

      expect(compat.make).toBe('Chevrolet');
      expect(compat.yearEnd - compat.yearStart).toBe(7);
      expect(compat.verified).toBe(true);
    });
  });

  describe('Part Usage Stats Structure', () => {
    it('should create valid usage stats', () => {
      const stats: PartUsageStats = {
        totalUsed: 150,
        usedInServices: 120,
        usedInDifferentVehicles: 45,
        averageMonthlyUsage: 12.5,
        usageByMake: {
          'Chevrolet': 50,
          'Fiat': 40,
          'Volkswagen': 30,
        },
        usageByModel: {
          'Onix': 30,
          'Argo': 25,
          'Polo': 20,
        },
        usageTrend: 'increasing',
        firstUsed: new Date('2023-01-01'),
        lastUsed: new Date('2024-01-15'),
      };

      expect(stats.totalUsed).toBe(150);
      expect(stats.usedInDifferentVehicles).toBe(45);
      expect(Object.keys(stats.usageByMake)).toHaveLength(3);
    });
  });

  describe('Multiuse Part Structure', () => {
    it('should create valid multiuse part', () => {
      const part: MultiusePart = {
        id: 'part-001',
        partId: 'part-001',
        partNumber: 'OC 500',
        name: 'Filtro de Óleo',
        brand: 'Mann',
        category: 'filters',
        compatibleVehicles: [],
        totalCompatibleModels: 15,
        totalCompatibleYears: 50,
        usageStats: {
          totalUsed: 100,
          usedInServices: 80,
          usedInDifferentVehicles: 30,
          averageMonthlyUsage: 8,
          usageByMake: {},
          usageByModel: {},
          usageTrend: 'stable',
        },
        pricing: {
          unitPrice: 45.90,
          costPrice: 32.00,
          margin: 13.90,
          marginPercent: 43.4,
          pricePosition: 'average',
          revenueGenerated: 4590,
          profitGenerated: 1390,
        },
        multiuseScore: 85,
        multiuseRank: 'high',
        empresaId: 'empresa-001',
        lastAnalyzed: new Date(),
      };

      expect(part.multiuseScore).toBe(85);
      expect(part.multiuseRank).toBe('high');
      expect(part.totalCompatibleModels).toBe(15);
    });
  });

  describe('Multiuse Analysis Structure', () => {
    it('should create valid analysis', () => {
      const analysis: MultiuseAnalysis = {
        empresaId: 'empresa-001',
        analyzedAt: new Date(),
        totalParts: 200,
        multiuseParts: 80,
        multiusePercentage: 40,
        byRank: {
          universal: 10,
          high: 30,
          medium: 40,
          low: 50,
          specific: 70,
        },
        byCategory: {} as any,
        topMultiuseParts: [],
        recommendations: [],
        potentialSavings: 5000,
        stockOptimizationPotential: 15,
      };

      expect(analysis.totalParts).toBe(200);
      expect(analysis.multiusePercentage).toBe(40);
      expect(analysis.byRank.universal + analysis.byRank.high + analysis.byRank.medium).toBe(80);
    });
  });

  describe('Recommendation Structure', () => {
    it('should create valid recommendation', () => {
      const rec: MultiuseRecommendation = {
        id: 'rec-001',
        type: 'increase_stock',
        title: 'Aumentar Estoque de Peças Universais',
        description: '5 peças universais têm alta demanda',
        impact: 'high',
        relatedParts: ['part-001', 'part-002'],
        potentialSavings: 500,
        actionRequired: 'Revisar níveis de estoque',
      };

      expect(rec.type).toBe('increase_stock');
      expect(rec.impact).toBe('high');
      expect(rec.relatedParts).toHaveLength(2);
    });
  });

  describe('Part Substitute Structure', () => {
    it('should create valid substitute', () => {
      const substitute: PartSubstitute = {
        originalPartId: 'part-001',
        originalPartNumber: 'ABC123',
        substitutePartId: 'part-002',
        substitutePartNumber: 'XYZ789',
        compatibilityLevel: 'equivalent',
        additionalVehicles: 10,
        priceDifference: -15.00,
        stockSavings: 200,
        notes: 'Mesma especificação técnica',
        verified: true,
      };

      expect(substitute.compatibilityLevel).toBe('equivalent');
      expect(substitute.additionalVehicles).toBe(10);
      expect(substitute.priceDifference).toBeLessThan(0);
    });
  });

  describe('Filtering', () => {
    it('should filter by rank', () => {
      const parts: MultiusePart[] = [
        { multiuseRank: 'universal' } as MultiusePart,
        { multiuseRank: 'high' } as MultiusePart,
        { multiuseRank: 'medium' } as MultiusePart,
        { multiuseRank: 'low' } as MultiusePart,
        { multiuseRank: 'specific' } as MultiusePart,
      ];

      const filterByRank = (rank: MultiuseRank) =>
        parts.filter(p => p.multiuseRank === rank);

      expect(filterByRank('universal')).toHaveLength(1);
      expect(filterByRank('high')).toHaveLength(1);
    });

    it('should filter by category', () => {
      const parts: MultiusePart[] = [
        { category: 'filters' } as MultiusePart,
        { category: 'filters' } as MultiusePart,
        { category: 'brakes' } as MultiusePart,
        { category: 'engine' } as MultiusePart,
      ];

      const filterByCategory = (category: PartCategory) =>
        parts.filter(p => p.category === category);

      expect(filterByCategory('filters')).toHaveLength(2);
      expect(filterByCategory('brakes')).toHaveLength(1);
      expect(filterByCategory('oils')).toHaveLength(0);
    });

    it('should filter by minimum score', () => {
      const parts: MultiusePart[] = [
        { multiuseScore: 95 } as MultiusePart,
        { multiuseScore: 75 } as MultiusePart,
        { multiuseScore: 55 } as MultiusePart,
        { multiuseScore: 35 } as MultiusePart,
        { multiuseScore: 15 } as MultiusePart,
      ];

      const filterByMinScore = (minScore: number) =>
        parts.filter(p => p.multiuseScore >= minScore);

      expect(filterByMinScore(90)).toHaveLength(1);
      expect(filterByMinScore(70)).toHaveLength(2);
      expect(filterByMinScore(50)).toHaveLength(3);
      expect(filterByMinScore(0)).toHaveLength(5);
    });
  });

  describe('Sorting', () => {
    it('should sort by score', () => {
      const parts: MultiusePart[] = [
        { multiuseScore: 60 } as MultiusePart,
        { multiuseScore: 90 } as MultiusePart,
        { multiuseScore: 75 } as MultiusePart,
      ];

      const sorted = [...parts].sort((a, b) => b.multiuseScore - a.multiuseScore);

      expect(sorted[0].multiuseScore).toBe(90);
      expect(sorted[1].multiuseScore).toBe(75);
      expect(sorted[2].multiuseScore).toBe(60);
    });

    it('should sort by usage', () => {
      const parts: MultiusePart[] = [
        { usageStats: { totalUsed: 50 } } as MultiusePart,
        { usageStats: { totalUsed: 150 } } as MultiusePart,
        { usageStats: { totalUsed: 100 } } as MultiusePart,
      ];

      const sorted = [...parts].sort(
        (a, b) => b.usageStats.totalUsed - a.usageStats.totalUsed
      );

      expect(sorted[0].usageStats.totalUsed).toBe(150);
      expect(sorted[1].usageStats.totalUsed).toBe(100);
      expect(sorted[2].usageStats.totalUsed).toBe(50);
    });

    it('should sort by profit', () => {
      const parts: MultiusePart[] = [
        { pricing: { profitGenerated: 500 } } as MultiusePart,
        { pricing: { profitGenerated: 1500 } } as MultiusePart,
        { pricing: { profitGenerated: 1000 } } as MultiusePart,
      ];

      const sorted = [...parts].sort(
        (a, b) => b.pricing.profitGenerated - a.pricing.profitGenerated
      );

      expect(sorted[0].pricing.profitGenerated).toBe(1500);
      expect(sorted[1].pricing.profitGenerated).toBe(1000);
      expect(sorted[2].pricing.profitGenerated).toBe(500);
    });
  });

  describe('Statistics Calculation', () => {
    it('should calculate multiuse percentage', () => {
      const calculatePercentage = (multiuse: number, total: number): number => {
        return total > 0 ? (multiuse / total) * 100 : 0;
      };

      expect(calculatePercentage(40, 100)).toBe(40);
      expect(calculatePercentage(80, 200)).toBe(40);
      expect(calculatePercentage(0, 100)).toBe(0);
      expect(calculatePercentage(50, 0)).toBe(0);
    });

    it('should count parts by rank', () => {
      const parts: MultiusePart[] = [
        { multiuseRank: 'universal' } as MultiusePart,
        { multiuseRank: 'universal' } as MultiusePart,
        { multiuseRank: 'high' } as MultiusePart,
        { multiuseRank: 'high' } as MultiusePart,
        { multiuseRank: 'high' } as MultiusePart,
        { multiuseRank: 'medium' } as MultiusePart,
        { multiuseRank: 'low' } as MultiusePart,
        { multiuseRank: 'specific' } as MultiusePart,
      ];

      const byRank: Record<MultiuseRank, number> = {
        universal: 0,
        high: 0,
        medium: 0,
        low: 0,
        specific: 0,
      };

      parts.forEach(p => byRank[p.multiuseRank]++);

      expect(byRank.universal).toBe(2);
      expect(byRank.high).toBe(3);
      expect(byRank.medium).toBe(1);
      expect(byRank.low).toBe(1);
      expect(byRank.specific).toBe(1);
    });
  });

  describe('Currency Formatting', () => {
    it('should format currency correctly', () => {
      const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(value);
      };

      expect(formatCurrency(45.90)).toBe('R$\u00A045,90');
      expect(formatCurrency(5000)).toBe('R$\u00A05.000,00');
      expect(formatCurrency(0)).toBe('R$\u00A00,00');
    });
  });
});
