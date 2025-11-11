import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, History } from 'lucide-react';
import VisitCard from './VisitCard';
import VisitDetails from './VisitDetails';
import LoadingSpinner from '../ui/LoadingSpinner';

const VisitHistory = ({ history, loading, className = '' }) => {
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = React.useRef(null);

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    const newPosition = direction === 'left' 
      ? scrollPosition - scrollAmount 
      : scrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    setScrollPosition(newPosition);
  };

  if (loading) {
    return (
      <div className={`py-8 ${className}`}>
        <LoadingSpinner text="Carregando histórico..." />
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <History className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Nenhuma visita anterior encontrada
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Histórico de Visitas
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {history.length} visita{history.length !== 1 ? 's' : ''} anterior{history.length !== 1 ? 'es' : ''}
          </p>
        </div>

        {/* Navigation Buttons */}
        {history.length > 3 && (
          <div className="flex gap-2">
            <button
              onClick={() => handleScroll('left')}
              disabled={scrollPosition <= 0}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        )}
      </div>

      {/* Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {history.map((visit, index) => (
          <motion.div
            key={visit.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 w-72 snap-start"
          >
            <VisitCard
              visit={visit}
              onClick={() => setSelectedVisit(visit)}
            />
          </motion.div>
        ))}
      </div>

      {/* Visit Details Modal */}
      <AnimatePresence>
        {selectedVisit && (
          <VisitDetails
            visit={selectedVisit}
            allVisits={history}
            onClose={() => setSelectedVisit(null)}
            onNavigate={setSelectedVisit}
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default VisitHistory;
