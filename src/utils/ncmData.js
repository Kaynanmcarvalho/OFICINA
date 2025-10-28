// NCMs mais comuns para oficinas de carros e motos
export const ncmList = [
    // Óleos e Lubrificantes
    { code: '27101932', description: 'Óleo lubrificante para motor de veículos' },
    { code: '27101939', description: 'Outros óleos lubrificantes' },
    { code: '27101941', description: 'Óleo para transmissão' },
    { code: '27101949', description: 'Outros óleos para transmissão' },
    { code: '27101951', description: 'Óleo para freios hidráulicos' },
    { code: '27101959', description: 'Outros óleos para freios' },
    { code: '27101990', description: 'Outros óleos lubrificantes' },
    { code: '34031100', description: 'Preparações para tratamento de matérias têxteis, couros' },
    { code: '34039900', description: 'Outras preparações lubrificantes' },

    // Pneus e Câmaras
    { code: '40111000', description: 'Pneus novos de borracha para automóveis de passageiros' },
    { code: '40112000', description: 'Pneus novos de borracha para ônibus ou caminhões' },
    { code: '40114000', description: 'Pneus novos de borracha para motocicletas' },
    { code: '40115000', description: 'Pneus novos de borracha para bicicletas' },
    { code: '40116100', description: 'Pneus para veículos e máquinas agrícolas' },
    { code: '40121100', description: 'Pneus recauchutados para automóveis' },
    { code: '40121200', description: 'Pneus recauchutados para ônibus ou caminhões' },
    { code: '40131000', description: 'Câmaras de ar de borracha para automóveis' },
    { code: '40132000', description: 'Câmaras de ar de borracha para bicicletas' },
    { code: '40139000', description: 'Outras câmaras de ar de borracha' },

    // Peças de Motor
    { code: '84099100', description: 'Partes de motores de pistão' },
    { code: '84099910', description: 'Blocos de cilindros, cabeçotes e cárteres' },
    { code: '84099990', description: 'Outras partes de motores' },
    { code: '84099991', description: 'Pistões' },
    { code: '84099992', description: 'Anéis de pistão' },
    { code: '84099993', description: 'Bielas' },
    { code: '84099994', description: 'Virabrequins' },
    { code: '84099995', description: 'Árvores de comando de válvulas' },
    { code: '84099996', description: 'Válvulas de admissão ou de escape' },
    { code: '84099999', description: 'Outras partes de motores' },

    // Filtros
    { code: '84212300', description: 'Aparelhos para filtrar óleos minerais' },
    { code: '84213100', description: 'Filtros de entrada de ar para motores' },
    { code: '84213910', description: 'Filtros de óleo' },
    { code: '84213990', description: 'Outros aparelhos para filtrar' },

    // Sistema de Freios
    { code: '87083010', description: 'Freios e servo-freios' },
    { code: '87083090', description: 'Outras partes de freios' },
    { code: '87083091', description: 'Cilindros mestre de freios' },
    { code: '87083092', description: 'Cilindros de roda' },
    { code: '87083093', description: 'Discos de freio' },
    { code: '87083094', description: 'Tambores de freio' },
    { code: '87083095', description: 'Pastilhas de freio' },
    { code: '87083096', description: 'Lonas de freio' },

    // Sistema de Suspensão
    { code: '87088010', description: 'Amortecedores de suspensão' },
    { code: '87088090', description: 'Outras partes de suspensão' },
    { code: '87088091', description: 'Molas de suspensão' },
    { code: '87088092', description: 'Barras estabilizadoras' },
    { code: '87088093', description: 'Braços de suspensão' },
    { code: '87088094', description: 'Pivôs de suspensão' },

    // Sistema Elétrico
    { code: '85114000', description: 'Motores de arranque' },
    { code: '85115000', description: 'Outros geradores (alternadores)' },
    { code: '85122000', description: 'Aparelhos elétricos de iluminação' },
    { code: '85122010', description: 'Faróis' },
    { code: '85122090', description: 'Outras lanternas e faróis' },
    { code: '85364100', description: 'Relés para tensão não superior a 60V' },
    { code: '85364900', description: 'Outros relés' },
    { code: '85371010', description: 'Quadros de comando' },
    { code: '85392110', description: 'Lâmpadas de faróis' },
    { code: '85392190', description: 'Outras lâmpadas' },
    { code: '85392910', description: 'Lâmpadas de LED' },
    { code: '85392990', description: 'Outras lâmpadas e tubos' },
    { code: '85442000', description: 'Cabos coaxiais' },
    { code: '85444900', description: 'Outros condutores elétricos' },

    // Baterias
    { code: '85071000', description: 'Acumuladores elétricos de chumbo' },
    { code: '85072000', description: 'Outros acumuladores de chumbo-ácido' },

    // Velas de Ignição
    { code: '85111000', description: 'Velas de ignição' },
    { code: '85113000', description: 'Bobinas de ignição' },

    // Carroceria e Acessórios
    { code: '87071000', description: 'Carrocerias para veículos automóveis' },
    { code: '87079010', description: 'Cabinas' },
    { code: '87079090', description: 'Outras carrocerias' },
    { code: '87081000', description: 'Para-choques' },
    { code: '87082100', description: 'Cintos de segurança' },
    { code: '87082910', description: 'Airbags' },
    { code: '87082990', description: 'Outras partes de segurança' },
    { code: '87084010', description: 'Caixas de marcha' },
    { code: '87084090', description: 'Outras caixas de transmissão' },
    { code: '87085010', description: 'Eixos com diferencial' },
    { code: '87085090', description: 'Outros eixos' },
    { code: '87087010', description: 'Rodas' },
    { code: '87087090', description: 'Outras rodas' },
    { code: '87089100', description: 'Radiadores' },
    { code: '87089200', description: 'Silenciosos e tubos de escape' },
    { code: '87089300', description: 'Embreagens' },
    { code: '87089400', description: 'Volantes, colunas e caixas de direção' },

    // Vidros e Espelhos
    { code: '70071100', description: 'Vidros temperados' },
    { code: '70071900', description: 'Outros vidros de segurança' },
    { code: '70091000', description: 'Espelhos retrovisores' },

    // Correias e Mangueiras
    { code: '40103100', description: 'Correias de transmissão' },
    { code: '40103900', description: 'Outras correias transportadoras' },
    { code: '40094100', description: 'Tubos de borracha vulcanizada reforçados' },
    { code: '40094200', description: 'Tubos de borracha vulcanizada com acessórios' },
    { code: '40094900', description: 'Outros tubos de borracha' },

    // Juntas e Retentores
    { code: '40169300', description: 'Juntas de borracha vulcanizada' },
    { code: '40169990', description: 'Outras obras de borracha vulcanizada' },

    // Ferramentas
    { code: '82041100', description: 'Chaves de porcas, manuais' },
    { code: '82041200', description: 'Chaves de caixa' },
    { code: '82042000', description: 'Chaves de fenda' },
    { code: '82051000', description: 'Ferramentas de furar ou de roscar' },
    { code: '82052000', description: 'Martelos e marretas' },
    { code: '82053000', description: 'Plainas, formões, goivas' },
    { code: '82054000', description: 'Chaves de fenda' },
    { code: '82055100', description: 'Ferramentas de uso doméstico' },
    { code: '82055900', description: 'Outras ferramentas manuais' },
];

// Função para buscar NCMs
export const searchNCM = (query) => {
    if (!query || query.length < 2) return [];

    const searchTerm = query.toLowerCase();

    return ncmList.filter(ncm =>
        ncm.code.includes(searchTerm) ||
        ncm.description.toLowerCase().includes(searchTerm)
    ).slice(0, 10); // Limitar a 10 resultados
};

// Função para obter NCM por código
export const getNCMByCode = (code) => {
    return ncmList.find(ncm => ncm.code === code);
};
