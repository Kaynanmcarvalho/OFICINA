# 🚨 CRIAR USUÁRIO RENIER - PASSO A PASSO

## ⚡ SOLUÇÃO RÁPIDA (5 minutos)

### Passo 1: Obter o UID (2 min)

1. Abra: https://console.firebase.google.com/
2. Selecione o projeto: **oficina-reparofacil**
3. No menu lateral, clique em **Authentication**
4. Clique na aba **Users**
5. Procure por: **renier@reparo.com**
6. **COPIE o UID** (algo como: `abc123xyz456...`)
   - Está na coluna "User UID"
   - Clique no ícone de copiar ao lado

### Passo 2: Criar Documento no Firestore (3 min)

1. No menu lateral, clique em **Firestore Database**
2. Procure a coleção **usuarios**
3. Clique em **"Add document"** (botão no topo)
4. **Document ID:** Cole o UID que você copiou
5. **Adicione os campos** (clique em "Add field" para cada um):

```
Campo 1:
  Field: email
  Type: string
  Value: renier@reparo.com

Campo 2:
  Field: nome
  Type: string
  Value: Renier Pantoja

Campo 3:
  Field: role
  Type: string
  Value: super-admin

Campo 4:
  Field: permissoes
  Type: array
  Value: all
  (clique em "Add item" e digite: all)

Campo 5:
  Field: ativo
  Type: boolean
  Value: true

Campo 6:
  Field: createdAt
  Type: timestamp
  Value: (deixe em branco, será preenchido automaticamente)

Campo 7:
  Field: updatedAt
  Type: timestamp
  Value: (deixe em branco, será preenchido automaticamente)
```

⚠️ **IMPORTANTE:** **NÃO adicione o campo `empresaId`!**

6. Clique em **Save**

### Passo 3: Testar (1 min)

1. Abra o sistema: http://localhost:5173 (ou sua URL)
2. **Faça LOGOUT** se estiver logado
3. **Faça LOGIN** com:
   - Email: renier@reparo.com
   - Senha: (sua senha)
4. Pressione **F12** para abrir o Console
5. Digite:
   ```javascript
   sessionStorage.getItem('empresaId')
   ```
6. **Deve retornar:** `null`

7. Navegue pelas páginas:
   - **Clientes** → Deve mostrar 1 cliente (Renier Pantoja)
   - **Check-ins** → Deve mostrar 6 check-ins
   - **Orçamentos** → Deve mostrar 2 orçamentos
   - **Estoque** → Deve mostrar 1 produto (Oleo 40W20)

## ✅ Resultado Esperado

Após criar o documento:

```
✅ Login com renier@reparo.com funciona
✅ empresaId = null (Super Admin)
✅ Vê todos os dados antigos:
   - 1 cliente
   - 6 check-ins
   - 2 orçamentos
   - 1 produto no estoque
```

## 🐛 Se Não Funcionar

### Problema 1: Dados ainda não aparecem

**Verifique:**
1. Você fez logout e login novamente?
2. O campo `empresaId` NÃO foi adicionado?
3. O campo `role` está como `super-admin`?
4. No console: `sessionStorage.getItem('empresaId')` retorna `null`?

**Se ainda não funciona:**
- Abra o Console (F12)
- Vá na aba **Console**
- Procure por erros em vermelho
- Copie e cole os erros

### Problema 2: empresaId não é null

Se `sessionStorage.getItem('empresaId')` retorna um ID:

1. Volte no Firebase Console
2. Firestore > usuarios > [UID do renier]
3. **DELETE o campo `empresaId`**
4. Faça logout e login novamente

### Problema 3: Erro de permissão

Se aparecer erro de permissão no console:

1. Verifique as regras do Firestore
2. Arquivo: `firestore.rules`
3. Certifique-se que Super Admins têm acesso

## 📊 Dados Disponíveis

Após a correção, você verá:

### Clientes (1)
- Renier Pantoja

### Check-ins (6)
- Matheus
- Renier Pantoja (múltiplos)

### Orçamentos (2)
- Renier Pantoja (2 orçamentos)

### Estoque (1)
- Oleo 40W20

### Veículos (1)
- Renier Pantoja

## 🎯 Por Que Isso Resolve?

O sistema funciona assim:

1. **Login** → Firebase Auth autentica
2. **Busca documento** → `usuarios/{uid}`
3. **Se NÃO encontra** → ❌ ERRO! Não carrega nada
4. **Se encontra** → Carrega `role` e `empresaId`
5. **Se `empresaId` = null E `role` = super-admin** → ✅ Acessa dados da raiz
6. **Se `empresaId` existe** → Acessa dados isolados da empresa

**Seu problema:** O documento não existia (passo 3 falhava)!

---

## 🚀 ALTERNATIVA: Script Automático

Se preferir usar script (precisa da senha):

```bash
node scripts/corrigirUsuarioRenier.mjs
```

Digite a senha quando solicitado e o script criará o documento automaticamente.

---

**URGENTE:** Siga os passos acima AGORA para resolver o problema!
