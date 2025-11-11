import { useState, useEffect } from 'react';
import { getVehicleHistory, calculateVehicleStats } from '../services/vehicleService';

export const useVehicleHistory = (plate, empresaId = null) => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!plate) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const visits = await getVehicleHistory(plate, empresaId);
        setHistory(visits);
        
        const calculatedStats = calculateVehicleStats(visits);
        setStats(calculatedStats);
      } catch (err) {
        console.error('Erro ao carregar histórico:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [plate, empresaId]);

  return {
    history,
    stats,
    loading,
    error
  };
};
