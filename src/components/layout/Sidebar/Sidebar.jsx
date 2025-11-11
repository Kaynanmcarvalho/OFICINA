import { memo, useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../../store/index.jsx';
import { sidebarAnimations, overlayVariants, mobileSidebarVariants } from '../../../utils/animations';
import SidebarNav from './SidebarNav';
import SidebarFooter from './SidebarFooter';
import { useSuperAdmin } from '../../../hooks/useSuperAdmin';
import { superAdminItems } from '../../Sidebar/sidebarConfig';
import './Sidebar.css';

const Sidebar = memo(({ menuItems, footerItems, isCollapsed, toggleSidebar }) => {
  const { isDarkMode } = useThemeStore();
  const { isSuperAdmin } = useSuperAdmin();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Check if mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  // Close mobile sidebar when clicking outside
  const handleOverlayClick = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isMobileOpen]);

  const sidebarClasses = isDarkMode
    ? 'fixed left-0 z-40 flex flex-col bg-gradient-to-b from-[#0d0d0f] to-[#1a1a1c] border-r border-black/60 shadow-[2px_0_12px_rgba(0,0,0,0.4)] backdrop-blur-[22px]'
    : 'fixed left-0 z-40 flex flex-col bg-white/[0.65] border-r border-black/25 shadow-[2px_0_12px_rgba(0,0,0,0.16)] backdrop-blur-[20px]';

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className={`${sidebarClasses} hidden lg:flex`}
        style={{
          top: '64px',
          height: 'calc(100vh - 64px)',
          boxShadow: isDarkMode 
            ? '0 0 40px rgba(0,0,0,0.3)' 
            : '0 0 40px rgba(0,0,0,0.05)'
        }}
        initial={false}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        variants={sidebarAnimations}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8
        }}
        aria-label="Navegação principal"
        aria-expanded={!isCollapsed}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Navigation */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
            <SidebarNav 
              items={menuItems} 
              isCollapsed={isCollapsed}
            />
            
            {/* Super Admin Section */}
            {isSuperAdmin && (
              <>
                <div className="my-4 border-t border-red-500/30" />
                <SidebarNav 
                  items={superAdminItems} 
                  isCollapsed={isCollapsed}
                />
              </>
            )}
          </div>

          {/* Footer Section */}
          <SidebarFooter 
            items={footerItems}
            isCollapsed={isCollapsed}
            onToggleCollapse={toggleSidebar}
          />
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-30 bg-black/50 lg:hidden"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
              onClick={handleOverlayClick}
            />

            {/* Sidebar */}
            <motion.aside
              className={`${sidebarClasses} lg:hidden w-64`}
              style={{
                top: '64px',
                height: 'calc(100vh - 64px)',
                boxShadow: isDarkMode 
                  ? '0 0 40px rgba(0,0,0,0.3)' 
                  : '0 0 40px rgba(0,0,0,0.05)'
              }}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileSidebarVariants}
            >
              <div className="flex flex-col h-full overflow-hidden">
                
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
                  <SidebarNav 
                    items={menuItems} 
                    isCollapsed={false}
                    onItemClick={() => setIsMobileOpen(false)}
                  />
                  
                  {/* Super Admin Section - Mobile */}
                  {isSuperAdmin && (
                    <>
                      <div className="my-4 border-t border-red-500/30" />
                      <SidebarNav 
                        items={superAdminItems} 
                        isCollapsed={false}
                        onItemClick={() => setIsMobileOpen(false)}
                      />
                    </>
                  )}
                </div>

                <SidebarFooter 
                  items={footerItems}
                  isCollapsed={false}
                  onToggleCollapse={() => setIsMobileOpen(false)}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
