import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  Calendar,
  Download,
  ChevronRight,
  Wrench,
  CheckCircle
} from 'lucide-react';
import { useCheckinStore } from '../../store/checkinStore';
import { useClientStore } from '../../store/clientStore';
import { useVehicleStore } from '../../store/vehicleStore';
import toast from 'react-hot-toast';

// Componente de Card de Navegação
const NavCard = ({ icon: Icon, title, description, color, onClick, active }) => (
  <button
    onClick={onClick}
    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left group
      ${active 
        ? `border-${color}-500 bg-${color}-50 dark:bg-${color}-900/20` 
        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
      }`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${active ? `bg-${color}-500 text-white` : `bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h3 className={`font-semibold ${active ? `text-${color}-700 dark:text-${color}-300` : 'text-gray-900 dark:text-white'}`}>
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <ChevronRight className={`w-5 h-5 transition-transform ${active ? `text-${color}-500` : 'text-gray-400'} group-hover:translate-x-1`} />
    </div>
  </button>
);

// Mini gráfico de barras
const MiniBarChart = ({ data, color }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((item, i) => (
        <div
          key={i}
          className={`w-3 rounded-t ${color} transition-all duration-300`}
          style={{ height: `${(item.value / max) * 100}%`, minHeight: '4px' }}
          title={`${item.label}: ${item.value}`}
        />
      ))}
    </div>
  );
};

const ReportsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { checkins, fetchCheckins, getStatistics } = useCheckinStore();
  const { clients, fetchClients } = useClientStore();
  const { vehicles, fetchVehicles } = useVehicleStore();

  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');
  const [stats, setStats] = useState(null);

  const isSubPage = location.pathname !== '/reports';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchCheckins(), fetchClients(), fetchVehicles()]);
      setStats(getStatistics());
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  // Dados filtrados por período
  const filteredData = useMemo(() => {
    const now = new Date();
    let startDate;

    switch (dateRange) {
      case 'today': startDate = new Date(now.setHours(0, 0, 0, 0)); break;
      case 'week': startDate = new Date(now.setDate(now.getDate() - 7)); break;
      case 'month': startDate = new Date(now.setMonth(now.getMonth() - 1)); break;
      case 'year': startDate = new Date(now.setFullYear(now.getFullYear() - 1)); break;
      default: startDate = new Date(0);
    }

    const filtered = checkins.filter(c => new Date(c.createdAt) >= startDate);
    const revenue = filtered
      .filter(c => c.status === 'completed' && c.serviceValue)
      .reduce((sum, c) => sum + (parseFloat(c.serviceValue) || 0), 0);

    // Dados para mini gráfico (últimos 7 dias)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayCheckins = checkins.filter(c => {
        const cDate = new Date(c.createdAt);
        return cDate.toDateString() === date.toDateString();
      });
      return {
        label: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        value: dayCheckins.length
      };
    });

    return { filtered, revenue, last7Days };
  }, [checkins, dateRange]);

  const navItems = [
    {
      id: 'financial',
      icon: DollarSign,
      title: 'Financeiro',
      description: 'Receitas, despesas e fluxo de caixa',
      color: 'green',
      path: '/reports/financial'
    },
    {
      id: 'clients',
      icon: Users,
      title: 'Clientes',
      description: 'Análise de clientes e fidelização',
      color: 'blue',
      path: '/reports/clients'
    },
    {
      id: 'checkins',
      icon: FileText,
      title: 'Check-ins',
      description: 'Histórico de serviços realizados',
      color: 'purple',
      path: '/reports/checkins'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Se estiver em uma sub-página, renderiza o Outlet
  if (isSubPage) {
    return (
      <div className="px-2 sm:px-4 max-w-full overflow-hidden">
        <Outlet context={{ checkins, clients, vehicles, stats, dateRange, setDateRange }} />
      </div>
  );
}

return (
    <div className="space-y-6 px-2 sm:px-4 max-w-full overflow-hidden">
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
        </div>
      </div>

      {/* KPIs Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90">Receita Total</p>
          <p className="text-2xl font-bold">
            R$ {filteredData.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-8 h-8 opacity-80" />
            <BarChart3 className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90">Serviços Concluídos</p>
          <p className="text-2xl font-bold">{stats?.completed || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-5 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-3">
            <Wrench className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Em andamento</span>
          </div>
          <p className="text-sm opacity-90">Em Andamento</p>
          <p className="text-2xl font-bold">{stats?.inProgress || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-3">
            <Users className="w-8 h-8 opacity-80" />
            <PieChart className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90">Total de Clientes</p>
          <p className="text-2xl font-bold">{clients.length}</p>
        </div>
      </div>

      {/* Gráfico de Atividade + Navegação */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Gráfico de Atividade */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Atividade dos Últimos 7 Dias
            </h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="flex items-end justify-between h-40 px-2">
            {filteredData.last7Days.map((day, i) => {
              const max = Math.max(...filteredData.last7Days.map(d => d.value), 1);
              const height = (day.value / max) * 100;
              return (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {day.value}
                  </span>
                  <div
                    className="w-full max-w-[40px] bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${Math.max(height, 8)}%` }}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cards de Navegação */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Relatórios Detalhados
          </h2>
          {navItems.map((item) => (
            <NavCard
              key={item.id}
              icon={item.icon}
              title={item.title}
              description={item.description}
              color={item.color}
              onClick={() => navigate(item.path)}
              active={location.pathname === item.path}
            />
          ))}
        </div>
      </div>

      {/* Status dos Serviços */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Status dos Serviços
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Concluídos', value: stats?.completed || 0, color: 'bg-green-500' },
              { label: 'Em Andamento', value: stats?.inProgress || 0, color: 'bg-yellow-500' },
              { label: 'Aguardando Peças', value: stats?.waitingParts || 0, color: 'bg-orange-500' },
              { label: 'Aguardando Cliente', value: stats?.waitingClient || 0, color: 'bg-blue-500' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <span className="text-gray-700 dark:text-gray-300">Total</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">{stats?.total || 0}</span>
          </div>
        </div>

        {/* Métricas Rápidas */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Métricas de Performance
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.averageServiceTime || 0}h
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tempo Médio</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {vehicles.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Veículos</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.completed > 0 ? ((stats.completed / stats.total) * 100).toFixed(0) : 0}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Taxa Conclusão</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredData.filtered.length > 0 
                  ? (filteredData.revenue / filteredData.filtered.filter(c => c.status === 'completed').length || 1).toLocaleString('pt-BR', { maximumFractionDigits: 0 })
                  : 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ticket Médio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
