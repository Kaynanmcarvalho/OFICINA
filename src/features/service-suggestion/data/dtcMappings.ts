/**
 * TORQ Service Suggestion - DTC Mappings
 * Mapeamento de códigos DTC para serviços e peças
 */

import type { DTCServiceMapping, ServiceCategory, SuggestionPriority } from '../types';

// Mapeamentos de códigos DTC para serviços
export const DTC_SERVICE_MAPPINGS: DTCServiceMapping[] = [
  // ===== SISTEMA DE COMBUSTÍVEL =====
  {
    dtcPattern: '^P0171$|^P0174$',
    services: ['Limpeza de bicos injetores', 'Verificação de vazamentos de vácuo', 'Substituição do sensor MAF'],
    parts: ['Filtro de ar', 'Sensor MAF', 'Juntas de admissão'],
    priority: 'high',
    description: 'Sistema muito pobre - mistura ar/combustível incorreta',
  },
  {
    dtcPattern: '^P0172$|^P0175$',
    services: ['Limpeza de bicos injetores', 'Verificação do sensor de oxigênio', 'Substituição do filtro de ar'],
    parts: ['Filtro de ar', 'Sensor de oxigênio', 'Bicos injetores'],
    priority: 'high',
    description: 'Sistema muito rico - excesso de combustível',
  },
  {
    dtcPattern: '^P0300$',
    services: ['Diagnóstico de falha de ignição', 'Verificação de velas', 'Verificação de bobinas'],
    parts: ['Velas de ignição', 'Cabos de vela', 'Bobinas de ignição'],
    priority: 'urgent',
    description: 'Falha de ignição aleatória detectada',
  },
  {
    dtcPattern: '^P030[1-8]$',
    services: ['Substituição de vela de ignição', 'Verificação de bobina', 'Teste de compressão'],
    parts: ['Vela de ignição', 'Bobina de ignição', 'Cabo de vela'],
    priority: 'high',
    description: 'Falha de ignição em cilindro específico',
  },

  // ===== CATALISADOR E EMISSÕES =====
  {
    dtcPattern: '^P0420$|^P0430$',
    services: ['Verificação do catalisador', 'Substituição do catalisador', 'Verificação de sensores de O2'],
    parts: ['Catalisador', 'Sensor de oxigênio dianteiro', 'Sensor de oxigênio traseiro'],
    priority: 'high',
    description: 'Eficiência do catalisador abaixo do limite',
  },
  {
    dtcPattern: '^P0440$|^P0441$|^P0442$',
    services: ['Verificação do sistema EVAP', 'Substituição da tampa do tanque', 'Verificação de vazamentos'],
    parts: ['Tampa do tanque', 'Válvula de purga EVAP', 'Mangueiras EVAP'],
    priority: 'medium',
    description: 'Problema no sistema de emissões evaporativas',
  },

  // ===== SENSORES DE OXIGÊNIO =====
  {
    dtcPattern: '^P0130$|^P0131$|^P0132$|^P0133$|^P0134$',
    services: ['Substituição do sensor de O2 (Banco 1, Sensor 1)', 'Verificação de fiação'],
    parts: ['Sensor de oxigênio B1S1'],
    priority: 'high',
    description: 'Problema no sensor de oxigênio dianteiro',
  },
  {
    dtcPattern: '^P0136$|^P0137$|^P0138$|^P0139$|^P0140$',
    services: ['Substituição do sensor de O2 (Banco 1, Sensor 2)', 'Verificação de fiação'],
    parts: ['Sensor de oxigênio B1S2'],
    priority: 'medium',
    description: 'Problema no sensor de oxigênio traseiro',
  },

  // ===== SISTEMA DE ARREFECIMENTO =====
  {
    dtcPattern: '^P0115$|^P0116$|^P0117$|^P0118$|^P0119$',
    services: ['Substituição do sensor de temperatura', 'Verificação do sistema de arrefecimento'],
    parts: ['Sensor de temperatura do motor', 'Termostato'],
    priority: 'high',
    description: 'Problema no sensor de temperatura do motor',
  },
  {
    dtcPattern: '^P0125$',
    services: ['Verificação do termostato', 'Verificação do sensor de temperatura'],
    parts: ['Termostato', 'Sensor de temperatura'],
    priority: 'medium',
    description: 'Temperatura insuficiente para controle de combustível',
  },
  {
    dtcPattern: '^P0217$',
    services: ['Verificação do sistema de arrefecimento', 'Troca de líquido de arrefecimento', 'Verificação do radiador'],
    parts: ['Líquido de arrefecimento', 'Termostato', 'Bomba d\'água'],
    priority: 'urgent',
    description: 'Superaquecimento do motor',
  },

  // ===== TRANSMISSÃO =====
  {
    dtcPattern: '^P0700$',
    services: ['Diagnóstico completo da transmissão', 'Verificação de solenoides'],
    parts: ['Fluido de transmissão', 'Filtro de transmissão'],
    priority: 'high',
    description: 'Falha no sistema de controle da transmissão',
  },
  {
    dtcPattern: '^P0715$|^P0720$',
    services: ['Substituição do sensor de velocidade', 'Verificação de fiação'],
    parts: ['Sensor de velocidade da transmissão'],
    priority: 'high',
    description: 'Problema no sensor de velocidade da transmissão',
  },
  {
    dtcPattern: '^P0730$|^P0731$|^P0732$|^P0733$|^P0734$',
    services: ['Diagnóstico da transmissão', 'Troca de fluido', 'Verificação de solenoides'],
    parts: ['Fluido de transmissão', 'Kit de solenoides', 'Filtro de transmissão'],
    priority: 'urgent',
    description: 'Relação de marcha incorreta',
  },

  // ===== ABS E FREIOS =====
  {
    dtcPattern: '^C0035$|^C0040$|^C0045$|^C0050$',
    services: ['Verificação do sensor ABS', 'Substituição do sensor de velocidade da roda'],
    parts: ['Sensor de velocidade da roda ABS'],
    priority: 'high',
    description: 'Problema no sensor de velocidade da roda',
  },
  {
    dtcPattern: '^C0265$|^C0267$',
    services: ['Verificação do módulo ABS', 'Diagnóstico do sistema de freios'],
    parts: ['Módulo ABS', 'Bomba ABS'],
    priority: 'urgent',
    description: 'Falha no módulo de controle ABS',
  },

  // ===== AIRBAG =====
  {
    dtcPattern: '^B0001$|^B0002$|^B0003$',
    services: ['Diagnóstico do sistema de airbag', 'Verificação de conectores'],
    parts: ['Módulo de airbag', 'Sensor de impacto'],
    priority: 'urgent',
    description: 'Falha no sistema de airbag',
  },

  // ===== COMUNICAÇÃO =====
  {
    dtcPattern: '^U0100$',
    services: ['Diagnóstico de comunicação CAN', 'Verificação do módulo ECM'],
    parts: ['Módulo ECM'],
    priority: 'urgent',
    description: 'Perda de comunicação com ECM/PCM',
  },
  {
    dtcPattern: '^U0101$',
    services: ['Diagnóstico de comunicação CAN', 'Verificação do módulo TCM'],
    parts: ['Módulo TCM'],
    priority: 'high',
    description: 'Perda de comunicação com TCM',
  },

  // ===== ACELERADOR ELETRÔNICO =====
  {
    dtcPattern: '^P2101$|^P2102$|^P2103$',
    services: ['Verificação do corpo de borboleta', 'Limpeza do corpo de borboleta'],
    parts: ['Corpo de borboleta', 'Sensor TPS'],
    priority: 'high',
    description: 'Problema no atuador do corpo de borboleta',
  },
  {
    dtcPattern: '^P2135$',
    services: ['Substituição do sensor TPS', 'Verificação de fiação'],
    parts: ['Sensor de posição do acelerador (TPS)'],
    priority: 'urgent',
    description: 'Correlação incorreta dos sensores de posição do acelerador',
  },
];

// Mapeamento de danos para serviços
export const DAMAGE_SERVICE_MAPPINGS: Record<string, {
  services: string[];
  parts: string[];
  category: ServiceCategory;
  priority: SuggestionPriority;
}> = {
  scratches: {
    services: ['Polimento', 'Pintura localizada'],
    parts: ['Massa plástica', 'Tinta automotiva', 'Verniz'],
    category: 'body',
    priority: 'low',
  },
  dents: {
    services: ['Funilaria', 'Martelinho de ouro', 'Pintura'],
    parts: ['Massa plástica', 'Primer', 'Tinta automotiva'],
    category: 'body',
    priority: 'medium',
  },
  cracks: {
    services: ['Substituição de peça', 'Reparo estrutural'],
    parts: ['Peça de reposição'],
    category: 'body',
    priority: 'high',
  },
  worn_tires: {
    services: ['Substituição de pneus', 'Alinhamento', 'Balanceamento'],
    parts: ['Pneu novo'],
    category: 'tires',
    priority: 'urgent',
  },
  rust: {
    services: ['Tratamento anticorrosivo', 'Funilaria', 'Pintura'],
    parts: ['Convertedor de ferrugem', 'Primer anticorrosivo', 'Tinta'],
    category: 'body',
    priority: 'high',
  },
  broken_glass: {
    services: ['Substituição de vidro'],
    parts: ['Vidro automotivo', 'Borracha de vedação'],
    category: 'body',
    priority: 'urgent',
  },
  paint_damage: {
    services: ['Pintura', 'Polimento'],
    parts: ['Tinta automotiva', 'Verniz', 'Lixa'],
    category: 'body',
    priority: 'medium',
  },
  bumper_damage: {
    services: ['Reparo de para-choque', 'Substituição de para-choque'],
    parts: ['Para-choque', 'Suportes', 'Parafusos'],
    category: 'body',
    priority: 'medium',
  },
  light_damage: {
    services: ['Substituição de farol/lanterna', 'Reparo elétrico'],
    parts: ['Farol', 'Lanterna', 'Lâmpadas'],
    category: 'electrical',
    priority: 'high',
  },
  mirror_damage: {
    services: ['Substituição de retrovisor'],
    parts: ['Espelho retrovisor', 'Capa do retrovisor'],
    category: 'body',
    priority: 'medium',
  },
};

// Serviços de manutenção preventiva por quilometragem
export const MILEAGE_SERVICES: Array<{
  mileageInterval: number;
  services: string[];
  parts: string[];
  category: ServiceCategory;
  priority: SuggestionPriority;
}> = [
  {
    mileageInterval: 10000,
    services: ['Troca de óleo', 'Verificação de filtros'],
    parts: ['Óleo do motor', 'Filtro de óleo'],
    category: 'maintenance',
    priority: 'medium',
  },
  {
    mileageInterval: 20000,
    services: ['Troca de filtro de ar', 'Verificação de freios'],
    parts: ['Filtro de ar', 'Pastilhas de freio'],
    category: 'maintenance',
    priority: 'medium',
  },
  {
    mileageInterval: 40000,
    services: ['Troca de velas', 'Troca de filtro de combustível'],
    parts: ['Velas de ignição', 'Filtro de combustível'],
    category: 'maintenance',
    priority: 'medium',
  },
  {
    mileageInterval: 60000,
    services: ['Troca de correia dentada', 'Troca de fluido de transmissão'],
    parts: ['Correia dentada', 'Tensor', 'Fluido de transmissão'],
    category: 'maintenance',
    priority: 'high',
  },
  {
    mileageInterval: 100000,
    services: ['Revisão completa do motor', 'Verificação de suspensão'],
    parts: ['Kit de revisão', 'Amortecedores', 'Buchas'],
    category: 'maintenance',
    priority: 'high',
  },
];

// Preços base de serviços (em BRL)
export const SERVICE_BASE_PRICES: Record<string, { labor: number; time: number }> = {
  'Troca de óleo': { labor: 50, time: 30 },
  'Troca de filtro de ar': { labor: 30, time: 15 },
  'Troca de velas': { labor: 80, time: 45 },
  'Limpeza de bicos injetores': { labor: 150, time: 60 },
  'Substituição do sensor MAF': { labor: 100, time: 45 },
  'Substituição do catalisador': { labor: 300, time: 120 },
  'Diagnóstico completo': { labor: 150, time: 60 },
  'Alinhamento': { labor: 80, time: 30 },
  'Balanceamento': { labor: 60, time: 30 },
  'Polimento': { labor: 200, time: 180 },
  'Pintura localizada': { labor: 300, time: 240 },
  'Funilaria': { labor: 400, time: 300 },
  'Troca de correia dentada': { labor: 350, time: 180 },
};
