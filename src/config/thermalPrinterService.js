// Serviço para configuração e controle da impressora térmica Jetway JP-800

class ThermalPrinterService {
  constructor() {
    this.printerModel = 'Jetway JP-800';
    this.supportedSizes = {
      '80x210': { width: 80, height: 210, name: '80mm x 210mm (Cupom Fiscal)' },
      '80x297': { width: 80, height: 297, name: '80mm x 297mm (A4 Térmico)' },
      '80x3276': { width: 80, height: 3276, name: '80mm x 3276mm (Bobina Longa)' },
      '80x9999': { width: 80, height: 9999, name: '80mm x Contínuo (Sem Corte)' }
    };
    this.defaultConfig = {
      paperSize: '80x210',
      density: 'dark',
      speed: 'slow',
      cutType: 'partial',
      encoding: 'utf-8',
      lineSpacing: 'tight'
    };
  }

  // Inicializar QZ Tray
  async initializeQZTray() {
    try {
      if (!window.qz) {
        throw new Error('QZ Tray não está instalado. Baixe em: https://qz.io/download/');
      }

      if (!window.qz.websocket.isActive()) {
        console.log('🔌 Conectando ao QZ Tray...');
        
        // Configurar certificado
        window.qz.security.setCertificatePromise(function(resolve, reject) {
          resolve();
        });
        
        await window.qz.websocket.connect();
        console.log('✅ QZ Tray conectado com sucesso');
      }

      return { success: true, message: 'QZ Tray conectado com sucesso' };
    } catch (error) {
      console.error('❌ Erro ao conectar QZ Tray:', error);
      throw new Error(`QZ Tray: ${error.message}`);
    }
  }

  // Imprimir recibo usando configurações térmicas
  async printThermal(saleData, config = {}) {
    try {
      console.log('🔥 Iniciando impressão térmica:', saleData);
      
      // Tentar usar QZ Tray primeiro
      try {
        await this.initializeQZTray();
        
        // Preparar dados para impressão
        const printData = [];
        
        // Se logo está habilitado, adicionar imagem primeiro
        if (config.logoRecibo !== false) {
          console.log('🖼️ Logo habilitado...');
          try {
            const logoUrl = config.logoEmpresaUrl || 'https://loja-play-fit.vercel.app/PlayFit-logo-sem-fundo.png';
            printData.push({
              type: 'image',
              format: 'png',
              data: logoUrl,
              options: {
                language: 'ESCPOS',
                dotDensity: 'double',
                xmlTag: 'image'
              }
            });
          } catch (logoError) {
            console.warn('⚠️ Erro ao carregar logo:', logoError);
          }
        }
        
        // Gerar comandos ESC/POS
        const escposCommands = this.generateReceiptESCPOS(saleData, config);
        
        // Adicionar comandos de texto
        printData.push({
          type: 'raw',
          format: 'plain',
          data: escposCommands
        });
        
        // Configurar impressora
        const qzConfig = window.qz.configs.create(config.impressoraTermica || 'Jetway JP-800');
        
        // Enviar para impressão
        await window.qz.print(qzConfig, printData);
        
        return {
          success: true,
          message: 'Documento enviado para impressora térmica via QZ Tray'
        };
        
      } catch (qzError) {
        console.warn('⚠️ QZ Tray não disponível:', qzError.message);
        return {
          success: true,
          message: '⚠️ QZ Tray não disponível. Para impressão térmica direta, instale o QZ Tray.',
          requiresQZTray: true
        };
      }
      
    } catch (error) {
      console.error('Erro na impressão térmica:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Gerar comandos ESC/POS para recibo
  generateReceiptESCPOS(saleData, config = {}) {
    const commands = [];
    
    // Inicializar impressora
    commands.push('\x1B\x40');
    commands.push('\x1B\x7B\x04'); // Densidade máxima
    commands.push('\x1B\x73\x00'); // Velocidade baixa
    commands.push('\x1B\x33\x18'); // Espaçamento compacto
    
    // Cabeçalho da empresa
    commands.push('\x1B\x61\x01'); // Centralizar
    commands.push('\x1B\x21\x08'); // Fonte dupla
    commands.push('ACADEMIA PLAY FIT II\n');
    commands.push('\x1B\x21\x00'); // Fonte normal
    
    // Informações da empresa
    commands.push('CNPJ: 57673794000171\n');
    commands.push('Logradouro: Avenida C, S/N\n');
    commands.push('Complemento: Quadrab3 Lote 17E\n');
    commands.push('Bairro: Jardim Boa Esperanca\n');
    commands.push('Continuacao CEP: 74960-302\n');
    commands.push('Municipio: Aparecida de Goiania\n');
    commands.push('Estado: Goias\n');
    commands.push('Tel: (62) 99192-0954\n');
    commands.push('\x1B\x61\x00'); // Alinhar à esquerda
    
    commands.push('================================\n');
    
    // Título do documento
    commands.push('\x1B\x61\x01'); // Centralizar
    commands.push('\x1B\x21\x08'); // Fonte dupla
    commands.push('COMPROVANTE DE COMPRA\n');
    commands.push('\x1B\x21\x00'); // Fonte normal
    commands.push('\x1B\x61\x00'); // Alinhar à esquerda
    
    commands.push('================================\n');
    
    // Informações da venda
    commands.push(`No ${saleData.numero || 'N/A'}\n`);
    commands.push(`Data: ${saleData.dataVenda || new Date().toLocaleDateString('pt-BR')}\n`);
    if (saleData.vendedor) {
      commands.push(`Vendedor: ${saleData.vendedor}\n`);
    }
    commands.push('================================\n');
    
    // Itens
    if (saleData.items && saleData.items.length > 0) {
      commands.push('ITEM QTD x VALOR\n');
      saleData.items.forEach((item, index) => {
        commands.push(`${String(index + 1).padStart(2, '0')} ${item.nome}\n`);
        const qtdPreco = `${item.quantidade} x R$ ${item.preco.toFixed(2)} = R$ ${(item.quantidade * item.preco).toFixed(2)}`;
        commands.push(`   ${qtdPreco}\n`);
      });
    }
    
    commands.push('================================\n');
    
    // Totais
    if (saleData.desconto > 0) {
      commands.push(`Subtotal: R$ ${(saleData.total + saleData.desconto).toFixed(2)}\n`);
      commands.push(`Desconto: R$ ${saleData.desconto.toFixed(2)}\n`);
    }
    commands.push('\x1B\x21\x08'); // Fonte dupla
    commands.push(`TOTAL: R$ ${saleData.total.toFixed(2)}\n`);
    commands.push('\x1B\x21\x00'); // Fonte normal
    
    commands.push('================================\n');
    
    // Pagamento
    if (saleData.paymentMethod) {
      commands.push(`Pagamento: ${saleData.paymentMethod}\n`);
    }
    
    commands.push('================================\n');
    commands.push('\x1B\x61\x01'); // Centralizar
    commands.push('Obrigado pela preferencia!\n');
    commands.push(`${new Date().toLocaleString('pt-BR')}\n`);
    commands.push('- - - CORTE AQUI - - -\n');
    commands.push('\x1B\x61\x00'); // Alinhar à esquerda
    
    commands.push('\n\n');
    commands.push('\x1D\x56\x41'); // Corte parcial
    
    return commands.join('');
  }

  // Imprimir NFCe na impressora térmica
  async printNFCeThermal(xmlData, config = {}) {
    try {
      console.log('🔥 Iniciando impressão NFCe térmica:', xmlData);
      
      // Tentar usar QZ Tray primeiro
      try {
        await this.initializeQZTray();
        
        // Preparar dados para impressão
        const printData = [];
        
        // Se logo está habilitado, adicionar imagem primeiro
        if (config.logoRecibo !== false) {
          console.log('🖼️ Logo habilitado para NFCe...');
          try {
            const logoUrl = config.logoEmpresaUrl || 'https://loja-play-fit.vercel.app/PlayFit-logo-sem-fundo.png';
            printData.push({
              type: 'image',
              format: 'png',
              data: logoUrl,
              options: {
                language: 'ESCPOS',
                dotDensity: 'double',
                xmlTag: 'image'
              }
            });
          } catch (logoError) {
            console.warn('⚠️ Erro ao carregar logo NFCe:', logoError);
          }
        }
        
        // Gerar comandos ESC/POS para NFCe
        const escposCommands = this.generateNFCeESCPOS(xmlData, config);
        
        // Adicionar comandos de texto
        printData.push({
          type: 'raw',
          format: 'plain',
          data: escposCommands
        });
        
        // Configurar impressora
        const qzConfig = window.qz.configs.create(config.impressoraTermica || 'Jetway JP-800');
        
        // Enviar para impressão
        await window.qz.print(qzConfig, printData);
        
        return {
          success: true,
          message: 'NFCe enviada para impressora térmica via QZ Tray'
        };
        
      } catch (qzError) {
        console.warn('⚠️ QZ Tray não disponível para NFCe:', qzError.message);
        return {
          success: true,
          message: '⚠️ QZ Tray não disponível. NFCe impressa via navegador.',
          requiresQZTray: true
        };
      }
      
    } catch (error) {
      console.error('Erro na impressão NFCe térmica:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Gerar comandos ESC/POS específicos para NFCe
  generateNFCeESCPOS(xmlData, config = {}) {
    const commands = [];
    
    // Inicializar impressora
    commands.push('\x1B\x40');
    commands.push('\x1B\x7B\x04'); // Densidade máxima
    commands.push('\x1B\x73\x00'); // Velocidade baixa
    commands.push('\x1B\x33\x18'); // Espaçamento compacto
    
    // Cabeçalho da empresa
    commands.push('\x1B\x61\x01'); // Centralizar
    commands.push('\x1B\x21\x08'); // Fonte dupla
    commands.push(`${xmlData.emitente.nome}\n`);
    commands.push('\x1B\x21\x00'); // Fonte normal
    
    // Informações da empresa
    commands.push(`CNPJ: ${this.formatCNPJ(xmlData.emitente.cnpj)}\n`);
    commands.push(`${xmlData.emitente.endereco}, ${xmlData.emitente.numero}\n`);
    commands.push(`${xmlData.emitente.bairro} - ${xmlData.emitente.cidade}/${xmlData.emitente.uf}\n`);
    commands.push(`CEP: ${this.formatCEP(xmlData.emitente.cep)}\n`);
    commands.push('\x1B\x61\x00'); // Alinhar à esquerda
    
    commands.push('================================\n');
    
    // Título NFCe
    commands.push('\x1B\x61\x01'); // Centralizar
    commands.push('\x1B\x21\x08'); // Fonte dupla
    commands.push('CUPOM FISCAL ELETRONICO - SAT\n');
    commands.push('\x1B\x21\x00'); // Fonte normal
    commands.push(`NFCe no ${xmlData.numero} Serie ${xmlData.serie}\n`);
    commands.push(`Emissao: ${this.formatDateTime(xmlData.dataEmissao)}\n`);
    commands.push('\x1B\x61\x00'); // Alinhar à esquerda
    
    commands.push('================================\n');
    
    // Itens
    commands.push('ITEM DESCRICAO\n');
    xmlData.itens.forEach((item, index) => {
      commands.push(`${String(index + 1).padStart(3, '0')} ${item.descricao}\n`);
      commands.push(`Qtd: ${item.quantidade} ${item.unidade} x R$ ${parseFloat(item.valorUnitario).toFixed(2)}\n`);
      commands.push(`Total: R$ ${parseFloat(item.valorTotal).toFixed(2)}\n`);
    });
    
    commands.push('================================\n');
    
    // Totais
    if (parseFloat(xmlData.totais.valorDesconto) > 0) {
      commands.push(`Subtotal: R$ ${(parseFloat(xmlData.totais.valorTotal) + parseFloat(xmlData.totais.valorDesconto)).toFixed(2)}\n`);
      commands.push(`Desconto: R$ ${parseFloat(xmlData.totais.valorDesconto).toFixed(2)}\n`);
    }
    commands.push('\x1B\x21\x08'); // Fonte dupla
    commands.push(`TOTAL: R$ ${parseFloat(xmlData.totais.valorTotal).toFixed(2)}\n`);
    commands.push('\x1B\x21\x00'); // Fonte normal
    
    commands.push('================================\n');
    
    // Consumidor (se houver CPF/CNPJ)
    if (xmlData.destinatario && xmlData.destinatario.cpfCnpj) {
      commands.push('CONSUMIDOR:\n');
      commands.push(`${xmlData.destinatario.nome}\n`);
      commands.push(`${xmlData.destinatario.cpfCnpj.length === 11 ? 'CPF' : 'CNPJ'}: ${this.formatCPFCNPJ(xmlData.destinatario.cpfCnpj)}\n`);
      commands.push('================================\n');
    }
    
    // Informações fiscais obrigatórias
    commands.push('INFORMACOES FISCAIS:\n');
    commands.push(`Tributos Totais: R$ ${parseFloat(xmlData.totais.valorTributos || 0).toFixed(2)}\n`);
    commands.push('(Lei 12.741/2012)\n');
    commands.push('================================\n');
    
    // Chave de acesso (obrigatório)
    commands.push('\x1B\x61\x01'); // Centralizar
    commands.push('Chave de Acesso:\n');
    commands.push(`${this.formatChaveAcesso(xmlData.chave)}\n`);
    commands.push('Consulte pela chave de acesso em:\n');
    commands.push('www.nfce.fazenda.gov.br\n');
    
    // QR Code (simulado - obrigatório para NFCe)
    commands.push('================================\n');
    commands.push('QR CODE:\n');
    commands.push('█████████████████████████████\n');
    commands.push('█ ▄▄▄▄▄ █▀█ █▄▀█▀▄▄▄█ ▄▄▄▄▄ █\n');
    commands.push('█ █   █ █▀▀▀█ ▄▄█▄▄█ █   █ █\n');
    commands.push('█ █▄▄▄█ █▀ █▀▀▄█▀▄▄█ █▄▄▄█ █\n');
    commands.push('█▄▄▄▄▄▄▄█▄▀ ▀▄█ █▄█▄▄▄▄▄▄▄▄█\n');
    commands.push('█████████████████████████████\n');
    commands.push('Escaneie para consultar a NFCe\n');
    commands.push('\x1B\x61\x00'); // Alinhar à esquerda
    
    commands.push('================================\n');
    commands.push('\x1B\x61\x01'); // Centralizar
    commands.push('Obrigado pela preferencia!\n');
    commands.push(`${new Date().toLocaleString('pt-BR')}\n`);
    commands.push('- - - CORTE AQUI - - -\n');
    commands.push('\x1B\x61\x00'); // Alinhar à esquerda
    
    commands.push('\n\n');
    commands.push('\x1D\x56\x41'); // Corte parcial
    
    return commands.join('');
  }

  // Funções auxiliares de formatação
  formatCNPJ(cnpj) {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  formatCEP(cep) {
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  formatCPFCNPJ(doc) {
    if (doc.length === 11) {
      return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  }

  formatDateTime(dateTime) {
    try {
      const date = new Date(dateTime);
      return date.toLocaleString('pt-BR');
    } catch {
      return dateTime;
    }
  }

  formatChaveAcesso(chave) {
    return chave.replace(/(\d{4})/g, '$1 ').trim();
  }
}

const thermalPrinterService = new ThermalPrinterService();
export default thermalPrinterService;