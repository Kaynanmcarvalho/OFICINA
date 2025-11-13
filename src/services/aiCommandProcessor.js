/**
 * AI Command Processor
 * 
 * Processa comandos de voz usando OpenAI
 * Extrai intenções e parâmetros estruturados
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import { processVoiceCommand } from './openaiService';

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

      // Call OpenAI
      const result = await processVoiceCommand(transcript, fullContext);

      // Add to history
      this.addToHistory({
        transcript,
        result,
        timestamp: new Date()
      });

      // Notify callback
      if (result.type === 'function_call') {
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
