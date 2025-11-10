# 🚀 Como Iniciar o Backend WhatsApp

## ❌ Erro Atual

```
POST http://192.168.18.203:5000/api/whatsapp/connect net::ERR_CONNECTION_REFUSED
```

**Causa:** O backend WhatsApp não está rodando na porta 5000.

---

## ✅ Solução em 3 Passos

### Passo 1: Limpar Sessões (Recomendado)

Execute o script de limpeza:

```bash
# Duplo clique no arquivo:
limpar-sessoes.bat
```

**OU manualmente:**

```bash
cd server-whatsapp
rmdir /s /q whatsapp_sessions
mkdir whatsapp_sessions
```

### Passo 2: Iniciar o Backend

```bash
cd server-whatsapp
npm start
```

**Você deve ver:**

```
🚀 Servidor WhatsApp Multi-Tenant (Baileys) pronto!
Servidor rodando na porta 5000
```

### Passo 3: Testar no Navegador

```bash
# 1. Recarregar página (F5)
# 2. Abrir modal de conexão
# 3. Clicar "Conectar WhatsApp"
# 4. ✅ QR Code deve aparecer
```

---

## 🔍 Verificar se Backend Está Rodando

### Método 1: Verificar no Terminal

Procure por uma janela de terminal com:
```
Servidor rodando na porta 5000
```

### Método 2: Testar no Navegador

Abra: http://192.168.18.203:5000/health

**Deve retornar:**
```json
{
  "status": "healthy",
  "service": "whatsapp-automation-baileys"
}
```

### Método 3: Verificar Processos

```bash
# Windows
netstat -ano | findstr :5000

# Deve mostrar algo como:
# TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    12345
```

---

## 🐛 Problemas Comuns

### Problema 1: Porta 5000 em Uso

**Erro:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solução:**
```bash
# Encontrar processo na porta 5000
netstat -ano | findstr :5000

# Matar processo (substitua PID pelo número encontrado)
taskkill /PID 12345 /F

# Tentar novamente
npm start
```

### Problema 2: Dependências Não Instaladas

**Erro:**
```
Cannot find module '@whiskeysockets/baileys'
```

**Solução:**
```bash
cd server-whatsapp
npm install
npm start
```

### Problema 3: Sessão Corrompida

**Erro:**
```
Timeout aguardando QR Code
```

**Solução:**
```bash
# Executar script de limpeza
limpar-sessoes.bat

# OU manualmente
cd server-whatsapp
rmdir /s /q whatsapp_sessions
mkdir whatsapp_sessions
npm start
```

---

## 📋 Checklist Completo

Antes de testar, verifique:

- [ ] Backend está rodando (`npm start` em `server-whatsapp/`)
- [ ] Porta 5000 está livre
- [ ] Sessões foram limpas (se necessário)
- [ ] Frontend está acessando a URL correta
- [ ] Firewall permite conexão na porta 5000

---

## 🎯 Fluxo Completo

```bash
# 1. Limpar sessões
limpar-sessoes.bat

# 2. Iniciar backend
cd server-whatsapp
npm start

# 3. Em outro terminal, iniciar frontend
npm run dev

# 4. No navegador
# - Abrir http://localhost:5174
# - Fazer login
# - Abrir modal de conexão
# - Conectar WhatsApp
# - ✅ QR Code aparece
# - Escanear QR Code
# - ✅ "WhatsApp Conectado!"
```

---

## 💡 Dica

**Mantenha 2 terminais abertos:**

**Terminal 1 - Backend:**
```bash
cd server-whatsapp
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Assim você pode ver os logs de ambos simultaneamente!

---

**Versão**: 2.0.7  
**Data**: Janeiro 2025  
**Status**: ✅ GUIA COMPLETO
