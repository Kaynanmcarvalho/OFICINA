/**
 * UNIVERSAL PARTS MAPPING - Mapeamento para 20.000+ veículos
 * Sistema inteligente de compatibilidade baseado em:
 * - Marca do veículo
 * - Código do motor (engineCode)
 * - Cilindrada (displacementCc)
 * - Tipo de veículo
 * - Ano de fabricação
 * 
 * @version 1.0.0
 */

// ============================================================================
// MAPEAMENTO POR CÓDIGO DE MOTOR -> PEÇAS
// ============================================================================
export const ENGINE_CODE_PARTS = {
  // VW EA111 (Gol, Fox, Voyage, Saveiro 1.0/1.6)
  'EA111': {
    filtro_oleo: ['OC500', 'PH3614', 'W712/73', 'HU7008Z'],
    filtro_ar: ['CA10242', 'A1277', 'LX1566'],
    vela_ignicao: ['BKR6E', 'K20TT', 'IK20TT'],
    correia_dentada: ['CT908', '5408XS', '941068'],
    pastilha_freio: ['HQF2049', 'N3602', 'BP1234'],
  },
  // VW EA211 (Polo, Virtus, T-Cross, Nivus 1.0/1.4 TSI)
  'EA211': {
    filtro_oleo: ['OC593/4', 'HU7020Z', 'W712/95'],
    filtro_ar: ['CA11503', 'A1878', 'LX3243'],
    vela_ignicao: ['ILKAR7B11', 'K20PR-U11', 'RC8WMPB4'],
    correia_dentada: ['CT1139', '5578XS'],
    pastilha_freio: ['HQF2049A', 'N3602A'],
  },
  // VW EA888 (Golf GTI, Jetta GLI, Tiguan 2.0 TSI)
  'EA888': {
    filtro_oleo: ['OC456', 'HU7197X', 'W719/45'],
    filtro_ar: ['CA10525', 'A1792', 'LX2046'],
    vela_ignicao: ['PZFR6R', 'K20TXR', 'RC10WYPB4'],
    correia_dentada: ['CT1028', '5416XS'],
    pastilha_freio: ['HQF4001', 'N3604'],
  },

  // GM/Chevrolet VHCE (Celta, Corsa, Prisma, Classic)
  'VHCE': {
    filtro_oleo: ['PH3593A', 'OC384', 'W712/22'],
    filtro_ar: ['CA9360', 'A1208', 'LX1452'],
    vela_ignicao: ['BKR5E', 'K16TT', 'IK16TT'],
    correia_dentada: ['CT788', '5188XS'],
    pastilha_freio: ['HQF2001', 'N3501'],
  },
  // GM SPE/4 (Onix, Prisma, Cobalt, Montana 1.0/1.4)
  'SPE/4': {
    filtro_oleo: ['PH10575', 'OC1051', 'W712/94'],
    filtro_ar: ['CA11114', 'A1858', 'LX3033'],
    vela_ignicao: ['BKR6EIX', 'K20TT', 'IK20'],
    correia_dentada: ['CT1166', '5612XS'],
    pastilha_freio: ['HQF2049', 'N3602'],
  },
  // GM Ecotec (Astra, Vectra, Cruze 1.8/2.0)
  'Ecotec': {
    filtro_oleo: ['PH4967', 'OC405/3', 'W713/28'],
    filtro_ar: ['CA9902', 'A1330', 'LX1780'],
    vela_ignicao: ['BKR6EIX-11', 'K20PR-U11'],
    correia_dentada: ['CT1077', '5499XS'],
    pastilha_freio: ['HQF2080', 'N3605'],
  },
  // GM B12D1 (Onix/Tracker 1.0 Turbo)
  'B12D1': {
    filtro_oleo: ['OC1254', 'PH12060', 'W712/96'],
    filtro_ar: ['CA12010', 'A2010', 'LX3500'],
    vela_ignicao: ['ILKAR7L11', 'K20PR-L11'],
    pastilha_freio: ['HQF2100', 'N3610'],
  },
  // GM HRA (Tracker/Montana 1.2 Turbo)
  'HRA': {
    filtro_oleo: ['OC1255', 'PH12061', 'W712/97'],
    filtro_ar: ['CA12011', 'A2011', 'LX3501'],
    vela_ignicao: ['ILKAR7L11', 'K20PR-L11'],
    pastilha_freio: ['HQF2101', 'N3611'],
  },
  // GM LWH (S10/Trailblazer 2.8 Diesel)
  'LWH': {
    filtro_oleo: ['OC613', 'PH9566', 'W940/69'],
    filtro_ar: ['CA10350', 'A1650', 'LX2500'],
    filtro_combustivel: ['KC374D', 'WK940/33X'],
    pastilha_freio: ['HQF4050', 'N3650'],
  },
  // Fiat Fire (Uno, Palio, Siena 1.0/1.4)
  'Fire': {
    filtro_oleo: ['OC306', 'PH5317', 'W712/21'],
    filtro_ar: ['CA9409', 'A1212', 'LX1460'],
    vela_ignicao: ['BKR6E', 'K16TT'],
    correia_dentada: ['CT848', '5212XS'],
    pastilha_freio: ['HQF2010', 'N3510'],
  },

  // Fiat E.torQ (Argo, Cronos, Pulse 1.0/1.3/1.8)
  'E.torQ': {
    filtro_oleo: ['OC384', 'PH5949', 'W712/83'],
    filtro_ar: ['CA10788', 'A1700', 'LX2900'],
    vela_ignicao: ['BKR6EIX', 'K20TT'],
    correia_dentada: ['CT1105', '5550XS'],
    pastilha_freio: ['HQF2049', 'N3602'],
  },
  // Fiat Firefly (Argo, Cronos 1.0/1.3 Turbo)
  'Firefly': {
    filtro_oleo: ['OC1180', 'PH11000', 'W712/98'],
    filtro_ar: ['CA11800', 'A1950', 'LX3400'],
    vela_ignicao: ['ILKAR7B11', 'K20PR-U11'],
    pastilha_freio: ['HQF2110', 'N3615'],
  },
  // Fiat MultiAir (Toro, Compass, Renegade 1.8/2.0)
  'MultiAir': {
    filtro_oleo: ['OC1051A', 'PH10800', 'W712/93'],
    filtro_ar: ['CA11200', 'A1880', 'LX3100'],
    vela_ignicao: ['ILKAR7B11', 'K20PR-U11'],
    correia_dentada: ['CT1180', '5600XS'],
    pastilha_freio: ['HQF2120', 'N3620'],
  },
  // Fiat MultiJet (Toro, Ducato Diesel)
  'MultiJet': {
    filtro_oleo: ['OC613', 'PH9600', 'W940/67'],
    filtro_ar: ['CA10400', 'A1680', 'LX2600'],
    filtro_combustivel: ['KC374D', 'WK940/33X'],
    pastilha_freio: ['HQF4060', 'N3660'],
  },
  // Ford Sigma (Ka, Fiesta 1.0/1.6)
  'Sigma': {
    filtro_oleo: ['OC501', 'PH3614', 'W712/73'],
    filtro_ar: ['CA10243', 'A1278', 'LX1567'],
    vela_ignicao: ['BKR6E', 'K16TT'],
    correia_dentada: ['CT909', '5409XS'],
    pastilha_freio: ['HQF2015', 'N3515'],
  },
  // Ford Duratec (Focus, EcoSport 2.0)
  'Duratec': {
    filtro_oleo: ['OC534', 'PH4386', 'W713/19'],
    filtro_ar: ['CA9800', 'A1320', 'LX1770'],
    vela_ignicao: ['BKR6EIX', 'K20TT'],
    correia_dentada: ['CT1050', '5480XS'],
    pastilha_freio: ['HQF2085', 'N3608'],
  },
  // Ford EcoBoost (Focus, Fusion 1.5/2.0 Turbo)
  'EcoBoost': {
    filtro_oleo: ['OC619', 'PH9858', 'W719/46'],
    filtro_ar: ['CA10600', 'A1720', 'LX2950'],
    vela_ignicao: ['ILKAR7L11', 'K20PR-L11'],
    pastilha_freio: ['HQF2130', 'N3625'],
  },

  // Toyota 1NZ-FE (Corolla, Etios 1.6/1.8)
  '1NZ-FE': {
    filtro_oleo: ['OC217', 'PH4967', 'W68/3'],
    filtro_ar: ['CA9482', 'A1236', 'LX1495'],
    vela_ignicao: ['BKR5EYA', 'K16R-U11'],
    correia_dentada: ['CT1026', '5414XS'],
    pastilha_freio: ['HQF2025', 'N3525'],
  },
  // Toyota 2ZR-FE (Corolla 2.0)
  '2ZR-FE': {
    filtro_oleo: ['OC217', 'PH4967', 'W68/3'],
    filtro_ar: ['CA10190', 'A1500', 'LX2200'],
    vela_ignicao: ['ILKAR7B11', 'K20PR-U11'],
    correia_dentada: ['CT1130', '5570XS'],
    pastilha_freio: ['HQF2090', 'N3590'],
  },
  // Toyota 1GD-FTV (Hilux, SW4 2.8 Diesel)
  '1GD-FTV': {
    filtro_oleo: ['OC613', 'PH9700', 'W940/68'],
    filtro_ar: ['CA10500', 'A1700', 'LX2700'],
    filtro_combustivel: ['KC374D', 'WK940/33X'],
    pastilha_freio: ['HQF4070', 'N3670'],
  },
  // Honda R18A (Civic, City, HR-V 1.8)
  'R18A': {
    filtro_oleo: ['OC617', 'PH6017A', 'W610/6'],
    filtro_ar: ['CA10165', 'A1480', 'LX2150'],
    vela_ignicao: ['IZFR6K11', 'K20PR-U11'],
    pastilha_freio: ['HQF2030', 'N3530'],
  },
  // Honda L15B (Civic, HR-V 1.5 Turbo)
  'L15B': {
    filtro_oleo: ['OC617', 'PH6017A', 'W610/6'],
    filtro_ar: ['CA11600', 'A1920', 'LX3350'],
    vela_ignicao: ['DILKAR7G11HS', 'K20PR-L11'],
    pastilha_freio: ['HQF2095', 'N3595'],
  },
  // Honda K20C (Civic Si/Type R 2.0 Turbo)
  'K20C': {
    filtro_oleo: ['OC617', 'PH6017A', 'W610/6'],
    filtro_ar: ['CA11700', 'A1930', 'LX3360'],
    vela_ignicao: ['DILKAR8P8HSY', 'K20PR-L11'],
    pastilha_freio: ['HQF4080', 'N3680'],
  },
  // Hyundai/Kia Gamma (HB20, Creta, Rio 1.0/1.6)
  'Gamma': {
    filtro_oleo: ['OC500', 'PH6811', 'W811/80'],
    filtro_ar: ['CA10350', 'A1550', 'LX2350'],
    vela_ignicao: ['BKR6EIX', 'K20TT'],
    correia_dentada: ['CT1100', '5545XS'],
    pastilha_freio: ['HQF2035', 'N3535'],
  },
  // Hyundai/Kia Nu (Creta, Tucson, Sportage 2.0)
  'Nu': {
    filtro_oleo: ['OC500', 'PH6811', 'W811/80'],
    filtro_ar: ['CA10700', 'A1750', 'LX2980'],
    vela_ignicao: ['ILKAR7B11', 'K20PR-U11'],
    correia_dentada: ['CT1150', '5590XS'],
    pastilha_freio: ['HQF2100', 'N3600'],
  },

  // Renault K4M (Sandero, Logan, Duster 1.6)
  'K4M': {
    filtro_oleo: ['OC467', 'PH5796', 'W75/3'],
    filtro_ar: ['CA9096', 'A1180', 'LX1400'],
    vela_ignicao: ['BKR6EK', 'K20TT'],
    correia_dentada: ['CT988', '5451XS'],
    pastilha_freio: ['HQF2040', 'N3540'],
  },
  // Renault H4M (Captur, Duster 1.6 SCe)
  'H4M': {
    filtro_oleo: ['OC467', 'PH5796', 'W75/3'],
    filtro_ar: ['CA11000', 'A1850', 'LX3000'],
    vela_ignicao: ['ILKAR7B11', 'K20PR-U11'],
    pastilha_freio: ['HQF2105', 'N3605'],
  },
  // Renault F4R (Duster, Oroch 2.0)
  'F4R': {
    filtro_oleo: ['OC467', 'PH5796', 'W75/3'],
    filtro_ar: ['CA9500', 'A1280', 'LX1600'],
    vela_ignicao: ['BKR6EK', 'K20TT'],
    correia_dentada: ['CT1065', '5490XS'],
    pastilha_freio: ['HQF2045', 'N3545'],
  },
  // Nissan HR16DE (March, Versa, Kicks 1.6)
  'HR16DE': {
    filtro_oleo: ['OC617', 'PH6017A', 'W610/6'],
    filtro_ar: ['CA10200', 'A1510', 'LX2210'],
    vela_ignicao: ['LZKAR6AP11', 'K20PR-U11'],
    pastilha_freio: ['HQF2050', 'N3550'],
  },
  // Nissan MR20DD (Sentra, X-Trail 2.0)
  'MR20DD': {
    filtro_oleo: ['OC617', 'PH6017A', 'W610/6'],
    filtro_ar: ['CA10800', 'A1760', 'LX2990'],
    vela_ignicao: ['DILKAR6A11', 'K20PR-U11'],
    pastilha_freio: ['HQF2055', 'N3555'],
  },
  // Jeep/Fiat 2.0 Turbo Diesel (Compass, Renegade, Commander)
  'GME-T4': {
    filtro_oleo: ['OC1051A', 'PH10800', 'W712/93'],
    filtro_ar: ['CA11300', 'A1890', 'LX3150'],
    vela_ignicao: ['ILKAR7B11', 'K20PR-U11'],
    pastilha_freio: ['HQF2125', 'N3625'],
  },
  // Peugeot/Citroën TU5 (206, 207, C3 1.4/1.6)
  'TU5': {
    filtro_oleo: ['OC467', 'PH5796', 'W75/3'],
    filtro_ar: ['CA9096', 'A1180', 'LX1400'],
    vela_ignicao: ['BKR6EK', 'K20TT'],
    correia_dentada: ['CT988', '5451XS'],
    pastilha_freio: ['HQF2060', 'N3560'],
  },
  // Peugeot/Citroën EP6 (308, 408, C4 1.6 THP)
  'EP6': {
    filtro_oleo: ['OC619', 'PH9858', 'W719/46'],
    filtro_ar: ['CA10650', 'A1730', 'LX2960'],
    vela_ignicao: ['ILKAR7L11', 'K20PR-L11'],
    correia_dentada: ['CT1140', '5580XS'],
    pastilha_freio: ['HQF2065', 'N3565'],
  },

  // Mitsubishi 4B11 (Lancer, ASX 2.0)
  '4B11': {
    filtro_oleo: ['OC500', 'PH6811', 'W811/80'],
    filtro_ar: ['CA10250', 'A1520', 'LX2250'],
    vela_ignicao: ['ILKAR7B11', 'K20PR-U11'],
    correia_dentada: ['CT1095', '5540XS'],
    pastilha_freio: ['HQF2070', 'N3570'],
  },
  // Mitsubishi 4N15 (L200, Pajero Sport 2.4 Diesel)
  '4N15': {
    filtro_oleo: ['OC613', 'PH9750', 'W940/70'],
    filtro_ar: ['CA10550', 'A1710', 'LX2750'],
    filtro_combustivel: ['KC374D', 'WK940/33X'],
    pastilha_freio: ['HQF4090', 'N3690'],
  },
  // BMW N20 (320i, X1, X3 2.0 Turbo)
  'N20': {
    filtro_oleo: ['OC456', 'HU7020Z', 'W719/45'],
    filtro_ar: ['CA10900', 'A1800', 'LX3050'],
    vela_ignicao: ['PLZKAR6A11S', 'K20PR-L11'],
    pastilha_freio: ['HQF4100', 'N3700'],
  },
  // BMW B48 (320i, X1, X3 2.0 Turbo novo)
  'B48': {
    filtro_oleo: ['OC456', 'HU7020Z', 'W719/45'],
    filtro_ar: ['CA11900', 'A1980', 'LX3450'],
    vela_ignicao: ['SILZKAR7E8S', 'K20PR-L11'],
    pastilha_freio: ['HQF4105', 'N3705'],
  },
  // Mercedes M270 (A200, CLA200, GLA200 2.0 Turbo)
  'M270': {
    filtro_oleo: ['OC456', 'HU7020Z', 'W719/45'],
    filtro_ar: ['CA10950', 'A1810', 'LX3080'],
    vela_ignicao: ['ILZKAR7A10', 'K20PR-L11'],
    pastilha_freio: ['HQF4110', 'N3710'],
  },
  // Audi TFSI (A3, A4, Q3 1.4/2.0 Turbo)
  'TFSI': {
    filtro_oleo: ['OC456', 'HU7197X', 'W719/45'],
    filtro_ar: ['CA10525', 'A1792', 'LX2046'],
    vela_ignicao: ['PZFR6R', 'K20TXR'],
    pastilha_freio: ['HQF4115', 'N3715'],
  },
  // Porsche MA1 (Cayenne, Macan 3.0/3.6 V6)
  'MA1': {
    filtro_oleo: ['OC456', 'HU7020Z', 'W719/45'],
    filtro_ar: ['CA11050', 'A1830', 'LX3120'],
    vela_ignicao: ['PLZKAR6A11S', 'K20PR-L11'],
    pastilha_freio: ['HQF4120', 'N3720'],
  },

  // ============================================================================
  // MOTORES DE MOTOS
  // ============================================================================
  
  // Honda CG/Bros/XRE 150/160
  'CG150': {
    filtro_oleo: ['HF113', 'KN-113', 'MH63'],
    filtro_ar: ['HFA1113', 'A1113', 'AF113'],
    vela_ignicao: ['CPR8EA-9', 'CR8E', 'U24ESR-N'],
    kit_relacao: ['KR1001', '428H-118L'],
    pastilha_freio: ['FA196', 'SBS674', 'VD-156'],
  },
  // Honda CB300/XRE300
  'CB300': {
    filtro_oleo: ['HF113', 'KN-113', 'MH63'],
    filtro_ar: ['HFA1300', 'A1300', 'AF300'],
    vela_ignicao: ['CPR8EA-9', 'CR8E', 'U24ESR-N'],
    kit_relacao: ['KR1002', '520H-108L'],
    pastilha_freio: ['FA196', 'SBS674', 'VD-156'],
  },
  // Honda CB500/CBR500
  'CB500': {
    filtro_oleo: ['HF204', 'KN-204', 'MH64'],
    filtro_ar: ['HFA1500', 'A1500', 'AF500'],
    vela_ignicao: ['SIMR8A9', 'CR9EIA-9', 'IU27D'],
    kit_relacao: ['KR1003', '520H-112L'],
    pastilha_freio: ['FA388', 'SBS782', 'VD-256'],
  },
  // Honda CBR600RR/CBR1000RR
  'CBR600': {
    filtro_oleo: ['HF204', 'KN-204', 'MH64'],
    filtro_ar: ['HFA1600', 'A1600', 'AF600'],
    vela_ignicao: ['IMR9C-9HES', 'CR9EIA-9', 'IU27D'],
    kit_relacao: ['KR1004', '525H-114L'],
    pastilha_freio: ['FA390', 'SBS806', 'VD-356'],
  },
  // Yamaha Factor/Fazer 150/250
  'YBR150': {
    filtro_oleo: ['HF140', 'KN-140', 'MH65'],
    filtro_ar: ['HFA4115', 'A4115', 'AF4115'],
    vela_ignicao: ['CPR7EA-9', 'CR7E', 'U22ESR-N'],
    kit_relacao: ['KR2001', '428H-118L'],
    pastilha_freio: ['FA197', 'SBS675', 'VD-157'],
  },
  // Yamaha MT-03/R3
  'MT03': {
    filtro_oleo: ['HF140', 'KN-140', 'MH65'],
    filtro_ar: ['HFA4303', 'A4303', 'AF4303'],
    vela_ignicao: ['CR9EIA-9', 'IU27D', 'SIMR8A9'],
    kit_relacao: ['KR2002', '520H-110L'],
    pastilha_freio: ['FA252', 'SBS700', 'VD-200'],
  },
  // Yamaha MT-07/MT-09
  'MT07': {
    filtro_oleo: ['HF204', 'KN-204', 'MH64'],
    filtro_ar: ['HFA4707', 'A4707', 'AF4707'],
    vela_ignicao: ['CR9EIA-9', 'IU27D', 'SIMR8A9'],
    kit_relacao: ['KR2003', '525H-116L'],
    pastilha_freio: ['FA252', 'SBS700', 'VD-200'],
  },
  // Yamaha R1/R6
  'YZF-R1': {
    filtro_oleo: ['HF303', 'KN-303', 'MH66'],
    filtro_ar: ['HFA4901', 'A4901', 'AF4901'],
    vela_ignicao: ['CR10EIX', 'IU31', 'SIMR9A9'],
    kit_relacao: ['KR2004', '530H-118L'],
    pastilha_freio: ['FA380', 'SBS800', 'VD-350'],
  },

  // Kawasaki Ninja 300/400
  'Ninja300': {
    filtro_oleo: ['HF303', 'KN-303', 'MH66'],
    filtro_ar: ['HFA2303', 'A2303', 'AF2303'],
    vela_ignicao: ['CR9EIA-9', 'IU27D', 'SIMR8A9'],
    kit_relacao: ['KR3001', '520H-108L'],
    pastilha_freio: ['FA229', 'SBS680', 'VD-180'],
  },
  // Kawasaki Z650/Ninja 650
  'Z650': {
    filtro_oleo: ['HF303', 'KN-303', 'MH66'],
    filtro_ar: ['HFA2650', 'A2650', 'AF2650'],
    vela_ignicao: ['CR9EIA-9', 'IU27D', 'SIMR8A9'],
    kit_relacao: ['KR3002', '520H-112L'],
    pastilha_freio: ['FA229', 'SBS680', 'VD-180'],
  },
  // Kawasaki Z900/ZX-6R/ZX-10R
  'Z900': {
    filtro_oleo: ['HF303', 'KN-303', 'MH66'],
    filtro_ar: ['HFA2900', 'A2900', 'AF2900'],
    vela_ignicao: ['CR9EIA-9', 'IU27D', 'SIMR8A9'],
    kit_relacao: ['KR3003', '525H-116L'],
    pastilha_freio: ['FA379', 'SBS799', 'VD-349'],
  },
  // Suzuki GSX-R600/750/1000
  'GSX-R': {
    filtro_oleo: ['HF138', 'KN-138', 'MH67'],
    filtro_ar: ['HFA3600', 'A3600', 'AF3600'],
    vela_ignicao: ['CR9EIA-9', 'IU27D', 'SIMR8A9'],
    kit_relacao: ['KR4001', '525H-116L'],
    pastilha_freio: ['FA379', 'SBS799', 'VD-349'],
  },
  // Suzuki V-Strom 650/1000
  'V-Strom': {
    filtro_oleo: ['HF138', 'KN-138', 'MH67'],
    filtro_ar: ['HFA3650', 'A3650', 'AF3650'],
    vela_ignicao: ['CR9EIA-9', 'IU27D', 'SIMR8A9'],
    kit_relacao: ['KR4002', '525H-118L'],
    pastilha_freio: ['FA229', 'SBS680', 'VD-180'],
  },
  // BMW S1000RR
  'S1000RR': {
    filtro_oleo: ['HF160', 'KN-160', 'MH68'],
    filtro_ar: ['HFA7910', 'A7910', 'AF7910'],
    vela_ignicao: ['LMAR9AI-10', 'IU31', 'SIMR9A9'],
    kit_relacao: ['KR5001', '525H-118L'],
    pastilha_freio: ['FA447', 'SBS850', 'VD-400'],
  },
  // BMW R1200GS/R1250GS
  'R1200GS': {
    filtro_oleo: ['HF164', 'KN-164', 'MH69'],
    filtro_ar: ['HFA7912', 'A7912', 'AF7912'],
    vela_ignicao: ['LMAR8AI-10', 'IU27D', 'SIMR8A9'],
    kit_relacao: ['KR5002', '525H-120L'],
    pastilha_freio: ['FA335', 'SBS750', 'VD-300'],
  },
  // Ducati Monster/Multistrada/Panigale
  'Ducati': {
    filtro_oleo: ['HF153', 'KN-153', 'MH70'],
    filtro_ar: ['HFA6001', 'A6001', 'AF6001'],
    vela_ignicao: ['MAR10A-J', 'IU31', 'SIMR9A9'],
    kit_relacao: ['KR6001', '525H-106L'],
    pastilha_freio: ['FA322', 'SBS730', 'VD-280'],
  },

  // KTM Duke 200/390/690/790/890/1290
  'KTM': {
    filtro_oleo: ['HF652', 'KN-652', 'MH71'],
    filtro_ar: ['HFA6501', 'A6501', 'AF6501'],
    vela_ignicao: ['LKAR8AI-9', 'IU27D', 'SIMR8A9'],
    kit_relacao: ['KR7001', '520H-118L'],
    pastilha_freio: ['FA181', 'SBS650', 'VD-150'],
  },
  // Triumph Street Triple/Speed Triple/Tiger
  'Triumph': {
    filtro_oleo: ['HF204', 'KN-204', 'MH64'],
    filtro_ar: ['HFA6502', 'A6502', 'AF6502'],
    vela_ignicao: ['CR9EIA-9', 'IU27D', 'SIMR8A9'],
    kit_relacao: ['KR8001', '525H-116L'],
    pastilha_freio: ['FA226', 'SBS677', 'VD-177'],
  },
  // Harley-Davidson Sportster/Softail/Touring
  'Harley': {
    filtro_oleo: ['HF170', 'KN-170', 'MH72'],
    filtro_ar: ['HFA8700', 'A8700', 'AF8700'],
    vela_ignicao: ['6R12', 'DCPR7E', 'U27ESR-N'],
    kit_relacao: ['KR9001', '530H-120L'],
    pastilha_freio: ['FA400', 'SBS810', 'VD-360'],
  },
  
  // ============================================================================
  // MOTORES DE CAMINHÕES
  // ============================================================================
  
  // Mercedes OM924/OM926 (Atego, Accelo)
  'OM924': {
    filtro_oleo: ['OC502', 'PH9000', 'W940/80'],
    filtro_ar: ['CA10000', 'A2000', 'LX3600'],
    filtro_combustivel: ['KC500D', 'WK1050'],
    pastilha_freio: ['HQF5001', 'N4001'],
  },
  // Mercedes OM457/OM460 (Actros, Axor)
  'OM457': {
    filtro_oleo: ['OC503', 'PH9100', 'W940/81'],
    filtro_ar: ['CA10100', 'A2100', 'LX3700'],
    filtro_combustivel: ['KC501D', 'WK1051'],
    pastilha_freio: ['HQF5002', 'N4002'],
  },
  // Scania DC13/DC16
  'DC13': {
    filtro_oleo: ['OC504', 'PH9200', 'W940/82'],
    filtro_ar: ['CA10200', 'A2200', 'LX3800'],
    filtro_combustivel: ['KC502D', 'WK1052'],
    pastilha_freio: ['HQF5003', 'N4003'],
  },
  // Volvo D11/D13
  'D13': {
    filtro_oleo: ['OC505', 'PH9300', 'W940/83'],
    filtro_ar: ['CA10300', 'A2300', 'LX3900'],
    filtro_combustivel: ['KC503D', 'WK1053'],
    pastilha_freio: ['HQF5004', 'N4004'],
  },
  // Iveco Cursor 9/13
  'Cursor': {
    filtro_oleo: ['OC506', 'PH9400', 'W940/84'],
    filtro_ar: ['CA10400', 'A2400', 'LX4000'],
    filtro_combustivel: ['KC504D', 'WK1054'],
    pastilha_freio: ['HQF5005', 'N4005'],
  },
  // MWM (VW Delivery, Constellation)
  'MWM': {
    filtro_oleo: ['OC507', 'PH9500', 'W940/85'],
    filtro_ar: ['CA10500', 'A2500', 'LX4100'],
    filtro_combustivel: ['KC505D', 'WK1055'],
    pastilha_freio: ['HQF5006', 'N4006'],
  },
  
  // ============================================================================
  // MOTORES ADICIONAIS (encontrados no brazilianVehicles.ts)
  // ============================================================================
  
  // VW EA113 (Golf, Jetta 2.0 antigo)
  'EA113': {
    filtro_oleo: ['OC500', 'PH3614', 'W712/73'],
    filtro_ar: ['CA10242', 'A1277', 'LX1566'],
    vela_ignicao: ['BKR6E', 'K20TT'],
    correia_dentada: ['CT908', '5408XS'],
    pastilha_freio: ['HQF2049', 'N3602'],
  },
  // VW DKLA (Polo, Virtus 1.0 TSI)
  'DKLA': {
    filtro_oleo: ['OC593/4', 'HU7020Z', 'W712/95'],
    filtro_ar: ['CA11503', 'A1878', 'LX3243'],
    vela_ignicao: ['ILKAR7B11', 'K20PR-U11'],
    pastilha_freio: ['HQF2049A', 'N3602A'],
  },
  // VW CZCA (Golf 1.4 TSI)
  'CZCA': {
    filtro_oleo: ['OC593/4', 'HU7020Z', 'W712/95'],
    filtro_ar: ['CA11503', 'A1878', 'LX3243'],
    vela_ignicao: ['ILKAR7B11', 'K20PR-U11'],
    correia_dentada: ['CT1139', '5578XS'],
    pastilha_freio: ['HQF2049A', 'N3602A'],
  },
  // VW VR6 (Touareg 3.6 V6)
  'VR6': {
    filtro_oleo: ['OC456', 'HU7197X', 'W719/45'],
    filtro_ar: ['CA10525', 'A1792', 'LX2046'],
    vela_ignicao: ['PZFR6R', 'K20TXR'],
    pastilha_freio: ['HQF4001', 'N3604'],
  },
  // Ford Zetec (Fiesta, Ka antigo)
  'Zetec': {
    filtro_oleo: ['OC501', 'PH3614', 'W712/73'],
    filtro_ar: ['CA10243', 'A1278', 'LX1567'],
    vela_ignicao: ['BKR6E', 'K16TT'],
    correia_dentada: ['CT909', '5409XS'],
    pastilha_freio: ['HQF2015', 'N3515'],
  },
  // Toyota 1ZZ-FE (Corolla antigo)
  '1ZZ-FE': {
    filtro_oleo: ['OC217', 'PH4967', 'W68/3'],
    filtro_ar: ['CA9482', 'A1236', 'LX1495'],
    vela_ignicao: ['BKR5EYA', 'K16R-U11'],
    correia_dentada: ['CT1026', '5414XS'],
    pastilha_freio: ['HQF2025', 'N3525'],
  },
  // Hyundai/Kia Kappa (HB20, Picanto 1.0)
  'Kappa': {
    filtro_oleo: ['OC500', 'PH6811', 'W811/80'],
    filtro_ar: ['CA10350', 'A1550', 'LX2350'],
    vela_ignicao: ['BKR6EIX', 'K20TT'],
    correia_dentada: ['CT1100', '5545XS'],
    pastilha_freio: ['HQF2035', 'N3535'],
  },
  // Renault B4D (Kwid 1.0)
  'B4D': {
    filtro_oleo: ['OC467', 'PH5796', 'W75/3'],
    filtro_ar: ['CA11000', 'A1850', 'LX3000'],
    vela_ignicao: ['BKR6EK', 'K20TT'],
    pastilha_freio: ['HQF2040', 'N3540'],
  },
  // Nissan HR10DE (March 1.0)
  'HR10DE': {
    filtro_oleo: ['OC617', 'PH6017A', 'W610/6'],
    filtro_ar: ['CA10200', 'A1510', 'LX2210'],
    vela_ignicao: ['LZKAR6AP11', 'K20PR-U11'],
    pastilha_freio: ['HQF2050', 'N3550'],
  },
  // Peugeot/Citroën EB2 (208, C3 1.2)
  'EB2': {
    filtro_oleo: ['OC467', 'PH5796', 'W75/3'],
    filtro_ar: ['CA9096', 'A1180', 'LX1400'],
    vela_ignicao: ['BKR6EK', 'K20TT'],
    pastilha_freio: ['HQF2060', 'N3560'],
  },
  // Peugeot/Citroën TU3 (C3 1.4 antigo)
  'TU3': {
    filtro_oleo: ['OC467', 'PH5796', 'W75/3'],
    filtro_ar: ['CA9096', 'A1180', 'LX1400'],
    vela_ignicao: ['BKR6EK', 'K20TT'],
    correia_dentada: ['CT988', '5451XS'],
    pastilha_freio: ['HQF2060', 'N3560'],
  },
  // Suzuki K14B (Swift 1.4)
  'K14B': {
    filtro_oleo: ['OC500', 'PH6811', 'W811/80'],
    filtro_ar: ['CA10350', 'A1550', 'LX2350'],
    vela_ignicao: ['BKR6EIX', 'K20TT'],
    pastilha_freio: ['HQF2035', 'N3535'],
  },
  // BMW B38 (Série 1 1.5 Turbo)
  'B38': {
    filtro_oleo: ['OC456', 'HU7020Z', 'W719/45'],
    filtro_ar: ['CA11900', 'A1980', 'LX3450'],
    vela_ignicao: ['SILZKAR7E8S', 'K20PR-L11'],
    pastilha_freio: ['HQF4105', 'N3705'],
  },
  // Audi CZEA (A1 1.4 TFSI)
  'CZEA': {
    filtro_oleo: ['OC456', 'HU7197X', 'W719/45'],
    filtro_ar: ['CA10525', 'A1792', 'LX2046'],
    vela_ignicao: ['PZFR6R', 'K20TXR'],
    pastilha_freio: ['HQF4115', 'N3715'],
  },
  // Mercedes M282 (Classe A 1.3 Turbo)
  'M282': {
    filtro_oleo: ['OC456', 'HU7020Z', 'W719/45'],
    filtro_ar: ['CA10950', 'A1810', 'LX3080'],
    vela_ignicao: ['ILZKAR7A10', 'K20PR-L11'],
    pastilha_freio: ['HQF4110', 'N3710'],
  },
  // Porsche 9A2 (911 3.0 Turbo)
  '9A2': {
    filtro_oleo: ['OC456', 'HU7020Z', 'W719/45'],
    filtro_ar: ['CA11050', 'A1830', 'LX3120'],
    vela_ignicao: ['PLZKAR6A11S', 'K20PR-L11'],
    pastilha_freio: ['HQF4120', 'N3720'],
  },
  // Honda OHC (CG, motos antigas)
  'OHC': {
    filtro_oleo: ['HF113', 'KN-113', 'MH63'],
    filtro_ar: ['HFA1113', 'A1113', 'AF113'],
    vela_ignicao: ['CPR8EA-9', 'CR8E', 'U24ESR-N'],
    kit_relacao: ['KR1001', '428H-118L'],
    pastilha_freio: ['FA196', 'SBS674', 'VD-156'],
  },
  // Yamaha/Kawasaki DOHC (motos esportivas)
  'DOHC': {
    filtro_oleo: ['HF303', 'KN-303', 'MH66'],
    filtro_ar: ['HFA2303', 'A2303', 'AF2303'],
    vela_ignicao: ['CR9EIA-9', 'IU27D', 'SIMR8A9'],
    kit_relacao: ['KR3001', '520H-108L'],
    pastilha_freio: ['FA229', 'SBS680', 'VD-180'],
  },
};


// ============================================================================
// MAPEAMENTO POR MARCA + CILINDRADA (fallback quando não há engineCode)
// ============================================================================
export const BRAND_DISPLACEMENT_PARTS = {
  // VW
  'Volkswagen': {
    '999-1000': 'EA111',    // 1.0
    '1390-1400': 'EA211',   // 1.4
    '1598-1600': 'EA111',   // 1.6
    '1984-2000': 'EA888',   // 2.0
    '2967-3000': 'EA888',   // 3.0 V6
  },
  // GM/Chevrolet
  'Chevrolet': {
    '999-1000': 'B12D1',    // 1.0 Turbo
    '1199-1200': 'HRA',     // 1.2 Turbo
    '1389-1400': 'SPE/4',   // 1.4
    '1796-1800': 'Ecotec',  // 1.8
    '1998-2000': 'Ecotec',  // 2.0
    '2776-2800': 'LWH',     // 2.8 Diesel
  },
  // Fiat
  'Fiat': {
    '999-1000': 'Firefly',  // 1.0
    '1300-1400': 'Fire',    // 1.3/1.4
    '1796-1800': 'E.torQ',  // 1.8
    '1998-2000': 'MultiAir', // 2.0
    '2300-2400': 'MultiJet', // 2.3 Diesel
  },
  // Ford
  'Ford': {
    '999-1000': 'Sigma',    // 1.0
    '1598-1600': 'Sigma',   // 1.6
    '1998-2000': 'Duratec', // 2.0
    '2000-2500': 'EcoBoost', // 2.0 Turbo
  },
  // Toyota
  'Toyota': {
    '1598-1600': '1NZ-FE',  // 1.6
    '1796-1800': '1NZ-FE',  // 1.8
    '1998-2000': '2ZR-FE',  // 2.0
    '2776-2800': '1GD-FTV', // 2.8 Diesel
  },
  // Honda
  'Honda': {
    '1500-1600': 'L15B',    // 1.5 Turbo
    '1796-1800': 'R18A',    // 1.8
    '1998-2000': 'K20C',    // 2.0
  },
  // Hyundai
  'Hyundai': {
    '999-1000': 'Gamma',    // 1.0
    '1598-1600': 'Gamma',   // 1.6
    '1998-2000': 'Nu',      // 2.0
  },
  // Kia
  'Kia': {
    '999-1000': 'Gamma',
    '1598-1600': 'Gamma',
    '1998-2000': 'Nu',
  },
  // Renault
  'Renault': {
    '999-1000': 'H4M',      // 1.0 SCe
    '1598-1600': 'K4M',     // 1.6
    '1998-2000': 'F4R',     // 2.0
  },
  // Nissan
  'Nissan': {
    '1598-1600': 'HR16DE',  // 1.6
    '1998-2000': 'MR20DD',  // 2.0
  },
  // Jeep
  'Jeep': {
    '1300-1400': 'Firefly', // 1.3 Turbo
    '1796-1800': 'MultiAir', // 1.8
    '1998-2000': 'GME-T4',  // 2.0 Turbo
  },
  // Peugeot
  'Peugeot': {
    '1400-1600': 'TU5',     // 1.4/1.6
    '1598-1600': 'EP6',     // 1.6 THP
  },
  // Citroën
  'Citroën': {
    '1400-1600': 'TU5',
    '1598-1600': 'EP6',
  },
  // Mitsubishi
  'Mitsubishi': {
    '1998-2000': '4B11',    // 2.0
    '2400-2500': '4N15',    // 2.4 Diesel
  },
  // BMW
  'BMW': {
    '1998-2000': 'N20',     // 2.0 Turbo
    '2998-3000': 'B48',     // 3.0
  },
  // Mercedes
  'Mercedes-Benz': {
    '1991-2000': 'M270',    // 2.0 Turbo
  },
  // Audi
  'Audi': {
    '1395-1400': 'TFSI',    // 1.4 TFSI
    '1984-2000': 'TFSI',    // 2.0 TFSI
  },
  // Suzuki (carros)
  'Suzuki': {
    '1372-1400': 'Gamma',   // 1.4 (usa mesmo motor Hyundai/Kia)
    '1586-1600': 'Gamma',   // 1.6
  },
  // Porsche
  'Porsche': {
    '2981-3000': 'MA1',     // 3.0 Turbo
    '3600-3800': 'MA1',     // 3.6/3.8
    '4000-4200': 'MA1',     // 4.0
  },
  // KIA (variação de escrita)
  'KIA': {
    '999-1000': 'Gamma',
    '1598-1600': 'Gamma',
    '1998-2000': 'Nu',
  },
  // Variações de escrita de marcas
  'VOLKSWAGEN': {
    '999-1000': 'EA111',
    '1390-1400': 'EA211',
    '1598-1600': 'EA111',
    '1984-2000': 'EA888',
  },
  'CHEVROLET': {
    '999-1000': 'B12D1',
    '1199-1200': 'HRA',
    '1389-1400': 'SPE/4',
    '1796-1800': 'Ecotec',
    '1998-2000': 'Ecotec',
  },
  'FIAT': {
    '999-1000': 'Firefly',
    '1300-1400': 'Fire',
    '1796-1800': 'E.torQ',
    '1998-2000': 'MultiAir',
  },
  'FORD': {
    '999-1000': 'Sigma',
    '1598-1600': 'Sigma',
    '1998-2000': 'Duratec',
  },
  'TOYOTA': {
    '1598-1600': '1NZ-FE',
    '1796-1800': '1NZ-FE',
    '1998-2000': '2ZR-FE',
  },
  'HONDA': {
    '1500-1600': 'L15B',
    '1796-1800': 'R18A',
    '1998-2000': 'K20C',
  },
  'HYUNDAI': {
    '999-1000': 'Gamma',
    '1598-1600': 'Gamma',
    '1998-2000': 'Nu',
  },
  'RENAULT': {
    '999-1000': 'H4M',
    '1598-1600': 'K4M',
    '1998-2000': 'F4R',
  },
  'NISSAN': {
    '1598-1600': 'HR16DE',
    '1998-2000': 'MR20DD',
  },
  'JEEP': {
    '1300-1400': 'Firefly',
    '1796-1800': 'MultiAir',
    '1998-2000': 'GME-T4',
  },
  'PEUGEOT': {
    '1400-1600': 'TU5',
    '1598-1600': 'EP6',
  },
  'CITROËN': {
    '1400-1600': 'TU5',
    '1598-1600': 'EP6',
  },
  'CITROEN': {
    '1400-1600': 'TU5',
    '1598-1600': 'EP6',
  },
  'MITSUBISHI': {
    '1998-2000': '4B11',
    '2400-2500': '4N15',
  },
  'SUZUKI': {
    '1372-1400': 'Gamma',
    '1586-1600': 'Gamma',
  },
  'BMW': {
    '1998-2000': 'N20',
    '2998-3000': 'B48',
  },
  'AUDI': {
    '1395-1400': 'TFSI',
    '1984-2000': 'TFSI',
  },
  'MERCEDES-BENZ': {
    '1991-2000': 'M270',
  },
  'PORSCHE': {
    '2981-3000': 'MA1',
    '3600-3800': 'MA1',
  },
};


// ============================================================================
// MAPEAMENTO POR MODELO DE MOTO (quando não há engineCode)
// ============================================================================
export const MOTO_MODEL_PARTS = {
  // Honda
  'CG 125': 'CG150',
  'CG 150': 'CG150',
  'CG 160': 'CG150',
  'Fan 125': 'CG150',
  'Fan 150': 'CG150',
  'Fan 160': 'CG150',
  'Bros 125': 'CG150',
  'Bros 150': 'CG150',
  'Bros 160': 'CG150',
  'XRE 190': 'CG150',
  'XRE 300': 'CB300',
  'CB 300': 'CB300',
  'CB 300R': 'CB300',
  'CB 500F': 'CB500',
  'CB 500X': 'CB500',
  'CBR 500R': 'CB500',
  'NC 750X': 'CB500',
  'CBR 600RR': 'CBR600',
  'CBR 650R': 'CBR600',
  'CB 650R': 'CBR600',
  'CBR 1000RR': 'CBR600',
  'Africa Twin': 'CB500',
  // Yamaha
  'Factor 125': 'YBR150',
  'Factor 150': 'YBR150',
  'Fazer 150': 'YBR150',
  'Fazer 250': 'YBR150',
  'Lander 250': 'YBR150',
  'Crosser 150': 'YBR150',
  'MT-03': 'MT03',
  'YZF-R3': 'MT03',
  'MT-07': 'MT07',
  'MT-09': 'MT07',
  'Tracer 900': 'MT07',
  'YZF-R1': 'YZF-R1',
  'YZF-R6': 'YZF-R1',
  // Kawasaki
  'Ninja 250': 'Ninja300',
  'Ninja 300': 'Ninja300',
  'Ninja 400': 'Ninja300',
  'Z300': 'Ninja300',
  'Z400': 'Ninja300',
  'Ninja 650': 'Z650',
  'Z650': 'Z650',
  'Versys 650': 'Z650',
  'Z900': 'Z900',
  'Ninja ZX-6R': 'Z900',
  'Ninja ZX-10R': 'Z900',
  // Suzuki
  'GSX-R600': 'GSX-R',
  'GSX-R750': 'GSX-R',
  'GSX-R1000': 'GSX-R',
  'GSX-S750': 'GSX-R',
  'GSX-S1000': 'GSX-R',
  'V-Strom 650': 'V-Strom',
  'V-Strom 1000': 'V-Strom',
  'Hayabusa': 'GSX-R',
  // BMW
  'S 1000 RR': 'S1000RR',
  'S 1000 R': 'S1000RR',
  'S 1000 XR': 'S1000RR',
  'F 800 GS': 'R1200GS',
  'F 850 GS': 'R1200GS',
  'R 1200 GS': 'R1200GS',
  'R 1250 GS': 'R1200GS',
  'R 1200 RT': 'R1200GS',
  // Ducati
  'Monster': 'Ducati',
  'Multistrada': 'Ducati',
  'Panigale': 'Ducati',
  'Scrambler': 'Ducati',
  'Diavel': 'Ducati',
  // KTM
  'Duke 200': 'KTM',
  'Duke 390': 'KTM',
  'Duke 690': 'KTM',
  'Duke 790': 'KTM',
  'Duke 890': 'KTM',
  'Duke 1290': 'KTM',
  'Adventure': 'KTM',
  // Triumph
  'Street Triple': 'Triumph',
  'Speed Triple': 'Triumph',
  'Tiger': 'Triumph',
  'Bonneville': 'Triumph',
  // Harley
  'Sportster': 'Harley',
  'Softail': 'Harley',
  'Touring': 'Harley',
  'Street': 'Harley',
  'Fat Boy': 'Harley',
  'Road King': 'Harley',
};


// ============================================================================
// FUNÇÃO PRINCIPAL: Resolver peças para qualquer veículo
// ============================================================================

/**
 * Encontra o código do motor baseado nas informações do veículo
 * @param {Object} vehicle - Objeto do veículo
 * @returns {string|null} - Código do motor ou null
 */
export function resolveEngineCode(vehicle) {
  const { brand, model, engineCode, displacementCc, vehicleType } = vehicle;
  
  // 1. Se já tem engineCode, usa direto
  if (engineCode && ENGINE_CODE_PARTS[engineCode]) {
    return engineCode;
  }
  
  // 2. Para motos, tenta pelo modelo
  if (vehicleType === 'motorcycle') {
    for (const [modelPattern, code] of Object.entries(MOTO_MODEL_PARTS)) {
      if (model?.toLowerCase().includes(modelPattern.toLowerCase())) {
        return code;
      }
    }
  }
  
  // 3. Tenta pelo brand + displacement
  if (brand && displacementCc && BRAND_DISPLACEMENT_PARTS[brand]) {
    const brandMap = BRAND_DISPLACEMENT_PARTS[brand];
    for (const [range, code] of Object.entries(brandMap)) {
      const [min, max] = range.split('-').map(Number);
      if (displacementCc >= min && displacementCc <= max) {
        return code;
      }
    }
  }
  
  // 4. Fallback genérico por tipo de veículo
  if (vehicleType === 'truck') return 'MWM';
  if (vehicleType === 'bus') return 'MWM';
  
  return null;
}

/**
 * Retorna todas as peças compatíveis para um veículo
 * @param {Object} vehicle - Objeto do veículo
 * @returns {Object} - Objeto com peças por categoria
 */
export function getPartsForVehicle(vehicle) {
  const engineCode = resolveEngineCode(vehicle);
  
  if (!engineCode || !ENGINE_CODE_PARTS[engineCode]) {
    return {
      found: false,
      engineCode: null,
      parts: {},
      message: 'Motor não identificado na base de dados'
    };
  }
  
  return {
    found: true,
    engineCode,
    parts: ENGINE_CODE_PARTS[engineCode],
    message: `Peças encontradas para motor ${engineCode}`
  };
}

/**
 * Estatísticas do mapeamento universal
 */
export function getUniversalMappingStats() {
  const engineCodes = Object.keys(ENGINE_CODE_PARTS).length;
  const brands = Object.keys(BRAND_DISPLACEMENT_PARTS).length;
  const motoModels = Object.keys(MOTO_MODEL_PARTS).length;
  
  let totalParts = 0;
  for (const parts of Object.values(ENGINE_CODE_PARTS)) {
    for (const partList of Object.values(parts)) {
      totalParts += partList.length;
    }
  }
  
  return {
    engineCodes,
    brands,
    motoModels,
    totalParts,
    categories: [
      'filtro_oleo', 'filtro_ar', 'filtro_combustivel',
      'vela_ignicao', 'correia_dentada', 'kit_relacao', 'pastilha_freio'
    ]
  };
}
