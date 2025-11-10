# 🔄 Migração de Dados dos Super Admins

## 🎯 Objetivo

Preservar todos os dados já cadastrados pelos Super Admins e movê-los para uma empresa específica deles, mantendo acesso total aos dados antigos.

---

## 📊 Situação Atual

### Antes da Migração
```
firestore/
├── clients/           ← Dados antigos dos Super Admins (raiz)
├── budgets/           ← Dados antigos dos Super Admins (raiz)
├── inventory/         ← Dados antigos dos Super Admins (raiz)
├── vehicles/          ← Dados antigos dos Super Admins (raiz)
└── ... (outras coleções antigas)
```

### Depois da Migração
```
firestore/
├── empresas/
│   ├── torq-super-admin/          ← Empresa dos Super Admins
│   │   ├── clientes/              ← Dados antigos migrados
│   │   ├── orcamentos/            ← Dados antigos migrados
│   │   ├── estoque/               ← Dados antigos migrados
│   │   ├── veiculos/              ← Dados antigos migrados
│   │   └── ... (todos os dados)
│   │
│   └── outras-empresas/           ← Empresas clientes
│       └── ... (dados isolados)
│
└── cache_placas/                  ← Compartilhado
```

---

## 🚀 Como Executar a Migração

### Pré-requisitos

1. **serviceAccountKey.json** deve estar na raiz do projeto
2. Firebase Admin SDK instalado
3. Backup dos dados (script faz automaticamente)

### Passo 1: Instalar Dependências

```bash
npm install firebase-admin
```

### Passo 2: Executar Script de Migração

```bash
node scripts/migrateSuperAdminData.cjs
```

### Passo 3: Validar Migração

1. Fazer login como Super Admin
2. Verificar que vê todos os dados antigos
3. Testar funcionalidades (check-in, orçamentos, etc.)
4. Confirmar que tudo funciona

---

## 📋 O Que o Script Faz

### 1. Cria Backup ✅
```javascript
// Salva referência dos dados originais
_backups/pre-migration-{timestamp}
```

### 2. Cria Empresa dos Super Admins ✅
```javascript
empresas/torq-super-admin/
  nomeFantasia: "Torq - Administração"
  razaoSocial: "Torq Sistemas Ltda"
  cnpj: "00.000.000/0001-00"
  plano: "premium"
  isSuperAdminEmpresa: true
```

### 3. Migra Todas as Coleções ✅
```javascript
Coleções migradas:
- clients → clientes
- budgets → orcamentos
- inventory → estoque
- vehicles → veiculos
- tools → ferramentas
- team_members → equipe
- schedules → agendamentos
- motorcycles → motos
- checkins → checkins
```

### 4. Vincula Super Admins à Empresa ✅
```javascript
// Atualiza todos os usuários com role: 'super-admin'
usuarios/{userId}
  empresaId: "torq-super-admin"
```

---

## ✅ Resultado Final

### Para os 3 Super Admins

Quando fizerem login, terão acesso a:

```
✅ Todos os clientes já cadastrados
✅ Todos os orçamentos já criados
✅ Todo o estoque já cadastrado
✅ Todos os veículos já registrados
✅ Todas as ferramentas já cadastradas
✅ Toda a equipe já cadastrada
✅ Todos os agendamentos já criados
✅ Todas as motos já cadastradas
✅ Todos os check-ins já realizados
```

### Funcionalidades Mantidas

```
✅ Dashboard com estatísticas corretas
✅ Busca funcionando em todos os dados
✅ Histórico preservado
✅ Relatórios com dados completos
✅ Gráficos com dados históricos
```

### Acesso via Impersonation

```
✅ Podem acessar /admin/dashboard
✅ Veem lista de todas as empresas
✅ Podem entrar em qualquer empresa cliente
✅ Podem voltar para sua própria empresa
✅ Mantêm acesso aos dados antigos
```

---

## 🔒 Segurança

### Dados Preservados
- ✅ Nenhum dado é perdido
- ✅ Backup automático criado
- ✅ IDs originais preservados
- ✅ Timestamps preservados

### Isolamento Mantido
- ✅ Empresas clientes não veem dados dos Super Admins
- ✅ Super Admins não veem dados de clientes (exceto via impersonation)
- ✅ Cache de placas continua compartilhado

---

## 🧪 Validação Pós-Migração

### Checklist de Testes

1. **Login Super Admin**
   - [ ] Fazer login com conta de Super Admin
   - [ ] Verificar que carrega normalmente
   - [ ] Verificar empresaId = "torq-super-admin"

2. **Dashboard**
   - [ ] Ver estatísticas corretas
   - [ ] Ver gráficos com dados históricos
   - [ ] Ver alertas (se houver)

3. **Clientes**
   - [ ] Ver todos os clientes antigos
   - [ ] Buscar clientes funciona
   - [ ] Adicionar novo cliente funciona

4. **Orçamentos**
   - [ ] Ver todos os orçamentos antigos
   - [ ] Criar novo orçamento funciona
   - [ ] Aprovar orçamento funciona

5. **Estoque**
   - [ ] Ver todos os produtos antigos
   - [ ] Movimentar estoque funciona
   - [ ] Alertas de estoque baixo funcionam

6. **Veículos**
   - [ ] Ver todos os veículos antigos
   - [ ] Adicionar novo veículo funciona
   - [ ] Histórico de serviços preservado

7. **Check-ins**
   - [ ] Ver todos os check-ins antigos
   - [ ] Criar novo check-in funciona
   - [ ] Fotos e dados preservados

8. **Impersonation**
   - [ ] Acessar /admin/dashboard
   - [ ] Ver lista de empresas
   - [ ] Entrar como empresa cliente
   - [ ] Voltar para empresa própria
   - [ ] Ver dados antigos novamente

---

## 🔄 Rollback (Se Necessário)

Se algo der errado, os dados originais ainda estão na raiz:

```javascript
// Dados originais ainda existem em:
firestore/
├── clients/           ← Ainda existe
├── budgets/           ← Ainda existe
├── inventory/         ← Ainda existe
└── ... (todas as coleções)

// Backup também foi criado em:
_backups/pre-migration-{timestamp}
```

**Nota:** O script NÃO deleta os dados originais automaticamente. Isso deve ser feito manualmente após validação completa.

---

## 📝 Após Validação Completa

### Limpeza Opcional (Após Confirmar que Tudo Funciona)

```javascript
// Pode deletar coleções antigas da raiz:
- clients/
- budgets/
- inventory/
- vehicles/
- tools/
- team_members/
- schedules/
- motorcycles/
- checkins/

// Manter apenas:
- empresas/
- cache_placas/
- usuarios/
- _backups/
```

---

## 🎯 Estrutura Final

```
firestore/
│
├── empresas/
│   │
│   ├── torq-super-admin/              ← Super Admins
│   │   ├── clientes/                  ← Dados antigos + novos
│   │   ├── orcamentos/                ← Dados antigos + novos
│   │   ├── estoque/                   ← Dados antigos + novos
│   │   ├── veiculos/                  ← Dados antigos + novos
│   │   ├── ferramentas/               ← Dados antigos + novos
│   │   ├── equipe/                    ← Dados antigos + novos
│   │   ├── agendamentos/              ← Dados antigos + novos
│   │   ├── motos/                     ← Dados antigos + novos
│   │   └── checkins/                  ← Dados antigos + novos
│   │
│   ├── empresa-cliente-1/             ← Cliente 1
│   │   └── ... (dados isolados)
│   │
│   └── empresa-cliente-2/             ← Cliente 2
│       └── ... (dados isolados)
│
├── cache_placas/                      ← Compartilhado
│   └── {placa}/
│
├── usuarios/                          ← Autenticação
│   └── {userId}/
│       ├── empresaId                  ← Vincula à empresa
│       └── role
│
└── _backups/                          ← Backups
    └── pre-migration-{timestamp}/
```

---

## ✅ Garantias

### Para Super Admins
- ✅ Acesso a TODOS os dados antigos
- ✅ Nenhum dado perdido
- ✅ Histórico completo preservado
- ✅ Funcionalidades mantidas
- ✅ Performance mantida

### Para Empresas Clientes
- ✅ Não veem dados dos Super Admins
- ✅ Dados completamente isolados
- ✅ Privacidade garantida
- ✅ Conformidade LGPD

### Para o Sistema
- ✅ Arquitetura multi-tenant completa
- ✅ Escalabilidade garantida
- ✅ Segurança implementada
- ✅ Backup automático

---

## 🎉 Conclusão

Após executar a migração:

1. ✅ Super Admins têm empresa própria
2. ✅ Todos os dados antigos preservados
3. ✅ Acesso total aos dados históricos
4. ✅ Podem usar impersonation para acessar clientes
5. ✅ Sistema multi-tenant completo
6. ✅ Isolamento total garantido

**Os 3 Super Admins terão acesso a todos os dados que já estavam cadastrados!**

---

**Executar:** `node scripts/migrateSuperAdminData.cjs`
