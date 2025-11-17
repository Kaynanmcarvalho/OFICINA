/**
 * Testes E2E REAIS - Histórico Veicular
 * Testa no navegador real, sem mocks
 */

describe('🚗 E2E - Histórico Veicular (REAL)', () => {
  
  beforeEach(() => {
    // Login antes de cada teste
    cy.visit('/login');
    cy.get('[data-testid="email"]').type('test@torqai.com');
    cy.get('[data-testid="password"]').type('test123');
    cy.get('[data-testid="login-button"]').click();
    
    // Aguardar redirect
    cy.url().should('include', '/dashboard');
    
    // Navegar para clientes
    cy.visit('/clients');
    cy.wait(1000);
  });

  describe('✅ Teste 1: Badge no ClientCard', () => {
    
    it('1.1 - Deve mostrar badge em cliente com veículo', () => {
      // Procurar primeiro card com veículo
      cy.get('[data-testid="client-card"]').first().within(() => {
        cy.get('[data-testid="vehicle-history-badge"]')
          .should('exist')
          .and('be.visible');
      });
    });

    it('1.2 - Badge deve ter cor baseada em risco', () => {
      cy.get('[data-testid="vehicle-history-badge"]').first()
        .should('have.class', /badge-(green|yellow|red)/);
    });

    it('1.3 - Badge deve ter ícone visível', () => {
      cy.get('[data-testid="vehicle-history-badge"]').first()
        .find('svg')
        .should('exist')
        .and('be.visible');
    });

    it('1.4 - Badge deve ser clicável', () => {
      cy.get('[data-testid="vehicle-history-badge"]').first()
        .should('not.be.disabled')
        .click();
      
      // Modal deve abrir
      cy.get('[data-testid="vehicle-history-modal"]')
        .should('exist')
        .and('be.visible');
    });

    it('1.5 - Badge deve mostrar loading inicialmente', () => {
      cy.reload();
      cy.get('[data-testid="vehicle-history-badge"]').first()
        .should('contain.text', /carregando|loading/i);
    });
  });

  describe('✅ Teste 2: Modal de Histórico', () => {
    
    beforeEach(() => {
      // Abrir modal
      cy.get('[data-testid="vehicle-history-badge"]').first().click();
      cy.get('[data-testid="vehicle-history-modal"]').should('be.visible');
    });

    it('2.1 - Modal deve ter título com placa', () => {
      cy.get('[data-testid="vehicle-history-modal"]')
        .find('[data-testid="modal-title"]')
        .should('contain.text', /[A-Z]{3}[0-9][A-Z0-9][0-9]{2}/);
    });

    it('2.2 - Modal deve ter botão de fechar', () => {
      cy.get('[data-testid="modal-close-button"]')
        .should('exist')
        .and('be.visible')
        .and('not.be.disabled');
    });

    it('2.3 - Clicar em fechar deve fechar modal', () => {
      cy.get('[data-testid="modal-close-button"]').click();
      cy.get('[data-testid="vehicle-history-modal"]')
        .should('not.exist');
    });

    it('2.4 - Modal deve ter 4 tabs', () => {
      cy.get('[data-testid="modal-tabs"]')
        .find('[role="tab"]')
        .should('have.length', 4);
    });

    it('2.5 - Tabs devem ter nomes corretos', () => {
      cy.get('[data-testid="modal-tabs"]').within(() => {
        cy.contains(/recalls/i).should('exist');
        cy.contains(/leilões/i).should('exist');
        cy.contains(/sinistros/i).should('exist');
        cy.contains(/timeline/i).should('exist');
      });
    });

    it('2.6 - Primeira tab deve estar ativa', () => {
      cy.get('[data-testid="modal-tabs"]')
        .find('[role="tab"]').first()
        .should('have.attr', 'aria-selected', 'true');
    });

    it('2.7 - Clicar em tab deve ativá-la', () => {
      cy.contains('[role="tab"]', /leilões/i).click();
      cy.contains('[role="tab"]', /leilões/i)
        .should('have.attr', 'aria-selected', 'true');
    });

    it('2.8 - Modal deve ter botão de refresh', () => {
      cy.get('[data-testid="refresh-button"]')
        .should('exist')
        .and('be.visible');
    });

    it('2.9 - Clicar em refresh deve mostrar loading', () => {
      cy.get('[data-testid="refresh-button"]').click();
      cy.get('[data-testid="loading-indicator"]')
        .should('exist')
        .and('be.visible');
    });

    it('2.10 - Modal deve mostrar dados após carregar', () => {
      cy.get('[data-testid="modal-content"]', { timeout: 10000 })
        .should('not.contain.text', /carregando/i);
    });
  });

  describe('✅ Teste 3: Tab Recalls', () => {
    
    beforeEach(() => {
      cy.get('[data-testid="vehicle-history-badge"]').first().click();
      cy.get('[data-testid="vehicle-history-modal"]').should('be.visible');
      cy.contains('[role="tab"]', /recalls/i).click();
    });

    it('3.1 - Deve mostrar lista de recalls ou mensagem vazia', () => {
      cy.get('[data-testid="recalls-content"]').should('exist');
      
      // Ou tem recalls ou mensagem de vazio
      cy.get('[data-testid="recalls-content"]').then($content => {
        const hasRecalls = $content.find('[data-testid="recall-item"]').length > 0;
        const hasEmptyMessage = $content.text().includes('Nenhum recall');
        
        expect(hasRecalls || hasEmptyMessage).to.be.true;
      });
    });

    it('3.2 - Recalls devem ter informações básicas', () => {
      cy.get('[data-testid="recall-item"]').first().within(() => {
        cy.get('[data-testid="recall-fabricante"]').should('exist');
        cy.get('[data-testid="recall-modelo"]').should('exist');
        cy.get('[data-testid="recall-status"]').should('exist');
      });
    });

    it('3.3 - Recalls devem ter indicador de gravidade', () => {
      cy.get('[data-testid="recall-item"]').first()
        .find('[data-testid="recall-gravidade"]')
        .should('exist')
        .and('have.class', /gravidade-(baixa|media|alta)/);
    });
  });

  describe('✅ Teste 4: Tab Leilões', () => {
    
    beforeEach(() => {
      cy.get('[data-testid="vehicle-history-badge"]').first().click();
      cy.get('[data-testid="vehicle-history-modal"]').should('be.visible');
      cy.contains('[role="tab"]', /leilões/i).click();
    });

    it('4.1 - Deve mostrar lista de leilões ou mensagem vazia', () => {
      cy.get('[data-testid="leiloes-content"]').should('exist');
    });

    it('4.2 - Leilões devem ter informações básicas', () => {
      cy.get('[data-testid="leilao-item"]').first().within(() => {
        cy.get('[data-testid="leilao-lote"]').should('exist');
        cy.get('[data-testid="leilao-data"]').should('exist');
        cy.get('[data-testid="leilao-status"]').should('exist');
      });
    });
  });

  describe('✅ Teste 5: Tab Sinistros', () => {
    
    beforeEach(() => {
      cy.get('[data-testid="vehicle-history-badge"]').first().click();
      cy.get('[data-testid="vehicle-history-modal"]').should('be.visible');
      cy.contains('[role="tab"]', /sinistros/i).click();
    });

    it('5.1 - Deve mostrar lista de sinistros ou mensagem vazia', () => {
      cy.get('[data-testid="sinistros-content"]').should('exist');
    });

    it('5.2 - Sinistros devem ter informações básicas', () => {
      cy.get('[data-testid="sinistro-item"]').first().within(() => {
        cy.get('[data-testid="sinistro-tipo"]').should('exist');
        cy.get('[data-testid="sinistro-gravidade"]').should('exist');
        cy.get('[data-testid="sinistro-data"]').should('exist');
      });
    });
  });

  describe('✅ Teste 6: Tab Timeline', () => {
    
    beforeEach(() => {
      cy.get('[data-testid="vehicle-history-badge"]').first().click();
      cy.get('[data-testid="vehicle-history-modal"]').should('be.visible');
      cy.contains('[role="tab"]', /timeline/i).click();
    });

    it('6.1 - Deve mostrar timeline de eventos', () => {
      cy.get('[data-testid="timeline-content"]').should('exist');
    });

    it('6.2 - Eventos devem estar ordenados cronologicamente', () => {
      cy.get('[data-testid="timeline-item"]').then($items => {
        const dates = [];
        $items.each((i, item) => {
          const dateText = Cypress.$(item).find('[data-testid="event-date"]').text();
          dates.push(new Date(dateText));
        });
        
        // Verificar ordem decrescente (mais recente primeiro)
        for (let i = 0; i < dates.length - 1; i++) {
          expect(dates[i].getTime()).to.be.at.least(dates[i + 1].getTime());
        }
      });
    });

    it('6.3 - Eventos devem ter ícones', () => {
      cy.get('[data-testid="timeline-item"]').first()
        .find('svg')
        .should('exist');
    });
  });

  describe('✅ Teste 7: Fluxo Completo', () => {
    
    it('7.1 - Fluxo: Badge → Modal → Todas Tabs → Fechar', () => {
      // 1. Clicar no badge
      cy.get('[data-testid="vehicle-history-badge"]').first().click();
      
      // 2. Verificar modal aberto
      cy.get('[data-testid="vehicle-history-modal"]').should('be.visible');
      
      // 3. Clicar em cada tab
      cy.contains('[role="tab"]', /recalls/i).click();
      cy.get('[data-testid="recalls-content"]').should('be.visible');
      
      cy.contains('[role="tab"]', /leilões/i).click();
      cy.get('[data-testid="leiloes-content"]').should('be.visible');
      
      cy.contains('[role="tab"]', /sinistros/i).click();
      cy.get('[data-testid="sinistros-content"]').should('be.visible');
      
      cy.contains('[role="tab"]', /timeline/i).click();
      cy.get('[data-testid="timeline-content"]').should('be.visible');
      
      // 4. Fechar modal
      cy.get('[data-testid="modal-close-button"]').click();
      cy.get('[data-testid="vehicle-history-modal"]').should('not.exist');
    });

    it('7.2 - Fluxo: Abrir → Refresh → Aguardar → Fechar', () => {
      // 1. Abrir modal
      cy.get('[data-testid="vehicle-history-badge"]').first().click();
      cy.get('[data-testid="vehicle-history-modal"]').should('be.visible');
      
      // 2. Aguardar carregamento inicial
      cy.get('[data-testid="loading-indicator"]', { timeout: 10000 })
        .should('not.exist');
      
      // 3. Clicar em refresh
      cy.get('[data-testid="refresh-button"]').click();
      
      // 4. Verificar loading
      cy.get('[data-testid="loading-indicator"]').should('be.visible');
      
      // 5. Aguardar novo carregamento
      cy.get('[data-testid="loading-indicator"]', { timeout: 10000 })
        .should('not.exist');
      
      // 6. Fechar
      cy.get('[data-testid="modal-close-button"]').click();
    });
  });

  describe('✅ Teste 8: Responsividade', () => {
    
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];

    viewports.forEach(viewport => {
      it(`8.${viewport.name} - Deve funcionar em ${viewport.name}`, () => {
        cy.viewport(viewport.width, viewport.height);
        
        // Badge deve estar visível
        cy.get('[data-testid="vehicle-history-badge"]').first()
          .should('be.visible');
        
        // Abrir modal
        cy.get('[data-testid="vehicle-history-badge"]').first().click();
        
        // Modal deve estar visível
        cy.get('[data-testid="vehicle-history-modal"]')
          .should('be.visible');
        
        // Tabs devem estar visíveis
        cy.get('[data-testid="modal-tabs"]')
          .should('be.visible');
        
        // Fechar
        cy.get('[data-testid="modal-close-button"]').click();
      });
    });
  });

  describe('✅ Teste 9: Performance', () => {
    
    it('9.1 - Badge deve carregar em menos de 3 segundos', () => {
      const start = Date.now();
      
      cy.get('[data-testid="vehicle-history-badge"]').first()
        .should('not.contain.text', /carregando/i)
        .then(() => {
          const loadTime = Date.now() - start;
          expect(loadTime).to.be.lessThan(3000);
        });
    });

    it('9.2 - Modal deve abrir instantaneamente', () => {
      const start = Date.now();
      
      cy.get('[data-testid="vehicle-history-badge"]').first().click();
      
      cy.get('[data-testid="vehicle-history-modal"]')
        .should('be.visible')
        .then(() => {
          const openTime = Date.now() - start;
          expect(openTime).to.be.lessThan(500);
        });
    });

    it('9.3 - Trocar tabs deve ser instantâneo', () => {
      cy.get('[data-testid="vehicle-history-badge"]').first().click();
      cy.get('[data-testid="vehicle-history-modal"]').should('be.visible');
      
      const start = Date.now();
      cy.contains('[role="tab"]', /leilões/i).click();
      
      cy.get('[data-testid="leiloes-content"]')
        .should('be.visible')
        .then(() => {
          const switchTime = Date.now() - start;
          expect(switchTime).to.be.lessThan(200);
        });
    });
  });

  describe('✅ Teste 10: Acessibilidade', () => {
    
    it('10.1 - Badge deve ser navegável por teclado', () => {
      cy.get('[data-testid="vehicle-history-badge"]').first()
        .focus()
        .should('have.focus');
      
      cy.focused().type('{enter}');
      cy.get('[data-testid="vehicle-history-modal"]').should('be.visible');
    });

    it('10.2 - Modal deve ter foco ao abrir', () => {
      cy.get('[data-testid="vehicle-history-badge"]').first().click();
      
      cy.get('[data-testid="vehicle-history-modal"]')
        .should('have.focus');
    });

    it('10.3 - ESC deve fechar modal', () => {
      cy.get('[data-testid="vehicle-history-badge"]').first().click();
      cy.get('[data-testid="vehicle-history-modal"]').should('be.visible');
      
      cy.get('body').type('{esc}');
      cy.get('[data-testid="vehicle-history-modal"]').should('not.exist');
    });

    it('10.4 - Tabs devem ser navegáveis por teclado', () => {
      cy.get('[data-testid="vehicle-history-badge"]').first().click();
      cy.get('[data-testid="vehicle-history-modal"]').should('be.visible');
      
      cy.get('[role="tab"]').first().focus();
      cy.focused().type('{rightarrow}');
      cy.focused().should('contain.text', /leilões/i);
    });
  });

  describe('✅ Teste 11: Dark Mode', () => {
    
    it('11.1 - Badge deve funcionar em dark mode', () => {
      // Ativar dark mode
      cy.get('[data-testid="theme-toggle"]').click();
      
      cy.get('[data-testid="vehicle-history-badge"]').first()
        .should('be.visible')
        .and('have.class', /dark/);
    });

    it('11.2 - Modal deve funcionar em dark mode', () => {
      // Ativar dark mode
      cy.get('[data-testid="theme-toggle"]').click();
      
      cy.get('[data-testid="vehicle-history-badge"]').first().click();
      
      cy.get('[data-testid="vehicle-history-modal"]')
        .should('be.visible')
        .and('have.class', /dark/);
    });
  });
});

describe('🔥 E2E - Testes de Stress', () => {
  
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-testid="email"]').type('test@torqai.com');
    cy.get('[data-testid="password"]').type('test123');
    cy.get('[data-testid="login-button"]').click();
    cy.visit('/clients');
  });

  it('Stress 1: Abrir e fechar modal 20 vezes', () => {
    for (let i = 0; i < 20; i++) {
      cy.get('[data-testid="vehicle-history-badge"]').first().click();
      cy.get('[data-testid="vehicle-history-modal"]').should('be.visible');
      cy.get('[data-testid="modal-close-button"]').click();
      cy.get('[data-testid="vehicle-history-modal"]').should('not.exist');
    }
  });

  it('Stress 2: Trocar tabs 50 vezes', () => {
    cy.get('[data-testid="vehicle-history-badge"]').first().click();
    cy.get('[data-testid="vehicle-history-modal"]').should('be.visible');
    
    const tabs = ['recalls', 'leilões', 'sinistros', 'timeline'];
    
    for (let i = 0; i < 50; i++) {
      const tabName = tabs[i % tabs.length];
      cy.contains('[role="tab"]', new RegExp(tabName, 'i')).click();
    }
    
    cy.get('[data-testid="modal-close-button"]').click();
  });

  it('Stress 3: Refresh 10 vezes seguidas', () => {
    cy.get('[data-testid="vehicle-history-badge"]').first().click();
    cy.get('[data-testid="vehicle-history-modal"]').should('be.visible');
    
    for (let i = 0; i < 10; i++) {
      cy.get('[data-testid="refresh-button"]').click();
      cy.wait(1000);
    }
    
    cy.get('[data-testid="modal-close-button"]').click();
  });
});
