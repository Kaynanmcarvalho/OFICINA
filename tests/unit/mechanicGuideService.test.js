/**
 * Mechanic Guide Service Tests
 * Testes unitários para o serviço de guias técnicos
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { MechanicGuideService } from '../../src/services/mechanicGuideService';

describe('MechanicGuideService', () => {
  let service;

  beforeEach(() => {
    service = new MechanicGuideService();
  });

  describe('validateGuide', () => {
    it('should validate complete guide', () => {
      const guide = {
        title: 'Troca de Óleo',
        category: 'motor',
        difficulty: 'facil',
        steps: [
          { order: 1, title: 'Passo 1', description: 'Descrição' }
        ]
      };
      
      const result = service.validateGuide(guide);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject guide without title', () => {
      const guide = {
        category: 'motor',
        difficulty: 'facil',
        steps: [{ order: 1, title: 'Passo 1' }]
      };
      
      const result = service.validateGuide(guide);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Título é obrigatório');
    });

    it('should reject guide without category', () => {
      const guide = {
        title: 'Troca de Óleo',
        difficulty: 'facil',
        steps: [{ order: 1, title: 'Passo 1' }]
      };
      
      const result = service.validateGuide(guide);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Categoria é obrigatória');
    });

    it('should reject guide with invalid difficulty', () => {
      const guide = {
        title: 'Troca de Óleo',
        category: 'motor',
        difficulty: 'invalido',
        steps: [{ order: 1, title: 'Passo 1' }]
      };
      
      const result = service.validateGuide(guide);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Dificuldade inválida');
    });

    it('should reject guide without steps', () => {
      const guide = {
        title: 'Troca de Óleo',
        category: 'motor',
        difficulty: 'facil',
        steps: []
      };
      
      const result = service.validateGuide(guide);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Pelo menos um passo é obrigatório');
    });
  });

  describe('Guide Structure', () => {
    it('should have correct collection name', () => {
      expect(service.collectionName).toBe('mechanic_guides');
    });
  });

  describe('Difficulty Levels', () => {
    it('should accept facil difficulty', () => {
      const guide = {
        title: 'Test',
        category: 'test',
        difficulty: 'facil',
        steps: [{ order: 1, title: 'Step' }]
      };
      expect(service.validateGuide(guide).isValid).toBe(true);
    });

    it('should accept medio difficulty', () => {
      const guide = {
        title: 'Test',
        category: 'test',
        difficulty: 'medio',
        steps: [{ order: 1, title: 'Step' }]
      };
      expect(service.validateGuide(guide).isValid).toBe(true);
    });

    it('should accept dificil difficulty', () => {
      const guide = {
        title: 'Test',
        category: 'test',
        difficulty: 'dificil',
        steps: [{ order: 1, title: 'Step' }]
      };
      expect(service.validateGuide(guide).isValid).toBe(true);
    });
  });
});
