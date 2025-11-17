/**
 * Margin Calculator Service
 * Serviço para cálculos de margem e markup
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

export class MarginCalculatorService {
  /**
   * Calcula markup (multiplicador)
   * Markup = Preço / Custo
   */
  calculateMarkup(cost, price) {
    if (cost === 0) return 0;
    return Math.round((price / cost) * 100) / 100;
  }

  /**
   * Calcula margem (percentual)
   * Margem = ((Preço - Custo) / Preço) * 100
   */
  calculateMargin(cost, price) {
    if (price === 0) return 0;
    return Math.round(((price - cost) / price) * 100 * 100) / 100;
  }

  /**
   * Calcula lucro bruto
   */
  calculateProfit(cost, price) {
    return Math.round((price - cost) * 100) / 100;
  }

  /**
   * Sugere preço baseado em custo e margem alvo
   * Preço = Custo / (1 - Margem/100)
   */
  suggestPrice(cost, targetMargin) {
    if (targetMargin >= 100) return cost;
    if (targetMargin < 0) return cost;
    
    const price = cost / (1 - (targetMargin / 100));
    return Math.round(price * 100) / 100;
  }

  /**
   * Aplica markup ao custo
   * Preço = Custo * Markup
   */
  applyMarkup(cost, markup) {
    return Math.round(cost * markup * 100) / 100;
  }

  /**
   * Converte margem para markup
   * Markup = 1 / (1 - Margem/100)
   */
  marginToMarkup(margin) {
    if (margin >= 100) return 0;
    return Math.round((1 / (1 - (margin / 100))) * 100) / 100;
  }

  /**
   * Converte markup para margem
   * Margem = ((Markup - 1) / Markup) * 100
   */
  markupToMargin(markup) {
    if (markup === 0) return 0;
    return Math.round(((markup - 1) / markup) * 100 * 100) / 100;
  }

  /**
   * Calcula desconto percentual
   */
  calculateDiscount(originalPrice, finalPrice) {
    if (originalPrice === 0) return 0;
    return Math.round(((originalPrice - finalPrice) / originalPrice) * 100 * 100) / 100;
  }

  /**
   * Aplica desconto percentual
   */
  applyDiscount(price, discountPercent) {
    return Math.round(price * (1 - (discountPercent / 100)) * 100) / 100;
  }

  /**
   * Calcula preço com impostos
   */
  addTax(price, taxPercent) {
    return Math.round(price * (1 + (taxPercent / 100)) * 100) / 100;
  }

  /**
   * Remove impostos do preço
   */
  removeTax(priceWithTax, taxPercent) {
    return Math.round(priceWithTax / (1 + (taxPercent / 100)) * 100) / 100;
  }

  /**
   * Calcula ROI (Return on Investment)
   */
  calculateROI(cost, profit) {
    if (cost === 0) return 0;
    return Math.round((profit / cost) * 100 * 100) / 100;
  }

  /**
   * Calcula ponto de equilíbrio em unidades
   */
  calculateBreakEvenUnits(fixedCosts, pricePerUnit, costPerUnit) {
    const contribution = pricePerUnit - costPerUnit;
    if (contribution <= 0) return 0;
    return Math.ceil(fixedCosts / contribution);
  }

  /**
   * Calcula ponto de equilíbrio em valor
   */
  calculateBreakEvenValue(fixedCosts, marginPercent) {
    if (marginPercent === 0 || marginPercent === 100) return 0;
    return Math.round(fixedCosts / (marginPercent / 100) * 100) / 100;
  }

  /**
   * Formata valor monetário
   */
  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  /**
   * Formata percentual
   */
  formatPercent(value) {
    return `${value.toFixed(2)}%`;
  }

  /**
   * Valida se margem é saudável
   */
  isHealthyMargin(margin, minMargin = 20, targetMargin = 35) {
    return {
      isHealthy: margin >= minMargin,
      isTarget: margin >= targetMargin,
      status: margin >= targetMargin ? 'excellent' : 
              margin >= minMargin ? 'good' : 'low',
      color: margin >= targetMargin ? '#10b981' : 
             margin >= minMargin ? '#f59e0b' : '#ef4444',
      icon: margin >= targetMargin ? '✓' : 
            margin >= minMargin ? '⚠' : '✗'
    };
  }

  /**
   * Calcula margem de contribuição
   */
  calculateContributionMargin(price, variableCost) {
    return Math.round((price - variableCost) * 100) / 100;
  }

  /**
   * Calcula margem de contribuição percentual
   */
  calculateContributionMarginPercent(price, variableCost) {
    if (price === 0) return 0;
    return Math.round(((price - variableCost) / price) * 100 * 100) / 100;
  }

  /**
   * Simula cenários de precificação
   */
  simulatePricingScenarios(cost, scenarios = [20, 25, 30, 35, 40]) {
    return scenarios.map(margin => ({
      margin,
      price: this.suggestPrice(cost, margin),
      profit: this.calculateProfit(cost, this.suggestPrice(cost, margin)),
      markup: this.marginToMarkup(margin)
    }));
  }

  /**
   * Compara preços
   */
  comparePrices(currentPrice, competitorPrices) {
    if (!competitorPrices || competitorPrices.length === 0) {
      return {
        position: 'unknown',
        difference: 0,
        percentDifference: 0
      };
    }

    const avgCompetitorPrice = competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length;
    const difference = currentPrice - avgCompetitorPrice;
    const percentDifference = (difference / avgCompetitorPrice) * 100;

    return {
      position: difference > 0 ? 'above' : difference < 0 ? 'below' : 'equal',
      difference: Math.round(difference * 100) / 100,
      percentDifference: Math.round(percentDifference * 100) / 100,
      avgCompetitorPrice: Math.round(avgCompetitorPrice * 100) / 100
    };
  }
}

export default new MarginCalculatorService();
