/**
 * TORQ Budget Flow Hook
 * Gerencia estado e lógica do fluxo de orçamento
 */

import { useState, useCallback, useMemo, useEffect } from 'react';

// ============================================================================
// TYPES
// ============================================================================
export interface BudgetClient {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface BudgetVehicle {
  plate: string;
  brand: string;
  model: string;
  year?: string;
  color?: string;
}

export interface BudgetItem {
  id: string;
  type: 'product' | 'service';
  name: string;
  description?: string;
  simpleDescription?: string; // Explicação em linguagem simples
  quantity: number;
  cost: number; // NOVO: Custo do item
  price: number;
  priority: 'required' | 'recommended' | 'optional'; // NOVO: Prioridade
  deliveryDays: number; // NOVO: Prazo de entrega em dias
  warranty?: string; // NOVO: Garantia (ex: "90 dias", "1 ano")
  photoUrl?: string; // NOVO: Foto do item
  dependsOn?: string; // ID de outro item (dependência)
}

export interface BudgetData {
  client: BudgetClient | null;
  vehicle: BudgetVehicle | null;
  items: BudgetItem[];
  discount: number;
  discountReason: string; // NOVO: Motivo do desconto (obrigatório se > 5%)
  notes: string;
  internalNotes: string;
  validUntil: string;
  paymentTerms?: string; // NOVO: Condições de pagamento
  paymentMethod?: string; // NOVO: Forma de pagamento preferida
}

export interface BudgetStep {
  id: string;
  label: string;
  description: string;
}

export const BUDGET_STEPS: BudgetStep[] = [
  { id: 'client', label: 'Cliente', description: 'Dados do cliente' },
  { id: 'vehicle', label: 'Veículo', description: 'Informações do veículo' },
  { id: 'items', label: 'Serviços', description: 'Produtos e serviços' },
  { id: 'summary', label: 'Finalizar', description: 'Revisão e confirmação' },
];

// ============================================================================
// INITIAL STATE
// ============================================================================
const initialBudgetData: BudgetData = {
  client: null,
  vehicle: null,
  items: [],
  discount: 0,
  discountReason: '',
  notes: '',
  internalNotes: '',
  validUntil: '',
  paymentTerms: '',
  paymentMethod: '',
};

// ============================================================================
// HOOK
// ============================================================================
export interface UseBudgetFlowOptions {
  initialData?: Partial<BudgetData>;
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

export function useBudgetFlow(options: UseBudgetFlowOptions = {}) {
  const { initialData, checkinData, isEditMode = false } = options;
  
  // Estado do step atual
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  
  // Estado dos dados
  const [data, setData] = useState<BudgetData>(() => {
    const base = { ...initialBudgetData, ...initialData };
    
    // Preencher com dados do checkin se disponível
    if (checkinData) {
      if (checkinData.clientName) {
        base.client = {
          id: checkinData.clientId || '',
          name: checkinData.clientName,
          phone: checkinData.clientPhone || '',
        };
      }
      if (checkinData.vehiclePlate) {
        base.vehicle = {
          plate: checkinData.vehiclePlate,
          brand: checkinData.vehicleBrand || '',
          model: checkinData.vehicleModel || '',
          year: checkinData.vehicleYear,
          color: checkinData.vehicleColor,
        };
      }
    }
    
    return base;
  });
  
  // Estado de erros
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Estado de loading
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingPlate, setIsSearchingPlate] = useState(false);
  
  // ============================================================================
  // SYNC INITIAL DATA (for edit mode)
  // ============================================================================
  useEffect(() => {
    if (initialData && isEditMode) {
      setData(prev => {
        const newData = { ...initialBudgetData };
        
        // Merge initialData
        if (initialData.client) {
          newData.client = initialData.client;
        }
        if (initialData.vehicle) {
          newData.vehicle = initialData.vehicle;
        }
        if (initialData.items && initialData.items.length > 0) {
          newData.items = initialData.items;
        }
        if (initialData.discount !== undefined) {
          newData.discount = initialData.discount;
        }
        if (initialData.notes !== undefined) {
          newData.notes = initialData.notes;
        }
        if (initialData.internalNotes !== undefined) {
          newData.internalNotes = initialData.internalNotes;
        }
        if (initialData.validUntil !== undefined) {
          newData.validUntil = initialData.validUntil;
        }
        
        return newData;
      });
    }
  }, [initialData, isEditMode]);
  
  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  const subtotal = useMemo(() => {
    return data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [data.items]);
  
  const total = useMemo(() => {
    return Math.max(0, subtotal - data.discount);
  }, [subtotal, data.discount]);
  
  const effectiveBrand = useMemo(() => {
    return data.vehicle?.brand || checkinData?.vehicleBrand || '';
  }, [data.vehicle?.brand, checkinData?.vehicleBrand]);
  
  // ============================================================================
  // VALIDATION
  // ============================================================================
  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 0: // Client
        if (!data.client?.name?.trim()) {
          newErrors.clientName = 'Nome do cliente é obrigatório';
        }
        if (!data.client?.phone?.trim()) {
          newErrors.clientPhone = 'Telefone é obrigatório';
        }
        break;
        
      case 1: // Vehicle
        if (!data.vehicle?.plate?.trim()) {
          newErrors.vehiclePlate = 'Placa é obrigatória';
        }
        if (!data.vehicle?.model?.trim()) {
          newErrors.vehicleModel = 'Modelo é obrigatório';
        }
        break;
        
      case 2: // Items
        if (data.items.length === 0) {
          newErrors.items = 'Adicione pelo menos um item';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [data]);
  
  const isStepValid = useCallback((step: number): boolean => {
    switch (step) {
      case 0:
        return !!(data.client?.name?.trim() && data.client?.phone?.trim());
      case 1:
        return !!(data.vehicle?.plate?.trim() && data.vehicle?.model?.trim());
      case 2:
        return data.items.length > 0;
      default:
        return true;
    }
  }, [data]);
  
  const canProceed = useMemo(() => isStepValid(currentStep), [isStepValid, currentStep]);
  
  // ============================================================================
  // NAVIGATION
  // ============================================================================
  const goToStep = useCallback((step: number) => {
    if (step > currentStep && !validateStep(currentStep)) {
      return false;
    }
    
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
    return true;
  }, [currentStep, validateStep]);
  
  const nextStep = useCallback(() => {
    if (currentStep < BUDGET_STEPS.length - 1) {
      return goToStep(currentStep + 1);
    }
    return false;
  }, [currentStep, goToStep]);
  
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
      return true;
    }
    return false;
  }, [currentStep]);
  
  // ============================================================================
  // DATA UPDATES
  // ============================================================================
  const updateClient = useCallback((client: Partial<BudgetClient>) => {
    setData(prev => ({
      ...prev,
      client: prev.client ? { ...prev.client, ...client } : { id: '', name: '', phone: '', ...client },
    }));
    setErrors(prev => {
      const next = { ...prev };
      delete next.clientName;
      delete next.clientPhone;
      return next;
    });
  }, []);
  
  const updateVehicle = useCallback((vehicle: Partial<BudgetVehicle>) => {
    setData(prev => ({
      ...prev,
      vehicle: prev.vehicle ? { ...prev.vehicle, ...vehicle } : { plate: '', brand: '', model: '', ...vehicle },
    }));
    setErrors(prev => {
      const next = { ...prev };
      delete next.vehiclePlate;
      delete next.vehicleModel;
      return next;
    });
  }, []);
  
  const addItem = useCallback((item: Omit<BudgetItem, 'id'>) => {
    const newItem: BudgetItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    setData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    setErrors(prev => {
      const next = { ...prev };
      delete next.items;
      return next;
    });
  }, []);
  
  const removeItem = useCallback((itemId: string) => {
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }));
  }, []);
  
  const updateItemQuantity = useCallback((itemId: string, delta: number) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      ),
    }));
  }, []);
  
  const updateDiscount = useCallback((discount: number) => {
    setData(prev => ({ ...prev, discount: Math.max(0, discount) }));
  }, []);
  
  const updateDiscountReason = useCallback((discountReason: string) => {
    setData(prev => ({ ...prev, discountReason }));
  }, []);
  
  const updatePaymentTerms = useCallback((paymentTerms: string) => {
    setData(prev => ({ ...prev, paymentTerms }));
  }, []);
  
  const updatePaymentMethod = useCallback((paymentMethod: string) => {
    setData(prev => ({ ...prev, paymentMethod }));
  }, []);
  
  const updateNotes = useCallback((notes: string) => {
    setData(prev => ({ ...prev, notes }));
  }, []);
  
  const updateInternalNotes = useCallback((internalNotes: string) => {
    setData(prev => ({ ...prev, internalNotes }));
  }, []);
  
  // ============================================================================
  // RESET
  // ============================================================================
  const reset = useCallback(() => {
    setCurrentStep(0);
    setDirection(1);
    setData(initialBudgetData);
    setErrors({});
    setIsLoading(false);
  }, []);
  
  // ============================================================================
  // RETURN
  // ============================================================================
  return {
    // State
    currentStep,
    direction,
    data,
    errors,
    isLoading,
    isSearchingPlate,
    
    // Computed
    subtotal,
    total,
    effectiveBrand,
    canProceed,
    isEditMode,
    steps: BUDGET_STEPS,
    
    // Navigation
    goToStep,
    nextStep,
    prevStep,
    
    // Validation
    validateStep,
    isStepValid,
    
    // Data updates
    updateClient,
    updateVehicle,
    addItem,
    removeItem,
    updateItemQuantity,
    updateDiscount,
    updateDiscountReason,
    updatePaymentTerms,
    updatePaymentMethod,
    updateNotes,
    updateInternalNotes,
    setData,
    setErrors,
    setIsLoading,
    setIsSearchingPlate,
    
    // Reset
    reset,
  };
}

export type BudgetFlowReturn = ReturnType<typeof useBudgetFlow>;
