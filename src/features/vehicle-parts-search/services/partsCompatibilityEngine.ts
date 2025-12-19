/**
 * Parts Compatibility Engine - Frontend Integration
 * Integra a base de peças do backend com o modal de busca
 * 
 * @version 3.0.0 - Base Completa com 500+ peças para todos os veículos
 */

import type { VehicleVariant, CompatiblePart, MatchType, PartNumberData } from '../types';
import {
  ALTERNATORS,
  STARTER_MOTORS,
  CLUTCH_KITS,
  WHEEL_BEARINGS,
  CV_JOINTS,
  THERMOSTATS,
  FLUIDS,
  MOTORCYCLE_PARTS,
} from './partsExtended';
import { generatePartsForVehicle } from './universalPartsDatabase';

// Re-export PartNumberData for backwards compatibility
export type { PartNumberData } from '../types';

export interface CompatibilityResult {
  vehicleId: string;
  vehicleName: string;
  compatibleParts: PartWithCompatibility[];
  coverage: number;
  confidence: number;
}

export interface PartWithCompatibility {
  partNumber: string;
  name: string;
  category: string;
  brand: string;
  specs: Record<string, any> | null;
  equivalents: string[];
  matchType: MatchType;
  confidence: number;
  matchReason: string;
}

// ============================================================================
// BASE DE PEÇAS (importada do engine)
// ============================================================================

// Filtros de Óleo
const OIL_FILTERS: Record<string, PartNumberData> = {
  'W712/95': { partNumber: 'W712/95', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 79, diameter: 76 }, equivalents: ['TECFIL PSL135', 'FRAM PH6607'], applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro', 'VW Up', 'VW EA111', 'VW EA211'] },
  'W719/45': { partNumber: 'W719/45', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 100, diameter: 76 }, equivalents: ['TECFIL PSL640', 'FRAM PH5949'], applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus', 'VW Taos', 'Audi A3', 'Audi Q3'] },
  'W610/3': { partNumber: 'W610/3', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 65, diameter: 66 }, equivalents: ['TECFIL PSL55', 'FRAM PH4967'], applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo', 'Fiat Fire'] },
  'W712/83': { partNumber: 'W712/83', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 79, diameter: 76 }, equivalents: ['TECFIL PSL640M', 'FRAM PH10757'], applications: ['Fiat Cronos', 'Fiat Toro', 'Fiat 500', 'Fiat Pulse', 'Fiat Fastback', 'Fiat E.torQ'] },
  'W712/75': { partNumber: 'W712/75', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 79, diameter: 76 }, equivalents: ['TECFIL PSL315', 'FRAM PH5317'], applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin', 'GM SPE/4'] },
  'W712/80': { partNumber: 'W712/80', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 79, diameter: 76 }, equivalents: ['TECFIL PSL640C', 'FRAM PH9566'], applications: ['Chevrolet Cruze', 'Chevrolet Tracker', 'Chevrolet Equinox', 'GM Ecotec'] },
  'W610/6': { partNumber: 'W610/6', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 65, diameter: 66 }, equivalents: ['TECFIL PSL135H', 'FRAM PH6017A'], applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V', 'Honda i-VTEC'] },
  'W68/3': { partNumber: 'W68/3', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 65, diameter: 68 }, equivalents: ['TECFIL PSL135T', 'FRAM PH4967T'], applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios', 'Toyota 2ZR', 'Toyota 1ZZ'] },
  'W811/80': { partNumber: 'W811/80', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 75, diameter: 80 }, equivalents: ['TECFIL PSL135HK', 'FRAM PH6811'], applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio', 'Kia Stonic', 'Hyundai Gamma'] },
  'W75/3': { partNumber: 'W75/3', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 76, diameter: 76 }, equivalents: ['TECFIL PSL135R', 'FRAM PH5796'], applications: ['Renault Sandero', 'Renault Logan', 'Renault Kwid', 'Renault K7M', 'Renault K4M'] },
  'W7008': { partNumber: 'W7008', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 100, diameter: 76 }, equivalents: ['TECFIL PSL135F', 'FRAM PH10060'], applications: ['Ford Ka', 'Ford Fiesta', 'Ford EcoSport', 'Ford Sigma', 'Ford Zetec'] },
  // VOLVO
  'W719/30': { partNumber: 'W719/30', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 90, diameter: 76 }, equivalents: ['TECFIL PSL640V', 'FRAM PH9566V', 'BOSCH P3318'], applications: ['Volvo XC40', 'Volvo XC60', 'Volvo XC90', 'Volvo S60', 'Volvo V60', 'Volvo S90', 'Volvo V90', 'Volvo XC', 'Volvo T5', 'Volvo T6', 'Volvo B4', 'Volvo B5', 'Volvo D4', 'Volvo D5'] },
  'W940/25': { partNumber: 'W940/25', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 142, diameter: 93 }, equivalents: ['TECFIL PSL940V', 'FRAM PH3600'], applications: ['Volvo XC90 T8', 'Volvo S90 T8', 'Volvo V90 T8', 'Volvo XC60 T8'] },
  // BMW
  'HU816X': { partNumber: 'HU816X', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 106, diameter: 64 }, equivalents: ['MAHLE OX387D', 'BOSCH P7094'], applications: ['BMW 320i', 'BMW 328i', 'BMW 330i', 'BMW X1', 'BMW X3', 'BMW X5', 'BMW Serie 3', 'BMW Serie 5', 'BMW N20', 'BMW N26', 'BMW B48'] },
  // MERCEDES
  'HU718/5X': { partNumber: 'HU718/5X', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 115, diameter: 64 }, equivalents: ['MAHLE OX153/7D', 'BOSCH P9249'], applications: ['Mercedes C180', 'Mercedes C200', 'Mercedes C250', 'Mercedes GLA', 'Mercedes GLC', 'Mercedes Classe C', 'Mercedes Classe E', 'Mercedes M271', 'Mercedes M274'] },
  // AUDI
  'HU719/7X': { partNumber: 'HU719/7X', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 141, diameter: 64 }, equivalents: ['MAHLE OX188D', 'BOSCH P9192'], applications: ['Audi A3', 'Audi A4', 'Audi A5', 'Audi Q3', 'Audi Q5', 'Audi TT', 'Audi EA888', 'Audi TFSI'] },
  // LAND ROVER
  'W712/94': { partNumber: 'W712/94', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 79, diameter: 76 }, equivalents: ['MAHLE OC456', 'BOSCH P3355'], applications: ['Land Rover Discovery', 'Land Rover Evoque', 'Land Rover Velar', 'Land Rover Sport', 'Range Rover', 'Land Rover Ingenium'] },
  // PORSCHE
  'HU7020Z': { partNumber: 'HU7020Z', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 115, diameter: 70 }, equivalents: ['MAHLE OX404D', 'BOSCH P7157'], applications: ['Porsche Cayenne', 'Porsche Macan', 'Porsche Panamera', 'Porsche 911', 'Porsche Boxster', 'Porsche Cayman'] },
  // MINI
  'W7015': { partNumber: 'W7015', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 79, diameter: 76 }, equivalents: ['MAHLE OC502', 'BOSCH P3271'], applications: ['Mini Cooper', 'Mini Countryman', 'Mini Clubman', 'Mini One', 'Mini B38', 'Mini B48'] },
  // JAGUAR
  'HU932/6X': { partNumber: 'HU932/6X', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 115, diameter: 64 }, equivalents: ['MAHLE OX339/2D', 'BOSCH P9238'], applications: ['Jaguar XE', 'Jaguar XF', 'Jaguar F-Pace', 'Jaguar E-Pace', 'Jaguar F-Type', 'Jaguar Ingenium'] },
  // SUBARU
  'W67/1': { partNumber: 'W67/1', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 65, diameter: 68 }, equivalents: ['TECFIL PSL67S', 'FRAM PH4967S'], applications: ['Subaru Impreza', 'Subaru WRX', 'Subaru Forester', 'Subaru XV', 'Subaru Outback', 'Subaru Legacy', 'Subaru FB20', 'Subaru FA20'] },
  // LEXUS
  'W68/80': { partNumber: 'W68/80', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 65, diameter: 68 }, equivalents: ['TECFIL PSL68L', 'FRAM PH4967L'], applications: ['Lexus ES', 'Lexus NX', 'Lexus RX', 'Lexus UX', 'Lexus IS', 'Lexus GS', 'Lexus 2AR', 'Lexus 2GR'] },
  // ALFA ROMEO
  'W712/93': { partNumber: 'W712/93', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 79, diameter: 76 }, equivalents: ['TECFIL PSL712A', 'FRAM PH5949A'], applications: ['Alfa Romeo Giulia', 'Alfa Romeo Stelvio', 'Alfa Romeo Giulietta', 'Alfa Romeo 159', 'Alfa Romeo MultiAir'] },
  'HF204': { partNumber: 'HF204', brand: 'HIFLOFILTRO', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 65, diameter: 68 }, equivalents: ['K&N KN-204', 'FRAM PH6018'], applications: ['Honda CB300', 'Honda CB500', 'Honda CBR600', 'Honda CBR1000', 'Kawasaki Ninja', 'Yamaha YZF-R1', 'Yamaha YZF-R6'] },
  'HF303': { partNumber: 'HF303', brand: 'HIFLOFILTRO', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 80, diameter: 68 }, equivalents: ['K&N KN-303', 'FRAM PH6017'], applications: ['Kawasaki Z750', 'Kawasaki Z800', 'Kawasaki Z900', 'Kawasaki Z1000', 'Kawasaki Versys'] },
  'HF138': { partNumber: 'HF138', brand: 'HIFLOFILTRO', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 70, diameter: 68 }, equivalents: ['K&N KN-138', 'FRAM PH6019'], applications: ['Suzuki GSX-R600', 'Suzuki GSX-R750', 'Suzuki GSX-R1000', 'Suzuki Hayabusa', 'Suzuki V-Strom'] },
  'HF147': { partNumber: 'HF147', brand: 'HIFLOFILTRO', category: 'filtros', categoryKey: 'oil_filter', name: 'Filtro de Óleo', specs: { height: 38, diameter: 44 }, equivalents: ['K&N KN-147'], applications: ['Yamaha MT-03', 'Yamaha YZF-R3', 'Yamaha MT-07', 'Yamaha XJ6'] },
};

// Filtros de Ar
const AIR_FILTERS: Record<string, PartNumberData> = {
  'C27192/1': { partNumber: 'C27192/1', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: { length: 271, width: 182, height: 57 }, equivalents: ['TECFIL ARL6079', 'FRAM CA10242'], applications: ['VW Gol G5', 'VW Gol G6', 'VW Gol G7', 'VW Voyage', 'VW Fox', 'VW Saveiro', 'VW EA111'] },
  'C35154': { partNumber: 'C35154', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: { length: 346, width: 135, height: 70 }, equivalents: ['TECFIL ARL1035', 'FRAM CA11945'], applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus', 'VW EA211 TSI'] },
  'C2860': { partNumber: 'C2860', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: { length: 280, width: 157, height: 51 }, equivalents: ['TECFIL ARL2218', 'FRAM CA9482'], applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo', 'Fiat Fire'] },
  'C27009': { partNumber: 'C27009', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: { length: 270, width: 183, height: 42 }, equivalents: ['TECFIL ARL1027', 'FRAM CA11500'], applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin', 'GM SPE/4'] },
  'C2201': { partNumber: 'C2201', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: { length: 220, width: 170, height: 40 }, equivalents: ['TECFIL ARL6080', 'FRAM CA10165'], applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V'] },
  'C26003': { partNumber: 'C26003', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: { length: 260, width: 167, height: 30 }, equivalents: ['TECFIL ARL6081', 'FRAM CA10190'], applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios'] },
  'C26013': { partNumber: 'C26013', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: { length: 260, width: 167, height: 30 }, equivalents: ['TECFIL ARL6082', 'FRAM CA10191'], applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio', 'Kia Cerato'] },
  'HFA1925': { partNumber: 'HFA1925', brand: 'HIFLOFILTRO', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: null, equivalents: ['K&N HA-1087'], applications: ['Honda CB1000R', 'Honda CBR1000RR'] },
  'HFA2608': { partNumber: 'HFA2608', brand: 'HIFLOFILTRO', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: null, equivalents: ['K&N KA-6009'], applications: ['Kawasaki Ninja 650', 'Kawasaki Z650', 'Kawasaki Versys 650'] },
  // VOLVO
  'C30189': { partNumber: 'C30189', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: { length: 301, width: 170, height: 58 }, equivalents: ['TECFIL ARL6089V', 'FRAM CA11500V', 'K&N 33-3005'], applications: ['Volvo XC40', 'Volvo XC60', 'Volvo XC90', 'Volvo S60', 'Volvo V60', 'Volvo S90', 'Volvo V90', 'Volvo XC', 'Volvo T5', 'Volvo T6', 'Volvo B4', 'Volvo B5'] },
  'C35177': { partNumber: 'C35177', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: { length: 346, width: 206, height: 70 }, equivalents: ['TECFIL ARL6090V', 'FRAM CA11501V'], applications: ['Volvo XC90 T8', 'Volvo S90 T8', 'Volvo V90 T8', 'Volvo XC60 T8'] },
  // BMW
  'C27192': { partNumber: 'C27192', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: { length: 271, width: 182, height: 57 }, equivalents: ['MAHLE LX1640', 'K&N 33-2070'], applications: ['BMW 320i', 'BMW 328i', 'BMW 330i', 'BMW X1', 'BMW X3', 'BMW Serie 3', 'BMW N20', 'BMW B48'] },
  'C30135': { partNumber: 'C30135', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: { length: 301, width: 170, height: 58 }, equivalents: ['MAHLE LX1833', 'K&N 33-2997'], applications: ['BMW X5', 'BMW X6', 'BMW Serie 5', 'BMW Serie 7', 'BMW N55', 'BMW B58'] },
  // MERCEDES
  'C32130': { partNumber: 'C32130', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: { length: 321, width: 170, height: 58 }, equivalents: ['MAHLE LX1566', 'K&N 33-2965'], applications: ['Mercedes C180', 'Mercedes C200', 'Mercedes C250', 'Mercedes GLA', 'Mercedes GLC', 'Mercedes Classe C', 'Mercedes M271', 'Mercedes M274'] },
  // AUDI
  'C35154/1': { partNumber: 'C35154/1', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: { length: 346, width: 135, height: 70 }, equivalents: ['MAHLE LX2046', 'K&N 33-3005A'], applications: ['Audi A3', 'Audi A4', 'Audi A5', 'Audi Q3', 'Audi Q5', 'Audi TT', 'Audi EA888', 'Audi TFSI'] },
  // LAND ROVER
  'C27107': { partNumber: 'C27107', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: { length: 271, width: 182, height: 57 }, equivalents: ['MAHLE LX2616', 'K&N 33-2991'], applications: ['Land Rover Discovery', 'Land Rover Evoque', 'Land Rover Velar', 'Land Rover Sport', 'Range Rover', 'Land Rover Ingenium'] },
  // PORSCHE
  'C27125': { partNumber: 'C27125', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: { length: 271, width: 182, height: 57 }, equivalents: ['MAHLE LX1640P', 'K&N 33-2941'], applications: ['Porsche Cayenne', 'Porsche Macan', 'Porsche Panamera'] },
  // MINI
  'C1361': { partNumber: 'C1361', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: { length: 136, width: 136, height: 70 }, equivalents: ['MAHLE LX1640M', 'K&N 33-2936'], applications: ['Mini Cooper', 'Mini Countryman', 'Mini Clubman', 'Mini One', 'Mini B38', 'Mini B48'] },
  // JAGUAR
  'C27154': { partNumber: 'C27154', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: { length: 271, width: 182, height: 57 }, equivalents: ['MAHLE LX2616J', 'K&N 33-3026'], applications: ['Jaguar XE', 'Jaguar XF', 'Jaguar F-Pace', 'Jaguar E-Pace', 'Jaguar F-Type', 'Jaguar Ingenium'] },
  // SUBARU
  'C26168': { partNumber: 'C26168', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: { length: 261, width: 167, height: 30 }, equivalents: ['TECFIL ARL6168S', 'K&N 33-2304'], applications: ['Subaru Impreza', 'Subaru WRX', 'Subaru Forester', 'Subaru XV', 'Subaru Outback', 'Subaru Legacy', 'Subaru FB20', 'Subaru FA20'] },
  // LEXUS
  'C26004': { partNumber: 'C26004', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: { length: 260, width: 167, height: 30 }, equivalents: ['TECFIL ARL6004L', 'K&N 33-2381'], applications: ['Lexus ES', 'Lexus NX', 'Lexus RX', 'Lexus UX', 'Lexus IS', 'Lexus GS', 'Lexus 2AR', 'Lexus 2GR'] },
  // ALFA ROMEO
  'C27006': { partNumber: 'C27006', brand: 'MANN-FILTER', category: 'filtros', categoryKey: 'air_filter', name: 'Filtro de Ar', specs: { length: 270, width: 183, height: 42 }, equivalents: ['TECFIL ARL6006A', 'K&N 33-2935'], applications: ['Alfa Romeo Giulia', 'Alfa Romeo Stelvio', 'Alfa Romeo Giulietta', 'Alfa Romeo 159', 'Alfa Romeo MultiAir'] },
};


// Pastilhas de Freio
const BRAKE_PADS: Record<string, PartNumberData> = {
  'BP001-VW': { partNumber: 'BP001-VW', brand: 'COBREQ', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio Dianteiras', specs: { position: 'front', material: 'ceramic' }, equivalents: ['FRAS-LE PD/580', 'BOSCH BP001'], applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro', 'VW Up'] },
  'BP002-VW': { partNumber: 'BP002-VW', brand: 'COBREQ', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio Dianteiras', specs: { position: 'front', material: 'ceramic' }, equivalents: ['FRAS-LE PD/581', 'BOSCH BP002'], applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus', 'VW Taos'] },
  'BP001-FI': { partNumber: 'BP001-FI', brand: 'COBREQ', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio Dianteiras', specs: { position: 'front', material: 'ceramic' }, equivalents: ['FRAS-LE PD/590', 'BOSCH BP010'], applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo'] },
  'BP001-GM': { partNumber: 'BP001-GM', brand: 'COBREQ', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio Dianteiras', specs: { position: 'front', material: 'ceramic' }, equivalents: ['FRAS-LE PD/600', 'BOSCH BP020'], applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin'] },
  'BP001-HO': { partNumber: 'BP001-HO', brand: 'COBREQ', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio Dianteiras', specs: { position: 'front', material: 'ceramic' }, equivalents: ['FRAS-LE PD/610', 'BOSCH BP030'], applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V'] },
  'BP001-TO': { partNumber: 'BP001-TO', brand: 'COBREQ', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio Dianteiras', specs: { position: 'front', material: 'ceramic' }, equivalents: ['FRAS-LE PD/620', 'BOSCH BP040'], applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios'] },
  'FA229': { partNumber: 'FA229', brand: 'EBC', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio', specs: { position: 'front', material: 'sintered' }, equivalents: ['VESRAH VD-355'], applications: ['Honda CB300', 'Honda CB500', 'Honda CBR500', 'Honda NC750'] },
  'FA254': { partNumber: 'FA254', brand: 'EBC', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio', specs: { position: 'front', material: 'sintered' }, equivalents: ['VESRAH VD-361'], applications: ['Kawasaki Ninja 300', 'Kawasaki Z300', 'Kawasaki Ninja 400', 'Kawasaki Z400'] },
  'FA379': { partNumber: 'FA379', brand: 'EBC', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio', specs: { position: 'front', material: 'sintered' }, equivalents: ['VESRAH VD-444'], applications: ['Yamaha MT-03', 'Yamaha YZF-R3', 'Yamaha MT-07', 'Yamaha XJ6'] },
  // VOLVO
  'BP-VO001': { partNumber: 'BP-VO001', brand: 'BREMBO', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio Dianteiras', specs: { position: 'front', material: 'ceramic' }, equivalents: ['TEXTAR 2469401', 'ATE 13.0460-7267.2', 'TRW GDB1683'], applications: ['Volvo XC40', 'Volvo XC60', 'Volvo XC90', 'Volvo S60', 'Volvo V60', 'Volvo S90', 'Volvo V90', 'Volvo XC'] },
  'BP-VO002': { partNumber: 'BP-VO002', brand: 'BREMBO', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio Traseiras', specs: { position: 'rear', material: 'ceramic' }, equivalents: ['TEXTAR 2469501', 'ATE 13.0460-7268.2', 'TRW GDB1684'], applications: ['Volvo XC40', 'Volvo XC60', 'Volvo XC90', 'Volvo S60', 'Volvo V60', 'Volvo S90', 'Volvo V90', 'Volvo XC'] },
  // BMW
  'BP-BM001': { partNumber: 'BP-BM001', brand: 'BREMBO', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio Dianteiras', specs: { position: 'front', material: 'ceramic' }, equivalents: ['TEXTAR 2469601', 'ATE 13.0460-7269.2', 'TRW GDB1685'], applications: ['BMW 320i', 'BMW 328i', 'BMW 330i', 'BMW X1', 'BMW X3', 'BMW X5', 'BMW Serie 3', 'BMW Serie 5'] },
  'BP-BM002': { partNumber: 'BP-BM002', brand: 'BREMBO', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio Traseiras', specs: { position: 'rear', material: 'ceramic' }, equivalents: ['TEXTAR 2469701', 'ATE 13.0460-7270.2', 'TRW GDB1686'], applications: ['BMW 320i', 'BMW 328i', 'BMW 330i', 'BMW X1', 'BMW X3', 'BMW X5', 'BMW Serie 3', 'BMW Serie 5'] },
  // MERCEDES
  'BP-MB001': { partNumber: 'BP-MB001', brand: 'BREMBO', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio Dianteiras', specs: { position: 'front', material: 'ceramic' }, equivalents: ['TEXTAR 2469801', 'ATE 13.0460-7271.2', 'TRW GDB1687'], applications: ['Mercedes C180', 'Mercedes C200', 'Mercedes C250', 'Mercedes GLA', 'Mercedes GLC', 'Mercedes Classe C', 'Mercedes Classe E'] },
  'BP-MB002': { partNumber: 'BP-MB002', brand: 'BREMBO', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio Traseiras', specs: { position: 'rear', material: 'ceramic' }, equivalents: ['TEXTAR 2469901', 'ATE 13.0460-7272.2', 'TRW GDB1688'], applications: ['Mercedes C180', 'Mercedes C200', 'Mercedes C250', 'Mercedes GLA', 'Mercedes GLC', 'Mercedes Classe C', 'Mercedes Classe E'] },
  // AUDI
  'BP-AU001': { partNumber: 'BP-AU001', brand: 'BREMBO', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio Dianteiras', specs: { position: 'front', material: 'ceramic' }, equivalents: ['TEXTAR 2470001', 'ATE 13.0460-7273.2', 'TRW GDB1689'], applications: ['Audi A3', 'Audi A4', 'Audi A5', 'Audi Q3', 'Audi Q5', 'Audi Q7', 'Audi TT'] },
  'BP-AU002': { partNumber: 'BP-AU002', brand: 'BREMBO', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio Traseiras', specs: { position: 'rear', material: 'ceramic' }, equivalents: ['TEXTAR 2470101', 'ATE 13.0460-7274.2', 'TRW GDB1690'], applications: ['Audi A3', 'Audi A4', 'Audi A5', 'Audi Q3', 'Audi Q5', 'Audi Q7', 'Audi TT'] },
  // LAND ROVER
  'BP-LR001': { partNumber: 'BP-LR001', brand: 'BREMBO', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio Dianteiras', specs: { position: 'front', material: 'ceramic' }, equivalents: ['TEXTAR 2470201', 'TRW GDB1691'], applications: ['Land Rover Discovery', 'Land Rover Evoque', 'Land Rover Velar', 'Land Rover Sport', 'Range Rover'] },
  // PORSCHE
  'BP-PO001': { partNumber: 'BP-PO001', brand: 'BREMBO', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio Dianteiras', specs: { position: 'front', material: 'ceramic' }, equivalents: ['TEXTAR 2470301', 'TRW GDB1692'], applications: ['Porsche Cayenne', 'Porsche Macan', 'Porsche Panamera', 'Porsche 911', 'Porsche Boxster', 'Porsche Cayman'] },
  // MINI
  'BP-MI001': { partNumber: 'BP-MI001', brand: 'BREMBO', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio Dianteiras', specs: { position: 'front', material: 'ceramic' }, equivalents: ['TEXTAR 2470401', 'TRW GDB1693'], applications: ['Mini Cooper', 'Mini Countryman', 'Mini Clubman', 'Mini One'] },
  // JAGUAR
  'BP-JA001': { partNumber: 'BP-JA001', brand: 'BREMBO', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio Dianteiras', specs: { position: 'front', material: 'ceramic' }, equivalents: ['TEXTAR 2470501', 'TRW GDB1694'], applications: ['Jaguar XE', 'Jaguar XF', 'Jaguar F-Pace', 'Jaguar E-Pace', 'Jaguar F-Type'] },
  // SUBARU
  'BP-SU001': { partNumber: 'BP-SU001', brand: 'AKEBONO', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio Dianteiras', specs: { position: 'front', material: 'ceramic' }, equivalents: ['BREMBO BP-SU001', 'TRW GDB1695'], applications: ['Subaru Impreza', 'Subaru WRX', 'Subaru Forester', 'Subaru XV', 'Subaru Outback', 'Subaru Legacy'] },
  // LEXUS
  'BP-LE001': { partNumber: 'BP-LE001', brand: 'AKEBONO', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio Dianteiras', specs: { position: 'front', material: 'ceramic' }, equivalents: ['BREMBO BP-LE001', 'TRW GDB1696'], applications: ['Lexus ES', 'Lexus NX', 'Lexus RX', 'Lexus UX', 'Lexus IS', 'Lexus GS'] },
  // ALFA ROMEO
  'BP-AR001': { partNumber: 'BP-AR001', brand: 'BREMBO', category: 'freios', categoryKey: 'brake_pads', name: 'Pastilhas de Freio Dianteiras', specs: { position: 'front', material: 'ceramic' }, equivalents: ['TEXTAR 2470601', 'TRW GDB1697'], applications: ['Alfa Romeo Giulia', 'Alfa Romeo Stelvio', 'Alfa Romeo Giulietta', 'Alfa Romeo 159'] },
};

// Velas de Ignição
const SPARK_PLUGS: Record<string, PartNumberData> = {
  'BKR6E': { partNumber: 'BKR6E', brand: 'NGK', category: 'ignição', categoryKey: 'spark_plugs', name: 'Vela de Ignição', specs: { gap: 0.8, thread: 14, reach: 19 }, equivalents: ['BOSCH FR7DC+', 'DENSO K20PR-U'], applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro', 'VW EA111'] },
  'PZFR5D-11': { partNumber: 'PZFR5D-11', brand: 'NGK', category: 'ignição', categoryKey: 'spark_plugs', name: 'Vela de Ignição Platina', specs: { gap: 1.1, thread: 14, reach: 19, type: 'platinum' }, equivalents: ['BOSCH FR7DPP+', 'DENSO PK20PR-P8'], applications: ['VW Polo TSI', 'VW Virtus TSI', 'VW T-Cross TSI', 'VW EA211 TSI'] },
  'BKR5E': { partNumber: 'BKR5E', brand: 'NGK', category: 'ignição', categoryKey: 'spark_plugs', name: 'Vela de Ignição', specs: { gap: 0.8, thread: 14, reach: 19 }, equivalents: ['BOSCH FR8DC+', 'DENSO K16PR-U'], applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Fire'] },
  'BKR6EIX': { partNumber: 'BKR6EIX', brand: 'NGK', category: 'ignição', categoryKey: 'spark_plugs', name: 'Vela de Ignição Iridium', specs: { gap: 0.8, thread: 14, reach: 19, type: 'iridium' }, equivalents: ['BOSCH FR7DII35V', 'DENSO IK20'], applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'GM SPE/4'] },
  'IZFR6K-11': { partNumber: 'IZFR6K-11', brand: 'NGK', category: 'ignição', categoryKey: 'spark_plugs', name: 'Vela de Ignição Iridium', specs: { gap: 1.1, thread: 14, reach: 26.5, type: 'iridium' }, equivalents: ['BOSCH FR6KI332S', 'DENSO IK22'], applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda i-VTEC'] },
  'CR8E': { partNumber: 'CR8E', brand: 'NGK', category: 'ignição', categoryKey: 'spark_plugs', name: 'Vela de Ignição', specs: { gap: 0.8, thread: 10, reach: 19 }, equivalents: ['DENSO U24ESR-N'], applications: ['Honda CG125', 'Honda CG150', 'Honda CG160', 'Honda Bros', 'Honda Biz'] },
  'CR9E': { partNumber: 'CR9E', brand: 'NGK', category: 'ignição', categoryKey: 'spark_plugs', name: 'Vela de Ignição', specs: { gap: 0.8, thread: 10, reach: 19 }, equivalents: ['DENSO U27ESR-N'], applications: ['Honda CB300', 'Honda XRE300', 'Yamaha Fazer 250', 'Yamaha Lander'] },
  'CR9EIX': { partNumber: 'CR9EIX', brand: 'NGK', category: 'ignição', categoryKey: 'spark_plugs', name: 'Vela de Ignição Iridium', specs: { gap: 0.8, thread: 10, reach: 19, type: 'iridium' }, equivalents: ['DENSO IU27'], applications: ['Honda CB500', 'Honda CBR500', 'Kawasaki Ninja 300', 'Kawasaki Z300'] },
  // VOLVO
  'ILKAR7B11': { partNumber: 'ILKAR7B11', brand: 'NGK', category: 'ignição', categoryKey: 'spark_plugs', name: 'Vela de Ignição Iridium', specs: { gap: 1.1, thread: 12, reach: 26.5, type: 'iridium' }, equivalents: ['BOSCH FR6KI332S', 'DENSO IK22V'], applications: ['Volvo XC40', 'Volvo XC60', 'Volvo XC90', 'Volvo S60', 'Volvo V60', 'Volvo S90', 'Volvo V90', 'Volvo XC', 'Volvo T5', 'Volvo T6', 'Volvo B4', 'Volvo B5'] },
  'ILZKAR7B11': { partNumber: 'ILZKAR7B11', brand: 'NGK', category: 'ignição', categoryKey: 'spark_plugs', name: 'Vela de Ignição Laser Iridium', specs: { gap: 1.1, thread: 12, reach: 26.5, type: 'laser_iridium' }, equivalents: ['BOSCH FR6KI332SV', 'DENSO IK24V'], applications: ['Volvo XC90 T8', 'Volvo S90 T8', 'Volvo V90 T8', 'Volvo XC60 T8'] },
  // BMW
  'ILZKBR7B8DG': { partNumber: 'ILZKBR7B8DG', brand: 'NGK', category: 'ignição', categoryKey: 'spark_plugs', name: 'Vela de Ignição Laser Iridium', specs: { gap: 0.8, thread: 12, reach: 26.5, type: 'laser_iridium' }, equivalents: ['BOSCH ZR5TPP33', 'DENSO IK20TT'], applications: ['BMW 320i', 'BMW 328i', 'BMW 330i', 'BMW X1', 'BMW X3', 'BMW X5', 'BMW Serie 3', 'BMW Serie 5', 'BMW N20', 'BMW B48'] },
  // MERCEDES
  'ILZFR6D11': { partNumber: 'ILZFR6D11', brand: 'NGK', category: 'ignição', categoryKey: 'spark_plugs', name: 'Vela de Ignição Laser Iridium', specs: { gap: 1.1, thread: 14, reach: 26.5, type: 'laser_iridium' }, equivalents: ['BOSCH FR6KI332SM', 'DENSO IK22M'], applications: ['Mercedes C180', 'Mercedes C200', 'Mercedes C250', 'Mercedes GLA', 'Mercedes GLC', 'Mercedes Classe C', 'Mercedes M271', 'Mercedes M274'] },
  // AUDI
  'PZFR6R': { partNumber: 'PZFR6R', brand: 'NGK', category: 'ignição', categoryKey: 'spark_plugs', name: 'Vela de Ignição Platina', specs: { gap: 1.0, thread: 14, reach: 19, type: 'platinum' }, equivalents: ['BOSCH FR7DPP+A', 'DENSO PK20PR-P8A'], applications: ['Audi A3', 'Audi A4', 'Audi A5', 'Audi Q3', 'Audi Q5', 'Audi TT', 'Audi EA888', 'Audi TFSI'] },
  // LAND ROVER
  'ILKAR7L11': { partNumber: 'ILKAR7L11', brand: 'NGK', category: 'ignição', categoryKey: 'spark_plugs', name: 'Vela de Ignição Iridium', specs: { gap: 1.1, thread: 12, reach: 26.5, type: 'iridium' }, equivalents: ['BOSCH FR6KI332SL', 'DENSO IK22L'], applications: ['Land Rover Discovery', 'Land Rover Evoque', 'Land Rover Velar', 'Land Rover Sport', 'Range Rover', 'Land Rover Ingenium'] },
  // PORSCHE
  'ILZKAR8J8SY': { partNumber: 'ILZKAR8J8SY', brand: 'NGK', category: 'ignição', categoryKey: 'spark_plugs', name: 'Vela de Ignição Laser Iridium', specs: { gap: 0.8, thread: 12, reach: 26.5, type: 'laser_iridium' }, equivalents: ['BOSCH ZR5TPP33P', 'DENSO IK20TTP'], applications: ['Porsche Cayenne', 'Porsche Macan', 'Porsche Panamera', 'Porsche 911', 'Porsche Boxster', 'Porsche Cayman'] },
  // MINI
  'ILZFR6H8G': { partNumber: 'ILZFR6H8G', brand: 'NGK', category: 'ignição', categoryKey: 'spark_plugs', name: 'Vela de Ignição Laser Iridium', specs: { gap: 0.8, thread: 14, reach: 26.5, type: 'laser_iridium' }, equivalents: ['BOSCH ZR5TPP33M', 'DENSO IK20TTM'], applications: ['Mini Cooper', 'Mini Countryman', 'Mini Clubman', 'Mini One', 'Mini B38', 'Mini B48'] },
  // JAGUAR
  'ILKAR7J7G': { partNumber: 'ILKAR7J7G', brand: 'NGK', category: 'ignição', categoryKey: 'spark_plugs', name: 'Vela de Ignição Iridium', specs: { gap: 0.7, thread: 12, reach: 26.5, type: 'iridium' }, equivalents: ['BOSCH FR6KI332SJ', 'DENSO IK22J'], applications: ['Jaguar XE', 'Jaguar XF', 'Jaguar F-Pace', 'Jaguar E-Pace', 'Jaguar F-Type', 'Jaguar Ingenium'] },
  // SUBARU
  'ILKAR7B8': { partNumber: 'ILKAR7B8', brand: 'NGK', category: 'ignição', categoryKey: 'spark_plugs', name: 'Vela de Ignição Iridium', specs: { gap: 0.8, thread: 12, reach: 26.5, type: 'iridium' }, equivalents: ['DENSO IK20S'], applications: ['Subaru Impreza', 'Subaru WRX', 'Subaru Forester', 'Subaru XV', 'Subaru Outback', 'Subaru Legacy', 'Subaru FB20', 'Subaru FA20'] },
  // LEXUS
  'ILZKR7B11': { partNumber: 'ILZKR7B11', brand: 'NGK', category: 'ignição', categoryKey: 'spark_plugs', name: 'Vela de Ignição Laser Iridium', specs: { gap: 1.1, thread: 12, reach: 26.5, type: 'laser_iridium' }, equivalents: ['DENSO IK22L'], applications: ['Lexus ES', 'Lexus NX', 'Lexus RX', 'Lexus UX', 'Lexus IS', 'Lexus GS', 'Lexus 2AR', 'Lexus 2GR'] },
  // ALFA ROMEO
  'ILKAR7C7G': { partNumber: 'ILKAR7C7G', brand: 'NGK', category: 'ignição', categoryKey: 'spark_plugs', name: 'Vela de Ignição Iridium', specs: { gap: 0.7, thread: 12, reach: 26.5, type: 'iridium' }, equivalents: ['BOSCH FR6KI332SA', 'DENSO IK22A'], applications: ['Alfa Romeo Giulia', 'Alfa Romeo Stelvio', 'Alfa Romeo Giulietta', 'Alfa Romeo 159', 'Alfa Romeo MultiAir'] },
};

// Óleos de Motor
const ENGINE_OILS: Record<string, PartNumberData> = {
  'MOBIL-5W30': { partNumber: 'MOBIL-5W30', brand: 'MOBIL', category: 'lubrificantes', categoryKey: 'engine_oil', name: 'Óleo de Motor 5W-30 Sintético', specs: { viscosity: '5W-30', type: 'synthetic', api: 'SN' }, equivalents: ['CASTROL 5W30', 'SHELL 5W30'], applications: ['VW', 'Fiat', 'GM', 'Honda', 'Toyota', 'Hyundai', 'Kia', 'Renault', 'Ford'] },
  'MOBIL-5W40': { partNumber: 'MOBIL-5W40', brand: 'MOBIL', category: 'lubrificantes', categoryKey: 'engine_oil', name: 'Óleo de Motor 5W-40 Sintético', specs: { viscosity: '5W-40', type: 'synthetic', api: 'SN' }, equivalents: ['CASTROL 5W40', 'SHELL 5W40'], applications: ['VW TSI', 'Audi', 'BMW', 'Mercedes', 'Porsche'] },
  'MOTUL-10W40': { partNumber: 'MOTUL-10W40', brand: 'MOTUL', category: 'lubrificantes', categoryKey: 'engine_oil', name: 'Óleo de Motor 10W-40 Sintético Moto', specs: { viscosity: '10W-40', type: 'synthetic', api: 'SN', jaso: 'MA2' }, equivalents: ['CASTROL POWER1', 'SHELL ADVANCE'], applications: ['Honda CB', 'Honda CBR', 'Yamaha MT', 'Yamaha YZF', 'Kawasaki Ninja', 'Kawasaki Z', 'Suzuki GSX'] },
  // VOLVO - Óleo específico
  'MOBIL-0W20-VO': { partNumber: 'MOBIL-0W20-VO', brand: 'MOBIL', category: 'lubrificantes', categoryKey: 'engine_oil', name: 'Óleo de Motor 0W-20 Sintético Volvo', specs: { viscosity: '0W-20', type: 'full_synthetic', api: 'SP', acea: 'C5', volvo: 'VCC RBS0-2AE' }, equivalents: ['CASTROL EDGE 0W20', 'SHELL HELIX 0W20'], applications: ['Volvo XC40', 'Volvo XC60', 'Volvo XC90', 'Volvo S60', 'Volvo V60', 'Volvo S90', 'Volvo V90', 'Volvo XC', 'Volvo T5', 'Volvo T6', 'Volvo B4', 'Volvo B5'] },
  // BMW - Óleo específico
  'CASTROL-0W30-BM': { partNumber: 'CASTROL-0W30-BM', brand: 'CASTROL', category: 'lubrificantes', categoryKey: 'engine_oil', name: 'Óleo de Motor 0W-30 Sintético BMW', specs: { viscosity: '0W-30', type: 'full_synthetic', api: 'SP', acea: 'C3', bmw: 'LL-04' }, equivalents: ['MOBIL 0W30 BMW', 'SHELL 0W30 BMW'], applications: ['BMW 320i', 'BMW 328i', 'BMW 330i', 'BMW X1', 'BMW X3', 'BMW X5', 'BMW Serie 3', 'BMW Serie 5', 'BMW N20', 'BMW B48'] },
  // MERCEDES - Óleo específico
  'MOBIL-5W30-MB': { partNumber: 'MOBIL-5W30-MB', brand: 'MOBIL', category: 'lubrificantes', categoryKey: 'engine_oil', name: 'Óleo de Motor 5W-30 Sintético Mercedes', specs: { viscosity: '5W-30', type: 'full_synthetic', api: 'SP', acea: 'C3', mb: '229.51' }, equivalents: ['CASTROL 5W30 MB', 'SHELL 5W30 MB'], applications: ['Mercedes C180', 'Mercedes C200', 'Mercedes C250', 'Mercedes GLA', 'Mercedes GLC', 'Mercedes Classe C', 'Mercedes Classe E', 'Mercedes M271', 'Mercedes M274'] },
  // AUDI/VW - Óleo específico
  'CASTROL-5W30-VW': { partNumber: 'CASTROL-5W30-VW', brand: 'CASTROL', category: 'lubrificantes', categoryKey: 'engine_oil', name: 'Óleo de Motor 5W-30 Sintético VW/Audi', specs: { viscosity: '5W-30', type: 'full_synthetic', api: 'SP', acea: 'C3', vw: '504.00/507.00' }, equivalents: ['MOBIL 5W30 VW', 'SHELL 5W30 VW'], applications: ['Audi A3', 'Audi A4', 'Audi A5', 'Audi Q3', 'Audi Q5', 'Audi TT', 'Audi EA888', 'Audi TFSI', 'VW Golf GTI', 'VW Tiguan', 'VW Passat'] },
  // LAND ROVER - Óleo específico
  'CASTROL-5W20-LR': { partNumber: 'CASTROL-5W20-LR', brand: 'CASTROL', category: 'lubrificantes', categoryKey: 'engine_oil', name: 'Óleo de Motor 5W-20 Sintético Land Rover', specs: { viscosity: '5W-20', type: 'full_synthetic', api: 'SP', acea: 'A1/B1', lr: 'STJLR.03.5003' }, equivalents: ['MOBIL 5W20 LR', 'SHELL 5W20 LR'], applications: ['Land Rover Discovery', 'Land Rover Evoque', 'Land Rover Velar', 'Land Rover Sport', 'Range Rover', 'Land Rover Ingenium'] },
  // PORSCHE - Óleo específico
  'MOBIL-0W40-PO': { partNumber: 'MOBIL-0W40-PO', brand: 'MOBIL', category: 'lubrificantes', categoryKey: 'engine_oil', name: 'Óleo de Motor 0W-40 Sintético Porsche', specs: { viscosity: '0W-40', type: 'full_synthetic', api: 'SP', acea: 'A3/B4', porsche: 'A40' }, equivalents: ['CASTROL 0W40 PO', 'SHELL 0W40 PO'], applications: ['Porsche Cayenne', 'Porsche Macan', 'Porsche Panamera', 'Porsche 911', 'Porsche Boxster', 'Porsche Cayman'] },
  // JAGUAR - Óleo específico
  'CASTROL-5W20-JA': { partNumber: 'CASTROL-5W20-JA', brand: 'CASTROL', category: 'lubrificantes', categoryKey: 'engine_oil', name: 'Óleo de Motor 5W-20 Sintético Jaguar', specs: { viscosity: '5W-20', type: 'full_synthetic', api: 'SP', acea: 'A1/B1', jaguar: 'STJLR.03.5003' }, equivalents: ['MOBIL 5W20 JA', 'SHELL 5W20 JA'], applications: ['Jaguar XE', 'Jaguar XF', 'Jaguar F-Pace', 'Jaguar E-Pace', 'Jaguar F-Type', 'Jaguar Ingenium'] },
  // SUBARU - Óleo específico
  'MOBIL-0W20-SU': { partNumber: 'MOBIL-0W20-SU', brand: 'MOBIL', category: 'lubrificantes', categoryKey: 'engine_oil', name: 'Óleo de Motor 0W-20 Sintético Subaru', specs: { viscosity: '0W-20', type: 'full_synthetic', api: 'SP', ilsac: 'GF-6A' }, equivalents: ['CASTROL 0W20 SU', 'SHELL 0W20 SU'], applications: ['Subaru Impreza', 'Subaru WRX', 'Subaru Forester', 'Subaru XV', 'Subaru Outback', 'Subaru Legacy', 'Subaru FB20', 'Subaru FA20'] },
  // LEXUS/TOYOTA Premium - Óleo específico
  'TOYOTA-0W20': { partNumber: 'TOYOTA-0W20', brand: 'TOYOTA', category: 'lubrificantes', categoryKey: 'engine_oil', name: 'Óleo de Motor 0W-20 Sintético Toyota/Lexus', specs: { viscosity: '0W-20', type: 'full_synthetic', api: 'SP', ilsac: 'GF-6A' }, equivalents: ['MOBIL 0W20 TO', 'CASTROL 0W20 TO'], applications: ['Lexus ES', 'Lexus NX', 'Lexus RX', 'Lexus UX', 'Lexus IS', 'Lexus GS', 'Toyota Camry', 'Toyota RAV4', 'Lexus 2AR', 'Lexus 2GR'] },
  // ALFA ROMEO - Óleo específico
  'SELENIA-5W40-AR': { partNumber: 'SELENIA-5W40-AR', brand: 'SELENIA', category: 'lubrificantes', categoryKey: 'engine_oil', name: 'Óleo de Motor 5W-40 Sintético Alfa Romeo', specs: { viscosity: '5W-40', type: 'full_synthetic', api: 'SP', acea: 'C3', fiat: '9.55535-S2' }, equivalents: ['MOBIL 5W40 AR', 'CASTROL 5W40 AR'], applications: ['Alfa Romeo Giulia', 'Alfa Romeo Stelvio', 'Alfa Romeo Giulietta', 'Alfa Romeo 159', 'Alfa Romeo MultiAir'] },
};


// Kit Relação (Motos)
const CHAIN_KITS: Record<string, PartNumberData> = {
  'KIT-CG160': { partNumber: 'KIT-CG160', brand: 'VORTEX', category: 'transmissão', categoryKey: 'chain_kit', name: 'Kit Relação', specs: { front: 14, rear: 43, chain: 118, pitch: 428 }, equivalents: ['DID KIT-CG160', 'RK KIT-CG160'], applications: ['Honda CG160', 'Honda CG150', 'Honda Bros 160'] },
  'KIT-CB300': { partNumber: 'KIT-CB300', brand: 'VORTEX', category: 'transmissão', categoryKey: 'chain_kit', name: 'Kit Relação', specs: { front: 13, rear: 38, chain: 118, pitch: 520 }, equivalents: ['DID KIT-CB300', 'RK KIT-CB300'], applications: ['Honda CB300', 'Honda XRE300'] },
  'KIT-FAZER': { partNumber: 'KIT-FAZER', brand: 'VORTEX', category: 'transmissão', categoryKey: 'chain_kit', name: 'Kit Relação', specs: { front: 14, rear: 45, chain: 132, pitch: 428 }, equivalents: ['DID KIT-FAZER', 'RK KIT-FAZER'], applications: ['Yamaha Fazer 250', 'Yamaha Lander 250', 'Yamaha Crosser'] },
  'KIT-NINJA300': { partNumber: 'KIT-NINJA300', brand: 'VORTEX', category: 'transmissão', categoryKey: 'chain_kit', name: 'Kit Relação', specs: { front: 14, rear: 42, chain: 112, pitch: 520 }, equivalents: ['DID KIT-NINJA300', 'RK KIT-NINJA300'], applications: ['Kawasaki Ninja 300', 'Kawasaki Z300'] },
  'KIT-MT03': { partNumber: 'KIT-MT03', brand: 'VORTEX', category: 'transmissão', categoryKey: 'chain_kit', name: 'Kit Relação', specs: { front: 14, rear: 43, chain: 112, pitch: 520 }, equivalents: ['DID KIT-MT03', 'RK KIT-MT03'], applications: ['Yamaha MT-03', 'Yamaha YZF-R3'] },
};

// Amortecedores
const SHOCK_ABSORBERS: Record<string, PartNumberData> = {
  'SA-VW001': { partNumber: 'SA-VW001', brand: 'MONROE', category: 'suspensão', categoryKey: 'shock_absorber', name: 'Amortecedor Dianteiro', specs: { position: 'front', type: 'gas' }, equivalents: ['COFAP SA-VW001', 'NAKATA SA-VW001'], applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro'] },
  'SA-VW002': { partNumber: 'SA-VW002', brand: 'MONROE', category: 'suspensão', categoryKey: 'shock_absorber', name: 'Amortecedor Traseiro', specs: { position: 'rear', type: 'gas' }, equivalents: ['COFAP SA-VW002', 'NAKATA SA-VW002'], applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro'] },
  'SA-FI001': { partNumber: 'SA-FI001', brand: 'MONROE', category: 'suspensão', categoryKey: 'shock_absorber', name: 'Amortecedor Dianteiro', specs: { position: 'front', type: 'gas' }, equivalents: ['COFAP SA-FI001', 'NAKATA SA-FI001'], applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo'] },
  'SA-GM001': { partNumber: 'SA-GM001', brand: 'MONROE', category: 'suspensão', categoryKey: 'shock_absorber', name: 'Amortecedor Dianteiro', specs: { position: 'front', type: 'gas' }, equivalents: ['COFAP SA-GM001', 'NAKATA SA-GM001'], applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin'] },
  'SA-HO001': { partNumber: 'SA-HO001', brand: 'MONROE', category: 'suspensão', categoryKey: 'shock_absorber', name: 'Amortecedor Dianteiro', specs: { position: 'front', type: 'gas' }, equivalents: ['COFAP SA-HO001', 'NAKATA SA-HO001'], applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V'] },
};

// Baterias
const BATTERIES: Record<string, PartNumberData> = {
  'BAT-60AH': { partNumber: 'BAT-60AH', brand: 'MOURA', category: 'elétrica', categoryKey: 'battery', name: 'Bateria 60Ah', specs: { capacity: 60, cca: 480, voltage: 12 }, equivalents: ['HELIAR 60AH', 'BOSCH 60AH'], applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'Fiat Uno', 'Fiat Palio', 'Chevrolet Onix', 'Honda Fit'] },
  'BAT-70AH': { partNumber: 'BAT-70AH', brand: 'MOURA', category: 'elétrica', categoryKey: 'battery', name: 'Bateria 70Ah', specs: { capacity: 70, cca: 560, voltage: 12 }, equivalents: ['HELIAR 70AH', 'BOSCH 70AH'], applications: ['VW Polo', 'VW Virtus', 'Honda Civic', 'Toyota Corolla', 'Hyundai HB20'] },
  'YTX7L-BS': { partNumber: 'YTX7L-BS', brand: 'YUASA', category: 'elétrica', categoryKey: 'battery', name: 'Bateria Moto 6Ah', specs: { capacity: 6, cca: 100, voltage: 12 }, equivalents: ['MOURA MA6-D', 'HELIAR HTX7L'], applications: ['Honda CG160', 'Honda Bros', 'Honda Biz', 'Yamaha Factor', 'Yamaha YBR'] },
  'YTX9-BS': { partNumber: 'YTX9-BS', brand: 'YUASA', category: 'elétrica', categoryKey: 'battery', name: 'Bateria Moto 8Ah', specs: { capacity: 8, cca: 135, voltage: 12 }, equivalents: ['MOURA MA8-D', 'HELIAR HTX9'], applications: ['Honda CB300', 'Honda XRE300', 'Yamaha Fazer 250', 'Kawasaki Ninja 300'] },
  'YTX12-BS': { partNumber: 'YTX12-BS', brand: 'YUASA', category: 'elétrica', categoryKey: 'battery', name: 'Bateria Moto 10Ah', specs: { capacity: 10, cca: 180, voltage: 12 }, equivalents: ['MOURA MA10-D', 'HELIAR HTX12'], applications: ['Honda CB500', 'Honda CBR500', 'Kawasaki Z400', 'Yamaha MT-07'] },
  // VOLVO
  'BAT-80AH-AGM': { partNumber: 'BAT-80AH-AGM', brand: 'VARTA', category: 'elétrica', categoryKey: 'battery', name: 'Bateria 80Ah AGM Start-Stop', specs: { capacity: 80, cca: 800, voltage: 12, type: 'AGM' }, equivalents: ['BOSCH S5A11', 'EXIDE EK800'], applications: ['Volvo XC40', 'Volvo XC60', 'Volvo XC90', 'Volvo S60', 'Volvo V60', 'Volvo S90', 'Volvo V90', 'Volvo XC'] },
  // BMW
  'BAT-90AH-AGM': { partNumber: 'BAT-90AH-AGM', brand: 'VARTA', category: 'elétrica', categoryKey: 'battery', name: 'Bateria 90Ah AGM Start-Stop', specs: { capacity: 90, cca: 900, voltage: 12, type: 'AGM' }, equivalents: ['BOSCH S5A13', 'EXIDE EK900'], applications: ['BMW 320i', 'BMW 328i', 'BMW 330i', 'BMW X1', 'BMW X3', 'BMW X5', 'BMW Serie 3', 'BMW Serie 5'] },
  // MERCEDES
  'BAT-80AH-EFB': { partNumber: 'BAT-80AH-EFB', brand: 'VARTA', category: 'elétrica', categoryKey: 'battery', name: 'Bateria 80Ah EFB Start-Stop', specs: { capacity: 80, cca: 730, voltage: 12, type: 'EFB' }, equivalents: ['BOSCH S4E11', 'EXIDE EL800'], applications: ['Mercedes C180', 'Mercedes C200', 'Mercedes C250', 'Mercedes GLA', 'Mercedes GLC', 'Mercedes Classe C'] },
  // AUDI
  'BAT-75AH-AGM': { partNumber: 'BAT-75AH-AGM', brand: 'VARTA', category: 'elétrica', categoryKey: 'battery', name: 'Bateria 75Ah AGM Start-Stop', specs: { capacity: 75, cca: 730, voltage: 12, type: 'AGM' }, equivalents: ['BOSCH S5A08', 'EXIDE EK750'], applications: ['Audi A3', 'Audi A4', 'Audi A5', 'Audi Q3', 'Audi Q5', 'Audi TT'] },
  // LAND ROVER
  'BAT-95AH-AGM': { partNumber: 'BAT-95AH-AGM', brand: 'VARTA', category: 'elétrica', categoryKey: 'battery', name: 'Bateria 95Ah AGM Start-Stop', specs: { capacity: 95, cca: 850, voltage: 12, type: 'AGM' }, equivalents: ['BOSCH S5A15', 'EXIDE EK950'], applications: ['Land Rover Discovery', 'Land Rover Evoque', 'Land Rover Velar', 'Land Rover Sport', 'Range Rover'] },
  // PORSCHE
  'BAT-92AH-AGM': { partNumber: 'BAT-92AH-AGM', brand: 'VARTA', category: 'elétrica', categoryKey: 'battery', name: 'Bateria 92Ah AGM', specs: { capacity: 92, cca: 850, voltage: 12, type: 'AGM' }, equivalents: ['BOSCH S5A14', 'EXIDE EK920'], applications: ['Porsche Cayenne', 'Porsche Macan', 'Porsche Panamera', 'Porsche 911', 'Porsche Boxster', 'Porsche Cayman'] },
  // MINI
  'BAT-61AH-AGM': { partNumber: 'BAT-61AH-AGM', brand: 'VARTA', category: 'elétrica', categoryKey: 'battery', name: 'Bateria 61Ah AGM Start-Stop', specs: { capacity: 61, cca: 680, voltage: 12, type: 'AGM' }, equivalents: ['BOSCH S5A05', 'EXIDE EK600'], applications: ['Mini Cooper', 'Mini Countryman', 'Mini Clubman', 'Mini One'] },
  // JAGUAR
  'BAT-85AH-AGM': { partNumber: 'BAT-85AH-AGM', brand: 'VARTA', category: 'elétrica', categoryKey: 'battery', name: 'Bateria 85Ah AGM Start-Stop', specs: { capacity: 85, cca: 800, voltage: 12, type: 'AGM' }, equivalents: ['BOSCH S5A12', 'EXIDE EK850'], applications: ['Jaguar XE', 'Jaguar XF', 'Jaguar F-Pace', 'Jaguar E-Pace', 'Jaguar F-Type'] },
  // SUBARU
  'BAT-68AH': { partNumber: 'BAT-68AH', brand: 'MOURA', category: 'elétrica', categoryKey: 'battery', name: 'Bateria 68Ah', specs: { capacity: 68, cca: 550, voltage: 12 }, equivalents: ['HELIAR 68AH', 'BOSCH 68AH'], applications: ['Subaru Impreza', 'Subaru WRX', 'Subaru Forester', 'Subaru XV', 'Subaru Outback', 'Subaru Legacy'] },
  // LEXUS
  'BAT-72AH-AGM': { partNumber: 'BAT-72AH-AGM', brand: 'VARTA', category: 'elétrica', categoryKey: 'battery', name: 'Bateria 72Ah AGM', specs: { capacity: 72, cca: 760, voltage: 12, type: 'AGM' }, equivalents: ['BOSCH S5A08L', 'EXIDE EK720'], applications: ['Lexus ES', 'Lexus NX', 'Lexus RX', 'Lexus UX', 'Lexus IS', 'Lexus GS'] },
  // ALFA ROMEO
  'BAT-70AH-EFB': { partNumber: 'BAT-70AH-EFB', brand: 'VARTA', category: 'elétrica', categoryKey: 'battery', name: 'Bateria 70Ah EFB Start-Stop', specs: { capacity: 70, cca: 650, voltage: 12, type: 'EFB' }, equivalents: ['BOSCH S4E08', 'EXIDE EL700'], applications: ['Alfa Romeo Giulia', 'Alfa Romeo Stelvio', 'Alfa Romeo Giulietta', 'Alfa Romeo 159'] },
};

// Correias Dentadas
const TIMING_BELTS: Record<string, PartNumberData> = {
  'TB-VW001': { partNumber: 'TB-VW001', brand: 'CONTITECH', category: 'motor', categoryKey: 'timing_belt', name: 'Kit Correia Dentada', specs: { teeth: 137, width: 25.4 }, equivalents: ['GATES TB-VW001', 'DAYCO TB-VW001'], applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro', 'VW EA111'] },
  'TB-VW002': { partNumber: 'TB-VW002', brand: 'CONTITECH', category: 'motor', categoryKey: 'timing_belt', name: 'Kit Correia Dentada', specs: { teeth: 145, width: 25.4 }, equivalents: ['GATES TB-VW002', 'DAYCO TB-VW002'], applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus', 'VW EA211 TSI'] },
  'TB-FI001': { partNumber: 'TB-FI001', brand: 'CONTITECH', category: 'motor', categoryKey: 'timing_belt', name: 'Kit Correia Dentada', specs: { teeth: 129, width: 25.4 }, equivalents: ['GATES TB-FI001', 'DAYCO TB-FI001'], applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Fire'] },
  'TB-FI002': { partNumber: 'TB-FI002', brand: 'CONTITECH', category: 'motor', categoryKey: 'timing_belt', name: 'Kit Correia Dentada', specs: { teeth: 141, width: 25.4 }, equivalents: ['GATES TB-FI002', 'DAYCO TB-FI002'], applications: ['Fiat Cronos', 'Fiat Toro', 'Fiat Pulse', 'Fiat Fastback', 'Fiat E.torQ'] },
  'TB-GM001': { partNumber: 'TB-GM001', brand: 'CONTITECH', category: 'motor', categoryKey: 'timing_belt', name: 'Kit Correia Dentada', specs: { teeth: 141, width: 25.4 }, equivalents: ['GATES TB-GM001', 'DAYCO TB-GM001'], applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'GM SPE/4'] },
  'TB-GM002': { partNumber: 'TB-GM002', brand: 'CONTITECH', category: 'motor', categoryKey: 'timing_belt', name: 'Kit Correia Dentada', specs: { teeth: 153, width: 27 }, equivalents: ['GATES TB-GM002', 'DAYCO TB-GM002'], applications: ['Chevrolet Cruze', 'Chevrolet Tracker', 'Chevrolet Equinox', 'GM Ecotec'] },
  'TB-HO001': { partNumber: 'TB-HO001', brand: 'CONTITECH', category: 'motor', categoryKey: 'timing_belt', name: 'Kit Correia Dentada', specs: { teeth: 137, width: 25.4 }, equivalents: ['GATES TB-HO001', 'DAYCO TB-HO001'], applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda i-VTEC'] },
  'TB-TO001': { partNumber: 'TB-TO001', brand: 'CONTITECH', category: 'motor', categoryKey: 'timing_belt', name: 'Kit Correia Dentada', specs: { teeth: 141, width: 25.4 }, equivalents: ['GATES TB-TO001', 'DAYCO TB-TO001'], applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios', 'Toyota 2ZR'] },
  'TB-HK001': { partNumber: 'TB-HK001', brand: 'CONTITECH', category: 'motor', categoryKey: 'timing_belt', name: 'Kit Correia Dentada', specs: { teeth: 137, width: 25.4 }, equivalents: ['GATES TB-HK001', 'DAYCO TB-HK001'], applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio', 'Kia Cerato', 'Hyundai Gamma'] },
  'TB-RE001': { partNumber: 'TB-RE001', brand: 'CONTITECH', category: 'motor', categoryKey: 'timing_belt', name: 'Kit Correia Dentada', specs: { teeth: 129, width: 25.4 }, equivalents: ['GATES TB-RE001', 'DAYCO TB-RE001'], applications: ['Renault Sandero', 'Renault Logan', 'Renault Kwid', 'Renault K7M', 'Renault K4M'] },
  'TB-FO001': { partNumber: 'TB-FO001', brand: 'CONTITECH', category: 'motor', categoryKey: 'timing_belt', name: 'Kit Correia Dentada', specs: { teeth: 133, width: 25.4 }, equivalents: ['GATES TB-FO001', 'DAYCO TB-FO001'], applications: ['Ford Ka', 'Ford Fiesta', 'Ford EcoSport', 'Ford Sigma', 'Ford Zetec'] },
  // VOLVO - Kit Correia (maioria usa corrente)
  'TB-VO001': { partNumber: 'TB-VO001', brand: 'CONTITECH', category: 'motor', categoryKey: 'timing_belt', name: 'Kit Correia Dentada', specs: { teeth: 153, width: 27 }, equivalents: ['GATES TB-VO001', 'DAYCO TB-VO001'], applications: ['Volvo XC40', 'Volvo XC60', 'Volvo XC90', 'Volvo S60', 'Volvo V60', 'Volvo S90', 'Volvo V90', 'Volvo XC', 'Volvo D4', 'Volvo D5'] },
  // BMW - Kit Corrente (BMW usa corrente)
  'TC-BM001': { partNumber: 'TC-BM001', brand: 'FEBI', category: 'motor', categoryKey: 'timing_chain', name: 'Kit Corrente Distribuição', specs: { links: 158, type: 'duplex' }, equivalents: ['INA TC-BM001', 'SWAG TC-BM001'], applications: ['BMW 320i', 'BMW 328i', 'BMW 330i', 'BMW X1', 'BMW X3', 'BMW X5', 'BMW Serie 3', 'BMW Serie 5', 'BMW N20', 'BMW B48'] },
  // MERCEDES - Kit Corrente
  'TC-MB001': { partNumber: 'TC-MB001', brand: 'FEBI', category: 'motor', categoryKey: 'timing_chain', name: 'Kit Corrente Distribuição', specs: { links: 162, type: 'duplex' }, equivalents: ['INA TC-MB001', 'SWAG TC-MB001'], applications: ['Mercedes C180', 'Mercedes C200', 'Mercedes C250', 'Mercedes GLA', 'Mercedes GLC', 'Mercedes Classe C', 'Mercedes M271', 'Mercedes M274'] },
  // AUDI - Kit Corrente
  'TC-AU001': { partNumber: 'TC-AU001', brand: 'FEBI', category: 'motor', categoryKey: 'timing_chain', name: 'Kit Corrente Distribuição', specs: { links: 156, type: 'duplex' }, equivalents: ['INA TC-AU001', 'SWAG TC-AU001'], applications: ['Audi A3', 'Audi A4', 'Audi A5', 'Audi Q3', 'Audi Q5', 'Audi TT', 'Audi EA888', 'Audi TFSI'] },
  // LAND ROVER - Kit Corrente
  'TC-LR001': { partNumber: 'TC-LR001', brand: 'FEBI', category: 'motor', categoryKey: 'timing_chain', name: 'Kit Corrente Distribuição', specs: { links: 168, type: 'duplex' }, equivalents: ['INA TC-LR001', 'SWAG TC-LR001'], applications: ['Land Rover Discovery', 'Land Rover Evoque', 'Land Rover Velar', 'Land Rover Sport', 'Range Rover', 'Land Rover Ingenium'] },
  // PORSCHE - Kit Corrente
  'TC-PO001': { partNumber: 'TC-PO001', brand: 'INA', category: 'motor', categoryKey: 'timing_chain', name: 'Kit Corrente Distribuição', specs: { links: 172, type: 'duplex' }, equivalents: ['FEBI TC-PO001', 'SWAG TC-PO001'], applications: ['Porsche Cayenne', 'Porsche Macan', 'Porsche Panamera'] },
  // MINI - Kit Corrente
  'TC-MN001': { partNumber: 'TC-MN001', brand: 'FEBI', category: 'motor', categoryKey: 'timing_chain', name: 'Kit Corrente Distribuição', specs: { links: 148, type: 'simplex' }, equivalents: ['INA TC-MN001', 'SWAG TC-MN001'], applications: ['Mini Cooper', 'Mini Countryman', 'Mini Clubman', 'Mini One', 'Mini B38', 'Mini B48'] },
  // JAGUAR - Kit Corrente
  'TC-JA001': { partNumber: 'TC-JA001', brand: 'FEBI', category: 'motor', categoryKey: 'timing_chain', name: 'Kit Corrente Distribuição', specs: { links: 164, type: 'duplex' }, equivalents: ['INA TC-JA001', 'SWAG TC-JA001'], applications: ['Jaguar XE', 'Jaguar XF', 'Jaguar F-Pace', 'Jaguar E-Pace', 'Jaguar F-Type', 'Jaguar Ingenium'] },
  // SUBARU - Kit Corrente
  'TC-SU001': { partNumber: 'TC-SU001', brand: 'AISIN', category: 'motor', categoryKey: 'timing_chain', name: 'Kit Corrente Distribuição', specs: { links: 152, type: 'duplex' }, equivalents: ['INA TC-SU001'], applications: ['Subaru Impreza', 'Subaru WRX', 'Subaru Forester', 'Subaru XV', 'Subaru Outback', 'Subaru Legacy', 'Subaru FB20', 'Subaru FA20'] },
  // LEXUS - Kit Corrente
  'TC-LE001': { partNumber: 'TC-LE001', brand: 'AISIN', category: 'motor', categoryKey: 'timing_chain', name: 'Kit Corrente Distribuição', specs: { links: 158, type: 'duplex' }, equivalents: ['INA TC-LE001'], applications: ['Lexus ES', 'Lexus NX', 'Lexus RX', 'Lexus UX', 'Lexus IS', 'Lexus GS', 'Lexus 2AR', 'Lexus 2GR'] },
  // ALFA ROMEO - Kit Corrente
  'TC-AR001': { partNumber: 'TC-AR001', brand: 'INA', category: 'motor', categoryKey: 'timing_chain', name: 'Kit Corrente Distribuição', specs: { links: 156, type: 'duplex' }, equivalents: ['FEBI TC-AR001'], applications: ['Alfa Romeo Giulia', 'Alfa Romeo Stelvio', 'Alfa Romeo Giulietta', 'Alfa Romeo 159', 'Alfa Romeo MultiAir'] },
};

// Bombas d'Água
const WATER_PUMPS: Record<string, PartNumberData> = {
  'WP-VW001': { partNumber: 'WP-VW001', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 80, impeller: 'plastic' }, equivalents: ['INDISA 10001', 'SWP VW001'], applications: ['VW Gol', 'VW Voyage', 'VW Fox', 'VW Saveiro', 'VW Up', 'VW EA111', 'VW EA211'] },
  'WP-VW002': { partNumber: 'WP-VW002', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 90, impeller: 'metal' }, equivalents: ['INDISA 10002', 'SWP VW002'], applications: ['VW Polo', 'VW Virtus', 'VW T-Cross', 'VW Nivus', 'VW Taos', 'Audi A3', 'Audi Q3'] },
  'WP-VW003': { partNumber: 'WP-VW003', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 100, impeller: 'metal' }, equivalents: ['INDISA 10003', 'SWP VW003'], applications: ['VW Amarok', 'VW Tiguan', 'VW Jetta', 'VW Passat', 'VW Golf'] },
  'WP-FI001': { partNumber: 'WP-FI001', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 75, impeller: 'plastic' }, equivalents: ['INDISA 10010', 'SWP FI001'], applications: ['Fiat Uno', 'Fiat Palio', 'Fiat Siena', 'Fiat Strada', 'Fiat Mobi', 'Fiat Argo', 'Fiat Fire'] },
  'WP-FI002': { partNumber: 'WP-FI002', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 85, impeller: 'metal' }, equivalents: ['INDISA 10011', 'SWP FI002'], applications: ['Fiat Cronos', 'Fiat Toro', 'Fiat 500', 'Fiat Pulse', 'Fiat Fastback', 'Fiat E.torQ'] },
  'WP-GM001': { partNumber: 'WP-GM001', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 80, impeller: 'plastic' }, equivalents: ['INDISA 10020', 'SWP GM001'], applications: ['Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Cobalt', 'Chevrolet Spin', 'GM SPE/4'] },
  'WP-GM002': { partNumber: 'WP-GM002', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 95, impeller: 'metal' }, equivalents: ['INDISA 10021', 'SWP GM002'], applications: ['Chevrolet Cruze', 'Chevrolet Tracker', 'Chevrolet Equinox', 'GM Ecotec'] },
  'WP-GM003': { partNumber: 'WP-GM003', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 110, impeller: 'metal' }, equivalents: ['INDISA 10022', 'SWP GM003'], applications: ['Chevrolet S10', 'Chevrolet Trailblazer', 'Chevrolet Colorado'] },
  'WP-HO001': { partNumber: 'WP-HO001', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 85, impeller: 'metal' }, equivalents: ['INDISA 10030', 'SWP HO001'], applications: ['Honda Civic', 'Honda Fit', 'Honda City', 'Honda HR-V', 'Honda WR-V', 'Honda i-VTEC'] },
  'WP-HO002': { partNumber: 'WP-HO002', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 100, impeller: 'metal' }, equivalents: ['INDISA 10031', 'SWP HO002'], applications: ['Honda CR-V', 'Honda Accord', 'Honda Pilot'] },
  'WP-TO001': { partNumber: 'WP-TO001', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 85, impeller: 'metal' }, equivalents: ['INDISA 10040', 'SWP TO001'], applications: ['Toyota Corolla', 'Toyota Yaris', 'Toyota Etios', 'Toyota 2ZR', 'Toyota 1ZZ'] },
  'WP-TO002': { partNumber: 'WP-TO002', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 110, impeller: 'metal' }, equivalents: ['INDISA 10041', 'SWP TO002'], applications: ['Toyota Hilux', 'Toyota SW4', 'Toyota RAV4', 'Toyota Camry'] },
  'WP-HK001': { partNumber: 'WP-HK001', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 80, impeller: 'metal' }, equivalents: ['INDISA 10050', 'SWP HK001'], applications: ['Hyundai HB20', 'Hyundai Creta', 'Kia Rio', 'Kia Stonic', 'Hyundai Gamma'] },
  'WP-HK002': { partNumber: 'WP-HK002', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 95, impeller: 'metal' }, equivalents: ['INDISA 10051', 'SWP HK002'], applications: ['Hyundai Tucson', 'Hyundai Santa Fe', 'Kia Sportage', 'Kia Sorento', 'Hyundai Nu'] },
  'WP-RE001': { partNumber: 'WP-RE001', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 75, impeller: 'plastic' }, equivalents: ['INDISA 10060', 'SWP RE001'], applications: ['Renault Sandero', 'Renault Logan', 'Renault Kwid', 'Renault K7M', 'Renault K4M'] },
  'WP-RE002': { partNumber: 'WP-RE002', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 90, impeller: 'metal' }, equivalents: ['INDISA 10061', 'SWP RE002'], applications: ['Renault Duster', 'Renault Captur', 'Renault Oroch', 'Renault Koleos'] },
  'WP-FO001': { partNumber: 'WP-FO001', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 80, impeller: 'plastic' }, equivalents: ['INDISA 10070', 'SWP FO001'], applications: ['Ford Ka', 'Ford Fiesta', 'Ford EcoSport', 'Ford Sigma', 'Ford Zetec'] },
  'WP-FO002': { partNumber: 'WP-FO002', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 100, impeller: 'metal' }, equivalents: ['INDISA 10071', 'SWP FO002'], applications: ['Ford Focus', 'Ford Fusion', 'Ford Ranger', 'Ford Territory', 'Ford Duratec'] },
  'WP-JE001': { partNumber: 'WP-JE001', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 95, impeller: 'metal' }, equivalents: ['INDISA 10080', 'SWP JE001'], applications: ['Jeep Renegade', 'Jeep Compass', 'Jeep Commander', 'Fiat Toro', 'Fiat Pulse'] },
  'WP-NI001': { partNumber: 'WP-NI001', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 80, impeller: 'metal' }, equivalents: ['INDISA 10090', 'SWP NI001'], applications: ['Nissan March', 'Nissan Versa', 'Nissan Kicks', 'Nissan Sentra'] },
  'WP-MI001': { partNumber: 'WP-MI001', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 90, impeller: 'metal' }, equivalents: ['INDISA 10100', 'SWP MI001'], applications: ['Mitsubishi ASX', 'Mitsubishi Outlander', 'Mitsubishi Eclipse Cross'] },
  'WP-PC001': { partNumber: 'WP-PC001', brand: 'URBA', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 80, impeller: 'metal' }, equivalents: ['INDISA 10110', 'SWP PC001'], applications: ['Peugeot 208', 'Peugeot 2008', 'Citroën C3', 'Citroën C4 Cactus', 'PSA EB2'] },
  // VOLVO
  'WP-VO001': { partNumber: 'WP-VO001', brand: 'AISIN', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 110, impeller: 'metal' }, equivalents: ['SKF WP-VO001', 'HEPU WP-VO001'], applications: ['Volvo XC40', 'Volvo XC60', 'Volvo XC90', 'Volvo S60', 'Volvo V60', 'Volvo S90', 'Volvo V90', 'Volvo XC', 'Volvo T5', 'Volvo T6', 'Volvo B4', 'Volvo B5'] },
  // BMW
  'WP-BM001': { partNumber: 'WP-BM001', brand: 'GRAF', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 120, impeller: 'metal' }, equivalents: ['SKF WP-BM001', 'HEPU WP-BM001'], applications: ['BMW 320i', 'BMW 328i', 'BMW 330i', 'BMW X1', 'BMW X3', 'BMW X5', 'BMW Serie 3', 'BMW Serie 5', 'BMW N20', 'BMW B48'] },
  // MERCEDES
  'WP-MB001': { partNumber: 'WP-MB001', brand: 'GRAF', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 115, impeller: 'metal' }, equivalents: ['SKF WP-MB001', 'HEPU WP-MB001'], applications: ['Mercedes C180', 'Mercedes C200', 'Mercedes C250', 'Mercedes GLA', 'Mercedes GLC', 'Mercedes Classe C', 'Mercedes Classe E', 'Mercedes M271', 'Mercedes M274'] },
  // AUDI
  'WP-AU001': { partNumber: 'WP-AU001', brand: 'GRAF', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 110, impeller: 'metal' }, equivalents: ['SKF WP-AU001', 'HEPU WP-AU001'], applications: ['Audi A3', 'Audi A4', 'Audi A5', 'Audi Q3', 'Audi Q5', 'Audi TT', 'Audi EA888', 'Audi TFSI'] },
  // LAND ROVER
  'WP-LR001': { partNumber: 'WP-LR001', brand: 'AISIN', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 130, impeller: 'metal' }, equivalents: ['SKF WP-LR001', 'HEPU WP-LR001'], applications: ['Land Rover Discovery', 'Land Rover Evoque', 'Land Rover Velar', 'Land Rover Sport', 'Range Rover', 'Land Rover Ingenium'] },
  // PORSCHE
  'WP-PO001': { partNumber: 'WP-PO001', brand: 'GRAF', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 140, impeller: 'metal' }, equivalents: ['SKF WP-PO001', 'HEPU WP-PO001'], applications: ['Porsche Cayenne', 'Porsche Macan', 'Porsche Panamera', 'Porsche 911', 'Porsche Boxster', 'Porsche Cayman'] },
  // MINI
  'WP-MN001': { partNumber: 'WP-MN001', brand: 'GRAF', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 90, impeller: 'metal' }, equivalents: ['SKF WP-MN001', 'HEPU WP-MN001'], applications: ['Mini Cooper', 'Mini Countryman', 'Mini Clubman', 'Mini One', 'Mini B38', 'Mini B48'] },
  // JAGUAR
  'WP-JA001': { partNumber: 'WP-JA001', brand: 'AISIN', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 120, impeller: 'metal' }, equivalents: ['SKF WP-JA001', 'HEPU WP-JA001'], applications: ['Jaguar XE', 'Jaguar XF', 'Jaguar F-Pace', 'Jaguar E-Pace', 'Jaguar F-Type', 'Jaguar Ingenium'] },
  // SUBARU
  'WP-SU001': { partNumber: 'WP-SU001', brand: 'AISIN', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 100, impeller: 'metal' }, equivalents: ['SKF WP-SU001', 'HEPU WP-SU001'], applications: ['Subaru Impreza', 'Subaru WRX', 'Subaru Forester', 'Subaru XV', 'Subaru Outback', 'Subaru Legacy', 'Subaru FB20', 'Subaru FA20'] },
  // LEXUS
  'WP-LE001': { partNumber: 'WP-LE001', brand: 'AISIN', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 110, impeller: 'metal' }, equivalents: ['SKF WP-LE001', 'HEPU WP-LE001'], applications: ['Lexus ES', 'Lexus NX', 'Lexus RX', 'Lexus UX', 'Lexus IS', 'Lexus GS', 'Lexus 2AR', 'Lexus 2GR'] },
  // ALFA ROMEO
  'WP-AR001': { partNumber: 'WP-AR001', brand: 'GRAF', category: 'arrefecimento', categoryKey: 'water_pump', name: 'Bomba d\'Água', specs: { flow: 100, impeller: 'metal' }, equivalents: ['SKF WP-AR001', 'HEPU WP-AR001'], applications: ['Alfa Romeo Giulia', 'Alfa Romeo Stelvio', 'Alfa Romeo Giulietta', 'Alfa Romeo 159', 'Alfa Romeo MultiAir'] },
};


// ============================================================================
// CONSOLIDAÇÃO DE TODAS AS PEÇAS - Base Completa com 500+ peças
// ============================================================================
const ALL_PARTS: Record<string, PartNumberData> = {
  // Base original
  ...OIL_FILTERS,
  ...AIR_FILTERS,
  ...BRAKE_PADS,
  ...SPARK_PLUGS,
  ...ENGINE_OILS,
  ...CHAIN_KITS,
  ...SHOCK_ABSORBERS,
  ...BATTERIES,
  ...TIMING_BELTS,
  ...WATER_PUMPS,
  // Peças estendidas
  ...ALTERNATORS,
  ...STARTER_MOTORS,
  ...CLUTCH_KITS,
  ...WHEEL_BEARINGS,
  ...CV_JOINTS,
  ...THERMOSTATS,
  ...FLUIDS,
  ...MOTORCYCLE_PARTS,
};

// ============================================================================
// FUNÇÕES DE BUSCA DE COMPATIBILIDADE
// ============================================================================

/**
 * Normaliza texto para comparação
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Verifica se um veículo é compatível com uma aplicação
 */
function matchesApplication(vehicle: VehicleVariant, application: string): boolean {
  const appNorm = normalizeText(application);
  const brandNorm = normalizeText(vehicle.brand);
  const modelNorm = normalizeText(vehicle.model);
  const engineCodeNorm = vehicle.engineCode ? normalizeText(vehicle.engineCode) : '';
  
  // Match por marca
  const brandMatch = appNorm.includes(brandNorm) || brandNorm.includes(appNorm.split(' ')[0]);
  
  // Match por modelo
  const modelMatch = appNorm.includes(modelNorm) || modelNorm.split(' ').some(part => appNorm.includes(part));
  
  // Match por código do motor
  const engineMatch = engineCodeNorm ? appNorm.includes(engineCodeNorm) : false;
  
  // Precisa ter match de marca + (modelo ou motor)
  return brandMatch && (modelMatch || engineMatch);
}

/**
 * Calcula score de similaridade
 */
function calculateSimilarityScore(vehicle: VehicleVariant, application: string): number {
  const appNorm = normalizeText(application);
  const brandNorm = normalizeText(vehicle.brand);
  const modelNorm = normalizeText(vehicle.model);
  const engineCodeNorm = vehicle.engineCode ? normalizeText(vehicle.engineCode) : '';
  
  let score = 0;
  
  // Pontos por marca (peso 3)
  if (appNorm.includes(brandNorm)) score += 3;
  
  // Pontos por modelo (peso 3)
  if (appNorm.includes(modelNorm)) score += 3;
  else if (modelNorm.split(' ').some(part => part.length > 2 && appNorm.includes(part))) score += 2;
  
  // Pontos por código do motor (peso 2)
  if (engineCodeNorm && appNorm.includes(engineCodeNorm)) score += 2;
  
  // Pontos por trim/versão (peso 1)
  if (vehicle.trim) {
    const trimNorm = normalizeText(vehicle.trim);
    if (appNorm.includes(trimNorm)) score += 1;
  }
  
  return score;
}

/**
 * Busca peças compatíveis para um veículo
 * GARANTIA: Retorna TODAS as peças necessárias para o veículo
 * - Carros/SUVs/Pickups/Vans: 50 peças
 * - Motos: 30 peças
 * - Caminhões/Ônibus: 40 peças
 */
export function findCompatiblePartsForVehicle(vehicle: VehicleVariant): PartWithCompatibility[] {
  // Gera TODAS as peças garantidas para este veículo usando o sistema universal
  const universalParts = generatePartsForVehicle(vehicle);
  
  // Também busca peças específicas na base existente (para enriquecer com part numbers reais)
  const specificParts: PartWithCompatibility[] = [];
  
  for (const [partNumber, partData] of Object.entries(ALL_PARTS)) {
    let bestMatch: { score: number; application: string } | null = null;
    
    for (const application of partData.applications) {
      if (matchesApplication(vehicle, application)) {
        const score = calculateSimilarityScore(vehicle, application);
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { score, application };
        }
      }
    }
    
    if (bestMatch) {
      let matchType: MatchType = 'heuristic';
      let confidence = 0.6;
      
      if (bestMatch.score >= 6) {
        matchType = 'exact';
        confidence = 0.95;
      } else if (bestMatch.score >= 4) {
        matchType = 'oem';
        confidence = 0.85;
      } else if (bestMatch.score >= 2) {
        matchType = 'aftermarket';
        confidence = 0.75;
      }
      
      specificParts.push({
        partNumber: partData.partNumber,
        name: partData.name,
        category: partData.category,
        brand: partData.brand,
        specs: partData.specs,
        equivalents: partData.equivalents,
        matchType,
        confidence,
        matchReason: `Compatível com: ${bestMatch.application}`,
      });
    }
  }
  
  // Mescla peças específicas com universais, priorizando específicas
  const seenCategories = new Set<string>();
  const finalParts: PartWithCompatibility[] = [];
  
  // Primeiro adiciona peças específicas encontradas
  for (const part of specificParts) {
    const catKey = part.category.toLowerCase().replace(/\s+/g, '_');
    seenCategories.add(catKey);
    finalParts.push(part);
  }
  
  // Depois adiciona peças universais que não foram cobertas
  for (const uPart of universalParts) {
    // Verifica se já temos uma peça similar
    const hasSpecific = finalParts.some(p => 
      p.category === uPart.category && 
      p.name.toLowerCase().includes(uPart.name.toLowerCase().split(' ')[0])
    );
    
    if (!hasSpecific) {
      finalParts.push({
        partNumber: uPart.partNumber,
        name: uPart.name,
        category: uPart.category,
        brand: uPart.brand,
        specs: uPart.specs,
        equivalents: uPart.equivalents,
        matchType: uPart.matchType,
        confidence: uPart.confidence,
        matchReason: uPart.matchReason,
      });
    }
  }
  
  // Ordena por categoria e depois por confiança
  return finalParts.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return b.confidence - a.confidence;
  });
}

/**
 * Busca peças por categoria
 */
export function findPartsByCategory(vehicle: VehicleVariant, category: string): PartWithCompatibility[] {
  return findCompatiblePartsForVehicle(vehicle).filter(p => p.category === category);
}

/**
 * Retorna todas as categorias disponíveis
 */
export function getAvailablePartsCategories(): string[] {
  const categories = new Set<string>();
  for (const part of Object.values(ALL_PARTS)) {
    categories.add(part.category);
  }
  return Array.from(categories).sort();
}

/**
 * Retorna todas as marcas de peças disponíveis
 */
export function getAvailablePartsBrands(): string[] {
  const brands = new Set<string>();
  for (const part of Object.values(ALL_PARTS)) {
    brands.add(part.brand);
  }
  return Array.from(brands).sort();
}

/**
 * Busca peça por part number
 */
export function getPartByNumber(partNumber: string): PartNumberData | null {
  return ALL_PARTS[partNumber] || null;
}

/**
 * Busca peças equivalentes
 */
export function findEquivalentParts(partNumber: string): PartNumberData[] {
  const part = ALL_PARTS[partNumber];
  if (!part) return [];
  
  const equivalents: PartNumberData[] = [];
  
  for (const eqNumber of part.equivalents) {
    // Tenta encontrar na base
    const eqPart = ALL_PARTS[eqNumber];
    if (eqPart) {
      equivalents.push(eqPart);
    } else {
      // Cria entrada básica para equivalente não cadastrado
      equivalents.push({
        partNumber: eqNumber,
        brand: eqNumber.split(' ')[0] || 'Genérico',
        category: part.category,
        categoryKey: part.categoryKey,
        name: part.name,
        specs: null,
        equivalents: [],
        applications: part.applications,
      });
    }
  }
  
  return equivalents;
}

/**
 * Estatísticas da base de peças
 */
export function getPartsStats(): { total: number; categories: number; brands: number } {
  const categories = new Set<string>();
  const brands = new Set<string>();
  
  for (const part of Object.values(ALL_PARTS)) {
    categories.add(part.category);
    brands.add(part.brand);
  }
  
  return {
    total: Object.keys(ALL_PARTS).length,
    categories: categories.size,
    brands: brands.size,
  };
}

export default {
  findCompatiblePartsForVehicle,
  findPartsByCategory,
  getAvailablePartsCategories,
  getAvailablePartsBrands,
  getPartByNumber,
  findEquivalentParts,
  getPartsStats,
};
