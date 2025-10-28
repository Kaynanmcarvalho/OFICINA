import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiSettings, 
  FiPrinter, 
  FiSave,
  FiRotateCcw,
  FiInfo
} from 'react-icons/fi';
import escposPrintService from '../../config/escposPrintService';

const PrinterConfigModal = ({ isOpen, onClose, onSave }) => {
  const [settings, setSettings] = useState({
    modelo: 1,
    colunas: 48,
    qrcode_lateral: false
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Carregar configurações ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const currentSettings = await escposPrintService.getPrinterSettings();
      setSettings(currentSettings);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await escposPrintService.savePrinterSettings(settings);
      if (result.success) {
        onSave?.(settings);
        onClose();
      } else {
        console.error('Erro ao salvar configurações:', result.error);
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({
      modelo: 1,
      colunas: 48,
      qrcode_lateral: false
    });
  };

  const printerModels = escposPrintService.getPrinterModels();
  const columnOptions = escposPrintService.getColumnOptions();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiSettings className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Configurações da Impressora
                  </h3>
                  <p className="text-sm text-gray-500">
                    Configure sua impressora térmica ESC/POS
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Modelo da Impressora */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiPrinter className="inline w-4 h-4 mr-1" />
                    Modelo da Impressora
                  </label>
                  <select
                    value={settings.modelo}
                    onChange={(e) => setSettings(prev => ({ ...prev, modelo: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {printerModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.id} - {model.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Recomendado: Epson (modelo 1) para Jetway JP-800
                  </p>
                </div>

                {/* Número de Colunas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Colunas
                  </label>
                  <select
                    value={settings.colunas}
                    onChange={(e) => setSettings(prev => ({ ...prev, colunas: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {columnOptions.map((cols) => (
                      <option key={cols} value={cols}>
                        {cols} colunas
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Define o máximo de caracteres por linha usando fonte normal
                  </p>
                </div>

                {/* QR Code Lateral */}
                <div>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.qrcode_lateral}
                      onChange={(e) => setSettings(prev => ({ ...prev, qrcode_lateral: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        QR Code Lateral
                      </span>
                      <p className="text-xs text-gray-500">
                        Imprime o QR Code na lateral do DANFCE
                      </p>
                    </div>
                  </label>
                </div>

                {/* Informações Adicionais */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FiInfo className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Sobre ESC/POS:</p>
                      <ul className="text-xs space-y-1">
                        <li>• Sistema de comando criado pela Epson</li>
                        <li>• Compatível com impressoras térmicas POS</li>
                        <li>• Permite impressão nativa em diversos modelos</li>
                        <li>• QR Code lateral pode não funcionar em todos os modelos</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Configuração Atual */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Configuração Atual:
                  </h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Modelo: {printerModels.find(m => m.id === settings.modelo)?.name}</div>
                    <div>Colunas: {settings.colunas}</div>
                    <div>QR Code Lateral: {settings.qrcode_lateral ? 'Sim' : 'Não'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiRotateCcw className="w-4 h-4" />
                Restaurar Padrão
              </button>
              
              <div className="flex-1"></div>
              
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FiSave className="w-4 h-4" />
                )}
                Salvar
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PrinterConfigModal;