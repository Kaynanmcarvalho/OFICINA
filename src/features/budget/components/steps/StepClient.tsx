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
import { colors } from '../../styles/budget.tokens';
import { BudgetFlowReturn } from '../../hooks/useBudgetFlow';

// ============================================================================
// ICONS
// ============================================================================
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" strokeLinejoin="round" />
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 6l-10 7L2 6" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ============================================================================
// COMPONENT
// ============================================================================
interface StepClientProps {
  flow: BudgetFlowReturn;
}

export const StepClient: React.FC<StepClientProps> = ({ flow }) => {
  // Format phone as user types
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };
  
  const hasClientData = flow.data.client?.name;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Client confirmation card */}
      {hasClientData && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '20px 24px',
          background: `linear-gradient(135deg, rgba(48, 209, 88, 0.1) 0%, rgba(48, 209, 88, 0.05) 100%)`,
          border: `1px solid rgba(48, 209, 88, 0.2)`,
          borderRadius: '16px',
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'rgba(48, 209, 88, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.state.success,
          }}>
            <CheckIcon />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ 
              color: colors.text.muted, 
              fontSize: '12px', 
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '4px',
            }}>
              Cliente do Veículo
            </div>
            <div style={{ 
              color: colors.text.primary, 
              fontWeight: 600, 
              fontSize: '17px',
              marginBottom: '2px',
            }}>
              {flow.data.client?.name}
            </div>
            <div style={{ color: colors.text.muted, fontSize: '13px' }}>
              Proprietário vinculado ao check-in
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
        padding: '14px 18px',
        background: 'rgba(10, 132, 255, 0.08)',
        border: '1px solid rgba(10, 132, 255, 0.15)',
        borderRadius: '12px',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: colors.state.info, flexShrink: 0, marginTop: '2px' }}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
        </svg>
        <div style={{ color: colors.text.secondary, fontSize: '13px', lineHeight: 1.5 }}>
          O cliente está vinculado ao veículo do check-in. Você pode atualizar o telefone e e-mail para envio do orçamento.
        </div>
      </div>
    </div>
  );
};

export default StepClient;
