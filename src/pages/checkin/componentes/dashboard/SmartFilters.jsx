/**
 * SmartFilters Component
 * Sistema de filtros inteligentes com pills e animações
 * Design Apple-level com feedback visual claro
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  X, 
  Calendar,
  User,
  Wrench,
  ChevronDown
} from 'lucide-react';

const SmartFilters = ({ filters, onChange, totalRecords, filteredRecords }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Contar filtros ativos
  const activeFiltersCount = Object.values(filters).filter(v => 
    v && v !== 'all' && v !== ''
  ).length;

  // Opções de filtro
  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'in_repair', label: 'Em Reparo' },
    { value: 'awaiting_quote', label: 'Aguardando Orçamento' },
    { value: 'ready', label: 'Pronto para Retirada' },
    { value: 'delivered', label: 'Entregue' },
  ];

  const handleFilterChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    onChange({
      status: 'all',
      dateRange: null,
      client: '',
      serviceType: ''
    });
  };

  return (
    <div className="space-y-3">
      {/* Botão principal de filtros */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
        >
          <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filtros
          </span>
          
          {/* Badge de contagem */}
          {activeFiltersCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
            >
              {activeFiltersCount}
            </motion.span>
          )}

          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </motion.button>

        {/* Contador de resultados */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">
            {filteredRecords}
          </span>
          {' de '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {totalRecords}
          </span>
          {' registros'}
        </div>

        {/* Botão limpar filtros */}
        {activeFiltersCount > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAllFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Limpar
          </motion.button>
        )}
      </div>

      {/* Painel de filtros expandido */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.9, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg space-y-4">
              
              {/* Filtro de Status */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Filter className="w-4 h-4" />
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleFilterChange('status', option.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        filters.status === option.value
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Filtro de Cliente */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <User className="w-4 h-4" />
                  Cliente
                </label>
                <input
                  type="text"
                  value={filters.client}
                  onChange={(e) => handleFilterChange('client', e.target.value)}
                  placeholder="Buscar por nome do cliente..."
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Filtro de Tipo de Serviço */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Wrench className="w-4 h-4" />
                  Tipo de Serviço
                </label>
                <input
                  type="text"
                  value={filters.serviceType}
                  onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                  placeholder="Ex: troca de óleo, alinhamento..."
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Filtro de Data (placeholder para futura implementação) */}
              <div className="space-y-2 opacity-50 pointer-events-none">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Calendar className="w-4 h-4" />
                  Período (em breve)
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    disabled
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="date"
                    disabled
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pills de filtros ativos */}
      {activeFiltersCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {filters.status !== 'all' && (
            <FilterPill
              label={`Status: ${statusOptions.find(o => o.value === filters.status)?.label}`}
              onRemove={() => handleFilterChange('status', 'all')}
            />
          )}
          {filters.client && (
            <FilterPill
              label={`Cliente: ${filters.client}`}
              onRemove={() => handleFilterChange('client', '')}
            />
          )}
          {filters.serviceType && (
            <FilterPill
              label={`Serviço: ${filters.serviceType}`}
              onRemove={() => handleFilterChange('serviceType', '')}
            />
          )}
        </motion.div>
      )}
    </div>
  );
};

// Componente auxiliar para pills de filtro
const FilterPill = ({ label, onRemove }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
  >
    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
      {label}
    </span>
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onRemove}
      className="p-0.5 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
    >
      <X className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
    </motion.button>
  </motion.div>
);

export default SmartFilters;
