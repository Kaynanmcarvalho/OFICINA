/**
 * TORQ Parts Compatibility - Service
 * Serviço para busca e verificação de compatibilidade de peças
 */

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type {
  Part,
  PartCategory,
  VehicleCompatibility,
  CompatibilitySearchRequest,
  CompatibilitySearchResult,
  PartWithCompatibility,
  VehiclePartsProfile,
  PartUsageRecord,
  PartAlternative,
  PartSuggestion,
} from '../types';

class PartsCompatibilityService {
  private readonly COLLECTION = 'parts';
  private readonly ALTERNATIVES_COLLECTION = 'partAlternatives';
  private readonly USAGE_COLLECTION = 'partUsage';

  /**
   * Busca peças compatíveis com um veículo
   */
  async searchCompatibleParts(
    request: CompatibilitySearchRequest,
    empresaId: string
  ): Promise<CompatibilitySearchResult> {
    try {
      const partsRef = collection(db, this.COLLECTION);
      let q = query(partsRef, where('empresaId', '==', empresaId));

      // Filtro por categoria
      if (request.partCategory) {
        q = query(q, where('category', '==', request.partCategory));
      }

      // Filtro por marca da peça
      if (request.partBrand) {
        q = query(q, where('brand', '==', request.partBrand));
      }

      // Filtro por estoque
      if (request.inStockOnly) {
        q = query(q, where('stockQuantity', '>', 0));
      }

      const snapshot = await getDocs(q);
      let parts: PartWithCompatibility[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const part: Part = {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Part;

        // Calcular compatibilidade se veículo foi especificado
        if (request.vehicleMake && request.vehicleModel && request.vehicleYear) {
          const compatibility = this.calculateCompatibility(
            part,
            request.vehicleMake,
            request.vehicleModel,
            request.vehicleYear,
            request.vehicleEngine
          );

          if (compatibility.score > 0) {
            parts.push({
              ...part,
              compatibilityScore: compatibility.score,
              compatibilityNotes: compatibility.notes,
              isExactMatch: compatibility.isExact,
            });
          }
        } else {
          // Sem filtro de veículo, retorna todas
          parts.push({
            ...part,
            compatibilityScore: 100,
            isExactMatch: true,
          });
        }
      });

      // Filtros adicionais em memória
      if (request.partNumber) {
        const searchTerm = request.partNumber.toLowerCase();
        parts = parts.filter((p) =>
          p.partNumber.toLowerCase().includes(searchTerm)
        );
      }

      if (request.partName) {
        const searchTerm = request.partName.toLowerCase();
        parts = parts.filter((p) =>
          p.name.toLowerCase().includes(searchTerm)
        );
      }

      if (request.priceMin !== undefined) {
        parts = parts.filter((p) => p.price >= request.priceMin!);
      }

      if (request.priceMax !== undefined) {
        parts = parts.filter((p) => p.price <= request.priceMax!);
      }

      // Ordenar por score de compatibilidade
      parts.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      // Gerar sugestões
      const suggestions = this.generateSuggestions(parts, request);

      return {
        parts,
        totalResults: parts.length,
        searchedVehicle: request.vehicleMake
          ? {
              make: request.vehicleMake,
              model: request.vehicleModel || '',
              year: request.vehicleYear || 0,
            }
          : undefined,
        suggestions,
      };
    } catch (error) {
      console.error('Erro ao buscar peças compatíveis:', error);
      throw error;
    }
  }

  /**
   * Calcula score de compatibilidade
   */
  private calculateCompatibility(
    part: Part,
    make: string,
    model: string,
    year: number,
    engine?: string
  ): { score: number; notes?: string; isExact: boolean } {
    if (!part.compatibleVehicles || part.compatibleVehicles.length === 0) {
      return { score: 0, isExact: false };
    }

    let bestMatch = { score: 0, notes: '', isExact: false };

    for (const compat of part.compatibleVehicles) {
      let score = 0;
      let notes: string[] = [];
      let isExact = true;

      // Marca (40 pontos)
      if (compat.make.toLowerCase() === make.toLowerCase()) {
        score += 40;
      } else {
        isExact = false;
        continue; // Marca diferente, pula
      }

      // Modelo (30 pontos)
      if (compat.model.toLowerCase() === model.toLowerCase()) {
        score += 30;
      } else if (compat.model.toLowerCase().includes(model.toLowerCase())) {
        score += 20;
        isExact = false;
        notes.push('Modelo similar');
      } else {
        isExact = false;
        continue;
      }

      // Ano (20 pontos)
      if (year >= compat.yearStart && year <= compat.yearEnd) {
        score += 20;
      } else if (Math.abs(year - compat.yearStart) <= 2 || Math.abs(year - compat.yearEnd) <= 2) {
        score += 10;
        isExact = false;
        notes.push('Ano próximo ao compatível');
      } else {
        isExact = false;
        continue;
      }

      // Motor (10 pontos)
      if (engine && compat.engine) {
        if (compat.engine.toLowerCase() === engine.toLowerCase()) {
          score += 10;
        } else {
          score += 5;
          isExact = false;
          notes.push('Verificar motorização');
        }
      } else {
        score += 10; // Sem especificação de motor
      }

      // Notas adicionais
      if (compat.notes) {
        notes.push(compat.notes);
      }

      if (score > bestMatch.score) {
        bestMatch = {
          score,
          notes: notes.join('. '),
          isExact,
        };
      }
    }

    return bestMatch;
  }

  /**
   * Gera sugestões baseadas na busca
   */
  private generateSuggestions(
    parts: PartWithCompatibility[],
    request: CompatibilitySearchRequest
  ): PartSuggestion[] {
    const suggestions: PartSuggestion[] = [];

    // Sugerir peças com alta compatibilidade
    const highCompatParts = parts.filter(
      (p) => p.compatibilityScore >= 80 && !p.isExactMatch
    );

    for (const part of highCompatParts.slice(0, 3)) {
      suggestions.push({
        partId: part.id,
        partName: part.name,
        reason: `Alta compatibilidade (${part.compatibilityScore}%)`,
        priority: 'medium',
      });
    }

    // Sugerir peças em promoção ou com bom preço
    const affordableParts = parts
      .filter((p) => p.isExactMatch && p.stockQuantity && p.stockQuantity > 0)
      .sort((a, b) => a.price - b.price)
      .slice(0, 2);

    for (const part of affordableParts) {
      if (!suggestions.find((s) => s.partId === part.id)) {
        suggestions.push({
          partId: part.id,
          partName: part.name,
          reason: 'Melhor preço disponível',
          priority: 'high',
        });
      }
    }

    return suggestions;
  }

  /**
   * Busca peça por ID
   */
  async getPartById(partId: string, empresaId: string): Promise<Part | null> {
    try {
      const docRef = doc(db, this.COLLECTION, partId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;

      const data = docSnap.data();
      if (data.empresaId !== empresaId) return null;

      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Part;
    } catch (error) {
      console.error('Erro ao buscar peça:', error);
      throw error;
    }
  }

  /**
   * Busca alternativas para uma peça
   */
  async getPartAlternatives(
    partId: string,
    empresaId: string
  ): Promise<PartAlternative[]> {
    try {
      const altRef = collection(db, this.ALTERNATIVES_COLLECTION);
      const q = query(
        altRef,
        where('originalPartId', '==', partId),
        where('empresaId', '==', empresaId)
      );

      const snapshot = await getDocs(q);
      const alternatives: PartAlternative[] = [];

      snapshot.forEach((docSnap) => {
        alternatives.push(docSnap.data() as PartAlternative);
      });

      return alternatives;
    } catch (error) {
      console.error('Erro ao buscar alternativas:', error);
      throw error;
    }
  }

  /**
   * Obtém perfil de peças de um veículo
   */
  async getVehiclePartsProfile(
    vehicleId: string,
    vehiclePlate: string,
    vehicleInfo: { make: string; model: string; year: number; engine?: string },
    empresaId: string
  ): Promise<VehiclePartsProfile> {
    try {
      // Buscar histórico de uso de peças
      const usageRef = collection(db, this.USAGE_COLLECTION);
      const q = query(
        usageRef,
        where('vehicleId', '==', vehicleId),
        where('empresaId', '==', empresaId),
        orderBy('usedAt', 'desc'),
        limit(50)
      );

      const snapshot = await getDocs(q);
      const partsHistory: PartUsageRecord[] = [];
      const categoryCount: Record<string, number> = {};
      let totalSpent = 0;

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        partsHistory.push({
          ...data,
          usedAt: data.usedAt?.toDate() || new Date(),
        } as PartUsageRecord);

        totalSpent += data.price * data.quantity;
      });

      // Buscar peças compatíveis por categoria
      const compatiblePartsByCategory: Record<PartCategory, number> = {} as any;
      const categories: PartCategory[] = [
        'engine', 'transmission', 'brakes', 'suspension', 'electrical',
        'cooling', 'fuel', 'exhaust', 'body', 'interior', 'filters',
        'oils', 'tires', 'accessories', 'other'
      ];

      for (const category of categories) {
        const result = await this.searchCompatibleParts(
          {
            vehicleMake: vehicleInfo.make,
            vehicleModel: vehicleInfo.model,
            vehicleYear: vehicleInfo.year,
            partCategory: category,
          },
          empresaId
        );
        compatiblePartsByCategory[category] = result.totalResults;
        categoryCount[category] = (categoryCount[category] || 0) + result.totalResults;
      }

      // Determinar categoria mais usada
      const mostUsedCategory = Object.entries(categoryCount)
        .sort(([, a], [, b]) => b - a)[0]?.[0] as PartCategory || 'other';

      // Gerar recomendações
      const recommendedParts = await this.generateRecommendations(
        vehicleInfo,
        partsHistory,
        empresaId
      );

      return {
        vehicleId,
        vehiclePlate,
        vehicleInfo,
        compatiblePartsByCategory,
        recommendedParts,
        partsHistory,
        totalPartsUsed: partsHistory.length,
        totalSpentOnParts: totalSpent,
        mostUsedCategory,
      };
    } catch (error) {
      console.error('Erro ao obter perfil de peças:', error);
      throw error;
    }
  }

  /**
   * Gera recomendações de peças
   */
  private async generateRecommendations(
    vehicleInfo: { make: string; model: string; year: number },
    history: PartUsageRecord[],
    empresaId: string
  ): Promise<PartSuggestion[]> {
    const suggestions: PartSuggestion[] = [];

    // Verificar peças de manutenção preventiva
    const maintenanceParts = ['filters', 'oils'] as PartCategory[];
    
    for (const category of maintenanceParts) {
      const lastUsed = history.find((h) => 
        h.partName.toLowerCase().includes(category === 'filters' ? 'filtro' : 'óleo')
      );

      if (!lastUsed || this.daysSince(lastUsed.usedAt) > 180) {
        const result = await this.searchCompatibleParts(
          {
            vehicleMake: vehicleInfo.make,
            vehicleModel: vehicleInfo.model,
            vehicleYear: vehicleInfo.year,
            partCategory: category,
            inStockOnly: true,
          },
          empresaId
        );

        if (result.parts.length > 0) {
          suggestions.push({
            partId: result.parts[0].id,
            partName: result.parts[0].name,
            reason: lastUsed 
              ? `Última troca há ${this.daysSince(lastUsed.usedAt)} dias`
              : 'Manutenção preventiva recomendada',
            priority: 'high',
          });
        }
      }
    }

    return suggestions.slice(0, 5);
  }

  private daysSince(date: Date): number {
    return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * Registra uso de uma peça
   */
  async recordPartUsage(
    usage: Omit<PartUsageRecord, 'usedAt'> & { vehicleId: string; empresaId: string }
  ): Promise<void> {
    try {
      await addDoc(collection(db, this.USAGE_COLLECTION), {
        ...usage,
        usedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Erro ao registrar uso de peça:', error);
      throw error;
    }
  }

  /**
   * Adiciona nova peça ao catálogo
   */
  async addPart(part: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION), {
        ...part,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar peça:', error);
      throw error;
    }
  }

  /**
   * Atualiza peça existente
   */
  async updatePart(
    partId: string,
    updates: Partial<Part>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, partId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Erro ao atualizar peça:', error);
      throw error;
    }
  }
}

export const partsCompatibilityService = new PartsCompatibilityService();
