/**
 * useAIDiagnosis Hook
 * 
 * Hook para gerenciar diagnósticos com IA
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import { useState, useCallback } from 'react';
import { detectDamages, saveDiagnosis, getVehicleDiagnosisHistory } from '../services/aiDiagnosisService';
import { useAuth } from './useAuth';

export const useAIDiagnosis = () => {
  const { user } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  /**
   * Analyze image and detect damages
   */
  const analyzeImage = useCallback(async (imageFile, vehicleId = null) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // Convert image to base64
      const base64Image = await fileToBase64(imageFile);

      // Detect damages
      const detection = await detectDamages(base64Image);

      // Save to Firestore
      const diagnosisData = {
        vehicleId,
        empresaId: user?.empresaId,
        userId: user?.uid,
        detections: detection.detections || [],
        processing_time_ms: detection.processing_time_ms,
        image_size: detection.image_size,
        model_version: detection.model_version,
        confidence_threshold: 0.45,
        imageUrl: null, // TODO: Upload to Storage if needed
      };

      const diagnosisId = await saveDiagnosis(diagnosisData);

      const finalResult = {
        ...detection,
        diagnosisId,
      };

      setResult(finalResult);
      return finalResult;
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError(err.message || 'Erro ao analisar imagem');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, [user]);

  /**
   * Get diagnosis history
   */
  const getHistory = useCallback(async (vehicleId, limitCount = 10) => {
    try {
      const history = await getVehicleDiagnosisHistory(vehicleId, limitCount);
      return history;
    } catch (err) {
      console.error('Error getting history:', err);
      setError(err.message || 'Erro ao buscar histórico');
      throw err;
    }
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setIsAnalyzing(false);
    setError(null);
    setResult(null);
  }, []);

  return {
    analyzeImage,
    getHistory,
    reset,
    isAnalyzing,
    error,
    result,
  };
};

/**
 * Convert file to base64
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      // Remove data:image/...;base64, prefix
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default useAIDiagnosis;
