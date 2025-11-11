import { motion } from 'framer-motion';
import { X, Clock, User, FileText, CheckCircle, AlertCircle, Calendar, Tag } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { formatDateTime } from '../../utils/dateHelpers';

const StageDetails = ({ stage, stageData, onClose }) => {
  const isCompleted = stageData?.completed;
  const isPending = !stageData;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg"
      >
        <GlassCard className="overflow-hidden" animate={false}>
          {/* Header with Gradient */}
          <div className={`relative p-6 bg-gradient-to-br ${stage.color} text-white`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }}></div>
            </div>

            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <stage.icon className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    {stage.label}
                  </h3>
                  <p className="text-sm opacity-90">
                    {stage.description}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
            >
              {isCompleted && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-semibold">Etapa Concluída</span>
                </div>
              )}
              {isPending && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-semibold">Aguardando Início</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6">
            {stageData ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Timestamp */}
                  {stageData.timestamp && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                          Data e Hora
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatDateTime(stageData.timestamp)}
                      </div>
                    </motion.div>
                  )}

                  {/* User */}
                  {stageData.userName && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                          Responsável
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {stageData.userName}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Budget ID */}
                {stageData.budgetId && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
                        Orçamento Vinculado
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      #{stageData.budgetId}
                    </div>
                  </motion.div>
                )}

                {/* Services */}
                {stageData.services && stageData.services.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Serviços Realizados
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {stageData.services.map((service, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-xs font-medium text-white shadow-lg shadow-blue-500/30"
                        >
                          {service}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Notes */}
                {stageData.notes && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Observações
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {stageData.notes}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Duration (if completed) */}
                {stageData.timestamp && stageData.completed && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          Status
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        Concluído
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4"
                >
                  <stage.icon className="w-10 h-10 text-gray-400" />
                </motion.div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Etapa Pendente
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                  Esta etapa ainda não foi iniciada. Ela será ativada automaticamente quando a etapa anterior for concluída.
                </p>
              </motion.div>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default StageDetails;
