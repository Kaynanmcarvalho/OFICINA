/**
 * useFormValidation - Hook para validação de formulários em tempo real
 */

import { useState, useCallback, useEffect } from 'react';
import { validateStep1, validateStep2, validateStep3, validateStep4 } from '../utils/validators';

export const useFormValidation = (formData, currentStep) => {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validateCurrentStep = useCallback(() => {
    let validation;
    
    switch (currentStep) {
      case 1:
        validation = validateStep1(formData);
        break;
      case 2:
        validation = validateStep2(formData);
        break;
      case 3:
        validation = validateStep3(formData);
        break;
      case 4:
        validation = validateStep4(formData);
        break;
      case 5:
        // Step 5 is review, validate all previous steps
        const step1Valid = validateStep1(formData);
        const step2Valid = validateStep2(formData);
        validation = {
          isValid: step1Valid.isValid && step2Valid.isValid,
          errors: { ...step1Valid.errors, ...step2Valid.errors }
        };
        break;
      default:
        validation = { isValid: true, errors: {} };
    }
    
    setErrors(validation.errors);
    setIsValid(validation.isValid);
    
    return validation;
  }, [formData, currentStep]);

  const validateField = useCallback((field, value) => {
    // Field-specific validation logic can be added here
    // For now, we'll re-validate the entire step
    validateCurrentStep();
  }, [validateCurrentStep]);

  useEffect(() => {
    validateCurrentStep();
  }, [validateCurrentStep]);

  return {
    errors,
    isValid,
    validateCurrentStep,
    validateField
  };
};
