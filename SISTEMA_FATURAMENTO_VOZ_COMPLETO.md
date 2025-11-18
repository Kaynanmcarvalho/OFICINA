# 🎤 Sistema de Faturamento por Voz - Arquitetura Completa

## 📋 Visão Geral

Sistema inteligente de faturamento por comando de voz que integra todas as funcionalidades do sistema:
- Busca de produtos no inventário
- Validação de clientes
- Emissão automática de NF-e e NFS-e
- Envio via WhatsApp

## 🏗️ Arquitetura

### 1. Fluxo de Processamento

```
Comando de Voz
    ↓
Reconhecimento de Intenção
    ↓
Validação de Dados
    ↓
Criação da Venda
    ↓
Emissão de Notas Fiscais
    ↓
Envio via WhatsApp
```

### 2. Componentes Principais

#### 2.1 Intent Recognizer (Reconhecimento de Intenção)
- Identifica comandos de faturamento
- Extrai entidades: produtos, serviços, clientes
- Diferencia NF-e (produto) de NFS-e (serviço)

#### 2.2 Invoice Service (Serviço de Faturamento)
- Valida produtos no inventário
- Verifica estoque e validade
- Busca dados do cliente
- Obtém configurações fiscais de /integrations
- Cria venda no /caixa
- Emite notas fiscais

#### 2.3 Fiscal Integration Service
- Busca CNPJ emissor
- Obtém certificado digital
- Valida configurações fiscais
- Integra com API de emissão

#### 2.4 WhatsApp Notification Service
- Envia NF-e em PDF
- Envia XML da nota
- Formata mensagens profissionais

## 📊 Casos de Uso

### Caso 1: Venda Simples
**Comando:** "Fatura o Óleo 5W30 para o cliente Kaynan"

**Processamento:**
1. Identifica produto: "Óleo 5W30"
2. Busca no inventário
3. Valida estoque
4. Busca cliente: "Kaynan"
5. Obtém configurações fiscais
6. Cria venda
7. Emite NF-e
8. Envia via WhatsApp

### Caso 2: Venda + Serviço
**Comando:** "Emite a Nota fiscal da venda do Óleo 5W30 e a Nota de serviço da troca de óleo para o cliente Kaynan"

**Processamento:**
1. Identifica 2 operações:
   - Venda de produto (NF-e)
   - Prestação de serviço (NFS-e)
2. Processa venda do produto
3. Processa serviço
4. Emite ambas as notas
5. Envia ambos XMLs via WhatsApp

### Caso 3: Múltiplos Produtos
**Comando:** "Fatura 2 litros de Óleo 5W30 e 1 filtro de óleo para João Silva"

**Processamento:**
1. Identifica múltiplos itens
2. Valida cada produto
3. Verifica estoque de todos
4. Cria venda com múltiplos itens
5. Emite NF-e única
6. Envia via WhatsApp

## 🔒 Validações e Segurança

### Validações Obrigatórias
- ✅ Produto existe no inventário
- ✅ Estoque disponível
- ✅ Produto não vencido
- ✅ Cliente cadastrado
- ✅ CNPJ emissor configurado
- ✅ Certificado digital válido
- ✅ Preço definido

### Tratamento de Erros
- ❌ Produto não encontrado → Sugestões similares
- ❌ Estoque insuficiente → Quantidade disponível
- ❌ Cliente não encontrado → Sugestões de nomes
- ❌ Configuração fiscal incompleta → Redireciona para /integrations
- ❌ Certificado vencido → Alerta para renovação

## 📦 Estrutura de Dados

### Invoice Request
```typescript
interface InvoiceRequest {
  type: 'nfe' | 'nfse' | 'both';
  items: InvoiceItem[];
  customer: Customer;
  fiscalConfig: FiscalConfig;
  paymentMethod?: string;
}

interface InvoiceItem {
  type: 'product' | 'service';
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  ncm?: string; // Para produtos
  cfop?: string;
}
```

### Fiscal Config (de /integrations)
```typescript
interface FiscalConfig {
  cnpj: string;
  razaoSocial: string;
  inscricaoEstadual: string;
  certificateDigital: {
    file: string;
    password: string;
    expiresAt: Date;
  };
  nfeConfig: {
    ambiente: 'producao' | 'homologacao';
    serie: number;
  };
  nfseConfig: {
    codigoMunicipio: string;
    inscricaoMunicipal: string;
  };
}
```

## 🔄 Integração com APIs Existentes

### API de Orçamentos (Reutilização)
- Mesma estrutura de envio WhatsApp
- Adaptação para enviar PDFs e XMLs
- Formatação de mensagens fiscais

### API de Emissão Fiscal
```javascript
// Endpoint para NF-e
POST /api/nfe/emitir
{
  "emissor": { /* dados do CNPJ */ },
  "destinatario": { /* dados do cliente */ },
  "itens": [ /* produtos */ ],
  "certificado": { /* certificado digital */ }
}

// Endpoint para NFS-e
POST /api/nfse/emitir
{
  "prestador": { /* dados do CNPJ */ },
  "tomador": { /* dados do cliente */ },
  "servicos": [ /* serviços */ ],
  "certificado": { /* certificado digital */ }
}
```

## 🎯 Comandos Suportados

### Padrões de Comando
1. **Venda Simples**
   - "Fatura [produto] para [cliente]"
   - "Vende [produto] para [cliente]"
   - "Emite nota de [produto] para [cliente]"

2. **Venda com Quantidade**
   - "Fatura [quantidade] [produto] para [cliente]"
   - "Vende [quantidade] de [produto] para [cliente]"

3. **Venda + Serviço**
   - "Emite nota de [produto] e serviço de [serviço] para [cliente]"
   - "Fatura [produto] e [serviço] para [cliente]"

4. **Múltiplos Itens**
   - "Fatura [produto1], [produto2] e [produto3] para [cliente]"

## 📱 Notificações WhatsApp

### Formato da Mensagem

```
🧾 *Nota Fiscal Emitida*

Olá *[Nome do Cliente]*!

Sua nota fiscal foi emitida com sucesso:

📄 *NF-e Nº:* 000123
💰 *Valor Total:* R$ 150,00
📅 *Data:* 18/11/2025

*Produtos:*
• Óleo 5W30 - R$ 120,00
• Filtro de Óleo - R$ 30,00

Os arquivos da nota fiscal estão sendo enviados...
```

### Arquivos Enviados
1. PDF da NF-e (visualização)
2. XML da NF-e (arquivo fiscal)
3. PDF da NFS-e (se houver serviço)
4. XML da NFS-e (se houver serviço)

## 🚀 Próximos Passos de Implementação

1. ✅ Criar serviço de reconhecimento de intenção fiscal
2. ✅ Implementar serviço de faturamento
3. ✅ Integrar com /integrations para buscar configs
4. ✅ Criar serviço de emissão de notas
5. ✅ Adaptar serviço WhatsApp para envio de documentos
6. ✅ Remover seção NF-e duplicada de /orcamento
7. ✅ Criar testes unitários
8. ✅ Documentar API

## 📝 Notas Técnicas

- Usar transações do Firestore para garantir consistência
- Implementar retry logic para APIs externas
- Cache de configurações fiscais (5 minutos)
- Logs detalhados para auditoria fiscal
- Backup automático de XMLs emitidos

---

**Status:** 🚧 Em Implementação
**Prioridade:** 🔴 Alta
**Complexidade:** ⭐⭐⭐⭐⭐ (Muito Alta)
