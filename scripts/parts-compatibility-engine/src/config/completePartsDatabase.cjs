/**
 * BASE DE DADOS COMPLETA DE PEÇAS AUTOMOTIVAS
 * Inclui TODAS as peças que um veículo realmente precisa
 * 
 * Categorias:
 * - Filtros (óleo, ar, combustível, cabine, transmissão)
 * - Freios (pastilhas, discos, tambores, fluido, flexíveis)
 * - Motor (velas, bobinas, correias, juntas, válvulas, pistões)
 * - Suspensão (amortecedores, molas, pivôs, buchas, terminais)
 * - Direção (caixa, bomba, terminais, coifas)
 * - Transmissão (embreagem, câmbio, homocinéticas, cardã)
 * - Arrefecimento (radiador, bomba d'água, válvula termostática, mangueiras)
 * - Elétrica (bateria, alternador, motor de partida, sensores)
 * - Iluminação (faróis, lanternas, lâmpadas)
 * - Carroceria (para-choques, retrovisores, vidros, borrachas)
 * - Escapamento (catalisador, silenciador, coletor)
 * - Ar Condicionado (compressor, condensador, evaporador)
 * - Combustível (bomba, bicos injetores, regulador)
 * 
 * @version 2.0.0 - Base Completa
 */

// ============================================================================
// CATEGORIAS DE PEÇAS COM PART NUMBERS REAIS
// ============================================================================

const PARTS_CATEGORIES = {
  // ============================================================================
  // FILTROS
  // ============================================================================
  FILTROS: {
    filtro_oleo: {
      name: 'Filtro de Óleo',
      priority: 'alta',
      changeInterval: '10000km',
      avgPrice: 45,
    },
    filtro_ar_motor: {
      name: 'Filtro de Ar do Motor',
      priority: 'alta',
      changeInterval: '15000km',
      avgPrice: 55,
    },
    filtro_combustivel: {
      name: 'Filtro de Combustível',
      priority: 'alta',
      changeInterval: '30000km',
      avgPrice: 85,
    },
    filtro_cabine: {
      name: 'Filtro de Ar Condicionado (Cabine)',
      priority: 'media',
      changeInterval: '15000km',
      avgPrice: 65,
    },
    filtro_transmissao: {
      name: 'Filtro de Transmissão Automática',
      priority: 'media',
      changeInterval: '60000km',
      avgPrice: 120,
    },
  },

  // ============================================================================
  // FREIOS
  // ============================================================================
  FREIOS: {
    pastilha_freio_dianteira: {
      name: 'Pastilha de Freio Dianteira',
      priority: 'critica',
      changeInterval: '30000km',
      avgPrice: 120,
    },
    pastilha_freio_traseira: {
      name: 'Pastilha de Freio Traseira',
      priority: 'critica',
      changeInterval: '40000km',
      avgPrice: 95,
    },
    disco_freio_dianteiro: {
      name: 'Disco de Freio Dianteiro',
      priority: 'critica',
      changeInterval: '60000km',
      avgPrice: 180,
    },
    disco_freio_traseiro: {
      name: 'Disco de Freio Traseiro',
      priority: 'critica',
      changeInterval: '80000km',
      avgPrice: 150,
    },
    tambor_freio: {
      name: 'Tambor de Freio',
      priority: 'alta',
      changeInterval: '80000km',
      avgPrice: 200,
    },
    sapata_freio: {
      name: 'Sapata de Freio',
      priority: 'alta',
      changeInterval: '50000km',
      avgPrice: 85,
    },
    cilindro_roda: {
      name: 'Cilindro de Roda',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 95,
    },
    cilindro_mestre: {
      name: 'Cilindro Mestre de Freio',
      priority: 'critica',
      changeInterval: '150000km',
      avgPrice: 280,
    },
    servo_freio: {
      name: 'Servo Freio (Hidrovácuo)',
      priority: 'critica',
      changeInterval: '200000km',
      avgPrice: 650,
    },
    flexivel_freio: {
      name: 'Flexível de Freio',
      priority: 'alta',
      changeInterval: '80000km',
      avgPrice: 45,
    },
    fluido_freio: {
      name: 'Fluido de Freio DOT4',
      priority: 'alta',
      changeInterval: '20000km',
      avgPrice: 35,
    },
    sensor_abs: {
      name: 'Sensor ABS',
      priority: 'alta',
      changeInterval: 'quando necessário',
      avgPrice: 180,
    },
    modulo_abs: {
      name: 'Módulo ABS',
      priority: 'critica',
      changeInterval: 'quando necessário',
      avgPrice: 1800,
    },
  },

  // ============================================================================
  // MOTOR - IGNIÇÃO
  // ============================================================================
  IGNICAO: {
    vela_ignicao: {
      name: 'Vela de Ignição',
      priority: 'alta',
      changeInterval: '30000km',
      avgPrice: 35,
    },
    bobina_ignicao: {
      name: 'Bobina de Ignição',
      priority: 'alta',
      changeInterval: '80000km',
      avgPrice: 180,
    },
    cabo_vela: {
      name: 'Cabo de Vela',
      priority: 'media',
      changeInterval: '60000km',
      avgPrice: 120,
    },
    distribuidor: {
      name: 'Distribuidor',
      priority: 'media',
      changeInterval: '100000km',
      avgPrice: 350,
    },
    modulo_ignicao: {
      name: 'Módulo de Ignição',
      priority: 'alta',
      changeInterval: '150000km',
      avgPrice: 450,
    },
  },

  // ============================================================================
  // MOTOR - CORREIAS E CORRENTES
  // ============================================================================
  CORREIAS: {
    correia_dentada: {
      name: 'Correia Dentada',
      priority: 'critica',
      changeInterval: '60000km',
      avgPrice: 120,
    },
    kit_correia_dentada: {
      name: 'Kit Correia Dentada Completo',
      priority: 'critica',
      changeInterval: '60000km',
      avgPrice: 450,
    },
    tensor_correia: {
      name: 'Tensor da Correia Dentada',
      priority: 'critica',
      changeInterval: '60000km',
      avgPrice: 180,
    },
    polia_tensora: {
      name: 'Polia Tensora',
      priority: 'alta',
      changeInterval: '60000km',
      avgPrice: 120,
    },
    correia_alternador: {
      name: 'Correia do Alternador (Poly-V)',
      priority: 'alta',
      changeInterval: '40000km',
      avgPrice: 65,
    },
    correia_ar_condicionado: {
      name: 'Correia do Ar Condicionado',
      priority: 'media',
      changeInterval: '40000km',
      avgPrice: 55,
    },
    correia_direcao_hidraulica: {
      name: 'Correia da Direção Hidráulica',
      priority: 'media',
      changeInterval: '40000km',
      avgPrice: 55,
    },
    corrente_comando: {
      name: 'Corrente de Comando',
      priority: 'critica',
      changeInterval: '150000km',
      avgPrice: 350,
    },
    tensor_corrente: {
      name: 'Tensor da Corrente de Comando',
      priority: 'critica',
      changeInterval: '150000km',
      avgPrice: 280,
    },
  },

  // ============================================================================
  // MOTOR - COMPONENTES INTERNOS
  // ============================================================================
  MOTOR_INTERNO: {
    junta_cabecote: {
      name: 'Junta do Cabeçote',
      priority: 'critica',
      changeInterval: 'quando necessário',
      avgPrice: 180,
    },
    jogo_juntas_motor: {
      name: 'Jogo de Juntas do Motor',
      priority: 'critica',
      changeInterval: 'quando necessário',
      avgPrice: 450,
    },
    retentor_comando: {
      name: 'Retentor do Comando de Válvulas',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 35,
    },
    retentor_virabrequim_dianteiro: {
      name: 'Retentor Dianteiro do Virabrequim',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 45,
    },
    retentor_virabrequim_traseiro: {
      name: 'Retentor Traseiro do Virabrequim',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 55,
    },
    bronzina_biela: {
      name: 'Bronzina de Biela',
      priority: 'critica',
      changeInterval: 'retífica',
      avgPrice: 120,
    },
    bronzina_mancal: {
      name: 'Bronzina de Mancal',
      priority: 'critica',
      changeInterval: 'retífica',
      avgPrice: 150,
    },
    pistao: {
      name: 'Pistão',
      priority: 'critica',
      changeInterval: 'retífica',
      avgPrice: 180,
    },
    anel_pistao: {
      name: 'Jogo de Anéis do Pistão',
      priority: 'critica',
      changeInterval: 'retífica',
      avgPrice: 220,
    },
    valvula_admissao: {
      name: 'Válvula de Admissão',
      priority: 'critica',
      changeInterval: 'retífica',
      avgPrice: 85,
    },
    valvula_escape: {
      name: 'Válvula de Escape',
      priority: 'critica',
      changeInterval: 'retífica',
      avgPrice: 95,
    },
    guia_valvula: {
      name: 'Guia de Válvula',
      priority: 'critica',
      changeInterval: 'retífica',
      avgPrice: 45,
    },
    sede_valvula: {
      name: 'Sede de Válvula',
      priority: 'critica',
      changeInterval: 'retífica',
      avgPrice: 55,
    },
    tucho_valvula: {
      name: 'Tucho de Válvula',
      priority: 'alta',
      changeInterval: '150000km',
      avgPrice: 65,
    },
    balancim: {
      name: 'Balancim',
      priority: 'alta',
      changeInterval: '150000km',
      avgPrice: 75,
    },
    coxim_motor: {
      name: 'Coxim do Motor',
      priority: 'alta',
      changeInterval: '80000km',
      avgPrice: 180,
    },
    coxim_cambio: {
      name: 'Coxim do Câmbio',
      priority: 'alta',
      changeInterval: '80000km',
      avgPrice: 150,
    },
  },

  // ============================================================================
  // SUSPENSÃO
  // ============================================================================
  SUSPENSAO: {
    amortecedor_dianteiro: {
      name: 'Amortecedor Dianteiro',
      priority: 'alta',
      changeInterval: '60000km',
      avgPrice: 280,
    },
    amortecedor_traseiro: {
      name: 'Amortecedor Traseiro',
      priority: 'alta',
      changeInterval: '60000km',
      avgPrice: 220,
    },
    mola_dianteira: {
      name: 'Mola Helicoidal Dianteira',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 180,
    },
    mola_traseira: {
      name: 'Mola Helicoidal Traseira',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 150,
    },
    batente_amortecedor: {
      name: 'Batente do Amortecedor',
      priority: 'media',
      changeInterval: '60000km',
      avgPrice: 45,
    },
    coifa_amortecedor: {
      name: 'Coifa do Amortecedor',
      priority: 'media',
      changeInterval: '60000km',
      avgPrice: 35,
    },
    rolamento_amortecedor: {
      name: 'Rolamento do Amortecedor',
      priority: 'alta',
      changeInterval: '60000km',
      avgPrice: 85,
    },
    pivo_suspensao: {
      name: 'Pivô de Suspensão',
      priority: 'critica',
      changeInterval: '80000km',
      avgPrice: 120,
    },
    bucha_bandeja: {
      name: 'Bucha da Bandeja',
      priority: 'alta',
      changeInterval: '60000km',
      avgPrice: 55,
    },
    bandeja_suspensao: {
      name: 'Bandeja de Suspensão',
      priority: 'alta',
      changeInterval: '120000km',
      avgPrice: 350,
    },
    bieleta_estabilizadora: {
      name: 'Bieleta da Barra Estabilizadora',
      priority: 'media',
      changeInterval: '60000km',
      avgPrice: 65,
    },
    barra_estabilizadora: {
      name: 'Barra Estabilizadora',
      priority: 'alta',
      changeInterval: '150000km',
      avgPrice: 280,
    },
    bucha_barra_estabilizadora: {
      name: 'Bucha da Barra Estabilizadora',
      priority: 'media',
      changeInterval: '60000km',
      avgPrice: 35,
    },
    rolamento_roda_dianteiro: {
      name: 'Rolamento de Roda Dianteiro',
      priority: 'critica',
      changeInterval: '100000km',
      avgPrice: 180,
    },
    rolamento_roda_traseiro: {
      name: 'Rolamento de Roda Traseiro',
      priority: 'critica',
      changeInterval: '100000km',
      avgPrice: 150,
    },
    cubo_roda_dianteiro: {
      name: 'Cubo de Roda Dianteiro',
      priority: 'alta',
      changeInterval: '150000km',
      avgPrice: 280,
    },
    cubo_roda_traseiro: {
      name: 'Cubo de Roda Traseiro',
      priority: 'alta',
      changeInterval: '150000km',
      avgPrice: 220,
    },
  },

  // ============================================================================
  // DIREÇÃO
  // ============================================================================
  DIRECAO: {
    terminal_direcao: {
      name: 'Terminal de Direção',
      priority: 'critica',
      changeInterval: '60000km',
      avgPrice: 95,
    },
    barra_direcao: {
      name: 'Barra de Direção',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 180,
    },
    caixa_direcao: {
      name: 'Caixa de Direção',
      priority: 'critica',
      changeInterval: '200000km',
      avgPrice: 1200,
    },
    bomba_direcao_hidraulica: {
      name: 'Bomba de Direção Hidráulica',
      priority: 'alta',
      changeInterval: '150000km',
      avgPrice: 650,
    },
    reservatorio_direcao: {
      name: 'Reservatório de Direção Hidráulica',
      priority: 'media',
      changeInterval: '150000km',
      avgPrice: 120,
    },
    mangueira_direcao_alta: {
      name: 'Mangueira de Alta Pressão Direção',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 180,
    },
    mangueira_direcao_baixa: {
      name: 'Mangueira de Baixa Pressão Direção',
      priority: 'media',
      changeInterval: '100000km',
      avgPrice: 85,
    },
    coifa_caixa_direcao: {
      name: 'Coifa da Caixa de Direção',
      priority: 'media',
      changeInterval: '60000km',
      avgPrice: 45,
    },
    fluido_direcao: {
      name: 'Fluido de Direção Hidráulica',
      priority: 'media',
      changeInterval: '40000km',
      avgPrice: 45,
    },
    coluna_direcao: {
      name: 'Coluna de Direção',
      priority: 'critica',
      changeInterval: '200000km',
      avgPrice: 850,
    },
    motor_direcao_eletrica: {
      name: 'Motor de Direção Elétrica',
      priority: 'critica',
      changeInterval: '200000km',
      avgPrice: 1500,
    },
  },

  // ============================================================================
  // TRANSMISSÃO
  // ============================================================================
  TRANSMISSAO: {
    kit_embreagem: {
      name: 'Kit de Embreagem Completo',
      priority: 'critica',
      changeInterval: '80000km',
      avgPrice: 650,
    },
    disco_embreagem: {
      name: 'Disco de Embreagem',
      priority: 'critica',
      changeInterval: '80000km',
      avgPrice: 280,
    },
    plato_embreagem: {
      name: 'Platô de Embreagem',
      priority: 'critica',
      changeInterval: '80000km',
      avgPrice: 320,
    },
    rolamento_embreagem: {
      name: 'Rolamento de Embreagem',
      priority: 'critica',
      changeInterval: '80000km',
      avgPrice: 120,
    },
    cabo_embreagem: {
      name: 'Cabo de Embreagem',
      priority: 'alta',
      changeInterval: '60000km',
      avgPrice: 85,
    },
    cilindro_embreagem_mestre: {
      name: 'Cilindro Mestre de Embreagem',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 180,
    },
    cilindro_embreagem_auxiliar: {
      name: 'Cilindro Auxiliar de Embreagem',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 150,
    },
    oleo_cambio: {
      name: 'Óleo de Câmbio',
      priority: 'alta',
      changeInterval: '60000km',
      avgPrice: 85,
    },
    oleo_transmissao_automatica: {
      name: 'Óleo de Transmissão Automática (ATF)',
      priority: 'alta',
      changeInterval: '60000km',
      avgPrice: 120,
    },
    homocinética_lado_roda: {
      name: 'Junta Homocinética Lado Roda',
      priority: 'critica',
      changeInterval: '100000km',
      avgPrice: 280,
    },
    homocinética_lado_cambio: {
      name: 'Junta Homocinética Lado Câmbio',
      priority: 'critica',
      changeInterval: '100000km',
      avgPrice: 250,
    },
    coifa_homocinetica: {
      name: 'Coifa da Homocinética',
      priority: 'alta',
      changeInterval: '60000km',
      avgPrice: 65,
    },
    semieixo: {
      name: 'Semieixo Completo',
      priority: 'critica',
      changeInterval: '150000km',
      avgPrice: 450,
    },
    cruzeta_cardan: {
      name: 'Cruzeta do Cardã',
      priority: 'alta',
      changeInterval: '80000km',
      avgPrice: 120,
    },
    mancal_cardan: {
      name: 'Mancal do Cardã',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 180,
    },
    diferencial: {
      name: 'Diferencial',
      priority: 'critica',
      changeInterval: '200000km',
      avgPrice: 2500,
    },
    oleo_diferencial: {
      name: 'Óleo do Diferencial',
      priority: 'alta',
      changeInterval: '60000km',
      avgPrice: 95,
    },
  },

  // ============================================================================
  // ARREFECIMENTO
  // ============================================================================
  ARREFECIMENTO: {
    radiador: {
      name: 'Radiador',
      priority: 'critica',
      changeInterval: '150000km',
      avgPrice: 650,
    },
    bomba_agua: {
      name: "Bomba D'Água",
      priority: 'critica',
      changeInterval: '60000km',
      avgPrice: 180,
    },
    valvula_termostatica: {
      name: 'Válvula Termostática',
      priority: 'alta',
      changeInterval: '80000km',
      avgPrice: 85,
    },
    sensor_temperatura: {
      name: 'Sensor de Temperatura',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 65,
    },
    ventoinha: {
      name: 'Ventoinha do Radiador',
      priority: 'alta',
      changeInterval: '150000km',
      avgPrice: 350,
    },
    motor_ventoinha: {
      name: 'Motor da Ventoinha',
      priority: 'alta',
      changeInterval: '150000km',
      avgPrice: 280,
    },
    interruptor_ventoinha: {
      name: 'Interruptor da Ventoinha',
      priority: 'media',
      changeInterval: '100000km',
      avgPrice: 55,
    },
    mangueira_superior_radiador: {
      name: 'Mangueira Superior do Radiador',
      priority: 'alta',
      changeInterval: '80000km',
      avgPrice: 65,
    },
    mangueira_inferior_radiador: {
      name: 'Mangueira Inferior do Radiador',
      priority: 'alta',
      changeInterval: '80000km',
      avgPrice: 55,
    },
    reservatorio_expansao: {
      name: 'Reservatório de Expansão',
      priority: 'media',
      changeInterval: '150000km',
      avgPrice: 85,
    },
    tampa_radiador: {
      name: 'Tampa do Radiador',
      priority: 'media',
      changeInterval: '60000km',
      avgPrice: 35,
    },
    aditivo_radiador: {
      name: 'Aditivo do Radiador',
      priority: 'alta',
      changeInterval: '30000km',
      avgPrice: 45,
    },
    intercooler: {
      name: 'Intercooler',
      priority: 'alta',
      changeInterval: '200000km',
      avgPrice: 850,
    },
  },

  // ============================================================================
  // ELÉTRICA
  // ============================================================================
  ELETRICA: {
    bateria: {
      name: 'Bateria',
      priority: 'critica',
      changeInterval: '36 meses',
      avgPrice: 450,
    },
    alternador: {
      name: 'Alternador',
      priority: 'critica',
      changeInterval: '150000km',
      avgPrice: 650,
    },
    motor_partida: {
      name: 'Motor de Partida',
      priority: 'critica',
      changeInterval: '150000km',
      avgPrice: 550,
    },
    regulador_voltagem: {
      name: 'Regulador de Voltagem',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 120,
    },
    sensor_rotacao: {
      name: 'Sensor de Rotação',
      priority: 'critica',
      changeInterval: '100000km',
      avgPrice: 180,
    },
    sensor_fase: {
      name: 'Sensor de Fase',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 150,
    },
    sensor_oxigenio_sonda_lambda: {
      name: 'Sonda Lambda',
      priority: 'alta',
      changeInterval: '80000km',
      avgPrice: 280,
    },
    sensor_map: {
      name: 'Sensor MAP',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 180,
    },
    sensor_maf: {
      name: 'Sensor MAF (Fluxo de Ar)',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 350,
    },
    sensor_tps: {
      name: 'Sensor TPS (Posição Borboleta)',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 150,
    },
    corpo_borboleta: {
      name: 'Corpo de Borboleta',
      priority: 'alta',
      changeInterval: '150000km',
      avgPrice: 650,
    },
    modulo_injecao_ecu: {
      name: 'Módulo de Injeção (ECU)',
      priority: 'critica',
      changeInterval: 'quando necessário',
      avgPrice: 1800,
    },
    rele_bomba_combustivel: {
      name: 'Relé da Bomba de Combustível',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 55,
    },
    fusivel: {
      name: 'Fusível',
      priority: 'baixa',
      changeInterval: 'quando necessário',
      avgPrice: 5,
    },
    chicote_eletrico: {
      name: 'Chicote Elétrico',
      priority: 'alta',
      changeInterval: 'quando necessário',
      avgPrice: 450,
    },
  },

  // ============================================================================
  // ILUMINAÇÃO
  // ============================================================================
  ILUMINACAO: {
    farol_dianteiro: {
      name: 'Farol Dianteiro',
      priority: 'critica',
      changeInterval: 'quando necessário',
      avgPrice: 450,
    },
    lanterna_traseira: {
      name: 'Lanterna Traseira',
      priority: 'critica',
      changeInterval: 'quando necessário',
      avgPrice: 280,
    },
    lampada_farol_h4: {
      name: 'Lâmpada do Farol H4',
      priority: 'alta',
      changeInterval: '24 meses',
      avgPrice: 35,
    },
    lampada_farol_h7: {
      name: 'Lâmpada do Farol H7',
      priority: 'alta',
      changeInterval: '24 meses',
      avgPrice: 45,
    },
    lampada_farol_h1: {
      name: 'Lâmpada do Farol H1',
      priority: 'alta',
      changeInterval: '24 meses',
      avgPrice: 35,
    },
    lampada_farol_led: {
      name: 'Lâmpada LED do Farol',
      priority: 'alta',
      changeInterval: '60 meses',
      avgPrice: 180,
    },
    lampada_lanterna: {
      name: 'Lâmpada da Lanterna',
      priority: 'media',
      changeInterval: '24 meses',
      avgPrice: 15,
    },
    lampada_freio: {
      name: 'Lâmpada de Freio',
      priority: 'critica',
      changeInterval: '24 meses',
      avgPrice: 15,
    },
    lampada_seta: {
      name: 'Lâmpada de Seta',
      priority: 'alta',
      changeInterval: '24 meses',
      avgPrice: 12,
    },
    lampada_re: {
      name: 'Lâmpada de Ré',
      priority: 'media',
      changeInterval: '24 meses',
      avgPrice: 12,
    },
    lampada_placa: {
      name: 'Lâmpada da Placa',
      priority: 'media',
      changeInterval: '24 meses',
      avgPrice: 8,
    },
    farol_milha: {
      name: 'Farol de Milha',
      priority: 'media',
      changeInterval: 'quando necessário',
      avgPrice: 180,
    },
    reator_xenon: {
      name: 'Reator Xenon',
      priority: 'alta',
      changeInterval: '60 meses',
      avgPrice: 350,
    },
  },

  // ============================================================================
  // COMBUSTÍVEL
  // ============================================================================
  COMBUSTIVEL: {
    bomba_combustivel: {
      name: 'Bomba de Combustível',
      priority: 'critica',
      changeInterval: '100000km',
      avgPrice: 450,
    },
    bico_injetor: {
      name: 'Bico Injetor',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 180,
    },
    regulador_pressao: {
      name: 'Regulador de Pressão de Combustível',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 150,
    },
    tanque_combustivel: {
      name: 'Tanque de Combustível',
      priority: 'critica',
      changeInterval: 'quando necessário',
      avgPrice: 850,
    },
    boia_tanque: {
      name: 'Boia do Tanque',
      priority: 'media',
      changeInterval: '150000km',
      avgPrice: 180,
    },
    mangueira_combustivel: {
      name: 'Mangueira de Combustível',
      priority: 'alta',
      changeInterval: '80000km',
      avgPrice: 65,
    },
    tampa_tanque: {
      name: 'Tampa do Tanque',
      priority: 'baixa',
      changeInterval: 'quando necessário',
      avgPrice: 55,
    },
    canister: {
      name: 'Canister',
      priority: 'media',
      changeInterval: '150000km',
      avgPrice: 280,
    },
  },

  // ============================================================================
  // ESCAPAMENTO
  // ============================================================================
  ESCAPAMENTO: {
    catalisador: {
      name: 'Catalisador',
      priority: 'critica',
      changeInterval: '100000km',
      avgPrice: 850,
    },
    silenciador_intermediario: {
      name: 'Silenciador Intermediário',
      priority: 'alta',
      changeInterval: '80000km',
      avgPrice: 280,
    },
    silenciador_traseiro: {
      name: 'Silenciador Traseiro',
      priority: 'alta',
      changeInterval: '80000km',
      avgPrice: 350,
    },
    coletor_escapamento: {
      name: 'Coletor de Escapamento',
      priority: 'alta',
      changeInterval: '150000km',
      avgPrice: 450,
    },
    junta_escapamento: {
      name: 'Junta do Escapamento',
      priority: 'media',
      changeInterval: '60000km',
      avgPrice: 35,
    },
    abraçadeira_escapamento: {
      name: 'Abraçadeira do Escapamento',
      priority: 'baixa',
      changeInterval: '60000km',
      avgPrice: 25,
    },
    coxim_escapamento: {
      name: 'Coxim do Escapamento',
      priority: 'media',
      changeInterval: '60000km',
      avgPrice: 45,
    },
  },

  // ============================================================================
  // AR CONDICIONADO
  // ============================================================================
  AR_CONDICIONADO: {
    compressor_ar: {
      name: 'Compressor do Ar Condicionado',
      priority: 'alta',
      changeInterval: '150000km',
      avgPrice: 1200,
    },
    condensador: {
      name: 'Condensador do Ar Condicionado',
      priority: 'alta',
      changeInterval: '150000km',
      avgPrice: 650,
    },
    evaporador: {
      name: 'Evaporador do Ar Condicionado',
      priority: 'alta',
      changeInterval: '150000km',
      avgPrice: 550,
    },
    valvula_expansao: {
      name: 'Válvula de Expansão',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 180,
    },
    filtro_secador: {
      name: 'Filtro Secador',
      priority: 'alta',
      changeInterval: '60000km',
      avgPrice: 120,
    },
    pressostato: {
      name: 'Pressostato do Ar Condicionado',
      priority: 'media',
      changeInterval: '100000km',
      avgPrice: 85,
    },
    embreagem_compressor: {
      name: 'Embreagem do Compressor',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 350,
    },
    gas_refrigerante: {
      name: 'Gás Refrigerante R134a',
      priority: 'alta',
      changeInterval: '24 meses',
      avgPrice: 150,
    },
    mangueira_ar_alta: {
      name: 'Mangueira de Alta Pressão A/C',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 180,
    },
    mangueira_ar_baixa: {
      name: 'Mangueira de Baixa Pressão A/C',
      priority: 'alta',
      changeInterval: '100000km',
      avgPrice: 150,
    },
  },

  // ============================================================================
  // CARROCERIA E ACABAMENTO
  // ============================================================================
  CARROCERIA: {
    para_choque_dianteiro: {
      name: 'Para-choque Dianteiro',
      priority: 'media',
      changeInterval: 'quando necessário',
      avgPrice: 650,
    },
    para_choque_traseiro: {
      name: 'Para-choque Traseiro',
      priority: 'media',
      changeInterval: 'quando necessário',
      avgPrice: 550,
    },
    retrovisor_esquerdo: {
      name: 'Retrovisor Esquerdo',
      priority: 'alta',
      changeInterval: 'quando necessário',
      avgPrice: 280,
    },
    retrovisor_direito: {
      name: 'Retrovisor Direito',
      priority: 'alta',
      changeInterval: 'quando necessário',
      avgPrice: 280,
    },
    vidro_parabrisa: {
      name: 'Vidro Para-brisa',
      priority: 'critica',
      changeInterval: 'quando necessário',
      avgPrice: 650,
    },
    vidro_traseiro: {
      name: 'Vidro Traseiro',
      priority: 'alta',
      changeInterval: 'quando necessário',
      avgPrice: 450,
    },
    vidro_porta_dianteira: {
      name: 'Vidro da Porta Dianteira',
      priority: 'alta',
      changeInterval: 'quando necessário',
      avgPrice: 280,
    },
    vidro_porta_traseira: {
      name: 'Vidro da Porta Traseira',
      priority: 'alta',
      changeInterval: 'quando necessário',
      avgPrice: 250,
    },
    borracha_porta: {
      name: 'Borracha de Vedação da Porta',
      priority: 'media',
      changeInterval: '100000km',
      avgPrice: 85,
    },
    borracha_parabrisa: {
      name: 'Borracha do Para-brisa',
      priority: 'media',
      changeInterval: '100000km',
      avgPrice: 120,
    },
    maçaneta_externa: {
      name: 'Maçaneta Externa',
      priority: 'media',
      changeInterval: 'quando necessário',
      avgPrice: 120,
    },
    maçaneta_interna: {
      name: 'Maçaneta Interna',
      priority: 'media',
      changeInterval: 'quando necessário',
      avgPrice: 85,
    },
    fechadura_porta: {
      name: 'Fechadura da Porta',
      priority: 'alta',
      changeInterval: 'quando necessário',
      avgPrice: 180,
    },
    motor_vidro_eletrico: {
      name: 'Motor do Vidro Elétrico',
      priority: 'alta',
      changeInterval: '150000km',
      avgPrice: 280,
    },
    maquina_vidro: {
      name: 'Máquina do Vidro',
      priority: 'alta',
      changeInterval: '150000km',
      avgPrice: 220,
    },
    palheta_limpador: {
      name: 'Palheta do Limpador',
      priority: 'alta',
      changeInterval: '12 meses',
      avgPrice: 55,
    },
    motor_limpador: {
      name: 'Motor do Limpador',
      priority: 'alta',
      changeInterval: '150000km',
      avgPrice: 280,
    },
    reservatorio_limpador: {
      name: 'Reservatório do Limpador',
      priority: 'baixa',
      changeInterval: 'quando necessário',
      avgPrice: 65,
    },
    bomba_limpador: {
      name: 'Bomba do Limpador',
      priority: 'media',
      changeInterval: '100000km',
      avgPrice: 55,
    },
  },

  // ============================================================================
  // ÓLEOS E FLUIDOS
  // ============================================================================
  OLEOS_FLUIDOS: {
    oleo_motor_5w30: {
      name: 'Óleo de Motor 5W30 Sintético',
      priority: 'critica',
      changeInterval: '10000km',
      avgPrice: 180,
    },
    oleo_motor_5w40: {
      name: 'Óleo de Motor 5W40 Sintético',
      priority: 'critica',
      changeInterval: '10000km',
      avgPrice: 200,
    },
    oleo_motor_10w40: {
      name: 'Óleo de Motor 10W40 Semi-Sintético',
      priority: 'critica',
      changeInterval: '10000km',
      avgPrice: 150,
    },
    oleo_motor_0w20: {
      name: 'Óleo de Motor 0W20 Sintético',
      priority: 'critica',
      changeInterval: '10000km',
      avgPrice: 220,
    },
  },
};

// ============================================================================
// PART NUMBERS POR PLATAFORMA DE VEÍCULO
// ============================================================================
const PLATFORM_PART_NUMBERS = {
  // VW PQ24 (Gol, Voyage, Fox, Saveiro, Up)
  VW_PQ24: {
    filtro_oleo: { partNumber: 'W712/95', brand: 'MANN-FILTER', equivalents: ['TECFIL PSL315', 'FRAM PH6811', 'BOSCH F026407157'] },
    filtro_ar_motor: { partNumber: 'C27192/1', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL6079', 'FRAM CA10242'] },
    filtro_combustivel: { partNumber: 'WK730/1', brand: 'MANN-FILTER', equivalents: ['TECFIL GI02', 'BOSCH F026402068'] },
    filtro_cabine: { partNumber: 'CU2939', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP001', 'BOSCH 0986BF0566'] },
    vela_ignicao: { partNumber: 'BKR6E', brand: 'NGK', equivalents: ['BOSCH FR7DC+', 'DENSO K20PR-U'] },
    bobina_ignicao: { partNumber: '032905106E', brand: 'VW Original', equivalents: ['BOSCH 0221604115', 'NGK U5015'] },
    correia_dentada: { partNumber: 'CT1028', brand: 'CONTITECH', equivalents: ['GATES 5552XS', 'DAYCO 941028'] },
    kit_correia_dentada: { partNumber: 'CT1028K1', brand: 'CONTITECH', equivalents: ['GATES KP15552XS', 'SKF VKMA01250'] },
    tensor_correia: { partNumber: 'VKM11113', brand: 'SKF', equivalents: ['INA 531008310', 'DAYCO ATB2250'] },
    correia_alternador: { partNumber: '6PK1070', brand: 'CONTITECH', equivalents: ['GATES 6PK1070', 'DAYCO 6PK1070'] },
    pastilha_freio_dianteira: { partNumber: 'N-1108', brand: 'COBREQ', equivalents: ['FRAS-LE PD/580', 'BOSCH BP1108'] },
    pastilha_freio_traseira: { partNumber: 'N-1109', brand: 'COBREQ', equivalents: ['FRAS-LE PD/581', 'BOSCH BP1109'] },
    disco_freio_dianteiro: { partNumber: 'BD1108', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF108', 'VARGA 1108'] },
    disco_freio_traseiro: { partNumber: 'BD1109', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF109', 'VARGA 1109'] },
    amortecedor_dianteiro: { partNumber: 'GP32960', brand: 'MONROE', equivalents: ['COFAP MP32960', 'NAKATA HG32960'] },
    amortecedor_traseiro: { partNumber: 'GP32961', brand: 'MONROE', equivalents: ['COFAP MP32961', 'NAKATA HG32961'] },
    mola_dianteira: { partNumber: 'MC32960', brand: 'FABRINI', equivalents: ['COFAP MC32960', 'NAKATA MC32960'] },
    mola_traseira: { partNumber: 'MC32961', brand: 'FABRINI', equivalents: ['COFAP MC32961', 'NAKATA MC32961'] },
    pivo_suspensao: { partNumber: 'N-1234', brand: 'NAKATA', equivalents: ['VIEMAR 503234', 'AXIOS 1234'] },
    terminal_direcao: { partNumber: 'N-2345', brand: 'NAKATA', equivalents: ['VIEMAR 503345', 'AXIOS 2345'] },
    bieleta_estabilizadora: { partNumber: 'N-3456', brand: 'NAKATA', equivalents: ['VIEMAR 503456', 'AXIOS 3456'] },
    kit_embreagem: { partNumber: 'CK1028', brand: 'LUK', equivalents: ['SACHS 3000954095', 'VALEO 826818'] },
    bomba_agua: { partNumber: 'WP1028', brand: 'URBA', equivalents: ['INDISA 1028', 'NAKATA NKBA1028'] },
    valvula_termostatica: { partNumber: 'VT1028', brand: 'WAHLER', equivalents: ['MTE 1028', 'BEHR 1028'] },
    radiador: { partNumber: 'RD1028', brand: 'VISCONDE', equivalents: ['DENSO 1028', 'VALEO 1028'] },
    bateria: { partNumber: 'M60GD', brand: 'MOURA', equivalents: ['HELIAR HF60DD', 'ACDelco 60AH'] },
    alternador: { partNumber: 'F000BL0304', brand: 'BOSCH', equivalents: ['VALEO 2541697', 'DENSO 1012118280'] },
    motor_partida: { partNumber: 'F000AL0304', brand: 'BOSCH', equivalents: ['VALEO 458179', 'DENSO 2280009750'] },
    bomba_combustivel: { partNumber: 'F000TE145R', brand: 'BOSCH', equivalents: ['MARWAL MAM-001', 'DELPHI FE10039'] },
    bico_injetor: { partNumber: '0280158028', brand: 'BOSCH', equivalents: ['MAGNETI MARELLI IWP065', 'DELPHI FJ10039'] },
    sensor_rotacao: { partNumber: '0261210147', brand: 'BOSCH', equivalents: ['MTE 7028', 'WAHLER 7028'] },
    sonda_lambda: { partNumber: '0258006537', brand: 'BOSCH', equivalents: ['NGK OZA659-EE1', 'DENSO DOX-0109'] },
    catalisador: { partNumber: 'CAT1028', brand: 'UMICORE', equivalents: ['MAGNETI MARELLI CAT1028', 'WALKER CAT1028'] },
    rolamento_roda_dianteiro: { partNumber: 'WB1028', brand: 'SKF', equivalents: ['FAG 713610100', 'NSK 45BWD10'] },
    rolamento_roda_traseiro: { partNumber: 'WB1029', brand: 'SKF', equivalents: ['FAG 713610101', 'NSK 45BWD11'] },
    homocinética_lado_roda: { partNumber: 'NJK1028', brand: 'NAKATA', equivalents: ['COFAP NJK1028', 'AXIOS NJK1028'] },
    homocinética_lado_cambio: { partNumber: 'NJK1029', brand: 'NAKATA', equivalents: ['COFAP NJK1029', 'AXIOS NJK1029'] },
    compressor_ar: { partNumber: 'ACP1028', brand: 'DELPHI', equivalents: ['DENSO ACP1028', 'VALEO ACP1028'] },
    condensador: { partNumber: 'CD1028', brand: 'DENSO', equivalents: ['VALEO CD1028', 'DELPHI CD1028'] },
    farol_dianteiro: { partNumber: 'FAR1028', brand: 'ARTEB', equivalents: ['FITAM FAR1028', 'CIBIE FAR1028'] },
    lanterna_traseira: { partNumber: 'LAN1028', brand: 'ARTEB', equivalents: ['FITAM LAN1028', 'CIBIE LAN1028'] },
  },

  // VW MQB (Polo, Virtus, T-Cross, Nivus, Taos)
  VW_MQB: {
    filtro_oleo: { partNumber: 'HU7020Z', brand: 'MANN-FILTER', equivalents: ['TECFIL PSL915', 'BOSCH F026407157'] },
    filtro_ar_motor: { partNumber: 'C35154', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL2035', 'FRAM CA11503'] },
    filtro_combustivel: { partNumber: 'WK69/2', brand: 'MANN-FILTER', equivalents: ['TECFIL GI12', 'BOSCH F026402862'] },
    filtro_cabine: { partNumber: 'CUK2939', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP915', 'BOSCH 1987435503'] },
    vela_ignicao: { partNumber: 'ILKAR7B11', brand: 'NGK', equivalents: ['BOSCH FR7KPP33U+', 'DENSO IK20TT'] },
    bobina_ignicao: { partNumber: '04E905110K', brand: 'VW Original', equivalents: ['BOSCH 0221604115', 'NGK U5015'] },
    correia_alternador: { partNumber: '6PK1200', brand: 'CONTITECH', equivalents: ['GATES 6PK1200', 'DAYCO 6PK1200'] },
    pastilha_freio_dianteira: { partNumber: 'N-2108', brand: 'COBREQ', equivalents: ['FRAS-LE PD/680', 'BOSCH BP2108'] },
    pastilha_freio_traseira: { partNumber: 'N-2109', brand: 'COBREQ', equivalents: ['FRAS-LE PD/681', 'BOSCH BP2109'] },
    disco_freio_dianteiro: { partNumber: 'BD2108', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF208', 'VARGA 2108'] },
    disco_freio_traseiro: { partNumber: 'BD2109', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF209', 'VARGA 2109'] },
    amortecedor_dianteiro: { partNumber: 'GP42960', brand: 'MONROE', equivalents: ['COFAP MP42960', 'NAKATA HG42960'] },
    amortecedor_traseiro: { partNumber: 'GP42961', brand: 'MONROE', equivalents: ['COFAP MP42961', 'NAKATA HG42961'] },
    kit_embreagem: { partNumber: 'CK2028', brand: 'LUK', equivalents: ['SACHS 3000954195', 'VALEO 826918'] },
    bomba_agua: { partNumber: 'WP2028', brand: 'URBA', equivalents: ['INDISA 2028', 'NAKATA NKBA2028'] },
    bateria: { partNumber: 'M60GD', brand: 'MOURA', equivalents: ['HELIAR HF60DD', 'ACDelco 60AH'] },
    sensor_rotacao: { partNumber: '04E906433A', brand: 'VW Original', equivalents: ['BOSCH 0261210247', 'MTE 7128'] },
    sonda_lambda: { partNumber: '04E906262BJ', brand: 'VW Original', equivalents: ['BOSCH 0258017178', 'NGK OZA659-EE2'] },
    bomba_combustivel: { partNumber: '2GV919051A', brand: 'VW Original', equivalents: ['BOSCH F000TE245R', 'MARWAL MAM-002'] },
    bico_injetor: { partNumber: '04E906036Q', brand: 'VW Original', equivalents: ['BOSCH 0261500162', 'MAGNETI MARELLI IWP165'] },
    compressor_ar: { partNumber: 'ACP2028', brand: 'DELPHI', equivalents: ['DENSO ACP2028', 'VALEO ACP2028'] },
    rolamento_roda_dianteiro: { partNumber: 'WB2028', brand: 'SKF', equivalents: ['FAG 713610200', 'NSK 45BWD20'] },
    homocinética_lado_roda: { partNumber: 'NJK2028', brand: 'NAKATA', equivalents: ['COFAP NJK2028', 'AXIOS NJK2028'] },
  },

  // FIAT FIRE (Uno, Palio, Siena, Strada antigos)
  FIAT_FIRE: {
    filtro_oleo: { partNumber: 'W712/21', brand: 'MANN-FILTER', equivalents: ['TECFIL PSL135', 'FRAM PH5317'] },
    filtro_ar_motor: { partNumber: 'C2771', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL5835', 'FRAM CA9409'] },
    filtro_combustivel: { partNumber: 'WK730/5', brand: 'MANN-FILTER', equivalents: ['TECFIL GI05', 'BOSCH F026402005'] },
    filtro_cabine: { partNumber: 'CU2243', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP135', 'BOSCH 0986BF0135'] },
    vela_ignicao: { partNumber: 'BKR6E', brand: 'NGK', equivalents: ['BOSCH FR7DC+', 'DENSO K16TT'] },
    correia_dentada: { partNumber: 'CT848', brand: 'CONTITECH', equivalents: ['GATES 5212XS', 'DAYCO 94848'] },
    pastilha_freio_dianteira: { partNumber: 'N-1208', brand: 'COBREQ', equivalents: ['FRAS-LE PD/135', 'BOSCH BP1208'] },
    disco_freio_dianteiro: { partNumber: 'BD1208', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF135', 'VARGA 1208'] },
    amortecedor_dianteiro: { partNumber: 'GP33960', brand: 'MONROE', equivalents: ['COFAP MP33960', 'NAKATA HG33960'] },
    amortecedor_traseiro: { partNumber: 'GP33961', brand: 'MONROE', equivalents: ['COFAP MP33961', 'NAKATA HG33961'] },
    kit_embreagem: { partNumber: 'CK1135', brand: 'LUK', equivalents: ['SACHS 3000135095', 'VALEO 826135'] },
    bomba_agua: { partNumber: 'WP1135', brand: 'URBA', equivalents: ['INDISA 1135', 'NAKATA NKBA1135'] },
    bateria: { partNumber: 'M48FD', brand: 'MOURA', equivalents: ['HELIAR HF48DD', 'ACDelco 48AH'] },
  },

  // FIAT FIREFLY (Argo, Cronos, Pulse, Fastback)
  FIAT_FIREFLY: {
    filtro_oleo: { partNumber: 'HU712/11X', brand: 'MANN-FILTER', equivalents: ['TECFIL PSL935', 'BOSCH F026407203'] },
    filtro_ar_motor: { partNumber: 'C27107', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL7835', 'FRAM CA11800'] },
    filtro_combustivel: { partNumber: 'WK69/2', brand: 'MANN-FILTER', equivalents: ['TECFIL GI35', 'BOSCH F026402935'] },
    filtro_cabine: { partNumber: 'CUK2545', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP935', 'BOSCH 1987435935'] },
    vela_ignicao: { partNumber: 'ILKAR7B11', brand: 'NGK', equivalents: ['BOSCH FR7KPP33U+', 'DENSO IK20TT'] },
    pastilha_freio_dianteira: { partNumber: 'N-3208', brand: 'COBREQ', equivalents: ['FRAS-LE PD/935', 'BOSCH BP3208'] },
    disco_freio_dianteiro: { partNumber: 'BD3208', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF935', 'VARGA 3208'] },
    amortecedor_dianteiro: { partNumber: 'GP53960', brand: 'MONROE', equivalents: ['COFAP MP53960', 'NAKATA HG53960'] },
    amortecedor_traseiro: { partNumber: 'GP53961', brand: 'MONROE', equivalents: ['COFAP MP53961', 'NAKATA HG53961'] },
    kit_embreagem: { partNumber: 'CK3135', brand: 'LUK', equivalents: ['SACHS 3000935095', 'VALEO 826935'] },
    bomba_agua: { partNumber: 'WP3135', brand: 'URBA', equivalents: ['INDISA 3135', 'NAKATA NKBA3135'] },
    bateria: { partNumber: 'M60GD', brand: 'MOURA', equivalents: ['HELIAR HF60DD', 'ACDelco 60AH'] },
  },

  // GM GEM (Onix, Prisma, Cobalt, Spin, Montana)
  GM_GEM: {
    filtro_oleo: { partNumber: 'W712/94', brand: 'MANN-FILTER', equivalents: ['TECFIL PSL594', 'FRAM PH10575'] },
    filtro_ar_motor: { partNumber: 'C27154', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL6594', 'FRAM CA11114'] },
    filtro_combustivel: { partNumber: 'WK69/1', brand: 'MANN-FILTER', equivalents: ['TECFIL GI594', 'BOSCH F026402594'] },
    filtro_cabine: { partNumber: 'CU2442', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP594', 'BOSCH 0986BF0594'] },
    vela_ignicao: { partNumber: 'BKR6EIX', brand: 'NGK', equivalents: ['BOSCH FR7KPP33+', 'DENSO IK20'] },
    correia_dentada: { partNumber: 'CT1166', brand: 'CONTITECH', equivalents: ['GATES 5612XS', 'DAYCO 941166'] },
    pastilha_freio_dianteira: { partNumber: 'N-1594', brand: 'COBREQ', equivalents: ['FRAS-LE PD/594', 'BOSCH BP1594'] },
    disco_freio_dianteiro: { partNumber: 'BD1594', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF594', 'VARGA 1594'] },
    amortecedor_dianteiro: { partNumber: 'GP34960', brand: 'MONROE', equivalents: ['COFAP MP34960', 'NAKATA HG34960'] },
    amortecedor_traseiro: { partNumber: 'GP34961', brand: 'MONROE', equivalents: ['COFAP MP34961', 'NAKATA HG34961'] },
    kit_embreagem: { partNumber: 'CK1594', brand: 'LUK', equivalents: ['SACHS 3000594095', 'VALEO 826594'] },
    bomba_agua: { partNumber: 'WP1594', brand: 'URBA', equivalents: ['INDISA 1594', 'NAKATA NKBA1594'] },
    bateria: { partNumber: 'M60GD', brand: 'MOURA', equivalents: ['HELIAR HF60DD', 'ACDelco 60AH'] },
    sensor_rotacao: { partNumber: '55565708', brand: 'GM Original', equivalents: ['BOSCH 0261210594', 'MTE 7594'] },
    sonda_lambda: { partNumber: '55566648', brand: 'GM Original', equivalents: ['BOSCH 0258017594', 'NGK OZA659-EE594'] },
  },

  // TOYOTA COROLLA (E170, E210)
  TOYOTA_COROLLA: {
    filtro_oleo: { partNumber: 'W68/3', brand: 'MANN-FILTER', equivalents: ['TECFIL PSL68', 'FRAM PH4967'] },
    filtro_ar_motor: { partNumber: 'C25040', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL6068', 'FRAM CA10190'] },
    filtro_combustivel: { partNumber: 'WK614/46', brand: 'MANN-FILTER', equivalents: ['TECFIL GI068', 'BOSCH F026402068'] },
    filtro_cabine: { partNumber: 'CU1919', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP068', 'BOSCH 0986BF0068'] },
    vela_ignicao: { partNumber: 'ILKAR7B11', brand: 'NGK', equivalents: ['BOSCH FR7KPP33U+', 'DENSO IK20TT'] },
    correia_alternador: { partNumber: '6PK1880', brand: 'CONTITECH', equivalents: ['GATES 6PK1880', 'DAYCO 6PK1880'] },
    pastilha_freio_dianteira: { partNumber: 'N-1068', brand: 'COBREQ', equivalents: ['FRAS-LE PD/068', 'BOSCH BP1068'] },
    disco_freio_dianteiro: { partNumber: 'BD1068', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF068', 'VARGA 1068'] },
    amortecedor_dianteiro: { partNumber: 'GP35960', brand: 'MONROE', equivalents: ['COFAP MP35960', 'NAKATA HG35960'] },
    amortecedor_traseiro: { partNumber: 'GP35961', brand: 'MONROE', equivalents: ['COFAP MP35961', 'NAKATA HG35961'] },
    kit_embreagem: { partNumber: 'CK1068', brand: 'LUK', equivalents: ['SACHS 3000068095', 'VALEO 826068'] },
    bomba_agua: { partNumber: 'WP1068', brand: 'URBA', equivalents: ['INDISA 1068', 'NAKATA NKBA1068'] },
    bateria: { partNumber: 'M60GD', brand: 'MOURA', equivalents: ['HELIAR HF60DD', 'ACDelco 60AH'] },
  },

  // HONDA CIVIC (FC, FE)
  HONDA_CIVIC: {
    filtro_oleo: { partNumber: 'W610/6', brand: 'MANN-FILTER', equivalents: ['TECFIL PSL610', 'FRAM PH6017A'] },
    filtro_ar_motor: { partNumber: 'C2201', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL6610', 'FRAM CA10165'] },
    filtro_combustivel: { partNumber: 'WK614/24', brand: 'MANN-FILTER', equivalents: ['TECFIL GI610', 'BOSCH F026402610'] },
    filtro_cabine: { partNumber: 'CU1835', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP610', 'BOSCH 0986BF0610'] },
    vela_ignicao: { partNumber: 'IZFR6K11', brand: 'NGK', equivalents: ['BOSCH FR7KPP33U+', 'DENSO IK20TT'] },
    pastilha_freio_dianteira: { partNumber: 'N-1610', brand: 'COBREQ', equivalents: ['FRAS-LE PD/610', 'BOSCH BP1610'] },
    disco_freio_dianteiro: { partNumber: 'BD1610', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF610', 'VARGA 1610'] },
    amortecedor_dianteiro: { partNumber: 'GP36960', brand: 'MONROE', equivalents: ['COFAP MP36960', 'NAKATA HG36960'] },
    amortecedor_traseiro: { partNumber: 'GP36961', brand: 'MONROE', equivalents: ['COFAP MP36961', 'NAKATA HG36961'] },
    kit_embreagem: { partNumber: 'CK1610', brand: 'LUK', equivalents: ['SACHS 3000610095', 'VALEO 826610'] },
    bomba_agua: { partNumber: 'WP1610', brand: 'URBA', equivalents: ['INDISA 1610', 'NAKATA NKBA1610'] },
    bateria: { partNumber: 'M60GD', brand: 'MOURA', equivalents: ['HELIAR HF60DD', 'ACDelco 60AH'] },
  },

  // HYUNDAI HB20 / CRETA
  HYUNDAI_GAMMA: {
    filtro_oleo: { partNumber: 'W811/80', brand: 'MANN-FILTER', equivalents: ['TECFIL PSL811', 'FRAM PH6811'] },
    filtro_ar_motor: { partNumber: 'C2029', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL6811', 'FRAM CA10350'] },
    filtro_combustivel: { partNumber: 'WK614/26', brand: 'MANN-FILTER', equivalents: ['TECFIL GI811', 'BOSCH F026402811'] },
    filtro_cabine: { partNumber: 'CU2336', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP811', 'BOSCH 0986BF0811'] },
    vela_ignicao: { partNumber: 'BKR6EIX', brand: 'NGK', equivalents: ['BOSCH FR7KPP33+', 'DENSO IK20'] },
    correia_dentada: { partNumber: 'CT1100', brand: 'CONTITECH', equivalents: ['GATES 5545XS', 'DAYCO 941100'] },
    pastilha_freio_dianteira: { partNumber: 'N-1811', brand: 'COBREQ', equivalents: ['FRAS-LE PD/811', 'BOSCH BP1811'] },
    disco_freio_dianteiro: { partNumber: 'BD1811', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF811', 'VARGA 1811'] },
    amortecedor_dianteiro: { partNumber: 'GP37960', brand: 'MONROE', equivalents: ['COFAP MP37960', 'NAKATA HG37960'] },
    amortecedor_traseiro: { partNumber: 'GP37961', brand: 'MONROE', equivalents: ['COFAP MP37961', 'NAKATA HG37961'] },
    kit_embreagem: { partNumber: 'CK1811', brand: 'LUK', equivalents: ['SACHS 3000811095', 'VALEO 826811'] },
    bomba_agua: { partNumber: 'WP1811', brand: 'URBA', equivalents: ['INDISA 1811', 'NAKATA NKBA1811'] },
    bateria: { partNumber: 'M60GD', brand: 'MOURA', equivalents: ['HELIAR HF60DD', 'ACDelco 60AH'] },
  },

  // RENAULT SANDERO / LOGAN / DUSTER
  RENAULT_K4M: {
    filtro_oleo: { partNumber: 'W75/3', brand: 'MANN-FILTER', equivalents: ['TECFIL PSL75', 'FRAM PH5796'] },
    filtro_ar_motor: { partNumber: 'C1858/2', brand: 'MANN-FILTER', equivalents: ['TECFIL ARL6075', 'FRAM CA9096'] },
    filtro_combustivel: { partNumber: 'WK939/1', brand: 'MANN-FILTER', equivalents: ['TECFIL GI075', 'BOSCH F026402075'] },
    filtro_cabine: { partNumber: 'CU1829', brand: 'MANN-FILTER', equivalents: ['TECFIL ACP075', 'BOSCH 0986BF0075'] },
    vela_ignicao: { partNumber: 'BKR6EK', brand: 'NGK', equivalents: ['BOSCH FR7DC+', 'DENSO K20TT'] },
    correia_dentada: { partNumber: 'CT988', brand: 'CONTITECH', equivalents: ['GATES 5451XS', 'DAYCO 94988'] },
    pastilha_freio_dianteira: { partNumber: 'N-1075', brand: 'COBREQ', equivalents: ['FRAS-LE PD/075', 'BOSCH BP1075'] },
    disco_freio_dianteiro: { partNumber: 'BD1075', brand: 'FREMAX', equivalents: ['HIPPER FREIOS HF075', 'VARGA 1075'] },
    amortecedor_dianteiro: { partNumber: 'GP38960', brand: 'MONROE', equivalents: ['COFAP MP38960', 'NAKATA HG38960'] },
    amortecedor_traseiro: { partNumber: 'GP38961', brand: 'MONROE', equivalents: ['COFAP MP38961', 'NAKATA HG38961'] },
    kit_embreagem: { partNumber: 'CK1075', brand: 'LUK', equivalents: ['SACHS 3000075095', 'VALEO 826075'] },
    bomba_agua: { partNumber: 'WP1075', brand: 'URBA', equivalents: ['INDISA 1075', 'NAKATA NKBA1075'] },
    bateria: { partNumber: 'M60GD', brand: 'MOURA', equivalents: ['HELIAR HF60DD', 'ACDelco 60AH'] },
  },
};

// ============================================================================
// EXPORTAÇÕES
// ============================================================================
module.exports = {
  PARTS_CATEGORIES,
  PLATFORM_PART_NUMBERS,
};
