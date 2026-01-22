/**
 * TORQ - Validadores Reutilizáveis
 * Validações robustas para dados críticos
 */

/**
 * Valida CPF brasileiro
 * @param {string} cpf - CPF com ou sem formatação
 * @returns {boolean}
 */
export const validateCPF = (cpf) => {
  if (!cpf) return false;
  
  // Remove formatação
  const cleaned = cpf.replace(/\D/g, '');
  
  // Verifica tamanho
  if (cleaned.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  // Valida dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(10))) return false;
  
  return true;
};

/**
 * Valida CNPJ brasileiro
 * @param {string} cnpj - CNPJ com ou sem formatação
 * @returns {boolean}
 */
export const validateCNPJ = (cnpj) => {
  if (!cnpj) return false;
  
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cleaned)) return false;
  
  // Valida primeiro dígito
  let size = cleaned.length - 2;
  let numbers = cleaned.substring(0, size);
  const digits = cleaned.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  
  // Valida segundo dígito
  size = size + 1;
  numbers = cleaned.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;
  
  return true;
};

/**
 * Valida placa brasileira (Mercosul e antiga)
 * @param {string} plate - Placa com ou sem formatação
 * @returns {boolean}
 */
export const validatePlate = (plate) => {
  if (!plate) return false;
  
  const cleaned = plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  
  // Placa antiga: ABC1234
  const oldFormat = /^[A-Z]{3}[0-9]{4}$/;
  // Placa Mercosul: ABC1D23
  const mercosulFormat = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
  
  return oldFormat.test(cleaned) || mercosulFormat.test(cleaned);
};

/**
 * Valida telefone brasileiro
 * @param {string} phone - Telefone com ou sem formatação
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  
  const cleaned = phone.replace(/\D/g, '');
  
  // Celular: 11 dígitos (DDD + 9 + 8 dígitos)
  // Fixo: 10 dígitos (DDD + 8 dígitos)
  return cleaned.length === 10 || cleaned.length === 11;
};

/**
 * Valida email
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  if (!email) return true; // Email é opcional
  
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Formata CPF
 * @param {string} cpf
 * @returns {string}
 */
export const formatCPF = (cpf) => {
  if (!cpf) return '';
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return cpf;
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formata CNPJ
 * @param {string} cnpj
 * @returns {string}
 */
export const formatCNPJ = (cnpj) => {
  if (!cnpj) return '';
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length !== 14) return cnpj;
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

/**
 * Formata placa
 * @param {string} plate
 * @returns {string}
 */
export const formatPlate = (plate) => {
  if (!plate) return '';
  const cleaned = plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (cleaned.length !== 7) return plate.toUpperCase();
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
};

/**
 * Formata telefone
 * @param {string} phone
 * @returns {string}
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

/**
 * Valida quilometragem
 * @param {string|number} km
 * @returns {boolean}
 */
export const validateKm = (km) => {
  if (!km) return true; // Opcional
  const num = parseInt(km);
  return !isNaN(num) && num >= 0 && num <= 999999;
};

/**
 * Sanitiza entrada de texto
 * @param {string} text
 * @returns {string}
 */
export const sanitizeText = (text) => {
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ');
};
