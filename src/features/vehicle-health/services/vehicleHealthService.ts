/**
 * TORQ Vehicle Health - Service
 * Serviço para monitoramento de saúde do veículo
 */

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type {
  VehicleHealth,
  HealthStatus,
  VehicleSystem,
  SystemHealth,
  SystemIssue,
  HealthAlert,
  MaintenanceSchedule,
  MaintenanceType,
  ScoreHistoryEntry,
} from '../types';
import { DEFAULT_MAINTENANCE_INTERVALS } from '../types';

class VehicleHealthService {
  private readonly COLLECTION = 'vehicleHealth';
  private readonly ALERTS_COLLECTION = 'healthAlerts';
  private readonly MAINTENANCE_COLLECTION = 'maintenanceSchedules';

  /**
   * Obtém saúde do veículo
   */
  async getVehicleHealth(
    vehicleId: string,
    empresaId: string
  ): Promise<VehicleHealth | null> {
    try {
      const docRef = doc(db, this.COLLECTION, vehicleId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;

      const data = docSnap.data();
      if (data.empresaId !== empresaId) return null;

      return this.parseHealthData(docSnap.id, data);
    } catch (error) {
      console.error('Erro ao obter saúde do veículo:', error);
      throw error;
    }
  }

  /**
   * Calcula e atualiza saúde do veículo
   */
  async calculateHealth(
    vehicleId: string,
    vehiclePlate: string,
    vehicleInfo: VehicleHealth['vehicleInfo'],
    empresaId: string
  ): Promise<VehicleHealth> {
    try {
      // Buscar dados relacionados
      const [alerts, maintenance, existingHealth] = await Promise.all([
        this.getActiveAlerts(vehicleId, empresaId),
        this.getMaintenanceSchedules(vehicleId, empresaId),
        this.getVehicleHealth(vehicleId, empresaId),
      ]);

      // Calcular scores por sistema
      const systemScores = this.calculateSystemScores(alerts, maintenance);

      // Calcular score geral
      const overallScore = this.calculateOverallScore(systemScores);
      const overallStatus = this.getStatusFromScore(overallScore);

      // Criar entrada no histórico
      const historyEntry: ScoreHistoryEntry = {
        date: new Date(),
        overallScore,
        systemScores: Object.fromEntries(
          Object.entries(systemScores).map(([k, v]) => [k, v.score])
        ),
      };

      // Montar objeto de saúde
      const health: VehicleHealth = {
        vehicleId,
        vehiclePlate,
        vehicleInfo,
        overallScore,
        overallStatus,
        systemScores,
        activeAlerts: alerts.filter((a) => !a.dismissed),
        upcomingMaintenance: maintenance.filter(
          (m) => m.status === 'upcoming' || m.status === 'due' || m.status === 'overdue'
        ),
        scoreHistory: [
          ...(existingHealth?.scoreHistory || []).slice(-29),
          historyEntry,
        ],
        empresaId,
        lastUpdated: new Date(),
        lastInspection: existingHealth?.lastInspection,
      };

      // Salvar no Firestore
      await this.saveHealth(health);

      return health;
    } catch (error) {
      console.error('Erro ao calcular saúde:', error);
      throw error;
    }
  }

  /**
   * Calcula scores por sistema
   */
  private calculateSystemScores(
    alerts: HealthAlert[],
    maintenance: MaintenanceSchedule[]
  ): Record<VehicleSystem, SystemHealth> {
    const systems: VehicleSystem[] = [
      'engine', 'transmission', 'brakes', 'suspension', 'electrical',
      'cooling', 'fuel', 'exhaust', 'steering', 'tires', 'body', 'interior'
    ];

    const scores: Record<VehicleSystem, SystemHealth> = {} as any;

    systems.forEach((system) => {
      // Alertas do sistema
      const systemAlerts = alerts.filter((a) => a.system === system);
      
      // Manutenções do sistema
      const systemMaintenance = maintenance.filter((m) =>
        this.maintenanceAffectsSystem(m.type, system)
      );

      // Calcular penalidades
      let penalty = 0;
      const issues: SystemIssue[] = [];
      const recommendations: string[] = [];

      // Penalidades por alertas
      systemAlerts.forEach((alert) => {
        switch (alert.severity) {
          case 'critical':
            penalty += 30;
            break;
          case 'error':
            penalty += 20;
            break;
          case 'warning':
            penalty += 10;
            break;
          case 'info':
            penalty += 2;
            break;
        }

        issues.push({
          id: alert.id,
          description: alert.message,
          severity: alert.severity,
          detectedAt: alert.createdAt,
          source: 'system',
          resolved: false,
        });
      });

      // Penalidades por manutenção
      systemMaintenance.forEach((m) => {
        if (m.status === 'overdue') {
          penalty += 15;
          recommendations.push(`Realizar ${m.name} (vencido)`);
        } else if (m.status === 'due') {
          penalty += 5;
          recommendations.push(`Agendar ${m.name}`);
        }
      });

      const score = Math.max(0, 100 - penalty);
      const status = this.getStatusFromScore(score);

      scores[system] = {
        system,
        score,
        status,
        lastChecked: new Date(),
        issues,
        recommendations,
      };
    });

    return scores;
  }

  /**
   * Verifica se manutenção afeta sistema
   */
  private maintenanceAffectsSystem(
    maintenanceType: MaintenanceType,
    system: VehicleSystem
  ): boolean {
    const mapping: Record<MaintenanceType, VehicleSystem[]> = {
      oil_change: ['engine'],
      filter_air: ['engine'],
      filter_oil: ['engine'],
      filter_fuel: ['fuel'],
      filter_cabin: ['interior'],
      brake_pads: ['brakes'],
      brake_discs: ['brakes'],
      brake_fluid: ['brakes'],
      coolant: ['cooling'],
      transmission_fluid: ['transmission'],
      spark_plugs: ['engine', 'electrical'],
      timing_belt: ['engine'],
      serpentine_belt: ['engine', 'electrical'],
      battery: ['electrical'],
      tires: ['tires'],
      alignment: ['steering', 'tires'],
      balancing: ['tires'],
      suspension: ['suspension'],
      ac_service: ['cooling', 'interior'],
      general_inspection: [],
      other: [],
    };

    return mapping[maintenanceType]?.includes(system) || false;
  }

  /**
   * Calcula score geral
   */
  private calculateOverallScore(
    systemScores: Record<VehicleSystem, SystemHealth>
  ): number {
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

    Object.entries(systemScores).forEach(([system, health]) => {
      const weight = weights[system as VehicleSystem] || 1;
      totalWeight += weight;
      weightedSum += health.score * weight;
    });

    return Math.round(weightedSum / totalWeight);
  }

  /**
   * Obtém status a partir do score
   */
  private getStatusFromScore(score: number): HealthStatus {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    if (score >= 40) return 'poor';
    return 'critical';
  }

  /**
   * Busca alertas ativos
   */
  async getActiveAlerts(
    vehicleId: string,
    empresaId: string
  ): Promise<HealthAlert[]> {
    try {
      const ref = collection(db, this.ALERTS_COLLECTION);
      const q = query(
        ref,
        where('vehicleId', '==', vehicleId),
        where('empresaId', '==', empresaId),
        where('dismissed', '==', false)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        expiresAt: doc.data().expiresAt?.toDate(),
        dismissedAt: doc.data().dismissedAt?.toDate(),
      })) as HealthAlert[];
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      return [];
    }
  }

  /**
   * Busca agendamentos de manutenção
   */
  async getMaintenanceSchedules(
    vehicleId: string,
    empresaId: string
  ): Promise<MaintenanceSchedule[]> {
    try {
      const ref = collection(db, this.MAINTENANCE_COLLECTION);
      const q = query(
        ref,
        where('vehicleId', '==', vehicleId),
        where('empresaId', '==', empresaId)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dueDate: data.dueDate?.toDate(),
          lastPerformed: data.lastPerformed?.toDate(),
        } as MaintenanceSchedule;
      });
    } catch (error) {
      console.error('Erro ao buscar manutenções:', error);
      return [];
    }
  }

  /**
   * Cria alerta de saúde
   */
  async createAlert(
    vehicleId: string,
    alert: Omit<HealthAlert, 'id' | 'createdAt' | 'dismissed'>,
    empresaId: string
  ): Promise<string> {
    try {
      const docRef = doc(collection(db, this.ALERTS_COLLECTION));
      await setDoc(docRef, {
        ...alert,
        vehicleId,
        empresaId,
        createdAt: Timestamp.now(),
        dismissed: false,
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar alerta:', error);
      throw error;
    }
  }

  /**
   * Dispensa alerta
   */
  async dismissAlert(alertId: string): Promise<void> {
    try {
      const docRef = doc(db, this.ALERTS_COLLECTION, alertId);
      await updateDoc(docRef, {
        dismissed: true,
        dismissedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Erro ao dispensar alerta:', error);
      throw error;
    }
  }

  /**
   * Agenda manutenção
   */
  async scheduleMaintenance(
    vehicleId: string,
    schedule: Omit<MaintenanceSchedule, 'id'>,
    empresaId: string
  ): Promise<string> {
    try {
      const docRef = doc(collection(db, this.MAINTENANCE_COLLECTION));
      await setDoc(docRef, {
        ...schedule,
        vehicleId,
        empresaId,
        dueDate: schedule.dueDate ? Timestamp.fromDate(schedule.dueDate) : null,
        lastPerformed: schedule.lastPerformed
          ? Timestamp.fromDate(schedule.lastPerformed)
          : null,
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao agendar manutenção:', error);
      throw error;
    }
  }

  /**
   * Marca manutenção como realizada
   */
  async completeMaintenance(
    scheduleId: string,
    mileage: number
  ): Promise<void> {
    try {
      const docRef = doc(db, this.MAINTENANCE_COLLECTION, scheduleId);
      await updateDoc(docRef, {
        status: 'completed',
        lastPerformed: Timestamp.now(),
        lastMileage: mileage,
      });
    } catch (error) {
      console.error('Erro ao completar manutenção:', error);
      throw error;
    }
  }

  /**
   * Salva dados de saúde
   */
  private async saveHealth(health: VehicleHealth): Promise<void> {
    const docRef = doc(db, this.COLLECTION, health.vehicleId);
    await setDoc(docRef, {
      ...health,
      lastUpdated: Timestamp.now(),
      lastInspection: health.lastInspection
        ? Timestamp.fromDate(health.lastInspection)
        : null,
      scoreHistory: health.scoreHistory.map((entry) => ({
        ...entry,
        date: Timestamp.fromDate(entry.date),
      })),
    });
  }

  /**
   * Parse dos dados do Firestore
   */
  private parseHealthData(id: string, data: any): VehicleHealth {
    return {
      ...data,
      vehicleId: id,
      lastUpdated: data.lastUpdated?.toDate() || new Date(),
      lastInspection: data.lastInspection?.toDate(),
      scoreHistory: (data.scoreHistory || []).map((entry: any) => ({
        ...entry,
        date: entry.date?.toDate() || new Date(),
      })),
      activeAlerts: (data.activeAlerts || []).map((alert: any) => ({
        ...alert,
        createdAt: alert.createdAt?.toDate() || new Date(),
      })),
      upcomingMaintenance: (data.upcomingMaintenance || []).map((m: any) => ({
        ...m,
        dueDate: m.dueDate?.toDate(),
        lastPerformed: m.lastPerformed?.toDate(),
      })),
    };
  }

  /**
   * Gera manutenções padrão para veículo
   */
  async generateDefaultMaintenanceSchedule(
    vehicleId: string,
    currentMileage: number,
    empresaId: string
  ): Promise<void> {
    const maintenanceTypes: MaintenanceType[] = [
      'oil_change', 'filter_air', 'filter_oil', 'brake_pads',
      'coolant', 'spark_plugs', 'tires', 'alignment'
    ];

    for (const type of maintenanceTypes) {
      const interval = DEFAULT_MAINTENANCE_INTERVALS[type];
      const nextDue = Math.ceil(currentMileage / interval) * interval;

      await this.scheduleMaintenance(
        vehicleId,
        {
          type,
          name: type.replace(/_/g, ' '),
          dueMileage: nextDue,
          status: currentMileage >= nextDue ? 'due' : 'upcoming',
          mileageUntilDue: nextDue - currentMileage,
          priority: currentMileage >= nextDue ? 'high' : 'medium',
        },
        empresaId
      );
    }
  }
}

export const vehicleHealthService = new VehicleHealthService();
