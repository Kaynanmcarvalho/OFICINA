# Debug: Erro na Conexão WhatsApp

## Status Atual
- ✅ Servidor backend rodando (porta 5000)
- ✅ QR Code sendo gerado corretamente (testado via script)
- ❌ Frontend mostrando "Erro na Conexão"
- ❌ Sem erros no console do servidor

## Possíveis Causas

### 1. CORS
O navegador pode estar bloqueando a requisição por CORS.

**Verificar:**
- Abrir DevTools (F12)
- Ir na aba Console
- Procurar por erros de CORS (vermelho)

### 2. URL Incorreta
O frontend pode estar tentando conectar na URL errada.

**Verificar:**
- No console do navegador, procurar por logs:
  - `🔌 Conectando WhatsApp para empresaId:`
  - `🌐 API_URL:`
  - `📡 Fazendo requisição para:`

### 3. Timeout
A requisição pode estar demorando mais de 30 segundos.

**Verificar:**
- No console do navegador, ver se aparece erro de timeout
- No servidor, ver se aparece log de timeout

### 4. Erro no getEmpresaId()
O empresaId pode não estar sendo obtido corretamente.

**Verificar:**
- No console do navegador, procurar por:
  - `🔍 DEBUG getEmpresaId`
  - Ver se o empresaId está correto

## Como Debugar

### Passo 1: Abrir Console do Navegador
1. Pressione F12
2. Vá na aba "Console"
3. Limpe o console (ícone 🚫)

### Passo 2: Tentar Conectar
1. Clique em "Conectar WhatsApp"
2. Observe os logs no console

### Passo 3: Verificar Servidor
1. Veja se aparece log no terminal do servidor:
   - `🔌 POST /api/whatsapp/connect`
   - `📦 Body completo:`

### Passo 4: Teste Direto
1. Abra o arquivo: `server-whatsapp/test-api-direct.html`
2. Clique em "2. Conectar"
3. Veja se o QR Code aparece

## Logs Esperados

### Frontend (Console do Navegador)
```
🔍 DEBUG getEmpresaId - user: {...}
🔌 Conectando WhatsApp para empresaId: super-admin-renier
🌐 API_URL: http://localhost:5000
📡 Fazendo requisição para: http://localhost:5000/api/whatsapp/connect
📥 Response status: 200
📥 Response ok: true
```

### Backend (Terminal)
```
🔌 POST /api/whatsapp/connect - empresaId: super-admin-renier
📦 Body completo: {"empresaId":"super-admin-renier"}
📱 Inicializando WhatsApp para empresa super-admin-renier...
📱 QR Code gerado para empresa super-admin-renier!
✅ Retornando QR Code para empresaId: super-admin-renier
```

## Solução Rápida

Se nada funcionar, tente:

1. **Reiniciar tudo:**
   ```bash
   # Parar servidor backend
   Ctrl+C no terminal do servidor
   
   # Parar frontend
   Ctrl+C no terminal do frontend
   
   # Iniciar backend
   cd server-whatsapp
   npm start
   
   # Iniciar frontend (em outro terminal)
   npm run dev
   ```

2. **Limpar cache do navegador:**
   - Ctrl+Shift+Delete
   - Limpar cache e cookies
   - Recarregar página (Ctrl+F5)

3. **Testar com arquivo HTML direto:**
   - Abrir `server-whatsapp/test-api-direct.html` no navegador
   - Se funcionar, o problema é no frontend
   - Se não funcionar, o problema é no backend
