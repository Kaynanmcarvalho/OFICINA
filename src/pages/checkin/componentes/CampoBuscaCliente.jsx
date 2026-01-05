/**
 * Campo Busca Cliente - Ultra Premium Design
 * Design elegante com profundidade, contornos refinados e UX fluida
 * Janeiro 2026
 */

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { searchClients } from '../../../services/clientService';
import { formatCPF, formatCNPJ, formatPhone } from '../../../utils/formatters';
import { useClientStore } from '../../../store/clientStore';
import { useThemeStore } from '../../../store';

// ============================================================================
// EXCLUSIVE ICONS
// ============================================================================
const Icons = {
  Search: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  ),
  User: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
    </svg>
  ),
  Close: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  ),
  Plus: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  Phone: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  ),
  Document: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M9 7h6M9 11h6M9 15h4" strokeLinecap="round" />
    </svg>
  ),
  Building: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" strokeLinejoin="round" />
      <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" strokeLinecap="round" />
    </svg>
  ),
  Car: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 17h14v-5l-2-4H7l-2 4v5z" strokeLinejoin="round" />
      <circle cx="7.5" cy="17" r="1.5" />
      <circle cx="16.5" cy="17" r="1.5" />
    </svg>
  ),
  Check: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Loader: ({ className = '' }) => (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" opacity="0.2" />
      <path d="M12 2a10 10 0 019.17 6" strokeLinecap="round" />
    </svg>
  ),
  Sparkles: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" strokeLinejoin="round" />
    </svg>
  ),
};

const CampoBuscaCliente = ({ value, onSelect, error, hasBrandTheme = false }) => {
  const { isDarkMode } = useThemeStore();
  const [query, setQuery] = useState(value?.name || '');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const { fetchClients, clients } = useClientStore();

  // Usar tema escuro quando hasBrandTheme está ativo (modal com tema de marca)
  const useDarkTheme = isDarkMode || hasBrandTheme;

  // Theme - adapta para tema de marca quando ativo
  const theme = {
    dropdown: useDarkTheme ? 'bg-[#1c1c1e] border-white/[0.1]' : 'bg-white border-black/[0.08]',
    text: useDarkTheme ? 'text-white' : 'text-[#1d1d1f]',
    textSecondary: useDarkTheme ? 'text-white/60' : 'text-[#6e6e73]',
    textTertiary: useDarkTheme ? 'text-white/40' : 'text-[#86868b]',
    surface: useDarkTheme ? 'bg-white/[0.04]' : 'bg-black/[0.02]',
    surfaceHover: useDarkTheme ? 'hover:bg-white/[0.08]' : 'hover:bg-black/[0.04]',
    border: useDarkTheme ? 'border-white/[0.08]' : 'border-black/[0.06]',
    input: useDarkTheme 
      ? 'bg-white/[0.06] border-white/[0.1] text-white placeholder:text-white/30 focus:border-white/25' 
      : 'bg-white border-black/[0.1] text-[#1d1d1f] placeholder:text-[#86868b] focus:border-black/20 shadow-sm',
    accent: useDarkTheme ? 'text-emerald-400' : 'text-emerald-600',
    accentBg: useDarkTheme ? 'bg-emerald-500/15' : 'bg-emerald-50',
  };


  useEffect(() => {
    if (clients.length === 0) {
      fetchClients();
    }
  }, [clients.length, fetchClients]);

  useEffect(() => {
    const updatePosition = () => {
      if (inputRef.current && isOpen) {
        const rect = inputRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 8,
          left: rect.left,
          width: rect.width
        });
      }
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current && 
        !wrapperRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const buscarClientes = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const clientes = await searchClients(query);
        setResults(clientes || []);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(buscarClientes, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (cliente) => {
    setQuery(cliente.name);
    setIsOpen(false);
    onSelect(cliente);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    onSelect(null);
  };

  const handleNovoCliente = () => {
    onSelect({ id: 'new', name: query, isNew: true });
    setIsOpen(false);
  };


  return (
    <div ref={wrapperRef} className="relative">
      {/* Input Field */}
      <div className="relative">
        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${theme.textTertiary}`}>
          <Icons.Search className="w-5 h-5" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar por nome, CPF ou telefone..."
          className={`w-full pl-12 pr-10 py-3.5 rounded-xl border ${theme.input} transition-all outline-none`}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute inset-y-0 right-0 pr-4 flex items-center ${theme.textTertiary} hover:${theme.text} transition-colors`}
          >
            <Icons.Close className="w-4 h-4" />
          </button>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}

      {/* Dropdown Portal */}
      {isOpen && createPortal(
        <AnimatePresence>
          <motion.div 
            ref={dropdownRef}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`fixed rounded-2xl border shadow-2xl overflow-hidden ${theme.dropdown}`}
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              zIndex: 9999999,
              boxShadow: useDarkTheme 
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.05)' 
                : '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.03)'
            }}
          >
            {isLoading ? (
              <div className="px-6 py-10 flex flex-col items-center justify-center">
                <Icons.Loader className={`w-8 h-8 ${theme.accent}`} />
                <span className={`mt-3 text-sm ${theme.textSecondary}`}>Buscando clientes...</span>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto">
                {results.length > 0 ? (
                  <>
                    {/* Header */}
                    <div className={`px-4 py-3 border-b ${theme.border} ${theme.surface}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium ${theme.textSecondary}`}>
                          {results.length} cliente{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
                        </span>
                        <Icons.Sparkles className={`w-4 h-4 ${theme.textTertiary}`} />
                      </div>
                    </div>


                    {/* Results List */}
                    <div className="py-2">
                      {results.map((cliente, index) => {
                        const hasVehicles = cliente.vehicles && cliente.vehicles.length > 0;
                        const firstVehicle = hasVehicles ? cliente.vehicles[0] : null;
                        
                        return (
                          <motion.div
                            key={cliente.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            onClick={() => handleSelect(cliente)}
                            className={`group px-4 py-3.5 cursor-pointer transition-all duration-150 ${theme.surfaceHover} border-b last:border-b-0 ${theme.border}`}
                          >
                            <div className="flex items-start gap-4">
                              {/* Avatar */}
                              <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl ${theme.accentBg} flex items-center justify-center transition-transform group-hover:scale-105`}>
                                <Icons.User className={`w-6 h-6 ${theme.accent}`} />
                                {hasVehicles && (
                                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-lg ${useDarkTheme ? 'bg-blue-500/20' : 'bg-blue-50'} flex items-center justify-center border-2 ${useDarkTheme ? 'border-[#1c1c1e]' : 'border-white'}`}>
                                    <Icons.Car className={`w-3 h-3 ${useDarkTheme ? 'text-blue-400' : 'text-blue-600'}`} />
                                  </div>
                                )}
                              </div>
                              
                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <p className={`font-semibold ${theme.text} truncate group-hover:${theme.accent} transition-colors`}>
                                  {cliente.name}
                                </p>
                                
                                {/* Contact Info */}
                                <div className="mt-2 space-y-1.5">
                                  {cliente.phone && (
                                    <div className="flex items-center gap-2">
                                      <div className={`w-6 h-6 rounded-lg ${useDarkTheme ? 'bg-green-500/15' : 'bg-green-50'} flex items-center justify-center`}>
                                        <Icons.Phone className={`w-3.5 h-3.5 ${useDarkTheme ? 'text-green-400' : 'text-green-600'}`} />
                                      </div>
                                      <span className={`text-sm ${theme.textSecondary}`}>{formatPhone(cliente.phone)}</span>
                                    </div>
                                  )}
                                  
                                  {cliente.cpf && (
                                    <div className="flex items-center gap-2">
                                      <div className={`w-6 h-6 rounded-lg ${useDarkTheme ? 'bg-blue-500/15' : 'bg-blue-50'} flex items-center justify-center`}>
                                        <Icons.Document className={`w-3.5 h-3.5 ${useDarkTheme ? 'text-blue-400' : 'text-blue-600'}`} />
                                      </div>
                                      <span className={`text-sm ${theme.textSecondary}`}>{formatCPF(cliente.cpf)}</span>
                                    </div>
                                  )}
                                  
                                  {cliente.cnpj && (
                                    <div className="flex items-center gap-2">
                                      <div className={`w-6 h-6 rounded-lg ${useDarkTheme ? 'bg-purple-500/15' : 'bg-purple-50'} flex items-center justify-center`}>
                                        <Icons.Building className={`w-3.5 h-3.5 ${useDarkTheme ? 'text-purple-400' : 'text-purple-600'}`} />
                                      </div>
                                      <span className={`text-sm ${theme.textSecondary}`}>{formatCNPJ(cliente.cnpj)}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Vehicles */}
                                {hasVehicles && (
                                  <div className={`mt-3 pt-3 border-t ${theme.border}`}>
                                    <div className="flex items-center gap-2">
                                      <span className={`px-2 py-1 rounded-lg text-xs font-mono font-semibold ${useDarkTheme ? 'bg-white/[0.08] text-white' : 'bg-black/[0.04] text-[#1d1d1f]'}`}>
                                        {firstVehicle.plate}
                                      </span>
                                      <span className={`text-xs ${theme.textSecondary}`}>
                                        {firstVehicle.brand} {firstVehicle.model}
                                      </span>
                                    </div>
                                    {cliente.vehicles.length > 1 && (
                                      <p className={`text-xs ${theme.textTertiary} mt-1.5`}>
                                        +{cliente.vehicles.length - 1} outro{cliente.vehicles.length - 1 !== 1 ? 's' : ''} veículo{cliente.vehicles.length - 1 !== 1 ? 's' : ''}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Arrow */}
                              <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${theme.surface} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
                                <Icons.Check className={`w-4 h-4 ${theme.accent}`} />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </>
                ) : query.length >= 2 ? (
                  <div className="px-6 py-10 text-center">
                    <div className={`w-14 h-14 rounded-2xl ${theme.surface} flex items-center justify-center mx-auto mb-4`}>
                      <Icons.Search className={`w-7 h-7 ${theme.textTertiary}`} />
                    </div>
                    <p className={`font-medium ${theme.text}`}>Nenhum cliente encontrado</p>
                    <p className={`text-sm ${theme.textSecondary} mt-1`}>Tente buscar por nome, telefone ou CPF</p>
                  </div>
                ) : (
                  <div className="px-6 py-10 text-center">
                    <div className={`w-14 h-14 rounded-2xl ${theme.accentBg} flex items-center justify-center mx-auto mb-4`}>
                      <Icons.Search className={`w-7 h-7 ${theme.accent}`} />
                    </div>
                    <p className={`font-medium ${theme.text}`}>Digite para buscar</p>
                    <p className={`text-sm ${theme.textSecondary} mt-1`}>Mínimo 2 caracteres</p>
                  </div>
                )}


                {/* New Client Button */}
                {query.length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`border-t-2 ${useDarkTheme ? 'border-emerald-500/30' : 'border-emerald-500/20'}`}
                  >
                    <div
                      onClick={handleNovoCliente}
                      className={`px-4 py-4 cursor-pointer transition-all duration-150 ${useDarkTheme ? 'hover:bg-emerald-500/10' : 'hover:bg-emerald-50'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${theme.accentBg} flex items-center justify-center`}>
                          <Icons.Plus className={`w-6 h-6 ${theme.accent}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${theme.text}`}>Cadastrar novo cliente</p>
                          <p className={`text-sm ${theme.textSecondary} mt-0.5`}>
                            Nome: <span className={`font-medium ${theme.accent}`}>{query}</span>
                          </p>
                        </div>
                        <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${theme.accentBg} ${theme.accent}`}>
                          Novo
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default CampoBuscaCliente;