/**
 * TORQ Budget - Step 1: Client
 * Exibe dados do cliente (vindos do checkin)
 * Permite editar apenas email e telefone
 * 
 * NÃO permite trocar cliente - veículos são pessoais
 */

import React from 'react';
import { BudgetSection } from '../BudgetSection';
import { BudgetInput } from '../BudgetInput';
import { colors, getBrandAccent } from '../../styles/budget.tokens';
import { BudgetFlowReturn } from '../../hooks/useBudgetFlow';

// ============================================================================
// ICONS
// ============================================================================
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="5" />
    <path d="M3 21c0-5 4-7 9-7s9 2 9 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" strokeLinejoin="round" />
    <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ============================================================================
// COMPONENT
// ============================================================================
interface StepClientProps {
  flow: BudgetFlowReturn;
}

export const StepClient: React.FC<StepClientProps> = ({ flow }) => {
  // Get brand accent first
  const accent = getBrandAccent(flow.effectiveBrand);
  const hasClientData = flow.data.client?.name;
  
  // Format phone as user types
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Client confirmation card */}
      {hasClientData && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          padding: '18px 20px',
          background: colors.surface.soft,
          border: `1px solid ${colors.border.default}`,
          borderRadius: '10px',
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: colors.surface.medium,
            border: `2px solid ${accent.hex}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.text.primary,
          }}>
            <CheckIcon />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              color: colors.text.primary,
              fontSize: '11px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '4px',
            }}>
              Cliente do Veículo
            </div>
            <div style={{ 
              color: colors.text.primary, 
              fontWeight: 600, 
              fontSize: '16px',
              marginBottom: '2px',
            }}>
              {flow.data.client?.name}
            </div>
            <div style={{ color: colors.text.secondary, fontSize: '13px', fontWeight: 500 }}>
              Vinculado ao check-in
            </div>
          </div>
        </div>
      )}
      
      {/* Editable contact info */}
      <BudgetSection
        title="Informações de Contato"
        description="Atualize os dados de contato se necessário"
        icon={<UserIcon />}
        grid
      >
        {/* Nome - apenas visualização */}
        <div style={{ gridColumn: 'span 2' }}>
          <BudgetInput
            label="Nome do cliente"
            value={flow.data.client?.name || ''}
            disabled
            brand={flow.effectiveBrand}
          />
        </div>
        
        {/* Telefone - editável */}
        <BudgetInput
          label="Telefone"
          placeholder="(00) 00000-0000"
          value={flow.data.client?.phone || ''}
          onChange={(e) => flow.updateClient({ phone: formatPhone(e.target.value) })}
          error={flow.errors.clientPhone}
          required
          icon={<PhoneIcon />}
          brand={flow.effectiveBrand}
        />
        
        {/* Email - editável */}
        <BudgetInput
          label="E-mail"
          placeholder="email@exemplo.com"
          type="email"
          value={flow.data.client?.email || ''}
          onChange={(e) => flow.updateClient({ email: e.target.value })}
          icon={<MailIcon />}
          brand={flow.effectiveBrand}
        />
      </BudgetSection>
      
      {/* Info note */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 16px',
        background: colors.surface.soft,
        border: `1px solid ${colors.border.subtle}`,
        borderRadius: '8px',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: colors.state.info, flexShrink: 0, marginTop: '2px' }}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
        </svg>
        <div style={{ color: colors.text.secondary, fontSize: '12px', lineHeight: 1.4, fontWeight: 500 }}>
          Cliente vinculado ao veículo. Atualize telefone e e-mail para envio do orçamento.
        </div>
      </div>
    </div>
  );
};

export default StepClient;
