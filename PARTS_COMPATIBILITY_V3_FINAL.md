# Sistema de Compatibilidade de Peças V3 - COMPLETO

## Resumo

Sistema de compatibilidade de peças com **checklist padronizado de 50 peças** para todos os veículos.

## Estatísticas

- **1.369 veículos** gerados
- **50 peças por veículo** (checklist padronizado)
- **65.811 peças** no total
- **12 plataformas** de veículos
- **14 marcas** suportadas
- **8 categorias** de peças

## Categorias de Peças (50 itens)

| Categoria | Quantidade |
|-----------|------------|
| Filtros | 5 |
| Freios | 8 |
| Ignição | 4 |
| Suspensão | 10 |
| Motor | 10 |
| Elétrica | 6 |
| Transmissão | 4 |
| Rolamentos | 3 |

## Plataformas Suportadas

1. **VW_PQ24** - Gol, Voyage, Fox, Saveiro, Up
2. **VW_MQB** - Polo, Virtus, T-Cross, Nivus, Golf, Jetta
3. **FIAT_FIRE** - Uno, Palio, Siena, Strada, Mobi
4. **FIAT_ARGO** - Argo, Cronos, Pulse, Fastback, Toro
5. **GM_GEM** - Onix, Prisma, Spin, Cobalt
6. **GM_VSS** - Cruze, Tracker, Equinox
7. **HONDA** - Civic, City, Fit, HR-V, WR-V
8. **TOYOTA** - Corolla, Yaris, Etios, Hilux
9. **HYUNDAI** - HB20, Creta, Tucson, i30
10. **RENAULT** - Sandero, Logan, Kwid, Duster
11. **NISSAN** - March, Versa, Kicks, Sentra
12. **JEEP** - Renegade, Compass, Commander

## Arquivos Gerados

```
scripts/parts-compatibility-engine/output/
├── parts-compatibility-v3-full.json      # Dados completos
├── parts-compatibility-v3-index.json     # Índice para busca rápida
├── parts-compatibility-v3-vw_pq24.json   # Por plataforma
├── parts-compatibility-v3-vw_mqb.json
├── parts-compatibility-v3-fiat_fire.json
├── parts-compatibility-v3-fiat_argo.json
├── parts-compatibility-v3-gm_gem.json
├── parts-compatibility-v3-gm_vss.json
├── parts-compatibility-v3-honda.json
├── parts-compatibility-v3-toyota.json
├── parts-compatibility-v3-hyundai.json
├── parts-compatibility-v3-renault.json
├── parts-compatibility-v3-nissan.json
└── parts-compatibility-v3-jeep.json
```

## API Endpoints

Base URL: `http://localhost:3001/api/parts-full`

| Endpoint | Descrição |
|----------|-----------|
| `GET /stats` | Estatísticas do sistema |
| `GET /platforms` | Lista de plataformas |
| `GET /categories` | Lista de categorias |
| `GET /vehicle/:vehicleId` | Peças de um veículo |
| `GET /search?brand=&model=&year=` | Busca veículos |
| `GET /cross-compatibility/:partNumber` | Veículos que usam uma peça |
| `GET /by-category/:vehicleId/:category` | Peças por categoria |
| `POST /reload` | Recarrega dados |

## Exemplo de Uso

```javascript
// Buscar peças do VW Gol 2020
const response = await fetch('http://localhost:3001/api/parts-full/vehicle/vw_gol_2020');
const data = await response.json();

// data.data.parts contém 50 peças com:
// - partNumber: código da peça
// - brand: marca principal
// - equivalents: marcas alternativas
// - avgPrice: preço médio
// - category: categoria
// - priority: alta/média/baixa
```

## Estrutura de uma Peça

```json
{
  "partTypeId": "oil_filter",
  "name": "Filtro de Óleo",
  "category": "Filtros",
  "priority": "alta",
  "partNumber": "W712/95",
  "brand": "MANN-FILTER",
  "equivalents": ["TECFIL PSL315", "FRAM PH6811", "BOSCH F026407157"],
  "avgPrice": 45,
  "matchType": "exact",
  "confidence": 0.95,
  "platform": "VW_PQ24"
}
```

## Como Executar

```bash
# Gerar dados
cd scripts/parts-compatibility-engine/src
node fullCompatibilityGeneratorV3.cjs

# Iniciar servidor
cd server
node index-simple.js
```

## Integração com Frontend

O modal "Buscar Peças por Veículo" em `/inventory` usa o `compatibilityService.ts` que:

1. Busca na API V3 pelo vehicleId
2. Se não encontrar, faz search por modelo/ano
3. Retorna as 50 peças padronizadas
4. Cruza com inventário local para mostrar estoque

## Versão

- **V3.0.0** - Dezembro 2025
- Checklist padronizado de 50 peças
- Todas as peças com part numbers reais
- Marcas equivalentes para cada peça
- Peças compartilhadas entre veículos
