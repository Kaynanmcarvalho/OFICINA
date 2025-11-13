# Auto Diagnóstico Visual - Tasks

## Sprint 2: Backend Setup (Semana 3)

### Task 2.1: Preparar Datasets
**Estimativa**: 8 pontos
**Responsável**: ML Engineer

- [ ] Baixar Kaggle Car Damage Detection dataset
- [ ] Baixar Vehicle Visual Inspection dataset
- [ ] Converter para formato YOLO
- [ ] Split train/val/test (70/20/10)
- [ ] Criar data augmentation pipeline
- [ ] Documentar estatísticas do dataset

**Acceptance Criteria**:
- Datasets baixados e organizados
- Mínimo 1000 imagens anotadas
- Distribuição balanceada de classes
- README com estatísticas

---

### Task 2.2: Treinar Modelo YOLOv8
**Estimativa**: 13 pontos
**Responsável**: ML Engineer

- [ ] Setup ambiente Python (requirements.txt)
- [ ] Configurar YOLOv8 (ultralytics)
- [ ] Treinar modelo inicial (50 epochs)
- [ ] Validar com test set
- [ ] Calcular métricas (mAP, precision, recall)
- [ ] Exportar modelo (.pt)
- [ ] Gerar matriz de confusão

**Acceptance Criteria**:
- mAP > 0.70
- Precision > 0.75
- Recall > 0.70
- Modelo exportado e versionado

---

### Task 2.3: Cloud Run Container
**Estimativa**: 8 pontos
**Responsável**: DevOps + ML Engineer

- [ ] Criar Dockerfile
- [ ] Instalar dependências (torch, ultralytics, opencv)
- [ ] Criar API endpoint (/detect)
- [ ] Carregar modelo na inicialização
- [ ] Implementar processamento de imagem
- [ ] Retornar JSON com detecções
- [ ] Deploy no Cloud Run
- [ ] Configurar autoscaling

**Acceptance Criteria**:
- Container funcional
- API responde em < 10s
- Autoscaling configurado (0-5 instâncias)
- Logs estruturados

**Dockerfile**:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY model.pt .
COPY app.py .

EXPOSE 8080

CMD ["python", "app.py"]
```

---

### Task 2.4: Cloud Function - processVehicleImage
**Estimativa**: 13 pontos
**Responsável**: Backend Engineer

- [ ] Criar function em `functions/processVehicleImage.js`
- [ ] Trigger on Storage upload
- [ ] Validar imagem (tipo, tamanho)
- [ ] Chamar Cloud Run endpoint
- [ ] Processar resposta
- [ ] Gerar imagem anotada (canvas/sharp)
- [ ] Upload imagem anotada para Storage
- [ ] Salvar resultado no Firestore
- [ ] Enviar notificação ao frontend
- [ ] Implementar error handling
- [ ] Adicionar logging
- [ ] Deploy function

**Acceptance Criteria**:
- Function deployada
- Processa imagem em < 30s
- Salva corretamente no Firestore
- Error handling robusto
- Logs estruturados

---

### Task 2.5: Firestore Schema & Security Rules
**Estimativa**: 5 pontos
**Responsável**: Backend Engineer

- [ ] Criar collection `diagnostics`
- [ ] Definir indexes necessários
- [ ] Implementar Security Rules
- [ ] Testar rules com emulator
- [ ] Deploy rules

**Security Rules**:
```javascript
match /diagnostics/{diagnosisId} {
  allow read: if request.auth != null 
    && (resource.data.empresaId == request.auth.token.empresaId
        || request.auth.token.role == 'super_admin');
  
  allow create: if request.auth != null
    && request.resource.data.empresaId == request.auth.token.empresaId;
  
  allow update, delete: if request.auth != null
    && resource.data.empresaId == request.auth.token.empresaId
    && (resource.data.createdBy == request.auth.uid
        || request.auth.token.role == 'admin');
}
```

---

## Sprint 3: Frontend Implementation (Semana 4-5)

### Task 3.1: DiagnosisUploader Component
**Estimativa**: 13 pontos
**Responsável**: Frontend Engineer

- [ ] Criar componente base
- [ ] Implementar drag & drop
- [ ] Preview de imagens
- [ ] Compressão de imagem (browser-image-compression)
- [ ] Upload para Storage
- [ ] Progress bar
- [ ] Error handling
- [ ] Testes unitários

**Acceptance Criteria**:
- Drag & drop funcional
- Compressão < 2MB
- Upload com progress
- Testes > 80% coverage

---

### Task 3.2: DiagnosisResults Component
**Estimativa**: 13 pontos
**Responsável**: Frontend Engineer

- [ ] Criar componente base
- [ ] Comparação lado a lado
- [ ] Lista de danos
- [ ] Badges de severidade
- [ ] Animações Framer Motion
- [ ] Botão "Criar Orçamento"
- [ ] Download relatório (PDF)
- [ ] Testes unitários

**Acceptance Criteria**:
- UI responsiva
- Animações suaves
- PDF gerado corretamente
- Testes > 80% coverage

---

### Task 3.3: useDiagnosis Hook
**Estimativa**: 8 pontos
**Responsável**: Frontend Engineer

- [ ] Criar hook customizado
- [ ] Upload function
- [ ] Real-time listener
- [ ] Error handling
- [ ] Loading states
- [ ] Testes unitários

```typescript
interface UseDiagnosisReturn {
  upload: (files: File[]) => Promise<string>;
  diagnosis: Diagnosis | null;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
}
```

---

### Task 3.4: diagnosisService
**Estimativa**: 5 pontos
**Responsável**: Frontend Engineer

- [ ] Criar service
- [ ] uploadImages method
- [ ] getDiagnosis method
- [ ] listDiagnoses method
- [ ] deleteDiagnosis method
- [ ] Testes unitários

---

### Task 3.5: Integração com /clients
**Estimativa**: 8 pontos
**Responsável**: Frontend Engineer

- [ ] Adicionar botão no ClientCard
- [ ] Modal de upload
- [ ] Modal de resultados
- [ ] Link para criar orçamento
- [ ] Testes E2E

---

### Task 3.6: Integração com Check-in
**Estimativa**: 5 pontos
**Responsável**: Frontend Engineer

- [ ] Adicionar quick action
- [ ] Abrir modal de upload
- [ ] Vincular ao veículo do check-in
- [ ] Testes E2E

---

## Sprint 4: Testes & Documentação (Semana 5)

### Task 4.1: Testes de Qualidade do Modelo
**Estimativa**: 13 pontos
**Responsável**: ML Engineer + QA

- [ ] Preparar 30 imagens de teste
- [ ] Executar detecção em todas
- [ ] Calcular métricas
- [ ] Gerar matriz de confusão
- [ ] Identificar false positives/negatives
- [ ] Ajustar thresholds
- [ ] Documentar resultados

**Acceptance Criteria**:
- 30 imagens testadas
- Accuracy > 75%
- Relatório completo
- Recomendações de melhoria

---

### Task 4.2: Testes E2E
**Estimativa**: 8 pontos
**Responsável**: QA Engineer

- [ ] Setup Cypress
- [ ] Teste: Upload de imagem
- [ ] Teste: Visualizar resultados
- [ ] Teste: Criar orçamento
- [ ] Teste: Download relatório
- [ ] Teste: Error scenarios
- [ ] CI integration

---

### Task 4.3: Documentação
**Estimativa**: 5 pontos
**Responsável**: Tech Writer + Engineers

- [ ] README principal
- [ ] API documentation
- [ ] Component documentation
- [ ] User guide
- [ ] FAQ
- [ ] Video tutorial

---

### Task 4.4: Performance Testing
**Estimativa**: 5 pontos
**Responsável**: DevOps

- [ ] Load testing (k6)
- [ ] Stress testing
- [ ] Identificar bottlenecks
- [ ] Otimizações
- [ ] Relatório de performance

---

## Backlog (Futuro)

### Human-in-the-Loop Tool
**Estimativa**: 21 pontos

- [ ] Interface para correção de detecções
- [ ] Ajuste de bounding boxes
- [ ] Re-treinamento com feedback
- [ ] Versionamento de modelo

### Detecção de Peças Específicas
**Estimativa**: 34 pontos

- [ ] Expandir dataset
- [ ] Treinar modelo para peças
- [ ] Integração com catálogo
- [ ] Estimativa de custo automática

### Comparação Temporal
**Estimativa**: 21 pontos

- [ ] Armazenar histórico
- [ ] Algoritmo de comparação
- [ ] UI de timeline
- [ ] Alertas de novos danos

---

## Definição de Pronto (DoD)

Para cada task ser considerada completa:

- [ ] Código implementado e revisado
- [ ] Testes unitários > 80% coverage
- [ ] Testes de integração passando
- [ ] Documentação atualizada
- [ ] Deploy em staging
- [ ] QA aprovado
- [ ] Product Owner aprovado

---

## Riscos e Mitigações

### Risco 1: Accuracy do modelo baixa
**Probabilidade**: Média
**Impacto**: Alto
**Mitigação**: 
- Aumentar dataset
- Data augmentation
- Transfer learning
- Human-in-the-loop

### Risco 2: Tempo de processamento alto
**Probabilidade**: Média
**Impacto**: Médio
**Mitigação**:
- Otimizar modelo (quantização)
- GPU no Cloud Run
- Cache de resultados
- Processamento assíncrono

### Risco 3: Custo de Cloud Run alto
**Probabilidade**: Baixa
**Impacto**: Médio
**Mitigação**:
- Autoscaling agressivo
- Quotas por empresa
- Modelo mais leve
- Batch processing

---

## Métricas de Sucesso

### Técnicas
- Accuracy > 75%
- Processing time < 30s
- Uptime > 99.5%
- Error rate < 1%

### Negócio
- Taxa de adoção > 60%
- Redução de 30% no tempo de inspeção
- Aumento de 20% em orçamentos aceitos
- NPS > 8

---

**Última atualização**: 2025-01-13
**Versão**: 1.0.0
