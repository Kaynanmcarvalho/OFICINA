# ✅ Checklist de Produção - Sistema Multi-Tenant

## 🎯 Use este checklist antes de fazer deploy em produção

---

## 🔴 BLOQUEADORES (Obrigatório)

### Custom Claims
- [ ] Cloud Function `setUserClaims` criada
- [ ] Cloud Function `onUserCreate` criada
- [ ] Cloud Function `onUserUpdate` criada
- [ ] Functions deployadas (`firebase deploy --only functions`)
- [ ] Script de migração executado para usuários existentes
- [ ] Testado: Claims aparecem no token JWT
- [ ] Testado: Firestore Rules funcionam com claims
- [ ] Documentação: `SETUP_CUSTOM_CLAIMS.md` revisada

**Estimativa**: 2-4 horas
**Responsável**: _______________
**Status**: ❌ NÃO INICIADO

---

### Migração de Dados
- [ ] Backup completo do Firestore criado
- [ ] Empresa padrão criada para dados existentes
- [ ] Script de migração testado em ambiente de dev
- [ ] Coleções movidas para `/empresas/{defaultEmpresaId}`
- [ ] Documentos de usuários atualizados com empresaId
- [ ] Integridade dos dados validada (contagens)
- [ ] Rollback plan documentado
- [ ] Migração executada em produção

**Estimativa**: 4-8 horas
**Responsável**: _______________
**Status**: ❌ NÃO INICIADO

---

### Deploy de Rules e Indexes
- [ ] Firestore Rules testadas no emulator
- [ ] Firestore Indexes criados localmente
- [ ] Rules deployadas (`firebase deploy --only firestore:rules`)
- [ ] Indexes deployados (`firebase deploy --only firestore:indexes`)
- [ ] Aguardado criação de indexes (pode levar minutos)
- [ ] Testado: Queries funcionam com indexes
- [ ] Testado: Rules bloqueiam acesso não autorizado

**Estimativa**: 15-30 minutos
**Responsável**: _______________
**Status**: ❌ NÃO INICIADO

---

## 🟡 IMPORTANTES (Altamente Recomendado)

### Testes de Segurança
- [ ] Teste de isolamento entre empresas executado
- [ ] Teste de validação de empresaId executado
- [ ] Teste de Unicode injection executado
- [ ] Teste de XSS via tema executado
- [ ] Teste de memory leak executado
- [ ] Todos os testes passando
- [ ] Coverage mínimo de 80% alcançado

**Estimativa**: 2-4 horas
**Responsável**: _______________
**Status**: ❌ NÃO INICIADO

---

### Monitoring e Alertas
- [ ] Sentry ou similar configurado
- [ ] Alertas para erros críticos configurados
- [ ] Dashboard de métricas criado
- [ ] Logs de auditoria implementados
- [ ] Rate limiting configurado
- [ ] Health checks implementados

**Estimativa**: 4-8 horas
**Responsável**: _______________
**Status**: ❌ NÃO INICIADO

---

### Documentação
- [ ] README atualizado com instruções multi-tenant
- [ ] Runbook de deploy criado
- [ ] Guia de troubleshooting criado
- [ ] Procedimentos de backup documentados
- [ ] Plano de disaster recovery documentado
- [ ] Equipe treinada em novos procedimentos

**Estimativa**: 4-8 horas
**Responsável**: _______________
**Status**: ❌ NÃO INICIADO

---

## 🟢 DESEJÁVEIS (Pode ser feito depois)

### Features Adicionais
- [ ] Sistema de slug implementado
- [ ] Onboarding de novas empresas implementado
- [ ] Dashboard administrativo global implementado
- [ ] Modo offline implementado
- [ ] Integração WhatsApp completa

**Estimativa**: 40-80 horas
**Responsável**: _______________
**Status**: ❌ NÃO INICIADO

---

## 📋 Checklist de Deploy

### Pré-Deploy
- [ ] Todos os bloqueadores resolvidos
- [ ] Backup criado
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Equipe notificada
- [ ] Janela de manutenção agendada

### Durante Deploy
- [ ] Deploy de backend (functions)
- [ ] Deploy de rules e indexes
- [ ] Deploy de frontend
- [ ] Verificação de health checks
- [ ] Smoke tests executados

### Pós-Deploy
- [ ] Testes de fumaça em produção
- [ ] Monitoring ativo
- [ ] Alertas funcionando
- [ ] Equipe de plantão disponível
- [ ] Comunicado aos usuários enviado

---

## 🧪 Testes de Validação

### Teste 1: Isolamento de Dados
```javascript
// Login como empresa A
sessionStorage.setItem('empresaId', 'empresa-a');

// Tentar ler dados da empresa B
const ref = collection(db, 'empresas/empresa-b/clientes');
await getDocs(ref); // ❌ Deve falhar com permission-denied
```

**Resultado**: [ ] ✅ Passou | [ ] ❌ Falhou

---

### Teste 2: Custom Claims
```javascript
const user = auth.currentUser;
const token = await user.getIdTokenResult();
console.log('Claims:', token.claims);

// Deve mostrar: { empresaId: "...", role: "..." }
```

**Resultado**: [ ] ✅ Passou | [ ] ❌ Falhou

---

### Teste 3: Validação de empresaId
```javascript
sessionStorage.setItem('empresaId', '../../../etc/passwd');
firestoreService.getEmpresaId(); // ❌ Deve lançar erro
```

**Resultado**: [ ] ✅ Passou | [ ] ❌ Falhou

---

### Teste 4: Memory Leak
```javascript
// Adicionar 1000 placas
for (let i = 0; i < 1000; i++) {
  await placaCacheService.consultarPlaca(`ABC${i}`);
}

const stats = placaCacheService.getLocalCacheStats();
console.log('Cache size:', stats.size); // Deve ser <= 500
```

**Resultado**: [ ] ✅ Passou | [ ] ❌ Falhou

---

### Teste 5: Performance
```javascript
const start = Date.now();
await firestoreService.getAll('clientes', { limit: 50 });
const duration = Date.now() - start;
console.log('Duration:', duration); // Deve ser < 500ms
```

**Resultado**: [ ] ✅ Passou | [ ] ❌ Falhou

---

## 📊 Métricas de Sucesso

### Performance
- [ ] Latência média < 500ms
- [ ] Firestore reads reduzidos em 50%+
- [ ] Cache hit rate > 80%
- [ ] Memory usage < 100MB

### Segurança
- [ ] 0 vulnerabilidades críticas
- [ ] 100% isolamento de dados
- [ ] Todas as validações ativas
- [ ] Audit logging funcionando

### Qualidade
- [ ] Coverage de testes > 80%
- [ ] 0 erros críticos em produção
- [ ] Tempo de resposta < 2s
- [ ] Uptime > 99.9%

---

## 🚨 Plano de Rollback

### Se algo der errado:

1. **Reverter Firestore Rules**
```bash
firebase deploy --only firestore:rules --version PREVIOUS_VERSION
```

2. **Reverter Frontend**
```bash
# Deploy da versão anterior
git checkout PREVIOUS_TAG
npm run build
firebase deploy --only hosting
```

3. **Reverter Functions**
```bash
firebase deploy --only functions --version PREVIOUS_VERSION
```

4. **Restaurar Backup**
```bash
# Usar Firebase Console > Firestore > Import/Export
```

---

## 📞 Contatos de Emergência

### Equipe Técnica
- **Tech Lead**: _______________
- **DevOps**: _______________
- **QA**: _______________

### Suporte
- **Email**: support@torq.app
- **Slack**: #torq-emergencias
- **Telefone**: _______________

---

## 📅 Timeline

### Semana 1
- [ ] Dia 1-2: Implementar custom claims
- [ ] Dia 3-4: Executar migração de dados
- [ ] Dia 5: Deploy de rules e indexes

### Semana 2
- [ ] Dia 1-2: Testes de segurança
- [ ] Dia 3-4: Monitoring e alertas
- [ ] Dia 5: Deploy em produção

---

## ✅ Aprovações

### Técnica
- [ ] Tech Lead: _______________ Data: ___/___/___
- [ ] DevOps: _______________ Data: ___/___/___
- [ ] QA: _______________ Data: ___/___/___

### Negócio
- [ ] Product Owner: _______________ Data: ___/___/___
- [ ] CTO: _______________ Data: ___/___/___

---

## 📝 Notas

### Observações Importantes
```
[Espaço para notas durante o processo]




```

### Problemas Encontrados
```
[Documentar problemas e soluções]




```

### Lições Aprendidas
```
[Documentar aprendizados para próximos deploys]




```

---

**Data de Criação**: ___/___/___
**Última Atualização**: ___/___/___
**Versão**: 1.0.0
**Status Geral**: ❌ NÃO PRONTO | ⚠️ EM PROGRESSO | ✅ PRONTO

---

## 🎯 Próximos Passos

1. [ ] Preencher responsáveis em cada seção
2. [ ] Definir datas para cada etapa
3. [ ] Começar pelos bloqueadores
4. [ ] Atualizar status conforme progresso
5. [ ] Revisar checklist antes do deploy
