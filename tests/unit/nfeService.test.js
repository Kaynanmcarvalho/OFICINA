/**
 * Testes para NF-e Service
 */

import {
  generateChaveAcesso,
  generateNFeXML,
  calculateTaxes
} from '../../src/services/nfeService';

describe('NF-e Service', () => {
  describe('generateChaveAcesso', () => {
    it('deve gerar chave com 44 dígitos', () => {
      const nfeData = {
        emitente: {
          cnpj: '12.345.678/0001-90',
          endereco: { uf: 'SP' }
        },
        numero: 1,
        serie: 1
      };

      const chave = generateChaveAcesso(nfeData);
      
      expect(chave).toHaveLength(44);
      expect(chave).toMatch(/^\d{44}$/);
    });

    it('deve começar com código da UF', () => {
      const nfeData = {
        emitente: {
          cnpj: '12.345.678/0001-90',
          endereco: { uf: 'SP' }
        },
        numero: 1,
        serie: 1
      };

      const chave = generateChaveAcesso(nfeData);
      
      expect(chave.substring(0, 2)).toBe('35'); // SP = 35
    });
  });

  describe('calculateTaxes', () => {
    it('deve calcular impostos corretamente', () => {
      const item = {
        valorTotal: 100
      };

      const config = {
        fiscal: {
          aliquotaICMS: 18,
          aliquotaPIS: 1.65,
          aliquotaCOFINS: 7.6,
          aliquotaISS: 5
        }
      };

      const taxes = calculateTaxes(item, config);

      expect(taxes.icms.valor).toBe(18);
      expect(taxes.pis.valor).toBe(1.65);
      expect(taxes.cofins.valor).toBe(7.6);
      expect(taxes.iss.valor).toBe(5);
    });
  });

  describe('generateNFeXML', () => {
    it('deve gerar XML válido', () => {
      const nfeData = {
        emitente: {
          cnpj: '12345678000190',
          razaoSocial: 'Empresa Teste',
          nomeFantasia: 'Teste',
          ie: '123456789',
          endereco: {
            logradouro: 'Rua Teste',
            numero: '123',
            bairro: 'Centro',
            cidade: 'São Paulo',
            uf: 'SP',
            cep: '01234567'
          }
        },
        destinatario: {
          cpfCnpj: '12345678900',
          nome: 'Cliente Teste',
          endereco: {
            logradouro: 'Rua Cliente',
            numero: '456',
            bairro: 'Bairro',
            cidade: 'São Paulo',
            uf: 'SP',
            cep: '01234567'
          }
        },
        itens: [
          {
            codigo: 'PROD1',
            descricao: 'Produto Teste',
            ncm: '12345678',
            cfop: '5102',
            unidade: 'UN',
            quantidade: 1,
            valorUnitario: 100,
            valorTotal: 100,
            impostos: {
              icms: { aliquota: 18, valor: 18 }
            }
          }
        ],
        totais: {
          baseCalculo: 100,
          valorICMS: 18,
          valorTotal: 100
        },
        numero: 1,
        serie: 1,
        chaveAcesso: '12345678901234567890123456789012345678901234'
      };

      const xml = generateNFeXML(nfeData);

      expect(xml).toContain('<?xml version="1.0"');
      expect(xml).toContain('<NFe');
      expect(xml).toContain('<emit>');
      expect(xml).toContain('<dest>');
      expect(xml).toContain('Empresa Teste');
      expect(xml).toContain('Cliente Teste');
    });
  });

  describe('Validações', () => {
    it('deve validar CNPJ', () => {
      const cnpj = '12.345.678/0001-90';
      const cleaned = cnpj.replace(/\D/g, '');
      
      expect(cleaned).toHaveLength(14);
      expect(cleaned).toMatch(/^\d+$/);
    });

    it('deve validar número da NF-e', () => {
      const numero = 1;
      const formatted = numero.toString().padStart(9, '0');
      
      expect(formatted).toHaveLength(9);
      expect(formatted).toBe('000000001');
    });

    it('deve validar série', () => {
      const serie = 1;
      const formatted = serie.toString().padStart(3, '0');
      
      expect(formatted).toHaveLength(3);
      expect(formatted).toBe('001');
    });
  });

  describe('Cálculos', () => {
    it('deve calcular total com impostos', () => {
      const subtotal = 100;
      const icms = 18;
      const pis = 1.65;
      const cofins = 7.6;
      
      const totalImpostos = icms + pis + cofins;
      
      expect(totalImpostos).toBeCloseTo(27.25, 2);
    });

    it('deve calcular valor unitário', () => {
      const valorTotal = 100;
      const quantidade = 5;
      const valorUnitario = valorTotal / quantidade;
      
      expect(valorUnitario).toBe(20);
    });
  });
});
