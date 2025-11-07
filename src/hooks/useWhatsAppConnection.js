/**
 * Hook para gerenciar conexão WhatsApp
 * Fornece estado e funções para interagir com a API WhatsApp
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_WHATSAPP_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function useWhatsAppConnection() {
  const { user } = useAuthStore();
  const empresaId = user?.organizationId || user?.cpfCnpj || user?.uid;

  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState('unknown'); // unknown, connected, disconnected, qr_ready, loading
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [qrCode, setQrCode] = useState(null);

  // Verificar status inicial
  useEffect(() => {
    if (!empresaId) return;

    checkStatus();
  }, [empresaId]);

  const checkStatus = useCallback(async () => {
    if (!empresaId) return;

    try {
      const response = await fetch(`${API_URL}/api/whatsapp/status`);
      const data = await response.json();

      setStatus(data.connected ? 'connected' : 'disconnected');
      setIsConnected(data.connected);
      setPhoneNumber(data.user_data?.phone || null);
    } catch (error) {
      console.error('[WhatsApp Hook] Erro ao verificar status:', error);
      setStatus('disconnected');
      setIsConnected(false);
    }
  }, [empresaId]);

  const connect = useCallback(async () => {
    if (!empresaId) return { success: false, message: 'Empresa não identificada' };

    try {
      setStatus('loading');
      
      const response = await fetch(`${API_URL}/api/whatsapp/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.status === 'already_authenticated') {
        setStatus('connected');
        setIsConnected(true);
        setPhoneNumber(data.user_data?.phone);
      } else if (data.status === 'waiting_qr' && data.qr_code) {
        setStatus('qr_ready');
        setQrCode(data.qr_code);
      }

      return { success: true, ...data };
    } catch (error) {
      console.error('[WhatsApp Hook] Erro ao conectar:', error);
      setStatus('error');
      return { success: false, message: error.message };
    }
  }, [empresaId]);

  const disconnect = useCallback(async () => {
    if (!empresaId) return { success: false, message: 'Empresa não identificada' };

    try {
      const response = await fetch(`${API_URL}/api/whatsapp/disconnect`, {
        method: 'POST'
      });

      const data = await response.json();

      if (data.success) {
        setStatus('disconnected');
        setIsConnected(false);
        setPhoneNumber(null);
        setQrCode(null);
      }

      return data;
    } catch (error) {
      console.error('[WhatsApp Hook] Erro ao desconectar:', error);
      return { success: false, message: error.message };
    }
  }, [empresaId]);

  const sendMessage = useCallback(async (phoneNumber, message) => {
    if (!empresaId) return { success: false, message: 'Empresa não identificada' };
    if (!isConnected) return { success: false, message: 'WhatsApp não está conectado' };

    try {
      const response = await fetch(`${API_URL}/api/whatsapp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone_number: phoneNumber, message })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[WhatsApp Hook] Erro ao enviar mensagem:', error);
      return { success: false, message: error.message };
    }
  }, [empresaId, isConnected]);

  return {
    isConnected,
    status,
    phoneNumber,
    qrCode,
    connect,
    disconnect,
    sendMessage,
    checkStatus
  };
}
