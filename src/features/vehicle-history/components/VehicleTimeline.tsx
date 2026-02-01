/**
 * TORQ Vehicle History - Timeline Component
 * Componente de timeline do histórico do veículo
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogIn,
  LogOut,
  Wrench,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  CheckCircle2,
  Scan,
  AlertOctagon,
  ShieldCheck,
  Bell,
  ClipboardCheck,
  Gauge,
  UserCheck,
  StickyNote,
  Camera,
  Filter,
  ChevronDown,
  Calendar,
  Search,
} from 'lucide-react';
import type { VehicleHistoryRecord, VehicleEventType, VehicleTimelineFilter } from '../types';
import { EVENT_TYPE_LABELS, EVENT_TYPE_COLORS } from '../types';

interface VehicleTimelineProps {
  records: VehicleHistoryRecord[];
  onFilter?: (filter: VehicleTimelineFilter) => void;
  onRecordClick?: (record: VehicleHistoryRecord) => void;
}

// Mapeamento de ícones
const EVENT_ICONS: Record<VehicleEventType, React.ComponentType<{ className?: string }>> = {
  checkin: LogIn,
  checkout: LogOut,
  maintenance: Wrench,
  budget: FileText,
  budget_approved: CheckCircle,
  budget_rejected: XCircle,
  damage_detected: AlertTriangle,
  damage_repaired: CheckCircle2,
  obd_scan: Scan,
  dtc_detected: AlertOctagon,
  dtc_cleared: ShieldCheck,
  recall: Bell,
  inspection: ClipboardCheck,
  mileage_update: Gauge,
  owner_change: UserCheck,
  note: StickyNote,
  photo: Camera,
  document: FileText,
};

export function VehicleTimeline({
  records,
  onFilter,
  onRecordClick,
}: VehicleTimelineProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<VehicleEventType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleTypeToggle = (type: VehicleEventType) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    setSelectedTypes(newTypes);
    onFilter?.({ eventTypes: newTypes.length > 0 ? newTypes : undefined });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onFilter?.({ searchQuery: query || undefined });
  };

  // Agrupar por data
  const groupedRecords = records.reduce((groups, record) => {
    const date = formatDate(record.eventDate);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {} as Record<string, VehicleHistoryRecord[]>);

  return (
    <div className="space-y-4">
      {/* Barra de filtros */}
      <div className="flex items-center gap-3">
        {/* Busca */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar no histórico..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Botão de filtros */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-colors ${
            showFilters || selectedTypes.length > 0
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400'
              : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filtros
          {selectedTypes.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-blue-500 text-white text-xs">
              {selectedTypes.length}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Painel de filtros */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700">
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                Tipos de evento:
              </p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(EVENT_TYPE_LABELS) as VehicleEventType[]).map(type => {
                  const isSelected = selectedTypes.includes(type);
                  const colors = EVENT_TYPE_COLORS[type];
                  
                  return (
                    <button
                      key={type}
                      onClick={() => handleTypeToggle(type)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? `${colors.bg} ${colors.text}`
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {EVENT_TYPE_LABELS[type]}
                    </button>

                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline */}
      <div className="space-y-6">
        {Object.entries(groupedRecords).map(([date, dayRecords]) => (
          <div key={date}>
            {/* Data */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <Calendar className="w-4 h-4 text-neutral-500" />
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {date}
                </span>
              </div>
              <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
            </div>

            {/* Eventos do dia */}
            <div className="space-y-3 ml-4">
              {dayRecords.map((record, index) => (
                <TimelineItem
                  key={record.id}
                  record={record}
                  isLast={index === dayRecords.length - 1}
                  onClick={() => onRecordClick?.(record)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sem registros */}
      {records.length === 0 && (
        <div className="p-8 text-center">
          <Calendar className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-500 dark:text-neutral-400">
            Nenhum registro encontrado
          </p>
        </div>
      )}
    </div>

}

// Item da timeline
function TimelineItem({
  record,
  isLast,
  onClick,
}: {
  record: VehicleHistoryRecord;
  isLast: boolean;
  onClick?: () => void;
}) {
  const colors = EVENT_TYPE_COLORS[record.eventType];
  const Icon = EVENT_ICONS[record.eventType] || FileText;

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative flex gap-4"
    >
      {/* Linha vertical */}
      {!isLast && (
        <div className="absolute left-5 top-10 bottom-0 w-px bg-neutral-200 dark:bg-neutral-700" />
      )}

      {/* Ícone */}
      <div className={`relative z-10 w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${colors.icon}`} />
      </div>

      {/* Conteúdo */}
      <div
        className={`flex-1 p-4 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 ${
          onClick ? 'cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors' : ''
        }`}
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-1">
          <div>
            <span className={`text-xs font-medium ${colors.text}`}>
              {EVENT_TYPE_LABELS[record.eventType]}
            </span>
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
              {record.title}
            </h4>
          </div>
          <span className="text-xs text-neutral-500">
            {formatTime(record.eventDate)}
          </span>
        </div>

        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {record.description}
        </p>

        {/* Quilometragem */}
        {record.mileage && (
          <div className="mt-2 flex items-center gap-1 text-xs text-neutral-500">
            <Gauge className="w-3 h-3" />
            {record.mileage.toLocaleString()} km
          </div>
        )}

        {/* Anexos */}
        {record.attachments && record.attachments.length > 0 && (
          <div className="mt-2 flex items-center gap-2">
            {record.attachments.slice(0, 3).map(attachment => (
              <div
                key={attachment.id}
                className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-700 overflow-hidden"
              >
                {attachment.type === 'image' && (
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
            {record.attachments.length > 3 && (
              <span className="text-xs text-neutral-500">
                +{record.attachments.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default VehicleTimeline;
