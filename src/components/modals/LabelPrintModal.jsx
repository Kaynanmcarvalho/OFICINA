import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiPrinter, 
  FiSettings, 
  FiEye,
  FiCopy,
  FiDownload,
  FiCheck,
  FiAlertCircle
} from 'react-icons/fi';
import clsx from 'clsx';
import labelPrinterService from '../../config/labelPrinterService';
import configService from '../../config/configService';
import CatechLabelTemplate, { generateCatechZPL, generateCatechHTML } from '../CatechLabelTemplate';
import DualLabelTemplate, { generateDualTSPL, generateDualZPL, generateDualHTML } from '../DualLabelTemplate';

const LabelPrintModal = ({ isOpen, onClose, produto }) => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);
  const [labelPreview, setLabelPreview] = useState('');
  const [notification, setNotification] = useState(null);
  const [printerStatus, setPrinterStatus] = useState('unknown');
  const [printerType, setPrinterType] = useState('standard'); // 'standard' ou 'catech'
  const [layoutType, setLayoutType] = useState('single'); // 'single' ou 'double'
  const [mostrarCor, setMostrarCor] = useState(true); // mostrar cor na etiqueta
  
  // Estados para override temporário das configurações
  const [tempConfig, setTempConfig] = useState({
    formatoEtiqueta: 'ZPL',
    impressoraEtiquetas: 'C3Tech IT-200',
    tamanhoEtiqueta: '80x30mm',
    layoutEtiqueta: 'dupla',
    densidadeEtiqueta: 8,
    velocidadeEtiqueta: 2,
    incluirLogo: true,
    incluirCodigoBarras: true,
    incluirPreco: true,
    incluirTamanho: true,
    // novos offsets para correção fina (em dots)
    offsetYDots: -15,
    leftOffsetXDots: -5,
    rightOffsetXDots: 0,
  });
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadConfig();
      checkPrinterStatus();
    }
  }, [isOpen]);

  const loadConfig = async () => {
    try {
      const configs = await configService.getConfiguracoes();

      setConfig(configs);
      
      // Atualizar configurações temporárias com as configurações carregadas (merge)
      setTempConfig(prev => ({
        ...prev,
        formatoEtiqueta: configs.formatoEtiqueta || 'ZPL',
        impressoraEtiquetas: configs.impressoraEtiquetas || 'C3Tech IT-200',
        tamanhoEtiqueta: configs.tamanhoEtiqueta || '80x30mm',
        layoutEtiqueta: configs.layoutEtiqueta || 'dupla',
        densidadeEtiqueta: configs.densidadeEtiqueta || prev.densidadeEtiqueta,
        velocidadeEtiqueta: configs.velocidadeEtiqueta || prev.velocidadeEtiqueta,
        incluirLogo: configs.incluirLogo !== undefined ? configs.incluirLogo : prev.incluirLogo,
        incluirCodigoBarras: configs.incluirCodigoBarras !== undefined ? configs.incluirCodigoBarras : prev.incluirCodigoBarras,
        incluirPreco: configs.incluirPreco !== undefined ? configs.incluirPreco : prev.incluirPreco,
        incluirTamanho: configs.incluirTamanho !== undefined ? configs.incluirTamanho : prev.incluirTamanho,
        offsetYDots: configs.offsetYDots !== undefined ? configs.offsetYDots : prev.offsetYDots,
        leftOffsetXDots: configs.leftOffsetXDots !== undefined ? configs.leftOffsetXDots : prev.leftOffsetXDots,
        rightOffsetXDots: configs.rightOffsetXDots !== undefined ? configs.rightOffsetXDots : prev.rightOffsetXDots,
      }));
      
      // Inicializar QZ Tray primeiro
      try {
        await labelPrinterService.initializeQZTray();
      } catch (qzError) {
        showNotification('QZ Tray não está disponível. Instale e inicie o QZ Tray para impressão.', 'warning');
      }
      
      // Configurar o serviço de impressão com as configurações
      const configData = {
        impressoraEtiquetas: configs.impressoraEtiquetas,
        tamanhoEtiqueta: configs.tamanhoEtiqueta,
        densidadeEtiqueta: configs.densidadeEtiqueta,
        velocidadeEtiqueta: configs.velocidadeEtiqueta,
        tipoEtiqueta: configs.tipoEtiqueta,
        formatoEtiqueta: configs.formatoEtiqueta,
        margemEtiqueta: configs.margemEtiqueta,
        fonteTamanho: configs.fonteTamanho,
        incluirLogo: configs.incluirLogo,
        incluirCodigoBarras: configs.incluirCodigoBarras,
        incluirPreco: configs.incluirPreco,
        incluirTamanho: configs.incluirTamanho,
        nomeEmpresa: configs.nomeEmpresa
      };
      
      labelPrinterService.configure(configData);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      showNotification('Erro ao carregar configurações: ' + error.message, 'error');
    }
  };

  const checkPrinterStatus = async () => {
    try {
      const status = await labelPrinterService.checkPrinterStatus(config?.impressoraEtiquetas);
      setPrinterStatus(status);
    } catch (error) {
      setPrinterStatus({
        online: false,
        paperLoaded: false,
        error: error.message,
        qzConnected: false
      });
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateTempConfig = (key, value) => {
    setTempConfig(prev => ({ ...prev, [key]: value }));
  };

  // Função para obter configuração final (temp override ou config padrão)
  const getFinalConfig = () => {
    return { ...config, ...tempConfig };
  };

  const generatePreview = async () => {
    if (!produto || !config) return;
    
    try {
      setLoading(true);
      let preview;
      const finalConfig = getFinalConfig();
      
      if (printerType === 'catech') {
        // Criar array de produtos para etiquetas duplas
        const produtos = layoutType === 'double' ? [produto, produto] : [produto];
        preview = generateCatechHTML(produtos, {
          nomeEmpresa: finalConfig.nomeEmpresa || "ACADEMIA PLAY FIT",
          incluirCodigoBarras: finalConfig.incluirCodigoBarras,
          incluirPreco: finalConfig.incluirPreco,
          incluirTamanho: finalConfig.incluirTamanho
        });
      } else {
        preview = labelPrinterService.generateLabelHTML(produto, finalConfig);
      }
      
      setLabelPreview(preview);
      setPreviewMode(true);
    } catch (error) {
      console.error('Erro ao gerar preview:', error);
      showNotification('Erro ao gerar preview da etiqueta', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    generatePreview();
  };

  const handlePrint = async () => {
    if (!produto || !config) return;
    
    try {
      setLoading(true);
      const finalConfig = getFinalConfig();
      
      if (printerType === 'catech') {
        // Impressão para C3Tech IT-200
        const produtos = [];
        
        // Sempre usar layout duplo para C3Tech (2 etiquetas por linha)
        for (let i = 0; i < quantidade; i++) {
          produtos.push(produto);
        }
        
        const zplCommands = generateCatechZPL(produtos, {
          nomeEmpresa: finalConfig.nomeEmpresa || "ACADEMIA PLAY FIT",
          incluirCodigoBarras: finalConfig.incluirCodigoBarras,
          incluirPreco: finalConfig.incluirPreco,
          incluirTamanho: finalConfig.incluirTamanho
        });

          // Tentar imprimir via labelPrinterService
          try {
            // Passar o array completo de produtos em vez de apenas 1
            const result = await labelPrinterService.printLabel(produtos, finalConfig);
            if (result.success) {
            showNotification(`${quantidade} etiqueta(s) enviada(s) para impressão C3Tech IT-200: ${result.printer}!`);
          } else {
            showNotification(`Erro na impressão: ${result.message}`, 'error');
          }
        } catch (error) {
          console.error('Erro ao tentar imprimir:', error);
          showNotification(`Erro na impressão: ${error.message}`, 'error');
        }
      } else if (printerType === 'browser') {
        // Impressão via navegador/PDF
        const produtos = [];
        for (let i = 0; i < quantidade; i++) {
          produtos.push(produto);
        }
        
        const htmlContent = generateCatechHTML(produtos, {
          nomeEmpresa: finalConfig.nomeEmpresa || "ACADEMIA PLAY FIT",
          incluirCodigoBarras: finalConfig.incluirCodigoBarras,
          incluirPreco: finalConfig.incluirPreco,
          incluirTamanho: finalConfig.incluirTamanho
        });
        
        // Criar nova janela para impressão
        const printWindow = window.open('', '_blank');
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Aguardar carregamento e abrir diálogo de impressão
        printWindow.onload = () => {
          printWindow.print();
          printWindow.close();
        };
        
        showNotification(`${quantidade} etiqueta(s) enviada(s) para impressão via navegador!`);
      } else {
        // Impressão padrão
        if (quantidade === 1) {
          await labelPrinterService.printLabel(produto, finalConfig);
          showNotification('Etiqueta enviada para impressão!');
        } else {
          await labelPrinterService.printMultipleLabels(produto, quantidade, finalConfig);
          showNotification(`${quantidade} etiquetas enviadas para impressão!`);
        }
      }
      
      // Fechar modal após impressão bem-sucedida
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao imprimir etiqueta:', error);
      showNotification('Erro ao imprimir etiqueta. Verifique a impressora.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPreview = () => {
    if (!labelPreview) return;
    
    const blob = new Blob([labelPreview], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `etiqueta-${produto?.codigo || 'produto'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Preview baixado com sucesso!');
  };

  const handleCopyPreview = async () => {
    if (!labelPreview) return;
    
    try {
      await navigator.clipboard.writeText(labelPreview);
      showNotification('Preview copiado para área de transferência!');
    } catch (error) {
      showNotification('Erro ao copiar preview', 'error');
    }
  };

  const getPrinterStatusIcon = () => {
    switch (printerStatus) {
      case 'ready':
        return <FiCheck className="text-green-500" />;
      case 'error':
        return <FiAlertCircle className="text-red-500" />;
      default:
        return <FiSettings className="text-yellow-500" />;
    }
  };

  const getPrinterStatusText = () => {
    switch (printerStatus) {
      case 'ready':
        return 'Impressora pronta';
      case 'error':
        return 'Erro na impressora';
      default:
        return 'Status desconhecido';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiPrinter className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Imprimir Etiqueta
                </h2>
                <p className="text-sm text-gray-500">
                  {produto?.nome || 'Produto selecionado'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Notification */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={clsx(
                  'mx-6 mt-4 p-3 rounded-lg text-sm font-medium',
                  notification.type === 'error'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-green-100 text-green-700 border border-green-200'
                )}
              >
                {notification.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Printer Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getPrinterStatusIcon()}
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    {config?.impressoraEtiquetas || 'Impressora não configurada'}
                  </span>
                  <p className="text-xs text-gray-500">
                    {getPrinterStatusText()}
                  </p>
                </div>
              </div>
              <button
                onClick={checkPrinterStatus}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Verificar
              </button>
            </div>

            {/* Product Info */}
            {produto && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Código</span>
                  <p className="text-sm font-medium text-gray-900">{produto.codigo}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Preço</span>
                  <p className="text-sm font-medium text-gray-900">
                    R$ {produto.preco?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Categoria</span>
                  <p className="text-sm font-medium text-gray-900">{produto.categoria}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Tamanho</span>
                  <p className="text-sm font-medium text-gray-900">{produto.tamanho || 'N/A'}</p>
                </div>
              </div>
            )}

            {/* Printer Type Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Impressora
                </label>
                <select
                  value={printerType}
                  onChange={(e) => setPrinterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="standard">Impressora Padrão (Zebra/Brother)</option>
                  <option value="catech">C3Tech IT-200 (54x35mm)</option>
                  <option value="browser">Impressão Normal (PDF/Navegador)</option>
                </select>
              </div>

              {/* Layout Type for CATECH */}
              {printerType === 'catech' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Layout da Etiqueta
                  </label>
                  <select
                    value={layoutType}
                    onChange={(e) => setLayoutType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="single">Etiqueta Simples (54mm)</option>
                    <option value="double">Etiquetas Duplas (2x 54mm)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {layoutType === 'double' ? 'Duas etiquetas idênticas por linha' : 'Uma etiqueta por linha'}
                  </p>
                </div>
              )}

              {/* Layout sempre duplo para outros tipos */}
              {printerType !== 'catech' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Layout da Etiqueta
                  </label>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FiCheck className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        Layout Duplo (2x 40x30mm em papel 80x30mm)
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      Duas etiquetas por linha - esquerda (x=0mm) e direita (x=40mm)
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade de etiquetas
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantidade}
                  onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {printerType === 'catech' && layoutType === 'double' && (
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.ceil(quantidade / 2)} linha(s) de impressão (2 etiquetas por linha)
                  </p>
                )}
              </div>

              {/* Configurações Rápidas */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Configurações Rápidas</h4>
                  <button
                    onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showAdvancedSettings ? 'Ocultar' : 'Mostrar'} Avançadas
                  </button>
                </div>
                
                <div className="space-y-3">
                  {/* Formato de Comando */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Formato de Comando
                    </label>
                    <select
                      value={tempConfig.formatoEtiqueta || 'ZPL'}
                      onChange={(e) => updateTempConfig('formatoEtiqueta', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ZPL">ZPL (Zebra) - Recomendado ⭐</option>
                      <option value="TSPL">TSPL (TSC) - Compatível</option>
                      <option value="EPL">EPL (Eltron)</option>
                    </select>
                  </div>

                  {/* Opções de Conteúdo */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="incluirLogo"
                        checked={tempConfig.incluirLogo || false}
                        onChange={(e) => updateTempConfig('incluirLogo', e.target.checked)}
                        className={clsx(
                          "w-4 h-4 rounded focus:ring-2",
                          tempConfig.incluirLogo 
                            ? "text-green-600 bg-green-100 border-green-300 focus:ring-green-500" 
                            : "text-gray-700 bg-gray-100 border-gray-600 focus:ring-gray-500"
                        )}
                      />
                      <label htmlFor="incluirLogo" className="text-xs font-medium text-gray-700">
                        Logo da empresa
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="incluirCodigoBarras"
                        checked={tempConfig.incluirCodigoBarras || false}
                        onChange={(e) => updateTempConfig('incluirCodigoBarras', e.target.checked)}
                        className={clsx(
                          "w-4 h-4 rounded focus:ring-2",
                          tempConfig.incluirCodigoBarras 
                            ? "text-green-600 bg-green-100 border-green-300 focus:ring-green-500" 
                            : "text-gray-700 bg-gray-100 border-gray-600 focus:ring-gray-500"
                        )}
                      />
                      <label htmlFor="incluirCodigoBarras" className="text-xs font-medium text-gray-700">
                        Código de barras
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="incluirPreco"
                        checked={tempConfig.incluirPreco || false}
                        onChange={(e) => updateTempConfig('incluirPreco', e.target.checked)}
                        className={clsx(
                          "w-4 h-4 rounded focus:ring-2",
                          tempConfig.incluirPreco 
                            ? "text-green-600 bg-green-100 border-green-300 focus:ring-green-500" 
                            : "text-gray-700 bg-gray-100 border-gray-600 focus:ring-gray-500"
                        )}
                      />
                      <label htmlFor="incluirPreco" className="text-xs font-medium text-gray-700">
                        Preço
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="incluirTamanho"
                        checked={tempConfig.incluirTamanho || false}
                        onChange={(e) => updateTempConfig('incluirTamanho', e.target.checked)}
                        className={clsx(
                          "w-4 h-4 rounded focus:ring-2",
                          tempConfig.incluirTamanho 
                            ? "text-green-600 bg-green-100 border-green-300 focus:ring-green-500" 
                            : "text-gray-700 bg-gray-100 border-gray-600 focus:ring-gray-500"
                        )}
                      />
                      <label htmlFor="incluirTamanho" className="text-xs font-medium text-gray-700">
                        Tamanho/Cor
                      </label>
                    </div>
                  </div>

                  {/* Configurações Avançadas */}
                  {showAdvancedSettings && (
                    <div className="space-y-3 pt-3 border-t border-gray-200">
                      {/* Tamanho e Layout da Etiqueta */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Tamanho da Etiqueta
                          </label>
                          <select
                            value={tempConfig.tamanhoEtiqueta || '80x30mm'}
                            onChange={(e) => updateTempConfig('tamanhoEtiqueta', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="80x30mm">80x30mm (Dupla - 2x40x30mm) ⭐</option>
                            <option value="54x35mm">54x35mm (C3Tech IT-200)</option>
                            <option value="50x30mm">50x30mm</option>
                            <option value="60x40mm">60x40mm</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Layout da Etiqueta
                          </label>
                          <select
                            value={tempConfig.layoutEtiqueta || 'dupla'}
                            onChange={(e) => updateTempConfig('layoutEtiqueta', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="dupla">Dupla (2 etiquetas/linha) ⭐</option>
                            <option value="simples">Simples (1 etiqueta/linha)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Tamanho
                          </label>
                          <select
                            value={tempConfig.tamanhoEtiqueta || '54x35mm'}
                            onChange={(e) => updateTempConfig('tamanhoEtiqueta', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="54x35mm">54x35mm</option>
                            <option value="50x30mm">50x30mm</option>
                            <option value="60x40mm">60x40mm</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Densidade
                          </label>
                          <select
                            value={tempConfig.densidadeEtiqueta || 8}
                            onChange={(e) => updateTempConfig('densidadeEtiqueta', parseInt(e.target.value))}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="6">6 (Baixa)</option>
                            <option value="8">8 (Média)</option>
                            <option value="10">10 (Alta)</option>
                            <option value="12">12 (Muito Alta)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Label Configuration Summary */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Configuração Atual</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-blue-600">
                  <span>Formato: {tempConfig.formatoEtiqueta || 'ZPL'}</span>
                  <span>Impressora: {printerType === 'catech' ? 'C3Tech IT-200' : printerType === 'browser' ? 'Navegador/PDF' : 'Padrão'}</span>
                  <span>Layout: {tempConfig.layoutEtiqueta === 'dupla' ? 'Dupla (2x40x30mm)' : tempConfig.layoutEtiqueta === 'simples' ? 'Simples' : printerType === 'catech' && layoutType === 'double' ? 'Dupla (2x54mm)' : 'Simples'}</span>
                  <span>Tamanho: {tempConfig.tamanhoEtiqueta || '80x30mm'}</span>
                  <span>Densidade: {tempConfig.densidadeEtiqueta || 8}</span>
                  <span>Quantidade: {quantidade}</span>
                  {(tempConfig.layoutEtiqueta === 'dupla' || (printerType === 'catech' && layoutType === 'double')) && (
                    <span>Linhas: {Math.ceil(quantidade / 2)}</span>
                  )}
                </div>
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <div className="flex items-center gap-4 text-xs text-blue-600">
                    <span>Logo: {tempConfig.incluirLogo ? '✓' : '✗'}</span>
                    <span>Código: {tempConfig.incluirCodigoBarras ? '✓' : '✗'}</span>
                    <span>Preço: {tempConfig.incluirPreco ? '✓' : '✗'}</span>
                    <span>Tamanho: {tempConfig.incluirTamanho ? '✓' : '✗'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            {previewMode && labelPreview && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-800">Preview da Etiqueta</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCopyPreview}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copiar código"
                    >
                      <FiCopy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleDownloadPreview}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Baixar preview"
                    >
                      <FiDownload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div 
                  className="border border-gray-200 rounded-lg p-4 bg-white max-h-60 overflow-auto"
                  dangerouslySetInnerHTML={{ __html: labelPreview }}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handlePreview}
              disabled={loading || !produto}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiEye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handlePrint}
                disabled={loading || !produto || printerStatus === 'error'}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiPrinter className="w-4 h-4" />
                <span>
                  {loading ? 'Imprimindo...' : `Imprimir ${quantidade > 1 ? `(${quantidade})` : ''}`}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LabelPrintModal;