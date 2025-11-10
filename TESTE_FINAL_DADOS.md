# 🧪 TESTE FINAL - Verificação de Dados

## 🎯 Objetivo

Verificar se os Super Admins conseguem acessar os dados antigos e se o sistema multi-tenant está funcionando corretamente.

## 📋 Pré-requisitos

Você precisa das credenciais do Firebase Admin para executar os scripts de teste.

### Como Obter as Credenciais

1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto
3. Vá em: **Project Settings** (⚙️) > **Service Accounts**
4. Clique em **"Generate new private key"**
5. Salve o arquivo como `serviceAccountKey.json` na **raiz do projeto**

⚠️ **IMPORTANTE:** Nunca commite este arquivo no Git! Ele já está no `.gitignore`.

## 🔍 Passo 1: Testar Acesso aos Dados

Execute o script de teste para verificar quais dados existem:

```bash
node scripts/testarAcessoDados.cjs
```

### O que o script verifica:

✅ **Dados na Raiz (Super Admins):**
- Coleções: `clients`, `checkins`, `budgets`, `inventory`, `vehicles`, `tools`
- Quantos documentos existem em cada coleção
- Exemplos de dados encontrados

✅ **Dados Isolados (Empresas):**
- Quantas empresas existem
- Quais dados cada empresa possui
- Estrutura: `empresas/{id}/clientes`, `empresas/{id}/checkins`, etc.

### Resultados Possíveis:

#### Cenário A: Dados Antigos Encontrados ✅
```
📦 Dados na Raiz (Super Admins):
   Total de documentos: 150
   Coleções com dados: 5
   
   ✅ Super Admins PODEM acessar dados antigos!
```

**Ação:** Prossiga para o Passo 2 (Testar no Sistema)

#### Cenário B: Nenhum Dado Antigo ❌
```
📦 Dados na Raiz (Super Admins):
   Total de documentos: 0
   Coleções com dados: 0
   
   ❌ Nenhum dado antigo encontrado!
```

**Ação:** Prossiga para o Passo 1.1 (Criar Dados de Teste)

## 🔧 Passo 1.1: Criar Dados de Teste (Se Necessário)

Se o teste mostrou que não há dados antigos, crie dados de teste:

```bash
node scripts/criarDadosTeste.cjs
```

### O que será criado:

- ✅ 3 clientes de exemplo
- ✅ 4 produtos no estoque
- ✅ 2 check-ins
- ✅ 1 orçamento

Após criar os dados, execute novamente o teste:

```bash
node scripts/testarAcessoDados.cjs
```

## 🖥️ Passo 2: Testar no Sistema

Agora vamos testar se os Super Admins conseguem ver os dados no sistema web.

### 2.1. Fazer Logout

1. Abra o sistema no navegador
2. Faça logout de todos os usuários

### 2.2. Fazer Login como Super Admin

Faça login com um dos 3 Super Admins (donos).

### 2.3. Abrir Console do Navegador

Pressione `F12` e vá na aba **Console**.

### 2.4. Verificar empresaId

No console, digite:

```javascript
sessionStorage.getItem('empresaId')
```

**Resultado Esperado:** `null`

Se retornar um ID de empresa, o Super Admin está vinculado a uma empresa específica e não verá os dados antigos.

### 2.5. Testar Cada Página

Navegue pelas páginas e verifique se os dados aparecem:

#### ✅ Página de Clientes
- Deve mostrar os clientes da raiz (`clients`)
- Verificar se a lista não está vazia

#### ✅ Página de Check-ins
- Deve mostrar os check-ins da raiz (`checkins`)
- Verificar se a lista não está vazia

#### ✅ Página de Orçamentos
- Deve mostrar os orçamentos da raiz (`budgets`)
- Verificar se a lista não está vazia

#### ✅ Página de Estoque
- Deve mostrar os produtos da raiz (`inventory`)
- Verificar se a lista não está vazia

#### ✅ Dashboard
- Deve mostrar estatísticas dos dados antigos
- Verificar se os números batem com o teste backend

### 2.6. Verificar Console por Erros

No console do navegador, procure por:

- ❌ Erros de permissão do Firestore
- ❌ Erros de "empresaId undefined"
- ❌ Erros de "collection not found"

## 🏢 Passo 3: Testar Isolamento Multi-Tenant

Agora vamos testar se as empresas clientes veem apenas seus dados.

### 3.1. Criar uma Empresa de Teste

1. Ainda logado como Super Admin
2. Vá em **"Gerenciar Empresas"**
3. Clique em **"Nova Empresa"**
4. Preencha os dados:
   - Nome: "Empresa Teste"
   - CNPJ: "12.345.678/0001-90"
   - Email: "teste@empresa.com"
5. Crie um usuário para esta empresa

### 3.2. Fazer Login como Usuário da Empresa

1. Fazer logout do Super Admin
2. Fazer login com o usuário da empresa criada

### 3.3. Verificar empresaId

No console do navegador:

```javascript
sessionStorage.getItem('empresaId')
```

**Resultado Esperado:** ID da empresa (ex: "abc123xyz")

### 3.4. Verificar Isolamento

- ❌ NÃO deve ver os dados antigos (raiz)
- ❌ NÃO deve ver dados de outras empresas
- ✅ Deve ver apenas dados criados para esta empresa

### 3.5. Criar Dados para a Empresa

1. Crie um cliente novo
2. Crie um check-in
3. Crie um produto no estoque

### 3.6. Verificar no Backend

Execute o teste novamente:

```bash
node scripts/testarAcessoDados.cjs
```

Deve mostrar os dados da empresa na seção **"Dados Isolados (Empresas)"**.

## ✅ Checklist Final

### Super Admins (Dados Antigos)

- [ ] `sessionStorage.getItem('empresaId')` retorna `null`
- [ ] Página de Clientes mostra dados antigos
- [ ] Página de Check-ins mostra dados antigos
- [ ] Página de Orçamentos mostra dados antigos
- [ ] Página de Estoque mostra dados antigos
- [ ] Dashboard mostra estatísticas corretas
- [ ] Sem erros no console do navegador

### Empresas Clientes (Dados Isolados)

- [ ] `sessionStorage.getItem('empresaId')` retorna ID da empresa
- [ ] NÃO vê dados antigos (raiz)
- [ ] NÃO vê dados de outras empresas
- [ ] Vê apenas seus próprios dados
- [ ] Pode criar novos dados
- [ ] Dados aparecem apenas para esta empresa

## 🐛 Problemas Comuns

### Problema 1: Super Admin vê empresaId no sessionStorage

**Causa:** Super Admin está vinculado a uma empresa

**Solução:**
1. Acesse Firebase Console > Firestore
2. Vá em `usuarios/{uid}` do Super Admin
3. Remova o campo `empresaId`
4. Faça logout e login novamente

### Problema 2: Dados não aparecem para Super Admin

**Causa:** Não há dados na raiz do Firebase

**Solução:**
```bash
node scripts/criarDadosTeste.cjs
```

### Problema 3: Empresa vê dados de outras empresas

**Causa:** Bug no isolamento multi-tenant

**Solução:**
1. Verifique o console por erros
2. Verifique se `empresaId` está correto no sessionStorage
3. Reporte o problema com detalhes

### Problema 4: Erro de permissão no Firestore

**Causa:** Regras do Firestore muito restritivas

**Solução:**
1. Verifique `firestore.rules`
2. Certifique-se que Super Admins têm permissão de leitura na raiz
3. Certifique-se que empresas têm permissão apenas em seus dados

## 📊 Relatório de Teste

Após executar todos os testes, preencha:

```
Data do Teste: ___/___/______
Testado por: _________________

SUPER ADMINS:
✅ / ❌  Acesso aos dados antigos
✅ / ❌  Clientes visíveis
✅ / ❌  Check-ins visíveis
✅ / ❌  Orçamentos visíveis
✅ / ❌  Estoque visível
✅ / ❌  Dashboard funcionando

EMPRESAS CLIENTES:
✅ / ❌  Isolamento funcionando
✅ / ❌  Não vê dados antigos
✅ / ❌  Não vê outras empresas
✅ / ❌  Pode criar dados
✅ / ❌  Dados isolados corretamente

OBSERVAÇÕES:
_________________________________
_________________________________
_________________________________
```

## 🎉 Sucesso!

Se todos os testes passaram:

✅ Sistema multi-tenant funcionando 100%
✅ Super Admins têm acesso aos dados antigos
✅ Empresas clientes têm dados isolados
✅ Segurança e privacidade garantidas

---

**Dúvidas?** Verifique os logs no console do navegador e nos scripts backend.
