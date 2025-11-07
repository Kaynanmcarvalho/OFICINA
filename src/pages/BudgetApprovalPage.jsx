import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, AlertCircle, Check, X } from 'lucide-react';
import { useBudgetStore } from '../store/budgetStore';
import toast from 'react-hot-toast';

const BudgetApprovalPage = () => {
  const { approvalLink } = useParams();
  const { getBudgetByApprovalLink, approveBudget, isLoading } = useBudgetStore();
  
  const [budget, setBudget] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadBudget = useCallback(async () => {
    const result = await getBudgetByApprovalLink(approvalLink);
    if (result.success) {
      setBudget(result.data);
      // Pre-select all items
      const allItemIds = new Set(result.data.items.map(item => item.id));
      setSelectedItems(allItemIds);
    } else {
      toast.error('Orçamento não encontrado');
    }
  }, [approvalLink, getBudgetByApprovalLink]);

  useEffect(() => {
    loadBudget();
  }, [loadBudget]);

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleApprove = async () => {
    if (selectedItems.size === 0) {
      toast.error('Selecione pelo menos um item para aprovar');
      return;
    }

    setIsSubmitting(true);

    try {
      const approvedItemsList = budget.items.filter(item => selectedItems.has(item.id));
      const result = await approveBudget(budget.firestoreId, approvedItemsList);

      if (result.success) {
        toast.success('Orçamento aprovado com sucesso!');
        loadBudget(); // Reload to show updated status
      } else {
        toast.error(result.error || 'Erro ao aprovar orçamento');
      }
    } catch {
      toast.error('Erro ao processar aprovação');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Carregando orçamento...</p>
        </div>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Orçamento não encontrado</h1>
          <p className="text-gray-600">O link pode estar incorreto ou o orçamento pode ter expirado.</p>
        </div>
      </div>
    );
  }

  const isExpired = new Date(budget.expiresAt) < new Date();
  const isAlreadyProcessed = budget.status !== 'pending';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Aprovação de Orçamento
          </h1>
          <p className="text-lg text-gray-600">
            Revise e aprove os itens do seu orçamento
          </p>
        </motion.div>

        {/* Status Alert */}
        {isExpired && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-600" />
              <div>
                <p className="font-bold text-red-900">Orçamento Expirado</p>
                <p className="text-sm text-red-700">Este orçamento expirou. Entre em contato conosco para gerar um novo.</p>
              </div>
            </div>
          </motion.div>
        )}

        {isAlreadyProcessed && !isExpired && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-bold text-green-900">Orçamento Processado</p>
                <p className="text-sm text-green-700">Este orçamento já foi processado anteriormente.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Budget Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-6"
        >
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Orçamento</p>
              <p className="text-xl font-bold text-gray-900">{budget.budgetNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Cliente</p>
              <p className="text-xl font-bold text-gray-900">{budget.clientName}</p>
            </div>
            {budget.vehiclePlate && (
              <>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Veículo</p>
                  <p className="text-xl font-bold text-gray-900">{budget.vehiclePlate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Modelo</p>
                  <p className="text-xl font-bold text-gray-900">{budget.vehicleBrand} {budget.vehicleModel}</p>
                </div>
              </>
            )}
          </div>

          {/* Expiration Info */}
          {!isExpired && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <div className="text-sm text-orange-800">
                  <p className="font-semibold">Válido até {new Date(budget.expiresAt).toLocaleString('pt-BR')}</p>
                  <p>Aprove logo para garantir a disponibilidade dos itens.</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Items List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Itens do Orçamento</h2>
          
          <div className="space-y-3">
            <AnimatePresence>
              {budget.items?.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => !isExpired && !isAlreadyProcessed && toggleItemSelection(item.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedItems.has(item.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  } ${(isExpired || isAlreadyProcessed) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedItems.has(item.id)
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}>
                        {selectedItems.has(item.id) ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <X className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{item.name}</p>
                        {item.description && (
                          <p className="text-sm text-gray-600">{item.description}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          {item.quantity}x R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        R$ {item.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Total */}
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-3xl font-bold text-blue-600">
                R$ {budget.items
                  ?.filter(item => selectedItems.has(item.id))
                  .reduce((sum, item) => sum + item.total, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Notes */}
        {budget.notes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-8 mb-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-3">Observações</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{budget.notes}</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        {!isExpired && !isAlreadyProcessed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4"
          >
            <button
              onClick={handleApprove}
              disabled={isSubmitting || selectedItems.size === 0}
              className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-6 h-6" />
              {isSubmitting ? 'Processando...' : 'Aprovar Orçamento'}
            </button>
          </motion.div>
        )}

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Como funciona?</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Clique nos itens para aprovar ou reprovar individualmente</li>
                <li>Você pode aprovar todos os itens ou apenas alguns</li>
                <li>Serviços dependentes de produtos reprovados serão removidos automaticamente</li>
                <li>Após a aprovação, entraremos em contato para agendar o serviço</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BudgetApprovalPage;
