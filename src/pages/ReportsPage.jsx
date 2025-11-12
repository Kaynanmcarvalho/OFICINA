import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  Wrench,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useCheckinStore } from '../store/checkinStore';
import { useClientStore } from '../store/clientStore';
import { useVehicleStore } from '../store/vehicleStore';
import { formatPhone } from '../utils/formatters';
import toast from 'react-hot-toast';

const ReportsPage = () => {
  const { checkins, fetchCheckins, getStatistics } = useCheckinStore();
  const { clients, fetchClients, getTopClients } = useClientStore();
  const { vehicles, fetchVehicles } = useVehicleStore();

  const [dateRange, setDateRange] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('checkins'); // 'checkins', 'clients', 'financial'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchCheckins(),
        fetchClients(),
        fetchVehicles()
      ]);

      const statistics = getStatistics();
      setStats(statistics);
    } catch (error) {
      toast.error('Erro ao carregar dados dos relatórios');
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredCheckins = () => {
    const now = new Date();
    let startDate;

    switch (dateRange) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(0);
    }

    return checkins.filter(checkin =>
      new Date(checkin.createdAt) >= startDate
    );
  };

  const calculateRevenue = () => {
    const filtered = getFilteredCheckins();
    return filtered
      .filter(c => c.status === 'completed' && c.serviceValue)
      .reduce((sum, c) => sum + (parseFloat(c.serviceValue) || 0), 0);
  };

  const exportReport = (type) => {
    toast.success(`Exportando relatório de ${type}...`);
    // Implementar lógica de exportação
  };

  const topClients = getTopClients(5);
  const filteredCheckins = getFilteredCheckins();
  const revenue = calculateRevenue();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Relatórios e Análises
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visão completa do desempenho da oficina
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="today">Hoje</option>
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
            <option value="year">Último Ano</option>
            <option value="all">Todo Período</option>
          </select>

          <button
            onClick={() => exportReport('geral')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90 mb-1">Receita Total</p>
          <p className="text-3xl font-bold">
            R$ {revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 opacity-80" />
            <BarChart3 className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90 mb-1">Serviços Concluídos</p>
          <p className="text-3xl font-bold">{stats?.completed || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <Wrench className="w-8 h-8 opacity-80" />
            <AlertCircle className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90 mb-1">Em Andamento</p>
          <p className="text-3xl font-bold">{stats?.inProgress || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 opacity-80" />
            <PieChart className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90 mb-1">Total de Clientes</p>
          <p className="text-3xl font-bold">{clients.length}</p>
        </div>
      </div>

      {/* Estatísticas Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status dos Serviços */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Status dos Serviços
            </h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Concluídos</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.completed || 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Em Andamento</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.inProgress || 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Aguardando Peças</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.waitingParts || 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Aguardando Cliente</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.waitingClient || 0}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Total de Serviços</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {stats?.total || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Top Clientes */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Top 5 Clientes
            </h2>
            <Users className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {topClients.length > 0 ? (
              topClients.map((client, index) => (
                <div
                  key={client.firestoreId}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {client.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {client.phone ? formatPhone(client.phone) : '-'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {client.totalServices || 0}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      serviços
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Nenhum cliente cadastrado ainda
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Métricas de Performance */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Métricas de Performance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.averageServiceTime || 0}h
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tempo Médio de Serviço
            </p>
          </div>

          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Wrench className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {vehicles.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Veículos Cadastrados
            </p>
          </div>

          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.completed > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Taxa de Conclusão
            </p>
          </div>
        </div>
      </div>

      {/* Tabs de Seleção de Relatório */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('checkins')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'checkins'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" />
              <span>Relatório de Check-ins</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'clients'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-b-2 border-green-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              <span>Relatório de Clientes</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('financial')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'financial'
                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="w-5 h-5" />
              <span>Relatório Financeiro</span>
            </div>
          </button>
        </div>
      </div>

      {/* Relatório de Check-ins */}
      {activeTab === 'checkins' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Relatório de Check-ins
              </h2>
            </div>
            <button
              onClick={() => exportReport('checkins')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Veículo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Valor</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCheckins.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      Nenhum check-in encontrado no período selecionado
                    </td>
                  </tr>
                ) : (
                  filteredCheckins.slice(0, 10).map((checkin) => (
                    <tr key={checkin.firestoreId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{checkin.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{checkin.clientName}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {checkin.vehicleModel} - {checkin.vehiclePlate}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(checkin.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${checkin.status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                          {checkin.status === 'completed' ? 'Concluído' : 'Em andamento'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                        R$ {(checkin.serviceValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredCheckins.length > 10 && (
            <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Mostrando 10 de {filteredCheckins.length} registros. Use os filtros para refinar a busca.
            </div>
          )}
        </div>
      )}

      {/* Relatório de Clientes */}
      {activeTab === 'clients' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Relatório de Clientes
              </h2>
            </div>
            <button
              onClick={() => exportReport('clientes')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Telefone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total Serviços</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Último Serviço</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      Nenhum cliente cadastrado
                    </td>
                  </tr>
                ) : (
                  clients.slice(0, 10).map((client) => (
                    <tr key={client.firestoreId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{client.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{client.phone ? formatPhone(client.phone) : '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{client.email || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{client.totalServices || 0}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {client.lastServiceDate
                          ? new Date(client.lastServiceDate).toLocaleDateString('pt-BR')
                          : '-'
                        }
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {clients.length > 10 && (
            <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Mostrando 10 de {clients.length} clientes. Exporte para ver todos.
            </div>
          )}
        </div>
      )}

      {/* Relatório Financeiro */}
      {activeTab === 'financial' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Relatório Financeiro
              </h2>
            </div>
            <button
              onClick={() => exportReport('financeiro')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">Receitas</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                R$ {revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 mb-1">Despesas</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                R$ 0,00
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Lucro</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                R$ {revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Descrição</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Valor</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCheckins.filter(c => c.status === 'completed' && c.serviceValue).length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      Nenhuma transação no período selecionado
                    </td>
                  </tr>
                ) : (
                  filteredCheckins
                    .filter(c => c.status === 'completed' && c.serviceValue)
                    .slice(0, 10)
                    .map((checkin) => (
                      <tr key={checkin.firestoreId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(checkin.checkoutDate || checkin.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          Serviço - {checkin.clientName}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Receita
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-green-600 dark:text-green-400">
                          + R$ {(checkin.serviceValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;