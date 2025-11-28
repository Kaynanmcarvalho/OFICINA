/**
 * TORQ Service Suggestion Feature
 * Sugestão automática de serviços baseada em diagnósticos
 */

// Types
export * from './types';

// Services
export { serviceSuggestionService } from './services/serviceSuggestionService';

// Hooks
export { useServiceSuggestion } from './hooks/useServiceSuggestion';

// Components
export { ServiceSuggestionPanel } from './components/ServiceSuggestionPanel';

// Data
export { DTC_SERVICE_MAPPINGS, DAMAGE_SERVICE_MAPPINGS, MILEAGE_SERVICES } from './data/dtcMappings';
