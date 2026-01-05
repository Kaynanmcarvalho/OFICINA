/**
 * TORQ Modal Novo Check-in - Ultra Premium Exclusive Design
 * Design elegante, sóbrio, com profundidade e contornos refinados
 * UX inteligente e fluida - Layout horizontal com sidebar
 * TRANSFORMAÇÃO DINÂMICA: Quando placa é encontrada, modal se transforma
 * com cores e tema da marca do veículo - CABEÇALHO HORIZONTAL PREMIUM
 * Janeiro 2026
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import CampoBuscaCliente from './CampoBuscaCliente';
import UploaderFotosComAnalise from './UploaderFotosComAnalise';
import ModalNovoCliente from './ModalNovoCliente';
import { useThemeStore } from '../../../store';
import { useClientStore } from '../../../store/clientStore';
import { formatPhone } from '../../../utils/formatters';
import { consultarPlaca, isValidPlate } from '../../../services/vehicleApiService';
import { createCheckin } from '../../../services/checkinService';
import { useEmpresa } from '../../../contexts/EmpresaContext';
import { getBrandLogoUrl, getEffectiveBrand, formatVehicleDisplay } from '../../../utils/vehicleBrandLogos';
import { getBrandModalStyles } from '../../../utils/brandModalTheme';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import '../../../styles/brand-modal.css';

// ============================================================================
// EXCLUSIVE ICON SYSTEM - Refined & Distinctive
// ============================================================================
const Icons = {
  Close: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  ),
  Check: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  User: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
    </svg>
  ),
  Car: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 17h14v-5l-2-4H7l-2 4v5z" strokeLinejoin="round" />
      <circle cx="7.5" cy="17" r="1.5" />
      <circle cx="16.5" cy="17" r="1.5" />
      <path d="M7 8l1-3h8l1 3" strokeLinecap="round" />
    </svg>
  ),
  Wrench: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinejoin="round" />
    </svg>
  ),
  Camera: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  Phone: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  ),
  Search: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  ),
  Loader: ({ className = '' }) => (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" opacity="0.2" />
      <path d="M12 2a10 10 0 019.17 6" strokeLinecap="round" />
    </svg>
  ),
  ChevronRight: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ChevronLeft: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Gauge: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2a10 10 0 00-7.07 17.07" strokeLinecap="round" />
      <path d="M12 2a10 10 0 017.07 17.07" strokeLinecap="round" />
      <path d="M12 12l3-5" strokeLinecap="round" strokeWidth="2" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  Fuel: ({ className = '', level = 0 }) => {
    const fillHeight = (14 * level) / 100;
    const fillY = 6 + (14 - fillHeight);
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="6" width="12" height="14" rx="2" />
        {level > 0 && <rect x="6" y={fillY} width="8" height={fillHeight} rx="1" fill="currentColor" opacity="0.4" />}
        <path d="M16 10h2a2 2 0 012 2v2a2 2 0 01-2 2h-2" strokeLinecap="round" />
        <circle cx="18" cy="13" r="1.5" fill="currentColor" />
      </svg>
    );
  },
  Flag: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <path d="M4 22v-7" strokeLinecap="round" />
    </svg>
  ),
  AlertCircle: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
    </svg>
  ),
  Plus: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  Clipboard: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <path d="M9 12h6M9 16h4" strokeLinecap="round" />
    </svg>
  ),
  Notes: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" strokeLinejoin="round" />
      <path d="M14 2v6h6M8 13h8M8 17h5" strokeLinecap="round" />
    </svg>
  ),
  Sparkles: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" strokeLinejoin="round" />
      <path d="M19 15l.88 2.12L22 18l-2.12.88L19 21l-.88-2.12L16 18l2.12-.88L19 15z" strokeLinejoin="round" />
    </svg>
  ),
  Save: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" strokeLinejoin="round" />
      <path d="M17 21v-8H7v8M7 3v5h8" strokeLinecap="round" />
    </svg>
  ),
  Mail: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6l-10 7L2 6" strokeLinecap="round" />
    </svg>
  ),
};

// ============================================================================
// CONFIGURATION
// ============================================================================
const STEPS = [
  { id: 1, key: 'client', label: 'Cliente', icon: Icons.User, description: 'Dados do cliente' },
  { id: 2, key: 'vehicle', label: 'Veículo', icon: Icons.Car, description: 'Informações do veículo' },
  { id: 3, key: 'service', label: 'Serviço', icon: Icons.Wrench, description: 'Detalhes do atendimento' },
  { id: 4, key: 'photos', label: 'Fotos', icon: Icons.Camera, description: 'Registro fotográfico' },
];

const FUEL_LEVELS = [
  { value: 'empty', label: 'Vazio', percent: 0 },
  { value: '1/4', label: '1/4', percent: 25 },
  { value: '1/2', label: '1/2', percent: 50 },
  { value: '3/4', label: '3/4', percent: 75 },
  { value: 'full', label: 'Cheio', percent: 100 },
];

const VEHICLE_CONDITIONS = [
  { id: 'good_condition', label: 'Bom estado', positive: true },
  { id: 'scratches', label: 'Arranhões', positive: false },
  { id: 'dents', label: 'Amassados', positive: false },
  { id: 'broken_parts', label: 'Peças quebradas', positive: false },
  { id: 'missing_items', label: 'Itens faltando', positive: false },
  { id: 'dirty', label: 'Sujo', positive: false },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Baixa', color: 'slate' },
  { value: 'normal', label: 'Normal', color: 'blue' },
  { value: 'high', label: 'Alta', color: 'orange' },
  { value: 'urgent', label: 'Urgente', color: 'red' },
];

const COMMON_SERVICES = [
  { name: 'Troca de Óleo', category: 'Manutenção' },
  { name: 'Alinhamento', category: 'Suspensão' },
  { name: 'Balanceamento', category: 'Suspensão' },
  { name: 'Freios', category: 'Segurança' },
  { name: 'Suspensão', category: 'Suspensão' },
  { name: 'Motor', category: 'Mecânica' },
  { name: 'Elétrica', category: 'Elétrica' },
  { name: 'Ar Condicionado', category: 'Conforto' },
  { name: 'Revisão Completa', category: 'Manutenção' },
  { name: 'Diagnóstico', category: 'Análise' },
  { name: 'Embreagem', category: 'Transmissão' },
  { name: 'Câmbio', category: 'Transmissão' },
];

// Logos que mantêm cor original (não ficam brancas)
const COLORED_LOGO_BRANDS = ['bmw', 'fiat', 'ferrari', 'lamborghini', 'land rover', 'land-rover', 'chevrolet', 'ford', 'renault', 'mini', 'dodge', 'ram', 'volvo', 'porsche', 'chery', 'jac', 'jac motors'];
// Logos menores
const SMALL_LOGO_BRANDS = ['byd', 'yamaha'];
// Logos maiores (15% maior)
const LARGE_LOGO_BRANDS = ['dodge', 'jac', 'jac motors'];

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const ModalCheckinPremium = ({ isOpen, onClose, onSuccess }) => {
  const { isDarkMode } = useThemeStore();
  const { updateClient, clients } = useClientStore();
  const empresaContext = useEmpresa();
  const empresaId = empresaContext?.empresaId || sessionStorage.getItem('empresaId');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingPlate, setIsSearchingPlate] = useState(false);
  const [plateNotFound, setPlateNotFound] = useState(false);
  const [showNovoCliente, setShowNovoCliente] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  
  // Estados para pop-ups informativos
  const [showActiveCheckinAlert, setShowActiveCheckinAlert] = useState(false);
  const [activeCheckinData, setActiveCheckinData] = useState(null);
  const [showVehicleAddedAlert, setShowVehicleAddedAlert] = useState(false);
  
  // Form State
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    clientName: '', clientPhone: '', clientEmail: '', clientId: '',
    vehiclePlate: '', vehicleBrand: '', vehicleModel: '', vehicleYear: '', vehicleColor: '', vehicleKm: '',
    fuelLevel: '1/2', vehicleConditions: ['good_condition'],
    services: [], notes: '', internalNotes: '', priority: 'normal',
    photos: [],
  });

  // Função para verificar se existe check-in ativo para a placa
  const checkActiveCheckin = useCallback(async (plate) => {
    if (!plate || !empresaId) return null;
    try {
      const q = query(
        collection(db, 'checkins'),
        where('empresaId', '==', empresaId),
        where('vehiclePlate', '==', plate.toUpperCase()),
        where('status', '==', 'in-progress')
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Erro ao verificar check-in ativo:', error);
      return null;
    }
  }, [empresaId]);

  // Função para vincular veículo ao cliente
  const linkVehicleToClient = useCallback(async (clientId, vehicleData) => {
    if (!clientId) return false;
    try {
      const client = clients.find(c => c.id === clientId || c.firestoreId === clientId);
      if (!client) return false;
      
      const existingVehicles = client.vehicles || [];
      const vehicleExists = existingVehicles.some(v => 
        v.plate?.toUpperCase() === vehicleData.plate?.toUpperCase()
      );
      
      if (vehicleExists) {
        console.log('[linkVehicleToClient] Veículo já existe no cliente');
        return false; // Veículo já existe
      }
      
      const newVehicle = {
        id: Date.now().toString(),
        plate: vehicleData.plate?.toUpperCase() || '',
        brand: vehicleData.brand || '',
        model: vehicleData.model || '',
        year: vehicleData.year || '',
        color: vehicleData.color || '',
        addedAt: new Date().toISOString(),
      };
      
      const updatedVehicles = [...existingVehicles, newVehicle];
      await updateClient(clientId, { vehicles: updatedVehicles });
      
      console.log('[linkVehicleToClient] Veículo vinculado com sucesso:', newVehicle);
      return true; // Veículo adicionado
    } catch (error) {
      console.error('[linkVehicleToClient] Erro ao vincular veículo:', error);
      return false;
    }
  }, [clients, updateClient]);

  // Brand Theme System
  const effectiveBrand = useMemo(() => getEffectiveBrand(formData.vehicleBrand, formData.vehicleModel), [formData.vehicleBrand, formData.vehicleModel]);
  const brandStyles = useMemo(() => getBrandModalStyles(effectiveBrand || 'default'), [effectiveBrand]);
  const logoUrl = useMemo(() => getBrandLogoUrl(effectiveBrand, formData.vehicleModel, false), [effectiveBrand, formData.vehicleModel]);
  const isColoredLogo = COLORED_LOGO_BRANDS.includes(effectiveBrand?.toLowerCase());
  const isSmallLogo = SMALL_LOGO_BRANDS.includes(effectiveBrand?.toLowerCase());
  const isLargeLogo = LARGE_LOGO_BRANDS.includes(effectiveBrand?.toLowerCase());
  const hasBrandTheme = vehicleFound && !!effectiveBrand;

  // Theme System
  const theme = useMemo(() => ({
    overlay: isDarkMode ? 'bg-black/80' : 'bg-black/40',
    modal: isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white',
    modalBorder: isDarkMode ? 'border-white/[0.08]' : 'border-black/[0.06]',
    sidebar: isDarkMode ? 'bg-[#141414]' : 'bg-[#f5f5f7]',
    sidebarBorder: isDarkMode ? 'border-white/[0.06]' : 'border-black/[0.06]',
    text: isDarkMode ? 'text-white' : 'text-[#1d1d1f]',
    textSecondary: isDarkMode ? 'text-white/60' : 'text-[#6e6e73]',
    textTertiary: isDarkMode ? 'text-white/40' : 'text-[#86868b]',
    surface: isDarkMode ? 'bg-white/[0.04]' : 'bg-black/[0.02]',
    surfaceHover: isDarkMode ? 'hover:bg-white/[0.08]' : 'hover:bg-black/[0.04]',
    border: isDarkMode ? 'border-white/[0.08]' : 'border-black/[0.08]',
    input: isDarkMode 
      ? 'bg-white/[0.06] border-white/[0.1] text-white placeholder:text-white/30 focus:border-white/25 focus:bg-white/[0.08]' 
      : 'bg-white border-black/[0.1] text-[#1d1d1f] placeholder:text-[#86868b] focus:border-black/20 shadow-sm',
    btnPrimary: isDarkMode ? 'bg-white text-black hover:bg-white/90' : 'bg-[#1d1d1f] text-white hover:bg-black/80',
    btnSecondary: isDarkMode ? 'bg-white/[0.08] text-white hover:bg-white/[0.12]' : 'bg-black/[0.05] text-[#1d1d1f] hover:bg-black/[0.08]',
    btnGhost: isDarkMode ? 'text-white/60 hover:text-white hover:bg-white/[0.08]' : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.05]',
    navItem: isDarkMode ? 'text-white/60 hover:bg-white/[0.06]' : 'text-[#6e6e73] hover:bg-black/[0.04]',
    navItemActive: isDarkMode ? 'bg-white/[0.1] text-white' : 'bg-white text-[#1d1d1f] shadow-sm',
    navItemCompleted: isDarkMode ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-700',
    card: isDarkMode ? 'bg-white/[0.04] border-white/[0.06]' : 'bg-white border-black/[0.06] shadow-sm',
    statusColors: {
      slate: isDarkMode ? 'bg-slate-500/15 text-slate-400 border-slate-500/30' : 'bg-slate-100 text-slate-700 border-slate-200',
      blue: isDarkMode ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200',
      orange: isDarkMode ? 'bg-orange-500/15 text-orange-400 border-orange-500/30' : 'bg-orange-50 text-orange-700 border-orange-200',
      red: isDarkMode ? 'bg-red-500/15 text-red-400 border-red-500/30' : 'bg-red-50 text-red-700 border-red-200',
      emerald: isDarkMode ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    statusActive: {
      slate: 'bg-slate-500 text-white border-slate-500',
      blue: 'bg-blue-500 text-white border-blue-500',
      orange: 'bg-orange-500 text-white border-orange-500',
      red: 'bg-red-500 text-white border-red-500',
      emerald: 'bg-emerald-500 text-white border-emerald-500',
    },
  }), [isDarkMode]);

  // Effects
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedClient(null);
      setPlateNotFound(false);
      setVehicleFound(false);
      setFormData({
        clientName: '', clientPhone: '', clientEmail: '', clientId: '',
        vehiclePlate: '', vehicleBrand: '', vehicleModel: '', vehicleYear: '', vehicleColor: '', vehicleKm: '',
        fuelLevel: '1/2', vehicleConditions: ['good_condition'],
        services: [], notes: '', internalNotes: '', priority: 'normal', photos: [],
      });
    }
  }, [isOpen]);

  // Handlers
  const handleChange = useCallback((field, value) => setFormData(prev => ({ ...prev, [field]: value })), []);

  const handleClientSelect = useCallback((client) => {
    if (!client) {
      setSelectedClient(null);
      setFormData(prev => ({ ...prev, clientName: '', clientPhone: '', clientEmail: '', clientId: '' }));
      return;
    }
    if (client.isNew) { setShowNovoCliente(true); return; }
    setSelectedClient(client);
    setFormData(prev => ({
      ...prev,
      clientName: client.name || '', clientPhone: client.phone || '', clientEmail: client.email || '',
      clientId: client.firestoreId || client.id || '',
      // NÃO pré-selecionar veículos - usuário deve clicar para selecionar
      vehiclePlate: '', vehicleBrand: '', vehicleModel: '', vehicleYear: '', vehicleColor: ''
    }));
    // Resetar estado de veículo encontrado
    setVehicleFound(false);
  }, []);

  const handleSearchPlate = useCallback(async () => {
    const plate = formData.vehiclePlate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (!isValidPlate(plate)) { toast.error('Placa inválida'); return; }
    setIsSearchingPlate(true);
    setPlateNotFound(false);
    try {
      const result = await consultarPlaca(plate);
      const hasData = result.success && result.data && (result.data.brand || result.data.model || result.data.year);
      if (hasData) {
        setFormData(prev => ({
          ...prev, vehiclePlate: plate,
          vehicleBrand: result.data.brand || prev.vehicleBrand,
          vehicleModel: result.data.model || prev.vehicleModel,
          vehicleYear: result.data.year || prev.vehicleYear,
          vehicleColor: result.data.color || prev.vehicleColor,
        }));
        setPlateNotFound(false);
        setVehicleFound(true);
        toast.success('Dados do veículo encontrados!');
      } else { setPlateNotFound(true); setVehicleFound(false); }
    } catch { setPlateNotFound(true); setVehicleFound(false); }
    finally { setIsSearchingPlate(false); }
  }, [formData.vehiclePlate]);

  const handleServiceToggle = useCallback((serviceName) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceName) ? prev.services.filter(s => s !== serviceName) : [...prev.services, serviceName]
    }));
  }, []);

  const handleConditionToggle = useCallback((conditionId) => {
    setFormData(prev => {
      const current = prev.vehicleConditions;
      if (conditionId === 'good_condition') return { ...prev, vehicleConditions: ['good_condition'] };
      const withoutGood = current.filter(c => c !== 'good_condition');
      if (current.includes(conditionId)) {
        const newConditions = withoutGood.filter(c => c !== conditionId);
        return { ...prev, vehicleConditions: newConditions.length ? newConditions : ['good_condition'] };
      }
      return { ...prev, vehicleConditions: [...withoutGood, conditionId] };
    });
  }, []);

  const handlePhotosChange = useCallback((photos) => setFormData(prev => ({ ...prev, photos })), []);
  const handleNovoClienteSuccess = useCallback((newClient) => { setShowNovoCliente(false); if (newClient) handleClientSelect(newClient); }, [handleClientSelect]);

  const isStepValid = useCallback((step) => {
    switch (step) {
      case 1: return !!formData.clientName.trim();
      case 2: return !!formData.vehiclePlate.trim() && formData.vehiclePlate.length >= 7;
      case 3: return formData.services.length > 0;
      case 4: return true;
      default: return false;
    }
  }, [formData]);

  const canProceed = isStepValid(currentStep);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // 1. Verificar se já existe check-in ativo para esta placa
      const activeCheckin = await checkActiveCheckin(formData.vehiclePlate);
      if (activeCheckin) {
        setActiveCheckinData(activeCheckin);
        setShowActiveCheckinAlert(true);
        setIsLoading(false);
        return; // Não permite criar novo check-in
      }

      // 2. Preparar dados do check-in
      const checkinData = {
        clientName: formData.clientName, clientPhone: formData.clientPhone, clientEmail: formData.clientEmail, clientId: formData.clientId,
        vehiclePlate: formData.vehiclePlate.toUpperCase(), vehicleBrand: formData.vehicleBrand, vehicleModel: formData.vehicleModel,
        vehicleYear: formData.vehicleYear, vehicleColor: formData.vehicleColor, mileage: formData.vehicleKm,
        fuelLevel: formData.fuelLevel, vehicleConditions: formData.vehicleConditions,
        services: formData.services, notes: formData.notes, internalNotes: formData.internalNotes, priority: formData.priority,
        photos: formData.photos.map(p => ({ name: p.name, preview: p.preview, damageAnalysis: p.damageAnalysis })),
      };
      
      // 3. Criar o check-in
      await createCheckin(checkinData, empresaId || null);
      
      // 4. Vincular veículo ao cliente (se houver cliente selecionado)
      if (formData.clientId && formData.vehiclePlate) {
        const vehicleAdded = await linkVehicleToClient(formData.clientId, {
          plate: formData.vehiclePlate,
          brand: formData.vehicleBrand,
          model: formData.vehicleModel,
          year: formData.vehicleYear,
          color: formData.vehicleColor,
        });
        
        if (vehicleAdded) {
          setShowVehicleAddedAlert(true);
          // Aguardar um pouco para mostrar o alerta antes de fechar
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }
      
      toast.success('Check-in criado com sucesso!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('[ModalCheckinPremium] Erro ao criar check-in:', error);
      toast.error('Erro ao criar check-in');
    } finally { setIsLoading(false); }
  };

  const handleNext = async () => {
    // Ao avançar do Step 2 (Veículo), verificar se já existe check-in ativo
    if (currentStep === 2 && canProceed) {
      setIsLoading(true);
      const activeCheckin = await checkActiveCheckin(formData.vehiclePlate);
      setIsLoading(false);
      
      if (activeCheckin) {
        setActiveCheckinData(activeCheckin);
        setShowActiveCheckinAlert(true);
        return; // Não permite avançar
      }
    }
    
    if (currentStep < 4 && canProceed) setCurrentStep(prev => prev + 1);
    else if (currentStep === 4) handleSubmit();
  };

  const handleBack = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1); };

  const localFormatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    return value;
  };

  if (!isOpen) return null;


  // ============================================================================
  // RENDER - Layout com cabeçalho horizontal premium
  // ============================================================================
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 ${hasBrandTheme ? 'bg-black/90' : theme.overlay} backdrop-blur-xl`}
          style={hasBrandTheme ? brandStyles : undefined}
          onClick={onClose}
        >
          {/* Vinheta atmosférica */}
          {hasBrandTheme && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)' }}
            />
          )}
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            onClick={e => e.stopPropagation()}
            className={`relative w-full max-w-[1100px] h-[90vh] max-h-[750px] rounded-2xl overflow-hidden flex flex-col shadow-2xl ${!hasBrandTheme ? `${theme.modal} border ${theme.modalBorder}` : 'brand-theme-modal'}`}
            style={hasBrandTheme ? {
              background: 'var(--brand-modal-bg)',
              boxShadow: `0 0 0 1px var(--brand-border), 0 25px 50px -12px rgba(0,0,0,0.8), 0 0 120px var(--brand-glow), inset 0 1px 0 rgba(255,255,255,0.05)`,
            } : undefined}
          >
            {/* ================================================================
                HEADER HORIZONTAL PREMIUM
            ================================================================ */}
            {hasBrandTheme ? (
              <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="relative px-6 py-5 border-b shrink-0"
                style={{ background: 'var(--brand-header-bg)', borderColor: 'var(--brand-border)' }}
              >
                {/* Linha de energia superior */}
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ background: 'linear-gradient(90deg, var(--brand-accent) 0%, var(--brand-accent) 30%, transparent 100%)', transformOrigin: 'left' }}
                />
                
                {/* Gradiente sutil */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)' }} />
                
                <div className="relative flex items-center justify-between">
                  {/* Logo + Info do Veículo */}
                  <div className="flex items-center gap-5">
                    {logoUrl ? (
                      <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 12, delay: 0.15 }} className="relative">
                        <img src={logoUrl} alt={effectiveBrand} className={`${isSmallLogo ? 'h-12' : isLargeLogo ? 'h-[74px]' : 'h-16'} w-auto object-contain`}
                          style={{ maxWidth: isSmallLogo ? '100px' : isLargeLogo ? '207px' : '180px', filter: isColoredLogo ? 'none' : 'brightness(0) invert(1)' }} />
                        <div className="absolute inset-0 blur-xl opacity-30 -z-10" style={{ background: 'var(--brand-accent)' }} />
                      </motion.div>
                    ) : (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15, delay: 0.1 }}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--brand-card-bg)', border: '1px solid var(--brand-border)' }}>
                        <Icons.Car className="w-7 h-7" style={{ color: 'var(--brand-accent)' }} />
                      </motion.div>
                    )}
                    
                    {/* Separador */}
                    <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.3, delay: 0.25 }}
                      className="h-12 w-px" style={{ background: 'var(--brand-border)', transformOrigin: 'center' }} />
                    
                    {/* Info */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3">
                        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                          className="text-2xl font-bold tracking-tight" style={{ color: 'var(--brand-text)' }}>
                          {formData.vehiclePlate}
                        </motion.h1>
                        <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 }}
                          className="text-xs px-3 py-1 rounded-full font-semibold"
                          style={{ background: 'var(--brand-accent)', color: '#FFFFFF', boxShadow: '0 2px 8px var(--brand-glow)' }}>
                          Novo Check-in
                        </motion.span>
                      </div>
                      <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
                        className="text-sm mt-1" style={{ color: 'var(--brand-text-muted)' }}>
                        {formatVehicleDisplay(formData.vehicleBrand, formData.vehicleModel)}
                        {formData.vehicleYear && <span style={{ color: 'var(--brand-accent)' }}> • {formData.vehicleYear}</span>}
                        {formData.vehicleColor && <span> • {formData.vehicleColor}</span>}
                      </motion.p>
                    </div>
                  </div>
                  
                  {/* Steps + Close */}
                  <div className="flex items-center gap-6">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-2">
                      {STEPS.map((step, idx) => {
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;
                        return (
                          <div key={step.id} className="flex items-center">
                            <button onClick={() => (step.id <= currentStep || isStepValid(step.id - 1)) && setCurrentStep(step.id)}
                              disabled={step.id > currentStep && !isStepValid(step.id - 1)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${step.id > currentStep && !isStepValid(step.id - 1) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
                              style={{ background: isCompleted ? '#34c759' : isActive ? 'var(--brand-accent)' : 'rgba(255,255,255,0.1)', color: isCompleted || isActive ? '#FFFFFF' : 'var(--brand-text-muted)', boxShadow: isActive ? '0 0 12px var(--brand-glow)' : 'none' }}>
                              {isCompleted ? <Icons.Check className="w-4 h-4" /> : step.id}
                            </button>
                            {idx < STEPS.length - 1 && <div className="w-6 h-0.5 mx-1" style={{ background: isCompleted ? '#34c759' : 'rgba(255,255,255,0.15)' }} />}
                          </div>
                        );
                      })}
                    </motion.div>
                    
                    <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45 }}
                      onClick={onClose} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                      style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--brand-text)', border: '1px solid var(--brand-border)' }}>
                      <Icons.Close className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.header>
            ) : (
              /* Header padrão */
              <header className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${theme.border} ${theme.sidebar}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-black/5'} flex items-center justify-center`}>
                    <Icons.Clipboard className={`w-5 h-5 ${theme.text}`} />
                  </div>
                  <div>
                    <h2 className={`text-lg font-semibold ${theme.text}`}>Novo Check-in</h2>
                    <p className={`text-sm ${theme.textTertiary}`}>Passo {currentStep} de 4 • {STEPS.find(s => s.id === currentStep)?.label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {STEPS.map((step, idx) => {
                      const isActive = currentStep === step.id;
                      const isCompleted = currentStep > step.id;
                      return (
                        <div key={step.id} className="flex items-center">
                          <button onClick={() => (step.id <= currentStep || isStepValid(step.id - 1)) && setCurrentStep(step.id)}
                            disabled={step.id > currentStep && !isStepValid(step.id - 1)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${step.id > currentStep && !isStepValid(step.id - 1) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-110'} ${isCompleted ? 'bg-emerald-500 text-white' : isActive ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white') : (isDarkMode ? 'bg-white/10 text-white/60' : 'bg-black/10 text-black/60')}`}>
                            {isCompleted ? <Icons.Check className="w-4 h-4" /> : step.id}
                          </button>
                          {idx < STEPS.length - 1 && <div className={`w-6 h-0.5 mx-1 ${isCompleted ? 'bg-emerald-500' : (isDarkMode ? 'bg-white/15' : 'bg-black/15')}`} />}
                        </div>
                      );
                    })}
                  </div>
                  <motion.button onClick={onClose} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`w-9 h-9 rounded-xl flex items-center justify-center ${theme.btnSecondary}`}>
                    <Icons.Close className="w-4 h-4" />
                  </motion.button>
                </div>
              </header>
            )}

            {/* ================================================================
                MAIN CONTENT AREA
            ================================================================ */}
            <div className={`flex-1 flex overflow-hidden ${hasBrandTheme ? 'brand-theme-content-wrapper' : ''}`}
              style={hasBrandTheme ? { background: brandStyles['--brand-modal-bg'] || '#0A0F1A' } : undefined}>
              {/* SIDEBAR */}
              <aside className={`${hasBrandTheme ? 'w-52' : 'w-60'} border-r flex flex-col shrink-0 ${!hasBrandTheme ? `${theme.sidebar} ${theme.sidebarBorder}` : ''}`}
                style={hasBrandTheme ? { background: 'rgba(0,0,0,0.3)', borderColor: 'var(--brand-border)' } : undefined}>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                  {STEPS.map((step) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    const isAccessible = step.id <= currentStep || isStepValid(step.id - 1);
                    return (
                      <motion.button key={step.id} onClick={() => isAccessible && setCurrentStep(step.id)} disabled={!isAccessible}
                        whileHover={isAccessible ? { x: 2 } : {}} whileTap={isAccessible ? { scale: 0.98 } : {}}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${!hasBrandTheme ? (isActive ? theme.navItemActive : isCompleted ? theme.navItemCompleted : theme.navItem) : ''} ${!isAccessible ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                        style={hasBrandTheme ? { background: isActive ? 'rgba(255,255,255,0.1)' : isCompleted ? 'rgba(52, 199, 89, 0.15)' : 'transparent', color: isActive ? 'var(--brand-text)' : isCompleted ? '#34c759' : 'var(--brand-text-muted)' } : undefined}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${!hasBrandTheme ? (isCompleted ? 'bg-emerald-500 text-white' : isActive ? (isDarkMode ? 'bg-white/20' : 'bg-black/10') : 'bg-transparent') : ''}`}
                          style={hasBrandTheme ? { background: isCompleted ? '#34c759' : isActive ? 'var(--brand-accent)' : 'transparent', color: isCompleted || isActive ? '#FFFFFF' : 'inherit' } : undefined}>
                          {isCompleted ? <Icons.Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{step.label}</p>
                          <p className={`text-xs truncate ${!hasBrandTheme ? (isActive ? theme.textSecondary : theme.textTertiary) : ''}`}
                            style={hasBrandTheme ? { color: 'var(--brand-text-muted)', opacity: 0.7 } : undefined}>{step.description}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </nav>
                {/* Summary */}
                {(formData.clientName || formData.vehiclePlate) && (
                  <div className="p-3 border-t" style={hasBrandTheme ? { borderColor: 'var(--brand-border)' } : undefined}>
                    <div className={`p-3 rounded-xl border ${!hasBrandTheme ? `${theme.surface} ${theme.border}` : ''}`}
                      style={hasBrandTheme ? { background: 'rgba(255,255,255,0.04)', borderColor: 'var(--brand-border)' } : undefined}>
                      <p className={`text-xs font-medium mb-2 ${!hasBrandTheme ? theme.textTertiary : ''}`} style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined}>Resumo</p>
                      {formData.clientName && (
                        <div className="flex items-center gap-2 mb-1">
                          <Icons.User className={`w-3.5 h-3.5 shrink-0 ${!hasBrandTheme ? theme.textTertiary : ''}`} style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined} />
                          <span className={`text-sm truncate ${!hasBrandTheme ? theme.text : ''}`} style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>{formData.clientName}</span>
                        </div>
                      )}
                      {formData.vehiclePlate && (
                        <div className="flex items-center gap-2">
                          <Icons.Car className={`w-3.5 h-3.5 shrink-0 ${!hasBrandTheme ? theme.textTertiary : ''}`} style={hasBrandTheme ? { color: 'var(--brand-accent)' } : undefined} />
                          <span className={`text-sm font-mono ${!hasBrandTheme ? theme.text : ''}`} style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>{formData.vehiclePlate}</span>
                        </div>
                      )}
                      {formData.services.length > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                          <Icons.Wrench className={`w-3.5 h-3.5 shrink-0 ${!hasBrandTheme ? theme.textTertiary : ''}`} style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined} />
                          <span className={`text-xs ${!hasBrandTheme ? theme.textSecondary : ''}`} style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined}>{formData.services.length} serviço{formData.services.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </aside>

              {/* MAIN */}
              <main className={`flex-1 flex flex-col overflow-hidden ${hasBrandTheme ? 'brand-theme-main' : ''}`} 
                style={hasBrandTheme ? { background: brandStyles['--brand-modal-bg'] || '#0A0F1A' } : undefined}>
                {/* Step Title - FORÇAR FUNDO ESCURO */}
                {hasBrandTheme ? (
                  <div className="px-6 py-4 border-b shrink-0" 
                    style={{ 
                      borderColor: brandStyles['--brand-border'] || 'rgba(255,255,255,0.1)', 
                      background: brandStyles['--brand-header-bg'] || '#0F1419'
                    }}>
                    <h3 className="text-lg font-semibold" style={{ color: '#FFFFFF' }}>{STEPS.find(s => s.id === currentStep)?.label}</h3>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{STEPS.find(s => s.id === currentStep)?.description}</p>
                  </div>
                ) : (
                  <div className={`px-6 py-4 border-b shrink-0 ${theme.border}`}>
                    <h3 className={`text-lg font-semibold ${theme.text}`}>{STEPS.find(s => s.id === currentStep)?.label}</h3>
                    <p className={`text-sm ${theme.textSecondary}`}>{STEPS.find(s => s.id === currentStep)?.description}</p>
                  </div>
                )}


                {/* Content */}
                <div className={`flex-1 overflow-y-auto p-6 ${hasBrandTheme ? 'brand-theme-content' : ''}`} 
                  style={hasBrandTheme ? { background: brandStyles['--brand-modal-bg'] || '#0A0F1A' } : undefined}>
                  <AnimatePresence mode="wait">
                    {/* STEP 1: CLIENT */}
                    {currentStep === 1 && (
                      <motion.div key="client" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-6">
                        <div className="space-y-2">
                          <label className={`text-sm font-medium`} style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>{!hasBrandTheme && <span className={theme.text}>Buscar Cliente</span>}{hasBrandTheme && 'Buscar Cliente'}</label>
                          <CampoBuscaCliente value={selectedClient} onSelect={handleClientSelect} hasBrandTheme={hasBrandTheme} />
                        </div>
                        {selectedClient && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                            className={`p-4 rounded-xl border ${!hasBrandTheme ? theme.card : ''}`}
                            style={hasBrandTheme ? { background: 'rgba(255,255,255,0.04)', borderColor: 'var(--brand-border)' } : undefined}>
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                <Icons.User className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>{!hasBrandTheme && <span className={theme.text}>{selectedClient.name}</span>}{hasBrandTheme && selectedClient.name}</p>
                                {selectedClient.phone && <p className="text-sm flex items-center gap-2 mt-1" style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined}><Icons.Phone className="w-3.5 h-3.5" />{formatPhone(selectedClient.phone)}</p>}
                              </div>
                              <Icons.Check className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                            </div>
                            
                            {/* Veículos do Cliente - Design Premium */}
                            {selectedClient.vehicles?.length > 0 && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: 'auto' }} 
                                transition={{ duration: 0.3 }}
                                className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}
                                style={hasBrandTheme ? { borderColor: 'var(--brand-border)' } : undefined}
                              >
                                <p className={`text-xs font-medium mb-3 uppercase tracking-wide ${isDarkMode ? 'text-white/40' : 'text-black/40'}`} 
                                  style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined}>
                                  Selecione um veículo
                                </p>
                                <div className="flex flex-wrap gap-3">
                                  {selectedClient.vehicles.map((vehicle, idx) => {
                                    const isSelected = formData.vehiclePlate === vehicle.plate;
                                    return (
                                      <motion.button
                                        key={vehicle.plate || idx}
                                        type="button"
                                        onClick={() => {
                                          if (isSelected) {
                                            // Desselecionar se clicar novamente
                                            setFormData(prev => ({
                                              ...prev,
                                              vehiclePlate: '',
                                              vehicleBrand: '',
                                              vehicleModel: '',
                                              vehicleYear: '',
                                              vehicleColor: ''
                                            }));
                                            setVehicleFound(false);
                                            toast('Veículo desmarcado', { icon: '🚗', duration: 1500 });
                                          } else {
                                            setFormData(prev => ({
                                              ...prev,
                                              vehiclePlate: vehicle.plate || '',
                                              vehicleBrand: vehicle.brand || '',
                                              vehicleModel: vehicle.model || '',
                                              vehicleYear: vehicle.year || '',
                                              vehicleColor: vehicle.color || ''
                                            }));
                                            setVehicleFound(true);
                                            toast.success(`${vehicle.plate} selecionado`, { duration: 2000 });
                                          }
                                        }}
                                        whileHover={{ scale: 1.01, y: -1 }}
                                        whileTap={{ scale: 0.99 }}
                                        className={`group relative px-4 py-3 rounded-2xl border-2 transition-all duration-200 ${
                                          isSelected 
                                            ? isDarkMode 
                                              ? 'bg-blue-500/10 border-blue-500/40 shadow-lg shadow-blue-500/10' 
                                              : 'bg-blue-50 border-blue-400/50 shadow-lg shadow-blue-500/10'
                                            : isDarkMode 
                                              ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]' 
                                              : 'bg-white border-black/[0.06] hover:bg-black/[0.01] hover:border-black/[0.12] shadow-sm'
                                        }`}
                                        style={hasBrandTheme ? { 
                                          background: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)', 
                                          borderColor: isSelected ? 'rgba(59, 130, 246, 0.4)' : 'var(--brand-border)' 
                                        } : undefined}
                                      >
                                        <div className="flex items-center gap-3">
                                          {/* Logo da montadora sem container */}
                                          {(() => {
                                            const vehicleBrandLogo = getBrandLogoUrl(vehicle.brand, vehicle.model, isDarkMode);
                                            
                                            return vehicleBrandLogo ? (
                                              <img 
                                                src={vehicleBrandLogo} 
                                                alt={vehicle.brand} 
                                                className="w-8 h-8 object-contain flex-shrink-0"
                                                style={{ 
                                                  opacity: isSelected ? 1 : 0.6
                                                }}
                                              />
                                            ) : (
                                              <Icons.Car className={`w-6 h-6 flex-shrink-0 transition-colors ${
                                                isSelected 
                                                  ? isDarkMode ? 'text-blue-400' : 'text-blue-500' 
                                                  : isDarkMode ? 'text-white/50' : 'text-black/40'
                                              }`} 
                                                style={hasBrandTheme ? { color: isSelected ? '#3b82f6' : 'var(--brand-text-muted)' } : undefined} />
                                            );
                                          })()}
                                          <div className="text-left">
                                            <p className={`text-sm font-mono font-bold tracking-wide transition-colors ${
                                              isSelected 
                                                ? isDarkMode ? 'text-blue-400' : 'text-blue-600' 
                                                : isDarkMode ? 'text-white' : 'text-black'
                                            }`}
                                              style={hasBrandTheme ? { color: isSelected ? '#3b82f6' : 'var(--brand-text)' } : undefined}>
                                              {vehicle.plate}
                                            </p>
                                            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-white/50' : 'text-black/50'}`} 
                                              style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined}>
                                              {vehicle.brand} {vehicle.model}
                                            </p>
                                          </div>
                                          {isSelected && (
                                            <motion.div 
                                              initial={{ scale: 0, rotate: -180 }} 
                                              animate={{ scale: 1, rotate: 0 }}
                                              transition={{ type: 'spring', damping: 15 }}
                                              className="ml-2"
                                            >
                                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-blue-500' : 'bg-blue-500'}`}>
                                                <Icons.Check className="w-3.5 h-3.5 text-white" />
                                              </div>
                                            </motion.div>
                                          )}
                                        </div>
                                      </motion.button>
                                    );
                                  })}
                                  
                                  {/* Botão Adicionar Novo Veículo - Design Premium */}
                                  <motion.button
                                    type="button"
                                    onClick={() => {
                                      setFormData(prev => ({
                                        ...prev,
                                        vehiclePlate: '',
                                        vehicleBrand: '',
                                        vehicleModel: '',
                                        vehicleYear: '',
                                        vehicleColor: ''
                                      }));
                                      setVehicleFound(false);
                                      setCurrentStep(2);
                                    }}
                                    whileHover={{ scale: 1.01, y: -1 }}
                                    whileTap={{ scale: 0.99 }}
                                    className={`px-4 py-3 rounded-2xl border-2 border-dashed transition-all duration-200 ${
                                      isDarkMode 
                                        ? 'border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.02]' 
                                        : 'border-black/[0.1] hover:border-black/[0.2] hover:bg-black/[0.01]'
                                    }`}
                                    style={hasBrandTheme ? { borderColor: 'rgba(255,255,255,0.1)' } : undefined}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                        isDarkMode ? 'bg-white/[0.04]' : 'bg-black/[0.02]'
                                      }`}
                                      style={hasBrandTheme ? { background: 'rgba(255,255,255,0.04)' } : undefined}>
                                        <Icons.Plus className={`w-5 h-5 ${isDarkMode ? 'text-white/40' : 'text-black/40'}`} 
                                          style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined} />
                                      </div>
                                      <div className="text-left">
                                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white/70' : 'text-black/70'}`} 
                                          style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>
                                          Novo veículo
                                        </p>
                                        <p className={`text-xs ${isDarkMode ? 'text-white/40' : 'text-black/40'}`} 
                                          style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined}>
                                          Cadastrar outro
                                        </p>
                                      </div>
                                    </div>
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                        <div className={`p-4 rounded-xl border ${!hasBrandTheme ? `${theme.surface} ${theme.border}` : ''}`}
                          style={hasBrandTheme ? { background: 'rgba(255,255,255,0.03)', borderColor: 'var(--brand-border)' } : undefined}>
                          <p className="text-xs font-medium mb-4" style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined}>{!hasBrandTheme && <span className={theme.textTertiary}>Ou preencha manualmente</span>}{hasBrandTheme && 'Ou preencha manualmente'}</p>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>{!hasBrandTheme && <span className={theme.text}>Nome</span>}{hasBrandTheme && 'Nome'}</label>
                              <div className="relative">
                                <Icons.User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined} />
                                <input type="text" value={formData.clientName} onChange={e => handleChange('clientName', e.target.value)} 
                                  className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all outline-none ${!hasBrandTheme ? theme.input : ''}`} 
                                  style={hasBrandTheme ? { background: 'rgba(255,255,255,0.06)', borderColor: 'var(--brand-border)', color: '#FFFFFF' } : undefined}
                                  placeholder="Nome do cliente" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>{!hasBrandTheme && <span className={theme.text}>Telefone</span>}{hasBrandTheme && 'Telefone'}</label>
                                <div className="relative">
                                  <Icons.Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined} />
                                  <input type="tel" value={formData.clientPhone} onChange={e => handleChange('clientPhone', localFormatPhone(e.target.value))} 
                                    className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all outline-none ${!hasBrandTheme ? theme.input : ''}`}
                                    style={hasBrandTheme ? { background: 'rgba(255,255,255,0.06)', borderColor: 'var(--brand-border)', color: '#FFFFFF' } : undefined}
                                    placeholder="(00) 00000-0000" maxLength={15} />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>{!hasBrandTheme && <span className={theme.text}>Email</span>}{hasBrandTheme && 'Email'}</label>
                                <div className="relative">
                                  <Icons.Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined} />
                                  <input type="email" value={formData.clientEmail} onChange={e => handleChange('clientEmail', e.target.value)} 
                                    className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all outline-none ${!hasBrandTheme ? theme.input : ''}`}
                                    style={hasBrandTheme ? { background: 'rgba(255,255,255,0.06)', borderColor: 'var(--brand-border)', color: '#FFFFFF' } : undefined}
                                    placeholder="email@exemplo.com" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={`p-4 rounded-xl border ${!hasBrandTheme ? theme.card : ''}`}
                          style={hasBrandTheme ? { background: 'rgba(255,255,255,0.04)', borderColor: 'var(--brand-border)' } : undefined}>
                          <div className="flex items-start gap-3">
                            <Icons.Sparkles className="w-5 h-5 mt-0.5" style={hasBrandTheme ? { color: 'var(--brand-accent)' } : undefined} />
                            <div>
                              <p className="text-sm font-medium" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>{!hasBrandTheme && <span className={theme.text}>Dica</span>}{hasBrandTheme && 'Dica'}</p>
                              <p className="text-xs mt-1" style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined}>{!hasBrandTheme && <span className={theme.textSecondary}>Busque pelo nome, telefone ou CPF do cliente. Se não encontrar, você pode cadastrar um novo.</span>}{hasBrandTheme && 'Busque pelo nome, telefone ou CPF do cliente. Se não encontrar, você pode cadastrar um novo.'}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: VEHICLE */}
                    {currentStep === 2 && (
                      <motion.div key="vehicle" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>{!hasBrandTheme && <span className={theme.text}>Placa do Veículo</span>}{hasBrandTheme && 'Placa do Veículo'}</label>
                          <div className="flex gap-3">
                            <input type="text" value={formData.vehiclePlate} onChange={e => { handleChange('vehiclePlate', e.target.value.toUpperCase()); setPlateNotFound(false); }}
                              className={`flex-1 px-4 py-4 rounded-xl border transition-all outline-none text-2xl font-mono tracking-[0.3em] text-center uppercase ${!hasBrandTheme ? theme.input : ''}`}
                              style={hasBrandTheme ? { background: 'rgba(255,255,255,0.06)', borderColor: 'var(--brand-border)', color: '#FFFFFF' } : undefined}
                              placeholder="ABC1D23" maxLength={7} />
                            <motion.button onClick={handleSearchPlate} disabled={isSearchingPlate || formData.vehiclePlate.length < 7} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                              className={`px-5 rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${!hasBrandTheme ? theme.btnPrimary : ''}`}
                              style={hasBrandTheme ? { background: 'var(--brand-accent)', color: '#FFFFFF' } : undefined}>
                              {isSearchingPlate ? <Icons.Loader className="w-5 h-5" /> : <Icons.Search className="w-5 h-5" />}
                              <span className="font-medium">Buscar</span>
                            </motion.button>
                          </div>
                          <AnimatePresence>
                            {plateNotFound && (
                              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                                className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-amber-500/20">
                                  <Icons.AlertCircle className="w-5 h-5 text-amber-400" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-amber-300">Não encontramos dados para esta placa</p>
                                  <p className="text-xs mt-0.5 text-amber-400/70">Verifique se a placa está correta ou preencha os dados manualmente abaixo</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>{!hasBrandTheme && <span className={theme.text}>Marca</span>}{hasBrandTheme && 'Marca'}</label>
                            <input type="text" value={formData.vehicleBrand} onChange={e => handleChange('vehicleBrand', e.target.value)} 
                              className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${!hasBrandTheme ? theme.input : ''}`}
                              style={hasBrandTheme ? { background: 'rgba(255,255,255,0.06)', borderColor: 'var(--brand-border)', color: '#FFFFFF' } : undefined}
                              placeholder="Toyota, Honda..." />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>{!hasBrandTheme && <span className={theme.text}>Modelo</span>}{hasBrandTheme && 'Modelo'}</label>
                            <input type="text" value={formData.vehicleModel} onChange={e => handleChange('vehicleModel', e.target.value)} 
                              className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${!hasBrandTheme ? theme.input : ''}`}
                              style={hasBrandTheme ? { background: 'rgba(255,255,255,0.06)', borderColor: 'var(--brand-border)', color: '#FFFFFF' } : undefined}
                              placeholder="Corolla, Civic..." />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>{!hasBrandTheme && <span className={theme.text}>Ano</span>}{hasBrandTheme && 'Ano'}</label>
                            <input type="text" value={formData.vehicleYear} onChange={e => handleChange('vehicleYear', e.target.value)} 
                              className={`w-full px-4 py-3 rounded-xl border transition-all outline-none text-center ${!hasBrandTheme ? theme.input : ''}`}
                              style={hasBrandTheme ? { background: 'rgba(255,255,255,0.06)', borderColor: 'var(--brand-border)', color: '#FFFFFF' } : undefined}
                              placeholder="2024" maxLength={4} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>{!hasBrandTheme && <span className={theme.text}>Cor</span>}{hasBrandTheme && 'Cor'}</label>
                            <input type="text" value={formData.vehicleColor} onChange={e => handleChange('vehicleColor', e.target.value)} 
                              className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${!hasBrandTheme ? theme.input : ''}`}
                              style={hasBrandTheme ? { background: 'rgba(255,255,255,0.06)', borderColor: 'var(--brand-border)', color: '#FFFFFF' } : undefined}
                              placeholder="Prata" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-1" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>
                              <Icons.Gauge className="w-4 h-4" /> {!hasBrandTheme && <span className={theme.text}>KM</span>}{hasBrandTheme && 'KM'}
                            </label>
                            <input type="text" value={formData.vehicleKm} onChange={e => handleChange('vehicleKm', e.target.value)} 
                              className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${!hasBrandTheme ? theme.input : ''}`}
                              style={hasBrandTheme ? { background: 'rgba(255,255,255,0.06)', borderColor: 'var(--brand-border)', color: '#FFFFFF' } : undefined}
                              placeholder="50.000" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-medium flex items-center gap-2" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>
                            <Icons.Fuel className="w-4 h-4" level={FUEL_LEVELS.find(f => f.value === formData.fuelLevel)?.percent || 50} /> 
                            {!hasBrandTheme && <span className={theme.text}>Nível de Combustível</span>}{hasBrandTheme && 'Nível de Combustível'}
                          </label>
                          <div className="flex gap-2">
                            {FUEL_LEVELS.map((level) => (
                              <motion.button key={level.value} type="button" onClick={() => handleChange('fuelLevel', level.value)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                className={`flex-1 px-3 py-3 rounded-xl text-sm font-medium transition-all border ${!hasBrandTheme ? (formData.fuelLevel === level.value ? theme.statusActive.blue : `${theme.card} ${theme.text} border`) : ''}`}
                                style={hasBrandTheme ? { 
                                  background: formData.fuelLevel === level.value ? 'var(--brand-accent)' : 'rgba(255,255,255,0.04)', 
                                  borderColor: formData.fuelLevel === level.value ? 'var(--brand-accent)' : 'var(--brand-border)',
                                  color: formData.fuelLevel === level.value ? '#FFFFFF' : 'var(--brand-text)'
                                } : undefined}>
                                <Icons.Fuel className="w-5 h-5 mx-auto mb-1" level={level.percent} />{level.label}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-medium" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>{!hasBrandTheme && <span className={theme.text}>Condição do Veículo</span>}{hasBrandTheme && 'Condição do Veículo'}</label>
                          <div className="grid grid-cols-3 gap-2">
                            {VEHICLE_CONDITIONS.map((condition) => {
                              const isSelected = formData.vehicleConditions.includes(condition.id);
                              return (
                                <motion.button key={condition.id} type="button" onClick={() => handleConditionToggle(condition.id)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${!hasBrandTheme ? (isSelected ? (condition.positive ? theme.statusActive.emerald : theme.statusActive.orange) : `${theme.card} ${theme.text} border`) : ''}`}
                                  style={hasBrandTheme ? {
                                    background: isSelected ? (condition.positive ? '#34c759' : '#ff9500') : 'rgba(255,255,255,0.04)',
                                    borderColor: isSelected ? (condition.positive ? '#34c759' : '#ff9500') : 'var(--brand-border)',
                                    color: isSelected ? '#FFFFFF' : 'var(--brand-text)'
                                  } : undefined}>
                                  {condition.label}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: SERVICE */}
                    {currentStep === 3 && (
                      <motion.div key="service" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm" style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined}>{!hasBrandTheme && <span className={theme.textSecondary}>Selecione os serviços necessários</span>}{hasBrandTheme && 'Selecione os serviços necessários'}</p>
                          <span className="px-3 py-1 rounded-full text-xs font-medium"
                            style={hasBrandTheme ? { background: formData.services.length > 0 ? 'rgba(52, 199, 89, 0.15)' : 'rgba(255,255,255,0.04)', color: formData.services.length > 0 ? '#34c759' : 'var(--brand-text-muted)' } : undefined}>
                            {!hasBrandTheme && <span className={formData.services.length > 0 ? (isDarkMode ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-700') : theme.surface + ' ' + theme.textTertiary}>{formData.services.length} selecionado{formData.services.length !== 1 ? 's' : ''}</span>}
                            {hasBrandTheme && `${formData.services.length} selecionado${formData.services.length !== 1 ? 's' : ''}`}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {COMMON_SERVICES.map((service) => {
                            const isSelected = formData.services.includes(service.name);
                            return (
                              <motion.button key={service.name} type="button" onClick={() => handleServiceToggle(service.name)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                className={`relative px-4 py-3 rounded-xl text-sm font-medium transition-all border text-left ${!hasBrandTheme ? (isSelected ? 'bg-emerald-500 text-white border-emerald-500' : `${theme.card} ${theme.text} border hover:border-emerald-500/50`) : ''}`}
                                style={hasBrandTheme ? {
                                  background: isSelected ? '#34c759' : 'rgba(255,255,255,0.04)',
                                  borderColor: isSelected ? '#34c759' : 'var(--brand-border)',
                                  color: isSelected ? '#FFFFFF' : 'var(--brand-text)'
                                } : undefined}>
                                <span className="block truncate">{service.name}</span>
                                <span className="text-xs" style={hasBrandTheme && !isSelected ? { color: 'var(--brand-text-muted)' } : undefined}>{!hasBrandTheme && <span className={isSelected ? 'text-white/70' : theme.textTertiary}>{service.category}</span>}{hasBrandTheme && service.category}</span>
                                {isSelected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2"><Icons.Check className="w-4 h-4" /></motion.div>}
                              </motion.button>
                            );
                          })}
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-medium flex items-center gap-2" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>
                            <Icons.Flag className="w-4 h-4" /> {!hasBrandTheme && <span className={theme.text}>Prioridade</span>}{hasBrandTheme && 'Prioridade'}
                          </label>
                          <div className="flex gap-2">
                            {PRIORITY_OPTIONS.map((option) => {
                              const isSelected = formData.priority === option.value;
                              const priorityColors = { slate: '#64748b', blue: '#3b82f6', orange: '#f97316', red: '#ef4444' };
                              return (
                                <motion.button key={option.value} type="button" onClick={() => handleChange('priority', option.value)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all border ${!hasBrandTheme ? (isSelected ? theme.statusActive[option.color] : `${theme.card} ${theme.text} border`) : ''}`}
                                  style={hasBrandTheme ? {
                                    background: isSelected ? priorityColors[option.color] : 'rgba(255,255,255,0.04)',
                                    borderColor: isSelected ? priorityColors[option.color] : 'var(--brand-border)',
                                    color: isSelected ? '#FFFFFF' : 'var(--brand-text)'
                                  } : undefined}>
                                  {option.label}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>
                            <Icons.Notes className="w-4 h-4" /> {!hasBrandTheme && <span className={theme.text}>Observações do Cliente</span>}{hasBrandTheme && 'Observações do Cliente'}
                          </label>
                          <textarea value={formData.notes} onChange={e => handleChange('notes', e.target.value)} rows={3} 
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none resize-none ${!hasBrandTheme ? theme.input : ''}`}
                            style={hasBrandTheme ? { background: 'rgba(255,255,255,0.06)', borderColor: 'var(--brand-border)', color: '#FFFFFF' } : undefined}
                            placeholder="Problemas relatados, detalhes adicionais..." />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>
                            <Icons.Clipboard className="w-4 h-4" /> {!hasBrandTheme && <span className={theme.text}>Notas Internas</span>}{hasBrandTheme && 'Notas Internas'} 
                            <span className="text-xs" style={hasBrandTheme ? { color: 'var(--brand-text-muted)', opacity: 0.7 } : undefined}>{!hasBrandTheme && <span className={theme.textTertiary}>(não visível para o cliente)</span>}{hasBrandTheme && '(não visível para o cliente)'}</span>
                          </label>
                          <textarea value={formData.internalNotes} onChange={e => handleChange('internalNotes', e.target.value)} rows={2} 
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none resize-none ${!hasBrandTheme ? theme.input : ''}`}
                            style={hasBrandTheme ? { background: 'rgba(255,255,255,0.06)', borderColor: 'var(--brand-border)', color: '#FFFFFF' } : undefined}
                            placeholder="Anotações técnicas, lembretes..." />
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 4: PHOTOS */}
                    {currentStep === 4 && (
                      <motion.div key="photos" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-6">
                        <div className={`p-4 rounded-xl border mb-4 ${!hasBrandTheme ? theme.card : ''}`}
                          style={hasBrandTheme ? { background: 'rgba(255,255,255,0.04)', borderColor: 'var(--brand-border)' } : undefined}>
                          <div className="flex items-start gap-3">
                            <Icons.Camera className="w-5 h-5 mt-0.5" style={hasBrandTheme ? { color: 'var(--brand-accent)' } : undefined} />
                            <div>
                              <p className="text-sm font-medium" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>{!hasBrandTheme && <span className={theme.text}>Registro Fotográfico</span>}{hasBrandTheme && 'Registro Fotográfico'}</p>
                              <p className="text-xs mt-1" style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined}>{!hasBrandTheme && <span className={theme.textSecondary}>Tire fotos do veículo para documentar o estado atual. A IA irá analisar automaticamente possíveis danos.</span>}{hasBrandTheme && 'Tire fotos do veículo para documentar o estado atual. A IA irá analisar automaticamente possíveis danos.'}</p>
                            </div>
                          </div>
                        </div>
                        <UploaderFotosComAnalise fotos={formData.photos} onChange={handlePhotosChange} maxFotos={10} autoAnalyze={true} vehicleInfo={{ plate: formData.vehiclePlate, brand: formData.vehicleBrand, model: formData.vehicleModel }} />
                        <div className={`p-5 rounded-xl border ${!hasBrandTheme ? theme.card : ''}`}
                          style={hasBrandTheme ? { background: 'rgba(255,255,255,0.04)', borderColor: 'var(--brand-border)' } : undefined}>
                          <h4 className="text-sm font-semibold mb-4" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>{!hasBrandTheme && <span className={theme.text}>Resumo do Check-in</span>}{hasBrandTheme && 'Resumo do Check-in'}</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm" style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined}>{!hasBrandTheme && <span className={theme.textSecondary}>Cliente</span>}{hasBrandTheme && 'Cliente'}</span>
                              <span className="text-sm font-medium" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>{!hasBrandTheme && <span className={theme.text}>{formData.clientName || '—'}</span>}{hasBrandTheme && (formData.clientName || '—')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm" style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined}>{!hasBrandTheme && <span className={theme.textSecondary}>Veículo</span>}{hasBrandTheme && 'Veículo'}</span>
                              <span className="text-sm font-medium" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>{!hasBrandTheme && <span className={theme.text}>{formData.vehiclePlate} {formData.vehicleModel && `• ${formData.vehicleModel}`}</span>}{hasBrandTheme && `${formData.vehiclePlate} ${formData.vehicleModel ? `• ${formData.vehicleModel}` : ''}`}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm" style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined}>{!hasBrandTheme && <span className={theme.textSecondary}>Serviços</span>}{hasBrandTheme && 'Serviços'}</span>
                              <span className="text-sm font-medium" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>{!hasBrandTheme && <span className={theme.text}>{formData.services.length} selecionado{formData.services.length !== 1 ? 's' : ''}</span>}{hasBrandTheme && `${formData.services.length} selecionado${formData.services.length !== 1 ? 's' : ''}`}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm" style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined}>{!hasBrandTheme && <span className={theme.textSecondary}>Fotos</span>}{hasBrandTheme && 'Fotos'}</span>
                              <span className="text-sm font-medium" style={hasBrandTheme ? { color: 'var(--brand-text)' } : undefined}>{!hasBrandTheme && <span className={theme.text}>{formData.photos.length} foto{formData.photos.length !== 1 ? 's' : ''}</span>}{hasBrandTheme && `${formData.photos.length} foto${formData.photos.length !== 1 ? 's' : ''}`}</span>
                            </div>
                            <div className={`pt-3 border-t flex justify-between ${!hasBrandTheme ? theme.border : ''}`}
                              style={hasBrandTheme ? { borderColor: 'var(--brand-border)' } : undefined}>
                              <span className="text-sm" style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined}>{!hasBrandTheme && <span className={theme.textSecondary}>Prioridade</span>}{hasBrandTheme && 'Prioridade'}</span>
                              <span className="px-2 py-0.5 rounded-md text-xs font-medium border"
                                style={hasBrandTheme ? { 
                                  background: 'rgba(255,255,255,0.06)', 
                                  borderColor: 'var(--brand-border)', 
                                  color: 'var(--brand-text)' 
                                } : undefined}>
                                {!hasBrandTheme && <span className={theme.statusColors[PRIORITY_OPTIONS.find(p => p.value === formData.priority)?.color || 'blue']}>{PRIORITY_OPTIONS.find(p => p.value === formData.priority)?.label}</span>}
                                {hasBrandTheme && PRIORITY_OPTIONS.find(p => p.value === formData.priority)?.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <footer className={`px-6 py-4 border-t shrink-0 flex items-center justify-between ${!hasBrandTheme ? theme.border : ''}`}
                  style={hasBrandTheme ? { borderColor: 'var(--brand-border)', background: 'rgba(0,0,0,0.2)' } : undefined}>
                  <motion.button onClick={handleBack} disabled={currentStep === 1} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed ${!hasBrandTheme ? theme.btnGhost : ''}`}
                    style={hasBrandTheme ? { color: 'var(--brand-text-muted)' } : undefined}>
                    <Icons.ChevronLeft className="w-4 h-4" /> Voltar
                  </motion.button>
                  <div className="flex items-center gap-3">
                    {!canProceed && currentStep < 4 && (
                      <span className="text-xs" style={hasBrandTheme ? { color: 'var(--brand-text-muted)', opacity: 0.7 } : undefined}>
                        {!hasBrandTheme && <span className={theme.textTertiary}>
                          {currentStep === 1 && 'Informe o nome do cliente'}
                          {currentStep === 2 && 'Informe a placa do veículo'}
                          {currentStep === 3 && 'Selecione ao menos um serviço'}
                        </span>}
                        {hasBrandTheme && (
                          currentStep === 1 ? 'Informe o nome do cliente' :
                          currentStep === 2 ? 'Informe a placa do veículo' :
                          currentStep === 3 ? 'Selecione ao menos um serviço' : ''
                        )}
                      </span>
                    )}
                    <motion.button onClick={handleNext} disabled={isLoading || (currentStep < 4 && !canProceed)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${!hasBrandTheme ? theme.btnPrimary : ''}`}
                      style={hasBrandTheme ? { background: 'var(--brand-accent)', color: '#FFFFFF' } : undefined}>
                      {isLoading ? <><Icons.Loader className="w-4 h-4" /> Criando...</> : currentStep === 4 ? <><Icons.Save className="w-4 h-4" /> Criar Check-in</> : <>Próximo <Icons.ChevronRight className="w-4 h-4" /></>}
                    </motion.button>
                  </div>
                </footer>
              </main>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showNovoCliente && <ModalNovoCliente isOpen={showNovoCliente} onClose={() => setShowNovoCliente(false)} onSuccess={handleNovoClienteSuccess} />}

      {/* Pop-up: Check-in Ativo Existente */}
      <AnimatePresence>
        {showActiveCheckinAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowActiveCheckinAlert(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className={`relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'}`}
            >
              {/* Header com ícone de alerta */}
              <div className={`px-6 py-5 ${isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50'} border-b ${isDarkMode ? 'border-orange-500/20' : 'border-orange-200'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                    <Icons.AlertCircle className={`w-6 h-6 ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Check-in em Andamento
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                      Este veículo já possui um atendimento ativo
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Conteúdo */}
              <div className="px-6 py-5">
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/[0.04]' : 'bg-gray-50'} border ${isDarkMode ? 'border-white/[0.06]' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Icons.Car className={`w-5 h-5 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`} />
                    <span className={`font-mono font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {activeCheckinData?.vehiclePlate}
                    </span>
                  </div>
                  <div className={`text-sm space-y-1 ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                    <p><span className="font-medium">Cliente:</span> {activeCheckinData?.clientName}</p>
                    <p><span className="font-medium">Veículo:</span> {activeCheckinData?.vehicleBrand} {activeCheckinData?.vehicleModel}</p>
                    <p><span className="font-medium">Entrada:</span> {activeCheckinData?.checkinDate ? new Date(activeCheckinData.checkinDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                  </div>
                </div>
                
                <p className={`mt-4 text-sm ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>
                  Para criar um novo check-in, primeiro finalize o atendimento atual realizando o checkout do veículo.
                </p>
              </div>
              
              {/* Footer */}
              <div className={`px-6 py-4 border-t ${isDarkMode ? 'border-white/[0.06]' : 'border-gray-200'} flex justify-end`}>
                <button
                  onClick={() => setShowActiveCheckinAlert(false)}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all ${isDarkMode ? 'bg-white text-black hover:bg-white/90' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                >
                  Entendi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pop-up: Veículo Adicionado ao Cliente */}
      <AnimatePresence>
        {showVehicleAddedAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -30 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className={`relative px-6 py-4 rounded-2xl shadow-2xl ${isDarkMode ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-emerald-500/30' : 'bg-emerald-100'}`}>
                  <Icons.Check className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                </div>
                <div>
                  <p className={`font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    Veículo vinculado!
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-emerald-400/70' : 'text-emerald-600'}`}>
                    {formData.vehiclePlate} adicionado ao cadastro do cliente
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>,
    document.body
  );
};

export default ModalCheckinPremium;
