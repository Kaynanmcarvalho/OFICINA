/**
 * TORQ Check-in Details Modal - Premium Immersive Design
 * Modal com identidade visual da marca do veículo
 * Atmosfera imersiva de software automotivo de alto padrão
 * Superfícies elevadas premium, sem branco puro
 * Janeiro 2026
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
import { useEmpresa } from '../../../../contexts/EmpresaContext';
import { formatPhone } from '../../../../utils/formatters';
import { getBrandLogoUrl, getEffectiveBrand, formatVehicleDisplay } from '../../../../utils/vehicleBrandLogos';
import { getBrandModalStyles } from '../../../../utils/brandModalTheme';
import '../../../../styles/brand-modal.css';

// ============ EXCLUSIVE SVG ICONS ============
const Icons = {
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
      <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
    </svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
      <path d="M4 20h4L18.5 9.5a2.121 2.121 0 00-3-3L5 17v3z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 6.5l3 3" strokeLinecap="round" />
    </svg>
  ),
  Client: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4" stroke="currentColor">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
    </svg>
  ),
  Vehicle: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4" stroke="currentColor">
      <path d="M5 17h14v-5l-2-4H7l-2 4v5z" strokeLinejoin="round" />
      <circle cx="7.5" cy="17" r="1.5" fill="currentColor" />
      <circle cx="16.5" cy="17" r="1.5" fill="currentColor" />
      <path d="M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4" stroke="currentColor">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" strokeLinejoin="round" />
    </svg>
  ),
  WhatsApp: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.43 1.27 4.88L2 22l5.23-1.23A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm.02 17.5c-1.52 0-3-.4-4.32-1.16l-.31-.18-3.2.84.86-3.13-.2-.32a7.464 7.464 0 01-1.15-4.03c0-4.14 3.36-7.5 7.5-7.5 2 0 3.88.78 5.3 2.2a7.44 7.44 0 012.2 5.3c0 4.14-3.36 7.5-7.5 7.5l-.18-.02zm4.1-5.6c-.22-.11-1.32-.65-1.53-.73-.2-.07-.35-.11-.5.11-.15.22-.58.73-.71.88-.13.15-.26.17-.48.06-.22-.11-.94-.35-1.79-1.11-.66-.59-1.11-1.32-1.24-1.54-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.06-.11-.5-1.2-.68-1.65-.18-.43-.36-.37-.5-.38h-.43c-.15 0-.39.06-.59.28-.2.22-.78.76-.78 1.86s.8 2.16.91 2.31c.11.15 1.57 2.4 3.81 3.36.53.23.95.37 1.27.47.54.17 1.02.15 1.41.09.43-.06 1.32-.54 1.51-1.06.19-.52.19-.97.13-1.06-.06-.09-.21-.15-.43-.26z"/>
    </svg>
  ),
  Loader: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" className="animate-spin">
      <path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.07-5.07l-2.83 2.83M9.76 14.24l-2.83 2.83m11.14 0l-2.83-2.83M9.76 9.76L6.93 6.93" strokeLinecap="round" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4" stroke="currentColor">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Odometer: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4" stroke="currentColor">
      <path d="M12 2a10 10 0 00-7.07 17.07" strokeLinecap="round" />
      <path d="M12 2a10 10 0 017.07 17.07" strokeLinecap="round" />
      <path d="M12 12l3-5" strokeLinecap="round" strokeWidth="2" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  Services: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4" stroke="currentColor">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinejoin="round" />
    </svg>
  ),
  Notes: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4" stroke="currentColor">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" strokeLinejoin="round" />
      <path d="M14 2v6h6M8 13h8M8 17h5" strokeLinecap="round" />
    </svg>
  ),
  Camera: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4" stroke="currentColor">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  Budget: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  History: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4" stroke="currentColor">
      <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Zoom: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4" stroke="currentColor">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" strokeLinecap="round" />
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  StageCheckin: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 12H3" strokeLinecap="round" />
    </svg>
  ),
  StageDiagnosis: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" strokeLinecap="round" />
      <circle cx="15" cy="15" r="2" />
      <path d="M15 11v2" strokeLinecap="round" />
    </svg>
  ),
  StageBudget: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 6h8M8 10h8M8 14h4" strokeLinecap="round" />
      <circle cx="16" cy="16" r="2" />
    </svg>
  ),
  StageExecution: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2m0 18v2m11-11h-2M3 12H1m18.07-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41m12.73 0l-1.41-1.41M6.34 6.34L4.93 4.93" strokeLinecap="round" />
    </svg>
  ),
  StageCheckout: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12H9" strokeLinecap="round" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor">
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Overview: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4" stroke="currentColor">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Timeline: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4" stroke="currentColor">
      <path d="M3 12h18" strokeLinecap="round" />
      <circle cx="6" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="18" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4" stroke="currentColor">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4" stroke="currentColor">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinejoin="round" />
      <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
    </svg>
  ),
  Info: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
    </svg>
  ),
};

// ============ TIMELINE STAGES CONFIG ============
const STAGES = [
  { id: 'checkin', label: 'Check-in', icon: Icons.StageCheckin, description: 'Veículo recebido na oficina', field: 'createdAt' },
  { id: 'diagnosis', label: 'Diagnóstico', icon: Icons.StageDiagnosis, description: 'Análise técnica do veículo', field: 'diagnosisAt' },
  { id: 'budget', label: 'Orçamento', icon: Icons.StageBudget, description: 'Orçamento enviado ao cliente', field: 'budgetAt' },
  { id: 'execution', label: 'Execução', icon: Icons.StageExecution, description: 'Serviço em andamento', field: 'executionAt' },
  { id: 'checkout', label: 'Checkout', icon: Icons.StageCheckout, description: 'Veículo entregue ao cliente', field: 'completedAt' },
];

// Mapeia status do Firebase para etapa da timeline
const getStageFromStatus = (status) => {
  const mapping = {
    'pending': 0,        // Só fez check-in
    'diagnosis': 1,      // Em diagnóstico
    'waiting-budget': 2, // Aguardando orçamento
    'in-progress': 3,    // Em execução
    'ready': 4,          // Pronto para checkout
    'completed': 4,      // Concluído
  };
  return mapping[status] ?? 0;
};

// ============ TABS CONFIG ============
const TABS = [
  { id: 'overview', label: 'Visão Geral', icon: Icons.Overview },
  { id: 'timeline', label: 'Etapas', icon: Icons.Timeline },
  { id: 'history', label: 'Histórico', icon: Icons.History },
  { id: 'photos', label: 'Fotos', icon: Icons.Camera },
  { id: 'budget', label: 'Orçamento', icon: Icons.Budget },
];

// ============ MAIN COMPONENT ============
const CheckinDetailsModal = ({ checkinId, vehicleBrand, onClose, onEdit }) => {
  const empresaContext = useEmpresa();
  const empresaId = empresaContext?.empresaId;
  
  const [checkinData, setCheckinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [vehicleHistory, setVehicleHistory] = useState([]);
  const [obdScans, setObdScans] = useState([]);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Tema da marca do veículo para continuidade visual
  // Usa vehicleBrand passado como prop OU extrai do checkinData após carregar
  // Se não tiver marca, tenta inferir do modelo
  const effectiveBrandForTheme = useMemo(() => {
    const brand = vehicleBrand || checkinData?.vehicleBrand;
    if (brand) return brand;
    // Tenta inferir do modelo
    const model = checkinData?.vehicleModel;
    if (model) {
      return getEffectiveBrand(null, model);
    }
    return null;
  }, [vehicleBrand, checkinData?.vehicleBrand, checkinData?.vehicleModel]);
  
  // Gera CSS variables baseado na marca - passa string diretamente
  const brandStyles = useMemo(() => getBrandModalStyles(effectiveBrandForTheme || 'default'), [effectiveBrandForTheme]);

  const loadCheckinData = useCallback(async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'checkins', checkinId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCheckinData({ 
          id: docSnap.id, 
          firestoreId: docSnap.id, // Importante: adiciona firestoreId para edição
          ...docSnap.data() 
        });
      }
    } catch (error) {
      console.error('Erro ao carregar check-in:', error);
    } finally {
      setLoading(false);
    }
  }, [checkinId]);

  const loadVehicleHistory = useCallback(async (plate) => {
    try {
      const historyRef = collection(db, 'checkins');
      const q = query(
        historyRef,
        where('vehiclePlate', '==', plate),
        orderBy('createdAt', 'desc'),
        limit(10)
            );

      const snapshot = await getDocs(q);
      setVehicleHistory(snapshot.docs.map(d => ({ id: d.id, ...d.data() })).filter(h => h.id !== checkinId));
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  }, [checkinId]);

  const loadObdScans = useCallback(async (plate) => {
    if (!empresaId) return;
    try {
      const scansRef = collection(db, `empresas/${empresaId}/obd_scans`);
      const q = query(
        scansRef,
        where('vehiclePlate', '==', plate),
        orderBy('timestamp', 'desc'),
        limit(5)
            );

      const snapshot = await getDocs(q);
      setObdScans(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error('Erro ao carregar scans OBD:', error);
    }
  }, [empresaId]);

  useEffect(() => {
    if (checkinId) loadCheckinData();
  }, [checkinId, loadCheckinData]);

  useEffect(() => {
    if (checkinData?.vehiclePlate && empresaId) {
      loadVehicleHistory(checkinData.vehiclePlate);
      loadObdScans(checkinData.vehiclePlate);
    }
  }, [checkinData?.vehiclePlate, empresaId, loadVehicleHistory, loadObdScans]);

  // Helpers
  const formatDate = (ts) => {
    if (!ts) return null;
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  
  const formatTime = (ts) => {
    if (!ts) return null;
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateTime = (ts) => {
    if (!ts) return null;
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };
  
  const getTimeSince = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const diff = Date.now() - d.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    if (days > 0) return `há ${days}d`;
    if (hours > 0) return `há ${hours}h`;
    return 'agora';
  };

  const getElapsedTime = (startTs, endTs) => {
    if (!startTs) return null;
    const start = startTs.toDate ? startTs.toDate() : new Date(startTs);
    const end = endTs ? (endTs.toDate ? endTs.toDate() : new Date(endTs)) : new Date();
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} dia${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''}`;
    const mins = Math.floor(diff / 60000);
    return `${mins} min`;
  };

  // Abre WhatsApp com mensagem
  const openWhatsApp = () => {
    if (!checkinData?.clientPhone) return;
    const phone = checkinData.clientPhone.replace(/\D/g, '');
    const phoneFormatted = phone.startsWith('55') ? phone : `55${phone}`;
    const message = encodeURIComponent(
      `Olá ${checkinData.clientName || ''}! Aqui é da oficina. Seu veículo ${checkinData.vehiclePlate} está em atendimento.`
    );

    window.open(`https://wa.me/${phoneFormatted}?text=${message}`, '_blank');
  };

  // Calcula etapa atual baseado no status REAL
  const currentStage = getStageFromStatus(checkinData?.status);
  const allPhotos = [...(checkinData?.entryPhotos || []), ...(checkinData?.exitPhotos || [])];

  // Theme styles - PREMIUM IMMERSIVE
  const t = useMemo(() => ({
    overlay: 'bg-black/90',
    modal: 'border-white/[0.08]',
    header: 'border-white/[0.06]',
    content: 'bg-transparent',
    // Cards premium com superfície elevada - sem branco puro
    card: 'bg-gradient-to-b from-white/[0.05] to-white/[0.02] border-white/[0.08] hover:from-white/[0.07] hover:to-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_1px_3px_rgba(0,0,0,0.3)]',
    // Superfície interna para sub-cards
    cardInner: 'bg-gradient-to-b from-white/[0.03] to-white/[0.01] border-white/[0.06]',
    text: 'text-white',
    textMuted: 'text-white/70',
    textSubtle: 'text-white/40',
    border: 'border-white/[0.06]',
    divider: 'bg-white/[0.06]',
    // Tabs como modo de operação
    tabActive: 'shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]',
    tabInactive: 'text-white/50 hover:text-white/70 hover:bg-white/[0.04]',
    btnSecondary: 'bg-gradient-to-b from-white/[0.06] to-white/[0.03] text-white/80 border-white/[0.1] hover:from-white/[0.08] hover:to-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
    accent: 'text-emerald-400',
    accentBg: 'bg-emerald-500/15',
    // Superfícies premium
    surfaceSoft: 'bg-gradient-to-b from-white/[0.04] to-white/[0.02]',
    surfaceDeep: 'bg-gradient-to-b from-black/20 to-black/35',
  }), []);

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 flex items-center justify-center ${t.overlay} backdrop-blur-xl`}>
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
          className={`p-10 rounded-3xl ${t.card} border flex flex-col items-center`}>
          <span className={`w-10 h-10 ${t.textMuted}`}><Icons.Loader /></span>
          <p className={`mt-4 text-sm ${t.textMuted}`}>Carregando detalhes...</p>
        </motion.div>
      </motion.div>
    );
  }

  if (!checkinData) return null;

  const effectiveBrand = getEffectiveBrand(checkinData.vehicleBrand, checkinData.vehicleModel);
  // Forçar logo do tema CLARO para o modal (igual ao hover no modo lista tema claro)
  const logoUrl = getBrandLogoUrl(effectiveBrand, checkinData.vehicleModel, false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
        style={brandStyles}
        onClick={onClose}
      >
        {/* Vinheta atmosférica sutil */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)'
          }}
        />
        
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 35, stiffness: 400 }}
          className="relative w-full max-w-4xl max-h-[88vh] rounded-3xl overflow-hidden flex flex-col"
          style={{
            background: 'var(--brand-modal-bg)',
            boxShadow: `
              0 0 0 1px var(--brand-border), 
              0 25px 50px -12px rgba(0, 0, 0, 0.8), 
              0 0 120px var(--brand-glow),
              inset 0 1px 0 rgba(255,255,255,0.05)
            `
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Linha de energia superior - assinatura sutil da marca */}
          <div 
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, var(--brand-accent) 0%, transparent 60%)`,
              opacity: 0.5
            }}
          />
          
          {/* ===== HEADER com cor da marca ===== */}
          <div 
            className="px-7 pt-6 pb-4 flex-shrink-0 relative"
            style={{ 
              background: 'var(--brand-header-bg)',
              borderBottom: '1px solid var(--brand-border)'
            }}
          >
            {/* Brilho interno sutil no header */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)'
              }}
            />
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-5">
                {/* Logo da marca - branca como no hover do modo lista (exceto marcas com logos coloridas) */}
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt={effectiveBrand} 
                    className={`${['byd', 'yamaha'].includes(effectiveBrand?.toLowerCase()) ? 'h-10' : ['dodge', 'jac', 'jac motors'].includes(effectiveBrand?.toLowerCase()) ? 'h-[74px]' : ['kawasaki'].includes(effectiveBrand?.toLowerCase()) ? 'h-10' : 'h-16'} w-auto object-contain`}
                    style={{ 
                      maxWidth: ['byd', 'yamaha'].includes(effectiveBrand?.toLowerCase()) ? '100px' : ['dodge', 'jac', 'jac motors'].includes(effectiveBrand?.toLowerCase()) ? '207px' : ['kawasaki'].includes(effectiveBrand?.toLowerCase()) ? '120px' : '180px',
                      filter: ['bmw', 'fiat', 'ferrari', 'lamborghini', 'land rover', 'land-rover', 'chevrolet', 'ford', 'renault', 'mini', 'dodge', 'ram', 'volvo', 'porsche', 'chery', 'jac', 'jac motors'].includes(effectiveBrand?.toLowerCase()) 
                        ? 'none' 
                        : 'brightness(0) invert(1)'
                    }}
                  />
                ) : (
                  <span 
                    className="text-4xl font-bold tracking-tight" 
                    style={{ color: '#FFFFFF' }}
                  >
                    {(effectiveBrand || 'V').toUpperCase()}
                  </span>
                )}
                
                {/* Separador vertical */}
                <div className="h-10 w-px" style={{ background: 'var(--brand-border)' }} />
                
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--brand-text)' }}>{checkinData.vehiclePlate}</h2>
                    <span 
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ 
                        background: 'var(--brand-card-bg)',
                        color: 'var(--brand-accent)'
                      }}
                    >
                      {STAGES[currentStage]?.label}
                    </span>
                  </div>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>
                    {formatVehicleDisplay(checkinData.vehicleBrand, checkinData.vehicleModel)}
                    {checkinData.vehicleYear && ` • ${checkinData.vehicleYear}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs mr-2" style={{ color: 'var(--brand-text-muted)', opacity: 0.6 }}>{getTimeSince(checkinData.createdAt)}</span>
                {onEdit && (
                  <button 
                    onClick={() => onEdit(checkinData)} 
                    className="p-2.5 rounded-xl transition-all duration-200 hover:opacity-80"
                    style={{ 
                      background: 'var(--brand-card-bg)',
                      border: '1px solid var(--brand-border)',
                      color: 'var(--brand-text)'
                    }}
                  >
                    <span className="w-[18px] h-[18px] block"><Icons.Edit /></span>
                  </button>
                )}
                <button 
                  onClick={onClose} 
                  className="p-2.5 rounded-xl transition-all duration-200 hover:opacity-80"
                  style={{ 
                    background: 'var(--brand-card-bg)',
                    border: '1px solid var(--brand-border)',
                    color: 'var(--brand-text)'
                  }}
                >
                  <span className="w-[18px] h-[18px] block"><Icons.Close /></span>
                </button>
              </div>
            </div>
            <div className="flex gap-1.5 relative">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive ? t.tabActive : t.tabInactive}`}
                    style={{
                      background: isActive ? 'var(--brand-accent)' : 'transparent',
                      color: isActive ? '#FFFFFF' : 'var(--brand-text-muted)',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="w-4 h-4"><Icon /></span>
                    <span>{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ===== CONTENT - Área imersiva ===== */}
          <div 
            className="flex-1 overflow-y-auto p-6 relative"
            style={{ 
              background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.4) 100%)'
            }}
          >
            {/* Vinheta interna sutil */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)'
              }}
            />
            <AnimatePresence mode="wait">
              
              {/* ========== OVERVIEW TAB ========== */}
              {activeTab === 'overview' && (
                <motion.div 
                  key="overview" 
                  initial={{ opacity: 0, y: 6 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -6 }} 
                  transition={{ duration: 0.15 }} 
                  className="space-y-5 relative"
                >
                  
                  {/* Timeline Horizontal Compacta - Card Premium */}
                  <div 
                    className={`rounded-2xl p-5 transition-all duration-200 ${t.card} border`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-semibold uppercase tracking-wider ${t.textSubtle}`}>Progresso</span>
                      <span className="text-xs font-medium" style={{ color: 'var(--brand-accent)' }}>Etapa {currentStage + 1} de {STAGES.length}</span>
                    </div>
                    
                    <div className="relative">
                      <div className={`absolute top-5 left-0 right-0 h-0.5 ${t.divider}`} />
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStage / (STAGES.length - 1)) * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="absolute top-5 left-0 h-0.5"
                        style={{ background: 'var(--brand-accent)' }}
                      />
                      
                      <div className="relative flex justify-between">
                        {STAGES.map((stage, idx) => {
                          const Icon = stage.icon;
                          const isComplete = idx < currentStage;
                          const isCurrent = idx === currentStage;
                          
                          return (
                            <div key={stage.id} className="flex flex-col items-center" style={{ width: '20%' }}>
                              <motion.div
                                initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: idx * 0.1 }}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-300`}
                                style={{
                                  background: isComplete 
                                    ? 'var(--brand-accent)' 
                                    : isCurrent 
                                      ? 'rgba(255,255,255,0.08)' 
                                      : 'rgba(255,255,255,0.03)',
                                  borderColor: isComplete || isCurrent 
                                    ? 'var(--brand-accent)' 
                                    : 'rgba(255,255,255,0.1)',
                                  color: isComplete 
                                    ? '#FFFFFF' 
                                    : isCurrent 
                                      ? 'var(--brand-accent)' 
                                      : 'rgba(255,255,255,0.4)'
                                }}
                              >
                                {isComplete ? <span className="w-5 h-5"><Icons.Check /></span> : <span className="w-5 h-5"><Icon /></span>}
                              </motion.div>
                              <span 
                                className={`mt-2 text-xs font-medium text-center`}
                                style={{
                                  color: isCurrent 
                                    ? 'var(--brand-text)' 
                                    : isComplete 
                                      ? 'var(--brand-accent)' 
                                      : 'rgba(255,255,255,0.4)'
                                }}
                              >
                                {stage.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className={`mt-5 pt-4 border-t ${t.border}`}>
                      <p className={`text-sm ${t.textMuted}`}>
                        <span className={`font-medium ${t.text}`}>{STAGES[currentStage]?.label}:</span> {STAGES[currentStage]?.description}
                      </p>
                    </div>
                  </div>

                  {/* Info Grid - Cards Premium */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`${t.card} border rounded-2xl p-5 transition-all duration-200`}>
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className={`w-5 h-5 ${t.textSubtle}`}><Icons.Client /></span>
                        <span className={`text-xs font-semibold uppercase tracking-wider ${t.textSubtle}`}>Cliente</span>
                      </div>
                      <p className={`font-semibold ${t.text}`}>{checkinData.clientName || 'Não informado'}</p>
                      {checkinData.clientPhone && (
                        <div className="flex items-center gap-2 mt-3">
                          <span className={`w-4 h-4 ${t.textSubtle}`}><Icons.Phone /></span>
                          <span className={`text-sm ${t.textMuted}`}>{formatPhone(checkinData.clientPhone)}</span>
                          <button onClick={openWhatsApp} className="w-5 h-5 text-green-500 hover:text-green-400 transition-colors ml-1">
                            <Icons.WhatsApp />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className={`${t.card} border rounded-2xl p-5 transition-all duration-200`}>
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className={`w-5 h-5 ${t.textSubtle}`}><Icons.Vehicle /></span>
                        <span className={`text-xs font-semibold uppercase tracking-wider ${t.textSubtle}`}>Veículo</span>
                      </div>
                      <p className={`font-semibold ${t.text}`}>{formatVehicleDisplay(checkinData.vehicleBrand, checkinData.vehicleModel)}</p>
                      <div className="flex items-center gap-4 mt-2">
                        {checkinData.vehicleYear && <span className={`text-sm ${t.textMuted}`}>{checkinData.vehicleYear}</span>}
                        {checkinData.vehicleColor && <span className={`text-sm ${t.textMuted}`}>{checkinData.vehicleColor}</span>}
                      </div>
                      {checkinData.vehicleKm && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`w-4 h-4 ${t.textSubtle}`}><Icons.Odometer /></span>
                          <span className={`text-sm ${t.textMuted}`}>{Number(checkinData.vehicleKm).toLocaleString('pt-BR')} km</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {checkinData.services?.length > 0 && (
                    <div className={`${t.card} border rounded-2xl p-5 transition-all duration-200`}>
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className={`w-5 h-5 ${t.textSubtle}`}><Icons.Services /></span>
                        <span className={`text-xs font-semibold uppercase tracking-wider ${t.textSubtle}`}>Serviços</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {checkinData.services.map((service, idx) => (
                          <span 
                            key={idx} 
                            className="text-sm px-3 py-1.5 rounded-lg"
                            style={{
                              background: 'rgba(255,255,255,0.06)',
                              color: 'rgba(255,255,255,0.85)',
                              border: '1px solid rgba(255,255,255,0.08)'
                            }}
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {checkinData.notes && (
                    <div className={`${t.card} border rounded-2xl p-5 transition-all duration-200`}>
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className={`w-5 h-5 ${t.textSubtle}`}><Icons.Notes /></span>
                        <span className={`text-xs font-semibold uppercase tracking-wider ${t.textSubtle}`}>Observações</span>
                      </div>
                      <p className={`text-sm leading-relaxed ${t.text}`}>{checkinData.notes}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ========== TIMELINE/ETAPAS TAB - PREMIUM ========== */}
              {activeTab === 'timeline' && (
                <motion.div 
                  key="timeline" 
                  initial={{ opacity: 0, y: 6 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -6 }} 
                  transition={{ duration: 0.15 }} 
                  className="space-y-5 relative"
                >
                  
                  {/* Resumo do Atendimento - Card Premium */}
                  <div className={`${t.card} border rounded-2xl p-5 transition-all duration-200`}>
                    <div className="flex items-center gap-2.5 mb-4">
                      <span className={`w-5 h-5 ${t.textSubtle}`}><Icons.Info /></span>
                      <span className={`text-xs font-semibold uppercase tracking-wider ${t.textSubtle}`}>Resumo do Atendimento</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div 
                        className="p-3 rounded-xl"
                        style={{
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                          border: '1px solid rgba(255,255,255,0.06)'
                        }}
                      >
                        <span className={`text-xs ${t.textSubtle}`}>Tempo Total</span>
                        <p className={`text-lg font-bold mt-1 ${t.text}`}>{getElapsedTime(checkinData.createdAt, checkinData.completedAt)}</p>
                      </div>
                      <div 
                        className="p-3 rounded-xl"
                        style={{
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                          border: '1px solid rgba(255,255,255,0.06)'
                        }}
                      >
                        <span className={`text-xs ${t.textSubtle}`}>Etapa Atual</span>
                        <p className="text-lg font-bold mt-1" style={{ color: 'var(--brand-accent)' }}>{STAGES[currentStage]?.label}</p>
                      </div>
                      <div 
                        className="p-3 rounded-xl"
                        style={{
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                          border: '1px solid rgba(255,255,255,0.06)'
                        }}
                      >
                        <span className={`text-xs ${t.textSubtle}`}>Responsável</span>
                        <p className={`text-lg font-bold mt-1 ${t.text}`}>{checkinData.assignedTo || 'Não atribuído'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Vertical Detalhada - Card Premium */}
                  <div className={`${t.card} border rounded-2xl p-6 transition-all duration-200`}>
                    <h3 className={`text-sm font-semibold ${t.text} mb-6`}>Histórico de Etapas</h3>
                    
                    <div className="relative pl-8">
                      <div className={`absolute left-[15px] top-2 bottom-2 w-0.5 ${t.divider}`} />
                      
                      <div className="space-y-6">
                        {STAGES.map((stage, idx) => {
                          const Icon = stage.icon;
                          const isComplete = idx < currentStage;
                          const isCurrent = idx === currentStage;
                          const isPending = idx > currentStage;
                          
                          // Pega timestamp real se existir
                          const stageTimestamp = checkinData[stage.field];
                          const hasTimestamp = !!stageTimestamp;
                          
                          return (
                            <motion.div key={stage.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="relative">
                              <div 
                                className="absolute -left-8 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                                style={{
                                  background: isComplete 
                                    ? 'var(--brand-accent)' 
                                    : isCurrent 
                                      ? 'rgba(16, 185, 129, 0.15)' 
                                      : 'rgba(255,255,255,0.05)',
                                  color: isComplete 
                                    ? '#FFFFFF' 
                                    : isCurrent 
                                      ? 'var(--brand-accent)' 
                                      : 'rgba(255,255,255,0.4)',
                                  boxShadow: isCurrent ? '0 0 0 2px rgba(16, 185, 129, 0.3)' : 'none'
                                }}
                              >
                                {isComplete ? <span className="w-4 h-4"><Icons.Check /></span> : <span className="w-4 h-4"><Icon /></span>}
                              </div>
                              
                              <div className={`pl-4 pb-2 ${isPending ? 'opacity-40' : ''}`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className={`font-semibold ${isCurrent || isComplete ? t.text : t.textMuted}`}>{stage.label}</span>
                                    {isCurrent && (
                                      <span 
                                        className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                                        style={{
                                          background: 'rgba(16, 185, 129, 0.15)',
                                          color: 'rgb(52, 211, 153)'
                                        }}
                                      >
                                        Em andamento
                                      </span>
                                    )}
                                    {isComplete && (
                                      <span 
                                        className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                                        style={{
                                          background: 'rgba(16, 185, 129, 0.15)',
                                          color: 'rgb(16, 185, 129)'
                                        }}
                                      >
                                        Concluído
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* Data/Hora real */}
                                  {hasTimestamp && (
                                    <span className={`text-xs ${t.textMuted}`}>{formatDateTime(stageTimestamp)}</span>
                                  )}
                                </div>
                                
                                <p className={`text-sm mt-1 ${t.textMuted}`}>{stage.description}</p>
                                
                                {/* Info adicional por etapa - Sub-card premium */}
                                {idx === 0 && checkinData.createdAt && (
                                  <div 
                                    className="mt-2 p-2 rounded-lg text-xs"
                                    style={{
                                      background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                                      border: '1px solid rgba(255,255,255,0.06)',
                                      color: 'rgba(255,255,255,0.6)'
                                    }}
                                  >
                                    <span className="flex items-center gap-1.5">
                                      <span className="w-3 h-3 flex-shrink-0"><Icons.Calendar /></span>
                                      Entrada: {formatDate(checkinData.createdAt)} às {formatTime(checkinData.createdAt)}
                                    </span>
                                    {checkinData.createdBy && (
                                      <span className="flex items-center gap-1.5 mt-1">
                                        <span className="w-3 h-3 flex-shrink-0"><Icons.User /></span>
                                        Registrado por: {checkinData.createdBy}
                                      </span>
                                    )}
                                  </div>
                                )}
                                
                                {idx === 1 && isComplete && obdScans.length > 0 && (
                                  <div 
                                    className="mt-2 p-2 rounded-lg text-xs"
                                    style={{
                                      background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                                      border: '1px solid rgba(255,255,255,0.06)',
                                      color: 'rgba(255,255,255,0.6)'
                                    }}
                                  >
                                    <span className="flex items-center gap-1.5">
                                      <span className="w-3 h-3 flex-shrink-0"><Icons.StageDiagnosis /></span>
                                      {obdScans.length} diagnóstico{obdScans.length > 1 ? 's' : ''} OBD realizado{obdScans.length > 1 ? 's' : ''}
                                    </span>
                                  </div>
                                )}
                                
                                {idx === 2 && checkinData.budget && (
                                  <div 
                                    className="mt-2 p-2 rounded-lg text-xs"
                                    style={{
                                      background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                                      border: '1px solid rgba(255,255,255,0.06)',
                                      color: 'rgba(255,255,255,0.6)'
                                    }}
                                  >
                                    <span className="flex items-center gap-1.5">
                                      <span className="w-3 h-3 flex-shrink-0"><Icons.Budget /></span>
                                      Valor: R$ {Number(checkinData.budget.total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                      {checkinData.budgetApproved && <span className="ml-2" style={{ color: 'rgb(16, 185, 129)' }}>✓ Aprovado</span>}
                                    </span>
                                  </div>
                                )}
                                
                                {idx === 4 && checkinData.completedAt && (
                                  <div 
                                    className="mt-2 p-2 rounded-lg text-xs"
                                    style={{
                                      background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                                      border: '1px solid rgba(255,255,255,0.06)',
                                      color: 'rgba(255,255,255,0.6)'
                                    }}
                                  >
                                    <span className="flex items-center gap-1.5">
                                      <span className="w-3 h-3 flex-shrink-0"><Icons.Calendar /></span>
                                      Saída: {formatDate(checkinData.completedAt)} às {formatTime(checkinData.completedAt)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Alertas/Pendências - Card Premium com cor da marca */}
                  {currentStage < 4 && (
                    <div 
                      className="rounded-2xl p-4"
                      style={{
                        background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.04) 100%)',
                        border: '1px solid rgba(245, 158, 11, 0.2)'
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"><Icons.AlertTriangle /></span>
                        <div>
                          <p className="text-sm font-medium text-amber-400">Próxima etapa: {STAGES[currentStage + 1]?.label}</p>
                          <p className="text-xs mt-1 text-amber-400/70">
                            {currentStage === 0 && 'Aguardando início do diagnóstico técnico'}
                            {currentStage === 1 && 'Diagnóstico em andamento, orçamento será gerado em seguida'}
                            {currentStage === 2 && 'Aguardando aprovação do cliente para iniciar execução'}
                            {currentStage === 3 && 'Serviço em execução, checkout após conclusão'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ========== HISTORY TAB - PREMIUM ========== */}
              {activeTab === 'history' && (
                <motion.div 
                  key="history" 
                  initial={{ opacity: 0, y: 6 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -6 }} 
                  transition={{ duration: 0.15 }} 
                  className="space-y-5 relative"
                >
                  {vehicleHistory.length > 0 ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${t.text}`}>Visitas Anteriores</span>
                        <span className={`text-xs ${t.textSubtle}`}>{vehicleHistory.length} registro{vehicleHistory.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="space-y-3">
                        {vehicleHistory.map((visit, idx) => (
                          <motion.div 
                            key={visit.id} 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: idx * 0.05 }}
                            className={`${t.card} border rounded-2xl p-4 cursor-pointer transition-all duration-200`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                                  style={{
                                    background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)',
                                    border: '1px solid rgba(255,255,255,0.08)'
                                  }}
                                >
                                  <span className={`w-5 h-5 ${t.textMuted}`}><Icons.History /></span>
                                </div>
                                <div>
                                  <p className={`text-sm font-medium ${t.text}`}>{formatDate(visit.createdAt)}</p>
                                  <p className={`text-xs ${t.textMuted}`}>
                                    {visit.services?.slice(0, 2).join(', ') || 'Serviço não especificado'}
                                    {visit.services?.length > 2 && ` +${visit.services.length - 2}`}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span 
                                  className="text-xs px-2 py-1 rounded-lg"
                                  style={{
                                    background: visit.status === 'completed' 
                                      ? 'rgba(16, 185, 129, 0.15)' 
                                      : 'rgba(255,255,255,0.06)',
                                    color: visit.status === 'completed' 
                                      ? 'rgb(16, 185, 129)' 
                                      : 'rgba(255,255,255,0.6)'
                                  }}
                                >
                                  {visit.status === 'completed' ? 'Concluído' : 'Em andamento'}
                                </span>
                                <span className={`w-4 h-4 ${t.textSubtle}`}><Icons.ChevronRight /></span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className={`${t.card} border rounded-2xl p-10 text-center`}>
                      <span className={`w-14 h-14 mx-auto block ${t.textSubtle}`}><Icons.History /></span>
                      <p className={`mt-4 font-medium ${t.textMuted}`}>Primeira visita deste veículo</p>
                      <p className={`text-sm mt-1 ${t.textSubtle}`}>O histórico aparecerá aqui após mais visitas</p>
                    </div>
                  )}

                  {obdScans.length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-sm font-semibold ${t.text}`}>Diagnósticos OBD</span>
                        <span className={`text-xs ${t.textSubtle}`}>{obdScans.length} scan{obdScans.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="space-y-3">
                        {obdScans.map((scan, idx) => (
                          <motion.div 
                            key={scan.id} 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: idx * 0.05 }}
                            className={`${t.card} border rounded-2xl p-4 transition-all duration-200`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                                  style={{
                                    background: scan.dtcCodes?.length > 0 
                                      ? 'rgba(245, 158, 11, 0.15)' 
                                      : 'rgba(16, 185, 129, 0.15)'
                                  }}
                                >
                                  <span 
                                    className="w-5 h-5"
                                    style={{
                                      color: scan.dtcCodes?.length > 0 
                                        ? 'rgb(245, 158, 11)' 
                                        : 'rgb(16, 185, 129)'
                                    }}
                                  >
                                    <Icons.StageDiagnosis />
                                  </span>
                                </div>
                                <div>
                                  <p className={`text-sm font-medium ${t.text}`}>{formatDate(scan.timestamp)}</p>
                                  <p className={`text-xs ${t.textMuted}`}>
                                    {scan.dtcCodes?.length > 0 ? `${scan.dtcCodes.length} código${scan.dtcCodes.length > 1 ? 's' : ''} encontrado${scan.dtcCodes.length > 1 ? 's' : ''}` : 'Nenhum problema detectado'}
                                  </p>
                                </div>
                              </div>
                              <span className={`w-4 h-4 ${t.textSubtle}`}><Icons.ChevronRight /></span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ========== PHOTOS TAB - PREMIUM ========== */}
              {activeTab === 'photos' && (
                <motion.div 
                  key="photos" 
                  initial={{ opacity: 0, y: 6 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -6 }} 
                  transition={{ duration: 0.15 }} 
                  className="space-y-5 relative"
                >
                  {checkinData.entryPhotos?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className={`w-5 h-5 ${t.textSubtle}`}><Icons.StageCheckin /></span>
                        <span className={`text-sm font-semibold ${t.text}`}>Fotos de Entrada</span>
                        <span className={`text-xs ${t.textSubtle}`}>({checkinData.entryPhotos.length})</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {checkinData.entryPhotos.map((photo, idx) => (
                          <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            transition={{ delay: idx * 0.05 }}
                            className="aspect-video rounded-xl overflow-hidden cursor-pointer group relative"
                            style={{
                              background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                              border: '1px solid rgba(255,255,255,0.08)'
                            }}
                            onClick={() => { setSelectedImageIndex(idx); setImageViewerOpen(true); }}
                          >
                            <img src={photo} alt={`Entrada ${idx + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <span className="w-8 h-8 text-white"><Icons.Zoom /></span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {checkinData.exitPhotos?.length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className={`w-5 h-5 ${t.textSubtle}`}><Icons.StageCheckout /></span>
                        <span className={`text-sm font-semibold ${t.text}`}>Fotos de Saída</span>
                        <span className={`text-xs ${t.textSubtle}`}>({checkinData.exitPhotos.length})</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {checkinData.exitPhotos.map((photo, idx) => (
                          <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            transition={{ delay: idx * 0.05 }}
                            className="aspect-video rounded-xl overflow-hidden cursor-pointer group relative"
                            style={{
                              background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                              border: '1px solid rgba(255,255,255,0.08)'
                            }}
                            onClick={() => { setSelectedImageIndex((checkinData.entryPhotos?.length || 0) + idx); setImageViewerOpen(true); }}
                          >
                            <img src={photo} alt={`Saída ${idx + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <span className="w-8 h-8 text-white"><Icons.Zoom /></span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!checkinData.entryPhotos?.length && !checkinData.exitPhotos?.length && (
                    <div className={`${t.card} border rounded-2xl p-10 text-center`}>
                      <span className={`w-14 h-14 mx-auto block ${t.textSubtle}`}><Icons.Camera /></span>
                      <p className={`mt-4 font-medium ${t.textMuted}`}>Nenhuma foto registrada</p>
                      <p className={`text-sm mt-1 ${t.textSubtle}`}>As fotos de entrada e saída aparecerão aqui</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ========== BUDGET TAB - PREMIUM ========== */}
              {activeTab === 'budget' && (
                <motion.div 
                  key="budget" 
                  initial={{ opacity: 0, y: 6 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -6 }} 
                  transition={{ duration: 0.15 }} 
                  className="space-y-5 relative"
                >
                  {checkinData.budget ? (
                    <>
                      <div className={`${t.card} border rounded-2xl p-5 transition-all duration-200`}>
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-5 h-5 ${t.textSubtle}`}><Icons.Budget /></span>
                            <span className={`text-sm font-semibold ${t.text}`}>Orçamento</span>
                          </div>
                          <span 
                            className="text-xs px-2.5 py-1 rounded-lg font-medium"
                            style={{
                              background: checkinData.budgetApproved 
                                ? 'rgba(16, 185, 129, 0.15)' 
                                : 'rgba(245, 158, 11, 0.15)',
                              color: checkinData.budgetApproved 
                                ? 'rgb(16, 185, 129)' 
                                : 'rgb(245, 158, 11)'
                            }}
                          >
                            {checkinData.budgetApproved ? 'Aprovado' : 'Pendente'}
                          </span>
                        </div>
                        
                        {checkinData.budget.items?.length > 0 && (
                          <div className="space-y-3 mb-5">
                            {checkinData.budget.items.map((item, idx) => (
                              <div 
                                key={idx} 
                                className={`flex items-center justify-between py-2 ${idx > 0 ? 'border-t' : ''}`}
                                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                              >
                                <span className={`text-sm ${t.text}`}>{item.description}</span>
                                <span className={`text-sm font-semibold ${t.text}`}>R$ {Number(item.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div 
                          className="flex items-center justify-between pt-4 border-t"
                          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                        >
                          <span className={`font-semibold ${t.text}`}>Total</span>
                          <span className="text-xl font-bold" style={{ color: 'var(--brand-accent)' }}>
                            R$ {Number(checkinData.budget.total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      {checkinData.budget.notes && (
                        <div className={`${t.card} border rounded-2xl p-5 transition-all duration-200`}>
                          <div className="flex items-center gap-2.5 mb-3">
                            <span className={`w-5 h-5 ${t.textSubtle}`}><Icons.Notes /></span>
                            <span className={`text-xs font-semibold uppercase tracking-wider ${t.textSubtle}`}>Observações</span>
                          </div>
                          <p className={`text-sm ${t.text}`}>{checkinData.budget.notes}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className={`${t.card} border rounded-2xl p-10 text-center`}>
                      <span className={`w-14 h-14 mx-auto block ${t.textSubtle}`}><Icons.Budget /></span>
                      <p className={`mt-4 font-medium ${t.textMuted}`}>Orçamento não gerado</p>
                      <p className={`text-sm mt-1 ${t.textSubtle}`}>O orçamento será exibido aqui quando disponível</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== FOOTER - Premium com assinatura da marca ===== */}
          <div 
            className="px-7 py-5 flex-shrink-0 relative"
            style={{
              background: 'var(--brand-header-bg)',
              borderTop: '1px solid var(--brand-border)'
            }}
          >
            {/* Linha de energia inferior sutil */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-[1px]"
              style={{
                background: `linear-gradient(90deg, var(--brand-accent) 0%, transparent 50%)`,
                opacity: 0.3
              }}
            />
            
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--brand-text-muted)', opacity: 0.5 }}>
                Check-in #{checkinId?.slice(-6).toUpperCase()}
              </span>
              <div className="flex items-center gap-3">
                {checkinData.clientPhone && (
                  <button 
                    onClick={openWhatsApp} 
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255,255,255,0.15)'
                    }}
                  >
                    <span className="w-4 h-4"><Icons.WhatsApp /></span>
                    WhatsApp
                  </button>
                )}
                <button 
                  onClick={onClose} 
                  className={`px-5 py-2.5 rounded-xl transition-all text-sm font-medium ${t.btnSecondary} border`}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Image Viewer - Premium */}
      {imageViewerOpen && allPhotos.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center" 
          onClick={() => setImageViewerOpen(false)}
        >
          {/* Vinheta atmosférica */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)'
            }}
          />
          
          <button 
            onClick={() => setImageViewerOpen(false)} 
            className="absolute top-6 right-6 p-3 rounded-xl text-white transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              border: '1px solid rgba(255,255,255,0.15)'
            }}
          >
            <span className="w-6 h-6 block"><Icons.Close /></span>
          </button>
          
          <img 
            src={allPhotos[selectedImageIndex]} 
            alt="Foto ampliada" 
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl" 
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
            }}
            onClick={e => e.stopPropagation()} 
          />
          
          {allPhotos.length > 1 && (
            <div 
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                border: '1px solid rgba(255,255,255,0.15)'
              }}
            >
              {allPhotos.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(idx); }}
                  className="transition-all"
                  style={{
                    width: idx === selectedImageIndex ? '16px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: idx === selectedImageIndex ? 'white' : 'rgba(255,255,255,0.4)'
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckinDetailsModal;
