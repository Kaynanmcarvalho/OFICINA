import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * RecurrenceAnalyzer Component
 * 
 * Analisa histórico para identificar problemas recorrentes
 * Sugere manutenção preventiva baseada em padrões
 * 
 * @param {Array} history - Histórico de serviços
 * @param {Number} monthsToAnalyze - Período de análise (padrão: 6 meses)
 */
const RecurrenceAnalyzer = ({ history = [], monthsToAnalyze = 6 }) => {
  /**
   * Analisa recorrências no histórico
   */
  const analysis = useMemo(() => {
    if (!history || history.length === 0) return { recurrences: [], suggestions: [] };

    // Filtrar últimos X meses
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - monthsToAnalyze);
    
    const recentHistory = history.filter(item => {
      const itemDate = new Date(item.createdAt || item.date);
      return itemDate >= cutoffDate;
    });

    // Contar ocorrências de serviços
    const serviceCounts = {};
    const serviceDates = {};

    recentHistory.forEach(item => {
      const services = item.services?.split(',').map(s => s.trim()) || [item.services];
      
      services.forEach(service => {
        if (service) {
          serviceCounts[service] = (serviceCounts[service] || 0) + 1;
          if (!serviceDates[service]) serviceDates[service] = [];
          serviceDates[service].push(new Date(item.createdAt || item.date));
        }
      });
    });

    // Identificar recorrências (2+ vezes)
    const recurrences = Object.entries(serviceCounts)
      .filter(([_, count]) => count >= 2)
      .map(([service, count]) => {
        const dates = serviceDates[service].sort((a, b) => a - b);
        const intervals = [];
        
        for (let i = 1; i < dates.length; i++) {
          const diffDays = Math.floor((dates[i] - dates[i-1]) / (1000 * 60 * 60 * 24));
          intervals.push(diffDays);
        }
        
        const avgInterval = intervals.length > 0 
          ? Math.floor(intervals.reduce((a, b) => a + b, 0) / intervals.length)
          : 0;

        return {
          service,
          count,
          severity: count >= 3 ? 'high' : 'medium',
          avgInterval,
          lastDate: dates[dates.length - 1],
          dates
        };
      })
      .sort((a, b) => b.count - a.count);

    // Gerar sugestões
    const suggestions = recurrences.map(rec => {
      const suggestions = {
        'Freios': 'Considere uma revisão completa do sistema de freios e substituição de componentes desgastados.',
        'Óleo': 'Verifique se está usando o óleo correto. Considere intervalos de troca menores.',
        'Suspensão': 'Avalie o estado completo da suspensão. Pode haver necessidade de substituição de amortecedores.',
        'Bateria': 'Teste o sistema elétrico completo. A bateria pode estar subdimensionada.',
        'Pneus': 'Verifique alinhamento e balanceamento. Considere rodízio regular de pneus.'
      };

      const matchedKey = Object.keys(suggestions).find(key => 
        rec.service.toLowerCase().includes(key.toLowerCase())
      );

      return {
        service: rec.service,
        suggestion: matchedKey ? suggestions[matchedKey] : 'Recomendamos uma inspeção preventiva detalhada.',
        preventiveCost: 'Economia estimada: 30-50% vs reparos emergenciais'
      };
    });

    return { recurrences, suggestions };
  }, [history, monthsToAnalyze]);

  if (analysis.recurrences.length === 0) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
        <svg className="w-12 h-12 mx-auto text-green-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-green-800 dark:text-green-200 font-medium">
          Nenhum problema recorrente identificado
        </p>
        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
          O veículo está com manutenção em dia nos últimos {monthsToAnalyze} meses
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Análise de Recorrência
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Problemas identificados nos últimos {monthsToAnalyze} meses
        </p>
      </div>

      {/* Recurrences List */}
      <div className="space-y-4">
        {analysis.recurrences.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border-2 ${
              rec.severity === 'high'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800'
                : 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-800'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className={`font-semibold ${
                  rec.severity === 'high'
                    ? 'text-red-800 dark:text-red-200'
                    : 'text-amber-800 dark:text-amber-200'
                }`}>
                  {rec.service}
                </h4>
                <p className={`text-sm mt-1 ${
                  rec.severity === 'high'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {rec.count} ocorrências em {monthsToAnalyze} meses
                </p>
              </div>
              
              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                rec.severity === 'high'
                  ? 'bg-red-500 text-white'
                  : 'bg-amber-500 text-white'
              }`}>
                {rec.severity === 'high' ? 'ALTA' : 'MÉDIA'}
              </span>
            </div>

            {rec.avgInterval > 0 && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Intervalo médio: ~{rec.avgInterval} dias
              </p>
            )}

            {/* Suggestion */}
            {analysis.suggestions[index] && (
              <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  💡 Recomendação:
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {analysis.suggestions[index].suggestion}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
                  {analysis.suggestions[index].preventiveCost}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Manutenção Preventiva Recomendada
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Agende uma revisão completa para evitar problemas futuros e economizar em reparos emergenciais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecurrenceAnalyzer;
