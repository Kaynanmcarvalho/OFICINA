import { Outlet } from 'react-router-dom';
import { memo, lazy, Suspense, useState, useEffect } from 'react';
import { useUnifiedTheme } from '../../hooks/useUnifiedTheme';
import { useSidebarState } from '../../hooks/useSidebarState';

// Lazy load Navbar e Sidebar
const Navbar = lazy(() => import('./Navbar/Navbar'));
const Sidebar = lazy(() => import('./Sidebar/Sidebar'));

// Try to import useEmpresa safely
let useEmpresa = () => null;
try {
  const empresaModule = require('../../contexts/EmpresaContext');
  useEmpresa = empresaModule.useEmpresa;
} catch (e) {
  // EmpresaContext not available
}

const LayoutPremium = memo(() => {
  const { isDark } = useUnifiedTheme();
  const { isCollapsed, toggleCollapse } = useSidebarState();
  
  // Safe empresa access
  let empresa = null;
  try {
    empresa = useEmpresa();
  } catch (e) {
    // EmpresaContext not available
  }
  
  const toggleSidebar = toggleCollapse;
  const topPadding = empresa?.isImpersonating ? 'pt-[112px]' : 'pt-16';
  
  // Load sidebar config
  const [sidebarConfig, setSidebarConfig] = useState({ menuItems: [], footerItems: [] });
  
  useEffect(() => {
    import('../Sidebar/sidebarConfig').then(mod => {
      setSidebarConfig({ menuItems: mod.menuItems, footerItems: mod.footerItems });
    });
  }, []);

  return (
    <div className={`
      min-h-screen transition-colors duration-200
      ${isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }
    `}>
      {/* Navbar Premium */}
      <Suspense fallback={<div className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50" />}>
        <Navbar />
      </Suspense>
      
      {/* Sidebar e Conteúdo Principal */}
      <div className="relative flex">
        <Suspense fallback={<div className="w-64 h-screen bg-white/50 dark:bg-gray-900/50 fixed left-0 top-16" />}>
          <Sidebar 
            menuItems={sidebarConfig.menuItems} 
            footerItems={sidebarConfig.footerItems} 
            isCollapsed={isCollapsed} 
            toggleSidebar={toggleSidebar} 
          />
        </Suspense>
        
        {/* Área de Conteúdo Principal */}
        <main 
          className={`
            flex-1 min-h-screen ${topPadding}
            transition-[margin] duration-200
            ${isDark ? 'main-bg-dark' : 'main-bg-light'}
          `}
          style={{
            marginLeft: isCollapsed ? '64px' : '256px',
          }}
        >
          <div className="relative">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
});

LayoutPremium.displayName = 'LayoutPremium';

export default LayoutPremium;
