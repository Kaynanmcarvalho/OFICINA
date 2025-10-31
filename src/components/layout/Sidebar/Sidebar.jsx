import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarState } from '../../../hooks/useSidebarState';
import { useThemeStore } from '../../../store/index.jsx';
import { sidebarAnimations, overlayVariants, mobileSidebarVariants } from '../../../utils/animations';
import SidebarLogo from './SidebarLogo';
import SidebarNav from './SidebarNav';
import SidebarFooter from './SidebarFooter';

const Sidebar = ({ menuItems, footerItems }) => {
  const { isCollapsed, toggleCollapse } = useSidebarState();
  const { isDarkMode } = useThemeStore();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  // Check if mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  // Close mobile sidebar when clicking outside
  const handleOverlayClick = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  // Prevent body scroll when mobile sidebar is open
  React.useEffect(() => {
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
    ? 'fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-500 bg-gradient-to-b from-[#0d0d0f] to-[#1a1a1c] border-r border-white/[0.08] backdrop-blur-[22px]'
    : 'fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-500 bg-white/[0.65] border-r border-black/[0.06] backdrop-blur-[20px]';

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className={`${sidebarClasses} hidden lg:flex`}
        style={{
          boxShadow: isDarkMode 
            ? '0 0 40px rgba(0,0,0,0.3)' 
            : '0 0 40px rgba(0,0,0,0.05)'
        }}
        initial={false}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        variants={sidebarAnimations}
        aria-label="Navegação principal"
        aria-expanded={!isCollapsed}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo Section */}
          <SidebarLogo isCollapsed={isCollapsed} />

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
            <SidebarNav 
              items={menuItems} 
              isCollapsed={isCollapsed}
            />
          </div>

          {/* Footer Section */}
          <SidebarFooter 
            items={footerItems}
            isCollapsed={isCollapsed}
            onToggleCollapse={toggleCollapse}
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
                <SidebarLogo isCollapsed={false} />
                
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
                  <SidebarNav 
                    items={menuItems} 
                    isCollapsed={false}
                    onItemClick={() => setIsMobileOpen(false)}
                  />
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
};

export default Sidebar;
