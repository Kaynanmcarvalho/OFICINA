/**
 * ServiceSummary Component
 * Resumo visual completo do serviço realizado
 * Exibe fotos antes/depois, serviços, checklist e observações
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Calendar,
  User,
  Car,
  FileText,
  Image as ImageIcon,
  X
} from 'lucide-react';

const ServiceSummary = ({ 
  checkinData,
  checkoutData = {},
  onUpdate 
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Calcular duração do serviço
  const calculateDuration = () => {
    if (!checkinData?.createdAt) return 'N/A';
    
    const start = new Date(checkinData.createdAt);
    const end = checkoutData.completedAt ? new Date(checkoutData.completedAt) : new Date();
    const diffMs = end - start;
    
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Formatar data
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Contar itens do checklist
  const getChecklistStats = () => {
    const checklist = checkinData?.checklist || [];
    const total = checklist.length;
    const ok = checklist.filter(item => item.status === 'ok').length;
    const issues = checklist.filter(item => item.status === 'issue').length;
    
    return { total, ok, issues };
  };

  const checklistStats = getChecklistStats();
  const entryPhotos = checkinData?.photos?.entry || [];
  const exitPhotos = checkoutData?.photos || [];

  return (
    <div className="space-y-6">
      {/* Header com informações principais */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/30"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Resumo do Serviço
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Documentação completa do atendimento
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              Serviço Concluído
            </span>
          </div>
        </div>

        {/* Grid de informações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard
            icon={User}
            label="Cliente"
            value={checkinData?.clientName || 'N/A'}
          />
          <InfoCard
            icon={Car}
            label="Veículo"
            value={`${checkinData?.vehicleBrand || ''} ${checkinData?.vehicleModel || 'N/A'}`}
            subtitle={checkinData?.vehiclePlate || ''}
          />
          <InfoCard
            icon={Clock}
            label="Duração"
            value={calculateDuration()}
          />
          <InfoCard
            icon={Calendar}
            label="Entrada"
            value={formatDate(checkinData?.createdAt)}
          />
        </div>
      </motion.div>

      {/* Fotos Antes/Depois */}
      {(entryPhotos.length > 0 || exitPhotos.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Documentação Fotográfica
            </h4>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fotos de Entrada */}
            {entryPhotos.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  Condição na Entrada ({entryPhotos.length})
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {entryPhotos.map((photo, index) => (
                    <PhotoThumbnail
                      key={`entry-${index}`}
                      src={photo}
                      alt={`Entrada ${index + 1}`}
                      onClick={() => setSelectedPhoto(photo)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Fotos de Saída */}
            {exitPhotos.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  Condição na Saída ({exitPhotos.length})
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {exitPhotos.map((photo, index) => (
                    <PhotoThumbnail
                      key={`exit-${index}`}
                      src={photo}
                      alt={`Saída ${index + 1}`}
                      onClick={() => setSelectedPhoto(photo)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Serviços Realizados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Serviços Realizados
          </h4>
        </div>

        <div className="space-y-2">
          {checkinData?.services ? (
            checkinData.services.split(',').map((service, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="text-gray-900 dark:text-white">
                  {service.trim()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Nenhum serviço especificado
            </p>
          )}
        </div>
      </motion.div>

      {/* Checklist */}
      {checkinData?.checklist && checkinData.checklist.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Checklist de Inspeção
            </h4>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ {checklistStats.ok} OK
              </span>
              {checklistStats.issues > 0 && (
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  ⚠ {checklistStats.issues} Problemas
                </span>
              )}
              <span className="text-gray-500 dark:text-gray-400">
                {checklistStats.total} itens
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {checkinData.checklist.map((item, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-xl ${
                  item.status === 'ok'
                    ? 'bg-emerald-50 dark:bg-emerald-950/20'
                    : item.status === 'issue'
                    ? 'bg-amber-50 dark:bg-amber-950/20'
                    : 'bg-gray-50 dark:bg-gray-800'
                }`}
              >
                {item.status === 'ok' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : item.status === 'issue' ? (
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {item.label}
                  </p>
                  {item.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Observações */}
      {(checkinData?.observations || checkoutData?.finalObservations) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Observações
          </h4>

          {checkinData?.observations && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Observações de Entrada:
              </p>
              <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                {checkinData.observations}
              </p>
            </div>
          )}

          {checkoutData?.finalObservations && (
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Observações Finais:
              </p>
              <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                {checkoutData.finalObservations}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Modal de Foto */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <img
                src={selectedPhoto}
                alt="Foto ampliada"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente auxiliar para cards de informação
const InfoCard = ({ icon: Icon, label, value, subtitle }) => (
  <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </span>
    </div>
    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
      {value}
    </p>
    {subtitle && (
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-mono">
        {subtitle}
      </p>
    )}
  </div>
);

// Componente auxiliar para thumbnails de fotos
const PhotoThumbnail = ({ src, alt, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors group"
  >
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
      <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  </motion.button>
);

export default ServiceSummary;
