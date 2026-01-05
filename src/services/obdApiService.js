/**
 * TORQ OBD-II API Service
 * Serviço frontend para comunicação com a API OBD do backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class OBDApiService {
  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/obd`;
    this.eventSource = null;
  }

  /**
   * Traduz erros para português
   */
  translateError(error) {
    const errorMessages = {
      'Failed to fetch': 'Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:3001',
      'NetworkError': 'Erro de rede. Verifique sua conexão com a internet e se o servidor backend está ativo.',
      'Network request failed': 'Falha na requisição de rede. O servidor pode estar offline.',
      'ECONNREFUSED': 'Conexão recusada. O servidor backend não está respondendo.',
      'ETIMEDOUT': 'Tempo de conexão esgotado. O servidor demorou muito para responder.',
      'ENOTFOUND': 'Servidor não encontrado. Verifique o endereço do servidor.',
      'timeout': 'Tempo limite excedido. A operação demorou muito.',
      'Timeout': 'Tempo limite excedido. Tente novamente.',
      'AbortError': 'Operação cancelada pelo usuário.',
      'TypeError': 'Erro de comunicação com o servidor.',
    };

    const errorStr = error.toString();
    
    for (const [key, message] of Object.entries(errorMessages)) {
      if (errorStr.includes(key)) {
        return message;
      }
    }

    // Se o erro já está em português, retorna ele mesmo
    if (/[àáâãéêíóôõúç]/i.test(errorStr)) {
      return errorStr;
    }

    return `Erro de comunicação: ${error.message || 'Verifique se o servidor backend está rodando.'}`;
  }

  /**
   * Faz requisição HTTP
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erro HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`[OBD API] Erro em ${endpoint}:`, error.message);
      const translatedError = this.translateError(error);
      throw new Error(translatedError);
    }
  }

  /**
   * Obtém status da conexão OBD
   */
  async getStatus() {
    return this.request('/status');
  }

  /**
   * Lista portas seriais disponíveis
   */
  async listPorts() {
    return this.request('/ports');
  }

  /**
   * Conecta ao dispositivo OBD-II
   * @param {Object} options
   * @param {string} options.type - 'serial' | 'wifi' | 'bluetooth'
   * @param {string} options.port - Porta serial (ex: COM3)
   * @param {string} options.host - Host Wi-Fi (ex: 192.168.0.10)
   * @param {number} options.tcpPort - Porta TCP (padrão: 35000)
   */
  async connect(options = {}) {
    return this.request('/connect', {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  /**
   * Desconecta do dispositivo OBD-II
   */
  async disconnect() {
    return this.request('/disconnect', {
      method: 'POST',
    });
  }

  /**
   * Executa scan rápido
   * @param {Function} onProgress - Callback para progresso (opcional)
   */
  async quickScan(onProgress = null) {
    if (onProgress) {
      return this.scanWithProgress('/scan/quick', onProgress);
    }
    return this.request('/scan/quick');
  }

  /**
   * Executa scan completo
   * @param {Function} onProgress - Callback para progresso (opcional)
   */
  async fullScan(onProgress = null) {
    if (onProgress) {
      return this.scanWithProgress('/scan/full', onProgress);
    }
    return this.request('/scan/full');
  }

  /**
   * Executa scan com Server-Sent Events para progresso em tempo real
   */
  scanWithProgress(endpoint, onProgress) {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}${endpoint}`;
      
      this.eventSource = new EventSource(url);

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'result') {
            this.eventSource.close();
            this.eventSource = null;
            resolve(data);
          } else {
            onProgress(data);
          }
        } catch (error) {
          console.error('[OBD API] Erro ao parsear evento:', error);
        }
      };

      this.eventSource.onerror = () => {
        this.eventSource.close();
        this.eventSource = null;
        
        // Fallback para requisição normal se SSE falhar
        this.request(endpoint)
          .then(resolve)
          .catch(reject);
      };

      // Timeout de 60 segundos
      setTimeout(() => {
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
          reject(new Error('Timeout no scan'));
        }
      }, 60000);
    });
  }

  /**
   * Envia comando OBD personalizado
   * @param {string} command - Comando OBD (ex: '010C' para RPM)
   */
  async sendCommand(command) {
    return this.request('/command', {
      method: 'POST',
      body: JSON.stringify({ command }),
    });
  }

  /**
   * Lê PID específico
   * @param {string} pid - PID hex (ex: '0C' para RPM)
   */
  async readPID(pid) {
    return this.request(`/live/${pid}`);
  }

  /**
   * Limpa códigos de falha (DTC)
   * CUIDADO: Isso apaga os códigos da ECU!
   */
  async clearDTCs() {
    return this.request('/dtc', {
      method: 'DELETE',
    });
  }

  /**
   * Cancela operação em andamento
   */
  cancelOperation() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

// Singleton
export const obdApiService = new OBDApiService();
export default obdApiService;
