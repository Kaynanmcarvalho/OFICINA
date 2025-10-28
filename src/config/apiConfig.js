// Configuração centralizada das APIs do backend

// URLs dos servidores backend locais
export const API_CONFIG = {
  // Servidor NFe principal (Flask)
  NFE_API: {
    baseURL: 'http://localhost:8000',
    endpoints: {
      config: '/api/config',
      testConnection: '/api/config/test',
      emitirNFe: '/api/nfe/emitir',
      listarNFes: '/api/nfe/listar',
      consultarNFe: '/api/nfe',
      cancelarNFe: '/api/nfe/cancelar',
      downloadXML: '/api/nfe',
      downloadPDF: '/api/nfe',
      health: '/health'
    }
  },
  
  // Servidor NFe real (servidor HTTP simples)
  NFE_REAL_API: {
    baseURL: 'http://localhost:8001',
    endpoints: {
      config: '/config',
      emitirNFe: '/nfe/emitir',
      listarNFes: '/nfe/listar',
      consultarNFe: '/nfe',
      danfe: '/nfe/danfe',
      health: '/health'
    }
  },
  
  // Headers padrão
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Timeout padrão (10 segundos)
  timeout: 10000
};

// Função helper para construir URLs completas
export const buildURL = (apiType, endpoint, params = {}) => {
  const config = API_CONFIG[apiType];
  if (!config) {
    throw new Error(`API type '${apiType}' not found in configuration`);
  }
  
  const baseURL = config.baseURL;
  const endpointPath = config.endpoints[endpoint];
  
  if (!endpointPath) {
    throw new Error(`Endpoint '${endpoint}' not found for API type '${apiType}'`);
  }
  
  let url = `${baseURL}${endpointPath}`;
  
  // Adicionar parâmetros de query se fornecidos
  if (Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;
  }
  
  return url;
};

// Função helper para fazer requisições HTTP
export const makeRequest = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      ...API_CONFIG.defaultHeaders,
      'Authorization': 'Bearer playfit-nfe-token-2024'
    },
    timeout: API_CONFIG.timeout
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };
  
  try {
    const response = await fetch(url, mergedOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.blob();
    }
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
};

// Verificar se os servidores estão rodando
export const checkServerHealth = async () => {
  const results = {};
  
  // Verificar servidor NFe principal
  try {
    const nfeUrl = buildURL('NFE_API', 'health');
    await makeRequest(nfeUrl, { method: 'GET' });
    results.nfeApi = { status: 'online', url: API_CONFIG.NFE_API.baseURL };
  } catch (error) {
    results.nfeApi = { status: 'offline', url: API_CONFIG.NFE_API.baseURL, error: error.message };
  }
  
  // Verificar servidor NFe real
  try {
    const nfeRealUrl = buildURL('NFE_REAL_API', 'health');
    await makeRequest(nfeRealUrl, { method: 'GET' });
    results.nfeRealApi = { status: 'online', url: API_CONFIG.NFE_REAL_API.baseURL };
  } catch (error) {
    results.nfeRealApi = { status: 'offline', url: API_CONFIG.NFE_REAL_API.baseURL, error: error.message };
  }
  
  return results;
};

export default API_CONFIG;