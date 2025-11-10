/**
 * CEP API Service - Consulta endereço via CEP
 * 
 * Usa APIs gratuitas para buscar informações de endereço
 */
class CEPApiService {
  constructor() {
    // APIs gratuitas disponíveis (fallback em caso de falha)
    this.apis = [
      {
        name: 'ViaCEP',
        url: 'https://viacep.com.br/ws/',
        format: this.formatViaCEP
      },
      {
        name: 'BrasilAPI',
        url: 'https://brasilapi.com.br/api/cep/v1/',
        format: this.formatBrasilAPI
      }
    ];
  }

  /**
   * Normaliza CEP removendo caracteres especiais
   */
  normalizeCEP(cep) {
    if (!cep) return '';
    return cep.replace(/[^\d]/g, '');
  }

  /**
   * Valida formato do CEP
   */
  isValidCEP(cep) {
    const normalizedCEP = this.normalizeCEP(cep);
    return /^\d{8}$/.test(normalizedCEP);
  }

  /**
   * Formata dados do ViaCEP
   */
  formatViaCEP(data) {
    if (data.erro) {
      throw new Error('CEP não encontrado');
    }

    return {
      cep: data.cep,
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      uf: data.uf,
      complemento: data.complemento || ''
    };
  }

  /**
   * Formata dados da BrasilAPI
   */
  formatBrasilAPI(data) {
    return {
      cep: data.cep,
      logradouro: data.street,
      bairro: data.neighborhood,
      cidade: data.city,
      uf: data.state,
      complemento: ''
    };
  }

  /**
   * Consulta CEP em múltiplas APIs (fallback)
   */
  async consultarCEP(cep) {
    const normalizedCEP = this.normalizeCEP(cep);
    
    if (!this.isValidCEP(normalizedCEP)) {
      throw new Error('CEP inválido');
    }

    let lastError = null;

    // Tenta cada API até conseguir
    for (const api of this.apis) {
      try {
        console.log(`[CEPService] Tentando API: ${api.name}`);
        
        const url = api.name === 'ViaCEP' 
          ? `${api.url}${normalizedCEP}/json/`
          : `${api.url}${normalizedCEP}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const formattedData = api.format(data);
        
        console.log(`[CEPService] ✅ Sucesso com ${api.name}`);
        return formattedData;

      } catch (error) {
        console.warn(`[CEPService] ❌ Falha na API ${api.name}:`, error.message);
        lastError = error;
        continue;
      }
    }

    // Se todas as APIs falharam
    throw new Error(
      lastError?.message || 'Não foi possível consultar o CEP. Tente novamente.'
    );
  }

  /**
   * Formata CEP para exibição
   */
  formatCEPDisplay(cep) {
    const normalized = this.normalizeCEP(cep);
    if (normalized.length !== 8) return cep;
    
    return normalized.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }
}

export const cepApiService = new CEPApiService();
export default cepApiService;
