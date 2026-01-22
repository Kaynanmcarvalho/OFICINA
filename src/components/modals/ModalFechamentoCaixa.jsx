/**
 * TORQ - Modal de Fechamento de Caixa
 * 
 * Modal premium para fechamento de caixa com:
 * - Resumo de movimentações
 * - Contagem de saldo
 * - Cálculo de diferença
 * - Justificativa (se necessário)
 * - Autorização (se necessário)
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, AlertCircle, DollarSign, Lock, FileText, 
  TrendingUp, TrendingDown, Calendar, Clock, User, Shield
} from 'lucide-react';
import useCaixaStore from '../../store/caixaStore';
import { useAuthStore } from '../../store';

const ModalFechamentoCaixa = ({ isOpen, onClose, onSuccess }) => {
  const { caixaAtual, fecharCaixa, isLoading, error } = useCaixaStore();
  const { user } = useAuthStore();
  
  // Estados do formulário
  const [saldoContado, setSaldoContado] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [senhaGerente, setSenhaGerente] = useState('');
  const [validationError, setValidationError] = useState('');
  
  const inputRef = useRef(null);

  // Calcular diferença
  const diferenca = saldoContado ? parseFloat(saldoContado) - (caixaAtual?.saldoEsperado || 0) : 0;
  const temDiferenca = Math.abs(diferenca) > 0.01;
  const diferencaSignificativa = Math.abs(diferenca) > 5;
  const diferencaCritica = Math.abs(diferenca) > 10;
  const diferencaGrave = Math.abs(diferenca) > 50;

  // Focar no input ao abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    
    // Limpar formulário ao fechar
    if (!isOpen) {
      setSaldoContado('');
      setObservacoes('');
      setJustificativa('');
      setSenhaGerente('');
      setValidationError('');
    }
  }, [isOpen]);

  // Formatar valor monetário
  const formatarValor = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    const centavos = parseInt(numeros, 10) || 0;
    return (centavos / 100).toFixed(2);
  };

  const handleValorChange = (e) => {
    const valorFormatado = formatarValor(e.target.value);
    setSaldoContado(valorFormatado);
    setValidationError('');
  };

  const formatCurrency = (value) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações
    const valor = parseFloat(saldoContado);
    
    if (isNaN(valor) || valor < 0) {
      setValidationError('Valor inválido');
      return;
    }
    
    // Validar justificativa para diferenças significativas
    if (diferencaSignificativa && !justificativa.trim()) {
      setValidationError('Justificativa obrigatória para diferenças acima de R$ 5,00');
      return;
    }
    
    // Validar autorização para diferenças críticas
    if (diferencaCritica && !senhaGerente.trim()) {
      setValidationError('Autorização de gerente obrigatória para diferenças acima de R$ 10,00');
      return;
    }

    // Fechar caixa
    const resultado = await fecharCaixa(
      valor,
      observacoes.trim(),
      justificativa.trim(),
      senhaGerente.trim() ? { senha: senhaGerente } : null
    );

    if (resultado.success) {
      onSuccess?.(resultado);
      onClose();
    } else {
      setValidationError(resultado.error || 'Erro ao fechar caixa');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen || !caixaAtual) return null;

  const dataAbertura = caixaAtual.dataAbertura?.toDate?.() || new Date();
  const horasAbertas = Math.floor((new Date() - dataAbertura) / (1000 * 60 * 60));
  const minutosAbertas = Math.floor(((new Date() - dataAbertura) / (1000 * 60)) % 60);

  return (
    <div 
      className="cmp-overlay" 
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <motion.div 
        className="cmp-modal"
        style={{ maxWidth: '700px', maxHeight: '90vh', overflow: 'auto' }}
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
      >
        {/* Header */}
        <div className="cmp-header">
          <div className="cmp-header__left">
            <div className="cmp-header__icon" style={{ backgroundColor: '#EF4444' }}>
              <Lock size={18} />
            </div>
            <div className="cmp-header__titles">
              <h2 className="cmp-header__title">Fechamento de Caixa</h2>
              <span className="cmp-header__subtitle">
                Caixa #{caixaAtual.numero} • {horasAbertas}h {minutosAbertas}min aberto
              </span>
            </div>
          </div>
          <button className="cmp-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Resumo do Caixa */}
        <div style={{
          padding: '24px',
          backgroundColor: 'var(--color-bg-secondary)',
          borderBottom: '1px solid var(--color-border)'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--color-text-primary)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <DollarSign size={16} />
            Resumo de Movimentações
          </h3>

          <div style={{
            display: 'grid',
            gap: '12px'
          }}>
            {/* Saldo Inicial */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              backgroundColor: 'var(--color-bg-primary)',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                Saldo Inicial
              </span>
              <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                {formatCurrency(caixaAtual.saldoInicial)}
              </span>
            </div>

            {/* Entradas */}
            <div style={{
              padding: '12px 16px',
              backgroundColor: 'var(--color-bg-primary)',
              borderRadius: '8px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                  Entradas (Dinheiro)
                </span>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#10B981' }}>
                  {formatCurrency(caixaAtual.entradas.dinheiro)}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>• PIX:</span>
                  <span>{formatCurrency(caixaAtual.entradas.pix)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>• Cartão Débito:</span>
                  <span>{formatCurrency(caixaAtual.entradas.cartaoDebito)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>• Cartão Crédito:</span>
                  <span>{formatCurrency(caixaAtual.entradas.cartaoCredito)}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginTop: '8px',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--color-border)'
                }}>
                  <span style={{ fontWeight: '600' }}>Total Vendas:</span>
                  <span style={{ fontWeight: '600' }}>{formatCurrency(caixaAtual.entradas.total)}</span>
                </div>
              </div>
            </div>

            {/* Saídas */}
            {(caixaAtual.saidas.total > 0) && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: 'var(--color-bg-primary)',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                  Saídas (Sangrias)
                </span>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#EF4444' }}>
                  -{formatCurrency(caixaAtual.saidas.total)}
                </span>
              </div>
            )}

            {/* Reforços */}
            {(caixaAtual.reforcos.total > 0) && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: 'var(--color-bg-primary)',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                  Reforços (Troco)
                </span>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#10B981' }}>
                  +{formatCurrency(caixaAtual.reforcos.total)}
                </span>
              </div>
            )}

            {/* Saldo Esperado */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              backgroundColor: '#3B82F6',
              borderRadius: '8px',
              marginTop: '8px'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF' }}>
                SALDO ESPERADO (Dinheiro Físico)
              </span>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#FFFFFF' }}>
                {formatCurrency(caixaAtual.saldoEsperado)}
              </span>
            </div>
          </div>

          <p style={{
            marginTop: '12px',
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <AlertCircle size={14} />
            Valores em PIX e cartão não entram no caixa físico
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Contagem do Caixa */}
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
              <span>Contagem do Caixa</span>
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
                value={saldoContado}
                onChange={handleValorChange}
                placeholder="0,00"
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 48px',
                  fontSize: '18px',
                  fontWeight: '600',
                  border: `2px solid ${temDiferenca ? (diferenca > 0 ? '#10B981' : '#EF4444') : 'var(--color-border)'}`,
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-bg-primary)',
                  color: 'var(--color-text-primary)',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  if (!temDiferenca) {
                    e.target.style.borderColor = '#3B82F6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  if (!temDiferenca) {
                    e.target.style.borderColor = 'var(--color-border)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              />
            </div>
            
            <p style={{
              marginTop: '8px',
              fontSize: '13px',
              color: 'var(--color-text-secondary)'
            }}>
              Conte todo o dinheiro físico no caixa
            </p>
          </div>

          {/* Diferença */}
          <AnimatePresence>
            {saldoContado && temDiferenca && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  padding: '16px',
                  backgroundColor: diferenca > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${diferenca > 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  {diferenca > 0 ? (
                    <TrendingUp size={24} style={{ color: '#10B981' }} />
                  ) : (
                    <TrendingDown size={24} style={{ color: '#EF4444' }} />
                  )}
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                      {diferenca > 0 ? 'SOBRA DETECTADA' : 'FALTA DETECTADA'}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: diferenca > 0 ? '#10B981' : '#EF4444' }}>
                      {diferenca > 0 ? '+' : ''}{formatCurrency(Math.abs(diferenca))}
                    </div>
                  </div>
                </div>
                
                {diferencaGrave && (
                  <p style={{ fontSize: '13px', color: '#EF4444', marginTop: '12px' }}>
                    ⚠️ Diferença grave! Verifique a contagem antes de prosseguir.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Justificativa (se necessário) */}
          {diferencaSignificativa && (
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
                <span>Justificativa da Diferença</span>
                <span style={{ color: '#EF4444' }}>*</span>
              </label>
              
              <textarea
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
                placeholder="Ex: Nota de R$ 10 rasgada e descartada"
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
          )}

          {/* Autorização de Gerente (se necessário) */}
          {diferencaCritica && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                padding: '16px',
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Shield size={20} style={{ color: '#F59E0B' }} />
                  <div style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>
                    <strong>Autorização Necessária</strong>
                    <p style={{ margin: '4px 0 0 0', opacity: 0.8 }}>
                      Diferenças acima de R$ 10,00 requerem autorização de gerente
                    </p>
                  </div>
                </div>
              </div>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--color-text-primary)'
              }}>
                <Lock size={16} />
                <span>Senha do Gerente</span>
                <span style={{ color: '#EF4444' }}>*</span>
              </label>
              
              <input
                type="password"
                value={senhaGerente}
                onChange={(e) => setSenhaGerente(e.target.value)}
                placeholder="Digite a senha do gerente"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
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
          )}

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
              <span>Observações do Fechamento</span>
              <span style={{ fontSize: '12px', fontWeight: '400', color: 'var(--color-text-secondary)' }}>
                (opcional)
              </span>
            </label>
            
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Caixa conferido e correto"
              rows={2}
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
              disabled={isLoading || !saldoContado || parseFloat(saldoContado) < 0}
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: isLoading ? '#9CA3AF' : '#EF4444',
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
                  <span>Fechando...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Fechar Caixa</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ModalFechamentoCaixa;
