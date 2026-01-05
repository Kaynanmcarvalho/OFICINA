/**
 * TORQ Budget - Step 4: Summary
 * Revisão final e confirmação do orçamento
 * 
 * Design premium com resumo visual completo
 */

import React from 'react';
import { BudgetSection, SectionCard } from '../BudgetSection';
import { BudgetInput, BudgetTextarea } from '../BudgetInput';
import { colors, getBrandAccent } from '../../styles/budget.tokens';
import { BudgetFlowReturn } from '../../hooks/useBudgetFlow';

// ============================================================================
// ICONS
// ============================================================================
const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
  </svg>
);

const CarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M5 17h14v-5l-2-4H7l-2 4v5z" strokeLinejoin="round" />
    <circle cx="7.5" cy="17" r="1.5" />
    <circle cx="16.5" cy="17" r="1.5" />
  </svg>
);

const PackageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2l9 4.5v11L12 22l-9-4.5v-11L12 2z" strokeLinejoin="round" />
    <path d="M12 22V11M12 11l9-4.5M12 11L3 6.5" strokeLinecap="round" />
  </svg>
);

const WrenchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinejoin="round" />
  </svg>
);

const NotesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" strokeLinejoin="round" />
    <path d="M14 2v6h6M8 13h8M8 17h5" strokeLinecap="round" />
  </svg>
);

const TagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ============================================================================
// COMPONENT
// ============================================================================
interface StepSummaryProps {
  flow: BudgetFlowReturn;
}

export const StepSummary: React.FC<StepSummaryProps> = ({ flow }) => {
  const accent = getBrandAccent(flow.effectiveBrand);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  // Count items by type
  const productCount = flow.data.items.filter(i => i.type === 'product').length;
  const serviceCount = flow.data.items.filter(i => i.type === 'service').length;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {/* Client Card */}
        <SectionCard>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(48, 209, 88, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.state.success,
              flexShrink: 0,
            }}>
              <CheckCircleIcon />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                color: colors.text.muted, 
                fontSize: '12px', 
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '4px',
              }}>
                Cliente
              </div>
              <div style={{ 
                color: colors.text.primary, 
                fontSize: '15px', 
                fontWeight: 600,
                marginBottom: '2px',
              }}>
                {flow.data.client?.name || 'Não informado'}
              </div>
              <div style={{ color: colors.text.muted, fontSize: '13px' }}>
                {flow.data.client?.phone}
              </div>
            </div>
          </div>
        </SectionCard>
        
        {/* Vehicle Card */}
        <SectionCard>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: `rgba(${accent.rgb}, 0.15)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accent.hex,
              flexShrink: 0,
            }}>
              <CarIcon />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                color: colors.text.muted, 
                fontSize: '12px', 
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '4px',
              }}>
                Veículo
              </div>
              <div style={{ 
                color: colors.text.primary, 
                fontSize: '15px', 
                fontWeight: 600,
                marginBottom: '2px',
              }}>
                {flow.data.vehicle?.brand} {flow.data.vehicle?.model}
              </div>
              <div style={{ 
                color: accent.hex, 
                fontSize: '13px',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontWeight: 600,
                letterSpacing: '0.1em',
              }}>
                {flow.data.vehicle?.plate}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
      
      {/* Items Summary */}
      <BudgetSection
        title="Itens do Orçamento"
        description={`${productCount} produto${productCount !== 1 ? 's' : ''} e ${serviceCount} serviço${serviceCount !== 1 ? 's' : ''}`}
        icon={<PackageIcon />}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {flow.data.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: colors.surface.soft,
                borderRadius: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: item.type === 'product' 
                    ? 'rgba(10, 132, 255, 0.15)' 
                    : 'rgba(255, 159, 10, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.type === 'product' ? colors.state.info : colors.state.warning,
                }}>
                  {item.type === 'product' ? <PackageIcon /> : <WrenchIcon />}
                </div>
                <div>
                  <div style={{ color: colors.text.primary, fontSize: '14px', fontWeight: 500 }}>
                    {item.name}
                  </div>
                  <div style={{ color: colors.text.muted, fontSize: '12px' }}>
                    {item.quantity}x {formatCurrency(item.price)}
                  </div>
                </div>
              </div>
              <div style={{ color: colors.text.primary, fontWeight: 600, fontSize: '14px' }}>
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
        
        {/* Totals */}
        <div style={{
          marginTop: '16px',
          padding: '16px',
          background: colors.surface.medium,
          borderRadius: '12px',
          border: `1px solid ${colors.border.subtle}`,
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '8px',
            color: colors.text.secondary,
            fontSize: '14px',
          }}>
            <span>Subtotal</span>
            <span>{formatCurrency(flow.subtotal)}</span>
          </div>
          
          {flow.data.discount > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '8px',
              color: colors.state.success,
              fontSize: '14px',
            }}>
              <span>Desconto</span>
              <span>-{formatCurrency(flow.data.discount)}</span>
            </div>
          )}
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: `1px solid ${colors.border.subtle}`,
            color: colors.text.primary,
            fontSize: '18px',
            fontWeight: 700,
          }}>
            <span>Total</span>
            <span style={{ color: accent.hex }}>{formatCurrency(flow.total)}</span>
          </div>
        </div>
      </BudgetSection>
      
      {/* Discount */}
      <BudgetSection
        title="Desconto"
        description="Aplique um desconto ao orçamento (opcional)"
        icon={<TagIcon />}
      >
        <BudgetInput
          label="Valor do desconto"
          placeholder="R$ 0,00"
          type="number"
          min={0}
          max={flow.subtotal}
          value={flow.data.discount || ''}
          onChange={(e) => flow.updateDiscount(Number(e.target.value) || 0)}
          brand={flow.effectiveBrand}
        />
      </BudgetSection>
      
      {/* Notes */}
      <BudgetSection
        title="Observações"
        description="Informações adicionais para o cliente"
        icon={<NotesIcon />}
      >
        <BudgetTextarea
          label="Observações do orçamento"
          placeholder="Condições de pagamento, prazo de validade, garantias..."
          value={flow.data.notes}
          onChange={(e) => flow.updateNotes(e.target.value)}
          brand={flow.effectiveBrand}
        />
        
        <BudgetTextarea
          label="Observações internas"
          placeholder="Notas internas (não visíveis para o cliente)"
          value={flow.data.internalNotes}
          onChange={(e) => flow.updateInternalNotes(e.target.value)}
          brand={flow.effectiveBrand}
        />
      </BudgetSection>
      
      {/* Submit Error */}
      {flow.errors.submit && (
        <div style={{
          padding: '16px 20px',
          background: 'rgba(255, 69, 58, 0.1)',
          border: '1px solid rgba(255, 69, 58, 0.2)',
          borderRadius: '12px',
          color: colors.state.error,
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {flow.errors.submit}
        </div>
      )}
    </div>
  );
};

export default StepSummary;
