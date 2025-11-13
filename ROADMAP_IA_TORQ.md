# 🚀 Roadmap de Implementação - Torq AI Features

## Status Atual do Projeto

### ✅ Já Implementado
- Sistema multi-tenant completo com Firebase
- Página /clients com design Apple-like premium
- Barra de busca elegante com animações
- Sistema de check-in com timeline dinâmica
- Integração WhatsApp
- Módulo de inventário
- Sistema de orçamentos
- Dashboard com analytics

### 🎯 A Implementar (Conforme Especificação)

## SPRINT 1: Fundação (Semana 1-2)
**Objetivo**: Preparar infraestrutura para IA

### Tarefas
- [ ] Criar schemas Firestore para novas collections
- [ ] Configurar Cloud Functions base
- [ ] Setup Cloud Run para containers Python
- [ ] Configurar Storage buckets
- [ ] Implementar Security Rules
- [ ] Setup CI/CD pipeline
- [ ] Criar estrutura de testes

**Deliverables**:
- `firestore-schemas.md`
- `functions/` estruturado
- `cloud-run/` com Dockerfile
- `.github/workflows/` com CI
- `tests/` com estrutura

---

## SPRINT 2-3: Auto Diagnóstico Visual (Semana 3-5)
**Prioridade**: 🔴 ALTA

### Fase 1: Backend
- [ ] Baixar e preparar datasets (Kaggle)
- [ ] Treinar modelo YOLOv8 inicial
- [ ] Criar Cloud Function `processVehicleImage`
- [ ] Deploy container YOLOv8 no Cloud Run
- [ ] Implementar pipeline de processamento
- [ ] Gerar imagens anotadas
- [ ] Salvar resultados no Firestore

### Fase 2: Frontend
- [ ] Componente `DiagnosisUploader.jsx`
- [ ] Hook `useDiagnosis.js`
- [ ] Service `diagnosisService.js`
- [ ] Integrar no card do veículo (/clients)
- [ ] Modal de resultados com comparação
- [ ] Link para criar orçamento baseado em danos

### Fase 3: Testes
- [ ] Unit tests (parsers, utils)
- [ ] Integration tests (Firebase)
- [ ] E2E tests (Cypress)
- [ ] Testes de qualidade (30 imagens)
- [ ] Matriz de confusão
- [ ] Documentação

**Deliverables**:
- Detector funcional com accuracy > 75%
- UI integrada em /clients
- Relatório de testes
- Documentação completa

---

## SPRINT 4-5: Assistente de Orçamento Falado (Semana 6-8)
**Prioridade**: 🔴 ALTA

### Fase 1: Speech-to-Text
- [ ] Implementar Web Speech API (frontend)
- [ ] Fallback com Whisper (backend opcional)
- [ ] UI de gravação com feedback visual
- [ ] Transcrição em tempo real

### Fase 2: NLP e Extração de Entidades
- [ ] Criar dicionários de serviços/peças
- [ ] Parser híbrido (regex + listas)
- [ ] Detecção de valores monetários
- [ ] Mapeamento para IDs do sistema
- [ ] Validação e correção

### Fase 3: Integração
- [ ] Botão no modal "Criar Orçamento"
- [ ] Atalho de teclado "N"
- [ ] Preview editável antes de salvar
- [ ] Integração com sistema de orçamentos

**Deliverables**:
- Assistente funcional com 90%+ accuracy
- UI integrada
- Testes E2E
- Documentação

---

## SPRINT 6: Análise de Custos & Margens (Semana 9-10)
**Prioridade**: 🟡 MÉDIA

### Implementação
- [ ] Queries e agregações Firestore
- [ ] Cloud Functions para cálculos
- [ ] Visualizações com Recharts
- [ ] Cards de insights no /clients
- [ ] Relatórios exportáveis (CSV/PDF)

**Métricas**:
- Margem por serviço
- Ticket médio por cliente
- Top N serviços (margem + volume)
- Taxa de churn
- Previsão de receita

---

## SPRINT 7: Modo Aprendiz (Semana 11-12)
**Prioridade**: 🟡 MÉDIA

### Implementação
- [ ] Collection `mechanic_guides`
- [ ] Popula com conteúdo público (SENAI, etc)
- [ ] UI de consulta integrada
- [ ] Sistema de busca
- [ ] Versionamento e audit trail
- [ ] Edição por admin

---

## SPRINT 8-9: Histórico Veicular (Semana 13-15)
**Prioridade**: 🟢 BAIXA

### Scrapers
- [ ] Portal gov.br (recalls)
- [ ] Bases de leilões públicos
- [ ] Sinesp Cidadão (se permitido)
- [ ] Cache com TTL 24h
- [ ] Rate limiting e rotação

### UI
- [ ] Badge no card do veículo
- [ ] Modal com histórico completo
- [ ] Alertas de recall ativo

---

## SPRINT 10-11: NF-e (Semana 16-18)
**Prioridade**: 🟡 MÉDIA

### Implementação
- [ ] Geração de XML (schemas SEFAZ)
- [ ] Assinatura com certificado A1
- [ ] Envio para SEFAZ
- [ ] Persistência de retorno
- [ ] Geração de DANFE (PDF)
- [ ] Fila de processamento

**Requisitos**:
- Cliente fornece certificado A1
- Configuração por estado
- Ambiente homologação + produção

---

## SPRINT 12: Previsão de Estoque (Semana 19-20)
**Prioridade**: 🟢 BAIXA

### Implementação
- [ ] Algoritmo estatístico (média móvel)
- [ ] Detecção de padrões de consumo
- [ ] Alertas de fim de estoque (< 7 dias)
- [ ] Sugestões de reposição
- [ ] Integração com orçamentos

---

## 📊 Métricas de Sucesso

### Auto Diagnóstico
- Accuracy > 75%
- Tempo processamento < 30s
- Taxa de adoção > 60%

### Assistente Falado
- Accuracy extração > 90%
- Tempo médio < 2min por orçamento
- Redução de 50% no tempo de criação

### Análise de Custos
- 100% dos orçamentos com margem calculada
- Insights acionáveis semanais
- Aumento de 15% na margem média

---

## 🛠️ Stack Tecnológica

### Frontend
- React + TypeScript
- TailwindCSS + Framer Motion
- shadcn/ui + lucide-react
- Firebase SDK

### Backend
- Firebase Functions (Node.js/TS)
- Cloud Run (Python para YOLOv8)
- Firestore + Storage
- Secret Manager

### IA/ML
- YOLOv8 (Ultralytics)
- Whisper (OpenAI) - opcional
- Tesseract.js (OCR)

### Testes
- Jest + Testing Library
- Cypress / Playwright
- Firebase Emulator
- k6 (load testing)

---

## 📝 Próximos Passos Imediatos

1. ✅ Criar estrutura de specs (FEITO)
2. ⏳ Implementar schema Firestore
3. ⏳ Setup Cloud Functions base
4. ⏳ Criar componente de upload
5. ⏳ Integrar no card do veículo

---

## 📞 Contato e Suporte

Para dúvidas ou ajustes no roadmap, consulte a documentação em `.kiro/specs/` ou entre em contato com a equipe de desenvolvimento.

**Última atualização**: 2025-01-13
**Versão**: 1.0.0
