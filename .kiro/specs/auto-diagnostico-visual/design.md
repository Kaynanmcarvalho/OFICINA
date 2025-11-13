# Auto Diagnóstico Visual - Design

## Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
├─────────────────────────────────────────────────────────────┤
│  DiagnosisUploader → useDiagnosis → diagnosisService        │
│         ↓                                                    │
│  Firebase Storage (upload)                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   CLOUD FUNCTION (Node.js)                   │
├─────────────────────────────────────────────────────────────┤
│  processVehicleImage                                         │
│    1. Valida upload                                          │
│    2. Chama Cloud Run (YOLOv8)                              │
│    3. Processa resultado                                     │
│    4. Gera imagem anotada                                    │
│    5. Salva no Firestore                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   CLOUD RUN (Python)                         │
├─────────────────────────────────────────────────────────────┤
│  YOLOv8 Detector                                             │
│    - Carrega modelo treinado                                 │
│    - Processa imagem                                         │
│    - Retorna detecções (JSON)                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      FIRESTORE                               │
├─────────────────────────────────────────────────────────────┤
│  diagnostics/{id}                                            │
│    - metadata                                                │
│    - detections[]                                            │
│    - summary                                                 │
└─────────────────────────────────────────────────────────────┘
```

## Componentes Frontend

### 1. DiagnosisUploader Component

**Localização**: `src/components/diagnosis/DiagnosisUploader.jsx`

**Props**:
```typescript
interface DiagnosisUploaderProps {
  vehicleId: string;
  clientId: string;
  onComplete?: (diagnosisId: string) => void;
  onError?: (error: Error) => void;
}
```

**Features**:
- Drag & drop zone
- Preview de imagens
- Progress bar durante upload
- Suporte para múltiplas imagens
- Compressão automática

### 2. DiagnosisResults Component

**Localização**: `src/components/diagnosis/DiagnosisResults.jsx`

**Features**:
- Comparação lado a lado (original vs anotada)
- Lista de danos com confiança
- Badges de severidade
- Botão "Criar Orçamento"
- Opção de download do relatório

### 3. DiagnosisHistory Component

**Localização**: `src/components/diagnosis/DiagnosisHistory.jsx`

**Features**:
- Timeline de análises anteriores
- Comparação entre análises
- Filtros por data/tipo de dano

## Fluxo de Dados

### Upload Flow
```javascript
1. Usuário seleciona imagem(ns)
   ↓
2. Frontend comprime e faz upload para Storage
   ↓
3. Trigger Cloud Function automaticamente
   ↓
4. Function chama Cloud Run com URL da imagem
   ↓
5. YOLOv8 processa e retorna detecções
   ↓
6. Function gera imagem anotada
   ↓
7. Salva tudo no Firestore
   ↓
8. Frontend recebe atualização em tempo real
```

## Design System

### Cores por Severidade
```css
low: #10b981 (green-500)
medium: #f59e0b (amber-500)
high: #ef4444 (red-500)
```

### Animações
- Upload: Progress bar com pulse
- Processamento: Spinner com texto dinâmico
- Resultado: Fade in + slide up
- Comparação: Swipe gesture para mobile

## Integração com Páginas Existentes

### 1. Card do Veículo (/clients)
```jsx
<ClientCard>
  {/* ... existing content ... */}
  <button onClick={() => openDiagnosis(vehicle.id)}>
    <Camera className="w-4 h-4" />
    Analisar Foto
  </button>
</ClientCard>
```

### 2. Modal de Check-in
```jsx
<CheckinModal>
  {/* ... existing content ... */}
  <QuickAction
    icon={<Scan />}
    label="Diagnóstico Visual"
    onClick={() => openDiagnosis(vehicle.id)}
  />
</CheckinModal>
```

### 3. Página de Orçamentos
```jsx
<BudgetModal>
  {/* ... existing content ... */}
  {diagnosis && (
    <DiagnosisSummary
      diagnosis={diagnosis}
      onAddServices={addServicesFromDiagnosis}
    />
  )}
</BudgetModal>
```

## Responsividade

### Mobile (< 768px)
- Upload: Botão grande centralizado
- Resultados: Stack vertical
- Comparação: Swipe entre imagens

### Tablet (768px - 1024px)
- Upload: Drag & drop zone
- Resultados: Grid 2 colunas
- Comparação: Side by side

### Desktop (> 1024px)
- Upload: Drag & drop zone grande
- Resultados: Grid 3 colunas
- Comparação: Side by side com zoom

## Acessibilidade

- [ ] Keyboard navigation completa
- [ ] Screen reader support
- [ ] ARIA labels em todos elementos interativos
- [ ] Contraste mínimo WCAG AA
- [ ] Focus indicators visíveis

## Performance

### Otimizações
- Lazy loading de imagens
- Compressão antes do upload (max 2MB)
- Cache de resultados no IndexedDB
- Debounce em ações de usuário
- Skeleton screens durante loading

### Métricas Alvo
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Upload time: < 5s (imagem 5MB)
- Processing time: < 30s

## Segurança

### Frontend
- Validação de tipo de arquivo (jpg, png, webp)
- Validação de tamanho (max 10MB)
- Sanitização de nomes de arquivo
- Rate limiting (max 5 uploads/min)

### Backend
- Verificação de autenticação
- Verificação de ownership do veículo
- Validação de imagem (não é malware)
- Quota por empresa (max 100 análises/mês)

## Testes

### Unit Tests
- [ ] Upload validation
- [ ] Image compression
- [ ] Result parsing
- [ ] Error handling

### Integration Tests
- [ ] Upload to Storage
- [ ] Trigger Cloud Function
- [ ] Save to Firestore
- [ ] Real-time updates

### E2E Tests
- [ ] Complete upload flow
- [ ] View results
- [ ] Create budget from diagnosis
- [ ] Download report

## Documentação

### Para Desenvolvedores
- API reference
- Component props
- Hook usage
- Service methods

### Para Usuários
- Como fazer upload
- Como interpretar resultados
- Como criar orçamento
- FAQ

## Roadmap Futuro

### Fase 2
- Detecção de peças específicas
- Comparação com fotos anteriores
- Estimativa de custo com IA
- Detecção de modificações

### Fase 3
- Vídeo support
- 3D reconstruction
- AR overlay
- Mobile app nativo
