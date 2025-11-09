# Requirements Document - Sistema Multi-Tenant Torq

## Introduction

Este documento define os requisitos para implementação de uma arquitetura multi-tenant completa no sistema Torq (SaaS para oficinas mecânicas). O sistema permitirá que múltiplas empresas utilizem a plataforma de forma isolada, cada uma com sua própria identidade visual, dados segregados, usuários independentes e sessões WhatsApp exclusivas, mantendo um design Apple-like premium e imersivo.

## Glossary

- **Sistema Torq**: Plataforma SaaS para gestão de oficinas mecânicas, estética automotiva e autopeças
- **Empresa**: Organização cliente que contrata o sistema Torq (tenant)
- **EmpresaId**: Identificador único de cada empresa no sistema
- **Tenant**: Instância isolada de dados e configurações de uma empresa
- **Slug**: Identificador amigável em URL para cada empresa (ex: speedcar-motors)
- **Firebase**: Plataforma backend (Firestore + Auth) utilizada pelo sistema
- **Firestore**: Banco de dados NoSQL do Firebase
- **EmpresaContext**: Contexto React global que armazena dados da empresa ativa
- **Role**: Papel/permissão de um usuário (admin, atendente, financeiro)
- **Cache de Placas**: Armazenamento global compartilhado de consultas de placas veiculares
- **Sessão WhatsApp**: Conexão exclusiva de WhatsApp Business de cada empresa
- **Glassmorphism**: Efeito visual de vidro translúcido com blur
- **Apple-like**: Design inspirado nos princípios de interface da Apple (clean, fluido, imersivo)

## Requirements

### Requirement 1: Estrutura de Dados Multi-Tenant no Firebase

**User Story:** Como administrador do sistema, eu quero que cada empresa tenha seus dados completamente isolados no Firebase, para que nenhuma empresa possa acessar dados de outra.

#### Acceptance Criteria

1. WHEN uma nova empresa é cadastrada, THE Sistema Torq SHALL criar um documento em `/empresas/{empresaId}` com campos: nomeFantasia, slug, logo, tema, plano, ativo, criadoEm
2. THE Sistema Torq SHALL criar subcoleções isoladas para cada empresa: `/empresas/{empresaId}/clientes`, `/empresas/{empresaId}/veiculos`, `/empresas/{empresaId}/orcamentos`, `/empresas/{empresaId}/checkins`, `/empresas/{empresaId}/usuarios`, `/empresas/{empresaId}/whatsapp_session`, `/empresas/{empresaId}/configuracoes`
3. THE Sistema Torq SHALL manter uma coleção global `/cache_placas/{placa}` compartilhada entre todas as empresas
4. WHEN qualquer query é executada, THE Sistema Torq SHALL incluir obrigatoriamente o empresaId no path da coleção
5. THE Sistema Torq SHALL garantir que nenhuma query retorne dados de empresas diferentes da empresa ativa

### Requirement 2: Autenticação e Contexto Global

**User Story:** Como usuário do sistema, eu quero fazer login e ter acesso apenas aos dados da minha empresa, para que minha sessão seja segura e isolada.

#### Acceptance Criteria

1. WHEN um usuário faz login via Firebase Auth, THE Sistema Torq SHALL buscar o documento do usuário contendo empresaId, role, nome, email
2. THE Sistema Torq SHALL criar um EmpresaContext React contendo empresaId, nomeFantasia, logo, tema, plano, permissoes
3. THE Sistema Torq SHALL armazenar o empresaId no sessionStorage com chave "empresaId"
4. THE Sistema Torq SHALL disponibilizar o EmpresaContext para todos os componentes via React Context API
5. WHEN o usuário navega entre páginas, THE Sistema Torq SHALL manter o empresaId persistido no sessionStorage
6. WHEN o usuário faz logout, THE Sistema Torq SHALL limpar o sessionStorage e resetar o EmpresaContext

### Requirement 3: Identidade Visual Dinâmica por Empresa

**User Story:** Como administrador de uma empresa, eu quero personalizar as cores e logo do sistema, para que a interface reflita a identidade visual da minha marca.

#### Acceptance Criteria

1. THE Sistema Torq SHALL armazenar configurações visuais em `/empresas/{empresaId}/configuracoes` com campos: corPrimaria, corSecundaria, corFundo, logo, gradientes
2. WHEN o EmpresaContext é carregado, THE Sistema Torq SHALL aplicar as cores personalizadas usando CSS variables
3. THE Sistema Torq SHALL exibir o logo da empresa no topo da sidebar e na tela de login
4. THE Sistema Torq SHALL exibir o nome da empresa e plano ativo no header no formato "{nomeFantasia} | Plano {plano}"
5. THE Sistema Torq SHALL aplicar transições suaves com Framer Motion em todas as mudanças de tema
6. THE Sistema Torq SHALL manter design Apple-like com glassmorphism, sombreamentos sutis e profundidade visual
7. THE Sistema Torq SHALL utilizar ícones SVG profissionais e tipografia moderna (SF Pro, Inter ou Nunito Sans)

### Requirement 4: Sistema de Permissões e Usuários

**User Story:** Como administrador de uma empresa, eu quero gerenciar usuários com diferentes níveis de acesso, para que cada funcionário tenha apenas as permissões necessárias.

#### Acceptance Criteria

1. THE Sistema Torq SHALL armazenar usuários em `/empresas/{empresaId}/usuarios/{userId}` com campos: nome, email, role, ativo, criadoEm
2. THE Sistema Torq SHALL suportar três roles: admin (acesso total), atendente (criar clientes, orçamentos, check-ins), financeiro (acessar caixa e relatórios)
3. WHEN um usuário com role "atendente" acessa o sistema, THE Sistema Torq SHALL ocultar menus e botões de administração e financeiro
4. WHEN um usuário com role "financeiro" acessa o sistema, THE Sistema Torq SHALL ocultar menus de administração e limitar acesso a dados financeiros
5. WHEN um usuário com role "admin" acessa o sistema, THE Sistema Torq SHALL exibir todos os menus e funcionalidades
6. THE Sistema Torq SHALL validar permissões no frontend e backend antes de executar ações sensíveis

### Requirement 5: Sessão WhatsApp Exclusiva por Empresa

**User Story:** Como administrador de uma empresa, eu quero conectar minha própria conta WhatsApp Business, para que eu possa enviar mensagens aos meus clientes de forma independente.

#### Acceptance Criteria

1. THE Sistema Torq SHALL armazenar dados da sessão WhatsApp em `/empresas/{empresaId}/whatsapp_session` com campos: token, sessionId, webhook, status, conectadoEm
2. THE Sistema Torq SHALL exibir status visual da sessão WhatsApp ("Conectado ✅" ou "Desconectado ❌")
3. THE Sistema Torq SHALL fornecer botão "Conectar WhatsApp" que exibe QR Code quando necessário
4. WHEN uma empresa envia mensagem WhatsApp, THE Sistema Torq SHALL utilizar apenas a sessão dessa empresa
5. THE Sistema Torq SHALL garantir que nenhuma empresa possa visualizar ou enviar mensagens usando sessão de outra empresa

### Requirement 6: Cache Global de Placas Compartilhado

**User Story:** Como usuário do sistema, eu quero que consultas de placas veiculares sejam rápidas e econômicas, para que o sistema não faça chamadas de API repetidas desnecessariamente.

#### Acceptance Criteria

1. THE Sistema Torq SHALL armazenar consultas de placas em `/cache_placas/{placa}` com campos: marca, modelo, ano, cor, consultadoEm, empresaId (da primeira consulta)
2. WHEN um usuário consulta uma placa, THE Sistema Torq SHALL verificar primeiro se existe em `/cache_placas/{placa}`
3. IF a placa existe no cache e foi consultada há menos de 30 dias, THE Sistema Torq SHALL retornar os dados do cache
4. IF a placa não existe no cache ou está desatualizada, THE Sistema Torq SHALL chamar a API externa, salvar no cache e retornar os dados
5. THE Sistema Torq SHALL permitir que todas as empresas utilizem o cache compartilhado para reduzir custos de API

### Requirement 7: Sistema de Subdomínios e Identificação

**User Story:** Como empresa cliente, eu quero acessar o sistema através de uma URL personalizada, para que minha marca seja reforçada e o acesso seja facilitado.

#### Acceptance Criteria

1. THE Sistema Torq SHALL suportar URLs no formato `https://torq.app/{slug_da_empresa}`
2. THE Sistema Torq SHALL armazenar o slug único de cada empresa em `/empresas/{empresaId}/slug`
3. WHEN um usuário acessa uma URL com slug, THE Sistema Torq SHALL identificar a empresa pelo slug e carregar suas configurações
4. THE Sistema Torq SHALL validar que cada slug é único no sistema
5. WHEN o slug não é encontrado, THE Sistema Torq SHALL exibir página de erro 404 personalizada

### Requirement 8: Interface Premium Apple-like

**User Story:** Como usuário do sistema, eu quero uma interface elegante e fluida, para que minha experiência seja premium e agradável.

#### Acceptance Criteria

1. THE Sistema Torq SHALL implementar animações suaves com Framer Motion em transições de página e modais
2. THE Sistema Torq SHALL utilizar efeitos de glassmorphism com blur e transparência em cards e modais
3. THE Sistema Torq SHALL aplicar sombreamentos sutis e profundidade visual em todos os elementos
4. THE Sistema Torq SHALL utilizar tipografia premium (SF Pro Display, Inter ou Nunito Sans)
5. THE Sistema Torq SHALL implementar microinterações em botões, inputs e elementos clicáveis
6. THE Sistema Torq SHALL manter navegação intuitiva com feedback visual imediato
7. THE Sistema Torq SHALL utilizar ícones Lucide React e SVGs otimizados

### Requirement 9: Segurança e Isolamento de Dados

**User Story:** Como administrador do sistema, eu quero garantir que os dados de cada empresa estejam completamente isolados e seguros, para que não haja vazamento de informações entre empresas.

#### Acceptance Criteria

1. THE Sistema Torq SHALL validar empresaId em todas as queries do Firestore
2. THE Sistema Torq SHALL implementar middleware no backend Node.js que verifica empresaId em cada requisição autenticada
3. THE Sistema Torq SHALL incluir empresaId, uid e role no token JWT
4. THE Sistema Torq SHALL registrar logs de auditoria em `/empresas/{empresaId}/logs` com campos: acao, usuario, timestamp, detalhes
5. THE Sistema Torq SHALL retornar erro 403 (Forbidden) quando houver tentativa de acesso a dados de outra empresa

### Requirement 10: Dashboard Administrativo Global

**User Story:** Como dono do SaaS Torq, eu quero visualizar métricas globais de todas as empresas, para que eu possa monitorar o uso e saúde da plataforma.

#### Acceptance Criteria

1. THE Sistema Torq SHALL fornecer rota administrativa `/admin/dashboard` acessível apenas para super-admin
2. THE Sistema Torq SHALL exibir total de empresas cadastradas e ativas
3. THE Sistema Torq SHALL exibir total de clientes ativos em todas as empresas
4. THE Sistema Torq SHALL exibir estatísticas de uso do cache de placas (quantidade e economia de API)
5. THE Sistema Torq SHALL exibir monitor de sessões WhatsApp ativas por empresa
6. THE Sistema Torq SHALL exibir gráficos de crescimento e uso da plataforma

### Requirement 11: Dashboard por Empresa

**User Story:** Como administrador de uma empresa, eu quero visualizar métricas específicas da minha empresa, para que eu possa acompanhar o desempenho do meu negócio.

#### Acceptance Criteria

1. THE Sistema Torq SHALL exibir dashboard com métricas da empresa: "Clientes este mês", "Orçamentos concluídos", "Check-ins ativos", "Receita do mês"
2. THE Sistema Torq SHALL filtrar todas as métricas pelo empresaId da empresa ativa
3. THE Sistema Torq SHALL exibir gráficos de evolução temporal com dados apenas da empresa
4. THE Sistema Torq SHALL permitir exportação de relatórios em PDF com identidade visual da empresa

### Requirement 12: Visualização de Clientes

**User Story:** Como usuário do sistema, eu quero visualizar meus clientes em modo lista ou grid, para que eu possa escolher a melhor forma de navegar pelos dados.

#### Acceptance Criteria

1. THE Sistema Torq SHALL fornecer toggle para alternar entre visualização em lista e grid
2. WHEN modo grid está ativo, THE Sistema Torq SHALL exibir cards de clientes com foto, nome, telefone e último atendimento
3. WHEN modo lista está ativo, THE Sistema Torq SHALL exibir tabela com colunas: nome, telefone, email, veículos, último atendimento
4. THE Sistema Torq SHALL manter a preferência de visualização no localStorage
5. THE Sistema Torq SHALL aplicar animações suaves ao alternar entre modos
