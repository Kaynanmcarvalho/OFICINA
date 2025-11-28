# ðŸš€ TORQ - PLANO MESTRE DE IMPLEMENTAÃ‡ÃƒO

## ðŸ“‹ VisÃ£o Geral

Este documento detalha o plano de implementaÃ§Ã£o das 13 funcionalidades oficiais do TORQ, seguindo design premium Apple-like com foco em excelÃªncia, organizaÃ§Ã£o e harmonia visual.

---

## ðŸŽ¨ DESIGN SYSTEM - PADRÃ•ES VISUAIS

### Cores (Light Mode)
```css
--background: #FAFAFA
--surface: #FFFFFF
--surface-elevated: #FFFFFF
--text-primary: #1D1D1F
--text-secondary: #86868B
--text-tertiary: #AEAEB2
--accent-primary: #007AFF
--accent-success: #34C759
--accent-warning: #FF9500
--accent-error: #FF3B30
--border: rgba(0, 0, 0, 0.08)
--shadow: rgba(0, 0, 0, 0.04)
```

### Cores (Dark Mode)
```css
--background: #000000
--surface: #1C1C1E
--surface-elevated: #2C2C2E
--text-primary: #F5F5F7
--text-secondary: #A1A1A6
--text-tertiary: #636366
--accent-primary: #0A84FF
--accent-success: #30D158
--accent-warning: #FF9F0A
--accent-error: #FF453A
--border: rgba(255, 255, 255, 0.08)
--shadow: rgba(0, 0, 0, 0.3)
```

### Tipografia
```css
--font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif
--font-size-xs: 11px
--font-size-sm: 13px
--font-size-base: 15px
--font-size-lg: 17px
--font-size-xl: 20px
--font-size-2xl: 24px
--font-size-3xl: 28px
--font-size-4xl: 34px
--font-weight-regular: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

### EspaÃ§amento
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 12px
--spacing-lg: 16px
--spacing-xl: 24px
--spacing-2xl: 32px
--spacing-3xl: 48px
```

### Bordas e Sombras
```css
--radius-sm: 8px
--radius-md: 12px
--radius-lg: 16px
--radius-xl: 20px
--radius-full: 9999px

--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04)
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08)
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12)
--shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.16)
```

### AnimaÃ§Ãµes
```css
--transition-fast: 150ms ease
--transition-normal: 250ms ease
--transition-slow: 350ms ease
--spring-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

---

## ðŸ“¦ ESTRUTURA DE PASTAS

```
src/
â”œâ”€â”€ features/                    # Novas funcionalidades TORQ
â”‚   â”œâ”€â”€ damage-detection/        # ðŸ”µ 1. Reconhecimento de Danos
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ hooks/
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â””â”€â”€ types/
â”‚   â”‚
â”‚   â”œâ”€â”€ obd-scanner/             # ðŸ”µ 2 & 3. Scanner OBD-II
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ hooks/
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â””â”€â”€ types/
â”‚   â”‚
â”‚   â”œâ”€â”€ vehicle-history/         # ðŸ”µ 4. HistÃ³rico do VeÃ­culo
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ hooks/
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â””â”€â”€ types/
â”‚   â”‚
â”‚   â”œâ”€â”€ voice-assistant/         # ðŸ”µ 5. Busca por Voz
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ hooks/
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â””â”€â”€ types/
â”‚   â”‚
â”‚   â”œâ”€â”€ invoice-whatsapp/        # ðŸ”µ 6. NF no WhatsApp
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ hooks/
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â””â”€â”€ types/
â”‚   â”‚
â”‚   â”œâ”€â”€ parts-compatibility/     # ðŸ”µ 7 & 8. Compatibilidade de PeÃ§as
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ hooks/
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â””â”€â”€ types/
â”‚   â”‚
â”‚   â”œâ”€â”€ stock-prediction/        # ðŸ”µ 9. PrevisÃ£o de Consumo
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ hooks/
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â””â”€â”€ types/
â”‚   â”‚
â”‚   â”œâ”€â”€ parts-history/           # ðŸ”µ 10. HistÃ³rico de PeÃ§as
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ hooks/
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â””â”€â”€ types/
â”‚   â”‚
â”‚   â”œâ”€â”€ multiuse-parts/          # ðŸ”µ 11. PeÃ§as Multiuso
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ hooks/
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â””â”€â”€ types/
â”‚   â”‚
â”‚   â”œâ”€â”€ damage-report/           # ðŸ”µ 12. RelatÃ³rio de Danos PDF
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ hooks/
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â””â”€â”€ types/
â”‚   â”‚
â”‚   â””â”€â”€ vehicle-health/          # ðŸ”µ 13. SaÃºde do VeÃ­culo
â”‚       â”œâ”€â”€ components/
â”‚       â”œâ”€â”€ hooks/
â”‚       â”œâ”€â”€ services/
â”‚       â””â”€â”€ types/
â”‚
â”œâ”€â”€ shared/                      # Componentes compartilhados
â”‚   â”œâ”€â”€ ui/                      # UI primitivos Apple-like
â”‚   â””â”€â”€ layouts/                 # Layouts reutilizÃ¡veis
```

---

## ðŸ—“ï¸ ROADMAP DE IMPLEMENTAÃ‡ÃƒO

### SPRINT 1 - FUNDAÃ‡ÃƒO (Semana 1-2)
**Objetivo:** Criar base sÃ³lida de componentes e infraestrutura

| Tarefa | Prioridade | Estimativa |
|--------|------------|------------|
| Criar design tokens globais | Alta | 4h |
| Componentes UI base Apple-like | Alta | 8h |
| Estrutura de pastas features/ | Alta | 2h |
| Configurar tipos TypeScript | MÃ©dia | 4h |

### SPRINT 2 - VOICE ASSISTANT (Semana 3-4)
**ðŸ”µ Funcionalidade 5: Busca Inteligente por Voz**

| Tarefa | Prioridade | Estimativa |
|--------|------------|------------|
| Ãcone flutuante draggable | Alta | 6h |
| AnimaÃ§Ãµes Siri-like | Alta | 4h |
| Speech Recognition API | Alta | 8h |
| Parser de comandos especÃ­ficos | Alta | 12h |
| IntegraÃ§Ã£o com todas as pÃ¡ginas | Alta | 6h |
| PersistÃªncia de posiÃ§Ã£o | MÃ©dia | 2h |

### SPRINT 3 - DAMAGE DETECTION (Semana 5-6)
**ðŸ”µ Funcionalidades 1 e 12: Reconhecimento de Danos + PDF**

| Tarefa | Prioridade | Estimativa |
|--------|------------|------------|
| IntegraÃ§Ã£o com API de visÃ£o (OpenAI/Google) | Alta | 8h |
| UI de anÃ¡lise de fotos | Alta | 6h |
| MarcaÃ§Ã£o visual de danos | Alta | 8h |
| GeraÃ§Ã£o de PDF com jsPDF | Alta | 6h |
| Salvamento no histÃ³rico | Alta | 4h |

### SPRINT 4 - OBD SCANNER (Semana 7-8)
**ðŸ”µ Funcionalidades 2 e 3: Scanner OBD-II**

| Tarefa | Prioridade | Estimativa |
|--------|------------|------------|
| IntegraÃ§Ã£o Bluetooth Web API | Alta | 12h |
| Parser de cÃ³digos DTC | Alta | 8h |
| TraduÃ§Ã£o e explicaÃ§Ã£o de cÃ³digos | Alta | 6h |
| UI do scanner no check-in | Alta | 4h |
| UI do scanner no orÃ§amento | Alta | 4h |
| Salvamento no histÃ³rico | Alta | 4h |

### SPRINT 5 - VEHICLE HISTORY (Semana 9-10)
**ðŸ”µ Funcionalidades 4 e 13: HistÃ³rico + SaÃºde do VeÃ­culo**

| Tarefa | Prioridade | Estimativa |
|--------|------------|------------|
| Timeline visual do veÃ­culo | Alta | 8h |
| AgregaÃ§Ã£o de dados (fotos, OBD, peÃ§as) | Alta | 6h |
| Painel de saÃºde do veÃ­culo | Alta | 8h |
| Alertas de revisÃ£o | Alta | 4h |
| RecomendaÃ§Ãµes automÃ¡ticas | MÃ©dia | 6h |

### SPRINT 6 - PARTS INTELLIGENCE (Semana 11-12)
**ðŸ”µ Funcionalidades 7, 8, 10 e 11: Compatibilidade de PeÃ§as**

| Tarefa | Prioridade | Estimativa |
|--------|------------|------------|
| Busca semÃ¢ntica de peÃ§as | Alta | 10h |
| API de equivalÃªncias | Alta | 8h |
| SugestÃµes do mercado externo | Alta | 8h |
| HistÃ³rico de peÃ§as do cliente | Alta | 6h |
| AnÃ¡lise de peÃ§as multiuso | Alta | 6h |

### SPRINT 7 - STOCK PREDICTION (Semana 13-14)
**ðŸ”µ Funcionalidade 9: PrevisÃ£o de Consumo**

| Tarefa | Prioridade | Estimativa |
|--------|------------|------------|
| Algoritmo de previsÃ£o | Alta | 10h |
| Dashboard de previsÃµes | Alta | 6h |
| Alertas de reposiÃ§Ã£o | Alta | 4h |
| AnÃ¡lise de giro de estoque | Alta | 6h |

### SPRINT 8 - WHATSAPP INTEGRATION (Semana 15-16)
**ðŸ”µ Funcionalidade 6: NF no WhatsApp**

| Tarefa | Prioridade | Estimativa |
|--------|------------|------------|
| GeraÃ§Ã£o automÃ¡tica PDF/XML | Alta | 6h |
| IntegraÃ§Ã£o WhatsApp API | Alta | 8h |
| Armazenamento Firebase | Alta | 4h |
| Reenvio sem nova API call | Alta | 4h |
| Comandos de voz para envio | Alta | 6h |

---

## ðŸ“ ESPECIFICAÃ‡Ã•ES DETALHADAS

### ðŸ”µ 1. RECONHECIMENTO AUTOMÃTICO DE DANOS

**LocalizaÃ§Ã£o:** `/checkin` â†’ Modal "Novo Check-in" â†’ Step "Fotos"

**Fluxo:**
1. UsuÃ¡rio tira foto no check-in
2. Foto Ã© enviada para API de visÃ£o (OpenAI Vision ou Google Cloud Vision)
3. IA analisa e retorna:
   - Tipo de dano (risco, amassado, trinca, etc.)
   - LocalizaÃ§Ã£o na imagem (bounding box)
   - Severidade (leve, moderado, grave)
   - ConfianÃ§a da detecÃ§Ã£o (%)
4. Resultado exibido abaixo da foto com marcaÃ§Ãµes visuais
5. Dados salvos no check-in

**UI Components:**
- `DamageDetectionOverlay` - Overlay com marcaÃ§Ãµes na foto
- `DamageResultCard` - Card com resultado da anÃ¡lise
- `DamageSeverityBadge` - Badge de severidade

---

### ðŸ”µ 5. BUSCA INTELIGENTE POR VOZ

**LocalizaÃ§Ã£o:** Todas as pÃ¡ginas (Ã­cone flutuante)

**CaracterÃ­sticas do Ãcone:**
- Circular, 56px de diÃ¢metro
- Gradiente sutil azul Apple
- Draggable com fÃ­sica de inÃ©rcia
- Snap para cantos da tela
- Persiste posiÃ§Ã£o no localStorage
- AnimaÃ§Ã£o de ondas ao ouvir (estilo Siri)

**Comandos Aceitos (exemplos):**
```
"Mostrar o orÃ§amento do JoÃ£o Silva do Corolla de ontem"
"Enviar a Ãºltima nota fiscal do cliente Marcos"
"Mostrar peÃ§as compatÃ­veis com Hilux 2012"
"Buscar scanner OBD do Peugeot do JoÃ£o de anteontem"
"Mostrar fotos do check-in do Corolla do JosÃ© do dia 23"
```

**Parser de Comandos:**
- Extrai: aÃ§Ã£o, entidade, cliente, veÃ­culo, data
- Rejeita comandos vagos
- Feedback visual de entendimento

---

## âœ… CHECKLIST DE QUALIDADE

### Design
- [ ] Cores consistentes com tema (light/dark)
- [ ] Tipografia SF Pro ou equivalente
- [ ] EspaÃ§amentos mÃºltiplos de 4px
- [ ] Bordas arredondadas consistentes
- [ ] Sombras sutis e elegantes
- [ ] AnimaÃ§Ãµes suaves (150-350ms)
- [ ] Feedback visual em todas interaÃ§Ãµes

### CÃ³digo
- [ ] TypeScript em novos arquivos
- [ ] Componentes pequenos e focados
- [ ] Hooks customizados para lÃ³gica
- [ ] Services para chamadas externas
- [ ] Testes unitÃ¡rios bÃ¡sicos
- [ ] DocumentaÃ§Ã£o inline

### UX
- [ ] Loading states em todas operaÃ§Ãµes
- [ ] Error handling gracioso
- [ ] Empty states informativos
- [ ] Feedback de sucesso/erro
- [ ] Acessibilidade (ARIA labels)

---


## 🚦 STATUS DE IMPLEMENTAÇÃO

| # | Funcionalidade | Status | Sprint | Testes |
|---|----------------|--------|--------|--------|
| 1 | Reconhecimento de Danos | ✅ Completo | 3 | 20 ✓ |
| 2 | Scanner OBD Check-in | ✅ Completo | 4 | 20 ✓ |
| 3 | Scanner OBD Orçamento | ✅ Completo | 4 | - |
| 4 | Histórico do Veículo | ✅ Completo | 5 | 19 ✓ |
| 5 | Busca por Voz | ✅ Completo | 2 | - |
| 6 | NF no WhatsApp | ✅ Completo | 8 | 24 ✓ |
| 7 | Compatibilidade Peças | ✅ Completo | 6 | 23 ✓ |
| 8 | Sugestões de Serviços | ✅ Completo | 6 | 27 ✓ |
| 9 | Previsão de Estoque | ✅ Completo | 7 | 28 ✓ |
| 10 | Histórico Manutenção | ✅ Completo | 6 | - |
| 11 | Peças Multiuso | ✅ Completo | 6 | 27 ✓ |
| 12 | Relatório Danos PDF | ✅ Completo | 3 | 30 ✓ |
| 13 | Saúde do Veículo | ✅ Completo | 5 | 32 ✓ |

### 📊 Resumo de Progresso
- **Features Completas:** 13/13 (100%) 🎉
- **Testes Passando:** 241
- **Build de Produção:** ✅ Sucesso
- **Erros TypeScript:** 0

---

## 📝 PRÓXIMOS PASSOS

1. ~~Criar design tokens~~ ✅ Concluído
2. ~~Criar componentes UI base~~ ✅ Concluído
3. ~~Implementar Voice Assistant~~ ✅ Concluído
4. ~~Implementar Relatório Danos PDF~~ ✅ Concluído
5. ~~Implementar Saúde do Veículo~~ ✅ Concluído
6. ~~Implementar Peças Multiuso~~ ✅ Concluído

### 🎉 PROJETO 100% COMPLETO!
Todas as 13 funcionalidades do TORQ foram implementadas com sucesso.

---

*Documento criado em: 28/11/2025*
*Última atualização: 28/11/2025*
