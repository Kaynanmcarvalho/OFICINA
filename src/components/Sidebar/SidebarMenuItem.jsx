import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Item individual de menu da sidebar
 * Aplica animações Apple-like e destaque visual para rota ativa
 */
export function SidebarMenuItem({ icon: Icon, label, path, isExpanded, onClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Detecta se este item está ativo baseado na rota atual
  const isActive = location.pathname === path;

  // Variantes de animação para hover e click
  const itemVariants = {
    rest: {
      scale: 1,
      y: 0,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    hover: {
      scale: 1.02,
      y: -1,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  // Variantes para o label (fade in/out baseado em expansão)
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

  // Variantes para o glow effect no item ativo - Apple Orange
  const glowVariants = {
    active: {
      boxShadow: [
        '0 0 10px rgba(251, 146, 60, 0.3)',
        '0 0 20px rgba(251, 146, 60, 0.5)',
        '0 0 10px rgba(251, 146, 60, 0.3)'
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  const handleClick = () => {
    navigate(path);
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.button
      variants={itemVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      animate={isActive ? glowVariants.active : 'rest'}
      onClick={handleClick}
      aria-current={isActive ? 'page' : undefined}
      aria-label={label}
      role="link"
      className={`
        w-full flex items-center gap-3 rounded-2xl
        transition-all duration-200 cursor-pointer
        ${isExpanded ? 'px-4 py-3 mx-2 justify-start' : 'px-3 py-3 mx-auto justify-center w-12'}
        ${isActive 
          ? `bg-gradient-to-r from-orange-500/15 to-red-500/15 
             dark:from-orange-400/25 dark:to-red-400/25
             text-orange-600 dark:text-orange-400
             ring-1 ring-orange-500/30 dark:ring-orange-400/40
             shadow-[0_0_20px_rgba(251,146,60,0.3)]`
          : `text-gray-700 dark:text-gray-300
             hover:bg-gray-100/60 dark:hover:bg-gray-800/60
             hover:text-gray-900 dark:hover:text-white
             hover:shadow-sm`
        }
      `}
    >
      {/* Ícone com efeito de brilho escovado quando ativo */}
      <motion.div
        className={`
          flex-shrink-0 w-5 h-5
          ${isActive ? 'drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]' : ''}
        `}
        animate={isActive ? {
          filter: [
            'brightness(1)',
            'brightness(1.2)',
            'brightness(1)'
          ]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
      </motion.div>

      {/* Label com fade in/out */}
      {isExpanded && (
        <motion.span
          variants={labelVariants}
          initial="collapsed"
          animate="expanded"
          exit="collapsed"
          className="text-sm font-medium tracking-tight whitespace-nowrap"
        >
          {label}
        </motion.span>
      )}
    </motion.button>

}
