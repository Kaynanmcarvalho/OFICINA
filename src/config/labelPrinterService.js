import { generateCatechZPL, generateCatechHTML } from '../components/CatechLabelTemplate';
import { generateDualTSPL, generateDualZPL, generateDualHTML } from '../components/DualLabelTemplate';

/**
 * Serviço para Impressora de Etiquetas
 * Suporte a impressoras de etiquetas para produtos como roupas, acessórios, etc.
 * Configurado especificamente para C3Tech IT-200 com layout duplo 80x30mm
 */

class LabelPrinterService {
  constructor() {
    // Configurações padrão otimizadas para C3Tech IT-200 com layout duplo
    this.defaultConfig = {
      impressoraEtiquetas: 'C3Tech IT-200',
      tamanhoEtiqueta: '80x30mm',
      layoutEtiqueta: 'dupla', // 'dupla' ou 'simples'
      densidadeEtiqueta: 8,
      velocidadeEtiqueta: 2,
      tipoEtiqueta: 'termica',
      formatoEtiqueta: 'ZPL', // 'TSPL', 'ZPL', ou 'HTML' - ZPL como padrão
      margemEtiqueta: 2,
      fonte: 'Arial',
      tamanhoFonte: 12,
      orientacao: 'portrait',
      incluirLogo: true,
      incluirCodigoBarras: true,
      incluirPreco: true,
      incluirTamanho: true,
      incluirQRCode: false,
      nomeEmpresa: 'ACADEMIA PLAY FIT',
      // offsets padrão (dots)
      offsetYDots: -15,
      leftOffsetXDots: -5,
      rightOffsetXDots: 0,
    };
    this.currentConfig = this.defaultConfig;
    this.qz = null; // Referência para QZ Tray
  }

  // Inicializar QZ Tray
  async initializeQZTray() {
    try {
      // Verificar se QZ Tray está disponível
      if (!window.qz) {
        throw new Error('QZ Tray não está carregado. Verifique se o script foi incluído.');
      }

      // Conectar ao QZ Tray
      if (!window.qz.websocket.isActive()) {
        await window.qz.websocket.connect();
      }

      console.log('QZ Tray conectado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao conectar com QZ Tray:', error);
      throw error;
    }
  }

  // Verificar se QZ Tray está disponível e conectado
  async isQZTrayAvailable() {
    try {
      if (!window.qz) return false;
      return await window.qz.websocket.isActive();
    } catch (error) {
      return false;
    }
  }

  // Tamanhos de etiqueta suportados (específicos para C3Tech com layout duplo)
  getSupportedSizes() {
    return [
      { value: '80x30mm', label: '80x30mm (Layout Duplo - Recomendado)', width: 80, height: 30 },
      { value: '54x35mm', label: '54x35mm (C3Tech Padrão)', width: 54, height: 35 },
      { value: '108x35mm', label: '108x35mm (C3Tech Linha completa)', width: 108, height: 35 },
      { value: '54x70mm', label: '54x70mm (C3Tech Dupla altura)', width: 54, height: 70 }
    ];
  }

  // Impressoras suportadas (foco em C3Tech IT-200)
  // Recomendadas: C3Tech IT-200, C3Tech LB-600
  // Compatíveis: CATECH IT-200, Zebra ZD220
  getSupportedPrinters() {
    return [
      { value: 'C3Tech IT-200', label: 'C3Tech IT-200 (Recomendada)', type: 'thermal', formats: ['TSPL', 'ZPL'] },
      { value: 'C3Tech LB-600', label: 'C3Tech LB-600', type: 'thermal', formats: ['TSPL', 'ZPL'] },
      { value: 'CATECH IT-200', label: 'CATECH IT-200', type: 'thermal', formats: ['TSPL', 'ZPL'] },
      { value: 'Zebra ZD220', label: 'Zebra ZD220', type: 'thermal', formats: ['ZPL'] },
      { value: 'Browser', label: 'Navegador/PDF', type: 'browser', formats: ['HTML'] }
    ];
  }

  // Formatos de comando suportados
  getSupportedFormats() {
    return [
      { value: 'TSPL', label: 'TSPL (C3Tech Recomendado)', description: 'Linguagem nativa C3Tech' },
      { value: 'ZPL', label: 'ZPL (Zebra Compatible)', description: 'Compatível com Zebra' },
      { value: 'HTML', label: 'HTML (Navegador)', description: 'Impressão via navegador' }
    ];
  }

  // Configurar impressora de etiquetas
  async configureLabelPrinter(config) {
    try {
      const mergedConfig = { ...this.defaultConfig, ...config };
      
      // Validar configurações
      if (!this.validateConfig(mergedConfig)) {
        throw new Error('Configurações inválidas para impressora de etiquetas');
      }

      // Salvar configurações
      localStorage.setItem('labelPrinterConfig', JSON.stringify(mergedConfig));
      
      return {
        success: true,
        message: 'Impressora de etiquetas configurada com sucesso',
        config: mergedConfig
      };
    } catch (error) {
      console.error('Erro ao configurar impressora de etiquetas:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Validar configurações
  validateConfig(config) {
    const supportedSizes = this.getSupportedSizes().map(s => s.value);
    const supportedPrinters = this.getSupportedPrinters();

    return (
      supportedPrinters.includes(config.impressoraEtiqueta) &&
      supportedSizes.includes(config.tamanhoEtiqueta) &&
      config.densidadeEtiqueta >= 1 && config.densidadeEtiqueta <= 15 &&
      config.velocidadeEtiqueta >= 1 && config.velocidadeEtiqueta <= 10
    );
  }

  // Gerar comandos para impressoras baseado no formato escolhido
  generatePrintCommands(produto, config) {
    // Se for um único produto, converter para array
    const produtos = Array.isArray(produto) ? produto : [produto];
    const finalConfig = { ...this.currentConfig, ...config };
    
    console.log('Gerando comandos para formato:', finalConfig.formatoEtiqueta);
    console.log('Layout:', finalConfig.layoutEtiqueta);
    console.log('Tamanho:', finalConfig.tamanhoEtiqueta);
    
    // Determinar qual função usar baseado no formato e layout
    switch (finalConfig.formatoEtiqueta) {
      case 'TSPL':
        if (finalConfig.layoutEtiqueta === 'dupla' && finalConfig.tamanhoEtiqueta === '80x30mm') {
          return generateDualTSPL(produtos, finalConfig);
        } else {
          // Fallback para formato antigo
          return this.generateTSPLCommands(produtos, finalConfig);
        }
        
      case 'ZPL':
        if (finalConfig.layoutEtiqueta === 'dupla' && finalConfig.tamanhoEtiqueta === '80x30mm') {
          // passar offsets se existirem
          return generateDualZPL(produtos, finalConfig);
        } else {
          // Usar ZPL do CatechTemplate para compatibilidade
          return generateCatechZPL(produtos, finalConfig);
        }
        
      case 'HTML':
        if (finalConfig.layoutEtiqueta === 'dupla' && finalConfig.tamanhoEtiqueta === '80x30mm') {
          return generateDualHTML(produtos, finalConfig);
        } else {
          // Fallback para formato antigo
          return generateCatechHTML(produtos, finalConfig);
        }
        
      default:
        // Formato padrão (TSPL duplo)
        return generateDualTSPL(produtos, finalConfig);
    }
  }

  // Gerar comandos ZPL para impressoras (mantido para compatibilidade)
  generateZPLCommands(produto, config) {
    return this.generatePrintCommands(produto, { ...config, formatoEtiqueta: 'ZPL' });
  }

  // Gerar comandos TSPL para impressoras C3Tech
  generateTSPLCommands(produtos, config) {
    const {
      nomeEmpresa = "ACADEMIA PLAY FIT",
      incluirCodigoBarras = true,
      incluirPreco = true,
      incluirTamanho = true,
      tamanhoEtiqueta = '54x35mm'
    } = config;

    const [width, height] = tamanhoEtiqueta.split('x').map(s => parseInt(s));
    
    let tspl = `SIZE ${width} mm, ${height} mm\n`;
    tspl += 'DIRECTION 1\n';
    tspl += 'REFERENCE 0,0\n';
    tspl += 'OFFSET 0 mm\n';
    tspl += 'SET PEEL OFF\n';
    tspl += 'SET CUTTER OFF\n';
    tspl += 'SET PARTIAL_CUTTER OFF\n';
    tspl += 'SET TEAR ON\n';
    tspl += 'CLS\n';

    produtos.forEach((produto, index) => {
      if (index > 0) {
        tspl += 'PRINT 1,1\n';
        tspl += 'CLS\n';
      }

      // Nome da empresa
      tspl += `TEXT 20,10,"3",0,1,1,"${nomeEmpresa}"\n`;
      
      // Nome do produto
      const nomeProduto = produto.nome.length > 20 ? 
        produto.nome.substring(0, 20) + '...' : 
        produto.nome;
      tspl += `TEXT 20,35,"2",0,1,1,"${nomeProduto}"\n`;
      
      // Tamanho
      if (incluirTamanho && produto.tamanho) {
        tspl += `TEXT 10,60,"1",0,1,1,"TAM: ${produto.tamanho}"\n`;
      }
      
      // Preço
      if (incluirPreco && produto.preco) {
        tspl += `TEXT 10,80,"2",0,1,1,"R$ ${produto.preco.toFixed(2)}"\n`;
      }
      
      // Código de barras
      if (incluirCodigoBarras && produto.codigo) {
        tspl += `BARCODE 60,110,"128",40,1,0,2,2,"${produto.codigo}"\n`;
      }
    });

    tspl += 'PRINT 1,1\n';
    return tspl;
  }

  // Gerar comandos ESC/POS para impressoras Brother/Dymo
  generateESCPOSCommands(produto, config) {
    let commands = [];
    
    // Inicializar
    commands.push('\x1B@'); // ESC @
    
    // Configurar densidade
    commands.push(`\x1Bd${config.densidadeEtiqueta}`);
    
    // Nome do produto
    commands.push('\x1B!\x08'); // Texto em negrito
    commands.push(produto.nome + '\n');
    commands.push('\x1B!\x00'); // Texto normal
    
    // Preço
    if (produto.preco) {
      const preco = produto.precoPromocional || produto.preco;
      commands.push(`R$ ${preco.toFixed(2)}\n`);
    }
    
    // Tamanho
    if (produto.tamanho) {
      commands.push(`Tam: ${produto.tamanho}\n`);
    }
    
    // Código de barras
    if (config.incluirCodigoBarras && produto.codigoBarras) {
      commands.push('\x1Dk\x04'); // Código de barras CODE128
      commands.push(produto.codigoBarras + '\x00');
    }
    
    // Cortar papel
    commands.push('\x1Bi');
    
    return commands.join('');
  }

  // Gerar HTML para preview da etiqueta
  generateLabelHTML(produto, config) {
    const finalConfig = { ...this.currentConfig, ...config };
    
    // Usar o novo sistema de geração baseado no formato
    if (finalConfig.formatoEtiqueta === 'HTML' || !finalConfig.formatoEtiqueta) {
      return this.generatePrintCommands(produto, finalConfig);
    }
    
    // Fallback para compatibilidade
    return generateCatechHTML([produto], {
      nomeEmpresa: finalConfig.nomeEmpresa || "ACADEMIA PLAY FIT",
      incluirLogo: finalConfig.incluirLogo,
      incluirCodigoBarras: finalConfig.incluirCodigoBarras,
      incluirPreco: finalConfig.incluirPreco,
      incluirTamanho: finalConfig.incluirTamanho
    });
  }

  // Verificar status da impressora
  async checkPrinterStatus(printerName) {
    try {
      // Verificar se QZ Tray está disponível
      if (window.qz && window.qz.websocket) {
        const isConnected = await window.qz.websocket.isActive();
        if (isConnected) {
          // Verificar se a impressora específica está disponível
          const printers = await window.qz.printers.find();
          const printerFound = printers.some(p => 
            p.toLowerCase().includes(printerName?.toLowerCase() || 'zebra')
          );
          
          return {
            online: printerFound,
            paperLoaded: true,
            error: printerFound ? null : `Impressora ${printerName} não encontrada`,
            model: printerName,
            qzConnected: true,
            availablePrinters: printers
          };
        }
      }
      
      // Fallback para simulação se QZ Tray não estiver disponível
      return {
        online: false,
        paperLoaded: false,
        error: 'QZ Tray não está conectado',
        model: printerName,
        qzConnected: false,
        availablePrinters: []
      };
    } catch (error) {
      return {
        online: false,
        paperLoaded: false,
        error: error.message,
        model: printerName,
        qzConnected: false,
        availablePrinters: []
      };
    }
  }

  // Imprimir etiqueta
  async printLabel(labelData, config = {}) {
    try {
      const finalConfig = { ...this.currentConfig, ...config };
      
      console.log('Configuração final para impressão:', finalConfig);
      console.log('Dados da etiqueta:', labelData);
      console.log('Formato de impressão:', finalConfig.formatoEtiqueta);
      
      // Se for impressão via navegador (HTML)
      if (finalConfig.formatoEtiqueta === 'HTML' || finalConfig.impressoraEtiquetas === 'Browser') {
        const htmlContent = this.generateLabelHTML(labelData, finalConfig);
        
        // Abrir nova janela para impressão
        const printWindow = window.open('', '_blank');
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        
        return {
          success: true,
          message: 'Etiqueta enviada para impressão via navegador',
          method: 'browser'
        };
      }
      
      // Verificar se QZ Tray está disponível para impressão térmica
      if (window.qz && window.qz.websocket) {
        const isConnected = await window.qz.websocket.isActive();
        console.log('QZ Tray conectado:', isConnected);
        
        if (!isConnected) {
          throw new Error('QZ Tray não está conectado. Por favor, inicie o QZ Tray.');
        }

        // Gerar comandos baseado no formato escolhido
        const printCommands = this.generatePrintCommands(labelData, finalConfig);
        console.log(`Comandos ${finalConfig.formatoEtiqueta} gerados:`, printCommands);
        
        // Encontrar impressora térmica
        const printers = await window.qz.printers.find();
        console.log('Impressoras encontradas:', printers);
        
        let targetPrinter = printers.find(p => 
          p.toLowerCase().includes('4barcode') ||
          p.toLowerCase().includes('it-200') ||
          p.toLowerCase().includes('c3tech') ||
          p.toLowerCase().includes('catech') ||
          p.toLowerCase().includes('zebra')
        );
        
        if (!targetPrinter && printers.length > 0) {
          targetPrinter = printers[0]; // Usar primeira impressora disponível
        }
        
        if (!targetPrinter) {
          throw new Error('Nenhuma impressora térmica encontrada');
        }

        console.log('Impressora selecionada:', targetPrinter);

        // Configurar impressão com forceRaw para impressoras térmicas
        const config_qz = window.qz.configs.create(targetPrinter, {
          forceRaw: true,  // Bypass do driver para envio direto de comandos
          encoding: 'UTF-8'
        });
        
        // Converter comandos para array de strings (formato correto para QZ Tray)
        const commandLines = printCommands.split('\n').filter(line => line.trim() !== '');
        console.log(`Dados ${finalConfig.formatoEtiqueta} formatados para QZ Tray:`, commandLines);
        
        // Imprimir
        await window.qz.print(config_qz, commandLines);
        
        return {
          success: true,
          message: `Etiqueta impressa com sucesso via ${finalConfig.formatoEtiqueta}`,
          method: 'thermal',
          format: finalConfig.formatoEtiqueta,
          printer: targetPrinter
        };
      } else {
        // Fallback - mostrar comandos ZPL no console
        const zplCommands = this.generateZPLCommands(labelData, finalConfig);
        console.log('QZ Tray não disponível. Comandos ZPL gerados:', zplCommands);
        
        return {
          success: false,
          message: 'QZ Tray não está disponível. Comandos ZPL foram gerados no console.',
          zplCommands: zplCommands
        };
      }
    } catch (error) {
      console.error('Erro ao imprimir etiqueta:', error);
      return {
        success: false,
        message: error.message,
        error: error
      };
    }
  }

  // Imprimir múltiplas etiquetas
  async printMultipleLabels(produtos, quantidade = 1, customConfig = {}) {
    try {
      const results = [];
      
      for (const produto of produtos) {
        for (let i = 0; i < quantidade; i++) {
          const result = await this.printLabel(produto, customConfig);
          results.push({ produto: produto.nome, result });
          
          // Pequena pausa entre impressões
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      return {
        success: true,
        message: `${produtos.length * quantidade} etiquetas impressas com sucesso`,
        results
      };
      
    } catch (error) {
      console.error('Erro ao imprimir múltiplas etiquetas:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Método configure para compatibilidade com LabelPrintModal
  configure(config) {
    try {
      // Mesclar com configurações padrão
      this.currentConfig = { ...this.defaultConfig, ...config };
      
      // Salvar no localStorage para persistência
      localStorage.setItem('labelPrinterConfig', JSON.stringify(this.currentConfig));
      
      console.log('Impressora de etiquetas configurada:', this.currentConfig);
      return true;
    } catch (error) {
      console.error('Erro ao configurar impressora de etiquetas:', error);
      return false;
    }
  }

  // Obter configurações atuais
  getCurrentConfig() {
    const savedConfig = JSON.parse(localStorage.getItem('labelPrinterConfig') || '{}');
    return { ...this.defaultConfig, ...savedConfig };
  }
}

const labelPrinterService = new LabelPrinterService();
export default labelPrinterService;