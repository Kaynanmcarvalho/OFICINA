import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MoreVertical } from 'lucide-react';
import RecentItem from './RecentItem';
import RecentFilters from './RecentFilters';
import EmptyState from './EmptyState';
import RecentSkeleton from './RecentSkeleton';

/**
 * RecentList - Container principal para Registros Recentes
 * Design Apple Premium com glassmorphism e animações fluidas
 */
const RecentList = ({
  items = [],
  isLoading = false,
  onItemClick,
  onItemAction,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    period: 'all'
  });
  const [selectedItems, setSelectedItems] = useState(new Set());

  // Filtrar e agrupar itens
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = !searchQuery || 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.plate?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || item.status === filters.status;
      const matchesType = filters.type === 'all' || item.type === filters.type;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [items, searchQuery, filters]);

  // Agrupar por data
  const groupedItems = useMemo(() => {
    const groups = {
      today: [],
      yesterday: [],
      week: [],
      older: []
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    filteredItems.forEach(item => {
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
  }, [filteredItems]);

  const handleSelectItem = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-0 tracking-tight">
            Registros Recentes
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            {filteredItems.length} {filteredItems.length === 1 ? 'registro' : 'registros'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 rounded-xl bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 hover:bg-white dark:hover:bg-neutral-800 transition-all duration-fast hover:-translate-y-0.5 hover:shadow-elevation-2"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          placeholder="Buscar por placa, modelo ou cliente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 text-neutral-900 dark:text-neutral-0 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
        />
      </motion.div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <RecentFilters
            filters={filters}
            onChange={setFilters}
            onClose={() => setShowFilters(false)}
          />
        )}
      </AnimatePresence>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedItems.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between p-4 rounded-xl bg-accent/10 dark:bg-accent/20 border border-accent/30"
          >
            <span className="text-sm font-medium text-accent">
              {selectedItems.size} {selectedItems.size === 1 ? 'item selecionado' : 'itens selecionados'}
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors">
                Marcar como concluído
              </button>
              <button className="px-3 py-1.5 text-sm rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors">
                Cancelar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <RecentSkeleton key={i} />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState searchQuery={searchQuery} />
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([group, items]) => {
            if (items.length === 0) return null;
            
            const groupLabels = {
              today: 'Hoje',
              yesterday: 'Ontem',
              week: 'Últimos 7 dias',
              older: 'Mais antigos'
            };

            return (
              <div key={group} className="space-y-3">
                <div className="sticky top-0 z-10 py-2 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-xl">
                  <h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    {groupLabels[group]}
                  </h3>
                </div>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <RecentItem
                      key={item.id}
                      item={item}
                      isSelected={selectedItems.has(item.id)}
                      onSelect={() => handleSelectItem(item.id)}
                      onClick={() => onItemClick?.(item)}
                      onAction={(action) => onItemAction?.(action, item)}
                      delay={index * 0.05}
                    />
                  ))}
                </div>
              </div>

          })}
        </div>
      )}
    </div>
  );
};

export default RecentList;
