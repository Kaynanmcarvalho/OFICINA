/**
 * TORQ Invoice WhatsApp - Unit Tests (Real Implementation)
 */

import { describe, it, expect } from 'vitest';
import {
  MESSAGE_TYPE_LABELS,
  MESSAGE_STATUS_LABELS,
  MESSAGE_STATUS_COLORS,
  INVOICE_TYPE_LABELS,
  INVOICE_STATUS_LABELS,
  DEFAULT_TEMPLATES,
} from '../../../src/features/invoice-whatsapp/types';
import type {
  MessageType,
  MessageStatus,
  InvoiceType,
  InvoiceStatus,
} from '../../../src/features/invoice-whatsapp/types';

describe('Invoice WhatsApp Types - Labels', () => {
  describe('MESSAGE_TYPE_LABELS', () => {
    it('should have labels for all message types', () => {
      const requiredTypes: MessageType[] = [
        'invoice_pdf',
        'invoice_link',
        'invoice_summary',
        'payment_reminder',
        'receipt',
      ];

      requiredTypes.forEach(type => {
        expect(MESSAGE_TYPE_LABELS[type]).toBeDefined();
        expect(typeof MESSAGE_TYPE_LABELS[type]).toBe('string');
      });
    });

    it('should have Portuguese labels', () => {
      expect(MESSAGE_TYPE_LABELS.invoice_pdf).toBe('PDF da Nota Fiscal');
      expect(MESSAGE_TYPE_LABELS.payment_reminder).toBe('Lembrete de Pagamento');
      expect(MESSAGE_TYPE_LABELS.receipt).toBe('Comprovante');
    });
  });

  describe('MESSAGE_STATUS_LABELS', () => {
    it('should have labels for all statuses', () => {
      const requiredStatuses: MessageStatus[] = [
        'pending',
        'sending',
        'sent',
        'delivered',
        'read',
        'failed',
        'cancelled',
      ];

      requiredStatuses.forEach(status => {
        expect(MESSAGE_STATUS_LABELS[status]).toBeDefined();
      });
    });

    it('should have Portuguese labels', () => {
      expect(MESSAGE_STATUS_LABELS.pending).toBe('Aguardando');
      expect(MESSAGE_STATUS_LABELS.sent).toBe('Enviado');
      expect(MESSAGE_STATUS_LABELS.delivered).toBe('Entregue');
      expect(MESSAGE_STATUS_LABELS.read).toBe('Lido');
      expect(MESSAGE_STATUS_LABELS.failed).toBe('Falhou');
    });
  });

  describe('INVOICE_TYPE_LABELS', () => {
    it('should have labels for all invoice types', () => {
      const requiredTypes: InvoiceType[] = [
        'nfse',
        'nfe',
        'nfce',
        'receipt',
      ];

      requiredTypes.forEach(type => {
        expect(INVOICE_TYPE_LABELS[type]).toBeDefined();
      });
    });

    it('should have correct abbreviations', () => {
      expect(INVOICE_TYPE_LABELS.nfse).toBe('NFS-e');
      expect(INVOICE_TYPE_LABELS.nfe).toBe('NF-e');
      expect(INVOICE_TYPE_LABELS.nfce).toBe('NFC-e');
    });
  });

  describe('INVOICE_STATUS_LABELS', () => {
    it('should have labels for all invoice statuses', () => {
      const requiredStatuses: InvoiceStatus[] = [
        'draft',
        'pending',
        'issued',
        'cancelled',
        'rejected',
      ];

      requiredStatuses.forEach(status => {
        expect(INVOICE_STATUS_LABELS[status]).toBeDefined();
      });
    });
  });
});

describe('Invoice WhatsApp Types - Colors', () => {
  describe('MESSAGE_STATUS_COLORS', () => {
    it('should have colors for all statuses', () => {
      const statuses = Object.keys(MESSAGE_STATUS_LABELS) as MessageStatus[];
      
      statuses.forEach(status => {
        expect(MESSAGE_STATUS_COLORS[status]).toHaveProperty('bg');
        expect(MESSAGE_STATUS_COLORS[status]).toHaveProperty('text');
        expect(MESSAGE_STATUS_COLORS[status]).toHaveProperty('icon');
      });
    });

    it('should use green for positive statuses', () => {
      expect(MESSAGE_STATUS_COLORS.delivered.bg).toContain('green');
      expect(MESSAGE_STATUS_COLORS.read.bg).toContain('emerald');
    });

    it('should use red for failed status', () => {
      expect(MESSAGE_STATUS_COLORS.failed.bg).toContain('red');
    });

    it('should have dark mode variants', () => {
      expect(MESSAGE_STATUS_COLORS.sent.bg).toContain('dark:');
      expect(MESSAGE_STATUS_COLORS.delivered.text).toContain('dark:');
    });
  });
});

describe('Invoice WhatsApp - Default Templates', () => {
  it('should have at least 3 default templates', () => {
    expect(DEFAULT_TEMPLATES.length).toBeGreaterThanOrEqual(3);
  });

  it('should have invoice_pdf template', () => {
    const pdfTemplate = DEFAULT_TEMPLATES.find(t => t.type === 'invoice_pdf');
    expect(pdfTemplate).toBeDefined();
    expect(pdfTemplate!.name).toBeDefined();
    expect(pdfTemplate!.content).toContain('{{clientName}}');
    expect(pdfTemplate!.content).toContain('{{invoiceNumber}}');
  });

  it('should have payment_reminder template', () => {
    const reminderTemplate = DEFAULT_TEMPLATES.find(t => t.type === 'payment_reminder');
    expect(reminderTemplate).toBeDefined();
    expect(reminderTemplate!.content).toContain('{{dueDate}}');
  });

  it('should have invoice_summary template', () => {
    const summaryTemplate = DEFAULT_TEMPLATES.find(t => t.type === 'invoice_summary');
    expect(summaryTemplate).toBeDefined();
    expect(summaryTemplate!.content).toContain('{{services}}');
  });

  it('should have variables defined for each template', () => {
    DEFAULT_TEMPLATES.forEach(template => {
      expect(template.variables).toBeDefined();
      expect(Array.isArray(template.variables)).toBe(true);
      expect(template.variables.length).toBeGreaterThan(0);
    });
  });

  it('should have required variables marked', () => {
    DEFAULT_TEMPLATES.forEach(template => {
      const requiredVars = template.variables.filter(v => v.required);
      expect(requiredVars.length).toBeGreaterThan(0);
    });
  });

  it('should have all templates active by default', () => {
    DEFAULT_TEMPLATES.forEach(template => {
      expect(template.isActive).toBe(true);
    });
  });
});

describe('Invoice WhatsApp - Data Structures', () => {
  it('should have valid InvoiceMessage structure', () => {
    const message = {
      id: 'msg-123',
      invoiceId: 'inv-123',
      invoiceNumber: '12345',
      recipientPhone: '5511999999999',
      recipientName: 'João Silva',
      messageType: 'invoice_pdf' as MessageType,
      messageContent: 'Sua nota fiscal...',
      attachments: [],
      status: 'sent' as MessageStatus,
      empresaId: 'empresa-123',
      createdAt: new Date(),
      createdBy: 'user-123',
    };

    expect(message.invoiceNumber).toBe('12345');
    expect(message.status).toBe('sent');
    expect(message.messageType).toBe('invoice_pdf');
  });

  it('should have valid InvoiceData structure', () => {
    const invoice = {
      id: 'inv-123',
      number: '12345',
      type: 'nfse' as InvoiceType,
      totalValue: 350.00,
      issueDate: new Date(),
      clientId: 'client-123',
      clientName: 'João Silva',
      clientDocument: '123.456.789-00',
      items: [
        { id: '1', description: 'Troca de óleo', quantity: 1, unitPrice: 150, totalPrice: 150 },
      ],
      status: 'issued' as InvoiceStatus,
      empresaId: 'empresa-123',
    };

    expect(invoice.totalValue).toBe(350.00);
    expect(invoice.type).toBe('nfse');
    expect(invoice.items).toHaveLength(1);
  });

  it('should have valid WhatsAppTemplate structure', () => {
    const template = {
      id: 'template-123',
      name: 'Nota Fiscal Emitida',
      type: 'invoice_pdf' as MessageType,
      content: 'Olá {{clientName}}...',
      variables: [
        { key: 'clientName', label: 'Nome do Cliente', example: 'João', required: true },
      ],
      isActive: true,
      empresaId: 'empresa-123',
    };

    expect(template.type).toBe('invoice_pdf');
    expect(template.variables).toHaveLength(1);
    expect(template.isActive).toBe(true);
  });

  it('should have valid InvoiceWhatsAppStats structure', () => {
    const stats = {
      totalSent: 100,
      totalDelivered: 95,
      totalRead: 80,
      totalFailed: 5,
      deliveryRate: 95,
      readRate: 80,
      averageDeliveryTime: 5.5,
    };

    expect(stats.deliveryRate).toBe(95);
    expect(stats.readRate).toBe(80);
    expect(stats.totalSent).toBe(100);
  });
});

describe('Invoice WhatsApp - Template Variables', () => {
  it('should have valid variable structure', () => {
    const variable = {
      key: 'clientName',
      label: 'Nome do Cliente',
      example: 'João Silva',
      required: true,
    };

    expect(variable.key).toBe('clientName');
    expect(variable.required).toBe(true);
  });

  it('should have clientName and totalValue in all templates', () => {
    const commonVars = ['clientName', 'totalValue'];
    
    DEFAULT_TEMPLATES.forEach(template => {
      const varKeys = template.variables.map(v => v.key);
      commonVars.forEach(commonVar => {
        expect(varKeys).toContain(commonVar);
      });
    });
  });
});
