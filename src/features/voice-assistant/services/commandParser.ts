/**
 * TORQ Voice Assistant - Command Parser
 * Parser inteligente para comandos de voz específicos
 */

import {
  VoiceCommand,
  VoiceAction,
  VoiceEntity,
  VoiceFilters,
  DateFilter,
  ACTION_KEYWORDS,
  ENTITY_KEYWORDS,
} from '../types';

/**
 * Parser principal de comandos de voz
 */
export function parseVoiceCommand(rawCommand: string): VoiceCommand {
  const normalizedCommand = normalizeText(rawCommand);
  
  // Extrair componentes do comando
  const action = extractAction(normalizedCommand);
  const entity = extractEntity(normalizedCommand);
  const filters = extractFilters(normalizedCommand);
  
  // Calcular confiança baseado nos componentes encontrados
  const confidence = calculateConfidence(action, entity, filters);
  
  // Validar se o comando é específico o suficiente
  const validation = validateCommand(action, entity, filters);
  
  return {
    raw: rawCommand,
    action,
    entity,
    filters,
    confidence,
    isValid: validation.isValid,
    errorMessage: validation.errorMessage,
  };
}

/**
 * Normaliza o texto removendo acentos e convertendo para minúsculas
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Extrai a ação do comando
 */
function extractAction(text: string): VoiceAction {
  for (const [action, keywords] of Object.entries(ACTION_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(normalizeText(keyword))) {
        return action as VoiceAction;
      }
    }
  }
  return 'unknown';
}

/**
 * Extrai a entidade do comando
 */
function extractEntity(text: string): VoiceEntity {
  // Ordem de prioridade (mais específico primeiro)
  const priorityOrder: VoiceEntity[] = [
    'obd_scan',
    'invoice',
    'budget',
    'checkin',
    'photo',
    'part',
    'history',
    'vehicle',
    'client',
  ];
  
  for (const entity of priorityOrder) {
    const keywords = ENTITY_KEYWORDS[entity];
    for (const keyword of keywords) {
      if (text.includes(normalizeText(keyword))) {
        return entity;
      }
    }
  }
  return 'unknown';
}

/**
 * Extrai filtros do comando
 */
function extractFilters(text: string): VoiceFilters {
  const filters: VoiceFilters = {};
  
  // Extrair nome do cliente
  const clientName = extractClientName(text);
  if (clientName) filters.clientName = clientName;
  
  // Extrair informações do veículo
  const vehicleInfo = extractVehicleInfo(text);
  if (vehicleInfo.brand) filters.vehicleBrand = vehicleInfo.brand;
  if (vehicleInfo.model) filters.vehicleModel = vehicleInfo.model;
  if (vehicleInfo.year) filters.vehicleYear = vehicleInfo.year;
  if (vehicleInfo.plate) filters.vehiclePlate = vehicleInfo.plate;
  
  // Extrair data
  const dateFilter = extractDate(text);
  if (dateFilter) filters.date = dateFilter;
  
  // Extrair valor monetário
  const value = extractMonetaryValue(text);
  if (value) filters.value = value;
  
  // Extrair ordinal (último, penúltimo)
  const ordinal = extractOrdinal(text);
  if (ordinal) filters.ordinal = ordinal;
  
  return filters;
}

/**
 * Extrai nome do cliente do texto
 */
function extractClientName(text: string): string | undefined {
  // Padrões: "do João", "do cliente João", "do João Silva"
  const patterns = [
    /(?:do|da|cliente)\s+([A-Z][a-záéíóúãõâêîôû]+(?:\s+[A-Z][a-záéíóúãõâêîôû]+)?)/i,
    /cliente\s+([A-Z][a-záéíóúãõâêîôû]+(?:\s+[A-Z][a-záéíóúãõâêîôû]+)?)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      // Filtrar palavras que não são nomes (marcas de carro, etc)
      const name = match[1].trim();
      if (!isVehicleBrand(name) && !isVehicleModel(name)) {
        return capitalizeWords(name);
      }
    }
  }
  
  return undefined;
}

/**
 * Extrai informações do veículo
 */
function extractVehicleInfo(text: string): {
  brand?: string;
  model?: string;
  year?: number;
  plate?: string;
} {
  const result: { brand?: string; model?: string; year?: number; plate?: string } = {};
  
  // Marcas conhecidas
  const brands = [
    'toyota', 'honda', 'volkswagen', 'vw', 'fiat', 'chevrolet', 'gm',
    'ford', 'hyundai', 'nissan', 'renault', 'peugeot', 'citroen',
    'mitsubishi', 'jeep', 'bmw', 'mercedes', 'audi', 'kia', 'suzuki',
    'yamaha', 'kawasaki', 'ducati', 'harley',
  ];
  
  // Modelos conhecidos
  const models = [
    'corolla', 'civic', 'gol', 'uno', 'palio', 'onix', 'ka', 'hb20',
    'hilux', 'ranger', 'amarok', 'frontier', 'l200', 's10', 'toro',
    'compass', 'renegade', 'tracker', 'creta', 'kicks', 'duster',
    'sandero', '208', '2008', '3008', 'c3', 'c4', 'fit', 'city',
    'sentra', 'versa', 'march', 'logan', 'kwid', 'mobi', 'argo',
    'cronos', 'polo', 'virtus', 'jetta', 'golf', 't-cross', 'nivus',
  ];
  
  const normalizedText = normalizeText(text);
  
  // Buscar marca
  for (const brand of brands) {
    if (normalizedText.includes(brand)) {
      result.brand = capitalizeWords(brand === 'vw' ? 'Volkswagen' : brand === 'gm' ? 'Chevrolet' : brand);
      break;
    }
  }
  
  // Buscar modelo
  for (const model of models) {
    if (normalizedText.includes(model)) {
      result.model = capitalizeWords(model);
      break;
    }
  }
  
  // Buscar ano (4 dígitos entre 1990 e 2030)
  const yearMatch = text.match(/\b(19[9][0-9]|20[0-2][0-9]|2030)\b/);
  if (yearMatch) {
    result.year = parseInt(yearMatch[1], 10);
  }
  
  // Buscar placa (padrão brasileiro: ABC1234 ou ABC1D23)
  const plateMatch = text.match(/\b([A-Z]{3}[0-9][A-Z0-9][0-9]{2})\b/i);
  if (plateMatch) {
    result.plate = plateMatch[1].toUpperCase();
  }
  
  return result;
}

/**
 * Extrai data do texto
 */
function extractDate(text: string): DateFilter | undefined {
  const normalizedText = normalizeText(text);
  const today = new Date();
  
  // Datas relativas
  if (normalizedText.includes('hoje')) {
    return { type: 'relative', value: today, relativeText: 'hoje' };
  }
  
  if (normalizedText.includes('ontem')) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return { type: 'relative', value: yesterday, relativeText: 'ontem' };
  }
  
  if (normalizedText.includes('anteontem')) {
    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
    return { type: 'relative', value: dayBeforeYesterday, relativeText: 'anteontem' };
  }
  
  if (normalizedText.includes('semana passada')) {
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    return { type: 'relative', value: lastWeek, relativeText: 'semana passada' };
  }
  
  // Data específica: "dia 23", "dia 23/11", "23/11/2025"
  const dayMatch = text.match(/dia\s+(\d{1,2})/i);
  if (dayMatch) {
    const day = parseInt(dayMatch[1], 10);
    const date = new Date(today.getFullYear(), today.getMonth(), day);
    return { type: 'exact', value: date };
  }
  
  const fullDateMatch = text.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/);
  if (fullDateMatch) {
    const day = parseInt(fullDateMatch[1], 10);
    const month = parseInt(fullDateMatch[2], 10) - 1;
    const year = fullDateMatch[3] ? parseInt(fullDateMatch[3], 10) : today.getFullYear();
    return { type: 'exact', value: new Date(year, month, day) };
  }
  
  return undefined;
}

/**
 * Extrai valor monetário do texto
 */
function extractMonetaryValue(text: string): number | undefined {
  // Padrões: "400 reais", "quatrocentos reais", "R$ 400", "400,00"
  const numericMatch = text.match(/(?:R\$\s*)?(\d+(?:[.,]\d{2})?)\s*(?:reais)?/i);
  if (numericMatch) {
    return parseFloat(numericMatch[1].replace(',', '.'));
  }
  
  // Valores por extenso
  const writtenNumbers: Record<string, number> = {
    'cem': 100, 'duzentos': 200, 'trezentos': 300, 'quatrocentos': 400,
    'quinhentos': 500, 'seiscentos': 600, 'setecentos': 700,
    'oitocentos': 800, 'novecentos': 900, 'mil': 1000,
  };
  
  const normalizedText = normalizeText(text);
  for (const [word, value] of Object.entries(writtenNumbers)) {
    if (normalizedText.includes(word)) {
      return value;
    }
  }
  
  return undefined;
}

/**
 * Extrai ordinal (último, penúltimo)
 */
function extractOrdinal(text: string): 'last' | 'penultimate' | 'first' | undefined {
  const normalizedText = normalizeText(text);
  
  if (normalizedText.includes('ultimo') || normalizedText.includes('ultima')) {
    return 'last';
  }
  
  if (normalizedText.includes('penultimo') || normalizedText.includes('penultima')) {
    return 'penultimate';
  }
  
  if (normalizedText.includes('primeiro') || normalizedText.includes('primeira')) {
    return 'first';
  }
  
  return undefined;
}

/**
 * Calcula confiança do comando
 */
function calculateConfidence(
  action: VoiceAction,
  entity: VoiceEntity,
  filters: VoiceFilters
): number {
  let confidence = 0;
  
  // Ação identificada: +30%
  if (action !== 'unknown') confidence += 30;
  
  // Entidade identificada: +30%
  if (entity !== 'unknown') confidence += 30;
  
  // Filtros identificados: +10% cada (máx 40%)
  const filterCount = Object.keys(filters).length;
  confidence += Math.min(filterCount * 10, 40);
  
  return Math.min(confidence, 100);
}

/**
 * Valida se o comando é específico o suficiente
 */
function validateCommand(
  action: VoiceAction,
  entity: VoiceEntity,
  filters: VoiceFilters
): { isValid: boolean; errorMessage?: string } {
  // Comando deve ter ação e entidade
  if (action === 'unknown') {
    return {
      isValid: false,
      errorMessage: 'Não entendi a ação. Tente "mostrar", "enviar" ou "buscar".',
    };
  }
  
  if (entity === 'unknown') {
    return {
      isValid: false,
      errorMessage: 'Não entendi o que você quer. Especifique: orçamento, nota fiscal, check-in, etc.',
    };
  }
  
  // Comandos de envio precisam de mais contexto
  if (action === 'send' && entity === 'invoice') {
    if (!filters.clientName && !filters.ordinal && !filters.date && !filters.value) {
      return {
        isValid: false,
        errorMessage: 'Especifique qual nota fiscal: cliente, data ou valor.',
      };
    }
  }
  
  // Comandos de busca de peças precisam de veículo
  if (entity === 'part' && !filters.vehicleBrand && !filters.vehicleModel && !filters.vehicleYear) {
    return {
      isValid: false,
      errorMessage: 'Especifique o veículo: marca, modelo ou ano.',
    };
  }
  
  return { isValid: true };
}

// Helpers
function isVehicleBrand(text: string): boolean {
  const brands = ['toyota', 'honda', 'volkswagen', 'fiat', 'chevrolet', 'ford', 'hyundai'];
  return brands.includes(normalizeText(text));
}

function isVehicleModel(text: string): boolean {
  const models = ['corolla', 'civic', 'gol', 'uno', 'onix', 'hilux', 'ranger'];
  return models.includes(normalizeText(text));
}

function capitalizeWords(text: string): string {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
