import { useState, useCallback } from 'react';
import { validatePin } from '../services/pinService';

export const usePinValidation = (checkinId) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [status, setStatus] = useState('pending'); // pending, valid, invalid, blocked
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePinChange = useCallback((index, value) => {
    if (value.length > 1) return; // Apenas 1 dígito
    if (!/^\d*$/.test(value)) return; // Apenas números

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setStatus('pending');
    setError('');

    // Auto-validar quando todos os 4 dígitos forem preenchidos
    if (newPin.every(digit => digit !== '') && index === 3) {
      validatePinInput(newPin.join(''));
    }
  }, [pin]);

  const validatePinInput = useCallback(async (pinString) => {
    if (!checkinId) {
      setError('ID do check-in não encontrado');
      return;
    }

    setLoading(true);
    setStatus('pending');

    try {
      const result = await validatePin(checkinId, pinString);

      if (result.success) {
        setStatus('valid');
        setError('');
        return { success: true };
      } else {
        if (result.blocked) {
          setStatus('blocked');
          setError(result.error);
        } else {
          setStatus('invalid');
          setError(result.error);
          setAttempts(3 - (result.attemptsLeft || 0));
        }
        
        // Limpar PIN após erro
        setTimeout(() => {
          setPin(['', '', '', '']);
        }, 500);
        
        return { success: false, error: result.error };
      }
    } catch (err) {
      setStatus('invalid');
      setError('Erro ao validar PIN');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [checkinId]);

  const resetPin = useCallback(() => {
    setPin(['', '', '', '']);
    setStatus('pending');
    setError('');
    setAttempts(0);
  }, []);

  return {
    pin,
    status,
    attempts,
    loading,
    error,
    handlePinChange,
    validatePinInput,
    resetPin
  };
};
