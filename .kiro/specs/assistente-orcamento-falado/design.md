# Design Document - Assistente de Orçamento Falado

## Overview

O Assistente de Orçamento Falado é um sistema de interface por voz que permite aos mecânicos criar e editar orçamentos usando comandos naturais. O sistema utiliza Web Speech API para transcrição local, GPT-4 para interpretação de comandos, e integra-se perfeitamente com o sistema de orçamentos existente.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Voice Input  │  │ AI Processor │  │ Budget UI    │     │
│  │ Component    │──│ Service      │──│ Integration  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         ▼                  ▼                  ▼             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Web Speech   │  │ OpenAI API   │  │ Firestore    │     │
│  │ API          │  │ (GPT-4)      │  │ Database     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
VoiceBudgetAssistant (Main Component)
├── VoiceInputController
│   ├── MicrophoneCapture
│   ├── AudioVisualizer
│   └── TranscriptionDisplay
├── AICommandProcessor
│   ├── CommandParser
│   ├── IntentRecognizer
│   └── ResponseGenerator
├── BudgetItemManager
│   ├── ItemAdder
│   ├── ItemEditor
│   └── ItemRemover
└── FeedbackSystem
    ├── VisualFeedback
    ├── AudioFeedback
    └── NotificationManager
```

## Components and Interfaces

### 1. VoiceBudgetAssistant (Main Component)

**Purpose**: Componente principal que orquestra todo o sistema de voz

**Props**:
```typescript
interface VoiceBudgetAssistantProps {
  budgetId?: string;
  vehicleId?: string;
  onBudgetUpdate?: (budget: Budget) => void;
  onComplete?: (budget: Budget) => void;
  initialItems?: BudgetItem[];
}
```

**State**:
```typescript
interface VoiceAssistantState {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  currentCommand: string;
  budgetItems: BudgetItem[];
  suggestions: Suggestion[];
  error: string | null;
  sessionId: string;
}
```

### 2. VoiceInputController

**Purpose**: Gerencia captura de áudio e transcrição

**Methods**:
```typescript
class VoiceInputController {
  startListening(): Promise<void>
  stopListening(): void
  pauseListening(): void
  resumeListening(): void
  getTranscript(): string
  clearTranscript(): void
}
```

**Events**:
- `onTranscriptUpdate`: Quando há nova transcrição
- `onSpeechEnd`: Quando o usuário para de falar
- `onError`: Quando há erro na captura

### 3. AICommandProcessor

**Purpose**: Processa comandos usando IA

**Interface**:
```typescript
interface AICommandProcessor {
  processCommand(transcript: string, context: BudgetContext): Promise<CommandResult>
  interpretIntent(text: string): Promise<Intent>
  generateSuggestions(budget: Budget): Promise<Suggestion[]>
  validateCommand(command: Command): boolean
}
```

**Command Types**:
```typescript
type CommandType = 
  | 'ADD_SERVICE'
  | 'ADD_PART'
  | 'REMOVE_ITEM'
  | 'UPDATE_PRICE'
  | 'UPDATE_QUANTITY'
  | 'SHOW_TOTAL'
  | 'LIST_ITEMS'
  | 'FINALIZE'
  | 'UNDO'
  | 'HELP';

interface Command {
  type: CommandType;
  params: Record<string, any>;
  confidence: number;
  originalText: string;
}
```

### 4. BudgetItemManager

**Purpose**: Gerencia itens do orçamento

**Methods**:
```typescript
class BudgetItemManager {
  addItem(item: BudgetItem): Promise<void>
  removeItem(itemId: string): Promise<void>
  updateItem(itemId: string, updates: Partial<BudgetItem>): Promise<void>
  getItems(): BudgetItem[]
  calculateTotal(): number
  validateItem(item: BudgetItem): ValidationResult
}
```

### 5. FeedbackSystem

**Purpose**: Fornece feedback visual e sonoro

**Methods**:
```typescript
class FeedbackSystem {
  showSuccess(message: string): void
  showError(message: string): void
  playSound(type: 'success' | 'error' | 'info'): void
  showAnimation(type: AnimationType): void
  speak(text: string): Promise<void>
}
```

## Data Models

### BudgetItem

```typescript
interface BudgetItem {
  id: string;
  type: 'service' | 'part';
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
  addedBy: 'voice' | 'manual';
  confidence?: number;
  timestamp: Date;
}
```

### VoiceSession

```typescript
interface VoiceSession {
  id: string;
  budgetId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  commands: VoiceCommand[];
  transcripts: Transcript[];
  itemsAdded: number;
  itemsRemoved: number;
  totalDuration: number;
}
```

### VoiceCommand

```typescript
interface VoiceCommand {
  id: string;
  sessionId: string;
  transcript: string;
  intent: CommandType;
  params: Record<string, any>;
  result: 'success' | 'error' | 'pending';
  confidence: number;
  processingTime: number;
  timestamp: Date;
}
```

### Suggestion

```typescript
interface Suggestion {
  id: string;
  type: 'service' | 'part';
  description: string;
  reason: string;
  confidence: number;
  relatedTo?: string;
  estimatedPrice?: number;
}
```

## API Integration

### OpenAI GPT-4 Integration

**Endpoint**: `https://api.openai.com/v1/chat/completions`

**Request Format**:
```typescript
interface GPTRequest {
  model: 'gpt-4-turbo-preview';
  messages: Message[];
  functions: FunctionDefinition[];
  function_call: 'auto';
  temperature: 0.3;
}
```

**System Prompt**:
```
Você é um assistente especializado em criar orçamentos para oficinas mecânicas.
Seu papel é interpretar comandos de voz e convertê-los em ações estruturadas.

Contexto:
- Você está ajudando um mecânico a criar um orçamento
- O mecânico pode falar de forma natural e coloquial
- Você deve identificar serviços, peças, quantidades e valores
- Sempre confirme ações importantes

Comandos disponíveis:
- Adicionar serviço: "adicionar troca de óleo"
- Adicionar peça: "adicionar filtro de óleo"
- Remover item: "remover troca de óleo"
- Alterar valor: "mudar valor do filtro para 50 reais"
- Mostrar total: "qual o total?"
- Finalizar: "finalizar orçamento"
```

**Function Definitions**:
```typescript
const functions = [
  {
    name: 'add_service',
    description: 'Adiciona um serviço ao orçamento',
    parameters: {
      type: 'object',
      properties: {
        description: { type: 'string' },
        price: { type: 'number' },
        quantity: { type: 'number', default: 1 }
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
        description: { type: 'string' },
        price: { type: 'number' },
        quantity: { type: 'number', default: 1 }
      },
      required: ['description']
    }
  },
  // ... outros comandos
];
```

### Web Speech API Integration

**Speech Recognition**:
```typescript
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'pt-BR';
recognition.maxAlternatives = 3;
```

**Speech Synthesis** (opcional):
```typescript
const synthesis = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = 'pt-BR';
utterance.rate = 1.0;
utterance.pitch = 1.0;
```

## Error Handling

### Error Types

```typescript
enum VoiceErrorType {
  MICROPHONE_ACCESS_DENIED = 'MICROPHONE_ACCESS_DENIED',
  TRANSCRIPTION_FAILED = 'TRANSCRIPTION_FAILED',
  AI_PROCESSING_ERROR = 'AI_PROCESSING_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_COMMAND = 'INVALID_COMMAND',
  ITEM_NOT_FOUND = 'ITEM_NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}
```

### Error Recovery Strategies

1. **Microphone Access Denied**:
   - Show clear instructions to enable microphone
   - Provide fallback to manual input
   - Save session state

2. **Transcription Failed**:
   - Ask user to repeat
   - Show manual correction option
   - Log for improvement

3. **AI Processing Error**:
   - Retry with exponential backoff
   - Fall back to rule-based parsing
   - Show error message

4. **Network Error**:
   - Queue commands for later
   - Enable offline mode
   - Sync when connection restored

## Testing Strategy

### Unit Tests

```typescript
describe('VoiceInputController', () => {
  test('should start listening when startListening is called')
  test('should stop listening when stopListening is called')
  test('should emit transcript updates')
  test('should handle microphone errors')
});

describe('AICommandProcessor', () => {
  test('should parse add service command')
  test('should parse add part command')
  test('should handle ambiguous commands')
  test('should generate relevant suggestions')
});

describe('BudgetItemManager', () => {
  test('should add item to budget')
  test('should remove item from budget')
  test('should update item price')
  test('should calculate total correctly')
});
```

### Integration Tests

```typescript
describe('Voice Budget Flow', () => {
  test('should create budget from voice commands')
  test('should edit existing budget with voice')
  test('should handle multiple commands in sequence')
  test('should sync with Firestore')
});
```

### E2E Tests

```typescript
describe('Voice Assistant E2E', () => {
  test('user can create complete budget using only voice')
  test('user can correct mistakes using voice')
  test('user can finalize and save budget')
  test('budget appears in budget list')
});
```

## Performance Considerations

### Optimization Strategies

1. **Audio Processing**:
   - Use Web Workers for audio processing
   - Implement voice activity detection
   - Reduce unnecessary API calls

2. **AI Processing**:
   - Cache common commands
   - Batch multiple commands
   - Use streaming responses

3. **UI Updates**:
   - Debounce transcript updates
   - Use React.memo for components
   - Implement virtual scrolling for long lists

4. **Network**:
   - Compress audio before sending
   - Use WebSocket for real-time updates
   - Implement request queuing

### Performance Targets

- **Transcription Latency**: < 500ms
- **AI Processing**: < 2s
- **UI Update**: < 100ms
- **Total Command Time**: < 3s

## Security Considerations

### Data Privacy

1. **Audio Data**:
   - Process locally when possible
   - Encrypt before sending to API
   - Delete after transcription
   - Never store raw audio

2. **Transcripts**:
   - Anonymize sensitive data
   - Store encrypted in Firestore
   - Allow user deletion
   - Comply with LGPD

3. **API Keys**:
   - Store in environment variables
   - Use backend proxy for OpenAI
   - Rotate keys regularly
   - Monitor usage

### Access Control

```typescript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /voiceSessions/{sessionId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
    
    match /voiceCommands/{commandId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Deployment Strategy

### Phase 1: Beta (Week 1-2)
- Deploy to staging
- Test with 5-10 users
- Collect feedback
- Fix critical bugs

### Phase 2: Limited Release (Week 3)
- Deploy to 20% of users
- Monitor performance
- Gather analytics
- Iterate on UX

### Phase 3: Full Release (Week 4)
- Deploy to all users
- Enable by default
- Provide tutorial
- Monitor adoption

## Monitoring and Analytics

### Metrics to Track

```typescript
interface VoiceMetrics {
  // Usage
  sessionsStarted: number;
  sessionsCompleted: number;
  averageSessionDuration: number;
  commandsPerSession: number;
  
  // Performance
  transcriptionLatency: number;
  aiProcessingTime: number;
  errorRate: number;
  
  // Quality
  commandSuccessRate: number;
  userCorrectionRate: number;
  averageConfidence: number;
  
  // Business
  budgetsCreated: number;
  itemsAddedByVoice: number;
  timesSaved: number;
}
```

### Logging

```typescript
// Log voice command
logger.info('Voice command processed', {
  sessionId,
  command: commandType,
  confidence,
  processingTime,
  result: 'success'
});

// Log error
logger.error('Voice processing failed', {
  sessionId,
  error: errorType,
  transcript,
  context
});
```

---

## Summary

Este design document define a arquitetura completa do Assistente de Orçamento Falado, incluindo componentes, APIs, modelos de dados, tratamento de erros, testes, performance, segurança e estratégia de deployment.

**Complexity**: Alta  
**Estimated Effort**: 3-4 semanas  
**Dependencies**: OpenAI API, Web Speech API, Firestore  
**Risk Level**: Médio

---

**Version**: 1.0.0  
**Date**: 2025-01-13  
**Status**: Draft  
**Author**: Torq AI Team
