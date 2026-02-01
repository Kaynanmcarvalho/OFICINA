import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/index.jsx';
import { Navbar } from '../../design-system/components/composed/Navbar/Navbar';
import { Sidebar } from '../../design-system/components/composed/Sidebar/Sidebar';
import {
  Home,
  CheckCircle,
  Users,
  Car,
  Package,
  Wrench,
  Calendar,
  BarChart3,
  Settings,
  UserCog,
  UsersRound,
  DollarSign,
} from 'lucide-react';

export function PremiumLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userRole } = useAuthStore();

  // Logout handler (will be used in user menu dropdown)
  // const handleLogout = async () => {
  //   await logout();
  //   navigate('/login');
  // };

  // Sidebar sections
  const sidebarSections = [
    {
      title: 'Principal',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: <Home size={20} />,
          onClick: () => navigate('/dashboard'),
        },
        {
          id: 'caixa',
          label: 'Caixa / PDV',
          icon: <DollarSign size={20} />,
          onClick: () => navigate('/caixa'),
        },
        {
          id: 'checkin',
          label: 'Check-in',
          icon: <CheckCircle size={20} />,
          onClick: () => navigate('/checkin'),
        },
        {
          id: 'clients',
          label: 'Clientes',
          icon: <Users size={20} />,
          onClick: () => navigate('/clients'),
        },
        {
          id: 'vehicles',
          label: 'Veículos',
          icon: <Car size={20} />,
          onClick: () => navigate('/vehicles'),
        },
      ],
    },
    {
      title: 'Gestão',
      items: [
        {
          id: 'inventory',
          label: 'Estoque',
          icon: <Package size={20} />,
          onClick: () => navigate('/inventory'),
        },
        {
          id: 'tools',
          label: 'Ferramentas',
          icon: <Wrench size={20} />,
          onClick: () => navigate('/tools'),
        },
        {
          id: 'schedule',
          label: 'Agenda',
          icon: <Calendar size={20} />,
          onClick: () => navigate('/schedule'),
        },
        {
          id: 'reports',
          label: 'Relatórios',
          icon: <BarChart3 size={20} />,
          onClick: () => navigate('/reports'),
        },
      ],
    },
  ];

  // Add admin-only section
  if (userRole === 'admin') {
    sidebarSections.push({
      title: 'Administração',
      items: [
        {
          id: 'employees',
          label: 'Funcionários',
          icon: <UserCog size={20} />,
          onClick: () => navigate('/employees'),
        },
        {
          id: 'team',
          label: 'Equipe',
          icon: <UsersRound size={20} />,
          onClick: () => navigate('/team'),
        },
        {
          id: 'settings',
          label: 'Configurações',
          icon: <Settings size={20} />,
          onClick: () => navigate('/settings'),
        },
      ],
    });
  } else {
    // Non-admin users still see settings
    sidebarSections.push({
      title: 'Sistema',
      items: [
        {
          id: 'settings',
          label: 'Configurações',
          icon: <Settings size={20} />,
          onClick: () => navigate('/settings'),
        },
      ],
    });
  }

  // Get active ID from current path
  const getActiveId = () => {
    const path = location.pathname.split('/')[1];
    return path || 'dashboard';
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Navbar */}
      <Navbar
        user={{
          name: user?.displayName || user?.email || 'Usuário',
          email: user?.email || '',
          avatar: user?.photoURL,
        }}
        onSearch={(query) => {
          // TODO: Implement search functionality
        }}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        notificationCount={0}
      />

      {/* Sidebar */}
      <Sidebar
        sections={sidebarSections}
        activeId={getActiveId()}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 transition-all duration-300">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>

}
