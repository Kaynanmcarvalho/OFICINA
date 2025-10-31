import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmptyStateUltraProps {
  onCreateNew?: () => void;
  onClearFilters?: () => void;
  searchQuery?: string;
  hasFilters?: boolean;
}

const EmptyStateUltra: React.FC<EmptyStateUltraProps> = ({
  onCreateNew,
  onClearFilters,
  searchQuery,
  hasFilters = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasSearchOrFilters = Boolean(searchQuery) || hasFilters;

  // Floating animation variants
  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 1, -1, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Icon animation variants
  const iconVariants = {
    initial: { scale: 0, rotate: -180, opacity: 0 },
    animate: { 
      scale: 1, 
      rotate: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      }
    }
  };

  // Text animation variants
  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.4,
        duration: 0.6,
        ease: "easeOut",
      }
    },
  };

  // Button animation variants
  const buttonVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: 0.6,
        type: "spring",
        stiffness: 200,
        damping: 15,
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="relative flex flex-col items-center justify-center py-24 px-8 text-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <motion.div 
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-10 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"
        />
        <motion.div 
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-md">
        
        {/* Icon container */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="relative mb-8"
        >
          <motion.div
            variants={iconVariants}
            whileHover="hover"
            className="relative"
          >
            {/* Icon glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl scale-150" />
            
            {/* Icon container */}
            <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/40 flex items-center justify-center">
              
              {/* Top highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              
              {/* Icon */}
              {hasSearchOrFilters ? (
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              ) : (
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              
              {/* Animated particles */}
              <AnimatePresence>
                {isHovered && (
                  <>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                          x: [0, (Math.random() - 0.5) * 100],
                          y: [0, (Math.random() - 0.5) * 100],
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          duration: 2,
                          delay: i * 0.1,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                        className="absolute w-1 h-1 bg-blue-400 rounded-full"
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h3 
          variants={textVariants}
          className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4"
        >
          {hasSearchOrFilters 
            ? "Nenhum resultado encontrado" 
            : "Nenhum registro ainda"
          }
        </motion.h3>

        {/* Description */}
        <motion.p 
          variants={textVariants}
          className="text-gray-400 text-lg leading-relaxed mb-8"
        >
          {hasSearchOrFilters 
            ? "Não encontramos registros que correspondam aos critérios aplicados. Tente ajustar os filtros ou busca."
            : "Comece criando seu primeiro registro e acompanhe todas as atividades com nossa interface premium."
          }
        </motion.p>

        {/* Actions */}
        <motion.div 
          variants={textVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {hasSearchOrFilters && onClearFilters && (
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={onClearFilters}
              className="group relative px-6 py-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/60 hover:to-gray-600/60 text-gray-300 rounded-2xl font-medium transition-all duration-300 border border-white/10 backdrop-blur-xl shadow-lg shadow-black/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative">Limpar Filtros</span>
            </motion.button>
          )}

          {onCreateNew && (
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={onCreateNew}
              className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Criar Primeiro Registro
              </span>
            </motion.button>
          )}
        </motion.div>

        {/* Additional help text */}
        {!hasSearchOrFilters && (
          <motion.p 
            variants={textVariants}
            className="text-xs text-gray-500 mt-8 opacity-60"
          >
            Os registros aparecerão aqui conforme forem criados
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default EmptyStateUltra;