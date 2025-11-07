# 🚨 Configuração Urgente - WhatsApp Backend

## ⚠️ Problema Atual

O backend do WhatsApp não está rodando. Você precisa:

1. ✅ Configurar credenciais do Firebase
2. ✅ Iniciar o servidor backend
3. ✅ Verificar se está acessível

---

## 🔧 Solução Rápida

### 1. Obter Credenciais do Firebase

1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto: **oficina-reparofacil**
3. Vá em **⚙️ Configurações do Projeto** > **Contas de Serviço**
4. Clique em **Gerar nova chave privada**
5. Baixe o arquivo JSON

### 2. Configurar Backend

Edite o arquivo `server/.env`:

```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=oficina-reparofacil
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@oficina-reparofacil.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
Cole aqui a chave privada do JSON baixado
-----END PRIVATE KEY-----"

# Server Configuration
PORT=3001
CORS_ORIGIN=https://torq.up.railway.app
NODE_ENV=production
```

**⚠️ IMPORTANTE:** 
- Copie o `client_email` do JSON para `FIREBASE_CLIENT_EMAIL`
- Copie o `private_key` do JSON para `FIREBASE_PRIVATE_KEY`
- Mantenha as aspas e quebras de linha (`\n`)

### 3. Iniciar Backend Localmente (Teste)

```bash
cd server
npm install
npm start
```

Você deve ver:
```
🚀 Servidor rodando na porta 3001
📡 Socket.IO habilitado
🔥 Firebase Admin inicializado
📱 Restaurando sessões do WhatsApp...
✅ Sistema pronto!
```

### 4. Testar Localmente

```bash
# Em outro terminal
curl http://localhost:3001/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"..."}
```

---

## 🚀 Deploy no Railway

### Opção A: Backend Separado (Recomendado)

1. **Criar novo serviço no Railway:**
   - Vá em: https://railway.app/
   - Clique em **New Project** > **Deploy from GitHub repo**
   - Selecione o repositório
   - Configure o **Root Directory**: `server`

2. **Configurar Variáveis de Ambiente:**
   ```
   FIREBASE_PROJECT_ID=oficina-reparofacil
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@oficina-reparofacil.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
   PORT=3001
   CORS_ORIGIN=https://torq.up.railway.app
   NODE_ENV=production
   ```

3. **Deploy:**
   - Railway vai detectar automaticamente o `package.json`
   - Vai instalar dependências e iniciar com `npm start`

4. **Obter URL do Backend:**
   - Railway vai gerar uma URL tipo: `https://whatsapp-backend-production.up.railway.app`
   - Copie essa URL

5. **Atualizar Frontend:**
   - Edite `.env` na raiz:
   ```env
   VITE_API_URL=https://whatsapp-backend-production.up.railway.app
   ```

### Opção B: Backend no Mesmo Serviço

Se você quer rodar tudo junto:

1. **Criar script de inicialização:**

Crie `start-all.sh`:
```bash
#!/bin/bash

# Iniciar backend em background
cd server
npm install
npm start &

# Aguardar backend iniciar
sleep 5

# Iniciar frontend
cd ..
npm run preview
```

2. **Atualizar package.json:**
```json
{
  "scripts": {
    "start": "bash start-all.sh"
  }
}
```

---

## 🧪 Verificar se Está Funcionando

### 1. Health Check
```bash
curl https://sua-url-backend.railway.app/health
```

### 2. Testar API WhatsApp
```bash
curl https://sua-url-backend.railway.app/api/whatsapp/sessions
```

### 3. Verificar Logs no Railway
- Vá no dashboard do Railway
- Clique no serviço
- Veja os logs em tempo real

---

## 🔍 Troubleshooting

### Erro: "Cannot find module 'whatsapp-web.js'"

```bash
cd server
npm install whatsapp-web.js qrcode-terminal fs-extra
```

### Erro: Firebase Authentication

Verifique se:
- ✅ `FIREBASE_PROJECT_ID` está correto
- ✅ `FIREBASE_CLIENT_EMAIL` está correto
- ✅ `FIREBASE_PRIVATE_KEY` tem as quebras de linha (`\n`)
- ✅ A chave privada está entre aspas

### Erro: CORS

Verifique se `CORS_ORIGIN` no backend aponta para o domínio correto do frontend.

### Backend não inicia

Veja os logs:
```bash
cd server
npm run dev
```

---

## ✅ Checklist Rápido

- [ ] Baixei credenciais do Firebase
- [ ] Configurei `server/.env`
- [ ] Testei localmente (`npm start`)
- [ ] Health check funcionou
- [ ] Fiz deploy no Railway
- [ ] Atualizei `VITE_API_URL` no frontend
- [ ] Testei a API em produção

---

## 🆘 Solução Temporária

Se você precisa testar AGORA sem configurar o backend:

1. **Use o backend Python existente:**

```bash
cd backend/whatsapp
python app.py
```

2. **Atualize o frontend para usar o Python:**

Edite `src/services/whatsappService.js`:
```javascript
const API_URL = 'http://localhost:5000';
```

**⚠️ Isso é temporário!** O sistema Node.js é muito melhor e tem todas as funcionalidades.

---

## 📞 Próximos Passos

1. **Agora:** Configure o backend seguindo este guia
2. **Depois:** Teste localmente
3. **Por fim:** Faça deploy no Railway

**Tempo estimado: 10-15 minutos**

---

## 🎯 URL Correta

Depois de configurado, suas URLs devem ser:

- **Frontend:** `https://torq.up.railway.app`
- **Backend:** `https://whatsapp-backend-production.up.railway.app`
- **API:** `https://whatsapp-backend-production.up.railway.app/api/whatsapp/...`

---

**Precisa de ajuda? Verifique os logs e me avise!** 🚀
