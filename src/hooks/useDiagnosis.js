/**
 * useDiagnosis Hook
 * 
 * Hook customizado para gerenciar diagnósticos visuais de veículos
 * Features: Upload, real-time updates, error handling
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import { diagnosisService } from '../services/diagnosisService';
import { useAuthStore } from '../store/authStore';
import { useEmpresa } from '../contexts/EmpresaContext';

export const useDiagnosis = (diagnosisId = null) => {
  const { user } = useAuthStore();
  const empresa = useEmpresa();
  
  const [diagnosis, setDiagnosis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Upload images and create diagnosis
   */
  const upload = useCallback(async ({ files, vehicleId, clientId, onProgress }) => {
    if (!user || !empresa) {
      throw new Error('Usuário não autenticado');
    }

    setIsLoading(true);
    setError(null);

    try {
      const newDiagnosisId = await diagnosisService.uploadImages({
        files,
        vehicleId,
        clientId,
        empresaId: empresa.id,
        createdBy: user.uid,
        onProgress,
      });

      return newDiagnosisId;
    } catch (err) {
      console.error('Error uploading images:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, empresa]);

  /**
   * Get diagnosis by ID
   */
  const getDiagnosis = useCallback(async (id) => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await diagnosisService.getDiagnosis(id);
      setDiagnosis(data);
      return data;
    } catch (err) {
      console.error('Error getting diagnosis:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * List diagnoses for a vehicle
   */
  const listDiagnoses = useCallback(async (vehicleId) => {
    if (!vehicleId || !empresa) return [];

    setIsLoading(true);
    setError(null);

    try {
      const list = await diagnosisService.listDiagnoses(vehicleId, empresa.id);
      return list;
    } catch (err) {
      console.error('Error listing diagnoses:', err);
      setError(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [empresa]);

  /**
   * Delete diagnosis
   */
  const deleteDiagnosis = useCallback(async (id) => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      await diagnosisService.deleteDiagnosis(id);
      setDiagnosis(null);
    } catch (err) {
      console.error('Error deleting diagnosis:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setDiagnosis(null);
    setIsLoading(false);
    setError(null);
  }, []);

  /**
   * Real-time listener for diagnosis updates
   */
  useEffect(() => {
    if (!diagnosisId) return;

    const unsubscribe = diagnosisService.subscribeToDiagnosis(
      diagnosisId,
      (data) => {
        setDiagnosis(data);
        
        // If completed, stop loading
        if (data.status === 'completed' || data.status === 'failed') {
          setIsLoading(false);
        }
      },
      (err) => {
        console.error('Error in diagnosis subscription:', err);
        setError(err);
        setIsLoading(false);
      }

    return () => unsubscribe();
  }, [diagnosisId]);

  return {
    diagnosis,
    isLoading,
    error,
    upload,
    getDiagnosis,
    listDiagnoses,
    deleteDiagnosis,
    reset,
  };
};
