# Implementation Plan - Sistema de Envio Automático de WhatsApp

- [x] 1. Configurar ambiente backend Python


  - Criar diretório `backend/whatsapp` para módulo de automação
  - Instalar dependências: selenium, flask-socketio, flask-cors
  - Baixar e configurar ChromeDriver
  - _Requirements: 1.1, 2.1_



- [ ] 2. Implementar serviço de automação WhatsApp
- [ ] 2.1 Criar classe WhatsAppService
  - Implementar inicialização do Selenium WebDriver com perfil persistente
  - Configurar opções do Chrome para manter sessão
  - Adicionar método para abrir WhatsApp Web
  - _Requirements: 1.2, 1.3_

- [ ] 2.2 Implementar captura e geração de QR Code
  - Criar método `get_qr_code()` que captura elemento canvas do QR
  - Converter canvas para imagem base64
  - Implementar polling para detectar novo QR Code
  - _Requirements: 1.1_

- [ ] 2.3 Implementar detecção de autenticação
  - Criar método `wait_for_authentication()` que aguarda login
  - Detectar elementos da interface autenticada
  - Retornar dados do usuário (nome, número)
  - _Requirements: 1.3_

- [ ] 2.4 Implementar persistência de sessão
  - Criar métodos `save_session()` e `load_session()`
  - Salvar cookies e localStorage em arquivo JSON
  - Restaurar sessão ao reiniciar o serviço
  - _Requirements: 1.2, 1.4_

- [ ] 2.5 Implementar envio de mensagens
  - Criar método `send_message(phone, message)`
  - Navegar para conversa usando URL do WhatsApp Web
  - Localizar campo de texto e enviar mensagem
  - Aguardar confirmação de envio (ícone de check)
  - _Requirements: 2.1, 2.5_

- [ ] 2.6 Implementar verificação de status
  - Criar método `check_connection_status()`
  - Verificar presença de elementos da interface
  - Retornar informações da conta conectada
  - _Requirements: 3.1, 3.2, 3.3, 3.5_

- [ ] 2.7 Implementar desconexão
  - Criar método `disconnect()`
  - Fazer logout do WhatsApp Web
  - Limpar cookies e dados salvos
  - Fechar navegador

  - _Requirements: 5.1, 5.2_

- [ ] 3. Criar API REST para WhatsApp
- [ ] 3.1 Criar endpoint POST /api/whatsapp/connect
  - Inicializar WhatsAppService

  - Capturar QR Code
  - Retornar QR Code em base64
  - _Requirements: 1.1_

- [x] 3.2 Criar endpoint GET /api/whatsapp/status

  - Verificar status da conexão
  - Retornar dados da conta conectada
  - Implementar cache de 30 segundos
  - _Requirements: 3.1, 3.2, 3.3, 3.5_

- [ ] 3.3 Criar endpoint POST /api/whatsapp/send
  - Receber dados do orçamento

  - Formatar mensagem com detalhes
  - Enviar via WhatsAppService
  - Atualizar status do orçamento
  - Registrar log de envio
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 3.4 Criar endpoint POST /api/whatsapp/disconnect
  - Desconectar sessão
  - Limpar dados
  - Retornar confirmação
  - _Requirements: 5.1, 5.2_

- [ ] 4. Implementar WebSocket para tempo real
- [ ] 4.1 Configurar Flask-SocketIO
  - Inicializar SocketIO no backend
  - Configurar CORS para frontend
  - Criar namespace `/whatsapp`
  - _Requirements: 1.1, 2.2_

- [ ] 4.2 Implementar eventos de QR Code
  - Emitir evento `qr_code_updated` quando QR muda
  - Emitir evento `authentication_success` após login
  - Implementar timeout de 60 segundos
  - _Requirements: 1.1, 1.3_

- [ ] 4.3 Implementar eventos de envio
  - Emitir evento `send_progress` durante envio
  - Emitir evento `send_success` ou `send_error`
  - Incluir informações de progresso
  - _Requirements: 2.2_

- [ ] 5. Criar modelo de dados para sessão
- [ ] 5.1 Criar tabela whatsapp_sessions
  - Definir schema com SQLAlchemy
  - Campos: id, phone_number, name, cookies, local_storage, connected_at, is_active
  - Criar migrations
  - _Requirements: 1.2_

- [ ] 5.2 Criar tabela whatsapp_messages
  - Definir schema para log de mensagens
  - Campos: id, budget_id, phone_number, message, sent_at, status, error_message
  - Criar migrations
  - _Requirements: 2.3_

- [-] 6. Implementar componente frontend - Modal de Conexão



- [ ] 6.1 Criar WhatsAppConnectionModal.jsx
  - Criar estrutura do modal com estados (loading, qr, authenticating, success)
  - Implementar layout responsivo com Tailwind
  - Adicionar animações com Framer Motion
  - _Requirements: 1.1_

- [ ] 6.2 Integrar WebSocket no modal
  - Conectar ao Socket.IO do backend
  - Escutar evento `qr_code_updated`
  - Escutar evento `authentication_success`
  - Atualizar UI em tempo real
  - _Requirements: 1.1, 1.3_

- [ ] 6.3 Implementar exibição do QR Code
  - Exibir imagem do QR Code
  - Adicionar instruções de uso
  - Implementar timer de expiração (60s)
  - Adicionar botão para gerar novo QR
  - _Requirements: 1.1_

- [ ] 6.4 Implementar feedback de autenticação
  - Exibir loading durante autenticação
  - Mostrar mensagem de sucesso
  - Exibir dados da conta conectada
  - Fechar modal automaticamente após 2 segundos
  - _Requirements: 1.3_

- [ ] 7. Implementar componente frontend - Indicador de Status
- [ ] 7.1 Criar WhatsAppStatusIndicator.jsx
  - Criar componente com ícone e texto
  - Implementar cores dinâmicas (verde/vermelho)
  - Adicionar tooltip com detalhes
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 7.2 Implementar verificação periódica
  - Fazer polling a cada 30 segundos
  - Chamar endpoint /api/whatsapp/status

  - Atualizar estado do componente
  - _Requirements: 3.5_

- [ ] 7.3 Adicionar indicador ao Navbar
  - Integrar WhatsAppStatusIndicator no NavbarActions
  - Posicionar entre busca e tema
  - Adicionar click handler para abrir detalhes
  - _Requirements: 3.1_

- [ ] 8. Atualizar fluxo de envio de orçamentos
- [ ] 8.1 Modificar handleSendBudget em BudgetsPage
  - Verificar status da conexão antes de enviar
  - Abrir modal de conexão se não conectado
  - Chamar API de envio se conectado
  - _Requirements: 2.1_

- [x] 8.2 Implementar indicador de progresso

  - Exibir loading no card durante envio
  - Mostrar progresso via WebSocket
  - Desabilitar botão durante envio
  - _Requirements: 2.2_

- [ ] 8.3 Atualizar status do orçamento após envio
  - Marcar como "enviado" no banco
  - Atualizar UI em tempo real
  - Exibir toast de sucesso
  - _Requirements: 2.3_

- [ ] 8.4 Implementar tratamento de erros
  - Capturar erros de envio
  - Exibir mensagem apropriada
  - Manter status como "pendente"
  - Oferecer retry
  - _Requirements: 2.4_

- [ ] 9. Implementar formatação de mensagem do orçamento
- [ ] 9.1 Criar template de mensagem
  - Formatar mensagem com nome do cliente
  - Incluir detalhes do orçamento (itens, valores)
  - Adicionar link de aprovação
  - Usar emojis para melhor visualização
  - _Requirements: 2.5, 4.2_

- [ ] 9.2 Gerar link de aprovação único
  - Criar token único para cada orçamento
  - Gerar URL completa com domínio
  - Incluir na mensagem formatada
  - _Requirements: 4.1, 4.2_

- [ ] 10. Implementar página de gerenciamento WhatsApp
- [ ] 10.1 Criar WhatsAppSettingsPage.jsx
  - Exibir status da conexão
  - Mostrar informações da conta conectada
  - Adicionar botão "Desconectar"
  - Adicionar botão "Reconectar"
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 10.2 Implementar ação de desconectar
  - Chamar endpoint /api/whatsapp/disconnect
  - Atualizar UI após desconexão
  - Exibir confirmação
  - _Requirements: 5.1, 5.2_

- [ ] 10.3 Implementar ação de reconectar
  - Abrir modal de conexão
  - Gerar novo QR Code
  - Permitir múltiplas tentativas
  - _Requirements: 5.3, 5.5_

- [ ] 10.4 Adicionar rota no menu
  - Adicionar item "WhatsApp" no sidebar
  - Configurar rota /settings/whatsapp
  - Adicionar ícone apropriado
  - _Requirements: 5.4_

- [ ] 11. Implementar tratamento de erros robusto
- [ ] 11.1 Adicionar retry logic no backend
  - Implementar 3 tentativas com backoff exponencial
  - Registrar erros no banco de dados
  - Retornar erro detalhado para frontend
  - _Requirements: 2.4_

- [ ] 11.2 Implementar detecção de sessão expirada
  - Verificar elementos do WhatsApp Web periodicamente
  - Emitir evento de sessão expirada
  - Solicitar nova autenticação
  - _Requirements: 1.5_

- [ ] 11.3 Implementar recuperação de crash do navegador
  - Monitorar processo do Selenium
  - Reiniciar driver automaticamente
  - Notificar frontend sobre reconexão
  - _Requirements: 1.5_

- [ ] 12. Adicionar segurança e validações
- [ ] 12.1 Implementar criptografia de sessão
  - Criptografar cookies antes de salvar
  - Usar variável de ambiente para chave
  - Descriptografar ao carregar sessão
  - _Requirements: 1.2_

- [ ] 12.2 Adicionar rate limiting
  - Limitar envios para 10 por minuto
  - Implementar fila de mensagens
  - Retornar erro 429 se exceder limite
  - _Requirements: 2.1_

- [ ] 12.3 Validar permissões de usuário
  - Verificar JWT em todos os endpoints
  - Validar que usuário pode enviar orçamentos
  - Registrar ações no log de auditoria
  - _Requirements: 2.1, 5.1_

- [ ]* 13. Testes e documentação
- [ ]* 13.1 Escrever testes unitários backend
  - Testar WhatsAppService com mocks
  - Testar endpoints da API
  - Testar persistência de sessão
  - _Requirements: Todos_

- [ ]* 13.2 Escrever testes de componentes frontend
  - Testar WhatsAppConnectionModal
  - Testar WhatsAppStatusIndicator
  - Testar fluxo de envio
  - _Requirements: Todos_

- [ ]* 13.3 Criar documentação de uso
  - Documentar processo de primeira conexão
  - Documentar troubleshooting comum
  - Criar guia de configuração do ambiente
  - _Requirements: Todos_
