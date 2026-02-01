/**
 * BudgetsPage - Reconstrução Premium DNA TORQ
 * 
 * Design Philosophy:
 * - Blocos estruturais sólidos (não lista web)
 * - Hierarquia por tipografia e espaçamento
 * - Peso visual controlado
 * - Aparência de software instalado
 * - Zero aparência React/web
 */

import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, FileText, User, Car, Calendar, DollarSign, Send, Edit3, CheckCircle } from 'lucide-react';
import { useBudgetStore } from '../store/budgetStore';
import SendBudgetModal from './budgets/components/SendBudgetModal';
import CheckinFromBudgetModal from './budgets/components/CheckinFromBudgetModal';

// Lazy load modals
const CreateBudgetRoute = lazy(() => import('../features/budget/routes/create').then(m => ({ default: m.CreateBudgetRoute })));
const EditBudgetRoute = lazy(() => import('../features/budget/routes/edit').then(m => ({ default: m.EditBudgetRoute })));

// Format currency
const formatCurrency = (value) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

// Format date
const formatDate = (date) => {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(d);
};

const BudgetsPage = () => {
  const budgetStore = useBudgetStore();
  const { 
    budgets, 
    fetchBudgets, 
    isLoading,
    getStatistics,
    expireBudget
  } = budgetStore;

  // Make budgetStore available globally
  useEffect(() => {
    window.budgetStore = budgetStore;
    return () => {
      delete window.budgetStore;
    };
  }, [budgetStore]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  // Check for expired budgets every minute
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

  const handleCreateBudget = () => {
    setSelectedBudget(null);
    setIsModalOpen(true);
  };

  const handleEditBudget = (budget) => {
    setSelectedBudget(budget);
    setIsModalOpen(true);
  };

  const handleSendBudget = (budget) => {
    setSelectedBudget(budget);
    setIsSendModalOpen(true);
  };

  const handleCheckinFromBudget = (budget) => {
    setSelectedBudget(budget);
    setIsCheckinModalOpen(true);
  };

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

  const stats = getStatistics();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Orçamentos
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Gerencie seus orçamentos e propostas
              </p>
            </div>
            <button
              onClick={handleCreateBudget}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Orçamento
            </button>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
            <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Total
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                        {stats.total}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 overflow-hidden rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-yellow-700 dark:text-yellow-400 truncate">
                        Pendentes
                      </dt>
                      <dd className="text-lg font-semibold text-yellow-900 dark:text-yellow-300">
                        {stats.pending}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 overflow-hidden rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-green-700 dark:text-green-400 truncate">
                        Aprovados
                      </dt>
                      <dd className="text-lg font-semibold text-green-900 dark:text-green-300">
                        {stats.approved}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 overflow-hidden rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-blue-700 dark:text-blue-400 truncate">
                        Valor Total
                      </dt>
                      <dd className="text-lg font-semibold text-blue-900 dark:text-blue-300">
                        {formatCurrency(stats.totalValue)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                  placeholder="Buscar por cliente, número ou placa..."
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">Todos os Status</option>
                <option value="pending">Pendente</option>
                <option value="sent">Enviado</option>
                <option value="approved">Aprovado</option>
                <option value="rejected">Rejeitado</option>
                <option value="expired">Expirado</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredBudgets.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Nenhum orçamento encontrado
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando um novo orçamento'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <div className="mt-6">
                <button
                  onClick={handleCreateBudget}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Novo Orçamento
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBudgets.map((budget) => (
                <li key={budget.firestoreId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">
                            {budget.budgetNumber}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            budget.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            budget.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                            budget.status === 'expired' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400' :
                            budget.status === 'sent' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {budget.status === 'pending' ? 'Pendente' :
                             budget.status === 'sent' ? 'Enviado' :
                             budget.status === 'approved' ? 'Aprovado' :
                             budget.status === 'rejected' ? 'Rejeitado' :
                             'Expirado'}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{budget.clientName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Car className="w-4 h-4" />
                            <span>{budget.vehiclePlate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(budget.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(budget.total)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {budget.items?.length || 0} {budget.items?.length === 1 ? 'item' : 'itens'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {budget.status === 'pending' && (
                            <button
                              onClick={() => handleSendBudget(budget)}
                              className="inline-flex items-center p-2 border border-transparent rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              title="Enviar orçamento"
                            >
                              <Send className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEditBudget(budget)}
                            className="inline-flex items-center p-2 border border-transparent rounded-lg text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
                            title="Editar orçamento"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                          {budget.status === 'approved' && (
                            <button
                              onClick={() => handleCheckinFromBudget(budget)}
                              className="inline-flex items-center p-2 border border-transparent rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                              title="Criar check-in"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
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
        <SendBudgetModal
          budget={selectedBudget}
          onClose={() => {
            setIsSendModalOpen(false);
            setSelectedBudget(null);
          }}
        />
      )}

      {isCheckinModalOpen && selectedBudget && (
        <CheckinFromBudgetModal
          budget={selectedBudget}
          onClose={() => {
            setIsCheckinModalOpen(false);
            setSelectedBudget(null);
          }}
        />
      )}
    </div>
  );
};

export default BudgetsPage;
