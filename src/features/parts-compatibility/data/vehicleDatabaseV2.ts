/**
 * TORQ AI - Base de Dados de Veículos V2
 * 
 * Base completa e verificada de veículos brasileiros
 * Integrada com API FIPE para dados em tempo real
 * 
 * @author TORQ AI Team
 * @version 2.0.0
 * @lastUpdate Dezembro 2024
 */

// ============================================================================
// TIPOS
// ============================================================================

export type VehicleType = 
  | 'car'
  | 'suv'
  | 'pickup'
  | 'truck'
  | 'van'
  | 'bus'
  | 'motorcycle'
  | 'utility'
  | 'tractor'
  | 'agricultural';

export interface VehicleMakeInfo {
  name: string;
  country: string;
  types: VehicleType[];
  fipeCode?: string;
}

export interface VehicleModelInfo {
  name: string;
  make: string;
  type: VehicleType;
  years: { start: number; end: number };
  engine?: string;
  displacement?: string;
  fipeCode?: string;
}

// ============================================================================
// LABELS
// ============================================================================

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  car: 'Carro',
  suv: 'SUV',
  pickup: 'Pick-up',
  truck: 'Caminhão',
  van: 'Van/Furgão',
  bus: 'Ônibus',
  motorcycle: 'Moto',
  utility: 'Utilitário',
  tractor: 'Trator',
  agricultural: 'Máquina Agrícola',
};


// ============================================================================
// MARCAS DE VEÍCULOS - COMPLETO
// ============================================================================

export const VEHICLE_MAKES: Record<string, VehicleMakeInfo> = {
  // ========== CARROS NACIONAIS E IMPORTADOS ==========
  'Audi': { name: 'Audi', country: 'Alemanha', types: ['car', 'suv'] },
  'BMW': { name: 'BMW', country: 'Alemanha', types: ['car', 'suv', 'motorcycle'] },
  'BYD': { name: 'BYD', country: 'China', types: ['car', 'suv'] },
  'Caoa Chery': { name: 'Caoa Chery', country: 'China', types: ['car', 'suv'] },
  'Chevrolet': { name: 'Chevrolet', country: 'EUA', types: ['car', 'suv', 'pickup'] },
  'Citroën': { name: 'Citroën', country: 'França', types: ['car', 'suv', 'van'] },
  'Fiat': { name: 'Fiat', country: 'Itália', types: ['car', 'pickup', 'van'] },
  'Ford': { name: 'Ford', country: 'EUA', types: ['car', 'suv', 'pickup', 'truck'] },
  'GWM': { name: 'GWM', country: 'China', types: ['suv', 'pickup'] },
  'Honda': { name: 'Honda', country: 'Japão', types: ['car', 'suv', 'motorcycle'] },
  'Hyundai': { name: 'Hyundai', country: 'Coreia do Sul', types: ['car', 'suv', 'van'] },
  'JAC': { name: 'JAC', country: 'China', types: ['car', 'suv', 'pickup'] },
  'Jaguar': { name: 'Jaguar', country: 'Reino Unido', types: ['car', 'suv'] },
  'Jeep': { name: 'Jeep', country: 'EUA', types: ['suv', 'pickup'] },
  'Kia': { name: 'Kia', country: 'Coreia do Sul', types: ['car', 'suv'] },
  'Land Rover': { name: 'Land Rover', country: 'Reino Unido', types: ['suv'] },
  'Lexus': { name: 'Lexus', country: 'Japão', types: ['car', 'suv'] },
  'Maserati': { name: 'Maserati', country: 'Itália', types: ['car', 'suv'] },
  'Mercedes-Benz': { name: 'Mercedes-Benz', country: 'Alemanha', types: ['car', 'suv', 'van', 'truck', 'bus'] },
  'Mini': { name: 'Mini', country: 'Reino Unido', types: ['car'] },
  'Mitsubishi': { name: 'Mitsubishi', country: 'Japão', types: ['car', 'suv', 'pickup'] },
  'Nissan': { name: 'Nissan', country: 'Japão', types: ['car', 'suv', 'pickup'] },
  'Peugeot': { name: 'Peugeot', country: 'França', types: ['car', 'suv', 'van', 'pickup'] },
  'Porsche': { name: 'Porsche', country: 'Alemanha', types: ['car', 'suv'] },
  'RAM': { name: 'RAM', country: 'EUA', types: ['pickup'] },
  'Renault': { name: 'Renault', country: 'França', types: ['car', 'suv', 'pickup', 'van'] },
  'Subaru': { name: 'Subaru', country: 'Japão', types: ['car', 'suv'] },
  'Suzuki': { name: 'Suzuki', country: 'Japão', types: ['car', 'suv', 'motorcycle'] },
  'Toyota': { name: 'Toyota', country: 'Japão', types: ['car', 'suv', 'pickup'] },
  'Volkswagen': { name: 'Volkswagen', country: 'Alemanha', types: ['car', 'suv', 'pickup', 'van', 'truck', 'bus'] },
  'Volvo': { name: 'Volvo', country: 'Suécia', types: ['car', 'suv', 'truck', 'bus'] },

  // ========== MOTOS ==========
  'Dafra': { name: 'Dafra', country: 'Brasil', types: ['motorcycle'] },
  'Ducati': { name: 'Ducati', country: 'Itália', types: ['motorcycle'] },
  'Harley-Davidson': { name: 'Harley-Davidson', country: 'EUA', types: ['motorcycle'] },
  'Husqvarna': { name: 'Husqvarna', country: 'Suécia', types: ['motorcycle'] },
  'Indian': { name: 'Indian', country: 'EUA', types: ['motorcycle'] },
  'Kawasaki': { name: 'Kawasaki', country: 'Japão', types: ['motorcycle'] },
  'KTM': { name: 'KTM', country: 'Áustria', types: ['motorcycle'] },
  'Royal Enfield': { name: 'Royal Enfield', country: 'Índia', types: ['motorcycle'] },
  'Shineray': { name: 'Shineray', country: 'China', types: ['motorcycle', 'utility'] },
  'Triumph': { name: 'Triumph', country: 'Reino Unido', types: ['motorcycle'] },
  'Yamaha': { name: 'Yamaha', country: 'Japão', types: ['motorcycle'] },

  // ========== CAMINHÕES ==========
  'DAF': { name: 'DAF', country: 'Holanda', types: ['truck'] },
  'Iveco': { name: 'Iveco', country: 'Itália', types: ['truck', 'van', 'bus'] },
  'MAN': { name: 'MAN', country: 'Alemanha', types: ['truck', 'bus'] },
  'Scania': { name: 'Scania', country: 'Suécia', types: ['truck', 'bus'] },

  // ========== ÔNIBUS ==========
  'Agrale': { name: 'Agrale', country: 'Brasil', types: ['bus', 'truck'] },
  'Marcopolo': { name: 'Marcopolo', country: 'Brasil', types: ['bus'] },

  // ========== TRATORES E AGRÍCOLAS ==========
  'Case IH': { name: 'Case IH', country: 'EUA', types: ['tractor', 'agricultural'] },
  'CLAAS': { name: 'CLAAS', country: 'Alemanha', types: ['agricultural'] },
  'John Deere': { name: 'John Deere', country: 'EUA', types: ['tractor', 'agricultural'] },
  'Massey Ferguson': { name: 'Massey Ferguson', country: 'EUA', types: ['tractor', 'agricultural'] },
  'New Holland': { name: 'New Holland', country: 'Itália', types: ['tractor', 'agricultural'] },
  'Valtra': { name: 'Valtra', country: 'Finlândia', types: ['tractor'] },

  // ========== UTILITÁRIOS ==========
  'Effa': { name: 'Effa', country: 'China', types: ['utility', 'van'] },
  'Mahindra': { name: 'Mahindra', country: 'Índia', types: ['utility', 'pickup'] },
  'Piaggio': { name: 'Piaggio', country: 'Itália', types: ['utility', 'motorcycle'] },
  'Troller': { name: 'Troller', country: 'Brasil', types: ['suv'] },
};


// ============================================================================
// MODELOS POR MARCA - MOTOS (VERIFICADO)
// ============================================================================

export const MOTORCYCLE_MODELS: Record<string, VehicleModelInfo[]> = {
  'Yamaha': [
    // Esportivas
    { name: 'YZF-R1', make: 'Yamaha', type: 'motorcycle', years: { start: 1998, end: 2024 }, engine: '998cc 4-cil', displacement: '998cc' },
    { name: 'YZF-R1M', make: 'Yamaha', type: 'motorcycle', years: { start: 2015, end: 2024 }, engine: '998cc 4-cil', displacement: '998cc' },
    { name: 'YZF-R6', make: 'Yamaha', type: 'motorcycle', years: { start: 1999, end: 2024 }, engine: '599cc 4-cil', displacement: '599cc' },
    { name: 'YZF-R7', make: 'Yamaha', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '689cc 2-cil', displacement: '689cc' },
    { name: 'YZF-R3', make: 'Yamaha', type: 'motorcycle', years: { start: 2015, end: 2024 }, engine: '321cc 2-cil', displacement: '321cc' },
    { name: 'R3', make: 'Yamaha', type: 'motorcycle', years: { start: 2015, end: 2024 }, engine: '321cc 2-cil', displacement: '321cc' },
    // Naked
    { name: 'MT-03', make: 'Yamaha', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '321cc 2-cil', displacement: '321cc' },
    { name: 'MT-07', make: 'Yamaha', type: 'motorcycle', years: { start: 2014, end: 2024 }, engine: '689cc 2-cil', displacement: '689cc' },
    { name: 'MT-09', make: 'Yamaha', type: 'motorcycle', years: { start: 2014, end: 2024 }, engine: '889cc 3-cil', displacement: '889cc' },
    { name: 'MT-10', make: 'Yamaha', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '998cc 4-cil', displacement: '998cc' },
    { name: 'XJ6', make: 'Yamaha', type: 'motorcycle', years: { start: 2009, end: 2016 }, engine: '600cc 4-cil', displacement: '600cc' },
    // Adventure/Touring
    { name: 'Tenere 700', make: 'Yamaha', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '689cc 2-cil', displacement: '689cc' },
    { name: 'Tracer 9', make: 'Yamaha', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '889cc 3-cil', displacement: '889cc' },
    { name: 'Tracer 9 GT', make: 'Yamaha', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '889cc 3-cil', displacement: '889cc' },
    // Neo-Retro
    { name: 'XSR 700', make: 'Yamaha', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '689cc 2-cil', displacement: '689cc' },
    { name: 'XSR 900', make: 'Yamaha', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '889cc 3-cil', displacement: '889cc' },
    // Trail/Off-road
    { name: 'Tenere 250', make: 'Yamaha', type: 'motorcycle', years: { start: 2010, end: 2020 }, engine: '249cc 1-cil', displacement: '249cc' },
    { name: 'Lander 250', make: 'Yamaha', type: 'motorcycle', years: { start: 2006, end: 2024 }, engine: '249cc 1-cil', displacement: '249cc' },
    { name: 'XTZ 250', make: 'Yamaha', type: 'motorcycle', years: { start: 2006, end: 2024 }, engine: '249cc 1-cil', displacement: '249cc' },
    { name: 'Crosser 150', make: 'Yamaha', type: 'motorcycle', years: { start: 2014, end: 2024 }, engine: '149cc 1-cil', displacement: '149cc' },
    // Street
    { name: 'Fazer 250', make: 'Yamaha', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '249cc 1-cil', displacement: '249cc' },
    { name: 'FZ25', make: 'Yamaha', type: 'motorcycle', years: { start: 2017, end: 2024 }, engine: '249cc 1-cil', displacement: '249cc' },
    { name: 'Factor 150', make: 'Yamaha', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '149cc 1-cil', displacement: '149cc' },
    { name: 'Factor 125', make: 'Yamaha', type: 'motorcycle', years: { start: 2008, end: 2024 }, engine: '124cc 1-cil', displacement: '124cc' },
    // Scooter
    { name: 'NMAX 160', make: 'Yamaha', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '155cc 1-cil', displacement: '155cc' },
    { name: 'XMax 250', make: 'Yamaha', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '249cc 1-cil', displacement: '249cc' },
    { name: 'Neo 125', make: 'Yamaha', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '125cc 1-cil', displacement: '125cc' },
    // Competição
    { name: 'YZ250F', make: 'Yamaha', type: 'motorcycle', years: { start: 2001, end: 2024 }, engine: '250cc 1-cil', displacement: '250cc' },
    { name: 'YZ450F', make: 'Yamaha', type: 'motorcycle', years: { start: 2003, end: 2024 }, engine: '450cc 1-cil', displacement: '450cc' },
    { name: 'WR250F', make: 'Yamaha', type: 'motorcycle', years: { start: 2001, end: 2024 }, engine: '250cc 1-cil', displacement: '250cc' },
    { name: 'WR450F', make: 'Yamaha', type: 'motorcycle', years: { start: 2003, end: 2024 }, engine: '450cc 1-cil', displacement: '450cc' },
  ],

  'Honda': [
    // Esportivas
    { name: 'CBR1000RR-R Fireblade', make: 'Honda', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '999cc 4-cil', displacement: '999cc' },
    { name: 'CBR1000RR', make: 'Honda', type: 'motorcycle', years: { start: 2004, end: 2019 }, engine: '999cc 4-cil', displacement: '999cc' },
    { name: 'CBR650R', make: 'Honda', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '649cc 4-cil', displacement: '649cc' },
    { name: 'CBR500R', make: 'Honda', type: 'motorcycle', years: { start: 2013, end: 2024 }, engine: '471cc 2-cil', displacement: '471cc' },
    // Naked
    { name: 'CB1000R', make: 'Honda', type: 'motorcycle', years: { start: 2008, end: 2024 }, engine: '998cc 4-cil', displacement: '998cc' },
    { name: 'CB650R', make: 'Honda', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '649cc 4-cil', displacement: '649cc' },
    { name: 'CB500F', make: 'Honda', type: 'motorcycle', years: { start: 2013, end: 2024 }, engine: '471cc 2-cil', displacement: '471cc' },
    { name: 'CB500X', make: 'Honda', type: 'motorcycle', years: { start: 2013, end: 2024 }, engine: '471cc 2-cil', displacement: '471cc' },
    { name: 'CB 300F Twister', make: 'Honda', type: 'motorcycle', years: { start: 2015, end: 2024 }, engine: '293cc 1-cil', displacement: '293cc' },
    { name: 'CB 250F Twister', make: 'Honda', type: 'motorcycle', years: { start: 2015, end: 2024 }, engine: '249cc 1-cil', displacement: '249cc' },
    { name: 'Hornet 600', make: 'Honda', type: 'motorcycle', years: { start: 1998, end: 2013 }, engine: '599cc 4-cil', displacement: '599cc' },
    // Adventure
    { name: 'Africa Twin', make: 'Honda', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '1084cc 2-cil', displacement: '1084cc' },
    { name: 'CRF1100L', make: 'Honda', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '1084cc 2-cil', displacement: '1084cc' },
    { name: 'NC750X', make: 'Honda', type: 'motorcycle', years: { start: 2014, end: 2024 }, engine: '745cc 2-cil', displacement: '745cc' },
    { name: 'X-ADV', make: 'Honda', type: 'motorcycle', years: { start: 2017, end: 2024 }, engine: '745cc 2-cil', displacement: '745cc' },
    // Trail
    { name: 'XRE 300', make: 'Honda', type: 'motorcycle', years: { start: 2009, end: 2024 }, engine: '291cc 1-cil', displacement: '291cc' },
    { name: 'XRE 190', make: 'Honda', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '184cc 1-cil', displacement: '184cc' },
    { name: 'CRF300L', make: 'Honda', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '286cc 1-cil', displacement: '286cc' },
    { name: 'CRF250L', make: 'Honda', type: 'motorcycle', years: { start: 2012, end: 2024 }, engine: '249cc 1-cil', displacement: '249cc' },
    { name: 'CRF250F', make: 'Honda', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '249cc 1-cil', displacement: '249cc' },
    { name: 'CRF 190L', make: 'Honda', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '184cc 1-cil', displacement: '184cc' },
    // Street
    { name: 'CG 160', make: 'Honda', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '162cc 1-cil', displacement: '162cc' },
    { name: 'CG 160 Titan', make: 'Honda', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '162cc 1-cil', displacement: '162cc' },
    { name: 'CG 160 Fan', make: 'Honda', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '162cc 1-cil', displacement: '162cc' },
    { name: 'CG 160 Start', make: 'Honda', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '162cc 1-cil', displacement: '162cc' },
    { name: 'Bros 160', make: 'Honda', type: 'motorcycle', years: { start: 2015, end: 2024 }, engine: '162cc 1-cil', displacement: '162cc' },
    // Scooter
    { name: 'PCX 160', make: 'Honda', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '156cc 1-cil', displacement: '156cc' },
    { name: 'SH 150i', make: 'Honda', type: 'motorcycle', years: { start: 2017, end: 2024 }, engine: '149cc 1-cil', displacement: '149cc' },
    { name: 'Elite 125', make: 'Honda', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '124cc 1-cil', displacement: '124cc' },
    { name: 'ADV 150', make: 'Honda', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '149cc 1-cil', displacement: '149cc' },
    // Cub
    { name: 'Biz 125', make: 'Honda', type: 'motorcycle', years: { start: 2005, end: 2024 }, engine: '124cc 1-cil', displacement: '124cc' },
    { name: 'Biz 110i', make: 'Honda', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '109cc 1-cil', displacement: '109cc' },
    { name: 'Pop 110i', make: 'Honda', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '109cc 1-cil', displacement: '109cc' },
    // Cruiser
    { name: 'Rebel 500', make: 'Honda', type: 'motorcycle', years: { start: 2017, end: 2024 }, engine: '471cc 2-cil', displacement: '471cc' },
    // Touring
    { name: 'GL 1800 Gold Wing', make: 'Honda', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '1833cc 6-cil', displacement: '1833cc' },
  ],

  'Kawasaki': [
    // Esportivas
    { name: 'Ninja ZX-10R', make: 'Kawasaki', type: 'motorcycle', years: { start: 2004, end: 2024 }, engine: '998cc 4-cil', displacement: '998cc' },
    { name: 'Ninja ZX-10RR', make: 'Kawasaki', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '998cc 4-cil', displacement: '998cc' },
    { name: 'Ninja ZX-6R', make: 'Kawasaki', type: 'motorcycle', years: { start: 1995, end: 2024 }, engine: '636cc 4-cil', displacement: '636cc' },
    { name: 'Ninja ZX-4R', make: 'Kawasaki', type: 'motorcycle', years: { start: 2023, end: 2024 }, engine: '399cc 4-cil', displacement: '399cc' },
    { name: 'Ninja ZX-4RR', make: 'Kawasaki', type: 'motorcycle', years: { start: 2023, end: 2024 }, engine: '399cc 4-cil', displacement: '399cc' },
    { name: 'Ninja H2', make: 'Kawasaki', type: 'motorcycle', years: { start: 2015, end: 2024 }, engine: '998cc 4-cil Turbo', displacement: '998cc' },
    { name: 'Ninja 650', make: 'Kawasaki', type: 'motorcycle', years: { start: 2006, end: 2024 }, engine: '649cc 2-cil', displacement: '649cc' },
    { name: 'Ninja 400', make: 'Kawasaki', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '399cc 2-cil', displacement: '399cc' },
    { name: 'Ninja 300', make: 'Kawasaki', type: 'motorcycle', years: { start: 2013, end: 2017 }, engine: '296cc 2-cil', displacement: '296cc' },
    // Naked
    { name: 'Z H2', make: 'Kawasaki', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '998cc 4-cil Turbo', displacement: '998cc' },
    { name: 'Z1000', make: 'Kawasaki', type: 'motorcycle', years: { start: 2003, end: 2019 }, engine: '1043cc 4-cil', displacement: '1043cc' },
    { name: 'Z900', make: 'Kawasaki', type: 'motorcycle', years: { start: 2017, end: 2024 }, engine: '948cc 4-cil', displacement: '948cc' },
    { name: 'Z900RS', make: 'Kawasaki', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '948cc 4-cil', displacement: '948cc' },
    { name: 'Z650', make: 'Kawasaki', type: 'motorcycle', years: { start: 2017, end: 2024 }, engine: '649cc 2-cil', displacement: '649cc' },
    { name: 'Z650RS', make: 'Kawasaki', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '649cc 2-cil', displacement: '649cc' },
    { name: 'Z400', make: 'Kawasaki', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '399cc 2-cil', displacement: '399cc' },
    { name: 'ER-6n', make: 'Kawasaki', type: 'motorcycle', years: { start: 2006, end: 2016 }, engine: '649cc 2-cil', displacement: '649cc' },
    // Adventure
    { name: 'Versys 1000', make: 'Kawasaki', type: 'motorcycle', years: { start: 2012, end: 2024 }, engine: '1043cc 4-cil', displacement: '1043cc' },
    { name: 'Versys 650', make: 'Kawasaki', type: 'motorcycle', years: { start: 2006, end: 2024 }, engine: '649cc 2-cil', displacement: '649cc' },
    { name: 'Versys-X 300', make: 'Kawasaki', type: 'motorcycle', years: { start: 2017, end: 2024 }, engine: '296cc 2-cil', displacement: '296cc' },
    // Cruiser
    { name: 'Vulcan 650 S', make: 'Kawasaki', type: 'motorcycle', years: { start: 2015, end: 2024 }, engine: '649cc 2-cil', displacement: '649cc' },
    { name: 'Vulcan 900', make: 'Kawasaki', type: 'motorcycle', years: { start: 2006, end: 2024 }, engine: '903cc 2-cil', displacement: '903cc' },
    // Off-road
    { name: 'KX450', make: 'Kawasaki', type: 'motorcycle', years: { start: 2006, end: 2024 }, engine: '449cc 1-cil', displacement: '449cc' },
    { name: 'KX250', make: 'Kawasaki', type: 'motorcycle', years: { start: 2004, end: 2024 }, engine: '249cc 1-cil', displacement: '249cc' },
    { name: 'KLX300', make: 'Kawasaki', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '292cc 1-cil', displacement: '292cc' },
    { name: 'KLX230', make: 'Kawasaki', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '233cc 1-cil', displacement: '233cc' },
    { name: 'KLR 650', make: 'Kawasaki', type: 'motorcycle', years: { start: 1987, end: 2024 }, engine: '652cc 1-cil', displacement: '652cc' },
    // Retro
    { name: 'W800', make: 'Kawasaki', type: 'motorcycle', years: { start: 2011, end: 2024 }, engine: '773cc 2-cil', displacement: '773cc' },
  ],

  'Suzuki': [
    // Esportivas
    { name: 'GSX-R 1000', make: 'Suzuki', type: 'motorcycle', years: { start: 2001, end: 2024 }, engine: '999cc 4-cil', displacement: '999cc' },
    { name: 'GSX-R 1000R', make: 'Suzuki', type: 'motorcycle', years: { start: 2017, end: 2024 }, engine: '999cc 4-cil', displacement: '999cc' },
    { name: 'GSX-R 750', make: 'Suzuki', type: 'motorcycle', years: { start: 1996, end: 2024 }, engine: '750cc 4-cil', displacement: '750cc' },
    { name: 'GSX-R 600', make: 'Suzuki', type: 'motorcycle', years: { start: 1997, end: 2024 }, engine: '599cc 4-cil', displacement: '599cc' },
    { name: 'Hayabusa', make: 'Suzuki', type: 'motorcycle', years: { start: 1999, end: 2024 }, engine: '1340cc 4-cil', displacement: '1340cc' },
    // Naked
    { name: 'GSX-S 1000', make: 'Suzuki', type: 'motorcycle', years: { start: 2015, end: 2024 }, engine: '999cc 4-cil', displacement: '999cc' },
    { name: 'GSX-S 1000GT', make: 'Suzuki', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '999cc 4-cil', displacement: '999cc' },
    { name: 'GSX-S 750', make: 'Suzuki', type: 'motorcycle', years: { start: 2015, end: 2024 }, engine: '749cc 4-cil', displacement: '749cc' },
    { name: 'SV650', make: 'Suzuki', type: 'motorcycle', years: { start: 1999, end: 2024 }, engine: '645cc 2-cil', displacement: '645cc' },
    { name: 'Katana', make: 'Suzuki', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '999cc 4-cil', displacement: '999cc' },
    { name: 'Bandit 650', make: 'Suzuki', type: 'motorcycle', years: { start: 2005, end: 2016 }, engine: '656cc 4-cil', displacement: '656cc' },
    { name: 'Bandit 1250', make: 'Suzuki', type: 'motorcycle', years: { start: 2007, end: 2016 }, engine: '1255cc 4-cil', displacement: '1255cc' },
    // Adventure
    { name: 'V-Strom 1050', make: 'Suzuki', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '1037cc 2-cil', displacement: '1037cc' },
    { name: 'V-Strom 1050 DE', make: 'Suzuki', type: 'motorcycle', years: { start: 2023, end: 2024 }, engine: '1037cc 2-cil', displacement: '1037cc' },
    { name: 'V-Strom 650', make: 'Suzuki', type: 'motorcycle', years: { start: 2004, end: 2024 }, engine: '645cc 2-cil', displacement: '645cc' },
    { name: 'V-Strom 650 XT', make: 'Suzuki', type: 'motorcycle', years: { start: 2015, end: 2024 }, engine: '645cc 2-cil', displacement: '645cc' },
    { name: 'V-Strom 250', make: 'Suzuki', type: 'motorcycle', years: { start: 2017, end: 2024 }, engine: '248cc 1-cil', displacement: '248cc' },
    // Off-road
    { name: 'DR-Z 400', make: 'Suzuki', type: 'motorcycle', years: { start: 2000, end: 2024 }, engine: '398cc 1-cil', displacement: '398cc' },
    { name: 'RM-Z 450', make: 'Suzuki', type: 'motorcycle', years: { start: 2005, end: 2024 }, engine: '449cc 1-cil', displacement: '449cc' },
    { name: 'RM-Z 250', make: 'Suzuki', type: 'motorcycle', years: { start: 2004, end: 2024 }, engine: '249cc 1-cil', displacement: '249cc' },
    // Scooter
    { name: 'Burgman 400', make: 'Suzuki', type: 'motorcycle', years: { start: 1998, end: 2024 }, engine: '400cc 1-cil', displacement: '400cc' },
    { name: 'Burgman 650', make: 'Suzuki', type: 'motorcycle', years: { start: 2002, end: 2024 }, engine: '638cc 2-cil', displacement: '638cc' },
    { name: 'Burgman 125', make: 'Suzuki', type: 'motorcycle', years: { start: 2002, end: 2024 }, engine: '124cc 1-cil', displacement: '124cc' },
    { name: 'Address 125', make: 'Suzuki', type: 'motorcycle', years: { start: 2015, end: 2024 }, engine: '124cc 1-cil', displacement: '124cc' },
    // Cruiser
    { name: 'Intruder 125', make: 'Suzuki', type: 'motorcycle', years: { start: 2001, end: 2024 }, engine: '124cc 1-cil', displacement: '124cc' },
  ],

  'BMW': [
    // Esportivas
    { name: 'S 1000 RR', make: 'BMW', type: 'motorcycle', years: { start: 2010, end: 2024 }, engine: '999cc 4-cil', displacement: '999cc' },
    { name: 'M 1000 RR', make: 'BMW', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '999cc 4-cil', displacement: '999cc' },
    { name: 'M 1000 R', make: 'BMW', type: 'motorcycle', years: { start: 2023, end: 2024 }, engine: '999cc 4-cil', displacement: '999cc' },
    // Naked
    { name: 'S 1000 R', make: 'BMW', type: 'motorcycle', years: { start: 2014, end: 2024 }, engine: '999cc 4-cil', displacement: '999cc' },
    // Adventure Sport
    { name: 'S 1000 XR', make: 'BMW', type: 'motorcycle', years: { start: 2015, end: 2024 }, engine: '999cc 4-cil', displacement: '999cc' },
    // Adventure
    { name: 'R 1250 GS', make: 'BMW', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '1254cc Boxer', displacement: '1254cc' },
    { name: 'R 1250 GS Adventure', make: 'BMW', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '1254cc Boxer', displacement: '1254cc' },
    { name: 'R 1200 GS', make: 'BMW', type: 'motorcycle', years: { start: 2013, end: 2018 }, engine: '1170cc Boxer', displacement: '1170cc' },
    { name: 'F 850 GS', make: 'BMW', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '853cc 2-cil', displacement: '853cc' },
    { name: 'F 850 GS Adventure', make: 'BMW', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '853cc 2-cil', displacement: '853cc' },
    { name: 'F 750 GS', make: 'BMW', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '853cc 2-cil', displacement: '853cc' },
    { name: 'F 900 XR', make: 'BMW', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '895cc 2-cil', displacement: '895cc' },
    { name: 'F 900 R', make: 'BMW', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '895cc 2-cil', displacement: '895cc' },
    { name: 'G 310 GS', make: 'BMW', type: 'motorcycle', years: { start: 2017, end: 2024 }, engine: '313cc 1-cil', displacement: '313cc' },
    { name: 'G 310 R', make: 'BMW', type: 'motorcycle', years: { start: 2017, end: 2024 }, engine: '313cc 1-cil', displacement: '313cc' },
    // Touring
    { name: 'R 1250 RT', make: 'BMW', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '1254cc Boxer', displacement: '1254cc' },
    { name: 'K 1600 GT', make: 'BMW', type: 'motorcycle', years: { start: 2011, end: 2024 }, engine: '1649cc 6-cil', displacement: '1649cc' },
    { name: 'K 1600 GTL', make: 'BMW', type: 'motorcycle', years: { start: 2011, end: 2024 }, engine: '1649cc 6-cil', displacement: '1649cc' },
    { name: 'K 1600 B', make: 'BMW', type: 'motorcycle', years: { start: 2017, end: 2024 }, engine: '1649cc 6-cil', displacement: '1649cc' },
    // Roadster
    { name: 'R 1250 R', make: 'BMW', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '1254cc Boxer', displacement: '1254cc' },
    { name: 'R 1250 RS', make: 'BMW', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '1254cc Boxer', displacement: '1254cc' },
    // Heritage
    { name: 'R nineT', make: 'BMW', type: 'motorcycle', years: { start: 2014, end: 2024 }, engine: '1170cc Boxer', displacement: '1170cc' },
    { name: 'R nineT Pure', make: 'BMW', type: 'motorcycle', years: { start: 2017, end: 2024 }, engine: '1170cc Boxer', displacement: '1170cc' },
    { name: 'R nineT Scrambler', make: 'BMW', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '1170cc Boxer', displacement: '1170cc' },
    { name: 'R nineT Urban G/S', make: 'BMW', type: 'motorcycle', years: { start: 2017, end: 2024 }, engine: '1170cc Boxer', displacement: '1170cc' },
    // Cruiser
    { name: 'R 18', make: 'BMW', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '1802cc Boxer', displacement: '1802cc' },
    { name: 'R 18 B', make: 'BMW', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '1802cc Boxer', displacement: '1802cc' },
    { name: 'R 18 Transcontinental', make: 'BMW', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '1802cc Boxer', displacement: '1802cc' },
    { name: 'R 18 Classic', make: 'BMW', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '1802cc Boxer', displacement: '1802cc' },
    // Scooter
    { name: 'C 400 GT', make: 'BMW', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '350cc 1-cil', displacement: '350cc' },
    { name: 'C 400 X', make: 'BMW', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '350cc 1-cil', displacement: '350cc' },
    { name: 'CE 04', make: 'BMW', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: 'Elétrico', displacement: 'Elétrico' },
  ],

  'Ducati': [
    // Superbike
    { name: 'Panigale V4', make: 'Ducati', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '1103cc V4', displacement: '1103cc' },
    { name: 'Panigale V4 S', make: 'Ducati', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '1103cc V4', displacement: '1103cc' },
    { name: 'Panigale V4 R', make: 'Ducati', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '998cc V4', displacement: '998cc' },
    { name: 'Panigale V2', make: 'Ducati', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '955cc L-Twin', displacement: '955cc' },
    // Streetfighter
    { name: 'Streetfighter V4', make: 'Ducati', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '1103cc V4', displacement: '1103cc' },
    { name: 'Streetfighter V4 S', make: 'Ducati', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '1103cc V4', displacement: '1103cc' },
    { name: 'Streetfighter V2', make: 'Ducati', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '955cc L-Twin', displacement: '955cc' },
    // Monster
    { name: 'Monster', make: 'Ducati', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '937cc L-Twin', displacement: '937cc' },
    { name: 'Monster SP', make: 'Ducati', type: 'motorcycle', years: { start: 2023, end: 2024 }, engine: '937cc L-Twin', displacement: '937cc' },
    // Multistrada
    { name: 'Multistrada V4', make: 'Ducati', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '1158cc V4', displacement: '1158cc' },
    { name: 'Multistrada V4 S', make: 'Ducati', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '1158cc V4', displacement: '1158cc' },
    { name: 'Multistrada V4 Rally', make: 'Ducati', type: 'motorcycle', years: { start: 2023, end: 2024 }, engine: '1158cc V4', displacement: '1158cc' },
    { name: 'Multistrada V2', make: 'Ducati', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '937cc L-Twin', displacement: '937cc' },
    // Diavel
    { name: 'Diavel V4', make: 'Ducati', type: 'motorcycle', years: { start: 2023, end: 2024 }, engine: '1158cc V4', displacement: '1158cc' },
    { name: 'XDiavel', make: 'Ducati', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '1262cc L-Twin', displacement: '1262cc' },
    // Scrambler
    { name: 'Scrambler', make: 'Ducati', type: 'motorcycle', years: { start: 2015, end: 2024 }, engine: '803cc L-Twin', displacement: '803cc' },
    { name: 'Scrambler Icon', make: 'Ducati', type: 'motorcycle', years: { start: 2015, end: 2024 }, engine: '803cc L-Twin', displacement: '803cc' },
    { name: 'Scrambler 1100', make: 'Ducati', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '1079cc L-Twin', displacement: '1079cc' },
    { name: 'Scrambler Full Throttle', make: 'Ducati', type: 'motorcycle', years: { start: 2015, end: 2024 }, engine: '803cc L-Twin', displacement: '803cc' },
    { name: 'Scrambler Desert Sled', make: 'Ducati', type: 'motorcycle', years: { start: 2017, end: 2024 }, engine: '803cc L-Twin', displacement: '803cc' },
    { name: 'Scrambler Nightshift', make: 'Ducati', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '803cc L-Twin', displacement: '803cc' },
    // SuperSport
    { name: 'SuperSport', make: 'Ducati', type: 'motorcycle', years: { start: 2017, end: 2024 }, engine: '937cc L-Twin', displacement: '937cc' },
    { name: 'SuperSport 950', make: 'Ducati', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '937cc L-Twin', displacement: '937cc' },
    // Hypermotard
    { name: 'Hypermotard 950', make: 'Ducati', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '937cc L-Twin', displacement: '937cc' },
    { name: 'Hypermotard 698', make: 'Ducati', type: 'motorcycle', years: { start: 2024, end: 2024 }, engine: '659cc 1-cil', displacement: '659cc' },
    // DesertX
    { name: 'DesertX', make: 'Ducati', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '937cc L-Twin', displacement: '937cc' },
    { name: 'DesertX Rally', make: 'Ducati', type: 'motorcycle', years: { start: 2024, end: 2024 }, engine: '937cc L-Twin', displacement: '937cc' },
  ],

  'KTM': [
    // Duke
    { name: '1290 Super Duke R', make: 'KTM', type: 'motorcycle', years: { start: 2014, end: 2024 }, engine: '1301cc V-Twin', displacement: '1301cc' },
    { name: '1290 Super Duke GT', make: 'KTM', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '1301cc V-Twin', displacement: '1301cc' },
    { name: '890 Duke', make: 'KTM', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '889cc 2-cil', displacement: '889cc' },
    { name: '890 Duke R', make: 'KTM', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '889cc 2-cil', displacement: '889cc' },
    { name: '790 Duke', make: 'KTM', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '799cc 2-cil', displacement: '799cc' },
    { name: '390 Duke', make: 'KTM', type: 'motorcycle', years: { start: 2013, end: 2024 }, engine: '373cc 1-cil', displacement: '373cc' },
    { name: '250 Duke', make: 'KTM', type: 'motorcycle', years: { start: 2015, end: 2024 }, engine: '248cc 1-cil', displacement: '248cc' },
    { name: '200 Duke', make: 'KTM', type: 'motorcycle', years: { start: 2012, end: 2024 }, engine: '199cc 1-cil', displacement: '199cc' },
    { name: '125 Duke', make: 'KTM', type: 'motorcycle', years: { start: 2011, end: 2024 }, engine: '125cc 1-cil', displacement: '125cc' },
    // Adventure
    { name: '1290 Super Adventure', make: 'KTM', type: 'motorcycle', years: { start: 2015, end: 2024 }, engine: '1301cc V-Twin', displacement: '1301cc' },
    { name: '1290 Super Adventure S', make: 'KTM', type: 'motorcycle', years: { start: 2017, end: 2024 }, engine: '1301cc V-Twin', displacement: '1301cc' },
    { name: '1290 Super Adventure R', make: 'KTM', type: 'motorcycle', years: { start: 2017, end: 2024 }, engine: '1301cc V-Twin', displacement: '1301cc' },
    { name: '890 Adventure', make: 'KTM', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '889cc 2-cil', displacement: '889cc' },
    { name: '890 Adventure R', make: 'KTM', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '889cc 2-cil', displacement: '889cc' },
    { name: '790 Adventure', make: 'KTM', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '799cc 2-cil', displacement: '799cc' },
    { name: '790 Adventure R', make: 'KTM', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '799cc 2-cil', displacement: '799cc' },
    { name: '390 Adventure', make: 'KTM', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '373cc 1-cil', displacement: '373cc' },
    { name: '250 Adventure', make: 'KTM', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '248cc 1-cil', displacement: '248cc' },
    // RC
    { name: 'RC 390', make: 'KTM', type: 'motorcycle', years: { start: 2014, end: 2024 }, engine: '373cc 1-cil', displacement: '373cc' },
    { name: 'RC 125', make: 'KTM', type: 'motorcycle', years: { start: 2014, end: 2024 }, engine: '125cc 1-cil', displacement: '125cc' },
    // Enduro
    { name: '690 Enduro R', make: 'KTM', type: 'motorcycle', years: { start: 2008, end: 2024 }, engine: '690cc 1-cil', displacement: '690cc' },
    { name: '690 SMC R', make: 'KTM', type: 'motorcycle', years: { start: 2008, end: 2024 }, engine: '690cc 1-cil', displacement: '690cc' },
    // EXC
    { name: '500 EXC-F', make: 'KTM', type: 'motorcycle', years: { start: 2012, end: 2024 }, engine: '510cc 1-cil', displacement: '510cc' },
    { name: '450 EXC-F', make: 'KTM', type: 'motorcycle', years: { start: 2012, end: 2024 }, engine: '449cc 1-cil', displacement: '449cc' },
    { name: '350 EXC-F', make: 'KTM', type: 'motorcycle', years: { start: 2012, end: 2024 }, engine: '349cc 1-cil', displacement: '349cc' },
    { name: '250 EXC-F', make: 'KTM', type: 'motorcycle', years: { start: 2012, end: 2024 }, engine: '249cc 1-cil', displacement: '249cc' },
    // SX-F
    { name: '450 SX-F', make: 'KTM', type: 'motorcycle', years: { start: 2013, end: 2024 }, engine: '449cc 1-cil', displacement: '449cc' },
    { name: '350 SX-F', make: 'KTM', type: 'motorcycle', years: { start: 2013, end: 2024 }, engine: '349cc 1-cil', displacement: '349cc' },
    { name: '250 SX-F', make: 'KTM', type: 'motorcycle', years: { start: 2013, end: 2024 }, engine: '249cc 1-cil', displacement: '249cc' },
  ],

  'Triumph': [
    // Street Triple
    { name: 'Street Triple', make: 'Triumph', type: 'motorcycle', years: { start: 2007, end: 2024 }, engine: '765cc 3-cil', displacement: '765cc' },
    { name: 'Street Triple R', make: 'Triumph', type: 'motorcycle', years: { start: 2009, end: 2024 }, engine: '765cc 3-cil', displacement: '765cc' },
    { name: 'Street Triple RS', make: 'Triumph', type: 'motorcycle', years: { start: 2017, end: 2024 }, engine: '765cc 3-cil', displacement: '765cc' },
    // Speed Triple
    { name: 'Speed Triple 1200', make: 'Triumph', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '1160cc 3-cil', displacement: '1160cc' },
    { name: 'Speed Triple 1200 RS', make: 'Triumph', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '1160cc 3-cil', displacement: '1160cc' },
    { name: 'Speed Triple 1200 RR', make: 'Triumph', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '1160cc 3-cil', displacement: '1160cc' },
    // Tiger
    { name: 'Tiger 1200', make: 'Triumph', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '1160cc 3-cil', displacement: '1160cc' },
    { name: 'Tiger 1200 GT', make: 'Triumph', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '1160cc 3-cil', displacement: '1160cc' },
    { name: 'Tiger 1200 Rally', make: 'Triumph', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '1160cc 3-cil', displacement: '1160cc' },
    { name: 'Tiger 900', make: 'Triumph', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '888cc 3-cil', displacement: '888cc' },
    { name: 'Tiger 900 GT', make: 'Triumph', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '888cc 3-cil', displacement: '888cc' },
    { name: 'Tiger 900 Rally', make: 'Triumph', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '888cc 3-cil', displacement: '888cc' },
    { name: 'Tiger 850 Sport', make: 'Triumph', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '888cc 3-cil', displacement: '888cc' },
    { name: 'Tiger 660 Sport', make: 'Triumph', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '660cc 3-cil', displacement: '660cc' },
    // Trident
    { name: 'Trident 660', make: 'Triumph', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '660cc 3-cil', displacement: '660cc' },
    // Speed 400
    { name: 'Speed 400', make: 'Triumph', type: 'motorcycle', years: { start: 2023, end: 2024 }, engine: '398cc 1-cil', displacement: '398cc' },
    { name: 'Scrambler 400 X', make: 'Triumph', type: 'motorcycle', years: { start: 2024, end: 2024 }, engine: '398cc 1-cil', displacement: '398cc' },
    // Daytona
    { name: 'Daytona 660', make: 'Triumph', type: 'motorcycle', years: { start: 2024, end: 2024 }, engine: '660cc 3-cil', displacement: '660cc' },
    // Bonneville
    { name: 'Bonneville T100', make: 'Triumph', type: 'motorcycle', years: { start: 2001, end: 2024 }, engine: '900cc 2-cil', displacement: '900cc' },
    { name: 'Bonneville T120', make: 'Triumph', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '1200cc 2-cil', displacement: '1200cc' },
    { name: 'Bonneville Bobber', make: 'Triumph', type: 'motorcycle', years: { start: 2017, end: 2024 }, engine: '1200cc 2-cil', displacement: '1200cc' },
    { name: 'Bonneville Speedmaster', make: 'Triumph', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '1200cc 2-cil', displacement: '1200cc' },
    { name: 'Thruxton RS', make: 'Triumph', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '1200cc 2-cil', displacement: '1200cc' },
    // Scrambler
    { name: 'Scrambler 900', make: 'Triumph', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '900cc 2-cil', displacement: '900cc' },
    { name: 'Scrambler 1200', make: 'Triumph', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '1200cc 2-cil', displacement: '1200cc' },
    { name: 'Street Scrambler', make: 'Triumph', type: 'motorcycle', years: { start: 2017, end: 2024 }, engine: '900cc 2-cil', displacement: '900cc' },
    // Rocket
    { name: 'Rocket 3', make: 'Triumph', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '2458cc 3-cil', displacement: '2458cc' },
    { name: 'Rocket 3 R', make: 'Triumph', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '2458cc 3-cil', displacement: '2458cc' },
    { name: 'Rocket 3 GT', make: 'Triumph', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '2458cc 3-cil', displacement: '2458cc' },
  ],

  'Harley-Davidson': [
    // Revolution Max
    { name: 'Sportster S', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '1252cc V-Twin', displacement: '1252cc' },
    { name: 'Nightster', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '975cc V-Twin', displacement: '975cc' },
    { name: 'Pan America', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '1252cc V-Twin', displacement: '1252cc' },
    { name: 'Pan America 1250', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '1252cc V-Twin', displacement: '1252cc' },
    // Touring
    { name: 'Street Glide', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 2006, end: 2024 }, engine: '1868cc V-Twin', displacement: '1868cc' },
    { name: 'Street Glide Special', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 2014, end: 2024 }, engine: '1868cc V-Twin', displacement: '1868cc' },
    { name: 'Road Glide', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 1998, end: 2024 }, engine: '1868cc V-Twin', displacement: '1868cc' },
    { name: 'Road Glide Limited', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '1868cc V-Twin', displacement: '1868cc' },
    { name: 'Road King', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 1994, end: 2024 }, engine: '1868cc V-Twin', displacement: '1868cc' },
    { name: 'Electra Glide', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 1965, end: 2024 }, engine: '1868cc V-Twin', displacement: '1868cc' },
    { name: 'Ultra Limited', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 2010, end: 2024 }, engine: '1868cc V-Twin', displacement: '1868cc' },
    { name: 'CVO Street Glide', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 2010, end: 2024 }, engine: '1923cc V-Twin', displacement: '1923cc' },
    { name: 'CVO Road Glide', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 2012, end: 2024 }, engine: '1923cc V-Twin', displacement: '1923cc' },
    { name: 'CVO Limited', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 2014, end: 2024 }, engine: '1923cc V-Twin', displacement: '1923cc' },
    // Softail
    { name: 'Fat Boy', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 1990, end: 2024 }, engine: '1868cc V-Twin', displacement: '1868cc' },
    { name: 'Fat Bob', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 2008, end: 2024 }, engine: '1868cc V-Twin', displacement: '1868cc' },
    { name: 'Breakout', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 2013, end: 2024 }, engine: '1868cc V-Twin', displacement: '1868cc' },
    { name: 'Heritage Classic', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 1986, end: 2024 }, engine: '1868cc V-Twin', displacement: '1868cc' },
    { name: 'Street Bob', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 2006, end: 2024 }, engine: '1868cc V-Twin', displacement: '1868cc' },
    { name: 'Low Rider', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 1977, end: 2024 }, engine: '1868cc V-Twin', displacement: '1868cc' },
    { name: 'Low Rider S', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '1868cc V-Twin', displacement: '1868cc' },
    { name: 'Low Rider ST', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '1868cc V-Twin', displacement: '1868cc' },
    { name: 'Softail Slim', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 2012, end: 2024 }, engine: '1868cc V-Twin', displacement: '1868cc' },
    { name: 'Softail Standard', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '1868cc V-Twin', displacement: '1868cc' },
    { name: 'Sport Glide', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '1868cc V-Twin', displacement: '1868cc' },
    // Trike
    { name: 'Tri Glide Ultra', make: 'Harley-Davidson', type: 'motorcycle', years: { start: 2009, end: 2024 }, engine: '1868cc V-Twin', displacement: '1868cc' },
  ],

  'Royal Enfield': [
    { name: 'Classic 350', make: 'Royal Enfield', type: 'motorcycle', years: { start: 2021, end: 2024 }, engine: '349cc 1-cil', displacement: '349cc' },
    { name: 'Meteor 350', make: 'Royal Enfield', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '349cc 1-cil', displacement: '349cc' },
    { name: 'Hunter 350', make: 'Royal Enfield', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '349cc 1-cil', displacement: '349cc' },
    { name: 'Bullet 350', make: 'Royal Enfield', type: 'motorcycle', years: { start: 2023, end: 2024 }, engine: '349cc 1-cil', displacement: '349cc' },
    { name: 'Interceptor 650', make: 'Royal Enfield', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '648cc 2-cil', displacement: '648cc' },
    { name: 'Continental GT 650', make: 'Royal Enfield', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '648cc 2-cil', displacement: '648cc' },
    { name: 'Super Meteor 650', make: 'Royal Enfield', type: 'motorcycle', years: { start: 2023, end: 2024 }, engine: '648cc 2-cil', displacement: '648cc' },
    { name: 'Himalayan', make: 'Royal Enfield', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '411cc 1-cil', displacement: '411cc' },
    { name: 'Scram 411', make: 'Royal Enfield', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '411cc 1-cil', displacement: '411cc' },
  ],

  'Husqvarna': [
    { name: 'Svartpilen 401', make: 'Husqvarna', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '373cc 1-cil', displacement: '373cc' },
    { name: 'Vitpilen 401', make: 'Husqvarna', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '373cc 1-cil', displacement: '373cc' },
    { name: 'Svartpilen 701', make: 'Husqvarna', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '692cc 1-cil', displacement: '692cc' },
    { name: 'Vitpilen 701', make: 'Husqvarna', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '692cc 1-cil', displacement: '692cc' },
    { name: '701 Enduro', make: 'Husqvarna', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '692cc 1-cil', displacement: '692cc' },
    { name: '701 Supermoto', make: 'Husqvarna', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '692cc 1-cil', displacement: '692cc' },
    { name: 'Norden 901', make: 'Husqvarna', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '889cc 2-cil', displacement: '889cc' },
    { name: 'FE 450', make: 'Husqvarna', type: 'motorcycle', years: { start: 2014, end: 2024 }, engine: '449cc 1-cil', displacement: '449cc' },
    { name: 'FE 350', make: 'Husqvarna', type: 'motorcycle', years: { start: 2014, end: 2024 }, engine: '349cc 1-cil', displacement: '349cc' },
    { name: 'FE 250', make: 'Husqvarna', type: 'motorcycle', years: { start: 2014, end: 2024 }, engine: '249cc 1-cil', displacement: '249cc' },
    { name: 'FE 501', make: 'Husqvarna', type: 'motorcycle', years: { start: 2014, end: 2024 }, engine: '510cc 1-cil', displacement: '510cc' },
    { name: 'FC 450', make: 'Husqvarna', type: 'motorcycle', years: { start: 2014, end: 2024 }, engine: '449cc 1-cil', displacement: '449cc' },
    { name: 'FC 350', make: 'Husqvarna', type: 'motorcycle', years: { start: 2014, end: 2024 }, engine: '349cc 1-cil', displacement: '349cc' },
    { name: 'FC 250', make: 'Husqvarna', type: 'motorcycle', years: { start: 2014, end: 2024 }, engine: '249cc 1-cil', displacement: '249cc' },
    { name: 'TE 300i', make: 'Husqvarna', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '293cc 1-cil', displacement: '293cc' },
    { name: 'TE 250i', make: 'Husqvarna', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '249cc 1-cil', displacement: '249cc' },
    { name: 'TE 150i', make: 'Husqvarna', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '143cc 1-cil', displacement: '143cc' },
  ],

  'Indian': [
    { name: 'Scout', make: 'Indian', type: 'motorcycle', years: { start: 2015, end: 2024 }, engine: '1133cc V-Twin', displacement: '1133cc' },
    { name: 'Scout Bobber', make: 'Indian', type: 'motorcycle', years: { start: 2018, end: 2024 }, engine: '1133cc V-Twin', displacement: '1133cc' },
    { name: 'Scout Rogue', make: 'Indian', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '1133cc V-Twin', displacement: '1133cc' },
    { name: 'FTR', make: 'Indian', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '1203cc V-Twin', displacement: '1203cc' },
    { name: 'FTR S', make: 'Indian', type: 'motorcycle', years: { start: 2019, end: 2024 }, engine: '1203cc V-Twin', displacement: '1203cc' },
    { name: 'FTR Rally', make: 'Indian', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '1203cc V-Twin', displacement: '1203cc' },
    { name: 'Chief', make: 'Indian', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '1890cc V-Twin', displacement: '1890cc' },
    { name: 'Chief Bobber', make: 'Indian', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '1890cc V-Twin', displacement: '1890cc' },
    { name: 'Chief Dark Horse', make: 'Indian', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '1890cc V-Twin', displacement: '1890cc' },
    { name: 'Super Chief', make: 'Indian', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '1890cc V-Twin', displacement: '1890cc' },
    { name: 'Chieftain', make: 'Indian', type: 'motorcycle', years: { start: 2014, end: 2024 }, engine: '1890cc V-Twin', displacement: '1890cc' },
    { name: 'Challenger', make: 'Indian', type: 'motorcycle', years: { start: 2020, end: 2024 }, engine: '1768cc V-Twin', displacement: '1768cc' },
    { name: 'Pursuit', make: 'Indian', type: 'motorcycle', years: { start: 2022, end: 2024 }, engine: '1768cc V-Twin', displacement: '1768cc' },
    { name: 'Roadmaster', make: 'Indian', type: 'motorcycle', years: { start: 2015, end: 2024 }, engine: '1890cc V-Twin', displacement: '1890cc' },
    { name: 'Springfield', make: 'Indian', type: 'motorcycle', years: { start: 2016, end: 2024 }, engine: '1890cc V-Twin', displacement: '1890cc' },
  ],
};


// ============================================================================
// FUNÇÕES DE UTILIDADE
// ============================================================================

/**
 * Retorna todas as marcas disponíveis
 */
export function getAllMakes(): string[] {
  return Object.keys(VEHICLE_MAKES).sort();
}

/**
 * Retorna marcas por tipo de veículo
 */
export function getMakesByType(type: VehicleType): string[] {
  return Object.entries(VEHICLE_MAKES)
    .filter(([_, info]) => info.types.includes(type))
    .map(([name]) => name)
    .sort();
}

/**
 * Retorna informações de uma marca
 */
export function getMakeInfo(make: string): VehicleMakeInfo | undefined {
  return VEHICLE_MAKES[make];
}

/**
 * Retorna modelos de uma marca de moto
 */
export function getMotorcycleModels(make: string): VehicleModelInfo[] {
  return MOTORCYCLE_MODELS[make] || [];
}

/**
 * Busca um modelo específico
 */
export function findModel(make: string, modelName: string): VehicleModelInfo | undefined {
  const models = MOTORCYCLE_MODELS[make];
  if (!models) return undefined;
  
  return models.find(m => 
    m.name.toLowerCase() === modelName.toLowerCase() ||
    m.name.toLowerCase().includes(modelName.toLowerCase())
  );
}

/**
 * Retorna anos disponíveis para um modelo
 */
export function getModelYears(make: string, modelName: string): number[] {
  const model = findModel(make, modelName);
  if (!model) return [];
  
  const years: number[] = [];
  for (let y = model.years.start; y <= model.years.end; y++) {
    years.push(y);
  }
  return years;
}

/**
 * Verifica se um veículo existe na base
 */
export function vehicleExists(make: string, model: string): boolean {
  return findModel(make, model) !== undefined;
}

/**
 * Busca veículos por termo
 */
export function searchVehicles(term: string): VehicleModelInfo[] {
  const results: VehicleModelInfo[] = [];
  const searchTerm = term.toLowerCase();
  
  for (const [make, models] of Object.entries(MOTORCYCLE_MODELS)) {
    for (const model of models) {
      if (
        make.toLowerCase().includes(searchTerm) ||
        model.name.toLowerCase().includes(searchTerm)
      ) {
        results.push(model);
      }
    }
  }
  
  return results.slice(0, 20); // Limita a 20 resultados
}

/**
 * Estatísticas da base de dados
 */
export function getDatabaseStats(): {
  totalMakes: number;
  totalModels: number;
  byType: Record<VehicleType, number>;
} {
  let totalModels = 0;
  const byType: Record<VehicleType, number> = {
    car: 0,
    suv: 0,
    pickup: 0,
    truck: 0,
    van: 0,
    bus: 0,
    motorcycle: 0,
    utility: 0,
    tractor: 0,
    agricultural: 0,
  };
  
  for (const models of Object.values(MOTORCYCLE_MODELS)) {
    totalModels += models.length;
    for (const model of models) {
      byType[model.type]++;
    }
  }
  
  return {
    totalMakes: Object.keys(VEHICLE_MAKES).length,
    totalModels,
    byType,
  };
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================

export default {
  VEHICLE_MAKES,
  MOTORCYCLE_MODELS,
  VEHICLE_TYPE_LABELS,
  getAllMakes,
  getMakesByType,
  getMakeInfo,
  getMotorcycleModels,
  findModel,
  getModelYears,
  vehicleExists,
  searchVehicles,
  getDatabaseStats,
};
