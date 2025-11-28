/**
 * TORQ Stock Prediction - Module Index
 * Exportações do módulo de previsão de estoque
 */

// Types
export * from './types';

// Services
export { stockPredictionService } from './services/stockPredictionService';

// Hooks
export { useStockPrediction } from './hooks/useStockPrediction';

// Components
export { StockPredictionDashboard } from './components/StockPredictionDashboard';
export { PredictionCard } from './components/PredictionCard';
export { ReorderList } from './components/ReorderList';
