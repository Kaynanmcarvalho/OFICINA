import { useState } from 'react';
import { Users, Car, Wrench, TrendingUp, Home, Calendar, Package, Settings } from 'lucide-react';
import { Navbar, Sidebar, DashboardCard } from '../components';
import type { SidebarSection } from '../components';

const sidebarSections: SidebarSection[] = [
  {
    title: 'Principal',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, href: '/dashboard' },
      { id: 'schedule', label: 'Agenda', icon: <Calendar size={20} />, href: '/schedule', badge: 3 },
      { id: 'clients', label: 'Clientes', icon: <Users size={20} />, href: '/clients' },
      { id: 'vehicles', label: 'Veículos', icon: <Car size={20} />, href: '/vehicles' },
    ],
  },
  {
    title: 'Gestão',
    items: [
      { id: 'inventory', label: 'Estoque', icon: <Package size={20} />, href: '/inventory' },
      { id: 'tools', label: 'Ferramentas', icon: <Wrench size={20} />, href: '/tools' },
      { id: 'settings', label: 'Configurações', icon: <Settings size={20} />, href: '/settings' },
    ],
  },
];

export function DashboardExample() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Navbar */}
      <Navbar
        user={{
          name: 'João Silva',
          email: 'joao@oficina.com',
        }}
        onSearch={(query) => console.log('Search:', query)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        notificationCount={3}
      />

      {/* Sidebar */}
      <Sidebar
        sections={sidebarSections}
        activeId="dashboard"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Dashboard
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Visão geral do seu negócio
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              title="Total Clientes"
              value="1,234"
              icon={Users}
              trend={{ value: 12, isPositive: true }}
              subtitle="vs. mês anterior"
              variant="glass"
            />
            <DashboardCard
              title="Veículos Ativos"
              value="856"
              icon={Car}
              trend={{ value: 5, isPositive: true }}
              variant="glass"
            />
            <DashboardCard
              title="Serviços Hoje"
              value="23"
              icon={Wrench}
              variant="highlight"
            />
            <DashboardCard
              title="Receita Mensal"
              value="R$ 45.2K"
              icon={TrendingUp}
              trend={{ value: 18, isPositive: true }}
              variant="glass"
            />
          </div>

          {/* Additional Content */}
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
      </main>
    </div>
  );
}
