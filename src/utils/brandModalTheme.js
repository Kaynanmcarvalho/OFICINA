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
    primary: '#0066B1',      // BMW Blue (oficial)
    secondary: '#1C1C1E',    // Grafite escuro
    deep: '#0A1929',         // Azul profundo noturno
    accent: '#4A9FD4',       // Azul claro para destaque
    glow: 'rgba(0, 102, 177, 0.3)'
  },
  'mercedes-benz': {
    primary: '#00ADEF',      // Mercedes Blue (oficial)
    secondary: '#0D0D0D',    // Preto piano
    deep: '#0A1A24',         // Prata escuro metálico
    accent: '#C0C0C0',       // Prata
    glow: 'rgba(192, 192, 192, 0.25)'
  },
  mercedes: {
    primary: '#00ADEF',
    secondary: '#0D0D0D',
    deep: '#0A1A24',
    accent: '#C0C0C0',
    glow: 'rgba(192, 192, 192, 0.25)'
  },
  audi: {
    primary: '#BB0A30',      // Audi Red (oficial)
    secondary: '#1A1A1A',    // Cinza carvão
    deep: '#1A0A0F',         // Vermelho escuro profundo
    accent: '#E8E8E8',       // Prata claro
    glow: 'rgba(187, 10, 48, 0.25)'
  },
  porsche: {
    primary: '#D5001C',      // Porsche Red (oficial - Guards Red)
    secondary: '#2A1810',    // Dourado queimado escuro
    deep: '#1A0D0A',         // Marrom escuro premium
    accent: '#D4A574',       // Dourado queimado
    glow: 'rgba(213, 0, 28, 0.25)'
  },
  volkswagen: {
    primary: '#001E50',      // VW Blue (oficial)
    secondary: '#0F1419',    // Azul escuro grafite
    deep: '#0A0F1A',         // Azul noturno
    accent: '#5C8DB8',       // Azul médio
    glow: 'rgba(0, 30, 80, 0.3)'
  },
  mini: {
    primary: '#006847',      // Mini British Racing Green (oficial)
    secondary: '#0A1A12',    // Verde escuro
    deep: '#08140D',         // Verde noturno
    accent: '#2E8B57',       // Verde mar
    glow: 'rgba(0, 104, 71, 0.25)'
  },

  // === ITALIANAS ===
  ferrari: {
    primary: '#DC0000',      // Rosso Corsa Ferrari (oficial)
    secondary: '#1A0A0A',    // Vermelho vinho escuro
    deep: '#140808',         // Bordô profundo
    accent: '#FF3333',       // Vermelho vivo para destaque
    glow: 'rgba(220, 0, 0, 0.25)'
  },
  lamborghini: {
    primary: '#DDB321',      // Lamborghini Gold (oficial - Giallo Orion)
    secondary: '#0D1A0D',    // Verde escuro agressivo
    deep: '#0A140A',         // Verde quase preto
    accent: '#9ACD32',       // Verde limão sutil
    glow: 'rgba(221, 179, 33, 0.2)'
  },
  maserati: {
    primary: '#0C2340',      // Maserati Blue (oficial - Blu Nettuno)
    secondary: '#0A1520',    // Azul marinho profundo
    deep: '#080F18',         // Azul noite
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(12, 35, 64, 0.3)'
  },
  'alfa romeo': {
    primary: '#981E32',      // Alfa Romeo Red (oficial - Rosso Alfa)
    secondary: '#1A0D10',    // Bordô escuro
    deep: '#120A0C',         // Vinho profundo
    accent: '#C41E3A',       // Vermelho cardeal
    glow: 'rgba(152, 30, 50, 0.25)'
  },
  'alfa-romeo': {
    primary: '#981E32',
    secondary: '#1A0D10',
    deep: '#120A0C',
    accent: '#C41E3A',
    glow: 'rgba(152, 30, 50, 0.25)'
  },
  fiat: {
    primary: '#9A0F21',      // Fiat Red (oficial)
    secondary: '#1A0A0D',    // Vermelho escuro
    deep: '#120608',         // Bordô profundo
    accent: '#CD5C5C',       // Coral escuro
    glow: 'rgba(154, 15, 33, 0.25)'
  },

  // === JAPONESAS ===
  toyota: {
    primary: '#EB0A1E',      // Toyota Red (oficial)
    secondary: '#1A0A0C',    // Vermelho escuro
    deep: '#140608',         // Bordô noturno
    accent: '#FF4444',       // Vermelho vivo
    glow: 'rgba(235, 10, 30, 0.25)'
  },
  lexus: {
    primary: '#1A1A1A',      // Lexus Black (oficial - premium)
    secondary: '#0D0D0D',    // Preto profundo
    deep: '#0A0A0A',         // Preto absoluto
    accent: '#C0C0C0',       // Prata
    glow: 'rgba(192, 192, 192, 0.15)'
  },
  honda: {
    primary: '#E40521',      // Honda Red (oficial)
    secondary: '#1A0A0C',    // Vermelho escuro
    deep: '#140608',         // Bordô profundo
    accent: '#FF5555',       // Vermelho claro
    glow: 'rgba(228, 5, 33, 0.25)'
  },
  acura: {
    primary: '#1A1A1A',      // Acura Black (oficial)
    secondary: '#0D0D0D',    // Preto profundo
    deep: '#0A0A0A',         // Preto absoluto
    accent: '#C0C0C0',       // Prata
    glow: 'rgba(192, 192, 192, 0.15)'
  },
  nissan: {
    primary: '#C3002F',      // Nissan Red (oficial)
    secondary: '#1A0A0E',    // Vermelho escuro
    deep: '#12060A',         // Bordô noturno
    accent: '#E63950',       // Vermelho coral
    glow: 'rgba(195, 0, 47, 0.25)'
  },
  mazda: {
    primary: '#910000',      // Mazda Soul Red Crystal (oficial)
    secondary: '#1A0808',    // Vermelho vinho escuro
    deep: '#120505',         // Bordô profundo
    accent: '#B22222',       // Vermelho tijolo
    glow: 'rgba(145, 0, 0, 0.3)'
  },
  subaru: {
    primary: '#013C74',      // Subaru Blue (oficial - WR Blue)
    secondary: '#0A1520',    // Azul escuro
    deep: '#080F18',         // Azul noturno
    accent: '#4682B4',       // Azul aço
    glow: 'rgba(1, 60, 116, 0.3)'
  },
  mitsubishi: {
    primary: '#ED0000',      // Mitsubishi Red (oficial)
    secondary: '#1A0808',    // Vermelho escuro
    deep: '#140606',         // Bordô profundo
    accent: '#FF4040',       // Vermelho vivo
    glow: 'rgba(237, 0, 0, 0.25)'
  },
  suzuki: {
    primary: '#E4002B',      // Suzuki Red (oficial)
    secondary: '#1A0A0C',    // Vermelho escuro
    deep: '#140608',         // Bordô noturno
    accent: '#FF3355',       // Vermelho coral
    glow: 'rgba(228, 0, 43, 0.25)'
  },
  infiniti: {
    primary: '#1C1C1C',      // Infiniti Black (oficial)
    secondary: '#0F0F0F',    // Preto profundo
    deep: '#0A0A0A',         // Preto absoluto
    accent: '#A0A0A0',       // Cinza médio
    glow: 'rgba(160, 160, 160, 0.15)'
  },
  isuzu: {
    primary: '#CC0000',      // Isuzu Red (oficial)
    secondary: '#1A0808',    // Vermelho escuro
    deep: '#140606',         // Bordô profundo
    accent: '#FF3333',       // Vermelho vivo
    glow: 'rgba(204, 0, 0, 0.25)'
  },
  daihatsu: {
    primary: '#CC0000',      // Daihatsu Red (oficial)
    secondary: '#1A0808',    // Vermelho escuro
    deep: '#140606',         // Bordô profundo
    accent: '#FF3333',       // Vermelho vivo
    glow: 'rgba(204, 0, 0, 0.25)'
  },

  // === COREANAS ===
  hyundai: {
    primary: '#002C5F',      // Hyundai Blue (oficial - Active Blue)
    secondary: '#0A1420',    // Azul escuro
    deep: '#080F18',         // Azul noturno
    accent: '#4A7FB0',       // Azul médio
    glow: 'rgba(0, 44, 95, 0.3)'
  },
  kia: {
    primary: '#05141F',      // Kia Midnight Black (oficial - novo logo 2021)
    secondary: '#0A1420',    // Azul escuro
    deep: '#080F18',         // Azul noturno
    accent: '#BB162B',       // Vermelho accent
    glow: 'rgba(5, 20, 31, 0.3)'
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
    secondary: '#0A1420',    // Azul escuro
    deep: '#080F18',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(0, 52, 120, 0.3)'
  },
  lincoln: {
    primary: '#1A1A1A',      // Lincoln Black (oficial - Pristine)
    secondary: '#0D0D0D',    // Preto profundo
    deep: '#0A0A0A',         // Preto absoluto
    accent: '#C0C0C0',       // Prata
    glow: 'rgba(192, 192, 192, 0.15)'
  },
  chevrolet: {
    primary: '#D4AF37',      // Chevrolet Gold (oficial - Bowtie Gold)
    secondary: '#1A1508',    // Dourado escuro
    deep: '#121008',         // Marrom dourado
    accent: '#FFD700',       // Ouro
    glow: 'rgba(212, 175, 55, 0.2)'
  },
  gmc: {
    primary: '#CC0000',      // GMC Red (oficial)
    secondary: '#1A0808',    // Vermelho escuro
    deep: '#140606',         // Bordô profundo
    accent: '#FF3333',       // Vermelho vivo
    glow: 'rgba(204, 0, 0, 0.25)'
  },
  buick: {
    primary: '#1A1A1A',      // Buick Black (oficial)
    secondary: '#0D0D0D',    // Preto profundo
    deep: '#0A0A0A',         // Preto absoluto
    accent: '#C0C0C0',       // Prata
    glow: 'rgba(192, 192, 192, 0.15)'
  },
  dodge: {
    primary: '#BA0C2F',      // Dodge Red (oficial - Viper Red)
    secondary: '#1A0A0D',    // Vermelho escuro
    deep: '#120608',         // Bordô profundo
    accent: '#DC143C',       // Carmesim
    glow: 'rgba(186, 12, 47, 0.25)'
  },
  ram: {
    primary: '#1A1A1A',      // RAM Black (oficial)
    secondary: '#0D0D0D',    // Preto profundo
    deep: '#0A0A0A',         // Preto absoluto
    accent: '#C0C0C0',       // Prata
    glow: 'rgba(192, 192, 192, 0.15)'
  },
  chrysler: {
    primary: '#003DA5',      // Chrysler Blue (oficial)
    secondary: '#0A1428',    // Azul escuro
    deep: '#080F1A',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(0, 61, 165, 0.3)'
  },
  jeep: {
    primary: '#3D5C3D',      // Jeep Green (oficial - Sarge Green)
    secondary: '#0D1A0D',    // Verde escuro
    deep: '#0A140A',         // Verde noturno
    accent: '#556B2F',       // Verde oliva
    glow: 'rgba(61, 92, 61, 0.25)'
  },
  tesla: {
    primary: '#CC0000',      // Tesla Red (oficial)
    secondary: '#1A1A1A',    // Cinza escuro minimalista
    deep: '#121212',         // Preto suave
    accent: '#E8E8E8',       // Branco suave
    glow: 'rgba(204, 0, 0, 0.15)'
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
    secondary: '#0A1428',    // Azul escuro
    deep: '#080F1A',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(0, 61, 165, 0.3)'
  },
  renault: {
    primary: '#FFCC00',      // Renault Yellow (oficial)
    secondary: '#1A1808',    // Amarelo escuro
    deep: '#14120A',         // Dourado noturno
    accent: '#FFD700',       // Ouro
    glow: 'rgba(255, 204, 0, 0.2)'
  },
  citroen: {
    primary: '#AC1926',      // Citroën Red (oficial)
    secondary: '#1A0A0D',    // Vermelho escuro
    deep: '#120608',         // Bordô profundo
    accent: '#CD5C5C',       // Coral
    glow: 'rgba(172, 25, 38, 0.25)'
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
    primary: '#1A1A1A',      // Jaguar Black (oficial - British Racing Green alternativo)
    secondary: '#1A1512',    // Bronze escuro
    deep: '#12100D',         // Marrom noturno
    accent: '#8B7355',       // Bronze médio
    glow: 'rgba(26, 26, 26, 0.2)'
  },
  'land rover': {
    primary: '#005A2B',      // Land Rover Green (oficial - Coniston Green)
    secondary: '#0A1A0F',    // Verde escuro
    deep: '#08140A',         // Verde noturno
    accent: '#228B22',       // Verde floresta
    glow: 'rgba(0, 90, 43, 0.25)'
  },
  'land-rover': {
    primary: '#005A2B',
    secondary: '#0A1A0F',
    deep: '#08140A',
    accent: '#228B22',
    glow: 'rgba(0, 90, 43, 0.25)'
  },
  'range rover': {
    primary: '#005A2B',
    secondary: '#0A1A0F',
    deep: '#08140A',
    accent: '#228B22',
    glow: 'rgba(0, 90, 43, 0.25)'
  },
  'aston martin': {
    primary: '#006847',      // Aston Martin Green (oficial - Racing Green)
    secondary: '#0A1A12',    // Verde escuro
    deep: '#08140D',         // Verde noturno
    accent: '#2E8B57',       // Verde mar
    glow: 'rgba(0, 104, 71, 0.25)'
  },
  'aston-martin': {
    primary: '#006847',
    secondary: '#0A1A12',
    deep: '#08140D',
    accent: '#2E8B57',
    glow: 'rgba(0, 104, 71, 0.25)'
  },
  bentley: {
    primary: '#333333',      // Bentley Black (oficial - Beluga)
    secondary: '#1A1A1A',    // Preto profundo
    deep: '#0D0D0D',         // Preto absoluto
    accent: '#C0C0C0',       // Prata
    glow: 'rgba(192, 192, 192, 0.15)'
  },
  'rolls-royce': {
    primary: '#680021',      // Rolls-Royce Purple (oficial - Phantom Purple)
    secondary: '#1A0A12',    // Roxo escuro
    deep: '#12080D',         // Roxo noturno
    accent: '#8B008B',       // Magenta escuro
    glow: 'rgba(104, 0, 33, 0.25)'
  },
  'rolls royce': {
    primary: '#680021',
    secondary: '#1A0A12',
    deep: '#12080D',
    accent: '#8B008B',
    glow: 'rgba(104, 0, 33, 0.25)'
  },
  mclaren: {
    primary: '#FF8000',      // McLaren Papaya Orange (oficial - Papaya Spark)
    secondary: '#1A1208',    // Laranja escuro
    deep: '#14100A',         // Laranja noturno
    accent: '#FF9933',       // Laranja claro
    glow: 'rgba(255, 128, 0, 0.25)'
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
    secondary: '#0A1420',    // Azul escuro
    deep: '#080F18',         // Azul noturno
    accent: '#4682B4',       // Azul aço
    glow: 'rgba(0, 48, 87, 0.3)'
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
    secondary: '#0A1828',    // Azul escuro
    deep: '#08121A',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(30, 80, 160, 0.3)'
  },
  chery: {
    primary: '#CC0000',      // Chery Red (oficial)
    secondary: '#1A0808',    // Vermelho escuro
    deep: '#140606',         // Bordô profundo
    accent: '#FF3333',       // Vermelho vivo
    glow: 'rgba(204, 0, 0, 0.25)'
  },
  'caoa chery': {
    primary: '#CC0000',
    secondary: '#1A0808',
    deep: '#140606',
    accent: '#FF3333',
    glow: 'rgba(204, 0, 0, 0.25)'
  },
  gwm: {
    primary: '#CC0000',      // GWM Red (oficial - Great Wall Motors)
    secondary: '#1A0808',    // Vermelho escuro
    deep: '#140606',         // Bordô profundo
    accent: '#FF3333',       // Vermelho vivo
    glow: 'rgba(204, 0, 0, 0.25)'
  },
  haval: {
    primary: '#CC0000',      // Haval Red (oficial)
    secondary: '#1A0808',    // Vermelho escuro
    deep: '#140606',         // Bordô profundo
    accent: '#FF3333',       // Vermelho vivo
    glow: 'rgba(204, 0, 0, 0.25)'
  },
  geely: {
    primary: '#003DA5',      // Geely Blue (oficial)
    secondary: '#0A1428',    // Azul escuro
    deep: '#080F1A',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(0, 61, 165, 0.3)'
  },
  jac: {
    primary: '#003DA5',      // JAC Blue (oficial)
    secondary: '#0A1428',    // Azul escuro
    deep: '#080F1A',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(0, 61, 165, 0.3)'
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
    primary: '#0033A0',      // Yamaha Blue (oficial - Racing Blue)
    secondary: '#0A1428',    // Azul escuro
    deep: '#080F1A',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(0, 51, 160, 0.3)'
  },
  kawasaki: {
    primary: '#6BBE45',      // Kawasaki Green (oficial - Lime Green)
    secondary: '#0D1A0A',    // Verde escuro
    deep: '#0A140A',         // Verde noturno
    accent: '#7CFC00',       // Verde limão
    glow: 'rgba(107, 190, 69, 0.25)'
  },
  ducati: {
    primary: '#CC0000',      // Ducati Red (oficial - Rosso Ducati)
    secondary: '#1A0808',    // Vermelho escuro
    deep: '#140606',         // Bordô profundo
    accent: '#FF3333',       // Vermelho vivo
    glow: 'rgba(204, 0, 0, 0.25)'
  },
  'harley-davidson': {
    primary: '#F36F21',      // Harley Orange (oficial - Bar & Shield Orange)
    secondary: '#1A1008',    // Laranja escuro
    deep: '#140D08',         // Laranja noturno
    accent: '#FF8C00',       // Laranja escuro
    glow: 'rgba(243, 111, 33, 0.25)'
  },
  harley: {
    primary: '#F36F21',
    secondary: '#1A1008',
    deep: '#140D08',
    accent: '#FF8C00',
    glow: 'rgba(243, 111, 33, 0.25)'
  },
  triumph: {
    primary: '#000000',      // Triumph Black (oficial)
    secondary: '#1A1A1A',    // Preto profundo
    deep: '#0D0D0D',         // Preto absoluto
    accent: '#A0A0A0',       // Cinza
    glow: 'rgba(160, 160, 160, 0.15)'
  },
  ktm: {
    primary: '#FF6600',      // KTM Orange (oficial - Ready to Race Orange)
    secondary: '#1A1008',    // Laranja escuro
    deep: '#140D08',         // Laranja noturno
    accent: '#FF8533',       // Laranja claro
    glow: 'rgba(255, 102, 0, 0.25)'
  },
  'bmw-motorrad': {
    primary: '#0066B1',      // BMW Motorrad Blue (oficial)
    secondary: '#1C1C1E',    // Grafite escuro
    deep: '#0A1929',         // Azul profundo noturno
    accent: '#4A9FD4',       // Azul claro para destaque
    glow: 'rgba(0, 102, 177, 0.3)'
  },
  aprilia: {
    primary: '#CC0000',      // Aprilia Red (oficial)
    secondary: '#1A0808',    // Vermelho escuro
    deep: '#140606',         // Bordô profundo
    accent: '#FF3333',       // Vermelho vivo
    glow: 'rgba(204, 0, 0, 0.25)'
  },
  mv: {
    primary: '#CC0000',      // MV Agusta Red (oficial)
    secondary: '#1A0808',    // Vermelho escuro
    deep: '#140606',         // Bordô profundo
    accent: '#FF3333',       // Vermelho vivo
    glow: 'rgba(204, 0, 0, 0.25)'
  },
  'mv agusta': {
    primary: '#CC0000',
    secondary: '#1A0808',
    deep: '#140606',
    accent: '#FF3333',
    glow: 'rgba(204, 0, 0, 0.25)'
  },
  'royal enfield': {
    primary: '#1A1A1A',      // Royal Enfield Black (oficial)
    secondary: '#0D0D0D',    // Preto profundo
    deep: '#0A0A0A',         // Preto absoluto
    accent: '#A0A0A0',       // Cinza
    glow: 'rgba(160, 160, 160, 0.15)'
  },
  indian: {
    primary: '#CC0000',      // Indian Red (oficial)
    secondary: '#1A0808',    // Vermelho escuro
    deep: '#140606',         // Bordô profundo
    accent: '#FF3333',       // Vermelho vivo
    glow: 'rgba(204, 0, 0, 0.25)'
  },
  husqvarna: {
    primary: '#003DA5',      // Husqvarna Blue (oficial)
    secondary: '#0A1428',    // Azul escuro
    deep: '#080F1A',         // Azul noturno
    accent: '#4169E1',       // Azul royal
    glow: 'rgba(0, 61, 165, 0.3)'
  },
  dafra: {
    primary: '#CC0000',      // Dafra Red (oficial)
    secondary: '#1A0808',    // Vermelho escuro
    deep: '#140606',         // Bordô profundo
    accent: '#FF3333',       // Vermelho vivo
    glow: 'rgba(204, 0, 0, 0.25)'
  },
  shineray: {
    primary: '#CC0000',      // Shineray Red (oficial)
    secondary: '#1A0808',    // Vermelho escuro
    deep: '#140606',         // Bordô profundo
    accent: '#FF3333',       // Vermelho vivo
    glow: 'rgba(204, 0, 0, 0.25)'
  },

  // === CAMINHÕES E COMERCIAIS ===
  scania: {
    primary: '#CC0000',      // Scania Red (oficial - Griffin Red)
    secondary: '#1A0808',    // Vermelho escuro
    deep: '#140606',         // Bordô profundo
    accent: '#FF3333',       // Vermelho vivo
    glow: 'rgba(204, 0, 0, 0.25)'
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
    primary: '#CC0000',      // Mahindra Red (oficial)
    secondary: '#1A0808',    // Vermelho escuro
    deep: '#140606',         // Bordô profundo
    accent: '#FF3333',       // Vermelho vivo
    glow: 'rgba(204, 0, 0, 0.25)'
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
    primary: '#E4002B',      // SEAT Red (oficial - Desire Red)
    secondary: '#1A0A0C',    // Vermelho escuro
    deep: '#140608',         // Bordô noturno
    accent: '#FF3355',       // Vermelho coral
    glow: 'rgba(228, 0, 43, 0.25)'
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
