/**
 * TORQ Maintenance History - Hook
 * Hook para gerenciar histórico de manutenção
 */

import { useState, useCallback } from 'react';
import { maintenanceHistoryService } from '../services/maintenanceHistoryService';
import type {
  MaintenanceRecord,
  VehicleMaintenanceProfile,
  ServiceCategory,
} from '../types';

interface UseMaintenanceHistoryReturn {
  // Estado
  records: MaintenanceRecord[];
  profile: VehicleMaintenanceProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Ações
  loadVehicleHistory: (
    vehiclePlate: string,
    empresaId: string,
    options?: { limit?: number; category?: ServiceCategory }
  ) => Promise<void>;
  
  loadVehicleProfile: (
    vehiclePlate: string,
    empresaId: string,
    vehicleInfo: { make: string; model: string; year: number; currentMileage: number }
  ) => Promise<void>;
  
  addRecord: (record: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string | null>;
  
  updateRecord: (id: string, updates: Partial<MaintenanceRecord>) => Promise<boolean>;
  
  deleteRecord: (id: string) => Promise<boolean>;
  
  loadRecentRecords: (empresaId: string, limit?: number) => Promise<void>;
  
  createFromBudget: (
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
  ) => Promise<string | null>;
  
  clearData: () => void;
}

export function useMaintenanceHistory(): UseMaintenanceHistoryReturn {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [profile, setProfile] = useState<VehicleMaintenanceProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVehicleHistory = useCallback(async (
    vehiclePlate: string,
    empresaId: string,
    options?: { limit?: number; category?: ServiceCategory }
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const history = await maintenanceHistoryService.getVehicleHistory(
        vehiclePlate,
        empresaId,
        options

      setRecords(history);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar histórico';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadVehicleProfile = useCallback(async (
    vehiclePlate: string,
    empresaId: string,
    vehicleInfo: { make: string; model: string; year: number; currentMileage: number }
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const vehicleProfile = await maintenanceHistoryService.getVehicleProfile(
        vehiclePlate,
        empresaId,
        vehicleInfo

      setProfile(vehicleProfile);
      setRecords(vehicleProfile.lastMaintenance ? [vehicleProfile.lastMaintenance] : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar perfil';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addRecord = useCallback(async (
    record: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const id = await maintenanceHistoryService.addRecord(record);
      
      // Atualizar lista local
      const newRecord: MaintenanceRecord = {
        ...record,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setRecords(prev => [newRecord, ...prev]);
      
      return id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar registro';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRecord = useCallback(async (
    id: string,
    updates: Partial<MaintenanceRecord>
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await maintenanceHistoryService.updateRecord(id, updates);
      
      // Atualizar lista local
      setRecords(prev => prev.map(record => 
        record.id === id 
          ? { ...record, ...updates, updatedAt: new Date() }
          : record
      ));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar registro';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteRecord = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await maintenanceHistoryService.deleteRecord(id);
      
      // Remover da lista local
      setRecords(prev => prev.filter(record => record.id !== id));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover registro';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadRecentRecords = useCallback(async (
    empresaId: string,
    limit: number = 10
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const recentRecords = await maintenanceHistoryService.getRecentRecords(empresaId, limit);
      setRecords(recentRecords);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar registros';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createFromBudget = useCallback(async (
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
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const id = await maintenanceHistoryService.createFromBudget(budgetData, budgetId);
      return id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar registro';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setRecords([]);
    setProfile(null);
    setError(null);
  }, []);

  return {
    records,
    profile,
    isLoading,
    error,
    loadVehicleHistory,
    loadVehicleProfile,
    addRecord,
    updateRecord,
    deleteRecord,
    loadRecentRecords,
    createFromBudget,
    clearData,
  };
}

export default useMaintenanceHistory;
