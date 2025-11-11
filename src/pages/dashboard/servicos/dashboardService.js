import { getAllDocuments, subscribeToCollection } from '../../../services/storeHelpers';

/**
 * Serviço de Dashboard - 100% Real e Conectado ao Firebase
 * Com isolamento multi-tenant completo
 */

/**
 * Busca estatísticas gerais do sistema em tempo real
 */
export const buscarEstatisticasGerais = async () => {
  try {
    const [clientesData, veiculosData, ferramentasData, estoqueData, orcamentosData, checkinsData] = await Promise.all([
      getAllDocuments('clients'),
      getAllDocuments('vehicles'),
      getAllDocuments('tools'),
      getAllDocuments('inventory'),
      getAllDocuments('budgets'),
      getAllDocuments('checkins')
    ]);

    // Calcular veículos ativos (apenas em atendimento)
    const statusAtivos = ['Em Montagem', 'Aguardando Peças', 'Teste', 'em_servico', 'in_service', 'aguardando_pecas', 'waiting_parts', 'teste', 'testing'];
    const veiculosAtivos = checkinsData.filter(checkin => 
      checkin.status && statusAtivos.includes(checkin.status)
    ).length;

    // Calcular ferramentas em uso
    const ferramentasEmUso = ferramentasData.filter(f => 
      f.status === 'Em Uso' || f.status === 'em_uso' || f.status === 'in_use'
    ).length;

    // Calcular ferramentas em manutenção
    const ferramentasManutencao = ferramentasData.filter(f => 
      f.status === 'Manutenção' || f.status === 'manutencao' || f.status === 'maintenance'
    ).length;

    // Calcular estoque total (soma de quantidades)
    const estoqueTotal = estoqueData.reduce((sum, item) => sum + (item.quantity || item.currentStock || 0), 0);

    // Calcular produtos com estoque baixo
    const produtosBaixoEstoque = estoqueData.filter(item => 
      (item.quantity || item.currentStock || 0) <= (item.minQuantity || item.minStock || 5)
    ).length;

    // Calcular receita mensal (orçamentos aprovados do mês atual)
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const orcamentosMesAtual = orcamentosData.filter(orc => {
      if (!orc.createdAt) return false;
      const dataOrc = orc.createdAt.seconds ? new Date(orc.createdAt.seconds * 1000) : new Date(orc.createdAt);
      return dataOrc >= inicioMes && (orc.status === 'approved' || orc.status === 'aprovado');
    });
    const receitaMensal = orcamentosMesAtual.reduce((sum, orc) => sum + (orc.total || 0), 0);

    // Calcular serviços hoje
    const servicosHoje = checkinsData.filter(checkin => {
      if (!checkin.createdAt) return false;
      const dataCheckin = checkin.createdAt.seconds ? new Date(checkin.createdAt.seconds * 1000) : new Date(checkin.createdAt);
      return dataCheckin.toDateString() === hoje.toDateString();
    }).length;

    return {
      totalClientes: clientesData.length,
      totalVeiculos: veiculosData.length,
      veiculosAtivos,
      totalFerramentas: ferramentasData.length,
      ferramentasEmUso,
      ferramentasDisponiveis: ferramentasData.length - ferramentasEmUso - ferramentasManutencao,
      ferramentasManutencao,
      totalProdutos: estoqueData.length,
      totalEstoque: estoqueTotal,
      produtosBaixoEstoque,
      receitaMensal,
      servicosHoje,
      clientes: clientesData,
      veiculos: veiculosData,
      ferramentas: ferramentasData,
      estoque: estoqueData,
      orcamentos: orcamentosData,
      checkins: checkinsData
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
    const estoqueData = await getAllDocuments('inventory');
    estoqueData.forEach(item => {
      const quantidade = item.quantity || item.currentStock || 0;
      const minimo = item.minQuantity || item.minStock || 5;

      if (quantidade <= minimo) {
        alertas.push({
          id: `estoque-${item.id}`,
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
    const ferramentasData = await getAllDocuments('tools');
    ferramentasData.forEach(ferramenta => {
      if (ferramenta.status === 'Manutenção' || ferramenta.status === 'manutencao' || ferramenta.status === 'maintenance') {
        alertas.push({
          id: `ferramenta-${ferramenta.id}`,
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
    const clientesData = await getAllDocuments('clients', {
      orderBy: { field: 'createdAt', direction: 'desc' }
    });

    return clientesData.slice(0, 5).map(data => ({
      id: data.id,
      nome: data.name || 'Cliente sem nome',
      email: data.email || '',
      telefone: data.phone || '',
      cpfCnpj: data.cpfCnpj || '',
      dataCadastro: data.createdAt ? new Date(data.createdAt) : new Date(),
      totalServicos: data.totalServices || 0
    }));
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
    const estoqueData = await getAllDocuments('inventory');
    const produtosCriticos = [];

    estoqueData.forEach(item => {
      const quantidade = item.quantity || item.currentStock || 0;
      const minimo = item.minQuantity || item.minStock || 5;

      if (quantidade <= minimo) {
        produtosCriticos.push({
          id: item.id,
          nome: item.name || 'Produto sem nome',
          codigo: item.partNumber || item.sku || item.partId || '',
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
    const ferramentasData = await getAllDocuments('tools');
    const ferramentasEmUso = [];

    ferramentasData.forEach(ferramenta => {
      if (ferramenta.status === 'Em Uso' || ferramenta.status === 'em_uso' || ferramenta.status === 'in_use') {
        ferramentasEmUso.push({
          id: ferramenta.id,
          nome: ferramenta.name || 'Ferramenta sem nome',
          codigo: ferramenta.code || ferramenta.toolId || '',
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
    const veiculosData = await getAllDocuments('vehicles');
    const veiculosAtivos = [];

    veiculosData.forEach(veiculo => {
      const statusAtivos = ['Em Montagem', 'Aguardando Peças', 'Teste', 'em_servico', 'in_service'];
      
      if (statusAtivos.includes(veiculo.status)) {
        veiculosAtivos.push({
          id: veiculo.id,
          placa: veiculo.plate || veiculo.licensePlate || 'Sem placa',
          marca: veiculo.brand || veiculo.make || '',
          modelo: veiculo.model || '',
          ano: veiculo.year || '',
          status: veiculo.status || 'Em Serviço',
          cliente: veiculo.clientName || 'Cliente não informado',
          dataEntrada: veiculo.createdAt ? new Date(veiculo.createdAt) : new Date()
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
    const clientes = await getAllDocuments('clients');

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

    // Buscar clientes e veículos
    const [clientesData, veiculosData] = await Promise.all([
      getAllDocuments('clients'),
      getAllDocuments('vehicles')
    ]);

    const dadosGrafico = diasSemana.map(dia => {
      const clientesDia = clientesData.filter(data => {
        if (!data.createdAt) return false;
        const dataCriacao = new Date(data.createdAt);
        return dataCriacao.toDateString() === dia.dataCompleta.toDateString();
      }).length;

      const veiculosDia = veiculosData.filter(data => {
        if (!data.createdAt) return false;
        const dataCriacao = new Date(data.createdAt);
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
export const gerarDadosGraficoMovimentacao = gerarDadosGrafico;

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
    const [clientesData, veiculosData] = await Promise.all([
      getAllDocuments('clients'),
      getAllDocuments('vehicles')
    ]);

    // Contar registros do período atual (últimos 7 dias)
    const clientesAtual = clientesData.filter(data => {
      if (!data.createdAt) return false;
      const dataCriacao = new Date(data.createdAt);
      return dataCriacao >= seteDiasAtras;
    }).length;

    const veiculosAtual = veiculosData.filter(data => {
      if (!data.createdAt) return false;
      const dataCriacao = new Date(data.createdAt);
      return dataCriacao >= seteDiasAtras;
    }).length;

    // Contar registros do período anterior (7-14 dias atrás)
    const clientesAnterior = clientesData.filter(data => {
      if (!data.createdAt) return false;
      const dataCriacao = new Date(data.createdAt);
      return dataCriacao >= quatorzeDiasAtras && dataCriacao < seteDiasAtras;
    }).length;

    const veiculosAnterior = veiculosData.filter(data => {
      if (!data.createdAt) return false;
      const dataCriacao = new Date(data.createdAt);
      return dataCriacao >= quatorzeDiasAtras && dataCriacao < seteDiasAtras;
    }).length;

    // Calcular tendências
    const getTendencia = (atual, anterior) => {
      // Se ambos são zero, não há dados suficientes
      if (anterior === 0 && atual === 0) return 'stable';
      // Se anterior é zero mas atual tem dados, considerar crescimento
      if (anterior === 0) return atual > 0 ? 'up' : 'stable';
      
      const diferenca = ((atual - anterior) / anterior) * 100;
      if (diferenca > 5) return 'up';
      if (diferenca < -5) return 'down';
      return 'stable';
    };

    const getPercentual = (atual, anterior) => {
      // Se ambos são zero, retornar 0
      if (anterior === 0 && atual === 0) return 0;
      // Se anterior é zero mas atual tem dados
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

  // Listeners isolados por empresa
  unsubscribers.push(
    subscribeToCollection('clients', () => callback('clients')),
    subscribeToCollection('vehicles', () => callback('vehicles')),
    subscribeToCollection('tools', () => callback('tools')),
    subscribeToCollection('inventory', () => callback('inventory')),
    subscribeToCollection('budgets', () => callback('budgets')),
    subscribeToCollection('checkins', () => callback('checkins'))
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
