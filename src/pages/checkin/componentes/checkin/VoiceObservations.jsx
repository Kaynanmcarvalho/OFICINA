/**
 * VoiceObservations Component
 * Transcrição de voz para texto usando Web Speech API
 * Design Apple-level com visualização de onda
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const VoiceObservations = ({ value = '', onChange }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  // Verificar suporte e inicializar
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcriptPart + ' ';
          } else {
            interim += transcriptPart;
          }
        }

        setInterimTranscript(interim);
        if (final) {
          setTranscript(prev => prev + final);
        }
      };

      recognition.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          toast.error('Permissão de microfone negada');
        } else {
          toast.error('Erro ao reconhecer voz');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Iniciar gravação
  const startListening = () => {
    if (!recognitionRef.current) return;

    try {
      setTranscript('');
      setInterimTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
      toast.success('Escutando...', { icon: '🎤' });
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      toast.error('Erro ao iniciar gravação');
    }
  };

  // Parar gravação
  const stopListening = () => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Erro ao parar gravação:', error);
    }
  };

  // Confirmar e adicionar ao texto
  const handleConfirm = () => {
    const fullTranscript = transcript + interimTranscript;
    if (fullTranscript.trim()) {
      const newValue = value ? `${value}\n\n${fullTranscript.trim()}` : fullTranscript.trim();
      onChange(newValue);
      setTranscript('');
      setInterimTranscript('');
      toast.success('Texto adicionado', { icon: '✅' });
    }
    stopListening();
  };

  // Cancelar
  const handleCancel = () => {
    setTranscript('');
    setInterimTranscript('');
    stopListening();
  };

  if (!isSupported) {
    return (
      <div className="
        p-4 rounded-xl
        bg-amber-50 dark:bg-amber-900/20
        border border-amber-200 dark:border-amber-800
      ">
        <p className="text-sm text-amber-700 dark:text-amber-400">
          ⚠️ Reconhecimento de voz não disponível neste navegador
        </p>
      </div>
  );
}

return (
    <div className="space-y-3">
      {/* Botão de microfone */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isListening ? stopListening : startListening}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl
            font-medium text-sm
            transition-all duration-200
            ${isListening
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30'
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30'
            }
          `}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              Parar Gravação
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Gravar Observações
            </>
          )}
        </motion.button>

        {isListening && (
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scaleY: [1, 1.5, 1],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
                className="w-1 h-4 bg-red-500 rounded-full"
              />
            ))}
          </div>
        )}
      </div>

      {/* Preview da transcrição */}
      <AnimatePresence>
        {(transcript || interimTranscript) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="
              p-4 rounded-xl
              bg-blue-50 dark:bg-blue-900/20
              border border-blue-200 dark:border-blue-800
            "
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Transcrição:
              </span>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleConfirm}
                  className="
                    p-1.5 rounded-lg
                    bg-green-500 hover:bg-green-600
                    text-white
                    transition-colors
                  "
                  title="Confirmar e adicionar"
                >
                  <Check className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCancel}
                  className="
                    p-1.5 rounded-lg
                    bg-red-500 hover:bg-red-600
                    text-white
                    transition-colors
                  "
                  title="Cancelar"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {transcript}
              <span className="text-gray-400 dark:text-gray-500 italic">
                {interimTranscript}
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Textarea principal */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Digite ou grave observações sobre o veículo..."
        rows={4}
        className="
          w-full px-4 py-3 rounded-xl
          bg-white dark:bg-gray-800
          border border-gray-300 dark:border-gray-700
          text-gray-900 dark:text-white
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500/50
          resize-none
          transition-all duration-200
        "
      />
    </div>
  );
};

export default VoiceObservations;
