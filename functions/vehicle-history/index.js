/**
 * Vehicle History Cloud Functions
 * Sistema de consulta de histórico veicular
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const RecallScraper = require('./scrapers/recallScraper');
const LeilaoScraper = require('./scrapers/leilaoScraper');
const SinistroScraper = require('./scrapers/sinistroScraper');
const CacheManager = require('./utils/cache');
const RateLimiter = require('./utils/rateLimiter');
const Logger = require('./utils/logger');

// Inicializar Firebase Admin (se não foi inicializado)
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const logger = new Logger('VehicleHistory');
const cache = new CacheManager(db);
const rateLimiter = new RateLimiter(db);

/**
 * Cloud Function principal para buscar histórico veicular
 */
exports.getVehicleHistory = functions
  .region('us-central1')
  .runWith({
    timeoutSeconds: 300, // 5 minutos
    memory: '1GB'
  })
  .https.onCall(async (data, context) => {
    try {
      // Validar autenticação
      if (!context.auth) {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'Usuário deve estar autenticado'
        );
      }

      // Validar dados de entrada
      const { placa, empresaId, forceRefresh = false } = data;
      
      if (!placa || !empresaId) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Placa e empresaId são obrigatórios'
        );
      }

      // Validar formato da placa
      if (!isValidPlaca(placa)) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Formato de placa inválido'
        );
      }

      // Log da requisição
      logger.info('Iniciando consulta de histórico', {
        placa,
        empresaId,
        userId: context.auth.uid,
        forceRefresh
      });

      // Verificar rate limiting
      const rateLimitKey = `${context.auth.uid}_${empresaId}`;
      const canProceed = await rateLimiter.checkLimit(rateLimitKey, 10, 60000); // 10 req/min
      
      if (!canProceed) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          'Muitas requisições. Tente novamente em alguns minutos.'
        );
      }

      // Gerar ID do histórico
      const historyId = generateHistoryId(placa, empresaId);

      // Verificar cache se não for refresh forçado
      if (!forceRefresh) {
        const cachedHistory = await cache.get(historyId);
        if (cachedHistory && !cache.isExpired(cachedHistory)) {
          logger.info('Histórico encontrado no cache', { placa, empresaId });
          return {
            success: true,
            data: cachedHistory,
            cached: true,
            sources: {
              recalls: { success: true, cached: true },
              leiloes: { success: true, cached: true },
              sinistros: { success: true, cached: true }
            }
          };
        }
      }

      // Buscar dados frescos
      logger.info('Buscando dados frescos', { placa, empresaId });
      const freshData = await fetchFreshHistory(placa, empresaId);

      // Salvar no cache
      await cache.set(historyId, freshData);

      // Log de sucesso
      logger.info('Histórico consultado com sucesso', {
        placa,
        empresaId,
        recalls: freshData.recalls?.length || 0,
        leiloes: freshData.leiloes?.length || 0,
        sinistros: freshData.sinistros?.length || 0
      });

      return {
        success: true,
        data: freshData,
        cached: false,
        sources: freshData.sources
      };

    } catch (error) {
      logger.error('Erro ao buscar histórico', {
        error: error.message,
        stack: error.stack,
        placa: data?.placa,
        empresaId: data?.empresaId
      });

      // Se for erro conhecido, repassar
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      // Erro genérico
      throw new functions.https.HttpsError(
        'internal',
        'Erro interno do servidor'
      );
    }
  });

/**
 * Busca dados frescos de todas as fontes
 */
async function fetchFreshHistory(placa, empresaId) {
  const results = {
    placa,
    empresaId,
    recalls: [],
    leiloes: [],
    sinistros: [],
    restricoes: [],
    sources: {
      recalls: { success: false },
      leiloes: { success: false },
      sinistros: { success: false }
    },
    lastUpdate: admin.firestore.Timestamp.now(),
    cacheExpiry: calculateCacheExpiry()
  };

  // Executar scrapers em paralelo
  const scrapers = [
    scrapeRecalls(placa),
    scrapeLeiloes(placa),
    scrapeSinistros(placa)
  ];

  const scraperResults = await Promise.allSettled(scrapers);

  // Processar resultados dos recalls
  if (scraperResults[0].status === 'fulfilled') {
    results.recalls = scraperResults[0].value || [];
    results.sources.recalls = { success: true };
  } else {
    logger.error('Erro no scraper de recalls', {
      error: scraperResults[0].reason?.message,
      placa
    });
    results.sources.recalls = {
      success: false,
      error: scraperResults[0].reason?.message
    };
  }

  // Processar resultados dos leilões
  if (scraperResults[1].status === 'fulfilled') {
    results.leiloes = scraperResults[1].value || [];
    results.sources.leiloes = { success: true };
  } else {
    logger.error('Erro no scraper de leilões', {
      error: scraperResults[1].reason?.message,
      placa
    });
    results.sources.leiloes = {
      success: false,
      error: scraperResults[1].reason?.message
    };
  }

  // Processar resultados dos sinistros
  if (scraperResults[2].status === 'fulfilled') {
    results.sinistros = scraperResults[2].value || [];
    results.sources.sinistros = { success: true };
  } else {
    logger.error('Erro no scraper de sinistros', {
      error: scraperResults[2].reason?.message,
      placa
    });
    results.sources.sinistros = {
      success: false,
      error: scraperResults[2].reason?.message
    };
  }

  // Calcular resumo
  results.summary = calculateSummary(results);

  return results;
}

/**
 * Scraper de recalls
 */
async function scrapeRecalls(placa) {
  const scraper = new RecallScraper();
  return await scraper.scrape(placa);
}

/**
 * Scraper de leilões
 */
async function scrapeLeiloes(placa) {
  const scraper = new LeilaoScraper();
  return await scraper.scrape(placa);
}

/**
 * Scraper de sinistros
 */
async function scrapeSinistros(placa) {
  const scraper = new SinistroScraper();
  return await scraper.scrape(placa);
}

/**
 * Calcula resumo do histórico
 */
function calculateSummary(history) {
  const recalls = history.recalls || [];
  const leiloes = history.leiloes || [];
  const sinistros = history.sinistros || [];
  const restricoes = history.restricoes || [];

  const recallsPendentes = recalls.filter(r => r.status === 'pendente').length;
  const temLeilao = leiloes.length > 0;
  const temSinistro = sinistros.length > 0;
  const temRestricao = restricoes.filter(r => r.status === 'ativa').length > 0;

  // Calcular nível de risco
  let riskScore = 0;
  riskScore += recallsPendentes * 2;
  riskScore += leiloes.length * 3;
  riskScore += sinistros.filter(s => s.gravidade === 'alta').length * 5;
  riskScore += sinistros.filter(s => s.gravidade !== 'alta').length * 2;
  riskScore += restricoes.filter(r => r.status === 'ativa').length * 4;

  let risco = 'baixo';
  if (riskScore > 0 && riskScore <= 5) risco = 'medio';
  if (riskScore > 5) risco = 'alto';

  return {
    totalRecalls: recalls.length,
    recallsPendentes,
    temLeilao,
    temSinistro,
    temRestricao,
    risco
  };
}

/**
 * Calcula data de expiração do cache
 */
function calculateCacheExpiry() {
  // 24 horas (menor TTL)
  const ttl = 24 * 60 * 60 * 1000;
  return admin.firestore.Timestamp.fromMillis(Date.now() + ttl);
}

/**
 * Gera ID único para o histórico
 */
function generateHistoryId(placa, empresaId) {
  const cleanPlaca = placa.replace(/[^a-zA-Z0-9]/g, '');
  return `${empresaId}_${cleanPlaca}`;
}

/**
 * Valida formato da placa
 */
function isValidPlaca(placa) {
  // Formato brasileiro: ABC1234 ou ABC1D23
  const regex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
  const cleanPlaca = placa.replace(/[^A-Z0-9]/g, '').toUpperCase();
  return regex.test(cleanPlaca) && cleanPlaca.length === 7;
}
