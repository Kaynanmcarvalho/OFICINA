/**
 * TORQ Automotive - Servidor de Validação de Peças (Gemini AI)
 * @version 2.1.0 - Com retry e rate limiting
 */

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Gemini API
const GEMINI_API_KEY = 'AIzaSyDvM51k6E_F6TEuILUK1SSVI9blie8HBKg';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 segundos entre requisições

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callGemini(prompt, retries = 3) {
  // Rate limiting
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await sleep(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
  }
  lastRequestTime = Date.now();

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 4096 }
        })
      });
      
      if (response.status === 429) {
        const waitTime = Math.pow(2, attempt) * 2000; // Exponential backoff
        console.log(`[Gemini] Rate limited, aguardando ${waitTime/1000}s (tentativa ${attempt}/${retries})`);
        await sleep(waitTime);
        continue;
      }
      
      if (!response.ok) {
        throw new Error(`Gemini error: ${response.status}`);
      }
      
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Invalid JSON response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      if (attempt === retries) throw error;
      const waitTime = Math.pow(2, attempt) * 1000;
      console.log(`[Gemini] Erro, retry em ${waitTime/1000}s: ${error.message}`);
      await sleep(waitTime);
    }
  }
}

// Validate part
app.post('/api/parts/validate', async (req, res) => {
  try {
    const r = req.body;
    console.log(`[Validate] ${r.vehicleBrand} ${r.vehicleModel} - ${r.partName} (${r.oemCode})`);
    
    const prompt = `Valide esta peça automotiva brasileira:
VEÍCULO: ${r.vehicleBrand} ${r.vehicleModel} ${r.vehicleYear}
PEÇA: ${r.partName}
CÓDIGO OEM: ${r.oemCode}
EQUIVALENTES: ${r.equivalents?.map(e => `${e.brand}: ${e.code}`).join(', ') || 'Nenhum'}

Responda APENAS com JSON válido (sem markdown):
{"oemCodeValid":true,"oemCodeCorrect":"${r.oemCode}","oemSource":"catálogo OEM","equivalentsValidation":[{"brand":"MANN","code":"W 811/80","isValid":true,"source":"MANN Filter"}],"suggestedEquivalents":[],"confidence":0.9}

Use APENAS códigos REAIS de catálogos: FIAT ePER, VW ETKA, Hyundai Parts, MANN, MAHLE, BOSCH, NGK, TRW, GATES, SKF.`;

    const result = await callGemini(prompt);
    
    const validEq = (result.equivalentsValidation || []).filter(e => e.isValid).map(e => ({
      brand: e.brand, code: e.code, sources: [e.source || 'Gemini']
    }));
    
    const invalidEq = (result.equivalentsValidation || []).filter(e => !e.isValid).map(e => ({
      brand: e.brand, code: e.code, reason: e.correctCode ? `Correto: ${e.correctCode}` : 'Não validado'
    }));
    
    const response = {
      isValid: result.oemCodeValid && invalidEq.length === 0,
      oemCodeValid: result.oemCodeValid,
      oemCodeSources: result.oemSource ? [result.oemSource] : ['Gemini'],
      validEquivalents: validEq,
      invalidEquivalents: invalidEq,
      suggestedCorrections: result.suggestedEquivalents || [],
      confidence: result.confidence || 0.8,
      timestamp: new Date().toISOString()
    };
    
    console.log(`[Validate] ${response.isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO'} (${(response.confidence*100).toFixed(0)}%)`);
    res.json(response);
    
  } catch (error) {
    console.error('[Validate] Error:', error.message);
    res.status(500).json({ error: error.message, isValid: false, confidence: 0 });
  }
});

// Batch validate
app.post('/api/parts/validate-batch', async (req, res) => {
  try {
    const { parts } = req.body;
    if (!Array.isArray(parts)) return res.status(400).json({ error: 'parts array required' });
    
    console.log(`[Batch] Validando ${parts.length} peças...`);
    const results = [];
    
    for (let i = 0; i < parts.length; i++) {
      try {
        const r = parts[i];
        console.log(`[Batch] ${i+1}/${parts.length}: ${r.partName}`);
        
        const prompt = `Valide: ${r.vehicleBrand} ${r.vehicleModel} - ${r.partName} (OEM: ${r.oemCode})
Equivalentes: ${r.equivalents?.map(e => `${e.brand}:${e.code}`).join(', ')}
Responda APENAS JSON: {"oemCodeValid":true,"equivalentsValidation":[{"brand":"X","code":"Y","isValid":true}],"confidence":0.9}`;

        const result = await callGemini(prompt);
        results.push({
          partId: r.partId || `part_${i}`,
          partName: r.partName,
          isValid: result.oemCodeValid,
          confidence: result.confidence || 0.8,
          equivalentsValidation: result.equivalentsValidation
        });
      } catch (e) {
        results.push({ partId: `part_${i}`, partName: parts[i].partName, isValid: false, error: e.message });
      }
    }
    
    res.json({
      total: parts.length,
      valid: results.filter(r => r.isValid).length,
      invalid: results.filter(r => !r.isValid).length,
      results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate parts for vehicle
app.post('/api/parts/generate', async (req, res) => {
  try {
    const { vehicleBrand, vehicleModel, vehicleYear, vehicleEngine } = req.body;
    console.log(`[Generate] ${vehicleBrand} ${vehicleModel} ${vehicleYear}`);
    
    const prompt = `Gere lista de peças de reposição para ${vehicleBrand} ${vehicleModel} ${vehicleYear}${vehicleEngine ? ` motor ${vehicleEngine}` : ''}.

Inclua: Filtros (óleo, ar, combustível, cabine), Velas, Correias, Pastilhas de freio.

Responda APENAS JSON válido:
{"parts":[{"name":"Filtro de Óleo","category":"Filtros","oemCode":"CÓDIGO_REAL","equivalents":[{"brand":"MANN","code":"CÓDIGO_REAL","quality":"premium"}]}]}

APENAS códigos OEM e equivalentes REAIS!`;

    const result = await callGemini(prompt);
    console.log(`[Generate] ${result.parts?.length || 0} peças geradas`);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search part
app.get('/api/parts/search', async (req, res) => {
  try {
    const { code, brand, vehicle } = req.query;
    const prompt = `Informações da peça ${code}${brand ? ` marca ${brand}` : ''}${vehicle ? ` para ${vehicle}` : ''}.
Responda APENAS JSON: {"found":true,"partName":"X","applications":["veículos"],"equivalents":[{"brand":"X","code":"Y"}]}`;
    
    const result = await callGemini(prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok', engine: 'Gemini AI' }));

const PORT = 3001;
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('       TORQ Automotive - Validação de Peças (Gemini AI)        ');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`🚀 Porta ${PORT} | 🤖 Gemini AI | ⏱️ Rate limit: ${MIN_REQUEST_INTERVAL}ms`);
  console.log('POST /api/parts/validate | /api/parts/validate-batch | /api/parts/generate');
  console.log('═══════════════════════════════════════════════════════════════');
});
