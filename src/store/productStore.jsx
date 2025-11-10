import { create } from 'zustand';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

const getEmpresaId = () => sessionStorage.getItem('empresaId');

/**
 * Product Store - Gerenciamento completo de produtos e estoque
 * Integrado com orçamentos, clientes e caixa
 */
export const useProductStore = create((set, get) => ({
  // State
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  searchResults: [],
  filters: {
    category: '',
    brand: '',
    inStock: null,
    lowStock: false,
    expiringSoon: false,
  },
  categories: [
    'Peças de Motor',
    'Peças de Transmissão',
    'Freios',
    'Suspensão',
    'Sistema Elétrico',
    'Carroceria',
    'Pneus e Rodas',
    'Filtros',
    'Óleos e Lubrificantes',
    'Acessórios',
    'Ferramentas',
    'Outros'
  ],

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  clearFilters: () => set({ 
    filters: { 
      category: '', 
      brand: '', 
      inStock: null, 
      lowStock: false,
      expiringSoon: false 
    } 
  }),


  // Create new product
  createProduct: async (productData) => {
    const empresaId = getEmpresaId();
    
    // Super Admins não têm empresaId - podem criar produtos na estrutura antiga
    const isSuperAdmin = !empresaId;
    
    if (!empresaId && !isSuperAdmin) {
      // Apenas bloqueia se não for Super Admin E não tiver empresaId
      toast.error('Empresa não identificada');
      return { success: false, error: 'Empresa não identificada' };
    }

    set({ isLoading: true, error: null });
    try {
      const newProduct = {
        ...productData,
        sku: productData.sku || `SKU-${Date.now()}`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: productData.createdBy || 'system',
      };

      // Adicionar empresaId apenas se existir (não para Super Admins)
      if (empresaId) {
        newProduct.empresaId = empresaId;
      }

      const docRef = await addDoc(collection(db, 'products'), newProduct);
      const productWithId = { ...newProduct, id: docRef.id, firestoreId: docRef.id };

      // Log de auditoria
      await get().addAuditLog(docRef.id, 'create', 'Produto criado', null, newProduct);

      set((state) => ({
        products: [productWithId, ...state.products],
        isLoading: false,
      }));

      toast.success('Produto criado com sucesso!');
      return { success: true, data: productWithId };
    } catch (error) {
      console.error('Error creating product:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Erro ao criar produto');
      return { success: false, error: error.message };
    }
  },

  // Update product
  updateProduct: async (productId, updates) => {
    const empresaId = getEmpresaId();
    
    // Super Admins não têm empresaId - podem atualizar produtos na estrutura antiga
    const isSuperAdmin = !empresaId;
    
    if (!empresaId && !isSuperAdmin) {
      toast.error('Empresa não identificada');
      return { success: false, error: 'Empresa não identificada' };
    }

    set({ isLoading: true, error: null });
    try {
      const productRef = doc(db, 'products', productId);
      const oldProduct = get().products.find(p => p.id === productId || p.firestoreId === productId);

      const updatedData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(productRef, updatedData);

      // Log de auditoria
      await get().addAuditLog(productId, 'update', 'Produto atualizado', oldProduct, updates);

      set((state) => ({
        products: state.products.map((product) =>
          product.id === productId || product.firestoreId === productId
            ? { ...product, ...updatedData }
            : product
        ),
        currentProduct: (state.currentProduct?.id === productId || state.currentProduct?.firestoreId === productId)
          ? { ...state.currentProduct, ...updatedData }
          : state.currentProduct,
        isLoading: false,
      }));

      toast.success('Produto atualizado com sucesso!');
      return { success: true };
    } catch (error) {
      console.error('Error updating product:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Erro ao atualizar produto');
      return { success: false, error: error.message };
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    const empresaId = getEmpresaId();
    
    // Super Admins não têm empresaId - podem deletar produtos na estrutura antiga
    const isSuperAdmin = !empresaId;
    
    if (!empresaId && !isSuperAdmin) {
      toast.error('Empresa não identificada');
      return { success: false, error: 'Empresa não identificada' };
    }

    set({ isLoading: true, error: null });
    try {
      const productRef = doc(db, 'products', productId);
      const product = get().products.find(p => p.id === productId || p.firestoreId === productId);

      await deleteDoc(productRef);

      // Log de auditoria
      await get().addAuditLog(productId, 'delete', 'Produto excluído', product, null);

      set((state) => ({
        products: state.products.filter((product) => 
          product.id !== productId && product.firestoreId !== productId
        ),
        currentProduct: (state.currentProduct?.id === productId || state.currentProduct?.firestoreId === productId) 
          ? null 
          : state.currentProduct,
        isLoading: false,
      }));

      toast.success('Produto excluído com sucesso!');
      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Erro ao excluir produto');
      return { success: false, error: error.message };
    }
  },

  // Fetch all products
  fetchProducts: async () => {
    const empresaId = getEmpresaId();
    const isSuperAdmin = !empresaId;

    set({ isLoading: true, error: null });
    try {
      let q;
      
      if (empresaId) {
        // Usuário de empresa: filtrar por empresaId
        q = query(
          collection(db, 'products'),
          where('empresaId', '==', empresaId),
          orderBy('name', 'asc')
        );
      } else if (isSuperAdmin) {
        // Super Admin: buscar todos os produtos (estrutura antiga sem empresaId)
        console.log('[ProductStore] Super Admin mode: fetching all products');
        q = query(
          collection(db, 'products'),
          orderBy('name', 'asc')
        );
      } else {
        console.warn('empresaId not available and not Super Admin, skipping fetchProducts');
        return { success: false, error: 'Empresa não identificada' };
      }

      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        firestoreId: doc.id,
        ...doc.data()
      }));

      set({ products, isLoading: false });
      return { success: true, data: products };
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Get product by ID
  getProductById: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const product = { id: docSnap.id, firestoreId: docSnap.id, ...docSnap.data() };
        set({ currentProduct: product, isLoading: false });
        return { success: true, data: product };
      } else {
        set({ error: 'Produto não encontrado', isLoading: false });
        return { success: false, error: 'Produto não encontrado' };
      }
    } catch (error) {
      console.error('Error getting product:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Search products
  searchProducts: async (searchTerm) => {
    const empresaId = getEmpresaId();
    if (!empresaId) return { success: false, error: 'Empresa não identificada' };

    set({ isLoading: true, error: null });
    try {
      let allProducts = get().products;
      
      if (allProducts.length === 0) {
        const result = await get().fetchProducts();
        if (result.success) {
          allProducts = result.data;
        }
      }
      
      const searchLower = searchTerm.toLowerCase();
      const searchResults = allProducts.filter(product => 
        product.name?.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower) ||
        product.barcode?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      ).slice(0, 50);

      set({ searchResults, isLoading: false });
      return { success: true, data: searchResults };
    } catch (error) {
      console.error('Error searching products:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },


  // ========== STOCK MANAGEMENT ==========

  // Reserve stock (for budgets)
  reserveStock: async (productId, quantity, budgetId, reason = 'Reserva para orçamento') => {
    const empresaId = getEmpresaId();
    if (!empresaId) return { success: false, error: 'Empresa não identificada' };

    try {
      const product = get().products.find(p => p.id === productId || p.firestoreId === productId);
      if (!product) return { success: false, error: 'Produto não encontrado' };

      const availableStock = (product.stock_total || 0) - (product.stock_reserved || 0);
      if (availableStock < quantity) {
        return { success: false, error: 'Estoque insuficiente para reserva' };
      }

      const newReserved = (product.stock_reserved || 0) + quantity;
      await get().updateProduct(productId, { stock_reserved: newReserved });

      // Add movement
      await get().addMovement(productId, {
        type: 'reserve',
        quantity,
        budgetId,
        reason,
        previousStock: product.stock_total,
        previousReserved: product.stock_reserved || 0,
        newReserved,
      });

      toast.success(`${quantity} unidade(s) reservada(s)`);
      return { success: true };
    } catch (error) {
      console.error('Error reserving stock:', error);
      toast.error('Erro ao reservar estoque');
      return { success: false, error: error.message };
    }
  },

  // Release reserved stock
  releaseReservedStock: async (productId, quantity, budgetId, reason = 'Liberação de reserva') => {
    const empresaId = getEmpresaId();
    if (!empresaId) return { success: false, error: 'Empresa não identificada' };

    try {
      const product = get().products.find(p => p.id === productId || p.firestoreId === productId);
      if (!product) return { success: false, error: 'Produto não encontrado' };

      const newReserved = Math.max(0, (product.stock_reserved || 0) - quantity);
      await get().updateProduct(productId, { stock_reserved: newReserved });

      // Add movement
      await get().addMovement(productId, {
        type: 'release',
        quantity,
        budgetId,
        reason,
        previousReserved: product.stock_reserved || 0,
        newReserved,
      });

      toast.success(`${quantity} unidade(s) liberada(s)`);
      return { success: true };
    } catch (error) {
      console.error('Error releasing stock:', error);
      toast.error('Erro ao liberar estoque');
      return { success: false, error: error.message };
    }
  },

  // Decrease stock (definitive - for approved budgets or direct sales)
  decreaseStock: async (productId, quantity, origin, originId, reason = 'Baixa de estoque') => {
    const empresaId = getEmpresaId();
    if (!empresaId) return { success: false, error: 'Empresa não identificada' };

    try {
      const product = get().products.find(p => p.id === productId || p.firestoreId === productId);
      if (!product) return { success: false, error: 'Produto não encontrado' };

      const newTotal = Math.max(0, (product.stock_total || 0) - quantity);
      const newReserved = Math.max(0, (product.stock_reserved || 0) - quantity);

      await get().updateProduct(productId, { 
        stock_total: newTotal,
        stock_reserved: newReserved,
      });

      // Add movement
      await get().addMovement(productId, {
        type: 'out',
        quantity,
        origin, // 'budget', 'sale', 'adjustment'
        originId,
        reason,
        previousStock: product.stock_total,
        newStock: newTotal,
        previousReserved: product.stock_reserved || 0,
        newReserved,
      });

      return { success: true };
    } catch (error) {
      console.error('Error decreasing stock:', error);
      toast.error('Erro ao baixar estoque');
      return { success: false, error: error.message };
    }
  },

  // Increase stock (for purchases/adjustments)
  increaseStock: async (productId, quantity, lotData = null, reason = 'Entrada de estoque') => {
    const empresaId = getEmpresaId();
    if (!empresaId) return { success: false, error: 'Empresa não identificada' };

    try {
      const product = get().products.find(p => p.id === productId || p.firestoreId === productId);
      if (!product) return { success: false, error: 'Produto não encontrado' };

      const newTotal = (product.stock_total || 0) + quantity;
      const updates = { stock_total: newTotal };

      // Add lot if provided
      if (lotData) {
        const lots = product.lots || [];
        lots.push({
          id: `LOT-${Date.now()}`,
          ...lotData,
          quantity,
          createdAt: new Date().toISOString(),
        });
        updates.lots = lots;
      }

      await get().updateProduct(productId, updates);

      // Add movement
      await get().addMovement(productId, {
        type: 'in',
        quantity,
        reason,
        lotData,
        previousStock: product.stock_total,
        newStock: newTotal,
      });

      toast.success(`${quantity} unidade(s) adicionada(s)`);
      return { success: true };
    } catch (error) {
      console.error('Error increasing stock:', error);
      toast.error('Erro ao adicionar estoque');
      return { success: false, error: error.message };
    }
  },

  // Add movement to history (subcollection)
  addMovement: async (productId, movementData) => {
    const empresaId = getEmpresaId();
    if (!empresaId) return;

    try {
      const movementRef = collection(db, 'products', productId, 'movements');
      await addDoc(movementRef, {
        ...movementData,
        empresaId,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error adding movement:', error);
    }
  },

  // Get movements history
  getMovements: async (productId, limit = 50) => {
    try {
      const movementsRef = collection(db, 'products', productId, 'movements');
      const q = query(movementsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).slice(0, limit);
    } catch (error) {
      console.error('Error getting movements:', error);
      return [];
    }
  },

  // Add audit log (subcollection)
  addAuditLog: async (productId, action, description, before, after) => {
    const empresaId = getEmpresaId();
    if (!empresaId) return;

    try {
      const auditRef = collection(db, 'products', productId, 'audit');
      await addDoc(auditRef, {
        empresaId,
        action,
        description,
        before,
        after,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString(),
        userId: sessionStorage.getItem('userId') || 'system',
      });
    } catch (error) {
      console.error('Error adding audit log:', error);
    }
  },

  // Get audit logs
  getAuditLogs: async (productId, limit = 50) => {
    try {
      const auditRef = collection(db, 'products', productId, 'audit');
      const q = query(auditRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).slice(0, limit);
    } catch (error) {
      console.error('Error getting audit logs:', error);
      return [];
    }
  },


  // ========== STATISTICS & REPORTS ==========

  // Get filtered products
  getFilteredProducts: () => {
    const { products, filters } = get();
    
    return products.filter(product => {
      if (filters.category && product.category !== filters.category) return false;
      if (filters.brand && product.brand !== filters.brand) return false;
      if (filters.inStock !== null) {
        const availableStock = (product.stock_total || 0) - (product.stock_reserved || 0);
        if (filters.inStock && availableStock <= 0) return false;
        if (!filters.inStock && availableStock > 0) return false;
      }
      if (filters.lowStock) {
        const availableStock = (product.stock_total || 0) - (product.stock_reserved || 0);
        if (availableStock > (product.stock_min || 0)) return false;
      }
      if (filters.expiringSoon) {
        const hasExpiringSoon = product.lots?.some(lot => {
          if (!lot.validade) return false;
          const expiryDate = new Date(lot.validade);
          const daysUntilExpiry = (expiryDate - new Date()) / (1000 * 60 * 60 * 24);
          return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
        });
        if (!hasExpiringSoon) return false;
      }
      
      return true;
    });
  },

  // Get low stock products
  getLowStockProducts: () => {
    const { products } = get();
    return products.filter(product => {
      const availableStock = (product.stock_total || 0) - (product.stock_reserved || 0);
      return availableStock <= (product.stock_min || 0);
    });
  },

  // Get out of stock products
  getOutOfStockProducts: () => {
    const { products } = get();
    return products.filter(product => {
      const availableStock = (product.stock_total || 0) - (product.stock_reserved || 0);
      return availableStock <= 0;
    });
  },

  // Get expiring products
  getExpiringProducts: (days = 30) => {
    const { products } = get();
    const expiringProducts = [];

    products.forEach(product => {
      if (!product.lots) return;
      
      product.lots.forEach(lot => {
        if (!lot.validade) return;
        
        const expiryDate = new Date(lot.validade);
        const daysUntilExpiry = (expiryDate - new Date()) / (1000 * 60 * 60 * 24);
        
        if (daysUntilExpiry <= days && daysUntilExpiry > 0) {
          expiringProducts.push({
            ...product,
            lot,
            daysUntilExpiry: Math.ceil(daysUntilExpiry),
          });
        }
      });
    });

    return expiringProducts.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
  },

  // Get inventory statistics
  getInventoryStatistics: () => {
    const { products } = get();
    
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => {
      const availableStock = (product.stock_total || 0) - (product.stock_reserved || 0);
      return sum + (availableStock * (product.cost_price || 0));
    }, 0);
    
    const lowStockCount = get().getLowStockProducts().length;
    const outOfStockCount = get().getOutOfStockProducts().length;
    const expiringCount = get().getExpiringProducts(30).length;
    
    const totalReserved = products.reduce((sum, product) => 
      sum + (product.stock_reserved || 0), 0
    );
    
    return {
      totalProducts,
      totalValue,
      lowStockCount,
      outOfStockCount,
      expiringCount,
      totalReserved,
      lowStockPercentage: totalProducts > 0 ? (lowStockCount / totalProducts) * 100 : 0,
      outOfStockPercentage: totalProducts > 0 ? (outOfStockCount / totalProducts) * 100 : 0,
    };
  },

  // Get products by category
  getProductsByCategory: () => {
    const { products } = get();
    const categories = {};
    
    products.forEach(product => {
      const category = product.category || 'Outros';
      if (!categories[category]) {
        categories[category] = {
          count: 0,
          totalValue: 0,
          lowStock: 0,
          outOfStock: 0,
        };
      }
      
      const availableStock = (product.stock_total || 0) - (product.stock_reserved || 0);
      categories[category].count++;
      categories[category].totalValue += availableStock * (product.cost_price || 0);
      
      if (availableStock <= (product.stock_min || 0)) {
        categories[category].lowStock++;
      }
      if (availableStock <= 0) {
        categories[category].outOfStock++;
      }
    });
    
    return categories;
  },

  // Get top selling products (requires integration with sales data)
  getTopSellingProducts: (limit = 10) => {
    const { products } = get();
    // This would need to be calculated from movements history
    // For now, return products sorted by total sold (if tracked)
    return products
      .filter(p => p.total_sold > 0)
      .sort((a, b) => (b.total_sold || 0) - (a.total_sold || 0))
      .slice(0, limit);
  },

  // Clear search results
  clearSearchResults: () => set({ searchResults: [] }),

  // Real-time listener
  subscribeToProducts: () => {
    const empresaId = getEmpresaId();
    if (!empresaId) {
      console.warn('empresaId not available, skipping subscribeToProducts');
      return () => {};
    }

    const q = query(
      collection(db, 'products'),
      where('empresaId', '==', empresaId),
      orderBy('name', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        firestoreId: doc.id,
        ...doc.data()
      }));
      
      set({ products });
    }, (error) => {
      console.error('Error in products subscription:', error);
      set({ error: error.message });
    });

    return unsubscribe;
  },
}));
