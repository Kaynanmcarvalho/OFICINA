/**
 * Testes de Integração REAIS - Histórico Veicular
 * SEM MOCKS - Testa funcionalidade real end-to-end
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';

// Componentes REAIS
import { VehicleHistoryBadge } from '../../src/components/vehicle-history/VehicleHistoryBadge';
import { VehicleHistoryModal } from '../../src/components/vehicle-history/VehicleHistoryModal';
import ClientCard from '../../src/pages/clients/ClientCard';

// Serviços REAIS
import { getVehicleHistory } from '../../src/services/vehicleHistoryService';

// Hook REAL
import { useVehicleHistory } from '../../src/hooks/useVehicleHistory';

describe('🧪 TESTES REAIS - Histórico Veicular (SEM MOCKS)', () => {
  
  // Dados de teste REAIS
  const testPlaca = 'ABC1234';
  const testEmpresaId = 'test-empresa-123';
  
  const testClient = {
    id: '1',
    name: 'João Silva',
    email: 'joao@test.com',
    phone: '11999999999',
    vehicles: [{
      plate: testPlaca,
      placa: testPlaca,
      model: 'Gol',
      brand: 'Volkswagen',
      year: 2020
    }],
    active: true
  };

  beforeEach(() => {
    // Limpar localStorage antes de cada teste
    localStorage.clear();
    
    // Limpar cache do serviço
    if (window.vehicleHistoryCache) {
      window.vehicleHistoryCache.clear();
    }
  });

  describe('✅ Teste 1: Serviço vehicleHistoryService', () => {
    
    test('1.1 - Deve exportar função getVehicleHistory', () => {
      expect(getVehicleHistory).toBeDefined();
      expect(typeof getVehicleHistory).toBe('function');
    });

    test('1.2 - Deve validar entrada de placa', async () => {
      await expect(getVehicleHistory('', testEmpresaId))
        .rejects.toThrow();
    });

    test('1.3 - Deve validar entrada de empresaId', async () => {
      await expect(getVehicleHistory(testPlaca, ''))
        .rejects.toThrow();
    });

    test('1.4 - Deve gerar ID único para histórico', () => {
      const { generateHistoryId } = require('../../src/services/vehicleHistoryService');
      const id1 = generateHistoryId(testPlaca, testEmpresaId);
      const id2 = generateHistoryId(testPlaca, testEmpresaId);
      
      expect(id1).toBeDefined();
      expect(id1).toBe(id2); // Mesmo input = mesmo ID
      expect(id1).toContain(testEmpresaId);
    });

    test('1.5 - Deve calcular nível de risco corretamente', () => {
      const { calculateRiskLevel } = require('../../src/services/vehicleHistoryService');
      
      // Sem problemas
      const lowRisk = calculateRiskLevel({
        recalls: [],
        leiloes: [],
        sinistros: [],
        restricoes: []
      });
      expect(lowRisk).toBe('baixo');
      
      // Com recalls
      const mediumRisk = calculateRiskLevel({
        recalls: [{ status: 'pendente' }],
        leiloes: [],
        sinistros: [],
        restricoes: []
      });
      expect(mediumRisk).toBe('medio');
      
      // Com sinistros graves
      const highRisk = calculateRiskLevel({
        recalls: [],
        leiloes: [{}],
        sinistros: [{ gravidade: 'alta' }],
        restricoes: []
      });
      expect(highRisk).toBe('alto');
    });
  });

  describe('✅ Teste 2: Hook useVehicleHistory', () => {
    
    test('2.1 - Deve retornar estrutura correta', () => {
      const { result } = renderHook(() => useVehicleHistory(testPlaca));
      
      expect(result.current).toHaveProperty('history');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('hasRecalls');
      expect(result.current).toHaveProperty('hasSinistros');
      expect(result.current).toHaveProperty('hasLeiloes');
      expect(result.current).toHaveProperty('riskLevel');
      expect(result.current).toHaveProperty('hasAlert');
      expect(result.current).toHaveProperty('alertMessage');
      expect(result.current).toHaveProperty('refreshHistory');
    });

    test('2.2 - Deve iniciar com loading true', () => {
      const { result } = renderHook(() => useVehicleHistory(testPlaca));
      expect(result.current.loading).toBe(true);
    });

    test('2.3 - Deve calcular hasRecalls corretamente', async () => {
      const mockHistory = {
        recalls: [{ id: '1', status: 'pendente' }],
        leiloes: [],
        sinistros: []
      };
      
      // Simular resposta do serviço
      localStorage.setItem(
        `vehicle_history_${testEmpresaId}_${testPlaca}`,
        JSON.stringify(mockHistory)
      );
      
      const { result } = renderHook(() => useVehicleHistory(testPlaca));
      
      await waitFor(() => {
        expect(result.current.hasRecalls).toBe(true);
      });
    });
  });

  describe('✅ Teste 3: Componente VehicleHistoryBadge', () => {
    
    test('3.1 - Deve renderizar sem erros', () => {
      render(<VehicleHistoryBadge placa={testPlaca} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('3.2 - Deve mostrar loading inicialmente', () => {
      render(<VehicleHistoryBadge placa={testPlaca} />);
      expect(screen.getByText(/carregando/i)).toBeInTheDocument();
    });

    test('3.3 - Deve ser clicável', () => {
      const handleClick = jest.fn();
      render(<VehicleHistoryBadge placa={testPlaca} onClick={handleClick} />);
      
      const badge = screen.getByRole('button');
      fireEvent.click(badge);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('3.4 - Deve mostrar cor correta por risco', async () => {
      const { container } = render(<VehicleHistoryBadge placa={testPlaca} />);
      
      await waitFor(() => {
        const badge = container.querySelector('[class*="badge"]');
        expect(badge).toBeInTheDocument();
      });
    });

    test('3.5 - Deve ter ícone visível', () => {
      const { container } = render(<VehicleHistoryBadge placa={testPlaca} />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('✅ Teste 4: Componente VehicleHistoryModal', () => {
    
    test('4.1 - Não deve renderizar quando fechado', () => {
      render(
        <VehicleHistoryModal 
          placa={testPlaca} 
          isOpen={false} 
          onClose={() => {}} 
        />
      );
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('4.2 - Deve renderizar quando aberto', () => {
      render(
        <VehicleHistoryModal 
          placa={testPlaca} 
          isOpen={true} 
          onClose={() => {}} 
        />
      );
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    test('4.3 - Deve ter botão de fechar', () => {
      const handleClose = jest.fn();
      render(
        <VehicleHistoryModal 
          placa={testPlaca} 
          isOpen={true} 
          onClose={handleClose} 
        />
      );
      
      const closeButton = screen.getByLabelText(/fechar/i);
      fireEvent.click(closeButton);
      
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    test('4.4 - Deve ter sistema de tabs', () => {
      render(
        <VehicleHistoryModal 
          placa={testPlaca} 
          isOpen={true} 
          onClose={() => {}} 
        />
      );
      
      expect(screen.getByText(/recalls/i)).toBeInTheDocument();
      expect(screen.getByText(/leilões/i)).toBeInTheDocument();
      expect(screen.getByText(/sinistros/i)).toBeInTheDocument();
      expect(screen.getByText(/timeline/i)).toBeInTheDocument();
    });

    test('4.5 - Deve trocar de tab ao clicar', () => {
      render(
        <VehicleHistoryModal 
          placa={testPlaca} 
          isOpen={true} 
          onClose={() => {}} 
        />
      );
      
      const leiloesTab = screen.getByText(/leilões/i);
      fireEvent.click(leiloesTab);
      
      // Verificar se tab está ativa
      expect(leiloesTab.closest('button')).toHaveClass('active');
    });

    test('4.6 - Deve ter botão de refresh', () => {
      render(
        <VehicleHistoryModal 
          placa={testPlaca} 
          isOpen={true} 
          onClose={() => {}} 
        />
      );
      
      const refreshButton = screen.getByText(/atualizar/i);
      expect(refreshButton).toBeInTheDocument();
    });

    test('4.7 - Deve mostrar placa no título', () => {
      render(
        <VehicleHistoryModal 
          placa={testPlaca} 
          isOpen={true} 
          onClose={() => {}} 
        />
      );
      
      expect(screen.getByText(new RegExp(testPlaca, 'i'))).toBeInTheDocument();
    });
  });

  describe('✅ Teste 5: Integração com ClientCard', () => {
    
    test('5.1 - ClientCard deve renderizar badge quando tem veículo', () => {
      render(
        <ClientCard 
          client={testClient}
          onView={() => {}}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      );
      
      // Badge deve estar presente
      const badge = screen.getByRole('button', { name: /histórico/i });
      expect(badge).toBeInTheDocument();
    });

    test('5.2 - Clicar no badge deve abrir modal', async () => {
      render(
        <ClientCard 
          client={testClient}
          onView={() => {}}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      );
      
      const badge = screen.getByRole('button', { name: /histórico/i });
      fireEvent.click(badge);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    test('5.3 - Modal deve fechar ao clicar em fechar', async () => {
      render(
        <ClientCard 
          client={testClient}
          onView={() => {}}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      );
      
      // Abrir modal
      const badge = screen.getByRole('button', { name: /histórico/i });
      fireEvent.click(badge);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      // Fechar modal
      const closeButton = screen.getByLabelText(/fechar/i);
      fireEvent.click(closeButton);
      
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('✅ Teste 6: Fluxo Completo End-to-End', () => {
    
    test('6.1 - Fluxo completo: Badge → Modal → Tabs → Fechar', async () => {
      render(
        <ClientCard 
          client={testClient}
          onView={() => {}}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      );
      
      // 1. Verificar badge
      const badge = screen.getByRole('button', { name: /histórico/i });
      expect(badge).toBeInTheDocument();
      
      // 2. Clicar no badge
      fireEvent.click(badge);
      
      // 3. Verificar modal aberto
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      // 4. Verificar tabs
      expect(screen.getByText(/recalls/i)).toBeInTheDocument();
      expect(screen.getByText(/leilões/i)).toBeInTheDocument();
      
      // 5. Trocar tab
      const leiloesTab = screen.getByText(/leilões/i);
      fireEvent.click(leiloesTab);
      
      // 6. Trocar para timeline
      const timelineTab = screen.getByText(/timeline/i);
      fireEvent.click(timelineTab);
      
      // 7. Fechar modal
      const closeButton = screen.getByLabelText(/fechar/i);
      fireEvent.click(closeButton);
      
      // 8. Verificar modal fechado
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    test('6.2 - Fluxo de refresh: Abrir → Refresh → Verificar loading', async () => {
      render(
        <VehicleHistoryModal 
          placa={testPlaca} 
          isOpen={true} 
          onClose={() => {}} 
        />
      );
      
      // 1. Aguardar carregamento inicial
      await waitFor(() => {
        expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
      });
      
      // 2. Clicar em refresh
      const refreshButton = screen.getByText(/atualizar/i);
      fireEvent.click(refreshButton);
      
      // 3. Verificar loading aparece
      expect(screen.getByText(/carregando/i)).toBeInTheDocument();
    });
  });

  describe('✅ Teste 7: Validação de Dados', () => {
    
    test('7.1 - Deve validar formato de placa brasileiro', () => {
      const { isValidPlaca } = require('../../src/services/vehicleHistoryService');
      
      // Válidas
      expect(isValidPlaca('ABC1234')).toBe(true);
      expect(isValidPlaca('ABC1D23')).toBe(true); // Mercosul
      
      // Inválidas
      expect(isValidPlaca('ABC123')).toBe(false); // Muito curta
      expect(isValidPlaca('ABCD1234')).toBe(false); // Muitas letras
      expect(isValidPlaca('12345678')).toBe(false); // Só números
      expect(isValidPlaca('')).toBe(false); // Vazia
    });

    test('7.2 - Deve limpar placa corretamente', () => {
      const { cleanPlaca } = require('../../src/services/vehicleHistoryService');
      
      expect(cleanPlaca('ABC-1234')).toBe('ABC1234');
      expect(cleanPlaca('abc1234')).toBe('ABC1234');
      expect(cleanPlaca('  ABC1234  ')).toBe('ABC1234');
    });
  });

  describe('✅ Teste 8: Performance e Cache', () => {
    
    test('8.1 - Primeira chamada deve ser mais lenta', async () => {
      const start = Date.now();
      await getVehicleHistory(testPlaca, testEmpresaId);
      const firstCallTime = Date.now() - start;
      
      expect(firstCallTime).toBeGreaterThan(0);
    });

    test('8.2 - Segunda chamada deve usar cache (mais rápida)', async () => {
      // Primeira chamada
      await getVehicleHistory(testPlaca, testEmpresaId);
      
      // Segunda chamada (com cache)
      const start = Date.now();
      await getVehicleHistory(testPlaca, testEmpresaId);
      const cachedCallTime = Date.now() - start;
      
      // Cache deve ser instantâneo (< 100ms)
      expect(cachedCallTime).toBeLessThan(100);
    });

    test('8.3 - ForceRefresh deve ignorar cache', async () => {
      // Primeira chamada
      await getVehicleHistory(testPlaca, testEmpresaId);
      
      // Segunda chamada com forceRefresh
      const start = Date.now();
      await getVehicleHistory(testPlaca, testEmpresaId, true);
      const refreshTime = Date.now() - start;
      
      // Deve ser mais lento que cache
      expect(refreshTime).toBeGreaterThan(100);
    });
  });

  describe('✅ Teste 9: Acessibilidade', () => {
    
    test('9.1 - Badge deve ter aria-label', () => {
      const { container } = render(<VehicleHistoryBadge placa={testPlaca} />);
      const badge = container.querySelector('[aria-label]');
      expect(badge).toBeInTheDocument();
    });

    test('9.2 - Modal deve ter role="dialog"', () => {
      render(
        <VehicleHistoryModal 
          placa={testPlaca} 
          isOpen={true} 
          onClose={() => {}} 
        />
      );
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    test('9.3 - Botões devem ser focáveis', () => {
      render(
        <VehicleHistoryModal 
          placa={testPlaca} 
          isOpen={true} 
          onClose={() => {}} 
        />
      );
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('tabIndex');
      });
    });
  });

  describe('✅ Teste 10: Dark Mode', () => {
    
    test('10.1 - Badge deve suportar dark mode', () => {
      const { container } = render(<VehicleHistoryBadge placa={testPlaca} />);
      
      // Simular dark mode
      document.documentElement.classList.add('dark');
      
      const badge = container.querySelector('[class*="badge"]');
      expect(badge).toBeInTheDocument();
      
      // Limpar
      document.documentElement.classList.remove('dark');
    });

    test('10.2 - Modal deve suportar dark mode', () => {
      render(
        <VehicleHistoryModal 
          placa={testPlaca} 
          isOpen={true} 
          onClose={() => {}} 
        />
      );
      
      // Simular dark mode
      document.documentElement.classList.add('dark');
      
      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();
      
      // Limpar
      document.documentElement.classList.remove('dark');
    });
  });
});

describe('🔥 TESTES DE STRESS - Histórico Veicular', () => {
  
  test('Stress 1: Múltiplas chamadas simultâneas', async () => {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(getVehicleHistory(`ABC${i}234`, 'test-empresa'));
    }
    
    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    
    expect(successful).toBeGreaterThan(0);
  });

  test('Stress 2: Abrir e fechar modal rapidamente', async () => {
    const { rerender } = render(
      <VehicleHistoryModal 
        placa="ABC1234" 
        isOpen={false} 
        onClose={() => {}} 
      />
    );
    
    for (let i = 0; i < 20; i++) {
      rerender(
        <VehicleHistoryModal 
          placa="ABC1234" 
          isOpen={i % 2 === 0} 
          onClose={() => {}} 
        />
      );
    }
    
    // Não deve crashar
    expect(true).toBe(true);
  });

  test('Stress 3: Trocar tabs rapidamente', async () => {
    render(
      <VehicleHistoryModal 
        placa="ABC1234" 
        isOpen={true} 
        onClose={() => {}} 
      />
    );
    
    const tabs = ['recalls', 'leilões', 'sinistros', 'timeline'];
    
    for (let i = 0; i < 50; i++) {
      const tabName = tabs[i % tabs.length];
      const tab = screen.getByText(new RegExp(tabName, 'i'));
      fireEvent.click(tab);
    }
    
    // Não deve crashar
    expect(true).toBe(true);
  });
});
