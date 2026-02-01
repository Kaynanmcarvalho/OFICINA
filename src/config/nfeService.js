/**
 * Serviço para operações específicas de NFe (Nota Fiscal Eletrônica)
 * Utilizado no gerenciamento de notas fiscais para operações B2B
 */

import configService from './configService';
import { API_CONFIG } from './apiConfig.js';

class NFEService {
  constructor() {
    this.bridgeUrl = API_CONFIG.NUVEM_FISCAL_BRIDGE_URL || 'http://localhost:8002';
  }

  /**
   * Faz uma requisição para a ponte PHP
   * @private
   */
  async makeRequest(data) {
    try {
      const response = await fetch(this.bridgeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('❌ [NFE SERVICE] Erro na comunicação:', error);
      throw new Error(`Erro de comunicação: ${error.message}`);
    }
  }

  /**
   * Prepara os dados da NFe baseado nos dados fornecidos
   * @param {Object} nfeData - Dados da NFe
   * @param {Object} config - Configurações do usuário
   */
  prepareDadosNFe(nfeData, config) {
    try {
      // Validar dados obrigatórios
      if (!nfeData || !nfeData.items || nfeData.items.length === 0) {
        throw new Error('Dados da NFe são obrigatórios');
      }

      if (!config || !config.cnpj) {
        throw new Error('Configurações da empresa são obrigatórias');
      }

      if (!nfeData.destinatario || (!nfeData.destinatario.cnpj && !nfeData.destinatario.cpf)) {
        throw new Error('Dados do destinatário são obrigatórios');
      }

      // Calcular totais
      const subtotal = nfeData.items.reduce((sum, item) => sum + (item.valorUnitario * item.quantidade), 0);
      const desconto = nfeData.desconto || 0;
      const frete = nfeData.frete || 0;
      const seguro = nfeData.seguro || 0;
      const despesasAcessorias = nfeData.despesasAcessorias || 0;
      const total = subtotal - desconto + frete + seguro + despesasAcessorias;

      // Preparar itens da NFe
      const items = nfeData.items.map((item, index) => ({
        nItem: index + 1,
        prod: {
          cProd: item.codigo || `PROD${index + 1}`,
          cEAN: item.codigoBarras || 'SEM GTIN',
          xProd: item.descricao,
          NCM: item.ncm || '99999999',
          CEST: item.cest || undefined,
          CFOP: item.cfop || this.getCfop(config, nfeData.destinatario),
          uCom: item.unidade || 'UN',
          qCom: item.quantidade,
          vUnCom: item.valorUnitario,
          vProd: item.valorUnitario * item.quantidade,
          cEANTrib: item.codigoBarras || 'SEM GTIN',
          uTrib: item.unidade || 'UN',
          qTrib: item.quantidade,
          vUnTrib: item.valorUnitario,
          vFrete: item.valorFrete || 0,
          vSeg: item.valorSeguro || 0,
          vDesc: item.valorDesconto || 0,
          vOutro: item.outrasDesp || 0,
          indTot: 1,
          xPed: nfeData.numeroPedido || undefined,
          nItemPed: item.itemPedido || undefined
        },
        imposto: this.calcularImpostos(item, config, nfeData.destinatario)
      }));

      // Dados da NFe
      const nfeCompleta = {
        ide: {
          cUF: this.getCodigoUF(config.uf || 'GO'),
          cNF: this.gerarCodigoNumerico(),
          natOp: nfeData.naturezaOperacao || 'Venda de mercadoria',
          mod: 55, // NFe
          serie: config.nfeSerie || 1,
          nNF: this.gerarNumeroNF(),
          dhEmi: new Date().toISOString(),
          dhSaiEnt: nfeData.dataSaida ? new Date(nfeData.dataSaida).toISOString() : undefined,
          tpNF: nfeData.tipoOperacao || 1, // 0=Entrada, 1=Saída
          idDest: this.getIdDest(config, nfeData.destinatario),
          cMunFG: config.codigoMunicipio || '5208707',
          tpImp: 1, // DANFE normal, Retrato
          tpEmis: 1, // Emissão normal
          cDV: 0, // Será calculado automaticamente
          tpAmb: config.ambiente === 'producao' ? 1 : 2, // 1=Produção, 2=Homologação
          finNFe: nfeData.finalidade || 1, // 1=Normal, 2=Complementar, 3=Ajuste, 4=Devolução
          indFinal: this.isConsumidorFinal(nfeData.destinatario) ? 1 : 0,
          indPres: nfeData.indicadorPresenca || 9, // 9=Operação não presencial
          procEmi: 0, // Emissão por aplicativo do contribuinte
          verProc: '1.0.0',
          dhCont: nfeData.dataContingencia ? new Date(nfeData.dataContingencia).toISOString() : undefined,
          xJust: nfeData.justificativaContingencia || undefined
        },
        emit: {
          CNPJ: config.cnpj.replace(/\D/g, ''),
          xNome: config.razaoSocial || config.nomeFantasia,
          xFant: config.nomeFantasia,
          enderEmit: {
            xLgr: config.endereco || '',
            nro: config.numero || 'S/N',
            xCpl: config.complemento || undefined,
            xBairro: config.bairro || '',
            cMun: config.codigoMunicipio || '5208707',
            xMun: config.cidade || 'Goiânia',
            UF: config.uf || 'GO',
            CEP: config.cep ? config.cep.replace(/\D/g, '') : '',
            cPais: 1058,
            xPais: 'Brasil',
            fone: config.telefone ? config.telefone.replace(/\D/g, '') : undefined
          },
          IE: config.inscricaoEstadual || '',
          IEST: config.inscricaoEstadualST || undefined,
          IM: config.inscricaoMunicipal || undefined,
          CNAE: config.cnae || undefined,
          CRT: this.getRegimeTributario(config.regimeTributario)
        },
        dest: this.prepararDestinatario(nfeData.destinatario),
        det: items,
        total: this.calcularTotais(items, desconto, frete, seguro, despesasAcessorias),
        transp: this.prepararTransporte(nfeData.transporte),
        pag: this.prepararPagamento(nfeData.pagamento, total),
        infAdic: {
          infAdFisco: nfeData.informacoesAdicionaisFisco || undefined,
          infCpl: nfeData.informacoesComplementares || undefined
        }
      };

      // Adicionar referência se for nota complementar ou de ajuste
      if (nfeData.finalidade && nfeData.finalidade !== 1 && nfeData.chaveReferencia) {
        nfeCompleta.ide.NFref = [{
          refNFe: nfeData.chaveReferencia
        }];
      }

      return nfeCompleta;

    } catch (error) {
      console.error('❌ [NFE SERVICE] Erro ao preparar dados:', error);
      throw error;
    }
  }

  /**
   * Emite uma NFe
   * @param {Object} nfeData - Dados da NFe
   * @param {string} userId - ID do usuário
   */
  async emitirNFe(nfeData, userId) {
    try {
      // Obter configurações do usuário
      const config = await configService.getConfig(userId);
      
      if (!config || !config.nfClientId || !config.nfClientSecret) {
        throw new Error('Configurações da Nuvem Fiscal não encontradas');
      }

      // Preparar dados da NFe
      const nfeCompleta = this.prepareDadosNFe(nfeData, config);

      // Emitir NFe via bridge
      const response = await this.makeRequest({
        action: 'emitir_nfe',
        clientId: config.nfClientId,
        clientSecret: config.nfClientSecret,
        nfeData: nfeCompleta,
        sandbox: config.ambiente !== 'producao'
      });

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'NFe emitida com sucesso'
        };
      } else {
        throw new Error(response.error || 'Erro desconhecido ao emitir NFe');
      }

    } catch (error) {
      console.error('❌ [NFE SERVICE] Erro ao emitir NFe:', error);
      throw error;
    }
  }

  /**
   * Consulta uma NFe pelo ID
   * @param {string} nfeId - ID da NFe
   * @param {string} userId - ID do usuário
   */
  async consultarNFe(nfeId, userId) {
    try {
      const config = await configService.getConfig(userId);
      
      const response = await this.makeRequest({
        action: 'consultar_nfe',
        clientId: config.nfClientId,
        clientSecret: config.nfClientSecret,
        nfeId: nfeId,
        sandbox: config.ambiente !== 'producao'
      });

      return response;

    } catch (error) {
      console.error('❌ [NFE SERVICE] Erro ao consultar NFe:', error);
      throw error;
    }
  }

  /**
   * Cancela uma NFe
   * @param {string} nfeId - ID da NFe
   * @param {string} justificativa - Justificativa do cancelamento
   * @param {string} userId - ID do usuário
   */
  async cancelarNFe(nfeId, justificativa, userId) {
    try {
      if (!justificativa || justificativa.length < 15) {
        throw new Error('Justificativa deve ter pelo menos 15 caracteres');
      }

      const config = await configService.getConfig(userId);
      
      const response = await this.makeRequest({
        action: 'cancelar_nfe',
        clientId: config.nfClientId,
        clientSecret: config.nfClientSecret,
        nfeId: nfeId,
        justificativa: justificativa,
        sandbox: config.ambiente !== 'producao'
      });

      return response;

    } catch (error) {
      console.error('❌ [NFE SERVICE] Erro ao cancelar NFe:', error);
      throw error;
    }
  }

  /**
   * Baixa o PDF da NFe
   * @param {string} nfeId - ID da NFe
   * @param {string} userId - ID do usuário
   */
  async baixarPdfNFe(nfeId, userId) {
    try {
      const config = await configService.getConfig(userId);
      
      const response = await this.makeRequest({
        action: 'download_pdf_nfe',
        clientId: config.nfClientId,
        clientSecret: config.nfClientSecret,
        nfeId: nfeId,
        sandbox: config.ambiente !== 'producao'
      });

      return response;

    } catch (error) {
      console.error('❌ [NFE SERVICE] Erro ao baixar PDF:', error);
      throw error;
    }
  }

  /**
   * Lista NFes com filtros
   * @param {Object} filters - Filtros de busca
   * @param {string} userId - ID do usuário
   */
  async listarNFes(filters, userId) {
    try {
      const config = await configService.getConfig(userId);
      
      const response = await this.makeRequest({
        action: 'listar_nfes',
        clientId: config.nfClientId,
        clientSecret: config.nfClientSecret,
        filters: filters,
        sandbox: config.ambiente !== 'producao'
      });

      return response;

    } catch (error) {
      console.error('❌ [NFE SERVICE] Erro ao listar NFes:', error);
      throw error;
    }
  }

  /**
   * Métodos auxiliares
   */

  prepararDestinatario(destinatario) {
    const dest = {
      xNome: destinatario.nome || destinatario.razaoSocial,
      enderDest: {
        xLgr: destinatario.endereco,
        nro: destinatario.numero || 'S/N',
        xCpl: destinatario.complemento || undefined,
        xBairro: destinatario.bairro,
        cMun: destinatario.codigoMunicipio,
        xMun: destinatario.cidade,
        UF: destinatario.uf,
        CEP: destinatario.cep ? destinatario.cep.replace(/\D/g, '') : '',
        cPais: 1058,
        xPais: 'Brasil',
        fone: destinatario.telefone ? destinatario.telefone.replace(/\D/g, '') : undefined
      },
      email: destinatario.email
    };

    if (destinatario.cnpj) {
      dest.CNPJ = destinatario.cnpj.replace(/\D/g, '');
      dest.IE = destinatario.inscricaoEstadual || '';
      dest.indIEDest = destinatario.inscricaoEstadual ? 1 : 9; // 1=Contribuinte, 9=Não contribuinte
    } else if (destinatario.cpf) {
      dest.CPF = destinatario.cpf.replace(/\D/g, '');
      dest.indIEDest = 9; // Não contribuinte
    }

    return dest;
  }

  calcularImpostos(item, config, destinatario) {
    // Implementação básica de cálculo de impostos
    // Em produção, isso deve ser mais sofisticado
    const valorProduto = item.valorUnitario * item.quantidade;
    
    return {
      ICMS: {
        ICMS00: {
          orig: item.origem || 0,
          CST: item.cstIcms || '00',
          modBC: 3,
          vBC: valorProduto,
          pICMS: item.aliquotaIcms || config.icmsRate || 0,
          vICMS: valorProduto * ((item.aliquotaIcms || config.icmsRate || 0) / 100)
        }
      },
      IPI: item.aliquotaIpi ? {
        IPITrib: {
          CST: item.cstIpi || '50',
          vBC: valorProduto,
          pIPI: item.aliquotaIpi,
          vIPI: valorProduto * (item.aliquotaIpi / 100)
        }
      } : {
        IPINT: {
          CST: '53'
        }
      },
      PIS: {
        PISAliq: {
          CST: item.cstPis || '01',
          vBC: valorProduto,
          pPIS: item.aliquotaPis || config.pisRate || 0,
          vPIS: valorProduto * ((item.aliquotaPis || config.pisRate || 0) / 100)
        }
      },
      COFINS: {
        COFINSAliq: {
          CST: item.cstCofins || '01',
          vBC: valorProduto,
          pCOFINS: item.aliquotaCofins || config.cofinsRate || 0,
          vCOFINS: valorProduto * ((item.aliquotaCofins || config.cofinsRate || 0) / 100)
        }
      }
    };
  }

  calcularTotais(items, desconto, frete, seguro, despesasAcessorias) {
    const vProd = items.reduce((sum, item) => sum + item.prod.vProd, 0);
    const vICMS = items.reduce((sum, item) => sum + (item.imposto.ICMS.ICMS00?.vICMS || 0), 0);
    const vIPI = items.reduce((sum, item) => sum + (item.imposto.IPI.IPITrib?.vIPI || 0), 0);
    const vPIS = items.reduce((sum, item) => sum + (item.imposto.PIS.PISAliq?.vPIS || 0), 0);
    const vCOFINS = items.reduce((sum, item) => sum + (item.imposto.COFINS.COFINSAliq?.vCOFINS || 0), 0);

    return {
      ICMSTot: {
        vBC: vProd,
        vICMS: vICMS,
        vICMSDeson: 0,
        vFCP: 0,
        vBCST: 0,
        vST: 0,
        vFCPST: 0,
        vFCPSTRet: 0,
        vProd: vProd,
        vFrete: frete,
        vSeg: seguro,
        vDesc: desconto,
        vII: 0,
        vIPI: vIPI,
        vIPIDevol: 0,
        vPIS: vPIS,
        vCOFINS: vCOFINS,
        vOutro: despesasAcessorias,
        vNF: vProd - desconto + frete + seguro + despesasAcessorias + vIPI,
        vTotTrib: vICMS + vIPI + vPIS + vCOFINS
      }
    };
  }

  prepararTransporte(transporte) {
    if (!transporte) {
      return { modFrete: 9 }; // Sem ocorrência de transporte
    }

    const transp = {
      modFrete: transporte.modalidade || 0 // 0=Emitente, 1=Destinatário, 2=Terceiros, 9=Sem frete
    };

    if (transporte.transportadora) {
      transp.transporta = {
        CNPJ: transporte.transportadora.cnpj ? transporte.transportadora.cnpj.replace(/\D/g, '') : undefined,
        CPF: transporte.transportadora.cpf ? transporte.transportadora.cpf.replace(/\D/g, '') : undefined,
        xNome: transporte.transportadora.nome,
        IE: transporte.transportadora.inscricaoEstadual || '',
        xEnder: transporte.transportadora.endereco || '',
        xMun: transporte.transportadora.cidade || '',
        UF: transporte.transportadora.uf || ''
      };
    }

    if (transporte.veiculo) {
      transp.veicTransp = {
        placa: transporte.veiculo.placa,
        UF: transporte.veiculo.uf,
        RNTC: transporte.veiculo.rntc || undefined
      };
    }

    if (transporte.volumes && transporte.volumes.length > 0) {
      transp.vol = transporte.volumes.map(volume => ({
        qVol: volume.quantidade || 1,
        esp: volume.especie || 'VOLUME',
        marca: volume.marca || undefined,
        nVol: volume.numeracao || undefined,
        pesoL: volume.pesoLiquido || undefined,
        pesoB: volume.pesoBruto || undefined
      }));
    }

    return transp;
  }

  prepararPagamento(pagamento, total) {
    if (!pagamento || !pagamento.formas || pagamento.formas.length === 0) {
      return {
        detPag: [{
          indPag: 0, // À vista
          tPag: '01', // Dinheiro
          vPag: total
        }]
      };
    }

    return {
      detPag: pagamento.formas.map(forma => ({
        indPag: forma.indicador || 0, // 0=À vista, 1=A prazo
        tPag: forma.tipo || '01',
        vPag: forma.valor,
        card: forma.cartao ? {
          tpIntegra: forma.cartao.tipoIntegracao || 1,
          CNPJ: forma.cartao.cnpjCredenciadora ? forma.cartao.cnpjCredenciadora.replace(/\D/g, '') : undefined,
          tBand: forma.cartao.bandeira || undefined,
          cAut: forma.cartao.autorizacao || undefined
        } : undefined
      }))
    };
  }

  // Utilitários
  getCfop(config, destinatario) {
    const mesmoEstado = config.uf === destinatario.uf;
    return mesmoEstado ? '5102' : '6102'; // Venda dentro/fora do estado
  }

  getIdDest(config, destinatario) {
    if (config.uf === destinatario.uf) return 1; // Operação interna
    if (['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].includes(destinatario.uf)) {
      return 2; // Operação interestadual
    }
    return 3; // Operação com exterior
  }

  isConsumidorFinal(destinatario) {
    return !destinatario.cnpj || !destinatario.inscricaoEstadual;
  }

  getRegimeTributario(regime) {
    const regimes = {
      'simples_nacional': 1,
      'simples_nacional_excesso': 2,
      'regime_normal': 3
    };
    return regimes[regime] || 1;
  }

  getCodigoUF(uf) {
    const ufs = {
      'AC': 12, 'AL': 17, 'AP': 16, 'AM': 23, 'BA': 29, 'CE': 23, 'DF': 53,
      'ES': 32, 'GO': 52, 'MA': 21, 'MT': 51, 'MS': 50, 'MG': 31, 'PA': 15,
      'PB': 25, 'PR': 41, 'PE': 26, 'PI': 22, 'RJ': 33, 'RN': 24, 'RS': 43,
      'RO': 11, 'RR': 14, 'SC': 42, 'SP': 35, 'SE': 28, 'TO': 17
    };
    return ufs[uf] || 52; // Goiás como padrão
  }

  gerarCodigoNumerico() {
    return Math.floor(Math.random() * 99999999).toString().padStart(8, '0');
  }

  gerarNumeroNF() {
    // Em produção, este número deve vir de uma sequência controlada
    return Math.floor(Math.random() * 999999) + 1;
  }

  /**
   * Valida se os dados da NFe estão completos
   * @param {Object} nfeData - Dados da NFe
   * @param {Object} config - Configurações
   */
  validateNFeData(nfeData, config) {
    const errors = [];

    if (!nfeData) {
      errors.push('Dados da NFe são obrigatórios');
      return { isValid: false, errors };
    }

    // Validar destinatário
    if (!nfeData.destinatario) {
      errors.push('Dados do destinatário são obrigatórios');
    } else {
      if (!nfeData.destinatario.cnpj && !nfeData.destinatario.cpf) {
        errors.push('CNPJ ou CPF do destinatário é obrigatório');
      }
      if (!nfeData.destinatario.nome && !nfeData.destinatario.razaoSocial) {
        errors.push('Nome ou razão social do destinatário é obrigatório');
      }
    }

    // Validar itens
    if (!nfeData.items || nfeData.items.length === 0) {
      errors.push('A NFe deve conter pelo menos um item');
    } else {
      nfeData.items.forEach((item, index) => {
        if (!item.descricao) {
          errors.push(`Item ${index + 1}: Descrição é obrigatória`);
        }
        if (!item.valorUnitario || item.valorUnitario <= 0) {
          errors.push(`Item ${index + 1}: Valor unitário deve ser maior que zero`);
        }
        if (!item.quantidade || item.quantidade <= 0) {
          errors.push(`Item ${index + 1}: Quantidade deve ser maior que zero`);
        }
      });
    }

    // Validar configurações
    if (!config) {
      errors.push('Configurações da empresa são obrigatórias');
    } else {
      if (!config.cnpj) errors.push('CNPJ da empresa é obrigatório');
      if (!config.razaoSocial && !config.nomeFantasia) errors.push('Razão social ou nome fantasia é obrigatório');
      if (!config.nfClientId) errors.push('Client ID da Nuvem Fiscal é obrigatório');
      if (!config.nfClientSecret) errors.push('Client Secret da Nuvem Fiscal é obrigatório');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

const nfeService = new NFEService();
export default nfeService;