/**
 * TORQ Vehicle History Service
 * Serviço para gerenciar histórico completo do veículo
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type {
  VehicleHistoryRecord,
  VehicleProfile,
  VehicleStats,
  VehicleAlert,
  VehicleEventType,
  VehicleTimelineFilter,
  EventSource,
} from '../types';

class VehicleHistoryService {
  private historyCollection = 'vehicle_history';
  private profilesCollection = 'vehicle_profiles';

  /**
   * Adiciona um evento ao histórico do veículo
   */
  async addEvent(
    event: Omit<VehicleHistoryRecord, 'id' | 'createdAt'>
  ): Promise<string> {
    const docRef = await addDoc(collection(db, this.historyCollection), {
      ...event,
      eventDate: Timestamp.fromDate(event.eventDate),
      createdAt: Timestamp.now(),
    });

    // Atualizar última atividade no perfil
    await this.updateLastActivity(event.vehiclePlate, event.empresaId);

    return docRef.id;
  }

  /**
   * Busca histórico de um veículo com filtros
   */
  async getVehicleHistory(
    vehiclePlate: string,
    empresaId: string,
    filter?: VehicleTimelineFilter,
    limitCount: number = 50
  ): Promise<VehicleHistoryRecord[]> {
    let q = query(
      collection(db, this.historyCollection),
      where('vehiclePlate', '==', vehiclePlate),
      where('empresaId', '==', empresaId),
      orderBy('eventDate', 'desc'),
      limit(limitCount)

    const snapshot = await getDocs(q);
    let records = snapshot.docs.map(doc => this.convertHistoryDoc(doc));

    // Aplicar filtros adicionais no cliente
    if (filter) {
      if (filter.eventTypes && filter.eventTypes.length > 0) {
        records = records.filter(r => filter.eventTypes!.includes(r.eventType));
      }
      if (filter.sources && filter.sources.length > 0) {
        records = records.filter(r => filter.sources!.includes(r.source));
      }
      if (filter.startDate) {
        records = records.filter(r => new Date(r.eventDate) >= filter.startDate!);
      }
      if (filter.endDate) {
        records = records.filter(r => new Date(r.eventDate) <= filter.endDate!);
      }
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        records = records.filter(r => 
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query)

      }
    }

    return records;
  }

  /**
   * Busca ou cria perfil do veículo
   */
  async getOrCreateProfile(
    vehiclePlate: string,
    empresaId: string,
    vehicleInfo?: Partial<VehicleProfile>
  ): Promise<VehicleProfile> {
    // Buscar perfil existente
    const q = query(
      collection(db, this.profilesCollection),
      where('plate', '==', vehiclePlate),
      where('empresaId', '==', empresaId),
      limit(1)

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return this.convertProfileDoc(snapshot.docs[0]);
    }

    // Criar novo perfil
    const newProfile: Omit<VehicleProfile, 'id'> = {
      plate: vehiclePlate,
      make: vehicleInfo?.make || 'Não informado',
      model: vehicleInfo?.model || 'Não informado',
      year: vehicleInfo?.year || new Date().getFullYear(),
      currentMileage: vehicleInfo?.currentMileage || 0,
      stats: this.getEmptyStats(),
      activeAlerts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      empresaId,
      ...vehicleInfo,
    };

    const docRef = await addDoc(collection(db, this.profilesCollection), {
      ...newProfile,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return { id: docRef.id, ...newProfile };
  }

  /**
   * Atualiza perfil do veículo
   */
  async updateProfile(
    profileId: string,
    updates: Partial<VehicleProfile>
  ): Promise<void> {
    const docRef = doc(db, this.profilesCollection, profileId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  /**
   * Atualiza quilometragem do veículo
   */
  async updateMileage(
    vehiclePlate: string,
    empresaId: string,
    mileage: number,
    source: EventSource = 'user'
  ): Promise<void> {
    const profile = await this.getOrCreateProfile(vehiclePlate, empresaId);

    // Só atualizar se for maior que a atual
    if (mileage > profile.currentMileage) {
      await this.updateProfile(profile.id, {
        currentMileage: mileage,
        lastMileageUpdate: new Date(),
      });

      // Registrar evento
      await this.addEvent({
        vehicleId: profile.id,
        vehiclePlate,
        empresaId,
        eventType: 'mileage_update',
        eventDate: new Date(),
        title: 'Quilometragem Atualizada',
        description: `Quilometragem atualizada de ${profile.currentMileage.toLocaleString()} para ${mileage.toLocaleString()} km`,
        mileage,
        source,
        createdBy: 'system',
      });
    }
  }

  /**
   * Calcula estatísticas do veículo
   */
  async calculateStats(
    vehiclePlate: string,
    empresaId: string
  ): Promise<VehicleStats> {
    const history = await this.getVehicleHistory(vehiclePlate, empresaId, undefined, 1000);

    const stats: VehicleStats = {
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

    let maintenanceCosts: number[] = [];
    let lastServiceDate: Date | undefined;

    history.forEach(record => {
      switch (record.eventType) {
        case 'checkin':
          stats.totalCheckins++;
          break;
        case 'maintenance':
          stats.totalMaintenances++;
          const cost = (record.eventData?.totalCost as number) || 0;
          if (cost > 0) {
            stats.totalSpent += cost;
            maintenanceCosts.push(cost);
          }
          if (!lastServiceDate || new Date(record.eventDate) > lastServiceDate) {
            lastServiceDate = new Date(record.eventDate);
          }
          break;
        case 'budget':
        case 'budget_approved':
          stats.totalBudgets++;
          break;
        case 'damage_detected':
          stats.damagesDetected++;
          break;
        case 'damage_repaired':
          stats.damagesRepaired++;
          break;
        case 'obd_scan':
          stats.obdScansPerformed++;
          break;
        case 'dtc_detected':
          stats.dtcCodesFound++;
          break;
      }
    });

    if (maintenanceCosts.length > 0) {
      stats.averageServiceCost = stats.totalSpent / maintenanceCosts.length;
    }

    if (lastServiceDate) {
      stats.lastServiceDate = lastServiceDate;
      stats.daysSinceLastService = Math.floor(
        (Date.now() - lastServiceDate.getTime()) / (1000 * 60 * 60 * 24)

    }

    return stats;
  }

  /**
   * Gera alertas para o veículo
   */
  async generateAlerts(
    vehiclePlate: string,
    empresaId: string
  ): Promise<VehicleAlert[]> {
    const alerts: VehicleAlert[] = [];
    const profile = await this.getOrCreateProfile(vehiclePlate, empresaId);
    const stats = await this.calculateStats(vehiclePlate, empresaId);

    // Alerta de manutenção atrasada
    if (stats.daysSinceLastService && stats.daysSinceLastService > 180) {
      alerts.push({
        id: `alert-maintenance-${Date.now()}`,
        type: 'maintenance_due',
        severity: stats.daysSinceLastService > 365 ? 'critical' : 'warning',
        title: 'Manutenção Pendente',
        message: `Última manutenção há ${stats.daysSinceLastService} dias`,
        createdAt: new Date(),
      });
    }

    // Alerta de danos não reparados
    const unrepairedDamages = stats.damagesDetected - stats.damagesRepaired;
    if (unrepairedDamages > 0) {
      alerts.push({
        id: `alert-damage-${Date.now()}`,
        type: 'damage_unrepaired',
        severity: unrepairedDamages > 2 ? 'warning' : 'info',
        title: 'Danos Não Reparados',
        message: `${unrepairedDamages} dano(s) detectado(s) aguardando reparo`,
        createdAt: new Date(),
      });
    }

    // Alerta de marco de quilometragem
    const milestones = [10000, 20000, 30000, 40000, 50000, 60000, 80000, 100000];
    const nextMilestone = milestones.find(m => m > profile.currentMileage);
    if (nextMilestone && profile.currentMileage >= nextMilestone - 1000) {
      alerts.push({
        id: `alert-mileage-${Date.now()}`,
        type: 'mileage_milestone',
        severity: 'info',
        title: 'Marco de Quilometragem',
        message: `Próximo de ${nextMilestone.toLocaleString()} km - considere revisão`,
        createdAt: new Date(),
      });
    }

    return alerts;
  }

  /**
   * Registra check-in no histórico
   */
  async recordCheckin(
    vehiclePlate: string,
    empresaId: string,
    checkinId: string,
    mileage?: number,
    notes?: string
  ): Promise<void> {
    await this.addEvent({
      vehicleId: vehiclePlate,
      vehiclePlate,
      empresaId,
      eventType: 'checkin',
      eventDate: new Date(),
      title: 'Check-in Realizado',
      description: notes || 'Veículo recebido para serviço',
      mileage,
      checkinId,
      source: 'system',
      createdBy: 'system',
    });

    if (mileage) {
      await this.updateMileage(vehiclePlate, empresaId, mileage, 'system');
    }
  }

  /**
   * Registra manutenção no histórico
   */
  async recordMaintenance(
    vehiclePlate: string,
    empresaId: string,
    maintenanceId: string,
    data: {
      description: string;
      totalCost: number;
      mileage?: number;
      services?: string[];
    }
  ): Promise<void> {
    await this.addEvent({
      vehicleId: vehiclePlate,
      vehiclePlate,
      empresaId,
      eventType: 'maintenance',
      eventDate: new Date(),
      title: 'Manutenção Realizada',
      description: data.description,
      mileage: data.mileage,
      maintenanceId,
      eventData: {
        totalCost: data.totalCost,
        services: data.services,
      },
      source: 'system',
      createdBy: 'system',
    });
  }

  /**
   * Registra scan OBD no histórico
   */
  async recordOBDScan(
    vehiclePlate: string,
    empresaId: string,
    scanData: {
      codesFound: string[];
      healthStatus: string;
      mileage?: number;
    }
  ): Promise<void> {
    await this.addEvent({
      vehicleId: vehiclePlate,
      vehiclePlate,
      empresaId,
      eventType: 'obd_scan',
      eventDate: new Date(),
      title: 'Diagnóstico OBD Realizado',
      description: `${scanData.codesFound.length} código(s) encontrado(s) - Saúde: ${scanData.healthStatus}`,
      mileage: scanData.mileage,
      eventData: {
        codes: scanData.codesFound,
        health: scanData.healthStatus,
      },
      source: 'obd',
      createdBy: 'system',
    });

    // Registrar cada código como evento separado
    for (const code of scanData.codesFound) {
      await this.addEvent({
        vehicleId: vehiclePlate,
        vehiclePlate,
        empresaId,
        eventType: 'dtc_detected',
        eventDate: new Date(),
        title: `Código ${code} Detectado`,
        description: `Código de diagnóstico ${code} encontrado no scan OBD`,
        eventData: { code },
        source: 'obd',
        createdBy: 'system',
      });
    }
  }

  /**
   * Registra dano detectado
   */
  async recordDamageDetected(
    vehiclePlate: string,
    empresaId: string,
    damageData: {
      type: string;
      severity: string;
      description: string;
      photoUrl?: string;
    }
  ): Promise<void> {
    await this.addEvent({
      vehicleId: vehiclePlate,
      vehiclePlate,
      empresaId,
      eventType: 'damage_detected',
      eventDate: new Date(),
      title: `Dano Detectado: ${damageData.type}`,
      description: damageData.description,
      eventData: {
        type: damageData.type,
        severity: damageData.severity,
      },
      attachments: damageData.photoUrl ? [{
        id: `photo-${Date.now()}`,
        type: 'image',
        url: damageData.photoUrl,
        name: 'damage-photo.jpg',
        size: 0,
        uploadedAt: new Date(),
      }] : undefined,
      source: 'ai',
      createdBy: 'system',
    });
  }

  // Métodos auxiliares
  private async updateLastActivity(vehiclePlate: string, empresaId: string): Promise<void> {
    try {
      const profile = await this.getOrCreateProfile(vehiclePlate, empresaId);
      await this.updateProfile(profile.id, { updatedAt: new Date() });
    } catch (error) {
      }
  }

  private getEmptyStats(): VehicleStats {
    return {
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
  }

  private convertHistoryDoc(doc: any): VehicleHistoryRecord {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      eventDate: data.eventDate?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
    };
  }

  private convertProfileDoc(doc: any): VehicleProfile {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      lastMileageUpdate: data.lastMileageUpdate?.toDate(),
    };
  }
}

export const vehicleHistoryService = new VehicleHistoryService();
export default vehicleHistoryService;
