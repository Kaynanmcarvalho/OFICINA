# 🚀 GUIA DE INÍCIO RÁPIDO: IMPLEMENTAÇÃO DO MÓDULO DE CAIXA

**Para:** Desenvolvedores  
**Objetivo:** Implementar módulo de caixa profissional em 5 semanas  
**Pré-requisitos:** React, Firestore, Zustand

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### SEMANA 1: ESTRUTURA BÁSICA

#### Dia 1-2: Setup Inicial
- [ ] Criar pasta `src/pages/caixa/`
- [ ] Criar pasta `src/store/caixaStore.jsx`
- [ ] Criar collection `caixas` no Firestore
- [ ] Criar regras de segurança no Firestore

**Código:**
```javascript
// src/store/caixaStore.jsx
import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useCaixaStore = create(
  persist(
    (set, get) => ({
      // Estado
      caixaAtual: null,
      caixasAbertos: [],
      loading: false,
      error: null,
      
      // Ações
      abrirCaixa: async (dados) => {
        // Implementar
      },
      
      fecharCaixa: async (dados) => {
        // Implementar
      },
      
      registrarSangria: async (dados) => {
        // Implementar
      },
      
      registrarReforco: async (dados) => {
        // Implementar
      },
      
      buscarCaixaAtual: async () => {
        // Implementar
      }
    }),
    {
      name: 'caixa-storage',
      partialize: (state) => ({ caixaAtual: state.caixaAtual })
    }
  )
);
```

#### Dia 3-4: Página Principal
- [ ] Criar `src/pages/caixa/CaixaPage.jsx`
- [ ] Implementar estados (fechado/aberto)
- [ ] Criar componente de resumo

**Código:**
```javascript
// src/pages/caixa/CaixaPage.jsx
import React, { useEffect } from 'react';
import { useCaixaStore } from '../../store/caixaStore';
import CaixaFechado from './components/CaixaFechado';
import CaixaAberto from './components/CaixaAberto';

const CaixaPage = () => {
  const { caixaAtual, buscarCaixaAtual, loading } = useCaixaStore();
  
  useEffect(() => {
    buscarCaixaAtual();
  }, []);
  
  if (loading) return <Loading />;
  
  return (
    <div className="p-6">
      {caixaAtual?.status === 'aberto' ? (
        <CaixaAberto caixa={caixaAtual} />
      ) : (
        <CaixaFechado />
      )}
    </div>
  );
};

export default CaixaPage;
```

#### Dia 5: Modal de Abertura
- [ ] Criar `src/pages/caixa/modals/ModalAberturaCaixa.jsx`
- [ ] Implementar validações
- [ ] Integrar com Firestore

---

### SEMANA 2: MOVIMENTAÇÕES

#### Dia 1-2: Sangria
- [ ] Criar `src/pages/caixa/modals/ModalSangria.jsx`
- [ ] Implementar sistema de autorização
- [ ] Registrar movimentação

#### Dia 3-4: Reforço
- [ ] Criar `src/pages/caixa/modals/ModalReforco.jsx`
- [ ] Implementar validações
- [ ] Registrar movimentação

#### Dia 5: Integração com Vendas
- [ ] Atualizar `src/pages/Caixa.jsx` (PDV)
- [ ] Adicionar campo `caixaId` em vendas
- [ ] Bloquear vendas sem caixa aberto
- [ ] Registrar movimentações de vendas

**Código:**
```javascript
// src/pages/Caixa.jsx - Atualização
const handleSaleConfirm = async (confirmationData) => {
  // Verificar se há caixa aberto
  const { caixaAtual } = useCaixaStore.getState();
  
  if (!caixaAtual || caixaAtual.status !== 'aberto') {
    showNotification('Abra o caixa antes de fazer vendas', 'error');
    return;
  }
  
  // Adicionar caixaId na venda
  const vendaData = {
    ...confirmationData,
    caixaId: caixaAtual.id,
    caixaNumero: caixaAtual.numero,
    operadorCaixa: {
      uid: currentUser.uid,
      nome: currentUser.displayName
    }
  };
  
  // Salvar venda
  const vendaDoc = await addDoc(collection(db, 'vendas'), vendaData);
  
  // Registrar movimentação no caixa
  await useCaixaStore.getState().registrarMovimentacao({
    tipo: 'venda',
    valor: vendaData.total,
    formaPagamento: vendaData.paymentMethod,
    vendaId: vendaDoc.id
  });
};
```

---

### SEMANA 3: FECHAMENTO E RELATÓRIOS

#### Dia 1-3: Modal de Fechamento
- [ ] Criar `src/pages/caixa/modals/ModalFechamentoCaixa.jsx`
- [ ] Implementar cálculo de diferença
- [ ] Implementar validações de diferença
- [ ] Sistema de justificativa

#### Dia 4-5: Relatório PDF
- [ ] Instalar `jspdf` e `jspdf-autotable`
- [ ] Criar `src/services/caixaReportService.js`
- [ ] Implementar geração de PDF

**Código:**
```javascript
// src/services/caixaReportService.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

class CaixaReportService {
  gerarRelatorioPDF(caixa) {
    const doc = new jsPDF();
    
    // Cabeçalho
    doc.setFontSize(18);
    doc.text('RELATÓRIO DE FECHAMENTO DE CAIXA', 105, 20, { align: 'center' });
    
    // Dados do caixa
    doc.setFontSize(12);
    doc.text(`Caixa #${caixa.numero}`, 20, 40);
    doc.text(`Data: ${new Date(caixa.dataAbertura).toLocaleDateString()}`, 20, 50);
    doc.text(`Operador: ${caixa.operadorAbertura.nome}`, 20, 60);
    
    // Tabela de movimentações
    doc.autoTable({
      startY: 80,
      head: [['Tipo', 'Valor', 'Hora']],
      body: caixa.movimentacoes.map(mov => [
        mov.tipo,
        `R$ ${mov.valor.toFixed(2)}`,
        new Date(mov.timestamp).toLocaleTimeString()
      ])
    });
    
    // Resumo
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.text(`Saldo Esperado: R$ ${caixa.saldoEsperado.toFixed(2)}`, 20, finalY);
    doc.text(`Saldo Contado: R$ ${caixa.saldoContado.toFixed(2)}`, 20, finalY + 10);
    doc.text(`Diferença: R$ ${caixa.diferenca.toFixed(2)}`, 20, finalY + 20);
    
    // Salvar
    doc.save(`caixa_${caixa.numero}_${new Date().toISOString().split('T')[0]}.pdf`);
  }
}

export default new CaixaReportService();
```

---

### SEMANA 4: HISTÓRICO E AUDITORIA

#### Dia 1-2: Histórico de Caixas
- [ ] Criar `src/pages/caixa/HistoricoCaixas.jsx`
- [ ] Implementar listagem
- [ ] Implementar filtros

#### Dia 3-4: Detalhes do Caixa
- [ ] Criar `src/pages/caixa/DetalhesCaixa.jsx`
- [ ] Mostrar todas as movimentações
- [ ] Permitir download de PDF

#### Dia 5: Dashboard
- [ ] Criar `src/pages/caixa/DashboardCaixa.jsx`
- [ ] Implementar métricas
- [ ] Criar gráficos

---

### SEMANA 5: TESTES E AJUSTES

#### Dia 1-2: Testes Unitários
- [ ] Testar store
- [ ] Testar validações
- [ ] Testar cálculos

#### Dia 3-4: Testes de Integração
- [ ] Testar fluxo completo
- [ ] Testar cenários de erro
- [ ] Testar permissões

#### Dia 5: Documentação e Deploy
- [ ] Documentar código
- [ ] Criar guia de usuário
- [ ] Deploy em produção

---

## 🔧 FERRAMENTAS NECESSÁRIAS

### Dependências NPM
```bash
npm install jspdf jspdf-autotable
npm install date-fns
npm install recharts
```

### Estrutura de Pastas
```
src/
├── pages/
│   └── caixa/
│       ├── CaixaPage.jsx
│       ├── HistoricoCaixas.jsx
│       ├── DetalhesCaixa.jsx
│       ├── DashboardCaixa.jsx
│       ├── components/
│       │   ├── CaixaFechado.jsx
│       │   ├── CaixaAberto.jsx
│       │   ├── ResumoCaixa.jsx
│       │   └── MovimentacaoCard.jsx
│       └── modals/
│           ├── ModalAberturaCaixa.jsx
│           ├── ModalFechamentoCaixa.jsx
│           ├── ModalSangria.jsx
│           └── ModalReforco.jsx
├── store/
│   └── caixaStore.jsx
├── services/
│   ├── caixaService.js
│   └── caixaReportService.js
└── utils/
    └── caixaValidators.js
```

---

## 📝 REGRAS DE FIRESTORE

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Caixas
    match /caixas/{caixaId} {
      // Leitura: Apenas da própria empresa
      allow read: if request.auth != null && 
                     resource.data.empresaId == request.auth.token.empresaId;
      
      // Criação: Apenas usuários autenticados
      allow create: if request.auth != null &&
                       request.resource.data.empresaId == request.auth.token.empresaId &&
                       request.resource.data.operadorAbertura.uid == request.auth.uid;
      
      // Atualização: Apenas operador do caixa ou gerente
      allow update: if request.auth != null &&
                       (resource.data.operadorAbertura.uid == request.auth.uid ||
                        request.auth.token.role == 'gerente' ||
                        request.auth.token.role == 'admin');
      
      // Deleção: Apenas admin
      allow delete: if request.auth != null &&
                       request.auth.token.role == 'admin';
    }
    
    // Vendas (atualizar para incluir caixaId)
    match /vendas/{vendaId} {
      allow read: if request.auth != null &&
                     resource.data.empresaId == request.auth.token.empresaId;
      
      allow create: if request.auth != null &&
                       request.resource.data.empresaId == request.auth.token.empresaId &&
                       request.resource.data.caixaId != null; // Obrigatório
      
      allow update: if request.auth != null &&
                       (resource.data.userId == request.auth.uid ||
                        request.auth.token.role == 'gerente' ||
                        request.auth.token.role == 'admin');
    }
  }
}
```

---

## 🧪 TESTES

### Cenários de Teste Obrigatórios

1. **Abertura de Caixa**
   - [ ] Abrir caixa com saldo inicial válido
   - [ ] Tentar abrir caixa com saldo zero
   - [ ] Tentar abrir segundo caixa (deve falhar)

2. **Vendas**
   - [ ] Fazer venda com caixa aberto
   - [ ] Tentar vender sem caixa aberto (deve falhar)
   - [ ] Venda em dinheiro (afeta caixa físico)
   - [ ] Venda em PIX (não afeta caixa físico)

3. **Sangria**
   - [ ] Sangria com autorização
   - [ ] Sangria sem autorização (deve falhar)
   - [ ] Sangria maior que saldo (deve falhar)

4. **Fechamento**
   - [ ] Fechamento sem diferença
   - [ ] Fechamento com diferença pequena (< R$ 5)
   - [ ] Fechamento com diferença média (R$ 5-50)
   - [ ] Fechamento com diferença grande (> R$ 50)

5. **Cancelamento**
   - [ ] Cancelar venda e verificar estorno no caixa
   - [ ] Cancelar venda sem autorização (deve falhar)

---

## 🎯 MÉTRICAS DE SUCESSO

### Performance
- [ ] Abertura de caixa < 2 segundos
- [ ] Fechamento de caixa < 3 segundos
- [ ] Geração de PDF < 5 segundos

### Usabilidade
- [ ] Operador consegue abrir caixa em < 1 minuto
- [ ] Operador consegue fechar caixa em < 2 minutos
- [ ] Taxa de erro < 5%

### Confiabilidade
- [ ] 100% das vendas vinculadas ao caixa
- [ ] 100% das movimentações registradas
- [ ] 0% de perda de dados

---

## 📞 SUPORTE

**Dúvidas técnicas:** Consultar especificação completa  
**Problemas de implementação:** Revisar auditoria crítica  
**Sugestões de melhoria:** Documentar e discutir com equipe

---

**Boa sorte na implementação! 🚀**
