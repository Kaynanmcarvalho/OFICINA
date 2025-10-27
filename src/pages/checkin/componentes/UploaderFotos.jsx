import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import imageCompression from 'browser-image-compression';

const UploaderFotos = ({ fotos, onChange, maxFotos = 10 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };

    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Erro ao comprimir imagem:', error);
      return file;
    }
  };

  const handleFiles = async (files) => {
    const filesArray = Array.from(files);
    const remainingSlots = maxFotos - fotos.length;

    if (filesArray.length > remainingSlots) {
      alert(`Você pode adicionar no máximo ${remainingSlots} foto(s)`);
      return;
    }

    const newFotos = await Promise.all(
      filesArray.map(async (file) => {
        const compressedFile = await compressImage(file);
        const preview = URL.createObjectURL(compressedFile);

        return {
          file: compressedFile,
          preview,
          name: file.name,
          size: compressedFile.size
        };
      })
    );

    onChange([...fotos, ...newFotos]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleRemove = (index) => {
    const newFotos = fotos.filter((_, i) => i !== index);
    onChange(newFotos);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-3">
      {/* Área de Upload */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ease-out ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-neutral-300 dark:border-neutral-700 hover:border-blue-400 dark:hover:border-blue-600 bg-neutral-50 dark:bg-neutral-800/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>

          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Clique ou arraste fotos aqui
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              PNG, JPG ou WEBP até 10MB • Máximo {maxFotos} fotos
            </p>
          </div>

          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            {fotos.length} de {maxFotos} fotos adicionadas
          </p>
        </div>
      </div>

      {/* Preview das Fotos */}
      <AnimatePresence>
        {fotos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {fotos.map((foto, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
              >
                <img
                  src={foto.preview}
                  alt={foto.name}
                  className="w-full h-full object-cover"
                />

                {/* Overlay com informações */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-2">
                  <ImageIcon className="w-6 h-6 text-white mb-2" />
                  <p className="text-xs text-white text-center truncate w-full px-2">
                    {foto.name}
                  </p>
                  <p className="text-xs text-neutral-300 mt-1">
                    {formatFileSize(foto.size)}
                  </p>
                </div>

                {/* Botão Remover */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                  aria-label="Remover foto"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploaderFotos;
