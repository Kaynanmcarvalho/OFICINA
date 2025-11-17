/**
 * Vehicle History Service Tests
 */

import vehicleHistoryService from '../../src/services/vehicleHistoryService';

describe('VehicleHistoryService', () => {
  describe('generateHistoryId', () => {
    it('should generate unique ID from placa and empresaId', () => {
      const id = vehicleHistoryService.generateHistoryId('ABC1234', 'empresa123');
      expect(id).toBe('empresa123_ABC1234');
    });

    it('should remove special characters from placa', () => {
      const id = vehicleHistoryService.generateHistoryId('ABC-1234', 'empresa123');
      expect(id).toBe('empresa123_ABC1234');
    });
  });

  describe('calculateRisk', () => {
    it('should return baixo for clean history', () => {
      const history = {
        recalls: [],
        leiloes: [],
        sinistros: [],
        restricoes: []
      };
      
      const risk = vehicleHistoryService.calculateRisk(history);
      expect(risk).toBe('baixo');
    });

    it('should return medio for pending recalls', () => {
      const history = {
        recalls: [
          { status: 'pendente' },
          { status: 'pendente' }
        ],
        leiloes: [],
        sinistros: [],
        restricoes: []
      };
      
      const risk = vehicleHistoryService.calculateRisk(history);
      expect(risk).toBe('medio');
    });

    it('should return alto for serious issues', () => {
      const history = {
        recalls: [],
        leiloes: [{ motivo: 'roubo' }],
        sinistros: [
          { gravidade: 'alta' },
          { gravidade: 'alta' }
        ],
        restricoes: [{ status: 'ativa' }]
      };
      
      const risk = vehicleHistoryService.calculateRisk(history);
      expect(risk).toBe('alto');
    });
  });

  describe('isCacheExpired', () => {
    it('should return true for expired cache', () => {
      const cachedData = {
        cacheExpiry: {
          toMillis: () => Date.now() - 1000 // 1 segundo atrás
        }
      };
      
      const expired = vehicleHistoryService.isCacheExpired(cachedData);
      expect(expired).toBe(true);
    });

    it('should return false for valid cache', () => {
      const cachedData = {
        cacheExpiry: {
          toMillis: () => Date.now() + 1000000 // futuro
        }
      };
      
      const expired = vehicleHistoryService.isCacheExpired(cachedData);
      expect(expired).toBe(false);
    });

    it('should return true if no cacheExpiry', () => {
      const cachedData = {};
      
      const expired = vehicleHistoryService.isCacheExpired(cachedData);
      expect(expired).toBe(true);
    });
  });

  describe('calculateCacheExpiry', () => {
    it('should return timestamp in the future', () => {
      const expiry = vehicleHistoryService.calculateCacheExpiry();
      const now = Date.now();
      const expiryMs = expiry.toMillis();
      
      expect(expiryMs).toBeGreaterThan(now);
    });

    it('should use minimum TTL (24h for sinistros)', () => {
      const expiry = vehicleHistoryService.calculateCacheExpiry();
      const now = Date.now();
      const expiryMs = expiry.toMillis();
      const diff = expiryMs - now;
      
      // Deve ser aproximadamente 24h (com margem de erro)
      expect(diff).toBeGreaterThan(23 * 60 * 60 * 1000);
      expect(diff).toBeLessThan(25 * 60 * 60 * 1000);
    });
  });
});
