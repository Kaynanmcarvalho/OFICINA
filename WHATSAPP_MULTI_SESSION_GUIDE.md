# 📱 Sistema WhatsApp Multi-Sessão - Guia Completo

## 🎯 Visão Geral

Sistema completo de integração WhatsApp para plataforma SaaS multi-empresa, com isolamento total de dados e sessões por empresa.

### ✨ Características Principais

- ✅ **Multi-empresa**: Cada empresa tem sua própria sessão isolada
- ✅ **Persistência automática**: Sessões são salvas e restauradas automaticamente
- ✅ **QR Code em tempo real**: Interface premium com feedback instantâneo
- ✅ **Socket.IO**: Comunicação em tempo real para atualizações de status
- ✅ **Firebase Integration**: Todos os dados salvos no Firestore
- ✅ **Reconexão automática**: Sistema detecta e reconecta automaticamente
- ✅ **Tema claro/escuro**: Interface adaptativa premium

---

## 🏗️ Arquitetura

### Backend (Node.js)

```
server/
├── services/
│   └── whatsappMultiSessionService.js  # Gerenciador de múltiplas sessões
├── routes/
│   └── whatsapp.routes.js              # Rotas da API
├── sessions/
│   ├── {empresaId1}/                   # Sessão da empresa 1
│   ├── {empresaId2}/                   # Sessão da empresa 2
│   └── ...
└── index.js                             # Servidor principal
```

### Frontend (React)

```
src/
├── components/
│   └── whatsapp/
│       ├── WhatsAppConnectionModal.jsx  # Modal de conexão
│       └── WhatsAppButton.jsx           # Botão com indicador
├── hooks/
│   └── useWhatsAppConnection.js         # Hook de gerenciamento
└── services/
    └── whatsappService.js               # Serviço de API
```

### Firebase Structure

```
empresas/
└── {empresaId}/
    └── whatsapp/
        └── status/
            ├── status: "connected" | "qr_ready" | "disconnected"
            ├── phoneNumber: "+5511999999999"
            ├── qr: "data:image/png;base64,..."
            ├── sessionPath: "sessions/{empresaId}"
            ├── updatedAt: timestamp
            └── errorMessage: "..." (se houver erro)
```

---

## 🚀 Instalação

### 1. Instalar Dependências

#### Backend
```bash
cd server
npm install whatsapp-web.js qrcode-terminal fs-extra
```

#### Frontend
```bash
npm install socket.io-client
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# API Configuration
VITE_API_URL=http://localhost:3001

# Firebase Admin SDK (Backend)
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_CLIENT_EMAIL=seu-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Server Configuration
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### 3. Obter Credenciais Firebase Admin

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Vá em **Configurações do Projeto** > **Contas de Serviço**
3. Clique em **Gerar nova chave privada**
4. Copie os valores para o `.env`

---

## 📡 API Endpoints

### POST `/api/whatsapp/:empresaId/start`
Inicia ou restaura uma sessão do WhatsApp

**Response:**
```json
{
  "success": true,
  "status": "qr_ready",
  "qr": "data:image/png;base64,...",
  "message": "QR Code gerado"
}
```

### GET `/api/whatsapp/:empresaId/status`
Retorna o status atual da sessão

**Response:**
```json
{
  "success": true,
  "exists": true,
  "status": "connected",
  "phoneNumber": "+5511999999999"
}
```

### POST `/api/whatsapp/:empresaId/send`
Envia uma mensagem via WhatsApp

**Body:**
```json
{
  "phoneNumber": "5511999999999",
  "message": "Olá! Seu orçamento está pronto."
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "...",
  "timestamp": 1234567890
}
```

### POST `/api/whatsapp/:empresaId/logout`
Desconecta a sessão (remove autenticação)

**Response:**
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

### GET `/api/whatsapp/sessions`
Lista todas as sessões ativas

**Response:**
```json
{
  "success": true,
  "count": 3,
  "sessions": [
    {
      "empresaId": "empresa1",
      "status": "connected",
      "phoneNumber": "+5511999999999",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 🎨 Uso no Frontend

### 1. Botão de Conexão (Simples)

```jsx
import WhatsAppButton from '../components/whatsapp/WhatsAppButton';

function MyPage() {
  return (
    <div>
      <WhatsAppButton />
    </div>
  );
}
```

### 2. Modal Customizado

```jsx
import { useState } from 'react';
import WhatsAppConnectionModal from '../components/whatsapp/WhatsAppConnectionModal';

function MyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Conectar WhatsApp
      </button>

      <WhatsAppConnectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
```

### 3. Hook de Gerenciamento

```jsx
import { useWhatsAppConnection } from '../hooks/useWhatsAppConnection';

function MyComponent() {
  const {
    isConnected,
    status,
    phoneNumber,
    connect,
    disconnect,
    sendMessage
  } = useWhatsAppConnection();

  const handleSendMessage = async () => {
    if (!isConnected) {
      await connect();
      return;
    }

    const result = await sendMessage('5511999999999', 'Olá!');
    console.log(result);
  };

  return (
    <div>
      <p>Status: {status}</p>
      {isConnected && <p>Número: {phoneNumber}</p>}
      <button onClick={handleSendMessage}>Enviar Mensagem</button>
    </div>
  );
}
```

### 4. Enviar Orçamento

```jsx
import { whatsappService } from '../services/whatsappService';

async function sendBudgetToClient(budget, clientPhone) {
  try {
    const result = await whatsappService.sendBudget(clientPhone, budget);
    
    if (result.success) {
      alert('Orçamento enviado com sucesso!');
    }
  } catch (error) {
    alert('Erro ao enviar: ' + error.message);
  }
}

// Uso
const budget = {
  client: { name: 'João Silva' },
  vehicle: { brand: 'Toyota', model: 'Corolla', plate: 'ABC-1234' },
  items: [
    { description: 'Troca de óleo', price: 150.00 },
    { description: 'Filtro de ar', price: 80.00 }
  ],
  total: 230.00
};

sendBudgetToClient(budget, '5511999999999');
```

---

## 🔄 Eventos Socket.IO

O sistema emite eventos em tempo real para cada empresa:

### Eventos Emitidos

| Evento | Descrição | Payload |
|--------|-----------|---------|
| `whatsapp:qr` | QR Code gerado | `{ empresaId, qr, timestamp }` |
| `whatsapp:authenticated` | Cliente autenticado | `{ empresaId, timestamp }` |
| `whatsapp:connected` | Cliente conectado | `{ empresaId, phoneNumber, timestamp }` |
| `whatsapp:disconnected` | Cliente desconectado | `{ empresaId, reason, timestamp }` |
| `whatsapp:auth_failure` | Falha na autenticação | `{ empresaId, message, timestamp }` |

### Exemplo de Listener

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('whatsapp:connected', (data) => {
  console.log('WhatsApp conectado:', data.phoneNumber);
});
```

---

## 🔐 Segurança e Isolamento

### Isolamento por Empresa

1. **Sessões Separadas**: Cada empresa tem seu próprio diretório `sessions/{empresaId}`
2. **Dados no Firebase**: Estrutura isolada em `empresas/{empresaId}/whatsapp`
3. **Socket.IO Rooms**: Cada empresa tem sua própria sala de comunicação
4. **Sem Compartilhamento**: Nenhum dado é compartilhado entre empresas

### Boas Práticas

- ✅ Sempre use o `empresaId` do usuário logado
- ✅ Valide permissões antes de enviar mensagens
- ✅ Implemente rate limiting para evitar spam
- ✅ Monitore logs de erro no Firebase
- ✅ Configure backup automático das sessões

---

## 🐛 Troubleshooting

### Problema: QR Code não aparece

**Solução:**
1. Verifique se o servidor está rodando: `http://localhost:3001/health`
2. Verifique os logs do servidor
3. Limpe o diretório de sessões: `rm -rf server/sessions/{empresaId}`

### Problema: Sessão desconecta frequentemente

**Solução:**
1. Verifique a conexão com a internet
2. Certifique-se de que o WhatsApp está ativo no celular
3. Não use o WhatsApp Web em outro navegador simultaneamente

### Problema: Mensagem não é enviada

**Solução:**
1. Verifique se a sessão está conectada: `GET /api/whatsapp/:empresaId/status`
2. Valide o formato do número: `5511999999999` (sem espaços ou caracteres especiais)
3. Verifique se o número está registrado no WhatsApp

### Problema: Erro ao inicializar Puppeteer

**Solução:**
```bash
# Linux
sudo apt-get install -y chromium-browser

# Windows
# Puppeteer instala automaticamente o Chromium
```

---

## 📊 Monitoramento

### Logs do Servidor

O servidor registra todos os eventos importantes:

```
[WhatsApp Service] Serviço multi-sessão inicializado
[WhatsApp] Inicializando sessão para empresa: empresa123
[WhatsApp] QR Code gerado para empresa: empresa123
[WhatsApp] Cliente conectado para empresa: empresa123
[WhatsApp] Mensagem enviada para 5511999999999 via empresa empresa123
```

### Verificar Sessões Ativas

```bash
curl http://localhost:3001/api/whatsapp/sessions
```

### Monitorar Firebase

Acesse o Firestore Console e navegue até:
```
empresas/{empresaId}/whatsapp/status
```

---

## 🚀 Deploy em Produção

### 1. Configurar Variáveis de Ambiente

```env
VITE_API_URL=https://api.seudominio.com
PORT=3001
CORS_ORIGIN=https://app.seudominio.com
```

### 2. Configurar Servidor

- Use PM2 para gerenciar o processo Node.js
- Configure HTTPS com certificado SSL
- Implemente rate limiting (ex: express-rate-limit)
- Configure backup automático do diretório `sessions/`

### 3. Otimizações

```javascript
// server/index.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições
});

app.use('/api/whatsapp', limiter);
```

---

## 📝 Exemplo Completo de Integração

```jsx
// src/pages/budgets/BudgetsPage.jsx
import { useState } from 'react';
import WhatsAppButton from '../../components/whatsapp/WhatsAppButton';
import { whatsappService } from '../../services/whatsappService';
import toast from 'react-hot-toast';

export default function BudgetsPage() {
  const [selectedBudget, setSelectedBudget] = useState(null);

  const handleSendBudget = async (budget) => {
    try {
      // Verificar se está conectado
      const status = await whatsappService.getStatus();
      
      if (!status.exists || status.status !== 'connected') {
        toast.error('WhatsApp não está conectado. Conecte primeiro.');
        return;
      }

      // Enviar orçamento
      const result = await whatsappService.sendBudget(
        budget.client.phone,
        budget
      );

      if (result.success) {
        toast.success('Orçamento enviado com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao enviar: ' + error.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orçamentos</h1>
        <WhatsAppButton />
      </div>

      {/* Lista de orçamentos */}
      <div className="space-y-4">
        {budgets.map(budget => (
          <div key={budget.id} className="p-4 bg-white rounded-lg shadow">
            <h3>{budget.client.name}</h3>
            <p>Total: R$ {budget.total.toFixed(2)}</p>
            <button
              onClick={() => handleSendBudget(budget)}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
            >
              Enviar via WhatsApp
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## ✅ Checklist de Implementação

- [x] Backend Node.js com whatsapp-web.js
- [x] Sistema multi-sessão isolado por empresa
- [x] Rotas da API REST
- [x] Socket.IO para eventos em tempo real
- [x] Persistência no Firebase Firestore
- [x] Armazenamento local de sessões
- [x] Frontend React com modal premium
- [x] Hook de gerenciamento
- [x] Botão com indicador de status
- [x] Serviço de envio de mensagens
- [x] Reconexão automática
- [x] Suporte a tema claro/escuro
- [x] Documentação completa

---

## 🎉 Pronto para Usar!

O sistema está completo e funcional. Para iniciar:

1. **Backend:**
   ```bash
   cd server
   npm start
   ```

2. **Frontend:**
   ```bash
   npm run dev
   ```

3. **Acessar:** http://localhost:5173

4. **Conectar WhatsApp:** Clique no botão "Conectar WhatsApp" e escaneie o QR Code

---

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique os logs do servidor
- Consulte a documentação do [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
- Verifique o status no Firebase Console

---

**Desenvolvido com ❤️ para o Torq**
