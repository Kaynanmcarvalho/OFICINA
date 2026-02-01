// Serviço de impressão para recibos e documentos
import configService from './configService';
import thermalPrinterService from './thermalPrinterService';
import danfeGenerator from '../utils/danfeGenerator.js';
import jsPDF from 'jspdf';

class PrintService {
  constructor() {
    this.defaultConfig = {
      impressoraPadrao: 'default',
      formatoRecibo: 'A4',
      logoRecibo: true
    };
  }

  // Gerar HTML do recibo
  async generateReceiptHTML(saleData, userId) {
    try {
      // Carregar configurações do usuário (sempre buscar do Firestore para garantir dados atualizados)
      let config = this.defaultConfig;
      if (userId) {
        // Limpar cache para garantir dados atualizados
        configService.clearCache(userId);
        config = await configService.getConfig(userId);
      }
      
      const { formatoRecibo, logoRecibo } = config;
      
      // Debug
      
      // Definir estilos baseados no formato
      const styles = this.getReceiptStyles(formatoRecibo);
      
      // Verificar explicitamente se deve incluir logo (false = não incluir, true ou undefined = incluir)
      const shouldIncludeLogo = logoRecibo !== false;
      // Debug
      
      const logoSection = shouldIncludeLogo ? `
        <div class="logo-section">
          <img src="/PlayFit-logo-sem-fundo.png" alt="Loja Play Fit" class="logo" />
        </div>
      ` : '';
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Recibo - Venda #${saleData.numero}</title>
          <style>
            ${styles}
          </style>
        </head>
        <body>
          <div class="receipt">
            ${logoSection}
            
            <div class="header">
              <h1>${config.nomeEmpresa || 'ACADEMIA PLAY FIT II'}</h1>
              ${config.cnpj ? `<p>CNPJ: ${config.cnpj}</p>` : '<p>CNPJ: 57673794000171</p>'}
              ${config.endereco ? `<p>${config.endereco}</p>` : '<p>Logradouro: Avenida C, S/N Complemento: Quadrab3 Lote 17E</p>'}
              <p>Bairro: Jardim Boa Esperança - Continuação CEP: 74960-302</p>
              <p>Município: Aparecida de Goiânia Estado: Goiás</p>
              ${config.telefone ? `<p>Tel: ${config.telefone}</p>` : '<p>Tel: (62) 99192-0954</p>'}
            </div>
            
            <div class="divider"></div>
            
            <div class="sale-info">
              <p><strong>COMPROVANTE DE COMPRA</strong></p>
              <p>Número: #${saleData.numero}</p>
              <p>Data: ${saleData.dataVenda}</p>
            </div>
            
            <div class="divider"></div>
            
            <div class="items">
              <div class="items-header">
                <span>Item</span>
                <span>Qtd</span>
                <span>Valor</span>
                <span>Total</span>
              </div>
              
              ${saleData.items?.map(item => `
                <div class="item-row">
                  <span class="item-name">${item.nome || item.descricao}</span>
                  <span class="item-qty">${item.quantidade}</span>
                  <span class="item-price">R$ ${item.preco?.toFixed(2)}</span>
                  <span class="item-total">R$ ${(item.quantidade * item.preco)?.toFixed(2)}</span>
                </div>
              `).join('') || ''}
            </div>
            
            <div class="divider"></div>
            
            <div class="totals">
              <div class="total-row">
                <span><strong>TOTAL:</strong></span>
                <span><strong>R$ ${saleData.total?.toFixed(2)}</strong></span>
              </div>
              
              <div class="payment-info">
                <p>Pagamento: ${saleData.paymentMethod}</p>
              </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="footer">
              <p>Obrigado pela preferência!</p>
              <p>${new Date().toLocaleString('pt-BR')}</p>
              <p>- - - CORTE AQUI - - -</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      return html;
    } catch (error) {
      console.error('Erro ao gerar HTML do recibo:', error);
      throw new Error('Erro ao gerar recibo: ' + error.message);
    }
  }

  // Obter estilos CSS baseados no formato
  getReceiptStyles(formato) {
    const baseStyles = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Courier New', monospace;
        background: white;
        color: black;
      }
      
      .receipt {
        padding: 20px;
        max-width: 100%;
        margin: 0 auto;
      }
      
      .logo {
        max-width: 80px;
        height: auto;
        display: block;
        margin: 0 auto 10px;
      }
      
      .header {
        text-align: center;
        margin-bottom: 15px;
      }
      
      .header h1 {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .header p {
        font-size: 12px;
        margin-bottom: 2px;
      }
      
      .divider {
        border-top: 1px dashed #000;
        margin: 10px 0;
      }
      
      .sale-info {
        text-align: center;
        margin-bottom: 10px;
      }
      
      .sale-info p {
        font-size: 12px;
        margin-bottom: 2px;
      }
      
      .items-header {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        font-weight: bold;
        font-size: 11px;
        margin-bottom: 5px;
        padding-bottom: 3px;
        border-bottom: 1px solid #000;
      }
      
      .item-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        font-size: 10px;
        margin-bottom: 3px;
        align-items: center;
      }
      
      .item-name {
        word-wrap: break-word;
      }
      
      .item-qty, .item-price, .item-total {
        text-align: right;
      }
      
      .totals {
        margin-top: 10px;
      }
      
      .total-row {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        margin-bottom: 10px;
      }
      
      .payment-info {
        text-align: center;
        font-size: 11px;
      }
      
      .footer {
        text-align: center;
        margin-top: 15px;
      }
      
      .footer p {
        font-size: 12px;
        margin-bottom: 3px;
      }
      
      .small {
        font-size: 9px !important;
        color: #666;
      }
    `;

    // Estilos específicos por formato
    switch (formato) {
      case '80mm':
        return baseStyles + `
          .receipt {
            width: 80mm;
            font-size: 10px;
            padding: 8px;
            border: 2px dashed #000;
            background: #f9f9f9;
          }
          
          .header {
            border-bottom: 2px solid #000;
            padding-bottom: 8px;
          }
          
          .header h1 {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
          }
          
          .header p {
            font-size: 9px;
          }
          
          .logo {
            max-width: 50px;
          }
          
          .items-header {
            font-size: 9px;
            background: #000;
            color: white;
            padding: 2px;
          }
          
          .item-row {
            font-size: 8px;
            border-bottom: 1px dotted #ccc;
          }
          
          .total-row {
            font-size: 12px;
            background: #000;
            color: white;
            padding: 4px;
            margin: 5px -8px;
          }
          
          .footer {
            text-align: center;
            font-size: 8px;
            border-top: 2px solid #000;
            padding-top: 5px;
          }
          
          @media print {
            @page {
              size: 80mm auto;
              margin: 0;
            }
            .receipt {
              border: none;
              background: white;
            }
          }
        `;
        
      case '58mm':
        return baseStyles + `
          .receipt {
            width: 58mm;
            font-size: 8px;
            padding: 5px;
            border: 2px dashed #000;
            background: #f0f0f0;
          }
          
          .header {
            border-bottom: 2px solid #000;
            padding-bottom: 5px;
          }
          
          .header h1 {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          
          .header p {
            font-size: 7px;
          }
          
          .logo {
            max-width: 40px;
          }
          
          .items-header {
            font-size: 7px;
            background: #000;
            color: white;
            padding: 2px;
          }
          
          .item-row {
            font-size: 7px;
            border-bottom: 1px dotted #ccc;
          }
          
          .total-row {
            font-size: 10px;
            background: #000;
            color: white;
            padding: 3px;
            margin: 3px -5px;
          }
          
          .footer {
            text-align: center;
            font-size: 7px;
            border-top: 2px solid #000;
            padding-top: 3px;
          }
          
          @media print {
            @page {
              size: 58mm auto;
              margin: 0;
            }
            .receipt {
              border: none;
              background: white;
            }
          }
        `;
        
      default: // A4
        return baseStyles + `
          .receipt {
            width: 210mm;
            min-height: 297mm;
            padding: 30px;
            border: 1px solid #ccc;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          
          .header {
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
          }
          
          .header h1 {
            font-size: 24px;
            font-weight: bold;
          }
          
          .header p {
            font-size: 14px;
          }
          
          .logo {
            max-width: 100px;
          }
          
          .items-header {
            font-size: 12px;
            background: #f0f0f0;
            padding: 8px;
            border: 1px solid #ccc;
          }
          
          .item-row {
            font-size: 11px;
            padding: 4px;
            border-bottom: 1px solid #eee;
          }
          
          .total-row {
            font-size: 16px;
            background: #f0f0f0;
            padding: 10px;
            border: 2px solid #000;
            margin: 10px 0;
          }
          
          .footer {
            text-align: center;
            font-size: 12px;
            border-top: 2px solid #000;
            padding-top: 15px;
            margin-top: 30px;
          }
          
          @media print {
            @page {
              size: A4;
              margin: 15mm;
            }
            .receipt {
              box-shadow: none;
              border: none;
            }
          }
        `;
    }
  }

  // Formatar método de pagamento
  formatPaymentMethod(method) {
    const methods = {
      'dinheiro': 'Dinheiro',
      'cartao_credito': 'Cartão de Crédito',
      'cartao_debito': 'Cartão de Débito',
      'pix': 'PIX'
    };
    
    return methods[method] || method || 'Não informado';
  }

  // Formatar múltiplos métodos de pagamento
  formatMultiplePayments(pagamentos) {
    if (!pagamentos || !Array.isArray(pagamentos) || pagamentos.length === 0) {
      return 'Não informado';
    }

    if (pagamentos.length === 1) {
      return this.formatPaymentMethod(pagamentos[0].metodo);
    }

    // Múltiplos pagamentos
    const paymentStrings = pagamentos.map(pag => {
      const method = this.formatPaymentMethod(pag.metodo);
      const value = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(pag.valor);
      return `${method}: ${value}`;
    });

    return paymentStrings.join(' + ');
  }

  // Formatar data da venda com tratamento robusto
  formatSaleDate(receiptData) {
    try {
      // Tentar diferentes fontes de data
      let dateSource = receiptData.sale?.dataVenda || 
                      receiptData.dataVenda || 
                      receiptData.sale?.timestamp || 
                      receiptData.timestamp;

      if (!dateSource) {
        return new Date().toLocaleDateString('pt-BR');
      }

      let dateObj;

      // Tratar diferentes formatos de timestamp
      if (typeof dateSource === 'string') {
        // String ISO ou data já formatada
        if (dateSource.includes('/')) {
          // Já está formatada (dd/mm/yyyy)
          return dateSource;
        }
        dateObj = new Date(dateSource);
      } else if (dateSource?.seconds) {
        // Firestore timestamp
        dateObj = new Date(dateSource.seconds * 1000);
      } else if (dateSource instanceof Date) {
        dateObj = dateSource;
      } else if (typeof dateSource === 'number') {
        dateObj = new Date(dateSource);
      } else {
        dateObj = new Date();
      }

      // Verificar se a data é válida
      if (isNaN(dateObj.getTime())) {
        return new Date().toLocaleDateString('pt-BR');
      }

      return dateObj.toLocaleDateString('pt-BR');
    } catch (error) {
      console.error('Erro ao formatar data da venda:', error, receiptData);
      return new Date().toLocaleDateString('pt-BR');
    }
  }

  // Imprimir recibo
  async printReceipt(receiptData, userId = null) {
    try {
      // Carregar configurações para determinar tipo de impressão
      let config = this.defaultConfig;
      if (userId) {
        config = await configService.getConfig(userId);
      }
      
      // Preparar dados da venda para impressão
      const saleData = {
        numero: receiptData.sale?.id || receiptData.sale?.numero || receiptData.id || '000001',
        id: receiptData.sale?.id || receiptData.id || '000001',
        dataVenda: this.formatSaleDate(receiptData),
        total: receiptData.sale?.total || receiptData.total || 0,
        items: receiptData.items || receiptData.sale?.items || [],
        paymentMethod: this.formatMultiplePayments(receiptData.payment?.pagamentos) || receiptData.paymentMethod || 'Não informado',
        paymentData: receiptData.payment // Manter dados completos de pagamento
      };
      
      // Verificar se deve usar impressão térmica
      const useThermalPrinter = config.formatoRecibo === '80mm' || config.formatoRecibo === '58mm';
      
      if (useThermalPrinter) {
        // Usar impressora térmica Jetway JP-800
        const thermalConfig = {
          paperSize: config.tamanhoTermico || '80x210',
          density: 'dark', // Forçar densidade alta para JP-800
          speed: 'slow', // Forçar velocidade baixa para melhor qualidade
          cutType: config.tipoCorte || 'partial',
          lineSpacing: 'tight', // Forçar espaçamento compacto
          logoRecibo: config.logoRecibo,
          nomeEmpresa: config.nomeEmpresa,
          cnpj: config.cnpj,
          endereco: config.endereco,
          telefone: config.telefone,
          impressoraTermica: 'Jetway JP-800' // Especificar modelo da impressora
        };
        
        return await thermalPrinterService.printThermal(saleData, thermalConfig);
      } else {
        // Usar impressão tradicional A4
        // Gerar HTML do recibo
        const receiptHTML = await this.generateReceiptHTML(saleData, userId);
        
        // Criar nova janela para impressão
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        
        if (!printWindow) {
          throw new Error('Popup bloqueado. Permita popups para imprimir.');
        }
        
        // Escrever HTML na janela
        printWindow.document.write(receiptHTML);
        printWindow.document.close();
        
        // Aguardar carregamento e imprimir
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
            
            // Fechar janela após impressão (opcional)
            printWindow.onafterprint = () => {
              printWindow.close();
            };
          }, 500);
        };
        
        return { success: true, message: 'Recibo enviado para impressão!' };
      }
      
    } catch (error) {
      console.error('Erro ao imprimir recibo:', error);
      return { success: false, message: error.message };
    }
  }

  // Gerar PDF do recibo (usando jsPDF se disponível)
  async generateReceiptPDF(saleData, userId = null) {
    try {
      const doc = new jsPDF();
      
      // Configurar fonte
      doc.setFont('courier');
      
      // Cabeçalho
      doc.setFontSize(16);
      doc.text('ACADEMIA PLAY FIT II', 105, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text('CNPJ: 57673794000171', 105, 30, { align: 'center' });
      doc.text('Logradouro: Avenida C, S/N Complemento: Quadrab3 Lote 17E', 105, 35, { align: 'center' });
      doc.text('Bairro: Jardim Boa Esperança - Continuação CEP: 74960-302', 105, 40, { align: 'center' });
      doc.text('Município: Aparecida de Goiânia Estado: Goiás', 105, 45, { align: 'center' });
      doc.text('Tel: (62) 99192-0954', 105, 50, { align: 'center' });
      
      // Linha divisória
      doc.line(20, 60, 190, 60);
      
      // Informações da venda
      doc.setFontSize(12);
      doc.text('COMPROVANTE DE COMPRA', 105, 70, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text(`Nº ${saleData.numero || saleData.id || '000001'}`, 20, 80);
      doc.text(`Data: ${saleData.dataVenda || new Date().toLocaleDateString('pt-BR')}`, 20, 85);
      
      // Linha divisória
      doc.line(20, 95, 190, 95);
      
      // Itens
      let yPos = 105;
      doc.text('ITEM', 20, yPos);
      doc.text('QTD', 120, yPos);
      doc.text('VALOR', 140, yPos);
      doc.text('TOTAL', 170, yPos);
      
      yPos += 5;
      doc.line(20, yPos, 190, yPos);
      
      yPos += 10;
      saleData.items?.forEach(item => {
        doc.text(item.nome || item.descricao, 20, yPos);
        doc.text(item.quantidade.toString(), 120, yPos);
        doc.text(`R$ ${item.preco?.toFixed(2)}`, 140, yPos);
        doc.text(`R$ ${(item.quantidade * item.preco)?.toFixed(2)}`, 170, yPos);
        yPos += 8;
      });
      
      // Total
      yPos += 10;
      doc.line(20, yPos, 190, yPos);
      yPos += 10;
      
      doc.setFontSize(12);
      doc.text(`TOTAL: R$ ${saleData.total?.toFixed(2)}`, 170, yPos, { align: 'right' });
      
      // Pagamento
      if (saleData.paymentMethod) {
        yPos += 10;
        doc.setFontSize(10);
        doc.text(`Pagamento: ${saleData.paymentMethod}`, 20, yPos);
      }
      
      // Footer
      yPos += 20;
      doc.text('Obrigado pela preferência!', 105, yPos, { align: 'center' });
      yPos += 10;
      doc.text(new Date().toLocaleString('pt-BR'), 105, yPos, { align: 'center' });
      yPos += 5;
      doc.text('- - - CORTE AQUI - - -', 105, yPos, { align: 'center' });
      
      // Salvar PDF
      doc.save(`recibo-${saleData.numero || saleData.id || 'venda'}.pdf`);
      
      return { success: true, message: 'PDF gerado com sucesso!' };
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      return { success: false, message: error.message };
    }
  }

  // Baixar recibo como PDF
  async downloadReceipt(receiptData, userId = null) {
    try {
      // Preparar dados da venda para o PDF
      const saleData = {
        numero: receiptData.sale?.id || receiptData.sale?.numero || '000001',
        id: receiptData.sale?.id || '000001',
        dataVenda: receiptData.sale?.timestamp ? 
          new Date(receiptData.sale.timestamp).toLocaleDateString('pt-BR') : 
          new Date().toLocaleDateString('pt-BR'),
        total: receiptData.sale?.total || 0,
        items: receiptData.items || [],
        paymentMethod: receiptData.payment?.pagamentos?.[0]?.metodo || 'Não informado'
      };
      
      // Gerar PDF
      return await this.generateReceiptPDF(saleData, userId);
      
    } catch (error) {
      console.error('Erro ao baixar recibo:', error);
      return { success: false, message: `Erro ao baixar recibo: ${error.message}` };
    }
  }

  // Imprimir Nota Fiscal (NFCe/NFe)
  async printNF(nfData, userId = null) {
    try {
      // Carregar configurações do usuário
      let config = this.defaultConfig;
      if (userId) {
        config = await configService.getConfig(userId);
      }
      
      // Tentar buscar XML do Firebase Storage se não estiver presente
      let xmlContent = nfData.xml;
      
      if (!xmlContent && nfData.backupUrls?.xmlNota) {
        try {
          const response = await fetch(nfData.backupUrls.xmlNota);
          xmlContent = await response.text();
          } catch (error) {
          }
      }
      
      if (!xmlContent && nfData.backupUrls?.xmlProcessado) {
        try {
          const response = await fetch(nfData.backupUrls.xmlProcessado);
          xmlContent = await response.text();
          } catch (error) {
          }
      }
      
      // SEMPRE usar impressão térmica para NFCe (forçar)
      if (xmlContent) {
        // Forçar configurações térmicas para NFCe
        const thermalConfig = {
          ...config,
          formatoRecibo: '80mm', // Forçar formato térmico
          paperSize: '80x210',
          density: 'dark',
          speed: 'slow',
          cutType: 'partial',
          lineSpacing: 'tight',
          impressoraTermica: 'Jetway JP-800'
        };
        
        // Passar dados completos incluindo XML
        const nfDataWithXml = {
          ...nfData,
          xml: xmlContent
        };
        
        return await this.printNFCeThermal(nfDataWithXml, thermalConfig);
      } else {
        // Fallback para impressão tradicional (sem XML)
        const nfHTML = await this.generateNFHTML(nfData, config);
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(nfHTML);
        printWindow.document.close();
        
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        };
        
        return { success: true, message: 'NF enviada para impressão!' };
      }
    } catch (error) {
      console.error('Erro ao imprimir NF:', error);
      return { success: false, message: `Erro na impressão: ${error.message}` };
    }
  }

  // Imprimir NFCe em impressora térmica usando XML
  async printNFCeThermal(nfData, config) {
    try {
      // Parse do XML para extrair dados
      const xmlData = await this.parseNFCeXML(nfData.xml);
      
      // Configurar impressora térmica
      const thermalConfig = {
        paperSize: config.tamanhoTermico || '80x210',
        density: 'dark',
        speed: 'slow',
        cutType: config.tipoCorte || 'partial',
        lineSpacing: 'tight',
        logoRecibo: config.logoRecibo,
        nomeEmpresa: config.nomeEmpresa,
        logoEmpresaUrl: config.logoEmpresaUrl,
        impressoraTermica: 'Jetway JP-800'
      };
      
      // Usar serviço de impressora térmica
      return await thermalPrinterService.printNFCeThermal(xmlData, thermalConfig);
      
    } catch (error) {
      console.error('Erro ao imprimir NFCe térmica:', error);
      return { success: false, message: `Erro na impressão térmica: ${error.message}` };
    }
  }

  // Parse do XML da NFCe para extrair dados estruturados
  async parseNFCeXML(xmlString) {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      
      // Extrair dados principais
      const infNFe = xmlDoc.querySelector('infNFe');
      const ide = xmlDoc.querySelector('ide');
      const emit = xmlDoc.querySelector('emit');
      const dest = xmlDoc.querySelector('dest');
      const total = xmlDoc.querySelector('total ICMSTot');
      
      return {
        numero: ide?.querySelector('nNF')?.textContent || '',
        serie: ide?.querySelector('serie')?.textContent || '',
        modelo: ide?.querySelector('mod')?.textContent || '65',
        dataEmissao: ide?.querySelector('dhEmi')?.textContent || '',
        chave: infNFe?.getAttribute('Id')?.replace('NFe', '') || '',
        
        // Emitente
        emitente: {
          nome: emit?.querySelector('xNome')?.textContent || 'ACADEMIA PLAY FIT II',
          cnpj: emit?.querySelector('CNPJ')?.textContent || '57673794000171',
          endereco: emit?.querySelector('enderEmit xLgr')?.textContent || 'Avenida C, S/N',
          numero: emit?.querySelector('enderEmit nro')?.textContent || '',
          bairro: emit?.querySelector('enderEmit xBairro')?.textContent || 'Jardim Boa Esperança',
          cidade: emit?.querySelector('enderEmit xMun')?.textContent || 'Aparecida de Goiânia',
          uf: emit?.querySelector('enderEmit UF')?.textContent || 'GO',
          cep: emit?.querySelector('enderEmit CEP')?.textContent || '74960302'
        },
        
        // Destinatário (se houver)
        destinatario: dest ? {
          nome: dest.querySelector('xNome')?.textContent || '',
          cpfCnpj: dest.querySelector('CPF')?.textContent || dest.querySelector('CNPJ')?.textContent || ''
        } : null,
        
        // Totais
        totais: {
          valorProdutos: total?.querySelector('vProd')?.textContent || '0',
          valorTotal: total?.querySelector('vNF')?.textContent || '0',
          valorDesconto: total?.querySelector('vDesc')?.textContent || '0',
          valorTributos: total?.querySelector('vTotTrib')?.textContent || '0' // Tributos obrigatórios
        },
        
        // Itens
        itens: Array.from(xmlDoc.querySelectorAll('det')).map(det => ({
          codigo: det.querySelector('prod cProd')?.textContent || '',
          descricao: det.querySelector('prod xProd')?.textContent || '',
          quantidade: det.querySelector('prod qCom')?.textContent || '',
          unidade: det.querySelector('prod uCom')?.textContent || '',
          valorUnitario: det.querySelector('prod vUnCom')?.textContent || '',
          valorTotal: det.querySelector('prod vProd')?.textContent || '',
          ncm: det.querySelector('prod NCM')?.textContent || '',
          cfop: det.querySelector('prod CFOP')?.textContent || ''
        }))
      };
    } catch (error) {
      console.error('Erro ao fazer parse do XML:', error);
      throw new Error('Erro ao processar XML da NFCe');
    }
  }

  // Gerar HTML da Nota Fiscal
  async generateNFHTML(nfData, config = {}) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Nota Fiscal ${nfData.numero}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
          .info { margin: 20px 0; }
          .status { font-weight: bold; color: ${nfData.status === 'autorizado' ? 'green' : 'red'}; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>NOTA FISCAL ELETRÔNICA</h1>
          <h2>Modelo ${nfData.modelo || '65'} - Série ${nfData.serie || '1'}</h2>
        </div>
        
        <div class="info">
          <p><strong>Número:</strong> ${nfData.numero}</p>
          <p><strong>Status:</strong> <span class="status">${nfData.status}</span></p>
          <p><strong>Data/Hora:</strong> ${new Date().toLocaleString()}</p>
          ${nfData.chave ? `<p><strong>Chave de Acesso:</strong> ${nfData.chave}</p>` : ''}
        </div>
        
        <div class="info">
          <h3>Dados do Emitente</h3>
          <p>Academia Play Fit II</p>
          <p>CNPJ: 57.673.794/0001-71</p>
        </div>
        
        <div class="info">
          <p><strong>Ambiente:</strong> ${(nfData.ambiente === 'homologacao' || nfData.ambiente === 2) ? 'HOMOLOGAÇÃO - SEM VALOR FISCAL' : 'PRODUÇÃO'}</p>
        </div>
      </body>
      </html>
    `;
  }
}

// Exportar instância singleton
const printService = new PrintService();
export default printService;