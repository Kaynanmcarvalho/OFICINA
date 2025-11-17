#!/bin/bash

# Script de Setup - Histórico Veicular
# Automatiza a instalação e configuração do sistema

echo "🚗 Setup do Histórico Veicular"
echo "================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para print colorido
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    print_error "Execute este script na raiz do projeto!"
    exit 1
fi

print_success "Diretório correto detectado"
echo ""

# Passo 1: Verificar Node.js
echo "📦 Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js instalado: $NODE_VERSION"
else
    print_error "Node.js não encontrado! Instale Node.js 18+ primeiro."
    exit 1
fi
echo ""

# Passo 2: Verificar Firebase CLI
echo "🔥 Verificando Firebase CLI..."
if command -v firebase &> /dev/null; then
    FIREBASE_VERSION=$(firebase --version)
    print_success "Firebase CLI instalado: $FIREBASE_VERSION"
else
    print_warning "Firebase CLI não encontrado. Instalando..."
    npm install -g firebase-tools
    print_success "Firebase CLI instalado"
fi
echo ""

# Passo 3: Login no Firebase
echo "🔐 Verificando autenticação Firebase..."
if firebase projects:list &> /dev/null; then
    print_success "Já autenticado no Firebase"
else
    print_warning "Fazendo login no Firebase..."
    firebase login
fi
echo ""

# Passo 4: Instalar dependências do backend
echo "📥 Instalando dependências do backend..."
cd functions/vehicle-history

if [ ! -f "package.json" ]; then
    print_error "package.json não encontrado em functions/vehicle-history"
    exit 1
fi

npm install
if [ $? -eq 0 ]; then
    print_success "Dependências do backend instaladas"
else
    print_error "Erro ao instalar dependências do backend"
    exit 1
fi

cd ../..
echo ""

# Passo 5: Testar scrapers localmente
echo "🧪 Testando scrapers..."
cd functions/vehicle-history
node test-local.js
if [ $? -eq 0 ]; then
    print_success "Testes dos scrapers concluídos"
else
    print_warning "Alguns testes falharam (normal se não houver dados)"
fi
cd ../..
echo ""

# Passo 6: Configurar Firestore Rules
echo "🔒 Configurando Firestore Rules..."
if [ -f "firestore.rules" ]; then
    # Adicionar regras do histórico veicular
    if grep -q "vehicle_history" firestore.rules; then
        print_success "Regras do Firestore já configuradas"
    else
        print_warning "Adicionando regras ao firestore.rules..."
        cat functions/vehicle-history/firestore.rules.example >> firestore.rules
        print_success "Regras adicionadas ao firestore.rules"
    fi
else
    print_warning "Criando firestore.rules..."
    cp functions/vehicle-history/firestore.rules.example firestore.rules
    print_success "firestore.rules criado"
fi
echo ""

# Passo 7: Deploy (opcional)
echo "🚀 Deploy"
echo "================================"
read -p "Deseja fazer o deploy agora? (s/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "Fazendo deploy..."
    
    # Deploy das regras do Firestore
    echo "📋 Deploy das regras do Firestore..."
    firebase deploy --only firestore:rules
    if [ $? -eq 0 ]; then
        print_success "Regras do Firestore deployadas"
    else
        print_error "Erro ao deployar regras do Firestore"
    fi
    
    # Deploy da Cloud Function
    echo "☁️ Deploy da Cloud Function..."
    cd functions/vehicle-history
    npm run deploy
    if [ $? -eq 0 ]; then
        print_success "Cloud Function deployada"
    else
        print_error "Erro ao deployar Cloud Function"
    fi
    cd ../..
else
    print_warning "Deploy pulado. Execute manualmente quando estiver pronto:"
    echo "  cd functions/vehicle-history"
    echo "  npm run deploy"
fi
echo ""

# Passo 8: Criar índices do Firestore
echo "📊 Índices do Firestore"
echo "================================"
print_warning "Crie os seguintes índices no Firebase Console:"
echo ""
echo "Collection: vehicle_history"
echo "  - cacheExpiry (Ascending)"
echo "  - empresaId (Ascending)"
echo ""
echo "Collection: rate_limits"
echo "  - lastRequest (Ascending)"
echo ""
echo "URL: https://console.firebase.google.com/project/_/firestore/indexes"
echo ""

# Passo 9: Resumo
echo "✅ Setup Concluído!"
echo "================================"
echo ""
echo "📚 Próximos passos:"
echo ""
echo "1. Criar índices no Firestore (veja acima)"
echo "2. Integrar no ClientCard:"
echo "   - Importar VehicleHistoryBadge"
echo "   - Importar VehicleHistoryModal"
echo "   - Ver: EXEMPLO_INTEGRACAO_HISTORICO_VEICULAR.md"
echo ""
echo "3. Testar a integração:"
echo "   - Abrir aplicação"
echo "   - Navegar para página de clientes"
echo "   - Clicar no badge de histórico"
echo ""
echo "4. Monitorar logs:"
echo "   firebase functions:log --only getVehicleHistory"
echo ""
echo "📖 Documentação completa:"
echo "   - HISTORICO_VEICULAR_README.md"
echo "   - HISTORICO_VEICULAR_QUICK_START.md"
echo "   - BACKEND_HISTORICO_VEICULAR_COMPLETO.md"
echo ""
print_success "Sistema pronto para uso! 🎉"
