/**
 * TORQ Damage Report - Unit Tests
 * Testes unitários para o módulo de relatório de danos
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type {
  DamageReport,
  ReportDamage,
  DamageSummary,
  DamageType,
  DamageSeverity,
  DamageLocation,
  ReportStatus,
  PDFGenerationOptions,
} from '../../../src/features/damage-report/types';
import {
  DAMAGE_TYPE_LABELS,
  DAMAGE_SEVERITY_LABELS,
  DAMAGE_LOCATION_LABELS,
  REPORT_STATUS_LABELS,
  CONDITION_LABELS,
  SEVERITY_COLORS,
  CONDITION_COLORS,
  DEFAULT_PDF_OPTIONS,
} from '../../../src/features/damage-report/types';

describe('Damage Report Module', () => {
  describe('Types - Labels', () => {
    it('should have all damage types defined', () => {
      const types: DamageType[] = [
        'scratch', 'dent', 'crack', 'chip', 'rust', 'paint_damage',
        'glass_damage', 'bumper_damage', 'light_damage', 'mirror_damage',
        'tire_damage', 'wheel_damage', 'other'
      ];

      types.forEach(type => {
        expect(DAMAGE_TYPE_LABELS[type]).toBeDefined();
      });
    });

    it('should have Portuguese labels for damage types', () => {
      expect(DAMAGE_TYPE_LABELS.scratch).toBe('Arranhão');
      expect(DAMAGE_TYPE_LABELS.dent).toBe('Amassado');
      expect(DAMAGE_TYPE_LABELS.crack).toBe('Trinca');
      expect(DAMAGE_TYPE_LABELS.rust).toBe('Ferrugem');
    });

    it('should have all severity levels defined', () => {
      const severities: DamageSeverity[] = ['minor', 'moderate', 'severe', 'critical'];

      severities.forEach(severity => {
        expect(DAMAGE_SEVERITY_LABELS[severity]).toBeDefined();
        expect(SEVERITY_COLORS[severity]).toBeDefined();
      });
    });

    it('should have Portuguese labels for severities', () => {
      expect(DAMAGE_SEVERITY_LABELS.minor).toBe('Leve');
      expect(DAMAGE_SEVERITY_LABELS.moderate).toBe('Moderado');
      expect(DAMAGE_SEVERITY_LABELS.severe).toBe('Grave');
      expect(DAMAGE_SEVERITY_LABELS.critical).toBe('Crítico');
    });

    it('should have all damage locations defined', () => {
      const locations: DamageLocation[] = [
        'front', 'rear', 'left_side', 'right_side', 'roof', 'hood',
        'trunk', 'windshield', 'rear_window', 'left_door', 'right_door',
        'wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr', 'other'
      ];

      locations.forEach(location => {
        expect(DAMAGE_LOCATION_LABELS[location]).toBeDefined();
      });
    });

    it('should have all report statuses defined', () => {
      const statuses: ReportStatus[] = ['draft', 'generated', 'sent', 'signed'];

      statuses.forEach(status => {
        expect(REPORT_STATUS_LABELS[status]).toBeDefined();
      });
    });

    it('should have condition labels defined', () => {
      expect(CONDITION_LABELS.excellent).toBe('Excelente');
      expect(CONDITION_LABELS.good).toBe('Bom');
      expect(CONDITION_LABELS.fair).toBe('Regular');
      expect(CONDITION_LABELS.poor).toBe('Ruim');
    });
  });

  describe('Types - Colors', () => {
    it('should have colors for all severities', () => {
      Object.values(SEVERITY_COLORS).forEach(colors => {
        expect(colors.bg).toBeDefined();
        expect(colors.text).toBeDefined();
        expect(colors.border).toBeDefined();
      });
    });

    it('should have colors for all conditions', () => {
      Object.values(CONDITION_COLORS).forEach(colors => {
        expect(colors.bg).toBeDefined();
        expect(colors.text).toBeDefined();
      });
    });

    it('should use appropriate colors for severities', () => {
      expect(SEVERITY_COLORS.minor.bg).toContain('green');
      expect(SEVERITY_COLORS.moderate.bg).toContain('yellow');
      expect(SEVERITY_COLORS.severe.bg).toContain('orange');
      expect(SEVERITY_COLORS.critical.bg).toContain('red');
    });
  });

  describe('Default PDF Options', () => {
    it('should have sensible defaults', () => {
      expect(DEFAULT_PDF_OPTIONS.includePhotos).toBe(true);
      expect(DEFAULT_PDF_OPTIONS.includeEstimates).toBe(true);
      expect(DEFAULT_PDF_OPTIONS.includeRecommendations).toBe(true);
      expect(DEFAULT_PDF_OPTIONS.includeDiagram).toBe(true);
      expect(DEFAULT_PDF_OPTIONS.language).toBe('pt-BR');
      expect(DEFAULT_PDF_OPTIONS.paperSize).toBe('A4');
      expect(DEFAULT_PDF_OPTIONS.orientation).toBe('portrait');
      expect(DEFAULT_PDF_OPTIONS.includeSignatureField).toBe(true);
    });
  });

  describe('Report Damage Structure', () => {
    it('should create valid damage object', () => {
      const damage: ReportDamage = {
        id: 'damage-001',
        type: 'scratch',
        severity: 'moderate',
        location: 'left_door',
        description: 'Arranhão de 15cm na porta esquerda',
        confidence: 0.92,
        detectedAt: new Date(),
        photoId: 'photo-001',
        estimatedRepairCost: 350,
        estimatedRepairTime: '2 horas',
        boundingBox: {
          x: 100,
          y: 200,
          width: 150,
          height: 50,
        },
      };

      expect(damage.type).toBe('scratch');
      expect(damage.severity).toBe('moderate');
      expect(damage.confidence).toBeGreaterThan(0);
      expect(damage.boundingBox).toBeDefined();
    });

    it('should handle optional fields', () => {
      const minimalDamage: ReportDamage = {
        id: 'damage-002',
        type: 'dent',
        severity: 'minor',
        location: 'hood',
        description: 'Pequeno amassado',
        confidence: 0.85,
        detectedAt: new Date(),
      };

      expect(minimalDamage.photoId).toBeUndefined();
      expect(minimalDamage.estimatedRepairCost).toBeUndefined();
      expect(minimalDamage.boundingBox).toBeUndefined();
    });
  });

  describe('Damage Summary Structure', () => {
    it('should create valid summary', () => {
      const summary: DamageSummary = {
        totalDamages: 5,
        bySeverity: {
          minor: 2,
          moderate: 2,
          severe: 1,
          critical: 0,
        },
        byType: {
          scratch: 3,
          dent: 2,
        },
        byLocation: {
          left_door: 2,
          hood: 1,
          front: 2,
        },
        totalEstimatedCost: 1500,
        totalEstimatedTime: '2 dias úteis',
        overallCondition: 'fair',
        conditionScore: 65,
        recommendations: [
          'Reparar arranhões para evitar ferrugem',
          'Verificar alinhamento após reparo do capô',
        ],
        urgentRepairs: ['Amassado grave na frente'],
      };

      expect(summary.totalDamages).toBe(5);
      expect(summary.bySeverity.minor + summary.bySeverity.moderate).toBe(4);
      expect(summary.conditionScore).toBe(65);
      expect(summary.recommendations).toHaveLength(2);
    });
  });

  describe('Damage Report Structure', () => {
    it('should create valid report', () => {
      const report: DamageReport = {
        id: 'report-001',
        checkinId: 'checkin-001',
        vehicleId: 'vehicle-001',
        vehicle: {
          plate: 'ABC1234',
          make: 'Chevrolet',
          model: 'Onix',
          year: 2022,
          color: 'Prata',
        },
        client: {
          name: 'João Silva',
          document: '123.456.789-00',
          phone: '(11) 99999-9999',
        },
        damages: [],
        photos: [],
        summary: {
          totalDamages: 0,
          bySeverity: { minor: 0, moderate: 0, severe: 0, critical: 0 },
          byType: {},
          byLocation: {},
          totalEstimatedCost: 0,
          totalEstimatedTime: '0 horas',
          overallCondition: 'excellent',
          conditionScore: 100,
          recommendations: [],
          urgentRepairs: [],
        },
        empresaId: 'empresa-001',
        createdAt: new Date(),
        createdBy: 'user-001',
        status: 'draft',
      };

      expect(report.vehicle.plate).toBe('ABC1234');
      expect(report.status).toBe('draft');
    });
  });

  describe('Summary Calculation', () => {
    it('should calculate condition score correctly', () => {
      const calculateConditionScore = (damages: ReportDamage[]): number => {
        const severityWeights = { minor: 1, moderate: 3, severe: 7, critical: 15 };
        const totalWeight = damages.reduce(
          (sum, d) => sum + severityWeights[d.severity],
          0
        );
        return Math.max(0, 100 - totalWeight * 2);
      };

      // Sem danos = 100
      expect(calculateConditionScore([])).toBe(100);

      // 1 dano leve = 100 - 2 = 98
      expect(calculateConditionScore([
        { severity: 'minor' } as ReportDamage
      ])).toBe(98);

      // 1 crítico = 100 - 30 = 70
      expect(calculateConditionScore([
        { severity: 'critical' } as ReportDamage
      ])).toBe(70);

      // Múltiplos danos
      expect(calculateConditionScore([
        { severity: 'minor' } as ReportDamage,
        { severity: 'moderate' } as ReportDamage,
        { severity: 'severe' } as ReportDamage,
      ])).toBe(100 - (1 + 3 + 7) * 2); // 78
    });

    it('should determine overall condition from score', () => {
      const getCondition = (score: number): DamageSummary['overallCondition'] => {
        if (score >= 90) return 'excellent';
        if (score >= 70) return 'good';
        if (score >= 50) return 'fair';
        return 'poor';
      };

      expect(getCondition(95)).toBe('excellent');
      expect(getCondition(80)).toBe('good');
      expect(getCondition(60)).toBe('fair');
      expect(getCondition(30)).toBe('poor');
    });

    it('should count damages by severity', () => {
      const damages: ReportDamage[] = [
        { severity: 'minor' } as ReportDamage,
        { severity: 'minor' } as ReportDamage,
        { severity: 'moderate' } as ReportDamage,
        { severity: 'severe' } as ReportDamage,
        { severity: 'critical' } as ReportDamage,
      ];

      const bySeverity: Record<DamageSeverity, number> = {
        minor: 0,
        moderate: 0,
        severe: 0,
        critical: 0,
      };

      damages.forEach(d => bySeverity[d.severity]++);

      expect(bySeverity.minor).toBe(2);
      expect(bySeverity.moderate).toBe(1);
      expect(bySeverity.severe).toBe(1);
      expect(bySeverity.critical).toBe(1);
    });
  });

  describe('Time Estimation', () => {
    it('should estimate repair time correctly', () => {
      const estimateTime = (damages: ReportDamage[]): string => {
        let totalHours = 0;

        damages.forEach(damage => {
          switch (damage.severity) {
            case 'minor': totalHours += 1; break;
            case 'moderate': totalHours += 3; break;
            case 'severe': totalHours += 8; break;
            case 'critical': totalHours += 16; break;
          }
        });

        if (totalHours < 8) {
          return `${totalHours} hora${totalHours > 1 ? 's' : ''}`;
        }

        const days = Math.ceil(totalHours / 8);
        return `${days} dia${days > 1 ? 's' : ''} útil${days > 1 ? 'eis' : ''}`;
      };

      expect(estimateTime([{ severity: 'minor' } as ReportDamage])).toBe('1 hora');
      expect(estimateTime([
        { severity: 'minor' } as ReportDamage,
        { severity: 'moderate' } as ReportDamage,
      ])).toBe('4 horas');
      expect(estimateTime([{ severity: 'severe' } as ReportDamage])).toBe('1 dia útil');
      expect(estimateTime([
        { severity: 'severe' } as ReportDamage,
        { severity: 'critical' } as ReportDamage,
      ])).toBe('3 dias útileis');
    });
  });

  describe('Cost Estimation', () => {
    it('should sum estimated costs', () => {
      const damages: ReportDamage[] = [
        { estimatedRepairCost: 200 } as ReportDamage,
        { estimatedRepairCost: 350 } as ReportDamage,
        { estimatedRepairCost: 500 } as ReportDamage,
      ];

      const totalCost = damages.reduce(
        (sum, d) => sum + (d.estimatedRepairCost || 0),
        0
      );

      expect(totalCost).toBe(1050);
    });

    it('should handle missing costs', () => {
      const damages: ReportDamage[] = [
        { estimatedRepairCost: 200 } as ReportDamage,
        {} as ReportDamage,
        { estimatedRepairCost: 300 } as ReportDamage,
      ];

      const totalCost = damages.reduce(
        (sum, d) => sum + (d.estimatedRepairCost || 0),
        0
      );

      expect(totalCost).toBe(500);
    });
  });

  describe('Urgent Repairs Detection', () => {
    it('should identify urgent repairs', () => {
      const damages: ReportDamage[] = [
        { type: 'scratch', severity: 'minor', location: 'left_door' } as ReportDamage,
        { type: 'dent', severity: 'severe', location: 'hood' } as ReportDamage,
        { type: 'crack', severity: 'critical', location: 'windshield' } as ReportDamage,
      ];

      const urgentRepairs = damages
        .filter(d => d.severity === 'critical' || d.severity === 'severe')
        .map(d => `${DAMAGE_TYPE_LABELS[d.type]} em ${DAMAGE_LOCATION_LABELS[d.location]}`);

      expect(urgentRepairs).toHaveLength(2);
      expect(urgentRepairs).toContain('Amassado em Capô');
      expect(urgentRepairs).toContain('Trinca em Para-brisa');
    });
  });

  describe('Recommendations Generation', () => {
    it('should generate appropriate recommendations', () => {
      const generateRecommendations = (
        bySeverity: Record<DamageSeverity, number>,
        byType: Record<string, number>
      ): string[] => {
        const recommendations: string[] = [];

        if (bySeverity.critical > 0) {
          recommendations.push('Reparos críticos devem ser realizados imediatamente');
        }
        if (bySeverity.severe > 0) {
          recommendations.push('Agendar reparos graves o mais breve possível');
        }
        if (byType.rust) {
          recommendations.push('Tratar ferrugem para evitar propagação');
        }
        if (byType.glass_damage) {
          recommendations.push('Verificar necessidade de troca de vidros');
        }

        return recommendations;
      };

      const recs = generateRecommendations(
        { minor: 1, moderate: 1, severe: 1, critical: 1 },
        { rust: 1, glass_damage: 1 }
      );

      expect(recs).toContain('Reparos críticos devem ser realizados imediatamente');
      expect(recs).toContain('Tratar ferrugem para evitar propagação');
      expect(recs).toHaveLength(4);
    });
  });

  describe('Currency Formatting', () => {
    it('should format currency correctly', () => {
      const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(value);
      };

      expect(formatCurrency(1500)).toBe('R$\u00A01.500,00');
      expect(formatCurrency(350.50)).toBe('R$\u00A0350,50');
      expect(formatCurrency(0)).toBe('R$\u00A00,00');
    });
  });

  describe('Date Formatting', () => {
    it('should format date correctly', () => {
      const formatDate = (date: Date): string => {
        return new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(date);
      };

      const date = new Date('2024-01-15T12:00:00');
      const formatted = formatDate(date);

      expect(formatted).toContain('janeiro');
      expect(formatted).toContain('2024');
    });
  });
});
