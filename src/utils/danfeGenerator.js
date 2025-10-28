// Utilitário para geração de DANFE (Documento Auxiliar da Nota Fiscal Eletrônica)
import jsPDF from 'jspdf';
import xmlParser from './xmlParser.js';

class DANFEGenerator {
  constructor() {
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margin = 10;
    this.lineHeight = 5;
  }

  /**
   * Gera DANFE a partir do XML da NFe
   * @param {string} xmlString - XML da NFe
   * @param {object} options - Opções de geração
   * @returns {Promise<Blob>} PDF gerado
   */
  async generateDANFE(xmlString, options = {}) {
    try {
      // Validar e extrair dados do XML
      const validation = xmlParser.validateNFeXML(xmlString);
      if (!validation.valid) {
        throw new Error(`XML inválido: ${validation.error}`);
      }

      const nfeData = validation.data;
      
      // Criar novo documento PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Gerar o DANFE
      await this.buildDANFE(pdf, nfeData, options);

      // Retornar como blob
      return pdf.output('blob');
    } catch (error) {
      console.error('Erro ao gerar DANFE:', error);
      throw new Error(`Erro ao gerar DANFE: ${error.message}`);
    }
  }

  /**
   * Constrói o layout do DANFE
   * @param {jsPDF} pdf - Instância do jsPDF
   * @param {object} nfeData - Dados da NFe
   * @param {object} options - Opções
   */
  async buildDANFE(pdf, nfeData, options) {
    let currentY = this.margin;

    // Cabeçalho
    currentY = this.drawHeader(pdf, nfeData, currentY);
    
    // Dados do emitente e destinatário
    currentY = this.drawParties(pdf, nfeData, currentY);
    
    // Dados da NFe
    currentY = this.drawNFeInfo(pdf, nfeData, currentY);
    
    // Itens
    currentY = this.drawItems(pdf, nfeData, currentY);
    
    // Totais
    currentY = this.drawTotals(pdf, nfeData, currentY);
    
    // Informações fiscais
    currentY = this.drawFiscalInfo(pdf, nfeData, currentY);
    
    // Rodapé
    this.drawFooter(pdf, nfeData);
  }

  /**
   * Desenha o cabeçalho do DANFE
   */
  drawHeader(pdf, nfeData, startY) {
    const headerHeight = 30;
    
    // Título principal
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DANFE', this.pageWidth / 2, startY + 10, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text('Documento Auxiliar da Nota Fiscal Eletrônica', this.pageWidth / 2, startY + 16, { align: 'center' });
    
    // Informações da chave
    if (nfeData.chave) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Chave de Acesso: ${this.formatChaveAcesso(nfeData.chave)}`, this.pageWidth / 2, startY + 22, { align: 'center' });
    }
    
    // Linha separadora
    pdf.line(this.margin, startY + headerHeight, this.pageWidth - this.margin, startY + headerHeight);
    
    return startY + headerHeight + 5;
  }

  /**
   * Desenha dados do emitente e destinatário
   */
  drawParties(pdf, nfeData, startY) {
    const sectionHeight = 40;
    const middleX = this.pageWidth / 2;
    
    // Emitente
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EMITENTE', this.margin + 2, startY + 5);
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    let y = startY + 10;
    
    if (nfeData.emitente) {
      pdf.text(`${nfeData.emitente.razaoSocial}`, this.margin + 2, y);
      y += 4;
      
      if (nfeData.emitente.nomeFantasia) {
        pdf.text(`${nfeData.emitente.nomeFantasia}`, this.margin + 2, y);
        y += 4;
      }
      
      pdf.text(`CNPJ: ${this.formatCNPJ(nfeData.emitente.cnpj)}`, this.margin + 2, y);
      y += 4;
      
      const endereco = nfeData.emitente.endereco;
      if (endereco) {
        pdf.text(`${endereco.logradouro}, ${endereco.numero}`, this.margin + 2, y);
        y += 4;
        pdf.text(`${endereco.bairro} - ${endereco.municipio}/${endereco.uf}`, this.margin + 2, y);
        y += 4;
        pdf.text(`CEP: ${this.formatCEP(endereco.cep)}`, this.margin + 2, y);
      }
    }
    
    // Linha vertical separadora
    pdf.line(middleX, startY, middleX, startY + sectionHeight);
    
    // Destinatário
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DESTINATÁRIO', middleX + 2, startY + 5);
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    y = startY + 10;
    
    if (nfeData.destinatario) {
      pdf.text(`${nfeData.destinatario.nome}`, middleX + 2, y);
      y += 4;
      
      const docLabel = nfeData.destinatario.documento.length === 11 ? 'CPF' : 'CNPJ';
      const docFormatted = docLabel === 'CPF' ? 
        this.formatCPF(nfeData.destinatario.documento) : 
        this.formatCNPJ(nfeData.destinatario.documento);
      
      pdf.text(`${docLabel}: ${docFormatted}`, middleX + 2, y);
      y += 4;
      
      const endereco = nfeData.destinatario.endereco;
      if (endereco) {
        pdf.text(`${endereco.logradouro}, ${endereco.numero}`, middleX + 2, y);
        y += 4;
        pdf.text(`${endereco.bairro} - ${endereco.municipio}/${endereco.uf}`, middleX + 2, y);
        y += 4;
        pdf.text(`CEP: ${this.formatCEP(endereco.cep)}`, middleX + 2, y);
      }
    } else {
      pdf.text('CONSUMIDOR NÃO IDENTIFICADO', middleX + 2, y);
    }
    
    // Bordas
    pdf.rect(this.margin, startY, this.pageWidth - 2 * this.margin, sectionHeight);
    
    return startY + sectionHeight + 5;
  }

  /**
   * Desenha informações da NFe
   */
  drawNFeInfo(pdf, nfeData, startY) {
    const sectionHeight = 20;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DADOS DA NOTA FISCAL', this.margin + 2, startY + 5);
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    const info = [
      `Número: ${nfeData.numero}`,
      `Série: ${nfeData.serie}`,
      `Data de Emissão: ${this.formatDate(nfeData.dataEmissao)}`,
      `Natureza da Operação: ${nfeData.naturezaOperacao}`
    ];
    
    let x = this.margin + 2;
    const spacing = (this.pageWidth - 2 * this.margin) / 4;
    
    info.forEach((text, index) => {
      pdf.text(text, x, startY + 12);
      x += spacing;
    });
    
    // Protocolo de autorização
    if (nfeData.protocolo) {
      pdf.text(`Protocolo: ${nfeData.protocolo.numero} - ${this.formatDate(nfeData.protocolo.dataAutorizacao)}`, 
        this.margin + 2, startY + 17);
    }
    
    pdf.rect(this.margin, startY, this.pageWidth - 2 * this.margin, sectionHeight);
    
    return startY + sectionHeight + 5;
  }

  /**
   * Desenha tabela de itens
   */
  drawItems(pdf, nfeData, startY) {
    const tableStartY = startY;
    const rowHeight = 6;
    const headerHeight = 8;
    
    // Cabeçalho da tabela
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DISCRIMINAÇÃO DOS PRODUTOS/SERVIÇOS', this.margin + 2, startY + 5);
    
    const headers = ['Cód.', 'Descrição', 'NCM', 'CFOP', 'Un.', 'Qtd.', 'Vl. Unit.', 'Vl. Total'];
    const colWidths = [15, 60, 20, 15, 10, 15, 20, 25]; // Larguras das colunas
    
    let x = this.margin;
    let y = startY + 12;
    
    // Desenhar cabeçalhos
    pdf.setFontSize(8);
    headers.forEach((header, index) => {
      pdf.text(header, x + 1, y, { maxWidth: colWidths[index] - 2 });
      x += colWidths[index];
    });
    
    // Linha do cabeçalho
    pdf.line(this.margin, y + 2, this.pageWidth - this.margin, y + 2);
    y += 5;
    
    // Dados dos itens
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    
    nfeData.itens.forEach((item, index) => {
      x = this.margin;
      
      const rowData = [
        item.codigo,
        item.descricao,
        item.ncm,
        item.cfop,
        item.unidade,
        item.quantidade.toString(),
        this.formatCurrency(item.valorUnitario),
        this.formatCurrency(item.valorTotal)
      ];
      
      rowData.forEach((data, colIndex) => {
        pdf.text(data, x + 1, y, { maxWidth: colWidths[colIndex] - 2 });
        x += colWidths[colIndex];
      });
      
      y += rowHeight;
      
      // Verificar se precisa de nova página
      if (y > this.pageHeight - 50) {
        pdf.addPage();
        y = this.margin + 10;
      }
    });
    
    // Bordas da tabela
    const tableHeight = y - tableStartY;
    pdf.rect(this.margin, tableStartY + 8, this.pageWidth - 2 * this.margin, tableHeight - 8);
    
    // Linhas verticais das colunas
    x = this.margin;
    colWidths.forEach(width => {
      x += width;
      if (x < this.pageWidth - this.margin) {
        pdf.line(x, tableStartY + 8, x, y);
      }
    });
    
    return y + 5;
  }

  /**
   * Desenha totais da NFe
   */
  drawTotals(pdf, nfeData, startY) {
    const sectionHeight = 25;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TOTAIS', this.margin + 2, startY + 5);
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    const totals = [
      `Valor dos Produtos: ${this.formatCurrency(nfeData.totais.valorProdutos)}`,
      `Valor do Desconto: ${this.formatCurrency(nfeData.totais.valorDesconto)}`,
      `Valor Total dos Tributos: ${this.formatCurrency(nfeData.totais.valorTributos)}`,
      `Valor Total da NFe: ${this.formatCurrency(nfeData.totais.valorTotal)}`
    ];
    
    let y = startY + 12;
    totals.forEach(total => {
      pdf.text(total, this.margin + 2, y);
      y += 4;
    });
    
    pdf.rect(this.margin, startY, this.pageWidth - 2 * this.margin, sectionHeight);
    
    return startY + sectionHeight + 5;
  }

  /**
   * Desenha informações fiscais
   */
  drawFiscalInfo(pdf, nfeData, startY) {
    const sectionHeight = 15;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INFORMAÇÕES FISCAIS', this.margin + 2, startY + 5);
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    
    const fiscalInfo = [
      'Esta é uma representação gráfica de uma NFe.',
      'Consulte a autenticidade no site da SEFAZ.',
      `Chave de Acesso: ${nfeData.chave}`
    ];
    
    let y = startY + 10;
    fiscalInfo.forEach(info => {
      pdf.text(info, this.margin + 2, y);
      y += 3;
    });
    
    pdf.rect(this.margin, startY, this.pageWidth - 2 * this.margin, sectionHeight);
    
    return startY + sectionHeight + 5;
  }

  /**
   * Desenha rodapé
   */
  drawFooter(pdf, nfeData) {
    const footerY = this.pageHeight - 20;
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    
    pdf.text('DANFE gerado automaticamente pelo sistema Loja Play Fit', 
      this.pageWidth / 2, footerY, { align: 'center' });
    
    pdf.text(`Gerado em: ${this.formatDate(new Date().toISOString())}`, 
      this.pageWidth / 2, footerY + 4, { align: 'center' });
  }

  // Métodos de formatação
  formatChaveAcesso(chave) {
    return chave.replace(/(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})/, 
      '$1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11');
  }

  formatCNPJ(cnpj) {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  formatCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatCEP(cep) {
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Gera preview do DANFE como Data URL
   * @param {string} xmlString - XML da NFe
   * @returns {Promise<string>} Data URL do PDF
   */
  async generatePreview(xmlString) {
    try {
      const blob = await this.generateDANFE(xmlString);
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Erro ao gerar preview:', error);
      throw error;
    }
  }

  /**
   * Faz download do DANFE
   * @param {string} xmlString - XML da NFe
   * @param {string} filename - Nome do arquivo
   */
  async downloadDANFE(xmlString, filename = 'danfe.pdf') {
    try {
      const blob = await this.generateDANFE(xmlString);
      
      // Criar link para download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao fazer download do DANFE:', error);
      throw error;
    }
  }
}

export default new DANFEGenerator();