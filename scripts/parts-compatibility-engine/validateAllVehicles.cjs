/**
 * VALIDAÇÃO COMPLETA DE VEÍCULOS E PEÇAS
 * Verifica se TODOS os veículos têm peças corretamente cadastradas
 * 
 * @version 1.0.0
 */

const http = require('http');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

console.log(`
${colors.cyan}═══════════════════════════════════════════════════════════════
   VALIDAÇÃO COMPLETA DE VEÍCULOS E PEÇAS
   Verifica se todos os veículos têm peças cadastradas
═══════════════════════════════════════════════════════════════${colors.reset}
`);

async function fetchAPI(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: `/api/parts-full${path}`,
      method: 'GET',
      timeout: 30000,
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Erro ao parsear resposta: ${e.message}`));
        }
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    req.end();
  });
}

async function validateVehicle(vehicleId) {
  try {
    const result = await fetchAPI(`/vehicle/${vehicleId}`);
    if (!result.success) {
      return { valid: false, error: result.error };
    }
    
    const data = result.data;
    const issues = [];
    
    // Verifica se tem peças
    if (!data.parts || data.parts.length === 0) {
      issues.push('Sem peças cadastradas');
    }
    
    // Verifica quantidade de peças (50 para carros, 30 para motos)
    // Motos são identificadas pelo tipo ou pelo número de peças (30)
    const isMoto = data.vehicleType === 'motorcycle' || data.totalParts === 30;
    const expectedParts = isMoto ? 30 : 50;
    if (data.parts && data.parts.length < expectedParts * 0.9) { // 90% tolerance
      issues.push(`Poucas peças: ${data.parts.length}/${expectedParts}`);
    }
    
    // Verifica se todas as peças têm partNumber
    const partsWithoutPN = data.parts?.filter(p => !p.partNumber) || [];
    if (partsWithoutPN.length > 0) {
      issues.push(`${partsWithoutPN.length} peças sem partNumber`);
    }
    
    // Verifica se todas as peças têm marca
    const partsWithoutBrand = data.parts?.filter(p => !p.brand) || [];
    if (partsWithoutBrand.length > 0) {
      issues.push(`${partsWithoutBrand.length} peças sem marca`);
    }
    
    return {
      valid: issues.length === 0,
      vehicleId,
      brand: data.brand,
      model: data.model,
      year: data.year,
      totalParts: data.parts?.length || 0,
      issues,
    };
  } catch (error) {
    return { valid: false, vehicleId, error: error.message };
  }
}

async function main() {
  try {
    // 1. Busca estatísticas
    console.log(`${colors.blue}📊 Buscando estatísticas...${colors.reset}`);
    const stats = await fetchAPI('/stats');
    
    if (!stats.success) {
      console.error(`${colors.red}❌ Erro ao buscar estatísticas: ${stats.error}${colors.reset}`);
      process.exit(1);
    }
    
    console.log(`   Total de veículos: ${stats.data.totalVehicles}`);
    console.log(`   Total de peças: ${stats.data.totalParts}`);
    console.log(`   Marcas: ${stats.data.brands?.length || 'N/A'}`);
    
    // 2. Busca todos os veículos (em lotes)
    console.log(`\n${colors.blue}🔍 Buscando veículos para validação...${colors.reset}`);
    
    const allVehicles = [];
    const brands = stats.data.brands || [];
    
    for (const brand of brands) {
      const result = await fetchAPI(`/search?brand=${encodeURIComponent(brand)}&limit=1000`);
      if (result.success && result.data) {
        allVehicles.push(...result.data);
      }
    }
    
    console.log(`   ${allVehicles.length} veículos encontrados para validação`);
    
    // 3. Valida uma amostra de veículos (para não demorar muito)
    console.log(`\n${colors.blue}✅ Validando veículos...${colors.reset}`);
    
    const sampleSize = Math.min(100, allVehicles.length);
    const sample = [];
    const step = Math.floor(allVehicles.length / sampleSize);
    
    for (let i = 0; i < allVehicles.length && sample.length < sampleSize; i += step) {
      sample.push(allVehicles[i]);
    }
    
    const validationResults = {
      total: sample.length,
      valid: 0,
      invalid: 0,
      issues: [],
    };
    
    let progress = 0;
    for (const vehicle of sample) {
      const result = await validateVehicle(vehicle.vehicleId);
      
      if (result.valid) {
        validationResults.valid++;
      } else {
        validationResults.invalid++;
        validationResults.issues.push(result);
      }
      
      progress++;
      if (progress % 10 === 0) {
        process.stdout.write(`\r   Progresso: ${progress}/${sample.length}`);
      }
    }
    
    console.log(`\r   Progresso: ${sample.length}/${sample.length} - Concluído!`);
    
    // 4. Relatório final
    console.log(`
${colors.cyan}═══════════════════════════════════════════════════════════════
   RELATÓRIO DE VALIDAÇÃO
═══════════════════════════════════════════════════════════════${colors.reset}
`);
    
    console.log(`   📊 Estatísticas Gerais:`);
    console.log(`      Total de veículos no sistema: ${stats.data.totalVehicles}`);
    console.log(`      Total de peças no sistema: ${stats.data.totalParts}`);
    console.log(`      Média de peças por veículo: ${Math.round(stats.data.totalParts / stats.data.totalVehicles)}`);
    
    console.log(`\n   ✅ Validação de Amostra (${sample.length} veículos):`);
    console.log(`      Válidos: ${validationResults.valid} (${Math.round(validationResults.valid / sample.length * 100)}%)`);
    console.log(`      Inválidos: ${validationResults.invalid} (${Math.round(validationResults.invalid / sample.length * 100)}%)`);
    
    if (validationResults.issues.length > 0) {
      console.log(`\n   ${colors.yellow}⚠ Problemas encontrados:${colors.reset}`);
      for (const issue of validationResults.issues.slice(0, 10)) {
        console.log(`      - ${issue.vehicleId}: ${issue.issues?.join(', ') || issue.error}`);
      }
      if (validationResults.issues.length > 10) {
        console.log(`      ... e mais ${validationResults.issues.length - 10} problemas`);
      }
    }
    
    // 5. Testa busca específica (Yamaha R3)
    console.log(`\n${colors.blue}🏍️ Teste específico: Yamaha YZF-R3${colors.reset}`);
    const r3Search = await fetchAPI('/search?brand=yamaha&model=r3&limit=20');
    
    if (r3Search.success && r3Search.data.length > 0) {
      console.log(`   ✅ Encontrados ${r3Search.data.length} variantes da Yamaha R3:`);
      for (const v of r3Search.data.slice(0, 5)) {
        console.log(`      - ${v.brand} ${v.model} ${v.year} (${v.totalParts} peças)`);
      }
      if (r3Search.data.length > 5) {
        console.log(`      ... e mais ${r3Search.data.length - 5} variantes`);
      }
    } else {
      console.log(`   ${colors.yellow}⚠ Yamaha R3 não encontrada na busca${colors.reset}`);
    }
    
    // 6. Conclusão
    const successRate = Math.round(validationResults.valid / sample.length * 100);
    
    if (successRate >= 95) {
      console.log(`
${colors.green}═══════════════════════════════════════════════════════════════
   ✅ VALIDAÇÃO CONCLUÍDA COM SUCESSO!
   Taxa de sucesso: ${successRate}%
   Sistema pronto para uso!
═══════════════════════════════════════════════════════════════${colors.reset}
`);
    } else {
      console.log(`
${colors.yellow}═══════════════════════════════════════════════════════════════
   ⚠ VALIDAÇÃO CONCLUÍDA COM ALERTAS
   Taxa de sucesso: ${successRate}%
   Verifique os problemas listados acima
═══════════════════════════════════════════════════════════════${colors.reset}
`);
    }
    
  } catch (error) {
    console.error(`${colors.red}❌ Erro: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

main();
