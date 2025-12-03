/**
 * TORQ Parts Compatibility - Unit Tests
 * Testes unitários para o módulo de compatibilidade de peças
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type {
  Part,
  PartCategory,
  VehicleCompatibility,
  CompatibilitySearchRequest,
  PartWithCompatibility,
  PartAlternative,
  VehiclePartsProfile,
  PartUsageRecord,
} from '../../../src/features/parts-compatibility/types';
import {
  PART_CATEGORY_LABELS,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  POPULAR_MAKES,
  POPULAR_PART_BRANDS,
} from '../../../src/features/parts-compatibility/types';

describe('Parts Compatibility Module', () => {
  describe('Types', () => {
    it('should have all part categories defined', () => {
      const categories: PartCategory[] = [
        'engine', 'transmission', 'brakes', 'suspension', 'electrical',
        'cooling', 'fuel', 'exhaust', 'body', 'interior', 'filters',
        'oils', 'tires', 'accessories', 'other'
      ];

      categories.forEach(category => {
        expect(PART_CATEGORY_LABELS[category]).toBeDefined();
        expect(CATEGORY_COLORS[category]).toBeDefined();
        expect(CATEGORY_ICONS[category]).toBeDefined();
      });
    });

    it('should have labels in Portuguese', () => {
      expect(PART_CATEGORY_LABELS.engine).toBe('Motor');
      expect(PART_CATEGORY_LABELS.brakes).toBe('Freios');
      expect(PART_CATEGORY_LABELS.filters).toBe('Filtros');
      expect(PART_CATEGORY_LABELS.oils).toBe('Óleos e Fluidos');
    });

    it('should have color definitions for all categories', () => {
      Object.values(CATEGORY_COLORS).forEach(colors => {
        expect(colors.bg).toBeDefined();
        expect(colors.text).toBeDefined();
        expect(colors.icon).toBeDefined();
      });
    });

    it('should have popular makes list', () => {
      expect(POPULAR_MAKES).toContain('Chevrolet');
      expect(POPULAR_MAKES).toContain('Fiat');
      expect(POPULAR_MAKES).toContain('Volkswagen');
      expect(POPULAR_MAKES.length).toBeGreaterThanOrEqual(10);
    });

    it('should have popular part brands list', () => {
      expect(POPULAR_PART_BRANDS).toContain('Bosch');
      expect(POPULAR_PART_BRANDS).toContain('NGK');
      expect(POPULAR_PART_BRANDS).toContain('Valeo');
      expect(POPULAR_PART_BRANDS.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe('Part Interface', () => {
    it('should create valid part object', () => {
      const part: Part = {
        id: 'part-001',
        name: 'Filtro de Óleo',
        partNumber: 'OC 500',
        brand: 'Mann',
        category: 'filters',
        price: 45.90,
        costPrice: 32.00,
        stockQuantity: 15,
        minStock: 5,
        compatibleVehicles: [
          {
            make: 'Chevrolet',
            model: 'Onix',
            yearStart: 2017,
            yearEnd: 2024,
            engine: '1.0 Turbo',
            transmission: 'all',
          }
        ],
        empresaId: 'empresa-001',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(part.id).toBe('part-001');
      expect(part.category).toBe('filters');
      expect(part.compatibleVehicles).toHaveLength(1);
      expect(part.compatibleVehicles[0].make).toBe('Chevrolet');
    });

    it('should handle optional fields', () => {
      const minimalPart: Part = {
        id: 'part-002',
        name: 'Vela de Ignição',
        partNumber: 'BKR6E',
        brand: 'NGK',
        category: 'electrical',
        price: 28.00,
        compatibleVehicles: [],
        empresaId: 'empresa-001',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(minimalPart.costPrice).toBeUndefined();
      expect(minimalPart.stockQuantity).toBeUndefined();
      expect(minimalPart.description).toBeUndefined();
    });
  });

  describe('Vehicle Compatibility', () => {
    it('should create valid compatibility object', () => {
      const compat: VehicleCompatibility = {
        make: 'Fiat',
        model: 'Argo',
        yearStart: 2018,
        yearEnd: 2024,
        engine: '1.0 Firefly',
        transmission: 'manual',
        notes: 'Verificar versão do motor',
      };

      expect(compat.make).toBe('Fiat');
      expect(compat.yearEnd - compat.yearStart).toBe(6);
    });

    it('should support all transmission types', () => {
      const transmissions: VehicleCompatibility['transmission'][] = [
        'manual', 'automatic', 'cvt', 'all'
      ];

      transmissions.forEach(trans => {
        const compat: VehicleCompatibility = {
          make: 'Honda',
          model: 'Civic',
          yearStart: 2020,
          yearEnd: 2024,
          transmission: trans,
        };
        expect(compat.transmission).toBe(trans);
      });
    });
  });

  describe('Compatibility Search', () => {
    it('should create valid search request', () => {
      const request: CompatibilitySearchRequest = {
        vehicleMake: 'Toyota',
        vehicleModel: 'Corolla',
        vehicleYear: 2022,
        vehicleEngine: '2.0',
        partCategory: 'filters',
        inStockOnly: true,
        priceMax: 100,
      };

      expect(request.vehicleMake).toBe('Toyota');
      expect(request.inStockOnly).toBe(true);
    });

    it('should support part-based search', () => {
      const request: CompatibilitySearchRequest = {
        partNumber: 'OC 500',
        partBrand: 'Mann',
      };

      expect(request.partNumber).toBe('OC 500');
      expect(request.vehicleMake).toBeUndefined();
    });
  });

  describe('Part With Compatibility', () => {
    it('should include compatibility score', () => {
      const part: PartWithCompatibility = {
        id: 'part-003',
        name: 'Pastilha de Freio',
        partNumber: 'P85075',
        brand: 'Bosch',
        category: 'brakes',
        price: 189.90,
        compatibleVehicles: [],
        empresaId: 'empresa-001',
        createdAt: new Date(),
        updatedAt: new Date(),
        compatibilityScore: 95,
        compatibilityNotes: 'Verificar versão do ABS',
        isExactMatch: false,
      };

      expect(part.compatibilityScore).toBe(95);
      expect(part.isExactMatch).toBe(false);
      expect(part.compatibilityNotes).toBeDefined();
    });

    it('should mark exact matches', () => {
      const exactMatch: PartWithCompatibility = {
        id: 'part-004',
        name: 'Filtro de Ar',
        partNumber: 'C 2420',
        brand: 'Mann',
        category: 'filters',
        price: 65.00,
        compatibleVehicles: [],
        empresaId: 'empresa-001',
        createdAt: new Date(),
        updatedAt: new Date(),
        compatibilityScore: 100,
        isExactMatch: true,
      };

      expect(exactMatch.compatibilityScore).toBe(100);
      expect(exactMatch.isExactMatch).toBe(true);
    });
  });

  describe('Part Alternative', () => {
    it('should define alternative relationships', () => {
      const alternative: PartAlternative = {
        originalPartId: 'part-001',
        alternativePartId: 'part-005',
        compatibilityLevel: 'equivalent',
        priceDifference: -15.00,
        qualityComparison: 'same',
        notes: 'Marca paralela com mesma especificação',
      };

      expect(alternative.compatibilityLevel).toBe('equivalent');
      expect(alternative.priceDifference).toBeLessThan(0);
    });

    it('should support all compatibility levels', () => {
      const levels: PartAlternative['compatibilityLevel'][] = [
        'exact', 'equivalent', 'similar'
      ];

      levels.forEach(level => {
        const alt: PartAlternative = {
          originalPartId: 'part-001',
          alternativePartId: 'part-002',
          compatibilityLevel: level,
          priceDifference: 0,
          qualityComparison: 'same',
        };
        expect(alt.compatibilityLevel).toBe(level);
      });
    });
  });

  describe('Part Usage Record', () => {
    it('should track part usage', () => {
      const usage: PartUsageRecord = {
        partId: 'part-001',
        partName: 'Filtro de Óleo',
        partNumber: 'OC 500',
        usedAt: new Date('2024-01-15'),
        quantity: 1,
        price: 45.90,
        serviceId: 'service-001',
        mileageAtUse: 45000,
      };

      expect(usage.quantity).toBe(1);
      expect(usage.mileageAtUse).toBe(45000);
    });
  });

  describe('Vehicle Parts Profile', () => {
    it('should aggregate vehicle parts data', () => {
      const profile: VehiclePartsProfile = {
        vehicleId: 'vehicle-001',
        vehiclePlate: 'ABC1234',
        vehicleInfo: {
          make: 'Chevrolet',
          model: 'Onix',
          year: 2022,
          engine: '1.0 Turbo',
        },
        compatiblePartsByCategory: {
          engine: 25,
          transmission: 10,
          brakes: 15,
          suspension: 12,
          electrical: 30,
          cooling: 8,
          fuel: 5,
          exhaust: 4,
          body: 20,
          interior: 10,
          filters: 18,
          oils: 12,
          tires: 6,
          accessories: 15,
          other: 5,
        },
        recommendedParts: [
          {
            partId: 'part-001',
            partName: 'Filtro de Óleo',
            reason: 'Última troca há 180 dias',
            priority: 'high',
          }
        ],
        partsHistory: [],
        totalPartsUsed: 12,
        totalSpentOnParts: 1250.00,
        mostUsedCategory: 'filters',
      };

      expect(profile.vehiclePlate).toBe('ABC1234');
      expect(profile.totalPartsUsed).toBe(12);
      expect(profile.mostUsedCategory).toBe('filters');
      expect(profile.recommendedParts).toHaveLength(1);
    });
  });

  describe('Compatibility Score Calculation', () => {
    it('should calculate score based on match criteria', () => {
      // Simula cálculo de score
      const calculateScore = (
        partCompat: VehicleCompatibility,
        searchMake: string,
        searchModel: string,
        searchYear: number
      ): number => {
        let score = 0;

        // Marca (40 pontos)
        if (partCompat.make.toLowerCase() === searchMake.toLowerCase()) {
          score += 40;
        }

        // Modelo (30 pontos)
        if (partCompat.model.toLowerCase() === searchModel.toLowerCase()) {
          score += 30;
        }

        // Ano (20 pontos)
        if (searchYear >= partCompat.yearStart && searchYear <= partCompat.yearEnd) {
          score += 20;
        }

        // Motor não especificado (10 pontos)
        score += 10;

        return score;
      };

      const compat: VehicleCompatibility = {
        make: 'Chevrolet',
        model: 'Onix',
        yearStart: 2017,
        yearEnd: 2024,
      };

      // Match exato
      expect(calculateScore(compat, 'Chevrolet', 'Onix', 2022)).toBe(100);

      // Marca diferente
      expect(calculateScore(compat, 'Fiat', 'Onix', 2022)).toBe(60);

      // Ano fora do range
      expect(calculateScore(compat, 'Chevrolet', 'Onix', 2016)).toBe(80);
    });
  });

  describe('Price Formatting', () => {
    it('should format prices correctly', () => {
      const formatPrice = (value: number): string => {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(value);
      };

      expect(formatPrice(45.90)).toBe('R$\u00A045,90');
      expect(formatPrice(1250.00)).toBe('R$\u00A01.250,00');
      expect(formatPrice(0)).toBe('R$\u00A00,00');
    });
  });

  describe('Stock Status', () => {
    it('should determine stock status correctly', () => {
      const getStockStatus = (quantity?: number, minStock?: number): string => {
        if (!quantity || quantity <= 0) return 'out_of_stock';
        if (minStock && quantity <= minStock) return 'low_stock';
        return 'in_stock';
      };

      expect(getStockStatus(15, 5)).toBe('in_stock');
      expect(getStockStatus(5, 5)).toBe('low_stock');
      expect(getStockStatus(0, 5)).toBe('out_of_stock');
      expect(getStockStatus(undefined, 5)).toBe('out_of_stock');
    });
  });

  describe('Category Filtering', () => {
    it('should filter parts by category', () => {
      const parts: PartWithCompatibility[] = [
        { id: '1', category: 'filters', compatibilityScore: 100, isExactMatch: true } as PartWithCompatibility,
        { id: '2', category: 'oils', compatibilityScore: 100, isExactMatch: true } as PartWithCompatibility,
        { id: '3', category: 'filters', compatibilityScore: 90, isExactMatch: false } as PartWithCompatibility,
        { id: '4', category: 'brakes', compatibilityScore: 100, isExactMatch: true } as PartWithCompatibility,
      ];

      const filterByCategory = (category: PartCategory | null) => {
        if (!category) return parts;
        return parts.filter(p => p.category === category);
      };

      expect(filterByCategory(null)).toHaveLength(4);
      expect(filterByCategory('filters')).toHaveLength(2);
      expect(filterByCategory('brakes')).toHaveLength(1);
      expect(filterByCategory('engine')).toHaveLength(0);
    });
  });

  describe('Sorting', () => {
    it('should sort by compatibility score', () => {
      const parts: PartWithCompatibility[] = [
        { id: '1', compatibilityScore: 80 } as PartWithCompatibility,
        { id: '2', compatibilityScore: 100 } as PartWithCompatibility,
        { id: '3', compatibilityScore: 95 } as PartWithCompatibility,
      ];

      const sorted = [...parts].sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      expect(sorted[0].id).toBe('2');
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('1');
    });

    it('should sort by price', () => {
      const parts: Part[] = [
        { id: '1', price: 150 } as Part,
        { id: '2', price: 45 } as Part,
        { id: '3', price: 89 } as Part,
      ];

      const sortedAsc = [...parts].sort((a, b) => a.price - b.price);
      const sortedDesc = [...parts].sort((a, b) => b.price - a.price);

      expect(sortedAsc[0].id).toBe('2');
      expect(sortedDesc[0].id).toBe('1');
    });
  });
});
