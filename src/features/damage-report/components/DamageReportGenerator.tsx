/**
 * TORQ Damage Report - Generator Component
 * Componente para geração de relatório de danos
 */

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Settings,
  Eye,
} from 'lucide-react';
import { useDamageReport } from '../hooks/useDamageReport';
import type { DamageReport, PDFGenerationOptions } from '../types';
import { DEFAULT_PDF_OPTIONS } from '../types';

interface DamageReportGeneratorProps {
  report: Omit<DamageReport, 'id' | 'createdAt' | 'status' | 'summary'>;
  empresaId: string;
  onGenerated?: (pdfUrl: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const DamageReportGenerator: React.FC<DamageReportGeneratorProps> = ({
  report,
  empresaId,
  onGenerated,
  onError,
  className = '',
}) => {
  const {
    summary,
    pdfResult,
    isGenerating,
    error,
    createReport,
    generatePDF,
    downloadPDF,
    calculateSummary,
    clearError,
  } = useDamageReport({ empresaId });

  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState<PDFGenerationOptions>(DEFAULT_PDF_OPTIONS);

  // Calcular resumo para preview
  const previewSummary = calculateSummary(report.damages);

  const handleGenerate = async () => {
    clearError();

    // Criar relatório
    const reportId = await createReport(report);
    if (!reportId) {
      onError?.('Erro ao criar relatório');
      return;
    }

    // Gerar PDF
    const result = await generatePDF(options);
    if (result?.success && result.pdfUrl) {
      onGenerated?.(result.pdfUrl);
    } else {
      onError?.(result?.error || 'Erro ao gerar PDF');
    }
  };

  const toggleOption = (key: keyof PDFGenerationOptions) => {
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Relatório de Danos
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {report.vehicle.plate} - {report.vehicle.make} {report.vehicle.model}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Preview do resumo */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900/50">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Resumo da Inspeção
        </h4>

        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {previewSummary.totalDamages}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {previewSummary.bySeverity.critical + previewSummary.bySeverity.severe}
            </p>
            <p className="text-xs text-red-600 dark:text-red-400">Graves</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {previewSummary.bySeverity.moderate}
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">Moderados</p>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {previewSummary.bySeverity.minor}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">Leves</p>
          </div>
        </div>

        {/* Condição geral */}
        <div className="mt-3 flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
          <span className="text-sm text-gray-600 dark:text-gray-400">Condição Geral</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  previewSummary.conditionScore >= 70
                    ? 'bg-green-500'
                    : previewSummary.conditionScore >= 50
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${previewSummary.conditionScore}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {previewSummary.conditionScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* Opções */}
      {showOptions && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Opções do PDF
          </h4>
          <div className="space-y-2">
            {[
              { key: 'includePhotos', label: 'Incluir fotos' },
              { key: 'includeEstimates', label: 'Incluir estimativas de custo' },
              { key: 'includeRecommendations', label: 'Incluir recomendações' },
              { key: 'includeDiagram', label: 'Incluir diagrama do veículo' },
              { key: 'includeSignatureField', label: 'Campo de assinatura' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options[key as keyof PDFGenerationOptions] as boolean}
                  onChange={() => toggleOption(key as keyof PDFGenerationOptions)}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-t border-red-100 dark:border-red-800">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Sucesso */}
      {pdfResult?.success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border-t border-green-100 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">PDF gerado com sucesso!</span>
            </div>
            <div className="flex items-center gap-2">
              {pdfResult.pdfUrl && (
                <a
                  href={pdfResult.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={downloadPDF}
                className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={handleGenerate}
          disabled={isGenerating || report.damages.length === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-xl transition-colors"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Gerando PDF...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              Gerar Relatório PDF
            </>
          )}
        </button>

        {report.damages.length === 0 && (
          <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            Nenhum dano registrado para gerar relatório
          </p>
        )}
      </div>
    </div>
  );
};
