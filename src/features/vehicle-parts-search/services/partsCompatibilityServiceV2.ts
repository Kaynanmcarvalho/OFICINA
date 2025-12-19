/**
 * SERVIÇO DE COMPATIBILIDADE DE PEÇAS V2
 * Cliente para a API de compatibilidade de peças
 * 
 * @version 2.0.0
 */

// @ts-ignore - Vite env
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

export interface Vehicle {
  brand: string;
  model: string;
  year?: number;
  engine?: string;
  vehicleType?: 'car' | 'motorcycle' | 'truck';
  displacement?: string;
  fuel?: string;
  trim?: string;
}

export interface CompatiblePart {
  partTypeId: string;
  partTypeName: string;
  category: string;
  priority: string;
  partNumber: string;
  brand: string;
  oem?: string;
  specs?: Record<string, any>;
  equivalents: string[];
  matchType: string;
  confidence: number;
  evidence: string;
  requiresValidation?: boolean;
  alternativeMatches?: Array<{
    partNumber: string;
    brand: string;
    confidence: number;
  }>;
}

export interface SharedPart {
  partNumber: string;
  partName: string;
  brand: string;
  sharedWith: Array<{ brand: string; model: string }>;
  totalShared: number;
  economySuggestion?: {
    type: string;
    savings: string;
    description: string;
  };
}

export interface CrossReference {
  original: string;
  brand: string;
  equivalents: string[];
  partType: string;
}

export interface CompatibilityResult {
  vehicleId: string;
  vehicleName: string;
  vehicleType: string;
  vehicleInfo: Record<string, any>;
  generatedAt: string;
  compatibleParts: CompatiblePart[];
  missingParts: Array<{
    partTypeId: string;
    partTypeName: string;
    category: string;
    priority: string;
    reason: string;
  }>;
  sharedParts: SharedPart[];
  crossReferences: CrossReference[];
  coverage: number;
  confidence: number;
  totalPartsFound: number;
  totalEquivalents: number;
}

export interface PartLookupResult {
  found: boolean;
  partNumber: string;
  brand?: string;
  oem?: string;
  category?: string;
  specs?: Record<string, any>;
  applications?: string[];
  equivalents?: string[];
  matchedBy?: string;
}

export interface EquivalentsResult {
  found: boolean;
  original: {
    partNumber: string;
    brand: string;
    oem?: string;
    specs?: Record<string, any>;
  };
  equivalents: Array<{
    partNumber: string;
    found: boolean;
    brand?: string;
    specs?: Record<string, any>;
    reverseMatch?: boolean;
  }>;
  totalEquivalents: number;
}

export interface SearchResult {
  partNumber: string;
  brand: string;
  category: string;
  oem?: string;
  specs?: Record<string, any>;
  applications?: string[];
  equivalents?: string[];
  matchedIn: string;
  matchedApp?: string;
  matchedEq?: string;
}

export interface DatabaseStats {
  totalParts: number;
  totalEquivalents: number;
  totalApplications: number;
  totalBrands: number;
  categories: Record<string, {
    parts: number;
    equivalents: number;
    applications: number;
  }>;
  brands: string[];
  version: string;
  lastUpdated: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  vehicleTypes: string[];
}

export interface Brand {
  name: string;
  country: string;
  categories: string[];
  premium: boolean;
}

class PartsCompatibilityServiceV2 {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/v2/parts`;
  }

  /**
   * Gera compatibilidade de peças para um veículo
   */
  async generateCompatibility(vehicle: Vehicle): Promise<CompatibilityResult> {
    const response = await fetch(`${this.baseUrl}/compatibility`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicle }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao gerar compatibilidade');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Busca peças por termo
   */
  async searchParts(query: string, options?: {
    category?: string;
    brand?: string;
    limit?: number;
  }): Promise<SearchResult[]> {
    const params = new URLSearchParams({ q: query });
    if (options?.category) params.append('category', options.category);
    if (options?.brand) params.append('brand', options.brand);
    if (options?.limit) params.append('limit', options.limit.toString());

    const response = await fetch(`${this.baseUrl}/search?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro na busca');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Busca peça por part number
   */
  async lookupPart(partNumber: string): Promise<PartLookupResult> {
    const response = await fetch(`${this.baseUrl}/lookup/${encodeURIComponent(partNumber)}`);

    if (!response.ok) {
      if (response.status === 404) {
        return { found: false, partNumber };
      }
      const error = await response.json();
      throw new Error(error.error || 'Erro ao buscar peça');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Busca equivalentes de uma peça
   */
  async findEquivalents(partNumber: string): Promise<EquivalentsResult> {
    const response = await fetch(`${this.baseUrl}/equivalents/${encodeURIComponent(partNumber)}`);

    if (!response.ok) {
      if (response.status === 404) {
        return { 
          found: false, 
          original: { partNumber, brand: '' },
          equivalents: [],
          totalEquivalents: 0,
        };
      }
      const error = await response.json();
      throw new Error(error.error || 'Erro ao buscar equivalentes');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Obtém estatísticas do banco de dados
   */
  async getStats(): Promise<DatabaseStats> {
    const response = await fetch(`${this.baseUrl}/stats`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao obter estatísticas');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Lista categorias disponíveis
   */
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${this.baseUrl}/categories`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao listar categorias');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Lista marcas disponíveis
   */
  async getBrands(): Promise<Brand[]> {
    const response = await fetch(`${this.baseUrl}/brands`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao listar marcas');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Gera compatibilidade para múltiplos veículos
   */
  async batchCompatibility(vehicles: Vehicle[]): Promise<Array<{
    vehicle: string;
    success: boolean;
    data?: CompatibilityResult;
    error?: string;
  }>> {
    const response = await fetch(`${this.baseUrl}/batch-compatibility`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicles }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro no batch');
    }

    const result = await response.json();
    return result.data;
  }
}

// Instância singleton
export const partsCompatibilityService = new PartsCompatibilityServiceV2();

export default partsCompatibilityService;
