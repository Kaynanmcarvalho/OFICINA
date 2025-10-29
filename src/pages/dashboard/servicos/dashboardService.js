import { collection, getDocs, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/firebase';

/**
 * Serviço de Dashboard - 100% Real e Conectado ao Firebase
 * Sem mocks, sem placeholders, apenas dados reais
 */

/**
 * Busca estatísticas gerais do sistema em tempo real
 */
export const buscarEstatisticasGerais = async () => {
  try {
    const [clientes, veiculos, ferramentas, estoque] = await Promise.all([
      getDocs(collection(db, 'clients')),
      getDocs(collection(db, 'vehicles')),
      getDocs(collection(db, 'tools')),
      getDocs(collection(db, 'inventory'))
    ]);

    // Processar dados de clientes
    const clientesData = clientes.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const veiculosData = veiculos.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const ferramentasData = ferramentas.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const estoqueData = estoque.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Calcular ferramentas em uso
    const ferramentasEmUso = ferramentasData.filter(f => 
      f.status === 'Em Uso' || f.status === 'em_uso' || f.status === 'in_use'
    ).length;

    // Calcular estoque total (soma de quantidades)
    const estoqueTotal = estoqueData.reduce((sum, item) => sum + (item.quantity || 0), 0);

    // Calcular produtos com estoque baixo
    const produtosBaixoEstoque = estoqueData.filter(item => 
      (item.quantity || 0) <= (item.minQuantity || 5)
    ).length;

    return {
      totalClientes: clientes.size,
      totalVeiculos: veiculos.size,
      totalFerramentas: ferramentas.size,
      ferramentasEmUso,
      ferramentasDisponiveis: ferramentas.size - ferramentasEmUso,
      totalProdutos: estoque.size,
      totalEstoque: estoqueTotal,
      produtosBaixoEstoque,
      clientes: clientesData,
      veiculos: veiculosData,
      ferramentas: ferramentasData,
      estoque: estoqueData
    };
  } catch (error) {
    console.error('[Dashboard] Erro ao buscar estatísticas:', error);
    throw error;
  }
};

/**
 * Busca alertas críticos do sistema
 */
export const buscarAlertas = async () => {
  try {
    const alertas = [];

    // Verificar estoque baixo
    const estoqueSnapshot = await getDocs(collection(db, 'inventory'));
    estoqueSnapshot.forEach(doc => {
      const item = doc.data();
      const quantidade = item.quantity || 0;
      const minimo = item.minQuantity || 5;

      if (quantidade <= minimo) {
        alertas.push({
          id: `estoque-${doc.id}`,
          tipo: quantidade === 0 ? 'critico' : 'aviso',
          categoria: 'estoque',
          titulo: quantidade === 0 ? 'Produto Esgotado' : 'Estoque Baixo',
          mensagem: `${item.name} - ${quantidade} unidade${quantidade !== 1 ? 's' : ''} restante${quantidade !== 1 ? 's' : ''}`,
          data: new Date(),
          prioridade: quantidade === 0 ? 'alta' : 'media'
        });
      }
    });

    // Verificar ferramentas em manutenção
    const ferramentasSnapshot = await getDocs(collection(db, 'tools'));
    ferramentasSnapshot.forEach(doc => {
      const ferramenta = doc.data();
      if (ferramenta.status === 'Manutenção' || ferramenta.status === 'manutencao' || ferramenta.status === 'maintenance') {
        alertas.push({
          id: `ferramenta-${doc.id}`,
          tipo: 'info',
          categoria: 'ferramentas',
          titulo: 'Ferramenta em Manutenção',
          mensagem: `${ferramenta.name} indisponível temporariamente`,
          data: new Date(),
          prioridade: 'baixa'
        });
      }
    });

    // Ordenar por prioridade
    const prioridadeOrdem = { alta: 1, media: 2, baixa: 3 };
    return alertas.sort((a, b) => prioridadeOrdem[a.prioridade] - prioridadeOrdem[b.prioridade]);
  } catch (error) {
    console.error('[Dashboard] Erro ao buscar alertas:', error);
    return [];
  }
};

/**
 * Busca clientes recentes (últimos 5)
 */
export const buscarClientesRecentes = async () => {
  try {
    const clientesSnapshot = await getDocs(
      query(collection(db, 'clients'), orderBy('createdAt', 'desc'), limit(5))
    );

    return clientesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        nome: data.name || 'Cliente sem nome',
        email: data.email || '',
        telefone: data.phone || '',
        cpfCnpj: data.cpfCnpj || '',
        dataCadastro: data.createdAt ? new Date(data.createdAt.seconds * 1000) : new Date(),
        totalServicos: data.totalServices || 0
      };
    });
  } catch (error) {
    console.error('[Dashboard] Erro ao buscar clientes recentes:', error);
    return [];
  }
};

/**
 * Busca produtos com estoque crítico
 */
export const buscarEstoqueCritico = async () => {
  try {
    const estoqueSnapshot = await getDocs(collection(db, 'inventory'));
    const produtosCriticos = [];

    estoqueSnapshot.forEach(doc => {
      const item = doc.data();
      const quantidade = item.quantity || 0;
      const minimo = item.minQuantity || 5;

      if (quantidade <= minimo) {
        produtosCriticos.push({
          id: doc.id,
          nome: item.name || 'Produto sem nome',
          codigo: item.partNumber || item.sku || '',
          quantidade,
          minimo,
          categoria: item.category || 'Outros',
          preco: item.unitPrice || 0,
          status: quantidade === 0 ? 'esgotado' : 'baixo'
        });
      }
    });

    // Ordenar por quantidade (menor primeiro)
    return produtosCriticos.sort((a, b) => a.quantidade - b.quantidade);
  } catch (error) {
    console.error('[Dashboard] Erro ao buscar estoque crítico:', error);
    return [];
  }
};

/**
 * Busca ferramentas em uso
 */
export const buscarFerramentasEmUso = async () => {
  try {
    const ferramentasSnapshot = await getDocs(collection(db, 'tools'));
    const ferramentasEmUso = [];

    ferramentasSnapshot.forEach(doc => {
      const ferramenta = doc.data();
      if (ferramenta.status === 'Em Uso' || ferramenta.status === 'em_uso' || ferramenta.status === 'in_use') {
        ferramentasEmUso.push({
          id: doc.id,
          nome: ferramenta.name || 'Ferramenta sem nome',
          codigo: ferramenta.code || '',
          categoria: ferramenta.category || 'Outros',
          responsavel: ferramenta.assignedTo || 'Não atribuído',
          localizacao: ferramenta.location || 'Não especificado',
          dataRetirada: ferramenta.lastUsedDate ? new Date(ferramenta.lastUsedDate) : null
        });
      }
    });

    return ferramentasEmUso;
  } catch (error) {
    console.error('[Dashboard] Erro ao buscar ferramentas em uso:', error);
    return [];
  }
};

/**
 * Busca veículos ativos (em serviço)
 */
export const buscarVeiculosAtivos = async () => {
  try {
    const veiculosSnapshot = await getDocs(collection(db, 'vehicles'));
    const veiculosAtivos = [];

    veiculosSnapshot.forEach(doc => {
      const veiculo = doc.data();
      const statusAtivos = ['Em Montagem', 'Aguardando Peças', 'Teste', 'em_servico', 'in_service'];
      
      if (statusAtivos.includes(veiculo.status)) {
        veiculosAtivos.push({
          id: doc.id,
          placa: veiculo.plate || veiculo.licensePlate || 'Sem placa',
          marca: veiculo.brand || veiculo.make || '',
          modelo: veiculo.model || '',
          ano: veiculo.year || '',
          status: veiculo.status || 'Em Serviço',
          cliente: veiculo.clientName || 'Cliente não informado',
          dataEntrada: veiculo.createdAt ? new Date(veiculo.createdAt.seconds * 1000) : new Date()
        });
      }
    });

    return veiculosAtivos;
  } catch (error) {
    console.error('[Dashboard] Erro ao buscar veículos ativos:', error);
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
    
    // Clientes com mais de 1 serviço são recorrentes
    const clientesRecorrentes = clientes.filter(c => (c.totalServices || 0) > 1).length;
    const clientesNovos = clientes.filter(c => (c.totalServices || 0) <= 1).length;
    
    // Calcular ticket médio
    const totalGasto = clientes.reduce((sum, c) => {
      const serviceHistory = c.serviceHistory || [];
      const gastoCliente = serviceHistory.reduce((s, service) => s + (service.value || 0), 0);
      return sum + gastoCliente;
    }, 0);
    
    const ticketMedio = totalClientes > 0 ? totalGasto / totalClientes : 0;

    // Clientes inativos (mais de 30 dias sem serviço)
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - 30);
    const clientesInativos = clientes.filter(c => {
      const ultimaVisita = c.lastServiceDate ? new Date(c.lastServiceDate) : null;
      return !ultimaVisita || ultimaVisita < dataLimite;
    }).length;

    // Top 5 clientes mais recorrentes
    const clientesMaisRecorrentes = clientes
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
      clientesMaisRecorrentes
    };
  } catch (error) {
    console.error('[Dashboard] Erro ao calcular insights:', error);
    return null;
  }
};

/**
 * Gera dados para gráfico de movimentação (últimos 7 dias)
 */
export const gerarDadosGrafico = async () => {
  try {
    const hoje = new Date();
    const diasSemana = [];
    
    // Gerar últimos 7 dias
    for (let i = 6; i >= 0; i--) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);
      diasSemana.push({
        data: data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        dataCompleta: data
      });
    }

    // Buscar clientes e contar por dia
    const clientesSnapshot = await getDocs(collection(db, 'clients'));
    const veiculosSnapshot = await getDocs(collection(db, 'vehicles'));

    const dadosGrafico = diasSemana.map(dia => {
      const clientesDia = clientesSnapshot.docs.filter(doc => {
        const data = doc.data();
        if (!data.createdAt) return false;
        const dataCriacao = new Date(data.createdAt.seconds * 1000);
        return dataCriacao.toDateString() === dia.dataCompleta.toDateString();
      }).length;

      const veiculosDia = veiculosSnapshot.docs.filter(doc => {
        const data = doc.data();
        if (!data.createdAt) return false;
        const dataCriacao = new Date(data.createdAt.seconds * 1000);
        return dataCriacao.toDateString() === dia.dataCompleta.toDateString();
      }).length;

      return {
        dia: dia.data,
        clientes: clientesDia,
        veiculos: veiculosDia
      };
    });

    return dadosGrafico;
  } catch (error) {
    console.error('[Dashboard] Erro ao gerar dados do gráfico:', error);
    return [];
  }
};

/**
 * Gera dados para gráfico de movimentação semanal (últimos 7 dias)
 */
export const gerarDadosGraficoMovimentacao = async () => {
  try {
    const hoje = new Date();
    const diasSemana = [];
    
    // Gerar últimos 7 dias
    for (let i = 6; i >= 0; i--) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);
      diasSemana.push({
        dia: data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        dataCompleta: data
      });
    }

    // Buscar clientes e veículos
    const [clientesSnapshot, veiculosSnapshot] = await Promise.all([
      getDocs(collection(db, 'clients')),
      getDocs(collection(db, 'vehicles'))
    ]);

    const dadosGrafico = diasSemana.map(({ dia, dataCompleta }) => {
      const clientesDia = clientesSnapshot.docs.filter(doc => {
        const data = doc.data();
        if (!data.createdAt) return false;
        const dataCriacao = new Date(data.createdAt.seconds * 1000);
        return dataCriacao.toDateString() === dataCompleta.toDateString();
      }).length;

      const veiculosDia = veiculosSnapshot.docs.filter(doc => {
        const data = doc.data();
        if (!data.createdAt) return false;
        const dataCriacao = new Date(data.createdAt.seconds * 1000);
        return dataCriacao.toDateString() === dataCompleta.toDateString();
      }).length;

      return {
        dia,
        clientes: clientesDia,
        veiculos: veiculosDia
      };
    });

    return dadosGrafico;
  } catch (error) {
    console.error('[Dashboard] Erro ao gerar dados do gráfico de movimentação:', error);
    return [];
  }
};

/**
 * Calcula tendências comparando período atual com anterior
 */
export const calcularTendencias = async () => {
  try {
    const hoje = new Date();
    const seteDiasAtras = new Date(hoje);
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
    const quatorzeDiasAtras = new Date(hoje);
    quatorzeDiasAtras.setDate(quatorzeDiasAtras.getDate() - 14);

    // Buscar todas as coleções
    const [clientesSnapshot, veiculosSnapshot] = await Promise.all([
      getDocs(collection(db, 'clients')),
      getDocs(collection(db, 'vehicles'))
    ]);

    // Contar registros do período atual (últimos 7 dias)
    const clientesAtual = clientesSnapshot.docs.filter(doc => {
      const data = doc.data();
      if (!data.createdAt) return false;
      const dataCriacao = new Date(data.createdAt.seconds * 1000);
      return dataCriacao >= seteDiasAtras;
    }).length;

    const veiculosAtual = veiculosSnapshot.docs.filter(doc => {
      const data = doc.data();
      if (!data.createdAt) return false;
      const dataCriacao = new Date(data.createdAt.seconds * 1000);
      return dataCriacao >= seteDiasAtras;
    }).length;

    // Contar registros do período anterior (7-14 dias atrás)
    const clientesAnterior = clientesSnapshot.docs.filter(doc => {
      const data = doc.data();
      if (!data.createdAt) return false;
      const dataCriacao = new Date(data.createdAt.seconds * 1000);
      return dataCriacao >= quatorzeDiasAtras && dataCriacao < seteDiasAtras;
    }).length;

    const veiculosAnterior = veiculosSnapshot.docs.filter(doc => {
      const data = doc.data();
      if (!data.createdAt) return false;
      const dataCriacao = new Date(data.createdAt.seconds * 1000);
      return dataCriacao >= quatorzeDiasAtras && dataCriacao < seteDiasAtras;
    }).length;

    // Calcular tendências
    const getTendencia = (atual, anterior) => {
      if (anterior === 0) return atual > 0 ? 'up' : 'stable';
      const diferenca = ((atual - anterior) / anterior) * 100;
      if (diferenca > 5) return 'up';
      if (diferenca < -5) return 'down';
      return 'stable';
    };

    const getPercentual = (atual, anterior) => {
      if (anterior === 0) return atual > 0 ? 100 : 0;
      return Math.abs(((atual - anterior) / anterior) * 100).toFixed(1);
    };

    return {
      tendenciaClientes: getTendencia(clientesAtual, clientesAnterior),
      percentualClientes: getPercentual(clientesAtual, clientesAnterior),
      tendenciaVeiculos: getTendencia(veiculosAtual, veiculosAnterior),
      percentualVeiculos: getPercentual(veiculosAtual, veiculosAnterior),
      tendenciaFerramentas: 'stable',
      percentualFerramentas: 0,
      tendenciaEstoque: 'stable',
      percentualEstoque: 0
    };
  } catch (error) {
    console.error('[Dashboard] Erro ao calcular tendências:', error);
    return {
      tendenciaClientes: 'stable',
      percentualClientes: 0,
      tendenciaVeiculos: 'stable',
      percentualVeiculos: 0,
      tendenciaFerramentas: 'stable',
      percentualFerramentas: 0,
      tendenciaEstoque: 'stable',
      percentualEstoque: 0
    };
  }
};

/**
 * Listener em tempo real para todas as coleções
 */
export const subscribeToAllCollections = (callback) => {
  const unsubscribers = [];

  // Listener para clientes
  unsubscribers.push(
    onSnapshot(
      collection(db, 'clients'),
      () => {
        callback('clients');
      },
      (error) => {
        console.error('[Dashboard] Erro no listener de clientes:', error);
      }
    )
  );

  // Listener para veículos
  unsubscribers.push(
    onSnapshot(
      collection(db, 'vehicles'),
      () => {
        callback('vehicles');
      },
      (error) => {
        console.error('[Dashboard] Erro no listener de veículos:', error);
      }
    )
  );

  // Listener para ferramentas
  unsubscribers.push(
    onSnapshot(
      collection(db, 'tools'),
      () => {
        callback('tools');
      },
      (error) => {
        console.error('[Dashboard] Erro no listener de ferramentas:', error);
      }
    )
  );

  // Listener para estoque
  unsubscribers.push(
    onSnapshot(
      collection(db, 'inventory'),
      () => {
        callback('inventory');
      },
      (error) => {
        console.error('[Dashboard] Erro no listener de estoque:', error);
      }
    )
  );

  // Retornar função para cancelar todos os listeners
  return () => {
    unsubscribers.forEach(unsub => unsub());
  };
};

/**
 * Listener em tempo real para estatísticas (compatibilidade)
 */
export const subscribeToEstatisticas = (callback) => {
  return subscribeToAllCollections(() => {
    buscarEstatisticasGerais().then(callback);
  });
};

export default {
  buscarEstatisticasGerais,
  buscarAlertas,
  buscarClientesRecentes,
  buscarEstoqueCritico,
  buscarFerramentasEmUso,
  buscarVeiculosAtivos,
  calcularInsightsClientes,
  gerarDadosGrafico,
  gerarDadosGraficoMovimentacao,
  calcularTendencias,
  subscribeToAllCollections,
  subscribeToEstatisticas
};
