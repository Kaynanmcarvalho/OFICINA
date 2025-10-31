import React from 'react';
import { motion } from 'framer-motion';

export interface FilterState {
  status: string;
  type: string;
  period: string;
}

interface RecentFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClose: () => void;
}

/**
 * RecentFilters - Painel de filtros avançados
 * Design Apple premium com glassmorphism
 */
const RecentFilters: React.FC<RecentFiltersProps> = ({
  filters,
  onChange,
  onClose,
}) => {
  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'in_progress', label: 'Em andamento' },
    { value: 'completed', label: 'Concluído' },
    { value: 'pending', label: 'Pendente' },
    { value: 'cancelled', label: 'Cancelado' },
  ];

  const typeOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'car', label: 'Carro' },
    { value: 'motorcycle', label: 'Moto' },
    { value: 'truck', label: 'Caminhão' },
    { value: 'van', label: 'Van' },
  ];

  const periodOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'today', label: 'Hoje' },
    { value: 'yesterday', label: 'Ontem' },
    { value: 'week', label: 'Últimos 7 dias' },
    { value: 'month', label: 'Últimos 30 dias' },
  ];

  const handleClear = () => {
    onChange({ status: 'all', type: 'all', period: 'all' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="
        p-5
        rounded-2xl
        bg-white/90 dark:bg-neutral-800/90
        backdrop-blur-xl
        border border-neutral-200/50 dark:border-neutral-700/50
        shadow-elevation-2
      "
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="
              w-full
              h-11
              px-3
              rounded-lg
              bg-neutral-50 dark:bg-neutral-700/50
              border border-neutral-200 dark:border-neutral-600
              text-sm text-neutral-900 dark:text-neutral-100
              focus:outline-none focus:ring-2 focus:ring-accent-500/50
              transition-all
            "
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Tipo
          </label>
          <select
            value={filters.type}
            onChange={(e) => onChange({ ...filters, type: e.target.value })}
            className="
              w-full
              h-11
              px-3
              rounded-lg
              bg-neutral-50 dark:bg-neutral-700/50
              border border-neutral-200 dark:border-neutral-600
              text-sm text-neutral-900 dark:text-neutral-100
              focus:outline-none focus:ring-2 focus:ring-accent-500/50
              transition-all
            "
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Period Filter */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Período
          </label>
          <select
            value={filters.period}
            onChange={(e) => onChange({ ...filters, period: e.target.value })}
            className="
              w-full
              h-11
              px-3
              rounded-lg
              bg-neutral-50 dark:bg-neutral-700/50
              border border-neutral-200 dark:border-neutral-600
              text-sm text-neutral-900 dark:text-neutral-100
              focus:outline-none focus:ring-2 focus:ring-accent-500/50
              transition-all
            "
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={handleClear}
          className="
            px-4 py-2
            rounded-lg
            text-sm font-medium
            text-neutral-600 dark:text-neutral-400
            hover:bg-neutral-100 dark:hover:bg-neutral-700
            transition-colors
          "
        >
          Limpar
        </button>
        <button
          onClick={onClose}
          className="
            px-4 py-2
            rounded-lg
            text-sm font-medium
            bg-accent-500
            text-white
            hover:bg-accent-600
            transition-colors
          "
        >
          Aplicar
        </button>
      </div>
    </motion.div>
  );
};

export default RecentFilters;
