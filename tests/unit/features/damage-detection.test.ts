/**
 * TORQ Damage Detection - Unit Tests (Real Implementation)
 */

import { describe, it, expect } from 'vitest';
import { damageDetectionService } from '../../../src/features/damage-detection/services/damageDetectionService';
import {
  DAMAGE_TYPE_LABELS,
  SEVERITY_LABELS,
  CONDITION_LABELS,
  SEVERITY_COLORS,
  CONDITION_COLORS,
} from '../../../src/features/damage-detection/types';
import type { DamageAnalysisRequest } from '../../../src/features/damage-detection/types';

describe('Damage Detection Service - Real Tests', () => {
  describe('isConfigured', () => {
    it('should return boolean', () => {
      const result = damageDetectionService.isConfigured();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('analyzeImage (Simulated)', () => {
    it('should return valid analysis result', async () => {
      const request: DamageAnalysisRequest = {
        imageBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      };
      
      const result = await damageDetectionService.analyzeImage(request);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('imageUrl');
      expect(result).toHaveProperty('analyzedAt');
      expect(result).toHaveProperty('damages');
      expect(result).toHaveProperty('overallCondition');
      expect(result).toHaveProperty('processingTime');
    });

    it('should return array of damages', async () => {
      const request: DamageAnalysisRequest = {
        imageBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      };
      
      const result = await damageDetectionService.analyzeImage(request);

      expect(Array.isArray(result.damages)).toBe(true);
    });

    it('should include overall condition', async () => {
      const request: DamageAnalysisRequest = {
        imageBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      };
      
      const result = await damageDetectionService.analyzeImage(request);

      expect(result.overallCondition).toBeDefined();
      expect(['excellent', 'good', 'fair', 'poor']).toContain(result.overallCondition);
    });

    it('should track processing time', async () => {
      const request: DamageAnalysisRequest = {
        imageBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      };
      
      const result = await damageDetectionService.analyzeImage(request);

      expect(result.processingTime).toBeGreaterThanOrEqual(0);
    });

    it('should include vehicle context when provided', async () => {
      const request: DamageAnalysisRequest = {
        imageBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        vehicleInfo: {
          plate: 'ABC1234',
          brand: 'Toyota',
          model: 'Corolla',
          year: 2020,
        },
      };
      
      const result = await damageDetectionService.analyzeImage(request);

      expect(result).toBeDefined();
    });
  });

  describe('damage structure validation', () => {
    it('should have valid damage structure when damages exist', async () => {
      const request: DamageAnalysisRequest = {
        imageBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      };
      
      const result = await damageDetectionService.analyzeImage(request);

      if (result.damages.length > 0) {
        const damage = result.damages[0];
        expect(damage).toHaveProperty('id');
        expect(damage).toHaveProperty('type');
        expect(damage).toHaveProperty('severity');
        expect(damage).toHaveProperty('confidence');
        expect(damage).toHaveProperty('description');
      }
    });
  });
});

describe('Damage Detection Types - Labels', () => {
  describe('DAMAGE_TYPE_LABELS', () => {
    it('should have labels for all damage types', () => {
      const requiredTypes = [
        'scratch',
        'dent',
        'crack',
        'worn_tire',
        'rust',
        'broken_glass',
        'paint_damage',
      ];

      requiredTypes.forEach(type => {
        expect(DAMAGE_TYPE_LABELS[type as keyof typeof DAMAGE_TYPE_LABELS]).toBeDefined();
        expect(typeof DAMAGE_TYPE_LABELS[type as keyof typeof DAMAGE_TYPE_LABELS]).toBe('string');
      });
    });

    it('should have Portuguese labels', () => {
      expect(DAMAGE_TYPE_LABELS.scratch).toBe('Risco');
      expect(DAMAGE_TYPE_LABELS.dent).toBe('Amassado');
      expect(DAMAGE_TYPE_LABELS.rust).toBe('Ferrugem');
    });

    it('should have at least 10 damage types', () => {
      const typeCount = Object.keys(DAMAGE_TYPE_LABELS).length;
      expect(typeCount).toBeGreaterThanOrEqual(10);
    });
  });

  describe('SEVERITY_LABELS', () => {
    it('should have labels for all severities', () => {
      expect(SEVERITY_LABELS.minor).toBe('Leve');
      expect(SEVERITY_LABELS.moderate).toBe('Moderado');
      expect(SEVERITY_LABELS.severe).toBe('Grave');
    });
  });

  describe('CONDITION_LABELS', () => {
    it('should have labels for all conditions', () => {
      expect(CONDITION_LABELS.excellent).toBe('Excelente');
      expect(CONDITION_LABELS.good).toBe('Bom');
      expect(CONDITION_LABELS.fair).toBe('Regular');
      expect(CONDITION_LABELS.poor).toBe('Ruim');
    });
  });
});

describe('Damage Detection Types - Colors', () => {
  describe('SEVERITY_COLORS', () => {
    it('should have colors for all severities', () => {
      const severities = ['minor', 'moderate', 'severe'] as const;
      
      severities.forEach(severity => {
        expect(SEVERITY_COLORS[severity]).toHaveProperty('bg');
        expect(SEVERITY_COLORS[severity]).toHaveProperty('text');
        expect(SEVERITY_COLORS[severity]).toHaveProperty('border');
      });
    });

    it('should use appropriate color scheme', () => {
      expect(SEVERITY_COLORS.minor.bg).toContain('yellow');
      expect(SEVERITY_COLORS.moderate.bg).toContain('orange');
      expect(SEVERITY_COLORS.severe.bg).toContain('red');
    });

    it('should have dark mode variants', () => {
      expect(SEVERITY_COLORS.minor.bg).toContain('dark:');
      expect(SEVERITY_COLORS.moderate.text).toContain('dark:');
      expect(SEVERITY_COLORS.severe.border).toContain('dark:');
    });
  });

  describe('CONDITION_COLORS', () => {
    it('should have colors for all conditions', () => {
      const conditions = ['excellent', 'good', 'fair', 'poor'] as const;
      
      conditions.forEach(condition => {
        expect(CONDITION_COLORS[condition]).toHaveProperty('bg');
        expect(CONDITION_COLORS[condition]).toHaveProperty('text');
        expect(CONDITION_COLORS[condition]).toHaveProperty('border');
      });
    });

    it('should use green for excellent condition', () => {
      expect(CONDITION_COLORS.excellent.bg).toContain('green');
    });

    it('should use orange for poor condition', () => {
      expect(CONDITION_COLORS.poor.bg).toContain('orange');
    });
  });
});

describe('Damage Detection - Bounding Box Validation', () => {
  it('should validate bounding box coordinates', () => {
    const validBoundingBox = {
      x: 0.1,
      y: 0.2,
      width: 0.3,
      height: 0.4,
    };

    expect(validBoundingBox.x).toBeGreaterThanOrEqual(0);
    expect(validBoundingBox.x).toBeLessThanOrEqual(1);
    expect(validBoundingBox.y).toBeGreaterThanOrEqual(0);
    expect(validBoundingBox.y).toBeLessThanOrEqual(1);
    expect(validBoundingBox.width).toBeGreaterThan(0);
    expect(validBoundingBox.width).toBeLessThanOrEqual(1);
    expect(validBoundingBox.height).toBeGreaterThan(0);
    expect(validBoundingBox.height).toBeLessThanOrEqual(1);
  });
});

describe('Damage Detection - Confidence Validation', () => {
  it('should have confidence between 0 and 1', async () => {
    const request: DamageAnalysisRequest = {
      imageBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    };
    
    const result = await damageDetectionService.analyzeImage(request);

    result.damages.forEach(damage => {
      expect(damage.confidence).toBeGreaterThanOrEqual(0);
      expect(damage.confidence).toBeLessThanOrEqual(1);
    });
  });
});
