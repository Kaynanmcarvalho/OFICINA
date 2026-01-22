/**
 * TORQ - Banner de Caixa Aberto
 * 
 * Banner informativo que aparece quando há um caixa aberto
 * Mostra informações em tempo real e ações rápidas
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, Clock, TrendingUp, Lock, AlertCircle, 
  ChevronDown, ChevronUp 
} from 'lucide-react';
import useCaixaStore from '../../store/caixaStore';

const BannerCaixaAberto = ({ onFecharCaixa }) => {
  const { caixaAtual } = useCaixaStore();
  const [expanded, setExpanded] = useState(false);
  const [tempoAberto, setTempoAberto] = useState('');

  // Atualizar tempo aberto a cada minuto
  useEffect(() => {
    if (!caixaAtual) return;

    const atualizarTempo = () => {
      const dataAbertura = caixaAtual.dataAbertura?.toDate?.() || new Date();
      const agora = new Date();
      const diff = agora - dataAbertura;
      
      const horas = Math.floor(diff / (1000 * 60 * 60));
      const minutos = Math.floor((diff / (1000 * 60)) % 60);
      
      setTempoAberto(`${horas}h ${minutos}min`);
    };

    atualizarTempo();
    const interval = setInterval(atualizarTempo, 60000); // Atualiza a cada minuto

    return () => clearInterval(interval);
  }, [caixaAtual]);

  if (!caixaAtual) return null;

  const formatCurrency = (value) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--color-bg-primary)',
        borderBottom: '2px solid #10B981',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Banner Compacto */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        gap: '16px'
      }}>
        {/* Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }} />
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--color-text-primary)'
            }}>
              Caixa Aberto #{caixaAtual.numero}
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary)'
            }}>
              {caixaAtual.operadorAbertura?.nome || 'Operador'} • {tempoAberto}
            </div>
          </div>
        </div>

        {/* Métricas Rápidas */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flex: 1,
          justifyContent: 'center'
        }}>
          {/* Saldo Esperado */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <DollarSign size={16} style={{ color: '#3B82F6' }} />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                Saldo Esperado
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#3B82F6' }}>
                {formatCurrency(caixaAtual.saldoEsperado)}
              </div>
            </div>
          </div>

          {/* Total Vendas */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <TrendingUp size={16} style={{ color: '#10B981' }} />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                Vendas
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#10B981' }}>
                {caixaAtual.totalVendas || 0}
              </div>
            </div>
          </div>

          {/* Tempo Aberto */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Clock size={16} style={{ color: '#F59E0B' }} />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                Tempo Aberto
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#F59E0B' }}>
                {tempoAberto}
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: '600',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              backgroundColor: 'var(--color-bg-primary)',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--color-bg-secondary)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--color-bg-primary)';
            }}
          >
            <span>Detalhes</span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <button
            onClick={onFecharCaixa}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#DC2626';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#EF4444';
            }}
          >
            <Lock size={14} />
            <span>Fechar Caixa</span>
          </button>
        </div>
      </div>

      {/* Detalhes Expandidos */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            borderTop: '1px solid var(--color-border)',
            padding: '16px 24px',
            backgroundColor: 'var(--color-bg-secondary)'
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {/* Saldo Inicial */}
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                Saldo Inicial
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                {formatCurrency(caixaAtual.saldoInicial)}
              </div>
            </div>

            {/* Entradas Dinheiro */}
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                Entradas (Dinheiro)
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#10B981' }}>
                +{formatCurrency(caixaAtual.entradas.dinheiro)}
              </div>
            </div>

            {/* Entradas PIX */}
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                Entradas (PIX)
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                {formatCurrency(caixaAtual.entradas.pix)}
              </div>
            </div>

            {/* Entradas Cartão */}
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                Entradas (Cartões)
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                {formatCurrency(caixaAtual.entradas.cartaoDebito + caixaAtual.entradas.cartaoCredito)}
              </div>
            </div>

            {/* Saídas */}
            {caixaAtual.saidas.total > 0 && (
              <div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                  Saídas (Sangrias)
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#EF4444' }}>
                  -{formatCurrency(caixaAtual.saidas.total)}
                </div>
              </div>
            )}

            {/* Reforços */}
            {caixaAtual.reforcos.total > 0 && (
              <div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                  Reforços (Troco)
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#10B981' }}>
                  +{formatCurrency(caixaAtual.reforcos.total)}
                </div>
              </div>
            )}

            {/* Total Vendas */}
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                Total de Vendas
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                {formatCurrency(caixaAtual.entradas.total)}
              </div>
            </div>

            {/* Ticket Médio */}
            {caixaAtual.totalVendas > 0 && (
              <div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                  Ticket Médio
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                  {formatCurrency(caixaAtual.entradas.total / caixaAtual.totalVendas)}
                </div>
              </div>
            )}
          </div>

          {/* Observações */}
          {caixaAtual.observacoesAbertura && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: 'var(--color-bg-primary)',
              borderRadius: '8px',
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <AlertCircle size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong>Observações da Abertura:</strong> {caixaAtual.observacoesAbertura}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Animação de pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default BannerCaixaAberto;
