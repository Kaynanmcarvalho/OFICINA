# WhatsApp Automation Backend

Sistema de automação para envio de orçamentos via WhatsApp usando Selenium WebDriver.

## 📋 Requisitos

- Python 3.8 ou superior
- Google Chrome instalado
- ChromeDriver (instalado automaticamente)

## 🚀 Instalação

### Windows

```bash
# Execute o script de instalação
install.bat
```

### Linux/Mac

```bash
# Dar permissão de execução
chmod +x install.sh

# Execute o script de instalação
./install.sh
```

### Instalação Manual

```bash
# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate.bat
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Copiar arquivo de configuração
cp .env.example .env
```

## ⚙️ Configuração

Edite o arquivo `.env` e configure as variáveis:

```env
WHATSAPP_PROFILE_DIR=./whatsapp_profile
SESSION_ENCRYPTION_KEY=sua-chave-secreta-aqui
WEBSOCKET_PORT=5001
FLASK_PORT=5000
FLASK_ENV=development
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

**IMPORTANTE:** Gere uma chave de criptografia segura para `SESSION_ENCRYPTION_KEY`:

```python
from cryptography.fernet import Fernet
print(Fernet.generate_key().decode())
```

## 🎯 Iniciar Servidor

### Windows

```bash
start.bat
```

### Linux/Mac

```bash
# Ativar ambiente virtual
source venv/bin/activate

# Iniciar servidor
python app.py
```

O servidor estará disponível em:
- API REST: `http://localhost:5000`
- WebSocket: `ws://localhost:5000/whatsapp`

## 📡 Endpoints da API

### POST /api/whatsapp/connect
Inicia processo de conexão e retorna QR Code

**Response:**
```json
{
  "status": "waiting_qr",
  "qr_code": "data:image/png;base64,..."
}
```

### GET /api/whatsapp/status
Verifica status da conexão

**Response:**
```json
{
  "connected": true,
  "user_data": {
    "name": "Nome do Usuário",
    "phone_number": "+55 11 99999-9999"
  }
}
```

### POST /api/whatsapp/send
Envia mensagem via WhatsApp

**Request:**
```json
{
  "phone_number": "+5511999999999",
  "message": "Olá! Segue seu orçamento...",
  "budget_id": "budget-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso"
}
```

### POST /api/whatsapp/disconnect
Desconecta sessão do WhatsApp

**Response:**
```json
{
  "success": true,
  "message": "Desconectado com sucesso"
}
```

## 🔌 Eventos WebSocket

### Namespace: `/whatsapp`

**Eventos do Servidor:**
- `qr_code_updated`: Novo QR Code gerado
- `authentication_success`: Autenticação bem-sucedida
- `send_progress`: Progresso do envio
- `send_success`: Envio concluído
- `send_error`: Erro no envio

**Eventos do Cliente:**
- `request_qr`: Solicitar novo QR Code

## 🔒 Segurança

- Sessões são criptografadas usando Fernet (AES)
- Perfil do Chrome é isolado e persistente
- Cookies e localStorage são protegidos
- CORS configurável para origens permitidas

## 🐛 Troubleshooting

### Erro: ChromeDriver não encontrado
O ChromeDriver é instalado automaticamente. Se houver erro, instale manualmente:
```bash
pip install webdriver-manager
```

### Erro: Selenium não consegue abrir o Chrome
Certifique-se de que o Google Chrome está instalado e atualizado.

### QR Code não aparece
- Verifique se o Chrome está abrindo corretamente
- Tente desabilitar o modo headless (comentar linha no código)
- Limpe o diretório `whatsapp_profile` e tente novamente

### Sessão expira constantemente
- Verifique se o perfil do Chrome está sendo salvo corretamente
- Certifique-se de que `WHATSAPP_PROFILE_DIR` está configurado
- Não feche o navegador manualmente durante o uso

## 📝 Logs

Os logs são exibidos no console durante a execução:
- ✓ Indica sucesso
- ✗ Indica erro
- ℹ️ Indica informação

## 🔄 Atualização

Para atualizar as dependências:

```bash
# Ativar ambiente virtual
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate.bat  # Windows

# Atualizar dependências
pip install --upgrade -r requirements.txt
```

## 📦 Estrutura de Arquivos

```
backend/whatsapp/
├── app.py                  # API Flask principal
├── whatsapp_service.py     # Serviço de automação
├── requirements.txt        # Dependências Python
├── .env                    # Configurações (não versionado)
├── .env.example            # Exemplo de configurações
├── install.sh              # Script de instalação (Linux/Mac)
├── install.bat             # Script de instalação (Windows)
├── start.bat               # Script de inicialização (Windows)
├── README.md               # Este arquivo
└── whatsapp_profile/       # Perfil do Chrome (criado automaticamente)
```

## ⚠️ Avisos Importantes

1. **Não compartilhe** o arquivo `.env` ou o diretório `whatsapp_profile`
2. **Não execute** múltiplas instâncias simultaneamente
3. **Mantenha** o Chrome atualizado
4. **Respeite** os limites de envio do WhatsApp para evitar bloqueios
5. **Use** apenas para fins legítimos e com consentimento dos destinatários

## 📄 Licença

Este projeto é parte do sistema de gestão de oficina e deve ser usado apenas internamente.
