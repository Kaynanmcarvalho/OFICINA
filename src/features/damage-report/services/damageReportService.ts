/**
 * TORQ Damage Report - Service
 * Serviço para geração de relatório de danos em PDF
 */

import { jsPDF } from 'jspdf';
import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/config/firebase';
import type {
  DamageReport,
  ReportDamage,
  DamageSummary,
  PDFGenerationOptions,
  PDFGenerationResult,
  DamageSeverity,
} from '../types';
import {
  DAMAGE_TYPE_LABELS,
  DAMAGE_SEVERITY_LABELS,
  DAMAGE_LOCATION_LABELS,
  CONDITION_LABELS,
  DEFAULT_PDF_OPTIONS,
} from '../types';

class DamageReportService {
  private readonly COLLECTION = 'damageReports';

  /**
   * Gera relatório de danos em PDF
   */
  async generatePDF(
    report: DamageReport,
    options: Partial<PDFGenerationOptions> = {}
  ): Promise<PDFGenerationResult> {
    const opts = { ...DEFAULT_PDF_OPTIONS, ...options };

    try {
      const pdf = new jsPDF({
        orientation: opts.orientation,
        unit: 'mm',
        format: opts.paperSize,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPos = margin;

      // Header
      yPos = this.addHeader(pdf, report, opts, yPos, pageWidth, margin);

      // Informações do veículo
      yPos = this.addVehicleInfo(pdf, report, yPos, margin);

      // Informações do cliente
      yPos = this.addClientInfo(pdf, report, yPos, margin);

      // Resumo dos danos
      yPos = this.addDamageSummary(pdf, report.summary, yPos, margin, pageWidth);

      // Lista de danos
      if (report.damages.length > 0) {
        yPos = this.addDamagesList(pdf, report.damages, yPos, margin, pageWidth, pageHeight);
      }

      // Estimativas
      if (opts.includeEstimates && report.summary.totalEstimatedCost > 0) {
        yPos = this.addEstimates(pdf, report.summary, yPos, margin, pageWidth, pageHeight);
      }

      // Recomendações
      if (opts.includeRecommendations && report.summary.recommendations.length > 0) {
        yPos = this.addRecommendations(pdf, report.summary, yPos, margin, pageWidth, pageHeight);
      }

      // Campo de assinatura
      if (opts.includeSignatureField) {
        this.addSignatureField(pdf, opts.signatureLabel || 'Assinatura', pageHeight, margin, pageWidth);
      }

      // Footer em todas as páginas
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        this.addFooter(pdf, i, totalPages, pageHeight, pageWidth, margin);
      }

      // Gerar blob
      const pdfBlob = pdf.output('blob');
      const fileName = `relatorio-danos-${report.vehicle.plate}-${Date.now()}.pdf`;

      // Upload para Firebase Storage
      const pdfUrl = await this.uploadPDF(pdfBlob, fileName, report.empresaId);

      // Atualizar relatório com URL do PDF
      if (report.id) {
        await this.updateReportPDF(report.id, pdfUrl);
      }

      return {
        success: true,
        pdfUrl,
        pdfBlob,
        fileName,
        pageCount: totalPages,
        generatedAt: new Date(),
      };
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      return {
        success: false,
        fileName: '',
        pageCount: 0,
        generatedAt: new Date(),
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  /**
   * Adiciona header ao PDF
   */
  private addHeader(
    pdf: jsPDF,
    report: DamageReport,
    options: PDFGenerationOptions,
    yPos: number,
    pageWidth: number,
    margin: number
  ): number {
    // Título
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RELATÓRIO DE DANOS', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    // Subtítulo
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Inspeção Visual do Veículo', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;

    // Data
    pdf.setFontSize(10);
    const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(report.createdAt);
    pdf.text(`Data: ${dataFormatada}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    // Linha separadora
    pdf.setDrawColor(200);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    return yPos;
  }

  /**
   * Adiciona informações do veículo
   */
  private addVehicleInfo(
    pdf: jsPDF,
    report: DamageReport,
    yPos: number,
    margin: number
  ): number {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DADOS DO VEÍCULO', margin, yPos);
    yPos += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    const vehicleInfo = [
      `Placa: ${report.vehicle.plate}`,
      `Marca/Modelo: ${report.vehicle.make} ${report.vehicle.model}`,
      `Ano: ${report.vehicle.year}`,
      report.vehicle.color ? `Cor: ${report.vehicle.color}` : null,
      report.vehicle.vin ? `Chassi: ${report.vehicle.vin}` : null,
    ].filter(Boolean);

    vehicleInfo.forEach((info) => {
      pdf.text(info as string, margin, yPos);
      yPos += 5;
    });

    yPos += 5;
    return yPos;
  }

  /**
   * Adiciona informações do cliente
   */
  private addClientInfo(
    pdf: jsPDF,
    report: DamageReport,
    yPos: number,
    margin: number
  ): number {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DADOS DO CLIENTE', margin, yPos);
    yPos += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    const clientInfo = [
      `Nome: ${report.client.name}`,
      report.client.document ? `Documento: ${report.client.document}` : null,
      report.client.phone ? `Telefone: ${report.client.phone}` : null,
      report.client.email ? `E-mail: ${report.client.email}` : null,
    ].filter(Boolean);

    clientInfo.forEach((info) => {
      pdf.text(info as string, margin, yPos);
      yPos += 5;
    });

    yPos += 5;
    return yPos;
  }

  /**
   * Adiciona resumo dos danos
   */
  private addDamageSummary(
    pdf: jsPDF,
    summary: DamageSummary,
    yPos: number,
    margin: number,
    pageWidth: number
  ): number {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RESUMO DA INSPEÇÃO', margin, yPos);
    yPos += 8;

    // Condição geral
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    const conditionLabel = CONDITION_LABELS[summary.overallCondition];
    pdf.text(`Condição Geral: ${conditionLabel} (${summary.conditionScore}/100)`, margin, yPos);
    yPos += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Total de Danos Identificados: ${summary.totalDamages}`, margin, yPos);
    yPos += 6;

    // Por severidade
    const severities: Array<{ key: DamageSeverity; label: string }> = [
      { key: 'critical', label: 'Críticos' },
      { key: 'severe', label: 'Graves' },
      { key: 'moderate', label: 'Moderados' },
      { key: 'minor', label: 'Leves' },
    ];

    severities.forEach(({ key, label }) => {
      const count = summary.bySeverity[key] || 0;
      if (count > 0) {
        pdf.text(`  • ${label}: ${count}`, margin, yPos);
        yPos += 5;
      }
    });

    yPos += 5;
    return yPos;
  }

  /**
   * Adiciona lista de danos
   */
  private addDamagesList(
    pdf: jsPDF,
    damages: ReportDamage[],
    yPos: number,
    margin: number,
    pageWidth: number,
    pageHeight: number
  ): number {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DANOS IDENTIFICADOS', margin, yPos);
    yPos += 8;

    damages.forEach((damage, index) => {
      // Verificar se precisa nova página
      if (yPos > pageHeight - 40) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      const typeLabel = DAMAGE_TYPE_LABELS[damage.type];
      const severityLabel = DAMAGE_SEVERITY_LABELS[damage.severity];
      pdf.text(`${index + 1}. ${typeLabel} - ${severityLabel}`, margin, yPos);
      yPos += 6;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      const locationLabel = DAMAGE_LOCATION_LABELS[damage.location];
      pdf.text(`   Localização: ${locationLabel}`, margin, yPos);
      yPos += 5;

      if (damage.description) {
        const descLines = pdf.splitTextToSize(`   Descrição: ${damage.description}`, pageWidth - margin * 2 - 10);
        pdf.text(descLines, margin, yPos);
        yPos += descLines.length * 5;
      }

      if (damage.estimatedRepairCost) {
        const cost = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(damage.estimatedRepairCost);
        pdf.text(`   Custo Estimado: ${cost}`, margin, yPos);
        yPos += 5;
      }

      yPos += 3;
    });

    return yPos;
  }

  /**
   * Adiciona estimativas
   */
  private addEstimates(
    pdf: jsPDF,
    summary: DamageSummary,
    yPos: number,
    margin: number,
    pageWidth: number,
    pageHeight: number
  ): number {
    if (yPos > pageHeight - 50) {
      pdf.addPage();
      yPos = 20;
    }

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ESTIMATIVA DE REPAROS', margin, yPos);
    yPos += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    const totalCost = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(summary.totalEstimatedCost);

    pdf.text(`Custo Total Estimado: ${totalCost}`, margin, yPos);
    yPos += 6;

    if (summary.totalEstimatedTime) {
      pdf.text(`Tempo Estimado: ${summary.totalEstimatedTime}`, margin, yPos);
      yPos += 6;
    }

    yPos += 5;
    return yPos;
  }

  /**
   * Adiciona recomendações
   */
  private addRecommendations(
    pdf: jsPDF,
    summary: DamageSummary,
    yPos: number,
    margin: number,
    pageWidth: number,
    pageHeight: number
  ): number {
    if (yPos > pageHeight - 50) {
      pdf.addPage();
      yPos = 20;
    }

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RECOMENDAÇÕES', margin, yPos);
    yPos += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    // Reparos urgentes
    if (summary.urgentRepairs.length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Reparos Urgentes:', margin, yPos);
      yPos += 5;
      pdf.setFont('helvetica', 'normal');

      summary.urgentRepairs.forEach((repair) => {
        pdf.text(`  ⚠ ${repair}`, margin, yPos);
        yPos += 5;
      });
      yPos += 3;
    }

    // Recomendações gerais
    summary.recommendations.forEach((rec) => {
      const lines = pdf.splitTextToSize(`• ${rec}`, pageWidth - margin * 2);
      pdf.text(lines, margin, yPos);
      yPos += lines.length * 5;
    });

    return yPos;
  }

  /**
   * Adiciona campo de assinatura
   */
  private addSignatureField(
    pdf: jsPDF,
    label: string,
    pageHeight: number,
    margin: number,
    pageWidth: number
  ): void {
    const yPos = pageHeight - 35;

    pdf.setDrawColor(100);
    pdf.line(margin, yPos, pageWidth / 2 - 10, yPos);

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(label, margin, yPos + 5);

    // Data
    pdf.line(pageWidth / 2 + 10, yPos, pageWidth - margin, yPos);
    pdf.text('Data', pageWidth / 2 + 10, yPos + 5);
  }

  /**
   * Adiciona footer
   */
  private addFooter(
    pdf: jsPDF,
    currentPage: number,
    totalPages: number,
    pageHeight: number,
    pageWidth: number,
    margin: number
  ): void {
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(128);

    const footerY = pageHeight - 10;
    pdf.text(`Página ${currentPage} de ${totalPages}`, pageWidth / 2, footerY, { align: 'center' });
    pdf.text('Documento gerado automaticamente pelo TORQ', pageWidth / 2, footerY + 4, { align: 'center' });

    pdf.setTextColor(0);
  }

  /**
   * Upload do PDF para Firebase Storage
   */
  private async uploadPDF(
    blob: Blob,
    fileName: string,
    empresaId: string
  ): Promise<string> {
    const storageRef = ref(storage, `empresas/${empresaId}/damage-reports/${fileName}`);
    await uploadBytes(storageRef, blob);
    return getDownloadURL(storageRef);
  }

  /**
   * Atualiza relatório com URL do PDF
   */
  private async updateReportPDF(reportId: string, pdfUrl: string): Promise<void> {
    const docRef = doc(db, this.COLLECTION, reportId);
    await updateDoc(docRef, {
      pdfUrl,
      pdfGeneratedAt: Timestamp.now(),
      status: 'generated',
    });
  }

  /**
   * Cria novo relatório de danos
   */
  async createReport(
    report: Omit<DamageReport, 'id' | 'createdAt' | 'status'>
  ): Promise<string> {
    const docRef = await addDoc(collection(db, this.COLLECTION), {
      ...report,
      createdAt: Timestamp.now(),
      status: 'draft',
    });
    return docRef.id;
  }

  /**
   * Busca relatório por ID
   */
  async getReport(reportId: string): Promise<DamageReport | null> {
    const docRef = doc(db, this.COLLECTION, reportId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      pdfGeneratedAt: data.pdfGeneratedAt?.toDate(),
    } as DamageReport;
  }

  /**
   * Calcula resumo dos danos
   */
  calculateSummary(damages: ReportDamage[]): DamageSummary {
    const bySeverity: Record<DamageSeverity, number> = {
      minor: 0,
      moderate: 0,
      severe: 0,
      critical: 0,
    };

    const byType: Record<string, number> = {};
    const byLocation: Record<string, number> = {};
    let totalCost = 0;
    const urgentRepairs: string[] = [];

    damages.forEach((damage) => {
      bySeverity[damage.severity]++;
      byType[damage.type] = (byType[damage.type] || 0) + 1;
      byLocation[damage.location] = (byLocation[damage.location] || 0) + 1;

      if (damage.estimatedRepairCost) {
        totalCost += damage.estimatedRepairCost;
      }

      if (damage.severity === 'critical' || damage.severity === 'severe') {
        urgentRepairs.push(
          `${DAMAGE_TYPE_LABELS[damage.type]} em ${DAMAGE_LOCATION_LABELS[damage.location]}`
        );
      }
    });

    // Calcular condição geral
    const severityWeights = { minor: 1, moderate: 3, severe: 7, critical: 15 };
    const totalWeight = damages.reduce(
      (sum, d) => sum + severityWeights[d.severity],
      0
    );
    const conditionScore = Math.max(0, 100 - totalWeight * 2);

    let overallCondition: DamageSummary['overallCondition'];
    if (conditionScore >= 90) overallCondition = 'excellent';
    else if (conditionScore >= 70) overallCondition = 'good';
    else if (conditionScore >= 50) overallCondition = 'fair';
    else overallCondition = 'poor';

    // Recomendações
    const recommendations: string[] = [];
    if (bySeverity.critical > 0) {
      recommendations.push('Reparos críticos devem ser realizados imediatamente');
    }
    if (bySeverity.severe > 0) {
      recommendations.push('Agendar reparos graves o mais breve possível');
    }
    if (byType.rust) {
      recommendations.push('Tratar ferrugem para evitar propagação');
    }
    if (byType.glass_damage) {
      recommendations.push('Verificar necessidade de troca de vidros');
    }

    return {
      totalDamages: damages.length,
      bySeverity,
      byType,
      byLocation,
      totalEstimatedCost: totalCost,
      totalEstimatedTime: this.estimateTime(damages),
      overallCondition,
      conditionScore,
      recommendations,
      urgentRepairs,
    };
  }

  /**
   * Estima tempo de reparo
   */
  private estimateTime(damages: ReportDamage[]): string {
    let totalHours = 0;

    damages.forEach((damage) => {
      switch (damage.severity) {
        case 'minor':
          totalHours += 1;
          break;
        case 'moderate':
          totalHours += 3;
          break;
        case 'severe':
          totalHours += 8;
          break;
        case 'critical':
          totalHours += 16;
          break;
      }
    });

    if (totalHours < 8) {
      return `${totalHours} hora${totalHours > 1 ? 's' : ''}`;
    }

    const days = Math.ceil(totalHours / 8);
    return `${days} dia${days > 1 ? 's' : ''} útil${days > 1 ? 'eis' : ''}`;
  }
}

export const damageReportService = new DamageReportService();
