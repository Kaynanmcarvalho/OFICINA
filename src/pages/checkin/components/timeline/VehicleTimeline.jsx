import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogIn, 
  Search, 
  FileText, 
  Wrench, 
  CheckCircle, 
  LogOut,
  Clock,
  User,
  TrendingUp,
  AlertCircle,
  X
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import StageDetails from './StageDetails';
import { useVehicleTimeline } from '../../hooks/useVehicleTimeline';
import { formatTime } from '../../utils/dateHelpers';

const STAGES = [
  {
    id: 'checkin',
    label: 'Check-in',
    icon: LogIn,
    color: 'from-blue-500 to-blue-600',
    description: 'Entrada do veículo'
  },
  {
    id: 'diagnostico',
    label: 'Diagnóstico',
    icon: Search,
    color: 'from-purple-500 to-purple-600',
    description: 'Análise técnica'
  },
  {
    id: 'orcamento',
    label: 'Orçamento',
    icon: FileText,
    color: 'from-orange-500 to-orange-600',
    description: 'Aprovação de serviços'
  },
  {
    id: 'execucao',
    label: 'Execução',
    icon: Wrench,
    color: 'from-red-500 to-red-600',
    description: 'Realização dos serviços'
  },
  {
    id: 'finalizacao',
    label: 'Finalização',
    icon: CheckCircle,
    color: 'from-green-500 to-green-600',
    description: 'Controle de qualidade'
  },
  {
    id: 'checkout',
    label: 'Check-out',
    icon: LogOut,
    color: 'from-emerald-500 to-emerald-600',
    description: 'Entrega do veículo'
  }
];

const VehicleTimeline = ({ checkinId, className = '' }) => {
  const { timeline, currentStage, progress, loading, stageOrder } = useVehicleTimeline(checkinId);
  const [selectedStage, setSelectedStage] = useState(null);
  
  // Usar ordem personalizada ou padrão
  const activeStages = stageOrder || STAGES.map(s => s.id);

  // DEBUG: Log para ver o que está chegando
  console.log('🔍 VehicleTimeline Debug:', {
    checkinId,
    hasTimeline: !!timeline,
    timeline: timeline,
    currentStage,
    progress,
    loading,
    stages: timeline?.stages,
    stagesKeys: timeline?.stages ? Object.keys(timeline.stages) : []
  });

  const getStageStatus = (stageId) => {
    const stageData = timeline?.stages?.[stageId];
    
    // Verificar se a etapa foi pulada (orçamento recusado/expirado)
    if (stageData?.skipped) return 'skipped';
    
    // Verificar status especial do orçamento
    if (stageId === 'orcamento' && stageData?.status) {
      if (stageData.status === 'rejected_total') return 'rejected';
      if (stageData.status === 'expired') return 'expired';
      if (stageData.status === 'pending') return 'pending-approval';
    }
    
    // Usar ordem personalizada se disponível
    const stages = activeStages.map(id => STAGES.find(s => s.id === id)).filter(Boolean);
    const stageIndex = stages.findIndex(s => s.id === stageId);
    const currentIndex = stages.findIndex(s => s.id === currentStage);
    
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'current';
    return 'pending';
  };

  if (loading) {
    return (
      <GlassCard className={`p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Carregando timeline...
          </p>
        </div>
      </GlassCard>
    );
  }

  // Se não há timeline, retornar mensagem
  if (!timeline) {
    console.log('❌ Timeline não encontrada para checkinId:', checkinId);
    return (
      <GlassCard className={`p-6 ${className}`}>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Dados da timeline não encontrados
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Check-in ID: {checkinId}
          </p>
          <p className="text-xs text-red-500 mt-2">
            Debug: O documento não foi encontrado no Firebase
          </p>
        </div>
      </GlassCard>
    );
  }

  // Se o check-in não tem stages (check-in antigo), criar estrutura mínima
  if (!timeline.stages || Object.keys(timeline.stages).length === 0) {
    // Inferir estágio atual baseado no status ou usar 'checkin' como padrão
    const inferredStage = timeline.currentStage || 'checkin';
    
    // Criar estrutura mínima de stages
    timeline.stages = {
      [inferredStage]: {
        completed: true,
        timestamp: timeline.createdAt || timeline.checkinDate || new Date(),
        userId: timeline.userId || 'unknown',
        userName: timeline.userName || timeline.responsible || 'Sistema'
      }
    };
    
    // Garantir que currentStage está definido
    if (!timeline.currentStage) {
      timeline.currentStage = inferredStage;
    }
  }

  const currentStageIndex = STAGES.findIndex(s => s.id === currentStage);
  const completedStages = currentStageIndex + 1;
  const totalStages = STAGES.length;

  return (
    <div className={className}>
      <GlassCard className="p-5">
        {/* Header with Progress Stats */}
        <div className="mb-7">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Timeline do Atendimento
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Acompanhe o progresso do veículo em tempo real
              </p>
              
              {/* Aviso para check-ins antigos */}
              {(!timeline.stages || Object.keys(timeline.stages).length <= 1) && (
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-[10px] text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>Check-in criado antes da implementação da timeline. Exibindo etapa atual baseada no status do registro.</span>
                  </p>
                </div>
              )}
            </div>
            
            {/* Progress Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
            >
              <TrendingUp className="w-4 h-4" />
              <div className="text-right">
                <div className="text-xl font-bold">{Math.round(progress)}%</div>
                <div className="text-[10px] opacity-90">{completedStages}/{totalStages} etapas</div>
              </div>
            </motion.div>
          </div>

          {/* Progress Info Cards */}
          <div className="grid grid-cols-3 gap-2.5 mt-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-2.5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                <span className="text-[10px] font-medium text-green-700 dark:text-green-300">Concluídas</span>
              </div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {currentStageIndex}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                <span className="text-[10px] font-medium text-orange-700 dark:text-orange-300">Em andamento</span>
              </div>
              <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                1
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">Pendentes</span>
              </div>
              <div className="text-xl font-bold text-gray-600 dark:text-gray-400">
                {totalStages - completedStages}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Progress Bar with Animation */}
        <div className="relative mb-10">
          {/* Background Line */}
          <div className="absolute top-7 left-0 right-0 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 via-orange-500 via-red-500 via-green-500 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>

          {/* Stages */}
          <div className="relative flex justify-between">
            {activeStages.map((stageId, index) => {
              const stage = STAGES.find(s => s.id === stageId);
              if (!stage) return null;
              
              const status = getStageStatus(stage.id);
              const stageData = timeline?.stages?.[stage.id];
              
              return (
                <motion.button
                  key={stage.id}
                  onClick={() => setSelectedStage(stage)}
                  className="flex flex-col items-center gap-2 z-10 group relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.08, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Hover Tooltip */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-gray-900 dark:bg-gray-800 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
                      <div className="font-semibold">{stage.label}</div>
                      <div className="text-gray-300">{stage.description}</div>
                      {stageData?.timestamp && (
                        <div className="text-gray-400 mt-0.5">
                          {formatTime(stageData.timestamp)}
                        </div>
                      )}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-900 dark:bg-gray-800 rotate-45"></div>
                    </div>
                  </div>

                  {/* Stage Icon */}
                  <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center
                    transition-all duration-300 relative overflow-hidden
                    ${status === 'completed'
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/40 ring-4 ring-green-500/20'
                      : status === 'skipped' || status === 'rejected'
                        ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/40 ring-4 ring-red-500/20'
                        : status === 'expired'
                          ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg shadow-yellow-500/40 ring-4 ring-yellow-500/20'
                          : status === 'pending-approval'
                            ? 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/40 ring-4 ring-orange-500/20'
                            : status === 'current'
                              ? `bg-gradient-to-br ${stage.color} shadow-xl shadow-orange-500/50 ring-4 ring-orange-500/30`
                              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }
                  `}>
                    {status === 'completed' ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      >
                        <CheckCircle className="w-7 h-7 text-white" />
                      </motion.div>
                    ) : status === 'skipped' || status === 'rejected' ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      >
                        <X className="w-7 h-7 text-white" />
                      </motion.div>
                    ) : status === 'expired' ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      >
                        <AlertCircle className="w-7 h-7 text-white" />
                      </motion.div>
                    ) : status === 'pending-approval' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Clock className="w-7 h-7 text-white" />
                      </motion.div>
                    ) : (
                      <stage.icon className={`w-7 h-7 ${
                        status === 'current' ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                      }`} />
                    )}
                    
                    {/* Pulse animation for current stage */}
                    {status === 'current' && (
                      <>
                        <motion.div
                          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stage.color}`}
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.6, 0.2, 0.6]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{ zIndex: -1 }}
                        />
                        {/* Rotating border */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl"
                          style={{
                            background: `conic-gradient(from 0deg, transparent, ${stage.color.split(' ')[1]}, transparent)`
                          }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                      </>
                    )}

                    {/* Completion checkmark animation */}
                    {status === 'completed' && (
                      <motion.div
                        className="absolute inset-0 bg-white/20 rounded-2xl"
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.5, 0] }}
                        transition={{ duration: 0.6 }}
                      />
                    )}
                  </div>

                  {/* Stage Label */}
                  <div className="text-center min-w-[72px]">
                    <span className={`text-xs font-semibold block ${
                      status === 'completed' || status === 'current'
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {stage.label}
                    </span>
                    
                    {/* Status Badge */}
                    {status === 'completed' && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block mt-0.5 px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-[9px] font-medium text-green-600 dark:text-green-400"
                      >
                        ✓ Concluído
                      </motion.span>
                    )}
                    {status === 'current' && (
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-block mt-0.5 px-1.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-[9px] font-medium text-orange-600 dark:text-orange-400"
                      >
                        ● Em andamento
                      </motion.span>
                    )}
                    
                    {/* Timestamp */}
                    {stageData?.timestamp && (
                      <div className="flex items-center justify-center gap-0.5 mt-0.5">
                        <Clock className="w-2.5 h-2.5 text-gray-400" />
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">
                          {formatTime(stageData.timestamp)}
                        </span>
                      </div>
                    )}
                    
                    {/* User */}
                    {stageData?.userName && (
                      <div className="flex items-center justify-center gap-0.5 mt-0.5">
                        <User className="w-2.5 h-2.5 text-gray-400" />
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[72px]">
                          {stageData.userName}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Current Stage Info Card */}
        {currentStage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-5 text-white shadow-xl shadow-orange-500/30">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '32px 32px'
                }}></div>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      {STAGES.find(s => s.id === currentStage)?.icon && (
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {(() => {
                            const Icon = STAGES.find(s => s.id === currentStage)?.icon;
                            return <Icon className="w-5 h-5 text-white" />;
                          })()}
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <div className="text-[10px] font-medium opacity-90 mb-0.5">Estágio Atual</div>
                      <div className="text-lg font-bold">
                        {STAGES.find(s => s.id === currentStage)?.label}
                      </div>
                    </div>
                  </div>

                  {/* Live Indicator */}
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm"
                  >
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-white"
                    />
                    <span className="text-[10px] font-semibold">AO VIVO</span>
                  </motion.div>
                </div>

                <p className="text-xs opacity-90 mb-3">
                  {STAGES.find(s => s.id === currentStage)?.description}
                </p>

                {/* Stage Data */}
                {timeline?.stages?.[currentStage] && (
                  <div className="flex items-center gap-3 text-xs">
                    {timeline.stages[currentStage].timestamp && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 opacity-75" />
                        <span className="opacity-90">
                          Iniciado às {formatTime(timeline.stages[currentStage].timestamp)}
                        </span>
                      </div>
                    )}
                    {timeline.stages[currentStage].userName && (
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 opacity-75" />
                        <span className="opacity-90">
                          {timeline.stages[currentStage].userName}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Next Stage Preview */}
                {currentStageIndex < STAGES.length - 1 && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <div className="flex items-center justify-between text-xs">
                      <span className="opacity-75">Próxima etapa:</span>
                      <div className="flex items-center gap-1.5 font-semibold">
                        {(() => {
                          const NextIcon = STAGES[currentStageIndex + 1]?.icon;
                          return NextIcon && <NextIcon className="w-3.5 h-3.5" />;
                        })()}
                        <span>{STAGES[currentStageIndex + 1]?.label}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 text-center"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 Clique em qualquer etapa para ver detalhes completos
          </p>
        </motion.div>
      </GlassCard>

      {/* Stage Details Modal */}
      <AnimatePresence>
        {selectedStage && (
          <StageDetails
            stage={selectedStage}
            stageData={timeline?.stages?.[selectedStage.id]}
            onClose={() => setSelectedStage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default VehicleTimeline;
