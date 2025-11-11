import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { 
  calculateProgress, 
  updateStage as updateStageService, 
  addStageNote as addStageNoteService,
  getStageOrder 
} from '../services/timelineService';

const STAGES_DEFAULT = ['checkin', 'diagnostico', 'orcamento', 'execucao', 'finalizacao', 'checkout'];

export const useVehicleTimeline = (checkinId) => {
  const [timeline, setTimeline] = useState(null);
  const [currentStage, setCurrentStage] = useState('checkin');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stageOrder, setStageOrder] = useState(STAGES_DEFAULT);

  useEffect(() => {
    if (!checkinId) {
      setLoading(false);
      return;
    }

    console.log('🔍 useVehicleTimeline: Buscando checkinId:', checkinId);
    
    const unsubscribe = onSnapshot(
      doc(db, 'checkins', checkinId),
      (doc) => {
        console.log('📄 Documento recebido:', {
          exists: doc.exists(),
          id: doc.id,
          data: doc.exists() ? doc.data() : null
        });
        
        if (doc.exists()) {
          const data = doc.data();
          console.log('✅ Dados do check-in:', {
            hasStages: !!data.stages,
            currentStage: data.currentStage,
            stages: data.stages,
            workflowType: data.workflowType,
            stageOrder: data.stageOrder
          });
          
          // Determinar ordem das etapas
          const order = data.stageOrder || getStageOrder(data.workflowType || 'checkin-first');
          setStageOrder(order);
          
          setTimeline(data);
          setCurrentStage(data.currentStage || 'checkin');
          setProgress(calculateProgress(data.currentStage || 'checkin'));
          setError(null);
        } else {
          console.log('❌ Documento não existe no Firebase');
          setError('Check-in não encontrado');
        }
        setLoading(false);
      },
      (error) => {
        console.error('❌ Erro ao escutar timeline:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [checkinId]);

  const updateStage = async (stageId, data = {}) => {
    try {
      await updateStageService(checkinId, stageId, data);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const addStageNote = async (stageId, note) => {
    try {
      await addStageNoteService(checkinId, stageId, note);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return {
    timeline,
    currentStage,
    progress,
    loading,
    error,
    stageOrder,
    updateStage,
    addStageNote
  };
};
