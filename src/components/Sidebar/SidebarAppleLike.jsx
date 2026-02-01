import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarState } from './useSidebarState';
import { SidebarMenuItem } from './SidebarMenuItem';
import { SidebarToggleButton } from './SidebarToggleButton';
import { SidebarFooter } from './SidebarFooter';
import { menuItems } from './sidebarConfig';

/**
 * Sidebar Apple-like Premium
 * 
 * Componente de navegação lateral inspirado no design da Apple
 * com estética minimalista, animações fluidas e efeitos glassmorphism.
 * 
 * Features:
 * - Expansão/colapso com animação spring
 * - Persistência de estado no LocalStorage
 * - Detecção automática de rota ativa
 * - Suporte a tema claro/escuro
 * - Microanimações em hover e click
 * - Efeito glow em item ativo
 * 
 * @param {Object} props
 * @param {string} props.className - Classes CSS adicionais
 * @param {boolean} props.defaultExpanded - Estado inicial (padrão: true)
 * @param {Function} props.onNavigate - Callback ao navegar
 * @param {Object} props.user - Dados do usuário (name, email, avatar)
 * @param {Function} props.onLogout - Callback ao fazer logout
 */
export function SidebarAppleLike({ 
  className = '', 
  defaultExpanded = true,
  onNavigate,
  user,
  onLogout
}) {
  const { isExpanded, toggleExpanded, setExpanded } = useSidebarState(defaultExpanded);
  const [isMobile, setIsMobile] = React.useState(false);

  // Detectar tamanho da tela para responsividade
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Em mobile/tablet, iniciar colapsado
      if (mobile && isExpanded) {
        setExpanded(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isExpanded, setExpanded]);

  // Variantes de animação para a sidebar
  const sidebarVariants = {
    expanded: {
      width: 240,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }
    },
    collapsed: {
      width: 72,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }
    }
  };

  // Variantes para fade in inicial
  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      }
    }
  };

  return (
    <>
      {/* Backdrop para mobile (quando expandido) */}
      <AnimatePresence>
        {isMobile && isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setExpanded(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.aside
        variants={sidebarVariants}
        initial={isExpanded ? 'expanded' : 'collapsed'}
        animate={isExpanded ? 'expanded' : 'collapsed'}
        role="complementary"
        aria-label="Sidebar de navegação"
        className={`
          fixed left-0 top-0 h-screen z-30
          flex flex-col
          sidebar-premium
          focus-within:ring-2 focus-within:ring-orange-500/20
          ${className}
        `}
      >

      {/* Botão de toggle */}
      <SidebarToggleButton 
        isExpanded={isExpanded} 
        onClick={toggleExpanded}
      />

      {/* Espaçamento superior */}
      <div className="h-6" />

      {/* Lista de itens de menu */}
      <motion.nav
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-1 scrollbar-hide"
        aria-label="Navegação principal"
        role="navigation"
      >
        <AnimatePresence mode="wait">
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: index * 0.05 }
                }}
              >
                <SidebarMenuItem
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  isExpanded={isExpanded}
                  onClick={() => {
                    // Fechar sidebar em mobile após navegação
                    if (isMobile) {
                      setTimeout(() => setExpanded(false), 300);
                    }
                  }}
                />
              </motion.div>

              {/* Divisor após item específico (se configurado) */}
              {item.dividerAfter && (
                <div className="mx-4 my-2 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
              )}
            </React.Fragment>
          ))}
        </AnimatePresence>
      </motion.nav>

      {/* Footer com botão de logout */}
      <SidebarFooter 
        isExpanded={isExpanded}
        onLogout={onLogout}
      />
      </motion.aside>
    </>

}
