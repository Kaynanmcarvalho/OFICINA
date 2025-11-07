# Design Document - Sistema de Envio Automático de WhatsApp

## Overview

Sistema de automação de WhatsApp usando Selenium WebDriver com Python no backend, permitindo autenticação via QR Code e envio automático de orçamentos. A arquitetura utiliza WebSockets para comunicação em tempo real entre frontend e backend durante o processo de autenticação e envio.

## Architecture

### High-Level Architecture

```
┌─────────────────┐         WebSocket/HTTP        ┌──────────────────┐
│                 │◄──────────────────────────────►│                  │
│   Frontend      │                                │   Backend        │
│   (React)       │         REST API               │   (Python)       │
│                 │◄──────────────────────────────►│                  │
└─────────────────┘                                └──────────────────┘
                                                            │
                                                            │ Selenium
                                                            ▼
                                                    ┌──────────────────┐
                                                    │  Chrome/Firefox  │
                                                    │  WhatsApp Web    │
                                                    └──────────────────┘
```

### Technology Stack

**Backend:**
- Python 3.10+
- Flask/FastAPI (API REST)
- Flask-SocketIO (WebSocket para tempo real)
- Selenium WebDriver (automação do navegador)
- Chrome/Firefox WebDriver
- SQLite/PostgreSQL (persistência de sessão)

**Frontend:**
- React
- Socket.IO Client (comunicação tempo real)
- Framer Motion (animações)
- React Hot Toast (notificações)

## Components and Interfaces

### 1. Backend - WhatsApp Service (`whatsapp_service.py`)

```python
class WhatsAppService:
    """
    Serviço principal de automação do WhatsApp
    """
    
    def __init__(self):
        self.driver = None
        self.session_file = "whatsapp_session.json"
        self.is_authenticated = False
        
    def initialize_driver(self):
        """Inicializa o Selenium WebDriver com perfil persistente"""
        
    def get_qr_code(self):
        """Captura o QR Code do WhatsApp Web e retorna como base64"""
        
    def wait_for_authentication(self):
        """Aguarda o usuário escanear o QR Code"""
        
    def save_session(self):
        """Salva cookies e dados da sessão para reutilização"""
        
    def load_session(self):
        """Carrega sessão salva anteriormente"""
        
    def send_message(self, phone_number, message):
        """Envia mensagem para um número específico"""
        
    def check_connection_status(self):
        """Verifica se a conexão está ativa"""
        
    def disconnect(self):
        """Encerra a sessão e limpa dados"""
```

**Configuração do Selenium:**
```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

options = Options()
options.add_argument("--user-data-dir=./whatsapp_profile")  # Perfil persistente
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
# options.add_argument("--headless")  # Opcional: modo headless

driver = webdriver.Chrome(options=options)
driver.get("https://web.whatsapp.com")
```

### 2. Backend - API Endpoints

#### POST `/api/whatsapp/connect`
Inicia o processo de conexão e retorna QR Code

**Request:**
```json
{}
```

**Response:**
```json
{
  "status": "waiting_qr",
  "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "session_id": "uuid-v4"
}
```

#### GET `/api/whatsapp/status`
Verifica status da conexão

**Response:**
```json
{
  "connected": true,
  "phone_number": "+55 11 99999-9999",
  "name": "Nome do Usuário",
  "connected_since": "2024-01-01T10:00:00Z"
}
```

#### POST `/api/whatsapp/send`
Envia orçamento via WhatsApp

**Request:**
```json
{
  "budget_id": "budget-uuid",
  "phone_number": "+5511999999999",
  "message": "Olá! Segue seu orçamento...",
  "approval_link": "https://app.com/approve/token"
}
```

**Response:**
```json
{
  "success": true,
  "message_id": "msg-uuid",
  "sent_at": "2024-01-01T10:00:00Z"
}
```

#### POST `/api/whatsapp/disconnect`
Desconecta a sessão do WhatsApp

**Response:**
```json
{
  "success": true,
  "message": "Desconectado com sucesso"
}
```

### 3. Backend - WebSocket Events

#### Event: `qr_code_updated`
Emitido quando um novo QR Code é gerado

**Payload:**
```json
{
  "qr_code": "data:image/png;base64,..."
}
```

#### Event: `authentication_success`
Emitido quando o QR Code é escaneado com sucesso

**Payload:**
```json
{
  "phone_number": "+55 11 99999-9999",
  "name": "Nome do Usuário"
}
```

#### Event: `send_progress`
Emitido durante o envio de mensagem

**Payload:**
```json
{
  "budget_id": "budget-uuid",
  "status": "sending",
  "progress": 50
}
```

### 4. Frontend - WhatsApp Connection Modal

**Component:** `WhatsAppConnectionModal.jsx`

```jsx
const WhatsAppConnectionModal = ({ isOpen, onClose, onSuccess }) => {
  const [qrCode, setQrCode] = useState(null);
  const [status, setStatus] = useState('loading'); // loading, qr, authenticating, success
  
  useEffect(() => {
    if (isOpen) {
      // Conectar ao WebSocket
      // Solicitar QR Code
      // Aguardar autenticação
    }
  }, [isOpen]);
  
  return (
    <Modal>
      {status === 'qr' && (
        <div>
          <h2>Conectar WhatsApp</h2>
          <p>Escaneie o QR Code com seu WhatsApp</p>
          <img src={qrCode} alt="QR Code" />
        </div>
      )}
    </Modal>
  );
};
```

### 5. Frontend - WhatsApp Status Indicator

**Component:** `WhatsAppStatusIndicator.jsx`

```jsx
const WhatsAppStatusIndicator = () => {
  const [status, setStatus] = useState(null);
  
  useEffect(() => {
    // Verificar status a cada 30 segundos
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${
        status?.connected ? 'bg-green-500' : 'bg-red-500'
      }`} />
      <span>{status?.connected ? 'WhatsApp Conectado' : 'Desconectado'}</span>
    </div>
  );
};
```

### 6. Frontend - Budget Send Flow

**Fluxo atualizado em `BudgetsPage.jsx`:**

```jsx
const handleSendBudget = async (budget) => {
  // 1. Verificar se WhatsApp está conectado
  const status = await checkWhatsAppStatus();
  
  if (!status.connected) {
    // 2. Abrir modal de conexão
    setShowWhatsAppModal(true);
    return;
  }
  
  // 3. Enviar orçamento
  try {
    setIsSending(true);
    await sendBudgetViaWhatsApp(budget);
    toast.success('Orçamento enviado com sucesso!');
  } catch (error) {
    toast.error('Erro ao enviar orçamento');
  } finally {
    setIsSending(false);
  }
};
```

## Data Models

### WhatsApp Session (Backend - SQLite/PostgreSQL)

```python
class WhatsAppSession(Base):
    __tablename__ = 'whatsapp_sessions'
    
    id = Column(String, primary_key=True)
    phone_number = Column(String, nullable=False)
    name = Column(String)
    cookies = Column(JSON)  # Cookies do navegador
    local_storage = Column(JSON)  # LocalStorage do WhatsApp Web
    connected_at = Column(DateTime, default=datetime.utcnow)
    last_activity = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
```

### Message Log (Backend)

```python
class WhatsAppMessage(Base):
    __tablename__ = 'whatsapp_messages'
    
    id = Column(String, primary_key=True)
    budget_id = Column(String, ForeignKey('budgets.id'))
    phone_number = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    sent_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String)  # sent, failed, delivered, read
    error_message = Column(Text)
```

## Error Handling

### Backend Error Scenarios

1. **QR Code Timeout**
   - Timeout: 60 segundos
   - Action: Gerar novo QR Code automaticamente
   - Notification: Emitir evento `qr_code_updated`

2. **Session Expired**
   - Detection: Verificar presença de elementos do WhatsApp Web
   - Action: Solicitar nova autenticação
   - Notification: Retornar `connected: false` no status

3. **Send Message Failure**
   - Retry: 3 tentativas com backoff exponencial
   - Fallback: Abrir WhatsApp Web manualmente
   - Logging: Registrar erro no banco de dados

4. **Browser Crash**
   - Detection: Monitorar processo do Selenium
   - Action: Reiniciar driver automaticamente
   - Notification: Emitir evento de reconexão necessária

### Frontend Error Handling

```jsx
try {
  await sendBudget(budget);
} catch (error) {
  if (error.code === 'NOT_CONNECTED') {
    setShowWhatsAppModal(true);
  } else if (error.code === 'SEND_FAILED') {
    toast.error('Falha ao enviar. Tente novamente.');
  } else {
    toast.error('Erro inesperado. Contate o suporte.');
  }
}
```

## Testing Strategy

### Backend Tests

1. **Unit Tests**
   - `test_initialize_driver()`: Verificar inicialização do Selenium
   - `test_save_load_session()`: Testar persistência de sessão
   - `test_send_message()`: Testar envio de mensagem (mock)

2. **Integration Tests**
   - `test_qr_code_flow()`: Testar fluxo completo de autenticação
   - `test_send_budget_flow()`: Testar envio de orçamento end-to-end

### Frontend Tests

1. **Component Tests**
   - `WhatsAppConnectionModal.test.jsx`: Testar modal de conexão
   - `WhatsAppStatusIndicator.test.jsx`: Testar indicador de status

2. **E2E Tests**
   - Testar fluxo completo: conectar → enviar → verificar status

## Security Considerations

1. **Session Storage**
   - Criptografar cookies e dados de sessão
   - Usar variáveis de ambiente para chaves de criptografia

2. **API Authentication**
   - Requer autenticação JWT para todos os endpoints
   - Validar permissões do usuário

3. **Rate Limiting**
   - Limitar envios para 10 mensagens por minuto
   - Prevenir spam e bloqueio do WhatsApp

4. **Data Privacy**
   - Não armazenar conteúdo de mensagens por mais de 30 dias
   - Permitir exclusão de dados pelo usuário

## Performance Optimization

1. **Browser Profile Reuse**
   - Manter perfil do Chrome persistente
   - Evitar login repetido

2. **Connection Pooling**
   - Manter uma instância do Selenium ativa
   - Reutilizar para múltiplos envios

3. **Async Processing**
   - Processar envios em background
   - Usar fila de mensagens (Celery/RQ)

4. **Caching**
   - Cache de status de conexão (30 segundos)
   - Reduzir verificações desnecessárias

## Deployment Considerations

1. **Dependencies**
   ```bash
   pip install selenium flask flask-socketio flask-cors
   ```

2. **Chrome/Firefox Driver**
   - Instalar ChromeDriver ou GeckoDriver
   - Adicionar ao PATH do sistema

3. **Environment Variables**
   ```
   WHATSAPP_PROFILE_DIR=./whatsapp_profile
   SESSION_ENCRYPTION_KEY=your-secret-key
   WEBSOCKET_PORT=5001
   ```

4. **Process Management**
   - Usar supervisor ou systemd para manter processo ativo
   - Configurar restart automático em caso de falha
