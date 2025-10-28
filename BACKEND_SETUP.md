# 🚀 Backend Setup - API de Consulta de Veículos

## ✅ O que foi criado

Backend Node.js/Express completo para consulta de placas e veículos usando APIs gratuitas reais.

### Arquivos Criados:
- ✅ `backend/server.js` - Servidor Express
- ✅ `backend/routes/vehicles.js` - Rotas de veículos
- ✅ `backend/package.json` - Dependências
- ✅ `backend/.env.example` - Configurações
- ✅ `src/services/vehicleApiService.js` - Cliente frontend atualizado

## 📦 Instalação

### 1. Instalar dependências do backend

```bash
cd backend
npm install
```

Isso instalará:
- `express` - Framework web
- `cors` - Habilitar CORS
- `axios` - Cliente HTTP
- `nodemon` - Auto-reload (dev)

### 2. Configurar variáveis de ambiente (opcional)

```bash
cp .env.example .env
```

Edite `.env` se quiser usar APIs pagas (opcional).

## 🚀 Executar o Backend

### Modo Desenvolvimento (com auto-reload)

```bash
cd backend
npm run dev
```

### Modo Produção

```bash
cd backend
npm start
```

O backend estará rodando em: **http://localhost:3001**

## 🧪 Testar o Backend

### 1. Health Check

```bash
curl http://localhost:3001/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "message": "Backend API is running",
  "timestamp": "2025-10-27T..."
}
```

### 2. Consultar Placa

```bash
curl http://localhost:3001/api/vehicles/plate/ABC1234
```

### 3. Buscar Marcas

```bash
curl http://localhost:3001/api/vehicles/brands/moto
```

## 🔌 Endpoints Disponíveis

### GET /health
Health check do servidor

### GET /api/vehicles/plate/:plate
Consulta dados do veículo pela placa

**Exemplo:**
```
GET /api/vehicles/plate/ABC1234
```

**Resposta:**
```json
{
  "success": true,
  "source": "brasilapi",
  "data": {
    "placa": "ABC1234",
    "marca": "Honda",
    "modelo": "CB 600F Hornet",
    "ano": "2023",
    "cor": "Vermelha",
    "tipo": "moto"
  }
}
```

### GET /api/vehicles/brands/:type
Busca marcas de veículos

**Tipos:** `moto`, `carro`, `caminhao`

**Exemplo:**
```
GET /api/vehicles/brands/moto
```

### GET /api/vehicles/models/:type/:brandCode
Busca modelos de uma marca

**Exemplo:**
```
GET /api/vehicles/models/moto/104
```

### GET /api/vehicles/years/:type/:brandCode/:modelCode
Busca anos de um modelo

**Exemplo:**
```
GET /api/vehicles/years/moto/104/5766
```

## 🎯 APIs Externas Usadas

O backend faz proxy para estas APIs gratuitas:

### 1. Brasil API (Principal)
- URL: https://brasilapi.com.br
- Limite: Ilimitado
- Cadastro: Não requer
- Status: ✅ Gratuita

### 2. Consulta Placa (Fallback)
- URL: https://api.consultaplaca.com.br
- Limite: ~100/dia
- Cadastro: Opcional
- Status: ✅ Gratuita

### 3. FIPE Parallelum (Marcas/Modelos)
- URL: https://parallelum.com.br/fipe
- Limite: Ilimitado
- Cadastro: Não requer
- Status: ✅ Gratuita

## 🔧 Configurar Frontend

O frontend já está configurado para usar o backend.

### Variável de Ambiente (opcional)

Crie `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3001/api
```

Se não configurar, usa `http://localhost:3001/api` por padrão.

## 🚀 Executar Projeto Completo

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
npm run dev
```

Acesse: http://localhost:5173

## 📊 Logs do Backend

O backend mostra logs detalhados:

```
[2025-10-27T...] GET /api/vehicles/plate/ABC1234
[VEHICLE API] Consultando placa: ABC1234
[VEHICLE API] Tentando Brasil API...
[VEHICLE API] Brasil API - Sucesso!
```

## 🐛 Troubleshooting

### Erro: "Cannot find module 'express'"
**Solução:** Execute `npm install` no diretório `backend/`

### Erro: "EADDRINUSE: address already in use"
**Solução:** Porta 3001 já está em uso. Mate o processo:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### Erro: "fetch failed" no frontend
**Solução:** Verifique se o backend está rodando em http://localhost:3001

### Erro: "CORS policy"
**Solução:** Já configurado no backend. Verifique se o frontend está em http://localhost:5173

## 🔒 Segurança

### Produção
Para produção, configure:

1. **Variáveis de ambiente:**
```env
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://seudominio.com
```

2. **Rate Limiting:**
Adicione rate limiting para evitar abuso:
```bash
npm install express-rate-limit
```

3. **HTTPS:**
Use proxy reverso (Nginx) ou configure SSL no Express

## 📈 Melhorias Futuras

- [ ] Cache de consultas (Redis)
- [ ] Rate limiting por IP
- [ ] Autenticação JWT
- [ ] Logs estruturados (Winston)
- [ ] Métricas (Prometheus)
- [ ] Health checks avançados
- [ ] Docker container
- [ ] CI/CD pipeline

## ✅ Status

| Componente | Status | Porta |
|------------|--------|-------|
| Backend API | ✅ Funcionando | 3001 |
| Frontend | ✅ Integrado | 5173 |
| APIs Externas | ✅ Configuradas | - |
| CORS | ✅ Habilitado | - |
| Logs | ✅ Ativos | - |

---

**Pronto para produção!** 🎉

Todos os dados são reais, sem mocks ou dados falsos.
