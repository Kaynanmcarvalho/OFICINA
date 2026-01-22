# ⚡ CONFIGURAÇÃO RÁPIDA - MÓDULO DE CAIXA

**Tempo Estimado:** 10 minutos  
**Data:** 22 de Janeiro de 2025

---

## 🎯 OBJETIVO

Configurar o Firestore para o módulo de caixa funcionar corretamente.

---

## ✅ CHECKLIST RÁPIDO

- [ ] Criar Índice 1 no Firestore
- [ ] Criar Índice 2 no Firestore
- [ ] Aplicar Regras de Segurança
- [ ] Testar Conexão
- [ ] Executar Teste Básico

---

## 📋 PASSO 1: CRIAR ÍNDICES (5 minutos)

### Acesse o Firebase Console

1. Abra: https://console.firebase.google.com
2. Selecione seu projeto
3. Vá em **Firestore Database** > **Indexes**
4. Clique em **Create Index**

### Índice 1: Listar Caixas por Empresa

**Collection ID:** `caixas`

**Fields to index:**
1. `empresaId` - **Ascending**
2. `status` - **Ascending**
3. `dataAbertura` - **Descending**

**Query scope:** Collection

Clique em **Create**

---

### Índice 2: Buscar Caixa Aberto do Operador

**Collection ID:** `caixas`

**Fields to index:**
1. `empresaId` - **Ascending**
2. `operadorAbertura.uid` - **Ascending**
3. `status` - **Ascending**

**Query scope:** Collection

Clique em **Create**

---

### ⏳ Aguarde a Criação

Os índices podem levar alguns minutos para serem criados.

Você verá o status mudando de:
- 🟡 **Building** → 🟢 **Enabled**

---

## 🔐 PASSO 2: APLICAR REGRAS DE SEGURANÇA (3 minutos)

### Acesse as Rules

1. No Firebase Console
2. Vá em **Firestore Database** > **Rules**

### Cole as Regras

Copie as regras do arquivo:
`.kiro/specs/caixa-auditoria-completa/FIRESTORE_RULES_CAIXA.md`

Ou use estas regras simplificadas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    match /caixas/{caixaId} {
      // Leitura: Usuários da mesma empresa
      allow read: if request.auth != null 
        && request.auth.token.empresaId == resource.data.empresaId;
      
      // Criação: Apenas o próprio usuário
      allow create: if request.auth != null 
        && request.auth.token.empresaId == request.resource.data.empresaId
        && request.resource.data.status == 'aberto'
        && request.resource.data.operadorAbertura.uid == request.auth.uid;
      
      // Atualização: Operador do caixa ou gerente
      allow update: if request.auth != null 
        && request.auth.token.empresaId == resource.data.empresaId
        && (
          request.auth.uid == resource.data.operadorAbertura.uid
          || request.auth.token.role == 'gerente'
          || request.auth.token.role == 'admin'
        );
      
      // Exclusão: Apenas admins
      allow delete: if request.auth != null 
        && request.auth.token.role == 'admin';
      
      // Movimentações (subcollection)
      match /movimentacoes/{movimentacaoId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
        allow update, delete: if false;
      }
    }
  }
}
```

### Publique

Clique em **Publish**

---

## 🧪 PASSO 3: TESTAR (2 minutos)

### Opção 1: Script Automático

```bash
node scripts/setup-caixa-firestore.js
```

### Opção 2: Teste Manual

1. Inicie o sistema:
```bash
npm run dev
```

2. Faça login

3. Acesse `/caixa`

4. Tente fazer uma venda (deve pedir para abrir caixa)

5. Se aparecer o modal de abertura: ✅ **FUNCIONANDO!**

---

## ⚠️ PROBLEMAS COMUNS

### "Index not found"

**Causa:** Índices ainda não foram criados

**Solução:**
1. Verifique no Firebase Console se os índices estão **Enabled**
2. Aguarde alguns minutos
3. Recarregue a página

---

### "Missing or insufficient permissions"

**Causa:** Rules não foram aplicadas

**Solução:**
1. Verifique se as rules foram publicadas
2. Verifique se o usuário tem `empresaId` no token
3. Faça logout e login novamente

---

### "empresaId is undefined"

**Causa:** Token do usuário não tem `empresaId`

**Solução:**
1. Verifique a configuração de Custom Claims
2. Execute o script de configuração de usuários
3. Faça logout e login novamente

---

## ✅ VALIDAÇÃO

Após configurar, verifique:

- [ ] Índices estão **Enabled** no Firebase Console
- [ ] Rules foram publicadas
- [ ] Sistema inicia sem erros
- [ ] Modal de abertura de caixa aparece
- [ ] Consegue abrir um caixa
- [ ] Banner aparece após abertura

---

## 🎉 PRONTO!

Se todos os itens acima estão ✅, a configuração está completa!

**Próximo passo:** Siga o guia de testes completo em `GUIA_TESTE_RAPIDO.md`

---

## 📞 PRECISA DE AJUDA?

### Documentação Completa:
- `FIRESTORE_RULES_CAIXA.md` - Regras detalhadas
- `GUIA_TESTE_RAPIDO.md` - Testes completos
- `PROXIMOS_PASSOS_EXATOS.md` - Próximos passos

### Suporte:
1. Verifique os logs do console do navegador
2. Verifique os logs do Firebase Console
3. Consulte a documentação acima

---

**Última Atualização:** 22 de Janeiro de 2025  
**Tempo Total:** 10 minutos  
**Status:** ✅ PRONTO PARA USO

