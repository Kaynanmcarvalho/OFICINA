/**
 * Microphone Capture Component
 * 
 * Componente para captura de áudio do microfone
 * Gerencia permissões e feedback visual
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import './VoiceAssistant.css';

const MicrophoneCapture = ({
  isListening,
  onStart,
  onStop,
  disabled = false,
  size = 'medium'
}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  // Check microphone permission
  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    setIsChecking(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setHasPermission(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleClick = () => {
    if (!hasPermission) {
      checkPermission();
      return;
    }

    if (isListening) {
      onStop?.();
    } else {
      onStart?.();
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'mic-button-small';
      case 'large': return 'mic-button-large';
      default: return 'mic-button-medium';
    }
  };

  return (
    <div className="microphone-capture">
      <button
        className={`mic-button ${getSizeClass()} ${isListening ? 'listening' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleClick}
        disabled={disabled || isChecking}
        aria-label={isListening ? 'Parar gravação' : 'Iniciar gravação'}
      >
        {isChecking ? (
          <div className="mic-checking">
            <div className="spinner-small" />
          </div>
        ) : hasPermission === false ? (
          <AlertCircle className="mic-icon" />
        ) : isListening ? (
          <Mic className="mic-icon mic-active" />
        ) : (
          <MicOff className="mic-icon" />
        )}
        
        {isListening && (
          <div className="mic-pulse">
            <span className="pulse-ring"></span>
            <span className="pulse-ring pulse-ring-delay"></span>
          </div>
        )}
      </button>

      {hasPermission === false && (
        <div className="permission-warning">
          <AlertCircle size={16} />
          <span>Permissão de microfone negada</span>
        </div>
      )}
    </div>
  );
};

export default MicrophoneCapture;
