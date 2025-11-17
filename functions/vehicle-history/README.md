# 🚗 Vehicle History Cloud Functions

Sistema de Cloud Functions para consulta de histórico veicular com web scraping inteligente.

## 📋 Funcionalidades

- ✅ Consulta de recalls oficiais
- ✅ Histórico de leilões
- ✅ Indicadores de sinistros
- ✅ Cache inteligente (24h)
- ✅ Rate limiting
- ✅ Retry automático
- ✅ Logging estruturado

## 🚀 Instalação

```bash
cd functions/vehicle-history
npm install
```

## 🔧 Configuração

1. Configure o Firebase Admin SDK
2. Ajuste as variáveis de ambiente se necessário
3. Configure as regras do Firestore

## 📦 Deploy

```bash
# Deploy completo
npm run deploy

# Testar localmente
npm run serve
```

## 🧪 Testes

```bash
npm test
```

## 📊 Estrutura

```
vehicle-history/
├── index.js              # Cloud Function principal
├── scrapers/
│   ├── recallScraper.js  # Scraper de recalls
│   ├── leilaoScraper.js  # Scraper de leilões
│   └── sinistroScraper.js # Scraper de sinistros
└── utils/
    ├── cache.js          # Gerenciamento de cache
    ├── rateLimiter.js    # Rate limiting
    └── logger.js         # Sistema de logs
```

## 🔐 Segurança

- Autenticação obrigatória
- Rate limiting: 10 req/min por usuário
- Cache para reduzir carga
- Validação de entrada

## 📝 Uso

```javascript
// No frontend
const result = await firebase.functions().httpsCallable('getVehicleHistory')({
  placa: 'ABC1234',
  empresaId: 'empresa123',
  forceRefresh: false
});

console.log(result.data);
```

## 🎯 Resposta

```json
{
  "success": true,
  "cached": false,
  "data": {
    "placa": "ABC1234",
    "recalls": [...],
    "leiloes": [...],
    "sinistros": [...],
    "summary": {
      "risco": "baixo",
      "totalRecalls": 0,
      "temLeilao": false,
      "temSinistro": false
    }
  },
  "sources": {
    "recalls": { "success": true },
    "leiloes": { "success": true },
    "sinistros": { "success": true }
  }
}
```

## ⚠️ Limitações

- Timeout: 5 minutos
- Rate limit: 10 req/min
- Cache: 24 horas
- Retry: 3 tentativas

## 🔄 Manutenção

- Cache é limpo automaticamente
- Logs estruturados no Cloud Logging
- Monitoramento via Firebase Console

## 📚 Documentação

Ver documentação completa em `/HISTORICO_VEICULAR_README.md`
