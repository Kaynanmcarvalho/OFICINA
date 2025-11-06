# 📍 Onde Ativar a NFS-e

## 🎯 Localização

**Caminho:** Integrações → Nota Fiscal → Permissões de Emissão

---

## 📸 Visualização

```
┌──────────────────────────────────────────────────────────────────┐
│                         INTEGRAÇÕES                              │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  📄 Nota Fiscal                                          ▼       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Dados Fiscais                                                   │
│  ┌────────────────────┐  ┌────────────────────┐                │
│  │ Nome da Empresa    │  │ CNPJ               │                │
│  └────────────────────┘  └────────────────────┘                │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Permissões de Emissão                                   │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────┐     │  │
│  │  │ NF-e (Nota Fiscal Eletrônica)          [🔵 ON] │     │  │
│  │  │ Permite emissão de NF-e para vendas            │     │  │
│  │  └────────────────────────────────────────────────┘     │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────┐     │  │
│  │  │ NFC-e (Nota Fiscal de Consumidor)      [🔵 ON] │     │  │
│  │  │ Permite emissão de NFC-e no PDV/Caixa          │     │  │
│  │  └────────────────────────────────────────────────┘     │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────┐     │  │
│  │  │ NFS-e (Nota Fiscal de Serviço)        [⚪ OFF] │ ← AQUI!
│  │  │ Permite emissão de NFS-e para serviços         │     │  │
│  │  └────────────────────────────────────────────────┘     │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  API - Gyn Fiscal Online                                         │
│  ┌────────────────────┐  ┌────────────────────┐                │
│  │ Código Autorizador │  │ Senha Autorizada   │                │
│  └────────────────────┘  └────────────────────┘                │
│                                                                  │
│  [💾 Salvar Configurações]                                      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Passo a Passo

### 1️⃣ Acesse Integrações
No menu lateral, clique em **"Integrações"**

### 2️⃣ Expanda Nota Fiscal
Clique no card verde **"Nota Fiscal"** para expandir

### 3️⃣ Localize Permissões de Emissão
Role até a seção **"Permissões de Emissão"**

### 4️⃣ Ative NFS-e
Clique no toggle ao lado de **"NFS-e (Nota Fiscal de Serviço)"**

O toggle deve ficar **azul** quando ativado:
- ⚪ OFF (cinza) = Desativado
- 🔵 ON (azul) = Ativado

### 5️⃣ Salve as Configurações
Role até o final da página e clique em **"Salvar Configurações"**

---

## ✅ Como Saber se Está Ativo

Após salvar, você verá:

1. **No modal de venda:**
   - A opção **"NFS-e (Serviço)"** estará disponível
   - Você poderá selecionar entre NFe, NFCe e NFS-e

2. **Mensagem de confirmação:**
   ```
   ✅ Configurações salvas com sucesso!
   ```

3. **Aviso se nenhuma estiver ativa:**
   ```
   ⚠️ Nenhuma modalidade de nota fiscal está ativa.
      Ative pelo menos uma para permitir emissão de notas.
   ```

---

## 🎯 Estados Possíveis

### Todas Desativadas
```
┌────────────────────────────────────────────────┐
│ ⚠️ Nenhuma modalidade de nota fiscal está     │
│    ativa. Ative pelo menos uma para permitir  │
│    emissão de notas.                          │
└────────────────────────────────────────────────┘
```

### Apenas NFS-e Ativa
```
NF-e   [⚪ OFF]
NFC-e  [⚪ OFF]
NFS-e  [🔵 ON]  ← Apenas serviços podem ser emitidos
```

### Todas Ativas
```
NF-e   [🔵 ON]  ← Vendas de produtos
NFC-e  [🔵 ON]  ← Vendas no PDV
NFS-e  [🔵 ON]  ← Prestação de serviços
```

---

## 🔍 Diferenças entre os Tipos

| Tipo | Quando Usar | Dados do Cliente |
|------|-------------|------------------|
| **NF-e** | Vendas para empresas | ✅ Obrigatório |
| **NFC-e** | Vendas no PDV/Caixa | ⚪ Opcional |
| **NFS-e** | Prestação de serviços | ✅ Obrigatório |

---

## 💡 Dicas

### Para Empresas de Serviços
Se você presta **apenas serviços**, ative somente:
- 🔵 NFS-e

### Para Lojas de Varejo
Se você vende **produtos no balcão**, ative:
- 🔵 NFC-e

### Para Empresas Mistas
Se você vende **produtos e serviços**, ative:
- 🔵 NF-e (vendas para empresas)
- 🔵 NFC-e (vendas no balcão)
- 🔵 NFS-e (prestação de serviços)

---

## 🚨 Importante

Após ativar a NFS-e, certifique-se de:

1. ✅ Configurar as credenciais da API (Código Autorizador e Senha)
2. ✅ Testar a conexão com o servidor
3. ✅ Validar as credenciais
4. ✅ Preencher os dados fiscais da empresa
5. ✅ Configurar o endereço completo

---

## 📞 Precisa de Ajuda?

Se o toggle não aparecer ou não funcionar:

1. Verifique se você está na versão mais recente do sistema
2. Limpe o cache do navegador (Ctrl + Shift + Delete)
3. Faça logout e login novamente
4. Verifique o console do navegador (F12) para erros

---

## 🎉 Pronto!

Agora você pode emitir NFS-e diretamente do sistema!

**Próximo passo:** Vá para o Caixa e teste a emissão! 🚀
