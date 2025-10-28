/**
 * Serviço para gerenciar upload e download de certificados digitais no Firebase Storage
 */

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

class CertificateStorageService {
  constructor() {
    this.basePath = 'certificados'; // Pasta base para certificados
  }

  /**
   * Faz upload de um certificado para o Firebase Storage
   * @param {File} file - Arquivo do certificado (.p12, .pfx, .pem, etc.)
   * @param {string} userId - ID do usuário
   * @returns {Promise<string>} URL do certificado no Firebase Storage
   */
  async uploadCertificate(file, userId) {
    try {
      if (!file) {
        throw new Error('Arquivo não fornecido');
      }

      // Validar extensões permitidas para certificados
      const allowedExtensions = ['.p12', '.pfx', '.pem', '.crt', '.cer'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!allowedExtensions.includes(fileExtension)) {
        throw new Error('Tipo de arquivo não permitido. Use: .p12, .pfx, .pem, .crt ou .cer');
      }

      // Validar tamanho (máximo 10MB para certificados)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('Certificado deve ter no máximo 10MB');
      }

      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const fileName = `certificado_${userId}_${timestamp}.${extension}`;

      // Criar referência no Storage
      const certRef = ref(storage, `${this.basePath}/${fileName}`);

      // Fazer upload
      console.log('📤 Fazendo upload do certificado:', fileName);
      const snapshot = await uploadBytes(certRef, file);
      
      // Obter URL de download
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('✅ Upload do certificado concluído:', downloadURL);
      
      return {
        url: downloadURL,
        fileName: fileName,
        originalName: file.name,
        size: file.size,
        uploadedAt: new Date()
      };
    } catch (error) {
      console.error('❌ Erro no upload do certificado:', error);
      throw error;
    }
  }

  /**
   * Remove um certificado do Firebase Storage
   * @param {string} fileName - Nome do arquivo no storage
   */
  async deleteCertificate(fileName) {
    try {
      const certRef = ref(storage, `${this.basePath}/${fileName}`);
      await deleteObject(certRef);
      console.log('🗑️ Certificado removido:', fileName);
    } catch (error) {
      console.error('❌ Erro ao remover certificado:', error);
      throw error;
    }
  }

  /**
   * Gera URL de download temporária para o certificado
   * @param {string} fileName - Nome do arquivo no storage
   * @returns {Promise<string>} URL de download
   */
  async getDownloadURL(fileName) {
    try {
      const certRef = ref(storage, `${this.basePath}/${fileName}`);
      const url = await getDownloadURL(certRef);
      return url;
    } catch (error) {
      console.error('❌ Erro ao obter URL de download:', error);
      throw error;
    }
  }

  /**
   * Valida se o arquivo é um certificado válido
   * @param {File} file - Arquivo a ser validado
   * @returns {boolean} True se válido
   */
  validateCertificateFile(file) {
    if (!file) return false;
    
    const allowedExtensions = ['.p12', '.pfx', '.pem', '.crt', '.cer'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    return allowedExtensions.includes(fileExtension);
  }
}

// Exportar instância singleton
const certificateStorageService = new CertificateStorageService();
export default certificateStorageService;