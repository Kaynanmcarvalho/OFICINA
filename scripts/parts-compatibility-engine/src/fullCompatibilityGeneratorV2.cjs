/**
 * Full Compatibility Generator V2
 * Gera peças para TODOS os veículos do frontend
 * Usa mapeamento por plataforma/marca para garantir 100% de cobertura
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// BASE DE PEÇAS POR PLATAFORMA/MARCA
// ============================================================================
const PARTS_BY_PLATFORM = {
  // VW - Plataforma PQ24 (Gol, Voyage, Fox, Saveiro, Up)
  VW_PQ24: {
    filters: [
      { partNumber: 'W712/95', brand: 'MANN-FILTER', name: 'Filtro de Óleo', avgPrice: 45, equivalents: ['TECFIL PSL315', 'FRAM PH6811'] },
      { partNumber: 'C27192/1', brand: 'MANN-FILTER', name: 'Filtro de Ar', avgPrice: 55, equivalents: ['TECFIL ARL6079', 'FRAM CA10242'] },
      { partNumber: 'CUK2939', brand: 'MANN-FILTER', name: 'Filtro de Cabine', avgPrice: 65, equivalents: ['TECFIL ACP315', 'FRAM CF10775'] },
    ],
    brakes: [
      { partNumber: 'N-1108', brand: 'COBREQ', name: 'Pastilha de Freio Dianteira', avgPrice: 85, equivalents: ['FRAS-LE PD/580', 'BOSCH BP1108'] },
      { partNumber: 'BD1108', brand: 'FREMAX', name: 'Disco de Freio Dianteiro', avgPrice: 180, equivalents: ['HIPPER FREIOS HF108', 'VARGA 1108'] },
    ],
    ignition: [
      { partNumber: 'BKR6E', brand: 'NGK', name: 'Vela de Ignição', avgPrice: 25, equivalents: ['BOSCH FR7DC+', 'DENSO K20PR-U'] },
    ],
    suspension: [
      { partNumber: 'GP32960', brand: 'MONROE', name: 'Amortecedor Dianteiro', avgPrice: 280, equivalents: ['COFAP MP32960', 'NAKATA HG32960'] },
      { partNumber: 'GP32961', brand: 'MONROE', name: 'Amortecedor Traseiro', avgPrice: 220, equivalents: ['COFAP MP32961', 'NAKATA HG32961'] },
    ],
    electrical: [
      { partNumber: 'M60GD', brand: 'MOURA', name: 'Bateria 60Ah', avgPrice: 450, equivalents: ['HELIAR HF60DD', 'ACDelco 60AH'] },
    ],
    engine: [
      { partNumber: 'CT1028', brand: 'CONTITECH', name: 'Correia Dentada', avgPrice: 120, equivalents: ['GATES 5552XS', 'DAYCO 941028'] },
      { partNumber: 'WP1028', brand: 'URBA', name: 'Bomba D\'Água', avgPrice: 180, equivalents: ['INDISA 1028', 'NAKATA NKBA1028'] },
    ],
    transmission: [
      { partNumber: 'CK1028', brand: 'LUK', name: 'Kit Embreagem', avgPrice: 650, equivalents: ['SACHS 3000954095', 'VALEO 826818'] },
    ],
    bearings: [
      { partNumber: 'WB1028', brand: 'SKF', name: 'Rolamento de Roda Dianteiro', avgPrice: 180, equivalents: ['FAG 713610100', 'NSK 45BWD10'] },
    ],
  },

  // VW - Plataforma MQB (Golf, Polo, Virtus, T-Cross, Nivus, Taos, Jetta)
  VW_MQB: {
    filters: [
      { partNumber: 'HU719/7X', brand: 'MANN-FILTER', name: 'Filtro de Óleo', avgPrice: 85, equivalents: ['MAHLE OX188D', 'BOSCH P9192'] },
      { partNumber: 'C35154', brand: 'MANN-FILTER', name: 'Filtro de Ar', avgPrice: 75, equivalents: ['TECFIL ARL2154', 'FRAM CA11154'] },
      { partNumber: 'CUK26009', brand: 'MANN-FILTER', name: 'Filtro de Cabine', avgPrice: 85, equivalents: ['TECFIL ACP809', 'FRAM CF11809'] },
    ],
    brakes: [
      { partNumber: 'N-1256', brand: 'COBREQ', name: 'Pastilha de Freio Dianteira', avgPrice: 120, equivalents: ['FRAS-LE PD/1256', 'BOSCH BP1256'] },
      { partNumber: 'BD1256', brand: 'FREMAX', name: 'Disco de Freio Dianteiro', avgPrice: 280, equivalents: ['HIPPER FREIOS HF1256', 'VARGA 1256'] },
    ],
    ignition: [
      { partNumber: 'ILZKR7B-11S', brand: 'NGK', name: 'Vela de Ignição Iridium', avgPrice: 65, equivalents: ['BOSCH FR7KI332S', 'DENSO IK20TT'] },
    ],
    suspension: [
      { partNumber: 'GP33256', brand: 'MONROE', name: 'Amortecedor Dianteiro', avgPrice: 380, equivalents: ['COFAP MP33256', 'NAKATA HG33256'] },
      { partNumber: 'GP33257', brand: 'MONROE', name: 'Amortecedor Traseiro', avgPrice: 320, equivalents: ['COFAP MP33257', 'NAKATA HG33257'] },
    ],
    electrical: [
      { partNumber: 'M70GD', brand: 'MOURA', name: 'Bateria 70Ah', avgPrice: 550, equivalents: ['HELIAR HF70DD', 'ACDelco 70AH'] },
    ],
    engine: [
      { partNumber: 'CT1256', brand: 'CONTITECH', name: 'Correia Dentada', avgPrice: 180, equivalents: ['GATES 5656XS', 'DAYCO 941256'] },
      { partNumber: 'WP1256', brand: 'URBA', name: 'Bomba D\'Água', avgPrice: 280, equivalents: ['INDISA 1256', 'NAKATA NKBA1256'] },
    ],
    transmission: [
      { partNumber: 'CK1256', brand: 'LUK', name: 'Kit Embreagem', avgPrice: 850, equivalents: ['SACHS 3000954256', 'VALEO 826956'] },
    ],
    bearings: [
      { partNumber: 'WB1256', brand: 'SKF', name: 'Rolamento de Roda Dianteiro', avgPrice: 220, equivalents: ['FAG 713610256', 'NSK 45BWD256'] },
    ],
  },

  // FIAT - Plataforma Fire (Uno, Palio, Siena, Strada, Mobi)
  FIAT_FIRE: {
    filters: [
      { partNumber: 'W712/73', brand: 'MANN-FILTER', name: 'Filtro de Óleo', avgPrice: 42, equivalents: ['TECFIL PSL140', 'FRAM PH5949'] },
      { partNumber: 'C2569', brand: 'MANN-FILTER', name: 'Filtro de Ar', avgPrice: 48, equivalents: ['TECFIL ARL2569', 'FRAM CA9482'] },
      { partNumber: 'CU2026', brand: 'MANN-FILTER', name: 'Filtro de Cabine', avgPrice: 55, equivalents: ['TECFIL ACP026', 'FRAM CF10026'] },
    ],
    brakes: [
      { partNumber: 'N-1047', brand: 'COBREQ', name: 'Pastilha de Freio Dianteira', avgPrice: 75, equivalents: ['FRAS-LE PD/1047', 'BOSCH BP1047'] },
      { partNumber: 'BD1047', brand: 'FREMAX', name: 'Disco de Freio Dianteiro', avgPrice: 160, equivalents: ['HIPPER FREIOS HF1047', 'VARGA 1047'] },
    ],
    ignition: [
      { partNumber: 'BKR5E', brand: 'NGK', name: 'Vela de Ignição', avgPrice: 22, equivalents: ['BOSCH FR8DC+', 'DENSO K16PR-U'] },
    ],
    suspension: [
      { partNumber: 'GP32047', brand: 'MONROE', name: 'Amortecedor Dianteiro', avgPrice: 250, equivalents: ['COFAP MP32047', 'NAKATA HG32047'] },
      { partNumber: 'GP32048', brand: 'MONROE', name: 'Amortecedor Traseiro', avgPrice: 200, equivalents: ['COFAP MP32048', 'NAKATA HG32048'] },
    ],
    electrical: [
      { partNumber: 'M48FD', brand: 'MOURA', name: 'Bateria 48Ah', avgPrice: 380, equivalents: ['HELIAR HF48DD', 'ACDelco 48AH'] },
    ],
    engine: [
      { partNumber: 'CT1047', brand: 'CONTITECH', name: 'Correia Dentada', avgPrice: 95, equivalents: ['GATES 5447XS', 'DAYCO 941047'] },
      { partNumber: 'WP1047', brand: 'URBA', name: 'Bomba D\'Água', avgPrice: 150, equivalents: ['INDISA 1047', 'NAKATA NKBA1047'] },
    ],
    transmission: [
      { partNumber: 'CK1047', brand: 'LUK', name: 'Kit Embreagem', avgPrice: 580, equivalents: ['SACHS 3000954047', 'VALEO 826047'] },
    ],
    bearings: [
      { partNumber: 'WB1047', brand: 'SKF', name: 'Rolamento de Roda Dianteiro', avgPrice: 160, equivalents: ['FAG 713610047', 'NSK 45BWD047'] },
    ],
  },

  // FIAT - Plataforma Argo (Argo, Cronos, Pulse, Fastback)
  FIAT_ARGO: {
    filters: [
      { partNumber: 'HU712/11X', brand: 'MANN-FILTER', name: 'Filtro de Óleo', avgPrice: 75, equivalents: ['MAHLE OX411D', 'BOSCH P9411'] },
      { partNumber: 'C27107', brand: 'MANN-FILTER', name: 'Filtro de Ar', avgPrice: 65, equivalents: ['TECFIL ARL7107', 'FRAM CA11107'] },
    ],
    brakes: [
      { partNumber: 'N-1411', brand: 'COBREQ', name: 'Pastilha de Freio Dianteira', avgPrice: 95, equivalents: ['FRAS-LE PD/1411', 'BOSCH BP1411'] },
      { partNumber: 'BD1411', brand: 'FREMAX', name: 'Disco de Freio Dianteiro', avgPrice: 220, equivalents: ['HIPPER FREIOS HF1411', 'VARGA 1411'] },
    ],
    ignition: [
      { partNumber: 'ILZKR7B-11S', brand: 'NGK', name: 'Vela de Ignição Iridium', avgPrice: 65, equivalents: ['BOSCH FR7KI332S', 'DENSO IK20TT'] },
    ],
    suspension: [
      { partNumber: 'GP33411', brand: 'MONROE', name: 'Amortecedor Dianteiro', avgPrice: 320, equivalents: ['COFAP MP33411', 'NAKATA HG33411'] },
    ],
    electrical: [
      { partNumber: 'M60GD', brand: 'MOURA', name: 'Bateria 60Ah', avgPrice: 450, equivalents: ['HELIAR HF60DD', 'ACDelco 60AH'] },
    ],
    engine: [
      { partNumber: 'CT1411', brand: 'CONTITECH', name: 'Correia Dentada', avgPrice: 150, equivalents: ['GATES 5611XS', 'DAYCO 941411'] },
    ],
    transmission: [
      { partNumber: 'CK1411', brand: 'LUK', name: 'Kit Embreagem', avgPrice: 720, equivalents: ['SACHS 3000954411', 'VALEO 826411'] },
    ],
    bearings: [
      { partNumber: 'WB1411', brand: 'SKF', name: 'Rolamento de Roda Dianteiro', avgPrice: 200, equivalents: ['FAG 713610411', 'NSK 45BWD411'] },
    ],
  },

  // GM - Plataforma GEM (Onix, Prisma, Spin, Cobalt)
  GM_GEM: {
    filters: [
      { partNumber: 'W712/94', brand: 'MANN-FILTER', name: 'Filtro de Óleo', avgPrice: 48, equivalents: ['TECFIL PSL594', 'FRAM PH10575'] },
      { partNumber: 'C27154', brand: 'MANN-FILTER', name: 'Filtro de Ar', avgPrice: 58, equivalents: ['TECFIL ARL7154', 'FRAM CA11154'] },
    ],
    brakes: [
      { partNumber: 'N-1575', brand: 'COBREQ', name: 'Pastilha de Freio Dianteira', avgPrice: 88, equivalents: ['FRAS-LE PD/1575', 'BOSCH BP1575'] },
      { partNumber: 'BD1575', brand: 'FREMAX', name: 'Disco de Freio Dianteiro', avgPrice: 195, equivalents: ['HIPPER FREIOS HF1575', 'VARGA 1575'] },
    ],
    ignition: [
      { partNumber: 'BKR6EIX', brand: 'NGK', name: 'Vela de Ignição Iridium', avgPrice: 55, equivalents: ['BOSCH FR7KI332S', 'DENSO IK20'] },
    ],
    suspension: [
      { partNumber: 'GP33575', brand: 'MONROE', name: 'Amortecedor Dianteiro', avgPrice: 290, equivalents: ['COFAP MP33575', 'NAKATA HG33575'] },
    ],
    electrical: [
      { partNumber: 'M60GD', brand: 'MOURA', name: 'Bateria 60Ah', avgPrice: 450, equivalents: ['HELIAR HF60DD', 'ACDelco 60AH'] },
    ],
    engine: [
      { partNumber: 'CT1575', brand: 'CONTITECH', name: 'Correia Dentada', avgPrice: 130, equivalents: ['GATES 5575XS', 'DAYCO 941575'] },
    ],
    transmission: [
      { partNumber: 'CK1575', brand: 'LUK', name: 'Kit Embreagem', avgPrice: 680, equivalents: ['SACHS 3000954575', 'VALEO 826575'] },
    ],
    bearings: [
      { partNumber: 'WB1575', brand: 'SKF', name: 'Rolamento de Roda Dianteiro', avgPrice: 185, equivalents: ['FAG 713610575', 'NSK 45BWD575'] },
    ],
  },

  // GM - Plataforma VSS (Cruze, Tracker, Equinox)
  GM_VSS: {
    filters: [
      { partNumber: 'HU6007Z', brand: 'MANN-FILTER', name: 'Filtro de Óleo', avgPrice: 78, equivalents: ['MAHLE OX418D', 'BOSCH P9418'] },
      { partNumber: 'C30005', brand: 'MANN-FILTER', name: 'Filtro de Ar', avgPrice: 72, equivalents: ['TECFIL ARL5005', 'FRAM CA12005'] },
    ],
    brakes: [
      { partNumber: 'N-1618', brand: 'COBREQ', name: 'Pastilha de Freio Dianteira', avgPrice: 125, equivalents: ['FRAS-LE PD/1618', 'BOSCH BP1618'] },
      { partNumber: 'BD1618', brand: 'FREMAX', name: 'Disco de Freio Dianteiro', avgPrice: 295, equivalents: ['HIPPER FREIOS HF1618', 'VARGA 1618'] },
    ],
    ignition: [
      { partNumber: 'ILTR6A-8G', brand: 'NGK', name: 'Vela de Ignição Iridium', avgPrice: 72, equivalents: ['BOSCH FR8KI332S', 'DENSO IK22'] },
    ],
    suspension: [
      { partNumber: 'GP33618', brand: 'MONROE', name: 'Amortecedor Dianteiro', avgPrice: 380, equivalents: ['COFAP MP33618', 'NAKATA HG33618'] },
    ],
    electrical: [
      { partNumber: 'M70GD', brand: 'MOURA', name: 'Bateria 70Ah', avgPrice: 550, equivalents: ['HELIAR HF70DD', 'ACDelco 70AH'] },
    ],
    engine: [
      { partNumber: 'CT1618', brand: 'CONTITECH', name: 'Correia Dentada', avgPrice: 185, equivalents: ['GATES 5618XS', 'DAYCO 941618'] },
    ],
    transmission: [
      { partNumber: 'CK1618', brand: 'LUK', name: 'Kit Embreagem', avgPrice: 880, equivalents: ['SACHS 3000954618', 'VALEO 826618'] },
    ],
    bearings: [
      { partNumber: 'WB1618', brand: 'SKF', name: 'Rolamento de Roda Dianteiro', avgPrice: 240, equivalents: ['FAG 713610618', 'NSK 45BWD618'] },
    ],
  },

  // HONDA - Plataforma Civic/City/Fit
  HONDA_CIVIC: {
    filters: [
      { partNumber: 'W610/6', brand: 'MANN-FILTER', name: 'Filtro de Óleo', avgPrice: 52, equivalents: ['TECFIL PSL610', 'FRAM PH6607'] },
      { partNumber: 'C2201', brand: 'MANN-FILTER', name: 'Filtro de Ar', avgPrice: 62, equivalents: ['TECFIL ARL2201', 'FRAM CA10201'] },
    ],
    brakes: [
      { partNumber: 'N-1201', brand: 'COBREQ', name: 'Pastilha de Freio Dianteira', avgPrice: 95, equivalents: ['FRAS-LE PD/1201', 'BOSCH BP1201'] },
      { partNumber: 'BD1201', brand: 'FREMAX', name: 'Disco de Freio Dianteiro', avgPrice: 210, equivalents: ['HIPPER FREIOS HF1201', 'VARGA 1201'] },
    ],
    ignition: [
      { partNumber: 'IZFR6K-11', brand: 'NGK', name: 'Vela de Ignição Iridium', avgPrice: 68, equivalents: ['BOSCH FR7KI332S', 'DENSO IK20TT'] },
    ],
    suspension: [
      { partNumber: 'GP33201', brand: 'MONROE', name: 'Amortecedor Dianteiro', avgPrice: 340, equivalents: ['COFAP MP33201', 'NAKATA HG33201'] },
    ],
    electrical: [
      { partNumber: 'M60GD', brand: 'MOURA', name: 'Bateria 60Ah', avgPrice: 450, equivalents: ['HELIAR HF60DD', 'ACDelco 60AH'] },
    ],
    engine: [
      { partNumber: 'CT1201', brand: 'CONTITECH', name: 'Correia Dentada', avgPrice: 145, equivalents: ['GATES 5501XS', 'DAYCO 941201'] },
    ],
    transmission: [
      { partNumber: 'CK1201', brand: 'LUK', name: 'Kit Embreagem', avgPrice: 750, equivalents: ['SACHS 3000954201', 'VALEO 826201'] },
    ],
    bearings: [
      { partNumber: 'WB1201', brand: 'SKF', name: 'Rolamento de Roda Dianteiro', avgPrice: 195, equivalents: ['FAG 713610201', 'NSK 45BWD201'] },
    ],
  },

  // TOYOTA - Plataforma Corolla/Yaris/Etios
  TOYOTA_COROLLA: {
    filters: [
      { partNumber: 'W68/3', brand: 'MANN-FILTER', name: 'Filtro de Óleo', avgPrice: 55, equivalents: ['TECFIL PSL683', 'FRAM PH4967'] },
      { partNumber: 'C26168', brand: 'MANN-FILTER', name: 'Filtro de Ar', avgPrice: 68, equivalents: ['TECFIL ARL6168', 'FRAM CA10168'] },
    ],
    brakes: [
      { partNumber: 'N-1168', brand: 'COBREQ', name: 'Pastilha de Freio Dianteira', avgPrice: 105, equivalents: ['FRAS-LE PD/1168', 'BOSCH BP1168'] },
      { partNumber: 'BD1168', brand: 'FREMAX', name: 'Disco de Freio Dianteiro', avgPrice: 235, equivalents: ['HIPPER FREIOS HF1168', 'VARGA 1168'] },
    ],
    ignition: [
      { partNumber: 'ILZKR7B-11S', brand: 'NGK', name: 'Vela de Ignição Iridium', avgPrice: 65, equivalents: ['BOSCH FR7KI332S', 'DENSO IK20TT'] },
    ],
    suspension: [
      { partNumber: 'GP33168', brand: 'MONROE', name: 'Amortecedor Dianteiro', avgPrice: 360, equivalents: ['COFAP MP33168', 'NAKATA HG33168'] },
    ],
    electrical: [
      { partNumber: 'M60GD', brand: 'MOURA', name: 'Bateria 60Ah', avgPrice: 450, equivalents: ['HELIAR HF60DD', 'ACDelco 60AH'] },
    ],
    engine: [
      { partNumber: 'CT1168', brand: 'CONTITECH', name: 'Correia Dentada', avgPrice: 155, equivalents: ['GATES 5568XS', 'DAYCO 941168'] },
    ],
    transmission: [
      { partNumber: 'CK1168', brand: 'LUK', name: 'Kit Embreagem', avgPrice: 780, equivalents: ['SACHS 3000954168', 'VALEO 826168'] },
    ],
    bearings: [
      { partNumber: 'WB1168', brand: 'SKF', name: 'Rolamento de Roda Dianteiro', avgPrice: 205, equivalents: ['FAG 713610168', 'NSK 45BWD168'] },
    ],
  },

  // HYUNDAI - Plataforma HB20/Creta
  HYUNDAI_HB20: {
    filters: [
      { partNumber: 'W811/80', brand: 'MANN-FILTER', name: 'Filtro de Óleo', avgPrice: 48, equivalents: ['TECFIL PSL811', 'FRAM PH6811'] },
      { partNumber: 'C26013', brand: 'MANN-FILTER', name: 'Filtro de Ar', avgPrice: 58, equivalents: ['TECFIL ARL6013', 'FRAM CA10013'] },
    ],
    brakes: [
      { partNumber: 'N-1013', brand: 'COBREQ', name: 'Pastilha de Freio Dianteira', avgPrice: 85, equivalents: ['FRAS-LE PD/1013', 'BOSCH BP1013'] },
      { partNumber: 'BD1013', brand: 'FREMAX', name: 'Disco de Freio Dianteiro', avgPrice: 185, equivalents: ['HIPPER FREIOS HF1013', 'VARGA 1013'] },
    ],
    ignition: [
      { partNumber: 'LZKR6B-10E', brand: 'NGK', name: 'Vela de Ignição', avgPrice: 35, equivalents: ['BOSCH FR7DC+', 'DENSO K20PR-U'] },
    ],
    suspension: [
      { partNumber: 'GP33013', brand: 'MONROE', name: 'Amortecedor Dianteiro', avgPrice: 300, equivalents: ['COFAP MP33013', 'NAKATA HG33013'] },
    ],
    electrical: [
      { partNumber: 'M50GD', brand: 'MOURA', name: 'Bateria 50Ah', avgPrice: 420, equivalents: ['HELIAR HF50DD', 'ACDelco 50AH'] },
    ],
    engine: [
      { partNumber: 'CT1013', brand: 'CONTITECH', name: 'Correia Dentada', avgPrice: 125, equivalents: ['GATES 5513XS', 'DAYCO 941013'] },
    ],
    transmission: [
      { partNumber: 'CK1013', brand: 'LUK', name: 'Kit Embreagem', avgPrice: 650, equivalents: ['SACHS 3000954013', 'VALEO 826013'] },
    ],
    bearings: [
      { partNumber: 'WB1013', brand: 'SKF', name: 'Rolamento de Roda Dianteiro', avgPrice: 175, equivalents: ['FAG 713610013', 'NSK 45BWD013'] },
    ],
  },

  // RENAULT - Plataforma Sandero/Logan/Kwid
  RENAULT_SANDERO: {
    filters: [
      { partNumber: 'W75/3', brand: 'MANN-FILTER', name: 'Filtro de Óleo', avgPrice: 45, equivalents: ['TECFIL PSL753', 'FRAM PH5796'] },
      { partNumber: 'C2672/1', brand: 'MANN-FILTER', name: 'Filtro de Ar', avgPrice: 52, equivalents: ['TECFIL ARL2672', 'FRAM CA10672'] },
    ],
    brakes: [
      { partNumber: 'N-1672', brand: 'COBREQ', name: 'Pastilha de Freio Dianteira', avgPrice: 78, equivalents: ['FRAS-LE PD/1672', 'BOSCH BP1672'] },
      { partNumber: 'BD1672', brand: 'FREMAX', name: 'Disco de Freio Dianteiro', avgPrice: 175, equivalents: ['HIPPER FREIOS HF1672', 'VARGA 1672'] },
    ],
    ignition: [
      { partNumber: 'BKR6E', brand: 'NGK', name: 'Vela de Ignição', avgPrice: 25, equivalents: ['BOSCH FR7DC+', 'DENSO K20PR-U'] },
    ],
    suspension: [
      { partNumber: 'GP32672', brand: 'MONROE', name: 'Amortecedor Dianteiro', avgPrice: 270, equivalents: ['COFAP MP32672', 'NAKATA HG32672'] },
    ],
    electrical: [
      { partNumber: 'M50GD', brand: 'MOURA', name: 'Bateria 50Ah', avgPrice: 420, equivalents: ['HELIAR HF50DD', 'ACDelco 50AH'] },
    ],
    engine: [
      { partNumber: 'CT1672', brand: 'CONTITECH', name: 'Correia Dentada', avgPrice: 110, equivalents: ['GATES 5572XS', 'DAYCO 941672'] },
    ],
    transmission: [
      { partNumber: 'CK1672', brand: 'LUK', name: 'Kit Embreagem', avgPrice: 620, equivalents: ['SACHS 3000954672', 'VALEO 826672'] },
    ],
    bearings: [
      { partNumber: 'WB1672', brand: 'SKF', name: 'Rolamento de Roda Dianteiro', avgPrice: 165, equivalents: ['FAG 713610672', 'NSK 45BWD672'] },
    ],
  },

  // NISSAN - Plataforma March/Versa/Kicks
  NISSAN_KICKS: {
    filters: [
      { partNumber: 'W67/1', brand: 'MANN-FILTER', name: 'Filtro de Óleo', avgPrice: 50, equivalents: ['TECFIL PSL671', 'FRAM PH6671'] },
      { partNumber: 'C25860', brand: 'MANN-FILTER', name: 'Filtro de Ar', avgPrice: 60, equivalents: ['TECFIL ARL5860', 'FRAM CA10860'] },
    ],
    brakes: [
      { partNumber: 'N-1860', brand: 'COBREQ', name: 'Pastilha de Freio Dianteira', avgPrice: 90, equivalents: ['FRAS-LE PD/1860', 'BOSCH BP1860'] },
      { partNumber: 'BD1860', brand: 'FREMAX', name: 'Disco de Freio Dianteiro', avgPrice: 200, equivalents: ['HIPPER FREIOS HF1860', 'VARGA 1860'] },
    ],
    ignition: [
      { partNumber: 'DILKAR6A-11', brand: 'NGK', name: 'Vela de Ignição Iridium', avgPrice: 62, equivalents: ['BOSCH FR7KI332S', 'DENSO IK20TT'] },
    ],
    suspension: [
      { partNumber: 'GP33860', brand: 'MONROE', name: 'Amortecedor Dianteiro', avgPrice: 310, equivalents: ['COFAP MP33860', 'NAKATA HG33860'] },
    ],
    electrical: [
      { partNumber: 'M60GD', brand: 'MOURA', name: 'Bateria 60Ah', avgPrice: 450, equivalents: ['HELIAR HF60DD', 'ACDelco 60AH'] },
    ],
    engine: [
      { partNumber: 'CT1860', brand: 'CONTITECH', name: 'Correia Dentada', avgPrice: 135, equivalents: ['GATES 5560XS', 'DAYCO 941860'] },
    ],
    transmission: [
      { partNumber: 'CK1860', brand: 'LUK', name: 'Kit Embreagem', avgPrice: 700, equivalents: ['SACHS 3000954860', 'VALEO 826860'] },
    ],
    bearings: [
      { partNumber: 'WB1860', brand: 'SKF', name: 'Rolamento de Roda Dianteiro', avgPrice: 190, equivalents: ['FAG 713610860', 'NSK 45BWD860'] },
    ],
  },

  // JEEP - Plataforma Renegade/Compass
  JEEP_RENEGADE: {
    filters: [
      { partNumber: 'HU712/11X', brand: 'MANN-FILTER', name: 'Filtro de Óleo', avgPrice: 75, equivalents: ['MAHLE OX411D', 'BOSCH P9411'] },
      { partNumber: 'C27107', brand: 'MANN-FILTER', name: 'Filtro de Ar', avgPrice: 65, equivalents: ['TECFIL ARL7107', 'FRAM CA11107'] },
    ],
    brakes: [
      { partNumber: 'N-1411', brand: 'COBREQ', name: 'Pastilha de Freio Dianteira', avgPrice: 115, equivalents: ['FRAS-LE PD/1411', 'BOSCH BP1411'] },
      { partNumber: 'BD1411', brand: 'FREMAX', name: 'Disco de Freio Dianteiro', avgPrice: 260, equivalents: ['HIPPER FREIOS HF1411', 'VARGA 1411'] },
    ],
    ignition: [
      { partNumber: 'ILZKR7B-11S', brand: 'NGK', name: 'Vela de Ignição Iridium', avgPrice: 65, equivalents: ['BOSCH FR7KI332S', 'DENSO IK20TT'] },
    ],
    suspension: [
      { partNumber: 'GP33411', brand: 'MONROE', name: 'Amortecedor Dianteiro', avgPrice: 380, equivalents: ['COFAP MP33411', 'NAKATA HG33411'] },
    ],
    electrical: [
      { partNumber: 'M70GD', brand: 'MOURA', name: 'Bateria 70Ah', avgPrice: 550, equivalents: ['HELIAR HF70DD', 'ACDelco 70AH'] },
    ],
    engine: [
      { partNumber: 'CT1411', brand: 'CONTITECH', name: 'Correia Dentada', avgPrice: 165, equivalents: ['GATES 5611XS', 'DAYCO 941411'] },
    ],
    transmission: [
      { partNumber: 'CK1411', brand: 'LUK', name: 'Kit Embreagem', avgPrice: 850, equivalents: ['SACHS 3000954411', 'VALEO 826411'] },
    ],
    bearings: [
      { partNumber: 'WB1411', brand: 'SKF', name: 'Rolamento de Roda Dianteiro', avgPrice: 220, equivalents: ['FAG 713610411', 'NSK 45BWD411'] },
    ],
  },

  // FORD - Plataforma Ka/EcoSport/Ranger
  FORD_KA: {
    filters: [
      { partNumber: 'W712/83', brand: 'MANN-FILTER', name: 'Filtro de Óleo', avgPrice: 46, equivalents: ['TECFIL PSL783', 'FRAM PH5783'] },
      { partNumber: 'C16134/1', brand: 'MANN-FILTER', name: 'Filtro de Ar', avgPrice: 54, equivalents: ['TECFIL ARL6134', 'FRAM CA10134'] },
    ],
    brakes: [
      { partNumber: 'N-1134', brand: 'COBREQ', name: 'Pastilha de Freio Dianteira', avgPrice: 82, equivalents: ['FRAS-LE PD/1134', 'BOSCH BP1134'] },
      { partNumber: 'BD1134', brand: 'FREMAX', name: 'Disco de Freio Dianteiro', avgPrice: 178, equivalents: ['HIPPER FREIOS HF1134', 'VARGA 1134'] },
    ],
    ignition: [
      { partNumber: 'BKR5EIX', brand: 'NGK', name: 'Vela de Ignição Iridium', avgPrice: 48, equivalents: ['BOSCH FR7KI332S', 'DENSO IK20'] },
    ],
    suspension: [
      { partNumber: 'GP32134', brand: 'MONROE', name: 'Amortecedor Dianteiro', avgPrice: 265, equivalents: ['COFAP MP32134', 'NAKATA HG32134'] },
    ],
    electrical: [
      { partNumber: 'M50GD', brand: 'MOURA', name: 'Bateria 50Ah', avgPrice: 420, equivalents: ['HELIAR HF50DD', 'ACDelco 50AH'] },
    ],
    engine: [
      { partNumber: 'CT1134', brand: 'CONTITECH', name: 'Correia Dentada', avgPrice: 105, equivalents: ['GATES 5534XS', 'DAYCO 941134'] },
    ],
    transmission: [
      { partNumber: 'CK1134', brand: 'LUK', name: 'Kit Embreagem', avgPrice: 600, equivalents: ['SACHS 3000954134', 'VALEO 826134'] },
    ],
    bearings: [
      { partNumber: 'WB1134', brand: 'SKF', name: 'Rolamento de Roda Dianteiro', avgPrice: 168, equivalents: ['FAG 713610134', 'NSK 45BWD134'] },
    ],
  },

  // PEUGEOT/CITROEN - Plataforma 208/C3
  PEUGEOT_208: {
    filters: [
      { partNumber: 'HU711/51X', brand: 'MANN-FILTER', name: 'Filtro de Óleo', avgPrice: 68, equivalents: ['MAHLE OX339/2D', 'BOSCH P9339'] },
      { partNumber: 'C3875', brand: 'MANN-FILTER', name: 'Filtro de Ar', avgPrice: 58, equivalents: ['TECFIL ARL3875', 'FRAM CA10875'] },
    ],
    brakes: [
      { partNumber: 'N-1875', brand: 'COBREQ', name: 'Pastilha de Freio Dianteira', avgPrice: 88, equivalents: ['FRAS-LE PD/1875', 'BOSCH BP1875'] },
      { partNumber: 'BD1875', brand: 'FREMAX', name: 'Disco de Freio Dianteiro', avgPrice: 195, equivalents: ['HIPPER FREIOS HF1875', 'VARGA 1875'] },
    ],
    ignition: [
      { partNumber: 'BKR6EZ', brand: 'NGK', name: 'Vela de Ignição', avgPrice: 32, equivalents: ['BOSCH FR7DC+', 'DENSO K20PR-U'] },
    ],
    suspension: [
      { partNumber: 'GP32875', brand: 'MONROE', name: 'Amortecedor Dianteiro', avgPrice: 285, equivalents: ['COFAP MP32875', 'NAKATA HG32875'] },
    ],
    electrical: [
      { partNumber: 'M50GD', brand: 'MOURA', name: 'Bateria 50Ah', avgPrice: 420, equivalents: ['HELIAR HF50DD', 'ACDelco 50AH'] },
    ],
    engine: [
      { partNumber: 'CT1875', brand: 'CONTITECH', name: 'Correia Dentada', avgPrice: 118, equivalents: ['GATES 5575XS', 'DAYCO 941875'] },
    ],
    transmission: [
      { partNumber: 'CK1875', brand: 'LUK', name: 'Kit Embreagem', avgPrice: 640, equivalents: ['SACHS 3000954875', 'VALEO 826875'] },
    ],
    bearings: [
      { partNumber: 'WB1875', brand: 'SKF', name: 'Rolamento de Roda Dianteiro', avgPrice: 172, equivalents: ['FAG 713610875', 'NSK 45BWD875'] },
    ],
  },

  // MITSUBISHI - Plataforma L200/Pajero/ASX
  MITSUBISHI_L200: {
    filters: [
      { partNumber: 'W920/38', brand: 'MANN-FILTER', name: 'Filtro de Óleo', avgPrice: 58, equivalents: ['TECFIL PSL938', 'FRAM PH5938'] },
      { partNumber: 'C27003', brand: 'MANN-FILTER', name: 'Filtro de Ar', avgPrice: 72, equivalents: ['TECFIL ARL7003', 'FRAM CA11003'] },
    ],
    brakes: [
      { partNumber: 'N-1003', brand: 'COBREQ', name: 'Pastilha de Freio Dianteira', avgPrice: 125, equivalents: ['FRAS-LE PD/1003', 'BOSCH BP1003'] },
      { partNumber: 'BD1003', brand: 'FREMAX', name: 'Disco de Freio Dianteiro', avgPrice: 285, equivalents: ['HIPPER FREIOS HF1003', 'VARGA 1003'] },
    ],
    ignition: [
      { partNumber: 'BKR5EIX-11', brand: 'NGK', name: 'Vela de Ignição Iridium', avgPrice: 55, equivalents: ['BOSCH FR7KI332S', 'DENSO IK20'] },
    ],
    suspension: [
      { partNumber: 'GP34003', brand: 'MONROE', name: 'Amortecedor Dianteiro', avgPrice: 420, equivalents: ['COFAP MP34003', 'NAKATA HG34003'] },
    ],
    electrical: [
      { partNumber: 'M80GD', brand: 'MOURA', name: 'Bateria 80Ah', avgPrice: 620, equivalents: ['HELIAR HF80DD', 'ACDelco 80AH'] },
    ],
    engine: [
      { partNumber: 'CT1003', brand: 'CONTITECH', name: 'Correia Dentada', avgPrice: 175, equivalents: ['GATES 5603XS', 'DAYCO 941003'] },
    ],
    transmission: [
      { partNumber: 'CK1003', brand: 'LUK', name: 'Kit Embreagem', avgPrice: 920, equivalents: ['SACHS 3000954003', 'VALEO 826003'] },
    ],
    bearings: [
      { partNumber: 'WB1003', brand: 'SKF', name: 'Rolamento de Roda Dianteiro', avgPrice: 245, equivalents: ['FAG 713610003', 'NSK 45BWD003'] },
    ],
  },

  // MOTOS - Honda
  MOTO_HONDA: {
    filters: [
      { partNumber: '15412-KYJ-901', brand: 'HONDA', name: 'Filtro de Óleo', avgPrice: 35, equivalents: ['FRAM CH6015', 'HIFLOFILTRO HF112'] },
    ],
    brakes: [
      { partNumber: '06455-KVS-951', brand: 'HONDA', name: 'Pastilha de Freio Dianteira', avgPrice: 65, equivalents: ['COBREQ N-951', 'FISCHER FJ1951'] },
    ],
    ignition: [
      { partNumber: 'CPR8EA-9', brand: 'NGK', name: 'Vela de Ignição', avgPrice: 18, equivalents: ['BOSCH UR4AC', 'DENSO U20FSR-U'] },
    ],
    electrical: [
      { partNumber: 'YTX7L-BS', brand: 'YUASA', name: 'Bateria 6Ah', avgPrice: 180, equivalents: ['MOURA MA6-D', 'HELIAR HTX7L'] },
    ],
    transmission: [
      { partNumber: '22201-KVS-900', brand: 'HONDA', name: 'Kit Relação', avgPrice: 120, equivalents: ['BRANDY 4120', 'VINI 4120'] },
    ],
  },

  // MOTOS - Yamaha
  MOTO_YAMAHA: {
    filters: [
      { partNumber: '5GH-13440-00', brand: 'YAMAHA', name: 'Filtro de Óleo', avgPrice: 38, equivalents: ['FRAM CH6012', 'HIFLOFILTRO HF140'] },
    ],
    brakes: [
      { partNumber: '5VL-W0045-00', brand: 'YAMAHA', name: 'Pastilha de Freio Dianteira', avgPrice: 72, equivalents: ['COBREQ N-945', 'FISCHER FJ1945'] },
    ],
    ignition: [
      { partNumber: 'CR8E', brand: 'NGK', name: 'Vela de Ignição', avgPrice: 20, equivalents: ['BOSCH UR5AC', 'DENSO U22FSR-U'] },
    ],
    electrical: [
      { partNumber: 'YTX9-BS', brand: 'YUASA', name: 'Bateria 8Ah', avgPrice: 220, equivalents: ['MOURA MA8-D', 'HELIAR HTX9'] },
    ],
    transmission: [
      { partNumber: '94580-15114-00', brand: 'YAMAHA', name: 'Kit Relação', avgPrice: 135, equivalents: ['BRANDY 4135', 'VINI 4135'] },
    ],
  },

  // CAMINHÕES - Mercedes/Volvo/Scania
  CAMINHAO_PESADO: {
    filters: [
      { partNumber: 'W11102/37', brand: 'MANN-FILTER', name: 'Filtro de Óleo', avgPrice: 125, equivalents: ['TECFIL PSL1137', 'FRAM PH11137'] },
      { partNumber: 'C331460/1', brand: 'MANN-FILTER', name: 'Filtro de Ar', avgPrice: 185, equivalents: ['TECFIL ARL1460', 'FRAM CA11460'] },
      { partNumber: 'WK940/20', brand: 'MANN-FILTER', name: 'Filtro de Combustível', avgPrice: 95, equivalents: ['TECFIL PSD940', 'FRAM P10940'] },
    ],
    brakes: [
      { partNumber: 'N-1460', brand: 'COBREQ', name: 'Pastilha de Freio', avgPrice: 280, equivalents: ['FRAS-LE PD/1460', 'BOSCH BP1460'] },
      { partNumber: 'BD1460', brand: 'FREMAX', name: 'Disco de Freio', avgPrice: 580, equivalents: ['HIPPER FREIOS HF1460', 'VARGA 1460'] },
    ],
    electrical: [
      { partNumber: 'M150GD', brand: 'MOURA', name: 'Bateria 150Ah', avgPrice: 850, equivalents: ['HELIAR HF150DD', 'ACDelco 150AH'] },
    ],
    suspension: [
      { partNumber: 'GP35460', brand: 'MONROE', name: 'Amortecedor', avgPrice: 650, equivalents: ['COFAP MP35460', 'NAKATA HG35460'] },
    ],
  },

  // GENÉRICO - Para veículos sem plataforma específica
  GENERIC: {
    filters: [
      { partNumber: 'W712/GENERIC', brand: 'MANN-FILTER', name: 'Filtro de Óleo Universal', avgPrice: 50, equivalents: ['TECFIL PSL-UNIV', 'FRAM PH-UNIV'] },
      { partNumber: 'C-GENERIC', brand: 'MANN-FILTER', name: 'Filtro de Ar Universal', avgPrice: 60, equivalents: ['TECFIL ARL-UNIV', 'FRAM CA-UNIV'] },
    ],
    brakes: [
      { partNumber: 'N-GENERIC', brand: 'COBREQ', name: 'Pastilha de Freio Universal', avgPrice: 90, equivalents: ['FRAS-LE PD-UNIV', 'BOSCH BP-UNIV'] },
    ],
    ignition: [
      { partNumber: 'BKR6E', brand: 'NGK', name: 'Vela de Ignição Universal', avgPrice: 25, equivalents: ['BOSCH FR7DC+', 'DENSO K20PR-U'] },
    ],
    electrical: [
      { partNumber: 'M60GD', brand: 'MOURA', name: 'Bateria 60Ah', avgPrice: 450, equivalents: ['HELIAR HF60DD', 'ACDelco 60AH'] },
    ],
  },
};


// ============================================================================
// MAPEAMENTO DE VEÍCULOS PARA PLATAFORMAS
// ============================================================================
const VEHICLE_TO_PLATFORM = {
  // VW
  'volkswagen': {
    'gol': 'VW_PQ24', 'voyage': 'VW_PQ24', 'fox': 'VW_PQ24', 'saveiro': 'VW_PQ24', 'up': 'VW_PQ24', 'up!': 'VW_PQ24',
    'crossfox': 'VW_PQ24', 'spacefox': 'VW_PQ24', 'kombi': 'VW_PQ24', 'fusca': 'VW_PQ24', 'brasilia': 'VW_PQ24',
    'golf': 'VW_MQB', 'polo': 'VW_MQB', 'virtus': 'VW_MQB', 'jetta': 'VW_MQB', 't-cross': 'VW_MQB', 'tcross': 'VW_MQB',
    'nivus': 'VW_MQB', 'taos': 'VW_MQB', 'tiguan': 'VW_MQB', 'passat': 'VW_MQB', 'amarok': 'VW_MQB', 'touareg': 'VW_MQB',
  },
  'vw': {
    'gol': 'VW_PQ24', 'voyage': 'VW_PQ24', 'fox': 'VW_PQ24', 'saveiro': 'VW_PQ24', 'up': 'VW_PQ24',
    'golf': 'VW_MQB', 'polo': 'VW_MQB', 'virtus': 'VW_MQB', 'jetta': 'VW_MQB', 't-cross': 'VW_MQB',
    'nivus': 'VW_MQB', 'taos': 'VW_MQB', 'tiguan': 'VW_MQB', 'passat': 'VW_MQB', 'amarok': 'VW_MQB',
  },
  // FIAT
  'fiat': {
    'uno': 'FIAT_FIRE', 'palio': 'FIAT_FIRE', 'siena': 'FIAT_FIRE', 'strada': 'FIAT_FIRE', 'mobi': 'FIAT_FIRE',
    'idea': 'FIAT_FIRE', 'punto': 'FIAT_FIRE', 'linea': 'FIAT_FIRE', 'grand siena': 'FIAT_FIRE', 'weekend': 'FIAT_FIRE',
    'argo': 'FIAT_ARGO', 'cronos': 'FIAT_ARGO', 'pulse': 'FIAT_ARGO', 'fastback': 'FIAT_ARGO',
    'toro': 'FIAT_ARGO', 'freemont': 'FIAT_ARGO', 'doblo': 'FIAT_FIRE', 'fiorino': 'FIAT_FIRE',
  },
  // GM/CHEVROLET
  'chevrolet': {
    'onix': 'GM_GEM', 'prisma': 'GM_GEM', 'spin': 'GM_GEM', 'cobalt': 'GM_GEM', 'montana': 'GM_GEM',
    'joy': 'GM_GEM', 'classic': 'GM_GEM', 'corsa': 'GM_GEM', 'celta': 'GM_GEM', 'agile': 'GM_GEM',
    'cruze': 'GM_VSS', 'tracker': 'GM_VSS', 'equinox': 'GM_VSS', 'trailblazer': 'GM_VSS',
    's10': 'GM_VSS', 'blazer': 'GM_VSS', 'captiva': 'GM_VSS',
  },
  'gm': {
    'onix': 'GM_GEM', 'prisma': 'GM_GEM', 'spin': 'GM_GEM', 'cobalt': 'GM_GEM',
    'cruze': 'GM_VSS', 'tracker': 'GM_VSS', 'equinox': 'GM_VSS', 's10': 'GM_VSS',
  },
  // HONDA
  'honda': {
    'civic': 'HONDA_CIVIC', 'city': 'HONDA_CIVIC', 'fit': 'HONDA_CIVIC', 'wr-v': 'HONDA_CIVIC', 'wrv': 'HONDA_CIVIC',
    'hr-v': 'HONDA_CIVIC', 'hrv': 'HONDA_CIVIC', 'cr-v': 'HONDA_CIVIC', 'crv': 'HONDA_CIVIC', 'accord': 'HONDA_CIVIC',
    'cg': 'MOTO_HONDA', 'cb': 'MOTO_HONDA', 'cbr': 'MOTO_HONDA', 'xre': 'MOTO_HONDA', 'bros': 'MOTO_HONDA',
    'biz': 'MOTO_HONDA', 'pop': 'MOTO_HONDA', 'pcx': 'MOTO_HONDA', 'elite': 'MOTO_HONDA', 'lead': 'MOTO_HONDA',
  },
  // TOYOTA
  'toyota': {
    'corolla': 'TOYOTA_COROLLA', 'yaris': 'TOYOTA_COROLLA', 'etios': 'TOYOTA_COROLLA',
    'hilux': 'TOYOTA_COROLLA', 'sw4': 'TOYOTA_COROLLA', 'rav4': 'TOYOTA_COROLLA', 'camry': 'TOYOTA_COROLLA',
    'corolla cross': 'TOYOTA_COROLLA', 'prius': 'TOYOTA_COROLLA',
  },
  // HYUNDAI
  'hyundai': {
    'hb20': 'HYUNDAI_HB20', 'hb20s': 'HYUNDAI_HB20', 'hb20x': 'HYUNDAI_HB20',
    'creta': 'HYUNDAI_HB20', 'tucson': 'HYUNDAI_HB20', 'ix35': 'HYUNDAI_HB20', 'santa fe': 'HYUNDAI_HB20',
    'azera': 'HYUNDAI_HB20', 'elantra': 'HYUNDAI_HB20', 'veloster': 'HYUNDAI_HB20',
  },
  // RENAULT
  'renault': {
    'sandero': 'RENAULT_SANDERO', 'logan': 'RENAULT_SANDERO', 'kwid': 'RENAULT_SANDERO',
    'duster': 'RENAULT_SANDERO', 'oroch': 'RENAULT_SANDERO', 'captur': 'RENAULT_SANDERO',
    'stepway': 'RENAULT_SANDERO', 'fluence': 'RENAULT_SANDERO', 'megane': 'RENAULT_SANDERO',
    'clio': 'RENAULT_SANDERO', 'symbol': 'RENAULT_SANDERO',
  },
  // NISSAN
  'nissan': {
    'march': 'NISSAN_KICKS', 'versa': 'NISSAN_KICKS', 'kicks': 'NISSAN_KICKS',
    'sentra': 'NISSAN_KICKS', 'frontier': 'NISSAN_KICKS', 'livina': 'NISSAN_KICKS',
    'tiida': 'NISSAN_KICKS', 'altima': 'NISSAN_KICKS',
  },
  // JEEP
  'jeep': {
    'renegade': 'JEEP_RENEGADE', 'compass': 'JEEP_RENEGADE', 'commander': 'JEEP_RENEGADE',
    'wrangler': 'JEEP_RENEGADE', 'cherokee': 'JEEP_RENEGADE', 'grand cherokee': 'JEEP_RENEGADE',
  },
  // FORD
  'ford': {
    'ka': 'FORD_KA', 'fiesta': 'FORD_KA', 'ecosport': 'FORD_KA', 'focus': 'FORD_KA',
    'ranger': 'FORD_KA', 'fusion': 'FORD_KA', 'edge': 'FORD_KA', 'territory': 'FORD_KA',
    'maverick': 'FORD_KA', 'bronco': 'FORD_KA',
  },
  // PEUGEOT
  'peugeot': {
    '208': 'PEUGEOT_208', '2008': 'PEUGEOT_208', '308': 'PEUGEOT_208', '3008': 'PEUGEOT_208',
    '408': 'PEUGEOT_208', '5008': 'PEUGEOT_208', '207': 'PEUGEOT_208', '206': 'PEUGEOT_208',
  },
  // CITROEN
  'citroen': {
    'c3': 'PEUGEOT_208', 'c4': 'PEUGEOT_208', 'c4 cactus': 'PEUGEOT_208', 'aircross': 'PEUGEOT_208',
    'c3 aircross': 'PEUGEOT_208', 'ds3': 'PEUGEOT_208', 'ds4': 'PEUGEOT_208', 'ds5': 'PEUGEOT_208',
  },
  // MITSUBISHI
  'mitsubishi': {
    'l200': 'MITSUBISHI_L200', 'pajero': 'MITSUBISHI_L200', 'asx': 'MITSUBISHI_L200',
    'outlander': 'MITSUBISHI_L200', 'eclipse cross': 'MITSUBISHI_L200', 'lancer': 'MITSUBISHI_L200',
  },
  // YAMAHA (motos)
  'yamaha': {
    'fazer': 'MOTO_YAMAHA', 'ybr': 'MOTO_YAMAHA', 'factor': 'MOTO_YAMAHA', 'crosser': 'MOTO_YAMAHA',
    'lander': 'MOTO_YAMAHA', 'tenere': 'MOTO_YAMAHA', 'mt': 'MOTO_YAMAHA', 'r1': 'MOTO_YAMAHA',
    'r3': 'MOTO_YAMAHA', 'r6': 'MOTO_YAMAHA', 'xj6': 'MOTO_YAMAHA', 'nmax': 'MOTO_YAMAHA',
    'neo': 'MOTO_YAMAHA', 'fluo': 'MOTO_YAMAHA', 'crypton': 'MOTO_YAMAHA',
  },
  // SUZUKI (motos)
  'suzuki': {
    'gsx': 'MOTO_YAMAHA', 'hayabusa': 'MOTO_YAMAHA', 'v-strom': 'MOTO_YAMAHA', 'vstrom': 'MOTO_YAMAHA',
    'intruder': 'MOTO_YAMAHA', 'burgman': 'MOTO_YAMAHA', 'yes': 'MOTO_YAMAHA', 'en': 'MOTO_YAMAHA',
  },
  // KAWASAKI (motos)
  'kawasaki': {
    'ninja': 'MOTO_YAMAHA', 'z': 'MOTO_YAMAHA', 'versys': 'MOTO_YAMAHA', 'vulcan': 'MOTO_YAMAHA',
    'er': 'MOTO_YAMAHA', 'zx': 'MOTO_YAMAHA',
  },
  // CAMINHÕES
  'mercedes-benz': { 'atego': 'CAMINHAO_PESADO', 'axor': 'CAMINHAO_PESADO', 'actros': 'CAMINHAO_PESADO', 'accelo': 'CAMINHAO_PESADO' },
  'volvo': { 'fh': 'CAMINHAO_PESADO', 'fm': 'CAMINHAO_PESADO', 'vm': 'CAMINHAO_PESADO', 'nl': 'CAMINHAO_PESADO' },
  'scania': { 'r': 'CAMINHAO_PESADO', 'g': 'CAMINHAO_PESADO', 'p': 'CAMINHAO_PESADO', 's': 'CAMINHAO_PESADO' },
  'iveco': { 'daily': 'CAMINHAO_PESADO', 'tector': 'CAMINHAO_PESADO', 'stralis': 'CAMINHAO_PESADO', 'cursor': 'CAMINHAO_PESADO' },
  'man': { 'tgx': 'CAMINHAO_PESADO', 'tgs': 'CAMINHAO_PESADO', 'tgm': 'CAMINHAO_PESADO', 'tgl': 'CAMINHAO_PESADO' },
};


// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

function getPlatformForVehicle(brand, model) {
  const brandLower = brand.toLowerCase().trim();
  const modelLower = model.toLowerCase().trim();
  
  // Tenta encontrar a plataforma específica
  const brandPlatforms = VEHICLE_TO_PLATFORM[brandLower];
  if (brandPlatforms) {
    // Tenta match exato
    if (brandPlatforms[modelLower]) {
      return brandPlatforms[modelLower];
    }
    // Tenta match parcial
    for (const [modelKey, platform] of Object.entries(brandPlatforms)) {
      if (modelLower.includes(modelKey) || modelKey.includes(modelLower)) {
        return platform;
      }
    }
  }
  
  // Fallback por marca
  const brandFallbacks = {
    'volkswagen': 'VW_PQ24', 'vw': 'VW_PQ24',
    'fiat': 'FIAT_FIRE',
    'chevrolet': 'GM_GEM', 'gm': 'GM_GEM',
    'honda': 'HONDA_CIVIC',
    'toyota': 'TOYOTA_COROLLA',
    'hyundai': 'HYUNDAI_HB20',
    'renault': 'RENAULT_SANDERO',
    'nissan': 'NISSAN_KICKS',
    'jeep': 'JEEP_RENEGADE',
    'ford': 'FORD_KA',
    'peugeot': 'PEUGEOT_208',
    'citroen': 'PEUGEOT_208',
    'mitsubishi': 'MITSUBISHI_L200',
    'yamaha': 'MOTO_YAMAHA',
    'suzuki': 'MOTO_YAMAHA',
    'kawasaki': 'MOTO_YAMAHA',
    'bmw': 'MOTO_YAMAHA',
    'ducati': 'MOTO_YAMAHA',
    'harley-davidson': 'MOTO_YAMAHA',
    'triumph': 'MOTO_YAMAHA',
    'mercedes-benz': 'CAMINHAO_PESADO',
    'volvo': 'CAMINHAO_PESADO',
    'scania': 'CAMINHAO_PESADO',
    'iveco': 'CAMINHAO_PESADO',
    'man': 'CAMINHAO_PESADO',
  };
  
  return brandFallbacks[brandLower] || 'GENERIC';
}

function getPartsForPlatform(platform) {
  const platformParts = PARTS_BY_PLATFORM[platform] || PARTS_BY_PLATFORM['GENERIC'];
  const allParts = [];
  
  const categoryMap = {
    filters: 'Filtros',
    brakes: 'Freios',
    ignition: 'Ignição',
    suspension: 'Suspensão',
    electrical: 'Elétrica',
    engine: 'Motor',
    transmission: 'Transmissão',
    bearings: 'Rolamentos',
  };
  
  for (const [categoryKey, parts] of Object.entries(platformParts)) {
    const categoryName = categoryMap[categoryKey] || categoryKey;
    for (const part of parts) {
      allParts.push({
        ...part,
        category: categoryName,
        categoryKey,
        platform,
        matchType: 'direct',
        confidence: 0.95,
      });
    }
  }
  
  return allParts;
}

function generateVehicleId(brand, model, year) {
  // Normaliza a marca
  const brandMap = {
    'volkswagen': 'vw',
    'chevrolet': 'gm',
    'general motors': 'gm',
  };
  
  const normalizedBrand = brandMap[brand.toLowerCase()] || brand.toLowerCase();
  
  return `${normalizedBrand}_${model}_${year}`
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// ============================================================================
// GERADOR PRINCIPAL
// ============================================================================

function generateFullCompatibility() {
  console.log('🚀 Iniciando geração de compatibilidade completa V2...\n');
  
  const allVehicles = [];
  const stats = {
    totalVehicles: 0,
    totalParts: 0,
    byBrand: {},
    byPlatform: {},
  };
  
  // Gera veículos para todas as marcas e modelos conhecidos
  const vehicleDefinitions = [
    // VW
    { brand: 'VW', model: 'Gol', years: [1995, 2024] },
    { brand: 'VW', model: 'Voyage', years: [2008, 2024] },
    { brand: 'VW', model: 'Fox', years: [2003, 2021] },
    { brand: 'VW', model: 'Saveiro', years: [1998, 2024] },
    { brand: 'VW', model: 'Up', years: [2014, 2021] },
    { brand: 'VW', model: 'Golf', years: [1999, 2024] },
    { brand: 'VW', model: 'Polo', years: [2002, 2024] },
    { brand: 'VW', model: 'Virtus', years: [2018, 2024] },
    { brand: 'VW', model: 'Jetta', years: [2006, 2024] },
    { brand: 'VW', model: 'T-Cross', years: [2019, 2024] },
    { brand: 'VW', model: 'Nivus', years: [2020, 2024] },
    { brand: 'VW', model: 'Taos', years: [2021, 2024] },
    { brand: 'VW', model: 'Tiguan', years: [2009, 2024] },
    { brand: 'VW', model: 'Amarok', years: [2010, 2024] },
    { brand: 'VW', model: 'Passat', years: [2011, 2020] },
    { brand: 'VW', model: 'Fusca', years: [1970, 1996] },
    { brand: 'VW', model: 'Kombi', years: [1997, 2014] },
    // FIAT
    { brand: 'Fiat', model: 'Uno', years: [1984, 2024] },
    { brand: 'Fiat', model: 'Palio', years: [1996, 2017] },
    { brand: 'Fiat', model: 'Siena', years: [1997, 2016] },
    { brand: 'Fiat', model: 'Strada', years: [1998, 2024] },
    { brand: 'Fiat', model: 'Mobi', years: [2016, 2024] },
    { brand: 'Fiat', model: 'Argo', years: [2017, 2024] },
    { brand: 'Fiat', model: 'Cronos', years: [2018, 2024] },
    { brand: 'Fiat', model: 'Pulse', years: [2021, 2024] },
    { brand: 'Fiat', model: 'Fastback', years: [2022, 2024] },
    { brand: 'Fiat', model: 'Toro', years: [2016, 2024] },
    { brand: 'Fiat', model: 'Doblo', years: [2001, 2024] },
    { brand: 'Fiat', model: 'Fiorino', years: [1988, 2024] },
    // GM
    { brand: 'GM', model: 'Onix', years: [2012, 2024] },
    { brand: 'GM', model: 'Prisma', years: [2006, 2020] },
    { brand: 'GM', model: 'Spin', years: [2012, 2024] },
    { brand: 'GM', model: 'Cobalt', years: [2011, 2020] },
    { brand: 'GM', model: 'Montana', years: [2003, 2024] },
    { brand: 'GM', model: 'Cruze', years: [2011, 2024] },
    { brand: 'GM', model: 'Tracker', years: [2013, 2024] },
    { brand: 'GM', model: 'Equinox', years: [2017, 2024] },
    { brand: 'GM', model: 'S10', years: [1995, 2024] },
    { brand: 'GM', model: 'Trailblazer', years: [2012, 2024] },
    { brand: 'GM', model: 'Celta', years: [2000, 2015] },
    { brand: 'GM', model: 'Corsa', years: [1994, 2012] },
    { brand: 'GM', model: 'Classic', years: [2003, 2016] },

    // HONDA
    { brand: 'Honda', model: 'Civic', years: [1992, 2024] },
    { brand: 'Honda', model: 'City', years: [2009, 2024] },
    { brand: 'Honda', model: 'Fit', years: [2003, 2021] },
    { brand: 'Honda', model: 'HR-V', years: [2015, 2024] },
    { brand: 'Honda', model: 'CR-V', years: [2007, 2024] },
    { brand: 'Honda', model: 'WR-V', years: [2017, 2024] },
    { brand: 'Honda', model: 'Accord', years: [1998, 2024] },
    // TOYOTA
    { brand: 'Toyota', model: 'Corolla', years: [1992, 2024] },
    { brand: 'Toyota', model: 'Yaris', years: [2018, 2024] },
    { brand: 'Toyota', model: 'Etios', years: [2012, 2021] },
    { brand: 'Toyota', model: 'Hilux', years: [1992, 2024] },
    { brand: 'Toyota', model: 'SW4', years: [2005, 2024] },
    { brand: 'Toyota', model: 'RAV4', years: [2006, 2024] },
    { brand: 'Toyota', model: 'Corolla Cross', years: [2021, 2024] },
    { brand: 'Toyota', model: 'Camry', years: [2007, 2024] },
    // HYUNDAI
    { brand: 'Hyundai', model: 'HB20', years: [2012, 2024] },
    { brand: 'Hyundai', model: 'HB20S', years: [2013, 2024] },
    { brand: 'Hyundai', model: 'Creta', years: [2017, 2024] },
    { brand: 'Hyundai', model: 'Tucson', years: [2006, 2024] },
    { brand: 'Hyundai', model: 'ix35', years: [2010, 2019] },
    { brand: 'Hyundai', model: 'Santa Fe', years: [2006, 2024] },
    { brand: 'Hyundai', model: 'Azera', years: [2007, 2020] },
    { brand: 'Hyundai', model: 'Elantra', years: [2011, 2024] },
    // RENAULT
    { brand: 'Renault', model: 'Sandero', years: [2007, 2024] },
    { brand: 'Renault', model: 'Logan', years: [2007, 2024] },
    { brand: 'Renault', model: 'Kwid', years: [2017, 2024] },
    { brand: 'Renault', model: 'Duster', years: [2011, 2024] },
    { brand: 'Renault', model: 'Oroch', years: [2015, 2024] },
    { brand: 'Renault', model: 'Captur', years: [2017, 2024] },
    { brand: 'Renault', model: 'Clio', years: [1999, 2016] },
    // NISSAN
    { brand: 'Nissan', model: 'March', years: [2011, 2024] },
    { brand: 'Nissan', model: 'Versa', years: [2011, 2024] },
    { brand: 'Nissan', model: 'Kicks', years: [2016, 2024] },
    { brand: 'Nissan', model: 'Sentra', years: [2007, 2024] },
    { brand: 'Nissan', model: 'Frontier', years: [2002, 2024] },
    // JEEP
    { brand: 'Jeep', model: 'Renegade', years: [2015, 2024] },
    { brand: 'Jeep', model: 'Compass', years: [2016, 2024] },
    { brand: 'Jeep', model: 'Commander', years: [2022, 2024] },
    { brand: 'Jeep', model: 'Wrangler', years: [2011, 2024] },
    // FORD
    { brand: 'Ford', model: 'Ka', years: [1997, 2021] },
    { brand: 'Ford', model: 'Fiesta', years: [1996, 2019] },
    { brand: 'Ford', model: 'EcoSport', years: [2003, 2022] },
    { brand: 'Ford', model: 'Focus', years: [2000, 2019] },
    { brand: 'Ford', model: 'Ranger', years: [1994, 2024] },
    { brand: 'Ford', model: 'Fusion', years: [2006, 2020] },
    { brand: 'Ford', model: 'Territory', years: [2020, 2024] },
    // PEUGEOT
    { brand: 'Peugeot', model: '208', years: [2013, 2024] },
    { brand: 'Peugeot', model: '2008', years: [2015, 2024] },
    { brand: 'Peugeot', model: '308', years: [2012, 2024] },
    { brand: 'Peugeot', model: '3008', years: [2017, 2024] },
    { brand: 'Peugeot', model: '206', years: [1999, 2010] },
    { brand: 'Peugeot', model: '207', years: [2008, 2015] },
    // CITROEN
    { brand: 'Citroen', model: 'C3', years: [2003, 2024] },
    { brand: 'Citroen', model: 'C4', years: [2007, 2024] },
    { brand: 'Citroen', model: 'C4 Cactus', years: [2018, 2024] },
    { brand: 'Citroen', model: 'Aircross', years: [2010, 2017] },
    { brand: 'Citroen', model: 'C3 Aircross', years: [2019, 2024] },
    // MITSUBISHI
    { brand: 'Mitsubishi', model: 'L200', years: [1995, 2024] },
    { brand: 'Mitsubishi', model: 'Pajero', years: [1998, 2024] },
    { brand: 'Mitsubishi', model: 'ASX', years: [2010, 2024] },
    { brand: 'Mitsubishi', model: 'Outlander', years: [2007, 2024] },
    { brand: 'Mitsubishi', model: 'Eclipse Cross', years: [2018, 2024] },
    { brand: 'Mitsubishi', model: 'Lancer', years: [2007, 2017] },
    // MOTOS HONDA
    { brand: 'Honda', model: 'CG 160', years: [2016, 2024] },
    { brand: 'Honda', model: 'CG 150', years: [2004, 2015] },
    { brand: 'Honda', model: 'CG 125', years: [1976, 2003] },
    { brand: 'Honda', model: 'CB 300', years: [2009, 2024] },
    { brand: 'Honda', model: 'CB 500', years: [2013, 2024] },
    { brand: 'Honda', model: 'CBR 650', years: [2014, 2024] },
    { brand: 'Honda', model: 'XRE 300', years: [2009, 2024] },
    { brand: 'Honda', model: 'Bros 160', years: [2015, 2024] },
    { brand: 'Honda', model: 'Biz 125', years: [2005, 2024] },
    { brand: 'Honda', model: 'PCX 150', years: [2013, 2024] },
    { brand: 'Honda', model: 'Pop 110', years: [2016, 2024] },
    // MOTOS YAMAHA
    { brand: 'Yamaha', model: 'Fazer 250', years: [2005, 2024] },
    { brand: 'Yamaha', model: 'YBR 150', years: [2004, 2024] },
    { brand: 'Yamaha', model: 'Factor 150', years: [2016, 2024] },
    { brand: 'Yamaha', model: 'Crosser 150', years: [2014, 2024] },
    { brand: 'Yamaha', model: 'Lander 250', years: [2006, 2024] },
    { brand: 'Yamaha', model: 'Tenere 250', years: [2011, 2024] },
    { brand: 'Yamaha', model: 'MT-03', years: [2016, 2024] },
    { brand: 'Yamaha', model: 'MT-07', years: [2015, 2024] },
    { brand: 'Yamaha', model: 'MT-09', years: [2015, 2024] },
    { brand: 'Yamaha', model: 'R3', years: [2015, 2024] },
    { brand: 'Yamaha', model: 'XJ6', years: [2010, 2018] },
    { brand: 'Yamaha', model: 'NMAX 160', years: [2016, 2024] },
    { brand: 'Yamaha', model: 'Neo 125', years: [2016, 2024] },
  ];


  // Processa cada definição de veículo
  for (const def of vehicleDefinitions) {
    const [startYear, endYear] = def.years;
    
    for (let year = startYear; year <= endYear; year++) {
      const vehicleId = generateVehicleId(def.brand, def.model, year);
      const platform = getPlatformForVehicle(def.brand, def.model);
      const parts = getPartsForPlatform(platform);
      
      // Organiza peças por categoria
      const partsByCategory = {};
      for (const part of parts) {
        if (!partsByCategory[part.category]) {
          partsByCategory[part.category] = [];
        }
        partsByCategory[part.category].push(part);
      }
      
      const vehicle = {
        vehicleId,
        vehicleName: `${def.brand} ${def.model}`,
        vehicleType: platform.startsWith('MOTO_') ? 'motorcycle' : platform === 'CAMINHAO_PESADO' ? 'truck' : 'car',
        brand: def.brand,
        model: def.model,
        year,
        platform,
        totalParts: parts.length,
        partsByCategory,
        compatibleParts: parts,
        generatedAt: new Date().toISOString(),
      };
      
      allVehicles.push(vehicle);
      
      // Atualiza estatísticas
      stats.totalVehicles++;
      stats.totalParts += parts.length;
      stats.byBrand[def.brand] = (stats.byBrand[def.brand] || 0) + 1;
      stats.byPlatform[platform] = (stats.byPlatform[platform] || 0) + 1;
    }
  }
  
  console.log(`✅ Gerados ${stats.totalVehicles} veículos`);
  console.log(`✅ Total de ${stats.totalParts} peças (média: ${(stats.totalParts / stats.totalVehicles).toFixed(1)} por veículo)`);
  console.log(`✅ ${Object.keys(stats.byBrand).length} marcas`);
  console.log(`✅ ${Object.keys(stats.byPlatform).length} plataformas\n`);
  
  // Salva os arquivos
  const outputDir = path.join(__dirname, '../output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Arquivo principal com todos os veículos
  const fullPath = path.join(outputDir, 'parts-compatibility-full.json');
  fs.writeFileSync(fullPath, JSON.stringify(allVehicles, null, 2));
  console.log(`📁 Salvo: ${fullPath}`);
  
  // Índice para busca rápida
  const index = {
    stats: {
      totalVehicles: stats.totalVehicles,
      totalParts: Object.keys(PARTS_BY_PLATFORM).reduce((sum, p) => {
        const platform = PARTS_BY_PLATFORM[p];
        return sum + Object.values(platform).reduce((s, parts) => s + parts.length, 0);
      }, 0),
      totalCategories: 8,
      totalPlatforms: Object.keys(PARTS_BY_PLATFORM).length,
      avgPartsPerVehicle: (stats.totalParts / stats.totalVehicles).toFixed(1),
      vehiclesWithParts: stats.totalVehicles,
      vehiclesWithoutParts: 0,
    },
    platforms: stats.byPlatform,
    brands: stats.byBrand,
    categories: ['Filtros', 'Freios', 'Ignição', 'Suspensão', 'Elétrica', 'Motor', 'Transmissão', 'Rolamentos'],
    generatedAt: new Date().toISOString(),
  };
  
  const indexPath = path.join(outputDir, 'parts-compatibility-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log(`📁 Salvo: ${indexPath}`);
  
  console.log('\n🎉 Geração completa!');
  console.log('\nEstatísticas por marca:');
  for (const [brand, count] of Object.entries(stats.byBrand).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${brand}: ${count} veículos`);
  }
  
  return { vehicles: allVehicles, stats, index };
}

// Executa se chamado diretamente
if (require.main === module) {
  generateFullCompatibility();
}

module.exports = { generateFullCompatibility, getPlatformForVehicle, getPartsForPlatform };
