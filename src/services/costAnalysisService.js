/**
 * Cost Analysis Service
 * Serviço para análise de custos e margens de lucro
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';

export class CostAnalysisService {
  constructor() {
    this.defaultConfig = {
      minMargin: 20, // 20% margem mínima
      targetMargin: 35, // 35% margem alvo
      defaultMarkup: 1.5, // 50% markup padrão
      categoryMarkups: {
        pecas: 1.4, // 40% markup peças
        servicos: 1.6, // 60% markup serviços
        maoDeObra: 1.8 // 80% markup mão de obra
      },
      indirectCosts: {
        monthly: 5000, // R$ 5000/mês custos fixos
        perHour: 25 // R$ 25/hora overhead
      }
    };
  }

  /**
   * Calcula custo de um item
   */
  calculateItemCost(item) {
    const cost = item.costPrice || item.cost || 0;
    const quantity = item.quantity || 1;
    return cost * quantity;
  }

  /**
   * Calcula margem de um item
   */
  calculateItemMargin(item) {
    const cost = this.calculateItemCost(item);
    const price = (item.price || 0) * (item.quantity || 1);
    
    if (price === 0) return 0;
    
    const margin = ((price - cost) / price) * 100;
    return Math.round(margin * 100) / 100;
  }

  /**
   * Calcula markup de um item
   */
  calculateItemMarkup(item) {
    const cost = this.calculateItemCost(item);
    const price = (item.price || 0) * (item.quantity || 1);
    
    if (cost === 0) return 0;
    
    const markup = (price / cost);
    return Math.round(markup * 100) / 100;
  }

  /**
   * Calcula custo total de múltiplos itens
   */
  calculateTotalCost(items) {
    if (!items || items.length === 0) return 0;
    
    return items.reduce((total, item) => {
      return total + this.calculateItemCost(item);
    }, 0);
  }

  /**
   * Calcula preço total de múltiplos itens
   */
  calculateTotalPrice(items) {
    if (!items || items.length === 0) return 0;
    
    return items.reduce((total, item) => {
      return total + ((item.price || 0) * (item.quantity || 1));
    }, 0);
  }

  /**
   * Calcula margem total
   */
  calculateTotalMargin(items) {
    const totalCost = this.calculateTotalCost(items);
    const totalPrice = this.calculateTotalPrice(items);
    
    if (totalPrice === 0) return 0;
    
    const margin = ((totalPrice - totalCost) / totalPrice) * 100;
    return Math.round(margin * 100) / 100;
  }

  /**
   * Calcula margem média
   */
  calculateAverageMargin(items) {
    if (!items || items.length === 0) return 0;
    
    const margins = items.map(item => this.calculateItemMargin(item));
    const sum = margins.reduce((a, b) => a + b, 0);
    return Math.round((sum / margins.length) * 100) / 100;
  }

  /**
   * Calcula ponto de equilíbrio
   */
  calculateBreakEven(costs, margin) {
    if (margin === 0 || margin === 100) return 0;
    
    const breakEven = costs / (1 - (margin / 100));
    return Math.round(breakEven * 100) / 100;
  }

  /**
   * Valida se margem está adequada
   */
  validateMargin(margin, minMargin = null) {
    const min = minMargin || this.defaultConfig.minMargin;
    
    return {
      isValid: margin >= min,
      status: margin >= min ? 'good' : 'low',
      color: margin >= min ? 'green' : 'red',
      message: margin >= min 
        ? `Margem adequada (${margin}%)` 
        : `Margem baixa (${margin}% < ${min}%)`
    };
  }

  /**
   * Sugere preço baseado em custo e margem alvo
   */
  suggestPrice(cost, targetMargin = null) {
    const margin = targetMargin || this.defaultConfig.targetMargin;
    
    if (margin >= 100) return cost;
    
    const price = cost / (1 - (margin / 100));
    return Math.round(price * 100) / 100;
  }

  /**
   * Aplica markup ao custo
   */
  applyMarkup(cost, markup = null) {
    const m = markup || this.defaultConfig.defaultMarkup;
    return Math.round(cost * m * 100) / 100;
  }

  /**
   * Analisa orçamento completo
   */
  async analyzeBudget(budgetData, empresaId) {
    try {
      const config = await this.getMarginConfig(empresaId);
      const items = budgetData.items || [];

      // Análise por item
      const itemsAnalysis = items.map(item => ({
        itemId: item.id,
        description: item.description,
        type: item.type || 'peca',
        cost: this.calculateItemCost(item),
        price: (item.price || 0) * (item.quantity || 1),
        quantity: item.quantity || 1,
        margin: this.calculateItemMargin(item),
        markup: this.calculateItemMarkup(item),
        validation: this.validateMargin(
          this.calculateItemMargin(item), 
          config.minMargin
        )
      }));

      // Totais
      const totalCost = this.calculateTotalCost(items);
      const totalPrice = this.calculateTotalPrice(items);
      const totalMargin = this.calculateTotalMargin(items);
      const averageMargin = this.calculateAverageMargin(items);

      // Custos indiretos (estimativa baseada em tempo)
      const estimatedHours = this.estimateServiceHours(items);
      const indirectCosts = estimatedHours * config.indirectCosts.perHour;

      // Lucro
      const profitAmount = totalPrice - totalCost - indirectCosts;
      const profitMargin = totalPrice > 0 
        ? ((profitAmount / totalPrice) * 100) 
        : 0;

      // Ponto de equilíbrio
      const breakEven = this.calculateBreakEven(
        totalCost + indirectCosts, 
        config.targetMargin
      );

      const analysis = {
        budgetId: budgetData.id,
        empresaId,
        items: itemsAnalysis,
        totals: {
          cost: Math.round(totalCost * 100) / 100,
          price: Math.round(totalPrice * 100) / 100,
          margin: totalMargin,
          averageMargin: averageMargin,
          indirectCosts: Math.round(indirectCosts * 100) / 100,
          profitAmount: Math.round(profitAmount * 100) / 100,
          profitMargin: Math.round(profitMargin * 100) / 100,
          breakEven: Math.round(breakEven * 100) / 100
        },
        validation: this.validateMargin(totalMargin, config.minMargin),
        recommendations: this.generateRecommendations(
          itemsAnalysis, 
          totalMargin, 
          config
        ),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      // Salvar análise no Firestore
      if (budgetData.id) {
        await this.saveAnalysis(analysis);
      }

      return analysis;
    } catch (error) {
      console.error('Error analyzing budget:', error);
      throw error;
    }
  }

  /**
   * Estima horas de serviço
   */
  estimateServiceHours(items) {
    // Estimativa simples: 1h por serviço, 0.5h por peça
    return items.reduce((hours, item) => {
      if (item.type === 'servico' || item.type === 'maoDeObra') {
        return hours + 1;
      }
      return hours + 0.5;
    }, 0);
  }

  /**
   * Gera recomendações
   */
  generateRecommendations(itemsAnalysis, totalMargin, config) {
    const recommendations = [];

    // Margem total baixa
    if (totalMargin < config.minMargin) {
      recommendations.push({
        type: 'warning',
        priority: 'high',
        title: 'Margem Total Baixa',
        message: `Margem atual (${totalMargin}%) está abaixo do mínimo (${config.minMargin}%)`,
        action: 'Revisar preços ou custos'
      });
    }

    // Itens com margem baixa
    const lowMarginItems = itemsAnalysis.filter(
      item => item.margin < config.minMargin
    );
    
    if (lowMarginItems.length > 0) {
      recommendations.push({
        type: 'warning',
        priority: 'medium',
        title: `${lowMarginItems.length} Item(ns) com Margem Baixa`,
        message: 'Alguns itens estão com margem abaixo do mínimo',
        action: 'Ajustar preços individuais',
        items: lowMarginItems.map(i => i.description)
      });
    }

    // Margem excelente
    if (totalMargin >= config.targetMargin * 1.2) {
      recommendations.push({
        type: 'success',
        priority: 'low',
        title: 'Margem Excelente',
        message: `Margem atual (${totalMargin}%) está acima da meta`,
        action: 'Manter estratégia de precificação'
      });
    }

    return recommendations;
  }

  /**
   * Salva análise no Firestore
   */
  async saveAnalysis(analysis) {
    try {
      const analysisRef = doc(
        db, 
        'costAnalysis', 
        `${analysis.budgetId}_${Date.now()}`
      );
      
      await setDoc(analysisRef, analysis);
      return analysisRef.id;
    } catch (error) {
      console.error('Error saving analysis:', error);
      throw error;
    }
  }

  /**
   * Busca configuração de margens
   */
  async getMarginConfig(empresaId) {
    try {
      const configRef = doc(db, 'marginConfig', empresaId);
      const configSnap = await getDoc(configRef);

      if (configSnap.exists()) {
        return { ...this.defaultConfig, ...configSnap.data() };
      }

      // Criar configuração padrão
      await setDoc(configRef, {
        ...this.defaultConfig,
        empresaId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      return this.defaultConfig;
    } catch (error) {
      console.error('Error getting margin config:', error);
      return this.defaultConfig;
    }
  }

  /**
   * Atualiza configuração de margens
   */
  async updateMarginConfig(empresaId, config) {
    try {
      const configRef = doc(db, 'marginConfig', empresaId);
      
      await setDoc(configRef, {
        ...config,
        empresaId,
        updatedAt: Timestamp.now()
      }, { merge: true });

      return true;
    } catch (error) {
      console.error('Error updating margin config:', error);
      throw error;
    }
  }

  /**
   * Busca análises por período
   */
  async getAnalysisByPeriod(empresaId, startDate, endDate) {
    try {
      const analysisRef = collection(db, 'costAnalysis');
      const q = query(
        analysisRef,
        where('empresaId', '==', empresaId),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(endDate)),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting analysis by period:', error);
      return [];
    }
  }

  /**
   * Calcula estatísticas de margem
   */
  async calculateMarginStats(empresaId, days = 30) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const analyses = await this.getAnalysisByPeriod(
        empresaId, 
        startDate, 
        endDate
      );

      if (analyses.length === 0) {
        return {
          averageMargin: 0,
          totalProfit: 0,
          totalRevenue: 0,
          count: 0
        };
      }

      const totalMargin = analyses.reduce(
        (sum, a) => sum + (a.totals?.margin || 0), 
        0
      );
      
      const totalProfit = analyses.reduce(
        (sum, a) => sum + (a.totals?.profitAmount || 0), 
        0
      );
      
      const totalRevenue = analyses.reduce(
        (sum, a) => sum + (a.totals?.price || 0), 
        0
      );

      return {
        averageMargin: Math.round((totalMargin / analyses.length) * 100) / 100,
        totalProfit: Math.round(totalProfit * 100) / 100,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        count: analyses.length
      };
    } catch (error) {
      console.error('Error calculating margin stats:', error);
      return {
        averageMargin: 0,
        totalProfit: 0,
        totalRevenue: 0,
        count: 0
      };
    }
  }
}

export default new CostAnalysisService();
