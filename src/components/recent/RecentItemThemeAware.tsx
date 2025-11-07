import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ItemAvatar from './ItemAvatar';
import StatusPill from './StatusPill';
import ItemMetaRow from './ItemMetaRow';
import ItemActions from './ItemActions';
import { RecordItem, ItemAction } from './RecentItem';
import { useTheme } from '../../hooks/useTheme';

interface RecentItemThemeAwareProps {
  item: RecordItem;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: () => void;
  onAction?: (action: ItemAction) => void;
  showCheckbox?: boolean;
  delay?: number;
  index?: number;
}

const RecentItemThemeAware: React.FC<RecentItemThemeAwareProps> = ({
  item,
  isSelected = false,
  onSelect,
  onClick,
  onAction,
  showCheckbox = false,
  delay = 0,
}) => {
  const { isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force re-render when theme changes
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [isDark]);

  // Observer para mudanças na classe 'dark' do documento
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setForceUpdate(prev => prev + 1);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleClick = (e: React.MouseEvent) => {
    // Não interceptar cliques em botões ou inputs
    if ((e.target as HTMLElement).closest('button, input, [role="button"]')) return;
    
    // Se há um timeout ativo, é um duplo clique
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      
      // Duplo clique - abrir detalhes
      if (onClick) {
        onClick();
      }
      return;
    }

    // Primeiro clique - aguardar para ver se haverá um segundo
    const timeout = setTimeout(() => {
      setClickTimeout(null);
      
      // Clique único - selecionar item
      if (onSelect) {
        onSelect(item.id);
      }
    }, 300); // 300ms para detectar duplo clique

    setClickTimeout(timeout);
  };

  // Limpar timeout quando componente for desmontado
  React.useEffect(() => {
    return () => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
    };
  }, [clickTimeout]);

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 0.8,
        delay: delay * 0.08,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div 
        className="relative group cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Main card container - BORDAS ULTRA REALÇADAS SOMENTE NO MODO CLARO */}
        <div
          className={`
            relative overflow-hidden rounded-2xl h-28 transition-all duration-300 ease-out
            bg-white dark:bg-slate-900
            ${isSelected 
              ? 'border-[4px] border-blue-700 dark:border-blue-500 bg-blue-50 dark:bg-slate-800' 
              : isHovered
                ? 'border-[4px] border-gray-950 dark:border-slate-600 bg-gray-50 dark:bg-slate-800'
                : 'border-[4px] border-gray-900 dark:border-slate-700'
            }
          `}
          style={{
            boxShadow: isSelected
              ? (isDark 
                  ? '0 10px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.6), inset 0 1px 0 rgba(255,255,255,0.1)'
                  : '0 8px 20px rgba(0, 0, 0, 0.2), 0 4px 10px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(29, 78, 216, 0.5), inset 0 2px 4px rgba(255,255,255,0.8)'
                )
              : isHovered
                ? (isDark
                    ? '0 8px 16px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.08)'
                    : '0 6px 16px rgba(0, 0, 0, 0.18), 0 3px 8px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.15), inset 0 1px 3px rgba(255,255,255,0.6)'
                  )
                : (isDark
                    ? '0 4px 12px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2)'
                    : '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255,255,255,0.5)'
                  )
          }}
        >
          {/* Top highlight for selected items */}
          {isSelected && (
            <div 
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60"
            />
          )}

          {/* Content container - ALTURA EXPANDIDA COM FLEXBOX */}
          <div className="relative h-full flex items-center px-6 py-5">
            <div className="flex items-center gap-4 w-full">
              
              {/* Selection checkbox - só aparece quando necessário */}
              <AnimatePresence>
                {(showCheckbox || isSelected) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, x: -15 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0, x: -15 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 25,
                      mass: 0.5
                    }}
                  >
                    <div className="flex-shrink-0">
                      <label className="relative cursor-pointer group/checkbox">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onSelect?.(item.id)}
                          className="sr-only"
                        />
                        <div 
                          className={`
                            w-5 h-5 rounded-lg border-2 transition-all duration-200 hover:scale-110 active:scale-90
                            ${isSelected 
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-500' 
                              : (isDark 
                                  ? 'border-gray-600 bg-slate-800 group-hover/checkbox:border-gray-500'
                                  : 'border-gray-300 bg-gray-50 group-hover/checkbox:border-gray-400'
                                )
                            }
                          `}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Avatar */}
              <div className="flex-shrink-0 relative">
                <ItemAvatar 
                  type={item.type} 
                  status={item.status === 'completed' ? 'completed' : undefined}
                  size="md"
                />
              </div>

              {/* Content - ULTRA NÍTIDO COM TEXT-SHADOW */}
              <div className="flex-1 min-w-0 py-1">
                <h3 
                  className="text-lg font-extrabold truncate leading-tight mb-2 text-gray-950 dark:text-white"
                  style={{
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {item.primaryText}
                </h3>
                
                <p 
                  className="text-sm font-bold truncate leading-tight mb-2 text-gray-800 dark:text-gray-100"
                  style={{
                    textShadow: '0 1px 1px rgba(0,0,0,0.08)',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {item.secondaryText}
                </p>
                
                <div className="text-xs font-medium">
                  <ItemMetaRow
                    plate={item.plate}
                    model={item.model}
                    date={item.date}
                    tags={item.tags}
                    showRelativeTime={true}
                  />
                </div>
              </div>

              {/* Status pill */}
              <div className="flex-shrink-0 relative">
                <StatusPill 
                  status={item.status} 
                  showGlow={false}
                  size="sm"
                />
              </div>

              {/* Actions */}
              <div className="flex-shrink-0">
                <ItemActions
                  onOpen={() => onAction?.({ type: 'open', itemId: item.id })}
                  onEdit={() => onAction?.({ type: 'edit', itemId: item.id })}
                  onCreateBudget={() => onAction?.({ type: 'createBudget', itemId: item.id })}
                  onComplete={() => onAction?.({ type: 'complete', itemId: item.id })}
                  onDelete={() => onAction?.({ type: 'delete', itemId: item.id })}
                  hasBudget={item.metadata?.hasBudget || false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentItemThemeAware;