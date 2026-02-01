/**
 * DiagnosisUploader Component
 * 
 * Upload de imagens para diagnóstico visual de veículos
 * Features: Drag & drop, preview, compressão, progress tracking
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Camera, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { useDiagnosis } from '../../hooks/useDiagnosis';
import { useThemeStore } from '../../store/themeStore';
import toast from 'react-hot-toast';

const DiagnosisUploader = ({ vehicleId, clientId, onComplete, onError }) => {
  const { isDarkMode } = useThemeStore();
  const { upload, isLoading, error } = useDiagnosis();
  
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Drag & drop configuration
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    // Limit to 5 images
    if (files.length + acceptedFiles.length > 5) {
      toast.error('Máximo de 5 imagens por análise');
      return;
    }

    // Compress images
    const compressedFiles = await Promise.all(
      acceptedFiles.map(async (file) => {
        try {
          const compressed = await imageCompression(file, {
            maxSizeMB: 2,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });
          return compressed;
        } catch (err) {
          console.error('Error compressing image:', err);
          return file;
        }
      })

    // Generate previews
    const newPreviews = await Promise.all(
      compressedFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      })

    setFiles((prev) => [...prev, ...compressedFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  });

  // Remove file
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle upload
  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Selecione pelo menos uma imagem');
      return;
    }

    try {
      const diagnosisId = await upload({
        files,
        vehicleId,
        clientId,
        onProgress: setUploadProgress,
      });

      toast.success('Análise iniciada! Processando imagens...');
      
      if (onComplete) {
        onComplete(diagnosisId);
      }

      // Reset
      setFiles([]);
      setPreviews([]);
      setUploadProgress(0);
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Erro ao fazer upload das imagens');
      
      if (onError) {
        onError(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12
          transition-all duration-300 cursor-pointer
          ${isDragActive
            ? 'border-blue-500 bg-blue-500/10'
            : isDarkMode
            ? 'border-gray-700 hover:border-gray-600 bg-gray-900/50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <motion.div
            animate={{
              scale: isDragActive ? 1.1 : 1,
              rotate: isDragActive ? 5 : 0,
            }}
            className={`
              p-6 rounded-full
              ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
            `}
          >
            {isDragActive ? (
              <Upload className="w-12 h-12 text-blue-500" />
            ) : (
              <Camera className={`w-12 h-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            )}
          </motion.div>

          <div>
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {isDragActive ? 'Solte as imagens aqui' : 'Arraste fotos do veículo'}
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              ou clique para selecionar (máx. 5 imagens, 10MB cada)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CheckCircle2 className="w-4 h-4" />
            <span>JPG, PNG, WEBP</span>
          </div>
        </div>
      </motion.div>

      {/* Preview Grid */}
      <AnimatePresence>
        {previews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Imagens selecionadas ({files.length}/5)
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {previews.map((preview, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  
                  <button
                    onClick={() => removeFile(index)}
                    className={`
                      absolute top-2 right-2 p-1.5 rounded-lg
                      opacity-0 group-hover:opacity-100 transition-opacity
                      ${isDarkMode ? 'bg-gray-900/90' : 'bg-white/90'}
                    `}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>

                  <div className={`
                    absolute bottom-2 left-2 px-2 py-1 rounded-md text-xs font-medium
                    ${isDarkMode ? 'bg-gray-900/90 text-white' : 'bg-white/90 text-gray-900'}
                  `}>
                    {(files[index].size / 1024 / 1024).toFixed(1)}MB
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Progress */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`
              p-4 rounded-xl
              ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}
            `}
          >
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Processando imagens...
              </span>
            </div>
            
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Isso pode levar até 30 segundos...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-500">Erro ao processar imagens</p>
              <p className="text-xs text-red-400 mt-1">{error.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUpload}
          disabled={files.length === 0 || isLoading}
          className={`
            flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl
            font-semibold transition-all duration-200
            ${files.length === 0 || isLoading
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
            }
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Camera className="w-5 h-5" />
              Analisar {files.length > 0 && `(${files.length})`}
            </>
          )}
        </motion.button>

        {files.length > 0 && !isLoading && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setFiles([]);
              setPreviews([]);
            }}
            className={`
              px-6 py-3 rounded-xl font-semibold transition-all duration-200
              ${isDarkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            Limpar
          </motion.button>
        )}
      </div>

      {/* Info */}
      <div className={`
        text-xs text-center space-y-1
        ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}
      `}>
        <p>As imagens serão analisadas automaticamente por IA</p>
        <p>Você receberá um relatório detalhado em instantes</p>
      </div>
    </div>
  );
};

export default DiagnosisUploader;
