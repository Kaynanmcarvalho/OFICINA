/**
 * Utilitários para busca inteligente de clientes
 * Implementa algoritmos de busca fuzzy, normalização e pontuação de relevância
 */

/**
 * Normaliza uma string para busca
 * - Remove acentos
 * - Converte para minúsculas
 * - Remove caracteres especiais (exceto números e letras)
 */
export const normalizeString = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .trim();
};

/**
 * Remove caracteres não numéricos de uma string
 */
export const normalizeNumeric = (str) => {
  if (!str) return '';
  return str.replace(/\D/g, '');
};

/**
 * Calcula a distância de Levenshtein entre duas strings
 * Usado para busca fuzzy (tolerância a erros de digitação)
 */
export const levenshteinDistance = (str1, str2) => {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
};

/**
 * Calcula a similaridade entre duas strings (0 a 1)
 * 1 = idênticas, 0 = completamente diferentes
 */
export const calculateSimilarity = (str1, str2) => {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  
  const distance = levenshteinDistance(str1, str2);
  return 1 - distance / maxLen;
};

/**
 * Verifica se uma string contém outra (busca parcial)
 */
export const containsMatch = (text, search) => {
  return normalizeString(text).includes(normalizeString(search));
};

/**
 * Verifica se uma string começa com outra
 */
export const startsWithMatch = (text, search) => {
  return normalizeString(text).startsWith(normalizeString(search));
};

/**
 * Calcula a pontuação de relevância para um campo específico
 * Retorna um objeto com score e tipo de match
 */
export const calculateFieldScore = (fieldValue, searchTerm) => {
  if (!fieldValue || !searchTerm) return { score: 0, matchType: 'none' };

  const normalizedField = normalizeString(fieldValue);
  const normalizedSearch = normalizeString(searchTerm);

  // Correspondência exata
  if (normalizedField === normalizedSearch) {
    return { score: 100, matchType: 'exact' };
  }

  // Começa com o termo de busca
  if (normalizedField.startsWith(normalizedSearch)) {
    return { score: 90, matchType: 'startsWith' };
  }

  // Contém o termo de busca
  if (normalizedField.includes(normalizedSearch)) {
    // Pontuação baseada na posição do match
    const position = normalizedField.indexOf(normalizedSearch);
    const positionScore = Math.max(0, 80 - position * 2);
    return { score: positionScore, matchType: 'contains' };
  }

  // Busca fuzzy (tolerância a erros)
  const similarity = calculateSimilarity(normalizedField, normalizedSearch);
  if (similarity > 0.7) {
    return { score: similarity * 70, matchType: 'fuzzy' };
  }

  // Busca por palavras individuais
  const searchWords = normalizedSearch.split(/\s+/);
  const fieldWords = normalizedField.split(/\s+/);
  
  let wordMatches = 0;
  let totalSimilarity = 0;

  for (const searchWord of searchWords) {
    for (const fieldWord of fieldWords) {
      if (fieldWord.includes(searchWord)) {
        wordMatches++;
        totalSimilarity += 1;
      } else {
        const wordSimilarity = calculateSimilarity(fieldWord, searchWord);
        if (wordSimilarity > 0.7) {
          wordMatches++;
          totalSimilarity += wordSimilarity;
        }
      }
    }
  }

  if (wordMatches > 0) {
    const wordScore = (totalSimilarity / searchWords.length) * 60;
    return { score: wordScore, matchType: 'partial' };
  }

  return { score: 0, matchType: 'none' };
};

/**
 * Calcula a pontuação de relevância para busca numérica (telefone, CPF, CNPJ)
 */
export const calculateNumericScore = (fieldValue, searchTerm) => {
  if (!fieldValue || !searchTerm) return { score: 0, matchType: 'none' };

  const normalizedField = normalizeNumeric(fieldValue);
  const normalizedSearch = normalizeNumeric(searchTerm);

  if (!normalizedSearch) return { score: 0, matchType: 'none' };

  // Correspondência exata
  if (normalizedField === normalizedSearch) {
    return { score: 100, matchType: 'exact' };
  }

  // Começa com o termo de busca
  if (normalizedField.startsWith(normalizedSearch)) {
    return { score: 95, matchType: 'startsWith' };
  }

  // Contém o termo de busca
  if (normalizedField.includes(normalizedSearch)) {
    return { score: 85, matchType: 'contains' };
  }

  // Termina com o termo de busca (útil para telefones)
  if (normalizedField.endsWith(normalizedSearch)) {
    return { score: 80, matchType: 'endsWith' };
  }

  return { score: 0, matchType: 'none' };
};

/**
 * Busca inteligente de clientes com pontuação de relevância
 * @param {Array} clients - Lista de clientes
 * @param {string} searchTerm - Termo de busca
 * @param {Object} options - Opções de busca
 * @returns {Array} - Clientes ordenados por relevância
 */
export const smartClientSearch = (clients, searchTerm, options = {}) => {
  const {
    maxResults = 10,
    minScore = 10,
    includeScore = false
  } = options;

  if (!searchTerm || searchTerm.length < 2) {
    return [];
  }

  const results = clients.map(client => {
    let totalScore = 0;
    const matches = {};

    // Busca por nome (peso maior)
    const nameScore = calculateFieldScore(client.name, searchTerm);
    if (nameScore.score > 0) {
      totalScore += nameScore.score * 2; // Peso 2x para nome
      matches.name = nameScore;
    }

    // Busca por telefone
    const phoneScore = calculateNumericScore(client.phone, searchTerm);
    if (phoneScore.score > 0) {
      totalScore += phoneScore.score * 1.5; // Peso 1.5x para telefone
      matches.phone = phoneScore;
    }

    // Busca por CPF
    if (client.cpf) {
      const cpfScore = calculateNumericScore(client.cpf, searchTerm);
      if (cpfScore.score > 0) {
        totalScore += cpfScore.score * 1.3; // Peso 1.3x para CPF
        matches.cpf = cpfScore;
      }
    }

    // Busca por CNPJ
    if (client.cnpj) {
      const cnpjScore = calculateNumericScore(client.cnpj, searchTerm);
      if (cnpjScore.score > 0) {
        totalScore += cnpjScore.score * 1.3; // Peso 1.3x para CNPJ
        matches.cnpj = cnpjScore;
      }
    }

    // Busca por email
    if (client.email) {
      const emailScore = calculateFieldScore(client.email, searchTerm);
      if (emailScore.score > 0) {
        totalScore += emailScore.score * 0.8; // Peso 0.8x para email
        matches.email = emailScore;
      }
    }

    // Busca por veículos (placa e modelo)
    if (client.vehicles && client.vehicles.length > 0) {
      client.vehicles.forEach(vehicle => {
        if (vehicle.plate) {
          const plateScore = calculateFieldScore(vehicle.plate, searchTerm);
          if (plateScore.score > 0) {
            totalScore += plateScore.score * 1.2; // Peso 1.2x para placa
            matches.vehiclePlate = plateScore;
          }
        }
        if (vehicle.model) {
          const modelScore = calculateFieldScore(vehicle.model, searchTerm);
          if (modelScore.score > 0) {
            totalScore += modelScore.score * 0.9; // Peso 0.9x para modelo
            matches.vehicleModel = modelScore;
          }
        }
      });
    }

    return {
      client,
      score: totalScore,
      matches,
      hasMatch: totalScore > 0
    };
  })
  .filter(result => result.score >= minScore)
  .sort((a, b) => b.score - a.score)
  .slice(0, maxResults);

  if (includeScore) {
    return results;
  }

  return results.map(result => result.client);
};

/**
 * Destaca o termo de busca em um texto
 * Retorna um array de partes do texto com flag de highlight
 */
export const highlightMatch = (text, searchTerm) => {
  if (!text || !searchTerm) return [{ text, highlight: false }];

  const normalizedText = normalizeString(text);
  const normalizedSearch = normalizeString(searchTerm);
  
  const index = normalizedText.indexOf(normalizedSearch);
  
  if (index === -1) return [{ text, highlight: false }];

  const before = text.substring(0, index);
  const match = text.substring(index, index + searchTerm.length);
  const after = text.substring(index + searchTerm.length);

  return [
    { text: before, highlight: false },
    { text: match, highlight: true },
    { text: after, highlight: false }
  ].filter(part => part.text);
};
