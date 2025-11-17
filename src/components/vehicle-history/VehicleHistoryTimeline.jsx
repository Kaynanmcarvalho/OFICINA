/**
 * VehicleHistoryTimeline Component
 * Timeline visual de eventos do histórico do veículo
 */

import React from 'react';
import { AlertTriangle, Gavel, AlertOctagon, Lock, Calendar } from 'lucide-react';

export function VehicleHistoryTimeline({ history }) {
  if (!history) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Nenhum evento encontrado</p>
      </div>
    );
  }

  // Agregar todos os eventos
  const events = [];

  // Adicionar recalls
  history.recalls?.forEach(recall => {
    events.push({
      type: 'recall',
      date: recall.dataInicio,
      title: 'Recall Iniciado',
      description: recall.descricao,
      severity: recall.gravidade,
      icon: AlertTriangle,
      color: 'yellow'
    });
  });

  // Adicionar leilões
  history.leiloes?.forEach(leilao => {
    events.push({
      type: 'leilao',
      date: leilao.data,
      title: 'Leilão',
      description: `${leilao.leiloeiro} - ${leilao.motivo}`,
      severity: 'media',
      icon: Gavel,
      color: 'blue'
    });
  });

  // Adicionar sinistros
  history.sinistros?.forEach(sinistro => {
    events.push({
      type: 'sinistro',
      date: sinistro.data,
      title: sinistro.tipo.charAt(0).toUpperCase() + sinistro.tipo.slice(1),
      description: `Status: ${sinistro.status}`,
      severity: sinistro.gravidade,
      icon: AlertOctagon,
      color: 'red'
    });
  });

  // Adicionar restrições
  history.restricoes?.forEach(restricao => {
    events.push({
      type: 'restricao',
      date: restricao.dataInicio,
      title: 'Restrição',
      description: restricao.descricao,
      severity: 'alta',
      icon: Lock,
      color: 'purple'
    });
  });

  // Ordenar por data (mais recente primeiro)
  events.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Nenhum evento no histórico</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Linha vertical */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />

      {/* Eventos */}
      <div className="space-y-6">
        {events.map((event, index) => {
          const Icon = event.icon;
          const colorClasses = {
            yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
            blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
            red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
            purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800'
          };

          return (
            <div key={index} className="relative flex items-start gap-4 pl-14">
              {/* Ícone */}
              <div className={`
                absolute left-0 w-12 h-12 rounded-full border-2 flex items-center justify-center
                ${colorClasses[event.color]}
              `}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Conteúdo */}
              <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {event.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {event.description}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap ml-4">
                    {new Date(event.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                {/* Badge de severidade */}
                {event.severity && (
                  <span className={`
                    inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-2
                    ${event.severity === 'alta' || event.severity === 'critica' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      event.severity === 'media' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}
                  `}>
                    {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
