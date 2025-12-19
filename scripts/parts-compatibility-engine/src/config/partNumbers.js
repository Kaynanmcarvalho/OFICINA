/**
 * BASE DE PART NUMBERS POR FABRICANTE
 * Mapeamento completo de peças por marca/modelo/motor
 * 
 * @version 2.0.0 - Edição Expandida
 */

export const PART_NUMBERS_DATABASE = {
  // ============================================================================
  // FILTROS DE ÓLEO - Por fabricante e aplicação
  // ============================================================================
  oil_filters: {
    // MANN-FILTER
    'W712/95': { brand: 'MANN-FILTER', applications: ['VW EA211', 'VW EA111', 'Audi 1.4 TSI', 'VW Gol', 'VW Voyage', 'VW Fox', 'VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus', 'VW Up'], specs: { height: 79, diameter: 76, thread: 'M20x1.5' }, equivalents: ['FRAM PH6811', 'BOSCH F026407157', 'WIX WL7476', 'TECFIL PSL315'] },
    'W610/3': { brand: 'MANN-FILTER', applications: ['Honda 1.5', 'Honda 1.8', 'Honda 2.0', 'Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V', 'Honda CR-V'], specs: { height: 65, diameter: 66, thread: 'M20x1.5' }, equivalents: ['FRAM PH6017A', 'BOSCH 0986AF0063', 'TECFIL PSL130'] },
    'W712/52': { brand: 'MANN-FILTER', applications: ['Fiat Fire 1.0', 'Fiat Fire 1.4', 'Fiat E.torQ', 'Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo', 'Fiat Cronos'], specs: { height: 79, diameter: 76, thread: 'M20x1.5' }, equivalents: ['FRAM PH5949', 'TECFIL PSL141'] },
    'W712/83': { brand: 'MANN-FILTER', applications: ['GM Ecotec', 'GM SPE/4', 'Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin', 'Chevrolet Cruze', 'Chevrolet Tracker'], specs: { height: 85, diameter: 76, thread: 'M20x1.5' }, equivalents: ['FRAM PH10575', 'TECFIL PSL550', 'BOSCH F026407106'] },
    'HU7008z': { brand: 'MANN-FILTER', applications: ['BMW N20', 'BMW N26', 'BMW B48', 'BMW 320i', 'BMW 328i', 'BMW X1', 'BMW X3'], specs: { type: 'element', height: 104, diameter: 65 }, equivalents: ['BOSCH F026407123', 'MAHLE OX404D'] },
    'HU6004x': { brand: 'MANN-FILTER', applications: ['Mercedes M270', 'Mercedes M274', 'Mercedes A200', 'Mercedes CLA200', 'Mercedes GLA200', 'Mercedes C180', 'Mercedes C200'], specs: { type: 'element', height: 99, diameter: 64 }, equivalents: ['BOSCH F026407125', 'MAHLE OX389D'] },
    'W920/21': { brand: 'MANN-FILTER', applications: ['Renault K4M', 'Renault K7M', 'Renault Sandero', 'Renault Logan', 'Renault Duster', 'Renault Captur', 'Renault Kwid'], specs: { height: 93, diameter: 93, thread: 'M20x1.5' }, equivalents: ['FRAM PH5796', 'TECFIL PSL640'] },
    'W68/3': { brand: 'MANN-FILTER', applications: ['Toyota 1ZZ', 'Toyota 2ZR', 'Toyota Corolla', 'Toyota Yaris', 'Toyota Etios', 'Toyota RAV4', 'Toyota Hilux 2.7'], specs: { height: 66, diameter: 68, thread: 'M20x1.5' }, equivalents: ['FRAM PH4967', 'TECFIL PSL135', 'BOSCH F026407089'] },
    'W719/30': { brand: 'MANN-FILTER', applications: ['Ford Sigma', 'Ford Duratec', 'Ford Ka', 'Ford Fiesta', 'Ford EcoSport', 'Ford Focus', 'Ford Fusion'], specs: { height: 76, diameter: 76, thread: 'M20x1.5' }, equivalents: ['FRAM PH3614', 'TECFIL PSL145'] },
    'W940/25': { brand: 'MANN-FILTER', applications: ['Hyundai Gamma', 'Hyundai Nu', 'Hyundai HB20', 'Hyundai Creta', 'Hyundai Tucson', 'Kia Cerato', 'Kia Sportage'], specs: { height: 93, diameter: 93, thread: 'M20x1.5' }, equivalents: ['FRAM PH6811', 'TECFIL PSL550'] },

    // TECFIL (Brasil)
    'PSL141': { brand: 'TECFIL', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo', 'Fiat Cronos', 'Fiat Toro 1.8'], specs: { height: 79, diameter: 76, thread: 'M20x1.5' }, equivalents: ['MANN W712/52', 'FRAM PH5949'] },
    'PSL315': { brand: 'TECFIL', applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus', 'VW Saveiro', 'VW Up'], specs: { height: 79, diameter: 76, thread: 'M20x1.5' }, equivalents: ['MANN W712/95', 'FRAM PH6811'] },
    'PSL550': { brand: 'TECFIL', applications: ['GM Onix', 'GM Prisma', 'GM Cobalt', 'GM Spin', 'GM Cruze', 'GM Tracker', 'GM S10 2.4', 'GM Trailblazer 2.4'], specs: { height: 85, diameter: 76, thread: 'M20x1.5' }, equivalents: ['MANN W712/83', 'FRAM PH10575'] },
    'PSL130': { brand: 'TECFIL', applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V', 'Honda CR-V', 'Honda Accord'], specs: { height: 65, diameter: 66, thread: 'M20x1.5' }, equivalents: ['MANN W610/3', 'FRAM PH6017A'] },
    'PSL135': { brand: 'TECFIL', applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios', 'Toyota RAV4', 'Toyota Hilux 2.7', 'Toyota SW4 2.7'], specs: { height: 66, diameter: 68, thread: 'M20x1.5' }, equivalents: ['MANN W68/3', 'FRAM PH4967'] },
    'PSL640': { brand: 'TECFIL', applications: ['Renault Sandero', 'Renault Logan', 'Renault Duster', 'Renault Captur', 'Renault Kwid', 'Renault Oroch'], specs: { height: 93, diameter: 93, thread: 'M20x1.5' }, equivalents: ['MANN W920/21', 'FRAM PH5796'] },
    'PSL145': { brand: 'TECFIL', applications: ['Ford Ka', 'Ford Fiesta', 'Ford EcoSport', 'Ford Focus', 'Ford Fusion', 'Ford Ranger 2.3'], specs: { height: 76, diameter: 76, thread: 'M20x1.5' }, equivalents: ['MANN W719/30', 'FRAM PH3614'] },
    'PSD450': { brand: 'TECFIL', applications: ['Mitsubishi L200 Triton', 'Mitsubishi Pajero', 'Mitsubishi ASX', 'Mitsubishi Outlander'], specs: { height: 100, diameter: 80, thread: 'M20x1.5' }, equivalents: ['MANN W940/44', 'FRAM PH4386'] },
    'PSL950': { brand: 'TECFIL', applications: ['Jeep Renegade', 'Jeep Compass', 'Fiat Toro 2.0', 'Fiat 500X'], specs: { height: 85, diameter: 76, thread: 'M20x1.5' }, equivalents: ['MANN W712/94', 'FRAM PH11462'] },
    
    // MOTOS - HIFLOFILTRO
    'HF204': { brand: 'HIFLOFILTRO', applications: ['Honda CB300', 'Honda CB500', 'Honda CBR500', 'Honda NC750', 'Honda CB650', 'Honda CBR650', 'Kawasaki Ninja 300', 'Kawasaki Z300', 'Kawasaki Ninja 400', 'Kawasaki Z400', 'Yamaha MT-03', 'Yamaha YZF-R3', 'Triumph Street Triple'], specs: { height: 68, diameter: 65, thread: 'M20x1.5' }, equivalents: ['K&N KN-204', 'FRAM PH6018'] },
    'HF303': { brand: 'HIFLOFILTRO', applications: ['Honda CBR600', 'Honda CBR1000', 'Honda CB1000R', 'Honda VFR800', 'Kawasaki ZX-6R', 'Kawasaki ZX-10R', 'Kawasaki Z900', 'Kawasaki Z1000', 'Yamaha YZF-R1', 'Yamaha YZF-R6', 'Yamaha MT-09', 'Yamaha MT-10'], specs: { height: 80, diameter: 65, thread: 'M20x1.5' }, equivalents: ['K&N KN-303', 'FRAM PH6017'] },
    'HF138': { brand: 'HIFLOFILTRO', applications: ['Suzuki GSX-R600', 'Suzuki GSX-R750', 'Suzuki GSX-R1000', 'Suzuki V-Strom 650', 'Suzuki V-Strom 1000', 'Suzuki GSX-S750', 'Suzuki GSX-S1000', 'Suzuki Hayabusa'], specs: { height: 80, diameter: 68, thread: 'M20x1.5' }, equivalents: ['K&N KN-138'] },
    'HF160': { brand: 'HIFLOFILTRO', applications: ['BMW S1000RR', 'BMW S1000R', 'BMW S1000XR', 'BMW F800GS', 'BMW F800R', 'BMW F750GS', 'BMW F850GS', 'BMW G310R', 'BMW G310GS'], specs: { height: 70, diameter: 52, thread: 'M20x1.5' }, equivalents: ['K&N KN-160', 'MAHLE OC619'] },
    'HF153': { brand: 'HIFLOFILTRO', applications: ['Ducati Monster', 'Ducati Multistrada', 'Ducati Panigale', 'Ducati Scrambler', 'Ducati Diavel', 'Ducati Hypermotard'], specs: { height: 100, diameter: 53, thread: 'M20x1.5' }, equivalents: ['K&N KN-153'] },
    'HF112': { brand: 'HIFLOFILTRO', applications: ['Honda CG125', 'Honda CG150', 'Honda CG160', 'Honda Bros', 'Honda XRE190', 'Honda Biz', 'Honda Pop', 'Kawasaki KLX', 'Honda NXR'], specs: { height: 38, diameter: 50, thread: 'internal' }, equivalents: ['K&N KN-112', 'VEDAMOTORS VF112'] },
    'HF401': { brand: 'HIFLOFILTRO', applications: ['Yamaha Fazer 250', 'Yamaha Lander 250', 'Yamaha Crosser', 'Yamaha Factor', 'Yamaha YBR'], specs: { height: 54, diameter: 65, thread: 'M20x1.5' }, equivalents: ['K&N KN-401'] },
    'HF652': { brand: 'HIFLOFILTRO', applications: ['KTM Duke 200', 'KTM Duke 390', 'KTM RC 390', 'KTM Adventure 390', 'Husqvarna Svartpilen', 'Husqvarna Vitpilen'], specs: { height: 38, diameter: 41, thread: 'internal' }, equivalents: ['K&N KN-652'] },
    'HF147': { brand: 'HIFLOFILTRO', applications: ['Yamaha MT-07', 'Yamaha XSR700', 'Yamaha Tenere 700', 'Yamaha Tracer 700'], specs: { height: 54, diameter: 65, thread: 'M20x1.5' }, equivalents: ['K&N KN-147'] },
    
    // DIESEL - Caminhões e Pickups
    'W950/26': { brand: 'MANN-FILTER', applications: ['VW Constellation', 'VW Delivery', 'MAN TGX', 'Scania P-Series', 'Scania R-Series'], specs: { height: 170, diameter: 93, thread: 'M27x2' }, equivalents: ['TECFIL PSD950', 'FRAM PH8A'] },
    'W940/44': { brand: 'MANN-FILTER', applications: ['Toyota Hilux Diesel', 'Toyota SW4 Diesel', 'Mitsubishi L200', 'Mitsubishi Pajero Diesel'], specs: { height: 142, diameter: 93, thread: 'M26x1.5' }, equivalents: ['TECFIL PSD450', 'FRAM PH4386'] },
    'W719/45': { brand: 'MANN-FILTER', applications: ['Ford Ranger Diesel', 'Ford Transit', 'Land Rover Defender', 'Land Rover Discovery'], specs: { height: 142, diameter: 76, thread: 'M22x1.5' }, equivalents: ['TECFIL PSD145', 'FRAM PH9566'] },
  },


  // ============================================================================
  // FILTROS DE AR
  // ============================================================================
  air_filters: {
    // Carros
    'C27192/1': { brand: 'MANN-FILTER', applications: ['VW Gol G5', 'VW Gol G6', 'VW Gol G7', 'VW Voyage', 'VW Fox', 'VW Saveiro', 'VW Up'], specs: { length: 271, width: 192, height: 58 }, equivalents: ['TECFIL ARL6079', 'FRAM CA10242'] },
    'C2433/2': { brand: 'MANN-FILTER', applications: ['Honda Civic', 'Honda CR-V', 'Honda Accord'], specs: { length: 243, width: 175, height: 40 }, equivalents: ['FRAM CA10165', 'WIX 46902', 'TECFIL ARL2433'] },
    'C30005': { brand: 'MANN-FILTER', applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus', 'VW Taos', 'Audi A3', 'Audi Q3'], specs: { length: 300, width: 200, height: 50 }, equivalents: ['TECFIL ARL3000', 'FRAM CA11945'] },
    'C25117': { brand: 'MANN-FILTER', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo', 'Fiat Cronos'], specs: { length: 251, width: 170, height: 58 }, equivalents: ['TECFIL ARL5117', 'FRAM CA9482'] },
    'C27003': { brand: 'MANN-FILTER', applications: ['GM Onix', 'GM Prisma', 'GM Cobalt', 'GM Spin', 'GM Tracker'], specs: { length: 270, width: 185, height: 42 }, equivalents: ['TECFIL ARL7003', 'FRAM CA11476'] },
    'C26009': { brand: 'MANN-FILTER', applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios'], specs: { length: 260, width: 168, height: 50 }, equivalents: ['TECFIL ARL6009', 'FRAM CA10190'] },
    'C2201': { brand: 'MANN-FILTER', applications: ['Renault Sandero', 'Renault Logan', 'Renault Duster', 'Renault Captur'], specs: { length: 220, width: 165, height: 70 }, equivalents: ['TECFIL ARL2201', 'FRAM CA10249'] },
    'C16005': { brand: 'MANN-FILTER', applications: ['Ford Ka', 'Ford Fiesta', 'Ford EcoSport'], specs: { length: 160, width: 140, height: 58 }, equivalents: ['TECFIL ARL6005', 'FRAM CA10677'] },
    'C26013': { brand: 'MANN-FILTER', applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio', 'Kia Stonic'], specs: { length: 260, width: 175, height: 45 }, equivalents: ['TECFIL ARL6013', 'FRAM CA11258'] },
    'C35003': { brand: 'MANN-FILTER', applications: ['Jeep Renegade', 'Jeep Compass', 'Fiat Toro'], specs: { length: 350, width: 185, height: 58 }, equivalents: ['TECFIL ARL5003', 'FRAM CA11667'] },
    
    // TECFIL
    'ARL6079': { brand: 'TECFIL', applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Polo', 'VW Saveiro'], specs: { length: 271, width: 192, height: 58 }, equivalents: ['MANN C27192/1'] },
    'ARL5117': { brand: 'TECFIL', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo'], specs: { length: 251, width: 170, height: 58 }, equivalents: ['MANN C25117'] },
    'ARL7003': { brand: 'TECFIL', applications: ['GM Onix', 'GM Prisma', 'GM Cobalt', 'GM Spin'], specs: { length: 270, width: 185, height: 42 }, equivalents: ['MANN C27003'] },
    
    // Motos
    'HFA1602': { brand: 'HIFLOFILTRO', applications: ['Honda CB600F Hornet', 'Honda CBF600', 'Honda CB650F'], specs: { type: 'panel' }, equivalents: ['K&N HA-6003'] },
    'HFA2608': { brand: 'HIFLOFILTRO', applications: ['Kawasaki Ninja 650', 'Kawasaki Z650', 'Kawasaki Versys 650', 'Kawasaki Ninja 400', 'Kawasaki Z400'], specs: { type: 'panel' }, equivalents: ['K&N KA-6512'] },
    'HFA1715': { brand: 'HIFLOFILTRO', applications: ['Honda NC750', 'Honda Integra', 'Honda X-ADV'], specs: { type: 'panel' }, equivalents: ['K&N HA-7015'] },
    'HFA4505': { brand: 'HIFLOFILTRO', applications: ['Yamaha T-Max 500', 'Yamaha T-Max 530', 'Yamaha T-Max 560'], specs: { type: 'panel' }, equivalents: ['K&N YA-5008'] },
    'HFA1620': { brand: 'HIFLOFILTRO', applications: ['Honda CBR600RR', 'Honda CBR1000RR'], specs: { type: 'panel' }, equivalents: ['K&N HA-6007'] },
    'HFA2915': { brand: 'HIFLOFILTRO', applications: ['Kawasaki ZX-6R', 'Kawasaki ZX-10R', 'Kawasaki Z900', 'Kawasaki Z1000'], specs: { type: 'panel' }, equivalents: ['K&N KA-6009'] },
    'HFA4510': { brand: 'HIFLOFILTRO', applications: ['Yamaha YZF-R1', 'Yamaha YZF-R6', 'Yamaha MT-10'], specs: { type: 'panel' }, equivalents: ['K&N YA-1009'] },
    'HFA7603': { brand: 'HIFLOFILTRO', applications: ['BMW F800GS', 'BMW F800R', 'BMW F700GS', 'BMW F650GS'], specs: { type: 'panel' }, equivalents: ['K&N BM-8006'] },
    'HFA6505': { brand: 'HIFLOFILTRO', applications: ['Triumph Street Triple', 'Triumph Speed Triple', 'Triumph Tiger'], specs: { type: 'panel' }, equivalents: ['K&N TB-1011'] },
    'HFA1112': { brand: 'HIFLOFILTRO', applications: ['Honda CG125', 'Honda CG150', 'Honda CG160', 'Honda Bros', 'Honda XRE190', 'Honda Biz'], specs: { type: 'element' }, equivalents: ['VEDAMOTORS VA112'] },
    'HFA4301': { brand: 'HIFLOFILTRO', applications: ['Yamaha Fazer 250', 'Yamaha Lander 250', 'Yamaha Crosser', 'Yamaha Factor'], specs: { type: 'element' }, equivalents: ['K&N YA-2504'] },
  },


  // ============================================================================
  // PASTILHAS DE FREIO
  // ============================================================================
  brake_pads: {
    // COBREQ - Carros
    'N-1108': { brand: 'COBREQ', applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Polo', 'VW Saveiro', 'VW Up'], position: 'front', specs: { height: 54, width: 146, thickness: 19 }, equivalents: ['FRAS-LE PD/580', 'BOSCH BP1108'] },
    'N-1109': { brand: 'COBREQ', applications: ['VW Gol', 'VW Voyage', 'VW Fox'], position: 'rear', specs: { height: 42, width: 95, thickness: 14 }, equivalents: ['FRAS-LE PD/581'] },
    'N-1323': { brand: 'COBREQ', applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V'], position: 'front', specs: { height: 58, width: 131, thickness: 17 }, equivalents: ['FRAS-LE PD/1323', 'BOSCH BP1323'] },
    'N-1324': { brand: 'COBREQ', applications: ['Honda Civic', 'Honda Fit', 'Honda City'], position: 'rear', specs: { height: 45, width: 100, thickness: 14 }, equivalents: ['FRAS-LE PD/1324'] },
    'N-1250': { brand: 'COBREQ', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo'], position: 'front', specs: { height: 52, width: 119, thickness: 17 }, equivalents: ['FRAS-LE PD/1250', 'BOSCH BP1250'] },
    'N-1251': { brand: 'COBREQ', applications: ['Fiat Palio', 'Fiat Siena', 'Fiat Strada'], position: 'rear', specs: { height: 40, width: 88, thickness: 14 }, equivalents: ['FRAS-LE PD/1251'] },
    'N-1380': { brand: 'COBREQ', applications: ['GM Onix', 'GM Prisma', 'GM Cobalt', 'GM Spin', 'GM Tracker'], position: 'front', specs: { height: 55, width: 140, thickness: 18 }, equivalents: ['FRAS-LE PD/1380', 'BOSCH BP1380'] },
    'N-1381': { brand: 'COBREQ', applications: ['GM Onix', 'GM Prisma', 'GM Cobalt', 'GM Spin'], position: 'rear', specs: { height: 43, width: 98, thickness: 14 }, equivalents: ['FRAS-LE PD/1381'] },
    'N-1420': { brand: 'COBREQ', applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios'], position: 'front', specs: { height: 56, width: 138, thickness: 17 }, equivalents: ['FRAS-LE PD/1420', 'BOSCH BP1420'] },
    'N-1421': { brand: 'COBREQ', applications: ['Toyota Corolla', 'Toyota Yaris'], position: 'rear', specs: { height: 44, width: 96, thickness: 14 }, equivalents: ['FRAS-LE PD/1421'] },
    'N-1500': { brand: 'COBREQ', applications: ['Renault Sandero', 'Renault Logan', 'Renault Duster', 'Renault Captur'], position: 'front', specs: { height: 54, width: 130, thickness: 18 }, equivalents: ['FRAS-LE PD/1500'] },
    'N-1550': { brand: 'COBREQ', applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio'], position: 'front', specs: { height: 55, width: 135, thickness: 17 }, equivalents: ['FRAS-LE PD/1550'] },
    'N-1600': { brand: 'COBREQ', applications: ['Jeep Renegade', 'Jeep Compass', 'Fiat Toro'], position: 'front', specs: { height: 58, width: 150, thickness: 18 }, equivalents: ['FRAS-LE PD/1600'] },
    'N-1601': { brand: 'COBREQ', applications: ['Jeep Renegade', 'Jeep Compass', 'Fiat Toro'], position: 'rear', specs: { height: 46, width: 105, thickness: 15 }, equivalents: ['FRAS-LE PD/1601'] },
    
    // Motos - EBC
    'FA142': { brand: 'EBC', applications: ['Honda CB300', 'Honda XRE300', 'Honda CB500', 'Honda CBR500', 'Honda NC750'], position: 'front', specs: { organic: true }, equivalents: ['VESRAH VD-156', 'COBREQ N-946'] },
    'FA174': { brand: 'EBC', applications: ['Honda CBR600', 'Honda CBR1000', 'Honda CB1000R', 'Honda VFR800'], position: 'front', specs: { sintered: true }, equivalents: ['VESRAH VD-355'] },
    'FA229': { brand: 'EBC', applications: ['Yamaha YZF-R3', 'Yamaha MT-03', 'Yamaha XJ6', 'Yamaha MT-07'], position: 'front', specs: { organic: true }, equivalents: ['VESRAH VD-277'] },
    'FA254': { brand: 'EBC', applications: ['Kawasaki Ninja 300', 'Kawasaki Z300', 'Kawasaki Ninja 400', 'Kawasaki Z400', 'Kawasaki Versys 650'], position: 'front', specs: { organic: true }, equivalents: ['VESRAH VD-354'] },
    'FA379': { brand: 'EBC', applications: ['Suzuki GSX-R600', 'Suzuki GSX-R750', 'Suzuki GSX-R1000', 'Suzuki V-Strom'], position: 'front', specs: { sintered: true }, equivalents: ['VESRAH VD-379'] },
    'FA447': { brand: 'EBC', applications: ['BMW S1000RR', 'BMW S1000R', 'BMW S1000XR'], position: 'front', specs: { sintered: true }, equivalents: ['VESRAH VD-447'] },
    'FA322': { brand: 'EBC', applications: ['Ducati Monster', 'Ducati Multistrada', 'Ducati Panigale', 'Ducati Scrambler'], position: 'front', specs: { sintered: true }, equivalents: ['VESRAH VD-322'] },
    'FA101': { brand: 'EBC', applications: ['Honda CG125', 'Honda CG150', 'Honda CG160', 'Honda Bros', 'Honda Biz'], position: 'front', specs: { organic: true }, equivalents: ['COBREQ N-901'] },
    'FA275': { brand: 'EBC', applications: ['Yamaha Fazer 250', 'Yamaha Lander 250', 'Yamaha Crosser', 'Yamaha Factor'], position: 'front', specs: { organic: true }, equivalents: ['COBREQ N-975'] },
    'FA181': { brand: 'EBC', applications: ['KTM Duke 200', 'KTM Duke 390', 'KTM RC 390', 'KTM Adventure 390'], position: 'front', specs: { sintered: true }, equivalents: ['VESRAH VD-181'] },
  },


  // ============================================================================
  // VELAS DE IGNIÇÃO
  // ============================================================================
  spark_plugs: {
    // NGK - Carros
    'BKR6E': { brand: 'NGK', applications: ['VW EA111 1.0', 'VW EA111 1.6', 'Fiat Fire 1.0', 'Fiat Fire 1.4', 'VW Gol', 'VW Voyage', 'VW Fox', 'Fiat Uno', 'Fiat Palio'], specs: { gap: 0.8, thread: 'M14x1.25', reach: 19 }, equivalents: ['BOSCH FR7DC+', 'DENSO K20PR-U'] },
    'ILKAR7B11': { brand: 'NGK', applications: ['VW EA211 1.0 TSI', 'VW EA211 1.4 TSI', 'Audi 1.4 TFSI', 'VW Polo TSI', 'VW Virtus TSI', 'VW T-Cross TSI', 'VW Nivus'], specs: { type: 'iridium', gap: 1.1, thread: 'M12x1.25' }, equivalents: ['BOSCH FR6KI332S', 'DENSO IK20TT'] },
    'IZFR6K11': { brand: 'NGK', applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V', 'Honda CR-V'], specs: { type: 'iridium', gap: 1.1, thread: 'M14x1.25' }, equivalents: ['DENSO SK20R11'] },
    'BKR5EGP': { brand: 'NGK', applications: ['GM Onix', 'GM Prisma', 'GM Cobalt', 'GM Spin', 'GM Cruze', 'GM Tracker'], specs: { type: 'platinum', gap: 0.9, thread: 'M14x1.25' }, equivalents: ['BOSCH FR7KPP33+', 'DENSO PK20PR-P8'] },
    'BKR6EIX': { brand: 'NGK', applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios', 'Toyota RAV4'], specs: { type: 'iridium', gap: 1.1, thread: 'M14x1.25' }, equivalents: ['DENSO SK20R11', 'BOSCH FR6KI332S'] },
    'BKR5E': { brand: 'NGK', applications: ['Renault Sandero', 'Renault Logan', 'Renault Duster', 'Renault Captur', 'Renault Kwid'], specs: { gap: 0.9, thread: 'M14x1.25', reach: 19 }, equivalents: ['BOSCH FR7DC', 'DENSO K20PR-U'] },
    'BKR6EK': { brand: 'NGK', applications: ['Ford Ka', 'Ford Fiesta', 'Ford EcoSport', 'Ford Focus'], specs: { gap: 0.8, thread: 'M14x1.25', reach: 19 }, equivalents: ['BOSCH FR7KPP33', 'DENSO K20PR-U'] },
    'BKR5EIX': { brand: 'NGK', applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio', 'Kia Cerato'], specs: { type: 'iridium', gap: 1.0, thread: 'M14x1.25' }, equivalents: ['DENSO IK20', 'BOSCH FR6KI332S'] },
    'SILKAR7B11': { brand: 'NGK', applications: ['Jeep Renegade', 'Jeep Compass', 'Fiat Toro', 'Fiat 500X'], specs: { type: 'iridium', gap: 1.1, thread: 'M12x1.25' }, equivalents: ['BOSCH FR6KI332S'] },
    
    // NGK - Motos
    'CPR8EA-9': { brand: 'NGK', applications: ['Honda CB300', 'Honda XRE300', 'Honda CG160', 'Honda Bros', 'Honda XRE190'], specs: { gap: 0.9, thread: 'M10x1.0' }, equivalents: ['DENSO U24EPR9'] },
    'CR9EK': { brand: 'NGK', applications: ['Honda CBR600', 'Honda CBR1000', 'Kawasaki Ninja ZX-6R', 'Kawasaki ZX-10R'], specs: { gap: 0.9, thread: 'M10x1.0' }, equivalents: ['DENSO IU27'] },
    'CR8E': { brand: 'NGK', applications: ['Yamaha YZF-R3', 'Yamaha MT-03', 'Yamaha Fazer 250', 'Yamaha Lander 250', 'Yamaha Crosser'], specs: { gap: 0.8, thread: 'M10x1.0' }, equivalents: ['DENSO U24ESR-N'] },
    'CR9EIA-9': { brand: 'NGK', applications: ['Kawasaki Ninja 300', 'Kawasaki Z300', 'Kawasaki Ninja 400', 'Kawasaki Z400', 'Kawasaki Versys 650'], specs: { type: 'iridium', gap: 0.9, thread: 'M10x1.0' }, equivalents: ['DENSO IU27D'] },
    'CR9EIX': { brand: 'NGK', applications: ['Suzuki GSX-R600', 'Suzuki GSX-R750', 'Suzuki GSX-R1000', 'Suzuki V-Strom'], specs: { type: 'iridium', gap: 0.9, thread: 'M10x1.0' }, equivalents: ['DENSO IU27'] },
    'LMAR8AI-8': { brand: 'NGK', applications: ['BMW S1000RR', 'BMW S1000R', 'BMW S1000XR'], specs: { type: 'iridium', gap: 0.8, thread: 'M10x1.0' }, equivalents: ['DENSO IU27D'] },
    'MAR10A-J': { brand: 'NGK', applications: ['Ducati Monster', 'Ducati Multistrada', 'Ducati Panigale', 'Ducati Scrambler'], specs: { type: 'iridium', gap: 0.9, thread: 'M10x1.0' }, equivalents: ['DENSO IU27D'] },
    'C7HSA': { brand: 'NGK', applications: ['Honda CG125', 'Honda CG150', 'Honda Biz', 'Honda Pop', 'Yamaha Factor', 'Yamaha YBR'], specs: { gap: 0.7, thread: 'M10x1.0' }, equivalents: ['DENSO U22FS-U'] },
    'LKAR8AI-9': { brand: 'NGK', applications: ['KTM Duke 200', 'KTM Duke 390', 'KTM RC 390', 'KTM Adventure 390'], specs: { type: 'iridium', gap: 0.9, thread: 'M10x1.0' }, equivalents: ['DENSO IU27D'] },
  },


  // ============================================================================
  // ÓLEOS DE MOTOR
  // ============================================================================
  engine_oils: {
    '5W30_SYNTHETIC': { applications: ['VW EA211', 'VW EA111', 'GM Ecotec', 'GM SPE/4', 'Ford EcoBoost', 'Ford Sigma', 'Honda i-VTEC', 'Fiat Fire', 'Fiat E.torQ', 'Renault K4M', 'Hyundai Gamma', 'Toyota 2ZR', 'VW Gol', 'VW Polo', 'GM Onix', 'Honda Civic', 'Fiat Argo', 'Toyota Corolla'], specs: { viscosity: '5W-30', type: 'synthetic', api: 'SN Plus', acea: 'A3/B4' }, brands: ['Mobil 1', 'Castrol Edge', 'Shell Helix Ultra', 'Petronas Syntium', 'Motul 8100', 'Liqui Moly'] },
    '5W40_SYNTHETIC': { applications: ['VW EA888', 'BMW N20', 'BMW B48', 'Audi TFSI', 'Mercedes M270', 'Mercedes M274', 'VW Golf GTI', 'VW Jetta GLI', 'BMW 320i', 'Mercedes C200', 'Audi A3', 'Audi Q3'], specs: { viscosity: '5W-40', type: 'synthetic', api: 'SN', acea: 'A3/B4' }, brands: ['Mobil 1', 'Castrol Edge', 'Shell Helix Ultra', 'Motul 8100 X-cess'] },
    '0W20_SYNTHETIC': { applications: ['Toyota Dynamic Force', 'Honda Earth Dreams', 'Hyundai Smartstream', 'Toyota Corolla 2020+', 'Honda Civic 2017+', 'Hyundai HB20 2020+', 'Toyota RAV4', 'Honda CR-V'], specs: { viscosity: '0W-20', type: 'synthetic', api: 'SP', ilsac: 'GF-6A' }, brands: ['Mobil 1', 'Castrol Edge', 'Toyota Genuine', 'Honda Genuine'] },
    '5W20_SYNTHETIC': { applications: ['Ford EcoBoost', 'Ford Fusion', 'Ford Focus', 'Ford EcoSport', 'Ford Ka', 'Ford Ranger 2.5'], specs: { viscosity: '5W-20', type: 'synthetic', api: 'SN Plus', ilsac: 'GF-5' }, brands: ['Motorcraft', 'Mobil 1', 'Castrol Edge'] },
    '0W40_SYNTHETIC': { applications: ['BMW M', 'Mercedes AMG', 'Porsche', 'BMW M3', 'BMW M4', 'Mercedes C63 AMG', 'Porsche 911'], specs: { viscosity: '0W-40', type: 'synthetic', api: 'SN', acea: 'A3/B4' }, brands: ['Mobil 1', 'Castrol Edge Supercar', 'Shell Helix Ultra Racing'] },
    '15W40_DIESEL': { applications: ['Toyota Hilux Diesel', 'Ford Ranger Diesel', 'Chevrolet S10 Diesel', 'Mitsubishi L200', 'VW Amarok', 'Nissan Frontier'], specs: { viscosity: '15W-40', type: 'mineral', api: 'CK-4', acea: 'E9' }, brands: ['Shell Rimula', 'Mobil Delvac', 'Castrol Vecton', 'Petronas Urania'] },
    '5W30_DIESEL': { applications: ['Jeep Renegade Diesel', 'Jeep Compass Diesel', 'Fiat Toro Diesel', 'BMW X1 Diesel', 'Mercedes GLA Diesel'], specs: { viscosity: '5W-30', type: 'synthetic', api: 'CK-4', acea: 'C3' }, brands: ['Shell Helix Ultra Diesel', 'Mobil 1 ESP', 'Castrol Edge Diesel'] },
    
    // Motos
    '10W40_MOTO': { applications: ['Honda CB300', 'Honda CB500', 'Honda CBR500', 'Honda NC750', 'Yamaha Fazer', 'Yamaha MT-03', 'Yamaha YZF-R3', 'Suzuki GSX', 'Kawasaki Ninja 300', 'Kawasaki Z300', 'Kawasaki Ninja 400'], specs: { viscosity: '10W-40', type: 'synthetic', jaso: 'MA2' }, brands: ['Motul 5100', 'Castrol Power1', 'Shell Advance', 'Mobil 1 Racing 4T', 'Yamalube'] },
    '15W50_MOTO': { applications: ['BMW GS', 'BMW S1000RR', 'Harley-Davidson', 'Ducati', 'KTM Adventure', 'Triumph', 'BMW F800GS', 'BMW R1200GS', 'Ducati Monster', 'Ducati Multistrada'], specs: { viscosity: '15W-50', type: 'synthetic', jaso: 'MA2' }, brands: ['Motul 7100', 'Castrol Power1 Racing', 'Shell Advance Ultra', 'BMW Motorrad'] },
    '20W50_MOTO': { applications: ['Honda CG125', 'Honda CG150', 'Honda CG160', 'Honda Bros', 'Honda Biz', 'Yamaha Factor', 'Yamaha YBR', 'Suzuki Yes', 'Dafra'], specs: { viscosity: '20W-50', type: 'mineral', jaso: 'MA' }, brands: ['Motul 3000', 'Castrol Activ', 'Shell Advance AX5', 'Mobil Super Moto'] },
    '10W30_MOTO': { applications: ['Honda CBR600', 'Honda CBR1000', 'Yamaha YZF-R1', 'Yamaha YZF-R6', 'Kawasaki ZX-6R', 'Kawasaki ZX-10R', 'Suzuki GSX-R'], specs: { viscosity: '10W-30', type: 'synthetic', jaso: 'MA2' }, brands: ['Motul 300V', 'Castrol Power1 Racing', 'Shell Advance Racing'] },
  },


  // ============================================================================
  // KIT RELAÇÃO (MOTOS)
  // ============================================================================
  chain_kits: {
    'CB300_KIT': { brand: 'VORTEX', applications: ['Honda CB300', 'Honda CB300R', 'Honda CB300F'], specs: { chain: '520', links: 108, sprocket: 38, pinion: 14 }, equivalents: ['DID 520VX3', 'RK 520XSO', 'REGINA 520ZRP'] },
    'NINJA300_KIT': { brand: 'VORTEX', applications: ['Kawasaki Ninja 300', 'Kawasaki Z300'], specs: { chain: '520', links: 112, sprocket: 42, pinion: 14 }, equivalents: ['DID 520VX3', 'RK 520XSO'] },
    'MT03_KIT': { brand: 'VORTEX', applications: ['Yamaha MT-03', 'Yamaha YZF-R3'], specs: { chain: '520', links: 112, sprocket: 43, pinion: 14 }, equivalents: ['DID 520VX3', 'RK 520XSO'] },
    'CB500_KIT': { brand: 'VORTEX', applications: ['Honda CB500F', 'Honda CB500X', 'Honda CBR500R'], specs: { chain: '520', links: 112, sprocket: 41, pinion: 15 }, equivalents: ['DID 520VX3', 'RK 520XSO'] },
    'NINJA400_KIT': { brand: 'VORTEX', applications: ['Kawasaki Ninja 400', 'Kawasaki Z400'], specs: { chain: '520', links: 112, sprocket: 42, pinion: 14 }, equivalents: ['DID 520VX3', 'RK 520XSO'] },
    'NC750_KIT': { brand: 'VORTEX', applications: ['Honda NC750X', 'Honda NC750S', 'Honda Integra'], specs: { chain: '520', links: 114, sprocket: 40, pinion: 17 }, equivalents: ['DID 520VX3', 'RK 520XSO'] },
    'VERSYS650_KIT': { brand: 'VORTEX', applications: ['Kawasaki Versys 650', 'Kawasaki Ninja 650', 'Kawasaki Z650'], specs: { chain: '520', links: 114, sprocket: 46, pinion: 15 }, equivalents: ['DID 520VX3', 'RK 520XSO'] },
    'MT07_KIT': { brand: 'VORTEX', applications: ['Yamaha MT-07', 'Yamaha XSR700', 'Yamaha Tenere 700'], specs: { chain: '525', links: 112, sprocket: 43, pinion: 16 }, equivalents: ['DID 525VX3', 'RK 525XSO'] },
    'Z900_KIT': { brand: 'VORTEX', applications: ['Kawasaki Z900', 'Kawasaki Z900RS'], specs: { chain: '525', links: 114, sprocket: 44, pinion: 15 }, equivalents: ['DID 525VX3', 'RK 525XSO'] },
    'MT09_KIT': { brand: 'VORTEX', applications: ['Yamaha MT-09', 'Yamaha XSR900', 'Yamaha Tracer 900'], specs: { chain: '525', links: 114, sprocket: 45, pinion: 16 }, equivalents: ['DID 525VX3', 'RK 525XSO'] },
    'CBR600_KIT': { brand: 'VORTEX', applications: ['Honda CBR600RR', 'Honda CB650F', 'Honda CBR650F'], specs: { chain: '525', links: 112, sprocket: 42, pinion: 16 }, equivalents: ['DID 525VX3', 'RK 525XSO'] },
    'GSXR600_KIT': { brand: 'VORTEX', applications: ['Suzuki GSX-R600', 'Suzuki GSX-R750', 'Suzuki GSX-S750'], specs: { chain: '525', links: 114, sprocket: 43, pinion: 17 }, equivalents: ['DID 525VX3', 'RK 525XSO'] },
    'ZX6R_KIT': { brand: 'VORTEX', applications: ['Kawasaki ZX-6R', 'Kawasaki ZX-636'], specs: { chain: '520', links: 112, sprocket: 43, pinion: 16 }, equivalents: ['DID 520ERV7', 'RK 520GXW'] },
    'R1_KIT': { brand: 'VORTEX', applications: ['Yamaha YZF-R1', 'Yamaha YZF-R1M'], specs: { chain: '530', links: 120, sprocket: 47, pinion: 17 }, equivalents: ['DID 530ZVM-X', 'RK 530GXW'] },
    'CBR1000_KIT': { brand: 'VORTEX', applications: ['Honda CBR1000RR', 'Honda CBR1000RR-R'], specs: { chain: '525', links: 116, sprocket: 42, pinion: 16 }, equivalents: ['DID 525ZVM-X', 'RK 525GXW'] },
    'S1000RR_KIT': { brand: 'VORTEX', applications: ['BMW S1000RR', 'BMW S1000R', 'BMW S1000XR'], specs: { chain: '525', links: 118, sprocket: 45, pinion: 17 }, equivalents: ['DID 525ZVM-X', 'RK 525GXW'] },
    'PANIGALE_KIT': { brand: 'VORTEX', applications: ['Ducati Panigale V4', 'Ducati Panigale V2', 'Ducati Streetfighter V4'], specs: { chain: '525', links: 106, sprocket: 43, pinion: 15 }, equivalents: ['DID 525ZVM-X', 'RK 525GXW'] },
    'CG160_KIT': { brand: 'COFAP', applications: ['Honda CG160', 'Honda CG150', 'Honda Bros 160', 'Honda XRE190'], specs: { chain: '428', links: 118, sprocket: 44, pinion: 15 }, equivalents: ['DID 428HD', 'RK 428HSB'] },
    'FAZER250_KIT': { brand: 'COFAP', applications: ['Yamaha Fazer 250', 'Yamaha Lander 250', 'Yamaha Crosser 150'], specs: { chain: '428', links: 132, sprocket: 49, pinion: 14 }, equivalents: ['DID 428HD', 'RK 428HSB'] },
    'DUKE390_KIT': { brand: 'VORTEX', applications: ['KTM Duke 390', 'KTM RC 390', 'KTM Adventure 390'], specs: { chain: '520', links: 118, sprocket: 45, pinion: 15 }, equivalents: ['DID 520VX3', 'RK 520XSO'] },
  },


  // ============================================================================
  // CORREIAS DENTADAS / KIT CORREIA
  // ============================================================================
  timing_belts: {
    // VW
    'CT1028K1': { brand: 'CONTITECH', applications: ['VW EA111 1.0', 'VW EA111 1.6', 'VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro'], specs: { teeth: 137, width: 25.4 }, equivalents: ['GATES K015603XS', 'DAYCO KTBWP3390'] },
    'CT1139K1': { brand: 'CONTITECH', applications: ['VW EA211 1.0', 'VW EA211 1.4', 'VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus', 'VW Up'], specs: { teeth: 141, width: 22 }, equivalents: ['GATES K015678XS', 'DAYCO KTBWP9670'] },
    // Fiat
    'CT1105K1': { brand: 'CONTITECH', applications: ['Fiat Fire 1.0', 'Fiat Fire 1.4', 'Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo'], specs: { teeth: 129, width: 25.4 }, equivalents: ['GATES K015578XS', 'DAYCO KTBWP3210'] },
    'CT1168K1': { brand: 'CONTITECH', applications: ['Fiat E.torQ 1.6', 'Fiat E.torQ 1.8', 'Fiat Toro 1.8', 'Fiat Cronos 1.8', 'Jeep Renegade 1.8'], specs: { teeth: 145, width: 25.4 }, equivalents: ['GATES K015648XS', 'DAYCO KTBWP8890'] },
    // GM
    'CT1077K1': { brand: 'CONTITECH', applications: ['GM Ecotec 1.8', 'GM Ecotec 2.0', 'Chevrolet Astra', 'Chevrolet Vectra', 'Chevrolet Zafira'], specs: { teeth: 141, width: 25.4 }, equivalents: ['GATES K015499XS', 'DAYCO KTBWP2960'] },
    'CT1166K1': { brand: 'CONTITECH', applications: ['GM SPE/4 1.0', 'GM SPE/4 1.4', 'Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin'], specs: { teeth: 137, width: 22 }, equivalents: ['GATES K015646XS', 'DAYCO KTBWP8850'] },
    // Honda
    'CT1015K1': { brand: 'CONTITECH', applications: ['Honda 1.8 i-VTEC', 'Honda 2.0 i-VTEC', 'Honda Civic', 'Honda CR-V', 'Honda Accord'], specs: { teeth: 137, width: 25.4 }, equivalents: ['GATES K015427XS', 'DAYCO KTBWP2590'] },
    // Toyota
    'CT1089K1': { brand: 'CONTITECH', applications: ['Toyota 1ZZ', 'Toyota 2ZR', 'Toyota Corolla', 'Toyota Yaris', 'Toyota Etios'], specs: { teeth: 126, width: 22 }, equivalents: ['GATES K015523XS', 'DAYCO KTBWP3070'] },
    // Renault
    'CT1065K1': { brand: 'CONTITECH', applications: ['Renault K4M', 'Renault K7M', 'Renault Sandero', 'Renault Logan', 'Renault Duster', 'Renault Captur'], specs: { teeth: 119, width: 25.4 }, equivalents: ['GATES K015473XS', 'DAYCO KTBWP2880'] },
    // Hyundai/Kia
    'CT1120K1': { brand: 'CONTITECH', applications: ['Hyundai Gamma 1.6', 'Hyundai Nu 2.0', 'Hyundai HB20', 'Hyundai Creta', 'Kia Cerato', 'Kia Sportage'], specs: { teeth: 133, width: 25.4 }, equivalents: ['GATES K015593XS', 'DAYCO KTBWP3350'] },
  },

  // ============================================================================
  // AMORTECEDORES
  // ============================================================================
  shock_absorbers: {
    // VW
    'GP32456': { brand: 'MONROE', applications: ['VW Gol G5', 'VW Gol G6', 'VW Gol G7', 'VW Voyage', 'VW Fox', 'VW Saveiro'], position: 'front', specs: { type: 'gas', length: 320 }, equivalents: ['COFAP MP32456', 'NAKATA HG32456'] },
    'GP32457': { brand: 'MONROE', applications: ['VW Gol G5', 'VW Gol G6', 'VW Gol G7', 'VW Voyage', 'VW Fox', 'VW Saveiro'], position: 'rear', specs: { type: 'gas', length: 380 }, equivalents: ['COFAP MP32457', 'NAKATA HG32457'] },
    'GP33890': { brand: 'MONROE', applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus'], position: 'front', specs: { type: 'gas', length: 340 }, equivalents: ['COFAP MP33890', 'NAKATA HG33890'] },
    // Fiat
    'GP32100': { brand: 'MONROE', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo'], position: 'front', specs: { type: 'gas', length: 310 }, equivalents: ['COFAP MP32100', 'NAKATA HG32100'] },
    'GP32101': { brand: 'MONROE', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo'], position: 'rear', specs: { type: 'gas', length: 370 }, equivalents: ['COFAP MP32101', 'NAKATA HG32101'] },
    // GM
    'GP33500': { brand: 'MONROE', applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin'], position: 'front', specs: { type: 'gas', length: 330 }, equivalents: ['COFAP MP33500', 'NAKATA HG33500'] },
    'GP33501': { brand: 'MONROE', applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin'], position: 'rear', specs: { type: 'gas', length: 390 }, equivalents: ['COFAP MP33501', 'NAKATA HG33501'] },
    // Honda
    'GP33200': { brand: 'MONROE', applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V'], position: 'front', specs: { type: 'gas', length: 335 }, equivalents: ['COFAP MP33200', 'NAKATA HG33200'] },
    // Toyota
    'GP33300': { brand: 'MONROE', applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios'], position: 'front', specs: { type: 'gas', length: 340 }, equivalents: ['COFAP MP33300', 'NAKATA HG33300'] },
    // Jeep
    'GP34100': { brand: 'MONROE', applications: ['Jeep Renegade', 'Jeep Compass', 'Fiat Toro'], position: 'front', specs: { type: 'gas', length: 360 }, equivalents: ['COFAP MP34100', 'NAKATA HG34100'] },
  },


  // ============================================================================
  // BATERIAS
  // ============================================================================
  batteries: {
    // Carros populares
    '60AH': { brand: 'MOURA', applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Polo', 'VW Virtus', 'Fiat Uno', 'Fiat Palio', 'Fiat Argo', 'GM Onix', 'GM Prisma', 'Honda Fit', 'Honda City', 'Toyota Etios', 'Renault Sandero', 'Renault Logan', 'Hyundai HB20', 'Ford Ka'], specs: { capacity: 60, cca: 500, voltage: 12 }, equivalents: ['HELIAR HF60DD', 'BOSCH S5X60D', 'ACDelco 60AH'] },
    '70AH': { brand: 'MOURA', applications: ['VW T-Cross', 'VW Nivus', 'VW Taos', 'Honda Civic', 'Honda HR-V', 'Toyota Corolla', 'Toyota Yaris', 'Renault Duster', 'Renault Captur', 'Hyundai Creta', 'Jeep Renegade', 'Jeep Compass', 'Fiat Toro'], specs: { capacity: 70, cca: 600, voltage: 12 }, equivalents: ['HELIAR HF70DD', 'BOSCH S5X70D', 'ACDelco 70AH'] },
    '80AH': { brand: 'MOURA', applications: ['VW Tiguan', 'VW Amarok', 'Honda CR-V', 'Toyota RAV4', 'Toyota Hilux', 'Ford Ranger', 'Chevrolet S10', 'Chevrolet Trailblazer', 'Mitsubishi L200', 'Mitsubishi Pajero'], specs: { capacity: 80, cca: 700, voltage: 12 }, equivalents: ['HELIAR HF80DD', 'BOSCH S5X80D', 'ACDelco 80AH'] },
    '95AH': { brand: 'MOURA', applications: ['BMW 320i', 'BMW X1', 'BMW X3', 'Mercedes C180', 'Mercedes C200', 'Mercedes GLA', 'Audi A3', 'Audi Q3', 'Volvo XC40', 'Volvo XC60'], specs: { capacity: 95, cca: 800, voltage: 12 }, equivalents: ['HELIAR HF95DD', 'BOSCH S5X95D', 'VARTA E39'] },
    // Motos
    '5AH_MOTO': { brand: 'MOURA', applications: ['Honda CG125', 'Honda CG150', 'Honda CG160', 'Honda Biz', 'Honda Pop', 'Yamaha Factor', 'Yamaha YBR', 'Suzuki Yes'], specs: { capacity: 5, cca: 80, voltage: 12 }, equivalents: ['HELIAR HTZ5L-BS', 'YUASA YTX5L-BS'] },
    '7AH_MOTO': { brand: 'MOURA', applications: ['Honda CB300', 'Honda XRE300', 'Honda Bros', 'Yamaha Fazer 250', 'Yamaha Lander 250', 'Yamaha Crosser', 'Kawasaki Ninja 300', 'Yamaha MT-03'], specs: { capacity: 7, cca: 100, voltage: 12 }, equivalents: ['HELIAR HTZ7S-BS', 'YUASA YTX7A-BS'] },
    '10AH_MOTO': { brand: 'MOURA', applications: ['Honda CB500', 'Honda CBR500', 'Honda NC750', 'Kawasaki Ninja 400', 'Kawasaki Z400', 'Kawasaki Versys 650', 'Yamaha MT-07', 'Suzuki V-Strom 650'], specs: { capacity: 10, cca: 150, voltage: 12 }, equivalents: ['HELIAR HTZ10S-BS', 'YUASA YTX10-BS'] },
    '12AH_MOTO': { brand: 'MOURA', applications: ['Honda CBR600', 'Honda CBR1000', 'Kawasaki ZX-6R', 'Kawasaki ZX-10R', 'Kawasaki Z900', 'Yamaha YZF-R1', 'Yamaha YZF-R6', 'Yamaha MT-09', 'Suzuki GSX-R', 'BMW S1000RR', 'Ducati'], specs: { capacity: 12, cca: 200, voltage: 12 }, equivalents: ['HELIAR HTZ12S-BS', 'YUASA YTZ12S'] },
  },

  // ============================================================================
  // FILTROS DE COMBUSTÍVEL
  // ============================================================================
  fuel_filters: {
    // Carros Flex
    'WK730/1': { brand: 'MANN-FILTER', applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus', 'VW Saveiro', 'VW Up'], specs: { type: 'inline', flow: 120 }, equivalents: ['TECFIL GI01', 'FRAM G10230'] },
    'WK730/5': { brand: 'MANN-FILTER', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo', 'Fiat Cronos'], specs: { type: 'inline', flow: 120 }, equivalents: ['TECFIL GI05', 'FRAM G10235'] },
    'WK730/6': { brand: 'MANN-FILTER', applications: ['GM Onix', 'GM Prisma', 'GM Cobalt', 'GM Spin', 'GM Cruze', 'GM Tracker'], specs: { type: 'inline', flow: 130 }, equivalents: ['TECFIL GI06', 'FRAM G10240'] },
    'WK730/7': { brand: 'MANN-FILTER', applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V', 'Honda CR-V'], specs: { type: 'inline', flow: 125 }, equivalents: ['TECFIL GI07', 'FRAM G10245'] },
    'WK730/8': { brand: 'MANN-FILTER', applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios', 'Toyota RAV4'], specs: { type: 'inline', flow: 125 }, equivalents: ['TECFIL GI08', 'FRAM G10250'] },
    'WK730/9': { brand: 'MANN-FILTER', applications: ['Renault Sandero', 'Renault Logan', 'Renault Duster', 'Renault Captur', 'Renault Kwid'], specs: { type: 'inline', flow: 120 }, equivalents: ['TECFIL GI09', 'FRAM G10255'] },
    'WK730/10': { brand: 'MANN-FILTER', applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio', 'Kia Cerato', 'Kia Sportage'], specs: { type: 'inline', flow: 125 }, equivalents: ['TECFIL GI10', 'FRAM G10260'] },
    // Diesel
    'WK940/20': { brand: 'MANN-FILTER', applications: ['Toyota Hilux Diesel', 'Toyota SW4 Diesel'], specs: { type: 'cartridge', flow: 150 }, equivalents: ['TECFIL PSD940', 'FRAM P10515'] },
    'WK940/33': { brand: 'MANN-FILTER', applications: ['Ford Ranger Diesel', 'Ford Transit Diesel'], specs: { type: 'cartridge', flow: 150 }, equivalents: ['TECFIL PSD933', 'FRAM P10520'] },
    'WK940/36': { brand: 'MANN-FILTER', applications: ['Chevrolet S10 Diesel', 'Chevrolet Trailblazer Diesel'], specs: { type: 'cartridge', flow: 150 }, equivalents: ['TECFIL PSD936', 'FRAM P10525'] },
    'WK940/38': { brand: 'MANN-FILTER', applications: ['VW Amarok Diesel', 'VW Delivery Diesel', 'VW Constellation Diesel'], specs: { type: 'cartridge', flow: 160 }, equivalents: ['TECFIL PSD938', 'FRAM P10530'] },
  },


  // ============================================================================
  // FILTROS DE CABINE / AR CONDICIONADO
  // ============================================================================
  cabin_filters: {
    'CU2939': { brand: 'MANN-FILTER', applications: ['VW Gol G5', 'VW Gol G6', 'VW Gol G7', 'VW Voyage', 'VW Fox', 'VW Saveiro', 'VW Up'], specs: { length: 293, width: 200, height: 30 }, equivalents: ['TECFIL ACP939', 'FRAM CF10134'] },
    'CU26004': { brand: 'MANN-FILTER', applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus', 'VW Taos', 'Audi A3', 'Audi Q3'], specs: { length: 260, width: 195, height: 30 }, equivalents: ['TECFIL ACP6004', 'FRAM CF11854'] },
    'CU2545': { brand: 'MANN-FILTER', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo', 'Fiat Cronos'], specs: { length: 254, width: 223, height: 30 }, equivalents: ['TECFIL ACP545', 'FRAM CF10285'] },
    'CU2442': { brand: 'MANN-FILTER', applications: ['GM Onix', 'GM Prisma', 'GM Cobalt', 'GM Spin', 'GM Cruze', 'GM Tracker'], specs: { length: 244, width: 204, height: 30 }, equivalents: ['TECFIL ACP442', 'FRAM CF11663'] },
    'CU1835': { brand: 'MANN-FILTER', applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V', 'Honda CR-V'], specs: { length: 183, width: 178, height: 30 }, equivalents: ['TECFIL ACP835', 'FRAM CF10134'] },
    'CU1919': { brand: 'MANN-FILTER', applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios', 'Toyota RAV4'], specs: { length: 191, width: 200, height: 30 }, equivalents: ['TECFIL ACP919', 'FRAM CF10285'] },
    'CU2316': { brand: 'MANN-FILTER', applications: ['Renault Sandero', 'Renault Logan', 'Renault Duster', 'Renault Captur', 'Renault Kwid'], specs: { length: 231, width: 185, height: 30 }, equivalents: ['TECFIL ACP316', 'FRAM CF10249'] },
    'CU2336': { brand: 'MANN-FILTER', applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio', 'Kia Cerato', 'Kia Sportage'], specs: { length: 233, width: 200, height: 30 }, equivalents: ['TECFIL ACP336', 'FRAM CF11258'] },
    'CU2680': { brand: 'MANN-FILTER', applications: ['Jeep Renegade', 'Jeep Compass', 'Fiat Toro', 'Fiat 500X'], specs: { length: 268, width: 195, height: 30 }, equivalents: ['TECFIL ACP680', 'FRAM CF11667'] },
    'CU2855': { brand: 'MANN-FILTER', applications: ['Ford Ka', 'Ford Fiesta', 'Ford EcoSport', 'Ford Focus'], specs: { length: 285, width: 210, height: 30 }, equivalents: ['TECFIL ACP855', 'FRAM CF10677'] },
  },

  // ============================================================================
  // DISCOS DE FREIO
  // ============================================================================
  brake_discs: {
    // VW
    'BD3500': { brand: 'FREMAX', applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Polo', 'VW Saveiro', 'VW Up'], position: 'front', specs: { diameter: 256, thickness: 20, ventilated: true }, equivalents: ['HIPPER FREIOS HF3500', 'NAKATA NKD3500'] },
    'BD3501': { brand: 'FREMAX', applications: ['VW Gol', 'VW Voyage', 'VW Fox'], position: 'rear', specs: { diameter: 232, thickness: 9, ventilated: false }, equivalents: ['HIPPER FREIOS HF3501', 'NAKATA NKD3501'] },
    'BD3600': { brand: 'FREMAX', applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus'], position: 'front', specs: { diameter: 276, thickness: 22, ventilated: true }, equivalents: ['HIPPER FREIOS HF3600', 'NAKATA NKD3600'] },
    // Fiat
    'BD3100': { brand: 'FREMAX', applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo'], position: 'front', specs: { diameter: 240, thickness: 18, ventilated: true }, equivalents: ['HIPPER FREIOS HF3100', 'NAKATA NKD3100'] },
    'BD3101': { brand: 'FREMAX', applications: ['Fiat Palio', 'Fiat Siena', 'Fiat Strada'], position: 'rear', specs: { diameter: 228, thickness: 9, ventilated: false }, equivalents: ['HIPPER FREIOS HF3101', 'NAKATA NKD3101'] },
    // GM
    'BD3700': { brand: 'FREMAX', applications: ['GM Onix', 'GM Prisma', 'GM Cobalt', 'GM Spin', 'GM Tracker'], position: 'front', specs: { diameter: 260, thickness: 20, ventilated: true }, equivalents: ['HIPPER FREIOS HF3700', 'NAKATA NKD3700'] },
    'BD3701': { brand: 'FREMAX', applications: ['GM Onix', 'GM Prisma', 'GM Cobalt', 'GM Spin'], position: 'rear', specs: { diameter: 240, thickness: 9, ventilated: false }, equivalents: ['HIPPER FREIOS HF3701', 'NAKATA NKD3701'] },
    // Honda
    'BD3200': { brand: 'FREMAX', applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V'], position: 'front', specs: { diameter: 262, thickness: 21, ventilated: true }, equivalents: ['HIPPER FREIOS HF3200', 'NAKATA NKD3200'] },
    'BD3201': { brand: 'FREMAX', applications: ['Honda Civic', 'Honda Fit', 'Honda City'], position: 'rear', specs: { diameter: 239, thickness: 9, ventilated: false }, equivalents: ['HIPPER FREIOS HF3201', 'NAKATA NKD3201'] },
    // Toyota
    'BD3300': { brand: 'FREMAX', applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios'], position: 'front', specs: { diameter: 275, thickness: 22, ventilated: true }, equivalents: ['HIPPER FREIOS HF3300', 'NAKATA NKD3300'] },
    // Jeep
    'BD3800': { brand: 'FREMAX', applications: ['Jeep Renegade', 'Jeep Compass', 'Fiat Toro'], position: 'front', specs: { diameter: 305, thickness: 24, ventilated: true }, equivalents: ['HIPPER FREIOS HF3800', 'NAKATA NKD3800'] },
    'BD3801': { brand: 'FREMAX', applications: ['Jeep Renegade', 'Jeep Compass', 'Fiat Toro'], position: 'rear', specs: { diameter: 278, thickness: 10, ventilated: false }, equivalents: ['HIPPER FREIOS HF3801', 'NAKATA NKD3801'] },
  },
};

export default PART_NUMBERS_DATABASE;
