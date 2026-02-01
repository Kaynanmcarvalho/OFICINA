/**
 * TORQ Modal Editar Check-in - Premium Brand Identity
 * Design sincronizado com CheckinDetailsModal
 * Cores da marca do veÃ­culo refletidas no modal
 * Janeiro 2026
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { getBrandLogoUrl, getEffectiveBrand, formatVehicleDisplay } from '../../../utils/vehicleBrandLogos';
import { getBrandModalStyles } from '../../../utils/brandModalTheme';
import { useClientStore } from '../../../store/clientStore';
import '../../../styles/brand-modal.css';
import toast from 'react-hot-toast';

// ============================================================================
// PREMIUM ICON SYSTEM
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
  Client: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
    </svg>
  ),
  Vehicle: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 14h18v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3z" strokeLinejoin="round" />
      <path d="M3 14l2-5c.5-1.2 1.5-2 3-2h8c1.5 0 2.5.8 3 2l2 5" strokeLinejoin="round" />
      <path d="M6 9l1-2h10l1 2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6.5" cy="17" r="2" />
      <circle cx="17.5" cy="17" r="2" />
      <path d="M8.5 17h7" strokeLinecap="round" />
      <path d="M7 12h2M15 12h2" strokeLinecap="round" />
    </svg>
  ),
  Services: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinejoin="round" />
    </svg>
  ),
  Status: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Phone: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  ),
  Mail: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6l-10 7L2 6" strokeLinecap="round" />
    </svg>
  ),
  Loader: ({ className = '' }) => (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" opacity="0.2" />
      <path d="M12 2a10 10 0 019.17 6" strokeLinecap="round" />
    </svg>
  ),
  Save: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" strokeLinejoin="round" />
      <path d="M17 21v-8H7v8M7 3v5h8" strokeLinecap="round" />
    </svg>
  ),
  Odometer: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2a10 10 0 00-7.07 17.07" strokeLinecap="round" />
      <path d="M12 2a10 10 0 017.07 17.07" strokeLinecap="round" />
      <path d="M12 12l3-5" strokeLinecap="round" strokeWidth="2" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  Notes: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" strokeLinejoin="round" />
      <path d="M14 2v6h6M8 13h8M8 17h5" strokeLinecap="round" />
    </svg>
  ),
  Calendar: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  ),
  Flag: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <path d="M4 22v-7" strokeLinecap="round" />
    </svg>
  ),
  Clipboard: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <path d="M9 12h6M9 16h4" strokeLinecap="round" />
    </svg>
  ),
  AlertCircle: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
    </svg>
  ),
  Trash: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v6M14 11v6" strokeLinecap="round" />
    </svg>
  ),
  Warning: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinejoin="round" />
    </svg>
  ),
  Document: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinejoin="round" />
    </svg>
  ),
  MapPin: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Building: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Cake: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-8a2 2 0 00-2-2H6a2 2 0 00-2 2v8M4 16h16M12 11V3M8 7h8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Lock: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
    </svg>
  ),
  Palette: ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="8" r="1.5" fill="currentColor" />
      <circle cx="8" cy="12" r="1.5" fill="currentColor" />
      <circle cx="16" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </svg>
  ),
};

// ============================================================================
// CONFIGURATION
// ============================================================================
const SECTIONS = [
  { id: 'client', label: 'Cliente', icon: Icons.Client, description: 'Dados de contato' },
  { id: 'vehicle', label: 'VeÃ­culo', icon: Icons.Vehicle, description: 'InformaÃ§Ãµes do veÃ­culo' },
  { id: 'service', label: 'ServiÃ§os', icon: Icons.Services, description: 'ServiÃ§os solicitados' },
  { id: 'status', label: 'Status', icon: Icons.Status, description: 'SituaÃ§Ã£o atual' },
];

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Aguardando', description: 'Aguardando inÃ­cio', color: 'amber' },
  { value: 'diagnosis', label: 'DiagnÃ³stico', description: 'Em anÃ¡lise tÃ©cnica', color: 'blue' },
  { value: 'waiting-budget', label: 'OrÃ§amento', description: 'Aguardando aprovaÃ§Ã£o', color: 'purple' },
  { value: 'in-progress', label: 'Em ExecuÃ§Ã£o', description: 'Trabalho em andamento', color: 'cyan' },
  { value: 'ready', label: 'Pronto', description: 'Aguardando retirada', color: 'emerald' },
  { value: 'completed', label: 'ConcluÃ­do', description: 'Entregue ao cliente', color: 'green' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Baixa', color: 'slate' },
  { value: 'normal', label: 'Normal', color: 'blue' },
  { value: 'high', label: 'Alta', color: 'orange' },
  { value: 'urgent', label: 'Urgente', color: 'red' },
];

const COMMON_SERVICES = [
  { name: 'Troca de Ã“leo', category: 'ManutenÃ§Ã£o' },
  { name: 'Alinhamento', category: 'SuspensÃ£o' },
  { name: 'Balanceamento', category: 'SuspensÃ£o' },
  { name: 'Freios', category: 'SeguranÃ§a' },
  { name: 'SuspensÃ£o', category: 'SuspensÃ£o' },
  { name: 'Motor', category: 'MecÃ¢nica' },
  { name: 'ElÃ©trica', category: 'ElÃ©trica' },
  { name: 'Ar Condicionado', category: 'Conforto' },
  { name: 'RevisÃ£o Completa', category: 'ManutenÃ§Ã£o' },
  { name: 'DiagnÃ³stico', category: 'AnÃ¡lise' },
  { name: 'Embreagem', category: 'TransmissÃ£o' },
  { name: 'CÃ¢mbio', category: 'TransmissÃ£o' },
];

const CANCEL_REASONS = [
  { value: 'cliente_desistiu', label: 'Cliente desistiu do serviÃ§o' },
  { value: 'orcamento_recusado', label: 'OrÃ§amento nÃ£o aprovado pelo cliente' },
  { value: 'veiculo_retirado', label: 'VeÃ­culo retirado sem conclusÃ£o' },
  { value: 'falta_pecas', label: 'Falta de peÃ§as disponÃ­veis' },
  { value: 'problema_pagamento', label: 'Problema com pagamento' },
  { value: 'erro_cadastro', label: 'Check-in cadastrado por engano' },
  { value: 'duplicado', label: 'Check-in duplicado' },
  { value: 'outro', label: 'Outro motivo' },
];

// Logos que mantÃªm cor original (nÃ£o ficam brancas)
const COLORED_LOGO_BRANDS = ['bmw', 'fiat', 'ferrari', 'lamborghini', 'land rover', 'land-rover', 'chevrolet', 'ford', 'renault', 'mini', 'dodge', 'ram', 'volvo', 'porsche', 'chery', 'jac', 'jac motors', 'yamaha', 'mercedes', 'mercedes-benz'];
// Logos menores (-10%)
const SMALL_LOGO_BRANDS = ['byd', 'land rover', 'land-rover', 'chevrolet', 'toyota'];
// Logos maiores (+10% a +15%)
const LARGE_LOGO_BRANDS = ['dodge', 'jac', 'jac motors', 'citroen', 'citroÃ«n', 'kia', 'ferrari', 'mitsubishi', 'jaguar', 'lamborghini', 'mclaren', 'bmw', 'peugeot', 'mini', 'volvo', 'yamaha', 'mercedes', 'mercedes-benz'];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const formatCPFDisplay = (cpf) => {
  if (!cpf) return '';
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return cpf;
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatCNPJDisplay = (cnpj) => {
  if (!cnpj) return '';
  const clean = cnpj.replace(/\D/g, '');
  if (clean.length !== 14) return cnpj;
  return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

const formatBirthDateDisplay = (date) => {
  if (!date) return '';
  if (date.includes('/')) return date;
  if (date.includes('-')) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }
  return date;
};

const formatAddressDisplay = (client) => {
  if (!client) return '';
  const parts = [];
  if (client.address) parts.push(client.address);
  if (client.number) parts.push(client.number);
  if (client.complement) parts.push(client.complement);
  if (client.neighborhood) parts.push(client.neighborhood);
  if (client.city && client.state) parts.push(`${client.city}/${client.state}`);
  else if (client.city) parts.push(client.city);
  if (client.zipCode) {
    const cleanZip = client.zipCode.replace(/\D/g, '');
    const formattedZip = cleanZip.length === 8 
      ? `${cleanZip.slice(0, 5)}-${cleanZip.slice(5)}` 
      : client.zipCode;
    parts.push(`CEP: ${formattedZip}`);
  }
  return parts.join(', ');
};

// ============================================================================
// CUSTOM DATE PICKER COMPONENT - Brand Themed
// ============================================================================
const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'MarÃ§o', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const WEEKDAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'SÃ¡b'];

const DatePickerBrand = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value + 'T00:00:00');
    return new Date();
  });
  
  const selectedDate = value ? new Date(value + 'T00:00:00') : null;
  
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  
  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));
  
  const handleSelectDay = (day) => {
    if (!day) return;
    const newDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(newDate);
    setIsOpen(false);
  };
  
  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };
  
  const isSelected = (day) => {
    if (!day || !selectedDate) return false;
    return day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
  };
  
  const formatDisplayDate = () => {
    if (!selectedDate) return 'Selecionar data';
    return selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all"
        style={{ 
          background: 'var(--brand-card-bg)', 
          borderColor: isOpen ? 'var(--brand-accent)' : 'var(--brand-border)', 
          color: 'var(--brand-text)',
          boxShadow: isOpen ? '0 0 0 3px rgba(var(--brand-accent-rgb, 59, 130, 246), 0.15)' : 'none'
        }}
      >
        <div className="flex items-center gap-3">
          <Icons.Calendar className="w-5 h-5" style={{ color: 'var(--brand-accent)' }} />
          <span className={selectedDate ? 'font-medium' : 'opacity-50'}>{formatDisplayDate()}</span>
        </div>
        <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--brand-text-muted)' }}>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full rounded-2xl overflow-hidden"
            style={{ background: 'rgba(20, 20, 25, 0.98)', backdropFilter: 'blur(20px)', border: '1px solid var(--brand-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 60px var(--brand-glow)' }}
          >
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--brand-border)' }}>
              <button type="button" onClick={handlePrevMonth} className="p-2 rounded-lg transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#FFFFFF' }}><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <div className="text-center">
                <p className="font-semibold" style={{ color: 'var(--brand-text)' }}>{MONTH_NAMES[month]}</p>
                <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>{year}</p>
              </div>
              <button type="button" onClick={handleNextMonth} className="p-2 rounded-lg transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#FFFFFF' }}><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
            
            <div className="grid grid-cols-7 px-2 py-2" style={{ borderBottom: '1px solid var(--brand-border)' }}>
              {WEEKDAY_NAMES.map(day => (
                <div key={day} className="text-center text-[10px] font-medium uppercase tracking-wider py-1" style={{ color: 'var(--brand-text-muted)' }}>{day}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1 p-2">
              {days.map((day, index) => (
                <button key={index} type="button" onClick={() => handleSelectDay(day)} disabled={!day}
                  className={`aspect-square rounded-lg text-sm font-medium transition-all ${!day ? 'invisible' : 'hover:opacity-80'}`}
                  style={{ background: isSelected(day) ? 'var(--brand-accent)' : isToday(day) ? 'rgba(255,255,255,0.1)' : 'transparent', color: isSelected(day) ? '#FFFFFF' : isToday(day) ? 'var(--brand-accent)' : 'var(--brand-text)', boxShadow: isSelected(day) ? '0 4px 12px rgba(0,0,0,0.3)' : 'none' }}
                >{day}</button>
              ))}
            </div>
            
            <div className="px-3 py-2 flex justify-between items-center" style={{ borderTop: '1px solid var(--brand-border)', background: 'rgba(0,0,0,0.2)' }}>
              <button type="button" onClick={() => { const today = new Date(); setViewDate(today); const newDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`; onChange(newDate); setIsOpen(false); }} className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all" style={{ color: 'var(--brand-accent)', background: 'rgba(255,255,255,0.05)' }}>Hoje</button>
              {selectedDate && <button type="button" onClick={() => { onChange(''); setIsOpen(false); }} className="text-xs px-3 py-1.5 rounded-lg transition-all" style={{ color: 'var(--brand-text-muted)', background: 'rgba(255,255,255,0.05)' }}>Limpar</button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {selectedDate && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg mt-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--brand-border)' }}>
          <Icons.Calendar className="w-4 h-4" style={{ color: 'var(--brand-accent)' }} />
          <p className="text-sm" style={{ color: 'var(--brand-text)' }}>{selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const ModalEditarCheckin = ({ isOpen, onClose, checkinData, onSave, onDelete }) => {
  const [activeSection, setActiveSection] = useState('client');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [isLoadingClient, setIsLoadingClient] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  
  const { clients, fetchClients } = useClientStore();
  
  const [formData, setFormData] = useState({
    clientName: '', clientPhone: '', clientEmail: '',
    vehiclePlate: '', vehicleBrand: '', vehicleModel: '', vehicleYear: '', vehicleColor: '', vehicleKm: '',
    services: [], notes: '', internalNotes: '', status: 'pending', priority: 'normal', estimatedCompletion: '',
  });

  const effectiveBrand = useMemo(() => getEffectiveBrand(checkinData?.vehicleBrand, checkinData?.vehicleModel), [checkinData?.vehicleBrand, checkinData?.vehicleModel]);
  const brandStyles = useMemo(() => getBrandModalStyles(effectiveBrand || 'default'), [effectiveBrand]);
  const logoUrl = useMemo(() => getBrandLogoUrl(effectiveBrand, checkinData?.vehicleModel, false), [effectiveBrand, checkinData?.vehicleModel]);
  
  const isColoredLogo = COLORED_LOGO_BRANDS.includes(effectiveBrand?.toLowerCase());
  const isSmallLogo = SMALL_LOGO_BRANDS.includes(effectiveBrand?.toLowerCase());
  const isLargeLogo = LARGE_LOGO_BRANDS.includes(effectiveBrand?.toLowerCase());

  useEffect(() => { if (isOpen && clients.length === 0) fetchClients(); }, [isOpen, clients.length, fetchClients]);
  
  useEffect(() => {
    if (checkinData && isOpen && clients.length > 0) {
      setIsLoadingClient(true);
      const clientId = checkinData.clientId;
      let foundClient = clientId ? clients.find(c => c.id === clientId) : null;
      if (!foundClient && checkinData.clientName) {
        foundClient = clients.find(c => c.name?.toLowerCase() === checkinData.clientName?.toLowerCase() || c.phone === checkinData.clientPhone);
      }
      setClientData(foundClient || null);
      setIsLoadingClient(false);
    }
  }, [checkinData, isOpen, clients]);
  
  useEffect(() => {
    if (checkinData && isOpen) {
      setFormData({
        clientName: checkinData.clientName || '', clientPhone: checkinData.clientPhone || '', clientEmail: checkinData.clientEmail || '',
        vehiclePlate: checkinData.vehiclePlate || '', vehicleBrand: checkinData.vehicleBrand || '', vehicleModel: checkinData.vehicleModel || '',
        vehicleYear: checkinData.vehicleYear || '', vehicleColor: checkinData.vehicleColor || '', vehicleKm: checkinData.vehicleKm || checkinData.mileage || '',
        services: checkinData.services || [], notes: checkinData.notes || '', internalNotes: checkinData.internalNotes || '',
        status: checkinData.status || 'pending', priority: checkinData.priority || 'normal', estimatedCompletion: checkinData.estimatedCompletion || '',
      });
      setActiveSection('client');
      setHasChanges(false);
    }
  }, [checkinData, isOpen]);

  const handleChange = useCallback((field, value) => { setFormData(prev => ({ ...prev, [field]: value })); setHasChanges(true); }, []);
  const handleServiceToggle = useCallback((serviceName) => {
    setFormData(prev => ({ ...prev, services: prev.services.includes(serviceName) ? prev.services.filter(s => s !== serviceName) : [...prev.services, serviceName] }));
    setHasChanges(true);
  }, []);

  const handleSave = async () => {
    const docId = checkinData?.firestoreId;
    if (!docId) { toast.error('Erro: ID do check-in nÃ£o encontrado'); return; }
    setIsLoading(true);
    try {
      const docRef = doc(db, 'checkins', docId);
      await updateDoc(docRef, { ...formData, updatedAt: new Date() });
      toast.success('Check-in atualizado com sucesso!');
      if (onSave) onSave({ ...checkinData, ...formData });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar alteraÃ§Ãµes');
    } finally { setIsLoading(false); }
  };

  const handleDelete = async () => {
    const docId = checkinData?.firestoreId;
    if (!docId) { toast.error('Erro: ID do check-in nÃ£o encontrado'); return; }
    const finalReason = cancelReason === 'outro' ? customReason : cancelReason;
    if (!finalReason) { toast.error('Por favor, selecione um motivo para o cancelamento'); return; }
    setIsDeleting(true);
    try {
      const docRef = doc(db, 'checkins', docId);
      await updateDoc(docRef, { 
        status: 'cancelled', cancelledAt: new Date(), cancelReason: finalReason,
        cancelReasonLabel: cancelReason === 'outro' ? customReason : CANCEL_REASONS.find(r => r.value === cancelReason)?.label || finalReason
      });
      toast.success('Check-in cancelado com sucesso');
      setShowDeleteConfirm(false); setCancelReason(''); setCustomReason('');
      if (onDelete) onDelete(checkinData);
      onClose();
    } catch (error) {
      console.error('Erro ao cancelar:', error);
      toast.error('Erro ao cancelar check-in');
    } finally { setIsDeleting(false); }
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    return value;
  };

  if (!isOpen) return null;

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
          transition={{ duration: 0.2 }}
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
            className="relative w-full max-w-[1000px] h-[85vh] max-h-[700px] rounded-3xl overflow-hidden flex flex-col"
            style={{ background: 'var(--brand-modal-bg)', boxShadow: `0 0 0 1px var(--brand-border), 0 25px 50px -12px rgba(0,0,0,0.8), 0 0 120px var(--brand-glow), inset 0 1px 0 rgba(255,255,255,0.05)` }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, var(--brand-accent) 0%, transparent 60%)', opacity: 0.5 }} />

            {/* HEADER */}
            <div className="px-7 pt-6 pb-4 flex-shrink-0 relative" style={{ background: 'var(--brand-header-bg)', borderBottom: '1px solid var(--brand-border)' }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)' }} />
              
              <div className="flex items-center justify-between mb-5 relative">
                <div className="flex items-center gap-5">
                  {logoUrl ? (
                    <img src={logoUrl} alt={effectiveBrand} className={`${isSmallLogo ? 'h-10' : isLargeLogo ? 'h-[74px]' : 'h-16'} w-auto object-contain`}
                      style={{ maxWidth: isSmallLogo ? '100px' : isLargeLogo ? '207px' : '180px', filter: isColoredLogo ? 'none' : 'brightness(0) invert(1)' }} />
                  ) : (
                    <span className="text-4xl font-bold tracking-tight" style={{ color: '#FFFFFF' }}>{(effectiveBrand || 'V').toUpperCase()}</span>
                  )}
                  <div className="h-10 w-px" style={{ background: 'var(--brand-border)' }} />
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--brand-text)' }}>{checkinData?.vehiclePlate}</h2>
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'var(--brand-card-bg)', color: 'var(--brand-accent)' }}>Editando</span>
                    </div>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>
                      {formatVehicleDisplay(checkinData?.vehicleBrand, checkinData?.vehicleModel)}{checkinData?.vehicleYear && ` â€¢ ${checkinData.vehicleYear}`}
                    </p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2.5 rounded-xl transition-all duration-200 hover:opacity-80" style={{ background: 'var(--brand-card-bg)', border: '1px solid var(--brand-border)', color: 'var(--brand-text)' }}>
                  <Icons.Close className="w-[18px] h-[18px]" />
                </button>
              </div>
              <div className="flex gap-1.5 relative">
                {SECTIONS.map(section => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <motion.button key={section.id} onClick={() => setActiveSection(section.id)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                      style={{ background: isActive ? 'var(--brand-accent)' : 'transparent', color: isActive ? '#FFFFFF' : 'var(--brand-text-muted)', boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)' : 'none' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-4 h-4" /><span>{section.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-6 relative" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.4) 100%)' }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)' }} />
              
              <AnimatePresence mode="wait">
                {/* CLIENT SECTION */}
                {activeSection === 'client' && (
                  <motion.div key="client" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-5 relative">
                    {isLoadingClient && <div className="flex items-center justify-center py-8"><Icons.Loader className="w-6 h-6" style={{ color: 'var(--brand-accent)' }} /></div>}
                    
                    <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--brand-border)' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                          <Icons.Client className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                        </div>
                        <div>
                          <p className="text-lg font-semibold" style={{ color: 'var(--brand-text)' }}>{formData.clientName || 'Cliente nÃ£o identificado'}</p>
                          <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>{clientData?.personType === 'juridica' ? 'Pessoa JurÃ­dica' : 'Pessoa FÃ­sica'}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        {(clientData?.cpf || clientData?.cnpj) && (
                          <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <Icons.Document className="w-4 h-4 flex-shrink-0" style={{ color: '#FFFFFF' }} />
                            <div>
                              <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--brand-text-muted)' }}>{clientData?.cnpj ? 'CNPJ' : 'CPF'}</p>
                              <p className="text-sm font-mono" style={{ color: 'var(--brand-text)' }}>{clientData?.cnpj ? formatCNPJDisplay(clientData.cnpj) : formatCPFDisplay(clientData?.cpf)}</p>
                            </div>
                          </div>
                        )}
                        {clientData?.birthDate && (
                          <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <Icons.Cake className="w-4 h-4 flex-shrink-0" style={{ color: '#FFFFFF' }} />
                            <div>
                              <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--brand-text-muted)' }}>Nascimento</p>
                              <p className="text-sm" style={{ color: 'var(--brand-text)' }}>{formatBirthDateDisplay(clientData.birthDate)}</p>
                            </div>
                          </div>
                        )}
                        {clientData?.razaoSocial && (
                          <div className="flex items-center gap-2 p-2.5 rounded-lg col-span-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <Icons.Building className="w-4 h-4 flex-shrink-0" style={{ color: '#FFFFFF' }} />
                            <div>
                              <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--brand-text-muted)' }}>RazÃ£o Social</p>
                              <p className="text-sm" style={{ color: 'var(--brand-text)' }}>{clientData.razaoSocial}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {(clientData?.address || clientData?.city) && (
                        <div className="flex items-start gap-2 p-2.5 rounded-lg mt-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <Icons.MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#FFFFFF' }} />
                          <div>
                            <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--brand-text-muted)' }}>EndereÃ§o</p>
                            <p className="text-sm" style={{ color: 'var(--brand-text)' }}>{formatAddressDisplay(clientData)}</p>
                          </div>
                        </div>
                      )}
                      {!clientData && !isLoadingClient && <p className="text-xs mt-2" style={{ color: 'var(--brand-text-muted)' }}>Cliente nÃ£o encontrado no cadastro.</p>}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-medium px-2 py-1 rounded-md" style={{ background: 'var(--brand-accent)', color: '#FFFFFF' }}>EditÃ¡vel</span>
                        <span className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>Apenas telefone e email podem ser alterados</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>Telefone</label>
                          <div className="relative">
                            <Icons.Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#FFFFFF' }} />
                            <input type="tel" value={formData.clientPhone} onChange={e => handleChange('clientPhone', formatPhone(e.target.value))}
                              className="w-full pl-12 pr-4 py-3.5 rounded-xl border outline-none transition-all"
                              style={{ background: 'var(--brand-card-bg)', borderColor: 'var(--brand-border)', color: 'var(--brand-text)' }}
                              placeholder="(00) 00000-0000" maxLength={15} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>Email</label>
                          <div className="relative">
                            <Icons.Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#FFFFFF' }} />
                            <input type="email" value={formData.clientEmail} onChange={e => handleChange('clientEmail', e.target.value)}
                              className="w-full pl-12 pr-4 py-3.5 rounded-xl border outline-none transition-all"
                              style={{ background: 'var(--brand-card-bg)', borderColor: 'var(--brand-border)', color: 'var(--brand-text)' }}
                              placeholder="email@exemplo.com" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* VEHICLE SECTION */}
                {activeSection === 'vehicle' && (
                  <motion.div key="vehicle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-5 relative">
                    <div className="flex justify-center">
                      <div className="px-8 py-4 rounded-lg text-center" style={{ background: '#FFFFFF', border: '3px solid #1a1a1a', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                        <p className="text-3xl font-bold font-mono tracking-[0.4em] text-gray-900">{formData.vehiclePlate || 'ABC1D23'}</p>
                        <p className="text-[10px] text-gray-500 mt-1 tracking-wider">BRASIL</p>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--brand-border)' }}>
                      <div className="flex items-center gap-2 mb-4">
                        <Icons.Lock className="w-4 h-4" style={{ color: 'var(--brand-text-muted)' }} />
                        <span className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>Dados do veÃ­culo nÃ£o podem ser alterados</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--brand-text-muted)' }}>Marca</p><p className="text-base font-medium" style={{ color: 'var(--brand-text)' }}>{formData.vehicleBrand || '-'}</p></div>
                        <div className="space-y-1"><p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--brand-text-muted)' }}>Modelo</p><p className="text-base font-medium" style={{ color: 'var(--brand-text)' }}>{formData.vehicleModel || '-'}</p></div>
                        <div className="space-y-1"><p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--brand-text-muted)' }}>Ano</p><p className="text-base font-medium" style={{ color: 'var(--brand-text)' }}>{formData.vehicleYear || '-'}</p></div>
                        <div className="space-y-1"><p className="text-[10px] uppercase tracking-wider flex items-center gap-1" style={{ color: 'var(--brand-text-muted)' }}><Icons.Palette className="w-3 h-3" /> Cor</p><p className="text-base font-medium" style={{ color: 'var(--brand-text)' }}>{formData.vehicleColor || '-'}</p></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-md" style={{ background: 'var(--brand-accent)', color: '#FFFFFF' }}>EditÃ¡vel</span>
                        <span className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>Atualize a quilometragem atual</span>
                      </div>
                      <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--brand-text)' }}><Icons.Odometer className="w-4 h-4" style={{ color: '#FFFFFF' }} /> Quilometragem (KM)</label>
                      <div className="relative">
                        <input type="text" value={formData.vehicleKm} onChange={e => handleChange('vehicleKm', e.target.value.replace(/\D/g, ''))}
                          className="w-full px-4 py-4 rounded-xl border outline-none text-xl font-mono text-center"
                          style={{ background: 'var(--brand-card-bg)', borderColor: 'var(--brand-border)', color: 'var(--brand-text)' }} placeholder="50000" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--brand-text-muted)' }}>km</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SERVICES SECTION */}
                {activeSection === 'service' && (
                  <motion.div key="service" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-6 relative">
                    <div className="flex items-center justify-between">
                      <p className="text-sm" style={{ color: 'var(--brand-text-muted)' }}>Selecione os serviÃ§os</p>
                      <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: formData.services.length > 0 ? 'var(--brand-accent)' : 'var(--brand-card-bg)', color: '#FFFFFF' }}>
                        {formData.services.length} selecionado{formData.services.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {COMMON_SERVICES.map((service) => {
                        const isSelected = formData.services.includes(service.name);
                        return (
                          <motion.button key={service.name} type="button" onClick={() => handleServiceToggle(service.name)} whileTap={{ scale: 0.98 }}
                            className="relative px-4 py-3 rounded-xl text-sm font-medium transition-all border text-left"
                            style={{ background: isSelected ? 'var(--brand-accent)' : 'var(--brand-card-bg)', borderColor: isSelected ? 'var(--brand-accent)' : 'var(--brand-border)', color: isSelected ? '#FFFFFF' : 'var(--brand-text)' }}>
                            <span className="block truncate">{service.name}</span>
                            <span className="text-xs" style={{ opacity: 0.7 }}>{service.category}</span>
                            {isSelected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2"><Icons.Check className="w-4 h-4" /></motion.div>}
                          </motion.button>
                          );

                      })}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--brand-text)' }}><Icons.Notes className="w-4 h-4" /> ObservaÃ§Ãµes</label>
                      <textarea value={formData.notes} onChange={e => handleChange('notes', e.target.value)} rows={3}
                        className="w-full px-4 py-3 rounded-xl border outline-none resize-none"
                        style={{ background: 'var(--brand-card-bg)', borderColor: 'var(--brand-border)', color: 'var(--brand-text)' }} placeholder="Problemas relatados..." />
                    </div>
                  </motion.div>
                )}

                {/* STATUS SECTION */}
                {activeSection === 'status' && (
                  <motion.div key="status" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-6 relative">
                    <div className="space-y-3">
                      <label className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>Status do Atendimento</label>
                      <div className="grid grid-cols-2 gap-3">
                        {STATUS_OPTIONS.map((option) => {
                          const isSelected = formData.status === option.value;
                          return (
                            <motion.button key={option.value} type="button" onClick={() => handleChange('status', option.value)} whileTap={{ scale: 0.99 }}
                              className="relative p-4 rounded-xl text-left transition-all border"
                              style={{ background: isSelected ? 'var(--brand-accent)' : 'var(--brand-card-bg)', borderColor: isSelected ? 'var(--brand-accent)' : 'var(--brand-border)', color: isSelected ? '#FFFFFF' : 'var(--brand-text)' }}>
                              <p className="text-sm font-semibold">{option.label}</p>
                              <p className="text-xs mt-0.5" style={{ opacity: 0.7 }}>{option.description}</p>
                              {isSelected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3"><Icons.Check className="w-5 h-5" /></motion.div>}
                            </motion.button>
                          );

                        })}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--brand-text)' }}><Icons.Flag className="w-4 h-4" /> Prioridade</label>
                      <div className="flex gap-2">
                        {PRIORITY_OPTIONS.map((option) => {
                          const isSelected = formData.priority === option.value;
                          return (
                            <motion.button key={option.value} type="button" onClick={() => handleChange('priority', option.value)} whileTap={{ scale: 0.98 }}
                              className="flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all border"
                              style={{ background: isSelected ? 'var(--brand-accent)' : 'var(--brand-card-bg)', borderColor: isSelected ? 'var(--brand-accent)' : 'var(--brand-border)', color: isSelected ? '#FFFFFF' : 'var(--brand-text)' }}>
                              {option.label}
                            </motion.button>
                          );

                        })}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--brand-text)' }}><Icons.Calendar className="w-4 h-4" style={{ color: '#FFFFFF' }} /> PrevisÃ£o de ConclusÃ£o</label>
                      <DatePickerBrand value={formData.estimatedCompletion} onChange={(date) => handleChange('estimatedCompletion', date)} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ background: 'var(--brand-header-bg)', borderTop: '1px solid var(--brand-border)' }}>
              <div className="flex items-center gap-3">
                <motion.button onClick={() => setShowDeleteConfirm(true)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444' }}>
                  <Icons.Close className="w-4 h-4" />Cancelar Check-in
                </motion.button>
                {hasChanges && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' }}>
                    <Icons.AlertCircle className="w-4 h-4" /><span className="text-xs font-medium">AlteraÃ§Ãµes nÃ£o salvas</span>
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all" style={{ background: 'var(--brand-card-bg)', border: '1px solid var(--brand-border)', color: 'var(--brand-text)' }}>Fechar</button>
                <motion.button onClick={handleSave} disabled={isLoading || !hasChanges} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'var(--brand-accent)', color: '#FFFFFF' }}>
                  {isLoading ? <><Icons.Loader className="w-4 h-4" />Salvando...</> : <><Icons.Save className="w-4 h-4" />Salvar AlteraÃ§Ãµes</>}
                </motion.button>
              </div>
            </div>

            {/* ===== MODAL DE CANCELAMENTO - HORIZONTAL COM BLUR E BRAND COLORS ===== */}
            <AnimatePresence>
              {showDeleteConfirm && (
                <div
                  className="absolute inset-0 z-50 flex items-center justify-center p-4"
                  onClick={() => { setShowDeleteConfirm(false); setCancelReason(''); setCustomReason(''); }}
                >
                  {/* Fundo com blur - aparece instantaneamente */}
                  <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }} />
                  
                  {/* Modal Horizontal - sÃ³ ele anima */}
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    onClick={e => e.stopPropagation()}
                    className="relative w-full max-w-[800px] rounded-2xl overflow-hidden flex"
                    style={{ background: 'var(--brand-modal-bg)', boxShadow: '0 0 0 1px var(--brand-border), 0 25px 60px rgba(0,0,0,0.5), 0 0 100px var(--brand-glow)' }}
                  >
                    {/* Linha de energia superior */}
                    <motion.div className="absolute top-0 left-0 right-0 h-[2px]" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.05, duration: 0.3 }}
                      style={{ background: 'linear-gradient(90deg, var(--brand-accent) 0%, transparent 70%)', transformOrigin: 'left' }} />

                    {/* LADO ESQUERDO - Info do VeÃ­culo */}
                    <div className="w-[260px] flex-shrink-0 p-6 flex flex-col items-center" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)', borderRight: '1px solid var(--brand-border)' }}>
                      {/* Logo da marca - maior e mais destacado */}
                      <div className="mb-5">
                        {logoUrl ? (
                          <img src={logoUrl} alt={effectiveBrand} className={`${isSmallLogo ? 'h-10' : isLargeLogo ? 'h-14' : 'h-12'} w-auto object-contain`}
                            style={{ maxWidth: '140px', filter: isColoredLogo ? 'none' : 'brightness(0) invert(1)' }} />
                        ) : (
                          <span className="text-2xl font-bold tracking-tight" style={{ color: 'var(--brand-accent)' }}>{(effectiveBrand || 'VEÃCULO').toUpperCase()}</span>
                        )}
                      </div>
                      
                      {/* Placa estilo brasileiro Mercosul - Premium */}
                      <div className="mb-5">
                        <div className="px-5 py-2.5 rounded-lg relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 100%)', boxShadow: '0 6px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,1)' }}>
                          <div className="absolute top-0 left-0 right-0 h-[6px] flex items-center justify-center" style={{ background: 'linear-gradient(90deg, #002776 0%, #003399 50%, #002776 100%)' }}>
                            <span className="text-[5px] font-bold text-white tracking-widest">BRASIL</span>
                          </div>
                          <p className="text-lg font-black font-mono tracking-[0.25em] text-gray-900 mt-1">{checkinData?.vehiclePlate}</p>
                        </div>
                      </div>
                      
                      {/* Info do veÃ­culo - Formatado corretamente */}
                      <div className="text-center mb-5 px-2">
                        <p className="text-base font-semibold leading-tight" style={{ color: 'var(--brand-text)' }}>
                          {formatVehicleDisplay(checkinData?.vehicleBrand, checkinData?.vehicleModel)}
                        </p>
                        {checkinData?.vehicleYear && (
                          <p className="text-sm mt-1.5 font-medium" style={{ color: 'var(--brand-accent)' }}>{checkinData.vehicleYear}</p>
                        )}
                        {checkinData?.vehicleColor && (
                          <p className="text-xs mt-1" style={{ color: 'var(--brand-text-muted)' }}>{checkinData.vehicleColor}</p>
                        )}
                      </div>
                      
                      {/* Separador elegante */}
                      <div className="w-12 h-px mb-5" style={{ background: 'linear-gradient(90deg, transparent, var(--brand-border), transparent)' }} />
                      
                      {/* Cliente - Card mais elegante */}
                      <div className="w-full p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--brand-border)' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--brand-accent)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                            <Icons.Client className="w-4 h-4" style={{ color: '#FFFFFF' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--brand-text-muted)' }}>Cliente</p>
                            <p className="text-sm font-medium truncate" style={{ color: 'var(--brand-text)' }}>{checkinData?.clientName}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* LADO DIREITO - FormulÃ¡rio */}
                    <div className="flex-1 flex flex-col">
                      {/* Header */}
                      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--brand-border)' }}>
                        <div className="flex items-center gap-3">
                          <motion.div className="w-9 h-9 rounded-xl flex items-center justify-center" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15, delay: 0.1 }}
                            style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            <Icons.Warning className="w-4 h-4" style={{ color: '#EF4444' }} />
                          </motion.div>
                          <div>
                            <h3 className="text-sm font-bold" style={{ color: 'var(--brand-text)' }}>Cancelar Check-in</h3>
                            <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>Selecione o motivo</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Motivos em Grid */}
                      <div className="flex-1 p-4 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-1.5">
                          {CANCEL_REASONS.map((reason, index) => {
                            const isSelected = cancelReason === reason.value;
                            return (
                              <motion.button key={reason.value} type="button"
                                onClick={() => { setCancelReason(reason.value); if (reason.value !== 'outro') setCustomReason(''); }}
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + index * 0.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative p-2.5 rounded-lg text-left transition-all"
                                style={{ background: isSelected ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isSelected ? 'rgba(239,68,68,0.3)' : 'var(--brand-border)'}` }}>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: isSelected ? '#EF4444' : 'transparent', border: `2px solid ${isSelected ? '#EF4444' : 'rgba(255,255,255,0.2)'}`, boxShadow: isSelected ? '0 0 6px rgba(239,68,68,0.4)' : 'none' }}>
                                    {isSelected && <div className="w-1 h-1 rounded-full bg-white" />}
                                  </div>
                                  <span className="text-[11px] font-medium" style={{ color: isSelected ? '#FFFFFF' : 'var(--brand-text-muted)' }}>{reason.label}</span>
                                </div>
                              </motion.button>
                          );

                          })}
                        </div>
                        
                        {/* Campo para outro motivo */}
                        <AnimatePresence>
                          {cancelReason === 'outro' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
                              <textarea value={customReason} onChange={(e) => setCustomReason(e.target.value)} placeholder="Descreva o motivo..." rows={2}
                                className="w-full px-3 py-2 rounded-lg border outline-none resize-none text-xs"
                                style={{ background: 'rgba(255,255,255,0.03)', borderColor: customReason ? 'rgba(239,68,68,0.3)' : 'var(--brand-border)', color: 'var(--brand-text)' }} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      {/* Footer */}
                      <div className="px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--brand-border)' }}>
                        <div className="flex-1 flex items-center gap-1.5">
                          <Icons.AlertCircle className="w-3 h-3" style={{ color: 'var(--brand-text-muted)' }} />
                          <p className="text-[10px]" style={{ color: 'var(--brand-text-muted)' }}>Check-in serÃ¡ marcado como cancelado</p>
                        </div>
                        <motion.button onClick={() => { setShowDeleteConfirm(false); setCancelReason(''); setCustomReason(''); }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          className="px-4 py-2 rounded-lg text-xs font-medium" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--brand-border)', color: 'var(--brand-text)' }}>Voltar</motion.button>
                        <motion.button onClick={handleDelete} disabled={isDeleting || !cancelReason || (cancelReason === 'outro' && !customReason.trim())}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          className="px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{ background: cancelReason ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' : 'rgba(239,68,68,0.15)', boxShadow: cancelReason ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none', color: '#FFFFFF' }}>
                          {isDeleting ? <><Icons.Loader className="w-3 h-3 animate-spin" /><span>Cancelando...</span></> : <><Icons.Close className="w-3 h-3" /><span>Confirmar</span></>}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ModalEditarCheckin;
