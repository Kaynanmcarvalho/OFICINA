/**
 * Command Parser
 * 
 * Parser para diferentes tipos de comandos de voz
 * Extrai parâmetros e valida comandos
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

/**
 * Parse command from AI response
 */
export const parseCommand = (aiResponse) => {
  if (!aiResponse || aiResponse.type !== 'function_call') {
    return null;
  }

  const { function: func } = aiResponse;
  
  return {
    type: func.name,
    parameters: func.arguments,
    confidence: aiResponse.confidence || 1.0,
    rawResponse: aiResponse
  };
};

/**
 * Validate command parameters
 */
export const validateCommand = (command) => {
  if (!command || !command.type) {
    return {
      valid: false,
      errors: ['Comando inválido']
    };
  }

  const errors = [];

  switch (command.type) {
    case 'add_service':
      if (!command.parameters.description) {
        errors.push('Descrição do serviço é obrigatória');
      }
      break;

    case 'add_part':
      if (!command.parameters.description) {
        errors.push('Descrição da peça é obrigatória');
      }
      break;

    case 'update_price':
      if (!command.parameters.itemDescription) {
        errors.push('Descrição do item é obrigatória');
      }
      if (!command.parameters.newPrice || command.parameters.newPrice <= 0) {
        errors.push('Preço deve ser maior que zero');
      }
      break;

    case 'update_quantity':
      if (!command.parameters.itemDescription) {
        errors.push('Descrição do item é obrigatória');
      }
      if (!command.parameters.newQuantity || command.parameters.newQuantity <= 0) {
        errors.push('Quantidade deve ser maior que zero');
      }
      break;

    case 'remove_item':
      if (!command.parameters.itemDescription) {
        errors.push('Descrição do item é obrigatória');
      }
      break;

    case 'show_total':
    case 'list_items':
    case 'finalize_budget':
      // No parameters required
      break;

    default:
      errors.push(`Comando desconhecido: ${command.type}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Extract parameters from command
 */
export const extractParameters = (command) => {
  if (!command || !command.parameters) {
    return {};
  }

  const params = { ...command.parameters };

  // Normalize price values
  if (params.price !== undefined) {
    params.price = parseFloat(params.price) || 0;
  }
  if (params.newPrice !== undefined) {
    params.newPrice = parseFloat(params.newPrice) || 0;
  }

  // Normalize quantity values
  if (params.quantity !== undefined) {
    params.quantity = parseInt(params.quantity) || 1;
  }
  if (params.newQuantity !== undefined) {
    params.newQuantity = parseInt(params.newQuantity) || 1;
  }

  // Trim string values
  if (params.description) {
    params.description = params.description.trim();
  }
  if (params.itemDescription) {
    params.itemDescription = params.itemDescription.trim();
  }

  return params;
};

/**
 * Get command display name
 */
export const getCommandDisplayName = (commandType) => {
  const displayNames = {
    add_service: 'Adicionar Serviço',
    add_part: 'Adicionar Peça',
    update_price: 'Alterar Preço',
    update_quantity: 'Alterar Quantidade',
    remove_item: 'Remover Item',
    show_total: 'Mostrar Total',
    list_items: 'Listar Itens',
    finalize_budget: 'Finalizar Orçamento'
  };

  return displayNames[commandType] || commandType;
};

/**
 * Parse fallback command (without AI)
 */
export const parseFallbackCommand = (transcript) => {
  const text = transcript.toLowerCase().trim();

  // Add service patterns
  if (text.match(/adicionar|incluir|colocar.*serviço/i)) {
    const description = text.replace(/adicionar|incluir|colocar|serviço/gi, '').trim();
    return {
      type: 'add_service',
      parameters: { description },
      confidence: 0.6,
      fallback: true
    };
  }

  // Add part patterns
  if (text.match(/adicionar|incluir|colocar.*peça/i)) {
    const description = text.replace(/adicionar|incluir|colocar|peça/gi, '').trim();
    return {
      type: 'add_part',
      parameters: { description },
      confidence: 0.6,
      fallback: true
    };
  }

  // Show total patterns
  if (text.match(/total|quanto|valor total/i)) {
    return {
      type: 'show_total',
      parameters: {},
      confidence: 0.8,
      fallback: true
    };
  }

  // List items patterns
  if (text.match(/listar|mostrar.*itens|o que tem/i)) {
    return {
      type: 'list_items',
      parameters: {},
      confidence: 0.8,
      fallback: true
    };
  }

  // Finalize patterns
  if (text.match(/finalizar|terminar|concluir/i)) {
    return {
      type: 'finalize_budget',
      parameters: {},
      confidence: 0.7,
      fallback: true
    };
  }

  return null;
};

export default {
  parseCommand,
  validateCommand,
  extractParameters,
  getCommandDisplayName,
  parseFallbackCommand
};
