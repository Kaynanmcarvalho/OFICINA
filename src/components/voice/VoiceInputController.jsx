/**
 * Voice Input Controller
 * 
 * Gerencia captura de áudio e transcrição
 * Usa Web Speech API
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import React, { useEffect, useRef, useState } from 'react';

const VoiceInputController = ({
  onTranscript,
  onError,
  language = 'pt-BR',
  continuous = true,
  isActive = false
}) => {
  const recognitionRef = useRef(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      onError?.(new Error('Speech recognition not supported'));
      return;
    }

    // Initialize recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 3;

    // Event handlers
    recognition.onresult = (event) => {
      const results = event.results;
      const lastResult = results[results.length - 1];
      const transcript = lastResult[0].transcript;
      const confidence = lastResult[0].confidence;
      const isFinal = lastResult.isFinal;

      onTranscript?.({
        text: transcript,
        confidence,
        isFinal,
        timestamp: new Date()
      });
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      onError?.(new Error(event.error));
    };

    recognition.onend = () => {
      // Auto-restart if still active
      if (isActive && continuous) {
        try {
          recognition.start();
        } catch (err) {
          console.error('Error restarting recognition:', err);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, continuous, onTranscript, onError]);

  useEffect(() => {
    if (!recognitionRef.current || !isSupported) return;

    if (isActive) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        // Already started
        }
    } else {
      recognitionRef.current.stop();
    }
  }, [isActive, isSupported]);

  if (!isSupported) {
    return (
      <div className="voice-not-supported">
        Reconhecimento de voz não suportado neste navegador.
        Use Chrome, Edge ou Safari.
      </div>
  );
}

return null; // This is a controller component, no UI
};

export default VoiceInputController;
