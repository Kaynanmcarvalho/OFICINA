/**
 * Script de Teste Automatizado do Scraper
 * Testa múltiplas placas e valida os resultados
 */

const axios = require('axios');

const API_URL = 'http://localhost:3001/api/vehicles/plate';

// Placas de teste
const testPlates = [
    { plate: 'FRD4486', expected: { marca: 'MERCEDES-BENZ', modelo: 'A45AMG4M', ano: '2013', cor: 'Cinza' } },
    { plate: 'RFV6C13', expected: { marca: 'VOLKSWAGEN', modelo: 'VOYAGE', ano: '2021', cor: 'Prata' } },
    { plate: 'ABC1234', expected: null }, // Placa inexistente
];

// Cores ANSI para output colorido
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    data: (msg) => console.log(`${colors.cyan}   ${msg}${colors.reset}`),
    separator: () => console.log(`${colors.gray}${'─'.repeat(80)}${colors.reset}`)
};

async function testPlate(plateData) {
    const { plate, expected } = plateData;
    
    log.separator();
    log.info(`Testando placa: ${plate}`);
    
    try {
        const startTime = Date.now();
        const response = await axios.get(`${API_URL}/${plate}`, { timeout: 40000 });
        const duration = Date.now() - startTime;
        
        const { success, data, error } = response.data;
        
        if (!success) {
            if (expected === null) {
                log.success(`Placa não encontrada (esperado): ${error}`);
                return { plate, status: 'PASS', duration };
            } else {
                log.error(`Falha ao buscar placa: ${error}`);
                return { plate, status: 'FAIL', duration, error };
            }
        }
        
        // Valida campos obrigatórios
        const requiredFields = ['placa', 'marca', 'modelo', 'ano', 'cor'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            log.error(`Campos faltando: ${missingFields.join(', ')}`);
            return { plate, status: 'FAIL', duration, error: 'Campos faltando' };
        }
        
        // Exibe dados extraídos
        log.success('Dados extraídos com sucesso!');
        log.data(`Marca: ${data.marca}`);
        log.data(`Modelo: ${data.modelo}`);
        log.data(`Ano: ${data.ano}`);
        log.data(`Cor: ${data.cor}`);
        log.data(`Tipo: ${data.tipo || 'N/A'}`);
        log.data(`Chassi: ${data.chassi || 'N/A'}`);
        log.data(`Município: ${data.municipio || 'N/A'}`);
        log.data(`UF: ${data.uf || 'N/A'}`);
        log.data(`Tempo: ${duration}ms`);
        
        // Valida contra valores esperados
        if (expected) {
            let validationPassed = true;
            
            if (expected.marca && !data.marca.includes(expected.marca)) {
                log.warning(`Marca esperada: ${expected.marca}, recebida: ${data.marca}`);
                validationPassed = false;
            }
            
            if (expected.modelo && !data.modelo.includes(expected.modelo)) {
                log.warning(`Modelo esperado: ${expected.modelo}, recebido: ${data.modelo}`);
                validationPassed = false;
            }
            
            if (expected.ano && data.ano !== expected.ano) {
                log.warning(`Ano esperado: ${expected.ano}, recebido: ${data.ano}`);
                validationPassed = false;
            }
            
            if (expected.cor && !data.cor.toLowerCase().includes(expected.cor.toLowerCase())) {
                log.warning(`Cor esperada: ${expected.cor}, recebida: ${data.cor}`);
                validationPassed = false;
            }
            
            if (!validationPassed) {
                return { plate, status: 'PARTIAL', duration, data };
            }
        }
        
        return { plate, status: 'PASS', duration, data };
        
    } catch (error) {
        log.error(`Erro ao testar placa: ${error.message}`);
        return { plate, status: 'ERROR', error: error.message };
    }
}

async function runTests() {
    console.log('\n');
    log.info('🚀 Iniciando Testes do Scraper');
    log.info(`Total de placas: ${testPlates.length}`);
    console.log('\n');
    
    const results = [];
    
    for (const plateData of testPlates) {
        const result = await testPlate(plateData);
        results.push(result);
        
        // Aguarda 2 segundos entre testes para não sobrecarregar
        if (testPlates.indexOf(plateData) < testPlates.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    // Resumo dos testes
    log.separator();
    log.info('📊 Resumo dos Testes');
    log.separator();
    
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    const partial = results.filter(r => r.status === 'PARTIAL').length;
    const errors = results.filter(r => r.status === 'ERROR').length;
    
    console.log(`\n${colors.green}✅ Passou: ${passed}${colors.reset}`);
    console.log(`${colors.yellow}⚠️  Parcial: ${partial}${colors.reset}`);
    console.log(`${colors.red}❌ Falhou: ${failed}${colors.reset}`);
    console.log(`${colors.red}💥 Erros: ${errors}${colors.reset}`);
    
    // Tempo médio
    const durations = results.filter(r => r.duration).map(r => r.duration);
    if (durations.length > 0) {
        const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
        console.log(`\n${colors.cyan}⏱️  Tempo médio: ${Math.round(avgDuration)}ms${colors.reset}`);
    }
    
    log.separator();
    
    // Detalhes dos testes que falharam
    const failedTests = results.filter(r => r.status === 'FAIL' || r.status === 'ERROR');
    if (failedTests.length > 0) {
        log.error('Testes que falharam:');
        failedTests.forEach(test => {
            console.log(`  - ${test.plate}: ${test.error || 'Erro desconhecido'}`);
        });
    }
    
    console.log('\n');
    
    // Exit code baseado nos resultados
    process.exit(failed + errors > 0 ? 1 : 0);
}

// Executa os testes
runTests().catch(error => {
    log.error(`Erro fatal: ${error.message}`);
    process.exit(1);
});
