/**
 * Parts Extended - VERSÃO COM CÓDIGOS OEM REAIS
 * 
 * IMPORTANTE: Este arquivo foi DEPRECADO.
 * Todos os dados de peças agora vêm do realPartsDatabase.ts
 * 
 * Este arquivo existe apenas para compatibilidade com imports antigos.
 * 
 * @version 3.0.0 - Redirecionado para realPartsDatabase
 * @deprecated Use realPartsDatabase.ts diretamente
 */

import { 
  ALL_REAL_PARTS,
  findPartsForVehicle,
  findPartByOemCode as findByOem,
  findPartsByEquivalentCode,
  getDatabaseStats,
} from '../../../services/automotive-backend/data/realPartsDatabase';

// Re-export everything from realPartsDatabase
export {
  ALL_REAL_PARTS,
  findPartsForVehicle,
  findByOem as findPartByOemCode,
  findPartsByEquivalentCode,
  getDatabaseStats,
};

// Legacy exports for backward compatibility
export const THERMOSTATS_DATABASE: Record<string, any> = {};
export const WATER_PUMPS_DATABASE: Record<string, any> = {};
export const EXTENDED_PARTS_DATABASE: Record<string, any> = {};

// Populate legacy databases from real data
for (const part of ALL_REAL_PARTS) {
  const key = part.oemCode.replace(/[\s-]/g, '_').toUpperCase();
  
  const legacyPart = {
    partNumber: part.oemCode,
    brand: part.manufacturer,
    category: part.category,
    categoryKey: part.category,
    name: part.name,
    specs: part.specs || {},
    equivalents: part.equivalents.map(eq => `${eq.brand} ${eq.code}`),
    applications: part.compatibility.map(c => `${c.brand} ${c.model} ${c.yearStart}-${c.yearEnd}`),
  };
  
  EXTENDED_PARTS_DATABASE[key] = legacyPart;
  
  if (part.name.toLowerCase().includes('termostát') || part.name.toLowerCase().includes('thermostat')) {
    THERMOSTATS_DATABASE[key] = legacyPart;
  }
  
  if (part.name.toLowerCase().includes('bomba') && part.name.toLowerCase().includes('água')) {
    WATER_PUMPS_DATABASE[key] = legacyPart;
  }
}

.length,
  thermostats: Object.keys(THERMOSTATS_DATABASE).length,
  waterPumps: Object.keys(WATER_PUMPS_DATABASE).length,
});

export default {
  THERMOSTATS_DATABASE,
  WATER_PUMPS_DATABASE,
  EXTENDED_PARTS_DATABASE,
  ALL_REAL_PARTS,
  findPartsForVehicle,
  findPartByOemCode: findByOem,
  findPartsByEquivalentCode,
  getDatabaseStats,
};
