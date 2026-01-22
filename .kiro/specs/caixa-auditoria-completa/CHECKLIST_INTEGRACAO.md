# ✅ CHECKLIST DE INTEGRAÇÃO - MÓDULO DE CAIXA

**Data:** 22 de Janeiro de 2025  
**Responsável:** Desenvolvedor  
**Prazo:** 1-2 dias

---

## 📋 ANTES DE COMEÇAR

- [ ] Ler `RESUMO_SESSAO_ATUAL.md`
- [ ] Ler `GUIA_USO_RAPIDO.md`
- [ ] Verificar que todos os componentes foram criados
- [ ] Fazer backup do código atual
- [ ] Criar branch de desenvolvimento: `feature/modulo-caixa-fase1`

---

## 🔧 INTEGRAÇÃO NO CAIXAPREMIUM.JSX

### 1. IMPORTS
```javascript
// No topo do arquivo, adicionar:
import useCaixaStore from '../store/caixaStore';
import ModalAberturaCaixa from '../components/modals/ModalAberturaCaixa';
import ModalFechamentoCaixa from '../components/modals/ModalFechamentoCaixa';
import BannerCaixaAberto from '../components/caixa/BannerCaixaAberto';
```

- [ ] Adicionar imports no topo do arquivo
- [ ] Verificar que os caminhos estão corretos
- [ ] Testar se não há erros de importação

---

### 2. ESTADOS

```javascript
// Dentro do componente CaixaPremium, adicionar:
const [showModalAberturaCaixa, setShowModalAberturaCaixa] = useState(false);
const [showModalFechamentoCaixa, setShowModalFechamentoCaixa] = useState(false);
```

- [ ] Adicionar estados dos modais
- [ ] Verificar que useState está importado

---

### 3. STORE

```javascript
// Dentro do componente CaixaPremium, adicionar:
const { caixaAtual, carregarCaixaAberto, registrarVenda } = useCaixaStore();
```

- [ ] Adicionar hook do store
- [ ] Verificar que o store está funcionando

---

### 4. CARREGAR CAIXA ABERTO

```javascript
// Adicionar useEffect para carregar caixa aberto:
useEffect(() => {
  if (currentUser) {
    carregarCaixaAberto(currentUser);
  }
}, [currentUser, carregarCaixaAberto]);
```

- [ ] Adicionar useEffect
- [ ] Testar se carrega caixa aberto ao montar
- [ ] Verificar console para erros

---

### 5. VERIFICAÇÃO ANTES DE VENDER

```javascript
// Modificar handleCheckout:
const handleCheckout = useCallback(() => {
  // NOVO: Verificar se tem caixa aberto
  if (!caixaAtual) {
    showNotification('Abra o caixa antes de fazer vendas', 'error');
    setShowModalAberturaCaixa(true);
    return;
  }
  
  if (cartItems.length === 0) { 
    showNotification('Carrinho vazio', 'error'); 
    return; 
  }
  
  // ... resto do código existente ...
}, [caixaAtual, cartItems, showNotification]);
```

- [ ] Adicionar verificação de caixa aberto
- [ ] Testar que não permite vender sem caixa
- [ ] Verificar que abre modal de abertura

---

### 6. REGISTRAR VENDA NO CAIXA

```javascript
// Modificar handleSaleConfirm:
const handleSaleConfirm = useCallback(async (confirmationData) => {
  try {
    // ... código existente de criar venda ...
    
    const vendaData = {
      // ... campos existentes ...
      
      // NOVOS CAMPOS:
      caixaId: caixaAtual?.id || null,
      caixaNumero: caixaAtual?.numero || null,
      operadorCaixa: caixaAtual ? {
        uid: caixaAtual.operadorAbertura.uid,
        nome: caixaAtual.operadorAbertura.nome
      } : null,
      afetaCaixaFisico: paymentData.pagamentos.some(p => 
        p.metodo.toLowerCase() === 'dinheiro'
      ),
      valorCaixaFisico: paymentData.pagamentos
        .filter(p => p.metodo.toLowerCase() === 'dinheiro')
        .reduce((sum, p) => sum + parseFloat(p.valor || 0), 0)
    };
    
    const vendaDoc = await addDoc(collection(db, 'vendas'), vendaData);
    
    // NOVO: Registrar venda no caixa
    if (caixaAtual) {
      await registrarVenda(
        vendaDoc.id,
        paymentData.totalComDesconto,
        paymentData.pagamentos
      );
    }
    
    // ... resto do código existente ...
  } catch (error) {
    console.error(error);
    showNotification('Erro ao finalizar', 'error');
  }
}, [caixaAtual, registrarVenda, /* ... outras dependências ... */]);
```

- [ ] Adicionar campos de caixa na venda
- [ ] Chamar registrarVenda após salvar
- [ ] Testar que atualiza o caixa
- [ ] Verificar dados no Firestore

---

### 7. BANNER NO TOPO

```javascript
// No return do componente, ANTES do header:
return (
  <div className="pdv-container">
    {/* NOVO: Banner de caixa aberto */}
    <AnimatePresence>
      {caixaAtual && (
        <BannerCaixaAberto 
          onFecharCaixa={() => setShowModalFechamentoCaixa(true)} 
        />
      )}
    </AnimatePresence>
    
    {/* Header existente */}
    <header className="pdv-header">
      {/* ... código existente ... */}
    </header>
    
    {/* ... resto do código ... */}
  </div>
);
```

- [ ] Adicionar banner antes do header
- [ ] Verificar que aparece quando tem caixa aberto
- [ ] Verificar que some quando não tem caixa
- [ ] Testar botão de fechar caixa

---

### 8. MODAIS NO FINAL

```javascript
// No return do componente, DEPOIS dos modais existentes:
{/* ... modais existentes ... */}

{/* NOVO: Modais de caixa */}
<AnimatePresence>
  {showModalAberturaCaixa && (
    <ModalAberturaCaixa
      isOpen={showModalAberturaCaixa}
      onClose={() => setShowModalAberturaCaixa(false)}
      onSuccess={() => {
        showNotification('Caixa aberto com sucesso!');
        setShowModalAberturaCaixa(false);
      }}
    />
  )}
</AnimatePresence>

<AnimatePresence>
  {showModalFechamentoCaixa && (
    <ModalFechamentoCaixa
      isOpen={showModalFechamentoCaixa}
      onClose={() => setShowModalFechamentoCaixa(false)}
      onSuccess={(resultado) => {
        const msg = resultado.diferenca === 0 
          ? 'Caixa fechado! Sem diferenças.' 
          : `Caixa fechado! Diferença: ${formatCurrency(Math.abs(resultado.diferenca))}`;
        showNotification(msg);
        setShowModalFechamentoCaixa(false);
      }}
    />
  )}
</AnimatePresence>
```

- [ ] Adicionar modais no final
- [ ] Testar modal de abertura
- [ ] Testar modal de fechamento
- [ ] Verificar animações

---

## 🗄️ FIRESTORE

### 1. COLLECTION CAIXAS

- [ ] Verificar que collection `caixas` existe
- [ ] Testar criar documento
- [ ] Verificar estrutura de dados
- [ ] Verificar timestamps

### 2. COLLECTION VENDAS

- [ ] Verificar que novos campos são salvos
- [ ] Testar query de vendas por caixa
- [ ] Verificar integridade dos dados

### 3. ÍNDICES

Criar índices no Firestore Console:

```
Collection: caixas
Fields: empresaId, status, dataAbertura
```

```
Collection: caixas
Fields: empresaId, operadorAbertura.uid, status
```

- [ ] Criar índice 1
- [ ] Criar índice 2
- [ ] Testar queries

### 4. RULES

Adicionar regras de segurança:

```javascript
match /caixas/{caixaId} {
  allow read: if request.auth != null 
    && request.auth.token.empresaId == resource.data.empresaId;
  
  allow create: if request.auth != null 
    && request.auth.token.empresaId == request.resource.data.empresaId
    && request.resource.data.status == 'aberto';
  
  allow update: if request.auth != null 
    && request.auth.token.empresaId == resource.data.empresaId
    && (resource.data.status == 'aberto' || resource.data.status == 'fechado');
}
```

- [ ] Adicionar rules no Firestore
- [ ] Testar permissões
- [ ] Verificar segurança

---

## 🧪 TESTES

### 1. TESTE DE ABERTURA

- [ ] Abrir o sistema
- [ ] Verificar que não tem caixa aberto
- [ ] Tentar fazer venda (deve pedir para abrir)
- [ ] Abrir modal de abertura
- [ ] Informar troco inicial: R$ 100,00
- [ ] Selecionar turno: Integral
- [ ] Adicionar observação: "Teste"
- [ ] Clicar em "Abrir Caixa"
- [ ] Verificar que banner aparece
- [ ] Verificar dados no Firestore

### 2. TESTE DE VENDAS

- [ ] Adicionar produto ao carrinho
- [ ] Finalizar venda
- [ ] Pagar em dinheiro: R$ 50,00
- [ ] Confirmar venda
- [ ] Verificar que banner atualiza
- [ ] Verificar saldo esperado: R$ 150,00
- [ ] Verificar dados no Firestore

- [ ] Fazer outra venda
- [ ] Pagar em PIX: R$ 30,00
- [ ] Confirmar venda
- [ ] Verificar que saldo esperado continua R$ 150,00
- [ ] Verificar que total de vendas aumentou

### 3. TESTE DE FECHAMENTO

- [ ] Clicar em "Fechar Caixa"
- [ ] Verificar resumo de movimentações
- [ ] Informar saldo contado: R$ 150,00
- [ ] Verificar diferença: R$ 0,00
- [ ] Clicar em "Fechar Caixa"
- [ ] Verificar que banner some
- [ ] Verificar dados no Firestore

### 4. TESTE DE DIFERENÇA

- [ ] Abrir novo caixa: R$ 100,00
- [ ] Fazer venda em dinheiro: R$ 50,00
- [ ] Fechar caixa
- [ ] Informar saldo contado: R$ 140,00 (faltando R$ 10)
- [ ] Verificar alerta de diferença
- [ ] Verificar que pede justificativa
- [ ] Informar justificativa: "Teste de diferença"
- [ ] Fechar caixa
- [ ] Verificar dados no Firestore

### 5. TESTE DE AUTORIZAÇÃO

- [ ] Abrir novo caixa: R$ 100,00
- [ ] Fazer venda em dinheiro: R$ 50,00
- [ ] Fechar caixa
- [ ] Informar saldo contado: R$ 135,00 (faltando R$ 15)
- [ ] Verificar que pede autorização de gerente
- [ ] Informar senha: "teste123"
- [ ] Fechar caixa
- [ ] Verificar dados no Firestore

---

## 🎨 TESTES DE UI/UX

- [ ] Verificar responsividade
- [ ] Testar em diferentes resoluções
- [ ] Verificar tema claro/escuro
- [ ] Testar animações
- [ ] Verificar feedback visual
- [ ] Testar atalhos de teclado (ESC para fechar)
- [ ] Verificar acessibilidade

---

## 📱 TESTES DE PERFORMANCE

- [ ] Verificar tempo de carregamento
- [ ] Testar com muitas vendas
- [ ] Verificar uso de memória
- [ ] Testar queries do Firestore
- [ ] Verificar latência de rede

---

## 🐛 TESTES DE ERRO

- [ ] Testar sem internet
- [ ] Testar com dados inválidos
- [ ] Testar com usuário sem permissão
- [ ] Testar com Firestore offline
- [ ] Verificar mensagens de erro

---

## 📝 DOCUMENTAÇÃO

- [ ] Atualizar README.md
- [ ] Documentar novos componentes
- [ ] Adicionar comentários no código
- [ ] Criar changelog
- [ ] Atualizar guia do usuário

---

## 🚀 DEPLOY

### 1. PRÉ-DEPLOY

- [ ] Todos os testes passando
- [ ] Code review completo
- [ ] Sem console.log desnecessários
- [ ] Sem TODOs pendentes
- [ ] Documentação atualizada

### 2. STAGING

- [ ] Deploy em ambiente de staging
- [ ] Testes em staging
- [ ] Validação com stakeholders
- [ ] Correção de bugs encontrados

### 3. PRODUÇÃO

- [ ] Backup do banco de dados
- [ ] Deploy em produção
- [ ] Monitoramento de erros
- [ ] Suporte ativo
- [ ] Comunicação com usuários

---

## ✅ CRITÉRIOS DE ACEITAÇÃO

### Funcionalidades Obrigatórias:
- [ ] Abrir caixa com troco inicial
- [ ] Fazer vendas vinculadas ao caixa
- [ ] Fechar caixa com conferência
- [ ] Calcular diferença automaticamente
- [ ] Justificar diferenças > R$ 5,00
- [ ] Autorizar diferenças > R$ 10,00
- [ ] Banner de caixa aberto funcional
- [ ] Dados salvos no Firestore

### Qualidade:
- [ ] Código limpo e organizado
- [ ] Sem bugs conhecidos
- [ ] Performance adequada
- [ ] UI/UX intuitiva
- [ ] Documentação completa

### Segurança:
- [ ] Validações no frontend
- [ ] Rules no Firestore
- [ ] Auditoria completa
- [ ] Dados imutáveis

---

## 📊 MÉTRICAS DE SUCESSO

- [ ] 100% dos testes passando
- [ ] 0 bugs críticos
- [ ] Tempo de abertura < 2s
- [ ] Tempo de fechamento < 3s
- [ ] Satisfação do usuário > 4/5

---

## 🎉 CONCLUSÃO

Quando todos os itens estiverem marcados:

1. ✅ Fazer merge para main
2. ✅ Criar tag de versão: `v1.0.0-fase1`
3. ✅ Comunicar equipe
4. ✅ Celebrar! 🎊

---

**Data de Conclusão:** ___/___/_____  
**Responsável:** _________________  
**Aprovado por:** _________________

---

**Última Atualização:** 22 de Janeiro de 2025  
**Próxima Fase:** FASE 2 - Sangria e Reforço
