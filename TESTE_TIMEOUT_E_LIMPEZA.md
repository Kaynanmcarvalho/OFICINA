# 🧪 Teste - Timeout e Limpeza de Sessão

## 🎯 O Que Foi Corrigido

1. ✅ Propagação correta do erro TIMEOUT
2. ✅ Detecção do código de erro no frontend
3. ✅ Mensagem específica para timeout
4. ✅ Botão "Limpar Sessão Corrompida" aparece automaticamente

---

## 🧪 Como Testar Agora

### Cenário 1: Timeout com Sessão Corrompida

```bash
# 1. Reiniciar o backend
cd server-whatsapp
# Ctrl+C para parar
npm start

# 2. No navegador (F5 para recarregar)
# - Abrir modal de conexão
# - Clicar "Conectar WhatsApp"

# 3. Se der timeout (408):
# ✅ Mensagem aparece: "Timeout ao conectar. A sessão pode estar corrompida..."
# ✅ Botão "Limpar Sessão Corrompida" aparece
# ✅ Clicar no botão
# ✅ Sistema limpa e tenta reconectar
# ✅ QR Code deve aparecer
```

### Cenário 2: Limpar Sessão Manualmente

Se o botão automático não resolver:

```bash
# 1. Parar o backend (Ctrl+C)

# 2. Limpar sessões manualmente
cd server-whatsapp
rm -rf whatsapp_sessions/*

# Ou no Windows:
# rmdir /s /q whatsapp_sessions

# 3. Reiniciar backend
npm start

# 4. Tentar conectar novamente
# ✅ QR Code deve aparecer em ~2 segundos
```

---

## 📊 Logs Esperados

### Console do Backend (Timeout)

```
🔌 POST /api/whatsapp/connect - empresaId: super-admin-admin
🔄 Inicializando nova sessão para: super-admin-admin
📂 Sessão salva encontrada, tentando restaurar...
⏳ Aguardando QR Code... (5s)
⏳ Aguardando QR Code... (10s)
⏳ Aguardando QR Code... (15s)
⏰ Timeout aguardando QR Code para empresaId: super-admin-admin
💡 Dica: Sessão pode estar corrompida. Tente limpar a pasta whatsapp_sessions/empresa-super-admin-admin
```

### Console do Frontend (Timeout)

```javascript
[WhatsApp Modal] Iniciando conexão...
📡 Fazendo requisição para: http://192.168.18.203:5000/api/whatsapp/connect
📥 Response status: 408
📥 Response ok: false
[WhatsApp Modal] ❌ Erro ao conectar: Error: TIMEOUT
// Mensagem: "Timeout ao conectar. A sessão pode estar corrompida..."
// Botão "Limpar Sessão Corrompida" aparece
```

### Console do Frontend (Após Limpar)

```javascript
[WhatsApp Modal] Limpando sessão...
[WhatsApp Modal] Iniciando conexão...
📥 Response status: 200
📥 Response ok: true
[WhatsApp Modal] ✅ QR Code recebido
```

---

## ✅ Checklist de Verificação

Após recarregar a página (F5):

- ✅ Erro 408 é capturado corretamente
- ✅ Mensagem específica aparece
- ✅ Botão "Limpar Sessão Corrompida" aparece
- ✅ Clicar no botão limpa a sessão
- ✅ Sistema tenta reconectar automaticamente
- ✅ QR Code aparece após limpeza

---

## 🔧 Se Ainda Não Funcionar

### Opção 1: Limpar Cache do Navegador

```
1. Pressionar Ctrl+Shift+Delete
2. Selecionar "Cache" e "Cookies"
3. Limpar
4. Recarregar página (F5)
```

### Opção 2: Limpar Sessões Manualmente

```bash
# Parar backend
Ctrl+C

# Limpar todas as sessões
cd server-whatsapp
rm -rf whatsapp_sessions/*

# Reiniciar
npm start
```

### Opção 3: Verificar Logs do Backend

```bash
# No terminal do backend, verificar:
# - Se está recebendo a requisição
# - Se está tentando restaurar sessão
# - Se está dando timeout
# - Se está limpando o estado
```

---

## 💡 Dica Importante

**Se o timeout persistir mesmo após limpar:**

Pode ser que o Baileys esteja travado tentando conectar. Nesse caso:

1. **Parar o backend completamente** (Ctrl+C)
2. **Aguardar 5 segundos**
3. **Limpar sessões**: `rm -rf whatsapp_sessions/*`
4. **Reiniciar backend**: `npm start`
5. **Recarregar frontend**: F5
6. **Tentar conectar novamente**

---

## 📞 Próximos Passos

Se tudo funcionar:

1. ✅ Escanear QR Code
2. ✅ Aguardar "WhatsApp Conectado!"
3. ✅ Fechar modal
4. ✅ Tentar enviar orçamento
5. ✅ Deve funcionar normalmente

Se ainda houver problemas:

1. Verificar logs do backend
2. Verificar console do navegador (F12)
3. Reportar o erro com os logs

---

**Versão**: 2.0.4  
**Data**: Janeiro 2025  
**Status**: ✅ PRONTO PARA TESTAR
