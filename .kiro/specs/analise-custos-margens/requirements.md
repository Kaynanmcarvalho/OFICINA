# Requirements - Análise de Custos & Margens

## Introduction

Sistema completo de análise de custos e margens de lucro para oficinas mecânicas, integrado nas abas existentes do sistema (Orçamentos, Estoque, Dashboard, Check-in).

## Glossary

- **Sistema**: Torq - Sistema de gestão de oficinas
- **Usuário**: Funcionário da oficina com acesso ao sistema
- **Margem**: Diferença percentual entre custo e preço de venda
- **Markup**: Percentual adicionado ao custo para formar o preço
- **Custo Direto**: Custo de peças e materiais
- **Custo Indireto**: Mão de obra, overhead, despesas fixas
- **Ponto de Equilíbrio**: Valor mínimo para cobrir custos
- **ROI**: Retorno sobre investimento

## Requirements

### Requirement 1: Análise de Custos em Orçamentos

**User Story:** Como usuário, quero visualizar análise detalhada de custos e margens ao criar/editar orçamentos, para garantir lucratividade adequada.

#### Acceptance Criteria

1. WHEN o usuário abre um orçamento, THE Sistema SHALL exibir painel de análise de custos com breakdown detalhado
2. WHEN o usuário adiciona um item, THE Sistema SHALL calcular automaticamente custo, margem e markup
3. WHEN a margem está abaixo do mínimo configurado, THE Sistema SHALL exibir alerta visual
4. WHERE o usuário tem permissão, THE Sistema SHALL permitir ajuste de margens por item
5. WHEN o orçamento é salvo, THE Sistema SHALL registrar análise de custos no histórico

### Requirement 2: Dashboard de Margens

**User Story:** Como gestor, quero visualizar dashboard consolidado de margens e lucratividade, para tomar decisões estratégicas.

#### Acceptance Criteria

1. THE Sistema SHALL exibir card de "Análise de Margens" no dashboard principal
2. WHEN o dashboard carrega, THE Sistema SHALL calcular margem média dos últimos 30 dias
3. THE Sistema SHALL exibir gráfico de evolução de margens ao longo do tempo
4. THE Sistema SHALL mostrar comparativo de margens por tipo de serviço
5. WHEN o usuário clica no card, THE Sistema SHALL abrir relatório detalhado de margens

### Requirement 3: Análise de Estoque com Custos

**User Story:** Como usuário, quero ver análise de custos e margens no módulo de estoque, para precificar produtos adequadamente.

#### Acceptance Criteria

1. WHEN o usuário visualiza um produto, THE Sistema SHALL exibir custo de aquisição e margem sugerida
2. THE Sistema SHALL calcular preço de venda sugerido baseado em markup configurado
3. WHEN o usuário edita preço, THE Sistema SHALL recalcular margem em tempo real
4. THE Sistema SHALL exibir alerta se margem for inferior ao mínimo
5. THE Sistema SHALL mostrar histórico de custos e margens do produto

### Requirement 4: Relatórios de Lucratividade

**User Story:** Como gestor, quero gerar relatórios detalhados de lucratividade, para análise financeira completa.

#### Acceptance Criteria

1. THE Sistema SHALL disponibilizar relatório de lucratividade por período
2. THE Sistema SHALL permitir filtros por serviço, cliente, técnico e período
3. THE Sistema SHALL exibir breakdown de custos (diretos, indiretos, fixos)
4. THE Sistema SHALL calcular ponto de equilíbrio mensal
5. THE Sistema SHALL permitir exportação em PDF e Excel

### Requirement 5: Configuração de Margens

**User Story:** Como administrador, quero configurar margens mínimas e markup padrão, para padronizar precificação.

#### Acceptance Criteria

1. THE Sistema SHALL permitir configuração de margem mínima global
2. THE Sistema SHALL permitir configuração de markup por categoria de produto
3. THE Sistema SHALL permitir configuração de markup por tipo de serviço
4. WHEN configurações são alteradas, THE Sistema SHALL aplicar a novos orçamentos
5. THE Sistema SHALL manter histórico de alterações de configuração

### Requirement 6: Alertas de Margem

**User Story:** Como usuário, quero receber alertas quando margens estiverem inadequadas, para evitar prejuízos.

#### Acceptance Criteria

1. WHEN margem de item está abaixo do mínimo, THE Sistema SHALL exibir badge vermelho
2. WHEN margem total do orçamento está baixa, THE Sistema SHALL exibir modal de confirmação
3. THE Sistema SHALL permitir justificativa para margens baixas
4. THE Sistema SHALL notificar gestor quando margens baixas são aprovadas
5. THE Sistema SHALL registrar todas as exceções de margem

### Requirement 7: Análise de Check-in

**User Story:** Como usuário, quero ver análise de custos estimados durante check-in, para orientar diagnóstico.

#### Acceptance Criteria

1. WHEN o usuário registra check-in, THE Sistema SHALL estimar custos baseado em problemas reportados
2. THE Sistema SHALL sugerir faixa de preço para serviços identificados
3. THE Sistema SHALL exibir margem esperada para serviços sugeridos
4. WHEN o usuário cria orçamento a partir do check-in, THE Sistema SHALL pré-preencher análise de custos
5. THE Sistema SHALL comparar custo estimado vs real após conclusão

### Requirement 8: Comparativo de Preços

**User Story:** Como usuário, quero comparar preços praticados com mercado, para manter competitividade.

#### Acceptance Criteria

1. THE Sistema SHALL exibir preço médio de mercado para serviços comuns
2. THE Sistema SHALL indicar se preço está acima, na média ou abaixo do mercado
3. THE Sistema SHALL permitir cadastro manual de preços de concorrentes
4. THE Sistema SHALL calcular índice de competitividade
5. THE Sistema SHALL sugerir ajustes de preço baseado em análise de mercado

### Requirement 9: Custos Indiretos

**User Story:** Como gestor, quero configurar e ratear custos indiretos, para precificação mais precisa.

#### Acceptance Criteria

1. THE Sistema SHALL permitir cadastro de custos fixos mensais (aluguel, energia, etc)
2. THE Sistema SHALL calcular custo indireto por hora de mão de obra
3. THE Sistema SHALL ratear custos indiretos proporcionalmente em orçamentos
4. WHEN custos indiretos são atualizados, THE Sistema SHALL recalcular margens
5. THE Sistema SHALL exibir impacto de custos indiretos no dashboard

### Requirement 10: Metas de Margem

**User Story:** Como gestor, quero definir metas de margem, para acompanhar performance financeira.

#### Acceptance Criteria

1. THE Sistema SHALL permitir definição de meta de margem mensal
2. THE Sistema SHALL exibir progresso em relação à meta no dashboard
3. WHEN meta é atingida, THE Sistema SHALL exibir notificação de sucesso
4. THE Sistema SHALL calcular projeção de atingimento de meta
5. THE Sistema SHALL permitir metas diferentes por categoria de serviço

---

## Non-Functional Requirements

### Performance
- Cálculos de margem devem ser instantâneos (< 100ms)
- Dashboard deve carregar em menos de 2 segundos
- Relatórios devem gerar em menos de 5 segundos

### Usability
- Interface intuitiva com indicadores visuais claros
- Cores semafóricas (verde/amarelo/vermelho) para margens
- Tooltips explicativos em todos os indicadores

### Security
- Apenas usuários autorizados podem ver custos reais
- Logs de todas as alterações de margem
- Criptografia de dados financeiros sensíveis

### Compatibility
- Integração com módulos existentes (Orçamentos, Estoque, Dashboard)
- Compatível com estrutura atual do Firestore
- Responsivo para mobile e desktop

---

**Version**: 1.0.0  
**Date**: 2025-01-13  
**Status**: Ready for Design  
**Author**: Torq AI Team
