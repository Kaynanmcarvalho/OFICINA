import { useState, useEffect } from 'react';
import { Users, Package, Wrench, Car } from 'lucide-react';
import { DashboardCard } from '../../design-system/components/composed/DashboardCard/DashboardCard';
import LoaderAnimado from './componentes/LoaderAnimado';
import CentralAlertas from './componentes/CentralAlertas';
import WidgetClima from './componentes/WidgetClima';
import {
  buscarEstatisticasGerais,
  buscarAlertas,
  calcularTendencias,
  subscribeToAllCollections
} from './servicos/dashboardService';

const PremiumDashboard = () => {
  const [estatisticas, setEstatisticas] = useState(null);
  const [tendencias, setTendencias] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarDadosDashboard();

    const unsubscribe = subscribeToAllCollections((collection) => {
      carregarDadosDashboard();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const carregarDadosDashboard = async () => {
    setIsLoading(true);
    try {
      const [stats, trends, alerts] = await Promise.all([
        buscarEstatisticasGerais(),
        calcularTendencias(),
        buscarAlertas(),
      ]);

      setEstatisticas(stats);
      setTendencias(trends);
      setAlertas(alerts);
    } catch (error) {
      console.error('[Dashboard] Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <LoaderAnimado key={i} tipo="card" />
          ))}
        </div>
      </div>
  );
}

return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Visão geral da oficina em tempo real
          </p>
        </div>
        
        <WidgetClima />
      </div>

      {/* KPIs com DashboardCard Premium */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Clientes"
          value={estatisticas?.totalClientes || 0}
          icon={Users}
          trend={
            tendencias?.tendenciaClientes
              ? {
                  value: Math.abs(tendencias.percentualClientes || 0),
                  isPositive: tendencias.tendenciaClientes === 'alta',
                }
              : undefined
          }
          subtitle="Total cadastrados"
          variant="glass"
        />
        
        <DashboardCard
          title="Veículos"
          value={estatisticas?.totalVeiculos || 0}
          icon={Car}
          trend={
            tendencias?.tendenciaVeiculos
              ? {
                  value: Math.abs(tendencias.percentualVeiculos || 0),
                  isPositive: tendencias.tendenciaVeiculos === 'alta',
                }
              : undefined
          }
          subtitle="Ativos no sistema"
          variant="glass"
        />
        
        <DashboardCard
          title="Ferramentas"
          value={estatisticas?.totalFerramentas || 0}
          icon={Wrench}
          trend={
            tendencias?.tendenciaFerramentas
              ? {
                  value: Math.abs(tendencias.percentualFerramentas || 0),
                  isPositive: tendencias.tendenciaFerramentas === 'alta',
                }
              : undefined
          }
          subtitle="Disponíveis"
          variant="glass"
        />
        
        <DashboardCard
          title="Estoque"
          value={estatisticas?.totalEstoque || 0}
          icon={Package}
          trend={
            tendencias?.tendenciaEstoque
              ? {
                  value: Math.abs(tendencias.percentualEstoque || 0),
                  isPositive: tendencias.tendenciaEstoque === 'alta',
                }
              : undefined
          }
          subtitle="Itens em estoque"
          variant="highlight"
        />
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <div>
          <CentralAlertas alertas={alertas} />
        </div>
      )}

      {/* Placeholder para conteúdo adicional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard
          title="Serviços Recentes"
          value="15"
          subtitle="Últimas 24 horas"
          variant="glass"
        >
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">Troca de óleo</span>
              <span className="font-medium">5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">Alinhamento</span>
              <span className="font-medium">3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">Revisão</span>
              <span className="font-medium">7</span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Agendamentos"
          value="8"
          subtitle="Para hoje"
          variant="glass"
        >
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            <p>Próximo: 14:00 - Troca de pneus</p>
            <p className="mt-1">Cliente: Maria Santos</p>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default PremiumDashboard;
