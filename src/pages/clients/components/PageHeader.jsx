/**
 * PageHeader - Header da página de clientes com design Apple-like
 * Inclui título, badge de contagem e botão "Novo Cliente"
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import AppleButton from './base/AppleButton';

const PageHeader = ({ clientCount = 0, onNewClient }) => {
  const { isDark } = useTheme();
  
  // Keyboard shortcut: ⌘+N / Ctrl+N para novo cliente
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Detectar Cmd (Mac) ou Ctrl (Windows/Linux) + N
      if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
        event.preventDefault();
        onNewClient?.();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNewClient]);
  
  // Animação do header
  const headerVariants = {
    hidden: { 
      opacity: 0, 
      y: -20 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 0.8,
      },
    },
  };
  
  // Animação do badge
  const badgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        delay: 0.1,
      },
    },
  };
  
  return (
    <motion.div
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="relative"
      style={{
        paddingTop: '64px',
        paddingBottom: '32px',
      }}
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        
        {/* Título e Badge */}
        <div className="flex items-center gap-4">
          <h1 
            className="font-bold text-gray-900 dark:text-white"
            style={{
              fontSize: '48px',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              textShadow: isDark 
                ? '0 2px 4px rgba(0,0,0,0.5)' 
                : '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            Gestão de Clientes
          </h1>
          
          {/* Badge com contagem */}
          <motion.div
            variants={badgeVariants}
            className="relative"
          >
            <div
              className="px-4 py-2 rounded-full font-semibold text-sm"
              style={{
                background: isDark 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.05)',
                border: isDark
                  ? '1px solid rgba(255, 255, 255, 0.15)'
                  : '1px solid rgba(0, 0, 0, 0.1)',
                color: isDark ? '#98989d' : '#6e6e73',
              }}
            >
              {clientCount} {clientCount === 1 ? 'cliente' : 'clientes'}
            </div>
          </motion.div>
        </div>
        
        {/* Botão Novo Cliente */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.2,
          }}
        >
          <AppleButton
            variant="primary"
            size="lg"
            icon={Plus}
            iconPosition="left"
            onClick={onNewClient}
            className="relative group"
          >
            Novo Cliente
            
            {/* Hint de atalho de teclado */}
            <motion.div
              className="absolute -top-8 right-0 px-2 py-1 rounded-lg text-xs font-mono opacity-0 pointer-events-none"
              style={{
                background: isDark ? 'rgba(28, 28, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                color: isDark ? '#98989d' : '#6e6e73',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
            >
              ⌘N
            </motion.div>
          </AppleButton>
        </motion.div>
      </div>
      
      {/* Subtítulo */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-3 font-medium"
        style={{
          fontSize: '17px',
          color: isDark ? '#98989d' : '#6e6e73',
          letterSpacing: '-0.01em',
        }}
      >
        Gerencie seus clientes com eficiência e estilo
      </motion.p>
    </motion.div>
  );
};

export default PageHeader;
