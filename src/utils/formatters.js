/**
 * Funções utilitárias para formatação de dados
 */

/**
 * Formata CPF para o padrão XXX.XXX.XXX-XX
 */
export const formatCPF = (cpf) => {
  if (!cpf) return '';
  
  // Remove tudo que não é número
  const numbers = cpf.replace(/\D/g, '');
  
  // Aplica a máscara
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  return cpf;
};

/**
 * Formata CNPJ para o padrão XX.XXX.XXX/XXXX-XX
 */
export const formatCNPJ = (cnpj) => {
  if (!cnpj) return '';
  
  const numbers = cnpj.replace(/\D/g, '');
  
  if (numbers.length <= 14) {
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return cnpj;
};

/**
 * Formata telefone para o padrão (XX) XXXXX-XXXX
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  const numbers = phone.replace(/\D/g, '');
  
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

/**
 * Formata data para o padrão brasileiro
 */
export const formatDate = (date) => {
  if (!date) return 'Nunca';
  
  try {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return 'Data inválida';
  }
};

/**
 * Formata data e hora
 */
export const formatDateTime = (date) => {
  if (!date) return 'Nunca';
  
  try {
    const d = new Date(date);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Data inválida';
  }
};

/**
 * Formata moeda para Real brasileiro
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formata endereço completo
 */
export const formatAddress = (address) => {
  if (!address) return 'Não informado';
  
  // Se já é uma string, retorna
  if (typeof address === 'string') return address;
  
  // Se é um objeto, monta o endereço
  const parts = [];
  
  if (address.street) parts.push(address.street);
  if (address.number) parts.push(`nº ${address.number}`);
  if (address.complement) parts.push(address.complement);
  if (address.neighborhood) parts.push(address.neighborhood);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.zipCode) parts.push(`CEP: ${address.zipCode}`);
  
  return parts.join(', ') || 'Não informado';
};

/**
 * Trunca texto com reticências
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Valida CPF
 */
export const isValidCPF = (cpf) => {
  if (!cpf) return false;
  
  const numbers = cpf.replace(/\D/g, '');
  
  if (numbers.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(numbers)) return false;
  
  let sum = 0;
  let remainder;
  
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(numbers.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(numbers.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.substring(10, 11))) return false;
  
  return true;
};

export default {
  formatCPF,
  formatCNPJ,
  formatPhone,
  formatDate,
  formatDateTime,
  formatCurrency,
  formatAddress,
  truncateText,
  isValidCPF
};
