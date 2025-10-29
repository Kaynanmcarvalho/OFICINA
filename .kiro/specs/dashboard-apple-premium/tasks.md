# Implementation Plan - Dashboard Apple Premium

## Visão Geral

Este plano de implementação detalha as tarefas necessárias para transformar o dashboard existente em `/dashboard` em um dashboard premium estilo Apple com dados 100% reais do Firebase. As tarefas estão organizadas de forma incremental, construindo sobre componentes existentes e adicionando novas funcionalidades progressivamente.

---

## Tasks

- [x] 1. Expandir dashboardService.js com novas funções de busca




  - Adicionar função `buscarClientesRecentes()` que busca os 5 últimos clientes ordenados por `createdAt` desc
  - Adicionar função `buscarVeiculosAtivos()` que filtra veículos com status ativo (Em Montagem, Aguardando Peças, Teste)
  - Adicionar função `gerarDadosGraficoMovimentacao()` que gera dados dos últimos 7 dias de clientes e veículos
  - Adicionar função `calcularTendencias()` que compara dados atuais com período anterior para gerar indicadores up/down/stable


  - Implementar listeners em tempo real com `subscribeToAllCollections()` que retorna função de cleanup
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 12.4_



- [ ] 2. Criar componente ListaClientesRecentes.jsx
  - Criar estrutura do componente com props (clientes, isLoading)
  - Implementar card branco com header (ícone Users + título "Clientes Recentes")
  - Criar lista vertical com map dos clientes
  - Implementar avatar com foto ou iniciais (usar função `getInitials()`)


  - Exibir nome, email, telefone e data de cadastro formatada
  - Adicionar animação fade-in + slide-up staggered com Framer Motion
  - Implementar hover effect (scale 1.02 + background cinza claro)
  - Adicionar click handler para navegar para detalhes do cliente


  - Implementar skeleton loader quando isLoading=true
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 3. Criar componente EstoqueCritico.jsx


  - Criar estrutura do componente com props (produtos, isLoading)
  - Implementar card branco com header (ícone AlertTriangle + título "Estoque Crítico")
  - Criar lista vertical com map dos produtos
  - Implementar função `getStatusBadge()` que retorna badge vermelho para esgotado e amarelo para baixo
  - Exibir nome, código, quantidade atual/mínimo, categoria
  - Adicionar ícones X para esgotado e AlertCircle para baixo


  - Adicionar animação fade-in + slide-up staggered com Framer Motion
  - Implementar empty state quando não há produtos críticos
  - Implementar skeleton loader quando isLoading=true


  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 4. Criar componente FerramentasEmUso.jsx
  - Criar estrutura do componente com props (ferramentas, isLoading)
  - Implementar card com glassmorphism (backdrop-blur-lg + bg-white/80)
  - Adicionar header (ícone Wrench + título "Ferramentas em Uso")
  - Criar grid 2 colunas (1 coluna em mobile) com map das ferramentas
  - Implementar card individual para cada ferramenta com nome, código, categoria


  - Exibir responsável (ou "Não atribuído"), localização e data de retirada


  - Adicionar badge colorido para categoria
  - Adicionar animação fade-in + scale staggered com Framer Motion
  - Implementar empty state quando não há ferramentas em uso
  - Implementar skeleton loader quando isLoading=true
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 5. Criar componente VeiculosAtivos.jsx
  - Criar estrutura do componente com props (veiculos, isLoading)
  - Implementar card branco com header (ícone Car + título "Veículos em Serviço")
  - Criar lista vertical com map dos veículos


  - Implementar função `getStatusColor()` que retorna cor baseada no status (azul, amarelo, verde)
  - Exibir placa (destaque bold), marca/modelo, cliente, status com badge
  - Calcular e exibir dias em serviço (diferença entre hoje e dataEntrada)
  - Adicionar animação fade-in + slide-left staggered com Framer Motion
  - Implementar click handler para abrir modal com detalhes (usar modal existente se houver)
  - Implementar empty state quando não há veículos ativos
  - Implementar skeleton loader quando isLoading=true
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 6. Criar componente GraficoMovimentacao.jsx
  - Criar estrutura do componente com props (dados, isLoading)
  - Implementar card branco com header (ícone TrendingUp + título "Movimentação Semanal")


  - Configurar ResponsiveContainer do Recharts com height 300px
  - Implementar LineChart com duas linhas (clientes em azul, veículos em roxo)
  - Configurar CartesianGrid com strokeDasharray="3 3"
  - Configurar XAxis com dataKey="dia" e formatação de fonte
  - Configurar YAxis com formatação de fonte
  - Criar CustomTooltip com glassmorphism e formatação elegante
  - Adicionar Legend customizada


  - Configurar animação de entrada (fade-in + draw animation)
  - Implementar skeleton loader quando isLoading=true
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 7. Melhorar componente GraficoFinanceiro.jsx existente
  - Adicionar animação de entrada no gráfico (initial={{ opacity: 0, scale: 0.95 }})
  - Melhorar CustomTooltip com glassmorphism e formatação de moeda brasileira


  - Adicionar indicador de tendência (seta TrendingUp/TrendingDown) no header
  - Calcular e exibir variação percentual em relação ao período anterior
  - Melhorar skeleton loader com animação de pulse mais suave
  - Adicionar transição suave ao trocar período (7dias, 30dias, 90dias)
  - _Requirements: 2.3, 2.4, 2.5, 10.1, 10.2_




- [ ] 8. Melhorar componente InsightsClientes.jsx existente
  - Adicionar animação de entrada no gráfico de pizza (animationBegin={0} animationDuration={800})


  - Melhorar legenda com percentuais calculados dinamicamente
  - Implementar hover effect nos segmentos do gráfico (activeShape customizado)
  - Expandir seção "Top Clientes" para mostrar email e telefone além de nome e serviços
  - Adicionar badge com ranking (1º, 2º, 3º) com gradiente dourado/prata/bronze
  - Adicionar animação staggered na lista de top clientes
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 10.1, 10.2_



- [ ] 9. Melhorar componente CentralAlertas.jsx existente
  - Adicionar animação de slide-in para novos alertas (AnimatePresence + motion.div)
  - Implementar sistema de dismiss com botão X e função `marcarComoLido()`
  - Adicionar filtros por tipo (Todos, Críticos, Avisos, Informativos) com tabs
  - Adicionar badge com contador de alertas não lidos no header
  - Implementar persistência de alertas lidos no localStorage
  - Adicionar som sutil ao receber novo alerta crítico (opcional, com toggle)
  - Melhorar ícones de acordo com categoria (AlertTriangle, AlertCircle, Info)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 10.1, 10.2_


- [ ] 10. Melhorar componente WidgetClima.jsx existente
  - Adicionar animação de transição entre estados de carregamento e dados carregados
  - Melhorar ícones de clima usando Lucide React (Sun, Cloud, CloudRain, CloudSnow, Wind)
  - Adicionar previsão para próximas 3 horas com mini cards
  - Implementar efeito de glassmorphism no card principal
  - Adicionar animação de fade ao atualizar dados
  - Implementar fallback elegante quando API falhar
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2_



- [ ] 11. Atualizar index.jsx do dashboard com novos componentes e listeners em tempo real
  - Importar todos os novos componentes (ListaClientesRecentes, EstoqueCritico, FerramentasEmUso, VeiculosAtivos, GraficoMovimentacao)
  - Adicionar estados para novos dados (clientesRecentes, estoqueCritico, ferramentasEmUso, veiculosAtivos, dadosGrafico)
  - Implementar useEffect com listeners em tempo real usando `subscribeToAllCollections()`
  - Adicionar cleanup de listeners no return do useEffect
  - Atualizar função `carregarDadosDashboard()` para buscar todos os novos dados em paralelo com Promise.all
  - Adicionar cálculo de tendências e passar para CartaoIndicador
  - Atualizar grid layout para incluir novos componentes (seguir design do documento)

  - Implementar lazy loading dos componentes de gráficos com Suspense
  - Adicionar error boundary para capturar erros de renderização
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 12.1, 12.2, 12.4, 12.5_

- [ ] 12. Implementar responsividade completa no dashboard
  - Atualizar grid de KPIs para 1 coluna em mobile (< 768px), 2 colunas em tablet (768-1024px), 4 colunas em desktop (> 1024px)
  - Atualizar grid de gráficos para 1 coluna em mobile, 2 colunas em desktop
  - Atualizar grid de listas para 1 coluna em mobile, 2 colunas em desktop
  - Ajustar padding do container principal (p-4 em mobile, p-6 em tablet, p-8 em desktop)

  - Ajustar tamanho de fonte do header (text-2xl em mobile, text-3xl em tablet, text-4xl em desktop)
  - Testar em diferentes resoluções (375px, 768px, 1024px, 1920px)
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 13. Expandir dashboard.css com animações e estilos customizados
  - Adicionar variáveis CSS para cores, espaçamentos e durações de animação
  - Criar classe `.glassmorphism` com backdrop-filter e background translúcido
  - Criar animação `@keyframes shimmer` para skeleton loaders
  - Criar animação `@keyframes slideIn` para alertas
  - Criar animação `@keyframes fadeIn` para carregamento de componentes


  - Adicionar media query para `prefers-reduced-motion` que desabilita animações
  - Adicionar estilos para scrollbar customizada (webkit-scrollbar)
  - Adicionar classe `.card-hover` com transição de sombra e scale
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 14. Implementar otimizações de performance
  - Adicionar useMemo para cálculos complexos (estatísticas, insights, tendências)
  - Adicionar useCallback para funções passadas como props

  - Implementar debounce de 500ms nos listeners em tempo real
  - Adicionar lazy loading para componentes de gráficos (React.lazy + Suspense)
  - Implementar code splitting para Recharts (importar apenas quando necessário)
  - Adicionar limit(5) nas queries do Firebase para listas (clientes recentes, top clientes)
  - Implementar cache de dados no sessionStorage para reduzir chamadas ao Firebase
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 15. Implementar acessibilidade completa
  - Adicionar role="main" no container principal do dashboard

  - Adicionar aria-labelledby em todas as sections com headings ocultos (sr-only)
  - Adicionar aria-label em todos os botões sem texto (ícones)
  - Implementar navegação por teclado em cards clicáveis (tabIndex, onKeyDown)
  - Adicionar aria-live="polite" na Central de Alertas para anunciar novos alertas
  - Verificar contraste de cores (mínimo 4.5:1 para texto normal)
  - Adicionar focus-visible em todos os elementos interativos
  - Testar com leitor de tela (NVDA ou JAWS)
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 16. Adicionar tratamento de erros robusto
  - Implementar try-catch em todas as funções do dashboardService.js
  - Adicionar toast de erro usando biblioteca de notificações (react-hot-toast ou sonner)
  - Implementar fallback visual para cada componente quando dados não carregam
  - Adicionar botão "Tentar novamente" em estados de erro
  - Implementar error boundary no nível do dashboard para capturar erros de renderização
  - Adicionar logging de erros no console com prefixo [Dashboard]
  - Implementar timeout de 10 segundos para queries do Firebase
  - _Requirements: 1.1, 1.2, 12.5_

- [ ] 17. Criar empty states elegantes para todos os componentes
  - Criar componente EmptyState.jsx reutilizável com props (ícone, título, mensagem, ação)
  - Implementar empty state em ListaClientesRecentes ("Nenhum cliente cadastrado ainda")
  - Implementar empty state em EstoqueCritico ("Estoque em níveis adequados")
  - Implementar empty state em FerramentasEmUso ("Todas as ferramentas disponíveis")
  - Implementar empty state em VeiculosAtivos ("Nenhum veículo em serviço no momento")
  - Implementar empty state em GraficoMovimentacao ("Sem dados para o período selecionado")
  - Adicionar ilustrações SVG minimalistas para cada empty state
  - _Requirements: 4.1, 5.1, 6.1, 7.1, 2.1_

- [ ] 18. Implementar modo de visualização compacto/expandido
  - Adicionar toggle no header do dashboard para alternar entre modos
  - Criar estado `viewMode` com valores 'compact' ou 'expanded'
  - No modo compact: reduzir padding, ocultar descrições, mostrar apenas valores essenciais
  - No modo expanded: mostrar todas as informações e gráficos completos
  - Persistir preferência no localStorage
  - Adicionar animação suave ao trocar de modo
  - _Requirements: 9.1, 9.2, 10.1, 10.2_

- [ ] 19. Adicionar funcionalidade de exportação de dados
  - Adicionar botão "Exportar" no header do dashboard
  - Implementar função `exportarDashboard()` que gera PDF ou Excel
  - Incluir todos os KPIs, gráficos (como imagens) e listas
  - Adicionar logo da empresa e data/hora da exportação
  - Implementar loading state durante geração do arquivo
  - Usar biblioteca html2canvas para capturar gráficos como imagens
  - Usar biblioteca jsPDF para gerar PDF
  - _Requirements: 1.1, 2.1, 8.1_

- [ ] 20. Implementar sistema de favoritos/widgets customizáveis
  - Adicionar botão "Personalizar" no header do dashboard
  - Criar modal de personalização com lista de widgets disponíveis
  - Implementar drag-and-drop para reordenar widgets (react-grid-layout)
  - Permitir ocultar/mostrar widgets individualmente
  - Persistir configuração no Firebase (coleção user_preferences)
  - Adicionar botão "Restaurar padrão" para voltar ao layout original
  - _Requirements: 9.1, 9.2, 10.1, 10.2_

- [ ] 21. Testes de integração e validação final
  - Testar carregamento inicial do dashboard com dados reais do Firebase
  - Testar atualização em tempo real ao modificar dados no Firebase
  - Testar responsividade em diferentes dispositivos (mobile, tablet, desktop)
  - Testar modo claro e modo escuro
  - Testar navegação por teclado e acessibilidade
  - Testar performance com grande volume de dados (100+ clientes, 50+ veículos)
  - Testar tratamento de erros (desconectar internet, Firebase offline)
  - Validar que não há dados mockados ou placeholders
  - _Requirements: 1.1, 1.2, 11.1, 11.2, 11.3, 12.5_

---

## Notas de Implementação

### Ordem de Execução Recomendada

1. **Tasks 1-6**: Criar novos componentes e expandir serviços (base funcional)
2. **Tasks 7-10**: Melhorar componentes existentes (refinamento)
3. **Task 11**: Integrar tudo no index.jsx (orquestração)
4. **Tasks 12-13**: Responsividade e estilos (polish visual)
5. **Tasks 14-16**: Performance, acessibilidade e erros (qualidade)
6. **Tasks 17-20**: Features adicionais opcionais (extras)
7. **Task 21**: Testes finais (validação)

### Dependências

- **Recharts**: Já instalado (usado em GraficoFinanceiro)
- **Framer Motion**: Já instalado (usado em CartaoIndicador)
- **Lucide React**: Já instalado (usado em vários componentes)
- **Firebase SDK**: Já configurado
- **React Router**: Já configurado (para navegação)

### Bibliotecas Adicionais Opcionais

- **react-hot-toast** ou **sonner**: Para notificações de erro (Task 16)
- **html2canvas** + **jsPDF**: Para exportação de PDF (Task 19)
- **react-grid-layout**: Para widgets customizáveis (Task 20)

### Considerações Importantes

- **Sem dados mockados**: Todas as funções devem buscar dados reais do Firebase
- **Tempo real**: Usar onSnapshot para atualização automática
- **Cleanup**: Sempre cancelar listeners no useEffect cleanup
- **Performance**: Usar Promise.all para queries paralelas
- **Acessibilidade**: Seguir WCAG 2.1 AA
- **Responsividade**: Mobile-first approach
- **Tema**: Respeitar modo claro/escuro do sistema

### Estrutura de Commits Sugerida

- `feat: adicionar componente ListaClientesRecentes`
- `feat: adicionar componente EstoqueCritico`
- `feat: melhorar GraficoFinanceiro com tendências`
- `refactor: implementar listeners em tempo real`
- `style: adicionar animações e glassmorphism`
- `perf: otimizar queries e adicionar memoização`
- `a11y: implementar acessibilidade completa`
- `test: adicionar testes de integração`

---

## Progresso Esperado

- **Tasks 1-6**: ~40% do trabalho (componentes base)
- **Tasks 7-11**: ~30% do trabalho (integração e melhorias)
- **Tasks 12-16**: ~20% do trabalho (qualidade e polish)
- **Tasks 17-21**: ~10% do trabalho (extras e testes)

**Total estimado**: 15-20 horas de desenvolvimento

---

## Resultado Final

Ao completar todas as tasks, o dashboard terá:

✅ 10+ componentes funcionais e elegantes  
✅ Dados 100% reais do Firebase em tempo real  
✅ Gráficos interativos com Recharts  
✅ Design Apple-like premium com microanimações  
✅ Responsividade completa (mobile, tablet, desktop)  
✅ Modo claro e escuro  
✅ Performance otimizada  
✅ Acessibilidade WCAG 2.1 AA  
✅ Tratamento robusto de erros  
✅ Empty states elegantes  
✅ Features opcionais (exportação, customização)  

O dashboard será o coração visual do sistema, transmitindo inteligência, eficiência e estética premium.
