import { useState, useEffect, lazy, Suspense } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { useBudgetStore } from '../store/budgetStore';
import BudgetRowPremium from './budgets/components/BudgetRowPremium';
import SendBudgetModal from './budgets/components/SendBudgetModal';
import CheckinFromBudgetModal from './budgets/components/CheckinFromBudgetModal';

// Lazy load modals
const CreateBudgetRoute = lazy(() => import('../features/budget/routes/create').then(m => ({ default: m.CreateBudgetRoute })));
const EditBudgetRoute = lazy(() => import('../features/budget/routes/edit').then(m => ({ default: m.EditBudgetRoute })));

const BudgetsPagePremium = () => {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Orçamentos
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gerencie propostas comerciais
            </p>
          </div>
          
          <button
            onClick={handleCreateBudget}
            className="
              flex items-center gap-2
              px-4 py-2 
              bg-gray-900 dark:bg-gray-100 
              text-white dark:text-gray-900 
              text-sm font-medium 
              rounded-lg 
              hover:bg-gray-800 dark:hover:bg-gray-200
              transition-colors
            "
          >
            <Plus className="w-4 h-4" />
            Novo Orçamento
          </button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="
            flex items-center gap-3 
            px-4 py-2.5 
            bg-white dark:bg-gray-900 
            border border-gray-200 dark:border-gray-800 
            rounded-lg
          "
        >
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              flex-1 
              bg-transparent 
              text-sm 
              text-gray-900 dark:text-gray-100 
              placeholder-gray-400
              focus:outline-none
            "
            placeholder="Buscar por cliente, número ou placa..."
          />
          
          <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-800 pl-3">
            <button
              onClick={() => setStatusFilter('all')}
              className={`
                text-xs transition-colors
                ${statusFilter === 'all'
                  ? 'text-gray-900 dark:text-gray-100 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }
              `}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`
                text-xs transition-colors
                ${statusFilter === 'pending'
                  ? 'text-gray-900 dark:text-gray-100 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }
              `}
            >
              Pendentes
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`
                text-xs transition-colors
                ${statusFilter === 'approved'
                  ? 'text-gray-900 dark:text-gray-100 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }
              `}
            >
              Aprovados
            </button>
          </div>
        </motion.div>

        {/* Stats Inline */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="
            flex items-center gap-6 
            px-4 py-3 
            bg-gray-50 dark:bg-gray-900/50 
            border border-gray-200 dark:border-gray-800 
            rounded-lg
            text-sm
          "
        >
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-gray-100">{stats.total}</span>
            <span className="text-gray-500 dark:text-gray-400">Total</span>
          </div>
          
          <div className="w-px h-4 bg-gray-200 dark:border-gray-800" />
          
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-gray-100">{stats.pending}</span>
            <span className="text-gray-500 dark:text-gray-400">Pendentes</span>
          </div>
          
          <div className="w-px h-4 bg-gray-200 dark:border-gray-800" />
          
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-gray-100">{stats.approved + stats.partiallyApproved}</span>
            <span className="text-gray-500 dark:text-gray-400">Aprovados</span>
          </div>
          
          <div className="w-px h-4 bg-gray-200 dark:border-gray-800" />
          
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-gray-100">{stats.conversionRate}%</span>
            <span className="text-gray-500 dark:text-gray-400">Conversão</span>
          </div>
        </motion.div>

        {/* Budgets List */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="
            bg-white dark:bg-gray-900 
            border border-gray-200 dark:border-gray-800 
            rounded-lg 
            divide-y divide-gray-200 dark:divide-gray-800
          "
        >
          {isLoading ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-gray-100 rounded-full animate-spin" />
            </div>
          ) : filteredBudgets.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Nenhum orçamento encontrado com os filtros aplicados'
                  : 'Nenhum orçamento cadastrado. Crie o primeiro orçamento para começar.'
                }
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredBudgets.map((budget, index) => (
                <BudgetRowPremium
                  key={budget.firestoreId}
                  budget={budget}
                  index={index}
                  onEdit={handleEditBudget}
                  onSend={handleSendBudget}
                  onCheckin={handleCheckinFromBudget}
                />
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Modals */}
        <Suspense fallback={null}>
          {isModalOpen && !selectedBudget && (
            <CreateBudgetRoute
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedBudget(null);
              }}
              onSuccess={() => {
                setIsModalOpen(false);
                setSelectedBudget(null);
                fetchBudgets();
              }}
            />
          )}
          {isModalOpen && selectedBudget && (
            <EditBudgetRoute
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedBudget(null);
              }}
              onSuccess={() => {
                setIsModalOpen(false);
                setSelectedBudget(null);
                fetchBudgets();
              }}
              budgetId={selectedBudget.id || selectedBudget.firestoreId}
            />
          )}
        </Suspense>

        <SendBudgetModal
          isOpen={isSendModalOpen}
          onClose={() => {
            setIsSendModalOpen(false);
            setSelectedBudget(null);
          }}
          budget={selectedBudget}
        />

        <CheckinFromBudgetModal
          isOpen={isCheckinModalOpen}
          onClose={() => {
            setIsCheckinModalOpen(false);
            setSelectedBudget(null);
          }}
          budget={selectedBudget}
        />
      </div>
    </div>
};

export default BudgetsPagePremium;
