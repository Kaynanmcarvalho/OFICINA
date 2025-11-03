/**
 * ClientFilter - Componente de filtro elegante para clientes
 * Com opções de filtrar por status (ativo/inativo) e outros critérios
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  Users, 
  UserCheck, 
  UserX, 
  ChevronDown,
  X,
  Calendar,
  MapPin
} from 'lucide-react';

const ClientFilter = ({ 
  onFilterChange, 
  activeFilters = {},
  totalClients = 0,
  activeClients = 0,
  inactiveClients = 0
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(activeFilters);

  // Opções de filtro
  const filterOptions = [
    {
      id: 'status',
      label: 'Status',
      icon: Users,
      options: [
        { value: 'all', label: 'Todos os clientes', count: totalClients, color: 'text-blue-600' },
        { value: 'active', label: 'Clientes ativos', count: activeClients, color: 'text-green-600' },
        { value: 'inactive', label: 'Clientes inativos', count: inactiveClients, color: 'text-red-600' }
      ]
    },
    {
      id: 'period',
      label: 'Período de cadastro',
      icon: Calendar,
      options: [
        { value: 'all', label: 'Todos os períodos' },
        { value: 'today', label: 'Hoje' },
        { value: 'week', label: 'Esta semana' },
        { value: 'month', label: 'Este mês' },
        { value: 'year', label: 'Este ano' }
      ]
    },
    {
      id: 'location',
      label: 'Localização',
      icon: MapPin,
      options: [
        { value: 'all', label: 'Todas as cidades' },
        { value: 'local', label: 'Cidade local' },
        { value: 'other', label: 'Outras cidades' }
      ]
    }
  ];

  const handleFilterChange = (filterId, value) => {
    const newFilters = {
      ...selectedFilters,
      [filterId]: value
    };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { status: 'all', period: 'all', location: 'all' };
    setSelectedFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(selectedFilters).some(value => value !== 'all');

  return (
    <div className="relative">
      {/* Botão do filtro */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-xl
          transition-all duration-300 ease-out
          ${isOpen || hasActiveFilters
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
            : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700'
          }
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Filter size={18} />
        <span className="font-medium">Filtros</span>
        {hasActiveFilters && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 bg-white rounded-full"
          />
        )}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>

      {/* Dropdown do filtro */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 z-50"
            style={{
              backdropFilter: 'blur(20px)',
              background: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Filtrar clientes
              </h3>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Limpar
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Opções de filtro */}
            <div className="p-4 space-y-4">
              {filterOptions.map((filter) => {
                const Icon = filter.icon;
                return (
                  <div key={filter.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={16} className="text-neutral-500" />
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {filter.label}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {filter.options.map((option) => (
                        <motion.button
                          key={option.value}
                          onClick={() => handleFilterChange(filter.id, option.value)}
                          className={`
                            w-full flex items-center justify-between p-2 rounded-lg text-left
                            transition-all duration-200
                            ${selectedFilters[filter.id] === option.value
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                            }
                          `}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <span className={`text-sm ${option.color || ''}`}>
                            {option.label}
                          </span>
                          {option.count !== undefined && (
                            <span className="text-xs bg-neutral-200 dark:bg-neutral-600 text-neutral-600 dark:text-neutral-300 px-2 py-1 rounded-full">
                              {option.count}
                            </span>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientFilter;