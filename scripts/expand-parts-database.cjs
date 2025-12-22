/**
 * TORQ - Expansão do Banco de Dados de Peças com Gemini AI
 * 
 * Este script usa o Gemini AI para gerar peças para veículos que ainda não têm cobertura.
 * Usa rate limiting adequado para evitar erro 429.
 */

const fs = require('fs');
const path = require('path');

// Configuração
const GEMINI_API_KEY = 'AIzaSyDvM51k6E_F6TEuILUK1SSVI9blie8HBKg';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const RATE_LIMIT_MS = 5000; // 5 segundos entre requisições (mais conservador)
const MAX_RETRIES = 5;

// Cores
const c = {
  reset: '\x1b[0m', green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m',
  blue: '\x1b[34m', cyan: '\x1b[36m', bold: '\x1b[1m'
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function callGemini(prompt, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 8192 }
        })
      });
      
      if (response.status === 429) {
        const waitTime = Math.pow(2, attempt) * 5000;
        console.log(`${c.yellow}⏳ Rate limited, aguardando ${waitTime/1000}s (tentativa ${attempt}/${retries})${c.reset}`);
        await sleep(waitTime);
        continue;
      }
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('JSON não encontrado na resposta');
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      if (attempt === retries) throw error;
      console.log(`${c.yellow}⚠️ Erro: ${error.message}, retry em ${attempt * 2}s${c.reset}`);
      await sleep(attempt * 2000);
    }
  }
}

// Veículos para expandir (marcas que precisam de mais cobertura)
const vehiclesToExpand = [
  // Nissan (não tem cobertura)
  { brand: 'Nissan', model: 'Kicks', year: 2023, engine: '1.6 16V' },
  { brand: 'Nissan', model: 'Versa', year: 2023, engine: '1.6 16V' },
  { brand: 'Nissan', model: 'Sentra', year: 2023, engine: '2.0 16V' },
  // Jeep (não tem cobertura)
  { brand: 'Jeep', model: 'Renegade', year: 2023, engine: '1.3 Turbo' },
  { brand: 'Jeep', model: 'Compass', year: 2023, engine: '1.3 Turbo' },
  // Peugeot (não tem cobertura)
  { brand: 'Peugeot', model: '208', year: 2023, engine: '1.0 Firefly' },
  { brand: 'Peugeot', model: '2008', year: 2023, engine: '1.6 THP' },
  // Citroën (não tem cobertura)
  { brand: 'Citroën', model: 'C3', year: 2023, engine: '1.0 Firefly' },
  { brand: 'Citroën', model: 'C4 Cactus', year: 2023, engine: '1.6 THP' },
  // Caoa Chery (não tem cobertura)
  { brand: 'Caoa Chery', model: 'Tiggo 5X', year: 2023, engine: '1.5 Turbo' },
  { brand: 'Caoa Chery', model: 'Tiggo 7', year: 2023, engine: '1.5 Turbo' },
];

async function generatePartsForVehicle(vehicle) {
  const prompt = `Gere uma lista de peças de reposição REAIS para o veículo brasileiro:
${vehicle.brand} ${vehicle.model} ${vehicle.year} motor ${vehicle.engine}

Inclua APENAS peças com códigos OEM REAIS verificados:
1. Filtro de Óleo (código OEM real)
2. Filtro de Ar (código OEM real)
3. Filtro de Combustível (código OEM real)
4. Filtro de Cabine (código OEM real)
5. Vela de Ignição (código OEM real)
6. Pastilha de Freio Dianteira (código OEM real)
7. Correia Dentada ou Corrente (código OEM real)
8. Bomba d'Água (código OEM real)

Para cada peça, inclua equivalentes REAIS de marcas: MANN, MAHLE, BOSCH, NGK, TRW, GATES, SKF.

Responda APENAS com JSON válido no formato:
{
  "vehicle": "${vehicle.brand} ${vehicle.model} ${vehicle.year}",
  "parts": [
    {
      "name": "Filtro de Óleo",
      "category": "FILTRATION",
      "oemCode": "CÓDIGO_OEM_REAL",
      "equivalents": [
        {"brand": "MANN", "code": "CÓDIGO_REAL", "quality": "premium"},
        {"brand": "MAHLE", "code": "CÓDIGO_REAL", "quality": "premium"}
      ]
    }
  ]
}

IMPORTANTE: Use APENAS códigos que existem nos catálogos oficiais!`;

  return await callGemini(prompt);
}

async function main() {
  console.log(`${c.bold}${c.cyan}═══════════════════════════════════════════════════════════════${c.reset}`);
  console.log(`${c.bold}${c.cyan}       TORQ - Expansão do Banco de Dados (Gemini AI)           ${c.reset}`);
  console.log(`${c.bold}${c.cyan}═══════════════════════════════════════════════════════════════${c.reset}\n`);
  
  console.log(`${c.blue}📋 Veículos para expandir: ${vehiclesToExpand.length}${c.reset}`);
  console.log(`${c.blue}⏱️ Rate limit: ${RATE_LIMIT_MS/1000}s entre requisições${c.reset}\n`);
  
  const results = [];
  const errors = [];
  
  for (let i = 0; i < vehiclesToExpand.length; i++) {
    const vehicle = vehiclesToExpand[i];
    console.log(`\n${c.cyan}[${i+1}/${vehiclesToExpand.length}] ${vehicle.brand} ${vehicle.model} ${vehicle.year}${c.reset}`);
    
    try {
      const data = await generatePartsForVehicle(vehicle);
      
      if (data.parts && data.parts.length > 0) {
        console.log(`${c.green}✅ ${data.parts.length} peças geradas${c.reset}`);
        data.parts.forEach(part => {
          console.log(`   ${c.green}✓${c.reset} ${part.name}: ${c.yellow}${part.oemCode}${c.reset}`);
        });
        results.push({ vehicle, parts: data.parts });
      } else {
        console.log(`${c.yellow}⚠️ Nenhuma peça retornada${c.reset}`);
      }
    } catch (error) {
      console.log(`${c.red}❌ Erro: ${error.message}${c.reset}`);
      errors.push({ vehicle, error: error.message });
    }
    
    // Rate limiting
    if (i < vehiclesToExpand.length - 1) {
      console.log(`${c.blue}⏳ Aguardando ${RATE_LIMIT_MS/1000}s...${c.reset}`);
      await sleep(RATE_LIMIT_MS);
    }
  }
  
  // Resumo
  console.log(`\n${c.bold}${c.cyan}═══════════════════════════════════════════════════════════════${c.reset}`);
  console.log(`${c.bold}                         RESUMO                                 ${c.reset}`);
  console.log(`${c.bold}${c.cyan}═══════════════════════════════════════════════════════════════${c.reset}\n`);
  
  const totalParts = results.reduce((sum, r) => sum + r.parts.length, 0);
  console.log(`${c.green}✅ Veículos processados: ${results.length}${c.reset}`);
  console.log(`${c.green}✅ Total de peças geradas: ${totalParts}${c.reset}`);
  console.log(`${c.red}❌ Erros: ${errors.length}${c.reset}`);
  
  // Salvar resultados
  if (results.length > 0) {
    const outputPath = path.join(__dirname, '..', 'reports', 'expanded-parts.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify({ 
      timestamp: new Date().toISOString(),
      totalVehicles: results.length,
      totalParts,
      results 
    }, null, 2));
    console.log(`\n${c.blue}📄 Resultados salvos em: reports/expanded-parts.json${c.reset}`);
  }
  
  console.log(`\n${c.bold}${c.cyan}═══════════════════════════════════════════════════════════════${c.reset}\n`);
}

main().catch(console.error);
