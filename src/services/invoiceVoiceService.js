/**
 * Serviço Principal de Faturamento por Voz
 * Orquestra todo o processo de faturamento via comando de voz
 */

import { db } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import fiscalIntegrationService from './fiscalIntegrationService';
import { useProductStore } from '../store/productStore';
import { useClientStore } from '../store/clientStore';

class InvoiceVoiceService {
  /**
   * Processa comando de faturamento por voz
   * @param {Object} command - Comando parseado
   * @param {string} empresaId - ID da empresa
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} Resultado do faturamento
   */
  async processInvoiceCommand(command, empresaId, userId) {
    try {
      console.log('🎤 Processando comando de faturamento:', command);

      // 1. Validar configurações fiscais
      const fiscalConfig = await fiscalIntegrationService.getFiscalConfig(empresaId);

      // 2. Buscar e validar produtos
      const products = await this.findProducts(command.products, empresaId);
      
      // 3. Buscar e validar cliente
      const customer = await this.findCustomer(command.customerName, empresaId);

      // 4. Validar estoque
      await this.validateStock(products);

      // 5. Calcular totais
      const totals = this.calculateTotals(products, command.services || []);

      // 6. Criar venda no caixa
      const sale = await this.createSale({
        products,
        services: command.services || [],
        customer,
        totals,
        empresaId,
        userId
      });

      // 7. Emitir notas fiscais
      const invoices = await this.emitInvoices({
        sale,
        products,
        services: command.services || [],
        customer,
        fiscalConfig,
        empresaId
      });

      // 8. Enviar via WhatsApp
      await this.sendInvoicesViaWhatsApp({
        invoices,
        customer,
        sale
      });

      return {
        success: true,
        sale,
        invoices,
        message: this.generateSuccessMessage(sale, invoices, customer)
      };

    } catch (error) {
      console.error('❌ Erro ao processar faturamento:', error);
      return {
        success: false,
        error: error.message,
        suggestion: this.generateErrorSuggestion(error)
      };
    }
  }

  /**
   * Busca produtos no inventário
   * @param {Array} productNames - Nomes dos produtos
   * @param {string} empresaId - ID da empresa
   * @returns {Promise<Array>} Produtos encontrados
   */
  async findProducts(productNames, empresaId) {
    const products = [];
    const notFound = [];

    for (const item of productNames) {
      try {
        // Busca no Firestore
        const productsRef = collection(db, 'products');
        const q = query(
          productsRef,
          where('empresaId', '==', empresaId),
          where('name', '>=', item.name),
          where('name', '<=', item.name + '\uf8ff')
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          // Busca fuzzy (similar)
          const allProducts = await this.getAllProducts(empresaId);
          const similar = this.findSimilarProducts(item.name, allProducts);
          
          if (similar.length > 0) {
            notFound.push({
              searched: item.name,
              suggestions: similar.slice(0, 3).map(p => p.name)
            });
          } else {
            notFound.push({
              searched: item.name,
              suggestions: []
            });
          }
          continue;
        }

        const product = snapshot.docs[0].data();
        product.id = snapshot.docs[0].id;
        product.quantity = item.quantity || 1;

        products.push(product);

      } catch (error) {
        console.error(`Erro ao buscar produto ${item.name}:`, error);
        notFound.push({ searched: item.name, error: error.message });
      }
    }

    if (notFound.length > 0) {
      const suggestions = notFound
        .map(nf => `"${nf.searched}"${nf.suggestions?.length ? ` (sugestões: ${nf.suggestions.join(', ')})` : ''}`)
        .join(', ');
      
      throw new Error(`Produtos não encontrados: ${suggestions}`);
    }

    return products;
  }

  /**
   * Busca cliente
   * @param {string} customerName - Nome do cliente
   * @param {string} empresaId - ID da empresa
   * @returns {Promise<Object>} Cliente encontrado
   */
  async findCustomer(customerName, empresaId) {
    try {
      const clientsRef = collection(db, 'clients');
      const q = query(
        clientsRef,
        where('empresaId', '==', empresaId),
        where('name', '>=', customerName),
        where('name', '<=', customerName + '\uf8ff')
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Busca fuzzy
        const allClients = await this.getAllClients(empresaId);
        const similar = this.findSimilarClients(customerName, allClients);

        if (similar.length > 0) {
          throw new Error(
            `Cliente "${customerName}" não encontrado. Você quis dizer: ${similar.slice(0, 3).map(c => c.name).join(', ')}?`
          );
        }

        throw new Error(`Cliente "${customerName}" não encontrado. Cadastre o cliente primeiro.`);
      }

      const client = snapshot.docs[0].data();
      client.id = snapshot.docs[0].id;

      // Validar dados obrigatórios para NF-e
      if (!client.cpfCnpj) {
        throw new Error(`Cliente "${client.name}" não possui CPF/CNPJ cadastrado. Atualize o cadastro.`);
      }

      return client;

    } catch (error) {
      throw error;
    }
  }

  /**
   * Valida estoque dos produtos
   * @param {Array} products - Produtos a validar
   */
  async validateStock(products) {
    const outOfStock = [];
    const insufficient = [];

    for (const product of products) {
      // Verifica se tem controle de estoque
      if (product.trackStock === false) {
        continue;
      }

      const currentStock = product.stock || 0;
      const requested = product.quantity;

      if (currentStock === 0) {
        outOfStock.push(product.name);
      } else if (currentStock < requested) {
        insufficient.push({
          name: product.name,
          available: currentStock,
          requested
        });
      }

      // Verifica validade
      if (product.expiryDate) {
        const expiry = new Date(product.expiryDate);
        if (expiry < new Date()) {
          throw new Error(`Produto "${product.name}" está vencido (validade: ${expiry.toLocaleDateString()})`);
        }
      }
    }

    if (outOfStock.length > 0) {
      throw new Error(`Produtos sem estoque: ${outOfStock.join(', ')}`);
    }

    if (insufficient.length > 0) {
      const details = insufficient
        .map(i => `${i.name} (disponível: ${i.available}, solicitado: ${i.requested})`)
        .join(', ');
      throw new Error(`Estoque insuficiente: ${details}`);
    }
  }

  /**
   * Calcula totais da venda
   * @param {Array} products - Produtos
   * @param {Array} services - Serviços
   * @returns {Object} Totais calculados
   */
  calculateTotals(products, services = []) {
    const productsTotal = products.reduce((sum, p) => {
      return sum + (p.price * p.quantity);
    }, 0);

    const servicesTotal = services.reduce((sum, s) => {
      return sum + (s.price * (s.quantity || 1));
    }, 0);

    return {
      products: productsTotal,
      services: servicesTotal,
      total: productsTotal + servicesTotal
    };
  }

  /**
   * Cria venda no caixa
   * @param {Object} data - Dados da venda
   * @returns {Promise<Object>} Venda criada
   */
  async createSale(data) {
    try {
      const saleData = {
        empresaId: data.empresaId,
        userId: data.userId,
        customerId: data.customer.id,
        customerName: data.customer.name,
        items: [
          ...data.products.map(p => ({
            type: 'product',
            id: p.id,
            name: p.name,
            quantity: p.quantity,
            unitPrice: p.price,
            total: p.price * p.quantity
          })),
          ...data.services.map(s => ({
            type: 'service',
            name: s.name,
            quantity: s.quantity || 1,
            unitPrice: s.price,
            total: s.price * (s.quantity || 1)
          }))
        ],
        totals: data.totals,
        paymentMethod: 'pending', // Será definido depois
        status: 'pending_invoice',
        createdAt: new Date(),
        createdBy: 'voice_assistant'
      };

      const salesRef = collection(db, 'sales');
      const docRef = await addDoc(salesRef, saleData);

      return {
        id: docRef.id,
        ...saleData
      };

    } catch (error) {
      console.error('Erro ao criar venda:', error);
      throw new Error('Falha ao registrar venda no sistema');
    }
  }

  /**
   * Emite notas fiscais
   * @param {Object} data - Dados para emissão
   * @returns {Promise<Array>} Notas emitidas
   */
  async emitInvoices(data) {
    const invoices = [];

    try {
      // Emite NF-e se houver produtos
      if (data.products.length > 0) {
        const nfe = await this.emitNFe({
          products: data.products,
          customer: data.customer,
          fiscalConfig: data.fiscalConfig,
          saleId: data.sale.id,
          empresaId: data.empresaId
        });
        invoices.push(nfe);
      }

      // Emite NFS-e se houver serviços
      if (data.services.length > 0 && fiscalIntegrationService.canEmitNFSe(data.fiscalConfig)) {
        const nfse = await this.emitNFSe({
          services: data.services,
          customer: data.customer,
          fiscalConfig: data.fiscalConfig,
          saleId: data.sale.id,
          empresaId: data.empresaId
        });
        invoices.push(nfse);
      }

      return invoices;

    } catch (error) {
      console.error('Erro ao emitir notas fiscais:', error);
      throw new Error(`Falha na emissão de notas fiscais: ${error.message}`);
    }
  }

  /**
   * Emite NF-e (Nota Fiscal Eletrônica)
   * @param {Object} data - Dados da NF-e
   * @returns {Promise<Object>} NF-e emitida
   */
  async emitNFe(data) {
    // TODO: Integrar com API de emissão de NF-e
    // Por enquanto, simula a emissão
    const nfeNumber = await fiscalIntegrationService.getNextNFeNumber(
      data.empresaId,
      data.fiscalConfig.nfeConfig.serie
    );

    const nfe = {
      type: 'nfe',
      number: nfeNumber,
      serie: data.fiscalConfig.nfeConfig.serie,
      saleId: data.sale.id,
      customer: {
        name: data.customer.name,
        cpfCnpj: data.customer.cpfCnpj
      },
      items: data.products.map(p => ({
        name: p.name,
        quantity: p.quantity,
        unitPrice: p.price,
        total: p.price * p.quantity
      })),
      total: data.products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
      status: 'emitted',
      emittedAt: new Date(),
      // URLs simuladas - substituir por URLs reais da API
      pdfUrl: `https://api.example.com/nfe/${nfeNumber}/pdf`,
      xmlUrl: `https://api.example.com/nfe/${nfeNumber}/xml`
    };

    // Atualiza contador
    await fiscalIntegrationService.updateNFeCounter(
      data.empresaId,
      data.fiscalConfig.nfeConfig.serie,
      nfeNumber
    );

    return nfe;
  }

  /**
   * Emite NFS-e (Nota Fiscal de Serviço Eletrônica)
   * @param {Object} data - Dados da NFS-e
   * @returns {Promise<Object>} NFS-e emitida
   */
  async emitNFSe(data) {
    // TODO: Integrar com API de emissão de NFS-e
    // Por enquanto, simula a emissão
    const nfseNumber = Math.floor(Math.random() * 100000);

    const nfse = {
      type: 'nfse',
      number: nfseNumber,
      saleId: data.sale.id,
      customer: {
        name: data.customer.name,
        cpfCnpj: data.customer.cpfCnpj
      },
      services: data.services.map(s => ({
        name: s.name,
        quantity: s.quantity || 1,
        unitPrice: s.price,
        total: s.price * (s.quantity || 1)
      })),
      total: data.services.reduce((sum, s) => sum + (s.price * (s.quantity || 1)), 0),
      status: 'emitted',
      emittedAt: new Date(),
      // URLs simuladas
      pdfUrl: `https://api.example.com/nfse/${nfseNumber}/pdf`,
      xmlUrl: `https://api.example.com/nfse/${nfseNumber}/xml`
    };

    return nfse;
  }

  /**
   * Envia notas fiscais via WhatsApp
   * @param {Object} data - Dados para envio
   */
  async sendInvoicesViaWhatsApp(data) {
    try {
      // TODO: Integrar com serviço WhatsApp existente
      console.log('📱 Enviando notas via WhatsApp para:', data.customer.phone);
      
      // Simula envio
      for (const invoice of data.invoices) {
        console.log(`✅ ${invoice.type.toUpperCase()} Nº ${invoice.number} enviada`);
      }

    } catch (error) {
      console.error('Erro ao enviar via WhatsApp:', error);
      // Não falha o processo se o envio falhar
    }
  }

  /**
   * Busca todos os produtos (para busca fuzzy)
   */
  async getAllProducts(empresaId) {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('empresaId', '==', empresaId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  /**
   * Busca todos os clientes (para busca fuzzy)
   */
  async getAllClients(empresaId) {
    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, where('empresaId', '==', empresaId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  /**
   * Busca produtos similares (fuzzy search)
   */
  findSimilarProducts(searchTerm, products) {
    const term = searchTerm.toLowerCase();
    return products
      .filter(p => p.name.toLowerCase().includes(term) || 
                   term.includes(p.name.toLowerCase()))
      .sort((a, b) => {
        const aScore = this.calculateSimilarity(term, a.name.toLowerCase());
        const bScore = this.calculateSimilarity(term, b.name.toLowerCase());
        return bScore - aScore;
      });
  }

  /**
   * Busca clientes similares (fuzzy search)
   */
  findSimilarClients(searchTerm, clients) {
    const term = searchTerm.toLowerCase();
    return clients
      .filter(c => c.name.toLowerCase().includes(term) || 
                   term.includes(c.name.toLowerCase()))
      .sort((a, b) => {
        const aScore = this.calculateSimilarity(term, a.name.toLowerCase());
        const bScore = this.calculateSimilarity(term, b.name.toLowerCase());
        return bScore - aScore;
      });
  }

  /**
   * Calcula similaridade entre strings
   */
  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Calcula distância de Levenshtein
   */
  levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Gera mensagem de sucesso
   */
  generateSuccessMessage(sale, invoices, customer) {
    const nfe = invoices.find(i => i.type === 'nfe');
    const nfse = invoices.find(i => i.type === 'nfse');

    let message = `✅ Faturamento realizado com sucesso para ${customer.name}!\n\n`;

    if (nfe) {
      message += `📄 NF-e Nº ${nfe.number} emitida\n`;
    }

    if (nfse) {
      message += `📄 NFS-e Nº ${nfse.number} emitida\n`;
    }

    message += `\n💰 Valor Total: R$ ${sale.totals.total.toFixed(2)}`;
    message += `\n📱 Notas enviadas via WhatsApp`;

    return message;
  }

  /**
   * Gera sugestão de erro
   */
  generateErrorSuggestion(error) {
    const message = error.message.toLowerCase();

    if (message.includes('configurações fiscais')) {
      return 'Configure o CNPJ e certificado digital em /integrations';
    }

    if (message.includes('produto') && message.includes('não encontrado')) {
      return 'Verifique o nome do produto ou cadastre-o em /inventory';
    }

    if (message.includes('cliente') && message.includes('não encontrado')) {
      return 'Cadastre o cliente em /clients antes de faturar';
    }

    if (message.includes('estoque')) {
      return 'Verifique o estoque em /inventory';
    }

    if (message.includes('certificado') && message.includes('vencido')) {
      return 'Renove o certificado digital em /integrations';
    }

    return 'Verifique os dados e tente novamente';
  }
}

export default new InvoiceVoiceService();
