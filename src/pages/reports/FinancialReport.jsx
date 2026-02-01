import React, { useState, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  PieChart,
  BarChart3,
  Wallet,
  CreditCard,
  Banknote,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Target,
  Zap,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useReportsStore } from '../../store';
import AlertsPanel from './components/AlertsPanel';
import DataQualityIndicator from './components/DataQualityIndicator';

// Componente de gráfico de rosca animado
const DonutChart = ({ data, size = 160, strokeWidth = 20 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-100 dark:text-gray-700"
        />
        {/* Data segments */}
        {data.map((item, i) => {
          const percentage = item.value / total;
          const dashLength = percentage * circumference;
          const offset = currentOffset;
          currentOffset += dashLength;

          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          );
        })}
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          R$ {(total / 1000).toFixed(1)}k
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
      </div>
    </div>
  );
};

// Componente de barra de progresso animada
const AnimatedBar = ({ value, max, color, label, amount }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      </div>
      <div className="relative h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        <div 
          className="absolute inset-y-0 left-0 rounded-full bg-white/30 animate-pulse"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

// Card de métrica com sparkline
const MetricCard = ({ icon: Icon, label, value, change, changeType, color, sparkData }) => (
  <div className={`bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border-l-4 ${color} relative overflow-hidden group hover:shadow-xl transition-all duration-300`}>
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-current opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
    
    <div className="flex items-start justify-between mb-3">
      <div className={`p-2 rounded-xl bg-gradient-to-br ${
        color.includes('green') ? 'from-green-500/20 to-green-600/20' :
        color.includes('red') ? 'from-red-500/20 to-red-600/20' :
        color.includes('blue') ? 'from-blue-500/20 to-blue-600/20' :
        'from-purple-500/20 to-purple-600/20'
      }`}>
        <Icon className={`w-5 h-5 ${
          color.includes('green') ? 'text-green-600' :
          color.includes('red') ? 'text-red-600' :
          color.includes('blue') ? 'text-blue-600' :
          'text-purple-600'
        }`} />
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          changeType === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
          changeType === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
        }`}>
          {changeType === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}%
        </div>
      )}
    </div>
    
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    
    {/* Mini sparkline */}
    {sparkData && sparkData.length > 0 && (
      <div className="flex items-end gap-0.5 mt-3 h-8">
        {sparkData.map((v, i) => {
          const max = Math.max(...sparkData, 1);
          return (
            <div
              key={i}
              className={`flex-1 rounded-t transition-all duration-300 ${
                color.includes('green') ? 'bg-green-400/60' :
                color.includes('red') ? 'bg-red-400/60' :
                color.includes('blue') ? 'bg-blue-400/60' :
                'bg-purple-400/60'
              }`}
              style={{ height: `${(v / max) * 100}%`, minHeight: '4px' }}
            />
          );
        })}
      </div>
    )}
  </div>
);

const FinancialReport = () => {
  const context = useOutletContext();
  const navigate = useNavigate();
  const { checkins = [], dateRange = 'month', setDateRange } = context || {};

  const [activeView, setActiveView] = useState('overview');
  const [useRealData, setUseRealData] = useState(true);

  // Store de relatórios
  const {
    calculateRealRevenue,
    calculateRealCosts,
    calculateRealExpenses,
    calculateRealProfit,
    generateAlerts,
    validateDataIntegrity
  } = useReportsStore();

  // Cálculos financeiros avançados
  const financialData = useMemo(() => {
    const now = new Date();
    let startDate, previousStartDate, previousEndDate;

    switch (dateRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        previousStartDate = new Date(startDate);
        previousStartDate.setDate(previousStartDate.getDate() - 1);
        previousEndDate = new Date(startDate);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        previousStartDate = new Date(startDate);
        previousStartDate.setDate(previousStartDate.getDate() - 7);
        previousEndDate = new Date(startDate);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        previousStartDate = new Date(startDate);
        previousStartDate.setMonth(previousStartDate.getMonth() - 1);
        previousEndDate = new Date(startDate);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        previousStartDate = new Date(startDate);
        previousStartDate.setFullYear(previousStartDate.getFullYear() - 1);
        previousEndDate = new Date(startDate);
        break;
      default:
        startDate = new Date(0);
        previousStartDate = new Date(0);
        previousEndDate = new Date(0);
    }

    const filtered = checkins.filter(c => new Date(c.createdAt) >= startDate);
    const previousFiltered = checkins.filter(c => {
      const date = new Date(c.createdAt);
      return date >= previousStartDate && date < previousEndDate;
    });

    const completed = filtered.filter(c => c.status === 'completed' && c.serviceValue);
    const previousCompleted = previousFiltered.filter(c => c.status === 'completed' && c.serviceValue);
    
    // DADOS REAIS DO STORE (quando disponível)
    let receita, custoEstimado, despesasFixas, lucro, margemLucro, dataQuality, warnings, alerts;
    
    if (useRealData) {
      try {
        const realProfit = calculateRealProfit(startDate, new Date());
        const realRevenue = calculateRealRevenue(startDate, new Date());
        const realCosts = calculateRealCosts(startDate, new Date());
        const realExpenses = calculateRealExpenses(startDate, new Date());
        const systemAlerts = generateAlerts(startDate, new Date());
        
        receita = realProfit.revenue;
        custoEstimado = realProfit.costs;
        despesasFixas = realProfit.expenses;
        lucro = realProfit.profit;
        margemLucro = realProfit.margin;
        dataQuality = realProfit.dataQuality;
        warnings = realProfit.warnings || [];
        alerts = systemAlerts;
      } catch (error) {
        console.error('Erro ao calcular dados reais:', error);
        setUseRealData(false);
      }
    }
    
    // FALLBACK: Dados estimados (antigo método)
    if (!useRealData) {
      receita = completed.reduce((sum, c) => sum + (parseFloat(c.serviceValue) || 0), 0);
      custoEstimado = receita * 0.30;
      despesasFixas = receita * 0.15;
      lucro = receita - custoEstimado - despesasFixas - (receita * 0.06);
      margemLucro = receita > 0 ? (lucro / receita) * 100 : 0;
      dataQuality = 'low';
      warnings = ['Usando estimativas (30% custos, 15% despesas, 6% impostos)'];
      alerts = { alerts: [], count: 0, critical: 0, high: 0, medium: 0 };
    }
    
    const previousReceita = previousCompleted.reduce((sum, c) => sum + (parseFloat(c.serviceValue) || 0), 0);
    const impostos = receita * 0.06;

    // Variação percentual
    const receitaChange = previousReceita > 0 ? ((receita - previousReceita) / previousReceita) * 100 : 0;

    // Agrupar por forma de pagamento
    const byPayment = completed.reduce((acc, c) => {
      const method = c.paymentMethod || 'Não informado';
      acc[method] = (acc[method] || 0) + (parseFloat(c.serviceValue) || 0);
      return acc;
    }, {});

    const paymentColors = {
      'Dinheiro': '#10b981',
      'Cartão Crédito': '#3b82f6',
      'Cartão Débito': '#8b5cf6',
      'PIX': '#06b6d4',
      'Boleto': '#f59e0b',
      'Não informado': '#9ca3af'
    };

    const pieData = Object.entries(byPayment)
      .filter(([_, value]) => value > 0)
      .map(([label, value]) => ({
        label,
        value,
        color: paymentColors[label] || '#9ca3af'
      }));

    // Dados por dia para gráfico
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (13 - i));
      const dayStr = date.toISOString().split('T')[0];
      const dayRevenue = completed
        .filter(c => new Date(c.createdAt).toISOString().split('T')[0] === dayStr)
        .reduce((sum, c) => sum + (parseFloat(c.serviceValue) || 0), 0);
      return {
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        value: dayRevenue
      };
    });

    // Sparkline data (últimos 7 dias)
    const sparkData = last14Days.slice(-7).map(d => d.value);

    // Fluxo de caixa projetado
    const fluxoCaixa = {
      entradas: receita,
      saidas: custoEstimado + despesasFixas + impostos,
      saldo: lucro,
      projecaoMensal: lucro * (30 / (dateRange === 'today' ? 1 : dateRange === 'week' ? 7 : 30))
    };

    return {
      receita,
      receitaChange,
      custoEstimado,
      despesasFixas,
      impostos,
      lucro,
      margemLucro,
      ticketMedio: completed.length > 0 ? receita / completed.length : 0,
      totalServicos: completed.length,
      byPayment,
      pieData,
      last14Days,
      sparkData,
      fluxoCaixa,
      transactions: completed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      dataQuality: dataQuality || 'low',
      warnings: warnings || [],
      alerts: alerts || { alerts: [], count: 0, critical: 0, high: 0, medium: 0 },
      useRealData
    };
  }, [checkins, dateRange, useRealData, calculateRealRevenue, calculateRealCosts, calculateRealExpenses, calculateRealProfit, generateAlerts]);

  const exportReport = () => {
    toast.success('Exportando relatório financeiro...');
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
              <DollarSign className="w-7 h-7 text-green-500" />
              Relatório Financeiro
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Receitas, despesas e fluxo de caixa detalhado
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
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-green-500/25"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Alertas e Qualidade de Dados */}
      {financialData.alerts && financialData.alerts.count > 0 && (
        <AlertsPanel alerts={financialData.alerts} />
      )}

      {financialData.dataQuality && financialData.dataQuality !== 'high' && (
        <DataQualityIndicator
          quality={financialData.dataQuality}
          warnings={financialData.warnings}
          onValidate={() => {
            const integrity = validateDataIntegrity();
            if (integrity.isValid) {
              toast.success('Dados validados com sucesso!');
            } else {
              toast.error(`${integrity.issues.length} problema(s) encontrado(s)`);
            }
          }}
        />
      )}

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          icon={TrendingUp}
          label="Receita Total"
          value={`R$ ${financialData.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          change={Math.abs(financialData.receitaChange).toFixed(1)}
          changeType={financialData.receitaChange >= 0 ? 'up' : 'down'}
          color="border-green-500"
          sparkData={financialData.sparkData}
        />
        <MetricCard
          icon={TrendingDown}
          label="Despesas Totais"
          value={`R$ ${(financialData.custoEstimado + financialData.despesasFixas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          color="border-red-500"
        />
        <MetricCard
          icon={Wallet}
          label="Lucro Líquido"
          value={`R$ ${financialData.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          color="border-blue-500"
        />
        <MetricCard
          icon={Percent}
          label="Margem de Lucro"
          value={`${financialData.margemLucro.toFixed(1)}%`}
          color="border-purple-500"
        />
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Gráfico de Receita por Dia */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Receita dos Últimos 14 Dias
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Evolução diária do faturamento
              </p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="flex items-end justify-between h-48 gap-1 px-2">
            {financialData.last14Days.map((day, i) => {
              const max = Math.max(...financialData.last14Days.map(d => d.value), 1);
              const height = (day.value / max) * 100;
              const isToday = i === financialData.last14Days.length - 1;
              
              return (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    R$ {day.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </div>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 cursor-pointer hover:opacity-80 ${
                      isToday 
                        ? 'bg-gradient-to-t from-green-600 to-green-400' 
                        : 'bg-gradient-to-t from-green-500/60 to-green-400/60'
                    }`}
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                  <span className={`text-xs ${isToday ? 'font-semibold text-green-600' : 'text-gray-500 dark:text-gray-400'}`}>
                    {day.date}
                  </span>
                </div>
                  );
            })}
          </div>
        </div>

        {/* Formas de Pagamento */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Formas de Pagamento
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Distribuição por método
              </p>
            </div>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          
          {financialData.pieData.length > 0 ? (
            <div className="flex flex-col items-center">
              <DonutChart data={financialData.pieData} />
              <div className="mt-6 w-full space-y-2">
                {financialData.pieData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      R$ {item.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500 dark:text-gray-400">
              <PieChart className="w-12 h-12 mb-2 opacity-50" />
              <p>Sem dados no período</p>
            </div>
          )}
        </div>
      </div>

      {/* Fluxo de Caixa + DRE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Fluxo de Caixa */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <RefreshCw className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Fluxo de Caixa
            </h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400">Entradas</p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-300">
                    R$ {financialData.fluxoCaixa.entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500 rounded-lg">
                  <ArrowDownRight className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-red-600 dark:text-red-400">Saídas</p>
                  <p className="text-xl font-bold text-red-700 dark:text-red-300">
                    R$ {financialData.fluxoCaixa.saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Saldo</p>
                  <p className="text-xl font-bold">
                    R$ {financialData.fluxoCaixa.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-200">Projeção Mensal</p>
                <p className="text-lg font-semibold">
                  R$ {financialData.fluxoCaixa.projecaoMensal.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DRE Simplificado */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                DRE Simplificado
              </h2>
            </div>
            {!financialData.useRealData && (
              <span className="px-2.5 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Estimado
              </span>
            )}
          </div>
          
          <div className="space-y-4">
            <AnimatedBar
              value={financialData.receita}
              max={financialData.receita}
              color="bg-gradient-to-r from-green-500 to-green-400"
              label="Receita Bruta"
              amount={financialData.receita}
            />
            <AnimatedBar
              value={financialData.custoEstimado}
              max={financialData.receita}
              color="bg-gradient-to-r from-orange-500 to-orange-400"
              label="(-) Custos Variáveis (30%)"
              amount={financialData.custoEstimado}
            />
            <AnimatedBar
              value={financialData.despesasFixas}
              max={financialData.receita}
              color="bg-gradient-to-r from-red-500 to-red-400"
              label="(-) Despesas Fixas (15%)"
              amount={financialData.despesasFixas}
            />
            <AnimatedBar
              value={financialData.impostos}
              max={financialData.receita}
              color="bg-gradient-to-r from-yellow-500 to-yellow-400"
              label="(-) Impostos (6%)"
              amount={financialData.impostos}
            />
            
            <div className="pt-4 mt-4 border-t-2 border-dashed border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900 dark:text-white">Lucro Líquido</span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    R$ {financialData.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {financialData.margemLucro.toFixed(1)}% de margem
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Transações */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Últimas Transações
            </h2>
          </div>
          <span className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
            {financialData.totalServicos} serviços
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descrição</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pagamento</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {financialData.transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-12 text-center">
                    <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400">Nenhuma transação no período</p>
                  </td>
                </tr>
              ) : (
                financialData.transactions.slice(0, 10).map((t, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(t.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-medium text-gray-900 dark:text-white">{t.clientName || '-'}</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {t.serviceDescription || t.vehicleModel || 'Serviço'}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                        {t.paymentMethod || 'Não informado'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        +R$ {(parseFloat(t.serviceValue) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialReport;
