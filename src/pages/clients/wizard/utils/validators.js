/**
 * Validation utilities for form fields
 */

// Validate CPF
export const validateCPF = (cpf) => {
  if (!cpf) return { isValid: true, message: '' };
  
  const numbers = cpf.replace(/\D/g, '');
  
  if (numbers.length !== 11) {
    return { isValid: false, message: 'CPF deve ter 11 dígitos' };
  }
  
  // Check if all digits are the same
  if (/^(\d)\1{10}$/.test(numbers)) {
    return { isValid: false, message: 'CPF inválido' };
  }
  
  // Validate check digits
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let checkDigit = 11 - (sum % 11);
  if (checkDigit >= 10) checkDigit = 0;
  
  if (checkDigit !== parseInt(numbers.charAt(9))) {
    return { isValid: false, message: 'CPF inválido' };
  }
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }
  checkDigit = 11 - (sum % 11);
  if (checkDigit >= 10) checkDigit = 0;
  
  if (checkDigit !== parseInt(numbers.charAt(10))) {
    return { isValid: false, message: 'CPF inválido' };
  }
  
  return { isValid: true, message: '' };
};

// Validate CNPJ
export const validateCNPJ = (cnpj) => {
  if (!cnpj) return { isValid: true, message: '' };
  
  const numbers = cnpj.replace(/\D/g, '');
  
  if (numbers.length !== 14) {
    return { isValid: false, message: 'CNPJ deve ter 14 dígitos' };
  }
  
  // Check if all digits are the same
  if (/^(\d)\1{13}$/.test(numbers)) {
    return { isValid: false, message: 'CNPJ inválido' };
  }
  
  // Validate first check digit
  let size = numbers.length - 2;
  let nums = numbers.substring(0, size);
  const digits = numbers.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += nums.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) {
    return { isValid: false, message: 'CNPJ inválido' };
  }
  
  // Validate second check digit
  size = size + 1;
  nums = numbers.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += nums.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) {
    return { isValid: false, message: 'CNPJ inválido' };
  }
  
  return { isValid: true, message: '' };
};

// Validate email
export const validateEmail = (email) => {
  if (!email) return { isValid: true, message: '' };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'E-mail inválido' };
  }
  
  return { isValid: true, message: '' };
};

// Validate phone
export const validatePhone = (phone) => {
  if (!phone) return { isValid: true, message: '' };
  
  const numbers = phone.replace(/\D/g, '');
  
  if (numbers.length < 10 || numbers.length > 11) {
    return { isValid: false, message: 'Telefone inválido' };
  }
  
  return { isValid: true, message: '' };
};

// Validate plate (Mercosul and old format)
export const validatePlate = (plate) => {
  if (!plate) return { isValid: true, message: '' };
  
  const cleanPlate = plate.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  
  // Mercosul format: ABC1D23
  const mercosulRegex = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
  // Old format: ABC1234
  const oldRegex = /^[A-Z]{3}[0-9]{4}$/;
  
  if (!mercosulRegex.test(cleanPlate) && !oldRegex.test(cleanPlate)) {
    return { isValid: false, message: 'Placa inválida' };
  }
  
  return { isValid: true, message: '' };
};

// Format CPF
export const formatCPF = (value) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 11) {
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return value;
};

// Format CNPJ
export const formatCNPJ = (value) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 14) {
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  }
  return value;
};

// Format phone
export const formatPhone = (value) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 11) {
    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
    }
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
  }
  return value;
};

// Format CEP
export const formatCEP = (value) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 8) {
    return numbers.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
  }
  return value;
};

// Format plate
export const formatPlate = (value) => {
  return value.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 7);
};

// Validate step 1
export const validateStep1 = (formData) => {
  const errors = {};
  
  if (!formData.name || formData.name.trim().length < 3) {
    errors.name = 'Nome deve ter pelo menos 3 caracteres';
  }
  
  if (formData.personType === 'PF') {
    const cpfValidation = validateCPF(formData.cpf);
    if (!cpfValidation.isValid) {
      errors.cpf = cpfValidation.message;
    }
  } else {
    const cnpjValidation = validateCNPJ(formData.cnpj);
    if (!cnpjValidation.isValid) {
      errors.cnpj = cnpjValidation.message;
    }
    if (!formData.companyName || formData.companyName.trim().length < 3) {
      errors.companyName = 'Razão Social deve ter pelo menos 3 caracteres';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate step 2
export const validateStep2 = (formData) => {
  const errors = {};
  
  if (!formData.phone) {
    errors.phone = 'Telefone é obrigatório';
  } else {
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.message;
    }
  }
  
  if (formData.email) {
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.message;
    }
  }
  
  if (formData.phoneSecondary) {
    const phoneValidation = validatePhone(formData.phoneSecondary);
    if (!phoneValidation.isValid) {
      errors.phoneSecondary = phoneValidation.message;
    }
  }
  
  if (formData.whatsapp) {
    const phoneValidation = validatePhone(formData.whatsapp);
    if (!phoneValidation.isValid) {
      errors.whatsapp = phoneValidation.message;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate step 3 (all optional)
export const validateStep3 = () => {
  return {
    isValid: true,
    errors: {}
  };
};

// Validate step 4 (all optional)
export const validateStep4 = () => {
  return {
    isValid: true,
    errors: {}
  };
};

// Validate all steps
export const validateAllSteps = (formData) => {
  const step1 = validateStep1(formData);
  const step2 = validateStep2(formData);
  const step3 = validateStep3(formData);
  const step4 = validateStep4(formData);
  
  return {
    isValid: step1.isValid && step2.isValid && step3.isValid && step4.isValid,
    errors: {
      step1: step1.errors,
      step2: step2.errors,
      step3: step3.errors,
      step4: step4.errors
    }
  };
};
