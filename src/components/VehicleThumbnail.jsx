/**
 * VehicleThumbnail - Componente para exibir miniatura de veículos
 * Busca imagem na API e exibe com fallback para ícone
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Bike, Truck, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { searchVehicleImageCached, buildVehicleName } from '../services/vehicleImageService';

const VehicleThumbnail = ({ 
  vehicle, 
  size = 'md', 
  showOnHover = false, 
  showLabel = true,
  className = '',
  onClick = null 
}) => {
  const [imageData, setImageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Tamanhos disponíveis
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  // Ícones por tipo de veículo
  const getVehicleIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'moto':
      case 'motocicleta':
        return Bike;
      case 'caminhao':
      case 'caminhão':
      case 'truck':
        return Truck;
      default:
        return Car;
    }
  };

  // Buscar imagem quando componente monta ou veículo muda
  useEffect(() => {
    if (!vehicle) return;

    const fetchImage = async () => {
      setIsLoading(true);
      setError(false);

      try {
        const vehicleName = buildVehicleName(vehicle);
        if (!vehicleName) {
          setIsLoading(false);
          return;
        }

        const result = await searchVehicleImageCached(vehicleName);
        
        if (result && result.imageUrl) {
          setImageData(result);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('[VehicleThumbnail] Erro ao buscar imagem:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    // Só busca se não for modo hover ou se estiver com hover
    if (!showOnHover || isHovered) {
      fetchImage();
    }
  }, [vehicle, showOnHover, isHovered]);

  // Renderizar ícone de fallback
  const renderFallbackIcon = () => {
    const IconComponent = getVehicleIcon(vehicle?.type);
    return (
      <div className={`${sizes[size]} bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-200 dark:border-neutral-700`}>
        <IconComponent className="w-1/2 h-1/2 text-neutral-500 dark:text-neutral-400" />
      </div>
    );
  };

  // Renderizar loading
  const renderLoading = () => (
    <div className={`${sizes[size]} bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-200 dark:border-neutral-700`}>
      <Loader2 className="w-1/2 h-1/2 text-neutral-500 dark:text-neutral-400 animate-spin" />
    </div>
  );

  // Renderizar erro
  const renderError = () => (
    <div className={`${sizes[size]} bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-200 dark:border-neutral-700`}>
      <AlertCircle className="w-1/2 h-1/2 text-neutral-400 dark:text-neutral-500" />
    </div>
  );

  // Renderizar imagem
  const renderImage = () => (
    <div className={`${sizes[size]} relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-sm`}>
      <img
        src={imageData.imageUrl}
        alt={`${vehicle?.brand} ${vehicle?.model}`}
        className="w-full h-full object-cover"
        onError={() => setError(true)}
      />
      {imageData.cached && (
        <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full m-0.5" 
             title="Imagem em cache" />
      )}
    </div>
  );

  // Conteúdo principal
  const renderContent = () => {
    if (isLoading) return renderLoading();
    if (error || !imageData) return renderFallbackIcon();
    return renderImage();
  };

  // Wrapper com hover se necessário
  const content = (
    <div 
      className={`inline-flex items-center gap-2 ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {renderContent()}
      
      {showLabel && vehicle && (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {vehicle.brand} {vehicle.model}
          </span>
          {vehicle.year && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {vehicle.year}
            </span>
          )}
        </div>
      )}
    </div>
  );

  // Se for modo hover, envolve com AnimatePresence
  if (showOnHover) {
    return (
      <div className="relative">
        {content}
        <AnimatePresence>
          {isHovered && imageData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 top-full left-0 mt-2 p-2 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700"
              style={{ minWidth: '200px' }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={imageData.imageUrl}
                  alt={`${vehicle?.brand} ${vehicle?.model}`}
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={() => setError(true)}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
                    {vehicle?.brand} {vehicle?.model}
                  </h4>
                  {vehicle?.year && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Ano: {vehicle.year}
                    </p>
                  )}
                  {vehicle?.color && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Cor: {vehicle.color}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    <ImageIcon className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600 dark:text-green-400">
                      {imageData.cached ? 'Cache' : 'API'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return content;
};

export default VehicleThumbnail;