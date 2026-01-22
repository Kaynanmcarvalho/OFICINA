/**
 * TORQ - Modal de Abertura de Caixa
 * 
 * Modal premium para abertura de caixa com:
 * - Informação de troco inicial
 * - Seleção de turno
 * - Observações
 * - Validações de segurança
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, AlertCircle, DollarSign, Clock, FileText, 
  Lock, Unlock, Calendar, User 
} from 'lucide-react';
import useCaixaStore from '../../store/caixaStore';
import { useAuthStore } from '../../store';

const ModalAberturaCaixa = ({ isOpen, onClose, onSuccess }) => {
  const { abrirCaixa, isLoading, error } = useCaixaStore();
  const { user } = useAuthStore();
  
  // Estados do formulário
  const [saldoInicial, setSaldoInicial] = useState('100.00');
  const [turno, setTurno] = useState('integral');
  const [observacoes, setObservacoes] = useState('');
  const [validationError, setValidationError] = useState('');
  
  const inputRef = useRef(null);

  // Focar no input ao abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    
    // Limpar formulário ao fechar
    if (!isOpen) {
      setSaldoInicial('100.00');
      setTurno('integral');
      setObservacoes('');
      setValidationError('');
    }
  }, [isOpen]);

  // Formatar valor monetário
  const formatarValor = (valor) => {
    // Remove tudo que não é número
    const numeros = valor.replace(/\D/g, '');
    
    // Converte para centavos
    const centavos = parseInt(numeros, 10) || 0;
    
    // Formata como moeda
    return (centavos / 100).toFixed(2);
  };

  const handleValorChange = (e) => {
    const valorFormatado = formatarValor(e.target.value);
    setSaldoInicial(valorFormatado);
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações
    const valor = parseFloat(saldoInicial);
    
    if (isNaN(valor) || valor < 0) {
      setValidationError('Valor inválido');
      return;
    }
    
    if (valor === 0) {
      setValidationError('O troco inicial deve ser maior que R$ 0,00');
      return;
    }
    
    if (valor > 10000) {
      setValidationError('Valor muito alto. Verifique o troco inicial.');
      return;
    }

    // Abrir caixa
    const resultado = await abrirCaixa(
      valor,
      turno,
      observacoes.trim(),
      user
    );

    if (resultado.success) {
      onSuccess?.(resultado.data);
      onClose();
    } else {
      setValidationError(resultado.error || 'Erro ao abrir caixa');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const turnos = [
    { id: 'manha', label: 'Manhã', horario: '06:00 - 12:00' },
    { id: 'tarde', label: 'Tarde', horario: '12:00 - 18:00' },
    { id: 'noite', label: 'Noite', horario: '18:00 - 00:00' },
    { id: 'integral', label: 'Integral', horario: '06:00 - 00:00' },
  ];

  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const horaAtual = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div 
      className="cmp-overlay" 
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <motion.div 
        className="cmp-modal"
        style={{ maxWidth: '600px' }}
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
      >
        {/* Header */}
        <div className="cmp-header">
          <div className="cmp-header__left">
            <div className="cmp-header__icon" style={{ backgroundColor: '#10B981' }}>
              <Unlock size={18} />
            </div>
            <div className="cmp-header__titles">
              <h2 className="cmp-header__title">Abertura de Caixa</h2>
              <span className="cmp-header__subtitle">Informe o troco inicial para começar</span>
            </div>
          </div>
          <button className="cmp-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Info Bar */}
        <div style={{
          display: 'flex',
          gap: '16px',
          padding: '16px 24px',
          backgroundColor: 'var(--color-bg-secondary)',
          borderBottom: '1px solid var(--color-border)'
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} style={{ color: 'var(--color-text-secondary)' }} />
            <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              {dataAtual}
            </span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} style={{ color: 'var(--color-text-secondary)' }} />
            <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              {horaAtual}
            </span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={16} style={{ color: 'var(--color-text-secondary)' }} />
            <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              {user?.displayName || user?.email || 'Operador'}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Troco Inicial */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--color-text-primary)'
            }}>
              <DollarSign size={16} />
              <span>Troco Inicial</span>
              <span style={{ color: '#EF4444' }}>*</span>
            </label>
            
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--color-text-secondary)'
              }}>
                R$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={saldoInicial}
                onChange={handleValorChange}
                placeholder="0,00"
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 48px',
                  fontSize: '18px',
                  fontWeight: '600',
                  border: '2px solid var(--color-border)',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-bg-primary)',
                  color: 'var(--color-text-primary)',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3B82F6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <p style={{
              marginTop: '8px',
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <AlertCircle size={14} />
              Conte o dinheiro físico antes de informar o valor
            </p>
          </div>

          {/* Turno */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--color-text-primary)'
            }}>
              <Clock size={16} />
              <span>Turno</span>
            </label>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              {turnos.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTurno(t.id)}
                  style={{
                    padding: '12px 16px',
                    border: `2px solid ${turno === t.id ? '#3B82F6' : 'var(--color-border)'}`,
                    borderRadius: '12px',
                    backgroundColor: turno === t.id ? 'rgba(59, 130, 246, 0.1)' : 'var(--color-bg-primary)',
                    color: turno === t.id ? '#3B82F6' : 'var(--color-text-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    if (turno !== t.id) {
                      e.target.style.borderColor = '#3B82F6';
                      e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (turno !== t.id) {
                      e.target.style.borderColor = 'var(--color-border)';
                      e.target.style.backgroundColor = 'var(--color-bg-primary)';
                    }
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {t.label}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>
                    {t.horario}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Observações */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--color-text-primary)'
            }}>
              <FileText size={16} />
              <span>Observações</span>
              <span style={{ fontSize: '12px', fontWeight: '400', color: 'var(--color-text-secondary)' }}>
                (opcional)
              </span>
            </label>
            
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Troco conferido e correto"
              rows={3}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '14px',
                border: '2px solid var(--color-border)',
                borderRadius: '12px',
                backgroundColor: 'var(--color-bg-primary)',
                color: 'var(--color-text-primary)',
                resize: 'vertical',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3B82F6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Avisos */}
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <AlertCircle size={20} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>
                <strong style={{ display: 'block', marginBottom: '8px' }}>Atenção:</strong>
                <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
                  <li>Confira o dinheiro físico antes de abrir o caixa</li>
                  <li>Após abrir, você poderá fazer vendas normalmente</li>
                  <li>Registre sangrias e reforços durante o dia</li>
                  <li>Ao final, feche o caixa e confira o saldo</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Erro de validação */}
          <AnimatePresence>
            {(validationError || error) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0 }} />
                <span style={{ fontSize: '14px', color: '#EF4444' }}>
                  {validationError || error}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                border: '2px solid var(--color-border)',
                borderRadius: '12px',
                backgroundColor: 'var(--color-bg-primary)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isLoading || !saldoInicial || parseFloat(saldoInicial) <= 0}
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: isLoading ? '#9CA3AF' : '#10B981',
                color: '#FFFFFF',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                  </motion.div>
                  <span>Abrindo...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Abrir Caixa</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ModalAberturaCaixa;
