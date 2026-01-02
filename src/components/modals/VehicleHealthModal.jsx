/**
 * TORQ Vehicle Health Modal
 * Modal completo para monitoramento de saúde do veículo
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
  Pulse: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Alert: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Wrench: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  Refresh: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  Loader: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  ),
};

// Vehicle systems data
const SYSTEMS = [
  { id: 'engine', name: 'Motor', icon: '⚙️' },
  { id: 'transmission', name: 'Transmissão', icon: '🔧' },
  { id: 'brakes', name: 'Freios', icon: '🛑' },
  { id: 'suspension', name: 'Suspensão', icon: '🔩' },
  { id: 'electrical', name: 'Elétrica', icon: '⚡' },
  { id: 'cooling', name: 'Arrefecimento', icon: '❄️' },
  { id: 'fuel', name: 'Combustível', icon: '⛽' },
  { id: 'tires', name: 'Pneus', icon: '🛞' },
];

// Maintenance items
const MAINTENANCE_ITEMS = [
  { id: 'oil', name: 'Troca de Óleo', interval: 10000, unit: 'km' },
  { id: 'filter_air', name: 'Filtro de Ar', interval: 15000, unit: 'km' },
  { id: 'filter_oil', name: 'Filtro de Óleo', interval: 10000, unit: 'km' },
  { id: 'brake_pads', name: 'Pastilhas de Freio', interval: 40000, unit: 'km' },
  { id: 'coolant', name: 'Fluido de Arrefecimento', interval: 50000, unit: 'km' },
  { id: 'spark_plugs', name: 'Velas de Ignição', interval: 30000, unit: 'km' },
  { id: 'timing_belt', name: 'Correia Dentada', interval: 60000, unit: 'km' },
  { id: 'tires', name: 'Rodízio de Pneus', interval: 10000, unit: 'km' },
];

const VehicleHealthModal = ({ isOpen, onClose, vehicleInfo, checkinId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [healthData, setHealthData] = useState(null);

  // Generate health data on open
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Simulate loading
      setTimeout(() => {
        generateHealthData();
        setIsLoading(false);
      }, 800);
    }
  }, [isOpen]);

  const generateHealthData = () => {
    // Generate random system scores
    const systems = SYSTEMS.map(sys => ({
      ...sys,
      score: 60 + Math.floor(Math.random() * 40),
      status: Math.random() > 0.8 ? 'warning' : Math.random() > 0.95 ? 'critical' : 'good',
      issues: Math.random() > 0.7 ? [{ desc: 'Verificar na próxima revisão', severity: 'info' }] : [],
    }));

    // Calculate overall score
    const overallScore = Math.round(systems.reduce((acc, s) => acc + s.score, 0) / systems.length);

    // Generate maintenance schedule
    const currentMileage = vehicleInfo?.mileage || 45000;
    const maintenance = MAINTENANCE_ITEMS.map(item => {
      const lastDone = currentMileage - Math.floor(Math.random() * item.interval);
      const nextDue = lastDone + item.interval;
      const remaining = nextDue - currentMileage;
      const status = remaining < 0 ? 'overdue' : remaining < 1000 ? 'due' : 'upcoming';
      return { ...item, lastDone, nextDue, remaining, status };
    });

    // Generate alerts
    const alerts = [];
    systems.filter(s => s.status !== 'good').forEach(s => {
      alerts.push({
        id: s.id,
        title: `${s.name} precisa de atenção`,
        severity: s.status,
        system: s.name,
      });
    });
    maintenance.filter(m => m.status === 'overdue').forEach(m => {
      alerts.push({
        id: m.id,
        title: `${m.name} vencida`,
        severity: 'warning',
        system: 'Manutenção',
      });
    });

    setHealthData({
      overallScore,
      overallStatus: overallScore >= 80 ? 'Excelente' : overallScore >= 60 ? 'Bom' : overallScore >= 40 ? 'Regular' : 'Crítico',
      systems,
      maintenance: maintenance.sort((a, b) => a.remaining - b.remaining),
      alerts,
      currentMileage,
      lastUpdated: new Date(),
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'overdue': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'due': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
  };

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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                <span className="w-5 h-5"><Icons.Pulse /></span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Saúde do Veículo</h3>
                <p className="text-sm text-neutral-500">
                  {vehicleInfo ? `${vehicleInfo.make || ''} ${vehicleInfo.model || ''} • ${vehicleInfo.plate || ''}` : 'Análise completa'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={generateHealthData} 
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500"
                title="Atualizar"
              >
                <span className="w-4 h-4 block"><Icons.Refresh /></span>
              </button>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500">
                <span className="w-5 h-5 block"><Icons.Close /></span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
            {isLoading ? (
              <div className="py-12 text-center">
                <span className="w-8 h-8 mx-auto text-blue-500 block mb-3"><Icons.Loader /></span>
                <p className="text-neutral-500">Analisando saúde do veículo...</p>
              </div>
            ) : healthData && (
              <div className="space-y-4">
                {/* Overall Score */}
                <div className={`p-4 rounded-xl ${getScoreBg(healthData.overallScore)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Pontuação Geral</p>
                      <p className={`text-3xl font-bold ${getScoreColor(healthData.overallScore)}`}>
                        {healthData.overallScore}%
                      </p>
                      <p className="text-sm text-neutral-500">{healthData.currentMileage.toLocaleString()} km</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl font-semibold ${getScoreBg(healthData.overallScore)} ${getScoreColor(healthData.overallScore)}`}>
                      {healthData.overallStatus}
                    </div>
                  </div>
                </div>

                {/* Alerts */}
                {healthData.alerts.length > 0 && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-4 h-4 text-red-500"><Icons.Alert /></span>
                      <span className="text-sm font-medium text-red-700 dark:text-red-400">
                        {healthData.alerts.length} alerta{healthData.alerts.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {healthData.alerts.slice(0, 3).map((alert, i) => (
                        <p key={i} className="text-sm text-red-600 dark:text-red-300">• {alert.title}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Systems Grid */}
                <div>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Sistemas do Veículo</p>
                  <div className="grid grid-cols-4 gap-2">
                    {healthData.systems.map(sys => (
                      <div 
                        key={sys.id} 
                        className={`p-3 rounded-xl text-center ${getScoreBg(sys.score)} transition-all hover:scale-105`}
                      >
                        <span className="text-xl mb-1 block">{sys.icon}</span>
                        <p className={`text-lg font-bold ${getScoreColor(sys.score)}`}>{sys.score}%</p>
                        <p className="text-xs text-neutral-500 truncate">{sys.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Maintenance Schedule */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                      <span className="w-4 h-4"><Icons.Wrench /></span>
                      Próximas Manutenções
                    </p>
                    {healthData.maintenance.filter(m => m.status === 'overdue').length > 0 && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                        {healthData.maintenance.filter(m => m.status === 'overdue').length} vencida(s)
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {healthData.maintenance.slice(0, 5).map(item => (
                      <div 
                        key={item.id} 
                        className={`p-3 rounded-xl flex items-center justify-between ${
                          item.status === 'overdue' ? 'bg-red-50 dark:bg-red-900/20' : 
                          item.status === 'due' ? 'bg-yellow-50 dark:bg-yellow-900/20' : 
                          'bg-neutral-50 dark:bg-neutral-900/50'
                        }`}
                      >
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white text-sm">{item.name}</p>
                          <p className="text-xs text-neutral-500">
                            {item.status === 'overdue' 
                              ? `Vencida há ${Math.abs(item.remaining).toLocaleString()} km`
                              : `Em ${item.remaining.toLocaleString()} km`
                            }
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusBadge(item.status)}`}>
                          {item.status === 'overdue' ? 'Vencida' : item.status === 'due' ? 'Próxima' : 'OK'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Last Updated */}
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 text-center">
                  <p className="text-xs text-neutral-500">
                    Última atualização: {healthData.lastUpdated.toLocaleString('pt-BR')}
                  </p>
                </div>
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

export default VehicleHealthModal;
