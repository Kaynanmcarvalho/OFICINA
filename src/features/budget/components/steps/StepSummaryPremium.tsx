/**
 * TORQ Budget - Step 4: Summary PREMIUM
 * Design Apple-like impressionante com glassmorphism e hierarquia visual forte
 * 
 * Visual de aplicativo nativo iOS/macOS - Revisão final elegante
 */

import React from 'react';
import { motion } from 'framer-motion';
import { colors, getBrandAccent } from '../../styles/budget.tokens';
import { BudgetFlowReturn } from '../../hooks/useBudgetFlow';

// ============================================================================
// PREMIUM ICONS - Mais ricos e detalhados
// ============================================================================
const CheckCircleIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" strokeLinejoin="round" />
    <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const UserIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
  </svg>
);
const CarIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 11l1.5-4.5A2 2 0 018.4 5h7.2a2 2 0 011.9 1.5L19 11" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 11v6a2 2 0 002 2h1a2 2 0 002-2v-1h8v1a2 2 0 002 2h1a2 2 0 002-2v-6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="15" r="1.5" fill="currentColor" />
    <circle cx="17" cy="15" r="1.5" fill="currentColor" />
    <path d="M3 11h18" strokeLinecap="round" />
  </svg>
);

const PackageIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l9 4.5v11L12 22l-9-4.5v-11L12 2z" strokeLinejoin="round" />
    <path d="M12 22V11M12 11l9-4.5M12 11L3 6.5" strokeLinecap="round" />
  </svg>
);

const WrenchIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinejoin="round" />
  </svg>
);

const NotesIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" strokeLinejoin="round" />
    <path d="M14 2v6h6M8 13h8M8 17h5" strokeLinecap="round" />
  </svg>
);

const TagIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SparklesIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" strokeLinejoin="round" />
    <path d="M19 3l.75 2.25L22 6l-2.25.75L19 9l-.75-2.25L16 6l2.25-.75L19 3z" strokeLinejoin="round" />
  </svg>
);

const ReceiptIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" strokeLinejoin="round" />
    <path d="M8 7h8M8 11h8M8 15h5" strokeLinecap="round" />
  </svg>
);
// ============================================================================
// COMPONENT
// ============================================================================
interface StepSummaryPremiumProps {
  flow: BudgetFlowReturn;
}

export const StepSummaryPremium: React.FC<StepSummaryPremiumProps> = ({ flow }) => {
  const accent = getBrandAccent(flow.effectiveBrand);
  const [hoveredItemId, setHoveredItemId] = React.useState<string | null>(null);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const productCount = flow.data.items.filter(i => i.type === 'product').length;
  const serviceCount = flow.data.items.filter(i => i.type === 'service').length;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '8px 0' }}>
      {/* Hero Section simplificado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: colors.surface.soft,
          border: `1px solid ${colors.border.subtle}`,
          borderRadius: '12px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: `${accent.hex}12`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.text.primary,
          }}>
            <CheckCircleIcon size={22} />
          </div>
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 600,
              color: colors.text.primary,
              margin: 0,
              letterSpacing: '-0.01em',
            }}>
              Revisar e Finalizar
            </h2>
            <p style={{
              fontSize: '14px',
              color: colors.text.secondary,
              margin: '4px 0 0 0',
            }}>
              Confira todos os detalhes antes de enviar
            </p>
          </div>
        </div>
      </motion.div>

      {/* Client & Vehicle Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {/* Client Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            padding: '20px',
            background: colors.surface.soft,
            border: `1px solid ${colors.border.subtle}`,
            borderRadius: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: `${accent.hex}12`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.text.primary,
              flexShrink: 0,
            }}>
              <UserIcon size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                color: colors.text.primary, 
                fontSize: '11px', 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '6px',
              }}>
                Cliente
              </div>
              <div style={{ 
                color: colors.text.primary, 
                fontSize: '15px', 
                fontWeight: 600,
                marginBottom: '4px',
              }}>
                {flow.data.client?.name || 'Não informado'}
              </div>
              <div style={{ 
                color: colors.text.secondary, 
                fontSize: '13px',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontWeight: 500,
              }}>
                {flow.data.client?.phone}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Vehicle Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            padding: '20px',
            background: colors.surface.soft,
            border: `1px solid ${colors.border.subtle}`,
            borderRadius: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: `${accent.hex}12`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.text.primary,
              flexShrink: 0,
            }}>
              <CarIcon size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                color: colors.text.primary, 
                fontSize: '11px', 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '6px',
              }}>
                Veículo
              </div>
              <div style={{ 
                color: colors.text.primary, 
                fontSize: '15px', 
                fontWeight: 600,
                marginBottom: '4px',
              }}>
                {flow.data.vehicle?.brand} {flow.data.vehicle?.model}
              </div>
              <div style={{ 
                color: colors.text.primary, 
                fontSize: '13px',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontWeight: 700,
                letterSpacing: '0.12em',
              }}>
                {flow.data.vehicle?.plate}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Items Section simplificado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: colors.surface.soft,
          border: `1px solid ${colors.border.subtle}`,
          borderRadius: '12px',
          padding: '24px',
        }}
      >
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: `${accent.hex}12`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.text.primary,
          }}>
            <ReceiptIcon size={20} />
          </div>
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: colors.text.primary,
              margin: 0,
              letterSpacing: '-0.01em',
            }}>
              Itens do Orçamento
            </h3>
            <p style={{
              fontSize: '13px',
              color: colors.text.secondary,
              margin: '2px 0 0 0',
              fontWeight: 500,
            }}>
              {productCount} produto{productCount !== 1 ? 's' : ''} • {serviceCount} serviço{serviceCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {flow.data.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + index * 0.05 }}
              onMouseEnter={() => setHoveredItemId(item.id)}
              onMouseLeave={() => setHoveredItemId(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                background: hoveredItemId === item.id ? colors.base.secondary : colors.base.secondary,
                border: `1px solid ${hoveredItemId === item.id ? accent.hex + '15' : colors.border.subtle}`,
                borderRadius: '10px',
                transition: 'all 0.2s',
                transform: hoveredItemId === item.id ? 'translateX(2px)' : 'translateX(0)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: `${accent.hex}12`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: accent.hex,
                  flexShrink: 0,
                }}>
                  {item.type === 'product' ? <PackageIcon size={18} /> : <WrenchIcon size={18} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    color: colors.text.primary, 
                    fontSize: '15px', 
                    fontWeight: 600,
                    marginBottom: '2px',
                  }}>
                    {item.name}
                  </div>
                  <div style={{ 
                    color: colors.text.secondary, 
                    fontSize: '13px',
                    fontWeight: 500,
                  }}>
                    {item.quantity}x {formatCurrency(item.price)}
                  </div>
                </div>
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: 700,
                color: colors.text.primary,
                minWidth: '90px',
                textAlign: 'right',
              }}>
                {formatCurrency(item.price * item.quantity)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Totals com fundo PRETO ESCURO e textos BRANCOS */}
        <div style={{
          padding: '24px',
          background: '#050709',
          border: `2px solid ${accent.hex}20`,
          borderRadius: '14px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '12px',
            color: '#FFFFFF',
            fontSize: '15px',
            fontWeight: 600,
          }}>
            <span>Subtotal</span>
            <span style={{ fontWeight: 700 }}>{formatCurrency(flow.subtotal)}</span>
          </div>
          
          {flow.data.discount > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '12px',
              color: '#10B981',
              fontSize: '15px',
              fontWeight: 600,
            }}>
              <span>Desconto</span>
              <span style={{ fontWeight: 700 }}>-{formatCurrency(flow.data.discount)}</span>
            </div>
          )}
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '16px',
            borderTop: `2px solid rgba(255, 255, 255, 0.2)`,
            color: '#FFFFFF',
            fontSize: '28px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}>
            <span>Total</span>
            <span style={{ 
              color: '#FFFFFF',
              background: accent.hex,
              padding: '8px 24px',
              borderRadius: '12px',
              boxShadow: `0 4px 16px ${accent.hex}40`,
            }}>
              {formatCurrency(flow.total)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Discount Section simplificado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          background: colors.surface.soft,
          border: `1px solid ${colors.border.subtle}`,
          borderRadius: '12px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: `${accent.hex}12`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.text.primary,
          }}>
            <TagIcon size={20} />
          </div>
          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: colors.text.primary,
              margin: 0,
            }}>
              Desconto
            </h3>
            <p style={{
              fontSize: '13px',
              color: colors.text.secondary,
              margin: '2px 0 0 0',
              fontWeight: 500,
            }}>
              Aplique um desconto ao orçamento (opcional)
            </p>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '16px',
            fontWeight: 600,
            color: colors.text.muted,
          }}>
            R$
          </div>
          <input
            type="number"
            min={0}
            max={flow.subtotal}
            value={flow.data.discount || ''}
            onChange={(e) => flow.updateDiscount(Number(e.target.value) || 0)}
            placeholder="0,00"
            style={{
              width: '100%',
              padding: '14px 20px 14px 48px',
              background: colors.base.secondary,
              border: `1px solid ${colors.border.subtle}`,
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              color: colors.text.primary,
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = accent.hex + '30';
              e.target.style.boxShadow = `0 0 0 3px ${accent.hex}10`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border.subtle;
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </motion.div>

      {/* Notes Section simplificado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{
          background: colors.surface.soft,
          border: `1px solid ${colors.border.subtle}`,
          borderRadius: '12px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: `${accent.hex}12`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.text.primary,
          }}>
            <NotesIcon size={20} />
          </div>
          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: colors.text.primary,
              margin: 0,
            }}>
              Observações
            </h3>
            <p style={{
              fontSize: '13px',
              color: colors.text.secondary,
              margin: '2px 0 0 0',
              fontWeight: 500,
            }}>
              Informações adicionais para o cliente
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <textarea
            placeholder="Condições de pagamento, prazo de validade, garantias..."
            value={flow.data.notes}
            onChange={(e) => flow.updateNotes(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: colors.base.secondary,
              border: `1px solid ${colors.border.subtle}`,
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 500,
              color: colors.text.primary,
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = accent.hex + '30';
              e.target.style.boxShadow = `0 0 0 3px ${accent.hex}10`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border.subtle;
              e.target.style.boxShadow = 'none';
            }}
          />

          <textarea
            placeholder="Notas internas (não visíveis para o cliente)"
            value={flow.data.internalNotes}
            onChange={(e) => flow.updateInternalNotes(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: colors.base.secondary,
              border: `1px solid ${colors.border.subtle}`,
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 500,
              color: colors.text.primary,
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = accent.hex + '30';
              e.target.style.boxShadow = `0 0 0 3px ${accent.hex}10`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border.subtle;
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </motion.div>

      {/* Error Message */}
      {flow.errors.submit && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '14px 18px',
            background: '#EF444412',
            border: '1px solid #EF444425',
            borderRadius: '12px',
            color: '#EF4444',
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {flow.errors.submit}
        </motion.div>
      )}
    </div>
  );
};

export default StepSummaryPremium;
