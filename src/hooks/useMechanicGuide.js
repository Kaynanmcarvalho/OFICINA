/**
 * useMechanicGuide Hook
 * Hook para gerenciar guias técnicos
 */

import { useState, useEffect, useCallback } from 'react';
import mechanicGuideService from '../services/mechanicGuideService';

export const useMechanicGuide = (guideId = null, empresaId = null) => {
  const [guide, setGuide] = useState(null);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (guideId) {
      loadGuide(guideId);
    }
  }, [guideId]);

  const loadGuide = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await mechanicGuideService.getGuide(id);
      setGuide(data);
      return data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const searchGuides = useCallback(async (query, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const results = await mechanicGuideService.searchGuides(query, {
        empresaId,
        ...filters
      });
      setGuides(results);
      return results;
    } catch (err) {
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  const getPopular = useCallback(async (limitCount = 10) => {
    try {
      const results = await mechanicGuideService.getPopularGuides(empresaId, limitCount);
      setGuides(results);
      return results;
    } catch (err) {
      setError(err);
      return [];
    }
  }, [empresaId]);

  const getRelated = useCallback(async (id, limitCount = 5) => {
    try {
      return await mechanicGuideService.getRelatedGuides(id, limitCount);
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const likeGuide = useCallback(async (id, userId) => {
    try {
      return await mechanicGuideService.likeGuide(id, userId);
    } catch (err) {
      setError(err);
      return false;
    }
  }, []);

  return {
    guide,
    guides,
    loading,
    error,
    loadGuide,
    searchGuides,
    getPopular,
    getRelated,
    likeGuide
  };
};

export default useMechanicGuide;
