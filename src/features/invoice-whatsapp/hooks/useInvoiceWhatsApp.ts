/**
 * TORQ Invoice WhatsApp - Hook
 * Hook para envio de NF via WhatsApp
 */

import { useState, useCallback } from 'react';
import { invoiceWhatsAppService } from '../services/invoiceWhatsAppService';
import type {
  InvoiceMessage,
  InvoiceData,
  WhatsAppTemplate,
  SendInvoiceRequest,
  SendInvoiceResult,
  InvoiceWhatsAppStats,
  MessageStatus,
} from '../types';

interface UseInvoiceWhatsAppReturn {
  // Estado
  messages: InvoiceMessage[];
  templates: WhatsAppTemplate[];
  stats: InvoiceWhatsAppStats | null;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  
  // Ações
  sendInvoice: (
    request: SendInvoiceRequest,
    invoice: InvoiceData,
    empresaId: string,
    userId: string
  ) => Promise<SendInvoiceResult>;
  
  loadMessages: (
    empresaId: string,
    options?: { invoiceId?: string; status?: MessageStatus; limit?: number }
  ) => Promise<void>;
  
  loadTemplates: (empresaId: string) => Promise<void>;
  
  loadStats: (empresaId: string, days?: number) => Promise<void>;
  
  saveTemplate: (
    template: Omit<WhatsAppTemplate, 'id'>,
    templateId?: string
  ) => Promise<string | null>;
  
  initializeTemplates: (empresaId: string) => Promise<void>;
  
  clearData: () => void;
}

export function useInvoiceWhatsApp(): UseInvoiceWhatsAppReturn {
  const [messages, setMessages] = useState<InvoiceMessage[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [stats, setStats] = useState<InvoiceWhatsAppStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendInvoice = useCallback(async (
    request: SendInvoiceRequest,
    invoice: InvoiceData,
    empresaId: string,
    userId: string
  ): Promise<SendInvoiceResult> => {
    setIsSending(true);
    setError(null);

    try {
      const result = await invoiceWhatsAppService.sendInvoice(
        request,
        invoice,
        empresaId,
        userId
      );

      if (!result.success) {
        setError(result.error || 'Erro ao enviar mensagem');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar mensagem';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSending(false);
    }
  }, []);

  const loadMessages = useCallback(async (
    empresaId: string,
    options?: { invoiceId?: string; status?: MessageStatus; limit?: number }
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const messageList = await invoiceWhatsAppService.getMessageHistory(empresaId, options);
      setMessages(messageList);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar mensagens';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadTemplates = useCallback(async (empresaId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const templateList = await invoiceWhatsAppService.getTemplates(empresaId);
      setTemplates(templateList);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar templates';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadStats = useCallback(async (empresaId: string, days: number = 30) => {
    setIsLoading(true);
    setError(null);

    try {
      const statsData = await invoiceWhatsAppService.getStats(empresaId, days);
      setStats(statsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar estatísticas';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveTemplate = useCallback(async (
    template: Omit<WhatsAppTemplate, 'id'>,
    templateId?: string
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const id = await invoiceWhatsAppService.saveTemplate(template, templateId);
      
      // Atualizar lista local
      if (templateId) {
        setTemplates(prev => prev.map(t => 
          t.id === templateId ? { ...t, ...template } : t
        ));
      } else {
        setTemplates(prev => [...prev, { id, ...template } as WhatsAppTemplate]);
      }
      
      return id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar template';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initializeTemplates = useCallback(async (empresaId: string) => {
    try {
      await invoiceWhatsAppService.initializeDefaultTemplates(empresaId);
      await loadTemplates(empresaId);
    } catch (err) {
      console.warn('Erro ao inicializar templates:', err);
    }
  }, [loadTemplates]);

  const clearData = useCallback(() => {
    setMessages([]);
    setTemplates([]);
    setStats(null);
    setError(null);
  }, []);

  return {
    messages,
    templates,
    stats,
    isLoading,
    isSending,
    error,
    sendInvoice,
    loadMessages,
    loadTemplates,
    loadStats,
    saveTemplate,
    initializeTemplates,
    clearData,
  };
}

export default useInvoiceWhatsApp;
