import { useState, useEffect, useCallback } from 'react';
import { doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { generateSuggestions, filterIgnoredSuggestions } from '../services/suggestionService';

export const useServiceSuggestions = (vehiclePlate, empresaId, checkinId) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [acceptedServices, setAcceptedServices] = useState([]);
  const [ignoredServices, setIgnoredServices] = useState([]);

  // Carregar sugestões
  const loadSuggestions = useCallback(async () => {
    if (!vehiclePlate || !empresaId) return;

    setLoading(true);
    setError(null);

    try {
      const allSuggestions = await generateSuggestions(vehiclePlate, empresaId);
      const filtered = filterIgnoredSuggestions(allSuggestions, ignoredServices);
      setSuggestions(filtered);
    } catch (err) {
      console.error('Error loading suggestions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [vehiclePlate, empresaId, ignoredServices]);

  useEffect(() => {
    loadSuggestions();
  }, [loadSuggestions]);

  // Aceitar sugestão
  const acceptSuggestion = useCallback(async (suggestion) => {
    if (!checkinId) return { success: false, error: 'Check-in ID não encontrado' };

    try {
      const checkinRef = doc(db, 'checkins', checkinId);
      
      await updateDoc(checkinRef, {
        acceptedSuggestions: arrayUnion(suggestion.service),
        updatedAt: serverTimestamp()
      });

      setAcceptedServices(prev => [...prev, suggestion.service]);
      setSuggestions(prev => prev.filter(s => s.service !== suggestion.service));

      return { success: true, service: suggestion.service };
    } catch (err) {
      console.error('Error accepting suggestion:', err);
      return { success: false, error: err.message };
    }
  }, [checkinId]);

  // Ignorar sugestão
  const ignoreSuggestion = useCallback(async (suggestion) => {
    if (!checkinId) return { success: false, error: 'Check-in ID não encontrado' };

    try {
      const checkinRef = doc(db, 'checkins', checkinId);
      
      await updateDoc(checkinRef, {
        ignoredSuggestions: arrayUnion(suggestion.service),
        updatedAt: serverTimestamp()
      });

      setIgnoredServices(prev => [...prev, suggestion.service]);
      setSuggestions(prev => prev.filter(s => s.service !== suggestion.service));

      return { success: true, service: suggestion.service };
    } catch (err) {
      console.error('Error ignoring suggestion:', err);
      return { success: false, error: err.message };
    }
  }, [checkinId]);

  // Aceitar todas as sugestões
  const acceptAll = useCallback(async () => {
    const results = await Promise.all(
      suggestions.map(s => acceptSuggestion(s))

    const successful = results.filter(r => r.success).length;
    return { success: successful === suggestions.length, count: successful };
  }, [suggestions, acceptSuggestion]);

  // Ignorar todas as sugestões
  const ignoreAll = useCallback(async () => {
    const results = await Promise.all(
      suggestions.map(s => ignoreSuggestion(s))

    const successful = results.filter(r => r.success).length;
    return { success: successful === suggestions.length, count: successful };
  }, [suggestions, ignoreSuggestion]);

  return {
    suggestions,
    loading,
    error,
    acceptedServices,
    ignoredServices,
    acceptSuggestion,
    ignoreSuggestion,
    acceptAll,
    ignoreAll,
    reload: loadSuggestions
  };
};
