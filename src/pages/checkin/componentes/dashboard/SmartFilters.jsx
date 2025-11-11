/**
 * SmartFilters Component
 * Sistema de filtros inteligentes com modal pop-up
 * Design Apple-level com glassmorphism e blur no fundo
 */

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  X, 
  Calendar,
  User,
  Wrench
} from 'lucide-react';

const SmartFilters = ({ filters, onChange, totalRecords, filteredRecords }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <>
      {/* Botão principal de filtros e contador */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border-[3px] border-gray-700 dark:border-gray-700 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] transition-all"
        >
          <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
            Filtros
          </span>
          
          {/* Badge de contagem */}
          {activeFiltersCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
            >
              {activeFiltersCount}
            </motion.span>
          )}
        </motion.button>

        {/* Contador de resultados */}
        <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
          <span className="font-extrabold text-gray-950 dark:text-white">
            {filteredRecords}
          </span>
          {' de '}
          <span className="font-extrabold text-gray-950 dark:text-white">
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border-2 border-red-200 dark:border-red-800"
          >
            <X className="w-3.5 h-3.5" />
            Limpar
          </motion.button>
        )}
      </div>

      {/* Pills de filtros ativos */}
      {activeFiltersCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mt-3"
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

      {/* Modal Pop-up usando Portal */}
      {isModalOpen && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-black/60 overflow-y-auto"
            onClick={() => setIsModalOpen(false)}
            style={{ margin: 0, left: 0, right: 0, top: 0, bottom: 0 }}
          >
            <div className="min-h-screen w-full flex items-start justify-center p-4 py-8">

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden my-auto"
            >
              {/* Header do Modal */}
              <div className="flex items-center justify-between px-6 py-3 border-b-2 border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 dark:bg-blue-500/20">
                    <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-950 dark:text-white">
                      Filtros Avançados
                    </h3>
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
                      Refine sua busca
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </motion.button>
              </div>

              {/* Conteúdo do Modal */}
              <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
                
                {/* Filtro de Status */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-extrabold text-gray-900 dark:text-gray-100">
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
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                          filters.status === option.value
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 border-blue-600'
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Filtro de Cliente */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-extrabold text-gray-900 dark:text-gray-100">
                    <User className="w-4 h-4" />
                    Cliente
                  </label>
                  <input
                    type="text"
                    value={filters.client}
                    onChange={(e) => handleFilterChange('client', e.target.value)}
                    placeholder="Buscar por nome do cliente..."
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Filtro de Tipo de Serviço */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-extrabold text-gray-900 dark:text-gray-100">
                    <Wrench className="w-4 h-4" />
                    Tipo de Serviço
                  </label>
                  <input
                    type="text"
                    value={filters.serviceType}
                    onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                    placeholder="Ex: troca de óleo, alinhamento..."
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Filtro de Data (placeholder para futura implementação) */}
                <div className="space-y-2 opacity-50 pointer-events-none">
                  <label className="flex items-center gap-2 text-sm font-extrabold text-gray-900 dark:text-gray-100">
                    <Calendar className="w-4 h-4" />
                    Período (em breve)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      disabled
                      className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium"
                    />
                    <input
                      type="date"
                      disabled
                      className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Footer do Modal */}
              <div className="flex items-center justify-between px-6 py-3 border-t-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <div className="text-sm font-bold text-gray-600 dark:text-gray-400">
                  {activeFiltersCount > 0 ? (
                    <span>
                      <span className="text-blue-600 dark:text-blue-400 font-extrabold">
                        {activeFiltersCount}
                      </span>
                      {' filtro(s) ativo(s)'}
                    </span>
                  ) : (
                    'Nenhum filtro ativo'
                  )}
                </div>
                <div className="flex gap-3">
                  {activeFiltersCount > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearAllFilters}
                      className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border-2 border-red-200 dark:border-red-800"
                    >
                      Limpar Tudo
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30 transition-all"
                  >
                    Aplicar
                  </motion.button>
                </div>
              </div>
            </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

// Componente auxiliar para pills de filtro
const FilterPill = ({ label, onRemove }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 shadow-sm"
  >
    <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
      {label}
    </span>
    <motion.button
      whileHover={{ scale: 1.2, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      onClick={onRemove}
      className="p-0.5 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
    >
      <X className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
    </motion.button>
  </motion.div>
);

export default SmartFilters;
