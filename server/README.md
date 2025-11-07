# 🚀 WhatsApp Multi-Session Backend

Backend Node.js para gerenciamento de múltiplas sessões WhatsApp isoladas por empresa.

## 📦 Instalação

```bash
npm install
```

## ⚙️ Configuração

Crie um arquivo `.env`:

```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@seu-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Server
PORT=3001
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## 🚀 Executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

## 🧪 Testar

```bash
node test-whatsapp.js
```

## 📡 Endpoints

### Iniciar Sessão
```bash
POST /api/whatsapp/:empresaId/start
```

### Verificar Status
```bash
GET /api/whatsapp/:empresaId/status
```

### Enviar Mensagem
```bash
POST /api/whatsapp/:empresaId/send
Content-Type: application/json

{
  "phoneNumber": "5511999999999",
  "message": "Olá!"
}
```

### Desconectar
```bash
POST /api/whatsapp/:empresaId/logout
```

### Listar Sessões
```bash
GET /api/whatsapp/sessions
```

## 📁 Estrutura

```
server/
├── services/
│   └── whatsappMultiSessionService.js  # Gerenciador de sessões
├── routes/
│   └── whatsapp.routes.js              # Rotas da API
├── sessions/                            # Sessões salvas (auto-criado)
│   ├── empresa1/
│   ├── empresa2/
│   └── ...
├── index.js                             # Servidor principal
├── test-whatsapp.js                     # Script de teste
└── package.json
```

## 🔒 Segurança

- Cada empresa tem sessão isolada
- Dados salvos localmente em `sessions/{empresaId}`
- Backup no Firebase Firestore
- CORS configurado
- Rate limiting recomendado para produção

## 📊 Monitoramento

### Logs
O servidor registra todos os eventos:
- Inicialização de sessões
- QR Codes gerados
- Conexões estabelecidas
- Mensagens enviadas
- Erros e desconexões

### Health Check
```bash
curl http://localhost:3001/health
```

## 🐛 Troubleshooting

### Erro: Puppeteer não encontrado
```bash
npm install puppeteer
```

### Limpar sessões
```bash
rm -rf sessions/*
```

### Verificar logs
```bash
npm run dev
# Logs aparecem no console
```

## 📚 Documentação

Veja a documentação completa em: `../WHATSAPP_MULTI_SESSION_GUIDE.md`

## 🎯 Produção

### PM2
```bash
npm install -g pm2
pm2 start index.js --name whatsapp-backend
pm2 save
pm2 startup
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 📞 Suporte

Para problemas, verifique:
1. Logs do servidor
2. Status no Firebase
3. Diretório `sessions/`
4. Documentação do whatsapp-web.js

---

**Desenvolvido para o Torq** 🔧
