/**
 * AI Diagnosis Service
 * 
 * Serviço para comunicação com a API YOLOv8
 * Gerencia detecção de danos e histórico
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import { db } from '../firebase/config';
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

// API Configuration
const API_CONFIG = {
  // Local development
  local: 'http://localhost:8080',
  // Cloud Run production
  production: process.env.REACT_APP_YOLOV8_API_URL || 'https://yolov8-detector-xxxxx.run.app',
  // Use local if in development
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : process.env.REACT_APP_YOLOV8_API_URL
};

/**
 * Detect damages in image
 */
export const detectDamages = async (imageBase64, options = {}) => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageBase64,
        confidence_threshold: options.confidenceThreshold || 0.45,
        iou_threshold: options.iouThreshold || 0.45,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error detecting damages:', error);
    throw error;
  }
};

/**
 * Save diagnosis to Firestore
 */
export const saveDiagnosis = async (diagnosisData) => {
  try {
    const docRef = await addDoc(collection(db, 'aiDiagnosis'), {
      ...diagnosisData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error saving diagnosis:', error);
    throw error;
  }
};

/**
 * Get diagnosis history for vehicle
 */
export const getVehicleDiagnosisHistory = async (vehicleId, limitCount = 10) => {
  try {
    const q = query(
      collection(db, 'aiDiagnosis'),
      where('vehicleId', '==', vehicleId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const history = [];

    querySnapshot.forEach((doc) => {
      history.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return history;
  } catch (error) {
    console.error('Error getting diagnosis history:', error);
    throw error;
  }
};

/**
 * Get diagnosis statistics
 */
export const getDiagnosisStats = async (empresaId) => {
  try {
    const q = query(
      collection(db, 'aiDiagnosis'),
      where('empresaId', '==', empresaId)
    );

    const querySnapshot = await getDocs(q);
    
    const stats = {
      total: 0,
      withDamages: 0,
      noDamages: 0,
      damageTypes: {},
      avgConfidence: 0,
      avgProcessingTime: 0,
    };

    let totalConfidence = 0;
    let totalProcessingTime = 0;
    let confidenceCount = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      stats.total++;

      if (data.detections && data.detections.length > 0) {
        stats.withDamages++;

        data.detections.forEach((detection) => {
          const damageType = detection.label;
          stats.damageTypes[damageType] = (stats.damageTypes[damageType] || 0) + 1;
          
          totalConfidence += detection.confidence;
          confidenceCount++;
        });
      } else {
        stats.noDamages++;
      }

      if (data.processing_time_ms) {
        totalProcessingTime += data.processing_time_ms;
      }
    });

    if (confidenceCount > 0) {
      stats.avgConfidence = totalConfidence / confidenceCount;
    }

    if (stats.total > 0) {
      stats.avgProcessingTime = totalProcessingTime / stats.total;
    }

    return stats;
  } catch (error) {
    console.error('Error getting diagnosis stats:', error);
    throw error;
  }
};

/**
 * Check API health
 */
export const checkAPIHealth = async () => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/health`);
    
    if (!response.ok) {
      throw new Error('API not healthy');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking API health:', error);
    return { status: 'unhealthy', error: error.message };
  }
};

/**
 * Get model information
 */
export const getModelInfo = async () => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/model/info`);
    
    if (!response.ok) {
      throw new Error('Failed to get model info');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting model info:', error);
    throw error;
  }
};

export default {
  detectDamages,
  saveDiagnosis,
  getVehicleDiagnosisHistory,
  getDiagnosisStats,
  checkAPIHealth,
  getModelInfo,
};
