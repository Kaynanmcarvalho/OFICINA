/**
 * BudgetsPagePremiumGrid - Experiência Premium com Cards em Grade
 * 
 * DESIGN PHILOSOPHY:
 * - Cards em grade responsiva (3 colunas desktop, 2 tablet, 1 mobile)
 * - Profundidade com sombras múltiplas
 * - Bordas visíveis mas elegantes (1px)
 * - Linhas de separação sutis
 * - Hover com elevação
 * - Transições suaves
 * - Visual premium e moderno
 */

import { useState, useEffect, memo, useCallback, lazy, Suspense } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Send, Edit3, CheckCircle, FileText, 
  Calendar, DollarSign, User, Clock, TrendingUp, AlertCircle,
  Sparkles, Zap, Shield, Award, Package, Receipt
} from 'lucide-react';
import { useBudgetStore } from '../store/budgetStore';

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
const BudgetCard = memo(({ budget, onEdit, onSend, onCheckin }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return {
          label: 'Aprovado',
          color: 'text-emerald-600 dark:text-emerald-400',
          bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20',
          border: 'border-emerald-200/50 dark:border-emerald-700/50',
          icon: Award,
          glow: 'shadow-emerald-500/20'
        };
      case 'sent':
        return {
          label: 'Enviado',
          color: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20',
          border: 'border-blue-200/50 dark:border-blue-700/50',
          icon: Zap,
          glow: 'shadow-blue-500/20'
        };
      case 'rejected':
        return {
          label: 'Rejeitado',
          color: 'text-red-600 dark:text-red-400',
          bg: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20',
          border: 'border-red-200/50 dark:border-red-700/50',
          icon: AlertCircle,
          glow: 'shadow-red-500/20'
        };
      case 'expired':
        return {
          label: 'Expirado',
          color: 'text-gray-500 dark:text-gray-400',
          bg: 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-700/20',
          border: 'border-gray-200/50 dark:border-gray-700/50',
          icon: Clock,
          glow: 'shadow-gray-500/20'
        };
      default:
        return {
          label: 'Pendente',
          color: 'text-amber-600 dark:text-amber-400',
          bg: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20',
          border: 'border-amber-200/50 dark:border-amber-700/50',
          icon: Sparkles,
          glow: 'shadow-amber-500/20'
        };
    }
  };

  const statusConfig = getStatusConfig(budget.status);
  const StatusIcon = statusConfig.icon;

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
      {/* Hover Glow Effect - Apple Style */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 
                   transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15), transparent 60%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Glass Morphism Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

      {/* Status Badge - Floating */}
      <div className="absolute top-5 right-5 z-20">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full
            ${statusConfig.bg} ${statusConfig.border} border-2
            backdrop-blur-xl ${statusConfig.glow} shadow-lg
          `}
        >
          <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} strokeWidth={2.5} />
          <span className={`text-xs font-semibold ${statusConfig.color} tracking-wide`}>
            {statusConfig.label}
          </span>
        </motion.div>
      </div>

      {/* Card Content */}
      <div className="relative p-8">
        {/* Header - Espaçamento Inteligente */}
        <div className="mb-7 pr-36">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 
                            shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/10">
              <Receipt className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 
                           dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
              {budget.budgetNumber}
            </h3>
          </div>
          
          <div className="flex items-center gap-3 text-gray-900 dark:text-white ml-1">
            <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700/50 ring-2 ring-gray-200 dark:ring-gray-600">
              <User className="w-4.5 h-4.5 text-gray-600 dark:text-gray-400" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-lg">{budget.clientName}</span>
          </div>
        </div>

        {/* Elegant Divider com mais espaço */}
        <div className="relative h-px mb-7">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent 
                          dark:from-transparent dark:via-gray-600 dark:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent 
                          dark:from-transparent dark:via-blue-500/20 dark:to-transparent blur-sm" />
        </div>

        {/* Vehicle Info - Espaçamento Melhorado */}
        <div className="mb-7">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-700/30 
                          border border-gray-200/50 dark:border-gray-600/50 ring-1 ring-gray-200/20 dark:ring-gray-600/20">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 
                            shadow-md shadow-purple-500/20 ring-4 ring-purple-500/10">
              <Package className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-gray-900 dark:text-white mb-1">
                {budget.vehicleBrand} {budget.vehicleModel}
              </p>
              <p className="text-sm font-mono font-bold text-gray-600 dark:text-gray-400 tracking-wider">
                {budget.vehiclePlate}
              </p>
            </div>
          </div>
        </div>

        {/* Elegant Divider */}
        <div className="relative h-px mb-7">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent 
                          dark:from-transparent dark:via-gray-600 dark:to-transparent" />
        </div>

        {/* Value and Details - Espaçamento Premium */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-5 p-5 rounded-2xl 
                          bg-gradient-to-br from-green-50 to-emerald-50 
                          dark:from-green-900/20 dark:to-emerald-900/20
                          border border-green-200/50 dark:border-green-700/50
                          ring-1 ring-green-200/20 dark:ring-green-700/20">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 
                            shadow-lg shadow-green-500/30 ring-4 ring-green-500/10">
              <DollarSign className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-green-700 dark:text-green-400 mb-1 tracking-wide uppercase">
                Valor Total
              </p>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 
                             dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                {formatCurrency(budget.total)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-5 text-sm text-gray-600 dark:text-gray-400 ml-1">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" strokeWidth={2.5} />
              <span className="font-semibold">{budget.items?.length || 0} {budget.items?.length === 1 ? 'item' : 'itens'}</span>
            </div>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" strokeWidth={2.5} />
              <span className="font-semibold">{formatDate(budget.createdAt)}</span>
            </div>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-3 ml-1 font-medium">
            {getDaysAgo(budget.createdAt)}
          </div>
        </div>

        {/* Actions - Apple Style com Espaçamento */}
        <div className="flex items-center gap-3 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
          {budget.status === 'pending' && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSend(budget)}
              className="flex-1 flex items-center justify-center gap-2.5 px-5 py-4
                         bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600
                         text-white rounded-xl font-bold text-sm
                         shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
                         transition-all duration-200 ring-2 ring-blue-500/20"
            >
              <Send className="w-4.5 h-4.5" strokeWidth={2.5} />
              Enviar
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onEdit(budget)}
            className="flex-1 flex items-center justify-center gap-2.5 px-5 py-4
                       bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-600/50
                       text-gray-700 dark:text-gray-200
                       rounded-xl font-bold text-sm
                       transition-all duration-200
                       border border-gray-200 dark:border-gray-600 ring-2 ring-gray-200/20 dark:ring-gray-600/20"
          >
            <Edit3 className="w-4.5 h-4.5" strokeWidth={2.5} />
            Editar
          </motion.button>

          {budget.status === 'approved' && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCheckin(budget)}
              className="flex-1 flex items-center justify-center gap-2.5 px-5 py-4
                         bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
                         text-white rounded-xl font-bold text-sm
                         shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40
                         transition-all duration-200 ring-2 ring-green-500/20"
            >
              <CheckCircle className="w-4.5 h-4.5" strokeWidth={2.5} />
              Check-in
            </motion.button>
          )}
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r 
                      from-transparent via-blue-400/30 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
});

BudgetCard.displayName = 'BudgetCard';

// Stats Card Component - Redesign Completo
// eslint-disable-next-line no-unused-vars
const StatsCard = memo(({ icon: Icon, label, value, color = 'blue', trend }) => {
  const colorConfig = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      bg: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10',
      text: 'text-blue-600 dark:text-blue-400',
      shadow: 'shadow-blue-500/20',
      ring: 'ring-blue-500/10'
    },
    yellow: {
      gradient: 'from-amber-500 to-amber-600',
      bg: 'from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10',
      text: 'text-amber-600 dark:text-amber-400',
      shadow: 'shadow-amber-500/20',
      ring: 'ring-amber-500/10'
    },
    green: {
      gradient: 'from-emerald-500 to-emerald-600',
      bg: 'from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/10',
      text: 'text-emerald-600 dark:text-emerald-400',
      shadow: 'shadow-emerald-500/20',
      ring: 'ring-emerald-500/10'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      bg: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10',
      text: 'text-purple-600 dark:text-purple-400',
      shadow: 'shadow-purple-500/20',
      ring: 'ring-purple-500/10'
    }
  };

  const config = colorConfig[color];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="relative bg-white dark:bg-gray-800/90 rounded-2xl p-6
                 border border-gray-200/60 dark:border-gray-700/60
                 backdrop-blur-xl overflow-hidden group"
      style={{
        boxShadow: `
          0 1px 2px rgba(0,0,0,0.03),
          0 2px 4px rgba(0,0,0,0.03),
          0 4px 8px rgba(0,0,0,0.03),
          0 8px 16px rgba(0,0,0,0.03)
        `
      }}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bg} opacity-50`} />
      
      {/* Glow Effect */}
      <div 
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        style={{
          background: `radial-gradient(circle at 50% 0%, ${color === 'blue' ? 'rgba(59, 130, 246, 0.1)' : 
                                                            color === 'yellow' ? 'rgba(245, 158, 11, 0.1)' :
                                                            color === 'green' ? 'rgba(16, 185, 129, 0.1)' :
                                                            'rgba(168, 85, 247, 0.1)'}, transparent 70%)`,
          filter: 'blur(20px)'
        }}
      />

      <div className="relative">
        {/* Icon and Trend */}
        <div className="flex items-start justify-between mb-6">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${config.gradient} 
                          shadow-lg ${config.shadow} ring-4 ${config.ring}`}>
            <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          
          {trend && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full
                         ${trend > 0 ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'}
                         border ${trend > 0 ? 'border-emerald-200 dark:border-emerald-800' : 'border-red-200 dark:border-red-800'}`}
            >
              <TrendingUp 
                className={`w-4 h-4 ${trend > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400 rotate-180'}`} 
                strokeWidth={2.5}
              />
              <span className={`text-xs font-bold ${trend > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {Math.abs(trend)}%
              </span>
            </motion.div>
          )}
        </div>

        {/* Label */}
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 tracking-wide">
          {label}
        </p>

        {/* Value */}
        <p className={`text-3xl font-bold ${config.text}`}>
          {value}
        </p>
      </div>

      {/* Bottom Accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient} 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </motion.div>
});

StatsCard.displayName = 'StatsCard';

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map(i => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 
                              border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
        <div className="h-px bg-gray-200 dark:bg-gray-700 my-4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    ))}
  </div>
// Empty State
const EmptyState = ({ hasFilters, onCreateNew }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20"
  >
    <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 
                    flex items-center justify-center mb-6">
      <FileText className="w-12 h-12 text-gray-400 dark:text-gray-600" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
      Nenhum orçamento encontrado
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
      {hasFilters 
        ? 'Tente ajustar os filtros de busca para encontrar o que procura'
        : 'Comece criando seu primeiro orçamento e gerencie suas propostas'}
    </p>
    {!hasFilters && (
      <button
        onClick={onCreateNew}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white 
                   rounded-lg font-medium shadow-lg hover:shadow-xl
                   transition-all duration-200 flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Criar Primeiro Orçamento
      </button>
    )}
  </motion.div>
// Main Component
const BudgetsPagePremiumGrid = () => {
  const budgetStore = useBudgetStore();
  const { budgets, fetchBudgets, isLoading, expireBudget, getStatistics } = budgetStore;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  // Remove duplicates
  const uniqueBudgets = budgets.reduce((acc, budget) => {
    if (!acc.find(b => b.firestoreId === budget.firestoreId)) {
      acc.push(budget);
    }
    return acc;
  }, []);

  // Filter budgets
  const filteredBudgets = uniqueBudgets.filter(budget => {
    if (statusFilter !== 'all' && budget.status !== statusFilter) {
      return false;
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        budget.clientName?.toLowerCase().includes(term) ||
        budget.budgetNumber?.toLowerCase().includes(term) ||
        budget.vehiclePlate?.toLowerCase().includes(term)
    }
    return true;
  });

  const hasFilters = searchTerm || statusFilter !== 'all';
  const stats = getStatistics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 
                    dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl 
                      border-b border-gray-200/60 dark:border-gray-700/60
                      sticky top-0 z-40
                      shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-7">
          {/* Title */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 
                              shadow-lg shadow-blue-500/30">
                <Receipt className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 
                             dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Orçamentos
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium ml-16">
              Gerencie suas propostas e acompanhe aprovações
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 
                                 text-gray-400 group-focus-within:text-blue-500 
                                 transition-colors" strokeWidth={2.5} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por cliente, número ou placa..."
                className="w-full pl-12 pr-4 py-3.5 
                           bg-white dark:bg-gray-800
                           border border-gray-200/60 dark:border-gray-700/60 
                           rounded-xl
                           text-gray-900 dark:text-white font-medium
                           placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                           transition-all duration-200
                           shadow-sm hover:shadow-md focus:shadow-lg"
                style={{
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              />
            </div>

            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-5 py-3.5 
                         bg-white dark:bg-gray-800
                         border border-gray-200/60 dark:border-gray-700/60 
                         rounded-xl
                         text-gray-900 dark:text-white font-semibold
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                         transition-all duration-200
                         shadow-sm hover:shadow-md
                         cursor-pointer"
              style={{
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="sent">Enviado</option>
              <option value="approved">Aprovado</option>
              <option value="rejected">Rejeitado</option>
              <option value="expired">Expirado</option>
            </select>

            {/* New Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateBudget}
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 
                         hover:from-blue-700 hover:to-blue-600
                         text-white font-semibold
                         rounded-xl
                         shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
                         transition-all duration-200
                         flex items-center justify-center gap-2.5"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              <span className="hidden sm:inline">Novo Orçamento</span>
              <span className="sm:hidden">Novo</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats - Espaçamento Inteligente */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard
            icon={Receipt}
            label="Total de Orçamentos"
            value={stats.total}
            color="blue"
          />
          <StatsCard
            icon={Sparkles}
            label="Pendentes"
            value={stats.pending}
            color="yellow"
          />
          <StatsCard
            icon={Award}
            label="Aprovados"
            value={stats.approved}
            color="green"
            trend={12}
          />
          <StatsCard
            icon={DollarSign}
            label="Valor Total"
            value={formatCurrency(stats.totalValue)}
            color="purple"
            trend={8}
          />
        </div>

        {/* Budgets Grid - Espaçamento Premium */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredBudgets.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onCreateNew={handleCreateBudget} />
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredBudgets.map((budget) => (
                <BudgetCard
                  key={budget.firestoreId}
                  budget={budget}
                  onEdit={handleEditBudget}
                  onSend={handleSendBudget}
                  onCheckin={handleCheckinFromBudget}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Modals */}
      <Suspense fallback={null}>
        {isModalOpen && (
          selectedBudget ? (
            <EditBudgetRoute
              budgetId={selectedBudget.firestoreId}
              onClose={() => setIsModalOpen(false)}
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
};

export default BudgetsPagePremiumGrid;
