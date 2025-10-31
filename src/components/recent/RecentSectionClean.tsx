import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RecentItemInnovative from './RecentItemInnovative';
import RecentSkeleton from './RecentSkeleton';
import EmptyState from './EmptyState';
import { RecordItem, ItemAction } from './RecentItem';

interface RecentSectionCleanProps {
  items: RecordItem[];
  isLoading?: boolean;
  onItemClick?: (item: RecordItem) => void;
  onItemAction?: (action: ItemAction) => void;
  onItemSelect?: (id: string) => void;
  selectedItems?: Set<string>;
  title?: string;
}

const RecentSectionClean: React.FC<RecentSectionCleanProps> = ({
  items,
  isLoading = false,
  onItemClick,
  onItemAction,
  onItemSelect,
  selectedItems = new Set(),
  title = "Registros Recentes"
}) => {
  // Theme-aware styling
  const getThemeStyles = () => {
    const isDark = document.documentElement.classList.contains('dark');
    
    if (isDark) {
      return {
        background: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
        text: 'text-gray-100',
        textSecondary: 'text-gray-300',
        textMuted: 'text-gray-400',
        accent: 'text-blue-400',
      };
    } else {
      return {
        background: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
        text: 'text-gray-900',
        textSecondary: 'text-gray-700',
        textMuted: 'text-gray-500',
        accent: 'text-blue-600',
      };
    }
  };

  const themeStyles = getThemeStyles();

  // Stats calculation
  const stats = {
    total: items.length,
    completed: items.filter(item => item.status === 'completed').length,
    inProgress: items.filter(item => item.status === 'in_progress').length,
    pending: items.filter(item => item.status === 'pending').length,
  };

  return (
    <div className={`min-h-screen ${themeStyles.background} transition-colors duration-300`}>
      {/* Clean background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          {/* Title */}
          <h1 className={`text-4xl font-bold ${themeStyles.text} mb-2`}>
            {title}
          </h1>
          
          {/* Subtitle */}
          <p className={`text-lg ${themeStyles.textSecondary} mb-6`}>
            Gerencie suas atividades com eficiência e estilo
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className={`text-2xl font-bold ${themeStyles.text}`}>{stats.total}</div>
              <div className={`text-sm ${themeStyles.textMuted} uppercase tracking-wide`}>Total</div>
            </div>
            
            <div className={`w-px h-6 ${themeStyles.textMuted} opacity-30`} />
            
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-emerald-500">{stats.completed}</div>
              <div className={`text-sm ${themeStyles.textMuted} uppercase tracking-wide`}>Concluídos</div>
            </div>
            
            <div className={`w-px h-6 ${themeStyles.textMuted} opacity-30`} />
            
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-amber-500">{stats.inProgress}</div>
              <div className={`text-sm ${themeStyles.textMuted} uppercase tracking-wide`}>Em Andamento</div>
            </div>
            
            <div className={`w-px h-6 ${themeStyles.textMuted} opacity-30`} />
            
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-blue-500">{stats.pending}</div>
              <div className={`text-sm ${themeStyles.textMuted} uppercase tracking-wide`}>Pendentes</div>
            </div>
          </div>
        </motion.div>

        {/* Content area */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <RecentSkeleton count={5} />
            </motion.div>
          ) : items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
              transition={{ duration: 0.3 }}
            >
              {/* Grid layout for variety */}
              <div className="grid gap-4 md:gap-6">
                {items.map((item, index) => (
                  <RecentItemInnovative
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

        {/* Selection summary */}
        <AnimatePresence>
          {selectedItems.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div className={`
                px-6 py-3 rounded-2xl shadow-lg border backdrop-blur-sm
                ${document.documentElement.classList.contains('dark') 
                  ? 'bg-gray-800/90 border-gray-700 text-gray-100' 
                  : 'bg-white/90 border-gray-200 text-gray-900'
                }
              `}>
                <span className="font-medium">
                  {selectedItems.size} item{selectedItems.size > 1 ? 's' : ''} selecionado{selectedItems.size > 1 ? 's' : ''}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RecentSectionClean;