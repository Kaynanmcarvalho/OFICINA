/**
 * TORQ OBD Scanner Modal
 * Modal completo para diagnóstico OBD-II
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
  Scan: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <line x1="7" y1="12" x2="17" y2="12" />
    </svg>
  ),
  Bluetooth: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5" />
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
  Loader: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
      <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  ),
};

// Simulated DTC codes database
const DTC_DATABASE = {
  'P0171': { desc: 'Sistema muito pobre (Banco 1)', severity: 'warning', system: 'Combustível', causes: ['Filtro de ar sujo', 'Vazamento de vácuo', 'Sensor MAF defeituoso'], cost: [150, 500] },
  'P0420': { desc: 'Eficiência do catalisador abaixo do limite', severity: 'critical', system: 'Emissões', causes: ['Catalisador danificado', 'Sensor O2 defeituoso'], cost: [800, 2500] },
  'P0300': { desc: 'Falha de ignição aleatória detectada', severity: 'warning', system: 'Ignição', causes: ['Velas desgastadas', 'Bobina de ignição', 'Injetores sujos'], cost: [200, 800] },
  'P0442': { desc: 'Vazamento pequeno no sistema EVAP', severity: 'info', system: 'Emissões', causes: ['Tampa do tanque solta', 'Mangueira EVAP rachada'], cost: [50, 300] },
  'P0128': { desc: 'Temperatura do líquido de arrefecimento abaixo do termostato', severity: 'warning', system: 'Arrefecimento', causes: ['Termostato travado aberto', 'Sensor de temperatura'], cost: [100, 400] },
  'P0507': { desc: 'RPM de marcha lenta acima do esperado', severity: 'info', system: 'Motor', causes: ['Vazamento de ar', 'Corpo de borboleta sujo', 'Válvula IAC'], cost: [80, 350] },
};

const OBDScannerModal = ({ isOpen, onClose, vehicleInfo, checkinId }) => {
  const [step, setStep] = useState('connect'); // connect, scanning, results
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanType, setScanType] = useState('quick');
  const [results, setResults] = useState(null);
  const [liveData, setLiveData] = useState([]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep('connect');
      setIsConnected(false);
      setIsScanning(false);
      setProgress(0);
      setResults(null);
    }
  }, [isOpen]);

  // Simulate connection
  const handleConnect = async () => {
    setIsScanning(true);
    setProgress(0);
    
    // Simulate connection progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 150));
      setProgress(i);
    }
    
    setIsConnected(true);
    setIsScanning(false);
    setProgress(0);
  };

  // Simulate scan
  const handleScan = async () => {
    setStep('scanning');
    setIsScanning(true);
    setProgress(0);

    // Simulate scan progress
    const steps = ['Conectando à ECU...', 'Lendo códigos de falha...', 'Analisando sistemas...', 'Coletando dados ao vivo...', 'Finalizando...'];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setProgress(((i + 1) / steps.length) * 100);
    }

    // Generate random results
    const codes = Object.keys(DTC_DATABASE);
    const numCodes = Math.floor(Math.random() * 4); // 0-3 codes
    const foundCodes = [];
    
    for (let i = 0; i < numCodes; i++) {
      const randomCode = codes[Math.floor(Math.random() * codes.length)];
      if (!foundCodes.find(c => c.code === randomCode)) {
        foundCodes.push({ code: randomCode, ...DTC_DATABASE[randomCode] });
      }
    }

    // Generate live data
    const generatedLiveData = [
      { param: 'RPM', value: 750 + Math.floor(Math.random() * 150), unit: 'rpm', status: 'normal', range: [600, 1000] },
      { param: 'Velocidade', value: 0, unit: 'km/h', status: 'normal' },
      { param: 'Temp. Motor', value: 82 + Math.floor(Math.random() * 12), unit: '°C', status: 'normal', range: [80, 95] },
      { param: 'Carga Motor', value: 15 + Math.floor(Math.random() * 10), unit: '%', status: 'normal' },
      { param: 'Pressão Comb.', value: 35 + Math.floor(Math.random() * 10), unit: 'psi', status: 'normal', range: [30, 45] },
      { param: 'Voltagem Bat.', value: (12.4 + Math.random() * 0.8).toFixed(1), unit: 'V', status: 'normal', range: [12.0, 14.5] },
    ];

    // Calculate health score
    let healthScore = 100;
    foundCodes.forEach(code => {
      if (code.severity === 'critical') healthScore -= 30;
      else if (code.severity === 'warning') healthScore -= 15;
      else healthScore -= 5;
    });
    healthScore = Math.max(0, healthScore);

    setResults({
      codes: foundCodes,
      healthScore,
      healthStatus: healthScore >= 80 ? 'Excelente' : healthScore >= 60 ? 'Bom' : healthScore >= 40 ? 'Regular' : 'Crítico',
      scanDate: new Date(),
      vehicleInfo: vehicleInfo || { plate: 'ABC-1234', make: 'Veículo', model: 'Teste' },
    });
    setLiveData(scanType === 'full' ? generatedLiveData : []);
    setIsScanning(false);
    setStep('results');
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                <span className="w-5 h-5"><Icons.Scan /></span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Scanner OBD-II</h3>
                <p className="text-sm text-neutral-500">Diagnóstico do veículo</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500">
              <span className="w-5 h-5 block"><Icons.Close /></span>
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Step: Connect */}
            {step === 'connect' && (
              <div className="space-y-4">
                {/* Vehicle Info */}
                {vehicleInfo && (
                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/50">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="font-medium">{vehicleInfo.make} {vehicleInfo.model}</span>
                      {vehicleInfo.plate && <span className="ml-2 px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-xs font-mono">{vehicleInfo.plate}</span>}
                    </p>
                  </div>
                )}

                {/* Connection Status */}
                <div className="p-4 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600">
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${isConnected ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-400'}`}>
                      <span className="w-8 h-8">{isConnected ? <Icons.Check /> : <Icons.Bluetooth />}</span>
                    </div>
                    <p className="font-medium text-neutral-900 dark:text-white mb-1">
                      {isConnected ? 'Dispositivo Conectado' : 'Conectar Dispositivo OBD'}
                    </p>
                    <p className="text-sm text-neutral-500 mb-4">
                      {isConnected ? 'Simulador OBD • Pronto para scan' : 'Conecte o adaptador OBD-II ao veículo'}
                    </p>
                    {!isConnected && (
                      <button
                        onClick={handleConnect}
                        disabled={isScanning}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 mx-auto"
                      >
                        {isScanning ? <><span className="w-4 h-4"><Icons.Loader /></span>Conectando...</> : <><span className="w-4 h-4"><Icons.Bluetooth /></span>Conectar</>}
                      </button>
                    )}
                  </div>
                  {isScanning && (
                    <div className="mt-4">
                      <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Scan Type */}
                {isConnected && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Tipo de Scan</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setScanType('quick')}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${scanType === 'quick' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-neutral-200 dark:border-neutral-700'}`}
                      >
                        <p className="font-medium text-neutral-900 dark:text-white">Rápido</p>
                        <p className="text-xs text-neutral-500">Apenas códigos de falha</p>
                      </button>
                      <button
                        onClick={() => setScanType('full')}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${scanType === 'full' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-neutral-200 dark:border-neutral-700'}`}
                      >
                        <p className="font-medium text-neutral-900 dark:text-white">Completo</p>
                        <p className="text-xs text-neutral-500">Códigos + dados ao vivo</p>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step: Scanning */}
            {step === 'scanning' && (
              <div className="py-8 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <span className="w-10 h-10 text-blue-600"><Icons.Loader /></span>
                </div>
                <p className="font-medium text-neutral-900 dark:text-white mb-2">Escaneando veículo...</p>
                <p className="text-sm text-neutral-500 mb-4">Analisando sistemas e coletando dados</p>
                <div className="max-w-xs mx-auto">
                  <div className="flex justify-between text-xs text-neutral-500 mb-1">
                    <span>Progresso</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
            )}

            {/* Step: Results */}
            {step === 'results' && results && (
              <div className="space-y-4">
                {/* Health Score */}
                <div className={`p-4 rounded-xl ${results.healthScore >= 80 ? 'bg-green-50 dark:bg-green-900/20' : results.healthScore >= 60 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Saúde do Veículo</p>
                      <p className={`text-2xl font-bold ${results.healthScore >= 80 ? 'text-green-600' : results.healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {results.healthScore}%
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg font-medium ${results.healthScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300' : results.healthScore >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300' : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300'}`}>
                      {results.healthStatus}
                    </div>
                  </div>
                </div>

                {/* DTC Codes */}
                <div>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Códigos de Diagnóstico ({results.codes.length})
                  </p>
                  {results.codes.length === 0 ? (
                    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-center">
                      <span className="w-8 h-8 mx-auto text-green-600 block mb-2"><Icons.Check /></span>
                      <p className="font-medium text-green-700 dark:text-green-300">Nenhum código de falha</p>
                      <p className="text-sm text-green-600 dark:text-green-400">O veículo está funcionando normalmente</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {results.codes.map((code, i) => (
                        <div key={i} className={`p-3 rounded-xl border ${code.severity === 'critical' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : code.severity === 'warning' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'}`}>
                          <div className="flex items-start justify-between mb-1">
                            <span className={`px-2 py-0.5 rounded font-mono text-sm font-bold ${code.severity === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300' : code.severity === 'warning' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300'}`}>{code.code}</span>
                            <span className="text-xs text-neutral-500">{code.system}</span>
                          </div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">{code.desc}</p>
                          <p className="text-xs text-neutral-500 mt-1">Custo estimado: R$ {code.cost[0]} - R$ {code.cost[1]}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Live Data */}
                {liveData.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Dados ao Vivo</p>
                    <div className="grid grid-cols-2 gap-2">
                      {liveData.map((data, i) => (
                        <div key={i} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/50">
                          <p className="text-xs text-neutral-500 mb-1">{data.param}</p>
                          <p className="text-lg font-bold text-neutral-900 dark:text-white">
                            {data.value} <span className="text-xs font-normal text-neutral-500">{data.unit}</span>
                          </p>
                          {data.range && (
                            <p className="text-xs text-neutral-400">Normal: {data.range[0]}-{data.range[1]}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scan Info */}
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 text-center">
                  <p className="text-xs text-neutral-500">
                    Scan realizado em {results.scanDate.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                {step === 'results' ? 'Fechar' : 'Cancelar'}
              </button>
              {step === 'connect' && isConnected && (
                <button
                  onClick={handleScan}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center gap-2"
                >
                  <span className="w-4 h-4"><Icons.Scan /></span>
                  Iniciar Scan
                </button>
              )}
              {step === 'results' && (
                <button
                  onClick={() => { setStep('connect'); setResults(null); }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700"
                >
                  Novo Scan
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OBDScannerModal;
