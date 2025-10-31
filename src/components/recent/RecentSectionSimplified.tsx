import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RecentItemSimplified from './RecentItemSimplified';
import RecentSkeleton from './RecentSkeleton';
import EmptyState from './EmptyState';
import { RecordItem, ItemAction } from './RecentItem';

interface RecentSectionSimplifiedProps {
  items: RecordItem[];
  isLoading?: boolean;
  onItemClick?: (item: RecordItem) => void;
  onItemAction?: (action: ItemAction) => void;
  onItemSelect?: (id: string) => void;
  selectedItems?: Set<string>;
  title?: string;
}

const RecentSectionSimplified: React.FC<RecentSectionSimplifiedProps> = ({
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

  return (
    <div
      className="relative min-h-screen"
      onMouseMove={handleMouseMove}
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(59, 130, 246, 0.03) 0%, 
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
          className="absolute top-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
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
          className="absolute bottom-32 right-32 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Main content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        
        {/* Header section */}
        <motion.div 
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 0.8,
          }}
          className="mb-12"
        >
          <div className="relative">
            {/* Title with gradient and glow */}
            <div className="relative">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">
                {title}
              </h1>
              <div className="absolute inset-0 text-5xl font-bold text-white/5 blur-sm">
                {title}
              </div>
            </div>
            
            {/* Subtitle */}
            <p className="text-gray-400 text-lg font-medium mb-8">
              Acompanhe todos os registros com design premium e interações fluidas
            </p>

            {/* Stats bar */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.total}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Total</div>
                </div>
                <div className="w-px h-8 bg-gray-700" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">{stats.completed}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Concluídos</div>
                </div>
                <div className="w-px h-8 bg-gray-700" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{stats.inProgress}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Em Andamento</div>
                </div>
                <div className="w-px h-8 bg-gray-700" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{stats.pending}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Pendentes</div>
                </div>
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <RecentSkeleton count={5} />
              </motion.div>
            ) : items.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <EmptyState />
              </motion.div>
            ) : (
              <motion.div
                key="items"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {items.map((item, index) => (
                  <RecentItemSimplified
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

        {/* Floating action button */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <button className="group relative w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-110 active:scale-95">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <svg className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Ambient light effects */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(59, 130, 246, 0.1) 0%, 
              rgba(147, 51, 234, 0.05) 25%,
              transparent 50%
            )
          `,
        }}
      />
    </div>
  );
};

export default RecentSectionSimplified;