/**
 * TORQ - Construtor de Base de Peças com Gemini AI
 * 
 * Este script constrói a base de dados de peças REAIS validadas pelo Gemini.
 * Processa em lotes pequenos para respeitar o rate limit da API gratuita.
 * 
 * USO: node scripts/gemini-parts-builder.cjs
 * 
 * O script salva progresso e pode ser executado múltiplas vezes.
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const GEMINI_API_KEY = 'AIzaSyDvM51k6E_F6TEuILUK1SSVI9blie8HBKg';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Rate limiting conservador para API gratuita
const DELAY_BETWEEN_REQUESTS = 6000; // 6 segundos (10 req/min max)
const MAX_RETRIES = 5;
const BATCH_SIZE = 5; // Processar 5 veículos por execução

// Arquivos de progresso
const PROGRESS_FILE = path.join(__dirname, '..', 'data', 'gemini-progress.json');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'validated-parts.json');

// Cores
const c = {
  reset: '\x1b[0m', green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m',
  blue: '\x1b[34m', cyan: '\x1b[36m', bold: '\x1b[1m', dim: '\x1b[2m'
};

// ============================================================================
// VEÍCULOS PARA PROCESSAR (principais do mercado brasileiro)
// ============================================================================

const VEHICLES_TO_PROCESS = [
  // HYUNDAI
  { brand: 'Hyundai', model: 'Creta', year: 2023, engine: '1.6 16V Gamma' },
  { brand: 'Hyundai', model: 'HB20', year: 2023, engine: '1.0 12V / 1.6 16V' },
  { brand: 'Hyundai', model: 'Tucson', year: 2023, engine: '1.6 Turbo GDI' },
  
  // FIAT
  { brand: 'Fiat', model: 'Argo', year: 2023, engine: '1.0 Firefly / 1.3 Firefly' },
  { brand: 'Fiat', model: 'Cronos', year: 2023, engine: '1.0 Firefly / 1.3 Firefly' },
  { brand: 'Fiat', model: 'Strada', year: 2023, engine: '1.3 Firefly / 1.4 Fire' },
  { brand: 'Fiat', model: 'Pulse', year: 2023, engine: '1.0 Turbo 200' },
  { brand: 'Fiat', model: 'Fastback', year: 2023, engine: '1.0 Turbo 200' },
  
  // VOLKSWAGEN
  { brand: 'Volkswagen', model: 'Polo', year: 2023, engine: '1.0 TSI / 1.4 TSI' },
  { brand: 'Volkswagen', model: 'Virtus', year: 2023, engine: '1.0 TSI / 1.4 TSI' },
  { brand: 'Volkswagen', model: 'T-Cross', year: 2023, engine: '1.0 TSI / 1.4 TSI' },
  { brand: 'Volkswagen', model: 'Nivus', year: 2023, engine: '1.0 TSI' },
  { brand: 'Volkswagen', model: 'Taos', year: 2023, engine: '1.4 TSI' },
  
  // CHEVROLET
  { brand: 'Chevrolet', model: 'Onix', year: 2023, engine: '1.0 Turbo / 1.0 Aspirado' },
  { brand: 'Chevrolet', model: 'Onix Plus', year: 2023, engine: '1.0 Turbo' },
  { brand: 'Chevrolet', model: 'Tracker', year: 2023, engine: '1.0 Turbo / 1.2 Turbo' },
  { brand: 'Chevrolet', model: 'Montana', year: 2023, engine: '1.2 Turbo' },
  
  // TOYOTA
  { brand: 'Toyota', model: 'Corolla', year: 2023, engine: '2.0 16V / Híbrido' },
  { brand: 'Toyota', model: 'Corolla Cross', year: 2023, engine: '2.0 16V / Híbrido' },
  { brand: 'Toyota', model: 'Yaris', year: 2023, engine: '1.3 16V / 1.5 16V' },
  { brand: 'Toyota', model: 'Hilux', year: 2023, engine: '2.8 Diesel' },
  
  // HONDA
  { brand: 'Honda', model: 'Civic', year: 2023, engine: '2.0 16V / 1.5 Turbo' },
  { brand: 'Honda', model: 'HR-V', year: 2023, engine: '1.5 16V / 1.5 Turbo' },
  { brand: 'Honda', model: 'City', year: 2023, engine: '1.5 16V' },
  { brand: 'Honda', model: 'CR-V', year: 2023, engine: '1.5 Turbo' },
  
  // RENAULT
  { brand: 'Renault', model: 'Kwid', year: 2023, engine: '1.0 SCe' },
  { brand: 'Renault', model: 'Sandero', year: 2023, engine: '1.0 SCe / 1.6 SCe' },
  { brand: 'Renault', model: 'Logan', year: 2023, engine: '1.0 SCe / 1.6 SCe' },
  { brand: 'Renault', model: 'Duster', year: 2023, engine: '1.6 SCe / 1.3 Turbo' },
  
  // NISSAN
  { brand: 'Nissan', model: 'Kicks', year: 2023, engine: '1.6 16V' },
  { brand: 'Nissan', model: 'Versa', year: 2023, engine: '1.6 16V' },
  { brand: 'Nissan', model: 'Sentra', year: 2023, engine: '2.0 16V' },
  { brand: 'Nissan', model: 'Frontier', year: 2023, engine: '2.3 Diesel' },
  
  // JEEP
  { brand: 'Jeep', model: 'Renegade', year: 2023, engine: '1.3 Turbo / 2.0 Diesel' },
  { brand: 'Jeep', model: 'Compass', year: 2023, engine: '1.3 Turbo / 2.0 Diesel' },
  { brand: 'Jeep', model: 'Commander', year: 2023, engine: '1.3 Turbo / 2.0 Diesel' },
  
  // PEUGEOT
  { brand: 'Peugeot', model: '208', year: 2023, engine: '1.0 Firefly / 1.6 THP' },
  { brand: 'Peugeot', model: '2008', year: 2023, engine: '1.0 Firefly / 1.6 THP' },
  
  // CITROËN
  { brand: 'Citroën', model: 'C3', year: 2023, engine: '1.0 Firefly / 1.6 16V' },
  { brand: 'Citroën', model: 'C4 Cactus', year: 2023, engine: '1.6 THP' },
  
  // CAOA CHERY
  { brand: 'Caoa Chery', model: 'Tiggo 5X', year: 2023, engine: '1.5 Turbo' },
  { brand: 'Caoa Chery', model: 'Tiggo 7', year: 2023, engine: '1.5 Turbo' },
  { brand: 'Caoa Chery', model: 'Tiggo 8', year: 2023, engine: '1.6 Turbo' },
  
  // FORD (modelos ainda em circulação)
  { brand: 'Ford', model: 'Ranger', year: 2023, engine: '2.0 Diesel / 3.0 V6 Diesel' },
  
  // MITSUBISHI
  { brand: 'Mitsubishi', model: 'L200 Triton', year: 2023, engine: '2.4 Diesel' },
  { brand: 'Mitsubishi', model: 'Outlander', year: 2023, engine: '2.0 16V / 2.4 16V' },
  
  // MOTOS HONDA
  { brand: 'Honda', model: 'CG 160', year: 2023, engine: '160cc', type: 'moto' },
  { brand: 'Honda', model: 'CB 300R', year: 2023, engine: '300cc', type: 'moto' },
  { brand: 'Honda', model: 'Bros 160', year: 2023, engine: '160cc', type: 'moto' },
  { brand: 'Honda', model: 'PCX 160', year: 2023, engine: '160cc', type: 'moto' },
  
  // MOTOS YAMAHA
  { brand: 'Yamaha', model: 'Fazer 250', year: 2023, engine: '250cc', type: 'moto' },
  { brand: 'Yamaha', model: 'MT-03', year: 2023, engine: '321cc', type: 'moto' },
  { brand: 'Yamaha', model: 'Factor 150', year: 2023, engine: '150cc', type: 'moto' },
  { brand: 'Yamaha', model: 'Crosser 150', year: 2023, engine: '150cc', type: 'moto' },
];

// Checklist de peças por tipo de veículo
const PARTS_CHECKLIST = {
  carro: [
    'Filtro de Óleo',
    'Filtro de Ar do Motor',
    'Filtro de Combustível',
    'Filtro de Cabine (Ar Condicionado)',
    'Vela de Ignição',
    'Bobina de Ignição',
    'Correia Dentada',
    'Tensor da Correia Dentada',
    'Correia Poly-V (Alternador)',
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
    'Óleo do Motor (especificação)'
  ],
  moto: [
    'Filtro de Óleo',
    'Filtro de Ar',
    'Vela de Ignição',
    'Corrente de Transmissão',
    'Kit Relação (Coroa e Pinhão)',
    'Pastilha de Freio Dianteira',
    'Pastilha de Freio Traseira',
    'Disco de Freio Dianteiro',
    'Pneu Dianteiro',
    'Pneu Traseiro',
    'Bateria',
    'Óleo do Motor (especificação)'
  ]
};

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadProgress() {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
    }
  } catch (e) {}
  return { processedVehicles: [], validatedParts: [], lastRun: null };
}

function saveProgress(progress) {
  const dir = path.dirname(PROGRESS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function loadValidatedParts() {
  try {
    if (fs.existsSync(OUTPUT_FILE)) {
      return JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
    }
  } catch (e) {}
  return { vehicles: [], totalParts: 0, lastUpdate: null };
}

function saveValidatedParts(data) {
  const dir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
}

// ============================================================================
// GEMINI API
// ============================================================================

async function callGemini(prompt, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { 
            temperature: 0.1, 
            maxOutputTokens: 8192,
            topP: 0.8,
            topK: 40
          }
        })
      });
      
      if (response.status === 429) {
        const waitTime = Math.pow(2, attempt) * 10000; // Backoff mais agressivo
        console.log(`${c.yellow}⏳ Rate limit, aguardando ${waitTime/1000}s (tentativa ${attempt}/${retries})${c.reset}`);
        await sleep(waitTime);
        continue;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Extrair JSON da resposta
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.log(`${c.dim}Resposta sem JSON:${c.reset}`, text.substring(0, 200));
        throw new Error('JSON não encontrado na resposta');
      }
      
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      return JSON.parse(jsonStr);
      
    } catch (error) {
      if (attempt === retries) throw error;
      const waitTime = attempt * 5000;
      console.log(`${c.yellow}⚠️ Erro: ${error.message}, retry em ${waitTime/1000}s${c.reset}`);
      await sleep(waitTime);
    }
  }
}

// ============================================================================
// GERAÇÃO E VALIDAÇÃO DE PEÇAS
// ============================================================================

async function generatePartsForVehicle(vehicle) {
  const isMoto = vehicle.type === 'moto';
  const checklist = isMoto ? PARTS_CHECKLIST.moto : PARTS_CHECKLIST.carro;
  
  const prompt = `Você é um especialista em peças automotivas do mercado brasileiro.

TAREFA: Gerar lista de peças de reposição com códigos OEM REAIS para:
VEÍCULO: ${vehicle.brand} ${vehicle.model} ${vehicle.year}
MOTOR: ${vehicle.engine}
TIPO: ${isMoto ? 'Motocicleta' : 'Automóvel'}

CHECKLIST DE PEÇAS NECESSÁRIAS:
${checklist.map((p, i) => `${i+1}. ${p}`).join('\n')}

INSTRUÇÕES IMPORTANTES:
1. Use APENAS códigos OEM REAIS que existem nos catálogos oficiais
2. Para cada peça, forneça o código OEM original da montadora
3. Inclua 2-3 equivalentes de marcas conhecidas (MANN, MAHLE, BOSCH, NGK, TRW, GATES, etc.)
4. Se não souber o código exato, use "VERIFICAR" no campo
5. Inclua a fonte/catálogo de onde o código foi obtido

RESPONDA APENAS COM JSON VÁLIDO no formato:
{
  "vehicle": "${vehicle.brand} ${vehicle.model} ${vehicle.year}",
  "engine": "${vehicle.engine}",
  "parts": [
    {
      "name": "Nome da Peça",
      "oemCode": "CÓDIGO-OEM-REAL",
      "oemSource": "Catálogo onde encontrou (ex: FIAT ePER, VW ETKA, etc)",
      "equivalents": [
        {"brand": "MANN", "code": "CÓDIGO-REAL", "source": "MANN Catalog"},
        {"brand": "BOSCH", "code": "CÓDIGO-REAL", "source": "BOSCH Catalog"}
      ],
      "notes": "Observações importantes",
      "confidence": 95
    }
  ]
}

IMPORTANTE: Prefira deixar "VERIFICAR" do que inventar um código falso!`;

  return await callGemini(prompt);
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log(`\n${c.bold}${c.cyan}╔═══════════════════════════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.bold}${c.cyan}║     TORQ - Construtor de Base de Peças (Gemini AI)            ║${c.reset}`);
  console.log(`${c.bold}${c.cyan}╚═══════════════════════════════════════════════════════════════╝${c.reset}\n`);
  
  // Carregar progresso
  const progress = loadProgress();
  const validatedData = loadValidatedParts();
  
  console.log(`${c.blue}📊 Status atual:${c.reset}`);
  console.log(`   Veículos processados: ${progress.processedVehicles.length}/${VEHICLES_TO_PROCESS.length}`);
  console.log(`   Peças validadas: ${validatedData.totalParts}`);
  console.log(`   Última execução: ${progress.lastRun || 'Nunca'}\n`);
  
  // Encontrar veículos não processados
  const pendingVehicles = VEHICLES_TO_PROCESS.filter(v => 
    !progress.processedVehicles.includes(`${v.brand}_${v.model}_${v.year}`)
  );
  
  if (pendingVehicles.length === 0) {
    console.log(`${c.green}✅ Todos os veículos já foram processados!${c.reset}`);
    console.log(`${c.blue}📄 Dados salvos em: ${OUTPUT_FILE}${c.reset}\n`);
    return;
  }
  
  console.log(`${c.yellow}📋 Veículos pendentes: ${pendingVehicles.length}${c.reset}`);
  console.log(`${c.yellow}🔄 Processando lote de ${Math.min(BATCH_SIZE, pendingVehicles.length)} veículos...${c.reset}\n`);
  
  // Processar lote
  const batch = pendingVehicles.slice(0, BATCH_SIZE);
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < batch.length; i++) {
    const vehicle = batch[i];
    const vehicleKey = `${vehicle.brand}_${vehicle.model}_${vehicle.year}`;
    
    console.log(`\n${c.cyan}[${i+1}/${batch.length}] ${vehicle.brand} ${vehicle.model} ${vehicle.year}${c.reset}`);
    console.log(`${c.dim}   Motor: ${vehicle.engine}${c.reset}`);
    
    try {
      // Gerar peças com Gemini
      console.log(`${c.blue}   🤖 Consultando Gemini AI...${c.reset}`);
      const result = await generatePartsForVehicle(vehicle);
      
      if (result.parts && result.parts.length > 0) {
        // Contar peças válidas (sem "VERIFICAR")
        const validParts = result.parts.filter(p => 
          p.oemCode && !p.oemCode.includes('VERIFICAR')
        );
        
        console.log(`${c.green}   ✅ ${result.parts.length} peças geradas (${validParts.length} com código OEM)${c.reset}`);
        
        // Mostrar algumas peças
        result.parts.slice(0, 3).forEach(part => {
          const status = part.oemCode.includes('VERIFICAR') ? c.yellow + '⚠️' : c.green + '✓';
          console.log(`      ${status} ${part.name}: ${part.oemCode}${c.reset}`);
        });
        if (result.parts.length > 3) {
          console.log(`${c.dim}      ... e mais ${result.parts.length - 3} peças${c.reset}`);
        }
        
        // Salvar no resultado
        validatedData.vehicles.push({
          ...vehicle,
          parts: result.parts,
          processedAt: new Date().toISOString()
        });
        validatedData.totalParts += result.parts.length;
        
        successCount++;
      } else {
        console.log(`${c.yellow}   ⚠️ Nenhuma peça retornada${c.reset}`);
        errorCount++;
      }
      
      // Marcar como processado
      progress.processedVehicles.push(vehicleKey);
      
    } catch (error) {
      console.log(`${c.red}   ❌ Erro: ${error.message}${c.reset}`);
      errorCount++;
      
      // Se for rate limit, parar o lote
      if (error.message.includes('429') || error.message.includes('rate')) {
        console.log(`\n${c.yellow}⚠️ Rate limit atingido. Execute novamente em alguns minutos.${c.reset}`);
        break;
      }
    }
    
    // Salvar progresso após cada veículo
    progress.lastRun = new Date().toISOString();
    saveProgress(progress);
    validatedData.lastUpdate = new Date().toISOString();
    saveValidatedParts(validatedData);
    
    // Delay entre requisições
    if (i < batch.length - 1) {
      console.log(`${c.dim}   ⏳ Aguardando ${DELAY_BETWEEN_REQUESTS/1000}s...${c.reset}`);
      await sleep(DELAY_BETWEEN_REQUESTS);
    }
  }
  
  // Resumo
  console.log(`\n${c.bold}${c.cyan}═══════════════════════════════════════════════════════════════${c.reset}`);
  console.log(`${c.bold}                         RESUMO DO LOTE                         ${c.reset}`);
  console.log(`${c.bold}${c.cyan}═══════════════════════════════════════════════════════════════${c.reset}\n`);
  
  console.log(`${c.green}✅ Sucesso: ${successCount}${c.reset}`);
  console.log(`${c.red}❌ Erros: ${errorCount}${c.reset}`);
  console.log(`${c.blue}📊 Total processado: ${progress.processedVehicles.length}/${VEHICLES_TO_PROCESS.length}${c.reset}`);
  console.log(`${c.blue}📦 Total de peças: ${validatedData.totalParts}${c.reset}`);
  
  const remaining = VEHICLES_TO_PROCESS.length - progress.processedVehicles.length;
  if (remaining > 0) {
    console.log(`\n${c.yellow}⏳ Restam ${remaining} veículos. Execute novamente para continuar.${c.reset}`);
    console.log(`${c.dim}   Comando: node scripts/gemini-parts-builder.cjs${c.reset}`);
  } else {
    console.log(`\n${c.green}🎉 Todos os veículos foram processados!${c.reset}`);
  }
  
  console.log(`\n${c.blue}📄 Progresso salvo em: ${PROGRESS_FILE}${c.reset}`);
  console.log(`${c.blue}📄 Dados salvos em: ${OUTPUT_FILE}${c.reset}\n`);
}

main().catch(err => {
  console.error(`${c.red}Erro fatal: ${err.message}${c.reset}`);
  process.exit(1);
});
