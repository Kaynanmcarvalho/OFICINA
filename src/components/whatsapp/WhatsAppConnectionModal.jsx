/**
 * Modal de Conexão WhatsApp
 * Interface premium para conectar WhatsApp via QR Code
 * Suporta tema claro/escuro e feedback em tempo real
 */

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, Smartphone, CheckCircle, AlertCircle, Loader2, LogOut } from 'lucide-react';

import { whatsappService } from '../../services/whatsappService';

export default function WhatsAppConnectionModal({ isOpen, onClose }) {
  

  const [status, setStatus] = useState('idle'); // idle, loading, qr_ready, connected, error
  const [qrCode, setQrCode] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Polling para verificar autenticação após QR Code
  useEffect(() => {
    if (status !== 'qr_ready') return;

    const interval = setInterval(async () => {
      try {
        // Usar whatsappService que já tem a lógica correta de empresaId
        const data = await whatsappService.getStatus();

        if (data.status === 'connected') {
          setStatus('connected');
          setPhoneNumber(data.phoneNumber);
          setQrCode(null);
          clearInterval(interval);
        }
      } catch (error) {
        console.error('[WhatsApp Modal] Erro ao verificar autenticação:', error);
      }
    }, 2000); // Verificar a cada 2 segundos

    return () => clearInterval(interval);
  }, [status]);

  // Verificar status ao abrir
  useEffect(() => {
    if (!isOpen) return;

    checkStatus();
  }, [isOpen]);

  const checkStatus = async () => {
    try {
      setStatus('loading');
      
      // Usar whatsappService que já tem a lógica correta de empresaId
      const data = await whatsappService.getStatus();

      if (data.status === 'connected') {
        setStatus('connected');
        setPhoneNumber(data.phoneNumber);
      } else {
        setStatus('idle');
      }
    } catch (error) {
      console.error('[WhatsApp Modal] Erro ao verificar status:', error);
      setStatus('idle');
    }
  };

  const handleConnect = async () => {
    try {
      setStatus('loading');
      setErrorMessage(null);
      
      console.log('[WhatsApp Modal] Iniciando conexão...');
      
      // Usar whatsappService que já tem a lógica correta de empresaId
      const data = await whatsappService.connect();

      console.log('[WhatsApp Modal] Dados recebidos:', data);
      console.log('[WhatsApp Modal] Status:', data.status);
      console.log('[WhatsApp Modal] QR existe?', !!data.qr);

      if (data.status === 'connected') {
        console.log('[WhatsApp Modal] ✅ Já conectado');
        setStatus('connected');
        setPhoneNumber(data.phoneNumber);
      } else if (data.status === 'qr_ready' && data.qr) {
        console.log('[WhatsApp Modal] ✅ QR Code recebido');
        setStatus('qr_ready');
        setQrCode(data.qr);
      } else {
        console.log('[WhatsApp Modal] ❌ Status inesperado:', data);
        setStatus('error');
        setErrorMessage('Erro ao conectar');
      }
    } catch (error) {
      console.error('[WhatsApp Modal] ❌ Erro ao conectar:', error);
      setStatus('error');
      setErrorMessage('Erro ao conectar com o servidor');
    }
  };

  const handleLogout = async () => {
    if (!confirm('Deseja realmente desconectar o WhatsApp?')) return;

    try {
      setStatus('loading');
      
      // Usar whatsappService que já tem a lógica correta de empresaId
      await whatsappService.disconnect();

      setStatus('idle');
      setPhoneNumber(null);
      setQrCode(null);
    } catch (error) {
      console.error('[WhatsApp Modal] Erro ao desconectar:', error);
      setStatus('error');
      setErrorMessage('Erro ao desconectar');
    }
  };

  const handleClose = () => {
    setQrCode(null);
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <div
          className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  WhatsApp Business
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Conecte sua conta
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Status: Idle */}
            {status === 'idle' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Conectar WhatsApp
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Conecte sua conta do WhatsApp para enviar orçamentos e mensagens automaticamente.
                  </p>
                </div>
                <button
                  onClick={handleConnect}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
                >
                  Conectar WhatsApp
                </button>
              </div>
            )}

            {/* Status: Loading */}
            {status === 'loading' && (
              <div className="text-center space-y-4 py-8">
                <Loader2 className="w-12 h-12 mx-auto text-green-600 dark:text-green-400 animate-spin" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Conectando...
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Aguarde enquanto preparamos a conexão
                  </p>
                </div>
              </div>
            )}

            {/* Status: QR Ready */}
            {status === 'qr_ready' && qrCode && (
              <div className="text-center space-y-4">
                <div className="bg-white p-4 rounded-xl inline-block">
                  <img src={qrCode} alt="QR Code" className="w-64 h-64" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Escaneie o QR Code
                  </h3>
                  <ol className="text-sm text-gray-600 dark:text-gray-400 text-left space-y-2">
                    <li>1. Abra o WhatsApp no seu celular</li>
                    <li>2. Toque em <strong>Menu</strong> ou <strong>Configurações</strong></li>
                    <li>3. Toque em <strong>Aparelhos conectados</strong></li>
                    <li>4. Toque em <strong>Conectar um aparelho</strong></li>
                    <li>5. Aponte seu celular para esta tela para escanear o código</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Status: Authenticated */}
            {status === 'authenticated' && (
              <div className="text-center space-y-4 py-8">
                <Loader2 className="w-12 h-12 mx-auto text-green-600 dark:text-green-400 animate-spin" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Autenticando...
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Finalizando a conexão
                  </p>
                </div>
              </div>
            )}

            {/* Status: Connected */}
            {status === 'connected' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    WhatsApp Conectado!
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sua conta está conectada e pronta para uso
                  </p>
                  {phoneNumber && (
                    <p className="text-sm font-mono text-green-600 dark:text-green-400 mt-2">
                      +{phoneNumber}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Desconectar
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}

            {/* Status: Error */}
            {status === 'error' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Erro na Conexão
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {errorMessage || 'Ocorreu um erro ao conectar. Tente novamente.'}
                  </p>
                </div>
                <button
                  onClick={handleConnect}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
