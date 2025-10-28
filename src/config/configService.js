// Serviço para gerenciar configurações no Firestore
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

class ConfigService {
  constructor() {
    this.cache = new Map();
    // ID do usuário master que será usado como configurações globais
    this.MASTER_USER_ID = 'SREKQ9tRYYPnQypKp8ggRYzsDVz2';
  }

  // Obter configurações do usuário/empresa
  async getConfig(userId) {
    try {
      // Sempre usar o cache com chave do usuário master
      const cacheKey = this.MASTER_USER_ID;
      if (this.cache.has(cacheKey)) {
        console.log('📦 Usando configurações do cache (usuário master)');
        return this.cache.get(cacheKey);
      }

      // Sempre buscar configurações do usuário master
      console.log(`🔧 Carregando configurações do usuário master: ${this.MASTER_USER_ID}`);
      const masterConfigRef = doc(db, 'configuracoes', this.MASTER_USER_ID);
      const masterConfigSnap = await getDoc(masterConfigRef);
      
      if (masterConfigSnap.exists()) {
        console.log('✅ Configurações do usuário master carregadas');
        const config = masterConfigSnap.data();
        this.cache.set(cacheKey, config);
        return config;
      } else {
        // Se não existir configurações do usuário master, criar configurações padrão
        console.log('🆕 Criando configurações padrão para o usuário master');
        const defaultConfig = this.getDefaultConfig();
        await this.saveMasterConfig(defaultConfig);
        return defaultConfig;
      }
    } catch (error) {
      console.error('❌ Erro ao carregar configurações:', error);
      return this.getDefaultConfig();
    }
  }

  // Método para compatibilidade com LabelPrintModal - obtém configurações do usuário atual
  async getConfiguracoes() {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.warn('Usuário não autenticado para carregar configurações');
        const defaultConfig = this.getDefaultConfig();
        console.log('Retornando configurações padrão (usuário não autenticado):', defaultConfig);
        return defaultConfig;
      }
      
      const config = await this.getConfig(currentUser.uid);
      console.log('Configurações obtidas para usuário:', currentUser.uid, config);
      
      // Se as configurações estão vazias ou não têm as propriedades de etiqueta, usar padrão
      if (!config || !config.impressoraEtiquetas) {
        console.warn('Configurações de etiqueta não encontradas, usando padrão');
        const defaultConfig = this.getDefaultConfig();
        console.log('Configurações padrão aplicadas:', defaultConfig);
        return defaultConfig;
      }
      
      return config;
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      const defaultConfig = this.getDefaultConfig();
      console.log('Retornando configurações padrão (erro):', defaultConfig);
      return defaultConfig;
    }
  }

  // Salvar configurações no usuário master
  async saveMasterConfig(config) {
    try {
      const configRef = doc(db, 'configuracoes', this.MASTER_USER_ID);
      const configData = {
        ...config,
        updatedAt: new Date(),
        updatedBy: auth.currentUser?.uid || 'system'
      };
      
      await setDoc(configRef, configData, { merge: true });
      
      // Atualizar cache
      this.cache.set(this.MASTER_USER_ID, configData);
      
      return { success: true, message: 'Configurações salvas no usuário master!' };
    } catch (error) {
      console.error('Erro ao salvar configurações no usuário master:', error);
      return { success: false, message: 'Erro ao salvar configurações: ' + error.message };
    }
  }

  // Salvar configurações (sempre no usuário master)
  async saveConfig(userId, config) {
    try {
      // Sempre salvar nas configurações do usuário master
      console.log(`💾 Salvando configurações no usuário master: ${this.MASTER_USER_ID}`);
      const configRef = doc(db, 'configuracoes', this.MASTER_USER_ID);
      const configData = {
        ...config,
        updatedAt: new Date(),
        updatedBy: userId
      };
      
      await setDoc(configRef, configData, { merge: true });
      
      // Atualizar cache
      this.cache.set(this.MASTER_USER_ID, configData);
      
      return { success: true, message: 'Configurações salvas com sucesso!' };
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      return { success: false, message: 'Erro ao salvar configurações: ' + error.message };
    }
  }

  // Atualizar configuração específica
  async updateConfig(userId, key, value) {
    try {
      // Sempre atualizar configurações do usuário master
      console.log(`🔄 Atualizando configuração no usuário master: ${key}`);
      const configRef = doc(db, 'configuracoes', this.MASTER_USER_ID);
      const updateData = {
        [key]: value,
        updatedAt: new Date(),
        updatedBy: userId
      };
      
      await updateDoc(configRef, updateData);
      
      // Atualizar cache
      if (this.cache.has(this.MASTER_USER_ID)) {
        const cachedConfig = this.cache.get(this.MASTER_USER_ID);
        this.cache.set(this.MASTER_USER_ID, { ...cachedConfig, ...updateData });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      return { success: false, message: error.message };
    }
  }

  // Obter configurações da Nuvem Fiscal
  async getNuvemFiscalConfig(userId) {
    try {
      const config = await this.getConfig(userId);
      return {
        clientId: config.nfClientId || '',
        clientSecret: config.nfClientSecret || '',
        sandbox: config.nfSandbox !== undefined ? config.nfSandbox : true
      };
    } catch (error) {
      console.error('Erro ao obter configurações da Nuvem Fiscal:', error);
      return {
        clientId: '',
        clientSecret: '',
        sandbox: true
      };
    }
  }

  // Validar configurações da Nuvem Fiscal
  validateNuvemFiscalConfig(config) {
    const errors = [];
    
    if (!config.nfClientId || config.nfClientId.trim() === '') {
      errors.push('Client ID é obrigatório');
    }
    
    if (!config.nfClientSecret || config.nfClientSecret.trim() === '') {
      errors.push('Client Secret é obrigatório');
    }
    
    if (config.nfClientId && config.nfClientId.length < 10) {
      errors.push('Client ID deve ter pelo menos 10 caracteres');
    }
    
    if (config.nfClientSecret && config.nfClientSecret.length < 20) {
      errors.push('Client Secret deve ter pelo menos 20 caracteres');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Configurações padrão
  getDefaultConfig() {
    return {
      // Configurações Gerais
      nomeEmpresa: 'ACADEMIA PLAY FIT',
      cnpj: '',
      endereco: '',
      telefone: '',
      email: '',
      
      // Configurações de Sistema
      moedaPadrao: 'BRL',
      fusoHorario: 'America/Sao_Paulo',
      formatoData: 'DD/MM/YYYY',
      idioma: 'pt-BR',
      
      // Configurações de Vendas
      taxaEntrega: 10.00,
      descontoMaximo: 50,
      estoqueBaixo: 10,
      validadeAlerta: 30,
      
      // Configurações de Impressão
      impressoraPadrao: '',
      formatoRecibo: 'A4',
      logoRecibo: true,
      
      // Configurações de Impressão de Etiquetas (C3Tech IT-200 compatível)
      impressoraEtiquetas: 'C3Tech IT-200',
      tamanhoEtiqueta: '54x35mm',
      densidadeEtiqueta: 8,
      velocidadeEtiqueta: 2,
      tipoEtiqueta: 'termica',
      formatoEtiqueta: 'TSPL',
      margemEtiqueta: 2,
      fonteTamanho: 12,
      incluirLogo: true,
      incluirCodigoBarras: true,
      incluirPreco: true,
      incluirTamanho: true,
      
      // Configurações de Notificação
      emailVendas: true,
      emailEstoque: true,
      emailRelatorios: false,
      pushNotifications: true,
      
      // Configurações de Segurança
      sessaoTimeout: 30,
      timeoutAtivo: true,
      backupAutomatico: true,
      
      // API Configurações
      nfClientId: '',
      nfClientSecret: '',
      nfSandbox: true,
      pixKey: '',
      mercadoPagoToken: '',
      
      // Configurações de Nota Fiscal
      nfCnpj: '',
      nfRazaoSocial: '',
      nfNomeFantasia: '',
      nfInscricaoEstadual: '',
      nfRegimeTributario: 'simples_nacional', // simples_nacional, lucro_presumido, lucro_real
      nfCnae: '93.13-1-00',
      
      // Configurações de Certificado Digital
      nfCertificadoUrl: '', // URL do certificado no Firebase Storage
      nfCertificadoFileName: '', // Nome do arquivo do certificado
      nfCertificadoOriginalName: '', // Nome original do arquivo
      nfCertificadoSenha: '', // Senha do certificado (criptografada)
      nfCertificadoTipo: 'A1', // A1 ou A3
      nfLogradouro: '',
      nfNumero: '',
      nfComplemento: '',
      nfBairro: '',
      nfCidade: '',
      nfUf: '',
      nfCep: '',
      nfTelefone: '',
      nfEmail: '',
      nfCodigoMunicipio: '5201405', // Aparecida de Goiânia-GO
      nfCodigoUf: '52', // Código da UF (52=GO)
      
      // Configurações tributárias padrão
      nfNcmPadrao: '21069090',
      nfCestPadrao: '', // CEST padrão (vazio = não obrigatório)
      nfCfopPadrao: '5102',
      nfCstIcmsPadrao: '00',
      nfCsosnIcmsPadrao: '102',
      nfOrigemPadrao: 0,
      nfClassificacaoPadrao: 'A',
      
      // Configurações de numeração
      nfSerie: 1,
      nfProximoNumero: 1,
      nfNaturezaOperacao: 'Venda de mercadoria',
      
      // Configurações tributárias avançadas
      nfAliquotaIcms: 18.00, // Alíquota padrão ICMS (%)
      nfAliquotaPis: 1.65, // Alíquota PIS (%)
      nfAliquotaCofins: 7.60, // Alíquota COFINS (%)
      nfAliquotaIpi: 0.00, // Alíquota IPI (%)
      nfReducaoBaseCalculo: 0.00, // Redução base de cálculo (%)
      nfMvaIcmsSt: 0.00, // MVA ICMS ST (%)
      
      // Configurações por estado
      nfConfigEstado: {
        aliquotaInterestadual: 12.00, // Alíquota interestadual padrão
        fcp: 2.00, // Fundo de Combate à Pobreza (%)
        difal: true, // Aplicar DIFAL
        partilhaIcms: 40.00 // Partilha ICMS (%)
      },
      
      // Configurações de margem e markup
      nfMargemLucro: 30.00, // Margem de lucro padrão (%)
      nfMarkupPadrao: 1.43, // Markup padrão
      nfDescontoMaximo: 15.00, // Desconto máximo permitido (%)
      
      // Configurações de contador/contabilidade
      nfContadorNome: '',
      nfContadorCrc: '',
      nfContadorCpf: '',
      nfContadorTelefone: '',
      nfContadorEmail: '',
      nfPercentualContador: 0.00, // Percentual do contador sobre vendas (%)
      
      // Metadados
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Limpar cache
  clearCache(userId = null) {
    if (userId) {
      this.cache.delete(userId);
    } else {
      this.cache.clear();
    }
    // Sempre limpar também o cache do usuário master
    this.cache.delete(this.MASTER_USER_ID);
  }
}

// Exportar instância singleton
const configService = new ConfigService();
export default configService;