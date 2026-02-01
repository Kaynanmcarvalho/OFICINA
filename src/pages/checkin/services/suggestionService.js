import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { getDaysSince } from '../utils/dateHelpers';

// Regras de sugestão
const SUGGESTION_RULES = {
  'Troca de óleo': { daysInterval: 90, priority: 'high' },
  'Revisão': { daysInterval: 180, priority: 'medium' },
  'Alinhamento': { daysInterval: 120, priority: 'medium' },
  'Balanceamento': { daysInterval: 120, priority: 'medium' },
  'Troca de filtro': { daysInterval: 90, priority: 'medium' },
  'Verificação de freios': { daysInterval: 180, priority: 'high' },
  'Troca de pneus': { daysInterval: 365, priority: 'low' },
  'Limpeza de bicos': { daysInterval: 180, priority: 'low' }
};

// Buscar histórico de serviços do veículo
export const getVehicleServiceHistory = async (vehiclePlate, empresaId) => {
  try {
    const checkinsRef = collection(db, 'checkins');
    const q = query(
      checkinsRef,
      where('vehiclePlate', '==', vehiclePlate),
      where('empresaId', '==', empresaId),
      where('status', '==', 'completed'),
      orderBy('createdAt', 'desc'),
      limit(20)

    const snapshot = await getDocs(q);
    const history = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.services && data.services.length > 0) {
        history.push({
          id: doc.id,
          date: data.createdAt,
          services: data.services,
          ...data
        });
      }
    });

    return history;
  } catch (error) {
    console.error('Error fetching service history:', error);
    return [];
  }
};

// Gerar sugestões baseadas no histórico
export const generateSuggestions = async (vehiclePlate, empresaId) => {
  try {
    const history = await getVehicleServiceHistory(vehiclePlate, empresaId);
    
    if (history.length === 0) {
      return [];
    }

    const suggestions = [];
    const serviceMap = new Map();

    // Mapear último serviço de cada tipo
    history.forEach(visit => {
      visit.services.forEach(service => {
        if (!serviceMap.has(service)) {
          serviceMap.set(service, {
            service,
            lastDate: visit.date,
            count: 1
          });
        } else {
          const existing = serviceMap.get(service);
          existing.count++;
        }
      });
    });

    // Verificar regras e gerar sugestões
    Object.entries(SUGGESTION_RULES).forEach(([serviceName, rule]) => {
      const lastService = serviceMap.get(serviceName);
      
      if (lastService) {
        const daysSince = getDaysSince(lastService.lastDate);
        
        if (daysSince >= rule.daysInterval) {
          suggestions.push({
            service: serviceName,
            reason: `Última ${serviceName.toLowerCase()} há ${daysSince} dias`,
            lastDate: lastService.lastDate,
            daysSince,
            priority: rule.priority,
            recommended: true
          });
        } else if (daysSince >= rule.daysInterval * 0.8) {
          // Sugestão preventiva (80% do intervalo)
          suggestions.push({
            service: serviceName,
            reason: `Próximo de ${serviceName.toLowerCase()} (${daysSince} dias)`,
            lastDate: lastService.lastDate,
            daysSince,
            priority: 'low',
            recommended: false
          });
        }
      }
    });

    // Sugestões baseadas em padrões (serviços recorrentes)
    const recurringServices = Array.from(serviceMap.entries())
      .filter(([_, data]) => data.count >= 2)
      .map(([service, data]) => ({
        service,
        count: data.count,
        lastDate: data.lastDate
      }));

    recurringServices.forEach(({ service, lastDate, count }) => {
      const daysSince = getDaysSince(lastDate);
      
      // Se não está nas regras padrão e é recorrente
      if (!SUGGESTION_RULES[service] && daysSince >= 90) {
        suggestions.push({
          service,
          reason: `Serviço recorrente (${count}x) - última vez há ${daysSince} dias`,
          lastDate,
          daysSince,
          priority: 'medium',
          recommended: true
        });
      }
    });

    // Ordenar por prioridade
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    suggestions.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.daysSince - a.daysSince;
    });

    return suggestions;
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return [];
  }
};

// Calcular score de confiança da sugestão
export const calculateSuggestionScore = (suggestion, history) => {
  let score = 0;

  // Pontos por prioridade
  if (suggestion.priority === 'high') score += 30;
  else if (suggestion.priority === 'medium') score += 20;
  else score += 10;

  // Pontos por dias desde último serviço
  if (suggestion.daysSince > 180) score += 30;
  else if (suggestion.daysSince > 90) score += 20;
  else score += 10;

  // Pontos por recorrência
  const serviceCount = history.filter(h => 
    h.services.includes(suggestion.service)
  ).length;
  score += Math.min(serviceCount * 10, 40);

  return Math.min(score, 100);
};

// Filtrar sugestões já ignoradas
export const filterIgnoredSuggestions = (suggestions, ignoredServices = []) => {
  return suggestions.filter(s => !ignoredServices.includes(s.service));
};
