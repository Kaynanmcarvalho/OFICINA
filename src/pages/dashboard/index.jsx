import { useState, useEffect, lazy, Suspense, memo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, Wrench, Car } from 'lucide-react';
import ErrorBoundary from './componentes/ErrorBoundary';
import './estilos/dashboard.css';
import './estilos/dashboard-light-premium.css';
import './estilos/dashboard-ultra-depth.css';
import './estilos/dashboard-theme-colors.css';
import './estilos/dashboard-backgrounds.css';

// Lazy loading para TODOS os componentes pesados
const CartaoIndicador = lazy(() => import('./componentes/CartaoIndicador'));
const LoaderAnimado = lazy(() => import('./componentes/LoaderAnimado'));
const CentralAlertas = lazy(() => import('./componentes/CentralAlertas'));
const WidgetClima = lazy(() => import('./componentes/WidgetClima'));
const ListaClientesRecentes = lazy(() => import('./componentes/ListaClientesRecentes'));
const EstoqueCritico = lazy(() => import('./componentes/EstoqueCritico'));
const FerramentasEmUso = lazy(() => import('./componentes/FerramentasEmUso'));
const VeiculosAtivos = lazy(() => import('./componentes/VeiculosAtivos'));
const GraficoFinanceiro = lazy(() => import('./componentes/GraficoFinanceiro'));
const InsightsClientes = lazy(() => import('./componentes/InsightsClientes'));
const GraficoMovimentacao = lazy(() => import('./componentes/GraficoMovimentacao'));

// Skeleton loader inline para evitar import
const SkeletonCard = () => (
  <div className="animate-pulse bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 h-32">
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
  </div>
);

const DashboardPage = memo(() => {
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
  const serviceRef = useRef(null);
  const mountedRef = useRef(true);

  // Lazy load do service
  const getService = useCallback(async () => {
    if (!serviceRef.current) {
      serviceRef.current = await import('./servicos/dashboardService');
    }
    return serviceRef.current;
  }, []);

  const carregarDadosDashboard = useCallback(async (isInitialLoad = false) => {
    if (!mountedRef.current) return;
    
    if (isInitialLoad) {
      setIsLoading(true);
    }
    
    try {
      const service = await getService();
      
      // Carregar dados críticos primeiro (KPIs)
      const [stats, trends] = await Promise.all([
        service.buscarEstatisticasGerais(),
        service.calcularTendencias(),
      ]);

      if (!mountedRef.current) return;
      
      setEstatisticas(stats);
      setTendencias(trends);
      setIsLoading(false);

      // Carregar dados secundários em background
      const [alerts, clientInsights, recentClients, criticalStock, toolsInUse, activeVehicles, chartData] = 
        await Promise.all([
          service.buscarAlertas(),
          service.calcularInsightsClientes(),
          service.buscarClientesRecentes(),
          service.buscarEstoqueCritico(),
          service.buscarFerramentasEmUso(),
          service.buscarVeiculosAtivos(),
          service.gerarDadosGraficoMovimentacao()
        ]);

      if (!mountedRef.current) return;

      // Batch update para dados secundários
      requestAnimationFrame(() => {
        setAlertas(alerts);
        setInsights(clientInsights);
        setClientesRecentes(recentClients);
        setEstoqueCritico(criticalStock);
        setFerramentasEmUso(toolsInUse);
        setVeiculosAtivos(activeVehicles);
        setDadosGrafico(chartData);
      });
    } catch (error) {
      console.error('[Dashboard] Erro ao carregar dados:', error);
      if (isInitialLoad) setIsLoading(false);
    }
  }, [getService]);

  useEffect(() => {
    mountedRef.current = true;
    carregarDadosDashboard(true);

    // Setup listeners com throttle agressivo
    let timeoutId = null;
    let unsubscribe = null;

    const setupListeners = async () => {
      const service = await getService();
      unsubscribe = service.subscribeToAllCollections(() => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => carregarDadosDashboard(false), 5000);
      });
    };

    // Delay listener setup para não bloquear render inicial
    const listenerTimeout = setTimeout(setupListeners, 2000);

    return () => {
      mountedRef.current = false;
      clearTimeout(listenerTimeout);
      if (timeoutId) clearTimeout(timeoutId);
      if (unsubscribe) unsubscribe();
    };
  }, [carregarDadosDashboard, getService]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <SkeletonCard />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden" style={{ width: '100%', maxWidth: '100vw' }}>
        <div className="w-full mx-auto space-y-4 md:space-y-6 dashboard-no-transform px-3 md:px-4 lg:px-6 py-4 md:py-6" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
        
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
          
          <Suspense fallback={null}>
            <WidgetClima />
          </Suspense>
        </motion.div>

        {/* KPIs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
          style={{ width: '100%', maxWidth: '100%' }}
        >
          <Suspense fallback={<SkeletonCard />}>
            <CartaoIndicador
              titulo="Clientes"
              valor={estatisticas?.totalClientes || 0}
              icone={Users}
              cor="blue"
              tendencia={tendencias?.tendenciaClientes}
              percentual={tendencias?.percentualClientes}
            />
          </Suspense>
          
          <Suspense fallback={<SkeletonCard />}>
            <CartaoIndicador
              titulo="Veículos Cadastrados"
              valor={estatisticas?.veiculosAtivos || 0}
              icone={Car}
              cor="purple"
              tendencia={tendencias?.tendenciaVeiculos}
              percentual={tendencias?.percentualVeiculos}
            />
          </Suspense>
          
          <Suspense fallback={<SkeletonCard />}>
            <CartaoIndicador
              titulo="Ferramentas Disponíveis"
              valor={estatisticas?.ferramentasDisponiveis || 0}
              icone={Wrench}
              cor="orange"
              tendencia={tendencias?.tendenciaFerramentas}
              percentual={tendencias?.percentualFerramentas}
            />
          </Suspense>
          
          <Suspense fallback={<SkeletonCard />}>
            <CartaoIndicador
              titulo="Produtos em Estoque"
              valor={estatisticas?.totalProdutos || 0}
              icone={Package}
              cor="green"
              tendencia={tendencias?.tendenciaEstoque}
              percentual={tendencias?.percentualEstoque}
            />
          </Suspense>
        </motion.div>

        {/* Alertas */}
        {alertas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Suspense fallback={<SkeletonCard />}>
              <CentralAlertas alertas={alertas} />
            </Suspense>
          </motion.div>
        )}

        {/* Gráficos e Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4"
          style={{ width: '100%', maxWidth: '100%' }}
        >
          <Suspense fallback={<SkeletonCard />}>
            <GraficoMovimentacao dados={dadosGrafico} isLoading={false} />
          </Suspense>
          <Suspense fallback={<SkeletonCard />}>
            <InsightsClientes insights={insights} />
          </Suspense>
        </motion.div>

        {/* Gráfico Financeiro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Suspense fallback={<SkeletonCard />}>
            <GraficoFinanceiro />
          </Suspense>
        </motion.div>

        {/* Listas de Dados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4"
          style={{ width: '100%', maxWidth: '100%' }}
        >
          <Suspense fallback={<SkeletonCard />}>
            <ListaClientesRecentes clientes={clientesRecentes} isLoading={false} />
          </Suspense>
          <Suspense fallback={<SkeletonCard />}>
            <EstoqueCritico produtos={estoqueCritico} isLoading={false} />
          </Suspense>
        </motion.div>

        {/* Ferramentas e Veículos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4"
          style={{ width: '100%', maxWidth: '100%' }}
        >
          <Suspense fallback={<SkeletonCard />}>
            <FerramentasEmUso ferramentas={ferramentasEmUso} isLoading={false} />
          </Suspense>
          <Suspense fallback={<SkeletonCard />}>
            <VeiculosAtivos veiculos={veiculosAtivos} isLoading={false} />
          </Suspense>
        </motion.div>

        </div>
      </div>
    </ErrorBoundary>
  );
});

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
