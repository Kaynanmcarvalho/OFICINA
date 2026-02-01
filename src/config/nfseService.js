/**
 * Serviço para emissão de NFS-e (Nota Fiscal de Serviço Eletrônica)
 * Integração com Nuvem Fiscal API via Railway
 */

import NFSE_CONFIG from './nfseConfig';

const API_BASE_URL = NFSE_CONFIG.API_BASE_URL;

class NFSeService {
  /**
   * Emitir NFS-e individual
   */
  async emitirNFSe(clientId, clientSecret, nfseData, ambiente = 'homologacao') {
    try {
      const response = await fetch(`${API_BASE_URL}/emitir`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
          clientSecret,
          ambiente,
          nfseData
        })
      });

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          data: {
            id: result.data.id || result.data.dps_id || result.data.nfse_id,
            numero: result.data.numero,
            chave: result.data.chave_acesso || result.data.chave,
            status: result.data.status,
            protocolo: result.data.autorizacao?.numero_protocolo || result.data.protocolo,
            dataEmissao: result.data.data_emissao || new Date().toISOString(),
            ambiente: result.data.ambiente || ambiente,
            serie: result.data.serie || '1',
            modelo: '99' // Modelo NFS-e
          }
        };
      } else {
        console.error('❌ Erro ao emitir NFS-e:', result.error);
        return {
          success: false,
          error: result.error || 'Erro desconhecido ao emitir NFS-e',
          details: result.details
        };
      }
    } catch (error) {
      console.error('❌ Erro na requisição de NFS-e:', error);
      return {
        success: false,
        error: error.message || 'Erro de comunicação com a API'
      };
    }
  }

  /**
   * Emitir lote de NFS-e
   */
  async emitirLoteNFSe(clientId, clientSecret, loteData, ambiente = 'homologacao') {
    try {
      const response = await fetch(`${API_BASE_URL}/emitir-lote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
          clientSecret,
          ambiente,
          loteData
        })
      });

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          data: result.data
        };
      } else {
        console.error('❌ Erro ao emitir lote de NFS-e:', result.error);
        return {
          success: false,
          error: result.error || 'Erro desconhecido ao emitir lote de NFS-e',
          details: result.details
        };
      }
    } catch (error) {
      console.error('❌ Erro na requisição de lote de NFS-e:', error);
      return {
        success: false,
        error: error.message || 'Erro de comunicação com a API'
      };
    }
  }

  /**
   * Consultar NFS-e por ID
   */
  async consultarNFSe(clientId, clientSecret, nfseId, ambiente = 'homologacao') {
    try {
      const response = await fetch(`${API_BASE_URL}/consultar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
          clientSecret,
          ambiente,
          nfseId
        })
      });

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          data: result.data
        };
      } else {
        console.error('❌ Erro ao consultar NFS-e:', result.error);
        return {
          success: false,
          error: result.error || 'Erro desconhecido ao consultar NFS-e'
        };
      }
    } catch (error) {
      console.error('❌ Erro na requisição de consulta de NFS-e:', error);
      return {
        success: false,
        error: error.message || 'Erro de comunicação com a API'
      };
    }
  }

  /**
   * Listar lotes de NFS-e
   */
  async listarLotesNFSe(clientId, clientSecret, filters = {}, ambiente = 'homologacao') {
    try {
      const response = await fetch(`${API_BASE_URL}/listar-lotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
          clientSecret,
          ambiente,
          filters
        })
      });

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          data: result.data
        };
      } else {
        console.error('❌ Erro ao listar lotes de NFS-e:', result.error);
        return {
          success: false,
          error: result.error || 'Erro desconhecido ao listar lotes de NFS-e'
        };
      }
    } catch (error) {
      console.error('❌ Erro na requisição de listagem de lotes de NFS-e:', error);
      return {
        success: false,
        error: error.message || 'Erro de comunicação com a API'
      };
    }
  }

  /**
   * Preparar dados da NFS-e a partir dos dados da venda
   */
  async prepareDadosNFSe(saleData, config, customer) {
    const now = new Date();
    const dhEmi = now.toISOString();
    const dCompet = now.toISOString().split('T')[0];

    // Calcular valores
    const vServicos = saleData.items.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    const vDesconto = saleData.desconto || 0;
    const vTotal = vServicos - vDesconto;

    // Alíquota de ISS (exemplo: 5%)
    const pAliqISS = 5.00;
    const vISS = (vTotal * pAliqISS) / 100;
    const vLiquido = vTotal - vISS;

    return {
      provedor: 'padrao',
      ambiente: config.ambiente === 'producao' ? 'producao' : 'homologacao',
      referencia: `NFSE-${Date.now()}`,
      infDPS: {
        tpAmb: config.ambiente === 'producao' ? 1 : 2,
        dhEmi: dhEmi,
        verAplic: '1.0',
        dCompet: dCompet,
        prest: {
          CNPJ: config.cnpj?.replace(/\D/g, ''),
          regTrib: {
            regEspTrib: this.mapRegimeTributario(config.regimeTributario)
          }
        },
        toma: {
          orgaoPublico: false,
          [customer.tipoPessoa === 'juridica' ? 'CNPJ' : 'CPF']: customer.cpfCnpj?.replace(/\D/g, ''),
          xNome: customer.nome,
          end: {
            endNac: {
              cMun: customer.endereco?.codigoMunicipio || '5201405', // Código IBGE (padrão: Aparecida de Goiânia)
              CEP: customer.endereco?.cep?.replace(/\D/g, '') || ''
            },
            xLgr: customer.endereco?.logradouro || '',
            nro: customer.endereco?.numero || 'S/N',
            xBairro: customer.endereco?.bairro || ''
          },
          email: customer.email || ''
        },
        serv: {
          locPrest: {
            cLocPrestacao: customer.endereco?.codigoMunicipio || '5201405'
          },
          cServ: {
            cTribNac: '01.01', // Código de tributação nacional (ajustar conforme serviço)
            cTribMun: '0101', // Código de tributação municipal (ajustar conforme município)
            xDescServ: this.gerarDescricaoServicos(saleData.items)
          }
        },
        valores: {
          vServPrest: {
            vReceb: vTotal,
            vServ: vServicos
          },
          trib: {
            tribMun: {
              tribISSQN: 1, // 1=Tributável
              cLocIncid: customer.endereco?.codigoMunicipio || '5201405',
              vBC: vTotal,
              pAliq: pAliqISS,
              vISSQN: vISS,
              tpRetISSQN: 1, // 1=Retido pelo tomador
              vLiq: vLiquido
            }
          }
        }
      }
    };
  }

  /**
   * Mapear regime tributário
   */
  mapRegimeTributario(regime) {
    const mapeamento = {
      'simples_nacional': 6,
      'simples_nacional_excesso': 6,
      'regime_normal': 3
    };
    return mapeamento[regime] || 6;
  }

  /**
   * Gerar descrição dos serviços
   */
  gerarDescricaoServicos(items) {
    if (items.length === 1) {
      return items[0].nome;
    }
    return `Serviços diversos: ${items.map(i => i.nome).join(', ')}`;
  }

  /**
   * Testar conexão com a API
   */
  async testarConexao(clientId, clientSecret) {
    try {
      const response = await fetch(`${API_BASE_URL}/testar-conexao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
          clientSecret,
          ambiente: 'homologacao'
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Erro ao testar conexão:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

const nfseService = new NFSeService();
export default nfseService;
