import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';
import RecentFilters, { FilterState } from './RecentFilters';
import BulkActions from './BulkActions';
import RecentList from './RecentList';
import IconLoader from './IconLoader';
import { RecordItem } from './RecentItem';

interface RecentRecordsSectionProps {
  items: RecordItem[];
  isLoading?: boolean;
  error?: Error | null;
  onItemClick?: (item: RecordItem) => void;
  onItemAction?: (action: string, item: RecordItem) => void;
  onBulkAction?: (action: string, items: RecordItem[]) => void;
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: FilterState) => void;
  className?: string;
  enablePreview?: boolean;
  enableBulkActions?: boolean;
  enableVirtualization?: boolean;
  virtualizationThreshold?: number;
}

/**
 * RecentRecordsSection - Container principal
 * Design Apple premium completo com todas as funcionalidades
 */
const RecentRecordsSection: React.FC<RecentRecordsSectionProps> = ({
  items,
  isLoading = false,
  error = null,
  onItemClick,
  onItemAction,
  onBulkAction,
  onSearch,
  onFilterChange,
  className = '',
  enablePreview = true,
  enableBulkActions = true,
  enableVirtualization = true,
  virtualizationThreshold = 30,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    type: 'all',
    period: 'all',
  });
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Filtrar itens
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Filtro de busca
      const matchesSearch =
        !searchQuery ||
        item.primaryText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.secondaryText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.plate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model?.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro de status
      const matchesStatus = filters.status === 'all' || item.status === filters.status;

      // Filtro de tipo
      const matchesType = filters.type === 'all' || item.type === filters.type;

      // Filtro de período
      let matchesPeriod = true;
      if (filters.period !== 'all') {
        const now = new Date();
        const itemDate = new Date(item.date);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (filters.period) {
          case 'today':
            matchesPeriod = itemDate >= today;
            break;
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            matchesPeriod = itemDate >= yesterday && itemDate < today;
            break;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            matchesPeriod = itemDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setDate(monthAgo.getDate() - 30);
            matchesPeriod = itemDate >= monthAgo;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesType && matchesPeriod;
    });
  }, [items, searchQuery, filters]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleItemSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkComplete = () => {
    const items = filteredItems.filter((item) => selectedItems.has(item.id));
    onBulkAction?.('complete', items);
    setSelectedItems(new Set());
  };

  const handleBulkDelete = () => {
    const items = filteredItems.filter((item) => selectedItems.has(item.id));
    onBulkAction?.('delete', items);
    setSelectedItems(new Set());
  };

  const handleClearFilters = () => {
    setFilters({ status: 'all', type: 'all', period: 'all' });
    setSearchQuery('');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-0 tracking-tight">
            Registros Recentes
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            {filteredItems.length} {filteredItems.length === 1 ? 'registro' : 'registros'}
          </p>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="
            px-4 py-2
            rounded-xl
            bg-white/80 dark:bg-neutral-800/80
            backdrop-blur-xl
            border border-neutral-200/50 dark:border-neutral-700/50
            hover:bg-white dark:hover:bg-neutral-800
            transition-all duration-200
            hover:-translate-y-0.5
            hover:shadow-elevation-2
            flex items-center gap-2
          "
        >
          <IconLoader name="filter" size="sm" />
          <span className="text-sm font-medium">Filtros</span>
        </button>
      </div>

      {/* Search Bar */}
      <SearchBar value={searchQuery} onChange={handleSearchChange} />

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <RecentFilters
            filters={filters}
            onChange={handleFilterChange}
            onClose={() => setShowFilters(false)}
          />
        )}
      </AnimatePresence>

      {/* Bulk Actions */}
      {enableBulkActions && (
        <AnimatePresence>
          {selectedItems.size > 0 && (
            <BulkActions
              selectedCount={selectedItems.size}
              onMarkComplete={handleBulkComplete}
              onDelete={handleBulkDelete}
              onCancel={() => setSelectedItems(new Set())}
            />
          )}
        </AnimatePresence>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
          <p className="text-sm font-medium">Erro ao carregar registros</p>
          <p className="text-xs mt-1">{error.message}</p>
        </div>
      )}

      {/* List */}
      <RecentList
        items={filteredItems}
        isLoading={isLoading}
        searchQuery={searchQuery}
        filters={filters}
        selectedItems={selectedItems}
        onItemClick={onItemClick}
        onItemAction={onItemAction}
        onItemSelect={handleItemSelect}
        onClearFilters={handleClearFilters}
        enableVirtualization={enableVirtualization}
        virtualizationThreshold={virtualizationThreshold}
      />
    </div>
  );
};

export default RecentRecordsSection;
