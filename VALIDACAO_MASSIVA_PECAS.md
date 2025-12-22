# TORQ Automotive - Sistema de Validação Massiva de Peças

## Visão Geral

Este sistema valida TODAS as peças para TODOS os 20.000+ veículos da base de dados brasileira usando Google Scraper (NÃO Gemini API).

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR                                  │
│  fullPartsValidationOrchestrator.ts                             │
│  - Coordena todo o processo                                      │
│  - Analisa cobertura atual                                       │
│  - Decide o que validar vs gerar                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│   VALIDAÇÃO EXISTENTE   │     │   GERAÇÃO DE PEÇAS      │
│ massivePartsValidation  │     │ partsGeneratorService   │
│ - Valida peças da base  │     │ - Gera peças novas      │
│ - ~300 peças existentes │     │ - Para veículos sem     │
│ - 9 marcas cobertas     │     │   cobertura             │
└─────────────────────────┘     └─────────────────────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GOOGLE SCRAPER                                │
│  googleScraperValidation.ts (frontend)                          │
│  server/routes/partsValidation.js (backend com Puppeteer)       │
│  - Busca no Google                                               │
│  - Extrai códigos OEM e equivalentes                            │
│  - Valida em fontes confiáveis                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Arquivos Principais

### Serviços de Validação

| Arquivo | Descrição |
|---------|-----------|
| `massivePartsValidation.ts` | Valida peças existentes para todos os veículos |
| `partsGeneratorService.ts` | Gera peças para veículos sem cobertura |
| `fullPartsValidationOrchestrator.ts` | Orquestra todo o processo |
| `googleScraperValidation.ts` | Interface com o scraper do Google |
| `validationUIService.ts` | Serviço para UI com estado e progresso |

### Backend

| Arquivo | Descrição |
|---------|-----------|
| `server/routes/partsValidation.js` | Endpoint de validação com Puppeteer |

### Dados

| Arquivo | Descrição |
|---------|-----------|
| `realPartsDatabase.ts` | ~300 peças REAIS verificadas |
| `brazilianVehiclesComplete.ts` | 20.000+ veículos brasileiros |

## Como Usar

### Via Script (Recomendado para validação completa)

```bash
# Validar todas as marcas (ATENÇÃO: pode levar MUITAS HORAS!)
npx ts-node scripts/run-massive-validation.ts

# Validar apenas uma marca
npx ts-node scripts/run-massive-validation.ts --brand=Hyundai

# Validar com limite de veículos por marca
npx ts-node scripts/run-massive-validation.ts --brand=Fiat --max-vehicles=10

# Pular geração de novas peças (só validar existentes)
npx ts-node scripts/run-massive-validation.ts --skip-generation
```

### Via Código (Frontend)

```typescript
import { 
  startValidation, 
  subscribeToValidationState,
  cancelValidation,
  getStats 
} from '@/services/automotive-backend';

// Ver estatísticas atuais
const stats = getStats();
console.log(`Veículos: ${stats.totalVehicles}`);
console.log(`Peças: ${stats.totalParts}`);
console.log(`Cobertura: ${stats.coveragePercentage}%`);

// Registrar listener de progresso
const unsubscribe = subscribeToValidationState((state) => {
  if (state.progress) {
    console.log(`Progresso: ${state.progress.percentComplete}%`);
    console.log(`Peças validadas: ${state.progress.partsValidated}`);
  }
});

// Iniciar validação
try {
  const result = await startValidation({
    brand: 'Hyundai', // Opcional: filtrar por marca
    skipGeneration: false,
    maxVehiclesPerBrand: 100,
  });
  
  console.log(`Sucesso: ${result.success}`);
  console.log(`Peças validadas: ${result.summary.totalPartsValidated}`);
} catch (error) {
  console.error('Erro:', error);
}

// Cancelar se necessário
cancelValidation();

// Limpar listener
unsubscribe();
```

### Via API Backend

```bash
# Validar uma peça específica
curl -X POST http://localhost:3001/api/parts/validate \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleBrand": "Hyundai",
    "vehicleModel": "Creta",
    "vehicleYear": 2022,
    "partName": "Filtro de Óleo",
    "oemCode": "26300-35503",
    "equivalents": [
      {"brand": "MANN", "code": "W 811/80"},
      {"brand": "FRAM", "code": "PH6811"}
    ]
  }'

# Buscar informações sobre uma peça
curl "http://localhost:3001/api/parts/search?code=26300-35503&vehicle=Hyundai%20Creta"
```

## Cobertura Atual

### Marcas com Peças na Base

| Marca | Modelos | Peças |
|-------|---------|-------|
| HYUNDAI | Creta, HB20 | ~50 |
| FIAT | Argo, Cronos, Mobi, Strada | ~45 |
| VOLKSWAGEN | Polo, Virtus, T-Cross, Nivus, Gol | ~45 |
| CHEVROLET | Onix, Tracker, Spin | ~40 |
| TOYOTA | Corolla, Yaris | ~35 |
| HONDA | Civic, HR-V, City | ~35 |
| RENAULT | Kwid, Sandero, Logan | ~30 |
| HONDA MOTOS | CB 300R, CG 160 | ~15 |
| YAMAHA MOTOS | MT-03, Fazer 250 | ~15 |

### Categorias Cobertas

- Filtração (óleo, ar, combustível, cabine)
- Arrefecimento (bomba d'água, termostato, radiador)
- Ignição (velas, bobinas)
- Motor (correias, tensores, juntas)
- Freios (pastilhas, discos, tambores)
- Suspensão (amortecedores, molas, pivôs)
- Direção (terminais, braços axiais)
- Embreagem (kit completo, atuador)
- Elétrica (alternador, motor partida, sensores)
- Combustível (corpo de borboleta, bicos, bomba)
- Escapamento (catalisador, silencioso)
- Bateria

## Fontes de Validação

O sistema valida peças usando as seguintes fontes confiáveis:

- **Catálogos OEM**: FIAT ePER, VW ETKA, Hyundai Parts, Honda Parts, Toyota EPC
- **Filtros**: MANN, MAHLE, FRAM, TECFIL, WIX
- **Ignição**: NGK, DENSO, BOSCH, CHAMPION
- **Freios**: TRW, FERODO, FREMAX, COBREQ, FRAS-LE
- **Correias**: GATES, CONTINENTAL, DAYCO
- **Suspensão**: MONROE, COFAP, KAYABA, NAKATA
- **Arrefecimento**: SKF, SCHADEK, MTE-THOMSON

## Rate Limiting

Para evitar bloqueio do Google, o sistema implementa:

- **2 segundos** entre validações de peças
- **3 segundos** entre buscas de códigos OEM
- **Agrupamento** de veículos por modelo (peças são compartilhadas entre anos)

## Estimativa de Tempo

| Escopo | Tempo Estimado |
|--------|----------------|
| 1 marca (~500 veículos) | ~30 minutos |
| 10 marcas (~5.000 veículos) | ~5 horas |
| Todas as marcas (~20.000 veículos) | ~20+ horas |

## Resultado da Validação

Após a validação, apenas peças com **100% de confiança** são mantidas:

```typescript
interface ValidatedPart {
  partId: string;
  partName: string;
  category: string;
  oemCode: string;           // Código OEM validado
  manufacturer: string;
  equivalents: {
    brand: string;
    code: string;            // Código equivalente validado
    quality: 'premium' | 'standard' | 'economy';
    validationSources: string[];  // URLs das fontes
  }[];
  validationSources: string[];    // URLs das fontes OEM
  confidenceScore: number;        // 80-100%
}
```

## Próximos Passos

1. **Executar validação por marca** - Começar com marcas mais populares
2. **Expandir base de peças** - Adicionar mais peças para marcas existentes
3. **Gerar peças para novas marcas** - Usar o gerador para marcas sem cobertura
4. **Salvar no Firebase** - Persistir dados validados
5. **Atualização periódica** - Re-validar peças mensalmente

## Troubleshooting

### Erro: "Backend indisponível"

O servidor backend precisa estar rodando:

```bash
cd server
npm install
npm start
```

### Erro: "Puppeteer não encontrado"

Instalar Puppeteer no servidor:

```bash
cd server
npm install puppeteer
```

### Validação muito lenta

- Use filtro de marca: `--brand=Hyundai`
- Limite veículos: `--max-vehicles=50`
- Pule geração: `--skip-generation`

### Muitas peças inválidas

- Verifique se o backend está funcionando
- Verifique conexão com internet
- Alguns códigos podem estar desatualizados
