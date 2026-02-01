import { getAllDocuments, subscribeToCollection } from '../../../services/storeHelpers';

/**
 * Serviço de Dashboard - 100% Real e Conectado ao Firebase
 * Com isolamento multi-tenant completo
 */

/**
 * Estados padronizados do sistema
 */
const CHECKIN_STATUS = {
  IN_SERVICE: 'in-progress',
  WAITING_PARTS: 'waiting-parts',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

const BUDGET_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired'
};

/**
 * Busca estatísticas OPERACIONAIS em tempo real
 * Foco: O que está acontecendo AGORA na oficina
 * 🔒 SEGURANÇA: Valida empresaId antes de qualquer operação
 */
export const buscarEstatisticasGerais = async () => {
  try {
    // 🔒 VALIDAÇÃO DE TENANT
    const empresaId = sessionStorage.getItem('empresaId');
    if (!empresaId) {
      console.error('🚨 ERRO DE SEGURANÇA: empresaId não encontrado');
      throw new Error('Sessão inválida. Faça login novamente.');
    }
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    
    // 🔒 SEGURANÇA: Buscar apenas dados da empresa do usuário
    // storeHelpers já filtra por empresaId automaticamente
    const [checkinsData, orcamentosData, clientesData] = await Promise.all([
      getAllDocuments('checkins'),
      getAllDocuments('budgets'),
      getAllDocuments('clients')
    ]);
    
    // 🔒 VALIDAÇÃO ADICIONAL: Filtrar dados que possam ter vazado
    const checkinsValidados = checkinsData.filter(c => c.empresaId === empresaId);
    const orcamentosValidados = orcamentosData.filter(o => o.empresaId === empresaId);
    const clientesValidados = clientesData.filter(c => c.empresaId === empresaId);

    // === MÉTRICAS OPERACIONAIS CRÍTICAS ===
    
    // 1. Veículos EM SERVIÇO AGORA (status ativo)
    const veiculosEmServicoArray = checkinsValidados.filter(c => 
      c.status === CHECKIN_STATUS.IN_SERVICE || 
      c.status === CHECKIN_STATUS.WAITING_PARTS
    );
    const veiculosEmServico = veiculosEmServicoArray.length;
    
    // 2. Serviços ATRASADOS (prometidos para antes de hoje e não concluídos)
    const servicosAtrasados = checkinsValidados.filter(c => {
      if (c.status === CHECKIN_STATUS.COMPLETED) return false;
      if (!c.expectedDeliveryDate) return false;
      
      const dataPromessa = c.expectedDeliveryDate.seconds 
        ? new Date(c.expectedDeliveryDate.seconds * 1000) 
        : new Date(c.expectedDeliveryDate);
      
      return dataPromessa < hoje;
    });
    
    // 3. Veículos PRONTOS aguardando retirada
    const veiculosProntos = checkinsValidados.filter(c => 
      c.status === CHECKIN_STATUS.READY
    ).length;
    
    // 4. Veículos PARADOS (em serviço há mais de 3 dias sem atualização)
    const tresDiasAtras = new Date();
    tresDiasAtras.setDate(tresDiasAtras.getDate() - 3);
    
    const veiculosParados = veiculosEmServicoArray.filter(c => {
      const ultimaAtualizacao = c.updatedAt?.seconds 
        ? new Date(c.updatedAt.seconds * 1000)
        : c.createdAt?.seconds 
          ? new Date(c.createdAt.seconds * 1000)
          : new Date();
      
      return ultimaAtualizacao < tresDiasAtras;
    });

    
    // === MÉTRICAS FINANCEIRAS CRÍTICAS ===
    
    // 5. Receita do DIA (orçamentos aprovados hoje)
    const orcamentosHoje = orcamentosValidados.filter(orc => {
      if (orc.status !== BUDGET_STATUS.APPROVED) return false;
      if (!orc.approvedAt && !orc.createdAt) return false;
      
      const dataAprovacao = orc.approvedAt?.seconds 
        ? new Date(orc.approvedAt.seconds * 1000)
        : orc.createdAt?.seconds 
          ? new Date(orc.createdAt.seconds * 1000)
          : new Date(orc.createdAt);
      
      return dataAprovacao.toDateString() === new Date().toDateString();
    });
    
    const receitaDia = orcamentosHoje.reduce((sum, orc) => {
      const valor = parseFloat(orc.total || orc.totalValue || 0);
      return sum + (isNaN(valor) ? 0 : valor);
    }, 0);
    
    // 6. Receita do MÊS (orçamentos aprovados no mês)
    const orcamentosMes = orcamentosValidados.filter(orc => {
      if (orc.status !== BUDGET_STATUS.APPROVED) return false;
      if (!orc.approvedAt && !orc.createdAt) return false;
      
      const dataAprovacao = orc.approvedAt?.seconds 
        ? new Date(orc.approvedAt.seconds * 1000)
        : orc.createdAt?.seconds 
          ? new Date(orc.createdAt.seconds * 1000)
          : new Date(orc.createdAt);
      
      return dataAprovacao >= inicioMes;
    });
    
    const receitaMes = orcamentosMes.reduce((sum, orc) => {
      const valor = parseFloat(orc.total || orc.totalValue || 0);
      return sum + (isNaN(valor) ? 0 : valor);
    }, 0);
    
    // 7. Ticket médio do mês
    const ticketMedio = orcamentosMes.length > 0 
      ? receitaMes / orcamentosMes.length 
      : 0;
    
    // 8. Taxa de conversão (orçamentos aprovados / total)
    const totalOrcamentos = orcamentosValidados.filter(orc => {
      if (!orc.createdAt) return false;
      const data = orc.createdAt.seconds 
        ? new Date(orc.createdAt.seconds * 1000)
        : new Date(orc.createdAt);
      return data >= inicioMes;
    }).length;
    
    const taxaConversao = totalOrcamentos > 0 
      ? (orcamentosMes.length / totalOrcamentos) * 100 
      : 0;
    
    // 9. Tempo médio de permanência (veículos concluídos no mês)
    const checkinsConcluidosMes = checkinsData.filter(c => {
      if (c.status !== CHECKIN_STATUS.COMPLETED) return false;
      if (!c.completedAt) return false;
      
      const dataConclusao = c.completedAt.seconds 
        ? new Date(c.completedAt.seconds * 1000)
        : new Date(c.completedAt);
      
      return dataConclusao >= inicioMes;
    });
    
    const tempoMedioPermanencia = checkinsConcluidosMes.reduce((sum, c) => {
      if (!c.createdAt || !c.completedAt) return sum;
      
      const entrada = c.createdAt.seconds 
        ? new Date(c.createdAt.seconds * 1000)
        : new Date(c.createdAt);
      
      const saida = c.completedAt.seconds 
        ? new Date(c.completedAt.seconds * 1000)
        : new Date(c.completedAt);
      
      const dias = (saida - entrada) / (1000 * 60 * 60 * 24);
      return sum + dias;
    }, 0) / (checkinsConcluidosMes.length || 1);
    
    // === MÉTRICAS SECUNDÁRIAS ===
    
    // Total de clientes (para contexto)
    const totalClientes = clientesData.length;
    
    // Clientes atendidos no mês
    const clientesAtendidosMes = new Set(
      checkinsData
        .filter(c => {
          if (!c.createdAt) return false;
          const data = c.createdAt.seconds 
            ? new Date(c.createdAt.seconds * 1000)
            : new Date(c.createdAt);
          return data >= inicioMes;
        })
        .map(c => c.clientId || c.clientName)
    ).size;

    return {
      // === OPERACIONAIS (CRÍTICOS) ===
      veiculosEmServico: veiculosEmServico.length,
      servicosAtrasados: servicosAtrasados.length,
      veiculosProntos: veiculosProntos.length,
      veiculosParados: veiculosParados.length,
      
      // === FINANCEIROS (CRÍTICOS) ===
      receitaDia: parseFloat(receitaDia.toFixed(2)),
      receitaMes: parseFloat(receitaMes.toFixed(2)),
      ticketMedio: parseFloat(ticketMedio.toFixed(2)),
      taxaConversao: parseFloat(taxaConversao.toFixed(1)),
      
      // === EFICIÊNCIA ===
      tempoMedioPermanencia: parseFloat(tempoMedioPermanencia.toFixed(1)),
      servicosConcluidosMes: checkinsConcluidosMes.length,
      
      // === CONTEXTO ===
      totalClientes,
      clientesAtendidosMes,
      totalOrcamentosMes: orcamentosMes.length,
      
      // === DADOS BRUTOS (para detalhes) ===
      veiculosEmServicoDetalhes: veiculosEmServico.map(c => ({
        id: c.id || c.firestoreId,
        placa: c.vehiclePlate,
        cliente: c.clientName,
        entrada: c.createdAt,
        status: c.status
      })),
      servicosAtrasadosDetalhes: servicosAtrasados.map(c => ({
        id: c.id || c.firestoreId,
        placa: c.vehiclePlate,
        cliente: c.clientName,
        dataPromessa: c.expectedDeliveryDate,
        diasAtraso: Math.floor((hoje - (c.expectedDeliveryDate.seconds 
          ? new Date(c.expectedDeliveryDate.seconds * 1000)
          : new Date(c.expectedDeliveryDate))) / (1000 * 60 * 60 * 24))
      })),
      veiculosProntosDetalhes: veiculosProntos.map(c => ({
        id: c.id || c.firestoreId,
        placa: c.vehiclePlate,
        cliente: c.clientName,
        telefone: c.clientPhone,
        dataConclusao: c.completedAt || c.updatedAt
      }))
    };
  } catch (error) {
    console.error('[Dashboard] Erro ao buscar estatísticas:', error);
    throw error;
  }
};

/**
 * Busca alertas CRÍTICOS e ACIONÁVEIS do sistema
 * Prioridade: Problemas que exigem ação IMEDIATA
 */
export const buscarAlertas = async () => {
  try {
    const alertas = [];
    const hoje = new Date();
    
    // Buscar dados necessários
    const [checkinsData, estoqueData, orcamentosData] = await Promise.all([
      getAllDocuments('checkins'),
      getAllDocuments('inventory'),
      getAllDocuments('budgets')
    ]);

    // === ALERTAS CRÍTICOS (VERMELHO) ===
    
    // 1. Serviços ATRASADOS
    checkinsData.forEach(checkin => {
      if (checkin.status === CHECKIN_STATUS.COMPLETED) return;
      if (!checkin.expectedDeliveryDate) return;
      
      const dataPromessa = checkin.expectedDeliveryDate.seconds 
        ? new Date(checkin.expectedDeliveryDate.seconds * 1000)
        : new Date(checkin.expectedDeliveryDate);
      
      if (dataPromessa < hoje) {
        const diasAtraso = Math.floor((hoje - dataPromessa) / (1000 * 60 * 60 * 24));
        alertas.push({
          id: `atraso-${checkin.id}`,
          tipo: 'critico',
          categoria: 'operacional',
          titulo: `Serviço Atrasado - ${diasAtraso} dia${diasAtraso > 1 ? 's' : ''}`,
          mensagem: `${checkin.vehiclePlate} - ${checkin.clientName}`,
          data: new Date(),
          prioridade: 'alta',
          acao: {
            label: 'Ver Detalhes',
            link: `/checkin?id=${checkin.id}`,
            tipo: 'link'
          },
          dados: {
            checkinId: checkin.id,
            placa: checkin.vehiclePlate,
            cliente: checkin.clientName,
            telefone: checkin.clientPhone,
            diasAtraso
          }
        });
      }
    });
    
    // 2. Veículos PARADOS (sem atualização há 3+ dias)
    const tresDiasAtras = new Date();
    tresDiasAtras.setDate(tresDiasAtras.getDate() - 3);
    
    checkinsData.forEach(checkin => {
      if (checkin.status !== CHECKIN_STATUS.IN_SERVICE && 
          checkin.status !== CHECKIN_STATUS.WAITING_PARTS) return;
      
      const ultimaAtualizacao = checkin.updatedAt?.seconds 
        ? new Date(checkin.updatedAt.seconds * 1000)
        : checkin.createdAt?.seconds 
          ? new Date(checkin.createdAt.seconds * 1000)
          : new Date();
      
      if (ultimaAtualizacao < tresDiasAtras) {
        const diasParado = Math.floor((hoje - ultimaAtualizacao) / (1000 * 60 * 60 * 24));
        alertas.push({
          id: `parado-${checkin.id}`,
          tipo: 'aviso',
          categoria: 'operacional',
          titulo: `Veículo Parado - ${diasParado} dias sem atualização`,
          mensagem: `${checkin.vehiclePlate} - ${checkin.clientName}`,
          data: new Date(),
          prioridade: 'alta',
          acao: {
            label: 'Atualizar Status',
            link: `/checkin?id=${checkin.id}`,
            tipo: 'link'
          },
          dados: {
            checkinId: checkin.id,
            placa: checkin.vehiclePlate,
            diasParado
          }
        });
      }
    });
    
    // 3. Produtos ESGOTADOS
    estoqueData.forEach(item => {
      const quantidade = item.quantity || item.currentStock || 0;
      
      if (quantidade === 0) {
        alertas.push({
          id: `esgotado-${item.id}`,
          tipo: 'critico',
          categoria: 'estoque',
          titulo: 'Produto Esgotado',
          mensagem: `${item.name} - Estoque ZERO`,
          data: new Date(),
          prioridade: 'alta',
          acao: {
            label: 'Repor Estoque',
            link: `/inventory?id=${item.id}`,
            tipo: 'link'
          },
          dados: {
            produtoId: item.id,
            nome: item.name,
            codigo: item.partNumber || item.sku
          }
        });
      }
    });

    // === ALERTAS IMPORTANTES (AMARELO) ===
    
    // 4. Veículos PRONTOS aguardando retirada
    checkinsData.forEach(checkin => {
      if (checkin.status !== CHECKIN_STATUS.READY) return;
      
      const dataConclusao = checkin.completedAt?.seconds 
        ? new Date(checkin.completedAt.seconds * 1000)
        : checkin.updatedAt?.seconds 
          ? new Date(checkin.updatedAt.seconds * 1000)
          : new Date();
      
      const diasPronto = Math.floor((hoje - dataConclusao) / (1000 * 60 * 60 * 24));
      
      if (diasPronto >= 1) {
        alertas.push({
          id: `pronto-${checkin.id}`,
          tipo: 'aviso',
          categoria: 'operacional',
          titulo: `Veículo Pronto - ${diasPronto} dia${diasPronto > 1 ? 's' : ''}`,
          mensagem: `${checkin.vehiclePlate} - ${checkin.clientName}`,
          data: new Date(),
          prioridade: 'media',
          acao: {
            label: 'Notificar Cliente',
            link: `/checkin?id=${checkin.id}&action=notify`,
            tipo: 'action'
          },
          dados: {
            checkinId: checkin.id,
            placa: checkin.vehiclePlate,
            cliente: checkin.clientName,
            telefone: checkin.clientPhone,
            diasPronto
          }
        });
      }
    });
    
    // 5. Estoque BAIXO
    estoqueData.forEach(item => {
      const quantidade = item.quantity || item.currentStock || 0;
      const minimo = item.minQuantity || item.minStock || 5;
      
      if (quantidade > 0 && quantidade <= minimo) {
        alertas.push({
          id: `baixo-${item.id}`,
          tipo: 'aviso',
          categoria: 'estoque',
          titulo: 'Estoque Baixo',
          mensagem: `${item.name} - ${quantidade} unidade${quantidade !== 1 ? 's' : ''}`,
          data: new Date(),
          prioridade: 'media',
          acao: {
            label: 'Ver Produto',
            link: `/inventory?id=${item.id}`,
            tipo: 'link'
          }
        });
      }
    });
    
    // 6. Orçamentos PENDENTES há mais de 2 dias
    const doisDiasAtras = new Date();
    doisDiasAtras.setDate(doisDiasAtras.getDate() - 2);
    
    orcamentosData.forEach(orc => {
      if (orc.status !== BUDGET_STATUS.PENDING) return;
      
      const dataCriacao = orc.createdAt?.seconds 
        ? new Date(orc.createdAt.seconds * 1000)
        : new Date(orc.createdAt);
      
      if (dataCriacao < doisDiasAtras) {
        const diasPendente = Math.floor((hoje - dataCriacao) / (1000 * 60 * 60 * 24));
        alertas.push({
          id: `orcamento-${orc.id}`,
          tipo: 'info',
          categoria: 'comercial',
          titulo: `Orçamento Pendente - ${diasPendente} dias`,
          mensagem: `${orc.clientName} - R$ ${(orc.total || 0).toFixed(2)}`,
          data: new Date(),
          prioridade: 'media',
          acao: {
            label: 'Acompanhar',
            link: `/budgets?id=${orc.id}`,
            tipo: 'link'
          }
        });
      }
    });

    // Ordenar por prioridade e tipo
    const prioridadeOrdem = { alta: 1, media: 2, baixa: 3 };
    const tipoOrdem = { critico: 1, aviso: 2, info: 3 };
    
    return alertas.sort((a, b) => {
      const prioA = prioridadeOrdem[a.prioridade] || 3;
      const prioB = prioridadeOrdem[b.prioridade] || 3;
      if (prioA !== prioB) return prioA - prioB;
      
      const tipoA = tipoOrdem[a.tipo] || 3;
      const tipoB = tipoOrdem[b.tipo] || 3;
      return tipoA - tipoB;
    });
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
 * Busca veículos ativos (cadastrados nos clientes)
 */
export const buscarVeiculosAtivos = async () => {
  try {
    const clientesData = await getAllDocuments('clients');
    const veiculosAtivos = [];

    // Veículos estão dentro dos clientes
    clientesData.forEach(cliente => {
      if (cliente.vehicles && cliente.vehicles.length > 0) {
        cliente.vehicles.forEach(veiculo => {
          veiculosAtivos.push({
            id: veiculo.id || `${cliente.id}-${veiculo.plate || veiculo.placa}`,
            placa: veiculo.plate || veiculo.placa || veiculo.licensePlate || 'Sem placa',
            marca: veiculo.brand || veiculo.marca || veiculo.make || '',
            modelo: veiculo.model || veiculo.modelo || '',
            ano: veiculo.year || veiculo.ano || '',
            cor: veiculo.color || veiculo.cor || '',
            status: 'Cadastrado',
            cliente: cliente.name || 'Cliente não informado',
            clienteId: cliente.id,
            dataEntrada: veiculo.createdAt ? new Date(veiculo.createdAt) : (cliente.createdAt ? new Date(cliente.createdAt) : new Date())
          });
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

    // Buscar clientes (veículos estão dentro dos clientes)
    const clientesData = await getAllDocuments('clients');

    // Extrair todos os veículos dos clientes
    const todosVeiculos = [];
    clientesData.forEach(cliente => {
      if (cliente.vehicles && cliente.vehicles.length > 0) {
        cliente.vehicles.forEach(veiculo => {
          todosVeiculos.push({
            ...veiculo,
            clienteId: cliente.id,
            createdAt: veiculo.createdAt || cliente.createdAt
          });
        });
      }
    });

    const dadosGrafico = diasSemana.map(dia => {
      const clientesDia = clientesData.filter(data => {
        if (!data.createdAt) return false;
        const dataCriacao = new Date(data.createdAt);
        return dataCriacao.toDateString() === dia.dataCompleta.toDateString();
      }).length;

      const veiculosDia = todosVeiculos.filter(data => {
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

    // Buscar dados necessários
    const [clientesData, orcamentosData] = await Promise.all([
      getAllDocuments('clients'),
      getAllDocuments('budgets')
    ]);

    // Extrair todos os veículos dos clientes
    const todosVeiculos = [];
    clientesData.forEach(cliente => {
      if (cliente.vehicles && cliente.vehicles.length > 0) {
        cliente.vehicles.forEach(veiculo => {
          todosVeiculos.push({
            ...veiculo,
            clienteId: cliente.id,
            createdAt: veiculo.createdAt || cliente.createdAt
          });
        });
      }
    });

    // === TENDÊNCIAS DE CLIENTES E VEÍCULOS ===
    
    // Contar registros do período atual (últimos 7 dias)
    const clientesAtual = clientesData.filter(data => {
      if (!data.createdAt) return false;
      const dataCriacao = new Date(data.createdAt);
      return dataCriacao >= seteDiasAtras;
    }).length;

    const veiculosAtual = todosVeiculos.filter(data => {
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

    const veiculosAnterior = todosVeiculos.filter(data => {
      if (!data.createdAt) return false;
      const dataCriacao = new Date(data.createdAt);
      return dataCriacao >= quatorzeDiasAtras && dataCriacao < seteDiasAtras;
    }).length;

    // === TENDÊNCIAS FINANCEIRAS ===
    
    // Receita período atual (últimos 7 dias)
    const orcamentosAtual = orcamentosData.filter(orc => {
      if (orc.status !== BUDGET_STATUS.APPROVED) return false;
      if (!orc.approvedAt && !orc.createdAt) return false;
      
      const dataAprovacao = orc.approvedAt?.seconds 
        ? new Date(orc.approvedAt.seconds * 1000)
        : orc.createdAt?.seconds 
          ? new Date(orc.createdAt.seconds * 1000)
          : new Date(orc.createdAt);
      
      return dataAprovacao >= seteDiasAtras;
    });
    
    const receitaAtual = orcamentosAtual.reduce((sum, orc) => {
      const valor = parseFloat(orc.total || orc.totalValue || 0);
      return sum + (isNaN(valor) ? 0 : valor);
    }, 0);
    
    // Receita período anterior (7-14 dias atrás)
    const orcamentosAnterior = orcamentosData.filter(orc => {
      if (orc.status !== BUDGET_STATUS.APPROVED) return false;
      if (!orc.approvedAt && !orc.createdAt) return false;
      
      const dataAprovacao = orc.approvedAt?.seconds 
        ? new Date(orc.approvedAt.seconds * 1000)
        : orc.createdAt?.seconds 
          ? new Date(orc.createdAt.seconds * 1000)
          : new Date(orc.createdAt);
      
      return dataAprovacao >= quatorzeDiasAtras && dataAprovacao < seteDiasAtras;
    });
    
    const receitaAnterior = orcamentosAnterior.reduce((sum, orc) => {
      const valor = parseFloat(orc.total || orc.totalValue || 0);
      return sum + (isNaN(valor) ? 0 : valor);
    }, 0);
    
    // Ticket médio período atual
    const ticketAtual = orcamentosAtual.length > 0 
      ? receitaAtual / orcamentosAtual.length 
      : 0;
    
    // Ticket médio período anterior
    const ticketAnterior = orcamentosAnterior.length > 0 
      ? receitaAnterior / orcamentosAnterior.length 
      : 0;

    // === FUNÇÕES AUXILIARES ===
    
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
      // Tendências de clientes e veículos
      tendenciaClientes: getTendencia(clientesAtual, clientesAnterior),
      percentualClientes: getPercentual(clientesAtual, clientesAnterior),
      tendenciaVeiculos: getTendencia(veiculosAtual, veiculosAnterior),
      percentualVeiculos: getPercentual(veiculosAtual, veiculosAnterior),
      
      // Tendências financeiras
      tendenciaReceita: getTendencia(receitaAtual, receitaAnterior),
      percentualReceita: getPercentual(receitaAtual, receitaAnterior),
      tendenciaTicket: getTendencia(ticketAtual, ticketAnterior),
      percentualTicket: getPercentual(ticketAtual, ticketAnterior),
      
      // Placeholders para futuras implementações
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
      tendenciaReceita: 'stable',
      percentualReceita: 0,
      tendenciaTicket: 'stable',
      percentualTicket: 0,
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
  // Nota: veículos estão dentro de clients, não em coleção separada
  unsubscribers.push(
    subscribeToCollection('clients', () => callback('clients')),
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
