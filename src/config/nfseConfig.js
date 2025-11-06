/**
 * Configurações da API de NFS-e
 */

export const NFSE_CONFIG = {
  // URL base da API Railway
  API_BASE_URL: 'https://torq.up.railway.app/api/nfse',
  
  // Endpoints
  ENDPOINTS: {
    TESTAR_CONEXAO: '/testar-conexao',
    EMITIR: '/emitir',
    EMITIR_LOTE: '/emitir-lote',
    CONSULTAR: '/consultar',
    LISTAR_LOTES: '/listar-lotes'
  },
  
  // Credenciais padrão (devem ser substituídas pelas do usuário)
  DEFAULT_CLIENT_ID: 'Qn0V1xTQWXdvk2zCVJkL',
  DEFAULT_CLIENT_SECRET: 'DE65kY0SZas4j840MlJSAjZ4yRx9fmFH2tnBU9dI',
  
  // Configurações padrão
  DEFAULT_AMBIENTE: 'homologacao',
  DEFAULT_ALIQUOTA_ISS: 5.00, // 5%
  
  // Códigos de município comuns (IBGE)
  MUNICIPIOS: {
    SAO_PAULO: '3550308',
    RIO_DE_JANEIRO: '3304557',
    BELO_HORIZONTE: '3106200',
    BRASILIA: '5300108',
    GOIANIA: '5208707',
    APARECIDA_DE_GOIANIA: '5201405'
  },
  
  // Códigos de serviço padrão
  SERVICOS: {
    CONSULTORIA_TI: {
      cTribNac: '01.01',
      cTribMun: '0101',
      descricao: 'Serviços de consultoria em tecnologia da informação'
    },
    DESENVOLVIMENTO_SOFTWARE: {
      cTribNac: '01.02',
      cTribMun: '0102',
      descricao: 'Serviços de desenvolvimento de software'
    },
    MANUTENCAO: {
      cTribNac: '14.01',
      cTribMun: '1401',
      descricao: 'Serviços de manutenção e reparação'
    }
  },
  
  // Regimes tributários
  REGIMES_TRIBUTARIOS: {
    SIMPLES_NACIONAL: 6,
    SIMPLES_NACIONAL_EXCESSO: 6,
    REGIME_NORMAL: 3
  }
};

export default NFSE_CONFIG;
