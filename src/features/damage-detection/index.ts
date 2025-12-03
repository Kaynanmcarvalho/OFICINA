/**
 * TORQ Damage Detection - Main Export
 * Reconhecimento automático de danos em fotos de veículos
 */

// Components
export { DamageOverlay } from './components/DamageOverlay';
export { DamageResultCard } from './components/DamageResultCard';

// Hooks
export { useDamageDetection } from './hooks/useDamageDetection';

// Services
export {
  analyzeImage,
  analyzeMultipleImages,
  calculateDamageSummary,
} from './services/damageDetectionService';

// Types
export * from './types';
