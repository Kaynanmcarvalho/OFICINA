/**
 * TORQ AI - Serviço Unificado de Busca de Peças
 * 
 * Este serviço integra múltiplas fontes de dados:
 * 1. API FIPE - Dados de veículos brasileiros
 * 2. Base HiFlo verificada - Filtros de óleo
 * 3. Cross-reference K&N - Equivalências
 * 
 * @author TORQ AI Team
 * @version 2.0.0
 */

import { vehicleApiService, VehicleDetails, VehicleType } from './vehicleApiService';
import { 
  partsApiService, 
  searchOilFilter, 
  getSupportedMakes, 
  getSupportedModels,
  isVehicleSupported,
  PartSearchResult,
  CompatiblePart,
  PartCategory
} from './partsApiService';
import { 
  findModel, 
  getMotorcycleModels, 
  searchVehicles,
  getDatabaseStats 
} from '../data/vehicleDatabaseV2';

// ============================================================================
// TIPOS EXPORTADOS
// ============================================================================

export type { PartSearchResult, CompatiblePart, PartCategory };
export type { VehicleDetails, VehicleType };

export interface VehicleSearchResult {
  make: string;
  model: string;
  year?: number;
  type: VehicleType;
  engine?: string;
  displacement?: string;
  fipePrice?: number;
}

export interface PartsLookupOptions {
  includeOEM?: boolean;
  includeAftermarket?: boolean;
  includePremium?: boolean;
  includeEconomy?: boolean;
  maxResults?: number;
}

// ============================================================================
// SERVIÇO PRINCIPAL
// ============================================================================

export class PartsLookupService {
  private vehicleApi = vehicleApiService;
  private partsApi = partsApiService;

  /**
   * Busca peças compatíveis para um veículo
   */
  async searchParts(
    make: string,
    model: string,
    year?: number,
    category: PartCategory = 'oil_filter',
    options: PartsLookupOptions = {}
  ): Promise<PartSearchResult> {
    const {
      includeOEM = true,
      includeAftermarket = true,
      includePremium = true,
      includeEconomy = true,
      maxResults = 10,
    } = options;

    // Busca na base verificada
    const result = await this.partsApi.searchParts(make, model, year, category);

    // Filtra por tipo se necessário
    if (result.success && result.parts.length > 0) {
      result.parts = result.parts.filter(part => {
        if (part.type === 'oem' && !includeOEM) return false;
        if (part.type === 'aftermarket' && !includeAftermarket) return false;
        if (part.type === 'premium' && !includePremium) return false;
        if (part.type === 'economy' && !includeEconomy) return false;
        return true;
      });

      // Limita resultados
      if (result.parts.length > maxResults) {
        result.parts = result.parts.slice(0, maxResults);
      }
    }

    return result;
  }

  /**
   * Busca rápida de filtro de óleo
   */
  searchOilFilter(make: string, model: string, year?: number): PartSearchResult {
    return searchOilFilter(make, model, year);
  }

  /**
   * Verifica se um veículo é suportado
   */
  isVehicleSupported(make: string, model: string): boolean {
    return isVehicleSupported(make, model);
  }

  /**
   * Lista marcas suportadas
   */
  getSupportedMakes(): string[] {
    return getSupportedMakes();
  }

  /**
   * Lista modelos de uma marca
   */
  getSupportedModels(make: string): string[] {
    return getSupportedModels(make);
  }

  /**
   * Busca informações do veículo na API FIPE
   */
  async getVehicleFromFIPE(
    type: VehicleType,
    makeId: string,
    modelId: string,
    yearId: string
  ): Promise<VehicleDetails | null> {
    return this.vehicleApi.getVehicleDetails(type, makeId, modelId, yearId);
  }

  /**
   * Decodifica VIN
   */
  async decodeVIN(vin: string): Promise<VehicleDetails | null> {
    return this.vehicleApi.decodeVIN(vin);
  }

  /**
   * Busca veículos por termo
   */
  searchVehicles(term: string): VehicleSearchResult[] {
    const results = searchVehicles(term);
    return results.map(r => ({
      make: r.make,
      model: r.name,
      type: r.type,
      engine: r.engine,
      displacement: r.displacement,
    }));
  }

  /**
   * Retorna estatísticas da base de dados
   */
  getStats(): {
    totalMakes: number;
    totalModels: number;
    byType: Record<VehicleType, number>;
  } {
    return getDatabaseStats();
  }

  /**
   * Busca modelos de moto de uma marca
   */
  getMotorcycleModels(make: string) {
    return getMotorcycleModels(make);
  }

  /**
   * Busca informações de um modelo específico
   */
  findModel(make: string, model: string) {
    return findModel(make, model);
  }

  /**
   * Limpa cache
   */
  clearCache(): void {
    this.partsApi.clearCache();
    this.vehicleApi.clearCache();
  }
}

// ============================================================================
// INSTÂNCIA SINGLETON
// ============================================================================

export const partsLookupService = new PartsLookupService();

// ============================================================================
// FUNÇÕES DE CONVENIÊNCIA
// ============================================================================

/**
 * Busca rápida de filtro de óleo
 */
export function quickOilFilterSearch(
  make: string,
  model: string,
  year?: number
): PartSearchResult {
  return partsLookupService.searchOilFilter(make, model, year);
}

/**
 * Verifica compatibilidade rápida
 */
export function checkCompatibility(make: string, model: string): boolean {
  return partsLookupService.isVehicleSupported(make, model);
}

/**
 * Lista todas as marcas de motos suportadas
 */
export function getMotorcycleMakes(): string[] {
  return partsLookupService.getSupportedMakes().filter(make => 
    ['Yamaha', 'Honda', 'Kawasaki', 'Suzuki', 'BMW', 'Ducati', 'KTM', 
     'Triumph', 'Harley-Davidson', 'Royal Enfield', 'Husqvarna', 'Indian'].includes(make)
  );
}

// ============================================================================
// EXPORTAÇÃO DEFAULT
// ============================================================================

export default partsLookupService;
