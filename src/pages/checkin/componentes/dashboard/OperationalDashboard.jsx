/**
 * OperationalDashboard Component
 * Dashboard operacional premium para visão geral da oficina
 * Design Apple-level com glassmorphism e animações fluidas
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import StatusCard from './StatusCard';
import ProductivityIndicator from './ProductivityIndicator';
import SmartFilters from './SmartFilters';
import { 
  Wrench, 
  FileText, 
  CheckCircle2, 
  Package 
} from 'lucide-react';

const OperationalDashboard = ({ checkins = [], dailyTarget = 10, onFilterChange }) => {
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: null,
    client: '',
    serviceType: ''
  });

  // Calcular métricas em tempo real
  const metrics = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const inRepair = checkins.filter(c => 
      c.status === 'active' || c.status === 'in_progress'
    ).length;

    const awaitingQuote = checkins.filter(c => 
      c.status === 'pending' || c.status === 'awaiting_quote'
    ).length;

    const readyForPickup = checkins.filter(c => 
      c.status === 'ready' || c.status === 'ready_for_pickup'
    ).length;

    const deliveredToday = checkins.filter(c => {
      if (c.status !== 'completed' && c.status !== 'delivered') return false;
      const completedDate = new Date(c.completedAt || c.updatedAt || c.createdAt);
      return completedDate >= today;
    }).length;

    // Tendências (comparação com ontem - simulado)
    const trends = {
      inRepair: Math.floor(Math.random() * 20) - 10, // -10 a +10
      awaitingQuote: Math.floor(Math.random() * 20) - 10,
      readyForPickup: Math.floor(Math.random() * 20) - 10,
      deliveredToday: Math.floor(Math.random() * 20) - 10,
    };

    return {
      inRepair,
      awaitingQuote,
      readyForPickup,
      deliveredToday,
      trends
    };
  }, [checkins]);

  // Aplicar filtros
  const filteredCheckins = useMemo(() => {
    return checkins.filter(checkin => {
      // Filtro de status
      if (filters.status !== 'all') {
        const statusMap = {
          'in_repair': ['active', 'in_progress'],
          'awaiting_quote': ['pending', 'awaiting_quote'],
          'ready': ['ready', 'ready_for_pickup'],
          'delivered': ['completed', 'delivered']
        };
        if (!statusMap[filters.status]?.includes(checkin.status)) return false;
      }

      // Filtro de cliente
      if (filters.client && !checkin.clientName?.toLowerCase().includes(filters.client.toLowerCase())) {
        return false;
      }

      // Filtro de tipo de serviço
      if (filters.serviceType && !checkin.services?.toLowerCase().includes(filters.serviceType.toLowerCase())) {
        return false;
      }

      // Filtro de data
      if (filters.dateRange) {
        const checkinDate = new Date(checkin.createdAt);
        if (checkinDate < filters.dateRange.start || checkinDate > filters.dateRange.end) {
          return false;
        }
      }

      return true;
    });
  }, [checkins, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="space-y-6">
      {/* Header com título e filtros */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Operacional
          </h2>
          <p className="text-sm font-bold text-gray-700 dark:text-gray-400 mt-1">
            Visão em tempo real da oficina
          </p>
        </div>

        <SmartFilters 
          filters={filters}
          onChange={handleFilterChange}
          totalRecords={checkins.length}
          filteredRecords={filteredCheckins.length}
        />
      </motion.div>

      {/* Grid de Status Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
      >
        <StatusCard
          title="Em Reparo"
          count={metrics.inRepair}
          icon={Wrench}
          color="amber"
          trend={metrics.trends.inRepair}
          delay={0}
        />

        <StatusCard
          title="Aguardando Orçamento"
          count={metrics.awaitingQuote}
          icon={FileText}
          color="blue"
          trend={metrics.trends.awaitingQuote}
          delay={0.1}
        />

        <StatusCard
          title="Pronto para Retirada"
          count={metrics.readyForPickup}
          icon={CheckCircle2}
          color="emerald"
          trend={metrics.trends.readyForPickup}
          delay={0.2}
        />

        <StatusCard
          title="Entregue Hoje"
          count={metrics.deliveredToday}
          icon={Package}
          color="gray"
          trend={metrics.trends.deliveredToday}
          delay={0.3}
        />
      </motion.div>

      {/* Indicador de Produtividade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ProductivityIndicator
          completed={metrics.deliveredToday}
          target={dailyTarget}
        />
      </motion.div>
    </div>
  );
};

export default OperationalDashboard;
