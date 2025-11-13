/**
 * Voice Budget Assistant - Main Component
 * 
 * Componente principal do assistente de orçamento por voz
 * Orquestra todos os sub-componentes
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';
import './VoiceAssistant.css';

const VoiceBudgetAssistant = ({
  budgetId,
  vehicleId,
  onBudgetUpdate,
  onComplete,
  initialItems = [],
  autoStart = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [budgetItems, setBudgetItems] = useState(initialItems);
  const [error, setError] = useState(null);
  const [sessionId] = useState(`session-${Date.now()}`);

  // Initialize
  useEffect(() => {
    if (autoStart) {
      handleStartListening();
    }
  }, [autoStart]);

  // Notify parent of updates
  useEffect(() => {
    if (onBudgetUpdate) {
      onBudgetUpdate(budgetItems);
    }
  }, [budgetItems, onBudgetUpdate]);

  const handleStartListening = useCallback(() => {
    setIsListening(true);
    setError(null);
    // TODO: Implement actual voice recognition
  }, []);

  const handleStopListening = useCallback(() => {
    setIsListening(false);
    // TODO: Stop voice recognition
  }, []);

  const handleTranscript = useCallback((text) => {
    setTranscript(text);
    // TODO: Process with AI
  }, []);

  const handleAddItem = useCallback((item) => {
    setBudgetItems(prev => [...prev, {
      ...item,
      id: `item-${Date.now()}`,
      timestamp: new Date()
    }]);
  }, []);

  const calculateTotal = useCallback(() => {
    return budgetItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [budgetItems]);

  return (
    <div className="voice-budget-assistant">
      <div className="voice-header">
        <h2>Assistente de Voz</h2>
        <p>Crie orçamentos usando comandos de voz</p>
      </div>

      <div className="voice-controls">
        <button
          className={`mic-button ${isListening ? 'listening' : ''}`}
          onClick={isListening ? handleStopListening : handleStartListening}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader className="spinner" size={32} />
          ) : isListening ? (
            <Mic size={32} />
          ) : (
            <MicOff size={32} />
          )}
        </button>
        <div className="status-text">
          {isProcessing ? 'Processando...' : isListening ? 'Ouvindo...' : 'Clique para falar'}
        </div>
      </div>

      {transcript && (
        <div className="transcript-display">
          <p>{transcript}</p>
        </div>
      )}

      {budgetItems.length > 0 && (
        <div className="budget-items">
          <h3>Itens do Orçamento</h3>
          {budgetItems.map(item => (
            <div key={item.id} className="budget-item">
              <span>{item.description}</span>
              <span>R$ {item.totalPrice.toFixed(2)}</span>
            </div>
          ))}
          <div className="budget-total">
            <strong>Total:</strong>
            <strong>R$ {calculateTotal().toFixed(2)}</strong>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default VoiceBudgetAssistant;
