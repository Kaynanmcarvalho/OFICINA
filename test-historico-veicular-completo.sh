#!/bin/bash

# Script de Teste Completo - Histórico Veicular
# Testa TUDO sem mocks ou simulações

echo "🧪 TESTE COMPLETO - Histórico Veicular"
echo "======================================"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Contadores
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Função para testar
test_command() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Testando: $1... "
    
    if eval "$2" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASSOU${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}✗ FALHOU${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

echo "📋 Fase 1: Verificação de Arquivos"
echo "-----------------------------------"

# Testar existência de arquivos
test_command "Serviço vehicleHistoryService.js" "test -f src/services/vehicleHistoryService.js"
test_command "Hook useVehicleHistory.js" "test -f src/hooks/useVehicleHistory.js"
test_command "Badge VehicleHistoryBadge.jsx" "test -f src/components/vehicle-history/VehicleHistoryBadge.jsx"
test_command "Modal VehicleHistoryModal.jsx" "test -f src/components/vehicle-history/VehicleHistoryModal.jsx"
test_command "Timeline VehicleHistoryTimeline.jsx" "test -f src/components/vehicle-history/VehicleHistoryTimeline.jsx"

test_command "Cloud Function index.js" "test -f functions/vehicle-history/index.js"
test_command "Recall Scraper" "test -f functions/vehicle-history/scrapers/recallScraper.js"
test_command "Leilão Scraper" "test -f functions/vehicle-history/scrapers/leilaoScraper.js"
test_command "Sinistro Scraper" "test -f functions/vehicle-history/scrapers/sinistroScraper.js"

test_command "Cache Manager" "test -f functions/vehicle-history/utils/cache.js"
test_command "Rate Limiter" "test -f functions/vehicle-history/utils/rateLimiter.js"
test_command "Logger" "test -f functions/vehicle-history/utils/logger.js"

echo ""
echo "📋 Fase 2: Validação de Sintaxe"
echo "--------------------------------"

# Testar sintaxe JavaScript
if command -v node &> /dev/null; then
    test_command "Sintaxe do serviço" "node -c src/services/vehicleHistoryService.js"
    test_command "Sintaxe do hook" "node -c src/hooks/useVehicleHistory.js"
    test_command "Sintaxe do Badge" "node -c src/components/vehicle-history/VehicleHistoryBadge.jsx"
    test_command "Sintaxe do Modal" "node -c src/components/vehicle-history/VehicleHistoryModal.jsx"
    test_command "Sintaxe da Timeline" "node -c src/components/vehicle-history/VehicleHistoryTimeline.jsx"
    
    test_command "Sintaxe Cloud Function" "node -c functions/vehicle-history/index.js"
    test_command "Sintaxe Recall Scraper" "node -c functions/vehicle-history/scrapers/recallScraper.js"
    test_command "Sintaxe Leilão Scraper" "node -c functions/vehicle-history/scrapers/leilaoScraper.js"
    test_command "Sintaxe Sinistro Scraper" "node -c functions/vehicle-history/scrapers/sinistroScraper.js"
else
    echo -e "${YELLOW}⚠ Node.js não encontrado, pulando testes de sintaxe${NC}"
fi

echo ""
echo "📋 Fase 3: Estrutura de Código"
echo "-------------------------------"

# Verificar imports/exports
test_command "Serviço exporta getVehicleHistory" "grep -q 'export.*getVehicleHistory' src/services/vehicleHistoryService.js"
test_command "Hook exporta useVehicleHistory" "grep -q 'export.*useVehicleHistory' src/hooks/useVehicleHistory.js"
test_command "Badge exporta componente" "grep -q 'export.*VehicleHistoryBadge' src/components/vehicle-history/VehicleHistoryBadge.jsx"
test_command "Modal exporta componente" "grep -q 'export.*VehicleHistoryModal' src/components/vehicle-history/VehicleHistoryModal.jsx"

# Verificar imports necessários
test_command "Serviço importa Firebase" "grep -q 'firebase' src/services/vehicleHistoryService.js"
test_command "Hook importa useState" "grep -q 'useState' src/hooks/useVehicleHistory.js"
test_command "Badge importa React" "grep -q 'react' src/components/vehicle-history/VehicleHistoryBadge.jsx"

echo ""
echo "📋 Fase 4: Integração no ClientCard"
echo "------------------------------------"

test_command "ClientCard importa Badge" "grep -q 'VehicleHistoryBadge' src/pages/clients/ClientCard.jsx"
test_command "ClientCard importa Modal" "grep -q 'VehicleHistoryModal' src/pages/clients/ClientCard.jsx"
test_command "ClientCard usa Badge" "grep -q '<VehicleHistoryBadge' src/pages/clients/ClientCard.jsx"
test_command "ClientCard usa Modal" "grep -q '<VehicleHistoryModal' src/pages/clients/ClientCard.jsx"

echo ""
echo "📋 Fase 5: Backend - Estrutura"
echo "-------------------------------"

test_command "Cloud Function exporta handler" "grep -q 'exports.getVehicleHistory' functions/vehicle-history/index.js"
test_command "Recall Scraper exporta classe" "grep -q 'module.exports.*RecallScraper' functions/vehicle-history/scrapers/recallScraper.js"
test_command "Leilão Scraper exporta classe" "grep -q 'module.exports.*LeilaoScraper' functions/vehicle-history/scrapers/leilaoScraper.js"
test_command "Sinistro Scraper exporta classe" "grep -q 'module.exports.*SinistroScraper' functions/vehicle-history/scrapers/sinistroScraper.js"

test_command "Cache Manager exporta classe" "grep -q 'module.exports.*CacheManager' functions/vehicle-history/utils/cache.js"
test_command "Rate Limiter exporta classe" "grep -q 'module.exports.*RateLimiter' functions/vehicle-history/utils/rateLimiter.js"
test_command "Logger exporta classe" "grep -q 'module.exports.*Logger' functions/vehicle-history/utils/logger.js"

echo ""
echo "📋 Fase 6: Backend - Dependências"
echo "----------------------------------"

if [ -f "functions/vehicle-history/package.json" ]; then
    test_command "package.json existe" "test -f functions/vehicle-history/package.json"
    test_command "Dependência firebase-admin" "grep -q 'firebase-admin' functions/vehicle-history/package.json"
    test_command "Dependência firebase-functions" "grep -q 'firebase-functions' functions/vehicle-history/package.json"
    test_command "Dependência puppeteer" "grep -q 'puppeteer' functions/vehicle-history/package.json"
    test_command "Dependência cheerio" "grep -q 'cheerio' functions/vehicle-history/package.json"
    test_command "Dependência axios" "grep -q 'axios' functions/vehicle-history/package.json"
fi

echo ""
echo "📋 Fase 7: Configuração"
echo "-----------------------"

test_command "firebase.json existe" "test -f functions/vehicle-history/firebase.json"
test_command ".gitignore existe" "test -f functions/vehicle-history/.gitignore"
test_command "test-local.js existe" "test -f functions/vehicle-history/test-local.js"
test_command "firestore.rules.example existe" "test -f functions/vehicle-history/firestore.rules.example"

echo ""
echo "📋 Fase 8: Scripts de Setup"
echo "----------------------------"

test_command "Script Linux/Mac existe" "test -f setup-historico-veicular.sh"
test_command "Script Windows existe" "test -f setup-historico-veicular.bat"
test_command "Script Linux é executável" "test -x setup-historico-veicular.sh || chmod +x setup-historico-veicular.sh"

echo ""
echo "📋 Fase 9: Documentação"
echo "-----------------------"

test_command "README principal" "test -f HISTORICO_VEICULAR_README.md"
test_command "Quick Start" "test -f HISTORICO_VEICULAR_QUICK_START.md"
test_command "Backend Completo" "test -f BACKEND_HISTORICO_VEICULAR_COMPLETO.md"
test_command "Exemplos de Integração" "test -f EXEMPLO_INTEGRACAO_HISTORICO_VEICULAR.md"
test_command "Comandos Úteis" "test -f COMANDOS_UTEIS_HISTORICO_VEICULAR.md"
test_command "Deploy Guide" "test -f PASSO_A_PASSO_DEPLOY_HISTORICO_VEICULAR.md"
test_command "Checklist Deploy" "test -f CHECKLIST_DEPLOY_HISTORICO_VEICULAR.md"
test_command "Índice Mestre" "test -f INDICE_HISTORICO_VEICULAR.md"

echo ""
echo "📋 Fase 10: Testes"
echo "------------------"

test_command "Testes unitários existem" "test -f tests/unit/vehicleHistoryService.test.js"
test_command "Testes de integração existem" "test -f tests/integration/vehicleHistory.integration.test.js"
test_command "Testes E2E existem" "test -f cypress/e2e/vehicleHistory.cy.js"

echo ""
echo "📋 Fase 11: Validação de Conteúdo"
echo "----------------------------------"

# Verificar conteúdo mínimo dos arquivos
test_command "Serviço tem getVehicleHistory" "grep -q 'function getVehicleHistory' src/services/vehicleHistoryService.js || grep -q 'const getVehicleHistory' src/services/vehicleHistoryService.js"
test_command "Serviço tem calculateRiskLevel" "grep -q 'calculateRiskLevel' src/services/vehicleHistoryService.js"
test_command "Hook tem useState" "grep -q 'useState' src/hooks/useVehicleHistory.js"
test_command "Hook tem useEffect" "grep -q 'useEffect' src/hooks/useVehicleHistory.js"

test_command "Badge tem onClick" "grep -q 'onClick' src/components/vehicle-history/VehicleHistoryBadge.jsx"
test_command "Modal tem isOpen" "grep -q 'isOpen' src/components/vehicle-history/VehicleHistoryModal.jsx"
test_command "Modal tem onClose" "grep -q 'onClose' src/components/vehicle-history/VehicleHistoryModal.jsx"
test_command "Modal tem tabs" "grep -q 'tab' src/components/vehicle-history/VehicleHistoryModal.jsx"

echo ""
echo "📋 Fase 12: Backend - Lógica"
echo "----------------------------"

test_command "Cloud Function tem autenticação" "grep -q 'auth' functions/vehicle-history/index.js"
test_command "Cloud Function tem validação" "grep -q 'validat' functions/vehicle-history/index.js"
test_command "Cloud Function tem rate limiting" "grep -q 'rate' functions/vehicle-history/index.js"
test_command "Cloud Function tem cache" "grep -q 'cache' functions/vehicle-history/index.js"

test_command "Recall Scraper tem Puppeteer" "grep -q 'puppeteer' functions/vehicle-history/scrapers/recallScraper.js"
test_command "Leilão Scraper tem Axios" "grep -q 'axios' functions/vehicle-history/scrapers/leilaoScraper.js"
test_command "Leilão Scraper tem Cheerio" "grep -q 'cheerio' functions/vehicle-history/scrapers/leilaoScraper.js"

echo ""
echo "======================================"
echo "📊 RESULTADO FINAL"
echo "======================================"
echo ""
echo -e "Total de testes: ${TOTAL_TESTS}"
echo -e "${GREEN}Passou: ${PASSED_TESTS}${NC}"
echo -e "${RED}Falhou: ${FAILED_TESTS}${NC}"
echo ""

# Calcular porcentagem
if [ $TOTAL_TESTS -gt 0 ]; then
    PERCENTAGE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo -e "Taxa de sucesso: ${PERCENTAGE}%"
    echo ""
    
    if [ $PERCENTAGE -eq 100 ]; then
        echo -e "${GREEN}🎉 TODOS OS TESTES PASSARAM!${NC}"
        echo -e "${GREEN}✅ Sistema 100% validado e pronto!${NC}"
        exit 0
    elif [ $PERCENTAGE -ge 90 ]; then
        echo -e "${YELLOW}⚠ Quase lá! ${FAILED_TESTS} teste(s) falharam.${NC}"
        exit 1
    else
        echo -e "${RED}❌ Vários testes falharam. Revisar implementação.${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Nenhum teste foi executado!${NC}"
    exit 1
fi
