/**
 * Response Generator Service
 * Gera respostas naturais e contextuais para o usuário
 */

export class ResponseGenerator {
  generateConfirmation(action, params) {
    const confirmations = {
      add_item: `✅ Item adicionado: ${params.description} - R$ ${params.price}`,
      edit_item: `✅ Item atualizado com sucesso`,
      remove_item: `✅ Item removido`,
      show_total: `💰 Total do orçamento: R$ ${params.total}`,
      list_items: `📋 ${params.count} itens no orçamento`,
      finalize: `✅ Orçamento finalizado com sucesso!`
    };
    
    return confirmations[action] || '✅ Ação realizada com sucesso';
  }

  generateError(error, context) {
    const errors = {
      invalid_price: '❌ Preço inválido. Por favor, diga um valor numérico.',
      item_not_found: '❌ Item não encontrado. Tente novamente.',
      empty_budget: '❌ Orçamento vazio. Adicione itens primeiro.',
      api_error: '❌ Erro ao processar comando. Tente novamente.'
    };
    
    return errors[error] || '❌ Erro ao processar comando';
  }

  generateSuggestion(context) {
    const suggestions = [
      'Você pode dizer: "Adicionar troca de óleo por 150 reais"',
      'Experimente: "Mostrar total do orçamento"',
      'Tente: "Remover último item"'
    ];
    
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }
}

export default new ResponseGenerator();
