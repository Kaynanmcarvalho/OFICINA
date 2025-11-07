#!/bin/bash

echo "🚀 Setup WhatsApp Multi-Sessão"
echo "================================"
echo ""

# Verificar se está na raiz do projeto
if [ ! -d "server" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

# 1. Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd server
npm install
cd ..

# 2. Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
npm install socket.io-client

# 3. Verificar se .env existe
if [ ! -f "server/.env" ]; then
    echo ""
    echo "⚠️  Arquivo server/.env não encontrado!"
    echo ""
    echo "Por favor, crie o arquivo server/.env com:"
    echo ""
    echo "FIREBASE_PROJECT_ID=seu-project-id"
    echo "FIREBASE_CLIENT_EMAIL=seu-email@projeto.iam.gserviceaccount.com"
    echo 'FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"'
    echo "PORT=3001"
    echo "CORS_ORIGIN=http://localhost:5173"
    echo ""
    echo "Veja: CONFIGURACAO_URGENTE.md para mais detalhes"
    echo ""
    exit 1
fi

# 4. Verificar se .env do frontend existe
if [ ! -f ".env" ]; then
    echo "📝 Criando .env do frontend..."
    echo "VITE_API_URL=http://localhost:3001" > .env
fi

echo ""
echo "✅ Setup concluído!"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. Configure as credenciais do Firebase em server/.env"
echo "   Veja: CONFIGURACAO_URGENTE.md"
echo ""
echo "2. Inicie o backend:"
echo "   cd server && npm start"
echo ""
echo "3. Em outro terminal, inicie o frontend:"
echo "   npm run dev"
echo ""
echo "4. Teste a conexão:"
echo "   cd server && node test-whatsapp.js"
echo ""
echo "📚 Documentação completa: README_WHATSAPP_COMPLETO.md"
echo ""
