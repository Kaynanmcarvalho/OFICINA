import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../utils';
import { useIsMobile } from '../../../hooks';

export interface SidebarItem {
  id: string;
  label: string;
  icon: ReactNode;
  href?: string;
  badge?: string | number;
  onClick?: () => void;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  sections: SidebarSection[];
  activeId?: string;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

const STORAGE_KEY = 'sidebar-collapsed';

export function Sidebar({
  sections,
  activeId,
  isOpen = true,
  onClose,
  className,
}: SidebarProps) {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setIsCollapsed(stored === 'true');
    }
  }, []);

  // Save collapsed state
  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(STORAGE_KEY, String(newState));
  };

  // Mobile: render as overlay
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.2, 0.9, 0.2, 1] }}
              className="fixed left-0 top-0 bottom-0 w-64 glass-effect border-r border-neutral-200/50 dark:border-neutral-800/50 z-50 overflow-y-auto"
            >
              <SidebarContent
                sections={sections}
                activeId={activeId}
                isCollapsed={false}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

  }

  // Desktop: render as fixed sidebar
  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: [0.2, 0.9, 0.2, 1] }}
      className={cn(
        'hidden lg:block fixed left-0 top-16 bottom-0',
        'glass-effect border-r border-neutral-200/50 dark:border-neutral-800/50',
        'overflow-y-auto',
        className
      )}
    >
      <SidebarContent
        sections={sections}
        activeId={activeId}
        isCollapsed={isCollapsed}
      />

      {/* Collapse Toggle */}
      <button
        onClick={toggleCollapsed}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        )}
      </button>
    </motion.aside>

}

interface SidebarContentProps {
  sections: SidebarSection[];
  activeId?: string;
  isCollapsed: boolean;
}

function SidebarContent({ sections, activeId, isCollapsed }: SidebarContentProps) {
  return (
    <nav className="p-4 space-y-6">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          {section.title && !isCollapsed && (
            <h3 className="px-3 mb-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              {section.title}
            </h3>
          )}
          <div className="space-y-1">
            {section.items.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isActive={activeId === item.id}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>

}

interface SidebarItemProps {
  item: SidebarItem;
  isActive: boolean;
  isCollapsed: boolean;
}

function SidebarItem({ item, isActive, isCollapsed }: SidebarItemProps) {
  const content = (
    <>
      <div className={cn(
        'flex items-center justify-center w-10 h-10 rounded-xl transition-colors',
        isActive
          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
          : 'text-neutral-600 dark:text-neutral-400'
      )}>
        {item.icon}
      </div>
      {!isCollapsed && (
        <>
          <span className="flex-1 text-sm font-medium">{item.label}</span>
          {item.badge && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              {item.badge}
            </span>
          )}
        </>
      )}
    </>

  const className = cn(
    'flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200',
    'hover:bg-neutral-100 dark:hover:bg-neutral-800',
    'focus:outline-none focus:ring-2 focus:ring-primary-500',
    isActive && 'bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-500',
    isCollapsed && 'justify-center'

  if (item.href) {
    return (
      <a href={item.href} className={className}>
        {content}
      </a>
  );
}

return (
    <button onClick={item.onClick} className={cn(className, 'w-full')}>
      {content}
    </button>

}
