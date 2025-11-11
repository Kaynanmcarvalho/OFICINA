/**
 * PhotoUploadSection - Upload de fotos com overlay automático
 * Aplica cor do veículo e logo da marca
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';
import { uploadCheckinPhoto } from '../../../services/storageService';

const PhotoUploadSection = ({ vehicleData, placa, onPhotosChange }) => {
  const { isDarkMode } = useThemeStore();
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const applyOverlay = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Desenha a imagem original
          ctx.drawImage(img, 0, 0);
          
          // Aplica overlay de cor (se disponível)
          if (vehicleData?.cor) {
            ctx.fillStyle = `${vehicleData.cor}20`; // 20 = 12.5% opacity
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          
          // Adiciona marca no canto inferior
          if (vehicleData?.marca) {
            const fontSize = Math.max(canvas.width * 0.04, 20);
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.lineWidth = 3;
            
            const text = vehicleData.marca.toUpperCase();
            const textWidth = ctx.measureText(text).width;
            const x = canvas.width - textWidth - 20;
            const y = canvas.height - 20;
            
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
          }
          
          // Adiciona placa no canto superior
          if (placa) {
            const fontSize = Math.max(canvas.width * 0.035, 18);
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.lineWidth = 3;
            
            const text = placa.toUpperCase();
            const textWidth = ctx.measureText(text).width;
            const x = 20;
            const y = 40;
            
            // Fundo semi-transparente
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(x - 10, y - fontSize - 5, textWidth + 20, fontSize + 15);
            
            ctx.strokeText(text, x, y);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.fillText(text, x, y);
          }
          
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          }, 'image/jpeg', 0.9);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    try {
      const newPhotos = [];
      
      for (const file of Array.from(files)) {
        // Aplica overlay
        const processedFile = await applyOverlay(file);
        
        // Cria preview
        const previewUrl = URL.createObjectURL(processedFile);
        
        // Upload para Firebase Storage
        const uploadedUrl = await uploadCheckinPhoto(placa, processedFile);
        
        newPhotos.push({
          id: Date.now() + Math.random(),
          file: processedFile,
          preview: previewUrl,
          url: uploadedUrl,
          uploaded: true
        });
      }
      
      const updatedPhotos = [...photos, ...newPhotos];
      setPhotos(updatedPhotos);
      
      if (onPhotosChange) {
        onPhotosChange(updatedPhotos.map(p => p.url));
      }
    } catch (error) {
      console.error('Erro ao processar fotos:', error);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (photoId) => {
    const updatedPhotos = photos.filter(p => p.id !== photoId);
    setPhotos(updatedPhotos);
    
    if (onPhotosChange) {
      onPhotosChange(updatedPhotos.map(p => p.url));
    }
  };

  const openPreview = (photo) => {
    setPreviewPhoto(photo);
  };

  const closePreview = () => {
    setPreviewPhoto(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        rounded-2xl border-2 p-6
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        shadow-xl
      `}
    >
      <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Fotos do Veículo
      </h3>
      
      <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Tire ou faça upload de fotos. A marca e placa serão adicionadas automaticamente.
      </p>

      {/* Botões de ação */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => cameraInputRef.current?.click()}
          disabled={uploading}
          className={`
            flex items-center justify-center gap-2 p-4 rounded-xl
            font-medium transition-all
            ${isDarkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <Camera className="w-5 h-5" />
          Tirar Foto
        </button>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={`
            flex items-center justify-center gap-2 p-4 rounded-xl
            font-medium transition-all border-2
            ${isDarkMode
              ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white'
              : 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-900'
            }
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <Upload className="w-5 h-5" />
          Upload
        </button>
      </div>

      {/* Inputs ocultos */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Loading */}
      {uploading && (
        <div className={`
          flex items-center justify-center gap-3 p-4 rounded-lg mb-6
          ${isDarkMode ? 'bg-blue-600/20' : 'bg-blue-50'}
        `}>
          <div className="w-5 h-5 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            Processando fotos...
          </span>
        </div>
      )}

      {/* Grid de fotos */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group"
            >
              <div
                onClick={() => openPreview(photo)}
                className={`
                  relative aspect-video rounded-lg overflow-hidden cursor-pointer
                  border-2 transition-all
                  ${isDarkMode ? 'border-gray-700 hover:border-blue-500' : 'border-gray-200 hover:border-blue-400'}
                `}
              >
                <img
                  src={photo.preview}
                  alt="Foto do veículo"
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay ao hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-white" />
                </div>
                
                {/* Badge de sucesso */}
                {photo.uploaded && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              {/* Botão remover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(photo.id);
                }}
                className={`
                  absolute -top-2 -right-2 p-1.5 rounded-full
                  bg-red-500 text-white shadow-lg
                  opacity-0 group-hover:opacity-100 transition-opacity
                  hover:bg-red-600
                `}
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className={`
          flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed
          ${isDarkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-300 bg-gray-50'}
        `}>
          <Camera className={`w-12 h-12 mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Nenhuma foto adicionada ainda
          </p>
        </div>
      )}

      {/* Modal de preview */}
      <AnimatePresence>
        {previewPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePreview}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh]"
            >
              <img
                src={previewPhoto.preview}
                alt="Preview"
                className="max-w-full max-h-[90vh] rounded-lg"
              />
              
              <button
                onClick={closePreview}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PhotoUploadSection;
