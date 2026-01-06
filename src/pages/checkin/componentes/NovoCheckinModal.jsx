/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TORQ — NOVO CHECK-IN MODAL (PREMIUM IMMERSIVE DESIGN)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Design: Apple VisionOS / macOS Sonoma
 * Inspirado no CheckinDetailsModal - mesmo padrão de qualidade
 * 
 * CARACTERÍSTICAS:
 * - Tema da marca DOMINA todo o modal após consulta de placa
 * - Logo branca/clara (exceto marcas com logos coloridas específicas)
 * - Linha de energia superior com cor da marca
 * - Vinheta atmosférica imersiva
 * - Superfícies elevadas premium
 * 
 * Janeiro 2026
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Stores & Context
import { useClientStore } from '../../../store/clientStore';
import { useEmpresa } from '../../../contexts/EmpresaContext';

// Services
import { consultarPlaca, isValidPlate } from '../../../services/vehicleApiService';
import { createCheckin } from '../../../services/checkinService';
import { getBrandLogoUrl, getEffectiveBrand, formatVehicleDisplay } from '../../../utils/vehicleBrandLogos';
import { getBrandModalStyles } from '../../../utils/brandModalTheme';

// Firebase
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';

// CSS Premium
import '../../../styles/brand-modal.css';

// ═══════════════════════════════════════════════════════════════════════════
// ICONS — SVG minimalistas Apple-style
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
  Fuel: ({ level = 50 }) => {
    const h = (14 * level) / 100;
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <rect x="4" y="6" width="12" height="14" rx="2" />
        {level > 0 && <rect x="6" y={6 + (14 - h)} width="8" height={h} rx="1" fill="currentColor" opacity="0.4" />}
        <path d="M16 10h2a2 2 0 012 2v2a2 2 0 01-2 2h-2" strokeLinecap="round" />
      </svg>
    );
  },
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

// Marcas que usam logo colorida (não aplicar filtro branco)
const COLORED_LOGO_BRANDS = [
  'bmw', 'fiat', 'ferrari', 'lamborghini', 'land rover', 'land-rover', 
  'chevrolet', 'ford', 'renault', 'mini', 'dodge', 'ram', 'volvo', 
  'porsche', 'chery', 'jac', 'jac motors', 'byd', 'yamaha'
];

// ═══════════════════════════════════════════════════════════════════════════
// ANIMAÇÕES
// ═══════════════════════════════════════════════════════════════════════════
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  visible: { 
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', damping: 35, stiffness: 400 }
  },
  exit: { opacity: 0, scale: 0.96, y: 20, transition: { duration: 0.2 } }
};

const contentVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.15 } }
};


// ═══════════════════════════════════════════════════════════════════════════
// STEP COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// STEP 1: CLIENTE
const StepCliente = ({ form, updateForm, clientSearch, setClientSearch, filteredClients, onClientSelect, brandStyles }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--brand-text, #fff)' }}>Dados do Cliente</h2>
      <p className="text-sm" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.5))' }}>Busque um cliente existente ou preencha manualmente</p>
    </div>

    {/* Busca de cliente */}
    <div className="relative">
      <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>Buscar Cliente</label>
      <div className="relative">
        <input
          type="text"
          value={clientSearch}
          onChange={(e) => setClientSearch(e.target.value)}
          placeholder="Digite nome, telefone ou email..."
          className="w-full pl-11 pr-4 py-3.5 rounded-xl outline-none transition-all"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.3))' }}><Icons.Search /></div>
      </div>

      {filteredClients.length > 0 && (
        <div className="absolute z-10 w-full mt-2 rounded-xl overflow-hidden" style={{ background: 'rgba(20,20,25,0.98)', border: '1px solid var(--brand-border, rgba(255,255,255,0.1))', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
          {filteredClients.map((client) => (
            <button key={client.id} onClick={() => onClientSelect(client)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.05] transition-colors">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium" style={{ background: 'var(--brand-accent, #3b82f6)', color: '#fff' }}>
                {client.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--brand-text, #fff)' }}>{client.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>{client.phone || client.email}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>

    {/* Campos do cliente */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>Nome Completo *</label>
        <input type="text" value={form.clientName} onChange={(e) => updateForm('clientName', e.target.value)} placeholder="Nome do cliente"
          className="w-full px-4 py-3.5 rounded-xl outline-none" />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>Telefone</label>
        <input type="tel" value={form.clientPhone} onChange={(e) => updateForm('clientPhone', e.target.value)} placeholder="(00) 00000-0000"
          className="w-full px-4 py-3.5 rounded-xl outline-none" />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>Email</label>
        <input type="email" value={form.clientEmail} onChange={(e) => updateForm('clientEmail', e.target.value)} placeholder="email@exemplo.com"
          className="w-full px-4 py-3.5 rounded-xl outline-none" />
      </div>
    </div>
  </div>
);

// STEP 2: VEÍCULO
const StepVeiculo = ({ form, updateForm, onSearchPlate, searchingPlate, vehicleFound, brandStyles }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--brand-text, #fff)' }}>Dados do Veículo</h2>
      <p className="text-sm" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.5))' }}>Digite a placa para buscar automaticamente</p>
    </div>

    {/* Busca por placa */}
    <div className="p-5 rounded-xl" style={{ background: vehicleFound ? 'var(--brand-surface-soft, rgba(255,255,255,0.03))' : 'rgba(255,255,255,0.02)', border: vehicleFound ? '1px solid var(--brand-accent, #3b82f6)' : '1px solid rgba(255,255,255,0.06)' }}>
      <label className="block text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>Placa do Veículo *</label>
      <div className="flex gap-3">
        <input type="text" value={form.plate} onChange={(e) => updateForm('plate', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} placeholder="ABC1D23" maxLength={7}
          className="flex-1 px-4 py-3.5 rounded-xl text-lg font-mono tracking-widest outline-none uppercase" />
        <button onClick={onSearchPlate} disabled={form.plate.length < 7 || searchingPlate}
          className="px-5 py-3.5 rounded-xl font-medium transition-all flex items-center gap-2"
          style={{ background: form.plate.length >= 7 ? 'var(--brand-accent, #3b82f6)' : 'rgba(255,255,255,0.05)', color: form.plate.length >= 7 ? '#fff' : 'rgba(255,255,255,0.3)' }}>
          {searchingPlate ? <Icons.Loader /> : <Icons.Search />}
          Buscar
        </button>
      </div>
      {vehicleFound && <div className="mt-3 flex items-center gap-2 text-sm" style={{ color: 'var(--brand-accent, #34C759)' }}><Icons.Check /> Veículo encontrado</div>}
    </div>

    {/* Dados do veículo */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="col-span-2">
        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>Marca</label>
        <input type="text" value={form.brand} onChange={(e) => updateForm('brand', e.target.value)} placeholder="Ex: Toyota"
          className="w-full px-4 py-3.5 rounded-xl outline-none" />
      </div>
      <div className="col-span-2">
        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>Modelo</label>
        <input type="text" value={form.model} onChange={(e) => updateForm('model', e.target.value)} placeholder="Ex: Corolla"
          className="w-full px-4 py-3.5 rounded-xl outline-none" />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>Ano</label>
        <input type="text" value={form.year} onChange={(e) => updateForm('year', e.target.value)} placeholder="2024" maxLength={4}
          className="w-full px-4 py-3.5 rounded-xl outline-none" />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>Cor</label>
        <input type="text" value={form.color} onChange={(e) => updateForm('color', e.target.value)} placeholder="Prata"
          className="w-full px-4 py-3.5 rounded-xl outline-none" />
      </div>
      <div className="col-span-2">
        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>Quilometragem</label>
        <input type="text" value={form.km} onChange={(e) => updateForm('km', e.target.value.replace(/\D/g, ''))} placeholder="Ex: 45000"
          className="w-full px-4 py-3.5 rounded-xl outline-none" />
      </div>
    </div>

    {/* Nível de combustível */}
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>Nível de Combustível</label>
      <div className="flex gap-2">
        {FUEL_LEVELS.map((level) => (
          <button key={level.value} onClick={() => updateForm('fuel', level.value)}
            className="flex-1 flex flex-col items-center gap-2 py-3 rounded-xl transition-all"
            style={{ background: form.fuel === level.value ? 'var(--brand-surface-soft, rgba(255,255,255,0.06))' : 'rgba(255,255,255,0.02)', border: form.fuel === level.value ? '1px solid var(--brand-accent, #3b82f6)' : '1px solid rgba(255,255,255,0.06)', color: form.fuel === level.value ? 'var(--brand-accent, #3b82f6)' : 'rgba(255,255,255,0.5)' }}>
            <Icons.Fuel level={level.percent} />
            <span className="text-xs font-medium">{level.label}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// STEP 3: SERVIÇO
const StepServico = ({ form, toggleService, toggleCondition, updateForm, brandStyles }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--brand-text, #fff)' }}>Serviços e Condições</h2>
      <p className="text-sm" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.5))' }}>Selecione os serviços e condições do veículo</p>
    </div>

    {/* Serviços */}
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>Serviços Solicitados *</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {SERVICES.map((service) => {
          const isSelected = form.services.includes(service);
          return (
            <button key={service} onClick={() => toggleService(service)}
              className="px-4 py-3 rounded-xl text-sm font-medium text-left transition-all"
              style={{ background: isSelected ? 'var(--brand-surface-soft, rgba(255,255,255,0.06))' : 'rgba(255,255,255,0.02)', border: isSelected ? '1px solid var(--brand-accent, #3b82f6)' : '1px solid rgba(255,255,255,0.06)', color: isSelected ? 'var(--brand-text, #fff)' : 'rgba(255,255,255,0.6)' }}>
              <span className="flex items-center gap-2">
                {isSelected && <span style={{ color: 'var(--brand-accent, #3b82f6)' }}><Icons.Check /></span>}
                {service}
              </span>
            </button>
          );
        })}
      </div>
      {form.services.length === 0 && <p className="mt-2 text-xs text-amber-400/70">Selecione pelo menos um serviço</p>}
    </div>

    {/* Condições */}
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>Condições do Veículo</label>
      <div className="flex flex-wrap gap-2">
        {CONDITIONS.map((condition) => {
          const isSelected = form.conditions.includes(condition.id);
          return (
            <button key={condition.id} onClick={() => toggleCondition(condition.id)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: isSelected ? (condition.positive ? 'rgba(52, 199, 89, 0.15)' : 'rgba(255, 149, 0, 0.15)') : 'rgba(255,255,255,0.02)',
                border: isSelected ? (condition.positive ? '1px solid rgba(52, 199, 89, 0.4)' : '1px solid rgba(255, 149, 0, 0.4)') : '1px solid rgba(255,255,255,0.06)',
                color: isSelected ? (condition.positive ? '#34C759' : '#FF9500') : 'rgba(255,255,255,0.5)' }}>
              {condition.label}
            </button>
          );
        })}
      </div>
    </div>

    {/* Prioridade */}
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>Prioridade</label>
      <div className="flex gap-2">
        {PRIORITIES.map((priority) => {
          const isSelected = form.priority === priority.value;
          return (
            <button key={priority.value} onClick={() => updateForm('priority', priority.value)}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{ background: isSelected ? `${priority.color}20` : 'rgba(255,255,255,0.02)', border: isSelected ? `1px solid ${priority.color}50` : '1px solid rgba(255,255,255,0.06)', color: isSelected ? priority.color : 'rgba(255,255,255,0.5)' }}>
              {priority.label}
            </button>
          );
        })}
      </div>
    </div>

    {/* Observações */}
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>Observações</label>
      <textarea value={form.notes} onChange={(e) => updateForm('notes', e.target.value)} placeholder="Observações adicionais..." rows={3}
        className="w-full px-4 py-3.5 rounded-xl outline-none resize-none" />
    </div>
  </div>
);

// STEP 4: FOTOS
const StepFotos = ({ form, updateForm, brandStyles }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = files.map(file => ({ file, name: file.name, preview: URL.createObjectURL(file) }));
    updateForm('photos', [...form.photos, ...newPhotos]);
  };

  const removePhoto = (index) => {
    updateForm('photos', form.photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--brand-text, #fff)' }}>Fotos do Veículo</h2>
        <p className="text-sm" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.5))' }}>Adicione fotos para documentar o estado atual (opcional)</p>
      </div>

      {/* Upload area */}
      <label className="block w-full p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-opacity-50 text-center"
        style={{ borderColor: 'var(--brand-accent, #3b82f6)', opacity: 0.6, background: 'rgba(255,255,255,0.02)' }}>
        <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'var(--brand-surface-soft, rgba(255,255,255,0.05))', color: 'var(--brand-accent, #3b82f6)' }}>
            <Icons.Camera />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--brand-text, rgba(255,255,255,0.8))' }}>Clique para adicionar fotos</p>
            <p className="text-xs mt-1" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>ou arraste e solte aqui</p>
          </div>
        </div>
      </label>

      {/* Preview das fotos */}
      {form.photos.length > 0 && (
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>Fotos Adicionadas ({form.photos.length})</label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {form.photos.map((photo, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                <img src={photo.preview} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                <button onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
                  <Icons.Close />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumo final */}
      <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--brand-text, rgba(255,255,255,0.8))' }}>Resumo do Check-in</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>Cliente</span><span style={{ color: 'var(--brand-text, rgba(255,255,255,0.8))' }}>{form.clientName || '-'}</span></div>
          <div className="flex justify-between"><span style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>Veículo</span><span style={{ color: 'var(--brand-text, rgba(255,255,255,0.8))' }}>{form.plate ? `${form.plate} - ${form.brand} ${form.model}` : '-'}</span></div>
          <div className="flex justify-between"><span style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>Serviços</span><span style={{ color: 'var(--brand-text, rgba(255,255,255,0.8))' }}>{form.services.length} selecionado(s)</span></div>
          <div className="flex justify-between"><span style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.4))' }}>Fotos</span><span style={{ color: 'var(--brand-text, rgba(255,255,255,0.8))' }}>{form.photos.length} foto(s)</span></div>
        </div>
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════
const NovoCheckinModal = ({ isOpen, onClose, onSuccess }) => {
  const { clients } = useClientStore();
  const empresaContext = useEmpresa();
  const empresaId = empresaContext?.empresaId || sessionStorage.getItem('empresaId');

  // STATE
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchingPlate, setSearchingPlate] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);

  const [form, setForm] = useState({
    clientName: '', clientPhone: '', clientEmail: '', clientId: '',
    plate: '', brand: '', model: '', year: '', color: '', km: '',
    fuel: '1/2', conditions: ['good'],
    services: [], notes: '', priority: 'normal',
    photos: [],
  });

  // BRAND THEME - Tema da marca domina o modal após consulta
  const effectiveBrand = useMemo(() => getEffectiveBrand(form.brand, form.model), [form.brand, form.model]);
  const brandStyles = useMemo(() => getBrandModalStyles(effectiveBrand || 'default'), [effectiveBrand]);
  // Logo clara/branca para fundo escuro (exceto marcas com logos coloridas)
  const logoUrl = useMemo(() => getBrandLogoUrl(effectiveBrand, form.model, true), [effectiveBrand, form.model]);
  const hasBrand = vehicleFound && !!effectiveBrand;
  
  // Verifica se a marca usa logo colorida
  const usesColoredLogo = useMemo(() => {
    if (!effectiveBrand) return false;
    return COLORED_LOGO_BRANDS.includes(effectiveBrand.toLowerCase());
  }, [effectiveBrand]);

  // RESET ao abrir
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setVehicleFound(false);
      setClientSearch('');
      setFilteredClients([]);
      setForm({
        clientName: '', clientPhone: '', clientEmail: '', clientId: '',
        plate: '', brand: '', model: '', year: '', color: '', km: '',
        fuel: '1/2', conditions: ['good'],
        services: [], notes: '', priority: 'normal',
        photos: [],
      });
    }
  }, [isOpen]);

  // BUSCA DE CLIENTES
  useEffect(() => {
    if (clientSearch.length >= 2) {
      const search = clientSearch.toLowerCase();
      const filtered = clients.filter(c => 
        c.name?.toLowerCase().includes(search) ||
        c.phone?.includes(search) ||
        c.email?.toLowerCase().includes(search)
      ).slice(0, 5);
      setFilteredClients(filtered);
    } else {
      setFilteredClients([]);
    }
  }, [clientSearch, clients]);

  // HANDLERS
  const updateForm = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleClientSelect = useCallback((client) => {
    setForm(prev => ({
      ...prev,
      clientName: client.name || '',
      clientPhone: client.phone || '',
      clientEmail: client.email || '',
      clientId: client.firestoreId || client.id || '',
    }));
    setClientSearch('');
    setFilteredClients([]);
  }, []);

  const handleSearchPlate = useCallback(async () => {
    const plate = form.plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (!isValidPlate(plate)) {
      toast.error('Placa inválida');
      return;
    }
    setSearchingPlate(true);
    try {
      const result = await consultarPlaca(plate);
      if (result.success && result.data) {
        setForm(prev => ({
          ...prev, plate,
          brand: result.data.brand || prev.brand,
          model: result.data.model || prev.model,
          year: result.data.year || prev.year,
          color: result.data.color || prev.color,
        }));
        setVehicleFound(true);
        toast.success('Veículo encontrado!');
      } else {
        toast.error('Veículo não encontrado');
      }
    } catch {
      toast.error('Erro ao consultar placa');
    } finally {
      setSearchingPlate(false);
    }
  }, [form.plate]);

  const toggleService = useCallback((name) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(name) ? prev.services.filter(s => s !== name) : [...prev.services, name]
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

  // VALIDATION
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

  // CHECK ACTIVE CHECKIN
  const checkActiveCheckin = useCallback(async (plate) => {
    if (!plate || !empresaId) return null;
    try {
      const q = query(
        collection(db, 'checkins'),
        where('empresaId', '==', empresaId),
        where('vehiclePlate', '==', plate.toUpperCase()),
        where('status', '==', 'in-progress')
      );
      const snap = await getDocs(q);
      return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
    } catch {
      return null;
    }
  }, [empresaId]);

  // SUBMIT
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
        priority: form.priority,
        photos: form.photos,
      };

      await createCheckin(data, empresaId || null);
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

  // RENDER GUARD
  if (!isOpen) return null;

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90" 
          variants={overlayVariants} 
          initial="hidden" 
          animate="visible" 
          exit="exit"
          onClick={onClose}
        >
          {/* Vinheta atmosférica */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)' }}
          />

          {/* MODAL ROOT - Aplica CSS variables da marca */}
          <motion.div
            className="brand-theme-modal relative flex flex-col w-[95vw] max-w-[1100px] h-[90vh] max-h-[750px] rounded-3xl overflow-hidden"
            style={{ 
              ...brandStyles,
              background: 'var(--brand-modal-bg, #0d0d0f)',
              boxShadow: `
                0 0 0 1px var(--brand-border, rgba(255,255,255,0.08)),
                0 25px 50px -12px rgba(0, 0, 0, 0.8),
                0 0 120px var(--brand-glow, rgba(107, 114, 128, 0.12)),
                inset 0 1px 0 rgba(255,255,255,0.05)
              `
            }}
            variants={modalVariants} 
            initial="hidden" 
            animate="visible" 
            exit="exit"
            onClick={e => e.stopPropagation()}
          >
            {/* Linha de energia superior - assinatura da marca */}
            <div 
              className="absolute top-0 left-0 right-0 h-[3px] z-10"
              style={{
                background: hasBrand 
                  ? `linear-gradient(90deg, var(--brand-accent, #3b82f6) 0%, transparent 60%)`
                  : 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, transparent 60%)',
                opacity: hasBrand ? 0.8 : 0.3
              }}
            />

            {/* ═══════════════════════════════════════════════════════════════════
                HEADER - Identidade visual da marca
            ═══════════════════════════════════════════════════════════════════ */}
            <header 
              className="flex-shrink-0 px-7 pt-6 pb-4 relative"
              style={{ 
                background: 'var(--brand-header-bg, rgba(0,0,0,0.3))',
                borderBottom: '1px solid var(--brand-border, rgba(255,255,255,0.08))'
              }}
            >
              {/* Brilho interno sutil */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)' }}
              />
              
              <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-5">
                  {/* Logo da marca - branca/clara para fundo escuro */}
                  {logoUrl && hasBrand ? (
                    <img 
                      src={logoUrl} 
                      alt={effectiveBrand} 
                      className="h-12 w-auto object-contain"
                      style={{ 
                        maxWidth: '140px',
                        filter: usesColoredLogo ? 'none' : 'brightness(0) invert(1)'
                      }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ color: 'var(--brand-text, #fff)' }}><Icons.Car /></span>
                    </div>
                  )}
                  
                  {/* Separador vertical */}
                  {hasBrand && <div className="h-10 w-px" style={{ background: 'var(--brand-border, rgba(255,255,255,0.1))' }} />}
                  
                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-3">
                      {form.plate ? (
                        <span className="text-xl font-semibold tracking-tight" style={{ color: 'var(--brand-text, #fff)' }}>{form.plate.toUpperCase()}</span>
                      ) : (
                        <span className="text-xl font-semibold" style={{ color: 'var(--brand-text, #fff)' }}>Novo Check-in</span>
                      )}
                      <span 
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: 'var(--brand-card-bg, rgba(255,255,255,0.04))', color: 'var(--brand-accent, #3b82f6)' }}
                      >
                        Check-in
                      </span>
                    </div>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.6))' }}>
                      {form.clientName && form.model 
                        ? `${form.clientName} • ${formatVehicleDisplay(form.brand, form.model)}${form.year ? ` • ${form.year}` : ''}`
                        : form.clientName 
                          ? form.clientName
                          : 'Preencha os dados do cliente e veículo'
                      }
                    </p>
                  </div>
                </div>

                {/* Botão fechar */}
                <button 
                  onClick={onClose} 
                  className="p-2.5 rounded-xl transition-all duration-200 hover:opacity-80"
                  style={{ background: 'var(--brand-card-bg, rgba(255,255,255,0.04))', border: '1px solid var(--brand-border, rgba(255,255,255,0.08))', color: 'var(--brand-text, #fff)' }}
                >
                  <span className="w-[18px] h-[18px] block"><Icons.Close /></span>
                </button>
              </div>
            </header>

            {/* ═══════════════════════════════════════════════════════════════════
                BODY - Steps Nav + Content
            ═══════════════════════════════════════════════════════════════════ */}
            <div className="flex-1 flex min-h-0">
              {/* STEPS NAV */}
              <nav 
                className="flex-shrink-0 w-[280px] flex flex-col py-6 px-4"
                style={{ background: 'rgba(0,0,0,0.3)', borderRight: '1px solid var(--brand-border, rgba(255,255,255,0.04))' }}
              >
                <div className="flex flex-col gap-1">
                  {STEPS.map((s, idx) => {
                    const isActive = step === s.id;
                    const isCompleted = step > s.id;
                    const Icon = s.icon;
                    return (
                      <button 
                        key={s.id} 
                        onClick={() => isCompleted && setStep(s.id)} 
                        disabled={!isCompleted && !isActive}
                        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${isActive ? '' : isCompleted ? 'hover:bg-white/[0.04] cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
                        style={{ background: isActive ? 'var(--brand-surface-soft, rgba(255,255,255,0.06))' : 'transparent' }}
                      >
                        <div 
                          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                          style={{ 
                            background: isActive ? 'var(--brand-accent, #3b82f6)' : isCompleted ? 'rgba(52, 199, 89, 0.15)' : 'rgba(255,255,255,0.05)', 
                            color: isActive ? '#fff' : isCompleted ? '#34C759' : 'rgba(255,255,255,0.4)' 
                          }}
                        >
                          {isCompleted ? <Icons.Check /> : <Icon />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium" style={{ color: isActive ? 'var(--brand-text, #fff)' : 'rgba(255,255,255,0.6)' }}>{s.label}</span>
                          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Etapa {s.id} de 4</span>
                        </div>
                        {idx < STEPS.length - 1 && (
                          <div 
                            className="absolute left-[30px] top-[52px] w-[2px] h-4" 
                            style={{ background: isCompleted ? 'rgba(52, 199, 89, 0.3)' : 'rgba(255,255,255,0.06)' }} 
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Resumo rápido */}
                {form.services.length > 0 && (
                  <div className="mt-auto pt-6" style={{ borderTop: '1px solid var(--brand-border, rgba(255,255,255,0.04))' }}>
                    <p className="text-[11px] uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Serviços selecionados</p>
                    <div className="flex flex-wrap gap-1">
                      {form.services.slice(0, 3).map(s => (
                        <span key={s} className="px-2 py-1 text-[10px] rounded-md" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>{s}</span>
                      ))}
                      {form.services.length > 3 && <span className="px-2 py-1 text-[10px] rounded-md" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>+{form.services.length - 3}</span>}
                    </div>
                  </div>
                )}
              </nav>

              {/* CONTENT - Área imersiva */}
              <div 
                className="flex-1 overflow-y-auto relative"
                style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.4) 100%)' }}
              >
                {/* Vinheta interna */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)' }}
                />
                
                <AnimatePresence mode="wait">
                  <motion.div key={step} variants={contentVariants} initial="enter" animate="center" exit="exit" className="p-8 relative">
                    {step === 1 && <StepCliente form={form} updateForm={updateForm} clientSearch={clientSearch} setClientSearch={setClientSearch} filteredClients={filteredClients} onClientSelect={handleClientSelect} brandStyles={brandStyles} />}
                    {step === 2 && <StepVeiculo form={form} updateForm={updateForm} onSearchPlate={handleSearchPlate} searchingPlate={searchingPlate} vehicleFound={vehicleFound} brandStyles={brandStyles} />}
                    {step === 3 && <StepServico form={form} toggleService={toggleService} toggleCondition={toggleCondition} updateForm={updateForm} brandStyles={brandStyles} />}
                    {step === 4 && <StepFotos form={form} updateForm={updateForm} brandStyles={brandStyles} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
                FOOTER
            ═══════════════════════════════════════════════════════════════════ */}
            <footer 
              className="flex-shrink-0 flex items-center justify-between px-6 py-4"
              style={{ background: 'rgba(0,0,0,0.3)', borderTop: '1px solid var(--brand-border, rgba(255,255,255,0.04))' }}
            >
              <button 
                onClick={handleBack} 
                disabled={step === 1}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${step === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/[0.06]'}`}
                style={{ color: 'var(--brand-text-muted, rgba(255,255,255,0.7))' }}
              >
                <Icons.ChevronLeft /> Voltar
              </button>

              <div className="flex items-center gap-1.5">
                {STEPS.map(s => (
                  <div 
                    key={s.id} 
                    className="w-2 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      background: step >= s.id ? 'var(--brand-accent, #3b82f6)' : 'rgba(255,255,255,0.15)', 
                      transform: step === s.id ? 'scale(1.3)' : 'scale(1)' 
                    }} 
                  />
                ))}
              </div>

              <button 
                onClick={handleNext} 
                disabled={!canProceed || loading}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${canProceed && !loading ? 'shadow-lg hover:brightness-110' : 'opacity-40 cursor-not-allowed'}`}
                style={{ background: canProceed ? 'var(--brand-accent, #3b82f6)' : 'rgba(255,255,255,0.1)', color: '#fff' }}
              >
                {loading ? (<><Icons.Loader /> Processando...</>) : step === 4 ? (<>Finalizar <Icons.Check /></>) : (<>Próximo <Icons.ChevronRight /></>)}
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default NovoCheckinModal;
