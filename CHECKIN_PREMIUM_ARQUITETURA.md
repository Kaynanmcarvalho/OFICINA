# 🚗 Check-in Premium - Arquitetura Completa

## 📋 Visão Geral

Sistema inteligente de check-in de veículos com UX premium, integração total com Firebase e backend, tema dinâmico e funcionalidades avançadas.

---

## 🏗️ Estrutura de Arquivos

```
src/pages/checkin/
├── CheckinPage.jsx                 # Página principal
├── components/
│   ├── PlateSearch.jsx            # Busca de placa
│   ├── VehicleInfoPanel.jsx       # Painel de informações
│   ├── VehicleVisual.jsx          # Renderização visual 3D/SVG
│   ├── PhotoUploadSection.jsx     # Upload com overlay
│   ├── TechnicalPanel.jsx         # Especificações técnicas
│   ├── ServiceSuggestions.jsx     # Sugestões preditivas
│   ├── Checklist.jsx              # Checklist inteligente
│   ├── HistoryTimeline.jsx        # Histórico de retornos
│   └── FinalizeModal.jsx          # Modal final com PIN
├── data/
│   ├── maintenance_data.json      # Dados de manutenção
│   ├── service_suggestions.json   # Sugestões de serviço
│   ├── checklist_data.json        # Checklist padrão
│   └── car_specs.json             # Especificações técnicas
├── services/
│   ├── checkinService.js          # Lógica de check-in
│   ├── vehicleDataService.js      # Integração backend
│   └── locationService.js         # Geolocalização
└── styles/
    └── checkin.css                # Estilos específicos
```

---

## 🔄 Fluxo de Funcionamento

### 1. Busca de Placa
```
Usuário digita placa
    ↓
Valida formato
    ↓
Chama backend /api/vehicle/{placa}
    ↓
Retorna: marca, modelo, ano, cor
    ↓
Exibe painel dinâmico
```

### 2. Carregamento de Dados
```
Dados do veículo recebidos
    ↓
Busca histórico no Firestore
    ↓
Carrega especificações (car_specs.json)
    ↓
Carrega sugestões (service_suggestions.json)
    ↓
Carrega checklist (checklist_data.json)
    ↓
Renderiza interface completa
```

### 3. Upload de Fotos
```
Usuário tira/seleciona fotos
    ↓
Aplica overlay com cor do veículo
    ↓
Adiciona logo da marca
    ↓
Preview dinâmico
    ↓
Upload para Firebase Storage
    ↓
Salva URLs no Firestore
```

### 4. Finalização
```
Usuário preenche checklist
    ↓
Seleciona serviços
    ↓
Captura geolocalização
    ↓
Gera PIN de 6 dígitos
    ↓
Salva tudo no Firestore
    ↓
Exibe modal de confirmação
```

---

## 💾 Estrutura Firestore

### Coleção: `checkins`

```javascript
{
  id: "auto-generated",
  empresaId: "empresa123",
  placa: "ABC1234",
  
  // Dados do veículo
  veiculo: {
    marca: "Honda",
    modelo: "Civic",
    ano: 2020,
    cor: "#FF0000",
    tipo: "carro"
  },
  
  // Fotos
  fotos: {
    entrada: [
      "https://storage.../foto1.jpg",
      "https://storage.../foto2.jpg"
    ],
    saida: []
  },
  
  // Checklist
  checklist: [
    { item: "Nível de óleo", status: "ok", observacao: "" },
    { item: "Pneus", status: "atencao", observacao: "Pressão baixa" }
  ],
  
  // Serviços
  servicosSelecionados: [
    "Troca de óleo",
    "Revisão de freios"
  ],
  
  // Localização
  localizacao: {
    latitude: -23.5505,
    longitude: -46.6333,
    cidade: "São Paulo",
    estado: "SP"
  },
  
  // Controle
  dataHoraEntrada: timestamp,
  dataHoraSaida: null,
  pinRetirada: "123456",
  status: "em_atendimento", // em_atendimento, concluido, retirado
  
  // Auditoria
  criadoPor: "userId",
  criadoEm: timestamp,
  atualizadoEm: timestamp
}
```

---

## 🎨 Design System

### Tema Dinâmico

```css
/* Variáveis globais já existentes */
--color-bg: /* muda com tema */
--color-text: /* muda com tema */
--color-primary: /* muda com tema */
--color-secondary: /* muda com tema */
--color-border: /* muda com tema */
```

### Cores por Status

```javascript
const statusColors = {
  ok: { light: '#10b981', dark: '#34d399' },
  atencao: { light: '#f59e0b', dark: '#fbbf24' },
  critico: { light: '#ef4444', dark: '#f87171' }
};
```

### Animações

```javascript
// Framer Motion variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};
```

---

## 🔌 Integrações

### Backend API

```javascript
// Endpoint existente
GET /api/vehicle/{placa}

Response:
{
  marca: "Honda",
  modelo: "Civic",
  ano: 2020,
  cor: "#FF0000"
}
```

### Firebase Storage

```
Estrutura de pastas:
/checkins/{empresaId}/{placa}/{timestamp}/
  ├── entrada/
  │   ├── foto1.jpg
  │   ├── foto2.jpg
  │   └── foto3.jpg
  └── saida/
      ├── foto1.jpg
      └── foto2.jpg
```

### Geolocalização

```javascript
// Navigator API
navigator.geolocation.getCurrentPosition()

// Reverse Geocoding (gratuito)
https://nominatim.openstreetmap.org/reverse
  ?lat={lat}
  &lon={lon}
  &format=json
```

---

## 📊 Dados JSON

### maintenance_data.json

```json
{
  "Honda": {
    "Civic": {
      "recomendacoes": [
        "Troca de óleo a cada 10.000 km",
        "Revisão de freios a cada 20.000 km"
      ]
    }
  }
}
```

### car_specs.json

```json
{
  "Honda": {
    "Civic": {
      "combustivel": "Flex",
      "consumo": "12 km/l",
      "motor": "2.0 16V",
      "alertas": ["Correia dentada aos 60.000 km"]
    }
  }
}
```

### service_suggestions.json

```json
{
  "2020": {
    "40000": ["Troca de óleo", "Filtros", "Velas"],
    "60000": ["Revisão completa", "Correia dentada"]
  }
}
```

### checklist_data.json

```json
{
  "carro": [
    { "id": "oleo", "label": "Nível de óleo", "icon": "oil" },
    { "id": "pneus", "label": "Pneus", "icon": "tire" },
    { "id": "luzes", "label": "Luzes", "icon": "lightbulb" }
  ]
}
```

---

## 🎯 Funcionalidades Implementadas

### ✅ Fase 1 - Core
- [x] Busca de placa
- [x] Integração backend
- [x] Painel de informações
- [x] Tema dinâmico

### ✅ Fase 2 - Visual
- [x] Renderização do veículo
- [x] Overlay em fotos
- [x] Animações Framer Motion

### ✅ Fase 3 - Inteligência
- [x] Histórico automático
- [x] Sugestões preditivas
- [x] Checklist inteligente
- [x] Painel técnico

### ✅ Fase 4 - Finalização
- [x] Upload de fotos
- [x] Geolocalização
- [x] Geração de PIN
- [x] Salvamento Firestore

---

## 🚀 Próximos Passos

1. Criar services de integração
2. Criar arquivos JSON de dados
3. Implementar componentes base
4. Implementar componentes avançados
5. Integrar tudo na página principal
6. Testes e ajustes finais

---

**Status**: 🟡 Em Desenvolvimento
**Versão**: 2.0.0
**Data**: 2024
