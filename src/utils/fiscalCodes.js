/**
 * Base de dados completa de códigos fiscais para setor automotivo
 * NCM, CEST, CFOP, CST/CSOSN e Códigos ANP
 */

// NCM - Nomenclatura Comum do Mercosul (mais usados no setor automotivo)
export const ncmCodes = [
  // Peças e Acessórios
  { code: '87089100', description: 'Radiadores' },
  { code: '87089200', description: 'Silenciosos e tubos de escape' },
  { code: '87089300', description: 'Embreagens e suas partes' },
  { code: '87089400', description: 'Volantes, colunas e caixas de direção' },
  { code: '87089910', description: 'Cilindros pneumáticos' },
  { code: '87089990', description: 'Outras partes e acessórios' },
  { code: '87083010', description: 'Freios e servo-freios - Pastilhas' },
  { code: '87083020', description: 'Freios e servo-freios - Discos' },
  { code: '87083030', description: 'Freios e servo-freios - Tambores' },
  { code: '87083090', description: 'Freios e servo-freios - Outros' },
  { code: '87084010', description: 'Caixas de marchas' },
  { code: '87084090', description: 'Outras caixas de transmissão' },
  { code: '87085010', description: 'Eixos com diferencial' },
  { code: '87085090', description: 'Outros eixos' },
  { code: '87087010', description: 'Rodas e suas partes' },
  { code: '87088010', description: 'Amortecedores de suspensão' },
  { code: '87088090', description: 'Outras partes de suspensão' },
  
  // Filtros
  { code: '84212300', description: 'Filtros de óleo ou gasolina para motores' },
  { code: '84213100', description: 'Filtros de entrada de ar para motores' },
  { code: '84213990', description: 'Outros aparelhos para filtrar' },
  
  // Óleos e Lubrificantes
  { code: '27101990', description: 'Óleos lubrificantes' },
  { code: '27101921', description: 'Óleo para motor' },
  { code: '27101929', description: 'Outros óleos lubrificantes' },
  { code: '27101941', description: 'Graxas lubrificantes' },
  { code: '27101949', description: 'Outras graxas' },
  
  // Pneus
  { code: '40111000', description: 'Pneus novos de borracha para automóveis' },
  { code: '40112000', description: 'Pneus novos para ônibus ou caminhões' },
  { code: '40113000', description: 'Pneus novos para aeronaves' },
  { code: '40114000', description: 'Pneus novos para motocicletas' },
  { code: '40115000', description: 'Pneus novos para bicicletas' },
  { code: '40116100', description: 'Pneus para veículos e máquinas agrícolas' },
  { code: '40116200', description: 'Pneus para veículos e máquinas de construção' },
  { code: '40121100', description: 'Pneus recauchutados para automóveis' },
  { code: '40121200', description: 'Pneus recauchutados para ônibus ou caminhões' },
  
  // Câmaras de ar
  { code: '40131000', description: 'Câmaras de ar para automóveis' },
  { code: '40132000', description: 'Câmaras de ar para bicicletas' },
  { code: '40139000', description: 'Outras câmaras de ar' },
  
  // Baterias
  { code: '85071000', description: 'Acumuladores elétricos de chumbo-ácido' },
  { code: '85072000', description: 'Outros acumuladores de chumbo-ácido' },
  { code: '85073000', description: 'Acumuladores de níquel-cádmio' },
  { code: '85074000', description: 'Acumuladores de níquel-ferro' },
  { code: '85075000', description: 'Acumuladores de níquel-hidreto metálico' },
  { code: '85076000', description: 'Acumuladores de íons de lítio' },
  
  // Velas de ignição
  { code: '85111000', description: 'Velas de ignição' },
  { code: '85112000', description: 'Magnetos; dínamos-magnetos; volantes magnéticos' },
  { code: '85113000', description: 'Distribuidores; bobinas de ignição' },
  { code: '85114000', description: 'Motores de arranque' },
  { code: '85115000', description: 'Outros geradores' },
  
  // Lâmpadas
  { code: '85392110', description: 'Lâmpadas halógenas de tungstênio' },
  { code: '85392190', description: 'Outras lâmpadas de filamento' },
  { code: '85392210', description: 'Lâmpadas de descarga - Faróis' },
  { code: '85392290', description: 'Outras lâmpadas de descarga' },
  { code: '85395000', description: 'Lâmpadas e tubos de LED' },
  
  // Correias
  { code: '40103100', description: 'Correias de transmissão em V' },
  { code: '40103200', description: 'Correias de transmissão sem fim' },
  { code: '40103900', description: 'Outras correias de transmissão' },
  
  // Vidros
  { code: '70071100', description: 'Vidros temperados' },
  { code: '70071900', description: 'Outros vidros de segurança' },
  { code: '70072100', description: 'Vidros laminados' },
  { code: '70072900', description: 'Outros vidros laminados' },
  
  // Tintas e Vernizes
  { code: '32081010', description: 'Tintas à base de poliésteres' },
  { code: '32081020', description: 'Tintas à base de polímeros acrílicos' },
  { code: '32082010', description: 'Vernizes à base de polímeros acrílicos' },
  { code: '32089010', description: 'Outras tintas' },
  { code: '32091000', description: 'Tintas à base de polímeros acrílicos' },
  
  // Adesivos
  { code: '35061000', description: 'Adesivos à base de polímeros' },
  { code: '35069100', description: 'Adesivos à base de polímeros de borracha' },
  { code: '35069900', description: 'Outros adesivos' },
  
  // Produtos de limpeza
  { code: '34022010', description: 'Detergentes líquidos' },
  { code: '34022090', description: 'Outros detergentes' },
  { code: '34029010', description: 'Preparações tensoativas para lavagem' },
  { code: '34031100', description: 'Preparações para tratamento de matérias têxteis' },
  { code: '34039900', description: 'Outras preparações lubrificantes' },
  
  // Ferramentas
  { code: '82041100', description: 'Chaves de porcas, manuais' },
  { code: '82041200', description: 'Chaves de caixa intercambiáveis' },
  { code: '82042000', description: 'Chaves de fenda' },
  { code: '82051000', description: 'Ferramentas de furar ou roscar' },
  { code: '82052000', description: 'Martelos e marretas' },
  { code: '82053000', description: 'Plainas, formões, goivas' },
  { code: '82054000', description: 'Chaves de fenda' },
  { code: '82055100', description: 'Ferramentas de uso doméstico' },
  { code: '82055900', description: 'Outras ferramentas manuais' },
  
  // Equipamentos elétricos
  { code: '85122000', description: 'Aparelhos elétricos de iluminação' },
  { code: '85123000', description: 'Aparelhos de sinalização acústica' },
  { code: '85124000', description: 'Limpadores de para-brisas' },
  { code: '85129000', description: 'Outras partes de aparelhos elétricos' },
  
  // Ar condicionado
  { code: '84151010', description: 'Aparelhos de ar condicionado' },
  { code: '84151090', description: 'Outras máquinas e aparelhos de ar condicionado' },
  { code: '84158100', description: 'Outras máquinas e aparelhos de refrigeração' },
  { code: '84158200', description: 'Outras máquinas e aparelhos' },
  
  // Som automotivo
  { code: '85271200', description: 'Aparelhos receptores de radiodifusão' },
  { code: '85271300', description: 'Outros aparelhos combinados' },
  { code: '85271900', description: 'Outros aparelhos receptores' },
  { code: '85182100', description: 'Alto-falantes' },
  { code: '85182200', description: 'Alto-falantes múltiplos' },
  { code: '85182900', description: 'Outros alto-falantes' },
  { code: '85183000', description: 'Fones de ouvido e auriculares' },
  
  // Alarmes e rastreadores
  { code: '85312000', description: 'Painéis indicadores com dispositivos de LCD' },
  { code: '85318000', description: 'Outros aparelhos elétricos de sinalização' },
  { code: '85269100', description: 'Aparelhos de radionavegação' },
  { code: '85269200', description: 'Aparelhos de radiotelecomando' },
];

// CEST - Código Especificador da Substituição Tributária
export const cestCodes = [
  // Autopeças
  { code: '0100100', description: 'Autopeças - Produtos de borracha e plástico' },
  { code: '0100200', description: 'Autopeças - Câmaras de ar e protetores' },
  { code: '0100300', description: 'Autopeças - Partes de veículos automotores' },
  { code: '0100400', description: 'Autopeças - Vidros' },
  { code: '0100500', description: 'Autopeças - Retrovisores' },
  { code: '0100600', description: 'Autopeças - Cilindros pneumáticos' },
  { code: '0100700', description: 'Autopeças - Bomba de assistência hidráulica' },
  { code: '0100800', description: 'Autopeças - Mangueiras e tubos' },
  { code: '0100900', description: 'Autopeças - Catalisadores' },
  { code: '0101000', description: 'Autopeças - Condensadores' },
  
  // Pneus
  { code: '1000100', description: 'Pneus novos de borracha' },
  { code: '1000200', description: 'Pneus recauchutados' },
  { code: '1000300', description: 'Protetores de borracha' },
  
  // Câmaras de ar
  { code: '1000400', description: 'Câmaras de ar de borracha' },
  
  // Combustíveis e lubrificantes
  { code: '0600100', description: 'Óleos lubrificantes' },
  { code: '0600200', description: 'Graxas lubrificantes' },
  { code: '0600300', description: 'Óleos de petróleo ou minerais betuminosos' },
  { code: '0600400', description: 'Preparações lubrificantes' },
  { code: '0600500', description: 'Aditivos para óleos lubrificantes' },
  { code: '0600600', description: 'Fluidos para freios hidráulicos' },
  { code: '0600700', description: 'Preparações anticongelantes' },
  { code: '0600800', description: 'Líquidos para transmissões hidráulicas' },
  
  // Tintas
  { code: '1100100', description: 'Tintas, vernizes e outros' },
  { code: '1100200', description: 'Xadrez e pós assemelhados' },
  { code: '1100300', description: 'Massas para acabamento, pintura e vedação' },
  
  // Lâmpadas
  { code: '1800100', description: 'Lâmpadas elétricas' },
  { code: '1800200', description: 'Reatores para lâmpadas' },
  
  // Pilhas e baterias
  { code: '1900100', description: 'Pilhas e baterias de pilhas elétricas' },
  { code: '1900200', description: 'Acumuladores elétricos' },
  
  // Papéis
  { code: '1500100', description: 'Papéis de uso doméstico' },
  { code: '1500200', description: 'Papéis higiênicos' },
  
  // Ferramentas
  { code: '2000100', description: 'Ferramentas' },
  { code: '2000200', description: 'Máquinas e aparelhos de ar condicionado' },
];

// CFOP - Código Fiscal de Operações e Prestações
export const cfopCodes = [
  // Vendas dentro do estado
  { code: '5101', description: 'Venda de produção do estabelecimento' },
  { code: '5102', description: 'Venda de mercadoria adquirida ou recebida de terceiros' },
  { code: '5103', description: 'Venda de produção do estabelecimento, efetuada fora do estabelecimento' },
  { code: '5104', description: 'Venda de mercadoria adquirida ou recebida de terceiros, efetuada fora do estabelecimento' },
  { code: '5105', description: 'Venda de produção do estabelecimento que não deva por ele transitar' },
  { code: '5106', description: 'Venda de mercadoria adquirida ou recebida de terceiros, que não deva por ele transitar' },
  { code: '5109', description: 'Venda de produção do estabelecimento, destinada à Zona Franca de Manaus' },
  { code: '5110', description: 'Venda de mercadoria adquirida ou recebida de terceiros, destinada à Zona Franca de Manaus' },
  { code: '5116', description: 'Venda de produção do estabelecimento originada de encomenda para entrega futura' },
  { code: '5117', description: 'Venda de mercadoria adquirida ou recebida de terceiros, originada de encomenda para entrega futura' },
  { code: '5118', description: 'Venda de produção do estabelecimento entregue ao destinatário por conta e ordem do adquirente originário' },
  { code: '5119', description: 'Venda de mercadoria adquirida ou recebida de terceiros entregue ao destinatário por conta e ordem do adquirente originário' },
  { code: '5120', description: 'Venda de mercadoria adquirida ou recebida de terceiros entregue ao destinatário pelo vendedor remetente' },
  
  // Devoluções e retornos
  { code: '5201', description: 'Devolução de compra para industrialização' },
  { code: '5202', description: 'Devolução de compra para comercialização' },
  { code: '5205', description: 'Anulação de valor relativo à aquisição de serviço de comunicação' },
  { code: '5206', description: 'Anulação de valor relativo a aquisição de serviço de transporte' },
  { code: '5207', description: 'Anulação de valor relativo à compra de energia elétrica' },
  { code: '5208', description: 'Devolução de mercadoria recebida em transferência para industrialização' },
  { code: '5209', description: 'Devolução de mercadoria recebida em transferência para comercialização' },
  { code: '5210', description: 'Devolução de compra para utilização na prestação de serviço' },
  
  // Transferências
  { code: '5151', description: 'Transferência de produção do estabelecimento' },
  { code: '5152', description: 'Transferência de mercadoria adquirida ou recebida de terceiros' },
  { code: '5153', description: 'Transferência de energia elétrica' },
  { code: '5155', description: 'Transferência de produção do estabelecimento, que não deva por ele transitar' },
  { code: '5156', description: 'Transferência de mercadoria adquirida ou recebida de terceiros, que não deva por ele transitar' },
  
  // Vendas para outros estados
  { code: '6101', description: 'Venda de produção do estabelecimento (Interestadual)' },
  { code: '6102', description: 'Venda de mercadoria adquirida ou recebida de terceiros (Interestadual)' },
  { code: '6103', description: 'Venda de produção do estabelecimento, efetuada fora do estabelecimento (Interestadual)' },
  { code: '6104', description: 'Venda de mercadoria adquirida ou recebida de terceiros, efetuada fora do estabelecimento (Interestadual)' },
  { code: '6105', description: 'Venda de produção do estabelecimento que não deva por ele transitar (Interestadual)' },
  { code: '6106', description: 'Venda de mercadoria adquirida ou recebida de terceiros, que não deva por ele transitar (Interestadual)' },
  { code: '6107', description: 'Venda de produção do estabelecimento, destinada a não contribuinte (Interestadual)' },
  { code: '6108', description: 'Venda de mercadoria adquirida ou recebida de terceiros, destinada a não contribuinte (Interestadual)' },
  
  // Remessas para conserto
  { code: '5915', description: 'Remessa de mercadoria ou bem para conserto ou reparo' },
  { code: '5916', description: 'Retorno de mercadoria ou bem recebido para conserto ou reparo' },
  { code: '5917', description: 'Remessa de mercadoria em consignação mercantil ou industrial' },
  { code: '5918', description: 'Devolução de mercadoria recebida em consignação mercantil ou industrial' },
  { code: '5919', description: 'Devolução simbólica de mercadoria vendida ou utilizada em processo industrial' },
  { code: '5920', description: 'Remessa de vasilhame ou sacaria' },
  { code: '5921', description: 'Devolução de vasilhame ou sacaria' },
  { code: '5922', description: 'Lançamento efetuado a título de simples faturamento decorrente de venda para entrega futura' },
  { code: '5923', description: 'Remessa de mercadoria por conta e ordem de terceiros' },
  { code: '5924', description: 'Remessa para industrialização por conta e ordem do adquirente da mercadoria' },
  { code: '5925', description: 'Retorno de mercadoria recebida para industrialização por conta e ordem do adquirente da mercadoria' },
  
  // Prestação de serviços
  { code: '5933', description: 'Prestação de serviço tributado pelo ISSQN' },
  { code: '5949', description: 'Outra saída de mercadoria ou prestação de serviço não especificado' },
  
  // Simples Nacional
  { code: '5405', description: 'Venda de mercadoria adquirida ou recebida de terceiros em operação com mercadoria sujeita ao regime de substituição tributária' },
];

// CST/CSOSN - Código de Situação Tributária / Código de Situação da Operação no Simples Nacional
export const cstCodes = [
  // Regime Normal
  { code: '00', description: 'Tributada integralmente' },
  { code: '10', description: 'Tributada e com cobrança do ICMS por substituição tributária' },
  { code: '20', description: 'Com redução de base de cálculo' },
  { code: '30', description: 'Isenta ou não tributada e com cobrança do ICMS por substituição tributária' },
  { code: '40', description: 'Isenta' },
  { code: '41', description: 'Não tributada' },
  { code: '50', description: 'Suspensão' },
  { code: '51', description: 'Diferimento' },
  { code: '60', description: 'ICMS cobrado anteriormente por substituição tributária' },
  { code: '70', description: 'Com redução de base de cálculo e cobrança do ICMS por substituição tributária' },
  { code: '90', description: 'Outras' },
];

export const csosnCodes = [
  // Simples Nacional
  { code: '101', description: 'Tributada pelo Simples Nacional com permissão de crédito' },
  { code: '102', description: 'Tributada pelo Simples Nacional sem permissão de crédito' },
  { code: '103', description: 'Isenção do ICMS no Simples Nacional para faixa de receita bruta' },
  { code: '201', description: 'Tributada pelo Simples Nacional com permissão de crédito e com cobrança do ICMS por substituição tributária' },
  { code: '202', description: 'Tributada pelo Simples Nacional sem permissão de crédito e com cobrança do ICMS por substituição tributária' },
  { code: '203', description: 'Isenção do ICMS no Simples Nacional para faixa de receita bruta e com cobrança do ICMS por substituição tributária' },
  { code: '300', description: 'Imune' },
  { code: '400', description: 'Não tributada pelo Simples Nacional' },
  { code: '500', description: 'ICMS cobrado anteriormente por substituição tributária (substituído) ou por antecipação' },
  { code: '900', description: 'Outros' },
];

// Origem da Mercadoria
export const originCodes = [
  { code: '0', description: 'Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8' },
  { code: '1', description: 'Estrangeira - Importação direta, exceto a indicada no código 6' },
  { code: '2', description: 'Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7' },
  { code: '3', description: 'Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%' },
  { code: '4', description: 'Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos' },
  { code: '5', description: 'Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%' },
  { code: '6', description: 'Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX' },
  { code: '7', description: 'Estrangeira - Adquirida no mercado interno, sem similar nacional, constante em lista da CAMEX' },
  { code: '8', description: 'Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%' },
];

// Códigos ANP - Agência Nacional do Petróleo (apenas para combustíveis)
export const anpCodes = [
  { code: '810101001', description: 'Gasolina Automotiva Comum' },
  { code: '810101002', description: 'Gasolina Automotiva Premium' },
  { code: '810101003', description: 'Gasolina Automotiva Aditivada' },
  { code: '810201001', description: 'Óleo Diesel A S10' },
  { code: '810201002', description: 'Óleo Diesel A S500' },
  { code: '810201003', description: 'Óleo Diesel B S10' },
  { code: '810201004', description: 'Óleo Diesel B S500' },
  { code: '810301001', description: 'Gás Natural Veicular - GNV' },
  { code: '820101001', description: 'Etanol Hidratado Combustível' },
  { code: '820201001', description: 'Etanol Anidro Combustível' },
  { code: '830101001', description: 'Gás Liquefeito de Petróleo - GLP' },
  { code: '830201001', description: 'Gás Liquefeito de Petróleo - GLP Automotivo' },
  { code: '850101001', description: 'Óleo Lubrificante Automotivo' },
  { code: '850102001', description: 'Óleo Lubrificante Industrial' },
  { code: '850201001', description: 'Graxa Lubrificante' },
  { code: '850301001', description: 'Fluido de Freio' },
  { code: '850401001', description: 'Aditivo para Combustível' },
  { code: '850501001', description: 'Aditivo para Óleo Lubrificante' },
];

/**
 * Busca códigos por termo
 */
export const searchCodes = (codes, searchTerm) => {
  if (!searchTerm) return codes;
  const term = searchTerm.toLowerCase();
  return codes.filter(item => 
    item.code.toLowerCase().includes(term) ||
    item.description.toLowerCase().includes(term)
  );
};

/**
 * Formata código com descrição para exibição
 */
export const formatCodeWithDescription = (code, description) => {
  return `${code} - ${description}`;
};

/**
 * Obtém descrição de um código
 */
export const getCodeDescription = (codes, code) => {
  const found = codes.find(item => item.code === code);
  return found ? found.description : '';
};
