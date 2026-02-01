/**
 * BudgetsPageSober - Experiência Premium Sóbria
 * 
 * DESIGN PHILOSOPHY:
 * - Profundidade máxima (6 camadas de sombra)
 * - Paleta neutra e elegante
 * - Ícones únicos mas discretos
 * - Sem cores vibrantes
 * - Premium sem ser colorido
 * - Apple-like minimalista
 */

import { useState, useEffect, memo, useCallback, lazy, Suspense } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Send, Edit3, CheckCircle, FileText, 
  Calendar, DollarSign, User, Clock, Package, Receipt,
  ChevronLeft, ChevronRight, RefreshCw, Filter, X, AlertCircle, Layers
} from 'lucide-react';
import { useBudgetStore } from '../store/budgetStore';
import { getBrandLogoUrl, getEffectiveBrand, getBrandInitials } from '../utils/vehicleBrandLogos';
import toast from 'react-hot-toast';

// Lazy load modals
const CreateBudgetRoute = lazy(() => import('../features/budget/routes/create').then(m => ({ default: m.CreateBudgetRoute })));
const EditBudgetRoute = lazy(() => import('../features/budget/routes/edit').then(m => ({ default: m.EditBudgetRoute })));
const SendBudgetModal = lazy(() => import('./budgets/components/SendBudgetModal'));
const CheckinFromBudgetModal = lazy(() => import('./budgets/components/CheckinFromBudgetModal'));

// Format currency
const formatCurrency = (value) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

// Format date
const formatDate = (date) => {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
};

// Get days ago
const getDaysAgo = (date) => {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  return `${diff} dias atrás`;
};

// Budget Card Component (memoized)
const BudgetCard = memo(({ budget, onEdit, onSend, onCheckin, onReactivate, index }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return { 
          label: 'Aprovado', 
          icon: CheckCircle, 
          color: 'text-green-700 dark:text-green-300',
          bg: 'bg-green-50 dark:bg-green-900/30',
          border: 'border-green-200 dark:border-green-700',
          accent: 'text-green-900 dark:text-green-100'
        };
      case 'sent':
        return { 
          label: 'Enviado', 
          icon: Send, 
          color: 'text-blue-700 dark:text-blue-300',
          bg: 'bg-blue-50 dark:bg-blue-900/30',
          border: 'border-blue-200 dark:border-blue-700',
          accent: 'text-blue-900 dark:text-blue-100'
        };
      case 'rejected':
        return { 
          label: 'Rejeitado', 
          icon: X, 
          color: 'text-orange-700 dark:text-orange-300',
          bg: 'bg-orange-50 dark:bg-orange-900/30',
          border: 'border-orange-200 dark:border-orange-700',
          accent: 'text-orange-900 dark:text-orange-100'
        };
      case 'expired':
        return { 
          label: 'Expirado', 
          icon: AlertCircle, 
          color: 'text-red-700 dark:text-red-300',
          bg: 'bg-red-50 dark:bg-red-900/30',
          border: 'border-red-200 dark:border-red-700',
          accent: 'text-red-900 dark:text-red-100'
        };
      case 'draft':
      case 'pending':
      default:
        return { 
          label: 'Pendente', 
          icon: Clock, 
          color: 'text-gray-700 dark:text-gray-300',
          bg: 'bg-gray-50 dark:bg-gray-800/50',
          border: 'border-gray-200 dark:border-gray-700',
          accent: 'text-gray-900 dark:text-gray-100'
        };
    }
  };

  const statusConfig = getStatusConfig(budget.status);
  const StatusIcon = statusConfig.icon;

  // Get brand logo
  const effectiveBrand = getEffectiveBrand(budget.vehicleBrand, budget.vehicleModel);
  const logoUrl = getBrandLogoUrl(effectiveBrand, budget.vehicleModel);
  const brandInitials = getBrandInitials(effectiveBrand, budget.vehicleModel);
  
  // Generate simple sequential number (1, 2, 3...)
  const displayNumber = (index + 1).toString().padStart(3, '0');
  
  // Specific logo sizes for budget cards (independent from checkin)
  // Reference: Volkswagen looks good at base size
  // Small logos need significant increase to match VW visual weight
  const getLogoSize = (brand) => {
    const normalizedBrand = brand?.toLowerCase().trim() || '';
    
    // JAC needs 220% increase (138px) - AUMENTADO EM 20%
    if (normalizedBrand === 'jac' || normalizedBrand === 'jac motors') {
      return { width: 'w-[138px]', height: 'h-[138px]' }; // 220% - JAC logo
    }
    
    // Brands with small/thin logos need 180% increase (115px)
    const smallLogoBrands = ['yamaha', 'fiat', 'honda', 'hyundai', 'kia'];
    
    // Brands with medium logos need 140% increase (90px)
    const mediumLogoBrands = ['ford', 'chevrolet', 'toyota', 'nissan', 'renault'];
    
    if (smallLogoBrands.includes(normalizedBrand)) {
      return { width: 'w-[115px]', height: 'h-[115px]' }; // 180% - Small logos
    }
    
    if (mediumLogoBrands.includes(normalizedBrand)) {
      return { width: 'w-[90px]', height: 'h-[90px]' }; // 140% - Medium logos
    }
    
    return { width: 'w-16', height: 'h-16' }; // 64px - VW reference size
  };
  
  const logoSize = getLogoSize(effectiveBrand);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      className="group relative bg-white dark:bg-gray-800/90 rounded-2xl 
                 border border-gray-200/60 dark:border-gray-700/60
                 backdrop-blur-xl
                 overflow-hidden"
      style={{
        boxShadow: `
          0 1px 2px rgba(0,0,0,0.03),
          0 2px 4px rgba(0,0,0,0.03),
          0 4px 8px rgba(0,0,0,0.03),
          0 8px 16px rgba(0,0,0,0.03),
          0 16px 32px rgba(0,0,0,0.03),
          0 0 0 1px rgba(0,0,0,0.02) inset
        `,
      }}
    >
      {/* Hover Glow Effect - Sutil */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 
                   transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(0, 0, 0, 0.02), transparent 60%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Glass Morphism Layer - Sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

      {/* Status Badge - Minimalista */}
      <div className="absolute top-5 right-5 z-20">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full
            ${statusConfig.bg} ${statusConfig.border} border
            backdrop-blur-xl shadow-sm
          `}
        >
          <StatusIcon className={`w-4 h-4 ${statusConfig.accent}`} strokeWidth={2} />
          <span className={`text-xs font-semibold ${statusConfig.color} tracking-wide`}>
            {statusConfig.label}
          </span>
        </motion.div>
      </div>

      {/* Card Content */}
      <div className="relative p-7">
        {/* Header - Número do Orçamento com Hierarquia Premium */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            {/* Ícone menor e mais discreto */}
            <div className="p-2.5 rounded-xl bg-gray-900 dark:bg-gray-700 shadow-lg">
              <Receipt className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            {/* Número maior e mais bold */}
            <span className="text-2xl font-black text-gray-900 dark:text-white font-mono tracking-tight">
              #{displayNumber}
            </span>
          </div>
        </div>

        {/* Cliente - Mais espaçado e proeminente */}
        <div className="mb-7">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-500 dark:text-gray-400" strokeWidth={2.5} />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {budget.clientName}
            </span>
          </div>
        </div>

        {/* Elegant Divider */}
        <div className="relative h-px mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent 
                          dark:from-transparent dark:via-gray-600 dark:to-transparent" />
        </div>

        {/* Logo Centralizada com Informações do Veículo ao Redor */}
        <div className="mb-6">
          {/* Logo da Montadora - Centralizada com tamanho específico */}
          <div className="flex justify-center mb-4">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={effectiveBrand}
                className={`${logoSize.width} ${logoSize.height} object-contain
                           transition-all duration-300`}
                style={{
                  filter: (() => {
                    // Detectar dark mode
                    const isDarkMode = document.documentElement.classList.contains('dark');
                    if (!isDarkMode) return 'none';
                    
                    // Marcas que ficam BRANCAS no dark mode
                    const whiteFilterBrands = ['volkswagen', 'vw', 'ford', 'hyundai', 'subaru', 'mazda', 'mitsubishi', 'suzuki', 'nissan', 'honda', 'toyota'];
                    
                    // Marcas que mantêm CORES no dark mode (JAC, FIAT, Yamaha incluídas)
                    const coloredBrands = ['bmw', 'fiat', 'ferrari', 'lamborghini', 'land rover', 'chevrolet', 'renault', 'mini', 'dodge', 'ram', 'volvo', 'porsche', 'chery', 'jac', 'jac motors', 'audi', 'yamaha', 'mercedes', 'mercedes-benz', 'kia', 'peugeot', 'citroen', 'jeep'];
                    
                    const brandLower = effectiveBrand?.toLowerCase() || '';
                    
                    if (whiteFilterBrands.includes(brandLower)) {
                      return 'brightness(0) invert(1)';
                    }
                    
                    if (coloredBrands.includes(brandLower)) {
                      return 'none';
                    }
                    
                    // Default: branco
                    return 'brightness(0) invert(1)';
                  })()
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            {/* Fallback initials */}
            <div className={`${logoUrl ? 'hidden' : 'flex'} ${logoSize.width} ${logoSize.height} items-center justify-center
                            rounded-xl bg-gray-800 dark:bg-gray-700 shadow-lg`}>
              <span className="text-white font-bold text-lg">
                {brandInitials}
              </span>
            </div>
          </div>

          {/* Informações do Veículo - Centralizadas */}
          <div className="text-center space-y-2">
            <p className="text-base font-bold text-gray-900 dark:text-white">
              {budget.vehicleBrand} {budget.vehicleModel}
            </p>
            <p className="text-sm font-mono font-bold text-gray-600 dark:text-gray-400 tracking-widest">
              {budget.vehiclePlate}
            </p>
          </div>
        </div>

        {/* Elegant Divider */}
        <div className="relative h-px mb-5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent 
                          dark:from-transparent dark:via-gray-600 dark:to-transparent" />
        </div>

        {/* Value and Details */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3 p-4 rounded-xl 
                          bg-gray-50 dark:bg-gray-800/50
                          border border-gray-200/50 dark:border-gray-700/50">
            <div className="p-2.5 rounded-xl bg-gray-900 dark:bg-gray-700 shadow-lg">
              <DollarSign className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-0.5">
                Valor Total
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(budget.total)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <Layers className="w-4 h-4" strokeWidth={2} />
              <span className="font-semibold">{budget.items?.length || 0}</span>
              <span className="font-medium">{budget.items?.length === 1 ? 'item' : 'itens'}</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <Calendar className="w-4 h-4" strokeWidth={2} />
              <span className="font-semibold">{formatDate(budget.createdAt)}</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <Clock className="w-4 h-4" strokeWidth={2} />
              <span className="font-semibold">{getDaysAgo(budget.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Actions - Minimalista */}
        <div className="flex items-center gap-3 pt-5 border-t border-gray-200/50 dark:border-gray-700/50">
          {budget.status === 'pending' && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSend(budget)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5
                         bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600
                         text-white rounded-xl font-semibold text-sm
                         shadow-lg hover:shadow-xl
                         transition-all duration-200"
            >
              <Send className="w-4 h-4" strokeWidth={2} />
              Enviar
            </motion.button>
          )}
          
          {budget.status === 'expired' && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onReactivate(budget)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5
                         bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600
                         text-white rounded-xl font-semibold text-sm
                         shadow-lg hover:shadow-xl
                         transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" strokeWidth={2} />
              Reativar
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onEdit(budget)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5
                       bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-600/50
                       text-gray-700 dark:text-gray-200
                       rounded-xl font-semibold text-sm
                       transition-all duration-200
                       border border-gray-200 dark:border-gray-600"
          >
            <Edit3 className="w-4 h-4" strokeWidth={2} />
            Editar
          </motion.button>

          {budget.status === 'approved' && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCheckin(budget)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5
                         bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600
                         text-white rounded-xl font-semibold text-sm
                         shadow-lg hover:shadow-xl
                         transition-all duration-200"
            >
              <CheckCircle className="w-4 h-4" strokeWidth={2} />
              Check-in
            </motion.button>
          )}
        </div>
      </div>
      {/* Bottom Glow - Sutil */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r 
                      from-transparent via-gray-400/20 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
});

BudgetCard.displayName = 'BudgetCard';

// Stats Card Component
// eslint-disable-next-line no-unused-vars
const StatsCard = memo(({ icon: Icon, label, value, color = 'gray' }) => (
  <div className="bg-white dark:bg-[#141922] rounded-xl p-6
                  border border-gray-200 dark:border-gray-700/60
                  shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-lg bg-gray-100 dark:bg-[#1A1F28]">
        <Icon className="w-6 h-6 text-gray-700 dark:text-white" strokeWidth={2} />
      </div>
    </div>
    <div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
));

StatsCard.displayName = 'StatsCard';

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map(i => (
      <div key={i} className="bg-white dark:bg-[#141922] rounded-xl p-6 
                              border border-gray-200 dark:border-gray-700/60 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-[#1A1F28] rounded w-1/2 mb-4" />
        <div className="h-4 bg-gray-200 dark:bg-[#1A1F28] rounded w-3/4 mb-3" />
        <div className="h-px bg-gray-200 dark:bg-gray-700/60 my-4" />
        <div className="h-4 bg-gray-200 dark:bg-[#1A1F28] rounded w-1/2 mb-3" />
        <div className="h-8 bg-gray-200 dark:bg-[#1A1F28] rounded w-1/3 mb-4" />
        <div className="h-10 bg-gray-200 dark:bg-[#1A1F28] rounded" />
      </div>
    ))}
  </div>
);

// Empty State
const EmptyState = ({ hasFilters, onCreateNew }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20"
  >
    <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-[#141922] 
                    flex items-center justify-center mb-6">
      <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
      Nenhum orçamento encontrado
    </h3>
    <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-md">
      {hasFilters 
        ? 'Tente ajustar os filtros de busca para encontrar o que procura'
        : 'Comece criando seu primeiro orçamento e gerencie suas propostas'}
    </p>
    {!hasFilters && (
      <button
        onClick={onCreateNew}
        className="px-6 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-[#1A1F28] dark:hover:bg-[#252B36]
                   text-white rounded-lg font-medium shadow-lg hover:shadow-xl
                   transition-all duration-200 flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Criar Primeiro Orçamento
      </button>
    )}
  </motion.div>
);

// Main Component
const BudgetsPageSober = () => {
  const budgetStore = useBudgetStore();
  const { budgets, fetchBudgets, isLoading, expireBudget, getStatistics, updateBudget } = budgetStore;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Advanced filters - formato brasileiro
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateFromDisplay, setDateFromDisplay] = useState(''); // dd/mm/yyyy para exibição
  const [dateToDisplay, setDateToDisplay] = useState(''); // dd/mm/yyyy para exibição
  const [dateFromISO, setDateFromISO] = useState(''); // yyyy-mm-dd para filtro
  const [dateToISO, setDateToISO] = useState(''); // yyyy-mm-dd para filtro
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');

  // Converter data brasileira (dd/mm/yyyy) para ISO (yyyy-mm-dd)
  const convertBRtoISO = (brDate) => {
    if (!brDate || brDate.length !== 10) return '';
    const [day, month, year] = brDate.split('/');
    if (!day || !month || !year) return '';
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Converter data ISO (yyyy-mm-dd) para brasileira (dd/mm/yyyy)
  const convertISOtoBR = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    if (!year || !month || !day) return '';
    return `${day}/${month}/${year}`;
  };

  // Handler para input de data brasileira
  const handleDateInput = (value, setter, isoSetter) => {
    // Remove caracteres não numéricos
    let cleaned = value.replace(/\D/g, '');
    
    // Limita a 8 dígitos
    cleaned = cleaned.substring(0, 8);
    
    // Formata dd/mm/yyyy
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = cleaned.substring(0, 2);
      if (cleaned.length >= 4) {
        formatted += '/' + cleaned.substring(2, 4);
        if (cleaned.length >= 5) {
          formatted += '/' + cleaned.substring(4, 8);
        }
      } else if (cleaned.length > 2) {
        formatted += '/' + cleaned.substring(2);
      }
    }
    
    setter(formatted);
    
    // Se data completa, converte para ISO
    if (formatted.length === 10) {
      const iso = convertBRtoISO(formatted);
      isoSetter(iso);
    } else {
      isoSetter('');
    }
  };

  // Handler para date picker
  const handleDatePicker = (isoDate, displaySetter, isoSetter) => {
    isoSetter(isoDate);
    displaySetter(convertISOtoBR(isoDate));
  };

  // Make budgetStore available globally
  useEffect(() => {
    window.budgetStore = budgetStore;
    return () => {
      delete window.budgetStore;
    };
  }, [budgetStore]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  // Check for expired budgets
  useEffect(() => {
    const checkExpiredBudgets = () => {
      const now = new Date();
      budgets.forEach(budget => {
        if ((budget.status === 'pending' || budget.status === 'sent') && new Date(budget.expiresAt) < now) {
          expireBudget(budget.firestoreId);
        }
      });
    };

    checkExpiredBudgets();
    const interval = setInterval(checkExpiredBudgets, 60000);
    return () => clearInterval(interval);
  }, [budgets, expireBudget]);

  const handleCreateBudget = useCallback(() => {
    setSelectedBudget(null);
    setIsModalOpen(true);
  }, []);

  const handleEditBudget = useCallback((budget) => {
    setSelectedBudget(budget);
    setIsModalOpen(true);
  }, []);

  const handleSendBudget = useCallback((budget) => {
    setSelectedBudget(budget);
    setIsSendModalOpen(true);
  }, []);

  const handleCheckinFromBudget = useCallback((budget) => {
    setSelectedBudget(budget);
    setIsCheckinModalOpen(true);
  }, []);

  const handleReactivateBudget = useCallback(async (budget) => {
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours
      
      await updateBudget(budget.firestoreId, {
        status: 'pending',
        expiresAt: expiresAt.toISOString(),
        reactivatedAt: now.toISOString()
      }, 'Orçamento reativado');
      
      toast.success('Orçamento reativado com sucesso!');
      
      // TODO: Enviar no WhatsApp se configurado
      // if (budget.clientPhone && window.whatsappStore) {
      //   await window.whatsappStore.sendBudget(budget);
      // }
      
    } catch (error) {
      toast.error('Erro ao reativar orçamento: ' + error.message);
    }
  }, [updateBudget]);

  // Remove duplicates
  const uniqueBudgets = budgets.reduce((acc, budget) => {
    if (!acc.find(b => b.firestoreId === budget.firestoreId)) {
      acc.push(budget);
    }
    return acc;
  }, []);

  // Advanced filter budgets
  const filteredBudgets = uniqueBudgets.filter(budget => {
    // Status filter - CORRIGIDO: "pending" aceita tanto "pending" quanto "draft"
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending') {
        // Aceita tanto "pending" quanto "draft" como pendente
        if (budget.status !== 'pending' && budget.status !== 'draft') {
          return false;
        }
      } else if (budget.status !== statusFilter) {
        return false;
      }
    }
    
    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch = (
        budget.clientName?.toLowerCase().includes(term) ||
        budget.budgetNumber?.toLowerCase().includes(term) ||
        budget.vehiclePlate?.toLowerCase().includes(term)
      );
      if (!matchesSearch) return false;
    }
    
    // Date range filter - CORRIGIDO para lidar com Timestamp do Firebase
    if (dateFromISO) {
      // Converter createdAt para Date (pode ser Timestamp do Firebase ou string)
      let budgetDate;
      if (budget.createdAt?.toDate) {
        budgetDate = budget.createdAt.toDate();
      } else if (budget.createdAt) {
        budgetDate = new Date(budget.createdAt);
      } else {
        return false; // Sem data, não passa no filtro
      }
      
      const fromDate = new Date(dateFromISO);
      fromDate.setHours(0, 0, 0, 0); // Início do dia
      
      if (budgetDate < fromDate) return false;
    }
    
    if (dateToISO) {
      // Converter createdAt para Date (pode ser Timestamp do Firebase ou string)
      let budgetDate;
      if (budget.createdAt?.toDate) {
        budgetDate = budget.createdAt.toDate();
      } else if (budget.createdAt) {
        budgetDate = new Date(budget.createdAt);
      } else {
        return false; // Sem data, não passa no filtro
      }
      
      const toDate = new Date(dateToISO);
      toDate.setHours(23, 59, 59, 999); // Fim do dia
      
      if (budgetDate > toDate) return false;
    }
    
    // Value range filter
    if (minValue && budget.total < parseFloat(minValue)) {
      return false;
    }
    
    if (maxValue && budget.total > parseFloat(maxValue)) {
      return false;
    }
    
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBudgets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBudgets = filteredBudgets.slice(startIndex, endIndex);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFromISO, dateToISO, minValue, maxValue, itemsPerPage]);

  const hasFilters = searchTerm || statusFilter !== 'all' || dateFromISO || dateToISO || minValue || maxValue;
  const stats = getStatistics();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0E13]">
      {/* Header - Design Limpo Original */}
      <div className="bg-white/95 dark:bg-[#080A0F]/95 backdrop-blur-2xl 
                      border-b border-gray-300 dark:border-gray-700/60
                      sticky top-0 z-40
                      shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-7">
          {/* Title */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-2xl bg-gray-900 dark:bg-gray-700 shadow-lg">
                <Receipt className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Orçamentos
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium ml-16">
              Gerencie suas propostas e acompanhe aprovações
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Primary Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Search */}
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 
                                   text-gray-400 group-focus-within:text-gray-700 dark:group-focus-within:text-white
                                   transition-colors" strokeWidth={2} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por cliente, número ou placa..."
                  className="w-full pl-12 pr-4 py-3.5 
                             bg-white dark:bg-[#141922]
                             border border-gray-900 dark:border-gray-700/60
                             rounded-xl
                             text-gray-900 dark:text-white font-medium
                             placeholder-gray-500 dark:placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600
                             transition-all duration-200"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-5 py-3.5 
                           bg-white dark:bg-[#141922]
                           border border-gray-900 dark:border-gray-700/60
                           rounded-xl
                           text-gray-900 dark:text-white font-semibold
                           focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600
                           transition-all duration-200
                           cursor-pointer"
              >
                <option value="all">Todos os Status</option>
                <option value="pending">Pendente</option>
                <option value="sent">Enviado</option>
                <option value="approved">Aprovado</option>
                <option value="rejected">Rejeitado</option>
                <option value="expired">Expirado</option>
              </select>

              {/* Advanced Filters Toggle */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-5 py-3.5 rounded-xl font-semibold text-sm
                           transition-all duration-200
                           flex items-center gap-2
                           border border-gray-900 dark:border-gray-700/60
                           ${showAdvancedFilters 
                             ? 'bg-gray-900 dark:bg-[#1A1F28] text-white' 
                             : 'bg-white dark:bg-[#141922] text-gray-700 dark:text-white'
                           }`}
              >
                <Filter className="w-4 h-4" strokeWidth={2} />
                Filtros
              </motion.button>

              {/* New Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateBudget}
                className="px-6 py-3.5 bg-gray-900 hover:bg-gray-800 dark:bg-[#1A1F28] dark:hover:bg-[#252B36]
                           text-white font-semibold
                           rounded-xl
                           border border-gray-900 dark:border-gray-700/60
                           shadow-lg hover:shadow-xl
                           transition-all duration-200
                           flex items-center justify-center gap-2.5"
              >
                <Plus className="w-5 h-5" strokeWidth={2} />
                <span className="hidden sm:inline">Novo Orçamento</span>
                <span className="sm:hidden">Novo</span>
              </motion.button>
            </div>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
              {showAdvancedFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#141922] dark:to-[#0B0E13] 
                                  rounded-2xl border border-gray-200 dark:border-gray-700/60
                                  backdrop-blur-xl shadow-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      {/* Date From - Apple Style */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Data Inicial
                        </label>
                        <div className="relative group">
                          <input
                            type="text"
                            value={dateFromDisplay}
                            onChange={(e) => handleDateInput(e.target.value, setDateFromDisplay, setDateFromISO)}
                            placeholder="dd/mm/aaaa"
                            maxLength={10}
                            className="w-full pl-11 pr-11 py-3 rounded-xl
                                       bg-white dark:bg-[#080A0F]
                                       border border-gray-300 dark:border-gray-700/60
                                       text-gray-900 dark:text-white font-medium
                                       placeholder-gray-400
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                                       focus:border-transparent
                                       transition-all duration-200
                                       shadow-sm hover:shadow-md"
                          />
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 
                                               text-gray-400 pointer-events-none" strokeWidth={2} />
                          
                          {/* Date Picker Button */}
                          <label className="absolute right-2 top-1/2 -translate-y-1/2 
                                           p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
                                           cursor-pointer transition-colors">
                            <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" strokeWidth={2} />
                            <input
                              type="date"
                              value={dateFromISO}
                              onChange={(e) => handleDatePicker(e.target.value, setDateFromDisplay, setDateFromISO)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Date To - Apple Style */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Data Final
                        </label>
                        <div className="relative group">
                          <input
                            type="text"
                            value={dateToDisplay}
                            onChange={(e) => handleDateInput(e.target.value, setDateToDisplay, setDateToISO)}
                            placeholder="dd/mm/aaaa"
                            maxLength={10}
                            className="w-full pl-11 pr-11 py-3 rounded-xl
                                       bg-white dark:bg-[#080A0F]
                                       border border-gray-300 dark:border-gray-700/60
                                       text-gray-900 dark:text-white font-medium
                                       placeholder-gray-400
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                                       focus:border-transparent
                                       transition-all duration-200
                                       shadow-sm hover:shadow-md"
                          />
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 
                                               text-gray-400 pointer-events-none" strokeWidth={2} />
                          
                          {/* Date Picker Button */}
                          <label className="absolute right-2 top-1/2 -translate-y-1/2 
                                           p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
                                           cursor-pointer transition-colors">
                            <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" strokeWidth={2} />
                            <input
                              type="date"
                              value={dateToISO}
                              onChange={(e) => handleDatePicker(e.target.value, setDateToDisplay, setDateToISO)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Min Value - Apple Style */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Valor Mínimo
                        </label>
                        <div className="relative group">
                          <input
                            type="number"
                            value={minValue}
                            onChange={(e) => setMinValue(e.target.value)}
                            placeholder="R$ 0,00"
                            className="w-full pl-11 pr-4 py-3 rounded-xl
                                       bg-white dark:bg-[#080A0F]
                                       border border-gray-300 dark:border-gray-700/60
                                       text-gray-900 dark:text-white font-medium
                                       placeholder-gray-400
                                       focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400
                                       focus:border-transparent
                                       transition-all duration-200
                                       shadow-sm hover:shadow-md"
                          />
                          <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 
                                                 text-gray-400 group-focus-within:text-green-500 dark:group-focus-within:text-green-400
                                                 transition-colors" strokeWidth={2} />
                        </div>
                      </div>

                      {/* Max Value - Apple Style */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Valor Máximo
                        </label>
                        <div className="relative group">
                          <input
                            type="number"
                            value={maxValue}
                            onChange={(e) => setMaxValue(e.target.value)}
                            placeholder="R$ 9999,99"
                            className="w-full pl-11 pr-4 py-3 rounded-xl
                                       bg-white dark:bg-[#080A0F]
                                       border border-gray-300 dark:border-gray-700/60
                                       text-gray-900 dark:text-white font-medium
                                       placeholder-gray-400
                                       focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400
                                       focus:border-transparent
                                       transition-all duration-200
                                       shadow-sm hover:shadow-md"
                          />
                          <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 
                                                 text-gray-400 group-focus-within:text-green-500 dark:group-focus-within:text-green-400
                                                 transition-colors" strokeWidth={2} />
                        </div>
                      </div>
                    </div>

                    {/* Clear Filters - Apple Style */}
                    {(dateFromDisplay || dateToDisplay || minValue || maxValue) && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-5 flex justify-end"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setDateFromDisplay('');
                            setDateToDisplay('');
                            setDateFromISO('');
                            setDateToISO('');
                            setMinValue('');
                            setMaxValue('');
                          }}
                          className="px-5 py-2.5 text-sm font-semibold 
                                     text-red-600 dark:text-red-400
                                     hover:text-red-700 dark:hover:text-red-300
                                     bg-red-50 dark:bg-red-900/20
                                     hover:bg-red-100 dark:hover:bg-red-900/30
                                     rounded-xl
                                     transition-all duration-200
                                     flex items-center gap-2
                                     border border-red-200 dark:border-red-800"
                        >
                          <X className="w-4 h-4" strokeWidth={2} />
                          Limpar Filtros
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={FileText}
            label="Total de Orçamentos"
            value={stats.total}
          />
          <StatsCard
            icon={Clock}
            label="Pendentes"
            value={stats.pending}
          />
          <StatsCard
            icon={CheckCircle}
            label="Aprovados"
            value={stats.approved}
          />
          <StatsCard
            icon={DollarSign}
            label="Valor Total"
            value={formatCurrency(stats.totalValue)}
          />
        </div>

        {/* Budgets Grid */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredBudgets.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onCreateNew={handleCreateBudget} />
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginatedBudgets.map((budget, index) => (
                  <BudgetCard
                    key={budget.firestoreId}
                    budget={budget}
                    index={startIndex + index}
                    onEdit={handleEditBudget}
                    onSend={handleSendBudget}
                    onCheckin={handleCheckinFromBudget}
                    onReactivate={handleReactivateBudget}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4
                              p-5 bg-white dark:bg-[#141922] rounded-xl border border-gray-200 dark:border-gray-700/60">
                {/* Items per page selector */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Itens por página:
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="px-3 py-2 rounded-lg
                               bg-gray-50 dark:bg-[#080A0F]
                               border border-gray-200 dark:border-gray-700/60
                               text-gray-900 dark:text-white font-semibold
                               focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600
                               cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={40}>40</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                {/* Page info */}
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mostrando {startIndex + 1} a {Math.min(endIndex, filteredBudgets.length)} de {filteredBudgets.length} orçamentos
                </div>

                {/* Page navigation */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-all duration-200
                               ${currentPage === 1
                                 ? 'bg-gray-100 dark:bg-[#080A0F] text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                 : 'bg-gray-900 dark:bg-[#1A1F28] text-white hover:bg-gray-800 dark:hover:bg-[#252B36]'
                               }`}
                  >
                    <ChevronLeft className="w-5 h-5" strokeWidth={2} />
                  </motion.button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <motion.button
                          key={pageNum}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200
                                     ${currentPage === pageNum
                                       ? 'bg-gray-900 dark:bg-[#1A1F28] text-white'
                                       : 'bg-gray-100 dark:bg-[#080A0F] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#141922]'
                                     }`}
                        >
                          {pageNum}
                        </motion.button>
                      );
                    })}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-all duration-200
                               ${currentPage === totalPages
                                 ? 'bg-gray-100 dark:bg-[#080A0F] text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                 : 'bg-gray-900 dark:bg-[#1A1F28] text-white hover:bg-gray-800 dark:hover:bg-[#252B36]'
                               }`}
                  >
                    <ChevronRight className="w-5 h-5" strokeWidth={2} />
                  </motion.button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <Suspense fallback={null}>
        {isModalOpen && (
          selectedBudget ? (
            <EditBudgetRoute
              isOpen={isModalOpen}
              budgetId={selectedBudget.firestoreId}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedBudget(null);
              }}
              onSuccess={() => {
                fetchBudgets();
                setIsModalOpen(false);
                setSelectedBudget(null);
              }}
            />
          ) : (
            <CreateBudgetRoute
              onClose={() => setIsModalOpen(false)}
            />
          )
        )}
      </Suspense>

      {isSendModalOpen && selectedBudget && (
        <Suspense fallback={null}>
          <SendBudgetModal
            budget={selectedBudget}
            onClose={() => {
              setIsSendModalOpen(false);
              setSelectedBudget(null);
            }}
          />
        </Suspense>
      )}

      {isCheckinModalOpen && selectedBudget && (
        <Suspense fallback={null}>
          <CheckinFromBudgetModal
            budget={selectedBudget}
            onClose={() => {
              setIsCheckinModalOpen(false);
              setSelectedBudget(null);
            }}
          />
        </Suspense>
      )}
    </div>
  );
};

export default BudgetsPageSober;
