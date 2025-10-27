// API FIPE para consulta de veículos
const FIPE_API = 'https://parallelum.com.br/fipe/api/v1';

// Consultar marcas de motos
export const getMarcasMotos = async () => {
  try {
    const response = await fetch(`${FIPE_API}/motos/marcas`);
    const data = await response.json();
    return data.map(marca => ({
      value: marca.codigo,
      label: marca.nome
    }));
  } catch (error) {
    console.error('Erro ao buscar marcas:', error);
    return [];
  }
};

// Consultar modelos por marca
export const getModelosPorMarca = async (marcaCodigo) => {
  try {
    const response = await fetch(`${FIPE_API}/motos/marcas/${marcaCodigo}/modelos`);
    const data = await response.json();
    return data.modelos.map(modelo => ({
      value: modelo.codigo,
      label: modelo.nome
    }));
  } catch (error) {
    console.error('Erro ao buscar modelos:', error);
    return [];
  }
};

// Consultar anos por marca e modelo
export const getAnosPorModelo = async (marcaCodigo, modeloCodigo) => {
  try {
    const response = await fetch(`${FIPE_API}/motos/marcas/${marcaCodigo}/modelos/${modeloCodigo}/anos`);
    const data = await response.json();
    return data.map(ano => ({
      value: ano.codigo,
      label: ano.nome
    }));
  } catch (error) {
    console.error('Erro ao buscar anos:', error);
    return [];
  }
};

// Consultar detalhes completos do veículo
export const getDetalhesVeiculo = async (marcaCodigo, modeloCodigo, anoCodigo) => {
  try {
    const response = await fetch(
      `${FIPE_API}/motos/marcas/${marcaCodigo}/modelos/${modeloCodigo}/anos/${anoCodigo}`
    );
    const data = await response.json();
    return {
      marca: data.Marca,
      modelo: data.Modelo,
      ano: data.AnoModelo,
      valor: data.Valor,
      combustivel: data.Combustivel,
      codigoFipe: data.CodigoFipe
    };
  } catch (error) {
    console.error('Erro ao buscar detalhes:', error);
    return null;
  }
};

// Consultar veículo por placa (API pública - pode ter limitações)
export const consultarPlaca = async (placa) => {
  try {
    // Remove caracteres especiais da placa
    const placaLimpa = placa.replace(/[^A-Z0-9]/g, '');
    
    // API alternativa gratuita para consulta de placas
    // Nota: Esta API pode ter limitações de uso
    const response = await fetch(`https://wdapi2.com.br/consulta/${placaLimpa}/` + 'f3c4b3c5b3e4d5e6f7a8b9c0d1e2f3a4');
    
    if (!response.ok) {
      throw new Error('Placa não encontrada');
    }
    
    const data = await response.json();
    
    return {
      marca: data.MARCA || '',
      modelo: data.MODELO || '',
      ano: data.ano || '',
      cor: data.cor || '',
      anoModelo: data.anoModelo || ''
    };
  } catch (error) {
    console.error('Erro ao consultar placa:', error);
    throw new Error('Não foi possível consultar a placa. Tente preencher manualmente.');
  }
};

// Função auxiliar para formatar placa
export const formatarPlaca = (placa) => {
  const placaLimpa = placa.replace(/[^A-Z0-9]/g, '').toUpperCase();
  
  // Formato antigo: ABC-1234
  if (placaLimpa.length <= 7 && /^[A-Z]{3}[0-9]{4}$/.test(placaLimpa)) {
    return placaLimpa.replace(/^([A-Z]{3})([0-9]{4})$/, '$1-$2');
  }
  
  // Formato Mercosul: ABC1D23
  if (placaLimpa.length === 7 && /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(placaLimpa)) {
    return placaLimpa;
  }
  
  return placaLimpa.substring(0, 7);
};

// Lista de cores comuns para motos
export const coresMotos = [
  { value: 'Preta', label: 'Preta' },
  { value: 'Branca', label: 'Branca' },
  { value: 'Vermelha', label: 'Vermelha' },
  { value: 'Azul', label: 'Azul' },
  { value: 'Prata', label: 'Prata' },
  { value: 'Cinza', label: 'Cinza' },
  { value: 'Amarela', label: 'Amarela' },
  { value: 'Verde', label: 'Verde' },
  { value: 'Laranja', label: 'Laranja' },
  { value: 'Roxa', label: 'Roxa' },
  { value: 'Dourada', label: 'Dourada' },
  { value: 'Marrom', label: 'Marrom' },
  { value: 'Outra', label: 'Outra' }
];
