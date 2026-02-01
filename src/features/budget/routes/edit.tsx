/**
 * TORQ Budget - Edit Route
 * Rota para edição de orçamento existente
 * 
 * Integrado com useBudgetStore para salvar no Firebase
 */

import React, { useCallback, useEffect, useState } from 'react';
import { BudgetShell } from '../components/BudgetShell';
import { BudgetFlowReturn, BudgetData } from '../hooks/useBudgetFlow';
// @ts-ignore - JS module
import { useBudgetStore } from '../../../store/budgetStore';

// ============================================================================
// TYPES
// ============================================================================
interface EditBudgetRouteProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  budgetId: string;
}

// ============================================================================
// COMPONENT
// ============================================================================
export const EditBudgetRoute: React.FC<EditBudgetRouteProps> = ({
  isOpen,
  onClose,
  onSuccess,
  budgetId,
}) => {
  const { getBudgetById, updateBudget } = useBudgetStore();
  const [initialData, setInitialData] = useState<Partial<BudgetData> | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Load budget data
  useEffect(() => {
    const loadBudget = async () => {
      if (!budgetId || !isOpen) return;
      
      setLoading(true);
      try {
        const result = await getBudgetById(budgetId);
        
        if (result.success && result.data) {
          const budget = result.data;
          
          // Transform store data to flow data format
          const transformedData = {
            client: {
              id: budget.clientId || '',
              name: budget.clientName || '',
              phone: budget.clientPhone || '',
              email: budget.clientEmail || '',
            },
            vehicle: {
              plate: budget.vehiclePlate || '',
              brand: budget.vehicleBrand || '',
              model: budget.vehicleModel || '',
              year: budget.vehicleYear || '',
              color: budget.vehicleColor || '',
            },
            items: (budget.items || []).map((item: any) => ({
              id: item.id,
              type: item.type || 'service',
              name: item.name,
              description: item.description || '',
              quantity: item.quantity || 1,
              price: item.price || 0,
            })),
            discount: budget.discount || 0,
            notes: budget.notes || '',
            internalNotes: budget.internalNotes || '',
            validUntil: budget.validUntil || '',
          };
          
          setInitialData(transformedData);
        } else {
          console.error('❌ Failed to load budget:', result.error);
        }
      } catch (error) {
        console.error('❌ Error loading budget:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBudget();
  }, [budgetId, isOpen, getBudgetById]);
  
  const handleSubmit = useCallback(async (data: BudgetFlowReturn['data']) => {
    try {
      // Calculate totals
      const subtotal = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const total = Math.max(0, subtotal - data.discount);
      
      // Prepare update data
      const updateData = {
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
        
        // Items
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
      };
      
      // Call store to update budget
      const result = await updateBudget(budgetId, updateData);
      
      if (result.success) {
        onSuccess?.();
        return { success: true };
      } else {
        console.error('❌ Failed to update budget:', result.error);
        return { 
          success: false, 
          error: result.error || 'Erro ao atualizar orçamento' 
        };
      }
      
    } catch (error) {
      console.error('❌ Error updating budget:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao atualizar orçamento' 
      };
    }
  }, [budgetId, updateBudget, onSuccess]);
  
  // Show nothing while loading
  if (loading || !initialData) {
    return null;
  }
  
  return (
    <BudgetShell
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      initialData={initialData}
      isEditMode={true}
    />
  );
};

export default EditBudgetRoute;
