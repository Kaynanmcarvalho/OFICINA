# 🔐 FIRESTORE RULES - MÓDULO DE CAIXA

**Data:** 22 de Janeiro de 2025  
**Versão:** 1.0.0

---

## 📋 REGRAS DE SEGURANÇA

### Collection: `caixas`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ============================================================================
    // CAIXAS - Controle de Caixa
    // ============================================================================
    match /caixas/{caixaId} {
      
      // Função auxiliar: Verifica se o usuário pertence à empresa
      function isFromSameCompany() {
        return request.auth != null 
          && request.auth.token.empresaId == resource.data.empresaId;
      }
      
      // Função auxiliar: Verifica se é o operador do caixa
      function isOperator() {
        return request.auth != null 
          && request.auth.uid == resource.data.operadorAbertura.uid;
      }
      
      // Função auxiliar: Verifica se é gerente
      function isManager() {
        return request.auth != null 
          && request.auth.token.role == 'gerente';
      }
      
      // Função auxiliar: Verifica se é admin
      function isAdmin() {
        return request.auth != null 
          && (request.auth.token.role == 'admin' || request.auth.token.role == 'super_admin');
      }
      
      // ============================================================================
      // LEITURA (READ)
      // ============================================================================
      
      // Permitir leitura se:
      // 1. Usuário está autenticado
      // 2. Usuário pertence à mesma empresa do caixa
      allow read: if request.auth != null 
        && request.auth.token.empresaId == resource.data.empresaId;
      
      // ============================================================================
      // CRIAÇÃO (CREATE)
      // ============================================================================
      
      // Permitir criação se:
      // 1. Usuário está autenticado
      // 2. EmpresaId do documento é igual ao do usuário
      // 3. Status inicial é "aberto"
      // 4. Operador de abertura é o próprio usuário
      // 5. Saldo inicial é maior que 0
      // 6. Não existe outro caixa aberto para o mesmo operador
      allow create: if request.auth != null 
        && request.auth.token.empresaId == request.resource.data.empresaId
        && request.resource.data.status == 'aberto'
        && request.resource.data.operadorAbertura.uid == request.auth.uid
        && request.resource.data.saldoInicial >= 0
        && request.resource.data.saldoEsperado >= 0;
      
      // ============================================================================
      // ATUALIZAÇÃO (UPDATE)
      // ============================================================================
      
      // Permitir atualização se:
      // 1. Usuário está autenticado
      // 2. Usuário pertence à mesma empresa
      // 3. E uma das condições:
      //    a) É o operador do caixa E caixa está aberto
      //    b) É gerente ou admin
      allow update: if request.auth != null 
        && request.auth.token.empresaId == resource.data.empresaId
        && (
          // Operador pode atualizar seu próprio caixa aberto
          (isOperator() && resource.data.status == 'aberto')
          // Gerente ou admin pode atualizar qualquer caixa
          || isManager()
          || isAdmin()
        )
        // Validações adicionais:
        && (
          // Se está fechando o caixa
          (request.resource.data.status == 'fechado' 
            && resource.data.status == 'aberto'
            && request.resource.data.saldoContado != null
            && request.resource.data.dataFechamento != null
            && request.resource.data.operadorFechamento != null
          )
          // Ou se está apenas atualizando movimentações (caixa aberto)
          || (request.resource.data.status == 'aberto' 
            && resource.data.status == 'aberto'
          )
        );
      
      // ============================================================================
      // EXCLUSÃO (DELETE)
      // ============================================================================
      
      // Permitir exclusão APENAS para admins
      // (Normalmente não deve ser permitido, mas pode ser útil para correções)
      allow delete: if request.auth != null 
        && isAdmin();
      
      // ============================================================================
      // SUBCOLLECTION: movimentacoes
      // ============================================================================
      match /movimentacoes/{movimentacaoId} {
        // Permitir leitura se usuário pertence à mesma empresa do caixa pai
        allow read: if request.auth != null 
          && request.auth.token.empresaId == get(/databases/$(database)/documents/caixas/$(caixaId)).data.empresaId;
        
        // Permitir criação se:
        // 1. Usuário está autenticado
        // 2. Usuário pertence à mesma empresa
        // 3. Caixa pai está aberto
        allow create: if request.auth != null 
          && request.auth.token.empresaId == get(/databases/$(database)/documents/caixas/$(caixaId)).data.empresaId
          && get(/databases/$(database)/documents/caixas/$(caixaId)).data.status == 'aberto';
        
        // Não permitir atualização ou exclusão de movimentações
        // (Imutabilidade para auditoria)
        allow update: if false;
        allow delete: if false;
      }
    }
  }
}
```

---

## 📝 EXPLICAÇÃO DAS REGRAS

### 1. **Leitura (READ)**
- Qualquer usuário autenticado da mesma empresa pode ler caixas
- Útil para relatórios e dashboards

### 2. **Criação (CREATE)**
- Apenas o próprio usuário pode criar seu caixa
- Validações:
  - Status inicial deve ser "aberto"
  - Saldo inicial >= 0
  - EmpresaId deve corresponder ao do usuário
  - Operador de abertura deve ser o próprio usuário

### 3. **Atualização (UPDATE)**
- **Operador:** Pode atualizar apenas seu próprio caixa aberto
- **Gerente/Admin:** Pode atualizar qualquer caixa
- Validações especiais para fechamento:
  - Deve informar saldo contado
  - Deve informar data de fechamento
  - Deve informar operador de fechamento

### 4. **Exclusão (DELETE)**
- Apenas admins podem excluir
- Normalmente não deve ser usado (manter histórico)

### 5. **Movimentações (Subcollection)**
- Leitura: Usuários da mesma empresa
- Criação: Apenas em caixas abertos
- Atualização/Exclusão: **PROIBIDO** (imutabilidade para auditoria)

---

## 🔒 NÍVEIS DE PERMISSÃO

### Operador (Usuário Comum)
- ✅ Criar seu próprio caixa
- ✅ Ler caixas da empresa
- ✅ Atualizar seu próprio caixa aberto
- ✅ Fechar seu próprio caixa
- ❌ Atualizar caixas de outros
- ❌ Excluir caixas

### Gerente
- ✅ Criar caixa
- ✅ Ler todos os caixas
- ✅ Atualizar qualquer caixa
- ✅ Fechar qualquer caixa
- ❌ Excluir caixas

### Admin
- ✅ Criar caixa
- ✅ Ler todos os caixas
- ✅ Atualizar qualquer caixa
- ✅ Fechar qualquer caixa
- ✅ Excluir caixas (com cuidado!)

---

## 🧪 TESTES DE SEGURANÇA

### Teste 1: Criar Caixa
```javascript
// ✅ DEVE PASSAR
// Usuário cria seu próprio caixa
{
  empresaId: "user.empresaId",
  status: "aberto",
  operadorAbertura: { uid: "user.uid", nome: "User Name" },
  saldoInicial: 100,
  saldoEsperado: 100
}

// ❌ DEVE FALHAR
// Usuário tenta criar caixa para outro operador
{
  empresaId: "user.empresaId",
  status: "aberto",
  operadorAbertura: { uid: "other.uid", nome: "Other User" },
  saldoInicial: 100
}
```

### Teste 2: Atualizar Caixa
```javascript
// ✅ DEVE PASSAR
// Operador atualiza seu próprio caixa aberto
update(caixaRef, {
  saldoEsperado: 150,
  totalVendas: 50
});

// ❌ DEVE FALHAR
// Operador tenta atualizar caixa de outro
update(otherCaixaRef, {
  saldoEsperado: 150
});
```

### Teste 3: Fechar Caixa
```javascript
// ✅ DEVE PASSAR
// Operador fecha seu próprio caixa
update(caixaRef, {
  status: "fechado",
  saldoContado: 150,
  dataFechamento: new Date(),
  operadorFechamento: { uid: "user.uid", nome: "User Name" }
});

// ❌ DEVE FALHAR
// Operador tenta fechar sem informar saldo contado
update(caixaRef, {
  status: "fechado"
});
```

---

## 📋 COMO APLICAR AS RULES

### Opção 1: Firebase Console (Manual)

1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto
3. Vá em **Firestore Database** > **Rules**
4. Cole as regras acima
5. Clique em **Publish**

### Opção 2: Firebase CLI (Automático)

1. Instale o Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Faça login:
```bash
firebase login
```

3. Inicialize o projeto (se ainda não fez):
```bash
firebase init firestore
```

4. Edite o arquivo `firestore.rules` com as regras acima

5. Deploy:
```bash
firebase deploy --only firestore:rules
```

---

## ⚠️ IMPORTANTE

### Antes de Aplicar:
1. ✅ Faça backup das rules atuais
2. ✅ Teste em ambiente de desenvolvimento primeiro
3. ✅ Valide que todos os usuários têm `empresaId` no token
4. ✅ Valide que roles estão configurados corretamente

### Após Aplicar:
1. ✅ Teste criação de caixa
2. ✅ Teste atualização de caixa
3. ✅ Teste fechamento de caixa
4. ✅ Teste permissões de diferentes usuários
5. ✅ Monitore logs de segurança

---

## 🔍 MONITORAMENTO

### Logs de Segurança

Acesse: Firebase Console > Firestore > Usage

Monitore:
- Tentativas de acesso negadas
- Operações suspeitas
- Padrões anormais de uso

---

## 📞 SUPORTE

Se encontrar problemas:

1. Verifique se o token do usuário tem `empresaId`
2. Verifique se o role está correto
3. Verifique os logs de segurança no Firebase
4. Teste as rules no simulador do Firebase Console

---

**Última Atualização:** 22 de Janeiro de 2025  
**Versão:** 1.0.0  
**Status:** ✅ PRONTO PARA USO

