import React, { useState, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Star,
  TrendingUp,
  Download,
  Phone,
  Mail,
  Calendar,
  Award,
  Activity,
  Search,
  Crown,
  Heart,
  Target,
  Zap,
  Clock,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { formatPhone } from '../../utils/formatters';
import toast from 'react-hot-toast';

// Componente de Avatar com iniciais
const Avatar = ({ name, size = 'md', rank }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl'
  };

  const colors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-cyan-500 to-cyan-600'
  ];

  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

  return (
    <div className={`relative ${sizes[size]} rounded-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center text-white font-semibold shadow-lg`}>
      {name?.charAt(0)?.toUpperCase() || '?'}
      {rank && rank <= 3 && (
        <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
          rank === 1 ? 'bg-yellow-400 text-yellow-900' :
          rank === 2 ? 'bg-gray-300 text-gray-700' :
          'bg-orange-400 text-orange-900'
        }`}>
          {rank}
        </div>
      )}
    </div>
  );
};

// Card de estatística circular
const CircularStat = ({ value, max, label, color, icon: Icon }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-100 dark:text-gray-700"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="w-5 h-5 mb-1" style={{ color }} />
          <span className="text-lg font-bold text-gray-900 dark:text-white">{value}</span>
        </div>
      </div>
      <span className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">{label}</span>
    </div>
  );
};

// Card de cliente destaque
const TopClientCard = ({ client, rank }) => {
  const rankColors = {
    1: 'from-yellow-400 to-amber-500',
    2: 'from-gray-300 to-gray-400',
    3: 'from-orange-400 to-orange-500'
  };

  const rankIcons = {
    1: Crown,
    2: Award,
    3: Star
  };

  const RankIcon = rankIcons[rank] || Star;

  return (
    <div className={`relative p-5 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border-2 ${
      rank === 1 ? 'border-yellow-400' : rank === 2 ? 'border-gray-300' : rank === 3 ? 'border-orange-400' : 'border-transparent'
    } hover:shadow-xl transition-all duration-300 group`}>
      {rank <= 3 && (
        <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br ${rankColors[rank]} flex items-center justify-center shadow-lg`}>
          <RankIcon className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <Avatar name={client.name} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{client.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {client.phone ? formatPhone(client.phone) : 'Sem telefone'}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <p className="text-xs text-blue-600 dark:text-blue-400">Serviços</p>
          <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{client.totalServices}</p>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
          <p className="text-xs text-green-600 dark:text-green-400">Total Gasto</p>
          <p className="text-lg font-bold text-green-700 dark:text-green-300">
            R$ {client.totalSpent.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {client.lastService && (
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Clock className="w-3 h-3" />
          Último serviço: {client.lastService.toLocaleDateString('pt-BR')}
        </div>
      )}
    </div>
  );
};

const ClientsReport = () => {
  const context = useOutletContext();
  const navigate = useNavigate();
  const { clients = [], checkins = [], dateRange = 'month', setDateRange } = context || {};

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('services');
  const [filterStatus, setFilterStatus] = useState('all');

  // Análise avançada de clientes
  const clientsData = useMemo(() => {
    const now = new Date();
    let startDate;

    switch (dateRange) {
      case 'today': startDate = new Date(now.setHours(0, 0, 0, 0)); break;
      case 'week': startDate = new Date(now.setDate(now.getDate() - 7)); break;
      case 'month': startDate = new Date(now.setMonth(now.getMonth() - 1)); break;
      case 'year': startDate = new Date(now.setFullYear(now.getFullYear() - 1)); break;
      default: startDate = new Date(0);
    }

    // Enriquecer clientes com dados de serviços
    const enrichedClients = clients.map(client => {
      const clientCheckins = checkins.filter(c => 
        c.clientId === client.firestoreId || c.clientName === client.name
      );
      
      const periodCheckins = clientCheckins.filter(c => new Date(c.createdAt) >= startDate);
      const completedCheckins = clientCheckins.filter(c => c.status === 'completed');
      const totalSpent = completedCheckins.reduce((sum, c) => sum + (parseFloat(c.serviceValue) || 0), 0);
      const lastServiceDate = clientCheckins.length > 0 
        ? new Date(Math.max(...clientCheckins.map(c => new Date(c.createdAt))))
        : null;

      // Calcular dias desde último serviço
      const daysSinceLastService = lastServiceDate 
        ? Math.floor((new Date() - lastServiceDate) / (1000 * 60 * 60 * 24))
        : null;

      // Classificar cliente
      let status = 'new';
      if (clientCheckins.length >= 5) status = 'vip';
      else if (clientCheckins.length >= 2) status = 'regular';
      else if (clientCheckins.length === 1) status = 'new';

      if (daysSinceLastService && daysSinceLastService > 90) status = 'inactive';

      return {
        ...client,
        totalServices: clientCheckins.length,
        periodServices: periodCheckins.length,
        totalSpent,
        lastService: lastServiceDate,
        daysSinceLastService,
        status,
        avgTicket: completedCheckins.length > 0 ? totalSpent / completedCheckins.length : 0
      };
    });

    // Filtrar por busca
    let filtered = enrichedClients;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.name?.toLowerCase().includes(term) ||
        c.phone?.includes(term) ||
        c.email?.toLowerCase().includes(term)
      );
    }

    // Filtrar por status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    // Ordenar
    switch (sortBy) {
      case 'services':
        filtered.sort((a, b) => b.totalServices - a.totalServices);
        break;
      case 'recent':
        filtered.sort((a, b) => (b.lastService || 0) - (a.lastService || 0));
        break;
      case 'name':
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'spent':
        filtered.sort((a, b) => b.totalSpent - a.totalSpent);
        break;
    }

    // Top 3 clientes
    const topClients = [...enrichedClients]
      .sort((a, b) => b.totalServices - a.totalServices)
      .slice(0, 3);

    // Estatísticas
    const stats = {
      total: clients.length,
      vip: enrichedClients.filter(c => c.status === 'vip').length,
      regular: enrichedClients.filter(c => c.status === 'regular').length,
      new: enrichedClients.filter(c => c.status === 'new').length,
      inactive: enrichedClients.filter(c => c.status === 'inactive').length,
      activeInPeriod: enrichedClients.filter(c => c.periodServices > 0).length
    };

    // Clientes novos no período
    const newClientsInPeriod = clients.filter(c => {
      const createdAt = c.createdAt ? new Date(c.createdAt) : null;
      return createdAt && createdAt >= startDate;
    }).length;

    // Taxa de retenção
    const retentionRate = stats.total > 0 
      ? ((stats.total - stats.inactive) / stats.total) * 100 
      : 0;

    // Ticket médio geral
    const avgTicket = enrichedClients.length > 0
      ? enrichedClients.reduce((sum, c) => sum + c.avgTicket, 0) / enrichedClients.filter(c => c.avgTicket > 0).length
      : 0;

    // LTV médio (Lifetime Value)
    const avgLTV = enrichedClients.length > 0
      ? enrichedClients.reduce((sum, c) => sum + c.totalSpent, 0) / enrichedClients.length
      : 0;

    return {
      all: filtered,
      topClients,
      stats,
      newClientsInPeriod,
      retentionRate,
      avgTicket: avgTicket || 0,
      avgLTV
    };
  }, [clients, checkins, dateRange, searchTerm, sortBy, filterStatus]);

  const exportReport = () => {
    toast.success('Exportando relatório de clientes...');
  };

  const getStatusBadge = (status) => {
    const badges = {
      vip: { label: 'VIP', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
      regular: { label: 'Regular', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
      new: { label: 'Novo', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
      inactive: { label: 'Inativo', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400' }
    };
    return badges[status] || badges.new;
  };

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
              <Users className="w-7 h-7 text-blue-500" />
              Relatório de Clientes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Análise de clientes, fidelização e comportamento
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
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/25"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* KPIs Circulares */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Visão Geral dos Clientes
        </h2>
        <div className="flex flex-wrap justify-around gap-6">
          <CircularStat
            value={clientsData.stats.total}
            max={clientsData.stats.total}
            label="Total de Clientes"
            color="#3b82f6"
            icon={Users}
          />
          <CircularStat
            value={clientsData.stats.vip}
            max={clientsData.stats.total}
            label="Clientes VIP"
            color="#8b5cf6"
            icon={Crown}
          />
          <CircularStat
            value={clientsData.stats.activeInPeriod}
            max={clientsData.stats.total}
            label="Ativos no Período"
            color="#10b981"
            icon={Activity}
          />
          <CircularStat
            value={clientsData.newClientsInPeriod}
            max={clientsData.stats.total}
            label="Novos Clientes"
            color="#06b6d4"
            icon={UserPlus}
          />
          <CircularStat
            value={clientsData.stats.inactive}
            max={clientsData.stats.total}
            label="Inativos"
            color="#ef4444"
            icon={UserX}
          />
        </div>
      </div>

      {/* Top 3 Clientes */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          Top 3 Clientes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clientsData.topClients.length === 0 ? (
            <div className="col-span-3 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400">Nenhum cliente cadastrado</p>
            </div>
          ) : (
            clientsData.topClients.map((client, index) => (
              <TopClientCard key={client.firestoreId} client={client} rank={index + 1} />
            ))
          )}
        </div>
      </div>

      {/* Métricas de Fidelização */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Taxa de Retenção */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Fidelização
            </h2>
          </div>

          <div className="space-y-6">
            {/* Barra de retenção */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Taxa de Retenção</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {clientsData.retentionRate.toFixed(1)}%
                </span>
              </div>
              <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000"
                  style={{ width: `${clientsData.retentionRate}%` }}
                />
              </div>
            </div>

            {/* Distribuição por status */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-4 h-4 text-purple-500" />
                  <span className="text-xs text-purple-600 dark:text-purple-400">VIP (5+ serviços)</span>
                </div>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {clientsData.stats.vip}
                </p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <UserCheck className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-blue-600 dark:text-blue-400">Regular (2-4)</span>
                </div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {clientsData.stats.regular}
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <UserPlus className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">Novo (1)</span>
                </div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {clientsData.stats.new}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <UserX className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Inativo (90+ dias)</span>
                </div>
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  {clientsData.stats.inactive}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas Financeiras */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Métricas de Valor
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 dark:text-orange-400">Ticket Médio</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    R$ {clientsData.avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <DollarSign className="w-10 h-10 text-orange-400 opacity-50" />
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400">LTV Médio (Lifetime Value)</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    R$ {clientsData.avgLTV.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-400 opacity-50" />
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Serviços por Cliente</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {clientsData.stats.total > 0 
                      ? (clientsData.all.reduce((sum, c) => sum + c.totalServices, 0) / clientsData.stats.total).toFixed(1)
                      : '0'}
                  </p>
                </div>
                <BarChart3 className="w-10 h-10 text-blue-400 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Todos os Clientes
            </h2>
            <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
              {clientsData.all.length}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full sm:w-56 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">Todos</option>
              <option value="vip">VIP</option>
              <option value="regular">Regular</option>
              <option value="new">Novo</option>
              <option value="inactive">Inativo</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="services">Mais Serviços</option>
              <option value="spent">Maior Gasto</option>
              <option value="recent">Mais Recente</option>
              <option value="name">Nome A-Z</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contato</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Serviços</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Gasto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Último Serviço</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {clientsData.all.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm || filterStatus !== 'all' ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                    </p>
                  </td>
                </tr>
              ) : (
                clientsData.all.slice(0, 15).map((client) => {
                  const statusBadge = getStatusBadge(client.status);
                  return (
                    <tr key={client.firestoreId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={client.name} size="md" />
                          <span className="font-medium text-gray-900 dark:text-white">{client.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          {client.phone && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                              <Phone className="w-3.5 h-3.5" />
                              {formatPhone(client.phone)}
                            </div>
                          )}
                          {client.email && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                              <Mail className="w-3.5 h-3.5" />
                              {client.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="px-3 py-1 text-sm font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                          {client.totalServices}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-gray-900 dark:text-white">
                        R$ {client.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {client.lastService ? (
                          <div>
                            <p>{client.lastService.toLocaleDateString('pt-BR')}</p>
                            {client.daysSinceLastService !== null && (
                              <p className="text-xs text-gray-400">
                                {client.daysSinceLastService === 0 ? 'Hoje' : `${client.daysSinceLastService} dias atrás`}
                              </p>
                            )}
                          </div>
                        ) : '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {clientsData.all.length > 15 && (
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Mostrando 15 de {clientsData.all.length} clientes
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsReport;
