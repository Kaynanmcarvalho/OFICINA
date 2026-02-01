import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import PhotoControls from './PhotoControls';
import PhotoComparison from './PhotoComparison';

const PhotoViewer3D = ({ 
  photos = [], 
  comparisonPhotos = null, 
  initialIndex = 0,
  onClose,
  title = 'Fotos do Veículo'
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showComparison, setShowComparison] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentPhoto = photos[currentIndex];
  const hasMultiplePhotos = photos.length > 1;
  const hasComparison = comparisonPhotos && comparisonPhotos.length > 0;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (isFullscreen) {
        toggleFullscreen();
      } else {
        onClose();
      }
    } else if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  if (showComparison && hasComparison) {
    return (
      <PhotoComparison
        entryPhotos={photos}
        exitPhotos={comparisonPhotos}
        onClose={() => setShowComparison(false)}
        onBack={() => setShowComparison(false)}
      />

  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative w-full h-full flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-lg">{title}</h3>
              {hasMultiplePhotos && (
                <p className="text-white/70 text-sm">
                  {currentIndex + 1} de {photos.length}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Main Photo Viewer */}
        <div 
          className="flex-1 flex items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={4}
            centerOnInit
            wheel={{ step: 0.1 }}
            doubleClick={{ mode: "reset" }}
          >
            {({ zoomIn, zoomOut, resetTransform, centerView }) => (
              <>
                <TransformComponent
                  wrapperClass="w-full h-full flex items-center justify-center"
                  contentClass="w-full h-full flex items-center justify-center"
                >
                  <motion.img
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={currentPhoto}
                    alt={`Foto ${currentIndex + 1}`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  />
                </TransformComponent>

                {/* Controls */}
                <PhotoControls
                  onZoomIn={zoomIn}
                  onZoomOut={zoomOut}
                  onReset={resetTransform}
                  onFullscreen={toggleFullscreen}
                  onPrevious={hasMultiplePhotos ? handlePrevious : null}
                  onNext={hasMultiplePhotos ? handleNext : null}
                  onCompare={hasComparison ? () => setShowComparison(true) : null}
                  isFullscreen={isFullscreen}
                />
              </>
            )}
          </TransformWrapper>
        </div>

        {/* Thumbnails */}
        {hasMultiplePhotos && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
            <div className="flex justify-center gap-2 overflow-x-auto pb-2">
              {photos.map((photo, index) => (
                <motion.button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? 'border-orange-500 ring-2 ring-orange-500/50'
                      : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={photo}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Arrows (for mobile) */}
        {hasMultiplePhotos && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors md:hidden"
            >
              ←
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors md:hidden"
            >
              →
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default PhotoViewer3D;
