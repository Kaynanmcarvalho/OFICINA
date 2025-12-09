/**
 * Brazilian Vehicles Database
 * Banco de dados completo de veículos que rodam no Brasil
 * Fonte: FIPE + Catálogos OEM + Dados públicos
 * @version 1.0.0
 */

import type { NormalizedVehicle, VehicleType } from '../types';

// Função para normalizar texto (remover acentos, lowercase)
const normalize = (text: string): string => 
  text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

// Função para gerar tokens de busca
const generateTokens = (brand: string, model: string, years: number[]): string[] => {
  const tokens: string[] = [];
  tokens.push(normalize(brand));
  tokens.push(normalize(model));
  tokens.push(normalize(`${brand} ${model}`));
  years.forEach(y => {
    tokens.push(String(y));
    tokens.push(normalize(`${model} ${y}`));
    tokens.push(normalize(`${brand} ${model} ${y}`));
  });
  return [...new Set(tokens)];
};

// Função para criar veículo
const createVehicle = (
  brand: string,
  model: string,
  yearFrom: number,
  yearTo: number,
  bodyType: VehicleType,
  options: Partial<NormalizedVehicle> = {}
): NormalizedVehicle => {
  const years = Array.from({ length: yearTo - yearFrom + 1 }, (_, i) => yearFrom + i);
  return {
    id: `${normalize(brand)}-${normalize(model)}-${yearFrom}-${yearTo}`,
    brand,
    brandNormalized: normalize(brand),
    model,
    modelNormalized: normalize(model),
    yearFrom,
    yearTo,
    bodyType,
    source: ['FIPE', 'OEM'],
    searchTokens: generateTokens(brand, model, years),
    lastUpdated: new Date(),
    ...options,
  };
};

// ============================================
// CARROS - MARCAS PRINCIPAIS
// ============================================

const CHEVROLET_CARS: NormalizedVehicle[] = [
  // Populares
  createVehicle('Chevrolet', 'Onix', 2012, 2024, 'car', { fuelType: 'flex', engineCode: '1.0 TURBO' }),
  createVehicle('Chevrolet', 'Onix Plus', 2019, 2024, 'car', { fuelType: 'flex' }),
  createVehicle('Chevrolet', 'Prisma', 2006, 2019, 'car', { fuelType: 'flex' }),
  createVehicle('Chevrolet', 'Cruze', 2011, 2024, 'car', { fuelType: 'flex', engineCode: '1.4 TURBO' }),
  createVehicle('Chevrolet', 'Tracker', 2013, 2024, 'suv', { fuelType: 'flex', engineCode: '1.0 TURBO' }),
  createVehicle('Chevrolet', 'Spin', 2012, 2024, 'van', { fuelType: 'flex' }),
  createVehicle('Chevrolet', 'Cobalt', 2011, 2020, 'car', { fuelType: 'flex' }),
  createVehicle('Chevrolet', 'Montana', 2003, 2024, 'pickup', { fuelType: 'flex' }),
  createVehicle('Chevrolet', 'S10', 1995, 2024, 'pickup', { fuelType: 'diesel' }),
  createVehicle('Chevrolet', 'Trailblazer', 2012, 2024, 'suv', { fuelType: 'diesel', engineCode: '2.8 DURAMAX' }),
  createVehicle('Chevrolet', 'Equinox', 2017, 2024, 'suv', { fuelType: 'flex', engineCode: '1.5 TURBO' }),
  // Clássicos
  createVehicle('Chevrolet', 'Corsa', 1994, 2012, 'car', { fuelType: 'flex' }),
  createVehicle('Chevrolet', 'Celta', 2000, 2015, 'car', { fuelType: 'flex' }),
  createVehicle('Chevrolet', 'Classic', 2010, 2016, 'car', { fuelType: 'flex' }),
  createVehicle('Chevrolet', 'Astra', 1998, 2011, 'car', { fuelType: 'flex' }),
  createVehicle('Chevrolet', 'Vectra', 1993, 2011, 'car', { fuelType: 'flex' }),
  createVehicle('Chevrolet', 'Meriva', 2002, 2012, 'van', { fuelType: 'flex' }),
  createVehicle('Chevrolet', 'Zafira', 2001, 2012, 'van', { fuelType: 'flex' }),
  createVehicle('Chevrolet', 'Agile', 2009, 2014, 'car', { fuelType: 'flex' }),
  createVehicle('Chevrolet', 'Captiva', 2008, 2017, 'suv', { fuelType: 'flex' }),
  // Históricos
  createVehicle('Chevrolet', 'Monza', 1982, 1996, 'car', { fuelType: 'gasoline' }),
  createVehicle('Chevrolet', 'Kadett', 1989, 1998, 'car', { fuelType: 'gasoline' }),
  createVehicle('Chevrolet', 'Opala', 1968, 1992, 'car', { fuelType: 'gasoline' }),
  createVehicle('Chevrolet', 'Chevette', 1973, 1993, 'car', { fuelType: 'gasoline' }),
  createVehicle('Chevrolet', 'Omega', 1992, 2007, 'car', { fuelType: 'gasoline' }),
];

const VOLKSWAGEN_CARS: NormalizedVehicle[] = [
  // Populares
  createVehicle('Volkswagen', 'Gol', 1980, 2024, 'car', { fuelType: 'flex' }),
  createVehicle('Volkswagen', 'Polo', 2002, 2024, 'car', { fuelType: 'flex', engineCode: '1.0 TSI' }),
  createVehicle('Volkswagen', 'Virtus', 2018, 2024, 'car', { fuelType: 'flex', engineCode: '1.0 TSI' }),
  createVehicle('Volkswagen', 'T-Cross', 2019, 2024, 'suv', { fuelType: 'flex', engineCode: '1.0 TSI' }),
  createVehicle('Volkswagen', 'Nivus', 2020, 2024, 'suv', { fuelType: 'flex', engineCode: '1.0 TSI' }),
  createVehicle('Volkswagen', 'Taos', 2021, 2024, 'suv', { fuelType: 'flex', engineCode: '1.4 TSI' }),
  createVehicle('Volkswagen', 'Tiguan', 2007, 2024, 'suv', { fuelType: 'flex', engineCode: '2.0 TSI' }),
  createVehicle('Volkswagen', 'Jetta', 2005, 2024, 'car', { fuelType: 'flex', engineCode: '1.4 TSI' }),
  createVehicle('Volkswagen', 'Saveiro', 1982, 2024, 'pickup', { fuelType: 'flex' }),
  createVehicle('Volkswagen', 'Amarok', 2010, 2024, 'pickup', { fuelType: 'diesel', engineCode: '3.0 V6 TDI' }),
  // Clássicos
  createVehicle('Volkswagen', 'Fox', 2003, 2021, 'car', { fuelType: 'flex' }),
  createVehicle('Volkswagen', 'Voyage', 2008, 2023, 'car', { fuelType: 'flex' }),
  createVehicle('Volkswagen', 'Up!', 2014, 2021, 'car', { fuelType: 'flex' }),
  createVehicle('Volkswagen', 'Golf', 1994, 2023, 'car', { fuelType: 'flex', engineCode: '1.4 TSI' }),
  createVehicle('Volkswagen', 'Passat', 1974, 2019, 'car', { fuelType: 'flex' }),
  createVehicle('Volkswagen', 'Bora', 2000, 2011, 'car', { fuelType: 'flex' }),
  createVehicle('Volkswagen', 'SpaceFox', 2006, 2018, 'car', { fuelType: 'flex' }),
  createVehicle('Volkswagen', 'CrossFox', 2005, 2016, 'car', { fuelType: 'flex' }),
  // Históricos
  createVehicle('Volkswagen', 'Fusca', 1959, 1996, 'car', { fuelType: 'gasoline' }),
  createVehicle('Volkswagen', 'Kombi', 1957, 2014, 'van', { fuelType: 'flex' }),
  createVehicle('Volkswagen', 'Brasília', 1973, 1982, 'car', { fuelType: 'gasoline' }),
  createVehicle('Volkswagen', 'Santana', 1984, 2006, 'car', { fuelType: 'gasoline' }),
  createVehicle('Volkswagen', 'Parati', 1982, 2013, 'car', { fuelType: 'flex' }),
  createVehicle('Volkswagen', 'Quantum', 1985, 2001, 'car', { fuelType: 'gasoline' }),
];

const FIAT_CARS: NormalizedVehicle[] = [
  // Populares
  createVehicle('Fiat', 'Argo', 2017, 2024, 'car', { fuelType: 'flex', engineCode: '1.0 FIREFLY' }),
  createVehicle('Fiat', 'Cronos', 2018, 2024, 'car', { fuelType: 'flex', engineCode: '1.3 FIREFLY' }),
  createVehicle('Fiat', 'Mobi', 2016, 2024, 'car', { fuelType: 'flex', engineCode: '1.0 FIREFLY' }),
  createVehicle('Fiat', 'Pulse', 2021, 2024, 'suv', { fuelType: 'flex', engineCode: '1.0 TURBO' }),
  createVehicle('Fiat', 'Fastback', 2022, 2024, 'suv', { fuelType: 'flex', engineCode: '1.0 TURBO' }),
  createVehicle('Fiat', 'Strada', 1998, 2024, 'pickup', { fuelType: 'flex' }),
  createVehicle('Fiat', 'Toro', 2016, 2024, 'pickup', { fuelType: 'diesel', engineCode: '2.0 MULTIJET' }),
  createVehicle('Fiat', 'Fiorino', 1988, 2024, 'van', { fuelType: 'flex' }),
  createVehicle('Fiat', 'Ducato', 1994, 2024, 'van', { fuelType: 'diesel' }),
  // Clássicos
  createVehicle('Fiat', 'Uno', 1984, 2021, 'car', { fuelType: 'flex' }),
  createVehicle('Fiat', 'Palio', 1996, 2017, 'car', { fuelType: 'flex' }),
  createVehicle('Fiat', 'Siena', 1997, 2019, 'car', { fuelType: 'flex' }),
  createVehicle('Fiat', 'Punto', 2007, 2017, 'car', { fuelType: 'flex' }),
  createVehicle('Fiat', 'Linea', 2008, 2016, 'car', { fuelType: 'flex' }),
  createVehicle('Fiat', 'Bravo', 2010, 2016, 'car', { fuelType: 'flex' }),
  createVehicle('Fiat', 'Grand Siena', 2012, 2021, 'car', { fuelType: 'flex' }),
  createVehicle('Fiat', 'Idea', 2005, 2016, 'car', { fuelType: 'flex' }),
  createVehicle('Fiat', 'Doblò', 2001, 2021, 'van', { fuelType: 'flex' }),
  // Históricos
  createVehicle('Fiat', '147', 1976, 1986, 'car', { fuelType: 'gasoline' }),
  createVehicle('Fiat', 'Tempra', 1991, 1999, 'car', { fuelType: 'gasoline' }),
  createVehicle('Fiat', 'Tipo', 1993, 1997, 'car', { fuelType: 'gasoline' }),
  createVehicle('Fiat', 'Marea', 1998, 2007, 'car', { fuelType: 'flex' }),
  createVehicle('Fiat', 'Stilo', 2002, 2010, 'car', { fuelType: 'flex' }),
];

const FORD_CARS: NormalizedVehicle[] = [
  createVehicle('Ford', 'Ka', 1997, 2021, 'car', { fuelType: 'flex' }),
  createVehicle('Ford', 'Ka Sedan', 2014, 2021, 'car', { fuelType: 'flex' }),
  createVehicle('Ford', 'Fiesta', 1996, 2019, 'car', { fuelType: 'flex' }),
  createVehicle('Ford', 'Focus', 2000, 2019, 'car', { fuelType: 'flex', engineCode: '2.0 DURATEC' }),
  createVehicle('Ford', 'Fusion', 2006, 2020, 'car', { fuelType: 'hybrid', engineCode: '2.0 ECOBOOST' }),
  createVehicle('Ford', 'EcoSport', 2003, 2024, 'suv', { fuelType: 'flex' }),
  createVehicle('Ford', 'Territory', 2020, 2024, 'suv', { fuelType: 'flex', engineCode: '1.5 TURBO' }),
  createVehicle('Ford', 'Ranger', 1994, 2024, 'pickup', { fuelType: 'diesel', engineCode: '3.2 DURATORQ' }),
  createVehicle('Ford', 'Maverick', 2022, 2024, 'pickup', { fuelType: 'hybrid' }),
  createVehicle('Ford', 'Bronco Sport', 2021, 2024, 'suv', { fuelType: 'flex' }),
  createVehicle('Ford', 'Transit', 2013, 2024, 'van', { fuelType: 'diesel' }),
  // Históricos
  createVehicle('Ford', 'Escort', 1983, 2003, 'car', { fuelType: 'gasoline' }),
  createVehicle('Ford', 'Verona', 1989, 1996, 'car', { fuelType: 'gasoline' }),
  createVehicle('Ford', 'Versailles', 1991, 1996, 'car', { fuelType: 'gasoline' }),
  createVehicle('Ford', 'Royale', 1991, 1996, 'car', { fuelType: 'gasoline' }),
  createVehicle('Ford', 'Del Rey', 1981, 1991, 'car', { fuelType: 'gasoline' }),
  createVehicle('Ford', 'Corcel', 1968, 1986, 'car', { fuelType: 'gasoline' }),
  createVehicle('Ford', 'Belina', 1970, 1991, 'car', { fuelType: 'gasoline' }),
  createVehicle('Ford', 'Pampa', 1982, 1997, 'pickup', { fuelType: 'gasoline' }),
  createVehicle('Ford', 'F-1000', 1979, 1998, 'pickup', { fuelType: 'diesel' }),
];

const HYUNDAI_CARS: NormalizedVehicle[] = [
  createVehicle('Hyundai', 'HB20', 2012, 2024, 'car', { fuelType: 'flex', engineCode: '1.0 TGDI' }),
  createVehicle('Hyundai', 'HB20S', 2013, 2024, 'car', { fuelType: 'flex' }),
  createVehicle('Hyundai', 'HB20X', 2013, 2024, 'car', { fuelType: 'flex' }),
  createVehicle('Hyundai', 'Creta', 2016, 2024, 'suv', { fuelType: 'flex', engineCode: '1.0 TGDI' }),
  createVehicle('Hyundai', 'Tucson', 2004, 2024, 'suv', { fuelType: 'flex' }),
  createVehicle('Hyundai', 'Santa Fe', 2006, 2024, 'suv', { fuelType: 'diesel' }),
  createVehicle('Hyundai', 'ix35', 2010, 2019, 'suv', { fuelType: 'flex' }),
  createVehicle('Hyundai', 'Azera', 2007, 2020, 'car', { fuelType: 'gasoline', engineCode: '3.0 V6' }),
  createVehicle('Hyundai', 'Elantra', 2011, 2024, 'car', { fuelType: 'flex' }),
  createVehicle('Hyundai', 'Veloster', 2011, 2019, 'car', { fuelType: 'gasoline' }),
  createVehicle('Hyundai', 'i30', 2009, 2019, 'car', { fuelType: 'flex' }),
  createVehicle('Hyundai', 'HR', 2006, 2024, 'truck', { fuelType: 'diesel' }),
];

const TOYOTA_CARS: NormalizedVehicle[] = [
  createVehicle('Toyota', 'Corolla', 1992, 2024, 'car', { fuelType: 'hybrid', engineCode: '2.0 DYNAMIC FORCE' }),
  createVehicle('Toyota', 'Corolla Cross', 2021, 2024, 'suv', { fuelType: 'hybrid' }),
  createVehicle('Toyota', 'Yaris', 2018, 2024, 'car', { fuelType: 'flex' }),
  createVehicle('Toyota', 'Yaris Sedan', 2018, 2024, 'car', { fuelType: 'flex' }),
  createVehicle('Toyota', 'Hilux', 1992, 2024, 'pickup', { fuelType: 'diesel', engineCode: '2.8 TURBODIESEL' }),
  createVehicle('Toyota', 'Hilux SW4', 1992, 2024, 'suv', { fuelType: 'diesel' }),
  createVehicle('Toyota', 'RAV4', 2013, 2024, 'suv', { fuelType: 'hybrid' }),
  createVehicle('Toyota', 'Camry', 1992, 2024, 'car', { fuelType: 'hybrid' }),
  createVehicle('Toyota', 'Prius', 2012, 2024, 'car', { fuelType: 'hybrid' }),
  createVehicle('Toyota', 'Etios', 2012, 2021, 'car', { fuelType: 'flex' }),
  createVehicle('Toyota', 'Etios Sedan', 2012, 2021, 'car', { fuelType: 'flex' }),
  createVehicle('Toyota', 'Land Cruiser Prado', 2003, 2024, 'suv', { fuelType: 'diesel' }),
];

const HONDA_CARS: NormalizedVehicle[] = [
  createVehicle('Honda', 'Civic', 1992, 2024, 'car', { fuelType: 'flex', engineCode: '2.0 I-VTEC' }),
  createVehicle('Honda', 'City', 2009, 2024, 'car', { fuelType: 'flex' }),
  createVehicle('Honda', 'Fit', 2003, 2021, 'car', { fuelType: 'flex' }),
  createVehicle('Honda', 'HR-V', 2015, 2024, 'suv', { fuelType: 'flex', engineCode: '1.5 TURBO' }),
  createVehicle('Honda', 'CR-V', 1997, 2024, 'suv', { fuelType: 'flex' }),
  createVehicle('Honda', 'WR-V', 2017, 2024, 'suv', { fuelType: 'flex' }),
  createVehicle('Honda', 'ZR-V', 2023, 2024, 'suv', { fuelType: 'hybrid' }),
  createVehicle('Honda', 'Accord', 1994, 2024, 'car', { fuelType: 'hybrid' }),
];

const RENAULT_CARS: NormalizedVehicle[] = [
  createVehicle('Renault', 'Kwid', 2017, 2024, 'car', { fuelType: 'flex', engineCode: '1.0 SCE' }),
  createVehicle('Renault', 'Sandero', 2007, 2024, 'car', { fuelType: 'flex' }),
  createVehicle('Renault', 'Logan', 2007, 2024, 'car', { fuelType: 'flex' }),
  createVehicle('Renault', 'Stepway', 2008, 2024, 'car', { fuelType: 'flex' }),
  createVehicle('Renault', 'Duster', 2011, 2024, 'suv', { fuelType: 'flex', engineCode: '1.6 SCE' }),
  createVehicle('Renault', 'Captur', 2017, 2024, 'suv', { fuelType: 'flex' }),
  createVehicle('Renault', 'Oroch', 2015, 2024, 'pickup', { fuelType: 'flex' }),
  createVehicle('Renault', 'Master', 2002, 2024, 'van', { fuelType: 'diesel' }),
  createVehicle('Renault', 'Kangoo', 1999, 2019, 'van', { fuelType: 'flex' }),
  // Históricos
  createVehicle('Renault', 'Clio', 1996, 2016, 'car', { fuelType: 'flex' }),
  createVehicle('Renault', 'Mégane', 1998, 2015, 'car', { fuelType: 'flex' }),
  createVehicle('Renault', 'Scénic', 1999, 2011, 'van', { fuelType: 'flex' }),
  createVehicle('Renault', 'Symbol', 2009, 2013, 'car', { fuelType: 'flex' }),
  createVehicle('Renault', 'Fluence', 2010, 2017, 'car', { fuelType: 'flex' }),
];

// ============================================
// MOTOS - PRINCIPAIS MARCAS
// ============================================

const HONDA_MOTOS: NormalizedVehicle[] = [
  createVehicle('Honda', 'CG 160', 2015, 2024, 'motorcycle', { fuelType: 'flex', displacementCc: 162 }),
  createVehicle('Honda', 'CG 150', 2004, 2015, 'motorcycle', { fuelType: 'flex', displacementCc: 150 }),
  createVehicle('Honda', 'CG 125', 1976, 2015, 'motorcycle', { fuelType: 'gasoline', displacementCc: 125 }),
  createVehicle('Honda', 'Biz 125', 2005, 2024, 'motorcycle', { fuelType: 'flex', displacementCc: 125 }),
  createVehicle('Honda', 'Biz 110i', 2016, 2024, 'motorcycle', { fuelType: 'flex', displacementCc: 110 }),
  createVehicle('Honda', 'Pop 110i', 2016, 2024, 'motorcycle', { fuelType: 'flex', displacementCc: 110 }),
  createVehicle('Honda', 'Bros 160', 2015, 2024, 'motorcycle', { fuelType: 'flex', displacementCc: 162 }),
  createVehicle('Honda', 'XRE 190', 2016, 2024, 'motorcycle', { fuelType: 'flex', displacementCc: 190 }),
  createVehicle('Honda', 'XRE 300', 2009, 2024, 'motorcycle', { fuelType: 'flex', displacementCc: 291 }),
  createVehicle('Honda', 'CB 300R', 2009, 2024, 'motorcycle', { fuelType: 'flex', displacementCc: 291 }),
  createVehicle('Honda', 'CB 500F', 2013, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 471 }),
  createVehicle('Honda', 'CB 500X', 2013, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 471 }),
  createVehicle('Honda', 'CBR 500R', 2013, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 471 }),
  createVehicle('Honda', 'CB 650R', 2019, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 649 }),
  createVehicle('Honda', 'CBR 650R', 2019, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 649 }),
  createVehicle('Honda', 'NC 750X', 2014, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 745 }),
  createVehicle('Honda', 'Africa Twin', 2016, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 1084 }),
  createVehicle('Honda', 'CBR 1000RR', 2004, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 998 }),
  createVehicle('Honda', 'Goldwing', 2001, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 1833 }),
  createVehicle('Honda', 'PCX 160', 2021, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 157 }),
  createVehicle('Honda', 'Elite 125', 2018, 2024, 'motorcycle', { fuelType: 'flex', displacementCc: 125 }),
  createVehicle('Honda', 'SH 150i', 2017, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 150 }),
  createVehicle('Honda', 'ADV 150', 2021, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 150 }),
];

const YAMAHA_MOTOS: NormalizedVehicle[] = [
  createVehicle('Yamaha', 'Factor 150', 2015, 2024, 'motorcycle', { fuelType: 'flex', displacementCc: 150 }),
  createVehicle('Yamaha', 'Factor 125', 2008, 2024, 'motorcycle', { fuelType: 'flex', displacementCc: 125 }),
  createVehicle('Yamaha', 'Fazer 150', 2014, 2024, 'motorcycle', { fuelType: 'flex', displacementCc: 150 }),
  createVehicle('Yamaha', 'Fazer 250', 2005, 2024, 'motorcycle', { fuelType: 'flex', displacementCc: 250 }),
  createVehicle('Yamaha', 'Crosser 150', 2014, 2024, 'motorcycle', { fuelType: 'flex', displacementCc: 150 }),
  createVehicle('Yamaha', 'Lander 250', 2006, 2024, 'motorcycle', { fuelType: 'flex', displacementCc: 250 }),
  createVehicle('Yamaha', 'Ténéré 250', 2011, 2024, 'motorcycle', { fuelType: 'flex', displacementCc: 250 }),
  createVehicle('Yamaha', 'MT-03', 2016, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 321 }),
  createVehicle('Yamaha', 'MT-07', 2015, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 689 }),
  createVehicle('Yamaha', 'MT-09', 2015, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 889 }),
  createVehicle('Yamaha', 'XJ6', 2010, 2019, 'motorcycle', { fuelType: 'gasoline', displacementCc: 600 }),
  createVehicle('Yamaha', 'R3', 2015, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 321 }),
  createVehicle('Yamaha', 'R1', 1998, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 998 }),
  createVehicle('Yamaha', 'R6', 1999, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 599 }),
  createVehicle('Yamaha', 'Tracer 900 GT', 2019, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 889 }),
  createVehicle('Yamaha', 'Super Ténéré 1200', 2011, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 1199 }),
  createVehicle('Yamaha', 'NMAX 160', 2016, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 155 }),
  createVehicle('Yamaha', 'NEO 125', 2016, 2024, 'motorcycle', { fuelType: 'flex', displacementCc: 125 }),
  createVehicle('Yamaha', 'Fluo 125', 2021, 2024, 'motorcycle', { fuelType: 'flex', displacementCc: 125 }),
];

const OTHER_MOTOS: NormalizedVehicle[] = [
  // Suzuki
  createVehicle('Suzuki', 'GSX-S750', 2017, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 749 }),
  createVehicle('Suzuki', 'V-Strom 650', 2004, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 645 }),
  createVehicle('Suzuki', 'V-Strom 1050', 2020, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 1037 }),
  createVehicle('Suzuki', 'Hayabusa', 1999, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 1340 }),
  createVehicle('Suzuki', 'GSX-R1000', 2001, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 999 }),
  createVehicle('Suzuki', 'Burgman 400', 2007, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 400 }),
  // Kawasaki
  createVehicle('Kawasaki', 'Z400', 2019, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 399 }),
  createVehicle('Kawasaki', 'Z650', 2017, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 649 }),
  createVehicle('Kawasaki', 'Z900', 2017, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 948 }),
  createVehicle('Kawasaki', 'Ninja 400', 2018, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 399 }),
  createVehicle('Kawasaki', 'Ninja 650', 2006, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 649 }),
  createVehicle('Kawasaki', 'Ninja ZX-6R', 1995, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 636 }),
  createVehicle('Kawasaki', 'Ninja ZX-10R', 2004, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 998 }),
  createVehicle('Kawasaki', 'Versys 650', 2007, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 649 }),
  createVehicle('Kawasaki', 'Versys 1000', 2012, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 1043 }),
  // BMW
  createVehicle('BMW', 'G 310 R', 2017, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 313 }),
  createVehicle('BMW', 'G 310 GS', 2017, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 313 }),
  createVehicle('BMW', 'F 850 GS', 2018, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 853 }),
  createVehicle('BMW', 'R 1250 GS', 2019, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 1254 }),
  createVehicle('BMW', 'S 1000 RR', 2009, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 999 }),
  // Triumph
  createVehicle('Triumph', 'Street Triple', 2007, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 765 }),
  createVehicle('Triumph', 'Tiger 900', 2020, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 888 }),
  // Harley-Davidson
  createVehicle('Harley-Davidson', 'Iron 883', 2009, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 883 }),
  createVehicle('Harley-Davidson', 'Fat Bob', 2008, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 1868 }),
  createVehicle('Harley-Davidson', 'Street Glide', 2006, 2024, 'motorcycle', { fuelType: 'gasoline', displacementCc: 1868 }),
];

// ============================================
// OUTRAS MARCAS DE CARROS
// ============================================

const OTHER_CARS: NormalizedVehicle[] = [
  // Nissan
  createVehicle('Nissan', 'Kicks', 2016, 2024, 'suv', { fuelType: 'flex' }),
  createVehicle('Nissan', 'Versa', 2011, 2024, 'car', { fuelType: 'flex' }),
  createVehicle('Nissan', 'Sentra', 2007, 2024, 'car', { fuelType: 'flex' }),
  createVehicle('Nissan', 'March', 2011, 2022, 'car', { fuelType: 'flex' }),
  createVehicle('Nissan', 'Frontier', 2002, 2024, 'pickup', { fuelType: 'diesel' }),
  createVehicle('Nissan', 'Leaf', 2019, 2024, 'car', { fuelType: 'electric' }),
  // Kia
  createVehicle('Kia', 'Sportage', 2005, 2024, 'suv', { fuelType: 'flex' }),
  createVehicle('Kia', 'Cerato', 2009, 2024, 'car', { fuelType: 'flex' }),
  createVehicle('Kia', 'Sorento', 2003, 2024, 'suv', { fuelType: 'diesel' }),
  createVehicle('Kia', 'Picanto', 2006, 2024, 'car', { fuelType: 'flex' }),
  createVehicle('Kia', 'Stonic', 2021, 2024, 'suv', { fuelType: 'flex' }),
  createVehicle('Kia', 'Seltos', 2021, 2024, 'suv', { fuelType: 'flex' }),
  createVehicle('Kia', 'Carnival', 2006, 2024, 'van', { fuelType: 'diesel' }),
  // Jeep
  createVehicle('Jeep', 'Renegade', 2015, 2024, 'suv', { fuelType: 'flex', engineCode: '1.3 TURBO' }),
  createVehicle('Jeep', 'Compass', 2016, 2024, 'suv', { fuelType: 'diesel', engineCode: '2.0 TURBODIESEL' }),
  createVehicle('Jeep', 'Commander', 2021, 2024, 'suv', { fuelType: 'diesel' }),
  createVehicle('Jeep', 'Wrangler', 2007, 2024, 'suv', { fuelType: 'gasoline' }),
  createVehicle('Jeep', 'Grand Cherokee', 2011, 2024, 'suv', { fuelType: 'diesel' }),
  // Peugeot
  createVehicle('Peugeot', '208', 2013, 2024, 'car', { fuelType: 'flex', engineCode: '1.0 FIREFLY' }),
  createVehicle('Peugeot', '2008', 2015, 2024, 'suv', { fuelType: 'flex' }),
  createVehicle('Peugeot', '3008', 2017, 2024, 'suv', { fuelType: 'flex' }),
  createVehicle('Peugeot', '308', 2012, 2021, 'car', { fuelType: 'flex' }),
  createVehicle('Peugeot', '408', 2011, 2019, 'car', { fuelType: 'flex' }),
  createVehicle('Peugeot', '206', 1999, 2013, 'car', { fuelType: 'flex' }),
  createVehicle('Peugeot', '207', 2008, 2015, 'car', { fuelType: 'flex' }),
  createVehicle('Peugeot', 'Partner', 1999, 2024, 'van', { fuelType: 'flex' }),
  createVehicle('Peugeot', 'Expert', 2018, 2024, 'van', { fuelType: 'diesel' }),
  // Citroën
  createVehicle('Citroën', 'C3', 2003, 2024, 'car', { fuelType: 'flex' }),
  createVehicle('Citroën', 'C4 Cactus', 2018, 2024, 'suv', { fuelType: 'flex' }),
  createVehicle('Citroën', 'Aircross', 2010, 2019, 'suv', { fuelType: 'flex' }),
  createVehicle('Citroën', 'C4 Lounge', 2013, 2019, 'car', { fuelType: 'flex' }),
  createVehicle('Citroën', 'Jumpy', 2018, 2024, 'van', { fuelType: 'diesel' }),
  // Mitsubishi
  createVehicle('Mitsubishi', 'L200 Triton', 2007, 2024, 'pickup', { fuelType: 'diesel' }),
  createVehicle('Mitsubishi', 'Pajero Sport', 2000, 2024, 'suv', { fuelType: 'diesel' }),
  createVehicle('Mitsubishi', 'Outlander', 2007, 2024, 'suv', { fuelType: 'hybrid' }),
  createVehicle('Mitsubishi', 'ASX', 2010, 2024, 'suv', { fuelType: 'flex' }),
  createVehicle('Mitsubishi', 'Eclipse Cross', 2018, 2024, 'suv', { fuelType: 'flex' }),
  createVehicle('Mitsubishi', 'Lancer', 2007, 2019, 'car', { fuelType: 'flex' }),
  // Audi
  createVehicle('Audi', 'A3', 1999, 2024, 'car', { fuelType: 'flex', engineCode: '1.4 TFSI' }),
  createVehicle('Audi', 'A4', 1995, 2024, 'car', { fuelType: 'gasoline', engineCode: '2.0 TFSI' }),
  createVehicle('Audi', 'A5', 2007, 2024, 'car', { fuelType: 'gasoline' }),
  createVehicle('Audi', 'Q3', 2012, 2024, 'suv', { fuelType: 'flex' }),
  createVehicle('Audi', 'Q5', 2009, 2024, 'suv', { fuelType: 'gasoline' }),
  createVehicle('Audi', 'Q7', 2006, 2024, 'suv', { fuelType: 'diesel' }),
  createVehicle('Audi', 'Q8', 2019, 2024, 'suv', { fuelType: 'gasoline' }),
  createVehicle('Audi', 'e-tron', 2020, 2024, 'suv', { fuelType: 'electric' }),
  // BMW
  createVehicle('BMW', 'Série 1', 2005, 2024, 'car', { fuelType: 'gasoline' }),
  createVehicle('BMW', 'Série 3', 1990, 2024, 'car', { fuelType: 'gasoline', engineCode: '2.0 TURBO' }),
  createVehicle('BMW', 'Série 5', 1988, 2024, 'car', { fuelType: 'gasoline' }),
  createVehicle('BMW', 'X1', 2010, 2024, 'suv', { fuelType: 'flex' }),
  createVehicle('BMW', 'X3', 2004, 2024, 'suv', { fuelType: 'gasoline' }),
  createVehicle('BMW', 'X5', 2000, 2024, 'suv', { fuelType: 'diesel' }),
  createVehicle('BMW', 'X6', 2008, 2024, 'suv', { fuelType: 'gasoline' }),
  // Mercedes-Benz
  createVehicle('Mercedes-Benz', 'Classe A', 1999, 2024, 'car', { fuelType: 'gasoline' }),
  createVehicle('Mercedes-Benz', 'Classe C', 1993, 2024, 'car', { fuelType: 'gasoline' }),
  createVehicle('Mercedes-Benz', 'Classe E', 1993, 2024, 'car', { fuelType: 'gasoline' }),
  createVehicle('Mercedes-Benz', 'GLA', 2014, 2024, 'suv', { fuelType: 'gasoline' }),
  createVehicle('Mercedes-Benz', 'GLC', 2016, 2024, 'suv', { fuelType: 'gasoline' }),
  createVehicle('Mercedes-Benz', 'GLE', 2015, 2024, 'suv', { fuelType: 'diesel' }),
  createVehicle('Mercedes-Benz', 'Sprinter', 1995, 2024, 'van', { fuelType: 'diesel' }),
  // Volvo
  createVehicle('Volvo', 'XC40', 2018, 2024, 'suv', { fuelType: 'hybrid' }),
  createVehicle('Volvo', 'XC60', 2008, 2024, 'suv', { fuelType: 'hybrid' }),
  createVehicle('Volvo', 'XC90', 2002, 2024, 'suv', { fuelType: 'hybrid' }),
  createVehicle('Volvo', 'S60', 2000, 2024, 'car', { fuelType: 'hybrid' }),
  // Land Rover
  createVehicle('Land Rover', 'Discovery Sport', 2015, 2024, 'suv', { fuelType: 'diesel' }),
  createVehicle('Land Rover', 'Range Rover Evoque', 2011, 2024, 'suv', { fuelType: 'diesel' }),
  createVehicle('Land Rover', 'Range Rover Sport', 2005, 2024, 'suv', { fuelType: 'diesel' }),
  createVehicle('Land Rover', 'Defender', 2020, 2024, 'suv', { fuelType: 'diesel' }),
  // Porsche
  createVehicle('Porsche', 'Cayenne', 2003, 2024, 'suv', { fuelType: 'hybrid' }),
  createVehicle('Porsche', 'Macan', 2014, 2024, 'suv', { fuelType: 'gasoline' }),
  createVehicle('Porsche', '911', 1964, 2024, 'car', { fuelType: 'gasoline' }),
  createVehicle('Porsche', 'Taycan', 2020, 2024, 'car', { fuelType: 'electric' }),
  // RAM
  createVehicle('RAM', '1500', 2019, 2024, 'pickup', { fuelType: 'diesel' }),
  createVehicle('RAM', '2500', 2012, 2024, 'pickup', { fuelType: 'diesel' }),
  createVehicle('RAM', 'Rampage', 2023, 2024, 'pickup', { fuelType: 'diesel' }),
  // Caoa Chery
  createVehicle('Caoa Chery', 'Tiggo 5X', 2019, 2024, 'suv', { fuelType: 'flex' }),
  createVehicle('Caoa Chery', 'Tiggo 7', 2019, 2024, 'suv', { fuelType: 'flex' }),
  createVehicle('Caoa Chery', 'Tiggo 8', 2020, 2024, 'suv', { fuelType: 'flex' }),
  createVehicle('Caoa Chery', 'Arrizo 6', 2020, 2024, 'car', { fuelType: 'flex' }),
  // GWM
  createVehicle('GWM', 'Haval H6', 2021, 2024, 'suv', { fuelType: 'hybrid' }),
  createVehicle('GWM', 'Ora 03', 2023, 2024, 'car', { fuelType: 'electric' }),
  // BYD
  createVehicle('BYD', 'Dolphin', 2023, 2024, 'car', { fuelType: 'electric' }),
  createVehicle('BYD', 'Song Plus', 2023, 2024, 'suv', { fuelType: 'hybrid' }),
  createVehicle('BYD', 'Tan', 2023, 2024, 'suv', { fuelType: 'hybrid' }),
  createVehicle('BYD', 'Han', 2023, 2024, 'car', { fuelType: 'electric' }),
  createVehicle('BYD', 'Seal', 2024, 2024, 'car', { fuelType: 'electric' }),
];

// ============================================
// CAMINHÕES E ÔNIBUS
// ============================================

const TRUCKS_BUSES: NormalizedVehicle[] = [
  // Volkswagen Caminhões
  createVehicle('Volkswagen', 'Delivery 9.170', 2012, 2024, 'truck', { fuelType: 'diesel' }),
  createVehicle('Volkswagen', 'Delivery 11.180', 2012, 2024, 'truck', { fuelType: 'diesel' }),
  createVehicle('Volkswagen', 'Constellation 17.280', 2006, 2024, 'truck', { fuelType: 'diesel' }),
  createVehicle('Volkswagen', 'Constellation 24.280', 2006, 2024, 'truck', { fuelType: 'diesel' }),
  createVehicle('Volkswagen', 'e-Delivery', 2022, 2024, 'truck', { fuelType: 'electric' }),
  // Mercedes-Benz Caminhões
  createVehicle('Mercedes-Benz', 'Accelo 815', 2003, 2024, 'truck', { fuelType: 'diesel' }),
  createVehicle('Mercedes-Benz', 'Atego 1719', 2004, 2024, 'truck', { fuelType: 'diesel' }),
  createVehicle('Mercedes-Benz', 'Actros 2651', 2019, 2024, 'truck', { fuelType: 'diesel' }),
  createVehicle('Mercedes-Benz', 'Axor 2544', 2005, 2024, 'truck', { fuelType: 'diesel' }),
  // Scania
  createVehicle('Scania', 'R450', 2016, 2024, 'truck', { fuelType: 'diesel' }),
  createVehicle('Scania', 'R500', 2016, 2024, 'truck', { fuelType: 'diesel' }),
  createVehicle('Scania', 'P320', 2010, 2024, 'truck', { fuelType: 'diesel' }),
  // Volvo Caminhões
  createVehicle('Volvo', 'FH 540', 2010, 2024, 'truck', { fuelType: 'diesel' }),
  createVehicle('Volvo', 'FM 370', 2010, 2024, 'truck', { fuelType: 'diesel' }),
  createVehicle('Volvo', 'VM 270', 2006, 2024, 'truck', { fuelType: 'diesel' }),
  // Iveco
  createVehicle('Iveco', 'Daily 35S14', 2008, 2024, 'truck', { fuelType: 'diesel' }),
  createVehicle('Iveco', 'Tector 170E28', 2012, 2024, 'truck', { fuelType: 'diesel' }),
  createVehicle('Iveco', 'Hi-Way 600S44T', 2014, 2024, 'truck', { fuelType: 'diesel' }),
  // DAF
  createVehicle('DAF', 'XF 105', 2013, 2024, 'truck', { fuelType: 'diesel' }),
  createVehicle('DAF', 'CF 85', 2013, 2024, 'truck', { fuelType: 'diesel' }),
  // Ônibus
  createVehicle('Mercedes-Benz', 'OF 1721', 1998, 2024, 'bus', { fuelType: 'diesel' }),
  createVehicle('Mercedes-Benz', 'O 500 RS', 2003, 2024, 'bus', { fuelType: 'diesel' }),
  createVehicle('Volkswagen', '17.230 OD', 2012, 2024, 'bus', { fuelType: 'diesel' }),
  createVehicle('Volvo', 'B270F', 2010, 2024, 'bus', { fuelType: 'diesel' }),
  createVehicle('Scania', 'K310', 2008, 2024, 'bus', { fuelType: 'diesel' }),
];

// ============================================
// EXPORTAÇÃO DO BANCO DE DADOS COMPLETO
// ============================================

export const BRAZILIAN_VEHICLES_DATABASE: NormalizedVehicle[] = [
  ...CHEVROLET_CARS,
  ...VOLKSWAGEN_CARS,
  ...FIAT_CARS,
  ...FORD_CARS,
  ...HYUNDAI_CARS,
  ...TOYOTA_CARS,
  ...HONDA_CARS,
  ...RENAULT_CARS,
  ...HONDA_MOTOS,
  ...YAMAHA_MOTOS,
  ...OTHER_MOTOS,
  ...OTHER_CARS,
  ...TRUCKS_BUSES,
];

// Índice por marca para busca rápida
export const VEHICLES_BY_BRAND: Record<string, NormalizedVehicle[]> = 
  BRAZILIAN_VEHICLES_DATABASE.reduce((acc, vehicle) => {
    const brand = vehicle.brandNormalized;
    if (!acc[brand]) acc[brand] = [];
    acc[brand].push(vehicle);
    return acc;
  }, {} as Record<string, NormalizedVehicle[]>);

// Lista de marcas únicas
export const VEHICLE_BRANDS = [...new Set(BRAZILIAN_VEHICLES_DATABASE.map(v => v.brand))].sort();

// Estatísticas do banco
export const DATABASE_STATS = {
  totalVehicles: BRAZILIAN_VEHICLES_DATABASE.length,
  totalBrands: VEHICLE_BRANDS.length,
  cars: BRAZILIAN_VEHICLES_DATABASE.filter(v => v.bodyType === 'car').length,
  motorcycles: BRAZILIAN_VEHICLES_DATABASE.filter(v => v.bodyType === 'motorcycle').length,
  trucks: BRAZILIAN_VEHICLES_DATABASE.filter(v => v.bodyType === 'truck').length,
  suvs: BRAZILIAN_VEHICLES_DATABASE.filter(v => v.bodyType === 'suv').length,
  pickups: BRAZILIAN_VEHICLES_DATABASE.filter(v => v.bodyType === 'pickup').length,
  vans: BRAZILIAN_VEHICLES_DATABASE.filter(v => v.bodyType === 'van').length,
  buses: BRAZILIAN_VEHICLES_DATABASE.filter(v => v.bodyType === 'bus').length,
};

console.log(`[VehicleDB] Loaded ${DATABASE_STATS.totalVehicles} vehicles from ${DATABASE_STATS.totalBrands} brands`);
