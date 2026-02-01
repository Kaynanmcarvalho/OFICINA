/**
 * TORQ Modal Checkout Premium - Brand Identity Design
 * Serviços e produtos carregados do orçamento aprovado
 * Design cinematográfico premium sem elementos genéricos
 * Janeiro 2026
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import toast from 'react-hot-toast';
import UploaderFotos from './UploaderFotos';
import { checkoutCheckin } from '../../../services/checkinService';
import { useBudgetStore } from '../../../store/budgetStore';
import { getBrandLogoUrl, getEffectiveBrand, formatVehicleDisplay } from '../../../utils/vehicleBrandLogos';
import { getBrandModalStyles } from '../../../utils/brandModalTheme';
import '../../../styles/brand-modal.css';

// ============================================================================
// PREMIUM SVG ICON SYSTEM - Exclusivos e Refinados
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
  // Ícone de serviços - chave inglesa premium
  Services: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinejoin="round" />
    </svg>
  ),
  // Ícone de peças - engrenagem refinada
  Parts: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2m0 18v2m11-11h-2M3 12H1m18.07-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41m12.73 0l-1.41-1.41M6.34 6.34L4.93 4.93" strokeLinecap="round" />
    </svg>
  ),
  // Ícone de pagamento - carteira premium
  Payment: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <path d="M2 10h20" strokeLinecap="round" />
      <circle cx="17" cy="14" r="2" />
      <path d="M6 14h4" strokeLinecap="round" />
    </svg>
  ),
  // Ícone de finalização - bandeira checkered
  Finish: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" strokeLinejoin="round" />
      <path d="M4 22v-7" strokeLinecap="round" />
      <path d="M4 7h4v4H4zM12 3h4v4h-4zM12 11h4v4h-4z" fill="currentColor" opacity="0.2" />
    </svg>
  ),
  // Dinheiro - notas
  Cash: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 12h.01M18 12h.01" strokeLinecap="round" strokeWidth="2" />
    </svg>
  ),
  // PIX - raio instantâneo
  Pix: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinejoin="round" />
    </svg>
  ),
  // Cartão de crédito
  CreditCard: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" strokeLinecap="round" />
      <path d="M6 15h4M14 15h4" strokeLinecap="round" />
    </svg>
  ),
  // Cartão de débito
  DebitCard: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" strokeLinecap="round" />
      <path d="M6 15h2" strokeLinecap="round" />
      <circle cx="17" cy="15" r="1.5" />
    </svg>
  ),
  // Transferência bancária
  BankTransfer: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21h18M3 10h18M5 6l7-3 7 3" strokeLinejoin="round" />
      <path d="M5 10v11M9 10v11M15 10v11M19 10v11" strokeLinecap="round" />
    </svg>
  ),
  // Loader
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
  Plus: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  Trash: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // Câmera premium
  Camera: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="4" />
      <circle cx="12" cy="13" r="1.5" fill="currentColor" />
    </svg>
  ),
  // Relógio
  Clock: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // Escudo garantia
  Shield: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // Calendário
  Calendar: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
      <circle cx="8" cy="15" r="1" fill="currentColor" />
      <circle cx="12" cy="15" r="1" fill="currentColor" />
      <circle cx="16" cy="15" r="1" fill="currentColor" />
    </svg>
  ),
  // Notas/documento
  Notes: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" strokeLinejoin="round" />
      <path d="M14 2v6h6M8 13h8M8 17h5" strokeLinecap="round" />
    </svg>
  ),
  // Cliente/usuário
  Client: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
    </svg>
  ),
  // Veículo esportivo
  Vehicle: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 14h18v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3z" strokeLinejoin="round" />
      <path d="M3 14l2-5c.5-1.2 1.5-2 3-2h8c1.5 0 2.5.8 3 2l2 5" strokeLinejoin="round" />
      <circle cx="6.5" cy="17" r="1.5" fill="currentColor" />
      <circle cx="17.5" cy="17" r="1.5" fill="currentColor" />
    </svg>
  ),
  // Checkout/saída
  Checkout: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12H9" strokeLinecap="round" />
    </svg>
  ),
  // Estrela avaliação
  Star: ({ className = '', filled = false }) => (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinejoin="round" />
    </svg>
  ),
  // Orçamento/documento aprovado
  BudgetApproved: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v2M15 3v2" strokeLinecap="round" />
    </svg>
  ),
  // Cifrão
  Currency: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // Desconto/porcentagem
  Discount: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="9" cy="9" r="2" />
      <circle cx="15" cy="15" r="2" />
      <path d="M7.5 16.5l9-9" strokeLinecap="round" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  ),
  // Parcelas
  Installments: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M7 15h2M11 15h2M15 15h2" strokeLinecap="round" />
    </svg>
  ),
};

// ============================================================================
// CONFIGURATION
// ============================================================================
const STEPS = [
  { id: 1, key: 'items', title: 'Itens', icon: Icons.BudgetApproved, description: 'Serviços e peças' },
  { id: 2, key: 'payment', title: 'Pagamento', icon: Icons.Payment, description: 'Valores e forma' },
  { id: 3, key: 'finish', title: 'Finalização', icon: Icons.Finish, description: 'Entrega do veículo' }
];

const PAYMENT_METHODS = [
  { value: 'dinheiro', label: 'Dinheiro', icon: Icons.Cash, color: '#10B981' },
  { value: 'pix', label: 'PIX', icon: Icons.Pix, color: '#06B6D4' },
  { value: 'cartao_credito', label: 'Crédito', icon: Icons.CreditCard, color: '#8B5CF6' },
  { value: 'cartao_debito', label: 'Débito', icon: Icons.DebitCard, color: '#F59E0B' },
  { value: 'transferencia', label: 'Transferência', icon: Icons.BankTransfer, color: '#3B82F6' }
];

const COLORED_LOGO_BRANDS = ['bmw', 'fiat', 'ferrari', 'lamborghini', 'land rover', 'land-rover', 'chevrolet', 'ford', 'renault', 'mini', 'dodge', 'ram', 'volvo', 'porsche', 'chery', 'jac', 'jac motors', 'yamaha', 'mercedes', 'mercedes-benz'];
const SMALL_LOGO_BRANDS = ['byd', 'land rover', 'land-rover', 'chevrolet', 'toyota'];
const LARGE_LOGO_BRANDS = ['dodge', 'jac', 'jac motors', 'citroen', 'citroën', 'kia', 'ferrari', 'mitsubishi', 'jaguar', 'lamborghini', 'mclaren', 'bmw', 'peugeot', 'mini', 'volvo', 'yamaha', 'mercedes', 'mercedes-benz'];

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const ModalCheckoutPremium = ({ isOpen, onClose, onSuccess, checkinData }) => {
  const { budgets } = useBudgetStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [budgetData, setBudgetData] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Items do orçamento + adicionais
  const [budgetServices, setBudgetServices] = useState([]);
  const [budgetParts, setBudgetParts] = useState([]);
  const [additionalServices, setAdditionalServices] = useState([]);
  const [additionalParts, setAdditionalParts] = useState([]);
  
  const [formData, setFormData] = useState({
    tempoGasto: '', garantia: '',
    valorServicos: 0, valorPecas: 0, desconto: '', valorTotal: 0,
    metodoPagamento: '', parcelas: '1',
    observacoes: '', recomendacoes: '', proximaRevisao: '',
    fotos: [], avaliacaoCliente: 0
  });

  // Brand theme
  const effectiveBrand = useMemo(() => getEffectiveBrand(checkinData?.vehicleBrand, checkinData?.vehicleModel), [checkinData?.vehicleBrand, checkinData?.vehicleModel]);
  const brandStyles = useMemo(() => getBrandModalStyles(effectiveBrand || 'default'), [effectiveBrand]);
  const logoUrl = useMemo(() => getBrandLogoUrl(effectiveBrand, checkinData?.vehicleModel, false), [effectiveBrand, checkinData?.vehicleModel]);
  
  const isColoredLogo = COLORED_LOGO_BRANDS.includes(effectiveBrand?.toLowerCase());
  const isSmallLogo = SMALL_LOGO_BRANDS.includes(effectiveBrand?.toLowerCase());
  const isLargeLogo = LARGE_LOGO_BRANDS.includes(effectiveBrand?.toLowerCase());

  // Load approved budget
  const loadApprovedBudget = useCallback(() => {
    try {
      const approvedBudget = budgets.find(budget => 
        budget.status === 'approved' && 
        (budget.checkinId === checkinData?.id || budget.checkinId === checkinData?.firestoreId || budget.vehiclePlate === checkinData?.plate)
      );

      if (approvedBudget?.items) {
        setBudgetData(approvedBudget);
        const services = [], parts = [];
        let valorServicos = 0, valorPecas = 0;
        
        approvedBudget.items.forEach(item => {
          const itemTotal = parseFloat(item.price || 0) * parseInt(item.quantity || 1);
          if (item.type === 'service') {
            services.push({ id: item.id || Date.now(), name: item.name || item.description, quantity: item.quantity || 1, price: parseFloat(item.price || 0), total: itemTotal });
            valorServicos += itemTotal;
          } else if (item.type === 'product') {
            parts.push({ id: item.id || Date.now(), name: item.name || item.description, quantity: item.quantity || 1, price: parseFloat(item.price || 0), total: itemTotal });
            valorPecas += itemTotal;
          }
        });
        
        setBudgetServices(services);
        setBudgetParts(parts);
        const desconto = parseFloat(approvedBudget.discount || 0);
        setFormData(prev => ({ ...prev, valorServicos, valorPecas, desconto: desconto.toFixed(2), valorTotal: valorServicos + valorPecas - desconto }));
        toast.success('Orçamento aprovado carregado', { icon: '✓', duration: 2000 });
      }
    } catch (error) { console.error('Erro ao carregar orçamento:', error); }
  }, [budgets, checkinData]);

  useEffect(() => { if (isOpen && checkinData) loadApprovedBudget(); }, [isOpen, checkinData, loadApprovedBudget]);
  
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setBudgetData(null);
      setBudgetServices([]);
      setBudgetParts([]);
      setAdditionalServices([]);
      setAdditionalParts([]);
      setFormData({ tempoGasto: '', garantia: '', valorServicos: 0, valorPecas: 0, desconto: '', valorTotal: 0, metodoPagamento: '', parcelas: '1', observacoes: '', recomendacoes: '', proximaRevisao: '', fotos: [], avaliacaoCliente: 0 });
      setErrors({});
    }
  }, [isOpen]);

  // Recalcular totais
  useEffect(() => {
    const servicos = [...budgetServices, ...additionalServices].reduce((acc, s) => acc + (s.total || 0), 0);
    const pecas = [...budgetParts, ...additionalParts].reduce((acc, p) => acc + (p.total || 0), 0);
    const desconto = parseFloat(formData.desconto) || 0;
    setFormData(prev => ({ ...prev, valorServicos: servicos, valorPecas: pecas, valorTotal: servicos + pecas - desconto }));
  }, [budgetServices, budgetParts, additionalServices, additionalParts, formData.desconto]);

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 2 && !formData.metodoPagamento) newErrors.metodoPagamento = 'Selecione o método de pagamento';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateStep(currentStep)) setCurrentStep(prev => Math.min(prev + 1, STEPS.length)); else toast.error('Preencha os campos obrigatórios'); };
  const handlePrevious = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // Adicionar item extra
  const addAdditionalService = () => setAdditionalServices(prev => [...prev, { id: Date.now(), name: '', quantity: 1, price: 0, total: 0 }]);
  const addAdditionalPart = () => setAdditionalParts(prev => [...prev, { id: Date.now(), name: '', quantity: 1, price: 0, total: 0 }]);
  
  const updateAdditionalItem = (type, id, field, value) => {
    const setter = type === 'service' ? setAdditionalServices : setAdditionalParts;
    setter(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === 'quantity' || field === 'price') {
        updated.total = (parseFloat(updated.price) || 0) * (parseInt(updated.quantity) || 1);
      }
      return updated;
    }));
  };
  
  const removeAdditionalItem = (type, id) => {
    const setter = type === 'service' ? setAdditionalServices : setAdditionalParts;
    setter(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) { toast.error('Preencha os campos obrigatórios'); return; }
    setIsSubmitting(true);
    try {
      const allServices = [...budgetServices, ...additionalServices].map(s => s.name).join(', ');
      const allParts = [...budgetParts, ...additionalParts];
      
      const checkoutData = {
        servicesPerformed: allServices,
        timeSpent: formData.tempoGasto,
        warranty: formData.garantia,
        partsUsed: allParts.map(p => ({ nome: p.name, quantidade: String(p.quantity), valor: p.price.toFixed(2) })),
        servicesCost: formData.valorServicos,
        partsCost: formData.valorPecas,
        discount: parseFloat(formData.desconto) || 0,
        totalCost: formData.valorTotal,
        paymentMethod: formData.metodoPagamento,
        installments: parseInt(formData.parcelas),
        checkoutObservations: formData.observacoes,
        recommendations: formData.recomendacoes,
        nextMaintenance: formData.proximaRevisao,
        customerRating: formData.avaliacaoCliente
      };
      const photoFiles = formData.fotos.map(f => f.file);
      const updatedCheckin = await checkoutCheckin(checkinData.id, checkoutData, photoFiles);
      toast.success('Check-out realizado com sucesso!');
      onSuccess(updatedCheckin);
      onClose();
    } catch (error) {
      console.error('Erro ao realizar check-out:', error);
      toast.error(error.message || 'Erro ao realizar check-out');
    } finally { setIsSubmitting(false); }
  };

  if (!isOpen || !checkinData) return null;

  const totalServicos = formData.valorServicos;
  const totalPecas = formData.valorPecas;
  const totalFinal = formData.valorTotal;

  // ============================================================================
  // RENDER
  // ============================================================================
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90"
          style={brandStyles}
          onClick={onClose}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)' }} />
          
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 35, stiffness: 400 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col"
            style={{ background: 'var(--brand-modal-bg)', boxShadow: '0 0 0 1px var(--brand-border), 0 25px 50px -12px rgba(0,0,0,0.8), 0 0 120px var(--brand-glow), inset 0 1px 0 rgba(255,255,255,0.05)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, var(--brand-accent) 0%, transparent 60%)', opacity: 0.5 }} />

            {/* ===== HEADER ===== */}
            <div className="px-7 pt-6 pb-4 flex-shrink-0 relative" style={{ background: 'var(--brand-header-bg)', borderBottom: '1px solid var(--brand-border)' }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)' }} />
              
              <div className="flex items-center justify-between mb-5 relative">
                <div className="flex items-center gap-5">
                  {logoUrl ? (
                    <img src={logoUrl} alt={effectiveBrand} className={`${isSmallLogo ? 'h-10' : isLargeLogo ? 'h-[70px]' : 'h-14'} w-auto object-contain`}
                      style={{ maxWidth: isSmallLogo ? '100px' : isLargeLogo ? '200px' : '160px', filter: isColoredLogo ? 'none' : 'brightness(0) invert(1)' }} />
                  ) : (
                    <span className="text-3xl font-bold tracking-tight" style={{ color: '#FFFFFF' }}>{(effectiveBrand || 'V').toUpperCase()}</span>
                  )}
                  <div className="h-10 w-px" style={{ background: 'var(--brand-border)' }} />
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--brand-text)' }}>Finalizar Check-out</h2>
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
                        <Icons.Checkout className="w-3 h-3" />Entrega
                      </span>
                    </div>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>
                      {checkinData?.clientName} • {checkinData?.plate || checkinData?.vehiclePlate}
                    </p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2.5 rounded-xl transition-all duration-200 hover:opacity-80" style={{ background: 'var(--brand-card-bg)', border: '1px solid var(--brand-border)', color: 'var(--brand-text)' }}>
                  <Icons.Close className="w-[18px] h-[18px]" />
                </button>
              </div>

              {/* Steps Progress */}
              <div className="relative">
                <div className="absolute top-5 left-0 right-0 h-0.5" style={{ background: 'var(--brand-border)' }} />
                <motion.div className="absolute top-5 left-0 h-0.5" initial={{ width: 0 }} animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }} transition={{ duration: 0.4 }} style={{ background: 'var(--brand-accent)' }} />
                <div className="relative flex justify-between">
                  {STEPS.map((step) => {
                    const Icon = step.icon;
                    const isComplete = currentStep > step.id;
                    const isCurrent = currentStep === step.id;
                    return (
                      <div key={step.id} className="flex flex-col items-center" style={{ width: `${100/STEPS.length}%` }}>
                        <motion.div whileTap={{ scale: 0.95 }} onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer"
                          style={{ background: isComplete ? 'var(--brand-accent)' : isCurrent ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)', borderColor: isComplete || isCurrent ? 'var(--brand-accent)' : 'rgba(255,255,255,0.1)', color: isComplete ? '#FFFFFF' : isCurrent ? 'var(--brand-accent)' : 'rgba(255,255,255,0.4)' }}>
                          {isComplete ? <Icons.Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                        </motion.div>
                        <span className="text-[11px] font-medium mt-2 text-center" style={{ color: isComplete || isCurrent ? 'var(--brand-text)' : 'var(--brand-text-muted)' }}>{step.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ===== CONTENT ===== */}
            <div className="flex-1 overflow-y-auto p-6 relative" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.4) 100%)' }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)' }} />
              
              <AnimatePresence mode="wait">
                {/* STEP 1: ITENS DO ORÇAMENTO */}
                {currentStep === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5 relative">
                    
                    {/* Badge orçamento */}
                    {budgetData && (
                      <div className="p-4 rounded-xl flex items-center gap-4" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.03) 100%)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                          <Icons.BudgetApproved className="w-6 h-6" style={{ color: '#10B981' }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Orçamento #{budgetData.id?.slice(-6) || 'N/A'}</p>
                          <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>Aprovado • {budgetServices.length} serviço(s) • {budgetParts.length} peça(s)</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold" style={{ color: '#10B981' }}>R$ {(totalServicos + totalPecas).toFixed(2)}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Serviços do orçamento */}
                    <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--brand-border)' }}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Icons.Services className="w-5 h-5" style={{ color: 'var(--brand-accent)' }} />
                          <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Serviços</span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--brand-card-bg)', color: 'var(--brand-text-muted)' }}>{budgetServices.length + additionalServices.length}</span>
                        </div>
                        <span className="text-sm font-semibold" style={{ color: 'var(--brand-accent)' }}>R$ {totalServicos.toFixed(2)}</span>
                      </div>
                      
                      {budgetServices.length > 0 ? (
                        <div className="space-y-2 mb-4">
                          {budgetServices.map((service, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                  <Icons.Services className="w-4 h-4" style={{ color: 'var(--brand-text-muted)' }} />
                                </div>
                                <div>
                                  <p className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>{service.name}</p>
                                  <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>Qtd: {service.quantity}</p>
                                </div>
                              </div>
                              <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>R$ {service.total.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-center py-4" style={{ color: 'var(--brand-text-muted)' }}>Nenhum serviço no orçamento</p>
                      )}
                      
                      {/* Serviços adicionais */}
                      {additionalServices.length > 0 && (
                        <div className="space-y-2 mb-4 pt-3" style={{ borderTop: '1px dashed var(--brand-border)' }}>
                          <p className="text-xs font-medium mb-2" style={{ color: 'var(--brand-text-muted)' }}>Serviços adicionais</p>
                          {additionalServices.map((service) => (
                            <div key={service.id} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                              <input type="text" value={service.name} onChange={e => updateAdditionalItem('service', service.id, 'name', e.target.value)} placeholder="Nome do serviço"
                                className="flex-1 px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--brand-border)', color: 'var(--brand-text)' }} />
                              <input type="number" value={service.price} onChange={e => updateAdditionalItem('service', service.id, 'price', parseFloat(e.target.value) || 0)} placeholder="Valor"
                                className="w-24 px-3 py-2 rounded-lg text-sm text-right outline-none" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--brand-border)', color: 'var(--brand-text)' }} />
                              <button onClick={() => removeAdditionalItem('service', service.id)} className="p-2 rounded-lg hover:opacity-70" style={{ color: '#EF4444' }}>
                                <Icons.Trash className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <motion.button onClick={addAdditionalService} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-all"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--brand-border)', color: 'var(--brand-text-muted)' }}>
                        <Icons.Plus className="w-4 h-4" />Adicionar serviço extra
                      </motion.button>
                    </div>
                    
                    {/* Peças do orçamento */}
                    <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--brand-border)' }}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Icons.Parts className="w-5 h-5" style={{ color: 'var(--brand-accent)' }} />
                          <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Peças</span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--brand-card-bg)', color: 'var(--brand-text-muted)' }}>{budgetParts.length + additionalParts.length}</span>
                        </div>
                        <span className="text-sm font-semibold" style={{ color: 'var(--brand-accent)' }}>R$ {totalPecas.toFixed(2)}</span>
                      </div>
                      
                      {budgetParts.length > 0 ? (
                        <div className="space-y-2 mb-4">
                          {budgetParts.map((part, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                  <Icons.Parts className="w-4 h-4" style={{ color: 'var(--brand-text-muted)' }} />
                                </div>
                                <div>
                                  <p className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>{part.name}</p>
                                  <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>Qtd: {part.quantity}</p>
                                </div>
                              </div>
                              <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>R$ {part.total.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-center py-4" style={{ color: 'var(--brand-text-muted)' }}>Nenhuma peça no orçamento</p>
                      )}
                      
                      {/* Peças adicionais */}
                      {additionalParts.length > 0 && (
                        <div className="space-y-2 mb-4 pt-3" style={{ borderTop: '1px dashed var(--brand-border)' }}>
                          <p className="text-xs font-medium mb-2" style={{ color: 'var(--brand-text-muted)' }}>Peças adicionais</p>
                          {additionalParts.map((part) => (
                            <div key={part.id} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                              <input type="text" value={part.name} onChange={e => updateAdditionalItem('part', part.id, 'name', e.target.value)} placeholder="Nome da peça"
                                className="flex-1 px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--brand-border)', color: 'var(--brand-text)' }} />
                              <input type="number" value={part.quantity} onChange={e => updateAdditionalItem('part', part.id, 'quantity', parseInt(e.target.value) || 1)} placeholder="Qtd"
                                className="w-16 px-3 py-2 rounded-lg text-sm text-center outline-none" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--brand-border)', color: 'var(--brand-text)' }} />
                              <input type="number" value={part.price} onChange={e => updateAdditionalItem('part', part.id, 'price', parseFloat(e.target.value) || 0)} placeholder="Valor"
                                className="w-24 px-3 py-2 rounded-lg text-sm text-right outline-none" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--brand-border)', color: 'var(--brand-text)' }} />
                              <button onClick={() => removeAdditionalItem('part', part.id)} className="p-2 rounded-lg hover:opacity-70" style={{ color: '#EF4444' }}>
                                <Icons.Trash className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <motion.button onClick={addAdditionalPart} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-all"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--brand-border)', color: 'var(--brand-text-muted)' }}>
                        <Icons.Plus className="w-4 h-4" />Adicionar peça extra
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: PAGAMENTO - Design Premium */}
                {currentStep === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5 relative">
                    
                    {/* Resumo financeiro premium */}
                    <div className="p-6 rounded-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid var(--brand-border)' }}>
                      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: 'var(--brand-accent)', filter: 'blur(40px)' }} />
                      
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <Icons.Currency className="w-5 h-5" style={{ color: 'var(--brand-accent)' }} />
                        </div>
                        <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-text-muted)' }}>Resumo Financeiro</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2">
                            <Icons.Services className="w-4 h-4" style={{ color: 'var(--brand-text-muted)' }} />
                            <span className="text-sm" style={{ color: 'var(--brand-text-muted)' }}>Serviços</span>
                          </div>
                          <span className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>R$ {totalServicos.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2">
                            <Icons.Parts className="w-4 h-4" style={{ color: 'var(--brand-text-muted)' }} />
                            <span className="text-sm" style={{ color: 'var(--brand-text-muted)' }}>Peças</span>
                          </div>
                          <span className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>R$ {totalPecas.toFixed(2)}</span>
                        </div>
                        
                        <div className="h-px" style={{ background: 'var(--brand-border)' }} />
                        
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2">
                            <Icons.Discount className="w-4 h-4" style={{ color: '#EF4444' }} />
                            <span className="text-sm" style={{ color: 'var(--brand-text-muted)' }}>Desconto</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>R$</span>
                            <input type="text" value={formData.desconto} onChange={e => setFormData(prev => ({ ...prev, desconto: e.target.value.replace(/[^0-9.]/g, '') }))}
                              className="w-20 px-2 py-1 rounded-lg text-sm text-right outline-none" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--brand-border)', color: '#EF4444' }} />
                          </div>
                        </div>
                        
                        <div className="h-px" style={{ background: 'var(--brand-border)' }} />
                        
                        <div className="flex items-center justify-between py-3">
                          <span className="text-base font-semibold" style={{ color: 'var(--brand-text)' }}>Total</span>
                          <span className="text-2xl font-bold" style={{ color: '#10B981' }}>R$ {totalFinal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Método de pagamento */}
                    <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${errors.metodoPagamento ? '#EF4444' : 'var(--brand-border)'}` }}>
                      <div className="flex items-center gap-2 mb-4">
                        <Icons.Payment className="w-5 h-5" style={{ color: 'var(--brand-accent)' }} />
                        <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Forma de Pagamento</span>
                      </div>
                      <div className="grid grid-cols-5 gap-3">
                        {PAYMENT_METHODS.map(method => {
                          const Icon = method.icon;
                          const isSelected = formData.metodoPagamento === method.value;
                          return (
                            <motion.button key={method.value} onClick={() => { setFormData(prev => ({ ...prev, metodoPagamento: method.value })); setErrors(prev => ({ ...prev, metodoPagamento: null })); }}
                              whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                              className="relative p-4 rounded-xl text-center transition-all overflow-hidden"
                              style={{ background: isSelected ? `linear-gradient(135deg, ${method.color}20 0%, ${method.color}10 100%)` : 'rgba(0,0,0,0.2)', border: `2px solid ${isSelected ? method.color : 'transparent'}`, boxShadow: isSelected ? `0 4px 20px ${method.color}20` : 'none' }}>
                              {isSelected && <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: method.color }} />}
                              <div className="w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center" style={{ background: isSelected ? `${method.color}20` : 'rgba(255,255,255,0.05)' }}>
                                <Icon className="w-5 h-5" style={{ color: isSelected ? method.color : 'var(--brand-text-muted)' }} />
                              </div>
                              <span className="text-xs font-medium block" style={{ color: isSelected ? method.color : 'var(--brand-text-muted)' }}>{method.label}</span>
                            </motion.button>
                          );

                        })}
                      </div>
                      {errors.metodoPagamento && <p className="mt-3 text-xs font-medium" style={{ color: '#EF4444' }}>{errors.metodoPagamento}</p>}
                    </div>
                    
                    {/* Parcelas - só para crédito */}
                    {formData.metodoPagamento === 'cartao_credito' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--brand-border)' }}>
                        <div className="flex items-center gap-2 mb-4">
                          <Icons.Installments className="w-5 h-5" style={{ color: 'var(--brand-accent)' }} />
                          <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Parcelamento</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {[1, 2, 3, 4, 5, 6, 10, 12].map(n => {
                            const isSelected = formData.parcelas === String(n);
                            const valorParcela = (totalFinal / n).toFixed(2);
                            return (
                              <motion.button key={n} onClick={() => setFormData(prev => ({ ...prev, parcelas: String(n) }))} whileTap={{ scale: 0.95 }}
                                className="px-4 py-3 rounded-xl text-center transition-all"
                                style={{ background: isSelected ? 'var(--brand-accent)' : 'rgba(0,0,0,0.2)', border: `1px solid ${isSelected ? 'var(--brand-accent)' : 'var(--brand-border)'}` }}>
                                <span className="text-sm font-bold block" style={{ color: isSelected ? '#FFFFFF' : 'var(--brand-text)' }}>{n}x</span>
                                <span className="text-[10px] block mt-0.5" style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--brand-text-muted)' }}>R$ {valorParcela}</span>
                              </motion.button>
                          );

                          })}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* STEP 3: FINALIZAÇÃO - Design Premium */}
                {currentStep === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5 relative">
                    
                    {/* Card resumo do veículo */}
                    <div className="p-5 rounded-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(var(--brand-accent-rgb, 59, 130, 246), 0.08) 0%, rgba(var(--brand-accent-rgb, 59, 130, 246), 0.02) 100%)', border: '1px solid var(--brand-border)' }}>
                      <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10" style={{ background: 'var(--brand-accent)', filter: 'blur(50px)' }} />
                      
                      <div className="flex items-center gap-5 relative">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--brand-accent)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                          <Icons.Vehicle className="w-8 h-8" style={{ color: '#FFFFFF' }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-bold" style={{ color: 'var(--brand-text)' }}>{formatVehicleDisplay(checkinData?.vehicleBrand, checkinData?.vehicleModel)}</p>
                          <p className="text-sm" style={{ color: 'var(--brand-text-muted)' }}>{checkinData?.plate || checkinData?.vehiclePlate}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Icons.Client className="w-3.5 h-3.5" style={{ color: 'var(--brand-text-muted)' }} />
                            <span className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>{checkinData?.clientName}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--brand-text-muted)' }}>Total</p>
                          <p className="text-2xl font-bold" style={{ color: '#10B981' }}>R$ {totalFinal.toFixed(2)}</p>
                          <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>{PAYMENT_METHODS.find(m => m.value === formData.metodoPagamento)?.label}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Fotos de entrega */}
                    <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--brand-border)' }}>
                      <div className="flex items-center gap-2 mb-4">
                        <Icons.Camera className="w-5 h-5" style={{ color: 'var(--brand-accent)' }} />
                        <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Fotos de Entrega</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--brand-card-bg)', color: 'var(--brand-text-muted)' }}>Opcional</span>
                      </div>
                      <UploaderFotos fotos={formData.fotos} setFotos={(fotos) => setFormData(prev => ({ ...prev, fotos }))} maxFotos={6} />
                    </div>
                    
                    {/* Grid de campos */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Tempo e Garantia */}
                      <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--brand-border)' }}>
                        <div className="flex items-center gap-2 mb-3">
                          <Icons.Clock className="w-4 h-4" style={{ color: 'var(--brand-accent)' }} />
                          <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Tempo de Execução</span>
                        </div>
                        <input type="text" value={formData.tempoGasto} onChange={e => setFormData(prev => ({ ...prev, tempoGasto: e.target.value }))} placeholder="Ex: 4 horas"
                          className="w-full px-4 py-3 rounded-xl outline-none text-sm" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--brand-border)', color: 'var(--brand-text)' }} />
                      </div>
                      
                      <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--brand-border)' }}>
                        <div className="flex items-center gap-2 mb-3">
                          <Icons.Shield className="w-4 h-4" style={{ color: 'var(--brand-accent)' }} />
                          <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Garantia</span>
                        </div>
                        <input type="text" value={formData.garantia} onChange={e => setFormData(prev => ({ ...prev, garantia: e.target.value }))} placeholder="Ex: 90 dias"
                          className="w-full px-4 py-3 rounded-xl outline-none text-sm" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--brand-border)', color: 'var(--brand-text)' }} />
                      </div>
                    </div>
                    
                    {/* Observações e Recomendações */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--brand-border)' }}>
                        <div className="flex items-center gap-2 mb-3">
                          <Icons.Notes className="w-4 h-4" style={{ color: 'var(--brand-accent)' }} />
                          <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Observações</span>
                        </div>
                        <textarea value={formData.observacoes} onChange={e => setFormData(prev => ({ ...prev, observacoes: e.target.value }))} placeholder="Observações finais do serviço..." rows={3}
                          className="w-full px-4 py-3 rounded-xl outline-none resize-none text-sm" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--brand-border)', color: 'var(--brand-text)' }} />
                      </div>
                      
                      <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--brand-border)' }}>
                        <div className="flex items-center gap-2 mb-3">
                          <Icons.Shield className="w-4 h-4" style={{ color: 'var(--brand-accent)' }} />
                          <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Recomendações</span>
                        </div>
                        <textarea value={formData.recomendacoes} onChange={e => setFormData(prev => ({ ...prev, recomendacoes: e.target.value }))} placeholder="Recomendações para o cliente..." rows={3}
                          className="w-full px-4 py-3 rounded-xl outline-none resize-none text-sm" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--brand-border)', color: 'var(--brand-text)' }} />
                      </div>
                    </div>
                    
                    {/* Próxima revisão e Avaliação */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--brand-border)' }}>
                        <div className="flex items-center gap-2 mb-3">
                          <Icons.Calendar className="w-4 h-4" style={{ color: 'var(--brand-accent)' }} />
                          <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Próxima Revisão</span>
                        </div>
                        <input type="text" value={formData.proximaRevisao} onChange={e => setFormData(prev => ({ ...prev, proximaRevisao: e.target.value }))} placeholder="Ex: 6 meses ou 10.000 km"
                          className="w-full px-4 py-3 rounded-xl outline-none text-sm" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--brand-border)', color: 'var(--brand-text)' }} />
                      </div>
                      
                      <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--brand-border)' }}>
                        <div className="flex items-center gap-2 mb-3">
                          <Icons.Star className="w-4 h-4" style={{ color: 'var(--brand-accent)' }} />
                          <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Avaliação do Cliente</span>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <motion.button key={star} onClick={() => setFormData(prev => ({ ...prev, avaliacaoCliente: star }))} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                              className="p-1.5 rounded-lg transition-all">
                              <Icons.Star className="w-7 h-7" filled={formData.avaliacaoCliente >= star} style={{ color: formData.avaliacaoCliente >= star ? '#FBBF24' : 'var(--brand-text-muted)' }} />
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ===== FOOTER ===== */}
            <div className="px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ background: 'var(--brand-header-bg)', borderTop: '1px solid var(--brand-border)' }}>
              <div className="flex items-center gap-3">
                {currentStep > 1 && (
                  <motion.button onClick={handlePrevious} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                    style={{ background: 'var(--brand-card-bg)', border: '1px solid var(--brand-border)', color: 'var(--brand-text)' }}>
                    <Icons.ChevronLeft className="w-4 h-4" />Voltar
                  </motion.button>
                )}
                <span className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>Etapa {currentStep} de {STEPS.length}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium" style={{ background: 'var(--brand-card-bg)', border: '1px solid var(--brand-border)', color: 'var(--brand-text)' }}>
                  Cancelar
                </button>
                
                {currentStep < STEPS.length ? (
                  <motion.button onClick={handleNext} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: 'var(--brand-accent)', color: '#FFFFFF' }}>
                    Próximo<Icons.ChevronRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button onClick={handleSubmit} disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFFFFF', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
                    {isSubmitting ? <><Icons.Loader className="w-4 h-4" />Processando...</> : <><Icons.Check className="w-4 h-4" />Finalizar Check-out</>}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ModalCheckoutPremium;
