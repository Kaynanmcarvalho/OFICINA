/**
 * OpenAI Service
 * 
 * Serviço para comunicação com OpenAI API (GPT-4)
 * Usado para interpretação de comandos de voz
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// System prompt otimizado para orçamentos de oficina
const SYSTEM_PROMPT = `Você é um assistente especializado em criar orçamentos para oficinas mecânicas.
Seu papel é interpretar comandos de voz e convertê-los em ações estruturadas.

Contexto:
- Você está ajudando um mecânico a criar um orçamento
- O mecânico pode falar de forma natural e coloquial
- Você deve identificar serviços, peças, quantidades e valores
- Sempre confirme ações importantes

Tipos de comandos:
1. Adicionar serviço: "adicionar troca de óleo", "colocar alinhamento"
2. Adicionar peça: "adicionar filtro de óleo", "colocar 4 pneus"
3. Remover item: "remover troca de óleo", "excluir último item"
4. Alterar valor: "mudar valor do filtro para 50 reais"
5. Alterar quantidade: "aumentar quantidade para 2"
6. Mostrar total: "qual o total?", "quanto está?"
7. Listar itens: "listar itens", "o que tem no orçamento?"
8. Finalizar: "finalizar orçamento", "concluir"

Responda sempre em português brasileiro de forma clara e objetiva.`;

// Function definitions para GPT-4
const FUNCTIONS = [
  {
    name: 'add_service',
    description: 'Adiciona um serviço ao orçamento',
    parameters: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Descrição do serviço (ex: "Troca de óleo")'
        },
        price: {
          type: 'number',
          description: 'Preço do serviço em reais'
        },
        quantity: {
          type: 'number',
          description: 'Quantidade (padrão: 1)',
          default: 1
        }
      },
      required: ['description']
    }
  },
  {
    name: 'add_part',
    description: 'Adiciona uma peça ao orçamento',
    parameters: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Descrição da peça (ex: "Filtro de óleo")'
        },
        price: {
          type: 'number',
          description: 'Preço da peça em reais'
        },
        quantity: {
          type: 'number',
          description: 'Quantidade',
          default: 1
        }
      },
      required: ['description']
    }
  },
  {
    name: 'remove_item',
    description: 'Remove um item do orçamento',
    parameters: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Descrição do item a remover'
        },
        index: {
          type: 'number',
          description: 'Índice do item (opcional)'
        }
      }
    }
  },
  {
    name: 'update_price',
    description: 'Atualiza o preço de um item',
    parameters: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Descrição do item'
        },
        newPrice: {
          type: 'number',
          description: 'Novo preço em reais'
        }
      },
      required: ['description', 'newPrice']
    }
  },
  {
    name: 'update_quantity',
    description: 'Atualiza a quantidade de um item',
    parameters: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Descrição do item'
        },
        newQuantity: {
          type: 'number',
          description: 'Nova quantidade'
        }
      },
      required: ['description', 'newQuantity']
    }
  },
  {
    name: 'show_total',
    description: 'Mostra o total do orçamento',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'list_items',
    description: 'Lista todos os itens do orçamento',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'finalize_budget',
    description: 'Finaliza o orçamento',
    parameters: {
      type: 'object',
      properties: {}
    }
  }
];

/**
 * Process voice command with GPT-4
 */
export const processVoiceCommand = async (transcript, context = {}) => {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      {
        role: 'user',
        content: transcript
      }
    ];

    // Add context if available
    if (context.currentItems && context.currentItems.length > 0) {
      messages.splice(1, 0, {
        role: 'system',
        content: `Itens atuais no orçamento: ${JSON.stringify(context.currentItems)}`
      });
    }

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages,
        functions: FUNCTIONS,
        function_call: 'auto',
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    const message = data.choices[0].message;

    // Check if GPT-4 wants to call a function
    if (message.function_call) {
      const functionName = message.function_call.name;
      const functionArgs = JSON.parse(message.function_call.arguments);

      return {
        type: 'function_call',
        function: functionName,
        arguments: functionArgs,
        confidence: 0.9,
        originalText: transcript
      };
    }

    // Otherwise return the text response
    return {
      type: 'text_response',
      text: message.content,
      confidence: 0.7,
      originalText: transcript
    };

  } catch (error) {
    console.error('Error processing voice command:', error);
    throw error;
  }
};

/**
 * Generate suggestions based on current budget
 */
export const generateSuggestions = async (budgetItems) => {
  try {
    if (!OPENAI_API_KEY) {
      return [];
    }

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em manutenção automotiva. Sugira itens complementares para o orçamento.'
          },
          {
            role: 'user',
            content: `Baseado nestes itens: ${JSON.stringify(budgetItems)}, sugira até 3 itens complementares relevantes.`
          }
        ],
        temperature: 0.5,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const suggestions = data.choices[0].message.content;

    // Parse suggestions (simplified)
    return parseSuggestions(suggestions);

  } catch (error) {
    console.error('Error generating suggestions:', error);
    return [];
  }
};

/**
 * Parse suggestions from GPT-4 response
 */
const parseSuggestions = (text) => {
  // Simple parsing - can be improved
  const lines = text.split('\n').filter(line => line.trim());
  return lines.slice(0, 3).map((line, index) => ({
    id: `suggestion-${index}`,
    description: line.replace(/^[-*\d.]\s*/, '').trim(),
    type: 'service',
    confidence: 0.7
  }));
};

/**
 * Check API health
 */
export const checkOpenAIHealth = async () => {
  try {
    if (!OPENAI_API_KEY) {
      return { status: 'error', message: 'API key not configured' };
    }

    // Simple test request
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 5
      })
    });

    if (response.ok) {
      return { status: 'healthy', message: 'OpenAI API is accessible' };
    } else {
      return { status: 'error', message: 'OpenAI API returned error' };
    }

  } catch (error) {
    return { status: 'error', message: error.message };
  }
};

export default {
  processVoiceCommand,
  generateSuggestions,
  checkOpenAIHealth
};
