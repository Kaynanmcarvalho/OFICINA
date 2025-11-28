/**
 * TORQ Vehicle Health - Unit Tests
 * Testes unitários para o módulo de saúde do veículo
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type {
  VehicleHealth,
  HealthStatus,
  VehicleSystem,
  SystemHealth,
  HealthAlert,
  MaintenanceSchedule,
  MaintenanceType,
  IssueSeverity,
  AlertType,
} from '../../../src/features/vehicle-health/types';
import {
  HEALTH_STATUS_LABELS,
  VEHICLE_SYSTEM_LABELS,
  ISSUE_SEVERITY_LABELS,
  ALERT_TYPE_LABELS,
  MAINTENANCE_TYPE_LABELS,
  HEALTH_STATUS_COLORS,
  SEVERITY_COLORS,
  SYSTEM_ICONS,
  DEFAULT_MAINTENANCE_INTERVALS,
} from '../../../src/features/vehicle-health/types';

describe('Vehicle Health Module', () => {
  describe('Types - Labels', () => {
    it('should have all health statuses defined', () => {
      const statuses: HealthStatus[] = ['excellent', 'good', 'fair', 'poor', 'critical'];

      statuses.forEach(status => {
        expect(HEALTH_STATUS_LABELS[status]).toBeDefined();
        expect(HEALTH_STATUS_COLORS[status]).toBeDefined();
      });
    });

    it('should have Portuguese labels for health statuses', () => {
      expect(HEALTH_STATUS_LABELS.excellent).toBe('Excelente');
      expect(HEALTH_STATUS_LABELS.good).toBe('Bom');
      expect(HEALTH_STATUS_LABELS.fair).toBe('Regular');
      expect(HEALTH_STATUS_LABELS.poor).toBe('Ruim');
      expect(HEALTH_STATUS_LABELS.critical).toBe('Crítico');
    });

    it('should have all vehicle systems defined', () => {
      const systems: VehicleSystem[] = [
        'engine', 'transmission', 'brakes', 'suspension', 'electrical',
        'cooling', 'fuel', 'exhaust', 'steering', 'tires', 'body', 'interior'
      ];

      systems.forEach(system => {
        expect(VEHICLE_SYSTEM_LABELS[system]).toBeDefined();
        expect(SYSTEM_ICONS[system]).toBeDefined();
      });
    });

    it('should have Portuguese labels for systems', () => {
      expect(VEHICLE_SYSTEM_LABELS.engine).toBe('Motor');
      expect(VEHICLE_SYSTEM_LABELS.brakes).toBe('Freios');
      expect(VEHICLE_SYSTEM_LABELS.electrical).toBe('Elétrica');
      expect(VEHICLE_SYSTEM_LABELS.tires).toBe('Pneus');
    });

    it('should have all issue severities defined', () => {
      const severities: IssueSeverity[] = ['info', 'warning', 'error', 'critical'];

      severities.forEach(severity => {
        expect(ISSUE_SEVERITY_LABELS[severity]).toBeDefined();
        expect(SEVERITY_COLORS[severity]).toBeDefined();
      });
    });

    it('should have all alert types defined', () => {
      const types: AlertType[] = [
        'maintenance_due', 'maintenance_upcoming', 'obd_code',
        'damage_detected', 'low_score', 'recall', 'inspection_due', 'custom'
      ];

      types.forEach(type => {
        expect(ALERT_TYPE_LABELS[type]).toBeDefined();
      });
    });

    it('should have all maintenance types defined', () => {
      const types: MaintenanceType[] = [
        'oil_change', 'filter_air', 'filter_oil', 'filter_fuel', 'filter_cabin',
        'brake_pads', 'brake_discs', 'brake_fluid', 'coolant', 'transmission_fluid',
        'spark_plugs', 'timing_belt', 'serpentine_belt', 'battery', 'tires',
        'alignment', 'balancing', 'suspension', 'ac_service', 'general_inspection', 'other'
      ];

      types.forEach(type => {
        expect(MAINTENANCE_TYPE_LABELS[type]).toBeDefined();
        expect(DEFAULT_MAINTENANCE_INTERVALS[type]).toBeDefined();
      });
    });
  });

  describe('Types - Colors', () => {
    it('should have colors for all health statuses', () => {
      Object.values(HEALTH_STATUS_COLORS).forEach(colors => {
        expect(colors.bg).toBeDefined();
        expect(colors.text).toBeDefined();
        expect(colors.ring).toBeDefined();
      });
    });

    it('should have colors for all severities', () => {
      Object.values(SEVERITY_COLORS).forEach(colors => {
        expect(colors.bg).toBeDefined();
        expect(colors.text).toBeDefined();
        expect(colors.icon).toBeDefined();
      });
    });

    it('should use appropriate colors for statuses', () => {
      expect(HEALTH_STATUS_COLORS.excellent.bg).toContain('green');
      expect(HEALTH_STATUS_COLORS.good.bg).toContain('blue');
      expect(HEALTH_STATUS_COLORS.fair.bg).toContain('yellow');
      expect(HEALTH_STATUS_COLORS.poor.bg).toContain('orange');
      expect(HEALTH_STATUS_COLORS.critical.bg).toContain('red');
    });
  });

  describe('Default Maintenance Intervals', () => {
    it('should have sensible intervals', () => {
      expect(DEFAULT_MAINTENANCE_INTERVALS.oil_change).toBe(10000);
      expect(DEFAULT_MAINTENANCE_INTERVALS.timing_belt).toBe(60000);
      expect(DEFAULT_MAINTENANCE_INTERVALS.brake_pads).toBe(40000);
      expect(DEFAULT_MAINTENANCE_INTERVALS.tires).toBe(50000);
    });

    it('should have all intervals as positive numbers', () => {
      Object.values(DEFAULT_MAINTENANCE_INTERVALS).forEach(interval => {
        expect(interval).toBeGreaterThan(0);
      });
    });
  });

  describe('Score Calculation', () => {
    it('should calculate status from score correctly', () => {
      const getStatus = (score: number): HealthStatus => {
        if (score >= 90) return 'excellent';
        if (score >= 75) return 'good';
        if (score >= 60) return 'fair';
        if (score >= 40) return 'poor';
        return 'critical';
      };

      expect(getStatus(95)).toBe('excellent');
      expect(getStatus(80)).toBe('good');
      expect(getStatus(65)).toBe('fair');
      expect(getStatus(45)).toBe('poor');
      expect(getStatus(30)).toBe('critical');
    });

    it('should calculate overall score from system scores', () => {
      const calculateOverall = (
        systemScores: Record<VehicleSystem, number>
      ): number => {
        const weights: Record<VehicleSystem, number> = {
          engine: 1.5,
          transmission: 1.3,
          brakes: 1.5,
          suspension: 1.0,
          electrical: 1.2,
          cooling: 1.1,
          fuel: 1.0,
          exhaust: 0.8,
          steering: 1.2,
          tires: 1.1,
          body: 0.7,
          interior: 0.5,
        };

        let totalWeight = 0;
        let weightedSum = 0;

        Object.entries(systemScores).forEach(([system, score]) => {
          const weight = weights[system as VehicleSystem] || 1;
          totalWeight += weight;
          weightedSum += score * weight;
        });

        return Math.round(weightedSum / totalWeight);
      };

      // All systems at 100
      const perfectScores: Record<VehicleSystem, number> = {
        engine: 100, transmission: 100, brakes: 100, suspension: 100,
        electrical: 100, cooling: 100, fuel: 100, exhaust: 100,
        steering: 100, tires: 100, body: 100, interior: 100,
      };
      expect(calculateOverall(perfectScores)).toBe(100);

      // Mixed scores
      const mixedScores: Record<VehicleSystem, number> = {
        engine: 80, transmission: 90, brakes: 70, suspension: 85,
        electrical: 75, cooling: 80, fuel: 90, exhaust: 95,
        steering: 85, tires: 80, body: 90, interior: 95,
      };
      const overall = calculateOverall(mixedScores);
      expect(overall).toBeGreaterThan(70);
      expect(overall).toBeLessThan(90);
    });
  });

  describe('Alert Penalty Calculation', () => {
    it('should calculate penalties correctly', () => {
      const calculatePenalty = (severity: IssueSeverity): number => {
        switch (severity) {
          case 'critical': return 30;
          case 'error': return 20;
          case 'warning': return 10;
          case 'info': return 2;
        }
      };

      expect(calculatePenalty('critical')).toBe(30);
      expect(calculatePenalty('error')).toBe(20);
      expect(calculatePenalty('warning')).toBe(10);
      expect(calculatePenalty('info')).toBe(2);
    });

    it('should accumulate penalties', () => {
      const alerts: { severity: IssueSeverity }[] = [
        { severity: 'warning' },
        { severity: 'warning' },
        { severity: 'error' },
      ];

      const totalPenalty = alerts.reduce((sum, a) => {
        switch (a.severity) {
          case 'critical': return sum + 30;
          case 'error': return sum + 20;
          case 'warning': return sum + 10;
          case 'info': return sum + 2;
        }
      }, 0);

      expect(totalPenalty).toBe(40); // 10 + 10 + 20
    });
  });

  describe('Maintenance Status', () => {
    it('should determine maintenance status correctly', () => {
      const getMaintenanceStatus = (
        currentMileage: number,
        dueMileage: number
      ): MaintenanceSchedule['status'] => {
        const diff = dueMileage - currentMileage;
        if (diff < 0) return 'overdue';
        if (diff <= 1000) return 'due';
        return 'upcoming';
      };

      expect(getMaintenanceStatus(45000, 40000)).toBe('overdue');
      expect(getMaintenanceStatus(39500, 40000)).toBe('due');
      expect(getMaintenanceStatus(35000, 40000)).toBe('upcoming');
    });

    it('should calculate mileage until due', () => {
      const getMileageUntilDue = (
        currentMileage: number,
        dueMileage: number
      ): number => {
        return Math.max(0, dueMileage - currentMileage);
      };

      expect(getMileageUntilDue(35000, 40000)).toBe(5000);
      expect(getMileageUntilDue(45000, 40000)).toBe(0);
    });
  });

  describe('System Health Structure', () => {
    it('should create valid system health', () => {
      const health: SystemHealth = {
        system: 'engine',
        score: 85,
        status: 'good',
        lastChecked: new Date(),
        issues: [
          {
            id: 'issue-001',
            description: 'Código P0171 detectado',
            severity: 'warning',
            detectedAt: new Date(),
            source: 'obd_scan',
            resolved: false,
          }
        ],
        recommendations: ['Verificar sistema de combustível'],
      };

      expect(health.system).toBe('engine');
      expect(health.score).toBe(85);
      expect(health.issues).toHaveLength(1);
    });
  });

  describe('Health Alert Structure', () => {
    it('should create valid alert', () => {
      const alert: HealthAlert = {
        id: 'alert-001',
        type: 'maintenance_due',
        title: 'Troca de Óleo Vencida',
        message: 'A troca de óleo está vencida há 2.000 km',
        severity: 'warning',
        system: 'engine',
        actionRequired: true,
        actionLabel: 'Agendar',
        createdAt: new Date(),
        dismissed: false,
      };

      expect(alert.type).toBe('maintenance_due');
      expect(alert.actionRequired).toBe(true);
      expect(alert.dismissed).toBe(false);
    });
  });

  describe('Maintenance Schedule Structure', () => {
    it('should create valid schedule', () => {
      const schedule: MaintenanceSchedule = {
        id: 'schedule-001',
        type: 'oil_change',
        name: 'Troca de Óleo',
        description: 'Troca de óleo e filtro',
        dueMileage: 50000,
        status: 'upcoming',
        mileageUntilDue: 5000,
        lastPerformed: new Date('2024-01-01'),
        lastMileage: 40000,
        estimatedCost: 250,
        estimatedTime: '1 hora',
        priority: 'medium',
      };

      expect(schedule.type).toBe('oil_change');
      expect(schedule.status).toBe('upcoming');
      expect(schedule.mileageUntilDue).toBe(5000);
    });
  });

  describe('Vehicle Health Structure', () => {
    it('should create valid health object', () => {
      const health: VehicleHealth = {
        vehicleId: 'vehicle-001',
        vehiclePlate: 'ABC1234',
        vehicleInfo: {
          make: 'Chevrolet',
          model: 'Onix',
          year: 2022,
          mileage: 45000,
          engine: '1.0 Turbo',
        },
        overallScore: 82,
        overallStatus: 'good',
        systemScores: {} as any,
        activeAlerts: [],
        upcomingMaintenance: [],
        scoreHistory: [],
        empresaId: 'empresa-001',
        lastUpdated: new Date(),
      };

      expect(health.overallScore).toBe(82);
      expect(health.overallStatus).toBe('good');
      expect(health.vehicleInfo.mileage).toBe(45000);
    });
  });

  describe('Score History', () => {
    it('should track score changes over time', () => {
      const history = [
        { date: new Date('2024-01-01'), overallScore: 90, systemScores: {} },
        { date: new Date('2024-01-15'), overallScore: 85, systemScores: {} },
        { date: new Date('2024-02-01'), overallScore: 82, systemScores: {} },
      ];

      expect(history).toHaveLength(3);
      expect(history[0].overallScore).toBeGreaterThan(history[2].overallScore);
    });

    it('should limit history entries', () => {
      const maxEntries = 30;
      const history = Array.from({ length: 35 }, (_, i) => ({
        date: new Date(),
        overallScore: 80 + i,
        systemScores: {},
      }));

      const trimmedHistory = history.slice(-maxEntries);
      expect(trimmedHistory).toHaveLength(maxEntries);
    });
  });

  describe('Priority Calculation', () => {
    it('should determine maintenance priority', () => {
      const getPriority = (
        status: MaintenanceSchedule['status'],
        type: MaintenanceType
      ): MaintenanceSchedule['priority'] => {
        if (status === 'overdue') return 'critical';
        if (status === 'due') return 'high';
        
        // Critical systems
        const criticalTypes: MaintenanceType[] = ['brake_pads', 'brake_fluid', 'timing_belt'];
        if (criticalTypes.includes(type)) return 'high';
        
        return 'medium';
      };

      expect(getPriority('overdue', 'oil_change')).toBe('critical');
      expect(getPriority('due', 'oil_change')).toBe('high');
      expect(getPriority('upcoming', 'brake_pads')).toBe('high');
      expect(getPriority('upcoming', 'filter_cabin')).toBe('medium');
    });
  });

  describe('Filtering', () => {
    it('should filter critical alerts', () => {
      const alerts: HealthAlert[] = [
        { severity: 'info' } as HealthAlert,
        { severity: 'warning' } as HealthAlert,
        { severity: 'error' } as HealthAlert,
        { severity: 'critical' } as HealthAlert,
      ];

      const critical = alerts.filter(
        a => a.severity === 'critical' || a.severity === 'error'
      );

      expect(critical).toHaveLength(2);
    });

    it('should filter overdue maintenance', () => {
      const maintenance: MaintenanceSchedule[] = [
        { status: 'upcoming' } as MaintenanceSchedule,
        { status: 'due' } as MaintenanceSchedule,
        { status: 'overdue' } as MaintenanceSchedule,
        { status: 'completed' } as MaintenanceSchedule,
      ];

      const overdue = maintenance.filter(m => m.status === 'overdue');
      expect(overdue).toHaveLength(1);
    });

    it('should find systems needing attention', () => {
      const systemScores: Record<VehicleSystem, SystemHealth> = {
        engine: { status: 'good' } as SystemHealth,
        brakes: { status: 'poor' } as SystemHealth,
        electrical: { status: 'critical' } as SystemHealth,
        tires: { status: 'fair' } as SystemHealth,
      } as any;

      const needsAttention = Object.entries(systemScores)
        .filter(([, h]) => h.status === 'poor' || h.status === 'critical')
        .map(([system]) => system);

      expect(needsAttention).toContain('brakes');
      expect(needsAttention).toContain('electrical');
      expect(needsAttention).not.toContain('engine');
    });
  });
});
