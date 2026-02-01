import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';

/**
 * Rodapé da sidebar com botão de logout
 * Design discreto com animação de fade-out
 */
export function SidebarFooter({ isExpanded, onLogout }) {
  // Variantes de animação para o botão
  const buttonVariants = {
    rest: {
      scale: 1,
      transition: { duration: 0.2 }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  // Variantes para o label
  const labelVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: { delay: 0.1, duration: 0.2 }
    },
    collapsed: {
      opacity: 0,
      x: -10,
      transition: { duration: 0.15 }
    }
  };

  const handleLogout = async () => {
    // Animação de fade-out antes do logout
    if (onLogout) {
      await onLogout();
    }
  };

  return (
    <div className={`
      mt-auto p-4 border-t border-gray-200/30 dark:border-gray-800/30
    `}>
      <motion.button
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        onClick={handleLogout}
        aria-label="Sair da conta"
        className={`
          w-full flex items-center gap-3 px-4 py-3 rounded-2xl
          transition-all duration-200 cursor-pointer
          ${isExpanded ? 'justify-start' : 'justify-center'}
          text-gray-700 dark:text-gray-300
          hover:bg-red-500/15 dark:hover:bg-red-400/20
          hover:text-red-600 dark:hover:text-red-400
          hover:shadow-sm hover:ring-1 hover:ring-red-500/20
        `}
      >
        {/* Ícone de logout */}
        <motion.div
          className="flex-shrink-0 w-5 h-5"
          whileHover={{ rotate: 15 }}
          transition={{ duration: 0.2 }}
        >
          <LogOut className="w-5 h-5" strokeWidth={2} />
        </motion.div>

        {/* Label (apenas quando expandido) */}
        {isExpanded && (
          <motion.span
            variants={labelVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="text-sm font-medium tracking-tight whitespace-nowrap"
          >
            Sair
          </motion.span>
        )}
      </motion.button>
    </div>

}
