/**
 * TORQ Voice Assistant - Premium Apple-like Floating Button
 * Design minimalista, elegante e sofisticado
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Loader2, Sparkles } from 'lucide-react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { parseVoiceCommand } from '../services/commandParser';
import type { VoiceCommand, VoiceButtonPosition } from '../types';

interface VoiceAssistantButtonProps {
  onCommand?: (command: VoiceCommand) => void;
  onError?: (error: string) => void;
}

const STORAGE_KEY = 'torq-voice-position';
const BUTTON_SIZE = 48;
const EDGE_PADDING = 20;

export function VoiceAssistantButton({
  onCommand,
  onError,
}: VoiceAssistantButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragStartMouse = useRef({ x: 0, y: 0 });
  const dragStartTime = useRef(0);
  const hasMoved = useRef(false);

  // Voice recognition hook
  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition({
    language: 'pt-BR',
    continuous: false,
    interimResults: true,
    onResult: (text, isFinal) => {
      if (isFinal && text.trim()) {
        processCommand(text);
      }
    },
    onError: (err) => {
      onError?.(err);
      setIsOpen(false);
    },
    onEnd: () => {
      if (!transcript && !isProcessing) {
        setIsOpen(false);
      }
    },
  });

  // Obter limites da tela
  const getBounds = useCallback(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    return {
      minX: EDGE_PADDING,
      maxX: windowWidth - BUTTON_SIZE - EDGE_PADDING,
      minY: EDGE_PADDING + 80,
      maxY: windowHeight - BUTTON_SIZE - EDGE_PADDING - 100,
    };
  }, []);

  // Clampar posição dentro dos limites
  const clampPosition = useCallback(
    (x: number, y: number) => {
      const bounds = getBounds();
      return {
        x: Math.max(bounds.minX, Math.min(bounds.maxX, x)),
        y: Math.max(bounds.minY, Math.min(bounds.maxY, y)),
      };
    },
    [getBounds]
  );

  // Posição padrão
  const setDefaultPosition = useCallback(() => {
    const bounds = getBounds();
    setPosition({ x: bounds.maxX, y: bounds.maxY - 50 });
  }, [getBounds]);

  // Carregar posição salva
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const pos: VoiceButtonPosition = JSON.parse(saved);
        setPosition(clampPosition(pos.x, pos.y));
      } catch {
        setDefaultPosition();
      }
    } else {
      setDefaultPosition();
    }
  }, [clampPosition, setDefaultPosition]);

  // Atualizar posição quando a janela redimensionar
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => clampPosition(prev.x, prev.y));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [clampPosition]);

  // Salvar posição
  const savePosition = useCallback((pos: { x: number; y: number }) => {
    const data: VoiceButtonPosition = { ...pos, corner: 'bottom-right' };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, []);

  // Snap para a borda mais próxima
  const snapToEdge = useCallback(
    (currentPos: { x: number; y: number }) => {
      const bounds = getBounds();
      const centerX = (bounds.minX + bounds.maxX) / 2;
      const snapX = currentPos.x < centerX ? bounds.minX : bounds.maxX;
      const snapY = Math.max(bounds.minY, Math.min(bounds.maxY, currentPos.y));
      const newPos = { x: snapX, y: snapY };
      setPosition(newPos);
      savePosition(newPos);
    },
    [getBounds, savePosition]
  );

  // Processar comando de voz
  const processCommand = useCallback(
    async (text: string) => {
      setIsProcessing(true);
      try {
        const command = parseVoiceCommand(text);
        setLastCommand(command);
        setShowResult(true);
        if (command.isValid) {
          onCommand?.(command);
        } else {
          onError?.(command.errorMessage || 'Comando não reconhecido');
        }
      } catch {
        onError?.('Erro ao processar comando');
      } finally {
        setIsProcessing(false);
      }
    },
    [onCommand, onError]
  );

  // Handler de clique
  const handleClick = useCallback(() => {
    if (isOpen) {
      stopListening();
      setIsOpen(false);
      setShowResult(false);
      resetTranscript();
    } else {
      setIsOpen(true);
      setShowResult(false);
      setLastCommand(null);
      startListening();
    }
  }, [isOpen, stopListening, resetTranscript, startListening]);

  // Fechar resultado
  const handleCloseResult = useCallback(() => {
    setShowResult(false);
    setLastCommand(null);
    setIsOpen(false);
    resetTranscript();
  }, [resetTranscript]);

  // Mouse/Touch handlers para drag manual
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      hasMoved.current = false;
      dragStartPos.current = { ...position };
      dragStartMouse.current = { x: e.clientX, y: e.clientY };
      dragStartTime.current = Date.now();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [position]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartMouse.current.x;
      const deltaY = e.clientY - dragStartMouse.current.y;
      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        hasMoved.current = true;
      }
      const newX = dragStartPos.current.x + deltaX;
      const newY = dragStartPos.current.y + deltaY;
      setPosition(clampPosition(newX, newY));
    },
    [isDragging, clampPosition]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      const dragDuration = Date.now() - dragStartTime.current;
      setIsDragging(false);
      if (!hasMoved.current && dragDuration < 300) {
        handleClick();
      } else {
        snapToEdge(position);
      }
    },
    [isDragging, position, handleClick, snapToEdge]
  );

  if (!isSupported) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 900 }}
    >
      {/* Botão flutuante premium */}
      <motion.div
        ref={buttonRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          x: position.x,
          y: position.y,
          scale: isDragging ? 1.12 : isHovered ? 1.05 : 1,
        }}
        transition={
          isDragging
            ? { type: 'tween', duration: 0 }
            : { type: 'spring', stiffness: 400, damping: 28, mass: 0.8 }
        }
        className="absolute pointer-events-auto touch-none"
        style={{ top: 0, left: 0 }}
      >
        {/* Glow effect de fundo */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            opacity: isOpen || isListening ? 0.6 : isHovered ? 0.3 : 0,
            scale: isListening ? 1.8 : isHovered ? 1.4 : 1,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            background: isOpen
              ? 'radial-gradient(circle, rgba(239,68,68,0.4) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)',
            filter: 'blur(12px)',
          }}
        />

        {/* Container do botão com glass effect */}
        <motion.button
          className={`
            relative w-12 h-12 rounded-2xl
            flex items-center justify-center
            backdrop-blur-xl
            border border-white/20
            transition-all duration-300 ease-out
            focus:outline-none focus:ring-0
            select-none
            ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          `}
          style={{
            background: isOpen
              ? 'linear-gradient(145deg, rgba(239,68,68,0.95) 0%, rgba(185,28,28,0.95) 100%)'
              : 'linear-gradient(145deg, rgba(59,130,246,0.95) 0%, rgba(37,99,235,0.95) 100%)',
            boxShadow: isDragging
              ? `0 20px 60px -10px ${isOpen ? 'rgba(239,68,68,0.5)' : 'rgba(59,130,246,0.5)'},
                 0 10px 30px -5px rgba(0,0,0,0.3),
                 inset 0 1px 0 rgba(255,255,255,0.2)`
              : isHovered
                ? `0 12px 40px -8px ${isOpen ? 'rgba(239,68,68,0.4)' : 'rgba(59,130,246,0.4)'},
                   0 6px 20px -4px rgba(0,0,0,0.2),
                   inset 0 1px 0 rgba(255,255,255,0.15)`
                : `0 8px 32px -8px ${isOpen ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)'},
                   0 4px 16px -4px rgba(0,0,0,0.15),
                   inset 0 1px 0 rgba(255,255,255,0.1)`,
          }}
          aria-label={
            isOpen ? 'Fechar assistente de voz' : 'Abrir assistente de voz'
          }
        >
          {/* Brilho interno superior */}
          <div
            className="absolute inset-x-2 top-1 h-[1px] rounded-full opacity-40"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
            }}
          />

          {/* Ícone com animação */}
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <Loader2 className="w-5 h-5 text-white animate-spin" strokeWidth={2.5} />
              </motion.div>
            ) : isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                <X className="w-5 h-5 text-white" strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div
                key="mic"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                <Mic className="w-5 h-5 text-white" strokeWidth={2.5} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ondas de áudio premium (estilo Siri) */}
          {isListening && (
            <div className="absolute inset-0 pointer-events-none">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-2xl"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{
                    scale: [1, 1.6 + i * 0.15],
                    opacity: [0.4, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{
                    border: '2px solid rgba(255,255,255,0.3)',
                  }}
                />
              ))}
            </div>
          )}

          {/* Pulse indicator quando ouvindo */}
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{
                boxShadow: [
                  'inset 0 0 15px rgba(255,255,255,0.1)',
                  'inset 0 0 20px rgba(255,255,255,0.25)',
                  'inset 0 0 15px rgba(255,255,255,0.1)',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </motion.button>
      </motion.div>

      {/* Pop-up de resultado premium */}
      <AnimatePresence>
        {(isOpen || showResult) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: Math.min(position.x, window.innerWidth - 320),
              top: Math.max(position.y - 180, 100),
            }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute pointer-events-auto"
            style={{ left: 0 }}
          >
            <div
              className="w-80 rounded-3xl overflow-hidden backdrop-blur-2xl"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(249,250,251,0.98) 100%)',
                boxShadow: `
                  0 25px 80px -12px rgba(0,0,0,0.25),
                  0 12px 40px -8px rgba(0,0,0,0.15),
                  0 0 0 1px rgba(0,0,0,0.05),
                  inset 0 1px 0 rgba(255,255,255,0.8)
                `,
              }}
            >
              {/* Header premium */}
              <div
                className="px-5 py-4 border-b"
                style={{
                  borderColor: 'rgba(0,0,0,0.06)',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(249,250,251,0.6) 100%)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(145deg, #3B82F6 0%, #2563EB 100%)',
                        boxShadow: '0 4px 12px -2px rgba(59,130,246,0.4)',
                      }}
                    >
                      {isListening ? (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Mic className="w-4 h-4 text-white" strokeWidth={2.5} />
                        </motion.div>
                      ) : (
                        <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {isListening
                          ? 'Ouvindo...'
                          : isProcessing
                            ? 'Processando...'
                            : 'Assistente TORQ'}
                      </h3>
                      <p className="text-xs text-gray-500">Inteligência artificial</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleCloseResult}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full flex items-center justify-center
                               bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" strokeWidth={2.5} />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Visualização de áudio quando ouvindo */}
                {isListening && !transcript && !interimTranscript && (
                  <div className="flex flex-col items-center py-6">
                    <div className="flex items-end gap-1 h-12 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 bg-blue-500 rounded-full"
                          animate={{
                            height: ['12px', `${20 + Math.random() * 28}px`, '12px'],
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: 'easeInOut',
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      Diga um comando específico
                    </p>
                    <p className="text-xs text-gray-400 mt-1 italic">
                      &quot;Mostrar orçamento do João do Corolla&quot;
                    </p>
                  </div>
                )}

                {/* Transcript */}
                {(transcript || interimTranscript) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 rounded-2xl bg-gray-50"
                  >
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                      Você disse
                    </p>
                    <p className="text-base text-gray-900 font-medium leading-relaxed">
                      {transcript || interimTranscript}
                      {interimTranscript && !transcript && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className="text-blue-500"
                        >
                          |
                        </motion.span>
                      )}
                    </p>
                  </motion.div>
                )}

                {/* Resultado */}
                {lastCommand && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl ${
                      lastCommand.isValid
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100'
                        : 'bg-gradient-to-br from-red-50 to-rose-50 border border-red-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          lastCommand.isValid
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                            : 'bg-gradient-to-br from-red-500 to-rose-600'
                        }`}
                        style={{
                          boxShadow: lastCommand.isValid
                            ? '0 4px 12px -2px rgba(34,197,94,0.4)'
                            : '0 4px 12px -2px rgba(239,68,68,0.4)',
                        }}
                      >
                        {lastCommand.isValid ? (
                          <motion.svg
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="w-4 h-4 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <motion.path d="M5 12l5 5L20 7" />
                          </motion.svg>
                        ) : (
                          <X className="w-4 h-4 text-white" strokeWidth={3} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-semibold ${
                            lastCommand.isValid ? 'text-green-800' : 'text-red-800'
                          }`}
                        >
                          {lastCommand.isValid ? 'Comando reconhecido' : 'Comando inválido'}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            lastCommand.isValid ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {lastCommand.isValid
                            ? `${lastCommand.action} → ${lastCommand.entity}`
                            : lastCommand.errorMessage}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Erro */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100"
                  >
                    <p className="text-sm text-amber-800">{error}</p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Dark mode styles */}
            <style>{`
              .dark div[class*="w-80"] {
                background: linear-gradient(180deg, rgba(38,38,38,0.98) 0%, rgba(23,23,23,0.99) 100%) !important;
              }
              .dark div[class*="px-5 py-4"] {
                background: linear-gradient(180deg, rgba(38,38,38,0.9) 0%, rgba(30,30,30,0.8) 100%) !important;
                border-color: rgba(255,255,255,0.08) !important;
              }
              .dark h3 { color: #f5f5f5 !important; }
              .dark p[class*="text-gray-500"] { color: #a3a3a3 !important; }
              .dark p[class*="text-gray-400"] { color: #737373 !important; }
              .dark p[class*="text-gray-900"] { color: #f5f5f5 !important; }
              .dark div[class*="bg-gray-50"] { background: rgba(38,38,38,0.8) !important; }
              .dark div[class*="bg-gray-100"] { background: rgba(64,64,64,0.8) !important; }
              .dark button[class*="bg-gray-100"]:hover { background: rgba(82,82,82,0.8) !important; }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default VoiceAssistantButton;
