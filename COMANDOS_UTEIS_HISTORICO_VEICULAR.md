# 🛠️ Comandos Úteis - Histórico Veicular

## 🚀 Setup e Instalação

### Instalação Automatizada
```bash
# Linux/Mac
chmod +x setup-historico-veicular.sh
./setup-historico-veicular.sh

# Windows
setup-historico-veicular.bat
```

### Instalação Manual
```bash
# 1. Instalar dependências
cd functions/vehicle-history
npm install

# 2. Voltar para raiz
cd ../..
```

---

## 🧪 Testes

### Testar Scrapers Localmente
```bash
cd functions/vehicle-history
node test-local.js
```

### Testar com Emulador Firebase
```bash
cd functions/vehicle-history
npm run serve
```

### Testar Cloud Function Específica
```bash
firebase emulators:start --only functions
```

---

## 🚀 Deploy

### Deploy Completo
```bash
cd functions/vehicle-history
npm run deploy
```

### Deploy Manual
```bash
firebase deploy --only functions:getVehicleHistory
```

### Deploy das Regras do Firestore
```bash
firebase deploy --only firestore:rules
```

### Deploy Tudo
```bash
firebase deploy
```

---

## 📊 Monitoramento

### Ver Logs em Tempo Real
```bash
firebase functions:log --only getVehicleHistory
```

### Ver Últimos 50 Logs
```bash
firebase functions:log --only getVehicleHistory --limit 50
```

### Ver Logs com Filtro
```bash
firebase functions:log --only getVehicleHistory | grep ERROR
```

### Ver Logs de Hoje
```bash
firebase functions:log --only getVehicleHistory --since 1d
```

---

## 🔍 Debug

### Verificar Status da Function
```bash
firebase functions:list
```

### Verificar Configuração
```bash
firebase functions:config:get
```

### Testar Localmente com Debug
```bash
cd functions/vehicle-history
node --inspect test-local.js
```

### Ver Erros Recentes
```bash
firebase functions:log --only getVehicleHistory | grep -i error
```

---

## 🗄️ Firestore

### Ver Regras Atuais
```bash
firebase firestore:rules:get
```

### Testar Regras
```bash
firebase firestore:rules:test
```

### Backup de Dados
```bash
firebase firestore:export gs://seu-bucket/backup
```

### Limpar Cache Expirado (via Console)
```javascript
// No Firebase Console > Firestore
// Executar query:
db.collection('vehicle_history')
  .where('cacheExpiry', '<', new Date())
  .get()
  .then(snapshot => {
    snapshot.forEach(doc => doc.ref.delete());
  });
```

---

## 🔧 Manutenção

### Atualizar Dependências
```bash
cd functions/vehicle-history
npm update
npm audit fix
```

### Verificar Vulnerabilidades
```bash
cd functions/vehicle-history
npm audit
```

### Limpar node_modules
```bash
cd functions/vehicle-history
rm -rf node_modules
npm install
```

### Verificar Versão do Node
```bash
node --version  # Deve ser 18.x
```

---

## 📈 Performance

### Analisar Tempo de Execução
```bash
# Ver logs com timestamp
firebase functions:log --only getVehicleHistory | grep "duration"
```

### Verificar Uso de Memória
```bash
# No Firebase Console > Functions > Metrics
# Ou via CLI:
firebase functions:log --only getVehicleHistory | grep "memory"
```

### Testar Cache
```javascript
// No console do navegador
const functions = firebase.functions();
const getHistory = functions.httpsCallable('getVehicleHistory');

// Primeira chamada (sem cache)
console.time('sem-cache');
await getHistory({ placa: 'ABC1234', empresaId: 'test' });
console.timeEnd('sem-cache');

// Segunda chamada (com cache)
console.time('com-cache');
await getHistory({ placa: 'ABC1234', empresaId: 'test' });
console.timeEnd('com-cache');
```

---

## 🔐 Segurança

### Verificar Autenticação
```bash
firebase auth:export users.json
```

### Testar Rate Limiting
```javascript
// No console do navegador
const functions = firebase.functions();
const getHistory = functions.httpsCallable('getVehicleHistory');

// Fazer 15 chamadas rápidas (limite é 10/min)
for (let i = 0; i < 15; i++) {
  getHistory({ placa: 'ABC1234', empresaId: 'test' })
    .then(r => console.log(`${i}: OK`))
    .catch(e => console.log(`${i}: ${e.message}`));
}
```

### Verificar Regras de Segurança
```bash
firebase firestore:rules:get > current-rules.txt
cat current-rules.txt
```

---

## 📦 Backup e Restore

### Backup do Código
```bash
# Criar backup
tar -czf historico-veicular-backup.tar.gz functions/vehicle-history/

# Restaurar backup
tar -xzf historico-veicular-backup.tar.gz
```

### Backup da Documentação
```bash
tar -czf docs-backup.tar.gz \
  HISTORICO_VEICULAR_*.md \
  BACKEND_HISTORICO_VEICULAR_COMPLETO.md \
  EXEMPLO_INTEGRACAO_HISTORICO_VEICULAR.md
```

---

## 🐛 Troubleshooting

### Function não encontrada
```bash
# Verificar deploy
firebase functions:list

# Re-deploy
cd functions/vehicle-history
npm run deploy
```

### Erro de permissão
```bash
# Verificar regras
firebase firestore:rules:get

# Re-deploy regras
firebase deploy --only firestore:rules
```

### Timeout
```bash
# Verificar logs
firebase functions:log --only getVehicleHistory | grep timeout

# Testar localmente
cd functions/vehicle-history
node test-local.js
```

### Cache não funciona
```javascript
// Verificar no Firestore Console
// Collection: vehicle_history
// Verificar campo: cacheExpiry
```

### Rate limit muito restritivo
```javascript
// Editar functions/vehicle-history/utils/rateLimiter.js
// Linha ~30: maxRequests = 10 -> 20
// Re-deploy
```

---

## 📊 Análise de Custos

### Ver Uso de Functions
```bash
# No Firebase Console > Functions > Usage
# Ou via gcloud:
gcloud functions list --project=seu-projeto
```

### Estimar Custos
```javascript
// Cálculo aproximado:
// - Invocações: $0.40 por milhão
// - Tempo de execução: $0.0000025 por GB-segundo
// - Rede: $0.12 por GB

// Exemplo: 10.000 consultas/dia
// - Com cache (80%): 2.000 invocações reais
// - Custo mensal: ~$5-10
```

---

## 🔄 Atualizações

### Atualizar Scrapers
```bash
# 1. Editar scrapers
cd functions/vehicle-history/scrapers
# Fazer alterações

# 2. Testar
cd ..
node test-local.js

# 3. Deploy
npm run deploy
```

### Adicionar Nova Fonte
```javascript
// 1. Criar novo scraper
// functions/vehicle-history/scrapers/novaFonteScraper.js

// 2. Adicionar ao index.js
const NovaFonteScraper = require('./scrapers/novaFonteScraper');

// 3. Adicionar à execução paralela
const scrapers = [
  scrapeRecalls(placa),
  scrapeLeiloes(placa),
  scrapeSinistros(placa),
  scrapeNovaFonte(placa) // NOVO
];

// 4. Deploy
npm run deploy
```

---

## 🎯 Comandos Rápidos

### Setup Completo
```bash
./setup-historico-veicular.sh && \
firebase deploy --only firestore:rules && \
cd functions/vehicle-history && \
npm run deploy
```

### Teste Completo
```bash
cd functions/vehicle-history && \
node test-local.js && \
npm run serve
```

### Deploy e Monitorar
```bash
cd functions/vehicle-history && \
npm run deploy && \
cd ../.. && \
firebase functions:log --only getVehicleHistory
```

### Limpar e Reinstalar
```bash
cd functions/vehicle-history && \
rm -rf node_modules package-lock.json && \
npm install && \
npm run deploy
```

---

## 📱 Comandos Mobile (React Native)

### Testar no Emulador
```bash
# Android
npx react-native run-android

# iOS
npx react-native run-ios
```

### Build de Produção
```bash
# Android
cd android && ./gradlew assembleRelease

# iOS
cd ios && xcodebuild -scheme YourApp -configuration Release
```

---

## 🔗 Links Úteis

### Firebase Console
```
https://console.firebase.google.com/project/SEU_PROJETO
```

### Functions Dashboard
```
https://console.firebase.google.com/project/SEU_PROJETO/functions
```

### Firestore Console
```
https://console.firebase.google.com/project/SEU_PROJETO/firestore
```

### Logs
```
https://console.firebase.google.com/project/SEU_PROJETO/functions/logs
```

---

## 💡 Dicas

### Desenvolvimento Local
```bash
# Use emuladores para desenvolvimento
firebase emulators:start

# Evite custos desnecessários
# Teste localmente antes de deploy
```

### Performance
```bash
# Use cache agressivamente
# Monitore tempo de execução
# Otimize scrapers lentos
```

### Segurança
```bash
# Sempre valide entrada
# Use rate limiting
# Monitore logs de erro
# Mantenha dependências atualizadas
```

---

## 📚 Documentação de Referência

- [Firebase Functions](https://firebase.google.com/docs/functions)
- [Puppeteer](https://pptr.dev/)
- [Cheerio](https://cheerio.js.org/)
- [Node.js](https://nodejs.org/docs/)

---

**Criado**: 17 de Janeiro de 2025  
**Versão**: 1.0  
**Última atualização**: 17 de Janeiro de 2025
