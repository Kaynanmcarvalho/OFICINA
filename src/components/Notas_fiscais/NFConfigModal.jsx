import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave, FiSettings, FiInfo } from 'react-icons/fi';
import clsx from 'clsx';

const NFConfigModal = ({ isOpen, onClose, onSave, initialConfig = {} }) => {
  const [config, setConfig] = useState({
    naturezaOperacao: 'Venda de mercadoria',
    modelo: '55',
    serie: '1',
    tipoDocumento: '1', // 1=Saída, 0=Entrada
    finalidadeEmissao: '1', // 1=Normal, 2=Complementar, 3=Ajuste, 4=Devolução
    consumidorFinal: '1', // 0=Não, 1=Sim
    presencaComprador: '1', // 1=Presencial, 2=Internet, 3=Teleatendimento, etc.
    ncmPadrao: '61091000', // NCM padrão para roupas esportivas
    cfopPadrao: '5102', // CFOP padrão para venda
    informacoesAdicionais: 'Documento emitido por ME ou EPP optante pelo Simples Nacional. Não gera direito a crédito fiscal de IPI. Não gera direito a crédito fiscal de ICMS.',
    ...initialConfig
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setConfig({
        naturezaOperacao: 'Venda de mercadoria',
        modelo: '55',
        serie: '1',
        tipoDocumento: '1',
        finalidadeEmissao: '1',
        consumidorFinal: '1',
        presencaComprador: '1',
        ncmPadrao: '61091000',
        cfopPadrao: '5102',
        informacoesAdicionais: 'Documento emitido por ME ou EPP optante pelo Simples Nacional. Não gera direito a crédito fiscal de IPI. Não gera direito a crédito fiscal de ICMS.',
        ...initialConfig
      });
      setErrors({});
    }
  }, [isOpen, initialConfig]);

  const handleInputChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateConfig = () => {
    const newErrors = {};

    if (!config.naturezaOperacao?.trim()) {
      newErrors.naturezaOperacao = 'Natureza da operação é obrigatória';
    }

    if (!config.modelo || !['55', '65'].includes(config.modelo)) {
      newErrors.modelo = 'Modelo deve ser 55 (NFe) ou 65 (NFCe)';
    }

    if (!config.serie || parseInt(config.serie) < 1 || parseInt(config.serie) > 999) {
      newErrors.serie = 'Série deve ser entre 1 e 999';
    }

    if (!config.ncmPadrao || config.ncmPadrao.length !== 8) {
      newErrors.ncmPadrao = 'NCM deve ter 8 dígitos';
    }

    if (!config.cfopPadrao || config.cfopPadrao.length !== 4) {
      newErrors.cfopPadrao = 'CFOP deve ter 4 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateConfig()) {
      onSave(config);
      onClose();
    }
  };

  const naturezaOperacaoOptions = [
    'Venda de mercadoria',
    'Venda de produto industrializado',
    'Prestação de serviços',
    'Devolução de mercadoria',
    'Remessa para conserto',
    'Transferência entre filiais'
  ];

  const finalidadeEmissaoOptions = [
    { value: '1', label: 'Normal' },
    { value: '2', label: 'Complementar' },
    { value: '3', label: 'Ajuste' },
    { value: '4', label: 'Devolução/Retorno' }
  ];

  const presencaCompradorOptions = [
    { value: '1', label: 'Operação presencial' },
    { value: '2', label: 'Operação não presencial, pela Internet' },
    { value: '3', label: 'Operação não presencial, Teleatendimento' },
    { value: '4', label: 'NFC-e em operação com entrega a domicílio' },
    { value: '9', label: 'Operação não presencial, outros' }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiSettings className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Configurações da Nota Fiscal
                  </h3>
                  <p className="text-sm text-gray-600">
                    Configure os parâmetros padrão para emissão de notas fiscais
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
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Natureza da Operação */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Natureza da Operação *
                </label>
                <select
                  value={config.naturezaOperacao}
                  onChange={(e) => handleInputChange('naturezaOperacao', e.target.value)}
                  className={clsx(
                    'w-full rounded-md border shadow-sm px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                    errors.naturezaOperacao
                      ? 'border-red-300'
                      : 'border-gray-300'
                  )}
                >
                  {naturezaOperacaoOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.naturezaOperacao && (
                  <p className="mt-1 text-sm text-red-600">{errors.naturezaOperacao}</p>
                )}
              </div>

              {/* Modelo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo *
                </label>
                <select
                  value={config.modelo}
                  onChange={(e) => handleInputChange('modelo', e.target.value)}
                  className={clsx(
                    'w-full rounded-md border shadow-sm px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                    errors.modelo
                      ? 'border-red-300'
                      : 'border-gray-300'
                  )}
                >
                  <option value="55">55 - Nota Fiscal Eletrônica (NFe)</option>
                  <option value="65">65 - Nota Fiscal de Consumidor Eletrônica (NFCe)</option>
                </select>
                {errors.modelo && (
                  <p className="mt-1 text-sm text-red-600">{errors.modelo}</p>
                )}
              </div>

              {/* Série */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Série *
                </label>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={config.serie}
                  onChange={(e) => handleInputChange('serie', e.target.value)}
                  className={clsx(
                    'w-full rounded-md border shadow-sm px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                    errors.serie
                      ? 'border-red-300'
                      : 'border-gray-300'
                  )}
                  placeholder="1"
                />
                {errors.serie && (
                  <p className="mt-1 text-sm text-red-600">{errors.serie}</p>
                )}
              </div>

              {/* Finalidade da Emissão */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Finalidade da Emissão
                </label>
                <select
                  value={config.finalidadeEmissao}
                  onChange={(e) => handleInputChange('finalidadeEmissao', e.target.value)}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {finalidadeEmissaoOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Presença do Comprador */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presença do Comprador
                </label>
                <select
                  value={config.presencaComprador}
                  onChange={(e) => handleInputChange('presencaComprador', e.target.value)}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {presencaCompradorOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* NCM Padrão */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NCM Padrão *
                </label>
                <input
                  type="text"
                  maxLength="8"
                  value={config.ncmPadrao}
                  onChange={(e) => handleInputChange('ncmPadrao', e.target.value.replace(/\D/g, ''))}
                  className={clsx(
                    'w-full rounded-md border shadow-sm px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                     errors.ncmPadrao
                       ? 'border-red-300'
                       : 'border-gray-300'
                  )}
                  placeholder="61091000"
                />
                {errors.ncmPadrao && (
                  <p className="mt-1 text-sm text-red-600">{errors.ncmPadrao}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  NCM para roupas esportivas: 61091000
                </p>
              </div>

              {/* CFOP Padrão */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CFOP Padrão *
                </label>
                <input
                  type="text"
                  maxLength="4"
                  value={config.cfopPadrao}
                  onChange={(e) => handleInputChange('cfopPadrao', e.target.value.replace(/\D/g, ''))}
                  className={clsx(
                    'w-full rounded-md border shadow-sm px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                     errors.cfop
                       ? 'border-red-300'
                       : 'border-gray-300'
                  )}
                  placeholder="5102"
                />
                {errors.cfopPadrao && (
                  <p className="mt-1 text-sm text-red-600">{errors.cfopPadrao}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  CFOP para venda: 5102
                </p>
              </div>

              {/* Consumidor Final */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consumidor Final
                </label>
                <select
                  value={config.consumidorFinal}
                  onChange={(e) => handleInputChange('consumidorFinal', e.target.value)}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="0">Não</option>
                  <option value="1">Sim</option>
                </select>
              </div>

              {/* Tipo de Documento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Documento
                </label>
                <select
                  value={config.tipoDocumento}
                  onChange={(e) => handleInputChange('tipoDocumento', e.target.value)}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="0">Entrada</option>
                  <option value="1">Saída</option>
                </select>
              </div>

              {/* Informações Adicionais */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Informações Adicionais
                </label>
                <textarea
                  rows={3}
                  value={config.informacoesAdicionais}
                  onChange={(e) => handleInputChange('informacoesAdicionais', e.target.value)}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Informações adicionais que aparecerão na nota fiscal..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  {config.informacoesAdicionais?.length || 0}/500 caracteres
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <FiInfo className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Informações Importantes:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Estas configurações serão aplicadas como padrão para todas as notas fiscais</li>
                    <li>O NCM e CFOP podem ser alterados individualmente por produto</li>
                    <li>Certifique-se de que os códigos estão corretos conforme sua atividade</li>
                    <li>Para dúvidas sobre códigos fiscais, consulte a Receita Federal</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
              >
                <FiSave className="w-4 h-4 mr-2" />
                Salvar Configurações
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NFConfigModal;