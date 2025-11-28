/**
 * TORQ Damage Report - Hook
 * Hook React para geração de relatório de danos
 */

import { useState, useCallback } from 'react';
import { damageReportService } from '../services/damageReportService';
import type {
  DamageReport,
  ReportDamage,
  DamageSummary,
  PDFGenerationOptions,
  PDFGenerationResult,
} from '../types';

interface UseDamageReportOptions {
  empresaId: string;
}

interface UseDamageReportReturn {
  // Estado
  report: DamageReport | null;
  summary: DamageSummary | null;
  pdfResult: PDFGenerationResult | null;
  isGenerating: boolean;
  isLoading: boolean;
  error: string | null;

  // Ações
  createReport: (data: Omit<DamageReport, 'id' | 'createdAt' | 'status' | 'summary'>) => Promise<string | null>;
  loadReport: (reportId: string) => Promise<void>;
  generatePDF: (options?: Partial<PDFGenerationOptions>) => Promise<PDFGenerationResult | null>;
  downloadPDF: () => void;
  calculateSummary: (damages: ReportDamage[]) => DamageSummary;
  clearError: () => void;
  reset: () => void;
}

export function useDamageReport(
  options: UseDamageReportOptions
): UseDamageReportReturn {
  const { empresaId } = options;

  // Estados
  const [report, setReport] = useState<DamageReport | null>(null);
  const [summary, setSummary] = useState<DamageSummary | null>(null);
  const [pdfResult, setPdfResult] = useState<PDFGenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cria novo relatório
   */
  const createReport = useCallback(
    async (
      data: Omit<DamageReport, 'id' | 'createdAt' | 'status' | 'summary'>
    ): Promise<string | null> => {
      setIsLoading(true);
      setError(null);

      try {
        // Calcular resumo
        const calculatedSummary = damageReportService.calculateSummary(data.damages);

        const reportId = await damageReportService.createReport({
          ...data,
          summary: calculatedSummary,
        });

        // Carregar relatório criado
        const createdReport = await damageReportService.getReport(reportId);
        setReport(createdReport);
        setSummary(calculatedSummary);

        return reportId;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao criar relatório';
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Carrega relatório existente
   */
  const loadReport = useCallback(async (reportId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const loadedReport = await damageReportService.getReport(reportId);
      
      if (!loadedReport) {
        throw new Error('Relatório não encontrado');
      }

      setReport(loadedReport);
      setSummary(loadedReport.summary);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar relatório';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Gera PDF do relatório
   */
  const generatePDF = useCallback(
    async (
      pdfOptions?: Partial<PDFGenerationOptions>
    ): Promise<PDFGenerationResult | null> => {
      if (!report) {
        setError('Nenhum relatório carregado');
        return null;
      }

      setIsGenerating(true);
      setError(null);

      try {
        const result = await damageReportService.generatePDF(report, pdfOptions);

        if (!result.success) {
          throw new Error(result.error || 'Erro ao gerar PDF');
        }

        setPdfResult(result);

        // Atualizar relatório com URL do PDF
        if (result.pdfUrl) {
          setReport((prev) =>
            prev
              ? {
                  ...prev,
                  pdfUrl: result.pdfUrl,
                  pdfGeneratedAt: result.generatedAt,
                  status: 'generated',
                }
              : null
          );
        }

        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao gerar PDF';
        setError(message);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [report]
  );

  /**
   * Download do PDF
   */
  const downloadPDF = useCallback(() => {
    if (!pdfResult?.pdfBlob || !pdfResult?.fileName) {
      setError('PDF não disponível para download');
      return;
    }

    const url = URL.createObjectURL(pdfResult.pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = pdfResult.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [pdfResult]);

  /**
   * Calcula resumo dos danos
   */
  const calculateSummary = useCallback((damages: ReportDamage[]): DamageSummary => {
    return damageReportService.calculateSummary(damages);
  }, []);

  /**
   * Limpa erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Reset do estado
   */
  const reset = useCallback(() => {
    setReport(null);
    setSummary(null);
    setPdfResult(null);
    setError(null);
  }, []);

  return {
    // Estado
    report,
    summary,
    pdfResult,
    isGenerating,
    isLoading,
    error,

    // Ações
    createReport,
    loadReport,
    generatePDF,
    downloadPDF,
    calculateSummary,
    clearError,
    reset,
  };
}
