import { collection, addDoc, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Serviço para controle de uso de NFe/NFCe no Firestore
 * Organiza por mês baseado no horário do Brasil (UTC-3)
 */
class NFUsageService {
  constructor() {
    this.collectionName = 'NF_usage';
  }

  /**
   * Converte data para horário do Brasil (UTC-3)
   * @param {Date} date - Data a ser convertida
   * @returns {Date} Data no horário do Brasil
   */
  toBrazilTime(date = new Date()) {
    // Criar nova data ajustada para UTC-3 (horário de Brasília)
    const brazilTime = new Date(date.getTime() - (3 * 60 * 60 * 1000));
    return brazilTime;
  }

  /**
   * Gera chave do mês no formato YYYY-MM baseado no horário do Brasil
   * @param {Date} date - Data de referência
   * @returns {string} Chave do mês (ex: "2024-01")
   */
  getMonthKey(date = new Date()) {
    const brazilDate = this.toBrazilTime(date);
    const year = brazilDate.getFullYear();
    const month = String(brazilDate.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  /**
   * Salva registro de uso de NF no Firestore
   * @param {Object} nfData - Dados da nota fiscal gerada
   * @param {Object} userData - Dados do usuário logado
   * @param {string} nfType - Tipo da NF ('nfe' ou 'nfce')
   * @returns {Promise<string>} ID do documento criado
   */
  async saveNFUsage(nfData, userData, nfType = 'nfce') {
    try {
      const now = new Date();
      const brazilTime = this.toBrazilTime(now);
      const monthKey = this.getMonthKey(now);

      // Dados do registro de uso
      const usageData = {
        // Dados da NF
        nfId: nfData.id || nfData.numero,
        nfNumber: nfData.numero,
        nfSerie: nfData.serie,
        nfType: nfType.toLowerCase(),
        nfStatus: nfData.status || 'aprovado',
        chaveAcesso: nfData.chave_acesso || nfData.chave,
        
        // Dados do usuário
        userId: userData.uid || userData.id,
        userName: userData.displayName || userData.name || userData.nome || 'Usuário não identificado',
        userEmail: userData.email || null,
        
        // Dados temporais (horário do Brasil)
        createdAt: Timestamp.fromDate(brazilTime),
        createdAtUTC: Timestamp.fromDate(now), // Manter também UTC para referência
        monthKey: monthKey,
        year: brazilTime.getFullYear(),
        month: brazilTime.getMonth() + 1,
        day: brazilTime.getDate(),
        
        // Metadados
        source: 'caixa_system',
        version: '1.0'
      };

      // Caminho: NF_usage/{monthKey}/{docId}
      const monthCollectionRef = collection(db, this.collectionName, monthKey, 'registros');
      
      // Adicionar documento na subcoleção do mês
      const docRef = await addDoc(monthCollectionRef, usageData);
      
      console.log('✅ [NF USAGE] Registro salvo:', {
        docId: docRef.id,
        monthKey,
        nfType,
        nfNumber: nfData.numero,
        userName: usageData.userName
      });

      return docRef.id;

    } catch (error) {
      console.error('❌ [NF USAGE] Erro ao salvar registro:', error);
      throw new Error(`Erro ao salvar controle de uso: ${error.message}`);
    }
  }

  /**
   * Salva estatísticas mensais (documento de resumo)
   * @param {string} monthKey - Chave do mês (YYYY-MM)
   * @param {Object} userData - Dados do usuário
   * @param {string} nfType - Tipo da NF
   */
  async updateMonthlyStats(monthKey, userData, nfType) {
    try {
      const statsDocRef = doc(db, this.collectionName, monthKey);
      
      // Dados das estatísticas mensais
      const statsData = {
        monthKey,
        year: parseInt(monthKey.split('-')[0]),
        month: parseInt(monthKey.split('-')[1]),
        lastUpdated: Timestamp.fromDate(this.toBrazilTime()),
        lastUser: {
          id: userData.uid || userData.id,
          name: userData.displayName || userData.name || userData.nome,
          email: userData.email
        }
      };

      // Usar merge para não sobrescrever dados existentes
      await setDoc(statsDocRef, statsData, { merge: true });

      console.log('📊 [NF USAGE] Estatísticas mensais atualizadas:', monthKey);

    } catch (error) {
      console.error('❌ [NF USAGE] Erro ao atualizar estatísticas:', error);
      // Não lançar erro aqui para não interromper o fluxo principal
    }
  }

  /**
   * Registra uso de NF (função principal)
   * @param {Object} nfData - Dados da nota fiscal
   * @param {Object} userData - Dados do usuário
   * @param {string} nfType - Tipo da NF ('nfe' ou 'nfce')
   */
  async registerNFUsage(nfData, userData, nfType = 'nfce') {
    try {
      // Validar dados obrigatórios
      if (!nfData || !userData) {
        throw new Error('Dados da NF e do usuário são obrigatórios');
      }

      if (!userData.uid && !userData.id) {
        throw new Error('ID do usuário é obrigatório');
      }

      const monthKey = this.getMonthKey();
      
      // Salvar registro de uso
      const docId = await this.saveNFUsage(nfData, userData, nfType);
      
      // Atualizar estatísticas mensais (não bloquear se falhar)
      await this.updateMonthlyStats(monthKey, userData, nfType);

      return {
        success: true,
        docId,
        monthKey,
        message: 'Uso de NF registrado com sucesso'
      };

    } catch (error) {
      console.error('❌ [NF USAGE] Erro ao registrar uso:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Função de conveniência para registrar NFCe
   */
  async registerNFCeUsage(nfData, userData) {
    return this.registerNFUsage(nfData, userData, 'nfce');
  }

  /**
   * Função de conveniência para registrar NFe
   */
  async registerNFeUsage(nfData, userData) {
    return this.registerNFUsage(nfData, userData, 'nfe');
  }
}

// Exportar instância única
const nfUsageService = new NFUsageService();
export default nfUsageService;