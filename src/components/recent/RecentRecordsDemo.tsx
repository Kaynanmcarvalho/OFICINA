import React, { useState } from 'react';
import RecentItem, { RecordItem, ItemAction } from './RecentItem';
import RecentSkeleton from './RecentSkeleton';
import EmptyState from './EmptyState';

const RecentRecordsDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Sample data
  const sampleItems: RecordItem[] = [
    {
      id: '1',
      type: 'car',
      status: 'in_progress',
      primaryText: 'João Silva',
      secondaryText: 'Honda Civic 2020',
      plate: 'ABC-1234',
      model: 'Honda Civic',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      tags: ['Revisão', 'Urgente'],
      metadata: {
        serviceType: 'Manutenção preventiva',
        priority: 'high',
      },
    },
    {
      id: '2',
      type: 'motorcycle',
      status: 'completed',
      primaryText: 'Maria Santos',
      secondaryText: 'Yamaha MT-07',
      plate: 'XYZ-5678',
      model: 'Yamaha MT-07',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      tags: ['Troca de óleo'],
    },
    {
      id: '3',
      type: 'truck',
      status: 'pending',
      primaryText: 'Transportadora ABC',
      secondaryText: 'Mercedes Actros',
      plate: 'TRK-9999',
      model: 'Mercedes Actros',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      tags: ['Freios', 'Inspeção'],
    },
    {
      id: '4',
      type: 'van',
      status: 'cancelled',
      primaryText: 'Empresa XYZ',
      secondaryText: 'Ford Transit',
      plate: 'VAN-1111',
      model: 'Ford Transit',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      tags: ['Cancelado'],
    },
  ];

  const [items, setItems] = useState<RecordItem[]>(sampleItems);

  const handleItemAction = (action: ItemAction) => {
    console.log('Action:', action);
    
    switch (action.type) {
      case 'complete':
        setItems(prev => prev.map(item => 
          item.id === action.itemId 
            ? { ...item, status: 'completed' as const }
            : item
        ));
        break;
      case 'delete':
        setItems(prev => prev.filter(item => item.id !== action.itemId));
        break;
      default:
        // Handle other actions
        break;
    }
  };

  const handleItemSelect = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleLoadingToggle = () => {
    setIsLoading(!isLoading);
  };

  const handleClearItems = () => {
    setItems([]);
  };

  const handleRestoreItems = () => {
    setItems(sampleItems);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Recent Records Premium Demo
        </h1>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleLoadingToggle}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {isLoading ? 'Hide Loading' : 'Show Loading'}
          </button>
          
          <button
            onClick={handleClearItems}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Clear Items
          </button>
          
          <button
            onClick={handleRestoreItems}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Restore Items
          </button>

          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            Selected: {selectedItems.size} items
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {isLoading ? (
            <RecentSkeleton count={3} />
          ) : items.length === 0 ? (
            <EmptyState
              onCreateNew={() => console.log('Create new clicked')}
              onClearFilters={() => console.log('Clear filters clicked')}
            />
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <RecentItem
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.has(item.id)}
                  onSelect={handleItemSelect}
                  onClick={() => console.log('Item clicked:', item.id)}
                  onAction={handleItemAction}
                  showCheckbox={selectedItems.size > 0}
                  delay={index}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Features Demonstrated:
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Premium glassmorphism design with backdrop blur</li>
            <li>• Smooth hover animations and microinteractions</li>
            <li>• Context menu with actions (duplicate, complete, delete)</li>
            <li>• Selection state with checkboxes</li>
            <li>• Status pills with glow effects</li>
            <li>• Loading skeletons with shimmer animation</li>
            <li>• Empty state with call-to-action</li>
            <li>• Dark mode support</li>
            <li>• Accessibility features (ARIA labels, keyboard navigation)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecentRecordsDemo;