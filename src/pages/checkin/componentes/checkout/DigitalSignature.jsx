/**
 * DigitalSignature Component
 * Captura de assinatura digital do cliente
 * Suporte para mouse, touch e stylus
 */

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pen, RotateCcw, Check, X } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../config/firebase';
import toast from 'react-hot-toast';

const DigitalSignature = ({ 
  onSignatureCapture, 
  checkinId,
  existingSignature = null 
}) => {
  const signatureRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState(existingSignature);

  useEffect(() => {
    if (existingSignature) {
      setSignatureUrl(existingSignature);
      setIsEmpty(false);
    }
  }, [existingSignature]);

  // Detectar quando o usuário começa a assinar
  const handleBegin = () => {
    setIsEmpty(false);
  };

  // Limpar assinatura
  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setIsEmpty(true);
      setSignatureUrl(null);
      onSignatureCapture?.(null);
    }
  };

  // Confirmar e fazer upload da assinatura
  const handleConfirm = async () => {
    if (isEmpty || !signatureRef.current) {
      toast.error('Por favor, assine antes de confirmar');
      return;
    }

    setIsUploading(true);

    try {
      // Converter canvas para data URL
      const dataUrl = signatureRef.current.toDataURL('image/png');

      // Se tem checkinId, fazer upload para Firebase
      if (checkinId) {
        const storageRef = ref(storage, `checkins/${checkinId}/signature.png`);
        await uploadString(storageRef, dataUrl, 'data_url');
        const downloadUrl = await getDownloadURL(storageRef);
        
        setSignatureUrl(downloadUrl);
        onSignatureCapture?.(downloadUrl);
        
        toast.success('Assinatura capturada com sucesso!', {
          icon: '✍️',
          style: {
            background: '#10B981',
            color: '#FFFFFF',
            borderRadius: '12px',
          },
        });
      } else {
        // Sem checkinId, retorna data URL temporária
        setSignatureUrl(dataUrl);
        onSignatureCapture?.(dataUrl);
      }
    } catch (error) {
      console.error('Erro ao salvar assinatura:', error);
      toast.error('Erro ao salvar assinatura. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pen className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Assinatura do Cliente
          </h4>
        </div>

        {signatureUrl && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Assinado
            </span>
          </div>
        )}
      </div>

      {/* Canvas de Assinatura */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden">
          {signatureUrl ? (
            // Preview da assinatura capturada
            <div className="relative aspect-[2/1] flex items-center justify-center">
              <img
                src={signatureUrl}
                alt="Assinatura do cliente"
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={handleClear}
                className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            // Canvas para assinar
            <>
              <SignatureCanvas
                ref={signatureRef}
                onBegin={handleBegin}
                canvasProps={{
                  className: 'w-full h-full cursor-crosshair',
                  style: { 
                    width: '100%', 
                    height: '200px',
                    touchAction: 'none'
                  }
                }}
                backgroundColor="transparent"
                penColor={document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#000000'}
              />
              
              {/* Placeholder text */}
              {isEmpty && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-gray-400 dark:text-gray-500 text-sm">
                    Assine aqui com mouse, touch ou caneta
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Botões de ação */}
        {!signatureUrl && (
          <div className="flex gap-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClear}
              disabled={isEmpty}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                isEmpty
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              Limpar
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirm}
              disabled={isEmpty || isUploading}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                isEmpty || isUploading
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/30'
              }`}
            >
              {isUploading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </motion.div>
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Confirmar
                </>
              )}
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Instruções */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        A assinatura será anexada ao relatório de serviço
      </p>
    </div>
  );
};

export default DigitalSignature;
