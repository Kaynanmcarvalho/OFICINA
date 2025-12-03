/**
 * TORQ AI - Serviço de APIs de Veículos
 * 
 * Sistema híbrido que busca dados de múltiplas fontes:
 * 1. FIPE API (gratuita) - Dados oficiais de veículos brasileiros
 * 2. NHTSA API (gratuita) - Dados de veículos internacionais
 * 3. Base local verificada - Fallback quando APIs não disponíveis
 * 
 * @author TORQ AI Team
 * @version 2.0.0
 */

// ============================================================================
// TIPOS
// ============================================================================

export interface VehicleMake {
  id: string;
  name: string;
  type: VehicleType;
  country?: string;
}

export interface VehicleModel {
  id: string;
  name: string;
  makeId: string;
  makeName: string;
  type: VehicleType;
  years?: number[];
}

export interface VehicleYear {
  year: number;
  fipeCode?: string;
}

export interface VehicleDetails {
  make: string;
  model: string;
  year?: number;
  type: VehicleType;
  engine?: string;
  displacement?: string;
  fuelType?: string;
  transmission?: string;
  fipeCode?: string;
  fipePrice?: number;
}

export type VehicleType = 
  | 'car'
  | 'motorcycle'
  | 'truck'
  | 'bus'
  | 'van'
  | 'pickup'
  | 'suv'
  | 'tractor'
  | 'agricultural'
  | 'utility';

// ============================================================================
// CACHE INTELIGENTE
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 horas

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn: ttl || this.DEFAULT_TTL,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.expiresIn) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }
}

const apiCache = new ApiCache();

// ============================================================================
// FIPE API - Tabela FIPE Oficial (Gratuita)
// Fonte: https://deividfortuna.github.io/fipe/
// ============================================================================

const FIPE_BASE_URL = 'https://parallelum.com.br/fipe/api/v1';

interface FipeMarca {
  codigo: string;
  nome: string;
}

interface FipeModelo {
  codigo: number;
  nome: string;
}

interface FipeAno {
  codigo: string;
  nome: string;
}

interface FipeVeiculo {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  TipoVeiculo: number;
  SiglaCombustivel: string;
}

type FipeTipoVeiculo = 'carros' | 'motos' | 'caminhoes';

/**
 * Busca marcas na API FIPE
 */
export async function getFipeMakes(tipo: FipeTipoVeiculo): Promise<VehicleMake[]> {
  const cacheKey = `fipe_makes_${tipo}`;
  const cached = apiCache.get<VehicleMake[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`${FIPE_BASE_URL}/${tipo}/marcas`);
    if (!response.ok) throw new Error('FIPE API error');
    
    const data: FipeMarca[] = await response.json();
    
    const vehicleType: VehicleType = 
      tipo === 'carros' ? 'car' : 
      tipo === 'motos' ? 'motorcycle' : 'truck';
    
    const makes: VehicleMake[] = data.map(m => ({
      id: m.codigo,
      name: m.nome,
      type: vehicleType,
      country: 'BR',
    }));
    
    apiCache.set(cacheKey, makes);
    return makes;
  } catch (error) {
    console.warn('FIPE API unavailable, using fallback:', error);
    return getFallbackMakes(tipo === 'carros' ? 'car' : tipo === 'motos' ? 'motorcycle' : 'truck');
  }
}

/**
 * Busca modelos de uma marca na API FIPE
 */
export async function getFipeModels(tipo: FipeTipoVeiculo, marcaId: string): Promise<VehicleModel[]> {
  const cacheKey = `fipe_models_${tipo}_${marcaId}`;
  const cached = apiCache.get<VehicleModel[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`${FIPE_BASE_URL}/${tipo}/marcas/${marcaId}/modelos`);
    if (!response.ok) throw new Error('FIPE API error');
    
    const data: { modelos: FipeModelo[] } = await response.json();
    
    const vehicleType: VehicleType = 
      tipo === 'carros' ? 'car' : 
      tipo === 'motos' ? 'motorcycle' : 'truck';
    
    // Buscar nome da marca
    const makes = await getFipeMakes(tipo);
    const make = makes.find(m => m.id === marcaId);
    
    const models: VehicleModel[] = data.modelos.map(m => ({
      id: m.codigo.toString(),
      name: m.nome,
      makeId: marcaId,
      makeName: make?.name || '',
      type: vehicleType,
    }));
    
    apiCache.set(cacheKey, models);
    return models;
  } catch (error) {
    console.warn('FIPE API unavailable for models:', error);
    return [];
  }
}

/**
 * Busca anos de um modelo na API FIPE
 */
export async function getFipeYears(tipo: FipeTipoVeiculo, marcaId: string, modeloId: string): Promise<VehicleYear[]> {
  const cacheKey = `fipe_years_${tipo}_${marcaId}_${modeloId}`;
  const cached = apiCache.get<VehicleYear[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`${FIPE_BASE_URL}/${tipo}/marcas/${marcaId}/modelos/${modeloId}/anos`);
    if (!response.ok) throw new Error('FIPE API error');
    
    const data: FipeAno[] = await response.json();
    
    const years: VehicleYear[] = data.map(a => ({
      year: parseInt(a.nome.split(' ')[0]) || new Date().getFullYear(),
      fipeCode: a.codigo,
    }));
    
    apiCache.set(cacheKey, years);
    return years;
  } catch (error) {
    console.warn('FIPE API unavailable for years:', error);
    return [];
  }
}

/**
 * Busca detalhes completos de um veículo na API FIPE
 */
export async function getFipeVehicleDetails(
  tipo: FipeTipoVeiculo, 
  marcaId: string, 
  modeloId: string, 
  anoId: string
): Promise<VehicleDetails | null> {
  const cacheKey = `fipe_details_${tipo}_${marcaId}_${modeloId}_${anoId}`;
  const cached = apiCache.get<VehicleDetails>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${FIPE_BASE_URL}/${tipo}/marcas/${marcaId}/modelos/${modeloId}/anos/${anoId}`
    );
    if (!response.ok) throw new Error('FIPE API error');
    
    const data: FipeVeiculo = await response.json();
    
    const vehicleType: VehicleType = 
      tipo === 'carros' ? 'car' : 
      tipo === 'motos' ? 'motorcycle' : 'truck';
    
    const details: VehicleDetails = {
      make: data.Marca,
      model: data.Modelo,
      year: data.AnoModelo,
      type: vehicleType,
      fuelType: data.Combustivel,
      fipeCode: data.CodigoFipe,
      fipePrice: parseFloat(data.Valor.replace('R$ ', '').replace('.', '').replace(',', '.')),
    };
    
    apiCache.set(cacheKey, details);
    return details;
  } catch (error) {
    console.warn('FIPE API unavailable for details:', error);
    return null;
  }
}

// ============================================================================
// NHTSA API - National Highway Traffic Safety Administration (Gratuita)
// Fonte: https://vpic.nhtsa.dot.gov/api/
// ============================================================================

const NHTSA_BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';

interface NHTSAMake {
  Make_ID: number;
  Make_Name: string;
}

interface NHTSAModel {
  Model_ID: number;
  Model_Name: string;
  Make_ID: number;
  Make_Name: string;
}

/**
 * Busca marcas na API NHTSA (veículos internacionais)
 */
export async function getNHTSAMakes(vehicleType?: string): Promise<VehicleMake[]> {
  const cacheKey = `nhtsa_makes_${vehicleType || 'all'}`;
  const cached = apiCache.get<VehicleMake[]>(cacheKey);
  if (cached) return cached;

  try {
    const url = vehicleType 
      ? `${NHTSA_BASE_URL}/GetMakesForVehicleType/${vehicleType}?format=json`
      : `${NHTSA_BASE_URL}/GetAllMakes?format=json`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('NHTSA API error');
    
    const data = await response.json();
    
    const makes: VehicleMake[] = data.Results.map((m: NHTSAMake) => ({
      id: m.Make_ID.toString(),
      name: m.Make_Name,
      type: 'car' as VehicleType,
      country: 'US',
    }));
    
    apiCache.set(cacheKey, makes);
    return makes;
  } catch (error) {
    console.warn('NHTSA API unavailable:', error);
    return [];
  }
}

/**
 * Busca modelos de uma marca na API NHTSA
 */
export async function getNHTSAModels(makeName: string): Promise<VehicleModel[]> {
  const cacheKey = `nhtsa_models_${makeName}`;
  const cached = apiCache.get<VehicleModel[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${NHTSA_BASE_URL}/GetModelsForMake/${encodeURIComponent(makeName)}?format=json`
    );
    if (!response.ok) throw new Error('NHTSA API error');
    
    const data = await response.json();
    
    const models: VehicleModel[] = data.Results.map((m: NHTSAModel) => ({
      id: m.Model_ID.toString(),
      name: m.Model_Name,
      makeId: m.Make_ID.toString(),
      makeName: m.Make_Name,
      type: 'car' as VehicleType,
    }));
    
    apiCache.set(cacheKey, models);
    return models;
  } catch (error) {
    console.warn('NHTSA API unavailable for models:', error);
    return [];
  }
}

/**
 * Decodifica VIN usando NHTSA API
 */
export async function decodeVIN(vin: string): Promise<VehicleDetails | null> {
  const cacheKey = `nhtsa_vin_${vin}`;
  const cached = apiCache.get<VehicleDetails>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${NHTSA_BASE_URL}/DecodeVin/${vin}?format=json`
    );
    if (!response.ok) throw new Error('NHTSA API error');
    
    const data = await response.json();
    const results = data.Results;
    
    const getValue = (variableId: number): string => {
      const item = results.find((r: { VariableId: number }) => r.VariableId === variableId);
      return item?.Value || '';
    };
    
    const details: VehicleDetails = {
      make: getValue(26), // Make
      model: getValue(28), // Model
      year: parseInt(getValue(29)) || undefined, // Model Year
      type: 'car',
      engine: getValue(13), // Engine Model
      displacement: getValue(11), // Displacement (L)
      fuelType: getValue(24), // Fuel Type - Primary
      transmission: getValue(37), // Transmission Style
    };
    
    if (details.make && details.model) {
      apiCache.set(cacheKey, details);
      return details;
    }
    
    return null;
  } catch (error) {
    console.warn('NHTSA VIN decode failed:', error);
    return null;
  }
}

// ============================================================================
// FALLBACK - Base Local Verificada
// ============================================================================

function getFallbackMakes(type: VehicleType): VehicleMake[] {
  const makesByType: Record<VehicleType, string[]> = {
    car: [
      'Audi', 'BMW', 'BYD', 'Chevrolet', 'Citroën', 'Fiat', 'Ford', 'Honda',
      'Hyundai', 'Jeep', 'Kia', 'Mercedes-Benz', 'Mitsubishi', 'Nissan',
      'Peugeot', 'Renault', 'Toyota', 'Volkswagen', 'Volvo',
    ],
    motorcycle: [
      'BMW', 'Dafra', 'Ducati', 'Harley-Davidson', 'Honda', 'Husqvarna',
      'Kawasaki', 'KTM', 'Royal Enfield', 'Suzuki', 'Triumph', 'Yamaha',
    ],
    truck: [
      'DAF', 'Ford', 'Iveco', 'MAN', 'Mercedes-Benz', 'Scania', 'Volkswagen', 'Volvo',
    ],
    bus: [
      'Agrale', 'Iveco', 'MAN', 'Marcopolo', 'Mercedes-Benz', 'Scania', 'Volkswagen', 'Volvo',
    ],
    van: [
      'Citroën', 'Fiat', 'Ford', 'Hyundai', 'Iveco', 'Mercedes-Benz', 'Peugeot', 'Renault', 'Volkswagen',
    ],
    pickup: [
      'Chevrolet', 'Fiat', 'Ford', 'Mitsubishi', 'Nissan', 'RAM', 'Renault', 'Toyota', 'Volkswagen',
    ],
    suv: [
      'Audi', 'BMW', 'Chevrolet', 'Ford', 'Honda', 'Hyundai', 'Jeep', 'Kia',
      'Land Rover', 'Mercedes-Benz', 'Mitsubishi', 'Nissan', 'Toyota', 'Volkswagen', 'Volvo',
    ],
    tractor: [
      'Case IH', 'John Deere', 'Massey Ferguson', 'New Holland', 'Valtra',
    ],
    agricultural: [
      'Case IH', 'CLAAS', 'John Deere', 'Massey Ferguson', 'New Holland',
    ],
  };

  return (makesByType[type] || []).map((name, index) => ({
    id: `fallback_${type}_${index}`,
    name,
    type,
    country: 'BR',
  }));
}

// ============================================================================
// SERVIÇO UNIFICADO
// ============================================================================

export class VehicleApiService {
  /**
   * Busca marcas de veículos (híbrido: API + fallback)
   */
  async getMakes(type: VehicleType): Promise<VehicleMake[]> {
    // Tentar FIPE primeiro para veículos brasileiros
    if (type === 'car' || type === 'suv' || type === 'pickup') {
      const fipeMakes = await getFipeMakes('carros');
      if (fipeMakes.length > 0) return fipeMakes;
    }
    
    if (type === 'motorcycle') {
      const fipeMakes = await getFipeMakes('motos');
      if (fipeMakes.length > 0) return fipeMakes;
    }
    
    if (type === 'truck' || type === 'bus' || type === 'van') {
      const fipeMakes = await getFipeMakes('caminhoes');
      if (fipeMakes.length > 0) return fipeMakes;
    }
    
    // Fallback para base local
    return getFallbackMakes(type);
  }

  /**
   * Busca modelos de uma marca
   */
  async getModels(type: VehicleType, makeId: string, makeName?: string): Promise<VehicleModel[]> {
    // Tentar FIPE
    const fipeType: FipeTipoVeiculo = 
      type === 'motorcycle' ? 'motos' : 
      type === 'truck' || type === 'bus' || type === 'van' ? 'caminhoes' : 'carros';
    
    const fipeModels = await getFipeModels(fipeType, makeId);
    if (fipeModels.length > 0) return fipeModels;
    
    // Tentar NHTSA se tiver nome da marca
    if (makeName) {
      const nhtsaModels = await getNHTSAModels(makeName);
      if (nhtsaModels.length > 0) return nhtsaModels;
    }
    
    return [];
  }

  /**
   * Busca anos disponíveis para um modelo
   */
  async getYears(type: VehicleType, makeId: string, modelId: string): Promise<VehicleYear[]> {
    const fipeType: FipeTipoVeiculo = 
      type === 'motorcycle' ? 'motos' : 
      type === 'truck' || type === 'bus' || type === 'van' ? 'caminhoes' : 'carros';
    
    return getFipeYears(fipeType, makeId, modelId);
  }

  /**
   * Busca detalhes completos de um veículo
   */
  async getVehicleDetails(
    type: VehicleType, 
    makeId: string, 
    modelId: string, 
    yearId: string
  ): Promise<VehicleDetails | null> {
    const fipeType: FipeTipoVeiculo = 
      type === 'motorcycle' ? 'motos' : 
      type === 'truck' || type === 'bus' || type === 'van' ? 'caminhoes' : 'carros';
    
    return getFipeVehicleDetails(fipeType, makeId, modelId, yearId);
  }

  /**
   * Decodifica VIN para obter informações do veículo
   */
  async decodeVIN(vin: string): Promise<VehicleDetails | null> {
    return decodeVIN(vin);
  }

  /**
   * Limpa o cache
   */
  clearCache(): void {
    apiCache.clear();
  }
}

// Instância singleton
export const vehicleApiService = new VehicleApiService();
