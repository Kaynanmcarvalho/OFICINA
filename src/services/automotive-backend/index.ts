/**
 * TORQ Automotive Backend
 * Sistema especializado em catálogo de veículos e peças
 * 
 * @version 2.0.0
 * @description Backend automotivo com cobertura TOTAL de veículos brasileiros,
 * checklist de peças por categoria, compatibilidade cruzada e persistência Firebase
 * 
 * COBERTURA:
 * - Motos: Honda, Yamaha, Kawasaki, Suzuki, BMW, Ducati, Harley, Triumph, etc.
 * - Carros: VW, Fiat, Chevrolet, Ford, Toyota, Honda, Hyundai, Renault, etc.
 * - SUVs: Todas as marcas
 * - Pickups: Hilux, S10, Ranger, Amarok, Toro, etc.
 * - Vans: Fiorino, Kangoo, Sprinter, etc.
 * - Caminhões: Mercedes, Scania, Volvo, Iveco, VW, Ford, etc.
 * - Ônibus: Mercedes, Scania, Volvo, etc.
 */

export * from './types';
export * from './constants/checklists';
export * from './services/firebasePartsService';
export * from './services/partsLookupService';
export * from './services/seedService';
export * from './services/massiveSeedService';

// Validation Services
export * from './services/googleScraperValidation';
export * from './services/partsValidationRunner';
export * from './services/massivePartsValidation';
export * from './services/partsGeneratorService';
export * from './services/fullPartsValidationOrchestrator';
export * from './services/validationUIService';

// Data exports
export * from './data/realPartsDatabase';
