// Serviço para comunicação com o backend local NFe
import { API_CONFIG, buildURL, makeRequest } from './apiConfig';

class BackendService {
  constructor() {
    this.isConfigured = false;
    this.currentUser = null;
  }

  // Configurar usuário atual
  setUser(user) {
    this.currentUser = user;
    return Promise.resolve();
  }

  // Verificar se o serviço está configurado
  isServiceConfigured() {
    return this.isConfigured;
  }

  // Configurar credenciais da Nuvem Fiscal no backend
  async configurarCredenciais(credenciais) {
    try {
      const url = buildURL('NFE_API', 'config');
      const response = await makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(credenciais)
      });
      
      this.isConfigured = true;
      return { success: true, data: response };
    } catch (error) {
      console.error('Erro ao configurar credenciais:', error);
      throw new Error(`Falha na configuração: ${error.message}`);
    }
  }

  // Testar conexão com a API
  async testarConexao() {
    try {
      const url = buildURL('NFE_API', 'testConnection');
      const response = await makeRequest(url, {
        method: 'POST'
      });
      
      return { success: true, message: 'Conexão estabelecida com sucesso', data: response };
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      return { success: false, message: error.message };
    }
  }

  // Emitir Nota Fiscal
  async emitirNotaFiscal(dadosNFe) {
    try {
      const url = buildURL('NFE_API', 'emitirNFe');
      const response = await makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(dadosNFe)
      });
      
      return response;
    } catch (error) {
      console.error('Erro ao emitir NFe:', error);
      throw new Error(`Falha na emissão: ${error.message}`);
    }
  }

  // Consultar Nota Fiscal
  async consultarNotaFiscal(nfeId) {
    try {
      const url = `${buildURL('NFE_API', 'consultarNFe')}/${nfeId}`;
      const response = await makeRequest(url, {
        method: 'GET'
      });
      
      return response;
    } catch (error) {
      console.error('Erro ao consultar NFe:', error);
      throw new Error(`Falha na consulta: ${error.message}`);
    }
  }

  // Cancelar Nota Fiscal
  async cancelarNotaFiscal(nfeId, motivo) {
    try {
      const url = buildURL('NFE_API', 'cancelarNFe');
      const response = await makeRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          nfe_id: nfeId,
          motivo: motivo
        })
      });
      
      return response;
    } catch (error) {
      console.error('Erro ao cancelar NFe:', error);
      throw new Error(`Falha no cancelamento: ${error.message}`);
    }
  }

  // Download XML da NFe
  async downloadXML(nfeId) {
    try {
      const url = `${buildURL('NFE_API', 'downloadXML')}/${nfeId}`;
      const blob = await makeRequest(url, {
        method: 'GET'
      });
      
      return blob;
    } catch (error) {
      console.error('Erro ao baixar XML:', error);
      throw new Error(`Falha no download do XML: ${error.message}`);
    }
  }

  // Download PDF da NFe
  async downloadPDF(nfeId) {
    try {
      const url = `${buildURL('NFE_API', 'downloadPDF')}/${nfeId}`;
      const blob = await makeRequest(url, {
        method: 'GET'
      });
      
      return blob;
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      throw new Error(`Falha no download do PDF: ${error.message}`);
    }
  }

  // Listar Notas Fiscais (usando servidor Flask na porta 8000)
  async listarNotasFiscais(params = {}) {
    try {
      const url = buildURL('NFE_API', 'listarNFes', params);
      const response = await makeRequest(url, {
        method: 'GET'
      });
      
      return response;
    } catch (error) {
      console.error('Erro ao listar NFes:', error);
      throw new Error(`Falha na listagem: ${error.message}`);
    }
  }

  // Consultar status da NFe
  async consultarStatus(nfeId) {
    try {
      const url = `${buildURL('NFE_API', 'consultarNFe')}/${nfeId}/status`;
      const response = await makeRequest(url, {
        method: 'GET'
      });
      
      return response;
    } catch (error) {
      console.error('Erro ao consultar status:', error);
      throw new Error(`Falha na consulta de status: ${error.message}`);
    }
  }

  // Download DANFE (usando Flask backend na porta 8000)
  async downloadDANFE(nfeId) {
    try {
      const url = `${buildURL('NFE_API', 'downloadPDF')}/${nfeId}`;
      const blob = await makeRequest(url, {
        method: 'GET'
      });
      
      return blob;
    } catch (error) {
      console.error('Erro ao baixar DANFE:', error);
      throw new Error(`Falha no download do DANFE: ${error.message}`);
    }
  }

  // Verificar saúde dos servidores
  async verificarServidores() {
    try {
      const healthCheck = await import('./apiConfig').then(module => module.checkServerHealth);
      return await healthCheck();
    } catch (error) {
      console.error('Erro ao verificar servidores:', error);
      return {
        nfeApi: { status: 'offline', error: error.message },
        nfeRealApi: { status: 'offline', error: error.message }
      };
    }
  }
}

// Exportar instância singleton
const backendService = new BackendService();
export default backendService;