# 🔧 Parts Compatibility Engine

Motor de compatibilidade de peças automotivas para o sistema TORQ.

## 📊 Cobertura

| Tipo | Quantidade |
|------|------------|
| Carros | 15.669 |
| Motos | 1.669 |
| Caminhões | 452 |
| Ônibus | 206 |
| Vans | 332 |
| SUVs | 1.349 |
| Pickups | 403 |
| **TOTAL** | **20.080+** |

## 📦 Base de Peças

### Categorias Cobertas

| Categoria | Peças | Marcas |
|-----------|-------|--------|
| Filtros de Óleo | 50+ | MANN, TECFIL, FRAM, BOSCH, HIFLOFILTRO |
| Filtros de Ar | 40+ | MANN, TECFIL, FRAM, HIFLOFILTRO, K&N |
| Filtros de Combustível | 20+ | MANN, TECFIL, FRAM |
| Filtros de Cabine | 15+ | MANN, TECFIL, FRAM |
| Pastilhas de Freio | 40+ | COBREQ, FRAS-LE, EBC, VESRAH |
| Discos de Freio | 20+ | FREMAX, HIPPER, NAKATA |
| Velas de Ignição | 30+ | NGK, BOSCH, DENSO |
| Óleos de Motor | 20+ | MOBIL, CASTROL, SHELL, MOTUL, PETRONAS |
| Kit Relação (Motos) | 25+ | VORTEX, DID, RK, COFAP |
| Correias Dentadas | 15+ | CONTITECH, GATES, DAYCO |
| Amortecedores | 20+ | MONROE, COFAP, NAKATA |
| Baterias | 15+ | MOURA, HELIAR, BOSCH, YUASA |
| Bombas d'Água | 25+ | URBA, INDISA |
| Válvulas Termostáticas | 10+ | WAHLER, MTE-THOMSON |
| Alternadores | 30+ | BOSCH, VALEO, DENSO |
| Motores de Arranque | 30+ | BOSCH, VALEO, DENSO, DELCO |
| Coxins do Motor | 15+ | SAMPEL, AXIOS, COFAP |
| Buchas de Suspensão | 15+ | AXIOS, SAMPEL, COFAP |
| Pivôs de Suspensão | 15+ | NAKATA, VIEMAR, PERFECT |
| Terminais de Direção | 15+ | NAKATA, VIEMAR, PERFECT |
| Fluidos | 20+ | BOSCH, MOBIL, CASTROL, PENTOSIN |
| Kits de Embreagem | 25+ | LUK, SACHS, VALEO, EXEDY, AISIN |
| Rolamentos de Roda | 30+ | SKF, FAG, NSK, TIMKEN, ILJIN |
| Juntas Homocinéticas | 25+ | GKN, SKF, NTN, NAKATA |
| Peças de Motos | 60+ | Diversas |
| Peças de Caminhões | 40+ | MANN, FRAS-LE, WABCO, KNORR |
| Peças de Ônibus | 15+ | MANN, FRAS-LE, MONROE |

## 🚀 Instalação

```bash
cd scripts/parts-compatibility-engine
npm install
```

## 📋 Comandos

### Gerar Compatibilidade

```bash
# Todos os veículos
npm run generate

# Apenas motos
npm run generate -- --type=motorcycle

# Apenas carros
npm run generate -- --type=car

# Com tamanho de lote customizado
npm run generate -- --batch=200
```

### Validar Resultados

```bash
# Validação padrão
npm run validate

# Modo estrito (confiança mínima 80%)
npm run validate -- --strict
```

### Exportar para Firebase

```bash
# Exportar índices de compatibilidade
npm run export

# Simular exportação (dry-run)
npm run export -- --dry-run

# Exportar base de peças
npm run export-parts

# Simular exportação de peças
npm run export-parts -- --dry-run
```

### Estatísticas

```bash
# Estatísticas gerais
npm run stats

# Estatísticas da base de peças
npm run parts-stats
```

### Pipeline Completo

```bash
# Executa: generate + validate + export
npm run full
```

## 🏗️ Arquitetura

### 3 Camadas de Matching

1. **Matching Direto (95% confiança)**
   - Fitment tables de fabricantes
   - Part numbers OEM confirmados

2. **Matching Técnico (85% confiança)**
   - Código do motor (EA211, VHCE, etc.)
   - Cilindrada compatível

3. **Matching Heurístico (70% confiança)**
   - Análise de similaridade
   - Cross-reference de aplicações

### Estrutura de Arquivos

```
src/
├── index.js                    # Entry point CLI
├── generateCompatibility.js    # Gerador principal
├── validateCompatibility.js    # Validador
├── exportToFirebase.js         # Exportador de índices
├── exportPartsDatabase.js      # Exportador de peças
├── stats.js                    # Estatísticas
├── config/
│   ├── partNumbers.js          # Base de part numbers
│   ├── partNumbersExtended.js  # Base estendida
│   └── partsChecklist.js       # Checklist por tipo
└── engine/
    └── compatibilityEngine.js  # Motor de matching
```

## 🔥 Estrutura no Firebase

### Índice de Compatibilidade

```
vehicles/{variantId}/compatibilityIndex/current
├── vehicleId
├── vehicleName
├── vehicleType
├── compatibleParts[]
│   ├── partTypeId
│   ├── partTypeName
│   ├── partNumber
│   ├── brand
│   ├── specs
│   ├── equivalents[]
│   ├── matchType
│   ├── confidence
│   └── evidence[]
├── missingParts[]
├── sharedParts[]
├── coverage
└── confidence
```

### Base de Peças

```
partsDatabase/{partNumber}
├── partNumber
├── name
├── category
├── brand
├── applications[]
├── specs
├── equivalents[]
├── position
├── createdAt
└── updatedAt
```

## 🔄 Peças Compartilhadas

O motor identifica automaticamente peças que servem em múltiplos veículos de marcas diferentes, permitindo economia de 15-30%.

**Exemplo:**
- Filtro HF204 serve em: Honda CB300, Kawasaki Ninja 300, Yamaha MT-03, Triumph Street Triple

## 📈 Métricas de Qualidade

- **Cobertura:** % de peças obrigatórias encontradas
- **Confiança:** Média de confiança das peças (mínimo 65%)
- **Validação:** Todas as peças passam por validação antes de exportar

## 🔌 API Backend

O servidor Express em `/server` expõe endpoints REST:

```
GET  /api/parts/compatibility/:vehicleId  - Busca peças compatíveis
GET  /api/parts/search                    - Busca por termo
GET  /api/parts/equivalents/:partNumber   - Busca equivalentes
GET  /api/parts/shared/:partNumber        - Veículos que compartilham peça
GET  /api/parts/categories                - Lista categorias
GET  /api/parts/brands                    - Lista marcas
GET  /api/parts/stats                     - Estatísticas
POST /api/parts/generate-compatibility    - Gera índice (admin)
```

## 📝 Licença

Proprietário - TORQ AI
