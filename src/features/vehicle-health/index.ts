/**
 * TORQ Vehicle Health - Module Index
 * Exportações do módulo de saúde do veículo
 */

// Types
export * from './types';

// Services
export { vehicleHealthService } from './services/vehicleHealthService';

// Hooks
export { useVehicleHealth } from './hooks/useVehicleHealth';

// Components
export { VehicleHealthDashboard } from './components/VehicleHealthDashboard';
export { HealthScoreRing } from './components/HealthScoreRing';
export { SystemHealthCard } from './components/SystemHealthCard';
