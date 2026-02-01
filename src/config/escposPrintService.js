/**
 * Serviço para impressão ESC/POS de DANFCE
 * Utiliza a API da Nuvem Fiscal para gerar comandos ESC/POS
 */

import configService from './configService';

class EscposPrintService {
  constructor() {
    this.baseUrl = 'https://api.nuvemfiscal.com.br';
    this.defaultSettings = {
      modelo: 1, // Epson por padrão
      colunas: 48, // 48 colunas para Jetway JP-800
      qrcode_lateral: false
    };
  }

  /**
   * Obtém as configurações da impressora do cache ou usa padrões
   */
  async getPrinterSettings() {
    try {
      const cached = localStorage.getItem('escpos_printer_settings');
      if (cached) {
        return JSON.parse(cached);
      }
      return this.defaultSettings;
    } catch (error) {
      return this.defaultSettings;
    }
  }

  /**
   * Salva as configurações da impressora no cache
   */
  async savePrinterSettings(settings) {
    try {
      const settingsToSave = {
        ...this.defaultSettings,
        ...settings
      };
      localStorage.setItem('escpos_printer_settings', JSON.stringify(settingsToSave));
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar configurações da impressora:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Gera comandos ESC/POS para impressão do DANFCE
   */
  async generateEscposCommands(nfceId, userId, customSettings = {}) {
    try {
      // Obter configurações do usuário
      const config = await configService.getConfig(userId);
      if (!config || !config.nfClientId || !config.nfClientSecret) {
        throw new Error('Configurações da Nuvem Fiscal não encontradas');
      }

      // Obter configurações da impressora
      const printerSettings = await this.getPrinterSettings();
      const settings = { ...printerSettings, ...customSettings };

      // Determinar URL do backend baseado no ambiente
      const isDevelopment = window.location.hostname === 'localhost';
      const backendUrl = isDevelopment 
        ? '/api'
        : 'https://backendplayfitsdkphpnuvem-fiscal-production.up.railway.app/nuvem-fiscal-bridge.php';

      // Fazer requisição para o backend
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'download_escpos_nfce',
          clientId: config.nfClientId,
          clientSecret: config.nfClientSecret,
          nfceId: nfceId,
          ambiente: config.ambiente || 'homologacao',
          opcoes: {
            modelo: settings.modelo,
            colunas: settings.colunas,
            qrcode_lateral: settings.qrcode_lateral
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro desconhecido na geração dos comandos ESC/POS');
      }

      // Converter base64 de volta para ArrayBuffer
      const binaryString = atob(result.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const escposData = bytes.buffer;
      
      return {
        success: true,
        data: escposData,
        settings,
        message: 'Comandos ESC/POS gerados com sucesso'
      };

    } catch (error) {
      console.error('❌ Erro ao gerar comandos ESC/POS:', error);
      return {
        success: false,
        error: error.message,
        message: `Erro ao gerar comandos ESC/POS: ${error.message}`
      };
    }
  }

  /**
   * Envia comandos ESC/POS para a impressora
   * Nota: Esta função depende da implementação específica da impressora
   */
  async sendToPrinter(escposData, printerName = null) {
    try {
      // Verificar se o navegador suporta Web Serial API (para impressoras USB)
      if ('serial' in navigator) {
        return await this.sendViaWebSerial(escposData);
      }
      
      // Fallback: tentar usar Web Bluetooth (para impressoras Bluetooth)
      if ('bluetooth' in navigator) {
        return await this.sendViaBluetooth(escposData);
      }

      // Se não há suporte nativo, sugerir download do arquivo
      return await this.downloadEscposFile(escposData);

    } catch (error) {
      console.error('❌ Erro ao enviar para impressora:', error);
      return {
        success: false,
        error: error.message,
        message: `Erro ao enviar para impressora: ${error.message}`
      };
    }
  }

  /**
   * Envia comandos via Web Serial API (impressoras USB)
   */
  async sendViaWebSerial(escposData) {
    try {
      // Solicitar acesso à porta serial
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      const writer = port.writable.getWriter();
      await writer.write(new Uint8Array(escposData));
      await writer.close();
      await port.close();

      return {
        success: true,
        message: 'Documento enviado para impressora USB com sucesso'
      };
    } catch (error) {
      throw new Error(`Erro na impressão USB: ${error.message}`);
    }
  }

  /**
   * Envia comandos via Web Bluetooth (impressoras Bluetooth)
   */
  async sendViaBluetooth(escposData) {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['000018f0-0000-1000-8000-00805f9b34fb'] }]
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
      const characteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');

      // Enviar dados em chunks (Bluetooth tem limite de MTU)
      const chunkSize = 20;
      const data = new Uint8Array(escposData);
      
      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        await characteristic.writeValue(chunk);
        await new Promise(resolve => setTimeout(resolve, 50)); // Pequena pausa
      }

      await server.disconnect();

      return {
        success: true,
        message: 'Documento enviado para impressora Bluetooth com sucesso'
      };
    } catch (error) {
      throw new Error(`Erro na impressão Bluetooth: ${error.message}`);
    }
  }

  /**
   * Faz download do arquivo ESC/POS para uso manual
   */
  async downloadEscposFile(escposData) {
    try {
      const blob = new Blob([escposData], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `danfce_escpos_${Date.now()}.bin`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return {
        success: true,
        message: 'Arquivo ESC/POS baixado. Envie manualmente para a impressora.'
      };
    } catch (error) {
      throw new Error(`Erro ao baixar arquivo: ${error.message}`);
    }
  }

  /**
   * Imprime DANFCE usando ESC/POS
   */
  async printDanfce(nfceId, userId, customSettings = {}) {
    try {
      // Gerar comandos ESC/POS
      const escposResult = await this.generateEscposCommands(nfceId, userId, customSettings);
      
      if (!escposResult.success) {
        return escposResult;
      }

      // Enviar para impressora
      const printResult = await this.sendToPrinter(escposResult.data);
      
      return {
        success: printResult.success,
        message: printResult.message,
        settings: escposResult.settings
      };

    } catch (error) {
      console.error('❌ Erro na impressão ESC/POS:', error);
      return {
        success: false,
        error: error.message,
        message: `Erro na impressão: ${error.message}`
      };
    }
  }

  /**
   * Lista os modelos de impressora disponíveis
   */
  getPrinterModels() {
    return [
      { id: 0, name: 'Texto' },
      { id: 1, name: 'Epson' },
      { id: 2, name: 'Bematech' },
      { id: 3, name: 'Daruma' },
      { id: 4, name: 'Vox' },
      { id: 5, name: 'Diebold' },
      { id: 6, name: 'Epson P2' },
      { id: 7, name: 'CustomPos' },
      { id: 8, name: 'Star' },
      { id: 9, name: 'Zjiang' },
      { id: 10, name: 'GPrinter' },
      { id: 11, name: 'Datecs' },
      { id: 12, name: 'Sunmi' },
      { id: 13, name: 'Externo' }
    ];
  }

  /**
   * Lista as opções de colunas comuns
   */
  getColumnOptions() {
    return [32, 40, 42, 48, 58, 80];
  }
}

// Exportar instância única
const escposPrintService = new EscposPrintService();
export default escposPrintService;