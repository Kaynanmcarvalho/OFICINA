/**
 * Constantes para Inscrição Estadual
 * 
 * Tipos e situações de inscrição estadual no Brasil
 */

export const TIPOS_INSCRICAO_ESTADUAL = [
  {
    value: 'possui',
    label: 'Possui Inscrição Estadual',
    description: 'Empresa possui IE ativa (comércio, indústria, transporte)',
    icon: '✅',
    requiresNumber: true
  },
  {
    value: 'isento',
    label: 'Isento de Inscrição Estadual',
    description: 'Empresa é isenta por lei (MEI, alguns serviços)',
    icon: '🆓',
    requiresNumber: false
  },
  {
    value: 'nao_contribuinte',
    label: 'Não Contribuinte do ICMS',
    description: 'Prestação de serviços sem circulação de mercadorias',
    icon: '📋',
    requiresNumber: false
  },
  {
    value: 'produtor_rural',
    label: 'Produtor Rural',
    description: 'Produtor rural com inscrição específica',
    icon: '🌾',
    requiresNumber: true
  },
  {
    value: 'em_processo',
    label: 'Em Processo de Obtenção',
    description: 'Solicitação de IE em andamento na SEFAZ',
    icon: '⏳',
    requiresNumber: false
  }
];

export const SITUACOES_CNPJ = {
  'ATIVA': {
    label: 'Ativa',
    color: 'green',
    icon: '✅',
    canRegister: true
  },
  'SUSPENSA': {
    label: 'Suspensa',
    color: 'yellow',
    icon: '⏸️',
    canRegister: false,
    warning: 'Empresa com situação suspensa não pode ser cadastrada'
  },
  'INAPTA': {
    label: 'Inapta',
    color: 'red',
    icon: '❌',
    canRegister: false,
    warning: 'Empresa inapta não pode ser cadastrada'
  },
  'BAIXADA': {
    label: 'Baixada',
    color: 'red',
    icon: '🚫',
    canRegister: false,
    warning: 'Empresa baixada não pode ser cadastrada'
  },
  'NULA': {
    label: 'Nula',
    color: 'red',
    icon: '⚠️',
    canRegister: false,
    warning: 'Empresa com situação nula não pode ser cadastrada'
  }
};

/**
 * Determina se empresa precisa de IE baseado na atividade
 */
export const determinarTipoInscricaoEstadual = (atividade, naturezaJuridica) => {
  const atividadeLower = (atividade || '').toLowerCase();
  const naturezaLower = (naturezaJuridica || '').toLowerCase();

  // MEI é sempre isento
  if (naturezaLower.includes('mei') || naturezaLower.includes('microempreendedor')) {
    return 'isento';
  }

  // Atividades que geralmente precisam de IE
  const atividadesComIE = [
    'comércio', 'venda', 'revenda', 'distribuição', 'comercialização',
    'indústria', 'fabricação', 'produção', 'manufatura',
    'transporte', 'logística', 'frete', 'mudança',
    'construção', 'obras', 'reforma', 'engenharia'
  ];

  // Atividades que geralmente não precisam de IE
  const atividadesSemIE = [
    'consultoria', 'assessoria', 'auditoria',
    'advocacia', 'contabilidade', 'jurídico',
    'medicina', 'odontologia', 'veterinária',
    'educação', 'ensino', 'treinamento',
    'tecnologia', 'software', 'desenvolvimento',
    'marketing', 'publicidade', 'design'
  ];

  const temAtividadeComIE = atividadesComIE.some(palavra => 
    atividadeLower.includes(palavra)
  );

  const temAtividadeSemIE = atividadesSemIE.some(palavra => 
    atividadeLower.includes(palavra)
  );

  if (temAtividadeComIE) return 'possui';
  if (temAtividadeSemIE) return 'nao_contribuinte';

  // Se não conseguir determinar, retorna null para usuário escolher
  return null;
};

export default {
  TIPOS_INSCRICAO_ESTADUAL,
  SITUACOES_CNPJ,
  determinarTipoInscricaoEstadual
};
