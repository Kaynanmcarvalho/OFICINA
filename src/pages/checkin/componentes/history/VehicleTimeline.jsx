import React from 'react';
import { motion } from 'framer-motion';

/**
 * VehicleTimeline Component
 * 
 * Linha do tempo visual do histórico de serviços do veículo
 * Mostra todos os check-ins anteriores em ordem cronológica
 * 
 * @param {Array} history - Array de registros de serviço
 * @param {Function} onExport - Callback para exportar histórico
 */
const VehicleTimeline = ({ history = [], onExport }) => {
  /**
   * Formata duração em horas e minutos
   */
  const formatDuration = (ms) => {
    if (!ms) return 'N/A';
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  /**
   * Formata data
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  /**
   * Cor do status
   */
  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-500',
      cancelled: 'bg-red-500',
      active: 'bg-blue-500',
      pending: 'bg-yellow-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-500 dark:text-gray-400">
          Nenhum histórico encontrado
        </p>
      </div>
  );
}

return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Histórico de Serviços
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {history.length} {history.length === 1 ? 'registro' : 'registros'}
          </p>
        </div>
        
        {onExport && (
          <button
            onClick={onExport}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar PDF
          </button>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        {/* Timeline Items */}
        <div className="space-y-6">
          {history.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-12"
            >
              {/* Dot */}
              <div className={`absolute left-2.5 top-2 w-3 h-3 rounded-full ${getStatusColor(item.status)} ring-4 ring-white dark:ring-gray-900`} />

              {/* Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                {/* Date Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(item.createdAt || item.date)}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    item.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    item.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {item.status === 'completed' ? 'Concluído' :
                     item.status === 'cancelled' ? 'Cancelado' :
                     item.status === 'active' ? 'Em andamento' : 'Pendente'}
                  </span>
                </div>

                {/* Services */}
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Serviços:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.services || 'Não especificado'}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  {item.duration && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDuration(item.duration)}
                    </div>
                  )}
                  
                  {item.mechanic && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {item.mechanic}
                    </div>
                  )}

                  {item.cost && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      R$ {item.cost.toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Observations */}
                {item.observations && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                      "{item.observations}"
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleTimeline;
