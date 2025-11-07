# WhatsApp Web Integration - Guia Completo

Integração completa do WhatsApp Web com React + Firebase usando whatsapp-web.js.

## 📋 Índice

- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução](#execução)
- [Uso](#uso)
- [Troubleshooting](#troubleshooting)
- [API Reference](#api-reference)

## 🏗️ Arquitetura

```
Frontend (React + Vite)
    ↓ HTTP/WebSocket
Backend (Node.js + Express)
    ↓ whatsapp-web.js
WhatsApp Web
    ↓ Firebase Admin SDK
Firebase (Firestore + Auth)
```

## ✅ Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta Firebase configurada
- Chrome/Chromium instalado (para Puppeteer)

## 📦 Instalação

### 1. Backend

```bash
cd server
npm install
```

### 2. Frontend

```bash
# Na raiz do projeto
npm install socket.io-client
```

## ⚙️ Configuração

### 1. Firebase Setup

#### a) Criar projeto no Firebase Console
1. Acesse https://console.firebase.google.com
2. Crie um novo projeto
3. Ative Authentication (Email/Password)
4. Crie banco Firestore

#### b) Obter credenciais Admin SDK
1. Project Settings → Service Accounts
2. Generate New Private Key
3. Salvar arquivo JSON

#### c) Configurar Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /whatsapp_sessions/{sessionId} {
      allow read, write: if request.auth != null 
         && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 2. Variáveis de Ambiente

#### Backend (`server/.env`)

```env
# Firebase Admin
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-projeto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_AQUI\n-----END PRIVATE KEY-----\n"

# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# WhatsApp
WHATSAPP_SESSION_PATH=./sessions
WHATSAPP_TIMEOUT=60000
```

#### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
```

### 3. Configurar Firebase no Frontend

Certifique-se de que `src/services/firebase.js` está configurado:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ... outras configs
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## 🚀 Execução

### 1. Iniciar Backend

```bash
cd server
npm run dev
```

Você deve ver:
```
🚀 Servidor rodando na porta 3001
📡 Socket.IO habilitado
🔥 Firebase Admin inicializado
```

### 2. Iniciar Frontend

```bash
# Na raiz do projeto
npm run dev
```

### 3. Acessar Aplicação

Abra http://localhost:5173/orcamento

## 💻 Uso

### Integrar no Modal Existente

```jsx
// src/pages/Orcamento.jsx
import WhatsAppQRConnector from '../components/WhatsAppQRConnector';

function Orcamento() {
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsWhatsAppModalOpen(true)}>
        Conectar WhatsApp
      </button>

      <Modal 
        isOpen={isWhatsAppModalOpen} 
        onClose={() => setIsWhatsAppModalOpen(false)}
      >
        <ModalHeader>Conectar WhatsApp</ModalHeader>
        <ModalBody>
          <WhatsAppQRConnector />
        </ModalBody>
      </Modal>
    </>
  );
}
```

### Enviar Mensagem

```javascript
import whatsappService from '../services/whatsappService';

// Enviar mensagem
await whatsappService.sendMessage(
  '+5511999999999',
  'Olá! Esta é uma mensagem de teste.'
);
```

## 🔧 Troubleshooting

### Erro: "Token inválido"

**Causa**: Token Firebase expirado ou inválido

**Solução**:
```javascript
// Forçar refresh do token
const user = auth.currentUser;
await user.getIdToken(true);
```

### Erro: "QR Code não aparece"

**Causa**: Backend não está rodando ou Socket.IO não conectou

**Verificar**:
1. Backend está rodando na porta 3001?
2. Console do navegador mostra erros de Socket.IO?
3. Firewall bloqueando WebSocket?

**Solução**:
```bash
# Verificar se porta está em uso
netstat -ano | findstr :3001  # Windows
lsof -i :3001                 # Linux/Mac

# Reiniciar backend
cd server
npm run dev
```

### Erro: "Puppeteer não encontra Chrome"

**Causa**: Chrome/Chromium não instalado

**Solução Windows**:
```bash
# Instalar via Chocolatey
choco install googlechrome
```

**Solução Linux**:
```bash
sudo apt-get install chromium-browser
```

### Erro: "Firebase Admin SDK failed"

**Causa**: Credenciais inválidas ou malformatadas

**Solução**:
1. Verificar se FIREBASE_PRIVATE_KEY tem `\n` corretos
2. Testar credenciais:

```javascript
// server/test-firebase.js
require('dotenv').config();
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  })
});

console.log('✅ Firebase Admin inicializado com sucesso');
```

### QR Code expira muito rápido

**Causa**: Timer padrão de 60 segundos

**Solução**: Aumentar timeout em `useWhatsAppConnection.js`:

```javascript
const [expiresIn, setExpiresIn] = useState(120); // 2 minutos
```

### Sessão não persiste após reload

**Causa**: LocalAuth não está salvando corretamente

**Solução**:
1. Verificar permissões da pasta `sessions/`
2. Limpar sessões antigas:

```bash
cd server
rm -rf sessions/*
```

## 📚 API Reference

### REST Endpoints

#### POST `/api/whatsapp/generate-qr`
Gera QR Code para autenticação

**Headers**:
```
Authorization: Bearer <firebase-token>
```

**Response**:
```json
{
  "success": true,
  "message": "QR Code sendo gerado"
}
```

#### GET `/api/whatsapp/status`
Verifica status da conexão

**Response**:
```json
{
  "success": true,
  "isConnected": true,
  "state": "CONNECTED",
  "info": {
    "wid": { "user": "5511999999999" },
    "pushname": "Nome do Usuário"
  }
}
```

#### POST `/api/whatsapp/disconnect`
Desconecta sessão

**Response**:
```json
{
  "success": true,
  "message": "Desconectado com sucesso"
}
```

#### POST `/api/whatsapp/send-message`
Envia mensagem

**Body**:
```json
{
  "phoneNumber": "+5511999999999",
  "message": "Olá!"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso"
}
```

### WebSocket Events

#### Client → Server

**`authenticate`**
```javascript
socket.emit('authenticate', firebaseToken);
```

#### Server → Client

**`authenticated`**
```javascript
socket.on('authenticated', ({ userId }) => {
  console.log('Autenticado:', userId);
});
```

**`qr-update`**
```javascript
socket.on('qr-update', ({ qrCode }) => {
  // qrCode é data URL base64
});
```

**`whatsapp-ready`**
```javascript
socket.on('whatsapp-ready', ({ info }) => {
  // Conexão estabelecida
});
```

## 📝 Estrutura Firestore

### Collection: `whatsapp_sessions`

```javascript
{
  userId: "firebase_user_id",
  isConnected: true,
  phoneNumber: "5511999999999",
  pushname: "Nome do Usuário",
  platform: "android",
  qrCode: "data:image/png;base64,...", // null quando conectado
  expiresAt: Timestamp,
  lastConnected: Timestamp,
  updatedAt: Timestamp,
  lastError: {
    type: "auth_failure",
    message: "Erro...",
    timestamp: Timestamp
  }
}
```

## 🎨 Customização

### Alterar Tempo de Expiração do QR

```javascript
// src/hooks/useWhatsAppConnection.js
const [expiresIn, setExpiresIn] = useState(120); // 2 minutos
```

### Adicionar Notificações Toast

```javascript
// Instalar
npm install react-hot-toast

// Usar no componente
import toast from 'react-hot-toast';

socket.on('whatsapp-ready', () => {
  toast.success('WhatsApp conectado!');
});
```

### Dark Mode

O componente já suporta dark mode via Tailwind. Certifique-se de ter:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
}
```

## 🔒 Segurança

### Checklist

- ✅ Tokens Firebase verificados no backend
- ✅ Sessões isoladas por usuário
- ✅ Firestore Security Rules configuradas
- ✅ CORS configurado corretamente
- ✅ Variáveis sensíveis em `.env`
- ✅ `.env` no `.gitignore`

### Recomendações Produção

1. **HTTPS obrigatório**
2. **Rate limiting** nos endpoints
3. **Logs estruturados** (Winston, Pino)
4. **Monitoramento** (Sentry, DataDog)
5. **Backup** das sessões
6. **Limpeza** de sessões antigas (cron job)

## 📄 Licença

MIT

## 🤝 Suporte

Para problemas ou dúvidas, abra uma issue no repositório.
