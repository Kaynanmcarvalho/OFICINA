/**
 * E2E Tests: Auto Diagnosis Visual
 * 
 * End-to-end tests for complete diagnosis flow
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

describe('Auto Diagnosis Visual - E2E', () => {
  beforeEach(() => {
    // Login
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type('test@torq.ai');
    cy.get('[data-testid="password-input"]').type('test123');
    cy.get('[data-testid="login-button"]').click();
    
    // Wait for redirect to dashboard
    cy.url().should('include', '/dashboard');
  });

  describe('Upload and Process Image', () => {
    it('should upload image and show results', () => {
      // Navigate to clients page
      cy.visit('/clients');
      
      // Click on first vehicle card
      cy.get('[data-testid="vehicle-card"]').first().click();
      
      // Click "Analisar Foto" button
      cy.get('[data-testid="analyze-photo-button"]').click();
      
      // Upload image
      cy.get('[data-testid="image-upload-input"]').attachFile('test-car-damage.jpg');
      
      // Wait for upload
      cy.get('[data-testid="upload-progress"]').should('be.visible');
      cy.get('[data-testid="upload-progress"]', { timeout: 10000 }).should('not.exist');
      
      // Click process button
      cy.get('[data-testid="process-button"]').click();
      
      // Wait for processing (max 60s)
      cy.get('[data-testid="processing-spinner"]', { timeout: 60000 }).should('not.exist');
      
      // Verify results are displayed
      cy.get('[data-testid="diagnosis-results"]').should('be.visible');
      cy.get('[data-testid="total-damages"]').should('contain', '2');
      cy.get('[data-testid="estimated-cost"]').should('contain', 'R$');
      
      // Verify annotated image is shown
      cy.get('[data-testid="annotated-image"]').should('be.visible');
      
      // Verify damage list
      cy.get('[data-testid="damage-item"]').should('have.length.at.least', 1);
    });

    it('should handle multiple images', () => {
      cy.visit('/clients');
      cy.get('[data-testid="vehicle-card"]').first().click();
      cy.get('[data-testid="analyze-photo-button"]').click();
      
      // Upload multiple images
      cy.get('[data-testid="image-upload-input"]').attachFile([
        'test-car-damage-1.jpg',
        'test-car-damage-2.jpg',
        'test-car-damage-3.jpg',
      ]);
      
      // Verify 3 images uploaded
      cy.get('[data-testid="uploaded-image"]').should('have.length', 3);
      
      // Process
      cy.get('[data-testid="process-button"]').click();
      
      // Wait and verify results
      cy.get('[data-testid="processing-spinner"]', { timeout: 90000 }).should('not.exist');
      cy.get('[data-testid="diagnosis-results"]').should('be.visible');
    });
  });

  describe('View Results', () => {
    it('should toggle between original and annotated images', () => {
      // ... (setup: upload and process image)
      
      // Click toggle button
      cy.get('[data-testid="toggle-view-button"]').click();
      
      // Verify original image is shown
      cy.get('[data-testid="original-image"]').should('be.visible');
      cy.get('[data-testid="annotated-image"]').should('not.exist');
      
      // Toggle back
      cy.get('[data-testid="toggle-view-button"]').click();
      cy.get('[data-testid="annotated-image"]').should('be.visible');
    });

    it('should navigate between multiple images', () => {
      // ... (setup: upload and process 3 images)
      
      // Click next button
      cy.get('[data-testid="next-image-button"]').click();
      cy.get('[data-testid="current-image-index"]').should('contain', '2');
      
      // Click previous button
      cy.get('[data-testid="prev-image-button"]').click();
      cy.get('[data-testid="current-image-index"]').should('contain', '1');
    });
  });

  describe('Create Budget from Diagnosis', () => {
    it('should create budget with detected damages', () => {
      // ... (setup: complete diagnosis)
      
      // Click "Criar Orçamento" button
      cy.get('[data-testid="create-budget-button"]').click();
      
      // Verify budget modal opens
      cy.get('[data-testid="budget-modal"]').should('be.visible');
      
      // Verify damages are pre-filled
      cy.get('[data-testid="budget-item"]').should('have.length.at.least', 1);
      
      // Verify estimated cost is pre-filled
      cy.get('[data-testid="budget-total"]').should('contain', 'R$');
      
      // Save budget
      cy.get('[data-testid="save-budget-button"]').click();
      
      // Verify success message
      cy.get('[data-testid="success-toast"]').should('contain', 'Orçamento criado');
    });
  });

  describe('Download Report', () => {
    it('should download PDF report', () => {
      // ... (setup: complete diagnosis)
      
      // Click download button
      cy.get('[data-testid="download-report-button"]').click();
      
      // Verify download started
      cy.get('[data-testid="download-toast"]').should('contain', 'Download iniciado');
      
      // Verify file downloaded (check downloads folder)
      cy.readFile('cypress/downloads/diagnosis-report.pdf').should('exist');
    });
  });

  describe('Error Handling', () => {
    it('should show error for invalid file type', () => {
      cy.visit('/clients');
      cy.get('[data-testid="vehicle-card"]').first().click();
      cy.get('[data-testid="analyze-photo-button"]').click();
      
      // Try to upload non-image file
      cy.get('[data-testid="image-upload-input"]').attachFile('test-document.pdf');
      
      // Verify error message
      cy.get('[data-testid="error-toast"]').should('contain', 'Apenas imagens são permitidas');
    });

    it('should show error for oversized file', () => {
      cy.visit('/clients');
      cy.get('[data-testid="vehicle-card"]').first().click();
      cy.get('[data-testid="analyze-photo-button"]').click();
      
      // Try to upload large file (>10MB)
      cy.get('[data-testid="image-upload-input"]').attachFile('large-image.jpg');
      
      // Verify error message
      cy.get('[data-testid="error-toast"]').should('contain', 'Arquivo muito grande');
    });

    it('should handle processing failure gracefully', () => {
      // Mock API to return error
      cy.intercept('POST', '**/processVehicleImage', {
        statusCode: 500,
        body: { error: 'Processing failed' },
      });
      
      cy.visit('/clients');
      cy.get('[data-testid="vehicle-card"]').first().click();
      cy.get('[data-testid="analyze-photo-button"]').click();
      cy.get('[data-testid="image-upload-input"]').attachFile('test-car-damage.jpg');
      cy.get('[data-testid="process-button"]').click();
      
      // Verify error message
      cy.get('[data-testid="error-message"]').should('contain', 'Erro ao processar');
      
      // Verify retry button is shown
      cy.get('[data-testid="retry-button"]').should('be.visible');
    });
  });

  describe('Diagnosis History', () => {
    it('should show diagnosis history for vehicle', () => {
      cy.visit('/clients');
      cy.get('[data-testid="vehicle-card"]').first().click();
      
      // Click history tab
      cy.get('[data-testid="history-tab"]').click();
      
      // Verify diagnosis history is shown
      cy.get('[data-testid="diagnosis-history-item"]').should('have.length.at.least', 1);
      
      // Click on history item
      cy.get('[data-testid="diagnosis-history-item"]').first().click();
      
      // Verify diagnosis details are shown
      cy.get('[data-testid="diagnosis-details"]').should('be.visible');
    });
  });

  describe('Performance', () => {
    it('should process image in less than 60 seconds', () => {
      const startTime = Date.now();
      
      cy.visit('/clients');
      cy.get('[data-testid="vehicle-card"]').first().click();
      cy.get('[data-testid="analyze-photo-button"]').click();
      cy.get('[data-testid="image-upload-input"]').attachFile('test-car-damage.jpg');
      cy.get('[data-testid="process-button"]').click();
      
      cy.get('[data-testid="diagnosis-results"]', { timeout: 60000 }).should('be.visible').then(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        expect(duration).to.be.lessThan(60000); // Less than 60 seconds
        cy.log(`Processing time: ${duration}ms`);
      });
    });
  });
});
