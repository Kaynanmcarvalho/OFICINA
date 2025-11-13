# Requirements Document - Assistente de Orçamento Falado

## Introduction

O Assistente de Orçamento Falado é uma funcionalidade que permite aos mecânicos criar orçamentos usando comandos de voz, tornando o processo mais rápido e eficiente, especialmente quando estão com as mãos sujas ou ocupadas trabalhando no veículo.

## Glossary

- **Sistema**: Aplicação web Torq AI
- **Usuário**: Mecânico ou atendente da oficina
- **Orçamento**: Documento com lista de serviços e peças necessárias
- **Comando de Voz**: Instrução falada pelo usuário
- **Transcrição**: Conversão de áudio em texto
- **IA**: Inteligência Artificial (GPT-4 ou similar)
- **Item**: Serviço ou peça no orçamento
- **Sessão**: Período ativo de criação de orçamento por voz

## Requirements

### Requirement 1: Ativação do Assistente de Voz

**User Story:** Como mecânico, quero ativar o assistente de voz com um botão, para que eu possa começar a criar um orçamento usando comandos de voz.

#### Acceptance Criteria

1. WHEN o usuário clica no botão de ativação, THE Sistema SHALL iniciar a captura de áudio do microfone
2. WHEN o microfone é ativado, THE Sistema SHALL exibir indicador visual de que está ouvindo
3. WHEN o usuário não concede permissão de microfone, THE Sistema SHALL exibir mensagem de erro clara
4. WHEN o assistente está ativo, THE Sistema SHALL permitir pausar e retomar a gravação
5. WHEN o usuário clica em desativar, THE Sistema SHALL parar a captura de áudio imediatamente

### Requirement 2: Captura e Transcrição de Áudio

**User Story:** Como mecânico, quero que minha fala seja transcrita automaticamente, para que eu possa ver o que foi entendido pelo sistema.

#### Acceptance Criteria

1. WHEN o usuário fala, THE Sistema SHALL capturar o áudio em tempo real
2. WHEN há áudio capturado, THE Sistema SHALL enviar para API de transcrição (Web Speech API ou Whisper)
3. WHEN a transcrição é recebida, THE Sistema SHALL exibir o texto transcrito em tempo real
4. WHEN há erro na transcrição, THE Sistema SHALL permitir correção manual
5. WHEN o áudio é de baixa qualidade, THE Sistema SHALL indicar ao usuário para repetir

### Requirement 3: Interpretação de Comandos com IA

**User Story:** Como mecânico, quero que a IA entenda meus comandos naturais, para que eu possa falar de forma livre sem decorar comandos específicos.

#### Acceptance Criteria

1. WHEN o texto é transcrito, THE Sistema SHALL enviar para IA (GPT-4) para interpretação
2. WHEN a IA identifica um serviço, THE Sistema SHALL adicionar o item ao orçamento
3. WHEN a IA identifica uma peça, THE Sistema SHALL buscar no inventário e adicionar ao orçamento
4. WHEN a IA identifica um valor, THE Sistema SHALL associar ao item correto
5. WHEN a IA não entende o comando, THE Sistema SHALL solicitar esclarecimento ao usuário

### Requirement 4: Adição de Itens ao Orçamento

**User Story:** Como mecânico, quero que os itens sejam adicionados automaticamente ao orçamento, para que eu não precise digitar manualmente.

#### Acceptance Criteria

1. WHEN a IA identifica um serviço válido, THE Sistema SHALL adicionar à lista de serviços
2. WHEN a IA identifica uma peça válida, THE Sistema SHALL adicionar à lista de peças
3. WHEN um item é adicionado, THE Sistema SHALL exibir confirmação visual e sonora
4. WHEN há duplicação, THE Sistema SHALL perguntar se deve aumentar quantidade ou criar novo item
5. WHEN o item não existe no sistema, THE Sistema SHALL permitir criação rápida

### Requirement 5: Edição e Correção por Voz

**User Story:** Como mecânico, quero corrigir itens usando comandos de voz, para que eu possa fazer ajustes sem usar as mãos.

#### Acceptance Criteria

1. WHEN o usuário diz "remover [item]", THE Sistema SHALL remover o item especificado
2. WHEN o usuário diz "alterar valor de [item] para [valor]", THE Sistema SHALL atualizar o preço
3. WHEN o usuário diz "aumentar quantidade de [item]", THE Sistema SHALL incrementar a quantidade
4. WHEN o usuário diz "desfazer", THE Sistema SHALL reverter a última ação
5. WHEN há ambiguidade no comando, THE Sistema SHALL solicitar confirmação

### Requirement 6: Feedback Visual e Sonoro

**User Story:** Como mecânico, quero receber feedback claro do sistema, para que eu saiba que meus comandos foram entendidos.

#### Acceptance Criteria

1. WHEN um comando é executado com sucesso, THE Sistema SHALL emitir som de confirmação
2. WHEN há erro, THE Sistema SHALL emitir som de erro diferenciado
3. WHEN um item é adicionado, THE Sistema SHALL exibir animação visual
4. WHEN o sistema está processando, THE Sistema SHALL exibir indicador de carregamento
5. WHEN a IA responde, THE Sistema SHALL exibir a resposta em texto e opcionalmente em áudio

### Requirement 7: Integração com Orçamento Existente

**User Story:** Como mecânico, quero que o orçamento criado por voz seja salvo normalmente, para que eu possa editá-lo depois se necessário.

#### Acceptance Criteria

1. WHEN o usuário finaliza o orçamento por voz, THE Sistema SHALL salvar no Firestore
2. WHEN o orçamento é salvo, THE Sistema SHALL incluir todos os itens adicionados por voz
3. WHEN há orçamento em andamento, THE Sistema SHALL permitir continuar por voz
4. WHEN o usuário sai da sessão, THE Sistema SHALL salvar rascunho automaticamente
5. WHEN o orçamento é finalizado, THE Sistema SHALL permitir envio por WhatsApp

### Requirement 8: Comandos de Navegação

**User Story:** Como mecânico, quero navegar pelo orçamento usando voz, para que eu possa revisar os itens sem tocar na tela.

#### Acceptance Criteria

1. WHEN o usuário diz "mostrar total", THE Sistema SHALL exibir o valor total do orçamento
2. WHEN o usuário diz "listar itens", THE Sistema SHALL ler todos os itens adicionados
3. WHEN o usuário diz "próximo item", THE Sistema SHALL navegar para o próximo item
4. WHEN o usuário diz "item anterior", THE Sistema SHALL navegar para o item anterior
5. WHEN o usuário diz "finalizar orçamento", THE Sistema SHALL concluir e salvar

### Requirement 9: Sugestões Inteligentes

**User Story:** Como mecânico, quero receber sugestões da IA, para que eu não esqueça itens importantes no orçamento.

#### Acceptance Criteria

1. WHEN um serviço é adicionado, THE Sistema SHALL sugerir peças relacionadas
2. WHEN uma peça é adicionada, THE Sistema SHALL sugerir serviços relacionados
3. WHEN o orçamento está incompleto, THE Sistema SHALL sugerir itens faltantes
4. WHEN há histórico do veículo, THE Sistema SHALL sugerir manutenções preventivas
5. WHEN o usuário aceita sugestão, THE Sistema SHALL adicionar o item automaticamente

### Requirement 10: Modo Offline e Sincronização

**User Story:** Como mecânico, quero que o assistente funcione mesmo com internet instável, para que eu possa trabalhar sem interrupções.

#### Acceptance Criteria

1. WHEN não há conexão, THE Sistema SHALL usar transcrição local (Web Speech API)
2. WHEN a conexão é restaurada, THE Sistema SHALL sincronizar comandos pendentes
3. WHEN há comandos em fila, THE Sistema SHALL processar na ordem correta
4. WHEN há conflito, THE Sistema SHALL priorizar a versão mais recente
5. WHEN o modo offline está ativo, THE Sistema SHALL indicar funcionalidades limitadas

### Requirement 11: Privacidade e Segurança

**User Story:** Como usuário, quero que meus dados de voz sejam tratados com segurança, para que minha privacidade seja respeitada.

#### Acceptance Criteria

1. WHEN áudio é capturado, THE Sistema SHALL processar localmente quando possível
2. WHEN áudio é enviado para API, THE Sistema SHALL usar conexão criptografada
3. WHEN a transcrição é concluída, THE Sistema SHALL descartar o áudio original
4. WHEN há dados sensíveis, THE Sistema SHALL anonimizar antes de enviar para IA
5. WHEN o usuário solicita, THE Sistema SHALL permitir exclusão de histórico de voz

### Requirement 12: Acessibilidade e Multilíngue

**User Story:** Como mecânico, quero usar o assistente no meu idioma, para que eu possa trabalhar de forma natural.

#### Acceptance Criteria

1. WHEN o sistema inicia, THE Sistema SHALL detectar o idioma do navegador
2. WHEN o usuário fala em português, THE Sistema SHALL transcrever corretamente
3. WHEN há termos técnicos, THE Sistema SHALL reconhecer vocabulário automotivo
4. WHEN o usuário tem sotaque regional, THE Sistema SHALL adaptar o reconhecimento
5. WHEN há ruído ambiente, THE Sistema SHALL filtrar e focar na voz do usuário

---

## Summary

Este documento define os requisitos para o Assistente de Orçamento Falado, uma funcionalidade que permite criar orçamentos usando comandos de voz naturais, com interpretação por IA, feedback em tempo real e integração completa com o sistema existente.

**Total de Requirements**: 12  
**Total de Acceptance Criteria**: 60  
**Prioridade**: Alta  
**Complexidade**: Alta  
**Estimativa**: 3-4 semanas

---

**Version**: 1.0.0  
**Date**: 2025-01-13  
**Status**: Draft  
**Author**: Torq AI Team
