import { Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/index.jsx';
import Navbar from '../Navbar';
import { SidebarAppleLike } from '../Sidebar/SidebarAppleLike';
import { useSidebarState } from '../Sidebar/useSidebarState';

const Layout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isExpanded } = useSidebarState();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Variantes de animação iOS-like para o conteúdo principal
  const contentVariants = {
    expanded: {
      marginLeft: 240,
      paddingLeft: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }
    },
    collapsed: {
      marginLeft: 72,
      paddingLeft: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }
    }
  };

  // Variantes para animação sutil do conteúdo interno
  const innerContentVariants = {
    expanded: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1] // iOS cubic-bezier
      }
    },
    collapsed: {
      scale: 0.98,
      opacity: 0.95,
      transition: {
        duration: 0.2,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg overflow-x-hidden">
      {/* Gradient radial sutil para profundidade no dark mode */}
      <div className="fixed inset-0 pointer-events-none dark:block hidden">
        <div className="absolute inset-0 bg-gradient-radial from-dark-surface/20 via-transparent to-transparent" />
      </div>
      
      {/* Sidebar Apple Premium */}
      <SidebarAppleLike
        defaultExpanded={true}
        user={{
          name: user?.displayName || user?.email?.split('@')[0] || 'Usuário',
          email: user?.email,
          avatar: user?.photoURL
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Area - Animação fluida iOS-like */}
      <motion.div
        variants={contentVariants}
        initial={isExpanded ? 'expanded' : 'collapsed'}
        animate={isExpanded ? 'expanded' : 'collapsed'}
        className="min-h-screen w-full flex flex-col overflow-x-hidden"
        style={{
          // Força aceleração por GPU
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          perspective: 1000,
          willChange: 'margin-left',
          maxWidth: '100vw'
        }}
      >
        {/* Navbar Premium */}
        <Navbar 
          onLogout={handleLogout}
          user={user}
          onMenuClick={null}
        />

        {/* Page Content com animação sutil */}
        <motion.main
          variants={innerContentVariants}
          initial="expanded"
          animate={isExpanded ? 'expanded' : 'collapsed'}
          className="flex-1 p-6 overflow-auto"
          style={{
            transformOrigin: 'left center'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isExpanded ? 'expanded' : 'collapsed'}
              initial={{ opacity: 0.95 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.95 }}
              transition={{
                duration: 0.2,
                ease: [0.4, 0.0, 0.2, 1]
              }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </motion.div>
    </div>
  );
};

export { Layout };