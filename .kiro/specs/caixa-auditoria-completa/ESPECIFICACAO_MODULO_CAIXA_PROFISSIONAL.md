# 📊 ESPECIFICAÇÃO COMPLETA: MÓDULO DE CAIXA PROFISSIONAL

**Sistema:** TORQ - Gestão Automotiva  
**Módulo:** Controle de Caixa Financeiro  
**Versão:** 1.0  
**Data:** 21 de Janeiro de 2025  
**Status:** 🔴 **ESPECIFICAÇÃO APROVADA - AGUARDANDO IMPLEMENTAÇÃO**

---

## 🎯 OBJETIVO DO MÓDULO

Criar um **módulo de controle de caixa financeiro completo e profissional** que:
- Controle dinheiro físico (entrada/saída)
- Registre todas as movimentações
- Permita abertura/fechamento de caixa
- Implemente sangria e reforço
- Gere relatórios de auditoria
- Previna fraudes e erros
- Seja à prova de falhas

---

## 📐 ARQUITETURA DO SISTEMA

### 1. ESTRUTURA DE DADOS (FIRESTORE)

#### Collection: `caixas`
```javascript
{
  // Identificação
  id: "caixa_20250121_001", // Auto-gerado
  numero: 1, // Número sequencial do dia
  empresaId: "empresa_123",
  pontoVenda: "PDV_01",
  
  // Status e Controle
  status: "aberto" | "fechado" | "cancelado" | "reaberto",
  turno: "manha" | "tarde" | "noite" | "integral",
  
  // Datas e Timestamps
  dataAbertura: Timestamp,
  dataFechamento: Timestamp | null,
  dataReabertura: Timestamp | null,
  dataCancelamento: Timestamp | null,
  
  // Usuários Responsáveis
  operadorAbertura: {
    uid: "user_123",
    nome: "João Silva",
    email: "joao@empresa.com"
  },
  operadorFechamento: {
    uid: "user_456",
    nome: "Maria Santos",
    email: "maria@empresa.com"
  } | null,
  
  // Valores Financeiros
  saldoInicial: 100.00, // Troco inicial
  
  entradas: {
    dinheiro: 450.00,
    pix: 200.00,
    cartaoDebito: 150.00,
    cartaoCredito: 300.00,
    cheque: 0.00,
    outros: 0.00,
    total: 1100.00
  },
  
  saidas: {
    sangrias: 500.00,
    estornos: 0.00,
    total: 500.00
  },
  
  reforcos: {
    troco: 50.00,
    total: 50.00
  },
  
  // Cálculos
  saldoEsperado: 650.00, // saldoInicial + entradas.dinheiro - saidas + reforcos
  saldoContado: 650.00, // Valor contado no fechamento
  diferenca: 0.00, // saldoContado - saldoEsperado
  
  // Estatísticas
  totalVendas: 15,
  totalItensVendidos: 45,
  ticketMedio: 73.33,
  
  // Observações e Justificativas
  observacoesAbertura: "Troco inicial conferido",
  observacoesFechamento: "Caixa conferido e correto",
  justificativaDiferenca: "" | "Nota de R$ 10 rasgada",
  
  // Auditoria
  movimentacoes: [
    {
      id: "mov_001",
      tipo: "abertura" | "venda" | "sangria" | "reforco" | "estorno" | "fechamento",
      valor: 100.00,
      formaPagamento: "dinheiro" | "pix" | "cartao_debito" | "cartao_credito" | null,
      timestamp: Timestamp,
      usuario: {
        uid: "user_123",
        nome: "João Silva"
      },
      observacao: "Troco inicial",
      vendaId: "venda_123" | null,
      autorizadoPor: {
        uid: "user_456",
        nome: "Gerente Maria"
      } | null,
      comprovante: "url_foto" | null
    }
  ],
  
  // Metadados
  createdAt: Timestamp,
  updatedAt: Timestamp,
  version: 1
}
```

#### Collection: `vendas` (ATUALIZADA)
```javascript
{
  // ... campos existentes ...
  
  // NOVOS CAMPOS OBRIGATÓRIOS:
  caixaId: "caixa_20250121_001", // Vínculo com caixa
  caixaNumero: 1, // Número do caixa
  operadorCaixa: {
    uid: "user_123",
    nome: "João Silva"
  },
  
  // Detalhamento de pagamento
  pagamentos: [
    {
      metodo: "dinheiro",
      valor: 50.00,
      troco: 0.00,
      parcelas: 1,
      valorParcela: 50.00,
      observacoes: "",
      cardData: null
    }
  ],
  
  // Controle de caixa
  afetaCaixaFisico: true, // false para PIX, cartão
  valorCaixaFisico: 50.00, // Apenas dinheiro
  
  // Status de cancelamento
  cancelada: false,
  motivoCancelamento: "" | "Cliente desistiu",
  dataCancelamento: Timestamp | null,
  estornoRegistrado: false
}
```

---

## 🎨 INTERFACE DO USUÁRIO

### 1. PÁGINA PRINCIPAL: `/caixa`

#### Estado: CAIXA FECHADO
```
┌─────────────────────────────────────────────────────────┐
│  🏦 CONTROLE DE CAIXA                                   │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  ⚠️ CAIXA FECHADO                                  │ │
│  │                                                     │ │
│  │  Para iniciar as vendas, você precisa abrir o     │ │
│  │  caixa e informar o troco inicial.                │ │
│  │                                                     │ │
│  │  [🔓 ABRIR CAIXA]                                  │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  📊 Histórico de Caixas                                 │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Caixa #45 - 20/01/2025                             │ │
│  │ Operador: João Silva                               │ │
│  │ Saldo: R$ 1.250,00 | Diferença: R$ 0,00 ✅        │ │
│  │ [Ver Detalhes]                                     │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### Estado: CAIXA ABERTO
```
┌─────────────────────────────────────────────────────────┐
│  🏦 CONTROLE DE CAIXA                                   │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  ✅ CAIXA ABERTO - #46                             │ │
│  │  Operador: João Silva                              │ │
│  │  Aberto às: 08:00 (há 2h 30min)                   │ │
│  │                                                     │ │
│  │  💰 Saldo Atual (Estimado)                         │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │ Saldo Inicial:        R$    100,00           │ │ │
│  │  │ Entradas (Dinheiro):  R$    450,00           │ │ │
│  │  │ Sangrias:             R$   -300,00           │ │ │
│  │  │ Reforços:             R$     50,00           │ │ │
│  │  │ ─────────────────────────────────────        │ │ │
│  │  │ SALDO ESPERADO:       R$    300,00           │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │                                                     │ │
│  │  📊 Resumo do Dia                                  │ │
│  │  • Vendas: 12 (R$ 850,00)                         │ │
│  │  • Dinheiro: R$ 450,00                            │ │
│  │  • PIX: R$ 200,00                                 │ │
│  │  • Cartões: R$ 200,00                             │ │
│  │                                                     │ │
│  │  [💸 SANGRIA] [💵 REFORÇO] [🔒 FECHAR CAIXA]      │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  🛒 PONTO DE VENDA                                      │
│  [Ir para PDV →]                                        │
└─────────────────────────────────────────────────────────┘
```

---

### 2. MODAL: ABERTURA DE CAIXA

```
┌─────────────────────────────────────────────────────────┐
│  🔓 ABERTURA DE CAIXA                                   │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  📅 Data: 21/01/2025                                    │
│  🕐 Hora: 08:00                                         │
│  👤 Operador: João Silva                                │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  💰 TROCO INICIAL                                  │ │
│  │                                                     │ │
│  │  Informe o valor em dinheiro que está no caixa    │ │
│  │  para iniciar as vendas:                           │ │
│  │                                                     │ │
│  │  R$ [_______100,00_______]                         │ │
│  │                                                     │ │
│  │  💡 Dica: Conte o dinheiro antes de informar       │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  🎯 TURNO                                           │ │
│  │  ○ Manhã (06:00 - 12:00)                           │ │
│  │  ● Tarde (12:00 - 18:00)                           │ │
│  │  ○ Noite (18:00 - 00:00)                           │ │
│  │  ○ Integral (06:00 - 00:00)                        │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  📝 Observações (opcional):                             │
│  ┌────────────────────────────────────────────────────┐ │
│  │ [Troco conferido e correto]                        │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ⚠️ ATENÇÃO:                                            │
│  • Confira o dinheiro antes de abrir o caixa           │
│  • Após abrir, você poderá fazer vendas                │
│  • Registre sangrias e reforços durante o dia          │
│                                                          │
│  [Cancelar]  [✅ ABRIR CAIXA]                           │
└─────────────────────────────────────────────────────────┘
```

---

### 3. MODAL: SANGRIA

```
┌─────────────────────────────────────────────────────────┐
│  💸 SANGRIA DE CAIXA                                    │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  📊 Situação Atual do Caixa:                            │
│  • Saldo Esperado: R$ 500,00                            │
│  • Última Sangria: há 2 horas (R$ 200,00)              │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  💰 VALOR DA SANGRIA                               │ │
│  │                                                     │ │
│  │  R$ [_______300,00_______]                         │ │
│  │                                                     │ │
│  │  ⚠️ Saldo após sangria: R$ 200,00                  │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  📝 MOTIVO DA SANGRIA                              │ │
│  │  ● Retirada para cofre                             │ │
│  │  ○ Depósito bancário                               │ │
│  │  ○ Pagamento de fornecedor                         │ │
│  │  ○ Outro (especificar)                             │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  📝 Observações:                                        │
│  ┌────────────────────────────────────────────────────┐ │
│  │ [Retirada para cofre - caixa com muito dinheiro]  │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  📸 Comprovante (opcional):                             │
│  [📷 Tirar Foto] [📁 Anexar Arquivo]                   │
│                                                          │
│  🔐 AUTORIZAÇÃO NECESSÁRIA:                             │
│  Esta operação requer autorização de um gerente.       │
│                                                          │
│  Gerente: [Maria Santos ▼]                             │
│  Senha: [••••••••]                                      │
│                                                          │
│  [Cancelar]  [✅ CONFIRMAR SANGRIA]                     │
└─────────────────────────────────────────────────────────┘
```

---

### 4. MODAL: FECHAMENTO DE CAIXA

```
┌─────────────────────────────────────────────────────────┐
│  🔒 FECHAMENTO DE CAIXA                                 │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  📊 RESUMO DO CAIXA #46                                 │
│  Operador: João Silva                                   │
│  Aberto às: 08:00 | Fechando às: 18:00 (10h)           │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  💰 MOVIMENTAÇÕES DO DIA                           │ │
│  │                                                     │ │
│  │  Saldo Inicial:           R$    100,00             │ │
│  │  ─────────────────────────────────────             │ │
│  │  ENTRADAS:                                         │ │
│  │  • Dinheiro (15 vendas):  R$    450,00             │ │
│  │  • PIX (8 vendas):        R$    200,00 ℹ️          │ │
│  │  • Cartão Débito:         R$    150,00 ℹ️          │ │
│  │  • Cartão Crédito:        R$    300,00 ℹ️          │ │
│  │  ─────────────────────────────────────             │ │
│  │  SAÍDAS:                                           │ │
│  │  • Sangrias (2x):         R$   -500,00             │ │
│  │  • Estornos:              R$      0,00             │ │
│  │  ─────────────────────────────────────             │ │
│  │  REFORÇOS:                                         │ │
│  │  • Troco (1x):            R$     50,00             │ │
│  │  ─────────────────────────────────────             │ │
│  │  SALDO ESPERADO:          R$    100,00             │ │
│  │  (apenas dinheiro físico)                          │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ℹ️ Valores em PIX e cartão não entram no caixa físico │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  💵 CONTAGEM DO CAIXA                              │ │
│  │                                                     │ │
│  │  Conte o dinheiro físico no caixa:                 │ │
│  │                                                     │ │
│  │  R$ [_______100,00_______]                         │ │
│  │                                                     │ │
│  │  ✅ DIFERENÇA: R$ 0,00                             │ │
│  │  Caixa está correto!                               │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  📝 Observações do Fechamento:                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ [Caixa conferido e correto]                        │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  📸 Foto do Dinheiro (opcional mas recomendado):        │
│  [📷 Tirar Foto]                                        │
│                                                          │
│  [Cancelar]  [✅ FECHAR CAIXA]                          │
└─────────────────────────────────────────────────────────┘
```

#### CASO: DIFERENÇA DETECTADA

```
┌─────────────────────────────────────────────────────────┐
│  ⚠️ DIFERENÇA DETECTADA NO CAIXA                        │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  Saldo Esperado:  R$ 100,00                             │
│  Saldo Contado:   R$  90,00                             │
│  ─────────────────────────────────────────────────────  │
│  DIFERENÇA:       R$ -10,00 (faltando)                  │
│                                                          │
│  ⚠️ Esta diferença precisa ser justificada.             │
│                                                          │
│  📝 Justificativa (obrigatória):                        │
│  ┌────────────────────────────────────────────────────┐ │
│  │ [Nota de R$ 10 rasgada e descartada]              │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  🔐 AUTORIZAÇÃO NECESSÁRIA:                             │
│  Diferenças acima de R$ 5,00 requerem autorização.     │
│                                                          │
│  Gerente: [Maria Santos ▼]                             │
│  Senha: [••••••••]                                      │
│                                                          │
│  📸 Comprovante (obrigatório para diferenças > R$ 10):  │
│  [📷 Tirar Foto] [📁 Anexar Arquivo]                   │
│                                                          │
│  [Cancelar]  [✅ CONFIRMAR FECHAMENTO]                  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 REGRAS DE NEGÓCIO

### 1. ABERTURA DE CAIXA

**Validações:**
- ✅ Apenas um caixa aberto por operador
- ✅ Apenas um caixa aberto por ponto de venda
- ✅ Saldo inicial deve ser maior que R$ 0,00
- ✅ Turno deve ser selecionado
- ✅ Operador deve estar autenticado

**Ações:**
1. Criar registro em `caixas` com status "aberto"
2. Registrar movimentação de "abertura"
3. Atualizar estado global do sistema
4. Liberar acesso ao PDV

---

### 2. VENDAS

**Validações:**
- ✅ Deve haver caixa aberto
- ✅ Venda deve ser vinculada ao caixa (`caixaId`)
- ✅ Pagamentos devem ser registrados corretamente
- ✅ Apenas dinheiro afeta caixa físico

**Ações:**
1. Salvar venda com `caixaId`
2. Registrar movimentação no caixa
3. Atualizar entradas por forma de pagamento
4. Calcular saldo esperado

---

### 3. SANGRIA

**Validações:**
- ✅ Caixa deve estar aberto
- ✅ Valor deve ser maior que R$ 0,00
- ✅ Valor não pode ser maior que saldo atual
- ✅ Motivo deve ser informado
- ✅ Autorização de gerente obrigatória se valor > R$ 100,00

**Ações:**
1. Registrar movimentação de "sangria"
2. Atualizar saídas do caixa
3. Recalcular saldo esperado
4. Salvar comprovante (se houver)
5. Registrar autorização

---

### 4. REFORÇO

**Validações:**
- ✅ Caixa deve estar aberto
- ✅ Valor deve ser maior que R$ 0,00
- ✅ Motivo deve ser informado
- ✅ Autorização de gerente obrigatória

**Ações:**
1. Registrar movimentação de "reforco"
2. Atualizar reforços do caixa
3. Recalcular saldo esperado
4. Registrar autorização

---

### 5. FECHAMENTO DE CAIXA

**Validações:**
- ✅ Caixa deve estar aberto
- ✅ Saldo contado deve ser informado
- ✅ Se diferença > R$ 5,00: Justificativa obrigatória
- ✅ Se diferença > R$ 10,00: Autorização obrigatória
- ✅ Se diferença > R$ 50,00: Comprovante obrigatório

**Ações:**
1. Calcular diferença (saldoContado - saldoEsperado)
2. Registrar movimentação de "fechamento"
3. Atualizar status para "fechado"
4. Gerar relatório PDF
5. Enviar notificação para gerente (se houver diferença)
6. Bloquear novas vendas neste caixa

---

### 6. CANCELAMENTO DE VENDA

**Validações:**
- ✅ Venda deve existir
- ✅ Venda não pode estar cancelada
- ✅ Motivo deve ser informado
- ✅ Autorização de gerente obrigatória
- ✅ Caixa da venda deve estar identificado

**Ações:**
1. Marcar venda como cancelada
2. Reverter estoque
3. **NOVO:** Registrar estorno no caixa
4. **NOVO:** Atualizar saídas do caixa
5. **NOVO:** Recalcular saldo esperado
6. Registrar autorização

---

## 🔒 PERMISSÕES POR PERFIL

### 👤 OPERADOR (Caixa)
- ✅ Abrir caixa
- ✅ Fazer vendas
- ✅ Solicitar sangria (com autorização)
- ✅ Solicitar reforço (com autorização)
- ✅ Fechar caixa
- ❌ Ver caixas de outros operadores
- ❌ Reabrir caixa fechado
- ❌ Cancelar vendas sem autorização

### 👔 GERENTE
- ✅ Todas as permissões do operador
- ✅ Autorizar sangrias
- ✅ Autorizar reforços
- ✅ Autorizar cancelamentos
- ✅ Ver todos os caixas
- ✅ Reabrir caixa fechado (com justificativa)
- ✅ Auditar movimentações
- ✅ Exportar relatórios

### 💼 DONO DO NEGÓCIO
- ✅ Todas as permissões do gerente
- ✅ Ver dashboard de caixas
- ✅ Ver performance por operador
- ✅ Ver histórico completo
- ✅ Configurar limites e regras
- ✅ Exportar dados para contabilidade

---

## 📊 RELATÓRIOS

### 1. RELATÓRIO DE FECHAMENTO DE CAIXA (PDF)

**Conteúdo:**
- Cabeçalho com logo e dados da empresa
- Número do caixa e data
- Operador responsável
- Horário de abertura e fechamento
- Resumo de movimentações
- Detalhamento de vendas
- Sangrias e reforços
- Saldo esperado vs contado
- Diferença (se houver)
- Justificativa (se houver)
- Assinatura digital do operador
- Assinatura digital do gerente (se houver autorização)

### 2. RELATÓRIO DE AUDITORIA

**Filtros:**
- Período (data inicial e final)
- Operador
- Status (aberto, fechado, cancelado)
- Com diferença / Sem diferença
- Turno

**Colunas:**
- Número do caixa
- Data
- Operador
- Saldo inicial
- Total de vendas
- Sangrias
- Reforços
- Saldo esperado
- Saldo contado
- Diferença
- Status
- Ações (Ver detalhes, Baixar PDF)

### 3. DASHBOARD DE CAIXAS

**Métricas:**
- Caixas abertos agora
- Total de vendas hoje
- Ticket médio
- Performance por operador
- Divergências do mês
- Gráfico de vendas por hora
- Gráfico de formas de pagamento

---

## 🚀 IMPLEMENTAÇÃO

### FASE 1: ESTRUTURA BÁSICA (1 semana)
- [ ] Criar collection `caixas` no Firestore
- [ ] Criar store Zustand para estado do caixa
- [ ] Criar página `/caixa` com estados
- [ ] Implementar modal de abertura
- [ ] Implementar modal de fechamento
- [ ] Vincular vendas ao caixa

### FASE 2: MOVIMENTAÇÕES (1 semana)
- [ ] Implementar sangria
- [ ] Implementar reforço
- [ ] Implementar estorno de cancelamento
- [ ] Validações de segurança
- [ ] Sistema de autorização

### FASE 3: RELATÓRIOS (1 semana)
- [ ] Relatório de fechamento (PDF)
- [ ] Histórico de caixas
- [ ] Filtros e busca
- [ ] Exportação de dados

### FASE 4: AUDITORIA E DASHBOARD (1 semana)
- [ ] Dashboard de caixas
- [ ] Análise de divergências
- [ ] Performance por operador
- [ ] Alertas e notificações

### FASE 5: TESTES E AJUSTES (1 semana)
- [ ] Testes com usuários reais
- [ ] Ajustes de UX
- [ ] Correção de bugs
- [ ] Documentação final

---

## ✅ CRITÉRIOS DE ACEITAÇÃO

### MÍNIMO VIÁVEL (MVP):
- ✅ Abertura de caixa com saldo inicial
- ✅ Vendas vinculadas ao caixa
- ✅ Fechamento com conferência
- ✅ Cálculo correto de diferença
- ✅ Relatório de fechamento (PDF)

### COMPLETO:
- ✅ Sangria com autorização
- ✅ Reforço com autorização
- ✅ Estorno de cancelamento
- ✅ Histórico de caixas
- ✅ Dashboard gerencial
- ✅ Permissões por perfil
- ✅ Alertas de divergência

### PROFISSIONAL:
- ✅ Foto do dinheiro
- ✅ Assinatura digital
- ✅ Auditoria completa
- ✅ Exportação para contabilidade
- ✅ Modo offline
- ✅ Backup automático

---

**Aprovação:**  
[ ] Desenvolvedor  
[ ] Gerente de Produto  
[ ] Stakeholder  

**Data de Aprovação:** ___/___/_____  
**Prazo de Entrega:** ___/___/_____
