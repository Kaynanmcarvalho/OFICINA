import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, CheckCircle, XCircle, Smartphone } from 'lucide-react';
import { useWhatsAppConnection } from '../hooks/useWhatsAppConnection';

export default function WhatsAppQRConnector() {
  const {
    isConnected,
    qrCode,
    loading,
    status,
    error,
    connectionInfo,
    expiresIn,
    connect,
    disconnect,
    refreshQR
  } = useWhatsAppConnection();

  // Iniciar conexão ao montar
  useEffect(() => {
    if (!isConnected && status === 'loading') {
      connect();
    }
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {/* Loading State */}
        {status === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <Loader2 className="w-16 h-16 text-green-500 animate-spin mb-4" />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Carregando...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Preparando QR Code
            </p>
          </motion.div>
        )}

        {/* QR Code Ready */}
        {status === 'qr-ready' && qrCode && (
          <motion.div
            key="qr-ready"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center"
          >
            {/* QR Code */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 mb-6">
              <img 
                src={qrCode} 
                alt="QR Code WhatsApp" 
                className="w-64 h-64 md:w-80 md:h-80"
              />
            </div>

            {/* Instruções */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Smartphone className="w-5 h-5 text-green-500" />
                <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                  Abra o WhatsApp no celular
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Toque em <strong>Mais opções</strong> → <strong>Aparelhos conectados</strong> → <strong>Conectar um aparelho</strong>
              </p>
            </div>

            {/* Timer */}
            <div className="mb-4">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                expiresIn <= 10 
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' 
                  : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              }`}>
                ⏱️ Expira em: {expiresIn}s
              </div>
            </div>

            {/* Botão Recarregar */}
            <button
              onClick={refreshQR}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Recarregar QR Code
            </button>
          </motion.div>
        )}

        {/* Connecting */}
        {status === 'connecting' && (
          <motion.div
            key="connecting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <Loader2 className="w-16 h-16 text-green-500 animate-spin mb-4" />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Conectando...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Aguarde enquanto conectamos sua conta
            </p>
          </motion.div>
        )}

        {/* Connected */}
        {status === 'connected' && isConnected && (
          <motion.div
            key="connected"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Conectado!
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              WhatsApp conectado com sucesso
            </p>

            {connectionInfo && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  📞 {connectionInfo.wid?.user || 'Número não disponível'}
                </p>
                {connectionInfo.pushname && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    👤 {connectionInfo.pushname}
                  </p>
                )}
              </div>
            )}

            <button
              onClick={disconnect}
              className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              Desconectar
            </button>
          </motion.div>
        )}

        {/* Expired */}
        {status === 'expired' && (
          <motion.div
            key="expired"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="w-8 h-8 text-orange-500" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              QR Code Expirado
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
              O QR Code expirou. Clique no botão abaixo para gerar um novo.
            </p>

            <button
              onClick={refreshQR}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Gerar Novo QR Code
            </button>
          </motion.div>
        )}

        {/* Error */}
        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Erro na Conexão
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
              {error || 'Não foi possível conectar ao WhatsApp. Tente novamente.'}
            </p>

            <button
              onClick={refreshQR}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Tentar Novamente
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

}
