# 🚀 Deploy em Produção - WhatsApp Multi-Sessão

## 📋 Checklist Pré-Deploy

### Backend
- [ ] Dependências instaladas
- [ ] Variáveis de ambiente configuradas
- [ ] Firebase Admin configurado
- [ ] Testes executados com sucesso
- [ ] Logs funcionando
- [ ] CORS configurado para domínio de produção

### Frontend
- [ ] Variáveis de ambiente de produção
- [ ] Build testado localmente
- [ ] Socket.IO apontando para produção
- [ ] Componentes testados

### Infraestrutura
- [ ] Servidor com Node.js 18+
- [ ] Certificado SSL configurado
- [ ] Firewall configurado
- [ ] Backup automático configurado
- [ ] Monitoramento configurado

---

## 🔧 Configuração do Servidor

### 1. Requisitos do Sistema

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y nodejs npm nginx certbot python3-certbot-nginx

# Verificar versões
node --version  # v18+
npm --version   # v9+
```

### 2. Instalar PM2 (Process Manager)

```bash
npm install -g pm2
```

### 3. Clonar Repositório

```bash
cd /var/www
git clone https://github.com/seu-usuario/torq.git
cd torq
```

### 4. Configurar Backend

```bash
cd server
npm install --production

# Criar .env de produção
nano .env
```

**Conteúdo do `.env`:**
```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@seu-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Server
PORT=3001
CORS_ORIGIN=https://app.seudominio.com
NODE_ENV=production

# Logs
LOG_LEVEL=info
```

### 5. Iniciar com PM2

```bash
# Iniciar servidor
pm2 start index.js --name whatsapp-backend

# Salvar configuração
pm2 save

# Configurar inicialização automática
pm2 startup
# Copie e execute o comando que aparecer

# Ver logs
pm2 logs whatsapp-backend

# Monitorar
pm2 monit
```

---

## 🌐 Configurar Nginx

### 1. Criar Configuração

```bash
sudo nano /etc/nginx/sites-available/whatsapp-api
```

**Conteúdo:**
```nginx
# API Backend
server {
    listen 80;
    server_name api.seudominio.com;

    # Redirecionar para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.seudominio.com;

    # SSL
    ssl_certificate /etc/letsencrypt/live/api.seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.seudominio.com/privkey.pem;

    # Proxy para Node.js
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Socket.IO
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Timeouts para WhatsApp
    proxy_connect_timeout 600s;
    proxy_send_timeout 600s;
    proxy_read_timeout 600s;
}
```

### 2. Ativar Configuração

```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/whatsapp-api /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### 3. Configurar SSL

```bash
# Obter certificado Let's Encrypt
sudo certbot --nginx -d api.seudominio.com

# Renovação automática (já configurado pelo certbot)
sudo certbot renew --dry-run
```

---

## 🔒 Segurança

### 1. Rate Limiting

```bash
cd server
npm install express-rate-limit
```

**Adicionar em `server/index.js`:**
```javascript
const rateLimit = require('express-rate-limit');

// Rate limiter geral
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições
  message: 'Muitas requisições, tente novamente mais tarde'
});

// Rate limiter para envio de mensagens
const messageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // 10 mensagens
  message: 'Limite de mensagens excedido'
});

app.use('/api/', generalLimiter);
app.use('/api/whatsapp/:empresaId/send', messageLimiter);
```

### 2. Helmet (Segurança HTTP)

```bash
npm install helmet
```

**Adicionar em `server/index.js`:**
```javascript
const helmet = require('helmet');

app.use(helmet());
```

### 3. Validação de Entrada

```bash
npm install express-validator
```

**Exemplo em rotas:**
```javascript
const { body, validationResult } = require('express-validator');

router.post('/:empresaId/send',
  body('phoneNumber').isMobilePhone(),
  body('message').isLength({ min: 1, max: 4096 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ... resto do código
  }
);
```

---

## 📊 Monitoramento

### 1. PM2 Monitoring

```bash
# Instalar PM2 Plus (opcional)
pm2 link <secret_key> <public_key>

# Ver métricas
pm2 monit

# Ver logs em tempo real
pm2 logs whatsapp-backend --lines 100
```

### 2. Logs Estruturados

**Instalar Winston:**
```bash
npm install winston
```

**Criar `server/logger.js`:**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

module.exports = logger;
```

### 3. Alertas

**Configurar alertas no PM2:**
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## 💾 Backup

### 1. Backup de Sessões

**Criar script `backup-sessions.sh`:**
```bash
#!/bin/bash

BACKUP_DIR="/var/backups/whatsapp-sessions"
SOURCE_DIR="/var/www/torq/server/sessions"
DATE=$(date +%Y%m%d_%H%M%S)

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Fazer backup
tar -czf $BACKUP_DIR/sessions_$DATE.tar.gz -C $SOURCE_DIR .

# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "sessions_*.tar.gz" -mtime +7 -delete

echo "Backup concluído: sessions_$DATE.tar.gz"
```

**Tornar executável:**
```bash
chmod +x backup-sessions.sh
```

**Agendar no cron:**
```bash
crontab -e

# Adicionar linha (backup diário às 3h)
0 3 * * * /var/www/torq/server/backup-sessions.sh
```

### 2. Backup Firebase

O Firebase já faz backup automático, mas você pode exportar:

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Exportar Firestore
firebase firestore:export gs://seu-bucket/backups/$(date +%Y%m%d)
```

---

## 🔄 Atualizações

### 1. Deploy de Novas Versões

**Criar script `deploy.sh`:**
```bash
#!/bin/bash

echo "🚀 Iniciando deploy..."

# Ir para diretório
cd /var/www/torq

# Fazer backup
./server/backup-sessions.sh

# Atualizar código
git pull origin main

# Instalar dependências
cd server
npm install --production

# Reiniciar PM2
pm2 restart whatsapp-backend

# Verificar status
pm2 status

echo "✅ Deploy concluído!"
```

### 2. Rollback

```bash
# Ver commits
git log --oneline

# Voltar para versão anterior
git checkout <commit-hash>

# Reinstalar dependências
cd server
npm install --production

# Reiniciar
pm2 restart whatsapp-backend
```

---

## 📈 Escalabilidade

### 1. Múltiplas Instâncias

```bash
# Iniciar 4 instâncias
pm2 start index.js -i 4 --name whatsapp-backend

# Modo cluster automático
pm2 start index.js -i max --name whatsapp-backend
```

### 2. Load Balancer (Nginx)

```nginx
upstream whatsapp_backend {
    least_conn;
    server localhost:3001;
    server localhost:3002;
    server localhost:3003;
    server localhost:3004;
}

server {
    location / {
        proxy_pass http://whatsapp_backend;
    }
}
```

### 3. Redis para Sessões Compartilhadas

```bash
npm install redis ioredis
```

**Configurar Redis:**
```javascript
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

// Usar Redis para compartilhar estado entre instâncias
```

---

## 🧪 Testes em Produção

### 1. Health Check

```bash
# Verificar API
curl https://api.seudominio.com/health

# Verificar Socket.IO
curl https://api.seudominio.com/socket.io/
```

### 2. Teste de Conexão

```bash
# Iniciar sessão de teste
curl -X POST https://api.seudominio.com/api/whatsapp/test-empresa/start

# Verificar status
curl https://api.seudominio.com/api/whatsapp/test-empresa/status
```

### 3. Monitorar Logs

```bash
# Logs em tempo real
pm2 logs whatsapp-backend --lines 50

# Filtrar erros
pm2 logs whatsapp-backend --err
```

---

## 🚨 Troubleshooting em Produção

### Problema: Sessões não persistem

**Solução:**
```bash
# Verificar permissões
ls -la /var/www/torq/server/sessions

# Corrigir permissões
sudo chown -R $USER:$USER /var/www/torq/server/sessions
chmod -R 755 /var/www/torq/server/sessions
```

### Problema: Memória alta

**Solução:**
```bash
# Ver uso de memória
pm2 monit

# Limitar memória
pm2 start index.js --max-memory-restart 500M

# Reiniciar se necessário
pm2 restart whatsapp-backend
```

### Problema: Socket.IO não conecta

**Solução:**
1. Verificar CORS no backend
2. Verificar configuração Nginx
3. Verificar certificado SSL
4. Testar com `wscat`:

```bash
npm install -g wscat
wscat -c wss://api.seudominio.com/socket.io/?transport=websocket
```

---

## 📊 Métricas Importantes

### Monitorar:
- ✅ Número de sessões ativas
- ✅ Taxa de sucesso de envio
- ✅ Tempo de resposta da API
- ✅ Uso de CPU e memória
- ✅ Erros e exceções
- ✅ Uptime do servidor

### Dashboard Sugerido:
- Grafana + Prometheus
- PM2 Plus
- New Relic
- Datadog

---

## ✅ Checklist Final de Deploy

### Pré-Deploy
- [ ] Código testado localmente
- [ ] Variáveis de ambiente configuradas
- [ ] Backup realizado
- [ ] Documentação atualizada

### Deploy
- [ ] Código enviado para servidor
- [ ] Dependências instaladas
- [ ] PM2 configurado
- [ ] Nginx configurado
- [ ] SSL configurado
- [ ] Firewall configurado

### Pós-Deploy
- [ ] Health check passou
- [ ] Logs sem erros
- [ ] Teste de conexão WhatsApp
- [ ] Teste de envio de mensagem
- [ ] Monitoramento ativo
- [ ] Backup automático configurado

### Segurança
- [ ] Rate limiting ativo
- [ ] Helmet configurado
- [ ] CORS restrito
- [ ] Validação de entrada
- [ ] Logs de auditoria

---

## 🎉 Deploy Concluído!

Seu sistema WhatsApp Multi-Sessão está em produção!

### Próximos Passos:
1. Monitorar logs nas primeiras 24h
2. Testar com usuários reais
3. Ajustar rate limits conforme necessário
4. Configurar alertas
5. Documentar procedimentos para equipe

---

**Sistema em Produção! 🚀**
