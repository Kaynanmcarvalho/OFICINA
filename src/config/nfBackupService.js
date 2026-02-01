/**
 * Serviço para backup automático de XMLs e PDFs das NFes/NFCes no Firebase Storage
 * Após gerar uma nota fiscal, automaticamente baixa e salva os arquivos
 */

import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import nuvemFiscalBridgeService from './nuvemFiscalBridgeService';
import configService from './configService';

class NFBackupService {
  constructor() {
    this.maxRetries = 3;
    this.retryDelay = 2000; // 2 segundos
  }

  /**
   * Faz backup completo de uma NFe/NFCe após sua geração
   * @param {Object} nfData - Dados da NF gerada
   * @param {string} userId - ID do usuário
   * @returns {Object} URLs dos arquivos salvos
   */
  async backupNFCompleta(nfData, userId) {
    try {
      // Obter configurações para determinar credenciais e ambiente
      const config = await configService.getConfig(userId);
      
      if (!config.nfClientId || !config.nfClientSecret) {
        throw new Error('Credenciais da Nuvem Fiscal não configuradas');
      }
      
      const ambiente = config.ambiente || 'homologacao';
      
      // Criar estrutura de pastas no Storage
      const basePath = `nfes/${userId}/${nfData.id}`;
      
      const backupResults = {
        xmlProcessado: null,
        xmlNota: null,
        pdfDanfe: null,
        errors: []
      };
      
      // 1. Backup XML Processado (com protocolo)
      try {
        const xmlProcessadoUrl = await this.backupXMLProcessado(
          config.nfClientId,
          config.nfClientSecret, 
          nfData.id,
          ambiente,
          basePath

        backupResults.xmlProcessado = xmlProcessadoUrl;
        } catch (error) {
        backupResults.errors.push(`XML Processado: ${error.message}`);
      }
      
      // 2. Backup XML Nota (sem protocolo)
      try {
        const xmlNotaUrl = await this.backupXMLNota(
          config.nfClientId,
          config.nfClientSecret,
          nfData.id,
          ambiente,
          basePath

        backupResults.xmlNota = xmlNotaUrl;
        } catch (error) {
        backupResults.errors.push(`XML Nota: ${error.message}`);
      }
      
      // 3. Backup PDF DANFE
      try {
        const pdfUrl = await this.backupPDFDanfe(
          config.nfClientId,
          config.nfClientSecret,
          nfData.id,
          ambiente,
          basePath,
          {
            logotipo: true,
            nome_fantasia: false,
            mensagem_rodape: 'Academia Play Fit II - Obrigado pela preferência!',
            largura: 80,
            margem: '2'
          }

        backupResults.pdfDanfe = pdfUrl;
        } catch (error) {
        backupResults.errors.push(`PDF DANFE: ${error.message}`);
      }
      
      return {
        success: true,
        backup: backupResults,
        message: `Backup realizado com sucesso. ${backupResults.errors.length > 0 ? `Alguns erros: ${backupResults.errors.join(', ')}` : 'Todos os arquivos salvos.'}`
      };
      
    } catch (error) {
      console.error('❌ [NF BACKUP] Erro geral no backup:', error);
      return {
        success: false,
        error: error.message,
        backup: null
      };
    }
  }

  /**
   * Faz backup do XML processado (com protocolo)
   */
  async backupXMLProcessado(clientId, clientSecret, nfeId, ambiente, basePath) {
    const result = await nuvemFiscalBridgeService.downloadXmlNfceProcessada(
      clientId,
      clientSecret,
      nfeId,
      ambiente

    if (!result.success) {
      throw new Error(result.error || 'Erro ao baixar XML processado');
    }
    
    // Upload para Firebase Storage
    const fileName = `xml_processado.xml`;
    const storageRef = ref(storage, `${basePath}/${fileName}`);
    
    // Converter string XML para blob
    const xmlBlob = new Blob([result.data], { type: 'application/xml' });
    
    await uploadBytes(storageRef, xmlBlob);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  }

  /**
   * Faz backup do XML da nota (sem protocolo)
   */
  async backupXMLNota(clientId, clientSecret, nfeId, ambiente, basePath) {
    const result = await nuvemFiscalBridgeService.downloadXmlNfceNota(
      clientId,
      clientSecret,
      nfeId,
      ambiente

    if (!result.success) {
      throw new Error(result.error || 'Erro ao baixar XML da nota');
    }
    
    // Upload para Firebase Storage
    const fileName = `xml_nota.xml`;
    const storageRef = ref(storage, `${basePath}/${fileName}`);
    
    // Converter string XML para blob
    const xmlBlob = new Blob([result.data], { type: 'application/xml' });
    
    await uploadBytes(storageRef, xmlBlob);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  }

  /**
   * Faz backup do PDF DANFE
   */
  async backupPDFDanfe(clientId, clientSecret, nfeId, ambiente, basePath, opcoes = {}) {
    const result = await nuvemFiscalBridgeService.downloadPdfDanfce(
      clientId,
      clientSecret,
      nfeId,
      opcoes,
      ambiente

    if (!result.success) {
      throw new Error(result.error || 'Erro ao baixar PDF DANFE');
    }
    
    // Upload para Firebase Storage
    const fileName = `danfe.pdf`;
    const storageRef = ref(storage, `${basePath}/${fileName}`);
    
    // Converter base64 para blob
    const byteCharacters = atob(result.data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
    
    await uploadBytes(storageRef, pdfBlob);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  }

  /**
   * Baixa arquivo do Firebase Storage
   * @param {string} url - URL do arquivo no Storage
   * @param {string} fileName - Nome do arquivo para download
   */
  async downloadFromStorage(url, fileName) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Criar link de download
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      
      return { success: true, message: 'Arquivo baixado com sucesso' };
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Lista todos os backups de um usuário
   * @param {string} userId - ID do usuário
   */
  async listarBackups(userId) {
    try {
      // Esta função pode ser implementada para listar arquivos no Storage
      // Por agora, retornamos informação sobre a estrutura
      return {
        success: true,
        message: 'Backups são salvos em: nfes/{userId}/{nfeId}/',
        estrutura: {
          xmlProcessado: 'xml_processado.xml',
          xmlNota: 'xml_nota.xml',
          pdfDanfe: 'danfe.pdf'
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Valida se um backup existe no Storage
   * @param {string} userId - ID do usuário
   * @param {string} nfeId - ID da NFe
   */
  async verificarBackupExiste(userId, nfeId) {
    try {
      const basePath = `nfes/${userId}/${nfeId}`;
      
      // Tentar verificar se arquivos existem
      const arquivos = ['xml_processado.xml', 'xml_nota.xml', 'danfe.pdf'];
      const resultados = {};
      
      for (const arquivo of arquivos) {
        try {
          const storageRef = ref(storage, `${basePath}/${arquivo}`);
          const url = await getDownloadURL(storageRef);
          resultados[arquivo] = { existe: true, url };
        } catch (error) {
          resultados[arquivo] = { existe: false, error: error.message };
        }
      }
      
      return {
        success: true,
        backup: resultados,
        nfeId: nfeId
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Exportar instância única
const nfBackupService = new NFBackupService();
export default nfBackupService;
