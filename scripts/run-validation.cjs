/**
 * TORQ - Script de Validação com Gemini AI
 */

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const API_PORT = 3001;
const RATE_LIMIT_MS = 3000; // 3 segundos entre requisições

// Peças para validar
const PARTS = [
  { vehicleBrand: 'Hyundai', vehicleModel: 'Creta', vehicleYear: 2022, partName: 'Filtro de Óleo', oemCode: '26300-35503', equivalents: [{ brand: 'MANN', code: 'W 811/80' }, { brand: 'FRAM', code: 'PH6811' }] },
  { vehicleBrand: 'Hyundai', vehicleModel: 'Creta', vehicleYear: 2022, partName: 'Filtro de Ar', oemCode: '28113-M0000', equivalents: [{ brand: 'MANN', code: 'C 26 017' }] },
  { vehicleBrand: 'Hyundai', vehicleModel: 'Creta', vehicleYear: 2022, partName: 'Vela de Ignição', oemCode: '18855-10060', equivalents: [{ brand: 'NGK', code: 'LZKR6B-10E' }] },
  { vehicleBrand: 'Fiat', vehicleModel: 'Argo', vehicleYear: 2023, partName: 'Filtro de Óleo', oemCode: '55594651', equivalents: [{ brand: 'MANN', code: 'W 712/95' }] },
  { vehicleBrand: 'Fiat', vehicleModel: 'Argo', vehicleYear: 2023, partName: 'Pastilha de Freio', oemCode: '77367914', equivalents: [{ brand: 'TRW', code: 'GDB2166' }] },
  { vehicleBrand: 'Volkswagen', vehicleModel: 'Polo', vehicleYear: 2023, partName: 'Filtro de Óleo', oemCode: '04E 115 561 H', equivalents: [{ brand: 'MANN', code: 'W 712/94' }] },
  { vehicleBrand: 'Volkswagen', vehicleModel: 'Polo', vehicleYear: 2023, partName: 'Correia Dentada', oemCode: '04C 109 119 F', equivalents: [{ brand: 'GATES', code: '5578XS' }] },
  { vehicleBrand: 'Chevrolet', vehicleModel: 'Onix', vehicleYear: 2023, partName: 'Filtro de Óleo', oemCode: '55594651', equivalents: [{ brand: 'MANN', code: 'W 712/95' }] },
  { vehicleBrand: 'Toyota', vehicleModel: 'Corolla', vehicleYear: 2023, partName: 'Filtro de Óleo', oemCode: '90915-YZZD4', equivalents: [{ brand: 'MANN', code: 'W 68/3' }] },
  { vehicleBrand: 'Honda', vehicleModel: 'Civic', vehicleYear: 2023, partName: 'Filtro de Óleo', oemCode: '15400-RTA-003', equivalents: [{ brand: 'MANN', code: 'W 610/6' }] },
];

function request(method, path, data) {
  return new Promise((resolve, reject) => {
    const options = { hostname: 'localhost', port: API_PORT, path, method, headers: { 'Content-Type': 'application/json' } };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (e) { resolve(body); }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function startServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Iniciando servidor Gemini...');
    
    const server = spawn('node', ['gemini-validation-server.js'], {
      cwd: path.join(__dirname, '..', 'server'),
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    server.stdout.on('data', (data) => {
      const msg = data.toString();
      if (msg.includes('Porta')) {
        console.log('✅ Servidor iniciado!');
        resolve(server);
      }
      process.stdout.write(msg);
    });
    
    server.stderr.on('data', (data) => process.stderr.write(data));
    server.on('error', reject);
    
    setTimeout(() => resolve(server), 3000);
  });
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('       TORQ Automotive - Validação de Peças (Gemini AI)        ');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  let server;
  try {
    // Verificar se servidor já está rodando
    try {
      await request('GET', '/health');
      console.log('✅ Servidor já está rodando\n');
    } catch {
      server = await startServer();
      await sleep(2000);
    }
    
    console.log(`📋 Validando ${PARTS.length} peças...\n`);
    
    const results = { valid: [], invalid: [], errors: [] };
    
    for (let i = 0; i < PARTS.length; i++) {
      const part = PARTS[i];
      console.log(`[${i+1}/${PARTS.length}] ${part.vehicleBrand} ${part.vehicleModel} - ${part.partName}`);
      console.log(`   OEM: ${part.oemCode}`);
      
      try {
        const result = await request('POST', '/api/parts/validate', part);
        
        if (result.isValid) {
          console.log(`   ✅ VÁLIDO (${(result.confidence*100).toFixed(0)}%)`);
          if (result.validEquivalents?.length) {
            console.log(`   ✓ Equivalentes: ${result.validEquivalents.map(e => `${e.brand} ${e.code}`).join(', ')}`);
          }
          results.valid.push({ part, result });
        } else {
          console.log(`   ❌ INVÁLIDO`);
          if (result.invalidEquivalents?.length) {
            console.log(`   ✗ Problemas: ${result.invalidEquivalents.map(e => `${e.brand}: ${e.reason}`).join(', ')}`);
          }
          if (result.suggestedCorrections?.length) {
            console.log(`   💡 Sugestões: ${result.suggestedCorrections.map(e => `${e.brand}: ${e.correctCode || e.code}`).join(', ')}`);
          }
          results.invalid.push({ part, result });
        }
      } catch (error) {
        console.log(`   ⚠️ ERRO: ${error.message}`);
        results.errors.push({ part, error: error.message });
      }
      
      console.log();
      if (i < PARTS.length - 1) await sleep(RATE_LIMIT_MS);
    }
    
    // Resumo
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                         RESUMO                                 ');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log(`✅ Válidas: ${results.valid.length}`);
    console.log(`❌ Inválidas: ${results.invalid.length}`);
    console.log(`⚠️ Erros: ${results.errors.length}\n`);
    
    if (results.valid.length > 0) {
      console.log('📋 Peças validadas:');
      results.valid.forEach(({ part, result }) => {
        console.log(`   • ${part.vehicleBrand} ${part.vehicleModel} - ${part.partName}: ${part.oemCode}`);
      });
      console.log();
    }
    
    console.log('═══════════════════════════════════════════════════════════════');
    
  } finally {
    if (server) {
      console.log('\n🛑 Encerrando servidor...');
      server.kill();
    }
  }
}

main().catch(console.error);
