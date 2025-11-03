import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ServiceRating Component
 * 
 * Sistema de avaliação de serviço com 5 estrelas
 * Feedback opcional e animações interativas
 * 
 * @param {Function} onRate - Callback quando avaliação é enviada
 * @param {Boolean} optional - Se a avaliação é opcional
 */
const ServiceRating = ({ onRate, optional = true }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  /**
   * Mensagens baseadas na avaliação
   */
  const getRatingMessage = (stars) => {
    const messages = {
      1: { text: 'Que pena! Como podemos melhorar?', emoji: '😞', color: 'red' },
      2: { text: 'Podemos melhorar. O que aconteceu?', emoji: '😕', color: 'orange' },
      3: { text: 'Bom! Mas podemos fazer melhor.', emoji: '😐', color: 'yellow' },
      4: { text: 'Ótimo! Ficamos felizes!', emoji: '😊', color: 'green' },
      5: { text: 'Excelente! Muito obrigado!', emoji: '🤩', color: 'emerald' }
    };
    return messages[stars] || null;
  };

  /**
   * Manipula o envio da avaliação
   */
  const handleSubmit = () => {
    if (rating === 0) return;

    const ratingData = {
      rating,
      feedback: feedback.trim(),
      timestamp: new Date().toISOString()
    };

    onRate(ratingData);
    setSubmitted(true);

    // Confetti animation para 5 estrelas
    if (rating === 5) {
      triggerConfetti();
    }
  };

  /**
   * Trigger confetti effect (simulado)
   */
  const triggerConfetti = () => {
    // Aqui você pode integrar uma biblioteca de confetti
    console.log('🎉 Confetti!');
  };

  /**
   * Pular avaliação
   */
  const handleSkip = () => {
    onRate({ rating: null, skipped: true });
  };

  const currentMessage = getRatingMessage(hover || rating);

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
        >
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
        >
          Obrigado pela avaliação!
        </motion.h3>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-400"
        >
          Seu feedback é muito importante para nós
        </motion.p>

        {rating === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-4xl"
          >
            🎉
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Como foi sua experiência?
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {optional ? 'Sua avaliação nos ajuda a melhorar (opcional)' : 'Avalie nosso serviço'}
        </p>
      </div>

      {/* Stars */}
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            onClick={() => {
              setRating(star);
              setShowFeedback(true);
            }}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-lg p-1"
          >
            <motion.svg
              className={`w-12 h-12 transition-colors ${
                star <= (hover || rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
              fill={star <= (hover || rating) ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              animate={{
                rotate: star <= (hover || rating) ? [0, -10, 10, 0] : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </motion.svg>
          </motion.button>
        ))}
      </div>

      {/* Rating Message */}
      <AnimatePresence mode="wait">
        {currentMessage && (
          <motion.div
            key={hover || rating}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-center"
          >
            <p className={`text-lg font-medium text-${currentMessage.color}-600 dark:text-${currentMessage.color}-400`}>
              {currentMessage.emoji} {currentMessage.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Textarea */}
      <AnimatePresence>
        {showFeedback && rating > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Comentários {rating <= 3 && '(nos ajude a melhorar)'}
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={
                rating <= 3
                  ? 'O que podemos melhorar?'
                  : 'Conte-nos mais sobre sua experiência...'
              }
              rows={4}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {feedback.length}/500 caracteres
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {optional && (
          <button
            onClick={handleSkip}
            className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Pular
          </button>
        )}
        
        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${
            rating > 0
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          Enviar Avaliação
        </button>
      </div>

      {/* Quick Rating Stats (opcional) */}
      {rating > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-gray-500 dark:text-gray-400"
        >
          Você avaliou com {rating} {rating === 1 ? 'estrela' : 'estrelas'}
        </motion.div>
      )}
    </div>
  );
};

export default ServiceRating;
