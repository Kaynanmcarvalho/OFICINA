# 🔥 Liberar Firewall do Windows

## 🎯 Problema

O backend WhatsApp está rodando em `http://192.168.18.203:5000`, mas outros computadores na rede não conseguem acessar porque o **Firewall do Windows** está bloqueando a porta 5000.

---

## ✅ Solução Rápida (Recomendada)

### Opção 1: Comando PowerShell (Como Administrador)

1. **Abra PowerShell como Administrador:**
   - Pressione `Win + X`
   - Clique em "Windows PowerShell (Admin)" ou "Terminal (Admin)"

2. **Execute o comando:**
   ```powershell
   netsh advfirewall firewall add rule name="WhatsApp Backend" dir=in action=allow protocol=TCP localport=5000
   ```

3. **Pronto!** A porta 5000 está liberada.

---

### Opção 2: Interface Gráfica

1. **Abra o Firewall do Windows:**
   - Pressione `Win + R`
   - Digite: `wf.msc`
   - Pressione Enter

2. **Criar Nova Regra:**
   - Clique em "Regras de Entrada" (lado esquerdo)
   - Clique em "Nova Regra..." (lado direito)

3. **Configurar Regra:**
   - Tipo de Regra: **Porta**
   - Protocolo: **TCP**
   - Porta Local Específica: **5000**
   - Ação: **Permitir a conexão**
   - Perfil: Marque todos (Domínio, Privado, Público)
   - Nome: **WhatsApp Backend**

4. **Finalizar**

---

## 🧪 Testar

### No computador principal (192.168.18.203):
```bash
curl http://192.168.18.203:5000/health
```

### Em outro computador na rede:
```bash
curl http://192.168.18.203:5000/health
```

Deve retornar:
```json
{"status":"healthy","service":"whatsapp-automation"}
```

---

## 🌐 Acessar de Outro Computador

### 1. No navegador do outro computador:
```
http://192.168.18.203:5173
```

### 2. O frontend vai conectar automaticamente ao backend:
```
http://192.168.18.203:5000
```

---

## 🔍 Verificar se a Porta Está Aberta

### No computador principal:
```powershell
netstat -an | findstr :5000
```

Deve mostrar:
```
TCP    0.0.0.0:5000           0.0.0.0:0              LISTENING
```

---

## 🛑 Remover Regra (Se Necessário)

```powershell
netsh advfirewall firewall delete rule name="WhatsApp Backend"
```

---

## ⚠️ Importante

- ✅ O backend já está configurado para aceitar conexões de qualquer IP na rede local
- ✅ O CORS já está liberado para `http://192.168.18.203:5173`
- ✅ O servidor está escutando em `0.0.0.0:5000` (todas as interfaces)
- ❌ Apenas o **Firewall do Windows** está bloqueando

---

## 📊 Status Atual

| Item | Status |
|------|--------|
| Backend rodando | ✅ |
| Escutando em 0.0.0.0 | ✅ |
| CORS configurado | ✅ |
| Firewall liberado | ⏳ **Aguardando você liberar** |

---

**Libere o firewall e teste! 🚀**
