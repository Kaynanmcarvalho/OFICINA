import { forwardRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, AlertCircle, Send, LogIn, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import './BudgetCard.css';

const BudgetCard = forwardRef(({ budget, onEdit, onSend, onCheckin }, ref) => {
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        label: 'Pendente',
        color: 'text-white',
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800'
      },
      sent: {
        icon: Send,
        label: 'Enviado',
        color: 'text-white',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800'
      },
      approved: {
        icon: CheckCircle,
        label: 'Aprovado',
        color: 'text-white',
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800'
      },
      partially_approved: {
        icon: AlertCircle,
        label: 'Parcialmente Aprovado',
        color: 'text-white',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800'
      },
      expired: {
        icon: XCircle,
        label: 'Expirado',
        color: 'text-white',
        bg: 'bg-gray-50 dark:bg-gray-900/20',
        border: 'border-gray-200 dark:border-gray-800'
      }
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(budget.status);
  const StatusIcon = statusConfig.icon;

  const expiresAt = new Date(budget.expiresAt);
  const now = new Date();
  const hoursUntilExpiration = (expiresAt - now) / (1000 * 60 * 60);
  const isExpiringSoon = hoursUntilExpiration < 3 && hoursUntilExpiration > 0;
  const isExpired = hoursUntilExpiration <= 0 && (budget.status === 'sent' || budget.status === 'pending' || budget.status === 'expired');
  
  // Debug log
  console.log('Budget:', budget.budgetNumber, {
    status: budget.status,
    hoursUntilExpiration,
    isExpired,
    expiresAt: budget.expiresAt
  });

  const handleReactivate = async () => {
    try {
      // Verificar estoque disponível para produtos
      const inventoryStore = window.inventoryStore;
      if (inventoryStore && budget.items) {
        const unavailableItems = [];
        
        for (const item of budget.items) {
          if (item.type === 'product' && item.productId) {
            const product = inventoryStore.products.find(p => p.id === item.productId || p.firestoreId === item.productId);
            if (product && product.quantity < item.quantity) {
              unavailableItems.push({
                name: item.name,
                requested: item.quantity,
                available: product.quantity
              });
            }
          }
        }

        // Se houver itens sem estoque, avisar o usuário
        if (unavailableItems.length > 0) {
          const itemsList = unavailableItems.map(i => 
            `${i.name}: solicitado ${i.requested}, disponível ${i.available}`
          ).join('\n');
          
          const confirm = window.confirm(
            `Alguns produtos não têm estoque suficiente:\n\n${itemsList}\n\nDeseja reativar mesmo assim? Os produtos serão reservados conforme disponibilidade.`
          );
          
          if (!confirm) return;
        }

        // Reservar produtos disponíveis
        for (const item of budget.items) {
          if (item.type === 'product' && item.productId) {
            const product = inventoryStore.products.find(p => p.id === item.productId || p.firestoreId === item.productId);
            const quantityToReserve = product ? Math.min(item.quantity, product.quantity) : 0;
            
            if (quantityToReserve > 0) {
              await inventoryStore.updateStock(
                item.productId,
                quantityToReserve,
                'out',
                `Reservado - orçamento reativado ${budget.budgetNumber}`
              );
            }
          }
        }
      }

      // Reativar orçamento
      const budgetStore = window.budgetStore || (await import('../../../store/budgetStore')).useBudgetStore.getState();
      const newExpiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000);
      await budgetStore.updateBudget(budget.id || budget.firestoreId, {
        status: 'pending',
        expiresAt: newExpiresAt.toISOString(),
        reactivatedAt: now.toISOString()
      });

      toast.success('Orçamento reativado por mais 48 horas!');

      // Perguntar se deseja reenviar via WhatsApp
      setTimeout(() => {
        const resend = window.confirm('Deseja reenviar o orçamento para o cliente via WhatsApp?');
        if (resend && onSend) {
          onSend(budget);
        }
      }, 500);

    } catch (error) {
      toast.error('Erro ao reativar orçamento');
      console.error(error);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="group relative"
    >
      <div className="budget-card-premium relative bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all">
        {/* Status Badge */}
        <div className={`budget-badge-${budget.status} inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bg} ${statusConfig.border} border mb-4`}>
          <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
          <span className={`text-sm font-semibold ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>

        {/* Expiration Warning */}
        {isExpiringSoon && (budget.status === 'pending' || budget.status === 'sent') && (
          <div className="budget-alert-expiring mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">
                Expira em {Math.floor(hoursUntilExpiration)}h
              </span>
            </div>
          </div>
        )}

        {/* Budget Info */}
        <div className="space-y-3 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {budget.budgetNumber}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-semibold">
              {budget.clientName || 'Cliente não identificado'}
            </p>
          </div>

          {budget.vehiclePlate && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="text-sm">Veículo:</span>
              <span className="font-mono font-bold">{budget.vehiclePlate}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              R$ {budget.total?.toFixed(2) || '0.00'}
            </span>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            Criado {(() => {
              try {
                const date = new Date(budget.createdAt);
                return isNaN(date.getTime()) ? 'recentemente' : formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
              } catch {
                return 'recentemente';
              }
            })()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {budget.status === 'pending' && !isExpired && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSend(budget)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              Enviar
            </motion.button>
          )}

          {budget.status === 'sent' && !isExpired && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSend(budget)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              Reenviar
            </motion.button>
          )}

          {isExpired && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReactivate}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
            >
              <Clock className="w-4 h-4" />
              Reativar (+48h)
            </motion.button>
          )}

          {(budget.status === 'approved' || budget.status === 'partially_approved') && !budget.convertedToCheckin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCheckin(budget)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Check-in
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(budget)}
            className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
          >
            <Edit className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

BudgetCard.displayName = 'BudgetCard';

export default BudgetCard;
