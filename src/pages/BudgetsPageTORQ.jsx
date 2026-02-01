/**
 * BudgetsPageTORQ - Reconstrução Total DNA TORQ
 * 
 * FILOSOFIA:
 * - Blocos estruturais sólidos (não lista web)
 * - Tipografia como hierarquia principal
 * - Cores extremamente contidas
 * - Aparência de software instalado
 * - Zero aparência React/web
 * 
 * PROIBIDO:
 * - Cards de KPI
 * - Badges coloridos
 * - Status em pill
 * - Visual "moderno"
 * - Qualquer sensação de "web app"
 */

import { useState, useEffect, memo, useCallback, lazy, Suspense } from 'react';
import { Search, Plus, Send, Edit3, CheckCircle, FileText, Car } from 'lucide-react';
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
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(d);
};

// Budget Record Component (memoized)
const BudgetRecord = memo(({ budget, onEdit, onSend, onCheckin }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 dark:text-green-500';
      case 'sent': return 'text-blue-600 dark:text-blue-400';
      case 'rejected': return 'text-gray-500 dark:text-gray-500';
      case 'expired': return 'text-gray-400 dark:text-gray-600';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'sent': return 'Enviado';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      case 'expired': return 'Expirado';
      default: return status;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 mb-4">
      {/* Linha 1: Número e Cliente */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Número do orçamento */}
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {budget.budgetNumber}
          </span>
          
          {/* Separador visual */}
          <span className="text-gray-300 dark:text-gray-700">•</span>
          
          {/* Nome do cliente */}
          <span className="text-base font-medium text-gray-900 dark:text-white">
            {budget.clientName}
          </span>
        </div>

        {/* Status (discreto, não badge) */}
        <span className={`text-xs font-medium uppercase tracking-wide ${getStatusColor(budget.status)}`}>
          {getStatusLabel(budget.status)}
        </span>
      </div>

      {/* Linha 2: Veículo e Placa */}
      <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
        <Car className="w-4 h-4" />
        <span>{budget.vehicleBrand} {budget.vehicleModel}</span>
        <span className="text-gray-300 dark:text-gray-700">•</span>
        <span className="font-mono">{budget.vehiclePlate}</span>
      </div>

      {/* Linha 3: Valor e Data */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Valor */}
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatCurrency(budget.total)}
          </span>
          
          {/* Data */}
          <span className="text-xs text-gray-500 dark:text-gray-500">
            {formatDate(budget.createdAt)}
          </span>
          
          {/* Itens */}
          <span className="text-xs text-gray-500 dark:text-gray-500">
            {budget.items?.length || 0} {budget.items?.length === 1 ? 'item' : 'itens'}
          </span>
        </div>

        {/* Ações (discretas) */}
        <div className="flex items-center gap-2">
          {budget.status === 'pending' && (
            <button
              onClick={() => onSend(budget)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Enviar orçamento"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onEdit(budget)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Editar orçamento"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          {budget.status === 'approved' && (
            <button
              onClick={() => onCheckin(budget)}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Criar check-in"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
});

BudgetRecord.displayName = 'BudgetRecord';

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-5 animate-pulse">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      </div>
    ))}
  </div>
// Empty State
const EmptyState = ({ hasFilters, onCreateNew }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <FileText className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
      Nenhum orçamento encontrado
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
      {hasFilters ? 'Tente ajustar os filtros de busca' : 'Comece criando um novo orçamento'}
    </p>
    {!hasFilters && (
      <button
        onClick={onCreateNew}
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Novo Orçamento
      </button>
    )}
  </div>
// Main Component
const BudgetsPageTORQ = () => {
  const budgetStore = useBudgetStore();
  const { budgets, fetchBudgets, isLoading, expireBudget } = budgetStore;

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Título */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Orçamentos
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Gestão de propostas e aprovações
            </p>
          </div>

          {/* Controles */}
          <div className="flex items-center gap-4">
            {/* Busca integrada */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por cliente, número ou placa..."
                className="w-full px-4 py-2.5 pl-10 bg-gray-50 dark:bg-gray-900 
                           border border-gray-200 dark:border-gray-700 rounded-lg
                           text-sm text-gray-900 dark:text-white
                           placeholder-gray-500 dark:placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            </div>

            {/* Filtros discretos */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 
                         border border-gray-200 dark:border-gray-700 rounded-lg
                         text-sm text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendente</option>
              <option value="sent">Enviado</option>
              <option value="approved">Aprovado</option>
              <option value="rejected">Rejeitado</option>
              <option value="expired">Expirado</option>
            </select>

            {/* Botão novo (peso de ação) */}
            <button
              onClick={handleCreateBudget}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 
                         text-white text-sm font-medium rounded-lg
                         transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Orçamento
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredBudgets.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onCreateNew={handleCreateBudget} />
        ) : (
          <div className="space-y-0">
            {filteredBudgets.map((budget) => (
              <BudgetRecord
                key={budget.firestoreId}
                budget={budget}
                onEdit={handleEditBudget}
                onSend={handleSendBudget}
                onCheckin={handleCheckinFromBudget}
              />
            ))}
          </div>
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

export default BudgetsPageTORQ;
