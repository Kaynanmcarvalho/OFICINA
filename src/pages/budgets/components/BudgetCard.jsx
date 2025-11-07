import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, AlertCircle, Send, LogIn, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const BudgetCard = forwardRef(({ budget, onEdit, onSend, onCheckin }, ref) => {
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        label: 'Pendente',
        color: 'text-yellow-600 dark:text-yellow-400',
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800'
      },
      approved: {
        icon: CheckCircle,
        label: 'Aprovado',
        color: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800'
      },
      partially_approved: {
        icon: AlertCircle,
        label: 'Parcialmente Aprovado',
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800'
      },
      expired: {
        icon: XCircle,
        label: 'Expirado',
        color: 'text-gray-600 dark:text-gray-400',
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="group relative"
    >
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all">
        {/* Status Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bg} ${statusConfig.border} border mb-4`}>
          <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
          <span className={`text-sm font-semibold ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>

        {/* Expiration Warning */}
        {isExpiringSoon && budget.status === 'pending' && (
          <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
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
            Criado {formatDistanceToNow(new Date(budget.createdAt), { addSuffix: true, locale: ptBR })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {budget.status === 'pending' && (
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
