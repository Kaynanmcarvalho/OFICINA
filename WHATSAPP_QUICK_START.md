# 🚀 WhatsApp Multi-Sessão - Quick Start

## ⚡ Início Rápido (5 minutos)

### 1️⃣ Instalar Dependências

```bash
# Backend
cd server
npm install

# Frontend (na raiz)
cd ..
npm install socket.io-client
```

### 2️⃣ Configurar Firebase

1. Acesse: https://console.firebase.google.com/
2. Vá em **Configurações** > **Contas de Serviço**
3. Clique em **Gerar nova chave privada**
4. Baixe o arquivo JSON

### 3️⃣ Configurar Variáveis de Ambiente

Crie `server/.env`:

```env
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
Sua-Chave-Privada-Aqui
-----END PRIVATE KEY-----"

PORT=3001
CORS_ORIGIN=http://localhost:5173
```

Crie `.env` na raiz:

```env
VITE_API_URL=http://localhost:3001
```

### 4️⃣ Iniciar Servidores

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5️⃣ Testar Conexão

1. Acesse: http://localhost:5173
2. Faça login no sistema
3. Vá para a página de **Orçamentos**
4. Clique em **"Conectar WhatsApp"**
5. Escaneie o QR Code com seu celular
6. ✅ Pronto! WhatsApp conectado

---

## 📱 Como Usar

### Na Página de Orçamentos

```jsx
import WhatsAppButton from '../../components/whatsapp/WhatsAppButton';

function BudgetsPage() {
  return (
    <div>
      <WhatsAppButton />
      {/* Resto da página */}
    </div>
  );
}
```

### Enviar Mensagem

```javascript
import { whatsappService } from '../services/whatsappService';

// Enviar mensagem simples
await whatsappService.sendMessage('5511999999999', 'Olá!');

// Enviar orçamento formatado
await whatsappService.sendBudget('5511999999999', budgetData);
```

---

## 🔍 Verificar Status

### Via API
```bash
curl http://localhost:3001/api/whatsapp/{empresaId}/status
```

### Via Hook
```jsx
import { useWhatsAppConnection } from '../hooks/useWhatsAppConnection';

function MyComponent() {
  const { isConnected, phoneNumber } = useWhatsAppConnection();
  
  return (
    <div>
      {isConnected ? `Conectado: ${phoneNumber}` : 'Desconectado'}
    </div>
  );
}
```

---

## 🐛 Problemas Comuns

### ❌ Erro: "Cannot find module 'whatsapp-web.js'"
```bash
cd server
npm install whatsapp-web.js
```

### ❌ QR Code não aparece
1. Verifique se o backend está rodando: http://localhost:3001/health
2. Limpe as sessões: `rm -rf server/sessions/*`
3. Reinicie o servidor

### ❌ Erro de autenticação Firebase
1. Verifique se o `.env` está configurado corretamente
2. Certifique-se de que a chave privada está entre aspas
3. Verifique se não há espaços extras

---

## 📊 Estrutura de Dados

### Firebase: `empresas/{empresaId}/whatsapp/status`

```json
{
  "status": "connected",
  "phoneNumber": "+5511999999999",
  "sessionPath": "sessions/empresa123",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Sessões Locais: `server/sessions/{empresaId}/`

Cada empresa tem seu próprio diretório com os dados de autenticação do WhatsApp.

---

## 🎯 Próximos Passos

1. ✅ Conectar WhatsApp
2. ✅ Testar envio de mensagem
3. ✅ Integrar na página de orçamentos
4. 📝 Personalizar mensagens
5. 🚀 Deploy em produção

---

## 📚 Documentação Completa

Veja: `WHATSAPP_MULTI_SESSION_GUIDE.md`

---

**Pronto! Sistema funcionando em 5 minutos! 🎉**
