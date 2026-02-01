/**
 * Brazilian Vehicles Database - COMPLETE EDITION
 * Base de dados COMPLETA de TODOS os veículos que rodam no Brasil
 * @version 5.0.0
 */

import type { VehicleVariant, FuelType, BodyType, VehicleType, TransmissionType } from '../types';

// Helper para gerar ID
const genId = (brand: string, model: string, year: number, engine?: string, trim?: string): string => {
  const parts = [brand, model, year.toString()];
  if (engine) parts.push(engine.replace(/[^a-zA-Z0-9]/g, ''));
  if (trim) parts.push(trim.replace(/[^a-zA-Z0-9]/g, ''));
  return parts.join('_').toLowerCase().replace(/\s+/g, '_');
};

interface VehicleBase {
  brand: string;
  model: string;
  trim?: string;
  engineCode?: string;
  engineName?: string;
  displacementCc?: number;
  fuel: FuelType;
  transmission?: TransmissionType;
  bodyType: BodyType;
  vehicleType: VehicleType;
  power?: string;
  sources: ('fipe' | 'tecdoc' | 'oem' | 'manual' | 'aftermarket' | 'scraper')[];
}

const gen = (base: VehicleBase, startYear: number, endYear: number): VehicleVariant[] => {
  const variants: VehicleVariant[] = [];
  for (let year = startYear; year <= endYear; year++) {
    variants.push({
      ...base,
      id: genId(base.brand, base.model, year, base.engineCode, base.trim),
      year,
      lastUpdated: new Date().toISOString(),
    });
  }
  return variants;
};

// ============================================================================
// VOLKSWAGEN
// ============================================================================
const VW: VehicleVariant[] = [
  ...gen({ brand: 'Volkswagen', model: 'Fusca', trim: '1300', engineCode: 'Boxer', engineName: '1.3', displacementCc: 1285, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '46cv', sources: ['fipe'] }, 1967, 1986),
  ...gen({ brand: 'Volkswagen', model: 'Fusca', trim: '1600', engineCode: 'Boxer', engineName: '1.6', displacementCc: 1584, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '65cv', sources: ['fipe'] }, 1975, 1996),
  ...gen({ brand: 'Volkswagen', model: 'Brasília', trim: '1600', engineCode: 'Boxer', engineName: '1.6', displacementCc: 1584, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '65cv', sources: ['fipe'] }, 1973, 1982),
  ...gen({ brand: 'Volkswagen', model: 'Kombi', trim: '1.4', engineCode: 'EA111', engineName: '1.4 8V', displacementCc: 1390, fuel: 'flex', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '80cv', sources: ['fipe'] }, 1997, 2014),
  ...gen({ brand: 'Volkswagen', model: 'Gol', trim: '1.0', engineCode: 'EA111', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '76cv', sources: ['fipe'] }, 1995, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Gol', trim: '1.6', engineCode: 'EA111', engineName: '1.6 8V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '101cv', sources: ['fipe'] }, 1995, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Gol', trim: 'GTI', engineCode: 'AP', engineName: '2.0 16V', displacementCc: 1984, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '150cv', sources: ['fipe'] }, 1988, 1996),
  ...gen({ brand: 'Volkswagen', model: 'Voyage', trim: '1.0', engineCode: 'EA211', engineName: '1.0 MPI', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '84cv', sources: ['fipe'] }, 2008, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Voyage', trim: '1.6', engineCode: 'EA211', engineName: '1.6 MSI', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '120cv', sources: ['fipe'] }, 2008, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Saveiro', trim: '1.6', engineCode: 'EA211', engineName: '1.6 MSI', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '120cv', sources: ['fipe'] }, 1998, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Fox', trim: '1.0', engineCode: 'EA111', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '76cv', sources: ['fipe'] }, 2003, 2021),
  ...gen({ brand: 'Volkswagen', model: 'Fox', trim: '1.6', engineCode: 'EA211', engineName: '1.6 MSI', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '120cv', sources: ['fipe'] }, 2003, 2021),
  ...gen({ brand: 'Volkswagen', model: 'CrossFox', trim: '1.6', engineCode: 'EA211', engineName: '1.6 MSI', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '120cv', sources: ['fipe'] }, 2005, 2021),
  ...gen({ brand: 'Volkswagen', model: 'SpaceFox', trim: '1.6', engineCode: 'EA211', engineName: '1.6 MSI', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'wagon', vehicleType: 'car', power: '120cv', sources: ['fipe'] }, 2006, 2018),
  ...gen({ brand: 'Volkswagen', model: 'Golf', trim: '1.6', engineCode: 'EA111', engineName: '1.6 8V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '101cv', sources: ['fipe'] }, 1999, 2013),
  ...gen({ brand: 'Volkswagen', model: 'Golf', trim: 'GTI', engineCode: 'EA888', engineName: '2.0 TSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '230cv', sources: ['fipe'] }, 2014, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Golf', trim: '1.4 TSI', engineCode: 'CZCA', engineName: '1.4 TSI', displacementCc: 1395, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '150cv', sources: ['fipe'] }, 2014, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Polo', trim: '1.0 MPI', engineCode: 'EA211', engineName: '1.0 MPI', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '84cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Polo', trim: '1.0 TSI', engineCode: 'DKLA', engineName: '1.0 TSI', displacementCc: 999, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '128cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Polo', trim: 'GTS', engineCode: 'EA211', engineName: '1.4 TSI', displacementCc: 1395, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '150cv', sources: ['fipe'] }, 2020, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Virtus', trim: '1.0 MPI', engineCode: 'EA211', engineName: '1.0 MPI', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '84cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Virtus', trim: '1.0 TSI', engineCode: 'DKLA', engineName: '1.0 TSI', displacementCc: 999, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '128cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Jetta', trim: '1.4 TSI', engineCode: 'EA211', engineName: '1.4 TSI', displacementCc: 1395, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '150cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Jetta', trim: 'GLI', engineCode: 'EA888', engineName: '2.0 TSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '230cv', sources: ['fipe'] }, 2019, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Passat', trim: '2.0 TSI', engineCode: 'EA888', engineName: '2.0 TSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '220cv', sources: ['fipe'] }, 2011, 2020),
  ...gen({ brand: 'Volkswagen', model: 'Santana', trim: '2.0', engineCode: 'AP', engineName: '2.0 8V', displacementCc: 1984, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '115cv', sources: ['fipe'] }, 1984, 2006),
  ...gen({ brand: 'Volkswagen', model: 'Parati', trim: '1.6', engineCode: 'AP', engineName: '1.6 8V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'wagon', vehicleType: 'car', power: '101cv', sources: ['fipe'] }, 1982, 2013),
  ...gen({ brand: 'Volkswagen', model: 'T-Cross', trim: '1.0 TSI', engineCode: 'DKLA', engineName: '1.0 TSI', displacementCc: 999, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '128cv', sources: ['fipe'] }, 2019, 2024),
  ...gen({ brand: 'Volkswagen', model: 'T-Cross', trim: '1.4 TSI', engineCode: 'EA211', engineName: '1.4 TSI', displacementCc: 1395, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '150cv', sources: ['fipe'] }, 2019, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Nivus', trim: '1.0 TSI', engineCode: 'DKLA', engineName: '1.0 TSI', displacementCc: 999, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '128cv', sources: ['fipe'] }, 2020, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Taos', trim: '1.4 TSI', engineCode: 'EA211', engineName: '1.4 TSI', displacementCc: 1395, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '150cv', sources: ['fipe'] }, 2021, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Tiguan', trim: '2.0 TSI', engineCode: 'EA888', engineName: '2.0 TSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '220cv', sources: ['fipe'] }, 2009, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Amarok', trim: '2.0 TDI', engineCode: 'CDCA', engineName: '2.0 TDI', displacementCc: 1968, fuel: 'diesel', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '140cv', sources: ['fipe'] }, 2010, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Amarok', trim: '3.0 V6 TDI', engineCode: 'DDXC', engineName: '3.0 V6 TDI', displacementCc: 2967, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '258cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Up!', trim: '1.0 MPI', engineCode: 'EA211', engineName: '1.0 MPI', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '82cv', sources: ['fipe'] }, 2014, 2021),
  ...gen({ brand: 'Volkswagen', model: 'Up!', trim: '1.0 TSI', engineCode: 'EA211', engineName: '1.0 TSI', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '105cv', sources: ['fipe'] }, 2016, 2021),
  ...gen({ brand: 'Volkswagen', model: 'Delivery 9.170', trim: 'Diesel', engineCode: 'MWM', engineName: '4.8 Diesel', displacementCc: 4800, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '170cv', sources: ['fipe'] }, 2012, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Constellation 24.280', trim: 'Diesel', engineCode: 'MWM', engineName: '6.9 Diesel', displacementCc: 6900, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '280cv', sources: ['fipe'] }, 2006, 2024),
  ...gen({ brand: 'Volkswagen', model: 'Volksbus 17.230', trim: 'Diesel', engineCode: 'MWM', engineName: '6.9 Diesel', displacementCc: 6900, fuel: 'diesel', transmission: 'manual', bodyType: 'bus', vehicleType: 'bus', power: '230cv', sources: ['fipe'] }, 2010, 2024),
];

// ============================================================================
// CHEVROLET/GM
// ============================================================================
const CHEVROLET: VehicleVariant[] = [
  ...gen({ brand: 'Chevrolet', model: 'Celta', trim: '1.0', engineCode: 'VHCE', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '78cv', sources: ['fipe'] }, 2000, 2015),
  ...gen({ brand: 'Chevrolet', model: 'Prisma', trim: '1.0', engineCode: 'VHCE', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '78cv', sources: ['fipe'] }, 2006, 2019),
  ...gen({ brand: 'Chevrolet', model: 'Prisma', trim: '1.4', engineCode: 'VHCE', engineName: '1.4 8V', displacementCc: 1389, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '106cv', sources: ['fipe'] }, 2006, 2019),
  ...gen({ brand: 'Chevrolet', model: 'Corsa', trim: '1.0', engineCode: 'VHCE', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '78cv', sources: ['fipe'] }, 1994, 2012),
  ...gen({ brand: 'Chevrolet', model: 'Corsa', trim: '1.4', engineCode: 'VHCE', engineName: '1.4 8V', displacementCc: 1389, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '95cv', sources: ['fipe'] }, 1994, 2012),
  ...gen({ brand: 'Chevrolet', model: 'Classic', trim: '1.0', engineCode: 'VHCE', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '78cv', sources: ['fipe'] }, 2010, 2016),
  ...gen({ brand: 'Chevrolet', model: 'Astra', trim: '2.0', engineCode: 'Ecotec', engineName: '2.0 8V', displacementCc: 1998, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '121cv', sources: ['fipe'] }, 1998, 2011),
  ...gen({ brand: 'Chevrolet', model: 'Vectra', trim: '2.0', engineCode: 'Ecotec', engineName: '2.0 8V', displacementCc: 1998, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '140cv', sources: ['fipe'] }, 1996, 2011),
  ...gen({ brand: 'Chevrolet', model: 'Omega', trim: '3.6 V6', engineCode: 'HFV6', engineName: '3.6 V6', displacementCc: 3564, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '292cv', sources: ['fipe'] }, 2005, 2011),
  ...gen({ brand: 'Chevrolet', model: 'Onix', trim: '1.0', engineCode: 'SPE/4', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '80cv', sources: ['fipe'] }, 2012, 2019),
  ...gen({ brand: 'Chevrolet', model: 'Onix', trim: '1.4', engineCode: 'SPE/4', engineName: '1.4 8V', displacementCc: 1389, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '106cv', sources: ['fipe'] }, 2012, 2019),
  ...gen({ brand: 'Chevrolet', model: 'Onix', trim: '1.0 Turbo', engineCode: 'B12D1', engineName: '1.0 Turbo', displacementCc: 999, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '116cv', sources: ['fipe'] }, 2020, 2024),
  ...gen({ brand: 'Chevrolet', model: 'Onix Plus', trim: '1.0 Turbo', engineCode: 'B12D1', engineName: '1.0 Turbo', displacementCc: 999, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '116cv', sources: ['fipe'] }, 2020, 2024),
  ...gen({ brand: 'Chevrolet', model: 'Cruze', trim: '1.4 Turbo', engineCode: 'LE2', engineName: '1.4 Turbo', displacementCc: 1399, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '153cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Chevrolet', model: 'Cruze Sport6', trim: '1.4 Turbo', engineCode: 'LE2', engineName: '1.4 Turbo', displacementCc: 1399, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '153cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Chevrolet', model: 'Cobalt', trim: '1.4', engineCode: 'SPE/4', engineName: '1.4 8V', displacementCc: 1389, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '106cv', sources: ['fipe'] }, 2011, 2020),
  ...gen({ brand: 'Chevrolet', model: 'Spin', trim: '1.8', engineCode: 'Ecotec', engineName: '1.8 8V', displacementCc: 1796, fuel: 'flex', transmission: 'automatic', bodyType: 'van', vehicleType: 'van', power: '111cv', sources: ['fipe'] }, 2012, 2024),
  ...gen({ brand: 'Chevrolet', model: 'Tracker', trim: '1.0 Turbo', engineCode: 'B12D1', engineName: '1.0 Turbo', displacementCc: 999, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '116cv', sources: ['fipe'] }, 2020, 2024),
  ...gen({ brand: 'Chevrolet', model: 'Tracker', trim: '1.2 Turbo', engineCode: 'HRA', engineName: '1.2 Turbo', displacementCc: 1199, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '133cv', sources: ['fipe'] }, 2021, 2024),
  ...gen({ brand: 'Chevrolet', model: 'Equinox', trim: '2.0 Turbo', engineCode: 'LTG', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '262cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Chevrolet', model: 'Trailblazer', trim: '2.8 Diesel', engineCode: 'LWH', engineName: '2.8 Diesel', displacementCc: 2776, fuel: 'diesel', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '200cv', sources: ['fipe'] }, 2012, 2024),
  ...gen({ brand: 'Chevrolet', model: 'Montana', trim: '1.4', engineCode: 'SPE/4', engineName: '1.4 8V', displacementCc: 1389, fuel: 'flex', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '106cv', sources: ['fipe'] }, 2003, 2022),
  ...gen({ brand: 'Chevrolet', model: 'Montana', trim: '1.2 Turbo', engineCode: 'HRA', engineName: '1.2 Turbo', displacementCc: 1199, fuel: 'flex', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '133cv', sources: ['fipe'] }, 2023, 2024),
  ...gen({ brand: 'Chevrolet', model: 'S10', trim: '2.4', engineCode: 'Ecotec', engineName: '2.4 16V', displacementCc: 2384, fuel: 'flex', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '147cv', sources: ['fipe'] }, 1995, 2024),
  ...gen({ brand: 'Chevrolet', model: 'S10', trim: '2.8 Diesel', engineCode: 'LWH', engineName: '2.8 Diesel', displacementCc: 2776, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '200cv', sources: ['fipe'] }, 2012, 2024),
  ...gen({ brand: 'Chevrolet', model: 'Camaro', trim: 'SS 6.2 V8', engineCode: 'LT1', engineName: '6.2 V8', displacementCc: 6162, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '461cv', sources: ['fipe'] }, 2010, 2024),
  ...gen({ brand: 'Chevrolet', model: 'Opala', trim: '4.1', engineCode: 'OHC', engineName: '4.1 6cil', displacementCc: 4093, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '140cv', sources: ['fipe'] }, 1968, 1992),
  ...gen({ brand: 'Chevrolet', model: 'Chevette', trim: '1.6', engineCode: 'OHC', engineName: '1.6 8V', displacementCc: 1598, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '73cv', sources: ['fipe'] }, 1973, 1993),
  ...gen({ brand: 'Chevrolet', model: 'Monza', trim: '2.0', engineCode: 'OHC', engineName: '2.0 8V', displacementCc: 1998, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '110cv', sources: ['fipe'] }, 1982, 1996),
  ...gen({ brand: 'Chevrolet', model: 'Kadett', trim: '2.0', engineCode: 'OHC', engineName: '2.0 8V', displacementCc: 1998, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '110cv', sources: ['fipe'] }, 1989, 1998),
];

// ============================================================================
// FIAT
// ============================================================================
const FIAT: VehicleVariant[] = [
  ...gen({ brand: 'Fiat', model: 'Uno', trim: '1.0', engineCode: 'Fire', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '75cv', sources: ['fipe'] }, 1984, 2021),
  ...gen({ brand: 'Fiat', model: 'Uno', trim: '1.4', engineCode: 'Fire', engineName: '1.4 8V', displacementCc: 1368, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '88cv', sources: ['fipe'] }, 2010, 2021),
  ...gen({ brand: 'Fiat', model: 'Palio', trim: '1.0', engineCode: 'Fire', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '75cv', sources: ['fipe'] }, 1996, 2017),
  ...gen({ brand: 'Fiat', model: 'Palio', trim: '1.4', engineCode: 'Fire', engineName: '1.4 8V', displacementCc: 1368, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '88cv', sources: ['fipe'] }, 1996, 2017),
  ...gen({ brand: 'Fiat', model: 'Palio Weekend', trim: '1.4', engineCode: 'Fire', engineName: '1.4 8V', displacementCc: 1368, fuel: 'flex', transmission: 'manual', bodyType: 'wagon', vehicleType: 'car', power: '88cv', sources: ['fipe'] }, 1997, 2017),
  ...gen({ brand: 'Fiat', model: 'Siena', trim: '1.0', engineCode: 'Fire', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '75cv', sources: ['fipe'] }, 1997, 2012),
  ...gen({ brand: 'Fiat', model: 'Siena', trim: '1.4', engineCode: 'Fire', engineName: '1.4 8V', displacementCc: 1368, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '88cv', sources: ['fipe'] }, 1997, 2012),
  ...gen({ brand: 'Fiat', model: 'Grand Siena', trim: '1.4', engineCode: 'Fire', engineName: '1.4 8V', displacementCc: 1368, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '88cv', sources: ['fipe'] }, 2012, 2021),
  ...gen({ brand: 'Fiat', model: 'Strada', trim: '1.4', engineCode: 'Fire', engineName: '1.4 8V', displacementCc: 1368, fuel: 'flex', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '88cv', sources: ['fipe'] }, 1998, 2024),
  ...gen({ brand: 'Fiat', model: 'Strada', trim: '1.3 Firefly', engineCode: 'Firefly', engineName: '1.3 Firefly', displacementCc: 1332, fuel: 'flex', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '109cv', sources: ['fipe'] }, 2020, 2024),
  ...gen({ brand: 'Fiat', model: 'Argo', trim: '1.0', engineCode: 'Firefly', engineName: '1.0 Firefly', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '77cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Fiat', model: 'Argo', trim: '1.3', engineCode: 'Firefly', engineName: '1.3 Firefly', displacementCc: 1332, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '109cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Fiat', model: 'Cronos', trim: '1.3', engineCode: 'Firefly', engineName: '1.3 Firefly', displacementCc: 1332, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '109cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Fiat', model: 'Cronos', trim: '1.8', engineCode: 'E.torQ', engineName: '1.8 16V', displacementCc: 1796, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '139cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Fiat', model: 'Mobi', trim: '1.0', engineCode: 'Firefly', engineName: '1.0 Firefly', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '77cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Fiat', model: 'Toro', trim: '1.8', engineCode: 'E.torQ', engineName: '1.8 16V', displacementCc: 1796, fuel: 'flex', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '139cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Fiat', model: 'Toro', trim: '2.0 Diesel', engineCode: 'MultiJet', engineName: '2.0 Diesel', displacementCc: 1956, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '170cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Fiat', model: 'Toro', trim: '1.3 Turbo', engineCode: 'T270', engineName: '1.3 Turbo', displacementCc: 1332, fuel: 'flex', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '185cv', sources: ['fipe'] }, 2022, 2024),
  ...gen({ brand: 'Fiat', model: 'Pulse', trim: '1.0 Turbo', engineCode: 'T200', engineName: '1.0 Turbo', displacementCc: 999, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '130cv', sources: ['fipe'] }, 2021, 2024),
  ...gen({ brand: 'Fiat', model: 'Pulse', trim: '1.3 Turbo', engineCode: 'T270', engineName: '1.3 Turbo', displacementCc: 1332, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '185cv', sources: ['fipe'] }, 2021, 2024),
  ...gen({ brand: 'Fiat', model: 'Fastback', trim: '1.0 Turbo', engineCode: 'T200', engineName: '1.0 Turbo', displacementCc: 999, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '130cv', sources: ['fipe'] }, 2022, 2024),
  ...gen({ brand: 'Fiat', model: 'Fastback', trim: '1.3 Turbo', engineCode: 'T270', engineName: '1.3 Turbo', displacementCc: 1332, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '185cv', sources: ['fipe'] }, 2022, 2024),
  ...gen({ brand: 'Fiat', model: 'Punto', trim: '1.4', engineCode: 'Fire', engineName: '1.4 8V', displacementCc: 1368, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '88cv', sources: ['fipe'] }, 2007, 2017),
  ...gen({ brand: 'Fiat', model: 'Linea', trim: '1.8', engineCode: 'E.torQ', engineName: '1.8 16V', displacementCc: 1796, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '132cv', sources: ['fipe'] }, 2008, 2016),
  ...gen({ brand: 'Fiat', model: 'Bravo', trim: '1.8', engineCode: 'E.torQ', engineName: '1.8 16V', displacementCc: 1796, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '132cv', sources: ['fipe'] }, 2010, 2016),
  ...gen({ brand: 'Fiat', model: '500', trim: '1.4', engineCode: 'Fire', engineName: '1.4 16V', displacementCc: 1368, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '100cv', sources: ['fipe'] }, 2009, 2020),
  ...gen({ brand: 'Fiat', model: 'Doblò', trim: '1.8', engineCode: 'E.torQ', engineName: '1.8 16V', displacementCc: 1796, fuel: 'flex', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '132cv', sources: ['fipe'] }, 2001, 2021),
  ...gen({ brand: 'Fiat', model: 'Ducato', trim: '2.3 Diesel', engineCode: 'MultiJet', engineName: '2.3 Diesel', displacementCc: 2287, fuel: 'diesel', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '130cv', sources: ['fipe'] }, 2006, 2024),
  ...gen({ brand: 'Fiat', model: 'Fiorino', trim: '1.4', engineCode: 'Fire', engineName: '1.4 8V', displacementCc: 1368, fuel: 'flex', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '88cv', sources: ['fipe'] }, 1988, 2024),
  ...gen({ brand: 'Fiat', model: '147', trim: '1.3', engineCode: 'Fiasa', engineName: '1.3 8V', displacementCc: 1297, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '65cv', sources: ['fipe'] }, 1976, 1986),
  ...gen({ brand: 'Fiat', model: 'Tempra', trim: '2.0', engineCode: 'Fiasa', engineName: '2.0 8V', displacementCc: 1998, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '114cv', sources: ['fipe'] }, 1991, 1999),
  ...gen({ brand: 'Fiat', model: 'Marea', trim: '2.0 20V', engineCode: 'Fiasa', engineName: '2.0 20V', displacementCc: 1998, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '142cv', sources: ['fipe'] }, 1998, 2007),
  ...gen({ brand: 'Fiat', model: 'Stilo', trim: '1.8', engineCode: 'E.torQ', engineName: '1.8 8V', displacementCc: 1796, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '110cv', sources: ['fipe'] }, 2002, 2010),
  ...gen({ brand: 'Fiat', model: 'Idea', trim: '1.4', engineCode: 'Fire', engineName: '1.4 8V', displacementCc: 1368, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '88cv', sources: ['fipe'] }, 2005, 2016),
];

// ============================================================================
// FORD
// ============================================================================
const FORD: VehicleVariant[] = [
  ...gen({ brand: 'Ford', model: 'Fiesta', trim: '1.0', engineCode: 'Zetec', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '75cv', sources: ['fipe'] }, 1996, 2019),
  ...gen({ brand: 'Ford', model: 'Fiesta', trim: '1.6', engineCode: 'Sigma', engineName: '1.6 16V', displacementCc: 1596, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '111cv', sources: ['fipe'] }, 1996, 2019),
  ...gen({ brand: 'Ford', model: 'Ka', trim: '1.0', engineCode: 'Zetec', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '75cv', sources: ['fipe'] }, 1997, 2021),
  ...gen({ brand: 'Ford', model: 'Ka', trim: '1.5', engineCode: 'Dragon', engineName: '1.5 12V', displacementCc: 1498, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '137cv', sources: ['fipe'] }, 2014, 2021),
  ...gen({ brand: 'Ford', model: 'Ka Sedan', trim: '1.5', engineCode: 'Dragon', engineName: '1.5 12V', displacementCc: 1498, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '137cv', sources: ['fipe'] }, 2014, 2021),
  ...gen({ brand: 'Ford', model: 'Focus', trim: '1.6', engineCode: 'Sigma', engineName: '1.6 16V', displacementCc: 1596, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '111cv', sources: ['fipe'] }, 2000, 2019),
  ...gen({ brand: 'Ford', model: 'Focus', trim: '2.0', engineCode: 'Duratec', engineName: '2.0 16V', displacementCc: 1999, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '148cv', sources: ['fipe'] }, 2000, 2019),
  ...gen({ brand: 'Ford', model: 'EcoSport', trim: '1.5', engineCode: 'Dragon', engineName: '1.5 12V', displacementCc: 1498, fuel: 'flex', transmission: 'manual', bodyType: 'suv', vehicleType: 'suv', power: '137cv', sources: ['fipe'] }, 2003, 2021),
  ...gen({ brand: 'Ford', model: 'EcoSport', trim: '2.0', engineCode: 'Duratec', engineName: '2.0 16V', displacementCc: 1999, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '148cv', sources: ['fipe'] }, 2003, 2021),
  ...gen({ brand: 'Ford', model: 'Ranger', trim: '2.2 Diesel', engineCode: 'Duratorq', engineName: '2.2 Diesel', displacementCc: 2198, fuel: 'diesel', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '160cv', sources: ['fipe'] }, 1994, 2024),
  ...gen({ brand: 'Ford', model: 'Ranger', trim: '3.2 Diesel', engineCode: 'Duratorq', engineName: '3.2 Diesel', displacementCc: 3198, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '200cv', sources: ['fipe'] }, 2012, 2024),
  ...gen({ brand: 'Ford', model: 'Ranger', trim: '3.0 V6 Diesel', engineCode: 'Lion', engineName: '3.0 V6 Diesel', displacementCc: 2993, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '250cv', sources: ['fipe'] }, 2023, 2024),
  ...gen({ brand: 'Ford', model: 'Maverick', trim: '2.0 EcoBoost', engineCode: 'EcoBoost', engineName: '2.0 Turbo', displacementCc: 1999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '253cv', sources: ['fipe'] }, 2022, 2024),
  ...gen({ brand: 'Ford', model: 'Territory', trim: '1.5 Turbo', engineCode: 'EcoBoost', engineName: '1.5 Turbo', displacementCc: 1498, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '150cv', sources: ['fipe'] }, 2020, 2024),
  ...gen({ brand: 'Ford', model: 'Bronco Sport', trim: '2.0 EcoBoost', engineCode: 'EcoBoost', engineName: '2.0 Turbo', displacementCc: 1999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '253cv', sources: ['fipe'] }, 2021, 2024),
  ...gen({ brand: 'Ford', model: 'Fusion', trim: '2.0 EcoBoost', engineCode: 'EcoBoost', engineName: '2.0 Turbo', displacementCc: 1999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '248cv', sources: ['fipe'] }, 2006, 2019),
  ...gen({ brand: 'Ford', model: 'Fusion', trim: '2.5', engineCode: 'Duratec', engineName: '2.5 16V', displacementCc: 2488, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '175cv', sources: ['fipe'] }, 2006, 2019),
  ...gen({ brand: 'Ford', model: 'Edge', trim: '3.5 V6', engineCode: 'Duratec', engineName: '3.5 V6', displacementCc: 3496, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '289cv', sources: ['fipe'] }, 2009, 2024),
  ...gen({ brand: 'Ford', model: 'Mustang', trim: '5.0 V8', engineCode: 'Coyote', engineName: '5.0 V8', displacementCc: 4951, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '466cv', sources: ['fipe'] }, 2015, 2024),
  ...gen({ brand: 'Ford', model: 'Escort', trim: '1.6', engineCode: 'Zetec', engineName: '1.6 8V', displacementCc: 1598, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '85cv', sources: ['fipe'] }, 1983, 2003),
  ...gen({ brand: 'Ford', model: 'Escort', trim: '1.8', engineCode: 'Zetec', engineName: '1.8 16V', displacementCc: 1796, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '115cv', sources: ['fipe'] }, 1983, 2003),
  ...gen({ brand: 'Ford', model: 'Verona', trim: '1.8', engineCode: 'AP', engineName: '1.8 8V', displacementCc: 1781, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '95cv', sources: ['fipe'] }, 1989, 1996),
  ...gen({ brand: 'Ford', model: 'Versailles', trim: '2.0', engineCode: 'AP', engineName: '2.0 8V', displacementCc: 1984, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '115cv', sources: ['fipe'] }, 1991, 1996),
  ...gen({ brand: 'Ford', model: 'Del Rey', trim: '1.6', engineCode: 'CHT', engineName: '1.6 8V', displacementCc: 1598, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '73cv', sources: ['fipe'] }, 1981, 1991),
  ...gen({ brand: 'Ford', model: 'Corcel', trim: '1.6', engineCode: 'CHT', engineName: '1.6 8V', displacementCc: 1598, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '73cv', sources: ['fipe'] }, 1968, 1986),
  ...gen({ brand: 'Ford', model: 'Belina', trim: '1.6', engineCode: 'CHT', engineName: '1.6 8V', displacementCc: 1598, fuel: 'gasoline', transmission: 'manual', bodyType: 'wagon', vehicleType: 'car', power: '73cv', sources: ['fipe'] }, 1970, 1991),
  ...gen({ brand: 'Ford', model: 'Pampa', trim: '1.6', engineCode: 'CHT', engineName: '1.6 8V', displacementCc: 1598, fuel: 'gasoline', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '73cv', sources: ['fipe'] }, 1982, 1997),
  ...gen({ brand: 'Ford', model: 'F-250', trim: '3.9 Diesel', engineCode: 'MWM', engineName: '3.9 Diesel', displacementCc: 3922, fuel: 'diesel', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '150cv', sources: ['fipe'] }, 1998, 2011),
  ...gen({ brand: 'Ford', model: 'Cargo 816', trim: 'Diesel', engineCode: 'Cummins', engineName: '3.8 Diesel', displacementCc: 3800, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '160cv', sources: ['fipe'] }, 2012, 2024),
];

// ============================================================================
// TOYOTA
// ============================================================================
const TOYOTA: VehicleVariant[] = [
  ...gen({ brand: 'Toyota', model: 'Corolla', trim: '1.8', engineCode: '2ZR-FE', engineName: '1.8 16V', displacementCc: 1798, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '140cv', sources: ['fipe'] }, 1998, 2024),
  ...gen({ brand: 'Toyota', model: 'Corolla', trim: '2.0', engineCode: 'M20A-FKS', engineName: '2.0 16V', displacementCc: 1987, fuel: 'flex', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '177cv', sources: ['fipe'] }, 2020, 2024),
  ...gen({ brand: 'Toyota', model: 'Corolla Cross', trim: '1.8 Hybrid', engineCode: '2ZR-FXE', engineName: '1.8 Hybrid', displacementCc: 1798, fuel: 'hybrid', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '122cv', sources: ['fipe'] }, 2021, 2024),
  ...gen({ brand: 'Toyota', model: 'Corolla Cross', trim: '2.0', engineCode: 'M20A-FKS', engineName: '2.0 16V', displacementCc: 1987, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '177cv', sources: ['fipe'] }, 2021, 2024),
  ...gen({ brand: 'Toyota', model: 'Yaris', trim: '1.3', engineCode: '1NR-FE', engineName: '1.3 16V', displacementCc: 1329, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '101cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Toyota', model: 'Yaris', trim: '1.5', engineCode: '2NR-FE', engineName: '1.5 16V', displacementCc: 1496, fuel: 'flex', transmission: 'cvt', bodyType: 'hatch', vehicleType: 'car', power: '110cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Toyota', model: 'Yaris Sedan', trim: '1.5', engineCode: '2NR-FE', engineName: '1.5 16V', displacementCc: 1496, fuel: 'flex', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '110cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Toyota', model: 'Etios', trim: '1.3', engineCode: '1NR-FE', engineName: '1.3 16V', displacementCc: 1329, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '90cv', sources: ['fipe'] }, 2012, 2021),
  ...gen({ brand: 'Toyota', model: 'Etios', trim: '1.5', engineCode: '2NR-FE', engineName: '1.5 16V', displacementCc: 1496, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '107cv', sources: ['fipe'] }, 2012, 2021),
  ...gen({ brand: 'Toyota', model: 'Etios Sedan', trim: '1.5', engineCode: '2NR-FE', engineName: '1.5 16V', displacementCc: 1496, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '107cv', sources: ['fipe'] }, 2012, 2021),
  ...gen({ brand: 'Toyota', model: 'Camry', trim: '3.5 V6', engineCode: '2GR-FE', engineName: '3.5 V6', displacementCc: 3456, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '268cv', sources: ['fipe'] }, 2007, 2024),
  ...gen({ brand: 'Toyota', model: 'Camry', trim: '2.5 Hybrid', engineCode: 'A25A-FXS', engineName: '2.5 Hybrid', displacementCc: 2487, fuel: 'hybrid', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '218cv', sources: ['fipe'] }, 2019, 2024),
  ...gen({ brand: 'Toyota', model: 'Hilux', trim: '2.7', engineCode: '2TR-FE', engineName: '2.7 16V', displacementCc: 2694, fuel: 'flex', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '163cv', sources: ['fipe'] }, 2005, 2024),
  ...gen({ brand: 'Toyota', model: 'Hilux', trim: '2.8 Diesel', engineCode: '1GD-FTV', engineName: '2.8 Diesel', displacementCc: 2755, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '204cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Toyota', model: 'Hilux SW4', trim: '2.8 Diesel', engineCode: '1GD-FTV', engineName: '2.8 Diesel', displacementCc: 2755, fuel: 'diesel', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '204cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Toyota', model: 'RAV4', trim: '2.0', engineCode: 'M20A-FKS', engineName: '2.0 16V', displacementCc: 1987, fuel: 'gasoline', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '174cv', sources: ['fipe'] }, 2013, 2024),
  ...gen({ brand: 'Toyota', model: 'RAV4', trim: '2.5 Hybrid', engineCode: 'A25A-FXS', engineName: '2.5 Hybrid', displacementCc: 2487, fuel: 'hybrid', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '222cv', sources: ['fipe'] }, 2019, 2024),
  ...gen({ brand: 'Toyota', model: 'Prius', trim: '1.8 Hybrid', engineCode: '2ZR-FXE', engineName: '1.8 Hybrid', displacementCc: 1798, fuel: 'hybrid', transmission: 'cvt', bodyType: 'hatch', vehicleType: 'car', power: '122cv', sources: ['fipe'] }, 2013, 2024),
  ...gen({ brand: 'Toyota', model: 'Land Cruiser Prado', trim: '2.8 Diesel', engineCode: '1GD-FTV', engineName: '2.8 Diesel', displacementCc: 2755, fuel: 'diesel', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '204cv', sources: ['fipe'] }, 2015, 2024),
  ...gen({ brand: 'Toyota', model: 'Bandeirante', trim: '3.7 Diesel', engineCode: '14B', engineName: '3.7 Diesel', displacementCc: 3661, fuel: 'diesel', transmission: 'manual', bodyType: 'suv', vehicleType: 'suv', power: '96cv', sources: ['fipe'] }, 1958, 2001),
];

// ============================================================================
// HONDA
// ============================================================================
const HONDA: VehicleVariant[] = [
  ...gen({ brand: 'Honda', model: 'Civic', trim: '1.8', engineCode: 'R18A', engineName: '1.8 16V', displacementCc: 1799, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '140cv', sources: ['fipe'] }, 1992, 2016),
  ...gen({ brand: 'Honda', model: 'Civic', trim: '2.0', engineCode: 'K20C', engineName: '2.0 16V', displacementCc: 1996, fuel: 'flex', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '155cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Honda', model: 'Civic', trim: '1.5 Turbo', engineCode: 'L15B7', engineName: '1.5 Turbo', displacementCc: 1498, fuel: 'gasoline', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '173cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Honda', model: 'City', trim: '1.5', engineCode: 'L15B', engineName: '1.5 16V', displacementCc: 1498, fuel: 'flex', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '116cv', sources: ['fipe'] }, 2009, 2024),
  ...gen({ brand: 'Honda', model: 'City Hatchback', trim: '1.5', engineCode: 'L15B', engineName: '1.5 16V', displacementCc: 1498, fuel: 'flex', transmission: 'cvt', bodyType: 'hatch', vehicleType: 'car', power: '116cv', sources: ['fipe'] }, 2021, 2024),
  ...gen({ brand: 'Honda', model: 'Fit', trim: '1.4', engineCode: 'L13A', engineName: '1.4 8V', displacementCc: 1339, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '80cv', sources: ['fipe'] }, 2003, 2021),
  ...gen({ brand: 'Honda', model: 'Fit', trim: '1.5', engineCode: 'L15A', engineName: '1.5 16V', displacementCc: 1498, fuel: 'flex', transmission: 'cvt', bodyType: 'hatch', vehicleType: 'car', power: '116cv', sources: ['fipe'] }, 2003, 2021),
  ...gen({ brand: 'Honda', model: 'WR-V', trim: '1.5', engineCode: 'L15B', engineName: '1.5 16V', displacementCc: 1498, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '116cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Honda', model: 'HR-V', trim: '1.8', engineCode: 'R18A', engineName: '1.8 16V', displacementCc: 1799, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '140cv', sources: ['fipe'] }, 2015, 2024),
  ...gen({ brand: 'Honda', model: 'HR-V', trim: '1.5 Turbo', engineCode: 'L15B', engineName: '1.5 Turbo', displacementCc: 1498, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '177cv', sources: ['fipe'] }, 2022, 2024),
  ...gen({ brand: 'Honda', model: 'CR-V', trim: '2.0', engineCode: 'K20A', engineName: '2.0 16V', displacementCc: 1997, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '155cv', sources: ['fipe'] }, 2007, 2024),
  ...gen({ brand: 'Honda', model: 'CR-V', trim: '1.5 Turbo', engineCode: 'L15B', engineName: '1.5 Turbo', displacementCc: 1498, fuel: 'gasoline', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '190cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Honda', model: 'Accord', trim: '2.0', engineCode: 'K20A', engineName: '2.0 16V', displacementCc: 1997, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '155cv', sources: ['fipe'] }, 1994, 2024),
  ...gen({ brand: 'Honda', model: 'Accord', trim: '2.0 Turbo', engineCode: 'K20C4', engineName: '2.0 Turbo', displacementCc: 1996, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '252cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Honda', model: 'ZR-V', trim: '2.0 Hybrid', engineCode: 'LFB', engineName: '2.0 Hybrid', displacementCc: 1993, fuel: 'hybrid', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '204cv', sources: ['fipe'] }, 2023, 2024),
];

// ============================================================================
// HYUNDAI
// ============================================================================
const HYUNDAI: VehicleVariant[] = [
  ...gen({ brand: 'Hyundai', model: 'HB20', trim: '1.0', engineCode: 'Kappa', engineName: '1.0 12V', displacementCc: 998, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '80cv', sources: ['fipe'] }, 2012, 2024),
  ...gen({ brand: 'Hyundai', model: 'HB20', trim: '1.0 Turbo', engineCode: 'Kappa', engineName: '1.0 Turbo', displacementCc: 998, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '120cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Hyundai', model: 'HB20', trim: '1.6', engineCode: 'Gamma', engineName: '1.6 16V', displacementCc: 1591, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '130cv', sources: ['fipe'] }, 2012, 2024),
  ...gen({ brand: 'Hyundai', model: 'HB20S', trim: '1.0', engineCode: 'Kappa', engineName: '1.0 12V', displacementCc: 998, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '80cv', sources: ['fipe'] }, 2013, 2024),
  ...gen({ brand: 'Hyundai', model: 'HB20S', trim: '1.0 Turbo', engineCode: 'Kappa', engineName: '1.0 Turbo', displacementCc: 998, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '120cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Hyundai', model: 'HB20X', trim: '1.6', engineCode: 'Gamma', engineName: '1.6 16V', displacementCc: 1591, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '130cv', sources: ['fipe'] }, 2014, 2024),
  ...gen({ brand: 'Hyundai', model: 'Creta', trim: '1.6', engineCode: 'Gamma', engineName: '1.6 16V', displacementCc: 1591, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '130cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Hyundai', model: 'Creta', trim: '2.0', engineCode: 'Nu', engineName: '2.0 16V', displacementCc: 1999, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '167cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Hyundai', model: 'Tucson', trim: '2.0', engineCode: 'Nu', engineName: '2.0 16V', displacementCc: 1999, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '167cv', sources: ['fipe'] }, 2006, 2024),
  ...gen({ brand: 'Hyundai', model: 'Tucson', trim: '1.6 Turbo', engineCode: 'Gamma', engineName: '1.6 Turbo', displacementCc: 1591, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '177cv', sources: ['fipe'] }, 2022, 2024),
  ...gen({ brand: 'Hyundai', model: 'Santa Fe', trim: '3.3 V6', engineCode: 'Lambda', engineName: '3.3 V6', displacementCc: 3342, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '270cv', sources: ['fipe'] }, 2006, 2024),
  ...gen({ brand: 'Hyundai', model: 'i30', trim: '2.0', engineCode: 'Nu', engineName: '2.0 16V', displacementCc: 1999, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '167cv', sources: ['fipe'] }, 2009, 2019),
  ...gen({ brand: 'Hyundai', model: 'Elantra', trim: '2.0', engineCode: 'Nu', engineName: '2.0 16V', displacementCc: 1999, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '167cv', sources: ['fipe'] }, 2011, 2024),
  ...gen({ brand: 'Hyundai', model: 'Azera', trim: '3.0 V6', engineCode: 'Lambda', engineName: '3.0 V6', displacementCc: 2999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '270cv', sources: ['fipe'] }, 2007, 2020),
  ...gen({ brand: 'Hyundai', model: 'Veloster', trim: '1.6', engineCode: 'Gamma', engineName: '1.6 16V', displacementCc: 1591, fuel: 'flex', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '140cv', sources: ['fipe'] }, 2011, 2019),
  ...gen({ brand: 'Hyundai', model: 'HR', trim: '2.5 Diesel', engineCode: 'D4CB', engineName: '2.5 Diesel', displacementCc: 2497, fuel: 'diesel', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '130cv', sources: ['fipe'] }, 2006, 2024),
];

// ============================================================================
// RENAULT
// ============================================================================
const RENAULT: VehicleVariant[] = [
  ...gen({ brand: 'Renault', model: 'Kwid', trim: '1.0', engineCode: 'SCe', engineName: '1.0 12V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '70cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Renault', model: 'Sandero', trim: '1.0', engineCode: 'SCe', engineName: '1.0 12V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '82cv', sources: ['fipe'] }, 2007, 2024),
  ...gen({ brand: 'Renault', model: 'Sandero', trim: '1.6', engineCode: 'K4M', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '118cv', sources: ['fipe'] }, 2007, 2024),
  ...gen({ brand: 'Renault', model: 'Sandero RS', trim: '2.0', engineCode: 'F4R', engineName: '2.0 16V', displacementCc: 1998, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '150cv', sources: ['fipe'] }, 2015, 2022),
  ...gen({ brand: 'Renault', model: 'Logan', trim: '1.0', engineCode: 'SCe', engineName: '1.0 12V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '82cv', sources: ['fipe'] }, 2007, 2024),
  ...gen({ brand: 'Renault', model: 'Logan', trim: '1.6', engineCode: 'K4M', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '118cv', sources: ['fipe'] }, 2007, 2024),
  ...gen({ brand: 'Renault', model: 'Duster', trim: '1.6', engineCode: 'K4M', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'suv', vehicleType: 'suv', power: '118cv', sources: ['fipe'] }, 2011, 2024),
  ...gen({ brand: 'Renault', model: 'Duster', trim: '2.0', engineCode: 'F4R', engineName: '2.0 16V', displacementCc: 1998, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '148cv', sources: ['fipe'] }, 2011, 2024),
  ...gen({ brand: 'Renault', model: 'Duster', trim: '1.3 Turbo', engineCode: 'H5Ht', engineName: '1.3 Turbo', displacementCc: 1332, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '170cv', sources: ['fipe'] }, 2021, 2024),
  ...gen({ brand: 'Renault', model: 'Oroch', trim: '1.6', engineCode: 'K4M', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '118cv', sources: ['fipe'] }, 2015, 2024),
  ...gen({ brand: 'Renault', model: 'Oroch', trim: '2.0', engineCode: 'F4R', engineName: '2.0 16V', displacementCc: 1998, fuel: 'flex', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '148cv', sources: ['fipe'] }, 2015, 2024),
  ...gen({ brand: 'Renault', model: 'Captur', trim: '1.6', engineCode: 'K4M', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '118cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Renault', model: 'Captur', trim: '2.0', engineCode: 'F4R', engineName: '2.0 16V', displacementCc: 1998, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '148cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Renault', model: 'Fluence', trim: '2.0', engineCode: 'M4R', engineName: '2.0 16V', displacementCc: 1997, fuel: 'flex', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '143cv', sources: ['fipe'] }, 2011, 2018),
  ...gen({ brand: 'Renault', model: 'Megane', trim: '2.0', engineCode: 'F4R', engineName: '2.0 16V', displacementCc: 1998, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '148cv', sources: ['fipe'] }, 2006, 2012),
  ...gen({ brand: 'Renault', model: 'Clio', trim: '1.0', engineCode: 'D4D', engineName: '1.0 16V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '75cv', sources: ['fipe'] }, 1999, 2016),
  ...gen({ brand: 'Renault', model: 'Scenic', trim: '1.6', engineCode: 'K4M', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '110cv', sources: ['fipe'] }, 1999, 2011),
  ...gen({ brand: 'Renault', model: 'Master', trim: '2.3 Diesel', engineCode: 'M9T', engineName: '2.3 Diesel', displacementCc: 2298, fuel: 'diesel', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '130cv', sources: ['fipe'] }, 2002, 2024),
];

// ============================================================================
// NISSAN
// ============================================================================
const NISSAN: VehicleVariant[] = [
  ...gen({ brand: 'Nissan', model: 'March', trim: '1.0', engineCode: 'HR10DE', engineName: '1.0 12V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '77cv', sources: ['fipe'] }, 2011, 2024),
  ...gen({ brand: 'Nissan', model: 'March', trim: '1.6', engineCode: 'HR16DE', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'cvt', bodyType: 'hatch', vehicleType: 'car', power: '111cv', sources: ['fipe'] }, 2011, 2024),
  ...gen({ brand: 'Nissan', model: 'Versa', trim: '1.0 Turbo', engineCode: 'HR10DET', engineName: '1.0 Turbo', displacementCc: 999, fuel: 'flex', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '120cv', sources: ['fipe'] }, 2011, 2024),
  ...gen({ brand: 'Nissan', model: 'Versa', trim: '1.6', engineCode: 'HR16DE', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '111cv', sources: ['fipe'] }, 2011, 2024),
  ...gen({ brand: 'Nissan', model: 'Kicks', trim: '1.6', engineCode: 'HR16DE', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '114cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Nissan', model: 'Kicks', trim: 'e-Power', engineCode: 'HR12DE', engineName: '1.2 e-Power', displacementCc: 1198, fuel: 'hybrid', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '129cv', sources: ['fipe'] }, 2022, 2024),
  ...gen({ brand: 'Nissan', model: 'Sentra', trim: '2.0', engineCode: 'MR20DE', engineName: '2.0 16V', displacementCc: 1997, fuel: 'flex', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '140cv', sources: ['fipe'] }, 2007, 2024),
  ...gen({ brand: 'Nissan', model: 'Frontier', trim: '2.3 Diesel', engineCode: 'YS23', engineName: '2.3 Diesel', displacementCc: 2298, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '190cv', sources: ['fipe'] }, 2002, 2024),
  ...gen({ brand: 'Nissan', model: 'X-Trail', trim: '2.0', engineCode: 'MR20DD', engineName: '2.0 16V', displacementCc: 1997, fuel: 'gasoline', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '150cv', sources: ['fipe'] }, 2015, 2024),
  ...gen({ brand: 'Nissan', model: 'Leaf', trim: 'Elétrico', engineCode: 'EM57', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '149cv', sources: ['fipe'] }, 2019, 2024),
  ...gen({ brand: 'Nissan', model: 'Livina', trim: '1.6', engineCode: 'HR16DE', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '111cv', sources: ['fipe'] }, 2009, 2014),
  ...gen({ brand: 'Nissan', model: 'Tiida', trim: '1.8', engineCode: 'MR18DE', engineName: '1.8 16V', displacementCc: 1798, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '126cv', sources: ['fipe'] }, 2007, 2013),
];

// ============================================================================
// PEUGEOT
// ============================================================================
const PEUGEOT: VehicleVariant[] = [
  ...gen({ brand: 'Peugeot', model: '208', trim: '1.0', engineCode: 'EB0', engineName: '1.0 12V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '75cv', sources: ['fipe'] }, 2013, 2024),
  ...gen({ brand: 'Peugeot', model: '208', trim: '1.6', engineCode: 'EC5', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '122cv', sources: ['fipe'] }, 2013, 2024),
  ...gen({ brand: 'Peugeot', model: '208', trim: '1.6 Turbo', engineCode: 'EP6', engineName: '1.6 Turbo', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '173cv', sources: ['fipe'] }, 2020, 2024),
  ...gen({ brand: 'Peugeot', model: '2008', trim: '1.6', engineCode: 'EC5', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '122cv', sources: ['fipe'] }, 2015, 2024),
  ...gen({ brand: 'Peugeot', model: '2008', trim: '1.6 Turbo', engineCode: 'EP6', engineName: '1.6 Turbo', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '173cv', sources: ['fipe'] }, 2020, 2024),
  ...gen({ brand: 'Peugeot', model: '3008', trim: '1.6 Turbo', engineCode: 'EP6', engineName: '1.6 Turbo', displacementCc: 1598, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '165cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Peugeot', model: '5008', trim: '1.6 Turbo', engineCode: 'EP6', engineName: '1.6 Turbo', displacementCc: 1598, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '165cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Peugeot', model: '308', trim: '1.6', engineCode: 'EC5', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '122cv', sources: ['fipe'] }, 2012, 2019),
  ...gen({ brand: 'Peugeot', model: '408', trim: '1.6 Turbo', engineCode: 'EP6', engineName: '1.6 Turbo', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '173cv', sources: ['fipe'] }, 2011, 2019),
  ...gen({ brand: 'Peugeot', model: '206', trim: '1.4', engineCode: 'TU3', engineName: '1.4 8V', displacementCc: 1360, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '75cv', sources: ['fipe'] }, 1999, 2008),
  ...gen({ brand: 'Peugeot', model: '207', trim: '1.4', engineCode: 'TU3', engineName: '1.4 8V', displacementCc: 1360, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '75cv', sources: ['fipe'] }, 2008, 2015),
  ...gen({ brand: 'Peugeot', model: '207', trim: '1.6', engineCode: 'TU5', engineName: '1.6 16V', displacementCc: 1587, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '113cv', sources: ['fipe'] }, 2008, 2015),
  ...gen({ brand: 'Peugeot', model: 'Partner', trim: '1.6', engineCode: 'TU5', engineName: '1.6 16V', displacementCc: 1587, fuel: 'flex', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '113cv', sources: ['fipe'] }, 1999, 2024),
  ...gen({ brand: 'Peugeot', model: 'Expert', trim: '1.6 Diesel', engineCode: 'DV6', engineName: '1.6 Diesel', displacementCc: 1560, fuel: 'diesel', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '115cv', sources: ['fipe'] }, 2010, 2024),
];

// ============================================================================
// CITROËN
// ============================================================================
const CITROEN: VehicleVariant[] = [
  ...gen({ brand: 'Citroën', model: 'C3', trim: '1.0', engineCode: 'EB0', engineName: '1.0 12V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '75cv', sources: ['fipe'] }, 2003, 2024),
  ...gen({ brand: 'Citroën', model: 'C3', trim: '1.6', engineCode: 'EC5', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '122cv', sources: ['fipe'] }, 2003, 2024),
  ...gen({ brand: 'Citroën', model: 'C3 Aircross', trim: '1.6', engineCode: 'EC5', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '122cv', sources: ['fipe'] }, 2019, 2024),
  ...gen({ brand: 'Citroën', model: 'C4 Cactus', trim: '1.6', engineCode: 'EC5', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '122cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Citroën', model: 'C4 Cactus', trim: '1.6 Turbo', engineCode: 'EP6', engineName: '1.6 Turbo', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '173cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Citroën', model: 'C4 Lounge', trim: '1.6 Turbo', engineCode: 'EP6', engineName: '1.6 Turbo', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '173cv', sources: ['fipe'] }, 2013, 2019),
  ...gen({ brand: 'Citroën', model: 'C5 Aircross', trim: '1.6 Turbo', engineCode: 'EP6', engineName: '1.6 Turbo', displacementCc: 1598, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '180cv', sources: ['fipe'] }, 2020, 2024),
  ...gen({ brand: 'Citroën', model: 'Aircross', trim: '1.6', engineCode: 'EC5', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '122cv', sources: ['fipe'] }, 2010, 2018),
  ...gen({ brand: 'Citroën', model: 'C4 Picasso', trim: '2.0', engineCode: 'EW10', engineName: '2.0 16V', displacementCc: 1997, fuel: 'flex', transmission: 'automatic', bodyType: 'van', vehicleType: 'van', power: '143cv', sources: ['fipe'] }, 2007, 2015),
  ...gen({ brand: 'Citroën', model: 'Jumpy', trim: '1.6 Diesel', engineCode: 'DV6', engineName: '1.6 Diesel', displacementCc: 1560, fuel: 'diesel', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '115cv', sources: ['fipe'] }, 2010, 2024),
];

// ============================================================================
// MITSUBISHI
// ============================================================================
const MITSUBISHI: VehicleVariant[] = [
  ...gen({ brand: 'Mitsubishi', model: 'L200 Triton', trim: '2.4 Diesel', engineCode: '4N15', engineName: '2.4 Diesel', displacementCc: 2442, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '190cv', sources: ['fipe'] }, 2007, 2024),
  ...gen({ brand: 'Mitsubishi', model: 'L200 Triton', trim: '3.2 Diesel', engineCode: '4M41', engineName: '3.2 Diesel', displacementCc: 3200, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '165cv', sources: ['fipe'] }, 2007, 2019),
  ...gen({ brand: 'Mitsubishi', model: 'Pajero Sport', trim: '2.4 Diesel', engineCode: '4N15', engineName: '2.4 Diesel', displacementCc: 2442, fuel: 'diesel', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '190cv', sources: ['fipe'] }, 2000, 2024),
  ...gen({ brand: 'Mitsubishi', model: 'Pajero Full', trim: '3.2 Diesel', engineCode: '4M41', engineName: '3.2 Diesel', displacementCc: 3200, fuel: 'diesel', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '200cv', sources: ['fipe'] }, 2000, 2021),
  ...gen({ brand: 'Mitsubishi', model: 'Pajero Full', trim: '3.8 V6', engineCode: '6G75', engineName: '3.8 V6', displacementCc: 3828, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '250cv', sources: ['fipe'] }, 2007, 2021),
  ...gen({ brand: 'Mitsubishi', model: 'Outlander', trim: '2.0', engineCode: '4B11', engineName: '2.0 16V', displacementCc: 1998, fuel: 'gasoline', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '160cv', sources: ['fipe'] }, 2007, 2024),
  ...gen({ brand: 'Mitsubishi', model: 'Outlander', trim: '3.0 V6', engineCode: '6B31', engineName: '3.0 V6', displacementCc: 2998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '240cv', sources: ['fipe'] }, 2007, 2024),
  ...gen({ brand: 'Mitsubishi', model: 'Eclipse Cross', trim: '1.5 Turbo', engineCode: '4B40', engineName: '1.5 Turbo', displacementCc: 1499, fuel: 'gasoline', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '165cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Mitsubishi', model: 'ASX', trim: '2.0', engineCode: '4B11', engineName: '2.0 16V', displacementCc: 1998, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '160cv', sources: ['fipe'] }, 2010, 2024),
  ...gen({ brand: 'Mitsubishi', model: 'Lancer', trim: '2.0', engineCode: '4B11', engineName: '2.0 16V', displacementCc: 1998, fuel: 'gasoline', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '160cv', sources: ['fipe'] }, 2007, 2019),
];

// ============================================================================
// JEEP
// ============================================================================
const JEEP: VehicleVariant[] = [
  ...gen({ brand: 'Jeep', model: 'Renegade', trim: '1.8', engineCode: 'E.torQ', engineName: '1.8 16V', displacementCc: 1796, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '139cv', sources: ['fipe'] }, 2015, 2024),
  ...gen({ brand: 'Jeep', model: 'Renegade', trim: '2.0 Diesel', engineCode: 'MultiJet', engineName: '2.0 Diesel', displacementCc: 1956, fuel: 'diesel', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '170cv', sources: ['fipe'] }, 2015, 2024),
  ...gen({ brand: 'Jeep', model: 'Renegade', trim: '1.3 Turbo', engineCode: 'T270', engineName: '1.3 Turbo', displacementCc: 1332, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '185cv', sources: ['fipe'] }, 2022, 2024),
  ...gen({ brand: 'Jeep', model: 'Compass', trim: '2.0', engineCode: 'Tigershark', engineName: '2.0 16V', displacementCc: 1998, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '166cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Jeep', model: 'Compass', trim: '2.0 Diesel', engineCode: 'MultiJet', engineName: '2.0 Diesel', displacementCc: 1956, fuel: 'diesel', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '170cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Jeep', model: 'Compass', trim: '1.3 Turbo', engineCode: 'T270', engineName: '1.3 Turbo', displacementCc: 1332, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '185cv', sources: ['fipe'] }, 2022, 2024),
  ...gen({ brand: 'Jeep', model: 'Commander', trim: '2.0 Diesel', engineCode: 'MultiJet', engineName: '2.0 Diesel', displacementCc: 1956, fuel: 'diesel', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '170cv', sources: ['fipe'] }, 2021, 2024),
  ...gen({ brand: 'Jeep', model: 'Commander', trim: '1.3 Turbo', engineCode: 'T270', engineName: '1.3 Turbo', displacementCc: 1332, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '185cv', sources: ['fipe'] }, 2021, 2024),
  ...gen({ brand: 'Jeep', model: 'Wrangler', trim: '2.0 Turbo', engineCode: 'GME', engineName: '2.0 Turbo', displacementCc: 1995, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '270cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Jeep', model: 'Grand Cherokee', trim: '3.6 V6', engineCode: 'Pentastar', engineName: '3.6 V6', displacementCc: 3604, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '286cv', sources: ['fipe'] }, 2011, 2024),
  ...gen({ brand: 'Jeep', model: 'Grand Cherokee', trim: '3.0 Diesel', engineCode: 'EcoDiesel', engineName: '3.0 Diesel', displacementCc: 2987, fuel: 'diesel', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '250cv', sources: ['fipe'] }, 2014, 2024),
];

// ============================================================================
// KIA
// ============================================================================
const KIA: VehicleVariant[] = [
  ...gen({ brand: 'Kia', model: 'Picanto', trim: '1.0', engineCode: 'Kappa', engineName: '1.0 12V', displacementCc: 998, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '80cv', sources: ['fipe'] }, 2011, 2024),
  ...gen({ brand: 'Kia', model: 'Rio', trim: '1.6', engineCode: 'Gamma', engineName: '1.6 16V', displacementCc: 1591, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '130cv', sources: ['fipe'] }, 2012, 2024),
  ...gen({ brand: 'Kia', model: 'Cerato', trim: '1.6', engineCode: 'Gamma', engineName: '1.6 16V', displacementCc: 1591, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '130cv', sources: ['fipe'] }, 2009, 2024),
  ...gen({ brand: 'Kia', model: 'Cerato', trim: '2.0', engineCode: 'Nu', engineName: '2.0 16V', displacementCc: 1999, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '167cv', sources: ['fipe'] }, 2009, 2024),
  ...gen({ brand: 'Kia', model: 'Sportage', trim: '2.0', engineCode: 'Nu', engineName: '2.0 16V', displacementCc: 1999, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '167cv', sources: ['fipe'] }, 2005, 2024),
  ...gen({ brand: 'Kia', model: 'Sportage', trim: '2.0 Diesel', engineCode: 'D4HA', engineName: '2.0 Diesel', displacementCc: 1995, fuel: 'diesel', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '185cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Kia', model: 'Sorento', trim: '2.4', engineCode: 'Theta', engineName: '2.4 16V', displacementCc: 2359, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '175cv', sources: ['fipe'] }, 2009, 2024),
  ...gen({ brand: 'Kia', model: 'Sorento', trim: '3.5 V6', engineCode: 'Lambda', engineName: '3.5 V6', displacementCc: 3470, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '280cv', sources: ['fipe'] }, 2009, 2024),
  ...gen({ brand: 'Kia', model: 'Carnival', trim: '3.5 V6', engineCode: 'Lambda', engineName: '3.5 V6', displacementCc: 3470, fuel: 'gasoline', transmission: 'automatic', bodyType: 'van', vehicleType: 'van', power: '280cv', sources: ['fipe'] }, 2006, 2024),
  ...gen({ brand: 'Kia', model: 'Stinger', trim: '2.0 Turbo', engineCode: 'Theta', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '255cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Kia', model: 'Stinger', trim: '3.3 V6 Turbo', engineCode: 'Lambda', engineName: '3.3 V6 Turbo', displacementCc: 3342, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '370cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Kia', model: 'Soul', trim: '1.6', engineCode: 'Gamma', engineName: '1.6 16V', displacementCc: 1591, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '130cv', sources: ['fipe'] }, 2009, 2020),
  ...gen({ brand: 'Kia', model: 'Bongo', trim: '2.5 Diesel', engineCode: 'D4CB', engineName: '2.5 Diesel', displacementCc: 2497, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '130cv', sources: ['fipe'] }, 2005, 2024),
];

// ============================================================================
// MOTOS - HONDA
// ============================================================================
const HONDA_MOTOS: VehicleVariant[] = [
  ...gen({ brand: 'Honda', model: 'CG 160', trim: 'Fan', engineCode: 'OHC', engineName: '162.7cc', displacementCc: 163, fuel: 'flex', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '15cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Honda', model: 'CG 160', trim: 'Start', engineCode: 'OHC', engineName: '162.7cc', displacementCc: 163, fuel: 'flex', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '15cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Honda', model: 'CG 160', trim: 'Titan', engineCode: 'OHC', engineName: '162.7cc', displacementCc: 163, fuel: 'flex', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '15cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Honda', model: 'Biz 125', trim: 'Flex', engineCode: 'OHC', engineName: '124.9cc', displacementCc: 125, fuel: 'flex', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '9.2cv', sources: ['fipe'] }, 2005, 2024),
  ...gen({ brand: 'Honda', model: 'Pop 110i', trim: 'Flex', engineCode: 'OHC', engineName: '109.1cc', displacementCc: 109, fuel: 'flex', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '8cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Honda', model: 'PCX 160', trim: 'DLX', engineCode: 'eSP+', engineName: '156.9cc', displacementCc: 157, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '15.8cv', sources: ['fipe'] }, 2021, 2024),
  ...gen({ brand: 'Honda', model: 'Elite 125', trim: 'Standard', engineCode: 'OHC', engineName: '124.9cc', displacementCc: 125, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '8.6cv', sources: ['fipe'] }, 2019, 2024),
  ...gen({ brand: 'Honda', model: 'CB 300R', trim: 'Twister', engineCode: 'DOHC', engineName: '293.5cc', displacementCc: 294, fuel: 'flex', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '26cv', sources: ['fipe'] }, 2009, 2024),
  ...gen({ brand: 'Honda', model: 'CB 500F', trim: 'Standard', engineCode: 'DOHC', engineName: '471cc', displacementCc: 471, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '50cv', sources: ['fipe'] }, 2013, 2024),
  ...gen({ brand: 'Honda', model: 'CB 500X', trim: 'Adventure', engineCode: 'DOHC', engineName: '471cc', displacementCc: 471, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '50cv', sources: ['fipe'] }, 2013, 2024),
  ...gen({ brand: 'Honda', model: 'CBR 500R', trim: 'Sport', engineCode: 'DOHC', engineName: '471cc', displacementCc: 471, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '50cv', sources: ['fipe'] }, 2013, 2024),
  ...gen({ brand: 'Honda', model: 'CB 650R', trim: 'Neo Sports Café', engineCode: 'DOHC', engineName: '649cc', displacementCc: 649, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '95cv', sources: ['fipe'] }, 2019, 2024),
  ...gen({ brand: 'Honda', model: 'CBR 650R', trim: 'Sport', engineCode: 'DOHC', engineName: '649cc', displacementCc: 649, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '95cv', sources: ['fipe'] }, 2019, 2024),
  ...gen({ brand: 'Honda', model: 'CB 1000R', trim: 'Neo Sports Café', engineCode: 'DOHC', engineName: '998cc', displacementCc: 998, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '145cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Honda', model: 'CBR 1000RR', trim: 'Fireblade', engineCode: 'DOHC', engineName: '999cc', displacementCc: 999, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '189cv', sources: ['fipe'] }, 2004, 2024),
  ...gen({ brand: 'Honda', model: 'Africa Twin', trim: 'CRF1100L', engineCode: 'SOHC', engineName: '1084cc', displacementCc: 1084, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '102cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Honda', model: 'XRE 190', trim: 'Adventure', engineCode: 'OHC', engineName: '184.4cc', displacementCc: 184, fuel: 'flex', transmission: 'manual', bodyType: 'trail', vehicleType: 'motorcycle', power: '16cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Honda', model: 'XRE 300', trim: 'Adventure', engineCode: 'OHC', engineName: '291cc', displacementCc: 291, fuel: 'flex', transmission: 'manual', bodyType: 'trail', vehicleType: 'motorcycle', power: '26cv', sources: ['fipe'] }, 2009, 2024),
  ...gen({ brand: 'Honda', model: 'NXR 160 Bros', trim: 'ESDD', engineCode: 'OHC', engineName: '162.7cc', displacementCc: 163, fuel: 'flex', transmission: 'manual', bodyType: 'trail', vehicleType: 'motorcycle', power: '15cv', sources: ['fipe'] }, 2015, 2024),
  ...gen({ brand: 'Honda', model: 'Sahara 300', trim: 'Adventure', engineCode: 'OHC', engineName: '291cc', displacementCc: 291, fuel: 'flex', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '26cv', sources: ['fipe'] }, 2023, 2024),
  ...gen({ brand: 'Honda', model: 'ADV 150', trim: 'Adventure Scooter', engineCode: 'eSP+', engineName: '149.3cc', displacementCc: 149, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '15cv', sources: ['fipe'] }, 2021, 2024),
  ...gen({ brand: 'Honda', model: 'SH 150i', trim: 'DLX', engineCode: 'eSP+', engineName: '149.3cc', displacementCc: 149, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '14.7cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Honda', model: 'Forza 350', trim: 'Premium Scooter', engineCode: 'eSP+', engineName: '329.6cc', displacementCc: 330, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '29cv', sources: ['fipe'] }, 2022, 2024),
  ...gen({ brand: 'Honda', model: 'X-ADV 750', trim: 'Adventure Scooter', engineCode: 'SOHC', engineName: '745cc', displacementCc: 745, fuel: 'gasoline', transmission: 'dct', bodyType: 'adventure', vehicleType: 'motorcycle', power: '59cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Honda', model: 'NC 750X', trim: 'Adventure', engineCode: 'SOHC', engineName: '745cc', displacementCc: 745, fuel: 'gasoline', transmission: 'dct', bodyType: 'adventure', vehicleType: 'motorcycle', power: '59cv', sources: ['fipe'] }, 2014, 2024),
  ...gen({ brand: 'Honda', model: 'Gold Wing', trim: 'Tour', engineCode: 'SOHC', engineName: '1833cc', displacementCc: 1833, fuel: 'gasoline', transmission: 'dct', bodyType: 'touring', vehicleType: 'motorcycle', power: '126cv', sources: ['fipe'] }, 2001, 2024),
];

// ============================================================================
// MOTOS - YAMAHA
// ============================================================================
const YAMAHA_MOTOS: VehicleVariant[] = [
  ...gen({ brand: 'Yamaha', model: 'Factor 150', trim: 'ED', engineCode: 'SOHC', engineName: '149cc', displacementCc: 149, fuel: 'flex', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '12.2cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Yamaha', model: 'Fazer 150', trim: 'SED', engineCode: 'SOHC', engineName: '149cc', displacementCc: 149, fuel: 'flex', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '12.2cv', sources: ['fipe'] }, 2014, 2024),
  ...gen({ brand: 'Yamaha', model: 'Fazer 250', trim: 'ABS', engineCode: 'SOHC', engineName: '249cc', displacementCc: 249, fuel: 'flex', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '21cv', sources: ['fipe'] }, 2006, 2024),
  ...gen({ brand: 'Yamaha', model: 'MT-03', trim: 'ABS', engineCode: 'DOHC', engineName: '321cc', displacementCc: 321, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '42cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Yamaha', model: 'YZF-R3', trim: 'ABS', engineCode: 'DOHC', engineName: '321cc', displacementCc: 321, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '42cv', sources: ['fipe'] }, 2015, 2024),
  ...gen({ brand: 'Yamaha', model: 'MT-07', trim: 'ABS', engineCode: 'DOHC', engineName: '689cc', displacementCc: 689, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '75cv', sources: ['fipe'] }, 2015, 2024),
  ...gen({ brand: 'Yamaha', model: 'MT-09', trim: 'ABS', engineCode: 'DOHC', engineName: '889cc', displacementCc: 889, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '119cv', sources: ['fipe'] }, 2015, 2024),
  ...gen({ brand: 'Yamaha', model: 'Tracer 900 GT', trim: 'Sport Touring', engineCode: 'DOHC', engineName: '847cc', displacementCc: 847, fuel: 'gasoline', transmission: 'manual', bodyType: 'touring', vehicleType: 'motorcycle', power: '115cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Yamaha', model: 'YZF-R1', trim: 'M', engineCode: 'DOHC', engineName: '998cc', displacementCc: 998, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '200cv', sources: ['fipe'] }, 1998, 2024),
  ...gen({ brand: 'Yamaha', model: 'XJ6 N', trim: 'ABS', engineCode: 'DOHC', engineName: '600cc', displacementCc: 600, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '78cv', sources: ['fipe'] }, 2010, 2019),
  ...gen({ brand: 'Yamaha', model: 'Crosser 150', trim: 'Z', engineCode: 'SOHC', engineName: '149cc', displacementCc: 149, fuel: 'flex', transmission: 'manual', bodyType: 'trail', vehicleType: 'motorcycle', power: '12.2cv', sources: ['fipe'] }, 2014, 2024),
  ...gen({ brand: 'Yamaha', model: 'Lander 250', trim: 'ABS', engineCode: 'SOHC', engineName: '249cc', displacementCc: 249, fuel: 'flex', transmission: 'manual', bodyType: 'trail', vehicleType: 'motorcycle', power: '21cv', sources: ['fipe'] }, 2006, 2024),
  ...gen({ brand: 'Yamaha', model: 'Ténéré 250', trim: 'Adventure', engineCode: 'SOHC', engineName: '249cc', displacementCc: 249, fuel: 'flex', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '21cv', sources: ['fipe'] }, 2011, 2024),
  ...gen({ brand: 'Yamaha', model: 'Ténéré 700', trim: 'Adventure', engineCode: 'DOHC', engineName: '689cc', displacementCc: 689, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '73cv', sources: ['fipe'] }, 2020, 2024),
  ...gen({ brand: 'Yamaha', model: 'Super Ténéré 1200', trim: 'DX', engineCode: 'DOHC', engineName: '1199cc', displacementCc: 1199, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '112cv', sources: ['fipe'] }, 2010, 2024),
  ...gen({ brand: 'Yamaha', model: 'NMAX 160', trim: 'ABS', engineCode: 'SOHC', engineName: '155cc', displacementCc: 155, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '15.5cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Yamaha', model: 'NEO 125', trim: 'UBS', engineCode: 'SOHC', engineName: '125cc', displacementCc: 125, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '10.3cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Yamaha', model: 'XMAX 250', trim: 'ABS', engineCode: 'SOHC', engineName: '249cc', displacementCc: 249, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '23cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Yamaha', model: 'TMAX 560', trim: 'Tech Max', engineCode: 'DOHC', engineName: '562cc', displacementCc: 562, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '48cv', sources: ['fipe'] }, 2020, 2024),
  ...gen({ brand: 'Yamaha', model: 'XTZ 125', trim: 'Trail', engineCode: 'SOHC', engineName: '124cc', displacementCc: 124, fuel: 'flex', transmission: 'manual', bodyType: 'trail', vehicleType: 'motorcycle', power: '11.3cv', sources: ['fipe'] }, 2003, 2024),
  ...gen({ brand: 'Yamaha', model: 'Fluo 125', trim: 'UBS', engineCode: 'SOHC', engineName: '125cc', displacementCc: 125, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '10.3cv', sources: ['fipe'] }, 2022, 2024),
];

// ============================================================================
// MOTOS - OUTRAS MARCAS
// ============================================================================
const OTHER_MOTOS: VehicleVariant[] = [
  // Suzuki
  ...gen({ brand: 'Suzuki', model: 'GSX-S750', trim: 'ABS', engineCode: 'DOHC', engineName: '749cc', displacementCc: 749, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '114cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Suzuki', model: 'GSX-S1000', trim: 'ABS', engineCode: 'DOHC', engineName: '999cc', displacementCc: 999, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '152cv', sources: ['fipe'] }, 2015, 2024),
  ...gen({ brand: 'Suzuki', model: 'V-Strom 650', trim: 'XT', engineCode: 'DOHC', engineName: '645cc', displacementCc: 645, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '71cv', sources: ['fipe'] }, 2004, 2024),
  ...gen({ brand: 'Suzuki', model: 'V-Strom 1050', trim: 'XT', engineCode: 'DOHC', engineName: '1037cc', displacementCc: 1037, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '107cv', sources: ['fipe'] }, 2020, 2024),
  ...gen({ brand: 'Suzuki', model: 'Hayabusa', trim: 'GSX1300R', engineCode: 'DOHC', engineName: '1340cc', displacementCc: 1340, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '190cv', sources: ['fipe'] }, 1999, 2024),
  ...gen({ brand: 'Suzuki', model: 'Burgman 400', trim: 'ABS', engineCode: 'DOHC', engineName: '400cc', displacementCc: 400, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '31cv', sources: ['fipe'] }, 2007, 2024),
  // Kawasaki
  ...gen({ brand: 'Kawasaki', model: 'Z400', trim: 'ABS', engineCode: 'DOHC', engineName: '399cc', displacementCc: 399, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '45cv', sources: ['fipe'] }, 2019, 2024),
  ...gen({ brand: 'Kawasaki', model: 'Ninja 400', trim: 'ABS', engineCode: 'DOHC', engineName: '399cc', displacementCc: 399, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '45cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Kawasaki', model: 'Z650', trim: 'ABS', engineCode: 'DOHC', engineName: '649cc', displacementCc: 649, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '68cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Kawasaki', model: 'Ninja 650', trim: 'ABS', engineCode: 'DOHC', engineName: '649cc', displacementCc: 649, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '68cv', sources: ['fipe'] }, 2006, 2024),
  ...gen({ brand: 'Kawasaki', model: 'Z900', trim: 'ABS', engineCode: 'DOHC', engineName: '948cc', displacementCc: 948, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '125cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Kawasaki', model: 'Ninja ZX-10R', trim: 'ABS', engineCode: 'DOHC', engineName: '998cc', displacementCc: 998, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '203cv', sources: ['fipe'] }, 2004, 2024),
  ...gen({ brand: 'Kawasaki', model: 'Versys 650', trim: 'Tourer', engineCode: 'DOHC', engineName: '649cc', displacementCc: 649, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '69cv', sources: ['fipe'] }, 2007, 2024),
  ...gen({ brand: 'Kawasaki', model: 'Versys 1000', trim: 'Grand Tourer', engineCode: 'DOHC', engineName: '1043cc', displacementCc: 1043, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '120cv', sources: ['fipe'] }, 2012, 2024),
  // BMW Motos
  ...gen({ brand: 'BMW', model: 'G 310 R', trim: 'Standard', engineCode: 'DOHC', engineName: '313cc', displacementCc: 313, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '34cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'BMW', model: 'G 310 GS', trim: 'Adventure', engineCode: 'DOHC', engineName: '313cc', displacementCc: 313, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '34cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'BMW', model: 'F 850 GS', trim: 'Adventure', engineCode: 'DOHC', engineName: '853cc', displacementCc: 853, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '95cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'BMW', model: 'R 1250 GS', trim: 'Adventure', engineCode: 'Boxer', engineName: '1254cc', displacementCc: 1254, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '136cv', sources: ['fipe'] }, 2019, 2024),
  ...gen({ brand: 'BMW', model: 'S 1000 RR', trim: 'M Package', engineCode: 'DOHC', engineName: '999cc', displacementCc: 999, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '210cv', sources: ['fipe'] }, 2009, 2024),
  // Ducati
  ...gen({ brand: 'Ducati', model: 'Monster 821', trim: 'Standard', engineCode: 'Testastretta', engineName: '821cc', displacementCc: 821, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '109cv', sources: ['fipe'] }, 2014, 2024),
  ...gen({ brand: 'Ducati', model: 'Panigale V4', trim: 'S', engineCode: 'Desmosedici', engineName: '1103cc', displacementCc: 1103, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '214cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Ducati', model: 'Multistrada V4', trim: 'S', engineCode: 'V4 Granturismo', engineName: '1158cc', displacementCc: 1158, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '170cv', sources: ['fipe'] }, 2021, 2024),
  // Harley-Davidson
  ...gen({ brand: 'Harley-Davidson', model: 'Iron 883', trim: 'Sportster', engineCode: 'Evolution', engineName: '883cc', displacementCc: 883, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '50cv', sources: ['fipe'] }, 2009, 2024),
  ...gen({ brand: 'Harley-Davidson', model: 'Fat Bob', trim: '114', engineCode: 'Milwaukee-Eight', engineName: '1868cc', displacementCc: 1868, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '93cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Harley-Davidson', model: 'Road Glide', trim: 'Special', engineCode: 'Milwaukee-Eight', engineName: '1868cc', displacementCc: 1868, fuel: 'gasoline', transmission: 'manual', bodyType: 'touring', vehicleType: 'motorcycle', power: '93cv', sources: ['fipe'] }, 2015, 2024),
  // Triumph
  ...gen({ brand: 'Triumph', model: 'Street Triple', trim: 'RS', engineCode: 'DOHC', engineName: '765cc', displacementCc: 765, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '123cv', sources: ['fipe'] }, 2007, 2024),
  ...gen({ brand: 'Triumph', model: 'Tiger 900', trim: 'Rally Pro', engineCode: 'DOHC', engineName: '888cc', displacementCc: 888, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '95cv', sources: ['fipe'] }, 2020, 2024),
  ...gen({ brand: 'Triumph', model: 'Bonneville T120', trim: 'Black', engineCode: 'SOHC', engineName: '1200cc', displacementCc: 1200, fuel: 'gasoline', transmission: 'manual', bodyType: 'classic', vehicleType: 'motorcycle', power: '80cv', sources: ['fipe'] }, 2016, 2024),
  // Royal Enfield
  ...gen({ brand: 'Royal Enfield', model: 'Meteor 350', trim: 'Fireball', engineCode: 'SOHC', engineName: '349cc', displacementCc: 349, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '20cv', sources: ['fipe'] }, 2021, 2024),
  ...gen({ brand: 'Royal Enfield', model: 'Himalayan', trim: 'Adventure', engineCode: 'SOHC', engineName: '411cc', displacementCc: 411, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '24cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Royal Enfield', model: 'Interceptor 650', trim: 'Standard', engineCode: 'SOHC', engineName: '648cc', displacementCc: 648, fuel: 'gasoline', transmission: 'manual', bodyType: 'classic', vehicleType: 'motorcycle', power: '47cv', sources: ['fipe'] }, 2019, 2024),
  // Dafra
  ...gen({ brand: 'Dafra', model: 'Apache 200', trim: 'RTR', engineCode: 'SOHC', engineName: '197cc', displacementCc: 197, fuel: 'gasoline', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '20cv', sources: ['fipe'] }, 2019, 2024),
  ...gen({ brand: 'Dafra', model: 'NH 190', trim: 'Standard', engineCode: 'SOHC', engineName: '190cc', displacementCc: 190, fuel: 'flex', transmission: 'manual', bodyType: 'trail', vehicleType: 'motorcycle', power: '16cv', sources: ['fipe'] }, 2019, 2024),
  // Shineray
  ...gen({ brand: 'Shineray', model: 'Jet 125', trim: 'Standard', engineCode: 'OHC', engineName: '125cc', displacementCc: 125, fuel: 'gasoline', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '10cv', sources: ['fipe'] }, 2015, 2024),
  ...gen({ brand: 'Shineray', model: 'XY 150', trim: 'GY', engineCode: 'OHC', engineName: '150cc', displacementCc: 150, fuel: 'gasoline', transmission: 'manual', bodyType: 'trail', vehicleType: 'motorcycle', power: '12cv', sources: ['fipe'] }, 2015, 2024),
  // Haojue
  ...gen({ brand: 'Haojue', model: 'DR 160', trim: 'Fi', engineCode: 'SOHC', engineName: '162cc', displacementCc: 162, fuel: 'flex', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '14cv', sources: ['fipe'] }, 2019, 2024),
  ...gen({ brand: 'Haojue', model: 'DK 150', trim: 'S Fi', engineCode: 'SOHC', engineName: '149cc', displacementCc: 149, fuel: 'flex', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '14cv', sources: ['fipe'] }, 2019, 2024),
];

// ============================================================================
// CAMINHÕES
// ============================================================================
const TRUCKS: VehicleVariant[] = [
  // Mercedes-Benz
  ...gen({ brand: 'Mercedes-Benz', model: 'Accelo 815', trim: 'Diesel', engineCode: 'OM924', engineName: '4.8 Diesel', displacementCc: 4800, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '156cv', sources: ['fipe'] }, 2012, 2024),
  ...gen({ brand: 'Mercedes-Benz', model: 'Atego 1719', trim: 'Diesel', engineCode: 'OM924', engineName: '4.8 Diesel', displacementCc: 4800, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '190cv', sources: ['fipe'] }, 2012, 2024),
  ...gen({ brand: 'Mercedes-Benz', model: 'Atego 2426', trim: 'Diesel', engineCode: 'OM926', engineName: '7.2 Diesel', displacementCc: 7200, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '260cv', sources: ['fipe'] }, 2012, 2024),
  ...gen({ brand: 'Mercedes-Benz', model: 'Actros 2651', trim: 'Diesel', engineCode: 'OM471', engineName: '12.8 Diesel', displacementCc: 12800, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '510cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Mercedes-Benz', model: 'Axor 2544', trim: 'Diesel', engineCode: 'OM457', engineName: '12.0 Diesel', displacementCc: 12000, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '440cv', sources: ['fipe'] }, 2005, 2020),
  // Scania
  ...gen({ brand: 'Scania', model: 'P310', trim: 'Diesel', engineCode: 'DC09', engineName: '9.3 Diesel', displacementCc: 9300, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '310cv', sources: ['fipe'] }, 2010, 2024),
  ...gen({ brand: 'Scania', model: 'R450', trim: 'Diesel', engineCode: 'DC13', engineName: '12.7 Diesel', displacementCc: 12700, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '450cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Scania', model: 'R540', trim: 'Diesel', engineCode: 'DC13', engineName: '12.7 Diesel', displacementCc: 12700, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '540cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Scania', model: 'S500', trim: 'Diesel', engineCode: 'DC13', engineName: '12.7 Diesel', displacementCc: 12700, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '500cv', sources: ['fipe'] }, 2018, 2024),
  // Volvo
  ...gen({ brand: 'Volvo', model: 'VM 270', trim: 'Diesel', engineCode: 'D8K', engineName: '7.7 Diesel', displacementCc: 7700, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '270cv', sources: ['fipe'] }, 2006, 2024),
  ...gen({ brand: 'Volvo', model: 'FH 460', trim: 'Diesel', engineCode: 'D13K', engineName: '12.8 Diesel', displacementCc: 12800, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '460cv', sources: ['fipe'] }, 2014, 2024),
  ...gen({ brand: 'Volvo', model: 'FH 540', trim: 'Diesel', engineCode: 'D13K', engineName: '12.8 Diesel', displacementCc: 12800, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '540cv', sources: ['fipe'] }, 2014, 2024),
  // MAN
  ...gen({ brand: 'MAN', model: 'TGX 29.480', trim: 'Diesel', engineCode: 'D2676', engineName: '12.4 Diesel', displacementCc: 12400, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '480cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'MAN', model: 'TGS 26.440', trim: 'Diesel', engineCode: 'D2066', engineName: '10.5 Diesel', displacementCc: 10500, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '440cv', sources: ['fipe'] }, 2018, 2024),
  // Iveco
  ...gen({ brand: 'Iveco', model: 'Daily 35-150', trim: 'Diesel', engineCode: 'F1C', engineName: '3.0 Diesel', displacementCc: 2998, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '150cv', sources: ['fipe'] }, 2008, 2024),
  ...gen({ brand: 'Iveco', model: 'Tector 170E28', trim: 'Diesel', engineCode: 'NEF', engineName: '6.7 Diesel', displacementCc: 6700, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '280cv', sources: ['fipe'] }, 2012, 2024),
  ...gen({ brand: 'Iveco', model: 'Hi-Way 600S44T', trim: 'Diesel', engineCode: 'Cursor', engineName: '12.9 Diesel', displacementCc: 12900, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '440cv', sources: ['fipe'] }, 2016, 2024),
  // DAF
  ...gen({ brand: 'DAF', model: 'XF 105.460', trim: 'Diesel', engineCode: 'MX', engineName: '12.9 Diesel', displacementCc: 12900, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '460cv', sources: ['fipe'] }, 2013, 2024),
  ...gen({ brand: 'DAF', model: 'XF 530', trim: 'Diesel', engineCode: 'MX', engineName: '12.9 Diesel', displacementCc: 12900, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '530cv', sources: ['fipe'] }, 2020, 2024),
  // Ônibus
  ...gen({ brand: 'Mercedes-Benz', model: 'OF 1721', trim: 'Diesel', engineCode: 'OM926', engineName: '7.2 Diesel', displacementCc: 7200, fuel: 'diesel', transmission: 'manual', bodyType: 'bus', vehicleType: 'bus', power: '210cv', sources: ['fipe'] }, 2000, 2024),
  ...gen({ brand: 'Mercedes-Benz', model: 'O 500 RS', trim: 'Diesel', engineCode: 'OM457', engineName: '12.0 Diesel', displacementCc: 12000, fuel: 'diesel', transmission: 'automatic', bodyType: 'bus', vehicleType: 'bus', power: '360cv', sources: ['fipe'] }, 2005, 2024),
  ...gen({ brand: 'Volvo', model: 'B270F', trim: 'Diesel', engineCode: 'D8K', engineName: '7.7 Diesel', displacementCc: 7700, fuel: 'diesel', transmission: 'automatic', bodyType: 'bus', vehicleType: 'bus', power: '270cv', sources: ['fipe'] }, 2010, 2024),
  ...gen({ brand: 'Scania', model: 'K310', trim: 'Diesel', engineCode: 'DC09', engineName: '9.3 Diesel', displacementCc: 9300, fuel: 'diesel', transmission: 'automatic', bodyType: 'bus', vehicleType: 'bus', power: '310cv', sources: ['fipe'] }, 2010, 2024),
];

// ============================================================================
// PREMIUM / IMPORTADOS
// ============================================================================
const PREMIUM: VehicleVariant[] = [
  // BMW
  ...gen({ brand: 'BMW', model: 'Série 3 320i', trim: 'Sport', engineCode: 'B48', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '184cv', sources: ['fipe'] }, 2012, 2024),
  ...gen({ brand: 'BMW', model: 'Série 3 330i', trim: 'M Sport', engineCode: 'B48', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '258cv', sources: ['fipe'] }, 2015, 2024),
  ...gen({ brand: 'BMW', model: 'Série 5 530i', trim: 'M Sport', engineCode: 'B48', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '252cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'BMW', model: 'X1 sDrive20i', trim: 'GP', engineCode: 'B48', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '192cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'BMW', model: 'X3 xDrive30i', trim: 'M Sport', engineCode: 'B48', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '252cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'BMW', model: 'X5 xDrive40i', trim: 'M Sport', engineCode: 'B58', engineName: '3.0 Turbo', displacementCc: 2998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '340cv', sources: ['fipe'] }, 2019, 2024),
  // Mercedes-Benz
  ...gen({ brand: 'Mercedes-Benz', model: 'Classe A 200', trim: 'Style', engineCode: 'M282', engineName: '1.3 Turbo', displacementCc: 1332, fuel: 'gasoline', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '163cv', sources: ['fipe'] }, 2019, 2024),
  ...gen({ brand: 'Mercedes-Benz', model: 'Classe C 200', trim: 'Avantgarde', engineCode: 'M264', engineName: '1.5 Turbo', displacementCc: 1496, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '204cv', sources: ['fipe'] }, 2014, 2024),
  ...gen({ brand: 'Mercedes-Benz', model: 'Classe C 300', trim: 'AMG Line', engineCode: 'M264', engineName: '2.0 Turbo', displacementCc: 1991, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '258cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Mercedes-Benz', model: 'Classe E 300', trim: 'Avantgarde', engineCode: 'M264', engineName: '2.0 Turbo', displacementCc: 1991, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '258cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Mercedes-Benz', model: 'GLA 200', trim: 'Style', engineCode: 'M282', engineName: '1.3 Turbo', displacementCc: 1332, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '163cv', sources: ['fipe'] }, 2014, 2024),
  ...gen({ brand: 'Mercedes-Benz', model: 'GLC 300', trim: 'AMG Line', engineCode: 'M264', engineName: '2.0 Turbo', displacementCc: 1991, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '258cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Mercedes-Benz', model: 'GLE 450', trim: 'AMG Line', engineCode: 'M256', engineName: '3.0 Turbo', displacementCc: 2999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '367cv', sources: ['fipe'] }, 2019, 2024),
  // Audi
  ...gen({ brand: 'Audi', model: 'A3 Sedan', trim: 'Performance', engineCode: 'EA888', engineName: '2.0 TFSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '190cv', sources: ['fipe'] }, 2014, 2024),
  ...gen({ brand: 'Audi', model: 'A4', trim: 'Prestige Plus', engineCode: 'EA888', engineName: '2.0 TFSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '190cv', sources: ['fipe'] }, 2016, 2024),
  ...gen({ brand: 'Audi', model: 'A5 Sportback', trim: 'Prestige Plus', engineCode: 'EA888', engineName: '2.0 TFSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '190cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Audi', model: 'Q3', trim: 'Prestige', engineCode: 'EA888', engineName: '2.0 TFSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '190cv', sources: ['fipe'] }, 2013, 2024),
  ...gen({ brand: 'Audi', model: 'Q5', trim: 'Prestige Plus', engineCode: 'EA888', engineName: '2.0 TFSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '252cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Audi', model: 'Q7', trim: 'Performance', engineCode: 'EA839', engineName: '3.0 TFSI', displacementCc: 2995, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '340cv', sources: ['fipe'] }, 2015, 2024),
  // Volvo
  ...gen({ brand: 'Volvo', model: 'XC40', trim: 'T4 Momentum', engineCode: 'B4204T47', engineName: '2.0 Turbo', displacementCc: 1969, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '190cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'Volvo', model: 'XC60', trim: 'T5 Momentum', engineCode: 'B4204T23', engineName: '2.0 Turbo', displacementCc: 1969, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '254cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Volvo', model: 'XC90', trim: 'T8 Inscription', engineCode: 'B4204T35', engineName: '2.0 Turbo Hybrid', displacementCc: 1969, fuel: 'hybrid', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '407cv', sources: ['fipe'] }, 2015, 2024),
  // Land Rover
  ...gen({ brand: 'Land Rover', model: 'Discovery Sport', trim: 'SE', engineCode: 'Ingenium', engineName: '2.0 Turbo', displacementCc: 1999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '250cv', sources: ['fipe'] }, 2015, 2024),
  ...gen({ brand: 'Land Rover', model: 'Range Rover Evoque', trim: 'SE', engineCode: 'Ingenium', engineName: '2.0 Turbo', displacementCc: 1999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '250cv', sources: ['fipe'] }, 2011, 2024),
  ...gen({ brand: 'Land Rover', model: 'Range Rover Velar', trim: 'R-Dynamic SE', engineCode: 'Ingenium', engineName: '2.0 Turbo', displacementCc: 1999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '250cv', sources: ['fipe'] }, 2017, 2024),
  ...gen({ brand: 'Land Rover', model: 'Range Rover Sport', trim: 'HSE', engineCode: 'Ingenium', engineName: '3.0 Turbo', displacementCc: 2996, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '360cv', sources: ['fipe'] }, 2013, 2024),
  ...gen({ brand: 'Land Rover', model: 'Defender', trim: '110 SE', engineCode: 'Ingenium', engineName: '2.0 Turbo', displacementCc: 1999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '300cv', sources: ['fipe'] }, 2020, 2024),
  // Porsche
  ...gen({ brand: 'Porsche', model: 'Cayenne', trim: 'S', engineCode: 'V6 Turbo', engineName: '2.9 V6 Turbo', displacementCc: 2894, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '440cv', sources: ['fipe'] }, 2010, 2024),
  ...gen({ brand: 'Porsche', model: 'Macan', trim: 'S', engineCode: 'V6 Turbo', engineName: '2.9 V6 Turbo', displacementCc: 2894, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '380cv', sources: ['fipe'] }, 2014, 2024),
  ...gen({ brand: 'Porsche', model: '911 Carrera', trim: 'S', engineCode: 'Boxer', engineName: '3.0 Turbo', displacementCc: 2981, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '450cv', sources: ['fipe'] }, 2012, 2024),
  ...gen({ brand: 'Porsche', model: 'Panamera', trim: '4S', engineCode: 'V6 Turbo', engineName: '2.9 V6 Turbo', displacementCc: 2894, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '440cv', sources: ['fipe'] }, 2009, 2024),
  // RAM
  ...gen({ brand: 'RAM', model: '1500', trim: 'Laramie', engineCode: 'Hemi', engineName: '5.7 V8', displacementCc: 5654, fuel: 'gasoline', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '401cv', sources: ['fipe'] }, 2019, 2024),
  ...gen({ brand: 'RAM', model: '2500', trim: 'Laramie', engineCode: 'Cummins', engineName: '6.7 Diesel', displacementCc: 6700, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '365cv', sources: ['fipe'] }, 2012, 2024),
  ...gen({ brand: 'RAM', model: '3500', trim: 'Laramie', engineCode: 'Cummins', engineName: '6.7 Diesel', displacementCc: 6700, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '365cv', sources: ['fipe'] }, 2019, 2024),
];

// ============================================================================
// CHINESES E ELÉTRICOS
// ============================================================================
const CHINESE_ELECTRIC: VehicleVariant[] = [
  // BYD
  ...gen({ brand: 'BYD', model: 'Dolphin', trim: 'GL', engineCode: 'BYD', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '95cv', sources: ['fipe'] }, 2023, 2024),
  ...gen({ brand: 'BYD', model: 'Dolphin Mini', trim: 'Standard', engineCode: 'BYD', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '75cv', sources: ['fipe'] }, 2024, 2024),
  ...gen({ brand: 'BYD', model: 'Song Plus', trim: 'GL', engineCode: 'BYD', engineName: 'Híbrido Plug-in', displacementCc: 1499, fuel: 'hybrid', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '197cv', sources: ['fipe'] }, 2023, 2024),
  ...gen({ brand: 'BYD', model: 'Yuan Plus', trim: 'GL', engineCode: 'BYD', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '204cv', sources: ['fipe'] }, 2023, 2024),
  ...gen({ brand: 'BYD', model: 'Tan', trim: 'EV', engineCode: 'BYD', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '517cv', sources: ['fipe'] }, 2023, 2024),
  ...gen({ brand: 'BYD', model: 'Han', trim: 'EV', engineCode: 'BYD', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '517cv', sources: ['fipe'] }, 2023, 2024),
  ...gen({ brand: 'BYD', model: 'Seal', trim: 'EV', engineCode: 'BYD', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '313cv', sources: ['fipe'] }, 2024, 2024),
  // GWM
  ...gen({ brand: 'GWM', model: 'Haval H6', trim: 'GT', engineCode: 'GW4N20', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '211cv', sources: ['fipe'] }, 2021, 2024),
  ...gen({ brand: 'GWM', model: 'Haval H6', trim: 'PHEV', engineCode: 'GW4N20', engineName: '1.5 Turbo Híbrido', displacementCc: 1498, fuel: 'hybrid', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '243cv', sources: ['fipe'] }, 2022, 2024),
  ...gen({ brand: 'GWM', model: 'Ora 03', trim: 'Skin', engineCode: 'GWM', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '171cv', sources: ['fipe'] }, 2023, 2024),
  ...gen({ brand: 'GWM', model: 'Poer', trim: 'Diesel', engineCode: 'GW4D20M', engineName: '2.0 Diesel', displacementCc: 1996, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '163cv', sources: ['fipe'] }, 2022, 2024),
  // Caoa Chery
  ...gen({ brand: 'Caoa Chery', model: 'Tiggo 5X', trim: 'TXS', engineCode: 'SQRE4T15B', engineName: '1.5 Turbo', displacementCc: 1498, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '150cv', sources: ['fipe'] }, 2019, 2024),
  ...gen({ brand: 'Caoa Chery', model: 'Tiggo 7', trim: 'TXS', engineCode: 'SQRE4T15C', engineName: '1.5 Turbo', displacementCc: 1498, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '150cv', sources: ['fipe'] }, 2019, 2024),
  ...gen({ brand: 'Caoa Chery', model: 'Tiggo 8', trim: 'TXS', engineCode: 'SQRF4J20', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '187cv', sources: ['fipe'] }, 2020, 2024),
  ...gen({ brand: 'Caoa Chery', model: 'Arrizo 6', trim: 'GSX', engineCode: 'SQRE4T15B', engineName: '1.5 Turbo', displacementCc: 1498, fuel: 'flex', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '150cv', sources: ['fipe'] }, 2020, 2024),
  ...gen({ brand: 'Caoa Chery', model: 'iCar', trim: 'EV', engineCode: 'Chery', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '61cv', sources: ['fipe'] }, 2023, 2024),
  // JAC
  ...gen({ brand: 'JAC', model: 'T40', trim: 'CVT', engineCode: 'HFC4GB2.3D', engineName: '1.5', displacementCc: 1498, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '113cv', sources: ['fipe'] }, 2018, 2024),
  ...gen({ brand: 'JAC', model: 'T50', trim: 'CVT', engineCode: 'HFC4GB2.3D', engineName: '1.5 Turbo', displacementCc: 1498, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '150cv', sources: ['fipe'] }, 2019, 2024),
  ...gen({ brand: 'JAC', model: 'T60', trim: 'CVT', engineCode: 'HFC4GB2.3D', engineName: '1.5 Turbo', displacementCc: 1498, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '150cv', sources: ['fipe'] }, 2019, 2024),
  ...gen({ brand: 'JAC', model: 'T80', trim: 'CVT', engineCode: 'HFC4GA3-3D', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '204cv', sources: ['fipe'] }, 2019, 2024),
  ...gen({ brand: 'JAC', model: 'e-JS1', trim: 'EV', engineCode: 'JAC', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '61cv', sources: ['fipe'] }, 2021, 2024),
  ...gen({ brand: 'JAC', model: 'e-JS4', trim: 'EV', engineCode: 'JAC', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '150cv', sources: ['fipe'] }, 2022, 2024),
];

// ============================================================================
// EXPORTAÇÃO FINAL
// ============================================================================
export const BRAZILIAN_VEHICLES_COMPLETE: VehicleVariant[] = [
  ...VW,
  ...CHEVROLET,
  ...FIAT,
  ...FORD,
  ...TOYOTA,
  ...HONDA,
  ...HYUNDAI,
  ...RENAULT,
  ...NISSAN,
  ...PEUGEOT,
  ...CITROEN,
  ...MITSUBISHI,
  ...JEEP,
  ...KIA,
  ...HONDA_MOTOS,
  ...YAMAHA_MOTOS,
  ...OTHER_MOTOS,
  ...TRUCKS,
  ...PREMIUM,
  ...CHINESE_ELECTRIC,
];

// Estatísticas da base
export const DATABASE_STATS = {
  totalVehicles: BRAZILIAN_VEHICLES_COMPLETE.length,
  brands: [...new Set(BRAZILIAN_VEHICLES_COMPLETE.map(v => v.brand))].length,
  cars: BRAZILIAN_VEHICLES_COMPLETE.filter(v => v.vehicleType === 'car').length,
  motorcycles: BRAZILIAN_VEHICLES_COMPLETE.filter(v => v.vehicleType === 'motorcycle').length,
  trucks: BRAZILIAN_VEHICLES_COMPLETE.filter(v => v.vehicleType === 'truck').length,
  suvs: BRAZILIAN_VEHICLES_COMPLETE.filter(v => v.vehicleType === 'suv').length,
  pickups: BRAZILIAN_VEHICLES_COMPLETE.filter(v => v.vehicleType === 'pickup').length,
  vans: BRAZILIAN_VEHICLES_COMPLETE.filter(v => v.vehicleType === 'van').length,
  buses: BRAZILIAN_VEHICLES_COMPLETE.filter(v => v.vehicleType === 'bus').length,
  version: '5.0.0',
  lastUpdated: new Date().toISOString(),
};

// Export default
export default BRAZILIAN_VEHICLES_COMPLETE;
