/**
 * vehicleDataService - Serviço para processamento de dados de veículos
 * Detecção de tipo, normalização e utilitários
 */

/**
 * Detecta o tipo de veículo baseado na marca e modelo
 * @param {string} marca - Marca do veículo
 * @param {string} modelo - Modelo do veículo
 * @returns {string} - 'carro', 'moto' ou 'caminhao'
 */
export const detectVehicleType = (marca, modelo) => {
  if (!marca && !modelo) return 'carro';
  
  const marcaLower = (marca || '').toLowerCase();
  const modeloLower = (modelo || '').toLowerCase();
  
  // Marcas de motos
  const marcasMotos = [
    'honda', 'yamaha', 'suzuki', 'kawasaki', 'harley-davidson',
    'bmw motorrad', 'ducati', 'triumph', 'ktm', 'royal enfield',
    'shineray', 'traxx', 'dafra', 'kasinski'
  ];
  
  // Palavras-chave de motos
  const palavrasMotos = [
    'moto', 'bike', 'scooter', 'trail', 'custom', 'sport',
    'cb', 'cg', 'xre', 'bros', 'fazer', 'factor', 'titan',
    'ninja', 'z', 'er-6', 'versys'
  ];
  
  // Marcas de caminhões
  const marcasCaminhoes = [
    'volvo', 'scania', 'mercedes-benz', 'man', 'iveco',
    'ford cargo', 'volkswagen constellation', 'daf'
  ];
  
  // Palavras-chave de caminhões
  const palavrasCaminhoes = [
    'caminhão', 'truck', 'cargo', 'constellation', 'atego',
    'accelo', 'delivery', 'worker', 'tector', 'stralis'
  ];
  
  // Verifica motos
  if (marcasMotos.some(m => marcaLower.includes(m))) {
    return 'moto';
  }
  
  if (palavrasMotos.some(p => modeloLower.includes(p))) {
    return 'moto';
  }
  
  // Verifica caminhões
  if (marcasCaminhoes.some(m => marcaLower.includes(m))) {
    return 'caminhao';
  }
  
  if (palavrasCaminhoes.some(p => modeloLower.includes(p))) {
    return 'caminhao';
  }
  
  // Padrão: carro
  return 'carro';
};

/**
 * Normaliza a cor do veículo para um valor hexadecimal
 * @param {string} cor - Nome da cor
 * @returns {string} - Código hexadecimal da cor
 */
export const normalizeColor = (cor) => {
  if (!cor) return '#6B7280'; // Cinza padrão
  
  const corLower = cor.toLowerCase().trim();
  
  const colorMap = {
    // Cores básicas
    'branco': '#FFFFFF',
    'preto': '#000000',
    'prata': '#C0C0C0',
    'cinza': '#808080',
    'vermelho': '#DC2626',
    'azul': '#2563EB',
    'verde': '#16A34A',
    'amarelo': '#EAB308',
    'laranja': '#EA580C',
    'marrom': '#92400E',
    'bege': '#D4A574',
    'dourado': '#FFD700',
    
    // Variações
    'branca': '#FFFFFF',
    'preta': '#000000',
    'vermelha': '#DC2626',
    'azul escuro': '#1E3A8A',
    'azul claro': '#60A5FA',
    'verde escuro': '#15803D',
    'verde claro': '#4ADE80',
    'cinza escuro': '#4B5563',
    'cinza claro': '#D1D5DB',
    'prata metalico': '#B8B8B8',
    'grafite': '#4A4A4A',
    'champagne': '#F7E7CE',
    'vinho': '#722F37',
    'roxo': '#9333EA',
    'rosa': '#EC4899'
  };
  
  // Tenta encontrar correspondência exata
  if (colorMap[corLower]) {
    return colorMap[corLower];
  }
  
  // Tenta encontrar correspondência parcial
  for (const [key, value] of Object.entries(colorMap)) {
    if (corLower.includes(key) || key.includes(corLower)) {
      return value;
    }
  }
  
  // Se já for um código hex, retorna
  if (/^#[0-9A-F]{6}$/i.test(cor)) {
    return cor;
  }
  
  // Cor padrão
  return '#6B7280';
};

/**
 * Formata a placa no padrão brasileiro
 * @param {string} placa - Placa do veículo
 * @returns {string} - Placa formatada
 */
export const formatPlaca = (placa) => {
  if (!placa) return '';
  
  const cleaned = placa.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  
  // Formato antigo: ABC-1234
  if (cleaned.length === 7 && /^[A-Z]{3}[0-9]{4}$/.test(cleaned)) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }
  
  // Formato Mercosul: ABC1D23
  if (cleaned.length === 7 && /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(cleaned)) {
    return `${cleaned.slice(0, 3)}${cleaned.slice(3, 4)}${cleaned.slice(4, 5)}${cleaned.slice(5)}`;
  }
  
  return cleaned;
};

/**
 * Valida se a placa está no formato correto
 * @param {string} placa - Placa do veículo
 * @returns {boolean} - True se válida
 */
export const isValidPlaca = (placa) => {
  if (!placa) return false;
  
  const cleaned = placa.replace(/[^A-Z0-9]/gi, '');
  
  // Formato antigo: ABC1234
  const formatoAntigo = /^[A-Z]{3}[0-9]{4}$/i;
  
  // Formato Mercosul: ABC1D23
  const formatoMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/i;
  
  return formatoAntigo.test(cleaned) || formatoMercosul.test(cleaned);
};

/**
 * Obtém informações de manutenção baseadas no modelo e ano
 * @param {string} modelo - Modelo do veículo
 * @param {number} ano - Ano do veículo
 * @returns {object} - Informações de manutenção
 */
export const getMaintenanceInfo = (modelo, ano) => {
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - parseInt(ano);
  const estimatedKm = vehicleAge * 15000; // Estimativa: 15k km/ano
  
  return {
    idade: vehicleAge,
    kmEstimado: estimatedKm,
    proximaRevisao: Math.ceil(estimatedKm / 10000) * 10000,
    alertas: getMaintenanceAlerts(vehicleAge, estimatedKm)
  };
};

/**
 * Gera alertas de manutenção baseados na idade e quilometragem
 * @param {number} idade - Idade do veículo em anos
 * @param {number} km - Quilometragem estimada
 * @returns {array} - Lista de alertas
 */
const getMaintenanceAlerts = (idade, km) => {
  const alertas = [];
  
  if (idade >= 5) {
    alertas.push({
      tipo: 'atencao',
      mensagem: 'Veículo com mais de 5 anos - verificar sistema de freios'
    });
  }
  
  if (idade >= 10) {
    alertas.push({
      tipo: 'critico',
      mensagem: 'Veículo com mais de 10 anos - revisão completa recomendada'
    });
  }
  
  if (km >= 100000) {
    alertas.push({
      tipo: 'atencao',
      mensagem: 'Alta quilometragem - verificar correia dentada e suspensão'
    });
  }
  
  if (km >= 200000) {
    alertas.push({
      tipo: 'critico',
      mensagem: 'Quilometragem muito alta - inspeção detalhada necessária'
    });
  }
  
  return alertas;
};

/**
 * Busca especificações técnicas do veículo
 * @param {string} marca - Marca do veículo
 * @param {string} modelo - Modelo do veículo
 * @param {object} specsData - Dados de especificações (car_specs.json)
 * @returns {object|null} - Especificações encontradas ou null
 */
export const findVehicleSpecs = (marca, modelo, specsData) => {
  if (!marca || !modelo || !specsData) return null;
  
  const marcaLower = marca.toLowerCase();
  const modeloLower = modelo.toLowerCase();
  
  // Busca exata
  if (specsData[marcaLower] && specsData[marcaLower][modeloLower]) {
    return specsData[marcaLower][modeloLower];
  }
  
  // Busca parcial no modelo
  if (specsData[marcaLower]) {
    for (const [key, value] of Object.entries(specsData[marcaLower])) {
      if (modeloLower.includes(key) || key.includes(modeloLower)) {
        return value;
      }
    }
  }
  
  return null;
};

export default {
  detectVehicleType,
  normalizeColor,
  formatPlaca,
  isValidPlaca,
  getMaintenanceInfo,
  findVehicleSpecs
};
