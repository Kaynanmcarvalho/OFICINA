import { Outlet } from 'react-router-dom';
import { memo } from 'react';
import Navbar from './Navbar/Navbar';
import Sidebar from './Sidebar/Sidebar';
import { useUnifiedTheme } from '../../hooks/useUnifiedTheme';
import { useSidebarState } from '../../hooks/useSidebarState';
import { menuItems, footerItems } from '../Sidebar/sidebarConfig';

const LayoutPremium = memo(() => {
  const { isDark } = useUnifiedTheme();
  const { isCollapsed, toggleCollapse } = useSidebarState();
  
  // Alias para manter compatibilidade
  const toggleSidebar = toggleCollapse;

  return (
    <div className={`
      min-h-screen transition-all duration-300 ease-out
      ${isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }
    `}>
      {/* Navbar Premium */}
      <Navbar />
      
      {/* Sidebar e Conteúdo Principal */}
      <div className="relative flex">
        <Sidebar 
          menuItems={menuItems} 
          footerItems={footerItems} 
          isCollapsed={isCollapsed} 
          toggleSidebar={toggleSidebar} 
        />
        
        {/* Área de Conteúdo Principal */}
        <main 
          className={`
            flex-1 min-h-screen pt-16
            transition-all duration-300 ease-out
            ${isDark ? 'main-bg-dark' : 'main-bg-light'}
          `}
          style={{
            marginLeft: isCollapsed ? '64px' : '256px',
          }}
        >
          {/* Main Content */}
          <div className="relative">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Ambient Light Effects - Removidos para melhor performance */}
    </div>
  );
});

LayoutPremium.displayName = 'LayoutPremium';

export default LayoutPremium;
