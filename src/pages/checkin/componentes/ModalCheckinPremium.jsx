/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TORQ — Modal Novo Check-in (RECONSTRUÍDO DO ZERO)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Design: Apple VisionOS / macOS Sonoma
 * Padrão: Igual ao modal "Ver Detalhes"
 * 
 * ARQUITETURA:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ HEADER — Logo + Placa + Badge + Cliente + Modelo + Fechar              │
 * ├────────────────┬────────────────────────────────────────────────────────┤
 * │                │                                                        │
 * │   STEPS NAV    │              STEP CONTENT                              │
 * │   (280px)      │              (scrollable)                              │
 * │   NÃO SCROLLA  │                                                        │
 * │                │                                                        │
 * │   ○ Cliente    │                                                        │
 * │   ○ Veículo    │                                                        │
 * │   ○ Serviço    │                                                        │
 * │   ○ Fotos      │                                                        │
 * │                │                                                        │
 * ├────────────────┴────────────────────────────────────────────────────────┤
 * │ FOOTER — Voltar | Próximo                                               │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * Janeiro 2026
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Components
import CampoBuscaCliente from './CampoBuscaCliente';
import UploaderFotosComAnalise from './UploaderFotosComAnalise';
import ModalNovoCliente from './ModalNovoCliente';

// Stores & Context
import { useClientStore } from '../../../store/clientStore';
import { useEmpresa } from '../../../contexts/EmpresaContext';

// Services
import { formatPhone } from '../../../utils/formatters';
import { consultarPlaca, isValidPlate } from '../../../services/vehicleApiService';
import { createCheckin } from '../../../services/checkinService';
import { getBrandLogoUrl, getEffectiveBrand, formatVehicleDisplay } from '../../../utils/vehicleBrandLogos';
import { getBrandModalStyles } from '../../../utils/brandModalTheme';

// Firebase
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';

// CSS
import '../../../styles/brand-modal.css';

// ═══════════════════════════════════════════════════════════════════════════
// ICONS — SVG minimalistas, peso consistente
// ═══════════════════════════════════════════════════════════════════════════
const Icons = {
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
    </svg>
  ),
  Car: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M5 17h14v-5l-2-4H7l-2 4v5z" strokeLinejoin="round" />
      <circle cx="7.5" cy="17" r="1.5" />
      <circle cx="16.5" cy="17" r="1.5" />
    </svg>
  ),
  Wrench: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinejoin="round" />
    </svg>
  ),
  Camera: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  ),
  Loader: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 animate-spin">
      <circle cx="12" cy="12" r="10" opacity="0.2" />
      <path d="M12 2a10 10 0 019.17 6" strokeLinecap="round" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  Alert: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
    </svg>
  ),
  Fuel: ({ level = 50 }) => {
    const h = (14 * level) / 100;
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <rect x="4" y="6" width="12" height="14" rx="2" />
        {level > 0 && <rect x="6" y={6 + (14 - h)} width="8" height={h} rx="1" fill="currentColor" opacity="0.4" />}
        <path d="M16 10h2a2 2 0 012 2v2a2 2 0 01-2 2h-2" strokeLinecap="round" />
      </svg>

  },
  Gauge: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M12 2a10 10 0 00-7.07 17.07" strokeLinecap="round" />
      <path d="M12 2a10 10 0 017.07 17.07" strokeLinecap="round" />
      <path d="M12 12l3-5" strokeLinecap="round" strokeWidth="2" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
};

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURAÇÃO
// ═══════════════════════════════════════════════════════════════════════════
const STEPS = [
  { id: 1, key: 'client', label: 'Cliente', icon: Icons.User },
  { id: 2, key: 'vehicle', label: 'Veículo', icon: Icons.Car },
  { id: 3, key: 'service', label: 'Serviço', icon: Icons.Wrench },
  { id: 4, key: 'photos', label: 'Fotos', icon: Icons.Camera },
];

const FUEL_LEVELS = [
  { value: 'empty', label: 'Vazio', percent: 0 },
  { value: '1/4', label: '1/4', percent: 25 },
  { value: '1/2', label: '1/2', percent: 50 },
  { value: '3/4', label: '3/4', percent: 75 },
  { value: 'full', label: 'Cheio', percent: 100 },
];

const CONDITIONS = [
  { id: 'good', label: 'Bom estado', positive: true },
  { id: 'scratches', label: 'Arranhões' },
  { id: 'dents', label: 'Amassados' },
  { id: 'broken', label: 'Peças quebradas' },
  { id: 'missing', label: 'Itens faltando' },
  { id: 'dirty', label: 'Sujo' },
];

const SERVICES = [
  'Troca de Óleo', 'Alinhamento', 'Balanceamento', 'Freios',
  'Suspensão', 'Motor', 'Elétrica', 'Ar Condicionado',
  'Revisão Completa', 'Diagnóstico', 'Embreagem', 'Câmbio',
];

const PRIORITIES = [
  { value: 'low', label: 'Baixa', color: '#64748b' },
  { value: 'normal', label: 'Normal', color: '#3b82f6' },
  { value: 'high', label: 'Alta', color: '#f97316' },
  { value: 'urgent', label: 'Urgente', color: '#ef4444' },
];

const COLORED_LOGOS = ['bmw', 'fiat', 'ferrari', 'lamborghini', 'land rover', 'chevrolet', 'ford', 'renault', 'mini', 'dodge', 'ram', 'volvo', 'porsche', 'chery', 'jac'];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════
const ModalCheckinPremium = ({ isOpen, onClose, onSuccess }) => {
  const { updateClient, clients } = useClientStore();
  const empresaContext = useEmpresa();
  const empresaId = empresaContext?.empresaId || sessionStorage.getItem('empresaId');

  // ─────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchingPlate, setSearchingPlate] = useState(false);
  const [plateNotFound, setPlateNotFound] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [showNovoCliente, setShowNovoCliente] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [form, setForm] = useState({
    clientName: '', clientPhone: '', clientEmail: '', clientId: '',
    plate: '', brand: '', model: '', year: '', color: '', km: '',
    fuel: '1/2', conditions: ['good'],
    services: [], notes: '', internalNotes: '', priority: 'normal',
    photos: [],
  });

  // ─────────────────────────────────────────────────────────────────────────
  // BRAND THEME
  // ─────────────────────────────────────────────────────────────────────────
  const effectiveBrand = useMemo(() => getEffectiveBrand(form.brand, form.model), [form.brand, form.model]);
  const brandStyles = useMemo(() => getBrandModalStyles(effectiveBrand || 'default'), [effectiveBrand]);
  const logoUrl = useMemo(() => getBrandLogoUrl(effectiveBrand, form.model, false), [effectiveBrand, form.model]);
  const isColoredLogo = COLORED_LOGOS.includes(effectiveBrand?.toLowerCase());
  const hasBrand = vehicleFound && !!effectiveBrand;

  // ─────────────────────────────────────────────────────────────────────────
  // EFFECTS
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedClient(null);
      setPlateNotFound(false);
      setVehicleFound(false);
      setForm({
        clientName: '', clientPhone: '', clientEmail: '', clientId: '',
        plate: '', brand: '', model: '', year: '', color: '', km: '',
        fuel: '1/2', conditions: ['good'],
        services: [], notes: '', internalNotes: '', priority: 'normal',
        photos: [],
      });
    }
  }, [isOpen]);

  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────
  const updateForm = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleClientSelect = useCallback((client) => {
    if (!client) {
      setSelectedClient(null);
      setForm(prev => ({ ...prev, clientName: '', clientPhone: '', clientEmail: '', clientId: '' }));
      return;
    }
    if (client.isNew) {
      setShowNovoCliente(true);
      return;
    }
    setSelectedClient(client);
    setForm(prev => ({
      ...prev,
      clientName: client.name || '',
      clientPhone: client.phone || '',
      clientEmail: client.email || '',
      clientId: client.firestoreId || client.id || '',
      plate: '', brand: '', model: '', year: '', color: ''
    }));
    setVehicleFound(false);
  }, []);

  const handleSearchPlate = useCallback(async () => {
    const plate = form.plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (!isValidPlate(plate)) {
      toast.error('Placa inválida');
      return;
    }
    setSearchingPlate(true);
    setPlateNotFound(false);
    try {
      const result = await consultarPlaca(plate);
      if (result.success && result.data && (result.data.brand || result.data.model)) {
        setForm(prev => ({
          ...prev,
          plate,
          brand: result.data.brand || prev.brand,
          model: result.data.model || prev.model,
          year: result.data.year || prev.year,
          color: result.data.color || prev.color,
        }));
        setVehicleFound(true);
        toast.success('Veículo encontrado!');
      } else {
        setPlateNotFound(true);
        setVehicleFound(false);
      }
    } catch {
      setPlateNotFound(true);
      setVehicleFound(false);
    } finally {
      setSearchingPlate(false);
    }
  }, [form.plate]);

  const toggleService = useCallback((name) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(name)
        ? prev.services.filter(s => s !== name)
        : [...prev.services, name]
    }));
  }, []);

  const toggleCondition = useCallback((id) => {
    setForm(prev => {
      if (id === 'good') return { ...prev, conditions: ['good'] };
      const without = prev.conditions.filter(c => c !== 'good');
      if (prev.conditions.includes(id)) {
        const next = without.filter(c => c !== id);
        return { ...prev, conditions: next.length ? next : ['good'] };
      }
      return { ...prev, conditions: [...without, id] };
    });
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // VALIDATION
  // ─────────────────────────────────────────────────────────────────────────
  const isStepValid = useCallback((s) => {
    switch (s) {
      case 1: return !!form.clientName.trim();
      case 2: return form.plate.length >= 7;
      case 3: return form.services.length > 0;
      case 4: return true;
      default: return false;
    }
  }, [form]);

  const canProceed = isStepValid(step);

  // ─────────────────────────────────────────────────────────────────────────
  // SUBMIT
  // ─────────────────────────────────────────────────────────────────────────
  const checkActiveCheckin = useCallback(async (plate) => {
    if (!plate || !empresaId) return null;
    try {
      const q = query(
        collection(db, 'checkins'),
        where('empresaId', '==', empresaId),
        where('vehiclePlate', '==', plate.toUpperCase()),
        where('status', '==', 'in-progress')

      const snap = await getDocs(q);
      return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
    } catch {
      return null;
    }
  }, [empresaId]);

  const linkVehicleToClient = useCallback(async (clientId, vehicle) => {
    if (!clientId) return false;
    try {
      const client = clients.find(c => c.id === clientId || c.firestoreId === clientId);
      if (!client) return false;
      const existing = client.vehicles || [];
      if (existing.some(v => v.plate?.toUpperCase() === vehicle.plate?.toUpperCase())) return false;
      const newVehicle = {
        id: Date.now().toString(),
        plate: vehicle.plate?.toUpperCase() || '',
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        year: vehicle.year || '',
        color: vehicle.color || '',
        addedAt: new Date().toISOString(),
      };
      await updateClient(clientId, { vehicles: [...existing, newVehicle] });
      return true;
    } catch {
      return false;
    }
  }, [clients, updateClient]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const active = await checkActiveCheckin(form.plate);
      if (active) {
        toast.error('Este veículo já possui check-in ativo');
        setLoading(false);
        return;
      }

      const data = {
        clientName: form.clientName,
        clientPhone: form.clientPhone,
        clientEmail: form.clientEmail,
        clientId: form.clientId,
        vehiclePlate: form.plate.toUpperCase(),
        vehicleBrand: form.brand,
        vehicleModel: form.model,
        vehicleYear: form.year,
        vehicleColor: form.color,
        mileage: form.km,
        fuelLevel: form.fuel,
        vehicleConditions: form.conditions,
        services: form.services,
        notes: form.notes,
        internalNotes: form.internalNotes,
        priority: form.priority,
        photos: form.photos.map(p => ({ name: p.name, preview: p.preview, damageAnalysis: p.damageAnalysis })),
      };

      await createCheckin(data, empresaId || null);

      if (form.clientId && form.plate) {
        await linkVehicleToClient(form.clientId, {
          plate: form.plate,
          brand: form.brand,
          model: form.model,
          year: form.year,
          color: form.color,
        });
      }

      toast.success('Check-in criado!');
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao criar check-in');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === 2 && canProceed) {
      setLoading(true);
      const active = await checkActiveCheckin(form.plate);
      setLoading(false);
      if (active) {
        toast.error('Este veículo já possui check-in ativo');
        return;
      }
    }
    if (step < 4 && canProceed) setStep(s => s + 1);
    else if (step === 4) handleSubmit();
  };

  const handleBack = () => step > 1 && setStep(s => s - 1);

  // ─────────────────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────────────────
  const formatPhoneLocal = (v) => {
    const n = v.replace(/\D/g, '');
    if (n.length <= 11) return n.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    return v;
  };

  if (!isOpen) return null;

  // Estilos inline para inputs (força dark theme)
  const inputStyles = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
  };

