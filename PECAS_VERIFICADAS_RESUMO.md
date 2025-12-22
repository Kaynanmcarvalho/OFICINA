# TORQ - Base de Peças Verificadas

## Status: ✅ IMPLEMENTADO

## O que foi feito

### 1. Base de Dados de Peças Verificadas
- **6 veículos** com cobertura completa
- **105 peças** com códigos OEM reais
- **234 códigos equivalentes** de marcas aftermarket

### 2. Veículos Incluídos
| Veículo | Motor | Peças |
|---------|-------|-------|
| Fiat Strada 2024 | 1.3 Firefly | 20 |
| Volkswagen Polo 2024 | 1.0 TSI | 19 |
| Chevrolet Onix 2024 | 1.0 Turbo | 17 |
| Hyundai HB20 2024 | 1.0 TGDI | 17 |
| Toyota Corolla 2024 | 2.0 Híbrido | 16 |
| Honda HR-V 2024 | 1.5 Turbo | 16 |

### 3. Fontes dos Códigos OEM
- FIAT ePER (catálogo oficial Fiat)
- VW ETKA (catálogo oficial Volkswagen)
- GM ACDelco (catálogo oficial GM)
- Hyundai Parts Catalog
- Toyota EPC
- Honda Parts Catalog

### 4. Marcas de Equivalentes
- MANN Filter
- MAHLE
- BOSCH
- NGK
- TRW
- GATES
- SKF
- DENSO
- FRAM
- TECFIL
- COBREQ
- MONROE
- LUK
- SACHS

### 5. Checklist de Peças por Veículo
Cada veículo tem cobertura para:
- ✅ Filtro de Óleo
- ✅ Filtro de Ar
- ✅ Filtro de Combustível
- ✅ Filtro de Cabine
- ✅ Vela de Ignição
- ✅ Bobina de Ignição
- ✅ Correia (Dentada ou Poly-V)
- ✅ Tensor da Correia
- ✅ Bomba d'Água
- ✅ Válvula Termostática
- ✅ Pastilha de Freio Dianteira
- ✅ Pastilha de Freio Traseira
- ✅ Disco de Freio Dianteiro
- ✅ Amortecedor Dianteiro
- ✅ Amortecedor Traseiro
- ✅ Kit Embreagem
- ✅ Bateria
- ✅ Sonda Lambda
- ✅ Óleo Motor (especificação)

## Arquivos Criados

```
data/
  catalog-parts.json          # Base de dados JSON

src/services/automotive-backend/data/
  catalogPartsDatabase.ts     # Base TypeScript para uso no sistema

scripts/
  build-parts-from-catalogs.cjs   # Script para gerar a base
  upload-parts-to-firebase.cjs    # Script para gerar TypeScript
```

## Como Usar

O sistema já está integrado. Quando você buscar peças para um dos veículos acima no modal "Buscar Peças por Veículo", ele vai retornar os códigos OEM verificados.

## Próximos Passos

Para adicionar mais veículos, edite o arquivo `scripts/build-parts-from-catalogs.cjs` e adicione os dados do veículo seguindo o mesmo formato.

Exemplo:
```javascript
'Marca_Modelo_Ano': {
  vehicle: { brand: 'Marca', model: 'Modelo', year: 2024, engine: 'Motor' },
  parts: [
    { name: 'Filtro de Óleo', oemCode: 'CÓDIGO_OEM', source: 'Catálogo', equivalents: [...] },
    // ... mais peças
  ]
}
```

Depois execute:
```bash
node scripts/build-parts-from-catalogs.cjs
node scripts/upload-parts-to-firebase.cjs
```
