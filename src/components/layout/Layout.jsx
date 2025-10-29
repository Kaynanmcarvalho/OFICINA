import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, useThemeStore } from '../../store/index.jsx';
import Logo from '../Logo';
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
  MdSupervisorAccount,
  MdExpandMore,
  MdExpandLess,
  MdSearch,
  MdClose,
  MdPointOfSale
} from 'react-icons/md';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employeesMenuOpen, setEmployeesMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, userRole } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Itens pesquisáveis
  const searchableItems = [
    { name: 'Dashboard', path: '/dashboard', category: 'Página' },
    { name: 'Caixa', path: '/caixa', category: 'Página' },
    { name: 'PDV', path: '/caixa', category: 'Página' },
    { name: 'Ponto de Venda', path: '/caixa', category: 'Página' },
    { name: 'Check-in', path: '/checkin', category: 'Página' },
    { name: 'Clientes', path: '/clients', category: 'Página' },
    { name: 'Veículos', path: '/vehicles', category: 'Página' },
    { name: 'Estoque', path: '/inventory', category: 'Página' },
    { name: 'Ferramentas', path: '/tools', category: 'Página' },
    { name: 'Agenda', path: '/schedule', category: 'Página' },
    { name: 'Cronograma', path: '/schedule', category: 'Página' },
    { name: 'Relatórios', path: '/reports', category: 'Página' },
    { name: 'Configurações', path: '/settings', category: 'Página' },
    { name: 'Integrações', path: '/integrations', category: 'Página' },
    { name: 'Nota Fiscal', path: '/integrations', category: 'Configuração' },
    { name: 'NF-e', path: '/integrations', category: 'Configuração' },
    { name: 'Certificado Digital', path: '/integrations', category: 'Configuração' },
    { name: 'Funcionários', path: '/employees', category: 'Página' },
    { name: 'Equipe', path: '/team', category: 'Página' },
    { name: 'Perfil', path: '/profile', category: 'Página' },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = searchableItems.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleSearchItemClick = (path) => {
    navigate(path);
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: MdDashboard, color: 'blue' },
    { path: '/caixa', name: 'Caixa / PDV', icon: MdPointOfSale, color: 'green' },
    { path: '/checkin', name: 'Check-in', icon: MdCheckCircle, color: 'blue' },
    { path: '/clients', name: 'Clientes', icon: MdPeople, color: 'blue' },
    { path: '/vehicles', name: 'Veículos', icon: MdTwoWheeler, color: 'blue' },
    { path: '/inventory', name: 'Estoque', icon: MdInventory, color: 'blue' },
    { path: '/tools', name: 'Ferramentas', icon: MdBuild, color: 'blue' },
    { path: '/schedule', name: 'Agenda', icon: MdCalendarToday, color: 'blue' },
    { path: '/reports', name: 'Relatórios', icon: MdBarChart, color: 'amber' },
    { path: '/settings', name: 'Configurações', icon: MdSettings, color: 'blue' },
  ];

  const employeesSubmenu = [
    { path: '/employees', name: 'Funcionários', icon: MdSupervisorAccount },
    { path: '/team', name: 'Equipe', icon: MdGroup },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}>
        <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-gray-800 dark:to-gray-900">
          <Logo 
            size="medium"
            onClick={() => {
              navigate('/dashboard');
              setSidebarOpen(false);
            }}
            className="cursor-pointer"
          />
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isAmber = item.color === 'amber';
              const isGreen = item.color === 'green';
              const isRed = item.color === 'red';

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                    ? isAmber
                      ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-200'
                      : isGreen
                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'
                      : isRed
                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'
                      : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 text-lg" />
                  {item.name}
                </Link>
              );
            })}

            {/* Employees Menu with Submenu (Admin only) */}
            {userRole === 'admin' && (
              <div>
                <button
                  onClick={() => setEmployeesMenuOpen(!employeesMenuOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center">
                    <MdSupervisorAccount className="mr-3 text-lg" />
                    <span>Gestão de Pessoas</span>
                  </div>
                  {employeesMenuOpen ? (
                    <MdExpandLess className="text-lg" />
                  ) : (
                    <MdExpandMore className="text-lg" />
                  )}
                </button>

                {/* Submenu */}
                {employeesMenuOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {employeesSubmenu.map((subItem) => {
                      const isActive = location.pathname === subItem.path;

                      return (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <subItem.icon className="mr-3 text-base" />
                          {subItem.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
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
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                {!searchOpen ? (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Buscar"
                  >
                    <MdSearch className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Buscar..."
                        autoFocus
                        className="w-64 px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <button
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <MdClose className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Search Results Dropdown */}
                {searchOpen && searchResults.length > 0 && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                    <div className="p-2">
                      {searchResults.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearchItemClick(item.path)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.category}
                              </p>
                            </div>
                            <MdSearch className="w-4 h-4 text-gray-400" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {searchOpen && searchQuery && searchResults.length === 0 && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Nenhum resultado encontrado
                    </p>
                  </div>
                )}
              </div>

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