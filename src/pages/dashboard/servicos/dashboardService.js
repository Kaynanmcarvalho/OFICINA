import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../config/firebase';

/**
 * Serviço de Dashboard
 * Integração 100% real com Firebase
 */

/**
 * Busca estatísticas gerais do sistema
 */
export const buscarEstatisticasGerais = async () => {
  try {
    const [clientes, veiculos, ferramentas, estoque] = await Promise.all([
      getDocs(collection(db, 'clients')),
      getDocs(collection(db, 'vehicles')),
      getDocs(collection(db, 'tools')),
      getDocs(collection(db, 'inventory'))
    ]);

    return {
      totalClientes: clientes.size,
      totalVeiculos: veiculos.size,
      totalFerramentas: ferramentas.size,
      totalEstoque: estoque.size,
      totalProdutos: estoque.size,
      clientes: clientes.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      veiculos: veiculos.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      ferramentas: ferramentas.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      estoque: estoque.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    };
  } catch (error) {
    console.error('[Dashboard] Erro ao buscar estatísticas:', error);
    throw error;
  }
};

/**
 * Busca alertas do sistema
 */
export const buscarAlertas = async () => {
  try {
    const alertas = [];

    // Verificar estoque baixo
    const estoqueSnapshot = await getDocs(collection(db, 'inventory'));
    estoqueSnapshot.forEach(doc => {
      const item = doc.data();
      if (item.quantity <= (item.minQuantity || 5)) {
        alertas.push({
          id: `estoque-${doc.id}`,
          tipo: 'aviso',
          titulo: 'Estoque Baixo',
          mensagem: `${item.name} está com apenas ${item.quantity} unidades`,
          data: new Date()
        });
      }
    });

    // Verificar ferramentas em manutenção
    const ferramentasSnapshot = await getDocs(collection(db, 'tools'));
    ferramentasSnapshot.forEach(doc => {
      const ferramenta = doc.data();
      if (ferramenta.status === 'maintenance' || ferramenta.status === 'manutencao') {
        alertas.push({
          id: `ferramenta-${doc.id}`,
          tipo: 'info',
          titulo: 'Ferramenta em Manutenção',
          mensagem: `${ferramenta.name} está em manutenção`,
          data: new Date()
        });
      }
    });

    return alertas;
  } catch (error) {
    console.error('[Dashboard] Erro ao buscar alertas:', error);
    return [];
  }
};

/**
 * Busca clientes inativos
 */
export const buscarClientesInativos = async (diasInatividade = 30) => {
  try {
    const clientesSnapshot = await getDocs(collection(db, 'clients'));
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - diasInatividade);

    const clientesInativos = [];

    clientesSnapshot.forEach(doc => {
      const cliente = doc.data();
      const ultimaVisita = cliente.lastServiceDate ? new Date(cliente.lastServiceDate) : null;
      
      if (!ultimaVisita || ultimaVisita < dataLimite) {
        const diasInativo = ultimaVisita 
          ? Math.floor((new Date() - ultimaVisita) / (1000 * 60 * 60 * 24))
          : 'Nunca';
        
        clientesInativos.push({
          id: doc.id,
          nome: cliente.name,
          diasInativo,
          ultimaVisita: ultimaVisita ? ultimaVisita.toLocaleDateString('pt-BR') : 'Nunca'
        });
      }
    });

    return clientesInativos;
  } catch (error) {
    console.error('[Dashboard] Erro ao buscar clientes inativos:', error);
    return [];
  }
};

/**
 * Calcula insights de clientes
 */
export const calcularInsightsClientes = async () => {
  try {
    const clientesSnapshot = await getDocs(collection(db, 'clients'));
    const clientes = clientesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const totalClientes = clientes.length;
    const clientesRecorrentes = clientes.filter(c => (c.totalServices || 0) > 1).length;
    const clientesNovos = clientes.filter(c => (c.totalServices || 0) <= 1).length;
    
    // Calcular ticket médio
    const totalGasto = clientes.reduce((sum, c) => {
      const serviceHistory = c.serviceHistory || [];
      const gastoCliente = serviceHistory.reduce((s, service) => s + (service.value || 0), 0);
      return sum + gastoCliente;
    }, 0);
    
    const ticketMedio = totalClientes > 0 ? totalGasto / totalClientes : 0;

    // Clientes mais recorrentes
    const clientesMaisRecorrentes = clientes
      .sort((a, b) => (b.totalServices || 0) - (a.totalServices || 0))
      .slice(0, 5)
      .map(c => ({
        nome: c.name,
        totalServicos: c.totalServices || 0,
        ultimaVisita: c.lastServiceDate ? new Date(c.lastServiceDate).toLocaleDateString('pt-BR') : 'Nunca'
      }));

    // Calcular clientes inativos (mais de 30 dias sem serviço)
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - 30);
    const clientesInativos = clientes.filter(c => {
      const ultimaVisita = c.lastServiceDate ? new Date(c.lastServiceDate) : null;
      return !ultimaVisita || ultimaVisita < dataLimite;
    }).length;

    // Formatar clientes mais recorrentes
    const clientesMaisRecorrentesFormatados = clientes
      .sort((a, b) => (b.totalServices || 0) - (a.totalServices || 0))
      .slice(0, 5)
      .map(c => ({
        name: c.name,
        totalServices: c.totalServices || 0,
        lastVisit: c.lastServiceDate ? new Date(c.lastServiceDate).toLocaleDateString('pt-BR') : 'Nunca'
      }));

    return {
      totalClientes,
      clientesRecorrentes,
      novosClientes: clientesNovos,
      clientesInativos,
      percentualRecorrentes: totalClientes > 0 ? ((clientesRecorrentes / totalClientes) * 100).toFixed(1) : 0,
      percentualNovos: totalClientes > 0 ? ((clientesNovos / totalClientes) * 100).toFixed(1) : 0,
      ticketMedio: parseFloat(ticketMedio.toFixed(2)),
      clientesMaisRecorrentes: clientesMaisRecorrentesFormatados
    };
  } catch (error) {
    console.error('[Dashboard] Erro ao calcular insights:', error);
    return null;
  }
};

/**
 * Busca sugestões de reposição de estoque
 */
export const buscarSugestoesReposicao = async () => {
  try {
    const estoqueSnapshot = await getDocs(collection(db, 'inventory'));
    const sugestoes = [];

    estoqueSnapshot.forEach(doc => {
      const item = doc.data();
      const quantidadeAtual = item.quantity || 0;
      const quantidadeMinima = item.minQuantity || 5;
      const quantidadeIdeal = item.idealQuantity || quantidadeMinima * 3;

      if (quantidadeAtual < quantidadeIdeal) {
        const quantidadeSugerida = quantidadeIdeal - quantidadeAtual;
        sugestoes.push({
          id: doc.id,
          nome: item.name,
          quantidadeAtual,
          quantidadeMinima,
          quantidadeIdeal,
          quantidadeSugerida,
          prioridade: quantidadeAtual <= quantidadeMinima ? 'alta' : 'media'
        });
      }
    });

    // Ordenar por prioridade
    return sugestoes.sort((a, b) => {
      if (a.prioridade === 'alta' && b.prioridade !== 'alta') return -1;
      if (a.prioridade !== 'alta' && b.prioridade === 'alta') return 1;
      return 0;
    });
  } catch (error) {
    console.error('[Dashboard] Erro ao buscar sugestões de reposição:', error);
    return [];
  }
};

export default {
  buscarEstatisticasGerais,
  buscarAlertas,
  buscarClientesInativos,
  calcularInsightsClientes,
  buscarSugestoesReposicao
};
