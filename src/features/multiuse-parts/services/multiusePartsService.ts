/**
 * TORQ Multiuse Parts - Service
 * Serviço para análise de peças multiuso
 */

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type {
  MultiusePart,
  MultiuseAnalysis,
  MultiuseRank,
  PartCategory,
  CategoryAnalysis,
  MultiuseRecommendation,
  PartSubstitute,
  MultiuseSearchRequest,
  VehicleCompatibility,
  PartUsageStats,
} from '../types';
import { MULTIUSE_SCORE_THRESHOLDS } from '../types';

class MultiusePartsService {
  private readonly PARTS_COLLECTION = 'parts';
  private readonly ANALYSIS_COLLECTION = 'multiuseAnalysis';
  private readonly USAGE_COLLECTION = 'partUsage';

  /**
   * Analisa todas as peças e gera relatório de multiuso
   */
  async analyzeMultiuseParts(empresaId: string): Promise<MultiuseAnalysis> {
    try {
      // Buscar todas as peças
      const partsRef = collection(db, this.PARTS_COLLECTION);
      const q = query(partsRef, where('empresaId', '==', empresaId));
      const snapshot = await getDocs(q);

      const multiuseParts: MultiusePart[] = [];
      const byRank: Record<MultiuseRank, number> = {
        universal: 0,
        high: 0,
        medium: 0,
        low: 0,
        specific: 0,
      };
      const byCategory: Record<PartCategory, CategoryAnalysis> = {} as any;

      // Analisar cada peça
      for (const docSnap of snapshot.docs) {
        const partData = docSnap.data();
        const multiusePart = await this.analyzePartMultiuse(
          docSnap.id,
          partData,
          empresaId
        );

        multiuseParts.push(multiusePart);
        byRank[multiusePart.multiuseRank]++;

        // Agregar por categoria
        const cat = multiusePart.category;
        if (!byCategory[cat]) {
          byCategory[cat] = {
            category: cat,
            totalParts: 0,
            multiuseParts: 0,
            multiusePercentage: 0,
            averageScore: 0,
          };
        }
        byCategory[cat].totalParts++;
        if (multiusePart.multiuseScore >= MULTIUSE_SCORE_THRESHOLDS.medium) {
          byCategory[cat].multiuseParts++;
        }
      }

      // Calcular médias e percentuais por categoria
      Object.keys(byCategory).forEach((cat) => {
        const category = byCategory[cat as PartCategory];
        const categoryParts = multiuseParts.filter((p) => p.category === cat);
        
        category.multiusePercentage = category.totalParts > 0
          ? (category.multiuseParts / category.totalParts) * 100
          : 0;
        
        category.averageScore = categoryParts.length > 0
          ? categoryParts.reduce((sum, p) => sum + p.multiuseScore, 0) / categoryParts.length
          : 0;

        // Top peça da categoria
        const topPart = categoryParts.sort((a, b) => b.multiuseScore - a.multiuseScore)[0];
        if (topPart) {
          category.topPart = {
            id: topPart.id,
            name: topPart.name,
            score: topPart.multiuseScore,
          };
        }
      });

      // Top peças multiuso
      const topMultiuseParts = multiuseParts
        .sort((a, b) => b.multiuseScore - a.multiuseScore)
        .slice(0, 10);

      // Gerar recomendações
      const recommendations = this.generateRecommendations(multiuseParts, byCategory);

      // Calcular economia potencial
      const potentialSavings = this.calculatePotentialSavings(multiuseParts);
      const stockOptimizationPotential = this.calculateStockOptimization(multiuseParts);

      const analysis: MultiuseAnalysis = {
        empresaId,
        analyzedAt: new Date(),
        totalParts: multiuseParts.length,
        multiuseParts: byRank.universal + byRank.high + byRank.medium,
        multiusePercentage: multiuseParts.length > 0
          ? ((byRank.universal + byRank.high + byRank.medium) / multiuseParts.length) * 100
          : 0,
        byRank,
        byCategory,
        topMultiuseParts,
        recommendations,
        potentialSavings,
        stockOptimizationPotential,
      };

      // Salvar análise
      await this.saveAnalysis(analysis);

      return analysis;
    } catch (error) {
      console.error('Erro ao analisar peças multiuso:', error);
      throw error;
    }
  }

  /**
   * Analisa uma peça específica
   */
  private async analyzePartMultiuse(
    partId: string,
    partData: any,
    empresaId: string
  ): Promise<MultiusePart> {
    const compatibleVehicles: VehicleCompatibility[] = partData.compatibleVehicles || [];
    
    // Calcular estatísticas de uso
    const usageStats = await this.getPartUsageStats(partId, empresaId);
    
    // Calcular score de multiuso
    const multiuseScore = this.calculateMultiuseScore(compatibleVehicles, usageStats);
    const multiuseRank = this.getRankFromScore(multiuseScore);

    // Contar modelos e anos únicos
    const uniqueModels = new Set(compatibleVehicles.map((v) => `${v.make}-${v.model}`));
    const totalYears = compatibleVehicles.reduce(
      (sum, v) => sum + (v.yearEnd - v.yearStart + 1),
      0
    );

    return {
      id: partId,
      partId,
      partNumber: partData.partNumber || '',
      name: partData.name || '',
      brand: partData.brand || '',
      category: partData.category || 'other',
      compatibleVehicles,
      totalCompatibleModels: uniqueModels.size,
      totalCompatibleYears: totalYears,
      usageStats,
      pricing: {
        unitPrice: partData.price || 0,
        costPrice: partData.costPrice || 0,
        margin: (partData.price || 0) - (partData.costPrice || 0),
        marginPercent: partData.costPrice > 0
          ? (((partData.price || 0) - partData.costPrice) / partData.costPrice) * 100
          : 0,
        pricePosition: 'average',
        revenueGenerated: usageStats.totalUsed * (partData.price || 0),
        profitGenerated: usageStats.totalUsed * ((partData.price || 0) - (partData.costPrice || 0)),
      },
      multiuseScore,
      multiuseRank,
      empresaId,
      lastAnalyzed: new Date(),
    };
  }

  /**
   * Busca estatísticas de uso de uma peça
   */
  private async getPartUsageStats(
    partId: string,
    empresaId: string
  ): Promise<PartUsageStats> {
    try {
      const usageRef = collection(db, this.USAGE_COLLECTION);
      const q = query(
        usageRef,
        where('partId', '==', partId),
        where('empresaId', '==', empresaId)
      );

      const snapshot = await getDocs(q);
      
      const usageByMake: Record<string, number> = {};
      const usageByModel: Record<string, number> = {};
      const vehiclesUsed = new Set<string>();
      let totalUsed = 0;
      let firstUsed: Date | undefined;
      let lastUsed: Date | undefined;

      snapshot.forEach((doc) => {
        const data = doc.data();
        totalUsed += data.quantity || 1;
        
        if (data.vehicleMake) {
          usageByMake[data.vehicleMake] = (usageByMake[data.vehicleMake] || 0) + 1;
        }
        if (data.vehicleModel) {
          usageByModel[data.vehicleModel] = (usageByModel[data.vehicleModel] || 0) + 1;
        }
        if (data.vehicleId) {
          vehiclesUsed.add(data.vehicleId);
        }

        const usedAt = data.usedAt?.toDate();
        if (usedAt) {
          if (!firstUsed || usedAt < firstUsed) firstUsed = usedAt;
          if (!lastUsed || usedAt > lastUsed) lastUsed = usedAt;
        }
      });

      // Calcular média mensal
      let averageMonthlyUsage = 0;
      if (firstUsed && lastUsed) {
        const months = Math.max(1, 
          (lastUsed.getTime() - firstUsed.getTime()) / (1000 * 60 * 60 * 24 * 30)
        );

        averageMonthlyUsage = totalUsed / months;
      }

      return {
        totalUsed,
        usedInServices: snapshot.size,
        usedInDifferentVehicles: vehiclesUsed.size,
        averageMonthlyUsage,
        usageByMake,
        usageByModel,
        usageTrend: 'stable',
        firstUsed,
        lastUsed,
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas de uso:', error);
      return {
        totalUsed: 0,
        usedInServices: 0,
        usedInDifferentVehicles: 0,
        averageMonthlyUsage: 0,
        usageByMake: {},
        usageByModel: {},
        usageTrend: 'stable',
      };
    }
  }

  /**
   * Calcula score de multiuso
   */
  private calculateMultiuseScore(
    compatibleVehicles: VehicleCompatibility[],
    usageStats: PartUsageStats
  ): number {
    let score = 0;

    // Pontos por quantidade de veículos compatíveis (max 40)
    const uniqueMakes = new Set(compatibleVehicles.map((v) => v.make));
    const uniqueModels = new Set(compatibleVehicles.map((v) => `${v.make}-${v.model}`));
    
    score += Math.min(20, uniqueMakes.size * 4);
    score += Math.min(20, uniqueModels.size * 2);

    // Pontos por range de anos (max 20)
    const totalYearsCovered = compatibleVehicles.reduce(
      (sum, v) => sum + (v.yearEnd - v.yearStart + 1),
      0
    );

    score += Math.min(20, totalYearsCovered);

    // Pontos por uso real em diferentes veículos (max 20)
    score += Math.min(20, usageStats.usedInDifferentVehicles * 2);

    // Pontos por frequência de uso (max 20)
    score += Math.min(20, usageStats.averageMonthlyUsage * 4);

    return Math.min(100, Math.round(score));
  }

  /**
   * Obtém rank a partir do score
   */
  private getRankFromScore(score: number): MultiuseRank {
    if (score >= MULTIUSE_SCORE_THRESHOLDS.universal) return 'universal';
    if (score >= MULTIUSE_SCORE_THRESHOLDS.high) return 'high';
    if (score >= MULTIUSE_SCORE_THRESHOLDS.medium) return 'medium';
    if (score >= MULTIUSE_SCORE_THRESHOLDS.low) return 'low';
    return 'specific';
  }

  /**
   * Gera recomendações
   */
  private generateRecommendations(
    parts: MultiusePart[],
    byCategory: Record<PartCategory, CategoryAnalysis>
  ): MultiuseRecommendation[] {
    const recommendations: MultiuseRecommendation[] = [];

    // Peças universais com baixo estoque
    const universalLowStock = parts.filter(
      (p) => p.multiuseRank === 'universal' && p.usageStats.totalUsed > 10
    );

    if (universalLowStock.length > 0) {
      recommendations.push({
        id: 'rec-1',
        type: 'increase_stock',
        title: 'Aumentar Estoque de Peças Universais',
        description: `${universalLowStock.length} peças universais têm alta demanda. Considere aumentar o estoque.`,
        impact: 'high',
        relatedParts: universalLowStock.slice(0, 5).map((p) => p.id),
      });
    }

    // Categorias com baixa versatilidade
    Object.entries(byCategory).forEach(([cat, analysis]) => {
      if (analysis.multiusePercentage < 30 && analysis.totalParts > 5) {
        recommendations.push({
          id: `rec-cat-${cat}`,
          type: 'substitute_part',
          title: `Otimizar Categoria: ${cat}`,
          description: `Apenas ${analysis.multiusePercentage.toFixed(0)}% das peças de ${cat} são multiuso. Considere substituir por peças mais versáteis.`,
          impact: 'medium',
        });
      }
    });

    // Peças específicas com alto custo
    const expensiveSpecific = parts.filter(
      (p) => p.multiuseRank === 'specific' && p.pricing.unitPrice > 200
    );

    if (expensiveSpecific.length > 0) {
      recommendations.push({
        id: 'rec-expensive',
        type: 'stock_consolidation',
        title: 'Consolidar Peças Específicas Caras',
        description: `${expensiveSpecific.length} peças específicas têm alto valor. Avalie alternativas multiuso.`,
        impact: 'medium',
        potentialSavings: expensiveSpecific.reduce((sum, p) => sum + p.pricing.unitPrice * 0.2, 0),
      });
    }

    return recommendations;
  }

  /**
   * Calcula economia potencial
   */
  private calculatePotentialSavings(parts: MultiusePart[]): number {
    // Estimar economia de 15% ao consolidar estoque com peças multiuso
    const specificParts = parts.filter((p) => p.multiuseRank === 'specific');
    return specificParts.reduce((sum, p) => sum + p.pricing.unitPrice * 0.15, 0);
  }

  /**
   * Calcula potencial de otimização de estoque
   */
  private calculateStockOptimization(parts: MultiusePart[]): number {
    // Estimar redução de 20% no estoque ao usar mais peças multiuso
    const lowVersatility = parts.filter(
      (p) => p.multiuseRank === 'low' || p.multiuseRank === 'specific'
    );

    return lowVersatility.length * 0.2;
  }

  /**
   * Salva análise
   */
  private async saveAnalysis(analysis: MultiuseAnalysis): Promise<void> {
    const docRef = doc(db, this.ANALYSIS_COLLECTION, analysis.empresaId);
    await setDoc(docRef, {
      ...analysis,
      analyzedAt: Timestamp.now(),
    });
  }

  /**
   * Busca peças multiuso com filtros
   */
  async searchMultiuseParts(
    request: MultiuseSearchRequest,
    empresaId: string
  ): Promise<MultiusePart[]> {
    const analysis = await this.getLatestAnalysis(empresaId);
    if (!analysis) return [];

    let results = analysis.topMultiuseParts;

    // Aplicar filtros
    if (request.category) {
      results = results.filter((p) => p.category === request.category);
    }
    if (request.minScore !== undefined) {
      results = results.filter((p) => p.multiuseScore >= request.minScore!);
    }
    if (request.rank) {
      results = results.filter((p) => p.multiuseRank === request.rank);
    }

    // Ordenar
    if (request.sortBy) {
      results.sort((a, b) => {
        let comparison = 0;
        switch (request.sortBy) {
          case 'score':
            comparison = b.multiuseScore - a.multiuseScore;
            break;
          case 'usage':
            comparison = b.usageStats.totalUsed - a.usageStats.totalUsed;
            break;
          case 'profit':
            comparison = b.pricing.profitGenerated - a.pricing.profitGenerated;
            break;
          case 'compatibility':
            comparison = b.totalCompatibleModels - a.totalCompatibleModels;
            break;
        }
        return request.sortOrder === 'asc' ? -comparison : comparison;
      });
    }

    // Paginação
    if (request.offset) {
      results = results.slice(request.offset);
    }
    if (request.limit) {
      results = results.slice(0, request.limit);
    }

    return results;
  }

  /**
   * Busca última análise
   */
  async getLatestAnalysis(empresaId: string): Promise<MultiuseAnalysis | null> {
    try {
      const docRef = doc(db, this.ANALYSIS_COLLECTION, empresaId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;

      const data = docSnap.data();
      return {
        ...data,
        analyzedAt: data.analyzedAt?.toDate() || new Date(),
      } as MultiuseAnalysis;
    } catch (error) {
      console.error('Erro ao buscar análise:', error);
      return null;
    }
  }

  /**
   * Busca substitutos para uma peça
   */
  async findSubstitutes(
    partId: string,
    empresaId: string
  ): Promise<PartSubstitute[]> {
    // Implementação simplificada - em produção, usaria algoritmo mais sofisticado
    const analysis = await this.getLatestAnalysis(empresaId);
    if (!analysis) return [];

    const originalPart = analysis.topMultiuseParts.find((p) => p.id === partId);
    if (!originalPart) return [];

    // Buscar peças da mesma categoria com score maior
    const substitutes = analysis.topMultiuseParts
      .filter(
        (p) =>
          p.id !== partId &&
          p.category === originalPart.category &&
          p.multiuseScore > originalPart.multiuseScore
      )
      .slice(0, 5)
      .map((p) => ({
        originalPartId: partId,
        originalPartNumber: originalPart.partNumber,
        substitutePartId: p.id,
        substitutePartNumber: p.partNumber,
        compatibilityLevel: 'equivalent' as const,
        additionalVehicles: p.totalCompatibleModels - originalPart.totalCompatibleModels,
        priceDifference: p.pricing.unitPrice - originalPart.pricing.unitPrice,
        stockSavings: 0,
        verified: false,
      }));

    return substitutes;
  }
}

export const multiusePartsService = new MultiusePartsService();
