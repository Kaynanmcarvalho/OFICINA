/**
 * ClientFilter - Componente de filtro elegante para clientes
 * Com opções de filtrar por status (ativo/inativo) e outros critérios
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  Users, 
  ChevronDown,
  X
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
  const [dropdownPosition, setDropdownPosition] = useState('left');
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

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
    const clearedFilters = { status: 'all' };
    setSelectedFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(selectedFilters).some(value => value !== 'all');

  // Calcular posição do dropdown para evitar overflow
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const dropdownWidth = Math.min(320, viewportWidth - 40); // Adaptar à viewport
      
      // Para telas muito pequenas, centralizar
      if (viewportWidth < 400) {
        setDropdownPosition('center');
      }
      // Se o dropdown ultrapassar a borda direita, posicionar à direita
      else if (buttonRect.left + dropdownWidth > viewportWidth - 20) {
        setDropdownPosition('right');
      } 
      // Se posicionar à direita faria ultrapassar a borda esquerda, manter à esquerda
      else if (buttonRect.right - dropdownWidth < 20) {
        setDropdownPosition('left');
      }
      else {
        setDropdownPosition('left');
      }
    }
  }, [isOpen]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Botão do filtro */}
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-xl
          transition-all duration-300 ease-out
          ${isOpen || hasActiveFilters
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
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
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50
              ${dropdownPosition === 'center' ? 'left-1/2 transform -translate-x-1/2' : 
                dropdownPosition === 'right' ? 'right-0' : 'left-0'}
            `}
            style={{
              width: dropdownPosition === 'center' ? 'calc(100vw - 40px)' : '320px',
              maxWidth: 'calc(100vw - 20px)',
              minWidth: '280px'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
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
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Opções de filtro */}
            <div className="p-4 space-y-3 max-h-72 overflow-y-auto dropdown-scrollbar">
              {filterOptions.map((filter) => {
                const Icon = filter.icon;
                return (
                  <div key={filter.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={16} className="text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {filter.label}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {filter.options.map((option) => (
                        <motion.button
                          key={option.value}
                          onClick={() => {
                            handleFilterChange(filter.id, option.value);
                            // Fechar dropdown em telas pequenas após seleção
                            if (window.innerWidth < 640) {
                              setTimeout(() => setIsOpen(false), 150);
                            }
                          }}
                          className={`
                            w-full flex items-center justify-between p-3 rounded-lg text-left
                            transition-all duration-200 touch-manipulation
                            ${selectedFilters[filter.id] === option.value
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-2 ring-blue-200 dark:ring-blue-800'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }
                          `}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className={`text-sm font-medium ${option.color || ''}`}>
                            {option.label}
                          </span>
                          {option.count !== undefined && (
                            <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full font-medium">
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