/**
 * VehicleHistoryModal Component
 * Modal que exibe o histórico completo do veículo
 */

import React, { useState } from 'react';
import { X, RefreshCw, Download, AlertTriangle, CheckCircle, Calendar, ExternalLink } from 'lucide-react';
import { useVehicleHistory } from '../../hooks/useVehicleHistory';
import { VehicleHistoryTimeline } from './VehicleHistoryTimeline';

export function VehicleHistoryModal({ placa, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('recalls');
  const { 
    history, 
    loading, 
    refreshHistory, 
    cached 
  } = useVehicleHistory(placa);

  if (!isOpen) return null;

  const tabs = [
    { id: 'recalls', label: 'Recalls', count: history?.recalls?.length || 0 },
    { id: 'leiloes', label: 'Leilões', count: history?.leiloes?.length || 0 },
    { id: 'sinistros', label: 'Sinistros', count: history?.sinistros?.length || 0 },
    { id: 'timeline', label: 'Timeline', count: null }
  ];

  const handleRefresh = async () => {
    await refreshHistory();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Histórico do Veículo
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Placa: <span className="font-mono font-semibold">{placa}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                title="Atualizar dados"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-3 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                `}
              >
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <>
                {activeTab === 'recalls' && <RecallsTab recalls={history?.recalls || []} />}
                {activeTab === 'leiloes' && <LeiloesTab leiloes={history?.leiloes || []} />}
                {activeTab === 'sinistros' && <SinistrosTab sinistros={history?.sinistros || []} />}
                {activeTab === 'timeline' && <VehicleHistoryTimeline history={history} />}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {cached && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Última atualização: {history?.lastUpdate ? new Date(history.lastUpdate.toMillis()).toLocaleString('pt-BR') : 'N/A'}
                </span>
              )}
            </div>
            
            <button
              onClick={() => {/* TODO: Implementar exportação PDF */}}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab de Recalls
function RecallsTab({ recalls }) {
  if (recalls.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Nenhum recall encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recalls.map((recall, index) => (
        <div key={index} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {recall.descricao}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Campanha: {recall.campanha}
              </p>
            </div>
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${recall.status === 'pendente' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}
            `}>
              {recall.status === 'pendente' ? 'Pendente' : 'Realizado'}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm mt-3">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Fabricante:</span>
              <span className="ml-2 font-medium">{recall.fabricante}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Gravidade:</span>
              <span className={`ml-2 font-medium ${
                recall.gravidade === 'alta' ? 'text-red-600' : 
                recall.gravidade === 'media' ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {recall.gravidade.charAt(0).toUpperCase() + recall.gravidade.slice(1)}
              </span>
            </div>
          </div>

          {recall.url && (
            <a
              href={recall.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-3"
            >
              Ver fonte oficial
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

// Tab de Leilões
function LeiloesTab({ leiloes }) {
  if (leiloes.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Nenhum leilão encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leiloes.map((leilao, index) => (
        <div key={index} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {leilao.leiloeiro}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {leilao.motivo}
              </p>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(leilao.data).toLocaleDateString('pt-BR')}
            </span>
          </div>
          
          {leilao.valor && (
            <p className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(leilao.valor)}
            </p>
          )}

          {leilao.url && (
            <a
              href={leilao.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-3"
            >
              Ver fonte oficial
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

// Tab de Sinistros
function SinistrosTab({ sinistros }) {
  if (sinistros.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Nenhum sinistro encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sinistros.map((sinistro, index) => (
        <div key={index} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {sinistro.tipo.charAt(0).toUpperCase() + sinistro.tipo.slice(1)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(sinistro.data).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${sinistro.gravidade === 'alta' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                sinistro.gravidade === 'media' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}
            `}>
              Gravidade {sinistro.gravidade}
            </span>
          </div>
          
          {sinistro.seguradora && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Seguradora: {sinistro.seguradora}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
