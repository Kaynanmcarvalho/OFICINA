/**
 * TORQ OBD Scanner - Results Panel Component
 * Painel de resultados do scan OBD-II
 */

import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Activity,
  Gauge,
  Thermometer,
  Zap,
  Clock,
  ChevronRight,
  ArrowLeft,
  Download,
  Share2,
} from 'lucide-react';
import type { OBDScanResult, DiagnosticTroubleCode, LiveDataReading } from '../types';
import {
  SEVERITY_COLORS,
  HEALTH_COLORS,
  HEALTH_LABELS,
  DTC_SEVERITY_LABELS,
  VEHICLE_SYSTEM_LABELS,
} from '../types';

interface OBDResultsPanelProps {
  result: OBDScanResult;
  onClose?: () => void;
}

export function OBDResultsPanel({ result, onClose }: OBDResultsPanelProps) {
  const { summary, diagnosticCodes, liveData, vehicleInfo, scanDuration } = result;

  const healthColors = HEALTH_COLORS[summary.overallHealth];

  return (
    <div className="space-y-6">
      {/* Header com botão voltar */}
      {onClose && (
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      )}

      {/* Resumo de Saúde */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-5 rounded-2xl ${healthColors.bg} border ${healthColors.border}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className={`text-lg font-semibold ${healthColors.text}`}>
              Saúde do Veículo
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Baseado em {summary.totalCodes} código(s) encontrado(s)
            </p>
          </div>
          <div className={`px-4 py-2 rounded-xl ${healthColors.bg} ${healthColors.text} font-bold text-lg`}>
            {HEALTH_LABELS[summary.overallHealth]}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-white/50 dark:bg-black/20">
            <div className="flex items-center gap-2 mb-1">
              <Info className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-neutral-600 dark:text-neutral-400">Info</span>
            </div>
            <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              {summary.bySeverity.info}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/50 dark:bg-black/20">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-neutral-600 dark:text-neutral-400">Atenção</span>
            </div>
            <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              {summary.bySeverity.warning}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/50 dark:bg-black/20">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-xs text-neutral-600 dark:text-neutral-400">Crítico</span>
            </div>
            <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              {summary.bySeverity.critical}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Códigos de Diagnóstico */}
      {diagnosticCodes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Códigos de Diagnóstico ({diagnosticCodes.length})
          </h4>
          <div className="space-y-3">
            {diagnosticCodes.map((code, index) => (
              <DTCCard key={code.code + index} code={code} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Sem códigos */}
      {diagnosticCodes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-center"
        >
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-1">
            Nenhum Código de Falha
          </h4>
          <p className="text-sm text-green-600 dark:text-green-400">
            O veículo não apresenta códigos de diagnóstico ativos
          </p>
        </motion.div>
      )}

      {/* Dados ao Vivo */}
      {liveData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Dados ao Vivo
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {liveData.map((data, index) => (
              <LiveDataCard key={data.parameter + index} data={data} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Informações do Scan */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50"
      >
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <Clock className="w-4 h-4" />
            <span>Duração do scan: {(scanDuration / 1000).toFixed(1)}s</span>
          </div>
          {vehicleInfo.vin && (
            <span className="text-xs font-mono text-neutral-500">
              VIN: {vehicleInfo.vin.slice(0, 11)}...
            </span>
          )}
        </div>
      </motion.div>

      {/* Ações */}
      <div className="flex gap-3">
        <button className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Exportar PDF
        </button>
        <button className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
          <Share2 className="w-4 h-4" />
          Compartilhar
        </button>
      </div>
    </div>

}

// Card de código de diagnóstico
function DTCCard({ code }: { code: DiagnosticTroubleCode }) {
  const colors = SEVERITY_COLORS[code.severity];

  return (
    <div className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-lg bg-white/50 dark:bg-black/20 font-mono font-bold text-sm ${colors.text}`}>
            {code.code}
          </span>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.text}`}>
            {DTC_SEVERITY_LABELS[code.severity]}
          </span>
        </div>
        <ChevronRight className={`w-4 h-4 ${colors.icon}`} />
      </div>
      
      <p className={`text-sm font-medium ${colors.text} mb-2`}>
        {code.description}
      </p>
      
      <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
        <span className="px-2 py-0.5 rounded bg-white/50 dark:bg-black/20">
          {VEHICLE_SYSTEM_LABELS[code.system]}
        </span>
        {code.estimatedRepairCost && (
          <span>
            R$ {code.estimatedRepairCost.min} - {code.estimatedRepairCost.max}
          </span>
        )}
      </div>

      {/* Causas possíveis */}
      {code.possibleCauses.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/20 dark:border-black/20">
          <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Possíveis causas:
          </p>
          <ul className="text-xs text-neutral-500 dark:text-neutral-500 space-y-0.5">
            {code.possibleCauses.slice(0, 2).map((cause, i) => (
              <li key={i}>• {cause}</li>
            ))}
          </ul>
        </div>
      )}
    </div>

}

// Card de dados ao vivo
function LiveDataCard({ data }: { data: LiveDataReading }) {
  const getIcon = () => {
    switch (data.parameter) {
      case 'RPM': return <Gauge className="w-4 h-4" />;
      case 'Temperatura do Motor': return <Thermometer className="w-4 h-4" />;
      case 'Velocidade': return <Zap className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (data.status) {
      case 'warning': return 'text-orange-600 dark:text-orange-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      default: return 'text-green-600 dark:text-green-400';
    }
  };

  return (
    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-neutral-500 dark:text-neutral-400">{getIcon()}</span>
        <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
          {data.parameter}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-lg font-bold ${getStatusColor()}`}>
          {typeof data.value === 'number' ? data.value.toFixed(1) : data.value}
        </span>
        <span className="text-xs text-neutral-500">{data.unit}</span>
      </div>
      {data.normalRange && (
        <div className="mt-1 text-xs text-neutral-400">
          Normal: {data.normalRange.min} - {data.normalRange.max}
        </div>
      )}
    </div>
  );
}

export default OBDResultsPanel;
