import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus } from 'lucide-react';
import { useBudgetStore } from '../store/budgetStore';
import BudgetModal from './budgets/components/BudgetModalPremium';
import BudgetCard from './budgets/components/BudgetCard';
import BudgetFilters from './budgets/components/BudgetFilters';
import BudgetStats from './budgets/components/BudgetStats';
import SendBudgetModal from './budgets/components/SendBudgetModal';
import CheckinFromBudgetModal from './budgets/components/CheckinFromBudgetModal';
import './budgets/BudgetsPage.css';

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
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: null,
    searchTerm: ''
  });

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
    const interval = setInterval(checkExpiredBudgets, 60000); // Check every minute

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

  // Remove duplicates based on firestoreId
  const uniqueBudgets = budgets.reduce((acc, budget) => {
    if (!acc.find(b => b.firestoreId === budget.firestoreId)) {
      acc.push(budget);
    }
    return acc;
  }, []);

  const filteredBudgets = uniqueBudgets.filter(budget => {
    if (filters.status !== 'all' && budget.status !== filters.status) {
      return false;
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      return (
        budget.clientName?.toLowerCase().includes(term) ||
        budget.budgetNumber?.toLowerCase().includes(term) ||
        budget.vehiclePlate?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const stats = getStatistics();

  return (
    <div className="budgets-page-scaled min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 transition-colors duration-500">
      {/* Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(242, 140, 29, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 122, 255, 0.1) 0%, transparent 50%)',
            backgroundSize: '200% 200%',
          }}
        />
      </div>

      <div className="relative px-6 sm:px-8 lg:px-12 py-12 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div>
            <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 dark:from-white dark:via-gray-50 dark:to-white"
              style={{ letterSpacing: '-0.04em' }}
            >
              Orçamentos
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 font-semibold mt-2">
              Gerencie orçamentos com inteligência e precisão
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateBudget}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-blue-500/30 transition-all"
          >
            <Plus className="w-6 h-6" />
            Novo Orçamento
          </motion.button>
        </motion.div>

        {/* Statistics */}
        <BudgetStats stats={stats} />

        {/* Filters */}
        <BudgetFilters filters={filters} onFilterChange={setFilters} />

        {/* Budgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 animate-pulse"
                >
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </motion.div>
              ))
            ) : filteredBudgets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20"
              >
                <FileText className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-400 dark:text-gray-500 mb-2">
                  Nenhum orçamento encontrado
                </h3>
                <p className="text-gray-400 dark:text-gray-500">
                  Crie seu primeiro orçamento para começar
                </p>
              </motion.div>
            ) : (
              filteredBudgets.map((budget) => (
                <BudgetCard
                  key={budget.firestoreId}
                  budget={budget}
                  onEdit={handleEditBudget}
                  onSend={handleSendBudget}
                  onCheckin={handleCheckinFromBudget}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Modals */}
        <BudgetModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBudget(null);
          }}
          budget={selectedBudget}
        />

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
  );
};

export default BudgetsPage;
