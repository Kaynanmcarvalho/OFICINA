import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * InsightsDashboard Component
 * 
 * Mini dashboard com insights e métricas analíticas
 * Mostra tempo médio, receita, produtividade e veículo mais recorrente
 * 
 * @param {Array} checkins - Array de check-ins
 * @param {Number} daysRange - Período de análise em dias (padrão: 30)
 */
const InsightsDashboard = ({ checkins = [], daysRange = 30 }) => {
  /**
   * Calcula todas as métricas
   */
  const metrics = useMemo(() => {
    if (!checkins || checkins.length === 0) {
      return {
        avgServiceTime: 0,
        avgRevenue: 0,
        topMechanic: null,
        topVehicle: null,
        totalServices: 0
      };
    }

    // Filtrar por período
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysRange);
    
    const recentCheckins = checkins.filter(c => {
      const date = new Date(c.createdAt || c.date);
      return date >= cutoffDate && c.status === 'completed';
    });

    // Tempo médio de serviço
    const totalTime = recentCheckins.reduce((sum, c) => sum + (c.duration || 0), 0);
    const avgServiceTime = recentCheckins.length > 0 
      ? totalTime / recentCheckins.length 
      : 0;

    // Receita média
    const totalRevenue = recentCheckins.reduce((sum, c) => sum + (c.revenue || 0), 0);
    const avgRevenue = recentCheckins.length > 0 
      ? totalRevenue / recentCheckins.length 
      : 0;

    // Mecânico mais produtivo
    const mechanicStats = {};
    recentCheckins.forEach(c => {
      if (c.mechanic) {
        if (!mechanicStats[c.mechanic]) {
          mechanicStats[c.mechanic] = { count: 0, totalTime: 0 };
        }
        mechanicStats[c.mechanic].count++;
        mechanicStats[c.mechanic].totalTime += c.duration || 0;
      }
    });

    const topMechanic = Object.entries(mechanicStats)
      .sort((a, b) => b[1].count - a[1].count)[0];

    // Veículo mais recorrente
    const vehicleCounts = {};
    recentCheckins.forEach(c => {
      const key = c.vehiclePlate || c.vehicleId;
      if (key) {
        vehicleCounts[key] = (vehicleCounts[key] || 0) + 1;
      }
    });

    const topVehicleEntry = Object.entries(vehicleCounts)
      .sort((a, b) => b[1] - a[1])[0];

    const topVehicle = topVehicleEntry ? {
      plate: topVehicleEntry[0],
      count: topVehicleEntry[1],
      vehicle: recentCheckins.find(c => 
        (c.vehiclePlate || c.vehicleId) === topVehicleEntry[0]
      )
    } : null;

    return {
      avgServiceTime,
      avgRevenue,
      topMechanic: topMechanic ? {
        name: topMechanic[0],
        count: topMechanic[1].count,
        avgTime: topMechanic[1].totalTime / topMechanic[1].count
      } : null,
      topVehicle,
      totalServices: recentCheckins.length
    };
  }, [checkins, daysRange]);

  /**
   * Formata duração
   */
  const formatDuration = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  /**
   * Formata moeda
   */
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Insights dos Últimos {daysRange} Dias
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {metrics.totalServices} serviços concluídos
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Avg Service Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.avgServiceTime > 0 ? formatDuration(metrics.avgServiceTime) : 'N/A'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Tempo Médio de Serviço
          </p>
        </motion.div>

        {/* Avg Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-green-500 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.avgRevenue > 0 ? formatCurrency(metrics.avgRevenue) : 'N/A'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Receita Média por Serviço
          </p>
        </motion.div>

        {/* Top Mechanic */}
        {metrics.topMechanic && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-purple-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-lg">
                🏆 TOP
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
              {metrics.topMechanic.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {metrics.topMechanic.count} serviços • Média: {formatDuration(metrics.topMechanic.avgTime)}
            </p>
          </motion.div>
        )}

        {/* Top Vehicle */}
        {metrics.topVehicle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-amber-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg">
                FREQUENTE
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {metrics.topVehicle.plate}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {metrics.topVehicle.count} visitas
              {metrics.topVehicle.vehicle && (
                <span className="block text-xs mt-0.5">
                  {metrics.topVehicle.vehicle.vehicleBrand} {metrics.topVehicle.vehicle.vehicleModel}
                </span>
              )}
            </p>
          </motion.div>
        )}
      </div>

      {/* Empty State */}
      {metrics.totalServices === 0 && (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum dado disponível para o período selecionado
          </p>
        </div>
      )}
    </div>
  );
};

export default InsightsDashboard;
