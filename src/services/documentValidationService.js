/**
 * Serviço de validação de documentos (CPF e CNPJ)
 */

/**
 * Valida CPF
 */
export const validateCPF = (cpf) => {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) {
    return { valid: false, message: 'CPF deve ter 11 dígitos' };
  }
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return { valid: false, message: 'CPF inválido' };
  }
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  
  if (digit !== parseInt(cleanCPF.charAt(9))) {
    return { valid: false, message: 'CPF inválido' };
  }
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  
  if (digit !== parseInt(cleanCPF.charAt(10))) {
    return { valid: false, message: 'CPF inválido' };
  }
  
  return { valid: true, message: 'CPF válido' };
};

/**
 * Valida CNPJ
 */
export const validateCNPJ = (cnpj) => {
  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  // Verifica se tem 14 dígitos
  if (cleanCNPJ.length !== 14) {
    return { valid: false, message: 'CNPJ deve ter 14 dígitos' };
  }
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) {
    return { valid: false, message: 'CNPJ inválido' };
  }
  
  // Validação do primeiro dígito verificador
  let size = cleanCNPJ.length - 2;
  let numbers = cleanCNPJ.substring(0, size);
  const digits = cleanCNPJ.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) {
    return { valid: false, message: 'CNPJ inválido' };
  }
  
  // Validação do segundo dígito verificador
  size = size + 1;
  numbers = cleanCNPJ.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) {
    return { valid: false, message: 'CNPJ inválido' };
  }
  
  return { valid: true, message: 'CNPJ válido' };
};

/**
 * Formata CPF (000.000.000-00)
 */
export const formatCPF = (cpf) => {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formata CNPJ (00.000.000/0000-00)
 */
export const formatCNPJ = (cnpj) => {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

/**
 * Formata telefone (00) 00000-0000
 */
export const formatPhone = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};

/**
 * Formata CEP (00000-000)
 */
export const formatCEP = (cep) => {
  const cleanCEP = cep.replace(/\D/g, '');
  return cleanCEP.replace(/(\d{5})(\d{3})/, '$1-$2');
};

/**
 * Valida data de nascimento (deve ser maior de idade)
 * Aceita formato DD/MM/AAAA ou AAAA-MM-DD
 */
export const validateBirthDate = (birthDate) => {
  if (!birthDate) {
    return { valid: false, message: 'Data de nascimento é obrigatória' };
  }
  
  let birth;
  
  // Se for string com apenas dígitos (formato DD/MM/AAAA sem barras)
  if (typeof birthDate === 'string' && /^\d{8}$/.test(birthDate)) {
    const day = birthDate.substring(0, 2);
    const month = birthDate.substring(2, 4);
    const year = birthDate.substring(4, 8);
    birth = new Date(`${year}-${month}-${day}`);
  } 
  // Se for formato DD/MM/AAAA com barras
  else if (typeof birthDate === 'string' && birthDate.includes('/')) {
    const [day, month, year] = birthDate.split('/');
    birth = new Date(`${year}-${month}-${day}`);
  }
  // Formato ISO (AAAA-MM-DD)
  else {
    birth = new Date(birthDate);
  }
  
  // Verifica se a data é válida
  if (isNaN(birth.getTime())) {
    return { valid: false, message: 'Data inválida' };
  }
  
  const today = new Date();
  
  if (birth > today) {
    return { valid: false, message: 'Data de nascimento não pode ser futura' };
  }
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  if (age < 18) {
    return { valid: false, message: 'Cliente deve ser maior de 18 anos' };
  }
  
  if (age > 120) {
    return { valid: false, message: 'Data de nascimento inválida' };
  }
  
  return { valid: true, message: 'Data válida' };
};
