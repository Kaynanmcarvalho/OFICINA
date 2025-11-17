# 🚀 Passo a Passo - Deploy do Histórico Veicular

## ✅ Status Atual

- ✅ Frontend implementado e integrado no ClientCard
- ✅ Backend completo (Cloud Functions)
- ✅ Documentação completa
- ✅ Scripts de setup criados
- ⏳ Pronto para deploy

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- [ ] Node.js 18+ instalado
- [ ] Firebase CLI instalado (`npm install -g firebase-tools`)
- [ ] Conta Firebase ativa
- [ ] Projeto Firebase configurado
- [ ] Acesso ao Firebase Console

---

## 🎯 Passo 1: Verificar Ambiente

### Windows
```cmd
node --version
npm --version
firebase --version
```

### Linux/Mac
```bash
node --version
npm --version
firebase --version
```

**Resultado esperado:**
- Node: v18.x ou superior
- npm: 9.x ou superior
- Firebase CLI: 12.x ou superior

---

## 🔐 Passo 2: Autenticar no Firebase

```bash
firebase login
```

**O que acontece:**
1. Abre navegador para login
2. Selecione sua conta Google
3. Autorize o Firebase CLI
4. Confirme sucesso no terminal

---

## 📁 Passo 3: Selecionar Projeto

```bash
firebase use --add
```

**O que fazer:**
1. Selecione seu projeto da lista
2. Digite um alias (ex: `production`)
3. Confirme a seleção

**Verificar projeto ativo:**
```bash
firebase projects:list
```

---

## 📦 Passo 4: Instalar Dependências

### Opção A: Script Automatizado (Recomendado)

**Windows:**
```cmd
setup-historico-veicular.bat
```

**Linux/Mac:**
```bash
chmod +x setup-historico-veicular.sh
./setup-historico-veicular.sh
```

### Opção B: Manual

```bash
cd functions/vehicle-history
npm install
cd ../..
```

**Verificar instalação:**
```bash
cd functions/vehicle-history
npm list --depth=0
```

---

## 🧪 Passo 5: Testar Localmente

### Teste dos Scrapers

```bash
cd functions/vehicle-history
node test-local.js
```

**Resultado esperado:**
- ✅ Recall Scraper testado
- ✅ Leilão Scraper testado
- ✅ Sinistro Scraper testado

### Teste com Emulador (Opcional)

```bash
cd functions/vehicle-history
npm run serve
```

**Acesse:** http://localhost:5001

---

## 🔒 Passo 6: Configurar Firestore Rules

### Verificar Regras Atuais

```bash
firebase firestore:rules:get
```

### Adicionar Regras do Histórico Veicular

**Opção A: Automático (se usou script)**
- Já foi adicionado automaticamente

**Opção B: Manual**

1. Abra `firestore.rules`
2. Adicione as regras:

```javascript
// Histórico Veicular
match /vehicle_history/{historyId} {
  allow read: if request.auth != null && 
    historyId.matches('^' + request.auth.token.empresaId + '_.*');
  allow write: if false;
}

match /rate_limits/{userId} {
  allow read, write: if false;
}
```

### Deploy das Regras

```bash
firebase deploy --only firestore:rules
```

**Verificar:**
```bash
firebase firestore:rules:get
```

---

## ☁️ Passo 7: Deploy da Cloud Function

### Deploy Completo

```bash
cd functions/vehicle-history
npm run deploy
```

**OU**

```bash
firebase deploy --only functions:getVehicleHistory
```

**Tempo estimado:** 2-5 minutos

**Resultado esperado:**
```
✔ functions[getVehicleHistory(us-central1)] Successful update operation.
Function URL: https://us-central1-SEU-PROJETO.cloudfunctions.net/getVehicleHistory
```

### Verificar Deploy

```bash
firebase functions:list
```

**Deve aparecer:**
- ✅ getVehicleHistory (us-central1)

---

## 📊 Passo 8: Criar Índices do Firestore

### Acessar Firebase Console

1. Abra: https://console.firebase.google.com
2. Selecione seu projeto
3. Vá em **Firestore Database**
4. Clique em **Indexes**

### Criar Índice 1: vehicle_history

**Configuração:**
- Collection ID: `vehicle_history`
- Fields:
  - `cacheExpiry` - Ascending
  - `empresaId` - Ascending
- Query scope: Collection

**Clique em:** Create Index

### Criar Índice 2: rate_limits

**Configuração:**
- Collection ID: `rate_limits`
- Fields:
  - `lastRequest` - Ascending
- Query scope: Collection

**Clique em:** Create Index

**Tempo de criação:** 1-5 minutos

---

## 🧪 Passo 9: Testar Integração

### Teste no Console do Navegador

1. Abra sua aplicação
2. Abra DevTools (F12)
3. Vá para Console
4. Execute:

```javascript
const functions = firebase.functions();
const getHistory = functions.httpsCallable('getVehicleHistory');

// Teste com placa real
getHistory({ 
  placa: 'ABC1234', 
  empresaId: 'sua-empresa-id' 
})
.then(result => {
  console.log('✅ Sucesso!', result.data);
})
.catch(error => {
  console.error('❌ Erro:', error);
});
```

### Teste na Interface

1. Navegue para página de Clientes
2. Encontre um cliente com veículo
3. Clique no badge de histórico
4. Verifique se o modal abre
5. Confirme dados carregados

---

## 📊 Passo 10: Monitorar Logs

### Ver Logs em Tempo Real

```bash
firebase functions:log --only getVehicleHistory
```

### Ver Últimos Logs

```bash
firebase functions:log --only getVehicleHistory --limit 50
```

### Filtrar Erros

```bash
firebase functions:log --only getVehicleHistory | grep ERROR
```

---

## ✅ Passo 11: Validação Final

### Checklist de Validação

- [ ] Cloud Function deployada com sucesso
- [ ] Regras do Firestore aplicadas
- [ ] Índices criados e ativos
- [ ] Teste no console funcionou
- [ ] Badge aparece no ClientCard
- [ ] Modal abre corretamente
- [ ] Dados são carregados
- [ ] Cache funciona (segunda chamada mais rápida)
- [ ] Logs aparecem no Firebase Console
- [ ] Sem erros no console do navegador

---

## 🎯 Passo 12: Configurações Opcionais

### Ajustar Rate Limiting

**Arquivo:** `functions/vehicle-history/utils/rateLimiter.js`

```javascript
// Linha ~30
const maxRequests = 10; // Altere para 20, 30, etc.
```

**Re-deploy:**
```bash
cd functions/vehicle-history
npm run deploy
```

### Ajustar TTL do Cache

**Arquivo:** `functions/vehicle-history/index.js`

```javascript
// Linha ~200
const ttl = 24 * 60 * 60 * 1000; // 24 horas
// Altere para: 48 * 60 * 60 * 1000 (48 horas)
```

**Re-deploy:**
```bash
cd functions/vehicle-history
npm run deploy
```

---

## 🐛 Troubleshooting

### Erro: "Function not found"

**Solução:**
```bash
firebase functions:list
firebase deploy --only functions:getVehicleHistory
```

### Erro: "Permission denied"

**Solução:**
```bash
firebase firestore:rules:get
firebase deploy --only firestore:rules
```

### Erro: "Timeout"

**Solução:**
1. Verificar logs: `firebase functions:log`
2. Testar localmente: `node test-local.js`
3. Aumentar timeout se necessário

### Cache não funciona

**Solução:**
1. Verificar coleção `vehicle_history` no Firestore
2. Verificar campo `cacheExpiry`
3. Verificar índices criados

### Rate limit muito restritivo

**Solução:**
1. Editar `rateLimiter.js`
2. Aumentar `maxRequests`
3. Re-deploy

---

## 📈 Passo 13: Monitoramento Contínuo

### Configurar Alertas

1. Acesse Firebase Console
2. Vá em **Functions** > **Metrics**
3. Configure alertas para:
   - Taxa de erro > 5%
   - Latência > 60s
   - Custo diário > $10

### Métricas Importantes

**Acompanhe:**
- Invocações por dia
- Tempo médio de execução
- Taxa de erro
- Cache hit rate
- Custo mensal

**Acesse:**
https://console.firebase.google.com/project/SEU-PROJETO/functions

---

## 🎉 Passo 14: Celebrar!

### ✅ Você Completou:

- ✅ Deploy do backend
- ✅ Configuração do Firestore
- ✅ Criação de índices
- ✅ Testes de integração
- ✅ Validação completa
- ✅ Monitoramento configurado

### 🚀 Sistema em Produção!

O Histórico Veicular está agora **100% operacional** em produção!

---

## 📚 Próximos Passos

### Curto Prazo (Esta Semana)
1. [ ] Monitorar métricas diariamente
2. [ ] Coletar feedback dos usuários
3. [ ] Ajustar configurações se necessário
4. [ ] Documentar casos de uso reais

### Médio Prazo (Este Mês)
1. [ ] Adicionar mais fontes de dados
2. [ ] Implementar notificações push
3. [ ] Criar dashboard de analytics
4. [ ] Otimizar performance

### Longo Prazo (Próximos 3 Meses)
1. [ ] Integrar APIs oficiais
2. [ ] Machine Learning para predição
3. [ ] API pública para parceiros
4. [ ] App mobile dedicado

---

## 📞 Suporte

### Documentação
- [README Principal](HISTORICO_VEICULAR_README.md)
- [Quick Start](HISTORICO_VEICULAR_QUICK_START.md)
- [Backend Completo](BACKEND_HISTORICO_VEICULAR_COMPLETO.md)
- [Comandos Úteis](COMANDOS_UTEIS_HISTORICO_VEICULAR.md)

### Logs e Debug
```bash
firebase functions:log --only getVehicleHistory
```

### Firebase Console
https://console.firebase.google.com

---

## ✨ Resumo do Deploy

```
Tempo total estimado: 15-30 minutos

Passos:
1. ✅ Verificar ambiente (2 min)
2. ✅ Autenticar Firebase (1 min)
3. ✅ Selecionar projeto (1 min)
4. ✅ Instalar dependências (3 min)
5. ✅ Testar localmente (2 min)
6. ✅ Configurar Firestore Rules (2 min)
7. ✅ Deploy Cloud Function (5 min)
8. ✅ Criar índices (5 min)
9. ✅ Testar integração (3 min)
10. ✅ Monitorar logs (2 min)
11. ✅ Validação final (2 min)
12. ✅ Configurações opcionais (2 min)
13. ✅ Monitoramento (2 min)
14. ✅ Celebrar! (∞)
```

---

**Criado**: 17 de Janeiro de 2025  
**Versão**: 1.0  
**Status**: ✅ Guia Completo  

🎉 **Bom Deploy!** 🚀
