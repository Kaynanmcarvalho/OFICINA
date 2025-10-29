# Requirements Document

## Introduction

Este documento especifica os requisitos para a melhoria e completude do Dashboard existente na rota `/dashboard`, transformando-o em um dashboard premium estilo Apple com dados 100% reais do Firebase. O dashboard atual possui estrutura básica com alguns componentes, mas precisa ser expandido com funcionalidades avançadas, gráficos interativos, insights inteligentes e design Apple-like completo.

## Glossary

- **Sistema**: Aplicação web de gestão de oficina mecânica
- **Dashboard**: Painel principal de visualização de dados e métricas em tempo real na rota `/dashboard`
- **Firebase**: Plataforma de backend utilizada para armazenamento de dados (Firestore)
- **Firestore**: Banco de dados NoSQL do Firebase
- **KPI**: Key Performance Indicator - Indicador chave de performance
- **Snapshot**: Listener em tempo real do Firebase que detecta mudanças nos dados
- **Glassmorphism**: Efeito visual de vidro translúcido com blur
- **Skeleton Loader**: Componente de carregamento que simula a estrutura do conteúdo
- **Recharts**: Biblioteca de gráficos React para visualização de dados
- **Framer Motion**: Biblioteca de animações para React
- **Apple-like**: Design inspirado na filosofia visual da Apple (minimalista, elegante, fluido)

## Requirements

### Requirement 1

**User Story:** Como gestor da oficina, quero visualizar métricas em tempo real no dashboard, para que eu possa monitorar o desempenho do negócio instantaneamente

#### Acceptance Criteria

1. WHEN o Sistema carrega o Dashboard, THE Sistema SHALL buscar dados reais das coleções Firebase 'clients', 'vehicles', 'tools' e 'inventory' utilizando onSnapshot
2. WHEN ocorre uma alteração em qualquer coleção Firebase, THE Sistema SHALL atualizar automaticamente os dados exibidos no Dashboard sem necessidade de refresh manual
3. THE Sistema SHALL exibir skeleton loaders animados durante o carregamento inicial dos dados
4. THE Sistema SHALL calcular e exibir KPIs de total de clientes, total de veículos, total de ferramentas e total de produtos em estoque
5. THE Sistema SHALL exibir indicadores de tendência (crescimento ou queda) para cada KPI baseado em dados históricos

### Requirement 2

**User Story:** Como gestor, quero visualizar gráficos interativos de movimentação, para que eu possa identificar padrões e tendências no negócio

#### Acceptance Criteria

1. THE Sistema SHALL exibir um gráfico de linha mostrando a movimentação de clientes nos últimos 7 dias utilizando dados reais do Firebase
2. THE Sistema SHALL exibir um gráfico de barras mostrando a movimentação de veículos nos últimos 7 dias utilizando dados reais do Firebase
3. WHEN o usuário passa o mouse sobre um ponto do gráfico, THE Sistema SHALL exibir tooltip com informações detalhadas daquele dia
4. THE Sistema SHALL utilizar a biblioteca Recharts para renderização dos gráficos
5. THE Sistema SHALL aplicar animações suaves de entrada nos gráficos utilizando Framer Motion

### Requirement 3

**User Story:** Como gestor, quero receber alertas visuais sobre situações críticas, para que eu possa tomar ações corretivas rapidamente

#### Acceptance Criteria

1. WHEN existe produto com quantidade igual a zero no estoque, THE Sistema SHALL exibir alerta crítico vermelho na Central de Alertas
2. WHEN existe produto com quantidade menor ou igual ao mínimo definido, THE Sistema SHALL exibir alerta de aviso amarelo na Central de Alertas
3. WHEN existe ferramenta com status de manutenção, THE Sistema SHALL exibir alerta informativo azul na Central de Alertas
4. THE Sistema SHALL ordenar alertas por prioridade (crítico, aviso, informativo)
5. THE Sistema SHALL exibir badge com contador de alertas não visualizados

### Requirement 4

**User Story:** Como gestor, quero visualizar lista de clientes recentes, para que eu possa acompanhar novos cadastros e engajamento

#### Acceptance Criteria

1. THE Sistema SHALL buscar e exibir os 5 clientes mais recentes cadastrados ordenados por data de criação decrescente
2. THE Sistema SHALL exibir para cada cliente: nome, email, telefone, data de cadastro e total de serviços realizados
3. WHEN o cliente não possui foto, THE Sistema SHALL exibir avatar com iniciais do nome
4. THE Sistema SHALL aplicar animação de fade-in e slide ao carregar a lista
5. WHEN o usuário clica em um cliente, THE Sistema SHALL navegar para a página de detalhes do cliente

### Requirement 5

**User Story:** Como gestor, quero visualizar produtos com estoque crítico, para que eu possa realizar reposição antes de faltar

#### Acceptance Criteria

1. THE Sistema SHALL buscar e exibir produtos com quantidade menor ou igual ao mínimo definido
2. THE Sistema SHALL ordenar produtos por quantidade (menor primeiro)
3. THE Sistema SHALL exibir para cada produto: nome, código, quantidade atual, quantidade mínima e categoria
4. WHEN a quantidade é zero, THE Sistema SHALL destacar o produto com cor vermelha e badge "Esgotado"
5. WHEN a quantidade está baixa mas não zerada, THE Sistema SHALL destacar o produto com cor amarela e badge "Baixo"

### Requirement 6

**User Story:** Como gestor, quero visualizar ferramentas em uso, para que eu possa controlar a disponibilidade de equipamentos

#### Acceptance Criteria

1. THE Sistema SHALL buscar e exibir ferramentas com status "Em Uso", "em_uso" ou "in_use"
2. THE Sistema SHALL exibir para cada ferramenta: nome, código, categoria, responsável, localização e data de retirada
3. WHEN não há responsável atribuído, THE Sistema SHALL exibir "Não atribuído"
4. THE Sistema SHALL aplicar efeito de glassmorphism nos cards de ferramentas
5. THE Sistema SHALL atualizar a lista em tempo real quando o status de uma ferramenta mudar

### Requirement 7

**User Story:** Como gestor, quero visualizar veículos ativos em serviço, para que eu possa acompanhar o andamento dos trabalhos

#### Acceptance Criteria

1. THE Sistema SHALL buscar e exibir veículos com status "Em Montagem", "Aguardando Peças", "Teste", "em_servico" ou "in_service"
2. THE Sistema SHALL exibir para cada veículo: placa, marca, modelo, ano, status, cliente e data de entrada
3. THE Sistema SHALL aplicar badge colorido de acordo com o status do veículo
4. THE Sistema SHALL ordenar veículos por data de entrada (mais antigos primeiro)
5. WHEN o usuário clica em um veículo, THE Sistema SHALL exibir modal com detalhes completos

### Requirement 8

**User Story:** Como gestor, quero visualizar insights automáticos sobre clientes, para que eu possa entender melhor o comportamento e fidelização

#### Acceptance Criteria

1. THE Sistema SHALL calcular e exibir total de clientes, clientes recorrentes (mais de 1 serviço) e clientes novos (1 serviço ou menos)
2. THE Sistema SHALL calcular e exibir percentual de clientes recorrentes e percentual de clientes novos
3. THE Sistema SHALL calcular e exibir ticket médio baseado no histórico de serviços de todos os clientes
4. THE Sistema SHALL identificar e exibir clientes inativos (sem serviço há mais de 30 dias)
5. THE Sistema SHALL exibir ranking dos 5 clientes mais recorrentes com nome, total de serviços e data da última visita

### Requirement 9

**User Story:** Como gestor, quero que o dashboard tenha design Apple-like premium, para que a experiência seja elegante e profissional

#### Acceptance Criteria

1. THE Sistema SHALL aplicar paleta de cores minimalista com tons de branco, cinza e acentos sutis
2. THE Sistema SHALL suportar modo claro e modo escuro respeitando o tema atual do sistema
3. THE Sistema SHALL utilizar ícones SVG profissionais das bibliotecas Lucide React ou Heroicons
4. THE Sistema SHALL aplicar sombras suaves, cantos arredondados (rounded-2xl) e espaçamentos generosos
5. THE Sistema SHALL aplicar transições de hover, fade, slide e blur em todos os elementos interativos

### Requirement 10

**User Story:** Como gestor, quero que o dashboard tenha microanimações fluidas, para que a experiência seja agradável e moderna

#### Acceptance Criteria

1. THE Sistema SHALL aplicar animação de fade-in e slide-up ao carregar cada seção do dashboard
2. THE Sistema SHALL aplicar animação de scale e shadow-lift ao passar o mouse sobre cards clicáveis
3. THE Sistema SHALL aplicar animação de pulse nos skeleton loaders durante carregamento
4. THE Sistema SHALL aplicar transição suave de 300ms em todas as mudanças de estado visual
5. THE Sistema SHALL utilizar Framer Motion para orquestração de animações complexas

### Requirement 11

**User Story:** Como gestor, quero que o dashboard seja responsivo, para que eu possa acessá-lo de qualquer dispositivo

#### Acceptance Criteria

1. THE Sistema SHALL adaptar o layout do dashboard para telas mobile (< 768px), tablet (768px - 1024px) e desktop (> 1024px)
2. WHEN a tela é mobile, THE Sistema SHALL exibir KPIs em coluna única
3. WHEN a tela é tablet, THE Sistema SHALL exibir KPIs em grid de 2 colunas
4. WHEN a tela é desktop, THE Sistema SHALL exibir KPIs em grid de 4 colunas
5. THE Sistema SHALL manter legibilidade e usabilidade em todas as resoluções

### Requirement 12

**User Story:** Como gestor, quero que o dashboard tenha performance otimizada, para que o carregamento seja rápido mesmo com muitos dados

#### Acceptance Criteria

1. THE Sistema SHALL utilizar Promise.all para buscar dados de múltiplas coleções em paralelo
2. THE Sistema SHALL implementar memoização em cálculos complexos para evitar reprocessamento desnecessário
3. THE Sistema SHALL limitar queries do Firebase utilizando limit() quando apropriado
4. THE Sistema SHALL cancelar listeners do Firebase (onSnapshot) quando o componente for desmontado
5. THE Sistema SHALL exibir conteúdo em menos de 2 segundos após carregamento inicial
