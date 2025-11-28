/**
 * TORQ Maintenance History Service
 * Serviço para gerenciar histórico de manutenção
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
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
  MaintenanceRecord,
  VehicleMaintenanceProfile,
  UpcomingMaintenance,
  MaintenanceAlert,
  MaintenanceType,
  ServiceCategory,
} from '../types';

class MaintenanceHistoryService {
  private collectionName = 'maintenance_history';

  /**
   * Adiciona um novo registro de manutenção
   */
  async addRecord(record: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, this.collectionName), {
      ...record,
      serviceDate: Timestamp.fromDate(record.serviceDate),
      nextMaintenanceDate: record.nextMaintenanceDate 
        ? Timestamp.fromDate(record.nextMaintenanceDate) 
        : null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return docRef.id;
  }

  /**
   * Atualiza um registro existente
   */
  async updateRecord(id: string, updates: Partial<MaintenanceRecord>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    if (updates.serviceDate) {
      updateData.serviceDate = Timestamp.fromDate(updates.serviceDate);
    }
    if (updates.nextMaintenanceDate) {
      updateData.nextMaintenanceDate = Timestamp.fromDate(updates.nextMaintenanceDate);
    }

    await updateDoc(docRef, updateData);
  }

  /**
   * Remove um registro
   */
  async deleteRecord(id: string): Promise<void> {
    await deleteDoc(doc(db, this.collectionName, id));
  }

  /**
   * Busca histórico de um veículo
   */
  async getVehicleHistory(
    vehiclePlate: string,
    empresaId: string,
    options?: {
      limit?: number;
      category?: ServiceCategory;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<MaintenanceRecord[]> {
    let q = query(
      collection(db, this.collectionName),
      where('vehiclePlate', '==', vehiclePlate),
      where('empresaId', '==', empresaId),
      orderBy('serviceDate', 'desc')
    );

    if (options?.limit) {
      q = query(q, limit(options.limit));
    }

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => this.convertDoc(doc));
  }

  /**
   * Busca perfil de manutenção do veículo
   */
  async getVehicleProfile(
    vehiclePlate: string,
    empresaId: string,
    vehicleInfo: { make: string; model: string; year: number; currentMileage: number }
  ): Promise<VehicleMaintenanceProfile> {
    const records = await this.getVehicleHistory(vehiclePlate, empresaId);

    // Calcular estatísticas
    const totalSpent = records.reduce((sum, r) => sum + r.totalCost, 0);
    const averageCostPerService = records.length > 0 ? totalSpent / records.length : 0;

    // Agrupar por categoria
    const maintenanceByCategory: Record<ServiceCategory, number> = {} as any;
    const maintenanceByYear: Record<number, number> = {};

    records.forEach(record => {
      maintenanceByCategory[record.category] = (maintenanceByCategory[record.category] || 0) + 1;
      const year = new Date(record.serviceDate).getFullYear();
      maintenanceByYear[year] = (maintenanceByYear[year] || 0) + 1;
    });

    // Gerar alertas
    const alerts = this.generateAlerts(records, vehicleInfo.currentMileage);

    // Gerar próximas manutenções
    const upcomingMaintenance = this.generateUpcomingMaintenance(records, vehicleInfo.currentMileage);

    return {
      vehicleId: vehiclePlate,
      vehiclePlate,
      vehicleInfo,
      totalRecords: records.length,
      totalSpent,
      averageCostPerService,
      lastMaintenance: records[0],
      upcomingMaintenance,
      alerts,
      maintenanceByCategory,
      maintenanceByYear,
    };
  }

  /**
   * Busca registros recentes de uma empresa
   */
  async getRecentRecords(empresaId: string, limitCount: number = 10): Promise<MaintenanceRecord[]> {
    const q = query(
      collection(db, this.collectionName),
      where('empresaId', '==', empresaId),
      orderBy('serviceDate', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.convertDoc(doc));
  }

  /**
   * Cria registro a partir de um orçamento finalizado
   */
  async createFromBudget(
    budgetData: {
      vehiclePlate: string;
      empresaId: string;
      services: Array<{ name: string; price: number; category?: string }>;
      parts: Array<{ name: string; quantity: number; price: number }>;
      totalLabor: number;
      totalParts: number;
      total: number;
      mileage?: number;
      technician?: string;
    },
    budgetId: string
  ): Promise<string> {
    const record: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt'> = {
      vehicleId: budgetData.vehiclePlate,
      vehiclePlate: budgetData.vehiclePlate,
      empresaId: budgetData.empresaId,
      serviceDate: new Date(),
      serviceType: 'corrective',
      category: this.inferCategory(budgetData.services),
      description: budgetData.services.map(s => s.name).join(', '),
      mileage: budgetData.mileage || 0,
      technician: budgetData.technician,
      laborCost: budgetData.totalLabor,
      partsCost: budgetData.totalParts,
      totalCost: budgetData.total,
      partsUsed: budgetData.parts.map((p, i) => ({
        id: `part-${i}`,
        name: p.name,
        quantity: p.quantity,
        unitPrice: p.price / p.quantity,
        totalPrice: p.price,
      })),
      budgetId,
      createdBy: 'system',
    };

    return this.addRecord(record);
  }

  /**
   * Gera alertas baseados no histórico
   */
  private generateAlerts(records: MaintenanceRecord[], currentMileage: number): MaintenanceAlert[] {
    const alerts: MaintenanceAlert[] = [];
    const now = new Date();

    // Verificar serviços atrasados
    records.forEach(record => {
      if (record.nextMaintenanceDate && new Date(record.nextMaintenanceDate) < now) {
        alerts.push({
          id: `alert-overdue-${record.id}`,
          type: 'overdue_service',
          severity: 'critical',
          title: 'Serviço Atrasado',
          message: `${record.description} estava previsto para ${new Date(record.nextMaintenanceDate).toLocaleDateString('pt-BR')}`,
          actionRequired: 'Agendar serviço imediatamente',
          createdAt: now,
        });
      }

      if (record.nextMaintenanceMileage && currentMileage >= record.nextMaintenanceMileage) {
        alerts.push({
          id: `alert-mileage-${record.id}`,
          type: 'mileage_milestone',
          severity: 'warning',
          title: 'Quilometragem Atingida',
          message: `${record.description} recomendado a cada ${record.nextMaintenanceMileage.toLocaleString()} km`,
          actionRequired: 'Verificar necessidade de manutenção',
          createdAt: now,
        });
      }
    });

    // Verificar troca de óleo (a cada 10.000 km ou 6 meses)
    const lastOilChange = records.find(r => r.category === 'oil_change');
    if (lastOilChange) {
      const monthsSinceOilChange = this.monthsBetween(new Date(lastOilChange.serviceDate), now);
      const mileageSinceOilChange = currentMileage - lastOilChange.mileage;

      if (monthsSinceOilChange >= 6 || mileageSinceOilChange >= 10000) {
        alerts.push({
          id: 'alert-oil-change',
          type: 'upcoming_service',
          severity: monthsSinceOilChange >= 8 || mileageSinceOilChange >= 12000 ? 'critical' : 'warning',
          title: 'Troca de Óleo',
          message: `Última troca há ${monthsSinceOilChange} meses e ${mileageSinceOilChange.toLocaleString()} km`,
          actionRequired: 'Agendar troca de óleo',
          createdAt: now,
        });
      }
    }

    return alerts;
  }

  /**
   * Gera lista de próximas manutenções
   */
  private generateUpcomingMaintenance(records: MaintenanceRecord[], currentMileage: number): UpcomingMaintenance[] {
    const upcoming: UpcomingMaintenance[] = [];
    const now = new Date();

    // Manutenções padrão baseadas em quilometragem
    const standardMaintenance = [
      { service: 'Troca de óleo', interval: 10000, priority: 'high' as const },
      { service: 'Filtro de ar', interval: 20000, priority: 'medium' as const },
      { service: 'Filtro de combustível', interval: 40000, priority: 'medium' as const },
      { service: 'Velas de ignição', interval: 40000, priority: 'medium' as const },
      { service: 'Correia dentada', interval: 60000, priority: 'high' as const },
      { service: 'Fluido de freio', interval: 40000, priority: 'high' as const },
      { service: 'Fluido de transmissão', interval: 60000, priority: 'medium' as const },
    ];

    standardMaintenance.forEach(maintenance => {
      const lastService = records.find(r => 
        r.description.toLowerCase().includes(maintenance.service.toLowerCase())
      );

      const lastMileage = lastService?.mileage || 0;
      const nextMileage = Math.ceil(currentMileage / maintenance.interval) * maintenance.interval;
      const isOverdue = currentMileage >= nextMileage;

      upcoming.push({
        id: `upcoming-${maintenance.service.replace(/\s/g, '-')}`,
        serviceType: maintenance.service,
        description: `Recomendado a cada ${maintenance.interval.toLocaleString()} km`,
        dueMileage: nextMileage,
        priority: isOverdue ? 'urgent' : maintenance.priority,
        isOverdue,
      });
    });

    return upcoming.sort((a, b) => {
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      return (a.dueMileage || 0) - (b.dueMileage || 0);
    });
  }

  /**
   * Infere categoria baseada nos serviços
   */
  private inferCategory(services: Array<{ name: string; category?: string }>): ServiceCategory {
    const categoryKeywords: Record<ServiceCategory, string[]> = {
      engine: ['motor', 'vela', 'bobina', 'correia'],
      transmission: ['transmissão', 'câmbio', 'embreagem'],
      brakes: ['freio', 'pastilha', 'disco', 'fluido de freio'],
      suspension: ['suspensão', 'amortecedor', 'mola', 'bucha'],
      electrical: ['elétrica', 'bateria', 'alternador', 'motor de partida'],
      cooling: ['arrefecimento', 'radiador', 'termostato', 'bomba d\'água'],
      fuel: ['combustível', 'bomba', 'bico', 'injetor'],
      exhaust: ['escape', 'catalisador', 'silenciador'],
      body: ['carroceria', 'pintura', 'funilaria'],
      interior: ['interior', 'estofado', 'painel'],
      tires: ['pneu', 'alinhamento', 'balanceamento'],
      oil_change: ['óleo', 'filtro de óleo'],
      filters: ['filtro'],
      general: [],
    };

    for (const service of services) {
      const serviceName = service.name.toLowerCase();
      
      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => serviceName.includes(keyword))) {
          return category as ServiceCategory;
        }
      }
    }

    return 'general';
  }

  /**
   * Calcula meses entre duas datas
   */
  private monthsBetween(date1: Date, date2: Date): number {
    const months = (date2.getFullYear() - date1.getFullYear()) * 12;
    return months + date2.getMonth() - date1.getMonth();
  }

  /**
   * Converte documento do Firestore
   */
  private convertDoc(doc: any): MaintenanceRecord {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      serviceDate: data.serviceDate?.toDate() || new Date(),
      nextMaintenanceDate: data.nextMaintenanceDate?.toDate(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
}

export const maintenanceHistoryService = new MaintenanceHistoryService();
export default maintenanceHistoryService;
