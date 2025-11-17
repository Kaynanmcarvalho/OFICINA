/**
 * Mechanic Guide Service
 * Serviço para gerenciar base de conhecimento técnico
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc,
  updateDoc,
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  increment
} from 'firebase/firestore';

export class MechanicGuideService {
  constructor() {
    this.collectionName = 'mechanic_guides';
  }

  /**
   * Cria um novo guia
   */
  async createGuide(guideData, empresaId, userId) {
    try {
      const guideId = `guide_${Date.now()}`;
      const guideRef = doc(db, this.collectionName, guideId);

      const guide = {
        id: guideId,
        empresaId,
        category: guideData.category || 'geral',
        subcategory: guideData.subcategory || '',
        title: guideData.title,
        description: guideData.description || '',
        difficulty: guideData.difficulty || 'medio', // facil, medio, dificil
        duration: guideData.duration || 60, // minutos
        
        tools: guideData.tools || [],
        steps: guideData.steps || [],
        parts: guideData.parts || [],
        references: guideData.references || [],
        
        tags: guideData.tags || [],
        images: guideData.images || [],
        videos: guideData.videos || [],
        
        warnings: guideData.warnings || [],
        tips: guideData.tips || [],
        
        version: 1,
        views: 0,
        likes: 0,
        
        isPublic: guideData.isPublic || false,
        isVerified: false,
        
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: userId
      };

      await setDoc(guideRef, guide);
      return guide;
    } catch (error) {
      console.error('Error creating guide:', error);
      throw error;
    }
  }

  /**
   * Busca um guia por ID
   */
  async getGuide(guideId) {
    try {
      const guideRef = doc(db, this.collectionName, guideId);
      const guideSnap = await getDoc(guideRef);

      if (!guideSnap.exists()) {
        return null;
      }

      // Incrementar visualizações
      await updateDoc(guideRef, {
        views: increment(1)
      });

      return { id: guideSnap.id, ...guideSnap.data() };
    } catch (error) {
      console.error('Error getting guide:', error);
      throw error;
    }
  }

  /**
   * Atualiza um guia
   */
  async updateGuide(guideId, updates, userId) {
    try {
      const guideRef = doc(db, this.collectionName, guideId);
      
      const updateData = {
        ...updates,
        version: increment(1),
        updatedAt: Timestamp.now(),
        updatedBy: userId
      };

      await updateDoc(guideRef, updateData);
      return await this.getGuide(guideId);
    } catch (error) {
      console.error('Error updating guide:', error);
      throw error;
    }
  }

  /**
   * Deleta um guia
   */
  async deleteGuide(guideId) {
    try {
      const guideRef = doc(db, this.collectionName, guideId);
      await deleteDoc(guideRef);
      return true;
    } catch (error) {
      console.error('Error deleting guide:', error);
      throw error;
    }
  }

  /**
   * Busca guias com filtros
   */
  async searchGuides(searchQuery, filters = {}) {
    try {
      const guidesRef = collection(db, this.collectionName);
      let q = query(guidesRef);

      // Filtro por empresa
      if (filters.empresaId) {
        q = query(q, where('empresaId', '==', filters.empresaId));
      }

      // Filtro por categoria
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }

      // Filtro por dificuldade
      if (filters.difficulty) {
        q = query(q, where('difficulty', '==', filters.difficulty));
      }

      // Filtro por tags
      if (filters.tags && filters.tags.length > 0) {
        q = query(q, where('tags', 'array-contains-any', filters.tags));
      }

      // Ordenação
      const orderField = filters.orderBy || 'createdAt';
      const orderDirection = filters.orderDirection || 'desc';
      q = query(q, orderBy(orderField, orderDirection));

      // Limite
      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const snapshot = await getDocs(q);
      let guides = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filtro de busca por texto (client-side)
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        guides = guides.filter(guide => 
          guide.title.toLowerCase().includes(searchLower) ||
          guide.description?.toLowerCase().includes(searchLower) ||
          guide.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      return guides;
    } catch (error) {
      console.error('Error searching guides:', error);
      return [];
    }
  }

  /**
   * Busca guias por categoria
   */
  async getGuidesByCategory(category, empresaId, limitCount = 20) {
    try {
      const guidesRef = collection(db, this.collectionName);
      const q = query(
        guidesRef,
        where('empresaId', '==', empresaId),
        where('category', '==', category),
        orderBy('views', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting guides by category:', error);
      return [];
    }
  }

  /**
   * Busca guias por dificuldade
   */
  async getGuidesByDifficulty(difficulty, empresaId, limitCount = 20) {
    try {
      const guidesRef = collection(db, this.collectionName);
      const q = query(
        guidesRef,
        where('empresaId', '==', empresaId),
        where('difficulty', '==', difficulty),
        orderBy('views', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting guides by difficulty:', error);
      return [];
    }
  }

  /**
   * Busca guias relacionados
   */
  async getRelatedGuides(guideId, limitCount = 5) {
    try {
      const guide = await this.getGuide(guideId);
      if (!guide) return [];

      // Buscar guias com tags similares
      const guidesRef = collection(db, this.collectionName);
      const q = query(
        guidesRef,
        where('category', '==', guide.category),
        where('empresaId', '==', guide.empresaId),
        orderBy('views', 'desc'),
        limit(limitCount + 1)
      );

      const snapshot = await getDocs(q);
      const guides = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(g => g.id !== guideId);

      return guides.slice(0, limitCount);
    } catch (error) {
      console.error('Error getting related guides:', error);
      return [];
    }
  }

  /**
   * Busca guias populares
   */
  async getPopularGuides(empresaId, limitCount = 10) {
    try {
      const guidesRef = collection(db, this.collectionName);
      const q = query(
        guidesRef,
        where('empresaId', '==', empresaId),
        orderBy('views', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting popular guides:', error);
      return [];
    }
  }

  /**
   * Busca guias recentes
   */
  async getRecentGuides(empresaId, limitCount = 10) {
    try {
      const guidesRef = collection(db, this.collectionName);
      const q = query(
        guidesRef,
        where('empresaId', '==', empresaId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting recent guides:', error);
      return [];
    }
  }

  /**
   * Registra visualização de guia
   */
  async trackGuideView(guideId, userId) {
    try {
      const viewRef = doc(db, 'guide_views', `${guideId}_${userId}_${Date.now()}`);
      await setDoc(viewRef, {
        guideId,
        userId,
        timestamp: Timestamp.now()
      });
    } catch (error) {
      console.error('Error tracking guide view:', error);
    }
  }

  /**
   * Adiciona like a um guia
   */
  async likeGuide(guideId, userId) {
    try {
      const guideRef = doc(db, this.collectionName, guideId);
      const likeRef = doc(db, 'guide_likes', `${guideId}_${userId}`);

      // Verificar se já deu like
      const likeSnap = await getDoc(likeRef);
      if (likeSnap.exists()) {
        // Remover like
        await deleteDoc(likeRef);
        await updateDoc(guideRef, {
          likes: increment(-1)
        });
        return false;
      } else {
        // Adicionar like
        await setDoc(likeRef, {
          guideId,
          userId,
          timestamp: Timestamp.now()
        });
        await updateDoc(guideRef, {
          likes: increment(1)
        });
        return true;
      }
    } catch (error) {
      console.error('Error liking guide:', error);
      throw error;
    }
  }

  /**
   * Busca estatísticas de um guia
   */
  async getGuideStats(guideId) {
    try {
      const guide = await this.getGuide(guideId);
      if (!guide) return null;

      return {
        views: guide.views || 0,
        likes: guide.likes || 0,
        version: guide.version || 1,
        lastUpdate: guide.updatedAt,
        difficulty: guide.difficulty,
        duration: guide.duration,
        stepsCount: guide.steps?.length || 0,
        toolsCount: guide.tools?.length || 0,
        partsCount: guide.parts?.length || 0
      };
    } catch (error) {
      console.error('Error getting guide stats:', error);
      return null;
    }
  }

  /**
   * Valida dados de um guia
   */
  validateGuide(guideData) {
    const errors = [];

    if (!guideData.title || guideData.title.trim() === '') {
      errors.push('Título é obrigatório');
    }

    if (!guideData.category || guideData.category.trim() === '') {
      errors.push('Categoria é obrigatória');
    }

    if (!['facil', 'medio', 'dificil'].includes(guideData.difficulty)) {
      errors.push('Dificuldade inválida');
    }

    if (!guideData.steps || guideData.steps.length === 0) {
      errors.push('Pelo menos um passo é obrigatório');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Importa guia de fonte externa
   */
  async importFromSource(sourceData, empresaId, userId) {
    try {
      const validation = this.validateGuide(sourceData);
      if (!validation.isValid) {
        throw new Error(`Validação falhou: ${validation.errors.join(', ')}`);
      }

      return await this.createGuide(sourceData, empresaId, userId);
    } catch (error) {
      console.error('Error importing guide:', error);
      throw error;
    }
  }

  /**
   * Busca categorias disponíveis
   */
  async getCategories(empresaId) {
    try {
      const guidesRef = collection(db, this.collectionName);
      const q = query(
        guidesRef,
        where('empresaId', '==', empresaId)
      );

      const snapshot = await getDocs(q);
      const categories = new Set();
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.category) {
          categories.add(data.category);
        }
      });

      return Array.from(categories).sort();
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  /**
   * Busca tags disponíveis
   */
  async getTags(empresaId) {
    try {
      const guidesRef = collection(db, this.collectionName);
      const q = query(
        guidesRef,
        where('empresaId', '==', empresaId)
      );

      const snapshot = await getDocs(q);
      const tags = new Set();
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.tags && Array.isArray(data.tags)) {
          data.tags.forEach(tag => tags.add(tag));
        }
      });

      return Array.from(tags).sort();
    } catch (error) {
      console.error('Error getting tags:', error);
      return [];
    }
  }
}

export default new MechanicGuideService();
