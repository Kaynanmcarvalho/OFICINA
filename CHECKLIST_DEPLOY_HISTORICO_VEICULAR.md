# ✅ Checklist de Deploy - Histórico Veicular

## 📋 Use este checklist para garantir um deploy perfeito!

---

## 🎯 Pré-Deploy

### Ambiente
- [ ] Node.js 18+ instalado
- [ ] Firebase CLI instalado
- [ ] Git configurado
- [ ] Editor de código aberto

### Firebase
- [ ] Conta Firebase ativa
- [ ] Projeto Firebase criado
- [ ] Billing habilitado (Blaze Plan)
- [ ] Acesso ao Firebase Console

### Código
- [ ] Código do frontend commitado
- [ ] Código do backend commitado
- [ ] Sem erros no console
- [ ] Testes locais passando

---

## 🔐 Autenticação

- [ ] `firebase login` executado
- [ ] Conta autenticada com sucesso
- [ ] Projeto selecionado (`firebase use`)
- [ ] Projeto correto verificado (`firebase projects:list`)

---

## 📦 Instalação

### Dependências Backend
- [ ] `cd functions/vehicle-history`
- [ ] `npm install` executado
- [ ] Sem erros de instalação
- [ ] `package-lock.json` criado

### Verificação
- [ ] `npm list --depth=0` executado
- [ ] Todas as dependências instaladas:
  - [ ] firebase-admin
  - [ ] firebase-functions
  - [ ] puppeteer
  - [ ] cheerio
  - [ ] axios
  - [ ] user-agents

---

## 🧪 Testes Locais

### Scrapers
- [ ] `node test-local.js` executado
- [ ] Recall Scraper testado
- [ ] Leilão Scraper testado
- [ ] Sinistro Scraper testado
- [ ] Sem erros críticos

### Emulador (Opcional)
- [ ] `npm run serve` executado
- [ ] Emulador iniciado
- [ ] Função acessível em localhost
- [ ] Teste manual realizado

---

## 🔒 Firestore Rules

### Verificação
- [ ] `firebase firestore:rules:get` executado
- [ ] Arquivo `firestore.rules` existe
- [ ] Regras atuais revisadas

### Configuração
- [ ] Regras do `vehicle_history` adicionadas
- [ ] Regras do `rate_limits` adicionadas
- [ ] Sintaxe validada
- [ ] Sem erros de formatação

### Deploy
- [ ] `firebase deploy --only firestore:rules` executado
- [ ] Deploy bem-sucedido
- [ ] Regras ativas no Firebase Console
- [ ] Teste de permissão realizado

---

## ☁️ Cloud Function

### Deploy
- [ ] `cd functions/vehicle-history`
- [ ] `npm run deploy` executado
- [ ] Deploy iniciado
- [ ] Build concluído
- [ ] Upload concluído
- [ ] Function deployada

### Verificação
- [ ] `firebase functions:list` executado
- [ ] `getVehicleHistory` aparece na lista
- [ ] Região correta (us-central1)
- [ ] Status: deployed
- [ ] URL da function copiada

### Configuração
- [ ] Timeout: 300s (5 min)
- [ ] Memória: 1GB
- [ ] Runtime: nodejs18
- [ ] Região: us-central1

---

## 📊 Índices do Firestore

### Acesso
- [ ] Firebase Console aberto
- [ ] Projeto selecionado
- [ ] Firestore Database acessado
- [ ] Aba "Indexes" aberta

### Índice 1: vehicle_history
- [ ] Collection ID: `vehicle_history`
- [ ] Campo 1: `cacheExpiry` (Ascending)
- [ ] Campo 2: `empresaId` (Ascending)
- [ ] Query scope: Collection
- [ ] "Create Index" clicado
- [ ] Status: Building → Enabled

### Índice 2: rate_limits
- [ ] Collection ID: `rate_limits`
- [ ] Campo: `lastRequest` (Ascending)
- [ ] Query scope: Collection
- [ ] "Create Index" clicado
- [ ] Status: Building → Enabled

### Validação
- [ ] Ambos os índices com status "Enabled"
- [ ] Sem erros de criação
- [ ] Tempo de criação: < 5 minutos

---

## 🧪 Testes de Integração

### Console do Navegador
- [ ] Aplicação aberta
- [ ] DevTools aberto (F12)
- [ ] Console acessado
- [ ] Código de teste colado
- [ ] Teste executado
- [ ] Resposta recebida
- [ ] Dados corretos retornados
- [ ] Sem erros no console

### Interface do Usuário
- [ ] Página de Clientes acessada
- [ ] Cliente com veículo encontrado
- [ ] Badge de histórico visível
- [ ] Badge clicável
- [ ] Modal abre corretamente
- [ ] Dados carregam
- [ ] Tabs funcionam
- [ ] Modal fecha corretamente

### Cache
- [ ] Primeira chamada realizada (lenta)
- [ ] Segunda chamada realizada (rápida)
- [ ] Indicador "cached" aparece
- [ ] Dados consistentes
- [ ] TTL respeitado

---

## 📊 Monitoramento

### Logs
- [ ] `firebase functions:log` executado
- [ ] Logs aparecem
- [ ] Sem erros críticos
- [ ] Logs estruturados (JSON)
- [ ] Timestamps corretos

### Firebase Console
- [ ] Functions > Metrics acessado
- [ ] Gráficos carregando
- [ ] Invocações registradas
- [ ] Tempo de execução razoável
- [ ] Taxa de erro < 5%

### Alertas
- [ ] Alerta de erro configurado
- [ ] Alerta de latência configurado
- [ ] Alerta de custo configurado
- [ ] Email de notificação configurado

---

## ✅ Validação Final

### Funcionalidade
- [ ] Badge aparece nos cards
- [ ] Modal abre ao clicar
- [ ] Dados carregam corretamente
- [ ] Tabs funcionam
- [ ] Timeline renderiza
- [ ] Botão refresh funciona
- [ ] Modal fecha corretamente

### Performance
- [ ] Primeira carga < 30s
- [ ] Cache hit < 1s
- [ ] Sem travamentos
- [ ] Animações suaves
- [ ] Responsivo mobile

### Segurança
- [ ] Autenticação obrigatória
- [ ] Rate limiting ativo
- [ ] Validação de entrada
- [ ] Logs auditáveis
- [ ] Regras do Firestore ativas

### UX
- [ ] Loading states visíveis
- [ ] Mensagens de erro claras
- [ ] Feedback visual adequado
- [ ] Dark mode funciona
- [ ] Acessibilidade OK

---

## 📈 Pós-Deploy

### Documentação
- [ ] README atualizado
- [ ] CHANGELOG atualizado
- [ ] Versão incrementada
- [ ] Commits organizados
- [ ] Tags criadas

### Comunicação
- [ ] Equipe notificada
- [ ] Stakeholders informados
- [ ] Usuários comunicados
- [ ] Documentação compartilhada

### Monitoramento
- [ ] Métricas diárias configuradas
- [ ] Dashboard criado
- [ ] Alertas testados
- [ ] Backup configurado

---

## 🎉 Celebração

### Conquistas
- [ ] Deploy bem-sucedido
- [ ] Sistema em produção
- [ ] Testes passando
- [ ] Usuários satisfeitos
- [ ] Equipe feliz

### Próximos Passos
- [ ] Coletar feedback
- [ ] Monitorar métricas
- [ ] Planejar melhorias
- [ ] Documentar aprendizados

---

## 📊 Resumo do Status

```
Total de itens: 120+
Completados: ___/120
Progresso: ___%

Status: [ ] Em Progresso  [ ] Completo  [ ] Com Problemas
```

---

## 🐛 Problemas Encontrados

### Problema 1
- **Descrição:** 
- **Solução:** 
- **Status:** [ ] Resolvido  [ ] Pendente

### Problema 2
- **Descrição:** 
- **Solução:** 
- **Status:** [ ] Resolvido  [ ] Pendente

### Problema 3
- **Descrição:** 
- **Solução:** 
- **Status:** [ ] Resolvido  [ ] Pendente

---

## 📝 Notas Adicionais

```
Data do Deploy: ___/___/2025
Responsável: _______________
Tempo Total: ___ minutos
Problemas: ___
Observações:




```

---

## 📞 Contatos de Emergência

**Firebase Support:**
- https://firebase.google.com/support

**Documentação:**
- [README](HISTORICO_VEICULAR_README.md)
- [Quick Start](HISTORICO_VEICULAR_QUICK_START.md)
- [Deploy Guide](PASSO_A_PASSO_DEPLOY_HISTORICO_VEICULAR.md)

**Comandos Rápidos:**
```bash
# Ver logs
firebase functions:log --only getVehicleHistory

# Re-deploy
cd functions/vehicle-history && npm run deploy

# Verificar status
firebase functions:list
```

---

**Criado**: 17 de Janeiro de 2025  
**Versão**: 1.0  
**Última atualização**: ___/___/2025  

✅ **Use este checklist para garantir um deploy perfeito!** 🚀
