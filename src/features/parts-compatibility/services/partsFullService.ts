/**
 * Serviço de Compatibilidade Completa de Peças
 * Consome a API /api/parts-full para buscar peças com cross-compatibility
 * 
 * @version 2.0.0
 */

// @ts-ignore - Vite env
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

export interface PartData {
  partNumber: string;
  brand: string;
  name: string;
  category: string;
  avgPrice: number;
  equivalents: string[];
  applications: string[];
  crossCompatible: CrossCompatibleVehicle[];
  cheaperAlternatives: CheaperAlternative[];
  sharedWithCount: number;
  confidence: number;
  matchType: string;
  platform: string;
  categoryKey: string;
}

export interface CrossCompatibleVehicle {
  vehicle: string;
  partNumber: string;
  partName: string;
  brand: string;
  avgPrice: number;
}

export interface CheaperAlternative {
  partNumber: string;
  brand: string;
  name: string;
  avgPrice: number;
  savings: number;
  savingsPercent: string;
}

export interface VehicleCompatibility {
  vehicleId: string;
  vehicleName: string;
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  platform: string;
  totalParts: number;
  partsByCategory: Record<string, PartData[]>;
  compatibleParts: PartData[];
  generatedAt: string;
}

export interface CompatibilityStats {
  totalVehicles: number;
  totalParts: number;
  totalCategories: number;
  totalPlatforms: number;
  avgPartsPerVehicle: string;
  vehiclesWithParts: number;
  vehiclesWithoutParts: number;
}

export interface VehicleSearchResult {
  vehicleId: string;
  vehicleName: string;
  brand: string;
  model: string;
  year: number;
  vehicleType: string;
  platform: string;
  totalParts: number;
}

/**
 * Busca estatísticas gerais do sistema
 */
export async function getStats(): Promise<CompatibilityStats> {
  const response = await fetch(`${API_BASE}/api/parts-full/stats`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Erro ao buscar estatísticas');
  }
  
  return data.data;
}

/**
 * Busca todas as peças compatíveis para um veículo
 */
export async function getVehicleCompatibility(vehicleId: string): Promise<VehicleCompatibility> {
  const response = await fetch(`${API_BASE}/api/parts-full/vehicle/${encodeURIComponent(vehicleId)}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Veículo não encontrado');
  }
  
  return data.data;
}

/**
 * Busca veículos por marca, modelo ou ano
 */
export async function searchVehicles(params: {
  brand?: string;
  model?: string;
  year?: number;
  type?: string;
  limit?: number;
}): Promise<VehicleSearchResult[]> {
  const searchParams = new URLSearchParams();
  
  if (params.brand) searchParams.set('brand', params.brand);
  if (params.model) searchParams.set('model', params.model);
  if (params.year) searchParams.set('year', params.year.toString());
  if (params.type) searchParams.set('type', params.type);
  if (params.limit) searchParams.set('limit', params.limit.toString());
  
  const response = await fetch(`${API_BASE}/api/parts-full/search?${searchParams}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Erro na busca');
  }
  
  return data.data;
}

/**
 * Busca veículos que compartilham uma peça específica
 */
export async function getCrossCompatibility(partNumber: string): Promise<{
  partNumber: string;
  totalVehicles: number;
  byBrand: Record<string, VehicleSearchResult[]>;
  economySuggestion: {
    type: string;
    description: string;
    estimatedSavings: string;
  } | null;
}> {
  const response = await fetch(`${API_BASE}/api/parts-full/cross-compatibility/${encodeURIComponent(partNumber)}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Peça não encontrada');
  }
  
  return data;
}

/**
 * Busca alternativas mais baratas para uma peça
 */
export async function getCheaperAlternatives(vehicleId: string, partNumber: string): Promise<{
  original: {
    partNumber: string;
    brand: string;
    name: string;
    avgPrice: number;
  };
  alternatives: CheaperAlternative[];
  crossCompatible: CrossCompatibleVehicle[];
}> {
  const response = await fetch(
    `${API_BASE}/api/parts-full/cheaper-alternatives/${encodeURIComponent(vehicleId)}/${encodeURIComponent(partNumber)}`
  );
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Erro ao buscar alternativas');
  }
  
  return data;
}

/**
 * Busca peças de uma categoria específica para um veículo
 */
export async function getPartsByCategory(vehicleId: string, category: string): Promise<{
  vehicleId: string;
  vehicleName: string;
  category: string;
  count: number;
  parts: PartData[];
}> {
  const response = await fetch(
    `${API_BASE}/api/parts-full/by-category/${encodeURIComponent(vehicleId)}/${encodeURIComponent(category)}`
  );
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Erro ao buscar peças');
  }
  
  return data;
}

/**
 * Lista todas as plataformas de veículos
 */
export async function getPlatforms(): Promise<{
  data: string[];
  details: Record<string, string[]>;
}> {
  const response = await fetch(`${API_BASE}/api/parts-full/platforms`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Erro ao buscar plataformas');
  }
  
  return data;
}

/**
 * Lista todas as categorias de peças
 */
export async function getCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/api/parts-full/categories`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Erro ao buscar categorias');
  }
  
  return data.data;
}

/**
 * Gera ID de veículo a partir de marca, modelo e ano
 */
export function generateVehicleId(brand: string, model: string, year: number): string {
  return `${brand}_${model}_${year}`.toLowerCase().replace(/\s+/g, '_');
}

/**
 * Formata preço em Real brasileiro
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

/**
 * Calcula economia total possível
 */
export function calculateTotalSavings(parts: PartData[]): {
  totalOriginal: number;
  totalWithAlternatives: number;
  totalSavings: number;
  savingsPercent: number;
} {
  let totalOriginal = 0;
  let totalWithAlternatives = 0;
  
  for (const part of parts) {
    totalOriginal += part.avgPrice || 0;
    
    if (part.cheaperAlternatives && part.cheaperAlternatives.length > 0) {
      // Usa a alternativa mais barata
      const cheapest = part.cheaperAlternatives.reduce((min, alt) => 
        alt.avgPrice < min.avgPrice ? alt : min
      );
      totalWithAlternatives += cheapest.avgPrice;
    } else {
      totalWithAlternatives += part.avgPrice || 0;
    }
  }
  
  const totalSavings = totalOriginal - totalWithAlternatives;
  const savingsPercent = totalOriginal > 0 ? (totalSavings / totalOriginal) * 100 : 0;
  
  return {
    totalOriginal,
    totalWithAlternatives,
    totalSavings,
    savingsPercent,
  };
}

export default {
  getStats,
  getVehicleCompatibility,
  searchVehicles,
  getCrossCompatibility,
  getCheaperAlternatives,
  getPartsByCategory,
  getPlatforms,
  getCategories,
  generateVehicleId,
  formatPrice,
  calculateTotalSavings,
};
