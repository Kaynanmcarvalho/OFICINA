import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { motion } from 'framer-motion';
import { X, ArrowLeft, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

const PhotoComparison = ({ entryPhotos, exitPhotos, onClose, onBack }) => {
  const [entryIndex, setEntryIndex] = useState(0);
  const [exitIndex, setExitIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  React.useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => {
        const container = document.getElementById('comparison-container');
        if (container) {
          const rect = container.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const percentage = (x / rect.width) * 100;
          setSliderPosition(Math.max(0, Math.min(100, percentage)));
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
    >
      <div className="relative w-full h-full flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <div>
                <h3 className="text-white font-semibold text-lg">Comparação Entrada/Saída</h3>
                <p className="text-white/70 text-sm">
                  Arraste o controle para comparar
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Comparison Container */}
        <div className="flex-1 flex items-center justify-center p-4 pt-20">
          <div
            id="comparison-container"
            className="relative w-full max-w-6xl aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-col-resize"
            onClick={handleSliderChange}
          >
            {/* Entry Photo (Left) */}
            <div className="absolute inset-0">
              <img
                src={entryPhotos[entryIndex]}
                alt="Entrada"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-blue-500 text-white text-sm font-semibold">
                Entrada
              </div>
            </div>

            {/* Exit Photo (Right) with clip */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <img
                src={exitPhotos[exitIndex]}
                alt="Saída"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-green-500 text-white text-sm font-semibold">
                Saída
              </div>
            </div>

            {/* Slider */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-10"
              style={{ left: `${sliderPosition}%` }}
              onMouseDown={handleMouseDown}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-4 bg-gray-400"></div>
                  <div className="w-0.5 h-4 bg-gray-400"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Selectors */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
          <div className="grid grid-cols-2 gap-4 max-w-6xl mx-auto">
            {/* Entry Photos */}
            <div>
              <p className="text-white text-sm mb-2">Fotos de Entrada</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {entryPhotos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setEntryIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === entryIndex
                        ? 'border-blue-500 ring-2 ring-blue-500/50'
                        : 'border-white/30 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Entrada ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Exit Photos */}
            <div>
              <p className="text-white text-sm mb-2">Fotos de Saída</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {exitPhotos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setExitIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === exitIndex
                        ? 'border-green-500 ring-2 ring-green-500/50'
                        : 'border-white/30 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Saída ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PhotoComparison;
