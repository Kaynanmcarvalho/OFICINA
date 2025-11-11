import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { calculateTotalSpent, calculateAverageTicket, getFrequentServices, isVipClient } from '../utils/calculationHelpers';
import { getDaysSince } from '../utils/dateHelpers';

export const getVehicleHistory = async (plate, empresaId) => {
  if (!plate) {
    throw new Error('Placa é obrigatória');
  }

  try {
    const checkinQuery = query(
      collection(db, 'checkins'),
      where('vehiclePlate', '==', plate),
      ...(empresaId ? [where('empresaId', '==', empresaId)] : []),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const snapshot = await getDocs(checkinQuery);
    const visits = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return visits;
  } catch (error) {
    console.error('Erro ao buscar histórico do veículo:', error);
    throw error;
  }
};

export const calculateVehicleStats = (visits) => {
  if (!visits || visits.length === 0) {
    return {
      totalVisits: 0,
      totalSpent: 0,
      averageTicket: 0,
      daysSinceLastVisit: null,
      frequentServices: [],
      isVip: false,
      lastVisit: null
    };
  }

  const totalSpent = calculateTotalSpent(visits);
  const averageTicket = calculateAverageTicket(visits);
  const frequentServices = getFrequentServices(visits);
  const isVip = isVipClient(visits, totalSpent);
  
  const lastVisit = visits[0];
  const daysSinceLastVisit = lastVisit?.createdAt 
    ? getDaysSince(lastVisit.createdAt)
    : null;

  return {
    totalVisits: visits.length,
    totalSpent,
    averageTicket,
    daysSinceLastVisit,
    frequentServices,
    isVip,
    lastVisit: lastVisit ? {
      date: lastVisit.createdAt,
      services: lastVisit.services || [],
      total: lastVisit.totalValue || lastVisit.total || 0
    } : null
  };
};
