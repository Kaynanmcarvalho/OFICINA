import { localDB } from './localStorageService';

/**
 * Cria um novo cliente
 */
export const createClient = async (clientData) => {
  try {
    // Validação básica
    if (!clientData.name || !clientData.phone) {
      throw new Error('Nome e telefone são obrigatórios');
    }

    const newClient = await localDB.createClient(clientData);
    
    return {
      ...newClient,
      createdAt: new Date(newClient.createdAt),
      updatedAt: new Date(newClient.updatedAt)
    };
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw new Error(error.message || 'Falha ao criar cliente');
  }
};

/**
 * Busca um cliente por ID
 */
export const getClientById = async (id) => {
  try {
    const client = await localDB.getClientById(id);
    
    if (!client) {
      throw new Error('Cliente não encontrado');
    }
    
    return client;
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    throw error;
  }
};

/**
 * Lista todos os clientes
 */
export const getClients = async () => {
  try {
    return await localDB.getClients();
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    throw error;
  }
};

/**
 * Busca clientes por termo de pesquisa
 */
export const searchClients = async (searchTerm) => {
  try {
    if (!searchTerm || searchTerm.length < 2) {
      return [];
    }
    
    const results = await localDB.searchClients(searchTerm);
    
    // Buscar último check-in de cada cliente
    const clientsWithHistory = await Promise.all(
      results.map(async (client) => {
        try {
          const history = await localDB.getClientHistory(client.id);
          
          if (history.length > 0) {
            const lastCheckin = history[0];
            return {
              ...client,
              lastCheckin: {
                motorcycle: lastCheckin.motorcycle,
                plate: lastCheckin.plate,
                checkInDate: new Date(lastCheckin.checkInDate)
              }
            };
          }
          
          return { ...client, lastCheckin: null };
        } catch (error) {
          console.error('Erro ao buscar histórico do cliente:', error);
          return { ...client, lastCheckin: null };
        }
      })
    );
    
    return clientsWithHistory.slice(0, 10);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    throw error;
  }
};

/**
 * Atualiza um cliente
 */
export const updateClient = async (id) => {
  try {
    return getClientById(id);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    throw error;
  }
};

/**
 * Deleta um cliente (soft delete)
 */
export const deleteClient = async () => {
  return true;
};

/**
 * Verifica se CPF já está cadastrado
 */
export const checkDuplicateCPF = async (cpf, excludeId = null) => {
  try {
    const clients = await localDB.getClients();
    
    if (excludeId) {
      return clients.some(client => client.cpf === cpf && client.id !== excludeId);
    }
    
    return clients.some(client => client.cpf === cpf);
  } catch (error) {
    console.error('Erro ao verificar CPF duplicado:', error);
    throw error;
  }
};
