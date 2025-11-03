/**
 * Utilitários para formatação de endereços
 * Inclui lógica para lidar com endereços sem número
 */

/**
 * Formata CEP no padrão brasileiro
 * @param {string} cep - CEP sem formatação
 * @returns {string} CEP formatado (12345-678)
 */
export const formatCEP = (cep) => {
  if (!cep) return '';
  return cep
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};

/**
 * Formata um endereço completo considerando a flag hasNumber
 * @param {Object} addressData - Dados do endereço
 * @param {string} addressData.address - Rua/Avenida
 * @param {string} addressData.number - Número do endereço
 * @param {boolean} addressData.hasNumber - Se o endereço possui número
 * @param {string} addressData.complement - Complemento
 * @param {string} addressData.neighborhood - Bairro
 * @param {string} addressData.city - Cidade
 * @param {string} addressData.state - Estado
 * @param {string} addressData.zipCode - CEP
 * @returns {string} Endereço formatado
 */
export const formatFullAddress = (addressData) => {
  if (!addressData) return 'Não informado';
  
  const {
    address,
    number,
    hasNumber,
    complement,
    neighborhood,
    city,
    state,
    zipCode
  } = addressData;

  const parts = [
    address,
    // Só inclui o número se hasNumber for true (ou undefined para compatibilidade) E se number existir
    (hasNumber !== false && number) && `nº ${number}`,
    complement,
    neighborhood,
    city,
    state,
    zipCode && formatCEP(zipCode)
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : 'Não informado';
};

/**
 * Valida se um endereço está completo
 * @param {Object} addressData - Dados do endereço
 * @returns {Object} Resultado da validação
 */
export const validateAddress = (addressData) => {
  const errors = {};

  if (!addressData.address?.trim()) {
    errors.address = 'Endereço é obrigatório';
  }

  if (addressData.hasNumber && !addressData.number?.trim()) {
    errors.number = 'Número é obrigatório quando o endereço possui numeração';
  }

  if (!addressData.neighborhood?.trim()) {
    errors.neighborhood = 'Bairro é obrigatório';
  }

  if (!addressData.city?.trim()) {
    errors.city = 'Cidade é obrigatória';
  }

  if (!addressData.state?.trim()) {
    errors.state = 'Estado é obrigatório';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Cria um endereço padrão com hasNumber = true
 * @returns {Object} Objeto de endereço com valores padrão
 */
export const createDefaultAddress = () => ({
  address: '',
  number: '',
  hasNumber: true,
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: ''
});

/**
 * Converte endereço antigo (sem hasNumber) para novo formato
 * @param {Object} oldAddress - Endereço no formato antigo
 * @returns {Object} Endereço no novo formato com hasNumber
 */
export const migrateAddress = (oldAddress) => {
  if (!oldAddress) return createDefaultAddress();
  
  return {
    ...oldAddress,
    // Se hasNumber não existe, assume true se number existir, senão false
    hasNumber: oldAddress.hasNumber !== undefined 
      ? oldAddress.hasNumber 
      : Boolean(oldAddress.number?.trim())
  };
};