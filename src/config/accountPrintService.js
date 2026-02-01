// Serviço de impressão específico para recibos de contas
import configService from './configService';
import thermalPrinterService from './thermalPrinterService';
import jsPDF from 'jspdf';

class AccountPrintService {
  constructor() {
    this.defaultConfig = {
      impressoraPadrao: 'default',
      formatoRecibo: 'A4',
      logoRecibo: true
    };
  }

  // Gerar HTML do recibo de conta
  async generateAccountReceiptHTML(accountData, userId) {
    try {
      // Carregar configurações do usuário
      let config = this.defaultConfig;
      if (userId) {
        configService.clearCache(userId);
        config = await configService.getConfig(userId);
      }
      
      const { formatoRecibo, logoRecibo } = config;
      
      // Definir estilos baseados no formato
      const styles = this.getReceiptStyles(formatoRecibo);
      
      // Verificar se deve incluir logo
      const shouldIncludeLogo = logoRecibo !== false;
      
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
          <title>Recibo de Conta - ${accountData.account.nome}</title>
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
              <p><strong>RECIBO DE CONTA</strong></p>
              <p>Data: ${this.formatDate(new Date())}</p>
              <p>Tipo: ${accountData.account.tipo === 'receber' ? 'A Receber' : 'A Pagar'}</p>
            </div>
            
            <div class="divider"></div>
            
            <div class="account-details">
              <div class="detail-row">
                <span><strong>Descrição:</strong></span>
                <span>${accountData.account.nome}</span>
              </div>
              
              ${accountData.account.categoria ? `
                <div class="detail-row">
                  <span><strong>Categoria:</strong></span>
                  <span>${accountData.account.categoria}</span>
                </div>
              ` : ''}
              
              ${accountData.account.cliente || accountData.account.fornecedor || accountData.account.responsavel ? `
                <div class="detail-row">
                  <span><strong>Cliente:</strong></span>
                  <span>${accountData.account.cliente || accountData.account.fornecedor || accountData.account.responsavel}</span>
                </div>
              ` : ''}
              
              ${accountData.account.numeroParcela && accountData.account.totalParcelas ? `
                <div class="detail-row">
                  <span><strong>Parcela:</strong></span>
                  <span>${accountData.account.numeroParcela}/${accountData.account.totalParcelas}</span>
                </div>
              ` : accountData.account.parcela ? `
                <div class="detail-row">
                  <span><strong>Parcela:</strong></span>
                  <span>${accountData.account.parcela}</span>
                </div>
              ` : ''}
              
              <div class="detail-row">
                <span><strong>Valor:</strong></span>
                <span>R$ ${accountData.account.valor?.toFixed(2)}</span>
              </div>
              
              <div class="detail-row">
                <span><strong>Vencimento:</strong></span>
                <span>${this.formatDate(accountData.account.dataVencimento)}</span>
              </div>
              
              <div class="detail-row">
                <span><strong>Status:</strong></span>
                <span class="${accountData.account.status === 'pago' ? 'status-paid' : 'status-pending'}">
                  ${accountData.account.status === 'pago' ? 'PAGO' : 'PENDENTE'}
                </span>
              </div>
              
              ${accountData.account.status === 'pago' && accountData.account.dataPagamento ? `
                <div class="detail-row">
                  <span><strong>Data Pagamento:</strong></span>
                  <span>${this.formatDate(accountData.account.dataPagamento)}</span>
                </div>
              ` : ''}
              
              ${accountData.options.includePayment && accountData.account.formaPagamento ? `
                <div class="detail-row">
                  <span><strong>Forma de Pagamento:</strong></span>
                  <span>${this.formatPaymentMethod(accountData.account.formaPagamento)}</span>
                </div>
              ` : ''}
              
              ${accountData.account.observacoes ? `
                <div class="detail-row">
                  <span><strong>Observações:</strong></span>
                  <span>${accountData.account.observacoes}</span>
                </div>
              ` : ''}
            </div>
            
            <div class="divider"></div>
            
            <div class="totals">
              <div class="total-row">
                <span><strong>VALOR TOTAL:</strong></span>
                <span><strong>R$ ${accountData.account.valor?.toFixed(2)}</strong></span>
              </div>
            </div>
            
            <div class="footer">
              <p>Recibo gerado em ${this.formatDate(new Date())} às ${new Date().toLocaleTimeString('pt-BR')}</p>
              <p>Este documento não possui valor fiscal</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      return html;
    } catch (error) {
      console.error('Erro ao gerar HTML do recibo de conta:', error);
      throw error;
    }
  }

  // Estilos CSS para o recibo
  getReceiptStyles(formato) {
    const baseStyles = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Courier New', monospace;
        font-size: 12px;
        line-height: 1.4;
        color: #000;
        background: white;
      }
      
      .receipt {
        max-width: 300px;
        margin: 0 auto;
        padding: 10px;
        background: white;
      }
      
      .logo-section {
        text-align: center;
        margin-bottom: 10px;
      }
      
      .logo {
        max-width: 80px;
        height: auto;
      }
      
      .header {
        text-align: center;
        margin-bottom: 10px;
      }
      
      .header h1 {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .header p {
        font-size: 10px;
        margin: 1px 0;
      }
      
      .divider {
        border-top: 1px dashed #000;
        margin: 8px 0;
      }
      
      .sale-info {
        text-align: center;
        margin-bottom: 10px;
      }
      
      .sale-info p {
        margin: 2px 0;
        font-size: 11px;
      }
      
      .account-details {
        margin-bottom: 10px;
      }
      
      .detail-row {
        display: flex;
        justify-content: space-between;
        margin: 3px 0;
        font-size: 11px;
      }
      
      .status-paid {
        color: #008000;
        font-weight: bold;
      }
      
      .status-pending {
        color: #ff6600;
        font-weight: bold;
      }
      
      .totals {
        margin-top: 10px;
        border-top: 1px solid #000;
        padding-top: 5px;
      }
      
      .total-row {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        font-weight: bold;
      }
      
      .footer {
        text-align: center;
        margin-top: 15px;
        font-size: 9px;
        color: #666;
      }
      
      .footer p {
        margin: 2px 0;
      }
      
      @media print {
        body { margin: 0; }
        .receipt { 
          max-width: none;
          margin: 0;
          padding: 5px;
        }
      }
    `;

    if (formato === 'A4') {
      return baseStyles + `
        .receipt {
          max-width: 400px;
          padding: 20px;
        }
        
        body {
          font-size: 14px;
        }
        
        .header h1 {
          font-size: 18px;
        }
        
        .detail-row {
          font-size: 13px;
        }
        
        .total-row {
          font-size: 14px;
        }
      `;
    }

    return baseStyles;
  }

  // Formatar data
  formatDate(date) {
    if (!date) return '';
    
    try {
      let dateObj;
      
      // Se for string, tentar converter
      if (typeof date === 'string') {
        dateObj = new Date(date);
      }
      // Se for timestamp do Firebase (objeto com seconds)
      else if (date && typeof date === 'object' && date.seconds) {
        dateObj = new Date(date.seconds * 1000);
      }
      // Se for timestamp do Firebase (objeto com toDate)
      else if (date && typeof date === 'object' && date.toDate) {
        dateObj = date.toDate();
      }
      // Se já for um objeto Date
      else if (date instanceof Date) {
        dateObj = date;
      }
      // Se for número (timestamp)
      else if (typeof date === 'number') {
        dateObj = new Date(date);
      }
      else {
        return String(date);
      }
      
      // Verificar se a data é válida
      if (isNaN(dateObj.getTime())) {
        return String(date);
      }
      
      return dateObj.toLocaleDateString('pt-BR');
    } catch (error) {
      console.error('Erro ao formatar data:', error, date);
      return String(date);
    }
  }

  // Formatar método de pagamento
  formatPaymentMethod(method) {
    const methods = {
      'dinheiro': 'Dinheiro',
      'cartao_credito': 'Cartão de Crédito',
      'cartao_debito': 'Cartão de Débito',
      'pix': 'PIX',
      'transferencia': 'Transferência',
      'boleto': 'Boleto'
    };
    return methods[method] || method || 'Não informado';
  }

  // Imprimir recibo de conta
  async printAccountReceipt(receiptData, userId = null) {
    try {
      // Carregar configurações para determinar tipo de impressão
      let config = this.defaultConfig;
      if (userId) {
        config = await configService.getConfig(userId);
      }
      
      // Verificar se deve usar impressão térmica
      const useThermalPrinter = config.formatoRecibo === '80mm' || config.formatoRecibo === '58mm';
      
      if (useThermalPrinter) {
        // Usar impressão térmica com comandos POS
        const thermalConfig = {
          paperSize: config.tamanhoTermico || '80x210',
          density: 'dark',
          speed: 'slow',
          cutType: config.tipoCorte || 'partial',
          lineSpacing: 'tight',
          logoRecibo: config.logoRecibo,
          nomeEmpresa: config.nomeEmpresa,
          cnpj: config.cnpj,
          endereco: config.endereco,
          telefone: config.telefone,
          impressoraTermica: 'Jetway JP-800'
        };
        
        return await this.printAccountThermal(receiptData, thermalConfig);
      } else {
        // Usar impressão HTML/PDF
        const html = await this.generateAccountReceiptHTML(receiptData, userId);
        
        // Criar uma nova janela para impressão
        const printWindow = window.open('', '_blank');
        printWindow.document.write(html);
        printWindow.document.close();
        
        // Aguardar carregamento e imprimir
        printWindow.onload = () => {
          printWindow.print();
          setTimeout(() => {
            printWindow.close();
          }, 1000);
        };
        
        return { success: true, message: 'Recibo enviado para impressão' };
      }
    } catch (error) {
      console.error('Erro ao imprimir recibo de conta:', error);
      return { success: false, message: `Erro ao imprimir: ${error.message}` };
    }
  }

  // Impressão térmica específica para contas com comandos POS
  async printAccountThermal(receiptData, config = {}) {
    try {
      // Tentar usar QZ Tray primeiro
      try {
        await this.initializeQZTray();
        
        // Preparar dados para impressão
        const printData = [];
        
        // Se logo está habilitado, adicionar imagem primeiro
        if (config.logoRecibo !== false) {
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
            }
        }
        
        // Gerar comandos ESC/POS para conta
        const escposCommands = this.generateAccountESCPOS(receiptData, config);
        
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
          message: 'Recibo de conta enviado para impressora térmica via QZ Tray'
        };
        
      } catch (qzError) {
        // Fallback: usar window.print com CSS otimizado para térmica
        const html = await this.generateAccountReceiptHTML(receiptData);
        const printWindow = window.open('', '_blank');
        printWindow.document.write(html);
        printWindow.document.close();
        
        printWindow.onload = () => {
          printWindow.print();
          setTimeout(() => printWindow.close(), 1000);
        };
        
        return {
          success: true,
          message: 'Recibo enviado para impressão (método alternativo)'
        };
      }
      
    } catch (error) {
      console.error('❌ Erro na impressão térmica de conta:', error);
      return { success: false, message: `Erro na impressão térmica: ${error.message}` };
    }
  }

  // Gerar comandos ESC/POS específicos para recibo de conta
  generateAccountESCPOS(receiptData, config = {}) {
    const commands = [];
    const account = receiptData.account;
    
    // Inicializar impressora
    commands.push('\x1B\x40'); // Reset
    commands.push('\x1B\x7B\x04'); // Densidade máxima
    commands.push('\x1B\x73\x00'); // Velocidade baixa
    commands.push('\x1B\x33\x18'); // Espaçamento compacto
    
    // Cabeçalho da empresa
    commands.push('\x1B\x61\x01'); // Centralizar
    commands.push('\x1B\x21\x08'); // Fonte dupla
    commands.push((config.nomeEmpresa || 'ACADEMIA PLAY FIT II') + '\n');
    commands.push('\x1B\x21\x00'); // Fonte normal
    
    // Informações da empresa
    commands.push((config.cnpj ? `CNPJ: ${config.cnpj}` : 'CNPJ: 57673794000171') + '\n');
    commands.push((config.endereco || 'Logradouro: Avenida C, S/N') + '\n');
    commands.push('Complemento: Quadrab3 Lote 17E\n');
    commands.push('Bairro: Jardim Boa Esperanca\n');
    commands.push('Continuacao CEP: 74960-302\n');
    commands.push('Municipio: Aparecida de Goiania\n');
    commands.push('Estado: Goias\n');
    commands.push((config.telefone ? `Tel: ${config.telefone}` : 'Tel: (62) 99192-0954') + '\n');
    commands.push('\x1B\x61\x00'); // Alinhar à esquerda
    
    commands.push('================================\n');
    
    // Título do documento
    commands.push('\x1B\x61\x01'); // Centralizar
    commands.push('\x1B\x21\x08'); // Fonte dupla
    commands.push('RECIBO DE CONTA\n');
    commands.push('\x1B\x21\x00'); // Fonte normal
    commands.push('\x1B\x61\x00'); // Alinhar à esquerda
    
    commands.push('================================\n');
    
    // Informações da conta
    commands.push(`Data: ${this.formatDate(new Date())}\n`);
    commands.push(`Tipo: ${account.tipo === 'receber' ? 'A Receber' : 'A Pagar'}\n`);
    
    // Nome/Cliente (se disponível)
    if (account.cliente || account.fornecedor || account.responsavel) {
      const nomeCliente = account.cliente || account.fornecedor || account.responsavel;
      commands.push(`Cliente: ${nomeCliente}\n`);
    }
    
    commands.push('================================\n');
    
    // Detalhes da conta
    commands.push('DETALHES DA CONTA:\n');
    commands.push(`Descricao: ${account.nome}\n`);
    
    if (account.categoria) {
      commands.push(`Categoria: ${account.categoria}\n`);
    }
    
    // Informações de parcela (se aplicável)
    if (account.numeroParcela && account.totalParcelas) {
      commands.push(`Parcela: ${account.numeroParcela}/${account.totalParcelas}\n`);
    } else if (account.parcela) {
      commands.push(`Parcela: ${account.parcela}\n`);
    }
    
    commands.push(`Vencimento: ${this.formatDate(account.dataVencimento)}\n`);
    
    // Status
    const status = account.status === 'pago' ? 'PAGO' : 'PENDENTE';
    commands.push(`Status: ${status}\n`);
    
    // Data de pagamento (se pago)
    if (account.status === 'pago' && account.dataPagamento) {
      commands.push(`Pago em: ${this.formatDate(account.dataPagamento)}\n`);
    }
    
    // Forma de pagamento (se incluída nas opções)
    if (receiptData.options.includePayment && account.formaPagamento) {
      commands.push(`Pagamento: ${this.formatPaymentMethod(account.formaPagamento)}\n`);
    }
    
    // Observações (se houver)
    if (account.observacoes) {
      commands.push('--------------------------------\n');
      commands.push('Observacoes:\n');
      commands.push(`${account.observacoes}\n`);
    }
    
    commands.push('================================\n');
    
    // Valor total
    commands.push('\x1B\x21\x08'); // Fonte dupla
    commands.push(`VALOR: R$ ${account.valor?.toFixed(2) || '0,00'}\n`);
    commands.push('\x1B\x21\x00'); // Fonte normal
    
    commands.push('================================\n');
    commands.push('\x1B\x61\x01'); // Centralizar
    commands.push('Recibo gerado em:\n');
    commands.push(`${this.formatDate(new Date())} ${new Date().toLocaleTimeString('pt-BR')}\n`);
    commands.push('Este documento nao possui\n');
    commands.push('valor fiscal\n');
    commands.push('- - - CORTE AQUI - - -\n');
    commands.push('\x1B\x61\x00'); // Alinhar à esquerda
    
    commands.push('\n\n');
    
    // Comando de corte
    commands.push('\x1D\x56\x42\x00'); // Corte parcial
    
    return commands.join('');
  }

  // Inicializar QZ Tray (copiado do thermalPrinterService)
  async initializeQZTray() {
    try {
      if (!window.qz) {
        throw new Error('QZ Tray não está instalado. Baixe em: https://qz.io/download/');
      }

      if (!window.qz.websocket.isActive()) {
        // Configurar certificado
        window.qz.security.setCertificatePromise(function(resolve, reject) {
          resolve();
        });
        
        await window.qz.websocket.connect();
        }

      return { success: true, message: 'QZ Tray conectado com sucesso' };
    } catch (error) {
      console.error('❌ Erro ao conectar QZ Tray:', error);
      throw new Error(`QZ Tray: ${error.message}`);
    }
  }

  // Gerar PDF do recibo de conta
  async generateAccountReceiptPDF(accountData, userId = null) {
    try {
      // Carregar configurações
      let config = this.defaultConfig;
      if (userId) {
        config = await configService.getConfig(userId);
      }
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Configurações do PDF
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let yPosition = margin;
      
      // Função para adicionar texto
      const addText = (text, x, y, options = {}) => {
        pdf.setFontSize(options.fontSize || 10);
        pdf.setFont('helvetica', options.fontStyle || 'normal');
        pdf.text(text, x, y);
        return y + (options.lineHeight || 6);
      };
      
      // Cabeçalho
      yPosition = addText(config.nomeEmpresa || 'ACADEMIA PLAY FIT II', margin, yPosition, {
        fontSize: 16,
        fontStyle: 'bold',
        lineHeight: 8
      });
      
      yPosition = addText(config.cnpj ? `CNPJ: ${config.cnpj}` : 'CNPJ: 57673794000171', margin, yPosition);
      yPosition = addText(config.endereco || 'Avenida C, S/N - Jardim Boa Esperança', margin, yPosition);
      yPosition = addText('Aparecida de Goiânia - GO - CEP: 74960-302', margin, yPosition);
      yPosition = addText(config.telefone ? `Tel: ${config.telefone}` : 'Tel: (62) 99192-0954', margin, yPosition);
      
      // Linha divisória
      yPosition += 5;
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
      
      // Título
      yPosition = addText('RECIBO DE CONTA', margin, yPosition, {
        fontSize: 14,
        fontStyle: 'bold',
        lineHeight: 10
      });
      
      yPosition = addText(`Data: ${this.formatDate(new Date())}`, margin, yPosition, { lineHeight: 8 });
      yPosition += 5;
      
      // Detalhes da conta
      yPosition = addText('DETALHES DA CONTA:', margin, yPosition, {
        fontSize: 12,
        fontStyle: 'bold',
        lineHeight: 8
      });
      
      yPosition = addText(`Tipo: ${accountData.account.tipo === 'receber' ? 'A Receber' : 'A Pagar'}`, margin, yPosition);
      yPosition = addText(`Descrição: ${accountData.account.nome}`, margin, yPosition);
      
      if (accountData.account.categoria) {
        yPosition = addText(`Categoria: ${accountData.account.categoria}`, margin, yPosition);
      }
      
      if (accountData.account.cliente || accountData.account.fornecedor || accountData.account.responsavel) {
        const nomeCliente = accountData.account.cliente || accountData.account.fornecedor || accountData.account.responsavel;
        yPosition = addText(`Cliente: ${nomeCliente}`, margin, yPosition);
      }
      
      if (accountData.account.numeroParcela && accountData.account.totalParcelas) {
        yPosition = addText(`Parcela: ${accountData.account.numeroParcela}/${accountData.account.totalParcelas}`, margin, yPosition);
      } else if (accountData.account.parcela) {
        yPosition = addText(`Parcela: ${accountData.account.parcela}`, margin, yPosition);
      }
      
      yPosition = addText(`Valor: R$ ${accountData.account.valor?.toFixed(2)}`, margin, yPosition);
      yPosition = addText(`Vencimento: ${this.formatDate(accountData.account.dataVencimento)}`, margin, yPosition);
      yPosition = addText(`Status: ${accountData.account.status === 'pago' ? 'PAGO' : 'PENDENTE'}`, margin, yPosition);
      
      if (accountData.account.status === 'pago' && accountData.account.dataPagamento) {
        yPosition = addText(`Data Pagamento: ${this.formatDate(accountData.account.dataPagamento)}`, margin, yPosition);
      }
      
      if (accountData.options.includePayment && accountData.account.formaPagamento) {
        yPosition = addText(`Forma de Pagamento: ${this.formatPaymentMethod(accountData.account.formaPagamento)}`, margin, yPosition);
      }
      
      if (accountData.account.observacoes) {
        yPosition += 3;
        yPosition = addText('Observações:', margin, yPosition, { fontStyle: 'bold' });
        yPosition = addText(accountData.account.observacoes, margin, yPosition);
      }
      
      // Linha divisória
      yPosition += 10;
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
      
      // Total
      yPosition = addText(`VALOR TOTAL: R$ ${accountData.account.valor?.toFixed(2)}`, margin, yPosition, {
        fontSize: 14,
        fontStyle: 'bold',
        lineHeight: 10
      });
      
      // Rodapé
      yPosition += 20;
      yPosition = addText(`Recibo gerado em ${this.formatDate(new Date())} às ${new Date().toLocaleTimeString('pt-BR')}`, margin, yPosition, {
        fontSize: 8
      });
      yPosition = addText('Este documento não possui valor fiscal', margin, yPosition, {
        fontSize: 8
      });
      
      // Salvar PDF
      const fileName = `recibo-conta-${accountData.account.nome.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.pdf`;
      pdf.save(fileName);
      
      return { success: true, message: 'PDF gerado com sucesso', fileName };
      
    } catch (error) {
      console.error('Erro ao gerar PDF do recibo de conta:', error);
      return { success: false, message: `Erro ao gerar PDF: ${error.message}` };
    }
  }

  // Baixar recibo de conta como PDF
  async downloadAccountReceipt(receiptData, userId = null) {
    try {
      // Gerar PDF
      return await this.generateAccountReceiptPDF(receiptData, userId);
      
    } catch (error) {
      console.error('Erro ao baixar recibo de conta:', error);
      return { success: false, message: `Erro ao baixar recibo: ${error.message}` };
    }
  }
}

// Exportar instância singleton
const accountPrintService = new AccountPrintService();
export default accountPrintService;