# Plano de Implementação - Check-in Premium V2

## 1. Configuração Inicial e Componentes Base

- [ ] 1.1 Instalar dependências necessárias
  - Instalar framer-motion, recharts, react-zoom-pan-pinch, date-fns, clsx, tailwind-merge
  - Verificar compatibilidade com versões atuais do projeto
  - _Requirements: Todos_

- [ ] 1.2 Criar estrutura de pastas para componentes premium
  - Criar `/src/pages/checkin/components/` com subpastas: timeline, summary, dashboard, pin, history, photos
  - Criar `/src/pages/checkin/hooks/` para custom hooks
  - Criar `/src/pages/checkin/services/` para serviços Firebase
  - Criar `/src/pages/checkin/utils/` para helpers
  - _Requirements: Todos_

- [ ] 1.3 Criar componentes UI base reutilizáveis
  - Implementar `GlassCard.jsx` com glassmorphism e suporte a tema claro/escuro
  - Implementar `AnimatedCounter.jsx` para números animados
  - Implementar `ProgressBar.jsx` com animações suaves
  - Implementar `LoadingSpinner.jsx` premium
  - _Requirements: Todos_

- [ ] 1.4 Criar utilitários e helpers
  - Implementar `cn.js` para merge de classes Tailwind
  - Implementar `dateHelpers.js` para formatação de datas
  - Implementar `calculationHelpers.js` para cálculos de estatísticas
  - Implementar `animationHelpers.js` para variantes de animação
  - _Requirements: Todos_

## 2. Timeline Inteligente do Veículo

- [ ] 2.1 Criar serviço Firebase para timeline
  - Implementar `timelineService.js` com funções CRUD para estágios
  - Adicionar listener realtime para mudanças de estágio
  - Implementar função para calcular progresso percentual
  - _Requirements: 1_

- [ ] 2.2 Criar hook customizado useVehicleTimeline
  - Implementar `useVehicleTimeline.js` com estado e listeners Firebase
  - Adicionar funções para atualizar estágios
  - Implementar cálculo automático de progresso
  - Gerenciar loading e error states
  - _Requirements: 1_

- [ ] 2.3 Implementar componente VehicleTimeline
  - Criar `VehicleTimeline.jsx` com barra de progresso animada
  - Implementar renderização dos 6 estágios (Check-in → Check-out)
  - Adicionar animações de pulso no estágio atual
  - Implementar estados visuais (completed, current, pending)
  - Adicionar ícones e timestamps para cada estágio
  - _Requirements: 1_

- [ ] 2.4 Criar modal de detalhes do estágio
  - Implementar `StageDetails.jsx` com informações completas
  - Mostrar timestamp, usuário responsável, notas e serviços
  - Adicionar animações de entrada/saída
  - Implementar fechamento ao clicar fora
  - _Requirements: 1_

- [ ]* 2.5 Adicionar testes para timeline
  - Testar atualização realtime de estágios
  - Validar cálculo de progresso
  - Testar transições de animação
  - _Requirements: 1_

## 3. Resumo Inteligente do Veículo

- [ ] 3.1 Criar serviço de histórico do veículo
  - Implementar `vehicleService.js` para consultas de histórico
  - Adicionar função para buscar visitas anteriores por placa
  - Implementar cálculo de estatísticas (total gasto, ticket médio, dias desde última visita)
  - Adicionar função para identificar serviços mais frequentes
  - _Requirements: 2_

- [ ] 3.2 Criar hook useVehicleHistory
  - Implementar `useVehicleHistory.js` com cache de dados
  - Adicionar lógica para determinar se é cliente VIP (>5 visitas ou >R$5000 gastos)
  - Implementar agregação de dados de múltiplas visitas
  - _Requirements: 2_

- [ ] 3.3 Implementar componente VehicleSummary
  - Criar `VehicleSummary.jsx` com card glassmorphism
  - Exibir marca, modelo, ano, cor e placa com design premium
  - Mostrar badge de número de visitas e VIP
  - Implementar grid de estatísticas rápidas (visitas, dias, total gasto, ticket médio)
  - Adicionar animação de entrada suave
  - _Requirements: 2_

- [ ] 3.4 Criar componentes auxiliares de estatísticas
  - Implementar `VehicleStats.jsx` para métricas detalhadas
  - Implementar `FrequentServices.jsx` para lista de serviços recorrentes
  - Adicionar visualização de tags para serviços frequentes
  - _Requirements: 2_

- [ ] 3.5 Integrar resumo no modal de Check-in
  - Adicionar VehicleSummary logo após consulta de placa bem-sucedida
  - Implementar loading state durante busca de histórico
  - Adicionar fallback para primeira visita do veículo
  - _Requirements: 2_

## 4. Dashboard Operacional em Tempo Real

- [ ] 4.1 Criar serviço de métricas operacionais
  - Implementar `metricsService.js` com queries agregadas do Firestore
  - Adicionar listener realtime para contagem de veículos por estágio
  - Implementar cálculo de métricas: em reparo, aguardando orçamento, prontos, entregues hoje
  - Adicionar função para histórico de métricas (últimos 7 dias)
  - _Requirements: 6_

- [ ] 4.2 Criar hook useRealtimeMetrics
  - Implementar `useRealtimeMetrics.js` com listeners Firebase
  - Adicionar atualização automática a cada mudança no Firestore
  - Implementar cálculo de tendências (comparação com período anterior)
  - Gerenciar múltiplos listeners simultaneamente
  - _Requirements: 6_

- [ ] 4.3 Implementar componente RealtimeDashboard
  - Criar `RealtimeDashboard.jsx` com grid responsivo de cards
  - Implementar cards de métricas com gradientes e ícones
  - Adicionar indicadores de tendência (↑↓) com cores
  - Implementar animações de contadores numéricos
  - _Requirements: 6_

- [ ] 4.4 Adicionar gráficos com Recharts
  - Implementar `TrendChart.jsx` com gráfico de área
  - Adicionar mini-charts em cada card de métrica
  - Implementar gradientes personalizados por métrica
  - Adicionar tooltips informativos
  - _Requirements: 6_

- [ ] 4.5 Criar componente MetricCard reutilizável
  - Implementar `MetricCard.jsx` com design glassmorphism
  - Adicionar suporte a diferentes ícones e cores
  - Implementar animações de hover e entrada
  - Adicionar mini-chart opcional
  - _Requirements: 6_

- [ ] 4.6 Adicionar filtros de período
  - Implementar seletor de período (hoje, semana, mês)
  - Atualizar queries Firebase baseado no filtro
  - Adicionar animações nas transições de dados
  - _Requirements: 6_

## 5. Sistema de PIN de Retirada

- [ ] 5.1 Criar serviço de geração e validação de PIN
  - Implementar `pinService.js` com geração de PIN aleatório (4-6 dígitos)
  - Adicionar função para criptografar PIN antes de salvar no Firebase
  - Implementar validação de PIN com limite de tentativas
  - Adicionar função para resetar PIN se necessário
  - _Requirements: 9_

- [ ] 5.2 Criar hook usePinValidation
  - Implementar `usePinValidation.js` com estado de validação
  - Adicionar lógica de tentativas (máximo 3)
  - Implementar feedback visual (valid/invalid/pending)
  - Gerenciar bloqueio após exceder tentativas
  - _Requirements: 9_

- [ ] 5.3 Implementar componente PinValidation
  - Criar `PinValidation.jsx` com modal elegante
  - Implementar 4 inputs individuais para dígitos do PIN
  - Adicionar navegação automática entre inputs
  - Implementar feedback visual com cores (verde/vermelho)
  - Adicionar animação de shake quando PIN incorreto
  - _Requirements: 9_

- [ ] 5.4 Criar componente PinGenerator
  - Implementar `PinGenerator.jsx` para exibir PIN gerado
  - Adicionar opção de copiar PIN
  - Implementar visualização destacada do PIN
  - Adicionar botão para imprimir/enviar PIN
  - _Requirements: 9_

- [ ] 5.5 Integrar PIN no fluxo de Check-in/Check-out
  - Gerar PIN automaticamente ao criar Check-in
  - Salvar PIN criptografado no documento do Firestore
  - Exibir PIN para o cliente após Check-in
  - Solicitar PIN antes de permitir Check-out
  - Bloquear Check-out se PIN incorreto após 3 tentativas
  - _Requirements: 9_

## 6. Histórico Visual de Visitas

- [ ] 6.1 Criar componente VisitHistory
  - Implementar `VisitHistory.jsx` com scroll horizontal
  - Adicionar snap scroll para melhor UX mobile
  - Implementar lazy loading de imagens do Firebase Storage
  - Adicionar animações escalonadas para cards
  - _Requirements: 3_

- [ ] 6.2 Criar componente VisitCard
  - Implementar `VisitCard.jsx` com thumbnail da foto de entrada
  - Adicionar badge de status (concluído/em andamento)
  - Mostrar data, serviços e valor total
  - Implementar hover effects e cursor pointer
  - _Requirements: 3_

- [ ] 6.3 Criar modal de detalhes da visita
  - Implementar `VisitDetails.jsx` com informações completas
  - Mostrar fotos de entrada e saída
  - Listar todos os serviços realizados
  - Adicionar timeline da visita específica
  - Implementar navegação entre visitas (anterior/próxima)
  - _Requirements: 3_

- [ ] 6.4 Otimizar carregamento de imagens
  - Implementar thumbnails redimensionados no Firebase Storage
  - Adicionar placeholder blur durante carregamento
  - Implementar cache de imagens já carregadas
  - Adicionar fallback para imagens não encontradas
  - _Requirements: 3_

- [ ] 6.5 Integrar histórico no modal de Check-in
  - Adicionar seção de histórico abaixo do resumo do veículo
  - Implementar toggle para mostrar/ocultar histórico
  - Adicionar indicador de quantidade de visitas anteriores
  - _Requirements: 3_

## 7. Sugestões Automáticas de Orçamento

- [ ] 7.1 Criar lógica de sugestões inteligentes
  - Implementar `suggestionService.js` com algoritmos de sugestão
  - Adicionar regra: troca de óleo se última > 90 dias
  - Adicionar regra: revisão periódica baseada em km ou tempo
  - Adicionar regra: serviços recorrentes (padrão a cada X meses)
  - Implementar priorização de sugestões (alta/média/baixa)
  - _Requirements: 8_

- [ ] 7.2 Criar hook useServiceSuggestions
  - Implementar `useServiceSuggestions.js` com análise de histórico
  - Adicionar cálculo de dias desde último serviço
  - Implementar detecção de padrões de manutenção
  - Gerenciar preferências do usuário (sugestões aceitas/ignoradas)
  - _Requirements: 8_

- [ ] 7.3 Implementar componente ServiceSuggestions
  - Criar `ServiceSuggestions.jsx` com modal discreto
  - Listar sugestões com justificativa clara
  - Adicionar botões "Adicionar ao orçamento" e "Ignorar"
  - Implementar badges de prioridade (cores diferentes)
  - Adicionar animações suaves de entrada
  - _Requirements: 8_

- [ ] 7.4 Criar componente SuggestionCard
  - Implementar `SuggestionCard.jsx` para cada sugestão
  - Mostrar nome do serviço, razão e última vez realizado
  - Adicionar ícone representativo do serviço
  - Implementar ações rápidas (adicionar/ignorar)
  - _Requirements: 8_

- [ ] 7.5 Integrar sugestões no fluxo de Check-in
  - Exibir modal de sugestões após finalizar Check-in
  - Adicionar opção "Ver sugestões" no resumo do veículo
  - Salvar sugestões aceitas/ignoradas no Firestore
  - Implementar aprendizado: não sugerir serviços ignorados repetidamente
  - _Requirements: 8_

## 8. Visualização 3D/Panorâmica das Fotos

- [ ] 8.1 Criar componente PhotoViewer3D
  - Implementar `PhotoViewer3D.jsx` usando react-zoom-pan-pinch
  - Adicionar controles de zoom (+/-) e reset
  - Implementar navegação entre múltiplas fotos
  - Adicionar modo fullscreen
  - Implementar gestos touch (pinch to zoom, swipe)
  - _Requirements: 13_

- [ ] 8.2 Criar componente PhotoControls
  - Implementar `PhotoControls.jsx` com botões flutuantes
  - Adicionar controles: zoom in, zoom out, reset, fullscreen, rotate
  - Implementar design glassmorphism para controles
  - Adicionar tooltips informativos
  - _Requirements: 13_

- [ ] 8.3 Implementar comparação entrada/saída
  - Criar `PhotoComparison.jsx` com visualização lado a lado
  - Adicionar slider para comparar fotos (antes/depois)
  - Implementar sincronização de zoom entre fotos
  - Adicionar labels "Entrada" e "Saída"
  - _Requirements: 13_

- [ ] 8.4 Otimizar carregamento e performance
  - Implementar lazy loading de imagens em alta resolução
  - Adicionar progressive loading (baixa → alta qualidade)
  - Implementar cache de imagens carregadas
  - Adicionar loading spinner elegante
  - _Requirements: 13_

- [ ] 8.5 Integrar visualizador nas fotos de Check-in/Check-out
  - Substituir visualização simples por PhotoViewer3D
  - Adicionar botão "Ver em detalhes" nas thumbnails
  - Implementar modal fullscreen para visualização
  - Adicionar navegação por teclado (setas, ESC)
  - _Requirements: 13_

## 9. Integração e Refinamentos Finais

- [ ] 9.1 Integrar todos os componentes no CheckInPage.jsx
  - Adicionar VehicleTimeline no topo da página
  - Integrar VehicleSummary no modal de Check-in
  - Adicionar RealtimeDashboard em seção dedicada
  - Integrar VisitHistory no modal de Check-in
  - Adicionar ServiceSuggestions após Check-in
  - Integrar PinValidation no Check-out
  - Substituir visualizador de fotos por PhotoViewer3D
  - _Requirements: Todos_

- [ ] 9.2 Garantir compatibilidade com tema claro/escuro
  - Testar todos os componentes em ambos os temas
  - Ajustar cores e contrastes conforme necessário
  - Verificar legibilidade de textos
  - Ajustar opacidades de glassmorphism
  - _Requirements: Todos_

- [ ] 9.3 Otimizar performance e responsividade
  - Implementar code splitting para componentes pesados
  - Adicionar memoization em componentes que re-renderizam frequentemente
  - Otimizar queries Firebase (índices, limites)
  - Testar em diferentes tamanhos de tela
  - Garantir touch-friendly em mobile (mínimo 44x44px)
  - _Requirements: Todos_

- [ ] 9.4 Adicionar tratamento de erros e loading states
  - Implementar error boundaries para componentes críticos
  - Adicionar fallbacks elegantes para erros
  - Implementar skeleton loaders para carregamentos
  - Adicionar retry logic para falhas de rede
  - _Requirements: Todos_

- [ ] 9.5 Implementar acessibilidade
  - Adicionar ARIA labels em todos os elementos interativos
  - Garantir navegação por teclado funcional
  - Implementar focus visible em todos os botões
  - Testar com screen readers
  - Garantir contraste mínimo 4.5:1
  - _Requirements: Todos_

- [ ]* 9.6 Criar documentação de uso
  - Documentar cada componente novo com exemplos
  - Criar guia de integração para desenvolvedores
  - Documentar estrutura de dados Firebase
  - Adicionar screenshots e GIFs demonstrativos
  - _Requirements: Todos_

- [ ]* 9.7 Testes finais e validação
  - Testar fluxo completo de Check-in a Check-out
  - Validar todas as funcionalidades premium
  - Testar em diferentes navegadores
  - Validar performance (Lighthouse score > 90)
  - Testar com dados reais do Firebase
  - _Requirements: Todos_

## Dependências a Instalar

```bash
npm install framer-motion recharts react-zoom-pan-pinch date-fns clsx tailwind-merge
```

## Estrutura de Dados Firebase

### Collection: checkins
```javascript
{
  id: string,
  empresaId: string,
  vehiclePlate: string,
  vehicleBrand: string,
  vehicleModel: string,
  vehicleYear: string,
  vehicleColor: string,
  clientId: string,
  clientName: string,
  
  // Timeline
  currentStage: 'checkin' | 'diagnostico' | 'orcamento' | 'execucao' | 'finalizacao' | 'checkout',
  stages: {
    checkin: { completed: boolean, timestamp: Timestamp, userId: string, userName: string },
    diagnostico: { completed: boolean, timestamp: Timestamp, notes: string, userId: string },
    orcamento: { completed: boolean, timestamp: Timestamp, budgetId: string, userId: string },
    execucao: { completed: boolean, timestamp: Timestamp, services: string[], userId: string },
    finalizacao: { completed: boolean, timestamp: Timestamp, userId: string },
    checkout: { completed: boolean, timestamp: Timestamp, userId: string }
  },
  
  // PIN
  pin: string, // Criptografado
  pinAttempts: number,
  pinValidated: boolean,
  pinValidatedAt: Timestamp,
  
  // Fotos
  entryPhotos: string[], // Firebase Storage URLs
  exitPhotos: string[],
  
  // Sugestões
  suggestedServices: Array<{
    service: string,
    reason: string,
    priority: 'high' | 'medium' | 'low',
    suggestedAt: Timestamp
  }>,
  acceptedSuggestions: string[],
  ignoredSuggestions: string[],
  
  // Metadata
  status: 'in_progress' | 'completed' | 'cancelled',
  createdAt: Timestamp,
  updatedAt: Timestamp,
  completedAt: Timestamp
}
```

## Cronograma Estimado

- **Semana 1**: Tasks 1-3 (Configuração, Timeline, Resumo)
- **Semana 2**: Tasks 4-6 (Dashboard, PIN, Histórico)
- **Semana 3**: Tasks 7-8 (Sugestões, Fotos 3D)
- **Semana 4**: Task 9 (Integração e refinamentos)

## Métricas de Sucesso

- ✅ Fluxo atual mantido 100% funcional
- ✅ Todas as 7 funcionalidades implementadas
- ✅ Interface responsiva (mobile, tablet, desktop)
- ✅ Animações fluidas a 60fps
- ✅ Carregamento inicial < 2s
- ✅ Lighthouse Performance > 90
- ✅ Zero bugs críticos
- ✅ Tema claro/escuro funcionando perfeitamente
