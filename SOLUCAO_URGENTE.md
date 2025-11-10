# 🚨 SOLUÇÃO URGENTE - Dados Zerados

## 🎯 PROBLEMA IDENTIFICADO

O usuário `renier@reparo.com` **NÃO TEM** documento na coleção `usuarios` do Firestore!

### O que foi encontrado:

✅ **Dados EXISTEM no Firebase:**
- 1 cliente em `clients`
- 6 check-ins em `checkins`
- 2 orçamentos em `budgets`
- 1 produto em `inventory`

❌ **Usuário renier@reparo.com:**
- Existe no Firebase Auth (pode fazer login)
- NÃO existe na coleção `usuarios` do Firestore
- Por isso o sistema não carrega os dados!

## 🔧 SOLUÇÃO RÁPIDA (2 opções)

### Opção 1: Via Firebase Console (MAIS RÁPIDO)

1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto: **oficina-reparofacil**
3. Vá em **Authentication** > **Users**
4. Procure por `renier@reparo.com`
5. **Copie o UID** (algo como: `abc123xyz...`)
6. Vá em **Firestore Database**
7. Abra a coleção `usuarios`
8. Clique em **"Add document"**
9. **Document ID:** Cole o UID copiado
10. **Adicione os campos:**
    ```
    email: "renier@reparo.com"
    nome: "Renier Pantoja"
    role: "super-admin"
    permissoes: ["all"]
    ativo: true
    createdAt: (timestamp atual)
    updatedAt: (timestamp atual)
    ```
    **⚠️ NÃO adicione o campo `empresaId`!**

11. Clique em **Save**
12. Faça **logout** e **login** novamente
13. ✅ **PRONTO!** Os dados devem aparecer!

### Opção 2: Via Script (Requer UID)

1. Descubra o UID do usuário:
   - Firebase Console > Authentication > Users
   - Procure `renier@reparo.com`
   - Copie o UID

2. Edite o arquivo: `scripts/adicionarDocumentoUsuario.mjs`
   - Linha 27: `const UID = 'COLE_O_UID_AQUI';`
   - Substitua por: `const UID = 'seu-uid-aqui';`

3. Execute:
   ```bash
   node scripts/adicionarDocumentoUsuario.mjs
   ```

4. Faça logout e login novamente

## 🧪 VERIFICAR SE FUNCIONOU

Após criar o documento:

1. Faça **logout** do sistema
2. Faça **login** com `renier@reparo.com`
3. Abra o **Console do navegador** (F12)
4. Digite:
   ```javascript
   sessionStorage.getItem('empresaId')
   ```
   **Deve retornar:** `null`

5. Vá nas páginas:
   - **Clientes** → Deve mostrar 1 cliente
   - **Check-ins** → Deve mostrar 6 check-ins
   - **Orçamentos** → Deve mostrar 2 orçamentos
   - **Estoque** → Deve mostrar 1 produto

## 📊 Dados Disponíveis

Após a correção, você verá:

```
📦 Clientes: 1
   - Renier Pantoja

📦 Check-ins: 6
   - Matheus
   - Renier Pantoja (2x)
   - ...

📦 Orçamentos: 2
   - Renier Pantoja (2x)

📦 Estoque: 1
   - Oleo 40W20

📦 Veículos: 1
   - Renier Pantoja
```

## ❓ Por que isso aconteceu?

O sistema multi-tenant funciona assim:

1. Usuário faz login
2. Sistema busca documento em `usuarios/{uid}`
3. Se NÃO encontra → **ERRO!** Não carrega nada
4. Se encontra → Carrega `empresaId` e `role`
5. Se `empresaId` é `null` E `role` é `super-admin` → Acessa dados da raiz
6. Se `empresaId` existe → Acessa dados isolados da empresa

**No seu caso:** O documento não existia, então o passo 3 falhava!

## ✅ Checklist

- [ ] Descobrir UID do usuário renier@reparo.com
- [ ] Criar documento em `usuarios/{uid}`
- [ ] Campos corretos (sem empresaId!)
- [ ] Fazer logout
- [ ] Fazer login novamente
- [ ] Verificar sessionStorage.empresaId = null
- [ ] Verificar se dados aparecem

## 🎉 Resultado Esperado

Após criar o documento:

✅ Login com renier@reparo.com funciona
✅ Sistema carrega dados do Firestore
✅ empresaId = null (Super Admin)
✅ Vê todos os dados antigos (raiz)
✅ 1 cliente, 6 check-ins, 2 orçamentos, 1 produto

---

**URGENTE:** Siga a Opção 1 (Firebase Console) - é mais rápido e seguro!
