import React from 'react';
import { Database, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

const DataQualityIndicator = ({ quality, warnings = [], onValidate }) => {
  const getQualityConfig = (quality) => {
    switch (quality) {
      case 'high':
        return {
          label: 'Alta Qualidade',
          icon: CheckCircle,
          color: 'text-green-600 dark:text-green-400',
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
          description: 'Dados completos e confiáveis'
        };
      case 'medium':
        return {
          label: 'Qualidade Média',
          icon: AlertTriangle,
          color: 'text-yellow-600 dark:text-yellow-400',
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
          description: 'Alguns dados podem estar incompletos'
        };
      case 'low':
        return {
          label: 'Qualidade Baixa',
          icon: XCircle,
          color: 'text-orange-600 dark:text-orange-400',
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          border: 'border-orange-200 dark:border-orange-800',
          badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
          description: 'Dados incompletos ou desatualizados'
        };
      case 'none':
        return {
          label: 'Sem Dados',
          icon: XCircle,
          color: 'text-red-600 dark:text-red-400',
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
          description: 'Dados insuficientes para análise'
        };
      default:
        return {
          label: 'Desconhecido',
          icon: Info,
          color: 'text-gray-600 dark:text-gray-400',
          bg: 'bg-gray-50 dark:bg-gray-700',
          border: 'border-gray-200 dark:border-gray-600',
          badge: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
          description: 'Qualidade não avaliada'
        };
    }
  };

  const config = getQualityConfig(quality);
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-xl border ${config.bg} ${config.border}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg bg-white/50 dark:bg-gray-800/50`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold ${config.color}`}>
                {config.label}
              </h3>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.badge}`}>
                {quality === 'high' ? '✓' : quality === 'medium' ? '!' : '✗'}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {config.description}
            </p>
            
            {warnings.length > 0 && (
              <div className="space-y-1 mt-3">
                {warnings.map((warning, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {warning}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {onValidate && (
          <button
            onClick={onValidate}
            className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
          >
            Validar Agora
          </button>
        )}
      </div>
    </div>
  );
};

export default DataQualityIndicator;
