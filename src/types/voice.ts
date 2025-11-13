/**
 * Voice Assistant Types
 * 
 * Definições de tipos TypeScript para o assistente de voz
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

// Command Types
export type CommandType =
  | 'ADD_SERVICE'
  | 'ADD_PART'
  | 'REMOVE_ITEM'
  | 'UPDATE_PRICE'
  | 'UPDATE_QUANTITY'
  | 'SHOW_TOTAL'
  | 'LIST_ITEMS'
  | 'FINALIZE'
  | 'UNDO'
  | 'HELP'
  | 'UNKNOWN';

// Budget Item
export interface BudgetItem {
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

// Voice Command
export interface VoiceCommand {
  id: string;
  sessionId: string;
  transcript: string;
  intent: CommandType;
  params: Record<string, any>;
  result: 'success' | 'error' | 'pending';
  confidence: number;
  processingTime: number;
  timestamp: Date;
  error?: string;
}

// Voice Session
export interface VoiceSession {
  id: string;
  budgetId?: string;
  vehicleId?: string;
  userId: string;
  empresaId: string;
  startTime: Date;
  endTime?: Date;
  commands: VoiceCommand[];
  transcripts: Transcript[];
  itemsAdded: number;
  itemsRemoved: number;
  totalDuration: number;
  status: 'active' | 'completed' | 'cancelled';
}

// Transcript
export interface Transcript {
  id: string;
  text: string;
  confidence: number;
  timestamp: Date;
  isFinal: boolean;
}

// Command Result
export interface CommandResult {
  type: 'function_call' | 'text_response';
  function?: string;
  arguments?: Record<string, any>;
  text?: string;
  confidence: number;
  originalText: string;
}

// Suggestion
export interface Suggestion {
  id: string;
  type: 'service' | 'part';
  description: string;
  reason: string;
  confidence: number;
  relatedTo?: string;
  estimatedPrice?: number;
}

// Voice Assistant State
export interface VoiceAssistantState {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  currentCommand: string;
  budgetItems: BudgetItem[];
  suggestions: Suggestion[];
  error: string | null;
  sessionId: string;
  history: VoiceCommand[];
}

// Voice Input Props
export interface VoiceInputProps {
  onTranscript?: (transcript: string) => void;
  onCommand?: (command: CommandResult) => void;
  onError?: (error: Error) => void;
  language?: string;
  continuous?: boolean;
}

// Budget Context
export interface BudgetContext {
  budgetId?: string;
  vehicleId?: string;
  currentItems: BudgetItem[];
  totalValue: number;
}

// Feedback Type
export type FeedbackType = 'success' | 'error' | 'info' | 'warning';

// Animation Type
export type AnimationType = 
  | 'pulse'
  | 'bounce'
  | 'shake'
  | 'fade'
  | 'slide';

// Voice Error Type
export enum VoiceErrorType {
  MICROPHONE_ACCESS_DENIED = 'MICROPHONE_ACCESS_DENIED',
  TRANSCRIPTION_FAILED = 'TRANSCRIPTION_FAILED',
  AI_PROCESSING_ERROR = 'AI_PROCESSING_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_COMMAND = 'INVALID_COMMAND',
  ITEM_NOT_FOUND = 'ITEM_NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  API_KEY_MISSING = 'API_KEY_MISSING'
}

// Voice Error
export interface VoiceError {
  type: VoiceErrorType;
  message: string;
  details?: any;
  timestamp: Date;
}

// Voice Metrics
export interface VoiceMetrics {
  sessionsStarted: number;
  sessionsCompleted: number;
  averageSessionDuration: number;
  commandsPerSession: number;
  transcriptionLatency: number;
  aiProcessingTime: number;
  errorRate: number;
  commandSuccessRate: number;
  userCorrectionRate: number;
  averageConfidence: number;
  budgetsCreated: number;
  itemsAddedByVoice: number;
  timesSaved: number;
}

// Speech Recognition Event
export interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

// Speech Recognition Result
export interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

// Speech Recognition Alternative
export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Speech Recognition Result List
export interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

// Voice Budget Assistant Props
export interface VoiceBudgetAssistantProps {
  budgetId?: string;
  vehicleId?: string;
  onBudgetUpdate?: (budget: BudgetItem[]) => void;
  onComplete?: (budget: BudgetItem[]) => void;
  initialItems?: BudgetItem[];
  autoStart?: boolean;
}

export default {
  CommandType,
  BudgetItem,
  VoiceCommand,
  VoiceSession,
  Transcript,
  CommandResult,
  Suggestion,
  VoiceAssistantState,
  VoiceInputProps,
  BudgetContext,
  FeedbackType,
  AnimationType,
  VoiceErrorType,
  VoiceError,
  VoiceMetrics,
  VoiceBudgetAssistantProps
};
