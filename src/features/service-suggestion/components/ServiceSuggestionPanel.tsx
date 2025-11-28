/**
 * TORQ Service Suggestion - Panel Component
 * Painel de sugestões de serviços
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  AlertTriangle,
  Clock,
  DollarSign,
  ChevronRight,
  ChevronDown,
  Plus,
  Check,
  Wrench,
  Lightbulb,
  Filter,
} from 'lucide-react';
import type { SuggestionResult, ServiceSuggestion, SuggestionPriority, ServiceCategory } from '../types';
import {
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  SERVICE_CATEGORY_LABELS,
  CATEGORY_COLORS,
  SOURCE_LABELS,
} from '../types';

interface ServiceSuggestionPanelProps {
  result: SuggestionResult;
  onAddService?: (suggestion: ServiceSuggestion) => void;
  onAddAllServices?: (suggestions: ServiceSuggestion[]) => void;
  selectedServices?: string[];
}

export function ServiceSuggestionPanel({
  result,
  onAddService,
  onAddAllServices,
  selectedServices = [],
}: ServiceSuggestionPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<SuggestionPriority | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<ServiceCategory | 'all'>('all');

  const { suggestions, summary, aiInsights } = result;

  // Filtrar sugestões
  const filteredSuggestions = suggestions.filter(s => {
    if (filterPriority !== 'all' && s.priority !== filterPriority) return false;
    if (filterCategory !== 'all' && s.category !== filterCategory) return false;
    return true;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Header com resumo */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-white/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Sugestões Inteligentes</h3>
            <p className="text-sm text-white/80">
              {summary.totalSuggestions} serviço(s) recomendado(s)
            </p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-white/10">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-300" />
              <span className="text-xs text-white/70">Urgentes</span>
            </div>
            <span className="text-xl font-bold">{summary.byPriority.urgent}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-300" />
              <span className="text-xs text-white/70">Total</span>
            </div>
            <span className="text-lg font-bold">{formatCurrency(summary.totalEstimatedCost)}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-300" />
              <span className="text-xs text-white/70">Tempo</span>
            </div>
            <span className="text-lg font-bold">{formatTime(summary.totalEstimatedTime)}</span>
          </div>
        </div>
      </div>

      {/* Insights de IA */}
      {aiInsights && aiInsights.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Insights da IA
            </span>
          </div>
          <ul className="space-y-2">
            {aiInsights.map((insight, index) => (
              <li key={index} className="text-sm text-amber-700 dark:text-amber-300">
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-500" />
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Filtrar:</span>
        </div>
        
        {/* Filtro de prioridade */}
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as SuggestionPriority | 'all')}
          className="px-3 py-1.5 rounded-lg text-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
        >
          <option value="all">Todas prioridades</option>
          <option value="urgent">Urgente</option>
          <option value="high">Alta</option>
          <option value="medium">Média</option>
          <option value="low">Baixa</option>
        </select>

        {/* Filtro de categoria */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as ServiceCategory | 'all')}
          className="px-3 py-1.5 rounded-lg text-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
        >
          <option value="all">Todas categorias</option>
          {Object.entries(SERVICE_CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Botão adicionar todos */}
      {onAddAllServices && filteredSuggestions.length > 0 && (
        <motion.button
          onClick={() => onAddAllServices(filteredSuggestions)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar Todos ao Orçamento ({filteredSuggestions.length})
        </motion.button>
      )}

      {/* Lista de sugestões */}
      <div className="space-y-3">
        {filteredSuggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            isExpanded={expandedId === suggestion.id}
            isSelected={selectedServices.includes(suggestion.id)}
            onToggle={() => setExpandedId(expandedId === suggestion.id ? null : suggestion.id)}
            onAdd={onAddService}
          />
        ))}
      </div>

      {/* Sem resultados */}
      {filteredSuggestions.length === 0 && (
        <div className="p-8 text-center">
          <Wrench className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-500 dark:text-neutral-400">
            Nenhuma sugestão encontrada com os filtros selecionados
          </p>
        </div>
      )}
    </div>
  );
}

// Card de sugestão individual
function SuggestionCard({
  suggestion,
  isExpanded,
  isSelected,
  onToggle,
  onAdd,
}: {
  suggestion: ServiceSuggestion;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onAdd?: (suggestion: ServiceSuggestion) => void;
}) {
  const priorityColors = PRIORITY_COLORS[suggestion.priority];
  const categoryColor = CATEGORY_COLORS[suggestion.category];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <motion.div
      layout
      className={`rounded-xl border overflow-hidden transition-all ${
        isSelected
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
          : `${priorityColors.border} bg-white dark:bg-neutral-800`
      }`}
    >
      {/* Header */}
      <div
        className="p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors.bg} ${priorityColors.text}`}>
                {PRIORITY_LABELS[suggestion.priority]}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryColor}`}>
                {SERVICE_CATEGORY_LABELS[suggestion.category]}
              </span>
            </div>
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
              {suggestion.name}
            </h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {suggestion.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                {formatCurrency(suggestion.estimatedCost.total)}
              </p>
              <p className="text-xs text-neutral-500">
                {suggestion.estimatedTime} min
              </p>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-neutral-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-neutral-400" />
            )}
          </div>
        </div>
      </div>

      {/* Detalhes expandidos */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-neutral-200 dark:border-neutral-700"
          >
            <div className="p-4 space-y-4">
              {/* Fonte da sugestão */}
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Sparkles className="w-4 h-4" />
                <span>Fonte: {SOURCE_LABELS[suggestion.source]}</span>
                <span className="text-neutral-400">•</span>
                <span>Confiança: {suggestion.confidence}%</span>
              </div>

              {/* Custos detalhados */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50">
                  <p className="text-xs text-neutral-500 mb-1">Mão de obra</p>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(suggestion.estimatedCost.labor)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50">
                  <p className="text-xs text-neutral-500 mb-1">Peças</p>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(suggestion.estimatedCost.parts)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50">
                  <p className="text-xs text-neutral-500 mb-1">Total</p>
                  <p className="font-bold text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(suggestion.estimatedCost.total)}
                  </p>
                </div>
              </div>

              {/* Peças relacionadas */}
              {suggestion.relatedParts.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Peças necessárias:
                  </p>
                  <div className="space-y-1">
                    {suggestion.relatedParts.map((part) => (
                      <div
                        key={part.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {part.quantity}x {part.name}
                        </span>
                        <span className="text-neutral-900 dark:text-neutral-100">
                          {formatCurrency(part.totalPrice)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Códigos DTC relacionados */}
              {suggestion.relatedDTCs && suggestion.relatedDTCs.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Códigos:
                  </span>
                  {suggestion.relatedDTCs.map((code) => (
                    <span
                      key={code}
                      className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-mono"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              )}

              {/* Botão adicionar */}
              {onAdd && (
                <motion.button
                  onClick={() => onAdd(suggestion)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSelected}
                  className={`w-full px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4" />
                      Adicionado
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Adicionar ao Orçamento
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ServiceSuggestionPanel;
