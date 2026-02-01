/**
 * TORQ Service Suggestion Service
 * Serviço para sugestão automática de serviços
 */

import type {
  ServiceSuggestion,
  SuggestionRequest,
  SuggestionResult,
  SuggestionSummary,
  SuggestedPart,
  ServiceCategory,
  SuggestionPriority,
  SuggestionSource,
} from '../types';
import {
  DTC_SERVICE_MAPPINGS,
  DAMAGE_SERVICE_MAPPINGS,
  MILEAGE_SERVICES,
  SERVICE_BASE_PRICES,
} from '../data/dtcMappings';

class ServiceSuggestionService {
  /**
   * Gera sugestões de serviços baseadas em múltiplas fontes
   */
  async generateSuggestions(request: SuggestionRequest): Promise<SuggestionResult> {
    const suggestions: ServiceSuggestion[] = [];

    // 1. Sugestões baseadas em códigos OBD
    if (request.obdCodes && request.obdCodes.length > 0) {
      const obdSuggestions = this.generateFromOBDCodes(request.obdCodes);
      suggestions.push(...obdSuggestions);
    }

    // 2. Sugestões baseadas em danos detectados
    if (request.detectedDamages && request.detectedDamages.length > 0) {
      const damageSuggestions = this.generateFromDamages(request.detectedDamages);
      suggestions.push(...damageSuggestions);
    }

    // 3. Sugestões baseadas em quilometragem
    if (request.vehicleInfo.mileage) {
      const mileageSuggestions = this.generateFromMileage(
        request.vehicleInfo.mileage,
        request.vehicleInfo.lastServiceDate

      suggestions.push(...mileageSuggestions);
    }

    // 4. Sugestões baseadas em reclamações do cliente
    if (request.customerComplaints && request.customerComplaints.length > 0) {
      const complaintSuggestions = this.generateFromComplaints(request.customerComplaints);
      suggestions.push(...complaintSuggestions);
    }

    // Remover duplicatas e ordenar por prioridade
    const uniqueSuggestions = this.deduplicateSuggestions(suggestions);
    const sortedSuggestions = this.sortByPriority(uniqueSuggestions);

    // Gerar resumo
    const summary = this.generateSummary(sortedSuggestions);

    return {
      id: `suggestion-${Date.now()}`,
      generatedAt: new Date(),
      vehicleInfo: request.vehicleInfo,
      suggestions: sortedSuggestions,
      summary,
      aiInsights: this.generateAIInsights(sortedSuggestions, request),
    };
  }

  /**
   * Gera sugestões a partir de códigos OBD
   */
  private generateFromOBDCodes(codes: string[]): ServiceSuggestion[] {
    const suggestions: ServiceSuggestion[] = [];

    for (const code of codes) {
      for (const mapping of DTC_SERVICE_MAPPINGS) {
        const regex = new RegExp(mapping.dtcPattern, 'i');
        if (regex.test(code)) {
          for (const serviceName of mapping.services) {
            const basePrice = SERVICE_BASE_PRICES[serviceName] || { labor: 100, time: 60 };
            const parts = this.generatePartsForService(mapping.parts);
            const partsTotal = parts.reduce((sum, p) => sum + p.totalPrice, 0);

            suggestions.push({
              id: `sug-${code}-${serviceName.replace(/\s/g, '-')}`,
              name: serviceName,
              description: mapping.description,
              category: this.getCategoryFromCode(code),
              priority: mapping.priority,
              source: 'obd_scan',
              confidence: 85,
              estimatedTime: basePrice.time,
              estimatedCost: {
                labor: basePrice.labor,
                parts: partsTotal,
                total: basePrice.labor + partsTotal,
                currency: 'BRL',
              },
              relatedParts: parts,
              relatedDTCs: [code],
            });
          }
          break; // Encontrou mapeamento, não precisa continuar
        }
      }
    }

    return suggestions;
  }

  /**
   * Gera sugestões a partir de danos detectados
   */
  private generateFromDamages(damages: SuggestionRequest['detectedDamages']): ServiceSuggestion[] {
    const suggestions: ServiceSuggestion[] = [];

    for (const damage of damages || []) {
      const mapping = DAMAGE_SERVICE_MAPPINGS[damage.type];
      if (mapping) {
        // Ajustar prioridade baseado na severidade
        let priority = mapping.priority;
        if (damage.severity === 'severe') {
          priority = 'urgent';
        } else if (damage.severity === 'moderate' && priority === 'low') {
          priority = 'medium';
        }

        for (const serviceName of mapping.services) {
          const basePrice = SERVICE_BASE_PRICES[serviceName] || { labor: 150, time: 90 };
          const parts = this.generatePartsForService(mapping.parts);
          const partsTotal = parts.reduce((sum, p) => sum + p.totalPrice, 0);

          // Multiplicador baseado na severidade
          const severityMultiplier = damage.severity === 'severe' ? 1.5 : damage.severity === 'moderate' ? 1.2 : 1;

          suggestions.push({
            id: `sug-damage-${damage.type}-${serviceName.replace(/\s/g, '-')}`,
            name: serviceName,
            description: `Reparo de ${damage.type}${damage.location ? ` - ${damage.location}` : ''}`,
            category: mapping.category,
            priority,
            source: 'damage_detection',
            confidence: 90,
            estimatedTime: Math.round(basePrice.time * severityMultiplier),
            estimatedCost: {
              labor: Math.round(basePrice.labor * severityMultiplier),
              parts: Math.round(partsTotal * severityMultiplier),
              total: Math.round((basePrice.labor + partsTotal) * severityMultiplier),
              currency: 'BRL',
            },
            relatedParts: parts,
            relatedDamages: [damage.type],
          });
        }
      }
    }

    return suggestions;
  }

  /**
   * Gera sugestões baseadas em quilometragem
   */
  private generateFromMileage(mileage: number, lastServiceDate?: Date): ServiceSuggestion[] {
    const suggestions: ServiceSuggestion[] = [];

    for (const service of MILEAGE_SERVICES) {
      // Verificar se está próximo do intervalo de manutenção
      const remainder = mileage % service.mileageInterval;
      const threshold = service.mileageInterval * 0.1; // 10% antes

      if (remainder >= service.mileageInterval - threshold || remainder < threshold) {
        for (const serviceName of service.services) {
          const basePrice = SERVICE_BASE_PRICES[serviceName] || { labor: 100, time: 60 };
          const parts = this.generatePartsForService(service.parts);
          const partsTotal = parts.reduce((sum, p) => sum + p.totalPrice, 0);

          suggestions.push({
            id: `sug-mileage-${service.mileageInterval}-${serviceName.replace(/\s/g, '-')}`,
            name: serviceName,
            description: `Manutenção preventiva - ${service.mileageInterval.toLocaleString()} km`,
            category: service.category,
            priority: service.priority,
            source: 'mileage',
            confidence: 75,
            estimatedTime: basePrice.time,
            estimatedCost: {
              labor: basePrice.labor,
              parts: partsTotal,
              total: basePrice.labor + partsTotal,
              currency: 'BRL',
            },
            relatedParts: parts,
            notes: `Recomendado a cada ${service.mileageInterval.toLocaleString()} km`,
          });
        }
      }
    }

    return suggestions;
  }

  /**
   * Gera sugestões baseadas em reclamações do cliente
   */
  private generateFromComplaints(complaints: string[]): ServiceSuggestion[] {
    const suggestions: ServiceSuggestion[] = [];

    // Mapeamento simples de palavras-chave para serviços
    const complaintMappings: Record<string, { services: string[]; category: ServiceCategory; priority: SuggestionPriority }> = {
      'barulho': { services: ['Diagnóstico de ruídos', 'Verificação de suspensão'], category: 'suspension', priority: 'medium' },
      'freio': { services: ['Verificação de freios', 'Troca de pastilhas'], category: 'brakes', priority: 'high' },
      'aquecimento': { services: ['Verificação do sistema de arrefecimento'], category: 'cooling', priority: 'urgent' },
      'fumaça': { services: ['Diagnóstico de motor', 'Verificação de emissões'], category: 'engine', priority: 'urgent' },
      'vibração': { services: ['Balanceamento', 'Alinhamento', 'Verificação de suspensão'], category: 'suspension', priority: 'medium' },
      'partida': { services: ['Verificação de bateria', 'Diagnóstico de partida'], category: 'electrical', priority: 'high' },
      'luz': { services: ['Diagnóstico de painel', 'Verificação de sensores'], category: 'diagnostic', priority: 'medium' },
    };

    for (const complaint of complaints) {
      const lowerComplaint = complaint.toLowerCase();
      
      for (const [keyword, mapping] of Object.entries(complaintMappings)) {
        if (lowerComplaint.includes(keyword)) {
          for (const serviceName of mapping.services) {
            const basePrice = SERVICE_BASE_PRICES[serviceName] || { labor: 100, time: 60 };

            suggestions.push({
              id: `sug-complaint-${keyword}-${serviceName.replace(/\s/g, '-')}`,
              name: serviceName,
              description: `Baseado na reclamação: "${complaint}"`,
              category: mapping.category,
              priority: mapping.priority,
              source: 'customer_request',
              confidence: 70,
              estimatedTime: basePrice.time,
              estimatedCost: {
                labor: basePrice.labor,
                parts: 0,
                total: basePrice.labor,
                currency: 'BRL',
              },
              relatedParts: [],
              notes: `Reclamação do cliente: ${complaint}`,
            });
          }
        }
      }
    }

    return suggestions;
  }

  /**
   * Gera peças sugeridas para um serviço
   */
  private generatePartsForService(partNames: string[]): SuggestedPart[] {
    // Preços base de peças (simplificado)
    const partPrices: Record<string, number> = {
      'Filtro de ar': 45,
      'Filtro de óleo': 35,
      'Óleo do motor': 120,
      'Velas de ignição': 25,
      'Sensor MAF': 350,
      'Sensor de oxigênio': 280,
      'Catalisador': 1500,
      'Termostato': 80,
      'Correia dentada': 150,
      'Tensor': 120,
      'Pastilhas de freio': 180,
      'Pneu novo': 450,
      'Tinta automotiva': 200,
      'Massa plástica': 50,
    };

    return partNames.map((name, index) => ({
      id: `part-${index}-${name.replace(/\s/g, '-')}`,
      name,
      quantity: 1,
      unitPrice: partPrices[name] || 100,
      totalPrice: partPrices[name] || 100,
      availability: 'in_stock' as const,
    }));
  }

  /**
   * Determina a categoria baseada no código DTC
   */
  private getCategoryFromCode(code: string): ServiceCategory {
    const prefix = code.charAt(0).toUpperCase();
    const system = code.substring(1, 3);

    switch (prefix) {
      case 'P':
        if (system.startsWith('0') || system.startsWith('1')) return 'fuel';
        if (system.startsWith('2')) return 'fuel';
        if (system.startsWith('3')) return 'engine';
        if (system.startsWith('4')) return 'exhaust';
        if (system.startsWith('5')) return 'engine';
        if (system.startsWith('6')) return 'engine';
        if (system.startsWith('7')) return 'transmission';
        return 'engine';
      case 'B':
        return 'body';
      case 'C':
        return 'brakes';
      case 'U':
        return 'electrical';
      default:
        return 'other';
    }
  }

  /**
   * Remove sugestões duplicadas
   */
  private deduplicateSuggestions(suggestions: ServiceSuggestion[]): ServiceSuggestion[] {
    const seen = new Map<string, ServiceSuggestion>();

    for (const suggestion of suggestions) {
      const key = suggestion.name.toLowerCase();
      const existing = seen.get(key);

      if (!existing || this.getPriorityValue(suggestion.priority) > this.getPriorityValue(existing.priority)) {
        seen.set(key, suggestion);
      }
    }

    return Array.from(seen.values());
  }

  /**
   * Ordena sugestões por prioridade
   */
  private sortByPriority(suggestions: ServiceSuggestion[]): ServiceSuggestion[] {
    return suggestions.sort((a, b) => {
      const priorityDiff = this.getPriorityValue(b.priority) - this.getPriorityValue(a.priority);
      if (priorityDiff !== 0) return priorityDiff;
      return b.confidence - a.confidence;
    });
  }

  private getPriorityValue(priority: SuggestionPriority): number {
    const values: Record<SuggestionPriority, number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
    };
    return values[priority];
  }

  /**
   * Gera resumo das sugestões
   */
  private generateSummary(suggestions: ServiceSuggestion[]): SuggestionSummary {
    const byPriority: Record<SuggestionPriority, number> = { urgent: 0, high: 0, medium: 0, low: 0 };
    const byCategory: Record<ServiceCategory, number> = {} as Record<ServiceCategory, number>;
    let totalCost = 0;
    let totalTime = 0;
    const urgentIssues: string[] = [];

    for (const suggestion of suggestions) {
      byPriority[suggestion.priority]++;
      byCategory[suggestion.category] = (byCategory[suggestion.category] || 0) + 1;
      totalCost += suggestion.estimatedCost.total;
      totalTime += suggestion.estimatedTime;

      if (suggestion.priority === 'urgent') {
        urgentIssues.push(suggestion.name);
      }
    }

    return {
      totalSuggestions: suggestions.length,
      byPriority,
      byCategory,
      totalEstimatedCost: totalCost,
      totalEstimatedTime: totalTime,
      urgentIssues,
    };
  }

  /**
   * Gera insights de IA
   */
  private generateAIInsights(suggestions: ServiceSuggestion[], request: SuggestionRequest): string[] {
    const insights: string[] = [];

    // Insight sobre urgência
    const urgentCount = suggestions.filter(s => s.priority === 'urgent').length;
    if (urgentCount > 0) {
      insights.push(`⚠️ ${urgentCount} serviço(s) urgente(s) identificado(s) que requerem atenção imediata.`);
    }

    // Insight sobre manutenção preventiva
    const mileageSuggestions = suggestions.filter(s => s.source === 'mileage');
    if (mileageSuggestions.length > 0) {
      insights.push(`🔧 ${mileageSuggestions.length} serviço(s) de manutenção preventiva recomendado(s) baseado na quilometragem.`);
    }

    // Insight sobre economia
    const totalCost = suggestions.reduce((sum, s) => sum + s.estimatedCost.total, 0);
    if (totalCost > 1000) {
      insights.push(`💡 Considere agendar os serviços em etapas para melhor gestão do orçamento.`);
    }

    // Insight sobre códigos OBD
    const obdSuggestions = suggestions.filter(s => s.source === 'obd_scan');
    if (obdSuggestions.length > 0) {
      insights.push(`🔍 ${obdSuggestions.length} problema(s) detectado(s) pelo scanner OBD-II.`);
    }

    return insights;
  }
}

export const serviceSuggestionService = new ServiceSuggestionService();
export default serviceSuggestionService;
