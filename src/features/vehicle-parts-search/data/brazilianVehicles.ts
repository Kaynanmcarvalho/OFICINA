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

// ============================================================================
// VEÍCULOS ADICIONADOS VIA FIPE SYNC
// Data: 2025-12-10T12:24:25.838Z
// ============================================================================
const FIPE_SYNC_VARIANTS: VehicleVariant[] = [
  // Audi
  ...generateYearVariants({ brand: 'Audi', model: '80', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1996),
  ...generateYearVariants({ brand: 'Audi', model: '100', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1995),
  ...generateYearVariants({ brand: 'Audi', model: 'Rio', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2019),
  // BMW
  ...generateYearVariants({ brand: 'BMW', model: '316', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1986, 1995),
  ...generateYearVariants({ brand: 'BMW', model: '116iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2015),
  ...generateYearVariants({ brand: 'BMW', model: '118i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'BMW', model: '118iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2014),
  ...generateYearVariants({ brand: 'BMW', model: '118iA/', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2015),
  ...generateYearVariants({ brand: 'BMW', model: '120i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2009),
  ...generateYearVariants({ brand: 'BMW', model: '120iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2019),
  ...generateYearVariants({ brand: 'BMW', model: 'Rio', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2012),
  ...generateYearVariants({ brand: 'BMW', model: '125i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2019),
  ...generateYearVariants({ brand: 'BMW', model: '130i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2009),
  ...generateYearVariants({ brand: 'BMW', model: '130iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2012),
  ...generateYearVariants({ brand: 'BMW', model: '135iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2012),
  ...generateYearVariants({ brand: 'BMW', model: '218i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'BMW', model: '220i', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2018),
  ...generateYearVariants({ brand: 'BMW', model: '225i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2016),
  ...generateYearVariants({ brand: 'BMW', model: '316i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2015),
  ...generateYearVariants({ brand: 'BMW', model: '318i/iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1998),
  ...generateYearVariants({ brand: 'BMW', model: '318iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2012),
  ...generateYearVariants({ brand: 'BMW', model: '318iS/ISA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1998),
  ...generateYearVariants({ brand: 'BMW', model: '318Ti', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1998),
  ...generateYearVariants({ brand: 'BMW', model: '318Ti/TiA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1999),
  ...generateYearVariants({ brand: 'BMW', model: '320i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 2007),
  ...generateYearVariants({ brand: 'BMW', model: '320iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 2025),
  ...generateYearVariants({ brand: 'BMW', model: '323Ci', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2000),
  ...generateYearVariants({ brand: 'BMW', model: '323CiA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2000),
  ...generateYearVariants({ brand: 'BMW', model: '323i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2001),
  ...generateYearVariants({ brand: 'BMW', model: 'Touring', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2000),
  ...generateYearVariants({ brand: 'BMW', model: '323i/iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2000),
  ...generateYearVariants({ brand: 'BMW', model: '323iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2002),
  ...generateYearVariants({ brand: 'BMW', model: '323Ti', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2000),
  // Fiat
  ...generateYearVariants({ brand: 'Fiat', model: 'Brava', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2003),
  ...generateYearVariants({ brand: 'Fiat', model: 'Cinquecento', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1995),
  ...generateYearVariants({ brand: 'Fiat', model: 'Coupe', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1997),
  // Ford
  ...generateYearVariants({ brand: 'Ford', model: 'Aerostar', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 1995),
  ...generateYearVariants({ brand: 'Ford', model: 'Aspire', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1995),
  ...generateYearVariants({ brand: 'Ford', model: 'Club', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1996),
  ...generateYearVariants({ brand: 'Ford', model: 'Contour', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1995),
  ...generateYearVariants({ brand: 'Ford', model: 'Crown', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1992),
  // Chevrolet
  ...generateYearVariants({ brand: 'Chevrolet', model: 'A-10', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1989),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'A-20', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1996),
  // Hyundai
  ...generateYearVariants({ brand: 'Hyundai', model: 'GLS', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2003),
  ...generateYearVariants({ brand: 'Hyundai', model: 'Accent', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1998),
  ...generateYearVariants({ brand: 'Hyundai', model: 'Atos', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2001),
  ...generateYearVariants({ brand: 'Hyundai', model: 'Coupe', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2003),
  ...generateYearVariants({ brand: 'Hyundai', model: 'Pulse', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2020),
  ...generateYearVariants({ brand: 'Hyundai', model: 'Cupê', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1998),
  ...generateYearVariants({ brand: 'Hyundai', model: 'EQUUS', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2013),
  // KIA
  ...generateYearVariants({ brand: 'KIA', model: '500', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2025),
  ...generateYearVariants({ brand: 'KIA', model: 'Besta', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2005),
  ...generateYearVariants({ brand: 'KIA', model: 'X2', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2012),
  ...generateYearVariants({ brand: 'KIA', model: 'X4', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2013),
  ...generateYearVariants({ brand: 'KIA', model: 'Z', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2017),
  ...generateYearVariants({ brand: 'KIA', model: 'Carens', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2013),
  ...generateYearVariants({ brand: 'KIA', model: 'Ceres', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1996),
  ...generateYearVariants({ brand: 'KIA', model: 'CLA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2000),
  ...generateYearVariants({ brand: 'KIA', model: 'Magentis', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2011),
  ...generateYearVariants({ brand: 'KIA', model: 'Niro', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'KIA', model: 'Opirus', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2009),
  ...generateYearVariants({ brand: 'KIA', model: 'OPTIMA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2016),
  // Mercedes-Benz
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '180-D', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1996),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '190-E', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1993),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '230-E', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1988, 1993),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '260-E', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1993),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '300-D', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1992),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '300-E', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1993),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '300-SE', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1993),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '300-SL', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1993),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '300-TE', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1995),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '560-SEL', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1987, 1992),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'ADV', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2022),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'NC', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2019),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'A-35', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'A3', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2020),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'CG', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2025),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'C-180', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2017),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'C-200', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2025),
  // Mitsubishi
  ...generateYearVariants({ brand: 'Mitsubishi', model: '3000', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1998),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'X4', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2003, 2008),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'Colt', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1997),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'Diamant', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1993),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'GSX', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1995),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'Expo', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1997),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'Galant', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2005),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'GRANDIS', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2008),
  // Nissan
  ...generateYearVariants({ brand: 'Nissan', model: 'Altima', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1995),
  ...generateYearVariants({ brand: 'Nissan', model: 'ALTIMA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2014),
  ...generateYearVariants({ brand: 'Nissan', model: 'AX', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1996),
  ...generateYearVariants({ brand: 'Nissan', model: 'X2', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1997),
  ...generateYearVariants({ brand: 'Nissan', model: 'Infinit', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1992),
  // Renault
  ...generateYearVariants({ brand: 'Renault', model: '19', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1999),
  ...generateYearVariants({ brand: 'Renault', model: '21', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1994),
  // Suzuki
  ...generateYearVariants({ brand: 'Suzuki', model: 'Baleno', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2000),
  ...generateYearVariants({ brand: 'Suzuki', model: 'Gol', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2002),
  ...generateYearVariants({ brand: 'Suzuki', model: 'Ignis', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2003, 2003),
  ...generateYearVariants({ brand: 'Suzuki', model: 'Samurai', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1999),
  ...generateYearVariants({ brand: 'Suzuki', model: 'Sidekick', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1996),
  // Toyota
  ...generateYearVariants({ brand: 'Toyota', model: 'Avalon', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1995),
  ...generateYearVariants({ brand: 'Toyota', model: 'X4', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 1999),
  ...generateYearVariants({ brand: 'Toyota', model: 'Band.Jipe', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 2001),
  ...generateYearVariants({ brand: 'Toyota', model: 'Band.Picape', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 2001),
  ...generateYearVariants({ brand: 'Toyota', model: 'Celica', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1995),
  // Volkswagen
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Bora', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2011),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Caravelle', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2000),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Corrado', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1992),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'EOS', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2012),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Eurovan', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2000),
];


// ============================================================================
// VEÍCULOS FIPE - SINCRONIZAÇÃO COMPLETA
// Gerado automaticamente em: 2025-12-10T16:54:37.880Z
// Total: 1588 variantes
// ============================================================================
const FIPE_COMPLETE_VARIANTS: VehicleVariant[] = [
  ...generateYearVariants({ brand: 'Acura', model: 'Integra', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1992),
  ...generateYearVariants({ brand: 'Acura', model: 'Legend', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1998),
  ...generateYearVariants({ brand: 'Acura', model: 'NSX', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1995),
  ...generateYearVariants({ brand: 'Agrale', model: '500', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2022),
  ...generateYearVariants({ brand: 'Agrale', model: '1600', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1994),
  ...generateYearVariants({ brand: 'Agrale', model: '1800', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1988, 1994),
  ...generateYearVariants({ brand: 'Agrale', model: '6000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2012),
  ...generateYearVariants({ brand: 'Agrale', model: '7000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2002),
  ...generateYearVariants({ brand: 'Agrale', model: '8000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2011),
  ...generateYearVariants({ brand: 'Agrale', model: '8700', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2025),
  ...generateYearVariants({ brand: 'Agrale', model: '9200', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2012),
  ...generateYearVariants({ brand: 'Agrale', model: '10000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2025),
  ...generateYearVariants({ brand: 'Agrale', model: '13000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2012),
  ...generateYearVariants({ brand: 'Agrale', model: '14000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2025),
  ...generateYearVariants({ brand: 'Agrale', model: 'MARRUÁ', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2025),
  ...generateYearVariants({ brand: 'Agrale', model: 'City', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2001),
  ...generateYearVariants({ brand: 'Agrale', model: 'Ka', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 2000),
  ...generateYearVariants({ brand: 'Agrale', model: 'ELEFANT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 1991),
  ...generateYearVariants({ brand: 'Agrale', model: 'ELEFANTRE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 1998),
  ...generateYearVariants({ brand: 'Agrale', model: 'FORCE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2000),
  ...generateYearVariants({ brand: 'Agrale', model: 'JUNIOR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1996),
  ...generateYearVariants({ brand: 'Agrale', model: 'SST', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 1998),
  ...generateYearVariants({ brand: 'Agrale', model: 'SXT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 1997),
  ...generateYearVariants({ brand: 'Agrale', model: 'TCHAU', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2004),
  ...generateYearVariants({ brand: 'Agrale', model: 'iX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2012),
  ...generateYearVariants({ brand: 'Agrale', model: 'X2', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2025),
  ...generateYearVariants({ brand: 'Agrale', model: 'A1', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2025),
  ...generateYearVariants({ brand: 'Agrale', model: 'A8', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2025),
  ...generateYearVariants({ brand: 'Alfa Romeo', model: '145', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1999),
  ...generateYearVariants({ brand: 'Alfa Romeo', model: '147', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2003, 2005),
  ...generateYearVariants({ brand: 'Alfa Romeo', model: '155', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1997),
  ...generateYearVariants({ brand: 'Alfa Romeo', model: '156', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2004),
  ...generateYearVariants({ brand: 'Alfa Romeo', model: '164', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1996),
  ...generateYearVariants({ brand: 'Alfa Romeo', model: '166', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2003),
  ...generateYearVariants({ brand: 'Alfa Romeo', model: '2300', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1986),
  ...generateYearVariants({ brand: 'Alfa Romeo', model: 'Spider', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1997),
  ...generateYearVariants({ brand: 'AM Gen', model: 'X4', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2000),
  ...generateYearVariants({ brand: 'Asia Motors', model: 'AM-825', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1998),
  ...generateYearVariants({ brand: 'Asia Motors', model: 'Hi-Topic', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1998),
  ...generateYearVariants({ brand: 'Asia Motors', model: 'X4', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1995),
  ...generateYearVariants({ brand: 'Asia Motors', model: 'Topic', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1999),
  ...generateYearVariants({ brand: 'Asia Motors', model: 'Towner', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1999),
  ...generateYearVariants({ brand: 'Asia Motors', model: 'GLA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1998),
  ...generateYearVariants({ brand: 'ASTON MARTIN', model: 'DB9', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2016),
  ...generateYearVariants({ brand: 'ASTON MARTIN', model: 'DBS', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'ASTON MARTIN', model: 'DBX', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'ASTON MARTIN', model: 'X7', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'ASTON MARTIN', model: 'Rapide', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2016),
  ...generateYearVariants({ brand: 'ASTON MARTIN', model: 'SH', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2016),
  ...generateYearVariants({ brand: 'ASTON MARTIN', model: 'Vantage', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2025),
  ...generateYearVariants({ brand: 'ASTON MARTIN', model: 'Virage', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2012),
  ...generateYearVariants({ brand: 'Audi', model: '80', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1996),
  ...generateYearVariants({ brand: 'Audi', model: '100', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1995),
  ...generateYearVariants({ brand: 'Audi', model: 'Rio', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2019),
  ...generateYearVariants({ brand: 'Audi', model: 'S8', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2001),
  ...generateYearVariants({ brand: 'Baby', model: 'Buggy', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 2025),
  ...generateYearVariants({ brand: 'BMW', model: '316', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1986, 1995),
  ...generateYearVariants({ brand: 'BMW', model: '407', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2015),
  ...generateYearVariants({ brand: 'BMW', model: '116iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2015),
  ...generateYearVariants({ brand: 'BMW', model: '118i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'BMW', model: '118iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2014),
  ...generateYearVariants({ brand: 'BMW', model: '118iA/', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2015),
  ...generateYearVariants({ brand: 'BMW', model: '120i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2009),
  ...generateYearVariants({ brand: 'BMW', model: '120iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2019),
  ...generateYearVariants({ brand: 'BMW', model: 'Rio', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2025),
  ...generateYearVariants({ brand: 'BMW', model: '125i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2019),
  ...generateYearVariants({ brand: 'BMW', model: '130i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2009),
  ...generateYearVariants({ brand: 'BMW', model: '130iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2012),
  ...generateYearVariants({ brand: 'BMW', model: '135iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2012),
  ...generateYearVariants({ brand: 'BMW', model: '218i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'BMW', model: '220i', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2018),
  ...generateYearVariants({ brand: 'BMW', model: '225i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2016),
  ...generateYearVariants({ brand: 'BMW', model: '316i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2015),
  ...generateYearVariants({ brand: 'BMW', model: '318i/iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1998),
  ...generateYearVariants({ brand: 'BMW', model: '318iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2012),
  ...generateYearVariants({ brand: 'BMW', model: '318iS/ISA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1998),
  ...generateYearVariants({ brand: 'BMW', model: '318Ti', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1998),
  ...generateYearVariants({ brand: 'BMW', model: '318Ti/TiA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1999),
  ...generateYearVariants({ brand: 'BMW', model: '320i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 2007),
  ...generateYearVariants({ brand: 'BMW', model: '320iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 2025),
  ...generateYearVariants({ brand: 'BMW', model: '323Ci', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2000),
  ...generateYearVariants({ brand: 'BMW', model: '323CiA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2000),
  ...generateYearVariants({ brand: 'BMW', model: '323i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2001),
  ...generateYearVariants({ brand: 'BMW', model: 'Touring', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 2009),
  ...generateYearVariants({ brand: 'BMW', model: '323i/iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2000),
  ...generateYearVariants({ brand: 'BMW', model: '323iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2002),
  ...generateYearVariants({ brand: 'BMW', model: '323Ti', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2000),
  ...generateYearVariants({ brand: 'BMW', model: '323TiA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 1999),
  ...generateYearVariants({ brand: 'BMW', model: '325i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1986, 2001),
  ...generateYearVariants({ brand: 'BMW', model: '325iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1989, 2012),
  ...generateYearVariants({ brand: 'BMW', model: '328i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2000),
  ...generateYearVariants({ brand: 'BMW', model: '328i/iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2000),
  ...generateYearVariants({ brand: 'BMW', model: '328iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2018),
  ...generateYearVariants({ brand: 'BMW', model: '330e', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'BMW', model: '330i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2021),
  ...generateYearVariants({ brand: 'BMW', model: '330iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2007),
  ...generateYearVariants({ brand: 'BMW', model: '335i', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2014),
  ...generateYearVariants({ brand: 'BMW', model: '335iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2015),
  ...generateYearVariants({ brand: 'BMW', model: '428i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2016),
  ...generateYearVariants({ brand: 'BMW', model: '430i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2017),
  ...generateYearVariants({ brand: 'BMW', model: '435iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2015),
  ...generateYearVariants({ brand: 'BMW', model: '520i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1993),
  ...generateYearVariants({ brand: 'BMW', model: '525i/iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 2003),
  ...generateYearVariants({ brand: 'BMW', model: '528i/iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2000),
  ...generateYearVariants({ brand: 'BMW', model: '528iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2016),
  ...generateYearVariants({ brand: 'BMW', model: '530e', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2025),
  ...generateYearVariants({ brand: 'BMW', model: '530i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2019),
  ...generateYearVariants({ brand: 'BMW', model: '530i/iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2010),
  ...generateYearVariants({ brand: 'BMW', model: '535i/iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 1993),
  ...generateYearVariants({ brand: 'BMW', model: '535iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2016),
  ...generateYearVariants({ brand: 'BMW', model: '540i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2020),
  ...generateYearVariants({ brand: 'BMW', model: '540iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2003),
  ...generateYearVariants({ brand: 'BMW', model: '540iTA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2001),
  ...generateYearVariants({ brand: 'BMW', model: '545iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2006),
  ...generateYearVariants({ brand: 'BMW', model: '550iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2010),
  ...generateYearVariants({ brand: 'BMW', model: '640i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2016),
  ...generateYearVariants({ brand: 'BMW', model: '645iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2005),
  ...generateYearVariants({ brand: 'BMW', model: '650i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2016),
  ...generateYearVariants({ brand: 'BMW', model: '650iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2010),
  ...generateYearVariants({ brand: 'BMW', model: '730i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1992),
  ...generateYearVariants({ brand: 'BMW', model: '730iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1992),
  ...generateYearVariants({ brand: 'BMW', model: '735i/iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1987, 1992),
  ...generateYearVariants({ brand: 'BMW', model: '740i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1997),
  ...generateYearVariants({ brand: 'BMW', model: '740iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2001),
  ...generateYearVariants({ brand: 'BMW', model: '740iL/iLA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1996),
  ...generateYearVariants({ brand: 'BMW', model: '740iLA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2001),
  ...generateYearVariants({ brand: 'BMW', model: '745iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2005),
  ...generateYearVariants({ brand: 'BMW', model: '745Le', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2022),
  ...generateYearVariants({ brand: 'BMW', model: '750i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 2015),
  ...generateYearVariants({ brand: 'BMW', model: '750iA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 2014),
  ...generateYearVariants({ brand: 'BMW', model: '750iL', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2019),
  ...generateYearVariants({ brand: 'BMW', model: 'NC', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2019),
  ...generateYearVariants({ brand: 'BMW', model: '750iLA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2012),
  ...generateYearVariants({ brand: 'BMW', model: '760iL', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2003, 2012),
  ...generateYearVariants({ brand: 'BMW', model: '840Ci', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1997),
  ...generateYearVariants({ brand: 'BMW', model: '840CiA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1998),
  ...generateYearVariants({ brand: 'BMW', model: '850Ci/CiA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1998),
  ...generateYearVariants({ brand: 'BMW', model: '850CSi', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1995),
  ...generateYearVariants({ brand: 'BMW', model: '850i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1996),
  ...generateYearVariants({ brand: 'BMW', model: 'i3', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2025),
  ...generateYearVariants({ brand: 'BMW', model: 'i4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'BMW', model: 'i8', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2020),
  ...generateYearVariants({ brand: 'BMW', model: 'iX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'BMW', model: 'M1', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2012),
  ...generateYearVariants({ brand: 'BMW', model: 'M140i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2019),
  ...generateYearVariants({ brand: 'BMW', model: 'M2', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2021),
  ...generateYearVariants({ brand: 'BMW', model: 'M235i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2022),
  ...generateYearVariants({ brand: 'BMW', model: 'M240i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2018),
  ...generateYearVariants({ brand: 'BMW', model: 'M6', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2018),
  ...generateYearVariants({ brand: 'BMW', model: 'M760Li', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2022),
  ...generateYearVariants({ brand: 'BMW', model: 'M8', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2021, 2022),
  ...generateYearVariants({ brand: 'BMW', model: 'M850i', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2020),
  ...generateYearVariants({ brand: 'BMW', model: 'Ka', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2011),
  ...generateYearVariants({ brand: 'BMW', model: 'Classic', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2014),
  ...generateYearVariants({ brand: 'BRM', model: 'Buggy', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2021),
  ...generateYearVariants({ brand: 'BRM', model: 'Buggy/M-8/M-8', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 2023),
  ...generateYearVariants({ brand: 'Bugre', model: 'Buggy', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 2025),
  ...generateYearVariants({ brand: 'BYD', model: 'D1', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'BYD', model: 'eT3', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'BYD', model: 'Han', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'BYD', model: 'Song', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'BYD', model: 'X4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'BYD', model: 'Yuan', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'CAB Motors', model: 'Stark', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2021, 2025),
  ...generateYearVariants({ brand: 'Cadillac', model: 'Deville/Eldorado', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1995),
  ...generateYearVariants({ brand: 'Cadillac', model: 'Seville', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1996),
  ...generateYearVariants({ brand: 'Caoa Chery', model: 'Z', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'Caoa Chery', model: 'iCar', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'Caoa Chery', model: 'Tiggo', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'Caoa Chery/Chery', model: 'Z', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2022),
  ...generateYearVariants({ brand: 'Caoa Chery/Chery', model: 'Celer', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2018),
  ...generateYearVariants({ brand: 'Caoa Chery/Chery', model: 'CIELO', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2012),
  ...generateYearVariants({ brand: 'Caoa Chery/Chery', model: 'Face', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2015),
  ...generateYearVariants({ brand: 'Caoa Chery/Chery', model: 'QQ', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2020),
  ...generateYearVariants({ brand: 'Caoa Chery/Chery', model: 'S-18', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2012),
  ...generateYearVariants({ brand: 'Caoa Chery/Chery', model: 'Tiggo', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2025),
  ...generateYearVariants({ brand: 'CBT Jipe', model: 'X4', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1988, 1995),
  ...generateYearVariants({ brand: 'CHANA', model: 'Argo', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2012),
  ...generateYearVariants({ brand: 'CHANA', model: 'Family', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2009),
  ...generateYearVariants({ brand: 'CHANA', model: 'Utility', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2009),
  ...generateYearVariants({ brand: 'CHANGAN', model: 'MINI', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2012),
  ...generateYearVariants({ brand: 'Chrysler', model: '300', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2016),
  ...generateYearVariants({ brand: 'Chrysler', model: 'Touring', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2014),
  ...generateYearVariants({ brand: 'Chrysler', model: 'Caravan', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2007),
  ...generateYearVariants({ brand: 'Chrysler', model: 'Cirrus', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1995),
  ...generateYearVariants({ brand: 'Chrysler', model: 'Grand', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2007),
  ...generateYearVariants({ brand: 'Chrysler', model: 'LE', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1995),
  ...generateYearVariants({ brand: 'Chrysler', model: 'Neon', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2001),
  ...generateYearVariants({ brand: 'Chrysler', model: 'Rio', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2007),
  ...generateYearVariants({ brand: 'Chrysler', model: 'Classic', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2009),
  ...generateYearVariants({ brand: 'Chrysler', model: 'PT', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2009),
  ...generateYearVariants({ brand: 'Chrysler', model: 'Sebring', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2003),
  ...generateYearVariants({ brand: 'Chrysler', model: 'Stratus', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2001),
  ...generateYearVariants({ brand: 'Chrysler', model: 'TOWN', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2015),
  ...generateYearVariants({ brand: 'Chrysler', model: 'Vision', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1995),
  ...generateYearVariants({ brand: 'Citroën', model: 'NC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2015),
  ...generateYearVariants({ brand: 'Citroën', model: 'SH', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2019),
  ...generateYearVariants({ brand: 'Citroën', model: 'AX', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1995),
  ...generateYearVariants({ brand: 'Citroën', model: 'BX', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1993),
  ...generateYearVariants({ brand: 'Citroën', model: 'C6', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2008),
  ...generateYearVariants({ brand: 'Citroën', model: 'C8', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2003, 2005),
  ...generateYearVariants({ brand: 'Citroën', model: 'DS3', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2017),
  ...generateYearVariants({ brand: 'Citroën', model: 'DS4', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2016),
  ...generateYearVariants({ brand: 'Citroën', model: 'DS5', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2018),
  ...generateYearVariants({ brand: 'Citroën', model: 'Argo', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2021, 2025),
  ...generateYearVariants({ brand: 'Citroën', model: 'Evasion', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2001),
  ...generateYearVariants({ brand: 'Citroën', model: 'Jumpy', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2025),
  ...generateYearVariants({ brand: 'Citroën', model: 'Xantia', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2002),
  ...generateYearVariants({ brand: 'Citroën', model: 'XM', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2000),
  ...generateYearVariants({ brand: 'Citroën', model: 'Xsara', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2012),
  ...generateYearVariants({ brand: 'Citroën', model: 'Z', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1998),
  ...generateYearVariants({ brand: 'Citroën', model: 'Ka', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1997),
  ...generateYearVariants({ brand: 'Citroën', model: 'Rio', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1998),
  ...generateYearVariants({ brand: 'Cross Lander', model: 'X4', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2003, 2006),
  ...generateYearVariants({ brand: 'D2D Motors', model: 'Buggy', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'Daewoo', model: 'Espero', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1997),
  ...generateYearVariants({ brand: 'Daewoo', model: 'Lanos', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2001),
  ...generateYearVariants({ brand: 'Daewoo', model: 'Z', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1999),
  ...generateYearVariants({ brand: 'Daewoo', model: 'Nubira', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1999),
  ...generateYearVariants({ brand: 'Daewoo', model: 'NC', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1995),
  ...generateYearVariants({ brand: 'Daewoo', model: 'Racer', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1995),
  ...generateYearVariants({ brand: 'Daewoo', model: 'Super', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1995),
  ...generateYearVariants({ brand: 'Daewoo', model: 'Tico', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1995),
  ...generateYearVariants({ brand: 'Daihatsu', model: 'Applause', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1995),
  ...generateYearVariants({ brand: 'Daihatsu', model: 'Charade', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1995),
  ...generateYearVariants({ brand: 'Daihatsu', model: 'Cuore', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1999),
  ...generateYearVariants({ brand: 'Daihatsu', model: 'Z', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1997),
  ...generateYearVariants({ brand: 'Daihatsu', model: 'Gran', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1999),
  ...generateYearVariants({ brand: 'Daihatsu', model: 'Move', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1997),
  ...generateYearVariants({ brand: 'Daihatsu', model: 'Rio', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1999),
  ...generateYearVariants({ brand: 'Dodge', model: '500', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2012),
  ...generateYearVariants({ brand: 'Dodge', model: 'Avenger', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1995),
  ...generateYearVariants({ brand: 'Dodge', model: 'Dakota', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2001),
  ...generateYearVariants({ brand: 'Dodge', model: 'X4', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2015),
  ...generateYearVariants({ brand: 'Dodge', model: 'Intrepid', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1993),
  ...generateYearVariants({ brand: 'Dodge', model: 'JOURNEY', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2018),
  ...generateYearVariants({ brand: 'Dodge', model: 'Ram', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2001),
  ...generateYearVariants({ brand: 'Dodge', model: 'Stealth', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1994),
  ...generateYearVariants({ brand: 'EFFA', model: 'K01', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2019),
  ...generateYearVariants({ brand: 'EFFA', model: 'K02', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2019),
  ...generateYearVariants({ brand: 'EFFA', model: 'M-100', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2012),
  ...generateYearVariants({ brand: 'EFFA', model: 'X2', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2012),
  ...generateYearVariants({ brand: 'EFFA', model: 'Start', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2014),
  ...generateYearVariants({ brand: 'EFFA', model: 'ULC', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2012),
  ...generateYearVariants({ brand: 'EFFA', model: 'V21', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2025),
  ...generateYearVariants({ brand: 'EFFA', model: 'V22', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2025),
  ...generateYearVariants({ brand: 'EFFA', model: 'V25', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'Engesa', model: 'X4', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1994),
  ...generateYearVariants({ brand: 'Envemo', model: 'Master', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 1996),
  ...generateYearVariants({ brand: 'Envemo', model: 'X4', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1995),
  ...generateYearVariants({ brand: 'Ferrari', model: '296', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'Ferrari', model: '348', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1994),
  ...generateYearVariants({ brand: 'Ferrari', model: '355', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2000),
  ...generateYearVariants({ brand: 'Ferrari', model: '360', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2005),
  ...generateYearVariants({ brand: 'Ferrari', model: '456', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2001),
  ...generateYearVariants({ brand: 'Ferrari', model: '458', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2015),
  ...generateYearVariants({ brand: 'Ferrari', model: '488', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2020),
  ...generateYearVariants({ brand: 'Ferrari', model: '550', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2001),
  ...generateYearVariants({ brand: 'Ferrari', model: '812', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2025),
  ...generateYearVariants({ brand: 'Ferrari', model: 'TT', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2017),
  ...generateYearVariants({ brand: 'Ferrari', model: 'Strada', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2003, 2025),
  ...generateYearVariants({ brand: 'Ferrari', model: '575M', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2003, 2005),
  ...generateYearVariants({ brand: 'Ferrari', model: 'California', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2017),
  ...generateYearVariants({ brand: 'Ferrari', model: 'F12', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2017),
  ...generateYearVariants({ brand: 'Ferrari', model: 'F430', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2009),
  ...generateYearVariants({ brand: 'Ferrari', model: 'F458', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2015),
  ...generateYearVariants({ brand: 'Ferrari', model: 'F599', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2012),
  ...generateYearVariants({ brand: 'Ferrari', model: 'F8', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'Ferrari', model: 'FF', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2016),
  ...generateYearVariants({ brand: 'Ferrari', model: 'GTC4', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2020),
  ...generateYearVariants({ brand: 'Ferrari', model: 'PORTOFINO', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2025),
  ...generateYearVariants({ brand: 'Ferrari', model: 'Roma', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2021, 2025),
  ...generateYearVariants({ brand: 'Ferrari', model: 'SF', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'Fiat', model: '190', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1984),
  ...generateYearVariants({ brand: 'Fiat', model: 'Brava', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2003),
  ...generateYearVariants({ brand: 'Fiat', model: 'Cinquecento', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1995),
  ...generateYearVariants({ brand: 'Fiat', model: 'Coupe', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1997),
  ...generateYearVariants({ brand: 'Fiat', model: 'TT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2016),
  ...generateYearVariants({ brand: 'Fiat', model: 'NC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2021),
  ...generateYearVariants({ brand: 'Fiat', model: 'Duna', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1995),
  ...generateYearVariants({ brand: 'Fiat', model: 'E-Scudo', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'Fiat', model: 'City', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2000),
  ...generateYearVariants({ brand: 'Fiat', model: 'Marea', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2007),
  ...generateYearVariants({ brand: 'Fiat', model: 'Oggi', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1985),
  ...generateYearVariants({ brand: 'Fiat', model: 'Panorama', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1986),
  ...generateYearVariants({ brand: 'Fiat', model: 'Scudo', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'Fiat', model: 'Stilo', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2003, 2011),
  ...generateYearVariants({ brand: 'Fibravan', model: 'Buggy', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1989, 2025),
  ...generateYearVariants({ brand: 'Ford', model: 'Aerostar', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 1995),
  ...generateYearVariants({ brand: 'Ford', model: 'Aspire', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1995),
  ...generateYearVariants({ brand: 'Ford', model: 'Club', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1996),
  ...generateYearVariants({ brand: 'Ford', model: 'Contour', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1995),
  ...generateYearVariants({ brand: 'Ford', model: 'Crown', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1992),
  ...generateYearVariants({ brand: 'Ford', model: 'Expedition', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1999),
  ...generateYearVariants({ brand: 'Ford', model: 'X4', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 2025),
  ...generateYearVariants({ brand: 'Ford', model: 'Explorer', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1996),
  ...generateYearVariants({ brand: 'Ford', model: 'X2', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1997),
  ...generateYearVariants({ brand: 'Ford', model: 'Blazer', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1995),
  ...generateYearVariants({ brand: 'Ford', model: 'Série 2', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1986),
  ...generateYearVariants({ brand: 'Ford', model: 'F-150', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2002),
  ...generateYearVariants({ brand: 'Ford', model: 'Classic', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2011),
  ...generateYearVariants({ brand: 'Ford', model: 'Fastback', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2019),
  ...generateYearVariants({ brand: 'Ford', model: 'GLA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1991),
  ...generateYearVariants({ brand: 'Ford', model: 'Biz', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1986, 1995),
  ...generateYearVariants({ brand: 'Ford', model: 'Mondeo', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2006),
  ...generateYearVariants({ brand: 'Ford', model: 'Probe', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1995),
  ...generateYearVariants({ brand: 'Ford', model: 'Royale', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1996),
  ...generateYearVariants({ brand: 'Ford', model: 'Taurus', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1998),
  ...generateYearVariants({ brand: 'Ford', model: 'SH', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1993),
  ...generateYearVariants({ brand: 'Ford', model: 'Thunderbird', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 1995),
  ...generateYearVariants({ brand: 'Ford', model: 'Versa', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1996),
  ...generateYearVariants({ brand: 'Ford', model: 'Windstar', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1995),
  ...generateYearVariants({ brand: 'FOTON', model: 'X2', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2025),
  ...generateYearVariants({ brand: 'FOTON', model: 'City', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2025),
  ...generateYearVariants({ brand: 'Fyber', model: 'Buggy', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2025),
  ...generateYearVariants({ brand: 'GEELY', model: 'EC7', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2014),
  ...generateYearVariants({ brand: 'GEELY', model: 'GC2', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2015),
  ...generateYearVariants({ brand: 'Chevrolet', model: '500', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1995),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'A-10', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1989),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'A-20', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1996),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'BOLT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'C-10', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1989),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'C-20', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1996),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Calibra', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1996),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Caprice', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1995),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Cavalier', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1995),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Cheynne', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1995),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'D-10', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1985),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'D-20', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1996),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'GLS', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1989, 1996),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'JOY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2021),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Lumina', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 1996),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Marajo', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1989),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Saturn', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1995),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Sierra', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1995),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Silverado', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2002),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Sonoma', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1995),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'SpaceVan', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1998),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Suburban', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2015),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Syclone', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1992),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Tigra', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 1999),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Trafic', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1998),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Veraneio', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1996),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'NC', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2010),
  ...generateYearVariants({ brand: 'Chevrolet', model: 'Elite', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2012),
  ...generateYearVariants({ brand: 'GREAT WALL', model: 'HOVER', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2008),
  ...generateYearVariants({ brand: 'Gurgel', model: 'BR-800', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1988, 1993),
  ...generateYearVariants({ brand: 'Gurgel', model: 'Carajas', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1988),
  ...generateYearVariants({ brand: 'Gurgel', model: 'Carajas/Tocantis/Xavante/Vip', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1994),
  ...generateYearVariants({ brand: 'GWM', model: 'Haval', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'HAFEI', model: 'Towner', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2013),
  ...generateYearVariants({ brand: 'HITECH ELECTRIC', model: 'Argo', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2025),
  ...generateYearVariants({ brand: 'HITECH ELECTRIC', model: 'e.co', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2025),
  ...generateYearVariants({ brand: 'Honda', model: 'Odyssey', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1998),
  ...generateYearVariants({ brand: 'Honda', model: 'Passport', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1995),
  ...generateYearVariants({ brand: 'Honda', model: 'X2', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2015),
  ...generateYearVariants({ brand: 'Honda', model: 'Classic', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1997),
  ...generateYearVariants({ brand: 'Honda', model: 'iX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2015),
  ...generateYearVariants({ brand: 'Honda', model: 'Strada', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2003),
  ...generateYearVariants({ brand: 'Honda', model: 'Argo', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 2025),
  ...generateYearVariants({ brand: 'Honda', model: 'Versa', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2019),
  ...generateYearVariants({ brand: 'Honda', model: 'CTX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2014),
  ...generateYearVariants({ brand: 'Honda', model: 'DOMINATOR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1994),
  ...generateYearVariants({ brand: 'Honda', model: 'MAGNA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1998),
  ...generateYearVariants({ brand: 'Honda', model: 'SUPER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1998),
  ...generateYearVariants({ brand: 'Honda', model: 'TRX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2007),
  ...generateYearVariants({ brand: 'Honda', model: 'VFR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2013),
  ...generateYearVariants({ brand: 'Honda', model: 'VTX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2007),
  ...generateYearVariants({ brand: 'Honda', model: 'XLR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2003),
  ...generateYearVariants({ brand: 'Honda', model: 'XLX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 1994),
  ...generateYearVariants({ brand: 'Hyundai', model: 'GLS', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2012),
  ...generateYearVariants({ brand: 'Hyundai', model: 'Accent', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1998),
  ...generateYearVariants({ brand: 'Hyundai', model: 'Atos', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2001),
  ...generateYearVariants({ brand: 'Hyundai', model: 'Coupe', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2003),
  ...generateYearVariants({ brand: 'Hyundai', model: 'Pulse', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2020),
  ...generateYearVariants({ brand: 'Hyundai', model: 'Cupê', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1998),
  ...generateYearVariants({ brand: 'Hyundai', model: 'EQUUS', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2013),
  ...generateYearVariants({ brand: 'Hyundai', model: 'Excel', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1995),
  ...generateYearVariants({ brand: 'Hyundai', model: 'Galloper', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 1999),
  ...generateYearVariants({ brand: 'Hyundai', model: 'GENESIS', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2013),
  ...generateYearVariants({ brand: 'Hyundai', model: 'X4', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2016),
  ...generateYearVariants({ brand: 'Hyundai', model: 'H1', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2009),
  ...generateYearVariants({ brand: 'Hyundai', model: 'H100', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2004),
  ...generateYearVariants({ brand: 'Hyundai', model: 'IONIQ', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'Hyundai', model: 'X2', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2003),
  ...generateYearVariants({ brand: 'Hyundai', model: 'Scoupe', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1995),
  ...generateYearVariants({ brand: 'Hyundai', model: 'Terracan', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2003, 2006),
  ...generateYearVariants({ brand: 'Isuzu', model: 'X2', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1994),
  ...generateYearVariants({ brand: 'Isuzu', model: 'Hombre', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1998),
  ...generateYearVariants({ brand: 'Isuzu', model: 'Rodeo', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1995),
  ...generateYearVariants({ brand: 'Iveco', model: '500', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2015),
  ...generateYearVariants({ brand: 'Iveco', model: 'City', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2025),
  ...generateYearVariants({ brand: 'Iveco', model: 'CURSOR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2012),
  ...generateYearVariants({ brand: 'Iveco', model: 'Argo', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2012),
  ...generateYearVariants({ brand: 'Iveco', model: 'EUROTECH', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2006),
  ...generateYearVariants({ brand: 'Iveco', model: 'X4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2025),
  ...generateYearVariants({ brand: 'Iveco', model: 'EUROTRAKKER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2009),
  ...generateYearVariants({ brand: 'Iveco', model: 'POWERSTAR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2004),
  ...generateYearVariants({ brand: 'Iveco', model: 'X2', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2025),
  ...generateYearVariants({ brand: 'Iveco', model: 'iX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2012),
  ...generateYearVariants({ brand: 'Iveco', model: 'Strada', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2017),
  ...generateYearVariants({ brand: 'Iveco', model: 'VERTIS', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2016),
  ...generateYearVariants({ brand: 'JAC', model: 'E-J7', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'JAC', model: 'e-JS1', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'JAC', model: 'e-JS4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'JAC', model: 'E-JV5.5', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'JAC', model: 'iEV', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'JAC', model: 'J2', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2016),
  ...generateYearVariants({ brand: 'JAC', model: 'J3', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2015),
  ...generateYearVariants({ brand: 'JAC', model: 'J5', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2016),
  ...generateYearVariants({ brand: 'JAC', model: 'J6', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2016),
  ...generateYearVariants({ brand: 'JAC', model: 'T', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2014),
  ...generateYearVariants({ brand: 'JAC', model: 'T40', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2025),
  ...generateYearVariants({ brand: 'JAC', model: 'T5', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2019),
  ...generateYearVariants({ brand: 'JAC', model: 'T50', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2025),
  ...generateYearVariants({ brand: 'JAC', model: 'T6', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2016),
  ...generateYearVariants({ brand: 'JAC', model: 'T60', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2025),
  ...generateYearVariants({ brand: 'JAC', model: 'T8', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2018),
  ...generateYearVariants({ brand: 'JAC', model: 'T80', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2020),
  ...generateYearVariants({ brand: 'JAC', model: 'V260', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2025),
  ...generateYearVariants({ brand: 'JAC', model: 'E-JT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'Jaguar', model: 'Daimler', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2000),
  ...generateYearVariants({ brand: 'Jaguar', model: 'E-Pace', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2025),
  ...generateYearVariants({ brand: 'Jaguar', model: 'F-Pace', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2025),
  ...generateYearVariants({ brand: 'Jaguar', model: 'F-PACE', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'Jaguar', model: 'Rio', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2025),
  ...generateYearVariants({ brand: 'Jaguar', model: 'F-Type', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2025),
  ...generateYearVariants({ brand: 'Jaguar', model: 'I-Pace', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2025),
  ...generateYearVariants({ brand: 'Jaguar', model: 'S-Type', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2008),
  ...generateYearVariants({ brand: 'Jaguar', model: 'XE', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2021),
  ...generateYearVariants({ brand: 'Jaguar', model: 'XF', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2020),
  ...generateYearVariants({ brand: 'Jaguar', model: 'XFR', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2015),
  ...generateYearVariants({ brand: 'Jaguar', model: 'XFR-S', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2015),
  ...generateYearVariants({ brand: 'Jaguar', model: 'XJ', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2019),
  ...generateYearVariants({ brand: 'Jaguar', model: 'XJ-12', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1997),
  ...generateYearVariants({ brand: 'Jaguar', model: 'XJ-6', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1997),
  ...generateYearVariants({ brand: 'Jaguar', model: 'XJ-8', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2009),
  ...generateYearVariants({ brand: 'Jaguar', model: 'XJR', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2009),
  ...generateYearVariants({ brand: 'Jaguar', model: 'XJS', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1995),
  ...generateYearVariants({ brand: 'Jaguar', model: 'XJS-C', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1995),
  ...generateYearVariants({ brand: 'Jaguar', model: 'XK-8', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2010),
  ...generateYearVariants({ brand: 'Jaguar', model: 'XKR', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2015),
  ...generateYearVariants({ brand: 'Jaguar', model: 'XKR-S', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2015),
  ...generateYearVariants({ brand: 'Jaguar', model: 'X-Type', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2009),
  ...generateYearVariants({ brand: 'JINBEI', model: 'TOPIC', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2015),
  ...generateYearVariants({ brand: 'JINBEI', model: 'VKN', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2016),
  ...generateYearVariants({ brand: 'JPX', model: 'X4', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2001),
  ...generateYearVariants({ brand: 'KIA', model: '500', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2025),
  ...generateYearVariants({ brand: 'KIA', model: 'Besta', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2005),
  ...generateYearVariants({ brand: 'KIA', model: 'X2', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2012),
  ...generateYearVariants({ brand: 'KIA', model: 'X4', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2013),
  ...generateYearVariants({ brand: 'KIA', model: 'Z', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2017),
  ...generateYearVariants({ brand: 'KIA', model: 'Carens', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2013),
  ...generateYearVariants({ brand: 'KIA', model: 'Ceres', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1996),
  ...generateYearVariants({ brand: 'KIA', model: 'CLA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2000),
  ...generateYearVariants({ brand: 'KIA', model: 'Magentis', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2011),
  ...generateYearVariants({ brand: 'KIA', model: 'Niro', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'KIA', model: 'Opirus', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2009),
  ...generateYearVariants({ brand: 'KIA', model: 'OPTIMA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2016),
  ...generateYearVariants({ brand: 'KIA', model: 'QUORIS', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2016),
  ...generateYearVariants({ brand: 'KIA', model: 'Sephia', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2001),
  ...generateYearVariants({ brand: 'KIA', model: 'SH', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2000),
  ...generateYearVariants({ brand: 'KIA', model: 'STONIC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'Lada', model: 'Ka', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1995),
  ...generateYearVariants({ brand: 'Lada', model: 'X4', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 2000),
  ...generateYearVariants({ brand: 'Lada', model: 'Samara', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1995),
  ...generateYearVariants({ brand: 'LAMBORGHINI', model: 'AVENTADOR', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2022),
  ...generateYearVariants({ brand: 'LAMBORGHINI', model: 'Gallardo', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2014),
  ...generateYearVariants({ brand: 'LAMBORGHINI', model: 'Strada', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2013),
  ...generateYearVariants({ brand: 'LAMBORGHINI', model: 'HURACAN', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2025),
  ...generateYearVariants({ brand: 'LAMBORGHINI', model: 'URUS', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2025),
  ...generateYearVariants({ brand: 'Land Rover', model: 'Defe.', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'Land Rover', model: 'i4', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2025),
  ...generateYearVariants({ brand: 'Land Rover', model: 'Defender', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2025),
  ...generateYearVariants({ brand: 'Land Rover', model: 'City', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1998),
  ...generateYearVariants({ brand: 'Land Rover', model: 'X4', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2025),
  ...generateYearVariants({ brand: 'Land Rover', model: 'Discov.', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2019),
  ...generateYearVariants({ brand: 'Land Rover', model: 'Discovery', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2025),
  ...generateYearVariants({ brand: 'Land Rover', model: 'Lander', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2015),
  ...generateYearVariants({ brand: 'Land Rover', model: 'New', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1997),
  ...generateYearVariants({ brand: 'Land Rover', model: 'Range', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2025),
  ...generateYearVariants({ brand: 'Land Rover', model: 'Z', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2015),
  ...generateYearVariants({ brand: 'Lexus', model: '208', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2016),
  ...generateYearVariants({ brand: 'Lexus', model: '500', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2025),
  ...generateYearVariants({ brand: 'Lexus', model: 'CT200h', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2019),
  ...generateYearVariants({ brand: 'Lexus', model: 'ES-300', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 2003),
  ...generateYearVariants({ brand: 'Lexus', model: 'ES300h', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2025),
  ...generateYearVariants({ brand: 'Lexus', model: 'ES-330', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2006),
  ...generateYearVariants({ brand: 'Lexus', model: 'ES-350', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2018),
  ...generateYearVariants({ brand: 'Lexus', model: 'GS', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1996),
  ...generateYearVariants({ brand: 'Lexus', model: 'IS-300', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2013),
  ...generateYearVariants({ brand: 'Lexus', model: 'LS', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 2013),
  ...generateYearVariants({ brand: 'Lexus', model: 'LS-460L', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2017),
  ...generateYearVariants({ brand: 'Lexus', model: 'NX-200t', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2017),
  ...generateYearVariants({ brand: 'Lexus', model: 'NX-300', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2018),
  ...generateYearVariants({ brand: 'Lexus', model: 'NX-300h', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2021),
  ...generateYearVariants({ brand: 'Lexus', model: 'NX-350h', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'Lexus', model: 'RX', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2002),
  ...generateYearVariants({ brand: 'Lexus', model: 'RX-350', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2019),
  ...generateYearVariants({ brand: 'Lexus', model: 'RX-450h', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2022),
  ...generateYearVariants({ brand: 'Lexus', model: 'SC', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1995),
  ...generateYearVariants({ brand: 'Lexus', model: 'UX-250h', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2025),
  ...generateYearVariants({ brand: 'LIFAN', model: '530', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2019),
  ...generateYearVariants({ brand: 'LIFAN', model: '620', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2012),
  ...generateYearVariants({ brand: 'LIFAN', model: 'Elite', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2012),
  ...generateYearVariants({ brand: 'LIFAN', model: 'FOISON', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2016),
  ...generateYearVariants({ brand: 'LIFAN', model: 'X6', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2019),
  ...generateYearVariants({ brand: 'LIFAN', model: 'X80', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2019),
  ...generateYearVariants({ brand: 'LIFAN', model: 'Argo', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2011),
  ...generateYearVariants({ brand: 'LOBINI', model: 'H1', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2008),
  ...generateYearVariants({ brand: 'Lotus', model: 'Elan', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1995),
  ...generateYearVariants({ brand: 'Lotus', model: 'Esprit', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1995),
  ...generateYearVariants({ brand: 'Mahindra', model: 'X2', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2014),
  ...generateYearVariants({ brand: 'Mahindra', model: 'X4', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2015),
  ...generateYearVariants({ brand: 'Mahindra', model: 'SCORPIO', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2012),
  ...generateYearVariants({ brand: 'Maserati', model: '222', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1994),
  ...generateYearVariants({ brand: 'Maserati', model: '228', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1994),
  ...generateYearVariants({ brand: 'Maserati', model: '430', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1994),
  ...generateYearVariants({ brand: 'Maserati', model: '3200', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2002),
  ...generateYearVariants({ brand: 'Maserati', model: 'Coupé', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2006),
  ...generateYearVariants({ brand: 'Maserati', model: 'Ghibli', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2025),
  ...generateYearVariants({ brand: 'Maserati', model: 'Gran', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2019),
  ...generateYearVariants({ brand: 'Maserati', model: 'Rio', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2016),
  ...generateYearVariants({ brand: 'Maserati', model: 'GranSport', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2007),
  ...generateYearVariants({ brand: 'Maserati', model: 'GranTurismo', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2013),
  ...generateYearVariants({ brand: 'Maserati', model: 'Strada', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2017),
  ...generateYearVariants({ brand: 'Maserati', model: 'Levante', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2025),
  ...generateYearVariants({ brand: 'Maserati', model: 'TT', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2019),
  ...generateYearVariants({ brand: 'Maserati', model: 'SH', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1994),
  ...generateYearVariants({ brand: 'Maserati', model: 'Spyder', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2006),
  ...generateYearVariants({ brand: 'Matra', model: 'X2', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2004),
  ...generateYearVariants({ brand: 'Matra', model: 'X4', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2004),
  ...generateYearVariants({ brand: 'Mazda', model: '323', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1995),
  ...generateYearVariants({ brand: 'Mazda', model: '500', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2000),
  ...generateYearVariants({ brand: 'Mazda', model: '626', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2000),
  ...generateYearVariants({ brand: 'Mazda', model: '929', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1995),
  ...generateYearVariants({ brand: 'Mazda', model: 'B2200', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1995),
  ...generateYearVariants({ brand: 'Mazda', model: 'Millenia', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1997),
  ...generateYearVariants({ brand: 'Mazda', model: 'MPV', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2000),
  ...generateYearVariants({ brand: 'Mazda', model: 'MX-3', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1998),
  ...generateYearVariants({ brand: 'Mazda', model: 'MX-5', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1995),
  ...generateYearVariants({ brand: 'Mazda', model: 'Navajo', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1993),
  ...generateYearVariants({ brand: 'Mazda', model: 'Protegé', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 2000),
  ...generateYearVariants({ brand: 'Mazda', model: 'RX', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1994),
  ...generateYearVariants({ brand: 'Mclaren', model: '540C', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2020),
  ...generateYearVariants({ brand: 'Mclaren', model: '570S', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2019),
  ...generateYearVariants({ brand: 'Mclaren', model: '600LT', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2025),
  ...generateYearVariants({ brand: 'Mclaren', model: '720S', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2025),
  ...generateYearVariants({ brand: 'Mclaren', model: '765LT', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2021, 2025),
  ...generateYearVariants({ brand: 'Mclaren', model: 'Artura', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'Mclaren', model: 'GT', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '408', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2021),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '608', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '708', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '709', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1998),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '712', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2003),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '912', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1987, 1995),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '914', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1999),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '1214', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1989, 1999),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '1215', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2004),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '1218', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1997),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '1318', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2003, 2004),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '1414', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 1994),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '1418', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1989, 2001),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '1420', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2005),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '1714', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1996),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '1718', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 2012),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '1720', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2004),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '1723', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2001),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '1728', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2003, 2006),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '180-D', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1996),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '190-E', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1993),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '230-E', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1988, 1993),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '260-E', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1993),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '300-D', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1992),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '300-E', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1993),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '300-SE', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1993),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '300-SL', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1993),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '300-TE', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1995),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '560-SEL', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1987, 1992),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'ADV', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2022),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'NC', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2019),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'A-35', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'A3', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2020),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'CG', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2025),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'C-180', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2017),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'C-200', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2025),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Touring', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2012),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'C-230', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2006),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'C-240', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2003),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'C-250', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2018),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'C-280', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2009),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'C-300', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2025),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Versa', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2017),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Rio', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2021),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'C-320', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2005),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'C-350', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2011),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'C-36', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1997),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'C-43', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2020),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'C-450', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2016),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'C-55', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2006),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'C-63', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2020),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'CL-600', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2011),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'CL-63', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2011),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'CL-65', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2011),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'A4', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2018),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'CLC', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2011),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'CLK-230', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2002),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'CLK-320', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2005),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'CLK-430', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2001),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'CLK-55', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2006),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'CLS', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2020),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'E-190', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1986, 1993),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'E-250', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2019),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'E-300', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2025),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'E-320', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2005),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'E-350', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2012),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'E-400', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2016),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'E-43', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2018),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'E-430', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2002),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'E-53', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2020),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'E-55', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2006),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'E-63', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2021),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'EQA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'EQB', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'EQC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'G-55', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2012),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'G-63', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2021),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'X4', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1989, 2025),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'X2', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2025),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'ML-430', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2001),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'ML-55', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2005),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'ML-63', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2015),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'S-400', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2011),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'S-560L', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2020),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'S-63', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2020),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'S-65', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2019),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'SL-350', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2014),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'SL-400', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2017),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'SL-600', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2000),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'SL-63', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2017),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'SL-65', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2011),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'SLC-300', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2020),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'SLC-43', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2018),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'SLK-230', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2004),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'SLK-300', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2016),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'SLK-320', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2004),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'SLK-55', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2016),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'SLS-63', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2014),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Street', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2012),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'VITO', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2019),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'iX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 2012),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '1718-A', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2001),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '1718-K', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2001),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '1718-M', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2004),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '1720-A', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2005),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '1720-K', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2004),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '1723-S', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2001),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '1938-S', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2006),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '1944-S', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2003, 2005),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '710/', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2012),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: '914-C', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2003),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Atilis', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2009),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Atron', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2021),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'Axor', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2025),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1113', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1114', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1990),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1117', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1990),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1118', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1987, 1990),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1214', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1989, 1997),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1218', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1989, 2004),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1313', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1314', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1987, 1990),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1316', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1317', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1318', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1984, 2012),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1319', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1984, 1989),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1414', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1996),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1418', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1984, 2003),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1513', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1514', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1990),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1516', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1517', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1986, 1987),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1518', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1991),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1519', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1520', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1987, 1990),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1614', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1996),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1618', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1996),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1620', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2004),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1621', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1997),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1622', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2004),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1625', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1989, 1996),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'L-1630', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 1998),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'LK-1620', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2004),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'LS-1313', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'LS-1519', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'LS-1520', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1990),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'LS-1524', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'LS-1525', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1987, 1990),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'LS-1625', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1989, 1996),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'LS-1630', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 1999),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'LS-1632', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2002),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'LS-1634', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2012),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'LS-1924', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1987),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'LS-1929', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1987),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'LS-1932', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1984, 1989),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'LS-1933', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1984, 1989),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'LS-1934', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1984, 1991),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'LS-1935', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1989, 1999),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'LS-1938', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2005),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'LS-1941', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1989, 1997),
  ...generateYearVariants({ brand: 'Mercedes-Benz', model: 'LS-2635', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1999),
  ...generateYearVariants({ brand: 'Mercury', model: 'Mystique', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1995),
  ...generateYearVariants({ brand: 'Mercury', model: 'Sable', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1993),
  ...generateYearVariants({ brand: 'MG', model: '550', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2012),
  ...generateYearVariants({ brand: 'MG', model: 'MG6', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2012),
  ...generateYearVariants({ brand: 'MINI', model: 'COOPER', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2025),
  ...generateYearVariants({ brand: 'MINI', model: 'Rio', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2022),
  ...generateYearVariants({ brand: 'MINI', model: 'SH', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2022),
  ...generateYearVariants({ brand: 'MINI', model: 'ONE', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2015),
  ...generateYearVariants({ brand: 'Mitsubishi', model: '3000', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1998),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'X4', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2003, 2008),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'Colt', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1997),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'Diamant', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1993),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'GSX', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1995),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'Expo', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1997),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'Galant', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2005),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'GRANDIS', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2008),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'L300', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2000),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'Mirage', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1994),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'GLS', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1995),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'Montero', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1995),
  ...generateYearVariants({ brand: 'Mitsubishi', model: 'Space', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2004),
  ...generateYearVariants({ brand: 'Miura', model: 'Picape', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1997),
  ...generateYearVariants({ brand: 'Nissan', model: 'Altima', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1995),
  ...generateYearVariants({ brand: 'Nissan', model: 'ALTIMA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2014),
  ...generateYearVariants({ brand: 'Nissan', model: 'AX', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1996),
  ...generateYearVariants({ brand: 'Nissan', model: 'X2', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1997),
  ...generateYearVariants({ brand: 'Nissan', model: 'Infinit', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1992),
  ...generateYearVariants({ brand: 'Nissan', model: 'Rio', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2017),
  ...generateYearVariants({ brand: 'Nissan', model: 'X4', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 2008),
  ...generateYearVariants({ brand: 'Nissan', model: 'Leaf', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'Nissan', model: 'GLE', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2000),
  ...generateYearVariants({ brand: 'Nissan', model: 'Maxima', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 2002),
  ...generateYearVariants({ brand: 'Nissan', model: 'Micra', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1995),
  ...generateYearVariants({ brand: 'Nissan', model: 'NX', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1994),
  ...generateYearVariants({ brand: 'Nissan', model: 'Primera', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2000),
  ...generateYearVariants({ brand: 'Nissan', model: 'Quest', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1995),
  ...generateYearVariants({ brand: 'Nissan', model: 'SX', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1993),
  ...generateYearVariants({ brand: 'Nissan', model: 'Terrano', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1997),
  ...generateYearVariants({ brand: 'Peugeot', model: '106', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2001),
  ...generateYearVariants({ brand: 'Peugeot', model: '205', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1998),
  ...generateYearVariants({ brand: 'Peugeot', model: '306', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2001),
  ...generateYearVariants({ brand: 'Peugeot', model: '405', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1999),
  ...generateYearVariants({ brand: 'Peugeot', model: '406', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2004),
  ...generateYearVariants({ brand: 'Peugeot', model: '407', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2009),
  ...generateYearVariants({ brand: 'Peugeot', model: '504', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1999),
  ...generateYearVariants({ brand: 'Peugeot', model: '505', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1993),
  ...generateYearVariants({ brand: 'Peugeot', model: '508', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2014),
  ...generateYearVariants({ brand: 'Peugeot', model: '605', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2000),
  ...generateYearVariants({ brand: 'Peugeot', model: '607', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2005),
  ...generateYearVariants({ brand: 'Peugeot', model: '806', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2000),
  ...generateYearVariants({ brand: 'Peugeot', model: '807', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2004),
  ...generateYearVariants({ brand: 'Peugeot', model: 'Rio', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2000),
  ...generateYearVariants({ brand: 'Peugeot', model: 'Argo', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'Peugeot', model: 'Expert', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2025),
  ...generateYearVariants({ brand: 'Peugeot', model: 'Z', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2015),
  ...generateYearVariants({ brand: 'Plymouth', model: 'Voyage', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1995),
  ...generateYearVariants({ brand: 'Plymouth', model: 'NC', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1993),
  ...generateYearVariants({ brand: 'Pontiac', model: 'Trans-AM', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1995),
  ...generateYearVariants({ brand: 'Pontiac', model: 'Trans-Sport', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1992),
  ...generateYearVariants({ brand: 'Porsche', model: '408', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2012),
  ...generateYearVariants({ brand: 'Porsche', model: '500', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2025),
  ...generateYearVariants({ brand: 'Porsche', model: '928', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1995),
  ...generateYearVariants({ brand: 'Porsche', model: '968', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1995),
  ...generateYearVariants({ brand: 'Porsche', model: 'Rio', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2025),
  ...generateYearVariants({ brand: 'RAM', model: '500', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2025),
  ...generateYearVariants({ brand: 'RAM', model: 'Classic', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'RAM', model: 'X4', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'RELY', model: 'LINK', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2014),
  ...generateYearVariants({ brand: 'RELY', model: 'PICK-UP', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2015),
  ...generateYearVariants({ brand: 'RELY', model: 'VAN', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2014),
  ...generateYearVariants({ brand: 'Renault', model: '19', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1999),
  ...generateYearVariants({ brand: 'Renault', model: '21', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1994),
  ...generateYearVariants({ brand: 'Renault', model: 'Express', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2000),
  ...generateYearVariants({ brand: 'Renault', model: 'Laguna', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2003),
  ...generateYearVariants({ brand: 'Renault', model: 'Rio', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2009),
  ...generateYearVariants({ brand: 'Renault', model: 'Z', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2025),
  ...generateYearVariants({ brand: 'Renault', model: 'Safrane', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1995),
  ...generateYearVariants({ brand: 'Renault', model: 'Symbol', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2013),
  ...generateYearVariants({ brand: 'Renault', model: 'Trafic', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2002),
  ...generateYearVariants({ brand: 'Renault', model: 'Twingo', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2002),
  ...generateYearVariants({ brand: 'Rolls-Royce', model: 'Cullinan', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2021, 2025),
  ...generateYearVariants({ brand: 'Rolls-Royce', model: 'Dawn', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2020),
  ...generateYearVariants({ brand: 'Rolls-Royce', model: 'Ghost', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2025),
  ...generateYearVariants({ brand: 'Rolls-Royce', model: 'Phantom', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2019),
  ...generateYearVariants({ brand: 'Rolls-Royce', model: 'Wraith', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2020),
  ...generateYearVariants({ brand: 'Rover', model: 'Mini', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1995),
  ...generateYearVariants({ brand: 'Saab', model: '9000', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1993),
  ...generateYearVariants({ brand: 'Saturn', model: 'SL-2', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1992),
  ...generateYearVariants({ brand: 'Seat', model: 'Cordoba', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2002),
  ...generateYearVariants({ brand: 'Seat', model: 'Rio', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2002),
  ...generateYearVariants({ brand: 'Seat', model: 'Biz', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2003),
  ...generateYearVariants({ brand: 'Seat', model: 'NC', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2002),
  ...generateYearVariants({ brand: 'Shineray', model: 'SY1020', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2015),
  ...generateYearVariants({ brand: 'Shineray', model: 'A7', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2015),
  ...generateYearVariants({ brand: 'Shineray', model: 'Argo', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2015),
  ...generateYearVariants({ brand: 'Shineray', model: 'SY6390', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2015),
  ...generateYearVariants({ brand: 'Shineray', model: 'X3', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2015),
  ...generateYearVariants({ brand: 'Shineray', model: '50-Q', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'Shineray', model: 'BOLT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2018),
  ...generateYearVariants({ brand: 'Shineray', model: 'PT-02', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2021, 2025),
  ...generateYearVariants({ brand: 'Shineray', model: 'PT-03', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'Shineray', model: 'RETRO', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2020),
  ...generateYearVariants({ brand: 'Shineray', model: 'SE-1', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'Shineray', model: 'SE-2', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2021, 2025),
  ...generateYearVariants({ brand: 'Shineray', model: 'SH', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'Shineray', model: 'SUN', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2015),
  ...generateYearVariants({ brand: 'Shineray', model: 'SUPER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2022),
  ...generateYearVariants({ brand: 'Shineray', model: 'WORKER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'Shineray', model: 'XY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2025),
  ...generateYearVariants({ brand: 'Shineray', model: 'Z', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2012),
  ...generateYearVariants({ brand: 'Shineray', model: 'iX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2025),
  ...generateYearVariants({ brand: 'smart', model: 'Rio', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2015),
  ...generateYearVariants({ brand: 'smart', model: 'fortwo', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2015),
  ...generateYearVariants({ brand: 'SSANGYONG', model: 'ACTYON', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2015),
  ...generateYearVariants({ brand: 'SSANGYONG', model: 'X4', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2018),
  ...generateYearVariants({ brand: 'SSANGYONG', model: 'Chairman', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2002),
  ...generateYearVariants({ brand: 'SSANGYONG', model: 'Istana', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2002),
  ...generateYearVariants({ brand: 'SSANGYONG', model: 'Korando', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2018),
  ...generateYearVariants({ brand: 'SSANGYONG', model: 'Kyron', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2012),
  ...generateYearVariants({ brand: 'SSANGYONG', model: 'Musso', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2002),
  ...generateYearVariants({ brand: 'SSANGYONG', model: 'GLS', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2002),
  ...generateYearVariants({ brand: 'SSANGYONG', model: 'Rexton', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2015),
  ...generateYearVariants({ brand: 'SSANGYONG', model: 'TIVOLI', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2018),
  ...generateYearVariants({ brand: 'SSANGYONG', model: 'XLV', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2018),
  ...generateYearVariants({ brand: 'Subaru', model: 'X4', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2021),
  ...generateYearVariants({ brand: 'Subaru', model: 'Boxer', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2021, 2025),
  ...generateYearVariants({ brand: 'Subaru', model: 'Z', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2016),
  ...generateYearVariants({ brand: 'Subaru', model: 'X2', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2000),
  ...generateYearVariants({ brand: 'Subaru', model: 'Legacy', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2014),
  ...generateYearVariants({ brand: 'Subaru', model: 'GLS', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2002),
  ...generateYearVariants({ brand: 'Subaru', model: 'Outback', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2020),
  ...generateYearVariants({ brand: 'Subaru', model: 'TRIBECA', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2012),
  ...generateYearVariants({ brand: 'Subaru', model: 'Vivio', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1997),
  ...generateYearVariants({ brand: 'Suzuki', model: '500', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2016),
  ...generateYearVariants({ brand: 'Suzuki', model: 'Baleno', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2000),
  ...generateYearVariants({ brand: 'Suzuki', model: 'Gol', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2002),
  ...generateYearVariants({ brand: 'Suzuki', model: 'Ignis', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2003, 2003),
  ...generateYearVariants({ brand: 'Suzuki', model: 'Samurai', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1999),
  ...generateYearVariants({ brand: 'Suzuki', model: 'Sidekick', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1996),
  ...generateYearVariants({ brand: 'Suzuki', model: 'Super', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1995),
  ...generateYearVariants({ brand: 'Suzuki', model: 'Wagon', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 1999),
  ...generateYearVariants({ brand: 'Suzuki', model: 'ADDRESS/AE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2002),
  ...generateYearVariants({ brand: 'Suzuki', model: 'ADDRESS/AG', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2003),
  ...generateYearVariants({ brand: 'Suzuki', model: 'BANDIT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2016),
  ...generateYearVariants({ brand: 'Suzuki', model: 'ADV', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'Suzuki', model: 'DR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2001),
  ...generateYearVariants({ brand: 'Suzuki', model: 'Z4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2012),
  ...generateYearVariants({ brand: 'Suzuki', model: 'EN', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2016),
  ...generateYearVariants({ brand: 'Suzuki', model: 'Argo', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2012),
  ...generateYearVariants({ brand: 'Suzuki', model: 'FREEWIND', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2003),
  ...generateYearVariants({ brand: 'Suzuki', model: 'GLA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2016),
  ...generateYearVariants({ brand: 'Suzuki', model: 'GSR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2017),
  ...generateYearVariants({ brand: 'Suzuki', model: 'Z', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2016),
  ...generateYearVariants({ brand: 'Suzuki', model: 'Intruder', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2016),
  ...generateYearVariants({ brand: 'Suzuki', model: 'Ka', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2002),
  ...generateYearVariants({ brand: 'Suzuki', model: 'Lets', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2003),
  ...generateYearVariants({ brand: 'Suzuki', model: 'LT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2006),
  ...generateYearVariants({ brand: 'Suzuki', model: 'MARAUDER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2005),
  ...generateYearVariants({ brand: 'Suzuki', model: 'RF', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1996),
  ...generateYearVariants({ brand: 'Suzuki', model: 'F 900', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1999),
  ...generateYearVariants({ brand: 'Suzuki', model: 'RM', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 2002),
  ...generateYearVariants({ brand: 'Suzuki', model: 'RMX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 2002),
  ...generateYearVariants({ brand: 'Suzuki', model: 'SAVAGE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2002),
  ...generateYearVariants({ brand: 'Suzuki', model: 'SV650', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2020),
  ...generateYearVariants({ brand: 'Suzuki', model: 'TL', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2002),
  ...generateYearVariants({ brand: 'Suzuki', model: 'VX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1995),
  ...generateYearVariants({ brand: 'TAC', model: 'Stark', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2020),
  ...generateYearVariants({ brand: 'Toyota', model: 'Avalon', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1995),
  ...generateYearVariants({ brand: 'Toyota', model: 'X4', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 1999),
  ...generateYearVariants({ brand: 'Toyota', model: 'Band.Jipe', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 2001),
  ...generateYearVariants({ brand: 'Toyota', model: 'Band.Picape', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 2001),
  ...generateYearVariants({ brand: 'Toyota', model: 'Celica', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1995),
  ...generateYearVariants({ brand: 'Toyota', model: 'Corona', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2000),
  ...generateYearVariants({ brand: 'Toyota', model: 'MR-2', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1994),
  ...generateYearVariants({ brand: 'Toyota', model: 'Paseo', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1996),
  ...generateYearVariants({ brand: 'Toyota', model: 'Previa', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1995),
  ...generateYearVariants({ brand: 'Toyota', model: 'Supra', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2007),
  ...generateYearVariants({ brand: 'Toyota', model: 'T-100', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1995),
  ...generateYearVariants({ brand: 'Troller', model: 'X2', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2007),
  ...generateYearVariants({ brand: 'Troller', model: 'X4', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2021),
  ...generateYearVariants({ brand: 'Volvo', model: '407', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2022),
  ...generateYearVariants({ brand: 'Volvo', model: '440', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1993),
  ...generateYearVariants({ brand: 'Volvo', model: '850', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 1997),
  ...generateYearVariants({ brand: 'Volvo', model: '940', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1995),
  ...generateYearVariants({ brand: 'Volvo', model: '960', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1997),
  ...generateYearVariants({ brand: 'Volvo', model: 'GLE', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1997),
  ...generateYearVariants({ brand: 'Volvo', model: 'C3', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2012),
  ...generateYearVariants({ brand: 'Volvo', model: 'C40', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'Volvo', model: 'Rio', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2011),
  ...generateYearVariants({ brand: 'Volvo', model: 'C70', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2002),
  ...generateYearVariants({ brand: 'Volvo', model: 'S40', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2010),
  ...generateYearVariants({ brand: 'Volvo', model: 'S60', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2022),
  ...generateYearVariants({ brand: 'Volvo', model: 'S70', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2000),
  ...generateYearVariants({ brand: 'Volvo', model: 'S80', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2010),
  ...generateYearVariants({ brand: 'Volvo', model: 'S90', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2022),
  ...generateYearVariants({ brand: 'Volvo', model: 'V40', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2019),
  ...generateYearVariants({ brand: 'Volvo', model: 'V50', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2011),
  ...generateYearVariants({ brand: 'Volvo', model: 'V60', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2020),
  ...generateYearVariants({ brand: 'Volvo', model: 'V70', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2010),
  ...generateYearVariants({ brand: 'Volvo', model: 'XC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2003, 2025),
  ...generateYearVariants({ brand: 'Volvo', model: 'NC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2020),
  ...generateYearVariants({ brand: 'Volvo', model: 'X2', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1983, 2025),
  ...generateYearVariants({ brand: 'Volvo', model: 'X4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1984, 2025),
  ...generateYearVariants({ brand: 'Volvo', model: 'Gol', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1999),
  ...generateYearVariants({ brand: 'Volvo', model: 'City', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2021, 2025),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Bora', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2011),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Caravelle', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2000),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Corrado', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1992),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'EOS', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2012),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Eurovan', fuel: 'diesel', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2000),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Logus', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1997),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'GLS', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1987, 1997),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'New', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2010),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Pointer', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1996),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Quantum', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1987, 2002),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'CG', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1996),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'NC', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1999),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'SpaceCross', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2017),
  ...generateYearVariants({ brand: 'Volkswagen', model: 'Van', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2002),
  ...generateYearVariants({ brand: 'Wake', model: 'Cross', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2021, 2025),
  ...generateYearVariants({ brand: 'Wake', model: 'Street', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'Wake', model: 'Way', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2025),
  ...generateYearVariants({ brand: 'Walk', model: 'Buggy', fuel: 'gasoline', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2025),
  ...generateYearVariants({ brand: 'ADLY', model: 'ATV', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2002),
  ...generateYearVariants({ brand: 'ADLY', model: 'JAGUAR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2001),
  ...generateYearVariants({ brand: 'ADLY', model: 'RT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2001),
  ...generateYearVariants({ brand: 'AMAZONAS', model: 'iX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2009),
  ...generateYearVariants({ brand: 'AMAZONAS', model: 'AME-150', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2009),
  ...generateYearVariants({ brand: 'AMAZONAS', model: 'AME-250', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2009),
  ...generateYearVariants({ brand: 'AMAZONAS', model: 'AME-LX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2009),
  ...generateYearVariants({ brand: 'APRILIA', model: 'AREA-51', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2000),
  ...generateYearVariants({ brand: 'APRILIA', model: 'Classic', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2000),
  ...generateYearVariants({ brand: 'APRILIA', model: 'LEONARDO', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2000),
  ...generateYearVariants({ brand: 'APRILIA', model: 'MOTO', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2000),
  ...generateYearVariants({ brand: 'APRILIA', model: 'PEGASO', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2002),
  ...generateYearVariants({ brand: 'APRILIA', model: 'RALLY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2001),
  ...generateYearVariants({ brand: 'APRILIA', model: 'RS', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2001),
  ...generateYearVariants({ brand: 'APRILIA', model: 'RSV', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2000),
  ...generateYearVariants({ brand: 'APRILIA', model: 'RX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2000),
  ...generateYearVariants({ brand: 'APRILIA', model: 'SCARABEO', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2000),
  ...generateYearVariants({ brand: 'APRILIA', model: 'SONIC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2000),
  ...generateYearVariants({ brand: 'APRILIA', model: 'SR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2020),
  ...generateYearVariants({ brand: 'APRILIA', model: 'SXR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'ATALA', model: 'CALIFFONE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2003),
  ...generateYearVariants({ brand: 'ATALA', model: 'Master', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2003),
  ...generateYearVariants({ brand: 'ATALA', model: 'SKEGIA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2003),
  ...generateYearVariants({ brand: 'AVELLOZ', model: 'Z', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2021, 2025),
  ...generateYearVariants({ brand: 'BAJAJ', model: 'CHAMPION', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1998),
  ...generateYearVariants({ brand: 'BAJAJ', model: 'Classic', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 1998),
  ...generateYearVariants({ brand: 'BAJAJ', model: 'DOMINAR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'BEE', model: 'BEE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2020),
  ...generateYearVariants({ brand: 'BEE', model: 'Monaco', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2020),
  ...generateYearVariants({ brand: 'Benelli', model: 'TNT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2014),
  ...generateYearVariants({ brand: 'Benelli', model: 'TRE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2014),
  ...generateYearVariants({ brand: 'Benelli', model: 'Z', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2014),
  ...generateYearVariants({ brand: 'BETA', model: 'MX-50', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2002),
  ...generateYearVariants({ brand: 'BIMOTA', model: 'DB4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2000),
  ...generateYearVariants({ brand: 'BIMOTA', model: 'DB5R', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2010),
  ...generateYearVariants({ brand: 'BIMOTA', model: 'Rio', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2011),
  ...generateYearVariants({ brand: 'BIMOTA', model: 'DB7', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2011),
  ...generateYearVariants({ brand: 'BIMOTA', model: 'MANTRA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2000),
  ...generateYearVariants({ brand: 'BIMOTA', model: 'R8', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2000),
  ...generateYearVariants({ brand: 'BIMOTA', model: 'Tesi', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2010),
  ...generateYearVariants({ brand: 'BRANDY', model: 'ELEGANT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1996),
  ...generateYearVariants({ brand: 'BRANDY', model: 'FOSTI', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1999),
  ...generateYearVariants({ brand: 'BRANDY', model: 'PISTA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1996),
  ...generateYearVariants({ brand: 'BRANDY', model: 'TURBO', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1995),
  ...generateYearVariants({ brand: 'BRANDY', model: 'Z', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1996),
  ...generateYearVariants({ brand: 'BRAVA', model: 'YB', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2008),
  ...generateYearVariants({ brand: 'BRP', model: '500', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2015),
  ...generateYearVariants({ brand: 'BRP', model: 'X4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2025),
  ...generateYearVariants({ brand: 'BRP', model: 'X2', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2025),
  ...generateYearVariants({ brand: 'BRP', model: 'X3', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2021, 2025),
  ...generateYearVariants({ brand: 'BRP', model: 'Maverick', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2025),
  ...generateYearVariants({ brand: 'BRP', model: 'Outlander', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2025),
  ...generateYearVariants({ brand: 'BRP', model: 'can-am', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2019),
  ...generateYearVariants({ brand: 'BUELL', model: '1125CR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2009),
  ...generateYearVariants({ brand: 'BUELL', model: '1125R', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2008),
  ...generateYearVariants({ brand: 'BUELL', model: 'FIREBOLT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2008),
  ...generateYearVariants({ brand: 'BUELL', model: 'City', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2009),
  ...generateYearVariants({ brand: 'BUELL', model: 'LIGHTNING', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2009),
  ...generateYearVariants({ brand: 'BUELL', model: 'CG', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2008),
  ...generateYearVariants({ brand: 'BUELL', model: 'TT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2008),
  ...generateYearVariants({ brand: 'BUELL', model: 'ULYSSES', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2009),
  ...generateYearVariants({ brand: 'BUENO', model: 'JBr', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2012),
  ...generateYearVariants({ brand: 'BULL', model: 'BM-S', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2021),
  ...generateYearVariants({ brand: 'BULL', model: 'BM-T180', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2021),
  ...generateYearVariants({ brand: 'BULL', model: 'Café', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2019),
  ...generateYearVariants({ brand: 'BULL', model: 'City', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2022),
  ...generateYearVariants({ brand: 'BULL', model: 'Eko', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2025),
  ...generateYearVariants({ brand: 'BULL', model: 'GTR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2019),
  ...generateYearVariants({ brand: 'BULL', model: 'KHRISMA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2022),
  ...generateYearVariants({ brand: 'BULL', model: 'KRC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2025),
  ...generateYearVariants({ brand: 'BULL', model: 'MAXX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2019),
  ...generateYearVariants({ brand: 'BULL', model: 'NOW', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2021),
  ...generateYearVariants({ brand: 'BULL', model: 'Spirit', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'byCristo', model: 'Triciclo', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2015),
  ...generateYearVariants({ brand: 'CAGIVA', model: '500', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2002),
  ...generateYearVariants({ brand: 'CAGIVA', model: 'ELEFANT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1995),
  ...generateYearVariants({ brand: 'CAGIVA', model: 'GRAN', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2000),
  ...generateYearVariants({ brand: 'CAGIVA', model: 'MITO', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2001),
  ...generateYearVariants({ brand: 'CAGIVA', model: 'NAVIGATOR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2001),
  ...generateYearVariants({ brand: 'CAGIVA', model: 'PLANET', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 1999),
  ...generateYearVariants({ brand: 'CAGIVA', model: 'ROADSTER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2000),
  ...generateYearVariants({ brand: 'CAGIVA', model: 'V-RAPTOR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2002),
  ...generateYearVariants({ brand: 'CAGIVA', model: 'W-16', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2000),
  ...generateYearVariants({ brand: 'CALOI', model: 'Mobi', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 2002),
  ...generateYearVariants({ brand: 'CALOI', model: 'MONDO', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1998),
  ...generateYearVariants({ brand: 'DAELIM', model: 'ALTINO', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2002),
  ...generateYearVariants({ brand: 'DAELIM', model: 'MESSAGE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 1999),
  ...generateYearVariants({ brand: 'DAELIM', model: 'ADV', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1996),
  ...generateYearVariants({ brand: 'DAELIM', model: 'VF', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1996),
  ...generateYearVariants({ brand: 'DAELIM', model: 'VS', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 1999),
  ...generateYearVariants({ brand: 'DAELIM', model: 'VT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 1999),
  ...generateYearVariants({ brand: 'DAELIM', model: 'VX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1996),
  ...generateYearVariants({ brand: 'Dafra', model: 'APACHE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2025),
  ...generateYearVariants({ brand: 'Dafra', model: 'City', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2025),
  ...generateYearVariants({ brand: 'Dafra', model: 'CRUISYM', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'Dafra', model: 'FIDDLE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2018),
  ...generateYearVariants({ brand: 'Dafra', model: 'Z', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2022),
  ...generateYearVariants({ brand: 'Dafra', model: 'Ka', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2015),
  ...generateYearVariants({ brand: 'Dafra', model: 'LASER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2010),
  ...generateYearVariants({ brand: 'Dafra', model: 'MAXSYM', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2025),
  ...generateYearVariants({ brand: 'Dafra', model: 'NEXT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2020),
  ...generateYearVariants({ brand: 'Dafra', model: 'NH', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'Dafra', model: 'RIVA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2017),
  ...generateYearVariants({ brand: 'Dafra', model: 'Argo', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2016),
  ...generateYearVariants({ brand: 'Dafra', model: 'ROADWIN', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2015),
  ...generateYearVariants({ brand: 'Dafra', model: 'SMART', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2015),
  ...generateYearVariants({ brand: 'Dafra', model: 'SPEED', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2015),
  ...generateYearVariants({ brand: 'Dafra', model: 'SUPER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2017),
  ...generateYearVariants({ brand: 'DAYANG', model: 'DY100-31', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2008),
  ...generateYearVariants({ brand: 'DAYANG', model: 'DY110-20', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2010),
  ...generateYearVariants({ brand: 'DAYANG', model: 'DY125', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2015),
  ...generateYearVariants({ brand: 'DAYANG', model: 'DY125-18', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2008),
  ...generateYearVariants({ brand: 'DAYANG', model: 'DY125-36A', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2008),
  ...generateYearVariants({ brand: 'DAYANG', model: 'DY125-37', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2010),
  ...generateYearVariants({ brand: 'DAYANG', model: 'DY125-5', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2008),
  ...generateYearVariants({ brand: 'DAYANG', model: 'DY125-52', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2014),
  ...generateYearVariants({ brand: 'DAYANG', model: 'DY150-12', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2009),
  ...generateYearVariants({ brand: 'DAYANG', model: 'DY150-28', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2016),
  ...generateYearVariants({ brand: 'DAYANG', model: 'GLE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2015),
  ...generateYearVariants({ brand: 'DAYANG', model: 'DY200', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2015),
  ...generateYearVariants({ brand: 'DAYANG', model: 'DY250', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2015),
  ...generateYearVariants({ brand: 'DAYANG', model: 'DY50', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2015),
  ...generateYearVariants({ brand: 'DAYANG', model: 'Rio', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2015),
  ...generateYearVariants({ brand: 'DAYANG', model: 'THOR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2016),
  ...generateYearVariants({ brand: 'DAYUN', model: 'DY110-6', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2011),
  ...generateYearVariants({ brand: 'DAYUN', model: 'DY125-8', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2008),
  ...generateYearVariants({ brand: 'DAYUN', model: 'DY125T-10', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2011),
  ...generateYearVariants({ brand: 'DAYUN', model: 'DY150-7', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2011),
  ...generateYearVariants({ brand: 'DAYUN', model: 'DY150-9', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2011),
  ...generateYearVariants({ brand: 'DAYUN', model: 'DY150GY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2011),
  ...generateYearVariants({ brand: 'DAYUN', model: 'Z', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2011),
  ...generateYearVariants({ brand: 'DAYUN', model: 'DY250-2', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2008),
  ...generateYearVariants({ brand: 'DERBI', model: 'ATLANTIS', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2001),
  ...generateYearVariants({ brand: 'DERBI', model: 'GPR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2001),
  ...generateYearVariants({ brand: 'DERBI', model: 'PREDATOR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2001),
  ...generateYearVariants({ brand: 'DERBI', model: 'RED', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2001),
  ...generateYearVariants({ brand: 'DERBI', model: 'REPLICAS', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2001),
  ...generateYearVariants({ brand: 'DERBI', model: 'SENDA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2001),
  ...generateYearVariants({ brand: 'Ducati', model: '749', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2006),
  ...generateYearVariants({ brand: 'Ducati', model: '848', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2013),
  ...generateYearVariants({ brand: 'Ducati', model: '996', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2001),
  ...generateYearVariants({ brand: 'Ducati', model: '998', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2003),
  ...generateYearVariants({ brand: 'Ducati', model: '999', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2006),
  ...generateYearVariants({ brand: 'Ducati', model: '1098', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2008),
  ...generateYearVariants({ brand: 'Ducati', model: '1198', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2011),
  ...generateYearVariants({ brand: 'Ducati', model: '1199', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2014),
  ...generateYearVariants({ brand: 'Ducati', model: '999R', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2006),
  ...generateYearVariants({ brand: 'Ducati', model: 'DESMOSEDICI', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2008),
  ...generateYearVariants({ brand: 'Ducati', model: 'TT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2018),
  ...generateYearVariants({ brand: 'Ducati', model: 'Classic', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2018),
  ...generateYearVariants({ brand: 'Ducati', model: 'SS', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2001),
  ...generateYearVariants({ brand: 'Ducati', model: 'ST-2', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2003),
  ...generateYearVariants({ brand: 'Ducati', model: 'ST-4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2005),
  ...generateYearVariants({ brand: 'Ducati', model: 'SUPER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2019),
  ...generateYearVariants({ brand: 'EMME', model: 'MIRAGE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1999),
  ...generateYearVariants({ brand: 'EMME', model: 'ONE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 1999),
  ...generateYearVariants({ brand: 'FOX', model: 'ADV', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2009),
  ...generateYearVariants({ brand: 'FOX', model: 'Elite', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2009),
  ...generateYearVariants({ brand: 'FUSCO MOTOSEGURA', model: 'CARGA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2025),
  ...generateYearVariants({ brand: 'FYM', model: 'FY100-10A', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2009),
  ...generateYearVariants({ brand: 'FYM', model: 'FY125-19', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2008),
  ...generateYearVariants({ brand: 'FYM', model: 'FY125-20', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2008),
  ...generateYearVariants({ brand: 'FYM', model: 'FY125EY-2', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2008),
  ...generateYearVariants({ brand: 'FYM', model: 'FY125Y-3', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2007),
  ...generateYearVariants({ brand: 'FYM', model: 'FY150-3', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2008),
  ...generateYearVariants({ brand: 'FYM', model: 'FY150T-18', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2008),
  ...generateYearVariants({ brand: 'FYM', model: 'FY250', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2009),
  ...generateYearVariants({ brand: 'GARINNI', model: 'GR08T4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2007),
  ...generateYearVariants({ brand: 'GARINNI', model: 'R1', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2011),
  ...generateYearVariants({ brand: 'GARINNI', model: 'GR250T3', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2009),
  ...generateYearVariants({ brand: 'GAS GAS', model: 'EC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2015),
  ...generateYearVariants({ brand: 'GAS GAS', model: 'MC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2004),
  ...generateYearVariants({ brand: 'GAS GAS', model: 'PAMPERA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2002),
  ...generateYearVariants({ brand: 'GAS GAS', model: 'TX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2008),
  ...generateYearVariants({ brand: 'GAS GAS', model: 'TXT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2002),
  ...generateYearVariants({ brand: 'GREEN', model: 'EASY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2007),
  ...generateYearVariants({ brand: 'GREEN', model: 'RUNNER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2007),
  ...generateYearVariants({ brand: 'GREEN', model: 'SAFARI', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2007),
  ...generateYearVariants({ brand: 'GREEN', model: 'SPORT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2008),
  ...generateYearVariants({ brand: 'HAOBAO', model: 'HB', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2014),
  ...generateYearVariants({ brand: 'HAOBAO', model: 'HB110-3', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2014),
  ...generateYearVariants({ brand: 'HAOBAO', model: 'HB125-9', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2014),
  ...generateYearVariants({ brand: 'HAOBAO', model: 'HB150', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2014),
  ...generateYearVariants({ brand: 'HAOBAO', model: 'HB150-T', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2011),
  ...generateYearVariants({ brand: 'Haojue', model: 'CHOPPER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2025),
  ...generateYearVariants({ brand: 'Haojue', model: 'DK', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2025),
  ...generateYearVariants({ brand: 'Haojue', model: 'DR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2021, 2025),
  ...generateYearVariants({ brand: 'Haojue', model: 'LINDY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2025),
  ...generateYearVariants({ brand: 'Haojue', model: 'Master', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'Haojue', model: 'NEX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2025),
  ...generateYearVariants({ brand: 'Haojue', model: 'NK', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'Haojue', model: 'VR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2021, 2025),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'BLACKLINE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2013),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'CVO', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2025),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'Versa', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2025),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'CLA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2012),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'DEUCE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2005),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'DYNA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2014),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'Classic', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2025),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'Electra Glide', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2019),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'GLE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2008),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'FLHTCU', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1999),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'HERITAGE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2010),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'NIGHT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2016),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'NIGHTSTER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'SWITCHBACK', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2014),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'CB', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2017),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'V-ROD', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2016),
  ...generateYearVariants({ brand: 'Harley-Davidson', model: 'XL', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 2018),
  ...generateYearVariants({ brand: 'HARTFORD', model: 'LEGION', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2000),
  ...generateYearVariants({ brand: 'HERO', model: 'ANKUR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1998),
  ...generateYearVariants({ brand: 'HERO', model: 'PUCH', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2002),
  ...generateYearVariants({ brand: 'HERO', model: 'STREAM', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2002),
  ...generateYearVariants({ brand: 'HUSABERG', model: '500', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2003),
  ...generateYearVariants({ brand: 'HUSABERG', model: 'FE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2008),
  ...generateYearVariants({ brand: 'HUSQVARNA', model: '701', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2025),
  ...generateYearVariants({ brand: 'HUSQVARNA', model: 'CR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2001),
  ...generateYearVariants({ brand: 'HUSQVARNA', model: 'HUSQY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2002),
  ...generateYearVariants({ brand: 'HUSQVARNA', model: 'NORDEN', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'HUSQVARNA', model: 'SM', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2008),
  ...generateYearVariants({ brand: 'HUSQVARNA', model: 'SMR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2008),
  ...generateYearVariants({ brand: 'HUSQVARNA', model: 'SVARTPILEN', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2019),
  ...generateYearVariants({ brand: 'HUSQVARNA', model: 'TC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2001),
  ...generateYearVariants({ brand: 'HUSQVARNA', model: 'TE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2025),
  ...generateYearVariants({ brand: 'HUSQVARNA', model: 'VITPILEN', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2018),
  ...generateYearVariants({ brand: 'HUSQVARNA', model: 'WR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2004),
  ...generateYearVariants({ brand: 'HUSQVARNA', model: 'WRE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1996),
  ...generateYearVariants({ brand: 'INDIAN', model: 'CHIEF', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2018),
  ...generateYearVariants({ brand: 'INDIAN', model: 'Classic', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2017),
  ...generateYearVariants({ brand: 'INDIAN', model: 'CHIEFTAIN', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2018),
  ...generateYearVariants({ brand: 'INDIAN', model: 'Master', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2018),
  ...generateYearVariants({ brand: 'INDIAN', model: 'SCOUT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2018),
  ...generateYearVariants({ brand: 'IROS', model: 'ACTION', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2012),
  ...generateYearVariants({ brand: 'IROS', model: 'Brave', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2011),
  ...generateYearVariants({ brand: 'IROS', model: 'iX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2011),
  ...generateYearVariants({ brand: 'IROS', model: 'MOVING', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2013),
  ...generateYearVariants({ brand: 'IROS', model: 'ONE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2013),
  ...generateYearVariants({ brand: 'IROS', model: 'VINTAGE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2012),
  ...generateYearVariants({ brand: 'IROS', model: 'Rio', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2009),
  ...generateYearVariants({ brand: 'JIAPENG VOLCANO', model: 'JP', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2009),
  ...generateYearVariants({ brand: 'JOHNNYPAG', model: 'BARHOG', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2011),
  ...generateYearVariants({ brand: 'JOHNNYPAG', model: 'Street', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2010),
  ...generateYearVariants({ brand: 'JOHNNYPAG', model: 'SPYDER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2011),
  ...generateYearVariants({ brand: 'JONNY', model: 'ATLANTIC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2011),
  ...generateYearVariants({ brand: 'JONNY', model: 'HYPE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2014),
  ...generateYearVariants({ brand: 'JONNY', model: 'JONNY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2013),
  ...generateYearVariants({ brand: 'JONNY', model: 'Meet', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2014),
  ...generateYearVariants({ brand: 'JONNY', model: 'Naked', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2012),
  ...generateYearVariants({ brand: 'JONNY', model: 'Orbit', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2011),
  ...generateYearVariants({ brand: 'JONNY', model: 'PEGASUS', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2011),
  ...generateYearVariants({ brand: 'JONNY', model: 'QUICK', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2014),
  ...generateYearVariants({ brand: 'JONNY', model: 'RACER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2013),
  ...generateYearVariants({ brand: 'JONNY', model: 'TEXAS', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2013),
  ...generateYearVariants({ brand: 'JONNY', model: 'TR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2012),
  ...generateYearVariants({ brand: 'KAHENA', model: '125', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2011),
  ...generateYearVariants({ brand: 'KAHENA', model: '250', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2011),
  ...generateYearVariants({ brand: 'Kasinski', model: 'COMET', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2013),
  ...generateYearVariants({ brand: 'Kasinski', model: 'CRUISE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2006),
  ...generateYearVariants({ brand: 'Kasinski', model: 'Z', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2013),
  ...generateYearVariants({ brand: 'Kasinski', model: 'ERO', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2005),
  ...generateYearVariants({ brand: 'Kasinski', model: 'SH', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2008),
  ...generateYearVariants({ brand: 'Kasinski', model: 'FÚRIA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2003, 2003),
  ...generateYearVariants({ brand: 'Kasinski', model: 'GF', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2005),
  ...generateYearVariants({ brand: 'Kasinski', model: 'GV', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2013),
  ...generateYearVariants({ brand: 'Kasinski', model: 'MAGIK', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2003),
  ...generateYearVariants({ brand: 'Kasinski', model: 'MIDAS', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2004),
  ...generateYearVariants({ brand: 'Kasinski', model: 'MIRAGE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2013),
  ...generateYearVariants({ brand: 'Kasinski', model: 'Ka', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2004),
  ...generateYearVariants({ brand: 'Kasinski', model: 'PRIMA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2013),
  ...generateYearVariants({ brand: 'Kasinski', model: 'RX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2004),
  ...generateYearVariants({ brand: 'Kasinski', model: 'SETA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2009),
  ...generateYearVariants({ brand: 'Kasinski', model: 'SOFT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2013),
  ...generateYearVariants({ brand: 'Kasinski', model: 'SUPER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2006),
  ...generateYearVariants({ brand: 'Kasinski', model: 'TN', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1996),
  ...generateYearVariants({ brand: 'Kasinski', model: 'WAY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2009),
  ...generateYearVariants({ brand: 'Kasinski', model: 'WIN', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2013),
  ...generateYearVariants({ brand: 'Kawasaki', model: '500', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2002),
  ...generateYearVariants({ brand: 'Kawasaki', model: 'Classic', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2015),
  ...generateYearVariants({ brand: 'Kawasaki', model: 'NC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2013),
  ...generateYearVariants({ brand: 'Kawasaki', model: 'Tracker', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2011),
  ...generateYearVariants({ brand: 'Kawasaki', model: 'ER-6N', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2017),
  ...generateYearVariants({ brand: 'Kawasaki', model: 'KLX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2025),
  ...generateYearVariants({ brand: 'Kawasaki', model: 'KX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2025),
  ...generateYearVariants({ brand: 'Kawasaki', model: 'MAXI', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1999),
  ...generateYearVariants({ brand: 'Kawasaki', model: 'City', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2012),
  ...generateYearVariants({ brand: 'Kawasaki', model: 'Voyage', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1999),
  ...generateYearVariants({ brand: 'Kawasaki', model: 'Versa', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'KTM', model: '690', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2017),
  ...generateYearVariants({ brand: 'KTM', model: '1190', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2011),
  ...generateYearVariants({ brand: 'KTM', model: 'ADV', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2019),
  ...generateYearVariants({ brand: 'KTM', model: 'Ka', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2011),
  ...generateYearVariants({ brand: 'KTM', model: 'DUKE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2025),
  ...generateYearVariants({ brand: 'KTM', model: 'EXC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2025),
  ...generateYearVariants({ brand: 'KTM', model: 'EXC-F', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2025),
  ...generateYearVariants({ brand: 'KTM', model: 'iX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2025),
  ...generateYearVariants({ brand: 'KTM', model: 'LC4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2002),
  ...generateYearVariants({ brand: 'KTM', model: 'SC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 1998),
  ...generateYearVariants({ brand: 'KTM', model: 'SUPERDUKE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2017),
  ...generateYearVariants({ brand: 'KTM', model: 'SUPERMOTO', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2012),
  ...generateYearVariants({ brand: 'KTM', model: 'SX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2025),
  ...generateYearVariants({ brand: 'KTM', model: 'SXC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2008),
  ...generateYearVariants({ brand: 'KYMCO', model: 'AGILITY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'KYMCO', model: 'AK', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'KYMCO', model: 'DJW', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2002),
  ...generateYearVariants({ brand: 'KYMCO', model: 'DOWNTOWN', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2025),
  ...generateYearVariants({ brand: 'KYMCO', model: 'M´BOY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2002),
  ...generateYearVariants({ brand: 'KYMCO', model: 'PEOPLE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2025),
  ...generateYearVariants({ brand: 'KYMCO', model: 'Z', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2003),
  ...generateYearVariants({ brand: 'LANDUM', model: 'Z', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2007),
  ...generateYearVariants({ brand: 'LAQUILA', model: 'AKROS', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2000),
  ...generateYearVariants({ brand: 'LAQUILA', model: 'ERGON', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2001),
  ...generateYearVariants({ brand: 'LAQUILA', model: 'iX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2001),
  ...generateYearVariants({ brand: 'LAQUILA', model: 'Palio', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2001),
  ...generateYearVariants({ brand: 'LAVRALE', model: 'TT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 1993),
  ...generateYearVariants({ brand: 'LERIVO', model: 'Formigão', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2008),
  ...generateYearVariants({ brand: 'Lon-V', model: 'DELUXE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2013),
  ...generateYearVariants({ brand: 'Lon-V', model: 'TT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2010),
  ...generateYearVariants({ brand: 'Lon-V', model: 'LY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2013),
  ...generateYearVariants({ brand: 'Lon-V', model: 'Classic', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2009),
  ...generateYearVariants({ brand: 'MAGRÃO TRICICLOS', model: 'Pop', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2016),
  ...generateYearVariants({ brand: 'MAGRÃO TRICICLOS', model: 'MT7', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2019),
  ...generateYearVariants({ brand: 'Malaguti', model: '500', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2008),
  ...generateYearVariants({ brand: 'Malaguti', model: 'Master', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2007),
  ...generateYearVariants({ brand: 'MIZA', model: 'DRAGO', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2011),
  ...generateYearVariants({ brand: 'MIZA', model: 'EASY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2011),
  ...generateYearVariants({ brand: 'MIZA', model: 'FAST', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2011),
  ...generateYearVariants({ brand: 'MIZA', model: 'Skema', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2011),
  ...generateYearVariants({ brand: 'MIZA', model: 'VITE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2011),
  ...generateYearVariants({ brand: 'MOTO GUZZI', model: 'CALIFORNIA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2003),
  ...generateYearVariants({ brand: 'MOTO GUZZI', model: 'Ka', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2001),
  ...generateYearVariants({ brand: 'MOTO GUZZI', model: 'QUOTA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2001),
  ...generateYearVariants({ brand: 'MOTO GUZZI', model: 'V11', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2003),
  ...generateYearVariants({ brand: 'MOTOCAR', model: 'MCA-200', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2016),
  ...generateYearVariants({ brand: 'MOTOCAR', model: 'MCA-250', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2017),
  ...generateYearVariants({ brand: 'MOTOCAR', model: 'MCF-200', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2016),
  ...generateYearVariants({ brand: 'MOTOCAR', model: 'F-250', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2018),
  ...generateYearVariants({ brand: 'MOTOCAR', model: 'MTX-150', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2016),
  ...generateYearVariants({ brand: 'MOTORINO', model: 'Bacio', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2014),
  ...generateYearVariants({ brand: 'MOTORINO', model: 'Bellavita', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2015),
  ...generateYearVariants({ brand: 'MOTORINO', model: 'Cappuccino', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2015),
  ...generateYearVariants({ brand: 'MOTORINO', model: 'Cappuccino150cc', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2025),
  ...generateYearVariants({ brand: 'MOTORINO', model: 'Custom', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2016),
  ...generateYearVariants({ brand: 'MOTORINO', model: 'Lambreta', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2019),
  ...generateYearVariants({ brand: 'MOTORINO', model: 'Star', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2015),
  ...generateYearVariants({ brand: 'MOTORINO', model: 'TT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2019),
  ...generateYearVariants({ brand: 'MOTORINO', model: 'Velvet', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2021),
  ...generateYearVariants({ brand: 'MOTORINO', model: 'Vitesse', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2015),
  ...generateYearVariants({ brand: 'MOTORINO', model: 'Volti', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2015),
  ...generateYearVariants({ brand: 'MRX', model: '230R', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2010),
  ...generateYearVariants({ brand: 'MV AGUSTA', model: 'BRUTALE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2016),
  ...generateYearVariants({ brand: 'MV AGUSTA', model: 'F3', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2016),
  ...generateYearVariants({ brand: 'MV AGUSTA', model: 'F4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2009),
  ...generateYearVariants({ brand: 'MV AGUSTA', model: 'R3', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2008),
  ...generateYearVariants({ brand: 'MV AGUSTA', model: 'F4-1000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2015),
  ...generateYearVariants({ brand: 'MV AGUSTA', model: 'RIVALE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2015),
  ...generateYearVariants({ brand: 'MVK', model: 'BIG', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2011),
  ...generateYearVariants({ brand: 'MVK', model: 'BLACK', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2011),
  ...generateYearVariants({ brand: 'MVK', model: 'BRX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2011),
  ...generateYearVariants({ brand: 'MVK', model: 'DUAL', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2008),
  ...generateYearVariants({ brand: 'MVK', model: 'Gol', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2009),
  ...generateYearVariants({ brand: 'MVK', model: 'Fox', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2011),
  ...generateYearVariants({ brand: 'MVK', model: 'GO', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2007),
  ...generateYearVariants({ brand: 'MVK', model: 'iX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2011),
  ...generateYearVariants({ brand: 'MVK', model: 'HALLEY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2006),
  ...generateYearVariants({ brand: 'MVK', model: 'JURASIC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2011),
  ...generateYearVariants({ brand: 'MVK', model: 'MA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2007),
  ...generateYearVariants({ brand: 'MVK', model: 'MA/', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2009),
  ...generateYearVariants({ brand: 'MVK', model: 'SIMBA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2011),
  ...generateYearVariants({ brand: 'MVK', model: 'SPORT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2013),
  ...generateYearVariants({ brand: 'MVK', model: 'SPYDER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2009),
  ...generateYearVariants({ brand: 'MVK', model: 'Street', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2013),
  ...generateYearVariants({ brand: 'MVK', model: 'SUPER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2011),
  ...generateYearVariants({ brand: 'MVK', model: 'XRT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2008),
  ...generateYearVariants({ brand: 'NIU', model: '500', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2021, 2025),
  ...generateYearVariants({ brand: 'NIU', model: 'NQI', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2021, 2025),
  ...generateYearVariants({ brand: 'NIU', model: 'UQI', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2021, 2025),
  ...generateYearVariants({ brand: 'ORCA', model: 'AX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 1998),
  ...generateYearVariants({ brand: 'ORCA', model: 'JC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 1998),
  ...generateYearVariants({ brand: 'ORCA', model: 'QM', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 1998),
  ...generateYearVariants({ brand: 'PEGASSI', model: 'BR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2009),
  ...generateYearVariants({ brand: 'PEUGEOT', model: 'BUXY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1998),
  ...generateYearVariants({ brand: 'PEUGEOT', model: 'ELYSEO', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2000),
  ...generateYearVariants({ brand: 'PEUGEOT', model: 'SCOOT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1998),
  ...generateYearVariants({ brand: 'PEUGEOT', model: 'SPEEDAKE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1999),
  ...generateYearVariants({ brand: 'PEUGEOT', model: 'SPEEDFIGHT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2000),
  ...generateYearVariants({ brand: 'PEUGEOT', model: 'SQUAB', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1998),
  ...generateYearVariants({ brand: 'PEUGEOT', model: 'TREKKER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2000),
  ...generateYearVariants({ brand: 'PEUGEOT', model: 'City', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2000),
  ...generateYearVariants({ brand: 'PEUGEOT', model: 'Z', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1999),
  ...generateYearVariants({ brand: 'PIAGGIO', model: '500', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2013),
  ...generateYearVariants({ brand: 'PIAGGIO', model: 'Touring', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2017),
  ...generateYearVariants({ brand: 'PIAGGIO', model: 'BEVERLY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2009),
  ...generateYearVariants({ brand: 'PIAGGIO', model: 'Liberty', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2016),
  ...generateYearVariants({ brand: 'PIAGGIO', model: 'MP3', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2013),
  ...generateYearVariants({ brand: 'PIAGGIO', model: 'C3', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2005),
  ...generateYearVariants({ brand: 'PIAGGIO', model: 'RUNNER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 1999),
  ...generateYearVariants({ brand: 'PIAGGIO', model: 'Rio', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2017),
  ...generateYearVariants({ brand: 'PIAGGIO', model: 'Classic', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2023),
  ...generateYearVariants({ brand: 'PIAGGIO', model: 'VESPA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 2022),
  ...generateYearVariants({ brand: 'PIAGGIO', model: 'Z', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2023),
  ...generateYearVariants({ brand: 'PIAGGIO', model: 'TT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2023),
  ...generateYearVariants({ brand: 'POLARIS', model: 'X4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2025),
  ...generateYearVariants({ brand: 'POLARIS', model: 'General', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'POLARIS', model: 'Ranger', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2025),
  ...generateYearVariants({ brand: 'POLARIS', model: 'S10', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2020),
  ...generateYearVariants({ brand: 'REGAL RAPTOR', model: 'BLACK', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2011),
  ...generateYearVariants({ brand: 'REGAL RAPTOR', model: 'Gol', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2012),
  ...generateYearVariants({ brand: 'REGAL RAPTOR', model: 'GHOST', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2011),
  ...generateYearVariants({ brand: 'REGAL RAPTOR', model: 'SPYDER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2014),
  ...generateYearVariants({ brand: 'RIGUETE', model: 'TRC-01', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2025),
  ...generateYearVariants({ brand: 'Royal Enfield', model: '500', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2020),
  ...generateYearVariants({ brand: 'Royal Enfield', model: 'Classic', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2025),
  ...generateYearVariants({ brand: 'Royal Enfield', model: 'Continental', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2025),
  ...generateYearVariants({ brand: 'Royal Enfield', model: 'Himalayan', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2025),
  ...generateYearVariants({ brand: 'Royal Enfield', model: 'Interceptor', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2025),
  ...generateYearVariants({ brand: 'Royal Enfield', model: 'Meteor', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'Royal Enfield', model: 'Scram', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'SANYANG', model: 'ENJOY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1998),
  ...generateYearVariants({ brand: 'SANYANG', model: 'HUSKY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1998),
  ...generateYearVariants({ brand: 'SANYANG', model: 'PASSING', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1998),
  ...generateYearVariants({ brand: 'SIAMOTO', model: 'SCROSS', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2000),
  ...generateYearVariants({ brand: 'SUNDOWN', model: 'AKROS', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1998),
  ...generateYearVariants({ brand: 'SUNDOWN', model: 'ERGON', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1998),
  ...generateYearVariants({ brand: 'SUNDOWN', model: 'FIFTY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2005),
  ...generateYearVariants({ brand: 'SUNDOWN', model: 'FUTURE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2013),
  ...generateYearVariants({ brand: 'SUNDOWN', model: 'HUNTER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2011),
  ...generateYearVariants({ brand: 'SUNDOWN', model: 'MAX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2004, 2014),
  ...generateYearVariants({ brand: 'SUNDOWN', model: 'Palio', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1998),
  ...generateYearVariants({ brand: 'SUNDOWN', model: 'PGO', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1998),
  ...generateYearVariants({ brand: 'SUNDOWN', model: 'STX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2011),
  ...generateYearVariants({ brand: 'SUNDOWN', model: 'SUPER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1998),
  ...generateYearVariants({ brand: 'SUNDOWN', model: 'VBLADE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2008),
  ...generateYearVariants({ brand: 'SUNDOWN', model: 'WEB', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2014),
  ...generateYearVariants({ brand: 'SUPER SOCO', model: 'Change', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2021),
  ...generateYearVariants({ brand: 'SUPER SOCO', model: 'CUX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'SUPER SOCO', model: 'TC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'SUPER SOCO', model: 'TSX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'TARGOS', model: 'TRIMOTO', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2011),
  ...generateYearVariants({ brand: 'TIGER', model: 'Argo', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2015),
  ...generateYearVariants({ brand: 'TRAXX', model: 'CJ', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2000),
  ...generateYearVariants({ brand: 'TRAXX', model: 'DUNNA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2012),
  ...generateYearVariants({ brand: 'TRAXX', model: 'JH', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2017),
  ...generateYearVariants({ brand: 'TRAXX', model: 'SH', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2011),
  ...generateYearVariants({ brand: 'TRAXX', model: 'NC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2007),
  ...generateYearVariants({ brand: 'TRAXX', model: 'JL', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2003, 2017),
  ...generateYearVariants({ brand: 'TRAXX', model: 'Q8', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2016),
  ...generateYearVariants({ brand: 'TRAXX', model: 'Z', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2015),
  ...generateYearVariants({ brand: 'TRAXX', model: 'SKY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2017),
  ...generateYearVariants({ brand: 'TRAXX', model: 'WORK', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2016),
  ...generateYearVariants({ brand: 'Triumph', model: '500', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'Triumph', model: 'ADV', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1997),
  ...generateYearVariants({ brand: 'Triumph', model: 'Master', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'Triumph', model: 'DAYTONA', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2016),
  ...generateYearVariants({ brand: 'Triumph', model: 'LEGEND', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2001),
  ...generateYearVariants({ brand: 'Triumph', model: 'Classic', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2009),
  ...generateYearVariants({ brand: 'Triumph', model: 'SPRINT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2009),
  ...generateYearVariants({ brand: 'Triumph', model: 'THRUXTON', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2020),
  ...generateYearVariants({ brand: 'Triumph', model: 'Commander', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2016),
  ...generateYearVariants({ brand: 'Triumph', model: 'THUNDERBIRD', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2016),
  ...generateYearVariants({ brand: 'Triumph', model: 'TROPHY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2014),
  ...generateYearVariants({ brand: 'VENTO', model: 'REBELLIAN', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2011),
  ...generateYearVariants({ brand: 'VENTO', model: 'TRITON', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2011),
  ...generateYearVariants({ brand: 'VENTO', model: 'VTHUNDER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2013),
  ...generateYearVariants({ brand: 'VOLTZ', model: 'EV01', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2019, 2021),
  ...generateYearVariants({ brand: 'VOLTZ', model: 'EV1', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2021, 2025),
  ...generateYearVariants({ brand: 'VOLTZ', model: 'EVS', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2021, 2025),
  ...generateYearVariants({ brand: 'WATTS', model: 'W125', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2022, 2025),
  ...generateYearVariants({ brand: 'WUYANG', model: 'JET+', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2018),
  ...generateYearVariants({ brand: 'WUYANG', model: 'X5', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2020),
  ...generateYearVariants({ brand: 'WUYANG', model: 'WY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2015),
  ...generateYearVariants({ brand: 'WUYANG', model: 'Argo', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2017),
  ...generateYearVariants({ brand: 'WUYANG', model: 'iX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2019),
  ...generateYearVariants({ brand: 'Yamaha', model: '750', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1997),
  ...generateYearVariants({ brand: 'Yamaha', model: 'AXIS', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 1998),
  ...generateYearVariants({ brand: 'Yamaha', model: 'BW', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 2000),
  ...generateYearVariants({ brand: 'Yamaha', model: 'CRYPTON', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2005),
  ...generateYearVariants({ brand: 'Yamaha', model: 'DT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2000),
  ...generateYearVariants({ brand: 'Yamaha', model: 'JOG', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2005),
  ...generateYearVariants({ brand: 'Yamaha', model: 'MAJESTY', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 1998),
  ...generateYearVariants({ brand: 'Yamaha', model: 'MT-01', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2009),
  ...generateYearVariants({ brand: 'Yamaha', model: 'RD', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 2000),
  ...generateYearVariants({ brand: 'Yamaha', model: 'ROYAL', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2001),
  ...generateYearVariants({ brand: 'Yamaha', model: 'T115', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2016),
  ...generateYearVariants({ brand: 'Yamaha', model: 'TDR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1990, 1993),
  ...generateYearVariants({ brand: 'Yamaha', model: 'TMAX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2017),
  ...generateYearVariants({ brand: 'Yamaha', model: 'TRX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1997),
  ...generateYearVariants({ brand: 'Yamaha', model: 'TT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2025),
  ...generateYearVariants({ brand: 'Yamaha', model: 'V-MAX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 2015),
  ...generateYearVariants({ brand: 'Yamaha', model: 'WR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2025),
  ...generateYearVariants({ brand: 'Yamaha', model: 'XJR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1995),
  ...generateYearVariants({ brand: 'Yamaha', model: 'Versa', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2025),
  ...generateYearVariants({ brand: 'Yamaha', model: 'XT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2018),
  ...generateYearVariants({ brand: 'Yamaha', model: 'XV', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2002),
  ...generateYearVariants({ brand: 'Yamaha', model: 'XVS', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2016),
  ...generateYearVariants({ brand: 'Yamaha', model: 'YFM', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2003, 2010),
  ...generateYearVariants({ brand: 'Yamaha', model: 'YFS', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2003, 2006),
  ...generateYearVariants({ brand: 'ZONTES', model: 'R', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2024, 2025),
  ...generateYearVariants({ brand: 'ZONTES', model: 'T', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2024, 2025),
  ...generateYearVariants({ brand: 'ZONTES', model: 'V', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2024, 2025),
  ...generateYearVariants({ brand: 'BEPOBUS', model: 'NÀSCERE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2025),
  ...generateYearVariants({ brand: 'BEPOBUS', model: 'Rio', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2025),
  ...generateYearVariants({ brand: 'CHEVROLET', model: '6000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 1996),
  ...generateYearVariants({ brand: 'CHEVROLET', model: '11000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'CHEVROLET', model: '12000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1996),
  ...generateYearVariants({ brand: 'CHEVROLET', model: '13000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'CHEVROLET', model: '14000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1996),
  ...generateYearVariants({ brand: 'CHEVROLET', model: '19000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1989),
  ...generateYearVariants({ brand: 'CHEVROLET', model: '21000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1989),
  ...generateYearVariants({ brand: 'CHEVROLET', model: '22000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1990),
  ...generateYearVariants({ brand: 'CHEVROLET', model: 'C-60', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1984),
  ...generateYearVariants({ brand: 'CHEVROLET', model: 'D-40', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1985, 1994),
  ...generateYearVariants({ brand: 'CHEVROLET', model: 'D-60', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'CHEVROLET', model: 'D-70', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'CICCOBUS', model: 'Z', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2008),
  ...generateYearVariants({ brand: 'DAF', model: 'X2', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2025),
  ...generateYearVariants({ brand: 'DAF', model: 'X4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2025),
  ...generateYearVariants({ brand: 'EFFA-JMC', model: 'JBC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2012),
  ...generateYearVariants({ brand: 'EFFA-JMC', model: 'N601', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2012),
  ...generateYearVariants({ brand: 'EFFA-JMC', model: 'N900', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2012),
  ...generateYearVariants({ brand: 'FORD', model: 'F-11000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1992),
  ...generateYearVariants({ brand: 'FORD', model: 'iX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 2005),
  ...generateYearVariants({ brand: 'FORD', model: 'F-12000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1992, 2005),
  ...generateYearVariants({ brand: 'FORD', model: 'F-13000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'FORD', model: 'F-14000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 2005),
  ...generateYearVariants({ brand: 'FORD', model: 'F-16000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2004),
  ...generateYearVariants({ brand: 'FORD', model: 'F-19000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1982),
  ...generateYearVariants({ brand: 'FORD', model: 'F-2000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'FORD', model: 'F-21000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'FORD', model: 'F-22000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1992),
  ...generateYearVariants({ brand: 'FORD', model: 'F-350', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 2019),
  ...generateYearVariants({ brand: 'FORD', model: 'X2', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2015, 2019),
  ...generateYearVariants({ brand: 'FORD', model: 'X4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2019),
  ...generateYearVariants({ brand: 'FORD', model: 'F-4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2012),
  ...generateYearVariants({ brand: 'FORD', model: 'F-4000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 2019),
  ...generateYearVariants({ brand: 'FORD', model: 'F-7000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'FORD', model: 'F-MAXX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2019),
  ...generateYearVariants({ brand: 'GMC', model: '500', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2002),
  ...generateYearVariants({ brand: 'GMC', model: 'iX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2002),
  ...generateYearVariants({ brand: 'GMC', model: '12-170', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2002),
  ...generateYearVariants({ brand: 'GMC', model: '14-190', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2002),
  ...generateYearVariants({ brand: 'GMC', model: '15-190', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2001),
  ...generateYearVariants({ brand: 'GMC', model: '16-220', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2002),
  ...generateYearVariants({ brand: 'GMC', model: '5-90', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2001),
  ...generateYearVariants({ brand: 'GMC', model: '6-100', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2002),
  ...generateYearVariants({ brand: 'GMC', model: '6-150', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2002),
  ...generateYearVariants({ brand: 'GMC', model: '7-110', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2002),
  ...generateYearVariants({ brand: 'HYUNDAI', model: 'HD78', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2012),
  ...generateYearVariants({ brand: 'HYUNDAI', model: 'HD80', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2018, 2025),
  ...generateYearVariants({ brand: 'MAN', model: 'X2', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2025),
  ...generateYearVariants({ brand: 'MAN', model: 'X4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2025),
  ...generateYearVariants({ brand: 'MARCOPOLO', model: 'TT', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2023, 2025),
  ...generateYearVariants({ brand: 'MARCOPOLO', model: 'X4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2025),
  ...generateYearVariants({ brand: 'MARCOPOLO', model: 'NC', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2025),
  ...generateYearVariants({ brand: 'MARCOPOLO', model: 'VOLARE', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2025),
  ...generateYearVariants({ brand: 'MARCOPOLO', model: 'A5', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2012),
  ...generateYearVariants({ brand: 'MARCOPOLO', model: 'A6', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2012),
  ...generateYearVariants({ brand: 'MARCOPOLO', model: 'A8', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2012),
  ...generateYearVariants({ brand: 'MASCARELLO', model: 'Rio', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2025),
  ...generateYearVariants({ brand: 'MASCARELLO', model: 'Gran', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2025),
  ...generateYearVariants({ brand: 'MAXIBUS', model: 'ASTOR', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2013),
  ...generateYearVariants({ brand: 'NAVISTAR', model: 'X2', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2016),
  ...generateYearVariants({ brand: 'NAVISTAR', model: 'X4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2016),
  ...generateYearVariants({ brand: 'NAVISTAR', model: 'INTERNATIONAL', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2002),
  ...generateYearVariants({ brand: 'NAVISTAR', model: 'iX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2002),
  ...generateYearVariants({ brand: 'NEOBUS', model: 'T.BOY/', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2011),
  ...generateYearVariants({ brand: 'NEOBUS', model: 'THUNDER', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2016),
  ...generateYearVariants({ brand: 'NEOBUS', model: 'THUNDER+', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2012),
  ...generateYearVariants({ brand: 'PUMA-ALFA', model: '914', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1997),
  ...generateYearVariants({ brand: 'PUMA-ALFA', model: '7900', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 1998),
  ...generateYearVariants({ brand: 'PUMA-ALFA', model: '9000', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1995, 1995),
  ...generateYearVariants({ brand: 'PUMA-ALFA', model: 'CB', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1998),
  ...generateYearVariants({ brand: 'SAAB-SCANIA', model: 'X4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1991),
  ...generateYearVariants({ brand: 'SAAB-SCANIA', model: 'X2', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1991),
  ...generateYearVariants({ brand: 'Scania', model: 'X2', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 2025),
  ...generateYearVariants({ brand: 'Scania', model: 'X4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 2025),
  ...generateYearVariants({ brand: 'Scania', model: 'L-111', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'Scania', model: 'L-141', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'SHACMAN', model: 'X4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2012),
  ...generateYearVariants({ brand: 'SHACMAN', model: 'X2', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2012),
  ...generateYearVariants({ brand: 'SINOTRUK', model: 'X2', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2012),
  ...generateYearVariants({ brand: 'SINOTRUK', model: 'X4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2009, 2012),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '10-160', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2013, 2020),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: 'X2', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2025),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '11-130', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: 'iX', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 2025),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '11-140', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1993),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: 'X4', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2025),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '12-140', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 2000),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '12-170', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2000),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '12-180', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2001),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '13-130', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1989),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '13-150', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2006),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '13-170/13-170', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2006),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '13-180', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2013),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '13-180/13-180', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2012),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '13-190', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2020),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '14-140', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1981, 1991),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '14-150', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1999),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '14-170', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2000),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '14-180', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2000),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '14-190', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2021, 2025),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '14-200', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1994),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '14-210', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1988, 1991),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '14-220', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1999),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '15-170/15-170', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2006),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '15-180', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2012),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '15-180/15-180', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2013),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '15-190', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2020),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '16-170', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1999),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '16-200', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1998, 2000),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '16-210', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1989, 1991),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '16-220', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 2000),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '16-300', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2000),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '17-180', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2012),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '17-190', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2025),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '17-210', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2006),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '17-220/17-220', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2012),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '17-250', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2003, 2012),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '17-280', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2025),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '17-300', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2002),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '17-310', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2006),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '17-320', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2010, 2012),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '17-330', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2025),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '18-310', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2002, 2006),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '19-320', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2006, 2012),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '19-330', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2025),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '19-360', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2016, 2025),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '19-370', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2007, 2012),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '19-390', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2025),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '19-420', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2014, 2025),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '26-300', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2001, 2001),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '35-300', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1991, 1999),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '40-300', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1999, 2001),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '4-150', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2021),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '4-160', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2020, 2025),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '5-140', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2012),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '5-150', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2012, 2020),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '6-160', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2017, 2025),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '6-80', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1982, 1989),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '6-90', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1982, 1989),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '7-100', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1993, 2001),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '7-110', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1987, 2005),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '7-90', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1982, 1994),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '8-100', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1997, 2000),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '8-120/8-120', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2012),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '8-140', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1994, 2000),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '8-150', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 2013),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '8-150/8-150', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2000, 2010),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '8-160', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2020),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '9-150', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2005, 2012),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: '9-160', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2011, 2020),
  ...generateYearVariants({ brand: 'VOLKSWAGEN', model: 'L-80', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 1996, 1997),
  ...generateYearVariants({ brand: 'WALKBUS', model: 'Phanter', fuel: 'flex', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, 2008, 2020),
];

// ============================================================================
// MARCAS CHINESAS - COMPLETO
// ============================================================================
const CHINESE_BRANDS_VARIANTS: VehicleVariant[] = [
  // CHERY
  ...generateYearVariants({ brand: 'Chery', model: 'Tiggo 2', trim: '1.5', engineCode: 'SQR', engineName: '1.5 16V', displacementCc: 1497, fuel: 'flex', transmission: 'manual', bodyType: 'suv', vehicleType: 'suv', power: '115cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Chery', model: 'Tiggo 3X', trim: '1.0 Turbo', engineCode: 'SQRF4J10', engineName: '1.0 Turbo', displacementCc: 998, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '116cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'Chery', model: 'Tiggo 5X', trim: '1.5 Turbo', engineCode: 'SQRF4J16', engineName: '1.5 Turbo', displacementCc: 1497, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '150cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'Chery', model: 'Tiggo 7', trim: '1.5 Turbo', engineCode: 'SQRF4J16', engineName: '1.5 Turbo', displacementCc: 1497, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '150cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'Chery', model: 'Tiggo 8', trim: '1.6 Turbo', engineCode: 'SQRF4J16', engineName: '1.6 Turbo', displacementCc: 1598, fuel: 'flex', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '187cv', sources: ['fipe'] }, 2020, 2024),
  ...generateYearVariants({ brand: 'Chery', model: 'Arrizo 6', trim: '1.5 Turbo', engineCode: 'SQRF4J16', engineName: '1.5 Turbo', displacementCc: 1497, fuel: 'flex', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '150cv', sources: ['fipe'] }, 2020, 2024),
  // JAC
  ...generateYearVariants({ brand: 'JAC', model: 'T40', trim: '1.5', engineCode: 'JL4G15', engineName: '1.5 16V', displacementCc: 1497, fuel: 'flex', transmission: 'manual', bodyType: 'suv', vehicleType: 'suv', power: '113cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'JAC', model: 'T50', trim: '1.5 Turbo', engineCode: 'JL4G15T', engineName: '1.5 Turbo', displacementCc: 1497, fuel: 'flex', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '150cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'JAC', model: 'T60', trim: '2.0 Turbo', engineCode: 'JL4G20T', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '190cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'JAC', model: 'T80', trim: '2.0 Turbo', engineCode: 'JL4G20T', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '190cv', sources: ['fipe'] }, 2019, 2024),
  // BYD
  ...generateYearVariants({ brand: 'BYD', model: 'Song Plus', trim: 'DM-i', engineCode: 'BYD476', engineName: '1.5 Hybrid', displacementCc: 1497, fuel: 'hybrid', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '197cv', sources: ['fipe'] }, 2022, 2024),
  ...generateYearVariants({ brand: 'BYD', model: 'Yuan Plus', trim: 'EV', engineCode: 'BYD-EV', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '204cv', sources: ['fipe'] }, 2023, 2024),
  ...generateYearVariants({ brand: 'BYD', model: 'Tan', trim: 'EV', engineCode: 'BYD-EV', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '517cv', sources: ['fipe'] }, 2023, 2024),
  ...generateYearVariants({ brand: 'BYD', model: 'Han', trim: 'EV', engineCode: 'BYD-EV', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '517cv', sources: ['fipe'] }, 2023, 2024),
  ...generateYearVariants({ brand: 'BYD', model: 'Dolphin', trim: 'EV', engineCode: 'BYD-EV', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '177cv', sources: ['fipe'] }, 2023, 2024),
  ...generateYearVariants({ brand: 'BYD', model: 'Seal', trim: 'EV', engineCode: 'BYD-EV', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '313cv', sources: ['fipe'] }, 2024, 2024),
  // GWM
  ...generateYearVariants({ brand: 'GWM', model: 'Haval H6', trim: '1.5 Turbo', engineCode: 'GW4B15', engineName: '1.5 Turbo', displacementCc: 1497, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '184cv', sources: ['fipe'] }, 2022, 2024),
  ...generateYearVariants({ brand: 'GWM', model: 'Haval H6', trim: '2.0 Turbo', engineCode: 'GW4C20', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '211cv', sources: ['fipe'] }, 2022, 2024),
  ...generateYearVariants({ brand: 'GWM', model: 'Ora 03', trim: 'EV', engineCode: 'GWM-EV', engineName: 'Elétrico', displacementCc: 0, fuel: 'electric', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '171cv', sources: ['fipe'] }, 2023, 2024),
];

// ============================================================================
// MARCAS AMERICANAS FALTANTES
// ============================================================================
const AMERICAN_BRANDS_VARIANTS: VehicleVariant[] = [
  // RAM
  ...generateYearVariants({ brand: 'RAM', model: '1500', trim: 'Laramie', engineCode: 'Hemi', engineName: '5.7 V8 Hemi', displacementCc: 5654, fuel: 'gasoline', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '400cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'RAM', model: '2500', trim: 'Laramie', engineCode: 'Cummins', engineName: '6.7 Turbo Diesel', displacementCc: 6700, fuel: 'diesel', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '370cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'RAM', model: 'Rampage', trim: '2.0 Turbo', engineCode: 'Hurricane', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'flex', transmission: 'automatic', bodyType: 'pickup', vehicleType: 'pickup', power: '272cv', sources: ['fipe'] }, 2024, 2024),
  // DODGE
  ...generateYearVariants({ brand: 'Dodge', model: 'Journey', trim: '2.7 V6', engineCode: 'EER', engineName: '2.7 V6', displacementCc: 2736, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '185cv', sources: ['fipe'] }, 2009, 2020),
  ...generateYearVariants({ brand: 'Dodge', model: 'Journey', trim: '3.6 V6', engineCode: 'Pentastar', engineName: '3.6 V6', displacementCc: 3604, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '283cv', sources: ['fipe'] }, 2012, 2020),
  ...generateYearVariants({ brand: 'Dodge', model: 'Durango', trim: '3.6 V6', engineCode: 'Pentastar', engineName: '3.6 V6', displacementCc: 3604, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '295cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Dodge', model: 'Challenger', trim: 'R/T', engineCode: 'Hemi', engineName: '5.7 V8', displacementCc: 5654, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '375cv', sources: ['fipe'] }, 2010, 2024),
  ...generateYearVariants({ brand: 'Dodge', model: 'Charger', trim: 'R/T', engineCode: 'Hemi', engineName: '5.7 V8', displacementCc: 5654, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '375cv', sources: ['fipe'] }, 2011, 2024),
  // CHRYSLER
  ...generateYearVariants({ brand: 'Chrysler', model: '300C', trim: '3.6 V6', engineCode: 'Pentastar', engineName: '3.6 V6', displacementCc: 3604, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '292cv', sources: ['fipe'] }, 2012, 2023),
  ...generateYearVariants({ brand: 'Chrysler', model: '300C', trim: '5.7 V8', engineCode: 'Hemi', engineName: '5.7 V8', displacementCc: 5654, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '363cv', sources: ['fipe'] }, 2012, 2023),
  // SUBARU
  ...generateYearVariants({ brand: 'Subaru', model: 'Impreza', trim: '2.0', engineCode: 'FB20', engineName: '2.0 16V', displacementCc: 1995, fuel: 'gasoline', transmission: 'cvt', bodyType: 'hatch', vehicleType: 'car', power: '152cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Subaru', model: 'WRX', trim: '2.0 Turbo', engineCode: 'FA20', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'manual', bodyType: 'sedan', vehicleType: 'car', power: '268cv', sources: ['fipe'] }, 2015, 2024),
  ...generateYearVariants({ brand: 'Subaru', model: 'Forester', trim: '2.0', engineCode: 'FB20', engineName: '2.0 16V', displacementCc: 1995, fuel: 'gasoline', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '152cv', sources: ['fipe'] }, 2013, 2024),
  ...generateYearVariants({ brand: 'Subaru', model: 'XV', trim: '2.0', engineCode: 'FB20', engineName: '2.0 16V', displacementCc: 1995, fuel: 'gasoline', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '152cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'Subaru', model: 'Outback', trim: '2.5', engineCode: 'FB25', engineName: '2.5 16V', displacementCc: 2498, fuel: 'gasoline', transmission: 'cvt', bodyType: 'wagon', vehicleType: 'car', power: '175cv', sources: ['fipe'] }, 2015, 2024),
];

// ============================================================================
// MOTOS POPULARES FALTANTES
// ============================================================================
const POPULAR_MOTOS_VARIANTS: VehicleVariant[] = [
  // KTM
  ...generateYearVariants({ brand: 'KTM', model: 'Duke 200', trim: 'ABS', engineCode: 'LC4', engineName: '199.5cc', displacementCc: 199, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '26cv', sources: ['fipe'] }, 2012, 2024),
  ...generateYearVariants({ brand: 'KTM', model: 'Duke 390', trim: 'ABS', engineCode: 'LC4', engineName: '373cc', displacementCc: 373, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '44cv', sources: ['fipe'] }, 2013, 2024),
  ...generateYearVariants({ brand: 'KTM', model: 'Duke 890', trim: 'R', engineCode: 'LC8c', engineName: '889cc', displacementCc: 889, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '121cv', sources: ['fipe'] }, 2020, 2024),
  ...generateYearVariants({ brand: 'KTM', model: 'Adventure 390', trim: 'ABS', engineCode: 'LC4', engineName: '373cc', displacementCc: 373, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '44cv', sources: ['fipe'] }, 2020, 2024),
  ...generateYearVariants({ brand: 'KTM', model: 'Adventure 890', trim: 'R', engineCode: 'LC8c', engineName: '889cc', displacementCc: 889, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '105cv', sources: ['fipe'] }, 2021, 2024),
  // ROYAL ENFIELD
  ...generateYearVariants({ brand: 'Royal Enfield', model: 'Classic 350', trim: 'Standard', engineCode: 'J-Series', engineName: '349cc', displacementCc: 349, fuel: 'gasoline', transmission: 'manual', bodyType: 'classic', vehicleType: 'motorcycle', power: '20cv', sources: ['fipe'] }, 2015, 2024),
  ...generateYearVariants({ brand: 'Royal Enfield', model: 'Meteor 350', trim: 'Fireball', engineCode: 'J-Series', engineName: '349cc', displacementCc: 349, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '20cv', sources: ['fipe'] }, 2021, 2024),
  ...generateYearVariants({ brand: 'Royal Enfield', model: 'Himalayan', trim: 'Standard', engineCode: 'LS410', engineName: '411cc', displacementCc: 411, fuel: 'gasoline', transmission: 'manual', bodyType: 'adventure', vehicleType: 'motorcycle', power: '24cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Royal Enfield', model: 'Interceptor 650', trim: 'Standard', engineCode: 'Parallel Twin', engineName: '648cc', displacementCc: 648, fuel: 'gasoline', transmission: 'manual', bodyType: 'classic', vehicleType: 'motorcycle', power: '47cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Royal Enfield', model: 'Continental GT 650', trim: 'Standard', engineCode: 'Parallel Twin', engineName: '648cc', displacementCc: 648, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '47cv', sources: ['fipe'] }, 2018, 2024),
  // DAFRA
  ...generateYearVariants({ brand: 'Dafra', model: 'Apache 150', trim: 'RTR', engineCode: 'TVS', engineName: '149cc', displacementCc: 149, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '15cv', sources: ['fipe'] }, 2010, 2024),
  ...generateYearVariants({ brand: 'Dafra', model: 'Apache 200', trim: 'RTR', engineCode: 'TVS', engineName: '197cc', displacementCc: 197, fuel: 'gasoline', transmission: 'manual', bodyType: 'sport', vehicleType: 'motorcycle', power: '21cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Dafra', model: 'Next 250', trim: 'Standard', engineCode: 'SYM', engineName: '249cc', displacementCc: 249, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '26cv', sources: ['fipe'] }, 2013, 2024),
  ...generateYearVariants({ brand: 'Dafra', model: 'Citycom 300', trim: 'i', engineCode: 'SYM', engineName: '278cc', displacementCc: 278, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '26cv', sources: ['fipe'] }, 2009, 2024),
  // SHINERAY
  ...generateYearVariants({ brand: 'Shineray', model: 'XY 50Q', trim: 'Standard', engineCode: 'Shineray', engineName: '49cc', displacementCc: 49, fuel: 'gasoline', transmission: 'automatic', bodyType: 'scooter', vehicleType: 'motorcycle', power: '3cv', sources: ['fipe'] }, 2010, 2024),
  ...generateYearVariants({ brand: 'Shineray', model: 'XY 150-5', trim: 'Standard', engineCode: 'Shineray', engineName: '149cc', displacementCc: 149, fuel: 'gasoline', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '12cv', sources: ['fipe'] }, 2012, 2024),
  // HAOJUE
  ...generateYearVariants({ brand: 'Haojue', model: 'DR 160', trim: 'Fi', engineCode: 'Haojue', engineName: '162cc', displacementCc: 162, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '15cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Haojue', model: 'DK 150', trim: 'Fi', engineCode: 'Haojue', engineName: '149cc', displacementCc: 149, fuel: 'gasoline', transmission: 'manual', bodyType: 'street', vehicleType: 'motorcycle', power: '14cv', sources: ['fipe'] }, 2019, 2024),
  ...generateYearVariants({ brand: 'Haojue', model: 'NK 150', trim: 'Fi', engineCode: 'Haojue', engineName: '149cc', displacementCc: 149, fuel: 'gasoline', transmission: 'manual', bodyType: 'naked', vehicleType: 'motorcycle', power: '14cv', sources: ['fipe'] }, 2020, 2024),
  ...generateYearVariants({ brand: 'Haojue', model: 'Chopper Road 150', trim: 'Fi', engineCode: 'Haojue', engineName: '149cc', displacementCc: 149, fuel: 'gasoline', transmission: 'manual', bodyType: 'cruiser', vehicleType: 'motorcycle', power: '12cv', sources: ['fipe'] }, 2019, 2024),
];

// ============================================================================
// OUTRAS MARCAS FALTANTES
// ============================================================================
const OTHER_BRANDS_VARIANTS: VehicleVariant[] = [
  // JAGUAR
  ...generateYearVariants({ brand: 'Jaguar', model: 'XE', trim: '2.0 Turbo', engineCode: 'Ingenium', engineName: '2.0 Turbo', displacementCc: 1999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '250cv', sources: ['fipe'] }, 2015, 2024),
  ...generateYearVariants({ brand: 'Jaguar', model: 'XF', trim: '2.0 Turbo', engineCode: 'Ingenium', engineName: '2.0 Turbo', displacementCc: 1999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'sedan', vehicleType: 'car', power: '250cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Jaguar', model: 'F-Pace', trim: '2.0 Turbo', engineCode: 'Ingenium', engineName: '2.0 Turbo', displacementCc: 1999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '250cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Jaguar', model: 'E-Pace', trim: '2.0 Turbo', engineCode: 'Ingenium', engineName: '2.0 Turbo', displacementCc: 1999, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '250cv', sources: ['fipe'] }, 2018, 2024),
  ...generateYearVariants({ brand: 'Jaguar', model: 'F-Type', trim: '3.0 V6', engineCode: 'AJ126', engineName: '3.0 V6 Supercharged', displacementCc: 2995, fuel: 'gasoline', transmission: 'automatic', bodyType: 'coupe', vehicleType: 'car', power: '340cv', sources: ['fipe'] }, 2013, 2024),
  // LEXUS
  ...generateYearVariants({ brand: 'Lexus', model: 'ES', trim: '300h', engineCode: '2AR-FXE', engineName: '2.5 Hybrid', displacementCc: 2494, fuel: 'hybrid', transmission: 'cvt', bodyType: 'sedan', vehicleType: 'car', power: '218cv', sources: ['fipe'] }, 2013, 2024),
  ...generateYearVariants({ brand: 'Lexus', model: 'NX', trim: '250', engineCode: 'A25A-FKS', engineName: '2.5 16V', displacementCc: 2487, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '203cv', sources: ['fipe'] }, 2015, 2024),
  ...generateYearVariants({ brand: 'Lexus', model: 'RX', trim: '350', engineCode: '2GR-FKS', engineName: '3.5 V6', displacementCc: 3456, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '295cv', sources: ['fipe'] }, 2016, 2024),
  ...generateYearVariants({ brand: 'Lexus', model: 'UX', trim: '250h', engineCode: 'M20A-FXS', engineName: '2.0 Hybrid', displacementCc: 1987, fuel: 'hybrid', transmission: 'cvt', bodyType: 'suv', vehicleType: 'suv', power: '184cv', sources: ['fipe'] }, 2019, 2024),
  // MINI
  ...generateYearVariants({ brand: 'MINI', model: 'Cooper', trim: '1.5 Turbo', engineCode: 'B38', engineName: '1.5 Turbo', displacementCc: 1499, fuel: 'gasoline', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '136cv', sources: ['fipe'] }, 2014, 2024),
  ...generateYearVariants({ brand: 'MINI', model: 'Cooper S', trim: '2.0 Turbo', engineCode: 'B48', engineName: '2.0 Turbo', displacementCc: 1998, fuel: 'gasoline', transmission: 'automatic', bodyType: 'hatch', vehicleType: 'car', power: '192cv', sources: ['fipe'] }, 2014, 2024),
  ...generateYearVariants({ brand: 'MINI', model: 'Countryman', trim: '1.5 Turbo', engineCode: 'B38', engineName: '1.5 Turbo', displacementCc: 1499, fuel: 'gasoline', transmission: 'automatic', bodyType: 'suv', vehicleType: 'suv', power: '136cv', sources: ['fipe'] }, 2017, 2024),
  // TROLLER
  ...generateYearVariants({ brand: 'Troller', model: 'T4', trim: '3.2 Diesel', engineCode: 'Duratorq', engineName: '3.2 Turbo Diesel', displacementCc: 3198, fuel: 'diesel', transmission: 'manual', bodyType: 'suv', vehicleType: 'suv', power: '200cv', sources: ['fipe'] }, 2015, 2024),
];

// CONSOLIDAÇÃO E EXPORTAÇÕES
// ============================================================================

// Combina todas as variantes em um único array
export const BRAZILIAN_VEHICLES_DATABASE: VehicleVariant[] = [
  ...FIPE_COMPLETE_VARIANTS,
  ...FIPE_SYNC_VARIANTS,
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
  // Marcas adicionais (chinesas, americanas, motos populares, outras)
  ...CHINESE_BRANDS_VARIANTS,
  ...AMERICAN_BRANDS_VARIANTS,
  ...POPULAR_MOTOS_VARIANTS,
  ...OTHER_BRANDS_VARIANTS,
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
