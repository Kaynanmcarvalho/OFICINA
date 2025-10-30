import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

/**
 * Header da sidebar com avatar e informações do usuário
 * Preparado para integração futura com Firebase Auth
 */
export function SidebarHeader({ isExpanded, user }) {
  // Variantes de animação para entrada do header
  const headerVariants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      }
    }
  };

  // Variantes para o nome do usuário
  const nameVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: { delay: 0.15, duration: 0.3 }
    },
    collapsed: {
      opacity: 0,
      x: -10,
      transition: { duration: 0.2 }
    }
  };

  // Dados padrão enquanto não há integração com Firebase
  const displayName = user?.name || 'Usuário';
  const displayEmail = user?.email || 'usuario@oficina.com';
  const avatarUrl = user?.avatar;

  return (
    <motion.div
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className={`
        flex items-center gap-3 p-4 mb-2
        ${isExpanded ? 'justify-start' : 'justify-center'}
      `}
    >
      {/* Avatar circular com efeito glassmorphism */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          relative flex-shrink-0
          ${isExpanded ? 'w-10 h-10' : 'w-10 h-10'}
        `}
      >
        <div className="
          w-full h-full rounded-full overflow-hidden
          bg-gradient-to-br from-orange-400 to-red-500
          backdrop-blur-sm
          ring-2 ring-white/20 dark:ring-gray-700/30
          shadow-lg
          flex items-center justify-center
        ">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-white" strokeWidth={2} />
          )}
        </div>

        {/* Indicador de status online (ponto verde) */}
        <div className="
          absolute bottom-0 right-0
          w-3 h-3 rounded-full
          bg-green-500 dark:bg-green-400
          ring-2 ring-white dark:ring-gray-900
          shadow-sm
        " />
      </motion.div>

      {/* Informações do usuário (apenas quando expandido) */}
      {isExpanded && (
        <motion.div
          variants={nameVariants}
          initial="collapsed"
          animate="expanded"
          exit="collapsed"
          className="flex flex-col min-w-0 flex-1"
        >
          <span className="
            text-sm font-semibold text-gray-900 dark:text-gray-100
            tracking-tight truncate
          ">
            {displayName}
          </span>
          <span className="
            text-xs text-gray-500 dark:text-gray-400
            truncate
          ">
            {displayEmail}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
