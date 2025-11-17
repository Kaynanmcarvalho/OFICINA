# 📋 Histórico Veicular - Tasks Detalhadas

## 🎯 Visão Geral

**Sprint**: Fevereiro 2025 (Semanas 3-4)  
**Duração**: 10 dias úteis  
**Estimativa Total**: 40 horas  
**Status**: 📋 Planejado  

---

## 📅 Cronograma Detalhado

### Semana 1 (5 dias - 20h)

#### Dia 1: Setup e Infraestrutura (4h)
- [ ] **Task 1.1**: Criar estrutura de pastas (30min)
  - `functions/vehicle-history/`
  - `src/components/vehicle-history/`
  - `src/services/vehicleHistoryService.js`
  - `src/hooks/useVehicleHistory.js`

- [ ] **Task 1.2**: Configurar Cloud Functions (1h)
  - Instalar dependências (puppeteer, cheerio, axios)
  - Configurar package.json
  - Setup TypeScript configs

- [ ] **Task 1.3**: Criar schemas Firestore (1h)
  - Collection `vehicle_history`
  - Collection `vehicle_history_logs`
  - Indexes necessários

- [ ] **Task 1.4**: Implementar Security Rules (1h)
  - Regras de leitura/escrita
  - Validação de dados
  - Rate limiting

- [ ] **Task 1.5**: Setup de testes (30min)
  - Jest config
  - Mocks de Firestore
  - Fixtures de dados

#### Dia 2: Scraper de Recalls (4h)
- [ ] **Task 2.1**: Pesquisar fonte oficial (1h)
  - Analisar estrutura do site gov.br
  - Identificar seletores CSS
  - Testar manualmente

- [ ] **Task 2.2**: Implementar scraper básico (2h)
  ```javascript
  // functions/vehicle-history/scrapers/recallScraper.js
  class RecallScraper {
    async scrape(placa, chassi) {
      // Implementação
    }
  }
  ```

- [ ] **Task 2.3**: Parser de dados (1h)
  - Extrair campos estruturados
  - Validar dados
  - Normalizar formato

#### Dia 3: Scrapers de Leilões e Sinistros (4h)
- [ ] **Task 3.1**: Scraper de Leilões (2h)
  - Identificar fontes por estado
  - Implementar lógica de busca
  - Parser de resultados

- [ ] **Task 3.2**: Scraper de Sinistros (2h)
  - Pesquisar API Sinesp
  - Implementar consulta
  - Fallback se indisponível

#### Dia 4: Cloud Function Orquestradora (4h)
- [ ] **Task 4.1**: Função principal (2h)
  ```javascript
  // functions/vehicle-history/index.js
  exports.getVehicleHistory = async (req, res) => {
    // Orquestração
  }
  ```

- [ ] **Task 4.2**: Sistema de cache (1h)
  - Verificar cache existente
  - Calcular TTL
  - Salvar resultados

- [ ] **Task 4.3**: Agregação de resultados (1h)
  - Combinar dados de múltiplas fontes
  - Calcular risco
  - Gerar summary

#### Dia 5: Rate Limiting e Logs (4h)
- [ ] **Task 5.1**: Implementar rate limiting (2h)
  - Por fonte
  - Por usuário
  - Global

- [ ] **Task 5.2**: Sistema de logs (1h)
  - Logs estruturados
  - Métricas
  - Alertas

- [ ] **Task 5.3**: Testes backend (1h)
  - Unit tests dos scrapers
  - Integration tests
  - Mocks de fontes externas

---

### Semana 2 (5 dias - 20h)

#### Dia 6: Componentes React - Badge (4h)
- [ ] **Task 6.1**: VehicleHistoryBadge (2h)
  ```jsx
  // src/components/vehicle-history/VehicleHistoryBadge.jsx
  export function VehicleHistoryBadge({ placa, empresaId }) {
    // Implementação
  }
  ```

- [ ] **Task 6.2**: Estilos e animações (1h)
  - CSS/Tailwind
  - Hover effects
  - Loading states

- [ ] **Task 6.3**: Integração no ClientCard (1h)
  - Adicionar badge
  - Posicionamento
  - Responsividade

#### Dia 7: Modal de Histórico (4h)
- [ ] **Task 7.1**: VehicleHistoryModal (2h)
  ```jsx
  // src/components/vehicle-history/VehicleHistoryModal.jsx
  export function VehicleHistoryModal({ placa, isOpen, onClose }) {
    // Implementação
  }
  ```

- [ ] **Task 7.2**: Sistema de Tabs (1h)
  - Recalls tab
  - Leilões tab
  - Sinistros tab
  - Restrições tab

- [ ] **Task 7.3**: Cards de detalhes (1h)
  - RecallCard
  - LeilaoCard
  - SinistroCard

#### Dia 8: Timeline e Serviços (4h)
- [ ] **Task 8.1**: VehicleHistoryTimeline (2h)
  ```jsx
  // src/components/vehicle-history/VehicleHistoryTimeline.jsx
  export function VehicleHistoryTimeline({ events }) {
    // Implementação
  }
  ```

- [ ] **Task 8.2**: vehicleHistoryService (1h)
  ```javascript
  // src/services/vehicleHistoryService.js
  class VehicleHistoryService {
    async getHistory(placa, forceRefresh) {}
    async refreshHistory(placa) {}
  }
  ```

- [ ] **Task 8.3**: useVehicleHistory hook (1h)
  ```javascript
  // src/hooks/useVehicleHistory.js
  export function useVehicleHistory(placa) {
    // Implementação
  }
  ```

#### Dia 9: Testes Frontend (4h)
- [ ] **Task 9.1**: Testes de componentes (2h)
  - Badge tests
  - Modal tests
  - Timeline tests

- [ ] **Task 9.2**: Testes E2E (2h)
  ```javascript
  // cypress/e2e/vehicle-history.cy.js
  describe('Vehicle History', () => {
    // Tests
  });
  ```

#### Dia 10: Documentação e Deploy (4h)
- [ ] **Task 10.1**: Documentação (2h)
  - README.md
  - API Reference
  - Guia de uso
  - Troubleshooting

- [ ] **Task 10.2**: Deploy (1h)
  - Deploy Cloud Functions
  - Deploy Frontend
  - Configurar monitoramento

- [ ] **Task 10.3**: Testes finais (1h)
  - Smoke tests em produção
  - Validação com dados reais
  - Ajustes finais

---

## 📦 Deliverables

### Backend
- [ ] `functions/vehicle-history/index.js` - Cloud Function principal
- [ ] `functions/vehicle-history/scrapers/recallScraper.js`
- [ ] `functions/vehicle-history/scrapers/leilaoScraper.js`
- [ ] `functions/vehicle-history/scrapers/sinistroScraper.js`
- [ ] `functions/vehicle-history/utils/cache.js`
- [ ] `functions/vehicle-history/utils/rateLimiter.js`
- [ ] `functions/vehicle-history/utils/logger.js`

### Frontend
- [ ] `src/components/vehicle-history/VehicleHistoryBadge.jsx`
- [ ] `src/components/vehicle-history/VehicleHistoryModal.jsx`
- [ ] `src/components/vehicle-history/VehicleHistoryTimeline.jsx`
- [ ] `src/components/vehicle-history/RecallCard.jsx`
- [ ] `src/components/vehicle-history/LeilaoCard.jsx`
- [ ] `src/components/vehicle-history/SinistroCard.jsx`
- [ ] `src/services/vehicleHistoryService.js`
- [ ] `src/hooks/useVehicleHistory.js`

### Testes
- [ ] `tests/unit/recallScraper.test.js`
- [ ] `tests/unit/vehicleHistoryService.test.js`
- [ ] `tests/integration/vehicleHistory.integration.test.js`
- [ ] `cypress/e2e/vehicle-history.cy.js`

### Documentação
- [ ] `VEHICLE_HISTORY_README.md`
- [ ] `VEHICLE_HISTORY_API.md`
- [ ] `VEHICLE_HISTORY_GUIDE.md`
- [ ] `VEHICLE_HISTORY_TROUBLESHOOTING.md`

---

## ✅ Definition of Done

### Para cada Task
- [ ] Código implementado e funcionando
- [ ] Testes unitários passando
- [ ] Code review aprovado
- [ ] Documentação atualizada
- [ ] Commit com mensagem descritiva

### Para o Sprint
- [ ] Todas as tasks completas
- [ ] Cobertura de testes > 80%
- [ ] 0 bugs críticos
- [ ] Performance dentro dos SLAs
- [ ] Documentação completa
- [ ] Deploy em produção
- [ ] Monitoramento ativo

---

## 🎯 Critérios de Sucesso

### Técnicos
- [ ] Taxa de sucesso de consultas > 95%
- [ ] Tempo médio de resposta < 5s
- [ ] Cache hit rate > 80%
- [ ] 0 erros críticos
- [ ] Uptime > 99%

### Funcionais
- [ ] Badge exibido corretamente
- [ ] Modal abre e fecha suavemente
- [ ] Dados precisos e atualizados
- [ ] Todas as fontes integradas
- [ ] Exportação de PDF funciona

### UX
- [ ] Interface intuitiva
- [ ] Feedback visual claro
- [ ] Responsivo em todos os dispositivos
- [ ] Dark mode suportado
- [ ] Animações suaves

---

## 🚨 Riscos e Mitigações

### Risco 1: Fontes indisponíveis
**Probabilidade**: Média  
**Impacto**: Alto  
**Mitigação**:
- Fallback gracioso
- Cache de longa duração
- Múltiplas fontes alternativas

### Risco 2: Mudança na estrutura dos sites
**Probabilidade**: Média  
**Impacto**: Alto  
**Mitigação**:
- Monitoramento de erros
- Alertas automáticos
- Testes diários automatizados

### Risco 3: Rate limiting das fontes
**Probabilidade**: Alta  
**Impacto**: Médio  
**Mitigação**:
- Rate limiting próprio
- Cache agressivo
- Rotação de IPs (se necessário)

### Risco 4: Conformidade legal
**Probabilidade**: Baixa  
**Impacto**: Crítico  
**Mitigação**:
- Apenas fontes públicas
- Respeitar robots.txt
- Consulta jurídica prévia

---

## 📊 Tracking de Progresso

### Semana 1
```
Dia 1: [░░░░░░░░░░] 0%
Dia 2: [░░░░░░░░░░] 0%
Dia 3: [░░░░░░░░░░] 0%
Dia 4: [░░░░░░░░░░] 0%
Dia 5: [░░░░░░░░░░] 0%
```

### Semana 2
```
Dia 6: [░░░░░░░░░░] 0%
Dia 7: [░░░░░░░░░░] 0%
Dia 8: [░░░░░░░░░░] 0%
Dia 9: [░░░░░░░░░░] 0%
Dia 10: [░░░░░░░░░░] 0%
```

### Progresso Geral
```
Backend:  [░░░░░░░░░░] 0% (0/20h)
Frontend: [░░░░░░░░░░] 0% (0/20h)
Total:    [░░░░░░░░░░] 0% (0/40h)
```

---

## 🔄 Daily Standup Template

### O que fiz ontem?
- Task X.Y completa
- Task X.Z em andamento

### O que farei hoje?
- Completar Task X.Z
- Iniciar Task X.W

### Bloqueios?
- Nenhum / [Descrever bloqueio]

---

## 📝 Notas de Implementação

### Prioridades
1. **P0 (Crítico)**: Recalls - maior valor para usuário
2. **P1 (Alto)**: Sinistros - segurança e conformidade
3. **P2 (Médio)**: Leilões - informação adicional

### Ordem de Implementação
1. Infraestrutura e cache
2. Scraper de recalls (P0)
3. Frontend básico (badge + modal)
4. Scrapers adicionais (P1, P2)
5. Refinamentos e testes

### Decisões Técnicas
- **Puppeteer** para scrapers (mais robusto que axios)
- **Cheerio** para parsing HTML (mais rápido)
- **Firestore** para cache (já integrado)
- **React Query** para gerenciamento de estado (considerar)

---

**Documento criado**: 17 de Janeiro de 2025  
**Versão**: 1.0  
**Status**: 📋 Pronto para execução  
**Início previsto**: 03 de Fevereiro de 2025
