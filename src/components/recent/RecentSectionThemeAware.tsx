import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RecentItemThemeAware from './RecentItemThemeAware';
import RecentSkeleton from './RecentSkeleton';
import EmptyState from './EmptyState';
import { RecordItem, ItemAction } from './RecentItem';
import { useTheme } from '../../hooks/useTheme';

interface RecentSectionThemeAwareProps {
  items: RecordItem[];
  isLoading?: boolean;
  onItemClick?: (item: RecordItem) => void;
  onItemAction?: (action: ItemAction) => void;
  onItemSelect?: (id: string) => void;
  selectedItems?: Set<string>;
  title?: string;
}

const RecentSectionThemeAware: React.FC<RecentSectionThemeAwareProps> = ({
  items,
  isLoading = false,
  onItemClick,
  onItemAction,
  onItemSelect,
  selectedItems = new Set(),
  title = "Registros Recentes"
}) => {
  const { isDark } = useTheme();
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force re-render when theme changes
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [isDark]);

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
      className="relative transition-all duration-500 ease-out rounded-2xl p-6"
      style={{
        background: isDark 
          ? '#000000'
          : '#ffffff',
        border: isDark 
          ? '1px solid #333333'
          : '1px solid rgba(229, 231, 235, 0.5)',
        boxShadow: isDark
          ? '0 4px 20px -4px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          : '0 4px 20px -4px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Main content container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative z-10 w-full">
        
          {/* Header section - theme aware */}
          <motion.div 
            variants={headerVariants}
          >
            <div className="mb-8">
              <div className="relative">
                {/* Title with theme-aware styling */}
                <div className="relative mb-3">
                  <h1 className={`
                    text-4xl font-bold
                    ${isDark ? 'text-white' : 'text-gray-900'}
                  `}>
                    {title}
                  </h1>
                </div>
                
                {/* Subtitle - theme aware */}
                <p className={`
                  text-base font-medium mb-6
                  ${isDark ? 'text-gray-400' : 'text-gray-600'}
                `}>
                  Gerencie suas atividades com eficiência e estilo
                </p>

                {/* Stats bar with theme-aware styling */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-5">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="text-center">
                        <div className={`
                          text-xl font-bold
                          ${isDark ? 'text-white' : 'text-gray-900'}
                        `}>
                          {stats.total}
                        </div>
                        <div className={`
                          text-xs uppercase tracking-wider
                          ${isDark ? 'text-gray-500' : 'text-gray-500'}
                        `}>
                          Total
                        </div>
                      </div>
                    </motion.div>
                    <div className={`
                      w-px h-6
                      ${isDark ? 'bg-gray-700' : 'bg-gray-300'}
                    `} />
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="text-center">
                        <div className="text-xl font-bold text-emerald-500">
                          {stats.completed}
                        </div>
                        <div className={`
                          text-xs uppercase tracking-wider
                          ${isDark ? 'text-gray-500' : 'text-gray-500'}
                        `}>
                          Concluídos
                        </div>
                      </div>
                    </motion.div>
                    <div className={`
                      w-px h-6
                      ${isDark ? 'bg-gray-700' : 'bg-gray-300'}
                    `} />
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="text-center">
                        <div className="text-xl font-bold text-amber-500">
                          {stats.inProgress}
                        </div>
                        <div className={`
                          text-xs uppercase tracking-wider
                          ${isDark ? 'text-gray-500' : 'text-gray-500'}
                        `}>
                          Em Andamento
                        </div>
                      </div>
                    </motion.div>
                    <div className={`
                      w-px h-6
                      ${isDark ? 'bg-gray-700' : 'bg-gray-300'}
                    `} />
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-500">
                          {stats.pending}
                        </div>
                        <div className={`
                          text-xs uppercase tracking-wider
                          ${isDark ? 'text-gray-500' : 'text-gray-500'}
                        `}>
                          Pendentes
                        </div>
                      </div>
                    </motion.div>
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
                >
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <RecentItemThemeAware
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>


        </div>
      </motion.div>
    </div>
  );
};

export default RecentSectionThemeAware;