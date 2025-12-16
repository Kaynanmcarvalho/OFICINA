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
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useClientStore, useVehicleStore, useCheckinStore, useInventoryStore, useBudgetStore } from '../../store/index.jsx';

/**
 * GlobalSearch - Busca Global Premium
 * Busca em clientes, veículos, check-ins, inventário e orçamentos
 */
const GlobalSearch = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState({
    clients: [],
    vehicles: [],
    checkins: [],
    inventory: [],
    budgets: []
  });
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

  // Stores
  const { clients } = useClientStore();
  const { vehicles } = useVehicleStore();
  const { checkins } = useCheckinStore();
  const { parts } = useInventoryStore();
  const { budgets } = useBudgetStore();

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

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

  // Save to recent searches
  const saveRecentSearch = (term) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Handle result click
  const handleResultClick = (type, item) => {
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
  };

  // Total results count
  const totalResults = useMemo(() => {
    return results.clients.length + 
           results.vehicles.length + 
           results.checkins.length + 
           results.inventory.length + 
           results.budgets.length;
  }, [results]);

  // Filter results by category
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
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Search Modal */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#1C1E26] rounded-2xl shadow-2xl border border-gray-200/50 dark:border-white/[0.08] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center px-4 py-3 border-b border-gray-200/50 dark:border-white/[0.08]">
            <Search className="w-5 h-5 text-gray-400 dark:text-[#6E6F76] mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar clientes, veículos, check-ins..."
              className="flex-1 bg-transparent text-gray-900 dark:text-[#E8E8EA] placeholder-gray-400 dark:placeholder-[#6E6F76] outline-none text-base"
            />
            {isSearching && (
              <Loader2 className="w-5 h-5 text-orange-500 animate-spin mr-2" />
            )}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 hover:bg-gray-100 dark:hover:bg-white/[0.05] rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400 dark:text-[#6E6F76]" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          {searchTerm.length >= 2 && totalResults > 0 && (
            <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-200/50 dark:border-white/[0.08] overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      : 'text-gray-600 dark:text-[#A7A8AE] hover:bg-gray-100 dark:hover:bg-white/[0.05]'
                  }`}
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
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Recent Searches */}
            {!searchTerm && recentSearches.length > 0 && (
              <div className="p-4">
                <p className="text-xs font-medium text-gray-500 dark:text-[#6E6F76] uppercase tracking-wider mb-2">
                  Buscas Recentes
                </p>
                <div className="space-y-1">
                  {recentSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchTerm(term)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-gray-700 dark:text-[#E8E8EA] hover:bg-gray-100 dark:hover:bg-white/[0.05] rounded-lg transition-colors"
                    >
                      <Clock className="w-4 h-4 text-gray-400 dark:text-[#6E6F76]" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchTerm.length >= 2 && totalResults === 0 && !isSearching && (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 text-gray-300 dark:text-[#3A3B40] mx-auto mb-3" />
                <p className="text-gray-500 dark:text-[#6E6F76]">
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
                renderItem={(client) => (
                  <>
                    <div className="font-medium text-gray-900 dark:text-[#E8E8EA]">
                      {client.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-[#6E6F76]">
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
                renderItem={(vehicle) => (
                  <>
                    <div className="font-medium text-gray-900 dark:text-[#E8E8EA]">
                      {vehicle.brand} {vehicle.model}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-[#6E6F76]">
                      Placa: {vehicle.plate} • {vehicle.status}
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
                renderItem={(checkin) => (
                  <>
                    <div className="font-medium text-gray-900 dark:text-[#E8E8EA]">
                      {checkin.clientName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-[#6E6F76]">
                      {checkin.vehiclePlate} • {checkin.status === 'in-progress' ? 'Em andamento' : 'Concluído'}
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
                renderItem={(part) => (
                  <>
                    <div className="font-medium text-gray-900 dark:text-[#E8E8EA]">
                      {part.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-[#6E6F76]">
                      {part.brand} • Estoque: {part.currentStock}
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
                renderItem={(budget) => (
                  <>
                    <div className="font-medium text-gray-900 dark:text-[#E8E8EA]">
                      {budget.budgetNumber}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-[#6E6F76]">
                      {budget.clientName} • R$ {budget.total?.toFixed(2)}
                    </div>
                  </>
                )}
              />
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200/50 dark:border-white/[0.08] bg-gray-50/50 dark:bg-[#14161D]/50">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-[#6E6F76]">
              <span>
                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-[#2A2C34] rounded text-[10px]">ESC</kbd>
                {' '}para fechar
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-[#2A2C34] rounded text-[10px]">↵</kbd>
                {' '}para selecionar
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Result Section Component
const ResultSection = ({ title, icon: Icon, items, onItemClick, renderItem }) => (
  <div className="p-4 border-b border-gray-200/50 dark:border-white/[0.08] last:border-b-0">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-orange-500" />
      <span className="text-xs font-medium text-gray-500 dark:text-[#6E6F76] uppercase tracking-wider">
        {title}
      </span>
    </div>
    <div className="space-y-1">
      {items.map((item, index) => (
        <motion.button
          key={item.id || item.firestoreId || index}
          whileHover={{ x: 4 }}
          onClick={() => onItemClick(item)}
          className="flex items-center justify-between w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-white/[0.05] rounded-lg transition-colors group"
        >
          <div className="flex-1 min-w-0">
            {renderItem(item)}
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 dark:text-[#6E6F76] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
        </motion.button>
      ))}
    </div>
  </div>
);

export default GlobalSearch;
