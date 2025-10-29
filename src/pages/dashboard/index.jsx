import { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, Wrench, Car } from 'lucide-react';
import CartaoIndicador from './componentes/CartaoIndicador';
import LoaderAnimado from './componentes/LoaderAnimado';
import CentralAlertas from './componentes/CentralAlertas';
import WidgetClima from './componentes/WidgetClima';
import ListaClientesRecentes from './componentes/ListaClientesRecentes';
import EstoqueCritico from './componentes/EstoqueCritico';
import FerramentasEmUso from './componentes/FerramentasEmUso';
import VeiculosAtivos from './componentes/VeiculosAtivos';
import ErrorBoundary from './componentes/ErrorBoundary';
import {
  buscarEstatisticasGerais,
  buscarAlertas,
  buscarClientesRecentes,
  buscarEstoqueCritico,
  buscarFerramentasEmUso,
  buscarVeiculosAtivos,
  calcularInsightsClientes,
  gerarDadosGraficoMovimentacao,
  calcularTendencias,
  subscribeToAllCollections
} from './servicos/dashboardService';
import './estilos/dashboard.css';

// Lazy loading para componentes de gráficos
const GraficoFinanceiro = lazy(() => import('./componentes/GraficoFinanceiro'));
const InsightsClientes = lazy(() => import('./componentes/InsightsClientes'));
const GraficoMovimentacao = lazy(() => import('./componentes/GraficoMovimentacao'));

const DashboardPage = () => {
  const [estatisticas, setEstatisticas] = useState(null);
  const [tendencias, setTendencias] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [insights, setInsights] = useState(null);
  const [clientesRecentes, setClientesRecentes] = useState([]);
  const [estoqueCritico, setEstoqueCritico] = useState([]);
  const [ferramentasEmUso, setFerramentasEmUso] = useState([]);
  const [veiculosAtivos, setVeiculosAtivos] = useState([]);
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarDadosDashboard();

    // Configurar listeners em tempo real
    const unsubscribe = subscribeToAllCollections((collection) => {
      console.log(`[Dashboard] Atualização detectada em: ${collection}`);
      carregarDadosDashboard();
    });

    // Cleanup: cancelar listeners ao desmontar
    return () => {
      unsubscribe();
    };
  }, []);

  const carregarDadosDashboard = async () => {
    setIsLoading(true);
    try {
      const [
        stats,
        trends,
        alerts,
        clientInsights,
        recentClients,
        criticalStock,
        toolsInUse,
        activeVehicles,
        chartData
      ] = await Promise.all([
        buscarEstatisticasGerais(),
        calcularTendencias(),
        buscarAlertas(),
        calcularInsightsClientes(),
        buscarClientesRecentes(),
        buscarEstoqueCritico(),
        buscarFerramentasEmUso(),
        buscarVeiculosAtivos(),
        gerarDadosGraficoMovimentacao()
      ]);

      setEstatisticas(stats);
      setTendencias(trends);
      setAlertas(alerts);
      setInsights(clientInsights);
      setClientesRecentes(recentClients);
      setEstoqueCritico(criticalStock);
      setFerramentasEmUso(toolsInUse);
      setVeiculosAtivos(activeVehicles);
      setDadosGrafico(chartData);
    } catch (error) {
      console.error('[Dashboard] Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <LoaderAnimado tipo="card" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <LoaderAnimado key={i} tipo="card" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 dashboard-no-transform">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Visão geral da oficina em tempo real
            </p>
          </div>
          
          <WidgetClima />
        </motion.div>

        {/* KPIs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          <CartaoIndicador
            titulo="Clientes"
            valor={estatisticas?.totalClientes || 0}
            icone={Users}
            cor="blue"
            tendencia={tendencias?.tendenciaClientes}
            percentual={tendencias?.percentualClientes}
          />
          
          <CartaoIndicador
            titulo="Veículos"
            valor={estatisticas?.totalVeiculos || 0}
            icone={Car}
            cor="purple"
            tendencia={tendencias?.tendenciaVeiculos}
            percentual={tendencias?.percentualVeiculos}
          />
          
          <CartaoIndicador
            titulo="Ferramentas"
            valor={estatisticas?.totalFerramentas || 0}
            icone={Wrench}
            cor="orange"
            tendencia={tendencias?.tendenciaFerramentas}
            percentual={tendencias?.percentualFerramentas}
          />
          
          <CartaoIndicador
            titulo="Estoque"
            valor={estatisticas?.totalEstoque || 0}
            icone={Package}
            cor="green"
            tendencia={tendencias?.tendenciaEstoque}
            percentual={tendencias?.percentualEstoque}
          />
        </motion.div>

        {/* Alertas */}
        {alertas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CentralAlertas alertas={alertas} />
          </motion.div>
        )}

        {/* Gráficos e Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Suspense fallback={<LoaderAnimado tipo="chart" />}>
            <GraficoMovimentacao dados={dadosGrafico} isLoading={isLoading} />
          </Suspense>
          <Suspense fallback={<LoaderAnimado tipo="chart" />}>
            <InsightsClientes insights={insights} />
          </Suspense>
        </motion.div>

        {/* Gráfico Financeiro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Suspense fallback={<LoaderAnimado tipo="chart" />}>
            <GraficoFinanceiro />
          </Suspense>
        </motion.div>

        {/* Listas de Dados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <ListaClientesRecentes clientes={clientesRecentes} isLoading={isLoading} />
          <EstoqueCritico produtos={estoqueCritico} isLoading={isLoading} />
        </motion.div>

        {/* Ferramentas e Veículos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <FerramentasEmUso ferramentas={ferramentasEmUso} isLoading={isLoading} />
          <VeiculosAtivos veiculos={veiculosAtivos} isLoading={isLoading} />
        </motion.div>

        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardPage;
