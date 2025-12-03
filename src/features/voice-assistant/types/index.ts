/**
 * TORQ Voice Assistant - Types
 * Tipos TypeScript para o assistente de voz
 */

export interface VoiceCommand {
  raw: string;
  action: VoiceAction;
  entity: VoiceEntity;
  filters: VoiceFilters;
  confidence: number;
  isValid: boolean;
  errorMessage?: string;
}

export type VoiceAction = 
  | 'show'      // Mostrar/Exibir
  | 'send'      // Enviar
  | 'search'    // Buscar
  | 'create'    // Criar
  | 'open'      // Abrir
  | 'unknown';

export type VoiceEntity = 
  | 'budget'           // Orçamento
  | 'invoice'          // Nota Fiscal
  | 'checkin'          // Check-in
  | 'client'           // Cliente
  | 'vehicle'          // Veículo
  | 'part'             // Peça
  | 'obd_scan'         // Scanner OBD
  | 'photo'            // Foto
  | 'history'          // Histórico
  | 'unknown';

export interface VoiceFilters {
  clientName?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  vehiclePlate?: string;
  vehicleYear?: number;
  date?: DateFilter;
  value?: number;
  ordinal?: 'last' | 'penultimate' | 'first';
}

export interface DateFilter {
  type: 'exact' | 'relative' | 'range';
  value: Date | string;
  relativeText?: string; // "ontem", "anteontem", "semana passada"
}

export interface VoiceAssistantState {
  isListening: boolean;
  isProcessing: boolean;
  isOpen: boolean;
  transcript: string;
  result: VoiceCommand | null;
  error: string | null;
  position: VoiceButtonPosition;
}

export interface VoiceButtonPosition {
  x: number;
  y: number;
  corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export interface VoiceAssistantConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
}

// Exemplos de comandos válidos
export const VALID_COMMAND_EXAMPLES = [
  "Mostrar o orçamento do João Silva do Corolla de ontem",
  "Enviar a última nota fiscal do cliente Marcos",
  "Mostrar peças compatíveis com Hilux 2012",
  "Buscar scanner OBD do Peugeot do João de anteontem",
  "Mostrar fotos do check-in do Corolla do José do dia 23",
  "Enviar a nota fiscal de quatrocentos reais do João da Hilux",
  "Abrir histórico do veículo placa ABC1234",
];

// Palavras-chave para ações
export const ACTION_KEYWORDS: Record<VoiceAction, string[]> = {
  show: ['mostrar', 'exibir', 'ver', 'abrir', 'visualizar'],
  send: ['enviar', 'mandar', 'encaminhar', 'reenviar'],
  search: ['buscar', 'procurar', 'pesquisar', 'encontrar'],
  create: ['criar', 'novo', 'nova', 'adicionar', 'cadastrar'],
  open: ['abrir', 'acessar', 'ir para'],
  unknown: [],
};

// Palavras-chave para entidades
export const ENTITY_KEYWORDS: Record<VoiceEntity, string[]> = {
  budget: ['orçamento', 'orcamento', 'proposta', 'os'],
  invoice: ['nota fiscal', 'nf', 'nfe', 'nfse', 'nota'],
  checkin: ['check-in', 'checkin', 'entrada', 'recepção'],
  client: ['cliente', 'consumidor', 'pessoa'],
  vehicle: ['veículo', 'veiculo', 'carro', 'moto', 'automóvel'],
  part: ['peça', 'peca', 'peças', 'componente', 'item'],
  obd_scan: ['scanner', 'obd', 'diagnóstico', 'leitura', 'código de falha'],
  photo: ['foto', 'fotos', 'imagem', 'imagens', 'fotografia'],
  history: ['histórico', 'historico', 'registro', 'registros'],
  unknown: [],
};
