/**
 * TORQ Automotive - Script de Validação de Peças
 * 
 * Executa validação de peças usando o servidor de validação
 * 
 * Uso: node scripts/validate-parts-now.js [--brand=MARCA]
 */

const http = require('http');

// Configuração
const API_URL = 'http://localhost:3001';
const RATE_LIMIT_MS = 3000; // 3 segundos entre requisições

// Peças para validar (amostra da base de dados)
const PARTS_TO_VALIDATE = [
  // HYUNDAI
  {
    vehicleBrand: 'Hyundai',
    vehicleModel: 'Creta',
    vehicleYear: 2022,
    partName: 'Filtro de Óleo',
    oemCode: '26300-35503',
    equivalents: [
      { brand: 'MANN', code: 'W 811/80' },
      { brand: 'MAHLE', code: 'OC 500' },
      { brand: 'FRAM', code: 'PH6811' },
    ],
  },
  {
    vehicleBrand: 'Hyundai',
    vehicleModel: 'Creta',
    vehicleYear: 2022,
    partName: 'Filtro de Ar',
    oemCode: '28113-M0000',
    equivalents: [
      { brand: 'MANN', code: 'C 26 017' },
      { brand: 'MAHLE', code: 'LX 3778' },
    ],
  },
  {
    vehicleBrand: 'Hyundai',
    vehicleModel: 'Creta',
    vehicleYear: 2022,
    partName: 'Vela de Ignição',
    oemCode: '18855-10060',
    equivalents: [
      { brand: 'NGK', code: 'LZKR6B-10E' },
      { brand: 'DENSO', code: 'SK16R11' },
    ],
  },
  // FIAT
  {
    vehicleBrand: 'Fiat',
    vehicleModel: 'Argo',
    vehicleYear: 2023,
    partName: 'Filtro de Óleo',
    oemCode: '55594651',
    equivalents: [
      { brand: 'MANN', code: 'W 712/95' },
      { brand: 'MAHLE', code: 'OC 1051' },
      { brand: 'FRAM', code: 'PH10757' },
    ],
  },
  {
    vehicleBrand: 'Fiat',
    vehicleModel: 'Argo',
    vehicleYear: 2023,
    partName: 'Pastilha de Freio Dianteira',
    oemCode: '77367914',
    equivalents: [
      { brand: 'TRW', code: 'GDB2166' },
      { brand: 'FERODO', code: 'FDB4712' },
      { brand: 'COBREQ', code: 'N-1612' },
    ],
  },
  // VOLKSWAGEN
  {
    vehicleBrand: 'Volkswagen',
    vehicleModel: 'Polo',
    vehicleYear: 2023,
    partName: 'Filtro de Óleo',
    oemCode: '04E 115 561 H',
    equivalents: [
      { brand: 'MANN', code: 'W 712/94' },
      { brand: 'MAHLE', code: 'OC 593/4' },
    ],
  },
  {
    vehicleBrand: 'Volkswagen',
    vehicleModel: 'Polo',
    vehicleYear: 2023,
    partName: 'Correia Dentada',
    oemCode: '04C 109 119 F',
    equivalents: [
      { brand: 'GATES', code: '5578XS' },
      { brand: 'CONTINENTAL', code: 'CT1139' },
    ],
  },
  // CHEVROLET
  {
    vehicleBrand: 'Chevrolet',
    vehicleModel: 'Onix',
    vehicleYear: 2023,
    partName: 'Filtro de Óleo',
    oemCode: '55594651',
    equivalents: [
      { brand: 'MANN', code: 'W 712/95' },
      { brand: 'MAHLE', code: 'OC 1051' },
    ],
  },
  // TOYOTA
  {
    vehicleBrand: 'Toyota',
    vehicleModel: 'Corolla',
    vehicleYear: 2023,
    partName: 'Filtro de Óleo',
    oemCode: '90915-YZZD4',
    equivalents: [
      { brand: 'MANN', code: 'W 68/3' },
      { brand: 'MAHLE', code: 'OC 495' },
    ],
  },
  // HONDA
  {
    vehicleBrand: 'Honda',
    vehicleModel: 'Civic',
    vehicleYear: 2023,
    partName: 'Filtro de Óleo',
    oemCode: '15400-RTA-003',
    equivalents: [
      { brand: 'MANN', code: 'W 610/6' },
      { brand: 'MAHLE', code: 'OC 617' },
    ],
  },
];

// Função para fazer requisição HTTP
function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Função para aguardar
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Função principal
async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('       TORQ Automotive - Validação de Peças via Google         ');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log();
  
  // Verificar se o servidor está rodando
  try {
    const health = await makeRequest('GET', '/health');
    console.log('✅ Servidor de validação está rodando');
    console.log();
  } catch (error) {
    console.error('❌ Servidor de validação não está rodando!');
    console.error('   Execute: node server/validation-server.js');
    process.exit(1);
  }
  
  // Filtrar por marca se especificado
  const args = process.argv.slice(2);
  let partsToValidate = PARTS_TO_VALIDATE;
  
  for (const arg of args) {
    if (arg.startsWith('--brand=')) {
      const brand = arg.split('=')[1].toLowerCase();
      partsToValidate = PARTS_TO_VALIDATE.filter(p => 
        p.vehicleBrand.toLowerCase().includes(brand)
      );
      console.log(`🔍 Filtrando por marca: ${brand}`);
    }
  }
  
  console.log(`📋 Peças a validar: ${partsToValidate.length}`);
  console.log();
  
  const results = {
    valid: [],
    invalid: [],
    errors: [],
  };
  
  for (let i = 0; i < partsToValidate.length; i++) {
    const part = partsToValidate[i];
    
    console.log(`[${i + 1}/${partsToValidate.length}] Validando: ${part.vehicleBrand} ${part.vehicleModel} - ${part.partName}`);
    console.log(`   OEM: ${part.oemCode}`);
    
    try {
      const result = await makeRequest('POST', '/api/parts/validate', part);
      
      if (result.isValid) {
        console.log(`   ✅ VÁLIDO (confiança: ${(result.confidence * 100).toFixed(0)}%)`);
        console.log(`   📍 Fontes: ${result.oemCodeSources?.length || 0}`);
        console.log(`   ✓ Equivalentes válidos: ${result.validEquivalents?.length || 0}`);
        results.valid.push({ part, result });
      } else {
        console.log(`   ❌ INVÁLIDO`);
        console.log(`   📍 OEM válido: ${result.oemCodeValid ? 'Sim' : 'Não'}`);
        console.log(`   ✗ Equivalentes inválidos: ${result.invalidEquivalents?.length || 0}`);
        results.invalid.push({ part, result });
      }
      
    } catch (error) {
      console.log(`   ⚠️ ERRO: ${error.message}`);
      results.errors.push({ part, error: error.message });
    }
    
    console.log();
    
    // Rate limiting
    if (i < partsToValidate.length - 1) {
      console.log(`   ⏳ Aguardando ${RATE_LIMIT_MS / 1000}s...`);
      await sleep(RATE_LIMIT_MS);
    }
  }
  
  // Resumo
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('                         RESUMO                                 ');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log();
  console.log(`✅ Peças válidas: ${results.valid.length}`);
  console.log(`❌ Peças inválidas: ${results.invalid.length}`);
  console.log(`⚠️ Erros: ${results.errors.length}`);
  console.log();
  
  if (results.valid.length > 0) {
    console.log('📋 Peças validadas com sucesso:');
    for (const { part, result } of results.valid) {
      console.log(`   • ${part.vehicleBrand} ${part.vehicleModel} - ${part.partName}`);
      console.log(`     OEM: ${part.oemCode} (${(result.confidence * 100).toFixed(0)}% confiança)`);
      if (result.validEquivalents?.length > 0) {
        console.log(`     Equivalentes: ${result.validEquivalents.map(e => `${e.brand} ${e.code}`).join(', ')}`);
      }
    }
    console.log();
  }
  
  if (results.invalid.length > 0) {
    console.log('📋 Peças que precisam de revisão:');
    for (const { part, result } of results.invalid) {
      console.log(`   • ${part.vehicleBrand} ${part.vehicleModel} - ${part.partName}`);
      console.log(`     OEM: ${part.oemCode}`);
      if (result.invalidEquivalents?.length > 0) {
        console.log(`     Equivalentes inválidos: ${result.invalidEquivalents.map(e => `${e.brand} ${e.code}`).join(', ')}`);
      }
    }
    console.log();
  }
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('                    VALIDAÇÃO CONCLUÍDA                         ');
  console.log('═══════════════════════════════════════════════════════════════');
}

// Executar
main().catch(console.error);
