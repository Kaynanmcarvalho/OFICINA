import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Botão de toggle para expandir/colapsar a sidebar
 * Design minimalista com animações fluidas
 */
export function SidebarToggleButton({ isExpanded, onClick }) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };
  
  // Variantes de animação para hover
  const buttonVariants = {
    rest: {
      scale: 1,
      transition: { duration: 0.2 }
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  // Variantes para rotação do ícone
  const iconVariants = {
    expanded: {
      rotate: 0,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    collapsed: {
      rotate: 180,
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  return (
    <motion.button
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={handleClick}
      type="button"
      aria-label={isExpanded ? 'Colapsar sidebar' : 'Expandir sidebar'}
      aria-expanded={isExpanded}
      className="
        absolute -right-3 top-20
        w-6 h-6 rounded-full
        bg-white/90 dark:bg-gray-900/90
        backdrop-blur-xl
        border border-gray-200/50 dark:border-gray-800/50
        shadow-lg shadow-gray-900/10 dark:shadow-black/30
        flex items-center justify-center
        cursor-pointer
        pointer-events-auto
        z-[60]
        hover:bg-gray-50/90 dark:hover:bg-gray-800/90
        hover:border-orange-400/50 dark:hover:border-orange-500/50
        hover:shadow-orange-500/20
        transition-all duration-200
      "
    >
      <motion.div
        variants={iconVariants}
        animate={isExpanded ? 'expanded' : 'collapsed'}
        className="flex items-center justify-center"
      >
        {isExpanded ? (
          <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-gray-300" strokeWidth={2.5} />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-300" strokeWidth={2.5} />
        )}
      </motion.div>
    </motion.button>

}
