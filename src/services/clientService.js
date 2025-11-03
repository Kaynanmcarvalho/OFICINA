import { useClientStore } from '../store/clientStore';

/**
 * Cria um novo cliente
 * Delega para o clientStore (Firebase)
 */
export const createClient = async (clientData) => {
  try {
    // Validação básica
    if (!clientData.name || !clientData.phone) {
      throw new Error('Nome e telefone são obrigatórios');
    }

    const store = useClientStore.getState();
    const result = await store.createClient(clientData);

    if (!result.success) {
      throw new Error(result.error || 'Falha ao criar cliente');
    }

    return result.data;
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw new Error(error.message || 'Falha ao criar cliente');
  }
};

/**
 * Busca um cliente por ID (Firestore ID)
 * Delega para o clientStore (Firebase)
 */
export const getClientById = async (id) => {
  try {
    const store = useClientStore.getState();
    const result = await store.getClientById(id);

    if (!result.success) {
      throw new Error(result.error || 'Cliente não encontrado');
    }

    return result.data;
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    throw error;
  }
};

/**
 * Lista todos os clientes
 * Delega para o clientStore (Firebase)
 */
export const getClients = async () => {
  try {
    const store = useClientStore.getState();

    // Se já temos clientes em cache, retornar
    if (store.clients.length > 0) {
      return store.clients;
    }

    // Caso contrário, buscar do Firebase
    const result = await store.fetchClients();

    if (!result.success) {
      throw new Error(result.error || 'Erro ao buscar clientes');
    }

    return result.data;
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    throw error;
  }
};

/**
 * Busca clientes por termo de pesquisa
 * Delega para o clientStore (Firebase)
 * Mantém formato de retorno compatível com código existente
 */
export const searchClients = async (searchTerm) => {
  try {
    if (!searchTerm || searchTerm.length < 2) {
      return [];
    }

    const store = useClientStore.getState();
    const result = await store.searchClients(searchTerm);

    if (!result.success) {
      console.error('Erro ao buscar clientes:', result.error);
      return [];
    }

    // Retornar dados no formato esperado (array simples)
    // O histórico de check-ins será buscado separadamente se necessário
    return result.data.map(client => ({
      id: client.firestoreId,
      firestoreId: client.firestoreId,
      clientId: client.clientId,
      name: client.name,
      phone: client.phone,
      cpf: client.cpf,
      cnpj: client.cnpj,
      email: client.email,
      address: client.address,
      vehicles: client.vehicles || [],
      totalServices: client.totalServices || 0,
      lastServiceDate: client.lastServiceDate,
      lastCheckin: client.lastCheckin || null,
    }));
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return [];
  }
};

/**
 * Atualiza um cliente
 * Delega para o clientStore (Firebase)
 */
export const updateClient = async (id, updates) => {
  try {
    const store = useClientStore.getState();
    const result = await store.updateClient(id, updates);

    if (!result.success) {
      throw new Error(result.error || 'Erro ao atualizar cliente');
    }

    return await getClientById(id);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    throw error;
  }
};

/**
 * Deleta um cliente
 * Delega para o clientStore (Firebase)
 */
export const deleteClient = async (id) => {
  try {
    const store = useClientStore.getState();
    const result = await store.deleteClient(id);

    if (!result.success) {
      throw new Error(result.error || 'Erro ao deletar cliente');
    }

    return true;
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    throw error;
  }
};

/**
 * Verifica se CPF já está cadastrado
 * Usa dados do clientStore (Firebase)
 */
export const checkDuplicateCPF = async (cpf, excludeId = null) => {
  try {
    const store = useClientStore.getState();
    const clients = store.clients;

    if (excludeId) {
      return clients.some(client =>
        client.cpf === cpf &&
        client.firestoreId !== excludeId &&
        client.id !== excludeId
      );
    }

    return clients.some(client => client.cpf === cpf);
  } catch (error) {
    console.error('Erro ao verificar CPF duplicado:', error);
    throw error;
  }
};
