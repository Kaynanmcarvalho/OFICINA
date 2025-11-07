# Requirements Document - Sistema de Envio Automático de WhatsApp

## Introduction

Sistema de automação de envio de orçamentos via WhatsApp integrado ao backend Python, permitindo que o usuário autentique uma única vez via QR Code e o sistema envie mensagens automaticamente em nome do usuário sem necessidade de intervenção manual.

## Glossary

- **Sistema**: Aplicação web de gestão de oficina
- **Backend**: Servidor Python Flask/FastAPI responsável pela automação
- **WhatsApp Web**: Interface web do WhatsApp acessada via navegador
- **QR Code**: Código de autenticação gerado pelo WhatsApp Web
- **Sessão**: Conexão autenticada mantida entre o backend e WhatsApp Web
- **Orçamento**: Documento com serviços e valores a serem enviados ao cliente

## Requirements

### Requirement 1

**User Story:** Como usuário do sistema, eu quero autenticar minha conta do WhatsApp uma única vez via QR Code, para que o sistema possa enviar orçamentos automaticamente sem minha intervenção manual.

#### Acceptance Criteria

1. WHEN o usuário clica em "Enviar" em um orçamento pela primeira vez, THE Sistema SHALL exibir um modal com QR Code para autenticação
2. WHEN o QR Code é escaneado com sucesso, THE Sistema SHALL armazenar a sessão autenticada de forma persistente
3. WHEN a sessão é estabelecida, THE Sistema SHALL fechar o modal e confirmar a autenticação
4. WHILE a sessão estiver ativa, THE Sistema SHALL permitir envios automáticos sem nova autenticação
5. IF a sessão expirar, THEN THE Sistema SHALL solicitar nova autenticação via QR Code

### Requirement 2

**User Story:** Como usuário do sistema, eu quero que o backend envie orçamentos via WhatsApp automaticamente, para que eu não precise abrir o WhatsApp Web manualmente.

#### Acceptance Criteria

1. WHEN o usuário clica em "Enviar" em um orçamento, THE Backend SHALL processar o envio automaticamente via Selenium
2. WHEN o envio é iniciado, THE Sistema SHALL exibir um indicador de progresso no frontend
3. WHEN o envio é concluído com sucesso, THE Sistema SHALL atualizar o status do orçamento para "enviado"
4. IF o envio falhar, THEN THE Sistema SHALL exibir mensagem de erro e manter o status como "pendente"
5. THE Backend SHALL enviar a mensagem formatada com detalhes do orçamento e link de aprovação

### Requirement 3

**User Story:** Como usuário do sistema, eu quero visualizar o status da conexão do WhatsApp, para saber se o sistema está pronto para enviar mensagens.

#### Acceptance Criteria

1. THE Sistema SHALL exibir um indicador visual do status da conexão WhatsApp no navbar
2. WHEN a conexão está ativa, THE Sistema SHALL exibir ícone verde com texto "WhatsApp Conectado"
3. WHEN a conexão está inativa, THE Sistema SHALL exibir ícone vermelho com texto "WhatsApp Desconectado"
4. WHEN o usuário clica no indicador, THE Sistema SHALL exibir detalhes da sessão (número conectado, tempo de conexão)
5. THE Sistema SHALL verificar o status da conexão a cada 30 segundos

### Requirement 4

**User Story:** Como usuário do sistema, eu quero que o orçamento enviado contenha um link de aprovação, para que o cliente possa aprovar diretamente pelo WhatsApp.

#### Acceptance Criteria

1. WHEN um orçamento é enviado, THE Sistema SHALL gerar um link único de aprovação
2. THE Sistema SHALL incluir o link na mensagem do WhatsApp formatada
3. WHEN o cliente clica no link, THE Sistema SHALL abrir a página de aprovação do orçamento
4. THE Sistema SHALL permitir aprovação total ou parcial dos itens
5. WHEN o cliente aprova, THE Sistema SHALL atualizar o status do orçamento em tempo real

### Requirement 5

**User Story:** Como administrador do sistema, eu quero gerenciar a sessão do WhatsApp, para poder desconectar e reconectar quando necessário.

#### Acceptance Criteria

1. THE Sistema SHALL fornecer opção de "Desconectar WhatsApp" nas configurações
2. WHEN o usuário desconecta, THE Backend SHALL encerrar a sessão e limpar dados armazenados
3. THE Sistema SHALL fornecer opção de "Reconectar WhatsApp" que exibe novo QR Code
4. THE Sistema SHALL exibir informações da conta conectada (número, nome)
5. THE Sistema SHALL permitir múltiplas tentativas de conexão em caso de falha
