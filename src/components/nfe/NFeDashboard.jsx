/**
 * Dashboard de NF-e
 */

import React, { useState } from 'react';
import { useNFe } from '../../hooks/useNFe';
import { FileText, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import NFeCard from './NFeCard';
import NFeModal from './NFeModal';
import NFeConfigModal from './NFeConfigModal';

export default function NFeDashboard() {
  const { nfes, config, loading, error, refresh, loadNFes } = useNFe();
  const [selectedNFe, setSelectedNFe] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [filter, setFilter] = useState('all');

  if (loading && nfes.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">Erro: {error}</p>
      </div>
    );
  }

  // Verificar se está configurado
  if (!config) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              Configuração Necessária
            </h3>
            <p className="text-yellow-800 dark:text-yellow-200 mb-4">
              Configure os dados da empresa e certificado digital para começar a emitir NF-es.
            </p>
            <button
              onClick={() => setShowConfig(true)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Configurar Agora
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calcular estatísticas
  const stats = {
    total: nfes.length,
    autorizadas: nfes.filter(n => n.status === 'autorizada').length,
    pendentes: nfes.filter(n => n.status === 'pendente' || n.status === 'processando').length,
    rejeitadas: nfes.filter(n => n.status === 'rejeitada').length,
    canceladas: nfes.filter(n => n.status === 'cancelada').length
  };

  // Filtrar NF-es
  const filteredNFes = nfes.filter(n => {
    if (filter === 'all') return true;
    return n.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Notas Fiscais Eletrônicas
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowConfig(true)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Configurações
          </button>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Atualizar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">Total</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">Autorizadas</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.autorizadas}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.pendentes}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 dark:text-red-400">Rejeitadas</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.rejeitadas}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Canceladas</p>
              <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{stats.canceladas}</p>
            </div>
            <XCircle className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('autorizada')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'autorizada'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Autorizadas
        </button>
        <button
          onClick={() => setFilter('pendente')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'pendente'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Pendentes
        </button>
        <button
          onClick={() => setFilter('rejeitada')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'rejeitada'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Rejeitadas
        </button>
      </div>

      {/* NF-es List */}
      <div className="space-y-3">
        {filteredNFes.map(nfe => (
          <NFeCard
            key={nfe.id}
            nfe={nfe}
            onClick={() => setSelectedNFe(nfe)}
          />
        ))}
      </div>

      {filteredNFes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Nenhuma NF-e encontrada
          </p>
        </div>
      )}

      {/* Modals */}
      {selectedNFe && (
        <NFeModal
          nfe={selectedNFe}
          onClose={() => setSelectedNFe(null)}
          onUpdate={refresh}
        />
      )}

      {showConfig && (
        <NFeConfigModal
          config={config}
          onClose={() => setShowConfig(false)}
          onSave={() => {
            setShowConfig(false);
            refresh();
          }}
        />
      )}
    </div>
  );
}
