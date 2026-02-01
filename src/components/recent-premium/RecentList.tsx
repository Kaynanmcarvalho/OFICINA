import React, { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import RecentItem, { RecordItem } from './RecentItem';
import RecentSkeleton from './RecentSkeleton';
import EmptyState from './EmptyState';

interface RecentListProps {
  items: RecordItem[];
  isLoading?: boolean;
  searchQuery?: string;
  filters?: any;
  selectedItems?: Set<string>;
  onItemClick?: (item: RecordItem) => void;
  onItemAction?: (action: string, item: RecordItem) => void;
  onItemSelect?: (id: string) => void;
  onClearFilters?: () => void;
  enableVirtualization?: boolean;
  virtualizationThreshold?: number;
}

/**
 * RecentList - Lista com agrupamento por data
 * Design Apple premium com sticky headers
 */
const RecentList: React.FC<RecentListProps> = ({
  items,
  isLoading = false,
  searchQuery = '',
  filters,
  selectedItems = new Set(),
  onItemClick,
  onItemAction,
  onItemSelect,
  onClearFilters,
  enableVirtualization = true,
  virtualizationThreshold = 30,
}) => {
  // Agrupar itens por data
  const groupedItems = useMemo(() => {
    const groups: Record<string, RecordItem[]> = {
      today: [],
      yesterday: [],
      week: [],
      older: [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    items.forEach((item) => {
      const itemDate = new Date(item.date);
      if (itemDate >= today) {
        groups.today.push(item);
      } else if (itemDate >= yesterday) {
        groups.yesterday.push(item);
      } else if (itemDate >= weekAgo) {
        groups.week.push(item);
      } else {
        groups.older.push(item);
      }
    });

    return groups;
  }, [items]);

  const groupLabels: Record<string, string> = {
    today: 'Hoje',
    yesterday: 'Ontem',
    week: 'Últimos 7 dias',
    older: 'Mais antigos',
  };

  const hasFilters = filters && (filters.status !== 'all' || filters.type !== 'all' || filters.period !== 'all');

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <RecentSkeleton key={i} />
        ))}
      </div>
  );
}

if (items.length === 0) {
    return (
      <EmptyState
        searchQuery={searchQuery}
        hasFilters={hasFilters}
        onClearFilters={onClearFilters}
      />

  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedItems).map(([group, groupItems]) => {
        if (groupItems.length === 0) return null;

        return (
          <div key={group} className="space-y-3">
            {/* Sticky Group Header */}
            <div className="sticky top-0 z-10 py-2 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-xl">
              <h3 className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                {groupLabels[group]}
              </h3>
            </div>

            {/* Items */}
            <AnimatePresence mode="popLayout">
              {groupItems.map((item, index) => (
                <RecentItem
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.has(item.id)}
                  onSelect={onItemSelect}
                  onClick={() => onItemClick?.(item)}
                  onAction={(action) => onItemAction?.(action, item)}
                  showCheckbox={selectedItems.size > 0}
                  delay={index}
                />
              ))}
            </AnimatePresence>
          </div>

      })}
    </div>
  );
};

export default RecentList;
