/**
 * TORQ Vehicle Health - Hook
 * Hook React para monitoramento de saúde do veículo
 */

import { useState, useCallback, useEffect } from 'react';
import { vehicleHealthService } from '../services/vehicleHealthService';
import type {
  VehicleHealth,
  VehicleSystem,
  HealthAlert,
  MaintenanceSchedule,
  MaintenanceType,
} from '../types';

interface UseVehicleHealthOptions {
  empresaId: string;
  vehicleId?: string;
  autoLoad?: boolean;
}

interface UseVehicleHealthReturn {
  // Estado
  health: VehicleHealth | null;
  alerts: HealthAlert[];
  maintenance: MaintenanceSchedule[];
  isLoading: boolean;
  error: string | null;

  // Ações
  loadHealth: (vehicleId: string, plate: string, info: VehicleHealth['vehicleInfo']) => Promise<void>;
  refreshHealth: () => Promise<void>;
  dismissAlert: (alertId: string) => Promise<void>;
  completeMaintenance: (scheduleId: string, mileage: number) => Promise<void>;
  scheduleMaintenance: (schedule: Omit<MaintenanceSchedule, 'id'>) => Promise<void>;
  clearError: () => void;

  // Dados derivados
  criticalAlerts: HealthAlert[];
  overdueMaintenance: MaintenanceSchedule[];
  systemsNeedingAttention: VehicleSystem[];
}

export function useVehicleHealth(
  options: UseVehicleHealthOptions
): UseVehicleHealthReturn {
  const { empresaId, vehicleId: initialVehicleId, autoLoad = false } = options;

  // Estados
  const [health, setHealth] = useState<VehicleHealth | null>(null);
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVehicleId, setCurrentVehicleId] = useState<string | undefined>(
    initialVehicleId
  );

  /**
   * Carrega saúde do veículo
   */
  const loadHealth = useCallback(
    async (
      vehicleId: string,
      plate: string,
      info: VehicleHealth['vehicleInfo']
    ) => {
      setIsLoading(true);
      setError(null);
      setCurrentVehicleId(vehicleId);

      try {
        const healthData = await vehicleHealthService.calculateHealth(
          vehicleId,
          plate,
          info,
          empresaId
        );

        setHealth(healthData);
        setAlerts(healthData.activeAlerts);
        setMaintenance(healthData.upcomingMaintenance);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar saúde';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [empresaId]
  );

  /**
   * Atualiza saúde
   */
  const refreshHealth = useCallback(async () => {
    if (!health) return;

    await loadHealth(
      health.vehicleId,
      health.vehiclePlate,
      health.vehicleInfo
    );
  }, [health, loadHealth]);

  /**
   * Dispensa alerta
   */
  const dismissAlert = useCallback(
    async (alertId: string) => {
      try {
        await vehicleHealthService.dismissAlert(alertId);
        setAlerts((prev) => prev.filter((a) => a.id !== alertId));
        
        // Atualizar health
        if (health) {
          setHealth((prev) =>
            prev
              ? {
                  ...prev,
                  activeAlerts: prev.activeAlerts.filter((a) => a.id !== alertId),
                }
              : null
          );
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao dispensar alerta';
        setError(message);
      }
    },
    [health]
  );

  /**
   * Completa manutenção
   */
  const completeMaintenance = useCallback(
    async (scheduleId: string, mileage: number) => {
      try {
        await vehicleHealthService.completeMaintenance(scheduleId, mileage);
        
        // Atualizar lista
        setMaintenance((prev) =>
          prev.map((m) =>
            m.id === scheduleId ? { ...m, status: 'completed' as const } : m
          )
        );

        // Recalcular saúde
        await refreshHealth();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao completar manutenção';
        setError(message);
      }
    },
    [refreshHealth]
  );

  /**
   * Agenda manutenção
   */
  const scheduleMaintenance = useCallback(
    async (schedule: Omit<MaintenanceSchedule, 'id'>) => {
      if (!currentVehicleId) {
        setError('Veículo não selecionado');
        return;
      }

      try {
        await vehicleHealthService.scheduleMaintenance(
          currentVehicleId,
          schedule,
          empresaId
        );

        // Recarregar manutenções
        const schedules = await vehicleHealthService.getMaintenanceSchedules(
          currentVehicleId,
          empresaId
        );
        setMaintenance(schedules);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao agendar manutenção';
        setError(message);
      }
    },
    [currentVehicleId, empresaId]
  );

  /**
   * Limpa erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Alertas críticos
   */
  const criticalAlerts = alerts.filter(
    (a) => a.severity === 'critical' || a.severity === 'error'
  );

  /**
   * Manutenções vencidas
   */
  const overdueMaintenance = maintenance.filter((m) => m.status === 'overdue');

  /**
   * Sistemas que precisam de atenção
   */
  const systemsNeedingAttention: VehicleSystem[] = health
    ? (Object.entries(health.systemScores)
        .filter(([, h]) => h.status === 'poor' || h.status === 'critical')
        .map(([system]) => system) as VehicleSystem[])
    : [];

  /**
   * Auto-load
   */
  useEffect(() => {
    if (autoLoad && initialVehicleId && empresaId) {
      vehicleHealthService
        .getVehicleHealth(initialVehicleId, empresaId)
        .then((data) => {
          if (data) {
            setHealth(data);
            setAlerts(data.activeAlerts);
            setMaintenance(data.upcomingMaintenance);
          }
        })
        .catch(console.error);
    }
  }, [autoLoad, initialVehicleId, empresaId]);

  return {
    // Estado
    health,
    alerts,
    maintenance,
    isLoading,
    error,

    // Ações
    loadHealth,
    refreshHealth,
    dismissAlert,
    completeMaintenance,
    scheduleMaintenance,
    clearError,

    // Dados derivados
    criticalAlerts,
    overdueMaintenance,
    systemsNeedingAttention,
  };
}
