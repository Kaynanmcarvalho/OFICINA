/**
 * AI Command Processor
 * 
 * Processa comandos de voz usando OpenAI
 * Extrai intenções e parâmetros estruturados
 * 
 * @author Torq AI Team
 * @version 2.0.0 - Global Support
 */

import { processVoiceCommand as processWithOpenAI } from './openaiService';
import recognizeIntent, { INTENTS } from './intentRecognizer';
import invoiceVoiceService from './invoiceVoiceService';

/**
 * Processa comando de voz globalmente
 * Funciona em qualquer página do sistema
 */
export const processVoiceCommand = async (transcript, context = {}) => {
  if (!transcript || !transcript.trim()) {
    throw new Error('Comando vazio');
  }

  try {
    // Analisar comando com IA
    const analysis = await analyzeCommand(transcript, context);
    
    return {
      success: true,
      action: analysis.action,
      data: analysis.data,
      message: analysis.message
    };
  } catch (error) {
    console.error('Erro ao processar comando:', error);
    throw error;
  }
};

/**
 * Analisa comando e extrai intenção
 */
const analyzeCommand = async (transcript, context) => {
  const lowerTranscript = transcript.toLowerCase();
  
  // Primeiro, tentar reconhecer comandos fiscais
  const intentResult = recognizeIntent(transcript);
  
  // Processar comandos de faturamento
  if (intentResult.intent === INTENTS.INVOICE_SALE || 
      intentResult.intent === INTENTS.INVOICE_SERVICE || 
      intentResult.intent === INTENTS.INVOICE_BOTH) {
    return await analyzeInvoiceCommand(intentResult, context);
  }
  
  // Navegação
  if (lowerTranscript.includes('abrir') || lowerTranscript.includes('ir para') || lowerTranscript.includes('página')) {
    return analyzeNavigationCommand(lowerTranscript);
  }
  
  // Criar orçamento
  if (lowerTranscript.includes('orçamento') || lowerTranscript.includes('orcamento')) {
    return analyzeBudgetCommand(transcript, context);
  }
  
  // Check-in
  if (lowerTranscript.includes('check-in') || lowerTranscript.includes('checkin') || lowerTranscript.includes('entrada')) {
    return analyzeCheckinCommand(transcript, context);
  }
  
  // Buscar cliente
  if (lowerTranscript.includes('buscar') || lowerTranscript.includes('procurar') || lowerTranscript.includes('encontrar')) {
    return analyzeSearchCommand(transcript, context);
  }
  
  // Comando não reconhecido - tentar com OpenAI
  try {
    const aiResult = await processWithOpenAI(transcript, context);
    return {
      action: 'ai_processed',
      data: aiResult,
      message: 'Comando processado pela IA'
    };
  } catch (error) {
    throw new Error('Comando não reconhecido. Tente reformular.');
  }
};

/**
 * Analisa comando de faturamento
 */
const analyzeInvoiceCommand = async (intentResult, context) => {
  try {
    // Validar contexto
    if (!context.empresaId || !context.userId) {
      throw new Error('Sessão inválida. Faça login novamente.');
    }

    const { params } = intentResult;

    // Validar entidades obrigatórias
    if (!params.customerName) {
      throw new Error('Nome do cliente não identificado. Exemplo: "Fatura o óleo para João Silva"');
    }

    if (!params.products?.length && !params.services?.length) {
      throw new Error('Produto ou serviço não identificado. Exemplo: "Fatura o Óleo 5W30 para João"');
    }

    // Processar o faturamento
    const result = await invoiceVoiceService.processInvoiceCommand(
      {
        products: params.products || [],
        services: params.services || [],
        customerName: params.customerName,
        type: params.type
      },
      context.empresaId,
      context.userId

    if (result.success) {
      return {
        action: 'invoice_created',
        data: {
          sale: result.sale,
          invoices: result.invoices
        },
        message: result.message
      };
    } else {
      throw new Error(result.error || 'Erro ao processar faturamento');
    }

  } catch (error) {
    console.error('Erro ao processar comando de faturamento:', error);
    throw error;
  }
};

/**
 * Analisa comando de navegação
 */
const analyzeNavigationCommand = (transcript) => {
  const routes = {
    'dashboard': '/dashboard',
    'painel': '/dashboard',
    'início': '/dashboard',
    'inicio': '/dashboard',
    'orçamentos': '/orcamentos',
    'orcamentos': '/orcamentos',
    'clientes': '/clientes',
    'veículos': '/veiculos',
    'veiculos': '/veiculos',
    'estoque': '/estoque',
    'inventário': '/estoque',
    'inventario': '/estoque',
    'check-in': '/checkin',
    'checkin': '/checkin',
    'entrada': '/checkin',
    'ferramentas': '/ferramentas',
    'equipe': '/equipe',
    'time': '/equipe',
    'agenda': '/agenda',
    'configurações': '/configuracoes',
    'configuracoes': '/configuracoes',
    'relatórios': '/relatorios',
    'relatorios': '/relatorios'
  };
  
  for (const [keyword, path] of Object.entries(routes)) {
    if (transcript.includes(keyword)) {
      return {
        action: 'navigate',
        data: { path },
        message: `Abrindo ${keyword}...`
      };
    }
  }
  
  throw new Error('Página não encontrada');
};

/**
 * Analisa comando de orçamento
 */
const analyzeBudgetCommand = (transcript, context) => {
  // Extrair informações do comando
  const data = {
    type: 'budget',
    description: '',
    value: null,
    clientName: null,
    sendWhatsApp: false
  };
  
  // Extrair valor
  const valueMatch = transcript.match(/r\$?\s*(\d+(?:[.,]\d{2})?)/i);
  if (valueMatch) {
    data.value = parseFloat(valueMatch[1].replace(',', '.'));
  }
  
  // Extrair nome do cliente
  const clientMatch = transcript.match(/(?:para|cliente)\s+([a-záàâãéèêíïóôõöúçñ\s]+?)(?:\s+(?:no|e|enviar|whatsapp)|$)/i);
  if (clientMatch) {
    data.clientName = clientMatch[1].trim();
  }
  
  // Extrair descrição do serviço
  const serviceMatch = transcript.match(/(?:orçamento|orcamento)\s+(?:de|para)?\s*([a-záàâãéèêíïóôõöúçñ\s]+?)(?:\s+(?:no|para|cliente)|$)/i);
  if (serviceMatch) {
    data.description = serviceMatch[1].trim();
  }
  
  // Verificar se deve enviar por WhatsApp
  if (transcript.toLowerCase().includes('whatsapp') || transcript.toLowerCase().includes('enviar')) {
    data.sendWhatsApp = true;
  }
  
  return {
    action: 'create_budget',
    data,
    message: `Criando orçamento${data.clientName ? ` para ${data.clientName}` : ''}...`
  };
};

/**
 * Analisa comando de check-in
 */
const analyzeCheckinCommand = (transcript, context) => {
  const data = {
    type: 'checkin',
    plate: null,
    clientName: null
  };
  
  // Extrair placa
  const plateMatch = transcript.match(/([a-z]{3}[-\s]?\d[a-z\d]\d{2})/i);
  if (plateMatch) {
    data.plate = plateMatch[1].replace(/[-\s]/g, '').toUpperCase();
  }
  
  // Extrair nome do cliente
  const clientMatch = transcript.match(/(?:cliente|para)\s+([a-záàâãéèêíïóôõöúçñ\s]+?)(?:\s|$)/i);
  if (clientMatch) {
    data.clientName = clientMatch[1].trim();
  }
  
  return {
    action: 'create_checkin',
    data,
    message: `Iniciando check-in${data.plate ? ` do veículo ${data.plate}` : ''}...`
  };
};

/**
 * Analisa comando de busca
 */
const analyzeSearchCommand = (transcript, context) => {
  // Extrair termo de busca
  const searchMatch = transcript.match(/(?:buscar|procurar|encontrar)\s+(?:cliente\s+)?([a-záàâãéèêíïóôõöúçñ\s]+?)(?:\s|$)/i);
  
  if (searchMatch) {
    return {
      action: 'search_client',
      data: { query: searchMatch[1].trim() },
      message: `Buscando ${searchMatch[1].trim()}...`
    };
  }
  
  throw new Error('Não foi possível identificar o termo de busca');
};

class AICommandProcessor {
  constructor(options = {}) {
    this.context = options.context || {};
    this.onCommand = options.onCommand || (() => {});
    this.onError = options.onError || (() => {});
    this.commandHistory = [];
    this.maxHistorySize = 50;
  }

  /**
   * Process voice command
   */
  async processCommand(transcript, additionalContext = {}) {
    if (!transcript || !transcript.trim()) {
      return {
        success: false,
        error: 'Transcrição vazia'
      };
    }

    try {
      // Merge context
      const fullContext = {
        ...this.context,
        ...additionalContext,
        commandHistory: this.getRecentHistory(5)
      };

      // Process command
      const result = await processVoiceCommand(transcript, fullContext);

      // Add to history
      this.addToHistory({
        transcript,
        result,
        timestamp: new Date()
      });

      // Notify callback
      if (result.action) {
        this.onCommand(result);
      }

      return {
        success: true,
        result
      };
    } catch (error) {
      console.error('Error processing command:', error);
      this.onError(error);
      
      return {
        success: false,
        error: error.message || 'Erro ao processar comando'
      };
    }
  }

  /**
   * Add command to history
   */
  addToHistory(entry) {
    this.commandHistory.unshift(entry);
    
    // Limit history size
    if (this.commandHistory.length > this.maxHistorySize) {
      this.commandHistory = this.commandHistory.slice(0, this.maxHistorySize);
    }
  }

  /**
   * Get recent history
   */
  getRecentHistory(count = 5) {
    return this.commandHistory.slice(0, count).map(entry => ({
      transcript: entry.transcript,
      command: entry.result?.function?.name,
      timestamp: entry.timestamp
    }));
  }

  /**
   * Get full history
   */
  getHistory() {
    return [...this.commandHistory];
  }

  /**
   * Clear history
   */
  clearHistory() {
    this.commandHistory = [];
  }

  /**
   * Update context
   */
  updateContext(newContext) {
    this.context = {
      ...this.context,
      ...newContext
    };
  }

  /**
   * Get context
   */
  getContext() {
    return { ...this.context };
  }

  /**
   * Reset processor
   */
  reset() {
    this.commandHistory = [];
    this.context = {};
  }
}

export default AICommandProcessor;
