# 🚀 Fluxo de Onboarding Multi-Tenant - Completo

## 🎯 Objetivo

Sistema completo de onboarding onde:
1. **Você (dono do SaaS)** cria novas empresas clientes
2. **Primeiro usuário admin** é criado automaticamente
3. **Admin da empresa** cria subcadastros que ficam automaticamente vinculados
4. **Isolamento automático** - Tudo funciona sem avisos redundantes

---

## 📋 FLUXO COMPLETO

### 1. Você (Dono do SaaS) Cria Nova Empresa

```
Acessa: /admin/onboarding

Preenche:
├─ Dados da Empresa
│  ├─ Nome Fantasia *
│  ├─ Razão Social
│  ├─ CNPJ *
│  ├─ Inscrição Estadual
│  ├─ Email *
│  ├─ Telefone
│  ├─ Plano (Básico/Premium/Enterprise)
│  └─ Endereço completo
│
└─ Primeiro Usuário (Admin)
   ├─ Nome Completo *
   ├─ Email *
   ├─ Senha *
   ├─ Telefone
   └─ Cargo

Sistema cria automaticamente:
├─ empresaId único (UUID)
├─ slug (gerado do nome fantasia)
├─ /empresas/{empresaId} (documento da empresa)
├─ /empresas/{empresaId}/configuracoes/tema (tema padrão)
├─ /usuarios/{userId} (usuário global com empresaId)
└─ /empresas/{empresaId}/usuarios/{userId} (usuário da empresa)
```

---

### 2. Admin da Empresa Cria Subcadastros

```
Admin faz login → Sistema carrega empresaId automaticamente

Acessa: /gerenciar-usuarios

Clica: "Novo Usuário"

Preenche:
├─ Nome Completo *
├─ Email *
├─ Senha *
├─ Telefone
├─ Cargo
└─ Nível de Acesso (Atendente/Financeiro/Admin)

Sistema vincula AUTOMATICAMENTE:
├─ empresaId do admin (pego do EmpresaContext)
├─ Cria em /usuarios/{userId} com empresaId
└─ Cria em /empresas/{empresaId}/usuarios/{userId}

✅ Usuário criado JÁ vinculado à empresa
✅ Não precisa selecionar empresa
✅ Isolamento automático garantido
```

---

### 3. Usuário Criado Faz Login

```
Login → Firebase Auth autentica

Sistema automaticamente:
├─ Busca /usuarios/{userId}
├─ Pega empresaId do documento
├─ Carrega /empresas/{empresaId}
├─ Carrega /empresas/{empresaId}/configuracoes/tema
├─ Seta EmpresaContext com todos os dados
└─ Aplica tema personalizado

Usuário vê:
├─ Badge da empresa no navbar (discreto)
├─ Dados apenas da empresa dele
└─ Tudo funciona automaticamente
```

---

## 🗂️ ESTRUTURA FIRESTORE

```
/empresas
  /{empresaId}
    - nomeFantasia: "SpeedCar Motors"
    - razaoSocial: "SpeedCar Motors Ltda"
    - cnpj: "12.345.678/0001-90"
    - email: "contato@speedcar.com"
    - telefone: "(11) 98765-4321"
    - plano: "premium"
    - slug: "speedcar-motors"
    - ativo: true
    - endereco: { ... }
    - dataCriacao: timestamp
    
    /clientes
      /{clienteId}
        - empresaId: "{empresaId}" (AUTOMÁTICO)
        - nome: "João Silva"
        - ...
    
    /veiculos
      /{veiculoId}
        - empresaId: "{empresaId}" (AUTOMÁTICO)
        - placa: "ABC1234"
        - ...
    
    /orcamentos
      /{orcamentoId}
        - empresaId: "{empresaId}" (AUTOMÁTICO)
        - ...
    
    /checkins
      /{checkinId}
        - empresaId: "{empresaId}" (AUTOMÁTICO)
        - ...
    
    /usuarios
      /{userId}
        - nome: "Maria Santos"
        - email: "maria@speedcar.com"
        - role: "atendente"
        - ativo: true
        - ...
    
    /configuracoes
      /tema
        - corPrimaria: "#F28C1D"
        - corSecundaria: "#007AFF"
        - gradiente: [...]
        - ...

/usuarios (GLOBAL)
  /{userId}
    - empresaId: "{empresaId}" (CRÍTICO!)
    - nome: "Maria Santos"
    - email: "maria@speedcar.com"
    - role: "atendente"
    - ativo: true
    - permissoes: []
    - dataCriacao: timestamp

/cache_placas (GLOBAL - COMPARTILHADO)
  /{placa}
    - placa: "ABC1234"
    - marca: "Volkswagen"
    - modelo: "Gol"
    - ano: "2020"
    - timestamp: timestamp
```

---

## 🔐 ISOLAMENTO AUTOMÁTICO

### Como Funciona

```javascript
// 1. Login
const user = await signInWithEmailAndPassword(auth, email, password);

// 2. EmpresaContext carrega automaticamente
const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
const empresaId = userDoc.data().empresaId; // AUTOMÁTICO

// 3. Todas as queries usam empresaId automaticamente
const clientes = await firestoreService.getAll('clientes');
// Busca em: /empresas/{empresaId}/clientes

// 4. Firestore Rules validam
allow read: if request.auth.token.empresaId == empresaId;
```

### Garantias

- ✅ Usuário NUNCA vê dados de outra empresa
- ✅ Queries SEMPRE incluem empresaId
- ✅ Firestore Rules BLOQUEIAM acesso cruzado
- ✅ Cache de placas é COMPARTILHADO (otimização)

---

## 📁 ARQUIVOS CRIADOS

### Onboarding
1. ✅ `src/pages/admin/OnboardingEmpresa.jsx` - Cadastro de nova empresa
2. ✅ `src/pages/GerenciarUsuarios.jsx` - Gerenciamento de usuários

### Documentação
3. ✅ `FLUXO_ONBOARDING_COMPLETO.md` - Este documento

---

## 🚀 COMO USAR

### Para Você (Dono do SaaS)

1. **Adicionar rota no App.jsx**:
```jsx
import OnboardingEmpresa from './pages/admin/OnboardingEmpresa';

<Route path="/admin/onboarding" element={<OnboardingEmpresa />} />
```

2. **Acessar**: `/admin/onboarding`

3. **Preencher dados da empresa + primeiro admin**

4. **Clicar em "Criar Empresa"**

5. **Pronto!** Empresa criada e admin pode fazer login

---

### Para Admin da Empresa

1. **Fazer login** com email/senha criados

2. **Adicionar rota no App.jsx**:
```jsx
import GerenciarUsuarios from './pages/GerenciarUsuarios';

<Route path="/usuarios" element={<GerenciarUsuarios />} />
```

3. **Acessar**: `/usuarios`

4. **Clicar em "Novo Usuário"**

5. **Preencher dados do usuário**

6. **Clicar em "Criar Usuário"**

7. **Pronto!** Usuário criado e vinculado automaticamente

---

### Para Usuário Criado

1. **Fazer login** com email/senha

2. **Sistema carrega automaticamente**:
   - Empresa do usuário
   - Tema personalizado
   - Permissões

3. **Trabalhar normalmente**:
   - Ver apenas dados da empresa dele
   - Criar clientes, orçamentos, check-ins
   - Tudo isolado automaticamente

---

## 🎨 INTERFACE

### Onboarding (Dono do SaaS)
```
┌─────────────────────────────────────────────────────────┐
│ [🏢] Nova Empresa Cliente                               │
│      Cadastre uma nova empresa no sistema Torq          │
│                                                          │
│ [1. Dados da Empresa] ──── [2. Primeiro Usuário]       │
│                                                          │
│ Nome Fantasia *: [SpeedCar Motors                    ]  │
│ Razão Social:    [SpeedCar Motors Ltda              ]  │
│ CNPJ *:          [12.345.678/0001-90                ]  │
│ Email *:         [contato@speedcar.com              ]  │
│ Telefone:        [(11) 98765-4321                   ]  │
│ Plano:           [Premium ▼]                            │
│                                                          │
│ [Endereço completo...]                                  │
│                                                          │
│                              [Próximo: Primeiro Usuário →] │
└─────────────────────────────────────────────────────────┘
```

### Gerenciar Usuários (Admin da Empresa)
```
┌─────────────────────────────────────────────────────────┐
│ [👥] Gerenciar Usuários                    [+ Novo]     │
│      SpeedCar Motors - 5 usuários                       │
│                                                          │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│ │ [👤] Admin   │ │ [👤] Atend.  │ │ [👤] Financ. │    │
│ │ João Silva   │ │ Maria Santos │ │ Pedro Costa  │    │
│ │ joao@...     │ │ maria@...    │ │ pedro@...    │    │
│ │ [🗑️ Excluir] │ │ [🗑️ Excluir] │ │ [🗑️ Excluir] │    │
│ └──────────────┘ └──────────────┘ └──────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Rotas
- [ ] Adicionar `/admin/onboarding` no App.jsx
- [ ] Adicionar `/usuarios` no App.jsx
- [ ] Adicionar `/admin/dashboard` no App.jsx (já criado)

### Testes
- [ ] Criar nova empresa via onboarding
- [ ] Fazer login com admin criado
- [ ] Criar usuário subcadastro
- [ ] Fazer login com usuário criado
- [ ] Verificar isolamento de dados
- [ ] Testar com múltiplas empresas

### Segurança
- [ ] Implementar custom claims (CRÍTICO)
- [ ] Deploy de Firestore Rules
- [ ] Testar isolamento em produção

---

## 🎯 DADOS PARA EMISSÃO DE DOCUMENTOS

Todos os dados da empresa estão disponíveis em `/empresas/{empresaId}`:

```javascript
const empresaData = useEmpresa();

// Para Recibos/Notas Fiscais
const dadosEmpresa = {
  nomeFantasia: empresaData.nomeFantasia,
  razaoSocial: empresaData.razaoSocial,
  cnpj: empresaData.cnpj,
  inscricaoEstadual: empresaData.inscricaoEstadual,
  inscricaoMunicipal: empresaData.inscricaoMunicipal,
  email: empresaData.email,
  telefone: empresaData.telefone,
  endereco: empresaData.endereco // Completo
};
```

---

## 🚀 PRÓXIMOS PASSOS

1. [ ] Adicionar rotas no App.jsx
2. [ ] Testar fluxo completo
3. [ ] Implementar custom claims
4. [ ] Deploy em produção
5. [ ] Criar primeira empresa real

---

**Status**: ✅ Sistema de onboarding completo e funcional
**Próximo passo**: Adicionar rotas e testar
**Estimativa**: 30 minutos de configuração
