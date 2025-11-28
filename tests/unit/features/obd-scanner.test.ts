/**
 * TORQ OBD Scanner - Unit Tests (Real Implementation)
 */

import { describe, it, expect } from 'vitest';
import { obdScannerService } from '../../../src/features/obd-scanner/services/obdScannerService';
import {
  DTC_SEVERITY_LABELS,
  DTC_CATEGORY_LABELS,
  VEHICLE_SYSTEM_LABELS,
  HEALTH_LABELS,
  SEVERITY_COLORS,
  HEALTH_COLORS,
} from '../../../src/features/obd-scanner/types';
import type { OBDScanRequest } from '../../../src/features/obd-scanner/types';

describe('OBD Scanner Service - Real Tests', () => {
  describe('isBluetoothSupported', () => {
    it('should return boolean', () => {
      const result = obdScannerService.isBluetoothSupported();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getConnectionState', () => {
    it('should return valid connection state', () => {
      const state = obdScannerService.getConnectionState();
      
      expect(state).toHaveProperty('isConnected');
      expect(state).toHaveProperty('isScanning');
      expect(state).toHaveProperty('device');
      expect(state).toHaveProperty('error');
      expect(state).toHaveProperty('progress');
      expect(state).toHaveProperty('currentStep');
      
      expect(typeof state.isConnected).toBe('boolean');
      expect(typeof state.isScanning).toBe('boolean');
      expect(typeof state.progress).toBe('number');
    });

    it('should start with disconnected state', () => {
      const state = obdScannerService.getConnectionState();
      expect(state.isConnected).toBe(false);
      expect(state.isScanning).toBe(false);
      expect(state.device).toBeNull();
    });
  });

  describe('performScan (Simulated)', () => {
    it('should return valid scan result in simulation mode', async () => {
      const request: OBDScanRequest = {
        scanType: 'quick',
        vehicleInfo: {
          plate: 'TEST123',
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
        },
      };

      const result = await obdScannerService.performScan(request);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('scannedAt');
      expect(result).toHaveProperty('deviceInfo');
      expect(result).toHaveProperty('diagnosticCodes');
      expect(result).toHaveProperty('liveData');
      expect(result).toHaveProperty('vehicleInfo');
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('scanDuration');
    });

    it('should include vehicle info in result', async () => {
      const request: OBDScanRequest = {
        scanType: 'full',
        includeLiveData: true,
        vehicleInfo: {
          plate: 'ABC1234',
          make: 'Honda',
          model: 'Civic',
          year: 2019,
        },
      };

      const result = await obdScannerService.performScan(request);

      expect(result.vehicleInfo.make).toBe('Honda');
      expect(result.vehicleInfo.model).toBe('Civic');
      expect(result.vehicleInfo.year).toBe(2019);
    });

    it('should return simulated device info', async () => {
      const request: OBDScanRequest = {
        scanType: 'quick',
      };

      const result = await obdScannerService.performScan(request);

      expect(result.deviceInfo.deviceId).toBe('simulator');
      expect(result.deviceInfo.deviceName).toBe('Simulador OBD');
      expect(result.deviceInfo.isConnected).toBe(true);
    });

    it('should generate valid summary', async () => {
      const request: OBDScanRequest = {
        scanType: 'full',
      };

      const result = await obdScannerService.performScan(request);

      expect(result.summary).toHaveProperty('totalCodes');
      expect(result.summary).toHaveProperty('bySeverity');
      expect(result.summary).toHaveProperty('overallHealth');
      expect(result.summary).toHaveProperty('criticalIssues');
      expect(result.summary).toHaveProperty('recommendedActions');

      expect(typeof result.summary.totalCodes).toBe('number');
      expect(result.summary.bySeverity).toHaveProperty('info');
      expect(result.summary.bySeverity).toHaveProperty('warning');
      expect(result.summary.bySeverity).toHaveProperty('critical');
    });

    it('should return live data when requested', async () => {
      const request: OBDScanRequest = {
        scanType: 'full',
        includeLiveData: true,
      };

      const result = await obdScannerService.performScan(request);

      expect(Array.isArray(result.liveData)).toBe(true);
      
      if (result.liveData.length > 0) {
        const firstReading = result.liveData[0];
        expect(firstReading).toHaveProperty('parameter');
        expect(firstReading).toHaveProperty('value');
        expect(firstReading).toHaveProperty('unit');
        expect(firstReading).toHaveProperty('status');
      }
    });

    it('should track scan duration', async () => {
      const request: OBDScanRequest = {
        scanType: 'quick',
      };

      const result = await obdScannerService.performScan(request);

      expect(result.scanDuration).toBeGreaterThan(0);
    });
  });

  describe('subscribe', () => {
    it('should return unsubscribe function', () => {
      const listener = () => {};
      const unsubscribe = obdScannerService.subscribe(listener);
      
      expect(typeof unsubscribe).toBe('function');
      
      // Cleanup
      unsubscribe();
    });
  });
});

describe('OBD Scanner Types - Labels', () => {
  describe('DTC_SEVERITY_LABELS', () => {
    it('should have labels for all severities', () => {
      expect(DTC_SEVERITY_LABELS.info).toBe('Informativo');
      expect(DTC_SEVERITY_LABELS.warning).toBe('Atenção');
      expect(DTC_SEVERITY_LABELS.critical).toBe('Crítico');
    });
  });

  describe('DTC_CATEGORY_LABELS', () => {
    it('should have labels for all categories', () => {
      expect(DTC_CATEGORY_LABELS.powertrain).toBe('Motor/Transmissão');
      expect(DTC_CATEGORY_LABELS.body).toBe('Carroceria');
      expect(DTC_CATEGORY_LABELS.chassis).toBe('Chassi');
      expect(DTC_CATEGORY_LABELS.network).toBe('Rede/Comunicação');
    });
  });

  describe('VEHICLE_SYSTEM_LABELS', () => {
    it('should have labels for all vehicle systems', () => {
      expect(VEHICLE_SYSTEM_LABELS.engine).toBe('Motor');
      expect(VEHICLE_SYSTEM_LABELS.transmission).toBe('Transmissão');
      expect(VEHICLE_SYSTEM_LABELS.fuel_system).toBe('Sistema de Combustível');
      expect(VEHICLE_SYSTEM_LABELS.abs).toBe('ABS');
      expect(VEHICLE_SYSTEM_LABELS.airbag).toBe('Airbag');
    });

    it('should have at least 10 systems defined', () => {
      const systemCount = Object.keys(VEHICLE_SYSTEM_LABELS).length;
      expect(systemCount).toBeGreaterThanOrEqual(10);
    });
  });

  describe('HEALTH_LABELS', () => {
    it('should have labels for all health levels', () => {
      expect(HEALTH_LABELS.excellent).toBe('Excelente');
      expect(HEALTH_LABELS.good).toBe('Bom');
      expect(HEALTH_LABELS.fair).toBe('Regular');
      expect(HEALTH_LABELS.poor).toBe('Ruim');
      expect(HEALTH_LABELS.critical).toBe('Crítico');
    });
  });
});

describe('OBD Scanner Types - Colors', () => {
  describe('SEVERITY_COLORS', () => {
    it('should have colors for all severities', () => {
      const severities = ['info', 'warning', 'critical'] as const;
      
      severities.forEach(severity => {
        expect(SEVERITY_COLORS[severity]).toHaveProperty('bg');
        expect(SEVERITY_COLORS[severity]).toHaveProperty('text');
        expect(SEVERITY_COLORS[severity]).toHaveProperty('border');
        expect(SEVERITY_COLORS[severity]).toHaveProperty('icon');
      });
    });

    it('should use correct color scheme', () => {
      expect(SEVERITY_COLORS.info.bg).toContain('blue');
      expect(SEVERITY_COLORS.warning.bg).toContain('orange');
      expect(SEVERITY_COLORS.critical.bg).toContain('red');
    });

    it('should have dark mode variants', () => {
      expect(SEVERITY_COLORS.info.bg).toContain('dark:');
      expect(SEVERITY_COLORS.warning.text).toContain('dark:');
    });
  });

  describe('HEALTH_COLORS', () => {
    it('should have colors for all health levels', () => {
      const healthLevels = ['excellent', 'good', 'fair', 'poor', 'critical'] as const;
      
      healthLevels.forEach(health => {
        expect(HEALTH_COLORS[health]).toHaveProperty('bg');
        expect(HEALTH_COLORS[health]).toHaveProperty('text');
        expect(HEALTH_COLORS[health]).toHaveProperty('border');
      });
    });

    it('should use appropriate colors for health levels', () => {
      expect(HEALTH_COLORS.excellent.bg).toContain('green');
      expect(HEALTH_COLORS.critical.bg).toContain('red');
    });
  });
});
