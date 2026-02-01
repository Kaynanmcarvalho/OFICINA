/**
 * TORQ Diagnostic History Modal - Premium Horizontal Design
 * Modal elegante para histórico de diagnósticos OBD-II
 * Mostra todos os scans: avulsos e vinculados a veículos
 * Design escuro e sóbrio, consistente com OBDScannerModal
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useEmpresa } from '../../contexts/EmpresaContext';

// ============ ICONS ============
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
  Scan: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <circle cx="12" cy="12" r="3" /><path d="M12 8v1" /><path d="M12 15v1" />
      <path d="M8 12h1" /><path d="M15 12h1" />
    </svg>
  ),
  Loader: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  Car: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" />
    </svg>
  ),
  Standalone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 9h6" /><path d="M9 13h6" /><path d="M9 17h4" />
    </svg>
  ),
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Alert: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><circle cx="12" cy="17" r="0.5" fill="currentColor" />
    </svg>
  ),
  Gauge: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 12l4-6" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Thermometer: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" /><circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  ),
  Battery: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="18" height="10" rx="2" /><path d="M22 11v2" /><path d="M6 11v2" /><path d="M10 11v2" /><path d="M14 11v2" />
    </svg>
  ),
  Zap: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Activity: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  Empty: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M12 8v4" /><path d="M12 16h.01" />
    </svg>
  ),
  Link: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
};

// ============ STYLES ============
const styles = {
  overlay: `fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md`,
  modal: `relative w-full max-w-4xl max-h-[85vh] bg-[#0d0d0d] rounded-2xl shadow-2xl border border-white/[0.06] overflow-hidden`,
  header: `relative px-6 py-4 bg-[#0d0d0d] border-b border-white/[0.06]`,
  content: `p-6 overflow-y-auto max-h-[calc(85vh-160px)] bg-[#111111]`,
  footer: `px-6 py-5 bg-[#0d0d0d] border-t border-white/[0.06]`,
  card: `p-4 rounded-xl bg-[#1a1a1a] border border-white/[0.06]`,
  btnSecondary: `px-5 py-2.5 rounded-xl font-medium bg-white/[0.06] text-white/80 border border-white/[0.08] hover:bg-white/[0.1] hover:text-white active:scale-[0.98] transition-all duration-200`,
  input: `w-full px-4 py-2.5 rounded-xl bg-white/[0.04] text-white border border-white/[0.08] placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all duration-200`,
};

// ============ MAIN COMPONENT ============
const VehicleHistoryModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [scans, setScans] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'vehicle' | 'standalone'
  
  const empresaContext = useEmpresa();
  const empresaId = empresaContext?.empresaId;

  // Load ALL scan history from Firebase
  useEffect(() => {
    if (isOpen) {
      loadScanHistory();
    }
  }, [isOpen, empresaId]);

  const loadScanHistory = async () => {
    setIsLoading(true);
    try {
      if (!empresaId) {
        setScans(generateDemoScans());
        return;
      }
      
      const scansRef = collection(db, `empresas/${empresaId}/obd_scans`);
      const q = query(scansRef, orderBy('timestamp', 'desc'), limit(100));
      const snapshot = await getDocs(q);
      const scanData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (scanData.length === 0) {
        setScans(generateDemoScans());
      } else {
        setScans(scanData);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      setScans(generateDemoScans());
    } finally {
      setIsLoading(false);
    }
  };

  const generateDemoScans = () => {
    const now = new Date();
    return [
      {
        id: 'demo-1',
        timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'quick',
        vehiclePlate: 'ABC-1234',
        vehicleMake: 'Volkswagen',
        vehicleModel: 'Gol',
        isStandalone: false,
        scanMode: 'vehicle',
        healthScore: 92,
        healthStatus: 'Excelente',
        dtcCount: 0,
        liveData: [
          { param: 'RPM', value: 820, unit: 'rpm', icon: 'Gauge' },
          { param: 'Temp. Motor', value: 85, unit: '°C', icon: 'Thermometer' },
          { param: 'Bateria', value: 13.8, unit: 'V', icon: 'Battery' },
        ],
      },
      {
        id: 'demo-2',
        timestamp: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'full',
        vehiclePlate: null,
        vehicleMake: null,
        vehicleModel: null,
        isStandalone: true,
        scanMode: 'standalone',
        healthScore: 78,
        healthStatus: 'Bom',
        dtcCount: 1,
        dtcCodes: [{ code: 'P0171', description: 'Sistema muito pobre (Banco 1)', severity: 'warning' }],
        liveData: [
          { param: 'RPM', value: 780, unit: 'rpm', icon: 'Gauge' },
          { param: 'Temp. Motor', value: 92, unit: '°C', icon: 'Thermometer' },
          { param: 'Bateria', value: 12.4, unit: 'V', icon: 'Battery' },
        ],
      },
      {
        id: 'demo-3',
        timestamp: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'quick',
        vehiclePlate: 'XYZ-9876',
        vehicleMake: 'Fiat',
        vehicleModel: 'Uno',
        isStandalone: false,
        scanMode: 'vehicle',
        healthScore: 85,
        healthStatus: 'Bom',
        dtcCount: 0,
        liveData: [
          { param: 'RPM', value: 800, unit: 'rpm', icon: 'Gauge' },
          { param: 'Temp. Motor', value: 88, unit: '°C', icon: 'Thermometer' },
          { param: 'Bateria', value: 13.2, unit: 'V', icon: 'Battery' },
        ],
      },
      {
        id: 'demo-4',
        timestamp: new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'full',
        vehiclePlate: null,
        vehicleMake: null,
        vehicleModel: null,
        isStandalone: true,
        scanMode: 'standalone',
        healthScore: 65,
        healthStatus: 'Regular',
        dtcCount: 2,
        dtcCodes: [
          { code: 'P0300', description: 'Falha de ignição aleatória detectada', severity: 'warning' },
          { code: 'P0420', description: 'Eficiência do catalisador abaixo do limite', severity: 'warning' }
        ],
        liveData: [
          { param: 'RPM', value: 750, unit: 'rpm', icon: 'Gauge' },
          { param: 'Temp. Motor', value: 95, unit: '°C', icon: 'Thermometer' },
          { param: 'Bateria', value: 12.1, unit: 'V', icon: 'Battery' },
        ],
      },
    ];
  };

  // Filter scans
  const filteredScans = scans.filter(scan => {
    // Filter by mode
    if (filterMode === 'vehicle' && scan.isStandalone) return false;
    if (filterMode === 'standalone' && !scan.isStandalone) return false;
    
    // Filter by search term
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      scan.vehiclePlate?.toLowerCase().includes(term) ||
      scan.vehicleMake?.toLowerCase().includes(term) ||
      scan.vehicleModel?.toLowerCase().includes(term) ||
      scan.healthStatus?.toLowerCase().includes(term)
    );
  });

  // Stats
  const stats = {
    total: scans.length,
    vehicle: scans.filter(s => !s.isStandalone).length,
    standalone: scans.filter(s => s.isStandalone).length,
    withErrors: scans.filter(s => s.dtcCount > 0).length,
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getHealthColor = (score) => {
    if (score >= 85) return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', ring: 'stroke-emerald-500' };
    if (score >= 70) return { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', ring: 'stroke-blue-500' };
    if (score >= 50) return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', ring: 'stroke-amber-500' };
    return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', ring: 'stroke-red-500' };
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.overlay}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={styles.modal}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className={styles.header}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60">
                  <span className="w-5 h-5"><Icons.Clock /></span>
                </div>
                <div>
                  <h2 className="text-base font-medium text-white">Histórico de Diagnósticos</h2>
                  <p className="text-xs text-white/40">
                    Todos os scans OBD-II realizados
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                  <span className="w-3 h-3 text-white/40"><Icons.Scan /></span>
                  <span className="text-xs font-medium text-white/50">{stats.total} scans</span>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white/60 transition-all"
                >
                  <span className="w-4 h-4"><Icons.Close /></span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={styles.content}>
            {selectedScan ? (
              <ScanDetailView scan={selectedScan} onBack={() => setSelectedScan(null)} getHealthColor={getHealthColor} />
            ) : (
              <div className="space-y-5">
                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"><Icons.Search /></span>
                    <input
                      type="text"
                      placeholder="Buscar por placa, marca ou modelo..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className={`${styles.input} pl-11`}
                    />
                  </div>
                  <div className="flex rounded-xl bg-white/[0.04] border border-white/[0.06] p-1">
                    <button
                      onClick={() => setFilterMode('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterMode === 'all' ? 'bg-white/[0.1] text-white' : 'text-white/40 hover:text-white/60'}`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setFilterMode('vehicle')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${filterMode === 'vehicle' ? 'bg-blue-500/20 text-blue-400' : 'text-white/40 hover:text-white/60'}`}
                    >
                      <span className="w-3 h-3"><Icons.Car /></span>
                      Veículos
                    </button>
                    <button
                      onClick={() => setFilterMode('standalone')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${filterMode === 'standalone' ? 'bg-purple-500/20 text-purple-400' : 'text-white/40 hover:text-white/60'}`}
                    >
                      <span className="w-3 h-3"><Icons.Standalone /></span>
                      Avulsos
                    </button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-3">
                  <div className={`${styles.card} text-center`}>
                    <p className="text-2xl font-semibold text-white">{stats.total}</p>
                    <p className="text-xs text-white/40 mt-1">Total</p>
                  </div>
                  <div className={`${styles.card} text-center border-blue-500/20`}>
                    <p className="text-2xl font-semibold text-blue-400">{stats.vehicle}</p>
                    <p className="text-xs text-white/40 mt-1">Veículos</p>
                  </div>
                  <div className={`${styles.card} text-center border-purple-500/20`}>
                    <p className="text-2xl font-semibold text-purple-400">{stats.standalone}</p>
                    <p className="text-xs text-white/40 mt-1">Avulsos</p>
                  </div>
                  <div className={`${styles.card} text-center border-amber-500/20`}>
                    <p className="text-2xl font-semibold text-amber-400">{stats.withErrors}</p>
                    <p className="text-xs text-white/40 mt-1">Com Falhas</p>
                  </div>
                </div>

                {/* Loading */}
                {isLoading ? (
                  <div className="py-12 text-center">
                    <span className="w-8 h-8 mx-auto text-white/40 block mb-3"><Icons.Loader /></span>
                    <p className="text-white/40">Carregando histórico...</p>
                  </div>
                ) : filteredScans.length === 0 ? (
                  <div className={`${styles.card} text-center py-10`}>
                    <span className="w-14 h-14 mx-auto text-white/20 block mb-4"><Icons.Empty /></span>
                    <p className="font-medium text-white/60">Nenhum diagnóstico encontrado</p>
                    <p className="text-sm text-white/30 mt-1">Os diagnósticos realizados aparecerão aqui</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">
                      Diagnósticos Recentes
                    </h3>
                    {filteredScans.map((scan) => {
                      const colors = getHealthColor(scan.healthScore);
                      const isVehicle = !scan.isStandalone;
                      
                      return (
                        <button
                          key={scan.id}
                          onClick={() => setSelectedScan(scan)}
                          className={`w-full ${styles.card} hover:bg-[#1f1f1f] hover:border-white/[0.1] transition-all flex items-center gap-4 text-left`}
                        >
                          {/* Health Score Circle */}
                          <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center flex-shrink-0`}>
                            <span className={`text-lg font-semibold ${colors.text}`}>{scan.healthScore}</span>
                          </div>
                          
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {isVehicle ? (
                                <>
                                  <span className="w-3.5 h-3.5 text-blue-400"><Icons.Car /></span>
                                  <span className="font-medium text-white/90">{scan.vehiclePlate}</span>
                                  <span className="text-xs text-white/30">•</span>
                                  <span className="text-sm text-white/50">{scan.vehicleMake} {scan.vehicleModel}</span>
                                </>
                              ) : (
                                <>
                                  <span className="w-3.5 h-3.5 text-purple-400"><Icons.Standalone /></span>
                                  <span className="font-medium text-purple-400">Diagnóstico Avulso</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-xs ${scan.type === 'full' ? 'bg-white/[0.06] text-white/50' : 'bg-white/[0.04] text-white/40'}`}>
                                {scan.type === 'full' ? 'Completo' : 'Rápido'}
                              </span>
                              <span className={`text-xs ${colors.text}`}>{scan.healthStatus}</span>
                            </div>
                          </div>

                          {/* Date */}
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm text-white/60">{formatDate(scan.timestamp)}</p>
                            <p className="text-xs text-white/30">{formatTime(scan.timestamp)}</p>
                          </div>

                          {/* DTC Badge */}
                          {scan.dtcCount > 0 && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
                              <span className="w-3 h-3 text-red-400"><Icons.Alert /></span>
                              <span className="text-xs font-medium text-red-400">{scan.dtcCount}</span>
                            </div>
                          )}

                          {/* Arrow */}
                          <span className="w-5 h-5 text-white/20"><Icons.ChevronRight /></span>
                        </button>
                          );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/30">
                {selectedScan ? (
                  <span>
                    {selectedScan.isStandalone ? 'Diagnóstico avulso' : `Veículo: ${selectedScan.vehiclePlate}`}
                  </span>
                ) : filteredScans.length > 0 ? (
                  <span>
                    {filterMode === 'all' && `${filteredScans.length} diagnóstico${filteredScans.length !== 1 ? 's' : ''}`}
                    {filterMode === 'vehicle' && `${filteredScans.length} vinculado${filteredScans.length !== 1 ? 's' : ''} a veículos`}
                    {filterMode === 'standalone' && `${filteredScans.length} diagnóstico${filteredScans.length !== 1 ? 's' : ''} avulso${filteredScans.length !== 1 ? 's' : ''}`}
                  </span>
                ) : null}
              </div>
              <button onClick={selectedScan ? () => setSelectedScan(null) : onClose} className={styles.btnSecondary}>
                {selectedScan ? 'Voltar' : 'Fechar'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
      );
};

// ============ SCAN DETAIL VIEW ============
const ScanDetailView = ({ scan, onBack, getHealthColor }) => {
  const colors = getHealthColor(scan.healthScore);
  const isVehicle = !scan.isStandalone;
  const IconMap = { Gauge: Icons.Gauge, Thermometer: Icons.Thermometer, Battery: Icons.Battery, Zap: Icons.Zap, Activity: Icons.Activity };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', { 
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button onClick={onBack} className="flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors text-sm">
        <svg className="w-4 h-4 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m9 18 6-6-6-6" />
        </svg>
        Voltar ao histórico
      </button>

      {/* Type Badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${isVehicle ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-purple-500/10 border border-purple-500/20'}`}>
        <span className={`w-4 h-4 ${isVehicle ? 'text-blue-400' : 'text-purple-400'}`}>
          {isVehicle ? <Icons.Car /> : <Icons.Standalone />}
        </span>
        <span className={`text-sm font-medium ${isVehicle ? 'text-blue-400' : 'text-purple-400'}`}>
          {isVehicle ? `Vinculado: ${scan.vehiclePlate}` : 'Diagnóstico Avulso'}
        </span>
      </div>

      {/* Health Score Card */}
      <div className={`${styles.card} ${colors.bg} ${colors.border}`}>
        <div className="flex items-center gap-6">
          <div className="relative">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" strokeWidth="6" className="stroke-white/[0.06]" />
              <circle cx="50" cy="50" r="42" fill="none" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${scan.healthScore * 2.64} 264`} className={colors.ring} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xl font-bold ${colors.text}`}>{scan.healthScore}%</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-5 h-5 ${colors.text}`}>{scan.healthScore >= 70 ? <Icons.CheckCircle /> : <Icons.Alert />}</span>
              <h3 className="text-base font-medium text-white/90">{scan.healthStatus}</h3>
            </div>
            {isVehicle && (
              <p className="text-sm text-white/40">{scan.vehicleMake} {scan.vehicleModel}</p>
            )}
            <p className="text-xs text-white/30 mt-2">{formatDate(scan.timestamp)}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-0.5 rounded text-xs ${scan.type === 'full' ? 'bg-white/[0.06] text-white/50 border border-white/[0.06]' : 'bg-white/[0.04] text-white/40'}`}>
                {scan.type === 'full' ? 'Scan Completo' : 'Scan Rápido'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Data */}
      {scan.liveData && scan.liveData.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-4 h-4"><Icons.Activity /></span>
            Dados Registrados
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {scan.liveData.map((item, i) => {
              const Icon = IconMap[item.icon] || Icons.Gauge;
              return (
                <div key={i} className={`${styles.card} text-center`}>
                  <div className="w-9 h-9 mx-auto rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/50 flex items-center justify-center mb-3">
                    <span className="w-4 h-4"><Icon /></span>
                  </div>
                  <p className="text-xs text-white/40 mb-1">{item.param}</p>
                  <p className="text-lg font-semibold text-white">
                    {item.value}<span className="text-xs font-normal text-white/30 ml-1">{item.unit}</span>
                  </p>
                </div>
                  );
            })}
          </div>
        </div>
      )}

      {/* DTC Codes */}
      {scan.dtcCodes && scan.dtcCodes.length > 0 ? (
        <div>
          <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-4 h-4 text-red-400"><Icons.Alert /></span>
            Códigos de Falha ({scan.dtcCodes.length})
          </h3>
          <div className="space-y-2">
            {scan.dtcCodes.map((code, i) => (
              <div key={i} className={`${styles.card} flex items-center gap-4 ${code.severity === 'critical' ? 'border-red-500/20 bg-red-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
                <div className={`px-3 py-1.5 rounded-lg font-mono font-bold text-sm ${code.severity === 'critical' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {code.code}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white/90 truncate">{code.description}</p>
                  {code.system && <p className="text-xs text-white/40">{code.system}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={`${styles.card} text-center py-6 bg-emerald-500/5 border-emerald-500/20`}>
          <span className="w-10 h-10 mx-auto text-emerald-400 block mb-2"><Icons.CheckCircle /></span>
          <p className="font-medium text-emerald-400">Nenhum código de falha</p>
          <p className="text-sm text-white/40 mt-1">O veículo estava funcionando normalmente</p>
        </div>
      )}
    </div>
  );
};

export default VehicleHistoryModal;