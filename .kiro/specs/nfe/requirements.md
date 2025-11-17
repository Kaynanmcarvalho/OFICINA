# 📄 NF-e (Nota Fiscal Eletrônica) - Requisitos

## 📋 Visão Geral

**Funcionalidade**: Sistema de geração, assinatura e envio de Notas Fiscais Eletrônicas  
**Prioridade**: Média  
**Estimativa**: 60 horas  
**Sprint**: Março 2025 (Semanas 1-3)  
**Status**: 📋 Planejado  

---

## 🎯 Objetivos

### Objetivo Principal
Automatizar a emissão de Notas Fiscais Eletrônicas de Serviço (NFS-e) conforme padrões SEFAZ, permitindo que oficinas cumpram obrigações fiscais de forma simples e integrada ao sistema de orçamentos.

### Objetivos Específicos
1. Gerar XML conforme schema SEFAZ
2. Assinar digitalmente com certificado A1
3. Enviar para SEFAZ e processar retorno
4. Gerar DANFE (PDF) para impressão
5. Manter histórico completo de NF-es
6. Integrar com sistema de orçamentos
7. Suportar múltiplos estados (SP, RJ, MG, etc)

---

## 👥 Personas e Casos de Uso

### Persona 1: Contador/Responsável Fiscal
**Necessidade**: Emitir NF-es de forma rápida e correta  
**Caso de Uso**:
- Configurar certificado digital A1
- Definir séries e numeração
- Emitir NF-e a partir de orçamento aprovado
- Consultar status de envio
- Baixar XML e PDF
- Gerar relatórios fiscais

### Persona 2: Atendente/Mecânico
**Necessidade**: Emitir NF-e após conclusão do serviço  
**Caso de Uso**:
- Clicar em "Emitir NF-e" no orçamento
- Revisar dados pré-preenchidos
- Confirmar emissão
- Imprimir DANFE para cliente

### Persona 3: Proprietário da Oficina
**Necessidade**: Conformidade fiscal e controle  
**Caso de Uso**:
- Monitorar NF-es emitidas
- Identificar pendências
- Gerar relatórios de faturamento
- Auditar emissões

---

## 📊 Requisitos Funcionais

### RF01: Configuração Inicial
**Prioridade**: Alta  
**Descrição**: Configurar dados da empresa e certificado

**Critérios de Aceitação**:
- [ ] Upload de certificado A1 (.pfx)
- [ ] Senha do certificado (criptografada)
- [ ] Dados da empresa (CNPJ, IE, endereço)
- [ ] Configuração por estado
- [ ] Séries e numeração inicial
- [ ] Ambiente (homologação/produção)
- [ ] Validação de certificado (validade, CNPJ)

### RF02: Geração de XML
**Prioridade**: Alta  
**Descrição**: Gerar XML conforme schema SEFAZ

**Critérios de Aceitação**:
- [ ] Preencher dados do emitente
- [ ] Preencher dados do destinatário
- [ ] Listar itens (serviços/peças)
- [ ] Calcular impostos (ICMS, PIS, COFINS, ISS)
- [ ] Calcular totais
- [ ] Gerar chave de acesso (44 dígitos)
- [ ] Validar XML contra schema XSD
- [ ] Suportar múltiplos modelos (55, 65)

### RF03: Assinatura Digital
**Prioridade**: Alta  
**Descrição**: Assinar XML com certificado A1

**Critérios de Aceitação**:
- [ ] Carregar certificado do Secret Manager
- [ ] Assinar XML com algoritmo correto
- [ ] Validar assinatura
- [ ] Incluir certificado no XML
- [ ] Logs de assinatura

### RF04: Envio para SEFAZ
**Prioridade**: Alta  
**Descrição**: Enviar XML assinado para SEFAZ

**Critérios de Aceitação**:
- [ ] Conectar com webservice SEFAZ
- [ ] Enviar XML via SOAP
- [ ] Processar retorno (autorizada/rejeitada)
- [ ] Salvar protocolo de autorização
- [ ] Retry automático em caso de erro
- [ ] Timeout de 30s
- [ ] Logs detalhados

### RF05: Geração de DANFE
**Prioridade**: Alta  
**Descrição**: Gerar PDF do DANFE

**Critérios de Aceitação**:
- [ ] Layout conforme padrão SEFAZ
- [ ] QR Code (NFC-e)
- [ ] Código de barras (chave de acesso)
- [ ] Dados completos da NF-e
- [ ] Logo da empresa
- [ ] Observações adicionais
- [ ] Salvar em Storage

### RF06: Consulta de Status
**Prioridade**: Média  
**Descrição**: Consultar status de NF-e na SEFAZ

**Critérios de Aceitação**:
- [ ] Consultar por chave de acesso
- [ ] Atualizar status local
- [ ] Exibir mensagens de erro
- [ ] Histórico de consultas

### RF07: Cancelamento
**Prioridade**: Média  
**Descrição**: Cancelar NF-e autorizada

**Critérios de Aceitação**:
- [ ] Validar prazo (24h)
- [ ] Gerar evento de cancelamento
- [ ] Assinar evento
- [ ] Enviar para SEFAZ
- [ ] Atualizar status
- [ ] Gerar PDF de cancelamento

### RF08: Carta de Correção
**Prioridade**: Baixa  
**Descrição**: Emitir carta de correção eletrônica

**Critérios de Aceitação**:
- [ ] Validar campos corrigíveis
- [ ] Gerar evento CC-e
- [ ] Assinar e enviar
- [ ] Atualizar histórico

### RF09: Integração com Orçamentos
**Prioridade**: Alta  
**Descrição**: Emitir NF-e a partir de orçamento

**Critérios de Aceitação**:
- [ ] Botão "Emitir NF-e" em orçamento aprovado
- [ ] Pré-preencher dados do orçamento
- [ ] Validar dados obrigatórios
- [ ] Vincular NF-e ao orçamento
- [ ] Atualizar status do orçamento

### RF10: Relatórios
**Prioridade**: Média  
**Descrição**: Gerar relatórios fiscais

**Critérios de Aceitação**:
- [ ] Relatório de NF-es emitidas (período)
- [ ] Relatório de faturamento
- [ ] Relatório de impostos
- [ ] Exportar para Excel/PDF
- [ ] Filtros avançados

---

## 🔒 Requisitos Não-Funcionais

### RNF01: Segurança
- Certificado armazenado em Secret Manager
- Senha criptografada (AES-256)
- Comunicação HTTPS/TLS
- Logs de auditoria completos
- Acesso restrito (roles)

### RNF02: Performance
- Geração de XML: < 2s
- Assinatura: < 1s
- Envio SEFAZ: < 10s
- Geração DANFE: < 3s
- Processamento em fila (assíncrono)

### RNF03: Confiabilidade
- Retry automático (3 tentativas)
- Fila de processamento (Cloud Tasks)
- Fallback para contingência
- Backup de XMLs
- Uptime > 99.5%

### RNF04: Conformidade
- 100% conforme schemas SEFAZ
- Validação rigorosa de dados
- Numeração sequencial garantida
- Auditoria completa
- Conformidade com NT (Nota Técnica) vigente

### RNF05: Usabilidade
- Interface intuitiva
- Wizard de configuração
- Validação em tempo real
- Mensagens de erro claras
- Suporte dark/light mode

---

## 🗄️ Modelo de Dados

### Collection: `nfe`

```typescript
interface NFe {
  id: string;
  empresaId: string;
  budgetId?: string;
  
  // Identificação
  numero: number;
  serie: number;
  tipo: 'entrada' | 'saida';
  modelo: '55' | '65'; // 55=NF-e, 65=NFC-e
  
  // Emitente
  emitente: {
    cnpj: string;
    razaoSocial: string;
    nomeFantasia: string;
    endereco: Endereco;
    ie: string;
    crt: number; // Regime tributário
  };
  
  // Destinatário
  destinatario: {
    cpfCnpj: string;
    nome: string;
    endereco: Endereco;
    email?: string;
    telefone?: string;
  };
  
  // Itens
  itens: ItemNFe[];
  
  // Totais
  totais: {
    baseCalculo: number;
    valorICMS: number;
    valorPIS: number;
    valorCOFINS: number;
    valorISS: number;
    valorTotal: number;
  };
  
  // Status
  status: 'pendente' | 'processando' | 'autorizada' | 'rejeitada' | 'cancelada';
  chaveAcesso: string;
  protocolo?: string;
  dataAutorizacao?: Timestamp;
  motivoRejeicao?: string;
  
  // XMLs
  xmlGerado: string;
  xmlAssinado: string;
  xmlRetorno?: string;
  
  // DANFE
  danfePdf?: string; // URL Storage
  
  // Metadados
  ambiente: 'homologacao' | 'producao';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

interface ItemNFe {
  numero: number;
  codigo: string;
  descricao: string;
  ncm: string;
  cfop: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  impostos: {
    icms: ImpostoICMS;
    pis: ImpostoPIS;
    cofins: ImpostoCOFINS;
    iss?: ImpostoISS;
  };
}

interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}
```

### Collection: `nfe_config`

```typescript
interface NFEConfig {
  id: string; // empresaId
  
  // Certificado
  certificado: {
    arquivo: string; // Secret Manager reference
    senha: string; // Encrypted
    validade: Timestamp;
    cnpj: string;
  };
  
  // Configuração
  series: {
    nfe: number;
    nfce: number;
  };
  
  proximoNumero: {
    nfe: number;
    nfce: number;
  };
  
  ambiente: 'homologacao' | 'producao';
  estado: string; // UF
  
  // Dados da empresa
  empresa: {
    cnpj: string;
    razaoSocial: string;
    nomeFantasia: string;
    ie: string;
    crt: number;
    endereco: Endereco;
    logo?: string;
  };
  
  // Configurações fiscais
  fiscal: {
    cfopPadrao: string;
    aliquotaICMS: number;
    aliquotaPIS: number;
    aliquotaCOFINS: number;
    aliquotaISS: number;
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## 🔌 Integrações

### SEFAZ Webservices

**Ambientes**:
- Homologação: URLs específicas por estado
- Produção: URLs específicas por estado

**Serviços**:
1. **NFeAutorizacao**: Envio de NF-e
2. **NFeRetAutorizacao**: Consulta de retorno
3. **NFeConsultaProtocolo**: Consulta de protocolo
4. **NFeStatusServico**: Status do serviço
5. **NFeInutilizacao**: Inutilização de numeração
6. **NFeRecepcaoEvento**: Cancelamento e CC-e

**Protocolo**: SOAP 1.2 com certificado digital

### Bibliotecas

**Backend**:
- `node-forge`: Assinatura digital
- `xml2js`: Manipulação de XML
- `soap`: Cliente SOAP
- `pdfkit`: Geração de PDF
- `qrcode`: QR Code para NFC-e
- `bwip-js`: Código de barras

---

## 🎨 Especificações de UI/UX

### Wizard de Configuração

```
Passo 1: Dados da Empresa
┌────────────────────────────────┐
│ CNPJ: [____________]           │
│ Razão Social: [______________] │
│ Nome Fantasia: [_____________] │
│ IE: [____________]             │
│ [Próximo]                      │
└────────────────────────────────┘

Passo 2: Certificado Digital
┌────────────────────────────────┐
│ Upload Certificado (.pfx)      │
│ [Selecionar Arquivo]           │
│ Senha: [____________]          │
│ [Validar Certificado]          │
│ [Voltar] [Próximo]             │
└────────────────────────────────┘

Passo 3: Configurações Fiscais
┌────────────────────────────────┐
│ Estado: [SP ▼]                 │
│ Ambiente: ○ Homologação        │
│           ● Produção           │
│ Série NF-e: [1]                │
│ Número Inicial: [1]            │
│ [Voltar] [Concluir]            │
└────────────────────────────────┘
```

### Modal de Emissão

```
┌─────────────────────────────────────────┐
│  Emitir NF-e - Orçamento #1234    [X]   │
├─────────────────────────────────────────┤
│  Destinatário                           │
│  Nome: João Silva                       │
│  CPF: 123.456.789-00                    │
│  [Editar]                               │
│                                          │
│  Itens (3)                              │
│  ┌────────────────────────────────────┐ │
│  │ Troca de óleo      R$ 150,00       │ │
│  │ Filtro de ar       R$ 80,00        │ │
│  │ Mão de obra        R$ 100,00       │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Total: R$ 330,00                       │
│  Impostos: R$ 45,00                     │
│                                          │
│  [Cancelar] [Emitir NF-e]               │
└─────────────────────────────────────────┘
```

### Lista de NF-es

```
┌─────────────────────────────────────────────────┐
│  NF-es Emitidas                                 │
│  [Filtros ▼] [Exportar]                        │
├─────────────────────────────────────────────────┤
│  #001 | João Silva | R$ 330,00 | ✅ Autorizada │
│  #002 | Maria Souza | R$ 450,00 | ⏳ Processando│
│  #003 | Pedro Lima | R$ 280,00 | ❌ Rejeitada  │
└─────────────────────────────────────────────────┘
```

---

## ✅ Critérios de Aceitação Geral

### Funcionalidade
- [ ] Emissão funciona em 100% dos casos válidos
- [ ] XMLs conformes com schema SEFAZ
- [ ] Assinatura digital válida
- [ ] Comunicação SEFAZ estável
- [ ] DANFE gerado corretamente

### Performance
- [ ] Emissão completa < 15s
- [ ] Processamento em fila
- [ ] Sem travamentos

### Segurança
- [ ] Certificado seguro
- [ ] Comunicação criptografada
- [ ] Auditoria completa
- [ ] Acesso controlado

### Conformidade
- [ ] 100% conforme SEFAZ
- [ ] Validação rigorosa
- [ ] Numeração sequencial
- [ ] Logs de auditoria

---

## 🚫 Fora do Escopo (v1)

- NF-e de produto (apenas serviço)
- Manifesto do Destinatário
- CT-e (Conhecimento de Transporte)
- MDF-e (Manifesto de Documentos Fiscais)
- Integração com ERP externo
- Emissão em lote

---

## 📅 Cronograma

### Semana 1: Backend (20h)
- Geração de XML
- Assinatura digital
- Integração SEFAZ

### Semana 2: Frontend (20h)
- Wizard de configuração
- Modal de emissão
- Lista de NF-es

### Semana 3: Testes e Deploy (20h)
- Testes completos
- Documentação
- Deploy e homologação

---

**Documento criado**: 17 de Janeiro de 2025  
**Versão**: 1.0  
**Status**: 📋 Aprovado  
**Próximo**: Design detalhado
