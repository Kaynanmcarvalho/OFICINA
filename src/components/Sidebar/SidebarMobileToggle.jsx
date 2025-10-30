/**
 * Botão de menu hamburguer para mobile
 * Aparece apenas em telas pequenas
 * Design minimalista com animação
 */

import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

/**
 * Variants para animação do botão
 */
const buttonVariants = {
  rest: {
    scale: 1,
    transition: { duration: 0.2 }
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

/**
 * Componente de botão mobile toggle
 */
const SidebarMobileToggle = ({ isOpen, onClick }) => {
  return (
    <motion.button
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className="
        fixed top-4 left-4 z-50
        lg:hidden
        flex items-center justify-center
        w-10 h-10 rounded-xl
        bg-white/90 dark:bg-gray-800/90
        backdrop-blur-md
        border border-gray-200/50 dark:border-gray-700/50
        shadow-lg
        hover:shadow-xl
        transition-all duration-200
        cursor-pointer
      "
      aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
      aria-expanded={isOpen}
    >
      <motion.div
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {isOpen ? (
          <X 
            size={20} 
            className="text-gray-700 dark:text-gray-300"
            strokeWidth={2}
          />
        ) : (
          <Menu 
            size={20} 
            className="text-gray-700 dark:text-gray-300"
            strokeWidth={2}
          />
        )}
      </motion.div>
    </motion.button>
  );
};

export default SidebarMobileToggle;
