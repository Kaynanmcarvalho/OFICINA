/**
 * Brazilian Vehicles Database - COMPLETE EDITION
 * Base de dados COMPLETA de veículos brasileiros
 * Inclui: Carros, Motos, Caminhões, Ônibus, Vans, Pickups, SUVs
 * @version 4.0.0 - Edição Absoluta Completa
 */

import type { VehicleVariant } from '../types';

// Helper para gerar ID único
const genId = (brand: string, model: string, year: number, engine?: string, trim?: string): string => {
  const parts = [brand, model, year.toString()];
  if (engine) parts.push(engine.replace(/[^a-zA-Z0-9]/g, ''));
  if (trim) parts.push(trim.replace(/[^a-zA-Z0-9]/g, ''));
  return parts.join('_').toLowerCase();
};

// Helper para gerar variantes por range de anos
const generateYearVariants = (
  base: Omit<VehicleVariant, 'id' | 'year' | 'lastUpdated'>,
  startYear: number,
  endYear: number
): VehicleVariant[] => {
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
// VOLKSWAGEN - COMPLETO
// ============================================================================
const VW_VARIANTS: VehicleVariant[] = [
  // Gol
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Gol', trim: '1.0', engineCode: 'EA111', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '76cv', sources: ['fipe'] }, 1995, 2024),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Gol', trim: '1.6', engineCode: 'EA111', engineName: '1.6 8V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '101cv', sources: ['fipe'] }, 1995, 2024),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Gol', trim: 'GTI', engineCode: 'EA111', engineName: '2.0 16V', displacementCc: 1984, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '150cv', sources: ['fipe'] }, 1994, 1996),
  // Voyage
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Voyage', trim: '1.0', engineCode: 'EA111', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '76cv', sources: ['fipe'] }, 2008, 2024),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Voyage', trim: '1.6', engineCode: 'EA111', engineName: '1.6 8V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '101cv', sources: ['fipe'] }, 2008, 2024),
  // Saveiro
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Saveiro', trim: '1.6', engineCode: 'EA111', engineName: '1.6 8V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '101cv', sources: ['fipe'] }, 1998, 2024),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Saveiro', trim: 'Cross', engineCode: 'EA211', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '120cv', sources: ['fipe'] }, 2010, 2024),
  // Fox
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Fox', trim: '1.0', engineCode: 'EA111', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '76cv', sources: ['fipe'] }, 2003, 2021),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Fox', trim: '1.6', engineCode: 'EA111', engineName: '1.6 8V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '101cv', sources: ['fipe'] }, 2003, 2021),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'CrossFox', trim: '1.6', engineCode: 'EA111', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '120cv', sources: ['fipe'] }, 2005, 2021),
  // SpaceFox
  ...generateYearVariants({ brand: 'Volkswagen', model: 'SpaceFox', trim: '1.6', engineCode: 'EA111', engineName: '1.6 8V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'wagon', vehicleType: 'car', power: '101cv', sources: ['fipe'] }, 2006, 2018),
  // Golf
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Golf', trim: '1.6', engineCode: 'EA111', engineName: '1.6 8V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '101cv', sources: ['fipe'] }, 1999, 2013),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Golf', trim: '2.0', engineCode: 'EA113', engineName: '2.0 8V', displacementCc: 1984, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '116cv', sources: ['fipe'] }, 1999, 2013),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Golf', trim: 'GTI', engineCode: 'EA888', engineName: '2.0 TSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '230cv', sources: ['fipe'] }, 2014, 2024),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Golf', trim: '1.4 TSI', engineCode: 'CZCA', engineName: '1.4 TSI', displacementCc: 1395, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '150cv', sources: ['fipe'] }, 2014, 2024),
  // Polo
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Polo', trim: '1.0 MPI', engineCode: 'EA211', engineName: '1.0 MPI', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '84cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Polo', trim: '1.0 TSI', engineCode: 'DKLA', engineName: '1.0 TSI', displacementCc: 999, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '128cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Polo', trim: 'GTS', engineCode: 'EA211', engineName: '1.4 TSI', displacementCc: 1395, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '150cv', sources: ['fipe'] }, 2020, 2024),
  // Virtus
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Virtus', trim: '1.0 MPI', engineCode: 'EA211', engineName: '1.0 MPI', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '84cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Virtus', trim: '1.0 TSI', engineCode: 'DKLA', engineName: '1.0 TSI', displacementCc: 999, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '128cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Virtus', trim: 'GTS', engineCode: 'EA211', engineName: '1.4 TSI', displacementCc: 1395, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '150cv', sources: ['fipe'] }, 2020, 2024),
  // Jetta
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Jetta', trim: '2.0', engineCode: 'EA113', engineName: '2.0 8V', displacementCc: 1984, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '120cv', sources: ['fipe'] }, 2006, 2018),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Jetta', trim: '1.4 TSI', engineCode: 'EA211', engineName: '1.4 TSI', displacementCc: 1395, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '150cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Jetta', trim: 'GLI', engineCode: 'EA888', engineName: '2.0 TSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '230cv', sources: ['fipe'] }, 2019, 2024),
  // Passat
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Passat', trim: '2.0 TSI', engineCode: 'EA888', engineName: '2.0 TSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '220cv', sources: ['fipe'] }, 2011, 2020),
  // T-Cross
  ...generateYearVariants({ brand: 'Volkswagen', model: 'T-Cross', trim: '1.0 MPI', engineCode: 'EA211', engineName: '1.0 MPI', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'suv', vehicleType: 'suv', power: '84cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'T-Cross', trim: '1.0 TSI', engineCode: 'DKLA', engineName: '1.0 TSI', displacementCc: 999, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '128cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'T-Cross', trim: '1.4 TSI', engineCode: 'EA211', engineName: '1.4 TSI', displacementCc: 1395, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '150cv', sources: ['fipe'] }, 2019, 2024),
  // Nivus
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Nivus', trim: '1.0 TSI', engineCode: 'DKLA', engineName: '1.0 TSI', displacementCc: 999, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '128cv', sources: ['fipe'] }, 2020, 2024),
  // Taos
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Taos', trim: '1.4 TSI', engineCode: 'EA211', engineName: '1.4 TSI', displacementCc: 1395, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '150cv', sources: ['fipe'] }, 2021, 2024),
  // Tiguan
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Tiguan', trim: '2.0 TSI', engineCode: 'EA888', engineName: '2.0 TSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '220cv', sources: ['fipe'] }, 2009, 2024),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Tiguan Allspace', trim: '2.0 TSI', engineCode: 'EA888', engineName: '2.0 TSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '220cv', sources: ['fipe'] }, 2018, 2024),
  // Touareg
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Touareg', trim: '3.6 V6', engineCode: 'VR6', engineName: '3.6 V6', displacementCc: 3597, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '280cv', sources: ['fipe'] }, 2011, 2018),
  // Amarok
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Amarok', trim: '2.0 TDI', engineCode: 'CDCA', engineName: '2.0 TDI', displacementCc: 1968, fuel: 'diesel', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '140cv', sources: ['fipe'] }, 2010, 2024),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Amarok', trim: '3.0 V6 TDI', engineCode: 'DDXC', engineName: '3.0 V6 TDI', displacementCc: 2967, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '258cv', sources: ['fipe'] }, 2018, 2024),
  // Kombi
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Kombi', trim: '1.4', engineCode: 'EA111', engineName: '1.4 8V', displacementCc: 1390, fuel: 'flex', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '80cv', sources: ['fipe'] }, 1997, 2014),
  // Up!
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Up!', trim: '1.0 MPI', engineCode: 'EA211', engineName: '1.0 MPI', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '82cv', sources: ['fipe'] }, 2014, 2021),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Up!', trim: '1.0 TSI', engineCode: 'EA211', engineName: '1.0 TSI', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '105cv', sources: ['fipe'] }, 2016, 2021),
  // Fusca (clássico)
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Fusca', trim: '1300', engineCode: 'Boxer', engineName: '1.3', displacementCc: 1285, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '46cv', sources: ['fipe'] }, 1970, 1996),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Fusca', trim: '1600', engineCode: 'Boxer', engineName: '1.6', displacementCc: 1584, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '65cv', sources: ['fipe'] }, 1970, 1996),
  // Brasília
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Brasília', trim: '1600', engineCode: 'Boxer', engineName: '1.6', displacementCc: 1584, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '65cv', sources: ['fipe'] }, 1973, 1982),
  // Santana
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Santana', trim: '2.0', engineCode: 'AP', engineName: '2.0 8V', displacementCc: 1984, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '115cv', sources: ['fipe'] }, 1984, 2006),
  // Parati
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Parati', trim: '1.6', engineCode: 'AP', engineName: '1.6 8V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'wagon', vehicleType: 'car', power: '101cv', sources: ['fipe'] }, 1982, 2013),
  // Caminhões VW
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Delivery 9.170', trim: 'Diesel', engineCode: 'MWM', engineName: '4.8 Diesel', displacementCc: 4800, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '170cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Delivery 11.180', trim: 'Diesel', engineCode: 'MWM', engineName: '4.8 Diesel', displacementCc: 4800, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '180cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Constellation 24.280', trim: 'Diesel', engineCode: 'MWM', engineName: '6.9 Diesel', displacementCc: 6900, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '280cv', sources: ['fipe'] }, 2006, 2024),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Constellation 25.420', trim: 'Diesel', engineCode: 'MAN', engineName: '12.4 Diesel', displacementCc: 12400, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '420cv', sources: ['fipe'] }, 2012, 2024),
  // Ônibus VW
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Volksbus 17.230', trim: 'Diesel', engineCode: 'MWM', engineName: '6.9 Diesel', displacementCc: 6900, fuel: 'diesel', transmission: 'manual', bodyType: 'bus', vehicleType: 'bus', power: '230cv', sources: ['fipe'] }, 2010, 2024),
];


// ============================================================================
// CHEVROLET/GM - COMPLETO
// ============================================================================
const CHEVROLET_VARIANTS: VehicleVariant[] = [
  // Celta
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Celta', trim: '1.0', engineCode: 'VHCE', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '78cv', sources: ['fipe'] }, 2000, 2015),
  // Prisma
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Prisma', trim: '1.0', engineCode: 'VHCE', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '78cv', sources: ['fipe'] }, 2006, 2019),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Prisma', trim: '1.4', engineCode: 'VHCE', engineName: '1.4 8V', displacementCc: 1389, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '106cv', sources: ['fipe'] }, 2006, 2019),
  // Corsa
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Corsa', trim: '1.0', engineCode: 'VHCE', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '78cv', sources: ['fipe'] }, 1994, 2012),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Corsa', trim: '1.4', engineCode: 'VHCE', engineName: '1.4 8V', displacementCc: 1389, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '95cv', sources: ['fipe'] }, 1994, 2012),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Corsa Sedan', trim: '1.0', engineCode: 'VHCE', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '78cv', sources: ['fipe'] }, 1996, 2012),
  // Classic
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Classic', trim: '1.0', engineCode: 'VHCE', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '78cv', sources: ['fipe'] }, 2010, 2016),
  // Astra
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Astra', trim: '2.0', engineCode: 'Ecotec', engineName: '2.0 8V', displacementCc: 1998, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '121cv', sources: ['fipe'] }, 1998, 2011),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Astra Sedan', trim: '2.0', engineCode: 'Ecotec', engineName: '2.0 8V', displacementCc: 1998, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '121cv', sources: ['fipe'] }, 1998, 2011),
  // Vectra
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Vectra', trim: '2.0', engineCode: 'Ecotec', engineName: '2.0 8V', displacementCc: 1998, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '140cv', sources: ['fipe'] }, 1996, 2011),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Vectra GT', trim: '2.0', engineCode: 'Ecotec', engineName: '2.0 8V', displacementCc: 1998, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '140cv', sources: ['fipe'] }, 2007, 2011),
  // Omega
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Omega', trim: '3.6 V6', engineCode: 'HFV6', engineName: '3.6 V6', displacementCc: 3564, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '292cv', sources: ['fipe'] }, 2005, 2011),
  // Onix
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Onix', trim: '1.0', engineCode: 'SPE/4', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '80cv', sources: ['fipe'] }, 2012, 2019),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Onix', trim: '1.4', engineCode: 'SPE/4', engineName: '1.4 8V', displacementCc: 1389, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '106cv', sources: ['fipe'] }, 2012, 2019),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Onix', trim: '1.0 Turbo', engineCode: 'B12D1', engineName: '1.0 Turbo', displacementCc: 999, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '116cv', sources: ['fipe'] }, 2020, 2024),
  // Onix Plus
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Onix Plus', trim: '1.0 Turbo', engineCode: 'B12D1', engineName: '1.0 Turbo', displacementCc: 999, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '116cv', sources: ['fipe'] }, 2020, 2024),
  // Cruze
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Cruze', trim: '1.4 Turbo', engineCode: 'LE2', engineName: '1.4 Turbo', displacementCc: 1399, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '153cv', sources: ['fipe'] }, 2017, 2024),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Cruze Sport6', trim: '1.4 Turbo', engineCode: 'LE2', engineName: '1.4 Turbo', displacementCc: 1399, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '153cv', sources: ['fipe'] }, 2017, 2024),
  // Cobalt
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Cobalt', trim: '1.4', engineCode: 'SPE/4', engineName: '1.4 8V', displacementCc: 1389, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '106cv', sources: ['fipe'] }, 2011, 2020),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Cobalt', trim: '1.8', engineCode: 'Ecotec', engineName: '1.8 8V', displacementCc: 1796, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '111cv', sources: ['fipe'] }, 2011, 2020),
  // Spin
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Spin', trim: '1.8', engineCode: 'Ecotec', engineName: '1.8 8V', displacementCc: 1796, fuel: 'flex', transmission: 'automatic', bodyType: 'van', vehicleType: 'van', power: '111cv', sources: ['fipe'] }, 2012, 2024),
  // Tracker
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Tracker', trim: '1.0 Turbo', engineCode: 'B12D1', engineName: '1.0 Turbo', displacementCc: 999, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '116cv', sources: ['fipe'] }, 2020, 2024),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Tracker', trim: '1.2 Turbo', engineCode: 'HRA', engineName: '1.2 Turbo', displacementCc: 1199, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '133cv', sources: ['fipe'] }, 2021, 2024),
  // Equinox
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Equinox', trim: '2.0 Turbo', engineCode: 'LTG', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '262cv', sources: ['fipe'] }, 2018, 2024),
  // Trailblazer
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Trailblazer', trim: '2.8 Diesel', engineCode: 'LWH', engineName: '2.8 Diesel', displacementCc: 2776, fuel: 'diesel', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '200cv', sources: ['fipe'] }, 2012, 2024),
  // Captiva
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Captiva', trim: '2.4', engineCode: 'LE5', engineName: '2.4 16V', displacementCc: 2384, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '171cv', sources: ['fipe'] }, 2008, 2017),
  // Montana
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Montana', trim: '1.4', engineCode: 'SPE/4', engineName: '1.4 8V', displacementCc: 1389, fuel: 'flex', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '106cv', sources: ['fipe'] }, 2003, 2022),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Montana', trim: '1.2 Turbo', engineCode: 'HRA', engineName: '1.2 Turbo', displacementCc: 1199, fuel: 'flex', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '133cv', sources: ['fipe'] }, 2023, 2024),
  // S10
  ...generateYearVariants({ brand: 'Chevrolet', model: 'S10', trim: '2.4', engineCode: 'Ecotec', engineName: '2.4 16V', displacementCc: 2384, fuel: 'flex', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '147cv', sources: ['fipe'] }, 1995, 2024),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'S10', trim: '2.8 Diesel', engineCode: 'LWH', engineName: '2.8 Diesel', displacementCc: 2776, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '200cv', sources: ['fipe'] }, 2012, 2024),
  // Blazer
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Blazer', trim: '2.4', engineCode: 'Ecotec', engineName: '2.4 16V', displacementCc: 2384, fuel: 'flex', transmission: 'manual', bodyType: 'suv', vehicleType: 'suv', power: '147cv', sources: ['fipe'] }, 1995, 2011),
  // Camaro
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Camaro', trim: 'SS 6.2 V8', engineCode: 'LT1', engineName: '6.2 V8', displacementCc: 6162, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '461cv', sources: ['fipe'] }, 2010, 2024),
  // Opala
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Opala', trim: '4.1', engineCode: 'OHC', engineName: '4.1 6cil', displacementCc: 4093, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '140cv', sources: ['fipe'] }, 1968, 1992),
  // Chevette
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Chevette', trim: '1.6', engineCode: 'OHC', engineName: '1.6 8V', displacementCc: 1598, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '73cv', sources: ['fipe'] }, 1973, 1993),
  // Monza
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Monza', trim: '2.0', engineCode: 'OHC', engineName: '2.0 8V', displacementCc: 1998, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '110cv', sources: ['fipe'] }, 1982, 1996),
  // Kadett
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Kadett', trim: '2.0', engineCode: 'OHC', engineName: '2.0 8V', displacementCc: 1998, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '110cv', sources: ['fipe'] }, 1989, 1998),
  // === VERSÕES ADICIONAIS DE MOTORIZAÇÃO ===
  // Corsa 1.6
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Corsa', trim: '1.6', engineCode: 'VHCE', engineName: '1.6 8V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '105cv', sources: ['fipe'] }, 1996, 2003),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Corsa', trim: '1.6 16V', engineCode: 'VHCE', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '110cv', sources: ['fipe'] }, 1997, 2002),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Corsa Sedan', trim: '1.6', engineCode: 'VHCE', engineName: '1.6 8V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '105cv', sources: ['fipe'] }, 1996, 2003),
  // Celta 1.4
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Celta', trim: '1.4', engineCode: 'VHCE', engineName: '1.4 8V', displacementCc: 1389, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '95cv', sources: ['fipe'] }, 2003, 2015),
  // Astra 1.8 e 2.0 16V
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Astra', trim: '1.8', engineCode: 'Ecotec', engineName: '1.8 8V', displacementCc: 1796, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '110cv', sources: ['fipe'] }, 1998, 2004),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Astra', trim: '2.0 16V', engineCode: 'Ecotec', engineName: '2.0 16V', displacementCc: 1998, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '136cv', sources: ['fipe'] }, 1999, 2011),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Astra Sedan', trim: '1.8', engineCode: 'Ecotec', engineName: '1.8 8V', displacementCc: 1796, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '110cv', sources: ['fipe'] }, 1998, 2004),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Astra Sedan', trim: '2.0 16V', engineCode: 'Ecotec', engineName: '2.0 16V', displacementCc: 1998, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '136cv', sources: ['fipe'] }, 1999, 2011),
  // Vectra 2.0 16V e 2.2
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Vectra', trim: '2.0 16V', engineCode: 'Ecotec', engineName: '2.0 16V', displacementCc: 1998, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '148cv', sources: ['fipe'] }, 2006, 2011),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Vectra', trim: '2.2', engineCode: 'Ecotec', engineName: '2.2 16V', displacementCc: 2198, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '147cv', sources: ['fipe'] }, 1997, 2005),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Vectra GT', trim: '2.0 16V', engineCode: 'Ecotec', engineName: '2.0 16V', displacementCc: 1998, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '148cv', sources: ['fipe'] }, 2008, 2011),
  // Cruze 1.8 (geração anterior)
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Cruze', trim: '1.8', engineCode: 'Ecotec', engineName: '1.8 16V', displacementCc: 1796, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '144cv', sources: ['fipe'] }, 2011, 2016),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Cruze Sport6', trim: '1.8', engineCode: 'Ecotec', engineName: '1.8 16V', displacementCc: 1796, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '144cv', sources: ['fipe'] }, 2012, 2016),
  // Omega versões anteriores
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Omega', trim: '2.0', engineCode: 'OHC', engineName: '2.0 8V', displacementCc: 1998, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '116cv', sources: ['fipe'] }, 1992, 1998),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Omega', trim: '2.2', engineCode: 'OHC', engineName: '2.2 8V', displacementCc: 2198, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '120cv', sources: ['fipe'] }, 1992, 1998),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Omega', trim: '3.0', engineCode: 'OHC', engineName: '3.0 12V', displacementCc: 2962, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '165cv', sources: ['fipe'] }, 1992, 1998),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Omega', trim: '4.1', engineCode: 'OHC', engineName: '4.1 12V', displacementCc: 4093, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '180cv', sources: ['fipe'] }, 1994, 1998),
  // Captiva 3.6 V6
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Captiva', trim: '3.6 V6', engineCode: 'HFV6', engineName: '3.6 V6', displacementCc: 3564, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '261cv', sources: ['fipe'] }, 2008, 2017),
  // Tracker antiga (2013-2016)
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Tracker', trim: '1.8', engineCode: 'Ecotec', engineName: '1.8 16V', displacementCc: 1796, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '144cv', sources: ['fipe'] }, 2013, 2016),
  // Malibu
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Malibu', trim: '2.4', engineCode: 'Ecotec', engineName: '2.4 16V', displacementCc: 2384, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '171cv', sources: ['fipe'] }, 2010, 2013),
  // Sonic
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Sonic', trim: '1.6', engineCode: 'Ecotec', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '120cv', sources: ['fipe'] }, 2012, 2014),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Sonic Sedan', trim: '1.6', engineCode: 'Ecotec', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '120cv', sources: ['fipe'] }, 2012, 2014),
  // Agile
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Agile', trim: '1.4', engineCode: 'VHCE', engineName: '1.4 8V', displacementCc: 1389, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '102cv', sources: ['fipe'] }, 2009, 2014),
  // Meriva
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Meriva', trim: '1.4', engineCode: 'VHCE', engineName: '1.4 8V', displacementCc: 1389, fuel: 'flex', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '102cv', sources: ['fipe'] }, 2002, 2012),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Meriva', trim: '1.8', engineCode: 'Ecotec', engineName: '1.8 8V', displacementCc: 1796, fuel: 'flex', transmission: 'automatic', bodyType: 'van', vehicleType: 'van', power: '114cv', sources: ['fipe'] }, 2002, 2012),
  // Zafira
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Zafira', trim: '2.0', engineCode: 'Ecotec', engineName: '2.0 8V', displacementCc: 1998, fuel: 'flex', transmission: 'automatic', bodyType: 'van', vehicleType: 'van', power: '140cv', sources: ['fipe'] }, 2001, 2012),
  // Ipanema
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Ipanema', trim: '1.8', engineCode: 'OHC', engineName: '1.8 8V', displacementCc: 1796, fuel: 'gasoline', transmission: 'manual', bodyType: 'wagon', vehicleType: 'car', power: '99cv', sources: ['fipe'] }, 1989, 1998),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Ipanema', trim: '2.0', engineCode: 'OHC', engineName: '2.0 8V', displacementCc: 1998, fuel: 'gasoline', transmission: 'manual', bodyType: 'wagon', vehicleType: 'car', power: '110cv', sources: ['fipe'] }, 1989, 1998),
  // Suprema
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Suprema', trim: '2.0', engineCode: 'OHC', engineName: '2.0 8V', displacementCc: 1998, fuel: 'gasoline', transmission: 'manual', bodyType: 'wagon', vehicleType: 'car', power: '116cv', sources: ['fipe'] }, 1992, 1996),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Suprema', trim: '2.2', engineCode: 'OHC', engineName: '2.2 8V', displacementCc: 2198, fuel: 'gasoline', transmission: 'manual', bodyType: 'wagon', vehicleType: 'car', power: '120cv', sources: ['fipe'] }, 1992, 1996),
  // Caravan
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Caravan', trim: '2.5', engineCode: 'OHC', engineName: '2.5 8V', displacementCc: 2471, fuel: 'gasoline', transmission: 'manual', bodyType: 'wagon', vehicleType: 'car', power: '99cv', sources: ['fipe'] }, 1975, 1992),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Caravan', trim: '4.1', engineCode: 'OHC', engineName: '4.1 6cil', displacementCc: 4093, fuel: 'gasoline', transmission: 'manual', bodyType: 'wagon', vehicleType: 'car', power: '140cv', sources: ['fipe'] }, 1975, 1992),
];


// ============================================================================
// FIAT - COMPLETO
// ============================================================================
const FIAT_VARIANTS: VehicleVariant[] = [
  // Uno
  ...generateYearVariants({ brand: 'Fiat', model: 'Uno', trim: '1.0', engineCode: 'Fire', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '75cv', sources: ['fipe'] }, 1984, 2021),
  ...generateYearVariants({ brand: 'Fiat', model: 'Uno', trim: '1.4', engineCode: 'Fire', engineName: '1.4 8V', displacementCc: 1368, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '88cv', sources: ['fipe'] }, 2010, 2021),
  ...generateYearVariants({ brand: 'Fiat', model: 'Uno', trim: 'Mille', engineCode: 'Fire', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '65cv', sources: ['fipe'] }, 1990, 2014),
  // Palio
  ...generateYearVariants({ brand: 'Fiat', model: 'Palio', trim: '1.0', engineCode: 'Fire', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '75cv', sources: ['fipe'] }, 1996, 2017),
  ...generateYearVariants({ brand: 'Fiat', model: 'Palio', trim: '1.4', engineCode: 'Fire', engineName: '1.4 8V', displacementCc: 1368, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '88cv', sources: ['fipe'] }, 1996, 2017),
  ...generateYearVariants({ brand: 'Fiat', model: 'Palio', trim: '1.8', engineCode: 'E.torQ', engineName: '1.8 16V', displacementCc: 1796, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '132cv', sources: ['fipe'] }, 2003, 2017),
  ...generateYearVariants({ brand: 'Fiat', model: 'Palio Weekend', trim: '1.4', engineCode: 'Fire', engineName: '1.4 8V', displacementCc: 1368, fuel: 'flex', transmission: 'manual', bodyType: 'wagon', vehicleType: 'car', power: '88cv', sources: ['fipe'] }, 1997, 2017),
  ...generateYearVariants({ brand: 'Fiat', model: 'Palio Adventure', trim: '1.8', engineCode: 'E.torQ', engineName: '1.8 16V', displacementCc: 1796, fuel: 'flex', transmission: 'manual', bodyType: 'wagon', vehicleType: 'car', power: '132cv', sources: ['fipe'] }, 1999, 2017),
  // Siena
  ...generateYearVariants({ brand: 'Fiat', model: 'Siena', trim: '1.0', engineCode: 'Fire', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '75cv', sources: ['fipe'] }, 1997, 2017),
  ...generateYearVariants({ brand: 'Fiat', model: 'Siena', trim: '1.4', engineCode: 'Fire', engineName: '1.4 8V', displacementCc: 1368, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '88cv', sources: ['fipe'] }, 1997, 2017),
  ...generateYearVariants({ brand: 'Fiat', model: 'Grand Siena', trim: '1.4', engineCode: 'Fire', engineName: '1.4 8V', displacementCc: 1368, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '88cv', sources: ['fipe'] }, 2012, 2021),
  ...generateYearVariants({ brand: 'Fiat', model: 'Grand Siena', trim: '1.6', engineCode: 'E.torQ', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '117cv', sources: ['fipe'] }, 2012, 2021),
  // Punto
  ...generateYearVariants({ brand: 'Fiat', model: 'Punto', trim: '1.4', engineCode: 'Fire', engineName: '1.4 8V', displacementCc: 1368, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '88cv', sources: ['fipe'] }, 2007, 2017),
  ...generateYearVariants({ brand: 'Fiat', model: 'Punto', trim: '1.8', engineCode: 'E.torQ', engineName: '1.8 16V', displacementCc: 1796, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '132cv', sources: ['fipe'] }, 2007, 2017),
  ...generateYearVariants({ brand: 'Fiat', model: 'Punto T-Jet', trim: '1.4 Turbo', engineCode: 'T-Jet', engineName: '1.4 Turbo', displacementCc: 1368, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '152cv', sources: ['fipe'] }, 2008, 2017),
  // Linea
  ...generateYearVariants({ brand: 'Fiat', model: 'Linea', trim: '1.8', engineCode: 'E.torQ', engineName: '1.8 16V', displacementCc: 1796, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '132cv', sources: ['fipe'] }, 2009, 2016),
  // Bravo
  ...generateYearVariants({ brand: 'Fiat', model: 'Bravo', trim: '1.8', engineCode: 'E.torQ', engineName: '1.8 16V', displacementCc: 1796, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '132cv', sources: ['fipe'] }, 2010, 2016),
  ...generateYearVariants({ brand: 'Fiat', model: 'Bravo', trim: 'T-Jet', engineCode: 'T-Jet', engineName: '1.4 Turbo', displacementCc: 1368, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '152cv', sources: ['fipe'] }, 2010, 2016),
  // Argo
  ...generateYearVariants({ brand: 'Fiat', model: 'Argo', trim: '1.0', engineCode: 'Firefly', engineName: '1.0 6V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '77cv', sources: ['fipe'] }, 2017, 2024),
  ...generateYearVariants({ brand: 'Fiat', model: 'Argo', trim: '1.3', engineCode: 'Firefly', engineName: '1.3 8V', displacementCc: 1332, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '109cv', sources: ['fipe'] }, 2017, 2024),
  ...generateYearVariants({ brand: 'Fiat', model: 'Argo', trim: '1.8', engineCode: 'E.torQ', engineName: '1.8 16V', displacementCc: 1796, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '139cv', sources: ['fipe'] }, 2017, 2024),
  // Cronos
  ...generateYearVariants({ brand: 'Fiat', model: 'Cronos', trim: '1.3', engineCode: 'Firefly', engineName: '1.3 8V', displacementCc: 1332, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '109cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Fiat', model: 'Cronos', trim: '1.8', engineCode: 'E.torQ', engineName: '1.8 16V', displacementCc: 1796, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '139cv', sources: ['fipe'] }, 2018, 2024),
  // Mobi
  ...generateYearVariants({ brand: 'Fiat', model: 'Mobi', trim: '1.0', engineCode: 'Firefly', engineName: '1.0 6V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '77cv', sources: ['fipe'] }, 2016, 2024),
  // Pulse
  ...generateYearVariants({ brand: 'Fiat', model: 'Pulse', trim: '1.0 Turbo', engineCode: 'T200', engineName: '1.0 Turbo', displacementCc: 999, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '130cv', sources: ['fipe'] }, 2021, 2024),
  ...generateYearVariants({ brand: 'Fiat', model: 'Pulse', trim: '1.3', engineCode: 'Firefly', engineName: '1.3 8V', displacementCc: 1332, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '109cv', sources: ['fipe'] }, 2021, 2024),
  // Fastback
  ...generateYearVariants({ brand: 'Fiat', model: 'Fastback', trim: '1.0 Turbo', engineCode: 'T200', engineName: '1.0 Turbo', displacementCc: 999, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '130cv', sources: ['fipe'] }, 2022, 2024),
  ...generateYearVariants({ brand: 'Fiat', model: 'Fastback', trim: 'Abarth', engineCode: 'T270', engineName: '1.3 Turbo', displacementCc: 1332, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '185cv', sources: ['fipe'] }, 2023, 2024),
  // Strada
  ...generateYearVariants({ brand: 'Fiat', model: 'Strada', trim: '1.4', engineCode: 'Fire', engineName: '1.4 8V', displacementCc: 1368, fuel: 'flex', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '88cv', sources: ['fipe'] }, 1998, 2020),
  ...generateYearVariants({ brand: 'Fiat', model: 'Strada', trim: '1.3 Firefly', engineCode: 'Firefly', engineName: '1.3 8V', displacementCc: 1332, fuel: 'flex', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '109cv', sources: ['fipe'] }, 2020, 2024),
  ...generateYearVariants({ brand: 'Fiat', model: 'Strada', trim: '1.0 Turbo', engineCode: 'T200', engineName: '1.0 Turbo', displacementCc: 999, fuel: 'flex', transmission: 'cvt', bodyType: 'pickup', vehicleType: 'pickup', power: '130cv', sources: ['fipe'] }, 2023, 2024),
  // Toro
  ...generateYearVariants({ brand: 'Fiat', model: 'Toro', trim: '1.8', engineCode: 'E.torQ', engineName: '1.8 16V', displacementCc: 1796, fuel: 'flex', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '139cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Fiat', model: 'Toro', trim: '2.0 Diesel', engineCode: 'MultiJet', engineName: '2.0 Diesel', displacementCc: 1956, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '170cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Fiat', model: 'Toro', trim: '1.3 Turbo', engineCode: 'T270', engineName: '1.3 Turbo', displacementCc: 1332, fuel: 'flex', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '185cv', sources: ['fipe'] }, 2022, 2024),
  // Fiorino
  ...generateYearVariants({ brand: 'Fiat', model: 'Fiorino', trim: '1.4', engineCode: 'Fire', engineName: '1.4 8V', displacementCc: 1368, fuel: 'flex', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '88cv', sources: ['fipe'] }, 2004, 2024),
  // Doblò
  ...generateYearVariants({ brand: 'Fiat', model: 'Doblò', trim: '1.8', engineCode: 'E.torQ', engineName: '1.8 16V', displacementCc: 1796, fuel: 'flex', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '132cv', sources: ['fipe'] }, 2001, 2021),
  // Ducato
  ...generateYearVariants({ brand: 'Fiat', model: 'Ducato', trim: '2.3 Diesel', engineCode: 'F1CE', engineName: '2.3 Diesel', displacementCc: 2287, fuel: 'diesel', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '130cv', sources: ['fipe'] }, 2006, 2024),
  // Idea
  ...generateYearVariants({ brand: 'Fiat', model: 'Idea', trim: '1.4', engineCode: 'Fire', engineName: '1.4 8V', displacementCc: 1368, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '88cv', sources: ['fipe'] }, 2005, 2016),
  ...generateYearVariants({ brand: 'Fiat', model: 'Idea', trim: '1.8', engineCode: 'E.torQ', engineName: '1.8 16V', displacementCc: 1796, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '132cv', sources: ['fipe'] }, 2005, 2016),
  // 500
  ...generateYearVariants({ brand: 'Fiat', model: '500', trim: '1.4', engineCode: 'Fire', engineName: '1.4 16V', displacementCc: 1368, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '100cv', sources: ['fipe'] }, 2009, 2020),
  ...generateYearVariants({ brand: 'Fiat', model: '500', trim: 'Abarth', engineCode: 'T-Jet', engineName: '1.4 Turbo', displacementCc: 1368, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '165cv', sources: ['fipe'] }, 2014, 2020),
  // Tempra
  ...generateYearVariants({ brand: 'Fiat', model: 'Tempra', trim: '2.0', engineCode: 'Sevel', engineName: '2.0 8V', displacementCc: 1995, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '114cv', sources: ['fipe'] }, 1991, 1999),
  // Tipo
  ...generateYearVariants({ brand: 'Fiat', model: 'Tipo', trim: '1.6', engineCode: 'Sevel', engineName: '1.6 8V', displacementCc: 1580, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '87cv', sources: ['fipe'] }, 1993, 1997),
  // 147
  ...generateYearVariants({ brand: 'Fiat', model: '147', trim: '1.3', engineCode: 'Fiasa', engineName: '1.3 8V', displacementCc: 1297, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '65cv', sources: ['fipe'] }, 1976, 1986),
  // Elba
  ...generateYearVariants({ brand: 'Fiat', model: 'Elba', trim: '1.5', engineCode: 'Fiasa', engineName: '1.5 8V', displacementCc: 1498, fuel: 'gasoline', transmission: 'manual', bodyType: 'wagon', vehicleType: 'car', power: '78cv', sources: ['fipe'] }, 1986, 1996),
  // Prêmio
  ...generateYearVariants({ brand: 'Fiat', model: 'Prêmio', trim: '1.5', engineCode: 'Fiasa', engineName: '1.5 8V', displacementCc: 1498, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '78cv', sources: ['fipe'] }, 1985, 1996),
  // Freemont
  ...generateYearVariants({ brand: 'Fiat', model: 'Freemont', trim: '2.4', engineCode: 'Tigershark', engineName: '2.4 16V', displacementCc: 2360, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '172cv', sources: ['fipe'] }, 2011, 2016),
];


// ============================================================================
// FORD - COMPLETO
// ============================================================================
const FORD_VARIANTS: VehicleVariant[] = [
  // Fiesta
  ...generateYearVariants({ brand: 'Ford', model: 'Fiesta', trim: '1.0', engineCode: 'Zetec', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '75cv', sources: ['fipe'] }, 1996, 2019),
  ...generateYearVariants({ brand: 'Ford', model: 'Fiesta', trim: '1.6', engineCode: 'Sigma', engineName: '1.6 16V', displacementCc: 1596, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '111cv', sources: ['fipe'] }, 2002, 2019),
  ...generateYearVariants({ brand: 'Ford', model: 'Fiesta Sedan', trim: '1.6', engineCode: 'Sigma', engineName: '1.6 16V', displacementCc: 1596, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '111cv', sources: ['fipe'] }, 2004, 2019),
  ...generateYearVariants({ brand: 'Ford', model: 'New Fiesta', trim: '1.6', engineCode: 'Sigma', engineName: '1.6 16V', displacementCc: 1596, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '130cv', sources: ['fipe'] }, 2013, 2019),
  // Ka
  ...generateYearVariants({ brand: 'Ford', model: 'Ka', trim: '1.0', engineCode: 'Zetec', engineName: '1.0 8V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '75cv', sources: ['fipe'] }, 1997, 2021),
  ...generateYearVariants({ brand: 'Ford', model: 'Ka', trim: '1.5', engineCode: 'Dragon', engineName: '1.5 12V', displacementCc: 1498, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '137cv', sources: ['fipe'] }, 2014, 2021),
  ...generateYearVariants({ brand: 'Ford', model: 'Ka Sedan', trim: '1.0', engineCode: 'Dragon', engineName: '1.0 12V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '85cv', sources: ['fipe'] }, 2014, 2021),
  ...generateYearVariants({ brand: 'Ford', model: 'Ka Sedan', trim: '1.5', engineCode: 'Dragon', engineName: '1.5 12V', displacementCc: 1498, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '137cv', sources: ['fipe'] }, 2014, 2021),
  // Focus
  ...generateYearVariants({ brand: 'Ford', model: 'Focus', trim: '1.6', engineCode: 'Sigma', engineName: '1.6 16V', displacementCc: 1596, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '111cv', sources: ['fipe'] }, 2000, 2019),
  ...generateYearVariants({ brand: 'Ford', model: 'Focus', trim: '2.0', engineCode: 'Duratec', engineName: '2.0 16V', displacementCc: 1999, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '178cv', sources: ['fipe'] }, 2000, 2019),
  ...generateYearVariants({ brand: 'Ford', model: 'Focus Sedan', trim: '2.0', engineCode: 'Duratec', engineName: '2.0 16V', displacementCc: 1999, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '178cv', sources: ['fipe'] }, 2000, 2019),
  // Fusion
  ...generateYearVariants({ brand: 'Ford', model: 'Fusion', trim: '2.0 EcoBoost', engineCode: 'EcoBoost', engineName: '2.0 Turbo', displacementCc: 1999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '248cv', sources: ['fipe'] }, 2013, 2020),
  ...generateYearVariants({ brand: 'Ford', model: 'Fusion', trim: '2.5', engineCode: 'Duratec', engineName: '2.5 16V', displacementCc: 2488, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '175cv', sources: ['fipe'] }, 2006, 2020),
  ...generateYearVariants({ brand: 'Ford', model: 'Fusion', trim: 'Hybrid', engineCode: 'Atkinson', engineName: '2.0 Hybrid', displacementCc: 1999, fuel: 'hybrid', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '188cv', sources: ['fipe'] }, 2017, 2020),
  // EcoSport
  ...generateYearVariants({ brand: 'Ford', model: 'EcoSport', trim: '1.6', engineCode: 'Sigma', engineName: '1.6 16V', displacementCc: 1596, fuel: 'flex', transmission: 'manual', bodyType: 'suv', vehicleType: 'suv', power: '111cv', sources: ['fipe'] }, 2003, 2021),
  ...generateYearVariants({ brand: 'Ford', model: 'EcoSport', trim: '2.0', engineCode: 'Duratec', engineName: '2.0 16V', displacementCc: 1999, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '176cv', sources: ['fipe'] }, 2003, 2021),
  ...generateYearVariants({ brand: 'Ford', model: 'EcoSport', trim: '1.5', engineCode: 'Dragon', engineName: '1.5 12V', displacementCc: 1498, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '137cv', sources: ['fipe'] }, 2017, 2021),
  // Territory
  ...generateYearVariants({ brand: 'Ford', model: 'Territory', trim: '1.5 Turbo', engineCode: 'EcoBoost', engineName: '1.5 Turbo', displacementCc: 1498, fuel: 'gasoline', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '150cv', sources: ['fipe'] }, 2020, 2024),
  // Edge
  ...generateYearVariants({ brand: 'Ford', model: 'Edge', trim: '3.5 V6', engineCode: 'Duratec', engineName: '3.5 V6', displacementCc: 3496, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '289cv', sources: ['fipe'] }, 2009, 2022),
  ...generateYearVariants({ brand: 'Ford', model: 'Edge', trim: '2.0 EcoBoost', engineCode: 'EcoBoost', engineName: '2.0 Turbo', displacementCc: 1999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '248cv', sources: ['fipe'] }, 2016, 2022),
  // Ranger
  ...generateYearVariants({ brand: 'Ford', model: 'Ranger', trim: '2.2 Diesel', engineCode: 'Duratorq', engineName: '2.2 Diesel', displacementCc: 2198, fuel: 'diesel', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '160cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Ford', model: 'Ranger', trim: '3.2 Diesel', engineCode: 'Duratorq', engineName: '3.2 Diesel', displacementCc: 3198, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '200cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Ford', model: 'Ranger Raptor', trim: '2.0 Bi-Turbo', engineCode: 'EcoBlue', engineName: '2.0 Bi-Turbo', displacementCc: 1996, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '213cv', sources: ['fipe'] }, 2020, 2024),
  // F-250
  ...generateYearVariants({ brand: 'Ford', model: 'F-250', trim: '3.9 Diesel', engineCode: 'MWM', engineName: '3.9 Diesel', displacementCc: 3922, fuel: 'diesel', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '180cv', sources: ['fipe'] }, 1998, 2012),
  // F-1000
  ...generateYearVariants({ brand: 'Ford', model: 'F-1000', trim: '3.6', engineCode: 'MWM', engineName: '3.6 Diesel', displacementCc: 3600, fuel: 'diesel', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '120cv', sources: ['fipe'] }, 1979, 1998),
  // Courier
  ...generateYearVariants({ brand: 'Ford', model: 'Courier', trim: '1.6', engineCode: 'Zetec', engineName: '1.6 8V', displacementCc: 1596, fuel: 'flex', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '98cv', sources: ['fipe'] }, 1997, 2013),
  // Maverick
  ...generateYearVariants({ brand: 'Ford', model: 'Maverick', trim: '2.0 EcoBoost', engineCode: 'EcoBoost', engineName: '2.0 Turbo', displacementCc: 1999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '253cv', sources: ['fipe'] }, 2022, 2024),
  ...generateYearVariants({ brand: 'Ford', model: 'Maverick', trim: '2.5 Hybrid', engineCode: 'Atkinson', engineName: '2.5 Hybrid', displacementCc: 2488, fuel: 'hybrid', transmission: 'cvt', bodyType: 'pickup', vehicleType: 'pickup', power: '191cv', sources: ['fipe'] }, 2022, 2024),
  // Transit
  ...generateYearVariants({ brand: 'Ford', model: 'Transit', trim: '2.2 Diesel', engineCode: 'Duratorq', engineName: '2.2 Diesel', displacementCc: 2198, fuel: 'diesel', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '155cv', sources: ['fipe'] }, 2014, 2024),
  // Bronco Sport
  ...generateYearVariants({ brand: 'Ford', model: 'Bronco Sport', trim: '2.0 EcoBoost', engineCode: 'EcoBoost', engineName: '2.0 Turbo', displacementCc: 1999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '253cv', sources: ['fipe'] }, 2021, 2024),
  // Mustang
  ...generateYearVariants({ brand: 'Ford', model: 'Mustang', trim: '5.0 V8', engineCode: 'Coyote', engineName: '5.0 V8', displacementCc: 4951, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '466cv', sources: ['fipe'] }, 2015, 2024),
  ...generateYearVariants({ brand: 'Ford', model: 'Mustang', trim: '2.3 EcoBoost', engineCode: 'EcoBoost', engineName: '2.3 Turbo', displacementCc: 2261, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '314cv', sources: ['fipe'] }, 2015, 2024),
  // Escort
  ...generateYearVariants({ brand: 'Ford', model: 'Escort', trim: '1.8', engineCode: 'Zetec', engineName: '1.8 16V', displacementCc: 1796, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '115cv', sources: ['fipe'] }, 1983, 2003),
  // Verona
  ...generateYearVariants({ brand: 'Ford', model: 'Verona', trim: '1.8', engineCode: 'AP', engineName: '1.8 8V', displacementCc: 1781, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '95cv', sources: ['fipe'] }, 1989, 1996),
  // Del Rey
  ...generateYearVariants({ brand: 'Ford', model: 'Del Rey', trim: '1.6', engineCode: 'CHT', engineName: '1.6 8V', displacementCc: 1596, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '73cv', sources: ['fipe'] }, 1981, 1991),
  // Corcel
  ...generateYearVariants({ brand: 'Ford', model: 'Corcel', trim: '1.4', engineCode: 'CHT', engineName: '1.4 8V', displacementCc: 1390, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '65cv', sources: ['fipe'] }, 1968, 1986),
  // Belina
  ...generateYearVariants({ brand: 'Ford', model: 'Belina', trim: '1.6', engineCode: 'CHT', engineName: '1.6 8V', displacementCc: 1596, fuel: 'gasoline', transmission: 'manual', bodyType: 'wagon', vehicleType: 'car', power: '73cv', sources: ['fipe'] }, 1970, 1991),
  // Pampa
  ...generateYearVariants({ brand: 'Ford', model: 'Pampa', trim: '1.8', engineCode: 'AP', engineName: '1.8 8V', displacementCc: 1781, fuel: 'gasoline', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '95cv', sources: ['fipe'] }, 1982, 1997),
  // Cargo (Caminhões)
  ...generateYearVariants({ brand: 'Ford', model: 'Cargo 816', trim: 'Diesel', engineCode: 'Cummins', engineName: '3.8 Diesel', displacementCc: 3800, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '160cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Ford', model: 'Cargo 1119', trim: 'Diesel', engineCode: 'Cummins', engineName: '3.8 Diesel', displacementCc: 3800, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '190cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Ford', model: 'Cargo 2429', trim: 'Diesel', engineCode: 'Cummins', engineName: '6.7 Diesel', displacementCc: 6700, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '290cv', sources: ['fipe'] }, 2012, 2024),
];


// ============================================================================
// TOYOTA - COMPLETO
// ============================================================================
const TOYOTA_VARIANTS: VehicleVariant[] = [
  // Corolla
  ...generateYearVariants({ brand: 'Toyota', model: 'Corolla', trim: '1.8', engineCode: '1ZZ-FE', engineName: '1.8 16V', displacementCc: 1794, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '136cv', sources: ['fipe'] }, 2003, 2024),
  ...generateYearVariants({ brand: 'Toyota', model: 'Corolla', trim: '2.0', engineCode: '3ZR-FE', engineName: '2.0 16V', displacementCc: 1987, fuel: 'flex', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '177cv', sources: ['fipe'] }, 2009, 2024),
  ...generateYearVariants({ brand: 'Toyota', model: 'Corolla', trim: 'Hybrid', engineCode: '2ZR-FXE', engineName: '1.8 Hybrid', displacementCc: 1798, fuel: 'hybrid', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '122cv', sources: ['fipe'] }, 2020, 2024),
  ...generateYearVariants({ brand: 'Toyota', model: 'Corolla Cross', trim: '2.0', engineCode: 'M20A', engineName: '2.0 16V', displacementCc: 1987, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '177cv', sources: ['fipe'] }, 2021, 2024),
  ...generateYearVariants({ brand: 'Toyota', model: 'Corolla Cross', trim: 'Hybrid', engineCode: '2ZR-FXE', engineName: '1.8 Hybrid', displacementCc: 1798, fuel: 'hybrid', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '122cv', sources: ['fipe'] }, 2021, 2024),
  // Etios
  ...generateYearVariants({ brand: 'Toyota', model: 'Etios', trim: '1.3', engineCode: '1NR-FE', engineName: '1.3 16V', displacementCc: 1329, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '90cv', sources: ['fipe'] }, 2012, 2021),
  ...generateYearVariants({ brand: 'Toyota', model: 'Etios', trim: '1.5', engineCode: '2NR-FE', engineName: '1.5 16V', displacementCc: 1496, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '107cv', sources: ['fipe'] }, 2012, 2021),
  ...generateYearVariants({ brand: 'Toyota', model: 'Etios Sedan', trim: '1.5', engineCode: '2NR-FE', engineName: '1.5 16V', displacementCc: 1496, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '107cv', sources: ['fipe'] }, 2012, 2021),
  // Yaris
  ...generateYearVariants({ brand: 'Toyota', model: 'Yaris', trim: '1.3', engineCode: '1NR-FE', engineName: '1.3 16V', displacementCc: 1329, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '101cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Toyota', model: 'Yaris', trim: '1.5', engineCode: '2NR-FE', engineName: '1.5 16V', displacementCc: 1496, fuel: 'flex', transmission: 'cvt', bodyType: 'hatch', vehicleType: 'car', power: '110cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Toyota', model: 'Yaris Sedan', trim: '1.5', engineCode: '2NR-FE', engineName: '1.5 16V', displacementCc: 1496, fuel: 'flex', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '110cv', sources: ['fipe'] }, 2018, 2024),
  // Camry
  ...generateYearVariants({ brand: 'Toyota', model: 'Camry', trim: '3.5 V6', engineCode: '2GR-FE', engineName: '3.5 V6', displacementCc: 3456, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '301cv', sources: ['fipe'] }, 2007, 2024),
  ...generateYearVariants({ brand: 'Toyota', model: 'Camry', trim: 'Hybrid', engineCode: 'A25A-FXS', engineName: '2.5 Hybrid', displacementCc: 2487, fuel: 'hybrid', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '218cv', sources: ['fipe'] }, 2019, 2024),
  // Prius
  ...generateYearVariants({ brand: 'Toyota', model: 'Prius', trim: 'Hybrid', engineCode: '2ZR-FXE', engineName: '1.8 Hybrid', displacementCc: 1798, fuel: 'hybrid', transmission: 'cvt', bodyType: 'hatch', vehicleType: 'car', power: '122cv', sources: ['fipe'] }, 2013, 2024),
  // RAV4
  ...generateYearVariants({ brand: 'Toyota', model: 'RAV4', trim: '2.0', engineCode: '3ZR-FAE', engineName: '2.0 16V', displacementCc: 1987, fuel: 'gasoline', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '171cv', sources: ['fipe'] }, 2013, 2024),
  ...generateYearVariants({ brand: 'Toyota', model: 'RAV4', trim: '2.5 Hybrid', engineCode: 'A25A-FXS', engineName: '2.5 Hybrid', displacementCc: 2487, fuel: 'hybrid', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '222cv', sources: ['fipe'] }, 2019, 2024),
  // SW4 (Hilux SW4)
  ...generateYearVariants({ brand: 'Toyota', model: 'SW4', trim: '2.7', engineCode: '2TR-FE', engineName: '2.7 16V', displacementCc: 2694, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '163cv', sources: ['fipe'] }, 2005, 2024),
  ...generateYearVariants({ brand: 'Toyota', model: 'SW4', trim: '2.8 Diesel', engineCode: '1GD-FTV', engineName: '2.8 Diesel', displacementCc: 2755, fuel: 'diesel', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '204cv', sources: ['fipe'] }, 2016, 2024),
  // Land Cruiser Prado
  ...generateYearVariants({ brand: 'Toyota', model: 'Land Cruiser Prado', trim: '3.0 Diesel', engineCode: '1KD-FTV', engineName: '3.0 Diesel', displacementCc: 2982, fuel: 'diesel', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '163cv', sources: ['fipe'] }, 2003, 2024),
  // Hilux
  ...generateYearVariants({ brand: 'Toyota', model: 'Hilux', trim: '2.7', engineCode: '2TR-FE', engineName: '2.7 16V', displacementCc: 2694, fuel: 'flex', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '163cv', sources: ['fipe'] }, 2005, 2024),
  ...generateYearVariants({ brand: 'Toyota', model: 'Hilux', trim: '2.8 Diesel', engineCode: '1GD-FTV', engineName: '2.8 Diesel', displacementCc: 2755, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '204cv', sources: ['fipe'] }, 2016, 2024),
  // Bandeirante
  ...generateYearVariants({ brand: 'Toyota', model: 'Bandeirante', trim: '3.7 Diesel', engineCode: '14B', engineName: '3.7 Diesel', displacementCc: 3661, fuel: 'diesel', transmission: 'manual', bodyType: 'suv', vehicleType: 'suv', power: '96cv', sources: ['fipe'] }, 1958, 2001),
];

// ============================================================================
// HONDA - COMPLETO
// ============================================================================
const HONDA_VARIANTS: VehicleVariant[] = [
  // Civic
  ...generateYearVariants({ brand: 'Honda', model: 'Civic', trim: '1.8', engineCode: 'R18A', engineName: '1.8 16V', displacementCc: 1799, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '140cv', sources: ['fipe'] }, 2006, 2016),
  ...generateYearVariants({ brand: 'Honda', model: 'Civic', trim: '2.0', engineCode: 'R20A', engineName: '2.0 16V', displacementCc: 1997, fuel: 'flex', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '155cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Honda', model: 'Civic', trim: '1.5 Turbo', engineCode: 'L15B7', engineName: '1.5 Turbo', displacementCc: 1498, fuel: 'gasoline', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '173cv', sources: ['fipe'] }, 2017, 2024),
  ...generateYearVariants({ brand: 'Honda', model: 'Civic', trim: 'Si', engineCode: 'K20C', engineName: '1.5 Turbo', displacementCc: 1498, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '208cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Honda', model: 'Civic', trim: 'Type R', engineCode: 'K20C1', engineName: '2.0 Turbo', displacementCc: 1996, fuel: 'gasoline', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '320cv', sources: ['fipe'] }, 2023, 2024),
  // City
  ...generateYearVariants({ brand: 'Honda', model: 'City', trim: '1.5', engineCode: 'L15A', engineName: '1.5 16V', displacementCc: 1497, fuel: 'flex', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '116cv', sources: ['fipe'] }, 2009, 2024),
  ...generateYearVariants({ brand: 'Honda', model: 'City Hatch', trim: '1.5', engineCode: 'L15B', engineName: '1.5 16V', displacementCc: 1497, fuel: 'flex', transmission: 'cvt', bodyType: 'hatch', vehicleType: 'car', power: '126cv', sources: ['fipe'] }, 2021, 2024),
  // Fit
  ...generateYearVariants({ brand: 'Honda', model: 'Fit', trim: '1.4', engineCode: 'L13A', engineName: '1.4 8V', displacementCc: 1339, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '80cv', sources: ['fipe'] }, 2003, 2014),
  ...generateYearVariants({ brand: 'Honda', model: 'Fit', trim: '1.5', engineCode: 'L15A', engineName: '1.5 16V', displacementCc: 1497, fuel: 'flex', transmission: 'cvt', bodyType: 'hatch', vehicleType: 'car', power: '116cv', sources: ['fipe'] }, 2009, 2021),
  // WR-V
  ...generateYearVariants({ brand: 'Honda', model: 'WR-V', trim: '1.5', engineCode: 'L15B', engineName: '1.5 16V', displacementCc: 1497, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '116cv', sources: ['fipe'] }, 2017, 2024),
  // HR-V
  ...generateYearVariants({ brand: 'Honda', model: 'HR-V', trim: '1.8', engineCode: 'R18A', engineName: '1.8 16V', displacementCc: 1799, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '140cv', sources: ['fipe'] }, 2015, 2022),
  ...generateYearVariants({ brand: 'Honda', model: 'HR-V', trim: '1.5 Turbo', engineCode: 'L15B', engineName: '1.5 Turbo', displacementCc: 1498, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '177cv', sources: ['fipe'] }, 2022, 2024),
  // ZR-V
  ...generateYearVariants({ brand: 'Honda', model: 'ZR-V', trim: '2.0', engineCode: 'K20C', engineName: '2.0 16V', displacementCc: 1996, fuel: 'gasoline', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '158cv', sources: ['fipe'] }, 2024, 2024),
  // CR-V
  ...generateYearVariants({ brand: 'Honda', model: 'CR-V', trim: '2.0', engineCode: 'R20A', engineName: '2.0 16V', displacementCc: 1997, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '155cv', sources: ['fipe'] }, 2007, 2019),
  ...generateYearVariants({ brand: 'Honda', model: 'CR-V', trim: '1.5 Turbo', engineCode: 'L15B', engineName: '1.5 Turbo', displacementCc: 1498, fuel: 'gasoline', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '190cv', sources: ['fipe'] }, 2017, 2024),
  // Accord
  ...generateYearVariants({ brand: 'Honda', model: 'Accord', trim: '2.0', engineCode: 'K20A', engineName: '2.0 16V', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '155cv', sources: ['fipe'] }, 2003, 2024),
  ...generateYearVariants({ brand: 'Honda', model: 'Accord', trim: '2.0 Turbo', engineCode: 'K20C4', engineName: '2.0 Turbo', displacementCc: 1996, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '252cv', sources: ['fipe'] }, 2018, 2024),
  // === VERSÕES ADICIONAIS DE MOTORIZAÇÃO ===
  // Civic gerações anteriores
  ...generateYearVariants({ brand: 'Honda', model: 'Civic', trim: '1.6 16V', engineCode: 'D16Y', engineName: '1.6 16V', displacementCc: 1590, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '127cv', sources: ['fipe'] }, 1996, 2000),
  ...generateYearVariants({ brand: 'Honda', model: 'Civic', trim: '1.7 16V', engineCode: 'D17A', engineName: '1.7 16V', displacementCc: 1668, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '130cv', sources: ['fipe'] }, 2001, 2006),
  ...generateYearVariants({ brand: 'Honda', model: 'Civic', trim: '2.0 16V', engineCode: 'K20A', engineName: '2.0 16V', displacementCc: 1998, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '155cv', sources: ['fipe'] }, 2006, 2016),
  // Civic Coupe
  ...generateYearVariants({ brand: 'Honda', model: 'Civic Coupe', trim: '1.6 16V', engineCode: 'D16Y', engineName: '1.6 16V', displacementCc: 1590, fuel: 'gasoline', transmission: 'manual', bodyType: 'coupe', vehicleType: 'car', power: '127cv', sources: ['fipe'] }, 1996, 2000),
  // City gerações anteriores
  ...generateYearVariants({ brand: 'Honda', model: 'City', trim: '1.5 16V', engineCode: 'L15A', engineName: '1.5 16V', displacementCc: 1497, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '116cv', sources: ['fipe'] }, 2009, 2014),
  // Fit versões
  ...generateYearVariants({ brand: 'Honda', model: 'Fit', trim: '1.5 16V', engineCode: 'L15A', engineName: '1.5 16V', displacementCc: 1497, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '116cv', sources: ['fipe'] }, 2009, 2021),
  ...generateYearVariants({ brand: 'Honda', model: 'Fit Twist', trim: '1.5 16V', engineCode: 'L15A', engineName: '1.5 16V', displacementCc: 1497, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '116cv', sources: ['fipe'] }, 2012, 2015),
  // CR-V versões anteriores
  ...generateYearVariants({ brand: 'Honda', model: 'CR-V', trim: '2.4 16V', engineCode: 'K24A', engineName: '2.4 16V', displacementCc: 2354, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '185cv', sources: ['fipe'] }, 2007, 2011),
  // Accord versões anteriores
  ...generateYearVariants({ brand: 'Honda', model: 'Accord', trim: '2.4 16V', engineCode: 'K24A', engineName: '2.4 16V', displacementCc: 2354, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '185cv', sources: ['fipe'] }, 2003, 2012),
  ...generateYearVariants({ brand: 'Honda', model: 'Accord', trim: '3.5 V6', engineCode: 'J35A', engineName: '3.5 V6', displacementCc: 3471, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '280cv', sources: ['fipe'] }, 2008, 2017),
  // Legend
  ...generateYearVariants({ brand: 'Honda', model: 'Legend', trim: '3.5 V6', engineCode: 'J35A', engineName: '3.5 V6', displacementCc: 3471, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '295cv', sources: ['fipe'] }, 2006, 2012),
  // Prelude
  ...generateYearVariants({ brand: 'Honda', model: 'Prelude', trim: '2.2 16V', engineCode: 'H22A', engineName: '2.2 16V VTEC', displacementCc: 2157, fuel: 'gasoline', transmission: 'manual', bodyType: 'coupe', vehicleType: 'car', power: '200cv', sources: ['fipe'] }, 1997, 2001),
  // S2000
  ...generateYearVariants({ brand: 'Honda', model: 'S2000', trim: '2.0 16V', engineCode: 'F20C', engineName: '2.0 16V VTEC', displacementCc: 1997, fuel: 'gasoline', transmission: 'manual', bodyType: 'convertible', vehicleType: 'car', power: '240cv', sources: ['fipe'] }, 2000, 2009),
  // NSX
  ...generateYearVariants({ brand: 'Honda', model: 'NSX', trim: '3.5 V6 Hybrid', engineCode: 'JNC1', engineName: '3.5 V6 Turbo Hybrid', displacementCc: 3493, fuel: 'hybrid', transmission: 'dct', bodyType: 'coupe', vehicleType: 'car', power: '581cv', sources: ['fipe'] }, 2017, 2022),
];


// ============================================================================
// HYUNDAI - COMPLETO
// ============================================================================
const HYUNDAI_VARIANTS: VehicleVariant[] = [
  // HB20
  ...generateYearVariants({ brand: 'Hyundai', model: 'HB20', trim: '1.0', engineCode: 'Kappa', engineName: '1.0 12V', displacementCc: 998, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '80cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Hyundai', model: 'HB20', trim: '1.0 Turbo', engineCode: 'Kappa', engineName: '1.0 Turbo', displacementCc: 998, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '120cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Hyundai', model: 'HB20', trim: '1.6', engineCode: 'Gamma', engineName: '1.6 16V', displacementCc: 1591, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '130cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Hyundai', model: 'HB20S', trim: '1.0', engineCode: 'Kappa', engineName: '1.0 12V', displacementCc: 998, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '80cv', sources: ['fipe'] }, 2013, 2024),
  ...generateYearVariants({ brand: 'Hyundai', model: 'HB20S', trim: '1.6', engineCode: 'Gamma', engineName: '1.6 16V', displacementCc: 1591, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '130cv', sources: ['fipe'] }, 2013, 2024),
  // i30
  ...generateYearVariants({ brand: 'Hyundai', model: 'i30', trim: '2.0', engineCode: 'Nu', engineName: '2.0 16V', displacementCc: 1999, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '167cv', sources: ['fipe'] }, 2009, 2019),
  // Elantra
  ...generateYearVariants({ brand: 'Hyundai', model: 'Elantra', trim: '2.0', engineCode: 'Nu', engineName: '2.0 16V', displacementCc: 1999, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '167cv', sources: ['fipe'] }, 2011, 2024),
  // Azera
  ...generateYearVariants({ brand: 'Hyundai', model: 'Azera', trim: '3.0 V6', engineCode: 'Lambda', engineName: '3.0 V6', displacementCc: 2999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '270cv', sources: ['fipe'] }, 2007, 2020),
  // Creta
  ...generateYearVariants({ brand: 'Hyundai', model: 'Creta', trim: '1.6', engineCode: 'Gamma', engineName: '1.6 16V', displacementCc: 1591, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '130cv', sources: ['fipe'] }, 2017, 2024),
  ...generateYearVariants({ brand: 'Hyundai', model: 'Creta', trim: '2.0', engineCode: 'Nu', engineName: '2.0 16V', displacementCc: 1999, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '167cv', sources: ['fipe'] }, 2017, 2024),
  // ix35
  ...generateYearVariants({ brand: 'Hyundai', model: 'ix35', trim: '2.0', engineCode: 'Nu', engineName: '2.0 16V', displacementCc: 1999, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '167cv', sources: ['fipe'] }, 2010, 2019),
  // Tucson
  ...generateYearVariants({ brand: 'Hyundai', model: 'Tucson', trim: '2.0', engineCode: 'Nu', engineName: '2.0 16V', displacementCc: 1999, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '167cv', sources: ['fipe'] }, 2005, 2024),
  ...generateYearVariants({ brand: 'Hyundai', model: 'Tucson', trim: '1.6 Turbo', engineCode: 'Gamma', engineName: '1.6 Turbo', displacementCc: 1591, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '177cv', sources: ['fipe'] }, 2022, 2024),
  // Santa Fe
  ...generateYearVariants({ brand: 'Hyundai', model: 'Santa Fe', trim: '3.3 V6', engineCode: 'Lambda', engineName: '3.3 V6', displacementCc: 3342, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '270cv', sources: ['fipe'] }, 2006, 2024),
  // Vera Cruz
  ...generateYearVariants({ brand: 'Hyundai', model: 'Vera Cruz', trim: '3.8 V6', engineCode: 'Lambda', engineName: '3.8 V6', displacementCc: 3778, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '260cv', sources: ['fipe'] }, 2007, 2015),
  // Veloster
  ...generateYearVariants({ brand: 'Hyundai', model: 'Veloster', trim: '1.6', engineCode: 'Gamma', engineName: '1.6 16V', displacementCc: 1591, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '140cv', sources: ['fipe'] }, 2011, 2019),
  // Sonata
  ...generateYearVariants({ brand: 'Hyundai', model: 'Sonata', trim: '2.4', engineCode: 'Theta II', engineName: '2.4 16V', displacementCc: 2359, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '182cv', sources: ['fipe'] }, 2010, 2020),
  // HR (Caminhão)
  ...generateYearVariants({ brand: 'Hyundai', model: 'HR', trim: '2.5 Diesel', engineCode: 'D4CB', engineName: '2.5 Diesel', displacementCc: 2497, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '130cv', sources: ['fipe'] }, 2006, 2024),
];

// ============================================================================
// KIA - COMPLETO
// ============================================================================
const KIA_VARIANTS: VehicleVariant[] = [
  // Picanto
  ...generateYearVariants({ brand: 'KIA', model: 'Picanto', trim: '1.0', engineCode: 'Kappa', engineName: '1.0 12V', displacementCc: 998, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '80cv', sources: ['fipe'] }, 2006, 2024),
  // Rio
  ...generateYearVariants({ brand: 'KIA', model: 'Rio', trim: '1.6', engineCode: 'Gamma', engineName: '1.6 16V', displacementCc: 1591, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '130cv', sources: ['fipe'] }, 2012, 2020),
  // Cerato
  ...generateYearVariants({ brand: 'KIA', model: 'Cerato', trim: '1.6', engineCode: 'Gamma', engineName: '1.6 16V', displacementCc: 1591, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '130cv', sources: ['fipe'] }, 2009, 2024),
  ...generateYearVariants({ brand: 'KIA', model: 'Cerato', trim: '2.0', engineCode: 'Nu', engineName: '2.0 16V', displacementCc: 1999, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '167cv', sources: ['fipe'] }, 2009, 2024),
  // Sportage
  ...generateYearVariants({ brand: 'KIA', model: 'Sportage', trim: '2.0', engineCode: 'Nu', engineName: '2.0 16V', displacementCc: 1999, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '167cv', sources: ['fipe'] }, 2005, 2024),
  ...generateYearVariants({ brand: 'KIA', model: 'Sportage', trim: '2.0 Diesel', engineCode: 'D4HA', engineName: '2.0 Diesel', displacementCc: 1995, fuel: 'diesel', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '185cv', sources: ['fipe'] }, 2011, 2024),
  // Sorento
  ...generateYearVariants({ brand: 'KIA', model: 'Sorento', trim: '3.5 V6', engineCode: 'Lambda', engineName: '3.5 V6', displacementCc: 3470, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '280cv', sources: ['fipe'] }, 2009, 2024),
  // Carnival
  ...generateYearVariants({ brand: 'KIA', model: 'Carnival', trim: '3.5 V6', engineCode: 'Lambda', engineName: '3.5 V6', displacementCc: 3470, fuel: 'gasoline', transmission: 'automatic', bodyType: 'van', vehicleType: 'van', power: '280cv', sources: ['fipe'] }, 2006, 2024),
  // Soul
  ...generateYearVariants({ brand: 'KIA', model: 'Soul', trim: '1.6', engineCode: 'Gamma', engineName: '1.6 16V', displacementCc: 1591, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '130cv', sources: ['fipe'] }, 2009, 2024),
  // Stinger
  ...generateYearVariants({ brand: 'KIA', model: 'Stinger', trim: '2.0 Turbo', engineCode: 'Theta II', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '255cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'KIA', model: 'Stinger', trim: '3.3 V6 Turbo', engineCode: 'Lambda II', engineName: '3.3 V6 Turbo', displacementCc: 3342, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '370cv', sources: ['fipe'] }, 2018, 2024),
  // Seltos
  ...generateYearVariants({ brand: 'KIA', model: 'Seltos', trim: '1.6 Turbo', engineCode: 'Gamma', engineName: '1.6 Turbo', displacementCc: 1591, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '177cv', sources: ['fipe'] }, 2021, 2024),
  // Mohave
  ...generateYearVariants({ brand: 'KIA', model: 'Mohave', trim: '3.0 V6 Diesel', engineCode: 'D6EA', engineName: '3.0 V6 Diesel', displacementCc: 2959, fuel: 'diesel', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '260cv', sources: ['fipe'] }, 2009, 2024),
  // Bongo (Caminhão)
  ...generateYearVariants({ brand: 'KIA', model: 'Bongo', trim: '2.5 Diesel', engineCode: 'D4CB', engineName: '2.5 Diesel', displacementCc: 2497, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '130cv', sources: ['fipe'] }, 2005, 2024),
];

// ============================================================================
// RENAULT - COMPLETO
// ============================================================================
const RENAULT_VARIANTS: VehicleVariant[] = [
  // Kwid
  ...generateYearVariants({ brand: 'Renault', model: 'Kwid', trim: '1.0', engineCode: 'B4D', engineName: '1.0 12V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '70cv', sources: ['fipe'] }, 2017, 2024),
  // Sandero
  ...generateYearVariants({ brand: 'Renault', model: 'Sandero', trim: '1.0', engineCode: 'D4D', engineName: '1.0 16V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '82cv', sources: ['fipe'] }, 2007, 2024),
  ...generateYearVariants({ brand: 'Renault', model: 'Sandero', trim: '1.6', engineCode: 'K4M', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '118cv', sources: ['fipe'] }, 2007, 2024),
  ...generateYearVariants({ brand: 'Renault', model: 'Sandero', trim: 'RS 2.0', engineCode: 'F4R', engineName: '2.0 16V', displacementCc: 1998, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '150cv', sources: ['fipe'] }, 2015, 2022),
  ...generateYearVariants({ brand: 'Renault', model: 'Sandero Stepway', trim: '1.6', engineCode: 'K4M', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '118cv', sources: ['fipe'] }, 2008, 2024),
  // Logan
  ...generateYearVariants({ brand: 'Renault', model: 'Logan', trim: '1.0', engineCode: 'D4D', engineName: '1.0 16V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '82cv', sources: ['fipe'] }, 2007, 2024),
  ...generateYearVariants({ brand: 'Renault', model: 'Logan', trim: '1.6', engineCode: 'K4M', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '118cv', sources: ['fipe'] }, 2007, 2024),
  // Duster
  ...generateYearVariants({ brand: 'Renault', model: 'Duster', trim: '1.6', engineCode: 'K4M', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'suv', vehicleType: 'suv', power: '118cv', sources: ['fipe'] }, 2011, 2024),
  ...generateYearVariants({ brand: 'Renault', model: 'Duster', trim: '2.0', engineCode: 'F4R', engineName: '2.0 16V', displacementCc: 1998, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '148cv', sources: ['fipe'] }, 2011, 2024),
  ...generateYearVariants({ brand: 'Renault', model: 'Duster', trim: '1.3 Turbo', engineCode: 'H5H', engineName: '1.3 Turbo', displacementCc: 1332, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '170cv', sources: ['fipe'] }, 2021, 2024),
  ...generateYearVariants({ brand: 'Renault', model: 'Duster Oroch', trim: '1.6', engineCode: 'K4M', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '118cv', sources: ['fipe'] }, 2015, 2024),
  ...generateYearVariants({ brand: 'Renault', model: 'Duster Oroch', trim: '2.0', engineCode: 'F4R', engineName: '2.0 16V', displacementCc: 1998, fuel: 'flex', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '148cv', sources: ['fipe'] }, 2015, 2024),
  // Captur
  ...generateYearVariants({ brand: 'Renault', model: 'Captur', trim: '1.6', engineCode: 'H4M', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '120cv', sources: ['fipe'] }, 2017, 2024),
  ...generateYearVariants({ brand: 'Renault', model: 'Captur', trim: '1.3 Turbo', engineCode: 'H5H', engineName: '1.3 Turbo', displacementCc: 1332, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '170cv', sources: ['fipe'] }, 2022, 2024),
  // Fluence
  ...generateYearVariants({ brand: 'Renault', model: 'Fluence', trim: '2.0', engineCode: 'M4R', engineName: '2.0 16V', displacementCc: 1997, fuel: 'flex', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '143cv', sources: ['fipe'] }, 2011, 2018),
  // Megane
  ...generateYearVariants({ brand: 'Renault', model: 'Megane', trim: '2.0', engineCode: 'F4R', engineName: '2.0 16V', displacementCc: 1998, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '148cv', sources: ['fipe'] }, 2006, 2013),
  // Clio
  ...generateYearVariants({ brand: 'Renault', model: 'Clio', trim: '1.0', engineCode: 'D4D', engineName: '1.0 16V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '77cv', sources: ['fipe'] }, 1999, 2016),
  ...generateYearVariants({ brand: 'Renault', model: 'Clio', trim: '1.6', engineCode: 'K4M', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '110cv', sources: ['fipe'] }, 1999, 2016),
  // Scenic
  ...generateYearVariants({ brand: 'Renault', model: 'Scenic', trim: '2.0', engineCode: 'F4R', engineName: '2.0 16V', displacementCc: 1998, fuel: 'flex', transmission: 'automatic', bodyType: 'van', vehicleType: 'van', power: '143cv', sources: ['fipe'] }, 1999, 2011),
  // Master
  ...generateYearVariants({ brand: 'Renault', model: 'Master', trim: '2.3 Diesel', engineCode: 'M9T', engineName: '2.3 dCi', displacementCc: 2299, fuel: 'diesel', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '130cv', sources: ['fipe'] }, 2002, 2024),
  // Kangoo
  ...generateYearVariants({ brand: 'Renault', model: 'Kangoo', trim: '1.6', engineCode: 'K4M', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '110cv', sources: ['fipe'] }, 1999, 2017),
];


// ============================================================================
// NISSAN - COMPLETO
// ============================================================================
const NISSAN_VARIANTS: VehicleVariant[] = [
  // March
  ...generateYearVariants({ brand: 'Nissan', model: 'March', trim: '1.0', engineCode: 'HR10DE', engineName: '1.0 12V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '77cv', sources: ['fipe'] }, 2011, 2022),
  ...generateYearVariants({ brand: 'Nissan', model: 'March', trim: '1.6', engineCode: 'HR16DE', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'cvt', bodyType: 'hatch', vehicleType: 'car', power: '111cv', sources: ['fipe'] }, 2011, 2022),
  // Versa
  ...generateYearVariants({ brand: 'Nissan', model: 'Versa', trim: '1.0', engineCode: 'HR10DE', engineName: '1.0 12V', displacementCc: 999, fuel: 'flex', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '77cv', sources: ['fipe'] }, 2011, 2024),
  ...generateYearVariants({ brand: 'Nissan', model: 'Versa', trim: '1.6', engineCode: 'HR16DE', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '114cv', sources: ['fipe'] }, 2011, 2024),
  // Sentra
  ...generateYearVariants({ brand: 'Nissan', model: 'Sentra', trim: '2.0', engineCode: 'MR20DE', engineName: '2.0 16V', displacementCc: 1997, fuel: 'flex', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '140cv', sources: ['fipe'] }, 2007, 2024),
  // Kicks
  ...generateYearVariants({ brand: 'Nissan', model: 'Kicks', trim: '1.6', engineCode: 'HR16DE', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '114cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Nissan', model: 'Kicks', trim: 'e-Power', engineCode: 'HR12DE', engineName: '1.2 e-Power', displacementCc: 1198, fuel: 'hybrid', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '129cv', sources: ['fipe'] }, 2022, 2024),
  // Frontier
  ...generateYearVariants({ brand: 'Nissan', model: 'Frontier', trim: '2.3 Diesel', engineCode: 'YD25', engineName: '2.3 Diesel', displacementCc: 2298, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '190cv', sources: ['fipe'] }, 2002, 2024),
  // X-Trail
  ...generateYearVariants({ brand: 'Nissan', model: 'X-Trail', trim: '2.5', engineCode: 'QR25DE', engineName: '2.5 16V', displacementCc: 2488, fuel: 'gasoline', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '171cv', sources: ['fipe'] }, 2008, 2015),
  // Pathfinder
  ...generateYearVariants({ brand: 'Nissan', model: 'Pathfinder', trim: '3.5 V6', engineCode: 'VQ35DE', engineName: '3.5 V6', displacementCc: 3498, fuel: 'gasoline', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '284cv', sources: ['fipe'] }, 2013, 2020),
  // Murano
  ...generateYearVariants({ brand: 'Nissan', model: 'Murano', trim: '3.5 V6', engineCode: 'VQ35DE', engineName: '3.5 V6', displacementCc: 3498, fuel: 'gasoline', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '265cv', sources: ['fipe'] }, 2008, 2015),
  // Livina
  ...generateYearVariants({ brand: 'Nissan', model: 'Livina', trim: '1.8', engineCode: 'MR18DE', engineName: '1.8 16V', displacementCc: 1798, fuel: 'flex', transmission: 'automatic', bodyType: 'van', vehicleType: 'van', power: '126cv', sources: ['fipe'] }, 2009, 2014),
  // Tiida
  ...generateYearVariants({ brand: 'Nissan', model: 'Tiida', trim: '1.8', engineCode: 'MR18DE', engineName: '1.8 16V', displacementCc: 1798, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '126cv', sources: ['fipe'] }, 2007, 2013),
  // GT-R
  ...generateYearVariants({ brand: 'Nissan', model: 'GT-R', trim: '3.8 V6 Turbo', engineCode: 'VR38DETT', engineName: '3.8 V6 Turbo', displacementCc: 3799, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '570cv', sources: ['fipe'] }, 2009, 2024),
  // 370Z
  ...generateYearVariants({ brand: 'Nissan', model: '370Z', trim: '3.7 V6', engineCode: 'VQ37VHR', engineName: '3.7 V6', displacementCc: 3696, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '332cv', sources: ['fipe'] }, 2009, 2020),
];

// ============================================================================
// JEEP - COMPLETO
// ============================================================================
const JEEP_VARIANTS: VehicleVariant[] = [
  // Renegade
  ...generateYearVariants({ brand: 'Jeep', model: 'Renegade', trim: '1.8', engineCode: 'E.torQ', engineName: '1.8 16V', displacementCc: 1796, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '139cv', sources: ['fipe'] }, 2015, 2024),
  ...generateYearVariants({ brand: 'Jeep', model: 'Renegade', trim: '2.0 Diesel', engineCode: 'MultiJet', engineName: '2.0 Diesel', displacementCc: 1956, fuel: 'diesel', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '170cv', sources: ['fipe'] }, 2015, 2024),
  ...generateYearVariants({ brand: 'Jeep', model: 'Renegade', trim: '1.3 Turbo', engineCode: 'GSE-T4', engineName: '1.3 Turbo', displacementCc: 1332, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '185cv', sources: ['fipe'] }, 2022, 2024),
  // Compass
  ...generateYearVariants({ brand: 'Jeep', model: 'Compass', trim: '2.0', engineCode: 'Tigershark', engineName: '2.0 16V', displacementCc: 1998, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '166cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Jeep', model: 'Compass', trim: '2.0 Diesel', engineCode: 'MultiJet', engineName: '2.0 Diesel', displacementCc: 1956, fuel: 'diesel', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '170cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Jeep', model: 'Compass', trim: '1.3 Turbo', engineCode: 'GSE-T4', engineName: '1.3 Turbo', displacementCc: 1332, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '185cv', sources: ['fipe'] }, 2022, 2024),
  // Commander
  ...generateYearVariants({ brand: 'Jeep', model: 'Commander', trim: '2.0 Turbo', engineCode: 'GME-T4', engineName: '2.0 Turbo', displacementCc: 1995, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '272cv', sources: ['fipe'] }, 2022, 2024),
  ...generateYearVariants({ brand: 'Jeep', model: 'Commander', trim: '2.0 Diesel', engineCode: 'MultiJet', engineName: '2.0 Diesel', displacementCc: 1956, fuel: 'diesel', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '200cv', sources: ['fipe'] }, 2022, 2024),
  // Wrangler
  ...generateYearVariants({ brand: 'Jeep', model: 'Wrangler', trim: '2.0 Turbo', engineCode: 'GME-T4', engineName: '2.0 Turbo', displacementCc: 1995, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '272cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Jeep', model: 'Wrangler', trim: '3.6 V6', engineCode: 'Pentastar', engineName: '3.6 V6', displacementCc: 3604, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '284cv', sources: ['fipe'] }, 2011, 2024),
  // Grand Cherokee
  ...generateYearVariants({ brand: 'Jeep', model: 'Grand Cherokee', trim: '3.6 V6', engineCode: 'Pentastar', engineName: '3.6 V6', displacementCc: 3604, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '286cv', sources: ['fipe'] }, 2011, 2024),
  ...generateYearVariants({ brand: 'Jeep', model: 'Grand Cherokee', trim: '5.7 V8 Hemi', engineCode: 'Hemi', engineName: '5.7 V8', displacementCc: 5654, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '364cv', sources: ['fipe'] }, 2011, 2024),
  ...generateYearVariants({ brand: 'Jeep', model: 'Grand Cherokee', trim: '6.4 V8 SRT', engineCode: 'Hemi', engineName: '6.4 V8', displacementCc: 6417, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '468cv', sources: ['fipe'] }, 2014, 2024),
  // Cherokee
  ...generateYearVariants({ brand: 'Jeep', model: 'Cherokee', trim: '3.2 V6', engineCode: 'Pentastar', engineName: '3.2 V6', displacementCc: 3239, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '271cv', sources: ['fipe'] }, 2014, 2020),
  // Gladiator
  ...generateYearVariants({ brand: 'Jeep', model: 'Gladiator', trim: '3.6 V6', engineCode: 'Pentastar', engineName: '3.6 V6', displacementCc: 3604, fuel: 'gasoline', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '284cv', sources: ['fipe'] }, 2020, 2024),
];

// ============================================================================
// PEUGEOT - COMPLETO
// ============================================================================
const PEUGEOT_VARIANTS: VehicleVariant[] = [
  // 208
  ...generateYearVariants({ brand: 'Peugeot', model: '208', trim: '1.2', engineCode: 'EB2', engineName: '1.2 12V', displacementCc: 1199, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '82cv', sources: ['fipe'] }, 2013, 2024),
  ...generateYearVariants({ brand: 'Peugeot', model: '208', trim: '1.6', engineCode: 'EC5', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '118cv', sources: ['fipe'] }, 2013, 2024),
  ...generateYearVariants({ brand: 'Peugeot', model: '208', trim: '1.6 Turbo', engineCode: 'EP6', engineName: '1.6 Turbo', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '173cv', sources: ['fipe'] }, 2020, 2024),
  // 2008
  ...generateYearVariants({ brand: 'Peugeot', model: '2008', trim: '1.6', engineCode: 'EC5', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '118cv', sources: ['fipe'] }, 2015, 2024),
  ...generateYearVariants({ brand: 'Peugeot', model: '2008', trim: '1.6 Turbo', engineCode: 'EP6', engineName: '1.6 Turbo', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '173cv', sources: ['fipe'] }, 2020, 2024),
  // 3008
  ...generateYearVariants({ brand: 'Peugeot', model: '3008', trim: '1.6 Turbo', engineCode: 'EP6', engineName: '1.6 Turbo', displacementCc: 1598, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '165cv', sources: ['fipe'] }, 2017, 2024),
  // 5008
  ...generateYearVariants({ brand: 'Peugeot', model: '5008', trim: '1.6 Turbo', engineCode: 'EP6', engineName: '1.6 Turbo', displacementCc: 1598, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '165cv', sources: ['fipe'] }, 2018, 2024),
  // 206
  ...generateYearVariants({ brand: 'Peugeot', model: '206', trim: '1.4', engineCode: 'TU3', engineName: '1.4 8V', displacementCc: 1360, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '75cv', sources: ['fipe'] }, 1999, 2010),
  ...generateYearVariants({ brand: 'Peugeot', model: '206', trim: '1.6', engineCode: 'TU5', engineName: '1.6 16V', displacementCc: 1587, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '110cv', sources: ['fipe'] }, 1999, 2010),
  // 207
  ...generateYearVariants({ brand: 'Peugeot', model: '207', trim: '1.4', engineCode: 'TU3', engineName: '1.4 8V', displacementCc: 1360, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '75cv', sources: ['fipe'] }, 2008, 2015),
  ...generateYearVariants({ brand: 'Peugeot', model: '207', trim: '1.6', engineCode: 'TU5', engineName: '1.6 16V', displacementCc: 1587, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '122cv', sources: ['fipe'] }, 2008, 2015),
  // 307
  ...generateYearVariants({ brand: 'Peugeot', model: '307', trim: '2.0', engineCode: 'EW10', engineName: '2.0 16V', displacementCc: 1997, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '143cv', sources: ['fipe'] }, 2002, 2012),
  // 308
  ...generateYearVariants({ brand: 'Peugeot', model: '308', trim: '1.6', engineCode: 'EC5', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '122cv', sources: ['fipe'] }, 2012, 2019),
  // 408
  ...generateYearVariants({ brand: 'Peugeot', model: '408', trim: '1.6 Turbo', engineCode: 'EP6', engineName: '1.6 Turbo', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '173cv', sources: ['fipe'] }, 2011, 2019),
  // Partner
  ...generateYearVariants({ brand: 'Peugeot', model: 'Partner', trim: '1.6', engineCode: 'TU5', engineName: '1.6 16V', displacementCc: 1587, fuel: 'flex', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '110cv', sources: ['fipe'] }, 1999, 2019),
  // Boxer
  ...generateYearVariants({ brand: 'Peugeot', model: 'Boxer', trim: '2.3 Diesel', engineCode: 'F1CE', engineName: '2.3 Diesel', displacementCc: 2287, fuel: 'diesel', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '130cv', sources: ['fipe'] }, 2006, 2024),
  // Hoggar
  ...generateYearVariants({ brand: 'Peugeot', model: 'Hoggar', trim: '1.6', engineCode: 'TU5', engineName: '1.6 16V', displacementCc: 1587, fuel: 'flex', transmission: 'manual', bodyType: 'pickup', vehicleType: 'pickup', power: '110cv', sources: ['fipe'] }, 2010, 2014),
];

// ============================================================================
// CITROËN - COMPLETO
// ============================================================================
const CITROEN_VARIANTS: VehicleVariant[] = [
  // C3
  ...generateYearVariants({ brand: 'Citroën', model: 'C3', trim: '1.4', engineCode: 'TU3', engineName: '1.4 8V', displacementCc: 1360, fuel: 'flex', transmission: 'manual', bodyType: 'hatch', vehicleType: 'car', power: '75cv', sources: ['fipe'] }, 2003, 2019),
  ...generateYearVariants({ brand: 'Citroën', model: 'C3', trim: '1.6', engineCode: 'EC5', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '118cv', sources: ['fipe'] }, 2003, 2024),
  ...generateYearVariants({ brand: 'Citroën', model: 'Novo C3', trim: '1.0 Turbo', engineCode: 'EB2', engineName: '1.0 Turbo', displacementCc: 999, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '130cv', sources: ['fipe'] }, 2023, 2024),
  // C3 Aircross
  ...generateYearVariants({ brand: 'Citroën', model: 'C3 Aircross', trim: '1.6', engineCode: 'EC5', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '118cv', sources: ['fipe'] }, 2018, 2024),
  // C4 Cactus
  ...generateYearVariants({ brand: 'Citroën', model: 'C4 Cactus', trim: '1.6', engineCode: 'EC5', engineName: '1.6 16V', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '118cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Citroën', model: 'C4 Cactus', trim: '1.6 Turbo', engineCode: 'EP6', engineName: '1.6 Turbo', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '173cv', sources: ['fipe'] }, 2018, 2024),
  // C5 Aircross
  ...generateYearVariants({ brand: 'Citroën', model: 'C5 Aircross', trim: '1.6 Turbo', engineCode: 'EP6', engineName: '1.6 Turbo', displacementCc: 1598, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '173cv', sources: ['fipe'] }, 2020, 2024),
  // C4
  ...generateYearVariants({ brand: 'Citroën', model: 'C4', trim: '2.0', engineCode: 'EW10', engineName: '2.0 16V', displacementCc: 1997, fuel: 'flex', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '143cv', sources: ['fipe'] }, 2007, 2015),
  // C4 Lounge
  ...generateYearVariants({ brand: 'Citroën', model: 'C4 Lounge', trim: '1.6 Turbo', engineCode: 'EP6', engineName: '1.6 Turbo', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '173cv', sources: ['fipe'] }, 2013, 2019),
  // C4 Picasso
  ...generateYearVariants({ brand: 'Citroën', model: 'C4 Picasso', trim: '2.0', engineCode: 'EW10', engineName: '2.0 16V', displacementCc: 1997, fuel: 'flex', transmission: 'automatic', bodyType: 'van', vehicleType: 'van', power: '143cv', sources: ['fipe'] }, 2007, 2015),
  // Jumper
  ...generateYearVariants({ brand: 'Citroën', model: 'Jumper', trim: '2.3 Diesel', engineCode: 'F1CE', engineName: '2.3 Diesel', displacementCc: 2287, fuel: 'diesel', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '130cv', sources: ['fipe'] }, 2006, 2024),
  // Berlingo
  ...generateYearVariants({ brand: 'Citroën', model: 'Berlingo', trim: '1.6', engineCode: 'TU5', engineName: '1.6 16V', displacementCc: 1587, fuel: 'flex', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '110cv', sources: ['fipe'] }, 1999, 2019),
];


// ============================================================================
// MITSUBISHI - COMPLETO
// ============================================================================
const MITSUBISHI_VARIANTS: VehicleVariant[] = [
  // Lancer
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'Lancer', trim: '2.0', engineCode: '4B11', engineName: '2.0 16V', displacementCc: 1998, fuel: 'gasoline', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '160cv', sources: ['fipe'] }, 2011, 2019),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'Lancer', trim: 'Evolution X', engineCode: '4B11T', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '295cv', sources: ['fipe'] }, 2008, 2016),
  // ASX
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'ASX', trim: '2.0', engineCode: '4B11', engineName: '2.0 16V', displacementCc: 1998, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '160cv', sources: ['fipe'] }, 2010, 2024),
  // Outlander
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'Outlander', trim: '2.0', engineCode: '4B11', engineName: '2.0 16V', displacementCc: 1998, fuel: 'gasoline', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '160cv', sources: ['fipe'] }, 2007, 2024),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'Outlander', trim: '3.0 V6', engineCode: '6B31', engineName: '3.0 V6', displacementCc: 2998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '240cv', sources: ['fipe'] }, 2007, 2024),
  // Eclipse Cross
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'Eclipse Cross', trim: '1.5 Turbo', engineCode: '4B40', engineName: '1.5 Turbo', displacementCc: 1499, fuel: 'gasoline', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '165cv', sources: ['fipe'] }, 2018, 2024),
  // Pajero
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'Pajero', trim: '3.2 Diesel', engineCode: '4M41', engineName: '3.2 Diesel', displacementCc: 3200, fuel: 'diesel', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '200cv', sources: ['fipe'] }, 2000, 2024),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'Pajero', trim: '3.8 V6', engineCode: '6G75', engineName: '3.8 V6', displacementCc: 3828, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '250cv', sources: ['fipe'] }, 2007, 2024),
  // Pajero Sport
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'Pajero Sport', trim: '2.4 Diesel', engineCode: '4N15', engineName: '2.4 Diesel', displacementCc: 2442, fuel: 'diesel', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '190cv', sources: ['fipe'] }, 2016, 2024),
  // Pajero Dakar
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'Pajero Dakar', trim: '3.2 Diesel', engineCode: '4M41', engineName: '3.2 Diesel', displacementCc: 3200, fuel: 'diesel', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '200cv', sources: ['fipe'] }, 2009, 2019),
  // L200 Triton
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'L200 Triton', trim: '2.4 Diesel', engineCode: '4N15', engineName: '2.4 Diesel', displacementCc: 2442, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '190cv', sources: ['fipe'] }, 2007, 2024),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'L200 Triton', trim: '3.2 Diesel', engineCode: '4M41', engineName: '3.2 Diesel', displacementCc: 3200, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '200cv', sources: ['fipe'] }, 2007, 2024),
];

// ============================================================================
// SUZUKI - COMPLETO
// ============================================================================
const SUZUKI_VARIANTS: VehicleVariant[] = [
  // Swift
  ...generateYearVariants({ brand: 'Suzuki', model: 'Swift', trim: '1.4', engineCode: 'K14B', engineName: '1.4 16V', displacementCc: 1372, fuel: 'gasoline', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '95cv', sources: ['fipe'] }, 2012, 2019),
  // Vitara
  ...generateYearVariants({ brand: 'Suzuki', model: 'Vitara', trim: '1.4 Turbo', engineCode: 'K14C', engineName: '1.4 Turbo', displacementCc: 1373, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '140cv', sources: ['fipe'] }, 2015, 2024),
  ...generateYearVariants({ brand: 'Suzuki', model: 'Vitara', trim: '1.6', engineCode: 'M16A', engineName: '1.6 16V', displacementCc: 1586, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '120cv', sources: ['fipe'] }, 2015, 2024),
  // Grand Vitara
  ...generateYearVariants({ brand: 'Suzuki', model: 'Grand Vitara', trim: '2.0', engineCode: 'J20A', engineName: '2.0 16V', displacementCc: 1995, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '140cv', sources: ['fipe'] }, 2006, 2016),
  // Jimny
  ...generateYearVariants({ brand: 'Suzuki', model: 'Jimny', trim: '1.3', engineCode: 'G13BB', engineName: '1.3 16V', displacementCc: 1298, fuel: 'gasoline', transmission: 'manual', bodyType: 'suv', vehicleType: 'suv', power: '85cv', sources: ['fipe'] }, 2000, 2019),
  ...generateYearVariants({ brand: 'Suzuki', model: 'Jimny Sierra', trim: '1.5', engineCode: 'K15B', engineName: '1.5 16V', displacementCc: 1462, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '102cv', sources: ['fipe'] }, 2019, 2024),
  // S-Cross
  ...generateYearVariants({ brand: 'Suzuki', model: 'S-Cross', trim: '1.4 Turbo', engineCode: 'K14C', engineName: '1.4 Turbo', displacementCc: 1373, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '140cv', sources: ['fipe'] }, 2016, 2024),
  // SX4
  ...generateYearVariants({ brand: 'Suzuki', model: 'SX4', trim: '2.0', engineCode: 'J20A', engineName: '2.0 16V', displacementCc: 1995, fuel: 'gasoline', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '145cv', sources: ['fipe'] }, 2008, 2015),
];

// ============================================================================
// BMW - COMPLETO
// ============================================================================
const BMW_VARIANTS: VehicleVariant[] = [
  // Série 1
  ...generateYearVariants({ brand: 'BMW', model: 'Série 1', trim: '118i', engineCode: 'B38', engineName: '1.5 Turbo', displacementCc: 1499, fuel: 'gasoline', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '140cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'Série 1', trim: '120i', engineCode: 'B48', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '192cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'Série 1', trim: 'M135i', engineCode: 'B48', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '306cv', sources: ['fipe'] }, 2019, 2024),
  // Série 2
  ...generateYearVariants({ brand: 'BMW', model: 'Série 2', trim: '220i', engineCode: 'B48', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '184cv', sources: ['fipe'] }, 2014, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'Série 2', trim: 'M240i', engineCode: 'B58', engineName: '3.0 Turbo', displacementCc: 2998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '340cv', sources: ['fipe'] }, 2016, 2024),
  // Série 3
  ...generateYearVariants({ brand: 'BMW', model: 'Série 3', trim: '320i', engineCode: 'B48', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '184cv', sources: ['fipe'] }, 2005, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'Série 3', trim: '330i', engineCode: 'B48', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '258cv', sources: ['fipe'] }, 2015, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'Série 3', trim: 'M340i', engineCode: 'B58', engineName: '3.0 Turbo', displacementCc: 2998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '387cv', sources: ['fipe'] }, 2019, 2024),
  // Série 4
  ...generateYearVariants({ brand: 'BMW', model: 'Série 4', trim: '430i', engineCode: 'B48', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '258cv', sources: ['fipe'] }, 2014, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'Série 4', trim: 'M440i', engineCode: 'B58', engineName: '3.0 Turbo', displacementCc: 2998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '387cv', sources: ['fipe'] }, 2020, 2024),
  // Série 5
  ...generateYearVariants({ brand: 'BMW', model: 'Série 5', trim: '530i', engineCode: 'B48', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '252cv', sources: ['fipe'] }, 2010, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'Série 5', trim: '540i', engineCode: 'B58', engineName: '3.0 Turbo', displacementCc: 2998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '340cv', sources: ['fipe'] }, 2017, 2024),
  // Série 7
  ...generateYearVariants({ brand: 'BMW', model: 'Série 7', trim: '740i', engineCode: 'B58', engineName: '3.0 Turbo', displacementCc: 2998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '340cv', sources: ['fipe'] }, 2009, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'Série 7', trim: '750i', engineCode: 'N63', engineName: '4.4 V8 Turbo', displacementCc: 4395, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '530cv', sources: ['fipe'] }, 2009, 2024),
  // X1
  ...generateYearVariants({ brand: 'BMW', model: 'X1', trim: 'sDrive20i', engineCode: 'B48', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '192cv', sources: ['fipe'] }, 2010, 2024),
  // X2
  ...generateYearVariants({ brand: 'BMW', model: 'X2', trim: 'sDrive20i', engineCode: 'B48', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '192cv', sources: ['fipe'] }, 2018, 2024),
  // X3
  ...generateYearVariants({ brand: 'BMW', model: 'X3', trim: 'xDrive30i', engineCode: 'B48', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '252cv', sources: ['fipe'] }, 2004, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'X3', trim: 'M40i', engineCode: 'B58', engineName: '3.0 Turbo', displacementCc: 2998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '387cv', sources: ['fipe'] }, 2018, 2024),
  // X4
  ...generateYearVariants({ brand: 'BMW', model: 'X4', trim: 'xDrive30i', engineCode: 'B48', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '252cv', sources: ['fipe'] }, 2014, 2024),
  // X5
  ...generateYearVariants({ brand: 'BMW', model: 'X5', trim: 'xDrive40i', engineCode: 'B58', engineName: '3.0 Turbo', displacementCc: 2998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '340cv', sources: ['fipe'] }, 2007, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'X5', trim: 'xDrive50i', engineCode: 'N63', engineName: '4.4 V8 Turbo', displacementCc: 4395, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '462cv', sources: ['fipe'] }, 2014, 2024),
  // X6
  ...generateYearVariants({ brand: 'BMW', model: 'X6', trim: 'xDrive40i', engineCode: 'B58', engineName: '3.0 Turbo', displacementCc: 2998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '340cv', sources: ['fipe'] }, 2008, 2024),
  // X7
  ...generateYearVariants({ brand: 'BMW', model: 'X7', trim: 'xDrive40i', engineCode: 'B58', engineName: '3.0 Turbo', displacementCc: 2998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '340cv', sources: ['fipe'] }, 2019, 2024),
  // M3
  ...generateYearVariants({ brand: 'BMW', model: 'M3', trim: 'Competition', engineCode: 'S58', engineName: '3.0 Turbo', displacementCc: 2993, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '510cv', sources: ['fipe'] }, 2014, 2024),
  // M4
  ...generateYearVariants({ brand: 'BMW', model: 'M4', trim: 'Competition', engineCode: 'S58', engineName: '3.0 Turbo', displacementCc: 2993, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '510cv', sources: ['fipe'] }, 2014, 2024),
  // M5
  ...generateYearVariants({ brand: 'BMW', model: 'M5', trim: 'Competition', engineCode: 'S63', engineName: '4.4 V8 Turbo', displacementCc: 4395, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '625cv', sources: ['fipe'] }, 2011, 2024),
  // Z4
  ...generateYearVariants({ brand: 'BMW', model: 'Z4', trim: 'sDrive30i', engineCode: 'B48', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'convertible', vehicleType: 'car', power: '258cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'Z4', trim: 'M40i', engineCode: 'B58', engineName: '3.0 Turbo', displacementCc: 2998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'convertible', vehicleType: 'car', power: '387cv', sources: ['fipe'] }, 2019, 2024),
];


// ============================================================================
// AUDI - COMPLETO
// ============================================================================
const AUDI_VARIANTS: VehicleVariant[] = [
  // A1
  ...generateYearVariants({ brand: 'Audi', model: 'A1', trim: '1.4 TFSI', engineCode: 'CZEA', engineName: '1.4 TFSI', displacementCc: 1395, fuel: 'gasoline', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '125cv', sources: ['fipe'] }, 2011, 2019),
  // A3
  ...generateYearVariants({ brand: 'Audi', model: 'A3', trim: '1.4 TFSI', engineCode: 'CZEA', engineName: '1.4 TFSI', displacementCc: 1395, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '150cv', sources: ['fipe'] }, 2013, 2024),
  ...generateYearVariants({ brand: 'Audi', model: 'A3', trim: '2.0 TFSI', engineCode: 'CZPB', engineName: '2.0 TFSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '190cv', sources: ['fipe'] }, 2013, 2024),
  // A4
  ...generateYearVariants({ brand: 'Audi', model: 'A4', trim: '2.0 TFSI', engineCode: 'CZPB', engineName: '2.0 TFSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '190cv', sources: ['fipe'] }, 2008, 2024),
  ...generateYearVariants({ brand: 'Audi', model: 'A4 Avant', trim: '2.0 TFSI', engineCode: 'CZPB', engineName: '2.0 TFSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'wagon', vehicleType: 'car', power: '190cv', sources: ['fipe'] }, 2008, 2024),
  // A5
  ...generateYearVariants({ brand: 'Audi', model: 'A5', trim: '2.0 TFSI', engineCode: 'CZPB', engineName: '2.0 TFSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '190cv', sources: ['fipe'] }, 2010, 2024),
  ...generateYearVariants({ brand: 'Audi', model: 'A5 Sportback', trim: '2.0 TFSI', engineCode: 'CZPB', engineName: '2.0 TFSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '190cv', sources: ['fipe'] }, 2010, 2024),
  // A6
  ...generateYearVariants({ brand: 'Audi', model: 'A6', trim: '2.0 TFSI', engineCode: 'CZPB', engineName: '2.0 TFSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '252cv', sources: ['fipe'] }, 2011, 2024),
  ...generateYearVariants({ brand: 'Audi', model: 'A6', trim: '3.0 TFSI', engineCode: 'CREC', engineName: '3.0 TFSI', displacementCc: 2995, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '340cv', sources: ['fipe'] }, 2011, 2024),
  // A7
  ...generateYearVariants({ brand: 'Audi', model: 'A7', trim: '3.0 TFSI', engineCode: 'CREC', engineName: '3.0 TFSI', displacementCc: 2995, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '340cv', sources: ['fipe'] }, 2011, 2024),
  // A8
  ...generateYearVariants({ brand: 'Audi', model: 'A8', trim: '3.0 TFSI', engineCode: 'CREC', engineName: '3.0 TFSI', displacementCc: 2995, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '340cv', sources: ['fipe'] }, 2010, 2024),
  ...generateYearVariants({ brand: 'Audi', model: 'A8', trim: '4.0 TFSI', engineCode: 'CEUA', engineName: '4.0 V8 TFSI', displacementCc: 3993, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '460cv', sources: ['fipe'] }, 2014, 2024),
  // Q3
  ...generateYearVariants({ brand: 'Audi', model: 'Q3', trim: '1.4 TFSI', engineCode: 'CZEA', engineName: '1.4 TFSI', displacementCc: 1395, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '150cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Audi', model: 'Q3', trim: '2.0 TFSI', engineCode: 'CZPB', engineName: '2.0 TFSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '220cv', sources: ['fipe'] }, 2012, 2024),
  // Q5
  ...generateYearVariants({ brand: 'Audi', model: 'Q5', trim: '2.0 TFSI', engineCode: 'CZPB', engineName: '2.0 TFSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '252cv', sources: ['fipe'] }, 2009, 2024),
  // Q7
  ...generateYearVariants({ brand: 'Audi', model: 'Q7', trim: '3.0 TFSI', engineCode: 'CREC', engineName: '3.0 TFSI', displacementCc: 2995, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '340cv', sources: ['fipe'] }, 2006, 2024),
  // Q8
  ...generateYearVariants({ brand: 'Audi', model: 'Q8', trim: '3.0 TFSI', engineCode: 'CREC', engineName: '3.0 TFSI', displacementCc: 2995, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '340cv', sources: ['fipe'] }, 2019, 2024),
  // TT
  ...generateYearVariants({ brand: 'Audi', model: 'TT', trim: '2.0 TFSI', engineCode: 'CZPB', engineName: '2.0 TFSI', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '230cv', sources: ['fipe'] }, 2007, 2024),
  ...generateYearVariants({ brand: 'Audi', model: 'TT RS', trim: '2.5 TFSI', engineCode: 'DAZA', engineName: '2.5 TFSI', displacementCc: 2480, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '400cv', sources: ['fipe'] }, 2017, 2024),
  // RS3
  ...generateYearVariants({ brand: 'Audi', model: 'RS3', trim: '2.5 TFSI', engineCode: 'DAZA', engineName: '2.5 TFSI', displacementCc: 2480, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '400cv', sources: ['fipe'] }, 2017, 2024),
  // RS4
  ...generateYearVariants({ brand: 'Audi', model: 'RS4', trim: '2.9 TFSI', engineCode: 'DECA', engineName: '2.9 V6 TFSI', displacementCc: 2894, fuel: 'gasoline', transmission: 'automatic', bodyType: 'wagon', vehicleType: 'car', power: '450cv', sources: ['fipe'] }, 2018, 2024),
  // RS5
  ...generateYearVariants({ brand: 'Audi', model: 'RS5', trim: '2.9 TFSI', engineCode: 'DECA', engineName: '2.9 V6 TFSI', displacementCc: 2894, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '450cv', sources: ['fipe'] }, 2018, 2024),
  // RS6
  ...generateYearVariants({ brand: 'Audi', model: 'RS6', trim: '4.0 TFSI', engineCode: 'DCRA', engineName: '4.0 V8 TFSI', displacementCc: 3996, fuel: 'gasoline', transmission: 'automatic', bodyType: 'wagon', vehicleType: 'car', power: '600cv', sources: ['fipe'] }, 2020, 2024),
  // RS7
  ...generateYearVariants({ brand: 'Audi', model: 'RS7', trim: '4.0 TFSI', engineCode: 'DCRA', engineName: '4.0 V8 TFSI', displacementCc: 3996, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '600cv', sources: ['fipe'] }, 2020, 2024),
  // R8
  ...generateYearVariants({ brand: 'Audi', model: 'R8', trim: '5.2 V10', engineCode: 'CSPB', engineName: '5.2 V10', displacementCc: 5204, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '620cv', sources: ['fipe'] }, 2008, 2024),
  // e-tron
  ...generateYearVariants({ brand: 'Audi', model: 'e-tron', trim: '55 quattro', engineCode: 'Electric', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '408cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'Audi', model: 'e-tron GT', trim: 'RS', engineCode: 'Electric', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '646cv', sources: ['fipe'] }, 2021, 2024),
];

// ============================================================================
// MERCEDES-BENZ CARROS - COMPLETO
// ============================================================================
const MERCEDES_VARIANTS: VehicleVariant[] = [
  // Classe A
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Classe A', trim: 'A200', engineCode: 'M282', engineName: '1.3 Turbo', displacementCc: 1332, fuel: 'gasoline', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '163cv', sources: ['fipe'] }, 2013, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Classe A', trim: 'A250', engineCode: 'M260', engineName: '2.0 Turbo', displacementCc: 1991, fuel: 'gasoline', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '224cv', sources: ['fipe'] }, 2013, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Classe A', trim: 'AMG A35', engineCode: 'M260', engineName: '2.0 Turbo', displacementCc: 1991, fuel: 'gasoline', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '306cv', sources: ['fipe'] }, 2019, 2024),
  // Classe C
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Classe C', trim: 'C180', engineCode: 'M264', engineName: '1.5 Turbo', displacementCc: 1497, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '156cv', sources: ['fipe'] }, 2008, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Classe C', trim: 'C200', engineCode: 'M264', engineName: '1.5 Turbo', displacementCc: 1497, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '184cv', sources: ['fipe'] }, 2008, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Classe C', trim: 'C300', engineCode: 'M264', engineName: '2.0 Turbo', displacementCc: 1991, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '258cv', sources: ['fipe'] }, 2015, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Classe C', trim: 'AMG C43', engineCode: 'M276', engineName: '3.0 V6 Turbo', displacementCc: 2996, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '390cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Classe C', trim: 'AMG C63', engineCode: 'M177', engineName: '4.0 V8 Turbo', displacementCc: 3982, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '476cv', sources: ['fipe'] }, 2015, 2024),
  // Classe E
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Classe E', trim: 'E300', engineCode: 'M264', engineName: '2.0 Turbo', displacementCc: 1991, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '258cv', sources: ['fipe'] }, 2010, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Classe E', trim: 'E450', engineCode: 'M256', engineName: '3.0 Turbo', displacementCc: 2999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '367cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Classe E', trim: 'AMG E53', engineCode: 'M256', engineName: '3.0 Turbo', displacementCc: 2999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '435cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Classe E', trim: 'AMG E63', engineCode: 'M177', engineName: '4.0 V8 Turbo', displacementCc: 3982, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '612cv', sources: ['fipe'] }, 2017, 2024),
  // Classe S
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Classe S', trim: 'S500', engineCode: 'M256', engineName: '3.0 Turbo', displacementCc: 2999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '435cv', sources: ['fipe'] }, 2006, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Classe S', trim: 'S580', engineCode: 'M176', engineName: '4.0 V8 Turbo', displacementCc: 3982, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '503cv', sources: ['fipe'] }, 2021, 2024),
  // CLA
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'CLA', trim: 'CLA200', engineCode: 'M282', engineName: '1.3 Turbo', displacementCc: 1332, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '163cv', sources: ['fipe'] }, 2013, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'CLA', trim: 'CLA250', engineCode: 'M260', engineName: '2.0 Turbo', displacementCc: 1991, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '224cv', sources: ['fipe'] }, 2013, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'CLA', trim: 'AMG CLA45', engineCode: 'M139', engineName: '2.0 Turbo', displacementCc: 1991, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '421cv', sources: ['fipe'] }, 2014, 2024),
  // GLA
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'GLA', trim: 'GLA200', engineCode: 'M282', engineName: '1.3 Turbo', displacementCc: 1332, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '163cv', sources: ['fipe'] }, 2014, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'GLA', trim: 'GLA250', engineCode: 'M260', engineName: '2.0 Turbo', displacementCc: 1991, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '224cv', sources: ['fipe'] }, 2014, 2024),
  // GLB
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'GLB', trim: 'GLB200', engineCode: 'M282', engineName: '1.3 Turbo', displacementCc: 1332, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '163cv', sources: ['fipe'] }, 2020, 2024),
  // GLC
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'GLC', trim: 'GLC300', engineCode: 'M264', engineName: '2.0 Turbo', displacementCc: 1991, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '258cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'GLC', trim: 'AMG GLC43', engineCode: 'M276', engineName: '3.0 V6 Turbo', displacementCc: 2996, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '390cv', sources: ['fipe'] }, 2016, 2024),
  // GLE
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'GLE', trim: 'GLE450', engineCode: 'M256', engineName: '3.0 Turbo', displacementCc: 2999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '367cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'GLE', trim: 'AMG GLE53', engineCode: 'M256', engineName: '3.0 Turbo', displacementCc: 2999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '435cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'GLE', trim: 'AMG GLE63', engineCode: 'M177', engineName: '4.0 V8 Turbo', displacementCc: 3982, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '612cv', sources: ['fipe'] }, 2015, 2024),
  // GLS
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'GLS', trim: 'GLS450', engineCode: 'M256', engineName: '3.0 Turbo', displacementCc: 2999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '367cv', sources: ['fipe'] }, 2016, 2024),
  // Classe G
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Classe G', trim: 'G500', engineCode: 'M176', engineName: '4.0 V8 Turbo', displacementCc: 3982, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '422cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Classe G', trim: 'AMG G63', engineCode: 'M177', engineName: '4.0 V8 Turbo', displacementCc: 3982, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '585cv', sources: ['fipe'] }, 2018, 2024),
  // AMG GT
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'AMG GT', trim: 'GT', engineCode: 'M178', engineName: '4.0 V8 Turbo', displacementCc: 3982, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '476cv', sources: ['fipe'] }, 2015, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'AMG GT', trim: 'GT S', engineCode: 'M178', engineName: '4.0 V8 Turbo', displacementCc: 3982, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '522cv', sources: ['fipe'] }, 2015, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'AMG GT', trim: 'GT R', engineCode: 'M178', engineName: '4.0 V8 Turbo', displacementCc: 3982, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '585cv', sources: ['fipe'] }, 2017, 2024),
  // EQS
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'EQS', trim: 'EQS 450+', engineCode: 'Electric', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '333cv', sources: ['fipe'] }, 2022, 2024),
  // EQE
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'EQE', trim: 'EQE 350+', engineCode: 'Electric', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '292cv', sources: ['fipe'] }, 2022, 2024),
  // Sprinter
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Sprinter', trim: '415 CDI', engineCode: 'OM651', engineName: '2.2 Diesel', displacementCc: 2143, fuel: 'diesel', transmission: 'manual', bodyType: 'van', vehicleType: 'van', power: '150cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Sprinter', trim: '516 CDI', engineCode: 'OM651', engineName: '2.2 Diesel', displacementCc: 2143, fuel: 'diesel', transmission: 'automatic', bodyType: 'van', vehicleType: 'van', power: '163cv', sources: ['fipe'] }, 2012, 2024),
];


// ============================================================================
// PORSCHE - COMPLETO
// ============================================================================
const PORSCHE_VARIANTS: VehicleVariant[] = [
  // 911
  ...generateYearVariants({ brand: 'Porsche', model: '911', trim: 'Carrera', engineCode: '9A2', engineName: '3.0 Turbo', displacementCc: 2981, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '385cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Porsche', model: '911', trim: 'Carrera S', engineCode: '9A2', engineName: '3.0 Turbo', displacementCc: 2981, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '450cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Porsche', model: '911', trim: 'Turbo', engineCode: '9A2', engineName: '3.8 Turbo', displacementCc: 3800, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '580cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Porsche', model: '911', trim: 'Turbo S', engineCode: '9A2', engineName: '3.8 Turbo', displacementCc: 3800, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '650cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Porsche', model: '911', trim: 'GT3', engineCode: '9A2', engineName: '4.0 Aspirado', displacementCc: 3996, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '510cv', sources: ['fipe'] }, 2017, 2024),
  ...generateYearVariants({ brand: 'Porsche', model: '911', trim: 'GT3 RS', engineCode: '9A2', engineName: '4.0 Aspirado', displacementCc: 3996, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '525cv', sources: ['fipe'] }, 2019, 2024),
  // 718 Boxster
  ...generateYearVariants({ brand: 'Porsche', model: '718 Boxster', trim: 'Base', engineCode: 'MAB', engineName: '2.0 Turbo', displacementCc: 1988, fuel: 'gasoline', transmission: 'automatic', bodyType: 'convertible', vehicleType: 'car', power: '300cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Porsche', model: '718 Boxster', trim: 'S', engineCode: 'MAB', engineName: '2.5 Turbo', displacementCc: 2497, fuel: 'gasoline', transmission: 'automatic', bodyType: 'convertible', vehicleType: 'car', power: '350cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Porsche', model: '718 Boxster', trim: 'GTS 4.0', engineCode: 'MAB', engineName: '4.0 Aspirado', displacementCc: 3995, fuel: 'gasoline', transmission: 'automatic', bodyType: 'convertible', vehicleType: 'car', power: '400cv', sources: ['fipe'] }, 2020, 2024),
  // 718 Cayman
  ...generateYearVariants({ brand: 'Porsche', model: '718 Cayman', trim: 'Base', engineCode: 'MAB', engineName: '2.0 Turbo', displacementCc: 1988, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '300cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Porsche', model: '718 Cayman', trim: 'S', engineCode: 'MAB', engineName: '2.5 Turbo', displacementCc: 2497, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '350cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Porsche', model: '718 Cayman', trim: 'GT4', engineCode: 'MAB', engineName: '4.0 Aspirado', displacementCc: 3995, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '420cv', sources: ['fipe'] }, 2020, 2024),
  // Cayenne
  ...generateYearVariants({ brand: 'Porsche', model: 'Cayenne', trim: 'Base', engineCode: 'MCY', engineName: '3.0 V6 Turbo', displacementCc: 2995, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '340cv', sources: ['fipe'] }, 2003, 2024),
  ...generateYearVariants({ brand: 'Porsche', model: 'Cayenne', trim: 'S', engineCode: 'MCY', engineName: '2.9 V6 Turbo', displacementCc: 2894, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '440cv', sources: ['fipe'] }, 2003, 2024),
  ...generateYearVariants({ brand: 'Porsche', model: 'Cayenne', trim: 'Turbo', engineCode: 'MCY', engineName: '4.0 V8 Turbo', displacementCc: 3996, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '550cv', sources: ['fipe'] }, 2003, 2024),
  ...generateYearVariants({ brand: 'Porsche', model: 'Cayenne', trim: 'E-Hybrid', engineCode: 'MCY', engineName: '3.0 V6 Turbo Hybrid', displacementCc: 2995, fuel: 'hybrid', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '462cv', sources: ['fipe'] }, 2018, 2024),
  // Macan
  ...generateYearVariants({ brand: 'Porsche', model: 'Macan', trim: 'Base', engineCode: 'MCT', engineName: '2.0 Turbo', displacementCc: 1984, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '265cv', sources: ['fipe'] }, 2014, 2024),
  ...generateYearVariants({ brand: 'Porsche', model: 'Macan', trim: 'S', engineCode: 'MCT', engineName: '2.9 V6 Turbo', displacementCc: 2894, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '380cv', sources: ['fipe'] }, 2014, 2024),
  ...generateYearVariants({ brand: 'Porsche', model: 'Macan', trim: 'GTS', engineCode: 'MCT', engineName: '2.9 V6 Turbo', displacementCc: 2894, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '440cv', sources: ['fipe'] }, 2020, 2024),
  // Panamera
  ...generateYearVariants({ brand: 'Porsche', model: 'Panamera', trim: 'Base', engineCode: 'MCW', engineName: '2.9 V6 Turbo', displacementCc: 2894, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '330cv', sources: ['fipe'] }, 2009, 2024),
  ...generateYearVariants({ brand: 'Porsche', model: 'Panamera', trim: '4S', engineCode: 'MCW', engineName: '2.9 V6 Turbo', displacementCc: 2894, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '440cv', sources: ['fipe'] }, 2009, 2024),
  ...generateYearVariants({ brand: 'Porsche', model: 'Panamera', trim: 'Turbo', engineCode: 'MCW', engineName: '4.0 V8 Turbo', displacementCc: 3996, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '550cv', sources: ['fipe'] }, 2009, 2024),
  ...generateYearVariants({ brand: 'Porsche', model: 'Panamera', trim: 'Turbo S', engineCode: 'MCW', engineName: '4.0 V8 Turbo', displacementCc: 3996, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '630cv', sources: ['fipe'] }, 2017, 2024),
  // Taycan
  ...generateYearVariants({ brand: 'Porsche', model: 'Taycan', trim: 'Base', engineCode: 'Electric', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '408cv', sources: ['fipe'] }, 2020, 2024),
  ...generateYearVariants({ brand: 'Porsche', model: 'Taycan', trim: '4S', engineCode: 'Electric', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '530cv', sources: ['fipe'] }, 2020, 2024),
  ...generateYearVariants({ brand: 'Porsche', model: 'Taycan', trim: 'Turbo', engineCode: 'Electric', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '680cv', sources: ['fipe'] }, 2020, 2024),
  ...generateYearVariants({ brand: 'Porsche', model: 'Taycan', trim: 'Turbo S', engineCode: 'Electric', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '761cv', sources: ['fipe'] }, 2020, 2024),
];

// ============================================================================
// MOTOS - HONDA
// ============================================================================
const HONDA_MOTOS_VARIANTS: VehicleVariant[] = [
  // CG
  ...generateYearVariants({ brand: 'Honda', model: 'CG 125', trim: 'Fan', engineCode: 'OHC', engineName: '125cc', displacementCc: 125, fuel: 'flex', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '11cv', sources: ['fipe'] }, 1976, 2024),
  ...generateYearVariants({ brand: 'Honda', model: 'CG 150', trim: 'Titan', engineCode: 'OHC', engineName: '150cc', displacementCc: 150, fuel: 'flex', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '14cv', sources: ['fipe'] }, 2004, 2024),
  ...generateYearVariants({ brand: 'Honda', model: 'CG 160', trim: 'Titan', engineCode: 'OHC', engineName: '160cc', displacementCc: 162, fuel: 'flex', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '15cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Honda', model: 'CG 160', trim: 'Start', engineCode: 'OHC', engineName: '160cc', displacementCc: 162, fuel: 'flex', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '14cv', sources: ['fipe'] }, 2016, 2024),
  // Biz
  ...generateYearVariants({ brand: 'Honda', model: 'Biz 100', trim: 'ES', engineCode: 'OHC', engineName: '100cc', displacementCc: 97, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '8cv', sources: ['fipe'] }, 1998, 2015),
  ...generateYearVariants({ brand: 'Honda', model: 'Biz 110i', trim: 'ES', engineCode: 'OHC', engineName: '110cc', displacementCc: 109, fuel: 'flex', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '9cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Honda', model: 'Biz 125', trim: 'ES', engineCode: 'OHC', engineName: '125cc', displacementCc: 125, fuel: 'flex', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '10cv', sources: ['fipe'] }, 2005, 2024),
  // Bros
  ...generateYearVariants({ brand: 'Honda', model: 'Bros 150', trim: 'ES', engineCode: 'OHC', engineName: '150cc', displacementCc: 149, fuel: 'flex', transmission: 'manual', bodyType: 'trail', vehicleType: 'motorcycle', power: '14cv', sources: ['fipe'] }, 2003, 2015),
  ...generateYearVariants({ brand: 'Honda', model: 'Bros 160', trim: 'ESDD', engineCode: 'OHC', engineName: '160cc', displacementCc: 162, fuel: 'flex', transmission: 'manual', bodyType: 'trail', vehicleType: 'motorcycle', power: '15cv', sources: ['fipe'] }, 2015, 2024),
  // XRE
  ...generateYearVariants({ brand: 'Honda', model: 'XRE 190', trim: 'ABS', engineCode: 'OHC', engineName: '190cc', displacementCc: 184, fuel: 'flex', transmission: 'manual', bodyType: 'trail', vehicleType: 'motorcycle', power: '16cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Honda', model: 'XRE 300', trim: 'ABS', engineCode: 'OHC', engineName: '300cc', displacementCc: 291, fuel: 'flex', transmission: 'manual', bodyType: 'trail', vehicleType: 'motorcycle', power: '26cv', sources: ['fipe'] }, 2009, 2024),
  // CB
  ...generateYearVariants({ brand: 'Honda', model: 'CB 250F Twister', trim: 'ABS', engineCode: 'OHC', engineName: '250cc', displacementCc: 249, fuel: 'flex', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '23cv', sources: ['fipe'] }, 2015, 2024),
  ...generateYearVariants({ brand: 'Honda', model: 'CB 300R', trim: 'ABS', engineCode: 'DOHC', engineName: '300cc', displacementCc: 286, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '31cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'Honda', model: 'CB 500F', trim: 'ABS', engineCode: 'DOHC', engineName: '500cc', displacementCc: 471, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '50cv', sources: ['fipe'] }, 2013, 2024),
  ...generateYearVariants({ brand: 'Honda', model: 'CB 500X', trim: 'ABS', engineCode: 'DOHC', engineName: '500cc', displacementCc: 471, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '50cv', sources: ['fipe'] }, 2013, 2024),
  ...generateYearVariants({ brand: 'Honda', model: 'CB 650R', trim: 'ABS', engineCode: 'DOHC', engineName: '650cc', displacementCc: 649, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '95cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'Honda', model: 'CB 1000R', trim: 'ABS', engineCode: 'DOHC', engineName: '1000cc', displacementCc: 998, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '145cv', sources: ['fipe'] }, 2019, 2024),
  // CBR
  ...generateYearVariants({ brand: 'Honda', model: 'CBR 500R', trim: 'ABS', engineCode: 'DOHC', engineName: '500cc', displacementCc: 471, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '50cv', sources: ['fipe'] }, 2013, 2024),
  ...generateYearVariants({ brand: 'Honda', model: 'CBR 650R', trim: 'ABS', engineCode: 'DOHC', engineName: '650cc', displacementCc: 649, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '95cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'Honda', model: 'CBR 1000RR Fireblade', trim: 'ABS', engineCode: 'DOHC', engineName: '1000cc', displacementCc: 999, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '217cv', sources: ['fipe'] }, 2017, 2024),
  // NC
  ...generateYearVariants({ brand: 'Honda', model: 'NC 750X', trim: 'ABS', engineCode: 'SOHC', engineName: '750cc', displacementCc: 745, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '55cv', sources: ['fipe'] }, 2014, 2024),
  // Africa Twin
  ...generateYearVariants({ brand: 'Honda', model: 'Africa Twin CRF1100L', trim: 'ABS', engineCode: 'SOHC', engineName: '1100cc', displacementCc: 1084, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '102cv', sources: ['fipe'] }, 2020, 2024),
  // Gold Wing
  ...generateYearVariants({ brand: 'Honda', model: 'Gold Wing GL1800', trim: 'Tour', engineCode: 'Boxer', engineName: '1800cc', displacementCc: 1833, fuel: 'gasoline', transmission: 'automatic', bodyType: 'touring', vehicleType: 'motorcycle', power: '126cv', sources: ['fipe'] }, 2018, 2024),
  // PCX
  ...generateYearVariants({ brand: 'Honda', model: 'PCX 150', trim: 'DLX', engineCode: 'eSP', engineName: '150cc', displacementCc: 149, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '14cv', sources: ['fipe'] }, 2013, 2024),
  // SH
  ...generateYearVariants({ brand: 'Honda', model: 'SH 150i', trim: 'DLX', engineCode: 'eSP', engineName: '150cc', displacementCc: 149, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '14cv', sources: ['fipe'] }, 2017, 2024),
  ...generateYearVariants({ brand: 'Honda', model: 'SH 300i', trim: 'Sport', engineCode: 'eSP', engineName: '300cc', displacementCc: 279, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '25cv', sources: ['fipe'] }, 2016, 2024),
  // Elite
  ...generateYearVariants({ brand: 'Honda', model: 'Elite 125', trim: 'Base', engineCode: 'eSP', engineName: '125cc', displacementCc: 124, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '9cv', sources: ['fipe'] }, 2019, 2024),
  // ADV
  ...generateYearVariants({ brand: 'Honda', model: 'ADV 150', trim: 'ABS', engineCode: 'eSP', engineName: '150cc', displacementCc: 149, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '15cv', sources: ['fipe'] }, 2021, 2024),
  // === HORNET - MODELO ICÔNICO ===
  ...generateYearVariants({ brand: 'Honda', model: 'Hornet', trim: 'CB 600F', engineCode: 'DOHC', engineName: '599cc', displacementCc: 599, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '102cv', sources: ['fipe'] }, 2005, 2014),
  ...generateYearVariants({ brand: 'Honda', model: 'CB 600F Hornet', trim: 'ABS', engineCode: 'DOHC', engineName: '599cc', displacementCc: 599, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '102cv', sources: ['fipe'] }, 2008, 2014),
  // Transalp
  ...generateYearVariants({ brand: 'Honda', model: 'Transalp XL700V', trim: 'ABS', engineCode: 'SOHC', engineName: '680cc', displacementCc: 680, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '60cv', sources: ['fipe'] }, 2008, 2013),
  // Varadero
  ...generateYearVariants({ brand: 'Honda', model: 'Varadero XL1000V', trim: 'ABS', engineCode: 'DOHC', engineName: '996cc', displacementCc: 996, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '95cv', sources: ['fipe'] }, 2003, 2013),
  // Shadow
  ...generateYearVariants({ brand: 'Honda', model: 'Shadow 750', trim: 'Classic', engineCode: 'SOHC', engineName: '745cc', displacementCc: 745, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '45cv', sources: ['fipe'] }, 2004, 2016),
  // Tornado
  ...generateYearVariants({ brand: 'Honda', model: 'Tornado XR250', trim: 'Base', engineCode: 'OHC', engineName: '249cc', displacementCc: 249, fuel: 'gasoline', transmission: 'manual', bodyType: 'trail', vehicleType: 'motorcycle', power: '26cv', sources: ['fipe'] }, 2001, 2008),
  // Falcon
  ...generateYearVariants({ brand: 'Honda', model: 'Falcon NX400', trim: 'Base', engineCode: 'OHC', engineName: '397cc', displacementCc: 397, fuel: 'gasoline', transmission: 'manual', bodyType: 'trail', vehicleType: 'motorcycle', power: '31cv', sources: ['fipe'] }, 2000, 2008),
  // Pop
  ...generateYearVariants({ brand: 'Honda', model: 'Pop 100', trim: 'ES', engineCode: 'OHC', engineName: '97cc', displacementCc: 97, fuel: 'gasoline', transmission: 'automatic', bodyType: 'street', vehicleType: 'motorcycle', power: '8cv', sources: ['fipe'] }, 2007, 2015),
  ...generateYearVariants({ brand: 'Honda', model: 'Pop 110i', trim: 'ES', engineCode: 'OHC', engineName: '109cc', displacementCc: 109, fuel: 'flex', transmission: 'automatic', bodyType: 'street', vehicleType: 'motorcycle', power: '9cv', sources: ['fipe'] }, 2016, 2024),
  // Lead
  ...generateYearVariants({ brand: 'Honda', model: 'Lead 110', trim: 'Base', engineCode: 'OHC', engineName: '108cc', displacementCc: 108, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '9cv', sources: ['fipe'] }, 2010, 2016),
  // CRF
  ...generateYearVariants({ brand: 'Honda', model: 'CRF 230F', trim: 'Base', engineCode: 'OHC', engineName: '223cc', displacementCc: 223, fuel: 'gasoline', transmission: 'manual', bodyType: 'trail', vehicleType: 'motorcycle', power: '20cv', sources: ['fipe'] }, 2003, 2019),
  ...generateYearVariants({ brand: 'Honda', model: 'CRF 250F', trim: 'Base', engineCode: 'OHC', engineName: '250cc', displacementCc: 250, fuel: 'gasoline', transmission: 'manual', bodyType: 'trail', vehicleType: 'motorcycle', power: '23cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'Honda', model: 'CRF 450R', trim: 'Base', engineCode: 'DOHC', engineName: '449cc', displacementCc: 449, fuel: 'gasoline', transmission: 'manual', bodyType: 'trail', vehicleType: 'motorcycle', power: '55cv', sources: ['fipe'] }, 2009, 2024),
  ...generateYearVariants({ brand: 'Honda', model: 'CRF 1000L Africa Twin', trim: 'ABS', engineCode: 'SOHC', engineName: '998cc', displacementCc: 998, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '95cv', sources: ['fipe'] }, 2016, 2019),
];


// ============================================================================
// MOTOS - YAMAHA
// ============================================================================
const YAMAHA_MOTOS_VARIANTS: VehicleVariant[] = [
  // Factor
  ...generateYearVariants({ brand: 'Yamaha', model: 'Factor 125', trim: 'ED', engineCode: 'OHC', engineName: '125cc', displacementCc: 125, fuel: 'flex', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '11cv', sources: ['fipe'] }, 2008, 2024),
  ...generateYearVariants({ brand: 'Yamaha', model: 'Factor 150', trim: 'ED', engineCode: 'OHC', engineName: '150cc', displacementCc: 149, fuel: 'flex', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '13cv', sources: ['fipe'] }, 2016, 2024),
  // Fazer
  ...generateYearVariants({ brand: 'Yamaha', model: 'Fazer 150', trim: 'SED', engineCode: 'OHC', engineName: '150cc', displacementCc: 149, fuel: 'flex', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '13cv', sources: ['fipe'] }, 2014, 2024),
  ...generateYearVariants({ brand: 'Yamaha', model: 'Fazer 250', trim: 'ABS', engineCode: 'OHC', engineName: '250cc', displacementCc: 249, fuel: 'flex', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '21cv', sources: ['fipe'] }, 2006, 2024),
  // Crosser
  ...generateYearVariants({ brand: 'Yamaha', model: 'Crosser 150', trim: 'S', engineCode: 'OHC', engineName: '150cc', displacementCc: 149, fuel: 'flex', transmission: 'manual', bodyType: 'trail', vehicleType: 'motorcycle', power: '13cv', sources: ['fipe'] }, 2014, 2024),
  // Lander
  ...generateYearVariants({ brand: 'Yamaha', model: 'Lander 250', trim: 'ABS', engineCode: 'OHC', engineName: '250cc', displacementCc: 249, fuel: 'flex', transmission: 'manual', bodyType: 'trail', vehicleType: 'motorcycle', power: '21cv', sources: ['fipe'] }, 2006, 2024),
  // Ténéré
  ...generateYearVariants({ brand: 'Yamaha', model: 'Ténéré 250', trim: 'ABS', engineCode: 'OHC', engineName: '250cc', displacementCc: 249, fuel: 'flex', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '21cv', sources: ['fipe'] }, 2011, 2024),
  ...generateYearVariants({ brand: 'Yamaha', model: 'Ténéré 700', trim: 'ABS', engineCode: 'DOHC', engineName: '700cc', displacementCc: 689, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '73cv', sources: ['fipe'] }, 2020, 2024),
  // MT Series
  ...generateYearVariants({ brand: 'Yamaha', model: 'MT-03', trim: 'ABS', engineCode: 'DOHC', engineName: '321cc', displacementCc: 321, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '42cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Yamaha', model: 'MT-07', trim: 'ABS', engineCode: 'DOHC', engineName: '689cc', displacementCc: 689, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '75cv', sources: ['fipe'] }, 2015, 2024),
  ...generateYearVariants({ brand: 'Yamaha', model: 'MT-09', trim: 'ABS', engineCode: 'DOHC', engineName: '890cc', displacementCc: 890, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '119cv', sources: ['fipe'] }, 2015, 2024),
  ...generateYearVariants({ brand: 'Yamaha', model: 'MT-10', trim: 'ABS', engineCode: 'DOHC', engineName: '998cc', displacementCc: 998, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '166cv', sources: ['fipe'] }, 2022, 2024),
  // YZF-R Series
  ...generateYearVariants({ brand: 'Yamaha', model: 'YZF-R3', trim: 'ABS', engineCode: 'DOHC', engineName: '321cc', displacementCc: 321, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '42cv', sources: ['fipe'] }, 2015, 2024),
  ...generateYearVariants({ brand: 'Yamaha', model: 'YZF-R6', trim: 'ABS', engineCode: 'DOHC', engineName: '599cc', displacementCc: 599, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '118cv', sources: ['fipe'] }, 2006, 2021),
  ...generateYearVariants({ brand: 'Yamaha', model: 'YZF-R7', trim: 'ABS', engineCode: 'DOHC', engineName: '689cc', displacementCc: 689, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '73cv', sources: ['fipe'] }, 2022, 2024),
  ...generateYearVariants({ brand: 'Yamaha', model: 'YZF-R1', trim: 'ABS', engineCode: 'DOHC', engineName: '998cc', displacementCc: 998, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '200cv', sources: ['fipe'] }, 2009, 2024),
  // NMAX
  ...generateYearVariants({ brand: 'Yamaha', model: 'NMAX 160', trim: 'ABS', engineCode: 'Blue Core', engineName: '160cc', displacementCc: 155, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '15cv', sources: ['fipe'] }, 2016, 2024),
  // XMAX
  ...generateYearVariants({ brand: 'Yamaha', model: 'XMAX 250', trim: 'ABS', engineCode: 'Blue Core', engineName: '250cc', displacementCc: 249, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '23cv', sources: ['fipe'] }, 2018, 2024),
  // Neo
  ...generateYearVariants({ brand: 'Yamaha', model: 'Neo 125', trim: 'UBS', engineCode: 'Blue Core', engineName: '125cc', displacementCc: 125, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '10cv', sources: ['fipe'] }, 2016, 2024),
  // Tracer
  ...generateYearVariants({ brand: 'Yamaha', model: 'Tracer 900 GT', trim: 'ABS', engineCode: 'DOHC', engineName: '847cc', displacementCc: 847, fuel: 'gasoline', transmission: 'manual', bodyType: 'touring', vehicleType: 'motorcycle', power: '115cv', sources: ['fipe'] }, 2019, 2024),
  // === XJ6 - MODELO ICÔNICO ===
  ...generateYearVariants({ brand: 'Yamaha', model: 'XJ6 N', trim: 'ABS', engineCode: 'DOHC', engineName: '600cc', displacementCc: 600, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '78cv', sources: ['fipe'] }, 2009, 2018),
  ...generateYearVariants({ brand: 'Yamaha', model: 'XJ6 F', trim: 'ABS', engineCode: 'DOHC', engineName: '600cc', displacementCc: 600, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '78cv', sources: ['fipe'] }, 2009, 2018),
  ...generateYearVariants({ brand: 'Yamaha', model: 'XJ6 SP', trim: 'ABS', engineCode: 'DOHC', engineName: '600cc', displacementCc: 600, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '78cv', sources: ['fipe'] }, 2013, 2018),
  // FZ Series
  ...generateYearVariants({ brand: 'Yamaha', model: 'FZ6 N', trim: 'ABS', engineCode: 'DOHC', engineName: '600cc', displacementCc: 600, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '98cv', sources: ['fipe'] }, 2004, 2010),
  ...generateYearVariants({ brand: 'Yamaha', model: 'FZ6 S', trim: 'ABS', engineCode: 'DOHC', engineName: '600cc', displacementCc: 600, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '98cv', sources: ['fipe'] }, 2004, 2010),
  ...generateYearVariants({ brand: 'Yamaha', model: 'FZ1 N', trim: 'ABS', engineCode: 'DOHC', engineName: '998cc', displacementCc: 998, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '150cv', sources: ['fipe'] }, 2006, 2015),
  ...generateYearVariants({ brand: 'Yamaha', model: 'FZ1 S', trim: 'ABS', engineCode: 'DOHC', engineName: '998cc', displacementCc: 998, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '150cv', sources: ['fipe'] }, 2006, 2015),
  // Virago / Drag Star
  ...generateYearVariants({ brand: 'Yamaha', model: 'Virago 250', trim: 'Base', engineCode: 'SOHC', engineName: '249cc', displacementCc: 249, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '21cv', sources: ['fipe'] }, 1995, 2008),
  ...generateYearVariants({ brand: 'Yamaha', model: 'Drag Star 650', trim: 'Classic', engineCode: 'SOHC', engineName: '649cc', displacementCc: 649, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '40cv', sources: ['fipe'] }, 1998, 2016),
  ...generateYearVariants({ brand: 'Yamaha', model: 'Drag Star 1100', trim: 'Classic', engineCode: 'SOHC', engineName: '1063cc', displacementCc: 1063, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '62cv', sources: ['fipe'] }, 1999, 2007),
  // Midnight Star
  ...generateYearVariants({ brand: 'Yamaha', model: 'Midnight Star 950', trim: 'Base', engineCode: 'SOHC', engineName: '942cc', displacementCc: 942, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '54cv', sources: ['fipe'] }, 2009, 2016),
  // Super Ténéré
  ...generateYearVariants({ brand: 'Yamaha', model: 'Super Ténéré 1200', trim: 'ABS', engineCode: 'DOHC', engineName: '1199cc', displacementCc: 1199, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '112cv', sources: ['fipe'] }, 2011, 2020),
  // TDM
  ...generateYearVariants({ brand: 'Yamaha', model: 'TDM 900', trim: 'ABS', engineCode: 'DOHC', engineName: '897cc', displacementCc: 897, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '86cv', sources: ['fipe'] }, 2002, 2013),
  // YBR
  ...generateYearVariants({ brand: 'Yamaha', model: 'YBR 125', trim: 'Factor', engineCode: 'OHC', engineName: '125cc', displacementCc: 125, fuel: 'flex', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '11cv', sources: ['fipe'] }, 2000, 2016),
  // Fluo
  ...generateYearVariants({ brand: 'Yamaha', model: 'Fluo 125', trim: 'Base', engineCode: 'OHC', engineName: '125cc', displacementCc: 125, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '10cv', sources: ['fipe'] }, 2016, 2020),
];

// ============================================================================
// MOTOS - KAWASAKI
// ============================================================================
const KAWASAKI_MOTOS_VARIANTS: VehicleVariant[] = [
  // Ninja Series
  ...generateYearVariants({ brand: 'Kawasaki', model: 'Ninja 300', trim: 'ABS', engineCode: 'DOHC', engineName: '296cc', displacementCc: 296, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '39cv', sources: ['fipe'] }, 2013, 2024),
  ...generateYearVariants({ brand: 'Kawasaki', model: 'Ninja 400', trim: 'ABS', engineCode: 'DOHC', engineName: '399cc', displacementCc: 399, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '49cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Kawasaki', model: 'Ninja 650', trim: 'ABS', engineCode: 'DOHC', engineName: '649cc', displacementCc: 649, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '68cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Kawasaki', model: 'Ninja 1000SX', trim: 'ABS', engineCode: 'DOHC', engineName: '1043cc', displacementCc: 1043, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '142cv', sources: ['fipe'] }, 2020, 2024),
  ...generateYearVariants({ brand: 'Kawasaki', model: 'Ninja ZX-6R', trim: 'ABS', engineCode: 'DOHC', engineName: '636cc', displacementCc: 636, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '130cv', sources: ['fipe'] }, 2013, 2024),
  ...generateYearVariants({ brand: 'Kawasaki', model: 'Ninja ZX-10R', trim: 'ABS', engineCode: 'DOHC', engineName: '998cc', displacementCc: 998, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '203cv', sources: ['fipe'] }, 2011, 2024),
  ...generateYearVariants({ brand: 'Kawasaki', model: 'Ninja H2', trim: 'ABS', engineCode: 'DOHC', engineName: '998cc', displacementCc: 998, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '231cv', sources: ['fipe'] }, 2015, 2024),
  // Z Series
  ...generateYearVariants({ brand: 'Kawasaki', model: 'Z300', trim: 'ABS', engineCode: 'DOHC', engineName: '296cc', displacementCc: 296, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '39cv', sources: ['fipe'] }, 2015, 2019),
  ...generateYearVariants({ brand: 'Kawasaki', model: 'Z400', trim: 'ABS', engineCode: 'DOHC', engineName: '399cc', displacementCc: 399, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '49cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'Kawasaki', model: 'Z650', trim: 'ABS', engineCode: 'DOHC', engineName: '649cc', displacementCc: 649, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '68cv', sources: ['fipe'] }, 2017, 2024),
  ...generateYearVariants({ brand: 'Kawasaki', model: 'Z900', trim: 'ABS', engineCode: 'DOHC', engineName: '948cc', displacementCc: 948, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '125cv', sources: ['fipe'] }, 2017, 2024),
  ...generateYearVariants({ brand: 'Kawasaki', model: 'Z1000', trim: 'ABS', engineCode: 'DOHC', engineName: '1043cc', displacementCc: 1043, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '142cv', sources: ['fipe'] }, 2010, 2020),
  // Versys
  ...generateYearVariants({ brand: 'Kawasaki', model: 'Versys 650', trim: 'ABS', engineCode: 'DOHC', engineName: '649cc', displacementCc: 649, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '68cv', sources: ['fipe'] }, 2010, 2024),
  ...generateYearVariants({ brand: 'Kawasaki', model: 'Versys 1000', trim: 'ABS', engineCode: 'DOHC', engineName: '1043cc', displacementCc: 1043, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '120cv', sources: ['fipe'] }, 2012, 2024),
  // Vulcan
  ...generateYearVariants({ brand: 'Kawasaki', model: 'Vulcan S', trim: 'ABS', engineCode: 'DOHC', engineName: '649cc', displacementCc: 649, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '61cv', sources: ['fipe'] }, 2015, 2024),
];

// ============================================================================
// MOTOS - BMW
// ============================================================================
const BMW_MOTOS_VARIANTS: VehicleVariant[] = [
  // G Series
  ...generateYearVariants({ brand: 'BMW', model: 'G 310 R', trim: 'ABS', engineCode: 'DOHC', engineName: '313cc', displacementCc: 313, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '34cv', sources: ['fipe'] }, 2017, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'G 310 GS', trim: 'ABS', engineCode: 'DOHC', engineName: '313cc', displacementCc: 313, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '34cv', sources: ['fipe'] }, 2017, 2024),
  // F Series
  ...generateYearVariants({ brand: 'BMW', model: 'F 750 GS', trim: 'ABS', engineCode: 'DOHC', engineName: '853cc', displacementCc: 853, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '77cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'F 850 GS', trim: 'ABS', engineCode: 'DOHC', engineName: '853cc', displacementCc: 853, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '95cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'F 900 R', trim: 'ABS', engineCode: 'DOHC', engineName: '895cc', displacementCc: 895, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '105cv', sources: ['fipe'] }, 2020, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'F 900 XR', trim: 'ABS', engineCode: 'DOHC', engineName: '895cc', displacementCc: 895, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '105cv', sources: ['fipe'] }, 2020, 2024),
  // R Series
  ...generateYearVariants({ brand: 'BMW', model: 'R 1250 GS', trim: 'ABS', engineCode: 'Boxer', engineName: '1254cc', displacementCc: 1254, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '136cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'R 1250 GS Adventure', trim: 'ABS', engineCode: 'Boxer', engineName: '1254cc', displacementCc: 1254, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '136cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'R 1250 RT', trim: 'ABS', engineCode: 'Boxer', engineName: '1254cc', displacementCc: 1254, fuel: 'gasoline', transmission: 'manual', bodyType: 'touring', vehicleType: 'motorcycle', power: '136cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'R nineT', trim: 'ABS', engineCode: 'Boxer', engineName: '1170cc', displacementCc: 1170, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '110cv', sources: ['fipe'] }, 2014, 2024),
  // S Series
  ...generateYearVariants({ brand: 'BMW', model: 'S 1000 R', trim: 'ABS', engineCode: 'DOHC', engineName: '999cc', displacementCc: 999, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '165cv', sources: ['fipe'] }, 2014, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'S 1000 RR', trim: 'ABS', engineCode: 'DOHC', engineName: '999cc', displacementCc: 999, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '207cv', sources: ['fipe'] }, 2010, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'S 1000 XR', trim: 'ABS', engineCode: 'DOHC', engineName: '999cc', displacementCc: 999, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '165cv', sources: ['fipe'] }, 2015, 2024),
  // K Series
  ...generateYearVariants({ brand: 'BMW', model: 'K 1600 GT', trim: 'ABS', engineCode: 'DOHC', engineName: '1649cc', displacementCc: 1649, fuel: 'gasoline', transmission: 'manual', bodyType: 'touring', vehicleType: 'motorcycle', power: '160cv', sources: ['fipe'] }, 2011, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'K 1600 GTL', trim: 'ABS', engineCode: 'DOHC', engineName: '1649cc', displacementCc: 1649, fuel: 'gasoline', transmission: 'manual', bodyType: 'touring', vehicleType: 'motorcycle', power: '160cv', sources: ['fipe'] }, 2011, 2024),
  // === F800 - MODELOS ICÔNICOS ===
  ...generateYearVariants({ brand: 'BMW', model: 'F 800 R', trim: 'ABS', engineCode: 'DOHC', engineName: '798cc', displacementCc: 798, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '90cv', sources: ['fipe'] }, 2009, 2019),
  ...generateYearVariants({ brand: 'BMW', model: 'F 800 GS', trim: 'ABS', engineCode: 'DOHC', engineName: '798cc', displacementCc: 798, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '85cv', sources: ['fipe'] }, 2008, 2018),
  ...generateYearVariants({ brand: 'BMW', model: 'F 800 GS Adventure', trim: 'ABS', engineCode: 'DOHC', engineName: '798cc', displacementCc: 798, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '85cv', sources: ['fipe'] }, 2013, 2018),
  ...generateYearVariants({ brand: 'BMW', model: 'F 800 GT', trim: 'ABS', engineCode: 'DOHC', engineName: '798cc', displacementCc: 798, fuel: 'gasoline', transmission: 'manual', bodyType: 'touring', vehicleType: 'motorcycle', power: '90cv', sources: ['fipe'] }, 2013, 2020),
  ...generateYearVariants({ brand: 'BMW', model: 'F 800 S', trim: 'ABS', engineCode: 'DOHC', engineName: '798cc', displacementCc: 798, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '85cv', sources: ['fipe'] }, 2006, 2010),
  ...generateYearVariants({ brand: 'BMW', model: 'F 800 ST', trim: 'ABS', engineCode: 'DOHC', engineName: '798cc', displacementCc: 798, fuel: 'gasoline', transmission: 'manual', bodyType: 'touring', vehicleType: 'motorcycle', power: '85cv', sources: ['fipe'] }, 2006, 2012),
  // F 650 Series
  ...generateYearVariants({ brand: 'BMW', model: 'F 650 GS', trim: 'ABS', engineCode: 'DOHC', engineName: '652cc', displacementCc: 652, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '50cv', sources: ['fipe'] }, 2000, 2012),
  ...generateYearVariants({ brand: 'BMW', model: 'F 650 CS', trim: 'ABS', engineCode: 'DOHC', engineName: '652cc', displacementCc: 652, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '50cv', sources: ['fipe'] }, 2002, 2005),
  // R 1200 Series (anteriores ao 1250)
  ...generateYearVariants({ brand: 'BMW', model: 'R 1200 GS', trim: 'ABS', engineCode: 'Boxer', engineName: '1170cc', displacementCc: 1170, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '125cv', sources: ['fipe'] }, 2004, 2018),
  ...generateYearVariants({ brand: 'BMW', model: 'R 1200 GS Adventure', trim: 'ABS', engineCode: 'Boxer', engineName: '1170cc', displacementCc: 1170, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '125cv', sources: ['fipe'] }, 2006, 2018),
  ...generateYearVariants({ brand: 'BMW', model: 'R 1200 RT', trim: 'ABS', engineCode: 'Boxer', engineName: '1170cc', displacementCc: 1170, fuel: 'gasoline', transmission: 'manual', bodyType: 'touring', vehicleType: 'motorcycle', power: '125cv', sources: ['fipe'] }, 2005, 2018),
  ...generateYearVariants({ brand: 'BMW', model: 'R 1200 R', trim: 'ABS', engineCode: 'Boxer', engineName: '1170cc', displacementCc: 1170, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '125cv', sources: ['fipe'] }, 2006, 2018),
  ...generateYearVariants({ brand: 'BMW', model: 'R 1200 RS', trim: 'ABS', engineCode: 'Boxer', engineName: '1170cc', displacementCc: 1170, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '125cv', sources: ['fipe'] }, 2015, 2018),
  // HP Series
  ...generateYearVariants({ brand: 'BMW', model: 'HP4', trim: 'Race', engineCode: 'DOHC', engineName: '999cc', displacementCc: 999, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '215cv', sources: ['fipe'] }, 2013, 2014),
  // C Series (Scooters)
  ...generateYearVariants({ brand: 'BMW', model: 'C 400 X', trim: 'ABS', engineCode: 'SOHC', engineName: '350cc', displacementCc: 350, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '34cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'C 400 GT', trim: 'ABS', engineCode: 'SOHC', engineName: '350cc', displacementCc: 350, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '34cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'BMW', model: 'C 650 Sport', trim: 'ABS', engineCode: 'DOHC', engineName: '647cc', displacementCc: 647, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '60cv', sources: ['fipe'] }, 2012, 2020),
  ...generateYearVariants({ brand: 'BMW', model: 'C 650 GT', trim: 'ABS', engineCode: 'DOHC', engineName: '647cc', displacementCc: 647, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '60cv', sources: ['fipe'] }, 2012, 2020),
];


// ============================================================================
// MOTOS - DUCATI
// ============================================================================
const DUCATI_MOTOS_VARIANTS: VehicleVariant[] = [
  // Monster
  ...generateYearVariants({ brand: 'Ducati', model: 'Monster 797', trim: 'ABS', engineCode: 'Desmo', engineName: '803cc', displacementCc: 803, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '73cv', sources: ['fipe'] }, 2017, 2020),
  ...generateYearVariants({ brand: 'Ducati', model: 'Monster 821', trim: 'ABS', engineCode: 'Desmo', engineName: '821cc', displacementCc: 821, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '109cv', sources: ['fipe'] }, 2014, 2021),
  ...generateYearVariants({ brand: 'Ducati', model: 'Monster 937', trim: 'ABS', engineCode: 'Desmo', engineName: '937cc', displacementCc: 937, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '111cv', sources: ['fipe'] }, 2021, 2024),
  ...generateYearVariants({ brand: 'Ducati', model: 'Monster 1200', trim: 'ABS', engineCode: 'Desmo', engineName: '1198cc', displacementCc: 1198, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '147cv', sources: ['fipe'] }, 2014, 2021),
  // Panigale
  ...generateYearVariants({ brand: 'Ducati', model: 'Panigale V2', trim: 'ABS', engineCode: 'Superquadro', engineName: '955cc', displacementCc: 955, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '155cv', sources: ['fipe'] }, 2020, 2024),
  ...generateYearVariants({ brand: 'Ducati', model: 'Panigale V4', trim: 'ABS', engineCode: 'Desmosedici', engineName: '1103cc', displacementCc: 1103, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '214cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Ducati', model: 'Panigale V4 S', trim: 'ABS', engineCode: 'Desmosedici', engineName: '1103cc', displacementCc: 1103, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '214cv', sources: ['fipe'] }, 2018, 2024),
  // Multistrada
  ...generateYearVariants({ brand: 'Ducati', model: 'Multistrada 950', trim: 'ABS', engineCode: 'Testastretta', engineName: '937cc', displacementCc: 937, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '113cv', sources: ['fipe'] }, 2017, 2024),
  ...generateYearVariants({ brand: 'Ducati', model: 'Multistrada V4', trim: 'ABS', engineCode: 'V4 Granturismo', engineName: '1158cc', displacementCc: 1158, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '170cv', sources: ['fipe'] }, 2021, 2024),
  // Scrambler
  ...generateYearVariants({ brand: 'Ducati', model: 'Scrambler Icon', trim: 'ABS', engineCode: 'Desmo', engineName: '803cc', displacementCc: 803, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '73cv', sources: ['fipe'] }, 2015, 2024),
  ...generateYearVariants({ brand: 'Ducati', model: 'Scrambler 1100', trim: 'ABS', engineCode: 'Desmo', engineName: '1079cc', displacementCc: 1079, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '86cv', sources: ['fipe'] }, 2018, 2024),
  // Diavel
  ...generateYearVariants({ brand: 'Ducati', model: 'Diavel 1260', trim: 'ABS', engineCode: 'Testastretta', engineName: '1262cc', displacementCc: 1262, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '159cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'Ducati', model: 'XDiavel', trim: 'ABS', engineCode: 'Testastretta', engineName: '1262cc', displacementCc: 1262, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '152cv', sources: ['fipe'] }, 2016, 2024),
  // Streetfighter
  ...generateYearVariants({ brand: 'Ducati', model: 'Streetfighter V4', trim: 'ABS', engineCode: 'Desmosedici', engineName: '1103cc', displacementCc: 1103, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '208cv', sources: ['fipe'] }, 2020, 2024),
  // Hypermotard
  ...generateYearVariants({ brand: 'Ducati', model: 'Hypermotard 950', trim: 'ABS', engineCode: 'Testastretta', engineName: '937cc', displacementCc: 937, fuel: 'gasoline', transmission: 'manual', bodyType: 'supermoto', vehicleType: 'motorcycle', power: '114cv', sources: ['fipe'] }, 2019, 2024),
];

// ============================================================================
// MOTOS - HARLEY-DAVIDSON
// ============================================================================
const HARLEY_MOTOS_VARIANTS: VehicleVariant[] = [
  // Sportster
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'Sportster Iron 883', trim: 'ABS', engineCode: 'Evolution', engineName: '883cc', displacementCc: 883, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '50cv', sources: ['fipe'] }, 2009, 2022),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'Sportster 1200', trim: 'ABS', engineCode: 'Evolution', engineName: '1202cc', displacementCc: 1202, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '68cv', sources: ['fipe'] }, 2004, 2022),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'Sportster S', trim: 'ABS', engineCode: 'Revolution Max', engineName: '1252cc', displacementCc: 1252, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '121cv', sources: ['fipe'] }, 2021, 2024),
  // Softail
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'Softail Standard', trim: 'ABS', engineCode: 'Milwaukee-Eight', engineName: '1746cc', displacementCc: 1746, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '93cv', sources: ['fipe'] }, 2020, 2024),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'Fat Boy', trim: 'ABS', engineCode: 'Milwaukee-Eight', engineName: '1868cc', displacementCc: 1868, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '93cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'Breakout', trim: 'ABS', engineCode: 'Milwaukee-Eight', engineName: '1868cc', displacementCc: 1868, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '93cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'Low Rider S', trim: 'ABS', engineCode: 'Milwaukee-Eight', engineName: '1923cc', displacementCc: 1923, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '93cv', sources: ['fipe'] }, 2020, 2024),
  // Touring
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'Street Glide', trim: 'ABS', engineCode: 'Milwaukee-Eight', engineName: '1868cc', displacementCc: 1868, fuel: 'gasoline', transmission: 'manual', bodyType: 'touring', vehicleType: 'motorcycle', power: '93cv', sources: ['fipe'] }, 2017, 2024),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'Road Glide', trim: 'ABS', engineCode: 'Milwaukee-Eight', engineName: '1868cc', displacementCc: 1868, fuel: 'gasoline', transmission: 'manual', bodyType: 'touring', vehicleType: 'motorcycle', power: '93cv', sources: ['fipe'] }, 2017, 2024),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'Road King', trim: 'ABS', engineCode: 'Milwaukee-Eight', engineName: '1868cc', displacementCc: 1868, fuel: 'gasoline', transmission: 'manual', bodyType: 'touring', vehicleType: 'motorcycle', power: '93cv', sources: ['fipe'] }, 2017, 2024),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'Ultra Limited', trim: 'ABS', engineCode: 'Milwaukee-Eight', engineName: '1868cc', displacementCc: 1868, fuel: 'gasoline', transmission: 'manual', bodyType: 'touring', vehicleType: 'motorcycle', power: '93cv', sources: ['fipe'] }, 2017, 2024),
  // Pan America
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'Pan America 1250', trim: 'ABS', engineCode: 'Revolution Max', engineName: '1252cc', displacementCc: 1252, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '150cv', sources: ['fipe'] }, 2021, 2024),
  // LiveWire
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'LiveWire', trim: 'ABS', engineCode: 'Electric', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'naked', vehicleType: 'motorcycle', power: '105cv', sources: ['fipe'] }, 2020, 2024),
];

// ============================================================================
// MOTOS - TRIUMPH
// ============================================================================
const TRIUMPH_MOTOS_VARIANTS: VehicleVariant[] = [
  // Street Triple
  ...generateYearVariants({ brand: 'Triumph', model: 'Street Triple 765 R', trim: 'ABS', engineCode: 'Triple', engineName: '765cc', displacementCc: 765, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '118cv', sources: ['fipe'] }, 2017, 2024),
  ...generateYearVariants({ brand: 'Triumph', model: 'Street Triple 765 RS', trim: 'ABS', engineCode: 'Triple', engineName: '765cc', displacementCc: 765, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '130cv', sources: ['fipe'] }, 2017, 2024),
  // Speed Triple
  ...generateYearVariants({ brand: 'Triumph', model: 'Speed Triple 1200 RS', trim: 'ABS', engineCode: 'Triple', engineName: '1160cc', displacementCc: 1160, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '180cv', sources: ['fipe'] }, 2021, 2024),
  // Tiger
  ...generateYearVariants({ brand: 'Triumph', model: 'Tiger 900', trim: 'ABS', engineCode: 'Triple', engineName: '888cc', displacementCc: 888, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '95cv', sources: ['fipe'] }, 2020, 2024),
  ...generateYearVariants({ brand: 'Triumph', model: 'Tiger 1200', trim: 'ABS', engineCode: 'Triple', engineName: '1160cc', displacementCc: 1160, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '150cv', sources: ['fipe'] }, 2022, 2024),
  // Bonneville
  ...generateYearVariants({ brand: 'Triumph', model: 'Bonneville T100', trim: 'ABS', engineCode: 'Twin', engineName: '900cc', displacementCc: 900, fuel: 'gasoline', transmission: 'manual', bodyType: 'classic', vehicleType: 'motorcycle', power: '65cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Triumph', model: 'Bonneville T120', trim: 'ABS', engineCode: 'Twin', engineName: '1200cc', displacementCc: 1200, fuel: 'gasoline', transmission: 'manual', bodyType: 'classic', vehicleType: 'motorcycle', power: '80cv', sources: ['fipe'] }, 2016, 2024),
  // Scrambler
  ...generateYearVariants({ brand: 'Triumph', model: 'Scrambler 900', trim: 'ABS', engineCode: 'Twin', engineName: '900cc', displacementCc: 900, fuel: 'gasoline', transmission: 'manual', bodyType: 'scrambler', vehicleType: 'motorcycle', power: '65cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'Triumph', model: 'Scrambler 1200', trim: 'ABS', engineCode: 'Twin', engineName: '1200cc', displacementCc: 1200, fuel: 'gasoline', transmission: 'manual', bodyType: 'scrambler', vehicleType: 'motorcycle', power: '90cv', sources: ['fipe'] }, 2019, 2024),
  // Trident
  ...generateYearVariants({ brand: 'Triumph', model: 'Trident 660', trim: 'ABS', engineCode: 'Triple', engineName: '660cc', displacementCc: 660, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '81cv', sources: ['fipe'] }, 2021, 2024),
  // Rocket
  ...generateYearVariants({ brand: 'Triumph', model: 'Rocket 3', trim: 'ABS', engineCode: 'Triple', engineName: '2458cc', displacementCc: 2458, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '167cv', sources: ['fipe'] }, 2020, 2024),
];

// ============================================================================
// MOTOS - SUZUKI
// ============================================================================
const SUZUKI_MOTOS_VARIANTS: VehicleVariant[] = [
  // GSX-R
  ...generateYearVariants({ brand: 'Suzuki', model: 'GSX-R750', trim: 'ABS', engineCode: 'DOHC', engineName: '750cc', displacementCc: 750, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '150cv', sources: ['fipe'] }, 2011, 2024),
  ...generateYearVariants({ brand: 'Suzuki', model: 'GSX-R1000', trim: 'ABS', engineCode: 'DOHC', engineName: '999cc', displacementCc: 999, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '202cv', sources: ['fipe'] }, 2017, 2024),
  // GSX-S
  ...generateYearVariants({ brand: 'Suzuki', model: 'GSX-S750', trim: 'ABS', engineCode: 'DOHC', engineName: '749cc', displacementCc: 749, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '114cv', sources: ['fipe'] }, 2017, 2024),
  ...generateYearVariants({ brand: 'Suzuki', model: 'GSX-S1000', trim: 'ABS', engineCode: 'DOHC', engineName: '999cc', displacementCc: 999, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '152cv', sources: ['fipe'] }, 2015, 2024),
  // V-Strom
  ...generateYearVariants({ brand: 'Suzuki', model: 'V-Strom 650', trim: 'ABS', engineCode: 'DOHC', engineName: '645cc', displacementCc: 645, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '71cv', sources: ['fipe'] }, 2004, 2024),
  ...generateYearVariants({ brand: 'Suzuki', model: 'V-Strom 1050', trim: 'ABS', engineCode: 'DOHC', engineName: '1037cc', displacementCc: 1037, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '107cv', sources: ['fipe'] }, 2020, 2024),
  // Hayabusa
  ...generateYearVariants({ brand: 'Suzuki', model: 'Hayabusa', trim: 'ABS', engineCode: 'DOHC', engineName: '1340cc', displacementCc: 1340, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '190cv', sources: ['fipe'] }, 2008, 2024),
  // Boulevard
  ...generateYearVariants({ brand: 'Suzuki', model: 'Boulevard M1800R', trim: 'ABS', engineCode: 'SOHC', engineName: '1783cc', displacementCc: 1783, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '125cv', sources: ['fipe'] }, 2006, 2024),
  // Burgman
  ...generateYearVariants({ brand: 'Suzuki', model: 'Burgman 400', trim: 'ABS', engineCode: 'DOHC', engineName: '400cc', displacementCc: 400, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '31cv', sources: ['fipe'] }, 2007, 2024),
  ...generateYearVariants({ brand: 'Suzuki', model: 'Burgman 650', trim: 'ABS', engineCode: 'DOHC', engineName: '638cc', displacementCc: 638, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '55cv', sources: ['fipe'] }, 2003, 2024),
];


// ============================================================================
// CAMINHÕES - MERCEDES-BENZ
// ============================================================================
const MERCEDES_TRUCKS_VARIANTS: VehicleVariant[] = [
  // Accelo
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Accelo 815', trim: 'Diesel', engineCode: 'OM924', engineName: '4.8 Diesel', displacementCc: 4800, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '156cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Accelo 1016', trim: 'Diesel', engineCode: 'OM924', engineName: '4.8 Diesel', displacementCc: 4800, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '160cv', sources: ['fipe'] }, 2012, 2024),
  // Atego
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Atego 1419', trim: 'Diesel', engineCode: 'OM924', engineName: '4.8 Diesel', displacementCc: 4800, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '190cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Atego 1726', trim: 'Diesel', engineCode: 'OM926', engineName: '7.2 Diesel', displacementCc: 7200, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '260cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Atego 2426', trim: 'Diesel', engineCode: 'OM926', engineName: '7.2 Diesel', displacementCc: 7200, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '260cv', sources: ['fipe'] }, 2012, 2024),
  // Actros
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Actros 2546', trim: 'Diesel', engineCode: 'OM471', engineName: '12.8 Diesel', displacementCc: 12800, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '460cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Actros 2651', trim: 'Diesel', engineCode: 'OM471', engineName: '12.8 Diesel', displacementCc: 12800, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '510cv', sources: ['fipe'] }, 2018, 2024),
];

// ============================================================================
// CAMINHÕES - SCANIA
// ============================================================================
const SCANIA_TRUCKS_VARIANTS: VehicleVariant[] = [
  // P Series
  ...generateYearVariants({ brand: 'Scania', model: 'P 250', trim: 'Diesel', engineCode: 'DC09', engineName: '9.0 Diesel', displacementCc: 9000, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '250cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Scania', model: 'P 310', trim: 'Diesel', engineCode: 'DC09', engineName: '9.0 Diesel', displacementCc: 9000, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '310cv', sources: ['fipe'] }, 2016, 2024),
  // G Series
  ...generateYearVariants({ brand: 'Scania', model: 'G 410', trim: 'Diesel', engineCode: 'DC13', engineName: '13.0 Diesel', displacementCc: 13000, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '410cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Scania', model: 'G 450', trim: 'Diesel', engineCode: 'DC13', engineName: '13.0 Diesel', displacementCc: 13000, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '450cv', sources: ['fipe'] }, 2016, 2024),
  // R Series
  ...generateYearVariants({ brand: 'Scania', model: 'R 450', trim: 'Diesel', engineCode: 'DC13', engineName: '13.0 Diesel', displacementCc: 13000, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '450cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Scania', model: 'R 500', trim: 'Diesel', engineCode: 'DC13', engineName: '13.0 Diesel', displacementCc: 13000, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '500cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Scania', model: 'R 540', trim: 'Diesel', engineCode: 'DC13', engineName: '13.0 Diesel', displacementCc: 13000, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '540cv', sources: ['fipe'] }, 2016, 2024),
  // S Series
  ...generateYearVariants({ brand: 'Scania', model: 'S 500', trim: 'Diesel', engineCode: 'DC13', engineName: '13.0 Diesel', displacementCc: 13000, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '500cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Scania', model: 'S 620', trim: 'Diesel', engineCode: 'DC16', engineName: '16.4 Diesel', displacementCc: 16400, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '620cv', sources: ['fipe'] }, 2018, 2024),
];


// ============================================================================
// CAMINHÕES - VOLVO
// ============================================================================
const VOLVO_TRUCKS_VARIANTS: VehicleVariant[] = [
  // VM
  ...generateYearVariants({ brand: 'Volvo', model: 'VM 220', trim: 'Diesel', engineCode: 'D8K', engineName: '8.0 Diesel', displacementCc: 8000, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '220cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Volvo', model: 'VM 270', trim: 'Diesel', engineCode: 'D8K', engineName: '8.0 Diesel', displacementCc: 8000, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '270cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Volvo', model: 'VM 330', trim: 'Diesel', engineCode: 'D11K', engineName: '11.0 Diesel', displacementCc: 11000, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '330cv', sources: ['fipe'] }, 2012, 2024),
  // FH
  ...generateYearVariants({ brand: 'Volvo', model: 'FH 460', trim: 'Diesel', engineCode: 'D13K', engineName: '13.0 Diesel', displacementCc: 13000, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '460cv', sources: ['fipe'] }, 2014, 2024),
  ...generateYearVariants({ brand: 'Volvo', model: 'FH 500', trim: 'Diesel', engineCode: 'D13K', engineName: '13.0 Diesel', displacementCc: 13000, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '500cv', sources: ['fipe'] }, 2014, 2024),
  ...generateYearVariants({ brand: 'Volvo', model: 'FH 540', trim: 'Diesel', engineCode: 'D13K', engineName: '13.0 Diesel', displacementCc: 13000, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '540cv', sources: ['fipe'] }, 2014, 2024),
];

// ============================================================================
// CAMINHÕES - IVECO
// ============================================================================
const IVECO_TRUCKS_VARIANTS: VehicleVariant[] = [
  // Daily
  ...generateYearVariants({ brand: 'Iveco', model: 'Daily 35-150', trim: 'Diesel', engineCode: 'F1C', engineName: '3.0 Diesel', displacementCc: 2998, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '150cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Iveco', model: 'Daily 70-170', trim: 'Diesel', engineCode: 'F1C', engineName: '3.0 Diesel', displacementCc: 2998, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '170cv', sources: ['fipe'] }, 2012, 2024),
  // Tector
  ...generateYearVariants({ brand: 'Iveco', model: 'Tector 170E22', trim: 'Diesel', engineCode: 'NEF', engineName: '6.7 Diesel', displacementCc: 6700, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '220cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Iveco', model: 'Tector 240E28', trim: 'Diesel', engineCode: 'NEF', engineName: '6.7 Diesel', displacementCc: 6700, fuel: 'diesel', transmission: 'manual', bodyType: 'truck', vehicleType: 'truck', power: '280cv', sources: ['fipe'] }, 2012, 2024),
  // Stralis
  ...generateYearVariants({ brand: 'Iveco', model: 'Stralis 440', trim: 'Diesel', engineCode: 'Cursor', engineName: '13.0 Diesel', displacementCc: 13000, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '440cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Iveco', model: 'Stralis 480', trim: 'Diesel', engineCode: 'Cursor', engineName: '13.0 Diesel', displacementCc: 13000, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '480cv', sources: ['fipe'] }, 2012, 2024),
  // S-Way
  ...generateYearVariants({ brand: 'Iveco', model: 'S-Way 480', trim: 'Diesel', engineCode: 'Cursor', engineName: '13.0 Diesel', displacementCc: 13000, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '480cv', sources: ['fipe'] }, 2020, 2024),
  ...generateYearVariants({ brand: 'Iveco', model: 'S-Way 570', trim: 'Diesel', engineCode: 'Cursor', engineName: '13.0 Diesel', displacementCc: 13000, fuel: 'diesel', transmission: 'automatic', bodyType: 'truck', vehicleType: 'truck', power: '570cv', sources: ['fipe'] }, 2020, 2024),
];


// ============================================================================
// ÔNIBUS - PRINCIPAIS MARCAS
// ============================================================================
const BUS_VARIANTS: VehicleVariant[] = [
  // Mercedes-Benz Ônibus
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'OF 1721', trim: 'Diesel', engineCode: 'OM926', engineName: '7.2 Diesel', displacementCc: 7200, fuel: 'diesel', transmission: 'manual', bodyType: 'bus', vehicleType: 'bus', power: '210cv', sources: ['fipe'] }, 2010, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'O 500 RS', trim: 'Diesel', engineCode: 'OM457', engineName: '12.0 Diesel', displacementCc: 12000, fuel: 'diesel', transmission: 'automatic', bodyType: 'bus', vehicleType: 'bus', power: '360cv', sources: ['fipe'] }, 2010, 2024),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'O 500 RSD', trim: 'Diesel', engineCode: 'OM457', engineName: '12.0 Diesel', displacementCc: 12000, fuel: 'diesel', transmission: 'automatic', bodyType: 'bus', vehicleType: 'bus', power: '428cv', sources: ['fipe'] }, 2010, 2024),
  // Volkswagen Ônibus
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Volksbus 17.230 OD', trim: 'Diesel', engineCode: 'MWM', engineName: '6.9 Diesel', displacementCc: 6900, fuel: 'diesel', transmission: 'manual', bodyType: 'bus', vehicleType: 'bus', power: '230cv', sources: ['fipe'] }, 2010, 2024),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Volksbus 18.330 OT', trim: 'Diesel', engineCode: 'MAN', engineName: '9.0 Diesel', displacementCc: 9000, fuel: 'diesel', transmission: 'automatic', bodyType: 'bus', vehicleType: 'bus', power: '330cv', sources: ['fipe'] }, 2015, 2024),
  // Scania Ônibus
  ...generateYearVariants({ brand: 'Scania', model: 'K 310', trim: 'Diesel', engineCode: 'DC09', engineName: '9.0 Diesel', displacementCc: 9000, fuel: 'diesel', transmission: 'automatic', bodyType: 'bus', vehicleType: 'bus', power: '310cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Scania', model: 'K 360', trim: 'Diesel', engineCode: 'DC09', engineName: '9.0 Diesel', displacementCc: 9000, fuel: 'diesel', transmission: 'automatic', bodyType: 'bus', vehicleType: 'bus', power: '360cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Scania', model: 'K 400', trim: 'Diesel', engineCode: 'DC13', engineName: '13.0 Diesel', displacementCc: 13000, fuel: 'diesel', transmission: 'automatic', bodyType: 'bus', vehicleType: 'bus', power: '400cv', sources: ['fipe'] }, 2012, 2024),
  // Volvo Ônibus
  ...generateYearVariants({ brand: 'Volvo', model: 'B270F', trim: 'Diesel', engineCode: 'D8K', engineName: '8.0 Diesel', displacementCc: 8000, fuel: 'diesel', transmission: 'automatic', bodyType: 'bus', vehicleType: 'bus', power: '270cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Volvo', model: 'B340R', trim: 'Diesel', engineCode: 'D11K', engineName: '11.0 Diesel', displacementCc: 11000, fuel: 'diesel', transmission: 'automatic', bodyType: 'bus', vehicleType: 'bus', power: '340cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Volvo', model: 'B420R', trim: 'Diesel', engineCode: 'D13K', engineName: '13.0 Diesel', displacementCc: 13000, fuel: 'diesel', transmission: 'automatic', bodyType: 'bus', vehicleType: 'bus', power: '420cv', sources: ['fipe'] }, 2012, 2024),
  // Marcopolo (Carrocerias)
  ...generateYearVariants({ brand: 'Marcopolo', model: 'Paradiso G7 1200', trim: 'Rodoviário', engineCode: 'Chassis', engineName: 'Rodoviário', displacementCc: 0, fuel: 'diesel', transmission: 'automatic', bodyType: 'bus', vehicleType: 'bus', power: '0cv', sources: ['fipe'] }, 2010, 2024),
  ...generateYearVariants({ brand: 'Marcopolo', model: 'Paradiso G7 1600 LD', trim: 'Rodoviário', engineCode: 'Chassis', engineName: 'Rodoviário', displacementCc: 0, fuel: 'diesel', transmission: 'automatic', bodyType: 'bus', vehicleType: 'bus', power: '0cv', sources: ['fipe'] }, 2010, 2024),
  ...generateYearVariants({ brand: 'Marcopolo', model: 'Viale BRT', trim: 'Urbano', engineCode: 'Chassis', engineName: 'Urbano', displacementCc: 0, fuel: 'diesel', transmission: 'automatic', bodyType: 'bus', vehicleType: 'bus', power: '0cv', sources: ['fipe'] }, 2012, 2024),
];


// ============================================================================
// BRAND LOGOS - URLs dos logos das marcas
// ============================================================================
export const BRAND_LOGOS: Record<string, string> = {
  // Carros Nacionais/Populares
  'Volkswagen': 'https://www.carlogos.org/car-logos/volkswagen-logo.png',
  'Chevrolet': 'https://www.carlogos.org/car-logos/chevrolet-logo.png',
  'Fiat': 'https://www.carlogos.org/car-logos/fiat-logo.png',
  'Ford': 'https://www.carlogos.org/car-logos/ford-logo.png',
  'Toyota': 'https://www.carlogos.org/car-logos/toyota-logo.png',
  'Honda': 'https://www.carlogos.org/car-logos/honda-logo.png',
  'Hyundai': 'https://www.carlogos.org/car-logos/hyundai-logo.png',
  'KIA': 'https://www.carlogos.org/car-logos/kia-logo.png',
  'Renault': 'https://www.carlogos.org/car-logos/renault-logo.png',
  'Nissan': 'https://www.carlogos.org/car-logos/nissan-logo.png',
  'Jeep': 'https://www.carlogos.org/car-logos/jeep-logo.png',
  'Peugeot': 'https://www.carlogos.org/car-logos/peugeot-logo.png',
  'Citroën': 'https://www.carlogos.org/car-logos/citroen-logo.png',
  'Mitsubishi': 'https://www.carlogos.org/car-logos/mitsubishi-logo.png',
  'Suzuki': 'https://www.carlogos.org/car-logos/suzuki-logo.png',
  // Premium
  'BMW': 'https://www.carlogos.org/car-logos/bmw-logo.png',
  'Audi': 'https://www.carlogos.org/car-logos/audi-logo.png',
  'Mercedes-Benz': 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png',
  'Porsche': 'https://www.carlogos.org/car-logos/porsche-logo.png',
  // Motos
  'Yamaha': 'https://www.carlogos.org/car-logos/yamaha-logo.png',
  'Kawasaki': 'https://www.carlogos.org/car-logos/kawasaki-logo.png',
  'Ducati': 'https://www.carlogos.org/car-logos/ducati-logo.png',
  'Harley-Davidson': 'https://www.carlogos.org/car-logos/harley-davidson-logo.png',
  'Triumph': 'https://www.carlogos.org/car-logos/triumph-logo.png',
  // Caminhões
  'Scania': 'https://www.carlogos.org/car-logos/scania-logo.png',
  'Volvo': 'https://www.carlogos.org/car-logos/volvo-logo.png',
  'Iveco': 'https://www.carlogos.org/car-logos/iveco-logo.png',
  // Ônibus
  'Marcopolo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Marcopolo_logo.svg/200px-Marcopolo_logo.svg.png',
};


// ============================================================================
// CONSOLIDAÇÃO E EXPORTAÇÕES
// ============================================================================

// Combina todas as variantes em um único array
export const BRAZILIAN_VEHICLES_DATABASE: VehicleVariant[] = [
  ...VW_VARIANTS,
  ...CHEVROLET_VARIANTS,
  ...FIAT_VARIANTS,
  ...FORD_VARIANTS,
  ...TOYOTA_VARIANTS,
  ...HONDA_VARIANTS,
  ...HYUNDAI_VARIANTS,
  ...KIA_VARIANTS,
  ...RENAULT_VARIANTS,
  ...NISSAN_VARIANTS,
  ...JEEP_VARIANTS,
  ...PEUGEOT_VARIANTS,
  ...CITROEN_VARIANTS,
  ...MITSUBISHI_VARIANTS,
  ...SUZUKI_VARIANTS,
  ...BMW_VARIANTS,
  ...AUDI_VARIANTS,
  ...MERCEDES_VARIANTS,
  ...PORSCHE_VARIANTS,
  ...HONDA_MOTOS_VARIANTS,
  ...YAMAHA_MOTOS_VARIANTS,
  ...KAWASAKI_MOTOS_VARIANTS,
  ...BMW_MOTOS_VARIANTS,
  ...DUCATI_MOTOS_VARIANTS,
  ...HARLEY_MOTOS_VARIANTS,
  ...TRIUMPH_MOTOS_VARIANTS,
  ...SUZUKI_MOTOS_VARIANTS,
  ...MERCEDES_TRUCKS_VARIANTS,
  ...SCANIA_TRUCKS_VARIANTS,
  ...VOLVO_TRUCKS_VARIANTS,
  ...IVECO_TRUCKS_VARIANTS,
  ...BUS_VARIANTS,
];

// Índice por marca para busca rápida
export const VEHICLES_BY_BRAND: Record<string, VehicleVariant[]> = 
  BRAZILIAN_VEHICLES_DATABASE.reduce((acc, vehicle) => {
    if (!acc[vehicle.brand]) {
      acc[vehicle.brand] = [];
    }
    acc[vehicle.brand].push(vehicle);
    return acc;
  }, {} as Record<string, VehicleVariant[]>);

// Lista de marcas disponíveis
export const AVAILABLE_BRANDS = Object.keys(VEHICLES_BY_BRAND).sort();

// Total de variantes na base
export const TOTAL_VARIANTS = BRAZILIAN_VEHICLES_DATABASE.length;
