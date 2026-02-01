import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * PDFGenerator Service
 * 
 * Gera PDFs profissionais de relatórios de serviço
 * Inclui: dados do veículo, serviços, fotos, assinatura
 * Upload automático para Firebase Storage
 */

/**
 * Gera PDF do relatório de serviço
 * 
 * @param {Object} checkoutData - Dados do checkout
 * @param {Object} vehicleData - Dados do veículo
 * @param {Object} clientData - Dados do cliente
 * @param {String} signatureUrl - URL da assinatura digital
 * @param {Array} photos - Array de URLs das fotos
 * @returns {Blob} PDF gerado
 */
export const generateServicePDF = async ({
  checkoutData,
  vehicleData,
  clientData,
  signatureUrl,
  photos = []
}) => {
  // Criar novo documento PDF (A4)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // ===== HEADER =====
  // Logo e informações da oficina
  doc.setFillColor(59, 130, 246); // Blue
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO DE SERVIÇO', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistema de Gestão de Oficina', pageWidth / 2, 28, { align: 'center' });
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, 34, { align: 'center' });

  yPosition = 50;

  // ===== INFORMAÇÕES DO CLIENTE =====
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Dados do Cliente', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nome: ${clientData.name || 'N/A'}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Telefone: ${clientData.phone || 'N/A'}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Email: ${clientData.email || 'N/A'}`, margin, yPosition);
  yPosition += 10;

  // ===== INFORMAÇÕES DO VEÍCULO =====
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Dados do Veículo', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Placa: ${vehicleData.plate || 'N/A'}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Marca/Modelo: ${vehicleData.brand || ''} ${vehicleData.model || ''}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Ano: ${vehicleData.year || 'N/A'}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Cor: ${vehicleData.color || 'N/A'}`, margin, yPosition);
  yPosition += 10;

  // ===== SERVIÇOS REALIZADOS =====
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Serviços Realizados', margin, yPosition);
  yPosition += 8;

  if (checkoutData.services && checkoutData.services.length > 0) {
    const servicesData = checkoutData.services.map((service, index) => [
      index + 1,
      service.name || service,
      service.duration || '-',
      service.cost ? `R$ ${service.cost.toFixed(2)}` : '-'
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [['#', 'Serviço', 'Duração', 'Valor']],
      body: servicesData,
      theme: 'striped',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      margin: { left: margin, right: margin }
    });

    yPosition = doc.lastAutoTable.finalY + 10;
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(checkoutData.services || 'Nenhum serviço especificado', margin, yPosition);
    yPosition += 10;
  }

  // ===== CHECKLIST =====
  if (checkoutData.checklist && checkoutData.checklist.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Checklist de Inspeção', margin, yPosition);
    yPosition += 8;

    const checklistData = checkoutData.checklist.map(item => [
      item.label,
      item.status === 'ok' ? '✓ OK' : item.status === 'issue' ? '⚠ Problema' : '- Não verificado',
      item.notes || '-'
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [['Item', 'Status', 'Observações']],
      body: checklistData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 30 },
        2: { cellWidth: 'auto' }
      },
      margin: { left: margin, right: margin }
    });

    yPosition = doc.lastAutoTable.finalY + 10;
  }

  // ===== OBSERVAÇÕES =====
  if (checkoutData.observations) {
    // Verificar se precisa de nova página
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Observações', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const splitObservations = doc.splitTextToSize(
      checkoutData.observations,
      pageWidth - (margin * 2)

    doc.text(splitObservations, margin, yPosition);
    yPosition += (splitObservations.length * 5) + 10;
  }

  // ===== TEMPO TOTAL =====
  if (checkoutData.duration) {
    const hours = Math.floor(checkoutData.duration / 3600000);
    const minutes = Math.floor((checkoutData.duration % 3600000) / 60000);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Tempo Total de Serviço: ${hours}h ${minutes}min`, margin, yPosition);
    yPosition += 10;
  }

  // ===== ASSINATURA =====
  if (signatureUrl) {
    // Verificar se precisa de nova página
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Assinatura do Cliente', margin, yPosition);
    yPosition += 8;

    try {
      // Adicionar imagem da assinatura
      doc.addImage(signatureUrl, 'PNG', margin, yPosition, 80, 30);
      yPosition += 35;
    } catch (error) {
      console.error('Erro ao adicionar assinatura:', error);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text('(Assinatura não disponível)', margin, yPosition);
      yPosition += 10;
    }

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('_'.repeat(40), margin, yPosition);
    yPosition += 4;
    doc.text('Assinatura do Cliente', margin, yPosition);
  }

  // ===== FOOTER =====
  const footerY = pageHeight - 15;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(128, 128, 128);
  doc.text(
    'Este documento foi gerado automaticamente pelo Sistema de Gestão de Oficina',
    pageWidth / 2,
    footerY,
    { align: 'center' }

  doc.text(
    `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
    pageWidth / 2,
    footerY + 4,
    { align: 'center' }

  // Retornar PDF como Blob
  return doc.output('blob');
};

/**
 * Faz download do PDF
 */
export const downloadPDF = (pdfBlob, filename) => {
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Gera nome de arquivo único para o PDF
 */
export const generatePDFFilename = (vehiclePlate, date = new Date()) => {
  const dateStr = date.toISOString().split('T')[0];
  const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-');
  return `servico_${vehiclePlate}_${dateStr}_${timeStr}.pdf`;
};

export default {
  generateServicePDF,
  downloadPDF,
  generatePDFFilename
};
