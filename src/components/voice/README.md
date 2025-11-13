# 🎤 Voice Assistant Components

Componentes do Assistente de Orçamento Falado.

## Estrutura

```
src/components/voice/
├── VoiceBudgetAssistant.jsx      # Componente principal
├── VoiceInputController.jsx      # Controle de captura de voz
├── MicrophoneCapture.jsx         # UI do microfone
├── AudioVisualizer.jsx           # Visualização de áudio
├── TranscriptionDisplay.jsx      # Exibição de transcrição
├── CommandProcessor.jsx          # Processamento de comandos
├── BudgetItemManager.jsx         # Gerenciamento de itens
├── FeedbackSystem.jsx            # Sistema de feedback
└── VoiceAssistant.css            # Estilos

src/services/
├── openaiService.js              # Integração OpenAI
├── voiceRecognitionService.js    # Web Speech API
└── voiceSessionService.js        # Gerenciamento de sessões

src/hooks/
├── useVoiceRecognition.js        # Hook para reconhecimento de voz
├── useVoiceCommands.js           # Hook para comandos
└── useVoiceSession.js            # Hook para sessões

src/types/
└── voice.ts                      # Tipos TypeScript
```

## Como Usar

### Básico

```jsx
import VoiceBudgetAssistant from './components/voice/VoiceBudgetAssistant';

function BudgetPage() {
  const handleBudgetUpdate = (items) => {
    console.log('Budget updated:', items);
  };

  return (
    <VoiceBudgetAssistant
      budgetId="budget-123"
      onBudgetUpdate={handleBudgetUpdate}
    />
  );
}
```

### Com Itens Iniciais

```jsx
<VoiceBudgetAssistant
  budgetId="budget-123"
  initialItems={existingItems}
  onComplete={(budget) => saveBudget(budget)}
/>
```

### Auto-start

```jsx
<VoiceBudgetAssistant
  autoStart={true}
  onBudgetUpdate={handleUpdate}
/>
```

## Comandos Disponíveis

### Adicionar Itens
- "Adicionar troca de óleo"
- "Adicionar filtro de óleo, 50 reais"
- "Colocar alinhamento e balanceamento"
- "Adicionar 4 pneus Pirelli"

### Editar Itens
- "Mudar valor do filtro para 60 reais"
- "Aumentar quantidade de pneus para 5"
- "Alterar descrição para troca de óleo sintético"

### Remover Itens
- "Remover troca de óleo"
- "Excluir último item"
- "Desfazer"

### Navegação
- "Mostrar total"
- "Listar todos os itens"
- "Qual o valor atual?"
- "Finalizar orçamento"

## Configuração

### Variáveis de Ambiente

```bash
# .env
REACT_APP_OPENAI_API_KEY=sk-...
REACT_APP_VOICE_LANGUAGE=pt-BR
REACT_APP_VOICE_ENABLED=true
```

### Permissões

O assistente requer permissão de microfone. O navegador solicitará automaticamente.

## Troubleshooting

### Microfone não funciona
- Verifique permissões do navegador
- Teste em HTTPS (obrigatório para Web Speech API)
- Verifique se o microfone está conectado

### IA não responde
- Verifique REACT_APP_OPENAI_API_KEY
- Verifique conexão com internet
- Verifique console para erros

### Transcrição incorreta
- Fale mais devagar e claramente
- Reduza ruído ambiente
- Use microfone de qualidade

## Performance

- Transcrição: < 500ms
- Processamento IA: < 2s
- Total: < 3s por comando

## Segurança

- Áudio processado localmente quando possível
- Transcrições criptografadas
- Áudio bruto nunca armazenado
- Conformidade com LGPD

## Suporte

- Documentação: `.kiro/specs/assistente-orcamento-falado/`
- Issues: Reportar bugs no repositório
- Feedback: Compartilhar casos de uso

---

**Versão**: 1.0.0  
**Status**: Em Desenvolvimento  
**Equipe**: Torq AI Team
