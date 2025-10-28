const lookupCep = async (rawCep) => {
  const cep = String(rawCep || '').replace(/\D/g, '');
  if (cep.length !== 8) {
    throw new Error('CEP inválido');
  }
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!response.ok) {
    throw new Error('Falha na consulta de CEP');
  }
  const data = await response.json();
  if (data.erro) {
    throw new Error('CEP não encontrado');
  }
  return data;
};

export default { lookupCep };
