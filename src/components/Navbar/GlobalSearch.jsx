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
  Clock,
  Gauge,
  Wrench,
  CircleDot,
  History,
  ChevronRight,
  RefreshCw
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
  const dropdownRef = useRef(null);
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
  const [maxResultsHeight, setMaxResultsHeight] = useState(420);

  // Calculate max height based on viewport - adapts to any screen size
  useEffect(() => {
    const calculateMaxHeight = () => {
      const dropdownTop = 72; // Fixed top position of dropdown
      const headerHeight = 52; // Search input height (~52px)
      const tabsHeight = 44; // Category tabs height (~44px)
      const footerPadding = 24; // Bottom padding/margin
      const safeMargin = 20; // Extra safety margin from bottom of screen
      
      const viewportHeight = window.innerHeight;
      const availableHeight = viewportHeight - dropdownTop - headerHeight - tabsHeight - footerPadding - safeMargin;
      
      // Minimum 200px, maximum 600px, otherwise use available space
      const calculatedHeight = Math.max(200, Math.min(600, availableHeight));
      setMaxResultsHeight(calculatedHeight);
    };

    calculateMaxHeight();
    window.addEventListener('resize', calculateMaxHeight);
    
    return () => window.removeEventListener('resize', calculateMaxHeight);
  }, [isOpen]);

  // Theme
  const { isDarkMode } = useThemeStore();

  // Stores
  const { clients = [], fetchClients } = useClientStore();
  const { vehicles = [], fetchVehicles } = useVehicleStore();
  const { checkins = [], fetchCheckins } = useCheckinStore();
  const { parts = [], fetchParts } = useInventoryStore();
  const { budgets = [], fetchBudgets } = useBudgetStore();
  
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Load data when search opens if stores are empty
  useEffect(() => {
    const loadDataIfNeeded = async () => {
      if (!isOpen) return;
      
      const needsLoading = clients.length === 0 || vehicles.length === 0 || checkins.length === 0;
      
      if (needsLoading) {
        setIsLoadingData(true);
        try {
          await Promise.all([
            clients.length === 0 && fetchClients ? fetchClients() : Promise.resolve(),
            vehicles.length === 0 && fetchVehicles ? fetchVehicles() : Promise.resolve(),
            checkins.length === 0 && fetchCheckins ? fetchCheckins() : Promise.resolve(),
            parts.length === 0 && fetchParts ? fetchParts() : Promise.resolve(),
            budgets.length === 0 && fetchBudgets ? fetchBudgets() : Promise.resolve()
          ]);
          } catch (error) {
          console.error('[GlobalSearch] Error loading data:', error);
        } finally {
          setIsLoadingData(false);
        }
      }
    };
    
    loadDataIfNeeded();
  }, [isOpen, clients.length, vehicles.length, checkins.length, parts.length, budgets.length, fetchClients, fetchVehicles, fetchCheckins, fetchParts, fetchBudgets]);

  // Debug: Log store data on mount and changes
  useEffect(() => {
    }, [clients, vehicles, checkins, parts, budgets]);

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

  // Auto-switch to category with results when current category is empty
  useEffect(() => {
    if (activeCategory === 'all' || totalResults === 0) return;
    
    // Check if current category has results
    const currentCategoryHasResults = 
      (activeCategory === 'clients' && results.clients.length > 0) ||
      (activeCategory === 'vehicles' && results.vehicles.length > 0) ||
      (activeCategory === 'checkins' && results.checkins.length > 0) ||
      (activeCategory === 'inventory' && results.inventory.length > 0) ||
      (activeCategory === 'budgets' && results.budgets.length > 0);
    
    // If current category is empty but there are results elsewhere, switch to first category with results
    if (!currentCategoryHasResults && totalResults > 0) {
      if (results.clients.length > 0) {
        setActiveCategory('clients');
      } else if (results.vehicles.length > 0) {
        setActiveCategory('vehicles');
      } else if (results.checkins.length > 0) {
        setActiveCategory('checkins');
      } else if (results.inventory.length > 0) {
        setActiveCategory('inventory');
      } else if (results.budgets.length > 0) {
        setActiveCategory('budgets');
      } else {
        setActiveCategory('all');
      }
    }
  }, [results, activeCategory, totalResults]);

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

  // Close on click outside - usando mousedown para capturar antes de qualquer outro evento
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      // Usar setTimeout para evitar que o clique que abriu o dropdown o feche imediatamente
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

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

  // Intelligent fuzzy search function with scoring
  const fuzzyMatch = useCallback((text, searchTerm) => {
    if (!text || !searchTerm) return false;
    
    // Normalize both text and search term
    const normalizeText = (str) => {
      return String(str)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[.\-\/\(\)\s]/g, '');   // Remove punctuation: . - / ( ) and spaces
    };
    
    const normalizedText = normalizeText(text);
    const normalizedSearch = normalizeText(searchTerm);
    
    // Direct inclusion (normalized - finds CPF/CNPJ/phone/plate regardless of format)
    if (normalizedText.includes(normalizedSearch)) return true;
    
    // Also try with original text (lowercase only) for word matching
    const textLower = String(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const searchLower = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    if (textLower.includes(searchLower)) return true;
    
    // Word-by-word matching
    const searchWords = searchLower.split(/\s+/);
    const textWords = textLower.split(/\s+/);
    
    return searchWords.every(searchWord => 
      textWords.some(textWord => textWord.includes(searchWord) || textWord.startsWith(searchWord))
    );
  }, []);

  // Get owner info for a vehicle
  const getVehicleOwner = useCallback((vehicle) => {
    // Try to find owner from clients
    const owner = clients.find(client => {
      if (!client.vehicles) return false;
      return client.vehicles.some(v => 
        v.plate === vehicle.plate || 
        v.id === vehicle.id ||
        v.vehicleId === vehicle.vehicleId
      );
    });
    
    // If not found in clients, try to find from checkins
    if (!owner) {
      const checkin = checkins.find(c => 
        c.vehiclePlate === vehicle.plate ||
        c.vehicleId === vehicle.id
      );

      if (checkin) {
        return { name: checkin.clientName, fromCheckin: true };
      }
    }
    
    return owner ? { name: owner.name, id: owner.id || owner.firestoreId } : null;
  }, [clients, checkins]);

  // Search function - Intelligent, comprehensive and cross-referenced
  const performSearch = useCallback((term) => {
    if (!term || term.length < 2) {
      setResults({ clients: [], vehicles: [], checkins: [], inventory: [], budgets: [] });
      return;
    }

    setIsSearching(true);
    const searchTerm = term.trim();

    // ============================================
    // 1. SEARCH CLIENTS - Direct match
    // ============================================
    const clientResults = clients.filter(client => {
      if (!client) return false;
      return (
        fuzzyMatch(client.name, searchTerm) ||
        fuzzyMatch(client.phone, searchTerm) ||
        fuzzyMatch(client.cpf, searchTerm) ||
        fuzzyMatch(client.cnpj, searchTerm) ||
        fuzzyMatch(client.email, searchTerm) ||
        fuzzyMatch(client.clientId, searchTerm) ||
        fuzzyMatch(client.address, searchTerm)
      );
    }).slice(0, 5);

    // ============================================
    // 2. SEARCH VEHICLES - Direct + Cross-reference from checkins
    // ============================================
    
    // Direct vehicle search
    const directVehicleResults = vehicles.filter(vehicle => {
      if (!vehicle) return false;
      return (
        fuzzyMatch(vehicle.plate, searchTerm) ||
        fuzzyMatch(vehicle.brand, searchTerm) ||
        fuzzyMatch(vehicle.model, searchTerm) ||
        fuzzyMatch(vehicle.vehicleId, searchTerm) ||
        fuzzyMatch(vehicle.color, searchTerm) ||
        fuzzyMatch(vehicle.year, searchTerm) ||
        fuzzyMatch(vehicle.chassis, searchTerm) ||
        fuzzyMatch(vehicle.renavam, searchTerm) ||
        fuzzyMatch(`${vehicle.brand} ${vehicle.model}`, searchTerm)
      );
    });

    // Cross-reference: Find vehicles from checkins that match the search
    const vehiclesFromCheckins = checkins
      .filter(checkin => {
        if (!checkin) return false;
        return (
          fuzzyMatch(checkin.vehicleBrand, searchTerm) ||
          fuzzyMatch(checkin.vehicleModel, searchTerm) ||
          fuzzyMatch(`${checkin.vehicleBrand} ${checkin.vehicleModel}`, searchTerm)
        );
      })
      .map(checkin => ({
        plate: checkin.vehiclePlate,
        brand: checkin.vehicleBrand,
        model: checkin.vehicleModel,
        year: checkin.vehicleYear,
        color: checkin.vehicleColor,
        _fromCheckin: true,
        _clientName: checkin.clientName,
        _checkinId: checkin.firestoreId || checkin.id
      }))
      .filter(v => v.plate); // Only include if has plate

    // Cross-reference: Find vehicles from client records
    const vehiclesFromClients = clients
      .flatMap(client => {
        if (!client.vehicles) return [];
        return client.vehicles
          .filter(v => {
            return (
              fuzzyMatch(v.brand, searchTerm) ||
              fuzzyMatch(v.model, searchTerm) ||
              fuzzyMatch(`${v.brand} ${v.model}`, searchTerm) ||
              fuzzyMatch(v.plate, searchTerm)
            );
          })
          .map(v => ({
            ...v,
            _fromClient: true,
            _clientName: client.name,
            _clientId: client.id || client.firestoreId
          }));
      });

    // Merge and deduplicate vehicles by plate
    const allVehicles = [...directVehicleResults, ...vehiclesFromCheckins, ...vehiclesFromClients];
    const vehicleMap = new Map();
    
    allVehicles.forEach(vehicle => {
      const plate = vehicle.plate?.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (!plate) return;
      
      const existing = vehicleMap.get(plate);
      if (!existing) {
        // Enrich with owner info if not already present
        if (!vehicle._clientName) {
          const owner = getVehicleOwner(vehicle);
          if (owner) {
            vehicle._clientName = owner.name;
            vehicle._clientId = owner.id;
          }
        }
        vehicleMap.set(plate, vehicle);
      } else {
        // Merge info - prefer more complete data
        if (!existing._clientName && vehicle._clientName) {
          existing._clientName = vehicle._clientName;
          existing._clientId = vehicle._clientId;
        }
        if (!existing.brand && vehicle.brand) existing.brand = vehicle.brand;
        if (!existing.model && vehicle.model) existing.model = vehicle.model;
        if (!existing.year && vehicle.year) existing.year = vehicle.year;
        if (!existing.color && vehicle.color) existing.color = vehicle.color;
      }
    });

    const vehicleResults = Array.from(vehicleMap.values()).slice(0, 8);

    // ============================================
    // 3. SEARCH CHECK-INS - Multiple fields
    // ============================================
    const checkinResults = checkins.filter(checkin => {
      if (!checkin) return false;
      return (
        fuzzyMatch(checkin.clientName, searchTerm) ||
        fuzzyMatch(checkin.vehiclePlate, searchTerm) ||
        fuzzyMatch(checkin.id, searchTerm) ||
        fuzzyMatch(checkin.firestoreId, searchTerm) ||
        fuzzyMatch(checkin.vehicleBrand, searchTerm) ||
        fuzzyMatch(checkin.vehicleModel, searchTerm) ||
        fuzzyMatch(checkin.complaint, searchTerm) ||
        fuzzyMatch(checkin.observations, searchTerm) ||
        fuzzyMatch(`${checkin.vehicleBrand} ${checkin.vehicleModel}`, searchTerm)
      );
    }).slice(0, 8);

    // ============================================
    // 4. SEARCH INVENTORY - Multiple fields + synonyms
    // ============================================
    const inventoryResults = parts.filter(part => {
      if (!part) return false;
      return (
        fuzzyMatch(part.name, searchTerm) ||
        fuzzyMatch(part.partId, searchTerm) ||
        fuzzyMatch(part.brand, searchTerm) ||
        fuzzyMatch(part.category, searchTerm) ||
        fuzzyMatch(part.code, searchTerm) ||
        fuzzyMatch(part.sku, searchTerm) ||
        fuzzyMatch(part.description, searchTerm) ||
        fuzzyMatch(part.supplier, searchTerm) ||
        fuzzyMatch(part.partNumber, searchTerm)
      );
    }).slice(0, 5);

    // ============================================
    // 5. SEARCH BUDGETS - Multiple fields + cross-reference
    // ============================================
    const budgetResults = budgets.filter(budget => {
      if (!budget) return false;
      return (
        fuzzyMatch(budget.budgetNumber, searchTerm) ||
        fuzzyMatch(budget.clientName, searchTerm) ||
        fuzzyMatch(budget.id, searchTerm) ||
        fuzzyMatch(budget.firestoreId, searchTerm) ||
        fuzzyMatch(budget.vehiclePlate, searchTerm) ||
        fuzzyMatch(budget.vehicleBrand, searchTerm) ||
        fuzzyMatch(budget.vehicleModel, searchTerm) ||
        fuzzyMatch(budget.description, searchTerm) ||
        fuzzyMatch(`${budget.vehicleBrand} ${budget.vehicleModel}`, searchTerm)
      );
    }).slice(0, 5);

    const newResults = {
      clients: clientResults,
      vehicles: vehicleResults,
      checkins: checkinResults,
      inventory: inventoryResults,
      budgets: budgetResults
    };

    setResults(newResults);
    setIsSearching(false);
  }, [clients, vehicles, checkins, parts, budgets, fuzzyMatch, getVehicleOwner]);

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

  // Formatters
  const formatCPF = (cpf) => {
    if (!cpf) return '';
    const cleaned = String(cpf).replace(/\D/g, '');
    if (cleaned.length !== 11) return cpf;
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatCNPJ = (cnpj) => {
    if (!cnpj) return '';
    const cleaned = String(cnpj).replace(/\D/g, '');
    if (cleaned.length !== 14) return cnpj;
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = String(phone).replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  const formatPlate = (plate) => {
    if (!plate) return '';
    const cleaned = String(plate).toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleaned.length === 7) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    }
    return plate.toUpperCase();
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'in-progress': { label: 'Em andamento', color: '#F97316', bg: '#FFF7ED' },
      'completed': { label: 'Concluído', color: '#10B981', bg: '#ECFDF5' },
      'pending': { label: 'Pendente', color: '#F59E0B', bg: '#FFFBEB' },
      'cancelled': { label: 'Cancelado', color: '#EF4444', bg: '#FEF2F2' }
    };
    return statusMap[status] || { label: status, color: '#6B7280', bg: '#F3F4F6' };
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Dropdown Premium - Centralizado abaixo da barra de busca */}
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
        className={`
          fixed z-50 rounded-2xl overflow-hidden
          ${isDarkMode 
            ? 'border border-[#2A2D38]' 
            : 'border border-gray-200'
          }
        `}
        style={{
          top: '72px',
          left: '0',
          right: '0',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
          maxWidth: '720px',
          backgroundColor: isDarkMode ? '#16181F' : '#FFFFFF',
          boxShadow: isDarkMode 
            ? '0 24px 48px -12px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(0, 0, 0, 0.5)' 
            : '0 24px 48px -12px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.06)'
        }}
      >
          {/* Search Input Premium - Compact */}
          <div 
            className={`flex items-center px-4 py-3 border-b ${isDarkMode ? 'border-[#2A2D38]' : 'border-gray-100'}`}
            style={{ backgroundColor: isDarkMode ? '#16181F' : '#FFFFFF' }}
          >
            <div className={`p-2 rounded-lg mr-3 ${isDarkMode ? 'bg-[#F97316]/15' : 'bg-[#FFF7ED]'}`}>
              <Search className="w-4 h-4 text-[#F97316]" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar clientes, veículos, check-ins..."
              className={`
                flex-1 bg-transparent outline-none text-sm font-medium
                ${isDarkMode 
                  ? 'text-[#F1F1F3] placeholder-[#5C5F6A]' 
                  : 'text-[#1A1A1A] placeholder-[#9CA3AF]'
                }
              `}
            />
            {isSearching && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Gauge className="w-4 h-4 text-[#F97316]" />
              </motion.div>
            )}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-[#252830]' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-4 h-4 ${isDarkMode ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`} />
              </button>
            )}
          </div>

          {/* Category Tabs - Compact */}
          {searchTerm.length >= 2 && totalResults > 0 && (
            <div 
              className={`flex items-center gap-1.5 px-4 py-2 border-b overflow-x-auto scrollbar-hide ${isDarkMode ? 'border-[#2A2D38]' : 'border-gray-100'}`}
              style={{ backgroundColor: isDarkMode ? '#1A1D25' : '#FAFAFA' }}
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all
                    ${activeCategory === cat.id
                      ? 'bg-[#F97316] text-white'
                      : isDarkMode 
                        ? 'text-[#8B8F9A] hover:bg-[#252830] hover:text-[#E5E7EB]' 
                        : 'text-[#6B7280] hover:bg-gray-200 hover:text-[#374151]'
                    }
                  `}
                >
                  {cat.icon && <cat.icon className="w-3.5 h-3.5" />}
                  {cat.label}
                  {cat.count > 0 && (
                    <span className={`
                      text-[10px] px-1 py-0.5 rounded font-bold
                      ${activeCategory === cat.id
                        ? 'bg-white/20'
                        : isDarkMode ? 'bg-[#2A2D38]' : 'bg-gray-200'
                      }
                    `}>
                      {cat.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Results */}
          <div 
            ref={resultsRef} 
            className="overflow-y-auto"
            style={{ 
              maxHeight: `${maxResultsHeight}px`,
              backgroundColor: isDarkMode ? '#16181F' : '#FFFFFF' 
            }}
          >
            {/* Empty State - Premium Automotive Design */}
            {!searchTerm && recentSearches.length === 0 && (
              <div className="p-6 text-center">
                {/* Loading State */}
                {isLoadingData ? (
                  <div className="py-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="w-10 h-10 mx-auto mb-3"
                    >
                      <RefreshCw className="w-10 h-10 text-[#F97316]" />
                    </motion.div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-[#8B8F9A]' : 'text-[#6B7280]'}`}>
                      Carregando dados...
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Compact Icon Cluster */}
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`
                          absolute inset-0 m-auto w-14 h-14 rounded-xl flex items-center justify-center
                          ${isDarkMode 
                            ? 'bg-[#F97316]/15 border border-[#F97316]/25' 
                            : 'bg-[#FFF7ED] border border-[#FDBA74]'
                          }
                        `}
                      >
                        <Gauge className="w-7 h-7 text-[#F97316]" />
                      </motion.div>
                      
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className={`
                          absolute -top-0.5 -right-0.5 w-7 h-7 rounded-lg flex items-center justify-center
                          ${isDarkMode ? 'bg-[#1E2028] border border-[#2A2D38]' : 'bg-white border border-gray-200 shadow-sm'}
                        `}
                      >
                        <Car className="w-3.5 h-3.5 text-[#3B82F6]" />
                      </motion.div>
                      
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.15 }}
                        className={`
                          absolute -bottom-0.5 -left-0.5 w-7 h-7 rounded-lg flex items-center justify-center
                          ${isDarkMode ? 'bg-[#1E2028] border border-[#2A2D38]' : 'bg-white border border-gray-200 shadow-sm'}
                        `}
                      >
                        <Wrench className="w-3.5 h-3.5 text-[#10B981]" />
                      </motion.div>
                    </div>
                    
                    <h3 className={`text-base font-semibold mb-1 ${isDarkMode ? 'text-[#F1F1F3]' : 'text-[#111827]'}`}>
                      Central de Busca
                    </h3>
                    <p className={`text-xs mb-3 ${isDarkMode ? 'text-[#8B8F9A]' : 'text-[#6B7280]'}`}>
                      Encontre clientes, veículos, check-ins, peças e orçamentos
                    </p>
                    
                    {/* Compact Data Pills */}
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {[
                        { icon: User, count: clients.length, color: '#3B82F6' },
                        { icon: Car, count: vehicles.length, color: '#10B981' },
                        { icon: ClipboardList, count: checkins.length, color: '#F97316' },
                        { icon: Package, count: parts.length, color: '#8B5CF6' }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className={`
                            flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold
                            ${isDarkMode 
                              ? 'bg-[#1E2028] text-[#A1A5B0] border border-[#2A2D38]' 
                              : 'bg-gray-50 text-[#4B5563] border border-gray-200'
                            }
                          `}
                        >
                          <item.icon className="w-3 h-3" style={{ color: item.color }} />
                          <span>{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Recent Searches Premium */}
            {!searchTerm && recentSearches.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <History className={`w-3.5 h-3.5 ${isDarkMode ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                    Recentes
                  </span>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((term, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`
                        flex items-center gap-2.5 w-full px-3 py-2 rounded-lg transition-all group cursor-pointer
                        ${isDarkMode 
                          ? 'hover:bg-[#1E2028]' 
                          : 'hover:bg-gray-50'
                        }
                      `}
                      onClick={() => setSearchTerm(term)}
                    >
                      <Clock className={`w-3.5 h-3.5 ${isDarkMode ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`} />
                      <span className={`flex-1 text-sm ${isDarkMode ? 'text-[#D1D5DB]' : 'text-[#374151]'}`}>
                        {term}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentSearch(term);
                        }}
                        className={`
                          p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity
                          ${isDarkMode ? 'hover:bg-[#2A2D38] text-[#6B7280]' : 'hover:bg-gray-200 text-[#9CA3AF]'}
                        `}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results Premium */}
            {searchTerm.length >= 2 && totalResults === 0 && !isSearching && (
              <div className="p-6 text-center">
                <div className={`
                  w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center
                  ${isDarkMode ? 'bg-[#1E2028]' : 'bg-gray-100'}
                `}>
                  <CircleDot className={`w-6 h-6 ${isDarkMode ? 'text-[#4B5563]' : 'text-[#D1D5DB]'}`} />
                </div>
                <p className={`text-sm font-medium mb-0.5 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
                  Nenhum resultado
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                  Tente outros termos de busca
                </p>
              </div>
            )}

            {/* Clients */}
            {filteredResults.clients.length > 0 && (
              <ResultSection
                title="Clientes"
                icon={User}
                iconColor="#3B82F6"
                items={filteredResults.clients}
                onItemClick={(item) => handleResultClick('client', item)}
                isDarkMode={isDarkMode}
                renderItem={(client) => {
                  const vehicleCount = client.vehicles?.length || 0;
                  const lastVehicle = client.vehicles?.[0];
                  return (
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                        ${isDarkMode ? 'bg-[#3B82F6]/15' : 'bg-blue-50'}
                      `}>
                        <User className="w-4 h-4 text-[#3B82F6]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold truncate ${isDarkMode ? 'text-[#F1F1F3]' : 'text-[#111827]'}`}>
                          {client.name}
                        </div>
                        <div className={`flex items-center gap-2 text-xs flex-wrap ${isDarkMode ? 'text-[#8B8F9A]' : 'text-[#6B7280]'}`}>
                          {client.phone && <span>{formatPhone(client.phone)}</span>}
                          {client.cpf && <span className="opacity-60">• {formatCPF(client.cpf)}</span>}
                          {client.cnpj && !client.cpf && <span className="opacity-60">• {formatCNPJ(client.cnpj)}</span>}
                          {vehicleCount > 0 && (
                            <span className="flex items-center gap-1">
                              <span className="opacity-60">•</span>
                              <Car className="w-3 h-3 text-[#10B981]" />
                              <span className="text-[#10B981]">
                                {vehicleCount === 1 
                                  ? `${lastVehicle?.brand || ''} ${lastVehicle?.model || ''}`.trim() || '1 veículo'
                                  : `${vehicleCount} veículos`
                                }
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            )}

            {/* Vehicles */}
            {filteredResults.vehicles.length > 0 && (
              <ResultSection
                title="Veículos"
                icon={Car}
                iconColor="#10B981"
                items={filteredResults.vehicles}
                onItemClick={(item) => handleResultClick('vehicle', item)}
                isDarkMode={isDarkMode}
                renderItem={(vehicle) => (
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                      ${isDarkMode ? 'bg-[#10B981]/15' : 'bg-emerald-50'}
                    `}>
                      <Car className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold truncate ${isDarkMode ? 'text-[#F1F1F3]' : 'text-[#111827]'}`}>
                          {vehicle.brand} {vehicle.model}
                        </span>
                        <span className={`
                          font-mono text-xs px-1.5 py-0.5 rounded font-medium
                          ${isDarkMode ? 'bg-[#252830] text-[#A1A5B0]' : 'bg-gray-100 text-[#4B5563]'}
                        `}>
                          {formatPlate(vehicle.plate)}
                        </span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-[#8B8F9A]' : 'text-[#6B7280]'}`}>
                        {vehicle.year && <span>{vehicle.year}</span>}
                        {vehicle.color && <span className="opacity-60">• {vehicle.color}</span>}
                        {vehicle._clientName && (
                          <span className="flex items-center gap-1">
                            <span className="opacity-60">•</span>
                            <User className="w-3 h-3 opacity-60" />
                            <span className="text-[#3B82F6] font-medium">{vehicle._clientName}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              />
            )}

            {/* Check-ins */}
            {filteredResults.checkins.length > 0 && (
              <ResultSection
                title="Check-ins"
                icon={ClipboardList}
                iconColor="#F97316"
                items={filteredResults.checkins}
                onItemClick={(item) => handleResultClick('checkin', item)}
                isDarkMode={isDarkMode}
                renderItem={(checkin) => {
                  const status = getStatusBadge(checkin.status);
                  return (
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                        ${isDarkMode ? 'bg-[#F97316]/15' : 'bg-orange-50'}
                      `}>
                        <ClipboardList className="w-4 h-4 text-[#F97316]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold truncate ${isDarkMode ? 'text-[#F1F1F3]' : 'text-[#111827]'}`}>
                            {checkin.clientName}
                          </span>
                          <span 
                            className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                            style={{ 
                              backgroundColor: isDarkMode ? `${status.color}20` : status.bg,
                              color: status.color 
                            }}
                          >
                            {status.label}
                          </span>
                        </div>
                        <div className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-[#8B8F9A]' : 'text-[#6B7280]'}`}>
                          <span className="font-mono font-medium">{formatPlate(checkin.vehiclePlate)}</span>
                          {checkin.vehicleBrand && <span className="opacity-60">• {checkin.vehicleBrand} {checkin.vehicleModel}</span>}
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            )}

            {/* Inventory */}
            {filteredResults.inventory.length > 0 && (
              <ResultSection
                title="Estoque"
                icon={Package}
                iconColor="#8B5CF6"
                items={filteredResults.inventory}
                onItemClick={(item) => handleResultClick('inventory', item)}
                isDarkMode={isDarkMode}
                renderItem={(part) => (
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                      ${isDarkMode ? 'bg-[#8B5CF6]/15' : 'bg-purple-50'}
                    `}>
                      <Package className="w-4 h-4 text-[#8B5CF6]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold truncate ${isDarkMode ? 'text-[#F1F1F3]' : 'text-[#111827]'}`}>
                        {part.name}
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-[#8B8F9A]' : 'text-[#6B7280]'}`}>
                        {part.brand && <span>{part.brand}</span>}
                        <span className={`
                          px-1.5 py-0.5 rounded font-medium
                          ${(part.currentStock || part.quantity || 0) > 0 
                            ? isDarkMode ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-emerald-50 text-emerald-600'
                            : isDarkMode ? 'bg-[#EF4444]/15 text-[#EF4444]' : 'bg-red-50 text-red-600'
                          }
                        `}>
                          {part.currentStock || part.quantity || 0} un
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              />
            )}

            {/* Budgets */}
            {filteredResults.budgets.length > 0 && (
              <ResultSection
                title="Orçamentos"
                icon={FileText}
                iconColor="#EC4899"
                items={filteredResults.budgets}
                onItemClick={(item) => handleResultClick('budget', item)}
                isDarkMode={isDarkMode}
                renderItem={(budget) => (
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                      ${isDarkMode ? 'bg-[#EC4899]/15' : 'bg-pink-50'}
                    `}>
                      <FileText className="w-4 h-4 text-[#EC4899]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#F1F1F3]' : 'text-[#111827]'}`}>
                          {budget.budgetNumber || `#${budget.id?.slice(-6)}`}
                        </span>
                        <span className={`text-sm font-semibold text-[#10B981]`}>
                          {formatCurrency(budget.total)}
                        </span>
                      </div>
                      <div className={`text-xs truncate ${isDarkMode ? 'text-[#8B8F9A]' : 'text-[#6B7280]'}`}>
                        {budget.clientName}
                        {budget.vehiclePlate && <span className="opacity-60"> • {formatPlate(budget.vehiclePlate)}</span>}
                      </div>
                    </div>
                  </div>
                )}
              />
            )}
          </div>

          {/* Footer Premium - Compact */}
          <div 
            className={`px-4 py-2.5 border-t ${isDarkMode ? 'border-[#2A2D38]' : 'border-gray-100'}`}
            style={{ backgroundColor: isDarkMode ? '#1A1D25' : '#FAFAFA' }}
          >
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5">
                <kbd className={`
                  px-1.5 py-0.5 rounded font-semibold
                  ${isDarkMode ? 'bg-[#252830] text-[#8B8F9A]' : 'bg-white text-[#6B7280] border border-gray-200'}
                `}>ESC</kbd>
                <span className={isDarkMode ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}>fechar</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <kbd className={`px-1.5 py-0.5 rounded font-semibold ${isDarkMode ? 'bg-[#252830] text-[#8B8F9A]' : 'bg-white text-[#6B7280] border border-gray-200'}`}>↑↓</kbd>
                  <span className={isDarkMode ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}>navegar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className={`px-1.5 py-0.5 rounded font-semibold ${isDarkMode ? 'bg-[#252830] text-[#8B8F9A]' : 'bg-white text-[#6B7280] border border-gray-200'}`}>↵</kbd>
                  <span className={isDarkMode ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}>abrir</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Result Section Component - Premium Compact Design
const ResultSection = ({ title, icon: Icon, iconColor, items, onItemClick, renderItem, isDarkMode }) => (
  <div 
    className={`px-3 py-2 ${isDarkMode ? 'border-b border-[#2A2D38] last:border-b-0' : 'border-b border-gray-100 last:border-b-0'}`}
    style={{ backgroundColor: isDarkMode ? '#16181F' : '#FFFFFF' }}
  >
    <div className="flex items-center gap-2 mb-1.5 px-1">
      <Icon className="w-3 h-3" style={{ color: iconColor }} />
      <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
        {title}
      </span>
      <div className={`h-px flex-1 ${isDarkMode ? 'bg-[#2A2D38]' : 'bg-gray-100'}`} />
    </div>
    <div className="space-y-0.5">
      {items.map((item, index) => (
        <motion.button
          key={item.id || item.firestoreId || index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.02 }}
          onClick={() => onItemClick(item)}
          className={`
            flex items-center justify-between w-full px-2 py-2 text-left rounded-lg transition-all group
            ${isDarkMode 
              ? 'hover:bg-[#1E2028]' 
              : 'hover:bg-gray-50'
            }
          `}
        >
          <div className="flex-1 min-w-0">
            {renderItem(item)}
          </div>
          <ChevronRight className={`
            w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2
            ${isDarkMode ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}
          `} />
        </motion.button>
      ))}
    </div>
  </div>
);

export default GlobalSearch;
