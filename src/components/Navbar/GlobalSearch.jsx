import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  User, 
  Car, 
  ClipboardList, 
  Package, 
  FileText,
  ArrowRight,
  Clock,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useClientStore, useVehicleStore, useCheckinStore, useInventoryStore, useBudgetStore, useThemeStore } from '../../store/index.jsx';

/**
 * GlobalSearch - Busca Global Inteligente Premium
 * Busca em clientes, veículos, check-ins, inventário e orçamentos
 * Suporte completo para modo claro e escuro
 */
const GlobalSearch = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [results, setResults] = useState({
    clients: [],
    vehicles: [],
    checkins: [],
    inventory: [],
    budgets: []
  });
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

  // Theme
  const { isDarkMode } = useThemeStore();

  // Stores
  const { clients = [] } = useClientStore();
  const { vehicles = [] } = useVehicleStore();
  const { checkins = [] } = useCheckinStore();
  const { parts = [] } = useInventoryStore();
  const { budgets = [] } = useBudgetStore();

  // Total results count - defined early for use in effects
  const totalResults = useMemo(() => {
    return results.clients.length + 
           results.vehicles.length + 
           results.checkins.length + 
           results.inventory.length + 
           results.budgets.length;
  }, [results]);

  // Filter results by category - defined early for use in effects
  const filteredResults = useMemo(() => {
    if (activeCategory === 'all') return results;
    return {
      clients: activeCategory === 'clients' ? results.clients : [],
      vehicles: activeCategory === 'vehicles' ? results.vehicles : [],
      checkins: activeCategory === 'checkins' ? results.checkins : [],
      inventory: activeCategory === 'inventory' ? results.inventory : [],
      budgets: activeCategory === 'budgets' ? results.budgets : []
    };
  }, [results, activeCategory]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on Escape and keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      // Keyboard navigation
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, totalResults - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, totalResults]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchTerm]);

  // Save to recent searches
  const saveRecentSearch = (term) => {
    if (!term) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Remove from recent searches
  const removeRecentSearch = (termToRemove) => {
    const updated = recentSearches.filter(s => s !== termToRemove);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Handle result click
  const handleResultClick = useCallback((type, item) => {
    saveRecentSearch(searchTerm);
    onClose();
    setSearchTerm('');

    switch (type) {
      case 'client':
        navigate(`/clients?id=${item.id || item.firestoreId}`);
        break;
      case 'vehicle':
        navigate(`/vehicles?id=${item.firestoreId}`);
        break;
      case 'checkin':
        navigate(`/checkin/${item.firestoreId}`);
        break;
      case 'inventory':
        navigate(`/inventory?id=${item.id || item.firestoreId}`);
        break;
      case 'budget':
        navigate(`/budgets?id=${item.id || item.firestoreId}`);
        break;
      default:
        break;
    }
  }, [navigate, onClose, searchTerm, recentSearches]);

  // Handle Enter key selection
  const handleEnterSelection = useCallback(() => {
    const allItems = [
      ...filteredResults.clients.map(item => ({ type: 'client', item })),
      ...filteredResults.vehicles.map(item => ({ type: 'vehicle', item })),
      ...filteredResults.checkins.map(item => ({ type: 'checkin', item })),
      ...filteredResults.inventory.map(item => ({ type: 'inventory', item })),
      ...filteredResults.budgets.map(item => ({ type: 'budget', item }))
    ];
    
    if (allItems[selectedIndex]) {
      const { type, item } = allItems[selectedIndex];
      handleResultClick(type, item);
    }
  }, [selectedIndex, filteredResults, handleResultClick]);

  // Handle Enter key press
  useEffect(() => {
    const handleEnterKey = (e) => {
      if (e.key === 'Enter' && selectedIndex >= 0 && isOpen) {
        e.preventDefault();
        handleEnterSelection();
      }
    };

    document.addEventListener('keydown', handleEnterKey);
    return () => document.removeEventListener('keydown', handleEnterKey);
  }, [selectedIndex, isOpen, handleEnterSelection]);

  // Search function
  const performSearch = useCallback((term) => {
    if (!term || term.length < 2) {
      setResults({ clients: [], vehicles: [], checkins: [], inventory: [], budgets: [] });
      return;
    }

    setIsSearching(true);
    const searchLower = term.toLowerCase();

    // Search clients
    const clientResults = clients.filter(client =>
      client.name?.toLowerCase().includes(searchLower) ||
      client.phone?.includes(term) ||
      client.cpf?.includes(term) ||
      client.email?.toLowerCase().includes(searchLower)
    ).slice(0, 5);

    // Search vehicles
    const vehicleResults = vehicles.filter(vehicle =>
      vehicle.plate?.toLowerCase().includes(searchLower) ||
      vehicle.brand?.toLowerCase().includes(searchLower) ||
      vehicle.model?.toLowerCase().includes(searchLower) ||
      vehicle.vehicleId?.toLowerCase().includes(searchLower)
    ).slice(0, 5);

    // Search check-ins
    const checkinResults = checkins.filter(checkin =>
      checkin.clientName?.toLowerCase().includes(searchLower) ||
      checkin.vehiclePlate?.toLowerCase().includes(searchLower) ||
      checkin.id?.toLowerCase().includes(searchLower)
    ).slice(0, 5);

    // Search inventory
    const inventoryResults = parts.filter(part =>
      part.name?.toLowerCase().includes(searchLower) ||
      part.partId?.toLowerCase().includes(searchLower) ||
      part.brand?.toLowerCase().includes(searchLower) ||
      part.category?.toLowerCase().includes(searchLower)
    ).slice(0, 5);

    // Search budgets
    const budgetResults = budgets.filter(budget =>
      budget.budgetNumber?.toLowerCase().includes(searchLower) ||
      budget.clientName?.toLowerCase().includes(searchLower)
    ).slice(0, 5);

    setResults({
      clients: clientResults,
      vehicles: vehicleResults,
      checkins: checkinResults,
      inventory: inventoryResults,
      budgets: budgetResults
    });

    setIsSearching(false);
  }, [clients, vehicles, checkins, parts, budgets]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, performSearch]);

  const categories = [
    { id: 'all', label: 'Todos', count: totalResults },
    { id: 'clients', label: 'Clientes', count: results.clients.length, icon: User },
    { id: 'vehicles', label: 'Veículos', count: results.vehicles.length, icon: Car },
    { id: 'checkins', label: 'Check-ins', count: results.checkins.length, icon: ClipboardList },
    { id: 'inventory', label: 'Estoque', count: results.inventory.length, icon: Package },
    { id: 'budgets', label: 'Orçamentos', count: results.budgets.length, icon: FileText }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/60' : 'bg-black/40'} backdrop-blur-sm`} />

        {/* Search Modal */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className={`
            relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden
            ${isDarkMode 
              ? 'bg-[#1C1E26] border border-white/[0.08]' 
              : 'bg-white border border-gray-200/80'
            }
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className={`
            flex items-center px-4 py-3 border-b
            ${isDarkMode ? 'border-white/[0.08]' : 'border-gray-200/80'}
          `}>
            <Search className={`w-5 h-5 mr-3 ${isDarkMode ? 'text-[#6E6F76]' : 'text-gray-400'}`} />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar clientes, veículos, check-ins..."
              className={`
                flex-1 bg-transparent outline-none text-base
                ${isDarkMode 
                  ? 'text-[#E8E8EA] placeholder-[#6E6F76]' 
                  : 'text-gray-900 placeholder-gray-400'
                }
              `}
            />
            {isSearching && (
              <Loader2 className="w-5 h-5 text-orange-500 animate-spin mr-2" />
            )}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className={`
                  p-1 rounded-lg transition-colors
                  ${isDarkMode ? 'hover:bg-white/[0.05]' : 'hover:bg-gray-100'}
                `}
              >
                <X className={`w-4 h-4 ${isDarkMode ? 'text-[#6E6F76]' : 'text-gray-400'}`} />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          {searchTerm.length >= 2 && totalResults > 0 && (
            <div className={`
              flex items-center gap-1 px-4 py-2 border-b overflow-x-auto
              ${isDarkMode ? 'border-white/[0.08]' : 'border-gray-200/80'}
            `}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                    ${activeCategory === cat.id
                      ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      : isDarkMode 
                        ? 'text-[#A7A8AE] hover:bg-white/[0.05]' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  {cat.icon && <cat.icon className="w-4 h-4" />}
                  {cat.label}
                  {cat.count > 0 && (
                    <span className="text-xs opacity-70">({cat.count})</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Results */}
          <div ref={resultsRef} className="max-h-[60vh] overflow-y-auto">
            {/* Empty State - Initial */}
            {!searchTerm && recentSearches.length === 0 && (
              <div className="p-8 text-center">
                <div className={`
                  w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center
                  ${isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50'}
                `}>
                  <Sparkles className="w-8 h-8 text-orange-500" />
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-[#A7A8AE]' : 'text-gray-600'}`}>
                  Busque por clientes, veículos, check-ins, peças ou orçamentos
                </p>
                <p className={`text-xs mt-2 ${isDarkMode ? 'text-[#6E6F76]' : 'text-gray-400'}`}>
                  Digite pelo menos 2 caracteres para iniciar a busca
                </p>
              </div>
            )}

            {/* Recent Searches */}
            {!searchTerm && recentSearches.length > 0 && (
              <div className="p-4">
                <p className={`
                  text-xs font-medium uppercase tracking-wider mb-2
                  ${isDarkMode ? 'text-[#6E6F76]' : 'text-gray-500'}
                `}>
                  Buscas Recentes
                </p>
                <div className="space-y-1">
                  {recentSearches.map((term, index) => (
                    <div
                      key={index}
                      className={`
                        flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-colors group
                        ${isDarkMode 
                          ? 'hover:bg-white/[0.05]' 
                          : 'hover:bg-gray-100'
                        }
                      `}
                    >
                      <button
                        onClick={() => setSearchTerm(term)}
                        className={`
                          flex items-center gap-2 flex-1 text-left
                          ${isDarkMode ? 'text-[#E8E8EA]' : 'text-gray-700'}
                        `}
                      >
                        <Clock className={`w-4 h-4 ${isDarkMode ? 'text-[#6E6F76]' : 'text-gray-400'}`} />
                        {term}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentSearch(term);
                        }}
                        className={`
                          p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity
                          ${isDarkMode 
                            ? 'hover:bg-white/[0.1] text-[#6E6F76] hover:text-[#A7A8AE]' 
                            : 'hover:bg-gray-200 text-gray-400 hover:text-gray-600'
                          }
                        `}
                        title="Remover busca"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchTerm.length >= 2 && totalResults === 0 && !isSearching && (
              <div className="p-8 text-center">
                <Search className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-[#3A3B40]' : 'text-gray-300'}`} />
                <p className={isDarkMode ? 'text-[#6E6F76]' : 'text-gray-500'}>
                  Nenhum resultado encontrado para "{searchTerm}"
                </p>
              </div>
            )}

            {/* Clients */}
            {filteredResults.clients.length > 0 && (
              <ResultSection
                title="Clientes"
                icon={User}
                items={filteredResults.clients}
                onItemClick={(item) => handleResultClick('client', item)}
                isDarkMode={isDarkMode}
                renderItem={(client) => (
                  <>
                    <div className={`font-medium ${isDarkMode ? 'text-[#E8E8EA]' : 'text-gray-900'}`}>
                      {client.name}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-[#6E6F76]' : 'text-gray-500'}`}>
                      {client.phone} {client.cpf && `• CPF: ${client.cpf}`}
                    </div>
                  </>
                )}
              />
            )}

            {/* Vehicles */}
            {filteredResults.vehicles.length > 0 && (
              <ResultSection
                title="Veículos"
                icon={Car}
                items={filteredResults.vehicles}
                onItemClick={(item) => handleResultClick('vehicle', item)}
                isDarkMode={isDarkMode}
                renderItem={(vehicle) => (
                  <>
                    <div className={`font-medium ${isDarkMode ? 'text-[#E8E8EA]' : 'text-gray-900'}`}>
                      {vehicle.brand} {vehicle.model}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-[#6E6F76]' : 'text-gray-500'}`}>
                      Placa: {vehicle.plate} {vehicle.year && `• ${vehicle.year}`}
                    </div>
                  </>
                )}
              />
            )}

            {/* Check-ins */}
            {filteredResults.checkins.length > 0 && (
              <ResultSection
                title="Check-ins"
                icon={ClipboardList}
                items={filteredResults.checkins}
                onItemClick={(item) => handleResultClick('checkin', item)}
                isDarkMode={isDarkMode}
                renderItem={(checkin) => (
                  <>
                    <div className={`font-medium ${isDarkMode ? 'text-[#E8E8EA]' : 'text-gray-900'}`}>
                      {checkin.clientName}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-[#6E6F76]' : 'text-gray-500'}`}>
                      {checkin.vehiclePlate} • {checkin.status === 'in-progress' ? 'Em andamento' : checkin.status === 'completed' ? 'Concluído' : checkin.status}
                    </div>
                  </>
                )}
              />
            )}

            {/* Inventory */}
            {filteredResults.inventory.length > 0 && (
              <ResultSection
                title="Estoque"
                icon={Package}
                items={filteredResults.inventory}
                onItemClick={(item) => handleResultClick('inventory', item)}
                isDarkMode={isDarkMode}
                renderItem={(part) => (
                  <>
                    <div className={`font-medium ${isDarkMode ? 'text-[#E8E8EA]' : 'text-gray-900'}`}>
                      {part.name}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-[#6E6F76]' : 'text-gray-500'}`}>
                      {part.brand} • Estoque: {part.currentStock || part.quantity || 0}
                    </div>
                  </>
                )}
              />
            )}

            {/* Budgets */}
            {filteredResults.budgets.length > 0 && (
              <ResultSection
                title="Orçamentos"
                icon={FileText}
                items={filteredResults.budgets}
                onItemClick={(item) => handleResultClick('budget', item)}
                isDarkMode={isDarkMode}
                renderItem={(budget) => (
                  <>
                    <div className={`font-medium ${isDarkMode ? 'text-[#E8E8EA]' : 'text-gray-900'}`}>
                      {budget.budgetNumber || `#${budget.id?.slice(-6)}`}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-[#6E6F76]' : 'text-gray-500'}`}>
                      {budget.clientName} • R$ {(budget.total || 0).toFixed(2)}
                    </div>
                  </>
                )}
              />
            )}
          </div>

          {/* Footer */}
          <div className={`
            px-4 py-3 border-t
            ${isDarkMode 
              ? 'border-white/[0.08] bg-[#14161D]/50' 
              : 'border-gray-200/80 bg-gray-50/50'
            }
          `}>
            <div className={`
              flex items-center justify-between text-xs
              ${isDarkMode ? 'text-[#6E6F76]' : 'text-gray-500'}
            `}>
              <span>
                <kbd className={`
                  px-1.5 py-0.5 rounded text-[10px]
                  ${isDarkMode ? 'bg-[#2A2C34]' : 'bg-gray-200'}
                `}>ESC</kbd>
                {' '}para fechar
              </span>
              <span>
                <kbd className={`
                  px-1.5 py-0.5 rounded text-[10px]
                  ${isDarkMode ? 'bg-[#2A2C34]' : 'bg-gray-200'}
                `}>↑↓</kbd>
                {' '}navegar
                {' '}
                <kbd className={`
                  px-1.5 py-0.5 rounded text-[10px]
                  ${isDarkMode ? 'bg-[#2A2C34]' : 'bg-gray-200'}
                `}>↵</kbd>
                {' '}selecionar
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Result Section Component
const ResultSection = ({ title, icon: Icon, items, onItemClick, renderItem, isDarkMode }) => (
  <div className={`
    p-4 border-b last:border-b-0
    ${isDarkMode ? 'border-white/[0.08]' : 'border-gray-200/80'}
  `}>
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-orange-500" />
      <span className={`
        text-xs font-medium uppercase tracking-wider
        ${isDarkMode ? 'text-[#6E6F76]' : 'text-gray-500'}
      `}>
        {title}
      </span>
    </div>
    <div className="space-y-1">
      {items.map((item, index) => (
        <motion.button
          key={item.id || item.firestoreId || index}
          whileHover={{ x: 4 }}
          onClick={() => onItemClick(item)}
          className={`
            flex items-center justify-between w-full px-3 py-2 text-left rounded-lg transition-colors group
            ${isDarkMode ? 'hover:bg-white/[0.05]' : 'hover:bg-gray-100'}
          `}
        >
          <div className="flex-1 min-w-0">
            {renderItem(item)}
          </div>
          <ArrowRight className={`
            w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2
            ${isDarkMode ? 'text-[#6E6F76]' : 'text-gray-400'}
          `} />
        </motion.button>
      ))}
    </div>
  </div>
);

export default GlobalSearch;
