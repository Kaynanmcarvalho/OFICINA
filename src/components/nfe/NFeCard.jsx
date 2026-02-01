import React from 'react';
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

export default function NFeCard({ nfe, onClick }) {
  const statusConfig = {
    pendente: { color: 'yellow', icon: Clock, label: 'Pendente' },
    processando: { color: 'blue', icon: Clock, label: 'Processando' },
    autorizada: { color: 'green', icon: CheckCircle, label: 'Autorizada' },
    rejeitada: { color: 'red', icon: XCircle, label: 'Rejeitada' },
    cancelada: { color: 'gray', icon: XCircle, label: 'Cancelada' }
  };

  const config = statusConfig[nfe.status] || statusConfig.pendente;
  const Icon = config.icon;

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    return timestamp.toDate().toLocaleDateString('pt-BR');
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                NF-e #{nfe.numero.toString().padStart(6, '0')}
              </h3>
              <span className={`px-2 py-1 rounded text-xs font-medium bg-${config.color}-100 dark:bg-${config.color}-900/20 text-${config.color}-700 dark:text-${config.color}-300`}>
                {config.label}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {nfe.destinatario.nome} • {formatDate(nfe.createdAt)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            R$ {nfe.totais.valorTotal.toFixed(2)}
          </p>
          {nfe.protocolo && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Protocolo: {nfe.protocolo}
            </p>
          )}
        </div>
      </div>
    </div>

}
