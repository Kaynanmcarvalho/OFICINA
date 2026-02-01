// Serviço de armazenamento local (substitui Firebase temporariamente)

const STORAGE_KEYS = {
  CLIENTS: 'oficina_clients',
  CHECKINS: 'oficina_checkins',
};

// Dados iniciais
const INITIAL_DATA = {
  clients: [
    {
      id: '1',
      name: 'João Silva',
      phone: '(11) 98765-4321',
      cpf: '123.456.789-00',
      email: 'joao@email.com',
      address: 'Rua das Flores, 123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Maria Santos',
      phone: '(11) 97654-3210',
      cpf: '987.654.321-00',
      email: 'maria@email.com',
      address: 'Av. Principal, 456',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  checkins: [
    {
      id: '1',
      clientId: '1',
      motorcycle: 'Honda CB 600F',
      plate: 'ABC-1234',
      observations: 'Revisão completa',
      responsible: 'Carlos Mecânico',
      photos: [],
      checkInDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      checkOutDate: null,
      status: 'active',
      servicesPerformed: null,
      totalCost: 0,
      paymentMethod: null,
      checkoutObservations: null,
      checkoutPhotos: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      clientId: '2',
      motorcycle: 'Yamaha MT-07',
      plate: 'XYZ-5678',
      observations: 'Troca de óleo',
      responsible: 'João Técnico',
      photos: [],
      checkInDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      checkOutDate: null,
      status: 'active',
      servicesPerformed: null,
      totalCost: 0,
      paymentMethod: null,
      checkoutObservations: null,
      checkoutPhotos: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

// Inicializar dados se não existirem
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.CLIENTS)) {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_DATA.clients));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CHECKINS)) {
    localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(INITIAL_DATA.checkins));
  }
};

// Obter dados
const getData = (key) => {
  initializeData();
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Salvar dados
const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Gerar ID único
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Simular delay de rede
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Exportar funções
export const localDB = {
  // Clientes
  async getClients() {
    await delay();
    return getData(STORAGE_KEYS.CLIENTS);
  },

  async getClientById(id) {
    await delay();
    const clients = getData(STORAGE_KEYS.CLIENTS);
    return clients.find((c) => c.id === id);
  },

  async createClient(clientData) {
    await delay();
    const clients = getData(STORAGE_KEYS.CLIENTS);
    const newClient = {
      ...clientData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    clients.push(newClient);
    saveData(STORAGE_KEYS.CLIENTS, clients);
    return newClient;
  },

  async searchClients(searchTerm) {
    await delay();
    const clients = getData(STORAGE_KEYS.CLIENTS);
    const term = searchTerm.toLowerCase();
    return clients.filter(
      (client) =>
        client.name?.toLowerCase().includes(term) ||
        client.phone?.includes(term) ||
        client.cpf?.includes(term) ||
        client.email?.toLowerCase().includes(term)

  },

  // Check-ins
  async getCheckins(filters = {}) {
    await delay();
    let checkins = getData(STORAGE_KEYS.CHECKINS);
    const clients = getData(STORAGE_KEYS.CLIENTS);

    // Adicionar dados do cliente
    checkins = checkins.map((checkin) => {
      const client = clients.find((c) => c.id === checkin.clientId);
      return {
        ...checkin,
        clientName: client?.name,
        clientPhone: client?.phone,
        clientCpf: client?.cpf,
      };
    });

    // Filtrar por status
    if (filters.status) {
      checkins = checkins.filter((c) => c.status === filters.status);
    }

    // Ordenar por data
    checkins.sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate));

    // Limitar resultados
    if (filters.limit) {
      checkins = checkins.slice(0, filters.limit);
    }

    return checkins;
  },

  async getCheckinById(id) {
    await delay();
    const checkins = getData(STORAGE_KEYS.CHECKINS);
    const clients = getData(STORAGE_KEYS.CLIENTS);
    const checkin = checkins.find((c) => c.id === id);

    if (checkin) {
      const client = clients.find((c) => c.id === checkin.clientId);
      return {
        ...checkin,
        clientName: client?.name,
        clientPhone: client?.phone,
        clientCpf: client?.cpf,
      };
    }

    return null;
  },

  async createCheckin(checkinData) {
    await delay();
    const checkins = getData(STORAGE_KEYS.CHECKINS);
    const clients = getData(STORAGE_KEYS.CLIENTS);

    const newCheckin = {
      ...checkinData,
      id: generateId(),
      checkInDate: new Date().toISOString(),
      checkOutDate: null,
      status: 'active',
      photos: [],
      servicesPerformed: null,
      totalCost: 0,
      paymentMethod: null,
      checkoutObservations: null,
      checkoutPhotos: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    checkins.push(newCheckin);
    saveData(STORAGE_KEYS.CHECKINS, checkins);

    // Adicionar dados do cliente
    const client = clients.find((c) => c.id === newCheckin.clientId);
    return {
      ...newCheckin,
      clientName: client?.name,
      clientPhone: client?.phone,
      clientCpf: client?.cpf,
    };
  },

  async checkoutCheckin(id, checkoutData) {
    await delay();
    const checkins = getData(STORAGE_KEYS.CHECKINS);
    const clients = getData(STORAGE_KEYS.CLIENTS);
    const index = checkins.findIndex((c) => c.id === id);

    if (index !== -1) {
      checkins[index] = {
        ...checkins[index],
        ...checkoutData,
        checkOutDate: new Date().toISOString(),
        status: 'completed',
        updatedAt: new Date().toISOString(),
      };
      saveData(STORAGE_KEYS.CHECKINS, checkins);

      const client = clients.find((c) => c.id === checkins[index].clientId);
      return {
        ...checkins[index],
        clientName: client?.name,
        clientPhone: client?.phone,
        clientCpf: client?.cpf,
      };
    }

    return null;
  },

  async getCheckinStats() {
    await delay();
    const checkins = getData(STORAGE_KEYS.CHECKINS);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const stats = {
      active: checkins.filter((c) => c.status === 'active').length,
      pending: checkins.filter((c) => c.status === 'pending').length,
      today: checkins.filter((c) => {
        const checkInDate = new Date(c.checkInDate);
        return checkInDate >= today;
      }).length,
      avgTime: '0h',
    };

    // Calcular tempo médio
    const completedCheckins = checkins.filter((c) => c.checkOutDate);
    if (completedCheckins.length > 0) {
      const totalHours = completedCheckins.reduce((sum, c) => {
        const diff = new Date(c.checkOutDate) - new Date(c.checkInDate);
        return sum + diff / (1000 * 60 * 60);
      }, 0);

      const avgHours = Math.round(totalHours / completedCheckins.length);
      stats.avgTime = `${avgHours}h`;
    }

    return stats;
  },

  async checkDuplicatePlate(plate) {
    await delay();
    const checkins = getData(STORAGE_KEYS.CHECKINS);
    return checkins.some((c) => c.plate === plate.toUpperCase() && c.status === 'active');
  },

  async getClientHistory(clientId) {
    await delay();
    const checkins = getData(STORAGE_KEYS.CHECKINS);
    return checkins
      .filter((c) => c.clientId === clientId)
      .sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate))
      .slice(0, 10);
  },
};
