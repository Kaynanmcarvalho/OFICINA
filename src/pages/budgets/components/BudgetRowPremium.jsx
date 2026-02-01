// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';

const BudgetRowPremium = ({ budget, index, onEdit, onSend, onCheckin }) => {
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: 'Pendente',
        color: 'bg-yellow-500'
      },
      sent: {
        label: 'Enviado',
        color: 'bg-blue-500'
      },
      approved: {
        label: 'Aprovado',
        color: 'bg-green-500'
      },
      partially_approved: {
        label: 'Parcial',
        color: 'bg-blue-500'
      },
      expired: {
        label: 'Expirado',
        color: 'bg-gray-400'
      }
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(budget.status);

  const expiresAt = new Date(budget.expiresAt);
  const now = new Date();
  const hoursUntilExpiration = (expiresAt - now) / (1000 * 60 * 60);
  const isExpiringSoon = hoursUntilExpiration < 3 && hoursUntilExpiration > 0;
  const isExpired = hoursUntilExpiration <= 0 && (budget.status === 'sent' || budget.status === 'pending' || budget.status === 'expired');

  const handleReactivate = async () => {
    try {
      const budgetStore = window.budgetStore || (await import('../../../store/budgetStore')).useBudgetStore.getState();
      const newExpiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000);
      await budgetStore.updateBudget(budget.id || budget.firestoreId, {
        status: 'pending',
        expiresAt: newExpiresAt.toISOString(),
        reactivatedAt: now.toISOString()
      });

      toast.success('Orçamento reativado por mais 48 horas!');

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

  const getSecondaryInfo = () => {
    if (isExpired) {
      return 'Expirado';
    }
    if (isExpiringSoon && (budget.status === 'pending' || budget.status === 'sent')) {
      return `Expira em ${Math.floor(hoursUntilExpiration)}h`;
    }
    if (budget.status === 'approved' || budget.status === 'partially_approved') {
      if (budget.convertedToCheckin) {
        return 'Convertido em check-in';
      }
      return 'Pronto para check-in';
    }
    if (budget.status === 'sent') {
      return 'Aguardando resposta';
    }
    try {
      const date = new Date(budget.createdAt);
      return isNaN(date.getTime()) ? 'Criado recentemente' : `Criado ${formatDistanceToNow(date, { addSuffix: true, locale: ptBR })}`;
    } catch {
      return 'Criado recentemente';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className="
        group 
        px-6 py-4 
        hover:bg-gray-50 dark:hover:bg-gray-900/50 
        transition-colors 
        cursor-pointer
      "
      onClick={() => onEdit(budget)}
    >
      <div className="flex items-center justify-between">
        {/* Esquerda: Info principal */}
        <div className="flex items-center gap-6">
          {/* Número */}
          <div className="w-24">
            <span className="text-sm font-mono font-medium text-gray-900 dark:text-gray-100">
              {budget.budgetNumber}
            </span>
          </div>
          
          {/* Cliente */}
          <div className="w-48">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {budget.clientName || 'Cliente não identificado'}
            </span>
          </div>
          
          {/* Veículo */}
          <div className="w-28">
            {budget.vehiclePlate ? (
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                {budget.vehiclePlate}
              </span>
            ) : (
              <span className="text-sm text-gray-400 dark:text-gray-500">
                —
              </span>
            )}
          </div>
          
          {/* Valor */}
          <div className="w-32 text-right">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              R$ {budget.total?.toFixed(2) || '0,00'}
            </span>
          </div>
        </div>
        
        {/* Direita: Status e ações */}
        <div className="flex items-center gap-4">
          {/* Status discreto */}
          <div className="flex items-center gap-2 w-32">
            <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.color}`} />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {statusConfig.label}
            </span>
          </div>
          
          {/* Ações (aparecem no hover) */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
            {budget.status === 'pending' && !isExpired && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSend(budget);
                }}
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Enviar
              </button>
            )}

            {budget.status === 'sent' && !isExpired && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSend(budget);
                }}
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Reenviar
              </button>
            )}

            {isExpired && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReactivate();
                }}
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Reativar
              </button>
            )}

            {(budget.status === 'approved' || budget.status === 'partially_approved') && !budget.convertedToCheckin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCheckin(budget);
                }}
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Check-in
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(budget);
              }}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
      
      {/* Linha secundária (info adicional) */}
      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        {isExpiringSoon && (budget.status === 'pending' || budget.status === 'sent') && (
          <>
            <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
              <Clock className="w-3 h-3" />
              <span>Expira em {Math.floor(hoursUntilExpiration)}h</span>
            </div>
            <span>•</span>
          </>
        )}
        <span>{getSecondaryInfo()}</span>
      </div>
    </motion.div>
};

export default BudgetRowPremium;
