# 🚀 Guia de Deploy - Vehicle History Functions

## Pré-requisitos

1. **Firebase CLI instalado**
```bash
npm install -g firebase-tools
```

2. **Login no Firebase**
```bash
firebase login
```

3. **Projeto Firebase configurado**
```bash
firebase use --add
```

## 📦 Instalação de Dependências

```bash
cd functions/vehicle-history
npm install
```

## 🧪 Testes Locais

### Teste dos Scrapers
```bash
node test-local.js
```

### Emulador Local
```bash
npm run serve
```

Acesse: http://localhost:5001

## 🚀 Deploy para Produção

### 1. Deploy Completo
```bash
npm run deploy
```

### 2. Deploy Apenas desta Function
```bash
firebase deploy --only functions:getVehicleHistory
```

### 3. Verificar Deploy
```bash
firebase functions:log
```

## ⚙️ Configuração do Firestore

### Regras de Segurança

Adicione ao `firestore.rules`:

```javascript
// Coleção de histórico veicular
match /vehicle_history/{historyId} {
  allow read: if request.auth != null && 
    historyId.matches('^' + request.auth.token.empresaId + '_.*');
  allow write: if false; // Apenas Cloud Functions
}

// Rate limiting
match /rate_limits/{userId} {
  allow read, write: if false; // Apenas Cloud Functions
}
```

### Índices

Crie os seguintes índices no Firestore:

1. **vehicle_history**
   - Campo: `cacheExpiry` (Ascending)
   - Campo: `empresaId` (Ascending)

2. **rate_limits**
   - Campo: `lastRequest` (Ascending)

## 🔐 Variáveis de Ambiente

Se necessário, configure variáveis:

```bash
firebase functions:config:set scraper.timeout="15000"
firebase functions:config:set scraper.retries="3"
```

## 📊 Monitoramento

### Logs em Tempo Real
```bash
firebase functions:log --only getVehicleHistory
```

### Métricas no Console
https://console.firebase.google.com/project/YOUR_PROJECT/functions

## 🔧 Troubleshooting

### Erro: "Function deployment failed"
```bash
# Limpar cache
rm -rf node_modules
npm install

# Verificar versão do Node
node --version  # Deve ser 18.x
```

### Erro: "Timeout"
- Aumentar timeout na configuração da function
- Verificar performance dos scrapers
- Considerar cache mais agressivo

### Erro: "Rate limit exceeded"
- Ajustar limites no rateLimiter.js
- Implementar backoff exponencial

## 📈 Otimizações

### 1. Cache Agressivo
```javascript
// Aumentar TTL do cache
const ttl = 48 * 60 * 60 * 1000; // 48 horas
```

### 2. Paralelização
```javascript
// Já implementado com Promise.allSettled
```

### 3. Retry Inteligente
```javascript
// Ajustar maxRetries conforme necessidade
this.maxRetries = 5;
```

## 🎯 Checklist de Deploy

- [ ] Dependências instaladas
- [ ] Testes locais passando
- [ ] Regras do Firestore configuradas
- [ ] Índices criados
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Logs verificados
- [ ] Teste end-to-end no frontend

## 📞 Suporte

Em caso de problemas:
1. Verificar logs: `firebase functions:log`
2. Testar localmente: `npm run serve`
3. Revisar documentação: `/HISTORICO_VEICULAR_README.md`

## 🔄 Atualizações

Para atualizar a function:

```bash
# 1. Fazer alterações no código
# 2. Testar localmente
npm run serve

# 3. Deploy
npm run deploy

# 4. Verificar
firebase functions:log
```

## 💡 Dicas

- Use cache sempre que possível
- Monitore os custos no Firebase Console
- Implemente alertas para erros frequentes
- Mantenha logs estruturados
- Documente mudanças no CHANGELOG
