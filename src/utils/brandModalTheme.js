/**
 * TORQ Premium Automotive Brand Theme System
 * 
 * Sistema de hover premium inspirado em pintura automotiva de luxo
 * Cada marca tem sua identidade visual única adaptada para UI
 * 
 * PRINCÍPIOS:
 * - Tons profundos, não cores chapadas
 * - Gradientes sutis inspirados em pintura metálica
 * - Elegância > Chamativo
 * - Sensação de concessionária premium
 * 
 * Janeiro 2026
 */

// ============================================================================
// BRAND THEME MAP - CORES AUTOMOTIVAS PREMIUM
// Inspiradas em pintura real, adaptadas para UI
// ============================================================================
const BRAND_THEME_MAP = {
  // === ALEMÃS ===
  bmw: {
    primary: '#0066B1',      // BMW Blue (oficial) - azul vibrante
    secondary: '#0A1525',    // Azul escuro profundo
    deep: '#061020',         // Azul noturno intenso
    accent: '#1E90FF',       // Azul dodger vibrante
    glow: 'rgba(0, 102, 177, 0.4)'
  },
  'mercedes-benz': {
    primary: '#A0A0A0',      // Mercedes Silver (oficial - Prata elegante)
    secondary: '#0D0D0D',    // Preto piano
    deep: '#080808',         // Preto profundo
    accent: '#D4D4D4',       // Prata claro
    glow: 'rgba(192, 192, 192, 0.3)'
  },
  mercedes: {
    primary: '#A0A0A0',
    secondary: '#0D0D0D',
    deep: '#080808',
    accent: '#D4D4D4',
    glow: 'rgba(192, 192, 192, 0.3)'
  },
  audi: {
    primary: '#BB0A30',      // Audi Red (oficial) - vermelho intenso
    secondary: '#180810',    // Vermelho vinho escuro
    deep: '#10050A',         // Bordô profundo
    accent: '#FF1744',       // Vermelho vibrante
    glow: 'rgba(187, 10, 48, 0.35)'
  },
  porsche: {
    primary: '#D5001C',      // Porsche Guards Red (oficial) - vermelho icônico
    secondary: '#1A0808',    // Vermelho escuro
    deep: '#120505',         // Bordô profundo
    accent: '#FF2D2D',       // Vermelho vivo
    glow: 'rgba(213, 0, 28, 0.35)'
  },
  volkswagen: {
    primary: '#001E50',      // VW Blue (oficial) - azul profundo
    secondary: '#0A1225',    // Azul escuro
    deep: '#06101A',         // Azul noturno
    accent: '#4A90D9',       // Azul médio vibrante
    glow: 'rgba(0, 30, 80, 0.35)'
  },
  mini: {
    primary: '#006847',      // Mini British Racing Green (oficial)
    secondary: '#081A10',    // Verde escuro profundo
    deep: '#05120A',         // Verde noturno
    accent: '#00A86B',       // Verde jade vibrante
    glow: 'rgba(0, 104, 71, 0.35)'
  },

  // === ITALIANAS ===
  ferrari: {
    primary: '#FF2800',      // Rosso Corsa Ferrari (oficial) - vermelho laranja icônico
    secondary: '#2A0A05',    // Vermelho alaranjado escuro
    deep: '#1A0503',         // Laranja queimado profundo
    accent: '#FF5722',       // Laranja avermelhado vibrante
    glow: 'rgba(255, 40, 0, 0.45)'
  },
  lamborghini: {
    primary: '#DDB321',      // Lamborghini Gold (oficial - Giallo Orion)
    secondary: '#0D1A08',    // Verde escuro agressivo
    deep: '#081005',         // Verde quase preto
    accent: '#FFD700',       // Ouro vibrante
    glow: 'rgba(221, 179, 33, 0.35)'
  },
  maserati: {
    primary: '#0C2340',      // Maserati Blue (oficial - Blu Nettuno)
    secondary: '#081520',    // Azul marinho profundo
    deep: '#050D15',         // Azul noite
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(12, 35, 64, 0.35)'
  },
  'alfa romeo': {
    primary: '#8B1538',      // Alfa Romeo Red (oficial - Rosso Alfa) - vermelho vinho/bordô
    secondary: '#1A0810',    // Bordô escuro profundo
    deep: '#10050A',         // Vinho noturno
    accent: '#C41E3A',       // Carmesim elegante
    glow: 'rgba(139, 21, 56, 0.4)'
  },
  'alfa-romeo': {
    primary: '#8B1538',
    secondary: '#1A0810',
    deep: '#10050A',
    accent: '#C41E3A',
    glow: 'rgba(139, 21, 56, 0.4)'
  },
  fiat: {
    primary: '#A50034',      // Fiat Red (oficial) - vermelho magenta/rosa escuro
    secondary: '#1A0510',    // Magenta escuro
    deep: '#0F0308',         // Rosa noturno profundo
    accent: '#E91E63',       // Rosa vibrante
    glow: 'rgba(165, 0, 52, 0.4)'
  },

  // === JAPONESAS ===
  toyota: {
    primary: '#EB0A1E',      // Toyota Red (oficial) - vermelho puro vibrante
    secondary: '#1A0505',    // Vermelho escuro
    deep: '#0D0303',         // Bordô noturno
    accent: '#FF3B3B',       // Vermelho vivo
    glow: 'rgba(235, 10, 30, 0.35)'
  },
  lexus: {
    primary: '#1A1A1A',      // Lexus Black (oficial - premium)
    secondary: '#0A0A0A',    // Preto profundo
    deep: '#050505',         // Preto absoluto
    accent: '#D4D4D4',       // Prata elegante
    glow: 'rgba(212, 212, 212, 0.2)'
  },
  honda: {
    primary: '#CC0033',      // Honda Red (oficial) - vermelho magenta/cereja
    secondary: '#1A050A',    // Magenta escuro
    deep: '#0D0305',         // Cereja noturno
    accent: '#FF1A5C',       // Rosa avermelhado vibrante
    glow: 'rgba(204, 0, 51, 0.4)'
  },
  acura: {
    primary: '#1A1A1A',      // Acura Black (oficial)
    secondary: '#0D0D0D',    // Preto profundo
    deep: '#0A0A0A',         // Preto absoluto
    accent: '#C0C0C0',       // Prata
    glow: 'rgba(192, 192, 192, 0.15)'
  },
  nissan: {
    primary: '#C3002F',      // Nissan Red (oficial) - vermelho carmesim
    secondary: '#1A0A0E',    // Carmesim escuro
    deep: '#12060A',         // Bordô noturno
    accent: '#E63950',       // Vermelho coral
    glow: 'rgba(195, 0, 47, 0.3)'
  },
  mazda: {
    primary: '#910000',      // Mazda Soul Red Crystal (oficial) - vermelho escuro profundo
    secondary: '#1A0808',    // Vermelho vinho escuro
    deep: '#120505',         // Bordô profundo
    accent: '#B22222',       // Vermelho tijolo
    glow: 'rgba(145, 0, 0, 0.35)'
  },
  subaru: {
    primary: '#013C74',      // Subaru Blue (oficial - WR Blue)
    secondary: '#0A1520',    // Azul escuro
    deep: '#080F18',         // Azul noturno
    accent: '#4682B4',       // Azul aço
    glow: 'rgba(1, 60, 116, 0.3)'
  },
  mitsubishi: {
    primary: '#E60012',      // Mitsubishi Red (oficial) - vermelho alaranjado
    secondary: '#1A0A05',    // Laranja avermelhado escuro
    deep: '#140804',         // Laranja noturno
    accent: '#FF4500',       // Laranja avermelhado vibrante
    glow: 'rgba(230, 0, 18, 0.35)'
  },
  suzuki: {
    primary: '#E4002B',      // Suzuki Red (oficial) - vermelho coral
    secondary: '#1A0A0C',    // Coral escuro
    deep: '#140608',         // Coral noturno
    accent: '#FF3355',       // Coral vibrante
    glow: 'rgba(228, 0, 43, 0.3)'
  },
  infiniti: {
    primary: '#1C1C1C',      // Infiniti Black (oficial)
    secondary: '#0F0F0F',    // Preto profundo
    deep: '#0A0A0A',         // Preto absoluto
    accent: '#A0A0A0',       // Cinza médio
    glow: 'rgba(160, 160, 160, 0.15)'
  },
  isuzu: {
    primary: '#B30000',      // Isuzu Red (oficial) - vermelho escuro
    secondary: '#1A0606',    // Vermelho vinho
    deep: '#120404',         // Bordô profundo
    accent: '#D93636',       // Vermelho médio
    glow: 'rgba(179, 0, 0, 0.3)'
  },
  daihatsu: {
    primary: '#D50000',      // Daihatsu Red (oficial) - vermelho brilhante
    secondary: '#1A0707',    // Vermelho escuro
    deep: '#140505',         // Bordô profundo
    accent: '#FF4444',       // Vermelho vivo
    glow: 'rgba(213, 0, 0, 0.3)'
  },

  // === COREANAS ===
  hyundai: {
    primary: '#002C5F',      // Hyundai Blue (oficial - Active Blue)
    secondary: '#081420',    // Azul escuro profundo
    deep: '#050D15',         // Azul noturno
    accent: '#1E90FF',       // Azul dodger vibrante
    glow: 'rgba(0, 44, 95, 0.4)'
  },
  kia: {
    primary: '#05141F',      // Kia Midnight Black (oficial - novo logo 2021)
    secondary: '#081420',    // Azul escuro
    deep: '#050D15',         // Azul noturno
    accent: '#E31837',       // Vermelho KIA vibrante
    glow: 'rgba(227, 24, 55, 0.35)'
  },
  genesis: {
    primary: '#9B8579',      // Genesis Copper (oficial - G-Matrix)
    secondary: '#1A1512',    // Bronze escuro
    deep: '#12100D',         // Marrom noturno
    accent: '#C4A484',       // Bronze claro
    glow: 'rgba(155, 133, 121, 0.2)'
  },
  ssangyong: {
    primary: '#003DA5',      // SsangYong Blue (oficial)
    secondary: '#0A1428',    // Azul escuro
    deep: '#080F1A',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(0, 61, 165, 0.3)'
  },

  // === AMERICANAS ===
  ford: {
    primary: '#003478',      // Ford Blue (oficial - Ford Blue Oval)
    secondary: '#081525',    // Azul escuro profundo
    deep: '#050D18',         // Azul noturno
    accent: '#1E90FF',       // Azul dodger vibrante
    glow: 'rgba(0, 52, 120, 0.4)'
  },
  lincoln: {
    primary: '#1A1A1A',      // Lincoln Black (oficial - Pristine)
    secondary: '#0A0A0A',    // Preto profundo
    deep: '#050505',         // Preto absoluto
    accent: '#D4D4D4',       // Prata elegante
    glow: 'rgba(212, 212, 212, 0.2)'
  },
  chevrolet: {
    primary: '#D4AF37',      // Chevrolet Gold (oficial - Bowtie Gold)
    secondary: '#1A1505',    // Dourado escuro profundo
    deep: '#100D03',         // Marrom dourado
    accent: '#FFD700',       // Ouro vibrante
    glow: 'rgba(212, 175, 55, 0.35)'
  },
  gmc: {
    primary: '#D40000',      // GMC Red (oficial) - vermelho forte
    secondary: '#1A0606',    // Vermelho escuro
    deep: '#0D0303',         // Bordô profundo
    accent: '#FF2020',       // Vermelho vivo
    glow: 'rgba(212, 0, 0, 0.35)'
  },
  buick: {
    primary: '#1A1A1A',      // Buick Black (oficial)
    secondary: '#0A0A0A',    // Preto profundo
    deep: '#050505',         // Preto absoluto
    accent: '#D4D4D4',       // Prata elegante
    glow: 'rgba(212, 212, 212, 0.2)'
  },
  dodge: {
    primary: '#E31837',      // Dodge Red (oficial - Viper Red) - vermelho vibrante/esportivo
    secondary: '#1A0608',    // Vermelho escuro profundo
    deep: '#100304',         // Bordô profundo
    accent: '#FF2D55',       // Vermelho rosa vibrante
    glow: 'rgba(227, 24, 55, 0.45)'
  },
  ram: {
    primary: '#1A1A1A',      // RAM Black (oficial)
    secondary: '#0A0A0A',    // Preto profundo
    deep: '#050505',         // Preto absoluto
    accent: '#D4D4D4',       // Prata elegante
    glow: 'rgba(212, 212, 212, 0.2)'
  },
  chrysler: {
    primary: '#003DA5',      // Chrysler Blue (oficial)
    secondary: '#081528',    // Azul escuro profundo
    deep: '#050D18',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(0, 61, 165, 0.35)'
  },
  jeep: {
    primary: '#3D5C3D',      // Jeep Green (oficial - Sarge Green)
    secondary: '#0A1A0A',    // Verde escuro profundo
    deep: '#061006',         // Verde noturno
    accent: '#4CAF50',       // Verde vibrante
    glow: 'rgba(61, 92, 61, 0.35)'
  },
  tesla: {
    primary: '#E82127',      // Tesla Red (oficial) - vermelho elétrico
    secondary: '#1A0505',    // Vermelho escuro
    deep: '#0D0303',         // Preto suave
    accent: '#FF4D4D',       // Vermelho vivo
    glow: 'rgba(232, 33, 39, 0.4)'
  },
  cadillac: {
    primary: '#9B8579',      // Cadillac Bronze (oficial - Radiant Package)
    secondary: '#1A1512',    // Bronze escuro
    deep: '#12100D',         // Marrom noturno
    accent: '#B8860B',       // Dourado escuro
    glow: 'rgba(155, 133, 121, 0.2)'
  },
  rivian: {
    primary: '#FF6B00',      // Rivian Orange (oficial - Compass Yellow)
    secondary: '#1A1008',    // Laranja escuro
    deep: '#140D08',         // Laranja noturno
    accent: '#FF8533',       // Laranja claro
    glow: 'rgba(255, 107, 0, 0.25)'
  },
  lucid: {
    primary: '#1A1A1A',      // Lucid Black (oficial)
    secondary: '#0D0D0D',    // Preto profundo
    deep: '#0A0A0A',         // Preto absoluto
    accent: '#C0C0C0',       // Prata
    glow: 'rgba(192, 192, 192, 0.15)'
  },

  // === FRANCESAS ===
  peugeot: {
    primary: '#003DA5',      // Peugeot Blue (oficial - novo logo 2021)
    secondary: '#081528',    // Azul escuro profundo
    deep: '#050D18',         // Azul noturno
    accent: '#4169E1',       // Azul royal vibrante
    glow: 'rgba(0, 61, 165, 0.4)'
  },
  renault: {
    primary: '#FFCC00',      // Renault Yellow (oficial) - amarelo vibrante
    secondary: '#1A1505',    // Amarelo escuro profundo
    deep: '#100D03',         // Dourado noturno
    accent: '#FFD700',       // Ouro vibrante
    glow: 'rgba(255, 204, 0, 0.35)'
  },
  citroen: {
    primary: '#AC1926',      // Citroën Red (oficial) - vermelho bordô elegante
    secondary: '#150508',    // Vermelho escuro profundo
    deep: '#0D0305',         // Bordô profundo
    accent: '#D93654',       // Vermelho rosado vibrante
    glow: 'rgba(172, 25, 38, 0.4)'
  },
  ds: {
    primary: '#1A1A1A',      // DS Black (oficial - premium)
    secondary: '#0D0D0D',    // Preto profundo
    deep: '#0A0A0A',         // Preto absoluto
    accent: '#C0C0C0',       // Prata
    glow: 'rgba(192, 192, 192, 0.15)'
  },
  alpine: {
    primary: '#0055A4',      // Alpine Blue (oficial - Bleu Alpine)
    secondary: '#0A1428',    // Azul escuro
    deep: '#080F1A',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(0, 85, 164, 0.3)'
  },

  // === BRITÂNICAS ===
  jaguar: {
    primary: '#006847',      // Jaguar British Racing Green (oficial)
    secondary: '#081A10',    // Verde escuro profundo
    deep: '#05100A',         // Verde noturno
    accent: '#00A86B',       // Verde jade vibrante
    glow: 'rgba(0, 104, 71, 0.35)'
  },
  'land rover': {
    primary: '#005A2B',      // Land Rover Green (oficial - Coniston Green)
    secondary: '#081A0D',    // Verde escuro profundo
    deep: '#051008',         // Verde noturno
    accent: '#00A86B',       // Verde jade vibrante
    glow: 'rgba(0, 90, 43, 0.35)'
  },
  'land-rover': {
    primary: '#005A2B',
    secondary: '#081A0D',
    deep: '#051008',
    accent: '#00A86B',
    glow: 'rgba(0, 90, 43, 0.35)'
  },
  'range rover': {
    primary: '#005A2B',
    secondary: '#081A0D',
    deep: '#051008',
    accent: '#00A86B',
    glow: 'rgba(0, 90, 43, 0.35)'
  },
  'aston martin': {
    primary: '#006847',      // Aston Martin Green (oficial - Racing Green)
    secondary: '#081A10',    // Verde escuro profundo
    deep: '#05100A',         // Verde noturno
    accent: '#00A86B',       // Verde jade vibrante
    glow: 'rgba(0, 104, 71, 0.35)'
  },
  'aston-martin': {
    primary: '#006847',
    secondary: '#081A10',
    deep: '#05100A',
    accent: '#00A86B',
    glow: 'rgba(0, 104, 71, 0.35)'
  },
  bentley: {
    primary: '#333333',      // Bentley Black (oficial - Beluga)
    secondary: '#151515',    // Preto profundo
    deep: '#0A0A0A',         // Preto absoluto
    accent: '#D4D4D4',       // Prata elegante
    glow: 'rgba(212, 212, 212, 0.2)'
  },
  'rolls-royce': {
    primary: '#680021',      // Rolls-Royce Purple (oficial - Phantom Purple)
    secondary: '#150810',    // Roxo escuro profundo
    deep: '#0D050A',         // Roxo noturno
    accent: '#9B30FF',       // Roxo vibrante
    glow: 'rgba(104, 0, 33, 0.35)'
  },
  'rolls royce': {
    primary: '#680021',
    secondary: '#150810',
    deep: '#0D050A',
    accent: '#9B30FF',
    glow: 'rgba(104, 0, 33, 0.35)'
  },
  mclaren: {
    primary: '#FF8000',      // McLaren Papaya Orange (oficial - Papaya Spark)
    secondary: '#1A1005',    // Laranja escuro profundo
    deep: '#100A03',         // Laranja noturno
    accent: '#FF9933',       // Laranja claro vibrante
    glow: 'rgba(255, 128, 0, 0.4)'
  },
  lotus: {
    primary: '#FFD700',      // Lotus Yellow (oficial - Norfolk Mustard)
    secondary: '#1A1808',    // Amarelo escuro
    deep: '#14120A',         // Dourado noturno
    accent: '#FFD700',       // Ouro
    glow: 'rgba(255, 215, 0, 0.2)'
  },
  morgan: {
    primary: '#006847',      // Morgan Green (oficial - British Racing Green)
    secondary: '#0A1A12',    // Verde escuro
    deep: '#08140D',         // Verde noturno
    accent: '#2E8B57',       // Verde mar
    glow: 'rgba(0, 104, 71, 0.25)'
  },

  // === SUECA ===
  volvo: {
    primary: '#003057',      // Volvo Blue (oficial - Iron Mark Blue)
    secondary: '#081420',    // Azul escuro profundo
    deep: '#050D15',         // Azul noturno
    accent: '#4682B4',       // Azul aço vibrante
    glow: 'rgba(0, 48, 87, 0.4)'
  },
  polestar: {
    primary: '#D4AA00',      // Polestar Gold (oficial)
    secondary: '#1A1808',    // Dourado escuro
    deep: '#14120A',         // Dourado noturno
    accent: '#FFD700',       // Ouro
    glow: 'rgba(212, 170, 0, 0.2)'
  },
  koenigsegg: {
    primary: '#1A1A1A',      // Koenigsegg Black (oficial)
    secondary: '#0D0D0D',    // Preto profundo
    deep: '#0A0A0A',         // Preto absoluto
    accent: '#FFD700',       // Ouro (escudo)
    glow: 'rgba(255, 215, 0, 0.15)'
  },

  // === CHINESAS ===
  byd: {
    primary: '#1E50A0',      // BYD Blue (oficial - Build Your Dreams Blue)
    secondary: '#081525',    // Azul escuro profundo
    deep: '#050D18',         // Azul noturno
    accent: '#4169E1',       // Azul royal vibrante
    glow: 'rgba(30, 80, 160, 0.4)'
  },
  chery: {
    primary: '#D10000',      // Chery Red (oficial) - vermelho intenso
    secondary: '#1A0505',    // Vermelho escuro profundo
    deep: '#0D0303',         // Bordô profundo
    accent: '#FF2626',       // Vermelho vivo
    glow: 'rgba(209, 0, 0, 0.35)'
  },
  'caoa chery': {
    primary: '#D10000',
    secondary: '#1A0505',
    deep: '#0D0303',
    accent: '#FF2626',
    glow: 'rgba(209, 0, 0, 0.35)'
  },
  gwm: {
    primary: '#B80000',      // GWM Red (oficial - Great Wall Motors) - vermelho escuro
    secondary: '#150404',    // Vermelho vinho escuro
    deep: '#0D0202',         // Bordô profundo
    accent: '#E62020',       // Vermelho médio
    glow: 'rgba(184, 0, 0, 0.35)'
  },
  haval: {
    primary: '#C50000',      // Haval Red (oficial) - vermelho médio
    secondary: '#180505',    // Vermelho escuro
    deep: '#0F0303',         // Bordô profundo
    accent: '#F03030',       // Vermelho claro
    glow: 'rgba(197, 0, 0, 0.35)'
  },
  geely: {
    primary: '#003DA5',      // Geely Blue (oficial)
    secondary: '#081528',    // Azul escuro profundo
    deep: '#050D18',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(0, 61, 165, 0.35)'
  },
  jac: {
    primary: '#003DA5',      // JAC Blue (oficial)
    secondary: '#081528',    // Azul escuro profundo
    deep: '#050D18',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(0, 61, 165, 0.35)'
  },
  lifan: {
    primary: '#003DA5',      // Lifan Blue (oficial)
    secondary: '#0A1428',    // Azul escuro
    deep: '#080F1A',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(0, 61, 165, 0.3)'
  },
  nio: {
    primary: '#003DA5',      // NIO Blue (oficial)
    secondary: '#0A1428',    // Azul escuro
    deep: '#080F1A',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(0, 61, 165, 0.3)'
  },
  xpeng: {
    primary: '#FF6600',      // XPeng Orange (oficial)
    secondary: '#1A1008',    // Laranja escuro
    deep: '#140D08',         // Laranja noturno
    accent: '#FF8533',       // Laranja claro
    glow: 'rgba(255, 102, 0, 0.25)'
  },
  zeekr: {
    primary: '#003DA5',      // Zeekr Blue (oficial)
    secondary: '#0A1428',    // Azul escuro
    deep: '#080F1A',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(0, 61, 165, 0.3)'
  },
  ora: {
    primary: '#FF69B4',      // ORA Pink (oficial - Good Cat)
    secondary: '#1A0A12',    // Rosa escuro
    deep: '#12080D',         // Rosa noturno
    accent: '#FF1493',       // Rosa profundo
    glow: 'rgba(255, 105, 180, 0.25)'
  },

  // === SUPERCARROS ===
  bugatti: {
    primary: '#BE0030',      // Bugatti Red (oficial - French Racing Blue alternativo)
    secondary: '#1A0A0D',    // Vermelho escuro
    deep: '#120608',         // Bordô profundo
    accent: '#DC143C',       // Carmesim
    glow: 'rgba(190, 0, 48, 0.25)'
  },
  pagani: {
    primary: '#003DA5',      // Pagani Blue (oficial - Blu Tricolore)
    secondary: '#0A1428',    // Azul escuro
    deep: '#080F1A',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(0, 61, 165, 0.3)'
  },
  rimac: {
    primary: '#00BFFF',      // Rimac Blue (oficial - Electric Blue)
    secondary: '#0A1828',    // Azul escuro
    deep: '#08121A',         // Azul noturno
    accent: '#00CED1',       // Turquesa
    glow: 'rgba(0, 191, 255, 0.25)'
  },
  spyker: {
    primary: '#FF6600',      // Spyker Orange (oficial)
    secondary: '#1A1008',    // Laranja escuro
    deep: '#140D08',         // Laranja noturno
    accent: '#FF8533',       // Laranja claro
    glow: 'rgba(255, 102, 0, 0.25)'
  },
  zenvo: {
    primary: '#1A1A1A',      // Zenvo Black (oficial)
    secondary: '#0D0D0D',    // Preto profundo
    deep: '#0A0A0A',         // Preto absoluto
    accent: '#C0C0C0',       // Prata
    glow: 'rgba(192, 192, 192, 0.15)'
  },

  // === MOTOS ===
  yamaha: {
    primary: '#E60012',      // Yamaha Red (oficial - Racing Red) - LOGO VERMELHA
    secondary: '#1A0808',    // Vermelho escuro
    deep: '#140606',         // Bordô profundo
    accent: '#FF2D2D',       // Vermelho vivo
    glow: 'rgba(230, 0, 18, 0.35)'
  },
  kawasaki: {
    primary: '#00A651',      // Kawasaki Lime Green (oficial - mais vibrante)
    secondary: '#0A1A0D',    // Verde escuro
    deep: '#081408',         // Verde noturno profundo
    accent: '#39FF14',       // Verde neon vibrante
    glow: 'rgba(0, 166, 81, 0.35)'
  },
  ducati: {
    primary: '#D50000',      // Ducati Red (oficial - Rosso Ducati) - vermelho puro italiano
    secondary: '#1A0505',    // Vermelho vinho escuro
    deep: '#120303',         // Bordô profundo intenso
    accent: '#FF1A1A',       // Vermelho vivo intenso
    glow: 'rgba(213, 0, 0, 0.4)'
  },
  'harley-davidson': {
    primary: '#FF6600',      // Harley Orange (oficial - Bar & Shield Orange) - mais vibrante
    secondary: '#1A0D05',    // Laranja escuro profundo
    deep: '#140A04',         // Laranja noturno
    accent: '#FF8C00',       // Laranja escuro vibrante
    glow: 'rgba(255, 102, 0, 0.35)'
  },
  harley: {
    primary: '#FF6600',
    secondary: '#1A0D05',
    deep: '#140A04',
    accent: '#FF8C00',
    glow: 'rgba(255, 102, 0, 0.35)'
  },
  triumph: {
    primary: '#000000',      // Triumph Black (oficial)
    secondary: '#1A1A1A',    // Preto profundo
    deep: '#0D0D0D',         // Preto absoluto
    accent: '#A0A0A0',       // Cinza
    glow: 'rgba(160, 160, 160, 0.15)'
  },
  ktm: {
    primary: '#FF6600',      // KTM Orange (oficial - Ready to Race Orange) - vibrante
    secondary: '#1A0D04',    // Laranja escuro profundo
    deep: '#140A03',         // Laranja noturno intenso
    accent: '#FF8533',       // Laranja claro vibrante
    glow: 'rgba(255, 102, 0, 0.4)'
  },
  'bmw-motorrad': {
    primary: '#0066B1',      // BMW Motorrad Blue (oficial)
    secondary: '#1C1C1E',    // Grafite escuro
    deep: '#0A1929',         // Azul profundo noturno
    accent: '#4A9FD4',       // Azul claro para destaque
    glow: 'rgba(0, 102, 177, 0.3)'
  },
  aprilia: {
    primary: '#BE0000',      // Aprilia Red (oficial) - vermelho racing
    secondary: '#1A0707',    // Vermelho escuro
    deep: '#140505',         // Bordô profundo
    accent: '#E63333',       // Vermelho médio vibrante
    glow: 'rgba(190, 0, 0, 0.35)'
  },
  mv: {
    primary: '#C80000',      // MV Agusta Red (oficial) - vermelho italiano
    secondary: '#1A0606',    // Vermelho escuro
    deep: '#140404',         // Bordô profundo
    accent: '#F02020',       // Vermelho vivo
    glow: 'rgba(200, 0, 0, 0.35)'
  },
  'mv agusta': {
    primary: '#C80000',
    secondary: '#1A0606',
    deep: '#140404',
    accent: '#F02020',
    glow: 'rgba(200, 0, 0, 0.35)'
  },
  'royal enfield': {
    primary: '#1A1A1A',      // Royal Enfield Black (oficial)
    secondary: '#0D0D0D',    // Preto profundo
    deep: '#0A0A0A',         // Preto absoluto
    accent: '#A0A0A0',       // Cinza
    glow: 'rgba(160, 160, 160, 0.15)'
  },
  indian: {
    primary: '#8B0000',      // Indian Red (oficial) - vermelho escuro vintage
    secondary: '#150505',    // Vermelho vinho
    deep: '#0D0303',         // Bordô profundo
    accent: '#B22222',       // Vermelho tijolo
    glow: 'rgba(139, 0, 0, 0.35)'
  },
  husqvarna: {
    primary: '#003DA5',      // Husqvarna Blue (oficial)
    secondary: '#0A1428',    // Azul escuro
    deep: '#080F1A',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(0, 61, 165, 0.3)'
  },
  dafra: {
    primary: '#C00000',      // Dafra Red (oficial) - vermelho médio
    secondary: '#180606',    // Vermelho escuro
    deep: '#120404',         // Bordô profundo
    accent: '#E83030',       // Vermelho claro
    glow: 'rgba(192, 0, 0, 0.3)'
  },
  shineray: {
    primary: '#B50000',      // Shineray Red (oficial) - vermelho escuro
    secondary: '#160505',    // Vermelho vinho
    deep: '#100303',         // Bordô profundo
    accent: '#DD2020',       // Vermelho médio
    glow: 'rgba(181, 0, 0, 0.3)'
  },

  // === CAMINHÕES E COMERCIAIS ===
  scania: {
    primary: '#D00000',      // Scania Red (oficial - Griffin Red) - vermelho forte
    secondary: '#1A0606',    // Vermelho escuro
    deep: '#140404',         // Bordô profundo
    accent: '#F52020',       // Vermelho vivo
    glow: 'rgba(208, 0, 0, 0.3)'
  },
  'volvo-trucks': {
    primary: '#003057',      // Volvo Trucks Blue (oficial - Iron Mark Blue)
    secondary: '#0A1420',    // Azul escuro
    deep: '#080F18',         // Azul noturno
    accent: '#4682B4',       // Azul aço
    glow: 'rgba(0, 48, 87, 0.3)'
  },
  man: {
    primary: '#003DA5',      // MAN Blue (oficial)
    secondary: '#0A1428',    // Azul escuro
    deep: '#080F1A',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(0, 61, 165, 0.3)'
  },
  iveco: {
    primary: '#003DA5',      // Iveco Blue (oficial)
    secondary: '#0A1428',    // Azul escuro
    deep: '#080F1A',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(0, 61, 165, 0.3)'
  },
  daf: {
    primary: '#003DA5',      // DAF Blue (oficial)
    secondary: '#0A1428',    // Azul escuro
    deep: '#080F1A',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(0, 61, 165, 0.3)'
  },
  'mercedes-trucks': {
    primary: '#00ADEF',      // Mercedes Trucks Blue (oficial)
    secondary: '#0D0D0D',    // Preto piano
    deep: '#0A1A24',         // Prata escuro metálico
    accent: '#C0C0C0',       // Prata
    glow: 'rgba(192, 192, 192, 0.25)'
  },

  // === INDIANAS ===
  tata: {
    primary: '#003DA5',      // Tata Blue (oficial)
    secondary: '#0A1428',    // Azul escuro
    deep: '#080F1A',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(0, 61, 165, 0.3)'
  },
  mahindra: {
    primary: '#A00000',      // Mahindra Red (oficial) - vermelho escuro indiano
    secondary: '#180505',    // Vermelho vinho
    deep: '#120303',         // Bordô profundo
    accent: '#C82020',       // Vermelho médio
    glow: 'rgba(160, 0, 0, 0.3)'
  },

  // === TCHECAS ===
  skoda: {
    primary: '#4BA82E',      // Skoda Green (oficial - novo logo 2022)
    secondary: '#0D1A0A',    // Verde escuro
    deep: '#0A140A',         // Verde noturno
    accent: '#7CFC00',       // Verde limão
    glow: 'rgba(75, 168, 46, 0.25)'
  },

  // === ESPANHOLAS ===
  seat: {
    primary: '#DE0032',      // SEAT Red (oficial - Desire Red) - vermelho vibrante espanhol
    secondary: '#1A0A0C',    // Vermelho escuro
    deep: '#140608',         // Bordô noturno
    accent: '#FF3366',       // Vermelho rosa vibrante
    glow: 'rgba(222, 0, 50, 0.35)'
  },
  cupra: {
    primary: '#95572B',      // CUPRA Copper (oficial)
    secondary: '#1A1512',    // Bronze escuro
    deep: '#12100D',         // Marrom noturno
    accent: '#C4A484',       // Bronze claro
    glow: 'rgba(149, 87, 43, 0.2)'
  },

  // === ROMENAS ===
  dacia: {
    primary: '#646B52',      // Dacia Khaki (oficial - novo logo 2021)
    secondary: '#0D1A0D',    // Verde escuro
    deep: '#0A140A',         // Verde noturno
    accent: '#556B2F',       // Verde oliva
    glow: 'rgba(100, 107, 82, 0.25)'
  },

  // === FALLBACK ===
  default: {
    primary: '#6B7280',      // Cinza neutro
    secondary: '#1A1A1E',    // Cinza escuro
    deep: '#121214',         // Cinza noturno
    accent: '#9CA3AF',       // Cinza claro
    glow: 'rgba(107, 114, 128, 0.2)'
  }
};

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/**
 * Converte hex para RGB
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 107, g: 114, b: 128 };
};

/**
 * Normaliza nome da marca para busca no mapa
 */
const normalizeBrandName = (brand) => {
  if (typeof brand !== 'string') {
    if (brand && typeof brand === 'object') {
      brand = brand.brandName || brand.name || brand.brand || 'default';
    } else {
      return 'default';
    }
  }
  
  let brandKey = (brand || 'default').toLowerCase().trim();
  brandKey = brandKey
    .replace(/\s*(motors?|do brasil|brasil|automoveis|automóveis|automotive|s\.?a\.?)\s*/gi, '')
    .trim()
    .replace(/\s+/g, '-');
  
  // Aliases
  const aliases = {
    'vw': 'volkswagen',
    'i/vw': 'volkswagen',
    'chevy': 'chevrolet',
    'gm': 'chevrolet',
    'landrover': 'land-rover'
  };
  
  return aliases[brandKey] || brandKey;
};

/**
 * Busca tema da marca no mapa
 */
const findBrandTheme = (brandKey) => {
  // Busca direta
  if (BRAND_THEME_MAP[brandKey]) {
    return BRAND_THEME_MAP[brandKey];
  }
  
  // Busca parcial
  const knownBrands = Object.keys(BRAND_THEME_MAP);
  for (const known of knownBrands) {
    if (brandKey.includes(known) || known.includes(brandKey)) {
      return BRAND_THEME_MAP[known];
    }
  }
  
  // Fallback
  return BRAND_THEME_MAP.default;
};

// ============================================================================
// GERAÇÃO DE TOKENS PREMIUM
// ============================================================================

/**
 * Gera tokens derivados para hover e modal
 * Inspirado em pintura automotiva metálica
 */
const generatePremiumTokens = (theme) => {
  const { r: pr, g: pg, b: pb } = hexToRgb(theme.primary);
  const { r: dr, g: dg, b: db } = hexToRgb(theme.deep);
  const { r: ar, g: ag, b: ab } = hexToRgb(theme.accent);
  
  return {
    // Cor primária da marca
    brandAccent: theme.primary,
    brandAccentMuted: `rgba(${pr}, ${pg}, ${pb}, 0.6)`,
    
    // Gradiente de hover - inspirado em pintura metálica
    brandHoverGradient: `linear-gradient(135deg, 
      ${theme.deep} 0%, 
      ${theme.secondary} 40%,
      rgba(${dr + 15}, ${dg + 15}, ${db + 15}, 0.98) 70%,
      ${theme.deep} 100%)`,
    
    // Overlay metálico sutil
    brandMetallicOverlay: `linear-gradient(180deg,
      rgba(255, 255, 255, 0.03) 0%,
      transparent 30%,
      transparent 70%,
      rgba(0, 0, 0, 0.1) 100%)`,
    
    // Glow da marca
    brandGlow: theme.glow,
    
    // Borda luminosa sutil
    brandBorderGlow: `rgba(${ar}, ${ag}, ${ab}, 0.3)`,
    
    // Sombra adaptada à cor
    brandShadow: `0 4px 24px ${theme.glow}, 0 8px 32px rgba(0, 0, 0, 0.4)`,
    
    // Surface para cards internos
    brandSurfaceSoft: `rgba(${pr}, ${pg}, ${pb}, 0.06)`,
    brandSurfaceDeep: theme.deep,
    
    // Divider
    brandDivider: `rgba(${ar}, ${ag}, ${ab}, 0.15)`,
    
    // Border
    brandBorder: `rgba(${ar}, ${ag}, ${ab}, 0.2)`,
    
    // Focus ring
    brandFocusRing: `rgba(${pr}, ${pg}, ${pb}, 0.4)`,
    
    // Modal backgrounds
    brandModalBg: theme.deep,
    brandHeaderBg: theme.secondary,
    
    // Accent para destaque
    brandAccentLight: theme.accent
  };
};

// ============================================================================
// TEMA BASE PREMIUM
// ============================================================================
const PREMIUM_BASE = {
  bgPrimary: '#0D0D0F',
  bgSecondary: '#141417',
  bgTertiary: '#1A1A1E',
  bgElevated: '#1F1F24',
  bgCard: 'rgba(255, 255, 255, 0.03)',
  textPrimary: '#F5F5F7',
  textSecondary: 'rgba(245, 245, 247, 0.7)',
  textMuted: 'rgba(245, 245, 247, 0.5)',
  borderDefault: 'rgba(255, 255, 255, 0.08)',
  borderSubtle: 'rgba(255, 255, 255, 0.04)',
  shadowSm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  shadowMd: '0 4px 12px rgba(0, 0, 0, 0.4)',
  shadowLg: '0 12px 40px rgba(0, 0, 0, 0.5)',
  vignette: 'radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.3) 100%)'
};

// ============================================================================
// FUNÇÕES EXPORTADAS
// ============================================================================

/**
 * Retorna tema completo para uma marca
 */
export const getBrandTheme = (brand) => {
  const brandKey = normalizeBrandName(brand);
  const brandTheme = findBrandTheme(brandKey);
  const tokens = generatePremiumTokens(brandTheme);
  
  return {
    ...PREMIUM_BASE,
    ...tokens,
    brandName: brandKey,
    brandOfficialColor: brandTheme.primary
  };
};

/**
 * Gera CSS variables para aplicar em componentes
 */
export const getBrandCSSVariables = (brand) => {
  const theme = getBrandTheme(brand);
  const { r: ar, g: ag, b: ab } = hexToRgb(theme.brandAccent);
  
  return {
    '--bg-primary': theme.bgPrimary,
    '--bg-secondary': theme.bgSecondary,
    '--bg-tertiary': theme.bgTertiary,
    '--bg-elevated': theme.bgElevated,
    '--bg-card': theme.bgCard,
    '--text-primary': theme.textPrimary,
    '--text-secondary': theme.textSecondary,
    '--text-muted': theme.textMuted,
    '--border-default': theme.borderDefault,
    '--border-subtle': theme.borderSubtle,
    '--shadow-sm': theme.shadowSm,
    '--shadow-md': theme.shadowMd,
    '--shadow-lg': theme.shadowLg,
    '--vignette': theme.vignette,
    '--brand-accent': theme.brandAccent,
    '--brand-accent-rgb': `${ar}, ${ag}, ${ab}`,
    '--brand-accent-muted': theme.brandAccentMuted,
    '--brand-accent-light': theme.brandAccentLight,
    '--brand-hover-gradient': theme.brandHoverGradient,
    '--brand-metallic-overlay': theme.brandMetallicOverlay,
    '--brand-glow': theme.brandGlow,
    '--brand-border-glow': theme.brandBorderGlow,
    '--brand-shadow': theme.brandShadow,
    '--brand-surface-soft': theme.brandSurfaceSoft,
    '--brand-surface-deep': theme.brandSurfaceDeep,
    '--brand-divider': theme.brandDivider,
    '--brand-border': theme.brandBorder,
    '--brand-focus-ring': theme.brandFocusRing,
    '--brand-modal-bg': theme.brandModalBg,
    '--brand-header-bg': theme.brandHeaderBg,
    '--brand-card-bg': 'rgba(255, 255, 255, 0.04)',
    '--brand-text': '#FFFFFF',
    '--brand-text-muted': 'rgba(255, 255, 255, 0.7)'
  };
};

// Aliases para compatibilidade
export const getBrandModalTheme = getBrandTheme;
export const getBrandModalStyles = getBrandCSSVariables;

// Export do mapa de cores
export const OFFICIAL_BRAND_COLORS = Object.fromEntries(
  Object.entries(BRAND_THEME_MAP).map(([k, v]) => [k, v.primary])
);

export default {
  getBrandTheme,
  getBrandCSSVariables,
  getBrandModalTheme,
  getBrandModalStyles,
  OFFICIAL_BRAND_COLORS,
  BRAND_THEME_MAP
};
