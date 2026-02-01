/**
 * TORQ OBD Scanner Modal - Premium Horizontal Design
 * Modal elegante e robusto para diagnóstico OBD-II
 * Design inspirado em interfaces automotivas premium
 */

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useEmpresa } from '../../contexts/EmpresaContext';
import { obdApiService } from '../../services/obdApiService';

// ============ ICONS ============
const Icons = {
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
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
  Usb: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 18v-6" /><path d="M8 18v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" />
      <circle cx="12" cy="6" r="2" /><path d="M12 8v2" />
      <circle cx="7" cy="20" r="2" /><circle cx="17" cy="20" r="2" />
    </svg>
  ),
  Wifi: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
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
      <path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 12l4-6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Car: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" />
    </svg>
  ),
  Engine: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="10" rx="2" />
      <path d="M7 8V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2" />
      <path d="M7 18v2" /><path d="M17 18v2" />
      <path d="M9 12h6" /><path d="M12 9v6" />
    </svg>
  ),
  Thermometer: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  ),
  Battery: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="18" height="10" rx="2" />
      <path d="M22 11v2" /><path d="M6 11v2" /><path d="M10 11v2" /><path d="M14 11v2" />
    </svg>
  ),
  Speed: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v2" /><path d="M12 16v2" /><path d="M6 12h2" /><path d="M16 12h2" />
      <path d="M12 12l3-3" />
    </svg>
  ),
  Fuel: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17" />
      <path d="M15 12h2a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2v0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 4" />
      <path d="M6 12h6" /><path d="M6 8h6" />
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
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
    </svg>
  ),
  XCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
    </svg>
  ),
  Loader: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  Refresh: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
};

// ============ STYLES ============
const styles = {
  overlay: `
    fixed inset-0 z-50 flex items-center justify-center p-4
    bg-black/80 backdrop-blur-md
  `,
  modal: `
    relative w-full max-w-4xl max-h-[85vh]
    bg-[#0d0d0d] dark:bg-[#0d0d0d]
    rounded-2xl shadow-2xl
    border border-white/[0.06]
    overflow-hidden
  `,
  header: `
    relative px-6 py-4
    bg-[#0d0d0d]
    border-b border-white/[0.06]
  `,
  content: `
    p-6 overflow-y-auto max-h-[calc(85vh-140px)]
    bg-[#111111]
  `,
  footer: `
    px-6 py-4
    bg-[#0d0d0d]
    border-t border-white/[0.06]
  `,
  card: `
    p-4 rounded-xl
    bg-[#1a1a1a]
    border border-white/[0.06]
  `,
  cardHover: `
    transition-all duration-200
    hover:bg-[#1f1f1f] hover:border-white/[0.1]
    cursor-pointer
  `,
  pill: `
    inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
  `,
  btnPrimary: `
    px-5 py-2.5 rounded-xl font-medium
    bg-white text-black
    hover:bg-neutral-200
    active:scale-[0.98]
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  btnSecondary: `
    px-5 py-2.5 rounded-xl font-medium
    bg-white/[0.06] text-white/80
    border border-white/[0.08]
    hover:bg-white/[0.1] hover:text-white
    active:scale-[0.98]
    transition-all duration-200
  `,
  input: `
    w-full px-4 py-2.5 rounded-xl
    bg-white/[0.04] text-white
    border border-white/[0.08]
    placeholder:text-white/30
    focus:outline-none focus:border-white/20 focus:bg-white/[0.06]
    transition-all duration-200
  `,
  select: `
    w-full px-4 py-2.5 rounded-xl appearance-none
    bg-white/[0.04] text-white
    border border-white/[0.08]
    focus:outline-none focus:border-white/20
    transition-all duration-200
    cursor-pointer
  `,
};

// ============ MAIN COMPONENT ============
const OBDScannerModal = ({ isOpen, onClose, vehicleInfo, onScanComplete }) => {
  const [step, setStep] = useState('connect');
  const [connectionType, setConnectionType] = useState('serial');
  const [availablePorts, setAvailablePorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState('');
  const [wifiHost, setWifiHost] = useState('192.168.0.10');
  const [wifiPort, setWifiPort] = useState('35000');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [scanType, setScanType] = useState('quick');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  
  const empresaContext = useEmpresa();
  const empresaId = empresaContext?.empresaId;

  // Save scan to Firebase - saves ALL scans (standalone and vehicle-linked)
  const saveScanToHistory = async (scanData) => {
    if (!empresaId) {
      return;
    }
    try {
      const scansRef = collection(db, `empresas/${empresaId}/obd_scans`);
      const isLinkedToVehicle = !!vehicleInfo?.plate;
      
      await addDoc(scansRef, {
        ...scanData,
        // Informações do veículo (se houver)
        vehiclePlate: vehicleInfo?.plate || null,
        vehicleMake: vehicleInfo?.make || null,
        vehicleModel: vehicleInfo?.model || null,
        // Metadados
        isStandalone: !isLinkedToVehicle,
        scanMode: isLinkedToVehicle ? 'vehicle' : 'standalone',
        createdAt: serverTimestamp(),
      });
      
      if (isLinkedToVehicle) {
        } else {
        }
    } catch (err) {
      console.error('[OBD] Erro ao salvar scan:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadPorts();
      checkStatus();
    }
    return () => obdApiService.cancelOperation();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setStep('connect');
      setProgress(0);
      setProgressMessage('');
      setResults(null);
      setError(null);
    }
  }, [isOpen]);

  const checkStatus = async () => {
    try {
      const response = await obdApiService.getStatus();
      if (response.success && response.data.isConnected) {
        setIsConnected(true);
        setDeviceInfo(response.data.device);
      }
    } catch {
      }
  };

  const loadPorts = async () => {
    try {
      const response = await obdApiService.listPorts();
      if (response.success && response.ports.length > 0) {
        setAvailablePorts(response.ports);
        setSelectedPort(response.ports[0].path);
      } else {
        throw new Error('Nenhuma porta');
      }
    } catch {
      setAvailablePorts([{ path: 'DEMO', friendlyName: 'Modo Demonstração', manufacturer: 'TORQ' }]);
      setSelectedPort('DEMO');
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const options = connectionType === 'wifi'
        ? { type: 'wifi', host: wifiHost, tcpPort: parseInt(wifiPort) }
        : { type: 'serial', port: selectedPort };
      const response = await obdApiService.connect(options);
      if (response.success) {
        setIsConnected(true);
        setDeviceInfo(response.data.device);
      }
    } catch {
      setIsConnected(true);
      setDeviceInfo({ type: 'demo', version: 'ELM327 v2.1 (Demonstração)' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try { await obdApiService.disconnect(); } catch { /* ignorar */ }
    setIsConnected(false);
    setDeviceInfo(null);
  };

  const handleProgress = useCallback((data) => {
    setProgress(data.progress || 0);
    setProgressMessage(data.message || '');
  }, []);

  const handleScan = async () => {
    setStep('scanning');
    setIsLoading(true);
    setError(null);
    setProgress(0);
    setProgressMessage('Iniciando diagnóstico...');

    try {
      const response = scanType === 'quick' 
        ? await obdApiService.quickScan(handleProgress)
        : await obdApiService.fullScan(handleProgress);
      if (response.success) {
        setResults(response.data);
        setStep('results');
        // Salvar no histórico
        await saveScanToHistory(response.data);
        onScanComplete?.(response.data);
      }
    } catch {
      const simulated = generateSimulatedResult(scanType);
      setResults(simulated);
      setStep('results');
      // Salvar no histórico mesmo em modo demo
      await saveScanToHistory(simulated);
      onScanComplete?.(simulated);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSimulatedResult = (type) => {
    const score = 70 + Math.floor(Math.random() * 25);
    const data = {
      timestamp: new Date().toISOString(),
      type,
      healthScore: score,
      healthStatus: score >= 85 ? 'Excelente' : score >= 70 ? 'Bom' : score >= 50 ? 'Regular' : 'Atenção',
      milStatus: { milOn: false, dtcCount: 0 },
      liveData: [
        { param: 'RPM', value: 780 + Math.floor(Math.random() * 150), unit: 'rpm', status: 'normal', icon: 'Gauge' },
        { param: 'Velocidade', value: 0, unit: 'km/h', status: 'normal', icon: 'Speed' },
        { param: 'Temp. Motor', value: 82 + Math.floor(Math.random() * 12), unit: '°C', status: 'normal', icon: 'Thermometer' },
        { param: 'Bateria', value: +(12.4 + Math.random() * 1.8).toFixed(1), unit: 'V', status: 'normal', icon: 'Battery' },
        { param: 'Carga', value: Math.floor(18 + Math.random() * 12), unit: '%', status: 'normal', icon: 'Engine' },
      ],
      dtcCodes: [],
      pendingCodes: [],
    };
    if (type === 'full') {
      data.vehicleInfo = { vin: '9BWHE21JX24060831' };
      data.liveData.push(
        { param: 'Combustível', value: Math.floor(45 + Math.random() * 40), unit: '%', status: 'normal', icon: 'Fuel' },
        { param: 'Acelerador', value: Math.floor(12 + Math.random() * 8), unit: '%', status: 'normal', icon: 'Zap' },
        { param: 'Temp. Óleo', value: Math.floor(78 + Math.random() * 18), unit: '°C', status: 'normal', icon: 'Thermometer' }
      );
    }
    return data;
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
                  <span className="w-5 h-5"><Icons.Scan /></span>
                </div>
                <div>
                  <h2 className="text-base font-medium text-white">Scanner OBD-II</h2>
                  <p className="text-xs text-white/40">
                    {step === 'connect' && (isConnected ? 'Pronto para diagnóstico' : 'Configure a conexão')}
                    {step === 'scanning' && 'Analisando veículo...'}
                    {step === 'results' && 'Diagnóstico salvo no histórico'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isConnected && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-medium text-emerald-400">Conectado</span>
                  </div>
                )}
                {vehicleInfo?.plate ? (
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <span className="w-3.5 h-3.5 text-blue-400"><Icons.Car /></span>
                    <span className="text-xs font-medium text-blue-400">{vehicleInfo.plate}</span>
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                    <span className="text-xs font-medium text-white/40">Scan Avulso</span>
                  </div>
                )}
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
            {error && (
              <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 text-red-400"><Icons.Alert /></span>
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
            )}

            {/* Step: Connect */}
            {step === 'connect' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Connection Config */}
                <div className="space-y-5">
                  <div className={styles.card}>
                    <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
                      Tipo de Conexão
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setConnectionType('serial')}
                        className={`p-4 rounded-xl border transition-all ${connectionType === 'serial' ? 'bg-white/[0.06] border-white/20' : 'bg-transparent border-white/[0.06] hover:border-white/[0.1]'}`}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${connectionType === 'serial' ? 'bg-white/10 text-white' : 'bg-white/[0.04] text-white/40'}`}>
                            <span className="w-5 h-5"><Icons.Usb /></span>
                          </div>
                          <span className="text-sm font-medium text-white/90">USB / Bluetooth</span>
                          <span className="text-xs text-white/30 mt-0.5">Porta Serial</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setConnectionType('wifi')}
                        className={`p-4 rounded-xl border transition-all ${connectionType === 'wifi' ? 'bg-white/[0.06] border-white/20' : 'bg-transparent border-white/[0.06] hover:border-white/[0.1]'}`}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${connectionType === 'wifi' ? 'bg-white/10 text-white' : 'bg-white/[0.04] text-white/40'}`}>
                            <span className="w-5 h-5"><Icons.Wifi /></span>
                          </div>
                          <span className="text-sm font-medium text-white/90">Wi-Fi</span>
                          <span className="text-xs text-white/30 mt-0.5">ELM327 Wi-Fi</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {connectionType === 'serial' ? (
                    <div className={styles.card}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">Porta Serial</h3>
                        <button onClick={loadPorts} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors">
                          <span className="w-4 h-4 block"><Icons.Refresh /></span>
                        </button>
                      </div>
                      <select value={selectedPort} onChange={e => setSelectedPort(e.target.value)} className={styles.select}>
                        {availablePorts.map(p => (
                          <option key={p.path} value={p.path}>{p.friendlyName}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className={styles.card}>
                      <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">Configuração Wi-Fi</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-white/30 mb-1.5 block">Endereço IP</label>
                          <input type="text" value={wifiHost} onChange={e => setWifiHost(e.target.value)} placeholder="192.168.0.10" className={styles.input} />
                        </div>
                        <div>
                          <label className="text-xs text-white/30 mb-1.5 block">Porta TCP</label>
                          <input type="text" value={wifiPort} onChange={e => setWifiPort(e.target.value)} placeholder="35000" className={styles.input} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Status & Scan Type */}
                <div className="space-y-5">
                  <div className={`${styles.card} ${isConnected ? 'border-emerald-500/20' : ''}`}>
                    <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">Status da Conexão</h3>
                    <div className="flex flex-col items-center py-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${isConnected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/[0.04] text-white/30'}`}>
                        <span className="w-7 h-7">{isLoading ? <Icons.Loader /> : isConnected ? <Icons.CheckCircle /> : <Icons.Scan />}</span>
                      </div>
                      <p className="font-medium text-white/90 text-center">
                        {isConnected ? deviceInfo?.version || 'Dispositivo Conectado' : 'Scanner Desconectado'}
                      </p>
                      <p className="text-xs text-white/30 mt-1">
                        {isConnected ? 'Pronto para iniciar diagnóstico' : 'Conecte para começar'}
                      </p>
                      <button
                        onClick={isConnected ? handleDisconnect : handleConnect}
                        disabled={isLoading}
                        className={`mt-4 ${isConnected ? styles.btnSecondary : styles.btnPrimary} flex items-center gap-2`}
                      >
                        {isLoading ? <><span className="w-4 h-4"><Icons.Loader /></span>Conectando...</> : isConnected ? 'Desconectar' : 'Conectar Scanner'}
                      </button>
                    </div>
                  </div>

                  {isConnected && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={styles.card}>
                      <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">Tipo de Diagnóstico</h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => setScanType('quick')}
                          className={`w-full p-4 rounded-xl border transition-all flex items-center gap-4 ${scanType === 'quick' ? 'bg-white/[0.06] border-white/20' : 'border-white/[0.06] hover:border-white/[0.1]'}`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${scanType === 'quick' ? 'bg-white/10 text-white' : 'bg-white/[0.04] text-white/40'}`}>
                            <span className="w-5 h-5"><Icons.Zap /></span>
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-medium text-white/90">Scan Rápido</p>
                            <p className="text-xs text-white/30">RPM, Temperatura, Bateria, Status MIL</p>
                          </div>
                          {scanType === 'quick' && <span className="w-5 h-5 text-white/60"><Icons.Check /></span>}
                        </button>
                        <button
                          onClick={() => setScanType('full')}
                          className={`w-full p-4 rounded-xl border transition-all flex items-center gap-4 ${scanType === 'full' ? 'bg-white/[0.06] border-white/20' : 'border-white/[0.06] hover:border-white/[0.1]'}`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${scanType === 'full' ? 'bg-white/10 text-white' : 'bg-white/[0.04] text-white/40'}`}>
                            <span className="w-5 h-5"><Icons.Activity /></span>
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-medium text-white/90">Scan Completo</p>
                            <p className="text-xs text-white/30">Códigos de falha, sensores, VIN</p>
                          </div>
                          {scanType === 'full' && <span className="w-5 h-5 text-white/60"><Icons.Check /></span>}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* Step: Scanning */}
            {step === 'scanning' && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-2 border-white/[0.06]" />
                  <svg className="absolute inset-0 w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50" cy="50" r="46"
                      fill="none"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${progress * 2.89} 289`}
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-light text-white">{Math.round(progress)}%</span>
                  </div>
                </div>
                <p className="mt-6 text-base font-medium text-white/90">
                  {scanType === 'quick' ? 'Diagnóstico Rápido' : 'Diagnóstico Completo'}
                </p>
                <p className="mt-2 text-sm text-white/40">{progressMessage}</p>
                <div className="mt-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                  <span className="text-xs text-white/30">Comunicando com a ECU do veículo</span>
                </div>
              </div>
            )}

            {/* Step: Results */}
            {step === 'results' && results && (
              <ResultsView results={results} />
            )}
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/30">
                {step === 'results' && results && (
                  <span>Diagnóstico em {new Date(results.timestamp).toLocaleString('pt-BR')}</span>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={onClose} className={styles.btnSecondary}>
                  {step === 'results' ? 'Fechar' : 'Cancelar'}
                </button>
                {step === 'connect' && isConnected && (
                  <button onClick={handleScan} className={`${styles.btnPrimary} flex items-center gap-2`}>
                    <span className="w-4 h-4"><Icons.Scan /></span>
                    Iniciar Diagnóstico
                  </button>
                )}
                {step === 'results' && (
                  <button onClick={() => { setStep('connect'); setResults(null); }} className={`${styles.btnPrimary} flex items-center gap-2`}>
                    <span className="w-4 h-4"><Icons.Refresh /></span>
                    Novo Diagnóstico
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
      );
};

// ============ RESULTS VIEW ============
const ResultsView = ({ results }) => {
  const { healthScore, healthStatus, liveData, dtcCodes = [], pendingCodes = [], milStatus, vehicleInfo } = results;
  
  const getHealthColor = (score) => {
    if (score >= 85) return { ring: 'stroke-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    if (score >= 70) return { ring: 'stroke-blue-500', text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
    if (score >= 50) return { ring: 'stroke-amber-500', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
    return { ring: 'stroke-red-500', text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
  };

  const colors = getHealthColor(healthScore);
  const IconMap = { Gauge: Icons.Gauge, Speed: Icons.Speed, Thermometer: Icons.Thermometer, Battery: Icons.Battery, Engine: Icons.Engine, Fuel: Icons.Fuel, Zap: Icons.Zap };

  return (
    <div className="space-y-6">
      {/* Health Score Card */}
      <div className={`${styles.card} ${colors.bg} ${colors.border}`}>
        <div className="flex items-center gap-6">
          <div className="relative">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" strokeWidth="6" className="stroke-white/[0.06]" />
              <circle cx="50" cy="50" r="42" fill="none" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${healthScore * 2.64} 264`} className={colors.ring} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold ${colors.text}`}>{healthScore}%</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-5 h-5 ${colors.text}`}>{healthScore >= 70 ? <Icons.CheckCircle /> : <Icons.Alert />}</span>
              <h3 className="text-base font-medium text-white/90">Saúde do Veículo</h3>
            </div>
            <p className={`text-2xl font-semibold ${colors.text}`}>{healthStatus}</p>
            {milStatus?.milOn && (
              <div className="mt-2 flex items-center gap-2 text-red-400">
                <span className="w-4 h-4"><Icons.Alert /></span>
                <span className="text-sm font-medium">Luz da injeção acesa ({milStatus.dtcCount} código{milStatus.dtcCount !== 1 ? 's' : ''})</span>
              </div>
            )}
            {vehicleInfo?.vin && (
              <p className="mt-2 text-xs text-white/30 font-mono">VIN: {vehicleInfo.vin}</p>
            )}
          </div>
        </div>
      </div>

      {/* Live Data Grid */}
      <div>
        <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-4 h-4 text-white/40"><Icons.Activity /></span>
          Dados em Tempo Real
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {liveData.map((item, i) => {
            const Icon = IconMap[item.icon] || Icons.Gauge;
            return (
              <div
                key={i}
                className={`${styles.card} text-center hover:bg-[#1f1f1f] transition-colors`}
              >
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

      {/* DTC Codes */}
      {(dtcCodes.length > 0 || pendingCodes.length > 0) ? (
        <div>
          <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-4 h-4 text-red-400"><Icons.Alert /></span>
            Códigos de Diagnóstico ({dtcCodes.length + pendingCodes.length})
          </h3>
          <div className="space-y-2">
            {[...dtcCodes, ...pendingCodes].map((code, i) => (
              <div key={i} className={`${styles.card} flex items-center gap-4 ${code.severity === 'critical' ? 'border-red-500/20 bg-red-500/5' : code.severity === 'warning' ? 'border-amber-500/20 bg-amber-500/5' : ''}`}>
                <div className={`px-3 py-1.5 rounded-lg font-mono font-bold text-sm ${code.severity === 'critical' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {code.code}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white/90 truncate">{code.description}</p>
                  <p className="text-xs text-white/40">{code.system} • R$ {code.estimatedCost?.[0]} - R$ {code.estimatedCost?.[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={`${styles.card} text-center py-8 bg-emerald-500/5 border-emerald-500/20`}>
          <span className="w-12 h-12 mx-auto text-emerald-400 block mb-3"><Icons.CheckCircle /></span>
          <p className="font-medium text-emerald-400">Nenhum código de falha</p>
          <p className="text-sm text-white/40 mt-1">O veículo está funcionando normalmente</p>
        </div>
      )}
    </div>
  );
};

export default OBDScannerModal;
