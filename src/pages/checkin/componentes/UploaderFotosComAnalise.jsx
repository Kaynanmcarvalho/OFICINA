/**
 * UploaderFotos com Análise de Danos Integrada
 * Detecta automaticamente danos nas fotos usando IA
 */

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Scan, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import { useDamageDetection } from '../../../features/damage-detection';
import {
  DAMAGE_TYPE_LABELS,
  SEVERITY_LABELS,
  SEVERITY_COLORS,
} from '../../../features/damage-detection/types';

const UploaderFotosComAnalise = ({
  fotos,
  onChange,
  maxFotos = 10,
  autoAnalyze = true,
  vehicleInfo = null,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [analyzingIndex, setAnalyzingIndex] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const fileInputRef = useRef(null);

  const { analyzePhoto, isAnalyzing } = useDamageDetection();

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Erro ao comprimir imagem:', error);
      return file;
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const analyzePhotoForDamages = useCallback(
    async (foto, index) => {
      if (!foto.file) return foto;

      setAnalyzingIndex(index);

      try {
        const base64 = await fileToBase64(foto.file);
        const result = await analyzePhoto(base64, vehicleInfo);

        if (result) {
          return {
            ...foto,
            damageAnalysis: result,
            analyzed: true,
          };
        }
      } catch (error) {
        console.error('Erro na análise:', error);
      } finally {
        setAnalyzingIndex(null);
      }

      return { ...foto, analyzed: true, damageAnalysis: null };
    },
    [analyzePhoto, vehicleInfo]
  );

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
          size: compressedFile.size,
          analyzed: false,
          damageAnalysis: null,
        };
      })
    );

    const updatedFotos = [...fotos, ...newFotos];
    onChange(updatedFotos);

    // Auto-analisar se habilitado
    if (autoAnalyze) {
      const startIndex = fotos.length;
      for (let i = 0; i < newFotos.length; i++) {
        const analyzedFoto = await analyzePhotoForDamages(newFotos[i], startIndex + i);
        updatedFotos[startIndex + i] = analyzedFoto;
        onChange([...updatedFotos]);
      }
    }
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

  const handleManualAnalyze = async (index) => {
    const foto = fotos[index];
    const analyzedFoto = await analyzePhotoForDamages(foto, index);
    const newFotos = [...fotos];
    newFotos[index] = analyzedFoto;
    onChange(newFotos);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getDamageCount = (foto) => {
    return foto.damageAnalysis?.damages?.length || 0;
  };

  const getWorstSeverity = (foto) => {
    if (!foto.damageAnalysis?.damages?.length) return null;
    const severities = ['minor', 'moderate', 'severe'];
    let worst = 'minor';
    foto.damageAnalysis.damages.forEach((d) => {
      if (severities.indexOf(d.severity) > severities.indexOf(worst)) {
        worst = d.severity;
      }
    });
    return worst;
  };

  // Resumo total de danos
  const totalDamages = fotos.reduce((sum, foto) => sum + getDamageCount(foto), 0);
  const analyzedCount = fotos.filter((f) => f.analyzed).length;

  return (
    <div className="space-y-4">
      {/* Resumo de análise */}
      {fotos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700"
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                totalDamages > 0
                  ? 'bg-orange-100 dark:bg-orange-900/30'
                  : 'bg-green-100 dark:bg-green-900/30'
              }`}
            >
              {totalDamages > 0 ? (
                <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {totalDamages > 0
                  ? `${totalDamages} dano${totalDamages !== 1 ? 's' : ''} detectado${totalDamages !== 1 ? 's' : ''}`
                  : 'Nenhum dano detectado'}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {analyzedCount} de {fotos.length} fotos analisadas
              </p>
            </div>
          </div>

          {isAnalyzing && (
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs">Analisando...</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Área de Upload */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ease-out ${
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
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Upload className="w-6 h-6 text-white" />
          </div>

          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Clique ou arraste fotos aqui
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              As fotos serão analisadas automaticamente para detectar danos
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
            <Scan className="w-3.5 h-3.5" />
            <span>Análise com IA • {fotos.length}/{maxFotos} fotos</span>
          </div>
        </div>
      </div>

      {/* Grid de Fotos */}
      <AnimatePresence>
        {fotos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {fotos.map((foto, index) => {
              const damageCount = getDamageCount(foto);
              const worstSeverity = getWorstSeverity(foto);
              const isCurrentlyAnalyzing = analyzingIndex === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative group"
                >
                  <div
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                      worstSeverity === 'severe'
                        ? 'border-red-400 dark:border-red-600'
                        : worstSeverity === 'moderate'
                          ? 'border-orange-400 dark:border-orange-600'
                          : worstSeverity === 'minor'
                            ? 'border-yellow-400 dark:border-yellow-600'
                            : foto.analyzed
                              ? 'border-green-400 dark:border-green-600'
                              : 'border-neutral-200 dark:border-neutral-700'
                    }`}
                    onClick={() => setSelectedPhoto(foto)}
                  >
                    <img
                      src={foto.preview}
                      alt={foto.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay de análise */}
                    {isCurrentlyAnalyzing && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                          <span className="text-xs text-white font-medium">Analisando...</span>
                        </div>
                      </div>
                    )}

                    {/* Badge de danos */}
                    {foto.analyzed && !isCurrentlyAnalyzing && (
                      <div className="absolute top-2 left-2">
                        {damageCount > 0 ? (
                          <div
                            className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${
                              SEVERITY_COLORS[worstSeverity]?.bg || 'bg-yellow-100'
                            } ${SEVERITY_COLORS[worstSeverity]?.text || 'text-yellow-700'}`}
                          >
                            <AlertTriangle className="w-3 h-3" />
                            {damageCount}
                          </div>
                        ) : (
                          <div className="px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400">
                            <CheckCircle className="w-3 h-3" />
                            OK
                          </div>
                        )}
                      </div>
                    )}

                    {/* Botão analisar (se não analisado) */}
                    {!foto.analyzed && !isCurrentlyAnalyzing && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleManualAnalyze(index);
                        }}
                        className="absolute bottom-2 left-2 px-2 py-1 rounded-lg text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1 transition-colors"
                      >
                        <Scan className="w-3 h-3" />
                        Analisar
                      </button>
                    )}

                    {/* Botão remover */}
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

                    {/* Info no hover */}
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs text-white truncate">{foto.name}</p>
                      <p className="text-xs text-neutral-300">{formatFileSize(foto.size)}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Modal de detalhes da foto */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Imagem */}
              <div className="relative">
                <img
                  src={selectedPhoto.preview}
                  alt={selectedPhoto.name}
                  className="w-full h-auto"
                />
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Detalhes dos danos */}
              {selectedPhoto.damageAnalysis && (
                <div className="p-5">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    Análise de Danos
                  </h3>

                  {selectedPhoto.damageAnalysis.damages.length > 0 ? (
                    <div className="space-y-3">
                      {selectedPhoto.damageAnalysis.damages.map((damage, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-xl border ${SEVERITY_COLORS[damage.severity]?.bg} ${SEVERITY_COLORS[damage.severity]?.border}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <AlertTriangle
                                className={`w-4 h-4 ${SEVERITY_COLORS[damage.severity]?.text}`}
                              />
                              <span
                                className={`font-medium text-sm ${SEVERITY_COLORS[damage.severity]?.text}`}
                              >
                                {DAMAGE_TYPE_LABELS[damage.type] || damage.type}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${SEVERITY_COLORS[damage.severity]?.bg} ${SEVERITY_COLORS[damage.severity]?.text}`}
                            >
                              {SEVERITY_LABELS[damage.severity]}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                            {damage.description}
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            Localização: {damage.location?.position || 'Não especificada'} •
                            Confiança: {Math.round(damage.confidence * 100)}%
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-center">
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                      <p className="font-medium text-green-800 dark:text-green-200">
                        Nenhum dano detectado
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploaderFotosComAnalise;
