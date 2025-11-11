export const calculateTotalSpent = (visits) => {
  if (!visits || visits.length === 0) return 0;
  return visits.reduce((total, visit) => {
    const value = visit.totalValue || visit.total || 0;
    return total + value;
  }, 0);
};

export const calculateAverageTicket = (visits) => {
  if (!visits || visits.length === 0) return 0;
  const total = calculateTotalSpent(visits);
  return total / visits.length;
};

export const getFrequentServices = (visits) => {
  if (!visits || visits.length === 0) return [];
  
  const serviceCount = {};
  
  visits.forEach(visit => {
    const services = visit.services || [];
    services.forEach(service => {
      if (typeof service === 'string') {
        serviceCount[service] = (serviceCount[service] || 0) + 1;
      }
    });
  });
  
  return Object.entries(serviceCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

export const isVipClient = (visits, totalSpent) => {
  return visits.length >= 5 || totalSpent >= 5000;
};

export const calculateProgress = (currentStage, stages) => {
  const stageOrder = ['checkin', 'diagnostico', 'orcamento', 'execucao', 'finalizacao', 'checkout'];
  const currentIndex = stageOrder.indexOf(currentStage);
  if (currentIndex === -1) return 0;
  return ((currentIndex + 1) / stageOrder.length) * 100;
};
