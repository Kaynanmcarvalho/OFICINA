# 🔗 Exemplo de Integração - Módulo Inventory

## Como integrar o módulo de inventário com Orçamentos e Vendas

---

## 1. Importar o Hook de Integração

```javascript
import { useInventoryIntegration } from '../hooks/useInventoryIntegration';
```

---

## 2. Usar no Componente de Orçamento

### Exemplo: BudgetForm.jsx

```javascript
import { useState } from 'react';
import { useInventoryIntegration } from '../../hooks/useInventoryIntegration';
import ProductSelector from '../../components/inventory/ProductSelector';
import toast from 'react-hot-toast';

const BudgetForm = () => {
  const {
    addProductToBudget,
    removeProductFromBudget,
    checkStockAvailability,
  } = useInventoryIntegration();

  const [budgetItems, setBudgetItems] = useState([]);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [budgetId] = useState(`BDG-${Date.now()}`);

  // Adicionar produto ao orçamento
  const handleAddProduct = async (product) => {
    // Verificar disponibilidade
    const availability = checkStockAvailability(product.productId, product.quantity);
    
    if (!availability.available) {
      toast.error(availability.reason);
      return;
    }

    // Reservar estoque
    const result = await addProductToBudget(
      product.productId,
      product.quantity,
      budgetId
    );

    if (result.success) {
      setBudgetItems([...budgetItems, product]);
      setShowProductSelector(false);
      toast.success('Produto adicionado ao orçamento');
    }
  };

  // Remover produto do orçamento
  const handleRemoveProduct = async (product) => {
    const result = await removeProductFromBudget(
      product.productId,
      product.quantity,
      budgetId
    );

    if (result.success) {
      setBudgetItems(budgetItems.filter(item => item.productId !== product.productId));
      toast.success('Produto removido do orçamento');
    }
  };

  return (
    <div>
      <h2>Novo Orçamento</h2>

      {/* Botão para adicionar produtos */}
      <button onClick={() => setShowProductSelector(true)}>
        Adicionar Produto
      </button>

      {/* Lista de produtos no orçamento */}
      <div>
        {budgetItems.map((item) => (
          <div key={item.productId}>
            <span>{item.name}</span>
            <span>Qtd: {item.quantity}</span>
            <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
            <button onClick={() => handleRemoveProduct(item)}>
              Remover
            </button>
          </div>
        ))}
      </div>

      {/* Total */}
      <div>
        <strong>Total:</strong>
        R$ {budgetItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
      </div>

      {/* Seletor de Produtos */}
      {showProductSelector && (
        <ProductSelector
          onSelect={handleAddProduct}
          onClose={() => setShowProductSelector(false)}
          selectedProducts={budgetItems}
        />
      )}
    </div>
  );
};

export default BudgetForm;
```

---

## 3. Aprovar Orçamento (Baixa Definitiva)

```javascript
import { useInventoryIntegration } from '../../hooks/useInventoryIntegration';

const BudgetApproval = ({ budget, clientId }) => {
  const { approveBudget } = useInventoryIntegration();

  const handleApprove = async () => {
    const result = await approveBudget(
      budget.id,
      budget.items, // Array de { productId, quantity, price }
      clientId
    );

    if (result.success) {
      // Orçamento aprovado, estoque baixado, histórico do cliente atualizado
      console.log('Orçamento aprovado com sucesso!');
    }
  };

  return (
    <button onClick={handleApprove}>
      Aprovar Orçamento
    </button>
  );
};
```

---

## 4. Cancelar/Expirar Orçamento (Liberar Reservas)

```javascript
import { useInventoryIntegration } from '../../hooks/useInventoryIntegration';

const BudgetExpiration = ({ budget }) => {
  const { cancelBudget } = useInventoryIntegration();

  const handleCancel = async () => {
    const result = await cancelBudget(
      budget.id,
      budget.items
    );

    if (result.success) {
      // Reservas liberadas
      console.log('Orçamento cancelado, estoque liberado');
    }
  };

  // Auto-expirar após 48h
  useEffect(() => {
    const createdAt = new Date(budget.createdAt);
    const now = new Date();
    const hoursDiff = (now - createdAt) / (1000 * 60 * 60);

    if (hoursDiff >= 48 && budget.status === 'pending') {
      handleCancel();
    }
  }, [budget]);

  return (
    <button onClick={handleCancel}>
      Cancelar Orçamento
    </button>
  );
};
```

---

## 5. Venda Direta (Sem Orçamento)

```javascript
import { useInventoryIntegration } from '../../hooks/useInventoryIntegration';

const DirectSale = ({ clientId }) => {
  const { processSale } = useInventoryIntegration();
  const [saleItems, setSaleItems] = useState([]);

  const handleCompleteSale = async () => {
    const saleId = `SALE-${Date.now()}`;

    const result = await processSale(
      saleId,
      saleItems, // Array de { productId, quantity, price }
      clientId
    );

    if (result.success) {
      // Venda processada, estoque baixado, histórico do cliente atualizado
      console.log('Venda concluída com sucesso!');
    }
  };

  return (
    <div>
      {/* Adicionar produtos à venda */}
      <ProductSelector
        onSelect={(product) => setSaleItems([...saleItems, product])}
        selectedProducts={saleItems}
      />

      {/* Finalizar venda */}
      <button onClick={handleCompleteSale}>
        Finalizar Venda
      </button>
    </div>
  );
};
```

---

## 6. Entrada de Estoque (Compra/Reposição)

```javascript
import { useInventoryIntegration } from '../../hooks/useInventoryIntegration';

const StockEntry = ({ productId }) => {
  const { addStock } = useInventoryIntegration();
  const [quantity, setQuantity] = useState(0);
  const [lotData, setLotData] = useState({
    lote: '',
    fabricacao: '',
    validade: '',
  });

  const handleAddStock = async () => {
    const result = await addStock(
      productId,
      quantity,
      lotData, // Opcional
      'Compra de fornecedor'
    );

    if (result.success) {
      console.log('Estoque adicionado com sucesso!');
    }
  };

  return (
    <div>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        placeholder="Quantidade"
      />

      {/* Dados do lote (opcional) */}
      <input
        type="text"
        value={lotData.lote}
        onChange={(e) => setLotData({ ...lotData, lote: e.target.value })}
        placeholder="Número do Lote"
      />

      <button onClick={handleAddStock}>
        Adicionar ao Estoque
      </button>
    </div>
  );
};
```

---

## 7. Verificar Disponibilidade Antes de Adicionar

```javascript
import { useInventoryIntegration } from '../../hooks/useInventoryIntegration';

const ProductAvailability = ({ productId, quantity }) => {
  const { checkStockAvailability } = useInventoryIntegration();

  const availability = checkStockAvailability(productId, quantity);

  if (!availability.available) {
    return (
      <div className="text-red-600">
        ⚠️ {availability.reason}
      </div>
    );
  }

  return (
    <div className="text-green-600">
      ✓ Disponível ({availability.availableStock} em estoque)
    </div>
  );
};
```

---

## 8. Buscar Produtos para Autocompletar

```javascript
import { useState, useEffect } from 'react';
import { useInventoryIntegration } from '../../hooks/useInventoryIntegration';

const ProductAutocomplete = ({ onSelect }) => {
  const { searchProductsForSelection } = useInventoryIntegration();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchProductsForSelection(searchTerm).then(setResults);
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar produto..."
      />

      <ul>
        {results.map((product) => (
          <li key={product.id} onClick={() => onSelect(product)}>
            {product.name} - R$ {product.sale_price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

---

## 9. Obter Informações do Produto

```javascript
import { useInventoryIntegration } from '../../hooks/useInventoryIntegration';

const ProductInfo = ({ productId }) => {
  const { getProductInfo } = useInventoryIntegration();

  const product = getProductInfo(productId);

  if (!product) return <div>Produto não encontrado</div>;

  return (
    <div>
      <h3>{product.name}</h3>
      <p>SKU: {product.sku}</p>
      <p>Preço: R$ {product.sale_price.toFixed(2)}</p>
      <p>Disponível: {(product.stock_total || 0) - (product.stock_reserved || 0)}</p>
    </div>
  );
};
```

---

## 🎯 Fluxo Completo: Orçamento → Aprovação → Histórico

```javascript
// 1. Criar orçamento e reservar estoque
const budgetId = 'BDG-123';
await addProductToBudget(productId, 5, budgetId);

// 2. Cliente aprova orçamento
await approveBudget(budgetId, items, clientId);
// ✅ Estoque baixado definitivamente
// ✅ Reserva removida
// ✅ Histórico do cliente atualizado

// 3. Se cliente não aprovar em 48h
await cancelBudget(budgetId, items);
// ✅ Reserva liberada
// ✅ Estoque disponível novamente
```

---

## 📊 Monitorar Estoque em Tempo Real

```javascript
import { useProductStore } from '../store/productStore';

const StockMonitor = () => {
  const { products, getLowStockProducts, getExpiringProducts } = useProductStore();

  const lowStock = getLowStockProducts();
  const expiring = getExpiringProducts(30);

  return (
    <div>
      <h3>Alertas de Estoque</h3>
      
      {lowStock.length > 0 && (
        <div className="alert alert-warning">
          ⚠️ {lowStock.length} produto(s) com estoque baixo
        </div>
      )}

      {expiring.length > 0 && (
        <div className="alert alert-danger">
          🕐 {expiring.length} produto(s) vencendo em 30 dias
        </div>
      )}
    </div>
  );
};
```

---

## ✅ Checklist de Integração

- [ ] Importar `useInventoryIntegration`
- [ ] Adicionar `ProductSelector` para seleção de produtos
- [ ] Implementar reserva de estoque ao adicionar no orçamento
- [ ] Implementar liberação de reserva ao remover do orçamento
- [ ] Implementar baixa definitiva ao aprovar orçamento
- [ ] Implementar liberação automática após 48h
- [ ] Registrar no histórico do cliente
- [ ] Verificar disponibilidade antes de adicionar
- [ ] Mostrar alertas de estoque baixo/vencendo
- [ ] Testar fluxo completo

---

## 🚀 Pronto!

Agora você pode integrar o módulo de inventário com qualquer parte do sistema!
