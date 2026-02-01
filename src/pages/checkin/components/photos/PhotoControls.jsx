import React from 'react';
import { motion } from 'framer-motion';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Minimize, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight,
  Columns
} from 'lucide-react';

const PhotoControls = ({ 
  onZoomIn, 
  onZoomOut, 
  onReset, 
  onFullscreen,
  onPrevious,
  onNext,
  onCompare,
  isFullscreen = false
}) => {
  const ControlButton = ({ icon: Icon, onClick, label, disabled = false }) => (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      disabled={disabled}
      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title={label}
    >
      <Icon className="w-5 h-5" />
    </motion.button>

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
      {/* Zoom Controls */}
      <div className="flex flex-col gap-2 p-2 rounded-xl bg-black/30 backdrop-blur-md">
        <ControlButton icon={ZoomIn} onClick={onZoomIn} label="Aumentar zoom" />
        <ControlButton icon={ZoomOut} onClick={onZoomOut} label="Diminuir zoom" />
        <ControlButton icon={RotateCw} onClick={onReset} label="Resetar visualização" />
      </div>

      {/* Navigation Controls */}
      {(onPrevious || onNext) && (
        <div className="flex flex-col gap-2 p-2 rounded-xl bg-black/30 backdrop-blur-md">
          {onPrevious && (
            <ControlButton icon={ChevronLeft} onClick={onPrevious} label="Foto anterior" />
          )}
          {onNext && (
            <ControlButton icon={ChevronRight} onClick={onNext} label="Próxima foto" />
          )}
        </div>
      )}

      {/* Additional Controls */}
      <div className="flex flex-col gap-2 p-2 rounded-xl bg-black/30 backdrop-blur-md">
        {onCompare && (
          <ControlButton icon={Columns} onClick={onCompare} label="Comparar entrada/saída" />
        )}
        <ControlButton 
          icon={isFullscreen ? Minimize : Maximize} 
          onClick={onFullscreen} 
          label={isFullscreen ? "Sair da tela cheia" : "Tela cheia"} 
        />
      </div>
    </div>
  );
};

export default PhotoControls;
