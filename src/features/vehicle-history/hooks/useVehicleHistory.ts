/**
 * TORQ Vehicle History - Hook
 * Hook para gerenciar histórico do veículo
 */

import { useState, useCallback } from 'react';
import { vehicleHistoryService } from '../services/vehicleHistoryService';
import type {
  VehicleHistoryRecord,
  VehicleProfile,
  VehicleStats,
  VehicleAlert,
  VehicleTimelineFilter,
  VehicleEventType,
  EventSource,
} from '../types';

interface UseVehicleHistoryReturn {
  // Estado
  history: VehicleHistoryRecord[];
  profile: VehicleProfile | null;
  stats: VehicleStats | null;
  alerts: VehicleAlert[];
  isLoading: boolean;
  error: string | null;
  
  // Ações
  loadHistory: (
    vehiclePlate: string,
    empresaId: string,
    filter?: VehicleTimelineFilter
  ) => Promise<void>;
  
  loadProfile: (
    vehiclePlate: string,
    empresaId: string,
    vehicleInfo?: Partial<VehicleProfile>
  ) => Promise<void>;
  
  loadStats: (vehiclePlate: string, empresaId: string) => Promise<void>;
  
  loadAlerts: (vehiclePlate: string, empresaId: string) => Promise<void>;
  
  addEvent: (
    event: Omit<VehicleHistoryRecord, 'id' | 'createdAt'>
  ) => Promise<string | null>;
  
  updateMileage: (
    vehiclePlate: string,
    empresaId: string,
    mileage: number
  ) => Promise<void>;
  
  recordCheckin: (
    vehiclePlate: string,
    empresaId: string,
    checkinId: string,
    mileage?: number,
    notes?: string
  ) => Promise<void>;
  
  recordMaintenance: (
    vehiclePlate: string,
    empresaId: string,
    maintenanceId: string,
    data: {
      description: string;
      totalCost: number;
      mileage?: number;
      services?: string[];
    }
  ) => Promise<void>;
  
  recordOBDScan: (
    vehiclePlate: string,
    empresaId: string,
    scanData: {
      codesFound: string[];
      healthStatus: string;
      mileage?: number;
    }
  ) => Promise<void>;
  
  recordDamageDetected: (
    vehiclePlate: string,
    empresaId: string,
    damageData: {
      type: string;
      severity: string;
      description: string;
      photoUrl?: string;
    }
  ) => Promise<void>;
  
  clearData: () => void;
}

export function useVehicleHistory(): UseVehicleHistoryReturn {
  const [history, setHistory] = useState<VehicleHistoryRecord[]>([]);
  const [profile, setProfile] = useState<VehicleProfile | null>(null);
  const [stats, setStats] = useState<VehicleStats | null>(null);
  const [alerts, setAlerts] = useState<VehicleAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async (
    vehiclePlate: string,
    empresaId: string,
    filter?: VehicleTimelineFilter
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const records = await vehicleHistoryService.getVehicleHistory(
        vehiclePlate,
        empresaId,
        filter
      );
      setHistory(records);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar histórico';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadProfile = useCallback(async (
    vehiclePlate: string,
    empresaId: string,
    vehicleInfo?: Partial<VehicleProfile>
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const vehicleProfile = await vehicleHistoryService.getOrCreateProfile(
        vehiclePlate,
        empresaId,
        vehicleInfo
      );
      setProfile(vehicleProfile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar perfil';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadStats = useCallback(async (
    vehiclePlate: string,
    empresaId: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const vehicleStats = await vehicleHistoryService.calculateStats(
        vehiclePlate,
        empresaId
      );
      setStats(vehicleStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao calcular estatísticas';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAlerts = useCallback(async (
    vehiclePlate: string,
    empresaId: string
  ) => {
    try {
      const vehicleAlerts = await vehicleHistoryService.generateAlerts(
        vehiclePlate,
        empresaId
      );
      setAlerts(vehicleAlerts);
    } catch (err) {
      console.warn('Erro ao gerar alertas:', err);
    }
  }, []);

  const addEvent = useCallback(async (
    event: Omit<VehicleHistoryRecord, 'id' | 'createdAt'>
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const id = await vehicleHistoryService.addEvent(event);
      
      // Adicionar ao histórico local
      const newRecord: VehicleHistoryRecord = {
        ...event,
        id,
        createdAt: new Date(),
      };
      setHistory(prev => [newRecord, ...prev]);
      
      return id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar evento';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateMileage = useCallback(async (
    vehiclePlate: string,
    empresaId: string,
    mileage: number
  ) => {
    try {
      await vehicleHistoryService.updateMileage(vehiclePlate, empresaId, mileage);
      
      // Atualizar perfil local
      if (profile && profile.plate === vehiclePlate) {
        setProfile(prev => prev ? { ...prev, currentMileage: mileage } : null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar quilometragem';
      setError(errorMessage);
    }
  }, [profile]);

  const recordCheckin = useCallback(async (
    vehiclePlate: string,
    empresaId: string,
    checkinId: string,
    mileage?: number,
    notes?: string
  ) => {
    try {
      await vehicleHistoryService.recordCheckin(
        vehiclePlate,
        empresaId,
        checkinId,
        mileage,
        notes
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar check-in';
      setError(errorMessage);
    }
  }, []);

  const recordMaintenance = useCallback(async (
    vehiclePlate: string,
    empresaId: string,
    maintenanceId: string,
    data: {
      description: string;
      totalCost: number;
      mileage?: number;
      services?: string[];
    }
  ) => {
    try {
      await vehicleHistoryService.recordMaintenance(
        vehiclePlate,
        empresaId,
        maintenanceId,
        data
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar manutenção';
      setError(errorMessage);
    }
  }, []);

  const recordOBDScan = useCallback(async (
    vehiclePlate: string,
    empresaId: string,
    scanData: {
      codesFound: string[];
      healthStatus: string;
      mileage?: number;
    }
  ) => {
    try {
      await vehicleHistoryService.recordOBDScan(vehiclePlate, empresaId, scanData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar scan OBD';
      setError(errorMessage);
    }
  }, []);

  const recordDamageDetected = useCallback(async (
    vehiclePlate: string,
    empresaId: string,
    damageData: {
      type: string;
      severity: string;
      description: string;
      photoUrl?: string;
    }
  ) => {
    try {
      await vehicleHistoryService.recordDamageDetected(vehiclePlate, empresaId, damageData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar dano';
      setError(errorMessage);
    }
  }, []);

  const clearData = useCallback(() => {
    setHistory([]);
    setProfile(null);
    setStats(null);
    setAlerts([]);
    setError(null);
  }, []);

  return {
    history,
    profile,
    stats,
    alerts,
    isLoading,
    error,
    loadHistory,
    loadProfile,
    loadStats,
    loadAlerts,
    addEvent,
    updateMileage,
    recordCheckin,
    recordMaintenance,
    recordOBDScan,
    recordDamageDetected,
    clearData,
  };
}

export default useVehicleHistory;
