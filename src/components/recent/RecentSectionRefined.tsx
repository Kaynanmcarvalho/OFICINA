import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RecentItemRefined from './RecentItemRefined';
import RecentSkeleton from './RecentSkeleton';
import EmptyState from './EmptyState';
import { RecordItem, ItemAction } from './RecentItem';

interface RecentSectionRefinedProps {
  items: RecordItem[];
  isLoading?: boolean;
  onItemClick?: (item: RecordItem) => void;
  onItemAction?: (action: ItemAction) => void;
  onItemSelect?: (id: string) => void;
  selectedItems?: Set<string>;
  title?: string;
}

const RecentSectionRefined: React.FC<RecentSectionRefinedProps> = ({
  items,
  isLoading = false,
  onItemClick,
  onItemAction,
  onItemSelect,
  selectedItems = new Set(),
  title = "Registros Recentes"
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  // Stats calculation
  const stats = {
    total: items.length,
    completed: items.filter(item => item.status === 'completed').length,
    inProgress: items.filter(item => item.status === 'in_progress').length,
    pending: items.filter(item => item.status === 'pending').length,
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  // Header animation variants
  const headerVariants = {
    hidden: { 
      opacity: 0, 
      y: -20,
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

  return (
    <div
      className="relative min-h-screen"
      onMouseMove={handleMouseMove}
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(59, 130, 246, 0.02) 0%, 
            transparent 50%
          ),
          linear-gradient(135deg, 
            #0a0a0b 0%, 
            #111113 25%, 
            #0f0f11 50%, 
            #141416 75%, 
            #0a0a0b 100%
          )
        `,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs with smoother animation */}
        <motion.div 
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute bottom-32 right-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Main content container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-6xl mx-auto px-6 py-8"
      >
        
        {/* Header section */}
        <motion.div 
          variants={headerVariants}
          className="mb-8"
        >
          <div className="relative">
            {/* Title with refined gradient */}
            <div className="relative mb-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                {title}
              </h1>
              <motion.div 
                className="absolute inset-0 text-4xl font-bold text-white/3 blur-sm"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {title}
              </motion.div>
            </div>
            
            {/* Subtitle */}
            <p className="text-gray-400 text-base font-medium mb-6">
              Gerencie suas atividades com eficiência e estilo
            </p>

            {/* Stats bar with refined styling */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-5">
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="text-xl font-bold text-white">{stats.total}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Total</div>
                </motion.div>
                <div className="w-px h-6 bg-gray-700/50" />
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="text-xl font-bold text-emerald-400">{stats.completed}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Concluídos</div>
                </motion.div>
                <div className="w-px h-6 bg-gray-700/50" />
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="text-xl font-bold text-amber-400">{stats.inProgress}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Em Andamento</div>
                </motion.div>
                <div className="w-px h-6 bg-gray-700/50" />
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="text-xl font-bold text-blue-400">{stats.pending}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Pendentes</div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content area */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 20 
                }}
              >
                <RecentSkeleton count={5} />
              </motion.div>
            ) : items.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 20 
                }}
              >
                <EmptyState />
              </motion.div>
            ) : (
              <motion.div
                key="items"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {items.map((item, index) => (
                  <RecentItemRefined
                    key={item.id}
                    item={item}
                    index={index}
                    isSelected={selectedItems.has(item.id)}
                    onSelect={onItemSelect}
                    onClick={() => onItemClick?.(item)}
                    onAction={onItemAction}
                    showCheckbox={selectedItems.size > 0}
                    delay={index}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating action button with refined animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            delay: 0.8, 
            type: "spring", 
            stiffness: 300, 
            damping: 20 
          }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.button 
            className="group relative w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/20 transition-all duration-300"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <svg className="w-6 h-6 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Refined ambient light effects */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(59, 130, 246, 0.05) 0%, 
              rgba(147, 51, 234, 0.02) 25%,
              transparent 50%
            )
          `,
        }}
      />
    </div>
  );
};

export default RecentSectionRefined;