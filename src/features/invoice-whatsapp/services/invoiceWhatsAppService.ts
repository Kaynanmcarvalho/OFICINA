/**
 * TORQ Invoice WhatsApp Service
 * Serviço para envio de NF via WhatsApp
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type {
  InvoiceMessage,
  InvoiceData,
  WhatsAppTemplate,
  SendInvoiceRequest,
  SendInvoiceResult,
  InvoiceWhatsAppStats,
  MessageStatus,
  MessageType,
} from '../types';
import { DEFAULT_TEMPLATES } from '../types';

class InvoiceWhatsAppService {
  private messagesCollection = 'invoice_messages';
  private templatesCollection = 'whatsapp_templates';

  /**
   * Envia nota fiscal via WhatsApp
   */
  async sendInvoice(
    request: SendInvoiceRequest,
    invoice: InvoiceData,
    empresaId: string,
    userId: string
  ): Promise<SendInvoiceResult> {
    try {
      // Buscar template se especificado
      let messageContent = request.customMessage || '';
      
      if (request.templateId) {
        const template = await this.getTemplate(request.templateId);
        if (template) {
          messageContent = this.processTemplate(template.content, invoice);
        }
      } else if (!messageContent) {
        // Usar template padrão
        const defaultTemplate = DEFAULT_TEMPLATES.find(t => t.type === request.messageType);
        if (defaultTemplate) {
          messageContent = this.processTemplate(defaultTemplate.content, invoice);
        }
      }

      // Criar registro da mensagem
      const message: Omit<InvoiceMessage, 'id'> = {
        invoiceId: request.invoiceId,
        invoiceNumber: invoice.number,
        recipientPhone: this.formatPhoneNumber(request.recipientPhone),
        recipientName: invoice.clientName,
        messageType: request.messageType,
        messageContent,
        attachments: request.includeAttachments ? await this.getInvoiceAttachments(invoice) : [],
        status: 'pending',
        empresaId,
        createdAt: new Date(),
        createdBy: userId,
      };

      const docRef = await addDoc(collection(db, this.messagesCollection), {
        ...message,
        createdAt: Timestamp.now(),
      });

      // Enviar via API do WhatsApp
      const sendResult = await this.sendWhatsAppMessage(
        message.recipientPhone,
        messageContent,
        message.attachments
      );

      // Atualizar status
      const newStatus: MessageStatus = sendResult.success ? 'sent' : 'failed';
      await updateDoc(doc(db, this.messagesCollection, docRef.id), {
        status: newStatus,
        sentAt: sendResult.success ? Timestamp.now() : null,
        errorMessage: sendResult.error || null,
      });

      return {
        success: sendResult.success,
        messageId: docRef.id,
        error: sendResult.error,
        sentAt: sendResult.success ? new Date() : undefined,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar mensagem';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Envia mensagem via API do WhatsApp
   */
  private async sendWhatsAppMessage(
    phone: string,
    message: string,
    attachments: InvoiceMessage['attachments']
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Verificar se há servidor WhatsApp configurado
      const whatsappServerUrl = import.meta.env.VITE_WHATSAPP_SERVER_URL;
      
      if (!whatsappServerUrl) {
        console.warn('[InvoiceWhatsApp] Servidor WhatsApp não configurado, simulando envio');
        // Simular envio para desenvolvimento
        await this.delay(500);
        return { success: true };
      }

      // Enviar mensagem de texto
      const textResponse = await fetch(`${whatsappServerUrl}/api/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.replace(/\D/g, ''),
          message,
        }),
      });

      if (!textResponse.ok) {
        throw new Error('Falha ao enviar mensagem de texto');
      }

      // Enviar anexos
      for (const attachment of attachments) {
        if (attachment.type === 'pdf') {
          await fetch(`${whatsappServerUrl}/api/send-document`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone: phone.replace(/\D/g, ''),
              documentUrl: attachment.url,
              fileName: attachment.name,
            }),
          });
        }
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Busca histórico de mensagens de uma empresa
   */
  async getMessageHistory(
    empresaId: string,
    options?: {
      invoiceId?: string;
      status?: MessageStatus;
      limit?: number;
    }
  ): Promise<InvoiceMessage[]> {
    let q = query(
      collection(db, this.messagesCollection),
      where('empresaId', '==', empresaId),
      orderBy('createdAt', 'desc')
    );

    if (options?.limit) {
      q = query(q, limit(options.limit));
    }

    const snapshot = await getDocs(q);
    let messages = snapshot.docs.map(doc => this.convertMessageDoc(doc));

    // Filtros adicionais no cliente
    if (options?.invoiceId) {
      messages = messages.filter(m => m.invoiceId === options.invoiceId);
    }
    if (options?.status) {
      messages = messages.filter(m => m.status === options.status);
    }

    return messages;
  }

  /**
   * Busca templates de uma empresa
   */
  async getTemplates(empresaId: string): Promise<WhatsAppTemplate[]> {
    const q = query(
      collection(db, this.templatesCollection),
      where('empresaId', '==', empresaId),
      where('isActive', '==', true)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as WhatsAppTemplate[];
  }

  /**
   * Busca um template específico
   */
  async getTemplate(templateId: string): Promise<WhatsAppTemplate | null> {
    try {
      const docRef = doc(db, this.templatesCollection, templateId);
      const snapshot = await getDocs(query(collection(db, this.templatesCollection)));
      const templateDoc = snapshot.docs.find(d => d.id === templateId);
      
      if (!templateDoc) return null;
      
      return {
        id: templateDoc.id,
        ...templateDoc.data(),
      } as WhatsAppTemplate;
    } catch {
      return null;
    }
  }

  /**
   * Cria ou atualiza template
   */
  async saveTemplate(
    template: Omit<WhatsAppTemplate, 'id'>,
    templateId?: string
  ): Promise<string> {
    if (templateId) {
      await updateDoc(doc(db, this.templatesCollection, templateId), template);
      return templateId;
    }

    const docRef = await addDoc(collection(db, this.templatesCollection), template);
    return docRef.id;
  }

  /**
   * Inicializa templates padrão para uma empresa
   */
  async initializeDefaultTemplates(empresaId: string): Promise<void> {
    const existingTemplates = await this.getTemplates(empresaId);
    
    if (existingTemplates.length === 0) {
      for (const template of DEFAULT_TEMPLATES) {
        await this.saveTemplate({
          ...template,
          empresaId,
        });
      }
    }
  }

  /**
   * Calcula estatísticas de envio
   */
  async getStats(empresaId: string, days: number = 30): Promise<InvoiceWhatsAppStats> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const messages = await this.getMessageHistory(empresaId, { limit: 1000 });
    const recentMessages = messages.filter(m => new Date(m.createdAt) >= startDate);

    const stats: InvoiceWhatsAppStats = {
      totalSent: 0,
      totalDelivered: 0,
      totalRead: 0,
      totalFailed: 0,
      deliveryRate: 0,
      readRate: 0,
      averageDeliveryTime: 0,
    };

    let totalDeliveryTime = 0;
    let deliveryCount = 0;

    recentMessages.forEach(message => {
      if (message.status === 'sent' || message.status === 'delivered' || message.status === 'read') {
        stats.totalSent++;
      }
      if (message.status === 'delivered' || message.status === 'read') {
        stats.totalDelivered++;
        
        if (message.sentAt && message.deliveredAt) {
          totalDeliveryTime += (new Date(message.deliveredAt).getTime() - new Date(message.sentAt).getTime()) / 1000;
          deliveryCount++;
        }
      }
      if (message.status === 'read') {
        stats.totalRead++;
      }
      if (message.status === 'failed') {
        stats.totalFailed++;
      }
    });

    if (stats.totalSent > 0) {
      stats.deliveryRate = (stats.totalDelivered / stats.totalSent) * 100;
      stats.readRate = (stats.totalRead / stats.totalSent) * 100;
    }

    if (deliveryCount > 0) {
      stats.averageDeliveryTime = totalDeliveryTime / deliveryCount;
    }

    return stats;
  }

  /**
   * Atualiza status de uma mensagem (webhook)
   */
  async updateMessageStatus(
    messageId: string,
    status: MessageStatus,
    timestamp?: Date
  ): Promise<void> {
    const updates: Record<string, unknown> = { status };

    if (status === 'delivered' && timestamp) {
      updates.deliveredAt = Timestamp.fromDate(timestamp);
    }
    if (status === 'read' && timestamp) {
      updates.readAt = Timestamp.fromDate(timestamp);
    }

    await updateDoc(doc(db, this.messagesCollection, messageId), updates);
  }

  /**
   * Processa template substituindo variáveis
   */
  private processTemplate(template: string, invoice: InvoiceData): string {
    const variables: Record<string, string> = {
      clientName: invoice.clientName,
      invoiceNumber: invoice.number,
      totalValue: this.formatCurrency(invoice.totalValue),
      issueDate: this.formatDate(invoice.issueDate),
      dueDate: invoice.dueDate ? this.formatDate(invoice.dueDate) : '',
      vehiclePlate: invoice.vehiclePlate || '',
      services: invoice.items.map(i => `- ${i.description}`).join('\n'),
    };

    let result = template;

    // Substituir variáveis simples
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    // Processar condicionais simples
    result = result.replace(/{{#if (\w+)}}([\s\S]*?){{\/if}}/g, (_, key, content) => {
      return variables[key] ? content : '';
    });

    return result.trim();
  }

  /**
   * Obtém anexos da nota fiscal
   */
  private async getInvoiceAttachments(invoice: InvoiceData): Promise<InvoiceMessage['attachments']> {
    // Em produção, buscar URLs reais dos PDFs
    return [
      {
        id: `pdf-${invoice.id}`,
        type: 'pdf',
        name: `NF_${invoice.number}.pdf`,
        url: `https://storage.example.com/invoices/${invoice.id}.pdf`,
        size: 0,
      },
    ];
  }

  /**
   * Formata número de telefone
   */
  private formatPhoneNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    
    // Adicionar código do país se não tiver
    if (digits.length === 11) {
      return `55${digits}`;
    }
    if (digits.length === 10) {
      return `55${digits}`;
    }
    
    return digits;
  }

  /**
   * Formata valor monetário
   */
  private formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  /**
   * Formata data
   */
  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  /**
   * Delay para simulação
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Converte documento do Firestore
   */
  private convertMessageDoc(doc: any): InvoiceMessage {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      sentAt: data.sentAt?.toDate(),
      deliveredAt: data.deliveredAt?.toDate(),
      readAt: data.readAt?.toDate(),
    };
  }
}

export const invoiceWhatsAppService = new InvoiceWhatsAppService();
export default invoiceWhatsAppService;
