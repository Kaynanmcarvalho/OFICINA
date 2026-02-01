import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: string | number;
  children?: MenuItem[];
}

export interface SidebarProps {
  items: MenuItem[];
  isCollapsed?: boolean;
  onToggle?: () => void;
  activeItem?: string;
  onItemClick?: (id: string) => void;
}

export const PremiumSidebar = ({
  items,
  isCollapsed = false,
  onToggle,
  activeItem,
  onItemClick,
}: SidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isActive = activeItem === item.id;
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            }
            if (onItemClick) {
              onItemClick(item.id);
            }
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
            isActive
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          } ${level > 0 ? 'ml-4' : ''}`}
          style={{ paddingLeft: `${12 + level * 16}px` }}
        >
          <item.icon className="w-5 h-5 flex-shrink-0" />
          
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left text-sm font-medium truncate">
                {item.label}
              </span>
              
              {item.badge && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400">
                  {item.badge}
                </span>
              )}
              
              {hasChildren && (
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              )}
            </>
          )}
        </motion.button>

        {/* Children */}
        {hasChildren && !isCollapsed && (
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-1 space-y-1">
                  {item.children!.map((child) => renderMenuItem(child, level + 1))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
  );
};

return (
    <motion.aside
      initial={false}
      animate={{
        width: isCollapsed ? '80px' : '280px',
      }}
      transition={{ duration: 0.3, ease: [0.2, 0.9, 0.2, 1] }}
      className="relative h-screen bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-r border-neutral-200/50 dark:border-neutral-800/50"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
          {!isCollapsed && (
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
              Menu
            </h2>
          )}
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </motion.div>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {items.map((item) => renderMenuItem(item))}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              <p>TORQ Sistema v1.0</p>
              <p className="mt-1">© 2025 Todos os direitos reservados</p>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default PremiumSidebar;
