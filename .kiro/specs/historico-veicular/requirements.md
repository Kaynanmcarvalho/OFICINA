# 🚗 Histórico Veicular - Requisitos

## 📋 Visão Geral

**Funcionalidade**: Sistema de consulta e exibição de histórico completo de veículos  
**Prioridade**: Alta  
**Estimativa**: 40 horas  
**Sprint**: Fevereiro 2025 (Semanas 3-4)  
**Status**: 📋 Planejado  

---

## 🎯 Objetivos

### Objetivo Principal
Fornecer transparência total sobre o histórico de veículos através de consulta automatizada a fontes públicas, permitindo que oficinas e clientes tomem decisões informadas.

### Objetivos Específicos
1. Consultar recalls ativos de fabricantes
2. Identificar histórico de leilões (Detran)
3. Verificar sinistros e restrições (Sinesp)
4. Exibir informações de forma clara e visual
5. Manter cache inteligente para otimizar consultas
6. Garantir conformidade legal e ética

---

## 👥 Personas e Casos de Uso

### Persona 1: Mecânico/Atendente
**Necessidade**: Verificar histórico antes de aceitar veículo  
**Caso de Uso**:
- Ao cadastrar novo veículo, visualizar badge de alerta se houver recalls
- Clicar no badge para ver detalhes completos
- Informar cliente sobre recalls pendentes
- Documentar no check-in

### Persona 2: Proprietário da Oficina
**Necessidade**: Evitar riscos legais e reputacionais  
**Caso de Uso**:
- Identificar veículos com histórico de sinistro grave
- Recusar serviços em veículos roubados/recuperados sem documentação
- Manter registro de consultas para auditoria

### Persona 3: Cliente Final
**Necessidade**: Transparência sobre seu veículo  
**Caso de Uso**:
- Receber alerta sobre recalls ativos
- Entender histórico do veículo usado que comprou
- Agendar correção de recalls

---

## 📊 Requisitos Funcionais

### RF01: Consulta de Recalls
**Prioridade**: Alta  
**Descrição**: Consultar recalls ativos em bases oficiais

**Critérios de Aceitação**:
- [ ] Consultar base do Procon/Governo Federal
- [ ] Identificar recalls por placa e/ou chassi
- [ ] Exibir: campanha, descrição, gravidade, status
- [ ] Indicar se recall foi realizado
- [ ] Link para fonte oficial
- [ ] Cache de 7 dias

**Fontes**:
- https://www.gov.br/mj/pt-br/assuntos/seus-direitos/consumidor/recall
- API Procon (se disponível)
- Scraping de páginas públicas

### RF02: Consulta de Leilões
**Prioridade**: Média  
**Descrição**: Verificar se veículo passou por leilão

**Critérios de Aceitação**:
- [ ] Consultar bases de Detran estaduais
- [ ] Identificar leilões por placa
- [ ] Exibir: data, leiloeiro, motivo, status
- [ ] Indicar se foi vendido
- [ ] Cache de 30 dias

**Fontes**:
- Portais de Detran estaduais
- Leiloeiros oficiais (Sodré Santoro, etc)

### RF03: Consulta de Sinistros
**Prioridade**: Alta  
**Descrição**: Verificar histórico de sinistros e restrições

**Critérios de Aceitação**:
- [ ] Consultar Sinesp Cidadão (se permitido)
- [ ] Identificar: roubo, furto, sinistro
- [ ] Exibir status atual (recuperado, baixado, etc)
- [ ] Alertar sobre restrições ativas
- [ ] Cache de 24 horas

**Fontes**:
- Sinesp Cidadão (API oficial)
- Consulta via placa

### RF04: Badge Visual
**Prioridade**: Alta  
**Descrição**: Indicador visual no card do veículo

**Critérios de Aceitação**:
- [ ] Badge verde: sem pendências
- [ ] Badge amarelo: recalls pendentes
- [ ] Badge vermelho: sinistros/restrições
- [ ] Tooltip com resumo ao hover
- [ ] Click abre modal completo

### RF05: Modal de Detalhes
**Prioridade**: Alta  
**Descrição**: Visualização completa do histórico

**Critérios de Aceitação**:
- [ ] Tabs: Recalls, Leilões, Sinistros
- [ ] Timeline visual de eventos
- [ ] Links para fontes oficiais
- [ ] Botão "Atualizar dados"
- [ ] Indicador de última atualização
- [ ] Exportar PDF do histórico

### RF06: Sistema de Cache
**Prioridade**: Alta  
**Descrição**: Cache inteligente para otimizar consultas

**Critérios de Aceitação**:
- [ ] Armazenar em Firestore
- [ ] TTL configurável por tipo
- [ ] Atualização manual forçada
- [ ] Limpeza automática de cache expirado
- [ ] Indicador visual de cache vs. dados frescos

---

## 🔒 Requisitos Não-Funcionais

### RNF01: Performance
- Consulta inicial: < 10 segundos
- Consulta em cache: < 1 segundo
- Processamento paralelo de fontes
- Timeout de 15s por fonte

### RNF02: Segurança
- Respeitar robots.txt de todas as fontes
- Rate limiting: máx 10 req/min por fonte
- User-agent identificado
- Logs de todas as consultas
- Não armazenar dados sensíveis além do necessário

### RNF03: Conformidade Legal
- Apenas fontes públicas e legais
- Termos de uso respeitados
- Consentimento do usuário para consulta
- Dados armazenados conforme LGPD
- Auditoria de consultas

### RNF04: Confiabilidade
- Retry logic (3 tentativas)
- Fallback gracioso se fonte indisponível
- Logs detalhados de erros
- Alertas para administradores
- Uptime > 99%

### RNF05: Usabilidade
- Interface intuitiva
- Feedback visual durante consulta
- Mensagens de erro claras
- Suporte dark/light mode
- Responsivo (mobile-first)

---

## 🗄️ Modelo de Dados

### Collection: `vehicle_history`

```javascript
{
  id: "history_abc1234",
  placa: "ABC1234",
  chassi: "9BWZZZ377VT004251",
  empresaId: "empresa123",
  
  // Recalls
  recalls: [
    {
      id: "recall_001",
      fabricante: "Volkswagen",
      modelo: "Gol",
      ano: 2020,
      campanha: "2020/001",
      descricao: "Problema no sistema de airbag",
      gravidade: "alta", // baixa, media, alta, critica
      status: "pendente", // pendente, realizado, nao_aplicavel
      dataInicio: "2020-01-15",
      dataFim: "2025-12-31",
      fonte: "gov.br",
      url: "https://...",
      realizado: false,
      dataRealizacao: null
    }
  ],
  
  // Leilões
  leiloes: [
    {
      id: "leilao_001",
      leiloeiro: "Detran SP",
      data: "2019-05-20",
      motivo: "Recuperado de roubo",
      valor: 15000.00,
      status: "vendido", // vendido, nao_vendido, cancelado
      lote: "123/2019",
      fonte: "detran.sp.gov.br",
      url: "https://..."
    }
  ],
  
  // Sinistros e Restrições
  sinistros: [
    {
      id: "sinistro_001",
      tipo: "roubo", // roubo, furto, colisao, incendio
      gravidade: "alta",
      data: "2018-03-10",
      status: "recuperado", // ativo, recuperado, baixado
      seguradora: "Porto Seguro",
      indenizado: true,
      fonte: "sinesp",
      boletim: "BO-123456/2018"
    }
  ],
  
  restricoes: [
    {
      tipo: "judicial", // judicial, administrativa, financeira
      descricao: "Alienação fiduciária",
      status: "ativa",
      dataInicio: "2020-01-01",
      fonte: "detran"
    }
  ],
  
  // Metadados
  summary: {
    totalRecalls: 1,
    recallsPendentes: 1,
    temLeilao: true,
    temSinistro: true,
    temRestricao: true,
    risco: "alto" // baixo, medio, alto
  },
  
  lastUpdate: Timestamp,
  cacheExpiry: Timestamp,
  consultadoPor: "user_id",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Collection: `vehicle_history_logs`

```javascript
{
  id: "log_001",
  empresaId: "empresa123",
  placa: "ABC1234",
  tipo: "consulta", // consulta, atualizacao, erro
  fonte: "gov.br",
  sucesso: true,
  tempoResposta: 2500, // ms
  erro: null,
  userId: "user_id",
  timestamp: Timestamp
}
```

---

## 🔌 Integrações

### Fontes de Dados

#### 1. Recalls (Gov.br)
- **URL**: https://www.gov.br/mj/pt-br/assuntos/seus-direitos/consumidor/recall
- **Método**: Scraping (HTML parsing)
- **Frequência**: Semanal (atualização da base)
- **Cache**: 7 dias

#### 2. Detran (Leilões)
- **URL**: Varia por estado
- **Método**: Scraping ou API (se disponível)
- **Frequência**: Mensal
- **Cache**: 30 dias

#### 3. Sinesp Cidadão
- **URL**: API oficial (se disponível)
- **Método**: API REST
- **Frequência**: Diária
- **Cache**: 24 horas

### Serviços Internos

- **Firebase Firestore**: Armazenamento de cache
- **Cloud Functions**: Scrapers e processamento
- **Cloud Scheduler**: Atualização automática de cache
- **Firebase Storage**: Armazenamento de PDFs

---

## 🎨 Especificações de UI/UX

### Badge no Card do Veículo

```jsx
// Posição: Canto superior direito do card
<Badge variant={risco}>
  {risco === 'baixo' && <CheckCircle />}
  {risco === 'medio' && <AlertTriangle />}
  {risco === 'alto' && <XCircle />}
</Badge>

// Cores
baixo: verde (#10b981)
medio: amarelo (#f59e0b)
alto: vermelho (#ef4444)
```

### Modal de Histórico

```
┌─────────────────────────────────────────┐
│  Histórico do Veículo - ABC1234         │
│  ─────────────────────────────────────  │
│  [Recalls] [Leilões] [Sinistros]        │
│                                          │
│  📋 Recalls Ativos (1)                   │
│  ┌────────────────────────────────────┐ │
│  │ ⚠️ Airbag - Campanha 2020/001      │ │
│  │ Gravidade: Alta                     │ │
│  │ Status: Pendente                    │ │
│  │ [Ver Detalhes] [Agendar Correção]  │ │
│  └────────────────────────────────────┘ │
│                                          │
│  🔄 Última atualização: há 2 dias       │
│  [Atualizar Agora] [Exportar PDF]       │
└─────────────────────────────────────────┘
```

---

## ✅ Critérios de Aceitação Geral

### Funcionalidade
- [ ] Consulta funciona para 95%+ dos veículos brasileiros
- [ ] Dados precisos e atualizados
- [ ] Cache funciona corretamente
- [ ] Todas as fontes integradas

### Performance
- [ ] Consulta inicial < 10s
- [ ] Consulta em cache < 1s
- [ ] Sem travamentos ou timeouts

### Segurança
- [ ] Conformidade legal 100%
- [ ] Rate limiting ativo
- [ ] Logs de auditoria completos

### UX
- [ ] Interface intuitiva
- [ ] Feedback visual claro
- [ ] Responsivo em todos os dispositivos
- [ ] Suporte dark/light mode

### Testes
- [ ] Cobertura de testes > 80%
- [ ] Testes E2E passando
- [ ] Testes com dados reais

### Documentação
- [ ] README completo
- [ ] Guia de uso
- [ ] Documentação de APIs
- [ ] Troubleshooting guide

---

## 🚫 Fora do Escopo (v1)

- Consulta de multas
- Histórico de proprietários
- Valor de mercado (FIPE)
- Histórico de manutenções
- Integração com seguradoras privadas
- Notificações automáticas de recalls

---

## 📅 Cronograma

### Semana 1
- Dias 1-2: Setup e pesquisa de fontes
- Dias 3-4: Implementação de scrapers
- Dia 5: Sistema de cache

### Semana 2
- Dias 1-2: Componentes React
- Dias 3-4: Integração e testes
- Dia 5: Documentação e deploy

---

## 📊 Métricas de Sucesso

### Técnicas
- Taxa de sucesso de consultas: > 95%
- Tempo médio de resposta: < 5s
- Cache hit rate: > 80%
- Uptime: > 99%

### Negócio
- Adoção por oficinas: > 70%
- Consultas por dia: > 100
- Satisfação do usuário: > 4.5/5
- Recalls identificados: > 50/mês

---

**Documento criado**: 17 de Janeiro de 2025  
**Versão**: 1.0  
**Status**: 📋 Aprovado para implementação  
**Próximo passo**: Design detalhado

