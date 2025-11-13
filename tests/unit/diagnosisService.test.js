/**
 * Unit Tests: diagnosisService
 * 
 * Tests for diagnosis service layer
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { diagnosisService } from '../../src/services/diagnosisService';
import { db, storage } from '../../src/config/firebase';

// Mock Firebase
vi.mock('../../src/config/firebase', () => ({
  db: {
    collection: vi.fn(),
  },
  storage: {
    ref: vi.fn(),
  },
}));

describe('diagnosisService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createDiagnosis', () => {
    it('should create a new diagnosis document', async () => {
      const mockData = {
        empresaId: 'empresa_test',
        vehicleId: 'vehicle_123',
        clientId: 'client_456',
        images: [],
      };

      const mockDocRef = {
        id: 'diag_abc123',
        set: vi.fn().mockResolvedValue(undefined),
      };

      const mockCollectionRef = {
        doc: vi.fn().mockReturnValue(mockDocRef),
      };

      db.collection.mockReturnValue(mockCollectionRef);

      const result = await diagnosisService.createDiagnosis(mockData);

      expect(db.collection).toHaveBeenCalledWith('empresas');
      expect(result).toBe('diag_abc123');
      expect(mockDocRef.set).toHaveBeenCalledWith(
        expect.objectContaining({
          empresaId: 'empresa_test',
          vehicleId: 'vehicle_123',
          clientId: 'client_456',
          status: 'pending',
        })
      );
    });

    it('should throw error if empresaId is missing', async () => {
      const mockData = {
        vehicleId: 'vehicle_123',
        clientId: 'client_456',
      };

      await expect(diagnosisService.createDiagnosis(mockData)).rejects.toThrow(
        'empresaId is required'
      );
    });

    it('should throw error if vehicleId is missing', async () => {
      const mockData = {
        empresaId: 'empresa_test',
        clientId: 'client_456',
      };

      await expect(diagnosisService.createDiagnosis(mockData)).rejects.toThrow(
        'vehicleId is required'
      );
    });
  });

  describe('uploadImage', () => {
    it('should upload image to Storage', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockPath = 'empresas/test/diagnostics/diag_123/image_001.jpg';

      const mockUploadTask = {
        snapshot: {
          ref: {
            getDownloadURL: vi.fn().mockResolvedValue('https://storage.googleapis.com/test.jpg'),
          },
        },
      };

      const mockStorageRef = {
        put: vi.fn().mockReturnValue(mockUploadTask),
      };

      storage.ref.mockReturnValue(mockStorageRef);

      const result = await diagnosisService.uploadImage(mockFile, mockPath);

      expect(storage.ref).toHaveBeenCalledWith(mockPath);
      expect(mockStorageRef.put).toHaveBeenCalledWith(mockFile);
      expect(result).toBe('https://storage.googleapis.com/test.jpg');
    });

    it('should throw error if file is not an image', async () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const mockPath = 'test/path.txt';

      await expect(diagnosisService.uploadImage(mockFile, mockPath)).rejects.toThrow(
        'File must be an image'
      );
    });

    it('should throw error if file is too large', async () => {
      const largeFile = new File([new ArrayBuffer(11 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      });
      const mockPath = 'test/path.jpg';

      await expect(diagnosisService.uploadImage(largeFile, mockPath)).rejects.toThrow(
        'File size must be less than 10MB'
      );
    });
  });

  describe('getDiagnosis', () => {
    it('should get diagnosis by id', async () => {
      const mockData = {
        id: 'diag_123',
        empresaId: 'empresa_test',
        status: 'completed',
      };

      const mockDocSnap = {
        exists: () => true,
        id: 'diag_123',
        data: () => mockData,
      };

      const mockDocRef = {
        get: vi.fn().mockResolvedValue(mockDocSnap),
      };

      const mockCollectionRef = {
        doc: vi.fn().mockReturnValue(mockDocRef),
      };

      db.collection.mockReturnValue(mockCollectionRef);

      const result = await diagnosisService.getDiagnosis('empresa_test', 'diag_123');

      expect(result).toEqual({ id: 'diag_123', ...mockData });
    });

    it('should return null if diagnosis not found', async () => {
      const mockDocSnap = {
        exists: () => false,
      };

      const mockDocRef = {
        get: vi.fn().mockResolvedValue(mockDocSnap),
      };

      const mockCollectionRef = {
        doc: vi.fn().mockReturnValue(mockDocRef),
      };

      db.collection.mockReturnValue(mockCollectionRef);

      const result = await diagnosisService.getDiagnosis('empresa_test', 'diag_123');

      expect(result).toBeNull();
    });
  });

  describe('updateDiagnosisStatus', () => {
    it('should update diagnosis status', async () => {
      const mockDocRef = {
        update: vi.fn().mockResolvedValue(undefined),
      };

      const mockCollectionRef = {
        doc: vi.fn().mockReturnValue(mockDocRef),
      };

      db.collection.mockReturnValue(mockCollectionRef);

      await diagnosisService.updateDiagnosisStatus('empresa_test', 'diag_123', 'processing');

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'processing',
        })
      );
    });

    it('should throw error for invalid status', async () => {
      await expect(
        diagnosisService.updateDiagnosisStatus('empresa_test', 'diag_123', 'invalid')
      ).rejects.toThrow('Invalid status');
    });
  });

  describe('calculateSummary', () => {
    it('should calculate summary correctly', () => {
      const detections = [
        { label: 'dent', confidence: 0.92, severity: 'medium', estimatedCost: 350 },
        { label: 'scratch', confidence: 0.87, severity: 'low', estimatedCost: 200 },
        { label: 'broken_glass', confidence: 0.45, severity: 'high', estimatedCost: 800 },
      ];

      const summary = diagnosisService.calculateSummary(detections);

      expect(summary.totalDamages).toBe(3);
      expect(summary.estimatedCost).toBe(1350);
      expect(summary.needsHumanReview).toBe(true); // confidence < 0.5
      expect(summary.confidence).toBeCloseTo(0.75, 2);
    });

    it('should handle empty detections', () => {
      const summary = diagnosisService.calculateSummary([]);

      expect(summary.totalDamages).toBe(0);
      expect(summary.estimatedCost).toBe(0);
      expect(summary.needsHumanReview).toBe(false);
      expect(summary.confidence).toBe(0);
    });
  });

  describe('getDamageDescription', () => {
    it('should return correct description for known damage', () => {
      expect(diagnosisService.getDamageDescription('dent')).toBe('Amassado');
      expect(diagnosisService.getDamageDescription('scratch')).toBe('Arranhão');
      expect(diagnosisService.getDamageDescription('broken_glass')).toBe('Vidro quebrado');
    });

    it('should return label for unknown damage', () => {
      expect(diagnosisService.getDamageDescription('unknown_damage')).toBe('unknown_damage');
    });
  });

  describe('getSeverityColor', () => {
    it('should return correct color for severity', () => {
      expect(diagnosisService.getSeverityColor('high')).toContain('red');
      expect(diagnosisService.getSeverityColor('medium')).toContain('amber');
      expect(diagnosisService.getSeverityColor('low')).toContain('green');
    });

    it('should return default color for unknown severity', () => {
      expect(diagnosisService.getSeverityColor('unknown')).toContain('amber');
    });
  });

  describe('validateImageFile', () => {
    it('should validate correct image file', () => {
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      expect(() => diagnosisService.validateImageFile(validFile)).not.toThrow();
    });

    it('should throw error for non-image file', () => {
      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      expect(() => diagnosisService.validateImageFile(invalidFile)).toThrow(
        'File must be an image'
      );
    });

    it('should throw error for oversized file', () => {
      const largeFile = new File([new ArrayBuffer(11 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      });
      expect(() => diagnosisService.validateImageFile(largeFile)).toThrow(
        'File size must be less than 10MB'
      );
    });

    it('should accept all valid image formats', () => {
      const formats = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
      formats.forEach((format) => {
        const file = new File(['test'], `test.${format.split('/')[1]}`, { type: format });
        expect(() => diagnosisService.validateImageFile(file)).not.toThrow();
      });
    });
  });

  describe('compressImage', () => {
    it('should compress image if larger than threshold', async () => {
      const largeFile = new File([new ArrayBuffer(3 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      });

      const result = await diagnosisService.compressImage(largeFile);

      expect(result).toBeDefined();
      expect(result.type).toBe('image/jpeg');
      // Should be compressed (smaller or same size)
      expect(result.size).toBeLessThanOrEqual(largeFile.size);
    });

    it('should not compress image if smaller than threshold', async () => {
      const smallFile = new File([new ArrayBuffer(1 * 1024 * 1024)], 'small.jpg', {
        type: 'image/jpeg',
      });

      const result = await diagnosisService.compressImage(smallFile);

      expect(result).toBe(smallFile);
    });
  });
});
