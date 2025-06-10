import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, useThemeStore } from '../../store/index.jsx';
import {
  MdDashboard,
  MdCheckCircle,
  MdPeople,
  MdTwoWheeler,
  MdInventory,
  MdBuild,
  MdGroup,
  MdCalendarToday,
  MdBarChart,
  MdSettings,
  MdMenu,
  MdLightMode,
  MdDarkMode,
  MdPerson,
  MdLogout,
  MdGarage
} from 'react-icons/md';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: MdDashboard },
    { path: '/checkin', name: 'Check-in', icon: MdCheckCircle },
    { path: '/clients', name: 'Clientes', icon: MdPeople },
    { path: '/motorcycles', name: 'Motos', icon: MdTwoWheeler },
    { path: '/inventory', name: 'Estoque', icon: MdInventory },
    { path: '/tools', name: 'Ferramentas', icon: MdBuild },
    { path: '/team', name: 'Equipe', icon: MdGroup },
    { path: '/schedule', name: 'Agenda', icon: MdCalendarToday },
    { path: '/reports', name: 'Relatórios', icon: MdBarChart },
    { path: '/settings', name: 'Configurações', icon: MdSettings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center justify-center h-16 px-4 bg-blue-600 dark:bg-blue-700">
          <MdGarage className="text-white text-2xl mr-2" />
          <h1 className="text-xl font-bold text-white">
            Oficina System
          </h1>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 text-lg" />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 relative z-50">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <MdMenu className="w-6 h-6" />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">
                Sistema de Gestão - Oficina
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
              >
                {isDarkMode ? <MdLightMode className="w-5 h-5" /> : <MdDarkMode className="w-5 h-5" />}
              </button>
              
              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.displayName || user?.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role || 'Usuário'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to="/profile"
                    className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    title="Perfil"
                  >
                    <MdPerson className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-md text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200"
                    title="Sair"
                  >
                    <MdLogout className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export { Layout };