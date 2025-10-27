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
import toast from 'react-hot-toast';

const ReportsPage = () => {
  const { checkins, fetchCheckins, getStatistics } = useCheckinStore();
  const { clients, fetchClients, getTopClients } = useClientStore();
  const { vehicles, fetchVehicles } = useVehicleStore();

  const [dateRange, setDateRange] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);

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
                        {client.phone}
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

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => exportReport('checkins')}
          className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <FileText className="w-8 h-8 text-blue-600" />
          <div className="text-left">
            <p className="font-semibold text-gray-900 dark:text-white">
              Relatório de Check-ins
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Exportar histórico completo
            </p>
          </div>
        </button>

        <button
          onClick={() => exportReport('clientes')}
          className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <Users className="w-8 h-8 text-green-600" />
          <div className="text-left">
            <p className="font-semibold text-gray-900 dark:text-white">
              Relatório de Clientes
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Lista completa de clientes
            </p>
          </div>
        </button>

        <button
          onClick={() => exportReport('financeiro')}
          className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <DollarSign className="w-8 h-8 text-purple-600" />
          <div className="text-left">
            <p className="font-semibold text-gray-900 dark:text-white">
              Relatório Financeiro
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Receitas e despesas
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ReportsPage;