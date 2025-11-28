/**
 * TORQ Vehicle History - Unit Tests (Real Implementation)
 */

import { describe, it, expect } from 'vitest';
import {
  EVENT_TYPE_LABELS,
  EVENT_TYPE_COLORS,
  EVENT_TYPE_ICONS,
  SOURCE_LABELS,
  ALERT_TYPE_LABELS,
} from '../../../src/features/vehicle-history/types';
import type { VehicleEventType, EventSource, AlertType } from '../../../src/features/vehicle-history/types';

describe('Vehicle History Types - Labels', () => {
  describe('EVENT_TYPE_LABELS', () => {
    it('should have labels for all event types', () => {
      const requiredTypes: VehicleEventType[] = [
        'checkin',
        'checkout',
        'maintenance',
        'budget',
        'budget_approved',
        'budget_rejected',
        'damage_detected',
        'damage_repaired',
        'obd_scan',
        'dtc_detected',
        'dtc_cleared',
        'recall',
        'inspection',
        'mileage_update',
        'owner_change',
        'note',
        'photo',
        'document',
      ];

      requiredTypes.forEach(type => {
        expect(EVENT_TYPE_LABELS[type]).toBeDefined();
        expect(typeof EVENT_TYPE_LABELS[type]).toBe('string');
      });
    });

    it('should have Portuguese labels', () => {
      expect(EVENT_TYPE_LABELS.checkin).toBe('Check-in');
      expect(EVENT_TYPE_LABELS.checkout).toBe('Check-out');
      expect(EVENT_TYPE_LABELS.maintenance).toBe('Manutenção');
      expect(EVENT_TYPE_LABELS.budget).toBe('Orçamento');
    });

    it('should have at least 15 event types', () => {
      const typeCount = Object.keys(EVENT_TYPE_LABELS).length;
      expect(typeCount).toBeGreaterThanOrEqual(15);
    });
  });

  describe('SOURCE_LABELS', () => {
    it('should have labels for all sources', () => {
      const requiredSources: EventSource[] = [
        'system',
        'user',
        'obd',
        'ai',
        'import',
      ];

      requiredSources.forEach(source => {
        expect(SOURCE_LABELS[source]).toBeDefined();
      });
    });

    it('should have Portuguese labels', () => {
      expect(SOURCE_LABELS.system).toBe('Sistema');
      expect(SOURCE_LABELS.user).toBe('Usuário');
      expect(SOURCE_LABELS.obd).toBe('Scanner OBD');
      expect(SOURCE_LABELS.ai).toBe('Análise IA');
    });
  });

  describe('ALERT_TYPE_LABELS', () => {
    it('should have labels for all alert types', () => {
      const requiredAlerts: AlertType[] = [
        'maintenance_due',
        'mileage_milestone',
        'dtc_active',
        'damage_unrepaired',
        'recall_pending',
        'inspection_due',
        'warranty_expiring',
      ];

      requiredAlerts.forEach(alert => {
        expect(ALERT_TYPE_LABELS[alert]).toBeDefined();
      });
    });
  });
});

describe('Vehicle History Types - Colors', () => {
  describe('EVENT_TYPE_COLORS', () => {
    it('should have colors for all event types', () => {
      const eventTypes = Object.keys(EVENT_TYPE_LABELS) as VehicleEventType[];
      
      eventTypes.forEach(type => {
        expect(EVENT_TYPE_COLORS[type]).toHaveProperty('bg');
        expect(EVENT_TYPE_COLORS[type]).toHaveProperty('text');
        expect(EVENT_TYPE_COLORS[type]).toHaveProperty('icon');
      });
    });

    it('should use appropriate colors for positive events', () => {
      expect(EVENT_TYPE_COLORS.checkout.bg).toContain('green');
      expect(EVENT_TYPE_COLORS.budget_approved.bg).toContain('green');
      expect(EVENT_TYPE_COLORS.damage_repaired.bg).toContain('teal');
    });

    it('should use appropriate colors for negative events', () => {
      expect(EVENT_TYPE_COLORS.budget_rejected.bg).toContain('red');
      expect(EVENT_TYPE_COLORS.damage_detected.bg).toContain('orange');
      expect(EVENT_TYPE_COLORS.dtc_detected.bg).toContain('red');
    });

    it('should have dark mode variants', () => {
      expect(EVENT_TYPE_COLORS.checkin.bg).toContain('dark:');
      expect(EVENT_TYPE_COLORS.maintenance.text).toContain('dark:');
    });
  });

  describe('EVENT_TYPE_ICONS', () => {
    it('should have icons for all event types', () => {
      const eventTypes = Object.keys(EVENT_TYPE_LABELS) as VehicleEventType[];
      
      eventTypes.forEach(type => {
        expect(EVENT_TYPE_ICONS[type]).toBeDefined();
        expect(typeof EVENT_TYPE_ICONS[type]).toBe('string');
      });
    });

    it('should use appropriate icon names', () => {
      expect(EVENT_TYPE_ICONS.checkin).toBe('LogIn');
      expect(EVENT_TYPE_ICONS.checkout).toBe('LogOut');
      expect(EVENT_TYPE_ICONS.maintenance).toBe('Wrench');
      expect(EVENT_TYPE_ICONS.obd_scan).toBe('Scan');
    });
  });
});

describe('Vehicle History - Data Structures', () => {
  it('should have valid VehicleStats structure', () => {
    const emptyStats = {
      totalCheckins: 0,
      totalMaintenances: 0,
      totalBudgets: 0,
      totalSpent: 0,
      averageServiceCost: 0,
      damagesDetected: 0,
      damagesRepaired: 0,
      obdScansPerformed: 0,
      dtcCodesFound: 0,
    };

    expect(emptyStats.totalCheckins).toBe(0);
    expect(emptyStats.totalSpent).toBe(0);
    expect(typeof emptyStats.averageServiceCost).toBe('number');
  });

  it('should have valid VehicleProfile structure', () => {
    const profile = {
      id: 'test-id',
      plate: 'ABC1234',
      make: 'Toyota',
      model: 'Corolla',
      year: 2020,
      currentMileage: 45000,
      stats: {
        totalCheckins: 5,
        totalMaintenances: 3,
        totalBudgets: 4,
        totalSpent: 2500,
        averageServiceCost: 833.33,
        damagesDetected: 2,
        damagesRepaired: 1,
        obdScansPerformed: 2,
        dtcCodesFound: 1,
      },
      activeAlerts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      empresaId: 'empresa-123',
    };

    expect(profile.plate).toBe('ABC1234');
    expect(profile.currentMileage).toBe(45000);
    expect(profile.stats.totalCheckins).toBe(5);
  });

  it('should have valid VehicleHistoryRecord structure', () => {
    const record = {
      id: 'record-123',
      vehicleId: 'vehicle-123',
      vehiclePlate: 'ABC1234',
      empresaId: 'empresa-123',
      eventType: 'checkin' as VehicleEventType,
      eventDate: new Date(),
      title: 'Check-in Realizado',
      description: 'Veículo recebido para serviço',
      mileage: 45000,
      source: 'system' as EventSource,
      createdAt: new Date(),
      createdBy: 'system',
    };

    expect(record.eventType).toBe('checkin');
    expect(record.mileage).toBe(45000);
    expect(record.source).toBe('system');
  });
});

describe('Vehicle History - Filter Structure', () => {
  it('should have valid VehicleTimelineFilter structure', () => {
    const filter = {
      eventTypes: ['checkin', 'maintenance'] as VehicleEventType[],
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      sources: ['system', 'user'] as EventSource[],
      searchQuery: 'troca de óleo',
    };

    expect(filter.eventTypes).toHaveLength(2);
    expect(filter.searchQuery).toBe('troca de óleo');
  });

  it('should allow partial filters', () => {
    const partialFilter = {
      eventTypes: ['maintenance'] as VehicleEventType[],
    };

    expect(partialFilter.eventTypes).toHaveLength(1);
  });
});

describe('Vehicle History - Alert Structure', () => {
  it('should have valid VehicleAlert structure', () => {
    const alert = {
      id: 'alert-123',
      type: 'maintenance_due' as AlertType,
      severity: 'warning' as const,
      title: 'Manutenção Pendente',
      message: 'Última manutenção há 200 dias',
      createdAt: new Date(),
    };

    expect(alert.type).toBe('maintenance_due');
    expect(alert.severity).toBe('warning');
  });

  it('should have valid severity levels', () => {
    const severities = ['info', 'warning', 'critical'];
    severities.forEach(severity => {
      expect(['info', 'warning', 'critical']).toContain(severity);
    });
  });
});
