/**
 * TORQ Budget - Step 2: Vehicle
 * Exibe dados do veículo (vindos do checkin)
 * Placa em destaque premium
 * 
 * Dados do veículo são apenas visualização
 */

import React from 'react';
import { BudgetSection } from '../BudgetSection';
import { colors, getBrandAccent } from '../../styles/budget.tokens';
import { BudgetFlowReturn } from '../../hooks/useBudgetFlow';

// ============================================================================
// ICONS
// ============================================================================
const CarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M5 17h14v-5l-2-4H7l-2 4v5z" strokeLinejoin="round" />
    <circle cx="7.5" cy="17" r="1.5" />
    <circle cx="16.5" cy="17" r="1.5" />
  </svg>
);

const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ============================================================================
// COMPONENT
// ============================================================================
interface StepVehicleProps {
  flow: BudgetFlowReturn;
}

export const StepVehicle: React.FC<StepVehicleProps> = ({ flow }) => {
  const accent = getBrandAccent(flow.effectiveBrand);
  const hasVehicleData = flow.data.vehicle?.plate;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Vehicle Hero Card */}
      {hasVehicleData && (
        <div style={{
          padding: '32px',
          background: `linear-gradient(135deg, rgba(${accent.rgb}, 0.12) 0%, rgba(${accent.rgb}, 0.04) 100%)`,
          border: `1px solid rgba(${accent.rgb}, 0.25)`,
          borderRadius: '20px',
          textAlign: 'center',
        }}>
          {/* Plate - DESTAQUE MÁXIMO */}
          <div style={{
            display: 'inline-block',
            padding: '16px 40px',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 100%)',
            borderRadius: '8px',
            border: '3px solid #1a1a1a',
            boxShadow: `
              0 4px 20px rgba(0, 0, 0, 0.3),
              inset 0 2px 0 rgba(255, 255, 255, 0.8),
              0 0 40px rgba(${accent.rgb}, 0.2)
            `,
            marginBottom: '24px',
          }}>
            <div style={{
              fontFamily: 'ui-monospace, SFMono-Regular, "FE-Schrift", Menlo, Monaco, Consolas, monospace',
              fontSize: '36px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#1a1a1a',
              textTransform: 'uppercase',
            }}>
              {flow.data.vehicle?.plate}
            </div>
          </div>
          
          {/* Vehicle Info */}
          <div style={{ marginBottom: '8px' }}>
            <span style={{
              color: colors.text.primary,
              fontSize: '20px',
              fontWeight: 600,
            }}>
              {flow.data.vehicle?.brand} {flow.data.vehicle?.model}
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            color: colors.text.muted,
            fontSize: '14px',
          }}>
            {flow.data.vehicle?.year && (
              <span>Ano {flow.data.vehicle.year}</span>
            )}
            {flow.data.vehicle?.year && flow.data.vehicle?.color && (
              <span style={{ opacity: 0.4 }}>•</span>
            )}
            {flow.data.vehicle?.color && (
              <span>{flow.data.vehicle.color}</span>
            )}
          </div>
        </div>
      )}
      
      {/* Vehicle Details Section */}
      <BudgetSection
        title="Dados do Veículo"
        description="Informações do veículo vinculado ao check-in"
        icon={<CarIcon />}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
        }}>
          {/* Marca */}
          <div style={{
            padding: '16px 20px',
            background: colors.surface.soft,
            borderRadius: '12px',
            border: `1px solid ${colors.border.subtle}`,
          }}>
            <div style={{
              color: colors.text.muted,
              fontSize: '12px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '6px',
            }}>
              Marca
            </div>
            <div style={{
              color: colors.text.primary,
              fontSize: '16px',
              fontWeight: 600,
            }}>
              {flow.data.vehicle?.brand || '—'}
            </div>
          </div>
          
          {/* Modelo */}
          <div style={{
            padding: '16px 20px',
            background: colors.surface.soft,
            borderRadius: '12px',
            border: `1px solid ${colors.border.subtle}`,
          }}>
            <div style={{
              color: colors.text.muted,
              fontSize: '12px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '6px',
            }}>
              Modelo
            </div>
            <div style={{
              color: colors.text.primary,
              fontSize: '16px',
              fontWeight: 600,
            }}>
              {flow.data.vehicle?.model || '—'}
            </div>
          </div>
          
          {/* Ano */}
          <div style={{
            padding: '16px 20px',
            background: colors.surface.soft,
            borderRadius: '12px',
            border: `1px solid ${colors.border.subtle}`,
          }}>
            <div style={{
              color: colors.text.muted,
              fontSize: '12px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '6px',
            }}>
              Ano
            </div>
            <div style={{
              color: colors.text.primary,
              fontSize: '16px',
              fontWeight: 600,
            }}>
              {flow.data.vehicle?.year || '—'}
            </div>
          </div>
          
          {/* Cor */}
          <div style={{
            padding: '16px 20px',
            background: colors.surface.soft,
            borderRadius: '12px',
            border: `1px solid ${colors.border.subtle}`,
          }}>
            <div style={{
              color: colors.text.muted,
              fontSize: '12px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '6px',
            }}>
              Cor
            </div>
            <div style={{
              color: colors.text.primary,
              fontSize: '16px',
              fontWeight: 600,
            }}>
              {flow.data.vehicle?.color || '—'}
            </div>
          </div>
        </div>
      </BudgetSection>
      
      {/* Confirmation badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '16px 20px',
        background: 'rgba(48, 209, 88, 0.08)',
        border: '1px solid rgba(48, 209, 88, 0.15)',
        borderRadius: '12px',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'rgba(48, 209, 88, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.state.success,
        }}>
          <CheckIcon />
        </div>
        <div>
          <div style={{ color: colors.text.primary, fontSize: '14px', fontWeight: 600 }}>
            Veículo confirmado
          </div>
          <div style={{ color: colors.text.muted, fontSize: '13px' }}>
            Dados importados do check-in
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepVehicle;
