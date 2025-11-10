# 🚀 EXECUTAR MIGRAÇÃO - GUIA RÁPIDO

## ⚡ Passos Rápidos

### 1. Verificar serviceAccountKey.json
```bash
# Deve estar na raiz do projeto
ls serviceAccountKey.json
```

Se não existir, baixar do Firebase Console:
1. Firebase Console → Project Settings
2. Service Accounts → Generate New Private Key
3. Salvar como `serviceAccountKey.json` na raiz

### 2. Instalar Firebase Admin (se necessário)
```bash
npm install firebase-admin
```

### 3. Executar Migração
```bash
node scripts/migrateSuperAdminData.cjs
```

### 4. Aguardar Conclusão
O script irá:
- ✅ Criar backup automático
- ✅ Criar empresa "torq-super-admin"
- ✅ Migrar todos os dados antigos
- ✅ Vincular Super Admins à empresa
- ✅ Mostrar resumo completo

### 5. Validar
1. Fazer login como Super Admin
2. Verificar que vê todos os dados antigos
3. Testar funcionalidades

---

## 📊 O Que Será Migrado

```
✅ Clientes (clients → clientes)
✅ Orçamentos (budgets → orcamentos)
✅ Estoque (inventory → estoque)
✅ Veículos (vehicles → veiculos)
✅ Ferramentas (tools → ferramentas)
✅ Equipe (team_members → equipe)
✅ Agendamentos (schedules → agendamentos)
✅ Motos (motorcycles → motos)
✅ Check-ins (checkins → checkins)
```

---

## ✅ Resultado

Após a migração, os 3 Super Admins terão:

```
Empresa: torq-super-admin
├── Todos os clientes já cadastrados
├── Todos os orçamentos já criados
├── Todo o estoque já cadastrado
├── Todos os veículos já registrados
├── Todas as ferramentas já cadastradas
├── Toda a equipe já cadastrada
├── Todos os agendamentos já criados
├── Todas as motos já cadastradas
└── Todos os check-ins já realizados
```

---

## 🔒 Segurança

- ✅ Backup automático criado
- ✅ Dados originais preservados
- ✅ Nenhum dado perdido
- ✅ Rollback possível

---

## ⚠️ IMPORTANTE

**O script NÃO deleta os dados originais!**

Após validar que tudo funciona, você pode deletar manualmente as coleções antigas da raiz do Firestore.

---

## 🎯 Comando Único

```bash
node scripts/migrateSuperAdminData.cjs
```

**Pronto! Os Super Admins terão acesso a todos os dados antigos.**
