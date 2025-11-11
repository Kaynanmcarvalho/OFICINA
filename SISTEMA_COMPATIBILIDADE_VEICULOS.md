# 🚗 Sistema Inteligente de Compatibilidade de Peças por Veículo

## 📋 Visão Geral

Sistema premium de compatibilidade automotiva 100% gratuito, integrado ao SaaS de gestão, utilizando dados públicos, Firebase Firestore e UX nível Apple.

---

## ✅ Status da Implementação

### Fase 1: Fundação (✅ CONCLUÍDO)
- ✅ Service FIPE API (gratuita)
- ✅ Service de Compatibilidade
- ✅ Cálculo de Confidence Score
- ✅ Integração com Firestore

### Fase 2: Interface Premium (✅ CONCLUÍDO)
- ✅ VehicleSelector Component
- ✅ CompatiblePartsList Component
- ✅ EvidenceModal Component
- ✅ VehicleCompatibilitySearch (Integrado)
- ✅ Substituir botão "Buscar por Veículo"
- ✅ Animações Framer Motion
- ✅ Glass Effect e Design Premium

### Fase 3: Scripts de Automação (✅ CONCLUÍDO)
- ✅ Script de População FIPE
- ✅ Script de Dados de Exemplo
- ✅ Índices Firestore
- ✅ Guia de Instalação

### Fase 4: Automação Avançada (⏳ PLANEJADO)
- ⏳ Cloud Functions para ETL
- ⏳ Scraping de Marketplaces
- ⏳ Extração de PDFs OEM
- ⏳ Análise de Fóruns
- ⏳ Sistema de Co-Purchase Automático

---

## 🗄️ Estrutura Firestore

### Coleção: `/vehicles`
```javascript
{
  id: "auto-generated",
  marca: "Honda",
  modelo: "CG 160 Titan",
  anoInicio: 2015,
  anoFim: 2024,
  tipo: "moto", // carro | moto | caminhao
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Coleção: `/parts`
```javascript
{
  id: "auto-generated",
  nome: "Filtro de Óleo",
  categoria: "Filtros",
  fabricante: "Mann Filter",
  codigosOE: ["HF303", "15410-MCJ-505"],
  imagemURL: "https://...",
  createdAt: timestamp
}
```

### Coleção: `/compatibility`
```javascript
{
  id: "auto-generated",
  partId: "ref-to-parts",
  vehicleId: "ref-to-vehicles",
  anoInicio: 2015,
  anoFim: 2024,
  fonte: "OEM", // OEM | Marketplace | Forum | CoPurchase
  evidencias: [
    {
      tipo: "OEM",
      descricao: "Catálogo oficial Honda 2024",
      url: "https://...",
      data: "2024-01-15"
    }
  ],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 🎯 Lógica de Confidence Score

### Pesos por Fonte
```javascript
const SOURCE_WEIGHTS = {
  OEM: 50,          // Catálogo oficial do fabricante
  Marketplace: 30,  // Mercado Livre, OLX, etc
  Forum: 15,        // Fóruns e clubes automotivos
  CoPurchase: 10    // Histórico de vendas do sistema
}
```

### Categorização
- **Alta (≥80)**: Verde - Múltiplas fontes confiáveis
- **Média (50-79)**: Amarelo - Fontes moderadas
- **Baixa (<50)**: Vermelho - Poucas evidências

---

## 🔌 API FIPE (Gratuita)

### Base URL
```
https://parallelum.com.br/fipe/api/v1/
```

### Endpoints Implementados
1. `GET /{tipo}/marcas` - Lista marcas
2. `GET /{tipo}/marcas/{id}/modelos` - Lista modelos
3. `GET /{tipo}/marcas/{id}/modelos/{id}/anos` - Lista anos
4. `GET /{tipo}/marcas/{id}/modelos/{id}/anos/{ano}` - Detalhes

Tipos: `carros`, `motos`, `caminhoes`

---

## 🎨 Componentes Premium (A Implementar)

### 1. VehicleSelector.jsx
**Localização**: `src/components/inventory/VehicleSelector.jsx`

**Funcionalidades**:
- Seleção encadeada: Tipo → Marca → Modelo → Ano
- Autocomplete com busca
- Ícones SVG por marca
- Animações Framer Motion
- Cache com TanStack Query

**Props**:
```javascript
{
  onVehicleSelect: (vehicle) => void,
  initialValue?: object,
  disabled?: boolean
}
```

### 2. CompatiblePartsList.jsx
**Localização**: `src/components/inventory/CompatiblePartsList.jsx`

**Funcionalidades**:
- Cards com imagem da peça
- Badge de confiança (Alta/Média/Baixa)
- Ordenação por confidence score
- Filtro "Apenas OEM"
- Botão "Ver detalhes"

**Props**:
```javascript
{
  vehicleId: string,
  ano: number,
  onPartSelect?: (part) => void
}
```

### 3. EvidenceModal.jsx
**Localização**: `src/components/inventory/EvidenceModal.jsx`

**Funcionalidades**:
- Lista de fontes com ícones
- Links para PDFs/marketplaces
- Timeline de evidências
- Indicador de última atualização
- Glass effect background

**Props**:
```javascript
{
  isOpen: boolean,
  onClose: () => void,
  compatibility: object
}
```

---

## 🤖 Automação de Dados (Cloud Functions)

### Função 1: updateCompatibilityFromFIPE
**Trigger**: HTTP ou Scheduled
**Objetivo**: Popular `/vehicles` com dados da FIPE

```javascript
// Pseudo-código
async function updateFromFIPE() {
  for (tipo of ['carros', 'motos', 'caminhoes']) {
    const marcas = await fetchBrands(tipo);
    for (marca of marcas) {
      const modelos = await fetchModels(tipo, marca.codigo);
      for (modelo of modelos) {
        await saveVehicleToFirestore({
          marca: marca.nome,
          modelo: modelo.nome,
          tipo
        });
      }
    }
  }
}
```

### Função 2: updateCompatibilityFromMarketplaces
**Trigger**: Scheduled (semanal)
**Objetivo**: Scraping de anúncios

```javascript
// Usar Playwright ou Puppeteer
async function scrapeMarketplace() {
  const anuncios = await scrape('mercadolivre.com.br', 'filtro de óleo celta');
  for (anuncio of anuncios) {
    const anos = extractYears(anuncio.titulo); // Regex
    await addCompatibilityEvidence(partId, vehicleId, {
      fonte: 'Marketplace',
      evidencias: [{
        tipo: 'Marketplace',
        descricao: anuncio.titulo,
        url: anuncio.link
      }]
    });
  }
}
```

### Função 3: updateCompatibilityFromPDFs
**Trigger**: Manual ou Scheduled
**Objetivo**: Extrair dados de catálogos OEM

```python
# Python com pdfminer.six
import pdfminer
import re

def extract_from_pdf(pdf_url):
    text = extract_text(pdf_url)
    matches = re.findall(r'CG 160.*?(\d{4})-(\d{4})', text)
    for match in matches:
        save_to_firestore({
            'fonte': 'OEM',
            'anoInicio': match[0],
            'anoFim': match[1]
        })
```

### Função 4: registerSaleCompatibility
**Trigger**: onCreate em `/sales`
**Objetivo**: Registrar co-purchase

```javascript
exports.onSaleCreated = functions.firestore
  .document('sales/{saleId}')
  .onCreate(async (snap, context) => {
    const sale = snap.data();
    if (sale.vehicleId && sale.items) {
      for (item of sale.items) {
        await registerCoPurchase(item.partId, sale.vehicleId);
      }
    }
  });
```

---

## 🎨 Design System

### Cores de Confiança
```css
--confidence-high: #10b981 (green-500)
--confidence-medium: #f59e0b (yellow-500)
--confidence-low: #ef4444 (red-500)
```

### Animações
- Entrada: `fadeInUp` (Framer Motion)
- Transição: `ease-out, 300ms`
- Hover: `scale(1.02)`

### Ícones
- Fonte: SVGRepo (gratuito)
- Tamanho: 24x24px (padrão)
- Cor: Dinâmica por tema

---

## 📊 Métricas de Sucesso

1. **Cobertura**: % de veículos com compatibilidades
2. **Confiança Média**: Score médio das compatibilidades
3. **Fontes**: Distribuição OEM vs Marketplace vs Forum
4. **Uso**: Buscas por dia
5. **Conversão**: Vendas originadas por busca de compatibilidade

---

## 🚀 Próximos Passos

### Imediato (Esta Sessão)
1. Criar VehicleSelector component
2. Integrar com modal existente
3. Testar busca FIPE

### Curto Prazo (Próxima Sessão)
1. Criar CompatiblePartsList
2. Criar EvidenceModal
3. Implementar cache com TanStack Query

### Médio Prazo
1. Deploy Cloud Functions
2. Scraping inicial de marketplaces
3. Popular base com 1000+ compatibilidades

### Longo Prazo
1. Machine Learning para sugestões
2. API pública para parceiros
3. App mobile

---

## 📝 Notas Técnicas

### Performance
- Cache FIPE: 24h (TanStack Query)
- Índices Firestore: `vehicleId`, `partId`, `confidenceScore`
- Lazy loading de imagens

### Segurança
- Firestore Rules: Read público, Write autenticado
- Rate limiting nas Cloud Functions
- Sanitização de dados de scraping

### Escalabilidade
- Sharding por tipo de veículo
- CDN para imagens
- Background jobs para ETL

---

## 🔗 Recursos

- [API FIPE](https://deividfortuna.github.io/fipe/)
- [SVGRepo](https://www.svgrepo.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [TanStack Query](https://tanstack.com/query)
- [Playwright](https://playwright.dev/)

---

**Última Atualização**: 2024
**Status**: Em Desenvolvimento Ativo
**Versão**: 1.0.0-alpha
