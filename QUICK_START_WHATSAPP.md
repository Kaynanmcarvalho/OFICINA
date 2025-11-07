# 🚀 Quick Start - WhatsApp Automation

## ⚡ Comandos Rápidos

### Instalação (Uma vez)

```bash
# Windows
cd backend/whatsapp
install.bat

# Linux/Mac
cd backend/whatsapp
chmod +x install.sh
./install.sh
```

### Configuração (Uma vez)

```bash
# 1. Copiar arquivo de configuração
cd backend/whatsapp
copy .env.example .env  # Windows
cp .env.example .env    # Linux/Mac

# 2. Gerar chave de criptografia
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"

# 3. Colar a chave gerada em SESSION_ENCRYPTION_KEY no arquivo .env
```

### Iniciar Backend

```bash
# Windows
cd backend/whatsapp
start.bat

# Linux/Mac
cd backend/whatsapp
source venv/bin/activate
python app.py
```

### Configurar Frontend

```bash
# Criar .env na raiz do projeto
echo "VITE_WHATSAPP_API_URL=http://localhost:5000" > .env
```

### Instalar Dependência Frontend

```bash
npm install socket.io-client --legacy-peer-deps
```

---

## 📋 Checklist de Instalação

- [ ] Python 3.8+ instalado
- [ ] Google Chrome instalado
- [ ] Backend instalado (`install.bat` ou `install.sh`)
- [ ] Arquivo `.env` configurado no backend
- [ ] Chave de criptografia gerada e configurada
- [ ] Dependência `socket.io-client` instalada no frontend
- [ ] Arquivo `.env` criado na raiz do frontend
- [ ] Backend rodando (`start.bat` ou `python app.py`)
- [ ] Frontend rodando (`npm run dev`)

---

## 🎯 Primeiro Uso

1. Acesse http://localhost:5173 (ou sua porta do frontend)
2. Vá para a aba **Orçamentos**
3. Clique em **"Enviar"** em qualquer orçamento
4. **Modal com QR Code aparecerá**
5. Abra WhatsApp no celular
6. Vá em **Mais opções (⋮)** → **Aparelhos conectados** → **Conectar um aparelho**
7. Escaneie o QR Code
8. Aguarde confirmação "Conectado!"
9. **Pronto!** Próximos envios serão automáticos

---

## 🔍 Verificar se está Funcionando

### Backend Rodando?
```bash
# Deve retornar: {"status":"healthy","service":"whatsapp-automation"}
curl http://localhost:5000/health
```

### WhatsApp Conectado?
```bash
# Deve retornar: {"connected":true,...} ou {"connected":false,...}
curl http://localhost:5000/api/whatsapp/status
```

### Frontend Configurado?
- Abra o console do navegador (F12)
- Deve aparecer: "✓ Conectado ao WebSocket WhatsApp"

---

## 🐛 Problemas Comuns

### Backend não inicia
```bash
# Verificar se Python está instalado
python --version

# Reinstalar dependências
cd backend/whatsapp
pip install -r requirements.txt
```

### QR Code não aparece
```bash
# Limpar perfil do Chrome
cd backend/whatsapp
rm -rf whatsapp_profile  # Linux/Mac
rmdir /s whatsapp_profile  # Windows

# Reiniciar backend
```

### Erro de CORS
```bash
# Verificar .env do backend
# CORS_ORIGINS deve incluir a URL do frontend
# Exemplo: CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Mensagem não envia
```bash
# Verificar logs do backend
# Verificar se está conectado:
curl http://localhost:5000/api/whatsapp/status
```

---

## 📁 Estrutura de Arquivos

```
projeto/
├── backend/
│   └── whatsapp/
│       ├── app.py                    # API Flask
│       ├── whatsapp_service.py       # Automação Selenium
│       ├── requirements.txt          # Dependências
│       ├── .env                      # Configurações (criar)
│       ├── install.bat/sh            # Instalação
│       ├── start.bat                 # Iniciar
│       └── whatsapp_profile/         # Perfil Chrome (auto)
│
├── src/
│   ├── components/
│   │   └── whatsapp/
│   │       └── WhatsAppConnectionModal.jsx
│   ├── services/
│   │   └── whatsappService.js
│   └── pages/
│       └── budgets/
│           └── components/
│               └── SendBudgetModal.jsx
│
├── .env                              # Config frontend (criar)
├── WHATSAPP_AUTOMATION_GUIDE.md      # Guia completo
└── WHATSAPP_IMPLEMENTATION_SUMMARY.md # Resumo
```

---

## 🎬 Vídeo Tutorial (Conceitual)

1. **[00:00]** Instalar backend
2. **[01:00]** Configurar .env
3. **[02:00]** Iniciar backend
4. **[03:00]** Configurar frontend
5. **[04:00]** Primeira autenticação (QR Code)
6. **[05:00]** Enviar primeiro orçamento
7. **[06:00]** Verificar recebimento no WhatsApp

---

## 💡 Dicas

- Mantenha o backend sempre rodando em segundo plano
- Não feche o Chrome manualmente
- Respeite o limite de 10 mensagens por minuto
- Verifique os logs se algo der errado
- Limpe o perfil do Chrome se tiver problemas persistentes

---

## 📞 Comandos Úteis

```bash
# Ver logs do backend em tempo real
cd backend/whatsapp
python app.py

# Testar conexão
curl http://localhost:5000/health

# Ver status WhatsApp
curl http://localhost:5000/api/whatsapp/status

# Desconectar WhatsApp
curl -X POST http://localhost:5000/api/whatsapp/disconnect

# Reinstalar backend
cd backend/whatsapp
rm -rf venv  # Linux/Mac
rmdir /s venv  # Windows
install.bat  # ou ./install.sh
```

---

## ✅ Tudo Pronto!

Agora você pode enviar orçamentos automaticamente via WhatsApp! 🎉

**Lembre-se:**
- Backend deve estar rodando
- Primeira vez precisa escanear QR Code
- Próximas vezes são automáticas

**Aproveite!** 🚀
