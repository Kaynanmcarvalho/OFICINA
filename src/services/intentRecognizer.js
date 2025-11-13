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

export { INTENTS };
export default recognizeIntent;
