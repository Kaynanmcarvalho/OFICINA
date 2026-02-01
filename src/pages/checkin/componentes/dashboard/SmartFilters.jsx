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
  Wrench,
  CheckCircle2
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
      {/* Botão principal de filtros e contador - Apple Style */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="relative flex items-center gap-2 px-5 py-3 rounded-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all"
        >
          <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Filtros
          </span>
          
          {/* Badge de contagem */}
          {activeFiltersCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 min-w-[24px] h-6 px-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50"
            >
              {activeFiltersCount}
            </motion.span>
          )}
        </motion.button>

        {/* Contador de resultados */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-bold text-gray-900 dark:text-white">
            {filteredRecords}
          </span>
          {' de '}
          <span className="font-bold text-gray-900 dark:text-white">
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={clearAllFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-all border-2 border-red-200/50 dark:border-red-800/50"
          >
            <X className="w-4 h-4" />
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

      {/* Modal Pop-up usando Portal - Apple-like Design */}
      {isModalOpen && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl my-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
            >
              {/* Header do Modal - Apple Style */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30"
                  >
                    <Filter className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                      Filtros Avançados
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      Refine sua busca com precisão
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all backdrop-blur-sm"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.button>
              </div>

              {/* Conteúdo do Modal - Apple Style */}
              <div className="p-6 space-y-6 overflow-y-auto scroll-smooth max-h-[calc(90vh-200px)]">
                
                {/* Filtro de Status */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3"
                >
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    <Filter className="w-4 h-4" />
                    Status do Veículo
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((option, index) => (
                      <motion.button
                        key={option.value}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleFilterChange('status', option.value)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          filters.status === option.value
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 border-2 border-blue-400'
                            : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm'
                        }`}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Filtro de Cliente */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3"
                >
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    <User className="w-4 h-4" />
                    Nome do Cliente
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.client}
                      onChange={(e) => handleFilterChange('client', e.target.value)}
                      placeholder="Digite o nome do cliente..."
                      className="w-full px-4 py-3 pl-11 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </motion.div>

                {/* Filtro de Tipo de Serviço */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    <Wrench className="w-4 h-4" />
                    Tipo de Serviço
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.serviceType}
                      onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                      placeholder="Ex: troca de óleo, alinhamento..."
                      className="w-full px-4 py-3 pl-11 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <Wrench className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </motion.div>

                {/* Filtro de Data (placeholder) */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3 opacity-40 pointer-events-none"
                >
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    <Calendar className="w-4 h-4" />
                    Período (em breve)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      disabled
                      className="px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-white font-medium"
                    />
                    <input
                      type="date"
                      disabled
                      className="px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-white font-medium"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Footer do Modal - Apple Style */}
              <div className="flex items-center justify-between px-6 py-5 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  {activeFiltersCount > 0 ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {activeFiltersCount}
                        </span>
                        {' filtro(s) ativo(s)'}
                      </span>
                    </motion.div>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      Nenhum filtro ativo
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  {activeFiltersCount > 0 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={clearAllFilters}
                      className="px-5 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-semibold"
                    >
                      Limpar Tudo
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Aplicar Filtros
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </>

};

// Componente auxiliar para pills de filtro - Apple Style
const FilterPill = ({ label, onRemove }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200/50 dark:border-blue-800/50 shadow-sm backdrop-blur-sm"
  >
    <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
      {label}
    </span>
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onRemove}
      className="p-1 rounded-lg hover:bg-blue-200/50 dark:hover:bg-blue-800/50 transition-colors"
    >
      <X className="w-4 h-4 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
    </motion.button>
  </motion.div>
);

export default SmartFilters;
