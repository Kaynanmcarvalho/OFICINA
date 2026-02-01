import { create } from 'zustand';
import { useCheckinStore } from './checkinStore';
import { useClientStore } from './clientStore';
import useCaixaStore from './caixaStore';
import { useInventoryStore } from './inventoryStore';
import { useBudgetStore } from './budgetStore';

export const useReportsStore = create((set, get) => ({
  // State
  isLoading: false,
  error: null,
  cachedData: {},
  lastUpdate: null,

  // ========== VALIDAÇÕES E INTEGRIDADE ==========

  // Validar consistência dos dados entre módulos
  validateDataIntegrity: () => {
    const issues = [];
    
    try {
      const checkins = useCheckinStore.getState().checkins;
      const caixaMovements = useCaixaStore.getState().movements || [];
      const budgets = useBudgetStore.getState().budgets || [];
      
      // 1. Verificar se receitas no check-in batem com entradas no caixa
      const completedCheckins = checkins.filter(c => c.status === 'completed' && c.serviceValue);
      const totalCheckinRevenue = completedCheckins.reduce((sum, c) => sum + (parseFloat(c.serviceValue) || 0), 0);
      
      const caixaEntradas = caixaMovements
        .filter(m => m.type === 'entrada' && m.category === 'servico')
        .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
      
      const revenueDiff = Math.abs(totalCheckinRevenue - caixaEntradas);
      if (revenueDiff > 100) { // Tolerância de R$ 100
        issues.push({
          type: 'revenue_mismatch',
          severity: 'high',
          message: `Divergência de R$ ${revenueDiff.toFixed(2)} entre check-ins e caixa`,
          checkinTotal: totalCheckinRevenue,
          caixaTotal: caixaEntradas,
          difference: revenueDiff
        });
      }
      
      // 2. Verificar se orçamentos aprovados viraram check-ins
      const approvedBudgets = budgets.filter(b => b.status === 'approved');
      const budgetsWithoutCheckin = approvedBudgets.filter(b =>
        !checkins.some(c => c.budgetId === b.firestoreId)
      );
      
      if (budgetsWithoutCheckin.length > 0) {
        issues.push({
          type: 'missing_checkins',
          severity: 'medium',
          message: `${budgetsWithoutCheckin.length} orçamentos aprovados sem check-in`,
          count: budgetsWithoutCheckin.length
        });
      }
      
      return {
        isValid: issues.length === 0,
        issues,
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      return {
        isValid: false,
        issues: [{
          type: 'validation_error',
          severity: 'critical',
          message: error.message
        }]
      };
    }
  },

  // ========== CÁLCULOS FINANCEIROS REAIS ==========

  // Calcular receita REAL (do caixa, não do check-in)
  calculateRealRevenue: (startDate, endDate) => {
    try {
      const caixaMovements = useCaixaStore.getState().movements || [];
      
      const entradas = caixaMovements.filter(m => {
        if (m.type !== 'entrada') return false;
        const date = new Date(m.date || m.createdAt);
        return date >= startDate && date <= endDate;
      });
      
      const total = entradas.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
      
      // Separar por categoria
      const byCategory = {};
      entradas.forEach(m => {
        const cat = m.category || 'outros';
        byCategory[cat] = (byCategory[cat] || 0) + (parseFloat(m.amount) || 0);
      });
      
      return {
        total,
        byCategory,
        count: entradas.length,
        source: 'caixa', // Fonte confiável
        dataQuality: 'high'
      };
    } catch (error) {
      console.error('Erro ao calcular receita real:', error);
      return {
        total: 0,
        byCategory: {},
        count: 0,
        source: 'error',
        dataQuality: 'none',
        error: error.message
      };
    }
  },

  // Calcular custos REAIS (do estoque, não chutado)
  calculateRealCosts: (startDate, endDate) => {
    try {
      const parts = useInventoryStore.getState().parts || [];
      
      // Pegar movimentações de saída do estoque
      let totalCost = 0;
      let itemsUsed = 0;
      const byType = {};
      
      parts.forEach(part => {
        const movements = part.stockMovements || [];
        const outMovements = movements.filter(m => {
          if (m.type !== 'out' && m.type !== 'sale') return false;
          const date = new Date(m.date);
          return date >= startDate && date <= endDate;
        });
        
        outMovements.forEach(m => {
          const cost = (m.quantity || 0) * (m.unitCost || part.averageCost || 0);
          totalCost += cost;
          itemsUsed += m.quantity || 0;
          
          const type = part.type || 'outros';
          byType[type] = (byType[type] || 0) + cost;
        });
      });
      
      return {
        total: totalCost,
        byType,
        itemsUsed,
        source: 'inventory', // Fonte confiável
        dataQuality: totalCost > 0 ? 'high' : 'low'
      };
    } catch (error) {
      console.error('Erro ao calcular custos reais:', error);
      return {
        total: 0,
        byType: {},
        itemsUsed: 0,
        source: 'error',
        dataQuality: 'none',
        error: error.message
      };
    }
  },

  // Calcular despesas REAIS (do caixa, não chutado)
  calculateRealExpenses: (startDate, endDate) => {
    try {
      const caixaMovements = useCaixaStore.getState().movements || [];
      
      const saidas = caixaMovements.filter(m => {
        if (m.type !== 'saida') return false;
        const date = new Date(m.date || m.createdAt);
        return date >= startDate && date <= endDate;
      });
      
      const total = saidas.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
      
      // Separar por categoria
      const byCategory = {};
      saidas.forEach(m => {
        const cat = m.category || 'outros';
        byCategory[cat] = (byCategory[cat] || 0) + (parseFloat(m.amount) || 0);
      });
      
      return {
        total,
        byCategory,
        count: saidas.length,
        source: 'caixa', // Fonte confiável
        dataQuality: 'high'
      };
    } catch (error) {
      console.error('Erro ao calcular despesas reais:', error);
      return {
        total: 0,
        byCategory: {},
        count: 0,
        source: 'error',
        dataQuality: 'none',
        error: error.message
      };
    }
  },

  // Calcular lucro REAL (receita - custos - despesas)
  calculateRealProfit: (startDate, endDate) => {
    const revenue = get().calculateRealRevenue(startDate, endDate);
    const costs = get().calculateRealCosts(startDate, endDate);
    const expenses = get().calculateRealExpenses(startDate, endDate);
    
    const profit = revenue.total - costs.total - expenses.total;
    const margin = revenue.total > 0 ? (profit / revenue.total) * 100 : 0;
    
    // Avaliar qualidade dos dados
    const dataQuality = 
      revenue.dataQuality === 'high' && 
      costs.dataQuality === 'high' && 
      expenses.dataQuality === 'high' 
        ? 'high' 
        : revenue.dataQuality === 'none' || costs.dataQuality === 'none' || expenses.dataQuality === 'none'
          ? 'none'
          : 'medium';
    
    return {
      profit,
      margin,
      revenue: revenue.total,
      costs: costs.total,
      expenses: expenses.total,
      dataQuality,
      breakdown: {
        revenue,
        costs,
        expenses
      },
      warnings: [
        ...(revenue.dataQuality !== 'high' ? ['Receita pode estar incompleta'] : []),
        ...(costs.dataQuality !== 'high' ? ['Custos podem estar incompletos (verificar estoque)'] : []),
        ...(expenses.dataQuality !== 'high' ? ['Despesas podem estar incompletas'] : [])
      ]
    };
  },

  // ========== ANÁLISES AVANÇADAS ==========

  // Análise de margem por serviço
  analyzeMarginByService: (startDate, endDate) => {
    try {
      const checkins = useCheckinStore.getState().checkins;
      const budgets = useBudgetStore.getState().budgets || [];
      
      const serviceMargins = {};
      
      checkins
        .filter(c => {
          if (c.status !== 'completed') return false;
          const date = new Date(c.createdAt);
          return date >= startDate && date <= endDate;
        })
        .forEach(checkin => {
          const serviceType = checkin.serviceType || 'Não especificado';
          const revenue = parseFloat(checkin.serviceValue) || 0;
          
          // Tentar encontrar orçamento relacionado para pegar custos
          const budget = budgets.find(b => b.firestoreId === checkin.budgetId);
          const costs = budget ? (budget.totalCost || 0) : 0;
          const profit = revenue - costs;
          
          if (!serviceMargins[serviceType]) {
            serviceMargins[serviceType] = {
              count: 0,
              totalRevenue: 0,
              totalCosts: 0,
              totalProfit: 0,
              avgMargin: 0
            };
          }
          
          serviceMargins[serviceType].count++;
          serviceMargins[serviceType].totalRevenue += revenue;
          serviceMargins[serviceType].totalCosts += costs;
          serviceMargins[serviceType].totalProfit += profit;
        });
      
      // Calcular margem média
      Object.keys(serviceMargins).forEach(service => {
        const data = serviceMargins[service];
        data.avgMargin = data.totalRevenue > 0 
          ? (data.totalProfit / data.totalRevenue) * 100 
          : 0;
      });
      
      // Ordenar por margem (maior para menor)
      const sorted = Object.entries(serviceMargins)
        .map(([service, data]) => ({ service, ...data }))
        .sort((a, b) => b.avgMargin - a.avgMargin);
      
      return {
        byService: serviceMargins,
        sorted,
        bestMargin: sorted[0] || null,
        worstMargin: sorted[sorted.length - 1] || null,
        dataQuality: budgets.length > 0 ? 'high' : 'low'
      };
    } catch (error) {
      console.error('Erro ao analisar margem por serviço:', error);
      return {
        byService: {},
        sorted: [],
        bestMargin: null,
        worstMargin: null,
        dataQuality: 'none',
        error: error.message
      };
    }
  },

  // Análise de clientes mais rentáveis
  analyzeTopClients: (startDate, endDate, limit = 10) => {
    try {
      const checkins = useCheckinStore.getState().checkins;
      const clients = useClientStore.getState().clients;
      
      const clientData = {};
      
      checkins
        .filter(c => {
          if (c.status !== 'completed') return false;
          const date = new Date(c.createdAt);
          return date >= startDate && date <= endDate;
        })
        .forEach(checkin => {
          const clientId = checkin.clientId || checkin.clientName || 'Não identificado';
          const revenue = parseFloat(checkin.serviceValue) || 0;
          
          if (!clientData[clientId]) {
            const client = clients.find(c => c.firestoreId === clientId);
            clientData[clientId] = {
              clientId,
              clientName: client?.name || checkin.clientName || 'Não identificado',
              count: 0,
              totalRevenue: 0,
              avgTicket: 0
            };
          }
          
          clientData[clientId].count++;
          clientData[clientId].totalRevenue += revenue;
        });
      
      // Calcular ticket médio
      Object.values(clientData).forEach(data => {
        data.avgTicket = data.count > 0 ? data.totalRevenue / data.count : 0;
      });
      
      // Ordenar por receita total
      const sorted = Object.values(clientData)
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, limit);
      
      return {
        topClients: sorted,
        totalClients: Object.keys(clientData).length,
        dataQuality: 'high'
      };
    } catch (error) {
      console.error('Erro ao analisar top clientes:', error);
      return {
        topClients: [],
        totalClients: 0,
        dataQuality: 'none',
        error: error.message
      };
    }
  },

  // ========== ALERTAS AUTOMÁTICOS ==========

  // Gerar alertas baseados em dados reais
  generateAlerts: (startDate, endDate) => {
    const alerts = [];
    
    try {
      // 1. Alerta de margem baixa
      const profit = get().calculateRealProfit(startDate, endDate);
      if (profit.dataQuality === 'high' && profit.margin < 20) {
        alerts.push({
          type: 'low_margin',
          severity: profit.margin < 10 ? 'critical' : 'high',
          title: 'Margem de Lucro Baixa',
          message: `Margem atual: ${profit.margin.toFixed(1)}% (mínimo recomendado: 20%)`,
          value: profit.margin,
          threshold: 20,
          action: 'Revisar custos e preços dos serviços'
        });
      }
      
      // 2. Alerta de qualidade de dados
      if (profit.dataQuality !== 'high') {
        alerts.push({
          type: 'data_quality',
          severity: 'medium',
          title: 'Dados Incompletos',
          message: profit.warnings.join('; '),
          action: 'Verificar lançamentos no caixa e estoque'
        });
      }
      
      // 3. Alerta de divergência entre módulos
      const integrity = get().validateDataIntegrity();
      if (!integrity.isValid) {
        integrity.issues.forEach(issue => {
          alerts.push({
            type: issue.type,
            severity: issue.severity,
            title: 'Divergência de Dados',
            message: issue.message,
            action: 'Verificar lançamentos e corrigir inconsistências'
          });
        });
      }
      
      // 4. Alerta de serviços com margem negativa
      const marginAnalysis = get().analyzeMarginByService(startDate, endDate);
      if (marginAnalysis.worstMargin && marginAnalysis.worstMargin.avgMargin < 0) {
        alerts.push({
          type: 'negative_margin',
          severity: 'high',
          title: 'Serviço com Prejuízo',
          message: `"${marginAnalysis.worstMargin.service}" tem margem de ${marginAnalysis.worstMargin.avgMargin.toFixed(1)}%`,
          value: marginAnalysis.worstMargin.avgMargin,
          action: 'Aumentar preço ou parar de oferecer este serviço'
        });
      }
      
      return {
        alerts,
        count: alerts.length,
        critical: alerts.filter(a => a.severity === 'critical').length,
        high: alerts.filter(a => a.severity === 'high').length,
        medium: alerts.filter(a => a.severity === 'medium').length
      };
    } catch (error) {
      console.error('Erro ao gerar alertas:', error);
      return {
        alerts: [{
          type: 'system_error',
          severity: 'critical',
          title: 'Erro ao Gerar Alertas',
          message: error.message
        }],
        count: 1,
        critical: 1,
        high: 0,
        medium: 0
      };
    }
  },

  // ========== CACHE E PERFORMANCE ==========

  // Limpar cache
  clearCache: () => {
    set({ cachedData: {}, lastUpdate: null });
  },

  // Atualizar timestamp
  updateTimestamp: () => {
    set({ lastUpdate: new Date().toISOString() });
  }
}));
