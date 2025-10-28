// Serviço para gerenciar atividades do usuário
import { collection, addDoc, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

class ActivityService {
  constructor() {
    this.collectionName = 'userActivities';
  }

  // Adicionar nova atividade
  async addActivity(action, details = {}) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.warn('Usuário não autenticado para registrar atividade');
        return null;
      }

      const newActivity = {
        acao: action,
        data: new Date().toLocaleString('pt-BR', {
          timeZone: 'America/Sao_Paulo',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        ip: this.getClientIP(),
        dispositivo: this.getDeviceInfo(),
        usuario: details.usuario || currentUser.displayName || 'Usuário',
        email: details.email || currentUser.email || '',
        userId: currentUser.uid,
        timestamp: new Date().toISOString(),
        createdAt: new Date()
      };

      // Salvar no Firestore
      const docRef = await addDoc(collection(db, this.collectionName), newActivity);
      return { id: docRef.id, ...newActivity };
    } catch (error) {
      console.error('Erro ao adicionar atividade:', error);
      return null;
    }
  }

  // Obter todas as atividades
  async getActivities() {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return [];
      }

      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const activities = [];
      querySnapshot.forEach((doc) => {
        activities.push({ id: doc.id, ...doc.data() });
      });
      
      return activities;
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      return [];
    }
  }

  // Obter atividades recentes (últimas 10)
  async getRecentActivities(limitCount = 10) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return [];
      }

      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const activities = [];
      querySnapshot.forEach((doc) => {
        activities.push({ id: doc.id, ...doc.data() });
      });
      
      return activities;
    } catch (error) {
      console.error('Erro ao carregar atividades recentes:', error);
      return [];
    }
  }

  // Obter atividades de todos os usuários (para auditoria)
  async getAllUsersActivities(filters = {}) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return [];
      }

      let queryConstraints = [orderBy('createdAt', 'desc')];

      // Filtro por usuário específico
      if (filters.userId) {
        queryConstraints.push(where('userId', '==', filters.userId));
      }

      // Filtro por período
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        startDate.setHours(0, 0, 0, 0);
        queryConstraints.push(where('createdAt', '>=', Timestamp.fromDate(startDate)));
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        queryConstraints.push(where('createdAt', '<=', Timestamp.fromDate(endDate)));
      }

      // Limitar resultados para performance
      if (filters.limit) {
        queryConstraints.push(limit(filters.limit));
      } else {
        queryConstraints.push(limit(100)); // Limite padrão
      }

      const q = query(collection(db, this.collectionName), ...queryConstraints);
      
      const querySnapshot = await getDocs(q);
      const activities = [];
      querySnapshot.forEach((doc) => {
        activities.push({ id: doc.id, ...doc.data() });
      });
      
      return activities;
    } catch (error) {
      console.error('Erro ao carregar atividades de todos os usuários:', error);
      return [];
    }
  }

  // Obter atividades filtradas por período
  async getActivitiesByPeriod(filter = 'hoje', specificDate = null) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return [];
      }

      let queryConstraints = [
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      ];

      // Adicionar filtro de data baseado no período
      if (filter === 'hoje') {
        // Apenas hoje (do início do dia até agora)
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        queryConstraints.push(where('createdAt', '>=', Timestamp.fromDate(startOfDay)));
      } else if (filter === 'semana') {
        // Últimos 7 dias
        const now = new Date();
        const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        queryConstraints.push(where('createdAt', '>=', Timestamp.fromDate(startDate)));
      } else if (filter === 'periodo' && specificDate) {
        // Data específica selecionada
        const selectedDate = new Date(specificDate);
        const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);
        
        queryConstraints.push(
          where('createdAt', '>=', Timestamp.fromDate(startOfDay)),
          where('createdAt', '<', Timestamp.fromDate(endOfDay))
        );
      }

      const q = query(collection(db, this.collectionName), ...queryConstraints);
      
      const querySnapshot = await getDocs(q);
      const activities = [];
      querySnapshot.forEach((doc) => {
        activities.push({ id: doc.id, ...doc.data() });
      });
      
      return activities;
    } catch (error) {
      console.error('Erro ao carregar atividades por período:', error);
      return [];
    }
  }

  // Limpar todas as atividades (não implementado por segurança)
  clearActivities() {
    console.warn('Limpeza de atividades não permitida - dados mantidos no Firestore');
  }

  // Obter informações do dispositivo
  getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let browser = 'Desconhecido';
    let os = 'Desconhecido';

    // Detectar navegador
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    // Detectar sistema operacional
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    return `${browser} - ${os}`;
  }

  // Simular obtenção de IP (em produção seria obtido do servidor)
  getClientIP() {
    // Em um ambiente real, isso seria obtido do servidor
    return '192.168.1.' + Math.floor(Math.random() * 255);
  }

  // Métodos getCurrentUser e getCurrentUserEmail removidos
  // Agora usando auth.currentUser diretamente

  // Métodos específicos para diferentes tipos de atividade
  logLogin(userEmail) {
    return this.addActivity('Login realizado', { email: userEmail });
  }

  logLogout(userEmail) {
    return this.addActivity('Logout realizado', { email: userEmail });
  }

  logProfileUpdate() {
    return this.addActivity('Perfil atualizado');
  }

  logPasswordChange() {
    return this.addActivity('Senha alterada');
  }

  logDashboardAccess() {
    return this.addActivity('Dashboard acessado');
  }

  logCaixaAccess() {
    return this.addActivity('Caixa acessado');
  }

  logEstoqueAccess() {
    return this.addActivity('Estoque acessado');
  }

  logSaleCompleted(saleValue) {
    return this.addActivity(`Venda realizada - R$ ${saleValue}`);
  }

  logProductAdded(productName) {
    return this.addActivity(`Produto adicionado: ${productName}`);
  }

  logProductUpdated(productName) {
    return this.addActivity(`Produto atualizado: ${productName}`);
  }
}

// Exportar instância única
export const activityService = new ActivityService();
export default activityService;