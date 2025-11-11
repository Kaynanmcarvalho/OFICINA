/**
 * Modal de Conexão WhatsApp
 * Interface premium para conectar WhatsApp via QR Code
 * Suporta tema claro/escuro e feedback em tempo real
 */

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, Smartphone, CheckCircle, AlertCircle, Loader2, LogOut, Trash2 } from 'lucide-react';

import { whatsappService } from '../../services/whatsappService';
import ConfirmDialog from '../ConfirmDialog';

export default function WhatsAppConnectionModal({ isOpen, onClose }) {
  

  const [status, setStatus] = useState('idle'); // idle, loading, qr_ready, connected, error
  const [qrCode, setQrCode] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

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

      console.log('[WhatsApp Modal] Status recebido:', data);

      // CORREÇÃO: Só mostrar como conectado se REALMENTE está conectado
      // Não considerar sessão salva como conectado
      if (data.status === 'connected') {
        setStatus('connected');
        setPhoneNumber(data.phoneNumber);
      } else {
        // Se não está conectado, mostrar idle para gerar novo QR Code
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
      
      // Tratamento específico para timeout
      if (error.code === 'TIMEOUT' || error.message.includes('TIMEOUT') || error.message.includes('Timeout')) {
        setStatus('error');
        setErrorMessage('Timeout ao conectar. A sessão pode estar corrompida. Clique em "Limpar Sessão Corrompida" abaixo.');
      } else {
        setStatus('error');
        setErrorMessage(error.message || 'Erro ao conectar com o servidor');
      }
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
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

  const handleClearSession = () => {
    setShowClearConfirm(true);
  };

  const confirmClearSession = async () => {
    try {
      setStatus('loading');
      setErrorMessage(null);
      
      // Desconectar para limpar a sessão
      await whatsappService.disconnect();
      
      // Aguardar um pouco
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Tentar conectar novamente
      await handleConnect();
    } catch (error) {
      console.error('[WhatsApp Modal] Erro ao limpar sessão:', error);
      setStatus('error');
      setErrorMessage('Erro ao limpar sessão');
    }
  };

  const handleClose = () => {
    setQrCode(null);
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
      <div key="whatsapp-modal" className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <div
          key="backdrop"
          onClick={handleClose}
          className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md"
        />

        {/* Modal */}
        <div
          className="relative w-full max-w-3xl xl:max-w-4xl 2xl:max-w-5xl max-h-[85vh] bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700/50 flex flex-col"
        >
          {/* Header */}
          <div className="relative px-6 py-5 border-b border-gray-200 dark:border-gray-700/50 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/30 dark:from-gray-800/30 dark:via-gray-800/20 dark:to-gray-800/10">
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 hover:bg-gray-200 dark:hover:bg-gray-700/60 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 group shadow-sm hover:shadow-md"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 flex items-center justify-center shadow-lg shadow-green-500/30">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  WhatsApp Business
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Conecte sua conta
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            {/* Status: Idle */}
            {status === 'idle' && (
              <div className="text-center space-y-5">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 dark:from-green-500/20 dark:to-emerald-500/20 flex items-center justify-center shadow-lg shadow-green-500/10">
                  <Smartphone className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Conectar WhatsApp
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed px-4">
                    Conecte sua conta do WhatsApp para enviar orçamentos e mensagens automaticamente aos seus clientes.
                  </p>
                </div>
                <button
                  onClick={handleConnect}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 hover:from-green-600 hover:via-emerald-700 hover:to-teal-700 text-white rounded-2xl font-semibold transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Conectar WhatsApp
                </button>
              </div>
            )}

            {/* Status: Loading */}
            {status === 'loading' && (
              <div className="text-center space-y-5 py-8">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-green-600 dark:text-green-400 animate-spin" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
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
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                  Escaneie o QR Code
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                  {/* QR Code */}
                  <div className="flex justify-center">
                    <div className="relative inline-block">
                      <div className="absolute -inset-3 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl" />
                      <div className="relative bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-2xl border-4 border-white dark:border-gray-700">
                        <img src={qrCode} alt="QR Code" className="w-48 h-48 xl:w-56 xl:h-56 2xl:w-64 2xl:h-64" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Instruções */}
                  <div className="space-y-3">
                    <div className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 dark:from-blue-900/20 dark:to-indigo-900/10 rounded-2xl p-4 border border-blue-100 dark:border-blue-800/50">
                      <ol className="text-xs xl:text-sm space-y-2 xl:space-y-2.5 text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                          <span>Abra o <strong>WhatsApp</strong> no celular</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                          <span>Toque em <strong>Menu</strong> ou <strong>Configurações</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                          <span>Toque em <strong>Aparelhos conectados</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold">4</span>
                          <span>Toque em <strong>Conectar um aparelho</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold">5</span>
                          <span>Aponte a câmera para o QR Code</span>
                        </li>
                      </ol>
                    </div>
                  </div>
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
              <div className="text-center space-y-5">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 animate-pulse" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    WhatsApp Conectado!
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Sua conta está conectada e pronta para uso
                  </p>
                  {phoneNumber && (
                    <div className="inline-block px-4 py-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-xl border border-green-200 dark:border-green-800/50">
                      <p className="text-sm font-mono font-semibold text-green-700 dark:text-green-300">
                        +{phoneNumber}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-semibold transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <LogOut className="w-4 h-4" />
                    Desconectar
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-2xl font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}

            {/* Status: Error */}
            {status === 'error' && (
              <div className="text-center space-y-5">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-red-500/10 via-orange-500/10 to-red-500/10 dark:from-red-500/20 dark:to-orange-500/20 flex items-center justify-center shadow-lg shadow-red-500/10">
                  <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Erro na Conexão
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed px-4">
                    {errorMessage || 'Ocorreu um erro ao conectar. Tente novamente.'}
                  </p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleConnect}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 hover:from-green-600 hover:via-emerald-700 hover:to-teal-700 text-white rounded-2xl font-semibold transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Tentar Novamente
                  </button>
                  {errorMessage && errorMessage.includes('Timeout') && (
                    <button
                      onClick={handleClearSession}
                      className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-2xl font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Limpar Sessão Corrompida
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Confirm Dialog - Desconectar */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="Desconectar WhatsApp?"
        message="Tem certeza que deseja desconectar o WhatsApp? Você precisará escanear o QR Code novamente."
        confirmText="Sim, Desconectar"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Confirm Dialog - Limpar Sessão */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={confirmClearSession}
        title="Limpar Sessão Corrompida?"
        message="Isso irá remover a sessão atual e você precisará conectar novamente. Deseja continuar?"
        confirmText="Sim, Limpar"
        cancelText="Cancelar"
        type="warning"
      />
    </AnimatePresence>
  );
}
