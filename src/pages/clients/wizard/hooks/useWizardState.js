/**
 * useWizardState - Hook para gerenciar estado e navegação do wizard
 */

import { useState, useCallback } from 'react';

export const useWizardState = (totalSteps = 5, initialData = null) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialData || {
    // Step 1
    personType: 'PF',
    name: '',
    cpf: '',
    rg: '',
    cnpj: '',
    companyName: '',
    
    // Step 2
    phone: '',
    phoneSecondary: '',
    email: '',
    whatsapp: '',
    address: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: ''
    },
    
    // Step 3
    birthDate: '',
    gender: '',
    profession: '',
    referralSource: '',
    contactPreferences: [],
    notes: '',
    
    // Step 4
    vehicles: [],
    
    // Meta
    active: true
  });

  const [touched, setTouched] = useState({});

  const updateFormData = useCallback((field, value) => {
    setFormData(prev => {
      // Handle nested address fields
      if (field.startsWith('address.')) {
        const addressField = field.split('.')[1];
        return {
          ...prev,
          address: {
            ...prev.address,
            [addressField]: value
          }
        };
      }
      
      return {
        ...prev,
        [field]: value
      };
    });
  }, []);

  const updateAddress = useCallback((addressData) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        ...addressData
      }
    }));
  }, []);

  const addVehicle = useCallback((vehicle) => {
    setFormData(prev => ({
      ...prev,
      vehicles: [...prev.vehicles, { ...vehicle, id: Date.now().toString() }]
    }));
  }, []);

  const removeVehicle = useCallback((vehicleId) => {
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.filter(v => v.id !== vehicleId)
    }));
  }, []);

  const markTouched = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const goToStep = useCallback((step) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const resetWizard = useCallback(() => {
    setCurrentStep(1);
    setFormData({
      personType: 'PF',
      name: '',
      cpf: '',
      rg: '',
      cnpj: '',
      companyName: '',
      phone: '',
      phoneSecondary: '',
      email: '',
      whatsapp: '',
      address: {
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: ''
      },
      birthDate: '',
      gender: '',
      profession: '',
      referralSource: '',
      contactPreferences: [],
      notes: '',
      vehicles: [],
      active: true
    });
    setTouched({});
  }, []);

  return {
    currentStep,
    totalSteps,
    formData,
    touched,
    updateFormData,
    updateAddress,
    addVehicle,
    removeVehicle,
    markTouched,
    goToStep,
    nextStep,
    prevStep,
    resetWizard,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps
  };
};
