/**
 * Intent Recognizer
 * Classifica intenções de comandos de voz
 */

const INTENTS = {
  ADD_ITEM: 'add_item',
  REMOVE_ITEM: 'remove_item',
  EDIT_ITEM: 'edit_item',
  SHOW_TOTAL: 'show_total',
  LIST_ITEMS: 'list_items',
  FINALIZE: 'finalize',
  CANCEL: 'cancel',
  HELP: 'help',
  // Novos intents fiscais
  INVOICE_SALE: 'invoice_sale',
  INVOICE_SERVICE: 'invoice_service',
  INVOICE_BOTH: 'invoice_both',
  UNKNOWN: 'unknown'
};

const PATTERNS = {
  [INTENTS.ADD_ITEM]: [
    /adicionar?\s+(.+)/i,
    /incluir?\s+(.+)/i,
    /colocar?\s+(.+)/i,
    /inserir?\s+(.+)/i,
    /acrescentar?\s+(.+)/i
  ],
  [INTENTS.REMOVE_ITEM]: [
    /remover?\s+(.+)/i,
    /tirar?\s+(.+)/i,
    /excluir?\s+(.+)/i,
    /deletar?\s+(.+)/i,
    /retirar?\s+(.+)/i
  ],
  [INTENTS.EDIT_ITEM]: [
    /alterar?\s+(.+)/i,
    /mudar?\s+(.+)/i,
    /modificar?\s+(.+)/i,
    /editar?\s+(.+)/i,
    /trocar?\s+(.+)/i
  ],
  [INTENTS.SHOW_TOTAL]: [
    /(?:qual|quanto)\s+(?:é|está|fica)\s+o\s+total/i,
    /mostrar?\s+total/i,
    /ver\s+total/i,
    /total/i
  ],
  [INTENTS.LIST_ITEMS]: [
    /listar?\s+(?:itens|serviços|peças)/i,
    /mostrar?\s+(?:itens|serviços|peças)/i,
    /quais?\s+(?:itens|serviços|peças)/i,
    /ver\s+(?:itens|lista)/i
  ],
  [INTENTS.FINALIZE]: [
    /finalizar/i,
    /concluir/i,
    /terminar/i,
    /pronto/i,
    /acabei/i
  ],
  [INTENTS.CANCEL]: [
    /cancelar/i,
    /desistir/i,
    /sair/i,
    /voltar/i
  ],
  [INTENTS.HELP]: [
    /ajuda/i,
    /socorro/i,
    /como\s+(?:funciona|usar|fazer)/i,
    /o\s+que\s+posso\s+fazer/i
  ],

  // Padrões para faturamento
  [INTENTS.INVOICE_SALE]: [
    /(?:fatura|faturo|vende|vendo|emite\s+nota\s+(?:de|da)?)[\s\w]*\s+(?:o\s+|a\s+)?(.+?)\s+para\s+(?:o\s+|a\s+)?(.+)$/i,
    /(?:emite|emitir)\s+(?:nf-?e|nota\s+fiscal)[\s\w]*\s+(?:do|da|de)\s+(.+?)\s+para\s+(?:o\s+|a\s+)?(.+)$/i,
    /(?:venda|vender)\s+(.+?)\s+para\s+(?:o\s+|a\s+)?(.+)$/i,
    /(?:nota\s+fiscal\s+(?:do|da|de)\s+)?(.+?)\s+(?:cliente|para)\s+(.+)$/i
  ],

  [INTENTS.INVOICE_SERVICE]: [
    /(?:emite|emitir)\s+(?:nfs-?e|nota\s+de\s+serviço)[\s\w]*\s+(?:do|da|de)\s+(.+?)\s+para\s+(?:o\s+|a\s+)?(.+)$/i,
    /(?:nota\s+de\s+serviço\s+(?:do|da|de)\s+)?(.+?)\s+(?:cliente|para)\s+(.+)$/i,
    /(?:serviço\s+de\s+)?(.+?)\s+para\s+(?:o\s+|a\s+)?(.+)$/i
  ],

  [INTENTS.INVOICE_BOTH]: [
    /(?:emite|emitir)\s+(?:a\s+)?nota\s+fiscal[\s\w]*\s+(?:do|da|de)\s+(.+?)\s+e\s+(?:a\s+)?nota\s+de\s+serviço[\s\w]*\s+(?:do|da|de)\s+(.+?)\s+para\s+(?:o\s+|a\s+)?(.+)$/i,
    /(?:fatura|faturo)\s+(.+?)\s+e\s+(.+?)\s+para\s+(?:o\s+|a\s+)?(.+)$/i,
    /(?:vende|vendo)\s+(.+?)\s+e\s+(?:faz|fazer|executa|executar)\s+(.+?)\s+para\s+(?:o\s+|a\s+)?(.+)$/i
  ]
};

export const recognizeIntent = (text) => {
  if (!text || typeof text !== 'string') {
    return { intent: INTENTS.UNKNOWN, confidence: 0, params: {} };
  }

  const normalizedText = text.trim().toLowerCase();

  for (const [intent, patterns] of Object.entries(PATTERNS)) {
    for (const pattern of patterns) {
      const match = normalizedText.match(pattern);
      if (match) {
        return {
          intent,
          confidence: 0.9,
          params: extractParams(intent, match, normalizedText),
          originalText: text
        };
      }
    }
  }

  return { intent: INTENTS.UNKNOWN, confidence: 0, params: {}, originalText: text };
};

const extractParams = (intent, match, text) => {
  const params = {};

  switch (intent) {
    case INTENTS.ADD_ITEM:
    case INTENTS.REMOVE_ITEM:
    case INTENTS.EDIT_ITEM:
      if (match[1]) {
        params.itemDescription = match[1].trim();
        params.quantity = extractQuantity(text);
        params.price = extractPrice(text);
        params.itemType = detectItemType(text);
      }
      break;

    case INTENTS.INVOICE_SALE:
      params.products = extractProducts(match[1] || '');
      params.customerName = extractCustomerName(match[2] || '');
      params.type = 'nfe';
      break;

    case INTENTS.INVOICE_SERVICE:
      params.services = extractServices(match[1] || '');
      params.customerName = extractCustomerName(match[2] || '');
      params.type = 'nfse';
      break;

    case INTENTS.INVOICE_BOTH:
      params.products = extractProducts(match[1] || '');
      params.services = extractServices(match[2] || '');
      params.customerName = extractCustomerName(match[3] || '');
      params.type = 'both';
      break;
  }

  return params;
};

const extractQuantity = (text) => {
  const quantityMatch = text.match(/(\d+)\s*(?:unidade|peça|item|vez)/i);
  return quantityMatch ? parseInt(quantityMatch[1]) : 1;
};

const extractPrice = (text) => {
  const priceMatch = text.match(/(?:R\$|reais?)\s*(\d+(?:[.,]\d{2})?)/i);
  if (priceMatch) {
    return parseFloat(priceMatch[1].replace(',', '.'));
  }
  return null;
};

const detectItemType = (text) => {
  if (/serviço|mão\s*de\s*obra|trabalho/i.test(text)) return 'service';
  if (/peça|produto|material|item/i.test(text)) return 'part';
  return 'unknown';
};

/**
 * Extrai produtos do comando de faturamento
 * @param {string} text - Texto do produto
 * @returns {Array} Lista de produtos
 */
const extractProducts = (text) => {
  if (!text) return [];
  
  const products = [];
  
  // Remove palavras de comando
  let cleanText = text
    .replace(/(?:fatura|faturo|vende|vendo|emite\s+nota\s+(?:de|da)?|nota\s+fiscal\s+(?:do|da|de)?|da\s+venda\s+)/gi, '')
    .trim();

  // Extrai quantidade se especificada
  const quantityMatch = cleanText.match(/(\d+)\s+(?:litros?\s+de\s+|unidades?\s+de\s+|de\s+)?(.+)/i);
  if (quantityMatch) {
    products.push({
      name: quantityMatch[2].trim(),
      quantity: parseInt(quantityMatch[1])
    });
  } else if (cleanText) {
    // Produto sem quantidade específica (assume 1)
    products.push({
      name: cleanText.trim(),
      quantity: 1
    });
  }

  return products;
};

/**
 * Extrai serviços do comando
 * @param {string} text - Texto do serviço
 * @returns {Array} Lista de serviços
 */
const extractServices = (text) => {
  if (!text) return [];
  
  const services = [];
  
  // Remove palavras de comando
  let cleanText = text
    .replace(/(?:emite|emitir)\s+(?:nfs-?e|nota\s+de\s+serviço)\s+(?:do|da|de)\s+/gi, '')
    .replace(/(?:serviço\s+de\s+)/gi, '')
    .trim();

  if (cleanText) {
    services.push({
      name: cleanText.trim(),
      quantity: 1
    });
  }

  return services;
};

/**
 * Extrai nome do cliente
 * @param {string} text - Texto com nome do cliente
 * @returns {string} Nome do cliente
 */
const extractCustomerName = (text) => {
  if (!text) return null;
  
  // Remove artigos e palavras extras
  return text
    .replace(/^(?:o\s+|a\s+|os\s+|as\s+)?/i, '')
    .replace(/\s+cliente\s+/gi, ' ')
    .trim();
};

export { INTENTS };
export default recognizeIntent;
