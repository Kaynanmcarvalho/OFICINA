/**
 * Serviço centralizado para geração de Notas Fiscais
 * Responsável por toda a lógica de criação, validação e emissão de NFs
 */

import nuvemFiscalService from './nuvemFiscalService';
import configService from './configService';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

class NFGenerationService {
  /**
   * Gera uma Nota Fiscal para uma venda
   * @param {Object} saleData - Dados da venda
   * @param {Object} user - Usuário atual
   * @param {Array} products - Lista de produtos (opcional, para buscar dados tributários)
   * @returns {Promise<Object>} Resultado da emissão da NF
   */
  async generateNF(saleData, user, products = []) {
    console.log('🔧 NFGenerationService: Iniciando geração de NF');
    console.log('📊 Dados recebidos:', { saleData, user: user?.uid, productsCount: products.length });
    
    try {
      // 1. Configurar usuário no serviço Nuvem Fiscal
      console.log('⚙️ Configurando serviço Nuvem Fiscal...');
      await nuvemFiscalService.setUser(user);
      
      if (!nuvemFiscalService.isConfigured()) {
        console.error('❌ Serviço Nuvem Fiscal não configurado');
        throw new Error('Configure as credenciais da Nuvem Fiscal nas configurações');
      }
      console.log('✅ Serviço Nuvem Fiscal configurado');

      // 2. Carregar configurações tributárias do usuário da coleção integrations
      console.log('📋 Carregando configurações tributárias...');
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('./firebase');
      
      const orgId = user.organizationId || user.uid;
      const docRef = doc(db, 'integrations', orgId);
      const docSnap = await getDoc(docRef);
      
      let config = {};
      if (docSnap.exists()) {
        const data = docSnap.data();
        const invoice = data.invoice || {};
        config = {
          // Dados da empresa
          nfCnpj: invoice.cnpj || '',
          cnpj: invoice.cnpj || '',
          nfRazaoSocial: invoice.nomeEmpresa || '',
          nomeEmpresa: invoice.nomeEmpresa || '',
          
          // Endereço
          nfLogradouro: invoice.logradouro || '',
          logradouro: invoice.logradouro || '',
          nfNumero: invoice.numero || '',
          numero: invoice.numero || '',
          nfComplemento: invoice.complemento || '',
          complemento: invoice.complemento || '',
          nfBairro: invoice.bairro || '',
          bairro: invoice.bairro || '',
          nfCidade: invoice.cidade || '',
          cidade: invoice.cidade || '',
          nfEstado: invoice.estado || '',
          nfUf: invoice.estado || '',
          estado: invoice.estado || '',
          nfCep: invoice.cep || '',
          cep: invoice.cep || '',
          
          // Dados fiscais
          inscricaoEstadual: invoice.inscricaoEstadual || '',
          inscricaoMunicipal: invoice.inscricaoMunicipal || '',
          regimeTributario: invoice.regimeTributario || '1',
          
          // API Gyn Fiscal
          apiCodigoAutorizador: invoice.apiCodigoAutorizador || '',
          apiSenhaAutorizada: invoice.apiSenhaAutorizada || '',
          nfClientId: invoice.apiCodigoAutorizador || '',
          nfClientSecret: invoice.apiSenhaAutorizada || '',
        };
      }
      
      console.log('🔍 Configurações carregadas:', {
        nfCnpj: config.nfCnpj ? '***configurado***' : 'NÃO CONFIGURADO',
        nfRazaoSocial: config.nfRazaoSocial ? '***configurado***' : 'NÃO CONFIGURADO'
      });
      
      if (!config.nfCnpj || !config.nfRazaoSocial) {
        console.error('❌ Configurações de NF incompletas');
        throw new Error('Configure os dados da empresa em Integrações > Nota Fiscal');
      }

      // 3. Preparar dados da NF
      console.log('📄 Preparando dados da NF...');
      const nfData = this._prepareNFData(saleData, config, products);
      
      console.log('📋 Dados da NF preparados:', nfData);
      
      // 4. Emitir NF 
      console.log('🚀 Emitindo NF via API...');
      const result = await nuvemFiscalService.emitirNotaFiscal(nfData);
      console.log('📄 Resultado da API:', result);
      
      if (!result || !result.id) {
        console.error('❌ Erro na resposta da API - NF não foi gerada');
        throw new Error('Erro na resposta da API - NF não foi gerada');
      }

      // 5. Salvar dados da NF no Firestore
      console.log('💾 Salvando registro da NF no Firestore...');
      const nfRecord = this._createNFRecord(result, saleData, user);
      await addDoc(collection(db, 'notas_fiscais'), nfRecord);
      
      // 6. Atualizar venda com dados da NF (se tiver ID da venda)
      if (saleData.id) {
        console.log('🔄 Atualizando venda com dados da NF...');
        await this._updateSaleWithNF(saleData.id, result);
      }
      
      console.log('🎉 Processo de geração de NF concluído com sucesso!');
      return {
        success: true,
        data: result,
        message: `Nota Fiscal ${result.numero}/${result.serie} emitida com sucesso!`
      };
      
    } catch (error) {
      console.error('💥 Erro inesperado ao gerar NF:', error);
      return {
        success: false,
        error: error.message || 'Erro desconhecido ao gerar NF'
      };
    }
  }

  /**
   * Prepara os dados da NF no formato esperado pela API
   * @private
   */
  _prepareNFData(saleData, config, products) {
    return {
      natureza_operacao: config.nfNaturezaOperacao || 'Venda de mercadoria',
      modelo: '55',
      serie: config.nfSerie || 1,
      numero: null, // Será gerado automaticamente
      data_emissao: new Date().toISOString(),
      tipo_operacao: 1, // Saída
      finalidade_emissao: 1, // Normal
      consumidor_final: 1, // Sim
      presenca_comprador: 1, // Presencial
      
      // Emitente (dados da empresa)
      emitente: this._prepareEmitenteData(config),
      
      // Destinatário
      destinatario: this._prepareDestinatarioData(saleData.customer),
      
      // Itens
      itens: this._prepareItensData(saleData.items, config, products),
      
      // Totais
      total: {
        valor_produtos: saleData.subtotal || saleData.total,
        valor_total_nota: saleData.total
      },
      
      // Pagamento
      pagamento: this._preparePagamentoData(saleData)
    };
  }

  /**
   * Prepara dados do emitente
   * @private
   */
  _prepareEmitenteData(config) {
    return {
      cnpj: config.nfCnpj.replace(/\D/g, ''),
      nome: config.nfRazaoSocial,
      nome_fantasia: config.nfNomeFantasia || config.nfRazaoSocial,
      logradouro: config.nfLogradouro,
      numero: config.nfNumero,
      bairro: config.nfBairro,
      municipio: config.nfMunicipio,
      uf: config.nfUf,
      cep: config.nfCep?.replace(/\D/g, ''),
      telefone: config.nfTelefone?.replace(/\D/g, ''),
      email: config.nfEmail,
      inscricao_estadual: config.nfInscricaoEstadual,
      regime_tributario: config.nfRegimeTributario === 'simples_nacional' ? 1 : 3
    };
  }

  /**
   * Prepara dados do destinatário
   * @private
   */
  _prepareDestinatarioData(customer) {
    if (customer && customer.documento) {
      return {
        cpf_cnpj: customer.documento.replace(/\D/g, ''),
        nome: customer.nome,
        email: customer.email,
        telefone: customer.telefone
      };
    }
    
    return {
      cpf_cnpj: null,
      nome: 'CONSUMIDOR FINAL',
      indicador_inscricao_estadual: 9 // Não contribuinte
    };
  }

  /**
   * Prepara dados dos itens
   * @private
   */
  _prepareItensData(items, config, products) {
    return items.map((item, index) => {
      // Buscar produto completo para obter dados tributários
      const produto = products.find(p => p.id === item.id || p.codigo === item.codigo);
      
      return {
        numero_item: index + 1,
        codigo_produto: produto?.codigo || item.codigo || item.id,
        descricao: produto?.descricao || item.descricao || item.nome,
        ncm: produto?.ncm || config.nfNcmPadrao || '21069090',
        cfop: produto?.cfop || config.nfCfopPadrao || '5102',
        unidade_comercial: produto?.unidadeTributaria || 'UN',
        quantidade_comercial: item.quantidade,
        valor_unitario_comercial: item.preco,
        valor_bruto_produtos: item.preco * item.quantidade,
        
        // Tributos baseados nas configurações e produto
        icms: {
          origem: produto?.origem || config.nfOrigemPadrao || 0,
          situacao_tributaria: config.nfRegimeTributario === 'simples_nacional' 
            ? (produto?.csosnIcms || config.nfCsosnIcmsPadrao || '102')
            : (produto?.cstIcms || config.nfCstIcmsPadrao || '00')
        },
        pis: {
          situacao_tributaria: config.nfRegimeTributario === 'simples_nacional' 
            ? '49' // Outras operações de saída
            : (produto?.cstPis || '01')
        },
        cofins: {
          situacao_tributaria: config.nfRegimeTributario === 'simples_nacional' 
            ? '49' // Outras operações de saída  
            : (produto?.cstCofins || '01')
        }
      };
    });
  }

  /**
   * Prepara dados do pagamento
   * @private
   */
  _preparePagamentoData(saleData) {
    const paymentMethodMap = {
      'dinheiro': '01',
      'cartao_credito': '03',
      'cartao_debito': '04',
      'pix': '17'
    };
    
    return {
      formas_pagamento: [{
        meio_pagamento: paymentMethodMap[saleData.paymentMethod] || '17', // PIX como padrão
        valor: saleData.total
      }]
    };
  }

  /**
   * Cria o registro da NF para salvar no Firestore
   * @private
   */
  _createNFRecord(result, saleData, user) {
    return {
      id: result.id,
      numero: result.numero,
      serie: result.serie,
      chave: result.chave_acesso,
      status: result.status,
      dataEmissao: new Date(),
      vendaId: saleData.numero || saleData.id,
      cliente: saleData.customer?.nome || 'CONSUMIDOR FINAL',
      cpfCnpj: saleData.customer?.documento || '',
      valorTotal: saleData.total,
      itens: saleData.items,
      userId: user.uid,
      createdAt: new Date()
    };
  }

  /**
   * Atualiza a venda com os dados da NF
   * @private
   */
  async _updateSaleWithNF(vendaId, nfResult) {
    try {
      const vendaRef = doc(db, 'vendas', vendaId);
      await updateDoc(vendaRef, {
        nfId: nfResult.id,
        nfNumero: nfResult.numero,
        nfSerie: nfResult.serie,
        nfChave: nfResult.chave_acesso,
        nfStatus: nfResult.status,
        nfEmitidaEm: new Date()
      });
    } catch (error) {
      console.error('Erro ao atualizar venda com dados da NF:', error);
      // Não propagar o erro, pois a NF já foi emitida com sucesso
    }
  }

  /**
   * Valida se os dados necessários estão presentes
   * @param {Object} saleData - Dados da venda
   * @returns {Object} Resultado da validação
   */
  validateSaleData(saleData) {
    const errors = [];
    
    if (!saleData.items || saleData.items.length === 0) {
      errors.push('Nenhum item encontrado na venda');
    }
    
    if (!saleData.total || saleData.total <= 0) {
      errors.push('Valor total da venda inválido');
    }
    
    if (!saleData.paymentMethod) {
      errors.push('Método de pagamento não informado');
    }
    
    // Validar itens
    saleData.items?.forEach((item, index) => {
      if (!item.nome && !item.descricao) {
        errors.push(`Item ${index + 1}: Nome/descrição não informado`);
      }
      if (!item.quantidade || item.quantidade <= 0) {
        errors.push(`Item ${index + 1}: Quantidade inválida`);
      }
      if (!item.preco || item.preco <= 0) {
        errors.push(`Item ${index + 1}: Preço inválido`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const nfGenerationService = new NFGenerationService();
export default nfGenerationService;