/**
 * Voice Input Controller v2
 * Versão completa com Web Speech API
 */

import { useState, useEffect, useRef, useCallback } from 'react';

class VoiceController {
  constructor(options = {}) {
    this.recognition = null;
    this.isListening = false;
    this.isPaused = false;
    this.hasPermission = false;
    this.onTranscript = options.onTranscript;
    this.onError = options.onError;
    this.onStart = options.onStart;
    this.onEnd = options.onEnd;
    this.config = {
      continuous: options.continuous !== false,
      interimResults: options.interimResults !== false,
      lang: options.lang || 'pt-BR',
      maxAlternatives: options.maxAlternatives || 1
    };
  }

  static isSupported() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  async checkPermissions() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      this.hasPermission = true;
      return true;
    } catch (error) {
      this.hasPermission = false;
      return false;
    }
  }

  async initialize() {
    if (!VoiceController.isSupported()) {
      throw new Error('Web Speech API não suportada');
    }

    const hasPermission = await this.checkPermissions();
    if (!hasPermission) {
      throw new Error('Permissão de microfone negada');
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.lang = this.config.lang;
    this.recognition.maxAlternatives = this.config.maxAlternatives;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.isPaused = false;
      this.onStart?.();
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      this.onTranscript?.({
        final: finalTranscript.trim(),
        interim: interimTranscript.trim(),
        isFinal: finalTranscript.length > 0
      });
    };

    this.recognition.onerror = (event) => {
      this.onError?.({ code: event.error, message: event.error });
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.onEnd?.();
    };
  }

  async start() {
    if (!this.recognition) await this.initialize();
    if (!this.isListening) {
      this.recognition.start();
    }
  }

  stop() {
    this.isPaused = true;
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  destroy() {
    this.stop();
    this.recognition = null;
  }
}

export const useVoiceInput = (options = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState({ final: '', interim: '' });
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    controllerRef.current = new VoiceController({
      ...options,
      onTranscript: (data) => {
        setTranscript(data);
        options.onTranscript?.(data);
      },
      onError: (err) => {
        setError(err);
        setIsListening(false);
        options.onError?.(err);
      },
      onStart: () => {
        setIsListening(true);
        setError(null);
        options.onStart?.();
      },
      onEnd: () => {
        setIsListening(false);
        options.onEnd?.();
      }
    });

    return () => controllerRef.current?.destroy();
  }, []);

  const start = useCallback(async () => {
    await controllerRef.current?.start();
  }, []);

  const stop = useCallback(() => {
    controllerRef.current?.stop();
  }, []);

  return { isListening, transcript, error, isSupported: VoiceController.isSupported(), start, stop };
};

export default VoiceController;
