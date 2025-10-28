/**
 * Serviço de consulta de CNPJ na Receita Federal
 * Utiliza APIs públicas para buscar dados de empresas
 */

/**
 * Consulta CNPJ na Receita Federal
 * Usa a API pública BrasilAPI como principal e ReceitaWS como fallback
 */
export const consultarCNPJ = async (cnpj) => {
  // Remove formatação do CNPJ
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  
  if (cnpjLimpo.length !== 14) {
    return {
      success: false,
      error: 'CNPJ deve ter 14 dígitos'
    };
  }

  try {
    // Tenta primeiro com BrasilAPI (mais rápida e confiável)
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);
    
    if (response.ok) {
      const data = await response.json();
      return formatarDadosBrasilAPI(data);
    }
    
    // Se BrasilAPI falhar, tenta ReceitaWS como fallback
    const responseFallback = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpjLimpo}`);
    
    if (responseFallback.ok) {
      const dataFallback = await responseFallback.json();
      
      if (dataFallback.status === 'ERROR') {
        return {
          success: false,
          error: dataFallback.message || 'CNPJ não encontrado'
        };
      }
      
      return formatarDadosReceitaWS(dataFallback);
    }
    
    return {
      success: false,
      error: 'Erro ao consultar CNPJ. Tente novamente.'
    };
    
  } catch (error) {
    console.error('[CNPJ Service] Erro ao consultar:', error);
    return {
      success: false,
      error: 'Erro ao consultar CNPJ. Verifique sua conexão.'
    };
  }
};

/**
 * Formata dados da BrasilAPI para o formato esperado
 */
const formatarDadosBrasilAPI = (data) => {
  return {
    success: true,
    data: {
      cnpj: data.cnpj,
      razaoSocial: data.razao_social || data.nome_fantasia || '',
      nomeFantasia: data.nome_fantasia || data.razao_social || '',
      dataAbertura: data.data_inicio_atividade || '',
      situacao: data.descricao_situacao_cadastral || '',
      tipo: data.descricao_tipo_de_logradouro || '',
      logradouro: data.logradouro || '',
      numero: data.numero || '',
      complemento: data.complemento || '',
      bairro: data.bairro || '',
      cidade: data.municipio || '',
      estado: data.uf || '',
      cep: data.cep ? data.cep.replace(/\D/g, '') : '',
      telefone: formatarTelefone(data.ddd_telefone_1),
      email: data.email || '',
      atividadePrincipal: data.cnae_fiscal_descricao || '',
      naturezaJuridica: data.natureza_juridica || '',
      capitalSocial: data.capital_social || 0,
      porte: data.porte || '',
      situacaoCadastral: data.descricao_situacao_cadastral || '',
      dataAtualizacao: new Date().toISOString()
    }
  };
};

/**
 * Formata dados da ReceitaWS para o formato esperado
 */
const formatarDadosReceitaWS = (data) => {
  return {
    success: true,
    data: {
      cnpj: data.cnpj,
      razaoSocial: data.nome || '',
      nomeFantasia: data.fantasia || data.nome || '',
      dataAbertura: data.abertura || '',
      situacao: data.situacao || '',
      tipo: data.tipo || '',
      logradouro: data.logradouro || '',
      numero: data.numero || '',
      complemento: data.complemento || '',
      bairro: data.bairro || '',
      cidade: data.municipio || '',
      estado: data.uf || '',
      cep: data.cep ? data.cep.replace(/\D/g, '') : '',
      telefone: data.telefone || '',
      email: data.email || '',
      atividadePrincipal: data.atividade_principal?.[0]?.text || '',
      naturezaJuridica: data.natureza_juridica || '',
      capitalSocial: data.capital_social || 0,
      porte: data.porte || '',
      situacaoCadastral: data.situacao || '',
      dataAtualizacao: new Date().toISOString()
    }
  };
};

/**
 * Formata telefone removendo caracteres especiais
 */
const formatarTelefone = (telefone) => {
  if (!telefone) return '';
  return telefone.replace(/\D/g, '');
};

/**
 * Valida se a empresa está ativa
 */
export const validarSituacaoEmpresa = (situacao) => {
  const situacoesAtivas = ['ATIVA', 'ATIVO', 'REGULAR'];
  return situacoesAtivas.some(s => 
    situacao.toUpperCase().includes(s)
  );
};

/**
 * Formata CNPJ para exibição
 */
export const formatarCNPJExibicao = (cnpj) => {
  const limpo = cnpj.replace(/\D/g, '');
  return limpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};
