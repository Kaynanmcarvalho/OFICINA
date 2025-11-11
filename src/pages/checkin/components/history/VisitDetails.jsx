import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar, DollarSign, Clock, User, FileText, Image as ImageIcon } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { formatDateTime, getHoursSince } from '../../utils/dateHelpers';

const VisitDetails = ({ visit, allVisits, onClose, onNavigate }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageType, setImageType] = useState('entry'); // 'entry' or 'exit'

  const currentIndex = allVisits.findIndex(v => v.id === visit.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allVisits.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      onNavigate(allVisits[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onNavigate(allVisits[currentIndex + 1]);
    }
  };

  const currentImages = imageType === 'entry' ? visit.entryPhotos : visit.exitPhotos;
  const duration = visit.completedAt && visit.createdAt 
    ? Math.abs(getHoursSince(visit.createdAt) - getHoursSince(visit.completedAt))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <GlassCard className="p-6" animate={false}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevious}
                disabled={!hasPrevious}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Detalhes da Visita
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDateTime(visit.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleNext}
                disabled={!hasNext}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Photos */}
            <div className="space-y-4">
              {/* Photo Type Selector */}
              <div className="flex gap-2">
                <button
                  onClick={() => { setImageType('entry'); setCurrentImageIndex(0); }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    imageType === 'entry'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Fotos de Entrada
                </button>
                <button
                  onClick={() => { setImageType('exit'); setCurrentImageIndex(0); }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    imageType === 'exit'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                  disabled={!visit.exitPhotos || visit.exitPhotos.length === 0}
                >
                  Fotos de Saída
                </button>
              </div>

              {/* Main Photo */}
              <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
                {currentImages && currentImages.length > 0 ? (
                  <img
                    src={currentImages[currentImageIndex]}
                    alt={`${imageType === 'entry' ? 'Entrada' : 'Saída'} ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                {/* Photo Navigation */}
                {currentImages && currentImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                      disabled={currentImageIndex === 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(Math.min(currentImages.length - 1, currentImageIndex + 1))}
                      disabled={currentImageIndex === currentImages.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors disabled:opacity-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {currentImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex
                              ? 'bg-white w-6'
                              : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {currentImages && currentImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {currentImages.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-orange-500'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Info */}
            <div className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Data</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDateTime(visit.createdAt)}
                  </p>
                </div>

                {visit.totalValue && (
                  <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Valor Total</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {visit.totalValue.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </p>
                  </div>
                )}

                {duration && (
                  <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Duração</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {duration}h
                    </p>
                  </div>
                )}

                {visit.userName && (
                  <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-purple-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Atendente</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {visit.userName}
                    </p>
                  </div>
                )}
              </div>

              {/* Services */}
              {visit.services && visit.services.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Serviços Realizados
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {visit.services.map((service, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-sm font-medium text-orange-600 dark:text-orange-400"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {visit.notes && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Observações
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    {visit.notes}
                  </p>
                </div>
              )}

              {/* Status */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <p className="text-sm font-semibold">
                  Status: {visit.status === 'completed' ? 'Concluído' : visit.status === 'in_progress' ? 'Em andamento' : 'Cancelado'}
                </p>
                {visit.completedAt && (
                  <p className="text-xs opacity-90 mt-1">
                    Finalizado em {formatDateTime(visit.completedAt)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default VisitDetails;
