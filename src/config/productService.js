import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  getDocs, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';

class ProductService {
  constructor() {
    this.collectionName = 'produtos';
  }

  // Adicionar novo produto
  async addProduct(productData) {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
        ativo: true
      });
      return { id: docRef.id, ...productData };
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      throw new Error('Falha ao adicionar produto');
    }
  }

  // Atualizar produto existente
  async updateProduct(productId, productData) {
    try {
      const productRef = doc(db, this.collectionName, productId);
      await updateDoc(productRef, {
        ...productData,
        updatedAt: new Date()
      });
      return { id: productId, ...productData };
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw new Error('Falha ao atualizar produto');
    }
  }

  // Excluir produto
  async deleteProduct(productId) {
    try {
      await deleteDoc(doc(db, this.collectionName, productId));
      return true;
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      throw new Error('Falha ao excluir produto');
    }
  }

  // Carregar todos os produtos
  async getAllProducts() {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('nome', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const products = [];
      
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return products;
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      throw new Error('Falha ao carregar produtos');
    }
  }

  // Buscar produtos por categoria
  async getProductsByCategory(category) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('categoria', '==', category),
        orderBy('nome', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const products = [];
      
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return products;
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      throw new Error('Falha ao buscar produtos por categoria');
    }
  }

  // Buscar produtos com estoque baixo
  async getLowStockProducts() {
    try {
      const allProducts = await this.getAllProducts();
      return allProducts.filter(product => 
        product.quantidade <= (product.quantidadeMinima || 0)
      );
    } catch (error) {
      console.error('Erro ao buscar produtos com estoque baixo:', error);
      throw new Error('Falha ao buscar produtos com estoque baixo');
    }
  }

  // Buscar produto por código de barras
  async getProductByBarcode(barcode) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('codigoBarras', '==', barcode)
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error('Erro ao buscar produto por código de barras:', error);
      throw new Error('Falha ao buscar produto por código de barras');
    }
  }

  // Atualizar quantidade em estoque
  async updateStock(productId, newQuantity) {
    try {
      const productRef = doc(db, this.collectionName, productId);
      await updateDoc(productRef, {
        quantidade: newQuantity,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      throw new Error('Falha ao atualizar estoque');
    }
  }

  // Reduzir estoque após venda
  async reduceStock(productId, quantidadeVendida) {
    try {
      const productRef = doc(db, this.collectionName, productId);
      const productDoc = await getDoc(productRef);
      
      if (!productDoc.exists()) {
        throw new Error('Produto não encontrado');
      }
      
      const product = productDoc.data();
      const novaQuantidade = Math.max(0, (product.quantidade || 0) - quantidadeVendida);
      
      await updateDoc(productRef, {
        quantidade: novaQuantidade,
        updatedAt: new Date()
      });
      
      return {
        success: true,
        quantidadeAnterior: product.quantidade || 0,
        novaQuantidade: novaQuantidade,
        quantidadeReduzida: quantidadeVendida
      };
    } catch (error) {
      console.error('Erro ao reduzir estoque:', error);
      throw new Error('Falha ao reduzir estoque');
    }
  }

  // Atualizar estoque por lote (FIFO - First In, First Out)
  async updateStockByBatch(productId, quantidadeVendida) {
    try {
      const productRef = doc(db, this.collectionName, productId);
      const productDoc = await getDoc(productRef);
      
      if (!productDoc.exists()) {
        throw new Error('Produto não encontrado');
      }
      
      const product = productDoc.data();
      let lotes = [...(product.lotes || [])];
      let quantidadeRestante = quantidadeVendida;
      
      // Ordenar lotes por data de vencimento (FIFO)
      lotes.sort((a, b) => new Date(a.dataVencimento) - new Date(b.dataVencimento));
      
      // Reduzir quantidade dos lotes seguindo FIFO
      for (let i = 0; i < lotes.length && quantidadeRestante > 0; i++) {
        const lote = lotes[i];
        
        if (lote.quantidade > 0) {
          const quantidadeAReduzir = Math.min(lote.quantidade, quantidadeRestante);
          lote.quantidade -= quantidadeAReduzir;
          quantidadeRestante -= quantidadeAReduzir;
        }
      }
      
      // Remover lotes com quantidade zero
      lotes = lotes.filter(lote => lote.quantidade > 0);
      
      // Calcular nova quantidade total
      const novaQuantidadeTotal = lotes.reduce((total, lote) => total + lote.quantidade, 0);
      
      await updateDoc(productRef, {
        lotes: lotes,
        quantidade: novaQuantidadeTotal,
        updatedAt: new Date()
      });
      
      return {
        success: true,
        quantidadeRestante,
        novaQuantidadeTotal
      };
    } catch (error) {
      console.error('Erro ao atualizar estoque por lote:', error);
      throw new Error('Falha ao atualizar estoque por lote');
    }
  }

  // Obter lotes próximos ao vencimento
  async getBatchesNearExpiration(days = 30) {
    try {
      const productsSnapshot = await getDocs(collection(db, this.collectionName));
      const produtosComLotesVencendo = [];
      
      const hoje = new Date();
      const dataLimite = new Date();
      dataLimite.setDate(hoje.getDate() + days);
      
      productsSnapshot.forEach(doc => {
        const product = { id: doc.id, ...doc.data() };
        
        if (product.lotes && product.lotes.length > 0) {
          const lotesVencendo = product.lotes.filter(lote => {
            const dataVencimento = new Date(lote.dataVencimento);
            return dataVencimento <= dataLimite && dataVencimento >= hoje;
          });
          
          if (lotesVencendo.length > 0) {
            produtosComLotesVencendo.push({
              ...product,
              lotesVencendo
            });
          }
        }
      });
      
      return produtosComLotesVencendo;
    } catch (error) {
      console.error('Erro ao buscar lotes próximos ao vencimento:', error);
      throw new Error('Falha ao buscar lotes próximos ao vencimento');
    }
  }
}

const productService = new ProductService();
export default productService;