/**
 * Voice Input Controller
 * 
 * Controlador de entrada de voz usando Web Speech API
 * Gerencia reconhecimento de fala e transcrição
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

class VoiceInputController {
  constructor(options = {}) {
    this.recognition = null;
    this.isListening = false;
    this.isPaused = false;
    this.transcript = '';
    this.interimTranscript = '';
    
    // Callbacks
    this.onTranscript = options.onTranscript || (() => {});
    this.onInterimTranscript = options.onInterimTranscript || (() => {});
    this.onStart = options.onStart || (() => {});
    this.onStop = options.onStop || (() => {});
    this.onError = options.onError || (() => {});
    this.onEnd = options.onEnd || (() => {});
    
    // Configuration
    this.language = options.language || 'pt-BR';
    this.continuous = options.continuous !== false;
    this.interimResults = options.interimResults !== false;
    this.maxAlternatives = options.maxAlternatives || 1;
    
    this.initialize();
  }

  initialize() {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported in this browser');
      this.onError({
        type: 'not-supported',
        message: 'Reconhecimento de voz não suportado neste navegador'
      });
      return false;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
      return true;
    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      this.onError({
        type: 'initialization-error',
        message: 'Erro ao inicializar reconhecimento de voz'
      });
      return false;
    }
  }

  setupRecognition() {
    if (!this.recognition) return;

    // Configure recognition
    this.recognition.continuous = this.continuous;
    this.recognition.interimResults = this.interimResults;
    this.recognition.lang = this.language;
    this.recognition.maxAlternatives = this.maxAlternatives;

    // Event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      this.isPaused = false;
      this.onStart();
    };

    this.recognition.onresult = (event) => {
      this.handleResult(event);
    };

    this.recognition.onerror = (event) => {
      this.handleError(event);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.onEnd();
      
      // Auto-restart if continuous and not manually stopped
      if (this.continuous && !this.isPaused) {
        this.start();
      }
    };
  }

  handleResult(event) {
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

    // Update transcripts
    if (finalTranscript) {
      this.transcript += finalTranscript;
      this.onTranscript(finalTranscript.trim(), this.transcript.trim());
    }

    if (interimTranscript) {
      this.interimTranscript = interimTranscript;
      this.onInterimTranscript(interimTranscript.trim());
    }
  }

  handleError(event) {
    console.error('Speech recognition error:', event.error);
    
    const errorMessages = {
      'no-speech': 'Nenhuma fala detectada',
      'audio-capture': 'Erro ao capturar áudio',
      'not-allowed': 'Permissão de microfone negada',
      'network': 'Erro de rede',
      'aborted': 'Reconhecimento abortado',
      'bad-grammar': 'Erro de gramática',
      'language-not-supported': 'Idioma não suportado'
    };

    this.onError({
      type: event.error,
      message: errorMessages[event.error] || 'Erro desconhecido'
    });
  }

  async start() {
    if (!this.recognition) {
      const initialized = this.initialize();
      if (!initialized) return false;
    }

    if (this.isListening) {
      console.warn('Already listening');
      return false;
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.transcript = '';
      this.interimTranscript = '';
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Error starting recognition:', error);
      this.onError({
        type: 'permission-denied',
        message: 'Permissão de microfone negada'
      });
      return false;
    }
  }

  stop() {
    if (!this.recognition || !this.isListening) {
      return false;
    }

    this.isPaused = true;
    this.recognition.stop();
    return true;
  }

  pause() {
    return this.stop();
  }

  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      return this.start();
    }
    return false;
  }

  reset() {
    this.transcript = '';
    this.interimTranscript = '';
  }

  getTranscript() {
    return this.transcript.trim();
  }

  getInterimTranscript() {
    return this.interimTranscript.trim();
  }

  isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  destroy() {
    if (this.recognition) {
      this.stop();
      this.recognition = null;
    }
  }
}

export default VoiceInputController;
