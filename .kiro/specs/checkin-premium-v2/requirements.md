# Requisitos - Check-in Premium V2

## Contexto
Sistema Torq - SaaS automotivo para oficinas mecânicas
- Stack: React + Vite + Node + Python + Firebase (Firestore + Storage)
- Fluxo atual: Check-in/Check-out com orçamentos e fotos funcionando
- Backend: Retorna marca, modelo, ano e cor automaticamente via placa

## Objetivo
Melhorar a aba /checkin mantendo 100% do fluxo atual, adicionando funcionalidades premium com design Apple-like.

## Regras Obrigatórias
1. ✅ Usar dados reais do Firebase (Firestore + Storage) - ZERO mocks
2. ✅ Adaptar automaticamente ao tema claro/escuro
3. ✅ Manter fluxo atual 100% funcional
4. ✅ Interface Apple-like premium minimalista
5. ✅ Código limpo, modular, com animações suaves
6. ✅ Performance e profundidade visual (glassmorphism)

## Funcionalidades a Implementar

### 1. Timeline Inteligente do Veículo
**Descrição:** Exibir graficamente o progresso do atendimento
**Estágios:**
- Check-in
- Diagnóstico
- Orçamento
- Execução
- Finalização
- Check-out

**Requisitos:**
- Atualização automática em tempo real via Firebase
- Cliques nos estágios mostram detalhes
- Animações suaves entre transições
- Indicador visual do estágio atual

**Dados Firebase:**
```javascript
{
  vehicleId: string,
  currentStage: string,
  stages: {
    checkin: { completed: boolean, timestamp: Date, user: string },
    diagnostico: { completed: boolean, timestamp: Date, notes: string },
    orcamento: { completed: boolean, timestamp: Date, budgetId: string },
    execucao: { completed: boolean, timestamp: Date, services: [] },
    finalizacao: { completed: boolean, timestamp: Date },
    checkout: { completed: boolean, timestamp: Date, pin: string }
  }
}
```

### 2. Resumo Inteligente do Veículo
**Descrição:** Exibir resumo elegante após consulta de placa
**Informações:**
- Marca, modelo, ano, cor (do backend)
- Histórico de visitas anteriores (Firebase)
- Última visita (data)
- Total de visitas
- Serviços mais frequentes

**Requisitos:**
- Aparecer automaticamente após consulta
- Design card premium com glassmorphism
- Animação de entrada suave
- Ícones representativos

**Query Firebase:**
```javascript
// Buscar histórico do veículo
const vehicleHistory = await getDocs(
  query(
    collection(db, 'checkins'),
    where('vehiclePlate', '==', plate),
    orderBy('createdAt', 'desc'),
    limit(10)
  )
);
```

### 3. Histórico Visual de Visitas
**Descrição:** Mini cards com últimas passagens do veículo
**Informações por card:**
- Data da visita
- Foto de entrada (thumbnail)
- Status (concluído/em andamento)
- Serviços realizados
- Valor total

**Requisitos:**
- Modo compacto (3-4 cards visíveis)
- Clique expande detalhes completos
- Scroll horizontal suave
- Lazy loading de imagens

**Estrutura:**
```javascript
{
  id: string,
  date: Date,
  entryPhoto: string, // Firebase Storage URL
  status: 'completed' | 'in_progress' | 'cancelled',
  services: string[],
  totalValue: number,
  duration: number // em horas
}
```

### 6. Dashboard Operacional em Tempo Real
**Descrição:** Exibir quantos veículos em cada etapa
**Métricas:**
- Em reparo
- Aguardando orçamento
- Prontos para retirada
- Entregues hoje
- Total em atendimento

**Requisitos:**
- Atualização automática via Firestore realtime
- Cards com números grandes e ícones
- Gráfico de pizza/barras (Recharts)
- Filtros por período

**Listener Firebase:**
```javascript
const unsubscribe = onSnapshot(
  query(collection(db, 'checkins'), where('status', '!=', 'completed')),
  (snapshot) => {
    // Atualizar dashboard em tempo real
  }
);
```

### 8. Sugestão Automática de Orçamento
**Descrição:** Sugerir serviços baseado em histórico
**Lógica:**
- Última troca de óleo há X dias → Sugerir troca
- Revisão periódica vencida → Sugerir revisão
- Serviços recorrentes → Sugerir manutenção preventiva

**Requisitos:**
- Modal discreto após check-in
- Lista de sugestões com justificativa
- Botões: "Adicionar" ou "Ignorar"
- Salvar preferências do usuário

**Cálculo:**
```javascript
const lastOilChange = history.find(h => 
  h.services.includes('Troca de óleo')
);
const daysSince = (Date.now() - lastOilChange.date) / (1000 * 60 * 60 * 24);
if (daysSince > 90) {
  suggestions.push({
    service: 'Troca de óleo',
    reason: `Última troca há ${Math.floor(daysSince)} dias`,
    priority: 'high'
  });
}
```

### 9. Sistema de PIN de Retirada
**Descrição:** PIN único para validar check-out
**Fluxo:**
1. Gerar PIN aleatório no check-in (4-6 dígitos)
2. Armazenar no Firebase
3. Exibir PIN para o cliente (print/SMS)
4. Validar PIN no check-out

**Requisitos:**
- Campo com feedback visual (verde/vermelho)
- Microanimações ao digitar
- Shake animation se PIN incorreto
- Máximo 3 tentativas

**Estrutura:**
```javascript
{
  checkinId: string,
  pin: string, // Criptografado
  generatedAt: Date,
  attempts: number,
  validated: boolean,
  validatedAt: Date
}
```

### 13. Visualização 3D/Panorâmica das Fotos
**Descrição:** Visualização premium das fotos do veículo
**Funcionalidades:**
- Zoom suave (react-zoom-pan-pinch)
- Rotação 360° se múltiplas fotos
- Navegação por setas/swipe
- Fullscreen mode
- Comparação entrada/saída

**Requisitos:**
- Carregar imagens do Firebase Storage
- Lazy loading e cache
- Transições suaves
- Indicador de carregamento elegante

**Componente:**
```jsx
<PhotoViewer
  photos={entryPhotos}
  comparisonPhotos={exitPhotos}
  mode="panoramic"
  enableZoom
  enableRotation
/>
```

## Stack Técnica

### Frontend
- React 18 + Vite
- Tailwind CSS
- Framer Motion (animações)
- Shadcn/UI (componentes)
- Recharts (gráficos)
- react-zoom-pan-pinch (fotos)
- lucide-react (ícones)

### Backend/Banco
- Firebase Firestore (dados)
- Firebase Storage (fotos)
- Firebase Realtime (updates)
- Node/Python (mantido)

### Design System
- Tipografia: Inter, Plus Jakarta Sans
- Cores: Tema claro/escuro automático
- Efeitos: glassmorphism, shadow-lg, blur-sm
- Bordas: rounded-2xl, rounded-3xl
- Animações: fade, scale, slide (200-300ms)

## Estrutura de Dados Firebase

### Collection: checkins
```javascript
{
  id: string,
  empresaId: string,
  vehiclePlate: string,
  vehicleBrand: string,
  vehicleModel: string,
  vehicleYear: string,
  vehicleColor: string,
  clientId: string,
  clientName: string,
  
  // Timeline
  currentStage: 'checkin' | 'diagnostico' | 'orcamento' | 'execucao' | 'finalizacao' | 'checkout',
  stages: {
    checkin: { completed: boolean, timestamp: Timestamp, userId: string },
    diagnostico: { completed: boolean, timestamp: Timestamp, notes: string },
    orcamento: { completed: boolean, timestamp: Timestamp, budgetId: string },
    execucao: { completed: boolean, timestamp: Timestamp, services: [] },
    finalizacao: { completed: boolean, timestamp: Timestamp },
    checkout: { completed: boolean, timestamp: Timestamp }
  },
  
  // PIN
  pin: string,
  pinAttempts: number,
  pinValidated: boolean,
  
  // Fotos
  entryPhotos: string[], // Firebase Storage URLs
  exitPhotos: string[],
  
  // Sugestões
  suggestedServices: [],
  acceptedSuggestions: [],
  
  // Metadata
  status: 'in_progress' | 'completed' | 'cancelled',
  createdAt: Timestamp,
  updatedAt: Timestamp,
  completedAt: Timestamp
}
```

## Priorização

### Fase 1 (Essencial)
1. Timeline Inteligente
2. Resumo do Veículo
3. Dashboard Operacional

### Fase 2 (Importante)
4. Sistema de PIN
5. Histórico Visual
6. Sugestões de Orçamento

### Fase 3 (Premium)
7. Visualização 3D das Fotos

## Métricas de Sucesso
- ✅ Fluxo atual mantido 100%
- ✅ Tempo de check-in reduzido em 30%
- ✅ Interface responsiva em todos os dispositivos
- ✅ Animações fluidas (60fps)
- ✅ Carregamento < 2s
- ✅ Zero bugs críticos
