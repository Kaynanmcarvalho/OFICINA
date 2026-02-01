/**
 * TORQ Budget Shell
 * Container principal do modal de orçamento
 * Plano Z0 - Base
 * 
 * "Tudo deve parecer um produto premium automotivo, não um formulário."
 */

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { shellStyles, contentStyles, scrollbarStyles } from '../styles/budget.styles';
import { getBrandAccent, radius } from '../styles/budget.tokens';
import { BudgetHeader } from './BudgetHeader';
import { BudgetFooter } from './BudgetFooter';
import { useBudgetFlow, BudgetFlowReturn } from '../hooks/useBudgetFlow';
import '../styles/budget-theme.css';

// ============================================================================
// STEP CONTENT COMPONENTS (lazy loaded)
// ============================================================================
import { StepClient } from './steps/StepClient';
import { StepVehicle } from './steps/StepVehicle';
import { StepItemsPremium } from './steps/StepItemsPremium';
import { StepSummaryPremium } from './steps/StepSummaryPremium';

const STEP_COMPONENTS = [StepClient, StepVehicle, StepItemsPremium, StepSummaryPremium];

// ============================================================================
// ANIMATIONS
// ============================================================================
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const containerVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: 'spring', damping: 35, stiffness: 400 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.96, 
    y: 20,
    transition: { duration: 0.15 }
  },
};

const contentVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 40 : -40,
    opacity: 0,
    transition: { duration: 0.15 },
  }),
};

// ============================================================================
// COMPONENT
// ============================================================================
interface BudgetShellProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BudgetFlowReturn['data']) => Promise<{ success: boolean; error?: string }>;
  initialData?: Partial<BudgetFlowReturn['data']>;
  checkinData?: {
    clientId?: string;
    clientName?: string;
    clientPhone?: string;
    vehiclePlate?: string;
    vehicleBrand?: string;
    vehicleModel?: string;
    vehicleYear?: string;
    vehicleColor?: string;
  };
  isEditMode?: boolean;
}

export const BudgetShell: React.FC<BudgetShellProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  checkinData,
  isEditMode = false,
}) => {
  // In edit mode, extract checkinData from initialData if not provided
  const effectiveCheckinData = checkinData || (isEditMode && initialData ? {
    clientId: initialData.client?.id,
    clientName: initialData.client?.name,
    clientPhone: initialData.client?.phone,
    vehiclePlate: initialData.vehicle?.plate,
    vehicleBrand: initialData.vehicle?.brand,
    vehicleModel: initialData.vehicle?.model,
    vehicleYear: initialData.vehicle?.year,
    vehicleColor: initialData.vehicle?.color,
  } : undefined);
  
  const flow = useBudgetFlow({ initialData, checkinData: effectiveCheckinData, isEditMode });
  const accent = getBrandAccent(flow.effectiveBrand);
  
  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
  
  // Handle submit
  const handleSubmit = useCallback(async () => {
    if (!flow.validateStep(flow.currentStep)) return;
    
    flow.setIsLoading(true);
    try {
      const result = await onSubmit(flow.data);
      if (result.success) {
        onClose();
        flow.reset();
      } else {
        flow.setErrors({ submit: result.error || 'Erro ao salvar orçamento' });
      }
    } catch (error) {
      flow.setErrors({ submit: 'Erro inesperado ao salvar' });
    } finally {
      flow.setIsLoading(false);
    }
  }, [flow, onSubmit, onClose]);
  
  // Get current step component
  const StepComponent = STEP_COMPONENTS[flow.currentStep];
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        key="budget-overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={shellStyles.overlay}
        onClick={onClose}
      >
        {/* Inject scrollbar styles */}
        <style>{scrollbarStyles}</style>
        
        <motion.div
          key="budget-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="budget-modal-container"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '960px',
            maxHeight: '90vh',
            borderRadius: radius.xl,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="budget-modal-header relative p-4 px-8 border-b z-10">
            <BudgetHeader
              title={isEditMode ? 'Editar Orçamento' : 'Novo Orçamento'}
              subtitle="Sistema de orçamentos TORQ"
              plate={flow.data.vehicle?.plate}
              brand={flow.effectiveBrand}
              model={flow.data.vehicle?.model}
              year={flow.data.vehicle?.year}
              isEditMode={isEditMode}
              currentStep={flow.currentStep}
              onStepClick={flow.goToStep}
              isStepValid={flow.isStepValid}
              onClose={onClose}
            />
          </div>
          
          {/* Content Area */}
          <div 
            className="budget-modal-content flex-1 overflow-y-auto overflow-x-hidden p-8"
          >
            <AnimatePresence mode="wait" custom={flow.direction}>
              <motion.div
                key={flow.currentStep}
                custom={flow.direction}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ position: 'relative', zIndex: 1 }}
              >
                <StepComponent flow={flow} />
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Footer */}
          <div className="budget-modal-footer relative p-4 px-8 border-t z-10">
            <BudgetFooter
              currentStep={flow.currentStep}
              totalSteps={flow.steps.length}
              total={flow.total}
              subtotal={flow.subtotal}
              discount={flow.data.discount}
              canProceed={flow.canProceed}
              isLoading={flow.isLoading}
              brand={flow.effectiveBrand}
              onPrev={flow.prevStep}
              onNext={flow.nextStep}
              onSubmit={handleSubmit}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BudgetShell;
