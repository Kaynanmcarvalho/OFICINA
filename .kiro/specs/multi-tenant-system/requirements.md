# Requirements Document - Sistema Multi-Tenant Torq

## Introduction

Este documento especifica os requisitos para implementação de uma arquitetura multi-tenant completa no sistema Torq (SaaS para oficinas mecânicas). O sistema permitirá que múltiplas empresas utilizem a plataforma de forma isolada, com identidade visual própria, dados segregados e experiência premium Apple-like.

## Glossary

- **Sistema Torq**: Plataforma SaaS para gestão de oficinas mecânicas, estética automotiva e autopeças
- **Empresa**: Organização cliente que contrata o Sistema Torq (tenant)
- **empresaId**: Identificador único de cada Empresa no Firebase Firestore
- **Usuário**: Pessoa que acessa o Sistema Torq vinculada a uma Empresa específica
- **Firebase Auth**: Serviço de autenticação do Firebase
- **Firestore**: Banco de dados NoSQL do Firebase
- **EmpresaContext**: Contexto React global que armazena dados da Empresa ativa
- **Slug**: Identificador textual único da Empresa usado em URLs
- **Cache Global de Placas**: Coleção compartilhada entre todas as Empresas para consultas de veículos
- **Sessão WhatsApp**: Conexão exclusiva de cada Empresa com a API do WhatsApp
- **Role**: Papel/permissão de um Usuário (admin, atendente, financeiro)
- **Tema**: Configuração visual personalizada de cada Empresa (cores, logo, gradientes)

## Requirements

### Requirement 1: Isolamento de Dados por Empresa

**User Story:** Como administrador do sistema, eu quero que cada empresa tenha seus dados completamente isolados, para que nenhuma empresa possa acessar informações de outra.

#### Acceptance Criteria

1. WHEN o Sistema Torq cria uma nova Empresa, THE Sistema Torq SHALL gerar um empresaId único no formato UUID v4
2. THE Sistema Torq SHALL armazenar todos os dados de clientes, veículos, orçamentos, check-ins e usuários dentro da subcoleção `/empresas/{empresaId}`
3. WHEN um Usuário realiza uma consulta ao Firestore, THE Sistema Torq SHALL incluir obrigatoriamente o empresaId no caminho da coleção
4. THE Sistema Torq SHALL rejeitar qualquer consulta que não contenha um empresaId válido com código de erro 403
5. WHERE uma Empresa tenta acessar dados de outra Empresa, THE Sistema Torq SHALL retornar uma lista vazia sem expor a existência dos dados

### Requirement 2: Autenticação e Contexto Global

**User Story:** Como usuário do sistema, eu quero fazer login e ter acesso automático aos dados da minha empresa, para que eu possa trabalhar sem precisar selecionar manualmente minha empresa.

#### Acceptance Criteria

1. WHEN um Usuário realiza login via Firebase Auth, THE Sistema Torq SHALL buscar o documento do Usuário contendo empresaId, role, nome e email
2. THE Sistema Torq SHALL criar um EmpresaContext React contendo empresaId, nomeFantasia, logo, tema, plano e permissoes
3. THE Sistema Torq SHALL armazenar o empresaId no sessionStorage com a chave "empresaId"
4. WHEN o Usuário navega entre páginas, THE Sistema Torq SHALL recuperar o empresaId do sessionStorage para manter a sessão
5. IF o empresaId não for encontrado no sessionStorage, THEN THE Sistema Torq SHALL redirecionar o Usuário para a tela de login

### Requirement 3: Identidade Visual Dinâmica

**User Story:** Como administrador de uma empresa, eu quero personalizar as cores e logo do sistema, para que minha equipe trabalhe com a identidade visual da nossa marca.

#### Acceptance Criteria

1. THE Sistema Torq SHALL permitir que cada Empresa configure cor primária, cor secundária, gradientes e logo em `/empresas/{empresaId}/configuracoes`
2. WHEN o EmpresaContext é carregado, THE Sistema Torq SHALL aplicar o tema personalizado da Empresa em todos os componentes visuais
3. THE Sistema Torq SHALL exibir o logo da Empresa no topo da sidebar e na tela de login
4. THE Sistema Torq SHALL exibir o nome da Empresa e o plano ativo no header no formato "{nomeFantasia} | Plano {plano}"
5. THE Sistema Torq SHALL aplicar transições suaves de 300ms ao alternar entre temas usando cubic-bezier(0.4, 0, 0.2, 1)

### Requirement 4: Sistema de Permissões por Role

**User Story:** Como administrador de uma empresa, eu quero controlar o que cada usuário pode fazer no sistema, para que eu possa limitar acessos conforme a função de cada pessoa.

#### Acceptance Criteria

1. THE Sistema Torq SHALL suportar três roles: admin (acesso total), atendente (criar clientes, orçamentos, check-ins) e financeiro (acessar caixa e relatórios)
2. WHEN um Usuário com role "atendente" acessa o sistema, THE Sistema Torq SHALL ocultar menus e botões de funcionalidades financeiras
3. WHEN um Usuário com role "financeiro" acessa o sistema, THE Sistema Torq SHALL ocultar menus e botões de criação de check-ins
4. THE Sistema Torq SHALL armazenar o role do Usuário em `/empresas/{empresaId}/usuarios/{userId}`
5. THE Sistema Torq SHALL validar permissões no backend antes de executar operações sensíveis

### Requirement 5: Sessão WhatsApp Exclusiva por Empresa

**User Story:** Como usuário de uma empresa, eu quero conectar o WhatsApp da minha empresa ao sistema, para que eu possa enviar mensagens aos clientes sem interferir em outras empresas.

#### Acceptance Criteria

1. THE Sistema Torq SHALL armazenar token, webhook e sessionId de cada Empresa em `/empresas/{empresaId}/whatsapp_session`
2. THE Sistema Torq SHALL exibir o status da sessão WhatsApp como "Conectado ✅" quando ativa ou "Desconectado ❌" quando inativa
3. WHEN uma Empresa clica em "Conectar WhatsApp", THE Sistema Torq SHALL gerar um QR Code exclusivo para aquela Empresa
4. THE Sistema Torq SHALL impedir que uma Empresa visualize ou envie mensagens usando a sessão de outra Empresa
5. WHEN a sessão WhatsApp expira, THE Sistema Torq SHALL notificar apenas os Usuários da Empresa afetada

### Requirement 6: Cache Global de Placas Compartilhado

**User Story:** Como usuário do sistema, eu quero que consultas de placas já realizadas sejam reutilizadas, para que o sistema seja mais rápido e econômico.

#### Acceptance Criteria

1. THE Sistema Torq SHALL armazenar resultados de consultas de placas em `/cache_placas/{placa}` acessível por todas as Empresas
2. WHEN um Usuário consulta uma placa, THE Sistema Torq SHALL verificar primeiro se existe no cache local da sessão
3. IF a placa não existe no cache local, THEN THE Sistema Torq SHALL buscar em `/cache_placas/{placa}`
4. IF a placa não existe no cache global, THEN THE Sistema Torq SHALL chamar a API externa, salvar o resultado em `/cache_placas/{placa}` e retornar os dados
5. THE Sistema Torq SHALL incluir timestamp de criação em cada entrada do cache para permitir expiração futura

### Requirement 7: Estrutura Firebase Hierárquica

**User Story:** Como desenvolvedor do sistema, eu quero uma estrutura de dados clara e escalável no Firebase, para que seja fácil manter e expandir o sistema.

#### Acceptance Criteria

1. THE Sistema Torq SHALL organizar dados no Firestore seguindo a estrutura `/empresas/{empresaId}/{subcoleção}`
2. THE Sistema Torq SHALL criar as subcoleções: clientes, veiculos, orcamentos, checkins, usuarios, whatsapp_session e configuracoes
3. THE Sistema Torq SHALL manter a coleção `/cache_placas` no nível raiz, fora de `/empresas`
4. THE Sistema Torq SHALL incluir índices compostos no Firestore para queries frequentes com empresaId
5. THE Sistema Torq SHALL documentar a estrutura de dados em um arquivo FIRESTORE_STRUCTURE.md

### Requirement 8: Sistema de Slug e Roteamento

**User Story:** Como administrador de uma empresa, eu quero que minha empresa tenha uma URL exclusiva, para que seja fácil de compartilhar e memorizar.

#### Acceptance Criteria

1. THE Sistema Torq SHALL permitir que cada Empresa defina um slug único alfanumérico em `/empresas/{empresaId}/slug`
2. THE Sistema Torq SHALL validar que o slug contém apenas letras minúsculas, números e hífens
3. WHEN um Usuário acessa `https://torq.app/{slug}`, THE Sistema Torq SHALL identificar a Empresa pelo slug e carregar suas configurações
4. THE Sistema Torq SHALL redirecionar para página de erro 404 se o slug não existir
5. THE Sistema Torq SHALL impedir que dois slugs idênticos sejam cadastrados

### Requirement 9: Interface Apple-like Premium

**User Story:** Como usuário do sistema, eu quero uma interface elegante e fluida, para que minha experiência de trabalho seja agradável e profissional.

#### Acceptance Criteria

1. THE Sistema Torq SHALL aplicar animações suaves usando Framer Motion com duração entre 200ms e 400ms
2. THE Sistema Torq SHALL utilizar tipografia premium (SF Pro Display, Inter ou Nunito Sans) com pesos entre 400 e 700
3. THE Sistema Torq SHALL aplicar sombras sutis com múltiplas camadas (0 2px 8px, 0 4px 16px, 0 8px 32px) em cards e modais
4. THE Sistema Torq SHALL implementar efeito glassmorphism com backdrop-filter blur(12px) e transparência de 80-95%
5. THE Sistema Torq SHALL utilizar ícones Lucide React com tamanho mínimo de 20px e máximo de 32px

### Requirement 10: Segurança e Auditoria

**User Story:** Como administrador do sistema, eu quero que todas as ações sejam seguras e rastreáveis, para que eu possa garantir a integridade dos dados.

#### Acceptance Criteria

1. THE Sistema Torq SHALL validar o empresaId em todas as requisições autenticadas no backend
2. THE Sistema Torq SHALL incluir empresaId, uid e role no token JWT gerado após autenticação
3. THE Sistema Torq SHALL registrar logs de ações críticas em `/empresas/{empresaId}/logs` com timestamp, userId e ação
4. THE Sistema Torq SHALL implementar rate limiting de 100 requisições por minuto por Usuário
5. THE Sistema Torq SHALL criptografar dados sensíveis (senhas, tokens) usando bcrypt com salt rounds mínimo de 10

### Requirement 11: Dashboard Administrativo Global

**User Story:** Como dono do SaaS Torq, eu quero visualizar métricas globais de todas as empresas, para que eu possa monitorar a saúde do sistema.

#### Acceptance Criteria

1. THE Sistema Torq SHALL criar uma rota `/admin/dashboard` acessível apenas por super-admin
2. THE Sistema Torq SHALL exibir total de Empresas cadastradas, Empresas ativas e Empresas inativas
3. THE Sistema Torq SHALL exibir total de Usuários ativos em todas as Empresas
4. THE Sistema Torq SHALL exibir quantidade de entradas no cache de placas e taxa de hit/miss
5. THE Sistema Torq SHALL exibir lista de sessões WhatsApp ativas com nome da Empresa e status

### Requirement 12: Performance e Escalabilidade

**User Story:** Como usuário do sistema, eu quero que o sistema seja rápido mesmo com muitos dados, para que eu possa trabalhar com eficiência.

#### Acceptance Criteria

1. THE Sistema Torq SHALL carregar a página inicial em menos de 2 segundos em conexão 4G
2. THE Sistema Torq SHALL implementar paginação com limite de 50 itens por página em listas longas
3. THE Sistema Torq SHALL utilizar lazy loading para componentes pesados (modais, gráficos)
4. THE Sistema Torq SHALL implementar cache local com IndexedDB para dados frequentemente acessados
5. THE Sistema Torq SHALL comprimir imagens de logo para máximo de 200KB usando WebP ou AVIF

### Requirement 13: Migração de Dados Existentes

**User Story:** Como desenvolvedor do sistema, eu quero migrar os dados atuais para a nova estrutura multi-tenant, para que não haja perda de informações.

#### Acceptance Criteria

1. THE Sistema Torq SHALL criar um script de migração que move dados de coleções raiz para `/empresas/{empresaId}`
2. THE Sistema Torq SHALL criar uma Empresa padrão com empresaId gerado para os dados existentes
3. THE Sistema Torq SHALL vincular todos os Usuários existentes à Empresa padrão
4. THE Sistema Torq SHALL validar integridade dos dados após migração comparando contagens
5. THE Sistema Torq SHALL criar backup completo do Firestore antes de executar a migração

### Requirement 14: Onboarding de Novas Empresas

**User Story:** Como nova empresa contratando o Torq, eu quero um processo simples de cadastro, para que eu possa começar a usar rapidamente.

#### Acceptance Criteria

1. WHEN uma nova Empresa se cadastra, THE Sistema Torq SHALL criar automaticamente a estrutura `/empresas/{empresaId}` com subcoleções vazias
2. THE Sistema Torq SHALL solicitar nome fantasia, CNPJ, email, telefone e slug desejado
3. THE Sistema Torq SHALL criar o primeiro Usuário com role "admin" vinculado à nova Empresa
4. THE Sistema Torq SHALL aplicar tema padrão (cores Torq) até que a Empresa personalize
5. THE Sistema Torq SHALL enviar email de boas-vindas com link de acesso e tutorial em vídeo

### Requirement 15: Modo Offline e Sincronização

**User Story:** Como usuário do sistema, eu quero continuar trabalhando mesmo sem internet, para que eu não perca produtividade.

#### Acceptance Criteria

1. THE Sistema Torq SHALL habilitar persistência offline do Firestore com enablePersistence()
2. WHEN o Usuário perde conexão, THE Sistema Torq SHALL exibir badge "Modo Offline" no header
3. THE Sistema Torq SHALL permitir criação e edição de registros offline armazenando em fila local
4. WHEN a conexão é restaurada, THE Sistema Torq SHALL sincronizar automaticamente dados pendentes
5. THE Sistema Torq SHALL notificar o Usuário sobre conflitos de sincronização e permitir resolução manual
