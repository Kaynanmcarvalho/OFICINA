import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar/Navbar';
import { Sidebar } from './Sidebar/Sidebar';
import { useTheme } from '../../hooks/useTheme';
import { useSidebarState } from '../../hooks/useSidebarState';

const LayoutPremium = () => {
  console.log('🎨 LayoutPremium ATIVO - Design Apple-level carregado!');
  
  const { isDark } = useTheme();
  const { isCollapsed } = useSidebarState();

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
      
      <div className="flex">
        {/* Sidebar Premium */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main 
          className={`
            flex-1 transition-all duration-300 ease-out
            ${isCollapsed ? 'ml-16' : 'ml-64'}
            pt-16 min-h-[calc(100vh-4rem)]
          `}
          style={{
            background: isDark 
              ? `
                linear-gradient(135deg, 
                  rgba(17, 24, 39, 0.95) 0%,
                  rgba(31, 41, 55, 0.9) 50%,
                  rgba(55, 65, 81, 0.95) 100%
                ),
                radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
              `
              : `
                linear-gradient(135deg, 
                  rgba(248, 250, 252, 0.95) 0%,
                  rgba(255, 255, 255, 0.9) 50%,
                  rgba(241, 245, 249, 0.95) 100%
                ),
                radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
              `,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Content Container */}
          <div className="relative">
            {/* Subtle overlay for depth */}
            <div 
              className={`
                absolute inset-0 pointer-events-none
                ${isDark 
                  ? 'bg-gradient-to-b from-transparent via-gray-900/5 to-gray-900/10' 
                  : 'bg-gradient-to-b from-transparent via-white/5 to-gray-50/10'
                }
              `} 
            />
            
            {/* Main Content */}
            <div className="relative z-10 p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      
      {/* Ambient Light Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top ambient light */}
        <div 
          className={`
            absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl
            ${isDark ? 'bg-blue-500' : 'bg-blue-300'}
          `}
          style={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)'
          }}
        />
        
        {/* Bottom ambient light */}
        <div 
          className={`
            absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl
            ${isDark ? 'bg-purple-500' : 'bg-purple-300'}
          `}
          style={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)'
          }}
        />
      </div>
    </div>
  );
};

export { LayoutPremium };
