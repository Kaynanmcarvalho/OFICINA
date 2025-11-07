# 📱 Guia de Uso - Envio Automático de Orçamentos via WhatsApp

## 🎯 O que foi implementado?

Sistema completo de automação para envio de orçamentos via WhatsApp, eliminando a necessidade de abrir o WhatsApp Web manualmente. O sistema usa Selenium para controlar o navegador e enviar mensagens automaticamente.

## 🚀 Como usar?

### 1️⃣ Primeira Configuração (Uma vez apenas)

#### Passo 1: Instalar o Backend

**Windows:**
```bash
cd backend/whatsapp
install.bat
```

**Linux/Mac:**
```bash
cd backend/whatsapp
chmod +x install.sh
./install.sh
```

#### Passo 2: Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env` no diretório `backend/whatsapp`
2. Gere uma chave de criptografia:
   ```python
   python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
   ```
3. Cole a chave gerada em `SESSION_ENCRYPTION_KEY` no arquivo `.env`

#### Passo 3: Iniciar o Backend

**Windows:**
```bash
cd backend/whatsapp
start.bat
```

**Linux/Mac:**
```bash
cd backend/whatsapp
source venv/bin/activate
python app.py
```

Você verá uma mensagem indicando que o servidor está rodando em `http://localhost:5000`

#### Passo 4: Configurar o Frontend

1. Crie um arquivo `.env` na raiz do projeto frontend (se não existir)
2. Adicione:
   ```
   VITE_WHATSAPP_API_URL=http://localhost:5000
   ```
3. Reinicie o servidor de desenvolvimento do frontend

### 2️⃣ Primeira Autenticação

1. Acesse a aba **Orçamentos** no sistema
2. Clique em **"Enviar"** em qualquer orçamento
3. Um modal aparecerá com um **QR Code**
4. Abra o WhatsApp no seu celular
5. Vá em **Mais opções** (⋮) → **Aparelhos conectados** → **Conectar um aparelho**
6. Escaneie o QR Code exibido no sistema
7. Aguarde a confirmação de conexão (aparecerá "Conectado!")

**✅ Pronto!** Sua conta do WhatsApp está conectada e você não precisará fazer isso novamente.

### 3️⃣ Enviando Orçamentos

Após a primeira autenticação, o processo é simples:

1. Acesse a aba **Orçamentos**
2. Clique em **"Enviar"** no card do orçamento desejado
3. Confirme o número de telefone do cliente
4. Clique em **"Enviar"**
5. **Pronto!** A mensagem será enviada automaticamente pelo backend

O cliente receberá:
- Detalhes do orçamento
- Valor total
- Link para aprovação online
- Informação sobre validade (48 horas)

## 🔄 Fluxo Completo

```
┌─────────────────────────────────────────────────────────────┐
│  1. Usuário clica em "Enviar" no orçamento                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Sistema verifica se WhatsApp está conectado             │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
    ❌ NÃO                    ✅ SIM
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────────────────────────┐
│ Exibe QR Code   │    │ Envia mensagem automaticamente      │
│ para autenticar │    │ via backend (Selenium)              │
└────────┬────────┘    └─────────────────────────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────────────────────────┐
│ Usuário escaneia│    │ Cliente recebe orçamento no WhatsApp│
│ com celular     │    │ com link de aprovação               │
└────────┬────────┘    └─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ Conectado! Próximos envios serão automáticos                │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 Interface do Usuário

### Modal de Conexão WhatsApp

Quando não há sessão ativa, o modal exibe:

- **QR Code grande e claro** para escanear
- **Instruções passo a passo** de como conectar
- **Countdown de 60 segundos** para expiração do QR
- **Botão para gerar novo QR** se expirar
- **Feedback visual** durante autenticação
- **Confirmação de sucesso** quando conectado

### Modal de Envio

- Seleção de método (WhatsApp ou E-mail)
- Campo para número de telefone
- Prévia da mensagem que será enviada
- Aviso sobre validade de 48 horas
- Indicador de progresso durante envio

## 🔧 Funcionalidades Técnicas

### Backend (Python + Selenium)

- ✅ Automação completa do WhatsApp Web
- ✅ Persistência de sessão (não precisa autenticar sempre)
- ✅ Criptografia de dados sensíveis
- ✅ WebSocket para comunicação em tempo real
- ✅ API REST para operações principais
- ✅ Tratamento robusto de erros
- ✅ Retry automático em caso de falha

### Frontend (React)

- ✅ Modal de conexão com QR Code
- ✅ Integração com WebSocket para tempo real
- ✅ Verificação automática de status
- ✅ Feedback visual em todas as etapas
- ✅ Tratamento de erros amigável
- ✅ Animações suaves com Framer Motion

## 🛡️ Segurança

- 🔒 Sessões criptografadas com Fernet (AES)
- 🔒 Perfil do Chrome isolado e protegido
- 🔒 Cookies e localStorage criptografados
- 🔒 CORS configurado para origens permitidas
- 🔒 Sem armazenamento de senhas ou dados sensíveis

## ⚠️ Limitações e Cuidados

1. **Limite de Envios**: Respeite os limites do WhatsApp (recomendado: máximo 10 mensagens por minuto)
2. **Bloqueios**: Envios em massa podem resultar em bloqueio temporário da conta
3. **Conexão**: Mantenha o backend rodando enquanto usar o sistema
4. **Navegador**: Não feche o Chrome manualmente durante o uso
5. **Sessão**: Se desconectar no celular, precisará autenticar novamente

## 🐛 Solução de Problemas

### QR Code não aparece

1. Verifique se o backend está rodando
2. Verifique se o Chrome está instalado
3. Tente limpar o diretório `backend/whatsapp/whatsapp_profile`
4. Reinicie o backend

### Mensagem não é enviada

1. Verifique se está conectado (veja console do backend)
2. Verifique o número de telefone (deve ter DDD)
3. Tente desconectar e reconectar
4. Verifique os logs do backend para erros

### Sessão expira constantemente

1. Certifique-se de que o perfil do Chrome está sendo salvo
2. Não feche o navegador manualmente
3. Verifique se `WHATSAPP_PROFILE_DIR` está configurado corretamente

### Erro de CORS

1. Verifique se `CORS_ORIGINS` no `.env` do backend inclui a URL do frontend
2. Reinicie o backend após alterar configurações

## 📊 Monitoramento

### Logs do Backend

O backend exibe logs detalhados:
- ✓ Operações bem-sucedidas
- ✗ Erros e falhas
- ℹ️ Informações gerais

### Console do Navegador

O frontend registra:
- Conexões WebSocket
- Chamadas de API
- Erros de comunicação

## 🔄 Manutenção

### Atualizar Dependências

```bash
cd backend/whatsapp
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate.bat  # Windows
pip install --upgrade -r requirements.txt
```

### Limpar Sessão

Se precisar resetar completamente:

```bash
# Parar o backend
# Deletar o diretório
rm -rf backend/whatsapp/whatsapp_profile  # Linux/Mac
rmdir /s backend\whatsapp\whatsapp_profile  # Windows
# Reiniciar o backend
```

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do backend
2. Verifique o console do navegador
3. Consulte a seção de troubleshooting
4. Verifique se todas as dependências estão instaladas

## 🎉 Pronto para Usar!

Agora você pode enviar orçamentos automaticamente via WhatsApp sem precisar abrir o WhatsApp Web manualmente. O sistema cuida de tudo para você!

**Dica:** Mantenha o backend sempre rodando em segundo plano para melhor experiência.
