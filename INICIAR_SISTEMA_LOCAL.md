# 🚀 Iniciar Sistema WhatsApp - Local

## ✅ Status Atual

**Backend Python:** ✅ Rodando em http://localhost:5000

---

## 🎯 Como Usar

### 1. Backend já está rodando! ✅

O backend Python já foi iniciado automaticamente e está funcionando em:
```
http://localhost:5000
```

### 2. Iniciar Frontend

Abra um novo terminal e execute:

```bash
npm run dev
```

O frontend vai abrir em:
```
http://localhost:5173
```

### 3. Testar WhatsApp

1. Acesse: http://localhost:5173
2. Faça login
3. Vá para **Orçamentos**
4. Clique em **"Conectar WhatsApp"**
5. Escaneie o QR Code com seu celular
6. ✅ Pronto! WhatsApp conectado

---

## 🔍 Verificar Status

### Backend está rodando?

```bash
curl http://localhost:5000/health
```

Deve retornar:
```json
{
  "status": "healthy",
  "service": "whatsapp-automation"
}
```

### Status do WhatsApp

```bash
curl http://localhost:5000/api/whatsapp/status
```

---

## 🛑 Parar Servidores

### Parar Backend Python

No terminal onde o backend está rodando, pressione:
```
Ctrl + C
```

### Parar Frontend

No terminal onde o frontend está rodando, pressione:
```
Ctrl + C
```

---

## 🔄 Reiniciar Backend

Se precisar reiniciar o backend:

```bash
cd backend/whatsapp
python app.py
```

---

## 📊 Logs

### Ver logs do backend

Os logs aparecem no terminal onde o backend está rodando.

### Ver logs do frontend

Os logs aparecem no console do navegador (F12).

---

## 🐛 Problemas Comuns

### Erro: "Port 5000 already in use"

Outro processo está usando a porta 5000. Mate o processo:

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -ti:5000 | xargs kill -9
```

### Erro: "Module not found"

Instale as dependências Python:

```bash
cd backend/whatsapp
pip install -r requirements.txt
```

### Erro: "Cannot connect to backend"

1. Verifique se o backend está rodando
2. Verifique a URL no `.env`:
   ```env
   VITE_WHATSAPP_API_URL=http://localhost:5000
   ```
3. Recarregue o frontend (Ctrl+F5)

---

## ✅ Checklist

- [x] Backend Python rodando em http://localhost:5000
- [ ] Frontend rodando em http://localhost:5173
- [ ] WhatsApp conectado
- [ ] Mensagem de teste enviada

---

## 🎉 Tudo Pronto!

Agora você pode:

1. ✅ Conectar WhatsApp via QR Code
2. ✅ Enviar orçamentos via WhatsApp
3. ✅ Testar localmente
4. ✅ Desenvolver novas funcionalidades

---

## 📚 Documentação

- **Guia Completo:** `README_WHATSAPP_COMPLETO.md`
- **Correções Aplicadas:** `CORRECOES_APLICADAS.md`
- **API Backend:** `backend/whatsapp/README.md`

---

**Sistema rodando localmente! 🚀**
