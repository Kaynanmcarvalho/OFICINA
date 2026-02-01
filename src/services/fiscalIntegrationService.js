/**
 * Serviço de Integração Fiscal
 * Busca configurações fiscais de /integrations
 * Valida CNPJ, certificado digital e configurações de emissão
 */

import { db } from '../config/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

class FiscalIntegrationService {
  constructor() {
    this.configCache = new Map();
    this.CACHE_TTL = 5 * 60 * 1000; // 5 minutos
  }

  /**
   * Busca configurações fiscais da empresa
   * @param {string} empresaId - ID da empresa
   * @returns {Promise<Object>} Configurações fiscais
   */
  async getFiscalConfig(empresaId) {
    try {
      // Verifica cache
      const cached = this.configCache.get(empresaId);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.data;
      }

      // Busca configurações no Firestore
      const configRef = doc(db, 'integrations', empresaId);
      const configSnap = await getDoc(configRef);

      if (!configSnap.exists()) {
        throw new Error('Configurações fiscais não encontradas. Configure em /integrations');
      }

      const config = configSnap.data();

      // Valida configurações obrigatórias
      this.validateFiscalConfig(config);

      // Armazena no cache
      this.configCache.set(empresaId, {
        data: config,
        timestamp: Date.now()
      });

      return config;
    } catch (error) {
      console.error('Erro ao buscar configurações fiscais:', error);
      throw error;
    }
  }

  /**
   * Valida se as configurações fiscais estão completas
   * @param {Object} config - Configurações fiscais
   * @throws {Error} Se configurações inválidas
   */
  validateFiscalConfig(config) {
    const errors = [];

    // Valida CNPJ
    if (!config.cnpj) {
      errors.push('CNPJ não configurado');
    }

    // Valida Razão Social
    if (!config.razaoSocial) {
      errors.push('Razão Social não configurada');
    }

    // Valida Certificado Digital
    if (!config.certificateDigital) {
      errors.push('Certificado Digital não configurado');
    } else {
      // Verifica validade do certificado
      if (config.certificateDigital.expiresAt) {
        const expiryDate = new Date(config.certificateDigital.expiresAt);
        if (expiryDate < new Date()) {
          errors.push('Certificado Digital vencido. Renove em /integrations');
        }
      }

      if (!config.certificateDigital.file) {
        errors.push('Arquivo do Certificado Digital não encontrado');
      }

      if (!config.certificateDigital.password) {
        errors.push('Senha do Certificado Digital não configurada');
      }
    }

    // Valida configurações de NF-e
    if (!config.nfeConfig) {
      errors.push('Configurações de NF-e não encontradas');
    } else {
      if (!config.nfeConfig.ambiente) {
        errors.push('Ambiente de NF-e não configurado (produção/homologação)');
      }
      if (!config.nfeConfig.serie) {
        errors.push('Série da NF-e não configurada');
      }
    }

    // Valida Inscrição Estadual (obrigatória para NF-e)
    if (!config.inscricaoEstadual) {
      errors.push('Inscrição Estadual não configurada');
    }

    if (errors.length > 0) {
      throw new Error(`Configurações fiscais incompletas:\n${errors.join('\n')}`);
    }
  }

  /**
   * Valida se pode emitir NFS-e
   * @param {Object} config - Configurações fiscais
   * @returns {boolean} True se pode emitir NFS-e
   */
  canEmitNFSe(config) {
    return !!(
      config.nfseConfig &&
      config.nfseConfig.codigoMunicipio &&
      config.nfseConfig.inscricaoMunicipal

  }

  /**
   * Formata CNPJ para envio
   * @param {string} cnpj - CNPJ com ou sem formatação
   * @returns {string} CNPJ apenas números
   */
  formatCNPJ(cnpj) {
    return cnpj.replace(/\D/g, '');
  }

  /**
   * Limpa cache de configurações
   * @param {string} empresaId - ID da empresa (opcional)
   */
  clearCache(empresaId = null) {
    if (empresaId) {
      this.configCache.delete(empresaId);
    } else {
      this.configCache.clear();
    }
  }

  /**
   * Busca próximo número de NF-e
   * @param {string} empresaId - ID da empresa
   * @param {number} serie - Série da nota
   * @returns {Promise<number>} Próximo número
   */
  async getNextNFeNumber(empresaId, serie) {
    try {
      const counterRef = doc(db, 'nfeCounters', `${empresaId}_${serie}`);
      const counterSnap = await getDoc(counterRef);

      if (!counterSnap.exists()) {
        return 1;
      }

      return (counterSnap.data().lastNumber || 0) + 1;
    } catch (error) {
      console.error('Erro ao buscar próximo número de NF-e:', error);
      return 1;
    }
  }

  /**
   * Atualiza contador de NF-e
   * @param {string} empresaId - ID da empresa
   * @param {number} serie - Série da nota
   * @param {number} number - Número emitido
   */
  async updateNFeCounter(empresaId, serie, number) {
    try {
      const counterRef = doc(db, 'nfeCounters', `${empresaId}_${serie}`);
      await setDoc(counterRef, {
        lastNumber: number,
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      console.error('Erro ao atualizar contador de NF-e:', error);
    }
  }
}

export default new FiscalIntegrationService();
