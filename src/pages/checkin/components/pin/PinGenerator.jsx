import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Printer, Share2, Lock } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const PinGenerator = ({ pin, checkinId, vehicleInfo, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>PIN de Retirada - ${vehicleInfo?.plate || ''}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              text-align: center;
            }
            .pin-container {
              border: 2px dashed #F28C1D;
              padding: 30px;
              margin: 20px auto;
              max-width: 400px;
              border-radius: 10px;
            }
            .pin {
              font-size: 48px;
              font-weight: bold;
              letter-spacing: 10px;
              color: #F28C1D;
              margin: 20px 0;
            }
            .info {
              margin: 10px 0;
              color: #666;
            }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>🔐 PIN de Retirada</h1>
          <div class="pin-container">
            <div class="pin">${pin}</div>
            <div class="info">
              <p><strong>Veículo:</strong> ${vehicleInfo?.brand || ''} ${vehicleInfo?.model || ''}</p>
              <p><strong>Placa:</strong> ${vehicleInfo?.plate || ''}</p>
              <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
              Guarde este PIN com segurança. Ele será necessário para retirar o veículo.
            </p>
          </div>
          <button onclick="window.print()" style="
            background: #F28C1D;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
          ">Imprimir</button>
        </body>
      </html>

    printWindow.document.close();
  };

  const handleShare = async () => {
    const text = `PIN de Retirada: ${pin}\nVeículo: ${vehicleInfo?.brand} ${vehicleInfo?.model}\nPlaca: ${vehicleInfo?.plate}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PIN de Retirada',
          text: text
        });
      } catch (err) {
        }
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8" animate={false}>
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30"
            >
              <Lock className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Check-in Realizado!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Guarde este PIN para retirar o veículo
            </p>
          </div>

          {/* PIN Display */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative mb-8"
          >
            <div className="border-2 border-dashed border-orange-500 dark:border-orange-400 rounded-2xl p-8 bg-orange-50 dark:bg-orange-900/20">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 text-center">
                PIN de Retirada
              </p>
              <div className="text-6xl font-bold text-orange-600 dark:text-orange-400 text-center tracking-[0.5em] font-mono">
                {pin}
              </div>
            </div>
          </motion.div>

          {/* Vehicle Info */}
          {vehicleInfo && (
            <div className="mb-6 p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                <strong>Veículo:</strong> {vehicleInfo.brand} {vehicleInfo.model}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Placa:</strong> {vehicleInfo.plate}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              onClick={handleCopy}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {copied ? 'Copiado!' : 'Copiar'}
              </span>
            </button>

            <button
              onClick={handlePrint}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Printer className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Imprimir
              </span>
            </button>

            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Compartilhar
              </span>
            </button>
          </div>

          {/* Warning */}
          <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 mb-6">
            <p className="text-xs text-yellow-800 dark:text-yellow-200 text-center">
              ⚠️ Este PIN será necessário para autorizar a retirada do veículo. Guarde-o com segurança!
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
          >
            Entendi
          </button>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default PinGenerator;
