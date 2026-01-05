/**
 * TORQ Budget - Create Route
 * Rota para criação de novo orçamento
 * 
 * Integrado com useBudgetStore para salvar no Firebase
 */

import React, { useCallback } from 'react';
import { BudgetShell } from '../components/BudgetShell';
import { BudgetFlowReturn } from '../hooks/useBudgetFlow';
// @ts-ignore - JS module
import { useBudgetStore } from '../../../store/budgetStore';

// ============================================================================
// TYPES
// ============================================================================
interface CreateBudgetRouteProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (budgetId: string) => void;
  // Pre-fill data from checkin
  checkinData?: {
    checkinId?: string;
    clientId?: string;
    clientName?: string;
    clientPhone?: string;
    clientEmail?: string;
    vehiclePlate?: string;
    vehicleBrand?: string;
    vehicleModel?: string;
    vehicleYear?: string;
    vehicleColor?: string;
  };
}

// ============================================================================
// COMPONENT
// ============================================================================
export const CreateBudgetRoute: React.FC<CreateBudgetRouteProps> = ({
  isOpen,
  onClose,
  onSuccess,
  checkinData,
}) => {
  const { createBudget } = useBudgetStore();
  
  const handleSubmit = useCallback(async (data: BudgetFlowReturn['data']) => {
    try {
      // Calculate totals
      const subtotal = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const total = Math.max(0, subtotal - data.discount);
      
      // Prepare budget data for store
      const budgetData = {
        // Client
        clientId: data.client?.id || null,
        clientName: data.client?.name || '',
        clientPhone: data.client?.phone || '',
        clientEmail: data.client?.email || '',
        
        // Vehicle
        vehiclePlate: data.vehicle?.plate || '',
        vehicleBrand: data.vehicle?.brand || '',
        vehicleModel: data.vehicle?.model || '',
        vehicleYear: data.vehicle?.year || '',
        vehicleColor: data.vehicle?.color || '',
        
        // Items - format for store
        items: data.items.map(item => ({
          id: item.id,
          type: item.type,
          name: item.name,
          description: item.description || '',
          quantity: item.quantity,
          price: item.price,
        })),
        
        // Totals
        subtotal,
        discount: data.discount,
        total,
        
        // Notes
        notes: data.notes,
        internalNotes: data.internalNotes,
        
        // Checkin reference
        checkinId: checkinData?.checkinId || null,
      };
      
      console.log('📋 Creating budget with data:', budgetData);
      
      // Call store to create budget
      const result = await createBudget(budgetData);
      
      if (result.success) {
        console.log('✅ Budget created successfully:', result.data);
        const budgetId = result.data?.id || result.data?.firestoreId;
        onSuccess?.(budgetId);
        return { success: true };
      } else {
        console.error('❌ Failed to create budget:', result.error);
        return { 
          success: false, 
          error: result.error || 'Erro ao criar orçamento' 
        };
      }
      
    } catch (error) {
      console.error('❌ Error creating budget:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao criar orçamento' 
      };
    }
  }, [checkinData, createBudget, onSuccess]);
  
  return (
    <BudgetShell
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      checkinData={checkinData}
      isEditMode={false}
    />
  );
};

export default CreateBudgetRoute;
