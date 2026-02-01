/**
 * Diagnosis Service
 * 
 * Service para gerenciar diagnósticos visuais de veículos
 * Integração com Firebase Storage e Firestore
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import imageCompression from 'browser-image-compression';

class DiagnosisService {
  constructor() {
    this.collectionName = 'diagnostics';
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.compressionThreshold = 2 * 1024 * 1024; // 2MB
    this.validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    this.validStatuses = ['pending', 'uploading', 'processing', 'completed', 'failed', 'reviewed'];
    
    // Damage configurations
    this.damageConfigs = {
      broken_glass: { severity: 'high', cost: 800, description: 'Vidro quebrado' },
      broken_light: { severity: 'medium', cost: 400, description: 'Farol/lanterna quebrado' },
      bumper_damage: { severity: 'medium', cost: 600, description: 'Dano no para-choque' },
      dent: { severity: 'medium', cost: 350, description: 'Amassado' },
      scratch: { severity: 'low', cost: 200, description: 'Arranhão' },
      rust: { severity: 'medium', cost: 500, description: 'Ferrugem' },
      paint_damage: { severity: 'low', cost: 300, description: 'Dano na pintura' },
      flat_tire: { severity: 'high', cost: 250, description: 'Pneu furado/careca' },
      tire_wear: { severity: 'medium', cost: 200, description: 'Desgaste de pneu' },
      mirror_damage: { severity: 'low', cost: 150, description: 'Dano no retrovisor' },
    };
    
    // Severity colors
    this.severityColors = {
      high: 'text-red-500 bg-red-500/10 border-red-500/20',
      medium: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      low: 'text-green-500 bg-green-500/10 border-green-500/20',
    };
  }

  /**
   * Upload images and create diagnosis
   */
  async uploadImages({ files, vehicleId, clientId, empresaId, createdBy, onProgress }) {
    try {
      // 1. Create diagnosis document
      const diagnosisData = {
        vehicleId,
        clientId,
        empresaId,
        createdBy,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'uploading',
        images: [],
        summary: {
          totalDamages: 0,
          needsHumanReview: false,
          estimatedCost: 0,
          suggestedServices: [],
        },
      };

      const diagnosisRef = await addDoc(collection(db, this.collectionName), diagnosisData);
      const diagnosisId = diagnosisRef.id;

      // 2. Upload images to Storage
      const uploadPromises = files.map((file, index) => {
        return this.uploadImage(file, empresaId, diagnosisId, index, onProgress);
      });

      await Promise.all(uploadPromises);

      // 3. Update status to processing
      await updateDoc(diagnosisRef, {
        status: 'processing',
        updatedAt: serverTimestamp(),
      });

      return diagnosisId;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw new Error('Falha ao fazer upload das imagens');
    }
  }

  /**
   * Upload single image to Storage
   */
  async uploadImage(file, empresaId, diagnosisId, index, onProgress) {
    const fileName = `${Date.now()}_${index}.jpg`;
    const storagePath = `vehicle-diagnostics/${empresaId}/${diagnosisId}/${fileName}`;
    const storageRef = ref(storage, storagePath);

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }

    });
  }

  /**
   * Get diagnosis by ID
   */
  async getDiagnosis(empresaIdOrDiagnosisId, diagnosisId) {
    try {
      let diagnosisRef;
      
      // Support both old and new API
      if (diagnosisId) {
        // New API: getDiagnosis(empresaId, diagnosisId)
        diagnosisRef = doc(db, 'empresas', empresaIdOrDiagnosisId, 'diagnostics', diagnosisId);
      } else {
        // Old API: getDiagnosis(diagnosisId)
        diagnosisRef = doc(db, this.collectionName, empresaIdOrDiagnosisId);
      }
      
      const diagnosisSnap = await getDoc(diagnosisRef);

      if (!diagnosisSnap.exists()) {
        return null;
      }

      return {
        id: diagnosisSnap.id,
        ...diagnosisSnap.data(),
      };
    } catch (error) {
      console.error('Error getting diagnosis:', error);
      throw error;
    }
  }

  /**
   * List diagnoses for a vehicle
   */
  async listDiagnoses(vehicleId, empresaId, limitCount = 10) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('vehicleId', '==', vehicleId),
        where('empresaId', '==', empresaId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)

      const querySnapshot = await getDocs(q);
      const diagnoses = [];

      querySnapshot.forEach((doc) => {
        diagnoses.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return diagnoses;
    } catch (error) {
      console.error('Error listing diagnoses:', error);
      throw error;
    }
  }

  /**
   * Delete diagnosis and associated images
   */
  async deleteDiagnosis(diagnosisId) {
    try {
      // 1. Get diagnosis data
      const diagnosis = await this.getDiagnosis(diagnosisId);

      // 2. Delete images from Storage
      if (diagnosis.images && diagnosis.images.length > 0) {
        const deletePromises = diagnosis.images.map(async (image) => {
          try {
            // Extract path from URL
            const originalRef = ref(storage, image.original);
            const annotatedRef = ref(storage, image.annotated);

            await deleteObject(originalRef);
            await deleteObject(annotatedRef);
          } catch (error) {
            console.error('Error deleting image:', error);
            // Continue even if image deletion fails
          }
        });

        await Promise.all(deletePromises);
      }

      // 3. Delete Firestore document
      await deleteDoc(doc(db, this.collectionName, diagnosisId));
    } catch (error) {
      console.error('Error deleting diagnosis:', error);
      throw error;
    }
  }

  /**
   * Subscribe to diagnosis updates (real-time)
   */
  subscribeToDiagnosis(diagnosisId, onUpdate, onError) {
    const diagnosisRef = doc(db, this.collectionName, diagnosisId);

    return onSnapshot(
      diagnosisRef,
      (doc) => {
        if (doc.exists()) {
          onUpdate({
            id: doc.id,
            ...doc.data(),
          });
        }
      },
      (error) => {
        console.error('Error in diagnosis subscription:', error);
        if (onError) {
          onError(error);
        }
      }

  }

  /**
   * Update diagnosis (for human review)
   */
  async updateDiagnosis(diagnosisId, updates) {
    try {
      const diagnosisRef = doc(db, this.collectionName, diagnosisId);
      await updateDoc(diagnosisRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating diagnosis:', error);
      throw error;
    }
  }

  /**
   * Mark diagnosis as reviewed
   */
  async markAsReviewed(diagnosisId, reviewedBy) {
    try {
      await this.updateDiagnosis(diagnosisId, {
        reviewedBy,
        reviewedAt: serverTimestamp(),
        'summary.needsHumanReview': false,
      });
    } catch (error) {
      console.error('Error marking as reviewed:', error);
      throw error;
    }
  }

  /**
   * Create diagnosis (for tests)
   */
  async createDiagnosis(data) {
    if (!data.empresaId) {
      throw new Error('empresaId is required');
    }
    if (!data.vehicleId) {
      throw new Error('vehicleId is required');
    }

    try {
      const diagnosisData = {
        ...data,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        images: data.images || [],
        summary: data.summary || {
          totalDamages: 0,
          needsHumanReview: false,
          estimatedCost: 0,
        },
      };

      const diagnosisRef = await addDoc(
        collection(db, 'empresas', data.empresaId, 'diagnostics'),
        diagnosisData

      return diagnosisRef.id;
    } catch (error) {
      console.error('Error creating diagnosis:', error);
      throw error;
    }
  }

  /**
   * Update diagnosis status
   */
  async updateDiagnosisStatus(empresaId, diagnosisId, status) {
    if (!this.validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    try {
      const diagnosisRef = doc(db, 'empresas', empresaId, 'diagnostics', diagnosisId);
      await updateDoc(diagnosisRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating diagnosis status:', error);
      throw error;
    }
  }

  /**
   * Calculate summary from detections
   */
  calculateSummary(detections) {
    if (!detections || detections.length === 0) {
      return {
        totalDamages: 0,
        estimatedCost: 0,
        needsHumanReview: false,
        confidence: 0,
      };
    }

    const totalDamages = detections.length;
    const estimatedCost = detections.reduce((sum, d) => sum + (d.estimatedCost || 0), 0);
    const needsHumanReview = detections.some((d) => d.confidence < 0.5);
    const avgConfidence = detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length;

    return {
      totalDamages,
      estimatedCost,
      needsHumanReview,
      confidence: Math.round(avgConfidence * 100) / 100,
    };
  }

  /**
   * Get damage description
   */
  getDamageDescription(label) {
    return this.damageConfigs[label]?.description || label;
  }

  /**
   * Get severity color
   */
  getSeverityColor(severity) {
    return this.severityColors[severity] || this.severityColors.medium;
  }

  /**
   * Validate image file
   */
  validateImageFile(file) {
    // Check if it's an image
    if (!this.validImageTypes.includes(file.type)) {
      throw new Error('File must be an image');
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      throw new Error('File size must be less than 10MB');
    }

    return true;
  }

  /**
   * Compress image if needed
   */
  async compressImage(file) {
    // Only compress if larger than threshold
    if (file.size <= this.compressionThreshold) {
      return file;
    }

    try {
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      // Return original file if compression fails
      return file;
    }
  }
}

export const diagnosisService = new DiagnosisService();
