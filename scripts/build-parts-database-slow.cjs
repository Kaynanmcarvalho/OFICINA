/**
 * TORQ - Construtor de Base de Peças (Modo Lento)
 * 
 * Este script processa 1 veículo por vez com delay de 60 segundos
 * para respeitar o rate limit extremo da API gratuita do Gemini.
 * 
 * USO: node scripts/build-parts-database-slow.cjs
 * 
 * Execute múltiplas vezes ao longo do dia para completar a base.
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const GEMINI_API_KEY = 'AIzaSyDvM51k6E_F6TEuILUK1SSVI9blie8HBKg';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Rate limiting MUITO conservador
const DELAY_BETWEEN_REQUESTS = 65000; // 65 segundos (menos de 1 req/min)
const MAX_RETRIES = 3;
const VEHICLES_PER_RUN = 1; // Apenas 1 veículo por execução

// Arquivos
const DATA_DIR = path.join(__dirname, '..', 'data');
const PROGRESS_FILE = path.join(DATA_DIR, 'build-progress.json');
const PARTS_FILE = path.join(DATA_DIR, 'real-parts-database.json');

// Cores
const c = {
  reset: '\x1b[0m', green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m',
  blue: '\x1b[34m', cyan: '\x1b[36m', bold: '\x1b[1m', dim: '\x1b[2m'
};

// ============================================================================
// VEÍCULOS PRIORITÁRIOS (mais vendidos no Brasil)
// ============================================================================

const PRIORITY_VEHICLES = [
  // TOP 10 mais vendidos
  { brand: 'Fiat', model: 'Strada', year: 2024, engine: '1.3 Firefly' },
  { brand: 'Volkswagen', model: 'Polo', year: 2024, engine: '1.0 TSI' },
  { brand: 'Chevrolet', model: 'Onix', year: 2024, engine: '1.0 Turbo' },
  { brand: 'Fiat', model: 'Argo', year: 2024, engine: '1.0 Firefly' },
  { brand: 'Hyundai', model: 'HB20', year: 2024, engine: '1.0 TGDI' },
  { brand: 'Toyota', model: 'Hilux', year: 2024, engine: '2.8 Diesel' },
  { brand: 'Volkswagen', model: 'T-Cross', year: 2024, engine: '1.0 TSI' },
  { brand: 'Jeep', model: 'Compass', year: 2024, engine: '1.3 Turbo' },
  { brand: 'Hyundai', model: 'Creta', year: 2024, engine: '1.0 TGDI' },
  { brand: 'Toyota', model: 'Corolla Cross', year: 2024, engine: '2.0 Híbrido' },
  
  // Outros populares
  { brand: 'Honda', model: 'HR-V', year: 2024, engine: '1.5 Turbo' },
  { brand: 'Chevrolet', model: 'Tracker', year: 2024, engine: '1.0 Turbo' },
  { brand: 'Fiat', model: 'Pulse', year: 2024, engine: '1.0 Turbo 200' },
  { brand: 'Volkswagen', model: 'Virtus', year: 2024, engine: '1.0 TSI' },
  { brand: 'Toyota', model: 'Corolla', year: 2024, engine: '2.0 Híbrido' },
  { brand: 'Renault', model: 'Kwid', year: 2024, engine: '1.0 SCe' },
  { brand: 'Nissan', model: 'Kicks', year: 2024, engine: '1.6 16V' },
  { brand: 'Honda', model: 'City', year: 2024, engine: '1.5 16V' },
  { brand: 'Fiat', model: 'Cronos', year: 2024, engine: '1.3 Firefly' },
  { brand: 'Chevrolet', model: 'Montana', year: 2024, engine: '1.2 Turbo' },
];

// Checklist completo de peças
const PARTS_CHECKLIST = [
  'Filtro de Óleo',
  'Filtro de Ar do Motor', 
  'Filtro de Combustível',
  'Filtro de Cabine',
  'Vela de Ignição',
  'Bobina de Ignição',
  'Correia Dentada ou Corrente de Comando',
  'Tensor da Correia',
  'Correia do Alternador (Poly-V)',
  'Bomba d\'Água',
  'Válvula Termostática',
  'Pastilha de Freio Dianteira',
  'Pastilha de Freio Traseira',
  'Disco de Freio Dianteiro',
  'Disco de Freio Traseiro',
  'Amortecedor Dianteiro',
  'Amortecedor Traseiro',
  'Kit de Embreagem',
  'Bateria',
  'Sensor de Oxigênio (Sonda Lambda)'
];

// ============================================================================
// FUNÇÕES
// ============================================================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadJSON(file, defaultValue) {
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (e) {}
  return defaultValue;
}

function saveJSON(file, data) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

async function callGemini(prompt) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`${c.dim}   Tentativa ${attempt}/${MAX_RETRIES}...${c.reset}`);
      
      const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 8192 }
        })
      });
      
      if (response.status === 429) {
        if (attempt < MAX_RETRIES) {
          const wait = 120000; // 2 minutos
          console.log(`${c.yellow}   ⏳ Rate limit! Aguardando 2 minutos...${c.reset}`);
          await sleep(wait);
          continue;
        }
        throw new Error('Rate limit persistente - tente novamente mais tarde');
      }
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Extrair JSON
      const match = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/(\{[\s\S]*\})/);
      if (!match) throw new Error('JSON não encontrado');
      
      return JSON.parse(match[1] || match[0]);
      
    } catch (error) {
      if (attempt === MAX_RETRIES) throw error;
      await sleep(30000);
    }
  }
}

async function generateParts(vehicle) {
  const prompt = `Você é um especialista em peças automotivas brasileiras.

VEÍCULO: ${vehicle.brand} ${vehicle.model} ${vehicle.year} - Motor ${vehicle.engine}

TAREFA: Forneça os códigos OEM REAIS das seguintes peças:

${PARTS_CHECKLIST.map((p, i) => `${i+1}. ${p}`).join('\n')}

REGRAS IMPORTANTES:
1. Use APENAS códigos OEM que existem nos catálogos oficiais
2. Se não tiver certeza do código, coloque "CONSULTAR_CATALOGO"
3. Inclua equivalentes de marcas: MANN, MAHLE, BOSCH, NGK, TRW, GATES, DENSO
4. Indique a fonte do código (catálogo oficial, manual, etc)

RESPONDA EM JSON:
{
  "vehicle": "${vehicle.brand} ${vehicle.model} ${vehicle.year}",
  "engine": "${vehicle.engine}",
  "parts": [
    {
      "name": "Filtro de Óleo",
      "oemCode": "CÓDIGO_OEM_REAL",
      "source": "Catálogo oficial / Manual do proprietário",
      "equivalents": [
        {"brand": "MANN", "code": "CÓDIGO"},
        {"brand": "MAHLE", "code": "CÓDIGO"}
      ],
      "confidence": 95,
      "notes": "Observações"
    }
  ]
}`;

  return await callGemini(prompt);
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log(`\n${c.bold}${c.cyan}╔═══════════════════════════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.bold}${c.cyan}║   TORQ - Construtor de Base de Peças (Modo Conservador)       ║${c.reset}`);
  console.log(`${c.bold}${c.cyan}╚═══════════════════════════════════════════════════════════════╝${c.reset}\n`);
  
  // Carregar estado
  const progress = loadJSON(PROGRESS_FILE, { processed: [], errors: [] });
  const partsDB = loadJSON(PARTS_FILE, { vehicles: [], totalParts: 0 });
  
  console.log(`${c.blue}📊 Status:${c.reset}`);
  console.log(`   Processados: ${progress.processed.length}/${PRIORITY_VEHICLES.length}`);
  console.log(`   Peças na base: ${partsDB.totalParts}\n`);
  
  // Encontrar próximo veículo
  const pending = PRIORITY_VEHICLES.filter(v => 
    !progress.processed.includes(`${v.brand}_${v.model}_${v.year}`)
  );
  
  if (pending.length === 0) {
    console.log(`${c.green}✅ Todos os veículos prioritários foram processados!${c.reset}\n`);
    return;
  }
  
  const vehicle = pending[0];
  const vehicleKey = `${vehicle.brand}_${vehicle.model}_${vehicle.year}`;
  
  console.log(`${c.cyan}🚗 Processando: ${vehicle.brand} ${vehicle.model} ${vehicle.year}${c.reset}`);
  console.log(`${c.dim}   Motor: ${vehicle.engine}${c.reset}`);
  console.log(`${c.blue}   🤖 Consultando Gemini AI...${c.reset}\n`);
  
  try {
    const result = await generateParts(vehicle);
    
    if (result.parts && result.parts.length > 0) {
      // Contar peças válidas
      const valid = result.parts.filter(p => 
        p.oemCode && !p.oemCode.includes('CONSULTAR')
      );
      
      console.log(`\n${c.green}✅ ${result.parts.length} peças geradas!${c.reset}`);
      console.log(`${c.green}   ${valid.length} com código OEM válido${c.reset}\n`);
      
      // Mostrar peças
      console.log(`${c.cyan}📋 Peças encontradas:${c.reset}`);
      result.parts.forEach(part => {
        const icon = part.oemCode.includes('CONSULTAR') ? '⚠️' : '✓';
        const color = part.oemCode.includes('CONSULTAR') ? c.yellow : c.green;
        console.log(`   ${color}${icon} ${part.name}: ${part.oemCode}${c.reset}`);
        if (part.equivalents?.length > 0) {
          const eqs = part.equivalents.slice(0, 2).map(e => `${e.brand}:${e.code}`).join(', ');
          console.log(`${c.dim}      Equiv: ${eqs}${c.reset}`);
        }
      });
      
      // Salvar
      partsDB.vehicles.push({
        ...vehicle,
        parts: result.parts,
        processedAt: new Date().toISOString()
      });
      partsDB.totalParts += result.parts.length;
      partsDB.lastUpdate = new Date().toISOString();
      
      progress.processed.push(vehicleKey);
      
    } else {
      console.log(`${c.yellow}⚠️ Nenhuma peça retornada${c.reset}`);
      progress.errors.push({ vehicle: vehicleKey, error: 'Sem peças', date: new Date().toISOString() });
    }
    
  } catch (error) {
    console.log(`\n${c.red}❌ Erro: ${error.message}${c.reset}`);
    progress.errors.push({ vehicle: vehicleKey, error: error.message, date: new Date().toISOString() });
    
    if (error.message.includes('Rate limit')) {
      console.log(`\n${c.yellow}💡 Dica: Aguarde alguns minutos e execute novamente.${c.reset}`);
    }
  }
  
  // Salvar progresso
  saveJSON(PROGRESS_FILE, progress);
  saveJSON(PARTS_FILE, partsDB);
  
  // Resumo
  console.log(`\n${c.bold}${c.cyan}═══════════════════════════════════════════════════════════════${c.reset}`);
  console.log(`${c.blue}📊 Progresso: ${progress.processed.length}/${PRIORITY_VEHICLES.length} veículos${c.reset}`);
  console.log(`${c.blue}📦 Total de peças: ${partsDB.totalParts}${c.reset}`);
  
  const remaining = PRIORITY_VEHICLES.length - progress.processed.length;
  if (remaining > 0) {
    console.log(`\n${c.yellow}⏳ Restam ${remaining} veículos.${c.reset}`);
    console.log(`${c.dim}Execute novamente: node scripts/build-parts-database-slow.cjs${c.reset}`);
  }
  
  console.log(`\n${c.blue}📄 Dados: data/real-parts-database.json${c.reset}\n`);
}

main().catch(console.error);
