# 🎯 Integração da Sugestão Automática de Serviços - TORQ

## ✅ Implementação Completa

A funcionalidade de **Sugestão Automática de Serviços** foi totalmente implementada.

---

## 📁 Arquivos Criados

### Feature Completa
```
src/features/service-suggestion/
├── index.ts                              # Exports
├── types/
│   └── index.ts                          # Tipos TypeScript
├── data/
│   └── dtcMappings.ts                    # Mapeamentos DTC → Serviços
├── services/
│   └── serviceSuggestionService.ts       # Serviço principal
├── hooks/
│   └── useServiceSuggestion.ts           # Hook React
└── components/
    └── ServiceSuggestionPanel.tsx        # Painel de sugestões
```

---

## 🎯 Funcionalidades Implementadas

### 1. Fontes de Sugestão
- ✅ **Scanner OBD-II** - Códigos de diagnóstico
- ✅ **Detecção de Danos** - Análise de fotos
- ✅ **Quilometragem** - Manutenção preventiva
- ✅ **Reclamações do Cliente** - Análise de texto
- ✅ **Inspeção Visual** - Notas do mecânico

### 2. Mapeamento de Códigos DTC
- ✅ 30+ códigos mapeados
- ✅ Serviços recomendados por código
- ✅ Peças necessárias
- ✅ Prioridade automática
- ✅ Descrições em português

### 3. Categorias de Serviço
- ✅ Motor
- ✅ Transmissão
- ✅ Freios
- ✅ Suspensão
- ✅ Elétrica
- ✅ Arrefecimento
- ✅ Combustível
- ✅ Escape
- ✅ Carroceria
- ✅ Pneus
- ✅ Manutenção

### 4. Prioridades
- ✅ **Urgente** - Vermelho
- ✅ **Alta** - Laranja
- ✅ **Média** - Amarelo
- ✅ **Baixa** - Azul

### 5. Estimativas
- ✅ Custo de mão de obra
- ✅ Custo de peças
- ✅ Tempo estimado
- ✅ Total do orçamento

### 6. Interface Premium
- ✅ Painel com resumo visual
- ✅ Filtros por prioridade/categoria
- ✅ Cards expansíveis
- ✅ Insights de IA
- ✅ Botão "Adicionar ao Orçamento"

---

## 🔧 Como Usar

### Integração Básica
```jsx
import { useServiceSuggestion, ServiceSuggestionPanel } from '@/features/service-suggestion';

function BudgetPage() {
  const { result, generateSuggestions, isLoading } = useServiceSuggestion();

  const handleGenerateSuggestions = async () => {
    await generateSuggestions({
      vehicleInfo: {
        plate: 'ABC1234',
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        mileage: 45000,
      },
      obdCodes: ['P0171', 'P0420'],
      detectedDamages: [
        { type: 'scratches', severity: 'minor' },
        { type: 'dents', severity: 'moderate' },
      ],
      customerComplaints: ['Barulho no freio', 'Vibração no volante'],
    });
  };

  const handleAddService = (suggestion) => {
    // Adicionar ao orçamento
    addServiceToBudget({
      name: suggestion.name,
      price: suggestion.estimatedCost.total,
      time: suggestion.estimatedTime,
      parts: suggestion.relatedParts,
    });
  };

  return (
    <div>
      <button onClick={handleGenerateSuggestions}>
        Gerar Sugestões
      </button>

      {result && (
        <ServiceSuggestionPanel
          result={result}
          onAddService={handleAddService}
          onAddAllServices={(suggestions) => {
            suggestions.forEach(handleAddService);
          }}
        />
      )}
    </div>
  );
}
```

### Com Scanner OBD
```jsx
import { useOBDScanner } from '@/features/obd-scanner';
import { useServiceSuggestion } from '@/features/service-suggestion';

function DiagnosticPage() {
  const { performScan, currentScan } = useOBDScanner();
  const { generateSuggestions, result } = useServiceSuggestion();

  const handleFullDiagnostic = async () => {
    // 1. Executar scan OBD
    const scanResult = await performScan({
      scanType: 'full',
      includeLiveData: true,
    });

    if (scanResult) {
      // 2. Gerar sugestões baseadas nos códigos
      await generateSuggestions({
        vehicleInfo: scanResult.vehicleInfo,
        obdCodes: scanResult.diagnosticCodes.map(c => c.code),
      });
    }
  };

  return (
    <div>
      <button onClick={handleFullDiagnostic}>
        Diagnóstico Completo
      </button>
      {/* Mostrar resultados */}
    </div>
  );
}
```

### Com Detecção de Danos
```jsx
import { useDamageDetection } from '@/features/damage-detection';
import { useServiceSuggestion } from '@/features/service-suggestion';

function CheckinPage() {
  const { results: damageResults } = useDamageDetection();
  const { generateSuggestions } = useServiceSuggestion();

  const handleGenerateFromDamages = async () => {
    const damages = damageResults.flatMap(r => 
      r.damages.map(d => ({
        type: d.type,
        severity: d.severity,
        location: d.location,
      }))
    );

    await generateSuggestions({
      vehicleInfo: { plate: 'ABC1234' },
      detectedDamages: damages,
    });
  };
}
```

---

## 📊 Estrutura de Dados

### SuggestionRequest
```typescript
interface SuggestionRequest {
  vehicleInfo: {
    plate?: string;
    make?: string;
    model?: string;
    year?: number;
    mileage?: number;
    lastServiceDate?: Date;
  };
  obdCodes?: string[];
  detectedDamages?: DetectedDamageInput[];
  customerComplaints?: string[];
  inspectionNotes?: string;
}
```

### ServiceSuggestion
```typescript
interface ServiceSuggestion {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  priority: SuggestionPriority;
  source: SuggestionSource;
  confidence: number;
  estimatedTime: number;
  estimatedCost: {
    labor: number;
    parts: number;
    total: number;
    currency: string;
  };
  relatedParts: SuggestedPart[];
  relatedDTCs?: string[];
  relatedDamages?: string[];
}
```

---

## 🎨 Design System

### Cores por Prioridade
| Prioridade | Light Mode | Dark Mode |
|------------|------------|-----------|
| Urgente | `bg-red-50` | `bg-red-900/20` |
| Alta | `bg-orange-50` | `bg-orange-900/20` |
| Média | `bg-yellow-50` | `bg-yellow-900/20` |
| Baixa | `bg-blue-50` | `bg-blue-900/20` |

---

## 🚀 Próximos Passos

### Funcionalidade 5 - Histórico de Manutenção
- [ ] Registro de serviços realizados
- [ ] Alertas de manutenção vencida
- [ ] Comparação com recomendações

### Melhorias Futuras
- [ ] Machine Learning para preços
- [ ] Integração com fornecedores
- [ ] Comparação de preços de peças
- [ ] Histórico de preços

---

*Implementação concluída em: 28/11/2025*
*Próxima funcionalidade: Histórico de Manutenção*
