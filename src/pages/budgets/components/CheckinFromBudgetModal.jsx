import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, AlertCircle } from 'lucide-react';
import { useCheckinStore } from '../../../store/checkinStore';
import { useBudgetStore } from '../../../store/budgetStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CheckinFromBudgetModal = ({ isOpen, onClose, budget }) => {
  const navigate = useNavigate();
  const { createCheckin } = useCheckinStore();
  const { updateBudget } = useBudgetStore();
  
  const [formData, setFormData] = useState({
    mileage: '',
    observations: '',
    serviceCategory: 'maintenance',
    photos: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (budget) {
      // Pre-fill observations with budget info
      const budgetInfo = `Check-in originado do orçamento #${budget.budgetNumber} em ${new Date().toLocaleDateString('pt-BR')}`;
      setFormData(prev => ({
        ...prev,
        observations: budgetInfo
      }));
    }
  }, [budget]);

  if (!isOpen || !budget) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create checkin with budget data
      const checkinData = {
        clientId: budget.clientId,
        clientName: budget.clientName,
        clientPhone: budget.clientPhone,
        clientEmail: budget.clientEmail,
        vehicleId: budget.vehicleId,
        vehiclePlate: budget.vehiclePlate,
        vehicleBrand: budget.vehicleBrand,
        vehicleModel: budget.vehicleModel,
        vehicleYear: budget.vehicleYear,
        vehicleColor: budget.vehicleColor,
        mileage: formData.mileage,
        services: budget.items.filter(item => item.type === 'service').map(item => item.name).join(', '),
        observations: formData.observations,
        serviceCategory: formData.serviceCategory,
        budgetId: budget.firestoreId,
        budgetNumber: budget.budgetNumber,
        budgetTotal: budget.total,
        status: 'in-progress'
      };

      const result = await createCheckin(checkinData);

      if (result.success) {
        // Mark budget as converted to checkin
        await updateBudget(budget.firestoreId, {
          convertedToCheckin: true,
          checkinId: result.data.firestoreId,
          convertedAt: new Date().toISOString()
        });

        toast.success('Check-in criado com sucesso!');
        onClose();
        
        // Navigate to checkin details
        navigate(`/checkin/${result.data.firestoreId}`);
      } else {
        toast.error(result.error || 'Erro ao criar check-in');
      }
    } catch (error) {
      toast.error('Erro ao criar check-in');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <LogIn className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Fazer Check-in
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  A partir do orçamento {budget.budgetNumber}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Budget Info */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3">Dados do Orçamento</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Cliente:</span>
                  <p className="font-bold text-blue-900 dark:text-blue-100">{budget.clientName}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Veículo:</span>
                  <p className="font-bold text-blue-900 dark:text-blue-100">{budget.vehiclePlate}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Modelo:</span>
                  <p className="font-bold text-blue-900 dark:text-blue-100">{budget.vehicleBrand} {budget.vehicleModel}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Total:</span>
                  <p className="font-bold text-blue-900 dark:text-blue-100">R$ {budget.total?.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Services from Budget */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Serviços Aprovados
              </label>
              <div className="space-y-2">
                {budget.items?.filter(item => item.type === 'service').map(item => (
                  <div key={item.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900 dark:text-white">{item.name}</span>
                      <span className="text-gray-600 dark:text-gray-400">R$ {item.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Fields */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Quilometragem Atual
              </label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                placeholder="Ex: 45000"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Categoria do Serviço
              </label>
              <select
                value={formData.serviceCategory}
                onChange={(e) => setFormData(prev => ({ ...prev, serviceCategory: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-green-500"
              >
                <option value="maintenance">Manutenção</option>
                <option value="repair">Reparo</option>
                <option value="inspection">Inspeção</option>
                <option value="customization">Customização</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Observações Adicionais
              </label>
              <textarea
                value={formData.observations}
                onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Info Alert */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-800 dark:text-green-200">
                  <p className="font-semibold mb-1">Check-in Automático</p>
                  <p>Todos os dados do cliente e veículo serão preenchidos automaticamente a partir do orçamento aprovado.</p>
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
            >
              <LogIn className="w-5 h-5" />
              {isSubmitting ? 'Criando...' : 'Criar Check-in'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckinFromBudgetModal;
