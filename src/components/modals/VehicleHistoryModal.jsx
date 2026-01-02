/**
 * TORQ Vehicle History Modal
 * Modal completo para histórico do veículo
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
const Icons = {
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Filter: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  Loader: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  ),
  ArrowIn: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  ),
  ArrowOut: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Wrench: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  File: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  Scan: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    </svg>
  ),
  Alert: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

// Event types configuration
const EVENT_TYPES = {
  checkin: { label: 'Check-in', icon: Icons.ArrowIn, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  checkout: { label: 'Check-out', icon: Icons.ArrowOut, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  maintenance: { label: 'Manutenção', icon: Icons.Wrench, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  budget: { label: 'Orçamento', icon: Icons.File, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  obd_scan: { label: 'Diagnóstico OBD', icon: Icons.Scan, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
  damage: { label: 'Dano Detectado', icon: Icons.Alert, color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
  repair: { label: 'Reparo', icon: Icons.Check, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
};

// Sample history data generator
const generateSampleHistory = (vehicleInfo) => {
  const events = [];
  const now = new Date();
  
  // Generate random events over the past year
  const eventTypes = Object.keys(EVENT_TYPES);
  const descriptions = {
    checkin: ['Veículo recebido para revisão', 'Entrada para manutenção preventiva', 'Check-in para diagnóstico', 'Veículo recebido - cliente relatou barulho'],
    checkout: ['Veículo entregue ao cliente', 'Serviço concluído - veículo liberado', 'Entrega após revisão completa'],
    maintenance: ['Troca de óleo e filtros', 'Substituição de pastilhas de freio', 'Alinhamento e balanceamento', 'Revisão dos 50.000 km', 'Troca de correia dentada'],
    budget: ['Orçamento para revisão geral', 'Orçamento de freios aprovado', 'Orçamento de suspensão pendente'],
    obd_scan: ['Diagnóstico completo - 0 códigos', 'Scan OBD - 2 códigos encontrados', 'Verificação de sistemas eletrônicos'],
    damage: ['Arranhão na porta dianteira', 'Amassado no para-choque', 'Desgaste irregular nos pneus'],
    repair: ['Reparo de pintura concluído', 'Substituição de peça danificada', 'Correção de vazamento'],
  };

  // Generate 8-15 events
  const numEvents = 8 + Math.floor(Math.random() * 8);
  
  for (let i = 0; i < numEvents; i++) {
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const daysAgo = Math.floor(Math.random() * 365);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
    const descList = descriptions[type];
    const description = descList[Math.floor(Math.random() * descList.length)];
    
    events.push({
      id: `event-${i}`,
      type,
      date,
      title: EVENT_TYPES[type].label,
      description,
      mileage: vehicleInfo?.mileage ? vehicleInfo.mileage - (daysAgo * 30) : 45000 - (daysAgo * 30),
      cost: type === 'maintenance' || type === 'repair' ? Math.floor(Math.random() * 800) + 100 : null,
    });
  }

  // Sort by date descending
  return events.sort((a, b) => b.date - a.date);
};

const VehicleHistoryModal = ({ isOpen, onClose, vehicleInfo, checkinId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [stats, setStats] = useState(null);

  // Load history on open
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setTimeout(() => {
        const data = generateSampleHistory(vehicleInfo);
        setHistory(data);
        setFilteredHistory(data);
        calculateStats(data);
        setIsLoading(false);
      }, 600);
    }
  }, [isOpen, vehicleInfo]);

  // Filter history
  useEffect(() => {
    let filtered = [...history];
    
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(e => e.type === selectedFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(term) || 
        e.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredHistory(filtered);
  }, [history, selectedFilter, searchTerm]);

  const calculateStats = (data) => {
    const totalCheckins = data.filter(e => e.type === 'checkin').length;
    const totalMaintenance = data.filter(e => e.type === 'maintenance').length;
    const totalSpent = data.reduce((acc, e) => acc + (e.cost || 0), 0);
    const lastService = data.find(e => e.type === 'maintenance' || e.type === 'repair');
    
    setStats({
      totalCheckins,
      totalMaintenance,
      totalSpent,
      lastServiceDate: lastService?.date,
      totalEvents: data.length,
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Group events by date
  const groupedHistory = filteredHistory.reduce((groups, event) => {
    const dateKey = formatDate(event.date);
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(event);
    return groups;
  }, {});

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
                <span className="w-5 h-5"><Icons.Clock /></span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Histórico do Veículo</h3>
                <p className="text-sm text-neutral-500">
                  {vehicleInfo ? `${vehicleInfo.plate || ''} • ${vehicleInfo.make || ''} ${vehicleInfo.model || ''}` : 'Timeline completa'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500">
              <span className="w-5 h-5 block"><Icons.Close /></span>
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
            {isLoading ? (
              <div className="py-12 text-center">
                <span className="w-8 h-8 mx-auto text-amber-500 block mb-3"><Icons.Loader /></span>
                <p className="text-neutral-500">Carregando histórico...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Stats */}
                {stats && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center">
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.totalCheckins}</p>
                      <p className="text-xs text-neutral-500">Check-ins</p>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-center">
                      <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{stats.totalMaintenance}</p>
                      <p className="text-xs text-neutral-500">Manutenções</p>
                    </div>
                    <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-center">
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">R$ {stats.totalSpent.toLocaleString()}</p>
                      <p className="text-xs text-neutral-500">Total gasto</p>
                    </div>
                  </div>
                )}

                {/* Search & Filter */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"><Icons.Search /></span>
                    <input
                      type="text"
                      placeholder="Buscar no histórico..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <select
                    value={selectedFilter}
                    onChange={e => setSelectedFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="all">Todos</option>
                    {Object.entries(EVENT_TYPES).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  {Object.entries(groupedHistory).map(([date, events]) => (
                    <div key={date}>
                      {/* Date Header */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-700 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                          {date}
                        </span>
                        <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
                      </div>

                      {/* Events */}
                      <div className="space-y-2 ml-2">
                        {events.map((event, idx) => {
                          const config = EVENT_TYPES[event.type];
                          const IconComponent = config.icon;
                          
                          return (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="relative flex gap-3"
                            >
                              {/* Line */}
                              {idx < events.length - 1 && (
                                <div className="absolute left-4 top-10 bottom-0 w-px bg-neutral-200 dark:bg-neutral-700" />
                              )}
                              
                              {/* Icon */}
                              <div className={`relative z-10 w-8 h-8 rounded-lg ${config.color} flex items-center justify-center flex-shrink-0`}>
                                <span className="w-4 h-4"><IconComponent /></span>
                              </div>

                              {/* Content */}
                              <div className="flex-1 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700">
                                <div className="flex items-start justify-between mb-1">
                                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${config.color}`}>
                                    {config.label}
                                  </span>
                                  <span className="text-xs text-neutral-400">{formatTime(event.date)}</span>
                                </div>
                                <p className="text-sm text-neutral-900 dark:text-white">{event.description}</p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                                  {event.mileage && <span>{event.mileage.toLocaleString()} km</span>}
                                  {event.cost && <span className="text-green-600 dark:text-green-400">R$ {event.cost}</span>}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {filteredHistory.length === 0 && (
                  <div className="py-8 text-center">
                    <span className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 block mb-3"><Icons.Clock /></span>
                    <p className="text-neutral-500">Nenhum registro encontrado</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Fechar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VehicleHistoryModal;
