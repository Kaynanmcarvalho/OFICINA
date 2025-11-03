/**
 * PhotoCapture Component
 * Captura e gerenciamento de fotos do veículo com compressão automática
 * Design Apple-level com preview e upload para Firebase
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Upload, Image as ImageIcon, Check } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../config/firebase';
import toast from 'react-hot-toast';

const PhotoCapture = ({ 
  photos = [], 
  onPhotosChange, 
  maxPhotos = 4,
  checkinId = null 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const fileInputRef = useRef(null);

  // Comprimir imagem antes do upload
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/jpeg',
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Erro ao comprimir imagem:', error);
      return file;
    }
  };

  // Upload para Firebase Storage
  const uploadToFirebase = async (file, index) => {
    if (!checkinId) {
      // Se não tem checkinId ainda, retorna data URL temporária
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    }

    const timestamp = Date.now();
    const filename = `photo_${index}_${timestamp}.jpg`;
    const storageRef = ref(storage, `checkins/${checkinId}/photos/entry/${filename}`);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  // Processar fotos selecionadas
  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    
    if (photos.length + files.length > maxPhotos) {
      toast.error(`Máximo de ${maxPhotos} fotos permitidas`);
      return;
    }

    setIsUploading(true);

    try {
      const newPhotos = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Comprimir
        const compressedFile = await compressImage(file);
        
        // Upload
        const url = await uploadToFirebase(compressedFile, photos.length + i);
        
        newPhotos.push({
          id: `photo_${Date.now()}_${i}`,
          url,
          file: compressedFile,
          timestamp: new Date().toISOString(),
        });
      }

      onPhotosChange([...photos, ...newPhotos]);
      
      toast.success(`${newPhotos.length} foto(s) adicionada(s)`, {
        icon: '📸',
        style: {
          borderRadius: '12px',
          background: '#10B981',
          color: '#fff',
        },
      });
    } catch (error) {
      console.error('Erro ao processar fotos:', error);
      toast.error('Erro ao adicionar fotos');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Remover foto
  const handleRemovePhoto = (photoId) => {
    const updatedPhotos = photos.filter(p => p.id !== photoId);
    onPhotosChange(updatedPhotos);
    toast.success('Foto removida');
  };

  // Abrir seletor de arquivos
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Fotos do Veículo
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({photos.length}/{maxPhotos})
          </span>
        </div>

        {photos.length < maxPhotos && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCameraClick}
            disabled={isUploading}
            className="
              flex items-center gap-2 px-4 py-2 rounded-xl
              bg-blue-500 hover:bg-blue-600 text-white
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              shadow-lg shadow-blue-500/30
            "
          >
            {isUploading ? (
              <>
                <Upload className="w-4 h-4 animate-bounce" />
                <span className="text-sm font-medium">Processando...</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span className="text-sm font-medium">Adicionar Foto</span>
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Grid de fotos */}
      {photos.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                {/* Foto */}
                <div
                  onClick={() => setPreviewPhoto(photo)}
                  className="
                    relative aspect-square rounded-2xl overflow-hidden
                    bg-gray-100 dark:bg-gray-800
                    cursor-pointer
                    border-2 border-gray-200 dark:border-gray-700
                    hover:border-blue-500 dark:hover:border-blue-400
                    transition-all duration-200
                  "
                >
                  <img
                    src={photo.url}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay no hover */}
                  <div className="
                    absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                    transition-opacity duration-200
                    flex items-center justify-center
                  ">
                    <ImageIcon className="w-8 h-8 text-white" />
                  </div>

                  {/* Badge de número */}
                  <div className="
                    absolute top-2 left-2
                    w-6 h-6 rounded-full
                    bg-blue-500 text-white
                    flex items-center justify-center
                    text-xs font-bold
                    shadow-lg
                  ">
                    {index + 1}
                  </div>
                </div>

                {/* Botão remover */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemovePhoto(photo.id)}
                  className="
                    absolute -top-2 -right-2
                    w-8 h-8 rounded-full
                    bg-red-500 hover:bg-red-600 text-white
                    flex items-center justify-center
                    shadow-lg shadow-red-500/50
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-200
                  "
                  aria-label="Remover foto"
                >
                  <X className="w-4 h-4" />
                </motion.button>

                {/* Indicador de sucesso */}
                {photo.url && !photo.url.startsWith('data:') && (
                  <div className="
                    absolute bottom-2 right-2
                    w-6 h-6 rounded-full
                    bg-green-500 text-white
                    flex items-center justify-center
                    shadow-lg
                  ">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty state */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleCameraClick}
          className="
            flex flex-col items-center justify-center
            py-12 px-6 rounded-2xl
            border-2 border-dashed border-gray-300 dark:border-gray-700
            hover:border-blue-500 dark:hover:border-blue-400
            bg-gray-50 dark:bg-gray-800/50
            cursor-pointer
            transition-all duration-200
          "
        >
          <Camera className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Nenhuma foto adicionada
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Clique para adicionar fotos do veículo
          </p>
        </motion.div>
      )}

      {/* Modal de preview */}
      <AnimatePresence>
        {previewPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewPhoto(null)}
            className="
              fixed inset-0 z-50
              bg-black/90 backdrop-blur-sm
              flex items-center justify-center
              p-4
            "
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full"
            >
              <img
                src={previewPhoto.url}
                alt="Preview"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              
              <button
                onClick={() => setPreviewPhoto(null)}
                className="
                  absolute top-4 right-4
                  w-10 h-10 rounded-full
                  bg-white/10 hover:bg-white/20 backdrop-blur-md
                  text-white
                  flex items-center justify-center
                  transition-all duration-200
                "
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotoCapture;
