// Serviço para gerenciamento de tickets/chamados
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import ticketImageService from './ticketImageService';

// Status disponíveis para tickets
export const TICKET_STATUS = {
  CRIADO: 'criado',
  ABERTO: 'aberto', 
  RESOLVIDO: 'resolvido',
  FECHADO: 'fechado',
  CANCELADO: 'cancelado',
  INVIAVEL: 'inviavel'
};

// Tipos de tickets
export const TICKET_TYPES = {
  BUG: 'bug',
  DUVIDA: 'duvida',
  MELHORIA: 'melhoria',
  FALHA: 'falha'
};

// Prioridades
export const TICKET_PRIORITY = {
  BAIXA: 'baixa',
  MEDIA: 'media', 
  ALTA: 'alta',
  CRITICA: 'critica'
};

class TicketService {
  constructor() {
    this.collectionName = 'tickets';
  }

  // Criar novo ticket
  async createTicket(ticketData, images = null) {
    try {
      let imageUrls = [];
      
      // Se há imagens, fazer upload primeiro
      if (images && images.length > 0) {
        // Gerar ID temporário para o ticket
        const tempTicketId = `temp_${Date.now()}`;
        imageUrls = await ticketImageService.uploadMultipleImages(images, tempTicketId, 3);
      }

      const ticket = {
        ...ticketData,
        status: TICKET_STATUS.ABERTO,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        responses: [],
        images: imageUrls // Adicionar URLs das imagens
      };

      const docRef = await addDoc(collection(db, this.collectionName), ticket);
      
      // Se há imagens, renomear no storage com o ID real do ticket
      if (imageUrls.length > 0) {
        // Atualizar as URLs com o ID real do ticket
        const updatedImageUrls = await this.updateImagePaths(imageUrls, docRef.id);
        await updateDoc(docRef, { images: updatedImageUrls });
        ticket.images = updatedImageUrls;
      }

      return { id: docRef.id, ...ticket };
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
      throw new Error('Falha ao criar ticket');
    }
  }

  // Atualizar paths das imagens com ID real do ticket
  async updateImagePaths(imageUrls, realTicketId) {
    try {
      // Por simplicidade, vamos manter as URLs originais
      // Em produção, você poderia implementar uma lógica para reorganizar os arquivos
      return imageUrls;
    } catch (error) {
      console.error('Erro ao atualizar paths das imagens:', error);
      return imageUrls;
    }
  }

  // Buscar todos os tickets
  async getAllTickets() {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('createdAt', 'desc')

      const querySnapshot = await getDocs(q);
      const tickets = [];
      
      querySnapshot.forEach((doc) => {
        tickets.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return tickets;
    } catch (error) {
      console.error('Erro ao buscar tickets:', error);
      throw new Error('Falha ao carregar tickets');
    }
  }

  // Buscar tickets por usuário
  async getTicketsByUser(userId) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('createdBy', '==', userId),
        orderBy('createdAt', 'desc')

      const querySnapshot = await getDocs(q);
      const tickets = [];
      
      querySnapshot.forEach((doc) => {
        tickets.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return tickets;
    } catch (error) {
      console.error('Erro ao buscar tickets do usuário:', error);
      throw new Error('Falha ao carregar tickets do usuário');
    }
  }

  // Buscar tickets por status
  async getTicketsByStatus(status) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', status),
        orderBy('createdAt', 'desc')

      const querySnapshot = await getDocs(q);
      const tickets = [];
      
      querySnapshot.forEach((doc) => {
        tickets.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return tickets;
    } catch (error) {
      console.error('Erro ao buscar tickets por status:', error);
      throw new Error('Falha ao carregar tickets por status');
    }
  }

  // Atualizar status do ticket
  async updateTicketStatus(ticketId, newStatus, updatedBy) {
    try {
      const ticketRef = doc(db, this.collectionName, ticketId);
      
      await updateDoc(ticketRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
        updatedBy: updatedBy
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar status do ticket:', error);
      throw new Error('Falha ao atualizar status do ticket');
    }
  }

  // Adicionar resposta ao ticket
  async addResponse(ticketId, response, respondedBy, images = null) {
    try {
      const ticketRef = doc(db, this.collectionName, ticketId);
      const ticketDoc = await getDoc(ticketRef);
      
      if (!ticketDoc.exists()) {
        throw new Error('Ticket não encontrado');
      }
      
      let imageUrls = [];
      
      // Se há imagens, fazer upload (máximo 5 para respostas)
      if (images && images.length > 0) {
        imageUrls = await ticketImageService.uploadMultipleImages(images, ticketId, 5);
      }
      
      const currentTicket = ticketDoc.data();
      const newResponse = {
        id: Date.now().toString(),
        message: response,
        respondedBy: respondedBy,
        createdAt: new Date(), // Usar Date() em vez de serverTimestamp() dentro do array
        images: imageUrls // Adicionar URLs das imagens da resposta
      };
      
      const updatedResponses = [...(currentTicket.responses || []), newResponse];
      
      await updateDoc(ticketRef, {
        responses: updatedResponses,
        updatedAt: serverTimestamp(),
        lastResponseBy: respondedBy
      });
      
      return newResponse;
    } catch (error) {
      console.error('Erro ao adicionar resposta:', error);
      throw new Error('Falha ao adicionar resposta');
    }
  }

  // Buscar ticket por ID
  async getTicketById(ticketId) {
    try {
      const ticketRef = doc(db, this.collectionName, ticketId);
      const ticketDoc = await getDoc(ticketRef);
      
      if (!ticketDoc.exists()) {
        throw new Error('Ticket não encontrado');
      }
      
      return {
        id: ticketDoc.id,
        ...ticketDoc.data()
      };
    } catch (error) {
      console.error('Erro ao buscar ticket:', error);
      throw new Error('Falha ao carregar ticket');
    }
  }

  // Obter estatísticas dos tickets
  async getTicketStats() {
    try {
      const tickets = await this.getAllTickets();
      
      const stats = {
        total: tickets.length,
        abertos: tickets.filter(t => t.status === TICKET_STATUS.ABERTO).length,
        resolvidos: tickets.filter(t => t.status === TICKET_STATUS.RESOLVIDO).length,
        fechados: tickets.filter(t => t.status === TICKET_STATUS.FECHADO).length,
        cancelados: tickets.filter(t => t.status === TICKET_STATUS.CANCELADO).length,
        inviavel: tickets.filter(t => t.status === TICKET_STATUS.INVIAVEL).length,
        byType: {
          bug: tickets.filter(t => t.type === TICKET_TYPES.BUG).length,
          duvida: tickets.filter(t => t.type === TICKET_TYPES.DUVIDA).length,
          melhoria: tickets.filter(t => t.type === TICKET_TYPES.MELHORIA).length,
          falha: tickets.filter(t => t.type === TICKET_TYPES.FALHA).length
        }
      };
      
      return stats;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw new Error('Falha ao carregar estatísticas');
    }
  }

  // Atualizar uma resposta específica
  async updateResponse(ticketId, responseId, newMessage) {
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      const ticketDoc = await getDoc(ticketRef);
      
      if (!ticketDoc.exists()) {
        throw new Error('Ticket não encontrado');
      }
      
      const ticketData = ticketDoc.data();
      const responses = ticketData.responses || [];
      
      // Encontrar e atualizar a resposta específica
      const updatedResponses = responses.map(response => {
        if (response.id === responseId) {
          return {
            ...response,
            message: newMessage,
            editedAt: new Date(),
            edited: true
          };
        }
        return response;
      });
      
      // Atualizar o documento no Firestore
      await updateDoc(ticketRef, {
        responses: updatedResponses,
        updatedAt: new Date()
      });
      
      } catch (error) {
      console.error('Erro ao atualizar resposta:', error);
      throw new Error('Falha ao atualizar resposta');
    }
  }

  // Deletar ticket
  async deleteTicket(ticketId) {
    try {
      const ticketRef = doc(db, this.collectionName, ticketId);
      await deleteDoc(ticketRef);
      
      return true;
    } catch (error) {
      console.error('Erro ao deletar ticket:', error);
      throw new Error('Falha ao deletar ticket');
    }
  }
}

export default new TicketService();