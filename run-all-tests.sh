#!/bin/bash

# Script para executar todos os testes
# Uso: ./run-all-tests.sh

set -e

echo "🚀 Iniciando suite completa de testes..."
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar dependências
echo "📦 Verificando dependências..."
if ! command_exists npm; then
    echo -e "${RED}❌ npm não encontrado. Instale Node.js primeiro.${NC}"
    exit 1
fi

if ! command_exists firebase; then
    echo -e "${YELLOW}⚠️  Firebase CLI não encontrado. Instalando...${NC}"
    npm install -g firebase-tools
fi

# Instalar dependências do projeto
echo ""
echo "📥 Instalando dependências do projeto..."
npm install

# 1. Testes Unitários
echo ""
echo "🧪 Executando testes unitários..."
npm run test:unit
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Testes unitários passaram!${NC}"
else
    echo -e "${RED}❌ Testes unitários falharam!${NC}"
    exit 1
fi

# 2. Coverage
echo ""
echo "📊 Gerando relatório de cobertura..."
npm run test:coverage
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Coverage gerado!${NC}"
    echo "📄 Relatório disponível em: coverage/index.html"
else
    echo -e "${RED}❌ Falha ao gerar coverage!${NC}"
fi

# 3. Testes de Integração (com Firebase Emulator)
echo ""
echo "🔗 Executando testes de integração..."
echo "   Iniciando Firebase Emulator..."

# Iniciar emulator em background
firebase emulators:start --only firestore,storage > /dev/null 2>&1 &
EMULATOR_PID=$!

# Aguardar emulator iniciar
sleep 10

# Executar testes de integração
npm run test:integration
INTEGRATION_RESULT=$?

# Parar emulator
kill $EMULATOR_PID

if [ $INTEGRATION_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ Testes de integração passaram!${NC}"
else
    echo -e "${RED}❌ Testes de integração falharam!${NC}"
    exit 1
fi

# 4. Build
echo ""
echo "🏗️  Testando build..."
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build bem-sucedido!${NC}"
else
    echo -e "${RED}❌ Build falhou!${NC}"
    exit 1
fi

# 5. Lint
echo ""
echo "🔍 Executando lint..."
npm run lint
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Lint passou!${NC}"
else
    echo -e "${YELLOW}⚠️  Lint encontrou problemas (não crítico)${NC}"
fi

# Resumo
echo ""
echo "═══════════════════════════════════════════"
echo "📊 RESUMO DOS TESTES"
echo "═══════════════════════════════════════════"
echo -e "${GREEN}✅ Testes unitários: PASSOU${NC}"
echo -e "${GREEN}✅ Testes de integração: PASSOU${NC}"
echo -e "${GREEN}✅ Build: PASSOU${NC}"
echo "═══════════════════════════════════════════"
echo ""
echo "🎉 Todos os testes passaram com sucesso!"
echo ""
echo "📝 Próximos passos:"
echo "   1. Revisar coverage: open coverage/index.html"
echo "   2. Executar testes E2E: npm run test:e2e"
echo "   3. Fazer commit: git commit -m 'feat: add tests'"
echo ""
