import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, Wrench } from 'lucide-react';
import CartaoIndicador from './componentes/CartaoIndicador';
import LoaderAnimado from './componentes/LoaderAnimado';
import GraficoFinanceiro from './componentes/GraficoFinanceiro';
import CentralAlertas from './componentes/CentralAlertas';
import InsightsClientes from './componentes/InsightsClientes';
import WidgetClima from './componentes/WidgetClima';
import { buscarEstatisticasGerais, buscarAlertas, calcularInsightsClientes } from './servicos/dashboardService';
import './estilos/dashboard.css';

const DashboardPage = () => {
  const [estatisticas, setEstatisticas] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarDadosDashboard();
  }, []);

  const carregarDadosDashboard = async () => {
    setIsLoading(true);
    try {
      const [stats, alerts, clientInsights] = await Promise.all([
        buscarEstatisticasGerais(),
        buscarAlertas(),
        calcularInsightsClientes()
      ]);

      setEstatisticas(stats);
      setAlertas(alerts);
      setInsights(clientInsights);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
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
            tendencia={estatisticas?.tendenciaClientes}
          />
          
          <CartaoIndicador
            titulo="Veículos"
            valor={estatisticas?.totalVeiculos || 0}
            icone={Package}
            cor="purple"
            tendencia={estatisticas?.tendenciaVeiculos}
          />
          
          <CartaoIndicador
            titulo="Ferramentas"
            valor={estatisticas?.totalFerramentas || 0}
            icone={Wrench}
            cor="orange"
            tendencia={estatisticas?.tendenciaFerramentas}
          />
          
          <CartaoIndicador
            titulo="Estoque"
            valor={estatisticas?.totalEstoque || 0}
            icone={Package}
            cor="green"
            tendencia={estatisticas?.tendenciaEstoque}
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
          <GraficoFinanceiro />
          <InsightsClientes insights={insights} />
        </motion.div>

      </div>
    </div>
  );
};

export default DashboardPage;
