/**
 * TORQ Invoice WhatsApp - Types
 * Tipos para envio de NF via WhatsApp
 */

export interface InvoiceMessage {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  
  // Destinatário
  recipientPhone: string;
  recipientName: string;
  
  // Conteúdo
  messageType: MessageType;
  messageContent: string;
  attachments: InvoiceAttachment[];
  
  // Status
  status: MessageStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  errorMessage?: string;
  
  // Metadados
  empresaId: string;
  createdAt: Date;
  createdBy: string;
}

export type MessageType = 
  | 'invoice_pdf'       // PDF da NF
  | 'invoice_link'      // Link para visualização
  | 'invoice_summary'   // Resumo da NF
  | 'payment_reminder'  // Lembrete de pagamento
  | 'receipt';          // Comprovante

export type MessageStatus =
  | 'pending'           // Aguardando envio
  | 'sending'           // Enviando
  | 'sent'              // Enviado
  | 'delivered'         // Entregue
  | 'read'              // Lido
  | 'failed'            // Falhou
  | 'cancelled';        // Cancelado

export interface InvoiceAttachment {
  id: string;
  type: 'pdf' | 'image' | 'xml';
  name: string;
  url: string;
  size: number;
}

export interface InvoiceData {
  id: string;
  number: string;
  series?: string;
  type: InvoiceType;
  
  // Valores
  totalValue: number;
  taxValue?: number;
  discountValue?: number;
  
  // Datas
  issueDate: Date;
  dueDate?: Date;
  
  // Cliente
  clientId: string;
  clientName: string;
  clientDocument: string; // CPF/CNPJ
  clientPhone?: string;
  clientEmail?: string;
  
  // Serviços/Produtos
  items: InvoiceItem[];
  
  // Status
  status: InvoiceStatus;
  
  // Veículo (se aplicável)
  vehiclePlate?: string;
  vehicleInfo?: string;
  
  // Metadados
  empresaId: string;
  budgetId?: string;
  checkinId?: string;
}

export type InvoiceType = 
  | 'nfse'              // Nota Fiscal de Serviço
  | 'nfe'               // Nota Fiscal Eletrônica
  | 'nfce'              // Nota Fiscal Consumidor
  | 'receipt';          // Recibo simples

export type InvoiceStatus =
  | 'draft'             // Rascunho
  | 'pending'           // Pendente emissão
  | 'issued'            // Emitida
  | 'cancelled'         // Cancelada
  | 'rejected';         // Rejeitada

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  serviceCode?: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  type: MessageType;
  content: string;
  variables: TemplateVariable[];
  isActive: boolean;
  empresaId: string;
}

export interface TemplateVariable {
  key: string;
  label: string;
  example: string;
  required: boolean;
}

export interface SendInvoiceRequest {
  invoiceId: string;
  recipientPhone: string;
  messageType: MessageType;
  templateId?: string;
  customMessage?: string;
  includeAttachments?: boolean;
  scheduledAt?: Date;
}

export interface SendInvoiceResult {
  success: boolean;
  messageId?: string;
  error?: string;
  sentAt?: Date;
}

export interface InvoiceWhatsAppStats {
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalFailed: number;
  deliveryRate: number;
  readRate: number;
  averageDeliveryTime: number; // segundos
}

// Labels em português
export const MESSAGE_TYPE_LABELS: Record<MessageType, string> = {
  invoice_pdf: 'PDF da Nota Fiscal',
  invoice_link: 'Link para Visualização',
  invoice_summary: 'Resumo da Nota',
  payment_reminder: 'Lembrete de Pagamento',
  receipt: 'Comprovante',
};

export const MESSAGE_STATUS_LABELS: Record<MessageStatus, string> = {
  pending: 'Aguardando',
  sending: 'Enviando',
  sent: 'Enviado',
  delivered: 'Entregue',
  read: 'Lido',
  failed: 'Falhou',
  cancelled: 'Cancelado',
};

export const INVOICE_TYPE_LABELS: Record<InvoiceType, string> = {
  nfse: 'NFS-e',
  nfe: 'NF-e',
  nfce: 'NFC-e',
  receipt: 'Recibo',
};

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Rascunho',
  pending: 'Pendente',
  issued: 'Emitida',
  cancelled: 'Cancelada',
  rejected: 'Rejeitada',
};

// Cores por status de mensagem
export const MESSAGE_STATUS_COLORS: Record<MessageStatus, { bg: string; text: string; icon: string }> = {
  pending: {
    bg: 'bg-gray-50 dark:bg-gray-900/20',
    text: 'text-gray-700 dark:text-gray-400',
    icon: 'text-gray-500',
  },
  sending: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-400',
    icon: 'text-blue-500',
  },
  sent: {
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    text: 'text-cyan-700 dark:text-cyan-400',
    icon: 'text-cyan-500',
  },
  delivered: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-700 dark:text-green-400',
    icon: 'text-green-500',
  },
  read: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    icon: 'text-emerald-500',
  },
  failed: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-400',
    icon: 'text-red-500',
  },
  cancelled: {
    bg: 'bg-neutral-50 dark:bg-neutral-900/20',
    text: 'text-neutral-700 dark:text-neutral-400',
    icon: 'text-neutral-500',
  },
};

// Templates padrão
export const DEFAULT_TEMPLATES: Omit<WhatsAppTemplate, 'id' | 'empresaId'>[] = [
  {
    name: 'Nota Fiscal Emitida',
    type: 'invoice_pdf',
    content: `Olá {{clientName}}! 👋

Sua nota fiscal foi emitida com sucesso!

📄 *NF {{invoiceNumber}}*
💰 Valor: R$ {{totalValue}}
📅 Data: {{issueDate}}

{{#if vehiclePlate}}
🚗 Veículo: {{vehiclePlate}}
{{/if}}

Segue em anexo o PDF da nota fiscal.

Obrigado pela preferência! 🙏`,
    variables: [
      { key: 'clientName', label: 'Nome do Cliente', example: 'João Silva', required: true },
      { key: 'invoiceNumber', label: 'Número da NF', example: '12345', required: true },
      { key: 'totalValue', label: 'Valor Total', example: '350,00', required: true },
      { key: 'issueDate', label: 'Data de Emissão', example: '28/11/2024', required: true },
      { key: 'vehiclePlate', label: 'Placa do Veículo', example: 'ABC1234', required: false },
    ],
    isActive: true,
  },
  {
    name: 'Lembrete de Pagamento',
    type: 'payment_reminder',
    content: `Olá {{clientName}}! 👋

Este é um lembrete amigável sobre o pagamento pendente:

📄 *NF {{invoiceNumber}}*
💰 Valor: R$ {{totalValue}}
📅 Vencimento: {{dueDate}}

Caso já tenha efetuado o pagamento, por favor desconsidere esta mensagem.

Qualquer dúvida, estamos à disposição! 😊`,
    variables: [
      { key: 'clientName', label: 'Nome do Cliente', example: 'João Silva', required: true },
      { key: 'invoiceNumber', label: 'Número da NF', example: '12345', required: true },
      { key: 'totalValue', label: 'Valor Total', example: '350,00', required: true },
      { key: 'dueDate', label: 'Data de Vencimento', example: '05/12/2024', required: true },
    ],
    isActive: true,
  },
  {
    name: 'Resumo do Serviço',
    type: 'invoice_summary',
    content: `Olá {{clientName}}! 👋

Segue o resumo do serviço realizado:

🚗 *Veículo:* {{vehiclePlate}}
📋 *Serviços:*
{{services}}

💰 *Total:* R$ {{totalValue}}

A nota fiscal será enviada em seguida.

Obrigado pela confiança! 🙏`,
    variables: [
      { key: 'clientName', label: 'Nome do Cliente', example: 'João Silva', required: true },
      { key: 'vehiclePlate', label: 'Placa do Veículo', example: 'ABC1234', required: true },
      { key: 'services', label: 'Lista de Serviços', example: '- Troca de óleo\n- Filtro de ar', required: true },
      { key: 'totalValue', label: 'Valor Total', example: '350,00', required: true },
    ],
    isActive: true,
  },
];
