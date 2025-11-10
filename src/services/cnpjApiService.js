/**
 * CNPJ API Service - Consulta dados da empresa via CNPJ
 * 
 * Usa APIs gratuitas para buscar informações da empresa
 */
class CNPJApiService {
  constructor() {
    // APIs gratuitas disponíveis (fallback em caso de falha)
    this.apis = [
      {
        name: 'BrasilAPI',
        url: 'https://brasilapi.com.br/api/cnpj/v1/',
        format: this.formatBrasilAPI
      },
      {
        name: 'ReceitaWS',
        url: 'https://www.receitaws.com.br/v1/cnpj/',
        format: this.formatReceitaWS,
        corsProxy: true // Indica que pode precisar de proxy CORS
      }
    ];
  }

  /**
   * Normaliza CNPJ removendo caracteres especiais
   */
  normalizeCNPJ(cnpj) {
    if (!cnpj) return '';
    return cnpj.replace(/[^\d]/g, '');
  }

  /**
   * Valida formato do CNPJ
   */
  isValidCNPJ(cnpj) {
    const normalizedCNPJ = this.normalizeCNPJ(cnpj);
    if (normalizedCNPJ.length !== 14) return false;

    // Verifica se não são todos números iguais
    if (/^(\d)\1{13}$/.test(normalizedCNPJ)) return false;

    // Validação dos dígitos verificadores
    let soma = 0;
    let peso = 2;

    // Primeiro dígito
    for (let i = 11; i >= 0; i--) {
      soma += parseInt(normalizedCNPJ.charAt(i)) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    let digito1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (parseInt(normalizedCNPJ.charAt(12)) !== digito1) return false;

    // Segundo dígito
    soma = 0;
    peso = 2;
    for (let i = 12; i >= 0; i--) {
      soma += parseInt(normalizedCNPJ.charAt(i)) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    let digito2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return parseInt(normalizedCNPJ.charAt(13)) === digito2;
  }

  /**
   * Formata dados da ReceitaWS
   */
  formatReceitaWS(data) {
    if (data.status === 'ERROR') {
      throw new Error(data.message || 'CNPJ não encontrado');
    }

    return {
      cnpj: data.cnpj,
      razaoSocial: data.nome,
      nomeFantasia: data.fantasia || data.nome,
      situacao: data.situacao,
      atividade: data.atividade_principal?.[0]?.text || '',
      endereco: {
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.municipio,
        uf: data.uf,
        cep: data.cep
      },
      contato: {
        telefone: data.telefone,
        email: data.email
      },
      dataAbertura: data.abertura,
      naturezaJuridica: data.natureza_juridica,
      porte: data.porte,
      capitalSocial: data.capital_social
    };
  }

  /**
   * Formata dados da BrasilAPI
   */
  formatBrasilAPI(data) {
    // Formatar telefone se existir
    let telefone = '';
    if (data.ddd_telefone_1) {
      const ddd = data.ddd_telefone_1.substring(0, 2);
      const numero = data.ddd_telefone_1.substring(2);
      telefone = `(${ddd}) ${numero}`;
    }

    return {
      cnpj: data.cnpj,
      razaoSocial: data.razao_social || '',
      nomeFantasia: data.nome_fantasia || data.razao_social || '',
      situacao: data.descricao_situacao_cadastral || 'ATIVA',
      atividade: data.cnae_fiscal_descricao || '',
      endereco: {
        logradouro: data.logradouro || '',
        numero: data.numero || '',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        cidade: data.municipio || '',
        uf: data.uf || '',
        cep: data.cep || ''
      },
      contato: {
        telefone: telefone,
        email: data.email || ''
      },
      dataAbertura: data.data_inicio_atividade || '',
      naturezaJuridica: data.natureza_juridica || '',
      porte: data.porte || data.descricao_porte || '',
      capitalSocial: data.capital_social || 0
    };
  }

  /**
   * Consulta CNPJ em múltiplas APIs (fallback)
   */
  async consultarCNPJ(cnpj) {
    const normalizedCNPJ = this.normalizeCNPJ(cnpj);
    
    if (!this.isValidCNPJ(normalizedCNPJ)) {
      throw new Error('CNPJ inválido');
    }

    // Tenta cada API até conseguir
    for (const api of this.apis) {
      try {
        console.log(`[CNPJService] Tentando API: ${api.name}`);
        
        const response = await fetch(`${api.url}${normalizedCNPJ}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const formattedData = api.format(data);
        
        console.log(`[CNPJService] ✅ Sucesso com ${api.name}`);
        return formattedData;

      } catch (error) {
        console.warn(`[CNPJService] ❌ Falha na API ${api.name}:`, error.message);
        continue;
      }
    }

    // Se todas as APIs falharam
    throw new Error(
      'Não foi possível consultar o CNPJ no momento. Verifique o número e tente novamente.'
    );
  }

  /**
   * Formata CNPJ para exibição
   */
  formatCNPJDisplay(cnpj) {
    const normalized = this.normalizeCNPJ(cnpj);
    if (normalized.length !== 14) return cnpj;
    
    return normalized.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  }

  /**
   * Determina tipo de inscrição estadual baseado na atividade
   */
  determinarTipoInscricaoEstadual(atividade, naturezaJuridica) {
    const atividadeLower = (atividade || '').toLowerCase();
    const naturezaLower = (naturezaJuridica || '').toLowerCase();

    // MEI é sempre isento
    if (naturezaLower.includes('mei') || naturezaLower.includes('microempreendedor')) {
      return 'isento';
    }

    // Atividades que geralmente precisam de IE
    const atividadesComIE = [
      'comércio', 'venda', 'revenda', 'distribuição',
      'indústria', 'fabricação', 'produção',
      'transporte', 'logística',
      'construção', 'obras'
    ];

    const precisaIE = atividadesComIE.some(palavra => 
      atividadeLower.includes(palavra)
    );

    return precisaIE ? 'possui' : 'nao_possui';
  }
}

export const cnpjApiService = new CNPJApiService();
export default cnpjApiService;
