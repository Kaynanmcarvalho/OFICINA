/**
 * TORQ Service Suggestion - Unit Tests (Real Implementation)
 */

import { describe, it, expect } from 'vitest';
import { DTC_SERVICE_MAPPINGS, DAMAGE_SERVICE_MAPPINGS, MILEAGE_SERVICES, SERVICE_BASE_PRICES } from '../../../src/features/service-suggestion/data/dtcMappings';
import { serviceSuggestionService } from '../../../src/features/service-suggestion/services/serviceSuggestionService';
import type { SuggestionRequest } from '../../../src/features/service-suggestion/types';

describe('Service Suggestion - DTC Mappings', () => {
  it('should have at least 10 DTC mappings', () => {
    expect(DTC_SERVICE_MAPPINGS.length).toBeGreaterThanOrEqual(10);
  });

  it('should have valid regex patterns for all mappings', () => {
    DTC_SERVICE_MAPPINGS.forEach(mapping => {
      expect(() => new RegExp(mapping.dtcPattern)).not.toThrow();
    });
  });

  it('should match P0171 (fuel system lean) code', () => {
    const mapping = DTC_SERVICE_MAPPINGS.find(m => {
      const regex = new RegExp(m.dtcPattern, 'i');
      return regex.test('P0171');
    });
    
    expect(mapping).toBeDefined();
    expect(mapping!.services.length).toBeGreaterThan(0);
    expect(mapping!.priority).toBe('high');
    expect(mapping!.description).toContain('pobre');
  });

  it('should match P0420 (catalyst efficiency) code', () => {
    const mapping = DTC_SERVICE_MAPPINGS.find(m => {
      const regex = new RegExp(m.dtcPattern, 'i');
      return regex.test('P0420');
    });
    
    expect(mapping).toBeDefined();
    expect(mapping!.description.toLowerCase()).toContain('catalisador');
  });

  it('should match P0300 (random misfire) with urgent priority', () => {
    const mapping = DTC_SERVICE_MAPPINGS.find(m => {
      const regex = new RegExp(m.dtcPattern, 'i');
      return regex.test('P0300');
    });
    
    expect(mapping).toBeDefined();
    expect(mapping!.priority).toBe('urgent');
  });

  it('should match cylinder-specific misfire codes P0301-P0308', () => {
    for (let i = 1; i <= 8; i++) {
      const code = `P030${i}`;
      const mapping = DTC_SERVICE_MAPPINGS.find(m => {
        const regex = new RegExp(m.dtcPattern, 'i');
        return regex.test(code);
      });
      expect(mapping).toBeDefined();
    }
  });

  it('should have parts defined for each mapping', () => {
    DTC_SERVICE_MAPPINGS.forEach(mapping => {
      expect(Array.isArray(mapping.parts)).toBe(true);
    });
  });

  it('should have valid priority values', () => {
    const validPriorities = ['urgent', 'high', 'medium', 'low'];
    DTC_SERVICE_MAPPINGS.forEach(mapping => {
      expect(validPriorities).toContain(mapping.priority);
    });
  });
});

describe('Service Suggestion - Damage Mappings', () => {
  it('should have mappings for common damage types', () => {
    const requiredTypes = ['scratches', 'dents', 'cracks', 'worn_tires', 'rust', 'broken_glass'];
    requiredTypes.forEach(type => {
      expect(DAMAGE_SERVICE_MAPPINGS[type]).toBeDefined();
    });
  });

  it('should have services for scratches', () => {
    const scratches = DAMAGE_SERVICE_MAPPINGS['scratches'];
    expect(scratches.services).toContain('Polimento');
    expect(scratches.category).toBe('body');
    expect(scratches.priority).toBe('low');
  });

  it('should have urgent priority for worn tires', () => {
    const wornTires = DAMAGE_SERVICE_MAPPINGS['worn_tires'];
    expect(wornTires.priority).toBe('urgent');
    expect(wornTires.category).toBe('tires');
    expect(wornTires.services).toContain('Substituição de pneus');
  });

  it('should have urgent priority for broken glass', () => {
    const brokenGlass = DAMAGE_SERVICE_MAPPINGS['broken_glass'];
    expect(brokenGlass.priority).toBe('urgent');
  });

  it('should have valid categories for all damage types', () => {
    const validCategories = ['body', 'tires', 'electrical'];
    Object.values(DAMAGE_SERVICE_MAPPINGS).forEach(mapping => {
      expect(validCategories).toContain(mapping.category);
    });
  });
});

describe('Service Suggestion - Mileage Services', () => {
  it('should have mileage-based maintenance schedules', () => {
    expect(MILEAGE_SERVICES.length).toBeGreaterThan(0);
  });

  it('should have oil change at 10000km', () => {
    const oilChange = MILEAGE_SERVICES.find(s => s.mileageInterval === 10000);
    expect(oilChange).toBeDefined();
    expect(oilChange!.services.some(s => s.toLowerCase().includes('óleo'))).toBe(true);
  });

  it('should have timing belt at 60000km', () => {
    const timingBelt = MILEAGE_SERVICES.find(s => s.mileageInterval === 60000);
    expect(timingBelt).toBeDefined();
    expect(timingBelt!.services.some(s => s.toLowerCase().includes('correia'))).toBe(true);
  });

  it('should have increasing mileage intervals', () => {
    const intervals = MILEAGE_SERVICES.map(s => s.mileageInterval);
    const sorted = [...intervals].sort((a, b) => a - b);
    expect(intervals).toEqual(sorted);
  });
});

describe('Service Suggestion - Base Prices', () => {
  it('should have prices for common services', () => {
    expect(SERVICE_BASE_PRICES['Troca de óleo']).toBeDefined();
    expect(SERVICE_BASE_PRICES['Alinhamento']).toBeDefined();
  });

  it('should have labor cost and time for each service', () => {
    Object.values(SERVICE_BASE_PRICES).forEach(price => {
      expect(price.labor).toBeGreaterThan(0);
      expect(price.time).toBeGreaterThan(0);
    });
  });
});

describe('Service Suggestion Service - Real Tests', () => {
  it('should generate suggestions from OBD codes', async () => {
    const request: SuggestionRequest = {
      vehicleInfo: {
        plate: 'TEST123',
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        mileage: 45000,
      },
      obdCodes: ['P0171', 'P0420'],
    };

    const result = await serviceSuggestionService.generateSuggestions(request);

    expect(result.suggestions.length).toBeGreaterThan(0);
    expect(result.summary.totalSuggestions).toBeGreaterThan(0);
    
    // Deve ter sugestões relacionadas aos códigos
    const hasP0171Related = result.suggestions.some(s => 
      s.relatedDTCs?.includes('P0171')
    );
    expect(hasP0171Related).toBe(true);
  });

  it('should generate suggestions from detected damages', async () => {
    const request: SuggestionRequest = {
      vehicleInfo: {
        plate: 'TEST123',
      },
      detectedDamages: [
        { type: 'scratches', severity: 'minor' },
        { type: 'dents', severity: 'moderate' },
      ],
    };

    const result = await serviceSuggestionService.generateSuggestions(request);

    expect(result.suggestions.length).toBeGreaterThan(0);
    
    // Deve ter sugestões de carroceria
    const hasBodyService = result.suggestions.some(s => s.category === 'body');
    expect(hasBodyService).toBe(true);
  });

  it('should generate mileage-based suggestions', async () => {
    const request: SuggestionRequest = {
      vehicleInfo: {
        plate: 'TEST123',
        mileage: 59500, // Próximo de 60000km
      },
    };

    const result = await serviceSuggestionService.generateSuggestions(request);

    // Deve sugerir manutenção de 60000km
    const hasMileageSuggestion = result.suggestions.some(s => 
      s.source === 'mileage'
    );
    expect(hasMileageSuggestion).toBe(true);
  });

  it('should generate suggestions from customer complaints', async () => {
    const request: SuggestionRequest = {
      vehicleInfo: {
        plate: 'TEST123',
      },
      customerComplaints: ['Barulho no freio', 'Vibração no volante'],
    };

    const result = await serviceSuggestionService.generateSuggestions(request);

    expect(result.suggestions.length).toBeGreaterThan(0);
    
    // Deve ter sugestões de freio
    const hasBrakeService = result.suggestions.some(s => 
      s.category === 'brakes' || s.name.toLowerCase().includes('freio')
    );
    expect(hasBrakeService).toBe(true);
  });

  it('should calculate correct totals in summary', async () => {
    const request: SuggestionRequest = {
      vehicleInfo: {
        plate: 'TEST123',
        mileage: 45000,
      },
      obdCodes: ['P0171'],
    };

    const result = await serviceSuggestionService.generateSuggestions(request);

    // Verificar que o total é a soma dos custos
    const calculatedTotal = result.suggestions.reduce(
      (sum, s) => sum + s.estimatedCost.total, 0
    );
    expect(result.summary.totalEstimatedCost).toBe(calculatedTotal);
  });

  it('should sort suggestions by priority', async () => {
    const request: SuggestionRequest = {
      vehicleInfo: { plate: 'TEST123' },
      obdCodes: ['P0171', 'P0300'], // P0300 é urgent, P0171 é high
    };

    const result = await serviceSuggestionService.generateSuggestions(request);

    // Verificar que urgent vem antes de high
    const priorities = result.suggestions.map(s => s.priority);
    const urgentIndex = priorities.indexOf('urgent');
    const highIndex = priorities.indexOf('high');
    
    if (urgentIndex !== -1 && highIndex !== -1) {
      expect(urgentIndex).toBeLessThan(highIndex);
    }
  });

  it('should generate AI insights', async () => {
    const request: SuggestionRequest = {
      vehicleInfo: { plate: 'TEST123', mileage: 45000 },
      obdCodes: ['P0300'], // Código urgente
    };

    const result = await serviceSuggestionService.generateSuggestions(request);

    expect(result.aiInsights).toBeDefined();
    expect(result.aiInsights!.length).toBeGreaterThan(0);
  });

  it('should deduplicate similar suggestions', async () => {
    const request: SuggestionRequest = {
      vehicleInfo: { plate: 'TEST123' },
      obdCodes: ['P0171', 'P0174'], // Ambos são "sistema pobre"
    };

    const result = await serviceSuggestionService.generateSuggestions(request);

    // Não deve ter serviços duplicados
    const serviceNames = result.suggestions.map(s => s.name.toLowerCase());
    const uniqueNames = [...new Set(serviceNames)];
    expect(serviceNames.length).toBe(uniqueNames.length);
  });
});
