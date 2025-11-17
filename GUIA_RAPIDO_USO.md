# 🚀 GUIA RÁPIDO DE USO - TORQ AI

## 📋 Como Usar Cada Funcionalidade

---

## 1. 📦 Previsão de Estoque

### Como Acessar
```javascript
import StockPredictionDashboard from './components/stock-prediction/StockPredictionDashboard';

// No seu App.jsx ou rota
<Route path="/estoque/previsao" element={<StockPredictionDashboard />} />
```

### Como Usar
1. Acesse o dashboard de previsão
2. Visualize produtos críticos (< 3 dias)
3. Clique em um produto para ver análise detalhada
4. Veja sugestões de reposição
5. Crie pedidos de compra

### Exemplo de Código
```javascript
import { useStockPrediction } from './hooks/useStockPrediction';

function MeuComponente() {
  const { predictions, criticalProducts, loading } = useStockPrediction();
  
  return (
    <div>
      <h2>Produtos Críticos: {criticalProducts.length}</h2>
      {criticalProducts.map(product => (
        <div key={product.id}>
          {product.productName}: {product.prediction.daysUntilEmpty} dias
        </div>
      ))}
    </div>
  );
}
```

### Recursos
- ✅ Análise automática de consumo
- ✅ Previsão de fim de estoque
- ✅ Alertas de estoque crítico
- ✅ Sugestões de reposição
- ✅ Dashboard visual

---

## 2. 📄 NF-e (Nota Fiscal Eletrônica)

### Como Acessar
```javascript
import NFeDashboard from './components/nfe/NFeDashboard';

// No seu App.jsx ou rota
<Route path="/nfe" element={<NFeDashboard />} />
```

### Configuração Inicial
1. Acesse "Configurações" no dashboard
2. Preencha dados da empresa (CNPJ, IE, endereço)
3. Configure alíquotas de impostos
4. Escolha ambiente (homologação/produção)
5. Salve a configuração

### Como Emitir NF-e
```javascript
import { useNFe } from './hooks/useNFe';

function EmitirNFe({ budgetId }) {
  const { createFromBudget, send, generatePDF } = useNFe();
  
  const handleEmitir = async () => {
    // 1. Criar NF-e a partir do orçamento
    const nfe = await createFromBudget(budgetId);
    
    // 2. Enviar para SEFAZ
    await send(nfe.id);
    
    // 3. Gerar DANFE (PDF)
    const pdfUrl = await generatePDF(nfe.id);
    
    // 4. Abrir PDF
    window.open(pdfUrl, '_blank');
  };
  
  return (
    <button onClick={handleEmitir}>
      Emitir NF-e
    </button>
  );
}
```

### Recursos
- ✅ Geração automática de XML
- ✅ Cálculo de impostos
- ✅ Envio para SEFAZ
- ✅ Geração de DANFE
- ✅ Cancelamento (24h)

---

## 3. 🚗 Histórico Veicular

### Como Usar
```javascript
import VehicleHistoryBadge from './components/vehicle-history/VehicleHistoryBadge';

function ClientCard({ vehicle }) {
  return (
    <div>
      <h3>{vehicle.placa}</h3>
      <VehicleHistoryBadge placa={vehicle.placa} />
    </div>
  );
}
```

### Exemplo Completo
```javascript
import { useVehicleHistory } from './hooks/useVehicleHistory';

function VehicleInfo({ placa }) {
  const { history, loading, error } = useVehicleHistory(placa);
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return (
    <div>
      <h3>Histórico de {placa}</h3>
      <p>Recalls: {history.recalls.length}</p>
      <p>Leilões: {history.leiloes.length}</p>
      <p>Sinistros: {history.sinistros.length}</p>
    </div>
  );
}
```

### Recursos
- ✅ Consulta de recalls oficiais
- ✅ Histórico de leilões
- ✅ Indicadores de sinistros
- ✅ Cache inteligente (24h)
- ✅ Badge visual no card

---

## 4. 🤖 Auto-Diagnóstico Visual

### Como Usar
```javascript
import DiagnosisUploader from './components/diagnosis/DiagnosisUploader';

function DiagnosisPage() {
  const handleComplete = (result) => {
    console.log('Danos detectados:', result.detections);
  };
  
  return (
    <DiagnosisUploader
      vehicleId="abc123"
      onComplete={handleComplete}
    />
  );
}
```

### Recursos
- ✅ Upload de fotos/vídeos
- ✅ Detecção automática de danos
- ✅ Relatório visual
- ✅ Estimativa de custos

---

## 5. 🎤 Assistente de Voz

### Como Usar
```javascript
import VoiceBudgetAssistant from './components/voice/VoiceBudgetAssistant';

function BudgetPage() {
  const handleBudgetCreated = (budget) => {
    console.log('Orçamento criado:', budget);
  };
  
  return (
    <VoiceBudgetAssistant
      onBudgetCreated={handleBudgetCreated}
    />
  );
}
```

### Comandos de Voz
- "Troca de óleo no Palio"
- "Alinhamento e balanceamento"
- "Pastilha de freio dianteira"

### Recursos
- ✅ Reconhecimento de voz
- ✅ Extração de entidades
- ✅ Criação automática de orçamento
- ✅ Feedback visual

---

## 6. 💰 Análise de Custos

### Como Usar
```javascript
import { useCostAnalysis } from './hooks/useCostAnalysis';

function CostPanel() {
  const { analysis, loading } = useCostAnalysis();
  
  return (
    <div>
      <h3>Margem Média: {analysis.avgMargin}%</h3>
      <h3>Lucro Total: R$ {analysis.totalProfit}</h3>
    </div>
  );
}
```

### Recursos
- ✅ Cálculo de margens
- ✅ Análise de custos
- ✅ Alertas de margem baixa
- ✅ Relatórios

---

## 7. 📚 Guia do Mecânico

### Como Usar
```javascript
import GuideViewer from './components/mechanic-guide/GuideViewer';

function GuidePage() {
  return (
    <GuideViewer
      service="troca_oleo"
      vehicleModel="Fiat Palio"
    />
  );
}
```

### Recursos
- ✅ Base de conhecimento técnico
- ✅ Busca inteligente
- ✅ Passo a passo ilustrado
- ✅ Dicas e avisos

---

## 8. 💬 WhatsApp Automation

### Como Usar
```javascript
import WhatsAppButton from './components/whatsapp/WhatsAppButton';

function BudgetCard({ budget }) {
  return (
    <div>
      <h3>Orçamento #{budget.numero}</h3>
      <WhatsAppButton
        phone={budget.cliente.telefone}
        message={`Olá! Seu orçamento está pronto: R$ ${budget.total}`}
      />
    </div>
  );
}
```

### Recursos
- ✅ Envio automático de orçamentos
- ✅ Multi-sessão
- ✅ QR Code connection
- ✅ Gerenciamento de sessões

---

## 9. 🚗 Check-in Premium

### Como Usar
```javascript
import CheckInPagePremium from './pages/CheckInPagePremium';

// No seu App.jsx
<Route path="/checkin-premium" element={<CheckInPagePremium />} />
```

### Recursos
- ✅ Dashboard em tempo real
- ✅ Timeline de veículos
- ✅ Sistema de PIN
- ✅ Histórico de visitas
- ✅ Sugestões de serviços

---

## 10. 📦 Inventory Module

### Como Usar
```javascript
import InventoryPage from './pages/inventory/InventoryPage';

// No seu App.jsx
<Route path="/inventory" element={<InventoryPage />} />
```

### Recursos
- ✅ Gestão de produtos
- ✅ Controle de estoque
- ✅ Compatibilidade de veículos
- ✅ Códigos fiscais
- ✅ Upload de imagens

---

## 🔧 CONFIGURAÇÃO FIREBASE

### 1. Firestore Collections

```javascript
// Estrutura de collections necessárias
empresas/{empresaId}/
  ├── produtos/
  ├── stock_movements/
  ├── stock_predictions/
  ├── nfe/
  ├── nfe_config/
  ├── orcamentos/
  ├── diagnostics/
  ├── vehicle_history_cache/
  └── mechanic_guides/
```

### 2. Cloud Functions

```bash
# Deploy das functions
cd functions
firebase deploy --only functions
```

### 3. Storage Rules

```javascript
// Configurar regras de Storage para uploads
service firebase.storage {
  match /b/{bucket}/o {
    match /empresas/{empresaId}/{allPaths=**} {
      allow read, write: if request.auth != null 
        && request.auth.token.empresaId == empresaId;
    }
  }
}
```

---

## 📊 MONITORAMENTO

### Logs
```javascript
// Todos os serviços incluem logging
console.log('[StockPrediction] Calculando previsão...');
console.log('[NFe] Enviando para SEFAZ...');
console.log('[VehicleHistory] Consultando recalls...');
```

### Métricas
- Taxa de sucesso de previsões
- NF-es emitidas por dia
- Consultas de histórico veicular
- Diagnósticos processados

---

## 🚨 TROUBLESHOOTING

### Problema: Previsão não calcula
**Solução**: Verificar se há movimentações de estoque nos últimos 90 dias

### Problema: NF-e rejeitada
**Solução**: Verificar configuração (CNPJ, IE, endereço)

### Problema: Histórico veicular vazio
**Solução**: Placa pode não ter registros públicos

### Problema: Diagnóstico falha
**Solução**: Verificar se Cloud Function está deployada

---

## 📞 SUPORTE

Para dúvidas ou problemas:
1. Consulte a documentação específica de cada módulo
2. Verifique os logs no console
3. Execute `.\validar-implementacao.bat` para verificar arquivos

---

**Última atualização**: 17 de Novembro de 2025  
**Versão**: 1.0  

**Bom uso do TORQ AI! 🚀**
