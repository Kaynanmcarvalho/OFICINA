import React, { useState, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Wrench,
  Car,
  Search,
  Filter,
  TrendingUp,
  Timer,
  Zap,
  Target,
  BarChart3,
  Activity,
  Package,
  User,
  CalendarDays
} from 'lucide-react';
import toast from 'react-hot-toast';

const statusConfig = {
  completed: { 
    label: 'Concluído', 
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    dotColor: 'bg-green-500',
    icon: CheckCircle 
  },
  in_progress: { 
    label: 'Em Andamento', 
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    dotColor: 'bg-yellow-500',
    icon: Wrench 
  },
  waiting_parts: { 
    label: 'Aguardando Peças', 
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    dotColor: 'bg-orange-500',
    icon: Package 
  },
  waiting_client: { 
    label: 'Aguardando Cliente', 
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    dotColor: 'bg-blue-500',
    icon: User 
  },
  pending: { 
    label: 'Pendente', 
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    dotColor: 'bg-gray-500',
    icon: Clock 
  }
};

// Componente de gráfico de barras horizontal
const HorizontalBarChart = ({ data, maxValue }) => {
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i} className="group">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${item.dotColor}`} />
              <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${item.barColor}`}
              style={{ width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Card de métrica com ícone
const MetricCard = ({ icon: Icon, label, value, subValue, color, gradient }) => (
  <div className={`relative p-5 rounded-2xl bg-white dark:bg-gray-800 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300`}>
    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full ${gradient} opacity-10 -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />
    
    <div className={`inline-flex p-2.5 rounded-xl ${gradient} mb-3`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    {subValue && (
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subValue}</p>
    )}
  </div>
);

// Componente de timeline de atividade
const ActivityTimeline = ({ activities }) => (
  <div className="space-y-4">
    {activities.map((activity, i) => {
      const StatusIcon = statusConfig[activity.status]?.icon || Clock;
      return (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activity.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' :
              activity.status === 'in_progress' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
              'bg-gray-100 dark:bg-gray-700'
            }`}>
              <StatusIcon className={`w-5 h-5 ${
                activity.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                activity.status === 'in_progress' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-gray-500'
              }`} />
            </div>
            {i < activities.length - 1 && (
              <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{activity.clientName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{activity.vehicleModel} • {activity.vehiclePlate}</p>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(activity.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {activity.serviceValue && (
              <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-1">
                R$ {parseFloat(activity.serviceValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

const CheckinsReport = () => {
  const context = useOutletContext();
  const navigate = useNavigate();
  const { checkins = [], dateRange = 'month', setDateRange } = context || {};

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Análise avançada de check-ins
  const checkinsData = useMemo(() => {
    const now = new Date();
    let startDate;

    switch (dateRange) {
      case 'today': startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); break;
      case 'week': startDate = new Date(now.setDate(now.getDate() - 7)); break;
      case 'month': startDate = new Date(now.setMonth(now.getMonth() - 1)); break;
      case 'year': startDate = new Date(now.setFullYear(now.getFullYear() - 1)); break;
      default: startDate = new Date(0);
    }

    // Filtrar por período
    let filtered = checkins.filter(c => new Date(c.createdAt) >= startDate);

    // Filtrar por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.clientName?.toLowerCase().includes(term) ||
        c.vehiclePlate?.toLowerCase().includes(term) ||
        c.vehicleModel?.toLowerCase().includes(term) ||
        c.serviceDescription?.toLowerCase().includes(term)
      );
    }

    // Filtrar por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Ordenar
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'value':
        filtered.sort((a, b) => (parseFloat(b.serviceValue) || 0) - (parseFloat(a.serviceValue) || 0));
        break;
      case 'client':
        filtered.sort((a, b) => (a.clientName || '').localeCompare(b.clientName || ''));
        break;
    }

    // Estatísticas por status
    const byStatus = {};
    Object.keys(statusConfig).forEach(status => {
      byStatus[status] = filtered.filter(c => c.status === status).length;
    });

    // Dados para gráfico de barras
    const statusChartData = Object.entries(byStatus)
      .filter(([_, value]) => value > 0)
      .map(([status, value]) => ({
        label: statusConfig[status]?.label || status,
        value,
        dotColor: statusConfig[status]?.dotColor || 'bg-gray-500',
        barColor: status === 'completed' ? 'bg-gradient-to-r from-green-500 to-green-400' :
                  status === 'in_progress' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                  status === 'waiting_parts' ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                  status === 'waiting_client' ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                  'bg-gradient-to-r from-gray-500 to-gray-400'
      }));

    // Atividade por dia da semana
    const byDayOfWeek = { 'dom': 0, 'seg': 0, 'ter': 0, 'qua': 0, 'qui': 0, 'sex': 0, 'sáb': 0 };
    const dayNames = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
    filtered.forEach(c => {
      const day = dayNames[new Date(c.createdAt).getDay()];
      byDayOfWeek[day]++;
    });

    // Atividade por hora do dia
    const byHour = Array(24).fill(0);
    filtered.forEach(c => {
      const hour = new Date(c.createdAt).getHours();
      byHour[hour]++;
    });

    // Horário de pico
    const peakHour = byHour.indexOf(Math.max(...byHour));

    // Tempo médio de serviço
    const completedWithTime = filtered.filter(c => 
      c.status === 'completed' && c.createdAt && c.checkoutDate
    );
    const avgServiceTime = completedWithTime.length > 0
      ? completedWithTime.reduce((sum, c) => {
          const start = new Date(c.createdAt);
          const end = new Date(c.checkoutDate);
          return sum + (end - start) / (1000 * 60 * 60);
        }, 0) / completedWithTime.length
      : 0;

    // Receita total
    const totalRevenue = filtered
      .filter(c => c.status === 'completed')
      .reduce((sum, c) => sum + (parseFloat(c.serviceValue) || 0), 0);

    // Taxa de conclusão
    const completionRate = filtered.length > 0
      ? (filtered.filter(c => c.status === 'completed').length / filtered.length) * 100
      : 0;

    // Atividades recentes (últimas 5)
    const recentActivities = [...filtered]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Veículos mais atendidos
    const vehicleCount = {};
    filtered.forEach(c => {
      const vehicle = c.vehicleModel || 'Não informado';
      vehicleCount[vehicle] = (vehicleCount[vehicle] || 0) + 1;
    });
    const topVehicles = Object.entries(vehicleCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      all: filtered,
      byStatus,
      statusChartData,
      byDayOfWeek,
      byHour,
      peakHour,
      avgServiceTime,
      totalRevenue,
      completionRate,
      totalCheckins: filtered.length,
      completedCount: filtered.filter(c => c.status === 'completed').length,
      inProgressCount: filtered.filter(c => c.status === 'in_progress').length,
      recentActivities,
      topVehicles
    };
  }, [checkins, dateRange, searchTerm, statusFilter, sortBy]);

  const exportReport = () => {
    toast.success('Exportando relatório de check-ins...');
  };

  const getStatusInfo = (status) => statusConfig[status] || statusConfig.pending;

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/reports')}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-7 h-7 text-purple-500" />
              Relatório de Check-ins
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Histórico completo de serviços realizados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange?.(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
          >
            <option value="today">Hoje</option>
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
            <option value="year">Último Ano</option>
            <option value="all">Todo Período</option>
          </select>

          <button
            onClick={exportReport}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-500/25"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          icon={FileText}
          label="Total de Check-ins"
          value={checkinsData.totalCheckins}
          subValue={`${checkinsData.completedCount} concluídos`}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <MetricCard
          icon={CheckCircle}
          label="Taxa de Conclusão"
          value={`${checkinsData.completionRate.toFixed(1)}%`}
          subValue={`${checkinsData.inProgressCount} em andamento`}
          gradient="bg-gradient-to-br from-green-500 to-green-600"
        />
        <MetricCard
          icon={Timer}
          label="Tempo Médio"
          value={`${checkinsData.avgServiceTime.toFixed(1)}h`}
          subValue="Por serviço concluído"
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <MetricCard
          icon={TrendingUp}
          label="Receita Total"
          value={`R$ ${checkinsData.totalRevenue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`}
          subValue="Serviços concluídos"
          gradient="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Status dos Serviços */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Status dos Serviços
            </h2>
          </div>
          
          {checkinsData.statusChartData.length > 0 ? (
            <HorizontalBarChart 
              data={checkinsData.statusChartData} 
              maxValue={Math.max(...checkinsData.statusChartData.map(d => d.value))}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
              <Activity className="w-10 h-10 mb-2 opacity-50" />
              <p>Sem dados no período</p>
            </div>
          )}
        </div>

        {/* Atividade por Dia da Semana */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <CalendarDays className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Atividade Semanal
            </h2>
          </div>
          
          <div className="flex items-end justify-between h-40 gap-2">
            {Object.entries(checkinsData.byDayOfWeek).map(([day, count], i) => {
              const max = Math.max(...Object.values(checkinsData.byDayOfWeek), 1);
              const height = (count / max) * 100;
              const isMax = count === max && count > 0;
              
              return (
                <div key={day} className="flex flex-col items-center gap-2 flex-1 group">
                  <span className="text-xs font-medium text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {count}
                  </span>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isMax 
                        ? 'bg-gradient-to-t from-purple-600 to-purple-400' 
                        : 'bg-gradient-to-t from-purple-500/50 to-purple-400/50'
                    }`}
                    style={{ height: `${Math.max(height, 8)}%` }}
                  />
                  <span className={`text-xs ${isMax ? 'font-semibold text-purple-600' : 'text-gray-500 dark:text-gray-400'}`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Horário de Pico */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Insights
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">Horário de Pico</p>
                  <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">
                    {checkinsData.peakHour}:00 - {checkinsData.peakHour + 1}:00
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400">Ticket Médio</p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-300">
                    R$ {checkinsData.completedCount > 0 
                      ? (checkinsData.totalRevenue / checkinsData.completedCount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                      : '0,00'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Média Diária</p>
                  <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                    {(checkinsData.totalCheckins / 7).toFixed(1)} check-ins
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Atividade Recente + Top Veículos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Atividade Recente */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Atividade Recente
            </h2>
          </div>
          
          {checkinsData.recentActivities.length > 0 ? (
            <ActivityTimeline activities={checkinsData.recentActivities} />
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
              <Activity className="w-10 h-10 mb-2 opacity-50" />
              <p>Nenhuma atividade recente</p>
            </div>
          )}
        </div>

        {/* Top Veículos */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Car className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Veículos Mais Atendidos
            </h2>
          </div>
          
          {checkinsData.topVehicles.length > 0 ? (
            <div className="space-y-3">
              {checkinsData.topVehicles.map(([vehicle, count], i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    i === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                    i === 1 ? 'bg-gradient-to-br from-blue-400 to-blue-500' :
                    'bg-gradient-to-br from-gray-400 to-gray-500'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{vehicle}</p>
                  </div>
                  <span className="px-3 py-1 text-sm font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                    {count} serviços
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
              <Car className="w-10 h-10 mb-2 opacity-50" />
              <p>Nenhum veículo registrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Check-ins */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Histórico Completo
            </h2>
            <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
              {checkinsData.all.length}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full sm:w-48 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">Todos Status</option>
              <option value="completed">Concluídos</option>
              <option value="in_progress">Em Andamento</option>
              <option value="waiting_parts">Aguardando Peças</option>
              <option value="waiting_client">Aguardando Cliente</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="date">Mais Recente</option>
              <option value="value">Maior Valor</option>
              <option value="client">Cliente A-Z</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Veículo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {checkinsData.all.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Nenhum check-in encontrado com os filtros aplicados'
                        : 'Nenhum check-in no período selecionado'}
                    </p>
                  </td>
                </tr>
              ) : (
                checkinsData.all.slice(0, 15).map((checkin) => {
                  const statusInfo = getStatusInfo(checkin.status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <tr key={checkin.firestoreId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-4">
                        <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                          #{checkin.id || checkin.firestoreId?.slice(-6)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {checkin.clientName || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-900 dark:text-white">{checkin.vehicleModel || '-'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{checkin.vehiclePlate || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {new Date(checkin.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(checkin.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          R$ {(parseFloat(checkin.serviceValue) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {checkinsData.all.length > 15 && (
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Mostrando 15 de {checkinsData.all.length} check-ins
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckinsReport;
