/**
 * Integration Tests: Diagnosis Flow
 * 
 * Tests complete diagnosis flow with Firebase Emulator
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { diagnosisService } from '../../src/services/diagnosisService';
import fs from 'fs';
import path from 'path';

let testEnv;
let authenticatedContext;
let unauthenticatedContext;

describe('Diagnosis Integration Tests', () => {
  beforeAll(async () => {
    // Initialize Firebase Test Environment
    testEnv = await initializeTestEnvironment({
      projectId: 'oficina-reparofacil-test',
      firestore: {
        rules: fs.readFileSync(path.resolve(__dirname, '../../firestore.rules'), 'utf8'),
        host: 'localhost',
        port: 8080,
      },
      storage: {
        rules: fs.readFileSync(path.resolve(__dirname, '../../storage.rules'), 'utf8'),
        host: 'localhost',
        port: 9199,
      },
    });

    // Create authenticated context
    authenticatedContext = testEnv.authenticatedContext('user_test', {
      empresaId: 'empresa_test',
      role: 'admin',
    });

    // Create unauthenticated context
    unauthenticatedContext = testEnv.unauthenticatedContext();
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
    await testEnv.clearStorage();
  });

  describe('Complete Diagnosis Flow', () => {
    it('should create diagnosis, upload image, and process', async () => {
      // 1. Create diagnosis
      const diagnosisData = {
        empresaId: 'empresa_test',
        vehicleId: 'vehicle_123',
        clientId: 'client_456',
      };

      const diagnosisId = await diagnosisService.createDiagnosis(diagnosisData);
      expect(diagnosisId).toBeDefined();

      // 2. Upload image
      const testImage = new File(['test image data'], 'test.jpg', { type: 'image/jpeg' });
      const imagePath = `empresas/empresa_test/diagnostics/${diagnosisId}/image_001.jpg`;
      
      const imageUrl = await diagnosisService.uploadImage(testImage, imagePath);
      expect(imageUrl).toContain('storage.googleapis.com');

      // 3. Verify diagnosis in Firestore
      const diagnosis = await diagnosisService.getDiagnosis('empresa_test', diagnosisId);
      expect(diagnosis).toBeDefined();
      expect(diagnosis.status).toBe('pending');
      expect(diagnosis.empresaId).toBe('empresa_test');
    });
  });
});
