// Utilitário para manipulação de XML da NFe
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

class XMLParserUtil {
  constructor() {
    // Configurações do parser
    this.parserOptions = {
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      parseAttributeValue: true,
      trimValues: true,
      parseTrueNumberOnly: false,
      arrayMode: false
    };

    // Configurações do builder
    this.builderOptions = {
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      format: true,
      indentBy: '  ',
      suppressEmptyNode: true
    };

    this.parser = new XMLParser(this.parserOptions);
    this.builder = new XMLBuilder(this.builderOptions);
  }

  /**
   * Converte XML string para objeto JavaScript
   * @param {string} xmlString - String XML para converter
   * @returns {object} Objeto JavaScript
   */
  parseXML(xmlString) {
    try {
      return this.parser.parse(xmlString);
    } catch (error) {
      console.error('Erro ao fazer parse do XML:', error);
      throw new Error(`Erro ao processar XML: ${error.message}`);
    }
  }

  /**
   * Converte objeto JavaScript para XML string
   * @param {object} jsObject - Objeto JavaScript para converter
   * @returns {string} String XML
   */
  buildXML(jsObject) {
    try {
      return this.builder.build(jsObject);
    } catch (error) {
      console.error('Erro ao construir XML:', error);
      throw new Error(`Erro ao gerar XML: ${error.message}`);
    }
  }

  /**
   * Extrai dados específicos da NFe do XML
   * @param {string} xmlString - XML da NFe
   * @returns {object} Dados extraídos da NFe
   */
  extractNFeData(xmlString) {
    try {
      const xmlObj = this.parseXML(xmlString);
      
      // Navegar pela estrutura do XML da NFe
      const nfeProc = xmlObj.nfeProc || xmlObj;
      const nfe = nfeProc.NFe || nfeProc.nfe;
      const infNFe = nfe.infNFe;
      
      return {
        // Identificação
        chave: infNFe['@_Id']?.replace('NFe', '') || '',
        numero: infNFe.ide?.nNF || '',
        serie: infNFe.ide?.serie || '',
        dataEmissao: infNFe.ide?.dhEmi || '',
        naturezaOperacao: infNFe.ide?.natOp || '',
        
        // Emitente
        emitente: {
          cnpj: infNFe.emit?.CNPJ || '',
          razaoSocial: infNFe.emit?.xNome || '',
          nomeFantasia: infNFe.emit?.xFant || '',
          endereco: {
            logradouro: infNFe.emit?.enderEmit?.xLgr || '',
            numero: infNFe.emit?.enderEmit?.nro || '',
            bairro: infNFe.emit?.enderEmit?.xBairro || '',
            municipio: infNFe.emit?.enderEmit?.xMun || '',
            uf: infNFe.emit?.enderEmit?.UF || '',
            cep: infNFe.emit?.enderEmit?.CEP || ''
          }
        },
        
        // Destinatário
        destinatario: infNFe.dest ? {
          documento: infNFe.dest.CPF || infNFe.dest.CNPJ || '',
          nome: infNFe.dest.xNome || '',
          endereco: {
            logradouro: infNFe.dest?.enderDest?.xLgr || '',
            numero: infNFe.dest?.enderDest?.nro || '',
            bairro: infNFe.dest?.enderDest?.xBairro || '',
            municipio: infNFe.dest?.enderDest?.xMun || '',
            uf: infNFe.dest?.enderDest?.UF || '',
            cep: infNFe.dest?.enderDest?.CEP || ''
          }
        } : null,
        
        // Itens
        itens: this.extractItems(infNFe.det),
        
        // Totais
        totais: {
          valorProdutos: infNFe.total?.ICMSTot?.vProd || 0,
          valorDesconto: infNFe.total?.ICMSTot?.vDesc || 0,
          valorTotal: infNFe.total?.ICMSTot?.vNF || 0,
          valorTributos: infNFe.total?.ICMSTot?.vTotTrib || 0
        },
        
        // Protocolo (se autorizada)
        protocolo: nfeProc.protNFe ? {
          numero: nfeProc.protNFe.infProt?.nProt || '',
          dataAutorizacao: nfeProc.protNFe.infProt?.dhRecbto || '',
          status: nfeProc.protNFe.infProt?.cStat || '',
          motivo: nfeProc.protNFe.infProt?.xMotivo || ''
        } : null
      };
    } catch (error) {
      console.error('Erro ao extrair dados da NFe:', error);
      throw new Error(`Erro ao processar NFe: ${error.message}`);
    }
  }

  /**
   * Extrai itens da NFe
   * @param {object|array} detItems - Detalhes dos itens
   * @returns {array} Array de itens
   */
  extractItems(detItems) {
    if (!detItems) return [];
    
    // Se for um único item, converter para array
    const items = Array.isArray(detItems) ? detItems : [detItems];
    
    return items.map(item => ({
      numero: item['@_nItem'] || '',
      codigo: item.prod?.cProd || '',
      descricao: item.prod?.xProd || '',
      ncm: item.prod?.NCM || '',
      cfop: item.prod?.CFOP || '',
      unidade: item.prod?.uCom || '',
      quantidade: parseFloat(item.prod?.qCom || 0),
      valorUnitario: parseFloat(item.prod?.vUnCom || 0),
      valorTotal: parseFloat(item.prod?.vProd || 0),
      
      // Impostos
      impostos: {
        icms: this.extractICMS(item.imposto?.ICMS),
        pis: this.extractPIS(item.imposto?.PIS),
        cofins: this.extractCOFINS(item.imposto?.COFINS)
      }
    }));
  }

  /**
   * Extrai dados do ICMS
   * @param {object} icmsData - Dados do ICMS
   * @returns {object} Dados do ICMS extraídos
   */
  extractICMS(icmsData) {
    if (!icmsData) return {};
    
    // ICMS pode ter diferentes situações tributárias
    const icmsKey = Object.keys(icmsData)[0];
    const icms = icmsData[icmsKey];
    
    return {
      situacaoTributaria: icms?.CST || icms?.CSOSN || '',
      origem: icms?.orig || '',
      baseCalculo: parseFloat(icms?.vBC || 0),
      aliquota: parseFloat(icms?.pICMS || 0),
      valor: parseFloat(icms?.vICMS || 0)
    };
  }

  /**
   * Extrai dados do PIS
   * @param {object} pisData - Dados do PIS
   * @returns {object} Dados do PIS extraídos
   */
  extractPIS(pisData) {
    if (!pisData) return {};
    
    const pisKey = Object.keys(pisData)[0];
    const pis = pisData[pisKey];
    
    return {
      situacaoTributaria: pis?.CST || '',
      baseCalculo: parseFloat(pis?.vBC || 0),
      aliquota: parseFloat(pis?.pPIS || 0),
      valor: parseFloat(pis?.vPIS || 0)
    };
  }

  /**
   * Extrai dados do COFINS
   * @param {object} cofinsData - Dados do COFINS
   * @returns {object} Dados do COFINS extraídos
   */
  extractCOFINS(cofinsData) {
    if (!cofinsData) return {};
    
    const cofinsKey = Object.keys(cofinsData)[0];
    const cofins = cofinsData[cofinsKey];
    
    return {
      situacaoTributaria: cofins?.CST || '',
      baseCalculo: parseFloat(cofins?.vBC || 0),
      aliquota: parseFloat(cofins?.pCOFINS || 0),
      valor: parseFloat(cofins?.vCOFINS || 0)
    };
  }

  /**
   * Valida se o XML é uma NFe válida
   * @param {string} xmlString - XML para validar
   * @returns {object} Resultado da validação
   */
  validateNFeXML(xmlString) {
    try {
      const xmlObj = this.parseXML(xmlString);
      
      // Verificar se tem estrutura de NFe
      const nfeProc = xmlObj.nfeProc || xmlObj;
      const nfe = nfeProc.NFe || nfeProc.nfe;
      
      if (!nfe) {
        return {
          valid: false,
          error: 'XML não contém estrutura de NFe'
        };
      }
      
      const infNFe = nfe.infNFe;
      if (!infNFe) {
        return {
          valid: false,
          error: 'XML não contém informações da NFe (infNFe)'
        };
      }
      
      // Verificar campos obrigatórios
      const requiredFields = {
        'ide': infNFe.ide,
        'emit': infNFe.emit,
        'det': infNFe.det,
        'total': infNFe.total
      };
      
      for (const [field, value] of Object.entries(requiredFields)) {
        if (!value) {
          return {
            valid: false,
            error: `Campo obrigatório ausente: ${field}`
          };
        }
      }
      
      return {
        valid: true,
        data: this.extractNFeData(xmlString)
      };
      
    } catch (error) {
      return {
        valid: false,
        error: `Erro ao validar XML: ${error.message}`
      };
    }
  }

  /**
   * Formata XML para exibição
   * @param {string} xmlString - XML para formatar
   * @returns {string} XML formatado
   */
  formatXML(xmlString) {
    try {
      const xmlObj = this.parseXML(xmlString);
      return this.buildXML(xmlObj);
    } catch (error) {
      console.error('Erro ao formatar XML:', error);
      return xmlString; // Retorna o original se houver erro
    }
  }
}

export default new XMLParserUtil();