/**
 * RecentCheckinsSection Component
 * Container for displaying recent vehicle check-ins with Apple Premium UI
 * 
 * Features:
 * - Automatic sorting by date (most recent first)
 * - Configurable item limit
 * - Selection state management
 * - Empty state handling
 * - Stagger animation for cards
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';
import CheckinCard from './CheckinCard';
import ErrorBoundary from './ErrorBoundary';

const RecentCheckinsSection = ({ 
  checkins = [], 
  maxItems = 10,
  onSelectCheckin,
  onViewDetails,
  showFilters = false,
  className = ''
}) => {
  const [selectedCheckinId, setSelectedCheckinId] = useState(null);
  
  // Data validation
  const validCheckins = Array.isArray(checkins) ? checkins : [];
  
  // Sort by most recent first and limit items
  const sortedCheckins = [...validCheckins]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA;
    })
    .slice(0, maxItems);
  
  // Handle card selection
  const handleSelect = (checkin) => {
    setSelectedCheckinId(checkin.id);
    if (onSelectCheckin) {
      onSelectCheckin(checkin);
    }
  };
  
  // Handle view details
  const handleViewDetails = (checkin) => {
    if (onViewDetails) {
      onViewDetails(checkin);
    }
  };
  
  // Empty state
  if (sortedCheckins.length === 0) {
    return (
      <ErrorBoundary>
        <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
          <EmptyState />
        </div>
      </ErrorBoundary>
    );
  }
  
  return (
    <ErrorBoundary>
      <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
        {/* Section Header */}
        <SectionHeader count={sortedCheckins.length} />
        
        {/* Checkin Cards List */}
        <motion.div
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
        >
          {sortedCheckins.map((checkin) => (
            <CheckinCard
              key={checkin.id}
              checkin={checkin}
              isSelected={checkin.id === selectedCheckinId}
              onSelect={handleSelect}
              onViewDetails={handleViewDetails}
            />
          ))}
        </motion.div>
      </div>
    </ErrorBoundary>
  );
};

/**
 * SectionHeader Component
 * Displays title and optional count
 */
const SectionHeader = ({ count }) => {
  return (
    <div className="mb-6">
      <h2 
        className="text-white font-semibold"
        style={{ fontSize: '18px', lineHeight: '1.5' }}
      >
        Check-ins Recentes
      </h2>
      {count > 0 && (
        <p 
          className="text-gray-400 mt-1"
          style={{ fontSize: '14px' }}
        >
          {count} {count === 1 ? 'registro' : 'registros'}
        </p>
      )}
    </div>
  );
};

/**
 * EmptyState Component
 * Displayed when no check-ins are available
 */
const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div 
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.25))',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 16px rgba(59,130,246,0.25)'
        }}
      >
        <Car size={32} className="text-blue-400" strokeWidth={2} />
      </div>
      
      <h3 
        className="text-white font-semibold mb-2"
        style={{ fontSize: '16px' }}
      >
        Nenhum check-in recente
      </h3>
      
      <p 
        className="text-gray-400 text-center"
        style={{ fontSize: '14px' }}
      >
        Realize um novo check-in para começar
      </p>
    </motion.div>
  );
};

export default RecentCheckinsSection;
