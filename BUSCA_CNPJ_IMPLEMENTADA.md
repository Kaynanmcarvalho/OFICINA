# Busca Automática de CNPJ - Implementação Completa ✅

## 🎯 Objetivo
Implementar busca automática de dados de empresas via CNPJ com integração à Receita Federal, preenchendo automaticamente todos os campos do cadastro.

## ✅ Implementação Realizada

### 1. **Serviço de Consulta CNPJ**
**Arquivo:** `src/services/cnpjService.js`

**Funcionalidades:**
- ✅ Consulta via BrasilAPI (principal)
- ✅ Fallback para ReceitaWS
- ✅ Validação de CNPJ antes da consulta
- ✅ Formatação automática de dados
- ✅ Verificação de situação cadastral
- ✅ Tratamento de erros robusto

**APIs Utilizadas:**
- **BrasilAPI**: `https://brasilapi.com.br/api/cnpj/v1/{cnpj}`
- **ReceitaWS**: `https://www.receitaws.com.br/v1/cnpj/{cnpj}` (fallback)

### 2. **Reorganização dos Campos**
**Ordem Nova (Pessoa Jurídica):**
1. ✅ **CNPJ** (com botão de busca) - PRIMEIRO
2. ✅ Razão Social
3. ✅ Nome Fantasia
4. ✅ Inscrição Estadual (opcional)

### 3. **Botão de Busca Inteligente**
**Características:**
- ✅ Ícone de Download (lucide-react)
- ✅ Cor verde (#10b981) para destacar
- ✅ Desabilitado se CNPJ incompleto
- ✅ Loading animado durante busca
- ✅ Tooltip explicativo
- ✅ Feedback visual premium

### 4. **Preenchimento Automático**
**Dados Preenchidos:**
- ✅ Razão Social
- ✅ Nome Fantasia
- ✅ CEP
- ✅ Endereço (logradouro)
- ✅ Número
- ✅ Complemento
- ✅ Bairro
- ✅ Cidade
- ✅ Estado
- ✅ Telefone
- ✅ Email

### 5. **Validações e Alertas**
- ✅ Valida CNPJ antes de buscar
- ✅ Alerta se empresa inativa
- ✅ Toast de sucesso com ícone 🏢
- ✅ Toast de erro se CNPJ não encontrado
- ✅ Mensagem de erro se API falhar

## 🎨 Interface

### Botão de Busca
```jsx
<button
  onClick={handleCNPJSearch}
  disabled={cnpj.length !== 14 || isLoadingCNPJ}
  className="px-4 py-3 bg-green-600 hover:bg-green-700 
             disabled:bg-neutral-400 text-white rounded-xl 
             shadow-lg shadow-green-600/30"
>
  {isLoadingCNPJ ? (
    <>
      <Loader className="w-4 h-4 animate-spin" />
      Buscando...
    </>
  ) : (
    <>
      <Download className="w-4 h-4" />
      Buscar
    </>
  )}
</button>
```

### Texto de Ajuda
```
"Digite o CNPJ e clique em 'Buscar' para preencher automaticamente"
```

## 📊 Fluxo de Uso

```
1. Usuário seleciona "Pessoa Jurídica"
   ↓
2. Digite o CNPJ (formatação automática)
   ↓
3. Clica no botão "Buscar" (verde com ícone)
   ↓
4. Sistema valida CNPJ
   ↓
5. Consulta BrasilAPI
   ↓
6. Se falhar, tenta ReceitaWS
   ↓
7. Preenche todos os campos automaticamente
   ↓
8. Exibe toast de sucesso 🏢
   ↓
9. Usuário revisa e completa dados faltantes
```

## 🔧 Funções Principais

### `consultarCNPJ(cnpj)`
Consulta dados da empresa nas APIs públicas.

**Retorno:**
```javascript
{
  success: true,
  data: {
    cnpj, razaoSocial, nomeFantasia,
    cep, logradouro, numero, complemento,
    bairro, cidade, estado,
    telefone, email,
    situacaoCadastral, dataAbertura, ...
  }
}
```

### `validarSituacaoEmpresa(situacao)`
Verifica se a empresa está ativa.

### `formatarCNPJExibicao(cnpj)`
Formata CNPJ para exibição (00.000.000/0000-00).

## 🎯 Benefícios

1. **Agilidade**: Preenche 10+ campos em 1 clique
2. **Precisão**: Dados direto da Receita Federal
3. **UX Premium**: Interface fluida e intuitiva
4. **Confiabilidade**: Dupla API (BrasilAPI + ReceitaWS)
5. **Validação**: Garante CNPJ válido antes de buscar

## 📝 Exemplo de Uso

```javascript
// Usuário digita: 00000000000191
// Sistema formata: 00.000.000/0001-91
// Clica em "Buscar"
// Sistema preenche:
{
  razaoSocial: "BANCO DO BRASIL S.A.",
  nomeFantasia: "BANCO DO BRASIL",
  cep: "70040-020",
  address: "SBS Quadra 1 Bloco A",
  number: "S/N",
  neighborhood: "Asa Sul",
  city: "Brasília",
  state: "DF",
  phone: "(61) 3493-9002",
  email: "ouvidoria@bb.com.br"
}
```

## ✨ Diferenciais

- ✅ Botão verde destacado (padrão "ação positiva")
- ✅ Ícone de Download (sugere "puxar dados")
- ✅ Loading animado durante busca
- ✅ Feedback visual em tempo real
- ✅ Mantém dados já digitados (não sobrescreve tudo)
- ✅ Alerta se empresa inativa
- ✅ Tooltip explicativo
- ✅ Integração perfeita com validações existentes

## 🚀 Status

**Implementação: 100% Completa**
**Testes: Prontos para produção**
**Integração: Totalmente funcional**

A busca automática de CNPJ está pronta e integrada ao modal de cadastro de clientes! 🎉
