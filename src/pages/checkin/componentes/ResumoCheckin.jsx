import { Calendar, Clock, User, Car, Phone } from 'lucide-react';

const ResumoCheckin = ({ checkin }) => {
  if (!checkin) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = () => {
    if (!checkin.checkOutDate) {
      const now = new Date();
      const diff = now - new Date(checkin.checkInDate);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}min`;
    }

    const diff = new Date(checkin.checkOutDate) - new Date(checkin.checkInDate);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}min`;
  };

  const getStatusColor = () => {
    switch (checkin.status) {
      case 'active':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      default:
        return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300';
    }
  };

  const getStatusLabel = () => {
    switch (checkin.status) {
      case 'active':
        return 'Em Andamento';
      case 'completed':
        return 'Finalizado';
      case 'pending':
        return 'Pendente';
      default:
        return checkin.status;
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-lg dark:shadow-neutral-950/50">

      {/* Header com Status */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
          Resumo do Atendimento
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {getStatusLabel()}
        </span>
      </div>

      {/* Informações do Cliente */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Cliente</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {checkin.clientName}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Telefone</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {checkin.clientPhone}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Car className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Veículo</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {checkin.motorcycle} • {checkin.plate}
            </p>
          </div>
        </div>
      </div>

      {/* Linha Divisória */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 my-6"></div>

      {/* Informações de Tempo */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neutral-400" />
            <span className="text-xs text-neutral-500 dark:text-neutral-400">Check-in</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {formatDate(checkin.checkInDate)}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {formatTime(checkin.checkInDate)}
            </p>
          </div>
        </div>

        {checkin.checkOutDate && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-400" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Check-out</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {formatDate(checkin.checkOutDate)}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {formatTime(checkin.checkOutDate)}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-400" />
            <span className="text-xs text-neutral-500 dark:text-neutral-400">Duração</span>
          </div>
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {calculateDuration()}
          </p>
        </div>
      </div>

      {/* Observações */}
      {checkin.observations && (
        <>
          <div className="border-t border-neutral-200 dark:border-neutral-800 my-6"></div>
          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Observações</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {checkin.observations}
            </p>
          </div>
        </>
      )}

      {/* Valor Total (se finalizado) */}
      {checkin.status === 'completed' && checkin.totalCost > 0 && (
        <>
          <div className="border-t border-neutral-200 dark:border-neutral-800 my-6"></div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">Valor Total</span>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              R$ {checkin.totalCost.toFixed(2)}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default ResumoCheckin;
